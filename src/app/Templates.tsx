import React, { useState } from 'react';
import { LuPlus, LuLayoutTemplate, LuPencil, LuTrash2, LuCopy } from 'react-icons/lu';
import { useStore, update, toast } from '../lib/store';
import { Empty, Modal, SampleBadge } from '../components/ui';
import { uid, nowIso, timeAgo } from '../lib/util';
import type { Template } from '../lib/types';

const KIND: Record<Template['kind'], string> = { section: 'Sección de propuesta', answer: 'Respuesta reutilizable', structure: 'Estructura de propuesta' };

export function Templates() {
  const list = useStore((s) => s.templates);
  const [edit, setEdit] = useState<Template | null>(null);
  const [kind, setKind] = useState<'' | Template['kind']>('');
  const shown = list.filter((t) => !kind || t.kind === kind);
  const blank: Template = { id: '', name: '', kind: 'answer', body: '', usedCount: 0, updatedAt: nowIso(), source: 'user' };
  return (
    <>
      <div className="page-head">
        <div><h1>Plantillas</h1><p>Respuestas y secciones aprobadas que tu empresa reutiliza. PROPO parte de ellas al redactar nuevas propuestas.</p></div>
        <button className="btn btn-primary" onClick={() => setEdit(blank)}><LuPlus /> Nueva plantilla</button>
      </div>
      {list.length > 0 && (
        <div className="seg" style={{ marginBottom: 14 }}>
          <button className={kind === '' ? 'on' : ''} onClick={() => setKind('')}>Todas</button>
          {(Object.keys(KIND) as Template['kind'][]).map((k) => <button key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{KIND[k]}</button>)}
        </div>
      )}
      <div className="card">
        {list.length === 0 ? (
          <Empty icon={<LuLayoutTemplate />} title="Tu biblioteca de respuestas empieza aquí." body="Cuando apruebes una sección de una propuesta, guárdala como plantilla. La próxima vez, PROPO partirá de tus mejores respuestas en lugar de una página en blanco." action={<button className="btn btn-primary" onClick={() => setEdit(blank)}><LuPlus /> Crear una plantilla</button>} />
        ) : shown.map((t) => (
          <div key={t.id} className="entity">
            <div style={{ minWidth: 0 }}>
              <div className="row-wrap"><strong>{t.name}</strong><span className="badge outline" style={{ height: 20, fontSize: 11 }}>{KIND[t.kind]}</span>{t.source === 'approved' && <span className="badge ok" style={{ height: 20, fontSize: 11 }}>De una sección aprobada</span>}{t.id.startsWith('tp') && t.id.length < 5 && <SampleBadge />}</div>
              <p className="small muted mt-4 clamp2" style={{ whiteSpace: 'pre-line' }}>{t.body}</p>
              <div className="xs subtle mt-4">Usada {t.usedCount} veces · actualizada {timeAgo(t.updatedAt)}</div>
            </div>
            <div className="row">
              <button className="btn btn-ghost btn-sm btn-icon" aria-label="Copiar texto" onClick={() => navigator.clipboard?.writeText(t.body).then(() => toast('Copiado', 'ok')).catch(() => toast('No se puede copiar aquí'))}><LuCopy /></button>
              <button className="btn btn-ghost btn-sm btn-icon" aria-label="Editar" onClick={() => setEdit(t)}><LuPencil /></button>
              <button className="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar" onClick={() => update((s) => { s.templates = s.templates.filter((x) => x.id !== t.id); })}><LuTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
      {edit && <TemplateModal t={edit} onClose={() => setEdit(null)} />}
    </>
  );
}

function TemplateModal({ t, onClose }: { t: Template; onClose: () => void }) {
  const [v, setV] = useState(t);
  return (
    <Modal title={t.id ? 'Editar plantilla' : 'Nueva plantilla'} onClose={onClose} wide footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" disabled={!v.name.trim() || !v.body.trim()} onClick={() => { update((s) => { if (v.id) s.templates = s.templates.map((x) => (x.id === v.id ? { ...v, updatedAt: nowIso() } : x)); else s.templates.unshift({ ...v, id: uid('tpl'), updatedAt: nowIso() }); }); toast('Plantilla guardada', 'ok'); onClose(); }}>Guardar</button></>}>
      <div className="stack">
        <div className="grid-2">
          <div className="field"><label htmlFor="tp-n">Nombre</label><input id="tp-n" className="input" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></div>
          <div className="field"><label htmlFor="tp-k">Tipo</label><select id="tp-k" className="select" value={v.kind} onChange={(e) => setV({ ...v, kind: e.target.value as Template['kind'] })}>{Object.entries(KIND).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
        </div>
        <div className="field"><label htmlFor="tp-b">Contenido</label><textarea id="tp-b" className="textarea" style={{ minHeight: 220 }} value={v.body} onChange={(e) => setV({ ...v, body: e.target.value })} /></div>
      </div>
    </Modal>
  );
}
