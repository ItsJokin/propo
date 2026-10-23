// Anexos del pliego rellenados por PROPO: declaraciones responsables, adscripción de medios, ficha de empresa,
// autorizaciones… Se detectan en los documentos de la licitación (un anexo puede ser un archivo propio o unas páginas
// del pliego) y se rellenan SOBRE EL DOCUMENTO ORIGINAL del organismo: en un PDF plano se escribe cada dato encima de
// sus puntos suspensivos; en un PDF con formulario, en sus campos; en un Word, en sus párrafos.
// La IA solo decide qué dato va en cada hueco; el dato sale siempre del perfil de empresa o de la licitación, y lo que
// no se sabe se deja en blanco y se avisa al cliente («falta el DNI del representante»).
import type { AppState, Project } from './types';
import { ai } from './ai/provider';
import { getFile, getPages, putFile } from './storage';
import { fmtDate, nowIso, isUnknown, normalize } from './util';
import { PDFDocument, PDFTextField, StandardFonts, rgb } from 'pdf-lib';
import { textToDocx } from './pipeline/legacy';
import { fillDocxWith, dataBlob, flat, onlyData } from './offerModel';

export interface AnnexItem {
  id: string; annex: string; title: string; docId: string; docName: string; ext: 'pdf' | 'docx'; pages: number[];
  economic: boolean;             // modelo de oferta económica: lo rellena el paso «Fija el precio», aquí solo se identifica
  key?: string; name?: string;   // archivo rellenado
  filled: number; total: number; pending: string[]; error?: string; at?: string;
}
export interface Annexes { at: string; items: AnnexItem[] }

// Encabezado de anexo: en mayúsculas al principio de un renglón y sin coma detrás (eso sería una mención en el texto).
const HEAD = /(?:^|\n)\s*(ANEXO|ANNEX|MODELO)\s*(?:N[ºo°.]\s*)?([IVXLC]{1,6}|\d{1,2})\b(?!\s*,)[\s.:\-–—]*([^\n]{0,140})/;
const GAP = /\.{4,}|…{2,}|_{4,}/g;
const ECON = /oferta econ[oó]mica|proposici[oó]n econ[oó]mica|modelo de oferta|precio ofertado|importe ofertado/i;
const extOf = (n: string) => (n.toLowerCase().split('.').pop() || '');
const WORDISH = ['doc', 'rtf', 'odt'];   // formatos de Word antiguos o alternativos: se rellenan sobre un .docx con su texto

/** Encuentra los anexos con huecos que rellenar en los documentos de la licitación. */
export async function detectAnnexes(p: Project): Promise<AnnexItem[]> {
  const out: AnnexItem[] = [];
  for (const d of p.docs.filter((x) => x.textKey && ['pdf', 'docx', ...WORDISH].includes(extOf(x.name)))) {
    const pages = (await getPages(d.textKey!)) || [];
    const ext = (extOf(d.name) === 'pdf' ? 'pdf' : 'docx') as 'pdf' | 'docx';   // .doc, .rtf y .odt se rellenan como Word
    if (ext === 'docx') {
      const text = pages.join('\n');
      const gaps = (text.match(GAP) || []).length;
      const heads = [...text.matchAll(new RegExp(HEAD.source, 'g'))].map((m) => `${m[1][0].toUpperCase()}${m[1].slice(1).toLowerCase()} ${m[2].toUpperCase()}`);
      if (gaps >= 2 && (heads.length || /anexo|modelo|declaraci/i.test(d.name))) {
        out.push({ id: `${d.id}:all`, annex: heads.length ? [...new Set(heads)].slice(0, 4).join(', ') : 'Anexo', title: d.name.replace(/\.(docx?|rtf|odt)$/i, ''), docId: d.id, docName: d.name, ext, pages: [], economic: ECON.test(text) && !/declaraci/i.test(text.slice(0, 2000)), filled: 0, total: gaps, pending: [] });
      }
      continue;
    }
    // PDF: un anexo empieza en una página con «ANEXO X» arriba y sigue mientras haya huecos sin otro encabezado.
    let cur: AnnexItem | null = null;
    pages.forEach((t, i) => {
      const top = t.slice(0, 600); const h = top.match(HEAD); const gaps = (t.match(GAP) || []).length;
      if (h) {
        if (cur && cur.total) out.push(cur);
        const label = `${h[1][0].toUpperCase()}${h[1].slice(1).toLowerCase()} ${h[2].toUpperCase()}`;
        cur = { id: `${d.id}:${i + 1}`, annex: label, title: (h[3] || t.slice(top.indexOf(h[0]) + h[0].length, 200)).replace(/\s+/g, ' ').trim().slice(0, 120) || label, docId: d.id, docName: d.name, ext, pages: [i + 1], economic: ECON.test(t.slice(0, 1500)), filled: 0, total: gaps, pending: [] };
      } else if (cur && gaps && i + 1 === cur.pages[cur.pages.length - 1] + 1) { cur.pages.push(i + 1); cur.total += gaps; }
      else if (cur) { if (cur.total) out.push(cur); cur = null; }
    });
    if (cur && (cur as AnnexItem).total) out.push(cur);
  }
  // Un mismo anexo puede venir en dos documentos (el pliego y un archivo aparte): se queda el archivo propio.
  const seen = new Map<string, AnnexItem>();
  for (const a of out) { const k = normalize(a.annex); const prev = seen.get(k); if (!prev || (prev.pages.length > 2 && a.pages.length <= prev.pages.length)) seen.set(k, a); }
  return [...seen.values()].slice(0, 20);
}

/** Datos que se pueden escribir en un anexo administrativo (sin precios: la oferta económica va aparte). */
export function annexData(p: Project, s: AppState) {
  const c = s.company;
  const city = (c.address || '').split(',').map((x) => x.trim()).filter(Boolean).pop()?.replace(/^\d{5}\s*/, '') || null;
  return {
    licitador: c.legalName || null, nombre_comercial: c.tradeName || null, nif: c.taxId || null, domicilio: c.address || null, localidad: city,
    representante: c.signer || null, dni_representante: c.signerId || null, cargo_representante: c.signerRole || null,
    telefono: c.phone || null, email: c.email || null, web: c.website || null,
    plantilla: c.employees || null, facturacion: c.revenue || null, facturacion_ultimos_anos: c.revenueHistory || null,
    rolece: c.roleceNumber || null, clasificaciones: (c.clasificaciones ?? []).map((x) => `${x.grupo}-${x.subgrupo}-${x.categoria}`).join(', ') || null,
    medios_tecnicos: (c.maquinaria ?? []).map((m) => `${m.cantidad || 1} × ${m.nombre}`).join('; ') || null,
    equipo: s.team.map((t) => `${t.name} (${t.role})`).join('; ') || null,
    expediente: !isUnknown(p.analysis?.reference) ? p.analysis!.reference : p.tender?.live?.ref || null, objeto: p.tender?.title || p.name, organo: p.organization,
    fecha: fmtDate(nowIso()), lugar_y_fecha: city ? `${city}, ${fmtDate(nowIso())}` : fmtDate(nowIso()),
  };
}
const numsOf = (d: unknown) => new Set((JSON.stringify(d).match(/\d[\d.,]*/g) || []).flatMap((n) => [n, n.replace(/[.,]$/, '')]));

const RULES = `Reglas:
- Rellena SOLO los huecos (puntos suspensivos, guiones bajos, «(en letra)», casillas…) con los datos que te doy.
- No cambies ni resumas el texto fijo del documento.
- Si para un hueco no hay dato (null) o no estás seguro de cuál es, déjalo vacío: nunca inventes un nombre, un DNI, una fecha o una cifra.
- No rellenes importes ni precios de la oferta.`;

/** PDF plano: cada hueco de puntos con su línea de contexto; la IA dice qué dato va; se escribe encima. */
async function fillFlatPdf(p: Project, data: ReturnType<typeof annexData>, buf: ArrayBuffer, pages: number[]) {
  const { pdfItems } = await import('./pipeline/parse');
  const items = await pdfItems(buf.slice(0), pages);
  type Gap = { id: string; page: number; x0: number; x1: number; y: number; h: number; line: string };
  const gaps: Gap[] = [];
  // Posición de cada hueco dentro de su trozo de texto, medida con anchos de letra reales (un «…» ocupa mucho más
  // que una letra: contar caracteres colocaría el dato a mitad de los puntos).
  const metric = await (await PDFDocument.create()).embedFont(StandardFonts.Helvetica);
  const wOf = (t: string) => { try { return metric.widthOfTextAtSize(t.split('').filter((ch) => ch.charCodeAt(0) < 256 || ch === '…').join(''), 10); } catch { return t.length * 5; } };
  for (const it of items) {
    const total = wOf(it.str) || 1;
    for (const m of it.str.matchAll(GAP)) {
      const end = m.index! + m[0].length;
      const a = wOf(it.str.slice(0, m.index!)) / total;
      const b = /^[.…_\s]*$/.test(it.str.slice(end)) ? 1 : wOf(it.str.slice(0, end)) / total;   // puntos sueltos al final: también se tapan
      gaps.push({ id: `g${gaps.length}`, page: it.page, x0: it.x + it.w * a, x1: it.x + it.w * b, y: it.y, h: it.h, line: '' });
      if (gaps.length >= 150) break;
    }
  }
  if (!gaps.length) return null;
  // Los puntos de un mismo hueco a veces vienen partidos en varios trozos: se unen si están seguidos en el renglón.
  gaps.sort((a, b) => a.page - b.page || b.y - a.y || a.x0 - b.x0);
  for (let i = gaps.length - 1; i > 0; i--) {
    const a = gaps[i - 1], b = gaps[i];
    const between = items.some((it) => it.page === a.page && Math.abs(it.y - a.y) < 1 && it.x > a.x1 + 1 && it.x + it.w < b.x0 - 1 && it.str.replace(GAP, '').replace(/[.…_\s]/g, ''));
    if (a.page === b.page && Math.abs(a.y - b.y) < 1 && b.x0 - a.x1 < 14 && !between) { a.x1 = Math.max(a.x1, b.x1); gaps.splice(i, 1); }
  }
  gaps.forEach((g, i) => { g.id = `g${i}`; });
  // Contexto: la línea entera (mismo renglón) con cada hueco marcado ⟦gN⟧.
  for (const g of gaps) {
    if (g.line) continue;
    const near = (y: number, page: number) => page === g.page && Math.abs(y - g.y) < Math.max(2, g.h * 0.4);
    const row = items.filter((it) => near(it.y, it.page)).sort((x, y) => x.x - y.x);
    const rowGaps = gaps.filter((z) => near(z.y, z.page)).sort((x, y) => x.x0 - y.x0);
    let k = 0;
    const line = row.map((it) => it.str.replace(GAP, () => `⟦${rowGaps[k++]?.id ?? '?'}⟧`)).join(' ').replace(/\s+/g, ' ').trim();
    for (const z of rowGaps) z.line = line;
  }
  const lines = [...new Map(gaps.map((g) => [g.line, g])).values()].map((g) => `p.${g.page}: ${g.line}`).join('\n').slice(0, 20000);
  const j = await ai.json<{ values: { id: string; value: string }[] }>(`Este es un anexo administrativo de una licitación española (declaración responsable, compromiso, autorización…). Cada línea es un renglón del documento; los huecos a rellenar están marcados ⟦gN⟧. Di qué dato va en cada hueco.

Datos:
${JSON.stringify(data, null, 1)}

Renglones:
${lines}

${RULES}

Devuelve SOLO JSON: {"values": [{"id": "gN", "value": "texto"}]}`, { tier: 'default', project: p.isSample ? '' : p.id });
  const blob = dataBlob(data); const ok = numsOf(data);
  const valid = new Map<string, string>();
  for (const v of j?.values || []) {
    const g = gaps.find((x) => x.id === v?.id); const val = String(v?.value ?? '').trim();
    if (!g || !val || val.length > 160) continue;
    if (!blob.includes(flat(val))) continue;                                                   // el dato tiene que salir de los datos
    if ((val.match(/\d[\d.,]*/g) || []).some((n) => !ok.has(n) && !ok.has(n.replace(/[.,]$/, '')))) continue;
    valid.set(g.id, val);
  }
  const src = await PDFDocument.load(buf, { ignoreEncryption: true });
  const outDoc = await PDFDocument.create();
  const copied = await outDoc.copyPages(src, pages.map((n) => n - 1));
  copied.forEach((pg) => outDoc.addPage(pg));
  const font = await outDoc.embedFont(StandardFonts.Helvetica);
  const win = (t: string) => t.split('').filter((ch) => ch.charCodeAt(0) < 256 || '€'.includes(ch)).join('');
  for (const g of gaps) {
    const val = valid.get(g.id); if (!val) continue;
    const pg = copied[pages.indexOf(g.page)]; if (!pg) continue;
    const w = Math.max(20, g.x1 - g.x0); let size = Math.min(10, g.h * 0.95);
    while (size > 5 && font.widthOfTextAtSize(win(val), size) > w + 40) size -= 0.5;
    pg.drawRectangle({ x: g.x0 - 0.5, y: g.y - g.h * 0.25, width: w + 1, height: g.h * 1.1, color: rgb(1, 1, 1) });
    pg.drawText(win(val), { x: g.x0 + 1, y: g.y + 0.5, size, font, color: rgb(0.05, 0.1, 0.35) });
  }
  const pending = [...new Set(gaps.filter((g) => !valid.has(g.id)).map((g) => g.line.replace(/⟦g\d+⟧/g, '…').replace(/⟦\?⟧/g, '…').slice(0, 140)))].slice(0, 8);
  return { bytes: await outDoc.save(), filled: valid.size, total: gaps.length, pending };
}

/** PDF con formulario: se rellenan sus campos; se devuelven solo las páginas del anexo. */
async function fillFormPdf(p: Project, data: ReturnType<typeof annexData>, buf: ArrayBuffer, pages: number[]) {
  const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
  const fields = pdf.getForm().getFields().filter((f): f is PDFTextField => f instanceof PDFTextField && !f.getText());
  if (!fields.length) return null;
  const j = await ai.json<{ fields: { name: string; value: string }[] }>(`Este PDF es un anexo administrativo de una licitación y tiene estos campos de formulario vacíos:
${fields.slice(0, 120).map((f) => `- ${f.getName()}`).join('\n')}

Datos:
${JSON.stringify(data, null, 1)}

${RULES}

Devuelve SOLO JSON: {"fields": [{"name": "nombre exacto del campo", "value": "texto"}]}`, { tier: 'default', project: p.isSample ? '' : p.id });
  const blob = dataBlob(data); let n = 0;
  for (const f of j?.fields || []) {
    const field = fields.find((x) => x.getName() === f?.name); const val = String(f?.value ?? '').trim();
    if (!field || !val || !blob.includes(flat(val))) continue;
    try { field.setText(val); n++; } catch { /* campo con formato especial */ }
  }
  if (!n) return null;
  const outDoc = await PDFDocument.create();
  const src = await PDFDocument.load(await pdf.save());
  (await outDoc.copyPages(src, (pages.length ? pages : src.getPageIndices().map((i) => i + 1)).map((x) => x - 1))).forEach((pg) => outDoc.addPage(pg));
  return { bytes: await outDoc.save(), filled: n, total: fields.length, pending: fields.length > n ? [`${fields.length - n} campos sin dato en tu perfil de empresa`] : [] };
}

/** Rellena un anexo y guarda el archivo. */
export async function fillAnnex(p: Project, s: AppState, a: AnnexItem): Promise<AnnexItem> {
  const d = p.docs.find((x) => x.id === a.docId);
  const buf = d?.textKey ? await getFile(d.textKey) : null;
  if (!buf) return { ...a, error: 'No se encuentra el archivo original' };
  const data = annexData(p, s);
  let r: { bytes: Uint8Array; filled: number; total: number; pending: string[] } | null = null;
  try {
    if (a.ext === 'docx') {
      // Si el original es .doc, .rtf u .odt, se rellena un Word moderno con el mismo texto (el formato puede cambiar).
      const legacy = WORDISH.includes(extOf(d!.name)) ? textToDocx(((await getPages(d!.textKey!)) ?? []).join('\n')) : null;
      const src = legacy ? legacy.buffer.slice(legacy.byteOffset, legacy.byteOffset + legacy.byteLength) as ArrayBuffer : buf;
      const x = await fillDocxWith(p, data, src, 'Este documento contiene anexos administrativos de una licitación española (declaraciones responsables, compromisos, autorizaciones…)', numsOf(data), RULES);
      if (x) r = { bytes: x.bytes, filled: x.fields, total: a.total, pending: [] };
    } else {
      r = (await fillFormPdf(p, data, buf.slice(0), a.pages)) ?? (await fillFlatPdf(p, data, buf, a.pages));
    }
  } catch (e) { return { ...a, error: 'No se ha podido rellenar este anexo' }; }
  if (!r) return { ...a, error: 'No se han encontrado huecos que PROPO pueda rellenar con tus datos' };
  const key = `annex:${p.id}:${a.id}`;
  await putFile(key, r.bytes.buffer.slice(r.bytes.byteOffset, r.bytes.byteOffset + r.bytes.byteLength) as ArrayBuffer);
  const name = `${a.annex} - ${a.title}`.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90) + `.${a.ext}`;
  return { ...a, key, name, filled: r.filled, total: Math.max(r.total, r.filled), pending: r.pending, error: undefined, at: nowIso() };
}

/** Qué datos del perfil faltan para completar los anexos (se le pide al cliente en un solo sitio). */
export function missingAnnexData(s: AppState): string[] {
  const c = s.company; const out: string[] = [];
  if (!c.legalName) out.push('razón social');
  if (!c.taxId) out.push('NIF');
  if (!c.address) out.push('domicilio');
  if (!c.signer) out.push('nombre del representante legal');
  if (!c.signerId) out.push('DNI del representante');
  if (!c.signerRole) out.push('cargo del representante');
  if (!c.email) out.push('correo para notificaciones');
  return out;
}
