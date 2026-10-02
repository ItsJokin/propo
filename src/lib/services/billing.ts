// Billing service boundary. The UI only talks to this interface.
//
// Production implementation (server/billing/*.ts):
//   startCheckout(plan, cycle)  -> POST /api/billing/checkout  -> Stripe Checkout Session (mode=subscription,
//                                   trial_period_days honoured only for first subscription) -> redirect URL
//   openPortal()                -> POST /api/billing/portal    -> Stripe Customer Portal session URL
//                                   (payment method, invoices, cancel, plan switch with proration)
//   Webhooks (/api/billing/webhook): checkout.session.completed, customer.subscription.created|updated|deleted,
//                                   invoice.paid, invoice.payment_failed -> update `subscriptions` table.
// The subscription row in Postgres is the source of truth for plan limits; the client never decides.
//
// This build has no Stripe keys, so no payment is taken or simulated. Plan previews are
// explicit, labelled "demo only", and never show a card form or a fake charge.

import type { PlanId } from '../types';

export interface Invoice { id: string; date: string; amount: string; status: 'paid' | 'open'; }

export interface BillingProvider {
  readonly connected: boolean;
  startCheckout(plan: PlanId, cycle: 'monthly' | 'annual'): Promise<{ url: string } | { notConnected: true }>;
  openPortal(): Promise<{ url: string } | { notConnected: true }>;
  listInvoices(): Promise<Invoice[]>;
}

export const billing: BillingProvider = {
  connected: false,
  async startCheckout() { return { notConnected: true }; },
  async openPortal() { return { notConnected: true }; },
  async listInvoices() { return []; },
};
