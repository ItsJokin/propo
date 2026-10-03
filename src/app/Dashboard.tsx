import React, { useMemo } from 'react';
import { LuPlus, LuArrowRight, LuChevronRight, LuCircleAlert, LuFolderKanban, LuTriangleAlert, LuSearch, LuSparkles, LuCheck, LuBuilding2, LuFileCheck, LuTarget } from 'react-icons/lu';
import { useStore, navigate } from '../lib/store';
import { readiness, projectStatus, issuesCount, deadlineLabel } from '../lib/derive';
import { Bar, Empty, SampleBadge } from '../components/ui';
import { StatusBadge } from './common';
import { daysUntil } from '../lib/util';
import type { Project } from '../lib/types';
import { subscriptionActive } from '../lib/actions';
import { useMatches, TenderRow } from './Tenders';

export function ProjectRows({ projects }: { projects: Project[] }) {
  return (
    <div>
      <div className="proj-head-row"><span>Proyecto</span><span>Estado</span><span>Progreso</span><span>Plazo</span><span>Incidencias</span><span /></div>
      {projects.map((p) => {
        const r = readiness(p);
        const d = daysUntil(p.analysis?.deadline);
        const iss = issuesCount(p);
        return (
          <div key={p.id} className="proj-card" onClick={() => navigate(p.stage === 'analyzing' ? `/app/analyze/${p.id}` : `/app/projects/${p.id}`)} role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/app/projects/${p.id}`); }}>
            <div style={{ minWidth: 0 }}>
              <div className="t truncate">{p.name}</div>
              <div className="row small muted" style={{ minWidth: 0 }}>{p.isSample && <SampleBadge />}<span className="truncate">{p.organization || '—'}</span></div>
            </div>
            <div><StatusBadge p={p} /></div>
            <div className="c-progress row gap-12"><div className="grow"><Bar value={r} tone={r >= 90 ? 'ok' : 'accent'} /></div><span className="small num" style={{ width: 36, textAlign: 'right', fontWeight: 600 }}>{r}%</span></div>
            <div className="c-deadline small num" style={{ color: d != null && d <= 7 && d >= 0 ? 'var(--warn-ink)' : undefined, fontWeight: d != null && d <= 7 ? 600 : undefined }}>{deadlineLabel(p.analysis?.deadline)}</div>
            <div className="c-issues small">{iss > 0 ? <span className="row" style={{ color: 'var(--bad-ink)', fontWeight: 600 }}><LuCircleAlert style={{ width: 14, height: 14 }} />{iss}</span> : <span className="subtle">—</span>}</div>
            <LuChevronRight className="c-arrow" style={{ width: 16, height: 16, color: 'var(--fg-3)' }} />
          </div>
        );
      })}
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 14 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
}

interface NextStep { icon: React.ReactNode; title: string; body: string; cta: string; to: string; alt?: { label: string; to: string } }

/** Inicio: una sola acción recomendada, el recorrido en tres pasos y dos listas cortas. */
export function Dashboard() {
  const s = useStore((x) => x);
  const matches = useMatches();
  const open = useMemo(() => matches.filter((r) => (daysUntil(r.t.deadline) ?? -1) >= 0), [matches]);
  const top = useMemo(() => [...open].sort((a, b) => b.m.score - a.m.score).slice(0, 3), [open]);
  const highCount = useMemo(() => open.filter((r) => r.m.score >= 70).length, [open]);
  const inactive = !subscriptionActive(s);
  const own = s.projects.filter((p) => !p.isSample);
  const byDeadline = (a: Project, b: Project) => (daysUntil(a.analysis?.deadline) ?? 999) - (daysUntil(b.analysis?.deadline) ?? 999);
  const all = [...s.projects].sort((a, b) => Number(!!a.markedReady) - Number(!!b.markedReady) || Number(a.isSample) - Number(b.isSample) || byDeadline(a, b));
  const pendingOf = (p: Project) => p.requirements.filter((r) => r.status === 'needs_info' || r.status === 'missing').length;
  const pending = s.projects.reduce((a, p) => a + (p.markedReady ? 0 : pendingOf(p)), 0);

  const hasProfile = s.company.cpvs.length > 0 && !!s.company.description;
  const hasTender = own.length > 0 || s.savedTenders.length > 0;
  const hasProposal = own.some((p) => !!p.markedReady || projectStatus(p) === 'Lista para revisar');
  const path = [
    { done: hasProfile, title: 'Enseña a PROPO tu empresa', body: 'Responde unas preguntas para que sepa qué contratos te encajan.', to: '/welcome', icon: <LuBuilding2 /> },
    { done: hasTender, title: 'Elige una licitación', body: 'Mira las más compatibles y analiza la que te interese.', to: '/app/tenders', icon: <LuTarget /> },
    { done: hasProposal, title: 'Revisa la propuesta', body: 'PROPO la redacta con tus datos; tú la revisas y la presentas.', to: own[0] ? `/app/projects/${own[0].id}` : '/app/projects', icon: <LuFileCheck /> },
  ];
  const current = path.findIndex((x) => !x.done);

  const next: NextStep = (() => {
    const live = own.filter((p) => !p.markedReady && p.stage === 'active').sort(byDeadline);
    const urgent = live.find((p) => { const d = daysUntil(p.analysis?.deadline); return d != null && d >= 0 && d <= 7; });
    const blocked = live.find((p) => pendingOf(p) > 0);
    const review = live.find((p) => projectStatus(p) === 'Lista para revisar');
    const tendersAlt = { label: 'Buscar más licitaciones', to: '/app/tenders' };
    if (!hasProfile) return { icon: <LuBuilding2 />, title: 'Cuéntale a PROPO a qué se dedica tu empresa', body: 'Son unas preguntas rápidas. Sin ellas PROPO no puede saber qué licitaciones encajan contigo.', cta: 'Completar la memoria de empresa', to: '/welcome', alt: { label: 'Ver licitaciones igualmente', to: '/app/tenders' } };
    if (urgent) { const d = daysUntil(urgent.analysis?.deadline)!; return { icon: <LuTriangleAlert />, title: `«${urgent.name}» vence ${d === 0 ? 'hoy' : d === 1 ? 'mañana' : `en ${d} días`}`, body: `La propuesta está al ${readiness(urgent)} %. ${pendingOf(urgent) ? `Faltan ${pendingOf(urgent)} datos por completar.` : 'Revísala y márcala como lista.'}`, cta: 'Continuar la propuesta', to: `/app/projects/${urgent.id}`, alt: tendersAlt }; }
    if (blocked) { const n = pendingOf(blocked); return { icon: <LuCircleAlert />, title: `PROPO necesita ${n} ${n === 1 ? 'dato tuyo' : 'datos tuyos'} para «${blocked.name}»`, body: 'Son requisitos del pliego que no ha podido cubrir con la memoria de tu empresa. Al responderlos, la propuesta avanza sola.', cta: 'Responder ahora', to: `/app/projects/${blocked.id}/requirements`, alt: tendersAlt }; }
    if (review) return { icon: <LuFileCheck />, title: `«${review.name}» está lista para que la revises`, body: 'PROPO ha redactado todas las secciones. Léela, ajusta lo que quieras y apruébala.', cta: 'Revisar la propuesta', to: `/app/projects/${review.id}/proposal`, alt: tendersAlt };
    if (live[0]) return { icon: <LuFileCheck />, title: `Sigue con «${live[0].name}»`, body: `La propuesta está al ${readiness(live[0])} %.`, cta: 'Continuar la propuesta', to: `/app/projects/${live[0].id}`, alt: tendersAlt };
    return { icon: <LuTarget />, title: highCount ? `Hay ${highCount.toLocaleString('es-ES')} licitaciones abiertas que encajan muy bien con tu empresa` : 'Encuentra tu próxima licitación', body: 'Elige una y pulsa «Analizar»: PROPO lee los pliegos y prepara la propuesta para que tú solo la revises.', cta: 'Ver mis licitaciones', to: '/app/tenders', alt: { label: 'Ya tengo un pliego: subirlo', to: '/app/projects?new=1' } };
  })();

  return (
    <>
      <div className="page-head" style={{ marginBottom: 20 }}>
        <div><h1>{greeting()}{s.user?.name ? `, ${s.user.name.split(' ')[0]}` : ''}</h1></div>
      </div>
      {inactive && (
        <div className="callout warn" style={{ marginBottom: 20 }}>
          <LuTriangleAlert />
          <div className="grow"><strong>{s.subscription.status === 'trialing' ? 'Tu prueba ha terminado.' : 'Tu suscripción no está activa.'}</strong> Tu espacio está en modo lectura. Tu memoria de empresa y tus propuestas se conservan.</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/app/settings/billing')}>Elegir plan</button>
        </div>
      )}

      <section className="next-step" aria-label="Tu siguiente paso">
        <span className="next-step-ico">{next.icon}</span>
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="eyebrow"><LuSparkles style={{ width: 13, height: 13, verticalAlign: -2, marginRight: 5 }} />Tu siguiente paso</div>
          <h2>{next.title}</h2>
          <p>{next.body}</p>
          <div className="row-wrap next-step-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate(next.to)}>{next.cta} <LuArrowRight /></button>
            {next.alt && <button className="btn btn-ghost" onClick={() => navigate(next.alt!.to)}>{next.alt.label}</button>}
          </div>
        </div>
      </section>

      {current !== -1 && (
        <ol className="path" aria-label="Cómo funciona PROPO">
          {path.map((x, i) => (
            <li key={x.title}>
              <button className={`path-step ${x.done ? 'done' : i === current ? 'now' : ''}`} onClick={() => navigate(x.to)} aria-current={i === current ? 'step' : undefined}>
                <span className="path-n">{x.done ? <LuCheck /> : i + 1}</span>
                <span style={{ minWidth: 0 }}><span className="path-t">{x.title}</span><span className="path-b">{x.done ? 'Hecho' : x.body}</span></span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="card mt-24">
        <div className="card-head"><h3>Licitaciones recomendadas para ti</h3><span className="spacer" /><button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/tenders')}><LuSearch /> Ver todas</button></div>
        <div className="t-list" style={{ padding: 20 }}>
          {top.length === 0 ? <p className="muted small">No hay licitaciones abiertas que encajen ahora mismo. Revisa tu perfil de búsqueda.</p> : top.map((r) => <TenderRow key={r.t.id} r={r} saved={s.savedTenders.includes(r.t.id)} onOpen={() => navigate('/app/tenders')} compact />)}
        </div>
      </div>

      <div className="card mt-24">
        <div className="card-head"><h3>Tus propuestas</h3>{pending > 0 && <span className="badge warn">{pending} {pending === 1 ? 'dato pendiente' : 'datos pendientes'} de ti</span>}<span className="spacer" /><button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/projects?new=1')}><LuPlus /> Nueva</button>{all.length > 4 && <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/projects')}>Ver todas <LuArrowRight /></button>}</div>
        {all.length === 0 ? (
          <Empty icon={<LuFolderKanban />} title="Aquí aparecerán tus propuestas." body="Elige una licitación o sube un pliego. PROPO lo analiza y prepara la propuesta para tu revisión." action={<button className="btn btn-primary" onClick={() => navigate('/app/tenders')}><LuSearch /> Ver licitaciones</button>} />
        ) : all.slice(0, 4).map((p) => {
          const d = daysUntil(p.analysis?.deadline);
          return (
            <button key={p.id} className="dash-prop" onClick={() => navigate(p.stage === 'analyzing' ? `/app/analyze/${p.id}` : `/app/projects/${p.id}`)}>
              <span className="grow" style={{ minWidth: 0 }}>
                <span className="dash-prop-t truncate">{p.name}</span>
                <span className="row small muted" style={{ minWidth: 0 }}>{p.isSample && <SampleBadge />}<span className="truncate">{p.organization || '—'}</span></span>
              </span>
              <StatusBadge p={p} />
              <span className="dash-prop-d small num" style={{ color: d != null && d <= 7 && d >= 0 && !p.markedReady ? 'var(--warn-ink)' : undefined }}>{deadlineLabel(p.analysis?.deadline)}</span>
              <LuChevronRight style={{ width: 16, height: 16, color: 'var(--fg-3)', flex: 'none' }} />
            </button>
          );
        })}
      </div>
    </>
  );
}
