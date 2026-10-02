// Vista unificada de una licitación: resumen, documentos oficiales y ficha para el análisis.
// Si PROPO ha leído el pliego (tenderDocs.ts), usa ese resumen; si no, resume el anuncio oficial de
// TED (tedNotices.json) sin inventar nada: lo que el anuncio no publica se indica como tal.
import NOTICES from './tedNotices.json';
import { TENDER_BRIEFS, type TenderDoc } from './tenderDocs';
import { tedUrl, type TedNotice } from './tedSnapshot';
import { regionLabel } from './match';
import { eur } from '../plans';
import { daysUntil, fmtDate } from '../util';

interface Notice { p: string | null; v: number | null; d: string | null; s: string | null; e: string | null; dl: string | null; sub: string | null; docs: string[]; c: [string, string, number | null, string | null][]; sel: string[]; l?: [string, number | null][]; nl: number }
const N = NOTICES as unknown as Record<string, Notice>;

export interface Criterion { name: string; price: boolean; weight: number | null; unit: string | null }
export interface TenderView {
  depth: 'pliego' | 'anuncio';
  plain: string;
  facts: [string, string][];
  asks: string[];
  watch: string[];
  criteria: Criterion[];
  lots: { name: string; value: number | null }[];
  lotCount: number;
  docs: TenderDoc[];
  otherDocs: string[];
  officialPage: string | null;
  officialHost: string | null;
  submitUrl: string | null;
  tedUrl: string;
  /** Nombre de la fuente oficial del anuncio («TED», «la Plataforma de Contratación del Sector Público»…). */
  sourceName: string;
  readFrom: string;
  pcapPages?: number;
}

const host = (u: string | null) => { if (!u) return null; try { return new URL(/^https?:/.test(u) ? u : 'https://' + u).host.replace(/^www\./, ''); } catch { return null; } };
const fixUrl = (u: string | null) => (!u ? null : /^https?:/.test(u) ? u : 'https://' + u);
export function durationLabel(d: string | null, s?: string | null, e?: string | null) {
  if (d) {
    const [n, u] = d.split(' '); const k = Number(n);
    if (u === 'MONTH') return `${k} ${k === 1 ? 'mes' : 'meses'}`;
    if (u === 'YEAR') return `${k} ${k === 1 ? 'año' : 'años'}`;
    if (u === 'DAY') return `${k} días`;
    return d;
  }
  if (s && e) return `${fmtDate(s)} – ${fmtDate(e)}`;
  if (s) return `Desde el ${fmtDate(s)}`;
  return 'No publicada en el anuncio';
}
const PROC: Record<string, string> = { open: 'Abierto', restricted: 'Restringido', 'neg-w-call': 'Negociado con publicidad', 'comp-dial': 'Diálogo competitivo', oth: 'Otro' };
const SEL: [RegExp, string][] = [
  [/volumen de negocios|cifra anual de negocio/i, 'Acreditar un volumen anual de negocio mínimo (el importe exacto está en el pliego).'],
  [/trabajos realizados|referencias|servicios espec/i, 'Acreditar trabajos o servicios similares de los últimos años, con certificados de buena ejecución.'],
  [/seguro/i, 'Disponer de un seguro de responsabilidad o indemnización por riesgos profesionales.'],
  [/maquinaria|equipo t[ée]cnico/i, 'Acreditar la maquinaria y el equipo técnico disponibles para el contrato.'],
  [/t[ií]tulos/i, 'Acreditar la titulación de los responsables de la ejecución.'],
  [/medioambiental/i, 'Acreditar medidas de gestión medioambiental.'],
];

const SRC_NAME = { ted: 'TED', placsp: 'la Plataforma de Contratación del Sector Público', agregadas: 'la plataforma de contratación autonómica' } as const;
const isPrice = (name: string) => /precio|oferta econ|econ[oó]mic|importe|\bbaja\b|canon|tarifa|coste/i.test(name);
const monthsLabel = (m: number) => !m ? 'No publicada en el anuncio' : m >= 12 && Number.isInteger(m / 12) ? `${m / 12} ${m === 12 ? 'año' : 'años'}` : m < 1 ? `${Math.round(m * 30)} días` : `${String(m).replace('.', ',')} ${m === 1 ? 'mes' : 'meses'}`;
const GENERIC_REQ = /^(capacidad de obrar|no prohibici[oó]n (para|de) contratar|no estar incurso en incompatibilidades|cumplimiento con las obligaciones (tributarias|con la seguridad social)|estar prerregistrado en el rolece[^.]*)\.?$/i;

/** Vista de una licitación en vivo: solo con lo que publica la fuente oficial. */
function liveView(t: TedNotice): TenderView {
  const L = t.live!;
  const criteria: Criterion[] = L.crit.map(([, name, w]) => ({ name: name.replace(/[:.]+$/, ''), price: isPrice(name), weight: w || null, unit: w ? 'puntos' : null }));
  const docs: TenderDoc[] = L.docs.map(([name, url, kind]) => ({ name: name || 'Documento', url, kind: (kind === 'pcap' || kind === 'ppt' ? kind : 'otro') as TenderDoc['kind'] }));
  const nature = t.nature === 'services' ? 'servicios' : t.nature === 'supplies' ? 'suministro' : 'obras';
  const place = `${t.city !== 'No consta' ? t.city + ', ' : ''}${regionLabel(t.nuts)}`;
  const money = L.budget ? `Presupuesto base: ${eur(L.budget)} sin IVA.` : t.value ? `Valor estimado: ${eur(t.value)} sin IVA.` : 'El anuncio no publica el importe.';
  const plain = `${(t.desc || t.title).replace(/\.$/, '')}. Contrato de ${nature} de ${t.buyer} en ${place}${L.lots > 1 ? `, dividido en ${L.lots} lotes` : ''}. ${money} Duración: ${monthsLabel(L.dur).toLowerCase()}.`;
  const facts: [string, string][] = [];
  if (L.budget) facts.push(['Presupuesto base (sin IVA)', eur(L.budget)]);
  if (t.value && t.value !== L.budget) facts.push(['Valor estimado (sin IVA)', eur(t.value)]);
  if (!L.budget && !t.value) facts.push(['Importe', 'No publicado']);
  facts.push(['Duración', monthsLabel(L.dur)], ['Procedimiento', L.proc || 'No consta'], ['Fin de presentación', t.deadline ? `${fmtDate(t.deadline)}${t.deadline.length > 10 ? `, ${t.deadline.slice(11, 16)}` : ''}` : 'No consta']);
  if (L.ref) facts.push(['Expediente', L.ref]);
  if (L.lots > 1) facts.push(['Lotes', String(L.lots)]);
  const specific = L.reqs.filter((r) => !GENERIC_REQ.test(r.trim()));
  const asks = specific.map((r) => r.replace(/\s+/g, ' ').trim()).filter((x, i, a) => a.indexOf(x) === i);
  if (L.reqs.length > specific.length) asks.push('Capacidad de obrar, no estar en prohibición de contratar y estar al corriente con Hacienda y la Seguridad Social.');
  if (!asks.length) asks.push('El anuncio no detalla la solvencia exigida: está en el pliego de cláusulas administrativas.');
  const d = daysUntil(t.deadline) ?? -1;
  const price = criteria.filter((c) => c.price && c.weight != null).reduce((a, c) => a + c.weight!, 0);
  const total = criteria.reduce((a, c) => a + (c.weight ?? 0), 0);
  const watch: string[] = [];
  if (d >= 0 && d <= 7) watch.push(`Quedan ${d} días: poco margen para preparar la oferta.`);
  if (total > 0 && total <= 110 && price / total >= 0.6) watch.push(`El precio pesa ${Math.round((price / total) * 100)} % de la puntuación: la oferta económica decide casi todo.`);
  if (total > 0 && total <= 110 && price / total < 0.5 && criteria.some((c) => !c.price)) watch.push('La calidad técnica pesa más que el precio: la memoria técnica es clave.');
  if (!criteria.length) watch.push('El anuncio no publica los criterios de adjudicación: consúltalos en el pliego.');
  if (!L.budget && !t.value) watch.push('El anuncio no publica el importe: revisa el presupuesto en el pliego.');
  const pliegos = docs.filter((x) => x.kind !== 'otro');
  const page = L.src === 'ted' ? (docs[0]?.url ?? L.url) : L.url;
  return {
    depth: 'anuncio', plain, facts, asks, watch, criteria, lots: [], lotCount: L.lots || 1,
    docs: L.src === 'ted' ? [] : docs, otherDocs: [], officialPage: page, officialHost: host(page), submitUrl: null,
    tedUrl: L.url, sourceName: SRC_NAME[L.src],
    readFrom: L.src === 'ted' ? 'Anuncio oficial publicado en TED (formulario eForms)' : `Datos oficiales publicados en ${SRC_NAME[L.src]}${pliegos.length ? `, con enlace directo a ${pliegos.length === 1 ? 'su pliego' : 'sus pliegos'}` : ''}`,
  };
}

export function tenderView(t: TedNotice): TenderView {
  const n = N[t.id];
  const b = TENDER_BRIEFS[t.id];
  if (t.live && !b && !n) return liveView(t);
  const criteria: Criterion[] = b?.crit
    ? b.crit.map(([name, w, ty]) => ({ name, price: ty === 'p', weight: w, unit: 'puntos' }))
    : (n?.c ?? []).map(([ty, name, w, u]) => ({ name, price: ty === 'p', weight: w, unit: u === '%' ? '%' : u === 'pt' ? 'puntos' : null }));
  const lots = (n?.l ?? []).map(([name, value]) => ({ name, value }));
  const page = b?.page ?? fixUrl(n?.docs[0] ?? null);
  const common = { criteria, lots, lotCount: n?.nl ?? 1, officialPage: page, officialHost: host(page), submitUrl: fixUrl(n?.sub ?? null), tedUrl: tedUrl(t.id), sourceName: 'TED' };
  if (b) return { ...common, depth: 'pliego', plain: b.plain, facts: b.facts, asks: b.asks, watch: b.watch, docs: b.docs, otherDocs: b.otherDocs ?? [], readFrom: b.readFrom, pcapPages: b.pcapPages };

  // Resumen a partir del anuncio oficial de TED
  const nature = t.nature === 'services' ? 'servicios' : t.nature === 'supplies' ? 'suministro' : 'obras';
  const dur = durationLabel(n?.d ?? null, n?.s, n?.e);
  const value = n?.v ?? t.value;
  const plain = `${t.desc.replace(/\.$/, '')}. Contrato de ${nature} de ${t.buyer} en ${t.city !== 'No consta' ? t.city + ', ' : ''}${regionLabel(t.nuts)}` +
    `${n && n.nl > 1 ? `, dividido en ${n.nl} lotes` : ''}. ${value ? `Valor estimado: ${eur(value)} sin IVA.` : 'El anuncio no publica el importe.'} Duración: ${dur.toLowerCase()}.`;
  const price = criteria.filter((c) => c.price && c.weight != null).reduce((a, c) => Math.max(a, c.weight!), 0);
  const quality = criteria.filter((c) => !c.price && c.weight != null).reduce((a, c) => a + c.weight!, 0);
  const facts: [string, string][] = [
    ['Valor estimado (sin IVA)', value ? eur(value) : 'No publicado'],
    ['Duración', dur],
    ['Procedimiento', PROC[n?.p ?? ''] ?? 'No consta'],
    ['Fin de presentación', n?.dl ? `${fmtDate(n.dl)}, ${n.dl.slice(11, 16)}` : fmtDate(t.deadline)],
  ];
  if (n && n.nl > 1) facts.push(['Lotes', String(n.nl)]);
  const asks = (n?.sel ?? []).map((s) => SEL.find(([re]) => re.test(s))?.[1] ?? `Criterio de selección: ${s}.`).filter((x, i, a) => a.indexOf(x) === i);
  if (!asks.length) asks.push('El anuncio no detalla la solvencia exigida: está en el pliego de cláusulas administrativas.');
  const d = daysUntil(t.deadline) ?? -1;
  const watch: string[] = [];
  if (d >= 0 && d <= 7) watch.push(`Quedan ${d} días: poco margen para preparar la oferta.`);
  if (price >= 60) watch.push(`El precio pesa hasta ${price} ${criteria.find((c) => c.price)?.unit ?? 'puntos'}: la oferta económica decide casi todo.`);
  if (quality >= 50 && price < 50) watch.push('La calidad técnica pesa más que el precio: la memoria técnica es clave.');
  if (!criteria.length) watch.push('El anuncio no publica los criterios de adjudicación: consúltalos en el pliego.');
  if (!value) watch.push('El anuncio no publica el importe: revisa el presupuesto en el pliego.');
  return { ...common, depth: 'anuncio', plain, facts, asks, watch, docs: [], otherDocs: [], readFrom: 'Anuncio oficial publicado en TED (formulario eForms)' };
}

/** Ficha de texto con los datos oficiales, para empezar el análisis sin descargar nada. */
export function fichaText(t: TedNotice): string {
  const v = tenderView(t);
  const n = N[t.id];
  const dl = n?.dl ? new Date(n.dl) : new Date(t.deadline);
  const ref = (x: string) => x.replace(/\bp\. (\d)/g, 'pág $1');
  const lines = [
    'FICHA DE LA LICITACIÓN.',
    `Resumen preparado por PROPO a partir de: ${v.readFrom}. ${t.live && t.live.src !== 'ted' ? `Expediente ${t.live.ref || t.id}` : `Anuncio TED ${t.id}`}.`,
    `Objeto del contrato: ${t.title}.`,
    `Órgano de contratación: ${t.buyer}.`,
    `Lugar de ejecución: ${t.city !== 'No consta' ? t.city + ', ' : ''}${regionLabel(t.nuts)}.`,
    ...(v.facts.map(([k, x]) => `${k}: ${x}.`)),
    `Fecha límite de presentación de ofertas: ${dl.getDate()} de ${dl.toLocaleDateString('es-ES', { month: 'long' })} de ${dl.getFullYear()}${n?.dl ? ` a las ${n.dl.slice(11, 16)}` : ''}. Las ofertas deberán presentarse a través de la plataforma de contratación indicada en el anuncio.`,
    '',
    'RESUMEN:',
    v.plain,
    '',
    'REQUISITOS:',
    ...v.asks.map((a) => (/^El anuncio no/.test(a) ? a : `Se exigirá: ${ref(a).replace(/\.$/, '')}.`)),
    '',
    'PUNTOS DE ATENCIÓN:',
    ...v.watch.map((w) => `- ${ref(w)}`),
    '',
    'CRITERIOS DE ADJUDICACIÓN:',
    ...(v.criteria.length ? v.criteria.map((c) => `${c.name.replace(/[:.]+$/, '')}: ${c.weight != null ? `hasta ${String(c.weight).replace('.', ',')} puntos` : 'ponderación en el pliego'}`) : ['No publicados en el anuncio.']),
    ...(v.lots.length ? ['', 'LOTES:', ...v.lots.map((l, i) => `Lote ${i + 1}: ${l.name}${l.value ? ` (${eur(l.value)} sin IVA)` : ''}.`)] : []),
    '',
    'DOCUMENTOS OFICIALES:',
    ...(v.docs.length ? v.docs.map((d) => `${d.name}: ${d.url}`) : [`Disponibles en ${v.officialPage ?? v.tedUrl}`]),
  ];
  return lines.join('\n');
}

export function fichaFile(t: TedNotice): File {
  const name = `Ficha de la licitación ${(t.live?.ref || t.id).replace(/[^\p{L}\p{N}_.-]+/gu, '-')}.txt`;
  return new File([fichaText(t)], name, { type: 'text/plain' });
}
