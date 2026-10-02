import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LuPlus, LuUpload, LuX, LuFileText, LuFolderKanban, LuTriangleAlert, LuSearch, LuFlaskConical, LuExternalLink, LuInfo } from 'react-icons/lu';
import { useStore, navigate, getState } from '../lib/store';
import { Empty, Modal } from '../components/ui';
import { ProjectRows } from './Dashboard';
import { projectStatus } from '../lib/derive';
import { createProject, canCreateProposal, type LimitReason } from '../lib/actions';
import { UpgradeModal } from './common';
import { ACCEPTED, kindOf } from '../lib/pipeline/parse';
import { sampleTenderFile } from '../lib/sampleTender';
import type { ProjectType } from '../lib/types';
import { kb } from '../lib/util';
import { tenderView, fichaFile } from '../lib/discovery/brief';
import type { TedNotice } from '../lib/discovery/tedSnapshot';

export function Projects({ openNew }: { openNew?: boolean }) {
  const projects = useStore((s) => s.projects);
  const [filter, setFilter] = useState<'all' | 'progress' | 'ready' | 'sample'>('all');
  const [q, setQ] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [paywall, setPaywall] = useState<LimitReason | null>(null);
  const tryNew = () => {
    const c = canCreateProposal(getState());
    if (!c.ok) { setPaywall(c.reason); return; }
    setShowNew(true);
  };
  useEffect(() => { if (openNew) { tryNew(); navigate('/app/projects'); } }, [openNew]);
  const list = projects.filter((p) => {
    const st = projectStatus(p);
    if (filter === 'progress' && st === 'Lista para presentar') return false;
    if (filter === 'ready' && !(st === 'Lista para presentar' || st === 'Lista para revisar')) return false;
    if (filter === 'sample' && !p.isSample) return false;
    return !q || (p.name + p.organization).toLowerCase().includes(q.toLowerCase());
  });
  return (
    <>
      <div className="page-head">
        <div><h1>Mis proyectos</h1><p>Cada licitación, RFP o propuesta es un proyecto con sus documentos, requisitos y propuesta.</p></div>
        <div className="row-wrap">
          <button className="btn btn-secondary" onClick={() => navigate('/app/tenders')}><LuSearch /> Buscar licitaciones</button>
          <button className="btn btn-primary" onClick={tryNew}><LuPlus /> Nueva propuesta</button>
        </div>
      </div>
      <div className="row-wrap" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
        <div className="seg">
          {([['all', 'Todos'], ['progress', 'En curso'], ['ready', 'Listos'], ['sample', 'Ejemplos']] as const).map(([k, l]) => <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>)}
        </div>
        <label className="search" style={{ width: 280, display: 'flex' }}><LuSearch /><input aria-label="Filtrar proyectos" placeholder="Filtrar proyectos" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      </div>
      <div className="card">
        {projects.length === 0 ? (
          <Empty icon={<LuFolderKanban />} title="Aquí vivirán tus propuestas." body="Crea tu primera propuesta: sube los documentos de la licitación y PROPO se encarga de leerlos." action={<button className="btn btn-primary" onClick={tryNew}><LuPlus /> Crear mi primera propuesta</button>} />
        ) : list.length === 0 ? (
          <Empty icon={<LuSearch />} title="Ningún proyecto coincide" body="Prueba con otro filtro o búsqueda." />
        ) : <ProjectRows projects={list} />}
      </div>
      {showNew && <NewProposal onClose={() => setShowNew(false)} onLimit={(r) => { setShowNew(false); setPaywall(r); }} />}
      {paywall && <UpgradeModal reason={paywall} onClose={() => setPaywall(null)} />}
    </>
  );
}

const TYPES: [ProjectType, string, string][] = [
  ['public_tender', 'Licitación pública', 'Contratación pública, acuerdo marco o concesión'],
  ['private_rfp', 'RFP privado', 'Solicitud de propuesta de una empresa'],
  ['commercial', 'Propuesta comercial', 'Presupuesto o propuesta para un cliente'],
  ['other', 'Otro', 'Cualquier otro proceso de propuesta'],
];

interface Picked { file: File; error?: string; }

export function NewProposal({ onClose, onLimit, prefill }: { onClose: () => void; onLimit: (r: LimitReason) => void; prefill?: { name: string; organization: string; tenderId: string; url: string; notice?: TedNotice } }) {
  const [name, setName] = useState(prefill?.name ?? '');
  const [org, setOrg] = useState(prefill?.organization ?? '');
  const [type, setType] = useState<ProjectType>('public_tender');
  const [files, setFiles] = useState<Picked[]>([]);
  const [over, setOver] = useState(false);
  const [busySample, setBusySample] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const view = useMemo(() => (prefill?.notice ? tenderView(prefill.notice) : null), [prefill?.notice]);
  useEffect(() => { if (prefill?.notice) setFiles([{ file: fichaFile(prefill.notice) }]); }, [prefill?.notice]);
  const add = (list: FileList | File[] | null) => {
    if (!list) return;
    const next = Array.from(list).map((file): Picked => {
      const zip = file.name.toLowerCase().endsWith('.zip');
      const k = kindOf(file.name);
      if (!zip && k === 'other') return { file, error: /\.(doc|xls)$/i.test(file.name) ? 'Formato antiguo de Office. Guárdalo como .docx o .xlsx.' : 'Tipo de archivo no compatible' };
      if (file.size > 60 * 1024 * 1024) return { file, error: 'Más de 60 MB' };
      return { file };
    });
    setFiles((f) => [...f, ...next.filter((n) => !f.some((x) => x.file.name === n.file.name))]);
  };
  const useSample = async () => {
    setBusySample(true);
    const f = await sampleTenderFile();
    add([f]);
    if (!name) setName('Mantenimiento de instalaciones deportivas');
    if (!org) setOrg('Ajuntament de la Costa del Garraf (ficticio)');
    setBusySample(false);
  };
  const valid = files.filter((f) => !f.error);
  const submit = () => {
    if (!name.trim()) return setErr('Ponle un nombre a la propuesta.');
    if (!valid.length) return setErr('Sube al menos un documento compatible.');
    const r = createProject({ name, organization: org, type, tenderId: prefill?.tenderId }, valid.map((f) => f.file));
    if (!r.ok) onLimit(r.reason);
  };
  return (
    <Modal title="Nueva propuesta" sub="Sube los documentos de la licitación. PROPO los lee y lo prepara todo para tu revisión." onClose={onClose} wide
      footer={<><span className="xs subtle grow" style={{ alignSelf: 'center' }}>Los documentos se procesan de forma privada para tu empresa.</span><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" onClick={submit} disabled={!valid.length || !name.trim()}>Analizar documentos</button></>}>
      <div className="stack gap-16">
        {prefill && (
          <div className="callout small">
            <LuInfo />
            <div className="grow">
              <div><strong>Ya puedes empezar.</strong> PROPO ha preparado la ficha de la licitación con los datos oficiales{view?.depth === 'pliego' ? ' de los pliegos' : ' del anuncio'}. Para un análisis completo, abre también los pliegos y arrástralos aquí.</div>
              {view && view.docs.length > 0 && (
                <div className="np-docs">
                  {view.docs.filter((d) => d.kind === 'pcap' || d.kind === 'ppt').map((d) => <a key={d.url} className="link small" href={d.url} target="_blank" rel="noopener noreferrer"><LuExternalLink style={{ width: 13, height: 13, verticalAlign: -2 }} /> {d.name}</a>)}
                </div>
              )}
            </div>
            <a className="btn btn-secondary btn-sm" href={view?.officialPage ?? prefill.url} target="_blank" rel="noopener noreferrer"><LuExternalLink /> {view?.officialPage ? 'Documentos oficiales' : 'Abrir anuncio'}</a>
          </div>
        )}
        <div className="grid-2">
          <div className="field"><label htmlFor="np-name">Nombre</label><input id="np-name" className="input" autoFocus placeholder="p. ej. Contrato de catering de Barcelona" value={name} onChange={(e) => { setName(e.target.value); setErr(null); }} /></div>
          <div className="field"><label htmlFor="np-org">Organismo / empresa</label><input id="np-org" className="input" placeholder="Quién convoca la licitación" value={org} onChange={(e) => setOrg(e.target.value)} /></div>
        </div>
        <div className="field">
          <span className="label">Tipo</span>
          <div className="grid-4" style={{ gap: 8 }}>
            {TYPES.map(([k, l, d]) => <button key={k} type="button" className={`choice ${type === k ? 'on' : ''}`} onClick={() => setType(k)} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}><strong style={{ fontSize: 13.5 }}>{l}</strong><span className="xs muted">{d}</span></button>)}
          </div>
        </div>
        <div className="field">
          <span className="label">Documentos</span>
          <div className={`dropzone ${over ? 'over' : ''}`} role="button" tabIndex={0} onClick={() => input.current?.click()} onKeyDown={(e) => { if (e.key === 'Enter') input.current?.click(); }}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}>
            <LuUpload />
            <strong>Arrastra aquí los documentos de la licitación</strong>
            <span className="small muted">PDF, DOCX, XLSX o ZIP · pliegos, cláusulas, anexos, modelos de oferta</span>
            <input ref={input} type="file" multiple accept={ACCEPTED} hidden onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
          </div>
          {files.length > 0 && (
            <div className="upload-list mt-8">
              {files.map((f) => (
                <div key={f.file.name} className="upload-row" style={f.error ? { borderColor: 'var(--bad)' } : undefined}>
                  {f.error ? <LuTriangleAlert className="state-ico bad" /> : <LuFileText className="state-ico muted" />}
                  <span className="grow truncate">{f.file.name}</span>
                  {f.error ? <span className="xs" style={{ color: 'var(--bad-ink)' }}>{f.error}</span> : <span className="xs subtle">{kb(f.file.size / 1024)}</span>}
                  <button className="btn btn-ghost btn-sm btn-icon" aria-label={`Quitar ${f.file.name}`} onClick={() => setFiles(files.filter((x) => x !== f))}><LuX /></button>
                </div>
              ))}
            </div>
          )}
          {!prefill && (
            <div className="row mt-8">
              <span className="xs subtle">¿No tienes un pliego a mano?</span>
              <button type="button" className="link small" onClick={useSample} disabled={busySample}><LuFlaskConical style={{ width: 13, height: 13, verticalAlign: -2 }} /> {busySample ? 'Preparando…' : 'Usar un pliego de ejemplo (ficticio, 6 páginas)'}</button>
            </div>
          )}
        </div>
        {err && <div className="error-text" role="alert">{err}</div>}
      </div>
    </Modal>
  );
}
