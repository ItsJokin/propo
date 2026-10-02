// Step 6: company knowledge retrieval & matching.
// Decides, per requirement, whether the company's stored knowledge covers it.
// Rule: PROPO never marks a critical requirement as fulfilled without real evidence.
import type { AppState, Requirement, Evidence, ReqStatus } from '../types';
import type { ExtractionResult } from './extractTypes';
import { tokens, normalize } from '../util';

export interface Knowledge {
  company: AppState['company'];
  pastProjects: AppState['pastProjects'];
  certifications: AppState['certifications'];
  team: AppState['team'];
  vault: AppState['vault'];
}

export function knowledgeIndex(k: Knowledge) {
  const items: { id: string; label: string; text: string; kind: Evidence['kind'] }[] = [];
  k.pastProjects.forEach((p) => items.push({ id: p.id, kind: 'company', label: `${p.title} — ${p.value}`, text: `${p.title} ${p.client} ${p.sector} ${p.description}` }));
  k.certifications.forEach((c) => items.push({ id: c.id, kind: 'company', label: c.name, text: `${c.name} ${c.issuer}` }));
  k.team.forEach((t) => items.push({ id: t.id, kind: 'company', label: `${t.name} — ${t.role}`, text: `${t.role} ${t.qualifications} ${t.years} years` }));
  k.vault.forEach((v) => items.push({ id: v.id, kind: 'vault', label: v.name, text: `${v.name} ${v.category}` }));
  return items;
}

/** Compact JSON of company knowledge given to the model. Only facts the company stored. */
export function knowledgeForPrompt(k: Knowledge) {
  return {
    company: { legal_name: k.company.legalName, industry: k.company.industry, employees: k.company.employees, revenue: k.company.revenue, description: k.company.description, capabilities: k.company.capabilities, address: k.company.address },
    past_projects: k.pastProjects.map((p) => ({ id: p.id, title: p.title, client: p.client, years: p.years, value: p.value, description: p.description, has_good_execution_certificate: p.hasCertificate })),
    certifications: k.certifications.map((c) => ({ id: c.id, name: c.name, valid_until: c.validUntil })),
    team: k.team.map((t) => ({ id: t.id, name: t.name, role: t.role, years: t.years, qualifications: t.qualifications })),
    documents: k.vault.map((v) => ({ id: v.id, name: v.name, category: v.category, expires: v.expiresAt?.slice(0, 10) })),
  };
}

function parseEuro(s: string): number | null {
  const m = s.match(/(?:€|eur)\s?([\d.,]+)\s*(million|m\b)?|([\d.,]+)\s*(million|m)?\s*(?:€|eur|euros)/i);
  if (!m) return null;
  const raw = (m[1] || m[3] || '').replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.');
  let n = parseFloat(raw);
  if (isNaN(n)) return null;
  if (m[2] || m[4]) n *= 1_000_000;
  return n;
}

export function matchRequirement(r: ExtractionResult['requirements'][number], k: Knowledge): { status: ReqStatus; evidence: Evidence[]; ask?: string; actions?: string[] } {
  const text = r.quote;
  const idx = knowledgeIndex(k);

  // AI-proposed match: accept only evidence ids that exist in company knowledge.
  if (r.match) {
    const ev = r.match.evidenceIds.map((id) => idx.find((i) => i.id === id)).filter(Boolean).map((i) => ({ kind: i!.kind, label: i!.label, ref: i!.id }));
    let status = r.match.status;
    if (status === 'fulfilled' && r.critical && ev.length === 0) status = 'needs_info';
    return { status, evidence: ev, ask: status === 'fulfilled' ? undefined : (r.match.ask || defaultAsk(r.category)), actions: status === 'fulfilled' ? undefined : actionsFor(r.category) };
  }

  if (r.category === 'experience') {
    const need = parseInt(text.match(/at least (\d+)|al menos (\d+)|m[ií]nimo (?:de )?(\d+)|(\d+) (?:comparable|similar|proyectos|contratos|servicios)/i)?.slice(1).find(Boolean) || '3');
    const rel = k.pastProjects;
    const ev = rel.slice(0, 5).map((p) => ({ kind: 'company' as const, label: `${p.title} — ${p.value}`, ref: p.id }));
    if (rel.length >= need) return { status: 'fulfilled', evidence: ev };
    if (rel.length > 0) return { status: 'needs_info', evidence: ev, ask: `Hemos encontrado ${rel.length} proyecto${rel.length > 1 ? 's' : ''} en tu perfil de empresa que ${rel.length > 1 ? 'pueden' : 'puede'} servir. El pliego pide ${need}. ¿Tienes otro proyecto similar?`, actions: ['Add project', 'Skip'] };
    return { status: 'missing', evidence: [], ask: `No hay proyectos previos en tu perfil de empresa. El pliego pide ${need} proyectos similares.`, actions: ['Add project'] };
  }
  if (r.category === 'certification') {
    const NAME = /\b(ISO\s?\d{4,5}|FSSC\s?22000|IFS\b|BRC\w*|EMAS|ENS|EU Ecolabel)\b/gi;
    const norm = (x: string) => normalize(x).replace(/\s/g, '');
    const have = (n: string) => k.certifications.find((c) => norm(c.name).includes(n));
    // "A and B or C" -> clauses [A], [B, C]; each clause needs one of its alternatives
    const clauses = text.split(/\band\b|\by\b|;/i).map((part) => [...part.matchAll(NAME)].map((m) => norm(m[1]))).filter((c) => c.length);
    if (!clauses.length) {
      const doc = k.vault.find((v) => v.category === 'certificate' && tokens(v.name).some((t) => tokens(text).includes(t)));
      return doc ? { status: 'fulfilled', evidence: [{ kind: 'vault', label: doc.name, ref: doc.id }] } : { status: 'needs_info', evidence: [], ask: '¿Qué certificado lo acredita? Súbelo o añádelo a tus certificaciones.', actions: ['Upload document', 'Add certification'] };
    }
    const met = clauses.map((alts) => alts.map(have).find(Boolean));
    const ev = met.filter(Boolean).map((c) => ({ kind: 'company' as const, label: c!.name, ref: c!.id }));
    const missingNames = clauses.filter((_, i) => !met[i]).map((alts) => alts.map((a) => a.toUpperCase().replace(/^ISO/, 'ISO ')).join(' or '));
    if (!missingNames.length) return { status: 'fulfilled', evidence: ev };
    if (ev.length) return { status: 'needs_info', evidence: ev, ask: `Tienes ${ev.map((e) => e.label).join(', ')}. El pliego también pide ${missingNames.join(' y ')}. Súbelo si lo tienes.`, actions: ['Upload document', 'Add certification'] };
    return { status: 'missing', evidence: [], ask: `No hemos encontrado ningún certificado ${missingNames.join(' / ')} en tu perfil ni en tus documentos. Súbelo si lo tienes.`, actions: ['Upload document', 'Add certification'] };
  }
  if (r.category === 'financial') {
    if (/turnover|volume of business|volumen (anual )?de negocios?|annual revenue/i.test(text)) {
      const need = parseEuro(text); const have = parseEuro(k.company.revenue || '');
      if (need && have) {
        return have >= need
          ? { status: 'fulfilled', evidence: [{ kind: 'company', label: `Facturación ${k.company.revenue}` }] }
          : { status: 'missing', evidence: [{ kind: 'company', label: `Facturación ${k.company.revenue}` }], ask: `El pliego exige un volumen de negocio de al menos ${need.toLocaleString('es-ES')} €. Tu perfil indica ${k.company.revenue}.`, actions: ['Add information'] };
      }
      return { status: 'needs_info', evidence: [], ask: 'Confirma tu volumen de negocio de los tres últimos ejercicios. PROPO no estima datos financieros.', actions: ['Add information'] };
    }
    if (/insurance|seguro/i.test(text)) {
      const pol = k.vault.find((v) => v.category === 'insurance');
      return { status: 'needs_info', evidence: pol ? [{ kind: 'vault', label: pol.name, ref: pol.id }] : [], ask: pol ? 'Confirma que la cobertura de tu póliza cumple el importe que exige el pliego.' : 'Sube tu póliza o certificado de seguro.', actions: pol ? ['Confirm', 'Upload document'] : ['Upload document'] };
    }
    if (/price|precio|economic offer|oferta econ/i.test(text)) return { status: 'needs_info', evidence: [], ask: 'Los precios los fija y aprueba siempre tu equipo. PROPO no propone precios.', actions: ['Confirm', 'Skip'] };
  }
  if (r.category === 'team') {
    const ts = tokens(text);
    const hit = k.team.filter((t) => tokens(t.role + ' ' + t.qualifications).some((x) => ts.includes(x)));
    if (hit.length) return { status: 'fulfilled', evidence: hit.slice(0, 3).map((t) => ({ kind: 'company' as const, label: `${t.name} — ${t.role}`, ref: t.id })) };
    return { status: 'needs_info', evidence: [], ask: '¿Quién de tu equipo se encargará de esto? Añade a esa persona al equipo de tu empresa para que PROPO pueda citarla.', actions: ['Add team member', 'Skip'] };
  }
  if (r.category === 'administrative' || r.category === 'legal') {
    const ts = tokens(text);
    const doc = k.vault.find((v) => tokens(v.name).filter((x) => ts.includes(x)).length >= 2);
    if (doc) return { status: 'fulfilled', evidence: [{ kind: 'vault', label: doc.name, ref: doc.id }] };
    if (/declar|espd|deuc|commit|comprom|bound by|obligad|comply with|cumplir[áa]|in accordance with|conforme|subcontrat/i.test(text) || (r.category === 'legal' && !/certificate|certificado|copy|copia|document|plan\b|register|registro/i.test(text))) return { status: 'fulfilled', evidence: [{ kind: 'company', label: 'Declaración preparada con tu perfil de empresa — revísala antes de firmar' }] };
    return { status: 'missing', evidence: [], ask: 'No hemos encontrado este documento en tu biblioteca. Súbelo una vez y PROPO lo reutilizará en próximas propuestas.', actions: ['Upload document'] };
  }
  if (r.category === 'format') return { status: 'fulfilled', evidence: [{ kind: 'company', label: 'Se comprueba en el control de cumplimiento final' }] };
  // technical
  const caps = tokens([k.company.description, ...k.company.capabilities].join(' '));
  const overlap = tokens(text).filter((t) => caps.includes(t)).length;
  if (overlap >= 2) return { status: 'fulfilled', evidence: [{ kind: 'company', label: 'Encaja con las capacidades de tu empresa — se trata en la propuesta' }] };
  return { status: 'needs_info', evidence: [], ask: '¿Puede tu empresa cumplir este requisito? Confírmalo o añade detalles que PROPO pueda usar en la propuesta.', actions: ['Confirm', 'Add information'] };
}

function defaultAsk(cat: string) {
  return cat === 'financial' ? 'Confirma esta cifra. PROPO no estima datos financieros.' : 'PROPO necesita información de tu equipo para cubrir este requisito.';
}
function actionsFor(cat: string) {
  if (cat === 'experience') return ['Add project', 'Skip'];
  if (cat === 'certification') return ['Upload document', 'Add certification'];
  if (cat === 'administrative' || cat === 'legal') return ['Upload document', 'Confirm'];
  if (cat === 'team') return ['Add team member', 'Skip'];
  return ['Confirm', 'Add information'];
}

export function toRequirements(ex: ExtractionResult, docsByName: Map<string, string>, pagesByDoc: Map<string, string[]>, k: Knowledge, verify: (page: string | undefined, quote: string) => boolean): Requirement[] {
  return ex.requirements.map((r, i) => {
    const docId = docsByName.get(r.docName) ?? [...docsByName.values()][0] ?? 'unknown';
    const pageText = pagesByDoc.get(docId)?.[r.page - 1];
    const verified = verify(pageText, r.quote);
    const m = matchRequirement(r, k);
    return {
      id: `req_${i + 1}`,
      title: r.title,
      text: r.quote,
      category: r.category,
      mandatory: r.mandatory,
      critical: r.critical,
      status: m.status,
      source: { docId, docName: r.docName, page: r.page, clause: r.clause, quote: r.quote, verified },
      evidence: m.evidence,
      ask: m.ask,
      actions: m.actions,
      confidence: verified ? 0.9 : 0.55,
      uncertain: !verified,
    };
  });
}
