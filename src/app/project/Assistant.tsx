import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LuSend, LuPaperclip, LuSparkles, LuArrowRight, LuCircleCheck, LuLoaderCircle, LuFileText, LuRotateCcw } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { navigate, updateProject, getState } from '../../lib/store';
import { pendingQuestions, startInterview, askNext, answer, interviewStats, type Question } from '../../lib/interview';
import { runGenerate } from '../../lib/actions';
import { openSource } from '../common';
import { ExplainButton } from './Explain';
import { ACCEPTED } from '../../lib/pipeline/parse';
import { reqCounts } from '../../lib/derive';

export function Assistant({ p }: { p: Project }) {
  const [text, setText] = useState('');
  const [multi, setMulti] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [drafting, setDrafting] = useState<string | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const q: Question | undefined = useMemo(() => pendingQuestions(p)[0], [p]);
  const msgs = p.interview?.msgs ?? [];
  const stats = interviewStats(p);
  const rc = reqCounts(p);
  const toDraft = p.sections.filter((s) => s.status === 'not_started').length;

  useEffect(() => { if (!p.interview) { startInterview(p); askNext(p.id); } }, [p.id, !!p.interview]);
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' }); }, [msgs.length, drafting]);
  useEffect(() => { setMulti([]); setText(''); }, [q?.id]);

  const send = async (a: { choice?: string; text?: string; multi?: string[]; file?: File }) => {
    if (!q || busy) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 250)); // ritmo de conversación
    await answer(p.id, q, a);
    setText(''); setMulti([]); setBusy(false);
  };
  const draftAll = async () => {
    const todo = getState().projects.find((x) => x.id === p.id)!.sections.filter((s) => s.status === 'not_started');
    for (const s of todo) { setDrafting(s.title); await runGenerate(p.id, s.id, false, true); }
    const mode = getState().projects.find((x) => x.id === p.id)!.sections.some((s) => s.generatedBy === 'ai') ? 'ai' : 'template';
    setDrafting(null);
    updateProject(p.id, (pr) => {
      pr.interview ??= { msgs: [], answered: [] };
      pr.interview.drafted = true;
      pr.interview.msgs.push({ id: 'm' + Date.now(), role: 'propo', at: new Date().toISOString(), text: mode === 'ai' ? `He redactado ${todo.length} sección${todo.length === 1 ? '' : 'es'} de la propuesta con tus respuestas y tu memoria de empresa. Cada afirmación cita su fuente; lo que no sé lo marco como «Información requerida». Revísalas y apruébalas: nada se da por bueno sin una persona.` : `He preparado ${todo.length} sección${todo.length === 1 ? '' : 'es'} con la estructura del pliego, tus respuestas y las fuentes. ${getState().demo ? 'Como es la demo, las he redactado con la memoria de la empresa de ejemplo para que veas cómo queda una propuesta completa.' : 'En esta vista la IA no está disponible, así que son borradores de plantilla: ábrelos en claude.ai para que los redacte la IA, o complétalos tú.'}` });
    });
  };
  const restart = () => updateProject(p.id, (pr) => { pr.interview = undefined; });

  return (
    <div className="asst">
      <div className="asst-main">
        <div className="asst-body" ref={body}>
          {msgs.map((m) => (
            <div key={m.id} className={`asst-msg ${m.role}`}>
              {m.role === 'propo' && <span className="asst-avatar"><LuSparkles /></span>}
              <div className="asst-bubble">
                <div>{m.text}</div>
                {m.actions?.map((x) => <button key={x.to + x.label} className="asst-act" onClick={() => navigate(x.to)}>{x.label} <LuArrowRight /></button>)}
                {m.source && (
                  <button className="asst-source" onClick={() => openSource({ project: p, docId: m.source!.docId, page: m.source!.page, quote: m.source!.quote })}>
                    <LuFileText /> Ver en {m.source.docName?.startsWith('Ficha') ? 'la ficha' : 'el pliego'} · p. {m.source.page}
                  </button>
                )}
              </div>
            </div>
          ))}
          {busy && <div className="asst-msg propo"><span className="asst-avatar"><LuSparkles /></span><div className="asst-bubble typing-dots"><span /><span /><span /></div></div>}
          {drafting && <div className="asst-msg propo"><span className="asst-avatar"><LuSparkles /></span><div className="asst-bubble"><span className="row small"><LuLoaderCircle className="spin" /> Redactando «{drafting}»…</span></div></div>}
          {!q && !drafting && (
            <div className="asst-actions">
              {toDraft > 0 && !p.interview?.drafted && <button className="btn btn-primary" onClick={draftAll}><LuSparkles /> Redactar la propuesta ({toDraft} secciones)</button>}
              <button className={`btn ${toDraft > 0 && !p.interview?.drafted ? 'btn-secondary' : 'btn-primary'}`} onClick={() => navigate(`/app/projects/${p.id}/proposal`)}>Revisar la propuesta <LuArrowRight /></button>
              <button className="btn btn-ghost" onClick={() => navigate(`/app/projects/${p.id}/requirements`)}>Ver todos los requisitos</button>
            </div>
          )}
        </div>

        {q && (
          <div className="asst-input">
            {(() => { const req = q.reqId ? p.requirements.find((x) => x.id === q.reqId) : undefined; return (q.hint || req) ? <div className="row xs subtle" style={{ marginBottom: 8 }}><span className="grow">{q.hint}</span>{req && <ExplainButton p={p} r={req} />}</div> : null; })()}
            {q.multi && (
              <div className="row-wrap" style={{ marginBottom: 10 }}>
                {q.multi.map((m) => <button key={m} type="button" className={`chip ${multi.includes(m) ? 'on' : ''}`} onClick={() => setMulti(multi.includes(m) ? multi.filter((x) => x !== m) : [...multi, m])}>{multi.includes(m) && <LuCircleCheck />}{m}</button>)}
              </div>
            )}
            <div className="row-wrap" style={{ marginBottom: 10 }}>
              {q.multi && <button className="btn btn-primary btn-sm" disabled={!multi.length || busy} onClick={() => send({ multi })}>Confirmar</button>}
              {q.choices.map((c) => <button key={c} className={`btn btn-sm ${c.startsWith('Sí') ? 'btn-primary' : 'btn-secondary'}`} disabled={busy} onClick={() => send({ choice: c })}>{c}</button>)}
            </div>
            <form className="asst-form" onSubmit={(e) => { e.preventDefault(); if (text.trim()) send({ text: text.trim(), multi: q.multi ? multi : undefined }); }}>
              {q.kind === 'req' && <button type="button" className="btn btn-ghost btn-icon" aria-label="Adjuntar documento" title="Adjuntar el documento que lo acredita" onClick={() => file.current?.click()}><LuPaperclip /></button>}
              <input ref={file} type="file" hidden accept={ACCEPTED} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) send({ file: f }); }} />
              <input className="input" aria-label="Tu respuesta" placeholder={q.placeholder} value={text} onChange={(e) => setText(e.target.value)} disabled={busy} />
              <button className="btn btn-primary btn-icon" aria-label="Enviar" disabled={!text.trim() || busy}><LuSend /></button>
            </form>
          </div>
        )}
      </div>

      <aside className="asst-side">
        <div className="card" style={{ padding: 18 }}>
          <div className="eyebrow">Tu progreso</div>
          <div className="asst-progress mt-12"><span style={{ width: `${stats.total ? (stats.answered / stats.total) * 100 : 100}%` }} /></div>
          <div className="small mt-8"><strong>{stats.answered}</strong> de {stats.total} preguntas respondidas</div>
          <div className="divider mt-16" />
          <div className="stack mt-16" style={{ gap: 8 }}>
            <div className="row small"><span className="dot ok" />{rc.fulfilled} requisitos cumplidos</div>
            <div className="row small"><span className="dot bad" />{rc.missing} no cumplidos</div>
            <div className="row small"><span className="dot" />{rc.needs_info} otros requisitos del pliego, para revisar cuando quieras</div>
          </div>
        </div>
        <div className="card mt-16" style={{ padding: 18 }}>
          <div className="eyebrow">Cómo funciona</div>
          <p className="small muted mt-8">PROPO solo te pregunta lo que no ha encontrado en los pliegos ni en tu memoria de empresa. Tus respuestas se guardan en los requisitos y en tu perfil, así no te las vuelve a preguntar en otras licitaciones.</p>
          {msgs.length > 2 && <button className="btn btn-ghost btn-sm mt-8" onClick={restart}><LuRotateCcw /> Reiniciar conversación</button>}
        </div>
      </aside>
    </div>
  );
}
