// Servidor de pagos de PROPO (Cloudflare Worker, sin dependencias: se puede pegar tal cual en el editor de Cloudflare).
// Une Stripe con las cuentas de Supabase. La tarjeta la escribe el cliente en la página segura de Stripe: ni la web ni
// este Worker la ven nunca.
//
//   POST /checkout   { plan: 'pro' | 'business', cycle: 'monthly' | 'annual' }  (con el pase de sesión de Supabase)
//                    → { url } de la página de pago de Stripe (o del portal, si ya tiene una suscripción activa)
//   POST /portal     → { url } del portal de cliente de Stripe: tarjeta, facturas, cambio de plan y cancelación
//   POST /webhook    ← avisos de Stripe (firmados): alta, renovación, cambio, impago y baja → tabla subscriptions
//   GET  /health     → qué está configurado (sin enseñar ningún valor)
//
// Configuración en Cloudflare (Settings → Variables and Secrets):
//   Secretos:  STRIPE_SECRET_KEY (sk_test_… en pruebas, sk_live_… en real) · STRIPE_WEBHOOK_SECRET (whsec_…)
//              SUPABASE_SECRET_KEY (la misma clave «secret» que usa el servidor de IA)
//   Variables: SUPABASE_URL · PRICE_PRO_MONTHLY · PRICE_PRO_ANNUAL · PRICE_BUSINESS_MONTHLY · PRICE_BUSINESS_ANNUAL
//              TAX_RATE (opcional, txr_… del IVA 21 %) · SITE (opcional, por defecto https://propo.es)
//   Correo de bienvenida (opcional): secreto RESEND_API_KEY (re_…) · variable MAIL_FROM (por defecto «PROPO <hola@propo.es>»)

const ORIGINS = ['https://propo.es', 'https://www.propo.es'];
const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

// ── Pase de sesión de Supabase (JWT ES256), igual que en el servidor de IA ──────────────────────────────────────────
const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)), (c) => c.charCodeAt(0));
let jwks = null, jwksAt = 0;
async function keysFor(env, kid, force) {
  if (force || !jwks || Date.now() - jwksAt > 3600000) {
    const r = await fetch(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`);
    if (r.ok) { jwks = (await r.json()).keys || []; jwksAt = Date.now(); }
  }
  return (jwks || []).find((k) => k.kid === kid);
}
/** { id, email } si el pase es auténtico y está en vigor; si no, null. */
async function userFrom(req, env) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.get('Authorization') || '');
  if (!m) return null;
  const parts = m[1].split('.');
  if (parts.length !== 3) return null;
  try {
    const head = JSON.parse(new TextDecoder().decode(b64(parts[0])));
    const claims = JSON.parse(new TextDecoder().decode(b64(parts[1])));
    if (head.alg !== 'ES256') return null;
    const jwk = (await keysFor(env, head.kid, false)) || (await keysFor(env, head.kid, true));
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, b64(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    if (!ok || !claims.sub || claims.aud !== 'authenticated' || claims.exp * 1000 < Date.now()) return null;
    return { id: claims.sub, email: claims.email || '' };
  } catch { return null; }
}

// ── Supabase (tabla subscriptions, con la clave secreta) ─────────────────────────────────────────────────────────────
function sbHeaders(env, extra) {
  const k = env.SUPABASE_SECRET_KEY;
  return { apikey: k, ...(k.startsWith('eyJ') ? { Authorization: `Bearer ${k}` } : {}), 'Content-Type': 'application/json', ...extra };
}
async function getRow(env, userId) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?select=*&user_id=eq.${encodeURIComponent(userId)}`, { headers: sbHeaders(env) });
  if (!r.ok) throw new Error('supabase_read');
  return (await r.json())[0] || null;
}
async function userByCustomer(env, customer) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?select=user_id&stripe_customer_id=eq.${encodeURIComponent(customer)}`, { headers: sbHeaders(env) });
  if (!r.ok) throw new Error('supabase_read');
  return (await r.json())[0]?.user_id || null;
}
async function saveRow(env, userId, fields) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?on_conflict=user_id`, {
    method: 'POST', headers: sbHeaders(env, { Prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify({ user_id: userId, ...fields, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`supabase_write ${r.status} ${await r.text()}`);
}

// ── Stripe (API REST con formularios, sin librería) ─────────────────────────────────────────────────────────────────
function form(obj, prefix, out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') form(v, key, out);
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out.join('&');
}
async function stripe(env, method, path, params) {
  const r = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: method === 'GET' ? undefined : form(params || {}),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`stripe ${r.status} ${j?.error?.message || ''}`);
  return j;
}

const PRICES = (env) => ({
  pro: { monthly: env.PRICE_PRO_MONTHLY, annual: env.PRICE_PRO_ANNUAL },
  business: { monthly: env.PRICE_BUSINESS_MONTHLY, annual: env.PRICE_BUSINESS_ANNUAL },
});
/** ¿Qué plan y ciclo corresponden a este precio de Stripe? */
function planOf(env, priceId) {
  for (const [plan, cycles] of Object.entries(PRICES(env))) for (const [cycle, id] of Object.entries(cycles)) if (id && id === priceId) return { plan, cycle };
  return null;
}
const iso = (t) => (t ? new Date(t * 1000).toISOString() : null);

/** Copia el estado de una suscripción de Stripe a la fila del cliente. */
async function applySubscription(env, sub, userHint) {
  const userId = sub.metadata?.user_id || userHint || (await userByCustomer(env, sub.customer));
  if (!userId) return;
  const item = sub.items?.data?.[0];
  const p = planOf(env, item?.price?.id);
  const start = sub.current_period_start ?? item?.current_period_start;   // según la versión de la API de Stripe
  const end = sub.current_period_end ?? item?.current_period_end;
  const live = ['active', 'trialing', 'past_due'].includes(sub.status);
  await saveRow(env, userId, {
    plan: live && p ? p.plan : 'free',
    status: sub.status === 'trialing' ? 'active' : live ? sub.status : 'canceled',
    billing_cycle: p?.cycle || null,
    period_start: iso(start) || new Date().toISOString(),
    current_period_end: iso(end),
    cancel_at_period_end: !!sub.cancel_at_period_end,
    stripe_customer_id: sub.customer,
    stripe_subscription_id: live ? sub.id : null,
  });
}

// ── Correo de bienvenida (Resend) ───────────────────────────────────────────────────────────────────────────────────
const PLAN_INFO = { pro: { name: 'Pro', n: 6 }, business: { name: 'Business', n: 17 } };
const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fecha = (t) => (t ? new Date(t * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' }) : '');

function welcomeEmail(site, name, plan, cycle, renews) {
  const p = PLAN_INFO[plan] || PLAN_INFO.pro;
  const first = esc(String(name || '').trim().split(/\s+/)[0]);
  const ciclo = cycle === 'annual' ? 'anual' : 'mensual';
  const step = (n, t, d) => `<tr><td style="padding:0 0 18px 0;vertical-align:top;width:42px"><div style="width:30px;height:30px;border-radius:50%;background:#1463FF;color:#ffffff;font-weight:800;font-size:14px;line-height:30px;text-align:center">${n}</div></td><td style="padding:0 0 18px 0;vertical-align:top"><div style="font-weight:700;color:#0B1730;font-size:15px">${t}</div><div style="color:#475467;font-size:14px;line-height:1.5;margin-top:2px">${d}</div></td></tr>`;
  const html = `<!doctype html><html lang="es"><body style="margin:0;padding:0;background:#F4F6FA;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FA;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0B1730;padding:24px 32px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:middle"><img src="${site}/media/propo-logo-email.png" alt="" width="34" height="34" style="display:block;width:34px;height:34px"></td><td style="vertical-align:middle;padding-left:10px;color:#ffffff;font-weight:800;font-size:20px;letter-spacing:1px">PROPO</td></tr></table></td></tr>
<tr><td style="padding:34px 32px 6px 32px">
<div style="font-size:26px;font-weight:800;color:#0B1730;letter-spacing:-0.5px;line-height:1.2">¡Gracias${first ? `, ${first}` : ''}! Tu plan ${p.name} ya está activo.</div>
<p style="color:#475467;font-size:15px;line-height:1.6;margin:14px 0 0 0">Nos alegra mucho tenerte en PROPO. A partir de hoy, preparar una licitación es cuestión de minutos: nosotros leemos el pliego, redactamos la propuesta y lo revisamos todo. Tú solo firmas.</p>
</td></tr>
<tr><td style="padding:22px 32px 6px 32px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EAF1FF;border-radius:12px"><tr><td style="padding:18px 20px">
<div style="font-size:12px;font-weight:800;letter-spacing:1.5px;color:#1463FF">TU SUSCRIPCIÓN</div>
<div style="font-size:18px;font-weight:800;color:#0B1730;margin-top:6px">PROPO ${p.name} · ${p.n} propuestas al mes</div>
<div style="font-size:14px;color:#475467;margin-top:4px">Facturación ${ciclo}${renews ? ` · próxima renovación el ${renews}` : ''}</div>
</td></tr></table></td></tr>
<tr><td style="padding:26px 32px 4px 32px"><div style="font-size:17px;font-weight:800;color:#0B1730;margin-bottom:16px">Empieza en 3 pasos</div>
<table role="presentation" cellpadding="0" cellspacing="0">${step(1, 'Completa tu memoria de empresa', 'Experiencia, equipo y certificados. Se guarda una vez y PROPO lo usa en todas tus propuestas.')}${step(2, 'Elige una licitación', 'En «Licitaciones» verás las que encajan contigo. Pulsa «Preparar propuesta».')}${step(3, 'Responde y descarga', 'PROPO solo te pregunta lo imprescindible, redacta la oferta y te entrega el paquete listo para firmar.')}</table></td></tr>
<tr><td style="padding:6px 32px 30px 32px"><a href="${site}/#/app" style="display:inline-block;background:#1463FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 26px;border-radius:10px">Entrar en PROPO →</a></td></tr>
<tr><td style="padding:0 32px 30px 32px;border-top:1px solid #E4E7EC"><p style="color:#475467;font-size:13px;line-height:1.6;margin:20px 0 0 0">La factura te llegará en un correo aparte. Puedes descargar tus facturas, cambiar de plan o cancelar cuando quieras desde <b>Ajustes → Facturación</b>.</p>
<p style="color:#475467;font-size:13px;line-height:1.6;margin:10px 0 0 0">¿Alguna duda? Responde a este correo y te ayudamos personalmente.</p>
<p style="color:#0B1730;font-size:14px;font-weight:700;margin:18px 0 0 0">El equipo de PROPO</p></td></tr>
</table>
<div style="color:#98A2B3;font-size:12px;margin-top:16px">PROPO · Licitaciones públicas, preparadas en minutos · <a href="${site}" style="color:#98A2B3">propo.es</a></div>
</td></tr></table></body></html>`;
  const text = `¡Gracias${first ? `, ${first}` : ''}! Tu plan ${p.name} ya está activo.\n\nTu suscripción: PROPO ${p.name} · ${p.n} propuestas al mes · facturación ${ciclo}${renews ? ` · próxima renovación el ${renews}` : ''}.\n\nEmpieza en 3 pasos:\n1. Completa tu memoria de empresa.\n2. Elige una licitación y pulsa «Preparar propuesta».\n3. Responde lo imprescindible y descarga el paquete.\n\nEntrar en PROPO: ${site}/#/app\n\nLa factura te llegará en un correo aparte. Gestiona tu suscripción en Ajustes → Facturación.\n¿Dudas? Responde a este correo.\n\nEl equipo de PROPO`;
  return { subject: `¡Bienvenido a PROPO ${p.name}! Tu suscripción está activa`, html, text };
}

/** Envía el correo de bienvenida. Si falla, no se reintenta el aviso de Stripe: el plan ya está activo. */
async function sendWelcome(env, site, eventId, session, sub) {
  if (!env.RESEND_API_KEY) return;
  const to = session.customer_details?.email || session.customer_email;
  const item = sub.items?.data?.[0];
  const p = planOf(env, item?.price?.id);
  if (!to || !p) return;
  const mail = welcomeEmail(site, session.customer_details?.name, p.plan, p.cycle, fecha(sub.current_period_end ?? item?.current_period_end));
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `welcome-${eventId}` },
      body: JSON.stringify({ from: env.MAIL_FROM || 'PROPO <hola@propo.es>', to: [to], reply_to: 'hola@propo.es', subject: mail.subject, html: mail.html, text: mail.text }),
    });
  } catch { /* el correo no es imprescindible */ }
}

// ── Firma de los avisos de Stripe (cabecera Stripe-Signature: t=…,v1=…) ─────────────────────────────────────────────
async function verifySignature(raw, header, secret) {
  const parts = Object.fromEntries((header || '').split(',').map((x) => x.split('=')).filter((x) => x.length === 2).map(([k, v]) => [k.trim(), v.trim()]));
  const sigs = (header || '').split(',').filter((x) => x.trim().startsWith('v1=')).map((x) => x.trim().slice(3));
  const t = Number(parts.t);
  if (!t || !sigs.length || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${raw}`)));
  const hex = [...mac].map((b) => b.toString(16).padStart(2, '0')).join('');
  return sigs.some((s) => s.length === hex.length && [...s].reduce((acc, c, i) => acc | (c.charCodeAt(0) ^ hex.charCodeAt(i)), 0) === 0);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const okOrigin = ORIGINS.includes(origin);
    const cors = okOrigin ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', Vary: 'Origin' } : { Vary: 'Origin' };
    const site = (env.SITE || 'https://propo.es').replace(/\/+$/, '');

    if (req.method === 'OPTIONS') return new Response(null, { status: okOrigin ? 204 : 403, headers: cors });

    if (url.pathname === '/health') {
      const pr = PRICES(env);
      return json({
        ok: true, stripe: !!env.STRIPE_SECRET_KEY, mail: !!env.RESEND_API_KEY, mode: /_live_/.test(String(env.STRIPE_SECRET_KEY || '')) ? 'live' : 'test',
        webhook: !!env.STRIPE_WEBHOOK_SECRET, accounts: !!env.SUPABASE_URL && !!env.SUPABASE_SECRET_KEY,
        prices: { pro: !!(pr.pro.monthly && pr.pro.annual), business: !!(pr.business.monthly && pr.business.annual) }, tax: !!env.TAX_RATE,
      }, 200, cors);
    }

    // Avisos de Stripe: no vienen del navegador, se comprueban por su firma.
    if (url.pathname === '/webhook' && req.method === 'POST') {
      const raw = await req.text();
      if (!env.STRIPE_WEBHOOK_SECRET || !(await verifySignature(raw, req.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET))) return json({ error: 'bad_signature' }, 400);
      const ev = JSON.parse(raw);
      const o = ev.data?.object || {};
      try {
        if (ev.type === 'checkout.session.completed' && o.mode === 'subscription' && o.subscription) {
          const sub = await stripe(env, 'GET', `subscriptions/${o.subscription}`);
          await applySubscription(env, sub, o.client_reference_id);
          await sendWelcome(env, site, ev.id, o, sub);
        } else if (ev.type === 'customer.subscription.created' || ev.type === 'customer.subscription.updated' || ev.type === 'customer.subscription.deleted') {
          await applySubscription(env, o, null);
        }
      } catch (e) { return json({ error: String(e.message || e) }, 500); }   // Stripe lo reintentará
      return json({ received: true }, 200);
    }

    if (!['/checkout', '/portal'].includes(url.pathname) || req.method !== 'POST') return json({ error: 'not_found' }, 404, cors);
    if (!okOrigin) return json({ error: 'forbidden' }, 403, cors);
    if (!env.STRIPE_SECRET_KEY || !env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) return json({ error: 'not_configured' }, 503, cors);
    const user = await userFrom(req, env);
    if (!user) return json({ error: 'not_signed_in' }, 401, cors);

    try {
      const row = await getRow(env, user.id);
      const back = `${site}/?pago=volver#/app/settings/billing`;

      if (url.pathname === '/portal') {
        if (!row?.stripe_customer_id) return json({ error: 'no_customer' }, 404, cors);
        const p = await stripe(env, 'POST', 'billing_portal/sessions', { customer: row.stripe_customer_id, return_url: back, locale: 'es' });
        return json({ url: p.url }, 200, cors);
      }

      const body = await req.json().catch(() => ({}));
      const price = PRICES(env)[body.plan]?.[body.cycle === 'annual' ? 'annual' : 'monthly'];
      if (!price) return json({ error: 'bad_plan' }, 400, cors);

      // Con una suscripción activa no se abre otra: el cambio de plan se hace en el portal (Stripe prorratea).
      if (row?.stripe_subscription_id && row.status !== 'canceled' && row.stripe_customer_id) {
        const p = await stripe(env, 'POST', 'billing_portal/sessions', { customer: row.stripe_customer_id, return_url: back, locale: 'es' });
        return json({ url: p.url, portal: true }, 200, cors);
      }

      let customer = row?.stripe_customer_id;
      if (!customer) {
        const c = await stripe(env, 'POST', 'customers', { email: user.email || undefined, metadata: { user_id: user.id }, preferred_locales: { 0: 'es' } });
        customer = c.id;
        await saveRow(env, user.id, { stripe_customer_id: customer });
      }
      const session = await stripe(env, 'POST', 'checkout/sessions', {
        mode: 'subscription',
        customer,
        client_reference_id: user.id,
        line_items: { 0: { price, quantity: 1 } },
        subscription_data: { metadata: { user_id: user.id }, ...(env.TAX_RATE ? { default_tax_rates: { 0: env.TAX_RATE } } : {}) },
        billing_address_collection: 'required',
        tax_id_collection: { enabled: 'true' },
        customer_update: { name: 'auto', address: 'auto' },
        allow_promotion_codes: 'true',
        locale: 'es',
        success_url: `${site}/?pago=ok#/app/settings/billing`,
        cancel_url: back,
      });
      return json({ url: session.url }, 200, cors);
    } catch (e) {
      return json({ error: 'payment_error', detail: String(e.message || e).slice(0, 200) }, 502, cors);
    }
  },
};
