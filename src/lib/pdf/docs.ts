// Documentos PDF del paquete de presentación, maquetados con la marca del licitador (logo y color).
import type { AppState, Project } from '../types';
import { complianceChecks, readiness } from '../derive';
import { fmtDate, nowIso, isUnknown } from '../util';
import { newDoc, cover, tocPlaceholder, finish, h1, h2, text, bullet, body, note, table, facts, space, addPage, clean, bars, orgChart } from './kit';
import { rgb } from 'pdf-lib';
import { eur2, eurosInWords } from '../pricing';

function plainSection(content: string) {
  return content.replace(/\s?\[S\d+\]/g, '').replace(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g, '[INFORMACIÓN REQUERIDA: $1]');
}
const reference = (p: Project) => (!isUnknown(p.analysis?.reference) ? p.analysis!.reference : p.tender?.live?.ref || '');
const today = () => fmtDate(nowIso());

/** Memoria técnica: portada, índice, datos de la oferta, correspondencia con criterios, secciones y anexos de empresa. */
/** El título oficial entero: el nombre del proyecto se acorta para las pantallas. */
const fullTitle = (p: Project) => (p.name.endsWith('…') && p.tender?.title ? p.tender.title.replace(/\s+/g, ' ').trim() : p.name);

export async function technicalProposalPdf(p: Project, s: AppState) {
  const c = s.company;
  const w = await newDoc(`Memoria técnica — ${p.name}`, c, { cover: true, project: p, technical: true });
  const anon = w.theme.anonymous;   // el pliego exige que la oferta técnica no identifique al licitador
  cover(w, {
    kind: 'Memoria técnica', title: fullTitle(p),
    lines: [['Órgano de contratación', p.organization], ['Expediente', reference(p)], ...(anon ? [] : [['Licitador', `${c.legalName || '[razón social]'}${c.taxId ? ` · NIF ${c.taxId}` : ''}`], ['Domicilio', c.address]] as [string, string][]), ['Fecha', today()]],
    footnote: anon ? 'Documento sin identificación del licitador, como exige el pliego.' : undefined,
  });
  tocPlaceholder(w);

  h1(w, 'Datos de la oferta');
  facts(w, [
    ['Objeto del contrato', fullTitle(p)], ['Órgano de contratación', p.organization], ['Expediente', reference(p)],
    ['Fin de presentación de ofertas', p.analysis?.deadline ? fmtDate(p.analysis.deadline) : ''], ['Duración', p.analysis?.duration ?? ''],
    ...(anon ? [] : [['Licitador', c.legalName], ['NIF', c.taxId], ['Domicilio', c.address], ['Web', c.website]] as [string, string][]),
  ]);
  const judged = p.criteria.filter((k) => k.kind === 'judgement');
  if (judged.length) {
    h2(w, 'Correspondencia con los criterios de adjudicación');
    text(w, 'Esta memoria sigue los criterios sujetos a juicio de valor del pliego. La tabla indica en qué apartado se responde a cada uno.', { size: 10, gap: 8 });
    table(w, [{ title: 'Criterio', w: 46 }, { title: 'Puntos', w: 12, align: 'right' }, { title: 'Se responde en', w: 42 }],
      judged.map((k) => {
        const secs = p.sections.map((x, i) => ({ x, i })).filter(({ x }) => x.criteria.includes(k.id) || k.addressedBy.includes(x.id));
        return [k.name, String(k.points).replace('.', ','), secs.length ? secs.map(({ x, i }) => `${i + 1}. ${x.title}`).join('; ') : 'Conjunto de la memoria'];
      }));
    if (judged.length > 1) bars(w, judged.map((k) => ({ label: k.name, value: k.points })), { unit: 'pts', caption: 'Puntos máximos de cada criterio de juicio de valor, según el pliego.' });
  }

  p.sections.forEach((sec, i) => {
    h1(w, `${i + 1}. ${sec.title}`, { tag: sec.status !== 'approved' ? 'BORRADOR — SECCIÓN SIN APROBAR' : undefined });
    const crit = p.criteria.filter((k) => sec.criteria.includes(k.id));
    if (crit.length) note(w, crit.map((k) => `${k.name} (${String(k.points).replace('.', ',')} puntos)`).join(' · '), { label: crit.length > 1 ? 'Criterios que se valoran en este apartado' : 'Criterio que se valora en este apartado' });
    if (!sec.content.trim()) text(w, '[Sección todavía sin redactar]', { italic: true, color: [0.6, 0.35, 0.05] });
    else body(w, plainSection(sec.content));
  });

  // Anexos: la memoria de empresa que respalda lo afirmado en las secciones. Con anonimato, no van en este documento.
  if (anon) return finish(w);
  h1(w, 'Anexo A. Ficha de la empresa', { newPage: true });
  if (c.description) text(w, c.description, { gap: 10 });
  facts(w, [['Razón social', c.legalName], ['Nombre comercial', c.tradeName !== c.legalName ? c.tradeName : ''], ['NIF', c.taxId], ['Domicilio', c.address], ['Sector', c.industry], ['Plantilla', c.employees ? `${c.employees} personas` : ''], ['Ámbitos de actividad', c.sectors.join(', ')], ['Web', c.website]]);
  if (c.capabilities.length) { h2(w, 'Capacidades'); c.capabilities.forEach((x) => bullet(w, x)); space(w, 8); }

  if (s.team.length) {
    h1(w, 'Anexo B. Equipo adscrito al contrato');
    text(w, 'Personas de la plantilla que asumirán la dirección y la ejecución del contrato.', { size: 10, gap: 10 });
    if (s.team.length > 1) orgChart(w, s.team);
    table(w, [{ title: 'Nombre', w: 24, bold: true }, { title: 'Función', w: 30 }, { title: 'Experiencia', w: 14 }, { title: 'Titulación y cualificación', w: 32 }],
      s.team.map((m) => [m.name, m.role, m.years ? `${m.years} años` : '—', m.qualifications || '—']));
  }
  if (s.pastProjects.length) {
    h1(w, 'Anexo C. Experiencia en contratos similares');
    table(w, [{ title: 'Contrato', w: 36, bold: true }, { title: 'Cliente', w: 28 }, { title: 'Periodo', w: 14 }, { title: 'Importe anual', w: 22, align: 'right' }],
      s.pastProjects.map((x) => [x.title, x.client || '—', x.years || '—', x.value || '—']));
    s.pastProjects.filter((x) => x.description).forEach((x) => { h2(w, x.title); text(w, x.description, { size: 10 }); });
  }
  if (s.certifications.length) {
    h1(w, 'Anexo D. Certificaciones');
    table(w, [{ title: 'Certificación', w: 50, bold: true }, { title: 'Entidad', w: 28 }, { title: 'Vigencia', w: 22 }],
      s.certifications.map((x) => [x.name, x.issuer || '—', x.validUntil ? `Hasta ${fmtDate(x.validUntil)}` : '—']));
  }
  const proven = p.requirements.filter((r) => r.status === 'fulfilled' && r.category !== 'format' && r.evidence.length);
  if (proven.length) {
    h1(w, 'Anexo E. Requisitos del pliego y su acreditación');
    text(w, 'Relación de los requisitos del pliego que la empresa acredita y el documento o dato que lo respalda.', { size: 10, gap: 8 });
    table(w, [{ title: 'Requisito', w: 34, bold: true }, { title: 'Referencia', w: 24 }, { title: 'Acreditación', w: 42 }],
      proven.map((r) => [r.title, `${r.source.docName.replace(/\.(pdf|txt|docx)$/i, '')}, p. ${r.source.page}`, r.evidence.map((e) => e.label).join('; ')]));
  }
  return finish(w);
}

export async function declarationPdf(p: Project, s: AppState) {
  const c = s.company;
  const w = await newDoc(`Declaración responsable — ${p.name}`, c, { project: p });
  h1(w, 'Declaración responsable');
  note(w, 'Borrador preparado por PROPO con tu perfil de empresa. Revísalo, completa los datos del representante y fírmalo con firma electrónica cualificada antes de presentarlo.', { label: 'Antes de firmar' });
  h2(w, 'Datos del procedimiento');
  facts(w, [['Objeto del contrato', fullTitle(p)], ['Órgano de contratación', p.organization], ['Expediente', reference(p)]]);
  h2(w, 'Datos del licitador');
  facts(w, [['Razón social', c.legalName || '[razón social]'], ['NIF', c.taxId || '[NIF]'], ['Domicilio', c.address || '[domicilio social]'], ['Representante legal', c.signer || '[nombre y apellidos]'], ['DNI del representante', c.signerId || '[número]'], ['En calidad de', c.signerRole || '[administrador / apoderado]']]);
  text(w, `D./D.ª ${c.signer || '[nombre del representante legal]'}, en nombre y representación de **${c.legalName || '[razón social]'}**, en relación con el procedimiento arriba indicado,`, { gap: 10 });
  text(w, 'DECLARA BAJO SU RESPONSABILIDAD:', { bold: true, gap: 8 });
  [
    'Que la empresa está válidamente constituida, que su objeto social comprende las prestaciones del contrato y que quien firma tiene poder bastante para representarla.',
    'Que la empresa tiene plena capacidad de obrar y no está incursa en ninguna de las prohibiciones de contratar previstas en la legislación de contratos del sector público.',
    'Que la empresa está al corriente de sus obligaciones tributarias y con la Seguridad Social.',
    'Que la empresa cumple los requisitos de solvencia económica, financiera y técnica o profesional exigidos en el pliego, y que aportará los documentos acreditativos cuando el órgano de contratación se lo requiera.',
    'Que la empresa dispone de las autorizaciones y habilitaciones necesarias para ejecutar el contrato.',
    'Que la empresa cumple las obligaciones vigentes en materia laboral, de igualdad entre mujeres y hombres, de prevención de riesgos laborales y de protección de datos, y aplica el convenio colectivo que corresponde.',
    'Que la empresa se compromete a adscribir a la ejecución del contrato los medios personales y materiales indicados en su oferta.',
    'Que la oferta se ha elaborado de forma independiente, sin acuerdos con otros licitadores que restrinjan la competencia.',
    'Que la empresa acepta incondicionalmente el contenido de los pliegos y se somete a la jurisdicción de los juzgados y tribunales españoles.',
    'Que la dirección de correo electrónico indicada es válida para recibir las notificaciones del procedimiento.',
  ].forEach((t, i) => text(w, `**${i + 1}.** ${t}`, { indent: 6, gap: 6 }));
  space(w, 14);
  text(w, 'Y para que conste, firma la presente declaración.', { gap: 18 });
  table(w, [{ title: 'Lugar y fecha', w: 40 }, { title: 'Firma del representante legal', w: 60 }], [['\n\n\n', '\n\n\n']]);
  return finish(w);
}

export async function experiencePdf(p: Project, s: AppState) {
  const c = s.company;
  const w = await newDoc(`Experiencia relevante — ${c.legalName}`, c, { cover: true, project: p });
  cover(w, { kind: 'Relación de contratos similares', title: fullTitle(p), lines: [['Órgano de contratación', p.organization], ['Expediente', reference(p)], ['Licitador', `${c.legalName}${c.taxId ? ` · NIF ${c.taxId}` : ''}`], ['Fecha', today()]] });
  h1(w, 'Experiencia en contratos similares');
  text(w, `${c.legalName || 'La empresa'} acredita la siguiente experiencia en contratos de naturaleza análoga a la del objeto de esta licitación.`, { gap: 10 });
  table(w, [{ title: 'Contrato', w: 32, bold: true }, { title: 'Cliente', w: 25 }, { title: 'Periodo', w: 13 }, { title: 'Importe anual', w: 17, align: 'right' }, { title: 'Certificado', w: 13 }],
    s.pastProjects.map((x) => [x.title, x.client || '—', x.years || '—', x.value || '—', x.hasCertificate ? 'Disponible' : 'A solicitar']));
  h1(w, 'Detalle de los contratos');
  s.pastProjects.forEach((x) => {
    h2(w, x.title);
    facts(w, [['Cliente', x.client], ['Periodo', x.years], ['Importe anual', x.value], ['Sector', x.sector], ['Certificado de buena ejecución', x.hasCertificate ? 'Disponible; se aporta a requerimiento del órgano de contratación' : 'Pendiente de solicitar al cliente']]);
    if (x.description) text(w, x.description, { gap: 12 });
  });
  return finish(w);
}

export async function companyIndexPdf(p: Project, s: AppState) {
  const w = await newDoc(`Documentación de empresa — ${s.company.legalName}`, s.company, { project: p });
  h1(w, 'Documentación de empresa');
  text(w, `Índice de los documentos de ${s.company.legalName || 'la empresa'} que acreditan los requisitos de «${p.name}».`, { gap: 10 });
  const ids = new Set(p.requirements.flatMap((r) => r.evidence.filter((e) => e.kind === 'vault').map((e) => e.ref)));
  table(w, [{ title: 'N.º', w: 6 }, { title: 'Documento', w: 34, bold: true }, { title: 'Requisito que acredita', w: 36 }, { title: 'Validez', w: 12 }, { title: 'En el paquete', w: 12 }],
    s.vault.filter((v) => ids.has(v.id)).map((v, i) => [
      String(i + 1), v.name, p.requirements.filter((r) => r.evidence.some((e) => e.ref === v.id)).map((r) => r.title).join('; '),
      v.expiresAt ? fmtDate(v.expiresAt, { day: 'numeric', month: 'short', year: 'numeric' }) : '—', v.hasFile ? 'Incluido' : 'Adjuntar',
    ]));
  return finish(w);
}

export async function complianceReportPdf(p: Project, s?: AppState) {
  const w = await newDoc(`Informe de cumplimiento — ${p.name}`, s?.company ?? ({ legalName: 'Informe interno', tradeName: '' } as any), { project: p });
  h1(w, 'Informe de cumplimiento');
  const checks = complianceChecks(p);
  const fulfilled = p.requirements.filter((r) => r.status === 'fulfilled').length;
  note(w, `${p.name}. Preparación: ${readiness(p)} %. ${fulfilled} de ${p.requirements.length} requisitos cumplidos. Generado el ${today()}.`, { label: 'Documento interno · no presentar' });
  h2(w, 'Comprobaciones finales');
  table(w, [{ title: 'Estado', w: 14, bold: true }, { title: 'Comprobación', w: 36 }, { title: 'Detalle', w: 50 }],
    checks.map((c) => [c.state === 'pass' ? 'Correcto' : c.state === 'warn' ? 'Revisar' : 'Pendiente', c.label, c.detail]));
  h2(w, 'Requisitos');
  table(w, [{ title: 'Estado', w: 14, bold: true }, { title: 'Requisito', w: 34 }, { title: 'Origen', w: 20 }, { title: 'Pruebas', w: 32 }],
    p.requirements.map((r) => [
      r.status === 'fulfilled' ? 'Cumplido' : r.status === 'needs_info' ? 'Falta información' : r.status === 'missing' ? 'Falta' : 'Omitido',
      r.title, `${r.source.docName.replace(/\.(pdf|txt|docx)$/i, '')}, p. ${r.source.page}`, r.evidence.map((e) => e.label).join('; ') || '—',
    ]));
  if (p.analysis?.exclusionRisks.length) {
    h2(w, 'Riesgos de exclusión detectados en el pliego');
    p.analysis.exclusionRisks.forEach((e) => bullet(w, e.text));
  }
  return finish(w);
}

/** Oferta económica (proposición económica) con el precio que el cliente ha confirmado en el paso «Fija el precio». */
export async function economicOfferPdf(p: Project, s: AppState) {
  const c = s.company; const pr = p.pricing; const ch = pr?.choice; const rule = pr?.rule;
  const w = await newDoc(`Oferta económica — ${p.name}`, c, { project: p });
  h1(w, 'Proposición económica');
  note(w, rule?.model
    ? `Preparada por PROPO con el precio que has confirmado. El pliego tiene su propio modelo (${rule.model.name}): si la plataforma exige ese modelo, copia en él estos mismos importes. Firma con firma electrónica cualificada y preséntala solo en el sobre de la oferta económica.`
    : 'Preparada por PROPO con el precio que has confirmado. Revísala, fírmala con firma electrónica cualificada y preséntala solo en el sobre de la oferta económica, nunca en el técnico.', { label: 'Antes de firmar' });
  h2(w, 'Datos del procedimiento');
  facts(w, [['Objeto del contrato', fullTitle(p)], ['Órgano de contratación', p.organization], ['Expediente', reference(p)]]);
  h2(w, 'Datos del licitador');
  facts(w, [['Razón social', c.legalName || '[razón social]'], ['NIF', c.taxId || '[NIF]'], ['Domicilio', c.address || '[domicilio social]'], ['Representante legal', c.signer || '[nombre y apellidos]'], ['DNI del representante', c.signerId || '[número]']]);
  if (!ch) { text(w, 'Todavía no se ha fijado el precio de la oferta.', { gap: 10 }); return finish(w); }
  const vat = rule?.vat ?? 21;
  const iva = Math.round(ch.total * vat) / 100;
  const tot = Math.round((ch.total + iva) * 100) / 100;
  const onlyUnits = !ch.total && ch.units.length > 0;   // contratos por precios unitarios sin importe total
  text(w, `D./D.ª ${c.signer || '[nombre del representante legal]'}, en nombre y representación de **${c.legalName || '[razón social]'}**, enterado/a del anuncio y de los pliegos que rigen la contratación arriba indicada, cuyo contenido acepta íntegramente, se compromete a ejecutar el contrato con estricta sujeción a ellos por ${onlyUnits ? 'los siguientes precios unitarios' : 'el siguiente precio'}:`, { gap: 10 });
  if (!onlyUnits) {
    table(w, [{ title: 'Concepto', w: 52, bold: true }, { title: 'Importe', w: 48, align: 'right' }], [
      ['Precio sin IVA', eur2(ch.total)],
      [`IVA (${vat} %)`, eur2(iva)],
      ['Precio total, IVA incluido', eur2(tot)],
    ]);
    text(w, `Precio sin IVA, en letra: **${eurosInWords(Math.round(ch.total * 100) / 100)}**.`, { gap: 4 });
    text(w, `Precio total con IVA, en letra: **${eurosInWords(tot)}**.`, { gap: 10 });
  }
  if (ch.discount != null) text(w, `Porcentaje de baja único ofertado, aplicado a todos los precios máximos unitarios del pliego: **${(Math.round(ch.discount * 10000) / 100).toLocaleString('es-ES')} %**.`, { gap: 6 });
  if (ch.units.length) {
    h2(w, ch.discount != null ? 'Precios unitarios resultantes' : 'Precios unitarios');
    table(w, [{ title: 'Concepto', w: 46 }, { title: 'Precio sin IVA', w: 18, align: 'right' }, { title: `IVA (${vat} %)`, w: 16, align: 'right' }, { title: 'Con IVA', w: 20, align: 'right' }],
      ch.units.map((u) => { const i = Math.round(u.price * vat) / 100; return [u.label, eur2(u.price), eur2(i), eur2(Math.round((u.price + i) * 100) / 100)]; }));
  }
  const others = (rule?.others ?? []).filter((o) => pr?.others?.[o.id]?.formal);
  if (others.length) {
    h2(w, 'Otros criterios evaluables mediante fórmula');
    others.forEach((o) => text(w, `**${o.label}.** ${pr!.others[o.id].formal}`, { gap: 6 }));
  }
  space(w, 10);
  text(w, 'El precio ofertado incluye todos los gastos necesarios para la ejecución del contrato conforme a los pliegos, incluidos los costes salariales derivados del convenio colectivo de aplicación.', { gap: 18 });
  table(w, [{ title: 'Lugar y fecha', w: 40 }, { title: 'Firma del representante legal', w: 60 }], [['\n\n\n', '\n\n\n']]);
  return finish(w);
}

/** Borrador de justificación de la oferta, por si la Administración la considera anormalmente baja y la pide. */
export async function abnormalJustificationPdf(p: Project, s: AppState) {
  const c = s.company; const ch = p.pricing?.choice;
  const w = await newDoc(`Justificación de la oferta — ${p.name}`, c, { project: p });
  h1(w, 'Justificación de la viabilidad de la oferta');
  note(w, 'Borrador para tener preparado. Solo se presenta si el órgano de contratación te pide justificar tu oferta por considerarla anormalmente baja (suelen dar entre 5 y 10 días). Completa los datos entre corchetes con tus números reales.', { label: 'Uso interno hasta que te lo pidan' });
  facts(w, [['Contrato', fullTitle(p)], ['Expediente', reference(p)], ['Licitador', `${c.legalName || '[razón social]'}${c.taxId ? ` · NIF ${c.taxId}` : ''}`], ['Precio ofertado sin IVA', ch ? eur2(ch.total) : '[importe]']]);
  text(w, `En respuesta al requerimiento recibido, ${c.legalName || 'la empresa'} justifica que su oferta es viable y que permite ejecutar el contrato con plena calidad y cumpliendo todas las obligaciones legales, por los siguientes motivos (art. 149 de la Ley 9/2017):`, { gap: 10 });
  [
    ['Ahorro en el método de ejecución', 'Explica cómo organizáis el servicio para que os cueste menos: experiencia previa en contratos iguales, medios propios ya amortizados, rutas o turnos optimizados. [completa con vuestro caso]'],
    ['Condiciones favorables de la empresa', 'Proveedores con precios negociados, cercanía al lugar de ejecución, compras agrupadas o economías de escala. [completa]'],
    ['Cumplimiento de las obligaciones laborales y sociales', 'El precio cubre los costes salariales del convenio colectivo de aplicación y la subrogación del personal, si la hay. Adjunta el desglose: [n.º de personas × horas × coste/hora según convenio = importe].'],
    ['Cumplimiento ambiental y de seguridad', 'Indica que el precio incluye prevención de riesgos laborales, seguros y obligaciones ambientales. [completa]'],
    ['Desglose de costes', 'Personal: [importe] · Materiales y suministros: [importe] · Medios y equipos: [importe] · Gastos generales: [importe] · Beneficio industrial: [importe] · Total: ' + (ch ? eur2(ch.total) : '[importe]')],
  ].forEach(([t, d]) => { h2(w, t); text(w, d, { gap: 8 }); });
  space(w, 10);
  table(w, [{ title: 'Lugar y fecha', w: 40 }, { title: 'Firma del representante legal', w: 60 }], [['\n\n\n', '\n\n\n']]);
  return finish(w);
}

/** Plan de obra: justificación y diagrama de Gantt con el camino crítico, para el sobre técnico. */
export async function ganttPdf(p: Project, s: AppState) {
  const g = p.obra?.gantt;
  const w = await newDoc(`Plan de obra — ${p.name}`, s.company, { project: p, technical: true });
  h1(w, 'Plan de obra y programa de trabajos');
  facts(w, [['Obra', fullTitle(p)], ...(w.theme.anonymous ? [] : [['Licitador', s.company.legalName || '[razón social]']] as [string, string][]), ['Plazo de ejecución', g ? `${g.total} días naturales${g.plazo ? ` (máximo del pliego: ${g.plazo})` : ''}` : '—']]);
  if (!g) { text(w, 'Todavía no se ha preparado el plan de obra.'); return finish(w); }
  h2(w, 'Diagrama de Gantt');
  // Dibujo del diagrama: nombres a la izquierda, barras a la derecha; en rojo el camino crítico.
  const L = 56, NAME = 175, X0 = L + NAME, X1 = 595 - 56, RH = 15;
  const span = Math.max(1, g.total); const step = span > 240 ? 30 : span > 90 ? 14 : 7;
  const xs = (d: number) => X0 + (d / span) * (X1 - X0);
  const red = rgb(0.85, 0.18, 0.14); const blue = rgb(w.brand.color[0], w.brand.color[1], w.brand.color[2]); const grey = rgb(0.86, 0.88, 0.91);
  const header = () => {
    space(w, 4);
    for (let d = 0; d <= span; d += step) { w.page.drawText(clean(`día ${d}`), { x: xs(d) + 1, y: w.y, size: 6.5, font: w.font, color: rgb(0.42, 0.45, 0.5) }); }
    space(w, 6);
  };
  header();
  for (const a of g.activities) {
    if (w.y - RH < 80) { addPage(w); header(); }
    const y = w.y - RH;
    for (let d = 0; d <= span; d += step) w.page.drawLine({ start: { x: xs(d), y: y }, end: { x: xs(d), y: y + RH }, thickness: 0.4, color: grey });
    const nm = clean(a.name.length > 42 ? a.name.slice(0, 41) + '…' : a.name);
    w.page.drawText(nm, { x: L, y: y + 4, size: 7.5, font: a.critical ? w.bold : w.font, color: rgb(0.07, 0.09, 0.15) });
    w.page.drawRectangle({ x: xs(a.es ?? 0), y: y + 3, width: Math.max(2, xs(a.ef ?? 0) - xs(a.es ?? 0)), height: RH - 6, color: a.critical ? red : blue, opacity: a.critical ? 0.9 : 0.8 });
    w.y = y;
  }
  space(w, 10);
  text(w, 'En rojo, las actividades del camino crítico: un retraso en cualquiera de ellas retrasa el final de la obra.', { size: 8 });
  h2(w, 'Actividades, duraciones y rendimientos');
  table(w, [{ title: 'Actividad', w: 30, bold: true }, { title: 'Inicio', w: 9, align: 'right' }, { title: 'Fin', w: 9, align: 'right' }, { title: 'Días', w: 8, align: 'right' }, { title: 'Justificación', w: 44 }],
    g.activities.map((a) => [`${a.name}${a.critical ? ' (crítica)' : ''}`, `día ${a.es ?? 0}`, `día ${a.ef ?? 0}`, String(a.dur), a.why || '—']), { size: 7.5 });
  if (g.justification) { h2(w, 'Justificación del plan de obra'); g.justification.split(/\n{2,}|\n/).filter(Boolean).forEach((par) => text(w, par, { gap: 8 })); }
  return finish(w);
}

export { addPage };

/** DEUC prellenado: los datos del perfil y del pliego ordenados como las partes del formulario oficial, para copiarlos
 *  en el servicio DEUC electrónico. Las declaraciones sobre motivos de exclusión las responde siempre la empresa. */
export async function deucPdf(p: Project, s: AppState) {
  const c = s.company; const no = (x?: string | null) => (x && x.trim() ? x : '[completar]');
  const w = await newDoc(`DEUC prellenado — ${p.name}`, c, { project: p });
  h1(w, 'DEUC: datos listos para copiar');
  note(w, 'El Documento Europeo Único de Contratación se cumplimenta en el servicio DEUC electrónico (visor.registrodelicitadores.gob.es/espd-web). Si el órgano de contratación ha publicado el DEUC en XML, impórtalo allí como «operador económico» y copia estos datos en cada parte. Revisa cada respuesta: el DEUC es una declaración responsable que firma el representante legal.', { label: 'Cómo usarlo' });
  h2(w, 'Parte I · Información sobre el procedimiento');
  facts(w, [['Poder adjudicador', p.organization || '[completar]'], ['Objeto del contrato', fullTitle(p)], ['Número de expediente', reference(p)]]);
  h2(w, 'Parte II · Información sobre el operador económico');
  facts(w, [['Nombre', no(c.legalName)], ['NIF', no(c.taxId)], ['Dirección postal', no(c.address)], ['Persona de contacto', no(c.signer)], ['Teléfono', no(c.phone)], ['Correo electrónico', no(c.email)], ['Sitio web', c.website || '—'],
    ['¿Es una microempresa, pequeña o mediana empresa?', c.employees ? `[confirmar] · plantilla declarada: ${c.employees}` : '[completar]'],
    ['¿Inscrito en una lista oficial de operadores autorizados (ROLECE o registro autonómico)?', c.rolece || c.roleceNumber ? `Sí${c.roleceNumber ? ` · n.º ${c.roleceNumber}` : ''}` : '[completar]'],
    ['Clasificación de contratista', (c.clasificaciones ?? []).map((x) => `${x.grupo}-${x.subgrupo}, categoría ${x.categoria}`).join('; ') || '—'],
    ['¿Participa junto con otros (UTE)?', '[completar]'], ['¿Recurre a la capacidad de otras entidades?', '[completar]']]);
  h2(w, 'Parte II · Representación');
  facts(w, [['Nombre y apellidos', no(c.signer)], ['DNI', no(c.signerId)], ['Cargo o capacidad', no(c.signerRole)], ['Dirección y contacto', c.address ? `${c.address}${c.email ? ` · ${c.email}` : ''}` : '[completar]']]);
  h2(w, 'Parte III · Motivos de exclusión');
  text(w, 'Condenas penales, pago de impuestos y cotizaciones, insolvencia, falta profesional grave, conflictos de intereses y demás motivos. Las responde la empresa en el servicio DEUC: PROPO no puede declararlas por ti.', { gap: 6 });
  h2(w, 'Parte IV · Criterios de selección');
  const solv = p.requirements.filter((r) => ['financial', 'experience', 'certification', 'team'].includes(r.category) && r.mandatory).slice(0, 8);
  facts(w, [['Indicación global (α)', 'Si el pliego lo permite, basta con marcar que se cumplen todos los criterios de selección.'],
    ['Volumen anual de negocios', c.revenueHistory || c.revenue || '[completar]'],
    ['Obras de tipo similar ejecutadas', s.pastProjects.length ? s.pastProjects.slice(0, 5).map((x) => `${x.title}${x.years ? ` (${x.years})` : ''}${x.value ? ` · ${x.value}` : ''}`).join('; ') : '[completar]'],
    ['Certificados de sistemas de gestión', s.certifications.map((x) => x.name).join(', ') || '—']]);
  if (solv.length) { text(w, 'Lo que exige este pliego (comprueba que la respuesta lo cubre):', { bold: true, gap: 4 }); solv.forEach((r) => bullet(w, `${r.title}${r.source?.page ? ` (${r.source.docName}, pág. ${r.source.page})` : ''}`)); }
  h2(w, 'Parte VI · Declaraciones finales');
  text(w, 'Firma electrónica del representante legal en el propio servicio o en el PDF que genera.', { gap: 6 });
  return finish(w);
}
