// Tender discovery: sectors, regions and an explainable compatibility score.
// The score is deterministic and auditable (no AI): sector (CPV), region, economic size vs
// company turnover, and time left to prepare. Production runs the same function server-side
// over the daily TED + PLACSP feed and stores the result in `opportunity_matches`.
import type { CompanyInfo } from '../types';
import type { TedNotice } from './tedSnapshot';
import { daysUntil, tokens } from '../util';

export const SECTORS: { id: string; label: string; cpv: string[] }[] = [
  { id: 'catering', label: 'Catering y restauración', cpv: ['553', '555', '554', '551', '1589'] },
  { id: 'limpieza', label: 'Limpieza', cpv: ['909', '9092'] },
  { id: 'mantenimiento', label: 'Mantenimiento de edificios', cpv: ['507', '5075', '5041', '508'] },
  { id: 'construccion', label: 'Construcción y obras', cpv: ['45'] },
  { id: 'it', label: 'Tecnología e IT', cpv: ['72', '48', '302', '642'] },
  { id: 'ingenieria', label: 'Ingeniería', cpv: ['713', '712', '7135'] },
  { id: 'consultoria', label: 'Consultoría', cpv: ['794', '7941', '7942', '751'] },
  { id: 'seguridad', label: 'Seguridad y vigilancia', cpv: ['7971', '7972', '5061'] },
  { id: 'transporte', label: 'Transporte', cpv: ['601', '6012', '6017', '6018'] },
  { id: 'eventos', label: 'Eventos y comunicación', cpv: ['7995', '6351'] },
  { id: 'jardineria', label: 'Jardinería y zonas verdes', cpv: ['773', '7731'] },
  { id: 'formacion', label: 'Formación', cpv: ['805', '8053', '80'] },
  { id: 'sanidad', label: 'Sanidad y material médico', cpv: ['33', '851'] },
  { id: 'social', label: 'Servicios sociales', cpv: ['853', '983'] },
  { id: 'alimentacion', label: 'Suministro de alimentos', cpv: ['15', '03'] },
  { id: 'oficina', label: 'Mobiliario y material de oficina', cpv: ['39', '301', '22'] },
  { id: 'vehiculos', label: 'Vehículos y maquinaria', cpv: ['34', '42', '43', '16'] },
  { id: 'energia', label: 'Energía y suministros', cpv: ['09', '65', '31'] },
  { id: 'residuos', label: 'Residuos y medio ambiente', cpv: ['905', '907', '9051'] },
  { id: 'comunicacion', label: 'Publicidad y marketing', cpv: ['793', '798', '92'] },
  { id: 'juridico', label: 'Servicios jurídicos y financieros', cpv: ['791', '792', '66'] },
  { id: 'laboratorio', label: 'Laboratorio e investigación', cpv: ['38', '73', '24'] },
  { id: 'textil', label: 'Vestuario y textil', cpv: ['18', '19'] },
  { id: 'otros', label: 'Otros sectores', cpv: [] },
];

export const INDUSTRY_TO_SECTORS: Record<string, string[]> = {
  'Catering y restauración': ['catering', 'eventos'],
  'Construcción': ['construccion'],
  'Limpieza y facility services': ['limpieza', 'mantenimiento'],
  'Mantenimiento': ['mantenimiento'],
  'Tecnología e IT': ['it'],
  'Ingeniería': ['ingenieria'],
  'Consultoría': ['consultoria'],
  'Seguridad': ['seguridad'],
  'Transporte y logística': ['transporte'],
  'Servicios profesionales': ['consultoria', 'formacion'],
  'Jardinería y medio ambiente': ['jardineria'],
  'Otro': [],
};
export const INDUSTRIES = Object.keys(INDUSTRY_TO_SECTORS);

export const REGIONS: { id: string; label: string }[] = [
  { id: 'ES51', label: 'Cataluña' }, { id: 'ES30', label: 'Comunidad de Madrid' }, { id: 'ES52', label: 'Comunidad Valenciana' },
  { id: 'ES61', label: 'Andalucía' }, { id: 'ES21', label: 'País Vasco' }, { id: 'ES11', label: 'Galicia' },
  { id: 'ES41', label: 'Castilla y León' }, { id: 'ES42', label: 'Castilla-La Mancha' }, { id: 'ES24', label: 'Aragón' },
  { id: 'ES53', label: 'Illes Balears' }, { id: 'ES62', label: 'Región de Murcia' }, { id: 'ES70', label: 'Canarias' },
  { id: 'ES12', label: 'Asturias' }, { id: 'ES13', label: 'Cantabria' }, { id: 'ES22', label: 'Navarra' },
  { id: 'ES23', label: 'La Rioja' }, { id: 'ES43', label: 'Extremadura' },
];
export const regionLabel = (nuts: string) => REGIONS.find((r) => nuts.startsWith(r.id))?.label ?? (nuts.startsWith('ES') ? 'España' : 'UE');
export const sectorLabel = (id: string) => SECTORS.find((s) => s.id === id)?.label ?? id;

export function cpvsForSectors(ids: string[]) { return [...new Set(ids.flatMap((id) => SECTORS.find((s) => s.id === id)?.cpv ?? []))]; }

function parseRevenue(s: string): number | null {
  const m = s.replace(/\s/g, '').match(/([\d.,]+)\s*(M|millones|k|mil)?/i);
  if (!m) return null;
  let n = parseFloat(m[1].replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
  if (isNaN(n)) return null;
  if (/^m/i.test(m[2] || '')) n *= 1_000_000; else if (/^(k|mil)/i.test(m[2] || '')) n *= 1_000;
  return n;
}

export interface MatchReason { ok: boolean | null; text: string }
export interface Match { score: number; reasons: MatchReason[] }

export function matchTender(t: TedNotice, c: CompanyInfo): Match {
  const reasons: MatchReason[] = [];
  let score = 0;
  // 1. Sector (CPV) — 50
  let best = 0;
  for (const code of t.cpv) for (const p of c.cpvs) if (code.startsWith(p)) best = Math.max(best, p.length);
  let sector = 0;
  if (best >= 4) sector = 50; else if (best === 3) sector = 44; else if (best === 2) sector = 30;
  if (!sector) {
    const ct = new Set(tokens([c.description, ...c.capabilities, c.industry].join(' ')));
    const hits = tokens(t.title + ' ' + t.desc).filter((w) => ct.has(w)).length;
    sector = Math.min(30, hits * 8);
  }
  score += sector;
  reasons.push(sector >= 40 ? { ok: true, text: 'Encaja con los sectores (CPV) de tu empresa' } : sector > 0 ? { ok: null, text: 'Encaje parcial con tu actividad' } : { ok: false, text: 'Fuera de los sectores de tu empresa' });
  // 2. Region — 15
  const reg = c.regions.some((r) => t.nuts.startsWith(r));
  score += reg ? 15 : t.nuts.startsWith('ES') ? 6 : 3;
  reasons.push(reg ? { ok: true, text: `En tu zona de trabajo (${regionLabel(t.nuts)})` } : !c.regions.length ? { ok: null, text: `${regionLabel(t.nuts)}: indica en tu perfil dónde trabajas para valorar la ubicación` } : { ok: null, text: `Fuera de tus regiones habituales: se ejecuta en ${regionLabel(t.nuts)}` });
  // 3. Size vs turnover — 20 (rule of thumb: solvency asks ~1–1.5× the annual value)
  const rev = parseRevenue(c.revenue || '');
  if (t.value && rev) {
    const r = rev / t.value;
    const pts = r >= 1 ? 20 : r >= 0.5 ? 14 : r >= 0.25 ? 7 : 2;
    score += pts;
    reasons.push(pts >= 14 ? { ok: true, text: 'Importe acorde a tu facturación' } : { ok: false, text: 'Importe alto para tu facturación: revisa la solvencia económica' });
  } else {
    score += 10;
    reasons.push({ ok: null, text: t.value ? 'Añade tu facturación para valorar la solvencia' : 'Importe no publicado en el anuncio' });
  }
  // 4. Time to prepare — 15
  const d = daysUntil(t.deadline) ?? -1;
  const tp = d >= 15 ? 15 : d >= 8 ? 10 : d >= 3 ? 5 : 0;
  score += tp;
  reasons.push(d < 0 ? { ok: false, text: 'Plazo cerrado' } : tp >= 10 ? { ok: true, text: `${d} días para preparar la oferta` } : { ok: false, text: `Solo ${d} días para preparar la oferta` });
  return { score: Math.max(0, Math.min(99, Math.round(score))), reasons };
}
