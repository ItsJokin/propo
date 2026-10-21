// Rellena el modelo oficial de oferta económica del pliego (Word, Excel o PDF con campos) con el precio confirmado.
// La IA solo decide DÓNDE va cada dato; los datos salen siempre de la oferta confirmada y del perfil de empresa, y
// cualquier cifra que no esté entre ellos se descarta. Lo que no se sabe (p. ej. el DNI del firmante) se deja en blanco.
import type { AppState, Project, SourceDoc } from './types';
import { ai } from './ai/provider';
import { getFile, getPages, putFile } from './storage';
import { readZip, writeZip, type ZipEntry } from './pipeline/zip';
import { eur2, eurosInWords } from './pricing';
import { fmtDate, nowIso, isUnknown } from './util';
import { PDFDocument, PDFTextField } from 'pdf-lib';

export interface FilledModel { key: string; name: string; ext: 'docx' | 'xlsx' | 'pdf'; fields: number; source: string; at: string }

const MODEL = /proposici[oó]n econ[oó]mica|oferta econ[oó]mica|modelo de (oferta|proposici)|criterios? (evaluables|cuantificables) (mediante|por) f[oó]rmula/i;
const extOf = (n: string) => (n.toLowerCase().split('.').pop() || '');

/** El documento del pliego que es el modelo de oferta económica (si lo hay y se puede rellenar). */
export async function findModelDoc(p: Project): Promise<SourceDoc | null> {
  const fillable = p.docs.filter((d) => d.textKey && ['docx', 'xlsx', 'pdf'].includes(extOf(d.name)));
  const wanted = p.pricing?.rule?.model?.doc?.toLowerCase() || '';
  const named = wanted ? fillable.find((d) => d.name.toLowerCase().includes(wanted) || wanted.includes(d.name.toLowerCase().replace(/\.[a-z]+$/, ''))) : null;
  if (named) return named;
  let best: { d: SourceDoc; score: number } | null = null;
  for (const d of fillable) {
    const pages = (await getPages(d.textKey!)) || [];
    const text = pages.slice(0, 6).join('\n');
    let score = 0;
    if (/anexo|modelo|annex/i.test(d.name)) score += 2;
    if (/econ[oó]mic|precio|oferta/i.test(d.name)) score += 3;
    if (MODEL.test(text)) score += 4;
    if (/en letra|en cifra|IVA/i.test(text)) score += 1;
    if (/pliego de (cl[aá]usulas|prescripciones)|PCAP|PPT/i.test(d.name)) score -= 4;   // los pliegos enteros no son el modelo
    if (pages.length > 8) score -= 2;
    if (score >= 5 && (!best || score > best.score)) best = { d, score };
  }
  return best?.d ?? null;
}

// ── Los datos que se pueden poner ──────────────────────────────────────────────────────────────────────────────────
function dataFor(p: Project, s: AppState) {
  const ch = p.pricing!.choice!; const rule = p.pricing!.rule!; const c = s.company;
  const vat = rule.vat ?? 21; const iva = Math.round(ch.total * vat) / 100; const tot = Math.round((ch.total + iva) * 100) / 100;
  const others = rule.others.filter((o) => p.pricing!.others[o.id]?.formal).map((o) => ({ criterio: o.label, compromiso: p.pricing!.others[o.id].formal, respuesta: p.pricing!.others[o.id].text }));
  return {
    licitador: c.legalName || null, nif: c.taxId || null, domicilio: c.address || null, representante: c.signer || null,
    expediente: !isUnknown(p.analysis?.reference) ? p.analysis!.reference : p.tender?.live?.ref || null, objeto: p.tender?.title || p.name, organo: p.organization,
    precio_sin_iva: ch.total, precio_sin_iva_texto: eur2(ch.total), precio_sin_iva_letra: eurosInWords(ch.total),
    tipo_iva: vat, iva: iva, iva_texto: eur2(iva), precio_con_iva: tot, precio_con_iva_texto: eur2(tot), precio_con_iva_letra: eurosInWords(tot),
    precios_unitarios: ch.units.map((u) => ({ concepto: u.label, precio_sin_iva: u.price, texto: eur2(u.price), letra: eurosInWords(u.price) })),
    otros_criterios: others, fecha: fmtDate(nowIso()),
  };
}
type Data = ReturnType<typeof dataFor>;

/** Cifras que se pueden escribir: las de la oferta (en varios formatos) y las que ya estaban en el documento. */
function allowedNumbers(d: Data) {
  const out = new Set<string>();
  const add = (x: number) => {
    const fixed = x.toFixed(2);
    [String(x), fixed, fixed.replace('.', ','), x.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' } as Intl.NumberFormatOptions), x.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions), String(Math.round(x))]
      .forEach((s) => out.add(s.replace(/\s/g, '')));
  };
  [d.precio_sin_iva, d.iva, d.precio_con_iva, d.tipo_iva, ...d.precios_unitarios.map((u) => u.precio_sin_iva)].forEach(add);
  d.otros_criterios.forEach((o) => (o.respuesta + ' ' + o.compromiso).match(/\d[\d.,]*/g)?.forEach((n) => out.add(n)));
  [d.nif, d.expediente, d.fecha, d.domicilio].forEach((t) => String(t || '').match(/\d[\d.,]*/g)?.forEach((n) => out.add(n)));
  return out;
}
const numbersIn = (t: string) => (t.match(/\d[\d.,]*\d|\d/g) || []).map((n) => n.replace(/[.,]$/, ''));
/** ¿Todas las cifras nuevas de `next` vienen de la oferta o ya estaban en `before`? */
function safe(before: string, next: string, ok: Set<string>) {
  const had = new Set(numbersIn(before));
  return numbersIn(next).every((n) => had.has(n) || ok.has(n) || ok.has(n.replace(/\./g, '')));
}

/** Todo lo que se puede escribir, en una sola cadena para buscar dentro. */
const flat = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/€|\beuros?\b|\biva\b/g, ' ').replace(/[^a-z0-9ñ,.%]+/g, ' ').replace(/\s+/g, ' ').trim();
function dataBlob(d: Data) {
  const out: string[] = [];
  const walk = (v: unknown) => { if (v == null) return; if (typeof v === 'object') Object.values(v as object).forEach(walk); else out.push(flat(String(v))); };
  walk(d);
  return out.filter(Boolean).join(' | ');
}
const FILLER = /\.{3,}|…+|_{3,}|-{4,}|\[[^\]]*\]|\(\s*\)|\s{6,}/g;
/**
 * Lo que la IA ha metido en cada hueco tiene que salir de los datos: así no puede inventarse un nombre o un DNI.
 * Devuelve el texto con los huecos válidos rellenos (los dudosos se quedan como estaban), o null si no hay ninguno.
 */
function onlyData(before: string, next: string, blob: string): string | null {
  const fillers = before.match(FILLER) || [];
  const parts = before.split(FILLER);
  if (!fillers.length) return !before.trim() && blob.includes(flat(next)) ? next : null;   // celda vacía: el valor entero debe ser un dato
  const esc2 = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
  const m = next.match(new RegExp('^\\s*' + parts.map(esc2).join('([\\s\\S]*?)') + '\\s*$'));
  if (!m) return null;                                                                          // ha cambiado el texto fijo del modelo
  let changed = 0;
  const out = parts.map((part, i) => {
    if (i === parts.length - 1) return part;
    const g = m[i + 1]; const f = flat(g.replace(FILLER, ''));
    const keep = !f || !blob.includes(f);
    if (!keep) changed++;
    return part + (keep ? fillers[i] : g);
  }).join('');
  return changed ? out : null;
}

const RULES = `Reglas:
- Rellena SOLO los huecos (puntos suspensivos, guiones bajos, corchetes, «(en letra)», «(en cifra)», casillas vacías…) con los datos que te doy.
- Mantén todo el texto original del modelo; no lo resumas, no lo traduzcas, no añadas cláusulas.
- Los importes: usa exactamente los de los datos. Si el modelo pide la cifra, usa el formato «texto»; si pide la letra, usa «letra».
- Si un dato es null o no lo tienes (DNI del firmante, por ejemplo), deja ese hueco como está.
- No toques nada que no sea un hueco por rellenar.`;

// ── Word (.docx) ────────────────────────────────────────────────────────────────────────────────────────────────────
const xmlText = (x: string) => (x.match(/<w:t(?:\s[^>]*)?>[^<]*<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, '')).join('').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function fillDocx(p: Project, data: Data, buf: ArrayBuffer): Promise<{ bytes: Uint8Array; fields: number } | null> {
  const entries = await readZip(buf);
  const doc = entries.find((e) => e.name === 'word/document.xml');
  if (!doc) return null;
  const xml = new TextDecoder().decode(doc.data);
  // Los párrafos con cuadros de texto, dibujos u objetos no se tocan: reescribirlos podría romper el documento.
  const paras = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map((m) => ({ raw: m[0], start: m.index!, text: /<w:(txbxContent|drawing|pict|object)\b/.test(m[0]) ? '' : xmlText(m[0]) }));
  const listed = paras.map((q, i) => ({ i, t: q.text })).filter((q) => q.t.trim());
  let block = ''; for (const q of listed) { const l = `[${q.i}] ${q.t}\n`; if (block.length + l.length > 24000) break; block += l; }
  const j = await ai.json<{ edits: { p: number; text: string }[] }>(`Este es el modelo oficial de oferta económica de una licitación (cada línea es un párrafo con su número). Indica qué párrafos hay que completar y cómo quedan, con los datos de la oferta.

Datos de la oferta:
${JSON.stringify(data, null, 1)}

Modelo:
${block}

${RULES}

Devuelve SOLO JSON: {"edits": [{"p": número de párrafo, "text": "texto completo del párrafo ya rellenado"}]}`, { tier: 'default', project: p.isSample ? '' : p.id });
  const ok = allowedNumbers(data); const blob = dataBlob(data);
  const edits = (j?.edits || [])
    .filter((e) => paras[e.p]?.text && typeof e.text === 'string' && e.text.trim())
    .map((e) => ({ p: e.p, text: onlyData(paras[e.p].text, e.text, blob) ?? '' }))
    .filter((e) => e.text && e.text !== paras[e.p].text && safe(paras[e.p].text, e.text, ok))
    .filter((e, i, a) => a.findIndex((x) => x.p === e.p) === i);
  if (!edits.length) return null;
  let out = xml;
  for (const e of [...edits].sort((a, b) => paras[b.p].start - paras[a.p].start)) {
    const q = paras[e.p];
    const pPr = q.raw.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0] ?? '';
    const rPr = q.raw.match(/<w:r[ >][\s\S]*?(<w:rPr>[\s\S]*?<\/w:rPr>)/)?.[1] ?? '';
    const open = q.raw.match(/^<w:p[^>]*>/)![0];
    const lines = e.text.split('\n');
    const runs = lines.map((l, k) => `<w:r>${rPr}${k ? '<w:br/>' : ''}<w:t xml:space="preserve">${esc(l)}</w:t></w:r>`).join('');
    out = out.slice(0, q.start) + `${open}${pPr}${runs}</w:p>` + out.slice(q.start + q.raw.length);
  }
  const next: ZipEntry[] = entries.map((en) => (en.name === 'word/document.xml' ? { name: en.name, data: new TextEncoder().encode(out) } : en));
  return { bytes: writeZip(next), fields: edits.length };
}

// ── Excel (.xlsx) ───────────────────────────────────────────────────────────────────────────────────────────────────
const colNum = (ref: string) => ref.replace(/\d+/g, '').split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0);

async function fillXlsx(p: Project, data: Data, buf: ArrayBuffer): Promise<{ bytes: Uint8Array; fields: number } | null> {
  const entries = await readZip(buf);
  const dec = (n: string) => { const e = entries.find((x) => x.name === n); return e ? new TextDecoder().decode(e.data) : ''; };
  const shared = [...dec('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => (m[1].match(/<t[^>]*>([^<]*)<\/t>/g) || []).map((t) => t.replace(/<[^>]+>/g, '')).join(''));
  const wb = dec('xl/workbook.xml'); const rels = dec('xl/_rels/workbook.xml.rels');
  const sheets = [...wb.matchAll(/<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g)].map((m) => {
    const target = rels.match(new RegExp(`Id="${m[2]}"[^>]*Target="([^"]+)"`))?.[1] || rels.match(new RegExp(`Target="([^"]+)"[^>]*Id="${m[2]}"`))?.[1] || '';
    return { name: m[1], file: 'xl/' + target.replace(/^\/?xl\//, '').replace(/^\//, '') };
  }).filter((x) => entries.some((e) => e.name === x.file));
  let block = '';
  for (const sh of sheets) {
    const x = dec(sh.file); block += `\n## Hoja «${sh.name}» (${sh.file})\n`;
    for (const c of x.matchAll(/<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const t = /t="s"/.test(c[2]) ? shared[Number(c[3]?.match(/<v>(\d+)<\/v>/)?.[1])] ?? '' : (c[3]?.match(/<v>([^<]*)<\/v>/)?.[1] ?? c[3]?.match(/<t[^>]*>([^<]*)<\/t>/)?.[1] ?? '');
      const f = /<f[ >]/.test(c[3] || '');
      if (t || f) block += `${c[1]}: ${f ? '[fórmula]' : t}\n`;
      if (block.length > 24000) break;
    }
  }
  const j = await ai.json<{ cells: { file: string; ref: string; value: string | number }[] }>(`Este es el modelo oficial de oferta económica (Excel) de una licitación. Cada línea es una celda con contenido. Indica qué celdas VACÍAS hay que rellenar con los datos de la oferta (normalmente la celda a la derecha o debajo de su etiqueta).

Datos de la oferta:
${JSON.stringify(data, null, 1)}

Celdas con contenido:
${block}

${RULES}
- No escribas nunca en una celda con [fórmula]. Los importes, como número (12345.67), sin símbolo de euro.

Devuelve SOLO JSON: {"cells": [{"file": "xl/worksheets/sheetN.xml", "ref": "C5", "value": número o texto}]}`, { tier: 'default', project: p.isSample ? '' : p.id });
  const ok = allowedNumbers(data); const blob = dataBlob(data);
  let fields = 0;
  const changed = new Map<string, string>();
  for (const c of j?.cells || []) {
    if (!c?.file || !/^[A-Z]+\d+$/.test(c.ref || '') || c.value == null || c.value === '') continue;
    let x = changed.get(c.file) ?? dec(c.file);
    if (!x) continue;
    const isNum = typeof c.value === 'number' || /^-?\d+(\.\d+)?$/.test(String(c.value));
    if (isNum ? !ok.has(String(Number(c.value))) && !ok.has(Number(c.value).toFixed(2)) : !safe('', String(c.value), ok) || !onlyData('', String(c.value), blob)) continue;
    const re = new RegExp(`<c r="${c.ref}"([^>]*?)(?:/>|>([\\s\\S]*?)</c>)`);
    const cur = x.match(re);
    if (cur && /<f[ >]/.test(cur[2] || '')) continue;                                   // nunca se pisa una fórmula
    if (cur && (cur[2] || '').match(/<v>[^<]+<\/v>|<t[^>]*>[^<]+<\/t>/)) continue;     // ni una celda que ya tiene algo
    const style = (cur?.[1] || '').match(/\ss="\d+"/)?.[0] ?? '';
    const cell = isNum ? `<c r="${c.ref}"${style}><v>${Number(c.value)}</v></c>` : `<c r="${c.ref}"${style} t="inlineStr"><is><t xml:space="preserve">${esc(String(c.value))}</t></is></c>`;
    if (cur) x = x.replace(re, cell);
    else {
      const row = c.ref.replace(/[A-Z]+/, '');
      const rowRe = new RegExp(`(<row [^>]*r="${row}"[^>]*>)([\\s\\S]*?)</row>`);
      const r = x.match(rowRe);
      if (!r) continue;
      const cells = [...r[2].matchAll(/<c r="([A-Z]+)\d+"[\s\S]*?(?:\/>|<\/c>)/g)];
      const after = cells.find((m) => colNum(m[1]) > colNum(c.ref));
      const body = after ? r[2].slice(0, after.index) + cell + r[2].slice(after.index!) : r[2] + cell;
      x = x.replace(rowRe, `${r[1]}${body}</row>`);
    }
    changed.set(c.file, x); fields++;
  }
  if (!fields) return null;
  let wbx = wb.includes('<calcPr') ? wb.replace(/<calcPr([^>]*?)\/>/, (m, a) => (/fullCalcOnLoad/.test(a) ? m : `<calcPr${a} fullCalcOnLoad="1"/>`)) : wb.replace('</workbook>', '<calcPr fullCalcOnLoad="1"/></workbook>');
  const next = entries.filter((e) => e.name !== 'xl/calcChain.xml').map((e) => (changed.has(e.name) ? { name: e.name, data: new TextEncoder().encode(changed.get(e.name)!) } : e.name === 'xl/workbook.xml' ? { name: e.name, data: new TextEncoder().encode(wbx) } : e));
  // calcChain se quita: Excel lo rehace al abrir. Hay que quitar también su referencia.
  const ct = next.find((e) => e.name === '[Content_Types].xml');
  if (ct) ct.data = new TextEncoder().encode(new TextDecoder().decode(ct.data).replace(/<Override[^>]*calcChain[^>]*\/>/, ''));
  const wr = next.find((e) => e.name === 'xl/_rels/workbook.xml.rels');
  if (wr) wr.data = new TextEncoder().encode(new TextDecoder().decode(wr.data).replace(/<Relationship[^>]*calcChain[^>]*\/>/, ''));
  return { bytes: writeZip(next), fields };
}

// ── PDF con campos de formulario ────────────────────────────────────────────────────────────────────────────────────
async function fillPdf(p: Project, data: Data, buf: ArrayBuffer): Promise<{ bytes: Uint8Array; fields: number } | null> {
  const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
  const fields = pdf.getForm().getFields().filter((f): f is PDFTextField => f instanceof PDFTextField);
  if (!fields.length) return null;   // un PDF plano no tiene huecos que se puedan rellenar
  const j = await ai.json<{ fields: { name: string; value: string }[] }>(`Este PDF es el modelo oficial de oferta económica de una licitación y tiene estos campos de formulario:
${fields.map((f) => `- ${f.getName()}${f.getText() ? ` (ahora: ${f.getText()})` : ''}`).join('\n')}

Datos de la oferta:
${JSON.stringify(data, null, 1)}

${RULES}

Devuelve SOLO JSON: {"fields": [{"name": "nombre exacto del campo", "value": "texto"}]}`, { tier: 'default', project: p.isSample ? '' : p.id });
  const ok = allowedNumbers(data); const blob = dataBlob(data);
  let n = 0;
  for (const f of j?.fields || []) {
    const field = fields.find((x) => x.getName() === f.name);
    if (!field || !f.value || field.getText() || !safe('', String(f.value), ok) || !onlyData('', String(f.value), blob)) continue;
    try { field.setText(String(f.value)); n++; } catch { /* campo con formato especial */ }
  }
  return n ? { bytes: await pdf.save(), fields: n } : null;
}

/** Rellena el modelo oficial y lo guarda. Devuelve null si el pliego no tiene un modelo que se pueda rellenar. */
export async function fillOfficialModel(p: Project, s: AppState): Promise<FilledModel | null> {
  if (!p.pricing?.choice || !p.pricing.rule) return null;
  const d = await findModelDoc(p);
  if (!d?.textKey) return null;
  const buf = await getFile(d.textKey);
  if (!buf) return null;
  const ext = extOf(d.name) as FilledModel['ext'];
  const data = dataFor(p, s);
  const r = ext === 'docx' ? await fillDocx(p, data, buf) : ext === 'xlsx' ? await fillXlsx(p, data, buf) : await fillPdf(p, data, buf);
  if (!r) return null;
  const key = `filled:${p.id}:${d.id}`;
  await putFile(key, r.bytes.buffer.slice(r.bytes.byteOffset, r.bytes.byteOffset + r.bytes.byteLength) as ArrayBuffer);
  const base = d.name.replace(/\.[a-z0-9]+$/i, '');
  return { key, name: `${base} (rellenado por PROPO).${ext}`, ext, fields: r.fields, source: d.name, at: nowIso() };
}
