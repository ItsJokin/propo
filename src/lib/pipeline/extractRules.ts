// Deterministic fallback extractor (no AI). Also used in production as a cross-check:
// requirements found by rules but missed by the model are flagged for review.
import type { ExtractionResult, DocPages } from './extractTypes';
import { normalize } from '../util';

// JS \b is ASCII-only («deberá» would not match), so boundaries use Unicode letter lookarounds.
const MODAL = /(?<![\p{L}\d])(must|shall|is required|are required|mandatory|required to|will be excluded|shall be excluded|at least|minimum of|deber[áa]n?|obligatori[oa]s?|se exigir[áa]n?|es requisito|han de|ha de|como m[íi]nimo|al menos|ser[áa]n? exclu[íi]d[oa]s?|no se admit\w*|garantizar[áa]n?|se presentar[áa]n?|no podr[áa]n?|supondr[áa] la exclusi[óo]n|quedar[áa]n? obligad[oa]s?|tendr[áa]n? que|es obligatori[oa]|haur[àa] de|hauran de|caldr[àa]|s['’]exigir[àa]|[ée]s obligatori)(?![\p{L}\d])/iu;

const CAT_RULES: [RegExp, ExtractionResult['requirements'][number]['category']][] = [
  [/\b(tax|social security|register|registry|deeds?|powers of|espd|deuc|subcontract\w*|subcontrat\w*|registro|escritura|hacienda|tributari\w*|seguridad social|poderes)\b/i, 'administrative'],
  [/\b(envelopes?|sobre [abc]|pages?|font|arial|spacing|signed|signature|electronic procurement platform|p[áa]ginas|firma|firmad[oa]s?|sobres?|plataforma)\b/i, 'format'],
  [/\b(coordinator|manager|staff|personnel|workers|employees|team|training|subrogat\w*|qualified personnel|personal|formaci[óo]n|coordinador|trabajador(es)?|plantilla|subroga\w*)\b/i, 'team'],
  [/\b(similar contracts|comparable|previous (contracts|projects|experience)|references|track record|technical solvency|experiencia|similares|solvencia t[ée]cnica)\b/i, 'experience'],
  [/\b(iso ?\d{4,5}|emas|certif\w*|fssc|ifs|brc\w*|accredit\w*|homolog\w*)\b/i, 'certification'],
  [/\b(maintenance|cleaning|repairs?|ecolabel|products?|mantenimiento|limpieza|productos?|servicio diario)\b/i, 'technical'],
  [/\b(price|prices|turnover|volume of business|insurance|guarantee|economic|financial|budget|€|eur|precio|precios|seguro|p[óo]liza|garant[íi]a\w*|solvencia econ\w*|volumen de negocios?|importe|presupuesto|euros)\b/i, 'financial'],
  [/\b(law|regulation|royal decree|collective agreement|gdpr|data protection|equality|prevention|bound by|ley|reglamento|convenio|real decreto)\b/i, 'legal'],
];

const TITLE_RULES: [RegExp, string][] = [
  [/\b(espd|european single procurement|deuc)\b/i, 'Declaración responsable (DEUC)'],
  [/\b(official register|rolece|registro oficial)\b/i, 'Inscripción en el registro oficial de licitadores'],
  [/(\btax\b.*social security|social security.*\btax\b|tributari.*seguridad social|seguridad social.*tributari)/i, 'Certificados de estar al corriente con Hacienda y la Seguridad Social'],
  [/subcontrat/i, 'Declaración de subcontratación'],
  [/(qualified electronic signature|firma electr[óo]nica)/i, 'Firma electrónica cualificada'],
  [/(volume of business|turnover|volumen (anual )?de negocio)/i, 'Solvencia económica — volumen anual de negocio'],
  [/(liability insurance|seguro de responsabilidad)/i, 'Seguro de responsabilidad civil'],
  [/((similar|comparable) contracts|technical solvency|(contratos|servicios|trabajos) (similares|de igual o similar)|solvencia t[ée]cnica)/i, 'Acreditación de experiencia previa'],
  [/\biso ?9001\b/i, 'Certificaciones de calidad y medio ambiente'],
  [/(coordinator|coordinador|responsable del (servicio|contrato))/i, 'Coordinador del servicio'],
  [/subroga/i, 'Subrogación de personal'],
  [/(?<![\p{L}])(training|formaci[óo]n)(?![\p{L}])/iu, 'Formación anual del personal'],
  [/(incident|incidencia)s?\b.*\b(hours?|horas)\b/i, 'Tiempos de respuesta ante incidencias'],
  [/(ecolabel|environmental label|etiqueta ecol[óo]gica|pl[áa]sticos)/i, 'Productos con etiqueta ecológica, sin plásticos de un solo uso'],
  [/(monthly report|informe mensual)/i, 'Informe mensual del servicio'],
  [/(three envelopes|tres sobres)/i, 'Estructura en tres sobres (A, B y C)'],
  [/(envelope b.*(economic|price)|(economic|price).*envelope b|sobre b.*(econ[óo]mic|precio))/i, 'Ninguna información de precio en el sobre B'],
  [/(criteria subject to judgement.*envelope|juicio de valor.*sobre)/i, 'Juicio de valor en el sobre B y precio en el sobre C'],
  [/(not exceed \d+ pages|no podr[áa] superar (las )?\d+ p[áa]ginas|m[áa]ximo de \d+ p[áa]ginas)/i, 'Límite de páginas de la memoria técnica'],
  [/(maximum (annual )?budget|exceeding the maximum|presupuesto (base|m[áa]ximo)|superen (el|este) importe)/i, 'Precio máximo: las ofertas superiores quedan excluidas'],
  [/(bound by (their|its) offer|obligados? por su oferta|mantener su oferta)/i, 'Plazo de validez de la oferta'],
  [/((received|submitted) through the electronic|plataforma (electr[óo]nica )?de contrataci[óo]n)/i, 'Presentación electrónica antes de la fecha límite'],
  [/(daily cleaning|limpieza diaria)/i, 'Programa de limpieza diaria y semanal'],
  [/(preventive maintenance|mantenimiento preventivo)/i, 'Mantenimiento preventivo de las instalaciones'],
];

function categorize(s: string) {
  for (const [re, c] of CAT_RULES) if (re.test(s)) return c;
  return 'technical' as const;
}

function titleFrom(s: string) {
  for (const [re, t] of TITLE_RULES) if (re.test(s)) return t;
  let t = s.replace(/^se exigir[áa]n?:\s*/i, '').replace(/^\s*(\d+(\.\d+)*[.)]?|[a-z]\)|[-•–])\s*/i, '')
    .replace(/^(the\s+)?(bidders?|tenderers?|contractors?|suppliers?|offers?|proposals?|the\s+company|el\s+licitador|los\s+licitadores|el\s+contratista|el\s+adjudicatario)\s+(must|shall|will|is required to|are required to|deber[áa]n?|ha de|han de)\s+/i, '')
    .replace(/^(it is (mandatory|required) (to|that)\s+)/i, '');
  const words = t.split(/\s+/).slice(0, 9).join(' ').replace(/[,;:.]+$/, '');
  return words.charAt(0).toUpperCase() + words.slice(1) + (t.split(/\s+/).length > 9 ? '…' : '');
}

const MONTHS: Record<string, number> = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11, enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };

function findDates(text: string): { date: Date; index: number }[] {
  const out: { date: Date; index: number }[] = [];
  const re1 = /\b(\d{1,2})\s+(?:de\s+)?([A-Za-zé]+)\s+(?:de\s+)?(20\d{2})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re1.exec(text))) {
    const mo = MONTHS[m[2].toLowerCase()];
    if (mo != null) out.push({ date: new Date(+m[3], mo, +m[1], 12), index: m.index });
  }
  const re2 = /\b(\d{1,2})[/.-](\d{1,2})[/.-](20\d{2})\b/g;
  while ((m = re2.exec(text))) out.push({ date: new Date(+m[3], +m[2] - 1, +m[1], 12), index: m.index });
  const re3 = /\b([A-Z][a-z]+)\s+(\d{1,2}),\s*(20\d{2})\b/g;
  while ((m = re3.exec(text))) {
    const mo = MONTHS[m[1].toLowerCase()];
    if (mo != null) out.push({ date: new Date(+m[3], mo, +m[2], 12), index: m.index });
  }
  return out;
}

export function extractWithRules(docs: DocPages[]): ExtractionResult {
  const reqs: ExtractionResult['requirements'] = [];
  const seen = new Set<string>();
  const criteria: ExtractionResult['criteria'] = [];
  const exclusion: ExtractionResult['exclusionRisks'] = [];
  const deadlines: ExtractionResult['deadlines'] = [];
  let budget: string | undefined; let authority: string | undefined; let pageLimit: string | undefined;
  let purpose: string | undefined; let cpv: string | undefined; let duration: string | undefined;

  for (const d of docs) {
    d.pages.forEach((page, idx) => {
      const pageNo = idx + 1;
      const lines = page.split(/\n/);
      // criteria with points
      for (const line of lines) {
        const m = line.match(/^\s*(?:[\d.]+\s*)?(.{3,90}?)[\s.:—–-]*(?:up to|max(?:imum)?|hasta|fins a)?\s*(\d{1,3}(?:[.,]\d+)?)\s*(points|pts|puntos|punts)\b/i);
        if (m && !/total|out of|evaluated|sobre un total|m[áa]xim[oa] de 100|se valorar[áa]n|sobre \d+$/i.test(m[1]) && !/out of \d+|total/i.test(line)) {
          const name = m[1].replace(/[\s.:—–(-]+$/, '').trim();
          const pts = parseFloat(m[2].replace(',', '.'));
          if (pts > 0 && name.length > 3 && /^[\p{Lu}\dA-Z]/u.test(name) && !/^(cas|es|se|el|la|los|las|dels?|amb|en)\b/i.test(name) && !criteria.some((c) => normalize(c.name) === normalize(name))) {
            const formula = /price|precio|economic|econ[óo]mic|formula|f[óo]rmula|preu/i.test(line);
            criteria.push({ group: formula ? 'Price' : 'Quality', name, points: pts, kind: formula ? 'formula' : 'judgement', description: line.trim(), docName: d.name, page: pageNo });
          }
        }
      }
      const joined = page.replace(/([^.:;\n])\n(?!\s*(\d+(\.\d+)*[.)]?\s|[-•]\s|[A-Z][A-Z ,&]{6,}\n))/g, '$1 ');
      const sentences = joined.split(/(?<=[.;])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
      for (const s of sentences) {
        if (!purpose && /(object of the contract|purpose of (the|this) (contract|tender)|objeto del contrato|scope of (the )?services?)/i.test(s)) purpose = s;
        if (!authority) { const a = s.match(/(contracting authority|[óo]rgano de contrataci[óo]n|entidad adjudicadora|issued by)[:\s]+([^.;\n]{3,90})/i); if (a) authority = a[2].trim(); }
        if (!budget) { const b = s.match(/(estimated value|budget|presupuesto|valor estimado|maximum budget)[^€\d]{0,40}((?:€|EUR)\s?[\d.,]+(?:\s?(?:million|M))?|[\d.,]+\s?(?:€|EUR|euros))/i); if (b) budget = b[2]; }
        if (!cpv) { const c = s.match(/\bCPV[:\s]*([\d]{8}-\d)/i); if (c) cpv = c[1]; }
        if (!duration) { const du = s.match(/\b(duration|term|plazo de ejecuci[óo]n|duraci[óo]n)\b[^.]{0,30}?(\d+\s*(years?|months?|años|meses))/i); if (du) duration = du[2]; }
        if (!pageLimit) { const pl = s.match(/(maximum|max\.?|not exceed|no more than|m[áa]ximo|limited to)[^.\n]{0,40}?(\d{1,3})\s*(pages|p[áa]ginas)/i); if (pl) pageLimit = s.length < 200 ? s : `${pl[2]} pages maximum`; }
        if (/exclu(ded|sion|ir[áa]|si[óo]n)|will not be (evaluated|considered|admitted)|reject/i.test(s) && s.length < 320) {
          if (!exclusion.some((e) => normalize(e.text) === normalize(s))) exclusion.push({ text: s, docName: d.name, page: pageNo });
        }
        if (/(deadline|closing date|submission|must be received|plazo de presentaci[óo]n|fecha l[íi]mite|presentaci[óo]n de ofertas|questions|clarification)/i.test(s)) {
          for (const dt of findDates(s)) deadlines.push({ label: /question|clarification|aclaraci|pregunta/i.test(s) ? 'Fin del plazo de preguntas' : /open|apertura/i.test(s) ? 'Apertura de ofertas' : 'Fin de presentación de ofertas', date: dt.date.toISOString(), docName: d.name, page: pageNo });
        }
        if (s.length < 40 || s.length > 420) continue;
        if (!MODAL.test(s)) continue;
        const key = normalize(s).slice(0, 120);
        if (seen.has(key)) continue;
        seen.add(key);
        const category = categorize(s);
        reqs.push({ title: titleFrom(s), category, quote: s, docName: d.name, page: pageNo, mandatory: !/(?<![\p{L}])(may|optional|valued|se valorar[áa]n?|podr[áa]n? valorarse)(?![\p{L}])/iu.test(s), critical: ['financial', 'experience', 'certification', 'legal'].includes(category) });
      }
    });
  }
  // Si hay una ficha oficial (PROPO) con criterios, sus ponderaciones mandan: los pliegos repiten tablas y subcriterios.
  const fichaCrit = criteria.filter((c) => /^Ficha de la licitaci/.test(c.docName));
  if (fichaCrit.length) criteria.splice(0, criteria.length, ...fichaCrit);
  const tcount = new Map<string, number>();
  for (const r of reqs) { const n = (tcount.get(r.title) ?? 0) + 1; tcount.set(r.title, n); if (n > 1) r.title = `${r.title} (${n})`; }
  const subs = deadlines.filter((d) => d.label === 'Fin de presentación de ofertas').sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const deadline = subs[0]?.date ?? null;
  const judgement = criteria.filter((c) => c.kind === 'judgement');
  const structure = [
    { title: 'Resumen ejecutivo', guidance: 'Resumen inicial de tu propuesta.', criteria: [] as string[] },
    { title: 'Presentación de la empresa', guidance: 'Quiénes sois y por qué podéis ejecutar este contrato.', criteria: [] },
    { title: 'Comprensión de los requisitos', guidance: 'Demuestra al evaluador que habéis leído los pliegos.', criteria: [] },
    ...(judgement.length
      ? judgement.slice(0, 8).map((c) => ({ title: c.name, guidance: `Se valora en «${c.name}» (${c.points} pts).`, criteria: [c.name] }))
      : [
          { title: 'Enfoque técnico', guidance: 'Cómo se prestará el servicio o se ejecutará la obra.', criteria: [] },
          { title: 'Metodología', guidance: 'Procesos, herramientas y controles.', criteria: [] },
          { title: 'Equipo', guidance: 'Personal clave y funciones.', criteria: [] },
          { title: 'Calendario', guidance: 'Implantación e hitos.', criteria: [] },
          { title: 'Gestión de la calidad', guidance: 'Aseguramiento de la calidad e informes.', criteria: [] },
        ]),
  ];
  const nReq = reqs.length;
  return {
    summary: (purpose ? purpose + ' ' : '') + `La extracción básica ha encontrado ${nReq} posibles requisitos${criteria.length ? ` y ${criteria.length} criterios con puntuación` : ''}. Se han detectado por la redacción («deberá», «como mínimo», «se exigirá»…) y necesitan tu revisión.`,
    authority: authority ?? 'No identificado',
    reference: 'No identificada',
    cpv, budget, duration, deadline,
    deadlines: dedupeDeadlines(deadlines),
    pageLimit,
    requirements: reqs.slice(0, 90),
    criteria: criteria.slice(0, 16),
    requiredDocuments: reqs.filter((r) => /certificate|declaration|copy of|document|certificado|declaraci/i.test(r.quote)).map((r) => r.title).slice(0, 40),
    exclusionRisks: exclusion.slice(0, 8),
    structure,
  };
}

function dedupeDeadlines(d: ExtractionResult['deadlines']) {
  const m = new Map<string, ExtractionResult['deadlines'][number]>();
  d.forEach((x) => m.set(x.label + x.date.slice(0, 10), x));
  return [...m.values()].sort((a, b) => +new Date(a.date) - +new Date(b.date)).slice(0, 6);
}
