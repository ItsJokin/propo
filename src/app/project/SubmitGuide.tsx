// «Presentar la oferta»: guía paso a paso de lo que hace el cliente fuera de PROPO (firmar y subir a la plataforma).
import React from 'react';
import { LuCheck, LuDownload, LuExternalLink, LuPenLine, LuShieldCheck, LuUpload, LuFileCheck, LuLoaderCircle, LuClock, LuArrowRight } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { updateProject, navigate, toast } from '../../lib/store';
import { Modal } from '../../components/ui';
import { complianceChecks, readiness } from '../../lib/derive';
import { fmtDate, nowIso } from '../../lib/util';

interface Platform { name: string; url: string; how: string }
/** Dónde se presenta la oferta, según de dónde salió la licitación. */
export function platformFor(p: Project): Platform {
  const url = p.tender?.live?.url ?? '';
  const host = (() => { try { return new URL(url).hostname; } catch { return ''; } })();
  if (/contrataciondelestado\.es/.test(host) || p.tender?.live?.src === 'placsp') return { name: 'Plataforma de Contratación del Sector Público', url: url || 'https://contrataciondelestado.es', how: 'Entra con el usuario de tu empresa, abre la licitación y pulsa «Preparar oferta». Se abre la herramienta de presentación: subes cada documento en su sobre, la herramienta firma los sobres con AutoFirma y al final te da un justificante.' };
  if (/contractaciopublica\.(gencat\.)?cat/.test(host)) return { name: 'Plataforma de Serveis de Contractació Pública (Sobre Digital)', url, how: 'En el anuncio, pulsa el enlace de «Sobre Digital» y date de alta con el correo de tu empresa. Recibirás un enlace para preparar cada sobre: subes los documentos, los cifras con la contraseña que elijas y envías la oferta.' };
  if (/comunidad\.madrid/.test(host)) return { name: 'Portal de Contratación de la Comunidad de Madrid', url, how: 'La oferta se presenta por la plataforma electrónica que indica el anuncio (normalmente la de Licitación Electrónica de la Comunidad). Entra con el certificado de la empresa y sube cada documento en su sobre.' };
  if (/euskadi\.eus/.test(host)) return { name: 'Plataforma de contratación de Euskadi', url, how: 'Entra con el certificado de la empresa en la licitación, pulsa «Presentar oferta» y sube cada documento en su sobre; la plataforma te pide firmar al enviar.' };
  if (/ted\.europa\.eu/.test(host)) return { name: 'La plataforma que indica el anuncio', url, how: 'Abre el anuncio: en el apartado de presentación de ofertas está el enlace a la plataforma del organismo. Allí subes cada documento en su sobre y firmas al enviar.' };
  if (url) return { name: 'La plataforma de la licitación', url, how: 'Abre la licitación y busca el botón o enlace de presentación de ofertas. Sube cada documento en su sobre y firma al enviar.' };
  return { name: 'Plataforma de Contratación del Sector Público', url: 'https://contrataciondelestado.es/wps/portal/licitaciones', how: 'Busca la licitación por su número de expediente en la plataforma donde se publicó (la mayoría están en la Plataforma de Contratación del Sector Público). Allí pulsas «Preparar oferta», subes cada documento en su sobre y firmas al enviar.' };
}

const STEPS = ['sub_review', 'sub_download', 'sub_sign', 'sub_upload'] as const;

export function SubmitGuide({ p, onClose, onDownload, busy }: { p: Project; onClose: () => void; onDownload: () => void; busy: boolean }) {
  const done = (k: string) => !!p.manualChecks[k];
  const mark = (k: string, v = !done(k)) => updateProject(p.id, (x) => { x.manualChecks[k] = v; });
  const fails = complianceChecks(p).filter((c) => c.state === 'fail').length;
  const r = readiness(p);
  const pl = platformFor(p);
  const deadline = p.analysis?.deadline ?? (p.tender?.deadline ? p.tender.deadline : null);
  const days = deadline ? Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000) : null;
  const ref = p.tender?.live?.ref || p.analysis?.reference || '';
  const next = STEPS.find((k) => !done(k)) ?? null;
  const submitted = done('submitted');
  const finish = () => {
    updateProject(p.id, (x) => { STEPS.forEach((k) => { x.manualChecks[k] = true; }); x.manualChecks.submitted = true; x.activity.unshift({ at: nowIso(), text: 'Oferta presentada en la plataforma de contratación' }); });
    toast('¡Enhorabuena! Hemos marcado la oferta como presentada.', 'ok');
  };
  const Step = ({ k, n, icon, title, children }: { k: typeof STEPS[number]; n: number; icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <li className={`sg-step${done(k) ? ' done' : ''}${next === k ? ' now' : ''}`}>
      <button className="sg-check" onClick={() => mark(k)} aria-pressed={done(k)} aria-label={done(k) ? `Desmarcar el paso ${n}` : `Marcar el paso ${n} como hecho`}>{done(k) ? <LuCheck /> : n}</button>
      <div className="sg-body">
        <div className="sg-title">{icon}{title}</div>
        {(next === k || !done(k)) && <div className="sg-text">{children}</div>}
      </div>
    </li>
  );
  return (
    <Modal wide title={submitted ? 'Oferta presentada' : 'Presentar la oferta'} sub={submitted ? 'La has marcado como presentada. Guarda el justificante de la plataforma por si lo necesitas.' : 'Cinco pasos. PROPO lo ha preparado todo: lo que queda es firmar y subirlo a la plataforma. Marca cada paso cuando lo hagas.'} onClose={onClose}
      footer={submitted
        ? <><button className="btn btn-ghost" onClick={() => mark('submitted', false)}>Desmarcar</button><button className="btn btn-primary" onClick={onClose}>Cerrar</button></>
        : <><button className="btn btn-ghost" onClick={onClose}>Seguir más tarde</button><button className="btn btn-primary" onClick={finish}><LuFileCheck /> Ya la he presentado</button></>}>
      {deadline && !submitted && (
        <div className={`sg-deadline${days != null && days <= 3 ? ' urgent' : ''}`}><LuClock />
          <div><strong>{days != null && days < 0 ? 'El plazo ya ha terminado' : `Plazo: ${fmtDate(deadline, { weekday: 'long', day: 'numeric', month: 'long' })}`}</strong>{days != null && days >= 0 && <> · {days === 0 ? 'es hoy' : days === 1 ? 'queda 1 día' : `quedan ${days} días`}</>}
            <div className="xs muted">No lo dejes para la última hora: las plataformas se saturan y subir y firmar los sobres puede llevar un buen rato.</div></div></div>
      )}
      <ol className="sg-steps">
        <Step k="sub_review" n={1} icon={<LuShieldCheck />} title="Comprueba que todo está listo">
          {fails ? <>Quedan <strong>{fails} {fails === 1 ? 'cosa' : 'cosas'}</strong> por resolver en la comprobación final. Conviene arreglarlas antes de presentar.<div className="mt-8"><button className="btn btn-secondary btn-sm" onClick={() => { onClose(); navigate(`/app/projects/${p.id}/compliance`); }}>Ir a la comprobación final <LuArrowRight /></button></div></>
            : <>La oferta está al {r} % y no hay nada que bloquee la presentación. Echa un último vistazo a la memoria y al precio.</>}
        </Step>
        <Step k="sub_download" n={2} icon={<LuDownload />} title="Descarga el paquete">
          Es un ZIP con una carpeta por sobre: así sabes qué va en cada uno. Descomprímelo en el escritorio (botón derecho → «Extraer todo»).
          <div className="mt-8"><button className="btn btn-secondary btn-sm" onClick={() => { onDownload(); mark('sub_download', true); }} disabled={busy}>{busy ? <LuLoaderCircle className="spin" /> : <LuDownload />} Descargar el paquete</button></div>
        </Step>
        <Step k="sub_sign" n={3} icon={<LuPenLine />} title="Firma los documentos">
          Los firma el representante legal de la empresa con su <strong>certificado digital</strong> (el de representante de la FNMT o el de tu gestoría) o con el DNI electrónico.
          <ul className="sg-list">
            <li>Instala <strong>AutoFirma</strong>, el programa gratuito del Gobierno para firmar PDF. <a href="https://firmaelectronica.gob.es/Home/Descargas.html" target="_blank" rel="noopener noreferrer">Descargar AutoFirma <LuExternalLink /></a></li>
            <li>Firma la memoria, las declaraciones, la oferta económica y los anexos. La carpeta «_No presentar» no se firma ni se sube.</li>
            <li>El DEUC se rellena en el servicio oficial copiando los datos del PDF que te da PROPO. <a href="https://visor.registrodelicitadores.gob.es/espd-web/filter?lang=es" target="_blank" rel="noopener noreferrer">Abrir el servicio DEUC <LuExternalLink /></a></li>
          </ul>
          <span className="xs muted">En muchas plataformas la firma se hace al enviar los sobres: si es así, puedes saltarte este paso.</span>
        </Step>
        <Step k="sub_upload" n={4} icon={<LuUpload />} title={`Súbela a ${pl.name}`}>
          {pl.how}
          {ref && <div className="xs muted mt-4">Número de expediente: <strong>{ref}</strong></div>}
          <div className="mt-8"><a className="btn btn-primary btn-sm" href={pl.url} target="_blank" rel="noopener noreferrer" onClick={() => mark('sub_upload', true)}>Abrir {p.tender?.live?.url ? 'la licitación' : 'la plataforma'} <LuExternalLink /></a></div>
          <div className="xs muted mt-8">Si es la primera vez, tendrás que registrar la empresa en la plataforma (se hace una sola vez y puede tardar un día).</div>
        </Step>
      </ol>
      <div className={`sg-final${submitted ? ' done' : ''}`}><span className="sg-check big">{submitted ? <LuCheck /> : 5}</span>
        <div><strong>Guarda el justificante</strong><div className="small muted">Al enviar, la plataforma te da un justificante de presentación con la fecha y la hora. Descárgalo y guárdalo: es la prueba de que presentaste a tiempo. Después pulsa «Ya la he presentado».</div></div></div>
    </Modal>
  );
}
