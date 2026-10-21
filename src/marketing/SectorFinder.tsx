// Portada: una franja discreta con las licitaciones abiertas hoy (dato real) y, si el visitante elige su sector y su
// zona, cuántas hay para él. Sin dejar a nadie con un «0»: se ve su zona, su comunidad, toda España y lo publicado el
// último mes. No enseña el panel: solo cifras. Para verlas, se crea la cuenta.
import React, { useMemo, useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { useLive } from '../lib/data/live';
import { SECTORS, REGIONS, PROVINCES, inProvince } from '../lib/discovery/match';
import { daysUntil } from '../lib/util';
import { navigate, track } from '../lib/store';

const fmt = (n: number) => n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions);

export function useOpenTenders() {
  const live = useLive();
  return useMemo(() => live.tenders.filter((t) => (daysUntil(t.deadline) ?? -1) >= 0), [live.tenders]);
}

interface Zone { key: string; label: string; test: (nuts: string) => boolean }

export function SectorFinder() {
  const open = useOpenTenders();
  const live = useLive();
  const [sector, setSector] = useState('');
  const [zone, setZone] = useState('');

  // De la zona elegida hacia fuera: provincia → comunidad → España.
  const zones = useMemo((): Zone[] => {
    const [kind, region, prov] = zone.split(':');
    const spain: Zone = { key: 'es', label: 'España', test: (n) => n.startsWith('ES') || !n };
    if (!kind) return [spain];
    const r = REGIONS.find((x) => x.id === region)!;
    const reg: Zone = { key: 'r', label: r.label, test: (n) => n.startsWith(region) };
    if (kind === 'R') return [reg, spain];
    const pl = PROVINCES[region]?.find((x) => x.id === prov)?.label ?? '';
    return [{ key: 'p', label: pl, test: (n) => inProvince(n, region, prov) }, reg, spain];
  }, [zone]);
  const bySector = useMemo(() => (sector ? open.filter((t) => t.sector === sector) : []), [open, sector]);
  const since = Date.now() - 30 * 864e5;
  const wide = zones[Math.min(1, zones.length - 1)];
  const fresh = bySector.filter((t) => wide.test(t.nuts) && t.pub && Date.parse(t.pub) >= since).length;
  const go = () => { track('cta_click', { cta: 'sector_finder', sector, zone }); navigate('/signup'); };

  return (
    <div className="finder-slim">
      <div className="fs-row">
        <span className="fs-live"><span className="live-dot" aria-hidden="true" /><strong className="num">{open.length ? fmt(open.length) : '…'}</strong> licitaciones abiertas hoy en España{live.status === 'live' ? '' : ' (ejemplo)'}</span>
        <span className="fs-sep" aria-hidden="true" />
        <span className="fs-ask">¿Y para tu empresa?</span>
        <select className="select fs-sel" aria-label="Tu sector" value={sector} onChange={(e) => { setSector(e.target.value); track('sector_search', { sector: e.target.value }); }}>
          <option value="">Tu sector</option>
          {SECTORS.filter((s) => s.id !== 'otros').map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select className="select fs-sel" aria-label="Tu zona" value={zone} onChange={(e) => setZone(e.target.value)}>
          <option value="">Toda España</option>
          {REGIONS.map((r) => (
            <optgroup key={r.id} label={r.label}>
              <option value={`R:${r.id}`}>Toda la comunidad</option>
              {(PROVINCES[r.id] ?? []).map((p) => <option key={p.id} value={`P:${r.id}:${p.id}`}>{p.label}</option>)}
            </optgroup>
          ))}
        </select>
      </div>
      {sector && (
        <div className="fs-res">
          <span className="small muted">Abiertas ahora:</span>
          {zones.map((z) => <span key={z.key} className="fs-chip"><strong className="num">{fmt(bySector.filter((t) => z.test(t.nuts)).length)}</strong> en {z.label}</span>)}
          <span className="fs-chip soft"><strong className="num">+{fmt(fresh)}</strong> nuevas el último mes{zones.length > 1 ? ` en ${wide.label}` : ''}</span>
          <button className="link fs-go" onClick={go}>Verlas gratis y que PROPO te avise <LuArrowRight style={{ verticalAlign: -2 }} /></button>
        </div>
      )}
    </div>
  );
}
