// Application actions. In production each maps to a server route / server action
// that checks the session, the workspace membership and the plan limits.
import type { AppState, Project, ProjectType, SourceDoc, VaultCategory, VaultDoc, Section, Requirement } from './types';
import { getState, update, updateProject, navigate, track, notify, toast } from './store';
import { PLANS } from './plans';
import { parseFile, type ParsedDoc } from './pipeline/parse';
import { putPages, deletePages, putFile, getFile } from './storage';
import { analyzeDocuments, generateSection, projectPages, STAGES, type StageId } from './ai/engine';
import { AIError, friendlyAIError, ai, aiState, getSample } from './ai/provider';
import { estimatePages, pageLimitNumber } from './derive';
import { regionLabel } from './discovery/match';
import { wordCount } from './util';
import { uid, nowIso, daysUntil } from './util';
import type { Knowledge } from './pipeline/matching';

export function knowledgeOf(s: AppState): Knowledge {
  return { company: s.company, pastProjects: s.pastProjects, certifications: s.certifications, team: s.team, vault: s.vault };
}

// ---------------------------------------------------------------------------
// Plan limits (server-enforced in production; see server/billing/limits.ts)

export type LimitReason = 'trial_used' | 'trial_expired' | 'limit_reached' | 'no_plan' | 'past_due';

export function subscriptionActive(s: AppState) {
  const sub = s.subscription;
  if (sub.status === 'trialing') return (daysUntil(sub.trialEndsAt) ?? 0) >= 0;
  return sub.status === 'active';
}

export function canCreateProposal(s: AppState): { ok: true } | { ok: false; reason: LimitReason } {
  if (s.demo) return { ok: true };   // la demo no consume propuestas: se puede repetir el recorrido
  const sub = s.subscription;
  if (sub.status === 'past_due') return { ok: false, reason: 'past_due' };
  if (sub.status === 'trialing') {
    if ((daysUntil(sub.trialEndsAt) ?? 0) < 0) return { ok: false, reason: 'trial_expired' };
    if (s.usage.proposalsCreated >= PLANS.trial.proposalsPerMonth) return { ok: false, reason: 'trial_used' };
    return { ok: true };
  }
  if (sub.status !== 'active' || sub.plan === 'free' || sub.plan === 'trial') return { ok: false, reason: 'no_plan' };
  if (s.usage.proposalsCreated >= PLANS[sub.plan].proposalsPerMonth) return { ok: false, reason: 'limit_reached' };
  return { ok: true };
}

export function currentPlan(s: AppState) { return PLANS[s.subscription.plan]; }

export function aiActionsLeft(s: AppState, p: Project) {
  if (p.isSample) return Infinity;
  return Math.max(0, currentPlan(s).aiActionsPerProposal - p.aiActionsUsed);
}

// ---------------------------------------------------------------------------
// Vault

export async function addVaultFiles(files: File[], category: VaultCategory): Promise<{ added: number; failed: { name: string; note: string }[] }> {
  const failed: { name: string; note: string }[] = [];
  const docs: VaultDoc[] = [];
  for (const f of files) {
    const parsed = await parseFile(f);
    for (const p of parsed) {
      if (p.status === 'unsupported' || p.status === 'unreadable') {
        // Unreadable documents are still stored (they can be attached to a package), with a warning.
        if (p.status === 'unsupported') { failed.push({ name: p.name, note: p.note ?? 'Archivo no compatible' }); continue; }
      }
      const id = uid('v');
      const key = `vault:${id}`;
      if (p.pages.length) await putPages(key, p.pages);
      if (parsed.length === 1) await putFile(key, await f.arrayBuffer());
      docs.push({ id, name: p.name, category, uploadedAt: nowIso(), pages: p.pages.length || 1, sizeKb: p.sizeKb, usedIn: 0, hasFile: true, textKey: key });
      if (p.status === 'unreadable') failed.push({ name: p.name, note: `Guardado, pero no se ha podido leer el texto: ${p.note}` });
    }
  }
  if (docs.length) {
    update((s) => { s.vault.unshift(...docs); if (!s.onboarding.completedSteps.includes('documents')) s.onboarding.completedSteps.push('documents'); });
    track('document_uploaded', { count: docs.length, category });
  }
  return { added: docs.length, failed };
}

export function removeVaultDoc(id: string) {
  const d = getState().vault.find((v) => v.id === id);
  if (d?.textKey) deletePages(d.textKey);
  update((s) => { s.vault = s.vault.filter((v) => v.id !== id); s.events.unshift({ at: nowIso(), name: 'audit.document_deleted', props: { name: d?.name } }); });
}

// ---------------------------------------------------------------------------
// Projects

const pendingFiles = new Map<string, File[]>();

export function createProject(meta: { name: string; organization: string; type: ProjectType; tenderId?: string; tender?: Project['tender'] }, files: File[]) {
  const s = getState();
  const check = canCreateProposal(s);
  if (!check.ok) return check;
  const id = uid('p');
  const project: Project = {
    id, name: meta.name.trim(), organization: meta.organization.trim(), type: meta.type, tenderId: meta.tenderId, tender: meta.tender, createdAt: nowIso(), isSample: false,
    stage: 'analyzing', docs: [], analysis: null, requirements: [], criteria: [], sections: [], manualChecks: { signature: false, financialApproved: false },
    markedReady: null, chat: [], activity: [{ at: nowIso(), text: `${files.length} archivo${files.length === 1 ? '' : 's'} subido${files.length === 1 ? '' : 's'}` }], aiActionsUsed: 0,
  };
  pendingFiles.set(id, files);
  update((st) => { st.projects.unshift(project); st.usage.proposalsCreated++; });
  track('project_created', { type: meta.type, files: files.length, ...(meta.tenderId ? { tenderId: meta.tenderId } : {}) });
  navigate(`/app/analyze/${id}`);
  return { ok: true as const, id };
}

export function hasPendingFiles(id: string) { return pendingFiles.has(id); }

/** Añade documentos a un proyecto ya analizado (p. ej. los pliegos tras empezar con la ficha) y lo vuelve a analizar. */
export async function addDocumentsAndReanalyze(id: string, files: File[]) {
  const p = getState().projects.find((x) => x.id === id);
  if (!p || !files.length) return;
  const existing: File[] = [];
  for (const d of p.docs) {
    if (!d.textKey) continue;
    const buf = await getFile(d.textKey);
    if (buf) existing.push(new File([buf], d.name));
  }
  const names = new Set(files.map((f) => f.name));
  pendingFiles.set(id, [...existing.filter((f) => !names.has(f.name)), ...files]);
  updateProject(id, (pr) => { pr.stage = 'analyzing'; pr.activity.unshift({ at: nowIso(), text: `${files.length} documento${files.length === 1 ? '' : 's'} añadido${files.length === 1 ? '' : 's'}; nuevo análisis` }); });
  track('project_documents_added', { files: files.length });
  navigate(`/app/analyze/${id}`);
}

export interface AnalysisProgress { stage: StageId | 'done' | 'error'; detail: Record<string, string>; error?: string; files?: ParsedDoc[]; pages?: number }

export async function runAnalysis(id: string, onProgress: (p: AnalysisProgress) => void, signal?: AbortSignal, forceRules = false) {
  const files = pendingFiles.get(id);
  const detail: Record<string, string> = {};
  if (!files) { onProgress({ stage: 'error', detail, error: 'interrupted' }); return; }
  const s0 = getState();
  const plan = currentPlan(s0);
  try {
    // 1. ingestion + parsing
    onProgress({ stage: 'read', detail: { read: 'Opening files' } });
    const parsed: ParsedDoc[] = [];
    const originals = new Map<ParsedDoc, File>();
    for (const f of files) {
      const res = await parseFile(f, (m) => onProgress({ stage: 'read', detail: { ...detail, read: m } }));
      if (res.length === 1) originals.set(res[0], f);
      parsed.push(...res);
    }
    const docs: SourceDoc[] = [];
    const pages = new Map<string, string[]>();
    for (const p of parsed) {
      const docId = uid('d');
      const key = `project:${id}:${docId}`;
      if (p.pages.length) { await putPages(key, p.pages); pages.set(docId, p.pages); }
      const orig = originals.get(p);
      if (orig) await putFile(key, await orig.arrayBuffer());
      docs.push({ id: docId, name: p.name, kind: p.kind, pages: p.pages.length, sizeKb: p.sizeKb, status: p.status, note: p.note, textKey: key });
    }
    const readable = docs.filter((d) => d.status === 'parsed' || d.status === 'partial');
    if (!readable.length) {
      updateProject(id, (pr) => { pr.docs = docs; pr.stage = 'failed'; });
      onProgress({ stage: 'error', detail, error: 'unreadable', files: parsed });
      return;
    }
    const totalPages = docs.reduce((a, d) => a + d.pages, 0);
    if (totalPages > plan.pagesPerProposal) detail.limit = `Tu plan analiza hasta ${plan.pagesPerProposal} páginas por propuesta. PROPO ha priorizado las ${plan.pagesPerProposal} más relevantes de ${totalPages}.`;
    // 2..6 extraction, matching, structure
    const out = await analyzeDocuments({
      projectId: getState().projects.find((x) => x.id === id)?.isSample ? '' : id,
      docs, pages, knowledge: knowledgeOf(getState()), maxPages: plan.pagesPerProposal, signal, forceRules,
      onStage: (stage, d) => { if (d) detail[stage] = d; onProgress({ stage, detail: { ...detail }, pages: Math.min(totalPages, plan.pagesPerProposal) }); },
    });
    if (detail.limit) out.analysis.warnings.unshift(detail.limit);
    {                                                            // el contrato se ejecuta fuera de donde trabaja la empresa: mejor saberlo antes de redactar
      const tender = getState().projects.find((x) => x.id === id)?.tender;
      const zones = getState().company.regions;
      if (tender?.nuts?.startsWith('ES') && zones.length && !zones.some((z) => tender.nuts.startsWith(z))) out.analysis.warnings.unshift(`Este contrato se ejecuta en ${regionLabel(tender.nuts)}${tender.city && tender.city !== 'No consta' ? ` (${tender.city})` : ''}, fuera de la zona de trabajo que tienes en tu perfil. Antes de seguir, valora si puedes prestar el servicio allí con tus medios o con un colaborador local.`);
    }
    updateProject(id, (pr) => {
      pr.docs = docs; pr.analysis = out.analysis; pr.requirements = out.requirements; pr.criteria = out.criteria; pr.sections = out.sections;
      pr.stage = 'active'; pr.aiActionsUsed += out.aiActions;
      pr.activity.unshift({ at: nowIso(), text: `Análisis completado: ${out.requirements.length} requisitos y ${out.criteria.length} criterios de adjudicación (${out.analysis.mode === 'ai' ? 'IA' : 'extracción básica'})` });
    });
    update((s) => { s.usage.pagesAnalyzed += totalPages; s.usage.aiActions += out.aiActions; });
    pendingFiles.delete(id);
    track('analysis_completed', { mode: out.analysis.mode, requirements: out.requirements.length, pages: totalPages });
    if (out.aiError && out.aiError !== 'unavailable') toast(friendlyAIError(out.aiError), 'warn');
    notify({ kind: 'ai_done', title: 'Análisis completado', body: `${out.requirements.length} requisitos encontrados en ${getState().projects.find((p) => p.id === id)?.name}.`, projectId: id });
    onProgress({ stage: 'done', detail });
  } catch (e) {
    if (e instanceof AIError && e.code === 'cancelled') { onProgress({ stage: 'error', detail, error: 'cancelled' }); return; }
    console.error(e);
    updateProject(id, (pr) => { pr.stage = 'failed'; });
    track('analysis_failed');
    onProgress({ stage: 'error', detail, error: 'processing' });
  }
}

export function deleteProject(id: string) {
  const p = getState().projects.find((x) => x.id === id);
  p?.docs.forEach((d) => d.textKey && deletePages(d.textKey));
  pendingFiles.delete(id);
  update((s) => { s.projects = s.projects.filter((x) => x.id !== id); s.events.unshift({ at: nowIso(), name: 'audit.project_deleted', props: { name: p?.name } }); });
}

export { STAGES };

// ---------------------------------------------------------------------------
// Sections (human-in-the-loop)

const running = new Map<string, AbortController>();

export function isGenerating(projectId: string, sectionId: string) { return running.has(projectId + sectionId); }

export async function runGenerate(projectId: string, sectionId: string, regenerate = false, quiet = false) {
  const s = getState();
  const p = s.projects.find((x) => x.id === projectId);
  if (!p) return;
  if (aiActionsLeft(s, p) <= 0) { toast('Esta propuesta ha llegado al límite de acciones de IA de tu plan. Edita las secciones a mano o mejora tu plan.', 'warn'); return; }
  const sec = p.sections.find((x) => x.id === sectionId);
  if (!sec) return;
  const ctl = new AbortController();
  running.set(projectId + sectionId, ctl);
  const prevStatus = sec.status;
  updateProject(projectId, (pr) => { const x = pr.sections.find((y) => y.id === sectionId)!; x.status = 'generating'; });
  try {
    const pages = await projectPages(p);
    const out = await generateSection({ project: p, section: sec, knowledge: knowledgeOf(getState()), pages, regenerate, signal: ctl.signal, demo: !!getState().demo });
    updateProject(projectId, (pr) => {
      const x = pr.sections.find((y) => y.id === sectionId)!;
      x.content = out.content; x.citations = out.citations; x.missing = out.missing; x.confidence = out.confidence;
      x.status = out.generatedBy === 'ai' ? 'ai_generated' : 'draft'; x.generatedBy = out.generatedBy; x.updatedAt = nowIso();
      pr.aiActionsUsed += out.generatedBy === 'ai' ? 1 : 0;
      pr.activity.unshift({ at: nowIso(), text: `${x.title} ${regenerate ? 'regenerada' : 'redactada'} (${out.generatedBy === 'ai' ? 'IA' : 'plantilla'})` });
    });
    update((st) => { st.usage.aiActions += out.generatedBy === 'ai' ? 1 : 0; });
    track('section_generated', { mode: out.generatedBy, regenerate });
    if (quiet) { /* el asistente informa en la conversación */ }
    else if (out.aiError) toast(friendlyAIError(out.aiError), 'warn');
    else if (out.warnings.length) toast(out.warnings[0], out.generatedBy === 'ai' ? 'warn' : 'neutral');
  } catch (e) {
    const code = e instanceof AIError ? e.code : 'upstream_error';
    updateProject(projectId, (pr) => { const x = pr.sections.find((y) => y.id === sectionId)!; x.status = prevStatus; });
    if (code !== 'cancelled') toast(friendlyAIError(code), 'bad');
  } finally {
    running.delete(projectId + sectionId);
  }
}

/** Resume con IA las secciones para que la propuesta quepa en el límite de páginas del pliego. No cambia el estado de
 *  las secciones: lo aprobado sigue aprobado. Devuelve si ha quedado dentro del límite. */
export async function shortenProposal(projectId: string, onProgress: (done: number, total: number, title: string) => void): Promise<{ ok: boolean; pages: number; limit: number | null; error?: string }> {
  const get = () => getState().projects.find((x) => x.id === projectId)!;
  let p = get();
  const limit = pageLimitNumber(p);
  if (!limit) return { ok: true, pages: estimatePages(p), limit };
  const sample = await getSample();
  if (!sample || aiState() === 'declined') return { ok: false, pages: estimatePages(p), limit, error: 'not_available' };
  const WORDS_PER_PAGE = 480;                                          // la misma cuenta que estimatePages
  for (let pass = 0; pass < 3; pass++) {
    p = get();
    if (estimatePages(p) <= limit) break;
    const secs = p.sections.filter((x) => wordCount(x.content) > 60);
    const total = p.sections.reduce((a, x) => a + wordCount(x.content), 0);
    const allowed = Math.max(secs.length * 80, (limit - p.sections.length * 0.25) * WORDS_PER_PAGE * [0.9, 0.8, 0.7][pass]);
    const ratio = Math.min(0.95, allowed / total);
    let i = 0;
    for (const sec of secs) {
      onProgress(i++, secs.length, sec.title);
      const target = Math.max(80, Math.round(wordCount(sec.content) * ratio));
      const crits = p.criteria.filter((c) => sec.criteria.includes(c.id)).map((c) => `${c.name} (${c.points} pts)`).join('; ');
      try {
        const out = await ai.text([
          `Eres PROPO, redactor de ofertas para licitaciones públicas en España. Esta sección de una memoria técnica es demasiado larga para el límite de páginas del pliego. Reescríbela en ${target} palabras como máximo: ahora tiene ${wordCount(sec.content)}, así que tienes que quitar alrededor del ${Math.round((1 - ratio) * 100)} % del texto. El límite de palabras manda sobre todo lo demás: si no cabe, la oferta puede quedar excluida.`,
          'Cómo acortar sin perder puntos:',
          '- Dentro de ese límite, conserva por este orden lo que más puntúa: los compromisos concretos con sus cifras y plazos, los nombres y medios asignados, y una respuesta breve a cada criterio de valoración. Quita primero introducciones, repeticiones, explicaciones obvias y relleno; después funde apartados y deja solo lo esencial de cada uno.',
          '- Mantén los subtítulos «## » que responden a criterios y el apartado «## Compromisos verificables» (puedes fundir puntos parecidos). Convierte párrafos largos en listas o tablas breves si ocupan menos.',
          '- No añadas información nueva ni cambies ningún dato, cifra o compromiso.',
          '- Conserva las marcas de fuente como [S1] junto a la frase que apoyan, y las marcas [Información requerida: …] tal cual si las hay.',
          '- Mismo formato (párrafos, «## », «- », «1. », **negrita**, tablas markdown) y mismo tono, en castellano de España.',
          '- Antes de responder, cuenta las palabras: si pasas del máximo, recorta más.',
          '- Responde ÚNICAMENTE con el texto final de la sección, sin comentarios.',
          '',
          `Sección: ${sec.title}`,
          crits ? `Criterios que puntúan en esta sección: ${crits}` : '',
          `Texto actual:\n${sec.content}`,
        ].filter((x) => x !== '').join('\n'), { tier: 'default', project: p.isSample ? '' : projectId });
        const text = out.text.trim().replace(/^```\w*\n?|```$/g, '').trim();
        if (text && wordCount(text) < wordCount(sec.content)) {
          const valid = new Set(sec.citations.map((c) => c.marker));
          const clean = text.replace(/\s?\[(S\d+)\]/g, (m, id) => (valid.has(id) ? m : ''));
          updateProject(projectId, (pr) => {
            const x = pr.sections.find((y) => y.id === sec.id)!;
            x.content = clean; x.updatedAt = nowIso();
            x.missing = [...new Set([...clean.matchAll(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g)].map((m) => m[1].trim()))];
            pr.aiActionsUsed += 1;
          });
        }
      } catch (e) {
        return { ok: false, pages: estimatePages(get()), limit, error: e instanceof AIError ? e.code : 'upstream_error' };
      }
    }
    onProgress(secs.length, secs.length, '');
  }
  p = get();
  const pages = estimatePages(p);
  updateProject(projectId, (pr) => { pr.activity.unshift({ at: nowIso(), text: `PROPO ha resumido la propuesta para ajustarla al límite de ${limit} páginas (ahora unas ${Math.round(pages)})` }); });
  track('proposal_shortened', { ok: pages <= limit });
  return { ok: pages <= limit, pages, limit };
}

export function stopGenerate(projectId: string, sectionId: string) { running.get(projectId + sectionId)?.abort(); }

export function setSectionStatus(projectId: string, sectionId: string, status: Section['status']) {
  const who = getState().user?.name ?? 'tu equipo';
  const LBL: Record<string, string> = { approved: 'aprobada', rejected: 'rechazada', reviewed: 'revisada', draft: 'en borrador', ai_generated: 'generada por IA' };
  updateProject(projectId, (pr) => {
    const x = pr.sections.find((y) => y.id === sectionId)!;
    x.status = status; x.updatedAt = nowIso();
    pr.activity.unshift({ at: nowIso(), text: `${x.title}: ${LBL[status] ?? status} por ${who}` });
  });
  track(`section_${status}`);
}

export function saveSectionContent(projectId: string, sectionId: string, content: string) {
  updateProject(projectId, (pr) => {
    const x = pr.sections.find((y) => y.id === sectionId)!;
    x.content = content; x.status = x.status === 'approved' ? 'reviewed' : x.status === 'not_started' ? 'draft' : 'reviewed';
    x.generatedBy = x.generatedBy ?? 'human'; x.updatedAt = nowIso();
    x.missing = [...content.matchAll(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g)].map((m) => m[1].trim());
  });
}

export function updateRequirement(projectId: string, reqId: string, patch: Partial<Requirement>, activity?: string) {
  updateProject(projectId, (pr) => {
    const r = pr.requirements.find((x) => x.id === reqId);
    if (!r) return;
    Object.assign(r, patch);
    if (activity) pr.activity.unshift({ at: nowIso(), text: activity });
  });
}

export function markReady(projectId: string) {
  updateProject(projectId, (pr) => { pr.markedReady = nowIso(); pr.activity.unshift({ at: nowIso(), text: `Marcada como lista para presentar por ${getState().user?.name ?? 'tu equipo'}` }); });
  track('proposal_completed', { projectId });
}
