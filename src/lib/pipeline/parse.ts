// Step 1-2 of the pipeline: ingestion + parsing.
// Runs in the browser for the MVP. In production the same interface runs in a background
// worker with OCR (Azure Document Intelligence / AWS Textract) for scanned pages.
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';
import { readZip } from './zip';

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

export const ACCEPTED = '.pdf,.docx,.xlsx,.zip,.txt,.md,.csv';

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
    if (kind === 'pdf') return await parsePdf(name, buf, sizeKb, onProgress);
    if (kind === 'docx') return await parseDocx(name, buf, sizeKb);
    if (kind === 'xlsx') return await parseXlsx(name, buf, sizeKb);
    if (kind === 'txt') {
      const text = new TextDecoder().decode(buf);
      return { name, kind, sizeKb, pages: paginate(text, 3000), status: text.trim() ? 'parsed' : 'unreadable', pagesEstimated: true, note: text.trim() ? undefined : 'El archivo está vacío.' };
    }
    const legacy = name.toLowerCase().endsWith('.doc') || name.toLowerCase().endsWith('.xls');
    return { name, kind, sizeKb, pages: [], status: 'unsupported', note: legacy ? 'Los formatos antiguos de Word y Excel (.doc, .xls) no son compatibles. Guarda el archivo como .docx o .xlsx y vuelve a subirlo.' : 'Este tipo de archivo no es compatible. Sube archivos PDF, DOCX, XLSX o ZIP.' };
  } catch (e: any) {
    const msg = String(e?.name || e?.message || '');
    const pw = /password/i.test(msg);
    return { name, kind, sizeKb, pages: [], status: 'unreadable', note: pw ? 'Este PDF está protegido con contraseña. Quítale la contraseña y vuelve a subirlo.' : 'PROPO no ha podido leer este archivo. Puede estar dañado. Prueba a exportarlo de nuevo desde la aplicación original.' };
  }
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
    pages.push(s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim());
    page.cleanup?.();
  }
  await doc.destroy?.();
  const chars = pages.reduce((a, p) => a + p.length, 0);
  const empty = pages.filter((p) => p.length < 25).length;
  if (chars < 40 * pages.length && empty > pages.length * 0.7) {
    return { name, kind: 'pdf', sizeKb, pages, status: 'unreadable', note: 'Este PDF parece escaneado: contiene imágenes en lugar de texto. El reconocimiento de texto (OCR) funciona en la versión de producción; en esta versión, sube un PDF con texto.' };
  }
  if (empty > 0) {
    return { name, kind: 'pdf', sizeKb, pages, status: 'partial', note: `${empty} de ${pages.length} páginas no tienen texto legible (probablemente imágenes escaneadas o páginas en blanco). Revísalas a mano.` };
  }
  return { name, kind: 'pdf', sizeKb, pages, status: 'parsed' };
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
