// Fichas de empresa por NIF, para que el cliente rellene su empresa poniendo solo el NIF:
//   · de las adjudicaciones: nombre legal, si es pyme, contratos ganados, sectores (CPV), organismos y zonas;
//   · del BORME (Boletín Oficial del Registro Mercantil, datos abiertos del BOE): domicilio social, objeto social,
//     capital, constitución y si está disuelta o extinguida. Solo datos de la sociedad: los nombres de
//     administradores y apoderados son datos de personas y no se guardan.
// El BORME no se puede consultar por empresa: el robot lee los boletines diarios (hacia delante y, poco a poco, los
// de años anteriores) y se queda solo con las sociedades que aparecen como adjudicatarias.
//
//   data/_borme.json          { v, names: {nombre: nif}, recs: {nif: Borme}, cursor }   (interno, no se publica)
//   data/empresas/<nn>.json   { nif: Empresa }   nn = dos cifras del NIF (publicado)
import fs from 'fs';
import path from 'path';
import { A, W, PERSON, awardUrl } from '../../shared/schema.mjs';

const UA = 'PROPO-data-bot/1.0 (+https://propo.es; datos abiertos del BOE)';
const NIF = /^[A-HJNP-SUVW]\d{7}[0-9A-J]$/;
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const writeJson = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v)); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const shardOf = (nif) => nif.slice(-3, -1);

// Nombre sin forma societaria ni acentos: «Construcciones Pérez, S.L.U.» = «CONSTRUCCIONES PEREZ SOCIEDAD LIMITADA».
const FORMS = /\s(sociedad (limitada|anonima)( (laboral|profesional|unipersonal|nueva empresa|deportiva))*|sociedad cooperativa( [a-z ]+)?|s ?coop( [a-z ]+)?|s ?l ?(u|l|p|n ?e)?|s ?a ?(u|l|d)?|sl[ulp]?|sa[uld]?|en liquidacion|extinguida)$/;
export function bareName(s) {
  let n = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9ñ]+/g, ' ').replace(/\s+/g, ' ').trim();
  for (let i = 0; i < 3; i++) { const m = n.replace(FORMS, '').trim(); if (m === n) break; n = m; }
  return n;
}

// ── BORME ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const ACTS = ['Constitución', 'Nombramientos', 'Ceses/Dimisiones', 'Revocaciones', 'Reelecciones', 'Modificaciones estatutarias', 'Cambio de domicilio social', 'Cambio de objeto social', 'Ampliación del objeto social', 'Ampliación de capital', 'Reducción de capital', 'Cambio de denominación social', 'Disolución', 'Extinción', 'Fusión por absorción', 'Fusión por unión', 'Escisión parcial', 'Escisión total', 'Transformación de sociedad', 'Declaración de unipersonalidad', 'Pérdida del carácter de unipersonalidad', 'Sociedad unipersonal', 'Otros conceptos', 'Situación concursal', 'Datos registrales', 'Desembolso de dividendos pasivos', 'Reapertura hoja registral', 'Cierre provisional hoja registral por baja en el índice de Entidades Jurídicas', 'Cierre provisional de la hoja registral por revocación del NIF', 'Cierre provisional hoja registral art. 137.2 Ley 43/1995 Impuesto de Sociedades', 'Emisión de obligaciones', 'Primera inscripción (O.M. 10/6/1.997)', 'Modificación de poderes', 'Página web de la sociedad', 'Cambio de identidad del socio único', 'Socio único', 'Adaptación Ley 44/2015', 'Fe de erratas', 'Depósito de libros', 'Cancelaciones de oficio de nombramientos', 'Anotación preventiva. Demanda de impugnación de acuerdos sociales', 'Rectificación de datos registrales', 'Crédito incobrable', 'Acuerdo de ampliación de capital social sin ejecutar. Importe del acuerdo'];
const ACT_RE = new RegExp(`(?:^|\\.\\s+)(${ACTS.map((a) => a.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|')})\\.`, 'g');
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
const money = (s) => { const m = /([\d.]+,\d\d)\s*Euros/.exec(s || ''); return m ? Number(m[1].replace(/\./g, '').replace(',', '.')) : null; };

/** Anuncios de un boletín de la sección A en XML: [{ name, text }]. */
export function parseBormeXml(xml) {
  const out = []; const re = /<p class="articulo">([\s\S]*?)<\/p>\s*<p class="parrafo">([\s\S]*?)<\/p>/g; let m;
  while ((m = re.exec(xml))) out.push({ name: dec(m[1]).replace(/^\s*\d+\s*-\s*/, '').replace(/\.\s*$/, '').trim(), text: dec(m[2]).replace(/\s+/g, ' ').trim() });
  return out;
}

/** Hechos de la sociedad en un anuncio (sin nombres de personas). */
export function bormeFacts(text) {
  const parts = []; let m; const hits = [];
  ACT_RE.lastIndex = 0;
  while ((m = ACT_RE.exec(text))) hits.push({ act: m[1], start: m.index + m[0].length });
  hits.forEach((h, i) => parts.push([h.act, text.slice(h.start, i + 1 < hits.length ? hits[i + 1].start - hits[i + 1].act.length - 1 : text.length).trim().replace(/[.\s]+$/, '')]));
  const f = {};
  for (const [act, body] of parts) {
    if (act === 'Constitución') {
      f.con = true;
      const o = /Objeto social:\s*(.*?)\.\s*Domicilio:/s.exec(body); if (o) f.obj = o[1].trim();
      const d = /Domicilio:\s*(.*?)\.\s*Capital:/s.exec(body); if (d) f.dom = d[1].trim();
      const c = /Capital:\s*([\d.,]+\s*Euros)/.exec(body); if (c) f.cap = money(c[1]);
    } else if (act === 'Cambio de domicilio social') f.dom = body;
    else if (act === 'Cambio de objeto social') f.obj = body;
    else if (act === 'Ampliación del objeto social') f.objAdd = body;
    else if (act === 'Ampliación de capital' || act === 'Reducción de capital') { const r = /Resultante Suscrito:\s*([\d.,]+\s*Euros)/.exec(body); if (r) f.cap = money(r[1]); }
    else if (act === 'Página web de la sociedad') { const w = /([a-z0-9.-]+\.[a-z]{2,})(\/\S*)?/i.exec(body); if (w) f.web = w[0].toLowerCase(); }
    else if (act === 'Disolución') f.dis = true;
    else if (act === 'Extinción') f.ext = true;
    else if (act === 'Situación concursal') f.conc = true;
  }
  return f;
}

/** Une un anuncio a la ficha; cada dato guarda su fecha, así da igual el orden en que se lean los boletines. */
export function mergeFacts(rec, f, day, name) {
  const set = (k, v) => { if (v != null && v !== '' && (!rec[k] || rec[k][1] <= day)) rec[k] = [v, day]; };
  set('dom', f.dom); set('obj', f.obj); set('cap', f.cap); set('web', f.web);
  if (f.objAdd) { rec.add = [...(rec.add || []).filter((x) => x[0] !== f.objAdd), [f.objAdd, day]].sort((a, b) => b[1].localeCompare(a[1])).slice(0, 3); }
  if (f.con && (!rec.con || rec.con > day)) rec.con = day;
  if (f.dis && (!rec.dis || rec.dis < day)) rec.dis = day;
  if (f.ext && (!rec.ext || rec.ext < day)) rec.ext = day;
  if (f.conc && (!rec.conc || rec.conc < day)) rec.conc = day;
  if (!rec.n || (rec.at || '') <= day) { rec.n = name; rec.at = day; }
  return rec;
}

const dayStr = (d) => d.toISOString().slice(0, 10).replace(/-/g, '');
const addDays = (s, n) => { const d = new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return dayStr(d); };

async function get(url, as = 'text', tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: as === 'json' ? 'application/json' : 'application/xml' }, signal: AbortSignal.timeout(60000) });
      if (r.status === 404) return null;
      if (r.ok) return as === 'json' ? r.json() : r.text();
      last = new Error(`HTTP ${r.status}`);
    } catch (e) { last = e; }
    await sleep(2000 * (i + 1));
  }
  throw last;
}

/** Lee un día del BORME y une a las fichas los anuncios de sociedades conocidas. Devuelve cuántos anuncios encajan. */
async function readDay(day, b, log) {
  const j = await get(`https://www.boe.es/datosabiertos/api/borme/sumario/${day}`, 'json');
  const secs = j?.data?.sumario?.diario?.flatMap((d) => d.seccion ?? []) ?? [];
  const items = secs.filter((s) => s.codigo === 'A').flatMap((s) => [].concat(s.item ?? [])).map((it) => it.url_xml).filter(Boolean);
  let hits = 0;
  for (let i = 0; i < items.length; i += 4) {
    const xmls = await Promise.all(items.slice(i, i + 4).map((u) => get(u).catch(() => null)));
    for (const x of xmls) for (const e of x ? parseBormeXml(x) : []) {
      const nif = b.names[bareName(e.name)];
      if (!nif) continue;
      b.recs[nif] = mergeFacts(b.recs[nif] || {}, bormeFacts(e.text), day, e.name); hits++;
    }
    await sleep(250);
  }
  if (items.length) log(`  BORME ${day}: ${items.length} boletines · ${hits} anuncios de adjudicatarias`);
  return hits;
}

/** Avanza el BORME: primero los días nuevos y después, hacia atrás, hasta `years` años. */
export async function syncBorme(dir, { forwardDays = 5, backDays = 4, years = 3, log = console.log } = {}) {
  const file = path.join(dir, '_borme.json');
  const b = readJson(file, null) ?? { v: 1, names: {}, recs: {}, cursor: null };
  if (!Object.keys(b.names).length) { log('  BORME: aún no hay nombres de adjudicatarias'); return { ok: true, hits: 0 }; }
  const yesterday = addDays(dayStr(new Date()), -1);
  const floor = addDays(yesterday, -365 * years);
  const c = b.cursor ?? { fwd: addDays(yesterday, -1), back: yesterday };
  let hits = 0, read = 0;
  for (let n = 0; n < forwardDays && c.fwd < yesterday; n++) { const d = addDays(c.fwd, 1); hits += await readDay(d, b, log); c.fwd = d; read++; }
  for (let n = 0; n < backDays && c.back > floor; n++) { const d = addDays(c.back, -1); hits += await readDay(d, b, log); c.back = d; read++; }
  b.cursor = c; writeJson(file, b);
  return { ok: true, hits, read, from: c.back, to: c.fwd, companies: Object.keys(b.recs).length };
}

// ── Fichas publicadas ──────────────────────────────────────────────────────────────────────────────────────────────
const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

/** Recorre las adjudicaciones, actualiza los nombres que busca el BORME y escribe data/empresas/. */
export function buildCompanies(dir, { log = console.log } = {}) {
  const bfile = path.join(dir, '_borme.json');
  const b = readJson(bfile, null) ?? { v: 1, names: {}, recs: {}, cursor: null };
  const idx = readJson(path.join(dir, 'index.json'), { awards: {} });
  const co = new Map(); const names = new Map();
  for (const key of Object.keys(idx.awards)) {
    const p = readJson(path.join(dir, 'awards', `${key}.json`), null); if (!p) continue;
    for (const r of p.rows) for (const wi of r[A.winners] ?? []) {
      const w = p.winners[wi]; const nif = String(w?.[W.nif] || '').toUpperCase();
      if (!w || w[W.name] === PERSON || !NIF.test(nif)) continue;
      let c = co.get(nif);
      if (!c) { c = { n: w[W.name], s: -1, cpv: new Map(), buy: new Map(), nuts: new Map(), a: [] }; co.set(nif, c); }
      if (w[W.sme] !== -1) c.s = w[W.sme];
      const cpv4 = String(r[A.cpv] || '').slice(0, 4); if (cpv4) c.cpv.set(cpv4, (c.cpv.get(cpv4) || 0) + 1);
      const buyer = p.buyers[r[A.buyer]] || ''; if (buyer) c.buy.set(buyer, (c.buy.get(buyer) || 0) + 1);
      const nuts = String(r[A.nuts] || '').slice(0, 5); if (nuts.length > 2) c.nuts.set(nuts, (c.nuts.get(nuts) || 0) + 1);
      c.a.push([r[A.date], r[A.title], buyer, r[A.amount] || 0, r[A.offers] || 0, awardUrl(r[A.id], r[A.link]), r[A.cpv] || '']);
      const bn = bareName(w[W.name]);
      if (bn.length >= 4) names.set(bn, names.has(bn) && names.get(bn) !== nif ? null : nif);   // nombres repetidos con NIF distinto: ambiguos
    }
  }
  b.names = Object.fromEntries([...names].filter(([, v]) => v));
  writeJson(bfile, b);
  const shards = new Map();
  for (const [nif, c] of co) {
    const a = c.a.sort((x, y) => y[0].localeCompare(x[0]));
    const bo = b.recs[nif];
    const rec = { n: c.n, s: c.s, w: a.length, c: top(c.cpv, 8), b: top(c.buy, 5), z: top(c.nuts, 4), a: a.slice(0, 40) };
    if (bo) rec.bo = { n: bo.n, dom: bo.dom?.[0], obj: bo.obj?.[0], add: bo.add?.map((x) => x[0]), cap: bo.cap?.[0], web: bo.web?.[0], con: bo.con, dis: bo.dis, ext: bo.ext, conc: bo.conc, at: bo.at };
    const k = shardOf(nif); if (!shards.has(k)) shards.set(k, {}); shards.get(k)[nif] = rec;
  }
  fs.rmSync(path.join(dir, 'empresas'), { recursive: true, force: true });
  for (const [k, v] of shards) writeJson(path.join(dir, 'empresas', `${k}.json`), v);
  log(`Fichas de empresa: ${co.size} con NIF · ${Object.keys(b.recs).length} con datos del BORME · ${Object.keys(b.names).length} nombres buscados en el BORME`);
  return co.size;
}

/** Si se perdió la caché, recupera las fichas del BORME desde lo publicado (para no repetir años de lectura). */
export function bormeFromPublished(dir, shards) {
  const recs = {};
  for (const s of shards) for (const [nif, r] of Object.entries(s)) if (r.bo) {
    const d = r.bo.at || '';
    recs[nif] = { n: r.bo.n, at: d, dom: r.bo.dom ? [r.bo.dom, d] : undefined, obj: r.bo.obj ? [r.bo.obj, d] : undefined, cap: r.bo.cap != null ? [r.bo.cap, d] : undefined, web: r.bo.web ? [r.bo.web, d] : undefined, add: r.bo.add?.map((x) => [x, d]), con: r.bo.con, dis: r.bo.dis, ext: r.bo.ext, conc: r.bo.conc };
  }
  return recs;
}
