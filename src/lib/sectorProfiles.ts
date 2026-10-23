// Datos de la empresa propios de su sector: lo que suelen puntuar los pliegos de ese sector (medios, capacidad,
// habilitaciones, compromisos). Se piden en Empresa → «Tu sector» solo a las empresas de ese sector, y PROPO los usa
// al comprobar requisitos y al redactar la memoria. Se guardan en company.sectorData[sector][campo].
import type { CompanyInfo } from './types';
import { SECTORS, INDUSTRY_TO_SECTORS } from './discovery/match';

export type FieldType = 'text' | 'number' | 'textarea' | 'yesno' | 'chips' | 'list';
export interface SField {
  id: string; label: string; type: FieldType;
  help?: string;                       // para qué sirve en una oferta (se enseña debajo)
  placeholder?: string; unit?: string;
  options?: string[];                  // chips
  columns?: { id: string; label: string; width?: number; numeric?: boolean }[];   // list
}
export interface SectorProfile { id: string; label: string; intro: string; groups: { title: string; fields: SField[] }[] }

const VEHICLES: SField = { id: 'vehiculos', label: 'Vehículos', type: 'list', help: 'Muchos pliegos puntúan la flota de bajas emisiones: indica la etiqueta ambiental de la DGT.', columns: [{ id: 'tipo', label: 'Tipo', width: 2 }, { id: 'unidades', label: 'Unidades', numeric: true }, { id: 'etiqueta', label: 'Etiqueta (CERO, ECO, C…)' }] };
const MACHINES = (ph: string): SField => ({ id: 'maquinaria', label: 'Maquinaria y equipos', type: 'list', help: 'PROPO la cita en la memoria como medios propios; nunca inventa máquinas que no estén aquí.', columns: [{ id: 'nombre', label: `Equipo (p. ej. ${ph})`, width: 3 }, { id: 'unidades', label: 'Unidades', numeric: true }] });
const STAFF = (ph: string): SField => ({ id: 'plantilla', label: 'Plantilla por puesto', type: 'list', help: 'Sirve para la adscripción de medios y para justificar la capacidad de respuesta.', columns: [{ id: 'puesto', label: `Puesto (p. ej. ${ph})`, width: 3 }, { id: 'personas', label: 'Personas', numeric: true }] });
const RESPONSE: SField = { id: 'respuesta', label: 'Tiempo de respuesta ante una incidencia', type: 'number', unit: 'horas', help: 'Es una mejora que se puntúa a menudo por fórmula: PROPO te avisará de no ponerla en la memoria técnica si va en el sobre automático.' };

// Bloque común: lo que puntúan casi todos los pliegos como criterios sociales y ambientales.
export const COMMON = 'comun';
export const SOCIAL: { title: string; fields: SField[] } = { title: 'Compromisos sociales y ambientales', fields: [
  { id: 'igualdad', label: 'Plan de igualdad registrado', type: 'yesno', help: 'Obligatorio con 50 personas o más; con menos, suma puntos y lo piden algunos pliegos.' },
  { id: 'discapacidad', label: 'Personas con discapacidad en plantilla', type: 'number', unit: '%' },
  { id: 'indefinidos', label: 'Contratos indefinidos', type: 'number', unit: '% de la plantilla' },
  { id: 'insercion', label: 'Contratación de colectivos vulnerables o empleo local', type: 'textarea', placeholder: 'p. ej. convenio con el servicio de empleo municipal; 3 personas en riesgo de exclusión contratadas en 2025' },
  { id: 'huella', label: 'Huella de carbono calculada o registrada (MITECO)', type: 'yesno' },
  { id: 'renovable', label: 'Electricidad 100 % renovable', type: 'yesno' },
  { id: 'ambiental', label: 'Otras medidas ambientales', type: 'textarea', placeholder: 'p. ej. reciclaje en origen, productos con ecoetiqueta, rutas optimizadas' },
] };

const P: SectorProfile[] = [
  { id: 'catering', label: 'Catering y restauración', intro: 'Comedores escolares, residencias, hospitales y eventos puntúan la cocina, las dietas especiales y el producto de proximidad.', groups: [
    { title: 'Cocina y producción', fields: [
      { id: 'cocina', label: 'Cocina central propia', type: 'yesno' },
      { id: 'cocina_lugar', label: 'Dónde está la cocina central', type: 'text', placeholder: 'p. ej. polígono Can Calderón, Viladecans (a 12 km de Barcelona)', help: 'La distancia al servicio se valora en línea fría y en transporte en caliente.' },
      { id: 'capacidad', label: 'Capacidad de producción', type: 'number', unit: 'menús al día' },
      { id: 'modalidad', label: 'Modalidades de servicio', type: 'chips', options: ['Cocina in situ', 'Línea caliente', 'Línea fría', 'Comedor escolar con monitores', 'Catering de eventos', 'Máquinas vending'] },
      { id: 'rgseaa', label: 'Registro sanitario (RGSEAA)', type: 'text', placeholder: 'p. ej. 26.012345/B' },
    ] },
    { title: 'Menús y calidad alimentaria', fields: [
      { id: 'dietas', label: 'Dietas especiales que sabéis servir', type: 'chips', options: ['Sin gluten', 'Alergias e intolerancias', 'Vegetariana', 'Vegana', 'Halal', 'Sin cerdo', 'Triturada', 'Diabética', 'Hiposódica', 'Blanda'] },
      { id: 'ecologico', label: 'Producto ecológico en los menús', type: 'number', unit: '%' },
      { id: 'proximidad', label: 'Producto de proximidad o km 0', type: 'number', unit: '%' },
      { id: 'nutricionista', label: 'Dietista-nutricionista que revisa los menús', type: 'yesno' },
      { id: 'appcc', label: 'Sistema de seguridad alimentaria', type: 'chips', options: ['APPCC', 'ISO 22000', 'IFS', 'BRC', 'FSSC 22000'] },
      { id: 'desperdicio', label: 'Plan contra el desperdicio alimentario', type: 'textarea', placeholder: 'p. ej. donación de excedentes a un banco de alimentos, medición de sobras por comedor' },
    ] },
    { title: 'Medios', fields: [VEHICLES, STAFF('cocinero/a, ayudante, monitor/a de comedor')] },
  ] },
  { id: 'limpieza', label: 'Limpieza', intro: 'En limpieza se puntúan la organización del servicio, la maquinaria, los productos ecológicos y el control de calidad.', groups: [
    { title: 'Servicio', fields: [
      STAFF('limpiador/a, especialista, encargado/a'),
      { id: 'horarios', label: 'Servicio que podéis cubrir', type: 'chips', options: ['Horario diurno', 'Horario nocturno', 'Fines de semana', '24 horas', 'Servicio de urgencias'] },
      RESPONSE,
      { id: 'especialidades', label: 'Limpiezas especiales', type: 'chips', options: ['Cristales en altura', 'Fin de obra', 'Hospitalaria', 'Desinfección', 'Moquetas y tapicerías', 'Pulido y abrillantado de suelos', 'Grafitis'] },
    ] },
    { title: 'Medios y productos', fields: [
      MACHINES('fregadora de conductor sentado, aspirador industrial'),
      { id: 'ecoetiqueta', label: 'Productos con ecoetiqueta (Ecolabel o similar)', type: 'number', unit: '%' },
      { id: 'control', label: 'Cómo controláis la calidad', type: 'textarea', placeholder: 'p. ej. app de partes con fotos y firma del cliente; inspección mensual del encargado con checklist' },
      VEHICLES,
    ] },
  ] },
  { id: 'mantenimiento', label: 'Mantenimiento de edificios', intro: 'En mantenimiento cuentan los oficios propios, las habilitaciones, la guardia y el tiempo de respuesta.', groups: [
    { title: 'Oficios y habilitaciones', fields: [
      { id: 'oficios', label: 'Oficios con personal propio', type: 'chips', options: ['Electricidad', 'Fontanería', 'Climatización', 'Calefacción', 'Carpintería', 'Pintura', 'Cerrajería', 'Albañilería', 'Ascensores', 'Protección contra incendios', 'Jardinería'] },
      { id: 'habilitaciones', label: 'Habilitaciones de la empresa', type: 'chips', options: ['Instalador RITE (térmicas)', 'Baja tensión', 'Alta tensión', 'Gas', 'Protección contra incendios (RIPCI)', 'Frigorista', 'Legionela', 'Productos petrolíferos'] },
      STAFF('oficial electricista, técnico de climatización'),
    ] },
    { title: 'Servicio', fields: [
      { id: 'guardia', label: 'Servicio de guardia 24 horas', type: 'yesno' }, RESPONSE,
      { id: 'gmao', label: 'Programa de gestión del mantenimiento (GMAO)', type: 'text', placeholder: 'p. ej. Fracttal, Prisma, propio' },
      { id: 'almacen', label: 'Almacén de repuestos', type: 'text', placeholder: 'p. ej. nave de 300 m² en Getafe' },
      VEHICLES,
    ] },
  ] },
  { id: 'seguridad', label: 'Seguridad y vigilancia', intro: 'Los pliegos de seguridad exigen la habilitación del Ministerio del Interior y puntúan la central de alarmas, los medios y la formación.', groups: [
    { title: 'Habilitación y medios', fields: [
      { id: 'registro', label: 'N.º de inscripción en el Registro Nacional de Seguridad Privada', type: 'text' },
      { id: 'cra', label: 'Central receptora de alarmas propia', type: 'yesno' },
      { id: 'servicios', label: 'Servicios', type: 'chips', options: ['Vigilancia sin arma', 'Vigilancia con arma', 'Acudas', 'Rondas', 'Escolta', 'Auxiliares de servicios', 'Sistemas de seguridad'] },
      STAFF('vigilante, jefe de equipo, auxiliar'), VEHICLES, RESPONSE,
    ] },
  ] },
  { id: 'it', label: 'Tecnología e IT', intro: 'En tecnología se valoran las certificaciones, la metodología, el equipo por perfiles y los niveles de servicio.', groups: [
    { title: 'Capacidad técnica', fields: [
      { id: 'certs', label: 'Certificaciones', type: 'chips', options: ['ISO 27001', 'ENS nivel básico', 'ENS nivel medio', 'ENS nivel alto', 'ISO 20000', 'ISO 9001', 'CMMI', 'ISO 22301'] },
      { id: 'tecnologias', label: 'Tecnologías en las que sois expertos', type: 'textarea', placeholder: 'p. ej. Java, .NET, Drupal, SAP, Microsoft 365, AWS, Azure' },
      { id: 'metodologia', label: 'Metodología', type: 'chips', options: ['Scrum', 'Kanban', 'ITIL', 'PMBOK', 'Métrica v3', 'DevOps'] },
      STAFF('jefe de proyecto, analista, desarrollador sénior'),
    ] },
    { title: 'Soporte', fields: [
      { id: 'soporte', label: 'Horario de soporte', type: 'chips', options: ['Laborables 8–18 h', '24×7', 'Guardias', 'Soporte in situ'] },
      { id: 'sla', label: 'Tiempo de respuesta a incidencias críticas', type: 'number', unit: 'horas' },
      { id: 'herramientas', label: 'Herramientas de gestión', type: 'text', placeholder: 'p. ej. Jira, GLPI, ServiceNow' },
    ] },
  ] },
  { id: 'jardineria', label: 'Jardinería y zonas verdes', intro: 'En jardinería puntúan la maquinaria (sobre todo eléctrica), el personal técnico, el riego eficiente y el control de plagas sostenible.', groups: [
    { title: 'Medios', fields: [
      MACHINES('desbrozadora eléctrica, plataforma elevadora, biotrituradora'), VEHICLES, STAFF('oficial jardinero, peón, técnico'),
      { id: 'ropo', label: 'Carné de aplicador de fitosanitarios (ROPO)', type: 'yesno' },
      { id: 'vivero', label: 'Vivero propio', type: 'yesno' },
      { id: 'tecnicas', label: 'Técnicas sostenibles', type: 'chips', options: ['Lucha biológica', 'Riego por goteo', 'Telegestión del riego', 'Compostaje de restos', 'Especies autóctonas', 'Sin glifosato'] },
    ] },
  ] },
  { id: 'transporte', label: 'Transporte', intro: 'En transporte se valoran la flota (antigüedad, emisiones, accesibilidad), las autorizaciones y el seguimiento del servicio.', groups: [
    { title: 'Flota y autorizaciones', fields: [
      { id: 'flota', label: 'Flota', type: 'list', columns: [{ id: 'tipo', label: 'Vehículo (p. ej. autocar 55 plazas)', width: 3 }, { id: 'unidades', label: 'Unidades', numeric: true }, { id: 'anio', label: 'Año medio' }, { id: 'etiqueta', label: 'Etiqueta' }] },
      { id: 'pmr', label: 'Vehículos adaptados a personas con movilidad reducida', type: 'number', unit: 'vehículos' },
      { id: 'autorizaciones', label: 'Autorizaciones', type: 'chips', options: ['VD (viajeros discrecional)', 'MDP (mercancías)', 'Transporte escolar', 'Transporte sanitario', 'ADR (mercancías peligrosas)'] },
      { id: 'gps', label: 'Seguimiento por GPS', type: 'yesno' },
      { id: 'cocheras', label: 'Cocheras o bases', type: 'text', placeholder: 'p. ej. Alcalá de Henares y Guadalajara' },
      STAFF('conductor/a, acompañante, jefe de tráfico'),
    ] },
  ] },
  { id: 'formacion', label: 'Formación', intro: 'En formación cuentan la acreditación del centro, las instalaciones, la plataforma online y los docentes.', groups: [
    { title: 'Centro y docentes', fields: [
      { id: 'acreditado', label: 'Centro acreditado o inscrito (SEPE o comunidad autónoma)', type: 'yesno' },
      { id: 'aulas', label: 'Aulas e instalaciones', type: 'textarea', placeholder: 'p. ej. 4 aulas de 20 plazas y 1 aula informática en Sevilla' },
      { id: 'modalidad', label: 'Modalidades', type: 'chips', options: ['Presencial', 'Online', 'Aula virtual', 'Mixta'] },
      { id: 'plataforma', label: 'Plataforma online', type: 'text', placeholder: 'p. ej. Moodle propio' },
      { id: 'docentes', label: 'Docentes', type: 'number', unit: 'personas' },
      { id: 'materias', label: 'Materias en las que sois especialistas', type: 'textarea' },
    ] },
  ] },
  { id: 'social', label: 'Servicios sociales', intro: 'En servicios sociales se valoran la acreditación de la entidad, los perfiles profesionales, la coordinación y la calidad de la atención.', groups: [
    { title: 'Entidad y equipo', fields: [
      { id: 'registro', label: 'Inscripción en el registro de entidades de servicios sociales', type: 'text', placeholder: 'p. ej. n.º E-1234 de la Comunidad de Madrid' },
      { id: 'servicios', label: 'Servicios', type: 'chips', options: ['Ayuda a domicilio', 'Teleasistencia', 'Centro de día', 'Residencia', 'Atención a la infancia', 'Inserción laboral', 'Atención a personas sin hogar'] },
      STAFF('trabajador/a social, auxiliar SAD, psicólogo/a'),
      { id: 'voluntariado', label: 'Programa de voluntariado', type: 'yesno' },
      { id: 'calidad', label: 'Sistema de calidad o evaluación de la satisfacción', type: 'textarea' },
    ] },
  ] },
  { id: 'construccion', label: 'Construcción y obras', intro: 'Además de la clasificación y la maquinaria (arriba), en obras se valoran los medios técnicos, la gestión ambiental de la obra y el control de calidad.', groups: [
    { title: 'Medios técnicos', fields: [
      { id: 'tecnicos', label: 'Técnicos propios', type: 'list', columns: [{ id: 'puesto', label: 'Puesto (p. ej. jefe de obra, ingeniero, topógrafo)', width: 3 }, { id: 'personas', label: 'Personas', numeric: true }] },
      { id: 'instalaciones', label: 'Instalaciones', type: 'textarea', placeholder: 'p. ej. nave y parque de maquinaria en Tudela; laboratorio de control de calidad concertado' },
      { id: 'software', label: 'Software de obra', type: 'chips', options: ['Presto', 'Arquímedes', 'BIM (Revit)', 'MS Project', 'AutoCAD', 'Civil 3D'] },
      { id: 'residuos', label: 'Gestión de residuos de obra', type: 'textarea', placeholder: 'p. ej. gestor autorizado propio; reutilización de tierras en la propia obra' },
    ] },
  ] },
];

// Sectores sin perfil propio: datos generales de medios y servicio.
const GENERIC = (id: string, label: string): SectorProfile => ({ id, label, intro: `Datos de tu actividad que suelen puntuar en los pliegos de ${label.toLowerCase()}.`, groups: [
  { title: 'Medios y servicio', fields: [
    STAFF('técnico, coordinador/a'), MACHINES('equipo principal'), VEHICLES, RESPONSE,
    { id: 'instalaciones', label: 'Instalaciones', type: 'textarea' },
    { id: 'metodo', label: 'Cómo organizáis el servicio', type: 'textarea', placeholder: 'p. ej. coordinador único para el cliente, reunión mensual de seguimiento, informe trimestral' },
  ] },
] });

export const PROFILE_IDS = new Set(P.map((x) => x.id));
export function profileFor(id: string): SectorProfile {
  const p = P.find((x) => x.id === id) ?? GENERIC(id, SECTORS.find((s) => s.id === id)?.label ?? 'tu sector');
  return p;
}

/** Sectores de la empresa: los de su perfil de búsqueda, su actividad o, si tiene clasificación, construcción. */
export function companySectors(c: Pick<CompanyInfo, 'cpvs' | 'industry' | 'clasificaciones'>): string[] {
  const ids = SECTORS.filter((x) => x.cpv.length && x.cpv.some((p) => (c.cpvs ?? []).includes(p))).map((x) => x.id);
  for (const id of INDUSTRY_TO_SECTORS[c.industry ?? ''] ?? []) if (!ids.includes(id)) ids.push(id);
  if ((c.clasificaciones?.length) && !ids.includes('construccion')) ids.push('construccion');
  return ids;
}

const shown = (f: SField, v: any): string | null => {
  if (v == null || v === '' || (Array.isArray(v) && !v.length)) return null;
  if (f.type === 'yesno') return v ? 'sí' : 'no';
  if (f.type === 'chips') return (v as string[]).join(', ');
  if (f.type === 'list') return (v as Record<string, string>[]).filter((r) => Object.values(r).some(Boolean)).map((r) => f.columns!.map((col) => r[col.id]).filter(Boolean).join(' · ')).join('; ') || null;
  return `${v}${f.unit ? ` ${f.unit}` : ''}`;
};

/** Datos de sector rellenados, como frases cortas que la IA puede citar (solo lo que la empresa ha guardado). */
export function sectorFacts(c: Pick<CompanyInfo, 'sectorData' | 'cpvs' | 'industry' | 'clasificaciones'>): { id: string; label: string; text: string }[] {
  const out: { id: string; label: string; text: string }[] = [];
  for (const [sid, data] of Object.entries(c.sectorData ?? {})) {
    const groups = sid === COMMON ? [SOCIAL] : profileFor(sid).groups;
    for (const g of groups) for (const f of g.fields) {
      const v = shown(f, data?.[f.id]); if (v == null) continue;
      if (f.type === 'yesno' && v === 'no') continue;
      out.push({ id: `sd_${sid}_${f.id}`, label: f.label, text: `${f.label}: ${v}` });
    }
  }
  const seen = new Set<string>(); return out.filter((x) => !seen.has(x.text) && !!seen.add(x.text));
}

/** Cuánto de su sector tiene rellenado la empresa (0–1), para la barra «Memoria de empresa». */
export function sectorCompleteness(c: Pick<CompanyInfo, 'sectorData' | 'cpvs' | 'industry' | 'clasificaciones'>): number {
  const ids = companySectors(c); if (!ids.length) return 0;
  const p = profileFor(ids[0]); const fields = p.groups.flatMap((g) => g.fields);
  const data = c.sectorData?.[ids[0]] ?? {};
  return Math.min(1, fields.filter((f) => shown(f, data[f.id]) != null).length / Math.max(4, Math.round(fields.length * 0.6)));
}
