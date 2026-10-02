import React, { useMemo, useState } from 'react';
import {
  LuLayoutDashboard, LuFolderKanban, LuBuilding2, LuFiles, LuLayoutTemplate, LuSettings, LuSearch, LuBell, LuMenu, LuPlus,
  LuLogOut, LuCreditCard, LuGauge, LuGlobe, LuFileText, LuListChecks, LuCircleCheck, LuX, LuHouse,
} from 'react-icons/lu';
import { Logo, Menu, Bar } from '../components/ui';
import { navigate, useRoute, useStore, update } from '../lib/store';
import { knowledgeScore } from '../lib/derive';
import { daysUntil, timeAgo } from '../lib/util';
import { PLANS } from '../lib/plans';
import { AIBadge } from './common';
import { getHint, clearHint, onHint } from '../lib/infoFix';
import { startDemo } from '../marketing/Layout';
import { LuCornerUpLeft } from 'react-icons/lu';

export function AppShell({ children, fullBleed, showSetup }: { children: React.ReactNode; fullBleed?: boolean; showSetup?: boolean }) {
  const route = useRoute();
  const [sideOpen, setSideOpen] = useState(false);
  const state = useStore((s) => s);
  const unread = state.notifications.filter((n) => !n.read).length;
  const path = route.split('?')[0];
  const is = (p: string) => (p === '/app' ? path === '/app' : path.startsWith(p));
  const go = (to: string) => { setSideOpen(false); navigate(to); };
  const sub = state.subscription;
  const trialLeft = daysUntil(sub.trialEndsAt);
  const ks = knowledgeScore(state).score;
  const nav: [string, string, React.ReactNode, number?][] = [
    ['/app', 'Inicio', <LuHouse />],
    ['/app/tenders', 'Licitaciones', <LuSearch />],
    ['/app/projects', 'Mis proyectos', <LuFolderKanban />, state.projects.filter((p) => !p.markedReady).length],
    ['/app/company', 'Empresa', <LuBuilding2 />],
    ['/app/documents', 'Documentos', <LuFiles />, state.vault.length],
    ['/app/templates', 'Plantillas', <LuLayoutTemplate />],
    ['/app/notifications', 'Alertas', <LuBell />, state.notifications.filter((n) => !n.read).length],
    ['/app/settings', 'Ajustes', <LuSettings />],
  ];
  const initials = (state.company.legalName || 'P').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="app">
      {sideOpen && <div className="drawer-overlay" style={{ zIndex: 65 }} onClick={() => setSideOpen(false)} />}
      <aside className={`side ${sideOpen ? 'open' : ''}`}>
        <div className="side-top"><Logo onClick={() => go('/app')} />{sideOpen && <button className="btn btn-ghost btn-sm btn-icon" aria-label="Cerrar menú" onClick={() => setSideOpen(false)}><LuX /></button>}</div>
        <button className="ws" onClick={() => go('/app/company')} style={{ cursor: 'pointer', textAlign: 'left' }}>
          <span className="ws-avatar">{initials}</span>
          <span className="grow"><span className="truncate" style={{ display: 'block', fontWeight: 600, fontSize: 13 }}>{state.company.legalName || 'Tu empresa'}</span><span className="xs subtle">{PLANS[sub.plan].name}{sub.simulated ? ' · vista previa' : ''}</span></span>
        </button>
        <button className="btn btn-primary" style={{ marginBottom: 10 }} onClick={() => go('/app/projects?new=1')}><LuPlus /> Nueva propuesta</button>
        {nav.map(([to, label, icon, count]) => (
          <button key={to} className={`nav-item ${is(to) ? 'on' : ''}`} onClick={() => go(to)}>{icon}{label}{count ? <span className="count">{count}</span> : null}</button>
        ))}
        <div className="side-foot">
          {showSetup && (
            <button className="trial-box" style={{ cursor: 'pointer', textAlign: 'left' }} onClick={() => go('/onboarding')}>
              <div className="row small"><strong>Completa tu empresa</strong><span className="spacer" /><span className="mono xs">{state.onboarding.completedSteps.length}/4</span></div>
              <Bar value={(state.onboarding.completedSteps.length / 4) * 100} tone="accent" />
            </button>
          )}
          <button className="trial-box" style={{ cursor: 'pointer', textAlign: 'left' }} onClick={() => go('/app/company')}>
            <div className="row small"><span>Memoria de empresa</span><span className="spacer" /><span className="mono xs">{ks}%</span></div>
            <Bar value={ks} />
          </button>
          {sub.status === 'trialing' && (
            <div className="trial-box">
              <div className="small"><strong>{trialLeft != null && trialLeft >= 0 ? `Quedan ${trialLeft} días de prueba` : 'Prueba terminada'}</strong></div>
              <div className="xs muted">{state.usage.proposalsCreated} de 1 propuesta de prueba usada</div>
              <button className="btn btn-secondary btn-sm" onClick={() => go('/app/settings/billing')}>Mejorar plan</button>
            </div>
          )}
          {state.demo && <DemoBox kind={state.demo} />}
          <AIBadge />
        </div>
      </aside>
      <div className="main-col">
        <header className="topbar">
          <button className="btn btn-ghost btn-icon hide-desktop" aria-label="Abrir menú" onClick={() => setSideOpen(true)} style={{ display: undefined }}><LuMenu /></button>
          <span className="hide-desktop"><Logo word={false} onClick={() => go('/app')} /></span>
          <GlobalSearch />
          <span className="spacer" />
          <NotificationsMenu unread={unread} />
          <AccountMenu />
        </header>
        <div className="content" id="app-main">
          {fullBleed ? children : <div className="page"><ReturnHint path={path} />{children}</div>}
        </div>
      </div>
      <nav className="mobile-nav" aria-label="Mobile">
        <button className={is('/app') && path === '/app' ? 'on' : ''} onClick={() => go('/app')}><LuHouse />Inicio</button>
        <button className={is('/app/tenders') ? 'on' : ''} onClick={() => go('/app/tenders')}><LuSearch />Licitaciones</button>
        <button onClick={() => go('/app/projects?new=1')}><LuPlus />Nueva</button>
        <button className={is('/app/notifications') ? 'on' : ''} onClick={() => go('/app/notifications')}><span style={{ position: 'relative' }}><LuBell />{unread > 0 && <span className="dot accent" style={{ position: 'absolute', top: -2, right: -4, width: 7, height: 7 }} />}</span>Alertas</button>
        <button onClick={() => setSideOpen(true)}><LuMenu />Más</button>
      </nav>
    </div>
  );
}

function GlobalSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const s = useStore((st) => st);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    const out: { label: string; sub: string; to: string; icon: React.ReactNode }[] = [];
    s.projects.forEach((p) => {
      if ((p.name + ' ' + p.organization).toLowerCase().includes(t)) out.push({ label: p.name, sub: 'Proyecto', to: `/app/projects/${p.id}`, icon: <LuFolderKanban /> });
      p.requirements.forEach((r) => { if ((r.title + ' ' + r.text).toLowerCase().includes(t)) out.push({ label: r.title, sub: `Requisito · ${p.name}`, to: `/app/projects/${p.id}/requirements`, icon: <LuListChecks /> }); });
    });
    s.vault.forEach((v) => { if (v.name.toLowerCase().includes(t)) out.push({ label: v.name, sub: 'Documentos', to: '/app/documents', icon: <LuFileText /> }); });
    s.templates.forEach((v) => { if ((v.name + v.body).toLowerCase().includes(t)) out.push({ label: v.name, sub: 'Plantilla', to: '/app/templates', icon: <LuLayoutTemplate /> }); });
    return out.slice(0, 8);
  }, [q, s]);
  return (
    <div style={{ position: 'relative', width: 'min(380px, 100%)' }} className="hide-sm">
      <label className="search">
        <LuSearch />
        <input aria-label="Buscar" placeholder="Buscar proyectos, requisitos, documentos" value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} />
      </label>
      {open && q.trim().length >= 2 && (
        <div className="menu" style={{ left: 0, right: 0 }}>
          {results.length === 0 ? <div className="small muted" style={{ padding: 10 }}>Sin resultados para «{q}».</div> : results.map((r, i) => (
            <button key={i} className="menu-item" onMouseDown={() => { navigate(r.to); setQ(''); }}>{r.icon}<span className="grow"><span className="truncate" style={{ display: 'block' }}>{r.label}</span><span className="xs subtle">{r.sub}</span></span></button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsMenu({ unread }: { unread: number }) {
  const ns = useStore((s) => s.notifications);
  return (
    <Menu trigger={(_, toggle) => <button className="icon-btn hide-sm" aria-label={`Notificaciones${unread ? `, ${unread} sin leer` : ''}`} onClick={toggle}><LuBell />{unread > 0 && <span className="pip" />}</button>}>
      {(close) => (
        <div style={{ width: 'min(360px, calc(100vw - 32px))' }}>
          <div className="row" style={{ padding: '6px 8px 10px' }}><strong>Notificaciones</strong><span className="spacer" />{unread > 0 && <button className="link small" onClick={() => update((s) => { s.notifications.forEach((n) => { n.read = true; }); })}>Marcar todo como leído</button>}</div>
          {ns.length === 0 || unread === 0 && ns.every((n) => n.read) && ns.length === 0 ? null : null}
          {ns.filter((n) => !n.read).length === 0 ? (
            <div className="empty" style={{ padding: 24 }}><div className="empty-ico"><LuCircleCheck /></div><h3>Estás al día.</h3></div>
          ) : ns.filter((n) => !n.read).slice(0, 5).map((n) => (
            <button key={n.id} className="menu-item" style={{ alignItems: 'flex-start' }} onClick={() => { update((s) => { const x = s.notifications.find((y) => y.id === n.id); if (x) x.read = true; }); close(); if (n.projectId) navigate(`/app/projects/${n.projectId}`); }}>
              <span className="dot accent" style={{ marginTop: 7 }} />
              <span className="grow"><span style={{ display: 'block', fontWeight: 500 }}>{n.title}</span><span className="xs muted clamp2">{n.body}</span><span className="xs subtle">{timeAgo(n.at)}</span></span>
            </button>
          ))}
          <div className="divider" style={{ margin: '6px 0' }} />
          <button className="menu-item" onClick={() => { close(); navigate('/app/notifications'); }}>Ver todas las notificaciones</button>
        </div>
      )}
    </Menu>
  );
}

function AccountMenu() {
  const user = useStore((s) => s.user);
  const initials = (user?.name || 'U').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Menu trigger={(_, toggle) => <button className="avatar" aria-label="Cuenta" onClick={toggle}>{initials}</button>}>
      {(close) => (
        <>
          <div style={{ padding: '8px 10px 10px' }}><div style={{ fontWeight: 600 }}>{user?.name}</div><div className="xs muted">{user?.email}</div></div>
          <div className="divider" style={{ margin: '0 0 6px' }} />
          <button className="menu-item" onClick={() => { close(); navigate('/app/settings/account'); }}><LuSettings />Ajustes</button>
          <button className="menu-item" onClick={() => { close(); navigate('/app/settings/billing'); }}><LuCreditCard />Facturación</button>
          <button className="menu-item" onClick={() => { close(); navigate('/app/admin'); }}><LuGauge />Panel de administración <span className="badge sample" style={{ marginLeft: 'auto' }}>Interno</span></button>
          <button className="menu-item" onClick={() => { close(); navigate('/'); }}><LuGlobe />Web de PROPO</button>
          <div className="divider" style={{ margin: '6px 0' }} />
<div className="divider" style={{ margin: '6px 0' }} />
          <button className="menu-item" onClick={() => { close(); update((s) => { s.signedOut = true; }); navigate('/'); }}><LuLogOut />Cerrar sesión</button>
        </>
      )}
    </Menu>
  );
}


// Cambiar entre la demo inicial (con datos por completar) y la demo completa (todo subido).
function DemoBox({ kind }: { kind: 'basic' | 'complete' }) {
  const [busy, setBusy] = useState(false);
  const go = async (complete: boolean) => { setBusy(true); try { await startDemo('/app/projects/p_sample', complete); } finally { setBusy(false); } };
  return (
    <div className="trial-box demo-box">
      <div className="small"><strong>{kind === 'complete' ? 'Demo completa' : 'Demo'}</strong> · empresa ficticia</div>
      <div className="xs muted">{kind === 'complete' ? 'Toda la documentación de ejemplo está subida y la propuesta aprobada.' : 'A la propuesta de ejemplo le faltan documentos y datos.'}</div>
      <button className="btn btn-secondary btn-sm" disabled={busy} onClick={() => go(kind !== 'complete')}>{kind === 'complete' ? 'Volver a la demo inicial' : 'Ver demo completa'}</button>
    </div>
  );
}

// «Vuelve a tu propuesta»: aparece cuando el usuario ha salido de la propuesta para añadir un dato que faltaba.
function ReturnHint({ path }: { path: string }) {
  const [, force] = useState(0);
  React.useEffect(() => onHint(() => force((x) => x + 1)), []);
  const h = getHint();
  if (!h || path.startsWith(h.back.replace(/\/proposal$/, ''))) return null;
  return (
    <div className="return-hint" role="status">
      <LuCornerUpLeft />
      <div className="grow">Estás añadiendo <strong>{h.need.toLowerCase()}</strong> para la sección «{h.section}». Cuando lo guardes, vuelve y pulsa <strong>Regenerar</strong> para que PROPO lo use.</div>
      <button className="btn btn-primary btn-sm" onClick={() => { const b = h.back; clearHint(); navigate(b); }}>Volver a la propuesta</button>
      <button className="btn btn-ghost btn-sm btn-icon" aria-label="Cerrar aviso" onClick={clearHint}><LuX /></button>
    </div>
  );
}
