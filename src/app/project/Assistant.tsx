import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LuSend, LuUpload, LuSparkles, LuArrowRight, LuCheck, LuX, LuCircleCheck, LuLoaderCircle, LuFileText, LuRotateCcw, LuBuilding2 } from 'react-icons/lu';
import type { Project, InterviewMsg } from '../../lib/types';
import { navigate, updateProject, getState } from '../../lib/store';
import { pendingQuestions, startInterview, askNext, answer, interviewStats, type Question } from '../../lib/interview';
import { runGenerate } from '../../lib/actions';
import { openSource } from '../common';
import { ExplainButton } from './Explain';
import { ACCEPTED } from '../../lib/pipeline/parse';

const CATS: Record<string, string> = { administrative: 'Documentación', technical: 'Técnico', financial: 'Económico', experience: 'Experiencia', certification: 'Certificación', format: 'Presentación', legal: 'Legal', team: 'Equipo' };
const GENERIC = /^(mock|¿pregunta simulada|¿puede tu empresa cumplir)/i;
const quoteOf = (t: string) => t.replace(/^se exigir[áa]n?:\s*/i, '').replace(/\s+/g, ' ').trim();

// «PROPO te pregunta»: una conversación en la que la pregunta en curso es una tarjeta con todo a la vista
// (qué pide el pliego, qué ha encontrado PROPO, la pregunta y las respuestas) y lo ya contestado queda arriba, resumido.
export function Assistant({ p }: { p: Project }) {
  const [text, setText] = useState('');
  const [multi, setMulti] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [drafting, setDrafting] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const q: Question | undefined = useMemo(() => pendingQuestions(p)[0], [p]);
  const msgs = p.interview?.msgs ?? [];
  const stats = interviewStats(p);
  const toDraft = p.sections.filter((s) => s.status === 'not_started').length;
  // La pregunta en curso se pinta como tarjeta, no como burbuja.
  const history = q && msgs[msgs.length - 1]?.qid === q.id ? msgs.slice(0, -1) : msgs;

  useEffect(() => { if (!p.interview) { startInterview(p); askNext(p.id); } }, [p.id, !!p.interview]);
  useEffect(() => { if (msgs.length > 2 || drafting) end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs.length, drafting, busy]);
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
  const req = q?.reqId ? p.requirements.find((x) => x.id === q.reqId) : undefined;
  const reqOfMsg = (m: InterviewMsg) => (m.qid?.startsWith('req:') ? p.requirements.find((x) => x.id === m.qid!.slice(4)) : undefined);

  return (
    <div className="conv">
      <div className="conv-head">
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow">Paso 1 · Requisitos</div>
          <h2>{q ? 'PROPO necesita confirmar unas cosas contigo' : 'Todo confirmado'}</h2>
          <p className="muted">Solo te pregunta lo que no ha encontrado en los pliegos ni en tu memoria de empresa. Lo que respondas se guarda y no te lo vuelve a preguntar en otras licitaciones.</p>
        </div>
        <div className="conv-progress">
          <div className="rev-segs" aria-hidden="true">{Array.from({ length: Math.max(1, stats.total) }, (_, i) => <span key={i} className={`rev-seg ${i < stats.answered ? 'ok' : i === stats.answered && q ? 'on draft' : ''}`} />)}</div>
          <div className="small"><strong className="num">{stats.answered} de {stats.total}</strong> <span className="muted">respondidas</span></div>
          {msgs.length > 2 && <button className="link xs" onClick={restart}><LuRotateCcw style={{ width: 11, height: 11, verticalAlign: -1, marginRight: 3 }} />Empezar de nuevo</button>}
        </div>
      </div>

      <div className="conv-thread">
        {history.map((m) => {
          const r = reqOfMsg(m);
          return (
            <div key={m.id} className={`asst-msg ${m.role}`}>
              {m.role === 'propo' && <span className="asst-avatar"><LuSparkles /></span>}
              <div className={`asst-bubble ${r ? 'past-q' : ''}`}>
                {r ? <><span className="xs subtle">Te pregunté por</span><strong>{r.title.replace(/…$/, '')}</strong></> : <div>{m.text}</div>}
                {m.actions?.map((x) => <button key={x.to + x.label} className="asst-act" onClick={() => navigate(x.to)}>{x.label} <LuArrowRight /></button>)}
                {!r && m.source && (
                  <button className="asst-source" onClick={() => openSource({ project: p, docId: m.source!.docId, page: m.source!.page, quote: m.source!.quote })}>
                    <LuFileText /> Ver en {m.source.docName?.startsWith('Ficha') ? 'la ficha' : 'el pliego'} · p. {m.source.page}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {busy && <div className="asst-msg propo"><span className="asst-avatar"><LuSparkles /></span><div className="asst-bubble typing-dots"><span /><span /><span /></div></div>}

        {q && !busy && (
          <div className="asst-msg propo" key={q.id}>
            <span className="asst-avatar"><LuSparkles /></span>
            <div className="qcard">
              <div className="qcard-top">
                <span className="qcard-n">Pregunta {stats.answered + 1} de {stats.total}</span>
                {req && <span className="badge outline">{CATS[req.category] ?? 'Requisito'}</span>}
                {req && q.critical && <span className="badge warn">Obligatorio</span>}
                <span className="spacer" />
                {req && <ExplainButton r={req} />}
              </div>

              {req ? (
                <>
                  <h3 className="qcard-title">{req.title.replace(/…$/, '')}</h3>
                  <div className="qcard-block">
                    <div className="qcard-label"><LuFileText /> El pliego pide</div>
                    <blockquote>«{quoteOf(req.text)}»</blockquote>
                    <button className="link xs" onClick={() => openSource({ project: p, docId: req.source.docId, page: req.source.page, quote: req.source.quote ?? req.text })}>Ver en {req.source.docName.startsWith('Ficha') ? 'la ficha' : 'el pliego'} · página {req.source.page}</button>
                  </div>
                  <div className={`qcard-block found ${req.evidence.length ? 'yes' : ''}`}>
                    <div className="qcard-label"><LuBuilding2 /> En tu empresa</div>
                    {req.evidence.length
                      ? <div className="row-wrap">{req.evidence.map((e) => <span key={e.label} className="found-chip">{e.label}</span>)}<span className="xs subtle">Lo he encontrado, pero no puedo comprobar solo que cumple lo exigido.</span></div>
                      : <div className="small muted">No he encontrado nada en tu memoria de empresa que lo acredite.</div>}
                  </div>
                  <p className="qcard-q">{!req.ask || GENERIC.test(req.ask) ? '¿Lo cumple tu empresa?' : req.ask}</p>
                </>
              ) : (
                <p className="qcard-q solo">{q.text}</p>
              )}

              {q.multi && (
                <div className="row-wrap" style={{ marginBottom: 12 }}>
                  {q.multi.map((m) => <button key={m} type="button" className={`chip ${multi.includes(m) ? 'on' : ''}`} onClick={() => setMulti(multi.includes(m) ? multi.filter((x) => x !== m) : [...multi, m])}>{multi.includes(m) && <LuCircleCheck />}{m}</button>)}
                </div>
              )}
              <div className="qcard-answers">
                {q.multi && <button className="ans yes" disabled={!multi.length} onClick={() => send({ multi })}><LuCheck /> Confirmar selección</button>}
                {q.choices.filter((c) => c !== 'Saltar').map((c) => (
                  <button key={c} className={`ans ${c.startsWith('Sí') ? 'yes' : c === 'No' ? 'no' : ''}`} onClick={() => send({ choice: c })}>{c.startsWith('Sí') ? <LuCheck /> : c === 'No' ? <LuX /> : null}{c}</button>
                ))}
              </div>
              <form className="qcard-form" onSubmit={(e) => { e.preventDefault(); if (text.trim()) send({ text: text.trim(), multi: q.multi ? multi : undefined }); }}>
                <input className="input" aria-label="Tu respuesta" placeholder={q.kind === 'req' ? 'O cuéntalo con tus palabras: «Tenemos la póliza con Mapfre hasta 2027»' : q.placeholder} value={text} onChange={(e) => setText(e.target.value)} />
                <button className="btn btn-primary btn-icon" aria-label="Enviar" disabled={!text.trim()}><LuSend /></button>
              </form>
              <div className="qcard-foot">
                {q.kind === 'req' && <button type="button" className="btn btn-ghost btn-sm" onClick={() => file.current?.click()}><LuUpload /> Subir el documento que lo acredita</button>}
                <input ref={file} type="file" hidden accept={ACCEPTED} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) send({ file: f }); }} />
                <span className="spacer" />
                {q.choices.includes('Saltar') && <button type="button" className="btn btn-ghost btn-sm" onClick={() => send({ choice: 'Saltar' })}>Saltar por ahora <LuArrowRight /></button>}
              </div>
            </div>
          </div>
        )}

        {drafting && <div className="asst-msg propo"><span className="asst-avatar"><LuSparkles /></span><div className="asst-bubble"><span className="row small"><LuLoaderCircle className="spin" /> Redactando «{drafting}»…</span></div></div>}

        {!q && !drafting && !busy && (
          <div className="conv-done">
            <span className="rev-done-ic"><LuCheck /></span>
            <h3>{toDraft > 0 && !p.interview?.drafted ? 'Ya tengo lo que necesito' : 'Requisitos confirmados'}</h3>
            <p className="muted">{toDraft > 0 && !p.interview?.drafted ? 'Con tus respuestas y la memoria de tu empresa puedo redactar la propuesta. Después la revisas sección a sección.' : 'El siguiente paso es leer la propuesta y aprobar cada sección.'}</p>
            <div className="row-wrap" style={{ justifyContent: 'center' }}>
              {toDraft > 0 && !p.interview?.drafted && <button className="btn btn-primary btn-lg" onClick={draftAll}><LuSparkles /> Redactar la propuesta ({toDraft} secciones)</button>}
              <button className={`btn ${toDraft > 0 && !p.interview?.drafted ? 'btn-secondary' : 'btn-primary'} btn-lg`} onClick={() => navigate(`/app/projects/${p.id}/proposal`)}>Revisar la propuesta <LuArrowRight /></button>
              <button className="btn btn-ghost" onClick={() => navigate(`/app/projects/${p.id}/requirements`)}>Ver todos los requisitos</button>
            </div>
          </div>
        )}
        <div ref={end} />
      </div>
    </div>
  );
}
