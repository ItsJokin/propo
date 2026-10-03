import React, { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuLandmark, LuMapPin, LuEuro, LuCalendar, LuBookmark, LuExternalLink, LuArrowRight, LuCheck, LuCircleAlert, LuX, LuBell, LuInfo, LuTrash2, LuSlidersHorizontal, LuFileCheck, LuFileText, LuCircleCheck, LuTriangleAlert, LuLoaderCircle, LuEye } from 'react-icons/lu';
import { useStore, update, navigate, toast, track, getState } from '../lib/store';
import { type TedNotice } from '../lib/discovery/tedSnapshot';
import { useLive, dataAgeMinutes, type LiveState } from '../lib/data/live';
import { competitionFor, goNoGo, type Competition, type CompStats } from '../lib/data/awards';
import { matchTender, SECTORS, REGIONS, regionLabel, sectorLabel, type Match } from '../lib/discovery/match';
import { Drawer, Empty } from '../components/ui';
import { tenderView, fichaFile } from '../lib/discovery/brief';
import { TENDER_BRIEFS } from '../lib/discovery/tenderDocs';
import { NewProposal } from './Projects';
import { UpgradeModal } from './common';
import { canCreateProposal, createProject, type LimitReason } from '../lib/actions';
import { hasPliegos, loadPliegoFiles, pliegoUrl } from '../lib/discovery/loadPliegos';
import { PLIEGO_FILES } from '../lib/discovery/pliegoFiles';
import { daysUntil, fmtDate, uid, nowIso, normalize, timeAgo } from '../lib/util';
import { eur, PLANS } from '../lib/plans';

export function scoreTone(s: number) { return s >= 70 ? '' : s >= 45 ? 'mid' : 'low'; }

export function useMatches() {
  const company = useStore((s) => s.company);
  const { tenders } = useLive();
  return useMemo(() => tenders.map((t) => ({ t, m: matchTender(t, company) })), [company, tenders]);
}
const PAGE = 40;
const hay = new WeakMap<TedNotice, string>();
const haystack = (t: TedNotice) => { let h = hay.get(t); if (!h) { h = normalize(`${t.title} ${t.buyer} ${t.desc} ${t.kind} ${t.city} ${t.live?.ref ?? ''} ${t.cpv.join(' ')}`); hay.set(t, h); } return h; };
const SRC_LABEL = { ted: 'TED', placsp: 'Plataforma del Estado', agregadas: 'Plataforma autonómica' } as const;

type Row = { t: TedNotice; m: Match };

export function Tenders() {
  const s = useStore((x) => x);
  const all = useMatches();
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('');
  const [region, setRegion] = useState('');
  const [size, setSize] = useState('');
  const [tab, setTab] = useState<'all' | 'high' | 'saved'>('all');
  const [sort, setSort] = useState<'score' | 'deadline' | 'value' | 'new'>('score');
  const [open, setOpen] = useState<Row | null>(null);
  const [prefill, setPrefill] = useState<TedNotice | null>(null);
  const [paywall, setPaywall] = useState<LimitReason | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [source, setSource] = useState('');
  const live = useLive();
  useEffect(() => { setShown(PAGE); }, [query, sector, region, size, tab, sort, source]);

  const words = normalize(query).split(' ').filter(Boolean);
  const filtered = useMemo(() => all.filter(({ t }) => {
    const d = t.deadline ? daysUntil(t.deadline) ?? -1 : 0;
    if (!showClosed && d < 0) return false;
    if (words.length) { const h = haystack(t); if (!words.every((w) => h.includes(w))) return false; }
    if (source && (t.live?.src ?? 'ted') !== source) return false;
    if (sector && t.sector !== sector && !(SECTORS.find((x) => x.id === sector)?.cpv.some((p) => t.cpv.some((c) => c.startsWith(p))))) return false;
    if (region && !t.nuts.startsWith(region)) return false;
    if (size === 's' && !(t.value && t.value >= 100000 && t.value < 500000)) return false;
    if (size === 'm' && !(t.value && t.value >= 500000 && t.value <= 2000000)) return false;
    if (size === 'l' && !(t.value && t.value > 2000000)) return false;
    if (size === 'xs' && !(t.value && t.value < 100000)) return false;
    return true;
  }), [all, query, sector, region, size, source, showClosed]);
  const counts = { all: filtered.length, high: filtered.filter((r) => r.m.score >= 70).length, saved: filtered.filter((r) => s.savedTenders.includes(r.t.id)).length };
  const list = useMemo(() => filtered
    .filter((r) => tab === 'all' || (tab === 'high' ? r.m.score >= 70 : s.savedTenders.includes(r.t.id)))
    .sort((a, b) => sort === 'score' ? b.m.score - a.m.score || (a.t.deadline || '9').localeCompare(b.t.deadline || '9') : sort === 'deadline' ? (a.t.deadline || '9').localeCompare(b.t.deadline || '9') : sort === 'new' ? b.t.pub.localeCompare(a.t.pub) : (b.t.value ?? 0) - (a.t.value ?? 0)), [filtered, tab, sort, s.savedTenders]);

  const toggleSave = (id: string) => {
    const saved = getState().savedTenders.includes(id);
    update((st) => { st.savedTenders = saved ? st.savedTenders.filter((x) => x !== id) : [id, ...st.savedTenders]; });
    toast(saved ? 'Quitada de guardadas' : 'Licitación guardada', saved ? 'neutral' : 'ok');
    track(saved ? 'tender_unsaved' : 'tender_saved', { id });
  };
  const [busy, setBusy] = useState<string | null>(null);
  const analyze = async (t: TedNotice) => {
    const c = canCreateProposal(getState());
    if (!c.ok) { setPaywall(c.reason); return; }
    track('tender_analyze_clicked', { id: t.id, included: hasPliegos(t.id) });
    setBusy('Preparando los documentos oficiales…');
    const pdfs = hasPliegos(t.id) ? await loadPliegoFiles(t.id, setBusy) : [];
    const fromFicha = pdfs.length === 0;
    const files = [fichaFile(t), ...pdfs];   // la ficha aporta los datos oficiales ya verificados (plazos, criterios)
    setBusy(null);
    setOpen(null);
    const r = createProject({ name: shortTitle(t.title), organization: t.buyer, type: 'public_tender', tenderId: t.id, tender: t }, files);
    if (!r.ok) setPaywall(r.reason);
    else toast(fromFicha ? 'Proyecto creado con la ficha oficial de la licitación' : `Proyecto creado con ${pdfs.length} pliego${pdfs.length === 1 ? '' : 's'} oficial${pdfs.length === 1 ? '' : 'es'}`, 'ok');
  };
  const plan = PLANS[s.subscription.plan];
  const saveAlert = () => {
    if (s.alerts.length >= plan.alerts) { toast(`Tu plan incluye ${plan.alerts} alerta${plan.alerts === 1 ? '' : 's'}. Mejora tu plan para crear más.`, 'warn'); return; }
    const name = [sector && sectorLabel(sector), region && REGIONS.find((r) => r.id === region)?.label, query && `«${query}»`].filter(Boolean).join(' · ') || 'Todas las licitaciones compatibles';
    update((st) => { st.alerts.unshift({ id: uid('al'), name, query, sector, region, createdAt: nowIso() }); });
    toast('Alerta creada. PROPO la comprueba cada vez que abres la página.', 'ok');
    track('alert_created');
  };
  const noProfile = !s.company.cpvs.length;

  return (
    <>
      <div className="page-head">
        <div><h1>Licitaciones</h1><p>Licitaciones públicas abiertas, ordenadas por compatibilidad con {(s.company.legalName || 'tu empresa').replace(/\.$/, '')}.</p></div>
        <button className="btn btn-secondary" onClick={() => navigate('/app/company/search')}><LuSlidersHorizontal /> Perfil de búsqueda</button>
      </div>

      <DataStatus live={live} />
      {noProfile && (
        <div className="callout" style={{ marginBottom: 20 }}>
          <LuSlidersHorizontal />
          <div className="grow">Elige los sectores y regiones en los que trabajas para que PROPO calcule la compatibilidad de cada licitación.</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/app/company/search')}>Configurar</button>
        </div>
      )}

      <form className="t-search" onSubmit={(e) => { e.preventDefault(); setQuery(q.trim()); track('tender_search', { q: q.trim() }); }}>
        <LuSearch />
        <input aria-label="Buscar licitaciones" placeholder="¿Qué tipo de contrato buscas? p. ej. comedor, limpieza, mantenimiento…" value={q} onChange={(e) => { setQ(e.target.value); if (!e.target.value) setQuery(''); }} />
        {query && <button type="button" className="btn btn-ghost btn-sm btn-icon" aria-label="Borrar búsqueda" onClick={() => { setQ(''); setQuery(''); }}><LuX /></button>}
        <button className="btn btn-primary">Buscar</button>
      </form>
      <div className="t-filters">
        <select className="select" aria-label="Sector" value={sector} onChange={(e) => setSector(e.target.value)}><option value="">Todos los sectores</option>{SECTORS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
        <select className="select" aria-label="Región" value={region} onChange={(e) => setRegion(e.target.value)}><option value="">Toda España</option>{REGIONS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
        <select className="select" aria-label="Importe" value={size} onChange={(e) => setSize(e.target.value)}><option value="">Cualquier importe</option><option value="xs">Menos de 100.000 €</option><option value="s">100.000 € – 500.000 €</option><option value="m">500.000 € – 2 M€</option><option value="l">Más de 2 M€</option></select>
        <select className="select" aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value as any)}><option value="score">Más compatibles</option><option value="new">Más recientes</option><option value="deadline">Cierran antes</option><option value="value">Mayor importe</option></select>
        {live.status === 'live' && <select className="select" aria-label="Fuente" value={source} onChange={(e) => setSource(e.target.value)}><option value="">Todas las fuentes</option><option value="placsp">Plataforma del Estado</option><option value="agregadas">Plataformas autonómicas</option><option value="ted">TED (UE)</option></select>}
        <span className="spacer" />
        <button type="button" className="btn btn-secondary" onClick={saveAlert}><LuBell /> Crear alerta con estos filtros</button>
      </div>

      <div className="tabs" style={{ margin: '22px 0 16px' }}>
        {([['all', 'Todas'], ['high', 'Alta compatibilidad'], ['saved', 'Guardadas']] as const).map(([k, l]) => (
          <button key={k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{l}<span className="count">{counts[k]}</span></button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card">
          {tab === 'saved'
            ? <Empty icon={<LuBookmark />} title="Aún no has guardado ninguna licitación" body="Guarda las que te interesen para revisarlas con tu equipo y analizarlas cuando quieras." />
            : <Empty icon={<LuSearch />} title="No hay licitaciones con estos filtros" body="Prueba con otra búsqueda, quita algún filtro o amplía la región." action={<button className="btn btn-secondary" onClick={() => { setQ(''); setQuery(''); setSector(''); setRegion(''); setSize(''); }}>Quitar filtros</button>} />}
        </div>
      ) : (
        <div className="t-list">
          {list.slice(0, shown).map((r) => <TenderRow key={r.t.id} r={r} saved={s.savedTenders.includes(r.t.id)} onOpen={() => setOpen(r)} onSave={() => toggleSave(r.t.id)} />)}
          {list.length > shown && <button className="btn btn-secondary" style={{ alignSelf: 'center', marginTop: 8 }} onClick={() => setShown(shown + PAGE)}>Mostrar {Math.min(PAGE, list.length - shown)} más · {(list.length - shown).toLocaleString('es-ES')} restantes</button>}
        </div>
      )}
      <div className="row mt-16 small muted">
        <label className="row"><input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} /> Mostrar licitaciones con el plazo cerrado</label>
      </div>

      {s.alerts.length > 0 && (
        <div className="card mt-32">
          <div className="card-head"><LuBell style={{ width: 16, height: 16, color: 'var(--accent)' }} /><h3>Tus alertas</h3><span className="spacer" /><span className="xs subtle">{s.alerts.length} de {plan.alerts >= 999 ? 'ilimitadas' : plan.alerts}</span></div>
          {s.alerts.map((a) => {
            const aw = normalize(a.query || '').split(' ').filter(Boolean);
            const hits = all.filter(({ t }) => (!t.deadline || (daysUntil(t.deadline) ?? -1) >= 0) && (!a.sector || t.sector === a.sector) && (!a.region || t.nuts.startsWith(a.region)) && aw.every((w) => haystack(t).includes(w)));
            const n = hits.length; const fresh = hits.filter(({ t }) => t.pub >= a.createdAt.slice(0, 10)).length;
            return (
              <div key={a.id} className="entity">
                <div><div style={{ fontWeight: 600 }}>{a.name}</div><div className="small muted">{n.toLocaleString('es-ES')} licitaciones abiertas coinciden{fresh ? ` · ${fresh} publicadas desde que creaste la alerta` : ''}</div></div>
                <div className="row">
                  <button className="btn btn-ghost btn-sm" onClick={() => { setSector(a.sector); setRegion(a.region); setQ(a.query); setQuery(a.query); window.scrollTo?.(0, 0); document.getElementById('app-main')?.scrollTo(0, 0); }}>Ver</button>
                  <button className="btn btn-ghost btn-sm btn-icon" aria-label="Eliminar alerta" onClick={() => update((st) => { st.alerts = st.alerts.filter((x) => x.id !== a.id); })}><LuTrash2 /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && <TenderDrawer r={open} busy={busy} saved={s.savedTenders.includes(open.t.id)} onClose={() => setOpen(null)} onSave={() => toggleSave(open.t.id)} onAnalyze={() => analyze(open.t)} />}
      {prefill && <NewProposal prefill={{ name: shortTitle(prefill.title), organization: prefill.buyer, tenderId: prefill.id, url: prefill.live?.url ?? `https://ted.europa.eu/es/notice/-/detail/${prefill.id}`, notice: prefill }} onClose={() => setPrefill(null)} onLimit={(r) => { setPrefill(null); setPaywall(r); }} />}
      {paywall && <UpgradeModal reason={paywall} onClose={() => setPaywall(null)} />}
    </>
  );
}

/** Estado de los datos: en vivo (robot) o instantánea incluida. Dice siempre de cuándo son. */
export function DataStatus({ live }: { live: LiveState }) {
  const m = live.meta;
  if (live.status === 'loading') return <div className="callout neutral small" style={{ marginBottom: 20 }}><LuLoaderCircle className="spin" /><div>Cargando las licitaciones…</div></div>;
  if (live.status === 'bundled' || !m) return (
    <div className="callout neutral small" style={{ marginBottom: 20 }}><LuInfo /><div>Instantánea de <strong>TED</strong> (Diario Oficial de la UE) del {fmtDate(m?.checkedAt)}: {live.tenders.length} licitaciones reales. Esta copia de PROPO se ha abierto sin su carpeta de datos, así que no se actualiza sola.</div></div>
  );
  const age = dataAgeMinutes(m) ?? 0;
  const src = Object.entries(m.sources ?? {});
  const fresh = age <= 45;
  return (
    <div className={`callout ${fresh ? 'neutral' : 'warn'} small data-status`} style={{ marginBottom: 20 }}>
      <span className={`live-dot ${fresh ? 'on' : ''}`} />
      <div className="grow">
        <strong>{live.tenders.length.toLocaleString('es-ES')} licitaciones abiertas</strong> de fuentes oficiales · {fresh ? `comprobado ${timeAgo(m.checkedAt!)}` : `datos del ${fmtDate(m.checkedAt)}, ${new Date(m.checkedAt!).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
        <div className="xs muted" style={{ marginTop: 2 }}>
          {src.map(([k, x]) => <span key={k} style={{ marginRight: 14 }} title={x.error || ''}>{x.ok ? '✓' : '✗'} {x.label}{x.ok ? '' : ' (sin respuesta en la última lectura)'}</span>)}
          {!fresh && <span>Esta copia no recibe datos nuevos desde entonces.</span>}
        </div>
      </div>
    </div>
  );
}

export function shortTitle(t: string) { return t.length > 80 ? t.slice(0, 78).trimEnd() + '…' : t; }

export function TenderRow({ r, saved, onOpen, onSave, compact }: { r: Row; saved: boolean; onOpen: () => void; onSave?: () => void; compact?: boolean }) {
  const { t, m } = r;
  const d = t.deadline ? daysUntil(t.deadline) ?? -1 : 0;
  const pliegos = t.live?.docs.filter((x) => x[2] === 'pcap' || x[2] === 'ppt').length ?? 0;
  return (
    <div className={`t-row ${m.score >= 70 ? 'hi' : m.score >= 45 ? 'mid' : ''}`} onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}>
      <span className={`score-pill ${scoreTone(m.score)}`} title="Compatibilidad con tu empresa">{m.score}%</span>
      <div style={{ minWidth: 0 }}>
        <div className="t-row-title">{t.title}</div>
        {!compact && <div className="t-row-kind">{t.kind}{PLIEGO_FILES[t.id] ? <span className="badge accent" style={{ height: 20, fontSize: 11, marginLeft: 8 }}><LuFileCheck style={{ width: 12, height: 12 }} /> Pliegos incluidos</span> : TENDER_BRIEFS[t.id] ? <span className="badge outline" style={{ height: 20, fontSize: 11, marginLeft: 8 }}>Pliegos resumidos</span> : pliegos ? <span className="badge outline" style={{ height: 20, fontSize: 11, marginLeft: 8 }}><LuFileText style={{ width: 12, height: 12 }} /> {pliegos === 1 ? 'Pliego enlazado' : 'Pliegos enlazados'}</span> : null}{t.live && <span className="xs subtle" style={{ marginLeft: 8 }}>{SRC_LABEL[t.live.src]}</span>}</div>}
        <div className="t-row-meta">
          <span><LuLandmark />{t.buyer}</span>
          <span><LuMapPin />{t.city !== 'No consta' ? t.city : regionLabel(t.nuts)}</span>
          {t.value ? <span><LuEuro />{eur(t.value)}</span> : <span className="subtle"><LuEuro />Importe no publicado</span>}
          <span style={{ color: d >= 0 && d <= 7 ? 'var(--warn-ink)' : undefined }}><LuCalendar />{!t.deadline ? 'Plazo en la ficha oficial' : d < 0 ? 'Cerrada' : `${d} días · ${fmtDate(t.deadline, { day: 'numeric', month: 'short' })}`}</span>
        </div>
      </div>
      <div className="row" onClick={(e) => e.stopPropagation()}>
        {onSave && <button className={`btn btn-ghost btn-sm btn-icon bookmark ${saved ? 'on' : ''}`} aria-label={saved ? 'Quitar de guardadas' : 'Guardar'} onClick={onSave}><LuBookmark /></button>}
        <button className="btn btn-secondary btn-sm" onClick={onOpen}>Ver detalles</button>
      </div>
    </div>
  );
}

function TenderDrawer({ r, saved, busy, onClose, onSave, onAnalyze }: { r: Row; saved: boolean; busy: string | null; onClose: () => void; onSave: () => void; onAnalyze: () => void }) {
  const { t, m } = r;
  const d = t.deadline ? daysUntil(t.deadline) ?? -1 : 0;
  const v = useMemo(() => tenderView(t), [t]);
  const [tab, setTab] = useState<'summary' | 'docs' | 'comp' | 'fit'>('summary');
  const [comp, setComp] = useState<Competition | null | 'loading'>('loading');
  useEffect(() => { let on = true; setComp('loading'); competitionFor(t).then((c) => { if (on) setComp(c); }).catch(() => { if (on) setComp(null); }); return () => { on = false; }; }, [t.id]);
  const go = goNoGo(m.score, t.deadline ? d : null, comp === 'loading' ? null : comp);
  const nature =t.nature === 'services' ? 'Servicios' : t.nature === 'supplies' ? 'Suministros' : 'Obras';
  const maxW = Math.max(1, ...v.criteria.map((c) => c.weight ?? 0));
  useEffect(() => { track('tender_opened', { id: t.id, depth: v.depth }); }, [t.id]);
  return (
    <Drawer wide title="Detalle de la licitación" onClose={onClose}
      footer={<>
        <button className="btn btn-primary grow" onClick={onAnalyze} disabled={d < 0 || !!busy}>{busy ? <><LuLoaderCircle className="spin" /> {busy}</> : <>{PLIEGO_FILES[t.id] ? 'Analizar los pliegos con PROPO' : 'Analizar licitación'} <LuArrowRight /></>}</button>
        <button className={`btn btn-secondary bookmark ${saved ? 'on' : ''}`} onClick={onSave}><LuBookmark /> {saved ? 'Guardada' : 'Guardar'}</button>
      </>}>
      <div className="row-wrap"><span className={`score-pill ${scoreTone(m.score)}`}>{m.score}%</span>{!t.deadline ? <span className="badge ok">Abierta</span> : d >= 0 ? <span className="badge ok">Abierta · {d} días</span> : <span className="badge">Cerrada</span>}<span className="badge outline">{nature}</span><span className="badge outline">{sectorLabel(t.sector)}</span></div>
      <h2 className="mt-12" style={{ fontSize: 21, lineHeight: 1.3, letterSpacing: '-.02em' }}>{t.title}</h2>
      <div className="row-wrap small muted mt-8"><span className="row" style={{ gap: 6 }}><LuLandmark style={{ width: 14, height: 14 }} />{t.buyer}</span><span className="row" style={{ gap: 6 }}><LuMapPin style={{ width: 14, height: 14 }} />{t.city !== 'No consta' ? `${t.city} · ` : ''}{regionLabel(t.nuts)}</span></div>

      <div className="tabs mt-16" role="tablist">
        <button className={`tab ${tab === 'summary' ? 'on' : ''}`} onClick={() => setTab('summary')}>Resumen</button>
        <button className={`tab ${tab === 'docs' ? 'on' : ''}`} onClick={() => setTab('docs')}>Documentos{v.docs.length > 0 && <span className="count">{v.docs.length}</span>}</button>
        <button className={`tab ${tab === 'comp' ? 'on' : ''}`} onClick={() => { setTab('comp'); track('tender_competition_opened', { id: t.id }); }}>Competencia</button>
        <button className={`tab ${tab === 'fit' ? 'on' : ''}`} onClick={() => setTab('fit')}>¿Me presento?</button>
      </div>

      {tab === 'summary' && (
        <div className="stack gap-20 mt-16">
          <div className={`brief-source ${v.depth}`}>
            {v.depth === 'pliego' ? <LuFileCheck /> : <LuFileText />}
            <div className="grow"><strong>{v.depth === 'pliego' ? 'Resumen de los pliegos oficiales' : 'Resumen del anuncio oficial'}</strong><div className="xs muted">Fuente: {v.readFrom}{v.pcapPages ? ` (PCAP de ${v.pcapPages} páginas)` : ''}. {v.depth === 'pliego' ? 'Resumen hecho con IA a partir de esos documentos' : 'Resumen automático de los datos del anuncio'}: compruébalo en el pliego antes de presentar.</div></div>
          </div>
          <div>
            <div className="eyebrow">En pocas palabras</div>
            <p className="mt-8" style={{ fontSize: 15, lineHeight: 1.6 }}>{v.plain}</p>
          </div>
          <div className="brief-facts">
            {v.facts.map(([k, x]) => <div key={k}><div className="xs subtle">{k}</div><div className="brief-fact-v">{x}</div></div>)}
          </div>
          <div>
            <div className="eyebrow">Qué te piden</div>
            <ul className="brief-list mt-8">{v.asks.map((a) => <li key={a}><LuCircleCheck className="ok" />{a}</li>)}</ul>
          </div>
          {v.watch.length > 0 && (
            <div>
              <div className="eyebrow">Atención</div>
              <ul className="brief-list mt-8">{v.watch.map((a) => <li key={a}><LuTriangleAlert className="warn" />{a}</li>)}</ul>
            </div>
          )}
          {v.criteria.length > 0 && (
            <div>
              <div className="eyebrow">Cómo se puntúa</div>
              <div className="stack mt-8" style={{ gap: 10 }}>
                {v.criteria.map((c) => (
                  <div key={c.name + c.weight} className="crit-row">
                    <div className="row small"><span className={`dot ${c.price ? 'accent' : 'ok'}`} /><span className="grow">{c.name}</span><strong className="num">{c.weight != null ? `${String(c.weight).replace('.', ',')} ${c.unit === '%' ? '%' : 'pt'}` : 'Ver pliego'}</strong></div>
                    {c.weight != null && <div className="crit-bar"><span className={c.price ? 'p' : 'q'} style={{ width: `${(c.weight / maxW) * 100}%` }} /></div>}
                  </div>
                ))}
              </div>
              <div className="row xs subtle mt-8" style={{ gap: 14 }}><span className="row" style={{ gap: 6 }}><span className="dot accent" />Precio</span><span className="row" style={{ gap: 6 }}><span className="dot ok" />Calidad y otros</span></div>
            </div>
          )}
          {v.lots.length > 0 && (
            <div>
              <div className="eyebrow">Lotes{v.lotCount > v.lots.length ? ` (${v.lots.length} de ${v.lotCount})` : ''}</div>
              <div className="stack mt-8" style={{ gap: 6 }}>{v.lots.map((l, i) => <div key={i} className="row small"><span className="badge outline" style={{ height: 22 }}>{i + 1}</span><span className="grow">{l.name}</span>{l.value ? <span className="num muted">{eur(l.value)}</span> : null}</div>)}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'docs' && (
        <div className="stack gap-16 mt-16">
          {PLIEGO_FILES[t.id] && (
            <div className="card" style={{ padding: 16, background: 'var(--accent-soft)', borderColor: 'var(--accent-line)' }}>
              <div className="row"><LuFileCheck style={{ width: 16, height: 16, color: 'var(--accent)' }} /><strong>Ya incluidos en PROPO</strong></div>
              <p className="small muted mt-4">PROPO ya ha traído estos pliegos de la plataforma oficial. Al pulsar «Analizar» se leen automáticamente: no tienes que descargar ni subir nada.</p>
              <div className="doc-links mt-12">
                {PLIEGO_FILES[t.id].map((f) => (
                  <a key={f.path} className="doc-link" style={{ background: 'var(--surface)' }} href={pliegoUrl(f.path)} target="_blank" rel="noopener noreferrer">
                    <span className="file-ico pdf">{f.kind === 'pcap' ? 'PCAP' : f.kind === 'ppt' ? 'PPT' : 'DOC'}</span>
                    <span className="grow" style={{ minWidth: 0 }}><span className="doc-link-name">{f.name}</span><span className="xs subtle">{f.kb >= 1024 ? (f.kb / 1024).toFixed(1).replace('.', ',') + ' MB' : f.kb + ' KB'} · incluido en PROPO</span></span>
                    <LuEye className="muted" />
                  </a>
                ))}
              </div>
            </div>
          )}
          {v.docs.length > 0 ? (
            <>
              <p className="small muted">Documentos oficiales publicados por el órgano de contratación. Se abren en {v.officialHost}; PROPO no los modifica.</p>
              <div className="doc-links">
                {v.docs.map((doc) => (
                  <a key={doc.url} className="doc-link" href={doc.url} target="_blank" rel="noopener noreferrer">
                    <span className={`file-ico ${doc.kind === 'pcap' || doc.kind === 'ppt' ? 'pdf' : ''}`}>{DOC_KIND[doc.kind]}</span>
                    <span className="grow" style={{ minWidth: 0 }}><span className="doc-link-name">{doc.name}</span><span className="xs subtle">{doc.kb ? `${doc.kb >= 1024 ? (doc.kb / 1024).toFixed(1).replace('.', ',') + ' MB' : doc.kb + ' KB'} · ` : ''}{v.officialHost}</span></span>
                    <LuExternalLink className="muted" />
                  </a>
                ))}
              </div>
              {v.otherDocs.length > 0 && <p className="xs subtle">También en la plataforma: {v.otherDocs.join(' · ')}.</p>}
            </>
          ) : PLIEGO_FILES[t.id] ? null : (
            <div className="callout neutral small"><LuInfo /><div>PROPO aún no ha leído los pliegos de esta licitación. Están publicados en <strong>{v.officialHost ?? 'la plataforma del organismo'}</strong>; el resumen se basa en el anuncio oficial de {v.sourceName}.</div></div>
          )}
          <div className="row-wrap">
            {v.officialPage && <a className="btn btn-secondary" href={v.officialPage} target="_blank" rel="noopener noreferrer"><LuExternalLink /> Todos los documentos en {v.officialHost}</a>}
            <a className="btn btn-ghost" href={v.tedUrl} target="_blank" rel="noopener noreferrer"><LuExternalLink /> Ficha oficial en {v.sourceName === 'TED' ? 'TED' : v.officialHost ?? 'la plataforma'}</a>
          </div>
          {v.submitUrl && <p className="xs subtle">La oferta se presenta en la plataforma del organismo: {v.submitUrl.replace(/^https?:\/\//, '').split('/')[0]}. PROPO prepara la documentación; la presentación la hace siempre una persona de tu equipo.</p>}
        </div>
      )}

      {tab === 'comp' && (
        <div className="stack gap-20 mt-16">
          {comp === 'loading' ? <div className="callout neutral small"><LuLoaderCircle className="spin" /><div>Buscando adjudicaciones parecidas…</div></div>
            : !comp || (!comp.buyer && !comp.similar) ? <div className="callout neutral small"><LuInfo /><div>Todavía no hay adjudicaciones publicadas de contratos parecidos. PROPO las va recogiendo de las fuentes oficiales cada día.</div></div>
              : <>
                <p className="small muted">Qué ha pasado en contratos como este: cuántas empresas se presentan, con qué rebaja se adjudican y quién los gana. Datos de adjudicaciones publicadas en las fuentes oficiales.</p>
                {comp.buyer && <CompBlock title={`Este organismo: ${t.buyer}`} sub={`${comp.buyer.n} ${comp.buyer.n === 1 ? 'adjudicación' : 'adjudicaciones'} en este sector`} s={comp.buyer} />}
                {comp.similar && <CompBlock title="Contratos parecidos en toda España" sub={`${comp.similar.n.toLocaleString('es-ES')} adjudicaciones ${comp.scope}`} s={comp.similar} />}
                <p className="xs subtle">Las medianas son orientativas: resumen adjudicaciones publicadas entre el {fmtDate((comp.similar ?? comp.buyer)!.from)} y el {fmtDate((comp.similar ?? comp.buyer)!.to)}. La rebaja se calcula sobre el presupuesto base cuando el anuncio publica los dos importes.</p>
              </>}
        </div>
      )}

      {tab === 'fit' && (
        <div className="stack gap-20 mt-16">
          <div className={`verdict ${go.verdict}`}>
            <div className="verdict-head">{go.verdict === 'yes' ? <LuCircleCheck /> : go.verdict === 'maybe' ? <LuInfo /> : <LuTriangleAlert />}<strong>{go.title}</strong></div>
            <div className="stack mt-12" style={{ gap: 8 }}>
              {go.reasons.map((x) => (
                <div key={x.text} className="row small" style={{ alignItems: 'flex-start' }}>
                  {x.ok === true ? <LuCheck style={{ width: 15, height: 15, color: 'var(--ok)', marginTop: 2, flex: 'none' }} /> : x.ok === false ? <LuCircleAlert style={{ width: 15, height: 15, color: 'var(--warn)', marginTop: 2, flex: 'none' }} /> : <LuInfo style={{ width: 15, height: 15, color: 'var(--fg-3)', marginTop: 2, flex: 'none' }} />}
                  <span>{x.text}</span>
                </div>
              ))}
            </div>
            <p className="xs subtle mt-12">Recomendación orientativa calculada con reglas: compatibilidad, días disponibles y competencia en adjudicaciones parecidas. La decisión es tuya.</p>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="row"><strong>Compatibilidad con tu empresa</strong><span className="spacer" /><span className={`score-pill ${scoreTone(m.score)}`}>{m.score}%</span></div>
            <div className="stack mt-12" style={{ gap: 8 }}>
              {m.reasons.map((x) => (
                <div key={x.text} className="row small" style={{ alignItems: 'flex-start' }}>
                  {x.ok === true ? <LuCheck style={{ width: 15, height: 15, color: 'var(--ok)', marginTop: 2, flex: 'none' }} /> : x.ok === false ? <LuCircleAlert style={{ width: 15, height: 15, color: 'var(--warn)', marginTop: 2, flex: 'none' }} /> : <LuInfo style={{ width: 15, height: 15, color: 'var(--fg-3)', marginTop: 2, flex: 'none' }} />}
                  <span>{x.text}</span>
                </div>
              ))}
            </div>
            <p className="xs subtle mt-12">Cálculo sin IA: sector (CPV), región, importe frente a tu facturación y días para preparar la oferta.</p>
          </div>
          <dl className="fact-list">
            <dt>Importe estimado</dt><dd>{t.value ? `${eur(t.value)} sin IVA` : 'No publicado en el anuncio'}</dd>
            <dt>Fecha límite</dt><dd>{t.deadline ? `${fmtDate(t.deadline)}${d >= 0 ? ` · quedan ${d} días` : ''}` : 'Consulta la ficha oficial'}</dd>
            <dt>Publicación</dt><dd>{fmtDate(t.pub)}</dd>
            <dt>CPV</dt><dd>{t.cpv.join(', ')}</dd>
            <dt>{t.live && t.live.src !== 'ted' ? 'Expediente' : 'Anuncio TED'}</dt><dd>{t.live && t.live.src !== 'ted' ? t.live.ref || '—' : t.id}</dd>
          </dl>
        </div>
      )}
    </Drawer>
  );
}

const pct = (x: number | null) => (x == null ? '—' : `${String(Math.round(x * 1000) / 10).replace('.', ',')} %`);

/** Resumen de adjudicaciones: ofertas, rebaja, pymes, quién gana y los últimos contratos. */
function CompBlock({ title, sub, s }: { title: string; sub: string; s: CompStats }) {
  const maxWins = Math.max(1, ...s.top.map((w) => w.wins));
  return (
    <div className="card comp-card">
      <div className="comp-head"><strong>{title}</strong><span className="xs subtle">{sub}</span></div>
      <div className="brief-facts comp-facts">
        <div><div className="xs subtle">Ofertas por contrato</div><div className="comp-num">{s.offers == null ? '—' : String(Math.round(s.offers * 10) / 10).replace('.', ',')}</div><div className="xs subtle">mediana</div></div>
        <div><div className="xs subtle">Rebaja del ganador</div><div className="comp-num">{pct(s.baja)}</div><div className="xs subtle">{s.withBaja ? `mediana de ${s.withBaja}` : 'sin importes publicados'}</div></div>
        <div><div className="xs subtle">Rebajas más fuertes</div><div className="comp-num">{pct(s.bajaHigh)}</div><div className="xs subtle">una de cada cuatro la supera</div></div>
        <div><div className="xs subtle">Ganados por pymes</div><div className="comp-num">{s.sme == null ? '—' : `${Math.round(s.sme * 100)} %`}</div><div className="xs subtle">de los contratos</div></div>
      </div>
      {s.top.length > 0 && (
        <div className="comp-sec">
          <div className="eyebrow">Quién gana</div>
          <div className="stack mt-8" style={{ gap: 8 }}>
            {s.top.map((w) => (
              <div key={w.name} className="comp-win">
                <span className="truncate">{w.name}</span>
                <span className="comp-bar"><span style={{ width: `${(w.wins / maxWins) * 100}%` }} /></span>
                <span className="small num">{w.wins} {w.wins === 1 ? 'contrato' : 'contratos'}{w.amount > 0 ? ` · ${eur(Math.round(w.amount))}` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="comp-sec">
        <div className="eyebrow">Últimas adjudicaciones</div>
        <div className="stack mt-8" style={{ gap: 10 }}>
          {s.recent.map((a) => (
            <div key={a.id} className="comp-award">
              <div style={{ minWidth: 0 }}>
                {a.url ? <a href={a.url} target="_blank" rel="noopener noreferrer" className="comp-award-t">{shortTitle(a.title)}</a> : <span className="comp-award-t">{shortTitle(a.title)}</span>}
                <div className="xs subtle">{fmtDate(a.date, { day: 'numeric', month: 'short', year: 'numeric' })} · {a.winners.map((w) => w.name).join(', ') || 'Adjudicatario no publicado'}</div>
              </div>
              <div className="small num" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{a.amount > 0 ? eur(Math.round(a.amount)) : '—'}<div className="xs subtle">{a.offers > 0 ? `${a.offers} ${a.offers === 1 ? 'oferta' : 'ofertas'}` : ''}{a.baja != null ? ` · −${pct(a.baja)}` : ''}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DOC_KIND: Record<string, string> = { pcap: 'PCAP', ppt: 'PPT', anexo: 'ANEXO', memoria: 'MEM', anuncio: 'ANUN', otro: 'DOC' };
