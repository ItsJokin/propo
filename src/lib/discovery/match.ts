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
/** Provincias de cada comunidad, con sus códigos territoriales (NUTS 3). En los archipiélagos una provincia agrupa varias islas. */
export const PROVINCES: Record<string, { id: string; label: string; codes: string[] }[]> = {
  ES51: [{ id: 'B', label: 'Barcelona', codes: ['ES511'] }, { id: 'GI', label: 'Girona', codes: ['ES512'] }, { id: 'L', label: 'Lleida', codes: ['ES513'] }, { id: 'T', label: 'Tarragona', codes: ['ES514'] }],
  ES52: [{ id: 'A', label: 'Alicante', codes: ['ES521'] }, { id: 'CS', label: 'Castellón', codes: ['ES522'] }, { id: 'V', label: 'Valencia', codes: ['ES523'] }],
  ES61: [{ id: 'AL', label: 'Almería', codes: ['ES611'] }, { id: 'CA', label: 'Cádiz', codes: ['ES612'] }, { id: 'CO', label: 'Córdoba', codes: ['ES613'] }, { id: 'GR', label: 'Granada', codes: ['ES614'] }, { id: 'H', label: 'Huelva', codes: ['ES615'] }, { id: 'J', label: 'Jaén', codes: ['ES616'] }, { id: 'MA', label: 'Málaga', codes: ['ES617'] }, { id: 'SE', label: 'Sevilla', codes: ['ES618'] }],
  ES21: [{ id: 'VI', label: 'Álava', codes: ['ES211'] }, { id: 'SS', label: 'Gipuzkoa', codes: ['ES212'] }, { id: 'BI', label: 'Bizkaia', codes: ['ES213'] }],
  ES11: [{ id: 'C', label: 'A Coruña', codes: ['ES111'] }, { id: 'LU', label: 'Lugo', codes: ['ES112'] }, { id: 'OU', label: 'Ourense', codes: ['ES113'] }, { id: 'PO', label: 'Pontevedra', codes: ['ES114'] }],
  ES41: [{ id: 'AV', label: 'Ávila', codes: ['ES411'] }, { id: 'BU', label: 'Burgos', codes: ['ES412'] }, { id: 'LE', label: 'León', codes: ['ES413'] }, { id: 'P', label: 'Palencia', codes: ['ES414'] }, { id: 'SA', label: 'Salamanca', codes: ['ES415'] }, { id: 'SG', label: 'Segovia', codes: ['ES416'] }, { id: 'SO', label: 'Soria', codes: ['ES417'] }, { id: 'VA', label: 'Valladolid', codes: ['ES418'] }, { id: 'ZA', label: 'Zamora', codes: ['ES419'] }],
  ES42: [{ id: 'AB', label: 'Albacete', codes: ['ES421'] }, { id: 'CR', label: 'Ciudad Real', codes: ['ES422'] }, { id: 'CU', label: 'Cuenca', codes: ['ES423'] }, { id: 'GU', label: 'Guadalajara', codes: ['ES424'] }, { id: 'TO', label: 'Toledo', codes: ['ES425'] }],
  ES24: [{ id: 'HU', label: 'Huesca', codes: ['ES241'] }, { id: 'TE', label: 'Teruel', codes: ['ES242'] }, { id: 'Z', label: 'Zaragoza', codes: ['ES243'] }],
  ES43: [{ id: 'BA', label: 'Badajoz', codes: ['ES431'] }, { id: 'CC', label: 'Cáceres', codes: ['ES432'] }],
  ES70: [{ id: 'GC', label: 'Las Palmas', codes: ['ES704', 'ES705', 'ES708'] }, { id: 'TF', label: 'Santa Cruz de Tenerife', codes: ['ES703', 'ES706', 'ES707', 'ES709'] }],
  ES53: [{ id: 'MLL', label: 'Mallorca', codes: ['ES532'] }, { id: 'MEN', label: 'Menorca', codes: ['ES533'] }, { id: 'EIV', label: 'Ibiza y Formentera', codes: ['ES531'] }],
};
/** ¿La licitación se ejecuta en esa provincia? */
export const inProvince = (nuts: string, region: string, prov: string) => !!PROVINCES[region]?.find((p) => p.id === prov)?.codes.some((c) => nuts.startsWith(c));
/** El anuncio indica la comunidad pero no la provincia. */
export const noProvince = (nuts: string, region: string) => nuts.startsWith(region) && nuts.length < 5;
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
  const away = !reg && c.regions.length > 0;                  // la empresa ha dicho dónde trabaja y esto queda fuera
  score += reg ? 15 : away ? 0 : t.nuts.startsWith('ES') ? 6 : 3;
  reasons.push(reg ? { ok: true, text: `En tu zona de trabajo (${regionLabel(t.nuts)})` } : !c.regions.length ? { ok: null, text: `${regionLabel(t.nuts)}: indica en tu perfil dónde trabajas para valorar la ubicación` } : { ok: null, text: `Fuera de tu zona de trabajo: se ejecuta en ${regionLabel(t.nuts)}. Valora si puedes prestar el servicio allí` });
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
  return { score: Math.max(0, Math.min(away ? 59 : 99, Math.round(score))), reasons };   // lejos de tu zona nunca es «alta compatibilidad»
}
