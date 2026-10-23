// Coincidencias de una alerta de licitaciones: la misma regla en la web y en el correo diario (scripts/alerts/send.ts).
import type { TenderAlert, CompanyInfo } from './types';
import type { TedNotice } from './discovery/tedSnapshot';
import { inProvince } from './discovery/match';
import { normalize, daysUntil } from './util';

const hay = new WeakMap<TedNotice, string>();
export const haystack = (t: TedNotice) => { let h = hay.get(t); if (!h) { h = normalize(`${t.title} ${t.buyer} ${t.desc} ${t.kind} ${t.city} ${t.live?.ref ?? ''} ${t.cpv.join(' ')}`); hay.set(t, h); } return h; };

/** Licitaciones abiertas que cumplen una alerta (sector, zona y palabras). Lo que la alerta deja sin filtrar se toma
 *  del perfil de la empresa (sus CPV y sus zonas): una alerta sin filtros es «las compatibles conmigo», no «todas». */
export function alertHits<X extends { t: TedNotice }>(a: TenderAlert, rows: X[], company?: Pick<CompanyInfo, 'cpvs' | 'regions'>): X[] {
  const aw = normalize(a.query || '').split(' ').filter(Boolean);
  const cpvs = !a.sector && !aw.length ? company?.cpvs ?? [] : [];
  const regions = !a.region ? company?.regions ?? [] : [];
  return rows.filter(({ t }) => (!t.deadline || (daysUntil(t.deadline) ?? -1) >= 0) && (!a.sector || t.sector === a.sector) && (!a.region || t.nuts.startsWith(a.region)) && (!a.province || inProvince(t.nuts, a.region, a.province)) && aw.every((w) => haystack(t).includes(w))
    && (!cpvs.length || t.cpv.some((c) => cpvs.some((p) => c.startsWith(p)))) && (!regions.length || regions.some((r) => t.nuts.startsWith(r))));
}
