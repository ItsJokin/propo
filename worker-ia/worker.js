// Servidor de IA de PROPO (Cloudflare Worker, sin dependencias: se puede pegar tal cual en el editor de Cloudflare).
// La web le envía el texto a procesar y este Worker llama a la API de Claude con la clave guardada como secreto en
// Cloudflare (Settings → Variables and Secrets → ANTHROPIC_API_KEY): la clave nunca llega al navegador.
//
//   POST /v1/generate   { input: string | {role, content}[], tier?: 'quick' | 'default' | 'complex' }
//   → flujo NDJSON: {"t": "trozo de texto"}… y al final {"done": true, "text", "truncated"} o {"error": "código"}
//   GET  /health        → {"ok": true, "key": true|false}
//
// Es la versión de un solo archivo de worker/ (que usa el SDK oficial y se despliega con wrangler): mismo contrato.

const ORIGINS = ['https://propo.es', 'https://www.propo.es'];
const MODEL = 'claude-opus-5-5';          // más barato: 'claude-sonnet-5-5' (la mitad) — o la variable MODEL del Worker
const MAX_INPUT_CHARS = 600000;
const PER_MINUTE = 20;                    // peticiones por minuto y dirección IP (el tope de gasto real es el saldo de la cuenta)
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

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const ok = ORIGINS.includes(origin);
    const cors = ok ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' } : { Vary: 'Origin' };

    if (req.method === 'OPTIONS') return new Response(null, { status: ok ? 204 : 403, headers: cors });
    if (url.pathname === '/health') return json({ ok: true, key: !!env.ANTHROPIC_API_KEY }, env.ANTHROPIC_API_KEY ? 200 : 503, cors);
    if (url.pathname !== '/v1/generate' || req.method !== 'POST') return json({ error: 'not_found' }, 404, cors);
    // Solo la web de PROPO. (Un programa puede falsear el origen: el freno real es el saldo de prepago de la cuenta.)
    if (!ok) return json({ error: 'forbidden' }, 403, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'upstream_error' }, 503, cors);
    if (!allowed(req.headers.get('CF-Connecting-IP') || 'unknown')) return json({ error: 'rate_limited' }, 429, cors);

    let body;
    try { body = await req.json(); } catch { return json({ error: 'bad_request' }, 400, cors); }
    const messages = parseInput(body && body.input);
    if (!messages) return json({ error: 'bad_request' }, 400, cors);
    if (messages.reduce((n, m) => n + m.content.length, 0) > MAX_INPUT_CHARS) return json({ error: 'prompt_too_large' }, 413, cors);
    const tier = body.tier === 'quick' || body.tier === 'complex' ? body.tier : 'default';

    let upstream;
    try {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          // Si el modelo declina una petición por sus filtros de seguridad, la API la reintenta en el modelo alternativo recomendado.
          'anthropic-beta': 'server-side-fallback-2026-07-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ model: env.MODEL || MODEL, max_tokens: 32000, stream: true, output_config: { effort: EFFORT[tier] }, fallbacks: 'default', messages }),
      });
    } catch { return json({ error: 'upstream_error' }, 502, cors); }
    if (!upstream.ok || !upstream.body) {
      let type = '', message = '';
      try { const e = await upstream.json(); type = e.error && e.error.type; message = e.error && e.error.message; } catch { /* sin cuerpo */ }
      const code = errorCode(upstream.status, type, message);
      return json({ error: code }, code === 'rate_limited' ? 429 : code === 'prompt_too_large' ? 413 : 502, cors);
    }

    // Traduce el flujo de eventos de la API (SSE) al formato de líneas que espera la web.
    const enc = new TextEncoder(), dec = new TextDecoder();
    const reader = upstream.body.getReader();
    const out = new ReadableStream({
      async start(controller) {
        const send = (o) => controller.enqueue(enc.encode(JSON.stringify(o) + '\n'));
        let buf = '', text = '', stop = null, failed = null;
        const onEvent = (raw) => {
          const data = raw.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).join('');
          if (!data) return;
          let ev; try { ev = JSON.parse(data); } catch { return; }
          if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') { text += ev.delta.text; send({ t: ev.delta.text }); }
          else if (ev.type === 'message_delta' && ev.delta && ev.delta.stop_reason) stop = ev.delta.stop_reason;
          else if (ev.type === 'error') failed = errorCode(0, ev.error && ev.error.type, ev.error && ev.error.message);
        };
        try {
          for (;;) {
            const r = await reader.read();
            if (r.done) break;
            buf += dec.decode(r.value, { stream: true }).replace(/\r\n/g, '\n');
            let i;
            while ((i = buf.indexOf('\n\n')) >= 0) { onEvent(buf.slice(0, i)); buf = buf.slice(i + 2); }
          }
          if (buf.trim()) onEvent(buf);
          if (failed) send({ error: failed });
          else if (stop === 'refusal') send({ error: 'refused' });
          else if (!stop) send({ error: 'upstream_error' });
          else send({ done: true, text, truncated: stop === 'max_tokens' });
        } catch { send({ error: 'upstream_error' }); }
        controller.close();
      },
      cancel() { reader.cancel().catch(() => {}); },
    });
    return new Response(out, { headers: { ...cors, 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' } });
  },
};
