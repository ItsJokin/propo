// Submission package: generated PDFs + stored company documents + tender forms.
// El precio lo confirma siempre el cliente en el paso «Fija el precio»; PROPO nunca presenta nada.
import { technicalProposalPdf, declarationPdf, experiencePdf, companyIndexPdf, complianceReportPdf, economicOfferPdf, abnormalJustificationPdf, ganttPdf, deucPdf } from './pdf/docs';
export { technicalProposalPdf, declarationPdf, experiencePdf, companyIndexPdf, complianceReportPdf, economicOfferPdf, abnormalJustificationPdf, ganttPdf, deucPdf };
import { planosPdf } from './planos';
import { daysUntil } from './util';
import { abnormalBaja } from './pricing';
import type { AppState, Project } from './types';
import { writeZip, type ZipEntry } from './pipeline/zip';
import { getFile } from './storage';
import { complianceChecks, readiness } from './derive';
import { fmtDate, nowIso, isUnknown } from './util';

export type PkgStatus = 'ready' | 'draft' | 'manual' | 'pending' | 'internal';
export interface PkgItem { id: string; name: string; ext: 'pdf' | 'xlsx' | 'docx' | 'other'; status: PkgStatus; note: string; include: boolean; vaultKey?: string; tenderKey?: string; sobre?: Sobre }
export type Sobre = 'admin' | 'tecnico' | 'economico' | 'completar' | 'interno';
/** Sobres o archivos electrónicos de la presentación (art. 157.2 LCSP): con criterios de juicio de valor son tres. */
export function sobres(p: Project): Record<Sobre, string> {
  const jv = p.criteria.some((c) => c.kind === 'judgement');
  return { admin: 'Sobre 1 - Documentación administrativa', tecnico: 'Sobre 2 - Criterios de juicio de valor', economico: jv ? 'Sobre 3 - Oferta económica y criterios de fórmula' : 'Sobre 2 - Oferta económica', completar: 'Formularios del pliego por completar', interno: '_Interno (no presentar)' };
}

const WIN = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
function clean(s: string) {
  return s.replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/→/g, '->').replace(/ /g, ' ')
    .split('').map((c) => (c.charCodeAt(0) < 256 || WIN.includes(c) ? c : '')).join('');
}

function extOf(name: string): PkgItem['ext'] {
  const e = name.toLowerCase().split('.').pop();
  return e === 'pdf' || e === 'xlsx' || e === 'docx' ? e : 'other';
}

export function packageItems(p: Project, s: AppState): PkgItem[] {
  const approved = p.sections.filter((x) => x.status === 'approved').length;
  const items: PkgItem[] = [];
  items.push({ id: 'tech', name: 'Memoria técnica.pdf', ext: 'pdf', status: approved === p.sections.length && p.sections.length > 0 ? 'ready' : 'draft', include: true,
    note: approved === p.sections.length ? `${p.sections.length} secciones aprobadas` : `${approved} de ${p.sections.length} secciones aprobadas — las no aprobadas se marcan como BORRADOR` });
  if (p.obra?.gantt) items.push({ id: 'gantt', name: 'Plan de obra (Gantt).pdf', ext: 'pdf', status: 'ready', include: true, note: `${p.obra.gantt.activities.length} actividades · ${p.obra.gantt.total} días · va con la memoria técnica` });
  if (p.obra?.budget) items.push({ id: 'budget', name: p.obra.budget.name, ext: 'other', status: 'ready', include: true, note: `Presupuesto con tu rebaja del ${(p.obra.budget.baja * 100).toFixed(1).replace('.', ',')} % · sobre de la oferta económica` });
  if (p.planos?.items?.length) items.push({ id: 'planos', name: 'Planos de la oferta.pdf', ext: 'pdf', status: 'ready', include: true, note: `${p.planos.items.length} plano${p.planos.items.length === 1 ? '' : 's'} de implantación y fases · va con la memoria técnica`, sobre: 'tecnico' });
  items.push({ id: 'decl', name: 'Declaración responsable.pdf', ext: 'pdf', status: 'ready', include: true, note: s.company.signer ? 'Preparada con tu perfil de empresa · fírmala antes de presentar' : 'Preparada con tu perfil de empresa · añade el firmante en Empresa y fírmala' });
  items.push({ id: 'deuc', name: 'DEUC prellenado.pdf', ext: 'pdf', status: 'manual', include: true, note: 'Datos ordenados por partes del DEUC para copiarlos en el servicio oficial · los motivos de exclusión los respondes tú' });
  items.push({ id: 'exp', name: 'Experiencia.pdf', ext: 'pdf', status: s.pastProjects.length ? 'ready' : 'pending', include: s.pastProjects.length > 0, note: s.pastProjects.length ? `${s.pastProjects.length} proyectos previos de tu perfil de empresa` : 'Añade proyectos previos en Empresa' });
  const vaultIds = new Set(p.requirements.flatMap((r) => r.evidence.filter((e) => e.kind === 'vault' && e.ref).map((e) => e.ref!)));
  const vaultDocs = s.vault.filter((v) => vaultIds.has(v.id));
  if (vaultDocs.length) {
    const withFile = vaultDocs.filter((v) => v.hasFile);
    items.push({ id: 'company', name: 'Documentación de empresa.pdf', ext: 'pdf', status: withFile.length === vaultDocs.length ? 'ready' : 'manual', include: true,
      note: `Índice de ${vaultDocs.length} documentos de tu biblioteca${withFile.length < vaultDocs.length ? ` · ${vaultDocs.length - withFile.length} registros de ejemplo que debes adjuntar de tus archivos` : ''}` });
    withFile.forEach((v) => { const d = daysUntil(v.expiresAt); items.push({ id: `v-${v.id}`, name: v.name, ext: extOf(v.name), status: d != null && d < 0 ? 'pending' : 'ready', include: true, note: d != null && d < 0 ? 'CADUCADO: sube la versión renovada antes de presentar' : d != null && d < 30 ? `De tu biblioteca · caduca en ${d} días` : 'De tu biblioteca de documentos', vaultKey: v.textKey }); });
  }
  const pr = p.pricing;
  if (pr?.choice) {
    if (pr.approved && pr.filled) items.push({ id: 'model', name: pr.filled.name, ext: pr.filled.ext, status: 'ready', include: true, note: `Modelo oficial del pliego rellenado con tu precio · revísalo y fírmalo · solo en el sobre de precio`, vaultKey: undefined });
    items.push({ id: 'fin', name: 'Oferta económica.pdf', ext: 'pdf', status: pr.approved ? 'ready' : 'draft', include: true, note: pr.approved ? (pr.filled ? 'Resumen de tu oferta con los mismos importes · útil si la plataforma pide un PDF propio' : `Con el precio que has confirmado${pr.rule?.model ? ` · si la plataforma exige ${pr.rule.model.name}, copia en él estos importes` : ''} · solo en el sobre de precio, firmada`) : 'Precio elegido pero sin confirmar: confírmalo en «Fija el precio»' });
    if (pr.rule?.budget && pr.choice.baja >= abnormalBaja(pr.rule, { mean: 0.08, best: 0.15, n: 0, scope: '' }) - 0.02) items.push({ id: 'justif', name: 'Justificación de la oferta (borrador).pdf', ext: 'pdf', status: 'internal', include: true, note: 'Tu precio está cerca de la baja temeraria: tenlo preparado por si te piden justificarlo' });
  } else items.push({ id: 'fin', name: 'Oferta económica', ext: 'pdf', status: p.manualChecks.financialApproved ? 'manual' : 'pending', include: false, note: p.manualChecks.financialApproved ? 'Preparada fuera de PROPO por tu equipo · va en el sobre de precio' : 'Fija el precio en el paso «Fija el precio» y PROPO prepara la oferta' });
  p.docs.filter((d) => /annex|anexo|annexe|model|form|declaration|declaraci/i.test(d.name) && !/criteria|specification|criterios|prescripciones|contrato/i.test(d.name) && !(pr?.approved && pr.filled?.source === d.name)).forEach((d) => {
    items.push({ id: `t-${d.id}`, name: d.name, ext: extOf(d.name), status: 'manual', include: !!d.textKey, note: d.textKey ? 'Formulario del pliego · complétalo y fírmalo' : 'Formulario del pliego (ejemplo) · complétalo y fírmalo', tenderKey: d.textKey });
  });
  items.push({ id: 'report', name: 'Informe de cumplimiento.pdf', ext: 'pdf', status: 'internal', include: true, note: 'Para tu equipo · no lo presentes' });
  // Cada documento en su sobre
  const ECO = new Set(['fin', 'model', 'budget']); const TEC = new Set(['tech', 'gantt', 'planos']);
  for (const it of items) it.sobre ??= it.status === 'internal' ? 'interno' : ECO.has(it.id) ? 'economico' : TEC.has(it.id) ? 'tecnico' : it.tenderKey ? 'completar' : 'admin';
  return items;
}

export async function buildPackageZip(p: Project, s: AppState): Promise<Uint8Array> {
  const items = packageItems(p, s);
  const files: ZipEntry[] = [];
  const enc = new TextEncoder();
  const folder = (p.name || 'Propuesta').replace(/[^\p{L}\p{N}\- ]+/gu, '').trim().slice(0, 60) || 'Propuesta';
  const put = (name: string, data: Uint8Array) => files.push({ name: `${folder}/${name}`, data });
  // Ordenado por sobres, tal como se presenta en la plataforma de contratación.
  const S = sobres(p); const jv = p.criteria.some((c) => c.kind === 'judgement');
  const tec = jv ? S.tecnico : S.admin;
  put(`${tec}/Memoria técnica.pdf`, await technicalProposalPdf(p, s));
  if (p.obra?.gantt) put(`${tec}/Plan de obra (Gantt).pdf`, await ganttPdf(p, s));
  if (p.planos?.items?.length) put(`${tec}/Planos de la oferta.pdf`, await planosPdf(p, s));
  put(`${S.admin}/Declaración responsable.pdf`, await declarationPdf(p, s));
  put(`${S.admin}/DEUC prellenado (copiar en el servicio DEUC).pdf`, await deucPdf(p, s));
  if (s.pastProjects.length) put(`${S.admin}/Experiencia.pdf`, await experiencePdf(p, s));
  if (items.some((i) => i.id === 'company')) put(`${S.admin}/Documentación de empresa.pdf`, await companyIndexPdf(p, s));
  // Anexos administrativos rellenados por PROPO sobre el documento original del organismo.
  for (const a of p.annexes?.items ?? []) if (a.key && !a.economic) { const b = await getFile(a.key); if (b) put(`${S.admin}/Anexos/${a.name}`, new Uint8Array(b)); }
  if (p.pricing?.choice) put(`${S.economico}/Oferta económica.pdf`, await economicOfferPdf(p, s));
  if (p.obra?.budget) { const b = await getFile(p.obra.budget.key); if (b) put(`${S.economico}/${p.obra.budget.name}`, new Uint8Array(b)); }
  if (p.pricing?.approved && p.pricing.filled) { const b = await getFile(p.pricing.filled.key); if (b) put(`${S.economico}/${p.pricing.filled.name}`, new Uint8Array(b)); }
  if (items.some((i) => i.id === 'justif')) put(`${S.interno}/Justificación de la oferta (borrador, solo si la piden).pdf`, await abnormalJustificationPdf(p, s));
  for (const it of items) {
    if (it.vaultKey) { const b = await getFile(it.vaultKey); if (b) put(`${S.admin}/Documentos de empresa/${it.name}`, new Uint8Array(b)); }
    if (it.tenderKey) { const b = await getFile(it.tenderKey); if (b) put(`${S.completar}/${it.name}`, new Uint8Array(b)); }
  }
  put(`${S.interno}/Informe de cumplimiento.pdf`, await complianceReportPdf(p, s));
  const manual = items.filter((i) => i.status === 'manual' || i.status === 'pending' || i.status === 'draft');
  const readme = [
    `PAQUETE DE PRESENTACIÓN — ${p.name}`,
    `Preparado con PROPO el ${fmtDate(nowIso())}. Preparación: ${readiness(p)} %.`,
    '',
    'PROPO prepara y revisa. Tu equipo aprueba y presenta en la plataforma de contratación.',
    '',
    'Antes de presentar:',
    ...manual.map((i) => `- ${i.name}: ${i.note}`),
    '- Firma todos los documentos con la firma electrónica cualificada del representante legal.',
    '- Cada carpeta corresponde a un sobre o archivo electrónico. Comprueba en el pliego cuántos sobres hay y cómo se llaman: algunas plataformas los llaman "archivo A, B, C".',
    `- La oferta económica (carpeta "${sobres(p).economico}") va solo en su sobre. Nunca incluyas precios ni valores de criterios de fórmula en el sobre técnico.`,
    '- El DEUC se cumplimenta en el servicio DEUC electrónico (visor.registrodelicitadores.gob.es/espd-web) copiando los datos del PDF prellenado.',
    '- Los formularios de la carpeta "Formularios del pliego por completar" van en el sobre que indique el pliego.',
    '',
    'La carpeta "_Interno (no presentar)" es para tu equipo y no debe presentarse.',
  ].join('\r\n');
  put('LEEME.txt', enc.encode(readme));
  return writeZip(files);
}
