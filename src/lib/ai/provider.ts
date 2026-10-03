// AI provider abstraction.
// Production: OpenAI (or any provider) called from the server, never from the browser,
// with the API key in server env vars. See server/ai/openaiProvider.ts.
// This MVP build: when opened inside claude.ai, calls Claude through the Artifact
// `sample` capability (runs on the viewer's own Claude account, asks consent first).
// Everywhere else the AI is reported as unavailable and PROPO falls back to
// rule-based extraction and template drafts, clearly labelled as such.

type SampleFn = ((input: string | { role: 'user' | 'assistant'; content: string }[], opts?: any) => Promise<{ text: string; truncated: boolean }>) & {
  json: <T = unknown>(input: string | { role: 'user' | 'assistant'; content: string }[], opts?: any) => Promise<T>;
};

export type AIState = 'checking' | 'available' | 'unavailable' | 'declined';

let samplePromise: Promise<SampleFn | null> | null = null;
let declined = false;
const listeners = new Set<(s: AIState) => void>();
let state: AIState = 'checking';

function setState(s: AIState) { state = s; listeners.forEach((l) => l(s)); }

/** Dirección del servidor intermedio de IA (worker/). La fija la compilación; vacía = sin IA fuera de claude.ai. */
const AI_URL = String(process.env.PROPO_AI_URL || '').replace(/\/+$/, '');
const coded = (code: string) => Object.assign(new Error(code), { code });

/** Lee el primer objeto o lista JSON de una respuesta de texto (por si viene envuelta en ``` o con una frase delante). */
function parseJson<T>(text: string): T {
  const a = text.search(/[{[]/);
  const b = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
  if (a < 0 || b <= a) throw coded('invalid_json');
  try { return JSON.parse(text.slice(a, b + 1)) as T; } catch { throw coded('invalid_json'); }
}

/** Misma interfaz que `sample` de claude.ai, pero a través del servidor intermedio de PROPO. */
function remoteSample(base: string): SampleFn {
  const run = async (input: string | { role: 'user' | 'assistant'; content: string }[], opts: any = {}) => {
    let res: Response;
    try {
      res = await fetch(`${base}/v1/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, tier: opts.modelTier ?? 'default' }), signal: opts.signal });
    } catch (e: any) { throw coded(e?.name === 'AbortError' ? 'cancelled' : 'upstream_error'); }
    if (!res.ok || !res.body) { let code = 'upstream_error'; try { code = (await res.json()).error || code; } catch { /* sin cuerpo */ } throw coded(code); }
    const reader = res.body.getReader(); const dec = new TextDecoder();
    let buf = ''; let text = ''; let truncated = false; let done = false;
    const line = (l: string) => {
      if (!l.trim()) return;
      const m = JSON.parse(l);
      if (m.error) throw coded(m.error);
      if (typeof m.t === 'string') { text += m.t; opts.onText?.({ text }); }
      if (m.done) { done = true; truncated = !!m.truncated; if (typeof m.text === 'string') text = m.text; }
    };
    try {
      for (;;) {
        const r = await reader.read();
        if (r.done) break;
        buf += dec.decode(r.value, { stream: true });
        let i: number;
        while ((i = buf.indexOf('\n')) >= 0) { line(buf.slice(0, i)); buf = buf.slice(i + 1); }
      }
      line(buf);
    } catch (e: any) { throw e?.code ? e : coded(e?.name === 'AbortError' ? 'cancelled' : 'upstream_error'); }
    if (!done) throw coded('upstream_error');
    return { text, truncated };
  };
  return Object.assign(run, { json: async <T = unknown>(input: any, opts?: any) => parseJson<T>((await run(input, opts)).text) }) as SampleFn;
}

export function getSample(): Promise<SampleFn | null> {
  if (!samplePromise) {
    samplePromise = (async () => {
      const c = (window as any).claude;
      if (!c?.use && AI_URL) {
        try {
          const r = await fetch(`${AI_URL}/health`);
          if (r.ok) { setState('available'); return remoteSample(AI_URL); }
        } catch { /* servidor no disponible */ }
        setState('unavailable'); return null;
      }
      if (!c?.use) { setState('unavailable'); return null; }
      try {
        const s = await c.use('sample');
        setState(s ? 'available' : 'unavailable');
        return s;
      } catch { setState('unavailable'); return null; }
    })();
  }
  return samplePromise;
}

export function aiState() { return state; }
export function onAIState(fn: (s: AIState) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }

export class AIError extends Error {
  code: string;
  constructor(code: string, message: string) { super(message); this.code = code; }
}

const HIDE = new Set(['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed']);

export function friendlyAIError(code: string): string {
  switch (code) {
    case 'not_granted': return 'No se ha permitido el uso de IA en esta página, así que PROPO ha usado la extracción básica.';
    case 'rate_limited': return 'El servicio de IA está ocupado o has alcanzado tu límite de uso. Inténtalo de nuevo en unos minutos.';
    case 'prompt_too_large': return 'Esta parte del pliego es demasiado grande para procesarla de una vez. PROPO trabajará con un extracto más corto.';
    case 'invalid_json': return 'No se ha podido leer la respuesta de la IA. Inténtalo de nuevo.';
    case 'refused': return 'La IA no ha procesado este contenido. Prueba a reformularlo o a procesar una parte más pequeña.';
    case 'session_expired': return 'Tu sesión ha caducado. Vuelve a iniciar sesión para seguir usando la IA.';
    case 'cancelled': return 'Detenido.';
    default: return 'El servicio de IA no ha respondido. Tu trabajo está guardado; inténtalo de nuevo.';
  }
}

async function call<T>(fn: (s: SampleFn) => Promise<T>): Promise<T> {
  if (declined) throw new AIError('not_granted', 'declined');
  const s = await getSample();
  if (!s) throw new AIError('unavailable', 'AI not available in this view');
  try {
    return await fn(s);
  } catch (e: any) {
    const code = e?.code || 'upstream_error';
    if (HIDE.has(code)) { declined = true; setState('declined'); }
    throw new AIError(code, e?.message || code);
  }
}

export const ai = {
  json<T>(prompt: string, opts: { tier?: 'quick' | 'default' | 'complex'; signal?: AbortSignal; cache?: boolean } = {}) {
    return call((s) => s.json<T>(prompt, { modelTier: opts.tier ?? 'default', signal: opts.signal, cache: opts.cache ?? false }));
  },
  text(input: string | { role: 'user' | 'assistant'; content: string }[], opts: { tier?: 'quick' | 'default' | 'complex'; signal?: AbortSignal; onText?: (t: string) => void } = {}) {
    return call((s) => s(input, { modelTier: opts.tier ?? 'default', signal: opts.signal, cache: false, onText: opts.onText ? ({ text }: { text: string }) => opts.onText!(text) : undefined }));
  },
};
