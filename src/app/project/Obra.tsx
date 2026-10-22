// Proyecto de obra → «Plan de obra»: requisitos propios de una obra, plan de obra con diagrama de Gantt y camino
// crítico, y presupuesto ofertado (BC3 de Presto o Excel de mediciones) con la rebaja del paso del precio.
import React, { useEffect, useRef, useState } from 'react';
import { LuLoaderCircle, LuCircleCheck, LuTriangleAlert, LuCircleX, LuUpload, LuDownload, LuRefreshCw, LuInfo, LuSparkles } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { updateProject, useStore, getState, navigate, toast } from '../../lib/store';
import { emptyObra, readObraRules, obraChecks, planObra, cpm, bc3WithBaja, xlsxWithBaja, type Obra as ObraState, type Activity } from '../../lib/obra';
import { putFile, getFile } from '../../lib/storage';
import { offerDownload } from '../../lib/services/download';
import { ganttPdf } from '../../lib/pdf/docs';
import { nowIso } from '../../lib/util';

const pct = (x: number) => `${(x * 100).toFixed(1).replace('.', ',')} %`;

export function Obra({ p }: { p: Project }) {
  const company = useStore((s) => s.company);
  const team = useStore((s) => s.team);
  const o: ObraState = p.obra ?? emptyObra();
  const [reading, setReading] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [busyBudget, setBusyBudget] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const save = (fn: (x: ObraState) => void) => updateProject(p.id, (x) => { const cur = x.obra ?? emptyObra(); fn(cur); x.obra = cur; });

  useEffect(() => {
    if (o.rules || reading) return;
    let on = true; setReading(true);
    readObraRules(p).then((r) => { if (on) save((x) => { x.rules = r; }); }).finally(() => { if (on) setReading(false); });
    return () => { on = false; };
  }, [p.id]);

  const checks = obraChecks(p, company);
  const plan = async () => {
    setPlanning(true);
    try { const g = await planObra(getState().projects.find((x) => x.id === p.id) ?? p, company, team); save((x) => { x.gantt = g; }); toast('Plan de obra preparado', 'ok'); }
    catch { toast('No se ha podido preparar el plan de obra ahora mismo. Inténtalo de nuevo en unos minutos.', 'bad'); }
    finally { setPlanning(false); }
  };
  const setDur = (id: string, dur: number) => save((x) => {
    if (!x.gantt) return;
    const acts = x.gantt.activities.map((a) => (a.id === id ? { ...a, dur: Math.max(1, dur) } : a));
    const r = cpm(acts); x.gantt = { ...x.gantt, activities: r.activities, total: r.total };
  });
  const downloadGantt = async () => {
    const cur = getState().projects.find((x) => x.id === p.id) ?? p;
    const r = await offerDownload(`${p.name.replace(/[^\p{L}\p{N}\- ]+/gu, '').trim().slice(0, 60)} — plan de obra.pdf`, await ganttPdf(cur, getState()));
    if (r === 'unavailable') toast('Las descargas no están disponibles en esta vista.', 'warn');
  };
  const baja = p.pricing?.approved ? p.pricing.choice?.baja ?? null : p.pricing?.choice?.baja ?? null;
  const onBudget = async (f: File) => {
    if (baja == null) { toast('Primero fija el precio en el paso «Fija el precio»: la rebaja sale de ahí.', 'warn'); return; }
    const ext = f.name.toLowerCase().endsWith('.bc3') ? 'bc3' : f.name.toLowerCase().endsWith('.xlsx') ? 'xlsx' : null;
    if (!ext) { toast('Sube el presupuesto en formato BC3 (Presto) o Excel (.xlsx).', 'warn'); return; }
    setBusyBudget(true);
    try {
      const buf = await f.arrayBuffer();
      const r = ext === 'bc3' ? bc3WithBaja(buf, baja) : await xlsxWithBaja(buf, baja);
      if (!r.changed) { toast('No hemos encontrado precios que ajustar en ese archivo. Comprueba que es el presupuesto o la plantilla de mediciones.', 'warn'); return; }
      const key = `budget:${p.id}`;
      await putFile(key, r.data.buffer.slice(r.data.byteOffset, r.data.byteOffset + r.data.byteLength) as ArrayBuffer);
      const name = `${f.name.replace(/\.[^.]+$/, '')} (ofertado).${ext}`;
      save((x) => { x.budget = { key, name, ext, changed: r.changed, baja, at: nowIso(), source: f.name }; });
      toast(`Presupuesto ajustado: ${r.changed} precios con tu rebaja del ${pct(baja)}.`, 'ok');
    } catch { toast('No se ha podido leer el archivo.', 'bad'); }
    finally { setBusyBudget(false); if (fileRef.current) fileRef.current.value = ''; }
  };
  const downloadBudget = async () => {
    if (!o.budget) return; const b = await getFile(o.budget.key);
    if (!b) { toast('No encontramos el archivo: vuelve a subirlo.', 'warn'); return; }
    await offerDownload(o.budget.name, new Uint8Array(b));
  };

  const g = o.gantt;
  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="eyebrow">Licitación de obras</div>
        <h2 className="mt-8" style={{ fontSize: 22 }}>Lo que este pliego pide a una constructora</h2>
        <p className="muted mt-4">PROPO compara lo que exige el pliego con tu perfil de <a style={{ cursor: 'pointer' }} onClick={() => navigate('/app/company/obra')}>Empresa → Construcción</a>. Lo que falte aquí puede excluirte aunque tengas el mejor precio.</p>
        {reading && <div className="callout mt-12 small"><LuLoaderCircle className="spin" /><div>Leyendo clasificación, registros, plazos y capítulos del presupuesto…</div></div>}
        {!reading && o.rules && (checks.length ? (
          <div className="stack mt-12" style={{ gap: 8 }}>
            {checks.map((c) => (
              <div key={c.id} className={`callout small ${c.state === 'pass' ? '' : c.state === 'fail' ? 'bad' : 'warn'}`}>
                {c.state === 'pass' ? <LuCircleCheck /> : c.state === 'fail' ? <LuCircleX /> : <LuTriangleAlert />}
                <div className="grow"><strong>{c.label}.</strong> {c.detail}
                  {c.id === 'visita' && !p.manualChecks.visita && <div className="mt-4"><button className="link small" onClick={() => updateProject(p.id, (x) => { x.manualChecks.visita = true; })}>Ya he hecho la visita</button></div>}</div>
              </div>
            ))}
            {o.rules.avisos.map((a, i) => <div key={i} className="callout warn small"><LuTriangleAlert /><div>{a}</div></div>)}
          </div>
        ) : <p className="small muted mt-12">Este pliego no pide clasificación, registros especiales, visita ni plan de obra.</p>)}
        {!reading && o.rules?.mode === 'rules' && <div className="callout neutral small mt-12"><LuInfo /><div>No hemos podido leer estos datos con la IA. <button className="link small" onClick={() => { save((x) => { x.rules = null; }); location.reload(); }}>Volver a intentarlo</button></div></div>}
      </div>

      <div className="card card-pad">
        <div className="row" style={{ justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div><h3 style={{ fontSize: 18 }}>Plan de obra y diagrama de Gantt</h3>
            <p className="muted mt-4">PROPO ordena las actividades a partir de los capítulos del presupuesto, calcula el camino crítico y justifica cada duración con rendimientos y medios.{o.rules?.gantt ? ' Este pliego lo puntúa.' : ''}</p></div>
          {g && <div className="row" style={{ gap: 8 }}><button className="btn btn-secondary btn-sm" onClick={downloadGantt}><LuDownload /> PDF</button><button className="btn btn-ghost btn-sm" disabled={planning} onClick={plan}><LuRefreshCw /> Rehacer</button></div>}
        </div>
        {!g && <button className="btn btn-primary mt-16" disabled={planning || reading} onClick={plan}>{planning ? <><LuLoaderCircle className="spin" /> Preparando el plan de obra…</> : <><LuSparkles /> Preparar el plan de obra</>}</button>}
        {g && <>
          <div className="row mt-12" style={{ gap: 16, flexWrap: 'wrap' }}>
            <span className="badge">{g.activities.length} actividades</span>
            <span className={`badge ${g.plazo && g.total > g.plazo ? 'bad' : 'ok'}`}>Plazo total: {g.total} días{g.plazo ? ` de ${g.plazo} máximos` : ''}</span>
            <span className="badge">Camino crítico: {g.activities.filter((a) => a.critical).length} actividades</span>
          </div>
          {g.plazo && g.total > g.plazo && <div className="callout bad small mt-8"><LuTriangleAlert /><div>El plan supera el plazo máximo del pliego. Acorta las actividades del camino crítico (en rojo) o añade solapes.</div></div>}
          <GanttChart acts={g.activities} total={g.total} />
          <table className="pr-units mt-16"><thead><tr><th>Actividad</th><th style={{ width: 110 }}>Días</th><th>Justificación (rendimientos y medios)</th></tr></thead>
            <tbody>{g.activities.map((a) => (
              <tr key={a.id}><td><strong style={{ color: a.critical ? 'var(--bad)' : undefined }}>{a.name}</strong><div className="xs muted">{a.deps.length ? `Después de: ${a.deps.map((d) => g.activities.find((x) => x.id === d)?.name ?? d).join(', ')}` : 'Al inicio'}</div></td>
                <td><input className="input" style={{ height: 34, width: 80 }} type="number" min={1} value={a.dur} onChange={(e) => setDur(a.id, Number(e.target.value) || 1)} /></td>
                <td className="small muted">{a.why}</td></tr>
            ))}</tbody></table>
          {g.justification && <details className="pr-details mt-12"><summary>Justificación del plan de obra (va en el PDF)</summary><p className="small mt-8" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{g.justification}</p></details>}
          <p className="xs subtle mt-8">Cambia cualquier duración y PROPO recalcula al momento el plazo y el camino crítico. El PDF va en el paquete, con la memoria técnica.</p>
        </>}
      </div>

      <div className="card card-pad">
        <h3 style={{ fontSize: 18 }}>Presupuesto ofertado (BC3 o Excel)</h3>
        <p className="muted mt-4">Muchas obras piden el presupuesto en formato de Presto (BC3) o en la plantilla Excel de mediciones. Súbelo tal como viene en la licitación y PROPO aplica a todos los precios la rebaja que has elegido en «Fija el precio»{baja != null ? ` (${pct(baja)})` : ''}. Presto y Excel recalculan los totales al abrirlo.</p>
        {baja == null && <div className="callout warn small mt-12"><LuTriangleAlert /><div>Primero fija el precio: <a style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${p.id}/economic`)}>ir a «Fija el precio»</a>.</div></div>}
        <input ref={fileRef} type="file" accept=".bc3,.xlsx" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onBudget(f); }} />
        <div className="row mt-12" style={{ gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" disabled={busyBudget || baja == null} onClick={() => fileRef.current?.click()}>{busyBudget ? <><LuLoaderCircle className="spin" /> Ajustando…</> : <><LuUpload /> Subir el presupuesto (.bc3 o .xlsx)</>}</button>
          {o.budget && <button className="btn btn-ghost" onClick={downloadBudget}><LuDownload /> Descargar {o.budget.name}</button>}
        </div>
        {o.budget && <div className="callout small mt-12"><LuCircleCheck /><div><strong>{o.budget.changed} precios ajustados</strong> con una rebaja del {pct(o.budget.baja)} sobre «{o.budget.source}». Va en el paquete, en el sobre de la oferta económica.{baja != null && Math.abs(baja - o.budget.baja) > 0.0005 && <> <strong>Has cambiado el precio desde entonces: vuelve a subir el archivo.</strong></>}</div></div>}
      </div>
    </div>
  );
}

/** Diagrama de Gantt: una barra por actividad, en rojo las del camino crítico. */
function GanttChart({ acts, total }: { acts: Activity[]; total: number }) {
  const W = 900, L = 260, RH = 26, H = acts.length * RH + 30;
  const x = (d: number) => L + (d / Math.max(1, total)) * (W - L - 10);
  const step = total > 240 ? 30 : total > 90 ? 14 : 7;
  return (
    <div style={{ overflowX: 'auto' }} className="mt-12">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 640, display: 'block' }} role="img" aria-label="Diagrama de Gantt del plan de obra">
        {Array.from({ length: Math.floor(total / step) + 1 }, (_, i) => i * step).map((d) => (
          <g key={d}><line x1={x(d)} x2={x(d)} y1={18} y2={H} stroke="var(--border)" /><text x={x(d) + 2} y={12} fontSize="10" fill="var(--fg-3)">día {d}</text></g>
        ))}
        {acts.map((a, i) => (
          <g key={a.id}>
            <text x={0} y={30 + i * RH + 14} fontSize="12" fill="var(--fg)" fontWeight={a.critical ? 700 : 400}>{a.name.length > 38 ? a.name.slice(0, 37) + '…' : a.name}</text>
            <rect x={x(a.es ?? 0)} y={30 + i * RH + 4} width={Math.max(3, x(a.ef ?? 0) - x(a.es ?? 0))} height={RH - 10} rx={4} fill={a.critical ? 'var(--bad)' : 'var(--accent)'} opacity={a.critical ? 0.9 : 0.75} />
            {!!a.slack && <rect x={x(a.ef ?? 0)} y={30 + i * RH + 10} width={Math.max(0, x(a.lf ?? 0) - x(a.ef ?? 0))} height={4} fill="var(--fg-3)" opacity={0.35} />}
          </g>
        ))}
      </svg>
      <div className="xs muted mt-4"><span style={{ color: 'var(--bad)', fontWeight: 700 }}>■</span> Camino crítico · <span style={{ color: 'var(--accent)', fontWeight: 700 }}>■</span> Otras actividades · la línea gris es la holgura</div>
    </div>
  );
}
