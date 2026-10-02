import React, { useRef, useState } from 'react';
import { LuChevronDown, LuChevronRight, LuSearch, LuBuilding2, LuFileText, LuUser, LuShieldAlert, LuTriangleAlert, LuUpload, LuRotateCcw, LuListChecks } from 'react-icons/lu';
import type { Project, Requirement, VaultCategory } from '../../lib/types';
import { getState, update, useStore, navigate, toast } from '../../lib/store';
import { updateRequirement, addVaultFiles } from '../../lib/actions';
import { ReqIcon, REQ_LABEL, REQ_TONE, SourceChip, Modal, Empty } from '../../components/ui';
import { openSource } from '../common';
import { reqCounts } from '../../lib/derive';
import { uid, fmtShort, nowIso } from '../../lib/util';
import { ACCEPTED } from '../../lib/pipeline/parse';

const CATS: Record<string, string> = { administrative: 'Administrativo', technical: 'Técnico', financial: 'Económico', experience: 'Experiencia', certification: 'Certificación', format: 'Formato y presentación', legal: 'Legal', team: 'Equipo' };
const ACTION_LABEL: Record<string, string> = { 'Add project': 'Añadir proyecto', 'Skip': 'Omitir', 'Upload document': 'Subir documento', 'Mark as resolved': 'Marcar como resuelto', 'Add certification': 'Añadir certificación', 'Add information': 'Añadir información', 'Confirm': 'Confirmar', 'Assign signer': 'Asignar firmante', 'Open financial offer': 'Ir a la oferta económica', 'Add team member': 'Añadir persona al equipo' };

function vaultCategoryFor(r: Requirement): VaultCategory {
  if (r.category === 'certification') return 'certificate';
  if (r.category === 'financial') return /insurance|seguro/i.test(r.text) ? 'insurance' : 'financial';
  if (r.category === 'experience') return 'experience';
  if (r.category === 'team') return 'team';
  return 'corporate';
}

type ActionModal = { kind: string; req: Requirement } | null;

export function Requirements({ p }: { p: Project }) {
  const rc = reqCounts(p);
  const [filter, setFilter] = useState<'all' | 'open' | 'fulfilled' | 'needs_info' | 'missing'>(rc.needs_info + rc.missing ? 'open' : 'all');
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(p.requirements.find((r) => r.status === 'needs_info' || r.status === 'missing')?.id ?? null);
  const [modal, setModal] = useState<ActionModal>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadFor = useRef<Requirement | null>(null);
  const user = useStore((s) => s.user);

  const list = p.requirements.filter((r) => {
    if (filter === 'open' && !(r.status === 'needs_info' || r.status === 'missing')) return false;
    if (filter !== 'all' && filter !== 'open' && r.status !== filter) return false;
    if (cat && r.category !== cat) return false;
    return !q || (r.title + r.text).toLowerCase().includes(q.toLowerCase());
  });
  const pct = (n: number) => (rc.total ? (n / rc.total) * 100 : 0);

  const resolve = (r: Requirement, evidence: Requirement['evidence'][number], activity: string) => {
    updateRequirement(p.id, r.id, { status: 'fulfilled', evidence: [...r.evidence, evidence], humanValidated: true, ask: undefined, actions: undefined }, activity);
    toast('Requisito cumplido', 'ok');
  };

  const act = (r: Requirement, a: string) => {
    switch (a) {
      case 'Skip':
        updateRequirement(p.id, r.id, { status: 'skipped' }, `Omitido: ${r.title}`);
        toast(r.mandatory ? 'Omitido. Los requisitos obligatorios omitidos siguen visibles en el control de cumplimiento.' : 'Omitido');
        break;
      case 'Upload document':
        uploadFor.current = r; fileInput.current?.click(); break;
      case 'Open financial offer':
        navigate(`/app/projects/${p.id}/compliance`); break;
      default:
        setModal({ kind: a, req: r });
    }
  };

  const onFiles = async (files: FileList | null) => {
    const r = uploadFor.current;
    if (!files?.length || !r) return;
    toast('Leyendo documento…');
    const res = await addVaultFiles(Array.from(files), vaultCategoryFor(r));
    if (!res.added) { toast(res.failed[0]?.note ?? 'No se ha podido añadir el archivo', 'bad'); return; }
    const added = getState().vault.slice(0, res.added);
    updateRequirement(p.id, r.id, { status: 'fulfilled', evidence: [...r.evidence, ...added.map((v) => ({ kind: 'vault' as const, label: v.name, ref: v.id }))], humanValidated: true, ask: undefined, actions: undefined }, `${added[0].name} subido para «${r.title}»`);
    toast(`${added[0].name} guardado en tus documentos y vinculado`, 'ok');
    if (res.failed.length) toast(res.failed[0].note, 'warn');
  };

  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <div className="row"><h3 style={{ fontSize: 17 }}>Requisitos</h3><span className="small subtle">{rc.total} en total</span></div>
          <div className="row-wrap small">
            <span className="row"><span className="dot ok" /><strong className="num">{rc.fulfilled}</strong> cumplidos</span>
            <span className="row"><span className="dot warn" /><strong className="num">{rc.needs_info}</strong> necesitan información</span>
            <span className="row"><span className="dot bad" /><strong className="num">{rc.missing}</strong> faltan</span>
            {rc.skipped > 0 && <span className="row"><span className="dot" /><strong className="num">{rc.skipped}</strong> omitidos</span>}
          </div>
        </div>
        <div className="stackbar mt-16" aria-hidden="true">
          <span style={{ width: `${pct(rc.fulfilled)}%`, background: 'var(--ok)' }} />
          <span style={{ width: `${pct(rc.needs_info)}%`, background: 'var(--warn)' }} />
          <span style={{ width: `${pct(rc.missing)}%`, background: 'var(--bad)' }} />
          <span style={{ width: `${pct(rc.skipped)}%`, background: 'var(--border-strong)' }} />
        </div>
      </div>

      <div className="req-toolbar">
        <div className="seg">
          {([['open', 'Requieren atención'], ['all', 'Todos'], ['fulfilled', 'Cumplidos'], ['needs_info', 'Falta información'], ['missing', 'Faltan']] as const).map(([k, l]) => <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>)}
        </div>
        <select className="select" style={{ width: 190, height: 34 }} aria-label="Categoría" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {Object.entries(CATS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <label className="search" style={{ width: 240, display: 'flex' }}><LuSearch /><input aria-label="Buscar requisitos" placeholder="Buscar requisitos" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      </div>

      <div className="card">
        {list.length === 0 ? (
          filter === 'open' ? <Empty icon={<LuListChecks />} title="No hay nada pendiente" body="Todos los requisitos están cumplidos u omitidos. El siguiente paso es el control de cumplimiento." action={<button className="btn btn-primary" onClick={() => navigate(`/app/projects/${p.id}/compliance`)}>Abrir control de cumplimiento</button>} />
            : <Empty icon={<LuSearch />} title="Ningún requisito coincide" body="Prueba con otro filtro." />
        ) : list.map((r) => {
          const isOpen = open === r.id;
          return (
            <React.Fragment key={r.id}>
              <div className={`req-item ${isOpen ? 'open' : ''}`} onClick={() => setOpen(isOpen ? null : r.id)} role="button" tabIndex={0} aria-expanded={isOpen} onKeyDown={(e) => { if (e.key === 'Enter') setOpen(isOpen ? null : r.id); }}>
                <ReqIcon status={r.status} />
                <div style={{ minWidth: 0 }}>
                  <div className="req-title">{r.title}</div>
                  <div className="req-sub">
                    <span>{CATS[r.category]}</span>
                    <span>{r.source.docName.replace(/\.(pdf|docx|xlsx)$/i, '')} · p. {r.source.page}</span>
                    {r.critical && <span className="row" style={{ gap: 4 }}><LuShieldAlert style={{ width: 12, height: 12 }} />Validación humana</span>}
                    {r.uncertain && <span className="row" style={{ gap: 4, color: 'var(--warn)' }}><LuTriangleAlert style={{ width: 12, height: 12 }} />Extracción dudosa</span>}
                  </div>
                </div>
                <div className="row">
                  <span className={`badge ${REQ_TONE[r.status]} hide-sm`}>{REQ_LABEL[r.status]}</span>
                  {isOpen ? <LuChevronDown style={{ width: 16, height: 16, color: 'var(--fg-3)' }} /> : <LuChevronRight style={{ width: 16, height: 16, color: 'var(--fg-3)' }} />}
                </div>
              </div>
              {isOpen && (
                <div className="req-detail">
                  <div className="row-wrap"><span className="small muted">Estado:</span><span className={`badge ${REQ_TONE[r.status]}`}>{REQ_LABEL[r.status]}</span>{r.mandatory ? <span className="badge outline">Obligatorio</span> : <span className="badge outline">Opcional</span>}{r.humanValidated && <span className="badge ok">Validado por tu equipo</span>}</div>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 8 }}>Requisito</div>
                    <div className="quote">“{r.text}”</div>
                    <div className="row-wrap mt-8">
                      <SourceChip label={`Fuente: ${r.source.docName} — Página ${r.source.page}${r.source.clause ? ` · ${r.source.clause}` : ''}`} onClick={() => openSource({ project: p, docId: r.source.docId, page: r.source.page, quote: r.text })} />
                      {r.uncertain && <span className="xs" style={{ color: 'var(--warn)' }}>La cita no coincide literalmente con esta página. Comprueba la fuente.</span>}
                    </div>
                  </div>
                  {r.evidence.length > 0 && (
                    <div>
                      <div className="eyebrow" style={{ marginBottom: 8 }}>Pruebas</div>
                      <div className="evidence">{r.evidence.map((e, i) => <span key={i} className="ev">{e.kind === 'vault' ? <LuFileText /> : e.kind === 'user' ? <LuUser /> : <LuBuilding2 />}{e.label}</span>)}</div>
                    </div>
                  )}
                  {(r.status === 'needs_info' || r.status === 'missing') && r.ask && (
                    <div className="ask-box">
                      <div className="who">PROPO pregunta</div>
                      <div>{r.ask}</div>
                      <div className="row-wrap">
                        {(r.actions ?? ['Add information', 'Skip']).map((a, i) => <button key={a} className={`btn btn-sm ${i === 0 ? 'btn-primary' : a === 'Skip' ? 'btn-ghost' : 'btn-secondary'}`} onClick={() => act(r, a)}>{a === 'Upload document' && <LuUpload />}{ACTION_LABEL[a] ?? a}</button>)}
                        {!(r.actions ?? []).includes('Mark as resolved') && <button className="btn btn-ghost btn-sm" onClick={() => setModal({ kind: 'Mark as resolved', req: r })}>Marcar como resuelto</button>}
                      </div>
                    </div>
                  )}
                  {(r.status === 'fulfilled' || r.status === 'skipped') && (
                    <div className="row"><button className="btn btn-ghost btn-sm" onClick={() => updateRequirement(p.id, r.id, { status: 'needs_info', ask: r.ask ?? 'Reabierto para revisión.', actions: r.actions ?? ['Add information', 'Skip'], humanValidated: false }, `Reabierto: ${r.title}`)}><LuRotateCcw /> Reabrir</button>{r.critical && !r.humanValidated && r.status === 'fulfilled' && <button className="btn btn-secondary btn-sm" onClick={() => { updateRequirement(p.id, r.id, { humanValidated: true }, `Validado: ${r.title}`); toast('Validado', 'ok'); }}>Validar</button>}</div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <input ref={fileInput} type="file" hidden accept={ACCEPTED} onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }} />
      {modal && <ActionModal p={p} m={modal} userName={user?.name ?? 'tu equipo'} onClose={() => setModal(null)} resolve={resolve} />}
    </div>
  );
}

function ActionModal({ p, m, userName, onClose, resolve }: { p: Project; m: NonNullable<ActionModal>; userName: string; onClose: () => void; resolve: (r: Requirement, e: Requirement['evidence'][number], a: string) => void }) {
  const r = m.req;
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [c, setC] = useState(''); const [d, setD] = useState('');
  const [chk, setChk] = useState(false);
  const today = fmtShort(nowIso());
  let title = ACTION_LABEL[m.kind] ?? m.kind; let body: React.ReactNode = null; let ok = () => {}; let valid = true; let okLabel = 'Guardar';
  switch (m.kind) {
    case 'Add project': {
      title = 'Añadir un proyecto previo';
      valid = !!a.trim();
      body = (<div className="stack">
        <p className="small muted">Se guarda en tu perfil de empresa y se reutiliza en próximas propuestas.</p>
        <div className="field"><label htmlFor="ap-t">Proyecto</label><input id="ap-t" className="input" value={a} onChange={(e) => setA(e.target.value)} /></div>
        <div className="grid-2"><div className="field"><label htmlFor="ap-c">Cliente</label><input id="ap-c" className="input" value={b} onChange={(e) => setB(e.target.value)} /></div><div className="field"><label htmlFor="ap-y">Años</label><input id="ap-y" className="input" placeholder="2021–2024" value={c} onChange={(e) => setC(e.target.value)} /></div></div>
        <div className="field"><label htmlFor="ap-v">Importe anual</label><input id="ap-v" className="input" placeholder="500.000 € / año" value={d} onChange={(e) => setD(e.target.value)} /></div>
        <label className="row small"><input type="checkbox" checked={chk} onChange={(e) => setChk(e.target.checked)} /> Tenemos certificado de buena ejecución de este proyecto</label>
      </div>);
      ok = () => {
        const id = uid('pp');
        update((s) => { s.pastProjects.push({ id, title: a.trim(), client: b.trim(), years: c.trim(), value: d.trim(), sector: s.company.industry, description: '', hasCertificate: chk }); });
        const need = parseInt(r.text.match(/at least (\d+)|al menos (\d+)|m[ií]nimo (?:de )?(\d+)/i)?.slice(1).find(Boolean) || '3');
        const ev = [...r.evidence, { kind: 'company' as const, label: `${a.trim()}${d ? ' — ' + d.trim() : ''}`, ref: id }];
        const count = ev.filter((e) => e.kind === 'company' && e.ref?.startsWith('pp')).length;
        updateRequirement(p.id, r.id, count >= need ? { status: 'fulfilled', evidence: ev, humanValidated: true, ask: undefined, actions: undefined } : { evidence: ev, ask: `${count} de ${need} proyectos similares acreditados. Añade otro proyecto.` }, `Proyecto «${a.trim()}» añadido como experiencia`);
        toast(count >= need ? 'Requisito cumplido' : 'Proyecto añadido', 'ok');
      };
      break;
    }
    case 'Add certification': {
      title = 'Añadir certificación';
      valid = !!a.trim();
      body = (<div className="stack">
        <div className="field"><label htmlFor="ac-n">Certificación</label><input id="ac-n" className="input" placeholder="p. ej. FSSC 22000" value={a} onChange={(e) => setA(e.target.value)} /></div>
        <div className="grid-2"><div className="field"><label htmlFor="ac-i">Entidad certificadora</label><input id="ac-i" className="input" value={b} onChange={(e) => setB(e.target.value)} /></div><div className="field"><label htmlFor="ac-v">Válida hasta</label><input id="ac-v" type="date" className="input" value={c} onChange={(e) => setC(e.target.value)} /></div></div>
        <p className="xs subtle">Sube el certificado en Empresa → Certificaciones para que se adjunte al paquete.</p>
      </div>);
      ok = () => { const id = uid('c'); update((s) => { s.certifications.push({ id, name: a.trim(), issuer: b.trim(), validUntil: c, category: 'industry' }); }); resolve(r, { kind: 'company', label: a.trim(), ref: id }, `Certificación ${a.trim()} añadida`); };
      break;
    }
    case 'Add team member': {
      title = 'Añadir persona al equipo';
      valid = !!a.trim() && !!b.trim();
      body = (<div className="stack">
        <div className="grid-2"><div className="field"><label htmlFor="at-n">Nombre</label><input id="at-n" className="input" value={a} onChange={(e) => setA(e.target.value)} /></div><div className="field"><label htmlFor="at-r">Función</label><input id="at-r" className="input" value={b} onChange={(e) => setB(e.target.value)} /></div></div>
        <div className="field"><label htmlFor="at-y">Años de experiencia</label><input id="at-y" type="number" min="0" className="input" value={c} onChange={(e) => setC(e.target.value)} /></div>
      </div>);
      ok = () => { const id = uid('t'); update((s) => { s.team.push({ id, name: a.trim(), role: b.trim(), years: parseInt(c) || 0, qualifications: '' }); }); resolve(r, { kind: 'company', label: `${a.trim()} — ${b.trim()}`, ref: id }, `${a.trim()} asignado`); };
      break;
    }
    case 'Assign signer': {
      title = '¿Quién firma la oferta?';
      valid = !!a.trim() && chk;
      body = (<div className="stack">
        <div className="field"><label htmlFor="as-n">Representante legal</label><input id="as-n" className="input" value={a} onChange={(e) => setA(e.target.value)} /></div>
        <label className="row small"><input type="checkbox" checked={chk} onChange={(e) => setChk(e.target.checked)} /> Tiene un certificado de firma electrónica cualificada en vigor</label>
      </div>);
      ok = () => { resolve(r, { kind: 'user', label: `Firmante: ${a.trim()} (confirmado el ${today})` }, `Firmante asignado: ${a.trim()}`); update((s) => { const x = s.projects.find((y) => y.id === p.id); if (x) x.manualChecks.signature = true; }); };
      break;
    }
    case 'Confirm': {
      title = 'Confirmar requisito';
      valid = chk;
      body = (<div className="stack">
        <div className="quote small">“{r.text}”</div>
        <label className="row small" style={{ alignItems: 'flex-start' }}><input type="checkbox" checked={chk} onChange={(e) => setChk(e.target.checked)} style={{ marginTop: 3 }} /> Confirmo que nuestra empresa cumple este requisito y puede acreditarlo si se le pide.</label>
        <div className="field"><label htmlFor="cf-n">Nota (opcional)</label><input id="cf-n" className="input" value={a} onChange={(e) => setA(e.target.value)} /></div>
      </div>);
      okLabel = 'Confirmar';
      ok = () => resolve(r, { kind: 'user', label: `Confirmado por ${userName} el ${today}${a ? ' — ' + a : ''}` }, `Confirmado: ${r.title}`);
      break;
    }
    case 'Mark as resolved': {
      title = 'Marcar como resuelto';
      valid = !!a.trim();
      body = (<div className="stack"><p className="small muted">Explica cómo se ha resuelto, para tu equipo y el registro de actividad.</p><textarea className="textarea" aria-label="Resolución" value={a} onChange={(e) => setA(e.target.value)} /></div>);
      ok = () => resolve(r, { kind: 'user', label: `${a.trim()} (${userName}, ${today})` }, `Resuelto: ${r.title}`);
      break;
    }
    default: {
      title = 'Añadir información';
      valid = !!a.trim();
      body = (<div className="stack">
        <div className="ask-box"><div className="who">PROPO pregunta</div><div>{r.ask}</div></div>
        <div className="field"><label htmlFor="ai-t">Tu respuesta</label><textarea id="ai-t" className="textarea" value={a} onChange={(e) => setA(e.target.value)} /></div>
        <p className="xs subtle">PROPO usará tu respuesta como fuente de empresa al redactar la propuesta.</p>
      </div>);
      ok = () => resolve(r, { kind: 'user', label: a.trim() }, `Información añadida: ${r.title}`);
    }
  }
  return (
    <Modal title={title} sub={r.title} onClose={onClose} footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" disabled={!valid} onClick={() => { ok(); onClose(); }}>{okLabel}</button></>}>
      {body}
    </Modal>
  );
}
