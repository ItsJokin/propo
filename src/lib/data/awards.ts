// Adjudicaciones publicadas por el robot (data/awards/<cpv2>-<año>.json): quién gana, con cuántas ofertas y a qué precio.
// Se cargan a demanda, por división CPV, y se resumen para una licitación concreta.
// @ts-ignore: módulo JS compartido con el robot
import { A, W, awardUrl, PERSON } from '../../../shared/schema.mjs';
import type { TedNotice } from '../discovery/tedSnapshot';
import { normalize } from '../util';

export interface Award {
  id: string; date: string; title: string; buyer: string; cpv: string; nuts: string; proc: string;
  offers: number;          // ofertas recibidas (0 = no consta)
  budget: number; amount: number;
  baja: number | null;     // rebaja sobre el presupuesto base, 0–1 (null si no se puede calcular)
  winners: { name: string; sme: number }[];
  url: string;
}
export interface CompStats {
  n: number;
  offers: number | null;   // mediana de ofertas recibidas
  baja: number | null;     // mediana de rebaja
  bajaHigh: number | null; // rebaja del cuartil alto: las ofertas más agresivas
  withBaja: number;        // contratos con rebaja calculable
  sme: number | null;      // proporción de contratos ganados por pymes
  top: { name: string; wins: number; amount: number }[];
  recent: Award[];
  from: string; to: string;
}
export interface Competition { buyer: CompStats | null; similar: CompStats | null; scope: string }

let indexP: Promise<Record<string, number>> | null = null;
const parts = new Map<string, Promise<Award[]>>();
const getJson = async (f: string) => { const r = await fetch(`data/${f}`); if (!r.ok) throw new Error(`${f}: HTTP ${r.status}`); return r.json(); };

function index() {
  if (!indexP) indexP = getJson('index.json').then((j) => j?.awards ?? {}).catch(() => ({}));
  return indexP;
}

function partition(key: string): Promise<Award[]> {
  let p = parts.get(key);
  if (!p) {
    p = getJson(`awards/${key}.json`).then((j) => {
      const buyers: string[] = j.buyers ?? []; const winners: any[][] = j.winners ?? [];
      return (j.rows as any[][]).map((r): Award => {
        const budget = Number(r[A.budget]) || 0; const amount = Number(r[A.amount]) || 0;
        const baja = budget > 0 && amount > 0 && amount <= budget ? 1 - amount / budget : null;
        return {
          id: r[A.id], date: r[A.date] || '', title: r[A.title] || '', buyer: buyers[r[A.buyer]] ?? '', cpv: r[A.cpv] || '', nuts: r[A.nuts] || '', proc: r[A.proc] || '',
          offers: Number(r[A.offers]) || 0, budget, amount,
          baja: baja != null && baja < 0.8 ? baja : null,   // rebajas mayores suelen ser cánones o importes unitarios, no ofertas comparables
          winners: ((r[A.winners] as number[]) ?? []).map((i) => ({ name: winners[i]?.[W.name] ?? '', sme: winners[i]?.[W.sme] ?? -1 })).filter((w) => w.name),
          url: awardUrl(r[A.id], r[A.link]),
        };
      });
    }).catch(() => []);
    parts.set(key, p);
  }
  return p;
}

/** Todas las adjudicaciones conocidas de una división CPV (dos dígitos). */
async function division(cpv2: string): Promise<Award[]> {
  const idx = await index();
  const keys = Object.keys(idx).filter((k) => k.startsWith(cpv2 + '-'));
  return (await Promise.all(keys.map(partition))).flat();
}

const median = (xs: number[]) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const quantile = (xs: number[], q: number) => { if (xs.length < 4) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };

function stats(rows: Award[]): CompStats | null {
  if (!rows.length) return null;
  const bajas = rows.map((r) => r.baja).filter((x): x is number => x != null);
  const known = rows.filter((r) => r.winners.some((w) => w.sme >= 0));
  const by = new Map<string, { name: string; wins: number; amount: number }>();
  for (const r of rows) for (const w of r.winners) {
    if (w.name === PERSON) continue;   // los autónomos van agrupados y anónimos: no son un competidor
    const k = normalize(w.name); const e = by.get(k) ?? { name: w.name, wins: 0, amount: 0 };
    e.wins++; e.amount += r.amount / r.winners.length; by.set(k, e);
  }
  const dates = rows.map((r) => r.date).filter(Boolean).sort();
  return {
    n: rows.length,
    offers: median(rows.map((r) => r.offers).filter((x) => x > 0)),
    baja: median(bajas), bajaHigh: quantile(bajas, 0.75), withBaja: bajas.length,
    sme: known.length >= 3 ? known.filter((r) => r.winners.some((w) => w.sme === 1)).length / known.length : null,
    top: [...by.values()].sort((a, b) => b.wins - a.wins || b.amount - a.amount).slice(0, 5),
    recent: [...rows].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
    from: dates[0] ?? '', to: dates[dates.length - 1] ?? '',
  };
}

/** Competencia esperable en una licitación: qué ha adjudicado antes este organismo y contratos parecidos. */
export async function competitionFor(t: Pick<TedNotice, 'cpv' | 'buyer'>): Promise<Competition> {
  const cpv = t.cpv.filter((c) => /^\d{8}$/.test(c));
  if (!cpv.length) return { buyer: null, similar: null, scope: '' };
  const divs = [...new Set(cpv.map((c) => c.slice(0, 2)))].slice(0, 3);
  const all = (await Promise.all(divs.map(division))).flat();
  const b = normalize(t.buyer);
  const buyer = b ? stats(all.filter((r) => normalize(r.buyer) === b)) : null;
  // Parecidos: mismo CPV a 4 dígitos; si hay pocos, se abre a 3 y a 2.
  let similar: Award[] = []; let scope = '';
  for (const len of [4, 3, 2]) {
    const pre = new Set(cpv.map((c) => c.slice(0, len)));
    similar = all.filter((r) => pre.has(r.cpv.slice(0, len)));
    scope = len === 4 ? 'del mismo tipo de contrato' : len === 3 ? 'de contratos del mismo grupo' : 'del mismo sector';
    if (similar.length >= 12) break;
  }
  return { buyer, similar: stats(similar), scope };
}

export type Verdict = 'yes' | 'maybe' | 'no';
/** Recomendación de presentarse: compatibilidad, tiempo disponible y competencia esperable. Reglas, sin IA. */
export function goNoGo(score: number, daysLeft: number | null, c: Competition | null): { verdict: Verdict; title: string; reasons: { ok: boolean | null; text: string }[] } {
  const offers = c?.buyer?.offers ?? c?.similar?.offers ?? null;
  const reasons: { ok: boolean | null; text: string }[] = [];
  reasons.push(score >= 70 ? { ok: true, text: `Encaja muy bien con tu empresa (${score} % de compatibilidad).` } : score >= 45 ? { ok: null, text: `Encaje parcial con tu empresa (${score} %).` } : { ok: false, text: `Poco encaje con tu empresa (${score} %).` });
  if (daysLeft != null) reasons.push(daysLeft >= 10 ? { ok: true, text: `Quedan ${daysLeft} días: hay tiempo para preparar una buena oferta.` } : daysLeft >= 4 ? { ok: null, text: `Quedan ${daysLeft} días: tendrás que priorizarla.` } : { ok: false, text: `Quedan ${daysLeft} días: muy poco margen.` });
  if (offers != null) reasons.push(offers <= 3 ? { ok: true, text: `Poca competencia: suelen presentarse ${fmt(offers)} ofertas.` } : offers <= 7 ? { ok: null, text: `Competencia media: suelen presentarse ${fmt(offers)} ofertas.` } : { ok: false, text: `Mucha competencia: suelen presentarse ${fmt(offers)} ofertas.` });
  else reasons.push({ ok: null, text: 'No hay adjudicaciones parecidas publicadas para estimar la competencia.' });
  const bad = reasons.filter((r) => r.ok === false).length; const good = reasons.filter((r) => r.ok === true).length;
  const verdict: Verdict = score < 45 || (daysLeft != null && daysLeft < 3) || bad >= 2 ? 'no' : good >= 2 && bad === 0 ? 'yes' : 'maybe';
  return { verdict, reasons, title: verdict === 'yes' ? 'Merece la pena presentarse' : verdict === 'maybe' ? 'Valóralo antes de decidir' : 'Probablemente no compensa' };
}
const fmt = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',');
