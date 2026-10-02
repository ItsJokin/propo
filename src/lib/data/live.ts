// Datos en vivo: la web lee data/ junto a la página (lo que publica el robot, ver scripts/ y shared/schema.mjs).
// Si no hay carpeta de datos (p. ej. la versión de claude.ai), se queda con la instantánea de TED incluida.
import { useSyncExternalStore } from 'react';
// @ts-ignore: módulo JS compartido con el robot
import { T, cpvDivision } from '../../../shared/schema.mjs';
import { TED_NOTICES, TED_SNAPSHOT_DATE, type TedNotice } from '../discovery/tedSnapshot';
import { SECTORS } from '../discovery/match';

export interface SourceStatus { label: string; ok: boolean; error?: string; at?: string; failedAt?: string }
export interface LiveMeta {
  checkedAt?: string; updatedAt?: string; repo?: string;
  sources?: Record<string, SourceStatus>;
  counts?: { tenders: number; awards: number; partitions: number };
}
export interface LiveState { status: 'loading' | 'live' | 'bundled'; tenders: TedNotice[]; meta: LiveMeta | null }

const BUNDLED: LiveMeta = { checkedAt: TED_SNAPSHOT_DATE };
let state: LiveState = { status: 'loading', tenders: TED_NOTICES, meta: BUNDLED };
const listeners = new Set<() => void>();
const set = (s: LiveState) => { state = s; listeners.forEach((l) => l()); };

export const getLive = () => state;
export function useLive() { return useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, getLive, getLive); }

/** Minutos desde la última lectura del robot. */
export function dataAgeMinutes(m: LiveMeta | null | undefined): number | null {
  return m?.checkedAt ? Math.max(0, Math.round((Date.now() - new Date(m.checkedAt).getTime()) / 60000)) : null;
}

/** Busca una licitación por id en los datos cargados (en vivo o instantánea). */
export function findTender(id: string): TedNotice | undefined {
  return state.tenders.find((t) => t.id === id) ?? TED_NOTICES.find((t) => t.id === id);
}

// Sector de PROPO: el del prefijo CPV más largo que coincida.
function sectorOf(cpv: string[]): string {
  let best = 'otros'; let len = 0;
  for (const s of SECTORS) for (const p of s.cpv) if (p.length > len && cpv.some((c) => c.startsWith(p))) { best = s.id; len = p.length; }
  return best;
}
const natureOf = (n: string, cpv: string[]): TedNotice['nature'] =>
  n === 'services' || n === 'supplies' || n === 'works' ? n : cpv[0]?.startsWith('45') ? 'works' : Number(cpv[0]?.slice(0, 2)) < 45 ? 'supplies' : 'services';

/** Fila compacta del robot → licitación de la web. Los anuncios de TED conservan su n.º (así enlazan con pliegos y resúmenes incluidos). */
function toNotice(r: any[]): TedNotice {
  const raw: string = r[T.id];
  const src = raw.startsWith('t:') ? 'ted' : raw.startsWith('a:') ? 'agregadas' : 'placsp';
  const cpv: string[] = Array.isArray(r[T.cpv]) ? r[T.cpv] : [];
  return {
    id: src === 'ted' ? raw.slice(2) : raw,
    kind: r[T.label] || cpvDivision(cpv[0]) || 'Contrato público',
    title: r[T.title] || 'Sin título',
    buyer: r[T.buyer] || 'No consta',
    city: r[T.city] || 'No consta',
    cpv,
    deadline: r[T.deadline] || '',
    value: r[T.value] || r[T.budget] || null,
    nuts: r[T.nuts] || 'ES',
    pub: r[T.pub] || '',
    desc: r[T.desc] || '',
    nature: natureOf(r[T.nature], cpv),
    sector: sectorOf(cpv),
    live: {
      src, url: r[T.url] || '', docs: r[T.docs] || [], crit: r[T.crit] || [], ref: r[T.ref] || '', proc: r[T.proc] || '',
      dur: r[T.dur] || 0, reqs: r[T.reqs] || [], budget: r[T.budget] || 0, lots: r[T.lots] || 0,
    },
  };
}

let started = false;
/** Carga data/meta.json y data/tenders.json; se llama una vez al arrancar y se refresca cada 10 minutos. */
export function startLive() {
  if (started) return; started = true;
  const load = async () => {
    try {
      const get = async (f: string) => { const r = await fetch(`data/${f}`, { cache: 'no-cache' }); if (!r.ok) throw new Error(`${f}: HTTP ${r.status}`); return r.json(); };
      const [meta, tenders] = await Promise.all([get('meta.json'), get('tenders.json')]);
      const rows: any[][] = Array.isArray(tenders?.rows) ? tenders.rows : [];
      if (!rows.length) throw new Error('sin licitaciones');
      set({ status: 'live', tenders: rows.map(toNotice), meta });
    } catch {
      if (state.status !== 'live') set({ status: 'bundled', tenders: TED_NOTICES, meta: BUNDLED });
    }
  };
  load();
  if (typeof window !== 'undefined') setInterval(load, 10 * 60 * 1000);
}
