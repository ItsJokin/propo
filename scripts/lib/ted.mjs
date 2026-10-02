// Cliente de la API pública de búsqueda de TED (v3). No necesita clave.
// https://docs.ted.europa.eu/api/latest/ — los nombres de campo son los de eForms.
import { T, A, TED_PROC, winnerIdentity } from '../../shared/schema.mjs';

const SEARCH = 'https://api.ted.europa.eu/v3/notices/search';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const TENDER_FIELDS = ['publication-number', 'notice-title', 'title-proc', 'buyer-name', 'buyer-city', 'classification-cpv', 'main-classification-proc', 'publication-date', 'deadline-receipt-tender-date-lot', 'deadline-receipt-tender-time-lot', 'estimated-value-proc', 'estimated-value-lot', 'place-of-performance', 'buyer-country-sub', 'contract-nature-main-proc', 'procedure-type', 'description-proc', 'internal-identifier-proc', 'duration-period-value-lot', 'duration-period-unit-lot', 'document-url-lot'];
export const AWARD_FIELDS = ['publication-number', 'title-proc', 'buyer-name', 'classification-cpv', 'main-classification-proc', 'publication-date', 'winner-name', 'winner-identifier', 'winner-size', 'tender-value', 'tender-value-lowest', 'tender-value-highest', 'received-submissions-type-val', 'received-submissions-type-code', 'result-value-notice', 'total-value', 'place-of-performance', 'buyer-country-sub', 'contract-nature-main-proc', 'winner-decision-date', 'contract-conclusion-date', 'duration-period-value-lot', 'duration-period-unit-lot', 'procedure-type', 'internal-identifier-proc'];

/** Texto en español de un campo multilingüe de TED. */
export const spa = (v) => v == null ? '' : typeof v === 'string' ? v : Array.isArray(v) ? spa(v[0]) : spa(v.spa ?? v.eng ?? Object.values(v)[0]);
const list = (v) => v == null ? [] : Array.isArray(v) ? v : typeof v === 'object' ? list(v.spa ?? v.eng ?? Object.values(v)[0]) : [v];
const day = (s) => String(s || '').slice(0, 10);
const clean = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
const money = (v) => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0; };
const nutsOf = (n) => list(n['place-of-performance']).find((x) => /^ES\d/.test(x)) || list(n['buyer-country-sub']).find((x) => /^ES\d/.test(x)) || list(n['place-of-performance'])[0] || '';
const NATURE = { services: 'services', supplies: 'supplies', works: 'works' };
const durMonths = (n) => { const v = parseFloat(list(n['duration-period-value-lot'])[0]); const u = list(n['duration-period-unit-lot'])[0]; return !v ? 0 : Math.round((u === 'YEAR' ? v * 12 : u === 'DAY' ? v / 30 : u === 'WEEK' ? v / 4.3 : v) * 10) / 10; };

export async function tedSearch(query, fields, { fetchImpl = fetch, limit = 250, maxPages = 60, pauseMs = 350, log = () => {} } = {}) {
  const out = [];
  for (let page = 1; page <= maxPages; page++) {
    let json = null;
    for (let attempt = 0; attempt < 5 && !json; attempt++) {
      const r = await fetchImpl(SEARCH, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, fields, limit, page, scope: 'ALL', paginationMode: 'PAGE_NUMBER' }), signal: AbortSignal.timeout(60000) }).catch((e) => ({ ok: false, status: 0, _e: e }));
      if (r.ok) json = await r.json();
      else if (r.status === 429 || r.status >= 500 || r.status === 0) { log(`TED ${r.status || r._e?.message}; reintento ${attempt + 1}`); await sleep(2000 * (attempt + 1)); }
      else throw new Error(`TED respondió ${r.status}: ${(await r.text()).slice(0, 200)}`);
    }
    if (!json) throw new Error('TED no responde');
    const notices = json.notices || [];
    out.push(...notices);
    if (notices.length < limit) break;
    await sleep(pauseMs);
  }
  return out;
}

export function tedTenderRow(n, today) {
  const dates = list(n['deadline-receipt-tender-date-lot']).map(day).filter((d) => d >= today).sort();
  if (!dates.length) return null;
  const time = String(list(n['deadline-receipt-tender-time-lot'])[0] || '').slice(0, 5);
  const full = spa(n['notice-title']);
  const parts = full.split(' – ');
  const title = clean(spa(n['title-proc']) || parts.slice(2).join(' – ') || full, 200);
  const desc = clean(spa(n['description-proc']), 180);
  const lots = list(n['estimated-value-lot']).map(money);
  const id = String(n['publication-number']);
  const docs = [...new Set(list(n['document-url-lot']).filter((u) => /^https?:/.test(u)))].slice(0, 3);
  const row = [];
  row[T.id] = `t:${id}`; row[T.title] = title; row[T.buyer] = clean(spa(n['buyer-name']), 140); row[T.city] = clean(spa(n['buyer-city']), 60);
  row[T.cpv] = [...new Set([...list(n['main-classification-proc']), ...list(n['classification-cpv'])].map(String))].slice(0, 8);
  row[T.deadline] = /^\d\d:\d\d$/.test(time) ? `${dates[0]}T${time}` : dates[0];
  row[T.value] = money(n['estimated-value-proc']) || Math.round(lots.reduce((a, b) => a + b, 0) * 100) / 100;
  row[T.nuts] = nutsOf(n); row[T.pub] = day(n['publication-date']); row[T.nature] = NATURE[spa(n['contract-nature-main-proc'])] || '';
  row[T.url] = `https://ted.europa.eu/es/notice/-/detail/${id}`;
  row[T.docs] = docs.length ? docs.map((u) => ['Documentos de la licitación (portal del órgano)', u, 'otro']) : 0;
  row[T.crit] = 0; row[T.ref] = clean(spa(n['internal-identifier-proc']), 60); row[T.proc] = TED_PROC[spa(n['procedure-type'])] || '';
  row[T.dur] = durMonths(n); row[T.label] = parts.length >= 3 ? clean(parts[1], 90) : ''; row[T.reqs] = 0; row[T.budget] = 0;
  row[T.lots] = lots.length > 1 ? lots.length : 0; row[T.desc] = desc && !desc.toLowerCase().startsWith(title.toLowerCase().slice(0, 50)) ? desc : '';
  return row;
}

export function tedAward(n) {
  const names = list(n['winner-name']).map((x) => clean(x, 140)).filter(Boolean);
  if (!names.length) return null;
  const ids = list(n['winner-identifier']); const sizes = list(n['winner-size']);
  const aligned = ids.length === names.length;
  const seen = new Set(); const winners = [];
  names.forEach((name, i) => {
    const [nm, nif] = winnerIdentity(name, aligned ? ids[i] : names.length === 1 ? ids[0] : '');
    const key = nif || nm.toLowerCase();
    if (seen.has(key)) return; seen.add(key);
    const size = sizes.length === names.length ? sizes[i] : sizes[0];
    winners.push([nm, nif, size === 'sme' || size === 'micro' || size === 'small' || size === 'medium' ? 1 : size === 'large' ? 0 : -1]);
  });
  const codes = list(n['received-submissions-type-code']); const vals = list(n['received-submissions-type-val']).map((v) => parseInt(v, 10) || 0);
  const avg = (code) => { const xs = codes.map((c, i) => c === code ? vals[i] : null).filter((x) => x != null); return xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null; };
  const tv = list(n['tender-value']).map(money).filter(Boolean);
  const low = list(n['tender-value-lowest']).map(money).filter(Boolean); const high = list(n['tender-value-highest']).map(money).filter(Boolean);
  const id = String(n['publication-number']);
  const row = [];
  row[A.id] = `t:${id}`; row[A.date] = day(list(n['winner-decision-date'])[0] || list(n['contract-conclusion-date'])[0] || n['publication-date']);
  row[A.title] = clean(spa(n['title-proc']), 220); row[A.buyer] = -1;
  row[A.cpv] = String(list(n['main-classification-proc'])[0] || list(n['classification-cpv'])[0] || ''); row[A.nuts] = nutsOf(n);
  row[A.nature] = NATURE[spa(n['contract-nature-main-proc'])] || ''; row[A.proc] = TED_PROC[spa(n['procedure-type'])] || '';
  row[A.offers] = avg('tenders') ?? 0; row[A.sme] = avg('t-sme') ?? -1; row[A.budget] = 0;
  row[A.amount] = money(n['result-value-notice']) || money(n['total-value']) || Math.round(tv.reduce((a, b) => a + b, 0) * 100) / 100;
  row[A.low] = low.length === 1 ? low[0] : 0; row[A.high] = high.length === 1 ? high[0] : 0; row[A.winners] = [];
  row[A.dur] = durMonths(n); row[A.start] = ''; row[A.ref] = clean(spa(n['internal-identifier-proc']), 60);
  return { row, buyer: clean(spa(n['buyer-name']), 140), winners };
}

export const openTendersQuery = (todayYMD) => `buyer-country=ESP AND notice-type IN (cn-standard cn-social) AND deadline-receipt-tender-date-lot>=${todayYMD}`;
export const awardsQuery = (fromYMD, toYMD) => `buyer-country=ESP AND notice-type IN (can-standard can-social) AND publication-date>=${fromYMD} AND publication-date<=${toYMD}`;
