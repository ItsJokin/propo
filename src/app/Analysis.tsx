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
    <div className={`analysis ${done ? '' : 'reading'}`}>
      <div className="an-main">
      <div className="eyebrow">{project.name}</div>
      <h1 className="mt-12" style={{ fontSize: 30, letterSpacing: '-.03em' }}>{done ? 'Análisis completado' : 'PROPO está leyendo tu licitación'}</h1>
      <p className="muted mt-8">{done ? 'PROPO ya sabe qué pide el pliego. Sigue un único camino: unas pocas preguntas, la propuesta redactada y tu revisión.' : 'No cierres ni recargues esta página mientras PROPO lee.'}</p>
      {!done && (
        <div className="row small muted mt-16">
          <LuCpu style={{ width: 14, height: 14 }} />
          {ai === 'available' ? 'Análisis con IA: PROPO está leyendo los pliegos' : 'Extracción básica: la IA no está disponible en esta vista'}
          <span className="spacer" />
          {ai === 'available' && <button className="btn btn-ghost btn-sm" onClick={() => ctl.current?.abort()}><LuCircleStop /> Detener</button>}
        </div>
      )}
      <div className={done ? 'mt-24' : 'an-cols mt-24'}>
        {!done && <ScanAnim />}
        <div>
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
        {!done && <TimeNote ai={ai === 'available'} pages={prog.pages} />}
        </div>
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
          {!demo && project.docs.length > 0 && project.docs.every((d) => d.name.startsWith('Ficha de la licitación')) && (
            <div className="callout warn mt-16"><LuInfo /><div><strong>Falta el pliego.</strong> PROPO ha creado el proyecto con los datos del anuncio oficial, pero todavía no ha leído los pliegos: los requisitos de abajo salen solo del anuncio. Descarga el PCAP y el PPT desde la ficha de la licitación y súbelos para extraer los requisitos de verdad.<div className="mt-8"><button className="btn btn-primary btn-sm" onClick={() => navigate(`/app/projects/${id}/documents`)}>Subir los pliegos</button></div></div></div>
          )}
          <div className="row-wrap mt-24">
            {pendingQuestions(project).length > 0
              ? <button className="btn btn-primary btn-lg" onClick={() => navigate(`/app/projects/${id}/assistant`)}>Continuar <LuArrowRight /></button>
              : project.sections.some((s) => s.status === 'not_started')
                ? <button className="btn btn-primary btn-lg" onClick={generateAll} disabled={!!writing}>{writing ? <><LuLoaderCircle className="spin" /> Redactando «{writing.length > 34 ? writing.slice(0, 32) + '…' : writing}»</> : <>Generar la propuesta <LuArrowRight /></>}</button>
                : <button className="btn btn-primary btn-lg" onClick={() => navigate(`/app/projects/${id}/proposal`)}>Revisar la propuesta <LuArrowRight /></button>}
          </div>
          <p className="small muted mt-12">{pendingQuestions(project).length > 0 ? `Antes de redactar, PROPO te hará ${pendingQuestions(project).length === 1 ? 'una pregunta' : `${pendingQuestions(project).length} preguntas`}: solo lo imprescindible.` : 'PROPO tiene lo que necesita para redactar.'} <button className="link" onClick={() => navigate(`/app/projects/${id}/requirements`)}>Ver los {project.requirements.length} requisitos encontrados</button></p>
        </div>
      )}
      </div>
    </div>
  );
}

// Velocidades orientativas con PDF digitales de pliegos reales (no escaneados). Lectura y extracción por reglas
// medidas en el navegador (~2.000 págs/min juntas en un portátil reciente; se deja margen para equipos más lentos).
// La IA lee como mucho las ~100 páginas más relevantes (ver pickPages en ai/engine.ts).
const SPEED = { read: 1000, ai: 50, rules: 3000, aiMaxPages: 100 };

const fmtN = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Una línea: cuántas páginas tiene la licitación y cuánto tardará, más o menos. */
function TimeNote({ ai, pages }: { ai: boolean; pages?: number }) {
  const est = pages ? pages / SPEED.read + (ai ? Math.min(pages, SPEED.aiMaxPages) / SPEED.ai : pages / SPEED.rules) : null; // minutos
  const estLabel = est == null ? null : est < 0.75 ? 'menos de 1 minuto' : est < 1.5 ? 'alrededor de 1 minuto' : `unos ${Math.round(est)} minutos`;
  return (
    <p className="an-time small muted">
      <LuClock />
      {pages ? <span>Tu licitación: <strong>{fmtN(pages)} páginas</strong> · {estLabel}. Es una velocidad aproximada.</span> : <span>Contando las páginas…</span>}
    </p>
  );
}

/** La hoja del pliego que se va leyendo: una línea azul la recorre, marca lo que encuentra y los requisitos van saliendo. */
function ScanAnim() {
  const lines = [100, 92, 0, 78, 96, 1, 64, 100, 2, 88, 70, 3, 94, 58];   // 0–3: líneas que PROPO «encuentra»
  const chips = ['Solvencia económica', 'Experiencia previa', 'Plazos y fechas', 'Criterios de adjudicación'];
  return (
    <div className="an-scan" aria-hidden="true">
      <div className="an-sheet">
        <i className="t" />
        {lines.map((w, k) => (w <= 3 ? <i key={k} className={`hit h${w}`} style={{ width: `${[100, 86, 94, 80][w]}%` }} /> : <i key={k} style={{ width: `${w}%` }} />))}
        <div className="an-bar" />
      </div>
      <div className="an-chips">
        {chips.map((c, k) => <span key={c} className={`an-chip c${k}`}><b />{c}</span>)}
      </div>
    </div>
  );
}

