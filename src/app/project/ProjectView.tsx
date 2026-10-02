import React, { useEffect, useState } from 'react';
import { LuChevronRight, LuMessageSquare, LuCalendar, LuBuilding2, LuHash, LuEllipsis, LuTrash2, LuFileX, LuInfo, LuCpu } from 'react-icons/lu';
import { useStore, navigate, updateProject, toast } from '../../lib/store';
import { Empty, Menu, Modal, SampleBadge, Ring } from '../../components/ui';
import { StatusBadge, SourceViewerHost } from '../common';
import { readiness, reqCounts, deadlineLabel } from '../../lib/derive';
import { fmtDate, isUnknown } from '../../lib/util';
import { deleteProject } from '../../lib/actions';
import { Overview } from './Overview';
import { Requirements } from './Requirements';
import { Proposal } from './Proposal';
import { Criteria } from './Criteria';
import { Compliance } from './Compliance';
import { Package } from './Package';
import { Documents } from './Documents';
import { Chat } from './Chat';
import { Assistant } from './Assistant';
import { GuideBar } from './GuideBar';
import { pendingQuestions } from '../../lib/interview';

const TYPE_LABEL = { public_tender: 'Licitación pública', private_rfp: 'RFP privado', commercial: 'Propuesta comercial', other: 'Propuesta' };

export function ProjectView({ id, tab }: { id: string; tab: string }) {
  const p = useStore((s) => s.projects.find((x) => x.id === id));
  const companyName = useStore((s) => s.company.legalName);
  const demo = useStore((s) => s.demo);
  const [chat, setChat] = useState(() => { try { return sessionStorage.getItem('propo:chat') === '1'; } catch { return false; } });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editDeadline, setEditDeadline] = useState(false);
  useEffect(() => { try { sessionStorage.setItem('propo:chat', chat ? '1' : '0'); } catch { /* ignore */ } }, [chat]);
  useEffect(() => { if (p?.stage === 'analyzing') navigate(`/app/analyze/${p.id}`); }, [p?.stage]);
  if (!p) return <div className="page"><Empty icon={<LuFileX />} title="Proyecto no encontrado" body="Puede que se haya eliminado." action={<button className="btn btn-primary" onClick={() => navigate('/app/projects')}>Volver a mis proyectos</button>} /></div>;
  if (p.stage === 'failed') { navigate(`/app/analyze/${p.id}`); return null; }
  const rc = reqCounts(p);
  const tabs: [string, string, number?][] = [
    ['overview', 'Resumen'], ['assistant', 'PROPO te pregunta', pendingQuestions(p).length || undefined], ['requirements', 'Requisitos', rc.needs_info + rc.missing || undefined], ['proposal', 'Propuesta'], ['criteria', 'Criterios'],
    ['compliance', 'Cumplimiento'], ['package', 'Paquete'], ['documents', 'Documentos del pliego', p.docs.length],
  ];
  const r = readiness(p);
  const body = (() => {
    switch (tab) {
      case 'assistant': return <Assistant p={p} />;
      case 'requirements': return <Requirements p={p} />;
      case 'proposal': return <Proposal p={p} />;
      case 'criteria': return <Criteria p={p} />;
      case 'compliance': return <Compliance p={p} />;
      case 'package': return <Package p={p} />;
      case 'documents': return <Documents p={p} />;
      default: return <Overview p={p} />;
    }
  })();
  return (
    <div className={`proj-layout ${chat ? 'chat-open' : ''}`} style={{ height: '100%' }}>
      <div style={{ minWidth: 0, overflowY: 'auto', height: '100%' }} id="proj-scroll">
        <div className="proj-header">
          <div className="crumbs"><a onClick={() => navigate('/app/projects')}>Mis proyectos</a><LuChevronRight /><span className="truncate">{p.name}</span></div>
          {p.isSample && (!companyName || !/mesa viva/i.test(companyName)) && (
            <div className="callout neutral small" style={{ marginBottom: 14 }}><LuInfo /><div>Proyecto de ejemplo de una empresa ficticia (Mesa Viva Catering). Explóralo libremente: tus cambios se quedan en este navegador. Tus propuestas usarán tu perfil de empresa.</div></div>
          )}
          {p.id === 'p_sample' && demo === 'complete' && (
            <div className="callout small" style={{ marginBottom: 14 }}><LuInfo /><div><strong>Demo completa.</strong> Toda la documentación que faltaba ya está subida (documentos de ejemplo de una empresa ficticia, marcados «sin validez»), las preguntas de PROPO están respondidas y las 10 secciones aprobadas. Queda el último paso, que siempre hace una persona: <a style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${p.id}/compliance`)}>marcar la propuesta como lista</a> y <a style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/projects/${p.id}/package`)}>descargar el paquete</a>.</div></div>
          )}
          <div className="proj-title-row">
            <div style={{ minWidth: 0 }}>
              <div className="row-wrap"><h1>{p.name}</h1>{p.isSample && <SampleBadge />}<StatusBadge p={p} /></div>
              <div className="proj-meta">
                <span><LuBuilding2 />{p.organization || 'Organismo sin indicar'}</span>
                <span><LuHash />{TYPE_LABEL[p.type]}{!isUnknown(p.analysis?.reference) ? ` · ${p.analysis!.reference}` : ''}</span>
                <span><LuCalendar />{p.analysis?.deadline ? `${fmtDate(p.analysis.deadline)} · ${deadlineLabel(p.analysis.deadline)}` : <button className="link small" onClick={() => setEditDeadline(true)}>Añadir fecha límite</button>}</span>
                {p.analysis?.mode && <span title={p.analysis.mode === 'rules' ? 'Requisitos detectados con extracción básica por reglas' : undefined}><LuCpu />{p.analysis.mode === 'ai' ? 'Análisis con IA' : p.analysis.mode === 'rules' ? 'Extracción básica' : 'Análisis de ejemplo'}</span>}
              </div>
            </div>
            <div className="row">
              <div className="row" title="Preparación"><Ring value={r} size={40} stroke={4} tone={r >= 90 ? 'ok' : 'accent'} label={<span style={{ fontSize: 10.5 }}>{r}%</span>} /></div>
              <button className={`btn ${chat ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setChat(!chat)}><LuMessageSquare /> Pregunta a PROPO</button>
              <Menu trigger={(_, t) => <button className="btn btn-ghost btn-icon" aria-label="Acciones del proyecto" onClick={t}><LuEllipsis /></button>}>
                {(close) => (<>
                  <button className="menu-item" onClick={() => { close(); setEditDeadline(true); }}><LuCalendar />Editar fecha límite</button>
                  <button className="menu-item" style={{ color: 'var(--bad)' }} onClick={() => { close(); setConfirmDelete(true); }}><LuTrash2 />Eliminar proyecto</button>
                </>)}
              </Menu>
            </div>
          </div>
          <div className="tabs proj-tabs" role="tablist">
            {tabs.map(([k, l, n]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => navigate(`/app/projects/${p.id}${k === 'overview' ? '' : '/' + k}`)}>{l}{n ? <span className="count">{n}</span> : null}</button>
            ))}
          </div>
        </div>
        <div className="proj-body">{(!p.isSample || (p.id === 'p_sample' && demo === 'complete')) && <GuideBar p={p} tab={tab} />}{body}</div>
      </div>
      {chat && <Chat p={p} onClose={() => setChat(false)} />}
      <SourceViewerHost />
      {confirmDelete && (
        <Modal title="¿Eliminar este proyecto?" sub="Se eliminarán para siempre los documentos de la licitación, los requisitos y la propuesta redactada. Tu memoria de empresa no se ve afectada." onClose={() => setConfirmDelete(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancelar</button><button className="btn btn-danger" onClick={() => { deleteProject(p.id); toast('Proyecto eliminado'); navigate('/app/projects'); }}><LuTrash2 /> Eliminar proyecto</button></>}>
          <p className="muted">{p.name}</p>
        </Modal>
      )}
      {editDeadline && <DeadlineModal id={p.id} current={p.analysis?.deadline ?? null} onClose={() => setEditDeadline(false)} />}
    </div>
  );
}

function DeadlineModal({ id, current, onClose }: { id: string; current: string | null; onClose: () => void }) {
  const [v, setV] = useState(current ? current.slice(0, 10) : '');
  return (
    <Modal title="Fecha límite de presentación" onClose={onClose} footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" disabled={!v} onClick={() => { updateProject(id, (p) => { if (p.analysis) { p.analysis.deadline = new Date(v + 'T12:00:00').toISOString(); p.activity.unshift({ at: new Date().toISOString(), text: 'Fecha límite actualizada manualmente' }); } }); toast('Fecha límite guardada', 'ok'); onClose(); }}>Guardar</button></>}>
      <div className="field"><label htmlFor="dl">Fecha</label><input id="dl" type="date" className="input" value={v} onChange={(e) => setV(e.target.value)} /></div>
    </Modal>
  );
}
