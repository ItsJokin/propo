// Sistema de diseño de los documentos de PROPO (PDF y Word): tokens de color a partir de la marca real del licitador,
// escala tipográfica, perfil del sector y selector de portada. Separa la presentación del contenido: la misma memoria
// se maqueta con cualquier marca sin regenerar el texto.
import type { CompanyInfo, Project } from '../types';

export type RGB = [number, number, number];
export type CoverStyle = 'editorial' | 'inmersiva' | 'geometrica' | 'tecnica' | 'minimalista' | 'institucional';
export const COVER_STYLES: Record<CoverStyle, string> = {
  editorial: 'Editorial premium', inmersiva: 'Ilustración a toda página', geometrica: 'Geométrica contemporánea',
  tecnica: 'Técnica e industrial', minimalista: 'Corporativa minimalista', institucional: 'Arquitectónica e institucional',
};
export type Motif = 'skyline' | 'girders' | 'gears' | 'network' | 'waves' | 'pylons' | 'cross' | 'roads' | 'windows' | 'plates' | 'lines' | 'leaves' | 'shield' | 'books';
export type Sector =
  | 'obra' | 'arquitectura' | 'industria' | 'energia' | 'tecnologia' | 'telecom' | 'medioambiente' | 'sanidad' | 'social'
  | 'consultoria' | 'formacion' | 'limpieza' | 'mantenimiento' | 'seguridad' | 'transporte' | 'suministros' | 'restauracion'
  | 'comunicacion' | 'investigacion' | 'servicios';

// ── Color ──────────────────────────────────────────────────────────────────────────────────────────────────────────
export function hex(h: string | undefined, fallback: RGB): RGB {
  const m = /^#?([0-9a-f]{6})$/i.exec(h || '');
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
export const toHex = (c: RGB) => c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export const luminance = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
export const contrast = (a: RGB, b: RGB) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
export const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const tint = (c: RGB, t: number) => mix(c, [1, 1, 1], t);
export const shade = (c: RGB, t: number) => mix(c, [0, 0, 0], t);
/** Oscurece (o aclara) un color hasta que tenga el contraste pedido sobre `bg`. */
function readable(c: RGB, bg: RGB, min: number): RGB {
  let x = c;
  for (let i = 0; i < 20 && contrast(x, bg) < min; i++) x = luminance(bg) > 0.5 ? shade(x, 0.12) : tint(x, 0.12);
  return x;
}
function hsl(c: RGB): [number, number, number] {
  const [r, g, b] = c; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn; const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function fromHsl(h: number, s: number, l: number): RGB {
  const k = (n: number) => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

export interface Palette {
  primary: RGB;    // color de marca tal cual (superficies grandes de portada, barras)
  deep: RGB;       // versión legible sobre blanco (títulos, cifras): contraste ≥ 4,5
  heading: RGB;    // color de los títulos: el de marca legible o, con marcas muy claras, tinta
  accentInk: RGB;  // acento legible sobre blanco (antetítulos, números del índice)
  onPrimary: RGB;  // texto sobre el color de marca (blanco o tinta, según contraste)
  accent: RGB;     // secundario de la marca o derivado de ella (detalles, filetes)
  soft: RGB; softer: RGB;   // fondos suaves de cuadros y cabeceras de tabla
  numeral: RGB;    // números grandes de apertura de apartado (visibles pero en segundo plano)
  ink: RGB; muted: RGB; line: RGB; paper: RGB;
}
const PROPO_NAVY: RGB = [0.043, 0.09, 0.188];
const NEUTRAL: RGB = [0.2, 0.25, 0.32];

export function paletteFor(primaryHex?: string, accentHex?: string, neutral = false): Palette {
  const primary = neutral ? NEUTRAL : hex(primaryHex, PROPO_NAVY);
  const white: RGB = [1, 1, 1]; const ink: RGB = [0.07, 0.09, 0.15];
  const deep = readable(primary, white, 4.6);
  const onPrimary: RGB = contrast(white, primary) >= 3.2 ? white : ink;
  let accent: RGB;
  if (!neutral && accentHex && /^#?[0-9a-f]{6}$/i.test(accentHex)) accent = hex(accentHex, primary);
  else {
    // Acento derivado: mismo tono algo desplazado y más luminoso; con marcas casi grises, un dorado sobrio.
    const [h, s, l] = hsl(primary);
    // Con marcas muy claras, el acento es la propia marca oscurecida (un tono vecino quedaría chillón).
    accent = s < 0.15 || neutral ? [0.79, 0.64, 0.2] : luminance(primary) > 0.42 ? shade(primary, 0.38) : fromHsl((h + 28) % 360, Math.min(0.85, s + 0.1), Math.min(0.62, Math.max(0.45, l + 0.15)));
  }
  const heading: RGB = luminance(primary) > 0.42 ? [0.1, 0.12, 0.17] : deep;
  return { primary, deep, heading, accentInk: readable(accent, white, 3.2), onPrimary, accent, numeral: luminance(primary) > 0.42 ? tint(primary, 0.3) : tint(primary, 0.78), soft: tint(primary, 0.88), softer: tint(primary, 0.95), ink, muted: [0.4, 0.43, 0.49], line: [0.85, 0.87, 0.9], paper: white };
}

// ── Tipografía y retícula (puntos PDF; el Word usa los mismos tamaños) ──────────────────────────────────────────────
export const TYPE = { body: 10, small: 8.5, caption: 7.5, h1: 22, h2: 13.5, h3: 11, kicker: 8, leading: 1.52, cover: 30 };
export const PAGE = { w: 595, h: 842, ml: 62, mr: 56, top: 770, bottom: 70 };

// ── Sector ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const BY_CPV: Record<string, Sector> = {
  '45': 'obra', '71': 'arquitectura', '44': 'obra', '42': 'industria', '43': 'industria', '31': 'energia', '09': 'energia', '65': 'energia',
  '72': 'tecnologia', '48': 'tecnologia', '30': 'tecnologia', '32': 'telecom', '64': 'telecom', '90': 'medioambiente', '77': 'medioambiente',
  '85': 'sanidad', '33': 'sanidad', '98': 'social', '79': 'consultoria', '73': 'investigacion', '80': 'formacion', '92': 'comunicacion',
  '50': 'mantenimiento', '51': 'mantenimiento', '60': 'transporte', '63': 'transporte', '34': 'transporte', '55': 'restauracion', '15': 'restauracion',
  '75': 'servicios', '66': 'consultoria', '70': 'servicios', '22': 'comunicacion', '39': 'suministros', '18': 'suministros', '35': 'seguridad',
};
const BY_WORDS: [RegExp, Sector][] = [
  [/limpieza|higieniza/i, 'limpieza'], [/vigilancia|seguridad privada|control de accesos/i, 'seguridad'], [/mantenimiento|conservaci[oó]n/i, 'mantenimiento'],
  [/obra|construcci|urbaniza|rehabilita|pavimenta|edificaci|canal|carretera/i, 'obra'], [/arquitect|redacci[oó]n de proyecto|direcci[oó]n facultativa/i, 'arquitectura'],
  [/software|inform[aá]tic|digital|plataforma|ciberseg|datos|cloud|aplicaci[oó]n/i, 'tecnologia'], [/telecomunica|fibra|redes? de comunicaci/i, 'telecom'],
  [/energ|el[eé]ctric|fotovolt|alumbrado|eficiencia/i, 'energia'], [/agua|residuo|medio ?ambient|forestal|jardin|depuraci/i, 'medioambiente'],
  [/sanitari|hospital|salud|cl[ií]nic|farmac/i, 'sanidad'], [/social|dependencia|ayuda a domicilio|mayores|menores|igualdad/i, 'social'],
  [/consultor|asistencia t[eé]cnica|asesor|auditor/i, 'consultoria'], [/formaci[oó]n|curso|docen|educa/i, 'formacion'],
  [/transporte|autob|movilidad|log[ií]stic|flota/i, 'transporte'], [/catering|comedor|restauraci|aliment|cocina/i, 'restauracion'],
  [/comunicaci[oó]n|publicidad|marketing|dise[nñ]o gr[aá]fico|eventos/i, 'comunicacion'], [/investigaci|I\+D|innovaci/i, 'investigacion'],
  [/suministro|adquisici[oó]n|mobiliario|equipamiento/i, 'suministros'], [/industrial|maquinaria|instalaci/i, 'industria'],
];
export const SECTOR_PROFILE: Record<Sector, { motif: Motif; cover: CoverStyle; label: string }> = {
  obra: { motif: 'girders', cover: 'tecnica', label: 'Construcción y obra civil' }, arquitectura: { motif: 'skyline', cover: 'institucional', label: 'Arquitectura' },
  industria: { motif: 'gears', cover: 'tecnica', label: 'Ingeniería industrial' }, energia: { motif: 'pylons', cover: 'tecnica', label: 'Energía' },
  tecnologia: { motif: 'network', cover: 'geometrica', label: 'Tecnología' }, telecom: { motif: 'network', cover: 'geometrica', label: 'Telecomunicaciones' },
  medioambiente: { motif: 'waves', cover: 'inmersiva', label: 'Medioambiente' }, sanidad: { motif: 'cross', cover: 'minimalista', label: 'Sanidad' },
  social: { motif: 'leaves', cover: 'minimalista', label: 'Servicios sociales' }, consultoria: { motif: 'lines', cover: 'editorial', label: 'Consultoría' },
  formacion: { motif: 'books', cover: 'editorial', label: 'Formación' }, limpieza: { motif: 'windows', cover: 'minimalista', label: 'Limpieza' },
  mantenimiento: { motif: 'gears', cover: 'tecnica', label: 'Mantenimiento' }, seguridad: { motif: 'shield', cover: 'institucional', label: 'Seguridad' },
  transporte: { motif: 'roads', cover: 'inmersiva', label: 'Transporte y movilidad' }, suministros: { motif: 'windows', cover: 'minimalista', label: 'Suministros' },
  restauracion: { motif: 'plates', cover: 'editorial', label: 'Restauración' }, comunicacion: { motif: 'lines', cover: 'geometrica', label: 'Comunicación' },
  investigacion: { motif: 'network', cover: 'geometrica', label: 'Investigación' }, servicios: { motif: 'windows', cover: 'editorial', label: 'Servicios' },
};

export function sectorOf(p: Pick<Project, 'name' | 'tender' | 'analysis' | 'obra'> | null, c: Pick<CompanyInfo, 'industry'>): Sector {
  if (p?.obra) return 'obra';
  const cpv = [...(p?.tender?.cpv ?? []), p?.analysis?.cpv ?? ''].map((x) => String(x).replace(/\D/g, '')).find((x) => x.length >= 2);
  if (cpv && BY_CPV[cpv.slice(0, 2)]) return BY_CPV[cpv.slice(0, 2)];
  const text = `${p?.name ?? ''} ${p?.tender?.title ?? ''}`;
  for (const [re, s] of BY_WORDS) if (re.test(text)) return s;
  for (const [re, s] of BY_WORDS) if (re.test(c.industry || '')) return s;
  return 'servicios';
}

/** ¿Exige el pliego que la oferta técnica no identifique al licitador? Entonces fuera logo, nombre y colores de marca. */
export function anonymousRequired(p: Project | null): boolean {
  if (!p) return false;
  const re = /\banonim|sin (ninguna )?identificaci[oó]n del licitador|no (deber[aá]n?|podr[aá]n?) (incluir|contener|figurar|aparecer)[^.]{0,80}(nombre|logotipo|logo|identific|denominaci)|plica/i;
  const texts = [...p.requirements.filter((r) => /format|technical|administrative/.test(r.category)).map((r) => `${r.title} ${r.text}`), ...(p.analysis?.exclusionRisks ?? []).map((e) => e.text), p.analysis?.formNote ?? ''];
  return texts.some((t) => re.test(t));
}

export interface DocTheme { palette: Palette; sector: Sector; motif: Motif; cover: CoverStyle; anonymous: boolean; serifTitles: boolean }
/** Tema de un documento: marca del licitador, perfil del sector, portada y restricciones del pliego. */
export function themeFor(c: CompanyInfo, p: Project | null, o: { technical?: boolean } = {}): DocTheme {
  const anonymous = !!o.technical && anonymousRequired(p);   // solo el sobre técnico va sin identificar
  const sector = sectorOf(p, c);
  const prof = SECTOR_PROFILE[sector];
  let cover: CoverStyle = c.coverStyle && COVER_STYLES[c.coverStyle] ? c.coverStyle : prof.cover;
  const palette = paletteFor(c.brandColor, c.brandColor2, anonymous);
  // Marcas muy claras (amarillos, pasteles): las portadas a sangre quedan sin contraste; mejor las de fondo blanco.
  if (!c.coverStyle && luminance(palette.primary) > 0.55 && (cover === 'tecnica' || cover === 'inmersiva')) cover = 'editorial';
  if (anonymous) cover = 'minimalista';
  return { palette, sector, motif: prof.motif, cover, anonymous, serifTitles: cover === 'institucional' };
}
