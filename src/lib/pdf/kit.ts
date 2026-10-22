// Motor de maquetación de los PDF de PROPO, sobre pdf-lib y sin más dependencias. Aplica el sistema de diseño
// (design/theme): seis portadas, aperturas de capítulo, cabecera con la sección en curso, tablas, cuadros,
// listas de compromisos, procesos numerados, gráficos con datos reales y modo anónimo cuando el pliego lo exige.
import { PDFDocument, StandardFonts, rgb, degrees, type PDFFont, type PDFImage, type PDFPage } from 'pdf-lib';
import type { CompanyInfo, Project, TeamMember } from '../types';
import { richBlocks } from '../richBlocks';
import { themeFor, tint, shade, mix, TYPE, PAGE, type DocTheme, type RGB, type CoverStyle } from '../design/theme';
import { drawMotif } from '../design/motifs';

type Color = RGB;
export interface Brand { name: string; color: Color; logo?: PDFImage; initials: string }
export interface W {
  doc: PDFDocument; font: PDFFont; bold: PDFFont; italic: PDFFont; serif: PDFFont;
  page: PDFPage; y: number; title: string; brand: Brand; theme: DocTheme;
  cover: boolean;                                  // la primera página es portada (sin cabecera ni pie)
  toc: { title: string; page: number; level: number }[]; tocPage?: PDFPage;
  running: Map<number, string>;                    // página → apartado en curso, para la cabecera
  current: string;
}

const PW = PAGE.w; const PH = PAGE.h; const ML = PAGE.ml; const MR = PAGE.mr; const CW = PW - ML - MR;
const TOP = PAGE.top; const BOTTOM = PAGE.bottom;
const col = (c: Color) => rgb(c[0], c[1], c[2]);
const P = (w: W) => w.theme.palette;

const WIN = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
/** Los tipos estándar de PDF solo cubren WinAnsi: se sustituye o se quita lo que no existe. */
export function clean(s: string) {
  return String(s ?? '').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/→/g, '->').replace(/[✓✔]/g, '').replace(/[   ]/g, ' ').replace(/[‐‑]/g, '-')
    .split('').map((c) => (c === '\n' || (c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 256) || WIN.includes(c) ? c : '')).join('');
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

/** Nuevo documento. Con `project`, el tema tiene en cuenta el sector del contrato y si el pliego exige anonimato. */
export async function newDoc(title: string, company: CompanyInfo, opts: { cover?: boolean; project?: Project | null; technical?: boolean } = {}): Promise<W> {
  const doc = await PDFDocument.create();
  const theme = themeFor(company, opts.project ?? null, { technical: opts.technical });
  const name = theme.anonymous ? '' : company.legalName || company.tradeName || 'Empresa';
  doc.setTitle(clean(title)); doc.setAuthor(clean(name || 'Licitador')); doc.setProducer('PROPO'); doc.setCreator('PROPO');
  const w: W = {
    doc, font: await doc.embedFont(StandardFonts.Helvetica), bold: await doc.embedFont(StandardFonts.HelveticaBold), italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    serif: await doc.embedFont(StandardFonts.TimesRomanBold),
    page: null as any, y: 0, title, cover: !!opts.cover, toc: [], theme, running: new Map(), current: '',
    brand: { name, color: theme.palette.deep, logo: theme.anonymous ? undefined : await embedLogo(doc, company.logo), initials: initialsOf(company.tradeName || name || 'E') },
  };
  if (!opts.cover) addPage(w);
  return w;
}

/** Logo del licitador dentro de una caja de alto `h` (sin deformarlo); sin logo, monograma con sus iniciales. Devuelve el ancho. */
function drawLogo(w: W, page: PDFPage, x: number, yBottom: number, h: number, o: { withName?: boolean; onDark?: boolean; maxW?: number } = {}): number {
  const b = w.brand; const pal = P(w);
  if (w.theme.anonymous) return 0;
  if (b.logo) {
    const s = Math.min(h / b.logo.height, (o.maxW ?? h * 4.5) / b.logo.width);
    page.drawImage(b.logo, { x, y: yBottom + (h - b.logo.height * s) / 2, width: b.logo.width * s, height: b.logo.height * s });
    return b.logo.width * s;
  }
  page.drawRectangle({ x, y: yBottom, width: h, height: h, color: col(o.onDark ? [1, 1, 1] : pal.primary) });
  const fs = h * 0.42; const tw = w.bold.widthOfTextAtSize(b.initials, fs);
  page.drawText(b.initials, { x: x + (h - tw) / 2, y: yBottom + h / 2 - fs * 0.35, size: fs, font: w.bold, color: col(o.onDark ? pal.primary : pal.onPrimary) });
  if (!o.withName) return h;
  const ns = h * 0.36; const nm = clean(b.name);
  page.drawText(nm, { x: x + h + ns * 0.7, y: yBottom + h / 2 - ns * 0.35, size: ns, font: w.bold, color: col(o.onDark ? [1, 1, 1] : pal.ink) });
  return h + ns * 0.7 + w.bold.widthOfTextAtSize(nm, ns);
}

export function addPage(w: W) {
  w.page = w.doc.addPage([PW, PH]);
  w.y = TOP;
  if (w.current) w.running.set(w.doc.getPageCount() - 1, w.current);
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
      for (let word of (isB ? seg.slice(2, -2) : seg).split(/\s+/).filter(Boolean)) {
        // Palabras más largas que la columna (URL, códigos): se parten para no salirse.
        while (f.widthOfTextAtSize(word, size) > width && word.length > 4) {
          let k = word.length - 1; while (k > 1 && f.widthOfTextAtSize(word.slice(0, k), size) > width) k--;
          if (line.length) { lines.push(line); line = []; lw = 0; }
          lines.push([{ t: word.slice(0, k), f }]); word = word.slice(k);
        }
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
const lineWidth = (line: Tok[], size: number, base: PDFFont) => line.reduce((a, t) => a + t.f.widthOfTextAtSize(t.t, size), 0) + Math.max(0, line.length - 1) * base.widthOfTextAtSize(' ', size);

export interface TextOpts { size?: number; bold?: boolean; italic?: boolean; color?: Color; indent?: number; gap?: number; leading?: number; width?: number }
export function text(w: W, s: string, o: TextOpts = {}) {
  const size = o.size ?? TYPE.body; const base = o.bold ? w.bold : o.italic ? w.italic : w.font; const x = ML + (o.indent ?? 0);
  const lh = size * (o.leading ?? TYPE.leading);
  const lines = layout(w, s, size, (o.width ?? CW) - (o.indent ?? 0), base);
  lines.forEach((line, i) => {
    // Sin viudas ni huérfanas: un párrafo no deja una sola línea al pie ni la arrastra sola a la página siguiente.
    if (lines.length >= 3 && (i === 0 || i === lines.length - 2) && w.y - lh * 2 < BOTTOM) addPage(w);
    ensure(w, lh);
    drawLine(w, w.page, line, x, w.y - size, size, o.color ?? P(w).ink, base);
    w.y -= lh;
  });
  w.y -= o.gap ?? 7;
}
export function bullet(w: W, s: string, o: TextOpts = {}) {
  const size = o.size ?? TYPE.body; const lh = size * TYPE.leading; const ind = (o.indent ?? 0) + 15;
  const lines = layout(w, s, size, CW - ind, w.font);
  lines.forEach((line, i) => {
    ensure(w, lh);
    if (i === 0) w.page.drawRectangle({ x: ML + ind - 10, y: w.y - size * 0.68, width: 3.6, height: 3.6, color: col(P(w).accent) });
    drawLine(w, w.page, line, ML + ind, w.y - size, size, P(w).ink, w.font);
    w.y -= lh;
  });
  w.y -= o.gap ?? 3;
}

/** Apertura de apartado: número grande en tono suave, antetítulo y título en el color de la marca. Entra en el índice. */
export function h1(w: W, title: string, o: { tag?: string; newPage?: boolean } = {}) {
  const pal = P(w);
  const m = /^(\d+)\.\s+(.*)$/.exec(title); const num = m?.[1]; const label = m ? m[2] : title;
  const annex = /^Anexo\s+([A-Z0-9]+)\.\s*(.*)$/i.exec(title);
  // Un título nunca queda solo al pie. Los apartados numerados y los anexos abren página si queda menos de la mitad.
  if (w.y < TOP - 4 && (w.y - BOTTOM < ((num || annex || o.newPage) ? 380 : 170))) addPage(w);
  if (w.y < TOP - 4) w.y -= 22;
  w.current = clean(label); w.running.set(w.doc.getPageCount() - 1, w.current);
  w.toc.push({ title, page: w.doc.getPageCount(), level: 1 });
  const size = TYPE.h1; const titleFont = w.theme.serifTitles ? w.serif : w.bold;
  const big = num ?? annex?.[1];
  let x = ML;
  if (big) {
    const bs = 46; const bw = w.bold.widthOfTextAtSize(big.padStart(num ? 2 : 1, '0'), bs);
    w.page.drawText(big.padStart(num ? 2 : 1, '0'), { x: ML - 2, y: w.y - bs * 0.78, size: bs, font: w.bold, color: col(pal.numeral) });
    x = ML + Math.max(bw + 14, 62);
  }
  const kicker = annex ? 'ANEXO' : num ? `APARTADO ${num}` : '';
  let y = w.y;
  if (kicker) { w.page.drawText(kicker, { x, y: y - TYPE.kicker, size: TYPE.kicker, font: w.bold, color: col(pal.accentInk) }); y -= TYPE.kicker + 7; }
  const t = annex ? annex[2] || title : label;
  for (const line of layout(w, t, size, PW - MR - x, titleFont)) { drawLine(w, w.page, line.map((k) => ({ t: k.t, f: titleFont })), x, y - size, size, pal.heading, titleFont); y -= size * 1.22; }
  w.y = Math.min(y, w.y - (big ? 52 : 0)) - 8;
  w.page.drawRectangle({ x: ML, y: w.y, width: 36, height: 2.6, color: col(pal.accent) });
  w.page.drawRectangle({ x: ML + 40, y: w.y + 0.9, width: CW - 40, height: 0.6, color: col(pal.line) });
  w.y -= 18;
  if (o.tag) { text(w, o.tag, { size: TYPE.caption, bold: true, color: [0.72, 0.4, 0.05], gap: 6 }); }
}
export function h2(w: W, title: string) {
  ensure(w, 70); w.y -= 8;
  const pal = P(w); const size = TYPE.h2;
  const lines = layout(w, title, size, CW - 12, w.bold);
  w.page.drawRectangle({ x: ML, y: w.y - size - 1, width: 3, height: size + 1, color: col(pal.primary) });
  for (const line of lines) { drawLine(w, w.page, line.map((t) => ({ t: t.t, f: w.bold })), ML + 11, w.y - size, size, pal.heading, w.bold); w.y -= size * 1.32; }
  w.y -= 5;
}
function h3(w: W, title: string) { ensure(w, 50); w.y -= 3; text(w, title, { bold: true, size: TYPE.h3, gap: 3, leading: 1.3 }); }

/** Cuadro destacado: fondo suave del color de la marca y filete del color de acento. */
export function note(w: W, s: string, o: { label?: string; tone?: 'brand' | 'accent' | 'warn' } = {}) {
  const pal = P(w); const size = 9.3; const pad = 11; const lh = size * 1.5;
  const bar = o.tone === 'warn' ? [0.85, 0.5, 0.05] as Color : o.tone === 'accent' ? pal.accent : pal.primary;
  const bg = o.tone === 'warn' ? [1, 0.97, 0.9] as Color : o.tone === 'accent' ? tint(pal.accent, 0.9) : pal.softer;
  const lines = layout(w, s, size, CW - pad * 2 - 4, w.font);
  const h = lines.length * lh + pad * 2 + (o.label ? 14 : 0);
  ensure(w, Math.min(h, 200) + 6);
  w.page.drawRectangle({ x: ML, y: w.y - h, width: CW, height: h, color: col(bg) });
  w.page.drawRectangle({ x: ML, y: w.y - h, width: 2.6, height: h, color: col(bar) });
  let y = w.y - pad;
  if (o.label) { w.page.drawText(clean(o.label).toUpperCase(), { x: ML + pad + 4, y: y - 7.5, size: 7.2, font: w.bold, color: col(o.tone === 'warn' ? [0.6, 0.33, 0.02] : pal.deep) }); y -= 14; }
  for (const line of lines) { drawLine(w, w.page, line, ML + pad + 4, y - size, size, pal.ink, w.font); y -= lh; }
  w.y -= h + 14;
}

/** Lista de compromisos verificables: panel con casillas, para que el evaluador los localice de un vistazo. */
function checklist(w: W, title: string, items: string[]) {
  const pal = P(w); const size = 9.6; const lh = size * 1.48; const pad = 14; const ind = 22;
  const laid = items.map((s) => layout(w, s, size, CW - pad * 2 - ind, w.font));
  const h = laid.reduce((a, l) => a + l.length * lh + 5, 0) + pad * 2 + 18;
  if (h < PH * 0.6) ensure(w, h + 8);
  const startPage = w.page; const top = w.y;
  if (w.page === startPage && h < w.y - BOTTOM) {
    w.page.drawRectangle({ x: ML, y: top - h, width: CW, height: h, borderColor: col(tint(pal.primary, 0.6)), borderWidth: 0.8, color: col([1, 1, 1]) });
    w.page.drawRectangle({ x: ML, y: top - 3, width: CW, height: 3, color: col(pal.primary) });
  }
  w.y -= pad + 2;
  w.page.drawText(clean(title).toUpperCase(), { x: ML + pad, y: w.y - 8, size: 7.6, font: w.bold, color: col(pal.deep) });
  w.y -= 20;
  laid.forEach((lines) => {
    ensure(w, lh + 4);
    const by = w.y - size - 1;
    w.page.drawRectangle({ x: ML + pad, y: by - 1, width: 10, height: 10, borderColor: col(pal.primary), borderWidth: 1, color: col(pal.softer) });
    w.page.drawLine({ start: { x: ML + pad + 2.2, y: by + 4 }, end: { x: ML + pad + 4.4, y: by + 1.6 }, thickness: 1.3, color: col(pal.deep) });
    w.page.drawLine({ start: { x: ML + pad + 4.4, y: by + 1.6 }, end: { x: ML + pad + 8.2, y: by + 7.6 }, thickness: 1.3, color: col(pal.deep) });
    lines.forEach((line) => { ensure(w, lh); drawLine(w, w.page, line, ML + pad + ind, w.y - size, size, pal.ink, w.font); w.y -= lh; });
    w.y -= 5;
  });
  w.y -= pad + 6;
}

/** Pasos numerados como proceso: círculos con el número unidos por una línea, texto a la derecha. */
function steps(w: W, items: string[]) {
  const pal = P(w); const size = TYPE.body; const lh = size * TYPE.leading; const ind = 30;
  items.forEach((s, i) => {
    const lines = layout(w, s, size, CW - ind, w.font);
    ensure(w, Math.min(lines.length, 3) * lh + 6);
    const cy = w.y - 8;
    if (i < items.length - 1) w.page.drawRectangle({ x: ML + 9.4, y: w.y - lines.length * lh - 10, width: 1.2, height: lines.length * lh + 2, color: col(tint(pal.primary, 0.65)) });
    w.page.drawCircle({ x: ML + 10, y: cy, size: 9, color: col(pal.primary) });
    const n = String(i + 1); const nw = w.bold.widthOfTextAtSize(n, 8.5);
    w.page.drawText(n, { x: ML + 10 - nw / 2, y: cy - 3, size: 8.5, font: w.bold, color: col(pal.onPrimary) });
    lines.forEach((line) => { ensure(w, lh); drawLine(w, w.page, line, ML + ind, w.y - size, size, pal.ink, w.font); w.y -= lh; });
    w.y -= 7;
  });
  w.y -= 4;
}

/** Texto generado: párrafos, subtítulos, viñetas, procesos, tablas y **negritas** (ver lib/richBlocks). */
export function body(w: W, content: string) {
  const blocks = richBlocks(content);
  let mode: 'normal' | 'commit' | 'plus' = 'normal'; let heading = '';
  blocks.forEach((b) => {
    if (b.type === 'h') {
      mode = /compromisos verificables/i.test(b.text) ? 'commit' : /mejoras? sobre lo exigido|mejoras ofertadas/i.test(b.text) ? 'plus' : 'normal';
      heading = b.text;
      if (mode === 'commit') return;                        // el panel lleva su propio título
      if (b.level === 2) h2(w, b.text); else h3(w, b.text);
      return;
    }
    if (b.type === 'ul') {
      if (mode === 'commit') { checklist(w, heading, b.items); return; }
      if (mode === 'plus') { note(w, b.items.map((x) => `- ${x}`).join('\n'), { label: 'Valor añadido de la oferta', tone: 'accent' }); return; }
      b.items.forEach((l, i) => bullet(w, l, { gap: i === b.items.length - 1 ? 9 : 3 }));
      return;
    }
    if (b.type === 'ol') { if (mode === 'commit') checklist(w, heading, b.items); else steps(w, b.items); return; }
    if (b.type === 'table') {
      const len = b.head.map((h, i) => Math.max(h.length, ...b.rows.map((r) => Math.min(60, (r[i] ?? '').length))));
      const total = len.reduce((a, n) => a + n, 0) || 1;
      table(w, b.head.map((h, i) => ({ title: h.replace(/\*\*/g, ''), w: Math.max(11, (len[i] / total) * 100), bold: i === 0 })), b.rows.map((r) => r.map((c) => c.replace(/\*\*/g, ''))));
      return;
    }
    if (mode === 'plus') { note(w, b.text, { label: 'Valor añadido de la oferta', tone: 'accent' }); return; }
    text(w, b.text, { gap: 9 });
  });
}

// --- tablas -------------------------------------------------------------------------------------------------

export interface Col { title: string; w: number; align?: 'left' | 'right'; bold?: boolean }
const NUMERIC = /^[\s\-+]?(\d[\d.\s]*([,.]\d+)?|\d+([,.]\d+)?)\s*(€|%|h|d[ií]as?|meses|años|m²|m2|m³|m3|km|uds?\.?)?$/i;
/** Tabla: cabecera en tono suave con filete de marca, cebrado sutil, números alineados a la derecha; las filas no se
 *  parten y la cabecera se repite al saltar de página. Una celda muy larga se trocea en varias filas antes que salirse. */
export function table(w: W, cols: Col[], rows: string[][], o: { size?: number } = {}) {
  const pal = P(w); const size = o.size ?? 8.8; const pad = 6.5; const lh = size * 1.42;
  const total = cols.reduce((a, c) => a + c.w, 0); const widths = cols.map((c) => (c.w / total) * CW);
  const align = cols.map((c, i) => c.align ?? (rows.length && rows.filter((r) => (r[i] ?? '').trim()).every((r) => NUMERIC.test(r[i].trim())) ? 'right' : 'left'));
  const head = () => {
    const hl = cols.map((c, i) => layout(w, c.title.toUpperCase(), 7.4, widths[i] - pad * 2, w.bold));
    const hh = Math.max(...hl.map((l) => l.length)) * 10 + 12;
    ensure(w, hh + 36);
    w.page.drawRectangle({ x: ML, y: w.y - hh, width: CW, height: hh, color: col(pal.soft) });
    w.page.drawRectangle({ x: ML, y: w.y - 1.6, width: CW, height: 1.6, color: col(pal.primary) });
    let x = ML;
    hl.forEach((ls, i) => {
      ls.forEach((line, j) => {
        const lw = lineWidth(line, 7.4, w.bold);
        drawLine(w, w.page, line, align[i] === 'right' ? x + widths[i] - pad - lw : x + pad, w.y - 7 - 7.4 - j * 10, 7.4, pal.heading, w.bold);
      });
      x += widths[i];
    });
    w.y -= hh;
  };
  head();
  const maxRow = (TOP - BOTTOM) * 0.85;
  rows.forEach((row, r) => {
    let cells = cols.map((c, i) => layout(w, row[i] ?? '', size, widths[i] - pad * 2, c.bold ? w.bold : w.font));
    // Fila más alta que una página: se reparte en trozos que caben.
    while (cells.length) {
      const fit = Math.max(1, Math.floor((maxRow - pad * 2) / lh));
      const part = cells.map((l) => l.slice(0, fit)); cells = cells.some((l) => l.length > fit) ? cells.map((l) => l.slice(fit)) : [];
      const rh = Math.max(1, ...part.map((l) => l.length)) * lh + pad * 2 - 2;
      if (w.y - rh < BOTTOM) { addPage(w); head(); }
      if (r % 2 === 1) w.page.drawRectangle({ x: ML, y: w.y - rh, width: CW, height: rh, color: col(tint(pal.primary, 0.975)) });
      let x = ML;
      part.forEach((ls, i) => {
        const base = cols[i].bold ? w.bold : w.font;
        ls.forEach((line, j) => {
          const lw = lineWidth(line, size, base);
          drawLine(w, w.page, line, align[i] === 'right' ? x + widths[i] - pad - lw : x + pad, w.y - pad - size + 1 - j * lh, size, cols[i].bold ? pal.ink : [0.18, 0.2, 0.26], base);
        });
        x += widths[i];
      });
      w.page.drawRectangle({ x: ML, y: w.y - rh, width: CW, height: 0.5, color: col(pal.line) });
      w.y -= rh;
    }
  });
  w.page.drawRectangle({ x: ML, y: w.y, width: CW, height: 0.9, color: col(tint(pal.primary, 0.5)) });
  w.y -= 16;
}

/** Ficha de datos: etiqueta en versalitas y valor, con filetes finos (sin cabecera de tabla). */
export function facts(w: W, pairs: [string, string][]) {
  const pal = P(w); const kw = CW * 0.3; const size = TYPE.body; const lh = size * 1.42;
  for (const [k, v] of pairs.filter(([, x]) => x && x.trim())) {
    const lines = layout(w, v, size, CW - kw - 8, w.font); const rh = Math.max(lines.length * lh, 14) + 12;
    ensure(w, rh);
    w.page.drawText(clean(k).toUpperCase(), { x: ML, y: w.y - 6 - 7.2, size: 7.2, font: w.bold, color: col(pal.muted) });
    lines.forEach((line, j) => drawLine(w, w.page, line, ML + kw, w.y - 6 - size + 1 - j * lh, size, pal.ink, w.font));
    w.y -= rh;
    w.page.drawRectangle({ x: ML, y: w.y, width: CW, height: 0.5, color: col(pal.line) });
  }
  w.y -= 14;
}

// --- gráficos con datos reales ----------------------------------------------------------------------------------

/** Barras horizontales (p. ej. puntos de cada criterio del pliego). Solo cifras que existen: nada estimado. */
export function bars(w: W, items: { label: string; value: number; note?: string }[], o: { unit?: string; caption?: string } = {}) {
  const pal = P(w); const list = items.filter((i) => i.value > 0); if (!list.length) return;
  const max = Math.max(...list.map((i) => i.value)); const lw = CW * 0.42; const bw = CW - lw - 52; const rh = 19;
  ensure(w, Math.min(list.length, 6) * rh + 30);
  list.forEach((it, k) => {
    ensure(w, rh);
    let lbl = clean(it.label); while (w.font.widthOfTextAtSize(lbl, 8.6) > lw - 8 && lbl.length > 6) lbl = lbl.slice(0, -2);
    if (lbl !== clean(it.label)) lbl = lbl.trimEnd() + '…';
    w.page.drawText(lbl, { x: ML, y: w.y - 12, size: 8.6, font: w.font, color: col(pal.ink) });
    w.page.drawRectangle({ x: ML + lw, y: w.y - 14, width: bw, height: 9, color: col(pal.softer) });
    w.page.drawRectangle({ x: ML + lw, y: w.y - 14, width: Math.max(2, (it.value / max) * bw), height: 9, color: col(k === 0 ? pal.primary : mix(pal.primary, [1, 1, 1], 0.25)) });
    const v = `${String(Math.round(it.value * 100) / 100).replace('.', ',')}${o.unit ? ` ${o.unit}` : ''}`;
    w.page.drawText(v, { x: ML + lw + bw + 8, y: w.y - 12.5, size: 8.6, font: w.bold, color: col(pal.deep) });
    w.y -= rh;
  });
  if (o.caption) { w.y -= 4; text(w, o.caption, { size: TYPE.caption, color: pal.muted, gap: 4 }); }
  w.y -= 10;
}

/** Organigrama del equipo adscrito, con los datos de Empresa → Equipo (nombre, función, experiencia). */
export function orgChart(w: W, team: TeamMember[], head = 'Dirección del contrato') {
  const pal = P(w); if (!team.length) return;
  const list = team.slice(0, 8); const boxH = 44; const gap = 10;
  const per = Math.min(4, Math.max(1, list.length - 1)); const bw = (CW - gap * (per - 1)) / per;
  const rowsN = Math.ceil((list.length - 1) / per);
  ensure(w, boxH * (1 + rowsN) + 40 * rowsN + 30);
  const box = (x: number, y: number, wd: number, m: TeamMember, lead: boolean) => {
    w.page.drawRectangle({ x, y: y - boxH, width: wd, height: boxH, color: col(lead ? pal.primary : pal.softer), borderColor: col(lead ? pal.primary : tint(pal.primary, 0.6)), borderWidth: 0.8 });
    const fc: Color = lead ? pal.onPrimary : pal.ink;
    let nm = clean(m.name); while (w.bold.widthOfTextAtSize(nm, 8.6) > wd - 14 && nm.length > 6) nm = nm.slice(0, -2);
    let rl = clean(m.role || ''); while (w.font.widthOfTextAtSize(rl, 7.6) > wd - 14 && rl.length > 6) rl = rl.slice(0, -2);
    w.page.drawText(nm, { x: x + 7, y: y - 15, size: 8.6, font: w.bold, color: col(fc) });
    w.page.drawText(rl, { x: x + 7, y: y - 27, size: 7.6, font: w.font, color: col(fc) });
    if (m.years) w.page.drawText(`${m.years} años de experiencia`, { x: x + 7, y: y - 38, size: 6.8, font: w.font, color: col(lead ? tint(pal.onPrimary, 0.2) : pal.muted) });
  };
  text(w, head.toUpperCase(), { size: TYPE.kicker, bold: true, color: pal.accentInk, gap: 6 });
  const leadW = Math.min(CW, bw * 1.4); const lx = ML + (CW - leadW) / 2; const top = w.y;
  box(lx, top, leadW, list[0], true);
  let y = top - boxH - 34;
  const rest = list.slice(1);
  if (rest.length) w.page.drawRectangle({ x: ML + CW / 2 - 0.5, y: top - boxH - 17, width: 1, height: 17, color: col(tint(pal.primary, 0.45)) });
  for (let r = 0; r < rowsN; r++) {
    const row = rest.slice(r * per, r * per + per); const rowW = row.length * bw + (row.length - 1) * gap; const x0 = ML + (CW - rowW) / 2;
    if (r === 0 && row.length > 1) w.page.drawRectangle({ x: x0 + bw / 2, y: y + 17, width: rowW - bw, height: 1, color: col(tint(pal.primary, 0.45)) });
    row.forEach((m, i) => { const x = x0 + i * (bw + gap); if (r === 0) w.page.drawRectangle({ x: x + bw / 2 - 0.5, y, width: 1, height: 17, color: col(tint(pal.primary, 0.45)) }); box(x, y, bw, m, false); });
    y -= boxH + 16;
  }
  w.y = y - 6;
}

// --- portada ------------------------------------------------------------------------------------------------------

export interface CoverData { kind: string; title: string; lines: [string, string][]; footnote?: string }

function titleBlock(w: W, page: PDFPage, s: string, x: number, yTop: number, width: number, maxSize: number, color: Color, font: PDFFont, maxLines = 6) {
  let size = maxSize; let lines = layout(w, s, size, width, font);
  while ((lines.length > maxLines || s.length > 140 && size > 18) && size > 15) { size -= 1.5; lines = layout(w, s, size, width, font); }
  let y = yTop;
  for (const line of lines.slice(0, maxLines + 2)) { drawLine(w, page, line.map((t) => ({ t: t.t, f: font })), x, y - size, size, color, font); y -= size * 1.18; }
  return y;
}
function metaList(w: W, page: PDFPage, lines: [string, string][], x: number, yTop: number, width: number, c: { label: Color; value: Color }, cols = 1) {
  const items = lines.filter(([, v]) => v && v.trim()); const cw = (width - (cols - 1) * 18) / cols;
  let y = yTop; let maxY = yTop;
  items.forEach(([k, v], i) => {
    const cx = x + (i % cols) * (cw + 18);
    if (i % cols === 0 && i) y = maxY;
    let yy = y;
    page.drawText(clean(k).toUpperCase(), { x: cx, y: yy - 7, size: 6.8, font: w.bold, color: col(c.label) }); yy -= 18;
    for (const line of layout(w, v, 10, cw, w.font).slice(0, 3)) { drawLine(w, page, line, cx, yy, 10, c.value, w.font); yy -= 13; }
    maxY = Math.min(maxY, yy - 10);
  });
  return maxY;
}
/** Franja de logo sobre fondo blanco para portadas oscuras (el logo del cliente nunca se recolorea). */
function logoTab(w: W, page: PDFPage, x: number, y: number, h: number) {
  if (w.theme.anonymous) return;
  const lw = w.brand.logo ? Math.min((h - 16) * (w.brand.logo.width / w.brand.logo.height), 190) : h - 16;
  page.drawRectangle({ x, y, width: lw + 26, height: h, color: col([1, 1, 1]) });
  drawLogo(w, page, x + 13, y + 8, h - 16, { maxW: 190 });
}
function gradientV(page: PDFPage, x: number, y: number, wd: number, h: number, c: Color, from: number, to: number, steps = 28) {
  // de `from` (abajo) a `to` (arriba)
  for (let i = 0; i < steps; i++) page.drawRectangle({ x, y: y + (h * i) / steps, width: wd, height: h / steps + 0.5, color: col(c), opacity: to + ((from - to) * (steps - 1 - i)) / (steps - 1) });
}

export function cover(w: W, c: CoverData, style?: CoverStyle) {
  const page = w.doc.addPage([PW, PH]); w.page = page;
  const pal = P(w); const st = style ?? w.theme.cover; const motif = w.theme.motif; const seed = c.title;
  const kind = clean(c.kind).toUpperCase(); const white: Color = [1, 1, 1];
  const name = w.theme.anonymous ? '' : clean(w.brand.name);
  switch (st) {
    case 'editorial': {   // columna de color a la izquierda, título protagonista a la derecha
      const cw = 205;
      page.drawRectangle({ x: 0, y: 0, width: cw, height: PH, color: col(pal.primary) });
      drawMotif(page, motif, { x: 0, y: 0, w: cw, h: PH * 0.55 }, pal.onPrimary, 0.16, seed);
      page.drawRectangle({ x: cw, y: 0, width: 6, height: PH, color: col(pal.accent) });
      page.drawText(kind, { x: cw / 2 + 4, y: PH * 0.62, size: 9, font: w.bold, color: col(pal.onPrimary), rotate: degrees(90) });
      drawLogo(w, page, cw + 46, PH - 96, 42, { withName: true, maxW: 220 });
      const x = cw + 46; const width = PW - x - 48;
      page.drawRectangle({ x, y: PH * 0.62 + 18, width: 40, height: 3, color: col(pal.accent) });
      const y = titleBlock(w, page, c.title, x, PH * 0.62, width, 27, pal.heading, w.bold, 7);
      metaList(w, page, c.lines, x, Math.min(y - 30, PH * 0.34), width, { label: pal.muted, value: pal.ink });
      if (c.footnote) page.drawText(clean(c.footnote), { x, y: 40, size: 7.5, font: w.font, color: col(pal.muted) });
      break;
    }
    case 'inmersiva': {   // ilustración a toda página con veladura y título abajo
      page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: col(pal.primary) });
      drawMotif(page, motif, { x: -20, y: PH * 0.3, w: PW + 40, h: PH * 0.7 }, pal.onPrimary, 0.2, seed);
      gradientV(page, 0, 0, PW, PH * 0.62, shade(pal.primary, 0.45), 0.95, 0);
      logoTab(w, page, 0, PH - 108, 62);
      page.drawText(kind, { x: ML, y: PH * 0.47, size: 9, font: w.bold, color: col(tint(pal.accent, 0.1)) });
      page.drawRectangle({ x: ML, y: PH * 0.47 - 12, width: 48, height: 2.6, color: col(pal.accent) });
      const y = titleBlock(w, page, c.title, ML, PH * 0.47 - 24, CW, 30, white, w.bold, 6);
      metaList(w, page, c.lines, ML, Math.min(y - 26, 230), CW, { label: tint(pal.accent, 0.25), value: white }, 2);
      if (c.footnote) page.drawText(clean(c.footnote), { x: ML, y: 34, size: 7.5, font: w.font, color: col(tint(pal.primary, 0.6)) });
      break;
    }
    case 'geometrica': {   // círculos superpuestos de marca y acento, título en el espacio blanco
      page.drawCircle({ x: PW - 40, y: PH - 60, size: 270, color: col(pal.primary) });
      page.drawCircle({ x: PW - 250, y: PH - 250, size: 120, color: col(pal.accent), opacity: 0.92 });
      page.drawCircle({ x: PW - 120, y: PH - 330, size: 46, borderColor: col(pal.primary), borderWidth: 2.4, opacity: 0 });
      drawMotif(page, motif, { x: PW - 300, y: PH - 330, w: 300, h: 330 }, pal.onPrimary, 0.14, seed);
      page.drawRectangle({ x: 0, y: 0, width: PW, height: 10, color: col(pal.primary) });
      drawLogo(w, page, ML, 52, 46, { withName: true, maxW: 220 });
      page.drawText(kind, { x: ML, y: PH * 0.47 + 16, size: 9, font: w.bold, color: col(pal.accentInk) });
      const y = titleBlock(w, page, c.title, ML, PH * 0.47, CW * 0.86, 28, pal.heading, w.bold, 6);
      metaList(w, page, c.lines, ML, Math.min(y - 26, 270), CW, { label: pal.muted, value: pal.ink }, 2);
      if (c.footnote) page.drawText(clean(c.footnote), { x: PW - MR - w.font.widthOfTextAtSize(clean(c.footnote), 7.5), y: 30, size: 7.5, font: w.font, color: col(pal.muted) });
      break;
    }
    case 'tecnica': {   // plano técnico: fondo oscuro de marca, retícula, marcas de corte y ficha técnica
      const bg = shade(pal.primary, 0.5);
      page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: col(bg) });
      for (let x = 0; x < PW; x += 18) page.drawLine({ start: { x, y: 0 }, end: { x, y: PH }, thickness: x % 90 === 0 ? 0.6 : 0.25, color: col(white), opacity: x % 90 === 0 ? 0.14 : 0.07 });
      for (let y = 0; y < PH; y += 18) page.drawLine({ start: { x: 0, y }, end: { x: PW, y }, thickness: y % 90 === 0 ? 0.6 : 0.25, color: col(white), opacity: y % 90 === 0 ? 0.14 : 0.07 });
      drawMotif(page, motif, { x: PW * 0.3, y: PH * 0.52, w: PW * 0.7 - 30, h: PH * 0.3 }, pal.accent, 0.4, seed);
      for (const [x, y, sx, sy] of [[30, PH - 30, 1, -1], [PW - 30, PH - 30, -1, -1], [30, 30, 1, 1], [PW - 30, 30, -1, 1]] as const) {
        page.drawLine({ start: { x, y }, end: { x: x + sx * 22, y }, thickness: 1, color: col(white), opacity: 0.7 });
        page.drawLine({ start: { x, y }, end: { x, y: y + sy * 22 }, thickness: 1, color: col(white), opacity: 0.7 });
      }
      logoTab(w, page, 30, PH - 112, 58);
      page.drawText(kind, { x: ML, y: PH * 0.45, size: 9, font: w.bold, color: col(pal.accent) });
      const y = titleBlock(w, page, c.title, ML, PH * 0.45 - 14, CW, 28, white, w.bold, 6);
      const items = c.lines.filter(([, v]) => v && v.trim()); const top = Math.min(y - 24, 250);
      page.drawRectangle({ x: ML, y: top - items.length * 30 - 6, width: CW, height: items.length * 30 + 6, borderColor: col(white), borderWidth: 0.6, borderOpacity: 0.45, opacity: 0 });
      items.forEach(([k, v], i) => {
        const yy = top - i * 30;
        if (i) page.drawLine({ start: { x: ML, y: yy }, end: { x: ML + CW, y: yy }, thickness: 0.4, color: col(white), opacity: 0.3 });
        page.drawText(clean(k).toUpperCase(), { x: ML + 10, y: yy - 18, size: 6.8, font: w.bold, color: col(pal.accent) });
        let vv = clean(v); while (w.font.widthOfTextAtSize(vv, 9.5) > CW - 160 && vv.length > 8) vv = vv.slice(0, -2);
        if (vv !== clean(v)) vv = vv.trimEnd() + '…';
        page.drawText(vv, { x: ML + 140, y: yy - 19, size: 9.5, font: w.font, color: col(white) });
      });
      if (c.footnote) page.drawText(clean(c.footnote), { x: ML, y: 44, size: 7.5, font: w.font, color: col(white), opacity: 0.6 });
      break;
    }
    case 'minimalista': {   // blanco, filete superior, logo grande, título amplio y datos a pie
      page.drawRectangle({ x: 0, y: PH - 6, width: PW, height: 6, color: col(pal.primary) });
      page.drawRectangle({ x: 0, y: PH - 8.5, width: PW * 0.3, height: 2.5, color: col(pal.accent) });
      drawLogo(w, page, ML, PH - 140, 60, { withName: true, maxW: 260 });
      page.drawText(kind, { x: ML, y: PH * 0.56 + 14, size: 9, font: w.bold, color: col(pal.heading) });
      page.drawCircle({ x: ML + 4, y: PH * 0.56 + 2, size: 3.5, color: col(pal.accent) });
      const y = titleBlock(w, page, c.title, ML, PH * 0.56 - 8, CW * 0.92, 30, pal.ink, w.bold, 7);
      page.drawRectangle({ x: ML, y: 168, width: CW, height: 0.6, color: col(pal.line) });
      metaList(w, page, c.lines, ML, 150, CW, { label: pal.muted, value: pal.ink }, 3);
      if (y < 200) { /* título muy largo: los datos siguen debajo, sin solaparse */ }
      if (c.footnote) page.drawText(clean(c.footnote), { x: ML, y: 30, size: 7.5, font: w.font, color: col(pal.muted) });
      break;
    }
    case 'institucional': {   // bloque superior con pilares, línea de horizonte y título con remate
      const bh = PH * 0.6;
      page.drawRectangle({ x: 0, y: PH - bh, width: PW, height: bh, color: col(pal.primary) });
      for (let i = 0; i < 9; i++) { const x = 40 + i * ((PW - 80) / 8); page.drawRectangle({ x: x - 7, y: PH - bh, width: 14, height: bh * 0.42, color: col(pal.onPrimary), opacity: 0.07 }); }
      page.drawRectangle({ x: 26, y: PH - bh + bh * 0.42, width: PW - 52, height: 10, color: col(pal.onPrimary), opacity: 0.09 });
      drawMotif(page, motif, { x: 0, y: PH - bh * 0.45, w: PW, h: bh * 0.45 }, pal.onPrimary, 0.1, seed);
      page.drawRectangle({ x: 0, y: PH - bh - 5, width: PW, height: 5, color: col(pal.accent) });
      logoTab(w, page, ML - 13, PH - 100, 56);
      page.drawText(kind, { x: ML, y: PH - bh + 210, size: 9, font: w.bold, color: col(tint(pal.accent, 0.1)) });
      titleBlock(w, page, c.title, ML, PH - bh + 196, CW, 28, pal.onPrimary, w.serif, 5);
      metaList(w, page, c.lines, ML, PH - bh - 46, CW, { label: pal.muted, value: pal.ink }, 2);
      if (name) page.drawText(name, { x: PW - MR - w.serif.widthOfTextAtSize(name, 10), y: 40, size: 10, font: w.serif, color: col(pal.deep) });
      if (c.footnote) page.drawText(clean(c.footnote), { x: ML, y: 40, size: 7.5, font: w.font, color: col(pal.muted) });
      break;
    }
  }
  w.current = '';
  addPage(w);
}

/** Reserva la página del índice; se rellena al cerrar, cuando ya se conocen los números de página. */
export function tocPlaceholder(w: W) { w.tocPage = w.page; w.running.set(w.doc.getPageCount() - 1, 'Índice'); addPage(w); }

export async function finish(w: W): Promise<Uint8Array> {
  const pages = w.doc.getPages(); const pal = P(w);
  const first = w.cover ? 1 : 0;
  if (w.tocPage) {
    const pg = w.tocPage; let y = TOP;
    pg.drawText('CONTENIDO', { x: ML, y: y - 8, size: TYPE.kicker, font: w.bold, color: col(pal.accentInk) }); y -= 18;
    pg.drawText('Índice', { x: ML, y: y - TYPE.h1, size: TYPE.h1, font: w.theme.serifTitles ? w.serif : w.bold, color: col(pal.heading) }); y -= TYPE.h1 + 16;
    pg.drawRectangle({ x: ML, y, width: 36, height: 2.6, color: col(pal.accent) }); y -= 30;
    for (const e of w.toc) {
      if (y < BOTTOM + 10) break;
      const m = /^(\d+)\.\s+(.*)$/.exec(e.title); const an = /^Anexo\s+([A-Z0-9]+)\.\s*(.*)$/i.exec(e.title);
      const size = 10.5; const num = String(e.page - first).padStart(2, '0');
      const lead = m ? m[1].padStart(2, '0') : an ? an[1] : '';
      const label = clean(m ? m[2] : an ? an[2] : e.title);
      if (lead) pg.drawText(lead, { x: ML, y, size, font: w.bold, color: col(pal.accentInk) });
      const tx = ML + (lead ? 28 : 0); const maxW = CW - 70 - (lead ? 28 : 0);
      let t = label; while (w.font.widthOfTextAtSize(t, size) > maxW && t.length > 8) t = t.slice(0, -2);
      if (t !== label) t = t.trimEnd() + '…';
      pg.drawText(t, { x: tx, y, size, font: m || an ? w.font : w.bold, color: col(pal.ink) });
      const tw = w.font.widthOfTextAtSize(t, size); const nw = w.bold.widthOfTextAtSize(num, size);
      for (let x = tx + tw + 8; x < PW - MR - nw - 8; x += 3.6) pg.drawCircle({ x, y: y + 2, size: 0.4, color: col(pal.line) });
      pg.drawText(num, { x: PW - MR - nw, y, size, font: w.bold, color: col(pal.deep) });
      y -= 22;
    }
  }
  const n = pages.length - first;
  let running = '';
  pages.forEach((pg, i) => {
    if (i < first) return;
    running = w.running.get(i) ?? running;
    // Cabecera: marca discreta a la izquierda; a la derecha, el apartado en curso (o el título del documento).
    const lw = drawLogo(w, pg, ML, PH - 50, 16, { maxW: 110 });
    if (!lw || w.theme.anonymous) pg.drawText(clean(w.title).slice(0, 60), { x: ML, y: PH - 45, size: 7.5, font: w.bold, color: col(pal.deep) });
    const ht = clean(running || w.title); let t = ht; while (w.font.widthOfTextAtSize(t, 7.5) > 280 && t.length > 8) t = t.slice(0, -2);
    if (t !== ht) t = t.trimEnd() + '…';
    pg.drawText(t, { x: PW - MR - w.font.widthOfTextAtSize(t, 7.5), y: PH - 45, size: 7.5, font: w.font, color: col(pal.muted) });
    pg.drawRectangle({ x: ML, y: PH - 58, width: CW, height: 0.5, color: col(pal.line) });
    pg.drawRectangle({ x: ML, y: PH - 58.4, width: 24, height: 1.4, color: col(pal.primary) });
    // Pie: documento y empresa a la izquierda; número de página a la derecha con un detalle de color.
    const foot = clean(`${w.brand.name ? w.brand.name + '  ·  ' : ''}${w.title.split(' — ')[0]}`);
    let f = foot; while (w.font.widthOfTextAtSize(f, 7.2) > CW - 80 && f.length > 8) f = f.slice(0, -2);
    pg.drawText(f, { x: ML, y: 36, size: 7.2, font: w.font, color: col(pal.muted) });
    const pn = `${String(i - first + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`; const pw = w.bold.widthOfTextAtSize(pn, 8);
    pg.drawRectangle({ x: PW - MR - pw - 12, y: 35, width: 6, height: 6, color: col(pal.accent) });
    pg.drawText(pn, { x: PW - MR - pw, y: 35.5, size: 8, font: w.bold, color: col(pal.deep) });
  });
  return w.doc.save();
}
