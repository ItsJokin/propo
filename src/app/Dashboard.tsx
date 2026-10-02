import React, { useMemo } from 'react';
import { LuPlus, LuArrowRight, LuChevronRight, LuCircleAlert, LuCalendar, LuFolderKanban, LuTriangleAlert, LuSearch } from 'react-icons/lu';
import { useStore, navigate } from '../lib/store';
import { readiness, projectStatus, issuesCount, deadlineLabel, pendingAITasks, knowledgeScore, reqCounts } from '../lib/derive';
import { Bar, Ring, Empty, SampleBadge } from '../components/ui';
import { StatusBadge } from './common';
import { daysUntil, fmtShort } from '../lib/util';
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

export function Dashboard() {
  const s = useStore((x) => x);
  const matches = useMatches();
  const top = useMemo(() => matches.filter((r) => (daysUntil(r.t.deadline) ?? -1) >= 0).sort((a, b) => b.m.score - a.m.score).slice(0, 3), [matches]);
  const highCount = matches.filter((r) => (daysUntil(r.t.deadline) ?? -1) >= 0 && r.m.score >= 70).length;
  const active = s.projects.filter((p) => !p.markedReady && p.stage !== 'failed');
  const ready = s.projects.filter((p) => projectStatus(p) === 'Lista para presentar' || projectStatus(p) === 'Lista para revisar');
  const attention = s.projects.filter((p) => projectStatus(p) === 'Falta información' || (issuesCount(p) > 0 && !p.markedReady));
  const aiTasks = pendingAITasks(s);
  const ks = knowledgeScore(s);
  const asks = s.projects.flatMap((p) => p.requirements.filter((r) => r.status === 'needs_info' || r.status === 'missing').map((r) => ({ p, r }))).slice(0, 5);
  const upcoming = s.projects.filter((p) => p.analysis?.deadline && (daysUntil(p.analysis.deadline) ?? -1) >= 0 && !p.markedReady).sort((a, b) => +new Date(a.analysis!.deadline!) - +new Date(b.analysis!.deadline!)).slice(0, 4);
  const inactive = !subscriptionActive(s);
  const all = [...s.projects].sort((a, b) => Number(!!a.markedReady) - Number(!!b.markedReady) || (daysUntil(a.analysis?.deadline) ?? 999) - (daysUntil(b.analysis?.deadline) ?? 999));
  return (
    <>
      <div className="page-head">
        <div>
          <h1>{greeting()}{s.user?.name ? `, ${s.user.name.split(' ')[0]}` : ''}</h1>
          <p>{highCount ? `Hay ${highCount} licitaciones abiertas muy compatibles con tu empresa. ` : ''}{active.length ? `${active.length} propuesta${active.length > 1 ? 's' : ''} en curso.` : 'Sube un pliego y PROPO preparará la propuesta.'}</p>
        </div>
        <div className="row-wrap">
          <button className="btn btn-secondary" onClick={() => navigate('/app/tenders')}><LuSearch /> Buscar licitaciones</button>
          <button className="btn btn-primary" onClick={() => navigate('/app/projects?new=1')}><LuPlus /> Nueva propuesta</button>
        </div>
      </div>
      {inactive && (
        <div className="callout warn" style={{ marginBottom: 20 }}>
          <LuTriangleAlert />
          <div className="grow"><strong>{s.subscription.status === 'trialing' ? 'Tu prueba ha terminado.' : 'Tu suscripción no está activa.'}</strong> Tu espacio está en modo lectura. Tu memoria de empresa y tus propuestas se conservan.</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/app/settings/billing')}>Elegir plan</button>
        </div>
      )}
      <div className="kpis">
        <button className="kpi" onClick={() => navigate('/app/projects')}><div className="l">Proyectos activos</div><div className="v num">{active.length}</div></button>
        <button className="kpi" onClick={() => navigate('/app/projects')}><div className="l"><span className="dot ok" />Listos para presentar</div><div className="v num">{ready.length}</div></button>
        <button className="kpi" onClick={() => navigate('/app/projects')}><div className="l"><span className="dot warn" />Requieren atención</div><div className="v num">{attention.length}</div></button>
        <button className="kpi" onClick={() => { const p = s.projects.find((x) => x.sections.some((y) => y.status === 'ai_generated')); navigate(p ? `/app/projects/${p.id}/proposal` : '/app/projects'); }}><div className="l"><span className="dot accent" />Tareas de IA por revisar</div><div className="v num">{aiTasks}</div></button>
      </div>

      <div className="card mt-24">
        <div className="card-head"><h3>Oportunidades para tu empresa</h3><span className="badge outline">Datos reales de TED</span><span className="spacer" /><button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/tenders')}>Ver todas <LuArrowRight /></button></div>
        <div className="t-list" style={{ padding: 20 }}>
          {top.length === 0 ? <p className="muted small">No hay licitaciones abiertas que encajen ahora mismo. Revisa tu perfil de búsqueda.</p> : top.map((r) => <TenderRow key={r.t.id} r={r} saved={s.savedTenders.includes(r.t.id)} onOpen={() => navigate('/app/tenders')} compact />)}
        </div>
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-head"><h3>Proyectos activos</h3><span className="spacer" /><button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/projects')}>Todos los proyectos <LuArrowRight /></button></div>
          {all.length ? <ProjectRows projects={all.slice(0, 6)} /> : (
            <Empty icon={<LuFolderKanban />} title="Aquí vivirán tus propuestas." body="Sube una licitación, un RFP o una solicitud de propuesta. PROPO la analiza y lo prepara todo para tu revisión." action={<button className="btn btn-primary" onClick={() => navigate('/app/projects?new=1')}><LuPlus /> Crear mi primera propuesta</button>} />
          )}
        </div>
        <div className="stack gap-20">
          <div className="card">
            <div className="card-head"><h3>Pendiente de ti</h3><span className="spacer" /><span className="xs subtle num">{asks.length}</span></div>
            {asks.length === 0 ? <div className="small muted" style={{ padding: 24 }}>No hay nada esperando tu respuesta.</div> : asks.map(({ p, r }) => (
              <button key={p.id + r.id} className="list-item" style={{ width: '100%', background: 'none', border: 0, borderBottom: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${p.id}/requirements`)}>
                <span className={`dot ${r.status === 'missing' ? 'bad' : 'warn'}`} style={{ marginTop: 7 }} />
                <span className="grow" style={{ minWidth: 0 }}><span style={{ display: 'block', fontWeight: 500 }} className="truncate">{r.title}</span><span className="xs subtle truncate" style={{ display: 'block' }}>{p.name}</span></span>
              </button>
            ))}
          </div>
          <div className="card">
            <div className="card-head"><h3>Próximos plazos</h3></div>
            {upcoming.length === 0 ? <div className="small muted" style={{ padding: 24 }}>No hay plazos próximos.</div> : upcoming.map((p) => (
              <div key={p.id} className="list-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${p.id}`)}>
                <LuCalendar style={{ width: 16, height: 16, color: 'var(--fg-3)', marginTop: 2 }} />
                <span className="grow" style={{ minWidth: 0 }}><span className="truncate" style={{ display: 'block', fontWeight: 500 }}>{p.name}</span><span className="xs subtle">{fmtShort(p.analysis?.deadline)} · {reqCounts(p).fulfilled}/{reqCounts(p).total} requisitos</span></span>
                <span className="small num" style={{ fontWeight: 600, color: (daysUntil(p.analysis?.deadline) ?? 99) <= 7 ? 'var(--warn-ink)' : 'var(--fg-2)' }}>{deadlineLabel(p.analysis?.deadline)}</span>
              </div>
            ))}
          </div>
          <button className="card card-pad" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate('/app/company')}>
            <div className="row gap-16">
              <Ring value={ks.score} size={60} stroke={6} tone="accent" />
              <div className="grow"><div className="eyebrow">Memoria de empresa</div><div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{ks.score >= 70 ? 'PROPO conoce tu empresa.' : 'Enseña a PROPO cómo es tu empresa.'}</div><div className="xs muted">{ks.score >= 70 ? 'Las nuevas propuestas empiezan con casi todo cubierto.' : 'Cada documento y proyecto que añades cumple requisitos automáticamente.'}</div></div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
