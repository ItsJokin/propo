// Pliegos oficiales y resúmenes de las licitaciones de la instantánea de TED (30/09/2026).
//
// Cómo se obtuvo (1/10/2026): para cada anuncio se leyó el XML eForms oficial de TED y, cuando el
// pliego está en la Plataforma de Contratación del Sector Público (PLACSP) o en la Plataforma de
// Serveis de Contractació Pública de Catalunya (PSCP), se leyeron el «Documento de pliegos» y el
// pliego de cláusulas administrativas (PCAP) directamente desde la plataforma oficial. Los enlaces
// apuntan a los documentos originales; PROPO no los modifica ni los aloja.
//
// Los resúmenes («plain», «asks», «watch») los ha redactado IA a partir de esos documentos y
// siempre indican de qué documento sale cada dato. No sustituyen la lectura del pliego.
// En producción, server/discovery/sync.ts descarga y resume los pliegos de cada licitación nueva.

export interface TenderDoc { name: string; url: string; kind: 'pcap' | 'ppt' | 'anexo' | 'memoria' | 'anuncio' | 'otro'; kb?: number }
export interface TenderBrief {
  source: 'placsp' | 'pscp';
  page: string;
  docs: TenderDoc[];
  otherDocs?: string[];
  pcapPages?: number;
  plain: string;
  facts: [string, string][];
  asks: string[];
  watch: string[];
  readFrom: string;
  /** Criterios con su ponderación, cuando el anuncio de TED no los publica. */
  crit?: [string, number, 'p' | 'q'][];
}

const PL = 'https://contrataciondelestado.es/FileSystem/servlet/GetDocumentByIdServlet?cifrado=QUC1GjXXSiLkydRHJBmbpw%3D%3D&DocumentIdParam=';
const PLD = 'https://contrataciondelestado.es/wps/poc?uri=deeplink:detalle_licitacion&idEvl=';
const CAT = 'https://contractaciopublica.cat/portal-api/descarrega-document/';
const CATP = 'https://contractaciopublica.cat/ca/detall-publicacio/';
const pcap = (id: string): TenderDoc => ({ name: 'Pliego de cláusulas administrativas (PCAP)', url: PL + id, kind: 'pcap' });
const ppt = (id: string): TenderDoc => ({ name: 'Pliego de prescripciones técnicas (PPT)', url: PL + id, kind: 'ppt' });
const PLACSP_READ = 'Documento de pliegos y PCAP publicados en la Plataforma de Contratación del Sector Público';
const PSCP_READ = 'Ficha oficial del expediente en la Plataforma de Serveis de Contractació Pública';

export const TENDER_BRIEFS: Record<string, TenderBrief> = {
  // ---------------------------------------------------------------- Catering y restauración (PSCP)
  '605834-2026': {
    crit: [['Precio pensión completa programa U18', 35, 'p'], ['Precio concentraciones U21 y otros programas', 10, 'p'], ['Incremento de espacios de la residencia', 15, 'q'], ['Ubicación (distancia a Vielha)', 10, 'q'], ['Características de la residencia (juicio de valor)', 30, 'q']],
    source: 'pscp', page: CATP + '300870841', pcapPages: 64, readFrom: PSCP_READ + ', PCAP y PPT',
    docs: [
      { name: 'Pliego de cláusulas administrativas (PCAP)', url: CAT + '302556893/A59E953ADE1395F3E668F3B02B5CDC0F', kind: 'pcap', kb: 700 },
      { name: 'Pliego de prescripciones técnicas (PPT)', url: CAT + '302556895/8E82E7769ED7FA4574FB1D7B8181E651', kind: 'ppt', kb: 272 },
      { name: 'Memoria justificativa', url: CAT + '302556897/AE9B4565C92D32C8C3C5A32C1AC49F00', kind: 'memoria', kb: 127 },
      { name: 'Anexos editables', url: CAT + '302555299/B5AA78BD8B999425E59470CD21091335', kind: 'anexo', kb: 35 },
      { name: 'Anexo 2 · Modelo de aval y seguro de caución', url: CAT + '302555302/8A7D2C3ABCDF673EDD32971F079F91EB', kind: 'anexo', kb: 17 },
    ],
    plain: 'Residencia deportiva en la Val d’Aran para los esquiadores del Centro de Tecnificación (CETEI): alojamiento y cinco comidas al día para hasta 15 deportistas del programa U18 durante el curso escolar, más concentraciones del U21 y de otros programas. Contrato de 3 cursos (2026-2029) con una prórroga posible. Hace falta disponer de un establecimiento en Aran: no es solo cocina.',
    facts: [
      ['Presupuesto anual (sin IVA)', '189.575,10 €'], ['Presupuesto 3 cursos (sin IVA)', '568.725,30 €'], ['Valor estimado (4 años)', '758.300,40 €'],
      ['Precio máximo pensión completa U18', '75,02 € + IVA por persona y día'], ['Precio máximo media pensión concentraciones', '71,49 € + IVA'],
      ['Duración', '3 cursos escolares + 1 prórroga'], ['Garantía definitiva', '5 %'],
      ['Criterios', 'Precio 35 · otros automáticos 35 · juicio de valor 30'], ['Fin de presentación', '5/10/2026, 23:59'],
    ],
    asks: [
      'Residencia ubicada en Aran con habitaciones de máximo 3 personas, 8 m² por deportista y baño interior (PPT, p. 6).',
      'Espacios comunes: gimnasio de 60 m², sala de estudio de 70 m² para 18 personas con proyector, guardaesquís de 20 m² y lavandería (PPT, p. 7).',
      'Comedor de lunes a viernes con 5 comidas al día según el menú del centro y menús para alergias y celiaquía (PPT, p. 7).',
      'Cocina abierta un fin de semana al mes con 10 días de aviso (PPT, p. 7).',
      'Solvencia económica y técnica según la cláusula sexta del PCAP.',
    ],
    watch: [
      'Se excluye la oferta que no llegue a 50 puntos o a 15 puntos en juicio de valor (PPT, p. 13).',
      'Baja temeraria: más de 15 puntos por debajo de la media de las ofertas (PPT, p. 15).',
      'La ubicación puntúa hasta 10 puntos: 10 si está a menos de 1 km del Ayuntamiento de Vielha (PPT, p. 15).',
      'El servicio depende de la financiación del Consell Català de l’Esport; si falta, se suprime sin indemnización (PPT, p. 13).',
      'El plazo termina el 5 de octubre: muy poco margen.',
    ],
  },
  '639589-2026': {
    crit: [['Precio', 35, 'p'], ['Otros criterios automáticos', 25, 'q'], ['Criterios sujetos a juicio de valor', 40, 'q']],
    source: 'pscp', page: CATP + '300884177', pcapPages: 78, readFrom: PSCP_READ + ', pliego de condiciones y PPT',
    docs: [
      { name: 'Pliego de condiciones particulares (PCP)', url: CAT + '302596292/4FE9ACB9D6E494CFD44CC45A1BDB1C5E', kind: 'pcap', kb: 966 },
      { name: 'Pliego de prescripciones técnicas (PPT)', url: CAT + '302596294/C20FB28431AB0280242797AB686E504D', kind: 'ppt', kb: 462 },
      { name: 'Memoria y resolución de inicio', url: CAT + '302596295/A4828CBCFD18156F96DEFAC6A139ACB1', kind: 'memoria', kb: 339 },
      { name: 'Contrato tipo', url: CAT + '302596299/DD7348F37E13AB7D1C836DD7DE5859A0', kind: 'otro', kb: 447 },
      { name: 'Anuncio de licitación', url: CAT + '302596300/88219A6F56582CAD139FB1B7512DD99F', kind: 'anuncio', kb: 276 },
    ],
    plain: 'Suministro en exclusiva de hot dogs y embutidos para los puntos de venta del Parc d’Atraccions Tibidabo (BSM), con cesión de la maquinaria (unos 6 equipos rotativos más uno de reserva), un carrito móvil de venta y la cartelería. Un año de contrato.',
    facts: [
      ['Presupuesto (sin IVA)', '107.434 €'], ['Valor estimado', '236.354,80 €'], ['Duración', '1 año'], ['Garantía definitiva', '5 %'],
      ['Criterios', 'Precio 35 · otros automáticos 25 · juicio de valor 40'], ['Fin de presentación', '20/10/2026, 12:00'],
    ],
    asks: [
      'Productos de empresas con registro sanitario vigente, ficha técnica con información nutricional e informe de alérgenos (PPT, 5.2).',
      'Ceder hornos rotativos de 2 tamaños para cada punto de venta, mantenerlos y dejar 1 máquina de reserva (PPT, 5.3).',
      'Al menos 1 carrito móvil de venta con frío, almacenaje y conexiones para el cobro (PPT, 5.4).',
      'Responsable del servicio localizable de 8 a 20 h los 365 días y respuesta en 24 h (PPT, 5.9).',
      'Entregas en 3 días laborables (urgentes en 2) en los dos accesos del parque (PPT, 5.10).',
    ],
    watch: [
      'Penalización del 2 % del pedido por cada entrega fuera de plazo (PPT, 5.13).',
      'El sobre de juicio de valor no puede revelar la oferta económica: supone exclusión (PCP, p. 22).',
      'Hay que cumplir los criterios municipales de contratación sostenible y minimizar envases (PPT, 5.11).',
    ],
  },
  '649074-2026': {
    crit: [['Lote 2 · precio', 50, 'p'], ['Lote 2 · otros criterios automáticos', 50, 'q'], ['Lote 1 · precio', 25, 'p'], ['Lote 1 · otros criterios automáticos', 30, 'q'], ['Lote 1 · juicio de valor', 45, 'q']],
    source: 'pscp', page: CATP + '300884023', readFrom: PSCP_READ + ' y PPT (anexo 7)',
    docs: [
      { name: 'Pliego de cláusulas administrativas (PCAP)', url: CAT + '302595979/D9F94EAFDE4344B758BC5C9B36A4F735', kind: 'pcap', kb: 2042 },
      { name: 'Pliego de prescripciones técnicas (PPT)', url: CAT + '302595980/234118975F602422B77CCCE10B9D34BF', kind: 'ppt', kb: 1195 },
      { name: 'Memoria justificativa', url: CAT + '302595981/1408944406FD2A346CE11D3F9E0E70F6', kind: 'memoria', kb: 1257 },
      { name: 'Anuncio de licitación', url: CAT + '302605233/763F1615B06D58E11C9EA812BD0FAFE3', kind: 'anuncio', kb: 504 },
    ],
    plain: 'Congreso de unas 350 personas de la Diputació de Lleida entre diciembre de 2026 y marzo de 2027, en dos lotes: organización integral (lote 1) y catering (lote 2). Cada empresa solo puede presentarse y ganar un lote. El lote 2 pide una propuesta gastronómica de proximidad con al menos un 75 % de producto de Lleida, Pirineo y Aran.',
    facts: [
      ['Lote 1 · Organización (sin IVA)', '154.733,03 €'], ['Lote 2 · Catering (sin IVA)', '45.550 €'], ['Asistentes', '≈ 350 personas'],
      ['Ejecución', '1/12/2026 – 31/3/2027'], ['Garantía definitiva', '5 %'],
      ['Criterios lote 2', 'Precio 50 · otros automáticos 50'], ['Criterios lote 1', 'Precio 25 · automáticos 30 · juicio de valor 45'], ['Fin de presentación', '19/10/2026, 23:59'],
    ],
    asks: [
      'Lote 2: volumen anual de negocio de al menos 81.990 € en el mejor de los últimos 3 años (ficha PSCP).',
      'Lote 2: relación de servicios de catering para eventos (comida, bebida, personal de sala, montaje y desmontaje) (ficha PSCP).',
      'Compromiso de adscripción de medios, obligación esencial del contrato (ficha PSCP).',
      'Menú detallado con alérgenos, opción para dietas especiales, dispensadores de agua y material reutilizable (PPT, anexo 7).',
      'Lote 1: volumen de negocio de al menos 278.519,46 € y congresos de más de 200 asistentes (ficha PSCP).',
    ],
    watch: [
      'Al menos el 75 % del producto debe ser de Terres de Lleida, Pirineu i Aran, con productos del Solsonès (PPT, anexo 7).',
      'Hay que alinearse con la marca «Gust de Lleida» de la Diputació (PPT, anexo 7).',
      'Solo se puede presentar oferta a un lote.',
    ],
  },
  '646891-2026': {
    crit: [['Precio', 35, 'p'], ['Otros criterios automáticos', 40, 'q'], ['Criterios sujetos a juicio de valor', 25, 'q']],
    source: 'pscp', page: CATP + '300887339', readFrom: PSCP_READ,
    docs: [
      { name: 'Pliego de cláusulas administrativas (PCAP, enmendado)', url: CAT + '302606533/C2C38C8354A4449BB734F5356C937CA3', kind: 'pcap', kb: 889 },
      { name: 'Pliego de condiciones técnicas', url: CAT + '302606529/7C4B61E21C25E04F93C6621495E70C08', kind: 'ppt', kb: 542 },
      { name: 'Informe técnico de necesidad (enmendado)', url: CAT + '302606535/CD0A5DACD91177F829EB7661F588B278', kind: 'memoria', kb: 415 },
      { name: 'DEUC (XML)', url: CAT + '302606524/160EB3786E9392CDCF431C26544E6A8E', kind: 'anexo', kb: 150 },
    ],
    plain: 'Coordinación de eventos y dinamización de talleres de educación ambiental de Parcs i Jardins de Barcelona durante 2 años.',
    facts: [['Presupuesto (sin IVA)', '101.863,12 €'], ['Valor estimado', '224.098,86 €'], ['Duración', '2 años'], ['Garantía definitiva', '5 %'], ['Criterios', 'Precio 35 · otros automáticos 40 · juicio de valor 25'], ['Fin de presentación', '19/10/2026, 23:59']],
    asks: ['Volumen anual de negocio mínimo en el mejor de los 3 últimos ejercicios (art. 87.1.a LCSP; importe en el PCAP).', 'Servicios similares ejecutados en los últimos 3 años (art. 90.1.a LCSP).', 'Titulación y experiencia del director/a, del coordinador/a técnico/a y de los educadores ambientales (art. 90.1.b LCSP).'],
    watch: ['El PCAP y el informe técnico se han enmendado: usa siempre la última versión.'],
  },
  '668388-2026': {
    crit: [['Precio', 40, 'p'], ['Otros criterios automáticos', 15, 'q'], ['Criterios sujetos a juicio de valor', 45, 'q']],
    source: 'pscp', page: CATP + '300894004', readFrom: PSCP_READ,
    docs: [
      { name: 'Pliego de cláusulas administrativas (PCAP, enmendado)', url: CAT + '302627772/8F187A7DD724060D9D6B83E19015224A', kind: 'pcap', kb: 1871 },
      { name: 'Pliego técnico', url: CAT + '302627773/C9E0823CF5F6F8024137D0702714AA4C', kind: 'ppt', kb: 320 },
      { name: 'Propuesta de rectificación', url: CAT + '302627771/CE627EF3AA0C353A63A1543AE06D3341', kind: 'otro', kb: 581 },
    ],
    plain: 'Diseño y producción de soportes de comunicación y organización de actos de la Agència Catalana de l’Aigua durante 2 años.',
    facts: [['Presupuesto (sin IVA)', '433.780 €'], ['Duración', '2 años'], ['Garantía definitiva', '5 %'], ['Criterios', 'Precio 40 · otros automáticos 15 · juicio de valor 45'], ['Fin de presentación', '26/10/2026, 13:00']],
    asks: ['Solvencia según el cuadro de características del PCAP.', 'Condiciones especiales de ejecución del apartado M del PCAP.'],
    watch: ['El PCAP se ha rectificado: revisa la propuesta de rectificación.', 'El 45 % se valora por juicio de valor: la memoria técnica pesa mucho.'],
  },
  '659384-2026': {
    crit: [['Precio', 47, 'p'], ['Otros criterios automáticos', 53, 'q']],
    source: 'pscp', page: CATP + '300893338', readFrom: PSCP_READ,
    docs: [
      { name: 'Pliego de cláusulas administrativas (PCAP)', url: CAT + '302631298/A6BAB84CC95BB05BCEB9ABD4EE1E715B', kind: 'pcap', kb: 1116 },
      { name: 'Pliego de prescripciones técnicas (PPT)', url: CAT + '302625955/74BE0219784E5C083C232FEF65EAA687', kind: 'ppt', kb: 514 },
      { name: 'Informe justificativo', url: CAT + '302625923/A112D41CB0D6A0298C39ADF831E67DD1', kind: 'memoria', kb: 210 },
      { name: 'Modelo de propuesta económica (Excel)', url: CAT + '302631253/9D554AC2DB9A75103BA798BE53C2AD65', kind: 'anexo', kb: 18 },
    ],
    plain: 'Conservación y mantenimiento de la jardinería del Palau Robert de Barcelona durante 1 año, para Infraestructures de la Generalitat.',
    facts: [['Presupuesto (sin IVA)', '154.953,64 €'], ['Valor estimado', '555.973,39 €'], ['Duración', '1 año'], ['Garantía definitiva', '5 %'], ['Criterios', 'Precio 47 · otros automáticos 53 (sin juicio de valor)'], ['Fin de presentación', '26/10/2026, 14:00']],
    asks: ['Solvencia según el apartado 9 del cuadro de características y la cláusula 7 del PCAP.', 'La oferta económica se presenta con el modelo Excel oficial.'],
    watch: ['Todos los criterios son automáticos: el precio y las mejoras cuantificables lo deciden todo.'],
  },

  // ---------------------------------------------------------------- PLACSP
  '622916-2026': {
    source: 'placsp', page: PLD + '75tqd2QgupR%2FR5QFTlaM4A%3D%3D', pcapPages: 98, readFrom: PLACSP_READ,
    docs: [ppt('ccpY/gRT7F9kHSwo0E54hLMuekojaNCaFgu8kkA5WhJCWxWtMi6ANYm3gI1kc1FNw0ZK9RDZjdH4c%2B0difbD1b5/iLE45ex245FIRVLG5sR45ClyWkoJ44mKM70IFcOu'), pcap('kIwwj1BGtzYwH6JXCeuNu04ZFRzmqUzQQrI7E8Yavox6ozAx%2BT1ipQgxrV6iZ5qRby1EbyAREkzvdpaCQxz3m34z%2B8Px%2BEVNKis%2BrDnW91G1aXEvq3KHa/AEHgtDrQw0')],
    otherDocs: ['Memoria justificativa'],
    plain: 'Desarrollos informáticos para la logística del Servicio de Vestuario de la Policía Nacional, contratados por ISDEFE. 4 años.',
    facts: [['Presupuesto base (sin IVA)', '120.000 €'], ['Valor estimado', '242.000 €'], ['Duración', '48 meses'], ['Garantía definitiva', '5 %'], ['Criterios', 'Automáticos distintos del precio 60 · económicos 40'], ['Apertura de ofertas', '19/10/2026, 10:00']],
    asks: ['Solvencia económica y técnica «conforme especificaciones PCAP».'],
    watch: ['El 60 % son criterios automáticos distintos del precio: revisa cuáles en el PCAP.'],
  },
  '626086-2026': {
    source: 'placsp', page: PLD + 'GQUcmI6OynrgL1BHd3qjQA%3D%3D', pcapPages: 147, readFrom: PLACSP_READ,
    docs: [ppt('JLGHDA40bl%2BVF2vWn8bvaYX9gRscscLLIJXf31fnXFUV4RjnuStNFYGXd7cJHz0kDKOjjmljI8cVo9gYKX3p85tlb9RPofZpH3l9NBizejxJOVDbGCDM%2BMigrvuVS7Rv'), pcap('L7XrJgJlZ9x46vobYuGORaxLs5mtrT66nDkQfMqypTweBhrNeTeN4Fu/lvmMWxOi%2BiK4sPrSCBIhQNbj7Lb6fa9CVYVWVZY/MN47Hc9Yk2jDdQD9RyhUmzT4jZ2In4zL'), { name: 'Anexos del PCAP', url: PL + 'glrOa7b3uXXd1ooOVPLEbA99kOO7YM8lSeD5EnrDclQZRwsE%2B4PMKSDUWOsN1cOrMpDKebfNum1pOv8zImj88jeXoTbCjRHiubPIpQAwtvH6CYyL7SIrUOBFfNf52ZqA', kind: 'anexo' }],
    otherDocs: ['Informe justificativo', 'Resolución de inicio del expediente'],
    plain: 'Asistencia técnica para planificar y controlar los recursos de formación permanente del profesorado de Castilla-La Mancha. 2 años con una prórroga.',
    facts: [['Presupuesto base (sin IVA)', '136.612,40 €'], ['Valor estimado', '273.224,80 €'], ['Duración', '2 años + 1 prórroga'], ['Criterios', 'Calidad técnica 70 · precio 20'], ['Apertura de ofertas', '29/10/2026, 08:28']],
    asks: ['Cifra anual de negocio según el apartado 10.1 del anexo I del PCAP.', 'Trabajos realizados según el apartado 10.2 del anexo I del PCAP.'],
    watch: ['El 70 % es calidad técnica: la memoria decide la adjudicación.', 'Hay cláusula de subrogación de personal (PCAP, 14.2).'],
  },
  '630615-2026': {
    source: 'placsp', page: PLD + 'EBxz16P6lbkzjChw4z%2FXvw%3D%3D', pcapPages: 39, readFrom: PLACSP_READ,
    docs: [ppt('iC2HT34JybYZiBlDt9jAc0wlXfLTYoihnc8htNHzJUS7dCLbcqbOet56Btf1DEXfS9DVeaGe%2B%2BJAzaKanoi9pmFPFXJbWWD3WRMuSdfsdpBt/o8fNevwsujgRzaBbugn'), pcap('v//u4j9cGwp9Jqe7L2PDRP2YeAz4Am27VjwJ9hP35qZE%2B5eQjxGTWJL6C6dKVRPzpy46f5TP9%2B4bJbP/6zJo2h32PkexIrYACD/Ag7hx%2BIj6CYyL7SIrUOBFfNf52ZqA')],
    otherDocs: ['Anexo I (Word)', 'Anexo II (Word)', 'Informe de insuficiencia de medios'],
    plain: 'Evaluaciones temáticas del Plan Estratégico de la PAC en Castilla y León para 2026 y 2027, hechas por evaluadores independientes.',
    facts: [['Presupuesto base (sin IVA)', '238.170,94 €'], ['Duración', '27 meses'], ['Criterios', 'Evaluaciones adicionales 60 · precio 40'], ['Sobres', '2: administrativa y criterios por fórmula (PCAP, p. 19)']],
    asks: ['Cifra anual de negocio y trabajos realizados (anuncio TED).', 'Someterse a la normativa de protección de datos (condición especial de ejecución).'],
    watch: ['Todo se valora por fórmula: ofrecer evaluaciones adicionales da el 60 % de los puntos.'],
  },
  '636806-2026': {
    source: 'placsp', page: PLD + '7lKyBH64CW4ZDGvgaZEVxQ%3D%3D', pcapPages: 43, readFrom: PLACSP_READ,
    docs: [ppt('zOurWu9TXXqy3hyuIb13udnyggc4CPO0gfGu%2BunVOIA%2BQ1B1rRUtaWH8hx61lPy05dfri2DH9N1p2GA6fQ7VX4mWBbOzlbL04%2BjPrw3wemFJOVDbGCDM%2BMigrvuVS7Rv'), pcap('dpYT70RLLRSqco0pvlhXx0K5hIwum1Cx6Haj9A3siSI4m08fXSBEI%2BbJpk8ZzBhx3hvHfGYRXM0ukX0ZcqODlXWCRQK1udEiOpWmPo2d%2BmuB0nvVKRzfe4rpHcnlPhSZ')],
    otherDocs: ['Memoria justificativa de necesidad y económica'],
    plain: 'Acuerdo marco de 2 años del CNIO para suministrar material de microinformática y audiovisuales (lote 1) y sistemas informáticos (lote 2).',
    facts: [['Presupuesto base (sin IVA)', '4.000.000 €'], ['Duración', '24 meses, sin prórrogas'], ['Criterios', 'Plazo de entrega 40 · respuesta a incidencias 30 · posventa 30'], ['Sobres', '3 electrónicos (PCAP, p. 17)'], ['Apertura de ofertas', '27/10/2026, 11:00']],
    asks: ['Solvencia inicial con el DEUC; el adjudicatario acredita después la documentación (Documento de pliegos).'],
    watch: ['No hay umbral de oferta anormalmente baja (PCAP, p. 8).'],
  },
  '623980-2026': {
    source: 'placsp', page: PLD + 'HWZZ7cI1jknI8aL3PRS10Q%3D%3D', pcapPages: 148, readFrom: PLACSP_READ,
    docs: [ppt('Z4wxZnBiNK7Ma5GmBERF/8WwfFhkI0Lpn68Wxa55ZsaT7vFBqq%2B6JrP0Lm2mSIB64uDYaEfs8c5wFWPbDKurgw2gkYr0lcPoQg3ujm1gjLe1aXEvq3KHa/AEHgtDrQw0'), pcap('qxLXCebNmG4DqBgNBi0x8gJKsD8LiEIGlyT/hNaetAGaq%2BWFVH/ZX0mL2tBJcLpt6DOmCx4Sqziq2SKGJr%2BuMd3jo7hmiF6VLmRw2u1djL/fdyQgZAdTm3EfcUAC7CJ6')],
    otherDocs: ['Informe de necesidad', 'Informe del servicio jurídico', 'DEUC'],
    plain: 'Comunicaciones unificadas (lote 1) y ciberseguridad gestionada con SOC, CSIRT, SIEM y WAF (lote 2) para el Defensor del Pueblo durante 4 años.',
    facts: [['Presupuesto base (sin IVA)', '3.669.444 €'], ['Valor estimado', '5.137.221,60 €'], ['Duración', '4 años + 1 prórroga'], ['Garantía definitiva', '5 %'], ['Sobres', '3 (uno administrativo común a los 2 lotes) (PCAP, p. 56)'], ['Apertura de ofertas', '15/10/2026, 10:00']],
    asks: ['Solvencia según la cláusula 13 del PCAP.', 'Lote 2: cumplir el Esquema Nacional de Seguridad en categoría MEDIA (anuncio TED).'],
    watch: ['Condiciones sociales en los apartados 35 y 69 del anexo I del PCAP.'],
  },
  '626704-2026': {
    source: 'placsp', page: PLD + 'VjfzQ9nVf%2Bpq1DdmE7eaXg%3D%3D', pcapPages: 95, readFrom: PLACSP_READ,
    docs: [ppt('HRksmpw0Gk2StmmY0ECgb%2BIXamRvGuuoIkhcItkvwDJyc9Sl/zzKLCtaeiLEE3dBulBMV6uhKsF9naQHtYh0DzDD7omzrp9d8Q1/dd20Y9o//q7NB2iMZvNyf0xrJmjt'), pcap('Oje0L5ZPgooIGVtcl/dLRuk0tq3CJODzLSfuPuVKs/Grt83W%2BocCwqChETm7xMuIPndersO9DzZSKxWI1VvzOIyrNp7fIoDdmcR5zAHk2h97QB3HKyQaFUExmUVQCerk'), { name: 'Cuadro de características y anexo de criterios (CAU)', url: PL + 'm0GxO9Cgu92bT2rknMT0C6YQdFz6P%2BuTRfMT7Omx5fgfli5zxePjWD91Ct7RW0f4C2IvFC/ijZsO1EyXj/c725NKPpnVlighmiAh9F6HP%2B%2BB0nvVKRzfe4rpHcnlPhSZ', kind: 'anexo' }],
    otherDocs: ['Anexo II A · Declaración responsable', 'Modelo de oferta (anexo III B)'],
    plain: 'Centro de atención a usuarios (lote 1) y operación y mantenimiento del software de base y comunicaciones (lote 2) del Ayuntamiento de Valladolid. 2 años con hasta tres prórrogas anuales.',
    facts: [['Presupuesto base (sin IVA)', '2.319.746,62 €'], ['Valor estimado', '6.263.315,89 €'], ['Duración', '2 años + 3 prórrogas de 1 año'], ['Garantía', 'Definitiva 5 % + complementaria 5 %'], ['Apertura de ofertas', '16/10/2026, 09:30']],
    asks: ['Cifra anual de negocio y trabajos realizados según el apartado H.1 del cuadro de características.'],
    watch: ['Garantía complementaria del 5 % además de la definitiva.', 'Hay subrogación laboral (PCAP, apartado 30 B).'],
  },
  '626454-2026': {
    source: 'placsp', page: PLD + 'Y1g0oYLCHFB4zIRvjBVCSw%3D%3D', pcapPages: 105, readFrom: PLACSP_READ,
    docs: [ppt('73d7I6ZJbKvZjtYSUkvHVR%2BRZ1oQXlmoUIlb9OJGzSkk5p3s%2BNfbzEYF%2BHJhh65coDDiOAlZ5yUSkwW7RS4p41vbrW5j5JTiL3EJHbIqN9WHAj0WEJrB5sP7amrh2jBD'), pcap('4kOXRlqsKdK2RwsDfXDBUxW7sT5507uXyK8euBSKin6EH%2BSjx2Rh/XXuAUq/IFtJ5bJGcD3cMQIUNtFgyEkDYCS1s4Lp5DH76%2Bg2WsnpzpJ45ClyWkoJ44mKM70IFcOu')],
    otherDocs: ['Informe de necesidades', 'Informe jurídico'],
    plain: 'Acuerdo marco de software municipal en la nube (padrón, gestión tributaria y contabilidad) para los ayuntamientos de las Illes Balears, con implantación, migración, formación y soporte.',
    facts: [['Presupuesto base (sin IVA)', '4.891.547,92 €'], ['Valor estimado', '9.453.031,52 €'], ['Duración', '2 años'], ['Memoria funcional', 'Máximo 25 páginas, Arial 11 (PCAP, p. 40)'], ['Apertura de ofertas', '2/11/2026, 11:19']],
    asks: ['Cifra anual de negocio y trabajos realizados según el apartado F1 del cuadro resumen del PCAP.'],
    watch: ['El precio pesa 50–65 puntos según el lote.', 'Oferta anormalmente baja si la puntuación económica supera en mucho la media (PCAP, p. 10).'],
  },
  '628331-2026': {
    source: 'placsp', page: PLD + 'hJsLrWAY20d6nTs9LZ9RhQ%3D%3D', pcapPages: 50, readFrom: PLACSP_READ,
    docs: [ppt('sFblu4/Rhpjk6IMz3opKHb1Gdr0r26iocGOQ7Z9dYYbOZDvbNBLaFJieKxK8CiwFA8kqoAIT42FXwPkrywNUwRTk0NlHGOn7x4Zp772KsHJ7QB3HKyQaFUExmUVQCerk'), pcap('OTzjd%2BPIb8bi59r34GoE7EqGpmCPLEwkA5GlHrz9pMi4vtV5HyT9Vv/DQglsqpO9cpEt28yrgQuESmpWdD3KSwrj4k8JHrUlw5gO9p6UkUOHAj0WEJrB5sP7amrh2jBD')],
    otherDocs: ['Instrucciones del DEUC'],
    plain: 'Alquiler de camiones con conductor u operario para la empresa municipal de Manacor (limpieza de redes de agua, bombeos y transporte). 1 año.',
    facts: [['Presupuesto base (sin IVA)', '77.000 €'], ['Valor estimado', '369.600 €'], ['Duración', '1 año'], ['Criterios', 'Precio 90 · tiempo de respuesta 10'], ['Apertura de ofertas', '19/10/2026, 10:00']],
    asks: ['Cifra anual de negocio según el PCAP.', 'Revisar los elementos de seguridad de los camiones y entregar los EPI a los conductores (condición especial de ejecución).'],
    watch: ['El precio decide el 90 %: atención al umbral de baja desproporcionada (PCAP, p. 6).'],
  },
  '653396-2026': {
    source: 'placsp', page: PLD + 'k2%2FgrZp6u8oIYE3ZiZ%2BxmQ%3D%3D', pcapPages: 218, readFrom: PLACSP_READ,
    docs: [ppt('JNJ/8HCFGddXnsnf4BAYOohRfPg69Q6o39YBRqYMMaUi7QkV7J38%2BqPk/KLoxk9zBriTzGPu1SAzR7qnCGAZmxjr9%2BjcT3YjhEuRzjT3p09JOVDbGCDM%2BMigrvuVS7Rv'), pcap('gbDvrXeyAywq9VY3bvkQAygZgbyTxLaCVXbQGtF8bgY9Iq0ipX0SHWGuMNZbR%2BUwHPOd0mxSUhJXDRxHAjOQPE%2BntIHTcRfYI9sqdERnHQG1aXEvq3KHa/AEHgtDrQw0')],
    otherDocs: ['Memoria justificativa'],
    plain: 'Transporte no sanitario de pacientes de la mutua Midat Cyclops en la provincia de Barcelona, en dos lotes territoriales. 1 año.',
    facts: [['Presupuesto base (sin IVA)', '302.620 €'], ['Valor estimado', '363.144 €'], ['Duración', '1 año'], ['Criterios', 'Oferta técnica automática 55 · precio 45'], ['Sobres', 'A y C (sin juicio de valor) (PCAP, p. 30)'], ['Apertura de ofertas', '4/11/2026, 10:00']],
    asks: ['Trabajos realizados y adscripción de medios (Documento de pliegos).'],
    watch: ['No hay subrogación de personal (PCAP, p. 10).'],
  },
  '652590-2026': {
    source: 'placsp', page: PLD + 'XatFg6bPDQe7JOCXkOhcDg%3D%3D', pcapPages: 26, readFrom: PLACSP_READ,
    docs: [ppt('CAAvI0YVXsRxpXNP/OxSuK/n4iuLJFqOQY%2BxVRBEOZIet82L9778OQ27t0QYfkACXxNX8E25Gg%2BdvoG2ItuiyxJWHzKZlgzr%2BYvPNAMj/3Ft/o8fNevwsujgRzaBbugn'), pcap('koBTm4K8e1/7l4u0U7xECjRkUI4h4ZWYBQIDugrxtqPdwNmmmhy0lvrn/%2BIIThR1c0w4c%2Bl6hJPRp0q9PJ7BkHlLvbJDfRnwi0HgLlxi8WHDdQD9RyhUmzT4jZ2In4zL')],
    otherDocs: ['Anexo 3 (Word)', 'Anexo 2 · lote 1 (Word)', 'Anexo 2 · lote 2 (Word)'],
    plain: 'Transporte y distribución de colchones, almohadas y ropa de cama a centros penitenciarios durante 3 meses desde el 15/12/2026.',
    facts: [['Presupuesto base (sin IVA)', '147.087,91 €'], ['Duración', '3 meses, sin prórrogas'], ['Garantía definitiva', '5 %'], ['Criterios', 'Precio 90 · servicios adicionales 10'], ['Sobres', '2 (PCAP, p. 10)'], ['Apertura de ofertas', '4/11/2026, 10:00']],
    asks: ['Cifra anual de negocio (apartado 7.1) y trabajos realizados (apartado 7.2) del cuadro de características.', 'Gestión selectiva de embalajes y envases (condición especial de ejecución).'],
    watch: ['Contrato muy corto y casi todo precio.'],
  },
  '633510-2026': {
    source: 'placsp', page: PLD + 'q02BPehqnrSP%2Bo96UAV7cQ%3D%3D', pcapPages: 74, readFrom: PLACSP_READ,
    docs: [ppt('zMSD8Ufon43zAJdis6i61UTimBoVVjvx2Jc8F4Eq8DiNvW8dcEUYPyiY26BZQWQ659KcdXumoSA4PcZp%2BC0Ow7imzw5woZYGXvpVm0zYtRaCx2e6p7hqtlp2aFupgHMr'), pcap('v0U5hblOhRKoCsM2NTFwgSAyCAiGNpT1iMiH660vsNdek9aP2IXfFkCmz6XoaWaHIrpAiI/iWpppGuJ%2BUCksnr5geKitTnbQpHxTWMGr/rAC1/zDIE0Kw/PWNnLS0Z0z'), { name: 'Anexo IV · Solvencia económica y técnica', url: PL + 'WKm3%2BILbPZoFrZOMA5cXKcm%2B6cHlRBByoFICMKYPfYbeOUT3DyiOFxQ7lr%2BLzgLOsH4e19K3nwHdJDmxLXlHxyoTa9jqf0v5rVsfHf55JJyB0nvVKRzfe4rpHcnlPhSZ', kind: 'anexo' }],
    otherDocs: ['Anexo II', 'Anexo III · Grupo empresarial'],
    plain: 'Traslado en vehículo no sanitario de pacientes de la mutua MAZ en Zaragoza y Teruel, dividido en 23 lotes por zonas. 3 años con una prórroga.',
    facts: [['Presupuesto base (sin IVA)', '1.271.631,60 €'], ['Valor estimado', '1.949.835,12 €'], ['Duración', '3 años + 1 prórroga'], ['Lotes', '23 (por zonas)'], ['Apertura de ofertas', '29/10/2026, 09:00']],
    asks: ['Solvencia económica y técnica del anexo IV.', 'Cifra de negocio, trabajos realizados y maquinaria y equipo técnico (anuncio TED).'],
    watch: ['Subrogación de trabajadores si la impone el convenio (PCAP, cláusula 33).', 'Puntúan vehículos adaptados y con distintivo ambiental ECO/CERO.'],
  },
  '640074-2026': {
    source: 'placsp', page: PLD + 'vZbvvlfV1tR%2BF6L2uCfUWg%3D%3D', pcapPages: 42, readFrom: PLACSP_READ,
    docs: [ppt('5KS4iyXhACZeSmm56hAkqip9xX%2BaVbckG/lsIup8Vsrn0rn4zWL92jcg50wb47uYREwkKOf77aA8BIH/jtbu8YB8yQcxM%2Bbe8TB69sC4CPOCx2e6p7hqtlp2aFupgHMr'), pcap('AgdBlH7GSf7%2B/gQDqKyDlAEPtt/%2B5Okn0JF8TJufak5AhJwv55GK%2BdpvmkJ1ZmNSs2QMjhwWWmOkY9UYGbq/Qep9f9fVPqzy89YNCjOxCCT3GVhXrFFqN7yFncy7YfRK')],
    otherDocs: ['Anexos (Word)', 'Memoria de necesidad', 'Informe de insuficiencia de medios'],
    plain: 'Mantenimiento de jardines y suministro de plantas para el Hospital de Coslada y el centro de Sevilla de Asepeyo. 1 año con hasta 4 prórrogas anuales.',
    facts: [['Presupuesto base (sin IVA)', '120.250 €'], ['Valor estimado', '493.300 €'], ['Duración', '12 meses + 4 prórrogas'], ['Criterios', '100 % fórmulas automáticas'], ['Sobres', '2 (PCAP, p. 23)'], ['Apertura de ofertas', '30/10/2026, 10:00']],
    asks: ['Cifra anual de negocio (anuncio TED).'],
    watch: ['Todo se decide por fórmula.'],
  },
  '623260-2026': {
    source: 'placsp', page: PLD + 'FFQnl3Ldqo9VkTabT%2FRM8A%3D%3D', pcapPages: 80, readFrom: PLACSP_READ,
    docs: [ppt('MQctQlMdz83d5HaeBsigzQvt6i7rT%2BSR6kpMa0xBlL80j9NSW7fBPKOlSOyI426BlqKOpiIKDNeYnBpIBdfd0BBLP%2BvwLQz8saxkC2eUE5L3GVhXrFFqN7yFncy7YfRK'), pcap('UbAsMLz%2BmSCPPobYQz%2BK%2BDHkGavHrJWcOH/LgbPm9htOASHKizOVCY8U%2BgzR54PLuea4qcNo6BH2yNkA1RdDMyLVvxN3vTJc1d33DxycJJ76CYyL7SIrUOBFfNf52ZqA')],
    otherDocs: ['Anexo I', 'Anexos (Word)', 'Composición de la mesa de contratación'],
    plain: 'Mantenimiento de jardines interiores y exteriores, riego y desbroce del Departamento de Salud Alicante-Hospital General. 3 años con una prórroga.',
    facts: [['Presupuesto base (sin IVA)', '498.999,99 €'], ['Valor estimado', '741.799,99 €'], ['Duración', '36 meses + 12 meses'], ['Garantía definitiva', '5 %'], ['Criterios', 'Precio 55 · boceto paisajístico 35 · emisiones 10'], ['Fin de presentación', '8/10/2026, 23:59']],
    asks: ['Volumen anual de negocio en el mejor de los 3 últimos ejercicios (Documento de pliegos).', 'Servicios similares de los últimos 3 años con importe, fecha y destinatario (Documento de pliegos).', 'Priorizar especies autóctonas o de bajo consumo de agua (condición especial de ejecución).'],
    watch: ['Hay subrogación de personal (PCAP, cláusula 13).', 'El boceto paisajístico (35 puntos) va en un sobre aparte de la oferta económica.'],
  },
  '668262-2026': {
    source: 'placsp', page: PLD + 'aUvh3eoeBTEzjChw4z%2FXvw%3D%3D', pcapPages: 73, readFrom: PLACSP_READ,
    docs: [ppt('OgLcxuDP/hyrLxsq0ut1HOgCqOzisvz4PhvkBX%2BVHOleMeYoy3XrelfMbn3uGB32rWbl7QvmyOfR4zdOISQVGpCplbrvNFq402SIZgjpQDV7QB3HKyQaFUExmUVQCerk'), pcap('l3ocH%2BwozFz%2BtdEIa3ymNBcVN9GMsshkFpr5Dw9Wea4qERG%2Buhz68xwUIcbfP%2BX/G//sUD%2BrLkEZ9Lkby4QE/Iy7evOO8Ui3TWj6IEgMX3J45ClyWkoJ44mKM70IFcOu')],
    otherDocs: ['Memoria justificativa lote 1', 'Memoria justificativa lote 2', 'Memoria justificativa lote 3'],
    plain: 'Limpieza de tres centros del CSIC: Instituto de la Grasa en Sevilla, CEBAS en Murcia y Unidad de Tecnología Marina en Vigo. 18 meses con prórrogas.',
    facts: [['Presupuesto base (sin IVA)', '990.338 €'], ['Valor estimado', '2.376.811,20 €'], ['Duración', '18 meses + hasta 18 de prórroga'], ['Garantía', 'Definitiva 5 % + complementaria 5 %'], ['Criterios', 'Precio 58 · control 18 · mejoras 14 · bolsa de horas 10'], ['Fin de presentación', '5/10/2026, 14:00']],
    asks: ['Clasificación U1 (limpieza) de la categoría correspondiente a cada lote (lote 1: U1-3).', 'Trabajos realizados según el anexo 3 del PCAP.', 'Mantener al personal que inicie el contrato (condición especial de ejecución).'],
    watch: ['Hay subrogación de personal (PCAP, p. 39).', 'Oferta anormalmente baja solo por precio (PCAP, 15.1).', 'El plazo termina el 5 de octubre.'],
  },
  '624271-2026': {
    source: 'placsp', page: PLD + 'Pz3k1NalL1oUqXM96WStVA%3D%3D', pcapPages: 90, readFrom: PLACSP_READ,
    docs: [ppt('lYiNi4UNrRI8x9A%2BkmfgMR3DXVg/xBG9qrXOCNk8bebY19k5UAr2gRi4YbuxTNrEhara6ZWre/5wM0sooYcxCQF6BEj2YJcXNuX3oxMJfRwC1/zDIE0Kw/PWNnLS0Z0z'), pcap('YRxXeDDeXZ68EUPkXeNWah6HWKXQTze3HwExd2PaxNgqpaauKO/Y9/aDZrv85yuPqJeepU40aBxRBUNJzqoX8StWy79r3IOfz/nIdP8vL0%2BB0nvVKRzfe4rpHcnlPhSZ')],
    otherDocs: ['Memoria justificativa', 'Informe de insuficiencia de medios', 'Presupuesto'],
    plain: 'Limpieza de las Jefaturas y oficinas de Tráfico de la Comunitat Valenciana (lote 1) y la Región de Murcia (lote 2). 1 año con hasta 4 prórrogas.',
    facts: [['Presupuesto base (sin IVA)', '750.833,51 €'], ['Valor estimado', '3.754.167,55 €'], ['Duración', '1 año + 4 prórrogas'], ['Garantía definitiva', '5 %'], ['Criterios', 'Precio 70 · oferta técnica 30'], ['Sobres', '2 electrónicos (PCAP, p. 11)']],
    asks: ['Cifra anual de negocio y trabajos realizados según la cláusula 7 del cuadro de características.'],
    watch: ['El presupuesto ya incluye un aumento salarial del 12 % del personal a subrogar (PCAP, p. 6).'],
  },
  '623696-2026': {
    source: 'placsp', page: PLD + 'bqgfkZi7VeqP66GS%2BONYvQ%3D%3D', pcapPages: 70, readFrom: PLACSP_READ,
    docs: [ppt('AOoph1R9IlLqjeHh7s48IlCAWKhthCilngJ44JYBvT3yRvjMSKtsWXJe6oTTYEQN79zo/ZPC1ybSyMavix1F3K/iyJQn7hFcsPtq/ZF3WlWHAj0WEJrB5sP7amrh2jBD'), pcap('4ffGcMwacKjTPeGp2snk9c0hc8zL%2BJaBtTeFFYJ6LTVZsU8GQPR8C1cp/fWZK/FpBnbGWtl1jRv5kvDN3qnJfg2D6GmaTUsbRvPke1E5GVd45ClyWkoJ44mKM70IFcOu')],
    otherDocs: ['Memoria justificativa', 'Relación de personal de limpieza (Fundación Municipal de Cultura)', 'Relación de personal de limpieza (Ayuntamiento)'],
    plain: 'Limpieza de edificios municipales, de la Fundación Municipal de Cultura y de la Fundación Deportiva de Avilés. 1 año con una prórroga.',
    facts: [['Presupuesto base (sin IVA)', '2.189.656,92 €'], ['Valor estimado', '4.817.245,23 €'], ['Duración', '1 año + 1 prórroga'], ['Garantía definitiva', '5 %'], ['Criterios', 'Precio 95 · horas de libre disposición 5'], ['Apertura de ofertas', '27/10/2026, 09:00']],
    asks: ['Cifra anual de negocio y trabajos realizados según el PCAP.'],
    watch: ['Subrogación obligatoria: la plantilla actual está en el anexo IV del PCAP (PCAP, p. 10).', 'Prácticamente todo es precio.'],
  },
  '652224-2026': {
    source: 'placsp', page: PLD + 'uA6gxA3ztn2opEMYCmrbmw%3D%3D', pcapPages: 69, readFrom: PLACSP_READ,
    docs: [pcap('DMH%2BamD6PuuYEh6UABSunvL/%2BgocJJG8p/HX6hthM71rYdeuXSVpS6EcB3Wcd7UhTE6Qt3gkpqjc1hm85HJewr8LpW6KOdA%2BGCR3HIbXt1HfdyQgZAdTm3EfcUAC7CJ6')],
    otherDocs: ['Anexo I', 'Anexo II', 'Anexo III', 'Anexo IV'],
    plain: 'Obra del depósito regulador de agua del polígono de Arinaga (lote 1) y dirección de ejecución y coordinación de seguridad y salud (lote 2), para el Ayuntamiento de Agüimes.',
    facts: [['Presupuesto base (sin IVA)', '8.172.656,49 €'], ['Duración', '27 meses'], ['Clasificación', 'C2-6 · estructuras de fábrica u hormigón'], ['Apertura de ofertas', '30/10/2026, 11:00']],
    asks: ['Clasificación C2-6 para la obra (Documento de pliegos).', 'Lote 2: seguro de indemnización y títulos de los responsables (cláusula 4 del PCAP).'],
    watch: ['El proyecto de obra no está entre los documentos enlazados: consúltalo en la plataforma.'],
  },
  '669659-2026': {
    source: 'placsp', page: PLD + 'LJoj%2Fcc6LKTCfVQHDepjGQ%3D%3D', pcapPages: 47, readFrom: PLACSP_READ,
    docs: [ppt('fJqbUjF6cDOUxCXD5cDNJwAEpfqxF1UK7uhWxIvK1VCm3M6sd%2B2DFyKnYB/%2BJW8SYC/hxqwbimCVipc8ISCpvotec7KOIUkpEPkjchMLXoLfdyQgZAdTm3EfcUAC7CJ6'), pcap('WM8wo/a7AXFNUvmlX48/GtvGSJZEgSvhd%2BCPCN8orLdwEKex25i5wnFRT0VlMtBSN8YAEUoAY%2B3Q/wfcJpL00b%2BUJVn3PqW7F%2Bunxl2v629t/o8fNevwsujgRzaBbugn')],
    otherDocs: ['Certificado del acuerdo de convocatoria', 'Memoria de inicio', 'Modelo de proposición'],
    plain: 'Mantenimiento integral de los ascensores y aparatos elevadores del Ayuntamiento de Alicante, en 2 lotes. 3 años con dos prórrogas anuales.',
    facts: [['Presupuesto base (sin IVA)', '749.969,91 €'], ['Valor estimado', '1.449.839,82 €'], ['Duración', '3 años + 2 prórrogas'], ['Garantía definitiva', '5 %'], ['Apertura de ofertas', '11/11/2026, 10:00']],
    asks: ['Relación de servicios similares de los últimos 3 años (Documento de pliegos).'],
    watch: ['No hay subrogación ni cesión del contrato (PCAP, p. 8).'],
  },
  '656073-2026': {
    source: 'placsp', page: PLD + 'DA8%2Byl9%2FHPAUqXM96WStVA%3D%3D', pcapPages: 108, readFrom: PLACSP_READ,
    docs: [ppt('MPk6/HF5qnVP1sGqAHKI3vPlaF0%2BLTpZkEJIIo5XqGVrhyunBOERcFSFWAW5zLfJRvLBrVA2dzSh6%2BeSBTDasgyULnL6u0K%2Bx/xOE91/UT17QB3HKyQaFUExmUVQCerk'), pcap('D3/xGp4Zap4lMIPFlPLxsmCe0g5qJwpJioU0XfetbhT80M1ogkvm4D%2BiTSAhumCW4VEVfgT05senn9yPunxcCT/GDDoJCnxCE8eqV%2BDFdq6Cx2e6p7hqtlp2aFupgHMr')],
    otherDocs: ['Memoria justificativa', 'Informe de insuficiencia de medios', 'Nota informativa de la visita del lote 1'],
    plain: 'Mantenimiento integral de las sedes centrales del Ministerio de la Presidencia: edificios (lote 1), dos CPD (lote 2) y protección contra incendios (lote 3). 24 meses.',
    facts: [['Presupuesto base (sin IVA)', '2.088.466,65 €'], ['Valor estimado', '4.176.933,30 €'], ['Duración', '24 meses'], ['Garantía definitiva', '5 %'], ['Apertura de ofertas', '27/10/2026, 10:00']],
    asks: ['Volumen anual de negocio de al menos 1,5 veces el valor anual medio del contrato (Documento de pliegos).', 'Clasificación P3-2 (climatización) (Documento de pliegos).', 'Certificado de visita a las instalaciones firmado por el responsable del contrato (PCAP, p. 15).'],
    watch: ['La visita es requisito: consulta la nota informativa de la visita del lote 1.', 'Documentación en formato electrónico o papel 100 % reciclado (condición especial).'],
  },
  '672034-2026': {
    source: 'placsp', page: PLD + 'pqeo19dBZJmGCFcHcNGIlQ%3D%3D', pcapPages: 62, readFrom: PLACSP_READ,
    docs: [ppt('VB6hfr1iVLV1PAsWi7nG3kKnCyjt5sZm1cpkegNgbQcpV3WnAUHLKzkzJyCpV8FfUNMfbUnb01gb6TW2BAMtk9iqUBgU6dmqcllv1RkLpz6B0nvVKRzfe4rpHcnlPhSZ'), pcap('/fwnC9iZmVm2l/1fdM/2mgl6qmNbnoTmpmYI0WKf5LKmNkXU1SnROKLr89b9EKEoUJgarmYVxbcRCEXQjT2wwesa8pLTV3PnKMsK/fdA1j5t/o8fNevwsujgRzaBbugn')],
    otherDocs: ['Memoria justificativa', 'Anexo I lote 1', 'Anexo I lote 2'],
    plain: 'Conservación arquitectónica de inmuebles de Patrimonio Nacional (Madrid, El Pardo, Aranjuez, El Escorial, La Granja, Yuste y Palma) en 7 lotes. 12 meses.',
    facts: [['Valor estimado', '7.200.000 €'], ['Lotes', '7 (de 300.000 € a 1.800.000 €)'], ['Duración', '12 meses'], ['Garantía definitiva', '5 %'], ['Criterios', 'Precio 60 · memoria de actuación 40'], ['Apertura de ofertas', '26/11/2026, 10:00']],
    asks: ['Cifra anual de negocio (apartado I.1) y trabajos realizados (apartado I.2) del PCAP, con umbrales por lote.'],
    watch: ['Umbral de anormalidad del 10 % (PCAP, O.5).'],
  },
  '651195-2026': {
    source: 'placsp', page: PLD + 'DiF0fW09ZBHmnwcj%2BxbdTg%3D%3D', pcapPages: 82, readFrom: PLACSP_READ,
    docs: [ppt('/%2BNhtIbkvyV2tiJpGRE1TzBD62yKf3b8fvtxZRz1HffCp1MCZKVZLjqQREex7KIY11tnY/ozYF9ycq2i2kbuJtPhuHgVhyDUhnF4kB4KUn1JOVDbGCDM%2BMigrvuVS7Rv'), pcap('OvcpVqh52xmzPGIHGfE47oUwbTGOfwTjgjDYvYU4QkdOh/FUpXjt7YbajjAqBT8GtXovT7zJboNQDyYqtDxrxB7dx7fe/AI6HqXM%2Bi9%2BxfB45ClyWkoJ44mKM70IFcOu')],
    otherDocs: ['Anexo 10', 'Anexo 11', 'Anexo 12'],
    plain: 'Agencia de viajes (lote 1), receptivos en destino con alojamiento, transporte y restauración (lote 2) y organización de eventos (lote 3) del Patronato de Turismo de Cádiz. 2 años con prórroga de 2 años.',
    facts: [['Presupuesto base (sin IVA)', '1.389.955,98 €'], ['Valor estimado', '3.335.894,35 €'], ['Duración', '24 meses + 24 de prórroga'], ['Garantía definitiva', '5 %'], ['Apertura de ofertas', '6/11/2026, 09:00']],
    asks: ['Cifra anual de negocio y trabajos realizados según el PCAP.', 'Lenguaje no sexista e imágenes sin estereotipos (condición especial).'],
    watch: ['El lote 3 (eventos) es el mayor: 1.983.471,07 € de valor estimado.'],
  },
};

export function briefFor(id: string): TenderBrief | undefined { return TENDER_BRIEFS[id]; }
