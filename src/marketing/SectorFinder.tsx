// Portada: cuántas licitaciones abiertas hay hoy (dato real) y qué movimiento tiene el sector del visitante.
// Sin engañar y sin dejar a nadie con un «0»: se enseña su zona, pero también su comunidad y toda España, lo que se
// ha publicado este último mes y lo que se ha adjudicado, porque una empresa no vive solo de lo abierto hoy en su provincia.
// No enseña el panel: solo cifras y unos pocos títulos. Para verlas todas, se crea la cuenta.
import React, { useEffect, useMemo, useState } from 'react';
import { LuArrowRight, LuMapPin, LuCalendar, LuEuro, LuSearch, LuTrendingUp, LuBell } from 'react-icons/lu';
import { useLive } from '../lib/data/live';
import { SECTORS, REGIONS, PROVINCES, inProvince } from '../lib/discovery/match';
import { sectorAwards } from '../lib/data/awards';
import type { TedNotice } from '../lib/discovery/tedSnapshot';
import { daysUntil, fmtDate } from '../lib/util';
import { eur } from '../lib/plans';
import { navigate, track } from '../lib/store';

const fmt = (n: number) => n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions);
const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
const millions = (x: number) => (x >= 1e6 ? `${String(Math.round(x / 1e5) / 10).replace('.', ',')} millones de euros` : eur(Math.round(x)));

export function useOpenTenders() {
  const live = useLive();
  return useMemo(() => live.tenders.filter((t) => (daysUntil(t.deadline) ?? -1) >= 0), [live.tenders]);
}

/** Contador en directo de licitaciones abiertas. */
export function LiveCounter() {
  const open = useOpenTenders();
  const live = useLive();
  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  return (
    <div className="live-counter">
      <span className="live-dot" aria-hidden="true" />
      <span>Hoy, {today}, hay <strong className="num">{open.length ? fmt(open.length) : '…'}</strong> licitaciones públicas abiertas en España{live.status === 'live' ? '' : ' (datos de ejemplo)'}.</span>
    </div>
  );
}

interface Zone { key: string; label: string; test: (nuts: string) => boolean }

export function SectorFinder() {
  const open = useOpenTenders();
  const [sector, setSector] = useState('');
  const [zone, setZone] = useState('');
  const [awards, setAwards] = useState<{ n: number; amount: number; from: string; where: string } | null>(null);

  // De la zona elegida hacia fuera: provincia → comunidad → España.
  const zones = useMemo((): Zone[] => {
    const [kind, region, prov] = zone.split(':');
    const spain: Zone = { key: 'es', label: 'toda España', test: (n) => n.startsWith('ES') || !n };
    if (!kind) return [spain];
    const r = REGIONS.find((x) => x.id === region)!;
    const reg: Zone = { key: 'r', label: r.label, test: (n) => n.startsWith(region) };
    if (kind === 'R') return [reg, spain];
    const pl = PROVINCES[region]?.find((x) => x.id === prov)?.label ?? '';
    return [{ key: 'p', label: pl, test: (n) => inProvince(n, region, prov) }, reg, spain];
  }, [zone]);

  const bySector = useMemo(() => (sector ? open.filter((t) => t.sector === sector) : []), [open, sector]);
  const counts = zones.map((z) => ({ ...z, list: bySector.filter((t) => z.test(t.nuts)) }));
  const month = useMemo(() => {
    const since = Date.now() - 30 * 864e5;
    const wide = counts[Math.min(1, counts.length - 1)];
    return { n: bySector.filter((t) => wide.test(t.nuts) && t.pub && Date.parse(t.pub) >= since).length, where: wide.label };
  }, [bySector, zone]);

  // Lo adjudicado en la comunidad (o en España), para ver el volumen real del sector más allá de lo abierto hoy.
  useEffect(() => {
    setAwards(null);
    if (!sector) return;
    const prefixes = SECTORS.find((s) => s.id === sector)?.cpv ?? [];
    const wide = zones[Math.min(1, zones.length - 1)];
    let on = true;
    sectorAwards(prefixes, wide.test).then((a) => { if (on && a.n) setAwards({ ...a, where: wide.label }); }).catch(() => {});
    return () => { on = false; };
  }, [sector, zone]);

  const label = SECTORS.find((s) => s.id === sector)?.label.toLowerCase();
  const show: { z: string; list: TedNotice[] } | null = (() => { const c = counts.find((x) => x.list.length); return c ? { z: c.label, list: [...c.list].sort((a, b) => (b.value ?? 0) - (a.value ?? 0)) } : null; })();
  const go = () => { track('cta_click', { cta: 'sector_finder', sector, zone }); navigate('/signup'); };

  return (
    <div className="finder">
      <div className="finder-form">
        <div className="field"><label htmlFor="sf-s">¿A qué se dedica tu empresa?</label>
          <select id="sf-s" className="select" value={sector} onChange={(e) => { setSector(e.target.value); track('sector_search', { sector: e.target.value }); }}>
            <option value="">Elige tu sector…</option>
            {SECTORS.filter((s) => s.id !== 'otros').map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select></div>
        <div className="field"><label htmlFor="sf-z">¿Dónde trabajas?</label>
          <select id="sf-z" className="select" value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="">Toda España</option>
            {REGIONS.map((r) => (
              <optgroup key={r.id} label={r.label}>
                <option value={`R:${r.id}`}>Toda la comunidad</option>
                {(PROVINCES[r.id] ?? []).map((p) => <option key={p.id} value={`P:${r.id}:${p.id}`}>{p.label}</option>)}
              </optgroup>
            ))}
          </select></div>
        <p className="xs muted">Muchas empresas también se presentan fuera de su provincia. Por eso te enseñamos tu zona y lo que hay alrededor.</p>
      </div>
      {!sector ? (
        <div className="finder-empty"><LuSearch /> Elige tu sector y te enseñamos cuántos concursos hay ahora mismo y cuánto se mueve tu sector.</div>
      ) : (
        <div className="finder-res">
          <div className="small" style={{ fontWeight: 700 }}>Licitaciones de {label}, abiertas ahora mismo</div>
          <div className="finder-tiles mt-8">
            {counts.map((c) => (
              <div key={c.key} className={`finder-tile ${c.list.length ? '' : 'zero'}`}><span className="num">{fmt(c.list.length)}</span><span>en {c.label}</span></div>
            ))}
          </div>
          <div className="finder-flow mt-12">
            <div><LuTrendingUp /><span><strong>{fmt(month.n)}</strong> nuevas publicadas el último mes en {month.where}</span></div>
            {awards && <div><LuEuro /><span><strong>{fmt(awards.n)}</strong> contratos adjudicados en {awards.where} desde {fmtDate(awards.from, { month: 'long', year: 'numeric' })}, por {millions(awards.amount)}</span></div>}
            <div><LuBell /><span>Salen concursos nuevos cada día: PROPO te avisa de los que encajan contigo, en la zona que tú elijas.</span></div>
          </div>
          {show && (
            <div className="finder-list">
              <div className="xs subtle">Algunas abiertas en {show.z}:</div>
              {show.list.slice(0, 3).map((t) => (
                <div key={t.id} className="finder-row">
                  <div className="finder-t">{short(t.title, 90)}</div>
                  <div className="finder-m"><span><LuMapPin />{t.city || t.buyer}</span>{t.value ? <span><LuEuro />{eur(t.value)}</span> : null}<span><LuCalendar />{daysUntil(t.deadline)} días para presentar</span></div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-primary btn-lg mt-16" onClick={go}>Crear mi cuenta gratis y verlas todas <LuArrowRight /></button>
          <div className="xs muted mt-8">14 días gratis con una propuesta completa incluida. Sin tarjeta.</div>
        </div>
      )}
    </div>
  );
}
