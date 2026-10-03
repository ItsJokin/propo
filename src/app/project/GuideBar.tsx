import React from 'react';
import { LuCheck, LuArrowRight } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { navigate } from '../../lib/store';
import { pendingQuestions } from '../../lib/interview';
import { sectionCounts, reqCounts, complianceChecks } from '../../lib/derive';

// La ruta de la propuesta: cuatro pasos que son a la vez la navegación principal del proyecto.
// Cada paso dice en qué estado está y cuánto falta; el resto de vistas quedan en una fila secundaria.
export function GuideBar({ p, tab }: { p: Project; tab: string }) {
  const pending = pendingQuestions(p).length;
  const rc = reqCounts(p);
  const open = rc.needs_info + rc.missing;
  const sc = sectionCounts(p);
  const drafted = p.sections.filter((s) => s.status !== 'not_started' && s.status !== 'generating').length;
  const checks = complianceChecks(p);
  const fails = checks.filter((c) => c.state === 'fail').length;
  const warns = checks.filter((c) => c.state === 'warn').length;
  const approvedAll = !!sc.total && sc.approved === sc.total;
  const steps = [
    {
      k: 'ask', to: 'assistant', tabs: ['assistant', 'requirements'], title: 'Confirma los requisitos',
      status: pending ? `${pending} ${pending === 1 ? 'pregunta por responder' : 'preguntas por responder'}` : open ? `${open} por completar` : 'Todo confirmado',
      done: pending === 0, progress: rc.total ? rc.fulfilled / rc.total : 0,
    },
    {
      k: 'prop', to: drafted ? 'proposal' : 'assistant', tabs: ['proposal', 'criteria', 'economic'], title: 'Aprueba la propuesta',
      status: !drafted ? 'Todavía sin redactar' : approvedAll ? 'Todas las secciones aprobadas' : `${sc.approved} de ${sc.total} secciones aprobadas`,
      done: approvedAll, progress: sc.total ? sc.approved / sc.total : 0,
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
  const more: [string, string, number?][] = [['overview', 'Resumen'], ['requirements', 'Todos los requisitos', rc.total || undefined], ['criteria', 'Criterios'], ['economic', 'Oferta económica'], ['documents', 'Documentos del pliego', p.docs.length || undefined]];
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
