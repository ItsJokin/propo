// Reglas de precio de los proyectos de ejemplo: cada uno enseña una forma distinta de ofertar el precio.
import type { PriceRule } from './pricing';

export function samplePriceRule(id: string, base: PriceRule): PriceRule | null {
  if (id === 'p_events') {
    const units = [
      { id: 'u0', label: 'Coffee break · Café, zumos y bollería', unit: 'por persona', max: 7.5, qty: 3000 },
      { id: 'u1', label: 'Cóctel · Cóctel de pie (10 piezas)', unit: 'por persona', max: 22, qty: 1200 },
      { id: 'u2', label: 'Cóctel · Barra de bebidas 2 horas', unit: 'por persona', max: 9, qty: 800 },
      { id: 'u3', label: 'Almuerzo · Menú sentado de tres platos', unit: 'por persona', max: 35, qty: 600 },
      { id: 'u4', label: 'Personal · Camarero adicional', unit: 'por hora', max: 24, qty: 300 },
    ];
    return {
      ...base, budget: units.reduce((a, u) => a + u.max * u.qty, 0), vat: 10, totalPoints: 100, points: 50, formula: 'inverse',
      formulaText: 'P = 50 × (oferta más baja / oferta evaluada), con el importe resultante de aplicar los precios unitarios a las cantidades estimadas.',
      plain: 'El precio vale 50 de 100 puntos. Pones un precio a cada servicio y el pliego lo multiplica por las cantidades previstas: el total más bajo se lleva los 50 puntos y los demás, en proporción.',
      units, lots: [], mode: 'ai', offerType: 'units',
      offerWhy: 'El pliego fija un precio máximo para cada servicio y pide el tuyo para cada uno; el total se calcula con las cantidades previstas.',
    };
  }
  if (id === 'p_sample') {
    return {
      ...base, budget: 7190000, vat: 10, totalPoints: 100, points: 40, formula: 'threshold', satiation: 12,
      formulaText: 'P = 40 × (baja ofertada / mayor baja), con umbral de saciedad en el 12 % de baja: a partir de ahí, 40 puntos.',
      plain: 'El precio vale 40 de 100 puntos en cada lote. Los puntos van en proporción a la rebaja hasta un 12 %: a partir de ahí ya no se dan más puntos.',
      units: [], mode: 'ai', offerType: 'lots',
      lots: [
        { label: 'Lote 1 · Ciutat Vella y Eixample', budget: 1850000 },
        { label: 'Lote 2 · Sants-Montjuïc y Les Corts', budget: 1420000 },
        { label: 'Lote 3 · Gràcia y Horta-Guinardó', budget: 1260000 },
        { label: 'Lote 4 · Nou Barris, Sant Andreu y Sant Martí', budget: 2660000 },
      ],
      offerWhy: 'El contrato está dividido en cuatro lotes por distritos: puedes presentarte a uno o a varios, con un importe para cada uno.',
    };
  }
  return null;
}
