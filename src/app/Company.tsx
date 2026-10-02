import React, { useState } from 'react';
import { LuPlus, LuTrash2, LuPencil, LuBriefcase, LuAward, LuUsers, LuBuilding2, LuWrench, LuCircleCheck, LuTriangleAlert, LuSearch, LuCheck } from 'react-icons/lu';
import { SECTORS, REGIONS, cpvsForSectors } from '../lib/discovery/match';
import { useStore, update, navigate, toast } from '../lib/store';
import { knowledgeScore } from '../lib/derive';
import { Ring, Bar, Empty, Modal } from '../components/ui';
import { uid, fmtDate, daysUntil } from '../lib/util';
import { SAMPLE_COMPANY, SAMPLE_PAST_PROJECTS, SAMPLE_CERTS, SAMPLE_TEAM, SAMPLE_VAULT } from '../lib/demoData';
import type { PastProject, Certification, TeamMember } from '../lib/types';

const TABS: [string, string, React.ReactNode][] = [
  ['info', 'Datos de empresa', <LuBuilding2 />],
  ['search', 'Perfil de búsqueda', <LuSearch />],
  ['experience', 'Experiencia', <LuBriefcase />],
  ['certifications', 'Certificaciones', <LuAward />],
  ['team', 'Equipo', <LuUsers />],
  ['capabilities', 'Capacidades', <LuWrench />],
];

export function Company({ tab }: { tab: string }) {
  const s = useStore((x) => x);
  const ks = knowledgeScore(s);
  const empty = !s.pastProjects.length && !s.certifications.length && !s.team.length;
  return (
    <>
      <div className="page-head">
        <div><h1>Empresa</h1><p>El perfil permanente de tu empresa. PROPO lo usa en cada propuesta para que nunca escribas dos veces lo mismo.</p></div>
        {empty && <button className="btn btn-secondary" onClick={() => { update((st) => { st.company = { ...SAMPLE_COMPANY, legalName: st.company.legalName || SAMPLE_COMPANY.legalName }; st.pastProjects = SAMPLE_PAST_PROJECTS; st.certifications = SAMPLE_CERTS; st.team = SAMPLE_TEAM; st.vault = [...st.vault, ...SAMPLE_VAULT]; }); toast('Datos de empresa de ejemplo cargados (ficticios)', 'ok'); }}>Cargar datos de ejemplo</button>}
      </div>
      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div className="row-wrap gap-20" style={{ alignItems: 'center' }}>
          <Ring value={ks.score} size={84} stroke={8} tone="accent" />
          <div style={{ minWidth: 200 }} className="grow">
            <div className="eyebrow">Memoria de empresa</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, marginTop: 6 }}>{ks.score}% completa{ks.score >= 70 ? ' · PROPO conoce tu empresa.' : ''}</div>
            <p className="small muted mt-4">Cuanto más sabe PROPO, más requisitos cumple solo y menos preguntas te hace.</p>
          </div>
          <div className="grid-3" style={{ gap: '10px 24px', minWidth: 280, flex: 1 }}>
            {ks.parts.map((p) => <div key={p.label} className="kn-row"><span className="xs">{p.label}</span><span className="mono xs subtle">{Math.round(p.value * 100)}%</span><Bar value={p.value * 100} /></div>)}
          </div>
        </div>
      </div>
      <div className="two-col">
        <nav className="subnav" aria-label="Secciones de empresa">
          {TABS.map(([k, l, ic]) => <button key={k} className={`nav-item ${tab === k ? 'on' : ''}`} onClick={() => navigate(`/app/company/${k}`)}>{ic}{l}</button>)}
          <button className="nav-item" onClick={() => navigate('/app/documents')}><LuPlus />Documentos</button>
        </nav>
        <div style={{ minWidth: 0 }}>
          {tab === 'info' && <InfoTab />}
          {tab === 'search' && <SearchTab />}
          {tab === 'experience' && <ExperienceTab />}
          {tab === 'certifications' && <CertsTab />}
          {tab === 'team' && <TeamTab />}
          {tab === 'capabilities' && <CapabilitiesTab />}
        </div>
      </div>
    </>
  );
}

function InfoTab() {
  const c = useStore((s) => s.company);
  const [f, setF] = useState(c);
  const dirty = JSON.stringify(f) !== JSON.stringify(c);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const fields: [keyof typeof f, string, string?][] = [['legalName', 'Razón social'], ['tradeName', 'Nombre comercial'], ['taxId', 'NIF'], ['country', 'País'], ['industry', 'Sector'], ['employees', 'Empleados'], ['revenue', 'Facturación anual', 'Se usa para la solvencia económica y la compatibilidad. PROPO nunca la estima.'], ['website', 'Web']];
  return (
    <div className="card">
      <div className="card-head"><h3>Datos de empresa</h3></div>
      <div className="card-body stack">
        <div className="grid-2">
          {fields.map(([k, l, h]) => <div key={k} className="field"><label htmlFor={`ci-${k}`}>{l}</label><input id={`ci-${k}`} className="input" value={f[k] as string} onChange={set(k)} />{h && <span className="hint">{h}</span>}</div>)}
        </div>
        <div className="field"><label htmlFor="ci-address">Dirección</label><input id="ci-address" className="input" value={f.address} onChange={set('address')} /></div>
        <div className="field"><label htmlFor="ci-desc">Descripción</label><textarea id="ci-desc" className="textarea" value={f.description} onChange={set('description')} /><span className="hint">Unas frases sobre lo que hacéis. PROPO las usa en la presentación de la empresa.</span></div>
        <div className="row"><button className="btn btn-primary" disabled={!dirty} onClick={() => { update((s) => { s.company = f; }); toast('Datos de empresa guardados', 'ok'); }}>Guardar cambios</button>{dirty && <button className="btn btn-ghost" onClick={() => setF(c)}>Descartar</button>}</div>
      </div>
    </div>
  );
}

function ExperienceTab() {
  const list = useStore((s) => s.pastProjects);
  const [edit, setEdit] = useState<PastProject | null>(null);
  const blank: PastProject = { id: '', title: '', client: '', sector: '', years: '', value: '', description: '', hasCertificate: false };
  return (
    <div className="card">
      <div className="card-head"><h3>Proyectos previos</h3><span className="spacer" /><button className="btn btn-secondary btn-sm" onClick={() => setEdit(blank)}><LuPlus /> Añadir proyecto</button></div>
      {list.length === 0 ? <Empty icon={<LuBriefcase />} title="Todavía no hay proyectos previos" body="La mayoría de pliegos piden contratos similares de los últimos 3–5 años. Añádelos una vez y PROPO acreditará tu experiencia automáticamente." action={<button className="btn btn-primary" onClick={() => setEdit(blank)}><LuPlus /> Añadir proyecto</button>} /> : list.map((p) => (
        <div key={p.id} className="entity">
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>{p.title}</div>
            <div className="small muted">{[p.client, p.years, p.value].filter(Boolean).join(' · ')}</div>
            {p.description && <p className="small mt-4">{p.description}</p>}
            <div className="mt-8">{p.hasCertificate ? <span className="badge ok"><LuCircleCheck />Certificado de buena ejecución</span> : <span className="badge warn">Sin certificado guardado</span>}</div>
          </div>
          <div className="row"><button className="btn btn-ghost btn-sm btn-icon" aria-label="Editar" onClick={() => setEdit(p)}><LuPencil /></button><button className="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar" onClick={() => update((s) => { s.pastProjects = s.pastProjects.filter((x) => x.id !== p.id); })}><LuTrash2 /></button></div>
        </div>
      ))}
      {edit && <EditModal title={edit.id ? 'Editar proyecto' : 'Añadir proyecto'} onClose={() => setEdit(null)} init={edit}
        fields={[['title', 'Proyecto'], ['client', 'Cliente'], ['sector', 'Sector'], ['years', 'Años'], ['value', 'Importe anual'], ['description', 'Descripción', 'textarea'], ['hasCertificate', 'Tenemos certificado de buena ejecución', 'checkbox']]}
        onSave={(v) => update((s) => { if (v.id) s.pastProjects = s.pastProjects.map((x) => (x.id === v.id ? v : x)); else s.pastProjects.push({ ...v, id: uid('pp') }); })} />}
    </div>
  );
}

function CertsTab() {
  const list = useStore((s) => s.certifications);
  const [edit, setEdit] = useState<Certification | null>(null);
  const blank: Certification = { id: '', name: '', issuer: '', validUntil: '', category: 'quality' };
  return (
    <div className="card">
      <div className="card-head"><h3>Certificaciones</h3><span className="spacer" /><button className="btn btn-secondary btn-sm" onClick={() => setEdit(blank)}><LuPlus /> Añadir certificación</button></div>
      {list.length === 0 ? <Empty icon={<LuAward />} title="Todavía no hay certificaciones" body="Las certificaciones ISO, de calidad, ambientales y sectoriales suelen ser obligatorias. Añádelas con su fecha de validez." action={<button className="btn btn-primary" onClick={() => setEdit(blank)}><LuPlus /> Añadir certificación</button>} /> : list.map((c) => {
        const d = daysUntil(c.validUntil);
        return (
          <div key={c.id} className="entity">
            <div><div style={{ fontWeight: 600 }}>{c.name}</div><div className="small muted">{c.issuer || 'Entidad sin indicar'} · {c.validUntil ? `válida hasta el ${fmtDate(c.validUntil)}` : 'sin fecha de caducidad'}</div>
              {d != null && d < 0 && <span className="badge bad mt-8"><LuTriangleAlert />Caducada</span>}
              {d != null && d >= 0 && d < 90 && <span className="badge warn mt-8"><LuTriangleAlert />Caduca en {d} días</span>}
            </div>
            <div className="row"><button className="btn btn-ghost btn-sm btn-icon" aria-label="Editar" onClick={() => setEdit(c)}><LuPencil /></button><button className="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar" onClick={() => update((s) => { s.certifications = s.certifications.filter((x) => x.id !== c.id); })}><LuTrash2 /></button></div>
          </div>
        );
      })}
      {edit && <EditModal title={edit.id ? 'Editar certificación' : 'Añadir certificación'} onClose={() => setEdit(null)} init={edit}
        fields={[['name', 'Certificación'], ['issuer', 'Entidad certificadora'], ['validUntil', 'Válida hasta', 'date']]}
        onSave={(v) => update((s) => { if (v.id) s.certifications = s.certifications.map((x) => (x.id === v.id ? v : x)); else s.certifications.push({ ...v, id: uid('c') }); })} />}
    </div>
  );
}

function TeamTab() {
  const list = useStore((s) => s.team);
  const [edit, setEdit] = useState<TeamMember | null>(null);
  const blank: TeamMember = { id: '', name: '', role: '', years: 0, qualifications: '' };
  return (
    <div className="card">
      <div className="card-head"><h3>Equipo</h3><span className="spacer" /><button className="btn btn-secondary btn-sm" onClick={() => setEdit(blank)}><LuPlus /> Añadir persona</button></div>
      {list.length === 0 ? <Empty icon={<LuUsers />} title="Todavía no hay equipo" body="Los pliegos suelen pedir personal clave con experiencia mínima. Añade a las personas que sueles proponer." action={<button className="btn btn-primary" onClick={() => setEdit(blank)}><LuPlus /> Añadir persona</button>} /> : list.map((t) => (
        <div key={t.id} className="entity">
          <div><div style={{ fontWeight: 600 }}>{t.name}</div><div className="small muted">{t.role} · {t.years} años{t.qualifications ? ` · ${t.qualifications}` : ''}</div></div>
          <div className="row"><button className="btn btn-ghost btn-sm btn-icon" aria-label="Editar" onClick={() => setEdit(t)}><LuPencil /></button><button className="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar" onClick={() => update((s) => { s.team = s.team.filter((x) => x.id !== t.id); })}><LuTrash2 /></button></div>
        </div>
      ))}
      {edit && <EditModal title={edit.id ? 'Editar persona' : 'Añadir persona'} onClose={() => setEdit(null)} init={edit}
        fields={[['name', 'Nombre'], ['role', 'Función'], ['years', 'Años de experiencia', 'number'], ['qualifications', 'Titulación']]}
        onSave={(v) => update((s) => { const x = { ...v, years: Number(v.years) || 0 }; if (v.id) s.team = s.team.map((y) => (y.id === v.id ? x : y)); else s.team.push({ ...x, id: uid('t') }); })} />}
    </div>
  );
}

function CapabilitiesTab() {
  const c = useStore((s) => s.company);
  const [v, setV] = useState('');
  const add = () => { if (!v.trim()) return; update((s) => { s.company.capabilities.push(v.trim()); }); setV(''); };
  return (
    <div className="card">
      <div className="card-head"><h3>Capacidades</h3></div>
      <div className="card-body stack">
        <p className="small muted">Lo que tu empresa puede ofrecer. PROPO compara los requisitos técnicos con esta lista.</p>
        {c.capabilities.length === 0 && <p className="small subtle">Todavía no hay capacidades.</p>}
        <div className="row-wrap">{c.capabilities.map((x, i) => <span key={i} className="badge outline" style={{ height: 28, fontSize: 13 }}>{x}<button className="btn btn-ghost btn-sm btn-icon" style={{ width: 18, height: 18 }} aria-label={`Quitar ${x}`} onClick={() => update((s) => { s.company.capabilities.splice(i, 1); })}><LuTrash2 /></button></span>)}</div>
        <form className="row" onSubmit={(e) => { e.preventDefault(); add(); }}><input className="input" aria-label="Nueva capacidad" placeholder="p. ej. Reparto en línea fría a más de 40 centros" value={v} onChange={(e) => setV(e.target.value)} /><button className="btn btn-secondary" disabled={!v.trim()}><LuPlus /> Añadir</button></form>
      </div>
    </div>
  );
}

function EditModal<T extends { id: string }>({ title, init, fields, onSave, onClose }: { title: string; init: T; fields: [keyof T & string, string, string?][]; onSave: (v: T) => void; onClose: () => void }) {
  const [v, setV] = useState<T>(init);
  const first = fields[0][0];
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" disabled={!String(v[first] ?? '').trim()} onClick={() => { onSave(v); toast('Guardado', 'ok'); onClose(); }}>Guardar</button></>}>
      <div className="stack">
        {fields.map(([k, l, type]) => type === 'checkbox' ? (
          <label key={k} className="row small"><input type="checkbox" checked={!!(v as any)[k]} onChange={(e) => setV({ ...v, [k]: e.target.checked })} /> {l}</label>
        ) : (
          <div key={k} className="field"><label htmlFor={`em-${k}`}>{l}</label>{type === 'textarea'
            ? <textarea id={`em-${k}`} className="textarea" value={(v as any)[k] ?? ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
            : <input id={`em-${k}`} className="input" type={type ?? 'text'} value={(v as any)[k] ?? ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} />}</div>
        ))}
      </div>
    </Modal>
  );
}

function SearchTab() {
  const c = useStore((s) => s.company);
  const selected = SECTORS.filter((x) => x.cpv.some((p) => c.cpvs.includes(p))).map((x) => x.id);
  const toggleSector = (id: string) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    update((s) => { s.company.cpvs = cpvsForSectors(next); s.company.sectors = next.map((n) => SECTORS.find((x) => x.id === n)!.label); });
  };
  const toggleRegion = (id: string) => update((s) => { s.company.regions = s.company.regions.includes(id) ? s.company.regions.filter((x) => x !== id) : [...s.company.regions, id]; });
  return (
    <div className="card">
      <div className="card-head"><h3>Perfil de búsqueda</h3></div>
      <div className="card-body stack gap-20">
        <p className="small muted">PROPO usa este perfil para calcular la compatibilidad de cada licitación y para tus alertas.</p>
        <div className="field">
          <span className="label">Sectores (códigos CPV)</span>
          <div className="row-wrap">{SECTORS.map((s) => <button type="button" key={s.id} className={`chip ${selected.includes(s.id) ? 'on' : ''}`} onClick={() => toggleSector(s.id)}>{selected.includes(s.id) && <LuCheck />}{s.label}</button>)}</div>
          {c.cpvs.length > 0 && <span className="hint">CPV que empiezan por: {c.cpvs.join(', ')}</span>}
        </div>
        <div className="field">
          <span className="label">Regiones donde trabajas</span>
          <div className="row-wrap">{REGIONS.map((r) => <button type="button" key={r.id} className={`chip ${c.regions.includes(r.id) ? 'on' : ''}`} onClick={() => toggleRegion(r.id)}>{c.regions.includes(r.id) && <LuCheck />}{r.label}</button>)}</div>
        </div>
        <div className="field">
          <span className="label">Facturación anual</span>
          <span className="small">{c.revenue || <span className="subtle">Sin indicar — añádela en Datos de empresa para valorar si el importe encaja con tu solvencia.</span>}</span>
        </div>
        <div><button className="btn btn-primary" onClick={() => navigate('/app/tenders')}><LuSearch /> Ver licitaciones compatibles</button></div>
      </div>
    </div>
  );
}
