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
const MAX_QUESTIONS = 5;
/** Trámites que no hace falta preguntar: PROPO los prepara o se resuelven al presentar o al adjudicar. */
const PROCEDURAL = /garant[ií]a (definitiva|provisional)|oferta econ[oó]mica|precio (unitario|m[aá]ximo|de licitaci)|presupuesto base|importe m[aá]ximo|tipo de licitaci|canon|anormal|temerari|seg[uú]n (el )?modelo|sobre [abc123]\b|archivo «?[abc]»?|firma|plazo de presentaci|declaraci[oó]n responsable|deuc|subsan|registro|plataforma|electr[oó]nic|una sola oferta|aportar documentaci|adjudicatari/i;

function isFicha(p: Project, docId: string) { return !!p.docs.find((d) => d.id === docId)?.name.startsWith('Ficha de la licitación'); }
function clean(t: string) { return t.replace(/^se exigir[áa]n?:\s*/i, '').replace(/\s+/g, ' ').trim(); }
const isOpen = (r: Requirement) => r.status === 'needs_info' || r.status === 'missing';

/** ¿Hace falta que el cliente diga algo? Solo lo que puede dejar fuera la oferta y PROPO no puede saber por su cuenta:
 *  solvencia, experiencia, certificaciones y equipo obligatorios. El resto lo lleva PROPO. */
export function needsYou(r: Requirement): boolean {
  return isOpen(r) && r.mandatory && !r.uncertain && KEY_CATS.includes(r.category) && !PROCEDURAL.test(r.title + ' ' + r.text);
}
/** Requisito abierto que no necesita al cliente ahora: PROPO lo prepara o se resuelve al presentar. */
export function propoHandles(r: Requirement): boolean { return isOpen(r) && !needsYou(r); }

const LATER = 'Lo miro más tarde';
/** Qué significa una respuesta: sí, a medias, no, o «luego». */
export function outcomeOf(choice: string): 'yes' | 'partial' | 'no' | 'later' {
  if (/más tarde|luego|saltar|no lo sé|no estoy segur/i.test(choice)) return 'later';
  if (/, pero |trámite|incorporar|cerca|más pequeñ/i.test(choice)) return 'partial';
  if (/^no\b/i.test(choice.trim())) return 'no';
  return 'yes';
}

/** Las respuestas posibles dependen de lo que se pregunta: no todo es «sí, lo cumplimos». */
function answersFor(r: Requirement, open: boolean): { choices: string[]; placeholder: string } {
  if (open) return { choices: ['Lo decido más tarde'], placeholder: 'Escribe tu respuesta' };
  const t = (r.title + ' ' + r.text).toLowerCase();
  if (r.category === 'certification') return { choices: ['La tenemos en vigor', 'Está en trámite', 'No la tenemos', LATER], placeholder: 'O cuéntalo: «La tenemos hasta marzo de 2027»' };
  if (r.category === 'experience') return { choices: ['Sí, tenemos contratos parecidos', 'Parecidos, pero más pequeños', 'No tenemos', LATER], placeholder: 'O cuéntame cuál: cliente, año e importe' };
  if (r.category === 'team') return { choices: ['Sí, ya está en plantilla', 'Lo incorporaríamos para el contrato', 'No', LATER], placeholder: 'O dime quién: nombre y puesto' };
  if (/seguro|p[oó]liza/.test(t)) return { choices: ['Sí, la póliza cubre ese importe', 'Tenemos póliza, pero por menos', 'No tenemos', LATER], placeholder: 'O cuéntalo: «Póliza de 600.000 € hasta 2027»' };
  if (/volumen|facturaci|cifra de negocio/.test(t)) return { choices: ['Sí, lo superamos', 'Nos quedamos cerca', 'No llegamos', LATER], placeholder: 'O dime la cifra: «Facturamos 1,2 M€ en 2025»' };
  return { choices: ['Sí, lo cumplimos', 'Nos quedamos cerca', 'No lo cumplimos', LATER], placeholder: 'O cuéntalo con tus palabras' };
}

const SHORT_ASK: Record<string, string> = {
  certification: '¿Tenéis esta certificación en vigor?', experience: '¿Tenéis contratos parecidos en los últimos años?',
  team: '¿Contáis con este perfil?', financial: '¿Llegáis a lo que pide el pliego?',
};

function reqQuestion(p: Project, r: Requirement): Question {
  const generic = !r.ask || /^(mock|¿pregunta simulada|¿puede tu empresa cumplir)/i.test(r.ask);
  const ask = generic ? SHORT_ASK[r.category] ?? '¿Lo cumple tu empresa?' : r.ask!;
  const open = !generic && /^¿\s*(qu[eé]|qui[eé]n|cu[aá]l|cu[aá]nt|c[oó]mo|d[oó]nde|cu[aá]ndo)/i.test(ask);
  const base = clean(r.text).replace(/\.$/, '');
  return {
    id: 'req:' + r.id, kind: 'req', reqId: r.id, text: `El pliego pide: «${base.length > 220 ? base.slice(0, 217) + '…' : base}». ${ask}`, critical: r.critical || r.mandatory,
    hint: r.status === 'missing' ? 'No he encontrado nada en tu memoria de empresa que lo acredite.' : 'Necesito que lo confirme alguien de tu equipo.',
    source: { docId: r.source.docId, page: r.source.page, quote: r.source.quote ?? r.text, docName: r.source.docName },
    ...answersFor(r, open),
  };
}

/** Las preguntas que quedan. Pocas: lo indispensable para redactar y presentar sin riesgo de exclusión. */
export function pendingQuestions(p: Project, s: AppState = getState()): Question[] {
  const answered = new Set(p.interview?.answered ?? []);
  const seen = new Set<string>();
  const pick = (r: Requirement) => { const k = r.title.replace(/\s*\(\d+\)$/, '').toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; };
  const asked = [...answered].filter((x) => x.startsWith('req:')).length;
  const ranked = p.requirements.filter((r) => needsYou(r) && !answered.has('req:' + r.id))
    .sort((a, b) => Number(!!b.critical) - Number(!!a.critical) || Number(b.status === 'missing') - Number(a.status === 'missing'))
    .filter(pick).slice(0, Math.max(0, MAX_QUESTIONS - asked));
  const qs: Question[] = ranked.map((r) => reqQuestion(p, r));
  // Datos de empresa: solo si esta licitación los necesita y todavía no están en la memoria.
  const openReq = (cat: string, re?: RegExp) => p.requirements.some((r) => isOpen(r) && r.category === cat && (!re || re.test(r.title + ' ' + r.text)));
  const c = s.company;
  if (!c.revenue && !answered.has('revenue') && openReq('financial', /volumen|facturaci|cifra de negocio|solvencia econ/i)) qs.push({ id: 'revenue', kind: 'revenue', text: 'El pliego pide un volumen de negocio mínimo. ¿Cuánto facturasteis en el último ejercicio cerrado?', choices: ['Prefiero no decirlo ahora'], placeholder: 'Por ejemplo: 850.000 €' });
  if (s.pastProjects.length === 0 && !answered.has('projects') && openReq('experience')) qs.push({ id: 'projects', kind: 'projects', text: 'Cuéntame un contrato parecido que hayáis hecho en los últimos 3 años: para quién, qué año y por cuánto. Con uno me basta para empezar.', choices: ['No tenemos ninguno parecido'], placeholder: 'Por ejemplo: Mantenimiento de jardines, Ayuntamiento de Getafe, 2023–2025, 180.000 €/año' });
  if (s.certifications.length === 0 && !answered.has('certs') && openReq('certification')) qs.push({ id: 'certs', kind: 'certs', text: '¿Tenéis alguna de estas certificaciones vigentes?', choices: ['Ninguna'], multi: CERT_OPTIONS, placeholder: 'Otra certificación' });
  return qs.slice(0, Math.max(0, MAX_QUESTIONS - asked));
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
    push(projectId, [{ role: 'propo', qid: 'done', text: 'Eso es todo. He guardado tus respuestas en tu memoria de empresa para no volver a preguntártelas. Del resto de requisitos me ocupo yo. ¿Genero la propuesta?' Quedan ${open} requisitos secundarios del pliego que puedes revisar cuando quieras.` : ''} ¿Redacto ya la propuesta?` }]);
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
    } else {
      const out = a.text ? (/^\s*no\b/i.test(a.text) ? 'no' : 'yes') : outcomeOf(a.choice ?? '');
      if (out === 'yes') {
        updateRequirement(projectId, q.reqId, { status: 'fulfilled', humanValidated: true, evidence: [{ kind: 'user', label: a.text ? a.text.slice(0, 160) : `Confirmado por ${who}` }], note: a.text ? `Respuesta de ${who}: ${a.text}` : `Confirmado por ${who} en el asistente` }, 'Requisito confirmado en el asistente');
        reply = a.text ? `${ack()} Lo uso al redactar la propuesta.` : `${ack()} Si tienes a mano el documento que lo acredita, puedes subirlo cuando quieras; no hace falta ahora.`;
      } else if (out === 'partial') {
        updateRequirement(projectId, q.reqId, { status: 'needs_info', note: `Respuesta de ${who}: ${a.choice}` }, 'Requisito con respuesta parcial');
        reply = 'Lo apunto tal cual. Antes de presentar veremos si basta o si conviene apoyarse en otra empresa; te lo recordaré en la comprobación final, no tienes que hacer nada ahora.';
      } else if (out === 'no') {
        updateRequirement(projectId, q.reqId, { status: 'missing', note: a.text ? `Respuesta: ${a.text}` : 'No se cumple (confirmado en el asistente)' }, 'Requisito marcado como no cumplido');
        reply = q.critical
          ? 'Gracias por decírmelo: mejor saberlo ahora. Es un requisito obligatorio, pero suele tener salida: apoyarse en la solvencia de otra empresa, ir en UTE o subcontratar esa parte si el pliego lo permite. Lo dejo señalado para decidirlo antes de presentar.'
          : 'Anotado. No deja fuera la oferta; como mucho resta algún punto.';
      } else {
        updateRequirement(projectId, q.reqId, { note: 'Pendiente de confirmar (asistente)' });
        reply = 'Sin problema, sigo sin eso. Te lo recordaré antes de presentar.';
      }
    }
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
