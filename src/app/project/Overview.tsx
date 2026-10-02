import React from 'react';
import { LuCheck, LuArrowRight, LuTriangleAlert, LuInfo } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { navigate } from '../../lib/store';
import { reqCounts, sectionCounts, complianceChecks, readiness } from '../../lib/derive';
import { fmtDate, timeAgo, daysUntil, isUnknown } from '../../lib/util';
import { Ring, SourceChip } from '../../components/ui';
import { openSource } from '../common';

export function Overview({ p }: { p: Project }) {
  const a = p.analysis!;
  const rc = reqCounts(p);
  const sc = sectionCounts(p);
  const checks = complianceChecks(p);
  const fails = checks.filter((c) => c.state === 'fail').length;
  const drafted = p.sections.filter((s) => s.status !== 'not_started' && s.status !== 'generating').length;
  const r = readiness(p);
  const steps: [string, 'done' | 'now' | 'todo'][] = [
    ['Documentos analizados', 'done'],
    ['Requisitos extraídos', 'done'],
    ['Datos de empresa cruzados', rc.needs_info + rc.missing === 0 ? 'done' : 'now'],
    ['Estructura de la propuesta creada', p.sections.length ? 'done' : 'todo'],
    ['Redactando las secciones técnicas', drafted === p.sections.length ? 'done' : drafted > 0 ? 'now' : 'todo'],
    ['Revisión de cumplimiento', fails === 0 && drafted === p.sections.length ? 'done' : drafted > 0 ? 'now' : 'todo'],
    ['Paquete final', p.markedReady ? 'done' : 'todo'],
  ];
  const nextActions: { label: string; detail: string; to: string; tone: string }[] = [];
  if (rc.missing) nextActions.push({ label: `Falta${rc.missing > 1 ? 'n' : ''} ${rc.missing} requisito${rc.missing > 1 ? 's' : ''}`, detail: 'Sube los documentos o pruebas que PROPO no ha encontrado', to: 'requirements', tone: 'bad' });
  if (rc.needs_info) nextActions.push({ label: `${rc.needs_info} necesita${rc.needs_info === 1 ? '' : 'n'} información`, detail: 'Responde a las preguntas de PROPO en el chat', to: 'assistant', tone: 'warn' });
  const toReview = p.sections.filter((s) => s.status === 'ai_generated' || s.status === 'draft').length;
  if (toReview) nextActions.push({ label: `${toReview} sección${toReview > 1 ? 'es' : ''} por revisar`, detail: 'Lee, edita y aprueba los borradores de la IA', to: 'proposal', tone: 'accent' });
  const notStarted = p.sections.filter((s) => s.status === 'not_started').length;
  if (notStarted) nextActions.push({ label: `${notStarted} sección${notStarted > 1 ? 'es' : ''} sin redactar`, detail: 'Genera un primer borrador', to: 'proposal', tone: '' });
  if (fails) nextActions.push({ label: `${fails} incidencia${fails > 1 ? 's' : ''} de cumplimiento`, detail: 'Resuélvelas antes de marcar como lista', to: 'compliance', tone: 'bad' });
  if (!nextActions.length && !p.markedReady) nextActions.push({ label: 'Marca la propuesta como lista', detail: 'Último paso: una persona revisa el cumplimiento y la marca como lista', to: 'compliance', tone: 'ok' });
  else if (!nextActions.length) nextActions.push({ label: 'Descarga el paquete de presentación', detail: 'Fírmalo y preséntalo en la plataforma de contratación', to: 'package', tone: 'ok' });
  const d = daysUntil(a.deadline);
  return (
    <div className="stack gap-20">
      <div className="stats-strip">
        <div><div className="l">Documentos analizados</div><div className="big-stat num">{a.documentsAnalyzed}</div></div>
        <div><div className="l">Páginas</div><div className="big-stat num">{a.pages}</div></div>
        <div><div className="l">Requisitos</div><div className="big-stat num">{rc.total}</div></div>
        <div><div className="l">Documentos obligatorios</div><div className="big-stat num">{a.requiredDocuments}</div></div>
        <div><div className="l">Criterios de adjudicación</div><div className="big-stat num">{p.criteria.length}</div></div>
        <div><div className="l">Fecha límite</div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, lineHeight: 1.2 }}>{a.deadline ? fmtDate(a.deadline, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</div>{d != null && d >= 0 && <div className="xs subtle mt-4">Quedan {d} días</div>}</div>
      </div>
      <div className="ov-grid">
        <div className="stack gap-20">
          <div className="card">
            <div className="card-head"><h3>Resumen</h3><span className="spacer" /><span className="badge outline">{a.mode === 'ai' ? 'Análisis con IA' : a.mode === 'rules' ? 'Extracción básica' : 'Ejemplo'}</span></div>
            <div className="card-body stack">
              <p style={{ fontSize: 14.5, lineHeight: 1.65, maxWidth: '75ch' }}>{a.summary}</p>
              {a.warnings.map((w) => <div key={w} className="callout warn small"><LuInfo /><div>{w}</div></div>)}
              <dl className="fact-list mt-8">
                <dt>Órgano de contratación</dt><dd>{a.authority}</dd>
                {!isUnknown(a.reference) && <><dt>Expediente</dt><dd>{a.reference}</dd></>}
                {a.cpv && <><dt>CPV</dt><dd className="mono">{a.cpv}</dd></>}
                {a.budget && <><dt>Presupuesto</dt><dd>{a.budget}</dd></>}
                {a.duration && <><dt>Duración</dt><dd>{a.duration}</dd></>}
                {a.pageLimit && <><dt>Formato</dt><dd>{a.pageLimit}</dd></>}
              </dl>
            </div>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card-head"><h3>Fechas clave</h3></div>
              {a.deadlines.length === 0 ? <div className="small muted" style={{ padding: 20 }}>No se han encontrado fechas en los documentos.</div> : a.deadlines.map((dl) => (
                <div key={dl.label + dl.date} className="list-item">
                  <div className="grow"><div style={{ fontWeight: 500 }}>{dl.label}</div><div className="small muted">{fmtDate(dl.date)}</div></div>
                  {dl.source && <SourceChip label={`p. ${dl.source.page}`} onClick={() => openSource({ project: p, docId: dl.source!.docId, page: dl.source!.page })} />}
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-head"><h3>Riesgos de exclusión</h3><span className="spacer" /><LuTriangleAlert style={{ width: 15, height: 15, color: 'var(--warn)' }} /></div>
              {a.exclusionRisks.length === 0 ? <div className="small muted" style={{ padding: 20 }}>No se han encontrado causas de exclusión explícitas. Revisa el pliego administrativo.</div> : a.exclusionRisks.slice(0, 6).map((e) => (
                <div key={e.text} className="list-item">
                  <div className="grow small">{e.text}</div>
                  {e.source && <SourceChip label={`p. ${e.source.page}`} onClick={() => openSource({ project: p, docId: e.source!.docId, page: e.source!.page, quote: e.text })} />}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="stack gap-20">
          <div className="card card-pad">
            <div className="row gap-16">
              <Ring value={r} size={72} stroke={7} tone={r >= 90 ? 'ok' : 'accent'} />
              <div><div className="eyebrow">Preparación</div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginTop: 4 }}>{p.markedReady ? 'Lista para presentar' : r >= 100 ? 'Todo preparado' : r >= 90 ? 'Casi lista' : 'En preparación'}</div><div className="xs muted">{rc.fulfilled}/{rc.total} requisitos · {sc.approved}/{sc.total} secciones aprobadas</div></div>
            </div>
            <div className="divider mt-20" />
            <div className="eyebrow mt-20">PROPO está preparando tu propuesta</div>
            <div className="pipeline mt-12">
              {steps.map(([l, st]) => <div key={l} className={`pipe-step ${st}`}><span className="ic">{st === 'done' ? <LuCheck /> : st === 'now' ? <span className="dot accent pulse" style={{ width: 7, height: 7 }} /> : null}</span>{l}</div>)}
            </div>
          </div>
          {nextActions.length > 0 && (
            <div className="card">
              <div className="card-head"><h3>Siguientes pasos</h3></div>
              {nextActions.map((n) => (
                <button key={n.label} className="list-item" style={{ width: '100%', border: 0, borderBottom: '1px solid var(--border)', background: 'none', textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${p.id}/${n.to}`)}>
                  <span className={`dot ${n.tone}`} style={{ marginTop: 7 }} />
                  <span className="grow"><span style={{ display: 'block', fontWeight: 500 }}>{n.label}</span><span className="xs muted">{n.detail}</span></span>
                  <LuArrowRight style={{ width: 15, height: 15, color: 'var(--fg-3)', marginTop: 3 }} />
                </button>
              ))}
            </div>
          )}
          <div className="card">
            <div className="card-head"><h3>Actividad</h3></div>
            {p.activity.slice(0, 7).map((a2, i) => <div key={i} className="list-item small"><span className="grow">{a2.text}</span><span className="xs subtle" style={{ whiteSpace: 'nowrap' }}>{timeAgo(a2.at)}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
