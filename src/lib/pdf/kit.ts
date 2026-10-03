// Motor de maquetación de los PDF de PROPO: portada con la marca del licitador, índice, cabecera y pie,
// títulos, texto con negritas, viñetas, cuadros y tablas con salto de página. Sobre pdf-lib, sin más dependencias.
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from 'pdf-lib';
import type { CompanyInfo } from '../types';

type Color = [number, number, number];
export interface Brand { name: string; color: Color; logo?: PDFImage; initials: string }
export interface W {
  doc: PDFDocument; font: PDFFont; bold: PDFFont; italic: PDFFont;
  page: PDFPage; y: number; title: string; brand: Brand;
  cover: boolean;                                  // la primera página es portada (sin cabecera ni pie)
  toc: { title: string; page: number; level: number }[]; tocPage?: PDFPage;
}

const PW = 595; const PH = 842; const ML = 56; const MR = 56; const CW = PW - ML - MR;
const TOP = 772; const BOTTOM = 66;
const INK: Color = [0.07, 0.09, 0.15]; const MUTED: Color = [0.42, 0.45, 0.5]; const LINE: Color = [0.86, 0.88, 0.91];
const col = (c: Color) => rgb(c[0], c[1], c[2]);
const tint = (c: Color, t: number): Color => [c[0] + (1 - c[0]) * t, c[1] + (1 - c[1]) * t, c[2] + (1 - c[2]) * t];

const WIN = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
/** Los tipos estándar de PDF solo cubren WinAnsi: se sustituye o se quita lo que no existe. */
export function clean(s: string) {
  return String(s ?? '').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/→/g, '->').replace(/[   ]/g, ' ').replace(/[‐‑]/g, '-')
    .split('').map((c) => (c === '\n' || (c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 256) || WIN.includes(c) ? c : '')).join('');
}

function hexColor(hex: string | undefined): Color {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return [0.043, 0.09, 0.188];   // azul marino de PROPO
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function initialsOf(name: string) {
  const w = name.replace(/\b(S\.?L\.?U?\.?|S\.?A\.?U?\.?|S\.?COOP\.?)$/i, '').trim().split(/\s+/).filter((x) => /^[\p{L}\d]/u.test(x));
  return ((w[0]?.[0] ?? 'E') + (w[1]?.[0] ?? '')).toUpperCase();
}
async function embedLogo(doc: PDFDocument, dataUrl?: string): Promise<PDFImage | undefined> {
  const m = /^data:image\/(png|jpe?g);base64,(.+)$/i.exec(dataUrl || '');
  if (!m) return undefined;
  try {
    const bin = atob(m[2]); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return m[1].toLowerCase() === 'png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
  } catch { return undefined; }
}

export async function newDoc(title: string, company: CompanyInfo, opts: { cover?: boolean } = {}): Promise<W> {
  const doc = await PDFDocument.create();
  const name = company.legalName || company.tradeName || 'Empresa';
  doc.setTitle(clean(title)); doc.setAuthor(clean(name)); doc.setProducer('PROPO'); doc.setCreator('PROPO');
  const w: W = {
    doc, font: await doc.embedFont(StandardFonts.Helvetica), bold: await doc.embedFont(StandardFonts.HelveticaBold), italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    page: null as any, y: 0, title, cover: !!opts.cover, toc: [],
    brand: { name, color: hexColor((company as any).brandColor), logo: await embedLogo(doc, (company as any).logo), initials: initialsOf(company.tradeName || name) },
  };
  if (!opts.cover) addPage(w);
  return w;
}

/** Logo del licitador a la altura `h`; si no ha subido ninguno, un monograma con sus iniciales y su color. Devuelve el ancho ocupado. */
function drawLogo(w: W, page: PDFPage, x: number, yBottom: number, h: number, withName = false): number {
  const b = w.brand;
  if (b.logo) {
    const s = Math.min(h / b.logo.height, (h * 4.5) / b.logo.width);
    page.drawImage(b.logo, { x, y: yBottom + (h - b.logo.height * s) / 2, width: b.logo.width * s, height: b.logo.height * s });
    return b.logo.width * s;
  }
  page.drawRectangle({ x, y: yBottom, width: h, height: h, color: col(b.color) });
  const fs = h * 0.44; const tw = w.bold.widthOfTextAtSize(b.initials, fs);
  page.drawText(b.initials, { x: x + (h - tw) / 2, y: yBottom + h / 2 - fs * 0.35, size: fs, font: w.bold, color: rgb(1, 1, 1) });
  if (!withName) return h;
  const ns = h * 0.36; const nm = clean(b.name);
  page.drawText(nm, { x: x + h + ns * 0.7, y: yBottom + h / 2 - ns * 0.35, size: ns, font: w.bold, color: col(INK) });
  return h + ns * 0.7 + w.bold.widthOfTextAtSize(nm, ns);
}

export function addPage(w: W) {
  w.page = w.doc.addPage([PW, PH]);
  w.y = TOP;
}
export function ensure(w: W, h: number) { if (w.y - h < BOTTOM) addPage(w); }
export function space(w: W, h: number) { w.y -= h; }

// --- texto --------------------------------------------------------------------------------------------------

interface Tok { t: string; f: PDFFont }
/** Parte el texto en palabras con su tipo (**negrita**) y lo ajusta al ancho. */
function layout(w: W, s: string, size: number, width: number, base: PDFFont): Tok[][] {
  const lines: Tok[][] = [];
  for (const para of clean(s).split('\n')) {
    let line: Tok[] = []; let lw = 0;
    const segs = para.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    for (const seg of segs) {
      const isB = seg.startsWith('**') && seg.endsWith('**') && seg.length > 4;
      const f = isB ? w.bold : base;
      for (const word of (isB ? seg.slice(2, -2) : seg).split(/\s+/).filter(Boolean)) {
        const ww = f.widthOfTextAtSize(word, size); const sp = line.length ? base.widthOfTextAtSize(' ', size) : 0;
        if (line.length && lw + sp + ww > width) { lines.push(line); line = []; lw = 0; }
        line.push({ t: word, f }); lw += (line.length > 1 ? sp : 0) + ww;
      }
    }
    lines.push(line);
  }
  return lines;
}
function drawLine(w: W, page: PDFPage, line: Tok[], x: number, y: number, size: number, color: Color, base: PDFFont) {
  let cx = x; const sp = base.widthOfTextAtSize(' ', size);
  for (const tok of line) { page.drawText(tok.t, { x: cx, y, size, font: tok.f, color: col(color) }); cx += tok.f.widthOfTextAtSize(tok.t, size) + sp; }
}

export interface TextOpts { size?: number; bold?: boolean; italic?: boolean; color?: Color; indent?: number; gap?: number; leading?: number; width?: number }
export function text(w: W, s: string, o: TextOpts = {}) {
  const size = o.size ?? 10.5; const base = o.bold ? w.bold : o.italic ? w.italic : w.font; const x = ML + (o.indent ?? 0);
  const lh = size * (o.leading ?? 1.5);
  for (const line of layout(w, s, size, (o.width ?? CW) - (o.indent ?? 0), base)) {
    ensure(w, lh);
    drawLine(w, w.page, line, x, w.y - size, size, o.color ?? INK, base);
    w.y -= lh;
  }
  w.y -= o.gap ?? 7;
}
export function bullet(w: W, s: string, o: TextOpts = {}) {
  const size = o.size ?? 10.5; const lh = size * 1.5; const ind = (o.indent ?? 0) + 16;
  const lines = layout(w, s, size, CW - ind, w.font);
  lines.forEach((line, i) => {
    ensure(w, lh);
    if (i === 0) w.page.drawCircle({ x: ML + ind - 9, y: w.y - size * 0.62, size: 1.7, color: col(w.brand.color) });
    drawLine(w, w.page, line, ML + ind, w.y - size, size, INK, w.font);
    w.y -= lh;
  });
  w.y -= o.gap ?? 3;
}

/** Título de primer nivel: número y texto en el color de la empresa, con filete. Entra en el índice. */
export function h1(w: W, title: string, o: { tag?: string; newPage?: boolean } = {}) {
  if (o.newPage) addPage(w); else { ensure(w, 90); if (w.y < TOP - 4) w.y -= 14; }
  w.toc.push({ title, page: w.doc.getPageCount(), level: 1 });
  const size = 17;
  for (const line of layout(w, title, size, CW, w.bold)) { drawLine(w, w.page, line.map((t) => ({ t: t.t, f: w.bold })), ML, w.y - size, size, w.brand.color, w.bold); w.y -= size * 1.3; }
  w.page.drawRectangle({ x: ML, y: w.y - 3, width: 44, height: 2.4, color: col(w.brand.color) });
  w.page.drawRectangle({ x: ML + 44, y: w.y - 2.2, width: CW - 44, height: 0.8, color: col(LINE) });
  w.y -= 16;
  if (o.tag) { text(w, o.tag, { size: 8.5, bold: true, color: [0.72, 0.4, 0.05], gap: 6 }); }
}
export function h2(w: W, title: string) {
  ensure(w, 50); w.y -= 6;
  text(w, title, { size: 12.5, bold: true, color: INK, gap: 5, leading: 1.3 });
}

/** Cuadro destacado con fondo suave del color de la empresa. */
export function note(w: W, s: string, o: { label?: string } = {}) {
  const size = 9.5; const pad = 10; const lh = size * 1.5;
  const lines = layout(w, s, size, CW - pad * 2 - 4, w.font);
  const h = lines.length * lh + pad * 2 + (o.label ? 13 : 0);
  ensure(w, h + 6);
  w.page.drawRectangle({ x: ML, y: w.y - h, width: CW, height: h, color: col(tint(w.brand.color, 0.93)) });
  w.page.drawRectangle({ x: ML, y: w.y - h, width: 3, height: h, color: col(w.brand.color) });
  let y = w.y - pad;
  if (o.label) { w.page.drawText(clean(o.label).toUpperCase(), { x: ML + pad + 4, y: y - 7.5, size: 7.5, font: w.bold, color: col(w.brand.color) }); y -= 13; }
  for (const line of lines) { drawLine(w, w.page, line, ML + pad + 4, y - size, size, INK, w.font); y -= lh; }
  w.y -= h + 12;
}

/** Texto generado (párrafos, «- » viñetas, «## » subtítulos, **negritas**). */
export function body(w: W, content: string) {
  for (const block of content.split(/\n{2,}/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    lines.forEach((l, i) => {
      const h = l.match(/^#{1,6}\s+(.*)$/);
      if (h) h2(w, h[1].replace(/\*\*/g, ''));
      else if (/^[-•*]\s+/.test(l)) bullet(w, l.replace(/^[-•*]\s+/, ''), { gap: i === lines.length - 1 ? 8 : 3 });
      else text(w, l, { gap: i === lines.length - 1 ? 9 : 4 });
    });
  }
}

// --- tablas -------------------------------------------------------------------------------------------------

export interface Col { title: string; w: number; align?: 'left' | 'right'; bold?: boolean }
/** Tabla con cabecera en el color de la empresa; las filas no se parten y la cabecera se repite al saltar de página. */
export function table(w: W, cols: Col[], rows: string[][], o: { size?: number } = {}) {
  const size = o.size ?? 9; const pad = 6; const lh = size * 1.4;
  const total = cols.reduce((a, c) => a + c.w, 0); const widths = cols.map((c) => (c.w / total) * CW);
  const head = () => {
    const hl = cols.map((c, i) => layout(w, c.title, 8, widths[i] - pad * 2, w.bold));
    const hh = Math.max(...hl.map((l) => l.length)) * 11 + 10;
    ensure(w, hh + 30);
    w.page.drawRectangle({ x: ML, y: w.y - hh, width: CW, height: hh, color: col(w.brand.color) });
    let x = ML;
    hl.forEach((ls, i) => { ls.forEach((line, j) => drawLine(w, w.page, line.map((t) => ({ t: t.t, f: w.bold })), x + pad, w.y - 6 - 8 - j * 11, 8, [1, 1, 1], w.bold)); x += widths[i]; });
    w.y -= hh;
  };
  head();
  rows.forEach((row, r) => {
    const cells = cols.map((c, i) => layout(w, row[i] ?? '', size, widths[i] - pad * 2, c.bold ? w.bold : w.font));
    const rh = Math.max(1, ...cells.map((l) => l.length)) * lh + pad * 2 - 2;
    if (w.y - rh < BOTTOM) { addPage(w); head(); }
    if (r % 2 === 1) w.page.drawRectangle({ x: ML, y: w.y - rh, width: CW, height: rh, color: col([0.972, 0.976, 0.984]) });
    let x = ML;
    cells.forEach((ls, i) => {
      const base = cols[i].bold ? w.bold : w.font;
      ls.forEach((line, j) => {
        const lw = line.reduce((a, t) => a + t.f.widthOfTextAtSize(t.t, size), 0) + Math.max(0, line.length - 1) * base.widthOfTextAtSize(' ', size);
        drawLine(w, w.page, line, cols[i].align === 'right' ? x + widths[i] - pad - lw : x + pad, w.y - pad - size + 1 - j * lh, size, INK, base);
      });
      x += widths[i];
    });
    w.page.drawRectangle({ x: ML, y: w.y - rh, width: CW, height: 0.6, color: col(LINE) });
    w.y -= rh;
  });
  w.y -= 14;
}

/** Ficha de datos en dos columnas (etiqueta · valor). */
export function facts(w: W, pairs: [string, string][]) {
  table(w, [{ title: 'Dato', w: 32, bold: true }, { title: 'Detalle', w: 68 }], pairs.filter(([, v]) => v && v.trim()));
}

// --- portada, índice y cierre -----------------------------------------------------------------------------------

export function cover(w: W, c: { kind: string; title: string; lines: [string, string][]; footnote?: string }) {
  const page = w.doc.addPage([PW, PH]); w.page = page;
  drawLogo(w, page, ML, PH - 56 - 46, 46, true);
  const top = PH - 190; const bandH = 250;
  page.drawRectangle({ x: 0, y: top - bandH, width: PW, height: bandH, color: col(w.brand.color) });
  page.drawRectangle({ x: 0, y: top - bandH - 6, width: PW, height: 6, color: col(tint(w.brand.color, 0.55)) });
  page.drawText(clean(c.kind).toUpperCase(), { x: ML, y: top - 46, size: 10, font: w.bold, color: col(tint(w.brand.color, 0.7)) });
  let y = top - 66; const ts = c.title.length > 110 ? 17 : c.title.length > 60 ? 21 : 26;
  for (const line of layout(w, c.title, ts, CW, w.bold).slice(0, 7)) { drawLine(w, page, line.map((t) => ({ t: t.t, f: w.bold })), ML, y - ts, ts, [1, 1, 1], w.bold); y -= ts * 1.25; }
  y = top - bandH - 46;
  for (const [k, v] of c.lines.filter(([, x]) => x && x.trim())) {
    page.drawText(clean(k).toUpperCase(), { x: ML, y, size: 7.5, font: w.bold, color: col(MUTED) });
    y -= 14;
    for (const line of layout(w, v, 11.5, CW, w.font).slice(0, 3)) { drawLine(w, page, line, ML, y, 11.5, INK, w.font); y -= 15; }
    y -= 9;
  }
  if (c.footnote) page.drawText(clean(c.footnote), { x: ML, y: 48, size: 8, font: w.font, color: col(MUTED) });
  addPage(w);
}

/** Reserva la página del índice; se rellena al cerrar, cuando ya se conocen los números de página. */
export function tocPlaceholder(w: W) { w.tocPage = w.page; addPage(w); }

export async function finish(w: W): Promise<Uint8Array> {
  const pages = w.doc.getPages();
  if (w.tocPage) {
    const pg = w.tocPage; let y = TOP;
    pg.drawText('Índice', { x: ML, y: y - 17, size: 17, font: w.bold, color: col(w.brand.color) }); y -= 26;
    pg.drawRectangle({ x: ML, y, width: 44, height: 2.4, color: col(w.brand.color) }); y -= 26;
    const first = w.cover ? 1 : 0;
    for (const e of w.toc) {
      if (y < BOTTOM + 10) break;
      const size = 10.5; const label = clean(e.title); const num = String(e.page - first);
      const maxW = CW - 40; let t = label; while (w.font.widthOfTextAtSize(t, size) > maxW && t.length > 8) t = t.slice(0, -2);
      if (t !== label) t = t.trimEnd() + '…';
      pg.drawText(t, { x: ML, y, size, font: w.font, color: col(INK) });
      const tw = w.font.widthOfTextAtSize(t, size); const nw = w.bold.widthOfTextAtSize(num, size);
      for (let x = ML + tw + 6; x < PW - MR - nw - 6; x += 4) pg.drawCircle({ x, y: y + 1.5, size: 0.45, color: col(MUTED) });
      pg.drawText(num, { x: PW - MR - nw, y, size, font: w.bold, color: col(INK) });
      y -= 20;
    }
  }
  const first = w.cover ? 1 : 0; const n = pages.length - first;
  pages.forEach((pg, i) => {
    if (i < first) return;
    // cabecera: marca del licitador y título del documento
    drawLogo(w, pg, ML, PH - 50, 18, !w.brand.logo);
    const ht = clean(w.title); let t = ht; while (w.font.widthOfTextAtSize(t, 8) > 250 && t.length > 8) t = t.slice(0, -2);
    if (t !== ht) t = t.trimEnd() + '…';
    pg.drawText(t, { x: PW - MR - w.font.widthOfTextAtSize(t, 8), y: PH - 44, size: 8, font: w.font, color: col(MUTED) });
    pg.drawRectangle({ x: ML, y: PH - 58, width: CW, height: 0.8, color: col(LINE) });
    // pie
    pg.drawRectangle({ x: ML, y: 46, width: CW, height: 0.8, color: col(LINE) });
    pg.drawText(clean(w.brand.name), { x: ML, y: 32, size: 8, font: w.font, color: col(MUTED) });
    const pn = `Página ${i - first + 1} de ${n}`;
    pg.drawText(pn, { x: PW - MR - w.font.widthOfTextAtSize(pn, 8), y: 32, size: 8, font: w.font, color: col(MUTED) });
  });
  return w.doc.save();
}
