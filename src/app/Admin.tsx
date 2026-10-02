import React, { useState } from 'react';
import { LuInfo } from 'react-icons/lu';
import { useStore } from '../lib/store';
import { PLANS } from '../lib/plans';
import { Toggle } from '../components/ui';
import { timeAgo } from '../lib/util';
import { readiness } from '../lib/derive';

// Internal admin panel. Production data sources:
//   users/companies/projects -> Postgres (service role, admin-only route, audit logged)
//   subscriptions/revenue    -> Stripe (mirrored in `subscriptions`, `invoices`)
//   funnel/activation        -> PostHog EU (events listed in docs/ANALYTICS.md)
//   AI usage/errors          -> `ai_usage` and `job_runs` tables
const SAMPLE = {
  kpis: [['Altas (30 d)', '184'], ['Activación', '41 %'], ['Prueba → pago', '17 %'], ['MRR', '3.160 €'], ['Bajas (mensual)', '3,1 %'], ['Mejoras de plan', '9 %']],
  weekly: [12, 18, 15, 22, 27, 24, 31, 35],
  companies: [
    ['Empresa de ejemplo A', 'Construcción', 'Business', 11, '199 €'], ['Empresa de ejemplo B', 'Limpieza', 'Pro', 4, '79 €'], ['Empresa de ejemplo C', 'Tecnología', 'Pro', 3, '79 €'], ['Empresa de ejemplo D', 'Seguridad', 'Prueba', 1, '—'],
  ] as [string, string, string, number, string][],
  ai: [['Análisis de pliegos', '1.240', '0,42 €'], ['Borradores de secciones', '6.980', '0,03 €'], ['Pregunta a PROPO', '9.310', '0,01 €'], ['Cálculo de compatibilidad', '48.200', '0 € (sin IA)']],
  errors: [['PDF escaneado sin capa de texto', 'document_unreadable', 23], ['Respuesta JSON de la IA no válida (reintentada)', 'invalid_json', 7], ['Archivo de más de 60 MB', 'file_too_large', 4], ['Error temporal de la API de TED (reintentado)', 'ted_sync_failed', 2]] as [string, string, number][],
};

export function Admin() {
  const s = useStore((x) => x);
  const [sample, setSample] = useState(true);
  const own = s.projects.filter((p) => !p.isSample);
  const count = (n: string) => s.events.filter((e) => e.name === n).length;
  const pagesAnalysed = s.usage.pagesAnalyzed;
  const drafted = s.projects.reduce((a, p) => a + p.sections.filter((x) => x.generatedBy === 'ai' || x.generatedBy === 'template').length, 0);
  const hoursSaved = Math.round((pagesAnalysed * 3 + drafted * 45) / 60);
  const max = Math.max(...SAMPLE.weekly);
  return (
    <>
      <div className="page-head">
        <div><h1>Administración</h1><p>Vista interna de la plataforma: usuarios, empresas, suscripciones, uso de IA, errores e ingresos.</p></div>
        <label className="row small">Mostrar datos de ejemplo <Toggle on={sample} onChange={setSample} label="Mostrar datos de ejemplo" /></label>
      </div>
      <div className="callout neutral small" style={{ marginBottom: 20 }}><LuInfo /><div>En producción, esta página es solo para el equipo de PROPO y lee los datos de Postgres, Stripe y PostHog. Las cifras de «Este espacio» son eventos reales de este navegador. Las cifras de ejemplo son ficticias y están marcadas como tales.</div></div>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Este espacio (en directo)</h3>
      <div className="kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {[['Proyectos creados', count('project_created')], ['Licitaciones guardadas', s.savedTenders.length], ['Documentos subidos', s.vault.filter((v) => v.hasFile).length], ['Propuestas completadas', count('proposal_completed')], ['Generaciones de IA', s.usage.aiActions], ['Paquetes descargados', count('package_downloaded')], ['Tiempo ahorrado (est.)', `${hoursSaved} h`]].map(([l, v]) => (
          <div key={l as string} className="kpi" style={{ cursor: 'default' }}><div className="l">{l}</div><div className="v num" style={{ fontSize: 26 }}>{v}</div></div>
        ))}
      </div>
      <p className="xs subtle mt-8">Estimación de tiempo ahorrado: 3 minutos por página de pliego analizada + 45 minutos por sección redactada. La misma fórmula alimenta la métrica de «horas ahorradas» del producto.</p>

      {sample && (
        <>
          <h3 style={{ fontSize: 15, margin: '32px 0 12px' }}>Plataforma <span className="badge sample">Datos de ejemplo</span></h3>
          <div className="kpis" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            {SAMPLE.kpis.map(([l, v]) => <div key={l} className="kpi" style={{ cursor: 'default' }}><div className="l">{l}</div><div className="v num" style={{ fontSize: 26 }}>{v}</div></div>)}
          </div>
          <div className="grid-2 mt-20">
            <div className="card">
              <div className="card-head"><h3>Altas semanales</h3><span className="xs subtle">últimas 8 semanas</span></div>
              <div className="card-body">
                <svg viewBox="0 0 320 120" style={{ width: '100%', height: 140 }} role="img" aria-label="Altas semanales, últimas 8 semanas">
                  <line x1="0" y1="100" x2="320" y2="100" stroke="var(--border)" strokeWidth="1" />
                  {SAMPLE.weekly.map((v, i) => {
                    const h = (v / max) * 84; const x = 8 + i * 39;
                    return (
                      <g key={i}>
                        <title>{`Semana ${i + 1}: ${v} altas`}</title>
                        <rect x={x} y={100 - h} width="27" height={h} rx="4" fill={i === SAMPLE.weekly.length - 1 ? 'var(--accent)' : 'var(--fg-3)'} />
                        {i === SAMPLE.weekly.length - 1 && <text x={x + 13.5} y={100 - h - 6} textAnchor="middle" fontSize="11" fill="var(--fg)">{v}</text>}
                        <text x={x + 13.5} y="114" textAnchor="middle" fontSize="9" fill="var(--fg-3)">S{i + 1}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="card">
              <div className="card-head"><h3>Uso y coste de la IA</h3></div>
              <table className="table"><thead><tr><th>Acción</th><th>Llamadas (30 d)</th><th>Coste medio</th></tr></thead><tbody>{SAMPLE.ai.map((r) => <tr key={r[0]}><td>{r[0]}</td><td className="num">{r[1]}</td><td className="num">{r[2]}</td></tr>)}</tbody></table>
            </div>
          </div>
        </>
      )}

      <div className="card mt-20">
        <div className="card-head"><h3>Empresas y suscripciones</h3></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Empresa</th><th>Sector</th><th>Plan</th><th>Proyectos</th><th>MRR</th></tr></thead>
            <tbody>
              <tr><td><strong>{s.company.legalName || 'Este espacio'}</strong> <span className="badge accent" style={{ height: 20 }}>Tú</span></td><td>{s.company.industry || '—'}</td><td>{PLANS[s.subscription.plan].name}{s.subscription.simulated ? ' (vista previa)' : ''}</td><td className="num">{own.length}</td><td className="num">0 €</td></tr>
              {sample && SAMPLE.companies.map((c) => <tr key={c[0]}><td>{c[0]}</td><td>{c[1]}</td><td>{c[2]}</td><td className="num">{c[3]}</td><td className="num">{c[4]}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2 mt-20">
        <div className="card">
          <div className="card-head"><h3>Proyectos de este espacio</h3></div>
          <div className="table-wrap"><table className="table"><thead><tr><th>Proyecto</th><th>Modo</th><th>Preparación</th></tr></thead><tbody>
            {s.projects.map((p) => <tr key={p.id}><td className="truncate" style={{ maxWidth: 220 }}>{p.name}</td><td className="small">{p.isSample ? 'ejemplo' : p.analysis?.mode === 'ai' ? 'IA' : p.analysis?.mode === 'rules' ? 'reglas' : '—'}</td><td className="num">{readiness(p)}%</td></tr>)}
          </tbody></table></div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Errores</h3>{sample && <span className="badge sample">Ejemplo</span>}</div>
          <div className="table-wrap"><table className="table"><thead><tr><th>Error</th><th>Código</th><th>30 d</th></tr></thead><tbody>
            {s.events.filter((e) => e.name === 'analysis_failed').map((e, i) => <tr key={'l' + i}><td>Fallo en el análisis (este espacio)</td><td className="mono small">processing</td><td>{timeAgo(e.at)}</td></tr>)}
            {sample && SAMPLE.errors.map((r) => <tr key={r[1]}><td>{r[0]}</td><td className="mono small">{r[1]}</td><td className="num">{r[2]}</td></tr>)}
          </tbody></table></div>
        </div>
      </div>

      <div className="card mt-20">
        <div className="card-head"><h3>Flujo de eventos (este navegador)</h3><span className="xs subtle">eventos de analítica tal y como se enviarían a PostHog</span></div>
        <div className="table-wrap"><table className="table"><tbody>
          {s.events.slice(0, 15).map((e, i) => <tr key={i}><td className="mono small">{e.name}</td><td className="small muted truncate" style={{ maxWidth: 360 }}>{e.props ? JSON.stringify(e.props) : ''}</td><td className="xs subtle" style={{ whiteSpace: 'nowrap' }}>{timeAgo(e.at)}</td></tr>)}
          {s.events.length === 0 && <tr><td className="small muted">Todavía no hay eventos.</td></tr>}
        </tbody></table></div>
      </div>
    </>
  );
}
