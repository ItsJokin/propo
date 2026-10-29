// Comprobación final: lo que queda antes de presentar, de una en una. Cada tarjeta pide una sola cosa y se resuelve
// ahí mismo; lo que ya está bien queda recogido abajo, sin estorbar.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LuCircleCheck, LuArrowRight, LuShieldCheck, LuInfo, LuCheck, LuChevronLeft, LuChevronDown, LuUpload, LuFileText, LuSparkles, LuListChecks, LuMessageCircle, LuPencil, LuTriangleAlert, LuSend, LuLoaderCircle, LuClock } from 'react-icons/lu';
import type { Project, Requirement } from '../../lib/types';
import { complianceChecks, readiness, priceLeaks, type CheckItem } from '../../lib/derive';
import { Ring, Modal } from '../../components/ui';
import { navigate, updateProject, update, toast, useStore, getState } from '../../lib/store';
import { markReady, updateRequirement, shortenProposal } from '../../lib/actions';
import { friendlyAIError } from '../../lib/ai/provider';
import { needsYou, reqQuestion, answer, outcomeOf, askFor } from '../../lib/interview';
import { plainRequirement } from '../../lib/glossary';
import { ACCEPTED } from '../../lib/pipeline/parse';
import { nowIso, fmtDate } from '../../lib/util';
import { openSource } from '../common';
import { reviewCoherence, fixIssue, coherenceStale, coherenceHash, openIssues, type CoherenceIssue } from '../../lib/coherence';
import { planObra, emptyObra } from '../../lib/obra';

/** Revisión de coherencia en segundo plano (una a la vez por proyecto). Aplica las correcciones seguras al texto. */
const reviewing = new Set<string>();
const failed = new Set<string>();   // la última revisión falló: la tarjeta ofrece reintentar en vez de esperar
async function runCoherence(id: string, onDone?: () => void) {
  if (reviewing.has(id)) return;
  reviewing.add(id); failed.delete(id);
  try {
    const st = getState(); const p = st.projects.find((x) => x.id === id); if (!p) return;
    const coherence = await reviewCoherence(p, st);
    updateProject(id, (x) => {
      // Lo que el cliente ya descartó o PROPO ya arregló no vuelve a salir si la IA lo repite con el mismo título.
      const prev = (x.coherence?.issues ?? []).filter((i) => i.title);   // las de la versión anterior (sin título) no se arrastran
      const gone = new Set(prev.filter((i) => i.dismissed || i.fixed || i.answer).map((i) => i.title.toLowerCase()));
      coherence.issues = coherence.issues.filter((i) => !gone.has(i.title.toLowerCase())).concat(prev.filter((i) => (i.fixed && i.fixes?.length) || i.answer));
      x.coherence = coherence;
      x.activity.unshift({ at: nowIso(), text: `Revisión de coherencia: ${openIssues(x).length} incoherencias por arreglar` });
    });
  } catch { failed.add(id); toast('No se ha podido revisar la coherencia ahora. Vuelve a intentarlo en unos minutos.', 'warn'); }
  finally { reviewing.delete(id); onDone?.(); }
}

type Tone = 'fail' | 'warn';
interface Card { id: string; tone: Tone; kicker: string; title: string; why: string; icon: React.ReactNode; check?: CheckItem; req?: Requirement; papers?: Requirement[]; issue?: CoherenceIssue }

const isOpen = (r: Requirement) => r.status === 'missing' || r.status === 'needs_info';

/** Cómo se le cuenta al cliente cada comprobación automática que no está bien. */
const COPY: Record<string, { title: string; why: string; cta: string }> = {
  technical: { title: 'Termina de revisar la propuesta', why: 'Antes de presentar conviene que alguien de tu equipo haya leído y aprobado cada sección. Es lo que va a puntuar.', cta: 'Ir a la propuesta' },
  criteria: { title: 'Hay criterios que puntúan sin su sección', why: 'Cada criterio que da puntos debería tener un apartado que lo responda. Si falta, esos puntos se pierden.', cta: 'Ver los criterios' },
  pages: { title: 'La propuesta se pasa de páginas', why: 'El pliego pone un máximo. Lo que sobra puede no leerse, o incluso dejar la oferta fuera.', cta: 'Acortar la propuesta' },
  price: { title: 'Hay precios dentro de la memoria técnica', why: 'Los importes solo pueden ir en el sobre de la oferta económica. Si aparecen en la memoria, pueden excluir la oferta.', cta: 'Revisar las secciones' },
  formats: { title: 'Algún documento del pliego no se pudo leer', why: 'PROPO no ha podido leer todos los archivos de la licitación. Échales un vistazo por si piden algo que no hemos visto.', cta: 'Ver los documentos' },
  sources: { title: 'Requisitos que conviene comprobar', why: 'Algunos requisitos no coinciden palabra por palabra con el pliego. Míralos para asegurarte de que están bien leídos.', cta: 'Revisar los requisitos' },
};
const TAB: Record<string, string> = { technical: 'proposal', criteria: 'criteria', pages: 'proposal', price: 'proposal', formats: 'documents', sources: 'requirements' };

function buildCards(p: Project, checks: CheckItem[]): Card[] {
  const by = (id: string) => checks.find((c) => c.id === id);
  const cards: Card[] = [];
  // 1 · Lo que solo puede decir el cliente: un requisito por tarjeta.
  const yours = p.requirements.filter(needsYou);
  for (const r of yours) cards.push({ id: 'req:' + r.id, tone: r.status === 'missing' ? 'fail' : 'warn', kicker: 'Una pregunta', title: r.title.replace(/…$/, ''), why: '', icon: <LuMessageCircle />, req: r });
  // 2 · El resto de papeles obligatorios, juntos en una lista para ir marcando.
  const inChecks = (r: Requirement) => ['administrative', 'legal', 'certification'].includes(r.category) || (['experience', 'financial', 'team'].includes(r.category) && !/offer|price|precio|oferta/i.test(r.title + r.text));
  const papers = p.requirements.filter((r) => isOpen(r) && inChecks(r) && !needsYou(r));
  if (papers.length) cards.push({ id: 'papers', tone: papers.some((r) => r.status === 'missing') ? 'fail' : 'warn', kicker: 'Papeles', title: papers.length === 1 ? 'Un papel que tendrás que adjuntar' : `${papers.length} papeles que tendrás que adjuntar`, why: 'Son documentos y declaraciones que se entregan al presentar la oferta. PROPO te prepara los modelos; aquí solo confirmas que los tienes localizados.', icon: <LuListChecks />, papers });
  // 3 · Comprobaciones automáticas que no han salido bien.
  // Coherencia: mientras PROPO relee la oferta, una tarjeta de espera; después, una tarjeta por incoherencia real.
  if (p.sections.some((x) => x.content.trim())) {
    if (coherenceStale(p)) cards.push({ id: 'coherence-run', tone: 'warn', kicker: 'Coherencia', title: 'PROPO está comprobando que todo encaje', why: 'Relee la oferta entera como un jefe de licitaciones: que la memoria, el plan de obra, el precio y los compromisos no se contradigan, que se respete lo que fija el pliego y que no se cuele en la memoria nada del sobre económico.', icon: <LuSparkles /> });
    else for (const i of openIssues(p)) cards.push({ id: `co:${i.id}`, tone: i.severity === 'critical' ? 'fail' : 'warn', kicker: i.kind === 'lesson' ? 'Lo penalizan los tribunales' : 'Coherencia', title: i.title || 'Algo no encaja', why: i.problem, icon: <LuSparkles />, issue: i });
  }
  for (const id of ['technical', 'criteria', 'pages', 'price', 'formats', 'sources']) {
    const c = by(id);
    if (c && c.state !== 'pass') cards.push({ id, tone: c.state, kicker: 'Revisión', title: COPY[id].title, why: COPY[id].why, icon: id === 'technical' ? <LuPencil /> : <LuTriangleAlert />, check: c });
  }
  // 4 · Lo que siempre decide una persona.
  if (!p.manualChecks.financialApproved && !p.pricing?.approved) cards.push({ id: 'financial', tone: 'fail', kicker: 'Tu decisión', title: 'Fija y confirma el precio', why: 'El precio suele dar muchos puntos. En el paso «Fija el precio» PROPO te explica cómo se puntúa en este pliego y calcula contigo el mejor precio sin que pierdas dinero.', icon: <LuShieldCheck />, check: by('financial') });
  if (!p.manualChecks.signature) cards.push({ id: 'signature', tone: 'warn', kicker: 'Último paso', title: '¿Quién firma la oferta?', why: 'La oferta la firma el representante legal de la empresa con su firma electrónica (el certificado digital con el que se firman documentos por internet).', icon: <LuPencil />, check: by('signature') });
  return cards;
}

export function Compliance({ p }: { p: Project }) {
  const checks = complianceChecks(p);
  const r = readiness(p);
  const cards = useMemo(() => buildCards(p, checks), [p]);
  const [later, setLater] = useState<string[]>([]);     // tarjetas que el cliente ha dejado para luego, por orden
  const [showOk, setShowOk] = useState(false);
  const [confirmReady, setConfirmReady] = useState(false);
  const fails = checks.filter((c) => c.state === 'fail').length;
  const passes = checks.filter((c) => c.state === 'pass');
  const pending = cards.filter((c) => !later.includes(c.id));
  const cur = pending[0];
  const postponed = cards.filter((c) => later.includes(c.id));
  const skip = (id: string) => setLater((l) => (l.includes(id) ? l : [...l, id]));
  const back = () => setLater((l) => l.slice(0, -1));
  const reopen = (id: string) => setLater((l) => l.filter((x) => x !== id));
  const n = cards.length;
  const pos = cur ? cards.indexOf(cur) + 1 : n;
  // La revisión de coherencia se lanza sola al entrar y cada vez que la oferta ha cambiado desde la última.
  const [, tick] = useState(0);
  const ready = p.sections.some((x) => x.content.trim());
  useEffect(() => { if (ready && coherenceStale(p) && !reviewing.has(p.id) && !failed.has(p.id)) { tick((t) => t + 1); runCoherence(p.id, () => tick((t) => t + 1)); } }, [p.id, ready && coherenceStale(p)]);

  return (
    <div className="stack gap-16 fin">
      <div className="card card-pad fin-head">
        <Ring value={r} size={84} stroke={8} tone={r >= 90 ? 'ok' : 'accent'} label={<span style={{ fontSize: 20 }}>{r}%</span>} />
        <div className="grow" style={{ minWidth: 220 }}>
          <div className="eyebrow">Comprobación final</div>
          <h2 className="mt-4" style={{ fontSize: 23 }}>{p.markedReady ? 'Marcada como lista para presentar' : n === 0 ? 'Todo listo para presentar' : n === 1 ? 'Solo queda una cosa' : `Te quedan ${n} cosas`}</h2>
          <p className="muted mt-4">{p.markedReady ? `Marcada como lista el ${fmtDate(p.markedReady)}. La presentación la hace tu equipo en la plataforma de contratación.` : n === 0 ? 'PROPO lo ha comprobado todo. Solo falta que la marques como lista.' : 'Vamos de una en una. Puedes dejar cualquiera para luego y volver cuando quieras.'}</p>
        </div>
      </div>

      {n > 0 && (
        <div className="fin-dots" role="list" aria-label="Pasos pendientes">
          {cards.map((c, i) => (
            <button key={c.id} role="listitem" className={`fin-dot ${cur?.id === c.id ? 'on' : ''} ${later.includes(c.id) ? 'later' : ''} ${c.tone}`} title={c.title} aria-label={`Paso ${i + 1}: ${c.title}`}
              onClick={() => setLater((l) => { const rest = l.filter((x) => x !== c.id); const before = cards.slice(0, i).map((x) => x.id).filter((x) => !rest.includes(x)); return [...rest, ...before]; })} />
          ))}
        </div>
      )}

      {cur ? (
        <section className="card fin-card" key={cur.id}>
          <div className="fin-card-top">
            <span className={`fin-ic ${cur.tone}`}>{cur.icon}</span>
            <div className="grow">
              <div className="fin-kicker">Paso {pos} de {n} · {cur.kicker}{cur.tone === 'fail' ? <span className="fin-must">Necesario para presentar</span> : <span className="fin-opt">Recomendable</span>}</div>
              <h3>{cur.title}</h3>
            </div>
          </div>
          {cur.why && <p className="fin-why">{cur.why}</p>}
          <div className="fin-body">
            {cur.req ? <ReqStep p={p} r={cur.req} onUnresolved={() => skip(cur.id)} />
              : cur.papers ? <PapersStep p={p} list={cur.papers} />
              : cur.id === 'signature' ? <SignatureStep p={p} />
              : cur.id === 'financial' ? <FinancialStep p={p} />
              : cur.id === 'pages' ? <PagesStep p={p} detail={cur.check?.detail ?? ''} />
              : cur.id === 'coherence-run' && failed.has(p.id) && !reviewing.has(p.id) ? <div className="stack gap-12"><div className="well small">No se ha podido terminar la revisión. Suele ser algo puntual.</div><div><button className="btn btn-primary" onClick={() => { tick((t) => t + 1); runCoherence(p.id, () => tick((t) => t + 1)); }}><LuSparkles /> Reintentar</button></div></div>
              : cur.id === 'coherence-run' ? <div className="fin-work"><div className="row small"><LuLoaderCircle className="spin" /> <span>PROPO está releyendo la oferta entera…</span></div><p className="xs muted" style={{ margin: 0 }}>Tarda uno o dos minutos. Si encuentra algo que no encaja, te lo enseña aquí con un botón para arreglarlo.</p></div>
              : cur.issue ? <IssueStep key={cur.issue.id} p={p} issue={cur.issue} />
              : cur.id === 'price' ? <IssueStep key="price" p={p} issue={priceIssue(p)} />
              : <div className="stack gap-12"><div className="well small">{cur.check?.detail}</div><div><button className="btn btn-primary" onClick={() => navigate(`/app/projects/${p.id}/${TAB[cur.id]}`)}>{COPY[cur.id].cta} <LuArrowRight /></button></div></div>}
          </div>
          <div className="fin-nav">
            <button className="btn btn-ghost btn-sm" disabled={!later.length} onClick={back}><LuChevronLeft /> Anterior</button>
            <span className="spacer" />
            <button className="btn btn-ghost btn-sm" onClick={() => skip(cur.id)}><LuClock /> Lo dejo para luego <LuArrowRight /></button>
          </div>
        </section>
      ) : (
        <section className="card rev-done fin-card" key="end">
          <span className="rev-done-ic" style={postponed.length ? { background: 'var(--warn-soft)', color: 'var(--warn-ink)' } : undefined}>{postponed.length ? <LuClock /> : <LuCircleCheck />}</span>
          <h3>{postponed.length ? (postponed.length === 1 ? 'Has dejado una cosa para luego' : `Has dejado ${postponed.length} cosas para luego`) : p.markedReady ? 'Lista para presentar' : 'Todo comprobado'}</h3>
          <p className="muted">{postponed.length ? (fails ? 'Las marcadas como necesarias hay que resolverlas antes de presentar. Pulsa cualquiera para retomarla.' : 'Ninguna impide presentar. Puedes retomarlas o marcar ya la propuesta como lista.') : p.markedReady ? 'Descarga el paquete y preséntalo en la plataforma de contratación antes de la fecha límite.' : 'No queda nada pendiente. Márcala como lista y descarga el paquete para presentarlo.'}</p>
          {postponed.length > 0 && <div className="fin-later">{postponed.map((c) => <button key={c.id} onClick={() => reopen(c.id)}><span className={`fin-ic sm ${c.tone}`}>{c.icon}</span><span className="grow">{c.title}</span>{c.tone === 'fail' && <span className="fin-must">Necesario</span>}<LuArrowRight /></button>)}</div>}
          <div className="row-wrap" style={{ justifyContent: 'center' }}>
            {later.length > 0 && <button className="btn btn-ghost" onClick={back}><LuChevronLeft /> Anterior</button>}
            {p.markedReady
              ? <button className="btn btn-primary" onClick={() => navigate(`/app/projects/${p.id}/package`)}>Ir al paquete <LuArrowRight /></button>
              : <button className="btn btn-approve" disabled={fails > 0} title={fails ? 'Resuelve antes lo que es necesario para presentar' : undefined} onClick={() => setConfirmReady(true)}><LuShieldCheck /> Marcar como lista</button>}
          </div>
        </section>
      )}

      <div className="card fin-ok">
        <button className="fin-ok-head" onClick={() => setShowOk(!showOk)} aria-expanded={showOk}>
          <LuCircleCheck className="state-ico ok" />
          <span className="grow"><strong>{passes.length} de {checks.length} comprobaciones ya están bien</strong><span className="small muted"> · PROPO las revisa solo cada vez que cambias algo</span></span>
          <LuChevronDown style={{ transform: showOk ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
        </button>
        {showOk && <div className="fin-ok-list">{passes.map((c) => <div key={c.id}><LuCheck /><div><div className="check-title">{c.label}</div><div className="small muted">{c.detail}</div></div></div>)}</div>}
      </div>

      <CoherenceFixed p={p} />

      <div className="callout neutral small"><LuInfo /><div>La firma, los precios y la presentación en la plataforma de contratación los hace siempre tu equipo. PROPO no presenta nada por ti.</div></div>

      {confirmReady && (
        <Modal title="¿Marcar como lista para presentar?" onClose={() => setConfirmReady(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setConfirmReady(false)}>Cancelar</button><button className="btn btn-primary" onClick={() => { markReady(p.id); setConfirmReady(false); toast('Marcada como lista para presentar', 'ok'); navigate(`/app/projects/${p.id}/package`); }}>Marcar como lista</button></>}>
          <p className="muted">Queda registrado que tu equipo ha revisado la propuesta. PROPO no la presenta: descarga el paquete y preséntalo en la plataforma de contratación antes de la fecha límite.</p>
          {cards.length > 0 && <div className="callout warn small mt-16"><LuTriangleAlert /><div>Quedan puntos recomendables sin revisar: {cards.map((w) => w.title).join(' · ')}.</div></div>}
        </Modal>
      )}
    </div>
  );
}

/** Un requisito que solo puede confirmar el cliente: qué piden, lo que ya nos dijo y las respuestas posibles. */
function ReqStep({ p, r, onUnresolved }: { p: Project; r: Requirement; onUnresolved: () => void }) {
  const q = useMemo(() => reqQuestion(p, r), [p.id, r.id]);
  const pl = plainRequirement(r);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const send = async (a: { choice?: string; text?: string; file?: File }) => {
    setBusy(true);
    await answer(p.id, q, a);
    setBusy(false);
    const now = getState().projects.find((x) => x.id === p.id)?.requirements.find((x) => x.id === r.id);
    if (now && isOpen(now)) { toast(outcomeOf(a.choice ?? '') === 'later' ? 'Lo dejamos para luego' : 'Anotado. Lo verás aquí hasta que se resuelva.'); onUnresolved(); }
    else toast('Resuelto', 'ok');
  };
  return (
    <div className="stack gap-12">
      <div className="qcard-plain" style={{ margin: 0 }}>
        <p><strong>Qué te piden, en claro.</strong> {pl.what}</p>
        <p><strong>Cómo se demuestra.</strong> {pl.how}</p>
      </div>
      {r.note && !/pendiente de confirmar/i.test(r.note) && <div className="fin-said"><LuSparkles /><div><strong>Lo que ya nos dijiste.</strong> {r.note.replace(/^Respuesta( de [^:]+)?:\s*/i, '')}</div></div>}
      <button className="link xs" style={{ justifySelf: 'start' }} onClick={() => openSource({ project: p, docId: r.source.docId, page: r.source.page, quote: r.source.quote ?? r.text })}><LuFileText style={{ width: 12, height: 12, verticalAlign: -1, marginRight: 4 }} />Ver lo que dice el pliego · página {r.source.page}</button>
      <p className="qcard-q" style={{ margin: 0 }}>{askFor(r).q}</p>
      {askFor(r).detail && <p className="small muted" style={{ margin: 0 }}>Si lo sabes, escríbelo abajo: {askFor(r).detail}</p>}
      <div className="qcard-answers">
        {q.choices.filter((c) => outcomeOf(c) !== 'later').map((c) => <button key={c} disabled={busy} className={`ans ${outcomeOf(c) === 'yes' ? 'yes' : ''}`} onClick={() => send({ choice: c })}>{outcomeOf(c) === 'yes' ? <LuCheck /> : null}{c}</button>)}
      </div>
      <form className="qcard-form" onSubmit={(e) => { e.preventDefault(); if (text.trim()) send({ text: text.trim() }); }}>
        <input className="input" aria-label="Tu respuesta" placeholder="O cuéntalo con tus palabras" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn btn-primary btn-icon" aria-label="Enviar" disabled={!text.trim() || busy}>{busy ? <LuLoaderCircle className="spin" /> : <LuSend />}</button>
      </form>
      <div><button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => file.current?.click()}><LuUpload /> Adjuntar el documento que lo demuestra</button></div>
      <input ref={file} type="file" hidden accept={ACCEPTED} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) send({ file: f }); }} />
    </div>
  );
}

/** Los papeles que se adjuntan al presentar: una lista para ir marcando. */
function PapersStep({ p, list }: { p: Project; list: Requirement[] }) {
  const [all, setAll] = useState(false);
  const who = useStore((s) => s.user?.name) ?? 'tu equipo';
  const mark = (r: Requirement) => updateRequirement(p.id, r.id, { status: 'fulfilled', humanValidated: true, note: `Localizado por ${who} en la comprobación final` }, `Papel localizado: ${r.title}`);
  const shown = all ? list : list.slice(0, 6);
  return (
    <div className="stack gap-12">
      <div className="fin-papers">
        {shown.map((r) => (
          <label key={r.id}>
            <input type="checkbox" checked={false} onChange={() => mark(r)} />
            <span className="grow"><span className="check-title">{r.title.replace(/…$/, '')}</span>{(r.how || r.plain) && <span className="small muted" style={{ display: 'block' }}>{r.how || r.plain}</span>}</span>
          </label>
        ))}
      </div>
      {list.length > 6 && !all && <button className="link small" style={{ justifySelf: 'start' }} onClick={() => setAll(true)}>Ver los {list.length - 6} restantes</button>}
      <div className="row-wrap">
        <button className="btn btn-primary" onClick={() => { list.forEach(mark); toast('Papeles marcados como localizados', 'ok'); }}><LuCheck /> Los tengo todos</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/app/projects/${p.id}/requirements`)}>Verlos con detalle <LuArrowRight /></button>
      </div>
    </div>
  );
}

/** La propuesta se pasa de páginas: PROPO la resume sola, sin trabajo para el cliente. */
function PagesStep({ p, detail }: { p: Project; detail: string }) {
  const [prog, setProg] = useState<{ done: number; total: number; title: string } | null>(null);
  const run = async () => {
    setProg({ done: 0, total: p.sections.length, title: '' });
    const r = await shortenProposal(p.id, (done, total, title) => setProg({ done, total, title }));
    setProg(null);
    if (r.ok) toast(`Propuesta resumida: ahora ocupa unas ${Math.round(r.pages)} páginas de ${r.limit}`, 'ok');
    else if (r.error) toast(r.error === 'not_available' ? 'La IA no está disponible ahora mismo. Inténtalo en unos minutos.' : friendlyAIError(r.error), 'bad');
    else toast(`La he acortado hasta unas ${Math.round(r.pages)} páginas, pero el límite es ${r.limit}. Pulsa otra vez para resumir un poco más.`, 'warn');
  };
  return (
    <div className="stack gap-12">
      <div className="well small">{detail}</div>
      {prog ? (
        <div className="fin-work">
          <div className="row small"><LuLoaderCircle className="spin" /> <span>PROPO está resumiendo la propuesta{prog.title ? `: «${prog.title}»` : '…'}</span><span className="spacer" /><span className="muted num">{Math.min(prog.done + 1, prog.total)} de {prog.total}</span></div>
          <div className="fin-bar"><i style={{ width: `${Math.round((prog.done / Math.max(1, prog.total)) * 100)}%` }} /></div>
          <p className="xs muted" style={{ margin: 0 }}>Tarda uno o dos minutos. No cierres esta página.</p>
        </div>
      ) : (
        <>
          <p className="small muted" style={{ margin: 0 }}>PROPO puede acortarla por ti: quita repeticiones y relleno y conserva los compromisos, las cifras y todo lo que puntúa. No tienes que hacer nada más.</p>
          <div className="row-wrap">
            <button className="btn btn-primary" onClick={run}><LuSparkles /> Que PROPO la resuma automáticamente</button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/app/projects/${p.id}/proposal`)}>Prefiero acortarla yo <LuArrowRight /></button>
          </div>
        </>
      )}
    </div>
  );
}

function SignatureStep({ p }: { p: Project }) {
  const saved = useStore((s) => s.company.signer) ?? '';
  const [name, setName] = useState(saved);
  const [ok, setOk] = useState(false);
  const confirm = () => {
    const nm = name.trim();
    updateProject(p.id, (x) => { x.manualChecks.signature = true; x.activity.unshift({ at: nowIso(), text: `Firmante confirmado: ${nm}` }); });
    update((s) => { s.company.signer = nm; });
    toast('Firmante confirmado', 'ok');
  };
  return (
    <div className="stack gap-12">
      <div className="field"><label htmlFor="sg-n">Nombre y apellidos de quien firma</label><input id="sg-n" className="input" placeholder="Por ejemplo: Marta Puig Soler" value={name} onChange={(e) => setName(e.target.value)} />{saved && <span className="xs muted">Es quien firmó la última vez. Cámbialo si esta vez firma otra persona.</span>}</div>
      <label className="choice"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /> Tiene su firma electrónica en vigor y firmará todos los documentos.</label>
      <div><button className="btn btn-primary" disabled={!name.trim() || !ok} onClick={confirm}><LuCheck /> Confirmar firmante</button></div>
    </div>
  );
}

function FinancialStep({ p }: { p: Project }) {
  const user = useStore((s) => s.user);
  const [ok, setOk] = useState(false);
  const [ok2, setOk2] = useState(false);
  const rules = p.requirements.filter((r) => /price|precio|economic offer|oferta econ/i.test(r.title + ' ' + r.text)).slice(0, 4);
  const given = (p.answers ?? []).filter((a) => a.kind === 'price');
  return (
    <div className="stack gap-12">
      <div className="row-wrap"><button className="btn btn-primary" onClick={() => navigate(`/app/projects/${p.id}/economic`)}>Ir a fijar el precio con PROPO <LuArrowRight /></button></div>
      <p className="small muted">¿Ya tienes el precio preparado por tu cuenta? Confírmalo aquí:</p>
      {given.length > 0 && <div className="fin-said"><LuSparkles /><div><strong>Los precios que ya nos diste al revisar la propuesta.</strong>{given.map((a) => <div key={a.at} className="mt-4">· {a.value}</div>)}</div></div>}
      {rules.length > 0 && (
        <div className="well small stack" style={{ gap: 6 }}>
          <strong>Lo que dice el pliego sobre el precio</strong>
          {rules.map((r) => <div key={r.id}>· {r.plain || r.text} <span className="xs subtle">(p. {r.source.page})</span></div>)}
        </div>
      )}
      <label className="choice"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /> Los precios los hemos fijado y revisado nosotros, en el modelo que pide el pliego.</label>
      <label className="choice"><input type="checkbox" checked={ok2} onChange={(e) => setOk2(e.target.checked)} /> No superan el máximo permitido y van solo en el sobre de la oferta económica.</label>
      <div className="row-wrap">
        <button className="btn btn-secondary" disabled={!ok || !ok2} onClick={() => { updateProject(p.id, (x) => { x.manualChecks.financialApproved = true; x.activity.unshift({ at: nowIso(), text: `Oferta económica aprobada por ${user?.name ?? 'tu equipo'}` }); }); toast('Oferta económica aprobada', 'ok'); }}><LuCheck /> Dar el visto bueno</button>
      </div>
    </div>
  );
}

/** Una incoherencia: PROPO la arregla con un botón; solo si le falta un dato que únicamente tiene el cliente, lo pregunta. */
const ABOUT_YOU = /\bCV\b|responsable|director|experiencia|contrato|trabajos?|referencias?|personal|plantilla|equipo|trabajador|camarer|cociner|t[ée]cnic|medios|maquinaria|veh[ií]cul|certificad|carn[eé]|formaci[oó]n|seguro|solvencia/i;
/** Ayuda para que el cliente sepa qué contar según de qué trata la incoherencia. */
function explainHint(title: string, problem: string) {
  return hintFor(title) ?? hintFor(problem) ?? 'Cuéntalo como se lo contarías a un compañero: PROPO lo redacta con el tono de la oferta.';
}
function hintFor(t: string): string | null {
  if (/\bCV\b|curr[ií]cul|responsable|director|coordinador|personal|plantilla|equipo|trabajador|camarer|cociner/i.test(t)) return 'Por ejemplo: quién es el responsable y su experiencia o titulación, cuántas personas trabajan con vosotros, si contratáis personal por horas o de refuerzo.';
  if (/experiencia|contrato|trabajos?|referencias?|solvencia/i.test(t)) return 'Por ejemplo: otros trabajos parecidos que habéis hecho (para quién, cuándo, de qué tamaño), aunque no estén en la ficha de la empresa.';
  if (/t[ée]cnic/i.test(t)) return 'Por ejemplo: quién se encarga, su experiencia o formación, y cómo lo organizáis.';
  if (/medios|maquinaria|veh[ií]cul/i.test(t)) return 'Por ejemplo: qué medios, vehículos o maquinaria tenéis o podéis alquilar para este contrato.';
  return null;
}

function IssueStep({ p, issue }: { p: Project; issue: CoherenceIssue }) {
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const aboutYou = ABOUT_YOU.test(`${issue.title} ${issue.problem}`);
  const [explain, setExplain] = useState(aboutYou);
  const title = (id: string) => (id === 'obra' ? 'Plan de obra' : p.sections.find((x) => x.id === id)?.title ?? id);
  const patch = (fn: (i: CoherenceIssue) => void) => updateProject(p.id, (x) => { const it = x.coherence?.issues.find((i) => i.id === issue.id); if (it) fn(it); });
  const fix = async (answer?: string) => {
    setBusy(true);
    try {
      const st = getState(); const cur = st.projects.find((x) => x.id === p.id) ?? p;
      if (issue.id === 'r-plazo') {   // el plan de obra se rehace para que quepa en el plazo
        const g = await planObra(cur, st.company, st.team);
        const over = !!g.plazo && g.total > g.plazo;
        updateProject(p.id, (x) => { x.obra = x.obra ?? emptyObra(); x.obra.gantt = g; const it = x.coherence?.issues.find((i) => i.id === issue.id); if (it) it.fixed = !over; if (x.coherence) x.coherence.hash = coherenceHash(x); });
        toast(over ? 'He rehecho el plan de obra, pero sigue pasándose del plazo. Revísalo en «Plan de obra».' : 'Plan de obra rehecho dentro del plazo', over ? 'warn' : 'ok');
        return;
      }
      const r = await fixIssue(cur, st, issue, answer);
      const applied = r.fixes.filter((f) => f.applied);
      updateProject(p.id, (x) => {
        for (const sec of x.sections) if (r.contents[sec.id] != null && r.contents[sec.id] !== sec.content) { sec.content = r.contents[sec.id]; sec.updatedAt = nowIso(); }
        const it = x.coherence?.issues.find((i) => i.id === issue.id);
        // Con la explicación del cliente la incoherencia queda resuelta: nunca se vuelve a hacer la misma pregunta.
        if (it) { it.fixes = r.fixes; it.fixed = applied.length > 0; it.answer = answer ?? it.answer; if (answer && !applied.length) it.dismissed = true; it.question = applied.length || answer ? null : (r.question ?? 'No he encontrado cómo arreglarlo sin un dato tuyo. ¿Puedes contarme cómo es en realidad?'); }
        if (x.coherence) x.coherence.hash = coherenceHash(x);   // arreglar una no obliga a revisar todo otra vez
        if (applied.length) x.activity.unshift({ at: nowIso(), text: `PROPO ha arreglado una incoherencia: ${issue.title}` });
      });
      if (applied.length) toast(answer ? 'Hecho: he añadido tu explicación a la memoria. Lo tienes en «Lo que ha arreglado PROPO», por si quieres deshacerlo.' : 'Arreglado. Lo tienes en «Lo que ha arreglado PROPO», por si quieres deshacerlo.', 'ok');
      else if (answer) toast(`He guardado tu explicación y PROPO la tendrá en cuenta. Si quieres, revisa el texto en «${issue.where.map(title).join(', ') || 'la propuesta'}».`, 'ok');
      else if (!getState().projects.find((x) => x.id === p.id)?.coherence?.issues.some((i) => i.id === issue.id)) toast('No he podido arreglarlo solo. Revísalo en la sección indicada.', 'warn');
    } catch (e: any) { toast(friendlyAIError(e?.code ?? 'upstream_error'), 'bad'); }
    finally { setBusy(false); }
  };
  return (
    <div className="stack gap-12">
      {issue.where.length > 0 && <div className="xs muted">En: {issue.where.map(title).join(' · ')}</div>}
      {busy ? (
        <div className="fin-work"><div className="row small"><LuLoaderCircle className="spin" /> <span>PROPO lo está arreglando…</span></div></div>
      ) : issue.question ? (
        <div className="stack gap-8">
          <div className="fin-said"><LuMessageCircle /><div><strong>Necesito un dato tuyo.</strong> {issue.question}</div></div>
          <textarea className="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Escríbelo con tus palabras" />
          <div className="row-wrap">
            <button className="btn btn-primary" disabled={!text.trim()} onClick={() => fix(text.trim())}><LuSend /> Enviar y que PROPO lo arregle</button>
            <button className="btn btn-ghost btn-sm" onClick={() => patch((i) => { i.dismissed = true; })}>No es un problema</button>
          </div>
        </div>
      ) : explain ? (
        <div className="stack gap-8">
          <div className="fin-said"><LuMessageCircle /><div><strong>{aboutYou ? 'Antes de cambiar nada, cuéntame cómo es en realidad.' : 'Explícamelo con tus palabras.'}</strong> {explainHint(issue.title, issue.problem)}</div></div>
          <textarea className="textarea" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Escríbelo con tus palabras, sin preocuparte por cómo queda: PROPO lo redacta" />
          <div className="row-wrap">
            <button className="btn btn-primary" disabled={!text.trim()} onClick={() => fix(text.trim())}><LuSend /> Enviar y que PROPO lo arregle</button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setExplain(false); fix(); }}><LuSparkles /> Que PROPO lo arregle sin más</button>
            <button className="btn btn-ghost btn-sm" onClick={() => patch((i) => { i.dismissed = true; })}>No es un problema</button>
          </div>
        </div>
      ) : (
        <div className="row-wrap">
          <button className="btn btn-primary" onClick={() => fix()}><LuSparkles /> Que PROPO lo arregle</button>
          <button className="btn btn-secondary" onClick={() => setExplain(true)}><LuMessageCircle /> Explicarlo con mis palabras</button>
          <button className="btn btn-ghost btn-sm" onClick={() => patch((i) => { i.dismissed = true; })}>No es un problema</button>
        </div>
      )}
    </div>
  );
}

/** Lo que PROPO ha cambiado al arreglar incoherencias, con la opción de deshacerlo. */
function CoherenceFixed({ p }: { p: Project }) {
  const [open, setOpen] = useState(false);
  const fixed = (p.coherence?.issues ?? []).filter((i) => i.fixed && i.fixes.some((f) => f.applied));
  if (!fixed.length) return null;
  const title = (id: string) => p.sections.find((x) => x.id === id)?.title ?? id;
  const undo = (id: string) => updateProject(p.id, (x) => {
    const it = x.coherence?.issues.find((i) => i.id === id); if (!it) return;
    for (const f of it.fixes.filter((z) => z.applied)) { const sec = x.sections.find((z) => z.id === f.section); const at = sec ? sec.content.indexOf(f.after) : -1; if (sec && at >= 0) { sec.content = sec.content.slice(0, at) + f.before + sec.content.slice(at + f.after.length); f.applied = false; } }
    it.fixed = false; it.dismissed = true;
    if (x.coherence) x.coherence.hash = coherenceHash(x);
  });
  return (
    <div className="card fin-ok">
      <button className="fin-ok-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <LuSparkles className="state-ico ok" />
        <span className="grow"><strong>Lo que ha arreglado PROPO</strong><span className="small muted"> · {fixed.length} incoherencia{fixed.length > 1 ? 's' : ''} corregida{fixed.length > 1 ? 's' : ''}</span></span>
        <LuChevronDown style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
      </button>
      {open && <div className="fin-ok-list">{fixed.map((i) => (
        <div key={i.id}><LuCheck /><div className="grow">
          <div className="check-title">{i.title}</div>
          {i.fixes.filter((f) => f.applied).map((f, k) => <div key={k} className="xs mt-4"><span className="muted">En «{title(f.section)}»: </span><span style={{ textDecoration: 'line-through', opacity: 0.65 }}>{f.before}</span> → <strong>{f.after}</strong></div>)}
          <button className="link xs mt-4" onClick={() => undo(i.id)}>Deshacer</button>
        </div></div>
      ))}</div>}
    </div>
  );
}

/** Los importes filtrados en la memoria se tratan como una incoherencia más: PROPO los quita con un botón. */
function priceIssue(p: Project): CoherenceIssue {
  const leaks = priceLeaks(p);
  const title = (id: string) => p.sections.find((x) => x.id === id)?.title ?? id;
  return { id: 'price', severity: 'critical', title: 'Hay precios dentro de la memoria técnica', fixed: false, question: null, fixes: [], where: leaks.map((l) => l.section),
    problem: `Estos importes pueden revelar la oferta económica y no pueden ir en la memoria técnica: ${leaks.map((l) => `en «${title(l.section)}», ${l.amounts.join(', ') || 'precios unitarios'}`).join('; ')}. Quítalos sin cambiar el resto del texto.` };
}
