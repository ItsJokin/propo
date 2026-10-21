// Portada: cuántas licitaciones abiertas hay hoy (dato real) y cuántas para el sector y la zona del visitante.
// No enseña el panel: solo el número y unos pocos títulos. Para verlas todas, se crea la cuenta.
import React, { useMemo, useState } from 'react';
import { LuArrowRight, LuMapPin, LuCalendar, LuEuro, LuSearch } from 'react-icons/lu';
import { useLive } from '../lib/data/live';
import { SECTORS, REGIONS, PROVINCES, inProvince } from '../lib/discovery/match';
import { daysUntil } from '../lib/util';
import { eur } from '../lib/plans';
import { navigate, track } from '../lib/store';

const fmt = (n: number) => n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions);
const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

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

export function SectorFinder() {
  const open = useOpenTenders();
  const [sector, setSector] = useState('');
  const [zone, setZone] = useState('');
  const found = useMemo(() => {
    if (!sector) return null;
    const [kind, region, prov] = zone.split(':');
    return open.filter((t) => t.sector === sector && (!kind || (kind === 'R' ? t.nuts.startsWith(region) : inProvince(t.nuts, region, prov))))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }, [open, sector, zone]);
  const label = SECTORS.find((s) => s.id === sector)?.label.toLowerCase();
  const zoneLabel = (() => {
    const [kind, region, prov] = zone.split(':');
    if (!kind) return 'en toda España';
    const r = REGIONS.find((x) => x.id === region)?.label;
    return kind === 'R' ? `en ${r}` : `en ${PROVINCES[region]?.find((p) => p.id === prov)?.label}`;
  })();
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
      </div>
      {!found ? (
        <div className="finder-empty"><LuSearch /> Elige tu sector y te decimos cuántos concursos abiertos hay ahora mismo para tu empresa.</div>
      ) : (
        <div className="finder-res">
          <div className="finder-big"><span className="num">{fmt(found.length)}</span><span>{found.length === 1 ? 'licitación abierta' : 'licitaciones abiertas'} de {label} {zoneLabel}</span></div>
          {found.length > 0 ? (
            <>
              <div className="finder-list">
                {found.slice(0, 3).map((t) => (
                  <div key={t.id} className="finder-row">
                    <div className="finder-t">{short(t.title, 90)}</div>
                    <div className="finder-m"><span><LuMapPin />{t.city || t.buyer}</span>{t.value ? <span><LuEuro />{eur(t.value)}</span> : null}<span><LuCalendar />{daysUntil(t.deadline)} días para presentar</span></div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-lg mt-16" onClick={go}>{found.length > 3 ? `Ver las ${fmt(found.length)} y que PROPO te avise de las nuevas` : 'Verlas y que PROPO te avise de las nuevas'} <LuArrowRight /></button>
              <div className="xs muted mt-8">Crea tu cuenta gratis: 14 días con una propuesta completa incluida. Sin tarjeta.</div>
            </>
          ) : (
            <>
              <p className="muted mt-8">Ahora mismo no hay ninguna abierta {zoneLabel}. Prueba con toda la comunidad o toda España: salen concursos nuevos cada día.</p>
              <button className="btn btn-secondary mt-12" onClick={go}>Crea tu cuenta y PROPO te avisa en cuanto salga una <LuArrowRight /></button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
