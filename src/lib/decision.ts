// «¿Me presento?» con los pliegos ya leídos: encaje real con los requisitos de solvencia, huecos y cómo cubrirlos,
// tiempo disponible y competencia esperable (adjudicaciones publicadas). Reglas, sin IA.
import type { Project, Requirement } from './types';
import { competitionFor, goNoGo, type Competition, type Verdict } from './data/awards';
import { daysUntil } from './util';

export interface Gap { id: string; text: string; how: string | null; blocking: boolean }
export interface Decision {
  verdict: Verdict; title: string; score: number;
  reasons: { ok: boolean | null; text: string }[];
  gaps: Gap[]; comp: Competition | null;
}

// Lo que decide si se puede presentar: solvencia, experiencia, certificados, equipo y requisitos legales.
const DECIDES = new Set(['experience', 'financial', 'certification', 'team', 'technical', 'legal']);

/** Encaje con la empresa (0–100) a partir de los requisitos obligatorios que deciden la admisión. */
export function fitScore(p: Project): number {
  const rs = p.requirements.filter((r) => r.mandatory && DECIDES.has(r.category) && r.status !== 'skipped');
  if (!rs.length) return 60;
  const got = rs.reduce((a, r) => a + (r.status === 'fulfilled' ? 1 : r.status === 'needs_info' ? 0.6 : 0), 0);
  return Math.round((got / rs.length) * 100);
}

function howToCover(r: Requirement): string | null {
  if (r.category === 'experience' || r.category === 'financial') return 'Si no lo cumples, puedes completar la solvencia con medios de otra empresa (art. 75 LCSP) o presentarte en UTE.';
  if (r.category === 'team') return 'Puedes adscribir a un profesional externo con un compromiso firmado.';
  if (r.category === 'certification') return 'Suele admitirse un certificado equivalente o pruebas de medidas equivalentes.';
  return r.ask ?? null;
}

const cpvOf = (p: Project) => [...new Set([...(p.tender?.cpv ?? []), ...((p.analysis?.cpv ?? '').match(/\d{8}/g) ?? [])])];

export async function bidDecision(p: Project): Promise<Decision> {
  let comp: Competition | null = null;
  try { comp = await competitionFor({ cpv: cpvOf(p), buyer: p.tender?.buyer ?? p.analysis?.authority ?? '' }); } catch { /* sin datos de adjudicaciones */ }
  const score = fitScore(p);
  const d = p.analysis?.deadline ? daysUntil(p.analysis.deadline) : null;
  const go = goNoGo(score, d, comp);
  const gaps: Gap[] = p.requirements
    .filter((r) => r.mandatory && r.status !== 'fulfilled' && r.status !== 'skipped' && DECIDES.has(r.category))
    .map((r) => ({ id: r.id, text: r.plain || r.title, how: howToCover(r), blocking: r.status === 'missing' && r.critical }))
    .sort((a, b) => Number(b.blocking) - Number(a.blocking));
  const reasons = [...go.reasons];
  const block = gaps.filter((g) => g.blocking).length;
  if (block) reasons.unshift({ ok: false, text: `${block} requisito${block > 1 ? 's' : ''} de solvencia sin cubrir: sin ${block > 1 ? 'ellos' : 'él'} te excluirían.` });
  const s = comp?.buyer ?? comp?.similar;
  if (s?.baja != null) reasons.push({ ok: null, text: `Las ofertas ganadoras suelen bajar un ${pct(s.baja)} del presupuesto${s.bajaHigh != null ? ` (las más agresivas, un ${pct(s.bajaHigh)})` : ''}.` });
  let verdict = go.verdict;
  if (block && verdict === 'yes') verdict = 'maybe';
  const title = verdict === 'yes' ? 'Merece la pena presentarse' : verdict === 'maybe' ? (block ? 'Puedes presentarte si cubres lo que falta' : 'Valóralo antes de decidir') : 'Probablemente no compensa';
  return { verdict, title, score, reasons, gaps, comp };
}
const pct = (x: number) => `${String(Math.round(x * 1000) / 10).replace('.', ',')} %`;
