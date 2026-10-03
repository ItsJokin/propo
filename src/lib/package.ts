// Submission package: generated PDFs + stored company documents + tender forms.
// PROPO never includes prices it produced (it produces none) and never submits.
import { technicalProposalPdf, declarationPdf, experiencePdf, companyIndexPdf, complianceReportPdf } from './pdf/docs';
export { technicalProposalPdf, declarationPdf, experiencePdf, companyIndexPdf, complianceReportPdf };
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
  items.push({ id: 'fin', name: 'Oferta económica.xlsx', ext: 'xlsx', status: p.manualChecks.financialApproved ? 'ready' : 'manual', include: false, note: p.manualChecks.financialApproved ? 'Aprobada por tu equipo · preparada fuera de PROPO, va en el sobre de precio' : 'Los precios los fija tu equipo. PROPO no prepara precios.' });
  p.docs.filter((d) => /annex|anexo|annexe|model|form|declaration|declaraci/i.test(d.name) && !/criteria|specification|criterios|prescripciones|contrato/i.test(d.name)).forEach((d) => {
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
    '- Pon la oferta económica solo en el sobre de precio. Nunca incluyas precios en el sobre técnico.',
    '',
    'El archivo que empieza por "_Interno" es para tu equipo y no debe presentarse.',
  ].join('\r\n');
  put('LEEME.txt', enc.encode(readme));
  return writeZip(files);
}
