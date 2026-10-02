// Browser persistence for the MVP.
//  - App state (metadata) -> localStorage
//  - Extracted page texts  -> IndexedDB (can be several MB per tender)
// Production equivalent: Postgres (metadata, RLS per workspace) + Supabase Storage/S3
// (original files, encrypted at rest, signed URLs) + document_chunks with pgvector.

const LS_KEY = 'propo:state:v1';
const DB_NAME = 'propo';
const STORE = 'pages';

const memoryPages = new Map<string, string[]>();

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

export async function putPages(key: string, pages: string[]) {
  memoryPages.set(key, pages);
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

export async function getPages(key: string): Promise<string[] | null> {
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

export async function deletePages(key: string) {
  memoryPages.delete(key);
  const db = await openDb();
  if (!db) return;
  try { db.transaction(STORE, 'readwrite').objectStore(STORE).delete(key); } catch { /* ignore */ }
}

// Original file bytes (vault documents and tender files), so they can be attached to the
// submission package. Production: Supabase Storage / S3, private bucket, signed URLs.
export async function putFile(key: string, data: ArrayBuffer) {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((res) => {
    try { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(data, 'file:' + key); tx.oncomplete = () => res(); tx.onerror = () => res(); } catch { res(); }
  });
}

export async function getFile(key: string): Promise<ArrayBuffer | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((res) => {
    try { const r = db.transaction(STORE, 'readonly').objectStore(STORE).get('file:' + key); r.onsuccess = () => res(r.result ?? null); r.onerror = () => res(null); } catch { res(null); }
  });
}
