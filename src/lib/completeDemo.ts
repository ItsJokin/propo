// «Demo completa»: el mismo espacio de ejemplo (Mesa Viva Catering, empresa ficticia) pero con toda la
// documentación que faltaba ya subida y las preguntas de PROPO respondidas, para ver el resto del flujo:
// propuesta aprobada, cumplimiento superado y paquete de presentación con archivos.
// Todos los documentos se generan aquí como PDF de ejemplo con la marca «EJEMPLO FICTICIO — SIN VALIDEZ».
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import type { AppState, Evidence, VaultDoc, Project, InterviewMsg } from './types';
import { demoWorkspace } from './store';
import { putFile, putPages } from './storage';
import { addDays, nowIso } from './util';

type DocSpec = { id: string; name: string; cat: VaultDoc['category']; expires?: string; lines: string[] };

// Documentos nuevos que completan lo que faltaba en el proyecto de ejemplo.
const NEW_DOCS: DocSpec[] = [
  { id: 'v14', name: 'Certificado ISO 22000 — Seguridad alimentaria.pdf', cat: 'certificate', expires: '2028-03-31', lines: ['Certificado de sistema de gestión de la seguridad alimentaria', 'Norma: ISO 22000:2018', 'Titular: Mesa Viva Catering S.L. (empresa ficticia)', 'Alcance: elaboración en cocina central y transporte en línea fría de comidas para colectividades', 'Vigente hasta: 31/03/2028', 'Entidad certificadora: Certificadora de ejemplo'] },
  { id: 'v15', name: 'Certificado de buena ejecución — Residencias Sabadell.pdf', cat: 'experience', lines: ['Certificado de buena ejecución', 'Servicio: restauración de residencias universitarias (desayunos y cenas, 420 residentes)', 'Periodo: 2019–2022', 'El servicio se ha prestado de forma satisfactoria y conforme al contrato.', 'Emitido por: Residències Universitàries de Sabadell (ejemplo)'] },
  { id: 'v16', name: 'Plan de prevención de riesgos laborales.pdf', cat: 'corporate', lines: ['Plan de prevención de riesgos laborales', 'Empresa: Mesa Viva Catering S.L. (ficticia)', 'Modalidad preventiva: servicio de prevención ajeno (ejemplo)', 'Incluye: evaluación de riesgos de cocina central y reparto, planificación de la actividad preventiva, formación e información, coordinación de actividades empresariales.'] },
  { id: 'v17', name: 'Compromiso de inserción laboral — 2 % de la plantilla.pdf', cat: 'corporate', lines: ['Compromiso de contratación de personas en programas de inserción', 'Mesa Viva Catering S.L. (ficticia) se compromete a que al menos el 2 % del personal adscrito al contrato proceda de programas de inserción social o laboral.', 'Entidad colaboradora: fundación de inserción de ejemplo'] },
  { id: 'v18', name: 'Flota de reparto — fichas técnicas y distintivos ambientales.pdf', cat: 'other', lines: ['Relación de vehículos adscritos al servicio', '4 furgonetas eléctricas refrigeradas — distintivo CERO', '2 furgonetas híbridas refrigeradas — distintivo ECO', 'Todas con registro continuo de temperatura.'] },
  { id: 'v19', name: 'Informe de compras ecológicas y de proximidad 2025.pdf', cat: 'other', lines: ['Informe anual de compras de alimentos 2025', 'Producción ecológica o de proximidad (< 100 km): 38 % del coste total de alimentos', 'Proveedores locales: 23 productores del área metropolitana y comarcas vecinas', 'Datos de ejemplo de una empresa ficticia.'] },
];

// Texto de ejemplo para los documentos que ya estaban en la biblioteca (sin archivo).
const EXISTING_LINES: Record<string, string[]> = {
  v1: ['Escritura de constitución y poderes de representación', 'Representante legal: persona de ejemplo'],
  v2: ['Certificado de inscripción en el Registro Oficial de Licitadores y Empresas Clasificadas (ROLECE)', 'Situación: inscrita (ejemplo)'],
  v3: ['Certificado de estar al corriente de las obligaciones tributarias', 'Resultado: positivo (ejemplo)'],
  v4: ['Certificado de estar al corriente con la Seguridad Social', 'Resultado: positivo (ejemplo)'],
  v5: ['Cuentas anuales del ejercicio 2025', 'Volumen anual de negocio: 4,2 M€ (dato de ejemplo)'],
  v6: ['Póliza de responsabilidad civil profesional', 'Cobertura por siniestro: 600.000 €', 'Vigente durante toda la duración del contrato (ejemplo)'],
  v7: ['Certificado ISO 9001:2015 — Gestión de la calidad', 'Vigente hasta: 31/05/2027'],
  v8: ['Certificado ISO 14001:2015 — Gestión ambiental', 'Vigente hasta: 15/11/2026'],
  v9: ['Certificado de buena ejecución', 'Red de comedores escolares — 21 escuelas, 2022–2025'],
  v10: ['Certificado de buena ejecución', 'Comedor de empresa Poblenou'],
  v11: ['Currículums del equipo clave', 'Coordinador del servicio, dietista-nutricionista, jefe de cocina, responsable de calidad, logística'],
  v12: ['Registro del plan de igualdad', 'Inscrito en REGCON (ejemplo)'],
  v13: ['Propuesta técnica — Escuelas del Vallès 2022 (adjudicada)'],
};

async function samplePdf(title: string, lines: string[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${title} (ejemplo)`); doc.setProducer('PROPO — demo'); doc.setCreator('PROPO');
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595, 842]);
  page.drawText('EJEMPLO FICTICIO — SIN VALIDEZ', { x: 90, y: 300, size: 40, font: bold, color: rgb(0.85, 0.3, 0.3), opacity: 0.16, rotate: degrees(35) });
  page.drawRectangle({ x: 40, y: 770, width: 515, height: 34, color: rgb(1, 0.94, 0.86) });
  page.drawText('Documento de ejemplo generado por PROPO para la demo. Empresa ficticia. No es un documento real.', { x: 52, y: 783, size: 9, font, color: rgb(0.55, 0.3, 0.05) });
  page.drawText(title.replace(/\.pdf$/i, '').replace(/[—–]/g, '-'), { x: 52, y: 730, size: 16, font: bold, color: rgb(0.07, 0.08, 0.1) });
  let y = 700;
  for (const l of lines) {
    const words = l.replace(/[—–]/g, '-').replace(/[«»]/g, '"').replace(/€/g, 'EUR').replace(/≥/g, '>=').split(' ');
    let cur = '';
    const flush = () => { page.drawText(cur, { x: 52, y, size: 11, font, color: rgb(0.15, 0.16, 0.2) }); y -= 17; cur = ''; };
    for (const w of words) { const t = cur ? `${cur} ${w}` : w; if (font.widthOfTextAtSize(t, 11) > 490 && cur) { flush(); cur = w; } else cur = t; }
    if (cur) flush();
    y -= 6;
  }
  return doc.save();
}

async function storeDoc(key: string, name: string, lines: string[]) {
  const bytes = await samplePdf(name, lines);
  await putFile(key, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer);
  await putPages(key, [`${name}\nDOCUMENTO DE EJEMPLO — empresa ficticia, sin validez.\n${lines.join('\n')}`]);
  return Math.max(1, Math.round(bytes.byteLength / 1024));
}

const V = (ref: string, label: string): Evidence => ({ kind: 'vault', ref, label });
const C = (label: string): Evidence => ({ kind: 'company', label });
const U = (label: string): Evidence => ({ kind: 'user', label });

// Cómo queda acreditado cada requisito que estaba abierto.
const RESOLVE: Record<string, Evidence[]> = {
  r7: [V('v6', 'Póliza de responsabilidad civil profesional — 600.000 € por siniestro')],
  r8: [C('Red de comedores escolares — 21 escuelas (2022–2025)'), C('Comedor de empresa Poblenou'), C('Residencias universitarias de Sabadell (2019–2022)')],
  r9: [V('v9', 'Certificado de buena ejecución — Escuelas del Vallès'), V('v10', 'Certificado de buena ejecución — Comedor Poblenou'), V('v15', 'Certificado de buena ejecución — Residencias Sabadell')],
  r14: [V('v16', 'Plan de prevención de riesgos laborales')],
  r15: [U('Firmará el representante legal con firma electrónica cualificada (confirmado por tu equipo)')],
  r23: [V('v14', 'Certificado ISO 22000:2018 — vigente hasta 03/2028')],
  r24: [V('v19', 'Informe de compras 2025: 38 % ecológico o de proximidad')],
  r33: [V('v18', 'Flota: 4 furgonetas eléctricas (CERO) y 2 híbridas (ECO)')],
  r35: [V('v17', 'Compromiso de inserción laboral — 2 % de la plantilla')],
  r39: [U('Oferta económica preparada y aprobada por tu equipo según el modelo del anexo II (fuera de PROPO)')],
  r40: [U('Tu equipo confirma que el precio unitario ofertado no supera 6,85 € IVA excl.')],
  r1: [V('v2', 'DEUC preparado con los datos del ROLECE')],
  r2: [V('v2', 'Certificado de inscripción en el ROLECE')],
  r3: [V('v3', 'Certificado de la AEAT')],
  r4: [V('v4', 'Certificado de la Seguridad Social')],
  r5: [V('v1', 'Escrituras y poderes de representación')],
  r6: [V('v5', 'Cuentas anuales 2025 — 4,2 M€')],
  r11: [V('v12', 'Registro del plan de igualdad')],
};

function completeProject(p: Project) {
  for (const r of p.requirements) {
    const ev = RESOLVE[r.id];
    if (ev) r.evidence = ev;
    r.status = 'fulfilled';
    r.confidence = Math.max(r.confidence, 0.93);
    delete r.ask; delete r.actions; delete r.uncertain;
  }
  for (const c of p.criteria) { if (c.kind === 'judgement') { c.coverage = 'strong'; c.gaps = []; } }
  const k7 = p.criteria.find((c) => c.id === 'k7');
  if (k7) k7.howAddressed = ['38 % de compra ecológica o de proximidad acreditado (informe 2025)', 'Red de 23 productores locales'];
  const k3 = p.criteria.find((c) => c.id === 'k3');
  if (k3) k3.howAddressed = [...k3.howAddressed, 'Certificación ISO 22000 aportada'];
  const k5 = p.criteria.find((c) => c.id === 'k5');
  if (k5) k5.howAddressed = ['3 contratos similares acreditados con certificado de buena ejecución'];

  const comp = (marker: string, label: string) => ({ marker, kind: 'company' as const, label });
  const tender = (marker: string, docId: string, page: number) => ({ marker, kind: 'tender' as const, label: `${p.docs.find((d) => d.id === docId)?.name ?? docId}, p. ${page}`, docId, page });
  for (const s of p.sections) {
    if (s.id === 's4') {
      s.content = s.content.replace(/\[Información requerida:[^\]]*\]/, 'Mesa Viva dispone de un sistema de gestión de la seguridad alimentaria certificado según ISO 22000:2018, vigente hasta marzo de 2028, que cubre la elaboración en cocina central y el transporte en línea fría [S3].');
      s.citations = [...s.citations, comp('S3', 'Certificación — ISO 22000:2018, vigente hasta 03/2028 (documento de ejemplo)')];
    }
    if (s.id === 's8') {
      s.content = s.content
        .replace(/\[Información requerida: porcentaje[^\]]*\]/, 'del 38 % en 2025, con 23 productores locales [S5]')
        .replace(/\[Información requerida: número de vehículos[^\]]*\]/, '6 vehículos refrigerados: 4 eléctricos con distintivo CERO y 2 híbridos con distintivo ECO, es decir,')
        .replace(/vehículos de bajas emisiones \[S4\]/, 'todos de bajas emisiones [S4][S6]');
      s.citations = [...s.citations, comp('S5', 'Documentos — Informe de compras ecológicas y de proximidad 2025'), comp('S6', 'Documentos — Flota de reparto y distintivos ambientales')];
    }
    if (s.id === 's9') {
      s.content = `El servicio estará en pleno funcionamiento en los 15 días siguientes al inicio del contrato, como exige el pliego [S1]. La implantación se organiza en tres fases.

Días 1 a 5: reunión de arranque con los servicios municipales, validación de los volúmenes por centro del anexo V [S2] y entrevistas con los 64 trabajadores que se subrogan para confirmar centros, turnos y condiciones [S3].

Días 6 a 10: formación de todo el personal en nuestros procedimientos de APPCC, alérgenos y registro de temperaturas, y prueba de las cuatro rutas de reparto con vehículos cargados.

Días 11 a 15: servicio completo con doble supervisión del coordinador y de la responsable de calidad, y primer informe de seguimiento a los servicios municipales [S4].`;
      s.citations = [tender('S1', 'd2', 37), tender('S2', 'd2', 6), tender('S3', 'd8', 1), tender('S4', 'd2', 33)];
      s.confidence = 0.9; s.generatedBy = 'sample';
    }
    if (s.id === 's10') {
      s.content = `Sin coste adicional para el Consorcio, ofrecemos tres mejoras ligadas a los criterios de calidad de los menús y de reducción del desperdicio.

Menús adaptados para alergias, intolerancias y motivos éticos o religiosos con etiquetado individual por comensal, ampliando lo que exige el anexo IV [S1].

Un taller trimestral de alimentación saludable en cada escuela, impartido por nuestra dietista-nutricionista.

Medición mensual de los restos en plato por centro con informe al Consorcio y medidas correctoras en menús y raciones, como plantea el anexo VIII [S2].`;
      s.citations = [tender('S1', 'd6', 9), tender('S2', 'd10', 6)];
      s.confidence = 0.88; s.generatedBy = 'sample';
    }
    s.missing = [];
    s.status = 'approved';
    s.updatedAt = addDays(-1);
  }

  const at = (d: number) => addDays(d);
  const msgs: InterviewMsg[] = [];
  const add = (role: 'propo' | 'user', text: string, d: number, qid?: string, src?: [string, number]) => msgs.push({ id: `dm${msgs.length}`, role, text, at: at(d), qid, ...(src ? { source: { docId: src[0], page: src[1], docName: p.docs.find((x) => x.id === src[0])?.name } } : {}) });
  add('propo', 'He leído los 14 documentos de la licitación y los he cruzado con tu perfil de empresa. Me faltan unos pocos datos; te los pregunto uno a uno.', -5);
  add('propo', 'El pliego pide un seguro de responsabilidad civil de al menos 600.000 € por siniestro. Tu póliza cubre 500.000 €. ¿Puedes subir la póliza actualizada?', -5, 'req:r7', ['d1', 18]);
  add('user', 'Adjunto: Póliza de responsabilidad civil profesional — 600.000 €.pdf', -5, 'req:r7');
  add('propo', 'Perfecto, la cobertura cumple. La he guardado en Documentos y la he vinculado al requisito.', -5);
  add('propo', 'El pliego pide ISO 22000 o equivalente (FSSC 22000, IFS Food o BRCGS). ¿La tenéis?', -5, 'req:r23', ['d1', 20]);
  add('user', 'Adjunto: Certificado ISO 22000 — Seguridad alimentaria.pdf', -5, 'req:r23');
  add('propo', 'Gracias. La he añadido a tus certificaciones y a la sección de seguridad alimentaria.', -5);
  add('propo', 'Se exige un 30 % de compra ecológica o de proximidad. ¿Cuál es vuestro porcentaje actual?', -4, 'req:r24', ['d10', 3]);
  add('user', '38 % en 2025. Adjunto el informe de compras.', -4, 'req:r24');
  add('propo', '¿Cuántos vehículos de reparto tienen distintivo ECO o CERO?', -4, 'req:r33', ['d10', 8]);
  add('user', '6: 4 eléctricos (CERO) y 2 híbridos (ECO). Subo las fichas.', -4, 'req:r33');
  add('propo', 'Falta el plan de prevención de riesgos laborales y el compromiso de inserción del 2 % de la plantilla.', -4, 'req:r14', ['d12', 6]);
  add('user', 'Adjuntos los dos documentos.', -4, 'req:r14');
  add('propo', 'Para la experiencia necesito 3 contratos similares con certificado de buena ejecución. Tengo dos; ¿tienes el tercero?', -4, 'req:r9', ['d1', 19]);
  add('user', 'Adjunto: Certificado de buena ejecución — Residencias Sabadell.pdf', -4, 'req:r9');
  add('propo', 'Todo listo: he redactado las secciones que faltaban con tus respuestas. Revísalas y apruébalas: nada se da por bueno sin una persona.', -3);
  add('user', 'Revisadas y aprobadas. Oferta económica aprobada por el equipo y firmante confirmado.', -1);
  p.interview = { msgs, answered: ['req:r7', 'req:r23', 'req:r24', 'req:r33', 'req:r14', 'req:r35', 'req:r9', 'req:r8', 'req:r15', 'req:r40'], drafted: true };
  p.manualChecks = { signature: true, financialApproved: true };
  p.markedReady = null; // el último paso (marcar como lista y descargar) lo hace la persona en la demo
  p.activity = [
    { at: at(-1), text: 'Oferta económica aprobada por Anna Roig (fuera de PROPO) y firmante confirmado' },
    { at: at(-1), text: '10 de 10 secciones aprobadas' },
    { at: at(-3), text: 'Secciones «Plan de implantación» y «Mejoras ofertadas» redactadas' },
    { at: at(-4), text: '6 documentos añadidos: ISO 22000, póliza de 600.000 €, plan de PRL, inserción laboral, flota e informe de compras' },
    { at: at(-5), text: 'Conversación con PROPO completada: 10 preguntas respondidas' },
    ...p.activity,
  ];
}

/** Espacio de ejemplo con toda la documentación subida y la propuesta lista para el último paso. */
export async function completeDemoWorkspace(): Promise<AppState> {
  const s = demoWorkspace();
  s.demo = 'complete';
  s.company.capabilities = [...s.company.capabilities, '38 % de compra ecológica o de proximidad (2025)', 'Flota de reparto: 4 furgonetas eléctricas (CERO) y 2 híbridas (ECO), refrigeradas'];
  s.certifications.push({ id: 'c4', name: 'ISO 22000:2018 — Seguridad alimentaria', issuer: 'Certificadora de ejemplo', validUntil: '2028-03-31', category: 'industry' });
  s.pastProjects.forEach((pp) => { pp.hasCertificate = true; });

  const v6 = s.vault.find((v) => v.id === 'v6');
  if (v6) { v6.name = 'Póliza de responsabilidad civil profesional — 600.000 €.pdf'; v6.uploadedAt = addDays(-5); v6.expiresAt = addDays(400); }
  for (const d of NEW_DOCS) s.vault.unshift({ id: d.id, name: d.name, category: d.cat, uploadedAt: addDays(-4), expiresAt: d.expires, pages: 1, sizeKb: 0, usedIn: 1, hasFile: true });
  // Cada documento lleva un PDF de ejemplo de verdad, así el paquete final incluye los archivos.
  await Promise.all(s.vault.map(async (v) => {
    const key = `vault:${v.id}`;
    const lines = NEW_DOCS.find((d) => d.id === v.id)?.lines ?? EXISTING_LINES[v.id] ?? [v.name];
    v.sizeKb = await storeDoc(key, v.name, lines);
    v.pages = 1; v.hasFile = true; v.textKey = key;
  }));

  const p = s.projects.find((x) => x.id === 'p_sample');
  if (p) completeProject(p);
  s.notifications.unshift({ id: 'n_complete', at: nowIso(), kind: 'ai_done', title: 'Propuesta lista para el último paso', body: 'Servicio de restauración municipal de Barcelona: toda la documentación está subida y las 10 secciones aprobadas. Marca la propuesta como lista y descarga el paquete.', read: false, projectId: 'p_sample' });
  return s;
}
