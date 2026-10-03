import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { LuCpu, LuFileText, LuChevronLeft, LuChevronRight, LuBuilding2, LuCircleCheck, LuInfo, LuLock } from 'react-icons/lu';
import { Drawer, Modal } from '../components/ui';
import { aiState, onAIState, type AIState } from '../lib/ai/provider';
import { projectPages } from '../lib/ai/engine';
import type { Project, PlanId } from '../lib/types';
import { normalize } from '../lib/util';
import { PLANS } from '../lib/plans';
import { billing } from '../lib/services/billing';
import { update, toast, track, useStore } from '../lib/store';
import { addDays } from '../lib/util';
import { projectStatus, statusTone, type ProjectStatus } from '../lib/derive';

export function useAIState(): AIState {
  return useSyncExternalStore((cb) => onAIState(cb), () => aiState());
}

export function AIBadge() {
  const s = useAIState();
  const label = s === 'available' ? 'IA conectada' : s === 'checking' ? 'Comprobando IA…' : s === 'declined' ? 'IA no permitida · modo básico' : 'Modo básico · IA no disponible';
  const tip = s === 'available'
    ? 'El análisis, la redacción y Pregunta a PROPO usan Claude.'
    : 'La IA no está disponible ahora mismo. Mientras tanto, PROPO usa extracción por reglas y borradores de plantilla, y lo indica.';
  return (
    <div className="row xs subtle" title={tip} style={{ padding: '4px 6px' }}>
      <LuCpu style={{ width: 13, height: 13 }} />
      <span className={`dot ${s === 'available' ? 'ok' : s === 'checking' ? '' : 'warn'}`} style={{ width: 6, height: 6 }} />
      {label}
    </div>
  );
}

export function StatusBadge({ p }: { p: Project }) {
  const s = projectStatus(p);
  return <span className={`badge ${statusTone(s)}`}><span className={`dot ${statusTone(s)}`} />{s}</span>;
}

export function statusBadgeFor(s: ProjectStatus) {
  return <span className={`badge ${statusTone(s)}`}><span className={`dot ${statusTone(s)}`} />{s}</span>;
}

// ---------------------------------------------------------------------------
// Source viewer: click any citation to see the page it comes from.

type SourceReq = { project: Project; docId?: string; page?: number; quote?: string; label?: string; kind?: 'tender' | 'company' } | null;
let current: SourceReq = null;
const subs = new Set<() => void>();
export function openSource(r: NonNullable<SourceReq>) { current = r; subs.forEach((f) => f()); }
function closeSource() { current = null; subs.forEach((f) => f()); }

export function SourceViewerHost() {
  const req = useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => current);
  if (!req) return null;
  return <SourceViewer req={req} />;
}

function highlight(text: string, quote?: string): React.ReactNode {
  if (!quote) return text;
  const q = quote.replace(/\s+/g, ' ').trim();
  const flat = text.replace(/\s+/g, ' ');
  let idx = flat.toLowerCase().indexOf(q.toLowerCase());
  let len = q.length;
  if (idx < 0) {
    // fuzzy: find the sentence with the highest token overlap
    const sentences = flat.split(/(?<=[.;])\s+/);
    const qt = new Set(normalize(q).split(' '));
    let best = -1; let bestScore = 0; let pos = 0; let bestPos = 0;
    sentences.forEach((s, i) => {
      const st = normalize(s).split(' ');
      const score = st.filter((t) => qt.has(t)).length / Math.max(1, qt.size);
      if (score > bestScore) { bestScore = score; best = i; bestPos = pos; }
      pos += s.length + 1;
    });
    if (best >= 0 && bestScore > 0.5) { idx = bestPos; len = sentences[best].length; }
  }
  if (idx < 0) return flat;
  return <>{flat.slice(0, idx)}<mark>{flat.slice(idx, idx + len)}</mark>{flat.slice(idx + len)}</>;
}

function SourceViewer({ req }: { req: NonNullable<SourceReq> }) {
  const [pages, setPages] = useState<Map<string, string[]> | null>(null);
  const [page, setPage] = useState(req.page ?? 1);
  useEffect(() => { setPage(req.page ?? 1); }, [req]);
  useEffect(() => { let alive = true; projectPages(req.project).then((m) => alive && setPages(m)); return () => { alive = false; }; }, [req.project]);
  const doc = req.project.docs.find((d) => d.id === req.docId);
  if (req.kind === 'company' || !req.docId) {
    return (
      <Drawer title="Fuente · Memoria de empresa" onClose={closeSource}>
        <div className="row"><LuBuilding2 style={{ width: 16, height: 16, color: 'var(--fg-3)' }} /><strong>{req.label}</strong></div>
        {req.quote && <div className="quote mt-16">{req.quote}</div>}
        <p className="small muted mt-16">Este dato sale de tu perfil de empresa o de tu biblioteca de documentos, no del pliego. Mantenlo al día en Empresa.</p>
      </Drawer>
    );
  }
  const text = pages?.get(req.docId)?.[page - 1];
  const total = doc?.pages ?? 1;
  return (
    <Drawer title={<span className="row"><LuFileText style={{ width: 16, height: 16 }} /><span className="truncate">{doc?.name ?? 'Documento'}</span></span>} onClose={closeSource}>
      <div className="row" style={{ marginBottom: 14 }}>
        <button className="btn btn-secondary btn-sm btn-icon" aria-label="Página anterior" disabled={page <= 1} onClick={() => setPage(page - 1)}><LuChevronLeft /></button>
        <span className="small">Página {page} de {total}</span>
        <button className="btn btn-secondary btn-sm btn-icon" aria-label="Página siguiente" disabled={page >= total} onClick={() => setPage(page + 1)}><LuChevronRight /></button>
        <span className="spacer" />
        {page === req.page && req.quote && <span className="badge ok"><LuCircleCheck />Fragmento citado</span>}
      </div>
      {pages === null ? (
        <div className="page-view"><div className="shimmer" style={{ height: 12, width: '80%' }} /><div className="shimmer mt-12" style={{ height: 12, width: '60%' }} /></div>
      ) : text ? (
        <div className="page-view">{highlight(text, page === req.page ? req.quote : undefined)}</div>
      ) : (
        <div className="page-view empty-page">
          <div>
            <LuInfo style={{ width: 18, height: 18 }} />
            <p className="mt-8">{doc?.status === 'excerpt' ? 'Este proyecto de ejemplo solo incluye las páginas citadas. En tus proyectos verás aquí todas las páginas del documento original.' : doc?.status === 'unreadable' ? 'No se ha podido leer esta página (imagen escaneada o archivo protegido).' : 'Esta página no tiene texto legible.'}</p>
          </div>
        </div>
      )}
      <p className="xs subtle mt-16">Texto extraído por PROPO. El archivo original se guarda en tu espacio; en producción se abre con un enlace firmado y temporal.</p>
    </Drawer>
  );
}

// ---------------------------------------------------------------------------
// Upgrade / paywall

const REASON_COPY: Record<string, [string, string]> = {
  trial_used: ['Ya has usado tu propuesta de prueba', 'La prueba incluye una propuesta completa. Elige un plan para crear más: tu memoria de empresa y tus documentos se mantienen.'],
  trial_expired: ['Tu prueba ha terminado', 'Tu espacio está en modo lectura. Tu perfil de empresa, tus documentos y tus propuestas se conservan. Elige un plan para continuar.'],
  limit_reached: ['Has llegado a las propuestas de este mes', 'Mejora tu plan, compra una propuesta adicional o espera al próximo periodo.'],
  no_plan: ['Elige un plan para continuar', 'Para crear propuestas necesitas un plan activo.'],
  past_due: ['Revisa el pago', 'El último pago no se ha podido cobrar. Actualiza tu método de pago para seguir creando propuestas.'],
  upgrade: ['Mejora tu plan de PROPO', 'Los planes se dimensionan por las propuestas nuevas de cada mes.'],
};

export function UpgradeModal({ reason = 'upgrade', onClose }: { reason?: string; onClose: () => void }) {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');
  const [notice, setNotice] = useState<PlanId | null>(null);
  const current = useStore((s) => s.subscription);
  const [t, sub] = REASON_COPY[reason] ?? REASON_COPY.upgrade;
  const checkout = async (plan: PlanId) => {
    track('checkout_started', { plan, cycle });
    const r = await billing.startCheckout(plan, cycle);
    if ('url' in r) { window.open(r.url, '_blank'); return; }
    setNotice(plan);
  };
  const preview = (plan: PlanId) => {
    update((s) => { s.subscription = { ...s.subscription, plan, status: 'active', billingCycle: cycle, trialEndsAt: null, currentPeriodEnd: addDays(cycle === 'annual' ? 365 : 30), cancelAtPeriodEnd: false, simulated: true }; s.usage.proposalsCreated = 0; s.usage.periodStart = new Date().toISOString(); });
    track('plan_preview', { plan });
    toast(`Vista previa del plan ${PLANS[plan].name} activada. No se ha cobrado nada.`, 'ok');
    onClose();
  };
  return (
    <Modal title={t} sub={sub} onClose={onClose} wide>
      <div className="row" style={{ marginBottom: 16 }}>
        <div className="seg"><button className={cycle === 'monthly' ? 'on' : ''} onClick={() => setCycle('monthly')}>Mensual</button><button className={cycle === 'annual' ? 'on' : ''} onClick={() => setCycle('annual')}>Anual · ahorra un 20 %</button></div>
      </div>
      <div className="grid-2">
        {(['pro', 'business'] as PlanId[]).map((id) => {
          const p = PLANS[id];
          const price = cycle === 'annual' ? p.annual : p.monthly;
          const isCurrent = current.plan === id && current.status === 'active';
          return (
            <div key={id} className={`price-card ${id === 'pro' ? 'featured' : ''}`} style={{ padding: 20 }}>
              {id === 'pro' && <span className="price-flag">Más elegido</span>}
              <h3>{p.name}</h3>
              <div className="price" style={{ marginTop: 10 }}><strong className="num" style={{ fontSize: 34 }}>{price} €</strong><span className="muted small">/ mes{cycle === 'annual' ? ', facturación anual' : ''}</span></div>
              <ul style={{ margin: '14px 0 18px' }}>{p.features.slice(0, 5).map((f) => <li key={f}><LuCircleCheck />{f}</li>)}</ul>
              {isCurrent ? <button className="btn btn-secondary" disabled>Plan actual</button> : (
                <div className="stack" style={{ gap: 6 }}>
                  <button className={`btn ${id === 'pro' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => checkout(id)}><LuLock /> Continuar al pago seguro</button>
                  <button className="link small" onClick={() => preview(id)}>Probar este plan sin pagar (solo demo)</button>
                </div>
              )}
              {notice === id && (
                <div className="callout neutral mt-12 small"><LuInfo /><div>Los pagos no están conectados en esta versión de prueba: no se abre ningún pago y no se cobra nada. En producción este botón abre Stripe Checkout para {p.name} ({cycle === 'annual' ? 'anual' : 'mensual'}) y la suscripción se activa cuando Stripe confirma el pago.</div></div>
              )}
            </div>
          );
        })}
      </div>
      <p className="xs subtle mt-16">Precios sin IVA. Cancela cuando quieras. ¿Necesitas más volumen o SSO? Tenemos planes Enterprise.</p>
    </Modal>
  );
}
