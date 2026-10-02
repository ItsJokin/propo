// Espacio de ejemplo. Todas las organizaciones, personas y cifras son ficticias y solo sirven
// para enseñar el producto. En la interfaz llevan la etiqueta "Ejemplo".
import type {
  CompanyInfo, PastProject, Certification, TeamMember, VaultDoc, Project, Requirement,
  Criterion, Section, SourceDoc, Notification, Template, ReqStatus, ReqCategory,
} from './types';
import { addDays, nowIso } from './util';

export const SAMPLE_COMPANY: CompanyInfo = {
  legalName: 'Mesa Viva Catering S.L.',
  tradeName: 'Mesa Viva',
  taxId: 'ESB00000000 (ejemplo)',
  address: 'Carrer de la Mostra 12, 08907 L’Hospitalet de Llobregat',
  country: 'España',
  industry: 'Catering y restauración',
  employees: '100–249',
  revenue: '4,2 M€ (2025)',
  website: 'mesaviva.example',
  description: 'Empresa de restauración colectiva que da servicio a escuelas, centros de día y comedores de empresa del área metropolitana de Barcelona desde una cocina central de 1.400 m².',
  capabilities: ['Comidas escolares en línea fría', 'Menús adaptados a alergias e intolerancias', 'Gestión de comedores de empresa', 'Catering de eventos hasta 1.500 personas', 'Menús diseñados por dietista-nutricionista'],
  sectors: ['Educación', 'Servicios sociales', 'Empresas', 'Eventos'],
  cpvs: ['553', '555', '554', '7995'],
  regions: ['ES51'],
};

export const SAMPLE_PAST_PROJECTS: PastProject[] = [
  { id: 'pp1', title: 'Red de comedores escolares — 21 escuelas', client: 'Consorci Educatiu del Vallès (ejemplo)', sector: 'Educación', years: '2022–2025', value: '1,1 M€ / año', description: 'Comida diaria para 4.300 alumnos en línea fría desde cocina central, con menús adaptados para el 7 % de los comensales.', hasCertificate: true },
  { id: 'pp2', title: 'Comidas para centros de día de personas mayores', client: 'Serveis Socials de Badalona (ejemplo)', sector: 'Servicios sociales', years: '2021–2024', value: '620.000 € / año', description: 'Comidas y cenas para 9 centros de día, dietas de textura modificada y supervisión de dietista.', hasCertificate: false },
  { id: 'pp3', title: 'Comedor de campus corporativo', client: 'Parc Tecnològic del Poblenou (ejemplo)', sector: 'Empresas', years: '2022–actualidad', value: '780.000 € / año', description: 'Comedor en autoservicio para 1.100 empleados, 3 líneas de menú y programa de medición del desperdicio alimentario.', hasCertificate: true },
  { id: 'pp4', title: 'Restauración de residencias universitarias', client: 'Residències Universitàries de Sabadell (ejemplo)', sector: 'Educación', years: '2019–2022', value: '380.000 € / año', description: 'Desayunos y cenas para 420 residentes.', hasCertificate: true },
];

export const SAMPLE_CERTS: Certification[] = [
  { id: 'c1', name: 'ISO 9001:2015 — Gestión de la calidad', issuer: 'Applus+ (ejemplo)', validUntil: '2027-05-31', category: 'quality' },
  { id: 'c2', name: 'ISO 14001:2015 — Gestión ambiental', issuer: 'Applus+ (ejemplo)', validUntil: '2026-11-15', category: 'environmental' },
  { id: 'c3', name: 'Plan de igualdad registrado', issuer: 'REGCON (ejemplo)', validUntil: '2028-02-01', category: 'other' },
];

export const SAMPLE_TEAM: TeamMember[] = [
  { id: 't1', name: 'Marc Puig', role: 'Director de operaciones / coordinador del servicio', years: 12, qualifications: 'Máster en Gestión de la Industria Alimentaria' },
  { id: 't2', name: 'Laia Serra', role: 'Dietista-nutricionista', years: 8, qualifications: 'Dietista-nutricionista colegiada (CODINUCAT)' },
  { id: 't3', name: 'Jordi Ferrer', role: 'Jefe de cocina central', years: 15, qualifications: 'Artes Culinarias, curso de auditor APPCC' },
  { id: 't4', name: 'Núria Vidal', role: 'Responsable de calidad y seguridad alimentaria', years: 10, qualifications: 'Grado en Ciencia y Tecnología de los Alimentos, auditora interna ISO 9001' },
  { id: 't5', name: 'Pau Soler', role: 'Coordinador de logística', years: 6, qualifications: 'Certificado en logística de cadena de frío' },
  { id: 't6', name: 'Anna Roig', role: 'Licitaciones y administración', years: 4, qualifications: 'Curso de contratación pública (LCSP)' },
];

export const SAMPLE_VAULT: VaultDoc[] = [
  { id: 'v1', name: 'Escrituras y poderes de representación.pdf', category: 'corporate', uploadedAt: addDays(-220), pages: 34, sizeKb: 2400, usedIn: 6, hasFile: false },
  { id: 'v2', name: 'Certificado de inscripción en el ROLECE.pdf', category: 'corporate', uploadedAt: addDays(-60), expiresAt: addDays(305), pages: 3, sizeKb: 310, usedIn: 5, hasFile: false },
  { id: 'v3', name: 'Certificado de estar al corriente con la AEAT.pdf', category: 'financial', uploadedAt: addDays(-40), expiresAt: addDays(140), pages: 1, sizeKb: 120, usedIn: 4, hasFile: false },
  { id: 'v4', name: 'Certificado de estar al corriente con la Seguridad Social.pdf', category: 'financial', uploadedAt: addDays(-40), expiresAt: addDays(140), pages: 1, sizeKb: 118, usedIn: 4, hasFile: false },
  { id: 'v5', name: 'Cuentas anuales 2025.pdf', category: 'financial', uploadedAt: addDays(-90), pages: 28, sizeKb: 1900, usedIn: 3, hasFile: false },
  { id: 'v6', name: 'Póliza de responsabilidad civil profesional.pdf', category: 'insurance', uploadedAt: addDays(-150), expiresAt: addDays(95), pages: 12, sizeKb: 860, usedIn: 5, hasFile: false },
  { id: 'v7', name: 'Certificado ISO 9001.pdf', category: 'certificate', uploadedAt: addDays(-300), expiresAt: '2027-05-31', pages: 2, sizeKb: 420, usedIn: 7, hasFile: false },
  { id: 'v8', name: 'Certificado ISO 14001.pdf', category: 'certificate', uploadedAt: addDays(-300), expiresAt: '2026-11-15', pages: 2, sizeKb: 410, usedIn: 6, hasFile: false },
  { id: 'v9', name: 'Certificado de buena ejecución — Escuelas del Vallès.pdf', category: 'experience', uploadedAt: addDays(-120), pages: 2, sizeKb: 250, usedIn: 3, hasFile: false },
  { id: 'v10', name: 'Certificado de buena ejecución — Comedor Poblenou.pdf', category: 'experience', uploadedAt: addDays(-120), pages: 2, sizeKb: 240, usedIn: 2, hasFile: false },
  { id: 'v11', name: 'CV del equipo clave.pdf', category: 'team', uploadedAt: addDays(-75), pages: 14, sizeKb: 1300, usedIn: 4, hasFile: false },
  { id: 'v12', name: 'Registro del plan de igualdad.pdf', category: 'corporate', uploadedAt: addDays(-200), pages: 4, sizeKb: 380, usedIn: 3, hasFile: false },
  { id: 'v13', name: 'Propuesta — Escuelas del Vallès 2022 (adjudicada).pdf', category: 'proposal', uploadedAt: addDays(-400), pages: 38, sizeKb: 5200, usedIn: 2, hasFile: false },
];

// ---------------------------------------------------------------------------
// Servicio de restauración municipal de Barcelona — proyecto de ejemplo principal
// ---------------------------------------------------------------------------

const DOCS: [string, string, SourceDoc['kind'], number, number][] = [
  ['d1', 'PCAP — Pliego de cláusulas administrativas.pdf', 'pdf', 64, 1840],
  ['d2', 'PPT — Pliego de prescripciones técnicas.pdf', 'pdf', 88, 3120],
  ['d3', 'Anexo I — DEUC declaración responsable.pdf', 'pdf', 12, 410],
  ['d4', 'Anexo II — Modelo de oferta económica.xlsx', 'xlsx', 3, 64],
  ['d5', 'Anexo III — Criterios de adjudicación.pdf', 'pdf', 9, 290],
  ['d6', 'Anexo IV — Requisitos de menús y nutrición.pdf', 'pdf', 22, 880],
  ['d7', 'Anexo V — Centros y volúmenes de servicio.xlsx', 'xlsx', 6, 120],
  ['d8', 'Anexo VI — Relación de personal a subrogar.xlsx', 'xlsx', 14, 210],
  ['d9', 'Anexo VII — APPCC y seguridad alimentaria.pdf', 'pdf', 18, 640],
  ['d10', 'Anexo VIII — Sostenibilidad y desperdicio alimentario.pdf', 'pdf', 11, 390],
  ['d11', 'Anexo IX — Protocolo de gestión de alérgenos.pdf', 'pdf', 10, 350],
  ['d12', 'Anexo X — Modelo de contrato.pdf', 'pdf', 16, 520],
  ['d13', 'Aclaraciones — Ronda de preguntas 1.pdf', 'pdf', 6, 180],
  ['d14', 'Anuncio de licitación.pdf', 'pdf', 8, 260],
];
const docName = (id: string) => DOCS.find((d) => d[0] === id)![1];

type R = [id: string, title: string, cat: ReqCategory, status: ReqStatus, doc: string, page: number, clause: string, quote: string, extra?: Partial<Requirement>];

const REQS: R[] = [
  ['r1', 'Declaración responsable (DEUC)', 'administrative', 'fulfilled', 'd3', 2, 'Anexo I', 'Los licitadores presentarán en el sobre A el Documento Europeo Único de Contratación (DEUC), debidamente cumplimentado y firmado por el representante legal.', { evidence: [{ kind: 'company', label: 'Rellenado a partir del perfil de empresa' }] }],
  ['r2', 'Inscripción en el Registro Oficial de Licitadores', 'administrative', 'fulfilled', 'd1', 14, 'Cl. 9.1', 'La inscripción en el Registro Oficial de Licitadores y Empresas Clasificadas del Sector Público (ROLECE) eximirá al licitador de presentar los documentos que consten en el mismo.', { evidence: [{ kind: 'vault', label: 'Certificado de inscripción en el ROLECE.pdf', ref: 'v2' }] }],
  ['r3', 'Certificado de obligaciones tributarias', 'administrative', 'fulfilled', 'd1', 15, 'Cl. 9.3', 'El licitador propuesto como adjudicatario deberá aportar certificado acreditativo de estar al corriente de sus obligaciones tributarias, expedido en los últimos seis meses.', { evidence: [{ kind: 'vault', label: 'Certificado de estar al corriente con la AEAT.pdf', ref: 'v3' }] }],
  ['r4', 'Certificado de la Seguridad Social', 'administrative', 'fulfilled', 'd1', 15, 'Cl. 9.3', 'El licitador propuesto como adjudicatario deberá aportar certificado acreditativo de estar al corriente de sus obligaciones con la Seguridad Social.', { evidence: [{ kind: 'vault', label: 'Certificado de estar al corriente con la Seguridad Social.pdf', ref: 'v4' }] }],
  ['r5', 'Escrituras y poderes de representación', 'legal', 'fulfilled', 'd1', 13, 'Cl. 8.2', 'Las personas jurídicas acreditarán su capacidad de obrar mediante la escritura de constitución y los poderes del firmante, inscritos en el Registro Mercantil.', { evidence: [{ kind: 'vault', label: 'Escrituras y poderes de representación.pdf', ref: 'v1' }] }],
  ['r6', 'Solvencia económica — volumen anual de negocio', 'financial', 'fulfilled', 'd1', 17, 'Cl. 10.1', 'El volumen anual de negocios en el ámbito del contrato, referido al mejor de los tres últimos ejercicios disponibles, deberá ser al menos de 1.800.000 euros.', { critical: true, evidence: [{ kind: 'company', label: 'Facturación 4,2 M€ (2025)' }, { kind: 'vault', label: 'Cuentas anuales 2025.pdf', ref: 'v5' }] }],
  ['r7', 'Seguro de responsabilidad civil ≥ 600.000 €', 'financial', 'missing', 'd1', 18, 'Cl. 10.2', 'Los licitadores deberán disponer de un seguro de responsabilidad civil profesional con una cobertura mínima de 600.000 euros por siniestro, vigente durante toda la duración del contrato.', { critical: true, ask: 'Tu póliza actual cubre 500.000 € por siniestro y el pliego exige 600.000 €. Sube una póliza actualizada o el compromiso de la aseguradora de ampliar la cobertura antes de la adjudicación.', actions: ['Upload document', 'Mark as resolved'], evidence: [{ kind: 'vault', label: 'Póliza de responsabilidad civil profesional.pdf — 500.000 €', ref: 'v6' }] }],
  ['r8', 'Acreditación de experiencia previa', 'experience', 'needs_info', 'd1', 19, 'Cl. 10.3', 'El licitador deberá acreditar al menos 3 proyectos similares ejecutados en los últimos 5 años, cada uno con un importe anual mínimo de 450.000 euros.', { critical: true, ask: 'Hemos encontrado 2 proyectos en tu perfil de empresa que pueden servir (Escuelas del Vallès y Comedor Poblenou). ¿Tienes otro proyecto similar?', actions: ['Add project', 'Skip'], evidence: [{ kind: 'company', label: 'Red de comedores escolares — 1,1 M€ / año', ref: 'pp1' }, { kind: 'company', label: 'Comedor de campus corporativo — 780.000 € / año', ref: 'pp3' }] }],
  ['r9', 'Certificados de buena ejecución', 'experience', 'needs_info', 'd1', 19, 'Cl. 10.3', 'Los servicios se acreditarán mediante certificados expedidos o visados por el órgano competente cuando el destinatario sea una entidad del sector público.', { critical: true, ask: 'El contrato de centros de día de Badalona (620.000 € / año) podría contar como tercer proyecto, pero no hay certificado de buena ejecución guardado. Súbelo o solicítalo al cliente.', actions: ['Upload document', 'Skip'], evidence: [{ kind: 'vault', label: 'Certificado de buena ejecución — Escuelas del Vallès.pdf', ref: 'v9' }, { kind: 'vault', label: 'Certificado de buena ejecución — Comedor Poblenou.pdf', ref: 'v10' }] }],
  ['r10', 'Declaración sobre grupo empresarial', 'administrative', 'fulfilled', 'd3', 7, 'Anexo I, parte II', 'Los licitadores que pertenezcan a un grupo empresarial declararán las empresas del grupo que concurran a este procedimiento.', { evidence: [{ kind: 'company', label: 'Sin empresas del grupo (perfil de empresa)' }] }],
  ['r11', 'Declaración del plan de igualdad', 'legal', 'fulfilled', 'd1', 21, 'Cl. 11.4', 'Las empresas de cincuenta o más trabajadores declararán que han elaborado y registrado un plan de igualdad.', { evidence: [{ kind: 'vault', label: 'Registro del plan de igualdad.pdf', ref: 'v12' }] }],
  ['r12', 'Declaración de subcontratación', 'administrative', 'fulfilled', 'd1', 22, 'Cl. 12', 'Los licitadores indicarán en su oferta la parte del contrato que tengan previsto subcontratar, su importe y la identidad de los subcontratistas.', { evidence: [{ kind: 'company', label: 'No se prevé subcontratar' }] }],
  ['r13', 'Compromiso de adscripción de medios', 'administrative', 'fulfilled', 'd1', 20, 'Cl. 10.5', 'Los licitadores se comprometerán a dedicar a la ejecución del contrato los medios personales y materiales descritos en el pliego de prescripciones técnicas.', { evidence: [{ kind: 'company', label: 'Cocina central, 14 vehículos, equipo clave' }] }],
  ['r14', 'Plan de prevención de riesgos laborales', 'legal', 'missing', 'd12', 6, 'Modelo de contrato, cl. 14', 'El contratista entregará su plan de prevención de riesgos laborales y la documentación de coordinación de actividades empresariales antes del inicio del servicio.', { ask: 'No hemos encontrado ningún plan de prevención de riesgos laborales en tus documentos. Súbelo y PROPO lo añadirá al paquete.', actions: ['Upload document'] }],
  ['r15', 'Firma electrónica cualificada', 'format', 'needs_info', 'd1', 24, 'Cl. 14.2', 'Todos los documentos de cada sobre se firmarán con firma electrónica cualificada del representante legal del licitador.', { ask: '¿Quién firmará los sobres? Confirma que el representante legal tiene un certificado de firma electrónica cualificada en vigor.', actions: ['Assign signer', 'Skip'] }],
  ['r16', 'Servicio a 38 centros municipales', 'technical', 'fulfilled', 'd2', 6, 'PPT 2.1', 'El servicio comprende la elaboración y el transporte de comidas a los 38 centros relacionados en el anexo V, con un volumen estimado de 1.050.000 comidas anuales.', { evidence: [{ kind: 'company', label: 'Capacidad actual: 6.500 comidas/día' }] }],
  ['r17', 'Cocina central a menos de 40 km', 'technical', 'fulfilled', 'd2', 11, 'PPT 3.2', 'Las comidas se elaborarán en una cocina central situada a no más de 40 km de la ciudad, garantizando un tiempo máximo de transporte de 45 minutos a cualquier centro.', { evidence: [{ kind: 'company', label: 'Cocina central en L’Hospitalet (8 km)' }] }],
  ['r18', 'Transporte en línea fría con registro de temperatura', 'technical', 'fulfilled', 'd2', 18, 'PPT 4.3', 'El transporte se realizará en vehículos refrigerados con registro continuo de temperatura, manteniendo las comidas refrigeradas entre 0 °C y 4 °C.', { evidence: [{ kind: 'company', label: 'Capacidad: comidas escolares en línea fría' }] }],
  ['r19', 'Menús firmados por dietista-nutricionista', 'technical', 'fulfilled', 'd6', 3, 'Anexo IV, 1.2', 'Los menús mensuales serán elaborados y firmados por un dietista-nutricionista colegiado y se entregarán a los servicios municipales con 15 días de antelación.', { evidence: [{ kind: 'company', label: 'Laia Serra, dietista-nutricionista', ref: 't2' }] }],
  ['r20', 'Menús adaptados', 'technical', 'fulfilled', 'd6', 9, 'Anexo IV, 3.1', 'El contratista ofrecerá menús adaptados para comensales con alergias o intolerancias alimentarias, así como por motivos éticos o religiosos, sin coste adicional.', { evidence: [{ kind: 'company', label: 'Capacidad: menús adaptados' }] }],
  ['r21', 'Protocolo de gestión de alérgenos', 'technical', 'fulfilled', 'd11', 2, 'Anexo IX, 1', 'El contratista aplicará un protocolo de gestión de alérgenos conforme al Reglamento (UE) n.º 1169/2011 en recepción, almacenamiento, elaboración, etiquetado y servicio.', { evidence: [{ kind: 'vault', label: 'Propuesta — Escuelas del Vallès 2022 (adjudicada).pdf', ref: 'v13' }] }],
  ['r22', 'Plan APPCC específico del servicio', 'technical', 'fulfilled', 'd9', 4, 'Anexo VII, 2', 'El licitador describirá el sistema APPCC que aplicará a este servicio, identificando los puntos de control crítico desde la recepción hasta el servicio.', { evidence: [{ kind: 'company', label: 'Núria Vidal, responsable de calidad y seguridad alimentaria', ref: 't4' }] }],
  ['r23', 'Certificación ISO 22000 o equivalente', 'certification', 'missing', 'd1', 20, 'Cl. 10.4', 'Los licitadores dispondrán de una certificación de gestión de la seguridad alimentaria conforme a ISO 22000 o norma equivalente (FSSC 22000, IFS Food o BRCGS).', { critical: true, ask: 'Tus documentos incluyen ISO 9001 e ISO 14001, pero ninguna certificación de seguridad alimentaria. ¿Tienes FSSC 22000, IFS o BRCGS? Si es así, sube el certificado.', actions: ['Upload document', 'Add certification'] }],
  ['r24', 'Mínimo un 30 % de producto ecológico o de proximidad', 'technical', 'needs_info', 'd10', 3, 'Anexo VIII, 2.1', 'Al menos el 30 % de los alimentos adquiridos, medido en coste, procederá de producción ecológica o de productores situados a menos de 100 km.', { ask: '¿Qué porcentaje de tus compras actuales es ecológico o de productores a menos de 100 km? PROPO no estimará este dato.', actions: ['Add information', 'Skip'] }],
  ['r25', 'Plan de reducción del desperdicio alimentario', 'technical', 'fulfilled', 'd10', 6, 'Anexo VIII, 4', 'El licitador presentará un plan de reducción del desperdicio alimentario que incluya la medición periódica de restos en plato y medidas correctoras.', { evidence: [{ kind: 'company', label: 'Programa de desperdicio del comedor Poblenou', ref: 'pp3' }] }],
  ['r26', 'Subrogación de 64 trabajadores', 'team', 'fulfilled', 'd8', 1, 'Anexo VI', 'El nuevo contratista subrogará a los 64 trabajadores relacionados en este anexo en las condiciones establecidas en el convenio colectivo aplicable.', { evidence: [{ kind: 'company', label: 'Compromiso incluido en la organización del servicio' }] }],
  ['r27', 'Coordinador del servicio (≥ 5 años)', 'team', 'fulfilled', 'd2', 24, 'PPT 6.1', 'El contratista designará un coordinador del servicio con al menos cinco años de experiencia en restauración colectiva, que será el interlocutor único.', { evidence: [{ kind: 'company', label: 'Marc Puig — 12 años', ref: 't1' }] }],
  ['r28', 'Formación: 20 h por trabajador y año', 'team', 'fulfilled', 'd2', 26, 'PPT 6.4', 'El contratista garantizará al menos 20 horas anuales de formación por trabajador en seguridad alimentaria, alérgenos e higiene.', { evidence: [{ kind: 'company', label: 'Plan de formación (biblioteca de plantillas)' }] }],
  ['r29', 'Respuesta a incidencias en 2 horas', 'technical', 'fulfilled', 'd2', 31, 'PPT 7.2', 'En caso de incidencia que afecte al servicio, el contratista servirá comidas de sustitución en un plazo máximo de dos horas.', { evidence: [{ kind: 'company', label: 'Capacidad de producción de respaldo' }] }],
  ['r30', 'Informe mensual del servicio', 'technical', 'fulfilled', 'd2', 33, 'PPT 8.1', 'El contratista presentará un informe mensual con las comidas servidas por centro, incidencias, resultados de satisfacción e indicadores de desperdicio.', {}],
  ['r31', 'Auditorías internas trimestrales', 'technical', 'fulfilled', 'd2', 34, 'PPT 8.3', 'El contratista realizará auditorías internas de calidad trimestrales y pondrá los resultados a disposición de los servicios municipales.', { evidence: [{ kind: 'vault', label: 'Certificado ISO 9001.pdf', ref: 'v7' }] }],
  ['r32', 'Plan de implantación en 15 días', 'technical', 'fulfilled', 'd2', 37, 'PPT 9.1', 'El licitador presentará un plan de puesta en marcha que garantice el pleno funcionamiento en un plazo de 15 días desde la firma del contrato.', {}],
  ['r33', 'Vehículos de reparto de bajas emisiones', 'technical', 'needs_info', 'd10', 8, 'Anexo VIII, 5.2', 'Los vehículos adscritos al servicio dispondrán del distintivo ambiental ECO o CERO de la Dirección General de Tráfico.', { ask: '¿Cuántos de tus 14 vehículos de reparto tienen distintivo ECO o CERO?', actions: ['Add information', 'Skip'] }],
  ['r34', 'Sin plásticos de un solo uso', 'technical', 'fulfilled', 'd10', 9, 'Anexo VIII, 6', 'Las comidas se entregarán en envases reutilizables o compostables. No se admiten envases de plástico de un solo uso.', {}],
  ['r35', 'Cláusula social (2 % de la plantilla)', 'team', 'needs_info', 'd1', 41, 'Cl. 23.2', 'Al menos el 2 % del personal adscrito al contrato procederá de programas de inserción social o laboral.', { ask: '¿Cuántas personas contratadas a través de programas de inserción se asignarán a este contrato?', actions: ['Add information', 'Skip'] }],
  ['r36', 'Memoria técnica: máx. 40 páginas, Arial 11', 'format', 'fulfilled', 'd1', 25, 'Cl. 15.2', 'La memoria técnica no podrá superar las 40 páginas, en letra Arial 11 con interlineado 1,15. Las páginas que excedan este límite no serán valoradas.', {}],
  ['r37', 'Estructura en tres sobres (A, B y C)', 'format', 'fulfilled', 'd1', 24, 'Cl. 14.1', 'Las ofertas se presentarán en tres sobres: A (documentación administrativa), B (criterios sujetos a juicio de valor) y C (criterios evaluables mediante fórmulas).', {}],
  ['r38', 'Ninguna información de precio en el sobre B', 'format', 'fulfilled', 'd1', 25, 'Cl. 14.4', 'La inclusión en el sobre B de cualquier información que permita conocer la oferta económica supondrá la exclusión del licitador.', { critical: true }],
  ['r39', 'Oferta económica según modelo del anexo II', 'financial', 'missing', 'd4', 1, 'Anexo II', 'La oferta económica se ajustará al modelo del anexo II, indicando el precio unitario por tipo de menú, IVA excluido, con el IVA desglosado.', { critical: true, ask: 'Los precios los fija siempre tu equipo. Introduce los precios unitarios en el modelo del anexo II y aprueba la oferta económica.', actions: ['Open financial offer'] }],
  ['r40', 'Precio unitario máximo de 6,85 € por menú', 'financial', 'needs_info', 'd1', 8, 'Cl. 4.2', 'El precio unitario máximo por menú estándar es de 6,85 euros, IVA excluido. Las ofertas que superen este importe serán excluidas.', { critical: true, ask: 'Confirma que tu precio unitario del menú estándar no superará 6,85 € IVA excluido.', actions: ['Confirm', 'Skip'] }],
  ['r41', 'Validez de la oferta de 3 meses', 'legal', 'fulfilled', 'd1', 26, 'Cl. 16', 'Los licitadores quedarán obligados por su oferta durante un plazo de tres meses desde la apertura de los sobres.', {}],
  ['r42', 'Presentación electrónica antes del plazo', 'format', 'fulfilled', 'd14', 2, 'Anuncio, apartado 8', 'Las ofertas se presentarán exclusivamente a través de la plataforma electrónica de contratación antes de las 14:00 h de la fecha límite.', {}],
  ['r43', 'Cumplimiento del convenio colectivo del sector', 'legal', 'fulfilled', 'd1', 40, 'Cl. 23.1', 'El contratista cumplirá las condiciones salariales del convenio colectivo aplicable del sector de la restauración colectiva.', {}],
];

function buildRequirements(list: R[], docNameFn: (id: string) => string): Requirement[] {
  return list.map(([id, title, category, status, doc, page, clause, quote, extra]) => ({
    id, title, text: quote, category, mandatory: true,
    critical: extra?.critical ?? ['financial', 'experience', 'certification', 'legal'].includes(category),
    status, source: { docId: doc, docName: docNameFn(doc), page, clause, quote, verified: true },
    evidence: [], confidence: status === 'fulfilled' ? 0.94 : 0.9, ...extra,
  }));
}

const CRIT: [string, string, string, number, Criterion['kind'], Criterion['coverage'], string[], string[], string[], number, string][] = [
  ['k1', 'Propuesta técnica', 'Organización del servicio y plan de personal', 16, 'judgement', 'strong', ['s2', 's6'], ['Personal por centro con coordinador y suplentes', 'Calendario diario de producción y reparto', 'Subrogación de los 64 trabajadores explicada'], [], 3, 'Organización del servicio, recursos humanos por centro y mecanismos de coordinación: hasta 16 puntos.'],
  ['k2', 'Propuesta técnica', 'Calidad de los menús y diseño nutricional', 14, 'judgement', 'strong', ['s3'], ['Rotación estacional de 4 semanas firmada por dietista', 'Menús adaptados sin coste adicional', 'Raciones por grupo de edad'], [], 3, 'Calidad, variedad y equilibrio nutricional de los menús propuestos: hasta 14 puntos.'],
  ['k3', 'Propuesta técnica', 'Seguridad alimentaria y gestión de alérgenos', 10, 'judgement', 'partial', ['s4'], ['Puntos de control crítico APPCC descritos', 'Protocolo de alérgenos según Reglamento (UE) 1169/2011'], ['Falta certificado ISO 22000 o equivalente'], 4, 'Sistema de seguridad alimentaria, plan APPCC y gestión de alérgenos: hasta 10 puntos.'],
  ['k4', 'Precio', 'Oferta económica', 30, 'formula', 'n/a', [], ['Se valora por fórmula en el sobre C', 'El precio lo fija y aprueba tu equipo'], ['Oferta económica pendiente de aprobar'], 5, 'Oferta económica: hasta 30 puntos, según la fórmula P = 30 × (oferta más baja / oferta valorada).'],
  ['k5', 'Experiencia', 'Contratos similares', 12, 'judgement', 'partial', ['s1', 's6'], ['2 contratos similares acreditados con certificado'], ['El tercer proyecto necesita certificado'], 6, 'Contratos similares adicionales al mínimo de solvencia: hasta 12 puntos.'],
  ['k6', 'Experiencia', 'Cualificación del equipo', 8, 'judgement', 'strong', ['s6'], ['Coordinador con 12 años de experiencia', 'Dietista colegiada y responsable de calidad identificadas'], [], 6, 'Cualificación y experiencia del personal clave adscrito: hasta 8 puntos.'],
  ['k7', 'Sostenibilidad', 'Producto ecológico y de proximidad', 6, 'judgement', 'weak', ['s8'], ['Red de proveedores locales descrita'], ['Falta el porcentaje de compra ecológica o de proximidad'], 7, 'Porcentaje de producto ecológico o de proximidad por encima del mínimo del 30 %: hasta 6 puntos.'],
  ['k8', 'Sostenibilidad', 'Reducción del desperdicio alimentario', 4, 'judgement', 'strong', ['s8'], ['Metodología de medición de restos en plato', 'Resultados del programa del comedor Poblenou'], [], 7, 'Plan de prevención y medición del desperdicio alimentario: hasta 4 puntos.'],
];

const cite = (marker: string, doc: string, page: number, quote?: string): { marker: string; kind: 'tender'; label: string; docId: string; page: number; quote?: string } => ({ marker, kind: 'tender', label: `${docName(doc)} — p. ${page}`, docId: doc, page, quote });
const ccomp = (marker: string, label: string) => ({ marker, kind: 'company' as const, label });

const SECTIONS: Section[] = [
  {
    id: 's1', title: 'Resumen ejecutivo', guidance: 'Resumen inicial de la memoria técnica (sobre B).', status: 'ai_generated', confidence: 0.88, criteria: ['k1', 'k5'], pageBudget: 2, generatedBy: 'sample', missing: [],
    content: `Mesa Viva Catering propone elaborar y transportar alrededor de 1.050.000 comidas al año a los 38 centros municipales relacionados en el anexo V [S1], desde su cocina central de L’Hospitalet de Llobregat, a 8 km de la ciudad [S2].

Nuestra propuesta se basa en tres compromisos: menús que cumplen los requisitos nutricionales del anexo IV y están firmados por una dietista-nutricionista colegiada [S3]; un modelo logístico en línea fría que mantiene las comidas entre 0 °C y 4 °C con registro continuo de temperatura [S4]; y un plan de implantación que garantiza el pleno funcionamiento en 15 días desde la firma, incluida la subrogación de los 64 trabajadores actuales.

En los últimos cinco años hemos gestionado servicios similares para escuelas y comedores de empresa, entre ellos una red de 21 escuelas con 4.300 alumnos diarios [S5].`,
    citations: [cite('S1', 'd2', 6), cite('S2', 'd2', 11), cite('S3', 'd6', 3), cite('S4', 'd2', 18), ccomp('S5', 'Perfil de empresa — Red de comedores escolares (2022–2025)')],
  },
  {
    id: 's2', title: 'Organización del servicio y plan de personal', guidance: 'Se valora en el criterio «Organización del servicio y plan de personal» (16 pts).', status: 'approved', confidence: 0.93, criteria: ['k1'], pageBudget: 8, generatedBy: 'sample', missing: [],
    content: `El servicio se organizará en tres turnos de producción en la cocina central y 38 equipos de servicio, uno por centro, dirigidos por un coordinador del servicio dedicado que será el interlocutor único con los servicios municipales [S1].

La producción se realiza de 06:00 a 10:30 y las comidas refrigeradas salen en cuatro rutas de reparto planificadas para que ningún centro quede a más de 45 minutos de la cocina [S2]. Cada equipo se dimensiona según los volúmenes del anexo V, con una bolsa de seis suplentes para cubrir ausencias sin afectar al servicio.

Los 64 trabajadores del anexo VI se subrogarán conforme al convenio colectivo aplicable [S3]. Mantendrán sus centros, antigüedad y condiciones, y recibirán formación en nuestros procedimientos durante las dos primeras semanas.`,
    citations: [cite('S1', 'd2', 24), cite('S2', 'd2', 11), cite('S3', 'd8', 1)],
  },
  {
    id: 's3', title: 'Diseño de menús y calidad nutricional', guidance: 'Se valora en el criterio «Calidad de los menús y diseño nutricional» (14 pts).', status: 'approved', confidence: 0.91, criteria: ['k2'], pageBudget: 6, generatedBy: 'sample', missing: [],
    content: `Los menús siguen una rotación estacional de cuatro semanas diseñada y firmada por nuestra dietista-nutricionista colegiada, Laia Serra, y se entregan a los servicios municipales con 15 días de antelación [S1][S2].

Los menús adaptados para alergias, intolerancias y motivos éticos o religiosos se elaboran sin coste adicional en una línea de producción segregada y con etiquetado individual [S3]. Las raciones se definen por grupo de edad según las tablas de referencia del anexo IV.`,
    citations: [cite('S1', 'd6', 3), ccomp('S2', 'Equipo — Laia Serra, dietista-nutricionista'), cite('S3', 'd6', 9)],
  },
  {
    id: 's4', title: 'Seguridad alimentaria, APPCC y alérgenos', guidance: 'Se valora en el criterio «Seguridad alimentaria y gestión de alérgenos» (10 pts).', status: 'reviewed', confidence: 0.9, criteria: ['k3'], pageBudget: 5, generatedBy: 'sample', missing: ['Certificación de seguridad alimentaria (ISO 22000 o equivalente)'],
    content: `Nuestro sistema APPCC para este servicio identifica los puntos de control crítico desde la recepción de mercancía hasta el servicio en cada centro, con vigilancia, acciones correctoras y verificación documentadas [S1]. La responsable de calidad y seguridad alimentaria, Núria Vidal, es la encargada del plan y de las auditorías internas trimestrales.

La gestión de alérgenos sigue el Reglamento (UE) n.º 1169/2011 en recepción, almacenamiento, elaboración, etiquetado y servicio [S2].

[Información requerida: certificación de seguridad alimentaria — número y vigencia del certificado ISO 22000, FSSC 22000, IFS Food o BRCGS]`,
    citations: [cite('S1', 'd9', 4), cite('S2', 'd11', 2)],
  },
  {
    id: 's5', title: 'Logística y transporte en línea fría', guidance: 'Apoya el criterio «Organización del servicio» y el apartado 4 del PPT.', status: 'ai_generated', confidence: 0.92, criteria: ['k1'], pageBudget: 5, generatedBy: 'sample', missing: [],
    content: `Las comidas se transportan en vehículos refrigerados con registro continuo de temperatura, manteniéndolas entre 0 °C y 4 °C desde la cocina hasta cada centro [S1]. Los datos de temperatura se guardan por ruta y pueden compartirse con los servicios municipales cuando lo soliciten.

Cuatro rutas diarias cubren los 38 centros con un tiempo máximo de transporte de 45 minutos [S2]. Si una incidencia afecta al servicio, se envían comidas de sustitución desde la cocina central en un máximo de dos horas [S3].`,
    citations: [cite('S1', 'd2', 18), cite('S2', 'd2', 11), cite('S3', 'd2', 31)],
  },
  {
    id: 's6', title: 'Equipo, formación y experiencia', guidance: 'Se valora en «Cualificación del equipo» (8 pts) y «Contratos similares» (12 pts).', status: 'approved', confidence: 0.9, criteria: ['k5', 'k6'], pageBudget: 5, generatedBy: 'sample', missing: [],
    content: `El servicio estará dirigido por Marc Puig, director de operaciones con 12 años de experiencia en restauración colectiva, lo que cumple el requisito de un coordinador con al menos cinco años de experiencia [S1][S2]. Le apoyan una dietista colegiada, un jefe de cocina con 15 años de experiencia y una responsable de calidad y seguridad alimentaria.

Todo el personal adscrito al contrato recibirá al menos 20 horas anuales de formación en seguridad alimentaria, alérgenos e higiene [S3].`,
    citations: [cite('S1', 'd2', 24), ccomp('S2', 'Equipo — Marc Puig, 12 años'), cite('S3', 'd2', 26)],
  },
  {
    id: 's7', title: 'Gestión de la calidad y seguimiento', guidance: 'Apoya el apartado 8 del PPT (informes y auditorías).', status: 'approved', confidence: 0.92, criteria: ['k1'], pageBudget: 3, generatedBy: 'sample', missing: [],
    content: `Nuestro sistema de gestión de la calidad está certificado según ISO 9001:2015 [S1]. Para este contrato realizaremos auditorías internas trimestrales y compartiremos los resultados con los servicios municipales [S2], y presentaremos un informe mensual con las comidas servidas por centro, incidencias, resultados de satisfacción e indicadores de desperdicio [S3].`,
    citations: [ccomp('S1', 'Certificación — ISO 9001:2015, vigente hasta mayo de 2027'), cite('S2', 'd2', 34), cite('S3', 'd2', 33)],
  },
  {
    id: 's8', title: 'Sostenibilidad: compras y desperdicio', guidance: 'Se valora en «Producto ecológico y de proximidad» (6 pts) y «Reducción del desperdicio» (4 pts).', status: 'ai_generated', confidence: 0.74, criteria: ['k7', 'k8'], pageBudget: 4, generatedBy: 'sample', missing: ['Porcentaje de compra ecológica o de proximidad', 'Número de vehículos ECO o CERO'],
    content: `Cumpliremos y trataremos de superar el requisito de que al menos el 30 % de las compras de alimentos, medido en coste, proceda de producción ecológica o de productores a menos de 100 km [S1]. Nuestro porcentaje actual es [Información requerida: porcentaje de compra ecológica o de proximidad].

Nuestro plan de desperdicio mide los restos en plato cada mes en cada centro y aplica medidas correctoras en menús y raciones [S2], con la metodología que ya usamos en nuestro comedor de campus corporativo [S3]. El reparto se hace con [Información requerida: número de vehículos con distintivo ECO o CERO] vehículos de bajas emisiones [S4], y todas las comidas se entregan en envases reutilizables o compostables.`,
    citations: [cite('S1', 'd10', 3), cite('S2', 'd10', 6), ccomp('S3', 'Perfil de empresa — Comedor de campus corporativo'), cite('S4', 'd10', 8)],
  },
  { id: 's9', title: 'Plan de implantación y transición', guidance: 'Exigido por el PPT 9.1: pleno funcionamiento en 15 días.', status: 'not_started', confidence: null, criteria: ['k1'], pageBudget: 3, missing: [], content: '', citations: [] },
  { id: 's10', title: 'Mejoras ofertadas', guidance: 'Mejoras opcionales valoradas dentro de los criterios técnicos.', status: 'not_started', confidence: null, criteria: ['k2', 'k8'], pageBudget: 2, missing: [], content: '', citations: [] },
];

function excerptsFor(docId: string, reqs: Requirement[], crits: Criterion[], extra: [string, number, string][] = []): Record<number, string> {
  const out: Record<number, string> = {};
  const add = (page: number, clause: string | undefined, text: string) => {
    const block = (clause ? `${clause}\n` : '') + text;
    out[page] = out[page] ? `${out[page]}\n\n${block}` : block;
  };
  reqs.filter((r) => r.source.docId === docId).forEach((r) => add(r.source.page, r.source.clause, r.text));
  crits.filter((c) => c.source.docId === docId).forEach((c) => add(c.source.page, c.source.clause, c.description));
  extra.filter((e) => e[0] === docId).forEach((e) => add(e[1], undefined, e[2]));
  return out;
}

export function buildSampleProject(): Project {
  const requirements = buildRequirements(REQS, docName);
  const criteria: Criterion[] = CRIT.map(([id, group, name, points, kind, coverage, addressedBy, howAddressed, gaps, page, desc]) => ({
    id, group, name, points, kind, coverage, addressedBy, howAddressed, gaps, description: desc,
    source: { docId: 'd5', docName: docName('d5'), page, clause: `Anexo III, ${page - 2}`, quote: desc, verified: true },
  }));
  const extra: [string, number, string][] = [
    ['d2', 6, 'El anexo V relaciona los 38 centros: 29 escuelas, 6 centros de día de personas mayores y 3 escuelas infantiles municipales.'],
    ['d14', 1, 'Órgano de contratación: Consorcio Municipal de Servicios de Barcelona (ejemplo ficticio). Procedimiento: abierto. CPV 55523100-3 — Servicios de comidas para escuelas. Valor estimado: 7.190.000 € IVA excluido. Duración: 2 años, prorrogable 2 años más.'],
  ];
  const docs: SourceDoc[] = DOCS.map(([id, name, kind, pages, sizeKb]) => ({
    id, name, kind, pages, sizeKb, status: 'excerpt',
    note: 'Proyecto de ejemplo: solo se incluyen las páginas citadas.',
    excerpts: excerptsFor(id, requirements, criteria, extra),
  }));
  const deadline = addDays(18);
  return {
    id: 'p_sample', name: 'Servicio de restauración municipal de Barcelona', organization: 'Consorcio Municipal de Servicios de Barcelona (ficticio)',
    type: 'public_tender', createdAt: addDays(-6), isSample: true, stage: 'active', docs,
    analysis: {
      mode: 'sample',
      summary: 'Procedimiento abierto para la elaboración y el transporte en línea fría de unas 1.050.000 comidas al año a 38 centros municipales (escuelas, centros de día y escuelas infantiles). Contrato de dos años prorrogable dos más. Adjudicación: 70 puntos por criterios de juicio de valor (propuesta técnica, experiencia y sostenibilidad) y 30 por fórmula de precio. Principales riesgos de exclusión: información de precio en el sobre B, precio unitario superior a 6,85 € y falta de documentación de solvencia.',
      authority: 'Consorcio Municipal de Servicios de Barcelona (ficticio)',
      reference: 'CONS-2026-0147 (ejemplo)',
      cpv: '55523100-3 — Servicios de comidas para escuelas',
      budget: '7.190.000 € IVA excl. (valor estimado)',
      duration: '2 años + 2 de prórroga',
      deadline,
      deadlines: [
        { label: 'Fin del plazo de preguntas', date: addDays(8), source: { docId: 'd14', docName: docName('d14'), page: 2 } },
        { label: 'Fin de presentación de ofertas — 14:00', date: deadline, source: { docId: 'd14', docName: docName('d14'), page: 2 } },
        { label: 'Apertura del sobre B', date: addDays(25), source: { docId: 'd14', docName: docName('d14'), page: 2 } },
      ],
      documentsAnalyzed: 14, pages: 287, requiredDocuments: 21,
      pageLimit: 'Memoria técnica: 40 páginas, Arial 11, interlineado 1,15',
      exclusionRisks: [
        { text: 'Cualquier información de precio en el sobre B supone la exclusión.', source: { docId: 'd1', docName: docName('d1'), page: 25, clause: 'Cl. 14.4' } },
        { text: 'Un precio unitario superior a 6,85 € IVA excl. por menú estándar supone la exclusión.', source: { docId: 'd1', docName: docName('d1'), page: 8, clause: 'Cl. 4.2' } },
        { text: 'Las páginas que superen el límite de 40 no se valoran.', source: { docId: 'd1', docName: docName('d1'), page: 25, clause: 'Cl. 15.2' } },
      ],
      warnings: [],
    },
    requirements, criteria, sections: SECTIONS.map((s) => ({ ...s, updatedAt: addDays(-1) })),
    manualChecks: { signature: false, financialApproved: false },
    markedReady: null,
    chat: [],
    activity: [
      { at: addDays(-6), text: '14 documentos de la licitación subidos' },
      { at: addDays(-6), text: 'Análisis completado: 43 requisitos y 8 criterios de adjudicación' },
      { at: addDays(-5), text: 'Datos de empresa cruzados con 32 requisitos' },
      { at: addDays(-3), text: 'Secciones 2, 3, 6 y 7 aprobadas por Anna Roig' },
      { at: addDays(-1), text: 'Resumen ejecutivo regenerado' },
    ],
    aiActionsUsed: 38,
  };
}

// ---------------------------------------------------------------------------
// Proyectos de ejemplo más ligeros para el dashboard
// ---------------------------------------------------------------------------

function lightProject(opts: {
  id: string; name: string; org: string; type: Project['type']; deadlineDays: number; createdDays: number;
  statuses: ReqStatus[]; sectionStatuses: Section['status'][]; markedReady?: boolean; checks?: Record<string, boolean>;
}): Project {
  const docs: SourceDoc[] = [
    { id: 'x1', name: 'Pliego de prescripciones técnicas.pdf', kind: 'pdf', pages: 46, sizeKb: 1500, status: 'excerpt', note: 'Proyecto de ejemplo: solo páginas citadas.' },
    { id: 'x2', name: 'Pliego de cláusulas administrativas.pdf', kind: 'pdf', pages: 38, sizeKb: 1200, status: 'excerpt', note: 'Proyecto de ejemplo: solo páginas citadas.' },
    { id: 'x3', name: 'Modelo de oferta económica.xlsx', kind: 'xlsx', pages: 2, sizeKb: 40, status: 'excerpt', note: 'Proyecto de ejemplo: solo páginas citadas.' },
  ];
  const base = REQS.slice(0, opts.statuses.length).map((r, i) => {
    const copy = [...r] as R;
    copy[3] = opts.statuses[i];
    copy[4] = i % 3 === 0 ? 'x2' : 'x1';
    copy[0] = `${opts.id}_r${i + 1}`;
    return copy;
  });
  const nameOf = (id: string) => docs.find((d) => d.id === id)!.name;
  const requirements = buildRequirements(base, nameOf).map((r) => r.status === 'fulfilled' ? { ...r, ask: undefined, actions: undefined } : r);
  docs[0].excerpts = excerptsFor('x1', requirements, []);
  docs[1].excerpts = excerptsFor('x2', requirements, []);
  const titles = ['Resumen ejecutivo', 'Comprensión de los requisitos', 'Enfoque técnico', 'Metodología', 'Equipo', 'Calendario', 'Gestión de la calidad', 'Sostenibilidad'];
  const sections: Section[] = opts.sectionStatuses.map((st, i) => ({
    id: `${opts.id}_s${i + 1}`, title: titles[i], guidance: 'Sección derivada de la estructura del pliego.', status: st,
    confidence: st === 'not_started' ? null : 0.86 + (i % 3) * 0.03, criteria: [], missing: [], generatedBy: 'sample',
    content: st === 'not_started' ? '' : `${titles[i]} para ${opts.name}. Esta sección de ejemplo ilustra una sección redactada; abre el proyecto «Servicio de restauración municipal de Barcelona» para ver un ejemplo completo con fuentes.`,
    citations: [],
  }));
  const deadline = addDays(opts.deadlineDays);
  return {
    id: opts.id, name: opts.name, organization: opts.org, type: opts.type, createdAt: addDays(-opts.createdDays), isSample: true, stage: 'active', docs,
    analysis: {
      mode: 'sample', summary: `${opts.type === 'private_rfp' ? 'Concurso privado' : 'Licitación'} de ejemplo para ilustrar el dashboard.`, authority: opts.org, reference: 'Ejemplo',
      deadline, deadlines: [{ label: 'Fin de presentación de ofertas', date: deadline }], documentsAnalyzed: 3, pages: 86, requiredDocuments: 12,
      exclusionRisks: [], warnings: [],
    },
    requirements, criteria: [], sections, manualChecks: opts.checks ?? { signature: false, financialApproved: false },
    markedReady: opts.markedReady ? addDays(-1) : null, chat: [], activity: [{ at: addDays(-opts.createdDays), text: 'Documentos de la licitación analizados' }], aiActionsUsed: 20,
  };
}

export function buildSampleProjects(): Project[] {
  const F: ReqStatus = 'fulfilled';
  return [
    buildSampleProject(),
    lightProject({ id: 'p_hospital', name: 'Restauración hospitalaria', org: 'Consorci Sanitari del Maresme (ficticio)', type: 'public_tender', deadlineDays: 7, createdDays: 14,
      statuses: [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, 'needs_info'], sectionStatuses: ['approved', 'approved', 'approved', 'approved', 'approved', 'approved', 'reviewed', 'approved'],
      checks: { signature: true, financialApproved: true } }),
    lightProject({ id: 'p_events', name: 'Catering para eventos municipales', org: 'Ajuntament de la Costa del Garraf (ficticio)', type: 'public_tender', deadlineDays: 23, createdDays: 3,
      statuses: [F, F, F, 'needs_info', F, 'missing', F, 'needs_info', F, F, 'needs_info', F, 'missing', F, F, 'needs_info', F, F], sectionStatuses: ['ai_generated', 'approved', 'ai_generated', 'draft', 'not_started', 'not_started'] }),
    lightProject({ id: 'p_campus', name: 'Comedor de campus tecnológico', org: 'Northwind Oficinas (ficticio)', type: 'private_rfp', deadlineDays: 4, createdDays: 20,
      statuses: [F, F, F, F, F, F, F, F, F, F, F, F, F, F], sectionStatuses: ['approved', 'approved', 'approved', 'approved', 'approved'], markedReady: true, checks: { signature: true, financialApproved: true } }),
  ];
}

export function sampleNotifications(): Notification[] {
  return [
    { id: 'n1', at: addDays(0), kind: 'info_needed', title: '7 requisitos necesitan información', body: 'El servicio de restauración municipal de Barcelona espera tus datos de experiencia, seguro y sostenibilidad.', projectId: 'p_sample', read: false },
    { id: 'n2', at: addDays(-1), kind: 'deadline', title: 'Restauración hospitalaria cierra en 7 días', body: 'Queda 1 requisito y 1 sección por revisar.', projectId: 'p_hospital', read: false },
    { id: 'n3', at: addDays(-1), kind: 'ai_done', title: 'Resumen ejecutivo regenerado', body: 'Revisa el nuevo borrador del resumen ejecutivo antes de aprobarlo.', projectId: 'p_sample', read: false },
    { id: 'n4', at: addDays(-4), kind: 'system', title: 'El certificado ISO 14001 caduca en noviembre', body: 'Sube el certificado renovado para que tus próximas propuestas estén completas.', read: true },
  ];
}

export function sampleTemplates(): Template[] {
  return [
    { id: 'tp1', name: 'Presentación de la empresa — estándar', kind: 'section', source: 'approved', usedCount: 9, updatedAt: addDays(-12),
      body: 'Mesa Viva Catering S.L. es una empresa de restauración colectiva con sede en L’Hospitalet de Llobregat que da servicio a escuelas, centros de día y comedores de empresa del área metropolitana de Barcelona desde una cocina central de 1.400 m².' },
    { id: 'tp2', name: 'Gestión de la calidad (ISO 9001)', kind: 'section', source: 'approved', usedCount: 7, updatedAt: addDays(-30),
      body: 'Nuestro sistema de gestión de la calidad está certificado según ISO 9001:2015. Realizamos auditorías internas trimestrales, hacemos seguimiento de las no conformidades hasta su cierre e informamos mensualmente de los indicadores del servicio.' },
    { id: 'tp3', name: 'Plan de formación del personal', kind: 'answer', source: 'approved', usedCount: 5, updatedAt: addDays(-45),
      body: 'Todo el personal recibe al menos 20 horas anuales de formación en seguridad alimentaria, gestión de alérgenos, higiene y prevención de riesgos laborales, impartida por nuestro equipo de calidad y formadores externos acreditados.' },
    { id: 'tp4', name: 'Licitación pública — estructura de catering', kind: 'structure', source: 'user', usedCount: 4, updatedAt: addDays(-60),
      body: '1. Resumen ejecutivo\n2. Organización del servicio\n3. Diseño de menús\n4. Seguridad alimentaria y alérgenos\n5. Logística\n6. Equipo y formación\n7. Gestión de la calidad\n8. Sostenibilidad\n9. Plan de implantación\n10. Mejoras' },
    { id: 'tp5', name: 'Compromiso de respuesta a incidencias', kind: 'answer', source: 'user', usedCount: 3, updatedAt: addDays(-20),
      body: 'Ante cualquier incidencia que afecte al servicio, enviamos comidas de sustitución desde la cocina central en un máximo de dos horas e informamos por escrito al cliente el mismo día.' },
  ];
}

export const SAMPLE_CREATED = nowIso();
