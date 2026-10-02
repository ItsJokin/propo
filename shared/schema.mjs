// Formato compacto de los datos que publica el robot (scripts/) y lee la web (src/lib/data/).
// Filas como arrays para que los JSON pesen poco; estos índices son la única definición.

/** Licitación abierta. */
export const T = {
  id: 0,        // identificador único: «p:<id PLACSP>», «a:<id agregadas>» o «t:<n.º TED>»
  title: 1,
  buyer: 2,     // órgano de contratación
  city: 3,
  cpv: 4,       // string[] de códigos CPV (8 dígitos)
  deadline: 5,  // ISO «YYYY-MM-DD» o «YYYY-MM-DDTHH:MM»; '' si no consta
  value: 6,     // valor estimado / presupuesto sin IVA (EUR) o 0 si no se publica
  nuts: 7,      // código NUTS del lugar de ejecución
  pub: 8,       // fecha de publicación o última actualización «YYYY-MM-DD»
  nature: 9,    // 'services' | 'supplies' | 'works' | ''
  url: 10,      // ficha oficial
  docs: 11,     // [nombre, url, tipo('pcap'|'ppt'|'otro')][] o 0
  crit: 12,     // [tipo('OBJ'|'SUBJ'), nombre, peso][] o 0
  ref: 13,      // n.º de expediente
  proc: 14,     // procedimiento (texto corto)
  dur: 15,      // duración en meses o 0
  label: 16,    // etiqueta del CPV principal (solo TED) o ''
  reqs: 17,     // requisitos de solvencia/capacidad publicados en el anuncio, string[] o 0
  budget: 18,   // presupuesto base sin IVA (PLACSP) o 0
  lots: 19,     // n.º de lotes (0 = sin lotes)
  desc: 20,     // descripción corta si aporta algo más que el título, o ''
};

/** Adjudicación (una fila por lote adjudicado). */
export const A = {
  id: 0,        // «p:<id>#<lote>», «a:…» o «t:<n.º TED>»
  date: 1,      // fecha de adjudicación «YYYY-MM-DD»
  title: 2,
  buyer: 3,     // índice en `buyers`
  cpv: 4,       // CPV principal
  nuts: 5,
  nature: 6,
  proc: 7,
  offers: 8,    // ofertas recibidas (0 = no consta)
  sme: 9,       // ofertas de pymes (-1 = no consta)
  budget: 10,   // presupuesto base sin IVA del lote (0 = no consta)
  amount: 11,   // importe adjudicado sin IVA (0 = no consta)
  low: 12,      // oferta más baja (0 = no consta)
  high: 13,     // oferta más alta (0 = no consta)
  winners: 14,  // índices en `winners`
  dur: 15,      // duración en meses (0 = no consta)
  start: 16,    // inicio del contrato «YYYY-MM-DD» o ''
  ref: 17,      // n.º de expediente
  link: 18,     // identificador de la ficha en la Plataforma (idEvl) o ''; con TED el enlace sale del id
};

/** Adjudicatario en el diccionario `winners` de cada partición. */
export const W = { name: 0, nif: 1, sme: 2 }; // sme: 1 pyme, 0 no pyme, -1 no consta

export const NATURES = { 1: 'supplies', 2: 'services', 3: 'works', 21: 'services', 22: 'services', 31: 'works', 7: 'services', 8: 'services', 40: 'works', 50: 'services' };
export const PROCEDURES = { 1: 'Abierto', 2: 'Restringido', 3: 'Negociado sin publicidad', 4: 'Negociado con publicidad', 5: 'Diálogo competitivo', 6: 'Contrato menor', 7: 'Derivado de acuerdo marco', 8: 'Concurso de proyectos', 9: 'Abierto simplificado', 10: 'Asociación para la innovación', 11: 'Derivado de asociación para la innovación', 12: 'Basado en sistema dinámico de adquisición', 13: 'Licitación con negociación', 100: 'Normas internas', 999: 'Otros' };
export const TED_PROC = { open: 'Abierto', restricted: 'Restringido', 'neg-w-call': 'Negociado con publicidad', 'neg-wo-call': 'Negociado sin publicidad', 'comp-dial': 'Diálogo competitivo', innovation: 'Asociación para la innovación', 'comp-tend': 'Licitación con negociación', 'oth-single': 'Otro (una fase)', 'oth-mult': 'Otro (varias fases)' };

/** Partición de adjudicaciones: división CPV (2 dígitos) + año de adjudicación. */
export const partitionOf = (cpv, date) => `${(cpv || '00').slice(0, 2)}-${(date || '0000').slice(0, 4)}`;

/** Personas físicas (autónomos): nunca guardamos su nombre ni su NIF. */
export const PERSON = 'Persona física (autónomo)';
const COMPANY_FORM = /\b(s\.?\s?l\.?(\s?[upl]\.?)?|s\.?\s?a\.?(\s?[ul]\.?)?|s\.?\s?coop|sociedad|cooperativa|u\.?t\.?e\.?|uni[oó]n temporal|fundaci[oó]n?|asociaci[oó]n?|ayuntamiento|universi[dt]a[dt]|instituto|colegio|consorci|gmbh|ltd|limited|inc|corp|b\.?v\.?|s\.?r\.?l|s\.?p\.?a|s\.?a\.?s|lda|s\.?c\.?p?|c\.?b\.?|a\.?i\.?e\.?|group|grupo|servicios|ingenier[ií]a|construcciones|suministros)\b/i;
/** Devuelve [nombre, nif] o la marca anónima si el adjudicatario es o puede ser una persona física. */
export function winnerIdentity(name, id) {
  const nif = String(id || '').replace(/[\s.-]/g, '').toUpperCase();
  const person = /\*/.test(nif) || /^\d{8}[A-Z]$/.test(nif) || /^[XYZKLM]\d{7}[A-Z]$/.test(nif) || (!nif && !COMPANY_FORM.test(name || ''));
  return person ? [PERSON, ''] : [String(name || '').replace(/\s+/g, ' ').trim().slice(0, 110), /^[A-HJNP-SUVW]\d{7}[0-9A-J]$/.test(nif) ? nif : ''];
}

/** Enlace a la ficha oficial de una adjudicación. */
export const awardUrl = (id, link) => id.startsWith('t:') ? `https://ted.europa.eu/es/notice/-/detail/${id.slice(2)}` : link ? `https://contrataciondelestado.es/wps/poc?uri=deeplink:detalle_licitacion&idEvl=${link}` : '';

/** Divisiones del CPV (dos primeros dígitos). */
export const CPV_DIVISIONS = { '03': 'Productos agrícolas, ganaderos y pesqueros', '09': 'Combustibles y energía', 14: 'Productos de minería', 15: 'Alimentos y bebidas', 16: 'Maquinaria agrícola', 18: 'Ropa, calzado y accesorios', 19: 'Cuero, textiles y plásticos', 22: 'Impresos y publicaciones', 24: 'Productos químicos', 30: 'Equipos de oficina e informática', 31: 'Material eléctrico e iluminación', 32: 'Equipos de radio, televisión y telecomunicaciones', 33: 'Equipamiento médico y farmacéutico', 34: 'Vehículos y equipos de transporte', 35: 'Equipos de seguridad y defensa', 37: 'Instrumentos musicales y material deportivo', 38: 'Equipos de laboratorio y de precisión', 39: 'Mobiliario, menaje y limpieza', 41: 'Agua', 42: 'Maquinaria industrial', 43: 'Maquinaria de construcción y minería', 44: 'Materiales de construcción', 45: 'Obras de construcción', 48: 'Programas y software', 50: 'Reparación y mantenimiento', 51: 'Servicios de instalación', 55: 'Hostelería y restauración', 60: 'Transporte', 63: 'Servicios auxiliares de transporte y viajes', 64: 'Correos y telecomunicaciones', 65: 'Suministro de agua, gas y electricidad', 66: 'Servicios financieros y seguros', 70: 'Servicios inmobiliarios', 71: 'Arquitectura e ingeniería', 72: 'Servicios informáticos', 73: 'Investigación y desarrollo', 75: 'Administración pública y servicios sociales', 76: 'Servicios para el sector del petróleo y gas', 77: 'Agricultura, silvicultura y jardinería', 79: 'Servicios a empresas', 80: 'Educación y formación', 85: 'Salud y asistencia social', 90: 'Residuos, limpieza y medio ambiente', 92: 'Cultura, deporte y ocio', 98: 'Otros servicios' };
export const cpvDivision = (cpv) => CPV_DIVISIONS[String(cpv || '').slice(0, 2)] || CPV_DIVISIONS[Number(String(cpv || '').slice(0, 2))] || '';
