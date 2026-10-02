// Submission package: generated PDFs + stored company documents + tender forms.
// PROPO never includes prices it produced (it produces none) and never submits.
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
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

// ---------------------------------------------------------------------------

interface Writer { doc: PDFDocument; font: PDFFont; bold: PDFFont; page: PDFPage; y: number; title: string; }

async function newWriter(title: string): Promise<Writer> {
  const doc = await PDFDocument.create();
  doc.setTitle(clean(title)); doc.setProducer('PROPO'); doc.setCreator('PROPO');
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const w: Writer = { doc, font, bold, page: null as any, y: 0, title };
  addPage(w);
  return w;
}
function addPage(w: Writer) {
  w.page = w.doc.addPage([595, 842]);
  w.y = 780;
  w.page.drawText(clean(w.title), { x: 56, y: 808, size: 8, font: w.font, color: rgb(0.45, 0.47, 0.52) });
}
function ensure(w: Writer, h: number) { if (w.y - h < 60) addPage(w); }
function wrapLines(text: string, font: PDFFont, size: number, width: number) {
  const out: string[] = [];
  for (const para of clean(text).split('\n')) {
    let cur = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const t = cur ? cur + ' ' + word : word;
      if (font.widthOfTextAtSize(t, size) > width && cur) { out.push(cur); cur = word; } else cur = t;
    }
    out.push(cur);
  }
  return out;
}
function text(w: Writer, s: string, opts: { size?: number; bold?: boolean; gap?: number; indent?: number; color?: [number, number, number] } = {}) {
  const size = opts.size ?? 10.5; const f = opts.bold ? w.bold : w.font; const x = 56 + (opts.indent ?? 0);
  for (const line of wrapLines(s, f, size, 483 - (opts.indent ?? 0))) {
    ensure(w, size + 5);
    w.page.drawText(line, { x, y: w.y, size, font: f, color: opts.color ? rgb(...opts.color) : rgb(0.07, 0.08, 0.1) });
    w.y -= size * 1.45;
  }
  w.y -= opts.gap ?? 6;
}
async function finish(w: Writer) {
  const pages = w.doc.getPages();
  pages.forEach((pg, i) => pg.drawText(`${i + 1} / ${pages.length}`, { x: 510, y: 36, size: 8, font: w.font, color: rgb(0.45, 0.47, 0.52) }));
  return w.doc.save();
}

function plainSection(content: string) {
  return content.replace(/\s?\[S\d+\]/g, '').replace(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g, '[INFORMACIÓN REQUERIDA: $1]');
}

export async function technicalProposalPdf(p: Project, s: AppState) {
  const w = await newWriter(`${s.company.legalName || 'Empresa'} — Memoria técnica — ${p.name}`);
  text(w, 'Memoria técnica', { size: 22, bold: true, gap: 4 });
  text(w, p.name, { size: 13, gap: 2 });
  text(w, `${p.organization}${!isUnknown(p.analysis?.reference) ? ' · Exp. ' + p.analysis!.reference : ''}`, { size: 10, color: [0.4, 0.42, 0.47], gap: 2 });
  text(w, `Presentada por ${s.company.legalName || '[nombre de la empresa]'} · ${fmtDate(nowIso())}`, { size: 10, color: [0.4, 0.42, 0.47], gap: 20 });
  p.sections.forEach((sec, i) => {
    ensure(w, 60);
    text(w, `${i + 1}. ${sec.title}${sec.status !== 'approved' ? '   [BORRADOR — sin aprobar]' : ''}`, { size: 14, bold: true, gap: 6 });
    if (!sec.content.trim()) { text(w, '[Sección todavía sin redactar]', { color: [0.6, 0.35, 0.05] }); return; }
    for (const para of plainSection(sec.content).split(/\n{2,}/)) {
      const lines = para.split('\n');
      lines.forEach((l) => {
        if (/^\s*[-•*]\s+/.test(l)) text(w, '•  ' + l.replace(/^\s*[-•*]\s+/, ''), { indent: 10, gap: 1 });
        else if (l.trim()) text(w, l, { gap: 1 });
      });
      w.y -= 6;
    }
    w.y -= 8;
  });
  return finish(w);
}

export async function declarationPdf(p: Project, s: AppState) {
  const c = s.company;
  const w = await newWriter(`Declaración responsable — ${p.name}`);
  text(w, 'Declaración responsable', { size: 20, bold: true, gap: 4 });
  text(w, 'BORRADOR preparado por PROPO con tu perfil de empresa. Revísalo, complétalo y fírmalo con firma electrónica cualificada.', { size: 9.5, color: [0.6, 0.35, 0.05], gap: 16 });
  text(w, `D./D.ª [nombre del representante legal], en nombre y representación de ${c.legalName || '[razón social]'}, con NIF ${c.taxId || '[NIF]'} y domicilio en ${c.address || '[dirección]'}, en relación con el procedimiento «${p.name}»${!isUnknown(p.analysis?.reference) ? ` (exp. ${p.analysis!.reference})` : ''} convocado por ${p.organization || '[órgano de contratación]'}, DECLARA bajo su responsabilidad:`, { gap: 10 });
  [
    'Que la empresa tiene plena capacidad de obrar y no está incursa en ninguna de las prohibiciones de contratar previstas en la ley.',
    'Que la empresa está al corriente de sus obligaciones tributarias y con la Seguridad Social.',
    'Que la empresa cumple la solvencia económica, financiera y técnica exigida y aportará los documentos acreditativos cuando se le requieran.',
    'Que la empresa cumple las obligaciones en materia de igualdad, prevención de riesgos laborales y el convenio colectivo aplicable.',
    'Que la empresa acepta incondicionalmente el contenido de los pliegos.',
  ].forEach((t, i) => text(w, `${i + 1}. ${t}`, { indent: 8, gap: 6 }));
  w.y -= 20;
  text(w, 'Lugar y fecha: ____________________', { gap: 24 });
  text(w, 'Firma del representante legal: ____________________');
  return finish(w);
}

export async function experiencePdf(p: Project, s: AppState) {
  const w = await newWriter(`Experiencia relevante — ${s.company.legalName}`);
  text(w, 'Experiencia relevante', { size: 20, bold: true, gap: 4 });
  text(w, `${s.company.legalName} · para «${p.name}»`, { size: 10, color: [0.4, 0.42, 0.47], gap: 16 });
  s.pastProjects.forEach((pp) => {
    ensure(w, 70);
    text(w, pp.title, { bold: true, size: 12, gap: 2 });
    text(w, `Cliente: ${pp.client || '—'} · Periodo: ${pp.years || '—'} · Importe anual: ${pp.value || '—'} · Certificado de buena ejecución: ${pp.hasCertificate ? 'disponible' : 'no guardado'}`, { size: 9.5, color: [0.4, 0.42, 0.47], gap: 3 });
    if (pp.description) text(w, pp.description, { gap: 10 });
  });
  return finish(w);
}

export async function companyIndexPdf(p: Project, s: AppState) {
  const w = await newWriter(`Documentación de empresa — ${s.company.legalName}`);
  text(w, 'Documentación de empresa', { size: 20, bold: true, gap: 16 });
  const ids = new Set(p.requirements.flatMap((r) => r.evidence.filter((e) => e.kind === 'vault').map((e) => e.ref)));
  s.vault.filter((v) => ids.has(v.id)).forEach((v, i) => {
    const reqs = p.requirements.filter((r) => r.evidence.some((e) => e.ref === v.id)).map((r) => r.title);
    text(w, `${i + 1}. ${v.name}`, { bold: true, gap: 2 });
    text(w, `Acredita: ${reqs.join('; ')}${v.expiresAt ? ` · válido hasta ${fmtDate(v.expiresAt)}` : ''}${v.hasFile ? ' · incluido en este paquete' : ' · adjúntalo de tus archivos'}`, { size: 9.5, color: [0.4, 0.42, 0.47], gap: 8 });
  });
  return finish(w);
}

export async function complianceReportPdf(p: Project) {
  const w = await newWriter(`Informe de cumplimiento — ${p.name}`);
  text(w, 'Informe de cumplimiento', { size: 20, bold: true, gap: 4 });
  text(w, `${p.name} · ${readiness(p)} % lista · generado el ${fmtDate(nowIso())} · documento interno, no presentar`, { size: 10, color: [0.4, 0.42, 0.47], gap: 16 });
  text(w, 'Comprobaciones finales', { size: 13, bold: true, gap: 6 });
  complianceChecks(p).forEach((c) => text(w, `[${c.state === 'pass' ? 'OK' : c.state === 'warn' ? 'REVISAR' : 'PENDIENTE'}]  ${c.label} — ${c.detail}`, { indent: 6, gap: 3 }));
  w.y -= 10;
  text(w, 'Requisitos', { size: 13, bold: true, gap: 6 });
  p.requirements.forEach((r) => {
    ensure(w, 40);
    const st = r.status === 'fulfilled' ? 'CUMPLIDO' : r.status === 'needs_info' ? 'FALTA INFO' : r.status === 'missing' ? 'FALTA' : 'OMITIDO';
    text(w, `[${st}] ${r.title}`, { bold: true, size: 10, gap: 1 });
    text(w, `${r.source.docName}, p. ${r.source.page}${r.evidence.length ? ' · Pruebas: ' + r.evidence.map((e) => e.label).join('; ') : ''}`, { size: 9, color: [0.4, 0.42, 0.47], gap: 5 });
  });
  return finish(w);
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
  put('_Interno — Informe de cumplimiento.pdf', await complianceReportPdf(p));
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
