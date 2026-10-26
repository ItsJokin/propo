// Paso «El precio»: PROPO explica cómo puntúa el precio este pliego, propone tres precios a partir del mínimo que le
// compensa al cliente (o ordena los que él escriba con sus palabras) y, al confirmarlo, prepara la oferta económica.
import React, { useEffect, useState } from 'react';
import { LuInfo, LuTriangleAlert, LuCircleCheck, LuSparkles, LuPencil, LuRotateCcw, LuArrowRight, LuShieldCheck, LuLoaderCircle, LuPlus, LuTrash2 } from 'react-icons/lu';
import { uid } from '../../lib/util';
import type { Project } from '../../lib/types';
import { updateProject, navigate, toast, getState } from '../../lib/store';
import { fillOfficialModel } from '../../lib/offerModel';
import { getFile } from '../../lib/storage';
import { offerDownload } from '../../lib/services/download';
import {
  emptyPricing, readPriceRule, marketFor, priceOptions, choose, readOwnPrices, formalCommitment, priceWarnings, eurosInWords, eur2, pct1, num, pointsFor,
  otherAdvice, otherPoints, commitmentText, unitLines, unitChoice, unitText, isSingleDiscount, explainUnits,
  type Pricing as PricingState, type Market, type Option,
} from '../../lib/pricing';
import { Economic } from './Economic';

const MODE: Record<Option['mode'], { t: string; d: string }> = {
  prudent: { t: 'Prudente', d: 'Buen margen y menos riesgo. Das algunos puntos.' },
  recommended: { t: 'Recomendada', d: 'Lo que más puntos da sin entrar en zona de riesgo.' },
  aggressive: { t: 'Agresiva', d: 'Máximos puntos, muy cerca de la baja temeraria.' },
};
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
  const [floorTxt, setFloorTxt] = useState(pr.floor ? String(pr.floor).replace('.', ',') : '');
  const [budgetTxt, setBudgetTxt] = useState('');
  const [showOpts, setShowOpts] = useState(!!pr.floor && !pr.choice);
  const [own, setOwn] = useState(pr.ownText ?? '');
  const [ordering, setOrdering] = useState(false);
  const [filling, setFilling] = useState(false);
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
  const reset = () => { updateProject(p.id, (x) => { x.pricing = { ...(x.pricing ?? emptyPricing()), choice: null, approved: null, ownText: '', filled: null, fillNote: '' }; x.manualChecks.financialApproved = false; }); setOwn(''); setShowOpts(false); };

  return (
    <div className="stack gap-16">
      {/* 1 · Cómo se puntúa */}
      <div className="card card-pad">
        <div className="eyebrow">Paso 3 · El precio</div>
        <h2 className="mt-8" style={{ fontSize: 22 }}>Cómo se puntúa el precio en esta licitación</h2>
        <p className="mt-8" style={{ fontSize: 15, lineHeight: 1.6 }}>{rule.plain}</p>
        <p className="mt-8 muted" style={{ lineHeight: 1.6 }}>{weight(rule.points, rule.totalPoints)} El objetivo no es ser el más barato, sino <strong>bajar lo justo</strong>: cada euro de rebaja es dinero que dejas de ganar durante todo el contrato, y si te pasas, te pueden excluir.</p>
        <div className="pr-kpis mt-16">
          <div><div className="xs subtle">El precio vale</div><div className="pr-k num">{rule.points ? `${pts(rule.points)} puntos` : '—'}</div><div className="xs muted">{rule.totalPoints ? `de ${pts(rule.totalPoints)} en total` : ''}</div></div>
          <div><div className="xs subtle">Precio máximo (sin IVA)</div><div className="pr-k num">{rule.budget ? eur2(rule.budget) : '—'}</div><div className="xs muted">Por encima, te excluyen</div></div>
          <div><div className="xs subtle">Lo habitual</div><div className="pr-k num">{market ? `−${pct1(m.mean)}` : '…'}</div><div className="xs muted">{m.n ? `Rebaja media en ${m.n} contratos ${m.scope}` : 'Rebaja típica estimada'}</div></div>
          <div><div className="xs subtle">Zona de riesgo</div><div className="pr-k num">{calc ? `más de −${pct1(calc.abnormal)}` : '—'}</div><div className="xs muted">Baja temeraria: habría que justificarla</div></div>
        </div>
        <div className="pr-explain mt-16">
          <div>
            <h4>Cómo se reparten los puntos</h4>
            <p>{formulaPlain(rule)}</p>
            {!!rule.points && <p className="mt-8">Por ejemplo: si la oferta más barata rebaja un {pct1(m.best)} y tú un {pct1(m.mean)}, te llevarías unos <strong>{pts(pointsFor(rule, m.mean, m.best))} puntos</strong>; si igualas su rebaja, los {pts(rule.points)}.</p>}
            <p className="mt-8 xs muted">«Lo habitual» es lo que rebajaron de media las empresas que ganaron contratos parecidos, según los datos públicos de adjudicación.</p>
          </div>
          <div>
            <h4>Qué es la baja temeraria</h4>
            <p>Si tu precio queda muy por debajo del de los demás, la Administración sospecha que no podrás cumplir el contrato. Te pedirá que lo justifiques en pocos días (salarios, costes, proveedores) y, si no le convence, <strong>te excluye</strong> aunque tuvieras la mejor nota.</p>
            <p className="mt-8">Por eso PROPO te avisa siempre que una opción entra en esa zona y, si la eliges, te deja preparada la justificación.</p>
          </div>
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

      {/* 2 · Precio de cada concepto (catering con varios menús, tarifas por hora, etc.) */}
      {!ch && (rule.units.length > 0 || (pr.extraUnits ?? []).length > 0) && <UnitPrices p={p} pr={pr} save={save} />}

      {/* 2 · Tus números */}
      {!!rule.budget && !ch && (
        <div className="card card-pad">
          <h3 style={{ fontSize: 18 }}>¿Por debajo de qué precio no te compensa hacerlo?</h3>
          <p className="muted mt-4">Con ese número PROPO calcula el precio que más puntos te da <strong>sin que pierdas dinero</strong>. Es tu dato interno: solo lo usamos para el cálculo y no aparece en ningún documento de la oferta.</p>
          <div className="pr-floor-help mt-12">
            <div className="small" style={{ fontWeight: 600 }}>Para calcularlo, suma{p.analysis?.duration ? ` para toda la duración del contrato (${p.analysis.duration})` : ' para toda la duración del contrato'}:</div>
            <ul className="small">
              <li><strong>Personal:</strong> los salarios según el convenio de tu sector, más la Seguridad Social de la empresa (suele ser alrededor de un tercio más del sueldo bruto).</li>
              <li><strong>Materiales y suministros:</strong> productos, comida, piezas, combustible…</li>
              <li><strong>Medios:</strong> vehículos, maquinaria, uniformes, seguros y licencias que necesites para este contrato.</li>
              <li><strong>Gastos generales:</strong> la parte de oficina, gestión y administración que le toca a este contrato.</li>
              <li><strong>Tu beneficio mínimo:</strong> lo que quieres ganar como poco para que merezca la pena.</li>
            </ul>
            <div className="xs muted">Todo sin IVA. Si dudas, pon una cifra aproximada: siempre puedes cambiarla y volver a calcular.</div>
          </div>
          <div className="row mt-12" style={{ gap: 8, flexWrap: 'wrap' }}>
            <div className="pr-money"><input className="input" inputMode="decimal" placeholder={`p. ej. ${Math.round(rule.budget * 0.82).toLocaleString('es-ES')}`} value={floorTxt} onChange={(e) => setFloorTxt(e.target.value)} aria-label="Precio mínimo sin IVA" /><span>€ sin IVA, en total</span></div>
            <button className="btn btn-primary" disabled={!num(floorTxt)} onClick={() => compute(true)}><LuSparkles /> Que PROPO calcule el mejor precio</button>
          </div>
          <button className="link small mt-8" onClick={() => compute(false)}>Todavía no lo sé: enséñame las opciones igualmente</button>

          {showOpts && calc && (
            <>
              {!pr.floor && <div className="callout warn small mt-16"><LuTriangleAlert /><div>Sin tu precio mínimo no podemos saber si estas opciones te dejan beneficio. Revísalas con tus números antes de elegir.</div></div>}
              {calc.limit === 'floor' && <div className="callout neutral small mt-16"><LuInfo /><div>Tu precio mínimo limita la rebaja: ninguna opción baja de {eur2(pr.floor!)}. Puede que otros ofrezcan menos; compensa con una buena memoria técnica.</div></div>}
              <p className="mt-16" style={{ lineHeight: 1.6 }}>Hemos calculado tres precios con {pr.floor ? 'tu mínimo, ' : ''}la fórmula de este pliego y lo que rebajaron los ganadores de contratos parecidos. Se diferencian en <strong>cuánto arriesgas</strong>: más rebaja te da más opciones de llevarte todos los puntos del precio, pero te deja menos margen y te acerca a la baja temeraria.</p>
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
            <p className="small muted mt-4">Escríbelos con tus palabras, como se los dirías a un compañero: el total del contrato, el precio por unidad o ambos. PROPO los ordena y los pasa al formato oficial de la oferta, <strong>sin cambiar ningún importe</strong>. Después verás los puntos que te darían y si algo supera el máximo del pliego. Si los escribes con IVA incluido, te avisaremos.</p>
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
          {ch.total > 0 ? <>
          <div className="pr-sum mt-12">
            <div><span>Importe sin IVA</span><strong className="num">{eur2(ch.total)}</strong></div>
            <div><span>IVA ({vat} %)</span><strong className="num">{eur2(ch.total * vat / 100)}</strong></div>
            <div className="tot"><span>Total con IVA</span><strong className="num">{eur2(ch.total * (1 + vat / 100))}</strong></div>
          </div>
          <p className="small muted mt-8">En letra: <em>{eurosInWords(Math.round(ch.total * 100) / 100)}</em> (sin IVA).</p>
          </> : <p className="small muted mt-8">Oferta por precios unitarios: el importe final dependerá de los servicios que se pidan.</p>}
          {ch.units.length > 0 && (
            <table className="pr-units mt-12"><thead><tr><th>Precio unitario</th><th style={{ textAlign: 'right' }}>Sin IVA</th></tr></thead>
              <tbody>{ch.units.map((u) => <tr key={u.id}><td>{u.label}</td><td className="num" style={{ textAlign: 'right' }}>{eur2(u.price)}</td></tr>)}</tbody></table>
          )}
          {!!rule.budget && <p className="small mt-12">Rebaja sobre el precio máximo: <strong>{pct1(ch.baja)}</strong>{ch.points != null && <> · Puntos del precio estimados: <strong>{pts(ch.points)} de {pts(rule.points)}</strong></>}</p>}
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
            {!pr.approved && ch.units.length > 0 && <button className="btn btn-secondary" onClick={() => save((x) => { x.unitDraft = ch.discount != null ? { __pct: String(Math.round(ch.discount * 10000) / 100).replace('.', ',') } : Object.fromEntries(ch.units.map((u) => [u.id, String(u.price).replace('.', ',')])); x.choice = null; x.approved = null; })}><LuPencil /> {ch.discount != null ? 'Cambiar el % de baja' : 'Cambiar los precios de cada concepto'}</button>}
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

/** Tabla para poner el precio de cada concepto (menú, servicio, hora…): máximo del pliego, cantidad estimada y subtotal. */
const explaining = new Set<string>();   // proyectos cuya explicación de conceptos ya se está pidiendo

function UnitPrices({ p, pr, save }: { p: Project; pr: PricingState; save: (fn: (x: PricingState) => void) => void }) {
  const rule = pr.rule!;
  const draft = pr.unitDraft ?? {}; const extra = pr.extraUnits ?? [];
  const [totalTxt, setTotalTxt] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const info = pr.unitInfo; const loadingInfo = rule.units.length > 0 && info == null && !pr.unitInfoError;
  const fetchInfo = () => {
    if (explaining.has(p.id)) return; explaining.add(p.id);
    save((x) => { x.unitInfoError = false; });
    explainUnits(p, rule).then((r) => save((x) => { x.unitInfo = r; }), () => save((x) => { x.unitInfoError = true; })).finally(() => explaining.delete(p.id));
  };
  useEffect(() => { if (loadingInfo) fetchInfo(); }, [p.id]);   // una sola vez por proyecto: queda guardado
  const lines = unitLines(rule, draft, extra);
  const single = isSingleDiscount(rule);
  const pctTxt = draft.__pct ?? ''; const pct = pctTxt.trim() ? Number(pctTxt.replace(',', '.')) / 100 : null;
  const shown = single ? lines.map((l) => { const price = pct != null && l.max ? Math.round(l.max * (1 - pct) * 100) / 100 : null; return { ...l, price, over: false, subtotal: price != null && l.qty ? Math.round(price * l.qty * 100) / 100 : null }; }) : lines;
  const ch = unitChoice(rule, lines, totalTxt, single ? pct : undefined);
  const set = (id: string, v: string) => save((x) => { x.unitDraft = { ...(x.unitDraft ?? {}), [id]: v.replace(/[^\d.,]/g, '') }; });
  const anyQty = lines.some((l) => l.qty); const allPricedQty = lines.filter((l) => l.price).every((l) => l.qty);
  const over = lines.filter((l) => l.over);
  const use = () => { if (!ch) return; save((x) => { x.choice = ch; x.approved = null; }); toast('Precios guardados. Revísalos y confírmalos.', 'ok'); };
  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 18 }}>{single ? 'Tu % de baja sobre los precios máximos' : 'Pon tu precio a cada concepto'}</h3>
      {single ? <>
        <p className="muted mt-4">Este pliego no pide un precio por cada concepto: pide <strong>un único porcentaje de baja</strong> que se aplica a todos los precios máximos. Escribe tu % y verás cómo queda cada concepto.</p>
        <div className="row-wrap mt-12" style={{ gap: 8, alignItems: 'center' }}>
          <span className="small">Baja que ofreces:</span>
          <div className="pr-money"><input className="input" inputMode="decimal" style={{ width: 110 }} placeholder="p. ej. 8" aria-label="Porcentaje de baja único" value={pctTxt} onChange={(e) => set('__pct', e.target.value)} /><span>%</span></div>
          {pct != null && (pct <= 0 || pct >= 1) && <span className="xs" style={{ color: 'var(--bad)' }}>Escribe un % entre 0 y 100</span>}
        </div>
      </> : <p className="muted mt-4">Este pliego pide un precio por cada concepto. Escribe el tuyo, sin IVA, en cada línea. Ninguno puede superar su precio máximo: si uno lo supera, la oferta se excluye aunque el total esté por debajo.</p>}
      <div style={{ overflowX: 'auto' }}>
        <table className="pr-units mt-12" style={{ minWidth: 560 }}>
          <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Máximo del pliego</th>{anyQty && <th style={{ textAlign: 'right' }}>Cantidad estimada</th>}<th style={{ textAlign: 'right', width: 150 }}>{single ? 'Queda en (sin IVA)' : 'Tu precio (sin IVA)'}</th>{anyQty && <th style={{ textAlign: 'right' }}>Subtotal</th>}<th /></tr></thead>
          <tbody>{shown.map((l) => { const inf = info?.[l.id]; const isUnit = rule.units.some((u) => u.id === l.id); return (
            <React.Fragment key={l.id}>
            <tr>
              <td>{l.label}{l.unit && l.unit.toLowerCase() !== l.label.toLowerCase() && <span className="xs muted"> · {unitText(l.unit)}</span>}
                {isUnit && <button className={`btn btn-ghost btn-sm btn-icon pr-info${open === l.id ? ' on' : ''}`} aria-label={`Qué pide el pliego en ${l.label}`} aria-expanded={open === l.id} title="Qué pide el pliego en este concepto" onClick={() => setOpen(open === l.id ? null : l.id)}>{loadingInfo && open === l.id ? <LuLoaderCircle className="spin" /> : <LuInfo />}</button>}</td>
              <td className="num" style={{ textAlign: 'right' }}>{l.max != null ? eur2(l.max) : <span className="muted">—</span>}</td>
              {anyQty && <td className="num" style={{ textAlign: 'right' }}>{l.qty != null ? l.qty.toLocaleString('es-ES') : <span className="muted">—</span>}</td>}
              <td style={{ textAlign: 'right' }}>{single ? <span className="num">{l.price != null ? eur2(l.price) : <span className="muted">—</span>}</span> : <><div className="row" style={{ gap: 4, justifyContent: 'flex-end' }}>
                <input className="input" inputMode="decimal" style={{ width: 110, height: 34, textAlign: 'right', borderColor: l.over ? 'var(--bad)' : undefined }} aria-label={`Precio de ${l.label}`} placeholder={l.max != null ? String(Math.round(l.max * 0.9 * 100) / 100).replace('.', ',') : '0,00'} value={draft[l.id] ?? ''} onChange={(e) => set(l.id, e.target.value)} /><span className="small">€</span></div>
                {l.over && <div className="xs" style={{ color: 'var(--bad)' }}>Supera el máximo</div>}</>}</td>
              {anyQty && <td className="num" style={{ textAlign: 'right' }}>{l.subtotal != null ? eur2(l.subtotal) : <span className="muted">—</span>}</td>}
              <td>{extra.some((x) => x.id === l.id) && <button className="btn btn-ghost btn-sm btn-icon" aria-label="Quitar concepto" onClick={() => save((x) => { x.extraUnits = (x.extraUnits ?? []).filter((y) => y.id !== l.id); const d = { ...(x.unitDraft ?? {}) }; delete d[l.id]; x.unitDraft = d; })}><LuTrash2 /></button>}</td>
            </tr>
            {open === l.id && <tr className="pr-info-row"><td colSpan={99}>
              <div className="pr-info-box">
                {inf ? <>
                  <div className="xs muted" style={{ fontWeight: 600, letterSpacing: '.02em' }}>QUÉ PIDE EL PLIEGO</div>
                  <p className="mt-4">{inf.plain}</p>
                  {inf.includes.length > 0 && <ul className="mt-8">{inf.includes.map((x, i) => <li key={i}>{x}</li>)}</ul>}
                  {inf.watch && <p className="small mt-8"><LuTriangleAlert style={{ verticalAlign: '-2px', color: 'var(--warn)' }} /> <strong>Para el precio:</strong> {inf.watch}</p>}
                  {inf.doc && <p className="xs muted mt-8">Fuente: {inf.doc}{inf.page ? `, pág. ${inf.page}` : ''}. Explicado por la IA de PROPO: compruébalo en el pliego antes de presentar.</p>}
                </> : loadingInfo ? <p className="small muted"><LuLoaderCircle className="spin" style={{ verticalAlign: '-2px' }} /> PROPO está leyendo el pliego para explicarte cada concepto…</p>
                  : pr.unitInfoError ? <p className="small">No se ha podido leer ahora. <button className="btn btn-ghost btn-sm" onClick={fetchInfo}><LuRotateCcw /> Reintentar</button></p>
                  : <p className="small muted">El pliego no detalla qué incluye este concepto. Si tienes dudas, puedes preguntarlo al órgano de contratación antes de que acabe el plazo.</p>}
              </div>
            </td></tr>}
            </React.Fragment>
          ); })}</tbody>
        </table>
      </div>
      {!single && <div className="row-wrap mt-8" style={{ gap: 6 }}>
        <input className="input" style={{ maxWidth: 280, height: 34 }} placeholder="¿Falta un concepto? Escríbelo aquí" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
        <button className="btn btn-ghost btn-sm" disabled={!newLabel.trim()} onClick={() => { save((x) => { x.extraUnits = [...(x.extraUnits ?? []), { id: uid('cu'), label: newLabel.trim(), unit: '' }]; }); setNewLabel(''); }}><LuPlus /> Añadir concepto</button>
      </div>}
      {!single && !allPricedQty && <div className="row-wrap mt-12" style={{ gap: 8, alignItems: 'center' }}>
        <span className="small">Importe total del contrato, si el modelo de oferta lo pide:</span>
        <div className="pr-money"><input className="input" inputMode="decimal" placeholder={rule.budget ? `máx. ${rule.budget.toLocaleString('es-ES')}` : 'opcional'} value={totalTxt} onChange={(e) => setTotalTxt(e.target.value)} aria-label="Importe total sin IVA" /><span>€ sin IVA</span></div>
      </div>}
      {ch && <div className="pr-sum mt-12">
        <div><span>{ch.total ? 'Total sin IVA' : 'Total'}</span><strong className="num">{ch.total ? eur2(ch.total) : 'solo precios por concepto'}</strong></div>
        <div><span>Rebaja {single ? 'única sobre los máximos' : ch.total && rule.budget ? 'sobre el presupuesto' : 'media sobre los máximos'}</span><strong className="num">{pct1(ch.baja)}</strong></div>
        {ch.points != null && <div className="tot"><span>Puntos del precio (estimados)</span><strong className="num">{pts(ch.points)} de {pts(rule.points)}</strong></div>}
      </div>}
      {over.length > 0 && <div className="callout bad small mt-8"><LuTriangleAlert /><div>{over.map((l) => l.label).join(', ')} {over.length === 1 ? 'supera' : 'superan'} el precio máximo del pliego. Bájalo para poder presentar la oferta.</div></div>}
      <button className="btn btn-primary mt-12" disabled={!ch || over.length > 0} onClick={use}>{single ? 'Usar esta baja' : 'Usar estos precios'}</button>
    </div>
  );
}
