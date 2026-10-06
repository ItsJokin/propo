import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LuArrowRight, LuCircleCheck, LuCircleAlert, LuCircleX, LuFileText, LuCheck, LuPlus, LuListChecks, LuSearch,
  LuShieldCheck, LuBuilding2, LuFileCheck, LuLoaderCircle, LuHouse, LuFolderKanban, LuLibrary, LuBell, LuMapPin,
  LuCalendar, LuEuro, LuLandmark, LuSparkles, LuBookmark, LuChevronRight, LuPlay, LuClock, LuTrendingUp, LuBookOpen, LuX,
} from 'react-icons/lu';
import { MkLayout, startDemo, startCompleteDemo } from './Layout';
import { navigate, track } from '../lib/store';
import { Ring, Bar, LogoMark } from '../components/ui';
import { PricingCards } from './Pricing';
import { TED_NOTICES, TED_SNAPSHOT_DATE } from '../lib/discovery/tedSnapshot';
import { matchTender } from '../lib/discovery/match';
import { SAMPLE_COMPANY } from '../lib/demoData';
import { daysUntil, fmtDate } from '../lib/util';
import { eur } from '../lib/plans';
import { useLive } from '../lib/data/live';

const VIDEO = 'media/anuncio-propo.mp4';
const nf = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');   // 6.235: es-ES no separa los millares de cuatro cifras

/** Cifras reales de lo que el robot tiene publicado ahora mismo. */
function LiveStats() {
  const live = useLive();
  const open = useCountUp(live.meta?.counts?.tenders ?? live.tenders.length, 1500);
  const awards = useCountUp(live.meta?.counts?.awards ?? 0, 1700);
  return (
    <section className="stats-dark" aria-label="PROPO en cifras">
      <div className="mk-wrap">
        <span className="sd-live"><i />Datos en directo de las fuentes oficiales</span>
        <div className="stats-dark-grid">
          <div className="sd"><b>{nf(open)}</b><span>licitaciones abiertas ahora mismo</span></div>
          {awards > 0 && <div className="sd"><b>{nf(awards)}</b><span>contratos adjudicados analizados para conocer a tu competencia</span></div>}
          <div className="sd"><b>3</b><span>fuentes oficiales: Estado, comunidades autónomas y Unión Europea</span></div>
          <div className="sd"><b>10 min</b><span>cada cuánto revisa PROPO si hay licitaciones nuevas</span></div>
        </div>
      </div>
    </section>
  );
}

function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  return (
    <div className="vmodal" role="dialog" aria-modal="true" aria-label="Vídeo de PROPO" onClick={onClose}>
      <div className="vmodal-in" onClick={(e) => e.stopPropagation()}>
        <button className="vmodal-x" onClick={onClose} aria-label="Cerrar el vídeo"><LuX /></button>
        <video src={VIDEO} controls autoPlay playsInline />
      </div>
    </div>
  );
}

/** Las piezas de la portada entran con suavidad cuando llegan a la pantalla. */
function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.mk .section-head, .mk .pain-grid > div, .mk .value-line > div, .mk .feature > *, .mk .principle > div, .mk .price-card, .mk .sd, .mk .video-card > *, .mk .cta-band, .mk .steps'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => {
      const sibs = el.parentElement ? Array.from(el.parentElement.children) : [];
      el.style.setProperty('--rv-d', el.matches('.section-head, .cta-band, .steps') ? '0s' : `${Math.min(sibs.indexOf(el), 5) * 0.07}s`);
      el.classList.add('rv'); io.observe(el);
    });
    return () => { io.disconnect(); els.forEach((el) => el.classList.remove('rv', 'in')); };
  }, []);
}

function useCountUp(target: number, ms = 1400) {
  const [v, setV] = useState(target);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setV(target); return; }
    let raf = 0; const t0 = performance.now(); const from = Math.round(target * 0.6);
    const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function useTopMatches(n = 3) {
  return useMemo(() => TED_NOTICES
    .filter((t) => (daysUntil(t.deadline) ?? -1) >= 0)
    .map((t) => ({ t, m: matchTender(t, SAMPLE_COMPANY) }))
    .sort((a, b) => b.m.score - a.m.score)
    .slice(0, n), [n]);
}

function short(s: string, n: number) { return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; }

function HeroMock() {
  const all = useTopMatches(999);
  const top = all.slice(0, 3);
  const high = all.filter((x) => x.m.score >= 70).length;
  const ready = useCountUp(87, 1600);
  return (
    <div className="hero-visual">
      <div className="mock app-mock" aria-label="PROPO buscando licitaciones para una empresa de catering">
        <aside className="am-side">
          <div className="row" style={{ gap: 8, marginBottom: 14 }}><LogoMark size={22} /><span className="logo-word" style={{ fontSize: 15 }}>PROPO</span></div>
          {[[<LuHouse />, 'Inicio'], [<LuSearch />, 'Licitaciones'], [<LuFolderKanban />, 'Mis proyectos'], [<LuLibrary />, 'Documentos'], [<LuBell />, 'Alertas'], [<LuBuilding2 />, 'Empresa']].map(([ic, l], i) => (
            <div key={i} className={`am-nav ${i === 1 ? 'on' : ''}`}>{ic}<span>{l}</span></div>
          ))}
        </aside>
        <div className="am-main">
          <div className="am-title">Oportunidades para tu empresa</div>
          <div className="am-search"><LuSearch /><span>¿Qué tipo de contrato buscas?</span><span className="am-btn">Buscar</span></div>
          <div className="am-tabs"><span className="on">Abiertas <i>{all.length}</i></span><span>Alta compatibilidad <i>{high}</i></span><span>Guardadas <i>2</i></span></div>
          <div className="am-list">
            {top.map(({ t, m }) => (
              <div key={t.id} className="am-row">
                <span className="score-pill">{m.score}%</span>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="am-row-title">{t.title}</div>
                  <div className="am-row-meta"><span><LuMapPin />{t.city}</span>{t.value ? <span><LuEuro />{eur(t.value)}</span> : null}<span><LuCalendar />{daysUntil(t.deadline)} días</span></div>
                </div>
                <LuChevronRight className="am-chev" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mock-chip"><LuCircleCheck />Paquete listo para presentar</div>
      <div className="mock-float">
        <div className="row" style={{ gap: 12 }}>
          <Ring value={ready} size={54} stroke={5} tone="accent" label={<span style={{ fontSize: 13 }}>{ready}%</span>} />
          <div><div className="xs subtle">Análisis del pliego</div><div style={{ fontWeight: 700, fontSize: 15 }}>Propuesta {ready}% lista</div></div>
        </div>
        <div className="stack mt-12" style={{ gap: 7, fontSize: 12.5 }}>
          <div className="row"><LuCircleCheck className="state-ico ok" style={{ width: 15 }} />32 requisitos cumplidos</div>
          <div className="row"><LuCircleAlert className="state-ico warn" style={{ width: 15 }} />5 necesitan información</div>
          <div className="row"><LuLoaderCircle className="spin" style={{ width: 15, height: 15, color: 'var(--accent)' }} />Redactando la memoria<span className="typing" /></div>
        </div>
      </div>
      <p className="xs subtle hero-caption">Licitaciones reales publicadas en TED (Diario Oficial de la UE) · datos del {fmtDate(TED_SNAPSHOT_DATE)}</p>
    </div>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setPlay(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const steps = [
    { n: '01', t: 'Encuentra', d: 'PROPO busca a diario las licitaciones públicas que encajan con tu sector, tu zona y tu tamaño.', x: 'O sube un pliego o un RFP privado' },
    { n: '02', t: 'Analiza', d: 'Lee cada página del pliego y extrae requisitos, plazos, criterios de adjudicación y documentación obligatoria.', x: 'Cada requisito, con su página' },
    { n: '03', t: 'Prepara', d: 'Cruza los datos de tu empresa, te pide lo que falta y redacta la memoria técnica y las declaraciones.', x: 'Fuentes en cada párrafo' },
    { n: '04', t: 'Revisa', d: 'Tu equipo revisa y aprueba cada sección, pasa el control de cumplimiento y descarga el paquete.', x: 'Tú apruebas. Tú presentas.' },
  ];
  return (
    <div ref={ref} className={`steps ${play ? 'play' : ''}`}>
      <div className="steps-line"><span /></div>
      {steps.map((s) => (
        <div className="step" key={s.n}>
          <div className="step-no">{s.n}</div>
          <h3>{s.t}</h3>
          <p>{s.d}</p>
          <div className="step-detail">{s.x}</div>
        </div>
      ))}
    </div>
  );
}

const PAINS: [string, string][] = [
  ['Encontrar la licitación a tiempo', 'Cientos de anuncios al día en varias plataformas'],
  ['Leer los pliegos', 'A menudo 150–400 páginas entre cláusulas y anexos'],
  ['Entender cada requisito', 'Obligatorios, opcionales y causas de exclusión'],
  ['Reunir la documentación', 'Certificados, inscripciones, seguros, solvencia'],
  ['Preparar declaraciones', 'DEUC, compromisos, declaraciones responsables'],
  ['Pedir datos a otros departamentos', 'Operaciones, finanzas, RR. HH., calidad'],
  ['Redactar la memoria técnica', 'Estructurada según cómo se va a puntuar'],
  ['Revisar los criterios', 'Dónde están los puntos y cómo conseguirlos'],
  ['Comprobar formatos y límites', 'Las páginas de más no se valoran'],
  ['Comprobar firmas y plazos', 'Firma electrónica cualificada y fecha límite'],
  ['Que no falte nada', 'Un documento olvidado puede excluir la oferta'],
  ['Volver a empezar el mes siguiente', 'Desde cero, cada vez'],
];

function RequirementsDemo() {
  return (
    <div className="panel-demo">
      <div className="card">
        <div className="card-head"><h3>Requisitos</h3><span className="small subtle">43 en total</span></div>
        <div style={{ padding: '16px 24px' }}>
          <div className="stackbar"><span style={{ width: '74%', background: 'var(--ok)' }} /><span style={{ width: '16%', background: 'var(--warn)' }} /><span style={{ width: '10%', background: 'var(--bad)' }} /></div>
          <div className="row-wrap mt-12 small"><span className="row"><span className="dot ok" />32 cumplidos</span><span className="row"><span className="dot warn" />7 necesitan información</span><span className="row"><span className="dot bad" />4 faltan</span></div>
        </div>
        {[
          ['ok', 'Solvencia económica — volumen de negocio', 'PCAP p. 17 · Cuentas anuales 2025.pdf'],
          ['warn', 'Acreditación de experiencia previa', 'PCAP p. 19 · 2 de 3 proyectos encontrados'],
          ['bad', 'Certificación ISO 22000 o equivalente', 'PCAP p. 20 · no está en tus documentos'],
          ['ok', 'Menús firmados por dietista-nutricionista', 'Anexo IV p. 3 · Laia Serra, dietista'],
        ].map(([t, a, b]) => (
          <div key={a} className="req-item" style={{ cursor: 'default' }}>
            {t === 'ok' ? <LuCircleCheck className="state-ico ok" /> : t === 'warn' ? <LuCircleAlert className="state-ico warn" /> : <LuCircleX className="state-ico bad" />}
            <div><div className="req-title">{a}</div><div className="req-sub">{b}</div></div>
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscoveryDemo() {
  const top = useTopMatches(1);
  const item = top[0];
  if (!item) return null;
  const { t, m } = item;
  return (
    <div className="panel-demo">
      <div className="tender-card" style={{ maxWidth: 440, margin: '0 auto' }}>
        <div className="row"><span className="score-pill"><LuSparkles />{m.score}%</span><span className="spacer" /><span className="badge ok">Abierta</span></div>
        <h3 className="mt-12" style={{ fontSize: 17, lineHeight: 1.3 }}>{t.title}</h3>
        <div className="tender-meta mt-12">
          <span><LuLandmark />{t.buyer}</span>
          <span><LuMapPin />{t.city}</span>
          {t.value ? <span><LuEuro />{eur(t.value)}</span> : null}
          <span><LuCalendar />Presentación: {daysUntil(t.deadline)} días</span>
        </div>
        <div className="stack mt-16" style={{ gap: 6 }}>
          {m.reasons.slice(0, 3).map((r) => <div key={r.text} className="row small">{r.ok ? <LuCheck style={{ width: 14, height: 14, color: 'var(--ok)' }} /> : <LuCircleAlert style={{ width: 14, height: 14, color: 'var(--warn)' }} />}{r.text}</div>)}
        </div>
        <div className="row mt-20"><span className="btn btn-primary grow">Analizar licitación <LuArrowRight /></span><span className="btn btn-secondary"><LuBookmark /> Guardar</span></div>
      </div>
    </div>
  );
}

function MemoryDemo() {
  return (
    <div className="panel-demo">
      <div className="card card-pad">
        <div className="row gap-16">
          <Ring value={78} size={72} stroke={7} tone="accent" />
          <div><div className="eyebrow">Memoria de empresa</div><div style={{ fontWeight: 750, fontSize: 20, marginTop: 4, letterSpacing: '-.02em' }}>PROPO conoce tu empresa.</div><div className="small muted">Cada propuesta empieza con lo que ya has acreditado.</div></div>
        </div>
        <div className="knowledge mt-20">
          {[['Datos de empresa', 100], ['Proyectos previos', 100], ['Certificaciones', 100], ['Equipo', 100], ['Documentos', 100], ['Capacidades', 60]].map(([l, v]) => (
            <div className="kn-row" key={l as string}><span>{l}</span><span className="xs subtle num">{v}%</span><Bar value={v as number} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DraftDemo() {
  return (
    <div className="panel-demo">
      <div className="sec-card">
        <div className="sec-head"><div className="grow"><div className="eyebrow">Sección 5</div><h3 className="mt-4">Logística y transporte en línea fría</h3></div><span className="badge accent">Generada por IA</span><span className="badge outline">Confianza 92%</span></div>
        <div className="sec-body" style={{ fontSize: 14 }}>
          <p>Las comidas se transportan en vehículos refrigerados con registro continuo de temperatura, entre 0 °C y 4 °C <span className="cite">S1</span>. Cuatro rutas diarias cubren los 38 centros con un máximo de 45 minutos de transporte <span className="cite">S2</span>.</p>
          <p className="mt-12">Nuestro porcentaje de compra de proximidad es <span className="info-req">Información requerida: porcentaje de compra ecológica o de proximidad</span>.</p>
        </div>
        <div className="sec-foot"><span className="source-chip"><LuFileText /><span>S1 · PPT — Pliego de prescripciones técnicas — p. 18</span></span><span className="spacer" /><span className="btn btn-secondary btn-sm">Editar</span><span className="btn btn-primary btn-sm"><LuCheck /> Aprobar</span></div>
      </div>
    </div>
  );
}

function ComplianceDemo() {
  const items: [string, string][] = [['ok', 'Toda la documentación obligatoria subida'], ['ok', 'Memoria técnica completa'], ['ok', 'Criterios de adjudicación cubiertos'], ['ok', 'Límite de páginas comprobado'], ['ok', 'Formatos de archivo comprobados'], ['warn', 'Firma pendiente'], ['bad', 'Oferta económica sin aprobar']];
  return (
    <div className="panel-demo">
      <div className="card">
        <div className="card-head"><h3>Control de cumplimiento final</h3><span className="spacer" /><span className="badge accent">91% lista</span></div>
        {items.map(([t, l]) => (
          <div key={l} className="check" style={{ padding: '12px 24px' }}>
            {t === 'ok' ? <LuCircleCheck className="state-ico ok" /> : t === 'warn' ? <LuCircleAlert className="state-ico warn" /> : <LuCircleX className="state-ico bad" />}
            <span>{l}</span><span />
          </div>
        ))}
      </div>
    </div>
  );
}

const FAQS: [string, string][] = [
  ['¿De dónde salen las licitaciones?', 'De fuentes públicas oficiales. PROPO recoge los anuncios publicados en TED, el Diario Oficial de la UE, y en producción también los de la Plataforma de Contratación del Sector Público. Cada licitación enlaza al anuncio original.'],
  ['¿Tengo que buscar yo los pliegos?', 'No. Cada licitación incluye sus documentos oficiales (pliego de cláusulas administrativas, prescripciones técnicas y anexos) y un resumen claro: qué se contrata, qué te piden, cómo se puntúa y qué puede excluirte, con la página de origen de cada dato. Puedes empezar el análisis con un clic y añadir los pliegos completos cuando quieras.'],
  ['¿PROPO presenta la oferta por mí?', 'No en esta versión. PROPO prepara y revisa la propuesta, y tu equipo mantiene el control de la aprobación final y de la presentación en la plataforma de contratación.'],
  ['¿Puede leer PDF?', 'Sí. PROPO lee PDF con texto, Word (.docx), Excel (.xlsx) y archivos ZIP que los contengan. Los documentos escaneados se marcan para que nada se omita sin avisar.'],
  ['¿Puedo subir los documentos de mi empresa?', 'Sí. Guarda una vez certificados, seguros, cuentas anuales, CV y propuestas anteriores. PROPO los reutiliza en cada propuesta y te avisa antes de que caduquen.'],
  ['¿Guarda PROPO mis documentos?', 'Sí, para poder reutilizarlos. Se guardan cifrados en la UE, aislados por empresa, y solo acceden las personas de tu espacio de trabajo. Nunca se usan para entrenar modelos de IA. Puedes exportarlo o borrarlo todo cuando quieras.'],
  ['¿Sirve para concursos privados?', 'Sí. PROPO funciona con licitaciones públicas, RFP privados, procesos de compra y propuestas comerciales.'],
  ['¿Garantiza PROPO que ganaré?', 'No. PROPO mejora la alineación con los criterios de adjudicación publicados y reduce el riesgo de olvidar requisitos. La calidad de tu oferta y tu precio deciden el resultado.'],
  ['¿Qué pasa si la IA no está segura?', 'Lo marca para revisión humana. Cuando falta información, PROPO escribe «Información requerida» en lugar de rellenar el hueco. Precios, experiencia, certificaciones y datos legales o financieros siempre los valida una persona.'],
];

export function Faq() {
  return (
    <div className="faq">
      {FAQS.map(([q, a]) => (
        <details key={q}>
          <summary>{q}<LuPlus /></summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

const MARQUEE_SECTORS = ['Construcción', 'Catering y restauración', 'Limpieza', 'Ingeniería', 'Tecnología e IT', 'Consultoría', 'Mantenimiento de edificios', 'Seguridad y vigilancia', 'Transporte', 'Jardinería y zonas verdes', 'Formación', 'Sanidad y material médico', 'Servicios sociales', 'Suministro de alimentos', 'Mobiliario y oficina', 'Vehículos y maquinaria', 'Energía', 'Residuos y medio ambiente', 'Publicidad y comunicación', 'Eventos', 'Arquitectura', 'Telecomunicaciones', 'Servicios jurídicos', 'Laboratorio e investigación', 'Vestuario y textil', 'Facility services'];

export function Landing() {
  const start = (cta: string) => { track('cta_click', { cta }); navigate('/signup'); };
  const [video, setVideo] = useState(false);
  const play = (from: string) => { track('cta_click', { cta: 'video_' + from }); setVideo(true); };
  useReveal();
  return (
    <MkLayout>
      {video && <VideoModal onClose={() => setVideo(false)} />}
      <section className="hero hero-v2">
        <div className="wz-bg" aria-hidden="true"><i className="wz-blob b1" /><i className="wz-blob b2" /><i className="wz-blob b3" /><i className="wz-grid" /></div>
        <div className="mk-wrap hero-grid">
          <div>
            <span className="hero-kicker"><span className="new">Nuevo</span>La forma más inteligente de trabajar con licitaciones</span>
            <h1>Encuentra las licitaciones.<br /><span className="blue">PROPO prepara el resto.</span></h1>
            <p className="hero-sub">PROPO encuentra las licitaciones que encajan con tu empresa, lee los pliegos, detecta cada requisito y prepara la propuesta para que tu equipo solo tenga que revisarla.</p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={() => start('hero_start_free')}>Empezar gratis <LuArrowRight /></button>
              <button className="btn btn-secondary btn-lg" onClick={startCompleteDemo}>Ver una propuesta terminada</button>
            </div>
            <div className="hero-note">
              <span><LuCheck /> 14 días de prueba</span><span><LuCheck /> Sin tarjeta</span><span><LuCheck /> Tu equipo aprueba todo</span>
            </div>
            <button className="hero-video" onClick={() => play('hero')}><span><LuPlay /></span><div>Ver PROPO en un minuto<small>Vídeo con sonido</small></div></button>
          </div>
          <HeroMock />
        </div>
        <div className="mk-wrap">
          <div className="hero-strip">
            {[[<LuSearch />, 'Encuentra oportunidades', 'Licitaciones que encajan contigo'], [<LuFileText />, 'Analiza pliegos', 'Requisitos con su página'], [<LuFileCheck />, 'Prepara propuestas', 'Borradores con fuentes'], [<LuShieldCheck />, 'Todo bajo control', 'Tú revisas y apruebas']].map(([ic, t, d]) => (
              <div key={t as string} className="hs-item"><span className="hs-ico">{ic}</span><div><div className="hs-t">{t}</div><div className="xs subtle">{d}</div></div></div>
            ))}
          </div>
        </div>
      </section>

      <LiveStats />

      <section className="section-tight">
        <div className="mk-wrap sector-band">
          <p className="muted sector-band-label">Pensado para equipos que preparan propuestas.</p>
          <div className="marquee" aria-label={`Sectores: ${MARQUEE_SECTORS.join(', ')}`}>
            <div className="marquee-track" aria-hidden="true">
              {[0, 1].map((k) => (
                <div className="marquee-group" key={k}>
                  {MARQUEE_SECTORS.map((s) => <span className="marquee-item" key={s}><span className="marquee-dot" />{s}</span>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mk-wrap">
          <div className="section-head">
            <div className="eyebrow">El problema</div>
            <h2>Una licitación son cientos de páginas. <span className="blue">Olvidar una línea</span> puede excluirte.</h2>
            <p>Encontrar y preparar una sola oferta supone semanas de lectura, documentos y redacción. La mayoría de pymes lo hace con una persona y una hoja de cálculo.</p>
          </div>
          <div className="pain-grid">
            {PAINS.map(([t, d], i) => (
              <div key={t}><span className="pain-n">{String(i + 1).padStart(2, '0')}</span><div><div style={{ fontWeight: 600 }}>{t}</div><div className="small muted">{d}</div></div></div>
            ))}
          </div>
          <div className="section-head mt-48" style={{ marginBottom: 24 }}>
            <div className="eyebrow">El cambio</div>
            <h2>Menos tiempo preparando. <span className="blue">Más tiempo creciendo.</span></h2>
          </div>
          <div className="value-line">
            <div><span className="vl-ico"><LuSearch /></span><strong>Menos búsqueda</strong><p className="muted mt-8">Las licitaciones que encajan contigo llegan solas, con su nivel de compatibilidad.</p></div>
            <div><span className="vl-ico"><LuBookOpen /></span><strong>Menos lectura</strong><p className="muted mt-8">PROPO lee cada página y te entrega los requisitos con la página de la que salen.</p></div>
            <div><span className="vl-ico"><LuShieldCheck /></span><strong>Menos olvidos</strong><p className="muted mt-8">Cada requisito se sigue hasta estar cumplido y hay un control final antes de presentar.</p></div>
            <div><span className="vl-ico"><LuTrendingUp /></span><strong>Más ofertas</strong><p className="muted mt-8">El mismo equipo puede presentar más propuestas porque la base ya está hecha.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="mk-wrap">
          <div className="video-card">
            <div>
              <div className="eyebrow">En un minuto</div>
              <h2>Mira cómo trabaja PROPO.</h2>
              <p>De miles de licitaciones abiertas a una propuesta lista para firmar: qué hace PROPO en cada paso y qué decides tú.</p>
              <button className="btn btn-primary btn-lg mt-24" onClick={() => play('section')}><LuPlay /> Ver el vídeo</button>
            </div>
            <button className="video-thumb" onClick={() => play('thumb')} aria-label="Reproducir el vídeo de PROPO">
              <video src={VIDEO + '#t=5.5'} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" />
              <span className="video-play"><span><LuPlay /></span></span>
            </button>
          </div>
        </div>
      </section>

      <section className="section band" id="how">
        <div className="mk-wrap">
          <div className="section-head">
            <div className="eyebrow">Cómo funciona</div>
            <h2>Encuentra la licitación. <span className="blue">PROPO hace el trabajo.</span> Tú apruebas.</h2>
          </div>
          <HowItWorks />
        </div>
      </section>

      <section className="section">
        <div className="mk-wrap">
          <div className="section-head">
            <div className="eyebrow">El producto</div>
            <h2>Un departamento de licitaciones dentro de tu empresa.</h2>
            <p>PROPO no es un chat que escribe documentos. Trabaja cada licitación como lo haría una persona experta en ofertas y te enseña de dónde sale cada dato.</p>
          </div>
          <div className="feature">
            <div>
              <div className="eyebrow">Buscador de licitaciones</div>
              <h3>Las licitaciones que encajan contigo, cada día.</h3>
              <p className="lead">PROPO revisa los anuncios públicos y puntúa cada uno según tu sector, tu zona, tu facturación y el plazo para preparar la oferta.</p>
              <ul>
                <li><LuCheck />Compatibilidad explicada punto por punto</li>
                <li><LuCheck />Alertas por sector y región</li>
                <li><LuCheck />De la licitación a la propuesta en un clic</li>
              </ul>
            </div>
            <DiscoveryDemo />
          </div>
          <div className="feature flip">
            <div>
              <div className="eyebrow">Motor de requisitos</div>
              <h3>Cada requisito, encontrado y bajo control.</h3>
              <p className="lead">PROPO extrae lo que pide el pliego, lo compara con tu empresa y te dice exactamente qué le falta.</p>
              <ul>
                <li><LuCheck />Cada requisito enlaza a su cláusula y página</li>
                <li><LuCheck />Se cruza con tus documentos, proyectos y equipo</li>
                <li><LuCheck />Preguntas claras cuando falta algo, nunca suposiciones</li>
              </ul>
            </div>
            <RequirementsDemo />
          </div>
          <div className="feature">
            <div>
              <div className="eyebrow">Memoria de empresa</div>
              <h3>Cuanto más usas PROPO, menos trabajo te da cada propuesta.</h3>
              <p className="lead">Sube una vez certificados, seguros, proyectos y CV. PROPO los reutiliza y cada respuesta aprobada pasa a tu biblioteca.</p>
              <ul>
                <li><LuCheck />Biblioteca de documentos con avisos de caducidad</li>
                <li><LuCheck />Proyectos previos listos para acreditar experiencia</li>
                <li><LuCheck />Secciones aprobadas guardadas como plantillas</li>
              </ul>
            </div>
            <MemoryDemo />
          </div>
          <div className="feature flip">
            <div>
              <div className="eyebrow">Redacción de propuestas</div>
              <h3>Borradores con tus datos y fuentes que puedes comprobar.</h3>
              <p className="lead">PROPO adapta la estructura de la propuesta al pliego y a sus criterios, y redacta cada sección con el pliego y los datos de tu empresa.</p>
              <ul>
                <li><LuCheck />Cada afirmación cita su página o su dato de empresa</li>
                <li><LuCheck />«Información requerida» en lugar de datos inventados</li>
                <li><LuCheck />Edita, regenera, aprueba o rechaza cada sección</li>
              </ul>
            </div>
            <DraftDemo />
          </div>
          <div className="feature">
            <div>
              <div className="eyebrow">Control de cumplimiento</div>
              <h3>Revisa todo antes de presentar.</h3>
              <p className="lead">Antes de marcar la propuesta como lista, PROPO comprueba documentos, criterios, límite de páginas, precios en el sobre equivocado, firmas y aprobaciones.</p>
              <ul>
                <li><LuCheck />Mejora la alineación con los criterios publicados</li>
                <li><LuCheck />Paquete de presentación listo para descargar</li>
                <li><LuCheck />La presentación final la hace siempre tu equipo</li>
              </ul>
            </div>
            <ComplianceDemo />
          </div>
        </div>
      </section>

      <section className="section band dark">
        <div className="mk-wrap">
          <div className="section-head">
            <div className="eyebrow">Con supervisión humana</div>
            <h2>PROPO prepara. <span className="blue">Tu empresa aprueba.</span></h2>
            <p>La IA lee y hace el primer borrador. Las decisiones con peso legal y comercial las toman personas.</p>
          </div>
          <div className="principle">
            <div><span className="pr-n">01</span><div className="big">Prepara</div><p className="muted mt-8">Extrae requisitos, cruza los datos de tu empresa, redacta secciones y declaraciones y monta el paquete.</p></div>
            <div><span className="pr-n">02</span><div className="big">Avisa</div><p className="muted mt-8">Marca lo que no tiene claro, lo que falta y lo que podría excluirte. Nunca rellena huecos con datos inventados.</p></div>
            <div><span className="pr-n">03</span><div className="big">Tú apruebas</div><p className="muted mt-8">Cada sección pasa de Borrador a Generada por IA, Revisada y Aprobada. Precios, experiencia y datos legales los valida una persona.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mk-wrap">
          <div className="section-head">
            <div className="eyebrow">Precios</div>
            <h2>Paga por propuestas, no por tokens.</h2>
            <p>Los planes se dimensionan por las propuestas que preparas cada mes. Prueba una propuesta completa gratis.</p>
          </div>
          <PricingCards compact />
          <div className="mt-24"><button className="link" onClick={() => navigate('/pricing')}>Comparar todos los planes <LuArrowRight style={{ verticalAlign: -2 }} /></button></div>
        </div>
      </section>

      <section className="section band">
        <div className="mk-wrap">
          <div className="section-head" style={{ marginBottom: 24 }}><div className="eyebrow">Preguntas</div><h2>Preguntas frecuentes</h2></div>
          <Faq />
        </div>
      </section>

      <section className="section">
        <div className="mk-wrap">
          <div className="cta-band">
            <i className="cta-glow" aria-hidden="true" />
            <div>
              <h2>Encuentra la licitación. PROPO hace el trabajo. Tú apruebas.</h2>
              <p>Crea tu primera propuesta en minutos. Sin tarjeta.</p>
            </div>
            <div className="row-wrap">
              <button className="btn btn-primary btn-lg" onClick={() => start('footer_create_first')}>Crear mi primera propuesta</button>
              <button className="btn btn-secondary btn-lg" onClick={() => startDemo('/app')}>Ver PROPO en acción</button>
              <button className="btn btn-ghost btn-lg" onClick={startCompleteDemo}>Demo completa</button>
            </div>
          </div>
        </div>
      </section>
    </MkLayout>
  );
}
