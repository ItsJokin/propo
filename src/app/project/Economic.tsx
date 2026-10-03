// Simulador de oferta económica: cuántos puntos da cada rebaja y dónde empieza el riesgo de baja anormal.
// Es una calculadora para el licitador: PROPO no fija precios ni los incluye en el paquete.
import React, { useEffect, useMemo, useState } from 'react';
import { LuInfo, LuTriangleAlert, LuCircleCheck } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { updateProject } from '../../lib/store';
import { competitionFor, type Competition } from '../../lib/data/awards';
import { eur } from '../../lib/plans';

export interface EconomicInputs { budget: number; points: number; formula: 'inverse' | 'linear'; mine: number; best: number; mean: number }

const PRICE = /precio|oferta econ|econ[oó]mic|importe|\bbaja\b|canon|tarifa|coste/i;
const num = (s: string | undefined) => { const m = (s || '').replace(/\s/g, '').match(/[\d.]+(?:,\d+)?/); return m ? Number(m[0].replace(/\./g, '').replace(',', '.')) || 0 : 0; };
const p1 = (x: number) => String(Math.round(x * 10) / 10).replace('.', ',');

/** Puntos del criterio precio para una rebaja `b` (0–1), si la rebaja más fuerte presentada es `best`. */
export function pricePoints(i: Pick<EconomicInputs, 'points' | 'formula'>, b: number, best: number) {
  const top = Math.max(b, best);
  if (i.formula === 'linear') return top > 0 ? i.points * (b / top) : i.points;
  return i.points * ((1 - top) / (1 - b));   // proporcional inversa: Pmax × oferta más baja / tu oferta
}

function defaults(p: Project): EconomicInputs {
  const budget = p.tender?.live?.budget || p.tender?.value || num(p.analysis?.budget);
  const points = p.criteria.filter((c) => PRICE.test(c.name)).reduce((a, c) => a + (c.points || 0), 0);
  return { budget: Math.round(budget) || 0, points: points || 50, formula: 'inverse', mine: 8, best: 15, mean: 8 };
}

export function Economic({ p }: { p: Project }) {
  const saved = (p as any).economic as EconomicInputs | undefined;
  const [f, setF] = useState<EconomicInputs>(() => saved ?? defaults(p));
  const [comp, setComp] = useState<Competition | null>(null);
  const set = (k: keyof EconomicInputs, v: number | string) => { const n = { ...f, [k]: v } as EconomicInputs; setF(n); updateProject(p.id, (x) => { (x as any).economic = n; }); };

  // Rebajas habituales en adjudicaciones parecidas: se proponen como punto de partida si el usuario aún no ha tocado nada.
  useEffect(() => {
    const cpv = p.tender?.cpv ?? (p.analysis?.cpv ? [p.analysis.cpv.replace(/\D/g, '').slice(0, 8)] : []);
    let on = true;
    competitionFor({ cpv, buyer: p.organization }).then((c) => {
      if (!on) return; setComp(c);
      const s = c.buyer?.withBaja ? c.buyer : c.similar;
      if (!saved && s?.baja != null) setF((x) => ({ ...x, mean: Math.round(s.baja! * 1000) / 10, best: Math.round((s.bajaHigh ?? s.baja! * 1.6) * 1000) / 10, mine: Math.round(s.baja! * 1000) / 10 }));
    }).catch(() => { /* sin datos de adjudicaciones */ });
    return () => { on = false; };
  }, [p.id]);

  const b = f.mine / 100; const best = f.best / 100; const mean = f.mean / 100;
  const price = f.budget * (1 - b);
  const pts = pricePoints(f, b, best);
  // Art. 85 RGLCAP (4 o más ofertas): se presume anormal la oferta inferior en más de 10 unidades porcentuales a la media.
  const meanPrice = f.budget * (1 - mean);
  const abnormalPrice = meanPrice * 0.9;
  const abnormalBaja = f.budget > 0 ? 1 - abnormalPrice / f.budget : 0;
  const risky = b > abnormalBaja;
  const rows = useMemo(() => [0, 2.5, 5, 7.5, 10, 12.5, 15, 20, 25, 30].map((x) => ({ x, pts: pricePoints(f, x / 100, best), price: f.budget * (1 - x / 100), risky: x / 100 > abnormalBaja })), [f, best, abnormalBaja]);
  const next = pricePoints(f, b + 0.01, best) - pts;
  const src = comp?.buyer?.withBaja ? comp.buyer : comp?.similar;

  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="eyebrow">Oferta económica</div>
        <h2 className="mt-8" style={{ fontSize: 22 }}>¿Qué rebaja te conviene ofrecer?</h2>
        <p className="muted mt-4">Mueve tu rebaja y mira cuántos puntos ganas y cuánto dejas de ingresar. El precio lo decides tú: PROPO no lo incluye en el paquete.</p>

        <div className="eco-grid mt-24">
          <div className="stack" style={{ gap: 16 }}>
            <div className="field"><label htmlFor="eco-b">Presupuesto base (sin IVA)</label><input id="eco-b" className="input" inputMode="numeric" value={f.budget ? f.budget.toLocaleString('es-ES') : ''} placeholder="p. ej. 240.000" onChange={(e) => set('budget', num(e.target.value))} /></div>
            <div className="grid-2">
              <div className="field"><label htmlFor="eco-p">Puntos del precio</label><input id="eco-p" className="input" type="number" min={0} max={100} value={f.points} onChange={(e) => set('points', Math.max(0, Math.min(100, Number(e.target.value) || 0)))} /></div>
              <div className="field"><label htmlFor="eco-f">Fórmula del pliego</label><select id="eco-f" className="select" value={f.formula} onChange={(e) => set('formula', e.target.value)}><option value="inverse">Proporcional al precio más bajo</option><option value="linear">Proporcional a la mayor rebaja</option></select></div>
            </div>
            <div className="grid-2">
              <div className="field"><label htmlFor="eco-m">Rebaja media esperada (%)</label><input id="eco-m" className="input" type="number" min={0} max={60} step={0.5} value={f.mean} onChange={(e) => set('mean', Math.max(0, Math.min(60, Number(e.target.value) || 0)))} /></div>
              <div className="field"><label htmlFor="eco-x">Rebaja más fuerte esperada (%)</label><input id="eco-x" className="input" type="number" min={0} max={60} step={0.5} value={f.best} onChange={(e) => set('best', Math.max(0, Math.min(60, Number(e.target.value) || 0)))} /></div>
            </div>
            {src?.baja != null && <p className="xs subtle"><LuInfo style={{ width: 12, height: 12, verticalAlign: -2, marginRight: 4 }} />En {src.withBaja} adjudicaciones {comp?.buyer?.withBaja ? 'de este organismo' : 'parecidas'}, la rebaja mediana fue del {p1(src.baja * 100)} %{src.bajaHigh != null ? ` y una de cada cuatro superó el ${p1(src.bajaHigh * 100)} %` : ''}.</p>}
          </div>

          <div className="eco-result">
            <label htmlFor="eco-r" className="label">Tu rebaja</label>
            <div className="eco-big num">{p1(f.mine)} %</div>
            <input id="eco-r" type="range" className="eco-range" min={0} max={40} step={0.5} value={f.mine} onChange={(e) => set('mine', Number(e.target.value))} />
            <div className="eco-kpis">
              <div><div className="xs subtle">Tu precio</div><div className="eco-v num">{f.budget ? eur(Math.round(price)) : '—'}</div></div>
              <div><div className="xs subtle">Puntos estimados</div><div className="eco-v num">{p1(pts)} <span className="small muted">de {f.points}</span></div></div>
              <div><div className="xs subtle">Dejas de ingresar</div><div className="eco-v num">{f.budget ? eur(Math.round(f.budget - price)) : '—'}</div></div>
            </div>
            {f.budget > 0 && <p className="small muted mt-12">Un punto más de rebaja te cuesta {eur(Math.round(f.budget * 0.01))} y te da {next > 0.005 ? `${p1(next)} puntos` : 'casi nada: ya eres la oferta más baja esperada'}.</p>}
            <div className={`callout small mt-12 ${risky ? 'warn' : 'neutral'}`}>{risky ? <LuTriangleAlert /> : <LuCircleCheck />}<div>{risky
              ? <>Con esta rebaja tu oferta podría considerarse <strong>anormalmente baja</strong>: tendrías que justificarla o arriesgarte a la exclusión.</>
              : <>Por debajo del umbral orientativo de baja anormal ({p1(abnormalBaja * 100)} % de rebaja{f.budget ? `, ${eur(Math.round(abnormalPrice))}` : ''}).</>}</div></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Puntos según la rebaja</h3></div>
        <div className="eco-table">
          {rows.map((r) => (
            <button key={r.x} className={`eco-row ${Math.abs(r.x - f.mine) < 0.01 ? 'on' : ''}`} onClick={() => set('mine', r.x)}>
              <span className="num" style={{ width: 56 }}>{p1(r.x)} %</span>
              <span className="eco-bar"><span className={r.risky ? 'risk' : ''} style={{ width: `${f.points ? Math.min(100, (r.pts / f.points) * 100) : 0}%` }} /></span>
              <span className="num small" style={{ width: 74, textAlign: 'right' }}>{p1(r.pts)} pt</span>
              <span className="num small muted hide-sm" style={{ width: 110, textAlign: 'right' }}>{f.budget ? eur(Math.round(r.price)) : ''}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="callout neutral small"><LuInfo /><div>Estimación orientativa. Los puntos dependen de las ofertas que presenten los demás, que aquí son una suposición tuya. El umbral de baja anormal usa la regla general (ofertas inferiores en más de 10 unidades porcentuales a la media, con cuatro o más licitadores); <strong>el pliego puede fijar otra fórmula y otro umbral</strong>: compruébalos antes de decidir.</div></div>
    </div>
  );
}
