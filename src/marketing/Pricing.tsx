import React, { useState } from 'react';
import { LuCheck, LuMinus, LuPlus } from 'react-icons/lu';
import { MkLayout } from './Layout';
import { PLANS, COMPARISON } from '../lib/plans';
import { navigate, track } from '../lib/store';

export function PricingCards({ compact, cycle: cycleProp }: { compact?: boolean; cycle?: 'monthly' | 'annual' }) {
  const cycle = cycleProp ?? 'monthly';
  const cards = [
    { plan: PLANS.trial, price: '0 €', per: 'durante 14 días', sub: 'Una propuesta completa, de principio a fin. Sin tarjeta.', cta: 'Empezar gratis' },
    { plan: PLANS.pro, price: `${cycle === 'annual' ? PLANS.pro.annual : PLANS.pro.monthly} €`, per: cycle === 'annual' ? '/ mes, facturación anual' : '/ mes', sub: PLANS.pro.tagline, cta: 'Empezar prueba gratis', featured: true },
    { plan: PLANS.business, price: `${cycle === 'annual' ? PLANS.business.annual : PLANS.business.monthly} €`, per: cycle === 'annual' ? '/ mes, facturación anual' : '/ mes', sub: PLANS.business.tagline, cta: 'Empezar prueba gratis' },
  ];
  return (
    <>
      <div className="price-grid">
        {cards.map((c) => (
          <div key={c.plan.id} className={`price-card ${c.featured ? 'featured' : ''}`}>
            {c.featured && <span className="price-flag">Más elegido</span>}
            <h3>{c.plan.name}</h3>
            <p className="small muted mt-4">{c.sub}</p>
            <div className="price"><strong className="num">{c.price}</strong><span className="muted small">{c.per}</span></div>
            {c.plan.extraProposal && <div className="xs subtle mt-4">Propuestas adicionales a {c.plan.extraProposal} € cada una</div>}
            <ul>{(compact ? c.plan.features.slice(0, 4) : c.plan.features).map((f) => <li key={f}><LuCheck />{f}</li>)}</ul>
            <button className={`btn ${c.featured ? 'btn-primary' : 'btn-secondary'} btn-lg`} onClick={() => { track('cta_click', { cta: `pricing_${c.plan.id}` }); navigate('/signup'); }}>{c.cta}</button>
          </div>
        ))}
      </div>
      <div className="enterprise-row">
        <div>
          <h3 style={{ fontSize: 18 }}>Enterprise</h3>
          <p className="muted small mt-4">Volumen de propuestas a medida, SSO, permisos avanzados, retención de datos a medida y un acuerdo de tratamiento de datos adaptado a tu empresa.</p>
        </div>
        <div className="row"><span className="muted small">Precio a medida</span><button className="btn btn-secondary" onClick={() => navigate('/contact')}>Hablar con nosotros</button></div>
      </div>
    </>
  );
}

export function Pricing() {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');
  const cols = ['trial', 'pro', 'business', 'enterprise'] as const;
  return (
    <MkLayout>
      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="mk-wrap">
          <div className="section-head">
            <div className="eyebrow">Precios</div>
            <h2>Elige cómo quieres <span className="blue">preparar tus propuestas.</span></h2>
            <p>Los planes se dimensionan por las propuestas nuevas que preparas cada mes. Todos incluyen el flujo completo: buscador, análisis, requisitos, redacción, cumplimiento y exportación.</p>
          </div>
          <div className="billing-toggle" style={{ marginBottom: 28 }}>
            <div className="seg" role="tablist">
              <button className={cycle === 'monthly' ? 'on' : ''} onClick={() => setCycle('monthly')}>Mensual</button>
              <button className={cycle === 'annual' ? 'on' : ''} onClick={() => setCycle('annual')}>Anual</button>
            </div>
            <span className="small muted">Con la facturación anual ahorras un 20 %</span>
          </div>
          <PricingCards cycle={cycle} />
        </div>
      </section>
      <section className="section-tight">
        <div className="mk-wrap">
          <h2 style={{ fontSize: 26 }}>Compara los planes</h2>
          <div className="card mt-20 table-wrap">
            <table className="table compare">
              <thead><tr><th style={{ width: '34%' }}>Funcionalidad</th>{cols.map((c) => <th key={c}>{PLANS[c].name}</th>)}</tr></thead>
              <tbody>
                <tr><td>Precio</td>{cols.map((c) => <td key={c} className="num">{PLANS[c].monthly == null ? 'A medida' : PLANS[c].monthly === 0 ? '0 €' : `${cycle === 'annual' ? PLANS[c].annual : PLANS[c].monthly} €/mes`}</td>)}</tr>
                {COMPARISON.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    {cols.map((c) => { const v = row.values[c]; return <td key={c}>{v === true ? <LuCheck className="ok-ico" aria-label="Incluido" /> : v === false ? <LuMinus className="no-ico" aria-label="No incluido" /> : v}</td>; })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="mk-wrap">
          <h2 style={{ fontSize: 26 }}>Cómo funcionan los planes</h2>
          <div className="faq mt-20">
            {[
              ['¿Qué cuenta como una propuesta?', 'Cada licitación, RFP o propuesta que creas en PROPO. Incluye el análisis de todos sus documentos, el seguimiento de requisitos, la redacción, regenerar secciones, el asistente y la exportación del paquete. Editar una propuesta nunca gasta otra.'],
              ['¿El buscador de licitaciones tiene coste?', 'No. Buscar licitaciones y ver su compatibilidad está incluido en todos los planes, también en el gratuito. Lo que se cuenta son las propuestas que preparas.'],
              ['¿Qué pasa cuando termina la prueba?', 'Tu espacio pasa a modo lectura en el plan Gratis. Tu perfil de empresa, tus documentos y tus propuestas se conservan, y puedes continuar donde lo dejaste al suscribirte.'],
              ['¿Y si un mes tengo muchas licitaciones?', 'Añade propuestas adicionales cuando las necesites (19 € en Pro y 12 € en Business) o mejora tu plan. Las propuestas no usadas no se acumulan.'],
              ['¿Por qué hay un límite de páginas por propuesta?', 'Para que los planes sean previsibles. El límite cubre casi todas las licitaciones: una licitación pública típica tiene entre 100 y 300 páginas con anexos. Las más grandes caben en Business.'],
              ['¿Puedo cancelar cuando quiera?', 'Sí. Cancela desde Facturación en dos clics. El plan sigue activo hasta el final del periodo pagado y puedes exportar todos tus datos.'],
              ['¿Los precios incluyen IVA?', 'No. Los precios no incluyen IVA, que se añade en el pago cuando corresponde.'],
            ].map(([q, a]) => <details key={q}><summary>{q}<LuPlus /></summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>
    </MkLayout>
  );
}
