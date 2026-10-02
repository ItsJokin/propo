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

export function getSample(): Promise<SampleFn | null> {
  if (!samplePromise) {
    samplePromise = (async () => {
      const c = (window as any).claude;
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
