import React, { useState } from 'react';
import { LuUser, LuUsers, LuCreditCard, LuBell, LuShieldCheck, LuPlus, LuDownload, LuTrash2, LuInfo, LuReceipt, LuExternalLink, LuTriangleAlert, LuRotateCcw } from 'react-icons/lu';
import { useStore, update, navigate, toast, resetAll, getState, track } from '../lib/store';
import { Modal, Toggle, Bar, Empty } from '../components/ui';
import { PLANS } from '../lib/plans';
import { billing } from '../lib/services/billing';
import { UpgradeModal } from './common';
import { fmtDate, daysUntil, uid, timeAgo } from '../lib/util';
import { offerDownload } from '../lib/services/download';
import { subscriptionActive } from '../lib/actions';

const TABS: [string, string, React.ReactNode][] = [
  ['account', 'Cuenta', <LuUser />], ['team', 'Equipo', <LuUsers />], ['billing', 'Facturación', <LuCreditCard />],
  ['notifications', 'Notificaciones', <LuBell />], ['privacy', 'Privacidad y datos', <LuShieldCheck />],
];

export function Settings({ tab }: { tab: string }) {
  return (
    <>
      <div className="page-head"><div><h1>Ajustes</h1><p>Tu cuenta, tu equipo, tu suscripción y tus datos.</p></div></div>
      <div className="two-col">
        <nav className="subnav" aria-label="Secciones de ajustes">
          {TABS.map(([k, l, ic]) => <button key={k} className={`nav-item ${tab === k ? 'on' : ''}`} onClick={() => navigate(`/app/settings/${k}`)}>{ic}{l}</button>)}
        </nav>
        <div style={{ minWidth: 0 }}>
          {tab === 'account' && <Account />}
          {tab === 'team' && <Team />}
          {tab === 'billing' && <Billing />}
          {tab === 'notifications' && <NotifPrefs />}
          {tab === 'privacy' && <Privacy />}
        </div>
      </div>
    </>
  );
}

function Account() {
  const u = useStore((s) => s.user)!;
  const settings = useStore((s) => s.settings);
  const [f, setF] = useState({ name: u.name, email: u.email, role: u.role });
  return (
    <div className="stack gap-20">
      <div className="card">
        <div className="card-head"><h3>Perfil</h3></div>
        <div className="card-body stack">
          <div className="grid-2">
            <div className="field"><label htmlFor="ac-n">Nombre</label><input id="ac-n" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div className="field"><label htmlFor="ac-r">Cargo</label><input id="ac-r" className="input" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></div>
          </div>
          <div className="field"><label htmlFor="ac-e">Correo electrónico</label><input id="ac-e" className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><button className="btn btn-primary" onClick={() => { update((s) => { s.user = { ...s.user!, ...f }; const m = s.members.find((x) => x.id === s.user!.id); if (m) { m.name = f.name; m.email = f.email; } }); toast('Perfil guardado', 'ok'); }}>Guardar</button></div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Idioma de las propuestas</h3></div>
        <div className="card-body row-wrap">
          <select className="select" style={{ width: 220 }} aria-label="Idioma de redacción" value={settings.language} onChange={(e) => update((s) => { s.settings.language = e.target.value; })}>{['Español', 'Catalán', 'Inglés', 'Francés', 'Portugués', 'Italiano', 'Alemán', 'Euskera', 'Gallego'].map((l) => <option key={l}>{l}</option>)}</select>
          <span className="small muted">Idioma por defecto de las secciones redactadas. PROPO puede leer pliegos en cualquiera de estos idiomas.</span>
        </div>
      </div>
    </div>
  );
}

function Team() {
  const members = useStore((s) => s.members);
  const plan = useStore((s) => PLANS[s.subscription.plan]);
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'reviewer' | 'admin'>('editor');
  const full = members.length >= plan.seats;
  return (
    <div className="card">
      <div className="card-head"><h3>Equipo</h3><span className="mono xs subtle">{members.length} de {plan.seats >= 999 ? 'ilimitados' : plan.seats} usuarios</span><span className="spacer" /><button className="btn btn-secondary btn-sm" onClick={() => setInvite(true)}><LuPlus /> Invitar</button></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th /></tr></thead>
          <tbody>{members.map((m) => (
            <tr key={m.id}><td>{m.name}</td><td className="muted">{m.email}</td><td>
              {m.role === 'owner' ? 'Propietario' : <select className="select" style={{ height: 30, width: 120 }} aria-label="Rol" value={m.role} onChange={(e) => update((s) => { const x = s.members.find((y) => y.id === m.id); if (x) x.role = e.target.value as any; })}><option value="admin">Administrador</option><option value="editor">Editor</option><option value="reviewer">Revisor</option></select>}
            </td><td>{m.status === 'invited' ? <span className="badge warn">Invitado</span> : <span className="badge ok">Activo</span>}</td>
            <td>{m.role !== 'owner' && <button className="btn btn-ghost btn-sm btn-icon" aria-label="Quitar" onClick={() => update((s) => { s.members = s.members.filter((x) => x.id !== m.id); s.events.unshift({ at: new Date().toISOString(), name: 'audit.member_removed', props: { email: m.email } }); })}><LuTrash2 /></button>}</td></tr>
          ))}</tbody>
        </table>
      </div>
      <div className="card-body xs subtle">Propietarios y administradores gestionan la facturación y el equipo. Los editores preparan propuestas. Los revisores comentan y aprueban secciones (plan Business).</div>
      {invite && (
        <Modal title="Invitar a un miembro del equipo" onClose={() => setInvite(false)} footer={<><button className="btn btn-ghost" onClick={() => setInvite(false)}>Cancelar</button>{full ? <button className="btn btn-primary" onClick={() => { setInvite(false); navigate('/app/settings/billing'); }}>Mejorar plan para más usuarios</button> : <button className="btn btn-primary" disabled={!/^\S+@\S+\.\S+$/.test(email)} onClick={() => { update((s) => { s.members.push({ id: uid('m'), name: email.split('@')[0], email, role, status: 'invited' }); s.events.unshift({ at: new Date().toISOString(), name: 'audit.member_invited', props: { email, role } }); }); toast('Invitación creada. En esta versión de prueba no se envían correos.', 'ok'); setInvite(false); setEmail(''); }}>Enviar invitación</button>}</>}>
          {full ? <p className="muted">Tu plan {plan.name} incluye {plan.seats} usuario{plan.seats > 1 ? 's' : ''}. Mejora el plan para invitar a más personas.</p> : (
            <div className="stack">
              <div className="field"><label htmlFor="iv-e">Correo electrónico</label><input id="iv-e" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="field"><label htmlFor="iv-r">Rol</label><select id="iv-r" className="select" value={role} onChange={(e) => setRole(e.target.value as any)}><option value="editor">Editor</option><option value="reviewer">Revisor</option><option value="admin">Administrador</option></select></div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function Billing() {
  const s = useStore((x) => x);
  const sub = s.subscription;
  const plan = PLANS[sub.plan];
  const [upgrade, setUpgrade] = useState(false);
  const [portal, setPortal] = useState(false);
  const [cancel, setCancel] = useState(false);
  const trialLeft = daysUntil(sub.trialEndsAt);
  const price = sub.plan === 'trial' || sub.plan === 'free' ? 0 : sub.billingCycle === 'annual' ? plan.annual : plan.monthly;
  const statusLabel = sub.status === 'trialing' ? (trialLeft != null && trialLeft >= 0 ? 'Prueba' : 'Prueba terminada') : sub.cancelAtPeriodEnd ? 'Se cancela al final del periodo' : sub.status === 'active' ? 'Activa' : sub.status === 'past_due' ? 'Pago fallido' : sub.status === 'canceled' ? 'Cancelada' : 'Caducada';
  const openPortal = async () => { const r = await billing.openPortal(); if ('url' in r) window.open(r.url, '_blank'); else setPortal(true); };
  const limit = sub.plan === 'trial' ? 1 : plan.proposalsPerMonth;
  return (
    <div className="stack gap-20">
      {!subscriptionActive(s) && <div className="callout warn"><LuTriangleAlert /><div className="grow"><strong>Suscripción caducada.</strong> Tu espacio de trabajo es de solo lectura hasta que elijas un plan. No se ha borrado nada.</div></div>}
      <div className="card">
        <div className="card-head"><h3>Plan actual</h3><span className="spacer" /><span className={`badge ${sub.status === 'active' && !sub.cancelAtPeriodEnd ? 'ok' : 'warn'}`}>{statusLabel}</span>{sub.simulated && <span className="badge sample">Vista previa · sin pago</span>}</div>
        <div className="card-body">
          <div className="row-wrap" style={{ justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-.03em' }}>{plan.name}</div>
              <div className="muted">{price ? `${price} €/mes${sub.billingCycle === 'annual' ? ', facturación anual' : ''}` : '0 €'}</div>
              <div className="small mt-8">{sub.status === 'trialing' ? `La prueba termina el ${fmtDate(sub.trialEndsAt)}${trialLeft != null && trialLeft >= 0 ? ` (${trialLeft} días)` : ''}` : sub.cancelAtPeriodEnd ? `Acceso hasta el ${fmtDate(sub.currentPeriodEnd)}` : `Próxima factura: ${fmtDate(sub.currentPeriodEnd)}`}</div>
            </div>
            <div className="row-wrap">
              <button className="btn btn-secondary" onClick={openPortal}><LuExternalLink /> Gestionar suscripción</button>
              <button className="btn btn-primary" onClick={() => setUpgrade(true)}>{sub.plan === 'business' ? 'Cambiar de plan' : 'Mejorar plan'}</button>
              {sub.status === 'active' && !sub.cancelAtPeriodEnd && <button className="btn btn-ghost" onClick={() => setCancel(true)}>Cancelar</button>}
              {sub.cancelAtPeriodEnd && <button className="btn btn-ghost" onClick={() => { update((x) => { x.subscription.cancelAtPeriodEnd = false; }); toast('Cancelación anulada', 'ok'); }}><LuRotateCcw /> Mantener plan</button>}
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Uso en este periodo</h3><span className="xs subtle">desde el {fmtDate(s.usage.periodStart, { day: 'numeric', month: 'short' })}</span></div>
        <div className="card-body grid-3">
          <div><div className="small muted">Propuestas nuevas</div><div className="big-stat num mt-4">{s.usage.proposalsCreated}<span className="small muted" style={{ fontWeight: 400 }}> / {limit}</span></div><div className="mt-8"><Bar value={limit ? (s.usage.proposalsCreated / limit) * 100 : 100} tone={s.usage.proposalsCreated >= limit ? 'warn' : undefined} /></div></div>
          <div><div className="small muted">Páginas de pliegos analizadas</div><div className="big-stat num mt-4">{s.usage.pagesAnalyzed}</div><div className="xs subtle mt-8">Hasta {plan.pagesPerProposal || PLANS.pro.pagesPerProposal} por propuesta</div></div>
          <div><div className="small muted">Acciones de IA</div><div className="big-stat num mt-4">{s.usage.aiActions}</div><div className="xs subtle mt-8">Incluidas en cada propuesta (uso razonable)</div></div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3>Método de pago</h3></div>
          <div className="card-body small muted">No hay ningún método de pago guardado. Los datos de pago los recoge y guarda Stripe, nunca PROPO.</div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Facturas</h3></div>
          <Empty icon={<LuReceipt />} title="Todavía no hay facturas" body="Las facturas aparecerán aquí después del primer pago." />
        </div>
      </div>
      <div className="callout neutral small"><LuInfo /><div>Los pagos no están conectados en esta versión de prueba: no hay formulario de tarjeta ni cobros. La versión de producción usa Stripe Checkout, el portal de cliente de Stripe (método de pago, facturas, cambios de plan y cancelación con prorrateo) y webhooks que actualizan la suscripción. Consulta <span className="mono">server/billing</span> en el código.</div></div>
      {upgrade && <UpgradeModal onClose={() => setUpgrade(false)} />}
      {portal && <Modal title="Gestionar suscripción" onClose={() => setPortal(false)} footer={<button className="btn btn-primary" onClick={() => setPortal(false)}>Entendido</button>}><p className="muted">En producción, aquí se abre el portal de cliente de Stripe, donde puedes cambiar el método de pago, descargar facturas, cambiar de plan y cancelar. Stripe no está conectado en esta versión de prueba.</p></Modal>}
      {cancel && (
        <Modal title="¿Cancelar tu suscripción?" onClose={() => setCancel(false)} footer={<><button className="btn btn-ghost" onClick={() => setCancel(false)}>Mantener mi plan</button><button className="btn btn-danger" onClick={() => { update((x) => { x.subscription.cancelAtPeriodEnd = true; }); track('subscription_cancel_requested', { plan: sub.plan }); toast(`Cancelada. Mantienes ${plan.name} hasta el ${fmtDate(sub.currentPeriodEnd)}.`); setCancel(false); }}>Cancelar suscripción</button></>}>
          <p className="muted">Mantienes {plan.name} hasta el {fmtDate(sub.currentPeriodEnd)}. Después, tu espacio pasa a ser de solo lectura: el conocimiento de tu empresa, tus documentos y tus propuestas se conservan y puedes exportarlos cuando quieras.</p>
        </Modal>
      )}
    </div>
  );
}

function NotifPrefs() {
  const st = useStore((s) => s.settings);
  const row = (label: string, desc: string, on: boolean, set: (v: boolean) => void) => (
    <div className="entity"><div><div style={{ fontWeight: 500 }}>{label}</div><div className="small muted">{desc}</div></div><Toggle on={on} onChange={set} label={label} /></div>
  );
  return (
    <div className="card">
      <div className="card-head"><h3>Notificaciones</h3></div>
      {row('Recordatorios de plazos', '7 días antes, 2 días antes y la mañana de cada fecha límite.', st.deadlineReminders, (v) => update((s) => { s.settings.deadlineReminders = v; }))}
      {row('Avisos por correo', 'Cuando PROPO necesita información, termina un borrador o encuentra licitaciones para tus alertas.', st.emailNotifications, (v) => update((s) => { s.settings.emailNotifications = v; }))}
    </div>
  );
}

function Privacy() {
  const s = useStore((x) => x);
  const [del, setDel] = useState(false);
  const [confirm, setConfirm] = useState('');
  const audit = s.events.filter((e) => e.name.startsWith('audit.') || ['document_uploaded', 'project_created', 'section_approved', 'proposal_completed', 'package_downloaded', 'login', 'signup'].includes(e.name)).slice(0, 12);
  const exportData = async () => {
    const st = getState();
    const data = JSON.stringify({ exportedAt: new Date().toISOString(), format: 'propo-export/1', user: st.user, company: st.company, pastProjects: st.pastProjects, certifications: st.certifications, team: st.team, vault: st.vault, projects: st.projects, templates: st.templates, members: st.members }, null, 2);
    const r = await offerDownload('propo-export.json', data);
    if (r === 'saved') { toast('Exportación lista', 'ok'); update((x) => { x.events.unshift({ at: new Date().toISOString(), name: 'audit.data_exported' }); }); }
    else if (r !== 'declined') toast('Las descargas no están disponibles en esta vista.', 'warn');
  };
  return (
    <div className="stack gap-20">
      <div className="card">
        <div className="card-head"><h3>Tus datos</h3></div>
        <div className="entity"><div><div style={{ fontWeight: 500 }}>Exportar todos los datos</div><div className="small muted">Perfil de empresa, índice de documentos, proyectos, requisitos, propuestas y plantillas en JSON (portabilidad de datos según el RGPD).</div></div><button className="btn btn-secondary btn-sm" onClick={exportData}><LuDownload /> Exportar</button></div>
        <div className="entity"><div><div style={{ fontWeight: 500 }}>Conservación de datos</div><div className="small muted">Durante cuánto tiempo se guardan los documentos de proyectos cerrados. El conocimiento de tu empresa se guarda hasta que lo borres.</div></div>
          <select className="select" style={{ width: 150 }} aria-label="Conservación" value={s.settings.retentionMonths} onChange={(e) => update((x) => { x.settings.retentionMonths = Number(e.target.value); x.events.unshift({ at: new Date().toISOString(), name: 'audit.retention_changed', props: { months: Number(e.target.value) } }); })}>{[6, 12, 24, 36, 60].map((m) => <option key={m} value={m}>{m} meses</option>)}</select></div>
        <div className="entity"><div><div style={{ fontWeight: 500 }}>Entrenamiento de IA</div><div className="small muted">Tus documentos y propuestas nunca se usan para entrenar modelos de IA. No se puede activar.</div></div><span className="badge ok">Nunca</span></div>
        <div className="entity"><div><div style={{ fontWeight: 500 }}>Dónde se guardan tus datos</div><div className="small muted">Esta versión de prueba guarda tu espacio solo en este navegador (almacenamiento local e IndexedDB). En producción se guarda cifrado en la UE.</div></div><span /></div>
      </div>
      <div className="card">
        <div className="card-head"><h3>Registro de actividad</h3><span className="xs subtle">Eventos recientes relevantes para la seguridad</span></div>
        {audit.length === 0 ? <div className="small muted" style={{ padding: 20 }}>Todavía no hay eventos.</div> : (
          <div className="table-wrap"><table className="table"><tbody>{audit.map((e, i) => <tr key={i}><td className="mono small">{e.name.replace('audit.', '')}</td><td className="small muted">{e.props ? Object.values(e.props).filter((v) => typeof v !== 'object').join(' · ') : ''}</td><td className="xs subtle" style={{ whiteSpace: 'nowrap' }}>{timeAgo(e.at)}</td></tr>)}</tbody></table></div>
        )}
      </div>
      <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--bad) 35%, var(--border))' }}>
        <div className="card-head"><h3 style={{ color: 'var(--bad)' }}>Eliminar cuenta</h3></div>
        <div className="card-body row-wrap" style={{ justifyContent: 'space-between' }}>
          <p className="small muted" style={{ maxWidth: 520 }}>Elimina de forma permanente tu espacio, el conocimiento de tu empresa, tus documentos y tus propuestas. No se puede deshacer. Exporta antes tus datos si los necesitas.</p>
          <button className="btn btn-danger" onClick={() => setDel(true)}><LuTrash2 /> Eliminar cuenta</button>
        </div>
      </div>
      {del && (
        <Modal title="¿Eliminar tu cuenta de PROPO?" onClose={() => setDel(false)} footer={<><button className="btn btn-ghost" onClick={() => setDel(false)}>Cancelar</button><button className="btn btn-danger" disabled={confirm !== 'ELIMINAR'} onClick={() => { resetAll(); navigate('/'); toast('Cuenta y datos eliminados'); }}>Eliminar todo</button></>}>
          <div className="stack">
            <p className="muted">Todos los datos de {s.company.legalName || 'tu empresa'} se eliminarán de forma permanente de este navegador. En producción, también se borran los archivos del almacenamiento y de las copias de seguridad en un plazo de 30 días.</p>
            <div className="field"><label htmlFor="del-c">Escribe ELIMINAR para confirmar</label><input id="del-c" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
