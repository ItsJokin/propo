// El precio de la oferta: cómo lo puntúa el pliego, qué rebaja conviene y el texto que va en el sobre de precio.
// PROPO nunca se inventa costes: calcula a partir del precio mínimo que el cliente dice que le compensa, de la fórmula
// del pliego y de lo que se rebajó en adjudicaciones parecidas. El cliente elige, ajusta o pone sus propios precios.
import type { Project, TeamMember } from './types';
import { normalize } from './util';
import { ai } from './ai/provider';
import { projectPages } from './ai/engine';
import { competitionFor, type Competition } from './data/awards';

export type Formula = 'inverse' | 'linear' | 'threshold' | 'other';
export interface UnitPrice { id: string; label: string; unit: string; max: number | null; qty: number | null }
export interface OtherCriterion {
  id: string; label: string; points: number | null; rule: string; ask: string;
  unit?: string | null;            // años, meses, días, horas… (null si no es una cifra)
  perUnit?: number | null;         // puntos por cada unidad ofrecida
  maxValue?: number | null;        // cifra a partir de la cual ya no suma
  better?: 'more' | 'less';        // «less» en reducciones de plazo, por ejemplo
  role?: string | null;            // si son años de experiencia de un perfil del equipo, ese perfil
  roleMinYears?: number | null;    // años mínimos que el pliego ya exige a ese perfil
}
export interface PriceRule {
  budget: number | null;          // presupuesto base de licitación, sin IVA
  vat: number | null;             // tipo de IVA (%)
  totalPoints: number | null;
  points: number | null;          // puntos del precio
  formula: Formula;
  formulaText: string;            // la fórmula tal como la escribe el pliego
  satiation: number | null;       // umbral de saciedad: rebaja (%) a partir de la cual ya no suma
  abnormalText: string;           // cómo define el pliego la oferta anormalmente baja
  abnormalBelowMean: number | null; // unidades porcentuales por debajo de la media
  abnormalOfBudget: number | null;  // rebaja (%) sobre el presupuesto a partir de la cual es anormal
  plain: string;                  // explicación en claro
  units: UnitPrice[];
  singleDiscount?: boolean;       // el pliego pide un único % de baja que se aplica a todos los precios máximos
  lots: { label: string; budget: number | null }[];
  others: OtherCriterion[];
  model: { doc: string; page: number | null; name: string } | null;
  labor: string | null;           // costes de personal mínimos (convenio, subrogación)
  envelope: string | null;        // en qué sobre va el precio
  source: { doc: string; page: number | null; quote: string } | null;
  mode: 'ai' | 'rules';
}
export interface PriceChoice { mode: 'prudent' | 'recommended' | 'aggressive' | 'own'; baja: number; total: number; points: number | null; units: { id: string; label: string; price: number }[]; vatIncluded?: boolean; doubts?: string; discount?: number }
export interface Pricing {
  rule: PriceRule | null;
  floor: number | null;           // precio total mínimo que le compensa al cliente, sin IVA
  ownText?: string;               // sus precios, escritos con sus palabras
  choice: PriceChoice | null;
  others: Record<string, { text: string; formal?: string; value?: number }>;
  approved: string | null;        // fecha de confirmación
  filled?: import('./offerModel').FilledModel | null;   // el modelo oficial del pliego, ya rellenado
  fillNote?: string;              // por qué no se ha podido rellenar (p. ej. PDF sin campos)
  unitDraft?: Record<string, string>;   // precios por concepto que el cliente está escribiendo (y conceptos que añade él)
  extraUnits?: { id: string; label: string; unit: string }[];
  unitInfo?: Record<string, UnitInfo> | null;   // qué pide el pliego en cada concepto, explicado en claro
  unitInfoError?: boolean;
  unitInfoV?: number;
}

export const emptyPricing = (): Pricing => ({ rule: null, floor: null, choice: null, others: {}, approved: null });
const PRICE = /precio|oferta econ|econ[oó]mic|importe|\bbaja\b|canon|tarifa|coste/i;
export const num = (s: string | number | null | undefined) => {
  if (typeof s === 'number') return Number.isFinite(s) ? s : 0;
  const m = String(s || '').replace(/\s/g, '').match(/\d[\d.]*(?:,\d+)?/);
  if (!m) return 0;
  const t = m[0];
  return Number(/,\d+$/.test(t) ? t.replace(/\./g, '').replace(',', '.') : (/^\d{1,3}(\.\d{3})+$/.test(t) ? t.replace(/\./g, '') : t)) || 0;
};
const r2 = (x: number) => Math.round(x * 100) / 100;

// ── Lectura del pliego ──────────────────────────────────────────────────────────────────────────────────────────────
const KEYS: [RegExp, number][] = [
  [/f[oó]rmula/gi, 4], [/oferta econ[oó]mica|proposici[oó]n econ[oó]mica/gi, 4], [/anormalmente baj|baja temeraria|desproporcionad/gi, 5],
  [/criterios? de (adjudicaci|valoraci)|puntuaci[oó]n/gi, 3], [/precio unitario|precios unitarios|precio m[aá]ximo/gi, 3],
  [/presupuesto base|valor estimado/gi, 2], [/umbral de saciedad/gi, 5], [/sobre\s?(2|3|b|c)\b/gi, 1], [/convenio colectivo|costes? salarial|subrogaci/gi, 2],
  [/mejoras?|plazo de (entrega|garant[ií]a)|ampliaci[oó]n del plazo de garant/gi, 1], [/IVA/g, 1], [/puntos/gi, 1],
];

async function pricePages(p: Project): Promise<string> {
  const pages = await projectPages(p);
  const scored: { doc: string; page: number; text: string; score: number }[] = [];
  for (const d of p.docs) {
    (pages.get(d.id) ?? []).forEach((t, i) => {
      if (!t || t.length < 60) return;
      let score = 0;
      for (const [re, w] of KEYS) score += Math.min(6, (t.match(re) || []).length) * w;
      if (/anexo|modelo/i.test(d.name) && /econ[oó]mic|precio/i.test(t)) score += 6;
      if (score > 0) scored.push({ doc: d.name, page: i + 1, text: t, score });
    });
  }
  scored.sort((a, b) => b.score - a.score);
  let out = ''; let n = 0;
  for (const s of scored) {
    const block = `\n\n=== ${s.doc} · página ${s.page} ===\n${s.text.slice(0, 6000)}`;
    if (out.length + block.length > 70000 || n >= 14) break;
    out += block; n++;
  }
  return out;
}

function promptFor(p: Project, pages: string) {
  const crit = p.criteria.map((c) => `- ${c.name}: ${c.points} puntos (${c.kind === 'formula' ? 'fórmula' : 'juicio de valor'})`).join('\n');
  return `Eres un experto en contratación pública española. Lee estos extractos de los pliegos de una licitación y explica cómo se puntúa el PRECIO y el resto de criterios evaluables con fórmula.

Licitación: ${p.name}
Órgano: ${p.organization}
Presupuesto que figura en el análisis: ${p.analysis?.budget || 'no consta'}
Criterios ya detectados:
${crit || '(ninguno)'}

Extractos:
${pages}

Devuelve SOLO un objeto JSON con esta forma exacta:
{
  "budget": número o null,            // presupuesto base de licitación SIN IVA (si hay lotes, el total o el del lote principal)
  "vat_rate": número o null,          // tipo de IVA en %
  "total_points": número o null,      // puntuación máxima total de la licitación
  "price_points": número o null,      // puntos máximos del criterio precio
  "formula": "inverse" | "linear" | "threshold" | "other",
                                      // inverse: puntos = máximo × (oferta más baja / oferta); linear: proporcional a la baja respecto a la mayor baja;
                                      // threshold: como las anteriores pero con umbral de saciedad; other: cualquier otra
  "formula_text": "la fórmula del pliego, literal y breve",
  "satiation_pct": número o null,     // rebaja (%) a partir de la cual no se dan más puntos
  "abnormal_text": "cómo define el pliego la oferta anormalmente baja (o 'regla general del art. 85 RGLCAP' si remite a ella)",
  "abnormal_below_mean": número o null,   // si es anormal la oferta inferior en X unidades porcentuales a la media
  "abnormal_of_budget": número o null,    // si es anormal la rebaja superior a X % del presupuesto
  "plain": "2 o 3 frases para el dueño de una pyme sin jerga: cuántos puntos da el precio, cómo se calculan y un ejemplo con números de esta licitación",
  "unit_prices": [{"label": "concepto", "unit": "unidad (menú, hora…)", "max_price": número o null, "qty": número o null}],
  "single_discount": true | false,    // true si el licitador NO pone un precio a cada concepto sino un único % de baja que se aplica a todos los precios máximos
  "lots": [{"label": "Lote 1 · …", "budget": número o null}],
  "other_formula": [{"label": "criterio", "points": número o null, "rule": "cómo se puntúa, breve", "ask": "pregunta clara al licitador para saber qué ofrece (p. ej. ¿Cuántos años de garantía adicional ofreces?)",
                    "unit": "años | meses | días | horas | … o null si no se oferta una cifra", "points_per_unit": número o null, "max_value": número o null (cifra que ya da el máximo),
                    "better": "more" | "less" (less si puntúa ofrecer menos, p. ej. reducir el plazo), "role": "perfil del equipo si son años de experiencia de una persona (p. ej. Ingeniero de Caminos)" o null, "role_min_years": número o null (años que el pliego ya exige a ese perfil)}],
  "model": {"doc": "nombre del documento", "page": número o null, "name": "nombre del modelo, p. ej. Anexo II · Modelo de proposición económica"} o null,
  "labor_cost_note": "costes salariales mínimos, convenio o subrogación que condicionan el precio" o null,
  "envelope": "en qué sobre o archivo va el precio" o null,
  "source": {"doc": "documento", "page": número, "quote": "frase literal corta donde se define la fórmula del precio"} o null
}

Reglas: no inventes nada; si un dato no está en los extractos, pon null o una lista vacía. Los importes, como números sin símbolos (12345.67). "other_formula" solo incluye criterios automáticos distintos del precio (garantía, plazos, horas, mejoras valoradas en euros…). Una entrada por cada cifra que el licitador escribe en el modelo: si un criterio puntúa varios perfiles o conceptos por separado (p. ej. años adicionales de tres técnicos), una entrada para cada uno, con sus puntos.`;
}

function fromRules(p: Project): PriceRule {
  const budget = p.tender?.live?.budget || p.tender?.value || num(p.analysis?.budget) || null;
  const points = p.criteria.filter((c) => PRICE.test(c.name)).reduce((a, c) => a + (c.points || 0), 0) || null;
  const total = p.criteria.reduce((a, c) => a + (c.points || 0), 0) || null;
  return {
    budget: budget ? Math.round(budget) : null, vat: 21, totalPoints: total, points, formula: 'inverse', formulaText: '', satiation: null,
    abnormalText: 'Regla general: se presume anormal la oferta más de 10 puntos por debajo de la media (con 4 o más ofertas).', abnormalBelowMean: 10, abnormalOfBudget: null,
    plain: points ? `En esta licitación el precio vale ${points} puntos${total ? ` de ${total}` : ''}. Normalmente, la oferta más barata se lleva todos y las demás, en proporción.` : 'No hemos podido leer cuántos puntos da el precio. Revisa el apartado de criterios de adjudicación del pliego.',
    units: [], lots: [], others: p.criteria.filter((c) => c.kind === 'formula' && !PRICE.test(c.name)).map((c, i) => ({ id: `o${i}`, label: c.name, points: c.points || null, rule: c.description, ask: `¿Qué ofreces en «${c.name}»?` })),
    model: null, labor: null, envelope: null, source: null, mode: 'rules',
  };
}

/** Lee del pliego cómo se puntúa el precio (con IA; si no hay, con lo que ya se sabe del análisis). */
export async function readPriceRule(p: Project): Promise<PriceRule> {
  const base = fromRules(p);
  let pages = '';
  try { pages = await pricePages(p); } catch { /* sin textos */ }
  if (!pages) return base;
  try {
    const j = await ai.json<any>(promptFor(p, pages), { tier: 'default', project: p.isSample ? '' : p.id });
    const n = (x: any) => (x == null || x === '' ? null : num(x) || null);
    return {
      budget: n(j.budget) ?? base.budget, vat: n(j.vat_rate) ?? 21, totalPoints: n(j.total_points) ?? base.totalPoints, points: n(j.price_points) ?? base.points,
      formula: ['inverse', 'linear', 'threshold', 'other'].includes(j.formula) ? j.formula : 'inverse', formulaText: String(j.formula_text || ''),
      satiation: n(j.satiation_pct), abnormalText: String(j.abnormal_text || base.abnormalText),
      abnormalBelowMean: n(j.abnormal_below_mean) ?? (j.abnormal_of_budget ? null : 10), abnormalOfBudget: n(j.abnormal_of_budget),
      plain: String(j.plain || base.plain),
      units: (Array.isArray(j.unit_prices) ? j.unit_prices : []).filter((u: any) => u?.label).slice(0, 30).map((u: any, i: number) => ({ id: `u${i}`, label: String(u.label), unit: String(u.unit || ''), max: n(u.max_price), qty: n(u.qty) })),
      singleDiscount: j.single_discount === true,
      lots: (Array.isArray(j.lots) ? j.lots : []).filter((l: any) => l?.label).slice(0, 20).map((l: any) => ({ label: String(l.label), budget: n(l.budget) })),
      others: (Array.isArray(j.other_formula) ? j.other_formula : []).filter((o: any) => o?.label).slice(0, 10).map((o: any, i: number) => ({ id: `o${i}`, label: String(o.label), points: n(o.points), rule: String(o.rule || ''), ask: String(o.ask || `¿Qué ofreces en «${o.label}»?`),
        unit: o.unit ? String(o.unit) : null, perUnit: n(o.points_per_unit), maxValue: n(o.max_value), better: o.better === 'less' ? 'less' : 'more',
        role: o.role ? String(o.role) : null, roleMinYears: n(o.role_min_years) })),
      model: j.model?.name ? { doc: String(j.model.doc || ''), page: n(j.model.page), name: String(j.model.name) } : null,
      labor: j.labor_cost_note ? String(j.labor_cost_note) : null, envelope: j.envelope ? String(j.envelope) : null,
      source: j.source?.quote ? { doc: String(j.source.doc || ''), page: n(j.source.page), quote: String(j.source.quote) } : null,
      mode: 'ai',
    };
  } catch { return base; }
}

// ── Cálculo ─────────────────────────────────────────────────────────────────────────────────────────────────────────
/** Puntos del precio con una rebaja `b` (0–1) si la rebaja más fuerte presentada es `best`. */
export function pointsFor(rule: Pick<PriceRule, 'points' | 'formula' | 'satiation'>, b: number, best: number): number | null {
  if (!rule.points) return null;
  const sat = rule.satiation != null ? rule.satiation / 100 : null;
  const eff = (x: number) => (sat != null ? Math.min(x, sat) : x);
  const mine = eff(b); const top = Math.max(mine, eff(best));
  if (rule.formula === 'linear' || rule.formula === 'threshold') return top > 0 ? rule.points * (mine / top) : rule.points;
  return rule.points * ((1 - top) / (1 - mine));
}

export interface Market { mean: number; best: number; n: number; scope: string }
/** Rebajas habituales en adjudicaciones parecidas (o valores prudentes si no hay datos). */
export async function marketFor(p: Project): Promise<Market> {
  const cpv = p.tender?.cpv ?? (p.analysis?.cpv ? [p.analysis.cpv.replace(/\D/g, '').slice(0, 8)] : []);
  let c: Competition | null = null;
  try { c = await competitionFor({ cpv, buyer: p.organization }); } catch { /* sin datos */ }
  const s = c?.buyer?.withBaja && c.buyer.withBaja >= 3 ? c.buyer : c?.similar;
  if (s?.baja != null) return { mean: s.baja, best: s.bajaHigh ?? s.baja * 1.6, n: s.withBaja, scope: s === c?.buyer ? 'de este mismo organismo' : (c?.scope || 'parecidas') };
  return { mean: 0.08, best: 0.15, n: 0, scope: '' };
}

/** Rebaja a partir de la cual la oferta se presume anormalmente baja. */
export function abnormalBaja(rule: PriceRule, m: Market) {
  if (rule.abnormalOfBudget != null) return rule.abnormalOfBudget / 100;
  const pts = (rule.abnormalBelowMean ?? 10) / 100;
  return Math.min(0.9, m.mean + pts);
}

const half = (x: number) => Math.round(x * 200) / 200;   // a medio punto
export interface Option { mode: 'prudent' | 'recommended' | 'aggressive'; baja: number; total: number; points: number | null; risky: boolean; margin: number | null }

/** Las tres propuestas de precio. Ninguna baja del precio mínimo que el cliente dice que le compensa. */
export function priceOptions(rule: PriceRule, m: Market, floor: number | null): { options: Option[]; limit: 'floor' | 'none'; abnormal: number } {
  const budget = rule.budget || 0;
  const abn = abnormalBaja(rule, m);
  const cap = Math.max(0, Math.min(floor && budget ? 1 - floor / budget : 0.6, rule.satiation != null ? rule.satiation / 100 : 0.6));
  const best = Math.max(m.best, m.mean);
  let pru = Math.min(cap, half(m.mean));
  let rec = Math.min(cap, half(Math.min(best, abn - 0.02)));
  let agg = Math.min(cap, half(abn - 0.005));
  rec = Math.max(rec, pru); agg = Math.max(agg, rec);
  const make = (mode: Option['mode'], b: number): Option => ({
    mode, baja: b, total: r2(budget * (1 - b)), points: pointsFor(rule, b, Math.max(best, b)), risky: b >= abn,
    margin: floor ? r2(budget * (1 - b) - floor) : null,
  });
  const out = [make('prudent', pru), make('recommended', rec), make('aggressive', agg)];
  const uniq = out.filter((o, i) => i === 0 || Math.abs(o.baja - out[i - 1].baja) > 0.001);
  return { options: uniq, limit: floor && cap <= best ? 'floor' : 'none', abnormal: abn };
}

/** Precios unitarios con la misma rebaja que el total. */
export function unitPricesFor(rule: PriceRule, b: number) {
  return rule.units.filter((u) => u.max != null).map((u) => ({ id: u.id, label: `${u.label}${u.unit && u.unit.toLowerCase() !== u.label.toLowerCase() ? ` (${u.unit})` : ''}`, price: r2(u.max! * (1 - b)) }));
}

export function choose(rule: PriceRule, o: Option): PriceChoice {
  return { mode: o.mode, baja: o.baja, total: o.total, points: o.points, units: unitPricesFor(rule, o.baja) };
}

// ── Precios del cliente, con sus palabras ───────────────────────────────────────────────────────────────────────────
/** Ordena los precios que el cliente escribe a su manera. Nunca cambia un importe. */
export async function readOwnPrices(p: Project, rule: PriceRule, text: string): Promise<PriceChoice | null> {
  const units = rule.units.map((u) => `- ${u.id}: ${u.label}${u.unit ? ` (${u.unit})` : ''}${u.max != null ? `, máximo ${u.max} €` : ''}`).join('\n');
  try {
    const j = await ai.json<any>(`Un licitador ha escrito con sus palabras los precios de su oferta. Ordénalos sin cambiar NINGÚN importe ni inventar ninguno.

Presupuesto base sin IVA: ${rule.budget ?? 'no consta'}
Precios unitarios que pide el pliego:
${units || '(ninguno)'}

Lo que ha escrito:
"""${text.slice(0, 4000)}"""

Devuelve SOLO JSON: {"total": número sin IVA o null, "units": [{"id": "id del precio unitario del pliego o null", "label": "concepto", "price": número}], "vat_included": true|false, "doubts": "lo que no esté claro, en una frase, o vacío"}
Si los importes que ha escrito incluyen IVA, indícalo con vat_included=true y NO los conviertas tú.`, { tier: 'quick', project: p.isSample ? '' : p.id });
    const total = j.total != null ? num(j.total) : null;
    const us = (Array.isArray(j.units) ? j.units : []).filter((u: any) => u?.price != null).map((u: any, i: number) => ({ id: String(u.id || `x${i}`), label: String(u.label || ''), price: num(u.price) }));
    const sum = us.reduce((a: number, u: any) => {
      const q = rule.units.find((x) => x.id === u.id)?.qty; return q ? a + u.price * q : a;
    }, 0);
    const t = total || (sum ? r2(sum) : 0);
    if (!t && !us.length) return null;
    const b = rule.budget && t ? 1 - t / rule.budget : 0;
    return { mode: 'own', baja: b, total: t, points: pointsFor(rule, b, b), units: us, ...(j.vat_included ? { vatIncluded: true } : {}), ...(j.doubts ? { doubts: String(j.doubts) } : {}) };
  } catch {
    const t = num(text);
    if (!t) return null;
    const b = rule.budget ? 1 - t / rule.budget : 0;
    return { mode: 'own', baja: b, total: t, points: pointsFor(rule, b, b), units: [] };
  }
}

/** Convierte la respuesta del cliente a un criterio con fórmula en un compromiso formal, sin cambiar cifras. */
export async function formalCommitment(p: Project, c: OtherCriterion, answer: string): Promise<string> {
  try {
    const { text } = await ai.text(`Reescribe como compromiso formal de una oferta a un concurso público español, en una o dos frases, en primera persona del plural («nos comprometemos a…»). No cambies ninguna cifra ni añadas nada que no diga el licitador.

Criterio: ${c.label} (${c.rule})
Lo que ofrece el licitador: «${answer.slice(0, 1000)}»

Devuelve solo el texto.`, { tier: 'quick', project: p.isSample ? '' : p.id });
    return text.trim().replace(/^["«]|["»]$/g, '');
  } catch { return answer.trim(); }
}

// ── Otros criterios con fórmula: qué cifra conviene ──────────────────────────────────────────────────────────────────
/** Puntos que da ofrecer `v` en un criterio con fórmula (si el pliego lo deja claro). */
export function otherPoints(o: OtherCriterion, v: number): number | null {
  if (!o.points) return null;
  if (o.better === 'less') return null;   // las reducciones dependen de las demás ofertas
  if (o.perUnit) return Math.min(o.points, Math.max(0, v) * o.perUnit);
  if (o.maxValue) return Math.min(o.points, (o.points * Math.max(0, v)) / o.maxValue);
  return null;
}
const GENERIC = new Set(['tecnico', 'tecnica', 'superior', 'ingeniero', 'ingeniera', 'titulado', 'titulada', 'grado', 'licenciado', 'experiencia', 'responsable']);
/** La persona del equipo que encaja con el perfil que pide el pliego (por su puesto o su titulación). */
const roleKeys = (role: string) => normalize(role).split(' ').filter((w) => w.length >= 5 && !GENERIC.has(w));
export function memberFor(role: string, team: TeamMember[]): TeamMember | null {
  const keys = roleKeys(role);
  if (!keys.length) return null;
  const need = Math.min(2, keys.length);
  let best: { m: TeamMember; n: number } | null = null;
  for (const m of team) {
    const hay = normalize(`${m.role} ${m.qualifications}`);
    const n = keys.filter((k) => hay.includes(k)).length;
    if (n >= need && (!best || n > best.n)) best = { m, n };
  }
  return best?.m ?? null;
}
/** Años mínimos que el pliego exige a un perfil, buscados en los requisitos ya extraídos (p. ej. «Ingeniero Técnico de Obras Públicas 10 años»). */
export function minYearsFor(role: string, reqs: { title: string; text: string }[]): number | null {
  const keys = roleKeys(role); if (!keys.length) return null;
  const need = Math.min(2, keys.length);
  for (const r of reqs) {
    const t = normalize(`${r.title} ${r.text}`);
    if (keys.filter((k) => t.includes(k)).length < need) continue;
    const m = `${r.title} ${r.text}`.match(/(\d{1,2})\s*a[ñn]os/i);
    if (m) return Number(m[1]);
  }
  return null;
}
export interface OtherAdvice { value: number | null; points: number | null; note: string; warn?: string }
/** Cifra recomendada: la que da el máximo de puntos, sin pasar de lo que la empresa puede demostrar. */
export function otherAdvice(o: OtherCriterion, team: TeamMember[], reqs: { title: string; text: string }[] = []): OtherAdvice {
  const unit = o.unit || '';
  const top = o.maxValue ?? (o.points && o.perUnit ? Math.floor(o.points / o.perUnit + 1e-9) : null);
  if (o.better === 'less') return { value: null, points: null, note: `Ofrecer menos ${unit} da puntos, pero queda como compromiso del contrato: pon solo lo que puedas cumplir con tu plan de trabajo.` };
  if (top == null) return { value: null, points: null, note: 'El pliego no deja claro cuánto hace falta para el máximo: escribe lo que ofreces y PROPO lo redacta.' };
  if (o.role) {
    const m = memberFor(o.role, team);
    const known = o.roleMinYears ?? minYearsFor(o.role, reqs);
    const min = known ?? 0;
    if (m && known == null) return { value: null, points: null, note: `${m.name} tiene ${m.years} años de experiencia. Los años adicionales se cuentan sobre el mínimo que exige el pliego: réstaselo y pon el resultado (como mucho ${top}).`, warn: 'No he encontrado cuántos años mínimos exige el pliego a este perfil: compruébalo antes de comprometer la cifra.' };
    if (m) {
      const can = Math.max(0, Math.floor(m.years - min));
      if (can < top) return { value: can, points: otherPoints(o, can), note: `${m.name} tiene ${m.years} años de experiencia${min ? ` y el pliego ya exige ${min}` : ''}: puedes comprometer ${can} ${unit} adicionales.`, warn: `Para el máximo (${top} ${unit}) haría falta alguien con ${min + top} años. Si ofreces más de lo que acredita su vida laboral, te pueden excluir.` };
      return { value: top, points: otherPoints(o, top), note: `${m.name} tiene ${m.years} años: llega al máximo (${min ? `${min} exigidos + ` : ''}${top} adicionales).` };
    }
    return { value: top, points: otherPoints(o, top), note: known != null ? `Para el máximo necesitas un ${o.role} con al menos ${min + top} años acreditables con su vida laboral.` : `Para el máximo necesitas un ${o.role} con ${top} años más de los que exige el pliego, acreditables con su vida laboral.`, warn: `No encuentro este perfil en Empresa → Equipo: compruébalo antes de comprometerlo.` };
  }
  if (/mes|año|garant/i.test(`${unit} ${o.label}`)) return { value: top, points: otherPoints(o, top), note: `Con ${top} ${unit} te llevas todos los puntos. Más no suma. Es tiempo en el que respondes de los defectos de la obra: decide si te compensa.` };
  return { value: top, points: otherPoints(o, top), note: `Con ${top} ${unit} te llevas todos los puntos; más no suma.` };
}
/** Compromiso formal con la cifra en letra y en número, como piden los modelos de oferta. */
export function commitmentText(o: OtherCriterion, v: number) {
  const n = Math.round(v);
  return `Nos comprometemos a ofrecer ${words(n).toUpperCase()} (${n}) ${o.unit || 'unidades'} en «${o.label}».`;
}

// ── Comprobaciones ──────────────────────────────────────────────────────────────────────────────────────────────────
export function priceWarnings(rule: PriceRule, ch: PriceChoice, m: Market | null): { level: 'bad' | 'warn'; text: string }[] {
  const w: { level: 'bad' | 'warn'; text: string }[] = [];
  if (rule.budget && ch.total > rule.budget + 0.005) w.push({ level: 'bad', text: `El total (${eur2(ch.total)}) supera el presupuesto máximo (${eur2(rule.budget)}). Una oferta por encima se excluye.` });
  for (const u of ch.units) {
    const max = rule.units.find((x) => x.id === u.id)?.max;
    if (max != null && u.price > max + 0.005) w.push({ level: 'bad', text: `«${u.label}» (${eur2(u.price)}) supera el precio máximo del pliego (${eur2(max)}).` });
  }
  if (m && rule.budget && ch.baja >= abnormalBaja(rule, m)) w.push({ level: 'warn', text: 'Con esta rebaja tu oferta podría considerarse anormalmente baja: te pedirían justificarla en pocos días. Te dejamos un borrador de justificación en el paquete.' });
  if (ch.vatIncluded) w.push({ level: 'warn', text: 'Parece que has escrito los precios con IVA. En la oferta los importes van sin IVA y el IVA aparte: revisa los números.' });
  if (ch.doubts) w.push({ level: 'warn', text: String(ch.doubts) });
  return w;
}

// ── Importes en letra ───────────────────────────────────────────────────────────────────────────────────────────────
const U = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
const T = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const H = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
function under1000(n: number): string {
  if (n === 100) return 'cien';
  const h = Math.floor(n / 100), r = n % 100;
  const rest = r < 30 ? U[r] : `${T[Math.floor(r / 10)]}${r % 10 ? ` y ${U[r % 10]}` : ''}`;
  return [H[h], rest].filter(Boolean).join(' ');
}
function words(n: number): string {
  if (n === 0) return 'cero';
  const parts: string[] = [];
  const mill = Math.floor(n / 1e6), th = Math.floor((n % 1e6) / 1000), rest = n % 1000;
  if (mill) parts.push(mill === 1 ? 'un millón' : `${words(mill).replace(/uno$/, 'un')} millones`);
  if (th) parts.push(th === 1 ? 'mil' : `${under1000(th).replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un')} mil`);
  if (rest) parts.push(under1000(rest));
  return parts.join(' ');
}
/** 1234,5 → «mil doscientos treinta y cuatro euros con cincuenta céntimos». */
export function eurosInWords(x: number) {
  const e = Math.floor(x + 1e-9), c = Math.round((x - e) * 100);
  const ew = words(e).replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un');
  return `${ew} ${e === 1 ? 'euro' : e % 1e6 === 0 ? 'de euros' : 'euros'}${c ? ` con ${words(c).replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un')} ${c === 1 ? 'céntimo' : 'céntimos'}` : ''}`;
}
export const eur2 = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' } as Intl.NumberFormatOptions);
export const pct1 = (x: number) => String(Math.round(x * 1000) / 10).replace('.', ',') + ' %';

// ── Precio de cada concepto, puesto por el cliente ──────────────────────────────────────────────────────────────────
export interface UnitLine { id: string; label: string; unit: string; max: number | null; qty: number | null; price: number | null; over: boolean; subtotal: number | null }
/** Líneas de precio por concepto (las del pliego y las que añade el cliente), con lo que ha escrito en cada una. */
export function unitLines(rule: PriceRule, draft: Record<string, string>, extra: { id: string; label: string; unit: string }[] = []): UnitLine[] {
  return [...rule.units, ...extra.map((x) => ({ ...x, max: null, qty: null }))].map((u) => {
    const raw = (draft[u.id] ?? '').trim(); const price = raw ? num(raw) : null;
    return { id: u.id, label: u.label, unit: u.unit, max: u.max, qty: u.qty, price, over: price != null && u.max != null && price > u.max + 0.005, subtotal: price != null && u.qty ? r2(price * u.qty) : null };
  });
}
/** Oferta a partir de los precios de cada concepto. El total es la suma por las cantidades estimadas del pliego; si el
 *  pliego no las da, el total lo escribe el cliente (o se queda sin total si solo se ofertan precios unitarios). */
export function unitChoice(rule: PriceRule, lines: UnitLine[], totalTxt: string, discount?: number | null): PriceChoice | null {
  if (discount != null) {   // un único % de baja sobre todos los máximos: el precio de cada concepto sale solo
    const us = lines.filter((l) => l.max).map((l) => ({ id: l.id, label: `${l.label}${l.unit && l.unit.toLowerCase() !== l.label.toLowerCase() ? ` (${unitText(l.unit)})` : ''}`, price: r2(l.max! * (1 - discount)) }));
    if (!us.length || discount <= 0 || discount >= 1) return null;
    return { mode: 'own', baja: discount, total: 0, points: pointsFor(rule, discount, discount), units: us, discount };
  }
  const priced = lines.filter((l) => l.price != null && l.price > 0);
  if (!priced.length) return null;
  const allQty = priced.every((l) => l.qty);
  const sum = r2(priced.reduce((a, l) => a + (l.subtotal ?? 0), 0));
  const total = num(totalTxt) || (allQty ? sum : 0);
  let b = 0;
  if (rule.budget && total) b = 1 - total / rule.budget;
  else { const w = priced.filter((l) => l.max); if (w.length) b = w.reduce((a, l) => a + (1 - l.price! / l.max!), 0) / w.length; }   // sin total: rebaja media sobre los máximos
  return { mode: 'own', baja: b, total, points: pointsFor(rule, b, b), units: priced.map((l) => ({ id: l.id, label: `${l.label}${l.unit && l.unit.toLowerCase() !== l.label.toLowerCase() ? ` (${unitText(l.unit)})` : ''}`, price: r2(l.price!) })) };
}
/** «comensal» → «por comensal»; «por comensal» se queda igual. */
export function unitText(unit: string): string { const u = unit.trim(); return /^(por|cada|\/)\b/i.test(u) || u.startsWith('/') ? u : `por ${u}`; }
/** ¿Pide el pliego un único % de baja para todos los precios unitarios? (también en reglas leídas antes de existir el campo) */
export function isSingleDiscount(rule: PriceRule): boolean {
  if (rule.singleDiscount != null) return rule.singleDiscount && rule.units.some((u) => u.max);
  return rule.units.some((u) => u.max) && /(porcentaje|%)\s+de\s+(baja|descuento)\s+(único|uniforme|lineal)|(baja|descuento)\s+(único|única|uniforme|lineal)/i.test(`${rule.formulaText} ${rule.plain}`);
}

// ── Qué pide el pliego en cada concepto, explicado en claro ─────────────────────────────────────────────────────────
export interface UnitInfo { plain: string; includes: string[]; watch: string | null; doc: string; page: number | null }
const STOP = new Set(['para', 'por', 'con', 'del', 'los', 'las', 'una', 'uno', 'que', 'sin', 'menu', 'servicio', 'precio', 'comensal', 'persona', 'unidad']);
async function unitPages(p: Project, rule: PriceRule): Promise<string> {
  const pages = await projectPages(p);
  const words = [...new Set(rule.units.flatMap((u) => normalize(u.label).split(/[^a-z0-9]+/)).filter((w) => w.length > 3 && !STOP.has(w)))];
  const scored: { doc: string; page: number; text: string; score: number }[] = [];
  for (const d of p.docs) {
    (pages.get(d.id) ?? []).forEach((t, i) => {
      if (!t || t.length < 60) return;
      const n = normalize(t); let score = 0;
      for (const w of words) if (n.includes(w)) score += 2;
      score += Math.min(6, (n.match(/incluye|compuest|consistir|debera contener|como minimo|bebida|racion|piezas|menu/g) || []).length);
      if (/prescripci|ppt|t[eé]cnic/i.test(d.name)) score += 12;   // la composición de cada servicio suele estar en el pliego técnico
      if (score > 4) scored.push({ doc: d.name, page: i + 1, text: t, score });
    });
  }
  scored.sort((a, b) => b.score - a.score);
  let out = ''; let k = 0;
  for (const s of scored) {
    const block = `\n\n=== ${s.doc} · página ${s.page} ===\n${s.text.slice(0, 6000)}`;
    if (out.length + block.length > 110000 || k >= 26) break;
    out += block; k++;
  }
  return out;
}
export const UNIT_INFO_V = 2;
/** Lee en los pliegos qué incluye cada concepto con precio (menú, servicio, pack…) y lo explica para el dueño de la empresa. */
export async function explainUnits(p: Project, rule: PriceRule): Promise<Record<string, UnitInfo>> {
  const pages = await unitPages(p, rule);
  const list = rule.units.map((u) => `- ${u.id}: ${u.label}${u.unit ? ` (${u.unit})` : ''}${u.max != null ? ` · máximo ${u.max} €` : ''}`).join('\n');
  const j = await ai.json<any>(`Eres un experto en contratación pública española. Una pyme va a poner precio a cada uno de estos conceptos de una licitación y necesita saber EXACTAMENTE qué tiene que dar en cada uno.

Licitación: ${p.name}

Conceptos:
${list}

Extractos de los pliegos:
${pages}

Para cada concepto, busca qué pide el pliego (composición, cantidades, número de piezas o platos, bebidas, duración, personal, material, montaje, horarios…) y explícalo con palabras sencillas, sin jerga, como se lo contarías al dueño de la empresa. Un concepto combinado (p. ej. «Pausa café + Almuerzo») incluye lo de cada parte: dilo.
No inventes nada: si el pliego no lo detalla, escribe «El pliego no detalla…». Nunca hables de «extractos» ni de «fragmentos».
En «watch» pon solo lo propio de ESE concepto que cambie el coste (personal de servicio, mínimo de comensales, menaje, bebidas incluidas…), en una frase; no repitas cosas generales de toda la licitación (lotes, fórmula de puntos, % de baja).
Devuelve SOLO un objeto JSON con esta forma, con una clave por cada id de concepto:
{
  "u0": {
    "plain": "1 o 2 frases: qué es este servicio y qué tienes que dar",
    "includes": ["cada cosa concreta que exige el pliego, con cantidades si las da"],
    "watch": "lo que hay que tener en cuenta para el precio (personal incluido, mínimo de comensales, transporte, alergias…) o null",
    "doc": "documento donde lo has leído (o '' si no aparece)",
    "page": número o null
  }
}`, { tier: 'default', project: p.isSample ? '' : p.id });
  const out: Record<string, UnitInfo> = {};
  for (const u of rule.units) {
    const x = j?.[u.id]; if (!x?.plain) continue;
    out[u.id] = { plain: String(x.plain), includes: (Array.isArray(x.includes) ? x.includes : []).map(String).filter(Boolean).slice(0, 12), watch: x.watch ? String(x.watch) : null, doc: String(x.doc || ''), page: x.page == null || x.page === '' ? null : num(x.page) || null };
  }
  return out;
}
