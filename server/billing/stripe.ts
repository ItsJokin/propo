// Reference implementation — Next.js App Router route handlers for Stripe billing.
// Not bundled in the browser MVP. Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
// STRIPE_PRICE_{PRO,BUSINESS}_{MONTHLY,ANNUAL}, STRIPE_PRICE_EXTRA_PROPOSAL_{PRO,BUSINESS}, APP_URL.
import Stripe from 'stripe';
import { createServiceClient, requireMember } from '../supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' as any });

const PRICE: Record<string, string | undefined> = {
  'pro:monthly': process.env.STRIPE_PRICE_PRO_MONTHLY,
  'pro:annual': process.env.STRIPE_PRICE_PRO_ANNUAL,
  'business:monthly': process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
  'business:annual': process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
};

// POST /api/billing/checkout  { plan, cycle }
export async function checkout(req: Request) {
  const { plan, cycle } = await req.json();
  const { workspace, user } = await requireMember(req, 'admin');
  const price = PRICE[`${plan}:${cycle}`];
  if (!price) return Response.json({ error: 'unknown_plan' }, { status: 400 });
  const db = createServiceClient();
  const { data: sub } = await db.from('subscriptions').select('*').eq('workspace_id', workspace.id).single();
  let customer = sub?.stripe_customer_id;
  if (!customer) {
    customer = (await stripe.customers.create({ email: user.email, name: workspace.legal_name, metadata: { workspace_id: workspace.id } })).id;
    await db.from('subscriptions').update({ stripe_customer_id: customer }).eq('workspace_id', workspace.id);
  }
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer,
    line_items: [{ price, quantity: 1 }],
    automatic_tax: { enabled: true },           // EU VAT
    tax_id_collection: { enabled: true },       // B2B reverse charge
    customer_update: { address: 'auto', name: 'auto' },
    allow_promotion_codes: true,
    subscription_data: { metadata: { workspace_id: workspace.id, plan } },
    success_url: `${process.env.APP_URL}/app/settings/billing?checkout=success`,
    cancel_url: `${process.env.APP_URL}/app/settings/billing?checkout=cancelled`,
  });
  return Response.json({ url: session.url });
}

// POST /api/billing/portal — payment method, invoices, plan switch (proration), cancel
export async function portal(req: Request) {
  const { workspace } = await requireMember(req, 'admin');
  const db = createServiceClient();
  const { data: sub } = await db.from('subscriptions').select('stripe_customer_id').eq('workspace_id', workspace.id).single();
  if (!sub?.stripe_customer_id) return Response.json({ error: 'no_customer' }, { status: 400 });
  const s = await stripe.billingPortal.sessions.create({ customer: sub.stripe_customer_id, return_url: `${process.env.APP_URL}/app/settings/billing` });
  return Response.json({ url: s.url });
}

// POST /api/billing/webhook — the ONLY writer of `subscriptions`
export async function webhook(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await req.text(), sig, process.env.STRIPE_WEBHOOK_SECRET!); }
  catch { return new Response('bad signature', { status: 400 }); }
  const db = createServiceClient();
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const s = event.data.object as Stripe.Subscription;
      const workspaceId = s.metadata.workspace_id;
      const priceId = s.items.data[0]?.price.id;
      const plan = Object.entries(PRICE).find(([, v]) => v === priceId)?.[0].split(':')[0] ?? 'free';
      const item = s.items.data[0] as any;
      await db.from('subscriptions').upsert({
        workspace_id: workspaceId,
        plan: s.status === 'canceled' ? 'free' : plan,
        status: s.status === 'incomplete_expired' ? 'expired' : (s.status as any),
        billing_cycle: s.items.data[0]?.price.recurring?.interval === 'year' ? 'annual' : 'monthly',
        current_period_start: new Date(item.current_period_start * 1000).toISOString(),
        current_period_end: new Date(item.current_period_end * 1000).toISOString(),
        cancel_at_period_end: s.cancel_at_period_end,
        stripe_subscription_id: s.id,
        updated_at: new Date().toISOString(),
      });
      await db.from('audit_log').insert({ workspace_id: workspaceId, action: `billing.${event.type.split('.').pop()}`, meta: { plan, status: s.status } });
      break;
    }
    case 'invoice.paid':
    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice;
      const { data } = await db.from('subscriptions').select('workspace_id').eq('stripe_customer_id', inv.customer as string).single();
      if (data) {
        await db.from('invoices').upsert({ id: inv.id, workspace_id: data.workspace_id, amount_cents: inv.amount_paid || inv.amount_due, currency: inv.currency, status: inv.status, hosted_url: inv.hosted_invoice_url, created_at: new Date(inv.created * 1000).toISOString() });
        if (event.type === 'invoice.payment_failed') await db.from('subscriptions').update({ status: 'past_due' }).eq('workspace_id', data.workspace_id);
      }
      break;
    }
  }
  return new Response('ok');
}

// Plan limits, checked server-side before creating a project or running AI.
export const LIMITS = {
  trial: { proposals: 1, pages: 200, aiActionsPerProposal: 60, seats: 1 },
  free: { proposals: 0, pages: 0, aiActionsPerProposal: 0, seats: 1 },
  pro: { proposals: 4, pages: 400, aiActionsPerProposal: 150, seats: 2 },
  business: { proposals: 15, pages: 1000, aiActionsPerProposal: 300, seats: 8 },
  enterprise: { proposals: Infinity, pages: 5000, aiActionsPerProposal: 1000, seats: Infinity },
} as const;
