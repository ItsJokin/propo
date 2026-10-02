// Derived, never stored: progress, readiness, compliance, company knowledge score.
import type { Project, AppState, Section, Criterion } from './types';
import { daysUntil, wordCount } from './util';
const INFO = /\[(?:Información requerida|Information required)/;

export type ProjectStatus = 'Analizando' | 'Error en el análisis' | 'En preparación' | 'Falta información' | 'Lista para revisar' | 'Lista para presentar';

export const SECTION_WEIGHT: Record<Section['status'], number> = { not_started: 0, generating: 0.1, draft: 0.4, ai_generated: 0.6, reviewed: 0.85, rejected: 0.2, approved: 1 };

export function reqCounts(p: Project) {
  const c = { total: p.requirements.length, fulfilled: 0, needs_info: 0, missing: 0, skipped: 0 };
  p.requirements.forEach((r) => { c[r.status]++; });
  return c;
}

export function sectionCounts(p: Project) {
  const c = { total: p.sections.length, approved: 0, reviewed: 0, ai: 0, notStarted: 0, withMissing: 0 };
  p.sections.forEach((s) => {
    if (s.status === 'approved') c.approved++;
    else if (s.status === 'reviewed') c.reviewed++;
    else if (s.status === 'ai_generated' || s.status === 'draft') c.ai++;
    else c.notStarted++;
    if (s.missing.length || INFO.test(s.content)) c.withMissing++;
  });
  return c;
}

export interface CheckItem { id: string; label: string; state: 'pass' | 'warn' | 'fail'; detail: string; action?: { label: string; tab: string; manual?: string } }

export function estimatePages(p: Project) {
  const words = p.sections.reduce((a, s) => a + wordCount(s.content), 0);
  return Math.ceil(words / 480) + p.sections.length * 0.25; // Arial 11, headings and spacing
}

export function pageLimitNumber(p: Project): number | null {
  const m = p.analysis?.pageLimit?.match(/(\d{1,3})\s*(pages?|p[áa]ginas?)/i);
  return m ? parseInt(m[1]) : null;
}

const PRICE_LEAK = /(€\s?\d|\d[\d.,]*\s?(€|eur\b|euros)|unit price|precio unitario)/i;

export function complianceChecks(p: Project): CheckItem[] {
  const docReqs = p.requirements.filter((r) => ['administrative', 'legal', 'certification'].includes(r.category));
  const docOpen = docReqs.filter((r) => r.status === 'missing' || r.status === 'needs_info');
  const compReqs = p.requirements.filter((r) => ['experience', 'financial', 'team'].includes(r.category) && !/offer|price|precio|oferta/i.test(r.title + r.text));
  const compOpen = compReqs.filter((r) => r.status === 'missing' || r.status === 'needs_info');
  const sec = sectionCounts(p);
  const secDone = sec.approved + sec.reviewed;
  const judgement = p.criteria.filter((c) => c.kind === 'judgement');
  const uncovered = judgement.filter((c) => criterionCoverage(p, c) === 'weak');
  const limit = pageLimitNumber(p);
  const est = estimatePages(p);
  const leaks = p.sections.filter((s) => PRICE_LEAK.test(s.content));
  const unreadable = p.docs.filter((d) => d.status === 'unreadable' || d.status === 'unsupported');
  const uncertain = p.requirements.filter((r) => r.uncertain && r.status !== 'skipped');
  const items: CheckItem[] = [
    { id: 'docs', label: 'Toda la documentación obligatoria subida', state: docOpen.length ? (docOpen.some((r) => r.status === 'missing') ? 'fail' : 'warn') : 'pass', detail: docOpen.length ? `${docOpen.length} requisito${docOpen.length > 1 ? 's' : ''} administrativo${docOpen.length > 1 ? 's' : ''} o de certificación pendiente${docOpen.length > 1 ? 's' : ''}` : `${docReqs.length} requisitos documentales cubiertos`, action: docOpen.length ? { label: 'Ver requisitos', tab: 'requirements' } : undefined },
    { id: 'company', label: 'Requisitos de empresa cumplidos', state: compOpen.length ? (compOpen.some((r) => r.status === 'missing') ? 'fail' : 'warn') : 'pass', detail: compOpen.length ? `${compOpen.length} requisito${compOpen.length > 1 ? 's' : ''} de solvencia, experiencia o equipo pendiente${compOpen.length > 1 ? 's' : ''}` : 'Solvencia, experiencia y equipo cubiertos', action: compOpen.length ? { label: 'Resolver', tab: 'requirements' } : undefined },
    { id: 'technical', label: 'Memoria técnica completa', state: secDone === sec.total && !sec.withMissing ? 'pass' : secDone === 0 ? 'fail' : 'warn', detail: `${secDone} de ${sec.total} secciones revisadas o aprobadas${sec.withMissing ? ` · ${sec.withMissing} con información pendiente` : ''}`, action: secDone === sec.total && !sec.withMissing ? undefined : { label: 'Ver propuesta', tab: 'proposal' } },
    { id: 'criteria', label: 'Criterios de adjudicación cubiertos', state: judgement.length === 0 ? 'warn' : uncovered.length ? 'warn' : 'pass', detail: judgement.length === 0 ? 'No se han identificado criterios con puntuación: revisa los criterios de adjudicación' : uncovered.length ? `${uncovered.length} criterio${uncovered.length > 1 ? 's' : ''} sin una sección redactada` : `Los ${judgement.length} criterios de juicio de valor están cubiertos`, action: uncovered.length ? { label: 'Ver criterios', tab: 'criteria' } : undefined },
    { id: 'pages', label: 'Límite de páginas comprobado', state: limit ? (est <= limit ? 'pass' : 'fail') : 'pass', detail: limit ? `Estimadas ${Math.round(est)} de ${limit} páginas` : 'Los pliegos no indican límite de páginas' },
    { id: 'price', label: 'Sin información de precio en la memoria técnica', state: leaks.length ? 'fail' : 'pass', detail: leaks.length ? `Importes encontrados en: ${leaks.map((s) => s.title).join(', ')}` : 'No hay importes en las secciones técnicas', action: leaks.length ? { label: 'Revisar secciones', tab: 'proposal' } : undefined },
    { id: 'formats', label: 'Formatos de archivo comprobados', state: unreadable.length ? 'warn' : 'pass', detail: unreadable.length ? `${unreadable.length} documento${unreadable.length > 1 ? 's' : ''} de la licitación no se ha${unreadable.length > 1 ? 'n' : ''} podido leer` : 'Paquete exportado en PDF; documentos de origen legibles' },
    { id: 'sources', label: 'Requisitos verificados contra el pliego', state: uncertain.length ? 'warn' : 'pass', detail: uncertain.length ? `${uncertain.length} marcados como «Extracción dudosa»` : 'Cada requisito coincide con su página de origen' , action: uncertain.length ? { label: 'Revisar', tab: 'requirements' } : undefined },
    { id: 'signature', label: 'Firma pendiente', state: p.manualChecks.signature ? 'pass' : 'warn', detail: p.manualChecks.signature ? 'Firmante confirmado por tu equipo' : 'Confirma quién firma con firma electrónica cualificada', action: p.manualChecks.signature ? undefined : { label: 'Confirmar firmante', tab: 'compliance', manual: 'signature' } },
    { id: 'financial', label: 'Oferta económica aprobada', state: p.manualChecks.financialApproved ? 'pass' : 'fail', detail: p.manualChecks.financialApproved ? 'Aprobada por tu equipo' : 'Los precios los fija y aprueba una persona', action: p.manualChecks.financialApproved ? undefined : { label: 'Aprobar oferta', tab: 'compliance', manual: 'financialApproved' } },
  ];
  return items;
}

export function readiness(p: Project): number {
  if (p.stage === 'analyzing' || p.stage === 'failed') return 0;
  const rc = reqCounts(p);
  const reqScore = rc.total ? (rc.fulfilled + rc.skipped + rc.needs_info * 0.4) / rc.total : 0;
  const secScore = p.sections.length ? p.sections.reduce((a, s) => a + SECTION_WEIGHT[s.status] * (s.missing.length ? 0.85 : 1), 0) / p.sections.length : 0;
  const checks = complianceChecks(p);
  const chkScore = checks.reduce((a, c) => a + (c.state === 'pass' ? 1 : c.state === 'warn' ? 0.5 : 0), 0) / checks.length;
  return Math.round((reqScore * 0.45 + secScore * 0.35 + chkScore * 0.2) * 100);
}

export function projectStatus(p: Project): ProjectStatus {
  if (p.stage === 'analyzing') return 'Analizando';
  if (p.stage === 'failed') return 'Error en el análisis';
  if (p.markedReady) return 'Lista para presentar';
  const rc = reqCounts(p);
  const sc = sectionCounts(p);
  if (rc.missing > 0 && rc.missing + rc.needs_info >= 4 && readiness(p) < 70) return 'Falta información';
  if (sc.approved + sc.reviewed === sc.total && rc.missing === 0) return 'Lista para revisar';
  return 'En preparación';
}

export function statusTone(s: ProjectStatus): 'ok' | 'warn' | 'bad' | 'accent' | 'neutral' {
  switch (s) {
    case 'Lista para presentar': return 'ok';
    case 'Lista para revisar': return 'accent';
    case 'Falta información': return 'warn';
    case 'Error en el análisis': return 'bad';
    default: return 'neutral';
  }
}

export function issuesCount(p: Project) {
  const rc = reqCounts(p);
  return rc.missing + complianceChecks(p).filter((c) => c.state === 'fail').length;
}

export function criterionCoverage(p: Project, c: Criterion): Criterion['coverage'] {
  if (c.kind === 'formula') return 'n/a';
  if (p.isSample && c.howAddressed.length) return c.coverage;
  const secs = p.sections.filter((s) => c.addressedBy.includes(s.id) || s.criteria.includes(c.id));
  if (!secs.length) return 'weak';
  const w = secs.reduce((a, s) => a + SECTION_WEIGHT[s.status] * (s.missing.length ? 0.7 : 1), 0) / secs.length;
  return w >= 0.8 ? 'strong' : w >= 0.4 ? 'partial' : 'weak';
}

export function deadlineLabel(iso: string | null | undefined) {
  const d = daysUntil(iso);
  if (d == null) return 'Sin plazo';
  if (d < 0) return 'Cerrada';
  if (d === 0) return 'Hoy';
  return `${d} día${d === 1 ? '' : 's'}`;
}

export function pendingAITasks(state: AppState) {
  return state.projects.reduce((a, p) => a + p.sections.filter((s) => s.status === 'ai_generated' || s.status === 'generating').length, 0);
}

export function knowledgeScore(s: Pick<AppState, 'company' | 'pastProjects' | 'certifications' | 'team' | 'vault'>) {
  const c = s.company;
  const infoFields = [c.legalName, c.taxId, c.address, c.industry, c.employees, c.revenue, c.website, c.description];
  const parts = [
    { label: 'Datos de empresa', weight: 20, value: infoFields.filter(Boolean).length / infoFields.length },
    { label: 'Proyectos previos', weight: 25, value: Math.min(1, s.pastProjects.length / 4) },
    { label: 'Certificaciones', weight: 15, value: Math.min(1, s.certifications.length / 2) },
    { label: 'Equipo', weight: 15, value: Math.min(1, s.team.length / 4) },
    { label: 'Documentos', weight: 20, value: Math.min(1, s.vault.length / 10) },
    { label: 'Capacidades', weight: 5, value: Math.min(1, c.capabilities.length / 3) },
  ];
  const score = Math.round(parts.reduce((a, p) => a + p.weight * p.value, 0));
  return { score, parts };
}
