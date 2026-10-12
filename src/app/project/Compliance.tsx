// Comprobación final: lo que queda antes de presentar, de una en una. Cada tarjeta pide una sola cosa y se resuelve
// ahí mismo; lo que ya está bien queda recogido abajo, sin estorbar.
import React, { useMemo, useRef, useState } from 'react';
import { LuCircleCheck, LuArrowRight, LuShieldCheck, LuInfo, LuCheck, LuChevronLeft, LuChevronDown, LuUpload, LuFileText, LuSparkles, LuListChecks, LuMessageCircle, LuPencil, LuTriangleAlert, LuSend, LuLoaderCircle, LuClock } from 'react-icons/lu';
import type { Project, Requirement } from '../../lib/types';
import { complianceChecks, readiness, type CheckItem } from '../../lib/derive';
import { Ring, Modal } from '../../components/ui';
import { navigate, updateProject, update, toast, useStore, getState } from '../../lib/store';
import { markReady, updateRequirement } from '../../lib/actions';
import { needsYou, reqQuestion, answer, outcomeOf } from '../../lib/interview';
import { plainRequirement } from '../../lib/glossary';
import { ACCEPTED } from '../../lib/pipeline/parse';
import { nowIso, fmtDate } from '../../lib/util';
import { openSource } from '../common';

type Tone = 'fail' | 'warn';
interface Card { id: string; tone: Tone; kicker: string; title: string; why: string; icon: React.ReactNode; check?: CheckItem; req?: Requirement; papers?: Requirement[] }

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
  for (const id of ['technical', 'criteria', 'pages', 'price', 'formats', 'sources']) {
    const c = by(id);
    if (c && c.state !== 'pass') cards.push({ id, tone: c.state, kicker: 'Revisión', title: COPY[id].title, why: COPY[id].why, icon: id === 'technical' ? <LuPencil /> : <LuTriangleAlert />, check: c });
  }
  // 4 · Lo que siempre decide una persona.
  if (!p.manualChecks.financialApproved) cards.push({ id: 'financial', tone: 'fail', kicker: 'Tu decisión', title: 'Da el visto bueno a los precios', why: 'PROPO nunca pone ni sugiere precios. Solo necesita que confirmes que los habéis fijado vosotros y que van en su sitio.', icon: <LuShieldCheck />, check: by('financial') });
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
      {r.note && <div className="fin-said"><LuSparkles /><div><strong>Lo que ya nos dijiste.</strong> {r.note.replace(/^Respuesta( de [^:]+)?:\s*/i, '')}</div></div>}
      <button className="link xs" style={{ justifySelf: 'start' }} onClick={() => openSource({ project: p, docId: r.source.docId, page: r.source.page, quote: r.source.quote ?? r.text })}><LuFileText style={{ width: 12, height: 12, verticalAlign: -1, marginRight: 4 }} />Ver lo que dice el pliego · página {r.source.page}</button>
      <p className="qcard-q" style={{ margin: 0 }}>{r.ask && !/^(mock|¿pregunta simulada|¿puede tu empresa cumplir)/i.test(r.ask) ? r.ask : '¿Lo cumple tu empresa?'}</p>
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
        <button className="btn btn-primary" disabled={!ok || !ok2} onClick={() => { updateProject(p.id, (x) => { x.manualChecks.financialApproved = true; x.activity.unshift({ at: nowIso(), text: `Oferta económica aprobada por ${user?.name ?? 'tu equipo'}` }); }); toast('Oferta económica aprobada', 'ok'); }}><LuCheck /> Dar el visto bueno</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/app/projects/${p.id}/economic`)}>Ver la oferta económica <LuArrowRight /></button>
      </div>
    </div>
  );
}
