// Documentos PDF del paquete de presentación, maquetados con la marca del licitador (logo y color).
import type { AppState, Project } from '../types';
import { complianceChecks, readiness } from '../derive';
import { fmtDate, nowIso, isUnknown } from '../util';
import { newDoc, cover, tocPlaceholder, finish, h1, h2, text, bullet, body, note, table, facts, space, addPage } from './kit';

function plainSection(content: string) {
  return content.replace(/\s?\[S\d+\]/g, '').replace(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g, '[INFORMACIÓN REQUERIDA: $1]');
}
const reference = (p: Project) => (!isUnknown(p.analysis?.reference) ? p.analysis!.reference : p.tender?.live?.ref || '');
const today = () => fmtDate(nowIso());

/** Memoria técnica: portada, índice, datos de la oferta, correspondencia con criterios, secciones y anexos de empresa. */
export async function technicalProposalPdf(p: Project, s: AppState) {
  const c = s.company;
  const w = await newDoc(`Memoria técnica — ${p.name}`, c, { cover: true });
  cover(w, {
    kind: 'Memoria técnica', title: p.name,
    lines: [['Órgano de contratación', p.organization], ['Expediente', reference(p)], ['Licitador', `${c.legalName || '[razón social]'}${c.taxId ? ` · NIF ${c.taxId}` : ''}`], ['Domicilio', c.address], ['Fecha', today()]],
  });
  tocPlaceholder(w);

  h1(w, 'Datos de la oferta');
  facts(w, [
    ['Objeto del contrato', p.name], ['Órgano de contratación', p.organization], ['Expediente', reference(p)],
    ['Fin de presentación de ofertas', p.analysis?.deadline ? fmtDate(p.analysis.deadline) : ''], ['Duración', p.analysis?.duration ?? ''],
    ['Licitador', c.legalName], ['NIF', c.taxId], ['Domicilio', c.address], ['Web', c.website],
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
  }

  p.sections.forEach((sec, i) => {
    h1(w, `${i + 1}. ${sec.title}`, { tag: sec.status !== 'approved' ? 'BORRADOR — SECCIÓN SIN APROBAR' : undefined });
    const crit = p.criteria.filter((k) => sec.criteria.includes(k.id));
    if (crit.length) note(w, crit.map((k) => `${k.name} (${String(k.points).replace('.', ',')} puntos)`).join(' · '), { label: crit.length > 1 ? 'Criterios que se valoran en este apartado' : 'Criterio que se valora en este apartado' });
    if (!sec.content.trim()) text(w, '[Sección todavía sin redactar]', { italic: true, color: [0.6, 0.35, 0.05] });
    else body(w, plainSection(sec.content));
  });

  // Anexos: la memoria de empresa que respalda lo afirmado en las secciones.
  h1(w, 'Anexo A. Ficha de la empresa', { newPage: true });
  if (c.description) text(w, c.description, { gap: 10 });
  facts(w, [['Razón social', c.legalName], ['Nombre comercial', c.tradeName !== c.legalName ? c.tradeName : ''], ['NIF', c.taxId], ['Domicilio', c.address], ['Sector', c.industry], ['Plantilla', c.employees ? `${c.employees} personas` : ''], ['Ámbitos de actividad', c.sectors.join(', ')], ['Web', c.website]]);
  if (c.capabilities.length) { h2(w, 'Capacidades'); c.capabilities.forEach((x) => bullet(w, x)); space(w, 8); }

  if (s.team.length) {
    h1(w, 'Anexo B. Equipo adscrito al contrato');
    text(w, 'Personas de la plantilla que asumirán la dirección y la ejecución del contrato.', { size: 10, gap: 8 });
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
  const w = await newDoc(`Declaración responsable — ${p.name}`, c);
  h1(w, 'Declaración responsable');
  note(w, 'Borrador preparado por PROPO con tu perfil de empresa. Revísalo, completa los datos del representante y fírmalo con firma electrónica cualificada antes de presentarlo.', { label: 'Antes de firmar' });
  h2(w, 'Datos del procedimiento');
  facts(w, [['Objeto del contrato', p.name], ['Órgano de contratación', p.organization], ['Expediente', reference(p)]]);
  h2(w, 'Datos del licitador');
  facts(w, [['Razón social', c.legalName || '[razón social]'], ['NIF', c.taxId || '[NIF]'], ['Domicilio', c.address || '[domicilio social]'], ['Representante legal', '[nombre y apellidos]'], ['DNI del representante', '[número]'], ['En calidad de', '[administrador / apoderado]']]);
  text(w, `D./D.ª [nombre del representante legal], en nombre y representación de **${c.legalName || '[razón social]'}**, en relación con el procedimiento arriba indicado,`, { gap: 10 });
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
  const w = await newDoc(`Experiencia relevante — ${c.legalName}`, c, { cover: true });
  cover(w, { kind: 'Relación de contratos similares', title: p.name, lines: [['Órgano de contratación', p.organization], ['Expediente', reference(p)], ['Licitador', `${c.legalName}${c.taxId ? ` · NIF ${c.taxId}` : ''}`], ['Fecha', today()]] });
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
  const w = await newDoc(`Documentación de empresa — ${s.company.legalName}`, s.company);
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
  const w = await newDoc(`Informe de cumplimiento — ${p.name}`, s?.company ?? ({ legalName: 'Informe interno', tradeName: '' } as any));
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

export { addPage };
