import React, { useMemo, useRef, useState } from 'react';
import { LuArrowRight, LuUpload, LuCheck, LuMapPin, LuShieldCheck, LuLoaderCircle } from 'react-icons/lu';
import type { Project, Section } from '../../lib/types';
import { Modal } from '../../components/ui';
import { toast } from '../../lib/store';
import { planFor, fillInfo, fillWithDocument, goAdd } from '../../lib/infoFix';
import { ACCEPTED } from '../../lib/pipeline/parse';

// Resolver un «[Información requerida: …]» sin salir de la propuesta, o ir directo a donde se guarda.
export function InfoFixModal({ p, s, tag, label, onClose }: { p: Project; s: Section; tag: string; label: string; onClose: () => void }) {
  const plan = useMemo(() => planFor(label), [label]);
  const [v, setV] = useState('');
  const [save, setSave] = useState(!!plan.saveLabel);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const done = (msg: string) => { toast(msg, 'ok'); onClose(); };
  const submit = () => {
    if (!v.trim()) return;
    fillInfo(p.id, s.id, tag, label, v, save && !!plan.saveLabel);
    done(save && plan.saveLabel ? `Añadido a «${s.title}» y guardado en ${plan.where}` : `Añadido a «${s.title}»`);
  };
  const upload = async (f: File) => {
    setBusy(true);
    const ok = await fillWithDocument(p.id, s.id, tag, label, f);
    setBusy(false);
    done(ok ? `«${f.name}» guardado en Documentos y citado en la sección` : `Añadido a la sección. Revisa «${f.name}» en Documentos`);
  };
  return (
    <Modal title={`Añadir: ${plan.title}`} sub={`Lo pide la sección «${s.title}». PROPO no se lo inventa: escríbelo aquí y lo pongo en su sitio.`} onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Ahora no</button><button className="btn btn-primary" disabled={!v.trim() || busy} onClick={submit}><LuCheck /> Añadir a la propuesta</button></>}>
      <div className="stack gap-16">
        <div className="info-req" style={{ display: 'block', padding: '8px 10px' }}>Información requerida: {label}</div>
        {plan.humanOnly && <div className="callout neutral small"><LuShieldCheck /><div>Los precios los decide siempre una persona de tu equipo. Escribe el dato tal como irá en la oferta.</div></div>}
        <div className="field">
          <label htmlFor="fix-v">Tu respuesta</label>
          {plan.multiline
            ? <textarea id="fix-v" className="textarea" autoFocus rows={3} placeholder={plan.placeholder} value={v} onChange={(e) => setV(e.target.value)} />
            : <input id="fix-v" className="input" autoFocus placeholder={plan.placeholder} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} />}
        </div>
        {plan.saveLabel && (
          <label className="row small" style={{ alignItems: 'flex-start' }}>
            <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} style={{ marginTop: 3 }} />
            <span><strong>{plan.saveLabel}</strong><span className="muted"> · así no volverá a faltar en otras propuestas</span></span>
          </label>
        )}
        {plan.upload && (
          <div className="row-wrap">
            <span className="small muted">¿Lo tienes en un documento?</span>
            <button className="btn btn-secondary btn-sm" disabled={busy} onClick={() => file.current?.click()}>{busy ? <LuLoaderCircle className="spin" /> : <LuUpload />} Subir el documento</button>
            <input ref={file} type="file" hidden accept={ACCEPTED} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) upload(f); }} />
          </div>
        )}
        {plan.path && (
          <div className="fix-where">
            <LuMapPin style={{ width: 16, height: 16, color: 'var(--accent)', flex: 'none' }} />
            <span className="grow">Este dato se guarda en <strong>{plan.where}</strong>.</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { onClose(); goAdd(plan, p.id, s.title); }}>Ir allí <LuArrowRight /></button>
          </div>
        )}
      </div>
    </Modal>
  );
}
