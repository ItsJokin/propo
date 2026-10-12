// Estructura del texto de una sección de propuesta. La IA escribe con un formato mínimo (párrafos, «## » subtítulos,
// «- » viñetas, «1. » pasos y tablas con barras verticales) y este módulo lo convierte en bloques; la pantalla, el PDF
// y el Word pintan los mismos bloques, cada uno a su manera.

export type RichBlock =
  | { type: 'h'; level: 2 | 3; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

const cells = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isRow = (l: string) => /^\s*\|.*\|\s*$/.test(l);
const isRule = (l: string) => /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes('-');

export function richBlocks(content: string): RichBlock[] {
  const out: RichBlock[] = [];
  let para: string[] = [];
  const flush = () => { if (para.length) { out.push({ type: 'p', text: para.join(' ') }); para = []; } };
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) { flush(); continue; }
    const h = l.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flush(); out.push({ type: 'h', level: h[1].length <= 2 ? 2 : 3, text: h[2].replace(/\*\*/g, '').replace(/\s*#+$/, '') }); continue; }
    if (isRow(l)) {
      flush();
      const rows: string[][] = [];
      while (i < lines.length && isRow(lines[i])) { if (!isRule(lines[i])) rows.push(cells(lines[i])); i++; }
      i--;
      if (rows.length > 1) { const n = rows[0].length; out.push({ type: 'table', head: rows[0], rows: rows.slice(1).map((r) => Array.from({ length: n }, (_, k) => r[k] ?? '')) }); }
      else if (rows.length === 1) out.push({ type: 'p', text: rows[0].join(' · ') });
      continue;
    }
    const ul = l.match(/^[-•*]\s+(.*)$/), ol = l.match(/^\d{1,2}[.)]\s+(.*)$/);
    if (ul || ol) {
      flush();
      const type = ul ? 'ul' : 'ol', item = (ul ?? ol)![1];
      const last = out[out.length - 1];
      if (last && last.type === type) last.items.push(item); else out.push({ type, items: [item] });
      continue;
    }
    para.push(l);
  }
  flush();
  return out;
}
