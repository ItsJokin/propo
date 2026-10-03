import React, { useState } from 'react';
import { LuPencil, LuRefreshCw, LuCheck, LuX, LuFileText, LuChevronRight, LuChevronLeft, LuCircleStop, LuSparkles, LuBookmarkPlus, LuRotateCcw, LuTriangleAlert, LuInfo } from 'react-icons/lu';
import type { Project, Section } from '../../lib/types';
import { runGenerate, stopGenerate, setSectionStatus, saveSectionContent, aiActionsLeft } from '../../lib/actions';
import { RichText, SECTION_LABEL, SECTION_TONE, SourceChip, Bar } from '../../components/ui';
import { openSource, useAIState } from '../common';
import { update, toast, useStore, getState, navigate } from '../../lib/store';
import { estimatePages, pageLimitNumber } from '../../lib/derive';
import { uid, nowIso, wordCount, timeAgo } from '../../lib/util';
import { InfoFixModal } from './InfoFix';
import { planFor } from '../../lib/infoFix';

const FLOW: Section['status'][] = ['draft', 'ai_generated', 'reviewed', 'approved'];

export function Proposal({ p }: { p: Project }) {
  const [active, setActive] = useState((p.sections.find((s) => s.status !== 'approved') ?? p.sections[0])?.id);
  const ai = useAIState();
  const state = useStore((s) => s);
  const approved = p.sections.filter((s) => s.status === 'approved').length;
  const notStarted = p.sections.filter((s) => s.status === 'not_started');
  const limit = pageLimitNumber(p);
  const est = Math.round(estimatePages(p));
  const left = aiActionsLeft(state, p);
  const [bulk, setBulk] = useState(false);
  const generateAll = async () => {
    setBulk(true);
    for (const s of notStarted) { await runGenerate(p.id, s.id); }
    setBulk(false);
  };
  // Revisión sección a sección: se muestra una cada vez y, al aprobarla, se pasa a la siguiente pendiente.
  const [finished, setFinished] = useState(false);
  const idx = Math.max(0, p.sections.findIndex((s) => s.id === active));
  const cur = p.sections[idx];
  const allApproved = p.sections.length > 0 && approved === p.sections.length;
  const jump = (id: string) => { setActive(id); setFinished(false); document.getElementById('rev-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const afterApprove = () => {
    const next = p.sections.find((s, i) => i > idx && s.status !== 'approved') ?? p.sections.find((s) => s.id !== cur?.id && s.status !== 'approved');
    if (next) jump(next.id); else { setFinished(true); document.getElementById('rev-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };
  const segTone = (s: Section) => (s.status === 'approved' ? 'ok' : s.status === 'rejected' ? 'bad' : s.status === 'not_started' ? '' : 'draft');
  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="row-wrap" style={{ justifyContent: 'space-between', gap: 16 }}>
          <div style={{ minWidth: 220, flex: 1 }}>
            <div className="eyebrow">Paso 2 · Propuesta</div>
            <h2 className="mt-8" style={{ fontSize: 22 }}>{allApproved ? 'Propuesta aprobada' : 'Lee cada sección y apruébala'}</h2>
            <p className="muted mt-4">{allApproved ? 'Todas las secciones tienen tu visto bueno.' : 'PROPO redacta; tú decides. Nada se da por bueno hasta que lo apruebas.'} <span className="subtle">{limit ? `Estimadas ${est} de ${limit} páginas.` : `Estimadas ${est} páginas.`}</span></p>
            <div className="rev-segs mt-16" role="list" aria-label={`${approved} de ${p.sections.length} secciones aprobadas`}>
              {p.sections.map((s, i) => <button key={s.id} role="listitem" className={`rev-seg ${segTone(s)} ${s.id === cur?.id && !finished ? 'on' : ''}`} title={`${i + 1}. ${s.title} — ${SECTION_LABEL[s.status]}`} onClick={() => jump(s.id)} aria-label={`Sección ${i + 1}: ${s.title}`} />)}
            </div>
            <div className="small mt-8"><strong className="num">{approved} de {p.sections.length}</strong> <span className="muted">secciones aprobadas</span></div>
          </div>
          <div className="row-wrap">
            {notStarted.length > 0 && <button className="btn btn-primary" disabled={bulk} onClick={generateAll}><LuSparkles /> {bulk ? 'Redactando…' : `Redactar ${notStarted.length} sección${notStarted.length > 1 ? 'es pendientes' : ' pendiente'}`}</button>}
          </div>
        </div>
        {ai !== 'available' && <div className="callout neutral small mt-16"><LuInfo /><div>{getState().demo ? <>Estás en la demo: las secciones se redactan con la memoria de la empresa de ejemplo para que veas el resultado. Con la IA activada, PROPO las escribe a medida de cada pliego.</> : <>La redacción con IA no está disponible en esta vista. Al generar una sección se crea un <strong>borrador de plantilla</strong>: PROPO ordena los requisitos y las fuentes de empresa y marca lo que tu equipo tiene que escribir.</>}</div></div>}
        {!p.isSample && Number.isFinite(left) && left < 20 && <div className="callout warn small mt-8"><LuTriangleAlert /><div>Te quedan {left} acciones de IA para esta propuesta en tu plan.</div></div>}
      </div>
      <div className="prop-layout" id="rev-top">
        <nav className="outline" aria-label="Secciones">
          {p.sections.map((s, i) => (
            <button key={s.id} className={active === s.id && !finished ? 'on' : ''} onClick={() => jump(s.id)}>
              {s.status === 'approved' ? <span className="rev-check"><LuCheck /></span> : <span className="n">{String(i + 1).padStart(2, '0')}</span>}
              <span className="grow truncate">{s.title}</span>
              {s.status !== 'approved' && <span className={`dot ${s.status === 'reviewed' ? 'warn' : s.status === 'ai_generated' || s.status === 'generating' || s.status === 'draft' ? 'accent' : s.status === 'rejected' ? 'bad' : ''}`} />}
            </button>
          ))}
        </nav>
        <div style={{ minWidth: 0 }}>
          {finished && allApproved ? (
            <div className="sec-card rev-done">
              <span className="rev-done-ic"><LuCheck /></span>
              <h3>Propuesta aprobada</h3>
              <p className="muted">Has dado el visto bueno a las {p.sections.length} secciones. Queda la comprobación final antes de descargar el paquete.</p>
              <div className="row-wrap" style={{ justifyContent: 'center' }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate(`/app/projects/${p.id}/compliance`)}>Ir a la comprobación final <LuChevronRight /></button>
                <button className="btn btn-ghost" onClick={() => jump(p.sections[0].id)}>Repasar las secciones</button>
              </div>
            </div>
          ) : cur ? (
            <SectionCard key={cur.id} p={p} s={cur} n={idx + 1} total={p.sections.length} onApproved={afterApprove}
              onPrev={idx > 0 ? () => jump(p.sections[idx - 1].id) : undefined} onNext={idx < p.sections.length - 1 ? () => jump(p.sections[idx + 1].id) : undefined} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ p, s, n, total, onApproved, onPrev, onNext }: { p: Project; s: Section; n: number; total: number; onApproved: () => void; onPrev?: () => void; onNext?: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(s.content);
  const [showSources, setShowSources] = useState(false);
  const [fix, setFix] = useState<{ tag: string; label: string } | null>(null);
  const openFix = (tag: string, label: string) => setFix({ tag, label });
  const tagFor = (label: string) => {
    const tags = s.content.match(/\[(?:Información requerida|Information required):[^\]]*\]/g) ?? [];
    const exact = tags.find((t) => t.includes(label));
    if (exact) return exact;
    const kind = planFor(label).kind;
    return tags.find((t) => planFor(t.slice(t.indexOf(':') + 1, -1)).kind === kind) ?? tags[0] ?? `[Información requerida: ${label}]`;
  };
  const crits = p.criteria.filter((c) => s.criteria.includes(c.id));
  const citeKinds = Object.fromEntries(s.citations.map((c) => [c.marker, c.kind]));
  const onCite = (m: string) => {
    const c = s.citations.find((x) => x.marker === m);
    if (!c) return;
    openSource({ project: p, docId: c.docId, page: c.page, quote: c.quote, label: c.label, kind: c.kind });
  };
  const generating = s.status === 'generating';
  const saveTemplate = () => {
    update((st) => { st.templates.unshift({ id: uid('tp'), name: `${s.title} — ${p.name}`, kind: 'section', body: s.content.replace(/\s?\[S\d+\]/g, ''), usedCount: 0, updatedAt: nowIso(), source: 'approved' }); });
    toast('Guardada en tus plantillas. PROPO la reutilizará en próximas propuestas.', 'ok');
  };
  return (
    <section id={`sec-${s.id}`} className="sec-card">
      <div className="sec-head">
        <div className="grow" style={{ minWidth: 200 }}>
          <div className="eyebrow">Sección {n}{s.pageBudget ? ` · ~${s.pageBudget} págs.` : ''}</div>
          <h3 className="mt-4">{s.title}</h3>
          <p className="xs muted mt-4">{s.guidance}{s.updatedAt && s.content && !generating ? ` · Actualizada ${timeAgo(s.updatedAt)}${s.generatedBy === 'ai' ? ' por la IA' : s.generatedBy === 'template' ? ' (plantilla)' : ''}` : ''}</p>
          {crits.length > 0 && <div className="row-wrap mt-8">{crits.map((c) => <span key={c.id} className="badge outline" style={{ height: 20, fontSize: 11 }}>{c.name} · {c.points} pts</span>)}</div>}
        </div>
        <div className="row-wrap">
          <span className={`badge ${SECTION_TONE[s.status]}`}>{SECTION_LABEL[s.status]}</span>
          {s.confidence != null && !generating && <span className="badge outline mono" title="Hasta qué punto las fuentes respaldan esta sección">Confianza IA {Math.round(s.confidence * 100)}%</span>}
        </div>
      </div>
      {generating ? (
        <div className="gen-placeholder">
          <div className="row small muted"><span className="dot accent pulse" />PROPO está redactando esta sección con el pliego y los datos de tu empresa…</div>
          <div className="shimmer" style={{ width: '92%' }} /><div className="shimmer" style={{ width: '86%' }} /><div className="shimmer" style={{ width: '70%' }} />
          <div><button className="btn btn-ghost btn-sm" onClick={() => stopGenerate(p.id, s.id)}><LuCircleStop /> Detener</button></div>
        </div>
      ) : editing ? (
        <div style={{ padding: 16 }}>
          <textarea className="editor" aria-label={`Editar ${s.title}`} value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="row mt-8"><span className="xs subtle grow">{wordCount(draft)} palabras · conserva las marcas tipo [S1] para mantener las fuentes · escribe [Información requerida: …] donde falte algo</span><button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setDraft(s.content); }}>Cancelar</button><button className="btn btn-primary btn-sm" onClick={() => { saveSectionContent(p.id, s.id, draft); setEditing(false); toast('Sección guardada y marcada como revisada', 'ok'); }}>Guardar</button></div>
        </div>
      ) : s.status === 'not_started' || !s.content ? (
        <div className="empty" style={{ padding: 32 }}>
          <p>Todavía sin redactar.</p>
          <div className="row"><button className="btn btn-primary btn-sm" onClick={() => runGenerate(p.id, s.id)}><LuSparkles /> Generar borrador</button><button className="btn btn-secondary btn-sm" onClick={() => { setDraft(''); setEditing(true); }}><LuPencil /> Escribirla yo</button></div>
        </div>
      ) : (
        <div className="sec-body">
          {s.generatedBy === 'template' && <div className="callout neutral small" style={{ marginBottom: 14 }}><LuInfo /><div>Borrador de plantilla (sin IA). Sustituye las partes resaltadas por tu contenido.</div></div>}
          <RichText text={s.content} onCite={onCite} citeKinds={citeKinds} onInfo={openFix} />
          {s.missing.length > 0 && (
            <div className="callout warn small mt-16"><LuTriangleAlert /><div className="grow"><strong>Falta {s.missing.length === 1 ? 'un dato' : `${s.missing.length} datos`} para completar esta sección.</strong> PROPO no se lo inventa: pulsa cada uno y añádelo aquí mismo.
              <div className="missing-list">{s.missing.map((m) => <button key={m} onClick={() => openFix(tagFor(m), m)}><LuPencil />{m}</button>)}</div></div></div>
          )}
          {showSources && (
            <div className="stack mt-16" style={{ gap: 6 }}>
              {s.citations.length === 0 ? <span className="small muted">Esta sección no cita fuentes.</span> : s.citations.map((c) => (
                <div key={c.marker} className="row" style={{ alignItems: 'flex-start' }}>
                  <button className={`cite ${c.kind === 'company' ? 'company' : ''}`} onClick={() => onCite(c.marker)}>{c.marker}</button>
                  <SourceChip label={c.label} company={c.kind === 'company'} onClick={() => onCite(c.marker)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!editing && (
        <div className="rev-bar">
          <div className="row rev-nav">
            <button className="btn btn-ghost btn-sm btn-icon" disabled={!onPrev} onClick={onPrev} aria-label="Sección anterior"><LuChevronLeft /></button>
            <span className="small muted num">{n} de {total}</span>
            <button className="btn btn-ghost btn-sm btn-icon" disabled={!onNext} onClick={onNext} aria-label="Sección siguiente"><LuChevronRight /></button>
          </div>
          <span className="spacer" />
          {!generating && s.content && (
            <>
              <button className="btn btn-ghost btn-sm hide-sm" onClick={() => setShowSources(!showSources)}><LuFileText /> {showSources ? 'Ocultar fuentes' : `Fuentes (${s.citations.length})`}</button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setDraft(s.content); setEditing(true); }}><LuPencil /> Editar</button>
              <button className="btn btn-secondary btn-sm" onClick={() => runGenerate(p.id, s.id, true)}><LuRefreshCw /> Regenerar</button>
              {s.status === 'approved' ? (
                <>
                  <button className="btn btn-ghost btn-sm hide-sm" onClick={saveTemplate}><LuBookmarkPlus /> Guardar como plantilla</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSectionStatus(p.id, s.id, 'reviewed')}><LuRotateCcw /> Reabrir</button>
                  <span className="rev-ok"><LuCheck /> Aprobada</span>
                  {onNext && <button className="btn btn-primary" onClick={onNext}>Siguiente <LuChevronRight /></button>}
                </>
              ) : (
                <>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setSectionStatus(p.id, s.id, 'rejected'); toast('Sección rechazada. Regénerala o escríbela tú.'); }}><LuX /> Rechazar</button>
                  <button className="btn btn-approve" onClick={() => { setSectionStatus(p.id, s.id, 'approved'); if (s.missing.length) toast('Aprobada con información todavía pendiente', 'warn'); onApproved(); }}><LuCheck /> Aprobar y continuar</button>
                </>
              )}
            </>
          )}
        </div>
      )}
      {fix && <InfoFixModal p={p} s={s} tag={fix.tag} label={fix.label} onClose={() => setFix(null)} />}
    </section>
  );
}

