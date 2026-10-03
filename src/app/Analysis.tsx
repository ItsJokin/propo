import React, { useEffect, useRef, useState } from 'react';
import { LuCircleCheck, LuLoaderCircle, LuCircle, LuTriangleAlert, LuArrowRight, LuFileX, LuCpu, LuCircleStop, LuInfo, LuClock } from 'react-icons/lu';
import { useStore, navigate, update, getState } from '../lib/store';
import { pendingQuestions } from '../lib/interview';
import { runAnalysis, runGenerate, hasPendingFiles, deleteProject, STAGES, type AnalysisProgress } from '../lib/actions';
import { Empty } from '../components/ui';
import { fmtDate } from '../lib/util';
import { useAIState } from './common';

export function AnalysisScreen({ id }: { id: string }) {
  const project = useStore((s) => s.projects.find((p) => p.id === id));
  const ai = useAIState();
  const [prog, setProg] = useState<AnalysisProgress>({ stage: 'read', detail: {} });
  const started = useRef(false);
  const demo = useStore((s) => !!s.demo);
  const [writing, setWriting] = useState<string | null>(null);
  /** Redacta todas las secciones pendientes, una a una, y abre la propuesta. */
  const generateAll = async () => {
    const todo = getState().projects.find((p) => p.id === id)?.sections.filter((s) => s.status === 'not_started') ?? [];
    for (const s of todo) { setWriting(s.title); await runGenerate(id, s.id, false, true); }
    setWriting(null);
    navigate(`/app/projects/${id}/proposal`);
  };
  const ctl = useRef<AbortController | null>(null);
  const start = (forceRules = false) => {
    started.current = true;
    ctl.current = new AbortController();
    setProg({ stage: 'read', detail: {} });
    runAnalysis(id, setProg, ctl.current.signal, forceRules);
  };
  useEffect(() => {
    if (!project || started.current) return;
    if (project.stage === 'analyzing' && hasPendingFiles(id)) start();
  }, [project?.id]);

  if (!project) return <Empty icon={<LuFileX />} title="Proyecto no encontrado" body="Puede que se haya eliminado." action={<button className="btn btn-primary" onClick={() => navigate('/app/projects')}>Volver a mis proyectos</button>} />;

  const restart = () => {
    deleteProject(id);
    update((s) => { s.usage.proposalsCreated = Math.max(0, s.usage.proposalsCreated - 1); });
    navigate('/app/projects?new=1');
  };

  if (project.stage === 'analyzing' && !hasPendingFiles(id) && !started.current) {
    return (
      <div className="analysis">
        <Empty icon={<LuTriangleAlert />} title="El análisis se ha interrumpido" body="La página se cerró o se recargó antes de que PROPO terminara de leer los documentos. No se ha perdido nada de tu espacio; vuelve a subir los documentos para empezar de nuevo. No gasta otra propuesta." action={<button className="btn btn-primary" onClick={restart}>Volver a subir los documentos</button>} />
      </div>
    );
  }
  if (prog.stage === 'error' || project.stage === 'failed') {
    const unreadable = prog.error === 'unreadable' || project.docs.length > 0 && project.docs.every((d) => d.status === 'unreadable' || d.status === 'unsupported');
    if (prog.error === 'cancelled') {
      return (
        <div className="analysis">
          <Empty icon={<LuCircleStop />} title="Análisis detenido" body="Has detenido el análisis con IA. Puedes continuar con la extracción básica por reglas, que lee los documentos sin IA." action={<div className="row"><button className="btn btn-primary" onClick={() => { started.current = false; start(true); }}>Continuar con extracción básica</button><button className="btn btn-ghost" onClick={restart}>Empezar de nuevo</button></div>} />
        </div>
      );
    }
    return (
      <div className="analysis">
        <Empty icon={unreadable ? <LuFileX /> : <LuTriangleAlert />}
          title={unreadable ? 'PROPO no ha podido leer estos documentos' : 'No se ha podido completar el análisis'}
          body={unreadable ? 'Ningún archivo contiene texto legible. Pueden ser imágenes escaneadas, estar protegidos con contraseña o dañados.' : 'Algo ha fallado al procesar los documentos. Tus archivos no se han modificado. Inténtalo de nuevo; si sigue fallando, sube los documentos por separado para encontrar el que da problemas.'}
          action={<button className="btn btn-primary" onClick={restart}>Volver a subir los documentos</button>} />
        {project.docs.length > 0 && (
          <div className="card mt-16">
            {project.docs.map((d) => <div key={d.id} className="file-row"><LuFileX className="state-ico bad" /><div className="grow"><div className="truncate">{d.name}</div><div className="xs muted">{d.note}</div></div></div>)}
          </div>
        )}
      </div>
    );
  }

  const done = project.stage === 'active' || prog.stage === 'done';
  const order = STAGES.map((s) => s.id);
  const idx = done ? order.length : order.indexOf(prog.stage as any);
  const a = project.analysis;
  return (
    <div className={`analysis ${done ? '' : 'has-side'}`}>
      <div className="an-main">
      <div className="eyebrow">{project.name}</div>
      <h1 className="mt-12" style={{ fontSize: 30, letterSpacing: '-.03em' }}>{done ? 'Análisis completado' : 'PROPO está leyendo tu licitación'}</h1>
      <p className="muted mt-8">{done ? 'Cada requisito enlaza a la página de la que sale. Ahora PROPO te hará unas pocas preguntas sobre lo que no ha encontrado, como en un chat, y después redactará la propuesta.' : 'Tarda entre unos segundos y unos minutos, según el tamaño de los documentos.'}</p>
      {!done && (
        <div className="row small muted mt-16">
          <LuCpu style={{ width: 14, height: 14 }} />
          {ai === 'available' ? 'Análisis con IA: puede que se te pida permitir que esta página use Claude' : 'Extracción básica: la IA no está disponible en esta vista'}
          <span className="spacer" />
          {ai === 'available' && <button className="btn btn-ghost btn-sm" onClick={() => ctl.current?.abort()}><LuCircleStop /> Detener</button>}
        </div>
      )}
      <div className="mt-24">
        {STAGES.map((s, i) => {
          const st = i < idx ? 'done' : i === idx ? 'now' : 'todo';
          return (
            <div key={s.id} className={`an-step ${st}`}>
              <span className="ic">{st === 'done' ? <LuCircleCheck style={{ color: 'var(--ok)' }} /> : st === 'now' ? <LuLoaderCircle className="spin" style={{ color: 'var(--accent)' }} /> : <LuCircle style={{ color: 'var(--border-strong)' }} />}</span>
              <span>{s.label}{st === 'now' ? '…' : ''}</span>
              <span className="detail truncate" style={{ maxWidth: '50%' }}>{prog.detail[s.id] ?? ''}</span>
            </div>
          );
        })}
      </div>
      {done && a && (
        <div className="mt-32">
          <div className="an-results">
            <div><div className="small muted">Documentos analizados</div><div className="big-stat mt-8 num">{a.documentsAnalyzed}</div></div>
            <div><div className="small muted">Páginas</div><div className="big-stat mt-8 num">{a.pages}</div></div>
            <div><div className="small muted">Requisitos</div><div className="big-stat mt-8 num">{project.requirements.length}</div></div>
            <div><div className="small muted">Documentos obligatorios</div><div className="big-stat mt-8 num">{a.requiredDocuments}</div></div>
            <div><div className="small muted">Criterios de adjudicación</div><div className="big-stat mt-8 num">{project.criteria.length}</div></div>
            <div><div className="small muted">Fecha límite</div><div className="mt-8" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18 }}>{a.deadline ? fmtDate(a.deadline) : 'No encontrada'}</div></div>
          </div>
          {a.warnings.length > 0 && (
            <div className="stack mt-16" style={{ gap: 8 }}>
              {a.warnings.map((w) => <div key={w} className="callout warn small"><LuInfo /><div>{w}</div></div>)}
            </div>
          )}
          {!a.deadline && <div className="callout neutral small mt-8"><LuInfo /><div>No se ha encontrado la fecha límite de presentación. Añádela en el resumen del proyecto para que PROPO te avise.</div></div>}
          {demo && <div className="callout neutral small mt-16"><LuInfo /><div><strong>Estás en la demo.</strong> Pulsa «Generar la propuesta» y PROPO redactará todas las secciones con la memoria de la empresa de ejemplo, para que veas cómo continúa el trabajo.</div></div>}
          <div className="row-wrap mt-24">
            {project.sections.some((s) => s.status === 'not_started') && (
              <button className={`btn ${demo ? 'btn-primary' : 'btn-secondary'} btn-lg`} onClick={generateAll} disabled={!!writing}>{writing ? <><LuLoaderCircle className="spin" /> Redactando «{writing.length > 34 ? writing.slice(0, 32) + '…' : writing}»</> : <>Generar la propuesta <LuArrowRight /></>}</button>
            )}
            <button className={`btn ${demo ? 'btn-secondary' : 'btn-primary'} btn-lg`} onClick={() => navigate(`/app/projects/${id}/assistant`)}>{pendingQuestions(project).length ? `Responder a PROPO (${pendingQuestions(project).length} preguntas)` : 'Continuar con PROPO'} <LuArrowRight /></button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate(`/app/projects/${id}/requirements`)}>Revisar requisitos</button>
          </div>
        </div>
      )}
      </div>
      {!done && <TimeCard ai={ai === 'available'} pages={prog.pages} />}
    </div>
  );
}

// Velocidades orientativas con PDF digitales de pliegos reales (no escaneados). Lectura y extracción por reglas
// medidas en el navegador (~2.000 págs/min juntas en un portátil reciente; se deja margen para equipos más lentos).
// La IA lee como mucho las ~100 páginas más relevantes (ver pickPages en ai/engine.ts).
const SPEED = { read: 1000, ai: 50, rules: 3000, aiMaxPages: 100 };

const fmtN = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

function TimeCard({ ai, pages }: { ai: boolean; pages?: number }) {
  const [t0] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const h = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(h); }, []);
  const secs = Math.floor((now - t0) / 1000);
  const elapsed = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const est = pages ? pages / SPEED.read + (ai ? Math.min(pages, SPEED.aiMaxPages) / SPEED.ai : pages / SPEED.rules) : null; // minutos
  const estLabel = est == null ? null : est < 0.75 ? 'menos de 1 minuto' : est < 1.5 ? 'alrededor de 1 minuto' : `unos ${Math.round(est)} minutos`;
  const rows: [string, string, boolean][] = [
    ['Leer el texto de los PDF', `~${fmtN(SPEED.read)} págs/min`, true],
    ['Análisis con IA', '~40–60 págs/min', ai],
    ['Extracción básica (sin IA)', `~${fmtN(SPEED.rules)} págs/min`, !ai],
  ];
  return (
    <aside className="an-side card" aria-label="Tiempo estimado">
      <div className="row" style={{ gap: 8 }}><LuClock style={{ width: 16, height: 16, color: 'var(--accent)' }} /><strong>Puede tardar unos minutos</strong></div>
      <p className="small muted mt-8">Leer los pliegos y extraer cada requisito con su página lleva tiempo, sobre todo si son largos. Puedes cambiar de pestaña, pero no cierres ni recargues esta página mientras PROPO lee.</p>
      <div className="an-speed mt-16">
        {rows.map(([l, v, on]) => <div key={l} className={on ? 'on' : ''}><span>{l}</span><span className="mono">{v}</span></div>)}
      </div>
      <div className="divider mt-16" />
      <div className="small mt-16">
        {pages ? <>Tu licitación: <strong>{pages} páginas</strong>{estLabel && <> · {estLabel}</>}</> : 'Calculando el número de páginas…'}
      </div>
      <div className="xs subtle mt-4">Tiempo transcurrido: <span className="mono">{elapsed}</span></div>
      <p className="xs subtle mt-12">Velocidades aproximadas para PDF con texto; dependen de tu ordenador. La IA lee como máximo las ~{SPEED.aiMaxPages} páginas más relevantes y su ritmo varía según la carga del servicio. Los PDF escaneados (imágenes) no se pueden leer en esta versión.</p>
    </aside>
  );
}

