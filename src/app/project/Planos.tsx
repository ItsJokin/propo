// Planos de la oferta (prototipo): editor sobre un plano del proyecto. El técnico elige la página del plano base,
// fija la escala con dos puntos y dibuja tramos, acopios, casetas, vallados e itinerarios; PROPO propone qué elementos
// colocar según la memoria y el plan de obra, y genera el PDF A3 con leyenda, escala y cajetín.
import React, { useEffect, useRef, useState } from 'react';
import { LuPlus, LuTrash2, LuDownload, LuSparkles, LuLoaderCircle, LuCopy, LuRuler, LuMousePointer2, LuInfo, LuCheck } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { updateProject, getState, toast } from '../../lib/store';
import { getFile, putFile } from '../../lib/storage';
import { renderPdfPage } from '../../lib/pipeline/parse';
import { KINDS, newSheet, pathOf, anchorOf, arrowOf, suggestElements, planosPdf, type Kind, type Sheet, type Shape } from '../../lib/planos';
import { offerDownload } from '../../lib/services/download';
import { uid } from '../../lib/util';

type Tool = 'select' | 'scale' | Kind;

export function Planos({ p }: { p: Project }) {
  const sheets = p.planos?.items ?? [];
  const [cur, setCur] = useState<string | null>(sheets[0]?.id ?? null);
  const [adding, setAdding] = useState(!sheets.length);
  const sh = sheets.find((x) => x.id === cur) ?? sheets[0] ?? null;
  const save = (fn: (list: Sheet[]) => void) => updateProject(p.id, (x) => { const list = x.planos?.items ?? []; fn(list); x.planos = { items: list }; });
  const [busy, setBusy] = useState<string | null>(null);
  const download = async () => {
    setBusy('pdf');
    try { const b = await planosPdf(getState().projects.find((x) => x.id === p.id) ?? p, getState()); await offerDownload(`${p.name.slice(0, 60)} — planos de la oferta.pdf`, b); }
    catch (e) { console.error(e); toast('No se ha podido generar el PDF de los planos.', 'bad'); }
    finally { setBusy(null); }
  };
  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="row-wrap" style={{ justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="row" style={{ gap: 8 }}><div className="eyebrow">Planos de la oferta</div><span className="badge outline">Prototipo</span></div>
            <h3 className="mt-4" style={{ fontSize: 18 }}>Implantación, fases y desvíos sobre el plano del proyecto</h3>
            <p className="small muted mt-4">Elige una página de un plano del proyecto, fija la escala y dibuja los tramos, acopios, casetas, vallados e itinerarios. PROPO te propone qué elementos colocar según tu memoria y tu plan de obra, y genera los planos en PDF A3 con leyenda, escala gráfica y el cajetín de tu empresa. Son planos esquemáticos de la oferta, no planos de ejecución.</p>
          </div>
          <div className="row-wrap">
            {sheets.length > 0 && <button className="btn btn-secondary" onClick={() => setAdding(true)}><LuPlus /> Nuevo plano</button>}
            {sheets.length > 0 && <button className="btn btn-primary" onClick={download} disabled={busy === 'pdf'}>{busy === 'pdf' ? <LuLoaderCircle className="spin" /> : <LuDownload />} Descargar PDF</button>}
          </div>
        </div>
        {sheets.length > 1 && <div className="row-wrap mt-12">{sheets.map((x, i) => <button key={x.id} type="button" className={`chip ${x.id === sh?.id ? 'on' : ''}`} onClick={() => setCur(x.id)}>{i + 1} · {x.title}</button>)}</div>}
      </div>
      {adding && <BasePicker p={p} onCancel={sheets.length ? () => setAdding(false) : undefined} onPick={(base) => { const n = newSheet(sheets.length ? `Plano ${sheets.length + 1}` : 'Implantación de obra', base); save((l) => { l.push(n); }); setCur(n.id); setAdding(false); }} />}
      {sh && !adding && <Editor key={sh.id} p={p} sh={sh} save={(fn) => save((l) => { const t = l.find((x) => x.id === sh.id); if (t) fn(t); })}
        duplicate={() => { const n: Sheet = { ...structuredClone(sh), id: uid('pl'), title: `${sh.title} (copia)` }; save((l) => { l.push(n); }); setCur(n.id); }}
        remove={() => { save((l) => { const i = l.findIndex((x) => x.id === sh.id); if (i >= 0) l.splice(i, 1); }); setCur(null); }} />}
    </div>
  );
}

/** Elegir el plano base: una página de un PDF del expediente, o una imagen o PDF que se sube. */
function BasePicker({ p, onPick, onCancel }: { p: Project; onPick: (b: Sheet['base']) => void; onCancel?: () => void }) {
  const pdfs = p.docs.filter((d) => d.textKey && /\.pdf$/i.test(d.name));
  const likely = pdfs.filter((d) => /plano|planta|implantaci|situaci|emplazamiento|trazado/i.test(d.name));
  const [doc, setDoc] = useState(likely[0]?.id ?? pdfs[0]?.id ?? '');
  const [page, setPage] = useState(1);
  const [prev, setPrev] = useState<{ url: string; png: Uint8Array; w: number; h: number; pages: number; name: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const show = async (buf: ArrayBuffer, name: string, pg: number) => {
    setBusy(true);
    try { const r = await renderPdfPage(buf, pg); setPrev((old) => { if (old) URL.revokeObjectURL(old.url); return { ...r, name: `${name}${r.pages > 1 ? `, pág. ${r.page}` : ''}`, url: URL.createObjectURL(new Blob([r.png], { type: 'image/png' })) }; }); }
    catch (e) { console.error(e); toast('No se ha podido abrir esa página.', 'bad'); }
    finally { setBusy(false); }
  };
  useEffect(() => { const d = pdfs.find((x) => x.id === doc); if (!d) return; getFile(d.textKey!).then((b) => b && show(b, d.name, page)); }, [doc, page]);
  const upload = async (f: File) => {
    if (/\.pdf$/i.test(f.name)) { setDoc(''); await show(await f.arrayBuffer(), f.name, 1); return; }
    const img = new Image(); const url = URL.createObjectURL(f);
    img.onload = async () => {
      const k = Math.min(1, 2400 / img.width); const cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      const ctx = cv.getContext('2d')!; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height);
      const blob = await new Promise<Blob>((r) => cv.toBlob((b) => r(b!), 'image/png')); const png = new Uint8Array(await blob.arrayBuffer());
      setPrev({ url: URL.createObjectURL(blob), png, w: cv.width, h: cv.height, pages: 1, name: f.name }); URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  const pick = async () => {
    if (!prev) return;
    const key = `plano:${p.id}:${uid('b')}`;
    await putFile(key, prev.png.buffer.slice(prev.png.byteOffset, prev.png.byteOffset + prev.png.byteLength) as ArrayBuffer);
    onPick({ name: prev.name, key, w: prev.w, h: prev.h });
  };
  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 16 }}>1 · Elige el plano base</h3>
      <p className="small muted mt-4">Lo ideal es la planta general o el plano de situación del proyecto, en PDF.</p>
      <div className="row-wrap mt-12" style={{ alignItems: 'flex-end' }}>
        {pdfs.length > 0 && <div className="field" style={{ minWidth: 260, flex: 1 }}><label htmlFor="pl-doc">Documento del expediente</label>
          <select id="pl-doc" className="select" value={doc} onChange={(e) => { setDoc(e.target.value); setPage(1); }}>{pdfs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>}
        {doc && prev && prev.pages > 1 && <div className="field" style={{ width: 120 }}><label htmlFor="pl-pg">Página</label><input id="pl-pg" className="input" type="number" min={1} max={prev.pages} value={page} onChange={(e) => setPage(Math.max(1, Math.min(prev.pages, Number(e.target.value) || 1)))} /></div>}
        <button className="btn btn-secondary" onClick={() => file.current?.click()}><LuPlus /> Subir un plano (PDF o imagen)</button>
        <input ref={file} type="file" hidden accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f); }} />
      </div>
      {busy && <div className="small mt-12"><LuLoaderCircle className="spin" /> Preparando la vista previa…</div>}
      {prev && <div className="mt-12" style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', maxHeight: 420, background: '#fff' }}><img src={prev.url} alt="Vista previa del plano" style={{ width: '100%', display: 'block' }} /></div>}
      <div className="row mt-12" style={{ gap: 8 }}>
        <button className="btn btn-primary" disabled={!prev || busy} onClick={pick}>Usar este plano</button>
        {onCancel && <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>}
      </div>
    </div>
  );
}

function Editor({ p, sh, save, duplicate, remove }: { p: Project; sh: Sheet; save: (fn: (s: Sheet) => void) => void; duplicate: () => void; remove: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const [label, setLabel] = useState('');
  const [draft, setDraft] = useState<[number, number][]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; from: [number, number]; dx: number; dy: number } | null>(null);
  const [scaleM, setScaleM] = useState('');
  const [suggesting, setSuggesting] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => { let u: string | null = null; getFile(sh.base.key).then((b) => { if (b) { u = URL.createObjectURL(new Blob([b], { type: 'image/png' })); setUrl(u); } }); return () => { if (u) URL.revokeObjectURL(u); }; }, [sh.base.key]);
  const sw = Math.max(sh.base.w, sh.base.h) / 450;   // grosor de línea proporcional a la imagen
  const at = (e: React.MouseEvent): [number, number] => { const m = svg.current!.getScreenCTM()!.inverse(); const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m); return [Math.round(pt.x), Math.round(pt.y)]; };
  const finish = (pts = draft) => {
    if (tool === 'select' || tool === 'scale') return;
    const g = KINDS[tool].geo;
    if ((g === 'poly' && pts.length < 3) || (g === 'line' && pts.length < 2)) { setDraft([]); return; }
    const shp: Shape = { id: uid('sh'), kind: tool, label: label.trim() || KINDS[tool].label, pts };
    save((s) => { s.shapes.push(shp); const sg = s.suggest?.find((x) => !x.done && x.kind === tool && x.label === label); if (sg) sg.done = true; });
    setDraft([]); setSel(shp.id); setTool('select'); setLabel('');
  };
  const click = (e: React.MouseEvent) => {
    if (tool === 'select') { setSel(null); return; }
    const pt = at(e);
    if (tool === 'texto') { finish([pt]); return; }
    if (tool === 'scale') { setDraft((d) => (d.length >= 2 ? [pt] : [...d, pt])); return; }
    setDraft((d) => [...d, pt]);
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDraft([]); setTool('select'); } if (e.key === 'Enter') finish(); if ((e.key === 'Delete' || e.key === 'Backspace') && sel && !(e.target as HTMLElement)?.closest('input,textarea')) { save((s) => { s.shapes = s.shapes.filter((x) => x.id !== sel); }); setSel(null); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  });
  const setScale = () => {
    const m = Number(scaleM.replace(',', '.')); if (draft.length !== 2 || !(m > 0)) return;
    const px = Math.hypot(draft[1][0] - draft[0][0], draft[1][1] - draft[0][1]);
    save((s) => { s.pxPerM = px / m; }); setDraft([]); setTool('select'); setScaleM(''); toast('Escala fijada', 'ok');
  };
  const suggest = async () => {
    setSuggesting(true);
    try { const els = await suggestElements(getState().projects.find((x) => x.id === p.id) ?? p); if (!els.length) toast('PROPO no ha encontrado elementos claros en tu memoria ni en el plan de obra. Dibújalos directamente.', 'neutral'); save((s) => { s.suggest = els; }); }
    catch { toast('No se han podido proponer elementos ahora.', 'bad'); }
    finally { setSuggesting(false); }
  };
  const selShape = sh.shapes.find((x) => x.id === sel);
  const pending = (sh.suggest ?? []).filter((x) => !x.done);
  return (
    <div className="card">
      <div className="card-head" style={{ flexWrap: 'wrap', gap: 8 }}>
        <input className="input" style={{ maxWidth: 280, height: 34, fontWeight: 600 }} aria-label="Título del plano" value={sh.title} onChange={(e) => save((s) => { s.title = e.target.value; })} />
        <span className="spacer" />
        <span className="xs muted">{sh.pxPerM ? `Escala: 1 m = ${sh.pxPerM.toFixed(1)} px` : 'Sin escala'}</span>
        <button className="btn btn-ghost btn-sm" onClick={duplicate} title="Duplicar para otra fase"><LuCopy /> Duplicar</button>
        <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm('¿Borrar este plano?')) remove(); }}><LuTrash2 /></button>
      </div>
      <div className="card-body stack" style={{ gap: 10 }}>
        <div className="row-wrap" style={{ gap: 6 }}>
          <button type="button" className={`chip ${tool === 'select' ? 'on' : ''}`} onClick={() => { setTool('select'); setDraft([]); }}><LuMousePointer2 /> Seleccionar</button>
          <button type="button" className={`chip ${tool === 'scale' ? 'on' : ''}`} onClick={() => { setTool('scale'); setDraft([]); }}><LuRuler /> Escala</button>
          {(Object.keys(KINDS) as Kind[]).map((k) => <button key={k} type="button" className={`chip ${tool === k ? 'on' : ''}`} onClick={() => { setTool(k); setDraft([]); setLabel(''); }}><span style={{ width: 10, height: 10, borderRadius: KINDS[k].geo === 'line' ? 0 : 3, background: KINDS[k].color, display: 'inline-block', marginRight: 2 }} />{KINDS[k].label}</button>)}
        </div>
        {tool !== 'select' && tool !== 'scale' && <div className="row-wrap small" style={{ gap: 8 }}><input className="input" style={{ maxWidth: 260, height: 32 }} placeholder={`Nombre (p. ej. ${tool === 'zona' ? 'Tramo 1' : KINDS[tool].label})`} value={label} onChange={(e) => setLabel(e.target.value)} /><span className="muted">{KINDS[tool].hint}</span>{draft.length > 0 && <button className="btn btn-secondary btn-sm" onClick={() => finish()}>Terminar</button>}</div>}
        {tool === 'scale' && <div className="row-wrap small" style={{ gap: 8 }}><span className="muted">Haz clic en dos puntos cuya distancia conozcas (por ejemplo, los extremos de la escala gráfica del plano) y escribe la distancia real.</span>{draft.length === 2 && <><input className="input" style={{ width: 110, height: 32 }} placeholder="metros" value={scaleM} onChange={(e) => setScaleM(e.target.value)} /><button className="btn btn-primary btn-sm" onClick={setScale}>Fijar escala</button></>}</div>}
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'auto', background: '#fff', maxHeight: '70vh', cursor: tool === 'select' ? 'default' : 'crosshair' }}>
          <svg ref={svg} viewBox={`0 0 ${sh.base.w} ${sh.base.h}`} style={{ width: '100%', display: 'block', userSelect: 'none' }} onClick={click} onDoubleClick={(e) => { e.preventDefault(); finish(draft.slice(0, -1).length >= 2 ? draft.slice(0, -1) : draft); }}
            onMouseMove={(e) => { if (drag) { const [x, y] = at(e); setDrag({ ...drag, dx: x - drag.from[0], dy: y - drag.from[1] }); } }}
            onMouseUp={() => { if (drag && (drag.dx || drag.dy)) save((s) => { const t = s.shapes.find((x) => x.id === drag.id); if (t) t.pts = t.pts.map(([x, y]) => [x + drag.dx, y + drag.dy]); }); setDrag(null); }}>
            {url && <image href={url} x={0} y={0} width={sh.base.w} height={sh.base.h} opacity={0.6} />}
            {sh.shapes.map((s) => {
              const K = KINDS[s.kind]; const moving = drag?.id === s.id; const tr = moving ? `translate(${drag!.dx},${drag!.dy})` : undefined;
              const [ax, ay] = anchorOf(s); const ar = K.arrow ? arrowOf(s, sw * 7) : null;
              return (
                <g key={s.id} transform={tr} style={{ cursor: tool === 'select' ? 'move' : undefined }}
                  onClick={(e) => { if (tool === 'select') { e.stopPropagation(); setSel(s.id); } }}
                  onMouseDown={(e) => { if (tool === 'select') { e.stopPropagation(); setSel(s.id); setDrag({ id: s.id, from: at(e), dx: 0, dy: 0 }); } }}>
                  {K.geo !== 'point' && <path d={pathOf(s)} fill={K.geo === 'poly' ? K.color : 'none'} fillOpacity={K.fill} stroke={K.color} strokeWidth={sw * (K.geo === 'poly' ? 1.6 : 2.6) * (sel === s.id ? 1.6 : 1)} strokeDasharray={K.dash ? `${sw * 6} ${sw * 4}` : undefined} strokeLinejoin="round" />}
                  {ar && <path d={ar} fill={K.color} />}
                  {K.geo === 'point' && <circle cx={ax} cy={ay} r={sw * 3} fill={K.color} />}
                  <text x={ax} y={ay - (K.geo === 'point' ? sw * 6 : 0)} fontSize={sw * 9} fontWeight={700} textAnchor="middle" dominantBaseline="middle" fill={K.color} stroke="#fff" strokeWidth={sw * 3} paintOrder="stroke">{s.label}</text>
                </g>
              );
            })}
            {draft.length > 0 && tool !== 'select' && <g pointerEvents="none">
              <polyline points={draft.map((q) => q.join(',')).join(' ')} fill="none" stroke={tool === 'scale' ? '#0B1730' : KINDS[tool as Kind].color} strokeWidth={sw * 2} strokeDasharray={`${sw * 4} ${sw * 3}`} />
              {draft.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={sw * 3} fill="#fff" stroke="#0B1730" strokeWidth={sw} />)}
            </g>}
          </svg>
        </div>
        {selShape && <div className="row-wrap small" style={{ gap: 8 }}><span className="muted">Seleccionado:</span><input className="input" style={{ maxWidth: 260, height: 32 }} value={selShape.label} onChange={(e) => save((s) => { const t = s.shapes.find((x) => x.id === selShape.id); if (t) t.label = e.target.value; })} /><span className="xs muted">{KINDS[selShape.kind].label} · arrástralo para moverlo</span><button className="btn btn-ghost btn-sm" onClick={() => { save((s) => { s.shapes = s.shapes.filter((x) => x.id !== selShape.id); }); setSel(null); }}><LuTrash2 /> Borrar</button></div>}
        <div className="well small">
          <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
            <span><b>Elementos que propone PROPO</b> <span className="muted">según tu memoria y tu plan de obra</span></span>
            <button className="btn btn-secondary btn-sm" onClick={suggest} disabled={suggesting}>{suggesting ? <LuLoaderCircle className="spin" /> : <LuSparkles />} {sh.suggest ? 'Volver a proponer' : 'Proponer elementos'}</button>
          </div>
          {sh.suggest && <div className="row-wrap mt-8" style={{ gap: 6 }}>
            {sh.suggest.map((x, i) => <button key={i} type="button" className={`chip ${x.done ? '' : 'on'}`} disabled={x.done} onClick={() => { setTool(x.kind); setLabel(x.label); setDraft([]); }} title={x.done ? 'Ya colocado' : 'Colocar en el plano'}>{x.done ? <LuCheck /> : <span style={{ width: 9, height: 9, borderRadius: 2, background: KINDS[x.kind].color, display: 'inline-block' }} />} {x.label}</button>)}
            {!pending.length && sh.suggest.length > 0 && <span className="xs muted">Todos colocados.</span>}
          </div>}
          <p className="xs muted mt-8"><LuInfo style={{ verticalAlign: -2 }} /> PROPO propone qué dibujar; dónde va cada elemento lo decides tú sobre el plano. Supr borra el elemento seleccionado, Esc cancela.</p>
        </div>
      </div>
    </div>
  );
}
