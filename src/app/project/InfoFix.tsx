import React, { useMemo, useRef, useState } from 'react';
import { LuArrowRight, LuUpload, LuCheck, LuMapPin, LuShieldCheck, LuLoaderCircle, LuSparkles, LuRotateCcw, LuMessageCircle } from 'react-icons/lu';
import type { Project, Section } from '../../lib/types';
import { Modal } from '../../components/ui';
import { toast } from '../../lib/store';
import { planFor, fillInfo, fillWithDocument, goAdd } from '../../lib/infoFix';
import { ACCEPTED } from '../../lib/pipeline/parse';
import { ai, aiState, getSample } from '../../lib/ai/provider';

/** Qué se le pide al cliente que cuente, según el tipo de dato. */
const HINT: Record<string, string> = {
  price: 'Dime los precios tal como los vas a ofertar: qué incluye cada uno, si llevan IVA y cualquier condición.',
  experience: 'Cuéntame para quién trabajaste, en qué años, qué hiciste y por qué importe aproximado.',
  team: 'Dime quién es, qué cargo tiene, cuántos años de experiencia y qué titulación o formación.',
  certification: 'Dime qué certificado o autorización tienes, quién lo emite y hasta cuándo está vigente.',
  capability: 'Cuéntame con qué medios cuentas y cómo lo hacéis en el día a día.',
  revenue: 'Dime cuánto facturaste en cada uno de los últimos tres años, aunque sea aproximado.',
};
const numbers = (t: string) => t.match(/\d+(?:[.,]\d+)*/g) ?? [];

// Resolver un «[Información requerida: …]» sin salir de la propuesta: el cliente lo cuenta con sus palabras,
// la IA lo redacta en el mismo cuadro y después se añade a la sección.
export function InfoFixModal({ p, s, tag, label, onClose }: { p: Project; s: Section; tag: string; label: string; onClose: () => void }) {
  const plan = useMemo(() => planFor(label), [label]);
  const [v, setV] = useState('');
  const [raw, setRaw] = useState<string | null>(null);   // lo que escribió el cliente antes de reescribirlo la IA
  const [writing, setWriting] = useState(false);
  const [note, setNote] = useState('');
  const [save, setSave] = useState(!!plan.saveLabel);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const done = (msg: string) => { toast(msg, 'ok'); onClose(); };
  const submit = () => {
    if (!v.trim()) return;
    fillInfo(p.id, s.id, tag, label, v, save && !!plan.saveLabel, raw ?? undefined);
    done(save && plan.saveLabel ? `Añadido a «${s.title}» y guardado en ${plan.where}` : `Añadido a «${s.title}»`);
  };
  const upload = async (f: File) => {
    setBusy(true);
    const ok = await fillWithDocument(p.id, s.id, tag, label, f);
    setBusy(false);
    done(ok ? `«${f.name}» guardado en Documentos y citado en la sección` : `Añadido a la sección. Revisa «${f.name}» en Documentos`);
  };
  const rewrite = async () => {
    const mine = (raw ?? v).trim();
    if (!mine || writing) return;
    setWriting(true); setNote('');
    try {
      const sample = await getSample();
      if (!sample || aiState() === 'declined') { setNote('La IA no está disponible ahora mismo. Puedes añadirlo tal como lo has escrito.'); return; }
      const para = s.content.split(/\n{2,}/).find((x) => x.includes(tag)) ?? '';
      const alone = !para || para.trim() === tag;
      const prompt = [
        'Eres PROPO, redactor de ofertas para licitaciones públicas en España. El cliente ha explicado con sus palabras un dato que faltaba en su propuesta. Redáctalo para que quede listo para pegar en la propuesta.',
        'Reglas:',
        '- Usa SOLO lo que dice el cliente. No añadas datos, cifras, nombres, fechas, certificados ni compromisos que no haya escrito.',
        '- Conserva todas las cifras, precios, porcentajes y fechas exactamente como las ha escrito.',
        '- Castellano de España, tono profesional y claro, en primera persona del plural («ofrecemos», «contamos con»). Corrige faltas y ordena las ideas.',
        alone
          ? '- Puedes usar uno o varios párrafos cortos. Si hay varios precios o elementos comparables, ponlos en una tabla markdown sencilla o en una lista con guiones.'
          : '- Tu texto sustituirá a la marca entre corchetes dentro de la frase del contexto: debe encajar gramaticalmente en ella, sin saltos de línea y sin repetir el resto de la frase.',
        '- Si lo que ha escrito no responde a lo que se pide, redacta igualmente lo que ha dicho, sin rellenar el resto.',
        '- Responde ÚNICAMENTE con el texto final, sin comillas, sin títulos y sin comentarios.',
        '',
        `Sección de la propuesta: ${s.title}`,
        `Dato que faltaba: ${label}`,
        para && !alone ? `Contexto (la marca se sustituirá por tu texto): ${para.slice(0, 900)}` : '',
        `Lo que ha escrito el cliente:\n${mine}`,
      ].filter((x) => x !== '').join('\n');
      setRaw(mine);
      const out = await ai.text(prompt, { tier: 'quick', onText: (t) => setV(t) });
      const text = out.text.trim();
      if (!text) { setV(mine); setRaw(null); setNote('No se ha podido reescribir. Puedes añadirlo tal como lo has escrito.'); return; }
      setV(text);
      const lost = [...new Set(numbers(mine))].filter((n) => !text.includes(n));
      setNote(lost.length ? `Revisa las cifras antes de añadirlo: en tu texto ponía ${lost.join(', ')} y no aparece igual en la versión redactada.` : '');
    } catch {
      setV(mine); setRaw(null); setNote('No se ha podido reescribir ahora. Puedes añadirlo tal como lo has escrito o intentarlo de nuevo.');
    } finally { setWriting(false); }
  };
  return (
    <Modal title={`Añadir: ${plan.title}`} sub={`Lo pide la sección «${s.title}». PROPO no se lo inventa: cuéntalo aquí y lo pongo en su sitio.`} onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Ahora no</button><button className="btn btn-primary" disabled={!v.trim() || busy || writing} onClick={submit}><LuCheck /> Añadir a la propuesta</button></>}>
      <div className="stack gap-16">
        <div className="fix-ask"><LuMessageCircle /><div><strong>Aporta la información para: {label.replace(/\.$/, '')}.</strong> {HINT[plan.kind] ?? 'Cuéntame lo que sepas sobre esto.'} Escríbelo con tus palabras, sin preocuparte de la redacción: luego pulsa «Reescribir con IA» y PROPO lo deja listo.</div></div>
        {plan.humanOnly && <div className="callout neutral small"><LuShieldCheck /><div>Los precios los decides tú. La IA solo mejora la redacción: no cambia ninguna cifra.</div></div>}
        <div className="field">
          <label htmlFor="fix-v">{raw != null ? 'Así quedará en la propuesta (puedes retocarlo)' : 'Tu explicación'}</label>
          <textarea id="fix-v" className="textarea" autoFocus rows={6} placeholder={plan.placeholder} value={v} readOnly={writing} onChange={(e) => setV(e.target.value)} />
          <div className="row-wrap mt-8">
            <button type="button" className="btn btn-secondary btn-sm" disabled={!(raw ?? v).trim() || writing} onClick={rewrite}>{writing ? <LuLoaderCircle className="spin" /> : <LuSparkles />} {writing ? 'Reescribiendo…' : raw != null ? 'Reescribir otra vez' : 'Reescribir con IA'}</button>
            {raw != null && !writing && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setV(raw); setRaw(null); setNote(''); }}><LuRotateCcw /> Volver a mi texto</button>}
          </div>
          {note && <p className="small mt-8" style={{ color: 'var(--warn-ink)' }}>{note}</p>}
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
