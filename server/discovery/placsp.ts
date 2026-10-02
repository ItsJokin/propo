// Código de referencia (producción) — Plataforma de Contratación del Sector Público (PLACSP).
// PLACSP publica sus licitaciones como fuentes ATOM paginadas con entradas en formato CODICE.
// Fuente de perfiles de contratante (actualizada varias veces al día):
//   https://contrataciondelsectorpublico.gob.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3.atom
// Cada página enlaza a la anterior con <link rel="next">. Se recorre hasta llegar a entradas ya
// sincronizadas (por `updated`). No está en el MVP navegable: el entorno de la demo no tiene acceso
// de red a PLACSP, así que el buscador solo muestra la instantánea real de TED.
import { XMLParser } from 'fast-xml-parser';
import type { Opportunity } from './ted';

export const PLACSP_FEED = 'https://contrataciondelsectorpublico.gob.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3.atom';

const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, isArray: (n: string) => ['entry', 'link', 'RequiredCommodityClassification', 'ProcurementProjectLot'].includes(n) });

const txt = (v: any): string => (v == null ? '' : typeof v === 'object' ? String(v['#text'] ?? '') : String(v));

export function normalizePlacsp(entry: any): Opportunity | null {
  const st = entry.ContractFolderStatus;
  if (!st) return null;
  const proj = st.ProcurementProject ?? {};
  const party = st.LocatedContractingParty?.Party ?? {};
  const deadline = st.TenderingProcess?.TenderSubmissionDeadlinePeriod;
  const cpv = (proj.RequiredCommodityClassification ?? []).map((c: any) => txt(c.ItemClassificationCode)).filter(Boolean);
  const value = Number(txt(proj.BudgetAmount?.EstimatedOverallContractAmount));
  const link = (entry.link ?? []).find((l: any) => l['@_href'])?.['@_href'];
  return {
    source: 'placsp',
    externalId: txt(st.ContractFolderID) || txt(entry.id),
    title: txt(proj.Name) || txt(entry.title),
    buyer: txt(party.PartyName?.Name),
    city: txt(party.PostalAddress?.CityName) || null,
    cpv,
    nuts: [txt(proj.RealizedLocation?.CountrySubentityCode)].filter(Boolean),
    publishedAt: txt(entry.updated).slice(0, 10) || null,
    deadline: deadline?.EndDate ? `${txt(deadline.EndDate)}${deadline.EndTime ? 'T' + txt(deadline.EndTime) : ''}` : null,
    valueEur: Number.isFinite(value) && value > 0 ? value : null,
    kind: txt(st.ContractFolderStatusCode) || null, // PUB, EV, ADJ, RES, ANUL…
    url: link ?? PLACSP_FEED,
    raw: entry,
  };
}

/** Recorre la fuente desde la página más reciente hasta `sinceIso`. */
export async function* readPlacsp(sinceIso: string, opts: { maxPages?: number; fetchImpl?: typeof fetch } = {}) {
  const f = opts.fetchImpl ?? fetch;
  let url: string | undefined = PLACSP_FEED;
  for (let page = 0; url && page < (opts.maxPages ?? 200); page++) {
    const res = await f(url, { headers: { accept: 'application/atom+xml' } });
    if (!res.ok) throw new Error(`placsp_feed_failed ${res.status}`);
    const feed = parser.parse(await res.text()).feed;
    let reachedOld = false;
    for (const e of feed.entry ?? []) {
      if (txt(e.updated) < sinceIso) { reachedOld = true; continue; }
      const o = normalizePlacsp(e);
      if (o && o.kind === 'PUB') yield o; // solo licitaciones abiertas (en plazo)
    }
    if (reachedOld) return;
    url = (feed.link ?? []).find((l: any) => l['@_rel'] === 'next')?.['@_href'];
  }
}
