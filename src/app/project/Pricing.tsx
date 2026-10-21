// Paso «El precio»: PROPO explica cómo puntúa el precio este pliego, propone tres precios a partir del mínimo que le
// compensa al cliente (o ordena los que él escriba con sus palabras) y, al confirmarlo, prepara la oferta económica.
import React, { useEffect, useState } from 'react';
import { LuInfo, LuTriangleAlert, LuCircleCheck, LuSparkles, LuPencil, LuRotateCcw, LuArrowRight, LuShieldCheck, LuLoaderCircle } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { updateProject, navigate, toast } from '../../lib/store';
import {
  emptyPricing, readPriceRule, marketFor, priceOptions, choose, readOwnPrices, formalCommitment, priceWarnings, eurosInWords, eur2, pct1, num,
  type Pricing as PricingState, type Market, type Option,
} from '../../lib/pricing';
import { Economic } from './Economic';

const MODE: Record<Option['mode'], { t: string; d: string }> = {
  prudent: { t: 'Prudente', d: 'Buen margen y menos riesgo. Das algunos puntos.' },
  recommended: { t: 'Recomendada', d: 'Lo que más puntos da sin entrar en zona de riesgo.' },
  aggressive: { t: 'Agresiva', d: 'Máximos puntos, muy cerca de la baja temeraria.' },
};
const pts = (x: number | null) => (x == null ? '—' : String(Math.round(x * 10) / 10).replace('.', ','));

export function Pricing({ p }: { p: Project }) {
  const pr: PricingState = p.pricing ?? emptyPricing();
  const rule = pr.rule;
  const [reading, setReading] = useState(false);
  const [market, setMarket] = useState<Market | null>(null);
  const [floorTxt, setFloorTxt] = useState(pr.floor ? String(pr.floor).replace('.', ',') : '');
  const [budgetTxt, setBudgetTxt] = useState('');
  const [showOpts, setShowOpts] = useState(!!pr.floor && !pr.choice);
  const [own, setOwn] = useState(pr.ownText ?? '');
  const [ordering, setOrdering] = useState(false);
  const save = (fn: (x: PricingState) => void) => updateProject(p.id, (x) => { const cur = x.pricing ?? emptyPricing(); fn(cur); x.pricing = cur; });

  useEffect(() => {
    let on = true;
    marketFor(p).then((m) => { if (on) setMarket(m); });
    if (!rule && !reading) {
      setReading(true);
      readPriceRule(p).then((r) => { if (on) save((x) => { x.rule = r; }); }).finally(() => { if (on) setReading(false); });
    }
    return () => { on = false; };
  }, [p.id]);

  if (!rule) {
    return (
      <div className="card card-pad pr-loading">
        <LuLoaderCircle className="spin" style={{ width: 22, height: 22, color: 'var(--accent)', flex: 'none' }} aria-hidden="true" />
        <div><strong>PROPO está leyendo cómo se puntúa el precio en este pliego…</strong><div className="small muted mt-4">Busca la fórmula, los puntos, el presupuesto máximo y cuándo una oferta se considera temeraria. Tarda menos de un minuto.</div></div>
      </div>
    );
  }

  const m = market ?? { mean: 0.08, best: 0.15, n: 0, scope: '' };
  const calc = rule.budget ? priceOptions(rule, m, pr.floor) : null;
  const ch = pr.choice;
  const warns = ch ? priceWarnings(rule, ch, market) : [];
  const vat = rule.vat ?? 21;

  const compute = (withFloor: boolean) => {
    const f = withFloor ? num(floorTxt) : null;
    save((x) => { x.floor = f || null; x.choice = null; x.approved = null; });
    setShowOpts(true);
  };
  const pick = (o: Option) => { save((x) => { x.choice = choose(rule, o); x.approved = null; }); setShowOpts(false); };
  const order = async () => {
    if (!own.trim()) return;
    setOrdering(true);
    const c = await readOwnPrices(p, rule, own);
    setOrdering(false);
    if (!c) { toast('No hemos encontrado ningún importe en lo que has escrito. Prueba con algo como «el menú a 6,50 €».', 'warn'); return; }
    save((x) => { x.ownText = own; x.choice = c; x.approved = null; });
    setShowOpts(false);
  };
  const confirm = () => {
    updateProject(p.id, (x) => { x.pricing = { ...(x.pricing ?? emptyPricing()), approved: new Date().toISOString() }; x.manualChecks.financialApproved = true; x.activity.unshift({ at: new Date().toISOString(), text: 'Precio de la oferta confirmado' }); });
    toast('Precio confirmado. Va en la oferta económica del paquete.', 'ok');
  };
  const reset = () => { updateProject(p.id, (x) => { x.pricing = { ...(x.pricing ?? emptyPricing()), choice: null, approved: null, ownText: '' }; x.manualChecks.financialApproved = false; }); setOwn(''); setShowOpts(false); };

  return (
    <div className="stack gap-16">
      {/* 1 · Cómo se puntúa */}
      <div className="card card-pad">
        <div className="eyebrow">Paso 3 · El precio</div>
        <h2 className="mt-8" style={{ fontSize: 22 }}>Cómo se puntúa el precio en esta licitación</h2>
        <p className="mt-8" style={{ fontSize: 15, lineHeight: 1.6 }}>{rule.plain}</p>
        <div className="pr-kpis mt-16">
          <div><div className="xs subtle">El precio vale</div><div className="pr-k num">{rule.points ? `${pts(rule.points)} puntos` : '—'}</div><div className="xs muted">{rule.totalPoints ? `de ${pts(rule.totalPoints)} en total` : ''}</div></div>
          <div><div className="xs subtle">Precio máximo (sin IVA)</div><div className="pr-k num">{rule.budget ? eur2(rule.budget) : '—'}</div><div className="xs muted">Por encima, te excluyen</div></div>
          <div><div className="xs subtle">Lo habitual</div><div className="pr-k num">{market ? `−${pct1(m.mean)}` : '…'}</div><div className="xs muted">{m.n ? `Rebaja media en ${m.n} contratos ${m.scope}` : 'Rebaja típica estimada'}</div></div>
          <div><div className="xs subtle">Zona de riesgo</div><div className="pr-k num">{calc ? `más de −${pct1(calc.abnormal)}` : '—'}</div><div className="xs muted">Baja temeraria: habría que justificarla</div></div>
        </div>
        {!rule.budget && (
          <div className="callout warn mt-16"><LuTriangleAlert /><div className="grow"><strong>No hemos encontrado el presupuesto máximo.</strong> Escríbelo (sin IVA) para poder calcular el precio.
            <div className="row mt-8" style={{ gap: 8 }}><input className="input" style={{ maxWidth: 220 }} inputMode="decimal" placeholder="p. ej. 240.000" value={budgetTxt} onChange={(e) => setBudgetTxt(e.target.value)} /><button className="btn btn-primary" disabled={!num(budgetTxt)} onClick={() => save((x) => { if (x.rule) x.rule.budget = num(budgetTxt); })}>Guardar</button></div></div></div>
        )}
        {(rule.formulaText || rule.abnormalText) && (
          <details className="pr-details mt-16"><summary>Ver la fórmula y la regla de baja temeraria del pliego</summary>
            {rule.formulaText && <p className="small mt-8"><strong>Fórmula:</strong> {rule.formulaText}</p>}
            {rule.satiation != null && <p className="small mt-4"><strong>Umbral de saciedad:</strong> a partir de una rebaja del {pts(rule.satiation)} % no se dan más puntos.</p>}
            <p className="small mt-4"><strong>Oferta anormalmente baja:</strong> {rule.abnormalText}</p>
            {rule.source && <p className="xs subtle mt-4">«{rule.source.quote}» · {rule.source.doc}{rule.source.page ? `, p. ${rule.source.page}` : ''}</p>}
          </details>
        )}
        {rule.labor && <div className="callout warn small mt-12"><LuTriangleAlert /><div><strong>Ojo con los costes de personal.</strong> {rule.labor} Un precio que no cubra estos costes se puede excluir.</div></div>}
        {rule.mode === 'rules' && <div className="callout neutral small mt-12"><LuInfo /><div>No hemos podido leer la fórmula exacta con la IA: estos datos salen del análisis general. Compruébalos en el apartado de criterios de adjudicación del pliego.</div></div>}
      </div>

      {/* 2 · Tus números */}
      {!!rule.budget && !ch && (
        <div className="card card-pad">
          <h3 style={{ fontSize: 18 }}>¿Por debajo de qué precio no te compensa hacerlo?</h3>
          <p className="muted mt-4">Suma lo que te cuesta prestar el servicio (personal, materiales, desplazamientos…) y el beneficio mínimo que quieres ganar. Con ese número PROPO calcula el precio que más puntos te da <strong>sin que pierdas dinero</strong>. Solo lo usamos para el cálculo: no va en la oferta.</p>
          <div className="row mt-12" style={{ gap: 8, flexWrap: 'wrap' }}>
            <div className="pr-money"><input className="input" inputMode="decimal" placeholder={`p. ej. ${Math.round(rule.budget * 0.82).toLocaleString('es-ES')}`} value={floorTxt} onChange={(e) => setFloorTxt(e.target.value)} aria-label="Precio mínimo sin IVA" /><span>€ sin IVA, en total</span></div>
            <button className="btn btn-primary" disabled={!num(floorTxt)} onClick={() => compute(true)}><LuSparkles /> Que PROPO calcule el mejor precio</button>
          </div>
          <button className="link small mt-8" onClick={() => compute(false)}>Todavía no lo sé: enséñame las opciones igualmente</button>

          {showOpts && calc && (
            <>
              {!pr.floor && <div className="callout warn small mt-16"><LuTriangleAlert /><div>Sin tu precio mínimo no podemos saber si estas opciones te dejan beneficio. Revísalas con tus números antes de elegir.</div></div>}
              {calc.limit === 'floor' && <div className="callout neutral small mt-16"><LuInfo /><div>Tu precio mínimo limita la rebaja: ninguna opción baja de {eur2(pr.floor!)}. Puede que otros ofrezcan menos; compensa con una buena memoria técnica.</div></div>}
              <div className="pr-opts mt-16">
                {calc.options.map((o) => (
                  <div key={o.mode} className={`pr-opt ${o.mode === 'recommended' ? 'rec' : ''}`}>
                    {o.mode === 'recommended' && <span className="price-flag">La que te recomendamos</span>}
                    <div className="pr-opt-t">{MODE[o.mode].t}</div>
                    <div className="pr-opt-p num">{eur2(o.total)}</div>
                    <div className="small muted">rebaja del {pct1(o.baja)} · sin IVA</div>
                    <ul>
                      <li><strong>{pts(o.points)}</strong> de {pts(rule.points)} puntos del precio (estimado)</li>
                      {o.margin != null && <li>{o.margin >= 0 ? <>Te deja <strong>{eur2(o.margin)}</strong> por encima de tu mínimo</> : <>Está {eur2(-o.margin)} por debajo de tu mínimo</>}</li>}
                      <li className={o.risky ? 'risk' : ''}>{o.risky ? 'En zona de baja temeraria' : 'Fuera de la zona de riesgo'}</li>
                    </ul>
                    <p className="xs muted">{MODE[o.mode].d}</p>
                    <button className={`btn ${o.mode === 'recommended' ? 'btn-primary' : 'btn-secondary'} mt-8`} onClick={() => pick(o)}>Elegir este precio</button>
                  </div>
                ))}
              </div>
              <p className="xs subtle mt-8">Los puntos dependen de lo que oferten los demás: los estimamos con las rebajas de contratos parecidos. La decisión final es tuya.</p>
            </>
          )}

          <div className="pr-own mt-24">
            <h3 style={{ fontSize: 16 }}><LuPencil style={{ verticalAlign: -2 }} /> ¿Prefieres poner tus precios?</h3>
            <p className="small muted mt-4">Escríbelos con tus palabras, como se los dirías a un compañero. PROPO los ordena y los pasa al formato oficial de la oferta, <strong>sin cambiar ningún importe</strong>.</p>
            <textarea className="textarea mt-8" rows={3} value={own} onChange={(e) => setOwn(e.target.value)} placeholder={rule.units.length ? `Por ejemplo: ${rule.units.slice(0, 2).map((u) => `${u.label.toLowerCase()} a ${u.max ? (Math.round(u.max * 0.9 * 100) / 100).toString().replace('.', ',') : '…'} €`).join(', ')}…` : 'Por ejemplo: 198.500 euros sin IVA por todo el contrato'} />
            <button className="btn btn-secondary mt-8" disabled={!own.trim() || ordering} onClick={order}>{ordering ? 'Ordenando…' : 'Que PROPO lo ordene'}</button>
          </div>
        </div>
      )}

      {/* 3 · El precio elegido */}
      {ch && (
        <div className={`card card-pad ${pr.approved ? 'pr-done' : ''}`}>
          <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ fontSize: 18 }}>{pr.approved ? <><LuCircleCheck style={{ color: 'var(--ok)', verticalAlign: -3 }} /> Precio confirmado</> : 'Tu oferta económica'}</h3>
            <span className="badge">{ch.mode === 'own' ? 'Tus precios' : `Opción ${MODE[ch.mode].t.toLowerCase()}`}</span>
          </div>
          <div className="pr-sum mt-12">
            <div><span>Importe sin IVA</span><strong className="num">{eur2(ch.total)}</strong></div>
            <div><span>IVA ({vat} %)</span><strong className="num">{eur2(ch.total * vat / 100)}</strong></div>
            <div className="tot"><span>Total con IVA</span><strong className="num">{eur2(ch.total * (1 + vat / 100))}</strong></div>
          </div>
          <p className="small muted mt-8">En letra: <em>{eurosInWords(Math.round(ch.total * 100) / 100)}</em> (sin IVA).</p>
          {ch.units.length > 0 && (
            <table className="pr-units mt-12"><thead><tr><th>Precio unitario</th><th style={{ textAlign: 'right' }}>Sin IVA</th></tr></thead>
              <tbody>{ch.units.map((u) => <tr key={u.id}><td>{u.label}</td><td className="num" style={{ textAlign: 'right' }}>{eur2(u.price)}</td></tr>)}</tbody></table>
          )}
          {!!rule.budget && <p className="small mt-12">Rebaja sobre el precio máximo: <strong>{pct1(ch.baja)}</strong>{ch.points != null && <> · Puntos del precio estimados: <strong>{pts(ch.points)} de {pts(rule.points)}</strong></>}</p>}
          {warns.map((w, i) => <div key={i} className={`callout ${w.level} small mt-8`}><LuTriangleAlert /><div>{w.text}</div></div>)}
          {rule.model && <div className="callout neutral small mt-12"><LuInfo /><div>El pliego tiene su propio modelo: <strong>{rule.model.name}</strong>{rule.model.doc ? ` (${rule.model.doc}${rule.model.page ? `, p. ${rule.model.page}` : ''})` : ''}. En el paquete va tu oferta preparada y el modelo del pliego con estos mismos importes para que lo firmes.</div></div>}
          <div className="row mt-16" style={{ gap: 8, flexWrap: 'wrap' }}>
            {!pr.approved && <button className="btn btn-primary" disabled={warns.some((w) => w.level === 'bad')} onClick={confirm}><LuShieldCheck /> Confirmar el precio</button>}
            {pr.approved && <button className="btn btn-primary" onClick={() => navigate(`/app/projects/${p.id}/compliance`)}>Seguir a la comprobación final <LuArrowRight /></button>}
            <button className="btn btn-ghost" onClick={reset}><LuRotateCcw /> Borrar y poner otro precio</button>
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
  const saveOne = async (id: string) => {
    const c = rule.others.find((o) => o.id === id)!; const t = (draft[id] || '').trim();
    if (!t) return;
    setBusy(id);
    const formal = await formalCommitment(p, c, t);
    setBusy(null);
    updateProject(p.id, (x) => { const cur = x.pricing ?? emptyPricing(); cur.others = { ...cur.others, [id]: { text: t, formal } }; x.pricing = cur; });
  };
  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 18 }}>Puntos casi gratis: otros criterios con fórmula</h3>
      <p className="muted mt-4">Además del precio, este pliego da puntos automáticos por estos compromisos. Mucha gente los deja escapar. Contesta con tus palabras y PROPO lo redacta como compromiso formal en la oferta.</p>
      <div className="stack mt-16" style={{ gap: 14 }}>
        {rule.others.map((o) => {
          const saved = pr.others[o.id];
          return (
            <div key={o.id} className="pr-other">
              <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}><strong>{o.label}</strong>{o.points != null && <span className="badge">{pts(o.points)} puntos</span>}</div>
              {o.rule && <div className="xs muted mt-4">{o.rule}</div>}
              <label className="small mt-8" style={{ display: 'block' }} htmlFor={`oc-${o.id}`}>{o.ask}</label>
              <div className="row mt-4" style={{ gap: 8 }}>
                <input id={`oc-${o.id}`} className="input" value={draft[o.id] ?? ''} onChange={(e) => setDraft({ ...draft, [o.id]: e.target.value })} placeholder="Escríbelo como te salga" />
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
