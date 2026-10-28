// Estrategia de precio. Dos decisiones que toma PROPO por el cliente:
// 1) cómo se oferta en esta licitación (precio total, % de rebaja único, precio por servicio o importe por lote), que la
//    IA lee en el pliego al extraer la regla del precio;
// 2) qué rebaja da el máximo de puntos esperados sin entrar en baja temeraria, sin pasar del umbral de saciedad y sin
//    bajar del coste mínimo del cliente. Los puntos dependen de lo que oferten los demás: se promedian varios escenarios
//    construidos con las rebajas de adjudicaciones parecidas.
import { abnormalBaja, pointsFor, isSingleDiscount, pct1, type PriceRule, type Market } from './pricing';

export type OfferType = 'total' | 'discount' | 'units' | 'lots';
export const OFFER: Record<OfferType, { t: string; d: string }> = {
  total: { t: 'Un precio total', d: 'Se ofrece un único importe por todo el contrato.' },
  discount: { t: 'Un % de rebaja único', d: 'Se ofrece un mismo porcentaje de rebaja sobre todos los precios máximos.' },
  units: { t: 'Un precio por servicio', d: 'Se pone un precio a cada servicio, sin pasar de su máximo.' },
  lots: { t: 'Un importe por lote', d: 'Se ofrece un importe para cada lote al que te presentas.' },
};
const TYPES: OfferType[] = ['total', 'discount', 'units', 'lots'];

/** Cómo se oferta el precio en esta licitación: lo que ha leído la IA en el pliego o, en reglas antiguas, lo que se deduce. */
export function offerType(rule: PriceRule): { type: OfferType; why: string } {
  const hasMax = rule.units.some((u) => u.max != null);
  const lots = rule.lots.filter((l) => l.budget).length;
  const t = rule.offerType as OfferType | undefined;
  if (t && TYPES.includes(t) && !(t === 'units' && !hasMax) && !(t === 'lots' && lots < 2)) return { type: t, why: rule.offerWhy || OFFER[t].d };
  if (isSingleDiscount(rule)) return { type: 'discount', why: 'El pliego pide un único porcentaje de rebaja que se aplica a todos los precios máximos.' };
  if (hasMax) return { type: 'units', why: 'El pliego fija un precio máximo para cada servicio y pide el tuyo para cada uno.' };
  if (lots > 1) return { type: 'lots', why: 'La licitación está dividida en lotes, cada uno con su propio presupuesto.' };
  return { type: 'total', why: 'El pliego pide un único importe por todo el contrato.' };
}

export interface Strategy {
  P: number | null;            // puntos del precio
  abn: number;                 // rebaja a partir de la cual sería baja temeraria
  sat: number | null;          // umbral de saciedad
  floorCap: number | null;     // rebaja máxima que permite el coste mínimo del cliente
  safe: number;                // rebaja máxima sin riesgo
  rec: number;                 // la que recomienda PROPO
  hi: number;                  // hasta dónde se dibuja la curva
  exp: (b: number) => number | null;   // puntos esperados con una rebaja b
  why: string[];
}
const q4 = (x: number) => Math.round(x * 400) / 400;   // a cuartos de punto
const pt = (x: number | null) => (x == null ? '—' : String(Math.round(x * 10) / 10).replace('.', ','));

export function priceStrategy(rule: PriceRule, m: Market, floor: number | null): Strategy {
  const P = rule.points ?? null;
  const abn = abnormalBaja(rule, m);
  const sat = rule.satiation != null ? rule.satiation / 100 : null;
  const floorCap = floor && rule.budget ? Math.max(0, 1 - floor / rule.budget) : null;
  // Escenarios para la rebaja más fuerte de la competencia, alrededor de lo que se ve en contratos parecidos
  const base = Math.max(m.best, m.mean, 0.02);
  const scen = [0.5, 0.75, 1, 1.25, 1.5, 2].map((k) => Math.min(base * k, Math.max(0.005, abn - 0.005)));
  const exp = (b: number) => (P ? scen.reduce((a, s) => a + (pointsFor(rule, b, s) ?? 0), 0) / scen.length : null);
  const safe = Math.floor(Math.max(0, Math.min(sat ?? 1, abn - 0.01, floorCap ?? 1, 0.6)) * 400 + 1e-6) / 400;
  const hi = Math.min(0.6, Math.max(abn + 0.04, (sat ?? 0) + 0.03, safe + 0.03, 0.1));
  let rec = safe;
  if (sat != null && sat <= safe + 1e-9) rec = sat;
  else if (!P) rec = Math.min(safe, base);
  else {
    const top = exp(safe)!; const tol = Math.max(0.2, P * 0.01);   // casi todos los puntos posibles, sin regalar dinero
    for (let b = 0; b <= safe + 1e-9; b += 0.0025) if (exp(b)! >= top - tol) { rec = b; break; }
  }
  rec = Math.min(q4(rec), safe);

  const why: string[] = [];
  if (sat != null && rec === sat) why.push(`El pliego deja de dar puntos a partir de un ${pct1(sat)} de rebaja: con exactamente ese porcentaje tienes los ${pt(P)} puntos asegurados y no regalas ni un euro más.`);
  if (m.n) why.push(m.mean > 0.005
    ? `Las empresas que ganaron ${m.n} contratos ${m.scope} rebajaron de media un ${pct1(m.mean)}${m.best > m.mean ? ` (las más agresivas, hasta un ${pct1(m.best)})` : ''}.`
    : `En ${m.n} contratos ${m.scope} las empresas apenas rebajaron (de media un ${pct1(Math.max(0, m.mean))}): no hace falta una rebaja grande para llevarse los puntos.`);
  else why.push('No hay datos de contratos parecidos, así que PROPO calcula con las rebajas habituales del sector.');
  if (P && !(sat != null && rec === sat)) {
    const eRec = exp(rec), eSafe = exp(safe);
    why.push(rec < safe - 0.001
      ? `Con un ${pct1(rec)} esperas unos ${pt(eRec)} de ${pt(P)} puntos. Rebajar más apenas suma (${pt(eSafe)} como mucho) y cada punto de rebaja es dinero que dejas de ganar.`
      : `Con un ${pct1(rec)} esperas unos ${pt(eRec)} de ${pt(P)} puntos: es lo máximo que se puede conseguir sin correr riesgos.`);
  }
  why.push(`La baja temeraria empezaría hacia un ${pct1(abn)}. PROPO se queda siempre al menos un punto por debajo para que no te pidan justificar el precio.`);
  if (floorCap != null && floorCap <= Math.min(sat ?? 1, abn - 0.01)) why.push(`Tu coste mínimo no permite rebajar más de un ${pct1(floorCap)}: PROPO no baja de ahí.`);
  if (rule.formula === 'other') why.push('La fórmula de este pliego es especial: los puntos son una estimación con la regla más parecida.');
  return { P, abn, sat, floorCap, safe, rec, hi, exp, why };
}
