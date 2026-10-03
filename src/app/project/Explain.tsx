// «¿Qué significa?»: un chat breve que explica un requisito en lenguaje llano a quien no lo conoce.
// Con IA responde a medida del pliego y de la empresa; sin IA usa el glosario de PROPO.
import React, { useEffect, useRef, useState } from 'react';
import { LuInfo, LuSend, LuSparkles, LuFileText } from 'react-icons/lu';
import type { Project, Requirement } from '../../lib/types';
import { Modal, RichText } from '../../components/ui';
import { ai, aiState, getSample } from '../../lib/ai/provider';
import { explainRequirement, followUp, TERMS } from '../../lib/glossary';
import { getState, track } from '../../lib/store';
import { openSource } from '../common';

interface Msg { role: 'user' | 'propo'; text: string }

/** Botón pequeño que abre la explicación de un requisito. */
export function ExplainButton({ p, r, label = '¿Qué significa?' }: { p: Project; r: Requirement; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="explain-btn" onClick={(e) => { e.stopPropagation(); setOpen(true); track('requirement_explained', { category: r.category }); }}><LuInfo /> {label}</button>
      {open && <ExplainChat p={p} r={r} onClose={() => setOpen(false)} />}
    </>
  );
}

function ExplainChat({ p, r, onClose }: { p: Project; r: Requirement; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'user', text: `¿Qué significa «${r.title.replace(/…$/, '')}»?` }]);
  const [typing, setTyping] = useState<string | null>('');
  const [q, setQ] = useState('');
  const body = useRef<HTMLDivElement>(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' }); }, [msgs.length, typing]);

  const company = getState().company;
  const context = () => [
    `Requisito: ${r.title}`,
    `Texto literal del pliego: «${r.text}» (${r.source.docName}, página ${r.source.page})`,
    `Estado en PROPO: ${r.status === 'fulfilled' ? 'cumplido' : 'pendiente de confirmar'}${r.evidence.length ? `. Lo que PROPO ha encontrado en la empresa: ${r.evidence.map((e) => e.label).join('; ')}` : ''}${r.ask ? `. Lo que PROPO pregunta: ${r.ask}` : ''}`,
    `Empresa: ${company.legalName || 'sin nombre'}${company.employees ? `, ${company.employees} empleados` : ''}${company.revenue ? `, facturación ${company.revenue}` : ''}`,
    `Notas de referencia (úsalas si son correctas para este caso): ${explainRequirement(r)}`,
  ].join('\n');

  /** Responde con IA si está disponible; si no, o si falla, con el glosario. */
  const reply = async (history: Msg[], fallback: string) => {
    setTyping('');
    let text = fallback;
    try {
      const sample = await getSample();
      if (sample && aiState() !== 'declined') {
        const rules = 'Eres PROPO, asistente de licitaciones públicas en España. Explicas a una persona que NO es experta en contratación pública. Lenguaje llano, sin jerga; si usas un término técnico, defínelo. Sé concreto y breve (máximo 170 palabras). Estructura con subtítulos en **negrita** seguidos de punto. No inventes datos de la empresa ni del pliego: usa solo el contexto. Si no lo sabes, dilo. Responde en español.';
        const turns = [{ role: 'user' as const, content: `${rules}\n\nCONTEXTO\n${context()}` }, { role: 'assistant' as const, content: 'Entendido.' },
          ...history.map((m) => ({ role: m.role === 'user' ? 'user' as const : 'assistant' as const, content: m.text }))];
        const out = await ai.text(turns, { tier: 'quick', onText: (t) => { if (alive.current) setTyping(t); } });
        if (out.text.trim()) text = out.text.trim();
      } else await new Promise((res) => setTimeout(res, 450));
    } catch { /* se queda la explicación del glosario */ }
    if (!alive.current) return;
    setTyping(null);
    setMsgs((m) => [...m, { role: 'propo', text }]);
  };
  useEffect(() => { reply(msgs, explainRequirement(r)); }, []);

  const send = (t: string) => {
    const text = t.trim();
    if (!text || typing !== null) return;
    const next = [...msgs, { role: 'user' as const, text }];
    setMsgs(next); setQ('');
    reply(next, followUp(text, r));
  };
  const asked = new Set(msgs.filter((m) => m.role === 'user').map((m) => m.text));
  const suggestions = ['¿Cómo lo acredito paso a paso?', '¿Qué pasa si no lo cumplo?', '¿Puedo presentarme igualmente?', ...TERMS.filter((t) => t.match.test(r.text.toLowerCase()) && !t.match.test(r.title.toLowerCase())).slice(0, 1).map((t) => `¿Qué es ${t.name.toLowerCase()}?`)].filter((s) => !asked.has(s)).slice(0, 3);

  return (
    <Modal title="PROPO te lo explica" sub={r.title} onClose={onClose}
      footer={<form className="explain-input" onSubmit={(e) => { e.preventDefault(); send(q); }}>
        <input className="input" aria-label="Pregunta a PROPO sobre este requisito" placeholder="Pregunta lo que no entiendas…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-primary btn-icon" aria-label="Enviar" disabled={!q.trim() || typing !== null}><LuSend /></button>
      </form>}>
      <div className="explain-body" ref={body}>
        {msgs.map((m, i) => m.role === 'user'
          ? <div key={i} className="msg user">{m.text}</div>
          : <div key={i} className="explain-row"><span className="asst-avatar"><LuSparkles /></span><div className="msg assistant"><RichText text={m.text} />
            {i === 1 && <button className="asst-source" onClick={() => { onClose(); openSource({ project: p, docId: r.source.docId, page: r.source.page, quote: r.source.quote ?? r.text }); }}><LuFileText /> Ver en el pliego · p. {r.source.page}</button>}</div></div>)}
        {typing !== null && <div className="explain-row"><span className="asst-avatar"><LuSparkles /></span><div className="msg assistant">{typing ? <RichText text={typing} /> : <span className="typing-dots"><span /><span /><span /></span>}</div></div>}
        {typing === null && suggestions.length > 0 && <div className="suggest explain-suggest">{suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>}
      </div>
    </Modal>
  );
}
