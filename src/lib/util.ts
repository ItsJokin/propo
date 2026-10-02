export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;

export const nowIso = () => new Date().toISOString();

export function addDays(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = new Date(iso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}

export function fmtDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('es-ES', opts); } catch { return iso; }
}

export function fmtShort(iso: string | null | undefined) {
  return fmtDate(iso, { day: 'numeric', month: 'short' });
}

export function timeAgo(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'ahora mismo';
  const m = Math.round(s / 60); if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60); if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24); if (d < 30) return `hace ${d} d`;
  return fmtShort(iso);
}

export const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%€ ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function tokens(s: string): string[] {
  return normalize(s).split(' ').filter((t) => t.length > 2 && !STOP.has(t));
}

const STOP = new Set(['para', 'como', 'este', 'esta', 'sera', 'seran', 'deber', 'debera', 'deberan', 'contrato', 'servicio', 'servicios', 'las', 'los', 'del', 'con', 'por', 'una', 'que', 'sus', 'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'will', 'must', 'shall', 'which', 'have', 'has', 'been', 'its', 'their', 'any', 'all', 'not', 'per', 'than', 'least', 'each', 'into', 'del', 'las', 'los', 'por', 'para', 'con', 'una', 'que', 'est']);

export function plural(n: number, one: string, many = one + 's') { return `${n} ${n === 1 ? one : many}`; }

export function kb(n: number) { return n >= 1024 ? `${(n / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(n))} KB`; }

export const INFO_RE = /\[(?:Información requerida|Information required):\s*([^\]]+)\]/g;
export const INFO_TAG = 'Información requerida';

export function wordCount(s: string) { return (s.trim().match(/\S+/g) || []).length; }
export const isUnknown = (s?: string | null) => !s || /^(No identificad|Not identified)/.test(s);
