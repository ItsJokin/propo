import React, { useMemo, useRef, useState } from 'react';
import { LuCircleCheck, LuTriangleAlert, LuCircleX, LuEye, LuUpload, LuExternalLink, LuFileCheck, LuLoaderCircle } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { openSource } from '../common';
import { kb } from '../../lib/util';
import { Modal } from '../../components/ui';
import { ACCEPTED } from '../../lib/pipeline/parse';
import { addDocumentsAndReanalyze } from '../../lib/actions';
import { TED_NOTICES } from '../../lib/discovery/tedSnapshot';
import { tenderView } from '../../lib/discovery/brief';

export function Documents({ p }: { p: Project }) {
  const input = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<File[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const notice = useMemo(() => (p.tenderId ? TED_NOTICES.find((t) => t.id === p.tenderId) : undefined), [p.tenderId]);
  const view = useMemo(() => (notice ? tenderView(notice) : null), [notice]);
  const onlyFicha = p.docs.length > 0 && p.docs.every((d) => d.name.startsWith('Ficha de la licitación'));
  const pick = (list: FileList | null) => { if (list?.length) setPicked(Array.from(list)); };
  return (
    <div className="stack gap-16">
      {view && (
        <div className="card">
          <div className="card-head"><LuFileCheck style={{ width: 16, height: 16, color: 'var(--accent)' }} /><h3>Documentos oficiales de la licitación</h3><span className="spacer" />{view.officialPage && <a className="btn btn-ghost btn-sm" href={view.officialPage} target="_blank" rel="noopener noreferrer"><LuExternalLink /> {view.officialHost}</a>}</div>
          <div className="card-body stack" style={{ gap: 10 }}>
            {onlyFicha && <div className="callout small"><LuTriangleAlert /><div>Esta licitación publica sus pliegos en una plataforma que PROPO todavía no puede leer automáticamente, así que el análisis se basa en la ficha oficial. Si quieres el análisis completo, abre los pliegos y arrástralos abajo: PROPO volverá a analizarlo todo.</div></div>}
            {view.docs.length > 0 ? (
              <div className="doc-links">
                {view.docs.map((doc) => (
                  <a key={doc.url} className="doc-link" href={doc.url} target="_blank" rel="noopener noreferrer">
                    <span className="file-ico pdf">{doc.kind === 'pcap' ? 'PCAP' : doc.kind === 'ppt' ? 'PPT' : 'DOC'}</span>
                    <span className="grow" style={{ minWidth: 0 }}><span className="doc-link-name">{doc.name}</span><span className="xs subtle">{view.officialHost}</span></span>
                    <LuExternalLink className="muted" />
                  </a>
                ))}
              </div>
            ) : <p className="small muted">Los pliegos están publicados en {view.officialHost ?? 'la plataforma del organismo'}.</p>}
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-head"><h3>Documentos del pliego</h3><span className="small subtle">{p.docs.length} archivos · {p.docs.reduce((a, d) => a + d.pages, 0)} páginas</span><span className="spacer" />{!p.isSample && <button className="btn btn-secondary btn-sm" onClick={() => input.current?.click()}><LuUpload /> Añadir documentos</button>}</div>
        <input ref={input} type="file" multiple hidden accept={ACCEPTED} onChange={(e) => { pick(e.target.files); e.target.value = ''; }} />
        {p.docs.map((d) => {
          const ok = d.status === 'parsed' || d.status === 'excerpt';
          const refs = p.requirements.filter((r) => r.source.docId === d.id).length;
          return (
            <div key={d.id} className="file-row">
              <span className={`file-ico ${d.kind === 'xlsx' ? 'xlsx' : d.kind === 'pdf' ? 'pdf' : ''}`}>{d.kind === 'other' ? 'ARCH' : d.kind.toUpperCase()}</span>
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="truncate" style={{ fontWeight: 500 }}>{d.name}</div>
                <div className="xs muted">{d.pages} página{d.pages === 1 ? '' : 's'} · {kb(d.sizeKb)} · {refs} requisito{refs === 1 ? '' : 's'} citado{refs === 1 ? '' : 's'}{d.note ? ` · ${d.note}` : ''}</div>
              </div>
              {ok ? <LuCircleCheck className="state-ico ok" /> : d.status === 'partial' ? <LuTriangleAlert className="state-ico warn" /> : <LuCircleX className="state-ico bad" />}
              <span className={`badge ${ok ? 'ok' : d.status === 'partial' ? 'warn' : 'bad'} hide-sm`}>{d.status === 'excerpt' ? 'Extractos de ejemplo' : d.status === 'parsed' ? 'Leído' : d.status === 'partial' ? 'Legible en parte' : d.status === 'unsupported' ? 'No compatible' : 'Ilegible'}</span>
              <button className="btn btn-ghost btn-sm" disabled={!d.pages} onClick={() => openSource({ project: p, docId: d.id, page: Number(Object.keys(d.excerpts ?? {})[0] ?? 1) })}><LuEye /> Abrir</button>
            </div>
          );
        })}
        {!p.isSample && (
          <div className={`dropzone ${over ? 'over' : ''}`} style={{ margin: 16 }} role="button" tabIndex={0} onClick={() => input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files); }}>
            <LuUpload /><strong>Arrastra aquí más documentos del pliego</strong><span className="small muted">PCAP, PPT, anexos o modelos de oferta · PDF, DOCX, XLSX o ZIP</span>
          </div>
        )}
      </div>
      <p className="xs subtle">Los documentos del pliego se guardan separados de la memoria de empresa y del contenido generado. PROPO solo cita lo que hay en estos archivos.</p>
      {picked && (
        <Modal title="¿Añadir documentos y volver a analizar?" sub={picked.map((f) => f.name).join(' · ')} onClose={() => setPicked(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setPicked(null)}>Cancelar</button><button className="btn btn-primary" disabled={busy} onClick={async () => { setBusy(true); await addDocumentsAndReanalyze(p.id, picked); }}>{busy ? <LuLoaderCircle className="spin" /> : <LuUpload />} Añadir y analizar</button></>}>
          <p className="muted">PROPO leerá todos los documentos juntos y volverá a extraer requisitos, criterios y la estructura de la propuesta. Los requisitos que ya hayas revisado se volverán a calcular: revisa de nuevo los que cambien.</p>
        </Modal>
      )}
    </div>
  );
}
