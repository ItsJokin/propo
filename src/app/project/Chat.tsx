import React, { useEffect, useRef, useState } from 'react';
import { LuX, LuSend, LuCircleStop, LuMessageSquare, LuTrash2 } from 'react-icons/lu';
import type { Project, ChatMsg } from '../../lib/types';
import { askPropo, projectPages } from '../../lib/ai/engine';
import { getState, updateProject, track } from '../../lib/store';
import { knowledgeOf, aiActionsLeft } from '../../lib/actions';
import { RichText, SourceChip } from '../../components/ui';
import { openSource, useAIState } from '../common';
import { uid, nowIso } from '../../lib/util';
import { planFor, goAdd } from '../../lib/infoFix';

const SUGGESTIONS = [
  '¿Qué documentación me falta?',
  '¿Qué criterios tienen más peso?',
  '¿Qué experiencia de nuestra empresa puedo utilizar?',
  'Resume el pliego.',
  '¿Qué podría causar nuestra exclusión?',
  'Comprueba si la memoria cumple los requisitos.',
];

export function Chat({ p, onClose }: { p: Project; onClose: () => void }) {
  const ai = useAIState();
  const [q, setQ] = useState('');
  const [streaming, setStreaming] = useState<string | null>(null);
  const ctl = useRef<AbortController | null>(null);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' }); }, [p.chat.length, streaming]);
  const send = async (text: string) => {
    const t = text.trim();
    if (!t || streaming !== null) return;
    setQ('');
    const userMsg: ChatMsg = { id: uid('m'), role: 'user', text: t, at: nowIso() };
    updateProject(p.id, (x) => { x.chat.push(userMsg); });
    setStreaming('');
    ctl.current = new AbortController();
    try {
      const fresh = getState().projects.find((x) => x.id === p.id)!;
      const pages = await projectPages(fresh);
      const canAI = aiActionsLeft(getState(), fresh) > 0;
      const reply = await askPropo({ project: canAI ? fresh : { ...fresh }, question: t, history: fresh.chat.slice(0, -1), knowledge: knowledgeOf(getState()), pages, onText: (s) => setStreaming(s), signal: ctl.current.signal });
      updateProject(p.id, (x) => { x.chat.push(reply); if (reply.mode === 'ai') x.aiActionsUsed++; });
      track('chat_question', { mode: reply.mode });
    } catch {
      updateProject(p.id, (x) => { x.chat.push({ id: uid('m'), role: 'assistant', text: 'Detenido.', at: nowIso(), mode: 'retrieval' }); });
    } finally { setStreaming(null); }
  };
  return (
    <aside className="chat" aria-label="Pregunta a PROPO">
      <div className="chat-head">
        <LuMessageSquare style={{ width: 16, height: 16 }} />
        <div className="grow"><div style={{ fontWeight: 650 }}>Pregunta a PROPO</div><div className="xs subtle">{ai === 'available' ? 'Responde con los documentos de este proyecto y los datos de tu empresa' : 'Modo básico: responde con los datos del proyecto, sin IA'}</div></div>
        {p.chat.length > 0 && <button className="btn btn-ghost btn-sm btn-icon" aria-label="Borrar conversación" onClick={() => updateProject(p.id, (x) => { x.chat = []; })}><LuTrash2 /></button>}
        <button className="btn btn-ghost btn-sm btn-icon" aria-label="Cerrar" onClick={onClose}><LuX /></button>
      </div>
      <div className="chat-body" ref={body}>
        {p.chat.length === 0 && (
          <div className="stack">
            <p className="small muted">Pregunta lo que quieras sobre <strong>{p.name}</strong>. PROPO solo usa los documentos del pliego y los datos de tu empresa, y te dice de dónde sale cada respuesta.</p>
            <div className="suggest">{SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>
          </div>
        )}
        {p.chat.map((m) => <Message key={m.id} m={m} p={p} />)}
        {streaming !== null && (
          <div className="msg assistant">{streaming ? <RichText text={streaming} /> : <span className="row small muted"><span className="dot accent pulse" />Leyendo el proyecto…</span>}</div>
        )}
      </div>
      <div className="chat-input">
        <form onSubmit={(e) => { e.preventDefault(); send(q); }}>
          <textarea rows={1} aria-label="Pregunta a PROPO" placeholder="Pregunta sobre esta licitación…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(q); } }} />
          {streaming !== null ? <button type="button" className="btn btn-secondary btn-sm btn-icon" aria-label="Detener" onClick={() => ctl.current?.abort()}><LuCircleStop /></button> : <button className="btn btn-primary btn-sm btn-icon" aria-label="Enviar" disabled={!q.trim()}><LuSend /></button>}
        </form>
      </div>
    </aside>
  );
}

function Message({ m, p }: { m: ChatMsg; p: Project }) {
  if (m.role === 'user') return <div className="msg user">{m.text}</div>;
  const kinds = Object.fromEntries((m.citations ?? []).map((c) => [c.marker, c.kind]));
  const open = (marker: string) => {
    const c = m.citations?.find((x) => x.marker === marker);
    if (c) openSource({ project: p, docId: c.docId, page: c.page, quote: c.quote, label: c.label, kind: c.kind });
  };
  return (
    <div className="msg assistant">
      <RichText text={m.text} onCite={open} citeKinds={kinds} onInfo={(_, label) => { const plan = planFor(label); if (plan.path) goAdd(plan, p.id, 'Pregunta a PROPO'); }} />
      {m.citations && m.citations.length > 0 && (
        <div className="stack mt-8" style={{ gap: 4 }}>
          {m.citations.map((c) => <SourceChip key={c.marker} label={`${c.marker} · Fuente: ${c.label}`} company={c.kind === 'company'} onClick={() => open(c.marker)} />)}
        </div>
      )}
    </div>
  );
}
