import React, { useState } from 'react';
import { LuCircleCheck, LuCircleAlert, LuCircleX, LuArrowRight, LuShieldCheck, LuInfo } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { complianceChecks, readiness } from '../../lib/derive';
import { Ring, Modal } from '../../components/ui';
import { navigate, updateProject, toast, useStore } from '../../lib/store';
import { markReady } from '../../lib/actions';
import { nowIso, fmtDate } from '../../lib/util';

export function Compliance({ p }: { p: Project }) {
  const checks = complianceChecks(p);
  const r = readiness(p);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [manual, setManual] = useState<string | null>(null);
  const [confirmReady, setConfirmReady] = useState(false);
  const fails = checks.filter((c) => c.state === 'fail');
  const warns = checks.filter((c) => c.state === 'warn');
  const shown = onlyOpen ? checks.filter((c) => c.state !== 'pass') : checks;
  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="row-wrap gap-20" style={{ alignItems: 'center' }}>
          <Ring value={r} size={96} stroke={8} tone={r >= 90 ? 'ok' : 'accent'} label={<span style={{ fontSize: 22 }}>{r}%</span>} />
          <div className="grow" style={{ minWidth: 220 }}>
            <div className="eyebrow">Control de cumplimiento final</div>
            <h2 className="mt-8" style={{ fontSize: 24 }}>{p.markedReady ? 'Marcada como lista para presentar' : `${r}% lista`}</h2>
            <p className="muted mt-4">{p.markedReady ? `Marcada como lista el ${fmtDate(p.markedReady)}. La presentación la hace tu equipo en la plataforma de contratación.` : fails.length ? `Hay que resolver ${fails.length} incidencia${fails.length > 1 ? 's' : ''} y revisar ${warns.length} punto${warns.length === 1 ? '' : 's'} antes de presentar.` : warns.length ? `No hay incidencias bloqueantes. Quedan ${warns.length} punto${warns.length > 1 ? 's' : ''} por revisar.` : 'Todo correcto. Revisa el paquete y márcalo como listo.'}</p>
          </div>
          <div className="row-wrap">
            {(fails.length > 0 || warns.length > 0) && <button className="btn btn-secondary" onClick={() => setOnlyOpen(!onlyOpen)}>{onlyOpen ? 'Ver todas las comprobaciones' : 'Revisar incidencias pendientes'}</button>}
            {!p.markedReady && <button className="btn btn-primary" onClick={() => setConfirmReady(true)} disabled={fails.length > 0} title={fails.length ? 'Resuelve antes las incidencias bloqueantes' : undefined}><LuShieldCheck /> Marcar como lista</button>}
          </div>
        </div>
      </div>
      <div className="card">
        {shown.map((c) => (
          <div key={c.id} className="check">
            {c.state === 'pass' ? <LuCircleCheck className="state-ico ok" /> : c.state === 'warn' ? <LuCircleAlert className="state-ico warn" /> : <LuCircleX className="state-ico bad" />}
            <div style={{ minWidth: 0 }}><div className="check-title">{c.label}</div><div className="small muted">{c.detail}</div></div>
            <div>{c.action && (c.action.manual
              ? <button className="btn btn-secondary btn-sm" onClick={() => setManual(c.action!.manual!)}>{c.action.label}</button>
              : <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/app/projects/${p.id}/${c.action!.tab}`)}>{c.action.label} <LuArrowRight /></button>)}</div>
          </div>
        ))}
      </div>
      <div className="callout neutral small"><LuInfo /><div>PROPO comprueba todo lo que se puede comprobar automáticamente. La firma, los precios y la presentación final en la plataforma de contratación los hace siempre tu equipo.</div></div>
      {manual === 'signature' && <SignatureModal p={p} onClose={() => setManual(null)} />}
      {manual === 'financialApproved' && <FinancialModal p={p} onClose={() => setManual(null)} />}
      {confirmReady && (
        <Modal title="¿Marcar como lista para presentar?" onClose={() => setConfirmReady(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setConfirmReady(false)}>Cancelar</button><button className="btn btn-primary" onClick={() => { markReady(p.id); setConfirmReady(false); toast('Marcada como lista para presentar', 'ok'); navigate(`/app/projects/${p.id}/package`); }}>Marcar como lista</button></>}>
          <p className="muted">Queda registrado que tu equipo ha revisado la propuesta. PROPO no la presenta: descarga el paquete y preséntalo en la plataforma de contratación antes de la fecha límite.</p>
          {warns.length > 0 && <div className="callout warn small mt-16"><LuCircleAlert /><div>Quedan {warns.length} punto{warns.length > 1 ? 's' : ''} por revisar: {warns.map((w) => w.label).join(', ')}.</div></div>}
        </Modal>
      )}
    </div>
  );
}

function SignatureModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const [name, setName] = useState('');
  const [ok, setOk] = useState(false);
  return (
    <Modal title="Confirma el firmante" sub="Los documentos de la licitación debe firmarlos el representante legal." onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" disabled={!name.trim() || !ok} onClick={() => { updateProject(p.id, (x) => { x.manualChecks.signature = true; x.activity.unshift({ at: nowIso(), text: `Firmante confirmado: ${name.trim()}` }); }); toast('Firmante confirmado', 'ok'); onClose(); }}>Confirmar</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="sg-n">Representante legal</label><input id="sg-n" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <label className="row small" style={{ alignItems: 'flex-start' }}><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} style={{ marginTop: 3 }} /> Tiene firma electrónica cualificada en vigor y firmará todos los sobres.</label>
      </div>
    </Modal>
  );
}

function FinancialModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const user = useStore((s) => s.user);
  const [ok, setOk] = useState(false);
  const [ok2, setOk2] = useState(false);
  const priceReq = p.requirements.filter((r) => /price|precio|economic offer|oferta econ/i.test(r.title + ' ' + r.text));
  return (
    <Modal title="Aprobar la oferta económica" sub="PROPO nunca fija ni sugiere precios. Esto registra la aprobación de tu equipo." onClose={onClose}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" disabled={!ok || !ok2} onClick={() => { updateProject(p.id, (x) => { x.manualChecks.financialApproved = true; x.activity.unshift({ at: nowIso(), text: `Oferta económica aprobada por ${user?.name ?? 'tu equipo'}` }); }); toast('Oferta económica aprobada', 'ok'); onClose(); }}>Aprobar oferta económica</button></>}>
      <div className="stack">
        {priceReq.length > 0 && (
          <div className="well small stack" style={{ gap: 6 }}>
            <strong>Reglas de precio encontradas en el pliego</strong>
            {priceReq.map((r) => <div key={r.id}>· {r.text} <span className="xs subtle">({r.source.docName}, p. {r.source.page})</span></div>)}
          </div>
        )}
        <label className="row small" style={{ alignItems: 'flex-start' }}><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} style={{ marginTop: 3 }} /> Nuestros precios los ha fijado y revisado nuestro equipo, en el modelo que exige el pliego.</label>
        <label className="row small" style={{ alignItems: 'flex-start' }}><input type="checkbox" checked={ok2} onChange={(e) => setOk2(e.target.checked)} style={{ marginTop: 3 }} /> La oferta respeta los precios máximos y va solo en el sobre de precio.</label>
      </div>
    </Modal>
  );
}
