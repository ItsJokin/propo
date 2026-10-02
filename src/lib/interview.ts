// «PROPO te pregunta»: entrevista guiada que resuelve lo que falta para presentar la oferta.
// Prioriza los requisitos clave (los de la ficha oficial y los de solvencia, experiencia, certificados y
// equipo) y los datos de empresa que faltan. Cada respuesta se guarda donde corresponde: en el requisito
// (con quién lo confirmó) o en la memoria de empresa, para no volver a preguntarlo en otra licitación.
import type { AppState, Project, Requirement, InterviewMsg } from './types';
import { getState, update, updateProject } from './store';
import { updateRequirement, addVaultFiles } from './actions';
import { uid, nowIso } from './util';

export type QKind = 'req' | 'revenue' | 'employees' | 'projects' | 'certs';
export interface Question {
  id: string;
  kind: QKind;
  reqId?: string;
  text: string;
  hint?: string;
  source?: InterviewMsg['source'];
  choices: string[];
  multi?: string[];
  placeholder: string;
  critical?: boolean;
}

const KEY_CATS = ['financial', 'experience', 'certification', 'team'];
export const CERT_OPTIONS = ['ISO 9001', 'ISO 14001', 'ISO 22000', 'ISO 45001', 'ISO 27001', 'ENS'];
const MAX_REQ_QUESTIONS = 10;

function isFicha(p: Project, docId: string) { return !!p.docs.find((d) => d.id === docId)?.name.startsWith('Ficha de la licitación'); }
function clean(t: string) { return t.replace(/^se exigir[áa]n?:\s*/i, '').replace(/\s+/g, ' ').trim(); }

function reqQuestion(p: Project, r: Requirement): Question {
  const base = clean(r.text).replace(/\.$/, '');
  const generic = !r.ask || /^(mock|¿pregunta simulada|¿puede tu empresa cumplir)/i.test(r.ask);
  const text = `El pliego pide: «${base.length > 220 ? base.slice(0, 217) + '…' : base}». ${generic ? '¿Lo cumplís?' : r.ask}`;
  return {
    id: 'req:' + r.id, kind: 'req', reqId: r.id, text, critical: r.critical || r.mandatory,
    hint: r.status === 'missing' ? 'No he encontrado nada en tu memoria de empresa que lo acredite.' : 'Necesito que lo confirme alguien de tu equipo.',
    source: { docId: r.source.docId, page: r.source.page, quote: r.source.quote ?? r.text, docName: r.source.docName },
    choices: ['Sí, lo cumplimos', 'No', 'No lo sé', 'Saltar'],
    placeholder: 'Escribe cómo lo acreditáis (p. ej. «Tenemos la póliza con Mapfre hasta 2027») o adjunta el documento',
  };
}

export function pendingQuestions(p: Project, s: AppState = getState()): Question[] {
  const answered = new Set(p.interview?.answered ?? []);
  const open = p.requirements.filter((r) => (r.status === 'needs_info' || r.status === 'missing') && !answered.has('req:' + r.id));
  const seen = new Set<string>();
  const pick = (r: Requirement) => { const k = r.title.replace(/\s*\(\d+\)$/, '').toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; };
  const ranked = [
    ...open.filter((r) => isFicha(p, r.source.docId)),
    ...open.filter((r) => !isFicha(p, r.source.docId) && KEY_CATS.includes(r.category) && r.mandatory && !r.uncertain),
  ].filter(pick).slice(0, Math.max(0, MAX_REQ_QUESTIONS - [...answered].filter((x) => x.startsWith('req:')).length));
  const qs: Question[] = ranked.map((r) => reqQuestion(p, r));
  const c = s.company;
  if (!c.revenue && !answered.has('revenue')) qs.push({ id: 'revenue', kind: 'revenue', text: '¿Cuál fue vuestra facturación anual en el último ejercicio cerrado? Casi todos los pliegos piden un volumen de negocio mínimo.', choices: ['Prefiero no decirlo ahora'], placeholder: 'p. ej. 1,8 M€ en 2025' });
  if (!c.employees && !answered.has('employees')) qs.push({ id: 'employees', kind: 'employees', text: '¿Cuántas personas trabajan en la empresa?', choices: ['1–9', '10–49', '50–249', '250 o más'], placeholder: 'Número aproximado' });
  if (s.pastProjects.length === 0 && !answered.has('projects')) qs.push({ id: 'projects', kind: 'projects', text: 'Cuéntame un contrato parecido que hayáis hecho en los últimos 3 años: para quién, qué año y por cuánto. Es lo que más pesa en la solvencia técnica.', choices: ['Ahora no'], placeholder: 'p. ej. Comedor del Ayuntamiento de Sitges, 2023-2025, 210.000 €/año' });
  if (s.certifications.length === 0 && !answered.has('certs')) qs.push({ id: 'certs', kind: 'certs', text: '¿Tenéis alguna de estas certificaciones vigentes?', choices: ['Ninguna'], multi: CERT_OPTIONS, placeholder: 'Otra certificación' });
  return qs;
}

function push(projectId: string, msgs: Omit<InterviewMsg, 'id' | 'at'>[], answeredId?: string) {
  updateProject(projectId, (pr) => {
    pr.interview ??= { msgs: [], answered: [] };
    for (const m of msgs) pr.interview.msgs.push({ ...m, id: uid('im'), at: nowIso() });
    if (answeredId && !pr.interview.answered.includes(answeredId)) pr.interview.answered.push(answeredId);
  });
}

export function startInterview(p: Project) {
  if (p.interview?.msgs.length) return;
  const qs = pendingQuestions(p);
  const pages = p.docs.reduce((a, d) => a + d.pages, 0);
  const intro = qs.length
    ? `Hola, soy PROPO. He leído ${p.docs.length} documento${p.docs.length === 1 ? '' : 's'} (${pages} páginas) de «${p.name}» y he encontrado ${p.requirements.length} requisitos. Para dejar la oferta lista necesito confirmar ${qs.length} cosa${qs.length === 1 ? '' : 's'} contigo. Te las pregunto de una en una: contesta con los botones o escribiendo, como en un chat.`
    : `Hola, soy PROPO. He leído ${p.docs.length} documento${p.docs.length === 1 ? '' : 's'} de «${p.name}» y con tu memoria de empresa tengo todo lo que necesito. ¿Redacto la propuesta?`;
  push(p.id, [{ role: 'propo', text: intro }]);
}

export function askNext(projectId: string) {
  const p = getState().projects.find((x) => x.id === projectId);
  if (!p) return;
  const q = pendingQuestions(p)[0];
  const last = p.interview?.msgs[p.interview.msgs.length - 1];
  if (q && last?.qid !== q.id) push(projectId, [{ role: 'propo', text: q.text, qid: q.id, source: q.source }]);
  if (!q && !p.interview?.msgs.some((m) => m.qid === 'done')) {
    const open = p.requirements.filter((r) => r.status === 'needs_info' || r.status === 'missing').length;
    push(projectId, [{ role: 'propo', qid: 'done', text: `¡Listo! He guardado tus respuestas en los requisitos y en tu memoria de empresa, así no te las vuelvo a preguntar en otras licitaciones.${open ? ` Quedan ${open} requisitos secundarios del pliego que puedes revisar cuando quieras.` : ''} ¿Redacto ya la propuesta?` }]);
  }
}

const ACK = ['Anotado.', 'Perfecto, guardado.', 'Entendido.', 'Hecho.', 'Gracias, lo apunto.'];
const ack = () => ACK[Math.floor(Math.random() * ACK.length)];

export async function answer(projectId: string, q: Question, a: { choice?: string; text?: string; multi?: string[]; file?: File }) {
  const shown = a.file ? `📎 ${a.file.name}` : a.multi?.length ? a.multi.join(', ') + (a.text ? `, ${a.text}` : '') : a.text || a.choice || '';
  push(projectId, [{ role: 'user', text: shown.replace('📎 ', 'Adjunto: ') }]);
  let reply = ack();
  let actions: { label: string; to: string }[] | undefined;
  if (q.kind === 'req' && q.reqId) {
    const who = getState().user?.name ?? 'tu equipo';
    if (a.file) {
      const r = await addVaultFiles([a.file], 'other');
      updateRequirement(projectId, q.reqId, { status: 'fulfilled', humanValidated: true, evidence: [{ kind: 'vault', label: a.file.name }], note: `Acreditado con ${a.file.name} (añadido a Documentos)` }, `Requisito acreditado en el asistente con ${a.file.name}`);
      reply = r.added ? `${ack()} He guardado «${a.file.name}» en tus documentos de empresa y lo uso como prueba de este requisito.` : `No he podido leer «${a.file.name}», pero lo marco como acreditado. Revísalo en Documentos.`;
    } else if (a.choice === 'Sí, lo cumplimos' || (a.text && !/^\s*no\b/i.test(a.text))) {
      updateRequirement(projectId, q.reqId, { status: 'fulfilled', humanValidated: true, evidence: [{ kind: 'user', label: a.text ? a.text.slice(0, 160) : `Confirmado por ${who}` }], note: a.text ? `Respuesta de ${who}: ${a.text}` : `Confirmado por ${who} en el asistente` }, 'Requisito confirmado en el asistente');
      reply = a.text ? `${ack()} Lo uso al redactar la propuesta.` : `${ack()} Si tienes el documento que lo acredita, súbelo y lo guardo como prueba.`;
      if (!a.text) actions = [{ label: 'Subir el documento', to: '/app/documents' }];
    } else if (a.choice === 'No' || (a.text && /^\s*no\b/i.test(a.text))) {
      updateRequirement(projectId, q.reqId, { status: 'missing', note: a.text ? `Respuesta: ${a.text}` : 'No se cumple (confirmado en el asistente)' }, 'Requisito marcado como no cumplido');
      reply = q.critical
        ? 'Ojo: es obligatorio, y sin él la oferta puede quedar excluida. Opciones habituales: apoyarte en la solvencia de otra empresa (art. 75 LCSP), ir en UTE o subcontratar esa parte si el pliego lo permite. Lo marco en rojo para que lo decidáis antes de presentar.'
        : 'Lo marco como no cumplido. No es excluyente, pero puede restar puntos.';
    } else if (a.choice === 'No lo sé') {
      updateRequirement(projectId, q.reqId, { note: 'Pendiente de confirmar (asistente)' });
      reply = 'Sin problema: lo dejo pendiente y te lo recuerdo en el resumen del proyecto.';
    } else reply = 'Lo salto por ahora.';
  } else if (q.kind === 'revenue' && a.text) { update((s) => { s.company.revenue = a.text!; }); reply = `${ack()} Lo guardo en tu perfil de empresa.`; }
  else if (q.kind === 'employees' && (a.choice || a.text)) { update((s) => { s.company.employees = (a.text || a.choice)!; }); reply = ack(); }
  else if (q.kind === 'projects' && a.text) {
    update((s) => { s.pastProjects.unshift({ id: uid('pp'), title: a.text!.split(',')[0].slice(0, 90), client: '', sector: s.company.industry, years: (a.text!.match(/20\d\d(?:\s*[-–]\s*20\d\d)?/) || [''])[0], value: (a.text!.match(/[\d.,]+\s*(?:€|euros|k€|M€)[^,]*/i) || [''])[0], description: a.text!, hasCertificate: false }); });
    reply = `${ack()} Lo añado a tus proyectos anteriores. Si tienes el certificado de buena ejecución, súbelo: es lo que suelen pedir.`;
    actions = [{ label: 'Subir el certificado de buena ejecución', to: '/app/documents' }, { label: 'Ver mis proyectos', to: '/app/company/experience' }];
  } else if (q.kind === 'certs') {
    const list = [...(a.multi ?? []), ...(a.text ? [a.text] : [])];
    if (list.length) update((s) => { for (const n of list) s.certifications.push({ id: uid('c'), name: n, issuer: '', validUntil: '', category: /14001/.test(n) ? 'environmental' : /45001/.test(n) ? 'safety' : /9001/.test(n) ? 'quality' : 'industry' }); });
    reply = list.length ? `${ack()} Añadidas a tu memoria de empresa. Sube los certificados en PDF para poder adjuntarlos a la oferta.` : 'Entendido, sin certificaciones por ahora.';
    if (list.length) actions = [{ label: 'Subir los certificados', to: '/app/documents' }];
  }
  push(projectId, [{ role: 'propo', text: reply, actions }], q.id);
  askNext(projectId);
}

export function interviewStats(p: Project) {
  const total = (p.interview?.answered.length ?? 0) + pendingQuestions(p).length;
  return { total, answered: p.interview?.answered.length ?? 0, pending: pendingQuestions(p).length };
}
