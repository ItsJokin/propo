import React, { useRef, useState } from 'react';
import { LuUpload, LuFileText, LuTrash2, LuTriangleAlert, LuEye, LuFiles, LuLoaderCircle } from 'react-icons/lu';
import { useStore, update, toast } from '../lib/store';
import { addVaultFiles, removeVaultDoc } from '../lib/actions';
import { Empty, Modal, Drawer } from '../components/ui';
import { fmtDate, daysUntil, kb, timeAgo } from '../lib/util';
import { getPages } from '../lib/storage';
import { ACCEPTED } from '../lib/pipeline/parse';
import type { VaultCategory, VaultDoc } from '../lib/types';

const CATS: Record<VaultCategory, string> = { corporate: 'Corporativos', financial: 'Financieros', insurance: 'Seguros', certificate: 'Certificados', experience: 'Proyectos anteriores', team: 'CV del equipo', proposal: 'Propuestas anteriores', other: 'Otros' };

export function Vault() {
  const vault = useStore((s) => s.vault);
  const [cat, setCat] = useState<VaultCategory | ''>('');
  const [uploadCat, setUploadCat] = useState<VaultCategory>('corporate');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<{ name: string; note: string }[]>([]);
  const [del, setDel] = useState<VaultDoc | null>(null);
  const [view, setView] = useState<VaultDoc | null>(null);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const r = await addVaultFiles(Array.from(files), uploadCat);
    setFailed(r.failed);
    setBusy(false);
    if (r.added) toast(`${r.added} documento${r.added > 1 ? 's añadidos' : ' añadido'} a tu biblioteca`, 'ok');
  };
  const list = vault.filter((v) => !cat || v.category === cat);
  const expiring = vault.filter((v) => { const d = daysUntil(v.expiresAt); return d != null && d < 60; });
  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={(e) => { if (e.currentTarget === e.target) setOver(false); }} onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files); }}>
      <div className="page-head">
        <div><h1>Documentos</h1><p>La biblioteca documental de tu empresa. Súbelos una vez y reutilízalos en cada propuesta.</p></div>
        <div className="row">
          <select className="select" style={{ width: 170 }} aria-label="Categoría de la subida" value={uploadCat} onChange={(e) => setUploadCat(e.target.value as VaultCategory)}>{Object.entries(CATS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <button className="btn btn-primary" onClick={() => input.current?.click()} disabled={busy}>{busy ? <LuLoaderCircle className="spin" /> : <LuUpload />} Subir</button>
          <input ref={input} type="file" multiple hidden accept={ACCEPTED} onChange={(e) => { upload(e.target.files); e.target.value = ''; }} />
        </div>
      </div>
      {over && <div className="dropzone over" style={{ marginBottom: 16 }}><LuUpload /><strong>Suelta para subir como «{CATS[uploadCat]}»</strong></div>}
      {failed.length > 0 && (
        <div className="callout bad" style={{ marginBottom: 16 }}><LuTriangleAlert /><div className="grow">{failed.map((f) => <div key={f.name}><strong>{f.name}:</strong> {f.note}</div>)}</div><button className="btn btn-ghost btn-sm" onClick={() => setFailed([])}>Descartar</button></div>
      )}
      {expiring.length > 0 && (
        <div className="callout warn" style={{ marginBottom: 16 }}><LuTriangleAlert /><div>{expiring.length} documento{expiring.length > 1 ? 's caducan' : ' caduca'} en menos de 60 días: {expiring.map((v) => v.name).join(', ')}. Sube la versión renovada para que tus próximas propuestas estén completas.</div></div>
      )}
      {vault.length === 0 ? (
        <div className="card"><Empty icon={<LuFiles />} title="Construye el conocimiento de tu empresa." body="Sube tus documentos una vez y reutilízalos en todas las propuestas: escrituras, seguros, certificados ISO, cuentas anuales, CV del equipo y propuestas anteriores." action={<button className="btn btn-primary" onClick={() => input.current?.click()}><LuUpload /> Subir documentos</button>} /></div>
      ) : (
        <>
          <div className="row-wrap" style={{ marginBottom: 14 }}>
            <button className={`badge ${cat === '' ? 'accent' : 'outline'}`} style={{ cursor: 'pointer', height: 28 }} onClick={() => setCat('')}>Todos · {vault.length}</button>
            {(Object.keys(CATS) as VaultCategory[]).filter((k) => vault.some((v) => v.category === k)).map((k) => <button key={k} className={`badge ${cat === k ? 'accent' : 'outline'}`} style={{ cursor: 'pointer', height: 28 }} onClick={() => setCat(k)}>{CATS[k]} · {vault.filter((v) => v.category === k).length}</button>)}
          </div>
          <div className="doc-grid">
            {list.map((v) => {
              const d = daysUntil(v.expiresAt);
              return (
                <div key={v.id} className="doc-card">
                  <span className="file-ico pdf">{(v.name.split('.').pop() || 'FILE').toUpperCase().slice(0, 4)}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="truncate" style={{ fontWeight: 500 }} title={v.name}>{v.name}</div>
                    <div className="xs muted">{CATS[v.category]} · {v.pages} p. · {kb(v.sizeKb)}</div>
                    <div className="xs subtle">Añadido {timeAgo(v.uploadedAt)} · usado en {v.usedIn} propuesta{v.usedIn === 1 ? '' : 's'}</div>
                    <div className="row-wrap mt-8">
                      {v.expiresAt && <span className={`badge ${d != null && d < 0 ? 'bad' : d != null && d < 60 ? 'warn' : ''}`} style={{ height: 20, fontSize: 11 }}>{d != null && d < 0 ? 'Caducado' : `Válido hasta el ${fmtDate(v.expiresAt, { day: 'numeric', month: 'short', year: 'numeric' })}`}</span>}
                      {!v.hasFile && <span className="badge sample">Registro de ejemplo</span>}
                    </div>
                    <div className="row mt-8">
                      <select className="select" style={{ height: 28, fontSize: 12, width: 'auto' }} aria-label="Categoría" value={v.category} onChange={(e) => update((s) => { const x = s.vault.find((y) => y.id === v.id); if (x) x.category = e.target.value as VaultCategory; })}>{Object.entries(CATS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
                      <button className="btn btn-ghost btn-sm btn-icon" aria-label="Ver texto" disabled={!v.textKey} onClick={() => setView(v)}><LuEye /></button>
                      <button className="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar" onClick={() => setDel(v)}><LuTrash2 /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {del && (
        <Modal title="¿Eliminar documento?" sub={del.name} onClose={() => setDel(null)} footer={<><button className="btn btn-ghost" onClick={() => setDel(null)}>Cancelar</button><button className="btn btn-danger" onClick={() => { removeVaultDoc(del.id); setDel(null); toast('Documento eliminado'); }}><LuTrash2 /> Eliminar</button></>}>
          <p className="muted">El archivo y su texto extraído se eliminan de forma permanente. Las propuestas que lo citan lo mostrarán como evidencia que falta.</p>
        </Modal>
      )}
      {view && <TextDrawer doc={view} onClose={() => setView(null)} />}
    </div>
  );
}

function TextDrawer({ doc, onClose }: { doc: VaultDoc; onClose: () => void }) {
  const [pages, setPages] = useState<string[] | null>(null);
  React.useEffect(() => { if (doc.textKey) getPages(doc.textKey).then((p) => setPages(p ?? [])); }, [doc]);
  return (
    <Drawer title={<span className="row"><LuFileText style={{ width: 16, height: 16 }} /><span className="truncate">{doc.name}</span></span>} onClose={onClose}>
      {pages === null ? <div className="shimmer" style={{ height: 12 }} /> : pages.length === 0 ? <p className="muted">No se ha podido extraer texto de este documento.</p> : pages.map((p, i) => (
        <div key={i} style={{ marginBottom: 16 }}><div className="mono xs subtle" style={{ marginBottom: 6 }}>Página {i + 1}</div><div className="page-view" style={{ minHeight: 0 }}>{p || '(página sin texto)'}</div></div>
      ))}
    </Drawer>
  );
}
