import React from 'react';
import { LuBell, LuCalendar, LuCircleAlert, LuSparkles, LuCreditCard, LuInfo, LuCircleCheck } from 'react-icons/lu';
import { useStore, update, navigate } from '../lib/store';
import { Empty } from '../components/ui';
import { timeAgo } from '../lib/util';

const ICON = { deadline: <LuCalendar />, info_needed: <LuCircleAlert />, ai_done: <LuSparkles />, billing: <LuCreditCard />, system: <LuInfo /> };

export function Notifications() {
  const ns = useStore((s) => s.notifications);
  const unread = ns.filter((n) => !n.read).length;
  return (
    <>
      <div className="page-head">
        <div><h1>Avisos</h1><p>Plazos, preguntas de PROPO y trabajos de la IA terminados.</p></div>
        {unread > 0 && <button className="btn btn-secondary" onClick={() => update((s) => { s.notifications.forEach((n) => { n.read = true; }); })}><LuCircleCheck /> Marcar todo como leído</button>}
      </div>
      <div className="card">
        {ns.length === 0 ? <Empty icon={<LuBell />} title="Estás al día." body="PROPO te avisará de plazos, información que falta y borradores terminados." /> : ns.map((n) => (
          <button key={n.id} className="list-item" style={{ width: '100%', border: 0, borderBottom: '1px solid var(--border)', background: n.read ? 'none' : 'var(--accent-soft)', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => { update((s) => { const x = s.notifications.find((y) => y.id === n.id); if (x) x.read = true; }); if (n.projectId) navigate(`/app/projects/${n.projectId}`); }}>
            <span className="empty-ico" style={{ width: 32, height: 32, margin: 0, flex: 'none' }}>{ICON[n.kind]}</span>
            <span className="grow"><span className="row" style={{ fontWeight: n.read ? 500 : 600 }}>{!n.read && <span className="dot accent" />}{n.title}</span><span className="small muted" style={{ display: 'block' }}>{n.body}</span></span>
            <span className="xs subtle" style={{ whiteSpace: 'nowrap' }}>{timeAgo(n.at)}</span>
          </button>
        ))}
      </div>
    </>
  );
}
