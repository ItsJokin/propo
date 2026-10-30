// «Lo que vas a tener que hacer»: el trabajo real de la licitación, leído del pliego, antes de poner precio.
import React, { useEffect } from 'react';
import { LuClipboardList, LuFileText, LuLoaderCircle, LuRotateCcw, LuTriangleAlert, LuCalendar, LuMapPin } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { openSource } from '../common';
import { eur2, type Pricing as PricingState } from '../../lib/pricing';
import { readScope, SCOPE_V } from '../../lib/priceScope';

const reading = new Set<string>();   // proyectos cuyo pliego se está leyendo

export function PriceScope({ p, pr, save }: { p: Project; pr: PricingState; save: (fn: (x: PricingState) => void) => void }) {
  const scope = pr.scope?.v === SCOPE_V ? pr.scope : null;
  const pending = !scope && !pr.scopeError && pr.scope !== null;
  const load = () => {
    if (reading.has(p.id)) return; reading.add(p.id);
    save((x) => { x.scopeError = false; });
    readScope(p).then((s) => save((x) => { x.scope = s; }), () => save((x) => { x.scopeError = true; })).finally(() => reading.delete(p.id));
  };
  useEffect(() => { if (pending) load(); }, [p.id]);   // una sola vez por proyecto: queda guardado

  if (pr.scope === null && !pr.scopeError) return null;   // el pliego no da información sobre el trabajo
  if (pr.scopeError) return <div className="card card-pad"><div className="uc-note">No se ha podido leer ahora lo que pide el pliego. <button className="btn btn-ghost btn-sm" onClick={load}><LuRotateCcw /> Reintentar</button></div></div>;
  if (!scope) return (
    <div className="card card-pad">
      <div className="eyebrow"><LuClipboardList style={{ verticalAlign: '-2px' }} /> Antes de poner precio</div>
      <h3 className="mt-8" style={{ fontSize: 20 }}>Lo que vas a tener que hacer</h3>
      <div className="uc-note mt-12"><LuLoaderCircle className="spin" /> PROPO está leyendo el pliego para contártelo en claro. Tarda un minuto y solo se hace una vez.</div>
    </div>
  );

  const inside = scope.included ?? [];

  return (
    <div className="card card-pad">
      <div className="eyebrow"><LuClipboardList style={{ verticalAlign: '-2px' }} /> Antes de poner precio</div>
      <h3 className="mt-8" style={{ fontSize: 20 }}>Lo que vas a tener que hacer</h3>
      {scope.summary && <p className="mt-4" style={{ fontSize: 15, lineHeight: 1.6 }}>{scope.summary}</p>}

      <div className="sc-items mt-12">
        {scope.items.map((it) => { const main = it.sources[0]?.docId; return (
          <div key={it.id} className="sc-item">
            <div className={`sc-qty${it.qty == null ? ' none' : ''}`}>{it.qty != null ? <><strong>{it.qty.toLocaleString('es-ES')}</strong><span>{it.unit}</span></> : <span>{it.unit || 'según pedidos'}</span>}</div>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="sc-what">{it.what}</div>
              {(it.when || it.where) && <div className="sc-meta">{it.when && <span><LuCalendar /> {it.when}</span>}{it.where && <span><LuMapPin /> {it.where}</span>}</div>}
              {it.details && <div className="small muted mt-4">{it.details}</div>}
              {it.unknown.length > 0 && <div className="sc-unknown"><LuTriangleAlert /> No aparece en el pliego, compruébalo: {it.unknown.join(', ')}</div>}
              {it.sources.length > 0 ? <div className="sc-src"><LuFileText /> <span>Verlo en el pliego:</span>{it.sources.map((x) => <button key={`${x.docId}-${x.page}`} className="link" title={x.doc} onClick={() => openSource({ project: p, docId: x.docId, page: x.page, quote: x.quote })}>{x.docId !== main ? `${x.doc.slice(0, 14).trim()}… ` : ''}pág. {x.page}</button>)}</div>
                : <div className="sc-unknown"><LuTriangleAlert /> No he podido localizar esto en el pliego: compruébalo antes de presentar.</div>}
            </div>
            {it.budget != null && <div className="sc-budget"><span>Presupuesto</span><strong className="num">{eur2(it.budget)}</strong><span>sin IVA</span></div>}
          </div>
        ); })}
      </div>
      <p className="xs muted mt-8">Lo ha resumido la IA de PROPO. Las cantidades y los presupuestos están comprobados contra el pliego, y cada trabajo enlaza a las páginas de donde sale. Aun así, revísalo antes de presentar.</p>

      {inside.length > 0 && <div className="sc-incl mt-12"><strong>Ya va dentro de tus precios, no se cobra aparte:</strong> {inside.join(' · ')}.</div>}
    </div>
  );
}
