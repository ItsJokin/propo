// Glosario de contratación pública en lenguaje llano. Sirve para explicar un requisito a quien no lo conoce,
// también sin IA: qué es, cómo se acredita y qué pasa si no se cumple.
import type { Requirement } from './types';
import { normalize } from './util';

export interface Term { id: string; name: string; match: RegExp; what: string; how: string; risk: string }

export const TERMS: Term[] = [
  { id: 'rc', name: 'Seguro de responsabilidad civil', match: /seguro|responsabilidad civil|poliza/,
    what: 'Es una póliza que cubre los daños que tu empresa pueda causar a terceros (personas o bienes) mientras ejecuta el contrato. El pliego fija un importe mínimo de cobertura.',
    how: 'Con la póliza o un certificado de la aseguradora donde consten el importe cubierto y la vigencia. Si tu cobertura es menor que la exigida, suele bastar un compromiso de ampliarla si resultas adjudicatario; compruébalo en el pliego.',
    risk: 'Sin la cobertura exigida no se puede formalizar el contrato.' },
  { id: 'solv-eco', name: 'Solvencia económica (volumen anual de negocio)', match: /solvencia econ|volumen (anual )?de negocio|facturacion/,
    what: 'El órgano de contratación quiere asegurarse de que tu empresa tiene tamaño suficiente para asumir el contrato. Lo mide con tu facturación: pide que, en el mejor de los tres últimos ejercicios, hayas facturado al menos una cantidad.',
    how: 'Con las cuentas anuales depositadas en el Registro Mercantil o, si no estás obligado a depositarlas, con los libros contables o una declaración del volumen de negocio.',
    risk: 'Si no llegas al mínimo, la oferta se excluye. Hay salidas: presentarte en unión temporal (UTE) con otra empresa o apoyarte en la solvencia de otra entidad que se comprometa a poner sus medios.' },
  { id: 'solv-tec', name: 'Solvencia técnica (experiencia en contratos similares)', match: /solvencia tecnica|experiencia|contratos similares|trabajos similares|servicios similares/,
    what: 'Tienes que demostrar que ya has hecho trabajos parecidos. Normalmente se pide una relación de los contratos similares de los últimos tres años (cinco en obras), con un importe mínimo anual.',
    how: 'Con una relación de contratos que indique importe, fechas y cliente, acompañada de certificados de buena ejecución firmados por esos clientes. Si el cliente es privado, vale su certificado o, en su defecto, una declaración tuya con documentos que la respalden.',
    risk: 'Sin la experiencia mínima acreditada, la oferta se excluye. Pide los certificados con tiempo: suelen tardar.' },
  { id: 'deuc', name: 'DEUC (Documento Europeo Único de Contratación)', match: /deuc|documento europeo|declaracion responsable/,
    what: 'Es una declaración responsable, en un formulario común en toda la UE, en la que afirmas que cumples los requisitos para contratar. Sustituye de momento a todos los documentos: solo quien va a ser adjudicatario tiene que aportarlos después.',
    how: 'Se rellena en el servicio web del DEUC (o en el modelo que facilite el pliego) y lo firma el representante legal. PROPO prepara un borrador de la declaración con los datos de tu empresa.',
    risk: 'Si falta o va sin firmar, te pedirán subsanarlo en un plazo corto, normalmente tres días. Si no lo subsanas, quedas excluido.' },
  { id: 'garantia', name: 'Garantía definitiva', match: /garantia definitiva|garantia/,
    what: 'Es un depósito que constituye solo la empresa adjudicataria para responder de la correcta ejecución del contrato. Lo habitual es el 5 % del precio de adjudicación, sin IVA. No hay que ponerla para presentarse.',
    how: 'Mediante aval bancario, seguro de caución o ingreso en efectivo. Se devuelve cuando termina el plazo de garantía y el contrato se ha cumplido bien.',
    risk: 'Si resultas adjudicatario y no la constituyes en plazo, pierdes la adjudicación.' },
  { id: 'corriente', name: 'Estar al corriente con Hacienda y la Seguridad Social', match: /hacienda|tributari|seguridad social|al corriente/,
    what: 'No puedes contratar con la Administración si tienes deudas pendientes con Hacienda o con la Seguridad Social.',
    how: 'Con dos certificados positivos: el de la Agencia Tributaria y el de la Tesorería General de la Seguridad Social. Se obtienen en línea con certificado digital y tienen una validez de seis meses.',
    risk: 'Tener deudas es una prohibición de contratar: no se puede adjudicar el contrato.' },
  { id: 'iso', name: 'Certificaciones (ISO y similares)', match: /iso ?\d|certificaci|emas|acreditaci/,
    what: 'Son certificados, emitidos por una entidad independiente, de que tu empresa trabaja con un sistema de gestión reconocido: de calidad (ISO 9001), ambiental (ISO 14001), de seguridad laboral (ISO 45001), etc.',
    how: 'Con el certificado en vigor emitido por una entidad acreditada. Cuando el pliego dice «o equivalente», puedes aportar otras pruebas de que aplicas medidas similares.',
    risk: 'Si es requisito de solvencia y no lo tienes ni acreditas algo equivalente, la oferta se excluye. Si es un criterio de valoración, simplemente no sumas esos puntos.' },
  { id: 'coordinador', name: 'Coordinador o responsable del servicio', match: /coordinador|responsable del (servicio|contrato)|interlocutor/,
    what: 'El pliego quiere una persona concreta de tu empresa al frente del contrato, que sea el contacto único con la Administración, a veces con una experiencia o titulación mínimas.',
    how: 'Indicando en la oferta quién será, con su currículum y, si se pide, sus títulos. Esa persona queda comprometida con el contrato.',
    risk: 'Si no cumple el perfil exigido, puedes perder puntos o quedar excluido, según lo trate el pliego.' },
  { id: 'formacion', name: 'Formación del personal', match: /formacion/,
    what: 'Es una obligación de ejecución: durante el contrato tendrás que formar al personal adscrito y poder demostrarlo.',
    how: 'En la oferta basta con comprometerse y describir el plan de formación. Durante el contrato se acredita con registros de asistencia y contenidos.',
    risk: 'No suele excluir la oferta, pero incumplirla durante la ejecución puede dar lugar a penalizaciones.' },
  { id: 'sobres', name: 'Sobres y secreto de la oferta económica', match: /sobre [abc]|sobres|informacion de precio|juicio de valor/,
    what: 'La oferta se presenta en archivos separados (sobres): documentación administrativa, memoria técnica y oferta económica. La mesa valora primero lo técnico sin conocer los precios.',
    how: 'Subiendo cada documento al sobre que le toca en la plataforma. PROPO revisa que la memoria técnica no contenga importes.',
    risk: 'Incluir cualquier dato del precio en el sobre técnico es causa de exclusión, sin posibilidad de subsanar.' },
  { id: 'presupuesto', name: 'Presupuesto base de licitación', match: /presupuesto (base|maximo)|precio maximo|superen/,
    what: 'Es el importe máximo que la Administración puede pagar por el contrato. Tu oferta económica tiene que ser igual o inferior.',
    how: 'No se acredita: se cumple presentando un precio que no lo supere.',
    risk: 'Una oferta por encima del presupuesto base se excluye automáticamente.' },
  { id: 'subrogacion', name: 'Subrogación de personal', match: /subroga/,
    what: 'Si el convenio colectivo lo establece, la empresa que gana el contrato debe asumir a los trabajadores que ya prestaban el servicio con el contratista anterior, respetando sus condiciones.',
    how: 'El pliego incluye la relación del personal a subrogar, con categorías, antigüedad y costes. Tenla en cuenta al calcular tu precio.',
    risk: 'No es opcional. Si no la has contado en tus costes, el contrato puede salirte a pérdidas.' },
  { id: 'igualdad', name: 'Plan de igualdad', match: /plan de igualdad|igualdad/,
    what: 'Las empresas de 50 o más trabajadores están obligadas a tener un plan de igualdad entre mujeres y hombres, negociado e inscrito en el registro público (REGCON).',
    how: 'Con la resolución de inscripción del plan en el registro. Si tienes menos de 50 trabajadores, lo indicas en la declaración responsable.',
    risk: 'Estar obligado y no tenerlo es una prohibición de contratar.' },
  { id: 'rolece', name: 'Registro de licitadores (ROLECE)', match: /rolece|registro (oficial )?de licitadores|inscripcion en el registro/,
    what: 'Es un registro público donde constan los datos de tu empresa (escrituras, apoderados, solvencia). Estar inscrito te ahorra presentar esos documentos en cada licitación.',
    how: 'Con el certificado de inscripción. La inscripción se solicita en línea y tarda unas semanas, así que conviene hacerla antes de necesitarla.',
    risk: 'En el procedimiento abierto simplificado la inscripción es obligatoria: sin ella no puedes presentarte.' },
  { id: 'firma', name: 'Firma electrónica', match: /firma/,
    what: 'Los documentos de la oferta deben firmarse con un certificado digital reconocido del representante legal de la empresa.',
    how: 'Con un certificado de representante (por ejemplo, de la FNMT) instalado en el ordenador desde el que se presenta la oferta.',
    risk: 'Una oferta sin firma válida puede no admitirse. Comprueba días antes que el certificado está en vigor.' },
  { id: 'paginas', name: 'Límite de páginas de la memoria', match: /paginas|extension maxima/,
    what: 'El pliego limita la extensión de la memoria técnica, y a veces fija también el tipo y tamaño de letra y los márgenes.',
    how: 'Ajustando el documento a ese límite. PROPO estima las páginas de la propuesta y te avisa si te pasas.',
    risk: 'Lo que exceda del límite no se valora y, en algunos pliegos, superarlo excluye la oferta.' },
  { id: 'clasificacion', name: 'Clasificación empresarial', match: /clasificacion/,
    what: 'Es una acreditación oficial, por grupos, subgrupos y categorías, de que una empresa puede ejecutar contratos de cierto tipo e importe. Es obligatoria en obras de 500.000 euros o más; en servicios es voluntaria y sirve para acreditar la solvencia.',
    how: 'Con el certificado de clasificación expedido por la Junta Consultiva de Contratación.',
    risk: 'Cuando es obligatoria y no la tienes, no puedes presentarte en solitario.' },
  { id: 'medios', name: 'Adscripción de medios', match: /medios (personales|materiales)|adscri/,
    what: 'Además de la solvencia, el pliego puede exigir que te comprometas a dedicar al contrato unos medios concretos: un equipo mínimo, vehículos, maquinaria o instalaciones.',
    how: 'Con un compromiso firmado en la oferta y, si eres adjudicatario, con la documentación que demuestre que dispones de ellos.',
    risk: 'Es una obligación esencial: incumplirla puede llevar a penalizaciones o a la resolución del contrato.' },
  { id: 'baja', name: 'Oferta anormalmente baja (baja temeraria)', match: /anormal|temeraria|desproporcionad/,
    what: 'Si tu precio es mucho más bajo que el de los demás, la Administración presume que quizá no puedas cumplir el contrato y te pide que lo justifiques.',
    how: 'Con un escrito que explique por qué puedes ofrecer ese precio: costes, ahorros, condiciones favorables. La mesa decide si lo acepta.',
    risk: 'Si la justificación no convence, la oferta se rechaza.' },
  { id: 'incidencias', name: 'Plazos de respuesta e informes', match: /incidencia|informe mensual|plazo maximo/,
    what: 'Son obligaciones de cómo se presta el servicio: responder a las incidencias en un tiempo máximo o entregar informes periódicos.',
    how: 'En la oferta, describiendo cómo lo harás (canal de avisos, responsable, modelo de informe). Durante el contrato, cumpliéndolo y dejando registro.',
    risk: 'No excluye la oferta, pero un incumplimiento reiterado durante la ejecución conlleva penalizaciones.' },
];

const BY_CATEGORY: Record<string, Omit<Term, 'id' | 'match' | 'name'>> = {
  administrative: { what: 'Es un requisito de documentación: papeles que demuestran que tu empresa existe, quién la representa y que puede contratar con la Administración.', how: 'Normalmente con una declaración responsable al presentar la oferta y con los documentos originales solo si resultas adjudicatario.', risk: 'Si falta, te darán un plazo corto para subsanarlo; si no lo haces, quedas excluido.' },
  financial: { what: 'Es un requisito económico: la Administración comprueba que tu empresa tiene capacidad financiera para asumir el contrato.', how: 'Con cuentas anuales, pólizas o avales, según lo que pida exactamente el pliego.', risk: 'Si no alcanzas el mínimo exigido, la oferta se excluye.' },
  experience: { what: 'Es un requisito de experiencia: demostrar que ya has hecho trabajos parecidos.', how: 'Con una relación de contratos y certificados de buena ejecución de tus clientes.', risk: 'Sin la experiencia mínima acreditada, la oferta se excluye.' },
  certification: { what: 'Es un requisito de certificación: un tercero independiente acredita cómo trabaja tu empresa.', how: 'Con el certificado en vigor o, si el pliego admite equivalentes, con otras pruebas.', risk: 'Depende del pliego: puede excluir la oferta o solo restarte puntos.' },
  team: { what: 'Es un requisito sobre el personal que dedicarás al contrato: número de personas, perfiles o formación.', how: 'Con currículos, títulos y un compromiso de adscripción firmado.', risk: 'Si no cumples el mínimo, puedes perder puntos o quedar excluido, según el pliego.' },
  technical: { what: 'Es una condición sobre cómo debe prestarse el servicio o ejecutarse el trabajo.', how: 'Explicando en la memoria técnica cómo la cumplirás; durante el contrato, cumpliéndola.', risk: 'Una oferta que no la respeta puede rechazarse por no ajustarse al pliego.' },
  format: { what: 'Es una norma sobre la forma de presentar la oferta: sobres, extensión, formato o firma.', how: 'Siguiéndola al preparar y subir los documentos. PROPO lo revisa en la comprobación final.', risk: 'Los errores de forma son la causa más frecuente de exclusión evitable.' },
  legal: { what: 'Es una obligación legal que se aplica al contrato: laboral, de protección de datos, de prevención de riesgos, etc.', how: 'Con una declaración responsable y, durante la ejecución, cumpliendo la norma.', risk: 'Su incumplimiento puede dar lugar a penalizaciones o a la resolución del contrato.' },
};

export function termFor(text: string): Term | undefined {
  const t = normalize(text);
  return TERMS.find((x) => x.match.test(t));
}

/** Explicación de un requisito en lenguaje llano, con su situación actual en esta propuesta. */
export function explainRequirement(r: Requirement): string {
  const term = termFor(r.title) ?? termFor(r.text);
  const base = term ?? BY_CATEGORY[r.category] ?? BY_CATEGORY.technical;
  const mine = r.status === 'fulfilled'
    ? `PROPO lo da por cumplido${r.evidence.length ? ` con: ${r.evidence.map((e) => e.label).join('; ')}` : ''}.`
    : r.evidence.length
      ? `PROPO ha encontrado algo relacionado en tu empresa (${r.evidence.map((e) => e.label).join('; ')}), pero no puede comprobar por sí solo que cumple lo exigido. Por eso te pide que lo confirmes.`
      : 'PROPO no ha encontrado en la memoria de tu empresa nada que lo acredite. Si lo cumples, dilo o sube el documento; si no, valora si puedes cumplirlo antes de presentar.';
  return [
    term ? `**${term.name}.** ${base.what}` : `**Qué significa.** ${base.what}`,
    `**Qué pide este pliego.** «${r.text.replace(/\s+/g, ' ').trim()}»`,
    `**Cómo se acredita.** ${base.how}`,
    `**Qué pasa si no se cumple.** ${base.risk}`,
    `**En tu caso.** ${mine}`,
  ].join('\n\n');
}

/** Respuesta sin IA a una pregunta de seguimiento: explica el término que reconozca. */
export function explainTerm(question: string): string {
  const term = termFor(question);
  if (term) return `**${term.name}.** ${term.what}\n\n**Cómo se acredita.** ${term.how}\n\n**Qué pasa si no se cumple.** ${term.risk}`;
  return `Sin la IA activada solo puedo explicarte los términos habituales de una licitación. Prueba a preguntarme por alguno de estos: ${TERMS.slice(0, 8).map((t) => lowerFirst(t.name)).join(', ')}.`;
}
const lowerFirst = (s: string) => (/^[A-ZÁÉÍÓÚ]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

/** Respuesta sin IA a una pregunta de seguimiento sobre un requisito concreto. */
export function followUp(question: string, r: Requirement): string {
  const q = normalize(question);
  const base = termFor(r.title) ?? termFor(r.text) ?? BY_CATEGORY[r.category] ?? BY_CATEGORY.technical;
  if (/acredit|paso a paso|como lo|que documento|que tengo que (presentar|hacer)/.test(q)) return `**Cómo se acredita.** ${base.how}\n\n**En PROPO.** Si ya tienes el documento, súbelo desde esta misma pregunta con «Subir documento»: quedará guardado en tu biblioteca y servirá para las próximas licitaciones.`;
  if (/presentarme|igualmente|aun asi|de todas formas/.test(q)) return `**Depende de qué tipo de requisito sea.** ${base.risk}\n\nSi es un requisito de solvencia que no alcanzas, las vías habituales son presentarte en unión temporal (UTE) con otra empresa o apoyarte en los medios de un tercero que se comprometa por escrito. Si es una obligación de ejecución, basta con comprometerte a cumplirla.\n\nAnte la duda, pregunta al órgano de contratación por el canal de consultas de la plataforma antes de que cierre el plazo.`;
  if (/no (lo )?cumpl|que pasa|exclu|riesgo|consecuencia/.test(q)) return `**Qué pasa si no se cumple.** ${base.risk}`;
  return explainTerm(question);
}
