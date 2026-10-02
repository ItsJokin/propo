import React, { useEffect, useMemo, useState } from 'react';
import { LuSearch, LuLandmark, LuMapPin, LuEuro, LuCalendar, LuBookmark, LuExternalLink, LuArrowRight, LuCheck, LuCircleAlert, LuX, LuBell, LuInfo, LuTrash2, LuSlidersHorizontal, LuFileCheck, LuFileText, LuCircleCheck, LuTriangleAlert, LuLoaderCircle, LuEye } from 'react-icons/lu';
import { useStore, update, navigate, toast, track, getState } from '../lib/store';
import { TED_NOTICES, TED_SNAPSHOT_DATE, tedUrl, type TedNotice } from '../lib/discovery/tedSnapshot';
import { matchTender, SECTORS, REGIONS, regionLabel, sectorLabel, type Match } from '../lib/discovery/match';
import { Drawer, Empty } from '../components/ui';
import { tenderView, fichaFile } from '../lib/discovery/brief';
import { TENDER_BRIEFS } from '../lib/discovery/tenderDocs';
import { NewProposal } from './Projects';
import { UpgradeModal } from './common';
import { canCreateProposal, createProject, type LimitReason } from '../lib/actions';
import { hasPliegos, loadPliegoFiles } from '../lib/discovery/loadPliegos';
import { PLIEGO_FILES } from '../lib/discovery/pliegoFiles';
import { daysUntil, fmtDate, uid, nowIso } from '../lib/util';
import { eur, PLANS } from '../lib/plans';

export function scoreTone(s: number) { return s >= 70 ? '' : s >= 45 ? 'mid' : 'low'; }

export function useMatches() {
  const company = useStore((s) => s.company);
  return useMemo(() => TED_NOTICES.map((t) => ({ t, m: matchTender(t, company) })), [company]);
}

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
  const [sort, setSort] = useState<'score' | 'deadline' | 'value'>('score');
  const [open, setOpen] = useState<Row | null>(null);
  const [prefill, setPrefill] = useState<TedNotice | null>(null);
  const [paywall, setPaywall] = useState<LimitReason | null>(null);
  const [showClosed, setShowClosed] = useState(false);

  const filtered = all.filter(({ t }) => {
    const d = daysUntil(t.deadline) ?? -1;
    if (!showClosed && d < 0) return false;
    if (query && !(t.title + ' ' + t.buyer + ' ' + t.desc + ' ' + t.kind + ' ' + t.city).toLowerCase().includes(query.toLowerCase())) return false;
    if (sector && t.sector !== sector && !(SECTORS.find((x) => x.id === sector)?.cpv.some((p) => t.cpv.some((c) => c.startsWith(p))))) return false;
    if (region && !t.nuts.startsWith(region)) return false;
    if (size === 's' && !(t.value && t.value < 500000)) return false;
    if (size === 'm' && !(t.value && t.value >= 500000 && t.value <= 2000000)) return false;
    if (size === 'l' && !(t.value && t.value > 2000000)) return false;
    return true;
  });
  const counts = { all: filtered.length, high: filtered.filter((r) => r.m.score >= 70).length, saved: filtered.filter((r) => s.savedTenders.includes(r.t.id)).length };
  const list = filtered
    .filter((r) => tab === 'all' || (tab === 'high' ? r.m.score >= 70 : s.savedTenders.includes(r.t.id)))
    .sort((a, b) => sort === 'score' ? b.m.score - a.m.score : sort === 'deadline' ? a.t.deadline.localeCompare(b.t.deadline) : (b.t.value ?? 0) - (a.t.value ?? 0));

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
    const r = createProject({ name: shortTitle(t.title), organization: t.buyer, type: 'public_tender', tenderId: t.id }, files);
    if (!r.ok) setPaywall(r.reason);
    else toast(fromFicha ? 'Proyecto creado con la ficha oficial de la licitación' : `Proyecto creado con ${pdfs.length} pliego${pdfs.length === 1 ? '' : 's'} oficial${pdfs.length === 1 ? '' : 'es'}`, 'ok');
  };
  const plan = PLANS[s.subscription.plan];
  const saveAlert = () => {
    if (s.alerts.length >= plan.alerts) { toast(`Tu plan incluye ${plan.alerts} alerta${plan.alerts === 1 ? '' : 's'}. Mejora tu plan para crear más.`, 'warn'); return; }
    const name = [sector && sectorLabel(sector), region && REGIONS.find((r) => r.id === region)?.label, query && `«${query}»`].filter(Boolean).join(' · ') || 'Todas las licitaciones compatibles';
    update((st) => { st.alerts.unshift({ id: uid('al'), name, query, sector, region, createdAt: nowIso() }); });
    toast('Alerta creada. Te avisaremos de las nuevas licitaciones que encajen.', 'ok');
    track('alert_created');
  };
  const noProfile = !s.company.cpvs.length;

  return (
    <>
      <div className="page-head">
        <div><h1>Licitaciones</h1><p>Licitaciones públicas abiertas, ordenadas por compatibilidad con {(s.company.legalName || 'tu empresa').replace(/\.$/, '')}.</p></div>
        <button className="btn btn-secondary" onClick={() => navigate('/app/company/search')}><LuSlidersHorizontal /> Perfil de búsqueda</button>
      </div>

      <div className="callout neutral small" style={{ marginBottom: 20 }}>
        <LuInfo />
        <div>Datos reales de <strong>TED</strong>, el Diario Oficial de la UE: {TED_NOTICES.length} licitaciones de organismos españoles capturadas el {fmtDate(TED_SNAPSHOT_DATE)}. En producción la lista se actualiza cada día desde TED y la Plataforma de Contratación del Sector Público.</div>
      </div>
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
        <select className="select" aria-label="Importe" value={size} onChange={(e) => setSize(e.target.value)}><option value="">Cualquier importe</option><option value="s">Menos de 500.000 €</option><option value="m">500.000 € – 2 M€</option><option value="l">Más de 2 M€</option></select>
        <select className="select" aria-label="Ordenar" value={sort} onChange={(e) => setSort(e.target.value as any)}><option value="score">Más compatibles</option><option value="deadline">Cierran antes</option><option value="value">Mayor importe</option></select>
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
          {list.map((r) => <TenderRow key={r.t.id} r={r} saved={s.savedTenders.includes(r.t.id)} onOpen={() => setOpen(r)} onSave={() => toggleSave(r.t.id)} />)}
        </div>
      )}
      <div className="row mt-16 small muted">
        <label className="row"><input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} /> Mostrar licitaciones con el plazo cerrado</label>
      </div>

      {s.alerts.length > 0 && (
        <div className="card mt-32">
          <div className="card-head"><LuBell style={{ width: 16, height: 16, color: 'var(--accent)' }} /><h3>Tus alertas</h3><span className="spacer" /><span className="xs subtle">{s.alerts.length} de {plan.alerts >= 999 ? 'ilimitadas' : plan.alerts}</span></div>
          {s.alerts.map((a) => {
            const n = all.filter(({ t }) => (daysUntil(t.deadline) ?? -1) >= 0 && (!a.sector || t.sector === a.sector) && (!a.region || t.nuts.startsWith(a.region)) && (!a.query || (t.title + t.desc).toLowerCase().includes(a.query.toLowerCase()))).length;
            return (
              <div key={a.id} className="entity">
                <div><div style={{ fontWeight: 600 }}>{a.name}</div><div className="small muted">{n} licitaciones abiertas coinciden · aviso diario por email y en PROPO</div></div>
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
      {prefill && <NewProposal prefill={{ name: shortTitle(prefill.title), organization: prefill.buyer, tenderId: prefill.id, url: tedUrl(prefill.id), notice: prefill }} onClose={() => setPrefill(null)} onLimit={(r) => { setPrefill(null); setPaywall(r); }} />}
      {paywall && <UpgradeModal reason={paywall} onClose={() => setPaywall(null)} />}
    </>
  );
}

export function shortTitle(t: string) { return t.length > 80 ? t.slice(0, 78).trimEnd() + '…' : t; }

export function TenderRow({ r, saved, onOpen, onSave, compact }: { r: Row; saved: boolean; onOpen: () => void; onSave?: () => void; compact?: boolean }) {
  const { t, m } = r;
  const d = daysUntil(t.deadline) ?? -1;
  return (
    <div className={`t-row ${m.score >= 70 ? 'hi' : m.score >= 45 ? 'mid' : ''}`} onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}>
      <span className={`score-pill ${scoreTone(m.score)}`} title="Compatibilidad con tu empresa">{m.score}%</span>
      <div style={{ minWidth: 0 }}>
        <div className="t-row-title">{t.title}</div>
        {!compact && <div className="t-row-kind">{t.kind}{PLIEGO_FILES[t.id] ? <span className="badge accent" style={{ height: 20, fontSize: 11, marginLeft: 8 }}><LuFileCheck style={{ width: 12, height: 12 }} /> Pliegos incluidos</span> : TENDER_BRIEFS[t.id] ? <span className="badge outline" style={{ height: 20, fontSize: 11, marginLeft: 8 }}>Pliegos resumidos</span> : null}</div>}
        <div className="t-row-meta">
          <span><LuLandmark />{t.buyer}</span>
          <span><LuMapPin />{t.city !== 'No consta' ? t.city : regionLabel(t.nuts)}</span>
          {t.value ? <span><LuEuro />{eur(t.value)}</span> : <span className="subtle"><LuEuro />Importe no publicado</span>}
          <span style={{ color: d >= 0 && d <= 7 ? 'var(--warn-ink)' : undefined }}><LuCalendar />{d < 0 ? 'Cerrada' : `${d} días · ${fmtDate(t.deadline, { day: 'numeric', month: 'short' })}`}</span>
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
  const d = daysUntil(t.deadline) ?? -1;
  const v = useMemo(() => tenderView(t), [t]);
  const [tab, setTab] = useState<'summary' | 'docs' | 'fit'>('summary');
  const nature = t.nature === 'services' ? 'Servicios' : t.nature === 'supplies' ? 'Suministros' : 'Obras';
  const maxW = Math.max(1, ...v.criteria.map((c) => c.weight ?? 0));
  useEffect(() => { track('tender_opened', { id: t.id, depth: v.depth }); }, [t.id]);
  return (
    <Drawer wide title="Detalle de la licitación" onClose={onClose}
      footer={<>
        <button className="btn btn-primary grow" onClick={onAnalyze} disabled={d < 0 || !!busy}>{busy ? <><LuLoaderCircle className="spin" /> {busy}</> : <>{PLIEGO_FILES[t.id] ? 'Analizar los pliegos con PROPO' : 'Analizar licitación'} <LuArrowRight /></>}</button>
        <button className={`btn btn-secondary bookmark ${saved ? 'on' : ''}`} onClick={onSave}><LuBookmark /> {saved ? 'Guardada' : 'Guardar'}</button>
      </>}>
      <div className="row-wrap"><span className={`score-pill ${scoreTone(m.score)}`}>{m.score}%</span>{d >= 0 ? <span className="badge ok">Abierta · {d} días</span> : <span className="badge">Cerrada</span>}<span className="badge outline">{nature}</span><span className="badge outline">{sectorLabel(t.sector)}</span></div>
      <h2 className="mt-12" style={{ fontSize: 21, lineHeight: 1.3, letterSpacing: '-.02em' }}>{t.title}</h2>
      <div className="row-wrap small muted mt-8"><span className="row" style={{ gap: 6 }}><LuLandmark style={{ width: 14, height: 14 }} />{t.buyer}</span><span className="row" style={{ gap: 6 }}><LuMapPin style={{ width: 14, height: 14 }} />{t.city !== 'No consta' ? `${t.city} · ` : ''}{regionLabel(t.nuts)}</span></div>

      <div className="tabs mt-16" role="tablist">
        <button className={`tab ${tab === 'summary' ? 'on' : ''}`} onClick={() => setTab('summary')}>Resumen</button>
        <button className={`tab ${tab === 'docs' ? 'on' : ''}`} onClick={() => setTab('docs')}>Documentos{v.docs.length > 0 && <span className="count">{v.docs.length}</span>}</button>
        <button className={`tab ${tab === 'fit' ? 'on' : ''}`} onClick={() => setTab('fit')}>Compatibilidad</button>
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
                  <a key={f.path} className="doc-link" style={{ background: 'var(--surface)' }} href={f.path} target="_blank" rel="noopener noreferrer">
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
            <div className="callout neutral small"><LuInfo /><div>PROPO aún no ha leído los pliegos de esta licitación. Están publicados en <strong>{v.officialHost ?? 'la plataforma del organismo'}</strong>; el resumen se basa en el anuncio oficial de TED.</div></div>
          )}
          <div className="row-wrap">
            {v.officialPage && <a className="btn btn-secondary" href={v.officialPage} target="_blank" rel="noopener noreferrer"><LuExternalLink /> Todos los documentos en {v.officialHost}</a>}
            <a className="btn btn-ghost" href={v.tedUrl} target="_blank" rel="noopener noreferrer"><LuExternalLink /> Anuncio en TED</a>
          </div>
          {v.submitUrl && <p className="xs subtle">La oferta se presenta en la plataforma del organismo: {v.submitUrl.replace(/^https?:\/\//, '').split('/')[0]}. PROPO prepara la documentación; la presentación la hace siempre una persona de tu equipo.</p>}
        </div>
      )}

      {tab === 'fit' && (
        <div className="stack gap-20 mt-16">
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
            <dt>Fecha límite</dt><dd>{fmtDate(t.deadline)}{d >= 0 ? ` · quedan ${d} días` : ''}</dd>
            <dt>Publicación</dt><dd>{fmtDate(t.pub)}</dd>
            <dt>CPV</dt><dd>{t.cpv.join(', ')}</dd>
            <dt>Anuncio TED</dt><dd>{t.id}</dd>
          </dl>
        </div>
      )}
    </Drawer>
  );
}

const DOC_KIND: Record<string, string> = { pcap: 'PCAP', ppt: 'PPT', anexo: 'ANEXO', memoria: 'MEM', anuncio: 'ANUN', otro: 'DOC' };
