// Orchestrates the PROPO pipeline:
// ingestion -> parsing -> chunking -> retrieval -> requirement extraction ->
// company knowledge matching -> generation -> validation -> human review.
import type { Project, Criterion, Section, Citation, ChatMsg, SourceDoc, Requirement, ProjectAnalysis } from '../types';
import type { ExtractionResult, DocPages } from '../pipeline/extractTypes';
import { ai, AIError, aiState, getSample } from './provider';
import { extractionPrompt, sectionPrompt, chatRules } from './prompts';
import { extractWithRules } from '../pipeline/extractRules';
import { chunkPages, search, quoteOnPage, type Passage } from '../pipeline/retrieval';
import { knowledgeForPrompt, knowledgeIndex, toRequirements, type Knowledge } from '../pipeline/matching';
import { getPages } from '../storage';
import { uid, nowIso, normalize, tokens, wordCount } from '../util';

export type StageId = 'read' | 'requirements' | 'deadlines' | 'criteria' | 'documents' | 'structure';
export const STAGES: { id: StageId; label: string }[] = [
  { id: 'read', label: 'Leyendo documentos' },
  { id: 'requirements', label: 'Extrayendo requisitos' },
  { id: 'deadlines', label: 'Identificando plazos' },
  { id: 'criteria', label: 'Analizando criterios de adjudicación' },
  { id: 'documents', label: 'Comprobando documentación obligatoria' },
  { id: 'structure', label: 'Construyendo la estructura de la propuesta' },
];

const SIGNAL = /(must|shall|required|mandatory|at least|minimum|maximum|points|criteria|deadline|exclu|certif|insurance|experience|solvency|annex|declaration|signature|pages|envelope|deber|obligatori|puntos|criterio|plazo|m[ií]nimo|solvencia)/gi;

export async function projectPages(project: Project): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  for (const d of project.docs) {
    if (d.textKey) {
      const pages = await getPages(d.textKey);
      if (pages) { map.set(d.id, pages); continue; }
    }
    if (d.excerpts) {
      const arr = Array.from({ length: d.pages }, (_, i) => d.excerpts![i + 1] ?? '');
      map.set(d.id, arr);
    }
  }
  return map;
}

export function projectPassages(project: Project, pages: Map<string, string[]>): Passage[] {
  return project.docs.flatMap((d) => chunkPages(d.id, d.name, pages.get(d.id) ?? []));
}

// ---------------------------------------------------------------------------
// Analysis
// ---------------------------------------------------------------------------

export interface AnalysisOutput {
  analysis: ProjectAnalysis;
  requirements: Requirement[];
  criteria: Criterion[];
  sections: Section[];
  aiActions: number;
}

function pickPages(docs: DocPages[], budgetChars: number, maxPages: number) {
  const all = docs.flatMap((d) => d.pages.map((text, i) => ({ doc: d, page: i + 1, text, score: (text.match(SIGNAL)?.length ?? 0) + (i < 3 ? 3 : 0) })));
  const nonEmpty = all.filter((p) => p.text.trim().length > 0);
  const total = nonEmpty.reduce((a, p) => a + p.text.length, 0);
  let chosen = nonEmpty;
  if (total > budgetChars || nonEmpty.length > maxPages) {
    const ranked = [...nonEmpty].sort((a, b) => b.score - a.score);
    chosen = [];
    let used = 0;
    for (const p of ranked) {
      if (chosen.length >= maxPages) break;
      const len = Math.min(p.text.length, 6000);
      if (used + len > budgetChars) continue;
      chosen.push(p); used += len;
    }
    chosen.sort((a, b) => docs.indexOf(a.doc) - docs.indexOf(b.doc) || a.page - b.page);
  }
  return { chosen, totalPages: nonEmpty.length };
}

function batches<T extends { text: string }>(items: T[], size: number) {
  const out: T[][] = []; let cur: T[] = []; let n = 0;
  for (const it of items) {
    const len = Math.min(it.text.length, 6000);
    if (n + len > size && cur.length) { out.push(cur); cur = []; n = 0; }
    cur.push(it); n += len;
  }
  if (cur.length) out.push(cur);
  return out;
}

function fromAIJson(j: any, docNames: string[]): ExtractionResult {
  const fixDoc = (name: string) => {
    if (!name) return docNames[0];
    const n = normalize(name);
    return docNames.find((d) => normalize(d) === n) ?? docNames.find((d) => normalize(d).includes(n) || n.includes(normalize(d))) ?? docNames[0];
  };
  const cats = ['administrative', 'technical', 'financial', 'experience', 'certification', 'format', 'legal', 'team'];
  const st = ['fulfilled', 'needs_info', 'missing'];
  return {
    summary: String(j?.summary ?? ''),
    authority: j?.authority ?? 'No identificado',
    reference: j?.reference ?? 'No identificada',
    cpv: j?.cpv ?? undefined, budget: j?.budget ?? undefined, duration: j?.duration ?? undefined,
    deadline: /^\d{4}-\d{2}-\d{2}/.test(j?.submission_deadline ?? '') ? new Date(j.submission_deadline + 'T12:00:00').toISOString() : null,
    deadlines: (Array.isArray(j?.deadlines) ? j.deadlines : []).filter((d: any) => /^\d{4}-\d{2}-\d{2}/.test(d?.date ?? '')).map((d: any) => ({ label: String(d.label || 'Deadline'), date: new Date(d.date + 'T12:00:00').toISOString(), docName: fixDoc(d.doc), page: Number(d.page) || undefined })),
    pageLimit: j?.page_limit ?? undefined,
    requirements: (Array.isArray(j?.requirements) ? j.requirements : []).filter((r: any) => r?.quote && r?.title).map((r: any) => ({
      title: String(r.title).slice(0, 90), category: cats.includes(r.category) ? r.category : 'technical', quote: String(r.quote), docName: fixDoc(r.doc), page: Math.max(1, Number(r.page) || 1),
      clause: r.clause || undefined, mandatory: r.mandatory !== false, critical: !!r.critical,
      match: r.match && st.includes(r.match.status) ? { status: r.match.status, evidenceIds: Array.isArray(r.match.evidence_ids) ? r.match.evidence_ids.map(String) : [], ask: r.match.ask || undefined } : undefined,
    })),
    criteria: (Array.isArray(j?.criteria) ? j.criteria : []).filter((c: any) => c?.name && Number(c.points) > 0).map((c: any) => ({ group: String(c.group || 'Criteria'), name: String(c.name), points: Number(c.points), kind: c.kind === 'formula' ? 'formula' : 'judgement', description: String(c.description || ''), docName: fixDoc(c.doc), page: Math.max(1, Number(c.page) || 1) })),
    requiredDocuments: (Array.isArray(j?.required_documents) ? j.required_documents : []).map(String),
    exclusionRisks: (Array.isArray(j?.exclusion_risks) ? j.exclusion_risks : []).map((e: any) => ({ text: String(e.text || e), docName: e.doc ? fixDoc(e.doc) : undefined, page: Number(e.page) || undefined })),
    structure: (Array.isArray(j?.proposal_structure) ? j.proposal_structure : []).filter((s: any) => s?.title).map((s: any) => ({ title: String(s.title), guidance: String(s.guidance || ''), criteria: Array.isArray(s.criteria) ? s.criteria.map(String) : [] })),
  };
}

function mergeExtractions(parts: ExtractionResult[]): ExtractionResult {
  const [first, ...rest] = parts;
  const out = { ...first, requirements: [...first.requirements], criteria: [...first.criteria], deadlines: [...first.deadlines], exclusionRisks: [...first.exclusionRisks], requiredDocuments: [...first.requiredDocuments] };
  for (const p of rest) {
    for (const k of ['authority', 'reference', 'cpv', 'budget', 'duration', 'pageLimit', 'deadline'] as const) {
      if ((!out[k] || /^No identificad/.test(String(out[k]))) && p[k]) (out as any)[k] = p[k];
    }
    if (!out.summary && p.summary) out.summary = p.summary;
    for (const r of p.requirements) if (!out.requirements.some((x) => normalize(x.quote).slice(0, 80) === normalize(r.quote).slice(0, 80))) out.requirements.push(r);
    for (const c of p.criteria) if (!out.criteria.some((x) => normalize(x.name) === normalize(c.name))) out.criteria.push(c);
    out.deadlines.push(...p.deadlines);
    out.exclusionRisks.push(...p.exclusionRisks.filter((e) => !out.exclusionRisks.some((x) => normalize(x.text) === normalize(e.text))));
    out.requiredDocuments.push(...p.requiredDocuments.filter((d) => !out.requiredDocuments.includes(d)));
    if (!out.structure.length) out.structure = p.structure;
  }
  return out;
}

export async function analyzeDocuments(opts: {
  docs: SourceDoc[]; pages: Map<string, string[]>; knowledge: Knowledge; maxPages: number;
  onStage: (id: StageId, detail?: string) => void; signal?: AbortSignal; forceRules?: boolean;
}): Promise<AnalysisOutput & { aiError?: string }> {
  const { docs, pages, knowledge } = opts;
  const readable = docs.filter((d) => d.status === 'parsed' || d.status === 'partial');
  const docPages: DocPages[] = readable.map((d) => ({ id: d.id, name: d.name, pages: pages.get(d.id) ?? [] }));
  const totalPages = docs.reduce((a, d) => a + d.pages, 0);
  opts.onStage('read', `${docPages.length} documentos legibles, ${totalPages} páginas`);
  const warnings: string[] = [];
  const unreadable = docs.filter((d) => d.status === 'unreadable' || d.status === 'unsupported');
  if (unreadable.length) warnings.push(`${unreadable.length} documento${unreadable.length > 1 ? 's no se han' : ' no se ha'} podido leer ni analizar: ${unreadable.map((d) => d.name).join(', ')}.`);

  let ex: ExtractionResult | null = null;
  let mode: ProjectAnalysis['mode'] = 'rules';
  let aiError: string | undefined;
  let aiActions = 0;
  const sample = opts.forceRules ? null : await getSample();

  if (sample && aiState() !== 'declined' && docPages.length) {
    opts.onStage('requirements', 'La IA está leyendo las páginas más relevantes');
    const { chosen, totalPages: tp } = pickPages(docPages, 230_000, opts.maxPages);
    if (chosen.length < tp) warnings.push(`PROPO ha analizado las ${chosen.length} páginas más relevantes de ${tp}. Revisa el resto por si hay requisitos fuera de las cláusulas principales.`);
    const kjson = JSON.stringify(knowledgeForPrompt(knowledge));
    const parts = batches(chosen, 115_000).slice(0, 2);
    try {
      const results: ExtractionResult[] = [];
      for (let i = 0; i < parts.length; i++) {
        const block = parts[i].map((p) => `<<<DOC "${p.doc.name}" | PAGE ${p.page}>>>\n${p.text.slice(0, 6000)}`).join('\n\n');
        const j = await ai.json<any>(extractionPrompt(kjson, block, i + 1, parts.length), { tier: 'default', signal: opts.signal });
        aiActions++;
        results.push(fromAIJson(j, docPages.map((d) => d.name)));
        opts.onStage('requirements', `Bloque ${i + 1} de ${parts.length} analizado`);
      }
      ex = mergeExtractions(results);
      mode = 'ai';
      if (!ex.requirements.length) { ex = null; aiError = 'empty'; }
    } catch (e) {
      if (e instanceof AIError && e.code === 'cancelled') throw e;
      aiError = e instanceof AIError ? e.code : 'upstream_error';
      ex = null;
    }
  }
  if (!ex) {
    opts.onStage('requirements', 'Extracción básica por reglas');
    ex = extractWithRules(docPages);
    mode = 'rules';
    warnings.unshift(aiError
      ? 'El análisis con IA no estaba disponible, así que PROPO ha usado la extracción básica por reglas. Revisa la lista de requisitos con atención.'
      : 'Modo de extracción básica: los requisitos se han detectado por la redacción de los documentos. Abre PROPO dentro de claude.ai para usar el análisis con IA.');
  }

  opts.onStage('deadlines', ex.deadline ? 'Fecha límite encontrada' : 'No se ha encontrado la fecha límite: añádela');
  await tick();
  opts.onStage('criteria', `${ex.criteria.length} criterios de adjudicación`);
  await tick();

  const byName = new Map(docs.map((d) => [d.name, d.id]));
  const requirements = toRequirements(ex, byName, pages, knowledge, quoteOnPage);
  const uncertain = requirements.filter((r) => r.uncertain).length;
  if (uncertain) warnings.push(`${uncertain} requisito${uncertain > 1 ? 's no coinciden' : ' no coincide'} literalmente con su página de origen. Aparecen marcados como «Extracción dudosa» para que los revises.`);
  opts.onStage('documents', `${ex.requiredDocuments.length || requirements.filter((r) => ['administrative', 'legal', 'certification'].includes(r.category)).length} documentos obligatorios`);
  await tick();

  const criteria: Criterion[] = ex.criteria.map((c, i) => {
    const docId = byName.get(c.docName) ?? docs[0]?.id ?? 'unknown';
    return {
      id: `k${i + 1}`, group: c.group, name: c.name, points: c.points, kind: c.kind, description: c.description,
      source: { docId, docName: c.docName, page: c.page, quote: c.description, verified: quoteOnPage(pages.get(docId)?.[c.page - 1], c.description) },
      coverage: c.kind === 'formula' ? 'n/a' : 'weak', addressedBy: [], howAddressed: [], gaps: [],
    };
  });
  const sections: Section[] = (ex.structure.length ? ex.structure : extractWithRules([]).structure).map((s, i) => {
    const crit = criteria.filter((c) => s.criteria.some((n) => normalize(n) === normalize(c.name) || normalize(c.name).includes(normalize(n))));
    return { id: `sec_${i + 1}`, title: s.title, guidance: s.guidance, status: 'not_started', content: '', confidence: null, citations: [], criteria: crit.map((c) => c.id), missing: [] };
  });
  // link criteria to sections (fallback: by token overlap)
  criteria.forEach((c) => {
    c.addressedBy = sections.filter((s) => s.criteria.includes(c.id)).map((s) => s.id);
    if (!c.addressedBy.length && c.kind === 'judgement') {
      const ct = tokens(c.name + ' ' + c.description);
      const best = sections.map((s) => ({ s, n: tokens(s.title + ' ' + s.guidance).filter((t) => ct.includes(t)).length })).sort((a, b) => b.n - a.n)[0];
      if (best && best.n > 0) { c.addressedBy = [best.s.id]; best.s.criteria.push(c.id); }
    }
  });
  opts.onStage('structure', `${sections.length} secciones de propuesta`);
  await tick();

  const analysis: ProjectAnalysis = {
    mode, summary: ex.summary, authority: ex.authority, reference: ex.reference, cpv: ex.cpv, budget: ex.budget, duration: ex.duration,
    deadline: ex.deadline, deadlines: ex.deadlines.map((d) => ({ label: d.label, date: d.date, source: d.docName ? { docId: byName.get(d.docName) ?? '', docName: d.docName, page: d.page ?? 1 } : undefined })),
    documentsAnalyzed: readable.length, pages: totalPages,
    requiredDocuments: ex.requiredDocuments.length || requirements.filter((r) => ['administrative', 'legal', 'certification'].includes(r.category)).length,
    pageLimit: ex.pageLimit,
    exclusionRisks: ex.exclusionRisks.map((e) => ({ text: e.text, source: e.docName ? { docId: byName.get(e.docName) ?? '', docName: e.docName, page: e.page ?? 1 } : undefined })),
    warnings,
  };
  return { analysis, requirements, criteria, sections, aiActions, aiError };
}

const tick = () => new Promise((r) => setTimeout(r, 450));

// ---------------------------------------------------------------------------
// Section generation
// ---------------------------------------------------------------------------

export interface GenOutput { content: string; citations: Citation[]; missing: string[]; confidence: number; generatedBy: 'ai' | 'template'; warnings: string[]; aiError?: string; }

const PRICE_LEAK = /(€\s?\d|\d[\d.,]*\s?(€|eur\b|euros)|unit price|precio unitario|discount of|descuento del)/i;

export async function generateSection(opts: {
  project: Project; section: Section; knowledge: Knowledge; pages: Map<string, string[]>; regenerate?: boolean; signal?: AbortSignal;
}): Promise<GenOutput> {
  const { project, section, knowledge, pages } = opts;
  const crits = project.criteria.filter((c) => section.criteria.includes(c.id));
  const query = [section.title, section.guidance, ...crits.map((c) => c.name + ' ' + c.description)].join(' ');
  const reqPass = project.requirements.map((r) => ({ id: r.id, docId: r.source.docId, docName: r.source.docName, page: r.source.page, text: r.title + ' ' + r.text }));
  const linkedReqs = search(reqPass.filter((r) => !['format', 'legal', 'administrative'].includes(project.requirements.find((x) => x.id === r.id)!.category)), query, 6).map((p) => project.requirements.find((r) => r.id === p.id)!).filter(Boolean);
  const passages = search(projectPassages(project, pages), query + ' ' + linkedReqs.map((r) => r.title).join(' '), 6);
  const kIdx = knowledgeIndex(knowledge).filter((k) => k.kind === 'company');
  const kHits = search(kIdx.map((k) => ({ id: k.id, docId: 'company', docName: 'Company', page: 0, text: k.label + ' ' + k.text })), query, 5)
    .map((p) => kIdx.find((k) => k.id === p.id)!);

  const citations: Citation[] = [];
  let n = 0;
  for (const p of passages) citations.push({ marker: `S${++n}`, kind: 'tender', label: `${p.docName} — p. ${p.page}`, docId: p.docId, page: p.page, quote: p.text.slice(0, 600) });
  for (const r of linkedReqs) if (!citations.some((c) => c.docId === r.source.docId && c.page === r.source.page)) citations.push({ marker: `S${++n}`, kind: 'tender', label: `${r.source.docName} — p. ${r.source.page}`, docId: r.source.docId, page: r.source.page, quote: r.text });
  if (knowledge.company.description) citations.push({ marker: `S${++n}`, kind: 'company', label: 'Perfil de empresa — descripción', quote: `${knowledge.company.legalName}: ${knowledge.company.description}` });
  for (const k of kHits) citations.push({ marker: `S${++n}`, kind: 'company', label: `Empresa — ${k.label}`, quote: k.text });

  const approvedExamples = project.sections.filter((s) => s.status === 'approved' && s.id !== section.id).length;
  const words = Math.min(450, Math.max(160, (section.pageBudget ?? 2) * 110));
  const sample = await getSample();
  if (sample && aiState() !== 'declined') {
    try {
      const j = await ai.json<any>(sectionPrompt({
        company: knowledge.company.legalName || 'the company', project: project.name, section: section.title, guidance: section.guidance,
        criteria: crits.map((c) => `- ${c.name} (${c.points} pts): ${c.description}`).join('\n'),
        requirements: linkedReqs.map((r) => `- ${r.title}: "${r.text}" (${r.source.docName}, p. ${r.source.page})`).join('\n'),
        sources: citations.map((c) => `[${c.marker}] (${c.kind}) ${c.label}: "${(c.quote || '').replace(/\s+/g, ' ').slice(0, 700)}"`).join('\n'),
        words, previous: opts.regenerate && section.content ? section.content : undefined,
      }), { tier: 'default', signal: opts.signal });
      let content = String(j?.content ?? '').trim();
      if (!content) throw new AIError('empty_completion', 'empty');
      const warnings: string[] = [];
      // validation: drop citation markers that do not exist
      const valid = new Set(citations.map((c) => c.marker));
      let dropped = 0;
      content = content.replace(/\s?\[(S\d+)\]/g, (m, id) => (valid.has(id) ? m : (dropped++, '')));
      if (dropped) warnings.push(`Se ${dropped > 1 ? 'han eliminado' : 'ha eliminado'} ${dropped} cita${dropped > 1 ? 's' : ''} sin fuente.`);
      if (PRICE_LEAK.test(content)) warnings.push('Esta sección menciona un importe. Comprueba que no revela información de precio (riesgo de exclusión).');
      const used = new Set([...content.matchAll(/\[(S\d+)\]/g)].map((m) => m[1]));
      const missing = [...new Set([...(Array.isArray(j?.missing) ? j.missing.map(String) : []), ...[...content.matchAll(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g)].map((m) => m[1].trim())])];
      let confidence = Math.max(0, Math.min(1, Number(j?.confidence) || 0.7));
      if (dropped) confidence = Math.min(confidence, 0.6);
      if (!used.size) { confidence = Math.min(confidence, 0.5); warnings.push('El borrador no cita ninguna fuente. Revisa cada afirmación.'); }
      return { content, citations: citations.filter((c) => used.has(c.marker)), missing, confidence, generatedBy: 'ai', warnings };
    } catch (e) {
      if (e instanceof AIError && e.code === 'cancelled') throw e;
      const t = templateSection(section, linkedReqs, citations, knowledge, approvedExamples);
      return { ...t, aiError: e instanceof AIError ? e.code : 'upstream_error' };
    }
  }
  return templateSection(section, linkedReqs, citations, knowledge, approvedExamples);
}

function templateSection(section: Section, reqs: Requirement[], citations: Citation[], k: Knowledge, _approved: number): GenOutput {
  const cite = (docId: string, page: number) => citations.find((c) => c.docId === docId && c.page === page)?.marker;
  const name = k.company.legalName || '[Información requerida: nombre de la empresa]';
  const paras: string[] = [];
  paras.push(`En esta sección, ${name} explica cómo abordará «${section.title}» en este contrato.`);
  const reqLines = reqs.slice(0, 4).map((r) => {
    const m = cite(r.source.docId, r.source.page);
    return `- ${r.title}${m ? ` [${m}]` : ''}: [Información requerida: describe cómo cumplirá ${name} este requisito]`;
  });
  if (reqLines.length) paras.push(`El pliego establece estos requisitos para este apartado:\n${reqLines.join('\n')}`);
  const comp = citations.filter((c) => c.kind === 'company').slice(0, 3);
  if (comp.length) paras.push(`Información de la empresa relacionada: ${comp.map((c) => `${/descripción$/.test(c.label) ? 'nuestro perfil de empresa' : c.label.replace(/^(Empresa|Perfil de empresa) — /, '')} [${c.marker}]`).join('; ')}.`);
  else paras.push('[Información requerida: experiencia, equipo o certificaciones de la empresa relevantes para esta sección]');
  const content = paras.join('\n\n');
  const used = new Set([...content.matchAll(/\[(S\d+)\]/g)].map((m) => m[1]));
  const missing = [...content.matchAll(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g)].map((m) => m[1].trim());
  return { content, citations: citations.filter((c) => used.has(c.marker)), missing: [...new Set(missing)], confidence: 0.45, generatedBy: 'template', warnings: ['Borrador de plantilla: la IA no está disponible en esta vista. PROPO ha preparado la estructura y las fuentes; tu equipo redacta el contenido.'] };
}

// ---------------------------------------------------------------------------
// Ask PROPO
// ---------------------------------------------------------------------------

export async function askPropo(opts: { project: Project; question: string; history: ChatMsg[]; knowledge: Knowledge; pages: Map<string, string[]>; onText?: (t: string) => void; signal?: AbortSignal }): Promise<ChatMsg> {
  const { project, question, knowledge, pages } = opts;
  const passages = search(projectPassages(project, pages), question, 6);
  const reqHits = search(project.requirements.map((r) => ({ id: r.id, docId: r.source.docId, docName: r.source.docName, page: r.source.page, text: r.title + ' ' + r.text })), question, 6);
  const citations: Citation[] = [];
  let n = 0;
  for (const p of passages) citations.push({ marker: `S${++n}`, kind: 'tender', label: `${p.docName} — p. ${p.page}`, docId: p.docId, page: p.page, quote: p.text.slice(0, 700) });
  for (const h of reqHits) if (!citations.some((c) => c.docId === h.docId && c.page === h.page)) {
    const r = project.requirements.find((x) => x.id === h.id)!;
    citations.push({ marker: `S${++n}`, kind: 'tender', label: `${r.source.docName} — p. ${r.source.page}`, docId: r.source.docId, page: r.source.page, quote: r.text });
  }
  const sample = await getSample();
  if (sample && aiState() !== 'declined') {
    const ctx = [
      `RESUMEN DEL PROYECTO: ${project.analysis?.summary ?? ''}`,
      `FECHA LÍMITE: ${project.analysis?.deadline?.slice(0, 10) ?? 'unknown'}`,
      `REQUISITOS (estado):\n${project.requirements.map((r) => `- ${r.title} [${r.status}] (${r.source.docName}, p. ${r.source.page})${r.ask ? ' — pendiente: ' + r.ask : ''}`).join('\n').slice(0, 9000)}`,
      `CRITERIOS DE ADJUDICACIÓN:\n${project.criteria.map((c) => `- ${c.group} / ${c.name}: ${c.points} pts (${c.kind})`).join('\n')}`,
      `SECCIONES DE LA PROPUESTA:\n${project.sections.map((s) => `- ${s.title}: ${s.status}${s.missing.length ? ' — falta: ' + s.missing.join('; ') : ''}`).join('\n')}`,
      `RIESGOS DE EXCLUSIÓN:\n${project.analysis?.exclusionRisks.map((e) => '- ' + e.text).join('\n') ?? ''}`,
      `CONOCIMIENTO DE EMPRESA:\n${JSON.stringify(knowledgeForPrompt(knowledge)).slice(0, 8000)}`,
      `FRAGMENTOS DEL PLIEGO:\n${citations.map((c) => `[${c.marker}] ${c.label}: "${(c.quote || '').replace(/\s+/g, ' ')}"`).join('\n')}`,
    ].join('\n\n');
    const turns = [{ role: 'user' as const, content: chatRules(project.name, knowledge.company.legalName || 'the company') }];
    const hist = opts.history.slice(-6).map((m) => ({ role: m.role, content: m.text.slice(0, 2000) }));
    const all = [...turns, ...hist, { role: 'user' as const, content: `CONTEXTO:\n${ctx}\n\nPREGUNTA: ${question}` }];
    try {
      const { text } = await ai.text(all, { tier: 'default', signal: opts.signal, onText: opts.onText });
      const used = new Set([...text.matchAll(/\[(S\d+)\]/g)].map((m) => m[1]));
      return { id: uid('m'), role: 'assistant', text, citations: citations.filter((c) => used.has(c.marker)), mode: 'ai', at: nowIso() };
    } catch (e) {
      if (e instanceof AIError && e.code === 'cancelled') throw e;
    }
  }
  return retrievalAnswer(project, question, citations);
}

function retrievalAnswer(project: Project, q: string, citations: Citation[]): ChatMsg {
  const ql = q.toLowerCase();
  let text = '';
  const statusOf = (s: string) => project.requirements.filter((r) => r.status === s);
  if (/miss|falt|pend|need|necesit|document|faltan/.test(ql)) {
    const pend = [...statusOf('missing'), ...statusOf('needs_info')];
    text = pend.length ? `${pend.length} requisitos necesitan tu intervención:\n${pend.map((r) => `- ${r.title} (${r.status === 'missing' ? 'falta' : 'información requerida'}) — ${r.source.docName}, p. ${r.source.page}`).join('\n')}` : 'No hay requisitos pendientes.';
  } else if (/criteri|weight|peso|point|punt|score/.test(ql)) {
    const cs = [...project.criteria].sort((a, b) => b.points - a.points);
    text = cs.length ? `Criterios de adjudicación por peso:\n${cs.map((c) => `- ${c.name}: ${c.points} pts (${c.kind === 'formula' ? 'fórmula' : 'juicio de valor'})`).join('\n')}` : 'No se han identificado criterios con puntuación en los documentos.';
  } else if (/exclu|reject|descalif/.test(ql)) {
    const ex = project.analysis?.exclusionRisks ?? [];
    text = ex.length ? `Condiciones que pueden causar la exclusión:\n${ex.map((e) => `- ${e.text}${e.source ? ` — ${e.source.docName}, p. ${e.source.page}` : ''}`).join('\n')}` : 'No se han identificado condiciones de exclusión explícitas. Revisa el pliego administrativo.';
  } else if (/summar|resum|overview|pliego/.test(ql)) {
    text = project.analysis?.summary ?? 'No hay resumen disponible.';
  } else if (citations.length) {
    text = `Estos son los fragmentos más relevantes para tu pregunta:\n${citations.slice(0, 4).map((c) => `- ${(c.quote || '').replace(/\s+/g, ' ').slice(0, 220)}… [${c.marker}]`).join('\n')}`;
  } else {
    text = 'No he encontrado nada sobre esto en los documentos del proyecto.';
  }
  const used = new Set([...text.matchAll(/\[(S\d+)\]/g)].map((m) => m[1]));
  return { id: uid('m'), role: 'assistant', text: text + '\n\nRespuesta basada en los datos del proyecto, sin IA. Abre PROPO dentro de claude.ai para obtener respuestas completas con IA.', citations: citations.filter((c) => used.has(c.marker)), mode: 'retrieval', at: nowIso() };
}

export { wordCount };
