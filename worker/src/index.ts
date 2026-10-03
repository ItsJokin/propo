// Servidor intermedio de IA de PROPO (Cloudflare Worker).
// La web publicada le envía el texto a procesar y este Worker llama a la API de Claude con la clave
// guardada como secreto: la clave nunca llega al navegador.
//
//   POST /v1/generate   { input: string | {role, content}[], tier?: 'quick' | 'default' | 'complex' }
//   → flujo NDJSON: {"t": "trozo de texto"}… y al final {"done": true, "text", "truncated"} o {"error": "código"}
//   GET  /health        → {"ok": true}
import Anthropic from '@anthropic-ai/sdk';

interface RateLimiter { limit(o: { key: string }): Promise<{ success: boolean }> }
interface Env {
  ANTHROPIC_API_KEY: string;   // secreto (wrangler secret / GitHub Actions)
  ALLOWED_ORIGINS: string;     // orígenes de la web separados por comas
  MODEL?: string;
  MAX_INPUT_CHARS?: string;
  LIMITER?: RateLimiter;       // límite por IP (ver wrangler.toml)
}
type Turn = { role: 'user' | 'assistant'; content: string };

const EFFORT = { quick: 'low', default: 'medium', complex: 'high' } as const;

const json = (body: unknown, status: number, headers: HeadersInit) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

function parseInput(input: unknown): Turn[] | null {
  if (typeof input === 'string') return input.trim() ? [{ role: 'user', content: input }] : null;
  if (!Array.isArray(input) || !input.length) return null;
  const out: Turn[] = [];
  for (const m of input) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    out.push({ role: m.role, content: m.content });
  }
  return out[out.length - 1].role === 'user' ? out : null;
}

/** Código de error que entiende la web (src/lib/ai/provider.ts → friendlyAIError). */
function errorCode(e: unknown): string {
  if (e instanceof Anthropic.RateLimitError) return 'rate_limited';
  if (e instanceof Anthropic.BadRequestError) return /too long|too large|context/i.test(e.message) ? 'prompt_too_large' : 'upstream_error';
  if (e instanceof Anthropic.APIUserAbortError) return 'cancelled';
  if (e instanceof Anthropic.APIError) return e.status === 529 ? 'rate_limited' : 'upstream_error';
  return 'upstream_error';
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const ok = allowed.includes(origin);
    const cors: Record<string, string> = ok ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', Vary: 'Origin' } : {};

    if (req.method === 'OPTIONS') return new Response(null, { status: ok ? 204 : 403, headers: cors });
    if (url.pathname === '/health') return json({ ok: true }, 200, cors);
    if (url.pathname !== '/v1/generate' || req.method !== 'POST') return json({ error: 'not_found' }, 404, cors);
    // Solo la web de PROPO. (Un programa puede falsear el origen: el freno real son el límite por IP y el tope de gasto de la cuenta.)
    if (!ok) return json({ error: 'forbidden' }, 403, cors);

    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
    if (env.LIMITER && !(await env.LIMITER.limit({ key: ip })).success) return json({ error: 'rate_limited' }, 429, cors);

    let body: any;
    try { body = await req.json(); } catch { return json({ error: 'bad_request' }, 400, cors); }
    const messages = parseInput(body?.input);
    if (!messages) return json({ error: 'bad_request' }, 400, cors);
    const chars = messages.reduce((n, m) => n + m.content.length, 0);
    if (chars > Number(env.MAX_INPUT_CHARS || 600000)) return json({ error: 'prompt_too_large' }, 413, cors);
    const tier: keyof typeof EFFORT = body?.tier === 'quick' || body?.tier === 'complex' ? body.tier : 'default';

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const stream = client.beta.messages.stream({
      model: env.MODEL || 'claude-opus-5-5',
      max_tokens: 32000,
      output_config: { effort: EFFORT[tier] },
      // Si el modelo declina una petición por sus filtros de seguridad, la API la reintenta en el modelo alternativo recomendado.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      messages,
    } as any);

    const enc = new TextEncoder();
    const out = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (o: unknown) => controller.enqueue(enc.encode(JSON.stringify(o) + '\n'));
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') send({ t: event.delta.text });
          }
          const final = await stream.finalMessage();
          if (final.stop_reason === 'refusal') send({ error: 'refused' });
          else {
            let text = '';
            for (const block of final.content) if (block.type === 'text') text += block.text;
            send({ done: true, text, truncated: final.stop_reason === 'max_tokens' });
          }
        } catch (e) {
          send({ error: errorCode(e) });
        }
        controller.close();
      },
      cancel() { stream.abort(); },
    });
    return new Response(out, { headers: { ...cors, 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' } });
  },
};
