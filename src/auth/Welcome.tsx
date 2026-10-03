// Bienvenida de una cuenta nueva: asistente de una pregunta por pantalla que rellena la memoria de empresa.
// Todo se puede omitir; lo que se responde se guarda al pulsar «Continuar».
import React, { useEffect, useMemo, useState } from 'react';
import { LuArrowRight, LuChevronLeft, LuCheck, LuSparkles, LuTarget, LuShieldCheck, LuSearch, LuFileText, LuLock } from 'react-icons/lu';
import { Logo, Ring } from '../components/ui';
import { navigate, update, track, useStore, getState } from '../lib/store';
import { knowledgeScore } from '../lib/derive';
import { uid, daysUntil } from '../lib/util';
import { useLive } from '../lib/data/live';
import { INDUSTRY_TO_SECTORS, SECTORS, REGIONS, cpvsForSectors, matchTender } from '../lib/discovery/match';

type StepId = 'intro' | 'what' | 'sectors' | 'regions' | 'size' | 'revenue' | 'certs' | 'legal' | 'experience' | 'habits' | 'done';
const STEPS: StepId[] = ['intro', 'what', 'sectors', 'regions', 'size', 'revenue', 'certs', 'legal', 'experience', 'habits', 'done'];
const QUESTIONS = STEPS.length - 2;

const EMPLOYEES = ['1–9', '10–49', '50–99', '100–249', '250–500', 'Más de 500'];
const FREQUENCY = ['Menos de una al mes', '1–3 al mes', '4–10 al mes', 'Más de 10'];
const TEAM = ['Solo yo', '2–3', '4–10', 'Más de 10'];
const CERTS: [string, 'quality' | 'environmental' | 'safety' | 'industry'][] = [
  ['ISO 9001 — Gestión de la calidad', 'quality'], ['ISO 14001 — Gestión ambiental', 'environmental'],
  ['ISO 45001 — Seguridad y salud en el trabajo', 'safety'], ['ISO 22000 — Seguridad alimentaria', 'industry'],
  ['ISO 27001 — Seguridad de la información', 'industry'], ['ENS — Esquema Nacional de Seguridad', 'industry'],
];

/** Por qué se hace cada pregunta: se muestra en el panel lateral. */
const WHY: Record<StepId, string> = {
  intro: '',
  what: 'PROPO compara tu actividad con el objeto de cada contrato. Cuanto más concreta sea la descripción, mejor distingue una licitación ideal de una parecida.',
  sectors: 'Cada licitación se publica con códigos CPV. Con tus sectores, PROPO descarta lo que no es para ti y sube arriba lo que sí.',
  regions: 'Un contrato perfecto a 900 km no suele compensar. Con tus zonas, PROPO prioriza lo que puedes ejecutar.',
  size: 'Muchos pliegos exigen una plantilla mínima o reservan lotes a pymes. Así sabemos cuáles están a tu alcance.',
  revenue: 'La solvencia económica suele pedirse en proporción al importe del contrato. Con tu facturación, PROPO te avisa de los que se te quedan grandes.',
  certs: 'Algunas licitaciones exigen certificaciones concretas para poder presentarse. PROPO las detecta en el pliego y comprueba si las tienes.',
  legal: 'Son los datos que encabezan cualquier oferta. PROPO los escribe por ti en cada propuesta.',
  experience: 'Casi todos los pliegos piden acreditar contratos similares. Con uno ya puede empezar a puntuar tu experiencia.',
  habits: 'Sirve para ajustar los avisos y el ritmo de trabajo a tu equipo. No afecta a la compatibilidad.',
  done: '',
};

export function Welcome() {
  const user = useStore((s) => s.user);
  const st = useStore((s) => s);
  const company = st.company;
  const { tenders } = useLive();
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const id = STEPS[step];

  const [what, setWhat] = useState(st.onboarding.whatWeDo || company.description);
  const [sectors, setSectors] = useState<string[]>(() => INDUSTRY_TO_SECTORS[company.industry] ?? []);
  const [regions, setRegions] = useState<string[]>(company.regions);
  const [employees, setEmployees] = useState(company.employees);
  const [revenue, setRevenue] = useState(company.revenue);
  const [certs, setCerts] = useState<string[]>(() => st.certifications.map((c) => c.name));
  const [legal, setLegal] = useState({ legalName: company.legalName, taxId: company.taxId });
  const [exp, setExp] = useState({ title: '', client: '', years: '', value: '' });
  const [freq, setFreq] = useState(st.onboarding.frequency);
  const [team, setTeam] = useState(st.onboarding.teamSize);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const allSpain = regions.length === REGIONS.length;

  /** Guarda en la memoria de empresa la respuesta del paso actual. */
  const save = () => update((s) => {
    const done = (k: string) => { if (!s.onboarding.completedSteps.includes(k)) s.onboarding.completedSteps.push(k); };
    if (id === 'what') { s.onboarding.whatWeDo = what.trim(); if (what.trim()) s.company.description = what.trim(); }
    if (id === 'sectors') { s.company.cpvs = cpvsForSectors(sectors); s.company.sectors = sectors.map((x) => SECTORS.find((y) => y.id === x)!.label); }
    if (id === 'regions') s.company.regions = regions;
    if (id === 'size') s.company.employees = employees;
    if (id === 'revenue') s.company.revenue = revenue.trim();
    if (id === 'certs') {
      for (const [name, category] of CERTS) if (certs.includes(name) && !s.certifications.some((c) => c.name === name)) s.certifications.push({ id: uid('c'), name, issuer: '', validUntil: '', category });
      s.certifications = s.certifications.filter((c) => certs.includes(c.name) || !CERTS.some(([n]) => n === c.name));
      if (certs.length) done('certifications');
    }
    if (id === 'legal') { const n = legal.legalName.trim(); if (n) { s.company.legalName = n; if (!s.company.tradeName) s.company.tradeName = n; } s.company.taxId = legal.taxId.trim().toUpperCase(); done('details'); }
    if (id === 'experience' && exp.title.trim()) {
      s.pastProjects.push({ id: uid('pp'), title: exp.title.trim(), client: exp.client.trim(), years: exp.years.trim(), value: exp.value.trim(), sector: s.company.industry, description: '', hasCertificate: false });
      done('projects');
    }
    if (id === 'habits') { s.onboarding.frequency = freq; s.onboarding.teamSize = team; }
  });

  const answered: Record<StepId, boolean> = {
    intro: true, done: true,
    what: what.trim().length > 0, sectors: sectors.length > 0, regions: regions.length > 0, size: !!employees, revenue: revenue.trim().length > 0,
    certs: certs.length > 0, legal: legal.legalName.trim().length > 0 || legal.taxId.trim().length > 0, experience: exp.title.trim().length > 0, habits: !!freq || !!team,
  };
  const go = (n: number) => { setStep(Math.max(0, Math.min(STEPS.length - 1, n))); try { window.scrollTo(0, 0); } catch { /* ignore */ } };
  const next = () => { if (id !== 'intro' && id !== 'done') save(); go(step + 1); };
  const skip = () => { setSkipped((n) => n + 1); track('welcome_question_skipped', { question: id }); go(step + 1); };
  const finish = (to: string) => {
    update((s) => { s.onboarding.dismissed = true; });
    track('welcome_answered', { sectors: sectors.length, regions: regions.length, skipped });
    navigate(to);
  };

  // Enter continúa (en los cuadros de texto largos, Ctrl+Enter).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || id === 'done') return;
      const el = e.target as HTMLElement | null;
      if (el?.tagName === 'BUTTON' || (el?.tagName === 'TEXTAREA' && !e.ctrlKey && !e.metaKey)) return;
      if (id === 'intro' || answered[id]) { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const score = knowledgeScore(st).score;
  const fit = useMemo(() => {
    if (id !== 'done') return { open: 0, high: 0 };
    const c = getState().company; let open = 0; let high = 0;
    for (const t of tenders) { if (t.deadline && (daysUntil(t.deadline) ?? -1) < 0) continue; open++; if (matchTender(t, c).score >= 70) high++; }
    return { open, high };
  }, [id, tenders]);

  const first = user?.name ? user.name.split(' ')[0] : '';
  const name = company.tradeName || company.legalName || 'tu empresa';
  const q = step; // n.º de pregunta (la intro es el 0)

  return (
    <div className="wz">
      <div className="wz-bg" aria-hidden="true"><span className="wz-blob b1" /><span className="wz-blob b2" /><span className="wz-blob b3" /><span className="wz-grid" /></div>

      <header className="wz-top">
        <Logo />
        {id !== 'intro' && id !== 'done' && (
          <div className="wz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS} aria-valuenow={q} aria-label={`Pregunta ${q} de ${QUESTIONS}`}>
            <div className="wz-progress-bar"><span style={{ width: `${(q / QUESTIONS) * 100}%` }} /></div>
            <span className="wz-progress-n num">{q} / {QUESTIONS}</span>
          </div>
        )}
        <span className="spacer" />
        {id !== 'done' && <button className="btn btn-ghost btn-sm" onClick={() => finish('/app')}>Hacerlo más tarde</button>}
      </header>

      <div className={`wz-body ${id === 'intro' || id === 'done' ? 'solo' : ''}`}>
        <main className="wz-card" key={id}>
          {id === 'intro' && (
            <>
              <span className="wz-pill"><LuSparkles /> Memoria de empresa</span>
              <h1 className="wz-title">{first ? `Hola, ${first}.` : 'Te damos la bienvenida.'}<br /><span className="blue">Vamos a enseñarle a PROPO quién es {name}.</span></h1>
              <p className="wz-lead">Son {QUESTIONS} preguntas cortas, unos dos minutos. Con tus respuestas PROPO construye la memoria de tu empresa.</p>
              <div className="wz-why-box">
                <strong>¿Por qué es necesario?</strong>
                <p>Cada día se publican miles de licitaciones. PROPO las compara una a una con la memoria de tu empresa: a qué te dedicas, dónde trabajas, tu tamaño y tu experiencia. Sin esos datos no puede saber cuáles encajan contigo; con ellos, te enseña primero las ideales.</p>
                <ul className="wz-points">
                  <li><LuTarget /><span><strong>Licitaciones a tu medida.</strong> Ordenadas por compatibilidad real con tu empresa.</span></li>
                  <li><LuFileText /><span><strong>Menos trabajo en cada oferta.</strong> PROPO reutiliza estos datos al redactar tus propuestas.</span></li>
                  <li><LuLock /><span><strong>Privado.</strong> Solo lo usa tu empresa; nunca se emplea para entrenar modelos de IA.</span></li>
                </ul>
              </div>
              <div className="wz-foot">
                <button className="btn btn-primary btn-lg" onClick={next} autoFocus>Empezar <LuArrowRight /></button>
                <span className="small subtle">Puedes omitir cualquier pregunta y completarla después en Empresa.</span>
              </div>
            </>
          )}

          {id === 'what' && (
            <Question n={q} title="¿A qué se dedica tu empresa?" sub="Cuéntalo como se lo dirías a un cliente, en una o dos frases.">
              <textarea className="textarea wz-input" autoFocus aria-label="A qué se dedica tu empresa" placeholder="p. ej. Comedores escolares y de empresa en el área de Barcelona, con cocina central propia." value={what} onChange={(e) => setWhat(e.target.value)} />
            </Question>
          )}

          {id === 'sectors' && (
            <Question n={q} title="¿Qué tipo de contratos buscas?" sub="Elige todos los que te interesen.">
              <div className="row-wrap wz-chips">
                {SECTORS.filter((s) => s.cpv.length).map((s) => <button type="button" key={s.id} className={`chip ${sectors.includes(s.id) ? 'on' : ''}`} aria-pressed={sectors.includes(s.id)} onClick={() => toggle(sectors, setSectors, s.id)}>{sectors.includes(s.id) && <LuCheck />}{s.label}</button>)}
              </div>
            </Question>
          )}

          {id === 'regions' && (
            <Question n={q} title="¿Dónde puedes trabajar?" sub="Marca las comunidades en las que ejecutarías un contrato.">
              <div className="row-wrap wz-chips">
                <button type="button" className={`chip ${allSpain ? 'on' : ''}`} aria-pressed={allSpain} onClick={() => setRegions(allSpain ? [] : REGIONS.map((r) => r.id))}>{allSpain && <LuCheck />}Toda España</button>
                {REGIONS.map((r) => <button type="button" key={r.id} className={`chip ${regions.includes(r.id) ? 'on' : ''}`} aria-pressed={regions.includes(r.id)} onClick={() => toggle(regions, setRegions, r.id)}>{regions.includes(r.id) && <LuCheck />}{r.label}</button>)}
              </div>
            </Question>
          )}

          {id === 'size' && (
            <Question n={q} title="¿Cuántas personas trabajan en la empresa?">
              <div className="wz-choices">
                {EMPLOYEES.map((o) => <button type="button" key={o} className={`choice ${employees === o ? 'on' : ''}`} aria-pressed={employees === o} onClick={() => setEmployees(employees === o ? '' : o)}>{o}</button>)}
              </div>
            </Question>
          )}

          {id === 'revenue' && (
            <Question n={q} title="¿Cuánto facturáis al año, aproximadamente?" sub="Vale una cifra orientativa del último ejercicio.">
              <input className="input wz-input" autoFocus aria-label="Facturación anual" placeholder="p. ej. 2,4 M€ (2025)" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
            </Question>
          )}

          {id === 'certs' && (
            <Question n={q} title="¿Tenéis alguna de estas certificaciones?" sub="Marca las que estén en vigor. Si no tienes ninguna, omite la pregunta.">
              <div className="wz-choices two">
                {CERTS.map(([n]) => <button type="button" key={n} className={`choice ${certs.includes(n) ? 'on' : ''}`} aria-pressed={certs.includes(n)} onClick={() => toggle(certs, setCerts, n)}>{certs.includes(n) ? <LuCheck style={{ color: 'var(--accent)' }} /> : <LuShieldCheck />}{n}</button>)}
              </div>
            </Question>
          )}

          {id === 'legal' && (
            <Question n={q} title="¿Con qué nombre y NIF os presentáis?" sub="Tal como constan en las escrituras.">
              <div className="grid-2 wz-fields">
                <div className="field"><label htmlFor="wz-legal">Razón social</label><input id="wz-legal" className="input wz-input" autoFocus value={legal.legalName} onChange={(e) => setLegal({ ...legal, legalName: e.target.value })} /></div>
                <div className="field"><label htmlFor="wz-tax">NIF</label><input id="wz-tax" className="input wz-input" placeholder="p. ej. B12345678" value={legal.taxId} onChange={(e) => setLegal({ ...legal, taxId: e.target.value })} /></div>
              </div>
            </Question>
          )}

          {id === 'experience' && (
            <Question n={q} title="¿Cuál es el contrato que mejor os representa?" sub="Uno basta para empezar. Podrás añadir más en Empresa → Proyectos.">
              <div className="grid-2 wz-fields">
                <div className="field"><label htmlFor="wz-pt">Contrato o proyecto</label><input id="wz-pt" className="input wz-input" autoFocus placeholder="p. ej. Comedores escolares — 12 escuelas" value={exp.title} onChange={(e) => setExp({ ...exp, title: e.target.value })} /></div>
                <div className="field"><label htmlFor="wz-pc">Cliente</label><input id="wz-pc" className="input wz-input" value={exp.client} onChange={(e) => setExp({ ...exp, client: e.target.value })} /></div>
                <div className="field"><label htmlFor="wz-py">Años</label><input id="wz-py" className="input wz-input" placeholder="2022–2025" value={exp.years} onChange={(e) => setExp({ ...exp, years: e.target.value })} /></div>
                <div className="field"><label htmlFor="wz-pv">Importe anual</label><input id="wz-pv" className="input wz-input" placeholder="450.000 € / año" value={exp.value} onChange={(e) => setExp({ ...exp, value: e.target.value })} /></div>
              </div>
            </Question>
          )}

          {id === 'habits' && (
            <Question n={q} title="¿Cómo preparáis las propuestas?">
              <div className="field"><span className="label">¿Con qué frecuencia?</span>
                <div className="wz-choices">{FREQUENCY.map((o) => <button type="button" key={o} className={`choice ${freq === o ? 'on' : ''}`} aria-pressed={freq === o} onClick={() => setFreq(freq === o ? '' : o)}>{o}</button>)}</div>
              </div>
              <div className="field" style={{ marginTop: 20 }}><span className="label">¿Cuántas personas participan?</span>
                <div className="wz-choices">{TEAM.map((o) => <button type="button" key={o} className={`choice ${team === o ? 'on' : ''}`} aria-pressed={team === o} onClick={() => setTeam(team === o ? '' : o)}>{o}</button>)}</div>
              </div>
            </Question>
          )}

          {id === 'done' && (
            <>
              <span className="wz-pill ok"><LuCheck /> Memoria creada</span>
              <h1 className="wz-title">PROPO ya conoce {name}.</h1>
              <div className="wz-result">
                <Ring value={score} size={84} stroke={8} tone="accent" />
                <div>
                  <div className="eyebrow">Memoria de empresa</div>
                  {fit.high > 0
                    ? <p className="wz-result-main"><strong className="num">{fit.high.toLocaleString('es-ES')}</strong> de {fit.open.toLocaleString('es-ES')} licitaciones abiertas encajan muy bien con tu empresa.</p>
                    : <p className="wz-result-main">Hay <strong className="num">{fit.open.toLocaleString('es-ES')}</strong> licitaciones abiertas esperándote, ordenadas por compatibilidad.</p>}
                  <p className="small muted">{skipped > 0 ? `Has omitido ${skipped} ${skipped === 1 ? 'pregunta' : 'preguntas'}. Complétalas cuando quieras en Empresa: cuanto más sepa PROPO, mejor acierta.` : 'Cuanto más añadas en Empresa, mejor acierta PROPO y menos te pregunta en cada propuesta.'}</p>
                </div>
              </div>
              <div className="wz-foot">
                <button className="btn btn-primary btn-lg" onClick={() => finish('/app/tenders')} autoFocus><LuSearch /> Ver mis licitaciones</button>
                <button className="btn btn-secondary btn-lg" onClick={() => finish('/app/documents')}>Subir documentos de empresa</button>
              </div>
            </>
          )}

          {id !== 'intro' && id !== 'done' && (
            <div className="wz-foot">
              <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}><LuChevronLeft /> Atrás</button>
              <span className="spacer" />
              <button type="button" className="btn btn-ghost wz-skip" onClick={skip}>Omitir pregunta</button>
              <button type="button" className="btn btn-primary btn-lg" onClick={next} disabled={!answered[id]}>Continuar <LuArrowRight /></button>
            </div>
          )}
        </main>

        {id !== 'intro' && id !== 'done' && (
          <aside className="wz-side">
            <div className="wz-side-card">
              <div className="eyebrow">¿Por qué te lo preguntamos?</div>
              <p className="wz-side-why" key={id}>{WHY[id]}</p>
              <hr />
              <p className="small muted">Estas respuestas forman la <strong>memoria de tu empresa</strong>. PROPO la necesita para encontrar tus licitaciones ideales entre las miles que se publican: sin ella no puede saber cuáles encajan contigo.</p>
              <div className="row wz-side-score"><Ring value={score} size={44} stroke={5} tone="accent" /><div><div style={{ fontWeight: 650 }}>Memoria al {score} %</div><div className="xs subtle">Crece con cada respuesta</div></div></div>
            </div>
            <p className="xs subtle row" style={{ gap: 6, alignItems: 'flex-start' }}><LuLock style={{ width: 13, height: 13, flex: 'none', marginTop: 2 }} />Tus datos son privados de tu empresa y no se usan para entrenar modelos de IA.</p>
          </aside>
        )}
      </div>
    </div>
  );
}

function Question({ n, title, sub, children }: { n: number; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <>
      <span className="wz-n num">Pregunta {n} de {QUESTIONS}</span>
      <h1 className="wz-title q">{title}</h1>
      {sub && <p className="wz-lead">{sub}</p>}
      <div className="wz-answer">{children}</div>
    </>
  );
}
