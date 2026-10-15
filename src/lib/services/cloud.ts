// Cuentas y espacio de trabajo en el servidor (Supabase), con llamadas directas a su API (sin librerías).
// Sin PROPO_SUPABASE_URL / PROPO_SUPABASE_KEY en la compilación, PROPO funciona como antes: todo en el navegador.
//  · Cuentas: registro con confirmación por email, inicio de sesión, recuperar contraseña (Supabase Auth).
//  · Trabajo: el estado de la app se guarda entero en la tabla `workspaces` (una fila por usuario, protegida con RLS).
//    Se guarda unos segundos después de cada cambio; al volver a la pestaña se trae lo de otro dispositivo si es más nuevo.

const BASE = String(process.env.PROPO_SUPABASE_URL || '').replace(/\/+$/, '');
const KEY = String(process.env.PROPO_SUPABASE_KEY || '');
export const cloudEnabled = !!BASE && !!KEY;

const SESSION = 'propo:session';
const SYNC = 'propo:sync';          // { version: última versión guardada en el servidor, dirty: hay cambios sin subir }

export interface Session { access_token: string; refresh_token: string; expires_at: number; user: { id: string; email: string; meta: Record<string, string> } }
export class CloudError extends Error { constructor(public code: string, msg?: string) { super(msg || code); } }

const readLS = <T,>(k: string): T | null => { try { const s = localStorage.getItem(k); return s ? (JSON.parse(s) as T) : null; } catch { return null; } };
const writeLS = (k: string, v: unknown) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

let session: Session | null = readLS<Session>(SESSION);
function keep(s: Session | null) { session = s; writeLS(SESSION, s); }
export const currentSession = () => session;
/** Pase de sesión en vigor (lo renueva si hace falta), para el servidor de IA. */
export async function accessToken() { return (await fresh())?.access_token ?? null; }
/** Otra pestaña de este navegador ha abierto sesión (p. ej. el enlace del correo): se recoge aquí también. */
export function reloadSession() { session = readLS<Session>(SESSION); return session; }

const toSession = (j: any): Session => ({
  access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (Number(j.expires_in) || 3600),
  user: { id: j.user?.id, email: j.user?.email, meta: j.user?.user_metadata || {} },
});

async function call(path: string, init: RequestInit & { auth?: boolean } = {}) {
  const headers: Record<string, string> = { apikey: KEY, 'Content-Type': 'application/json', ...((init.headers as Record<string, string>) || {}) };
  if (init.auth) {
    const s = await fresh();
    if (!s) throw new CloudError('no_session');
    headers.Authorization = `Bearer ${s.access_token}`;
  }
  let res: Response;
  try { res = await fetch(BASE + path, { ...init, headers }); } catch { throw new CloudError('network'); }
  const text = await res.text();
  let j: any = null; try { j = text ? JSON.parse(text) : null; } catch { /* sin cuerpo */ }
  if (!res.ok) throw new CloudError(String(j?.error_code || j?.code || j?.error || (res.status === 429 ? 'over_request_rate_limit' : res.status)), j?.msg || j?.message || j?.error_description);
  return j;
}

/** Sesión con el pase en vigor (lo renueva si está a punto de caducar). */
let renewing: Promise<Session | null> | null = null;
async function fresh(): Promise<Session | null> {
  if (!session) return null;
  if (session.expires_at - 60 > Date.now() / 1000) return session;
  renewing ??= (async () => {
    try {
      const r = await fetch(`${BASE}/auth/v1/token?grant_type=refresh_token`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: session!.refresh_token }) });
      if (r.status >= 400 && r.status < 500) { keep(null); return null; }          // el pase ya no vale: hay que volver a entrar
      if (!r.ok) return session;                                                    // fallo pasajero: se reintenta en la próxima llamada
      const s = toSession(await r.json()); keep(s); return s;
    } catch { return session; } finally { renewing = null; }
  })();
  return renewing;
}

const site = () => `${location.origin}/`;
const redirect = () => `?redirect_to=${encodeURIComponent(site())}`;

// ── Cuentas ─────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Crea la cuenta. Devuelve si ya ha entrado (sin confirmación) o si tiene que confirmar el email. */
export async function signUp(email: string, password: string, meta: Record<string, string>) {
  const j = await call(`/auth/v1/signup${redirect()}`, { method: 'POST', body: JSON.stringify({ email, password, data: meta }) });
  if (j?.access_token) { keep(toSession(j)); return { confirmed: true }; }
  return { confirmed: false };
}
export async function resendConfirmation(email: string) {
  await call(`/auth/v1/resend${redirect()}`, { method: 'POST', body: JSON.stringify({ type: 'signup', email }) });
}
export async function signIn(email: string, password: string) {
  const j = await call('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
  keep(toSession(j));
}
export async function recover(email: string) {
  await call(`/auth/v1/recover${redirect()}`, { method: 'POST', body: JSON.stringify({ email }) });
}
export async function updatePassword(password: string) {
  await call('/auth/v1/user', { method: 'PUT', auth: true, body: JSON.stringify({ password }) });
}
export async function signOut() {
  try { await call('/auth/v1/logout', { method: 'POST', auth: true }); } catch { /* se cierra igualmente en este navegador */ }
  keep(null); writeLS(SYNC, null);
}

/** Los enlaces de los correos (confirmar cuenta, cambiar contraseña) vuelven a la web con el pase en la dirección. */
export async function consumeLink(): Promise<{ type?: string; error?: string } | null> {
  const h = location.hash.replace(/^#/, '');
  if (!/(^|&)(access_token|error_code|error)=/.test(h)) return null;
  const q = new URLSearchParams(h);
  try { history.replaceState(null, '', location.pathname + location.search + '#/'); } catch { /* nada */ }
  if (q.get('error') || q.get('error_code')) return { error: q.get('error_code') || q.get('error') || 'link' };
  const token = q.get('access_token');
  if (!token) return null;
  let user: any;
  try {
    const r = await fetch(`${BASE}/auth/v1/user`, { headers: { apikey: KEY, Authorization: `Bearer ${token}` } });
    if (!r.ok) return { error: 'link' };
    user = await r.json();
  } catch { return { error: 'network' }; }
  keep(toSession({ access_token: token, refresh_token: q.get('refresh_token'), expires_in: q.get('expires_in'), user }));
  return { type: q.get('type') || 'signup' };
}

// ── Espacio de trabajo ──────────────────────────────────────────────────────────────────────────────────────────────

export async function loadWorkspace(): Promise<{ data: any; version: number } | null> {
  if (!session) return null;
  const rows = await call(`/rest/v1/workspaces?select=data,version&user_id=eq.${session.user.id}`, { auth: true });
  return rows?.[0] ? { data: rows[0].data, version: Number(rows[0].version) || 0 } : null;
}
async function saveWorkspace(data: unknown, version: number) {
  if (!session) throw new CloudError('no_session');
  await call('/rest/v1/workspaces?on_conflict=user_id', {
    method: 'POST', auth: true, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: session.user.id, data, version, updated_at: new Date().toISOString() }),
  });
}
export async function deleteWorkspace() {
  if (!session) return;
  await call(`/rest/v1/workspaces?user_id=eq.${session.user.id}`, { method: 'DELETE', auth: true });
}

// ── Guardado automático ─────────────────────────────────────────────────────────────────────────────────────────────

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';
let status: SyncStatus = 'idle';
const listeners = new Set<() => void>();
const setStatus = (s: SyncStatus) => { status = s; listeners.forEach((f) => f()); };
export const syncStatus = () => status;
export const onSync = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f); }; };

const sync = () => readLS<{ version: number; dirty: boolean }>(SYNC) ?? { version: 0, dirty: false };
export const syncedVersion = () => sync().version;
export const hasUnsaved = () => sync().dirty;
export function markSynced(version: number) { writeLS(SYNC, { version, dirty: false }); }

let pending: unknown = null;
let timer: number | undefined;
let busy = false;

/** Se llama en cada cambio: se guarda en el servidor un momento después (si llegan más cambios, se agrupan). */
export function scheduleSave(data: unknown) {
  if (!session) return;
  pending = data;
  writeLS(SYNC, { ...sync(), dirty: true });
  window.clearTimeout(timer);
  timer = window.setTimeout(flush, 1500);
}

export async function flush(): Promise<boolean> {
  window.clearTimeout(timer);
  if (busy || pending == null || !session) return pending == null;
  const data = pending; pending = null; busy = true;
  const next = sync().version + 1;
  setStatus('saving');
  try {
    await saveWorkspace(data, next);
    if (pending == null) markSynced(next); else writeLS(SYNC, { version: next, dirty: true });
    setStatus('saved');
    return true;
  } catch (e) {
    pending ??= data;
    setStatus(e instanceof CloudError && e.code === 'network' ? 'offline' : 'error');
    timer = window.setTimeout(flush, 15000);                                       // se reintenta solo
    return false;
  } finally {
    busy = false;
    if (pending != null && status === 'saved') timer = window.setTimeout(flush, 1500);
  }
}

if (cloudEnabled) {
  try {
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
    window.addEventListener('pagehide', () => { flush(); });
  } catch { /* sin documento */ }
}

/** Mensaje claro para cada error de cuentas. */
export function cloudMessage(e: unknown): string {
  const c = e instanceof CloudError ? e.code : '';
  if (c === 'network') return 'No hay conexión con el servidor. Comprueba tu internet e inténtalo de nuevo.';
  if (/invalid_credentials|invalid_grant/.test(c)) return 'El email o la contraseña no son correctos.';
  if (c === 'email_not_confirmed') return 'Todavía no has confirmado tu email. Busca el correo de PROPO (mira también en spam) y pulsa el enlace.';
  if (c === 'user_already_exists' || c === 'email_exists') return 'Ya hay una cuenta con este email. Inicia sesión.';
  if (c === 'weak_password') return 'La contraseña es demasiado débil. Usa al menos 8 caracteres mezclando letras y números.';
  if (c === 'same_password') return 'La contraseña nueva tiene que ser distinta de la anterior.';
  if (/rate_limit/.test(c)) return 'Hemos enviado demasiados correos seguidos. Espera unos minutos y vuelve a intentarlo.';
  if (c === 'no_session') return 'Tu sesión ha caducado. Vuelve a iniciar sesión.';
  return 'No se ha podido completar. Inténtalo de nuevo en un momento.';
}

// ── Archivos (Supabase Storage): textos de los pliegos y documentos originales ─────────────────────────────────────
// Cubo privado `workspace`; cada usuario solo puede tocar su carpeta (la primera parte de la ruta es su id).

const BUCKET = 'workspace';
const clean = (p: string) => p.replace(/:/g, '__');
const enc = (p: string) => clean(p).split('/').map(encodeURIComponent).join('/');

async function storage(method: string, path: string, init: { body?: BodyInit; type?: string; json?: unknown } = {}) {
  const s = await fresh();
  if (!s) throw new CloudError('no_session');
  const headers: Record<string, string> = { apikey: KEY, Authorization: `Bearer ${s.access_token}` };
  let body = init.body;
  if (init.json !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(init.json); }
  else if (init.type) { headers['Content-Type'] = init.type; headers['x-upsert'] = 'true'; }
  try { return await fetch(`${BASE}/storage/v1/${path}`, { method, headers, body }); } catch { throw new CloudError('network'); }
}

/** Sube (o sustituye) un archivo de la carpeta del usuario. */
export async function putObject(path: string, body: BodyInit, type: string) {
  if (!session) throw new CloudError('no_session');
  const r = await storage('POST', `object/${BUCKET}/${enc(`${session.user.id}/${path}`)}`, { body, type });
  if (!r.ok) throw new CloudError(`storage_${r.status}`);
}
/** Descarga un archivo de la carpeta del usuario; `null` si no está. */
export async function getObject(path: string): Promise<Response | null> {
  if (!session) return null;
  const r = await storage('GET', `object/authenticated/${BUCKET}/${enc(`${session.user.id}/${path}`)}`);
  return r.ok ? r : null;
}
export async function removeObjects(paths: string[]) {
  if (!session || !paths.length) return;
  await storage('DELETE', `object/${BUCKET}`, { json: { prefixes: paths.map((p) => clean(`${session!.user.id}/${p}`)) } });
}
/** Borra todos los archivos del usuario (al eliminar la cuenta). */
export async function removeAllObjects() {
  if (!session) return;
  for (const folder of ['pages', 'files']) {
    for (let i = 0; i < 50; i++) {
      const r = await storage('POST', `object/list/${BUCKET}`, { json: { prefix: `${session.user.id}/${folder}`, limit: 1000, offset: 0 } });
      const items: { name: string }[] = r.ok ? await r.json() : [];
      if (!items.length) break;
      await storage('DELETE', `object/${BUCKET}`, { json: { prefixes: items.map((x) => `${session!.user.id}/${folder}/${x.name}`) } });
    }
  }
}
