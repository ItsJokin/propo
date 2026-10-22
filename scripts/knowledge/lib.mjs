// Base de conocimiento de PROPO: piezas comunes del catálogo de expedientes adjudicados y sus documentos de evaluación.
// Solo fuentes oficiales españolas (Plataforma de Contratación del Sector Público y plataformas autonómicas agregadas).
// Todo lo descargado se trata como datos no confiables: nunca se ejecuta ni se obedece lo que diga un documento.
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';
import { tag, all, parseEntry } from '../lib/codice.mjs';

/** Tipos de «documento general» de la Plataforma (lista GeneralContractDocuments-2.08). */
export const DOC_TYPES = {
  '1': 'actos_publicos', '2': 'composicion_mesa', '4': 'suspension', '5': 'levantamiento_suspension',
  '8': 'acuerdo_inicio', '9': 'memoria_justificativa', '10': 'insuficiencia_medios', '11': 'aprobacion_expediente',
  '12': 'acta_mesa', '13': 'informe_valoracion', '14': 'informe_anormalidad', 'ZZZ': 'otro',
};
/** Lo que más enseña sobre por qué gana una oferta, por orden de prioridad de descarga. */
export const PRIORITY = { informe_valoracion: 1, informe_anormalidad: 3, acta_mesa: 4, acta_adjudicacion: 5 };
const EVAL_NAME = /valoraci[oó]n|informe t[eé]cnico|puntuaci[oó]n|baremaci[oó]n|juicio de valor|propuesta de adjudicaci[oó]n/i;

const dec = (s) => String(s ?? '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").trim();

/** Documentos de evaluación de una entrada (informes, actas…), con su tipo oficial. */
export function evalDocs(entryXml) {
  const out = [];
  for (const g of all(entryXml, 'cac-place-ext:GeneralDocument')) {
    const code = (g.match(/GeneralContractDocuments[^>]*>([^<]*)</) || [])[1]?.trim() || '';
    const uri = dec(tag(g, 'cbc:URI'));
    if (!uri) continue;
    const name = dec(tag(g, 'cbc:FileName')).slice(0, 160);
    let type = DOC_TYPES[code] || 'otro';
    if (type === 'otro' && EVAL_NAME.test(name)) type = 'informe_valoracion_libre';
    if (!/^(informe_valoracion|informe_valoracion_libre|informe_anormalidad|acta_mesa)$/.test(type)) continue;
    out.push({ id: dec(tag(g, 'cbc:ID')).slice(0, 80) || hash(uri).slice(0, 24), type, name, uri });
  }
  // Actas de adjudicación (otra lista de tipos).
  for (const m of entryXml.matchAll(/<cbc:DocumentTypeCode[^>]*>ACTA_ADJ<\/cbc:DocumentTypeCode>[\s\S]{0,800}?<cbc:URI>([^<]*)<\/cbc:URI>/g)) {
    const uri = dec(m[1]);
    out.push({ id: hash(uri).slice(0, 24), type: 'acta_adjudicacion', name: 'Acta de adjudicación', uri });
  }
  const seen = new Set();
  return out.filter((d) => (seen.has(d.uri) ? false : (seen.add(d.uri), true)));
}

/** País del órgano de contratación (dirección postal del perfil). */
export function buyerCountry(entryXml) {
  const party = tag(tag(entryXml, 'cac-place-ext:LocatedContractingParty'), 'cac:Party');
  return (tag(tag(party, 'cac:Country'), 'cbc:IdentificationCode') || '').replace(/<[^>]+>/g, '').trim().toUpperCase();
}

/**
 * Filtro geográfico obligatorio. La Plataforma y las plataformas agregadas solo publican perfiles del sector público
 * español; aun así se exige que el órgano tenga dirección en España o, si no consta, una región NUTS española.
 * Los órganos españoles con sede fuera (embajadas, consulados, institutos en el exterior) se admiten y se marcan.
 */
export function spainCheck(entryXml, p) {
  const country = buyerCountry(entryXml);
  if (country === 'ES') return { ok: true, scope: 'es' };
  if (!country && (!p.nuts || /^ES/.test(p.nuts))) return { ok: true, scope: 'es_sin_pais' };
  if (country && /embajada|consulado|instituto cervantes|oficina econ[oó]mica|representaci[oó]n permanente|ministerio|agencia espa[nñ]ola/i.test(p.buyer)) return { ok: true, scope: 'es_exterior' };
  return { ok: false, scope: country || p.nuts || '?' };
}

/** Registro del catálogo maestro: un expediente adjudicado con sus lotes, criterios y documentos de evaluación. */
export function catalogRecord(entryXml, prefix) {
  const p = parseEntry(entryXml);
  if (!p.id || !p.updated) return null;
  const awarded = p.results.filter((r) => r.winner && r.winner.name && ['2', '8', '9'].includes(r.code));
  if (!awarded.length && !/^(ADJ|RES)$/.test(p.status)) return null;
  const docs = evalDocs(entryXml);
  const geo = spainCheck(entryXml, p);
  return {
    id: `${prefix}:${p.id}`, ref: p.ref, updated: p.updated, status: p.status, title: p.title, buyer: p.buyer, nuts: p.nuts,
    cpv: p.cpv, nature: p.nature, proc: p.proc, budget: p.budget, estimated: p.estimated, dur: p.dur, url: p.url,
    crit: p.crit, lots: p.lots,
    results: awarded.map((r) => ({ lot: r.lot, date: r.date, offers: r.offers, amount: r.amount, low: r.low, high: r.high, winner: r.winner.name, winnerId: r.winner.id, sme: r.winner.sme })),
    docs, geo,
  };
}

/** Clase de aprendizaje del expediente (A–F del plan): se recalcula cuando llegan textos y extracciones. */
export function learningClass(rec, state) {
  const has = (t) => rec.docs.some((d) => d.type === t || (t === 'informe_valoracion' && d.type === 'informe_valoracion_libre'));
  const scored = rec.docs.some((d) => state?.extracted?.[d.id]?.scores);
  if (!rec.results.length) return /^(ADJ|RES)$/.test(rec.status) ? 'D' : 'F';
  if (scored) return 'B';
  if (has('informe_valoracion') || has('acta_mesa')) return 'C';
  return 'D';
}

export const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
export function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  const raw = file.endsWith('.gz') ? zlib.gunzipSync(fs.readFileSync(file)).toString('utf8') : fs.readFileSync(file, 'utf8');
  return raw.split('\n').filter(Boolean).map((l) => JSON.parse(l));
}
export function writeJsonl(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const body = rows.map((r) => JSON.stringify(r)).join('\n') + '\n';
  fs.writeFileSync(file, file.endsWith('.gz') ? zlib.gzipSync(body) : body);
}
export function readJson(file, fallback) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
export function writeJson(file, v) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(v, null, 1)); }
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const UA = 'PROPO-conocimiento/1.0 (datos abiertos de contratación pública; contacto: hola@propo.es)';
