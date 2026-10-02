// Generates a fictional tender PDF in the browser so anyone can try the real
// upload -> parse -> analyse pipeline without having a tender at hand.
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { fmtDate, addDays } from './util';

function pages(): { title: string; body: string[] }[] {
  const deadline = fmtDate(addDays(25));
  const questions = fmtDate(addDays(12));
  return [
    { title: 'ANUNCIO DE LICITACIÓN Y RESUMEN', body: [
      'Órgano de contratación: Ajuntament de la Costa del Garraf (ejemplo ficticio para PROPO).',
      'Expediente: GCT-SERV-2026-031. Procedimiento: abierto, sujeto a regulación armonizada.',
      'Objeto del contrato: limpieza, mantenimiento y pequeñas reparaciones de las 12 instalaciones deportivas municipales relacionadas en el anexo 2, incluidas piscinas, pabellones y pistas exteriores.',
      'CPV 90911200-8 Servicios de limpieza de edificios. CPV 50700000-2 Servicios de reparación y mantenimiento de equipos de edificios.',
      'Valor estimado: 1.480.000 € IVA excluido. Duración: 3 años, prorrogable 1 año más.',
      `Fecha límite de presentación de ofertas: ${deadline} a las 14:00. Las ofertas deberán recibirse a través de la plataforma electrónica de contratación antes de esa fecha.`,
      `Las preguntas de aclaración podrán presentarse hasta el ${questions}.`,
    ] },
    { title: '1. REQUISITOS ADMINISTRATIVOS', body: [
      '1.1 Los licitadores deberán presentar el Documento Europeo Único de Contratación (DEUC), debidamente cumplimentado y firmado por el representante legal.',
      '1.2 Los licitadores deberán estar inscritos en el Registro Oficial de Licitadores o aportar la escritura de constitución y los poderes del firmante.',
      '1.3 El licitador propuesto como adjudicatario deberá aportar certificados de estar al corriente de sus obligaciones tributarias y con la Seguridad Social.',
      '1.4 Los licitadores deberán declarar si tienen previsto subcontratar parte del contrato, indicando su importe y la identidad de los subcontratistas.',
      '1.5 Todos los documentos deberán firmarse con firma electrónica cualificada del representante legal.',
    ] },
    { title: '2. SOLVENCIA ECONÓMICA Y TÉCNICA', body: [
      '2.1 Solvencia económica: el volumen anual de negocios en el ámbito del contrato, referido al mejor de los tres últimos ejercicios, deberá ser al menos de 600.000 euros.',
      '2.2 Los licitadores deberán disponer de un seguro de responsabilidad civil profesional con una cobertura mínima de 300.000 euros por siniestro.',
      '2.3 Solvencia técnica: el licitador deberá acreditar al menos 3 contratos similares ejecutados en los últimos 3 años, cada uno con un importe anual mínimo de 150.000 euros, mediante certificados de buena ejecución.',
      '2.4 Los licitadores deberán disponer de una certificación de gestión de la calidad ISO 9001 y de una certificación ambiental ISO 14001 o EMAS.',
    ] },
    { title: '3. PRESCRIPCIONES TÉCNICAS', body: [
      '3.1 El contratista deberá realizar la limpieza diaria de todas las instalaciones antes del horario de apertura y una limpieza a fondo semanal de vestuarios y zonas de piscina.',
      '3.2 El contratista deberá designar un coordinador del servicio con al menos 4 años de experiencia en servicios de mantenimiento de instalaciones, localizable por teléfono durante el horario de apertura.',
      '3.3 El contratista deberá subrogar a los 22 trabajadores adscritos actualmente al servicio, conforme al convenio colectivo aplicable.',
      '3.4 Las incidencias urgentes deberán atenderse en un plazo máximo de 2 horas y las no urgentes en 24 horas.',
      '3.5 Los productos de limpieza deberán disponer de la Etiqueta Ecológica de la UE o equivalente. No se admiten plásticos de un solo uso.',
      '3.6 El contratista deberá realizar el mantenimiento preventivo de los equipos de tratamiento del agua de las piscinas conforme al Real Decreto 742/2013.',
      '3.7 El contratista deberá garantizar al menos 16 horas anuales de formación por trabajador en prevención de riesgos laborales y uso seguro de productos químicos.',
      '3.8 El contratista deberá presentar un informe mensual con las horas trabajadas por instalación, incidencias, tiempos de respuesta y consumo de productos.',
    ] },
    { title: '4. CRITERIOS DE ADJUDICACIÓN', body: [
      'Las ofertas se valorarán sobre 100 puntos según los siguientes criterios:',
      'Oferta económica: hasta 45 puntos, según la fórmula P = 45 x (oferta más baja / oferta valorada).',
      'Organización del servicio y plan de trabajo: hasta 25 puntos.',
      'Medidas ambientales: hasta 10 puntos.',
      'Plan de formación y salud laboral: hasta 10 puntos.',
      'Mejoras sin coste adicional: hasta 10 puntos.',
      'Los criterios sujetos a juicio de valor se incluirán en el sobre B. La oferta económica se incluirá en el sobre C.',
    ] },
    { title: '5. FORMATO Y PRESENTACIÓN', body: [
      '5.1 Las ofertas se presentarán en tres sobres: A (documentación administrativa), B (criterios sujetos a juicio de valor) y C (criterios evaluables mediante fórmulas).',
      '5.2 La memoria técnica no podrá superar las 30 páginas, en letra Arial 11. Las páginas que excedan este límite no serán valoradas.',
      '5.3 La inclusión en el sobre B de cualquier información que permita conocer la oferta económica supondrá la exclusión del licitador.',
      '5.4 Las ofertas que superen el presupuesto máximo anual de 370.000 euros IVA excluido serán excluidas.',
      '5.5 Los licitadores quedarán obligados por su oferta durante un plazo de tres meses desde la apertura de los sobres.',
    ] },
  ];
}

function wrap(text: string, font: any, size: number, width: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (font.widthOfTextAtSize(t, size) > width && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function sampleTenderFile(): Promise<File> {
  const pdf = await PDFDocument.create();
  pdf.setTitle('Limpieza y mantenimiento de instalaciones deportivas — pliego de ejemplo');
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const all = pages();
  all.forEach((pg, i) => {
    const page = pdf.addPage([595, 842]);
    let y = 780;
    page.drawText('Ajuntament de la Costa del Garraf (ejemplo ficticio) - Expediente GCT-SERV-2026-031', { x: 56, y: 810, size: 8, font, color: rgb(0.45, 0.45, 0.5) });
    page.drawText(pg.title, { x: 56, y, size: 13, font: bold });
    y -= 30;
    for (const para of pg.body) {
      for (const line of wrap(para, font, 10.5, 483)) { page.drawText(line, { x: 56, y, size: 10.5, font }); y -= 15; }
      y -= 8;
    }
    page.drawText(`Página ${i + 1} de ${all.length}`, { x: 500, y: 36, size: 8, font, color: rgb(0.45, 0.45, 0.5) });
  });
  const bytes = await pdf.save();
  return new File([bytes], 'Pliego de ejemplo — Mantenimiento de instalaciones deportivas.pdf', { type: 'application/pdf' });
}
