// Steps 3-5: chunking, metadata and retrieval.
// MVP: lexical BM25 in the browser. Production: embeddings in pgvector + BM25 hybrid
// search, always filtered by workspace_id and project_id (tenant isolation).
import { tokens, normalize } from '../util';

export interface Passage {
  id: string;
  docId: string;
  docName: string;
  page: number;
  text: string;
}

export function chunkPages(docId: string, docName: string, pages: string[], size = 900): Passage[] {
  const out: Passage[] = [];
  pages.forEach((pageText, i) => {
    const paras = pageText.split(/\n+/);
    let cur = '';
    let n = 0;
    const flush = () => {
      if (cur.trim().length > 20) out.push({ id: `${docId}:${i + 1}:${n++}`, docId, docName, page: i + 1, text: cur.trim() });
      cur = '';
    };
    for (const p of paras) {
      if ((cur + ' ' + p).length > size) flush();
      cur += (cur ? '\n' : '') + p;
    }
    flush();
  });
  return out;
}

export function search(passages: Passage[], query: string, k = 6): Passage[] {
  const q = [...new Set(tokens(query))];
  if (!q.length || !passages.length) return [];
  const docs = passages.map((p) => tokens(p.text));
  const avg = docs.reduce((a, d) => a + d.length, 0) / docs.length || 1;
  const df = new Map<string, number>();
  q.forEach((t) => df.set(t, docs.filter((d) => d.includes(t)).length));
  const N = docs.length;
  const scored = passages.map((p, i) => {
    const d = docs[i];
    let s = 0;
    for (const t of q) {
      const f = d.filter((x) => x === t).length;
      if (!f) continue;
      const idf = Math.log(1 + (N - (df.get(t) || 0) + 0.5) / ((df.get(t) || 0) + 0.5));
      s += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (d.length / avg))));
    }
    return { p, s };
  });
  return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, k).map((x) => x.p);
}

/** Step 8 (validation): is the quoted text actually on the cited page? */
export function quoteOnPage(pageText: string | undefined, quote: string | undefined): boolean {
  if (!pageText || !quote) return false;
  const P = normalize(pageText);
  const Q = normalize(quote);
  if (!Q) return false;
  if (P.includes(Q)) return true;
  // tolerate line breaks, hyphenation and small paraphrases: token overlap
  const qt = Q.split(' ').filter((t) => t.length > 3);
  if (!qt.length) return false;
  const pt = new Set(P.split(' '));
  const hit = qt.filter((t) => pt.has(t)).length;
  return hit / qt.length >= 0.8;
}
