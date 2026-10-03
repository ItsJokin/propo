import React, { useState } from 'react';
import { LuDownload, LuEye, LuFileText, LuShieldCheck, LuCircleCheck, LuCircleAlert, LuInfo, LuLoaderCircle, LuExternalLink } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { useStore, navigate, toast, track } from '../../lib/store';
import { packageItems, buildPackageZip, technicalProposalPdf, declarationPdf, experiencePdf, companyIndexPdf, complianceReportPdf, type PkgStatus } from '../../lib/package';
import { PDFDocument } from 'pdf-lib';
import { Modal } from '../../components/ui';
import { technicalProposalDocx } from '../../lib/docx';
import { offerDownload } from '../../lib/services/download';
import { complianceChecks } from '../../lib/derive';
import { fmtDate } from '../../lib/util';

const ST: Record<PkgStatus, [string, string]> = { ready: ['ok', 'Listo'], draft: ['warn', 'Borrador'], manual: ['warn', 'Tu equipo'], pending: ['bad', 'Falta'], internal: ['', 'Interno'] };

export function Package({ p }: { p: Project }) {
  const s = useStore((x) => x);
  const items = packageItems(p, s);
  const [busy, setBusy] = useState(false);
  const fails = complianceChecks(p).filter((c) => c.state === 'fail').length;
  const download = async () => {
    setBusy(true);
    try {
      const zip = await buildPackageZip(p, s);
      const name = `${p.name.replace(/[^\p{L}\p{N}\- ]+/gu, '').trim() || 'Propuesta'} — paquete de presentación.zip`;
      const r = await offerDownload(name, zip);
      track('package_downloaded', { projectId: p.id, result: r });
      if (r === 'saved') toast('Paquete de presentación listo', 'ok');
      else if (r === 'declined') toast('Descarga cancelada');
      else toast('Las descargas no están disponibles en esta vista.', 'warn');
    } catch (e) {
      console.error(e);
      toast('No se ha podido generar el paquete. Inténtalo de nuevo.', 'bad');
    } finally { setBusy(false); }
  };
  const word = async () => {
    try {
      const r = await offerDownload(`${p.name.replace(/[^\p{L}\p{N}\- ]+/gu, '').trim() || 'Propuesta'} — memoria técnica.docx`, technicalProposalDocx(p, s));
      track('proposal_docx_downloaded', { projectId: p.id, result: r });
      if (r === 'saved') toast('Memoria técnica descargada en Word', 'ok');
      else if (r === 'unavailable') toast('Las descargas no están disponibles en esta vista.', 'warn');
    } catch (e) { console.error(e); toast('No se ha podido generar el documento. Inténtalo de nuevo.', 'bad'); }
  };
  // Vista previa de los PDF que genera PROPO, sin descargar el paquete.
  const [view, setView] = useState<{ name: string; url: string; pages: number } | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const GEN: Record<string, () => Promise<Uint8Array>> = {
    tech: () => technicalProposalPdf(p, s), decl: () => declarationPdf(p, s), exp: () => experiencePdf(p, s),
    company: () => companyIndexPdf(p, s), report: () => complianceReportPdf(p, s),
  };
  const preview = async (id: string, name: string) => {
    setOpening(id);
    try {
      const bytes = await GEN[id]();
      const pages = (await PDFDocument.load(bytes)).getPageCount();
      setView({ name, url: URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })), pages });
      track('package_preview', { projectId: p.id, doc: id, pages });
    } catch (e) { console.error(e); toast('No se ha podido generar la vista previa. Inténtalo de nuevo.', 'bad'); }
    finally { setOpening(null); }
  };
  const closeView = () => { if (view) URL.revokeObjectURL(view.url); setView(null); };
  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="row-wrap" style={{ justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div className="eyebrow">Paquete de presentación</div>
            <h2 className="mt-8" style={{ fontSize: 22 }}>{p.markedReady ? 'Listo para presentar' : 'Vista previa del paquete'}</h2>
            <p className="muted mt-4">{p.markedReady ? `Marcado como listo el ${fmtDate(p.markedReady)}.` : fails ? `${fails} incidencia${fails > 1 ? 's' : ''} de cumplimiento abierta${fails > 1 ? 's' : ''}. Puedes descargar un paquete en borrador cuando quieras.` : 'Todas las comprobaciones bloqueantes están superadas.'}</p>
          </div>
          <div className="row-wrap">
            <button className="btn btn-primary" onClick={download} disabled={busy}>{busy ? <LuLoaderCircle className="spin" /> : <LuDownload />} Descargar paquete de presentación</button>
            <button className="btn btn-secondary" onClick={word} disabled={!p.sections.length}><LuFileText /> Memoria en Word</button>
            {!p.markedReady && <button className="btn btn-secondary" onClick={() => navigate(`/app/projects/${p.id}/compliance`)}><LuShieldCheck /> Marcar como lista</button>}
          </div>
        </div>
      </div>
      <div className="card">
        {items.map((it) => (
          <div key={it.id} className="file-row">
            <span className={`file-ico ${it.ext}`}>{it.ext === 'other' ? 'ARCH' : it.ext.toUpperCase()}</span>
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="row"><span className="truncate" style={{ fontWeight: 500 }}>{it.name}</span></div>
              <div className="xs muted">{it.note}</div>
            </div>
            {it.status === 'ready' ? <LuCircleCheck className="state-ico ok" /> : it.status === 'internal' ? null : <LuCircleAlert className={`state-ico ${it.status === 'pending' ? 'bad' : 'warn'}`} />}
            <span className={`badge ${ST[it.status][0]} hide-sm`}>{ST[it.status][1]}</span>
            {!it.include && <span className="xs subtle hide-sm">No va en el ZIP</span>}
            {GEN[it.id] && <button className="btn btn-ghost btn-sm" onClick={() => preview(it.id, it.name)} disabled={!!opening}>{opening === it.id ? <LuLoaderCircle className="spin" /> : <LuEye />} Ver</button>}
          </div>
        ))}
      </div>
      {view && (
        <Modal wide title={view.name} sub={`${view.pages} ${view.pages === 1 ? 'página' : 'páginas'} · con el logo y el color de Empresa → Datos de empresa`} onClose={closeView}
          footer={<><button className="btn btn-ghost" onClick={() => { closeView(); navigate('/app/company/info'); }}>Cambiar logo y color</button><a className="btn btn-secondary" href={view.url} target="_blank" rel="noopener noreferrer">Abrir en una pestaña</a><button className="btn btn-primary" onClick={closeView}>Cerrar</button></>}>
          <iframe className="pdf-view" src={view.url} title={view.name} />
        </Modal>
      )}
      <div className="callout neutral small"><LuInfo /><div>PROPO no presenta ofertas. Descarga el paquete, firma los documentos con firma electrónica cualificada y preséntalos en la plataforma de contratación. <span className="subtle">La presentación automática está prevista donde sea legal y técnicamente posible.</span></div></div>
      <p className="xs subtle row"><LuExternalLink style={{ width: 12, height: 12 }} />El ZIP incluye los PDF generados, los documentos de empresa de tu biblioteca y los formularios del pliego por completar, además de un LÉEME con los pasos pendientes.</p>
    </div>
  );
}
