// Lecciones de los informes de valoración (data/conocimiento/lecciones/<cpv2>.json, rama «conocimiento»): qué
// valoraron bien y mal los tribunales en contratos españoles parecidos, criterio a criterio. Al redactar una sección,
// PROPO recibe las más parecidas como orientación: nunca para copiarlas ni para atribuir nada a la empresa.
import type { Project } from '../types';
import { normalize } from '../util';

export interface Lesson {
  crit: string; max: number | null; exp: string; title: string; buyer: string; date: string; offers: number;
  top: { pts: number | null; winner: boolean }; low: { pts: number | null } | null;
  best: string[]; weak: string[]; hypothesis: { premia: string; penaliza: string } | null; url: string;
}
const cache = new Map<string, Promise<Lesson[]>>();
function division(cpv2: string): Promise<Lesson[]> {
  let p = cache.get(cpv2);
  if (!p) {
    p = fetch(`data/conocimiento/lecciones/${cpv2}.json`).then((r) => (r.ok ? r.json() : { items: [] })).then((j) => (Array.isArray(j?.items) ? j.items : [])).catch(() => []);
    cache.set(cpv2, p);
  }
  return p;
}

/** Divisiones CPV del proyecto (de la licitación, del análisis o, en obras, la 45). */
export function projectCpv2(p: Project): string[] {
  const cpv = [...(p.tender?.cpv ?? []), ...(p.analysis?.cpv ? [p.analysis.cpv.replace(/\D/g, '')] : [])].filter((c) => /^\d{8}/.test(c));
  const out = [...new Set(cpv.map((c) => c.slice(0, 2)))];
  if (!out.length && p.obra) out.push('45');   // obras sin CPV leído
  return out.slice(0, 3);
}

const STOP = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'e', 'en', 'para', 'por', 'con', 'a', 'al', 'o', 'u', 'un', 'una', 'criterio', 'valoracion', 'oferta', 'propuesta', 'tecnica', 'tecnico']);
const words = (s: string) => new Set(normalize(s).split(' ').filter((w) => w.length > 2 && !STOP.has(w)));

/** Las lecciones más parecidas a una sección: mismo sector, criterio con nombre parecido, mismo organismo, recientes. */
export async function lessonsFor(p: Project, sectionTitle: string, criteria: string[], n = 6): Promise<Lesson[]> {
  const divs = projectCpv2(p);
  if (!divs.length) return [];
  const all = (await Promise.all(divs.map(division))).flat();
  if (!all.length) return [];
  const target = words([sectionTitle, ...criteria].join(' '));
  const buyer = normalize(p.organization || '');
  const scored = all.map((l) => {
    const w = words(l.crit);
    let overlap = 0; for (const x of w) if (target.has(x)) overlap++;
    const sim = w.size ? overlap / Math.min(w.size, Math.max(target.size, 1)) : 0;
    const age = (Date.now() - Date.parse(l.date || '2000-01-01')) / (365 * 864e5);
    return { l, s: sim * 3 + (buyer && normalize(l.buyer) === buyer ? 1 : 0) + Math.max(0, 1 - age / 4) * 0.5 + (l.best.length && l.weak.length ? 0.3 : 0) };
  }).filter((x) => x.s >= 1).sort((a, b) => b.s - a.s);
  const seen = new Set<string>(); const out: Lesson[] = [];
  for (const { l } of scored) { if (seen.has(l.exp + l.crit)) continue; seen.add(l.exp + l.crit); out.push(l); if (out.length >= n) break; }
  return out;
}

/** Texto para la IA: hechos del informe (premiado / criticado) separados de la deducción. */
export function lessonsPrompt(ls: Lesson[]): string {
  return ls.map((l, i) => {
    const pts = l.max && l.top.pts != null ? ` (mejor oferta ${l.top.pts}/${l.max}${l.low?.pts != null ? `, peor ${l.low.pts}/${l.max}` : ''}, ${l.offers} ofertas)` : '';
    return `${i + 1}. «${l.crit}» en «${l.title}» (${l.buyer}, ${l.date.slice(0, 4)})${pts}
   Premiado: ${l.best.join(' · ') || '—'}
   Criticado: ${l.weak.join(' · ') || '—'}${l.hypothesis?.premia ? `\n   (Deducción, no hecho: premia ${l.hypothesis.premia}; penaliza ${l.hypothesis.penaliza})` : ''}`;
  }).join('\n');
}
