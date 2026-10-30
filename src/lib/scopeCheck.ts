// Comprobaciones sin IA de lo que la IA cuenta sobre el pliego: en qué página está cada frase y qué palabras no aparecen en él.
import { normalize } from './util';

export interface PliegoPage { docId: string; doc: string; page: number; norm: string }
export interface Corpus { pages: PliegoPage[]; prefixes: Set<string>; numbers: Set<string> }

export function buildCorpus(docs: { id: string; name: string; pages: string[] }[]): Corpus {
  const pages: PliegoPage[] = []; const prefixes = new Set<string>(); const numbers = new Set<string>();
  for (const d of docs) d.pages.forEach((t, i) => {
    const norm = normalize(t ?? ''); if (!norm) return;
    pages.push({ docId: d.id, doc: d.name, page: i + 1, norm });
    for (const w of norm.split(' ')) {
      if (/^\d+$/.test(w)) numbers.add(w);
      else if (w.length >= 5) prefixes.add(w.slice(0, 5));
    }
  });
  return { pages, prefixes, numbers };
}

/** La página donde está de verdad una frase citada. Empieza por la que indica la IA, pero manda lo que pone el documento. */
export function locate(c: Corpus, quote: string, hint?: { doc?: string; page?: number | null }): PliegoPage | null {
  const q = normalize(quote); const words = q.split(' ');
  if (words.length < 3) return null;
  const tries = words.length > 5 ? [q, words.slice(0, 5).join(' ')] : [q];   // el texto de los PDF a veces se corta a media frase
  const hd = normalize(hint?.doc ?? '');
  const score = (p: PliegoPage) => (hd && normalize(p.doc) === hd ? 2 : 0) + (p.page === hint?.page ? 1 : 0);
  const order = [...c.pages].sort((a, b) => score(b) - score(a));
  for (const t of tries) { const hit = order.find((p) => p.norm.includes(t)); if (hit) return hit; }
  return null;
}

// Palabras de la propia redacción, que no tienen por qué estar en el pliego
const GENERIC = new Set(['tienes', 'tendras', 'tendra', 'hacer', 'habra', 'hacen', 'hemos', 'ganas', 'ganamos', 'deben', 'puede', 'pueden', 'siempre', 'ademas', 'tambien', 'todos', 'todas', 'cada', 'entre', 'durante', 'despues', 'antes', 'mismo', 'misma', 'mismos', 'mismas', 'otros', 'otras', 'cubre', 'cubren', 'incluye', 'incluyen', 'incluido', 'incluida', 'incluidos', 'incluidas', 'indica', 'indican', 'presupuesto', 'previsto', 'prevista', 'pliego', 'empresa', 'cliente']);

/** Palabras y cifras del texto que no aparecen en ningún documento del pliego (se aceptan variantes: «sushis», «estaciones»). */
export function unknownTerms(c: Corpus, text: string): string[] {
  const out: string[] = [];
  for (const raw of text.match(/[\p{L}\p{N}]+/gu) ?? []) {
    const w = normalize(raw); if (!w || GENERIC.has(w)) continue;
    const known = /^\d+$/.test(w) ? w.length < 2 || c.numbers.has(w) : w.length < 5 || c.prefixes.has(w.slice(0, 5));
    if (!known && !out.includes(raw)) out.push(raw);
  }
  return out;
}

/** Las páginas donde están las palabras poco comunes de una descripción («escudella», «sushi»): la IA no siempre las cita todas. */
export function pagesForTerms(c: Corpus, text: string, maxPerTerm = 2): { page: PliegoPage; term: string }[] {
  const out: { page: PliegoPage; term: string }[] = [];
  const seen = new Set<string>();
  for (const raw of text.match(/[\p{L}]{5,}/gu) ?? []) {
    const w = normalize(raw); if (seen.has(w) || GENERIC.has(w)) continue; seen.add(w);
    const re = new RegExp(`\\b${w}`);
    const hits = c.pages.filter((p) => re.test(p.norm));
    if (!hits.length || hits.length > maxPerTerm) continue;   // en muchas páginas no es una palabra que identifique nada
    hits.forEach((page) => { if (!out.some((o) => o.page === page)) out.push({ page, term: raw }); });
  }
  return out;
}

