// Demo: pliego simulado para licitaciones en vivo cuyos pliegos oficiales PROPO todavía no descarga.
// Reúne las cláusulas habituales en contratos de este tipo, dimensionadas con los datos reales del anuncio
// (importe, duración), para que el recorrido de la demo —requisitos, criterios, redacción— sea completo.
// Solo se usa en el espacio de demostración y el documento se llama «simulado» en todas partes.
import type { TedNotice } from '../discovery/tedSnapshot';
import { tenderView } from '../discovery/brief';

export const DEMO_PLIEGO_NAME = 'Pliego de demostración (simulado).txt';
const round = (n: number, step: number) => Math.max(step, Math.round(n / step) * step);
const eurText = (n: number) => `${n.toLocaleString('es-ES')} euros`;

export function demoPliegoText(t: TedNotice): string {
  const total = t.live?.budget || t.value || 240000;
  const months = t.live?.dur || 24;
  const annual = total / Math.max(1, months / 12);
  const nature = t.nature === 'works' ? 'la obra' : t.nature === 'supplies' ? 'el suministro' : 'el servicio';
  const lines = [
    'PLIEGO DE DEMOSTRACIÓN (SIMULADO).',
    'Documento generado por PROPO para la demo. Reúne las cláusulas habituales en contratos de este tipo; no es el pliego oficial de esta licitación.',
    `Objeto del contrato: ${t.title}.`,
    `Órgano de contratación: ${t.buyer}.`,
    '',
    'SOLVENCIA Y CAPACIDAD:',
    `Los licitadores deberán acreditar un volumen anual de negocio de al menos ${eurText(round(annual * 1.5, 10000))} en alguno de los tres últimos ejercicios.`,
    `Los licitadores deberán acreditar experiencia en contratos similares durante los tres últimos años, por un importe anual igual o superior a ${eurText(round(annual * 0.7, 5000))}.`,
    `El adjudicatario deberá disponer de un seguro de responsabilidad civil con una cobertura mínima de ${eurText(round(Math.max(300000, annual), 50000))}.`,
    'Será obligatorio disponer de la certificación ISO 9001 de gestión de la calidad y de la certificación ISO 14001 de gestión ambiental, o de certificados equivalentes.',
    '',
    'DOCUMENTACIÓN ADMINISTRATIVA:',
    'Los licitadores deberán presentar el Documento Europeo Único de Contratación (DEUC) cumplimentado y firmado por su representante.',
    'Los licitadores deberán estar al corriente de sus obligaciones tributarias y con la Seguridad Social en el momento de presentar la oferta.',
    'Será obligatorio constituir una garantía definitiva del 5 por ciento del importe de adjudicación antes de la formalización del contrato.',
    '',
    `EJECUCIÓN DE ${nature.toUpperCase().replace(/^(EL|LA) /, '')}:`,
    `El adjudicatario deberá designar un coordinador del servicio con al menos tres años de experiencia, que será el interlocutor único con ${t.buyer}.`,
    'El adjudicatario deberá impartir formación anual a todo el personal adscrito al contrato y dejar constancia de ella.',
    'Las incidencias comunicadas por el órgano de contratación deberán atenderse en un plazo máximo de 24 horas.',
    'El adjudicatario deberá entregar un informe mensual del servicio con los indicadores de calidad acordados.',
    `El licitador deberá describir en la memoria técnica los medios personales y materiales que adscribirá a ${nature}.`,
    '',
    'PRESENTACIÓN DE LA OFERTA:',
    'La memoria técnica no podrá superar las 30 páginas y deberá presentarse en el sobre B, sin ninguna información de precio.',
    'Las ofertas que superen el presupuesto base de licitación serán excluidas del procedimiento.',
  ];
  if (!tenderView(t).criteria.length) {
    lines.push('', 'CRITERIOS DE ADJUDICACIÓN:',
      'Oferta económica (fórmula): hasta 45 puntos',
      'Memoria técnica y organización del servicio: hasta 25 puntos',
      'Plan de calidad y control del servicio: hasta 15 puntos',
      'Medidas medioambientales y sociales: hasta 10 puntos',
      'Mejoras sin coste para la Administración: hasta 5 puntos');
  }
  return lines.join('\n');
}

export function demoPliegoFile(t: TedNotice): File {
  return new File([demoPliegoText(t)], DEMO_PLIEGO_NAME, { type: 'text/plain' });
}
