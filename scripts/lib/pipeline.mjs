// Pasos del robot: leer el feed de la Plataforma (incremental), TED (licitaciones abiertas y adjudicaciones)
// y cruzar duplicados. Cada fuente falla por separado: si una no responde, las demás siguen y la web lo indica.
import { T } from '../../shared/schema.mjs';
import { splitFeed, parseEntry, tenderRow, awardRows } from './codice.mjs';
import { tedSearch, tedTenderRow, tedAward, openTendersQuery, awardsQuery, TENDER_FIELDS, AWARD_FIELDS } from './ted.mjs';

export const FEEDS = {
  placsp: { prefix: 'p', label: 'Plataforma de Contratación del Sector Público', url: 'https://contrataciondelestado.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3.atom' },
  agregadas: { prefix: 'a', label: 'Plataformas autonómicas agregadas', url: 'https://contrataciondelestado.es/sindicacion/sindicacion_1044/PlataformasAgregadasSinMenores.atom' },
};
const UA = 'PROPO-data-bot/1.0 (+https://github.com; datos abiertos de contratación pública)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const today = () => new Date().toISOString().slice(0, 10);

async function getText(url, fetchImpl, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetchImpl(url, { headers: { 'User-Agent': UA, Accept: 'application/atom+xml, application/xml, */*' }, signal: AbortSignal.timeout(180000) });
      if (r.ok) return await r.text();
      last = new Error(`HTTP ${r.status}`);
      if (r.status === 404) break;
    } catch (e) { last = e; }
    await sleep(3000 * (i + 1));
  }
  throw last;
}

/** Aplica una entrada ya interpretada al almacén. */
export function applyEntry(store, p, prefix, day) {
  const id = `${prefix}:${p.id}`;
  const row = tenderRow(p, prefix, day);
  if (row) store.upsertTender(row); else store.removeTender(id);
  for (const a of awardRows(p, prefix)) store.upsertAward(a);
}

/**
 * Lee un feed desde el fichero más reciente hacia atrás hasta alcanzar lo ya procesado.
 * `maxFiles` limita el trabajo de una ejecución; `firstRunFiles` es cuánto histórico trae la primera vez.
 */
export async function syncFeed(store, name, { fetchImpl = fetch, maxFiles = 40, firstRunFiles = 20, log = console.log } = {}) {
  const feed = FEEDS[name]; const st = store.state.feeds[name] || {};
  const cursor = st.cursor || '';
  const limit = cursor ? maxFiles : firstRunFiles;
  const pending = []; let url = feed.url; let files = 0; let newest = cursor; let reached = false; let deleted = [];
  while (url && files < limit) {
    const xml = await getText(url, fetchImpl);
    const f = splitFeed(xml); files++;
    let older = 0;
    for (const e of f.entries) {
      const p = parseEntry(e);
      if (!p.id || !p.updated) continue;
      if (cursor && p.updated <= cursor) { older++; continue; }
      pending.push(p);
      if (p.updated > newest) newest = p.updated;
    }
    deleted.push(...f.deleted);
    log(`  ${name}: fichero ${files} — ${f.entries.length} entradas, ${f.entries.length - older} nuevas`);
    if (cursor && older > 0) { reached = true; break; }
    url = f.next;
  }
  const day = today();
  pending.sort((a, b) => a.updated.localeCompare(b.updated));
  for (const p of pending) applyEntry(store, p, feed.prefix, day);
  for (const id of deleted) store.removeTender(`${feed.prefix}:${id}`);
  store.state.feeds[name] = { cursor: newest, at: new Date().toISOString() };
  return { ok: true, at: new Date().toISOString(), files, entries: pending.length, gap: Boolean(cursor) && !reached && files >= limit, feedUpdatedTo: newest };
}

/** Sustituye las licitaciones abiertas de TED por la lista actual. */
export async function syncTedTenders(store, { fetchImpl = fetch, log = console.log } = {}) {
  const day = today();
  const notices = await tedSearch(openTendersQuery(day.replace(/-/g, '')), TENDER_FIELDS, { fetchImpl, log });
  const rows = notices.map((n) => tedTenderRow(n, day)).filter(Boolean);
  if (rows.length < 50) throw new Error(`TED devolvió solo ${rows.length} licitaciones; no se sustituye la lista`);
  store.replaceTenders('t:', rows);
  store.state.ted.tendersAt = new Date().toISOString();
  return { ok: true, at: store.state.ted.tendersAt, count: rows.length };
}

/** Adjudicaciones publicadas en TED entre dos fechas (AAAAMMDD). */
export async function syncTedAwards(store, from, to, { fetchImpl = fetch, log = console.log } = {}) {
  const notices = await tedSearch(awardsQuery(from, to), AWARD_FIELDS, { fetchImpl, log });
  let n = 0;
  for (const x of notices) { const a = tedAward(x); if (a) { store.upsertAward(a); n++; } }
  return n;
}

/**
 * Una licitación por encima del umbral europeo sale en TED y en la Plataforma. Nos quedamos con la fila de la
 * Plataforma (trae pliegos, criterios y presupuesto) y quitamos la de TED con el mismo n.º de expediente y órgano.
 */
export function dedupeTenders(store) {
  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const seen = new Set();
  for (const r of store.tenders.values()) if (!r[T.id].startsWith('t:') && r[T.ref] && norm(r[T.ref]).length >= 5) seen.add(norm(r[T.ref]) + '|' + r[T.deadline].slice(0, 10));
  let removed = 0;
  for (const [id, r] of store.tenders) if (id.startsWith('t:') && r[T.ref] && seen.has(norm(r[T.ref]) + '|' + r[T.deadline].slice(0, 10))) { store.tenders.delete(id); removed++; }
  if (removed) store.tendersChanged = true;
  return removed;
}

export const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, '');
export const monthsBack = (n) => { const d = new Date(); d.setUTCMonth(d.getUTCMonth() - n); return d.toISOString().slice(0, 10); };
