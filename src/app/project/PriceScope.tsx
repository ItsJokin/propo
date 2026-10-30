// «Lo que vas a tener que hacer»: el trabajo real de la licitación y una tabla para calcular los gastos antes de poner precio.
import React, { useEffect, useState } from 'react';
import { LuClipboardList, LuFileText, LuLoaderCircle, LuPlus, LuRotateCcw, LuTrash2, LuTriangleAlert, LuCalendar, LuMapPin, LuArrowDown } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { toast } from '../../lib/store';
import { uid } from '../../lib/util';
import { openSource } from '../common';
import { eur2, num, type Pricing as PricingState } from '../../lib/pricing';
import { readScope, scopeDoc, SCOPE_V } from '../../lib/priceScope';

const reading = new Set<string>();   // proyectos cuyo pliego se está leyendo

export function PriceScope({ p, pr, save }: { p: Project; pr: PricingState; save: (fn: (x: PricingState) => void) => void }) {
  const rule = pr.rule!;
  const scope = pr.scope?.v === SCOPE_V ? pr.scope : null;
  const [newCost, setNewCost] = useState('');
  const pending = !scope && !pr.scopeError && pr.scope !== null;
  const load = () => {
    if (reading.has(p.id)) return; reading.add(p.id);
    save((x) => { x.scopeError = false; });
    readScope(p).then((s) => save((x) => { x.scope = s; x.scopeCosts = {}; }), () => save((x) => { x.scopeError = true; })).finally(() => reading.delete(p.id));
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

  const vals = pr.scopeCosts ?? {}; const extra = pr.scopeExtra ?? [];
  const lines = [...scope.costs, ...extra.map((x) => ({ id: x.id, concept: x.concept, qty: null as number | null, unit: '', why: '' }))];
  const setVal = (id: string, k: 'qty' | 'cost', v: string) => save((x) => { const all = { ...(x.scopeCosts ?? {}) }; all[id] = { ...(all[id] ?? {}), [k]: v.replace(/[^\d.,]/g, '') }; x.scopeCosts = all; });
  const qtyOf = (l: { id: string; qty: number | null }) => { const t = vals[l.id]?.qty; return t != null && t.trim() ? num(t) : l.qty ?? 1; };
  const lineTotal = (l: { id: string; qty: number | null }) => { const c = num(vals[l.id]?.cost ?? ''); return c ? Math.round(c * qtyOf(l) * 100) / 100 : null; };
  const total = Math.round(lines.reduce((a, l) => a + (lineTotal(l) ?? 0), 0) * 100) / 100;
  const filled = lines.filter((l) => lineTotal(l) != null).length;
  const margin = rule.budget && total ? Math.round((rule.budget - total) * 100) / 100 : null;
  const offer = pr.choice?.total ? Math.round((pr.choice.total - total) * 100) / 100 : null;
  const useAsFloor = () => { save((x) => { x.floor = total; }); toast('Hecho: PROPO no te recomendará un precio por debajo de tus gastos.', 'ok'); };

  return (
    <div className="card card-pad">
      <div className="eyebrow"><LuClipboardList style={{ verticalAlign: '-2px' }} /> Antes de poner precio</div>
      <h3 className="mt-8" style={{ fontSize: 20 }}>Lo que vas a tener que hacer</h3>
      {scope.summary && <p className="mt-4" style={{ fontSize: 15, lineHeight: 1.6 }}>{scope.summary}</p>}

      <div className="sc-items mt-12">
        {scope.items.map((it) => { const d = scopeDoc(p, it.doc); return (
          <div key={it.id} className="sc-item">
            <div className={`sc-qty${it.qty == null ? ' none' : ''}`}>{it.qty != null ? <><strong>{it.qty.toLocaleString('es-ES')}</strong><span>{it.unit}</span></> : <span>{it.unit || 'según pedidos'}</span>}</div>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="sc-what">{it.what}</div>
              {(it.when || it.where) && <div className="sc-meta">{it.when && <span><LuCalendar /> {it.when}</span>}{it.where && <span><LuMapPin /> {it.where}</span>}</div>}
              {it.details && <div className="small muted mt-4">{it.details}</div>}
              {d && <button className="link xs mt-4" onClick={() => openSource({ project: p, docId: d.id, page: it.page ?? 1, quote: it.what })}><LuFileText style={{ width: 12, height: 12, verticalAlign: -1, marginRight: 3 }} />Verlo en el pliego{it.page ? ` · página ${it.page}` : ''}</button>}
            </div>
            {it.budget != null && <div className="sc-budget"><span>Presupuesto</span><strong className="num">{eur2(it.budget)}</strong><span>sin IVA</span></div>}
          </div>
        ); })}
      </div>
      <p className="xs muted mt-8">Lo ha resumido la IA de PROPO y las cifras salen del pliego. Compruébalo en el pliego antes de presentar.</p>

      <h4 className="ps-sub">¿Cuánto te cuesta hacerlo?</h4>
      <p className="small muted">Escribe lo que te cuesta cada cosa, sin IVA. No hace falta que sea exacto ni que rellenes todo. Es un cálculo tuyo: <strong>no aparece en ningún documento de la oferta</strong>.</p>
      <div className="sc-table mt-8" role="table" aria-label="Gastos de la empresa">
        <div className="sc-row head" role="row"><span>Gasto</span><span>Cantidad</span><span>Coste por unidad</span><span>Total</span><span /></div>
        {lines.map((l) => { const t = lineTotal(l); const isExtra = extra.some((x) => x.id === l.id); return (
          <div key={l.id} className="sc-row" role="row">
            <div className="sc-concept"><strong>{l.concept}</strong>{l.why && <span className="xs muted">{l.why}</span>}</div>
            <div className="sc-cell"><input className="input" inputMode="decimal" aria-label={`Cantidad de ${l.concept}`} placeholder="1" value={vals[l.id]?.qty ?? (l.qty != null ? String(l.qty) : '')} onChange={(e) => setVal(l.id, 'qty', e.target.value)} />{l.unit && <span className="xs muted">{l.unit}</span>}</div>
            <div className="sc-cell"><input className="input" inputMode="decimal" aria-label={`Coste por unidad de ${l.concept}`} placeholder="0,00" value={vals[l.id]?.cost ?? ''} onChange={(e) => setVal(l.id, 'cost', e.target.value)} /><span className="xs muted">€</span></div>
            <div className="sc-total num">{t != null ? eur2(t) : <span className="muted">—</span>}</div>
            <div>{isExtra && <button className="uc-del" style={{ position: 'static' }} aria-label={`Quitar ${l.concept}`} onClick={() => save((x) => { x.scopeExtra = (x.scopeExtra ?? []).filter((y) => y.id !== l.id); const all = { ...(x.scopeCosts ?? {}) }; delete all[l.id]; x.scopeCosts = all; })}><LuTrash2 /></button>}</div>
          </div>
        ); })}
      </div>
      <form className="row-wrap mt-8" style={{ gap: 6 }} onSubmit={(e) => { e.preventDefault(); if (!newCost.trim()) return; save((x) => { x.scopeExtra = [...(x.scopeExtra ?? []), { id: uid('sc'), concept: newCost.trim() }]; }); setNewCost(''); }}>
        <input className="input" style={{ maxWidth: 280, height: 36 }} placeholder="¿Falta un gasto? Escríbelo aquí" value={newCost} onChange={(e) => setNewCost(e.target.value)} aria-label="Añadir un gasto" />
        <button className="btn btn-ghost btn-sm" disabled={!newCost.trim()}><LuPlus /> Añadir</button>
      </form>

      {filled > 0 && <>
        <div className="sc-sum mt-16">
          <div><span>Tus gastos</span><strong className="num">{eur2(total)}</strong></div>
          {rule.budget != null && <div><span>Presupuesto máximo</span><strong className="num">{eur2(rule.budget)}</strong></div>}
          {margin != null && <div className={margin < 0 ? 'bad' : 'ok'}><span>Te quedaría, como mucho</span><strong className="num">{eur2(margin)}</strong></div>}
          {offer != null && <div className={offer < 0 ? 'bad' : 'ok'}><span>Con el precio que has elegido</span><strong className="num">{eur2(offer)}</strong></div>}
        </div>
        {margin != null && margin < 0 && <div className="callout bad small mt-8"><LuTriangleAlert /><div>Tus gastos superan el presupuesto máximo: con estos números perderías dinero aunque no hicieras ninguna rebaja.</div></div>}
        <div className="row-wrap mt-12" style={{ gap: 10, alignItems: 'center' }}>
          {pr.floor === total
            ? <span className="small" style={{ color: 'var(--ok-ink)', fontWeight: 600 }}>✓ PROPO no te recomendará un precio por debajo de estos gastos.</span>
            : <><button className="btn btn-secondary" onClick={useAsFloor}><LuArrowDown /> Que PROPO no baje de esta cifra</button><span className="xs muted">Ajusta la rebaja recomendada para que no pierdas dinero. Súmale el beneficio que quieras ganar.</span></>}
        </div>
      </>}
    </div>
  );
}
