// Código de referencia (producción) — cliente de la API de búsqueda de TED (v3).
// TED (Tenders Electronic Daily) publica los anuncios europeos de contratación pública.
// La búsqueda anónima no necesita clave. Documentación: https://docs.ted.europa.eu/api/latest/
//
// En el MVP navegable, src/lib/discovery/tedSnapshot.ts contiene una instantánea REAL de esta
// misma API (30/09/2026). En producción, `syncTed()` se ejecuta cada día desde un job programado
// (ver ./sync.ts) y guarda los anuncios en la tabla `opportunities`.
//
// Nota: confirma los nombres exactos de los campos con la documentación vigente de TED antes de
// desplegar; la API evoluciona con las versiones de eForms.

const TED_SEARCH = 'https://api.ted.europa.eu/v3/notices/search';

export const TED_FIELDS = [
  'publication-number',
  'notice-title',
  'notice-type',
  'buyer-name',
  'buyer-city',
  'classification-cpv',
  'place-of-performance',
  'publication-date',
  'deadline-receipt-tender-date-lot',
  'estimated-value-lot',
  'contract-nature',
] as const;

export interface Opportunity {
  source: 'ted' | 'placsp';
  externalId: string;
  title: string;
  buyer: string;
  city: string | null;
  cpv: string[];
  nuts: string[];
  publishedAt: string | null;
  deadline: string | null;
  valueEur: number | null;
  kind: string | null;
  url: string;
  raw: unknown;
}

const first = (v: any, lang = 'spa'): string => {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return first(v[0], lang);
  if (typeof v === 'object') return first(v[lang] ?? v.spa ?? v.eng ?? Object.values(v)[0], lang);
  return String(v);
};
const list = (v: any): string[] => (Array.isArray(v) ? v.map(String) : v ? [String(v)] : []);

export function normalizeTed(n: any): Opportunity {
  const id = String(n['publication-number']);
  const value = Number(list(n['estimated-value-lot'])[0]);
  return {
    source: 'ted',
    externalId: id,
    title: first(n['notice-title']),
    buyer: first(n['buyer-name']),
    city: first(n['buyer-city']) || null,
    cpv: [...new Set(list(n['classification-cpv']))],
    nuts: [...new Set(list(n['place-of-performance']))],
    publishedAt: list(n['publication-date'])[0]?.slice(0, 10) ?? null,
    deadline: list(n['deadline-receipt-tender-date-lot'])[0] ?? null,
    valueEur: Number.isFinite(value) && value > 0 ? value : null, // nunca inventamos importes
    kind: first(n['notice-type']) || null,
    url: `https://ted.europa.eu/es/notice/-/detail/${id}`,
    raw: n,
  };
}

/** Anuncios publicados en España desde `sinceYYYYMMDD` (consulta experta de TED). */
export async function* searchTed(sinceYYYYMMDD: string, opts: { pageSize?: number; maxPages?: number; fetchImpl?: typeof fetch } = {}) {
  const f = opts.fetchImpl ?? fetch;
  const limit = opts.pageSize ?? 100;
  let iterationToken: string | undefined;
  for (let page = 1; page <= (opts.maxPages ?? 50); page++) {
    const body: Record<string, unknown> = {
      query: `place-of-performance IN (ESP) AND publication-date >= ${sinceYYYYMMDD}`,
      fields: TED_FIELDS,
      limit,
      scope: 'ACTIVE',
      paginationMode: 'ITERATION',
      ...(iterationToken ? { iterationNextToken: iterationToken } : {}),
    };
    const res = await withRetry(() => f(TED_SEARCH, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) }));
    if (!res.ok) throw new Error(`ted_search_failed ${res.status}`);
    const json: any = await res.json();
    for (const n of json.notices ?? []) yield normalizeTed(n);
    iterationToken = json.iterationNextToken;
    if (!iterationToken || (json.notices ?? []).length < limit) return;
  }
}

async function withRetry(fn: () => Promise<Response>, tries = 4): Promise<Response> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fn();
      if (r.status !== 429 && r.status < 500) return r;
      last = new Error(`HTTP ${r.status}`);
    } catch (e) { last = e; }
    await new Promise((ok) => setTimeout(ok, 500 * 2 ** i));
  }
  throw last;
}
