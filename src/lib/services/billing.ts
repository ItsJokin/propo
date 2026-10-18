// Cobro de las suscripciones (Stripe), a través del servidor de pagos (worker-pagos/, Cloudflare).
// La web nunca ve la tarjeta: abre la página segura de Stripe y, al volver, lee el plan de Supabase, que es lo que
// manda (el servidor de pagos lo actualiza con los avisos de Stripe). Sin PROPO_PAY_URL en la compilación no se cobra
// nada: los planes se enseñan, pero el botón explica que el pago aún no está disponible.

import type { PlanId } from '../types';
import { accessToken, cloudEnabled } from './cloud';

const PAY = String(process.env.PROPO_PAY_URL || '').replace(/\/+$/, '');

export interface Invoice { id: string; date: string; amount: string; status: 'paid' | 'open'; }

export interface BillingProvider {
  readonly connected: boolean;
  startCheckout(plan: PlanId, cycle: 'monthly' | 'annual'): Promise<{ url: string } | { notConnected: true } | { error: string }>;
  openPortal(): Promise<{ url: string } | { notConnected: true } | { error: string }>;
  listInvoices(): Promise<Invoice[]>;
}

async function post(path: string, body?: unknown): Promise<{ url: string } | { error: string }> {
  const token = await accessToken();
  if (!token) return { error: 'not_signed_in' };
  try {
    const r = await fetch(PAY + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body || {}) });
    const j = await r.json().catch(() => ({}));
    return j?.url ? { url: j.url } : { error: j?.error || `http_${r.status}` };
  } catch { return { error: 'network' }; }
}

export const billing: BillingProvider = {
  connected: !!PAY && cloudEnabled,
  async startCheckout(plan, cycle) { return this.connected ? post('/checkout', { plan, cycle }) : { notConnected: true }; },
  async openPortal() { return this.connected ? post('/portal') : { notConnected: true }; },
  async listInvoices() { return []; },   // las facturas se descargan en el portal de Stripe
};

/** Mensaje para el cliente cuando algo del pago falla. */
export function billingMessage(code: string): string {
  if (code === 'not_signed_in') return 'Vuelve a iniciar sesión para continuar con el pago.';
  if (code === 'no_customer') return 'Todavía no tienes ninguna suscripción. Elige un plan para empezar.';
  if (code === 'network') return 'No hay conexión con el servidor de pagos. Comprueba tu conexión e inténtalo de nuevo.';
  return 'No se ha podido abrir el pago. Inténtalo de nuevo en unos minutos o escríbenos a hola@propo.es.';
}
