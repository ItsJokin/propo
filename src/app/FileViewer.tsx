// Ver un documento tal cual es (el PDF o la imagen original), con la opción de ver el texto que lee PROPO y de
// descargar el archivo. Lo usan Documentos (empresa) y los documentos del pliego de cada proyecto.
import React, { useEffect, useState } from 'react';
import { LuDownload, LuFileText, LuEye, LuLoaderCircle } from 'react-icons/lu';
import { Modal } from '../components/ui';
import { getFile, getPages } from '../lib/storage';

const TYPES: Record<string, string> = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', txt: 'text/plain' };
const ext = (name: string) => (name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase();

export function FileViewer({ name, fileKey, onClose }: { name: string; fileKey: string; onClose: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'none'>('loading');
  const [tab, setTab] = useState<'original' | 'text'>('original');
  const [pages, setPages] = useState<string[] | null>(null);
  const e = ext(name);
  const type = TYPES[e] || 'application/octet-stream';
  const viewable = e === 'pdf' || type.startsWith('image/') || e === 'txt';

  useEffect(() => {
    let made: string | null = null, alive = true;
    getFile(fileKey).then((buf) => {
      if (!alive) return;
      if (!buf) { setState('none'); setTab('text'); return; }
      made = URL.createObjectURL(new Blob([buf], { type }));
      setUrl(made); setState('ready');
      if (!viewable) setTab('text');
    }).catch(() => { if (alive) { setState('none'); setTab('text'); } });
    return () => { alive = false; if (made) URL.revokeObjectURL(made); };
  }, [fileKey]);
  useEffect(() => { if (tab === 'text' && pages === null) getPages(fileKey).then((p) => setPages(p ?? [])); }, [tab]);

  return (
    <Modal wide title={<span className="row"><LuFileText style={{ width: 16, height: 16 }} /><span className="truncate">{name}</span></span>} onClose={onClose}
      footer={<>{url && <a className="btn btn-secondary" href={url} download={name}><LuDownload /> Descargar el original</a>}<button className="btn btn-primary" onClick={onClose}>Cerrar</button></>}>
      <div className="seg" style={{ marginBottom: 14 }}>
        <button className={tab === 'original' ? 'on' : ''} disabled={state === 'none'} onClick={() => setTab('original')}><LuEye /> Documento</button>
        <button className={tab === 'text' ? 'on' : ''} onClick={() => setTab('text')}><LuFileText /> Texto que lee PROPO</button>
      </div>
      {tab === 'original' ? (
        state === 'loading' ? <div className="fv-wait"><LuLoaderCircle className="spin" /> Abriendo el documento…</div>
          : !url ? null
          : e === 'pdf' || e === 'txt' ? <iframe className="pdf-view" src={url} title={name} />
          : type.startsWith('image/') ? <img src={url} alt={name} style={{ display: 'block', maxWidth: '100%', maxHeight: '70vh', margin: '0 auto', borderRadius: 10 }} />
          : <div className="fv-wait">Este tipo de archivo ({e.toUpperCase() || 'desconocido'}) no se puede ver aquí. Descárgalo para abrirlo, o mira el texto que lee PROPO.</div>
      ) : (
        <>
          {state === 'none' && <p className="small muted" style={{ marginTop: 0 }}>De este documento solo se guardó el texto, no el archivo original.</p>}
          {pages === null ? <div className="shimmer" style={{ height: 12 }} /> : pages.length === 0 ? <p className="muted">No se ha podido extraer texto de este documento.</p> : (
            <div style={{ maxHeight: '64vh', overflow: 'auto' }}>
              {pages.map((p, i) => <div key={i} style={{ marginBottom: 16 }}><div className="mono xs subtle" style={{ marginBottom: 6 }}>Página {i + 1}</div><div className="page-view" style={{ minHeight: 0 }}>{p || '(página sin texto)'}</div></div>)}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
