// Step 1-2 of the pipeline: ingestion + parsing.
// Runs in the browser for the MVP. In production the same interface runs in a background
// worker with OCR (Azure Document Intelligence / AWS Textract) for scanned pages.
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';
import { readZip } from './zip';
import { sniff, readCfb, docText, xlsText, rtfText, htmlText, odtText, decodeText } from './legacy';
import { ocrPages, MAX_OCR_PAGES } from './ocr';
import { getSample } from '../ai/provider';
import { cleanText } from '../util';

// pdf.js "fake worker": parse on the main thread (artifact pages cannot load worker files by URL).
(globalThis as any).pdfjsWorker = pdfWorker;

export type ParseStatus = 'parsed' | 'unreadable' | 'unsupported' | 'partial';

export interface ParsedDoc {
  name: string;
  kind: 'pdf' | 'docx' | 'xlsx' | 'txt' | 'other';
  sizeKb: number;
  pages: string[];
  status: ParseStatus;
  note?: string;
  pagesEstimated?: boolean;
}

const MAX_MB = 60;

export function kindOf(name: string): ParsedDoc['kind'] {
  const ext = name.toLowerCase().split('.').pop() || '';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  if (ext === 'xlsx') return 'xlsx';
  if (['txt', 'md', 'csv'].includes(ext)) return 'txt';
  return 'other';
}

export const ACCEPTED = '.pdf,.docx,.xlsx,.zip,.txt,.md,.csv,.doc,.xls,.rtf,.odt,.ods,.htm,.html';
/** Extensiones que se leen con lib/pipeline/legacy.ts (formatos antiguos o alternativos). */
const LEGACY = ['doc', 'dot', 'xls', 'rtf', 'odt', 'ods', 'htm', 'html', 'wps'];

export async function parseFile(file: File, onProgress?: (msg: string) => void): Promise<ParsedDoc[]> {
  const name = file.name;
  const sizeKb = file.size / 1024;
  if (file.size > MAX_MB * 1024 * 1024) {
    return [{ name, kind: kindOf(name), sizeKb, pages: [], status: 'unsupported', note: `Este archivo supera los ${MAX_MB} MB. Divídelo o sube los documentos por separado.` }];
  }
  const buf = await file.arrayBuffer();
  if (name.toLowerCase().endsWith('.zip')) {
    let entries;
    try { entries = await readZip(buf); } catch {
      return [{ name, kind: 'other', sizeKb, pages: [], status: 'unreadable', note: 'No se ha podido abrir este ZIP. Puede estar dañado o protegido con contraseña.' }];
    }
    const out: ParsedDoc[] = [];
    for (const e of entries) {
      const base = e.name.split('/').pop() || e.name;
      if (base.startsWith('.') || e.name.startsWith('__MACOSX')) continue;
      onProgress?.(`Descomprimiendo ${base}`);
      const inner = new File([e.data], base);
      if (base.toLowerCase().endsWith('.zip')) continue; // nested archives are not expanded
      out.push(...(await parseFile(inner, onProgress)));
    }
    if (!out.length) return [{ name, kind: 'other', sizeKb, pages: [], status: 'unsupported', note: 'El ZIP no contiene documentos compatibles (PDF, DOCX, XLSX).' }];
    return out;
  }
  return [await parseBuffer(name, buf, sizeKb, onProgress)];
}

export async function parseBuffer(name: string, buf: ArrayBuffer, sizeKb: number, onProgress?: (msg: string) => void): Promise<ParsedDoc> {
  const kind = kindOf(name);
  try {
    if (kind === 'pdf') { const copy = buf.slice(0); return await withOcr(await parsePdf(name, buf, sizeKb, onProgress), copy, onProgress); }
    if (kind === 'docx') return await parseDocx(name, buf, sizeKb);
    if (kind === 'xlsx') return await parseXlsx(name, buf, sizeKb);
    if (kind === 'txt') {
      const text = new TextDecoder().decode(buf);
      return { name, kind, sizeKb, pages: paginate(text, 3000), status: text.trim() ? 'parsed' : 'unreadable', pagesEstimated: true, note: text.trim() ? undefined : 'El archivo está vacío.' };
    }
    const ext = name.toLowerCase().split('.').pop() || '';
    if (LEGACY.includes(ext)) return await parseLegacy(name, ext, buf, sizeKb, onProgress);
    return { name, kind, sizeKb, pages: [], status: 'unsupported', note: 'Este tipo de archivo no es compatible. Sube archivos PDF, Word, Excel, RTF, OpenDocument o ZIP.' };
  } catch (e: any) {
    const msg = String(e?.name || e?.message || '');
    const pw = /password/i.test(msg);
    return { name, kind, sizeKb, pages: [], status: 'unreadable', note: pw ? 'Este PDF está protegido con contraseña. Quítale la contraseña y vuelve a subirlo.' : 'PROPO no ha podido leer este archivo. Puede estar dañado. Prueba a exportarlo de nuevo desde la aplicación original.' };
  }
}

/** .doc, .xls, .rtf, .odt, .html… Se mira el contenido: muchos «.doc» son RTF, HTML o incluso .docx renombrados. */
async function parseLegacy(name: string, ext: string, buf: ArrayBuffer, sizeKb: number, onProgress?: (m: string) => void): Promise<ParsedDoc> {
  const b = new Uint8Array(buf); const kindIs = sniff(b);
  if (kindIs === 'pdf') { const copy = buf.slice(0); return withOcr(await parsePdf(name, buf, sizeKb, onProgress), copy, onProgress); }
  if (kindIs === 'zip' && !/^od[ts]$/.test(ext)) return ext === 'xls' ? parseXlsx(name, buf, sizeKb) : parseDocx(name, buf, sizeKb);
  let pages: string[] = [];
  if (kindIs === 'cfb') {
    const st = readCfb(buf);
    if (st.has('WordDocument')) pages = docText(st).split('\n\f\n');
    else if (st.has('Workbook') || st.has('Book')) pages = xlsText(st);
    else if (st.has('EncryptedPackage')) return { name, kind: 'other', sizeKb, pages: [], status: 'unreadable', note: 'Este documento está protegido con contraseña. Quítale la contraseña y vuelve a subirlo.' };
  } else if (kindIs === 'rtf') pages = rtfText(new TextDecoder('latin1').decode(buf)).split('\n\f\n');
  else if (kindIs === 'html') pages = [htmlText(decodeText(buf))];
  else if (kindIs === 'zip') pages = [await odtText(buf)];
  else pages = [decodeText(buf)];
  pages = pages.flatMap((t) => (t.length > 6000 ? paginate(t, 3000) : [t])).map((t) => cleanText(t).trim()).filter(Boolean);
  const chars = pages.reduce((a, t) => a + t.length, 0);
  if (chars < 20) return { name, kind: 'other', sizeKb, pages: [], status: 'unreadable', note: 'No se ha encontrado texto en este documento. Ábrelo y guárdalo como PDF o como Word (.docx).' };
  return { name, kind: ext === 'xls' || ext === 'ods' ? 'xlsx' : 'other', sizeKb, pages, status: 'parsed', pagesEstimated: true, note: 'Leído de un formato antiguo o alternativo: los números de página son aproximados.' };
}

/** Páginas escaneadas (sin texto): las lee la IA. Si la IA no está disponible, el documento queda como estaba. */
async function withOcr(r: ParsedDoc, buf: ArrayBuffer, onProgress?: (m: string) => void): Promise<ParsedDoc> {
  if (r.kind !== 'pdf' || (r.status !== 'unreadable' && r.status !== 'partial')) return r;
  const empty = r.pages.map((t, i) => (t.length < 25 ? i + 1 : 0)).filter(Boolean);
  if (!empty.length || !(await getSample().catch(() => null))) return r;
  let read: Map<number, string>;
  try { read = await ocrPages(buf, empty, (d, t) => onProgress?.(`Leyendo las páginas escaneadas de ${r.name} con IA (${Math.min(d + 1, t)} de ${t})…`)); } catch { return r; }
  if (!read.size) return r;
  const pages = r.pages.map((t, i) => read.get(i + 1) ?? t);
  const still = pages.filter((t) => t.length < 25).length;
  const over = empty.length > MAX_OCR_PAGES ? ` Solo se han leído las ${MAX_OCR_PAGES} primeras páginas escaneadas.` : '';
  return { ...r, pages, status: still > pages.length * 0.3 ? 'partial' : 'parsed', note: `${read.size} página${read.size === 1 ? '' : 's'} escaneada${read.size === 1 ? '' : 's'} leída${read.size === 1 ? '' : 's'} con reconocimiento de texto por IA: revisa en el original las cifras y fechas importantes.${still ? ` ${still} página${still === 1 ? '' : 's'} sin texto (en blanco o ilegibles).` : ''}${over}` };
}

async function parsePdf(name: string, buf: ArrayBuffer, sizeKb: number, onProgress?: (m: string) => void): Promise<ParsedDoc> {
  const doc = await (pdfjs as any).getDocument({ data: new Uint8Array(buf), isEvalSupported: false, disableFontFace: true }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    if (i % 10 === 1) onProgress?.(`Leyendo ${name} — página ${i} de ${doc.numPages}`);
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    let s = '';
    for (const it of tc.items as any[]) {
      if (typeof it.str !== 'string') continue;
      s += it.str;
      s += it.hasEOL ? '\n' : (it.str && !it.str.endsWith(' ') ? ' ' : '');
    }
    pages.push(cleanText(s).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim());
    page.cleanup?.();
  }
  await doc.destroy?.();
  const chars = pages.reduce((a, p) => a + p.length, 0);
  const empty = pages.filter((p) => p.length < 25).length;
  if (chars < 40 * pages.length && empty > pages.length * 0.7) {
    return { name, kind: 'pdf', sizeKb, pages, status: 'unreadable', note: 'Este PDF parece escaneado: contiene imágenes en lugar de texto y no se ha podido leer con la IA ahora. Vuelve a subirlo en unos minutos o súbelo en una versión con texto.' };
  }
  if (empty > 0) {
    return { name, kind: 'pdf', sizeKb, pages, status: 'partial', note: `${empty} de ${pages.length} páginas no tienen texto legible (probablemente imágenes escaneadas o páginas en blanco). Revísalas a mano.` };
  }
  return { name, kind: 'pdf', sizeKb, pages, status: 'parsed' };
}

/** Trozos de texto de unas páginas de un PDF con su posición (coordenadas PDF, origen abajo a la izquierda). */
export interface PdfItem { page: number; str: string; x: number; y: number; w: number; h: number }
export async function pdfItems(buf: ArrayBuffer, pages: number[]): Promise<PdfItem[]> {
  const doc = await (pdfjs as any).getDocument({ data: new Uint8Array(buf), isEvalSupported: false, disableFontFace: true }).promise;
  const out: PdfItem[] = [];
  for (const n of pages) {
    if (n < 1 || n > doc.numPages) continue;
    const page = await doc.getPage(n);
    const tc = await page.getTextContent();
    for (const it of tc.items as any[]) {
      if (typeof it.str !== 'string' || !it.str.trim()) continue;
      const [, , c, d, e, f] = it.transform as number[];
      out.push({ page: n, str: cleanText(it.str), x: e, y: f, w: it.width, h: Math.hypot(c, d) || it.height || 10 });
    }
    page.cleanup?.();
  }
  await doc.destroy?.();
  return out;
}

function xmlText(s: string) {
  return s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

async function parseDocx(name: string, buf: ArrayBuffer, sizeKb: number): Promise<ParsedDoc> {
  const entries = await readZip(buf);
  const main = entries.find((e) => e.name === 'word/document.xml');
  if (!main) throw new Error('not_docx');
  const xml = new TextDecoder().decode(main.data);
  const body = xml.replace(/<w:tab\/>/g, '\t');
  const paras = body.split(/<\/w:p>/);
  const pages: string[] = [];
  let cur: string[] = [];
  let hadBreak = false;
  for (const p of paras) {
    const brk = /<w:br [^>]*w:type="page"|<w:lastRenderedPageBreak\/>|<w:pageBreakBefore\/>/.test(p);
    if (brk && cur.length) { pages.push(cur.join('\n')); cur = []; hadBreak = true; }
    const t = xmlText(p).trim();
    if (t) cur.push(t);
  }
  if (cur.length) pages.push(cur.join('\n'));
  let out = pages;
  let estimated = false;
  if (!hadBreak) { out = paginate(pages.join('\n'), 3200); estimated = true; }
  const text = out.join('').trim();
  return { name, kind: 'docx', sizeKb, pages: out, status: text ? 'parsed' : 'unreadable', pagesEstimated: estimated, note: text ? (estimated ? 'Los números de página son aproximados (el documento no tiene saltos de página).' : undefined) : 'El documento no contiene texto.' };
}

async function parseXlsx(name: string, buf: ArrayBuffer, sizeKb: number): Promise<ParsedDoc> {
  const entries = await readZip(buf);
  const dec = new TextDecoder();
  const ssEntry = entries.find((e) => e.name === 'xl/sharedStrings.xml');
  const shared: string[] = ssEntry ? dec.decode(ssEntry.data).split(/<\/si>/).slice(0, -1).map((s) => xmlText(s)) : [];
  const wbEntry = entries.find((e) => e.name === 'xl/workbook.xml');
  const sheetNames = wbEntry ? [...dec.decode(wbEntry.data).matchAll(/<sheet [^>]*name="([^"]+)"/g)].map((m) => m[1]) : [];
  const sheets = entries.filter((e) => /^xl\/worksheets\/sheet\d+\.xml$/.test(e.name))
    .sort((a, b) => parseInt(a.name.match(/\d+/)![0]) - parseInt(b.name.match(/\d+/)![0]));
  const pages = sheets.map((sh, i) => {
    const xml = dec.decode(sh.data);
    const rows = xml.split(/<\/row>/).map((row) => {
      const cells = [...row.matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].map((m) => {
        const attrs = m[1]; const inner = m[2] || '';
        const t = attrs.match(/t="(\w+)"/)?.[1];
        const v = inner.match(/<v>([\s\S]*?)<\/v>/)?.[1];
        if (t === 's' && v != null) return shared[parseInt(v)] ?? '';
        if (t === 'inlineStr') return xmlText(inner);
        return v != null ? xmlText(v) : '';
      }).filter(Boolean);
      return cells.join(' | ');
    }).filter(Boolean);
    return `Hoja: ${sheetNames[i] || `Hoja ${i + 1}`}\n` + rows.join('\n');
  });
  const text = pages.join('').trim();
  return { name, kind: 'xlsx', sizeKb, pages, status: text ? 'parsed' : 'unreadable', note: text ? 'Cada hoja se trata como una página.' : 'La hoja de cálculo no contiene celdas legibles.' };
}

export function paginate(text: string, size: number): string[] {
  const out: string[] = [];
  const paras = text.split(/\n/);
  let cur = '';
  for (const p of paras) {
    if ((cur + '\n' + p).length > size && cur) { out.push(cur.trim()); cur = ''; }
    cur += (cur ? '\n' : '') + p;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.length ? out : [''];
}
