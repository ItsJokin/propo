// «Lo que vas a tener que hacer»: el trabajo real de la licitación y una tabla para poner precio a cada cosa; la suma es la oferta.
import React, { useEffect, useState } from 'react';
import { LuClipboardList, LuFileText, LuLoaderCircle, LuPlus, LuRotateCcw, LuTrash2, LuTriangleAlert, LuCalendar, LuMapPin, LuArrowRight } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { toast, updateProject } from '../../lib/store';
import { uid, normalize } from '../../lib/util';
import { openSource } from '../common';
import { emptyPricing, eur2, num, pct1, unitPricesFor, type Market, type PriceChoice, type Pricing as PricingState } from '../../lib/pricing';
import { priceStrategy, type OfferType } from '../../lib/priceStrategy';
import { readScope, scopeDoc, SCOPE_V } from '../../lib/priceScope';

const reading = new Set<string>();   // proyectos cuyo pliego se está leyendo

const fmtPts = (x: number | null) => (x == null ? '—' : String(Math.round(x * 10) / 10).replace('.', ','));

export function PriceScope({ p, pr, m, fmt, save }: { p: Project; pr: PricingState; m: Market; fmt: OfferType; save: (fn: (x: PricingState) => void) => void }) {
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
  // El precio final sale de la suma, y se presenta en la forma que pide este pliego
  const strat = priceStrategy(rule, m, pr.floor);
  const rawBaja = rule.budget && total ? 1 - total / rule.budget : 0;
  const baja = fmt === 'discount' ? Math.round(rawBaja * 1000) / 1000 : rawBaja;
  const over = !!rule.budget && total > rule.budget + 0.005;
  const expPts = total ? strat.exp(Math.max(0, baja)) : null;
  const risky = baja >= strat.abn;
  const belowFloor = !!pr.floor && total > 0 && total < pr.floor;
  const target = rule.budget ? Math.round(rule.budget * (1 - strat.rec) * 100) / 100 : null;
  const gap = target != null && total ? Math.round((total - target) * 100) / 100 : null;
  const buildChoice = (): PriceChoice => {
    if (fmt === 'discount') return { mode: 'own', baja, total: 0, points: expPts, units: [], discount: baja, kind: fmt };
    if (fmt === 'lots') { const lots = rule.lots.filter((l) => l.budget); return { mode: 'own', baja, total, points: expPts, kind: fmt, units: lots.map((l) => ({ id: `lot${rule.lots.indexOf(l)}`, label: l.label, price: Math.round(l.budget! * (1 - baja) * 100) / 100 })) }; }
    return { mode: 'own', baja, total, points: expPts, units: unitPricesFor(rule, baja), kind: 'total' };
  };
  const useTotal = () => {
    const c = buildChoice();
    updateProject(p.id, (x) => { const cur = x.pricing ?? emptyPricing(); cur.choice = c; cur.approved = null; cur.filled = null; cur.fillNote = ''; cur.studio = { ...(cur.studio ?? {}), b: Math.max(0, baja) }; x.pricing = cur; x.manualChecks.financialApproved = false; });
    toast('Precio preparado. Revísalo abajo y confírmalo.', 'ok');
  };
  // Si el pliego ya fija los servicios y sus precios máximos, se les pone precio directamente abajo: esta tabla sobraría.
  const fixedByPliego = fmt === 'units' || (fmt === 'discount' && rule.units.some((u) => u.max != null));
  // Lo que ya tiene su línea en la tabla no se repite como «incluido» (p. ej. el transporte)
  const inside = (scope.included ?? []).filter((x) => { const w = normalize(x).split(/\s+/)[0]; return !lines.some((l) => normalize(l.concept).includes(w)); });
  const isCurrent = !!pr.choice && pr.choice.kind === fmt && Math.abs(pr.choice.baja - baja) < 0.0005 && total > 0;

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

      {inside.length > 0 && <div className="sc-incl mt-12"><strong>Ya va dentro de tus precios, no se cobra aparte:</strong> {inside.join(' · ')}.</div>}

      {fixedByPliego ? <p className="small muted mt-12">{fmt === 'units' ? 'El pliego ya fija qué servicios se cobran y su precio máximo: ponles precio más abajo.' : 'El pliego ya fija el precio máximo de cada servicio: tú solo eliges el % de rebaja, más abajo.'}</p> : <>
      <h4 className="ps-sub">¿Qué precio le pones a cada cosa?</h4>
      <p className="small muted">Escribe lo que quieres cobrar por cada cosa, sin IVA y con tu beneficio incluido. PROPO lo suma y te dice <strong>tu precio final</strong>, qué rebaja supone y cuántos puntos te da.</p>
      <div className="sc-table mt-8" role="table" aria-label="Precio de cada cosa">
        <div className="sc-row head" role="row"><span>Qué</span><span>Cantidad</span><span>Tu precio por unidad</span><span>Total</span><span /></div>
        {lines.map((l) => { const t = lineTotal(l); const isExtra = extra.some((x) => x.id === l.id); return (
          <div key={l.id} className="sc-row" role="row">
            <div className="sc-concept"><strong>{l.concept}</strong>{l.why && <span className="xs muted">{l.why}</span>}</div>
            <div className="sc-cell"><input className="input" inputMode="decimal" aria-label={`Cantidad de ${l.concept}`} placeholder="1" value={vals[l.id]?.qty ?? (l.qty != null ? String(l.qty).replace('.', ',') : '')} onChange={(e) => setVal(l.id, 'qty', e.target.value)} />{l.unit && <span className="xs muted">{l.unit}</span>}</div>
            <div className="sc-cell"><input className="input" inputMode="decimal" aria-label={`Precio por unidad de ${l.concept}`} placeholder="0,00" value={vals[l.id]?.cost ?? ''} onChange={(e) => setVal(l.id, 'cost', e.target.value)} /><span className="xs muted">€</span></div>
            <div className="sc-total num">{t != null ? eur2(t) : <span className="muted">—</span>}</div>
            <div>{isExtra && <button className="uc-del" style={{ position: 'static' }} aria-label={`Quitar ${l.concept}`} onClick={() => save((x) => { x.scopeExtra = (x.scopeExtra ?? []).filter((y) => y.id !== l.id); const all = { ...(x.scopeCosts ?? {}) }; delete all[l.id]; x.scopeCosts = all; })}><LuTrash2 /></button>}</div>
          </div>
        ); })}
      </div>
      <form className="row-wrap mt-8" style={{ gap: 6 }} onSubmit={(e) => { e.preventDefault(); if (!newCost.trim()) return; save((x) => { x.scopeExtra = [...(x.scopeExtra ?? []), { id: uid('sc'), concept: newCost.trim() }]; }); setNewCost(''); }}>
        <input className="input" style={{ maxWidth: 280, height: 36 }} placeholder="¿Falta algo? Escríbelo aquí" value={newCost} onChange={(e) => setNewCost(e.target.value)} aria-label="Añadir un concepto" />
        <button className="btn btn-ghost btn-sm" disabled={!newCost.trim()}><LuPlus /> Añadir</button>
      </form>

      {filled > 0 && <>
        <div className="sc-sum mt-16">
          <div className="final"><span>Tu precio final, sin IVA</span><strong className="num">{eur2(total)}</strong><em>{eur2(total * (1 + (rule.vat ?? 21) / 100))} con IVA</em></div>
          {rule.budget != null && <div className={over ? 'bad' : ''}><span>{over ? 'Te pasas del máximo' : fmt === 'discount' ? 'Equivale a una rebaja única del' : 'Rebaja sobre el máximo'}</span><strong className="num">{over ? eur2(total - rule.budget) : pct1(Math.max(0, baja))}</strong><em>Máximo: {eur2(rule.budget)}</em></div>}
          {expPts != null && !over && <div><span>Puntos que esperas</span><strong className="num">{fmtPts(expPts)} de {fmtPts(strat.P)}</strong><em>Según lo que suelen rebajar los demás</em></div>}
          {!over && <div className={risky || belowFloor ? 'bad' : 'ok'}><span>Riesgo</span><strong>{risky ? 'Baja temeraria' : belowFloor ? 'Bajo tu coste' : 'Sin riesgo'}</strong><em>{risky ? 'Te pedirían justificarla' : belowFloor ? `Tu mínimo es ${eur2(pr.floor!)}` : `Temeraria a partir del ${pct1(strat.abn)}`}</em></div>}
        </div>
        {filled < lines.length && <p className="xs muted mt-8">Llevas {filled} de {lines.length} conceptos con precio. Los que dejes vacíos no suman nada: rellénalos para que el precio final sea real.</p>}
        {!over && gap != null && Math.abs(gap) >= 1 && strat.P != null && <p className="small mt-8">{gap > 0 ? <>Para llegar a la rebaja que recomienda PROPO ({pct1(strat.rec)}) tendrías que bajar <strong>{eur2(gap)}</strong>.</> : <>Estás <strong>{eur2(-gap)}</strong> por debajo de la rebaja que recomienda PROPO ({pct1(strat.rec)}): podrías cobrar más sin perder apenas puntos.</>}</p>}
        {over && <div className="callout bad small mt-8"><LuTriangleAlert /><div>Una oferta por encima del presupuesto máximo se excluye. Baja algún precio hasta quedar en {eur2(rule.budget!)} o menos.</div></div>}
        <div className="row-wrap mt-12" style={{ gap: 10, alignItems: 'center' }}>
          {isCurrent
            ? <span className="small" style={{ color: 'var(--ok-ink)', fontWeight: 600 }}>✓ Este es el precio de tu oferta.</span>
            : <button className="btn btn-primary" disabled={over} onClick={useTotal}>{pr.choice ? 'Cambiar mi oferta a este precio' : 'Usar este precio'} <LuArrowRight /></button>}
                    <span className="xs muted">En la oferta va el precio final. Este desglose es para ti{fmt === 'discount' ? ': el pliego pide un % único, así que tu precio se presenta como esa rebaja' : ''}.</span>
        </div>
      </>}
      </>}
    </div>
  );
}
