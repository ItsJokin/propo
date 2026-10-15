// Servidor de IA de PROPO (Cloudflare Worker, sin dependencias: se puede pegar tal cual en el editor de Cloudflare).
// La web le envía el texto a procesar y este Worker llama a la API de Claude con la clave guardada como secreto en
// Cloudflare (Settings → Variables and Secrets → ANTHROPIC_API_KEY): la clave nunca llega al navegador.
//
// Solo atiende a cuentas de PROPO y respeta el tope de propuestas de su plan:
//   · la web envía el pase de sesión de Supabase (Authorization: Bearer …); aquí se comprueba su firma con las claves
//     públicas de Supabase, sin ningún secreto;
//   · antes de llamar a la IA se pregunta a Supabase (función use_ai) si le quedan propuestas; para eso hacen falta la
//     variable SUPABASE_URL y el secreto SUPABASE_SECRET_KEY (la clave «secret» de Supabase, nunca en la web).
//   Sin SUPABASE_URL el Worker funciona como antes (sin cuentas ni topes), para poder cambiarlo sin cortar el servicio.
//
//   POST /v1/generate   { input: string | {role, content}[], tier?: 'quick' | 'default' | 'complex', project?: string }
//   → el flujo de eventos de la API de Claude (SSE), sin modificar; los errores llegan como {"error": "código"}
//   GET  /health        → {"ok": true, "key": true|false, "accounts": true|false}

const ORIGINS = ['https://propo.es', 'https://www.propo.es'];
// Un modelo por tipo de tarea, para no pagar de más: las explicaciones cortas van al modelo pequeño; leer pliegos y
// redactar, al intermedio. (El mejor para pliegos difíciles es 'claude-opus-5-5', al doble de precio que Sonnet.)
const MODELS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5', complex: 'claude-sonnet-5-5' };
const MAX_TOKENS = { quick: 4000, default: 32000, complex: 32000 };
const MAX_INPUT_CHARS = 600000;
const PER_MINUTE = 40;                    // peticiones por minuto y dirección IP (freno de emergencia; el real va por cuenta)
const EFFORT = { quick: 'low', default: 'medium', complex: 'high' };

const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

function parseInput(input) {
  if (typeof input === 'string') return input.trim() ? [{ role: 'user', content: input }] : null;
  if (!Array.isArray(input) || !input.length) return null;
  const out = [];
  for (const m of input) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    out.push({ role: m.role, content: m.content });
  }
  return out[out.length - 1].role === 'user' ? out : null;
}

// Límite sencillo por IP. Vive en la memoria de cada instancia del Worker: frena el abuso evidente, no es contabilidad exacta.
const hits = new Map();
function allowed(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (list.length >= PER_MINUTE) { hits.set(ip, list); return false; }
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return true;
}

/** Código de error que entiende la web (src/lib/ai/provider.ts → friendlyAIError). */
function errorCode(status, type, message) {
  if (status === 429 || status === 529 || type === 'rate_limit_error' || type === 'overloaded_error') return 'rate_limited';
  if (status === 413 || (status === 400 && /too long|too large|context/i.test(message || ''))) return 'prompt_too_large';
  return 'upstream_error';
}

// ── Pase de sesión de Supabase (JWT firmado con ES256) ─────────────────────────────────────────────────────────────
const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)), (c) => c.charCodeAt(0));
let jwks = null, jwksAt = 0;
async function keysFor(env, kid, force) {
  if (force || !jwks || Date.now() - jwksAt > 3600000) {
    const r = await fetch(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`);
    if (r.ok) { jwks = (await r.json()).keys || []; jwksAt = Date.now(); }
  }
  return (jwks || []).find((k) => k.kid === kid);
}
/** Devuelve el id del usuario si el pase es auténtico y está en vigor; si no, null. */
async function userFrom(req, env) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.get('Authorization') || '');
  if (!m) return null;
  const parts = m[1].split('.');
  if (parts.length !== 3) return null;
  try {
    const head = JSON.parse(new TextDecoder().decode(b64(parts[0])));
    const claims = JSON.parse(new TextDecoder().decode(b64(parts[1])));
    if (head.alg !== 'ES256') return null;
    const jwk = (await keysFor(env, head.kid, false)) || (await keysFor(env, head.kid, true));   // por si Supabase cambió de clave
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, b64(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    if (!ok || !claims.sub || claims.aud !== 'authenticated' || claims.exp * 1000 < Date.now()) return null;
    return claims.sub;
  } catch { return null; }
}

/** Pregunta a Supabase si el usuario puede hacer esta petición (y la apunta). */
async function quota(env, user, project) {
  const secret = env.SUPABASE_SECRET_KEY;
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/use_ai`, {
    method: 'POST',
    headers: { apikey: secret, ...(secret.startsWith('eyJ') ? { Authorization: `Bearer ${secret}` } : {}), 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_user: user, p_project: String(project || '').slice(0, 120) }),
  });
  if (!r.ok) return { ok: false, reason: 'quota_unavailable' };
  return r.json();
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const ok = ORIGINS.includes(origin);
    const cors = ok ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', Vary: 'Origin' } : { Vary: 'Origin' };
    const accounts = !!env.SUPABASE_URL;

    if (req.method === 'OPTIONS') return new Response(null, { status: ok ? 204 : 403, headers: cors });
    if (url.pathname === '/health') return json({ ok: true, key: !!env.ANTHROPIC_API_KEY, accounts: accounts && !!env.SUPABASE_SECRET_KEY }, env.ANTHROPIC_API_KEY ? 200 : 503, cors);
    if (url.pathname !== '/v1/generate' || req.method !== 'POST') return json({ error: 'not_found' }, 404, cors);
    if (!ok) return json({ error: 'forbidden' }, 403, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'upstream_error' }, 503, cors);
    if (!allowed(req.headers.get('CF-Connecting-IP') || 'unknown')) return json({ error: 'rate_limited' }, 429, cors);

    let body;
    try { body = await req.json(); } catch { return json({ error: 'bad_request' }, 400, cors); }
    const messages = parseInput(body && body.input);
    if (!messages) return json({ error: 'bad_request' }, 400, cors);
    if (messages.reduce((n, m) => n + m.content.length, 0) > MAX_INPUT_CHARS) return json({ error: 'prompt_too_large' }, 413, cors);
    const tier = body.tier === 'quick' || body.tier === 'complex' ? body.tier : 'default';

    // Cuentas y topes: solo cuentas de PROPO y dentro de las propuestas de su plan.
    if (accounts) {
      if (!env.SUPABASE_SECRET_KEY) return json({ error: 'quota_unavailable' }, 503, cors);
      const user = await userFrom(req, env);
      if (!user) return json({ error: 'not_signed_in' }, 401, cors);
      let q;
      try { q = await quota(env, user, body.project); } catch { q = { ok: false, reason: 'quota_unavailable' }; }
      if (!q.ok) return json({ error: q.reason || 'quota_unavailable', used: q.used, quota: q.quota, cap: q.cap }, q.reason === 'rate_limited' ? 429 : q.reason === 'quota_unavailable' ? 503 : 402, cors);
    }

    const model = env.MODEL || MODELS[tier];
    const fallback = !/haiku/.test(model);   // el modelo pequeño no admite el reintento automático en otro modelo
    let upstream;
    try {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          // Si el modelo declina una petición por sus filtros de seguridad, la API la reintenta en el modelo alternativo recomendado.
          ...(fallback ? { 'anthropic-beta': 'server-side-fallback-2026-07-01' } : {}),
          'content-type': 'application/json',
        },
        body: JSON.stringify({ model, max_tokens: MAX_TOKENS[tier], stream: true, output_config: { effort: EFFORT[tier] }, ...(fallback ? { fallbacks: 'default' } : {}), messages }),
      });
    } catch { return json({ error: 'upstream_error' }, 502, cors); }
    if (!upstream.ok || !upstream.body) {
      let type = '', message = '';
      try { const e = await upstream.json(); type = e.error && e.error.type; message = e.error && e.error.message; } catch { /* sin cuerpo */ }
      const code = errorCode(upstream.status, type, message);
      return json({ error: code }, code === 'rate_limited' ? 429 : code === 'prompt_too_large' ? 413 : 502, cors);
    }

    // El flujo de eventos de la API (SSE) se reenvía tal cual: la web lo interpreta. Así el Worker casi no consume tiempo de
    // cálculo, que en el plan gratuito de Cloudflare es muy corto y cortaba las respuestas largas a medias.
    return new Response(upstream.body, { headers: { ...cors, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store' } });
  },
};
