// Lector del feed ATOM (formato CODICE) de la Plataforma de Contratación del Sector Público.
// Sirve para los dos conjuntos de datos abiertos: perfiles alojados en la Plataforma (sindicación 643)
// y plataformas autonómicas agregadas (sindicación 1044). Sin dependencias: extrae con expresiones
// regulares solo los campos que PROPO usa. Nunca inventa un dato: lo que no consta queda vacío o a 0.
import { T, A, NATURES, PROCEDURES, winnerIdentity } from '../../shared/schema.mjs';

const dec = (s) => String(s ?? '')
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const clean = (s, max = 400) => dec(s).replace(/\s+/g, ' ').trim().slice(0, max);
const re = (name, flags = '') => new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, flags);
export const tag = (xml, name) => { const m = xml.match(re(name)); return m ? m[1] : ''; };
export const all = (xml, name) => [...xml.matchAll(re(name, 'g'))].map((m) => m[1]);
const num = (s) => { const n = parseFloat(dec(s)); return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0; };
const months = (xml) => {
  const m = xml.match(/<cbc:DurationMeasure[^>]*unitCode="(\w+)"[^>]*>([\d.]+)</);
  if (!m) return 0;
  const v = parseFloat(m[2]);
  return Math.round((m[1] === 'ANN' ? v * 12 : m[1] === 'DAY' ? v / 30 : v) * 10) / 10;
};

/** Divide un fichero ATOM en entradas, borrados y el enlace al fichero anterior. */
export function splitFeed(xml) {
  const entries = xml.split('<entry').slice(1).map((x) => x.slice(x.indexOf('>') + 1).split('</entry>')[0]);
  const deleted = [...xml.matchAll(/<at:deleted-entry[^>]*ref="([^"]+)"/g)].map((m) => m[1].split('/').pop());
  const next = (xml.match(/<link[^>]*href="([^"]+)"[^>]*rel="next"/) || xml.match(/<link[^>]*rel="next"[^>]*href="([^"]+)"/) || [])[1] || '';
  return { entries, deleted, next: dec(next) };
}

/** Convierte una entrada en un objeto intermedio con todo lo que PROPO necesita. */
export function parseEntry(e) {
  const id = clean(tag(e, 'id')).split('/').pop();
  const url = dec((e.match(/<link[^>]*href="([^"]+)"/) || [])[1] || '');
  const updatedRaw = clean(tag(e, 'updated'));
  const updatedMs = Date.parse(updatedRaw);
  const updated = Number.isFinite(updatedMs) ? new Date(updatedMs).toISOString() : '';
  const status = clean(tag(e, 'cbc-place-ext:ContractFolderStatusCode'));
  const lcp = tag(e, 'cac-place-ext:LocatedContractingParty');
  const party = tag(lcp, 'cac:Party');
  const rest = e.slice(e.indexOf('</cac-place-ext:LocatedContractingParty>') + 1);
  const project = tag(rest, 'cac:ProcurementProject');
  const budget = tag(project, 'cac:BudgetAmount');
  const process = tag(rest, 'cac:TenderingProcess');
  const deadline = tag(process, 'cac:TenderSubmissionDeadlinePeriod');
  const dDate = clean(tag(deadline, 'cbc:EndDate')).slice(0, 10);
  const dTime = clean(tag(deadline, 'cbc:EndTime')).slice(0, 5);
  const docsOf = (name, kind) => all(rest, name).map((d) => [clean(tag(d, 'cbc:ID') || tag(d, 'cbc:FileName'), 120), dec(tag(d, 'cbc:URI')).trim(), kind]).filter((d) => d[1]);
  const lots = all(rest, 'cac:ProcurementProjectLot').map((l) => {
    const lp = tag(l, 'cac:ProcurementProject');
    return { id: clean(tag(l, 'cbc:ID'), 20), name: clean(tag(lp, 'cbc:Name'), 160), budget: num(tag(tag(lp, 'cac:BudgetAmount'), 'cbc:TaxExclusiveAmount')), cpv: clean(tag(lp, 'cbc:ItemClassificationCode'), 8) };
  });
  const results = all(rest, 'cac:TenderResult').map((r) => {
    const win = tag(r, 'cac:WinningParty');
    const awarded = tag(r, 'cac:AwardedTenderedProject');
    const sme = clean(tag(r, 'cbc:SMEAwardedIndicator'));
    const smeOffers = clean(tag(r, 'cbc:SMEsReceivedTenderQuantity'));
    return {
      code: clean(tag(r, 'cbc:ResultCode')),
      date: clean(tag(r, 'cbc:AwardDate')).slice(0, 10),
      offers: parseInt(clean(tag(r, 'cbc:ReceivedTenderQuantity')), 10) || 0,
      smeOffers: smeOffers === '' ? -1 : parseInt(smeOffers, 10) || 0,
      low: num(tag(r, 'cbc:LowerTenderAmount')), high: num(tag(r, 'cbc:HigherTenderAmount')),
      start: clean(tag(r, 'cbc:StartDate')).slice(0, 10),
      lot: clean(tag(awarded, 'cbc:ProcurementProjectLotID'), 20),
      amount: num(tag(tag(awarded, 'cac:LegalMonetaryTotal'), 'cbc:TaxExclusiveAmount')),
      winner: win ? { name: clean(tag(tag(win, 'cac:PartyName'), 'cbc:Name'), 140), id: clean(tag(tag(win, 'cac:PartyIdentification'), 'cbc:ID'), 20), sme: sme === 'true' ? 1 : sme === 'false' ? 0 : -1 } : null,
    };
  });
  const qual = tag(rest, 'cac:TendererQualificationRequest');
  const reqs = [
    ...all(qual, 'cac:TechnicalEvaluationCriteria').map((x) => clean(tag(x, 'cbc:Description'), 320)),
    ...all(qual, 'cac:FinancialEvaluationCriteria').map((x) => clean(tag(x, 'cbc:Description'), 320)),
    ...all(qual, 'cac:SpecificTendererRequirement').map((x) => clean(tag(x, 'cbc:Description'), 200)),
  ].filter(Boolean);
  const typeCode = clean(tag(project, 'cbc:TypeCode'));
  return {
    id, url, updated, status,
    title: clean(tag(e, 'title'), 200) || clean(tag(project, 'cbc:Name'), 200),
    ref: clean(tag(e, 'cbc:ContractFolderID'), 60),
    buyer: clean(tag(tag(party, 'cac:PartyName'), 'cbc:Name'), 140),
    city: clean(tag(party, 'cbc:CityName'), 60),
    cpv: [...new Set(all(project, 'cbc:ItemClassificationCode').map((c) => clean(c, 8)).filter((c) => /^\d{8}$/.test(c)))].slice(0, 8),
    nuts: clean(tag(project, 'cbc:CountrySubentityCode'), 8),
    place: clean(tag(tag(project, 'cac:RealizedLocation'), 'cbc:CityName'), 60),
    nature: NATURES[typeCode] || '',
    budget: num(tag(budget, 'cbc:TaxExclusiveAmount')),
    estimated: num(tag(budget, 'cbc:EstimatedOverallContractAmount')),
    dur: months(project),
    proc: PROCEDURES[clean(tag(process, 'cbc:ProcedureCode'))] || '',
    deadline: dDate ? (dTime ? `${dDate}T${dTime}` : dDate) : '',
    crit: all(rest, 'cac:AwardingCriteria').map((c) => [clean(tag(c, 'cbc:AwardingCriteriaTypeCode'), 6) || 'OBJ', clean(tag(c, 'cbc:Description'), 160), parseFloat(clean(tag(c, 'cbc:WeightNumeric'))) || 0]).filter((c) => c[1]).filter((c, i, a) => a.findIndex((x) => x[0] === c[0] && x[1] === c[1] && x[2] === c[2]) === i).slice(0, 24),
    reqs: [...new Set(reqs)].slice(0, 16),
    docs: [...docsOf('cac:LegalDocumentReference', 'pcap'), ...docsOf('cac:TechnicalDocumentReference', 'ppt'), ...docsOf('cac:AdditionalDocumentReference', 'otro')].slice(0, 12),
    lots, results,
  };
}

/** Fila de licitación abierta (formato T) o null si la entrada no está en plazo. */
export function tenderRow(p, prefix, today) {
  if (p.status !== 'PUB') return null;
  if (p.deadline && p.deadline.slice(0, 10) < today) return null;
  const row = [];
  row[T.id] = `${prefix}:${p.id}`; row[T.title] = p.title; row[T.buyer] = p.buyer; row[T.city] = p.place || p.city;
  row[T.cpv] = p.cpv; row[T.deadline] = p.deadline; row[T.value] = p.estimated || p.budget; row[T.nuts] = p.nuts;
  row[T.pub] = p.updated.slice(0, 10); row[T.nature] = p.nature; row[T.url] = p.url;
  row[T.docs] = p.docs.length ? p.docs : 0; row[T.crit] = p.crit.length ? p.crit : 0; row[T.ref] = p.ref; row[T.proc] = p.proc;
  row[T.dur] = p.dur; row[T.label] = ''; row[T.reqs] = p.reqs.length ? p.reqs : 0; row[T.budget] = p.budget; row[T.lots] = p.lots.length; row[T.desc] = '';
  return row;
}

/** Adjudicaciones de una entrada: una por lote con adjudicatario. Devuelve objetos {row, buyer, winner}. */
export function awardRows(p, prefix) {
  const out = [];
  const single = p.lots.length === 0;
  for (const r of p.results) {
    if (!r.winner || !r.winner.name || !['2', '8', '9'].includes(r.code)) continue;
    const lot = p.lots.find((l) => l.id === r.lot);
    const date = r.date || p.updated.slice(0, 10);
    const row = [];
    row[A.id] = `${prefix}:${p.id}#${r.lot || '0'}`; row[A.date] = date;
    row[A.title] = lot && lot.name && lot.name !== p.title ? `${p.title} — ${lot.name}`.slice(0, 220) : p.title;
    row[A.buyer] = -1; row[A.cpv] = (lot && lot.cpv) || p.cpv[0] || ''; row[A.nuts] = p.nuts; row[A.nature] = p.nature; row[A.proc] = p.proc;
    row[A.offers] = r.offers; row[A.sme] = r.smeOffers;
    row[A.budget] = lot ? lot.budget : single ? p.budget : 0;
    row[A.amount] = r.amount; row[A.low] = r.low; row[A.high] = r.high; row[A.winners] = [];
    row[A.dur] = p.dur; row[A.start] = r.start; row[A.ref] = p.ref;
    const [name, nif] = winnerIdentity(r.winner.name, r.winner.id);
    out.push({ row, buyer: p.buyer, winners: [[name, nif, r.winner.sme]] });
  }
  return out;
}
