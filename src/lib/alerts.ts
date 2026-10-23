// Coincidencias de una alerta de licitaciones: la misma regla en la web y en el correo diario (scripts/alerts/send.ts).
import type { TenderAlert } from './types';
import type { TedNotice } from './discovery/tedSnapshot';
import { inProvince } from './discovery/match';
import { normalize, daysUntil } from './util';

const hay = new WeakMap<TedNotice, string>();
export const haystack = (t: TedNotice) => { let h = hay.get(t); if (!h) { h = normalize(`${t.title} ${t.buyer} ${t.desc} ${t.kind} ${t.city} ${t.live?.ref ?? ''} ${t.cpv.join(' ')}`); hay.set(t, h); } return h; };

/** Licitaciones abiertas que cumplen una alerta (sector, zona y palabras). */
export function alertHits<X extends { t: TedNotice }>(a: TenderAlert, rows: X[]): X[] {
  const aw = normalize(a.query || '').split(' ').filter(Boolean);
  return rows.filter(({ t }) => (!t.deadline || (daysUntil(t.deadline) ?? -1) >= 0) && (!a.sector || t.sector === a.sector) && (!a.region || t.nuts.startsWith(a.region)) && (!a.province || inProvince(t.nuts, a.region, a.province)) && aw.every((w) => haystack(t).includes(w)));
}
