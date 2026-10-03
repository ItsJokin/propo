// Demo sin IA: redacta cada sección con la memoria de la empresa de demostración (perfil, proyectos, equipo,
// certificaciones) y los requisitos del pliego, para enseñar cómo queda una propuesta completa.
// Los datos de la empresa salen de su memoria; el método de trabajo es un texto tipo. Con la IA activada este redactor no se usa.
import type { Citation, Project, Requirement, Section } from '../types';
import type { Knowledge } from '../pipeline/matching';
import type { GenOutput } from '../ai/engine';
import { normalize } from '../util';

type Kind = 'summary' | 'company' | 'understanding' | 'team' | 'schedule' | 'quality' | 'environment' | 'improvements' | 'approach';

function kindOf(title: string): Kind {
  const t = normalize(title);
  if (/resumen/.test(t)) return 'summary';
  if (/presentacion de la empresa|quienes somos|la empresa/.test(t)) return 'company';
  if (/comprension|requisitos/.test(t)) return 'understanding';
  if (/equipo|personal|medios humanos|organigrama/.test(t)) return 'team';
  if (/calendario|cronograma|plan de trabajo|implantacion|plazo/.test(t)) return 'schedule';
  if (/calidad|control|seguimiento/.test(t)) return 'quality';
  if (/ambient|sostenib|social|igualdad/.test(t)) return 'environment';
  if (/mejora/.test(t)) return 'improvements';
  return 'approach';
}

const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function demoSection(project: Project, section: Section, reqs: Requirement[], citations: Citation[], k: Knowledge): GenOutput {
  const co = k.company.legalName || 'La empresa';
  const company = citations.filter((c) => c.kind === 'company');
  const profile = company.find((c) => /descripción$/.test(c.label));
  const mk = (c?: Citation) => (c ? ` [${c.marker}]` : '');
  const forItem = (text: string) => mk(company.find((c) => c.label.includes(text)));
  const forReq = (r: Requirement) => mk(citations.find((c) => c.kind === 'tender' && c.docId === r.source.docId && c.page === r.source.page));
  const buyer = project.organization || 'el órgano de contratación';
  const caps = k.company.capabilities.slice(0, 5);
  const projects = k.pastProjects.slice(0, 3);
  const certs = k.certifications.map((c) => c.name.split(' — ')[0]);
  const team = k.team.slice(0, 5);
  const lead = team[0];
  const desc = (k.company.description || '').replace(/\.$/, '');
  const paras: string[] = [];
  const missing: string[] = [];
  const need = (what: string) => { missing.push(what); return `[Información requerida: ${what}]`; };

  const experience = () => projects.length
    ? `Entre nuestros contratos recientes destacan:\n${projects.map((p) => `- **${p.title}**, para ${p.client || 'cliente del sector'}${p.years ? ` (${p.years})` : ''}${p.description ? `. ${p.description.replace(/\.$/, '')}` : ''}${forItem(p.title)}`).join('\n')}`
    : need('contratos anteriores parecidos a este');
  const teamLines = () => team.length
    ? team.map((m) => `- **${m.name}**, ${lower(m.role)}${m.years ? `, con ${m.years} años de experiencia` : ''}${m.qualifications ? `. ${m.qualifications.replace(/\.$/, '')}` : ''}${forItem(m.name)}`).join('\n')
    : need('personas clave que se adscribirán al contrato');
  const answers = (max: number, from: Requirement[] = reqs) => from.slice(0, max).map((r) => {
    const ev = r.evidence[0]?.label;
    return `- **${r.title.replace(/…$/, '')}**${forReq(r)}: ${r.status === 'fulfilled' && ev ? `lo acreditamos con: ${ev.replace(/\.$/, '')}.` : r.status === 'fulfilled' ? 'lo cumplimos y lo acreditamos en la documentación adjunta.' : 'asumimos este compromiso desde el inicio del contrato y lo detallamos en el plan de trabajo.'}`;
  }).join('\n');
  // Requisitos determinantes del pliego: primero los que ya acredita la memoria de empresa.
  const key = project.requirements.filter((r) => r.mandatory && r.category !== 'format').sort((a, b) => Number(b.status === 'fulfilled' && !!b.evidence.length) - Number(a.status === 'fulfilled' && !!a.evidence.length));
  const tender = project.name.length > 60 || /…$/.test(project.name) ? 'esta licitación' : `«${project.name}»`;

  // Bloques comunes del método de trabajo.
  const risks = '**Gestión de riesgos.** Hemos identificado los riesgos habituales en contratos de este tipo y la respuesta prevista para cada uno:\n- Ausencias de personal: bolsa de sustitución con personal ya formado, activada en el mismo día.\n- Picos de demanda: planificación semanal con el responsable del contrato y refuerzos programados.\n- Fallo de un proveedor: doble proveedor homologado para los suministros críticos.\n- Interrupción del servicio: plan de contingencia con medios alternativos y aviso inmediato al órgano de contratación.';
  const comms = `**Comunicación con ${buyer}.** ${lead ? `${lead.name} será el interlocutor único` : 'Habrá un interlocutor único'} durante toda la ejecución. Proponemos una reunión de seguimiento mensual, un canal directo para incidencias con respuesta en menos de 24 horas y un informe mensual con indicadores, incidencias y propuestas de mejora.`;

  switch (kindOf(section.title)) {
    case 'summary':
      paras.push(`${co} presenta esta propuesta para ${tender}, convocada por ${buyer}.${desc ? ` ${desc}${mk(profile)}.` : ''}`);
      paras.push(`Nuestra oferta se apoya en tres pilares:\n- **Experiencia demostrable** en contratos de la misma naturaleza${projects[0] ? `, como «${projects[0].title}»${forItem(projects[0].title)}` : ''}.\n- **Un equipo estable y cualificado**${lead ? `, coordinado por ${lead.name}${forItem(lead.name)}` : ''}.\n- **Sistemas de gestión certificados**${certs.length ? ` (${list(certs.slice(0, 3))})` : ''} que garantizan un servicio controlado y medible.`);
      paras.push(`**Qué obtiene ${buyer}.**\n- Un arranque sin interrupciones, con un plan de implantación en cuatro fases y presencia reforzada durante las primeras semanas.\n- Un interlocutor único con capacidad de decisión y respuesta a las incidencias en menos de 24 horas.\n- Transparencia: indicadores acordados, informe mensual y revisión trimestral del servicio.\n- Cumplimiento íntegro del pliego, con la documentación acreditativa ya preparada.`);
      if (key.length) paras.push(`**Cumplimiento de los requisitos.** ${co} acredita ${key.filter((r) => r.status === 'fulfilled').length} de los ${key.length} requisitos obligatorios con la documentación de la empresa y asume expresamente el resto como compromisos de ejecución. El detalle figura en el apartado de comprensión de los requisitos y en los anexos.`);
      paras.push(`Las secciones siguientes responden, punto por punto, a los requisitos del pliego y a los criterios con los que ${buyer} valorará las ofertas.`);
      break;
    case 'company':
      paras.push(desc ? `${co}: ${lower(desc)}${mk(profile)}.` : need('descripción de la empresa'));
      if (k.company.employees || k.company.sectors.length) paras.push(`${k.company.employees ? `Contamos con una plantilla de ${k.company.employees} personas` : 'Contamos con una plantilla estable'}${k.company.sectors.length ? ` y trabajamos de forma habitual para ${list(k.company.sectors.map(lower))}` : ''}. Esa especialización nos permite conocer de primera mano las exigencias de los contratos públicos: plazos, control documental y continuidad del servicio.`);
      if (caps.length) paras.push(`**Capacidades.** Para este contrato ponemos a disposición:\n${caps.map((c) => `- ${c}.`).join('\n')}`);
      paras.push(`**Experiencia.** ${experience()}`);
      if (certs.length) paras.push(`**Sistemas de gestión.** Trabajamos con sistemas de gestión certificados: ${list(certs)}${forItem(certs[0])}. Se auditan cada año y cubren los procesos que intervienen en la ejecución de este contrato.`);
      if (team.length) paras.push(`**Equipo directivo.** La dirección del contrato recae en personas de la plantilla con experiencia directa en servicios equivalentes:\n${teamLines()}`);
      break;
    case 'understanding':
      paras.push(`Hemos analizado los pliegos de ${tender} y entendemos que ${buyer} necesita un adjudicatario que garantice la continuidad del servicio, cumpla los requisitos sin excepciones y aporte control y transparencia durante toda la ejecución.`);
      paras.push('De la lectura del pliego destacamos tres prioridades: la calidad sostenida del servicio, y no solo la del arranque; la trazabilidad de lo que se hace, con informes e indicadores; y la capacidad de respuesta ante incidencias.');
      paras.push(key.length ? `**Requisitos determinantes y cómo los cubrimos.**\n${answers(9, key)}` : need('requisitos clave del pliego'));
      paras.push('Ninguno de los requisitos del pliego queda sin respuesta en esta oferta. Los que dependen de la ejecución se recogen como compromisos expresos y se incorporan al plan de trabajo que se entregará en la reunión de arranque.');
      break;
    case 'team':
      paras.push(`${co} adscribirá a este contrato un equipo con experiencia directa en servicios equivalentes, con funciones y responsables definidos desde el primer día.`);
      paras.push(`**Personas clave.**\n${teamLines()}`);
      paras.push('**Organización.** El equipo se estructura en tres niveles: dirección del contrato, coordinación operativa y equipo de ejecución. El coordinador es el interlocutor único con el responsable del contrato y tiene capacidad para decidir sobre medios y prioridades.');
      paras.push('**Sustituciones y continuidad.** Las ausencias se cubren con personal de la propia plantilla, ya formado en el servicio. Cada puesto clave tiene un suplente designado y la sustitución se comunica al responsable del contrato.');
      paras.push('**Formación.** Todo el personal adscrito recibe formación inicial específica del contrato y un plan de formación anual, del que se deja constancia y se informa en el informe mensual.');
      break;
    case 'schedule':
      paras.push(`Proponemos una implantación en cuatro fases, pensada para que ${buyer} no note el cambio de adjudicatario:`);
      paras.push('- **Semanas 1 y 2 — Planificación.** Reunión de arranque, revisión de centros y volúmenes, y plan de trabajo detallado.\n- **Semanas 3 y 4 — Preparación.** Asignación del equipo, formación específica y puesta a punto de medios y proveedores.\n- **Mes 2 — Arranque supervisado.** Inicio del servicio con presencia reforzada del coordinador y revisión semanal.\n- **Desde el mes 3 — Régimen normal.** Servicio estable, informe mensual y revisión trimestral con el responsable del contrato.');
      paras.push('**Hitos y entregables.**\n- Acta de la reunión de arranque y plan de trabajo aprobado.\n- Relación nominal del equipo adscrito y plan de formación.\n- Primer informe mensual con la línea base de los indicadores.\n- Informe de cierre de la implantación al finalizar el segundo mes.');
      paras.push('**Seguimiento del plan.** El avance se revisa cada semana durante la implantación y cada mes en régimen normal. Cualquier desviación se comunica con una propuesta de corrección y un nuevo plazo.');
      if (lead) paras.push(`${lead.name} dirigirá la implantación y firmará el plan de trabajo definitivo${forItem(lead.name)}.`);
      break;
    case 'quality':
      paras.push(`La calidad del servicio se gestiona con un sistema documentado y auditado${certs.length ? `, certificado en ${list(certs.slice(0, 3))}${forItem(certs[0])}` : ''}.`);
      paras.push('**Controles que aplicaremos.**\n- **Indicadores mensuales** acordados con el responsable del contrato, con objetivos y umbrales de alerta.\n- **Inspecciones internas** periódicas con acta y plan de acción.\n- **Gestión de incidencias** con respuesta en menos de 24 horas y registro de cada caso hasta su cierre.\n- **Informe mensual** con indicadores, incidencias y mejoras propuestas.');
      paras.push('**Indicadores propuestos.**\n- Cumplimiento del programa de servicio: objetivo del 98 %.\n- Incidencias resueltas en plazo: objetivo del 95 %.\n- Satisfacción de los usuarios en encuesta semestral: objetivo de 8 sobre 10.\n- Personal con la formación anual completada: 100 %.');
      paras.push('**Auditoría y mejora continua.** Los resultados se revisan cada trimestre con el responsable del contrato. Cuando un indicador queda por debajo del umbral, se abre una acción correctiva con responsable y fecha, y se informa de su cierre.');
      if (reqs.length) paras.push(`**Requisitos del pliego relacionados.**\n${answers(4)}`);
      break;
    case 'environment':
      paras.push(`${co} integra los criterios ambientales y sociales en la ejecución diaria del contrato${certs.some((c) => /14001/.test(c)) ? `, dentro de un sistema de gestión ambiental certificado ISO 14001${forItem('ISO 14001')}` : ''}.`);
      paras.push('**Medidas ambientales.**\n- Reducción de residuos y separación en origen, con seguimiento mensual.\n- Compra de proximidad y proveedores con criterios de sostenibilidad.\n- Eliminación de plásticos de un solo uso.\n- Optimización de rutas y consumos de energía y agua.');
      paras.push('**Medidas sociales.**\n- Empleo estable y condiciones conforme al convenio colectivo de aplicación.\n- Igualdad de oportunidades entre mujeres y hombres en la plantilla adscrita.\n- Formación continua y prevención de riesgos laborales.\n- Colaboración con entidades de inserción laboral del territorio.');
      paras.push('**Seguimiento.** Los resultados de estas medidas se incluyen en el informe mensual, con datos comparables de un periodo a otro.');
      break;
    case 'improvements':
      paras.push(`Además de cumplir íntegramente el pliego, ${co} ofrece las siguientes mejoras sin coste para ${buyer}:`);
      paras.push(`${caps.length ? caps.slice(0, 3).map((c) => `- **${c}**, puesto a disposición de este contrato desde el primer día.`).join('\n') + '\n' : ''}- **Panel de seguimiento en línea** con los indicadores del servicio, accesible para el responsable del contrato.\n- **Reunión trimestral de revisión** con propuestas de mejora documentadas.\n- **Refuerzo en el arranque**: presencia adicional del coordinador durante el primer mes.`);
      paras.push('Todas las mejoras son verificables: cada una tiene un responsable, una fecha de puesta en marcha y un indicador que permite al órgano de contratación comprobar su cumplimiento.');
      break;
    default:
      paras.push(`${co} plantea «${section.title}» a partir de su experiencia en contratos equivalentes${projects[0] ? `, como «${projects[0].title}»${forItem(projects[0].title)}` : ''}${mk(profile)}.`);
      paras.push('**Método de trabajo.** Se organiza en cuatro pasos:\n- **Planificar.** Definimos con el responsable del contrato objetivos, medios y calendario.\n- **Ejecutar.** Prestamos el servicio con procedimientos escritos y personal formado.\n- **Controlar.** Medimos el resultado con indicadores e inspecciones internas.\n- **Mejorar.** Revisamos los datos cada mes y proponemos ajustes.');
      paras.push('**Organización del servicio.** El contrato se gestiona en tres niveles: dirección, coordinación operativa y equipo de ejecución. Cada tarea tiene un responsable y un procedimiento escrito, de modo que el servicio no depende de una sola persona.');
      if (caps.length) paras.push(`**Medios que ponemos a disposición.**\n${caps.map((c) => `- ${c}.`).join('\n')}`);
      if (reqs.length) paras.push(`**Respuesta a lo que pide el pliego en este apartado.**\n${answers(5)}`);
      paras.push(risks);
      paras.push(comms);
      if (lead) paras.push(`La responsabilidad de este apartado recae en ${lead.name}, ${lower(lead.role)}${forItem(lead.name)}.`);
  }

  const content = paras.join('\n\n');
  const used = new Set([...content.matchAll(/\[(S\d+)\]/g)].map((m) => m[1]));
  return {
    content, citations: citations.filter((c) => used.has(c.marker)), missing: [...new Set(missing)], confidence: missing.length ? 0.55 : 0.7, generatedBy: 'template',
    warnings: [`Borrador de demostración, redactado sin IA con la memoria de ${co}. Con la IA activada, PROPO escribe cada sección a medida del pliego.`],
  };
}
