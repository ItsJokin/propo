// Submission package: generated PDFs + stored company documents + tender forms.
// El precio lo confirma siempre el cliente en el paso «Fija el precio»; PROPO nunca presenta nada.
import { technicalProposalPdf, declarationPdf, experiencePdf, companyIndexPdf, complianceReportPdf, economicOfferPdf, abnormalJustificationPdf, ganttPdf } from './pdf/docs';
export { technicalProposalPdf, declarationPdf, experiencePdf, companyIndexPdf, complianceReportPdf, economicOfferPdf, abnormalJustificationPdf, ganttPdf };
import { abnormalBaja } from './pricing';
import type { AppState, Project } from './types';
import { writeZip, type ZipEntry } from './pipeline/zip';
import { getFile } from './storage';
import { complianceChecks, readiness } from './derive';
import { fmtDate, nowIso, isUnknown } from './util';

export type PkgStatus = 'ready' | 'draft' | 'manual' | 'pending' | 'internal';
export interface PkgItem { id: string; name: string; ext: 'pdf' | 'xlsx' | 'docx' | 'other'; status: PkgStatus; note: string; include: boolean; vaultKey?: string; tenderKey?: string; }

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
  items.push({ id: 'decl', name: 'Declaración responsable.pdf', ext: 'pdf', status: 'ready', include: true, note: 'Preparada con tu perfil de empresa · fírmala antes de presentar' });
  items.push({ id: 'exp', name: 'Experiencia.pdf', ext: 'pdf', status: s.pastProjects.length ? 'ready' : 'pending', include: s.pastProjects.length > 0, note: s.pastProjects.length ? `${s.pastProjects.length} proyectos previos de tu perfil de empresa` : 'Añade proyectos previos en Empresa' });
  const vaultIds = new Set(p.requirements.flatMap((r) => r.evidence.filter((e) => e.kind === 'vault' && e.ref).map((e) => e.ref!)));
  const vaultDocs = s.vault.filter((v) => vaultIds.has(v.id));
  if (vaultDocs.length) {
    const withFile = vaultDocs.filter((v) => v.hasFile);
    items.push({ id: 'company', name: 'Documentación de empresa.pdf', ext: 'pdf', status: withFile.length === vaultDocs.length ? 'ready' : 'manual', include: true,
      note: `Índice de ${vaultDocs.length} documentos de tu biblioteca${withFile.length < vaultDocs.length ? ` · ${vaultDocs.length - withFile.length} registros de ejemplo que debes adjuntar de tus archivos` : ''}` });
    withFile.forEach((v) => items.push({ id: `v-${v.id}`, name: v.name, ext: extOf(v.name), status: 'ready', include: true, note: 'De tu biblioteca de documentos', vaultKey: v.textKey }));
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
  return items;
}

export async function buildPackageZip(p: Project, s: AppState): Promise<Uint8Array> {
  const items = packageItems(p, s);
  const files: ZipEntry[] = [];
  const enc = new TextEncoder();
  const folder = (p.name || 'Propuesta').replace(/[^\p{L}\p{N}\- ]+/gu, '').trim().slice(0, 60) || 'Propuesta';
  const put = (name: string, data: Uint8Array) => files.push({ name: `${folder}/${name}`, data });
  put('Memoria técnica.pdf', await technicalProposalPdf(p, s));
  put('Declaración responsable.pdf', await declarationPdf(p, s));
  if (s.pastProjects.length) put('Experiencia.pdf', await experiencePdf(p, s));
  if (items.some((i) => i.id === 'company')) put('Documentación de empresa.pdf', await companyIndexPdf(p, s));
  if (p.pricing?.choice) put('Sobre de la oferta económica/Oferta económica.pdf', await economicOfferPdf(p, s));
  if (p.obra?.gantt) put('Plan de obra (Gantt).pdf', await ganttPdf(p, s));
  if (p.obra?.budget) { const b = await getFile(p.obra.budget.key); if (b) put(`Sobre de la oferta económica/${p.obra.budget.name}`, new Uint8Array(b)); }
  if (p.pricing?.approved && p.pricing.filled) { const b = await getFile(p.pricing.filled.key); if (b) put(`Sobre de la oferta económica/${p.pricing.filled.name}`, new Uint8Array(b)); }
  // Anexos administrativos rellenados por PROPO sobre el documento original del organismo.
  for (const a of p.annexes?.items ?? []) if (a.key && !a.economic) { const b = await getFile(a.key); if (b) put(`Anexos rellenados/${a.name}`, new Uint8Array(b)); }
  if (items.some((i) => i.id === 'justif')) put('_Interno — Justificación de la oferta (borrador, solo si la piden).pdf', await abnormalJustificationPdf(p, s));
  for (const it of items) {
    if (it.vaultKey) { const b = await getFile(it.vaultKey); if (b) put(`Documentos de empresa/${it.name}`, new Uint8Array(b)); }
    if (it.tenderKey) { const b = await getFile(it.tenderKey); if (b) put(`Formularios del pliego por completar/${it.name}`, new Uint8Array(b)); }
  }
  put('_Interno — Informe de cumplimiento.pdf', await complianceReportPdf(p, s));
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
    '- Pon la oferta económica (carpeta "Sobre de la oferta económica") solo en el sobre de precio. Nunca incluyas precios en el sobre técnico.',
    '',
    'El archivo que empieza por "_Interno" es para tu equipo y no debe presentarse.',
  ].join('\r\n');
  put('LEEME.txt', enc.encode(readme));
  return writeZip(files);
}
