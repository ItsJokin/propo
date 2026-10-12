// «Información requerida»: averigua dónde se añade cada dato que falta y lo resuelve en un paso.
// El dato se escribe en la propia sección (sustituye la marca) y, si es un dato de empresa, se guarda
// también en la memoria de empresa para que no vuelva a faltar en otras propuestas.
import type { CompanyInfo, VaultCategory, Project, Evidence } from './types';
import { getState, update, updateProject, navigate } from './store';
import { addVaultFiles } from './actions';
import { uid, nowIso } from './util';
import { lineWithout } from './lineEdit';
export { lineWithout };

export type InfoKind = 'capability' | 'revenue' | 'employees' | 'company' | 'experience' | 'certification' | 'team' | 'document' | 'price' | 'other';
export interface InfoPlan {
  kind: InfoKind;
  field?: keyof CompanyInfo;
  title: string;          // qué necesita PROPO, en lenguaje claro
  where: string;          // dónde vive ese dato en PROPO
  path: string;           // ruta para ir a añadirlo
  placeholder: string;
  multiline?: boolean;
  upload?: VaultCategory; // se puede resolver subiendo un documento
  saveLabel?: string;     // «Guardar también en …»
  humanOnly?: boolean;    // lo decide una persona (precios)
}

const R: [RegExp, (label: string) => InfoPlan][] = [
  [/factur|volumen (anual )?de negocio|cifra de negocio|cuentas anuales|solvencia econ/i, () => ({ kind: 'revenue', field: 'revenue', title: 'Volumen anual de negocio', where: 'Empresa → Datos de empresa', path: '/app/company/info', placeholder: 'p. ej. 1,8 M€ en 2025 (mejor de los 3 últimos ejercicios)', saveLabel: 'Guardar en mis datos de empresa', upload: 'financial' })],
  [/plantilla|n[úu]mero de (empleados|trabajadores)|empleados|trabajadores en plantilla/i, () => ({ kind: 'employees', field: 'employees', title: 'Plantilla', where: 'Empresa → Datos de empresa', path: '/app/company/info', placeholder: 'p. ej. 34 personas, 28 indefinidas', saveLabel: 'Guardar en mis datos de empresa' })],
  [/\b(cif|nif)\b|raz[óo]n social|domicilio|direcci[óo]n postal/i, (l) => ({ kind: 'company', field: /cif|nif/i.test(l) ? 'taxId' : /raz[óo]n/i.test(l) ? 'legalName' : 'address', title: l, where: 'Empresa → Datos de empresa', path: '/app/company/info', placeholder: 'Escribe el dato', saveLabel: 'Guardar en mis datos de empresa' })],
  [/certific|iso ?\d|acreditaci|emas|etiqueta ecol/i, () => ({ kind: 'certification', title: 'Certificación', where: 'Empresa → Certificaciones', path: '/app/company/certifications', placeholder: 'p. ej. ISO 22000, vigente hasta 03/2028 (Bureau Veritas)', saveLabel: 'Añadir a mis certificaciones', upload: 'certificate' })],
  [/responsable|coordinador|jefe|director|equipo|perfil profesional|\bcv\b|curr[íi]culum|cocinero|nutricionista|dietista/i, () => ({ kind: 'team', title: 'Persona del equipo', where: 'Empresa → Equipo', path: '/app/company/team', placeholder: 'Nombre, cargo y años de experiencia. p. ej. Marta Puig, jefa de cocina, 12 años', saveLabel: 'Añadir a mi equipo', upload: 'team' })],
  [/contrato|proyecto|experiencia|referencia|cliente|servicios similares|trabajos (realizados|similares)|buena ejecuci/i, () => ({ kind: 'experience', title: 'Experiencia previa', where: 'Empresa → Experiencia', path: '/app/company/experience', placeholder: 'Cliente, año e importe. p. ej. Comedor del Ayuntamiento de Sitges, 2023-2025, 210.000 €/año', multiline: true, saveLabel: 'Añadir a mis proyectos anteriores', upload: 'experience' })],
  [/seguro|p[óo]liza|aval|garant[íi]a|escritura|poderes|registro sanitario|rgseaa|alta en|certificado de (estar|hallarse)|hacienda|seguridad social/i, (l) => ({ kind: 'document', title: l, where: 'Documentos', path: '/app/documents', placeholder: 'p. ej. Póliza de RC n.º 123 con Mapfre, 600.000 €, vigente hasta 2027', upload: /seguro|p[óo]liza/i.test(l) ? 'insurance' : 'corporate' })],
  [/sostenib|ecol[óo]gic|proximidad|km 0|residuos|medioambient|veh[íi]culo|flota|distintivo (eco|cero)|instalaciones|medios materiales|maquinaria|cocina central|almac[ée]n/i, () => ({ kind: 'capability', title: 'Medios y compromisos de la empresa', where: 'Empresa → Capacidades', path: '/app/company/capabilities', placeholder: 'p. ej. 3 furgonetas eléctricas (etiqueta CERO) y 1 híbrida (ECO)', saveLabel: 'Guardar en mis capacidades' })],
  [/precio|tarifa|importe ofertado|oferta econ|descuento|canon|baja/i, () => ({ kind: 'price', title: 'Dato de la oferta económica', where: 'Paquete → Oferta económica', path: 'package', placeholder: 'p. ej. 8,90 € por menú, IVA no incluido', humanOnly: true })],
];

export function planFor(label: string): InfoPlan {
  for (const [re, f] of R) if (re.test(label)) return f(label);
  return { kind: 'other', title: label, where: 'esta sección', path: '', placeholder: 'Escribe la información que falta', multiline: true };
}

export function resolvePath(plan: InfoPlan, projectId?: string) {
  return plan.path === 'package' ? (projectId ? `/app/projects/${projectId}/package` : '/app/projects') : plan.path || (projectId ? `/app/projects/${projectId}/proposal` : '/app/projects');
}

const words = (t: string) => new Set(t.toLowerCase().normalize('NFD').replace(/[^\x00-\x7f]/g, '').match(/[a-z0-9]{4,}/g) ?? []);
/** Palabras que aparecen en casi cualquier requisito: no sirven para saber si dos textos hablan de lo mismo. */
const COMMON = new Set('empresa empresas licitador licitadora contrato contratos servicio servicios debera deberan acreditar acreditacion presentar documento documentos numero vigencia vigente certificado certificados certificacion experiencia equipo minimo minima anos para como esta este sobre segun tener disponer contar requisito pliego'.split(' '));
/** Qué requisitos puede resolver cada tipo de dato. */
const REQ_CATS: Partial<Record<InfoKind, string[]>> = { certification: ['certification'], experience: ['experience'], team: ['team'], revenue: ['financial'], document: ['administrative', 'legal', 'financial', 'certification'] };

/** El dato que el cliente acaba de dar también responde a los requisitos que piden eso mismo: se dan por resueltos,
 *  para no volver a pedírselo en la comprobación final. Devuelve cuántos requisitos ha resuelto. */
function resolveRequirements(pr: Project, label: string, kind: InfoKind, value: string, evidence: Evidence) {
  const cats = REQ_CATS[kind];
  if (!cats || /^\s*(no|ningun[oa]?)\b/i.test(value)) return 0;
  const mine = [...words(`${label} ${value}`)].filter((w) => !COMMON.has(w));
  let n = 0;
  for (const r of pr.requirements) {
    if (!(r.status === 'missing' || r.status === 'needs_info') || !cats.includes(r.category)) continue;
    const theirs = words(`${r.title} ${r.text}`);
    const shared = mine.filter((w) => theirs.has(w));
    const same = kind === 'revenue' ? /volumen|facturaci|cifra de negocio/i.test(r.title + ' ' + r.text) : shared.length >= 2 || shared.some((w) => /\d/.test(w));
    if (!same) continue;
    r.status = 'fulfilled'; r.humanValidated = true;
    r.evidence = [...r.evidence, evidence];
    r.note = `Dato aportado al revisar la propuesta: ${value.slice(0, 200)}`;
    n++;
  }
  if (n) pr.activity.unshift({ at: nowIso(), text: `${n} requisito${n > 1 ? 's' : ''} resuelto${n > 1 ? 's' : ''} con el dato «${label.slice(0, 80)}»` });
  return n;
}

/** Quita de la lista de pendientes el aviso de un dato (la lista no siempre usa las mismas palabras que la marca). */
function forget(s: { missing: string[] }, label: string, kind: InfoKind) {
  const before = s.missing.length;
  s.missing = s.missing.filter((m) => m.trim().toLowerCase() !== label.trim().toLowerCase());
  if (s.missing.length < before || !s.missing.length) return;
  const mine = words(label);
  const score = s.missing.map((x) => [...words(x)].filter((w) => mine.has(w)).length + (planFor(x).kind === kind ? 0.5 : 0));
  const k = score.indexOf(Math.max(...score));
  if (k >= 0 && score[k] > 0) s.missing.splice(k, 1);
}

/** La línea de la sección que contiene la marca (un párrafo, un punto de lista o una fila de tabla). */
export function lineOf(content: string, tag: string) { return content.split('\n').find((l) => l.includes(tag)) ?? ''; }

/** El cliente decide que ese dato no hace falta: se quita de la sección (la línea queda como `replacement`, o desaparece). */
export function dropInfo(projectId: string, sectionId: string, tag: string, label: string, replacement: string) {
  const plan = planFor(label);
  updateProject(projectId, (pr) => {
    const s = pr.sections.find((x) => x.id === sectionId);
    if (!s) return;
    const lines = s.content.split('\n');
    const k = lines.findIndex((l) => l.includes(tag));
    if (k >= 0) { if (replacement.trim()) lines[k] = replacement.trim(); else lines.splice(k, 1); }
    s.content = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    forget(s, label, plan.kind);
    if (s.status === 'approved') s.status = 'reviewed';
    s.updatedAt = nowIso();
    pr.activity.unshift({ at: nowIso(), text: `Dato descartado en «${s.title}»: ${plan.title}` });
  });
}

/** Sustituye la marca en la sección y, si se pide, guarda el dato en la memoria de empresa. */
export function fillInfo(projectId: string, sectionId: string, tag: string, label: string, value: string, save: boolean, memo?: string, evidence?: Evidence) {
  const plan = planFor(label);
  const v = value.trim();
  const m = (memo ?? value).trim();   // lo que se guarda en la memoria de empresa: el dato tal como lo escribió el cliente
  updateProject(projectId, (pr) => {
    const s = pr.sections.find((x) => x.id === sectionId);
    if (!s) return;
    s.content = s.content.includes(tag) ? s.content.split(tag).join(v) : `${s.content.trimEnd()}\n\n${v}`;
    forget(s, label, plan.kind);
    if (s.status === 'approved') s.status = 'reviewed';
    s.updatedAt = nowIso();
    pr.activity.unshift({ at: nowIso(), text: `Información añadida en «${s.title}»: ${plan.title}` });
    (pr.answers ??= []).push({ label, kind: plan.kind, value: m.slice(0, 600), section: s.title, at: nowIso() });
    resolveRequirements(pr, label, plan.kind, m, evidence ?? { kind: 'user', label: m.slice(0, 160) });
  });
  if (!save) return;
  update((st) => {
    if (plan.field) st.company[plan.field] = m as never;
    if (plan.kind === 'capability' && !st.company.capabilities.includes(m)) st.company.capabilities.push(m.slice(0, 160));
    if (plan.kind === 'experience') st.pastProjects.unshift({ id: uid('pp'), title: m.split(',')[0].slice(0, 90), client: '', sector: st.company.industry, years: (m.match(/20\d\d(?:\s*[-–]\s*20\d\d)?/) || [''])[0], value: (m.match(/[\d.,]+\s*(?:€|euros|k€|M€)[^,]*/i) || [''])[0], description: m, hasCertificate: false });
    if (plan.kind === 'certification') st.certifications.push({ id: uid('c'), name: m.split(',')[0].slice(0, 80), issuer: '', validUntil: '', category: /14001|emas/i.test(m) ? 'environmental' : /45001/.test(m) ? 'safety' : /9001/.test(m) ? 'quality' : 'industry' });
    if (plan.kind === 'team') { const [name, role, yrs] = m.split(',').map((x) => x.trim()); st.team.push({ id: uid('t'), name: name || m, role: role || '', years: parseInt(yrs || '0', 10) || 0, qualifications: '' }); }
  });
}

/** Resuelve la marca con un documento: se guarda en Documentos y la sección lo menciona. */
export async function fillWithDocument(projectId: string, sectionId: string, tag: string, label: string, file: File) {
  const plan = planFor(label);
  const r = await addVaultFiles([file], plan.upload ?? 'other');
  fillInfo(projectId, sectionId, tag, label, `${plan.title}: se acredita con «${file.name}» (adjunto)`, false, undefined, { kind: 'vault', label: file.name });
  return r.added > 0;
}

// Aviso «vuelve a tu propuesta» cuando el usuario va a otra página a añadir un dato.
let hint: { need: string; back: string; section: string } | null = null;
const subs = new Set<() => void>();
export function goAdd(plan: InfoPlan, projectId: string, sectionTitle: string) {
  hint = { need: plan.title, back: `/app/projects/${projectId}/proposal`, section: sectionTitle };
  subs.forEach((f) => f());
  navigate(resolvePath(plan, projectId));
}
export function getHint() { return hint; }
export function clearHint() { hint = null; subs.forEach((f) => f()); }
export function onHint(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }
export function currentCompany() { return getState().company; }
