import React, { useRef, useState } from 'react';
import { LuArrowRight, LuCheck, LuUpload, LuPlus, LuX, LuCircleCheck, LuTriangleAlert, LuBuilding2, LuFileText, LuBriefcase, LuAward, LuSearch } from 'react-icons/lu';
import { Logo, Modal, Ring } from '../components/ui';
import { navigate, setState, newWorkspace, getState, update, track, useStore, toast } from '../lib/store';
import { addVaultFiles } from '../lib/actions';
import { knowledgeScore } from '../lib/derive';
import { uid } from '../lib/util';
import { startDemo } from '../marketing/Layout';
import { ACCEPTED } from '../lib/pipeline/parse';
import { INDUSTRIES } from '../lib/discovery/match';

const ROLES = ['Gerencia / Dirección', 'Licitaciones', 'Comercial / Desarrollo de negocio', 'Operaciones', 'Administración y finanzas', 'Consultoría', 'Otro'];

function AuthSide() {
  return (
    <aside className="auth-side">
      <Logo onClick={() => navigate('/')} />
      <div>
        <h2 style={{ fontSize: 34, lineHeight: 1.1, letterSpacing: '-.04em', fontWeight: 800 }}>Encuentra las licitaciones.<br /><span className="blue">PROPO prepara el resto.</span></h2>
        <div className="pipeline mt-32">
          {['Encuentra licitaciones que encajan con tu empresa', 'Sube el pliego y PROPO extrae cada requisito', 'Tus datos de empresa cubren lo que pueden', 'Revisa la propuesta redactada y apruébala'].map((t, i) => (
            <div key={t} className="pipe-step done" style={{ alignItems: 'flex-start' }}><span className="ic"><span style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span></span><span>{t}</span></div>
          ))}
        </div>
      </div>
      <p className="small subtle">Tus documentos son privados de tu empresa. PROPO nunca los usa para entrenar modelos de IA.</p>
    </aside>
  );
}

export function Signup() {
  const [f, setF] = useState({ name: '', email: '', password: '', company: '', role: ROLES[1], industry: '' });
  const [err, setErr] = useState<string | null>(null);
  const [google, setGoogle] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Introduce un email de trabajo válido.');
    if (f.password.length < 8) return setErr('Usa al menos 8 caracteres en la contraseña.');
    if (!f.company.trim()) return setErr('Introduce el nombre de tu empresa.');
    if (!f.industry) return setErr('Elige tu sector.');
    setState(newWorkspace({ name: f.name.trim() || f.email.split('@')[0], email: f.email.trim(), role: f.role, company: f.company.trim(), industry: f.industry }));
    track('signup', { industry: f.industry, role: f.role });
    navigate('/welcome');
  };
  return (
    <div className="auth">
      <AuthSide />
      <main className="auth-main">
        <div className="auth-card">
          <div className="hide-desktop" style={{ marginBottom: 24 }}><Logo onClick={() => navigate('/')} /></div>
          <h1>Crea tu cuenta de PROPO</h1>
          <p className="muted mt-8">14 días de prueba con una propuesta completa. Sin tarjeta.</p>
          <button type="button" className="btn btn-secondary btn-lg oauth-btn mt-24" onClick={() => setGoogle(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.33z" /><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.23-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.82-1.76-5.6-4.12H3.06v2.58A10 10 0 0 0 12 22z" /><path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 8.96l3.34-2.58z" /><path fill="#EA4335" d="M12 5.98c1.47 0 2.8.5 3.84 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2 10 10 0 0 0 3.06 7.52l3.34 2.58C7.18 7.74 9.4 5.98 12 5.98z" /></svg>
            Continuar con Google
          </button>
          <div className="or mt-20">o</div>
          <form className="stack mt-20" onSubmit={submit} noValidate>
            <div className="grid-2">
              <div className="field"><label htmlFor="su-name">Tu nombre</label><input id="su-name" className="input" value={f.name} onChange={set('name')} autoComplete="name" /></div>
              <div className="field"><label htmlFor="su-company">Empresa</label><input id="su-company" className="input" value={f.company} onChange={set('company')} autoComplete="organization" /></div>
            </div>
            <div className="field"><label htmlFor="su-email">Email de trabajo</label><input id="su-email" className="input" type="email" value={f.email} onChange={set('email')} autoComplete="email" /></div>
            <div className="field"><label htmlFor="su-pass">Contraseña</label><input id="su-pass" className="input" type="password" value={f.password} onChange={set('password')} autoComplete="new-password" /><span className="hint">Al menos 8 caracteres.</span></div>
            <div className="grid-2">
              <div className="field"><label htmlFor="su-role">Cargo</label><select id="su-role" className="select" value={f.role} onChange={set('role')}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
              <div className="field"><label htmlFor="su-ind">Sector</label><select id="su-ind" className="select" value={f.industry} onChange={set('industry')}><option value="">Elige…</option>{INDUSTRIES.map((r) => <option key={r}>{r}</option>)}</select></div>
            </div>
            {err && <div className="error-text" role="alert">{err}</div>}
            <button className="btn btn-primary btn-lg">Crear cuenta <LuArrowRight /></button>
            <p className="xs subtle">Al crear tu cuenta aceptas las <a onClick={() => navigate('/terms')} style={{ cursor: 'pointer' }}>Condiciones</a> y la <a onClick={() => navigate('/privacy')} style={{ cursor: 'pointer' }}>Política de privacidad</a>.</p>
          </form>
          <div className="row mt-24 small muted" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <span>¿Ya tienes cuenta? <a style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Inicia sesión</a></span>
            <span className="row" style={{ gap: 14 }}><a style={{ cursor: 'pointer' }} onClick={() => startDemo('/app')}>Explorar la demo</a><a style={{ cursor: 'pointer' }} onClick={() => startDemo('/app/projects/p_sample', true)}>Demo completa</a></span>
          </div>
          <p className="xs subtle mt-16" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>Versión de prueba: tu cuenta y tu espacio se guardan solo en este navegador y la contraseña no se almacena. En producción se usa Supabase Auth.</p>
        </div>
      </main>
      {google && (
        <Modal title="Acceso con Google" onClose={() => setGoogle(false)} footer={<button className="btn btn-primary" onClick={() => setGoogle(false)}>Usar email</button>}>
          <p className="muted">El acceso con Google funciona con Supabase Auth (OAuth) en la versión de producción. No está conectado en esta versión de prueba, así que crea tu cuenta con email.</p>
        </Modal>
      )}
    </div>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = getState();
    if (s.user && s.user.email.toLowerCase() === email.trim().toLowerCase()) {
      if (pw.length < 8) return setErr('Introduce tu contraseña (al menos 8 caracteres).');
      update((st) => { st.signedOut = false; });
      track('login');
      navigate('/app');
    } else setErr('No hay ninguna cuenta de PROPO con este email en este navegador. Crea una cuenta o explora la demo.');
  };
  return (
    <div className="auth">
      <AuthSide />
      <main className="auth-main">
        <div className="auth-card">
          <h1>Inicia sesión en PROPO</h1>
          <form className="stack mt-24" onSubmit={submit} noValidate>
            <div className="field"><label htmlFor="li-email">Email de trabajo</label><input id="li-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
            <div className="field"><label htmlFor="li-pass">Contraseña</label><input id="li-pass" className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></div>
            {err && <div className="error-text" role="alert">{err}</div>}
            <button className="btn btn-primary btn-lg">Iniciar sesión</button>
          </form>
          <div className="row mt-24 small muted" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <span>¿Nuevo en PROPO? <a style={{ cursor: 'pointer' }} onClick={() => navigate('/signup')}>Crea una cuenta</a></span>
            <span className="row" style={{ gap: 14 }}><a style={{ cursor: 'pointer' }} onClick={() => startDemo('/app')}>Explorar la demo</a><a style={{ cursor: 'pointer' }} onClick={() => startDemo('/app/projects/p_sample', true)}>Demo completa</a></span>
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------

const STEPS = [
  { id: 'details', label: 'Datos de empresa', icon: <LuBuilding2 /> },
  { id: 'documents', label: 'Documentos de empresa', icon: <LuFileText /> },
  { id: 'projects', label: 'Proyectos previos', icon: <LuBriefcase /> },
  { id: 'certifications', label: 'Certificaciones', icon: <LuAward /> },
  { id: 'ready', label: 'Listo', icon: <LuCheck /> },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const st = useStore((s) => s);
  const next = (id?: string) => {
    if (id) update((s) => { if (!s.onboarding.completedSteps.includes(id)) s.onboarding.completedSteps.push(id); });
    setStep((x) => Math.min(STEPS.length - 1, x + 1));
  };
  const skip = () => setStep((x) => Math.min(STEPS.length - 1, x + 1));
  const finish = (to: string) => { update((s) => { s.onboarding.dismissed = true; }); track('onboarding_finished', { steps: getState().onboarding.completedSteps.length }); navigate(to); };
  return (
    <div className="auth" style={{ gridTemplateColumns: '1fr' }}>
      <main className="auth-main" style={{ placeItems: 'start center' }}>
        <div className="auth-card" style={{ width: 'min(640px, 100%)' }}>
          <div className="row"><Logo /><span className="spacer" /><button className="btn btn-ghost btn-sm" onClick={() => finish('/app')}>Saltar configuración</button></div>
          <div className="row mt-32" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span className="eyebrow">Paso {step + 1} de {STEPS.length} · {STEPS[step].label}</span>
            <div className="steps-dots">{STEPS.map((s, i) => <i key={s.id} className={i <= step ? 'on' : ''} />)}</div>
          </div>
          <h1 className="mt-12">{step === 4 ? 'Todo listo.' : 'Configuremos tu empresa.'}</h1>
          <p className="muted mt-8">{step === 4 ? 'PROPO usará lo que has añadido en cada propuesta. Puedes completar el resto cuando quieras.' : 'PROPO lo usa para cumplir requisitos y redactar propuestas. Todo es opcional y se puede completar más tarde.'}</p>
          <div className="mt-24">
            {step === 0 && <StepDetails onNext={() => next('details')} onSkip={skip} />}
            {step === 1 && <StepDocs onNext={() => next()} onSkip={skip} />}
            {step === 2 && <StepProjects onNext={() => next('projects')} onSkip={skip} />}
            {step === 3 && <StepCerts onNext={() => next('certifications')} onSkip={skip} />}
            {step === 4 && (
              <div className="stack gap-20">
                <div className="card card-pad row gap-16">
                  <Ring value={knowledgeScore(st).score} size={72} stroke={7} tone="accent" />
                  <div><div className="eyebrow">Memoria de empresa</div><div style={{ fontWeight: 750, fontSize: 18, marginTop: 4 }}>PROPO ya conoce {st.company.legalName || 'tu empresa'}.</div><p className="small muted">Cuanto más añadas, menos preguntas te hará PROPO en cada propuesta.</p></div>
                </div>
                <div className="row-wrap">
                  <button className="btn btn-primary btn-lg" onClick={() => finish('/app/tenders')}><LuSearch /> Ver licitaciones para mi empresa</button>
                  <button className="btn btn-secondary btn-lg" onClick={() => finish('/app/projects?new=1')}>Subir un pliego</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StepFoot({ onSkip, primary }: { onSkip: () => void; primary: React.ReactNode }) {
  return <div className="row mt-24">{primary}<button type="button" className="btn btn-ghost" onClick={onSkip}>Saltar por ahora</button></div>;
}

function StepDetails({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const c = useStore((s) => s.company);
  const [f, setF] = useState({ ...c });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const save = () => { update((s) => { s.company = { ...s.company, ...f, tradeName: f.tradeName || f.legalName }; }); onNext(); };
  return (
    <div className="stack">
      <div className="grid-2">
        <div className="field"><label htmlFor="ob-legal">Razón social</label><input id="ob-legal" className="input" value={f.legalName} onChange={set('legalName')} /></div>
        <div className="field"><label htmlFor="ob-tax">NIF</label><input id="ob-tax" className="input" value={f.taxId} onChange={set('taxId')} placeholder="p. ej. B12345678" /></div>
        <div className="field"><label htmlFor="ob-country">País</label><input id="ob-country" className="input" value={f.country} onChange={set('country')} /></div>
        <div className="field"><label htmlFor="ob-emp">Empleados</label><select id="ob-emp" className="select" value={f.employees} onChange={set('employees')}><option value="">Elige…</option>{['1–9', '10–49', '50–99', '100–249', '250–500', 'Más de 500'].map((o) => <option key={o}>{o}</option>)}</select></div>
        <div className="field"><label htmlFor="ob-rev">Facturación anual</label><input id="ob-rev" className="input" value={f.revenue} onChange={set('revenue')} placeholder="p. ej. 2,4 M€ (2025)" /></div>
        <div className="field"><label htmlFor="ob-web">Web</label><input id="ob-web" className="input" value={f.website} onChange={set('website')} /></div>
      </div>
      <div className="field"><label htmlFor="ob-addr">Dirección</label><input id="ob-addr" className="input" value={f.address} onChange={set('address')} /></div>
      <div className="field"><label htmlFor="ob-desc">A qué se dedica tu empresa</label><textarea id="ob-desc" className="textarea" value={f.description} onChange={set('description')} /></div>
      <StepFoot onSkip={onSkip} primary={<button className="btn btn-primary" onClick={save}>Guardar y continuar</button>} />
    </div>
  );
}

function StepDocs({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ name: string; ok: boolean; note?: string }[]>([]);
  const [over, setOver] = useState(false);
  const handle = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const list = Array.from(files);
    const res = await addVaultFiles(list, 'corporate');
    setDone((d) => [...d, ...list.filter((f) => !res.failed.some((x) => x.name === f.name)).map((f) => ({ name: f.name, ok: true })), ...res.failed.map((x) => ({ name: x.name, ok: false, note: x.note }))]);
    setBusy(false);
  };
  return (
    <div className="stack">
      <div className={`dropzone ${over ? 'over' : ''}`} onClick={() => input.current?.click()} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }} role="button" tabIndex={0}>
        <LuUpload />
        <strong>{busy ? 'Leyendo documentos…' : 'Sube los documentos de tu empresa'}</strong>
        <span className="small muted">Escrituras, seguros, certificados ISO, cuentas anuales, CV. PDF, DOCX, XLSX o ZIP.</span>
        <input ref={input} type="file" multiple accept={ACCEPTED} hidden onChange={(e) => handle(e.target.files)} />
      </div>
      {done.length > 0 && (
        <div className="upload-list">
          {done.map((d, i) => <div key={i} className="upload-row">{d.ok ? <LuCircleCheck className="state-ico ok" /> : <LuTriangleAlert className="state-ico warn" />}<span className="grow truncate">{d.name}</span>{d.note && <span className="xs subtle">{d.note}</span>}</div>)}
        </div>
      )}
      <p className="small subtle">Súbelos una vez. PROPO los reutiliza en cada propuesta. Puedes clasificarlos más tarde en Documentos.</p>
      <StepFoot onSkip={onSkip} primary={<button className="btn btn-primary" disabled={busy} onClick={onNext}>Continuar</button>} />
    </div>
  );
}

function StepProjects({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const projects = useStore((s) => s.pastProjects);
  const [f, setF] = useState({ title: '', client: '', years: '', value: '' });
  const add = () => {
    if (!f.title.trim()) return;
    update((s) => { s.pastProjects.push({ id: uid('pp'), title: f.title.trim(), client: f.client.trim(), years: f.years.trim(), value: f.value.trim(), sector: s.company.industry, description: '', hasCertificate: false }); });
    setF({ title: '', client: '', years: '', value: '' });
  };
  return (
    <div className="stack">
      <p className="small muted">La mayoría de pliegos piden acreditar experiencia con contratos similares. Añade los que sueles citar.</p>
      {projects.length > 0 && <div className="upload-list">{projects.map((p) => <div key={p.id} className="upload-row"><LuBriefcase className="state-ico muted" /><span className="grow truncate"><strong>{p.title}</strong> <span className="muted">· {p.client} · {p.years} · {p.value}</span></span><button className="btn btn-ghost btn-sm btn-icon" aria-label="Quitar" onClick={() => update((s) => { s.pastProjects = s.pastProjects.filter((x) => x.id !== p.id); })}><LuX /></button></div>)}</div>}
      <div className="well stack">
        <div className="grid-2">
          <div className="field"><label htmlFor="pp-t">Proyecto</label><input id="pp-t" className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="p. ej. Comedores escolares — 12 escuelas" /></div>
          <div className="field"><label htmlFor="pp-c">Cliente</label><input id="pp-c" className="input" value={f.client} onChange={(e) => setF({ ...f, client: e.target.value })} /></div>
          <div className="field"><label htmlFor="pp-y">Años</label><input id="pp-y" className="input" value={f.years} onChange={(e) => setF({ ...f, years: e.target.value })} placeholder="2022–2025" /></div>
          <div className="field"><label htmlFor="pp-v">Importe anual</label><input id="pp-v" className="input" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} placeholder="450.000 € / año" /></div>
        </div>
        <div><button className="btn btn-secondary btn-sm" onClick={add} disabled={!f.title.trim()}><LuPlus /> Añadir proyecto</button></div>
      </div>
      <StepFoot onSkip={onSkip} primary={<button className="btn btn-primary" onClick={onNext}>Continuar</button>} />
    </div>
  );
}

function StepCerts({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const certs = useStore((s) => s.certifications);
  const [custom, setCustom] = useState('');
  const quick: [string, 'quality' | 'environmental' | 'safety' | 'industry'][] = [['ISO 9001 — Gestión de la calidad', 'quality'], ['ISO 14001 — Gestión ambiental', 'environmental'], ['ISO 45001 — Seguridad y salud en el trabajo', 'safety'], ['ISO 22000 — Seguridad alimentaria', 'industry'], ['ISO 27001 — Seguridad de la información', 'industry'], ['ENS — Esquema Nacional de Seguridad', 'industry']];
  const has = (n: string) => certs.some((c) => c.name === n);
  const toggle = (n: string, cat: any) => update((s) => { if (has(n)) s.certifications = s.certifications.filter((c) => c.name !== n); else s.certifications.push({ id: uid('c'), name: n, issuer: '', validUntil: '', category: cat }); });
  return (
    <div className="stack">
      <div className="grid-2" style={{ gap: 8 }}>
        {quick.map(([n, cat]) => <button key={n} type="button" className={`choice ${has(n) ? 'on' : ''}`} onClick={() => toggle(n, cat)}>{has(n) ? <LuCircleCheck style={{ color: 'var(--accent)' }} /> : <LuAward />}{n}</button>)}
      </div>
      <div className="row"><input className="input" aria-label="Otra certificación" placeholder="Otra certificación" value={custom} onChange={(e) => setCustom(e.target.value)} /><button className="btn btn-secondary" disabled={!custom.trim()} onClick={() => { toggle(custom.trim(), 'other'); setCustom(''); }}><LuPlus /> Añadir</button></div>
      <p className="small subtle">Añade la fecha de validez y sube los certificados en Empresa → Certificaciones para que PROPO los adjunte y te avise antes de que caduquen.</p>
      <StepFoot onSkip={onSkip} primary={<button className="btn btn-primary" onClick={() => { if (certs.length) toast(`${certs.length} certificación${certs.length > 1 ? 'es guardadas' : ' guardada'}`, 'ok'); onNext(); }}>Continuar</button>} />
    </div>
  );
}
