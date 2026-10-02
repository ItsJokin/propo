import React from 'react';
import { LuCheck, LuArrowRight } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { navigate } from '../../lib/store';
import { pendingQuestions } from '../../lib/interview';
import { sectionCounts, complianceChecks } from '../../lib/derive';

// Guía de 4 pasos siempre visible: dónde estás y qué hacer ahora, con un solo botón.
export function GuideBar({ p, tab }: { p: Project; tab: string }) {
  const pending = pendingQuestions(p).length;
  const sc = sectionCounts(p);
  const drafted = p.sections.filter((s) => s.status !== 'not_started' && s.status !== 'generating').length;
  const fails = complianceChecks(p).filter((c) => c.state === 'fail').length;
  const steps = [
    { k: 'docs', label: 'Pliegos leídos', done: true, to: 'documents' },
    { k: 'ask', label: pending ? `Responde a PROPO (${pending})` : 'Preguntas respondidas', done: pending === 0, to: 'assistant' },
    { k: 'prop', label: sc.total && sc.approved === sc.total ? 'Propuesta aprobada' : drafted ? `Revisa la propuesta (${sc.approved}/${sc.total})` : 'Redacta la propuesta', done: !!sc.total && sc.approved === sc.total, to: 'proposal' },
    { k: 'pack', label: p.markedReady ? 'Paquete listo' : 'Descarga el paquete', done: !!p.markedReady, to: fails ? 'compliance' : 'package' },
  ];
  const cur = steps.find((s) => !s.done) ?? steps[3];
  const cta = cur.k === 'ask' ? 'Responder ahora' : cur.k === 'prop' ? (drafted ? 'Revisar la propuesta' : 'Redactar con PROPO') : cur.k === 'pack' ? (fails ? 'Resolver incidencias' : 'Preparar el paquete') : 'Ver documentos';
  const onTarget = (cur.to === tab) || (cur.k === 'prop' && !drafted && tab === 'assistant');
  return (
    <div className="guide">
      <ol className="guide-steps">
        {steps.map((s, i) => (
          <li key={s.k} className={s.done ? 'done' : s === cur ? 'now' : ''}>
            <button onClick={() => navigate(`/app/projects/${p.id}/${s.to}`)}>
              <span className="guide-ic">{s.done ? <LuCheck /> : i + 1}</span><span className="guide-l">{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
      {!onTarget && !(cur.done) && <button className="btn btn-primary btn-sm" onClick={() => navigate(`/app/projects/${p.id}/${cur.k === 'prop' && !drafted ? 'assistant' : cur.to}`)}>{cta} <LuArrowRight /></button>}
    </div>
  );
}
