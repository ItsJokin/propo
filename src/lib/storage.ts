// Browser persistence for the MVP.
//  - App state (metadata) -> localStorage
//  - Extracted page texts  -> IndexedDB (can be several MB per tender)
// Production equivalent: Postgres (metadata, RLS per workspace) + Supabase Storage/S3
// (original files, encrypted at rest, signed URLs) + document_chunks with pgvector.

import * as cloud from './services/cloud';

const LS_KEY = 'propo:state:v1';
const DB_NAME = 'propo';
const STORE = 'pages';

const memoryPages = new Map<string, string[]>();

// ── Copia en el servidor (cuentas de Supabase) ──────────────────────────────────────────────────────────────────────
// Los textos de los pliegos y los archivos originales se guardan también en Supabase Storage, para tenerlos en cualquier
// dispositivo. Se suben en segundo plano; lo que no se pudo subir se reintenta al volver a abrir la web.
let cloudFiles = false;
/** Lo activa el estado de la app: solo para cuentas del servidor y nunca para la demo. */
export function setCloudFiles(on: boolean) { cloudFiles = on; }
const UPLOADED = 'propo:uploaded';
const uploadedSet = (): Set<string> => { try { return new Set(JSON.parse(localStorage.getItem(UPLOADED) || '[]')); } catch { return new Set(); } };
function markUploaded(id: string) { const s = uploadedSet(); s.add(id); try { localStorage.setItem(UPLOADED, JSON.stringify([...s].slice(-5000))); } catch { /* lleno */ } }
const remotePages = (key: string) => `pages/${key}.json`;
const remoteFile = (key: string) => `files/${key}`;

async function upload(kind: 'pages' | 'file', key: string, data: string[] | ArrayBuffer) {
  if (!cloudFiles || !cloud.currentSession()) return;
  try {
    if (kind === 'pages') await cloud.putObject(remotePages(key), JSON.stringify(data), 'application/json');
    else await cloud.putObject(remoteFile(key), data as ArrayBuffer, 'application/octet-stream');
    markUploaded(`${kind}:${key}`);
  } catch { /* se reintenta en syncFiles */ }
}

/** Sube lo que falte de estos documentos (los de antes de tener cuenta o los que fallaron al subir). */
export async function syncFiles(keys: string[]) {
  if (!cloudFiles || !cloud.currentSession()) return;
  const done = uploadedSet();
  for (const key of keys) {
    if (!done.has(`pages:${key}`)) { const p = await localPages(key); if (p) await upload('pages', key, p); }
    if (!done.has(`file:${key}`)) { const f = await localFile(key); if (f) await upload('file', key, f); }
  }
}

export function loadState<T>(): T | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}

let saveTimer: number | undefined;
export function saveState(state: unknown) {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* storage unavailable or full: keep in memory */ }
  }, 250);
}

export function clearState() {
  try { localStorage.removeItem(UPLOADED); } catch { /* ignore */ }
  try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  memoryPages.clear();
  try { indexedDB.deleteDatabase(DB_NAME); } catch { /* ignore */ }
}

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
}

export async function putPages(key: string, pages: string[], fromCloud = false) {
  memoryPages.set(key, pages);
  if (!fromCloud) void upload('pages', key, pages);
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((res) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(pages, key);
      tx.oncomplete = () => res(); tx.onerror = () => res();
    } catch { res(); }
  });
}

async function localPages(key: string): Promise<string[] | null> {
  if (memoryPages.has(key)) return memoryPages.get(key)!;
  const db = await openDb();
  if (!db) return null;
  return new Promise((res) => {
    try {
      const tx = db.transaction(STORE, 'readonly');
      const r = tx.objectStore(STORE).get(key);
      r.onsuccess = () => { if (r.result) memoryPages.set(key, r.result); res(r.result ?? null); };
      r.onerror = () => res(null);
    } catch { res(null); }
  });
}

/** Textos de un documento: de este navegador o, si no están, del servidor. */
export async function getPages(key: string): Promise<string[] | null> {
  const here = await localPages(key);
  if (here || !cloudFiles) return here;
  try {
    const r = await cloud.getObject(remotePages(key));
    if (!r) return null;
    const pages = (await r.json()) as string[];
    await putPages(key, pages, true); markUploaded(`pages:${key}`);
    return pages;
  } catch { return null; }
}

export async function deletePages(key: string) {
  memoryPages.delete(key);
  if (cloudFiles) cloud.removeObjects([remotePages(key), remoteFile(key)]).catch(() => { /* sin conexión */ });
  const db = await openDb();
  if (!db) return;
  try { db.transaction(STORE, 'readwrite').objectStore(STORE).delete(key); } catch { /* ignore */ }
}

// Original file bytes (vault documents and tender files), so they can be attached to the
// submission package. Production: Supabase Storage / S3, private bucket, signed URLs.
export async function putFile(key: string, data: ArrayBuffer, fromCloud = false) {
  if (!fromCloud) void upload('file', key, data);
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((res) => {
    try { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(data, 'file:' + key); tx.oncomplete = () => res(); tx.onerror = () => res(); } catch { res(); }
  });
}

/** Borra un archivo original (aquí y en el servidor). */
export async function deleteFile(key: string) {
  if (cloudFiles) cloud.removeObjects([remoteFile(key)]).catch(() => { /* sin conexión */ });
  const db = await openDb();
  if (!db) return;
  try { db.transaction(STORE, 'readwrite').objectStore(STORE).delete('file:' + key); } catch { /* ignore */ }
}

/** Archivo original: de este navegador o, si no está, del servidor. */
export async function getFile(key: string): Promise<ArrayBuffer | null> {
  const here = await localFile(key);
  if (here || !cloudFiles) return here;
  try {
    const r = await cloud.getObject(remoteFile(key));
    if (!r) return null;
    const buf = await r.arrayBuffer();
    await putFile(key, buf, true); markUploaded(`file:${key}`);
    return buf;
  } catch { return null; }
}

async function localFile(key: string): Promise<ArrayBuffer | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((res) => {
    try { const r = db.transaction(STORE, 'readonly').objectStore(STORE).get('file:' + key); r.onsuccess = () => res(r.result ?? null); r.onerror = () => res(null); } catch { res(null); }
  });
}
