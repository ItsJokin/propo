// Fuente única de precios y límites. En Stripe: Products/Prices (ids en variables de entorno).
import type { PlanId } from './types';

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number | null;     // EUR/mes, facturación mensual
  annual: number | null;      // EUR/mes, facturación anual
  proposalsPerMonth: number;  // propuestas nuevas por periodo
  pagesPerProposal: number;   // páginas de pliego analizadas por propuesta
  aiActionsPerProposal: number; // límite interno de uso razonable
  seats: number;
  alerts: number;             // alertas de licitaciones guardadas
  storageGb: number;
  extraProposal: number | null;
  features: string[];
  cta: string;
}

export const PLANS: Record<PlanId, Plan> = {
  trial: {
    id: 'trial', name: 'Prueba gratuita', tagline: 'Comprueba cómo trabaja PROPO con una licitación real.',
    monthly: 0, annual: 0, proposalsPerMonth: 1, pagesPerProposal: 200, aiActionsPerProposal: 60,
    seats: 1, alerts: 3, storageGb: 1, extraProposal: null,
    features: ['1 propuesta completa', 'Buscador de licitaciones', 'Análisis de pliegos y requisitos', 'Control de cumplimiento'],
    cta: 'Empezar gratis',
  },
  free: {
    id: 'free', name: 'Gratis', tagline: 'Encuentra licitaciones y conserva tu memoria de empresa.',
    monthly: 0, annual: 0, proposalsPerMonth: 0, pagesPerProposal: 0, aiActionsPerProposal: 0,
    seats: 1, alerts: 1, storageGb: 1, extraProposal: null,
    features: ['Buscador de licitaciones', '1 alerta', 'Perfil de empresa y documentos'],
    cta: 'Plan actual',
  },
  pro: {
    id: 'pro', name: 'Pro', tagline: 'Para empresas que licitan cada mes.',
    monthly: 79, annual: 63, proposalsPerMonth: 4, pagesPerProposal: 400, aiActionsPerProposal: 150,
    seats: 2, alerts: 10, storageGb: 20, extraProposal: 19,
    features: ['4 propuestas nuevas al mes', 'Hasta 400 páginas por propuesta', 'Buscador con compatibilidad y 10 alertas', 'Redacción con IA y fuentes', 'Control de cumplimiento y paquete final', '2 usuarios'],
    cta: 'Empezar prueba gratis',
  },
  business: {
    id: 'business', name: 'Business', tagline: 'Para equipos con varias licitaciones en marcha.',
    monthly: 199, annual: 159, proposalsPerMonth: 15, pagesPerProposal: 1000, aiActionsPerProposal: 300,
    seats: 8, alerts: 50, storageGb: 100, extraProposal: 12,
    features: ['15 propuestas nuevas al mes', 'Hasta 1.000 páginas por propuesta', 'Alertas ilimitadas por sector y región', 'Plantillas y respuestas compartidas', 'Revisores y aprobaciones', '8 usuarios · soporte prioritario'],
    cta: 'Empezar prueba gratis',
  },
  enterprise: {
    id: 'enterprise', name: 'Enterprise', tagline: 'Para departamentos de licitaciones y grupos.',
    monthly: null, annual: null, proposalsPerMonth: 999, pagesPerProposal: 5000, aiActionsPerProposal: 1000,
    seats: 999, alerts: 999, storageGb: 1000, extraProposal: null,
    features: ['Volumen de propuestas a medida', 'SSO y permisos avanzados', 'Retención de datos y DPA a medida', 'Implantación dedicada'],
    cta: 'Hablar con nosotros',
  },
};

export const COMPARISON: { label: string; values: Record<'trial' | 'pro' | 'business' | 'enterprise', string | boolean> }[] = [
  { label: 'Propuestas nuevas', values: { trial: '1 en total', pro: '4 / mes', business: '15 / mes', enterprise: 'A medida' } },
  { label: 'Páginas de pliego por propuesta', values: { trial: '200', pro: '400', business: '1.000', enterprise: 'A medida' } },
  { label: 'Buscador de licitaciones', values: { trial: true, pro: true, business: true, enterprise: true } },
  { label: 'Alertas de nuevas licitaciones', values: { trial: '3', pro: '10', business: 'Ilimitadas', enterprise: 'Ilimitadas' } },
  { label: 'Análisis de requisitos con IA', values: { trial: true, pro: true, business: true, enterprise: true } },
  { label: 'Redacción con IA y fuentes', values: { trial: true, pro: true, business: true, enterprise: true } },
  { label: 'Control de cumplimiento', values: { trial: true, pro: true, business: true, enterprise: true } },
  { label: 'Memoria de empresa', values: { trial: true, pro: true, business: true, enterprise: true } },
  { label: 'Almacenamiento de documentos', values: { trial: '1 GB', pro: '20 GB', business: '100 GB', enterprise: 'A medida' } },
  { label: 'Plantillas y respuestas', values: { trial: 'Básicas', pro: 'Personales', business: 'Compartidas', enterprise: 'Compartidas' } },
  { label: 'Usuarios', values: { trial: '1', pro: '2', business: '8', enterprise: 'Ilimitados' } },
  { label: 'Revisores y aprobaciones', values: { trial: false, pro: false, business: true, enterprise: true } },
  { label: 'Exportar paquete de presentación', values: { trial: true, pro: true, business: true, enterprise: true } },
  { label: 'Propuesta adicional', values: { trial: '—', pro: '19 €', business: '12 €', enterprise: 'Incluida' } },
  { label: 'Soporte prioritario', values: { trial: false, pro: false, business: true, enterprise: true } },
  { label: 'SSO, DPA y retención a medida', values: { trial: false, pro: false, business: false, enterprise: true } },
];

export const TRIAL_DAYS = 14;

export const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
