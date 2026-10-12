import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LuArrowRight, LuUpload, LuCheck, LuMapPin, LuShieldCheck, LuLoaderCircle, LuSparkles, LuRotateCcw, LuMessageCircle } from 'react-icons/lu';
import type { Project, Section } from '../../lib/types';
import { Modal } from '../../components/ui';
import { toast, getState } from '../../lib/store';
import { planFor, fillInfo, fillWithDocument, goAdd } from '../../lib/infoFix';
import { ACCEPTED } from '../../lib/pipeline/parse';
import { ai, aiState, getSample } from '../../lib/ai/provider';

interface Help { what: string; why: string; example: string }

/** Explicación general por tipo de dato: se enseña al instante y se queda si no hay IA. */
const HELP: Record<string, Help> = {
  price: {
    what: 'Escribe los precios que vas a ofertar, uno por uno: a qué corresponde cada precio, qué incluye, si lleva IVA o no y cualquier condición (mínimos, suplementos, descuentos).',
    why: 'El precio es lo que la administración compara entre empresas. Tiene que quedar claro y sin dudas, porque lo que pongas aquí te compromete.',
    example: 'Menú de adulto 8,90 € sin IVA, incluye primero, segundo, postre, pan y agua. Menú infantil 6,50 € sin IVA. Dietas especiales sin suplemento.',
  },
  experience: {
    what: 'Cuenta un trabajo parecido que ya hayas hecho: para qué cliente, en qué años, en qué consistía y cuánto se facturó más o menos.',
    why: 'La administración quiere comprobar que ya has hecho antes algo similar. Cuanto más se parezca al contrato y más concreto seas, más creíble resulta.',
    example: 'Comedor del colegio público de Sitges, de 2023 a 2025, unas 300 comidas al día, alrededor de 210.000 € al año.',
  },
  team: {
    what: 'Di quién va a ocuparse de esto: nombre, cargo, cuántos años lleva en el oficio y qué titulación o formación tiene.',
    why: 'El pliego valora que haya personas concretas y preparadas detrás del servicio, no solo el nombre de la empresa.',
    example: 'Marta Puig, jefa de cocina, 12 años de experiencia, técnica superior en dirección de cocina.',
  },
  certification: {
    what: 'Di qué certificado, sello o autorización tienes, qué entidad lo ha emitido y hasta qué fecha está vigente. Si no lo tienes, dilo tal cual.',
    why: 'Es la prueba de que cumples una norma. La administración puede pedirte el papel, así que solo vale lo que puedas enseñar.',
    example: 'ISO 22000 de seguridad alimentaria, emitida por Bureau Veritas, vigente hasta marzo de 2028.',
  },
  capability: {
    what: 'Explica con qué medios cuentas para esto (vehículos, locales, máquinas, proveedores…) y cómo lo hacéis en el día a día. Pon cantidades si las sabes.',
    why: 'Sirve para demostrar que tu empresa tiene de verdad lo necesario para hacer el trabajo, con datos y no con frases generales.',
    example: 'Tenemos 6 furgonetas de reparto: 4 eléctricas con etiqueta CERO y 2 híbridas con etiqueta ECO.',
  },
  revenue: {
    what: 'Escribe cuánto facturó tu empresa en cada uno de los tres últimos años. Vale una cifra aproximada; la exacta está en tus cuentas anuales o te la da tu gestoría.',
    why: 'La administración exige un mínimo de facturación para asegurarse de que la empresa puede asumir el contrato.',
    example: '2023: 1,4 millones de euros. 2024: 1,6 millones. 2025: 1,8 millones.',
  },
  employees: {
    what: 'Di cuántas personas trabajan en tu empresa y, si lo sabes, cuántas tienen contrato indefinido.',
    why: 'Da una idea del tamaño y la estabilidad de la empresa, y en algunos pliegos puntúa o desempata.',
    example: '34 personas en plantilla, 28 con contrato indefinido.',
  },
  document: {
    what: 'Di qué documento tienes, quién lo emite, su número o referencia si lo tiene, el importe que cubre y hasta cuándo es válido. También puedes subir el documento más abajo.',
    why: 'Es un papel obligatorio: si no consta, la administración puede dejar fuera la oferta.',
    example: 'Seguro de responsabilidad civil con Mapfre, póliza n.º 123456, cubre 600.000 €, vigente hasta diciembre de 2027.',
  },
  other: {
    what: 'Explica con tus palabras lo que sepas sobre este punto: qué hacéis, cómo lo hacéis y con qué datos concretos (cantidades, fechas, nombres).',
    why: 'Es un dato que la propuesta necesita y que solo tú conoces. PROPO no lo rellena por su cuenta para no inventarse nada.',
    example: '',
  },
};
HELP.company = { what: 'Escribe el dato tal como figura en los papeles oficiales de tu empresa (escrituras, tarjeta del NIF o facturas).', why: 'Identifica a tu empresa ante la administración y debe coincidir con la documentación que presentes.', example: '' };

const helpCache = new Map<string, Help>();

/** La frase de la propuesta donde irá el dato, con el hueco marcado. */
function gapSentence(content: string, tag: string): [string, string] | null {
  const i = content.indexOf(tag);
  if (i < 0) return null;
  const clean = (t: string) => t.replace(/\s?\[S\d+\]/g, '').replace(/\[(?:Información requerida|Information required):[^\]]*\]/g, '…').replace(/[#*|]/g, '').replace(/\s+/g, ' ');
  const before = content.slice(0, i), after = content.slice(i + tag.length);
  const from = Math.max(before.lastIndexOf('\n'), before.lastIndexOf('. ') + 1, 0);
  const ends = [after.indexOf('\n'), after.indexOf('. ')].filter((x) => x >= 0);
  const to = ends.length ? Math.min(...ends) + 1 : after.length;
  const a = clean(before.slice(from)).trimStart().slice(-180), b = clean(after.slice(0, to)).trimEnd().slice(0, 180);
  return a || b ? [a, b] : null;
}

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
  const gap = useMemo(() => gapSentence(s.content, tag), [s.content, tag]);
  const key = `${p.id}|${s.id}|${label}`;
  const [help, setHelp] = useState<Help>(helpCache.get(key) ?? HELP[plan.kind] ?? HELP.other);
  const [tailoring, setTailoring] = useState(false);
  useEffect(() => {
    if (helpCache.has(key)) return;
    let alive = true;
    (async () => {
      try {
        const sample = await getSample();
        if (!sample || aiState() === 'declined' || !alive) return;
        setTailoring(true);
        const crits = p.criteria.filter((c) => s.criteria.includes(c.id)).map((c) => `${c.name} (${c.points} puntos)`).join('; ');
        const company = getState().company;
        const j = await ai.json<Help>([
          'Eres PROPO, asistente de licitaciones públicas en España. A la propuesta de un cliente le falta un dato que solo él conoce. Explícale qué tiene que escribir.',
          'El cliente es dueño de una pyme: NO sabe de contratación pública ni de informática. Háblale de «tú», con palabras de la calle. Si usas un término técnico o unas siglas, explica entre paréntesis qué son.',
          'Responde SOLO con un objeto JSON con estas tres claves, en castellano de España:',
          '- "what": 2 o 3 frases cortas, máximo 330 caracteres. Qué tiene que escribir exactamente para ESTE dato: enumera los datos concretos que debe incluir (cantidades, nombres, fechas, unidades…) y dónde suele encontrarlos si no los sabe de memoria.',
          '- "why": 1 o 2 frases cortas, máximo 220 caracteres. Para qué sirve este dato en esta licitación y en esta sección. Menciona puntos solo si aparecen en el contexto y cítalos tal cual, sin calcular ni repartir.',
          '- "example": una respuesta de ejemplo de máximo 200 caracteres, realista para su sector e INVENTADA, escrita como la escribiría el cliente. No uses datos reales de su empresa.',
          'No inventes requisitos que no estén en el contexto. No prometas resultados.',
          '',
          `Licitación: ${p.name} (${p.organization || 'administración pública'})`,
          `Sector de la empresa: ${company.industry || 'no indicado'}`,
          `Sección de la propuesta: ${s.title}${s.guidance ? ` — ${s.guidance}` : ''}`,
          crits ? `Criterios que puntúan en esta sección: ${crits}` : '',
          `Dato que falta: ${label}`,
          gap ? `Frase de la propuesta donde irá: «${gap[0]} [AQUÍ VA EL DATO] ${gap[1]}»` : '',
        ].filter(Boolean).join('\n'), { tier: 'quick' });
        const ok = (x: unknown) => { const t = typeof x === 'string' ? x.trim() : ''; if (t.length <= 520) return t; const c = t.slice(0, 520); return c.slice(0, Math.max(c.lastIndexOf('. '), c.lastIndexOf('.
')) + 1) || c; };   // nunca se corta a media frase
        const h = { what: ok(j?.what), why: ok(j?.why), example: ok(j?.example) };
        if (!h.what) return;
        helpCache.set(key, h);
        if (alive) setHelp(h);
      } catch { /* se queda la explicación general */ } finally { if (alive) setTailoring(false); }
    })();
    return () => { alive = false; };
  }, [key]);
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
        <div className="fix-help">
          <div className="fix-help-head"><LuMessageCircle /><strong>Falta este dato: {label.replace(/\.$/, '')}</strong></div>
          {gap && <p className="fix-gap"><span className="lbl">Dónde irá en tu propuesta</span>«{gap[0]}<mark>tu dato</mark>{gap[1]}»</p>}
          <p><span className="lbl">Qué tienes que escribir</span>{help.what}</p>
          <p><span className="lbl">Para qué sirve</span>{help.why}</p>
          {help.example && <p><span className="lbl">Un ejemplo inventado, para que veas la forma</span><em>{help.example}</em></p>}
          <p className="xs muted">{tailoring ? 'PROPO está afinando esta explicación para tu licitación…' : 'Escríbelo con tus palabras, sin preocuparte de la redacción: luego pulsa «Reescribir con IA» y PROPO lo deja listo.'}</p>
        </div>
        {plan.humanOnly && <div className="callout neutral small"><LuShieldCheck /><div>Los precios los decides tú. La IA solo mejora la redacción: no cambia ninguna cifra.</div></div>}
        <div className="field">
          <label htmlFor="fix-v">{raw != null ? 'Así quedará en la propuesta (puedes retocarlo)' : 'Tu explicación'}</label>
          <textarea id="fix-v" className="textarea" autoFocus rows={6} placeholder="Escribe aquí, como se lo contarías a un compañero" value={v} readOnly={writing} onChange={(e) => setV(e.target.value)} />
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
