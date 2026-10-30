// Paso «El precio»: PROPO explica cómo puntúa el precio este pliego, decide cómo se presenta (total, % único, precio por
// servicio o por lote), recomienda la rebaja que más puntos da sin riesgo y, al confirmarla, prepara la oferta económica.
import React, { useEffect, useRef, useState } from 'react';
import { LuInfo, LuTriangleAlert, LuCircleCheck, LuSparkles, LuPencil, LuRotateCcw, LuArrowRight, LuShieldCheck, LuLoaderCircle, LuPlus, LuTrash2, LuMinus, LuCheck, LuChevronLeft, LuChevronRight, LuFileText, LuTarget } from 'react-icons/lu';
import { Drawer } from '../../components/ui';
import { uid } from '../../lib/util';
import type { Project } from '../../lib/types';
import { updateProject, navigate, toast, getState } from '../../lib/store';
import { fillOfficialModel } from '../../lib/offerModel';
import { getFile } from '../../lib/storage';
import { offerDownload } from '../../lib/services/download';
import {
  emptyPricing, readPriceRule, marketFor, readOwnPrices, formalCommitment, priceWarnings, eurosInWords, eur2, pct1, num,
  otherAdvice, otherPoints, commitmentText, unitLines, unitChoice, unitText, explainUnits, unitPricesFor, UNIT_INFO_V,
  type Pricing as PricingState, type Market, type PriceRule, type PriceChoice, type UnitLine,
} from '../../lib/pricing';
import { offerType, priceStrategy, OFFER, type OfferType, type Strategy } from '../../lib/priceStrategy';
import { Economic } from './Economic';
import { PriceScope } from './PriceScope';
import { samplePriceRule } from '../../lib/samplePricing';

const pts = (x: number | null) => (x == null ? '—' : String(Math.round(x * 10) / 10).replace('.', ','));

/** Cuánto pesa el precio en la nota, en una frase. */
function weight(points: number | null, total: number | null) {
  if (!points || !total) return 'El precio es uno de los criterios que más decide una licitación.';
  const share = points / total;
  if (share >= 0.5) return `Es más de la mitad de la nota: aquí el precio pesa más que la memoria técnica.`;
  if (share >= 0.3) return `Es una parte muy importante de la nota: un buen precio puede darte el contrato aunque otra empresa tenga una memoria parecida.`;
  return `Pesa menos que la memoria técnica: aquí no merece la pena arriesgar mucho con el precio, porque los puntos se ganan sobre todo con la propuesta.`;
}
/** La fórmula del pliego, explicada sin jerga. */
function formulaPlain(r: { formula: string; points: number | null; satiation: number | null }) {
  const P = r.points ? `${pts(r.points)} puntos` : 'todos los puntos del precio';
  if (r.formula === 'linear') return `Los puntos van en proporción a la rebaja: quien más rebaja se lleva los ${P}, y si tú rebajas la mitad que esa empresa, te llevas la mitad.`;
  if (r.formula === 'threshold') return `Los puntos van en proporción a la rebaja, pero con un tope: a partir de una rebaja del ${r.satiation != null ? pts(r.satiation) + ' %' : 'umbral que fija el pliego'} ya no se dan más puntos, así que bajar más solo te quita dinero.`;
  if (r.formula === 'other') return `Este pliego usa una fórmula propia (la tienes debajo, en «Ver la fórmula»). Para estimar los puntos usamos la regla más parecida, así que tómalos como una orientación.`;
  return `La oferta más barata se lleva los ${P}. Las demás reciben puntos en proporción: cuanto más cerca estés del precio más bajo, más puntos te llevas, aunque no seas el más barato.`;
}

export function Pricing({ p }: { p: Project }) {
  const pr: PricingState = p.pricing ?? emptyPricing();
  const rule = pr.rule;
  const [reading, setReading] = useState(false);
  const [market, setMarket] = useState<Market | null>(null);
  const [budgetTxt, setBudgetTxt] = useState('');
  const [filling, setFilling] = useState(false);
  const save = (fn: (x: PricingState) => void) => updateProject(p.id, (x) => { const cur = x.pricing ?? emptyPricing(); fn(cur); x.pricing = cur; });

  useEffect(() => {
    let on = true;
    marketFor(p).then((m) => { if (on) setMarket(m); });
    if (!rule && !reading) {
      setReading(true);
      readPriceRule(p).then((r) => { if (on) save((x) => { x.rule = r; }); }).finally(() => { if (on) setReading(false); });
    } else if (rule && p.isSample && !rule.offerType && !pr.choice) {   // ejemplos guardados antes de tener su propia regla de precio
      const s = samplePriceRule(p.id, rule); if (s) save((x) => { x.rule = s; x.studio = {}; });
    }
    return () => { on = false; };
  }, [p.id]);

  if (!rule) {
    return (
      <div className="card card-pad pr-loading">
        <LuLoaderCircle className="spin" style={{ width: 22, height: 22, color: 'var(--accent)', flex: 'none' }} aria-hidden="true" />
        <div><strong>PROPO está leyendo cómo se puntúa el precio en este pliego…</strong><div className="small muted mt-4">Busca la fórmula, los puntos, cómo hay que presentar el precio y cuándo una oferta se considera temeraria. Tarda menos de un minuto.</div></div>
      </div>
    );
  }

  const m = market ?? { mean: 0.08, best: 0.15, n: 0, scope: '' };
  const fmt = offerType(rule);
  const ch = pr.choice;
  const warns = ch ? priceWarnings(rule, ch, market) : [];
  const vat = rule.vat ?? 21;
  const expPts = ch && rule.points ? priceStrategy(rule, m, pr.floor).exp(ch.baja) : null;   // con lo que suelen rebajar los demás, no solo si fueras la mejor oferta
  const share = rule.points && rule.totalPoints ? Math.min(1, rule.points / rule.totalPoints) : null;

  // Al confirmar, PROPO rellena él solo el modelo oficial del pliego con estos importes (si el pliego tiene uno rellenable).
  const fillModel = async () => {
    setFilling(true);
    try {
      const cur = getState().projects.find((x) => x.id === p.id);
      const f = cur ? await fillOfficialModel(cur, getState()) : null;
      save((x) => { x.filled = f; x.fillNote = f ? '' : 'none'; });
      if (f) toast(`Hemos rellenado el modelo oficial del pliego (${f.fields} ${f.fields === 1 ? 'dato' : 'datos'}).`, 'ok');
    } catch { save((x) => { x.filled = null; x.fillNote = 'error'; }); }
    finally { setFilling(false); }
  };
  const confirm = () => {
    updateProject(p.id, (x) => { x.pricing = { ...(x.pricing ?? emptyPricing()), approved: new Date().toISOString(), filled: null, fillNote: '' }; x.manualChecks.financialApproved = true; x.activity.unshift({ at: new Date().toISOString(), text: 'Precio de la oferta confirmado' }); });
    toast('Precio confirmado. Va en la oferta económica del paquete.', 'ok');
    fillModel();
  };
  const downloadFilled = async () => {
    const f = pr.filled; if (!f) return;
    const b = await getFile(f.key);
    if (!b) { toast('No encontramos el archivo. Pulsa «Volver a rellenar».', 'warn'); return; }
    const r = await offerDownload(f.name, new Uint8Array(b));
    if (r === 'unavailable') toast('Las descargas no están disponibles en esta vista.', 'warn');
  };
  const reset = () => { updateProject(p.id, (x) => { x.pricing = { ...(x.pricing ?? emptyPricing()), choice: null, approved: null, ownText: '', filled: null, fillNote: '', studio: {}, unitDraft: {} }; x.manualChecks.financialApproved = false; }); };
  const adjust = () => updateProject(p.id, (o) => {
    const x = o.pricing ?? emptyPricing(); const c = x.choice!; x.studio = { ...(x.studio ?? {}), b: c.baja };
    if (c.kind === 'units') x.unitDraft = Object.fromEntries(c.units.map((u) => [u.id, String(u.price).replace('.', ',')]));
    x.choice = null; x.approved = null; o.pricing = x; o.manualChecks.financialApproved = false;
  });

  return (
    <div className="stack gap-16">
      {/* 1 · Cómo se gana el precio */}
      <div className="card card-pad">
        <div className="eyebrow">Paso 3 · El precio</div>
        <h2 className="mt-8" style={{ fontSize: 22 }}>Cómo se gana el precio en esta licitación</h2>
        <div className="ps-head mt-16">
          <div className="ps-tile ps-ring-tile">
            <svg className="ps-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" className="ps-ring-bg" /><circle cx="32" cy="32" r="27" className="ps-ring-fg" strokeDasharray={`${(share ?? 0) * 169.6} 169.6`} transform="rotate(-90 32 32)" /></svg>
            <div><div className="ps-big num">{rule.points ? pts(rule.points) : '—'}<span> puntos</span></div><div className="xs muted">{rule.totalPoints ? `de ${pts(rule.totalPoints)} de la nota${share ? ` (${Math.round(share * 100)} %)` : ''}` : 'del precio'}</div></div>
          </div>
          <div className="ps-tile ps-format">
            <div className="xs subtle"><LuSparkles style={{ verticalAlign: '-2px' }} /> Cómo se presenta el precio · lo ha leído PROPO en el pliego</div>
            <div className="ps-format-t">{OFFER[fmt.type].t}</div>
            <div className="small muted">{fmt.why}</div>
          </div>
          <div className="ps-tile">
            <div className="xs subtle">Presupuesto máximo, sin IVA</div>
            <div className="ps-big num">{rule.budget ? eur2(rule.budget) : '—'}</div>
            <div className="xs muted">Por encima, te excluyen</div>
          </div>
        </div>
        <p className="mt-16" style={{ fontSize: 15, lineHeight: 1.6 }}>{rule.plain}</p>
        {!rule.budget && fmt.type === 'total' && (
          <div className="callout warn mt-16"><LuTriangleAlert /><div className="grow"><strong>No hemos encontrado el presupuesto máximo.</strong> Escríbelo (sin IVA) para poder calcular el precio.
            <div className="row mt-8" style={{ gap: 8 }}><input className="input" style={{ maxWidth: 220 }} inputMode="decimal" placeholder="p. ej. 240.000" value={budgetTxt} onChange={(e) => setBudgetTxt(e.target.value)} /><button className="btn btn-primary" disabled={!num(budgetTxt)} onClick={() => save((x) => { if (x.rule) x.rule.budget = num(budgetTxt); })}>Guardar</button></div></div></div>
        )}
        <details className="pr-details mt-12"><summary>Entender cómo se reparten los puntos y qué es la baja temeraria</summary>
          <div className="pr-explain mt-12">
            <div>
              <h4>Cómo se reparten los puntos</h4>
              <p>{formulaPlain(rule)}</p>
              <p className="mt-8">{weight(rule.points, rule.totalPoints)}</p>
            </div>
            <div>
              <h4>Qué es la baja temeraria</h4>
              <p>Si tu precio queda muy por debajo del de los demás, la Administración sospecha que no podrás cumplir el contrato. Te pedirá que lo justifiques en pocos días y, si no le convence, <strong>te excluye</strong> aunque tuvieras la mejor nota. PROPO nunca te recomienda un precio en esa zona.</p>
            </div>
          </div>
          {rule.formulaText && <p className="small mt-12"><strong>Fórmula del pliego:</strong> {rule.formulaText}</p>}
          {rule.satiation != null && <p className="small mt-4"><strong>Umbral de saciedad:</strong> a partir de una rebaja del {pts(rule.satiation)} % no se dan más puntos.</p>}
          <p className="small mt-4"><strong>Oferta anormalmente baja:</strong> {rule.abnormalText}</p>
          {rule.source && <p className="xs subtle mt-4">«{rule.source.quote}» · {rule.source.doc}{rule.source.page ? `, p. ${rule.source.page}` : ''}</p>}
        </details>
        {rule.labor && <div className="callout warn small mt-12"><LuTriangleAlert /><div><strong>Ojo con los costes de personal.</strong> {rule.labor} Un precio que no cubra estos costes se puede excluir.</div></div>}
        {rule.mode === 'rules' && <div className="callout neutral small mt-12"><LuInfo /><div>No hemos podido leer la fórmula exacta con la IA: estos datos salen del análisis general. Compruébalos en el apartado de criterios de adjudicación del pliego.</div></div>}
      </div>

      {/* Lo que hay que hacer de verdad y cuánto cuesta */}
      <PriceScope p={p} pr={pr} save={save} />

      {/* 2 · El precio: lo pone el cliente o lo pone PROPO */}
      {!ch && <PriceChooser p={p} pr={pr} rule={rule} m={m} fmt={fmt.type} save={save} />}

      {/* 3 · El precio elegido */}
      {ch && (
        <div className={`card card-pad ${pr.approved ? 'pr-done' : ''}`}>
          <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ fontSize: 18 }}>{pr.approved ? <><LuCircleCheck style={{ color: 'var(--ok)', verticalAlign: -3 }} /> Precio confirmado</> : 'Tu oferta económica'}</h3>
            <span className="badge">{ch.mode === 'own' ? 'Ajustado por ti' : 'Recomendado por PROPO'}</span>
          </div>
          {ch.discount != null && <div className="pr-sum mt-12"><div className="tot"><span>Rebaja única sobre todos los precios máximos</span><strong className="num">{pct1(ch.discount)}</strong></div></div>}
          {ch.total > 0 ? <>
          <div className="pr-sum mt-12">
            <div><span>Importe sin IVA</span><strong className="num">{eur2(ch.total)}</strong></div>
            <div><span>IVA ({vat} %)</span><strong className="num">{eur2(ch.total * vat / 100)}</strong></div>
            <div className="tot"><span>Total con IVA</span><strong className="num">{eur2(ch.total * (1 + vat / 100))}</strong></div>
          </div>
          <p className="small muted mt-8">En letra: <em>{eurosInWords(Math.round(ch.total * 100) / 100)}</em> (sin IVA).</p>
          </> : ch.discount == null && <p className="small muted mt-8">Oferta por precios unitarios: el importe final dependerá de los servicios que se pidan.</p>}
          {ch.units.length > 0 && (
            <details className="pr-details mt-12" open={ch.units.length <= 8}><summary>{ch.kind === 'lots' ? `Importe de cada lote (${ch.units.length})` : `Precio de cada servicio (${ch.units.length})`}</summary>
              <table className="pr-units mt-8"><thead><tr><th>{ch.kind === 'lots' ? 'Lote' : 'Servicio'}</th><th style={{ textAlign: 'right' }}>Sin IVA</th></tr></thead>
                <tbody>{ch.units.map((u) => <tr key={u.id}><td>{u.label}</td><td className="num" style={{ textAlign: 'right' }}>{eur2(u.price)}</td></tr>)}</tbody></table>
            </details>
          )}
          <p className="small mt-12">{ch.discount == null && <>Rebaja sobre el precio máximo: <strong>{pct1(ch.baja)}</strong> · </>}{expPts != null && <>Puntos del precio que esperas: <strong>{pts(expPts)} de {pts(rule.points)}</strong></>}</p>
          {warns.map((w, i) => <div key={i} className={`callout ${w.level} small mt-8`}><LuTriangleAlert /><div>{w.text}</div></div>)}
          {!pr.approved && (
            <div className="pr-next mt-12 small">
              <strong>Revisa los importes. Al confirmar, PROPO:</strong>
              <ol>
                <li>rellena con ellos el modelo oficial de oferta del pliego, si lo tiene;</li>
                <li>prepara tu oferta económica, lista para firmar, en el sobre de precio del paquete;</li>
                <li>vuelve a comprobar en la comprobación final que nada supera los máximos y que el precio no aparece en la memoria técnica.</li>
              </ol>
              <span className="muted">Podrás cambiarlo cuando quieras hasta que presentes la oferta.</span>
            </div>
          )}
          {pr.approved && filling && <div className="callout small mt-12"><LuLoaderCircle className="spin" /><div>PROPO está rellenando el modelo oficial de oferta del pliego con tus importes…</div></div>}
          {pr.approved && !filling && pr.filled && (
            <div className="callout small mt-12"><LuCircleCheck /><div className="grow"><strong>Modelo oficial rellenado.</strong> Hemos completado {pr.filled.fields} {pr.filled.fields === 1 ? 'dato' : 'datos'} de «{pr.filled.source}» con tus importes. Va en el paquete, en el sobre de la oferta económica. Revísalo y fírmalo antes de presentarlo.
              <div className="row mt-8" style={{ gap: 8 }}><button className="btn btn-secondary btn-sm" onClick={downloadFilled}>Descargar el modelo rellenado</button><button className="btn btn-ghost btn-sm" onClick={fillModel}>Volver a rellenar</button></div></div></div>
          )}
          {pr.approved && !filling && !pr.filled && pr.fillNote && (
            <div className="callout neutral small mt-12"><LuInfo /><div className="grow">{pr.fillNote === 'error' ? 'No hemos podido rellenar el modelo oficial ahora mismo.' : rule.model ? <>El modelo del pliego (<strong>{rule.model.name}</strong>) no tiene huecos que podamos rellenar automáticamente (suele pasar con los PDF escaneados o sin campos).</> : 'No hemos encontrado un modelo oficial de oferta que se pueda rellenar en los documentos del pliego.'} En el paquete va tu oferta económica preparada por PROPO con todos los importes; si la plataforma exige el modelo del pliego, copia en él esos mismos datos.
              <div className="mt-8"><button className="btn btn-ghost btn-sm" onClick={fillModel}>Intentarlo de nuevo</button></div></div></div>
          )}
          {!pr.approved && rule.model && <div className="callout neutral small mt-12"><LuInfo /><div>El pliego tiene su propio modelo: <strong>{rule.model.name}</strong>{rule.model.doc ? ` (${rule.model.doc}${rule.model.page ? `, p. ${rule.model.page}` : ''})` : ''}. Cuando confirmes el precio, PROPO lo rellenará con estos importes.</div></div>}
          <div className="row mt-16" style={{ gap: 8, flexWrap: 'wrap' }}>
            {!pr.approved && <button className="btn btn-primary" disabled={warns.some((w) => w.level === 'bad')} onClick={confirm}><LuShieldCheck /> Confirmar el precio</button>}
            {pr.approved && <button className="btn btn-primary" onClick={() => navigate(`/app/projects/${p.id}/compliance`)}>Seguir a la comprobación final <LuArrowRight /></button>}
            {!pr.approved && <button className="btn btn-secondary" onClick={adjust}><LuPencil /> Ajustar el precio</button>}
            <button className="btn btn-ghost" onClick={reset}><LuRotateCcw /> Empezar de nuevo</button>
          </div>
        </div>
      )}

      {/* 4 · Otros criterios con fórmula */}
      {rule.others.length > 0 && <OtherCriteria p={p} pr={pr} />}

      <details className="card pr-details" style={{ padding: '14px 18px' }}>
        <summary>Calculadora avanzada: prueba otras rebajas y fórmulas</summary>
        <div className="mt-16"><Economic p={p} /></div>
      </details>
    </div>
  );
}

function OtherCriteria({ p, pr }: { p: Project; pr: PricingState }) {
  const rule = pr.rule!;
  const [draft, setDraft] = useState<Record<string, string>>(() => Object.fromEntries(rule.others.map((o) => [o.id, pr.others[o.id]?.text ?? ''])));
  const [busy, setBusy] = useState<string | null>(null);
  const team = getState().team;
  const store = (id: string, v: { text: string; formal: string; value?: number }) =>
    updateProject(p.id, (x) => { const cur = x.pricing ?? emptyPricing(); cur.others = { ...cur.others, [id]: v }; x.pricing = cur; });
  const saveOne = async (id: string) => {
    const c = rule.others.find((o) => o.id === id)!; const t = (draft[id] || '').trim();
    if (!t) return;
    // Si es una cifra (años, meses…), el compromiso se escribe sin IA, con la cifra en letra y en número.
    const v = c.unit && /^\d+([.,]\d+)?$/.test(t) ? Math.floor(num(t)) : null;
    if (v != null) { store(id, { text: `${v} ${c.unit}`, formal: commitmentText(c, v), value: v }); return; }
    setBusy(id);
    const formal = await formalCommitment(p, c, t);
    setBusy(null);
    store(id, { text: t, formal });
  };
  const total = rule.others.reduce((a, o) => a + (o.points ?? 0), 0);
  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 18 }}>Puntos casi gratis: otros criterios con fórmula</h3>
      <p className="muted mt-4">Además del precio, este pliego da {total ? <strong>{pts(total)} puntos</strong> : 'puntos'} automáticos por estos compromisos. Mucha gente los deja escapar. PROPO te dice qué cifra da el máximo sin pasarte de lo que puedes demostrar, y la escribe en el modelo oficial junto al precio.</p>
      <div className="callout neutral small mt-8"><LuInfo /><div>Estas cifras van solo en el sobre de criterios automáticos, nunca en la memoria técnica: si aparecen antes de tiempo, la mesa puede excluir la oferta.</div></div>
      <div className="stack mt-16" style={{ gap: 14 }}>
        {rule.others.map((o) => {
          const saved = pr.others[o.id];
          const adv = otherAdvice(o, team, p.requirements);
          const typed = o.unit && /^\d+([.,]\d+)?$/.test((draft[o.id] || '').trim()) ? Math.floor(num(draft[o.id])) : null;
          const got = typed != null ? otherPoints(o, typed) : null;
          return (
            <div key={o.id} className="pr-other">
              <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}><strong>{o.label}</strong>{o.points != null && <span className="badge">{pts(o.points)} puntos</span>}</div>
              {o.rule && <div className="xs muted mt-4">{o.rule}</div>}
              <div className="small mt-8"><LuSparkles style={{ verticalAlign: '-2px' }} /> {adv.note}</div>
              {adv.warn && <div className="callout warn small mt-8"><LuTriangleAlert /><div>{adv.warn}</div></div>}
              <label className="small mt-8" style={{ display: 'block' }} htmlFor={`oc-${o.id}`}>{o.ask}</label>
              <div className="row mt-4" style={{ gap: 8, flexWrap: 'wrap' }}>
                <input id={`oc-${o.id}`} className="input" style={o.unit ? { maxWidth: 140 } : undefined} inputMode={o.unit ? 'numeric' : undefined} value={draft[o.id] ?? ''} onChange={(e) => setDraft({ ...draft, [o.id]: e.target.value })} placeholder={o.unit ? `Nº de ${o.unit}` : 'Escríbelo como te salga'} />
                {o.unit && <span className="small muted" style={{ alignSelf: 'center' }}>{o.unit}{got != null ? ` · ${pts(got)} de ${pts(o.points)} puntos` : ''}</span>}
                {adv.value != null && String(adv.value) !== (draft[o.id] || '').trim() && <button className="btn btn-ghost btn-sm" onClick={() => setDraft({ ...draft, [o.id]: String(adv.value) })}>Usar {adv.value}{adv.points != null ? ` (${pts(adv.points)} puntos)` : ''}</button>}
                <button className="btn btn-secondary" disabled={!draft[o.id]?.trim() || busy === o.id} onClick={() => saveOne(o.id)}>{busy === o.id ? 'Redactando…' : saved ? 'Actualizar' : 'Guardar'}</button>
              </div>
              {saved?.formal && <div className="callout small mt-8"><LuCircleCheck /><div><strong>En la oferta pondrá:</strong> {saved.formal}</div></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── El estudio de precio ────────────────────────────────────────────────────────────────────────────────────────────
const r2 = (x: number) => Math.round(x * 100) / 100;
const pctIn = (b: number) => String(Math.round(b * 10000) / 100).replace('.', ',');

/** Dos caminos para el precio: lo escribe el cliente o lo pone PROPO. */
function PriceChooser({ p, pr, rule, m, fmt, save }: { p: Project; pr: PricingState; rule: PriceRule; m: Market; fmt: OfferType; save: (fn: (x: PricingState) => void) => void }) {
  const s = priceStrategy(rule, m, pr.floor);
  const mode = pr.studio?.mode;
  const pick = (v: 'own' | 'propo') => save((x) => { x.studio = { ...(x.studio ?? {}), mode: v }; });
  const lotsBudget = rule.lots.reduce((a, l) => a + (l.budget ?? 0), 0);
  const base = rule.budget ?? (fmt === 'lots' ? lotsBudget : 0);
  return (
    <>
      <div className="card card-pad">
        <h3 style={{ fontSize: 20 }}>¿Qué precio ponemos?</h3>
        <div className="pc-btns mt-12">
          <button className={`pc-btn${mode === 'own' ? ' on' : ''}`} aria-pressed={mode === 'own'} onClick={() => pick('own')}>
            <LuPencil /><strong>Pongo yo el precio</strong><span>{fmt === 'discount' ? 'Escribes tu % de rebaja y ves los puntos y el riesgo.' : fmt === 'units' ? 'Escribes el precio de cada servicio, como pide el pliego, y ves los puntos.' : 'Escribes el importe y ves qué rebaja supone, los puntos y el riesgo.'}</span>
          </button>
          <button className={`pc-btn${mode === 'propo' ? ' on' : ''}`} aria-pressed={mode === 'propo'} onClick={() => pick('propo')}>
            <LuSparkles /><strong>Que PROPO ponga el precio</strong><span>El que más puntos da sin riesgo{base && fmt !== 'discount' ? `: ${eur2(r2(base * (1 - s.rec)))}, ` : ': '}una rebaja del {pct1(s.rec)}.</span>
          </button>
        </div>
      </div>
      {mode === 'propo' && <PriceStudio key="propo" p={p} pr={pr} rule={rule} m={m} fmt={fmt} save={save} />}
      {mode === 'own' && (fmt === 'units' && rule.units.some((u) => u.max != null)
        ? <PriceStudio key="own" manual p={p} pr={pr} rule={rule} m={m} fmt={fmt} save={save} />
        : <OwnPrice p={p} pr={pr} rule={rule} m={m} fmt={fmt} save={save} />)}
    </>
  );
}

/** El cliente escribe su precio (o su % si el pliego pide una rebaja única) y ve lo que supone. */
function OwnPrice({ p, pr, rule, m, fmt, save }: { p: Project; pr: PricingState; rule: PriceRule; m: Market; fmt: OfferType; save: (fn: (x: PricingState) => void) => void }) {
  const s = priceStrategy(rule, m, pr.floor);
  const [txt, setTxt] = useState(pr.studio?.own ?? '');
  const change = (v: string) => { const clean = v.replace(/[^\d.,]/g, ''); setTxt(clean); save((x) => { x.studio = { ...(x.studio ?? {}), own: clean }; }); };
  const isPct = fmt === 'discount';
  const lotsAll = rule.lots.filter((l) => l.budget);
  const selLots = pr.studio?.lots ?? lotsAll.map((l) => l.label);
  const chosenLots = lotsAll.filter((l) => selLots.includes(l.label));
  const base = fmt === 'lots' ? chosenLots.reduce((a, l) => a + l.budget!, 0) : rule.budget ?? 0;
  const v = num(txt);
  const baja = isPct ? v / 100 : base && v ? 1 - v / base : 0;
  const total = isPct ? (base ? r2(base * (1 - baja)) : 0) : v;
  const over = isPct ? v >= 100 : !!base && v > base + 0.005;
  const ready = v > 0 && !over && (fmt !== 'lots' || chosenLots.length > 0);
  const E = ready ? s.exp(Math.max(0, baja)) : null;
  const risky = baja >= s.abn;
  const belowFloor = !!pr.floor && !!total && total < pr.floor;
  const gap = base && !isPct && ready ? r2(total - base * (1 - s.rec)) : null;
  const build = (): PriceChoice => {
    if (isPct) {
      const prices = Object.fromEntries(rule.units.filter((u) => u.max != null).map((u) => [u.id, String(r2(u.max! * (1 - baja)))]));
      return { ...(unitChoice(rule, unitLines(rule, prices), '', baja) ?? { mode: 'own', baja, total: 0, points: E, units: [], discount: baja }), points: E, kind: fmt };
    }
    if (fmt === 'lots') return { mode: 'own', baja, total, points: E, kind: fmt, units: chosenLots.map((l) => ({ id: `lot${rule.lots.indexOf(l)}`, label: l.label, price: r2(l.budget! * (1 - baja)) })) };
    return { mode: 'own', baja, total, points: E, units: unitPricesFor(rule, baja), kind: fmt };
  };
  const use = () => {
    const c = build();
    updateProject(p.id, (x) => { const cur = x.pricing ?? emptyPricing(); cur.choice = c; cur.approved = null; cur.filled = null; cur.fillNote = ''; x.pricing = cur; x.manualChecks.financialApproved = false; });
    toast('Precio preparado. Revísalo y confírmalo.', 'ok');
  };
  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 20 }}>{isPct ? 'Tu % de rebaja' : 'Tu precio'}</h3>
      {fmt === 'lots' && <div className="ps-lots mt-12">{lotsAll.map((l) => { const on = selLots.includes(l.label); return (
        <label key={l.label} className={`ps-lot${on ? ' on' : ''}`}><input type="checkbox" checked={on} onChange={() => save((x) => { const cur = x.studio?.lots ?? lotsAll.map((y) => y.label); x.studio = { ...(x.studio ?? {}), lots: on ? cur.filter((y) => y !== l.label) : [...cur, l.label] }; })} />
          <span className="grow">{l.label}</span><span className="num muted">máx. {eur2(l.budget!)}</span></label>
      ); })}</div>}
      <div className="pr-money pc-input mt-12"><input className="input" inputMode="decimal" autoFocus aria-label={isPct ? 'Porcentaje de rebaja' : 'Tu precio sin IVA'} placeholder={isPct ? pctIn(s.rec).toString() : base ? r2(base * (1 - s.rec)).toLocaleString('es-ES') : '0,00'} value={txt} onChange={(e) => change(e.target.value)} /><span>{isPct ? '% de rebaja sobre los precios máximos' : `€ sin IVA${fmt === 'lots' ? ', por todos los lotes marcados' : ', por todo el contrato'}`}</span></div>
      {v > 0 && <div className="sc-sum mt-16">
        {!isPct && <div className="final"><span>Tu precio, sin IVA</span><strong className="num">{eur2(total)}</strong><em>{eur2(total * (1 + (rule.vat ?? 21) / 100))} con IVA</em></div>}
        {(!!base || isPct) && <div className={over ? 'bad' : isPct ? 'final' : ''}><span>{over ? (isPct ? 'Rebaja no válida' : 'Te pasas del máximo') : 'Rebaja sobre el máximo'}</span><strong className="num">{over ? (isPct ? 'Menos del 100 %' : eur2(v - base)) : pct1(Math.max(0, baja))}</strong>{!!base && !isPct && <em>Máximo: {eur2(base)}</em>}</div>}
        {E != null && <div><span>Puntos que esperas</span><strong className="num">{pts(E)} de {pts(s.P)}</strong><em>Según lo que suelen rebajar los demás</em></div>}
        {ready && !!base && <div className={risky || belowFloor ? 'bad' : 'ok'}><span>Riesgo</span><strong>{risky ? 'Baja temeraria' : belowFloor ? 'Bajo tu coste' : 'Sin riesgo'}</strong><em>{risky ? 'Te pedirían justificarla' : belowFloor ? `Tu mínimo es ${eur2(pr.floor!)}` : `Temeraria a partir del ${pct1(s.abn)}`}</em></div>}
      </div>}
      {over && !isPct && <div className="callout bad small mt-8"><LuTriangleAlert /><div>Una oferta por encima del presupuesto máximo se excluye. Baja el precio hasta {eur2(base)} o menos.</div></div>}
      {gap != null && Math.abs(gap) >= 1 && s.P != null && <p className="small mt-8">{gap > 0 ? <>Para llegar a la rebaja que recomienda PROPO ({pct1(s.rec)}) tendrías que bajar <strong>{eur2(gap)}</strong>.</> : <>Estás <strong>{eur2(-gap)}</strong> por debajo de la rebaja que recomienda PROPO ({pct1(s.rec)}): podrías cobrar más sin perder apenas puntos.</>}</p>}
      <button className="btn btn-primary mt-16" disabled={!ready} onClick={use}>Usar este precio <LuArrowRight /></button>
    </div>
  );
}

/** PROPO elige la rebaja que más puntos da sin riesgo y la presenta en el formato que pide el pliego; el cliente la ajusta. */
function PriceStudio({ p, pr, rule, m, fmt, save, manual }: { p: Project; pr: PricingState; rule: PriceRule; m: Market; fmt: OfferType; save: (fn: (x: PricingState) => void) => void; manual?: boolean }) {
  const s = priceStrategy(rule, m, pr.floor);
  const [b, setB] = useState<number>(manual ? 0 : pr.studio?.b ?? s.rec);   // a mano se parte de los precios máximos
  const [pctTxt, setPctTxt] = useState<string | null>(null);
  const [floorTxt, setFloorTxt] = useState(pr.floor ? String(pr.floor).replace('.', ',') : '');
  const [own, setOwn] = useState(pr.ownText ?? '');
  const [ordering, setOrdering] = useState(false);
  useEffect(() => { if (manual) return; const t = setTimeout(() => { if (pr.studio?.b !== b) save((x) => { x.studio = { ...(x.studio ?? {}), b }; }); }, 500); return () => clearTimeout(t); }, [b]);
  const go = (v: number) => { setB(Math.max(0, Math.min(s.hi, Math.round(v * 200) / 200))); setPctTxt(null); };

  // El precio en el formato de esta licitación
  const auto = (max: number | null) => (max != null ? r2(max * (1 - b)) : null);
  const draft = pr.unitDraft ?? {}; const extra = pr.extraUnits ?? [];
  const overrides = fmt === 'units' ? Object.fromEntries(Object.entries(draft).filter(([k]) => k !== '__pct' && (rule.units.some((u) => u.id === k) || extra.some((x) => x.id === k)))) : {};
  const lotsAll = rule.lots.filter((l) => l.budget);
  const selLots = pr.studio?.lots ?? lotsAll.map((l) => l.label);
  let lines: UnitLine[] = []; let choice: PriceChoice | null = null;
  if (fmt === 'units' || fmt === 'discount') {
    const base = Object.fromEntries(rule.units.filter((u) => u.max != null).map((u) => [u.id, String(auto(u.max))]));
    lines = unitLines(rule, fmt === 'units' ? { ...base, ...overrides } : base, fmt === 'units' ? extra : []);
    choice = fmt === 'units' ? unitChoice(rule, lines, '') : b > 0 ? (unitChoice(rule, lines, '', b) ?? { mode: 'own', baja: b, total: 0, points: null, units: [], discount: b }) : null;
  } else if (fmt === 'lots') {
    const us = lotsAll.filter((l) => selLots.includes(l.label)).map((l) => ({ id: `lot${rule.lots.indexOf(l)}`, label: l.label, price: r2(l.budget! * (1 - b)) }));
    if (us.length) choice = { mode: 'own', baja: b, total: r2(us.reduce((a, u) => a + u.price, 0)), points: null, units: us };
  } else if (rule.budget) choice = { mode: 'own', baja: b, total: r2(rule.budget * (1 - b)), points: null, units: unitPricesFor(rule, b) };
  const eff = choice ? choice.baja : b;
  if (choice) { choice.points = s.exp(eff); choice.kind = fmt; choice.mode = Math.abs(b - s.rec) < 1e-6 && !Object.keys(overrides).length ? 'recommended' : 'own'; }
  const over = lines.filter((l) => l.over);
  const E = s.exp(eff);
  const zone: 'ok' | 'warn' | 'bad' | 'cost' = eff >= s.abn - 1e-9 ? 'bad' : eff > s.abn - 0.01 + 1e-9 ? 'warn' : s.floorCap != null && eff > s.floorCap + 1e-9 ? 'cost' : 'ok';
  const margin = pr.floor && choice?.total ? r2(choice.total - pr.floor) : null;
  const isRec = Math.abs(b - s.rec) < 1e-6;

  const use = () => { if (!choice) return; save((x) => { x.choice = choice; x.approved = null; x.studio = { ...(x.studio ?? {}), b }; }); toast('Precio preparado. Revísalo y confírmalo.', 'ok'); };
  // Si el coste mínimo llega desde la tabla de gastos, la recomendación se recalcula
  const lastFloor = useRef(pr.floor);
  useEffect(() => {
    if (lastFloor.current === pr.floor) return;
    lastFloor.current = pr.floor;
    setFloorTxt(pr.floor ? String(pr.floor).replace('.', ',') : '');
    go(priceStrategy(rule, m, pr.floor).rec);
  }, [pr.floor]);
  const applyFloor = () => { const f = num(floorTxt) || null; save((x) => { x.floor = f; }); go(priceStrategy(rule, m, f).rec); };
  const order = async () => {
    if (!own.trim()) return;
    setOrdering(true); const c = await readOwnPrices(p, rule, own); setOrdering(false);
    if (!c) { toast('No hemos encontrado ningún importe en lo que has escrito. Prueba con algo como «el menú a 6,50 €».', 'warn'); return; }
    save((x) => { x.ownText = own; x.choice = c; x.approved = null; });
  };

  return (
    <div className="card card-pad ps-studio">
      {manual ? <>
        <h3 style={{ fontSize: 20 }}>Pon tu precio a cada servicio</h3>
        <p className="muted mt-4">Este pliego pide un precio por servicio. Cada uno empieza en su máximo: cámbialo por el tuyo, sin IVA. Ninguno puede pasar del máximo.</p>
      </> : <>
      <div className="eyebrow"><LuTarget style={{ verticalAlign: '-2px' }} /> El precio de PROPO</div>
      <h3 className="mt-8" style={{ fontSize: 22 }}>PROPO te recomienda una rebaja del <span className="ps-accent">{pct1(s.rec)}</span></h3>
      <p className="muted mt-4" style={{ lineHeight: 1.6 }}>{s.P ? <>Es el punto donde consigues casi todos los puntos del precio ({pts(s.exp(s.rec))} de {pts(s.P)}) sin regalar dinero y sin entrar en la baja temeraria. </> : null}Puedes moverla tú: la curva te enseña lo que ganas y lo que arriesgas.</p>

      {s.P != null && <PointsCurve s={s} b={eff} onPick={go} />}

      <div className="ps-ctrl">
        <button className="btn btn-secondary btn-icon" aria-label="Medio punto menos de rebaja" onClick={() => go(b - 0.005)}><LuMinus /></button>
        <div className="ps-pct"><input inputMode="decimal" aria-label="Rebaja en %" value={pctTxt ?? pctIn(b)} onChange={(e) => { setPctTxt(e.target.value); const v = Number(e.target.value.replace(',', '.')); if (e.target.value.trim() && !isNaN(v)) setB(Math.max(0, Math.min(0.9, v / 100))); }} onBlur={() => setPctTxt(null)} /><span>%</span></div>
        <button className="btn btn-secondary btn-icon" aria-label="Medio punto más de rebaja" onClick={() => go(b + 0.005)}><LuPlus /></button>
        <div className="ps-quick">
          <button className={`uc-chip${isRec ? ' on' : ''}`} onClick={() => go(s.rec)}><LuSparkles /> Recomendada · {pct1(s.rec)}</button>
          {s.safe > s.rec + 0.001 && <button className={`uc-chip${Math.abs(b - s.safe) < 1e-6 ? ' on' : ''}`} onClick={() => go(s.safe)}>Máximo seguro · {pct1(s.safe)}</button>}
        </div>
      </div>

      <div className="ps-read">
        <div><span>Puntos que esperas</span><strong className="num">{E != null ? pts(E) : '—'}<small> de {pts(s.P)}</small></strong>{E != null && s.P ? <div className="ps-meter"><i style={{ width: `${Math.min(100, (E / s.P) * 100)}%` }} /></div> : null}</div>
        <div><span>{fmt === 'total' ? 'Tu precio, sin IVA' : fmt === 'lots' ? `Total de ${choice?.units.length ?? 0} lotes, sin IVA` : fmt === 'discount' ? 'Tu oferta' : 'Tus precios'}</span>
          <strong className="num">{fmt === 'discount' ? `−${pct1(b)}` : fmt === 'units' ? `${lines.filter((l) => l.price != null).length} servicios` : choice?.total ? eur2(choice.total) : '—'}</strong>
          <em>{fmt === 'discount' ? 'en todos los servicios' : fmt === 'units' ? `rebaja media del ${pct1(eff)}` : rule.budget ? `rebaja del ${pct1(eff)}` : ''}</em></div>
        <div className={`ps-risk ${zone}`}><span>Riesgo</span>
          <strong>{zone === 'ok' ? <><LuShieldCheck /> Sin riesgo</> : zone === 'warn' ? <><LuTriangleAlert /> Rozando la temeraria</> : zone === 'bad' ? <><LuTriangleAlert /> Baja temeraria</> : <><LuTriangleAlert /> Bajo tu coste</>}</strong>
          <em>{zone === 'bad' ? 'Te pedirían justificarla' : zone === 'cost' ? 'Perderías dinero' : margin != null ? (margin >= 0 ? `${eur2(margin)} sobre tu coste` : `${eur2(-margin)} bajo tu coste`) : `Temeraria a partir del ${pct1(s.abn)}`}</em></div>
      </div>

      <div className="ps-why">
        <div className="ps-why-t"><LuSparkles /> Por qué este precio</div>
        <ul>{s.why.map((w, i) => <li key={i}>{w}</li>)}</ul>
      </div>
      </>}

      {(fmt === 'units' || fmt === 'discount') && lines.length > 0 && <>
        {!manual && <h4 className="ps-sub">{fmt === 'discount' ? 'Así quedan tus servicios con esta rebaja' : 'Así quedan tus precios'}</h4>}
        <p className={`small muted${manual ? ' mt-16' : ''}`}>{manual ? '' : fmt === 'discount' ? 'No tienes que escribir nada: el pliego aplica tu % a todos los precios máximos. ' : 'PROPO ha puesto cada precio con la rebaja elegida. Si quieres, cambia cualquiera: no te dejará pasar del máximo. '}Toca un servicio para ver qué tienes que dar.</p>
        <ServiceCards p={p} pr={pr} save={save} lines={lines} editable={fmt === 'units'} edited={Object.keys(overrides)} auto={auto} />
        {fmt === 'units' && Object.keys(overrides).length > 0 && <button className="link small mt-8" onClick={() => save((x) => { x.unitDraft = {}; })}><LuRotateCcw style={{ verticalAlign: '-2px' }} /> Volver a calcular todos con la rebaja elegida</button>}
      </>}

      {fmt === 'lots' && <>
        <h4 className="ps-sub">¿A qué lotes te presentas?</h4>
        <div className="ps-lots">{lotsAll.map((l) => { const on = selLots.includes(l.label); return (
          <label key={l.label} className={`ps-lot${on ? ' on' : ''}`}><input type="checkbox" checked={on} onChange={() => save((x) => { const cur = x.studio?.lots ?? lotsAll.map((y) => y.label); x.studio = { ...(x.studio ?? {}), lots: on ? cur.filter((y) => y !== l.label) : [...cur, l.label] }; })} />
            <span className="grow">{l.label}</span><span className="num muted strike-s">{eur2(l.budget!)}</span><strong className="num">{on ? eur2(r2(l.budget! * (1 - b))) : '—'}</strong></label>
        ); })}</div>
      </>}

      {!manual && <>
      <details className="ps-floor mt-20" open={!!pr.floor}>
        <summary><span><strong>¿Sabes tu coste mínimo?</strong> Opcional: con él PROPO nunca te recomienda un precio con el que pierdas dinero.</span></summary>
        <div className="row mt-12" style={{ gap: 8, flexWrap: 'wrap' }}>
          <div className="pr-money"><input className="input" inputMode="decimal" placeholder={rule.budget ? `p. ej. ${Math.round(rule.budget * 0.82).toLocaleString('es-ES')}` : 'importe'} value={floorTxt} onChange={(e) => setFloorTxt(e.target.value)} aria-label="Coste mínimo sin IVA" /><span>€ sin IVA, todo el contrato</span></div>
          <button className="btn btn-secondary" onClick={applyFloor}>{num(floorTxt) ? 'Recalcular' : 'Quitar'}</button>
        </div>
        <div className="xs muted mt-8">Suma personal (salario de convenio más un tercio de Seguridad Social), materiales, medios, gastos generales y el beneficio mínimo que quieres, para toda la duración{p.analysis?.duration ? ` (${p.analysis.duration})` : ''}. Es un dato interno: no aparece en ningún documento.</div>
      </details>

      <details className="ps-floor mt-8">
        <summary><span><strong>¿Prefieres escribir tus precios con tus palabras?</strong> PROPO los ordena sin cambiar ningún importe.</span></summary>
        <textarea className="textarea mt-12" rows={3} value={own} onChange={(e) => setOwn(e.target.value)} placeholder={rule.units.length ? `Por ejemplo: ${rule.units.slice(0, 2).map((u) => `${u.label.toLowerCase()} a ${u.max ? (Math.round(u.max * 0.9 * 100) / 100).toString().replace('.', ',') : '…'} €`).join(', ')}…` : 'Por ejemplo: 198.500 euros sin IVA por todo el contrato'} />
        <button className="btn btn-secondary mt-8" disabled={!own.trim() || ordering} onClick={order}>{ordering ? 'Ordenando…' : 'Que PROPO lo ordene'}</button>
      </details>

      </>}

      <div className="uc-bar mt-20">
        <div className="uc-bar-txt">
          {choice ? <><strong>{fmt === 'discount' ? `${pct1(b)} de rebaja` : fmt === 'units' ? `${lines.filter((l) => l.price != null).length} precios` : eur2(choice.total)}</strong>{E != null && <> · <strong>{pts(E)}</strong> de {pts(s.P)} puntos esperados</>}</> : fmt === 'lots' ? 'Elige al menos un lote' : 'Elige tu rebaja'}
          {over.length > 0 && <div className="xs" style={{ color: 'var(--bad-ink)' }}>{over.length === 1 ? '1 precio pasa' : `${over.length} precios pasan`} del máximo</div>}
          {zone === 'bad' && <div className="xs" style={{ color: 'var(--bad-ink)' }}>En zona de baja temeraria</div>}
        </div>
        <button className="btn btn-primary" disabled={!choice || over.length > 0} onClick={use}>Usar este precio <LuArrowRight /></button>
      </div>
    </div>
  );
}

/** Curva de puntos esperados según la rebaja, con las zonas de riesgo y la recomendación de PROPO. */
function PointsCurve({ s, b, onPick }: { s: Strategy; b: number; onPick: (b: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640); const [hov, setHov] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width)))); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = 230, L = 36, R = 14, T = 26, B = 28; const P = s.P ?? 1;
  const x = (v: number) => L + (Math.min(v, s.hi) / s.hi) * (w - L - R);
  const y = (v: number) => T + (1 - v / P) * (H - T - B);
  const pts0: [number, number][] = []; for (let i = 0; i <= 160; i++) { const v = (s.hi * i) / 160; pts0.push([v, s.exp(v) ?? 0]); }
  const line = pts0.map(([v, q], i) => `${i ? 'L' : 'M'}${x(v).toFixed(1)},${y(q).toFixed(1)}`).join('');
  const area = `${line}L${x(s.hi).toFixed(1)},${y(0)}L${x(0)},${y(0)}Z`;
  const step = s.hi > 0.3 ? 0.1 : s.hi > 0.15 ? 0.05 : 0.02;
  const ticks: number[] = []; for (let v = 0; v <= s.hi + 1e-9; v += step) ticks.push(Math.round(v * 1000) / 1000);
  const at = (e: React.PointerEvent<SVGSVGElement>) => { const r = e.currentTarget.getBoundingClientRect(); return Math.max(0, Math.min(s.hi, ((e.clientX - r.left - L) / (w - L - R)) * s.hi)); };
  const warnFrom = Math.max(0, s.abn - 0.01);
  const cur = s.exp(b) ?? 0; const hv = hov != null ? s.exp(hov) ?? 0 : 0;
  const tipX = hov != null ? Math.min(Math.max(x(hov), L + 58), w - R - 58) : 0;
  return (
    <div ref={ref} className="ps-chart">
      <svg width={w} height={H} role="img" aria-label={`Puntos esperados según la rebaja. Recomendada: ${pct1(s.rec)}. Baja temeraria a partir del ${pct1(s.abn)}.`}
        onPointerMove={(e) => setHov(at(e))} onPointerLeave={() => setHov(null)} onClick={(e) => onPick(at(e))}>
        <defs><pattern id="ps-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" className="ps-hatch-l" /></pattern></defs>
        {s.floorCap != null && s.floorCap < s.hi && <rect x={x(s.floorCap)} y={T} width={x(s.hi) - x(s.floorCap)} height={H - T - B} fill="url(#ps-hatch)" />}
        <rect x={x(warnFrom)} y={T} width={x(s.abn) - x(warnFrom)} height={H - T - B} className="ps-z-warn" />
        <rect x={x(s.abn)} y={T} width={Math.max(0, x(s.hi) - x(s.abn))} height={H - T - B} className="ps-z-bad" />
        <text x={x(s.abn) + 6} y={T + 14} className="ps-z-t">Baja temeraria</text>
        {s.floorCap != null && s.floorCap < s.abn - 0.03 && <text x={x(s.floorCap) + 6} y={H - B - 8} className="ps-z-t">Bajo tu coste</text>}
        {[0, 0.5, 1].map((f) => <g key={f}><line x1={L} x2={w - R} y1={y(P * f)} y2={y(P * f)} className="ps-grid" /><text x={L - 6} y={y(P * f) + 4} className="ps-ax" textAnchor="end">{pts(P * f)}</text></g>)}
        {ticks.map((t) => <text key={t} x={x(t)} y={H - 8} className="ps-ax" textAnchor="middle">{Math.round(t * 100)} %</text>)}
        <path d={area} className="ps-area" />
        <path d={line} className="ps-line" />
        <line x1={x(s.rec)} x2={x(s.rec)} y1={T - 8} y2={H - B} className="ps-rec" />
        <text x={Math.min(x(s.rec), w - R - 70)} y={T - 12} className="ps-rec-t" textAnchor={x(s.rec) < L + 60 ? 'start' : 'middle'}>Recomendada</text>
        {hov != null && <g pointerEvents="none">
          <line x1={x(hov)} x2={x(hov)} y1={T} y2={H - B} className="ps-cross" />
          <circle cx={x(hov)} cy={y(hv)} r={4} className="ps-hdot" />
          <rect x={tipX - 56} y={y(hv) - 40 < T ? y(hv) + 12 : y(hv) - 40} width={112} height={28} rx={8} className="ps-tip" />
          <text x={tipX} y={(y(hv) - 40 < T ? y(hv) + 12 : y(hv) - 40) + 18} className="ps-tip-t" textAnchor="middle">{pct1(hov)} · {pts(hv)} puntos</text>
        </g>}
        <line x1={x(b)} x2={x(b)} y1={y(cur)} y2={H - B} className="ps-cur-l" />
        <circle cx={x(b)} cy={y(cur)} r={7} className="ps-cur" />
      </svg>
      <input type="range" className="ps-range" min={0} max={Math.round(s.hi * 200)} step={1} value={Math.round(b * 200)} onChange={(e) => onPick(Number(e.target.value) / 200)} aria-label="Rebaja" style={{ marginLeft: L - 9, width: `calc(100% - ${L + R - 18}px)` }} />
    </div>
  );
}

/** Los servicios con precio en tarjetas agrupadas, con lo que pide el pliego en cada uno explicado en claro. */
const explaining = new Set<string>();   // proyectos cuya explicación de conceptos ya se está pidiendo

/** «Desayuno · Coffe break» → grupo «Desayuno», nombre «Coffe break». */
function splitLabel(label: string): { group: string; name: string } {
  const i = label.indexOf(' · ');
  if (i > 0) return { group: label.slice(0, i).trim(), name: label.slice(i + 3).trim() };
  const w = label.split(/\s+/)[0];
  return { group: /^packs?$/i.test(w) ? 'Packs' : 'Servicios', name: label };
}
const firstSentence = (t: string) => { const m = t.match(/^.+?[.!?](\s|$)/); return (m ? m[0] : t).trim(); };

function ServiceCards({ p, pr, save, lines, editable, edited, auto }: { p: Project; pr: PricingState; save: (fn: (x: PricingState) => void) => void; lines: UnitLine[]; editable: boolean; edited: string[]; auto: (max: number | null) => number | null }) {
  const rule = pr.rule!;
  const extra = pr.extraUnits ?? []; const draft = pr.unitDraft ?? {};
  const [newLabel, setNewLabel] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const info = pr.unitInfoV === UNIT_INFO_V ? pr.unitInfo : null; const loadingInfo = rule.units.length > 0 && info == null && !pr.unitInfoError;
  const fetchInfo = () => {
    if (explaining.has(p.id)) return; explaining.add(p.id);
    save((x) => { x.unitInfoError = false; });
    explainUnits(p, rule).then((r) => save((x) => { x.unitInfo = r; x.unitInfoV = UNIT_INFO_V; }), () => save((x) => { x.unitInfoError = true; })).finally(() => explaining.delete(p.id));
  };
  useEffect(() => { if (loadingInfo) fetchInfo(); }, [p.id]);   // una sola vez por proyecto: queda guardado
  const set = (id: string, v: string) => save((x) => { x.unitDraft = { ...(x.unitDraft ?? {}), [id]: v.replace(/[^\d.,]/g, '') }; });
  const unset = (id: string) => save((x) => { const d = { ...(x.unitDraft ?? {}) }; delete d[id]; x.unitDraft = d; });
  const shown = (l: UnitLine) => (draft[l.id] != null && edited.includes(l.id) ? draft[l.id] : l.price != null ? l.price.toFixed(2).replace('.', ',') : '');
  const groups: { name: string; items: (UnitLine & { short: string })[] }[] = [];
  for (const l of lines) {
    const { group, name } = extra.some((x) => x.id === l.id) ? { group: 'Servicios que has añadido', name: l.label } : splitLabel(l.label);
    let g = groups.find((x) => x.name === group); if (!g) groups.push(g = { name: group, items: [] });
    g.items.push({ ...l, short: name });
  }
  const order = lines.filter((l) => rule.units.some((u) => u.id === l.id)).map((l) => l.id); const idx = open ? order.indexOf(open) : -1;
  const cur = open ? lines.find((l) => l.id === open) : null; const inf = open ? info?.[open] : null;
  const priceIn = (l: UnitLine) => <div className="uc-in"><input inputMode="decimal" aria-label={`Precio de ${l.label}`} value={shown(l)} placeholder="0,00" onChange={(e) => set(l.id, e.target.value)} /><span>€</span></div>;

  return (
    <>
      {loadingInfo && <div className="uc-note mt-12"><LuLoaderCircle className="spin" /> PROPO está leyendo el pliego para explicarte cada servicio. Tarda un minuto y solo se hace una vez.</div>}
      {pr.unitInfoError && <div className="uc-note mt-12">No se ha podido leer el pliego ahora. <button className="btn btn-ghost btn-sm" onClick={fetchInfo}><LuRotateCcw /> Reintentar</button></div>}
      {groups.map((g) => (
        <section key={g.name} className="mt-16">
          <div className="uc-group"><span>{g.name}</span><span className="uc-count">{g.items.length}</span></div>
          <div className="uc-grid">
            {g.items.map((l) => { const i = info?.[l.id]; const isUnit = rule.units.some((u) => u.id === l.id); const mine = edited.includes(l.id); return (
              <div key={l.id} className={`uc${l.over ? ' bad' : ''}${mine && !l.over ? ' mine' : ''}`}>
                <button className="uc-top" disabled={!isUnit} onClick={() => setOpen(l.id)} aria-label={`Qué incluye ${l.label}`}>
                  <div className="uc-name">{l.short}</div>
                  {l.unit && l.unit.toLowerCase() !== l.label.toLowerCase() && <div className="uc-unit">{unitText(l.unit)}</div>}
                  {isUnit && (i ? <p className="uc-desc">{firstSentence(i.plain)}</p> : loadingInfo ? <div className="uc-skel"><span /><span /></div> : null)}
                  {isUnit && <span className="uc-more">Qué incluye <LuChevronRight /></span>}
                </button>
                <div className="uc-foot">
                  <div className="uc-max"><span>Máximo</span>{l.max != null ? <strong className={l.price != null && l.price < l.max ? 'strike' : ''}>{eur2(l.max)}</strong> : <strong className="muted">—</strong>}</div>
                  {editable ? priceIn(l) : <div className="uc-res"><span>Te queda en</span><strong>{l.price != null ? eur2(l.price) : '—'}</strong></div>}
                </div>
                {l.over && <div className="uc-warn"><LuTriangleAlert /> Pasa del máximo: bájalo</div>}
                {mine && !l.over && isUnit && <button className="uc-reset" onClick={() => unset(l.id)}>Ajustado por ti · volver a {auto(l.max) != null ? eur2(auto(l.max)!) : 'calcular'}</button>}
                {l.qty != null && l.subtotal != null && <div className="xs muted" style={{ padding: '0 14px 10px' }}>{l.qty.toLocaleString('es-ES')} previstos · {eur2(l.subtotal)}</div>}
                {!isUnit && <button className="uc-del" aria-label="Quitar servicio" onClick={() => save((x) => { x.extraUnits = (x.extraUnits ?? []).filter((y) => y.id !== l.id); const d = { ...(x.unitDraft ?? {}) }; delete d[l.id]; x.unitDraft = d; })}><LuTrash2 /></button>}
              </div>
            ); })}
          </div>
        </section>
      ))}
      {editable && <div className="row-wrap mt-12" style={{ gap: 6 }}>
        <input className="input" style={{ maxWidth: 280, height: 36 }} placeholder="¿Falta un servicio? Escríbelo aquí" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
        <button className="btn btn-ghost btn-sm" disabled={!newLabel.trim()} onClick={() => { save((x) => { x.extraUnits = [...(x.extraUnits ?? []), { id: uid('cu'), label: newLabel.trim(), unit: '' }]; }); setNewLabel(''); }}><LuPlus /> Añadir</button>
      </div>}

      {cur && <Drawer title={splitLabel(cur.label).name} onClose={() => setOpen(null)}
        footer={<div className="row" style={{ width: '100%', justifyContent: 'space-between' }}>
          <button className="btn btn-ghost btn-sm" disabled={idx <= 0} onClick={() => setOpen(order[idx - 1])}><LuChevronLeft /> Anterior</button>
          <button className="btn btn-ghost btn-sm" disabled={idx < 0 || idx >= order.length - 1} onClick={() => setOpen(order[idx + 1])}>Siguiente <LuChevronRight /></button>
        </div>}>
        <div className="xs muted">{splitLabel(cur.label).group}{cur.unit ? ` · ${unitText(cur.unit)}` : ''}</div>
        <div className="uc-dprice mt-12">
          <div><span>Máximo del pliego</span><strong>{cur.max != null ? eur2(cur.max) : '—'}</strong></div>
          <div><span>{editable ? 'Tu precio' : 'Con tu rebaja'}</span>{editable ? priceIn(cur) : <strong className="ok">{cur.price != null ? eur2(cur.price) : '—'}</strong>}</div>
        </div>
        {inf ? <>
          <p className="mt-16" style={{ fontSize: 15, lineHeight: 1.6 }}>{inf.plain}</p>
          {inf.includes.length > 0 && <>
            <h4 className="mt-20" style={{ fontSize: 13, color: 'var(--fg-3)', fontWeight: 600 }}>LO QUE TIENES QUE DAR</h4>
            <ul className="uc-list mt-8">{inf.includes.map((x, k) => /^(sin|no)\b/i.test(x) ? <li key={k} className="no"><LuMinus />{x}</li> : <li key={k}><LuCheck />{x}</li>)}</ul>
          </>}
          {inf.watch && <div className="uc-watch mt-16"><LuTriangleAlert /><div><strong>Tenlo en cuenta en el precio</strong><br />{inf.watch}</div></div>}
          {inf.doc && <p className="xs muted mt-16"><LuFileText style={{ verticalAlign: '-2px' }} /> {inf.doc}{inf.page ? `, página ${inf.page}` : ''}. Lo ha resumido la IA de PROPO: compruébalo en el pliego antes de presentar.</p>}
        </> : loadingInfo ? <div className="uc-note mt-16"><LuLoaderCircle className="spin" /> PROPO está leyendo el pliego. En un momento aparece aquí.</div>
          : <p className="muted mt-16">El pliego no detalla qué incluye este servicio. Si tienes dudas, puedes preguntarlo al órgano de contratación antes de que acabe el plazo.</p>}
      </Drawer>}
    </>
  );
}
