import React, { useState } from 'react';
import { LuPencil, LuRefreshCw, LuCheck, LuX, LuFileText, LuChevronRight, LuCircleStop, LuSparkles, LuBookmarkPlus, LuRotateCcw, LuTriangleAlert, LuInfo } from 'react-icons/lu';
import type { Project, Section } from '../../lib/types';
import { runGenerate, stopGenerate, setSectionStatus, saveSectionContent, aiActionsLeft } from '../../lib/actions';
import { RichText, SECTION_LABEL, SECTION_TONE, SourceChip, Bar } from '../../components/ui';
import { openSource, useAIState } from '../common';
import { update, toast, useStore, getState } from '../../lib/store';
import { estimatePages, pageLimitNumber } from '../../lib/derive';
import { uid, nowIso, wordCount, timeAgo } from '../../lib/util';
import { InfoFixModal } from './InfoFix';
import { planFor } from '../../lib/infoFix';

const FLOW: Section['status'][] = ['draft', 'ai_generated', 'reviewed', 'approved'];

export function Proposal({ p }: { p: Project }) {
  const [active, setActive] = useState(p.sections[0]?.id);
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
  const jump = (id: string) => { setActive(id); document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="row-wrap" style={{ justifyContent: 'space-between', gap: 16 }}>
          <div style={{ minWidth: 220, flex: 1 }}>
            <div className="row"><h3 style={{ fontSize: 17 }}>Propuesta</h3><span className="small subtle">{approved} de {p.sections.length} aprobadas</span></div>
            <div className="mt-8" style={{ maxWidth: 420 }}><Bar value={p.sections.length ? (approved / p.sections.length) * 100 : 0} tone="ok" /></div>
            <p className="xs subtle mt-8">Estructura adaptada a este pliego{p.criteria.length ? ' y a sus criterios de adjudicación' : ''}. {limit ? `Estimadas ${est} de ${limit} páginas.` : `Estimadas ${est} páginas.`}</p>
          </div>
          <div className="row-wrap">
            {notStarted.length > 0 && <button className="btn btn-primary" disabled={bulk} onClick={generateAll}><LuSparkles /> {bulk ? 'Redactando…' : `Redactar ${notStarted.length} sección${notStarted.length > 1 ? 'es pendientes' : ' pendiente'}`}</button>}
          </div>
        </div>
        {ai !== 'available' && <div className="callout neutral small mt-16"><LuInfo /><div>{getState().demo ? <>Estás en la demo: las secciones se redactan con la memoria de la empresa de ejemplo para que veas el resultado. Con la IA activada, PROPO las escribe a medida de cada pliego.</> : <>La redacción con IA no está disponible en esta vista. Al generar una sección se crea un <strong>borrador de plantilla</strong>: PROPO ordena los requisitos y las fuentes de empresa y marca lo que tu equipo tiene que escribir.</>}</div></div>}
        {!p.isSample && Number.isFinite(left) && left < 20 && <div className="callout warn small mt-8"><LuTriangleAlert /><div>Te quedan {left} acciones de IA para esta propuesta en tu plan.</div></div>}
      </div>
      <div className="prop-layout">
        <nav className="outline" aria-label="Secciones">
          {p.sections.map((s, i) => (
            <button key={s.id} className={active === s.id ? 'on' : ''} onClick={() => jump(s.id)}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <span className="grow truncate">{s.title}</span>
              <span className={`dot ${s.status === 'approved' ? 'ok' : s.status === 'reviewed' ? 'warn' : s.status === 'ai_generated' || s.status === 'generating' ? 'accent' : s.status === 'rejected' ? 'bad' : ''}`} />
            </button>
          ))}
        </nav>
        <div style={{ minWidth: 0 }}>
          {p.sections.map((s, i) => <SectionCard key={s.id} p={p} s={s} n={i + 1} />)}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ p, s, n }: { p: Project; s: Section; n: number }) {
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
      {!generating && !editing && s.content && (
        <div className="sec-foot">
          <div className="status-flow hide-sm" aria-label="Estado de revisión">
            {FLOW.map((f, i) => <React.Fragment key={f}>{i > 0 && <LuChevronRight />}<i className={s.status === f ? 'on' : ''}>{SECTION_LABEL[f]}</i></React.Fragment>)}
          </div>
          <span className="spacer" />
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSources(!showSources)}><LuFileText /> {showSources ? 'Ocultar fuentes' : `Ver fuentes (${s.citations.length})`}</button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setDraft(s.content); setEditing(true); }}><LuPencil /> Editar</button>
          <button className="btn btn-secondary btn-sm" onClick={() => runGenerate(p.id, s.id, true)}><LuRefreshCw /> Regenerar</button>
          {s.status === 'approved' ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={saveTemplate}><LuBookmarkPlus /> Guardar como plantilla</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSectionStatus(p.id, s.id, 'reviewed')}><LuRotateCcw /> Reabrir</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => { setSectionStatus(p.id, s.id, 'rejected'); toast('Sección rechazada. Regénerala o escríbela tú.'); }}><LuX /> Rechazar</button>
              <button className="btn btn-primary btn-sm" onClick={() => { setSectionStatus(p.id, s.id, 'approved'); toast(s.missing.length ? 'Aprobada con información todavía pendiente' : 'Sección aprobada', s.missing.length ? 'warn' : 'ok'); }}><LuCheck /> Aprobar</button>
            </>
          )}
        </div>
      )}
      {fix && <InfoFixModal p={p} s={s} tag={fix.tag} label={fix.label} onClose={() => setFix(null)} />}
    </section>
  );
}

