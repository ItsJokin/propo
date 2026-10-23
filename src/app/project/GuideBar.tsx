import React from 'react';
import { LuCheck, LuArrowRight } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { navigate, useStore } from '../../lib/store';
import { pendingQuestions, needsYou } from '../../lib/interview';
import { sectionCounts, reqCounts, complianceChecks } from '../../lib/derive';
import { showsObraTools } from '../../lib/obra';

// La ruta de la propuesta: cuatro pasos que son a la vez la navegación principal del proyecto.
// Cada paso dice en qué estado está y cuánto falta; el resto de vistas quedan en una fila secundaria.
export function GuideBar({ p, tab }: { p: Project; tab: string }) {
  const company = useStore((s) => s.company);
  const pending = pendingQuestions(p).length;
  const rc = reqCounts(p);
  const open = p.requirements.filter(needsYou).length;
  const sc = sectionCounts(p);
  const drafted = p.sections.filter((s) => s.status !== 'not_started' && s.status !== 'generating').length;
  const checks = complianceChecks(p);
  const fails = checks.filter((c) => c.state === 'fail').length;
  const warns = checks.filter((c) => c.state === 'warn').length;
  const approvedAll = !!sc.total && sc.approved === sc.total;
  const steps = [
    {
      k: 'ask', to: 'assistant', tabs: ['assistant', 'requirements'], title: 'Responde a PROPO',
      status: pending ? `${pending} ${pending === 1 ? 'pregunta rápida' : 'preguntas rápidas'}` : open ? `${open} ${open === 1 ? 'dato' : 'datos'} para más adelante` : 'Todo respondido',
      done: pending === 0, progress: pending === 0 ? 1 : rc.total ? rc.fulfilled / rc.total : 0,
    },
    {
      k: 'prop', to: drafted ? 'proposal' : 'assistant', tabs: ['proposal', 'criteria'], title: 'Aprueba la propuesta',
      status: !drafted ? 'Todavía sin redactar' : approvedAll ? 'Todas las secciones aprobadas' : `${sc.approved} de ${sc.total} secciones aprobadas`,
      done: approvedAll, progress: sc.total ? sc.approved / sc.total : 0,
    },
    {
      k: 'price', to: 'economic', tabs: ['economic'], title: 'Fija el precio',
      status: p.pricing?.approved ? 'Precio confirmado' : p.pricing?.choice ? 'Pendiente de confirmar' : 'PROPO te ayuda a calcularlo',
      done: !!p.pricing?.approved, progress: p.pricing?.approved ? 1 : p.pricing?.choice ? 0.6 : p.pricing?.rule ? 0.2 : 0,
    },
    {
      k: 'check', to: 'compliance', tabs: ['compliance'], title: 'Comprobación final',
      status: fails ? `${fails} ${fails === 1 ? 'incidencia por resolver' : 'incidencias por resolver'}` : warns ? `${warns} ${warns === 1 ? 'punto por revisar' : 'puntos por revisar'}` : 'Todo correcto',
      done: !!p.markedReady || (fails === 0 && warns === 0 && approvedAll), progress: checks.length ? checks.filter((c) => c.state === 'pass').length / checks.length : 0,
    },
    {
      k: 'pack', to: 'package', tabs: ['package'], title: 'Descarga el paquete',
      status: p.markedReady ? 'Listo para presentar' : 'Disponible en borrador',
      done: !!p.markedReady, progress: p.markedReady ? 1 : 0,
    },
  ];
  const cur = steps.find((s) => !s.done);
  const go = (to: string) => navigate(`/app/projects/${p.id}${to === 'overview' ? '' : '/' + to}`);
  const more: [string, string, number?][] = [['overview', 'Resumen'], ...(showsObraTools(p, company) ? [['obra', 'Plan de obra'] as [string, string], ['planos', 'Planos de la oferta'] as [string, string]] : []), ['requirements', 'Todos los requisitos', rc.total || undefined], ['criteria', 'Criterios'], ['documents', 'Documentos del pliego', p.docs.length || undefined]];
  return (
    <div className="journey-wrap">
      <nav className="journey" aria-label="Pasos de la propuesta">
        {steps.map((s, i) => (
          <button key={s.k} className={`jstep ${s.done ? 'done' : s === cur ? 'now' : ''} ${s.tabs.includes(tab) ? 'here' : ''}`} onClick={() => go(s.to)} aria-current={s.tabs.includes(tab) ? 'step' : undefined}>
            <span className="jstep-top">
              <span className="jstep-ic">{s.done ? <LuCheck /> : i + 1}</span>
              {s === cur && <span className="jstep-now">Ahora <LuArrowRight /></span>}
            </span>
            <span className="jstep-t">{s.title}</span>
            <span className="jstep-s">{s.status}</span>
            <span className="jstep-bar"><i style={{ width: `${Math.round((s.done ? 1 : s.progress) * 100)}%` }} /></span>
          </button>
        ))}
      </nav>
      <div className="journey-more" role="tablist" aria-label="Más vistas del proyecto">
        {more.map(([k, l, n]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => go(k)}>{l}{n ? <span className="count">{n}</span> : null}</button>)}
      </div>
    </div>
  );
}
