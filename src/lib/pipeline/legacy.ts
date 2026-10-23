// Formatos antiguos y alternativos que todavía publican muchos organismos: Word 97-2003 (.doc), Excel 97-2003 (.xls),
// RTF y OpenDocument (.odt). Solo se extrae el texto, sin dependencias. Muchos «.doc» de anexos son en realidad RTF
// o HTML con otra extensión: se mira el contenido, no el nombre.
import { readZip, writeZip } from './zip';

const u16 = (b: Uint8Array, o: number) => b[o] | (b[o + 1] << 8);
const u32 = (b: Uint8Array, o: number) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
const i32 = (b: Uint8Array, o: number) => b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24);

export type Sniff = 'cfb' | 'rtf' | 'html' | 'zip' | 'pdf' | 'text';
export function sniff(b: Uint8Array): Sniff {
  if (b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0) return 'cfb';
  const head = new TextDecoder('latin1').decode(b.subarray(0, 512)).trimStart().toLowerCase();
  if (head.startsWith('{\\rtf')) return 'rtf';
  if (head.startsWith('%pdf')) return 'pdf';
  if (b[0] === 0x50 && b[1] === 0x4b) return 'zip';
  if (/^(<\?xml|<!doctype html|<html|<meta|<head|<body)/.test(head) || /<html[\s>]/.test(head)) return 'html';
  return 'text';
}

// ── Contenedor de Microsoft (Compound File Binary) ────────────────────────────────────────────────────────────────
/** Lee los flujos de un archivo .doc/.xls: nombre → bytes. */
export function readCfb(buf: ArrayBuffer): Map<string, Uint8Array> {
  const b = new Uint8Array(buf);
  const ss = 1 << u16(b, 0x1e), mss = 1 << u16(b, 0x20);
  const sec = (n: number) => 512 + n * ss;   // con sectores de 4096 la cabecera ocupa un sector entero: 512 + n*4096 sigue cuadrando para n ≥ 0 en v3; en v4 la cabecera es 4096
  const off = (n: number) => (ss === 4096 ? 4096 + n * 4096 : sec(n));
  // DIFAT → sectores de la FAT
  const fatSecs: number[] = [];
  for (let i = 0; i < 109; i++) { const s = u32(b, 0x4c + i * 4); if (s < 0xfffffffa) fatSecs.push(s); }
  let dif = u32(b, 0x44); let guard = 0;
  while (dif < 0xfffffffa && guard++ < 1000) {
    const o = off(dif); const per = ss / 4 - 1;
    for (let i = 0; i < per; i++) { const s = u32(b, o + i * 4); if (s < 0xfffffffa) fatSecs.push(s); }
    dif = u32(b, o + per * 4);
  }
  const fat: number[] = [];
  for (const s of fatSecs) { const o = off(s); for (let i = 0; i < ss / 4; i++) fat.push(u32(b, o + i * 4)); }
  const chain = (start: number, table: number[]) => { const out: number[] = []; let s = start; let g = 0; while (s < 0xfffffffa && g++ < 1e6) { out.push(s); s = table[s]; } return out; };
  const readChain = (start: number) => { const ch = chain(start, fat); const out = new Uint8Array(ch.length * ss); ch.forEach((s, i) => out.set(b.subarray(off(s), off(s) + ss), i * ss)); return out; };
  // Directorio
  const dir = readChain(u32(b, 0x30));
  const entries: { name: string; type: number; start: number; size: number }[] = [];
  for (let o = 0; o + 128 <= dir.length; o += 128) {
    const nl = u16(dir, o + 0x40); if (!nl) { entries.push({ name: '', type: 0, start: 0, size: 0 }); continue; }
    let name = ''; for (let i = 0; i < nl / 2 - 1; i++) name += String.fromCharCode(u16(dir, o + i * 2));
    entries.push({ name, type: dir[o + 0x42], start: u32(dir, o + 0x74), size: u32(dir, o + 0x78) });
  }
  // Mini stream (flujos pequeños, < 4096 bytes)
  const root = entries[0];
  const mini = root ? readChain(root.start) : new Uint8Array();
  const minifat: number[] = [];
  const mf = readChain(u32(b, 0x3c));
  if (u32(b, 0x3c) < 0xfffffffa) for (let i = 0; i < u32(b, 0x40) * ss / 4; i++) minifat.push(u32(mf, i * 4));
  const cutoff = u32(b, 0x38) || 4096;
  const streams = new Map<string, Uint8Array>();
  for (const e of entries) {
    if (e.type !== 2) continue;
    if (e.size < cutoff) {
      const ch = chain(e.start, minifat); const out = new Uint8Array(ch.length * mss);
      ch.forEach((s, i) => out.set(mini.subarray(s * mss, s * mss + mss), i * mss));
      streams.set(e.name, out.subarray(0, e.size));
    } else streams.set(e.name, readChain(e.start).subarray(0, e.size));
  }
  return streams;
}

// ── Word 97-2003 ──────────────────────────────────────────────────────────────────────────────────────────────────
const CP1252: Record<number, string> = { 0x80: '€', 0x82: '‚', 0x84: '„', 0x85: '…', 0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—', 0x99: '™' };
const win = (c: number) => CP1252[c] ?? String.fromCharCode(c);

/** Texto de un .doc: recorre la tabla de piezas (CLX) del documento principal. */
export function docText(streams: Map<string, Uint8Array>): string {
  const wd = streams.get('WordDocument'); if (!wd || u16(wd, 0) !== 0xa5ec) throw new Error('no_word');
  const table = streams.get(u16(wd, 0x0a) & 0x0200 ? '1Table' : '0Table'); if (!table) throw new Error('no_table');
  const csw = u16(wd, 32); const cslw = u16(wd, 34 + csw * 2); const blob = 34 + csw * 2 + 2 + cslw * 4 + 2;
  const ccpText = i32(wd, 34 + csw * 2 + 2 + 3 * 4);   // caracteres del cuerpo (sin notas ni encabezados)
  const fcClx = u32(wd, blob + 33 * 8), lcbClx = u32(wd, blob + 33 * 8 + 4);
  let p = fcClx; const end = fcClx + lcbClx;
  while (p < end && table[p] === 0x01) p += 3 + u16(table, p + 1);   // Prc: propiedades, se saltan
  if (table[p] !== 0x02) throw new Error('no_clx');
  const lcb = u32(table, p + 1); const plc = p + 5; const n = (lcb - 4) / 12;
  let out = '';
  for (let i = 0; i < n; i++) {
    const cpA = u32(table, plc + i * 4), cpB = u32(table, plc + (i + 1) * 4);
    if (cpA >= ccpText) break;
    const len = Math.min(cpB, ccpText) - cpA;
    const raw = u32(table, plc + (n + 1) * 4 + i * 8 + 2);
    if (raw & 0x40000000) { const fc = (raw & 0x3fffffff) / 2; for (let k = 0; k < len; k++) out += win(wd[fc + k]); }
    else { const fc = raw; for (let k = 0; k < len; k++) out += String.fromCharCode(u16(wd, fc + k * 2)); }
  }
  return cleanWord(out);
}

function cleanWord(s: string) {
  // Campos: \x13 instrucción \x14 resultado \x15 → solo el resultado
  let t = ''; let depth = 0; let skip = false; const stack: boolean[] = [];
  for (const ch of s) {
    if (ch === '\x13') { stack.push(skip); depth++; skip = true; continue; }
    if (ch === '\x14') { skip = false; continue; }
    if (ch === '\x15') { depth = Math.max(0, depth - 1); skip = stack.pop() ?? false; continue; }
    if (!skip) t += ch;
  }
  return t.replace(/\r\x07/g, '\n').replace(/\x07/g, '\t').replace(/[\r\x0b]/g, '\n').replace(/\x0c/g, '\n\f\n').replace(/[\x00-\x08\x0e-\x1f]/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ── Excel 97-2003 ─────────────────────────────────────────────────────────────────────────────────────────────────
/** Texto de un .xls (BIFF8): cada hoja como líneas de celdas separadas por tabuladores. */
export function xlsText(streams: Map<string, Uint8Array>): string[] {
  const w = streams.get('Workbook') ?? streams.get('Book'); if (!w) throw new Error('no_workbook');
  const recs: { t: number; d: Uint8Array }[] = [];
  for (let p = 0; p + 4 <= w.length;) { const t = u16(w, p), l = u16(w, p + 2); recs.push({ t, d: w.subarray(p + 4, p + 4 + l) }); p += 4 + l; }
  // Tabla de cadenas compartidas (SST), que puede seguir en registros CONTINUE.
  const sst: string[] = [];
  const iSst = recs.findIndex((r) => r.t === 0x00fc);
  if (iSst >= 0) {
    const parts = [recs[iSst].d]; for (let k = iSst + 1; k < recs.length && recs[k].t === 0x003c; k++) parts.push(recs[k].d);
    let pi = 0, p = 8; const total = u32(parts[0], 4);
    const need = () => { if (p >= parts[pi].length) { pi++; p = 0; } };
    for (let s = 0; s < total && pi < parts.length; s++) {
      need(); const cch = u16(parts[pi], p); p += 2; need(); let flags = parts[pi][p++];
      let rt = 0, ext = 0;
      if (flags & 0x08) { rt = u16(parts[pi], p); p += 2; }
      if (flags & 0x04) { ext = u32(parts[pi], p); p += 4; }
      let str = ''; let left = cch;
      while (left > 0 && pi < parts.length) {
        if (p >= parts[pi].length) { pi++; p = 0; if (pi >= parts.length) break; flags = parts[pi][p++]; }
        const wide = flags & 0x01; const room = Math.floor((parts[pi].length - p) / (wide ? 2 : 1)); const take = Math.min(left, room);
        for (let k = 0; k < take; k++) str += wide ? String.fromCharCode(u16(parts[pi], p + k * 2)) : win(parts[pi][p + k]);
        p += take * (wide ? 2 : 1); left -= take;
        if (take === 0) { pi++; p = 0; if (pi < parts.length) flags = parts[pi][p++]; }
      }
      let skipB = rt * 4 + ext;
      while (skipB > 0 && pi < parts.length) { const room = parts[pi].length - p; const tk = Math.min(room, skipB); p += tk; skipB -= tk; if (skipB > 0) { pi++; p = 0; } }
      sst.push(str);
    }
  }
  const rk = (v: number) => { let n: number; if (v & 0x02) n = v >> 2; else { const dv = new DataView(new ArrayBuffer(8)); dv.setUint32(4, v & 0xfffffffc, true); n = dv.getFloat64(0, true); } return v & 0x01 ? n / 100 : n; };
  const sheets: string[] = []; let cells = new Map<number, Map<number, string>>(); let inSheet = false;
  const flush = () => { const rows = [...cells.keys()].sort((a, b) => a - b).map((r) => { const m = cells.get(r)!; return [...m.keys()].sort((a, b) => a - b).map((c) => m.get(c)).join('\t'); }); const t = rows.join('\n').trim(); if (t) sheets.push(t); cells = new Map(); };
  const put = (r: number, c: number, v: string) => { if (!cells.has(r)) cells.set(r, new Map()); cells.get(r)!.set(c, v); };
  for (const { t, d } of recs) {
    if (t === 0x0809) { if (inSheet) flush(); inSheet = u16(d, 2) === 0x0010; continue; }   // BOF de hoja
    if (!inSheet) continue;
    if (t === 0x000a) { flush(); inSheet = false; }
    else if (t === 0x00fd) put(u16(d, 0), u16(d, 2), sst[u32(d, 6)] ?? '');
    else if (t === 0x0203) put(u16(d, 0), u16(d, 2), String(Math.round(new DataView(d.buffer, d.byteOffset + 6, 8).getFloat64(0, true) * 100) / 100));
    else if (t === 0x027e) put(u16(d, 0), u16(d, 2), String(Math.round(rk(u32(d, 6)) * 100) / 100));
    else if (t === 0x00bd) { const r = u16(d, 0), c0 = u16(d, 2); for (let k = 0; 4 + k * 6 + 6 <= d.length - 2; k++) put(r, c0 + k, String(Math.round(rk(u32(d, 4 + k * 6 + 2)) * 100) / 100)); }
  }
  if (inSheet) flush();
  return sheets;
}

// ── RTF, HTML y OpenDocument ──────────────────────────────────────────────────────────────────────────────────────
export function rtfText(src: string): string {
  let out = ''; let i = 0; const stack: { skip: boolean; uc: number }[] = []; let skip = false; let uc = 1; let pendingSkip = 0;
  const DEST = /^(fonttbl|colortbl|stylesheet|info|pict|object|header|footer|headerl|headerr|footerl|footerr|themedata|colorschememapping|latentstyles|datastore|xmlnstbl|listtable|listoverridetable|rsidtbl|generator|mmathPr|fldinst)$/;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '{') { stack.push({ skip, uc }); i++; if (src.startsWith('\\*', i)) skip = true; continue; }
    if (ch === '}') { const s = stack.pop(); if (s) { skip = s.skip; uc = s.uc; } i++; continue; }
    if (ch === '\\') {
      const m = /^\\([a-zA-Z]+)(-?\d+)? ?|^\\'([0-9a-fA-F]{2})|^\\(.)/.exec(src.slice(i, i + 40))!;
      i += m[0].length;
      if (m[3]) { if (pendingSkip > 0) { pendingSkip--; continue; } if (!skip) out += win(parseInt(m[3], 16)); continue; }
      if (m[4]) { if (!skip && '\\{}'.includes(m[4])) out += m[4]; else if (!skip && m[4] === '~') out += ' '; continue; }
      const w = m[1], n = m[2] ? Number(m[2]) : null;
      if (DEST.test(w)) { skip = true; continue; }
      if (skip) continue;
      if (w === 'par' || w === 'line' || w === 'row') out += '\n'; else if (w === 'tab' || w === 'cell') out += '\t'; else if (w === 'page') out += '\n\f\n';
      else if (w === 'uc' && n != null) uc = n; else if (w === 'u' && n != null) { out += String.fromCharCode(n < 0 ? n + 65536 : n); pendingSkip = uc; }
      continue;
    }
    if (ch === '\r' || ch === '\n') { i++; continue; }
    if (pendingSkip > 0) { pendingSkip--; i++; continue; }
    if (!skip) out += ch; i++;
  }
  return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function htmlText(src: string): string {
  const d = new DOMParser().parseFromString(src, 'text/html');
  d.querySelectorAll('script,style').forEach((e) => e.remove());
  d.querySelectorAll('br').forEach((e) => e.replaceWith('\n'));
  d.querySelectorAll('p,div,li,tr,h1,h2,h3,h4,h5,h6').forEach((e) => e.append('\n'));
  d.querySelectorAll('td,th').forEach((e) => e.append('\t'));
  return (d.body?.textContent ?? '').replace(/ /g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function odtText(buf: ArrayBuffer): Promise<string> {
  const e = (await readZip(buf)).find((x) => x.name === 'content.xml'); if (!e) throw new Error('no_content');
  const xml = new TextDecoder().decode(e.data);
  return xml.replace(/<text:tab\/>/g, '\t').replace(/<text:line-break\/>/g, '\n').replace(/<\/text:(p|h)>/g, '\n').replace(/<table:table-cell[^>]*>/g, '\t')
    .replace(/<text:s(?: text:c="(\d+)")?\/>/g, (_, n) => ' '.repeat(Number(n) || 1)).replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/\n{3,}/g, '\n\n').trim();
}

/** Decodifica texto que puede venir en UTF-8 o en Windows-1252 (muy habitual en archivos antiguos). */
export function decodeText(buf: ArrayBuffer): string {
  const t = new TextDecoder('utf-8').decode(buf);
  return (t.match(/�/g)?.length ?? 0) > 3 ? new TextDecoder('windows-1252').decode(buf) : t;
}

// ── Word moderno a partir de texto (para rellenar anexos que llegan en .doc, .rtf u .odt) ────────────────────────────
const x = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Un .docx sencillo con el texto del documento: un párrafo por línea, tabuladores conservados. */
export function textToDocx(text: string): Uint8Array {
  const para = (line: string) => `<w:p><w:pPr><w:spacing w:after="120"/></w:pPr>${line.split('\t').map((t, i) => `${i ? '<w:r><w:tab/></w:r>' : ''}${t ? `<w:r><w:t xml:space="preserve">${x(t)}</w:t></w:r>` : ''}`).join('')}</w:p>`;
  const body = text.replace(/\f/g, '').split('\n').map(para).join('');
  const enc = (s: string) => new TextEncoder().encode(s);
  return writeZip([
    { name: '[Content_Types].xml', data: enc('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>') },
    { name: '_rels/.rels', data: enc('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>') },
    { name: 'word/_rels/document.xml.rels', data: enc('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>') },
    { name: 'word/styles.xml', data: enc('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="21"/><w:lang w:val="es-ES"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>') },
    { name: 'word/document.xml', data: enc(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>`) },
  ]);
}
