// Licitaciones de obras: lo que el pliego exige a una constructora (clasificación, ROLECE, RERA, visita, nota mínima…),
// el plan de obra con su diagrama de Gantt y camino crítico, y el presupuesto ofertado (BC3 de Presto o Excel) con la
// rebaja elegida en el paso del precio. Los datos de la empresa salen siempre de su perfil; nada se inventa.
import type { Project, CompanyInfo } from './types';
import { ai } from './ai/provider';
import { projectPages } from './ai/engine';
import { readZip, writeZip, type ZipEntry } from './pipeline/zip';
import { nowIso } from './util';
import { companySectors } from './sectorProfiles';

// ── ¿Es una obra? ───────────────────────────────────────────────────────────────────────────────────────────────────
/** Herramientas de obra (plan de obra, planos de la oferta): solo para constructoras y en licitaciones de obra.
 *  Si la empresa aún no ha elegido sus sectores, se muestran en las licitaciones de obra para no esconderle nada. */
export function showsObraTools(p: Project, c: Pick<CompanyInfo, 'cpvs' | 'industry' | 'clasificaciones'>): boolean {
  if (!isWorks(p)) return false;
  const sectors = companySectors(c);
  return !sectors.length || sectors.includes('construccion');
}

export function isWorks(p: Project): boolean {
  if (p.tender?.nature === 'works') return true;
  if ((p.tender?.cpv ?? []).some((c) => c.startsWith('45'))) return true;
  if ((p.analysis?.cpv || '').replace(/\D/g, '').startsWith('45')) return true;
  return /\bobras?\b|\breforma\b|\burbanizaci[oó]n\b|\bpavimentaci[oó]n\b|\bconstrucci[oó]n\b|\brehabilitaci[oó]n\b/i.test(p.name);
}

// ── Lo que el pliego exige a la constructora ────────────────────────────────────────────────────────────────────────
export interface Clasif { grupo: string; subgrupo: string; categoria: string }
export interface ObraRules {
  clasificacion: Clasif[];          // grupos, subgrupos y categorías que pide o admite el pliego
  clasifObligatoria: boolean;       // true: hay que estar clasificado; false: solo es un medio alternativo de solvencia
  rolece: boolean; rera: boolean; visita: boolean;
  notaMinima: number | null;        // puntuación mínima en juicio de valor para no quedar excluido
  ceroExcluye: string[];            // subcriterios en los que un 0 excluye
  gantt: boolean; bc3: boolean;     // el pliego pide diagrama de Gantt / presupuesto en BC3, Presto o Excel
  plazoDias: number | null;         // plazo de ejecución, en días naturales
  capitulos: { nombre: string; importe: number | null }[];
  avisos: string[];                 // otras causas de exclusión propias de la obra
  noSubcontratar: string[];         // unidades o trabajos que el pliego reserva al contratista (no se pueden subcontratar)
  mode: 'ai' | 'rules';
}
export interface Activity { id: string; name: string; dur: number; deps: string[]; why: string; es?: number; ef?: number; ls?: number; lf?: number; slack?: number; critical?: boolean }
export interface Gantt { activities: Activity[]; total: number; plazo: number | null; justification: string; at: string }
export interface Budget { key: string; name: string; ext: 'bc3' | 'xlsx'; changed: number; baja: number; at: string; source: string }
export interface Obra { rules: ObraRules | null; gantt: Gantt | null; budget: Budget | null }
export const emptyObra = (): Obra => ({ rules: null, gantt: null, budget: null });

const KEYS = /clasificaci[oó]n|grupo|subgrupo|categor[ií]a|ROLECE|RERA|amianto|visita|Gantt|plan de obra|programa de trabajo|camino cr[ií]tico|BC3|FIEBDC|Presto|plazo de ejecuci[oó]n|cap[ií]tulo|resumen del presupuesto|puntuaci[oó]n m[ií]nima|umbral|excluid|mediciones/gi;

async function obraPages(p: Project): Promise<string> {
  const pages = await projectPages(p);
  const scored: { doc: string; page: number; text: string; score: number }[] = [];
  for (const d of p.docs) (pages.get(d.id) ?? []).forEach((t, i) => {
    if (!t || t.length < 60) return;
    const score = (t.match(KEYS) || []).length;
    if (score > 1) scored.push({ doc: d.name, page: i + 1, text: t, score });
  });
  scored.sort((a, b) => b.score - a.score);
  let out = '';
  for (const s of scored.slice(0, 14)) { const b = `\n\n=== ${s.doc} · página ${s.page} ===\n${s.text.slice(0, 5000)}`; if (out.length + b.length > 65000) break; out += b; }
  return out;
}

const num = (x: any) => { if (x == null || x === '') return null; const n = Number(String(x).replace(/\./g, '').replace(',', '.')); return Number.isFinite(n) ? n : null; };

export async function readObraRules(p: Project): Promise<ObraRules> {
  const base: ObraRules = { clasificacion: [], clasifObligatoria: false, rolece: false, rera: false, visita: false, notaMinima: null, ceroExcluye: [], gantt: false, bc3: false, plazoDias: null, capitulos: [], avisos: [], noSubcontratar: [], mode: 'rules' };
  let pages = '';
  try { pages = await obraPages(p); } catch { /* sin textos */ }
  if (!pages) return base;
  try {
    const j = await ai.json<any>(`Eres experto en contratación pública de OBRAS en España. Lee estos extractos de los pliegos y del proyecto y saca lo que se exige a la constructora.

Obra: ${p.name}
Plazo que figura en el análisis: ${p.analysis?.duration || 'no consta'}

Extractos:
${pages}

Devuelve SOLO JSON:
{
  "clasificacion": [{"grupo": "C", "subgrupo": "7", "categoria": "3"}],
  "clasificacion_obligatoria": true|false,      // true solo si el pliego EXIGE estar clasificado; false si es un medio alternativo o no se exige
  "rolece": true|false,                          // hay que estar inscrito en el ROLECE o registro autonómico
  "rera": true|false,                            // hay que estar inscrito en el RERA (amianto)
  "visita": true|false,                          // visita obligatoria a la obra o a las instalaciones
  "nota_minima": número o null,                  // puntuación mínima en criterios de juicio de valor para no quedar excluido
  "cero_excluye": ["subcriterios en los que sacar 0 excluye"],
  "gantt": true|false,                           // piden diagrama de Gantt, plan de obra o programa de trabajos
  "bc3": true|false,                             // piden el presupuesto en BC3/FIEBDC, Presto o Excel de mediciones
  "plazo_dias": número o null,                   // plazo de ejecución en días naturales (convierte meses a días ×30)
  "capitulos": [{"nombre": "Demoliciones", "importe": número o null}],   // capítulos del presupuesto del proyecto, en orden
  "avisos": ["otras causas de exclusión propias de la obra, en una frase cada una"],
  "no_subcontratar": ["unidades, partes o tareas críticas que el pliego obliga a ejecutar directamente al contratista (no se pueden subcontratar)"]
}
No inventes nada: si no está en los extractos, pon false, null o una lista vacía.`, { tier: 'default', project: p.isSample ? '' : p.id });
    return {
      clasificacion: (Array.isArray(j.clasificacion) ? j.clasificacion : []).filter((c: any) => c?.grupo).slice(0, 8).map((c: any) => ({ grupo: String(c.grupo).toUpperCase().trim(), subgrupo: String(c.subgrupo ?? '').trim(), categoria: String(c.categoria ?? '').trim() })),
      clasifObligatoria: !!j.clasificacion_obligatoria, rolece: !!j.rolece, rera: !!j.rera, visita: !!j.visita,
      notaMinima: num(j.nota_minima), ceroExcluye: (j.cero_excluye || []).map(String).slice(0, 6),
      gantt: !!j.gantt, bc3: !!j.bc3, plazoDias: num(j.plazo_dias),
      capitulos: (Array.isArray(j.capitulos) ? j.capitulos : []).filter((c: any) => c?.nombre).slice(0, 40).map((c: any) => ({ nombre: String(c.nombre), importe: num(c.importe) })),
      avisos: (j.avisos || []).map(String).slice(0, 8), noSubcontratar: (j.no_subcontratar || []).map(String).slice(0, 8), mode: 'ai',
    };
  } catch { return base; }
}

// ── ¿Cumple la empresa? ─────────────────────────────────────────────────────────────────────────────────────────────
/** Una clasificación de la empresa cubre la exigida si es del mismo grupo y subgrupo y de categoría igual o superior. */
export function covers(have: Clasif[], need: Clasif) {
  return have.some((h) => h.grupo.toUpperCase() === need.grupo.toUpperCase() && (!need.subgrupo || h.subgrupo === need.subgrupo) && (Number(h.categoria) || 0) >= (Number(need.categoria) || 0));
}
export interface ObraCheck { id: string; label: string; state: 'pass' | 'warn' | 'fail'; detail: string }
export function obraChecks(p: Project, c: CompanyInfo): ObraCheck[] {
  const r = p.obra?.rules; if (!r) return [];
  const out: ObraCheck[] = [];
  const have = c.clasificaciones ?? [];
  if (r.clasificacion.length) {
    // Si ya la confirmó en «Responde a PROPO», cuenta como acreditada aunque no esté en Empresa → Construcción.
    const said = p.requirements.some((q) => q.status === 'fulfilled' && q.humanValidated && /clasificaci/i.test(q.title + ' ' + q.text));
    const ok = said ? r.clasificacion : r.clasificacion.filter((n) => covers(have, n));
    const txt = r.clasificacion.map((n) => `${n.grupo}${n.subgrupo ? `-${n.subgrupo}` : ''}${n.categoria ? ` cat. ${n.categoria}` : ''}`).join(', ');
    out.push({ id: 'clasif', label: r.clasifObligatoria ? 'Clasificación exigida' : 'Clasificación (sirve como solvencia)', state: ok.length === r.clasificacion.length ? 'pass' : r.clasifObligatoria ? 'fail' : 'warn',
      detail: ok.length === r.clasificacion.length ? `Tu clasificación cubre ${txt}` : r.clasifObligatoria ? `El pliego exige ${txt}. Añade tu clasificación en Empresa → Construcción o preséntate en UTE con quien la tenga.` : `Sin la clasificación ${txt} tendrás que acreditar la solvencia con tu facturación y tus obras.` });
  }
  if (r.rolece) out.push({ id: 'rolece', label: 'Inscripción en el ROLECE', state: c.rolece ? 'pass' : 'fail', detail: c.rolece ? 'Inscrita' : 'El pliego exige estar inscrito (o haberlo pedido) antes de presentar. Marca la inscripción en Empresa → Construcción.' });
  if (r.rera) out.push({ id: 'rera', label: 'Inscripción en el RERA (amianto)', state: c.rera ? 'pass' : 'fail', detail: c.rera ? 'Inscrita' : 'Hay trabajos con amianto: sin el RERA no se puede ejecutar la obra.' });
  if (r.visita) out.push({ id: 'visita', label: 'Visita obligatoria', state: p.manualChecks.visita ? 'pass' : 'warn', detail: p.manualChecks.visita ? 'Hecha' : 'El pliego exige visitar la obra o las instalaciones y aportar el justificante.' });
  if (r.gantt) out.push({ id: 'gantt', label: 'Plan de obra y diagrama de Gantt', state: p.obra?.gantt ? 'pass' : 'fail', detail: p.obra?.gantt ? `${p.obra.gantt.activities.length} actividades, ${p.obra.gantt.total} días` : 'El pliego lo puntúa: genéralo en «Plan de obra».' });
  if (r.bc3) out.push({ id: 'bc3', label: 'Presupuesto en BC3/Presto o Excel', state: p.obra?.budget ? 'pass' : 'fail', detail: p.obra?.budget ? `${p.obra.budget.name} con rebaja del ${(p.obra.budget.baja * 100).toFixed(1).replace('.', ',')} %` : 'El pliego lo pide en el sobre económico: súbelo en «Plan de obra» y PROPO le aplica tu rebaja.' });
  if (r.notaMinima != null) out.push({ id: 'nota', label: `Nota mínima de ${r.notaMinima} puntos en la memoria`, state: 'warn', detail: 'Por debajo te excluyen: no dejes ningún apartado de la memoria sin desarrollar.' });
  r.ceroExcluye.forEach((x, i) => out.push({ id: `cero${i}`, label: 'Subcriterio que excluye con un 0', state: 'warn', detail: x }));
  if ((r.noSubcontratar ?? []).length) out.push({ id: 'subcontrata', label: 'Trabajos que no se pueden subcontratar', state: 'warn', detail: `${r.noSubcontratar.join('; ')}. Si la memoria dice que los subcontratarás, la oferta puede quedar sin valorar.` });
  return out;
}

// ── Plan de obra: actividades, dependencias y camino crítico ────────────────────────────────────────────────────────
/** Cálculo del camino crítico (dependencias fin-comienzo, duraciones en días). */
export function cpm(acts: Activity[]): { activities: Activity[]; total: number } {
  const byId = new Map(acts.map((a) => [a.id, { ...a, deps: a.deps.filter((d) => d !== a.id) }]));
  for (const a of byId.values()) a.deps = a.deps.filter((d) => byId.has(d));
  const order: Activity[] = []; const seen = new Set<string>(); const temp = new Set<string>();
  const visit = (a: Activity) => { if (seen.has(a.id) || temp.has(a.id)) return; temp.add(a.id); a.deps.forEach((d) => visit(byId.get(d)!)); temp.delete(a.id); seen.add(a.id); order.push(a); };
  byId.forEach(visit);
  for (const a of order) { a.es = Math.max(0, ...a.deps.map((d) => byId.get(d)!.ef ?? 0)); a.ef = a.es + Math.max(1, Math.round(a.dur)); }
  const total = Math.max(0, ...order.map((a) => a.ef!));
  for (const a of [...order].reverse()) {
    const succ = order.filter((s) => s.deps.includes(a.id));
    a.lf = succ.length ? Math.min(...succ.map((s) => s.ls!)) : total; a.ls = a.lf - Math.max(1, Math.round(a.dur));
    a.slack = a.ls - a.es!; a.critical = a.slack === 0;
  }
  return { activities: acts.map((a) => byId.get(a.id)!), total };
}

export async function planObra(p: Project, c: CompanyInfo, team: { name: string; role: string; years: number }[]): Promise<Gantt> {
  const r = p.obra?.rules;
  const caps = r?.capitulos.length ? r.capitulos.map((x) => `- ${x.nombre}${x.importe ? ` (${Math.round(x.importe)} €)` : ''}`).join('\n') : '(no se han encontrado los capítulos: deduce las actividades de la obra a partir del pliego)';
  let pages = '';
  try { pages = (await obraPages(p)).slice(0, 30000); } catch { /* nada */ }
  const prompt = `Eres jefe de obra con mucha experiencia en España. Prepara el PLAN DE OBRA para la oferta de esta licitación.

Obra: ${p.name}
Plazo máximo de ejecución: ${r?.plazoDias ? `${r.plazoDias} días naturales` : p.analysis?.duration || 'no consta'}
Capítulos del presupuesto:
${caps}
Medios de la empresa (úsalos si encajan, no inventes otros como propios):
- Maquinaria: ${(c.maquinaria ?? []).map((m) => `${m.cantidad || 1} × ${m.nombre}${m.propia === false ? ' (alquilada)' : ''}`).join('; ') || 'no consta'}
- Equipo: ${team.map((t) => `${t.name}, ${t.role}, ${t.years} años`).join('; ') || 'no consta'}

Extractos del pliego y del proyecto:
${pages}

Devuelve SOLO JSON:
{
  "activities": [{"id": "A1", "name": "Implantación de obra y medidas de seguridad", "dur": días, "deps": ["ids de las que tienen que terminar antes"], "why": "rendimiento y medios que justifican la duración, una frase con números (p. ej. 2 oficiales + 1 peón, 120 m²/día)"}],
  "justification": "Justificación del plan de obra en 3 o 4 párrafos: secuencia, solapes, camino crítico, rendimientos, coordinación con la actividad existente y condicionantes climáticos. Sin inventar medios que la empresa no tenga."
}
Reglas: entre 8 y 18 actividades representativas, cubriendo todos los capítulos (incluidos gestión de residuos y seguridad y salud), con solapes realistas; duraciones en días naturales.
- PROPO calcula el plazo total con el camino crítico a partir de tus duraciones y dependencias: la actividad que más tarde termine fija el total, y no debe superar el máximo.
- Las tareas que acompañan a toda la obra (seguridad y salud, gestión de residuos, control de calidad, vigilancia ambiental) dependen solo de la implantación y duran como mucho lo que dura la obra; nunca las encadenes detrás de otra fase larga.
- Si el pliego solo permite trabajar en ciertas épocas (p. ej. fuera de la campaña de riego, de octubre a marzo, o en vacaciones escolares), el plan lo refleja: los trabajos afectados se dividen en campañas reales y entre ellas va una actividad «Parada: …» con su duración, sin esos trabajos. Supón que la obra empieza al inicio de la primera ventana. Nunca programes en una época prohibida un trabajo que el pliego restringe.
- En la justificación no escribas la duración total ni el camino crítico con números: PROPO los añade calculados.`;
  const parse = (j: any): Activity[] => (Array.isArray(j?.activities) ? j.activities : []).filter((a: any) => a?.id && a?.name).slice(0, 24)
    .map((a: any) => ({ id: String(a.id), name: String(a.name), dur: Math.max(1, Math.round(Number(a.dur) || 1)), deps: (a.deps || []).map(String), why: String(a.why || '') }));
  const opts = { tier: 'default' as const, project: p.isSample ? '' : p.id };
  let j = await ai.json<any>(prompt, opts);
  let acts = parse(j);
  if (!acts.length) throw new Error('empty_plan');
  let res = cpm(acts);
  const max = r?.plazoDias ?? null;
  // Pasarse del plazo es causa de exclusión: se le devuelve a la IA el cálculo real para que lo corrija (hasta dos veces).
  for (let i = 0; i < 2 && max && res.total > max; i++) {
    const calc = res.activities.map((a) => `${a.id} ${a.name}: ${a.dur} días, del día ${a.es} al ${a.ef}${a.critical ? ' (crítica)' : ''}`).join('\n');
    const fixed = await ai.json<any>(`${prompt}\n\nTu propuesta anterior daba ${res.total} días con el camino crítico, más que el máximo de ${max}. Así quedaba:\n${calc}\n\nCorrígela: ajusta dependencias, solapes y duraciones (sin rendimientos irreales) para que el total quede por debajo de ${max} días, con una holgura de al menos el 5 %. Devuelve el JSON completo. La justificación se presenta a la Administración: no menciones esta corrección ni ninguna versión anterior.`, opts).catch(() => null);
    const next = parse(fixed);
    if (!next.length) break;
    const nres = cpm(next);
    if (nres.total < res.total) { j = fixed; acts = next; res = nres; }
  }
  const crit = res.activities.filter((a) => a.critical).map((a) => a.name.toLowerCase()).join(' → ');
  const fit = max ? (res.total <= max ? `, dentro del plazo máximo de ${max} días (holgura de ${max - res.total} días)` : `, por encima del plazo máximo de ${max} días: revisa las duraciones antes de presentarlo`) : '';
  const justification = `${String(j.justification || '').trim()}\n\nDuración total calculada: ${res.total} días naturales${fit}. Camino crítico: ${crit}.`;
  return { activities: res.activities, total: res.total, plazo: max, justification, at: nowIso() };
}

// ── Presupuesto ofertado: BC3 (FIEBDC-3) y Excel ───────────────────────────────────────────────────────────────────
const latin = (b: Uint8Array) => { let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode(...b.subarray(i, i + 8192)); return s; };
const bytes = (s: string) => { const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255; return u; };

/** BC3: multiplica por (1 − rebaja) el precio de cada concepto. Presto recalcula los totales al abrirlo. */
export function bc3WithBaja(buf: ArrayBuffer, baja: number): { data: Uint8Array; changed: number } {
  const k = 1 - baja; let changed = 0;
  // Se trabaja byte a byte (latin-1) para no tocar la codificación original del archivo.
  const out = latin(new Uint8Array(buf)).replace(/~C\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/g, (m, code, unit, summary, price) => {
    if (!price.trim()) return m;
    const np = price.split('\\').map((x: string) => { const n = Number(x.replace(',', '.')); return Number.isFinite(n) && x.trim() ? (Math.round(n * k * 100) / 100).toFixed(2) : x; }).join('\\');
    if (np !== price) changed++;
    return `~C|${code}|${unit}|${summary}|${np}|`;
  });
  return { data: bytes(out), changed };
}

/** Excel de mediciones: aplica la rebaja a la columna de precios (o la escribe en la columna del licitador si viene vacía). */
export async function xlsxWithBaja(buf: ArrayBuffer, baja: number): Promise<{ data: Uint8Array; changed: number }> {
  const k = 1 - baja;
  const entries = await readZip(buf);
  const txt = (n: string) => { const e = entries.find((x) => x.name === n); return e ? new TextDecoder().decode(e.data) : ''; };
  const shared = [...txt('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => (m[1].match(/<t[^>]*>([^<]*)<\/t>/g) || []).map((t) => t.replace(/<[^>]+>/g, '')).join(''));
  const col = (ref: string) => ref.replace(/\d+/g, '');
  const changedFiles = new Map<string, string>(); let changed = 0;
  for (const e of entries.filter((x) => /^xl\/worksheets\/sheet\d+\.xml$/.test(x.name))) {
    let x = txt(e.name);
    const cells = [...x.matchAll(/<c r="([A-Z]+)(\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].map((m) => ({ col: m[1], row: Number(m[2]), attrs: m[3], body: m[4] || '', raw: m[0] }));
    const val = (c: typeof cells[number]) => /t="s"/.test(c.attrs) ? shared[Number(c.body.match(/<v>(\d+)<\/v>/)?.[1])] ?? '' : (c.body.match(/<v>([^<]*)<\/v>/)?.[1] ?? c.body.match(/<t[^>]*>([^<]*)<\/t>/)?.[1] ?? '');
    const header = cells.find((c) => /precio/i.test(val(c)));
    if (!header) continue;
    const heads = cells.filter((c) => c.row === header.row);
    const base = heads.find((c) => /precio/i.test(val(c)) && !/ofert|licitador|propuest|baja/i.test(val(c)));
    const offer = heads.find((c) => /precio/i.test(val(c)) && /ofert|licitador|propuest/i.test(val(c)));
    if (!base) continue;
    const target = offer ?? base;
    for (const c of cells.filter((c) => c.row > header.row && c.col === base.col)) {
      if (/<f[ >]/.test(c.body)) continue;
      const n = Number(c.body.match(/<v>([^<]*)<\/v>/)?.[1]);
      if (!Number.isFinite(n) || /t="s"/.test(c.attrs)) continue;
      const v = Math.round(n * k * 100) / 100;
      const ref = `${target.col}${c.row}`;
      const re = new RegExp(`<c r="${ref}"([^>]*?)(?:/>|>([\\s\\S]*?)</c>)`);
      const cur = x.match(re);
      if (cur && /<f[ >]/.test(cur[2] || '')) continue;
      const style = (cur?.[1] || c.attrs).match(/\ss="\d+"/)?.[0] ?? '';
      const cell = `<c r="${ref}"${style}><v>${v}</v></c>`;
      if (cur) x = x.replace(re, cell);
      else if (target === base) continue;
      else {
        const rowRe = new RegExp(`(<row [^>]*r="${c.row}"[^>]*>)([\\s\\S]*?)</row>`); const r = x.match(rowRe); if (!r) continue;
        const after = [...r[2].matchAll(/<c r="([A-Z]+)\d+"[\s\S]*?(?:\/>|<\/c>)/g)].find((m) => m[1].length > target.col.length || (m[1].length === target.col.length && m[1] > target.col));
        x = x.replace(rowRe, `${r[1]}${after ? r[2].slice(0, after.index) + cell + r[2].slice(after.index!) : r[2] + cell}</row>`);
      }
      changed++;
    }
    if (changed) changedFiles.set(e.name, x);
  }
  if (!changed) return { data: new Uint8Array(buf), changed: 0 };
  const wb = txt('xl/workbook.xml');
  const wbx = wb.includes('<calcPr') ? wb.replace(/<calcPr([^>]*?)\/>/, (m, a) => (/fullCalcOnLoad/.test(a) ? m : `<calcPr${a} fullCalcOnLoad="1"/>`)) : wb.replace('</workbook>', '<calcPr fullCalcOnLoad="1"/></workbook>');
  const next: ZipEntry[] = entries.filter((e) => e.name !== 'xl/calcChain.xml').map((e) => changedFiles.has(e.name) ? { name: e.name, data: new TextEncoder().encode(changedFiles.get(e.name)!) } : e.name === 'xl/workbook.xml' ? { name: e.name, data: new TextEncoder().encode(wbx) } : e);
  const fix = (n: string, re: RegExp) => { const e = next.find((x) => x.name === n); if (e) e.data = new TextEncoder().encode(new TextDecoder().decode(e.data).replace(re, '')); };
  fix('[Content_Types].xml', /<Override[^>]*calcChain[^>]*\/>/); fix('xl/_rels/workbook.xml.rels', /<Relationship[^>]*calcChain[^>]*\/>/);
  return { data: writeZip(next), changed };
}
