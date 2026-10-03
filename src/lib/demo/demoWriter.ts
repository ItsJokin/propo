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
  const caps = k.company.capabilities.slice(0, 4);
  const projects = k.pastProjects.slice(0, 3);
  const certs = k.certifications.map((c) => c.name.split(' — ')[0]);
  const team = k.team.slice(0, 4);
  const desc = (k.company.description || '').replace(/\.$/, '');
  const paras: string[] = [];
  const missing: string[] = [];
  const need = (what: string) => { missing.push(what); return `[Información requerida: ${what}]`; };

  const experience = () => projects.length
    ? `Entre nuestros contratos recientes destacan:\n${projects.map((p) => `- ${p.title}, para ${p.client || 'cliente del sector'}${p.years ? ` (${p.years})` : ''}${forItem(p.title)}`).join('\n')}`
    : need('contratos anteriores parecidos a este');
  const teamLines = () => team.length
    ? team.map((m) => `- **${m.name}**, ${lower(m.role)}${m.years ? `, con ${m.years} años de experiencia` : ''}${m.qualifications ? `. ${m.qualifications.replace(/\.$/, '')}` : ''}${forItem(m.name)}`).join('\n')
    : need('personas clave que se adscribirán al contrato');
  const answers = (max: number, from: Requirement[] = reqs) => from.slice(0, max).map((r) => {
    const ev = r.evidence[0]?.label;
    return `- **${r.title.replace(/…$/, '')}**${forReq(r)}: ${r.status === 'fulfilled' && ev ? `lo acreditamos con: ${ev.replace(/.$/, "")}.` : r.status === 'fulfilled' ? 'lo cumplimos y lo acreditamos en la documentación adjunta.' : 'asumimos este compromiso desde el inicio del contrato y lo detallamos en el plan de trabajo.'}`;
  }).join('\n');
  // Requisitos determinantes del pliego: primero los que ya acredita la memoria de empresa.
  const key = project.requirements.filter((r) => r.mandatory && r.category !== 'format').sort((a, b) => Number(b.status === 'fulfilled' && !!b.evidence.length) - Number(a.status === 'fulfilled' && !!a.evidence.length));
  const tender = project.name.length > 60 || /…$/.test(project.name) ? 'esta licitación' : `«${project.name}»`;

  switch (kindOf(section.title)) {
    case 'summary':
      paras.push(`${co} presenta esta propuesta para ${tender}, convocada por ${buyer}.${desc ? ` ${desc}${mk(profile)}.` : ''}`);
      paras.push(`Nuestra oferta se apoya en tres pilares:\n- **Experiencia demostrable** en contratos de la misma naturaleza${projects[0] ? `, como «${projects[0].title}»${forItem(projects[0].title)}` : ''}.\n- **Un equipo estable y cualificado**${team[0] ? `, coordinado por ${team[0].name}${forItem(team[0].name)}` : ''}.\n- **Sistemas de gestión certificados**${certs.length ? ` (${list(certs.slice(0, 3))})` : ''} que garantizan un servicio controlado y medible.`);
      paras.push(`Las secciones siguientes responden, punto por punto, a los requisitos del pliego y a los criterios con los que ${buyer} valorará las ofertas.`);
      break;
    case 'company':
      paras.push(desc ? `${co}: ${lower(desc)}${mk(profile)}.` : need('descripción de la empresa'));
      if (k.company.employees || caps.length) paras.push(`${k.company.employees ? `Contamos con una plantilla de ${k.company.employees} personas. ` : ''}${caps.length ? `Nuestras principales capacidades son: ${list(caps.map(lower))}.` : ''}`);
      paras.push(experience());
      if (certs.length) paras.push(`Trabajamos con sistemas de gestión certificados: ${list(certs)}${forItem(certs[0])}.`);
      break;
    case 'understanding':
      paras.push(`Hemos analizado los pliegos de ${tender} y entendemos que ${buyer} necesita un adjudicatario que garantice la continuidad del servicio, cumpla los requisitos sin excepciones y aporte control y transparencia durante toda la ejecución.`);
      paras.push(key.length ? `Estos son los requisitos que consideramos determinantes y cómo los cubrimos:\n${answers(7, key)}` : need('requisitos clave del pliego'));
      break;
    case 'team':
      paras.push(`${co} adscribirá a este contrato un equipo con experiencia directa en servicios equivalentes, con funciones y responsables definidos desde el primer día.`);
      paras.push(teamLines());
      paras.push('El coordinador será el interlocutor único con el responsable del contrato. Todo el personal recibe formación anual, de la que se deja constancia, y las sustituciones se cubren con personal de la propia plantilla.');
      break;
    case 'schedule':
      paras.push(`Proponemos una implantación en cuatro fases, pensada para que ${buyer} no note el cambio de adjudicatario:`);
      paras.push('- **Semanas 1 y 2 — Planificación.** Reunión de arranque, revisión de centros y volúmenes, y plan de trabajo detallado.\n- **Semanas 3 y 4 — Preparación.** Asignación del equipo, formación específica y puesta a punto de medios y proveedores.\n- **Mes 2 — Arranque supervisado.** Inicio del servicio con presencia reforzada del coordinador y revisión semanal.\n- **Desde el mes 3 — Régimen normal.** Servicio estable, informe mensual y revisión trimestral con el responsable del contrato.');
      if (team[0]) paras.push(`${team[0].name} dirigirá la implantación y firmará el plan de trabajo definitivo${forItem(team[0].name)}.`);
      break;
    case 'quality':
      paras.push(`La calidad del servicio se gestiona con un sistema documentado y auditado${certs.length ? `, certificado en ${list(certs.slice(0, 3))}${forItem(certs[0])}` : ''}.`);
      paras.push('Para este contrato aplicaremos:\n- **Indicadores mensuales** acordados con el responsable del contrato, con objetivos y umbrales de alerta.\n- **Inspecciones internas** periódicas con acta y plan de acción.\n- **Gestión de incidencias** con respuesta en menos de 24 horas y registro de cada caso hasta su cierre.\n- **Informe mensual** con indicadores, incidencias y mejoras propuestas.');
      if (reqs.length) paras.push(`Requisitos del pliego relacionados:\n${answers(3)}`);
      break;
    case 'environment':
      paras.push(`${co} integra los criterios ambientales y sociales en la ejecución diaria del contrato${certs.some((c) => /14001/.test(c)) ? `, dentro de un sistema de gestión ambiental certificado ISO 14001${forItem('ISO 14001')}` : ''}.`);
      paras.push('Medidas que aplicaremos:\n- Reducción de residuos y separación en origen, con seguimiento mensual.\n- Compra de proximidad y proveedores con criterios de sostenibilidad.\n- Eliminación de plásticos de un solo uso y optimización de rutas y consumos.\n- Empleo estable, formación continua e igualdad de oportunidades en la plantilla adscrita.');
      break;
    case 'improvements':
      paras.push(`Además de cumplir íntegramente el pliego, ${co} ofrece las siguientes mejoras sin coste para ${buyer}:`);
      paras.push(`${caps.length ? caps.slice(0, 3).map((c) => `- ${c}, puesto a disposición de este contrato.`).join('\n') + '\n' : ''}- Panel de seguimiento en línea con los indicadores del servicio.\n- Reunión trimestral de revisión con propuestas de mejora documentadas.`);
      break;
    default:
      paras.push(`${co} plantea «${section.title}» a partir de su experiencia en contratos equivalentes${projects[0] ? `, como «${projects[0].title}»${forItem(projects[0].title)}` : ''}${mk(profile)}.`);
      paras.push('Nuestro método de trabajo se organiza en cuatro pasos:\n- **Planificar.** Definimos con el responsable del contrato objetivos, medios y calendario.\n- **Ejecutar.** Prestamos el servicio con procedimientos escritos y personal formado.\n- **Controlar.** Medimos el resultado con indicadores e inspecciones internas.\n- **Mejorar.** Revisamos los datos cada mes y proponemos ajustes.');
      if (caps.length) paras.push(`Para este contrato ponemos a disposición: ${list(caps.map(lower))}.`);
      if (reqs.length) paras.push(`Cómo respondemos a lo que pide el pliego en este apartado:\n${answers(4)}`);
      if (team[0]) paras.push(`La responsabilidad de este apartado recae en ${team[0].name}, ${lower(team[0].role)}${forItem(team[0].name)}.`);
  }

  const content = paras.join('\n\n');
  const used = new Set([...content.matchAll(/\[(S\d+)\]/g)].map((m) => m[1]));
  return {
    content, citations: citations.filter((c) => used.has(c.marker)), missing: [...new Set(missing)], confidence: missing.length ? 0.55 : 0.7, generatedBy: 'template',
    warnings: [`Borrador de demostración, redactado sin IA con la memoria de ${co}. Con la IA activada, PROPO escribe cada sección a medida del pliego.`],
  };
}
