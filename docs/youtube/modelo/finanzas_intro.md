# Fase XI: Modelo financiero de 12 meses

## 16. Hipótesis y fórmulas

El modelo está en `modelo/modelo.py` (reproducible) y en `Modelo_YouTube.xlsx`, que tiene una hoja por escenario con fórmulas de ingresos, costes, BAI y caja, la lista de hipótesis y la hoja de sensibilidad. **Son simulaciones, no predicciones.** Inicio: noviembre de 2026.

**Fórmulas (por mes *m*):**
- **Vistas de estreno** = n.º de vídeos(*m*) × vistas por vídeo nuevo(*m*). Las vistas por vídeo nuevo crecen de forma geométrica entre el valor del mes 1 y el del mes 12 (el canal gana autoridad).
- **Vistas de catálogo** = Σ sobre las cohortes anteriores de [vistas de estreno de la cohorte × cola × decaimiento^(meses transcurridos − 1)]. La cola es el % de las vistas de estreno que un vídeo sigue sumando al mes siguiente; el decaimiento, cuánto se reduce cada mes.
- **Horas públicas (12 m)** = Σ de los últimos 12 meses de [vistas largas × duración media de visualización ÷ 60]. **Los Shorts no suman horas.**
- **Suscriptores** = acumulado de (vistas largas ÷ 1.000 × suscriptores por mil) + (vistas de Shorts ÷ 1.000 × suscriptores por mil de Shorts).
- **YPP:** elegible cuando hay ≥1.000 suscriptores **y** ≥8.000 h en 12 meses. Se cobra desde el mes siguiente (revisión).
- **Anuncios** = vistas largas ÷ 1.000 × RPM (solo los meses monetizados). *El RPM de YouTube ya está expresado por cada 1.000 vistas **totales** (monetizadas o no) y ya descuenta la parte de YouTube. Por eso no multiplicamos aparte por "% de vistas monetizadas", que sí haría falta si partiéramos del CPM (CPM × reproducciones monetizadas ÷ 1.000 × 55 %).*
- **Afiliación** = vistas largas ÷ 1.000 × € de afiliación por mil (incluye de forma aproximada la parte recurrente).
- **Patrocinio** = n.º de integraciones × vistas de estreno de un vídeo ÷ 1.000 × CPM de patrocinio.
- **Producto digital** = vistas largas × tasa de compra × precio neto (39 € − ~10 % de comisiones de pago y plataforma).
- **Servicios** = margen bruto de proyectos de implantación (línea separada; el resumen indica el equilibrio **sin** servicios).
- **BAI** = ingresos − (herramientas + edición y colaboradores + otros). "Otros" incluye la **cuota de autónomo con tarifa plana (~80 €/mes + MEI, ~87-89 €)** y la gestoría (~60 €) desde que hay ingresos recurrentes, y un micrófono en el mes 1. **Sin impuestos sobre beneficios ni IVA** (el IVA de los servicios a Google Ireland suele tributar por inversión del sujeto pasivo: consultar con el asesor).

**Hipótesis por escenario:**

| Parámetro | Conservador | Base | Optimista | Justificación |
|---|---|---|---|---|
| Vídeos largos/mes | 4 → 6 | 4 → 8 | 6 → 10 | Modelo A hasta el mes 3; B desde el 4 (base) |
| Vistas por vídeo nuevo, mes 1 → mes 12 | 120 → 1.300 | 250 → 3.500 | 500 → 9.000 | Canal nuevo de búsqueda B2B en español; el optimista exige un éxito de sugeridos |
| Cola de catálogo / decaimiento | 18 % / 0,97 | 22 % / 0,97 | 26 % / 0,97 | Los tutoriales de búsqueda tienen cola larga [HIP] |
| Duración media de visualización (largos) | 4,0 min | 5,0 min | 6,0 min | ~35-45 % de 12-14 min |
| Suscriptores por cada 1.000 vistas largas | 10 | 14 | 18 | Los nichos útiles convierten más que el entretenimiento [HIP] |
| RPM (€) tras el YPP | 2,0 | 3,5 | 5,5 | Español con un 60-70 % de España, temas B2B y software; rangos de terceros de 1,5-4 USD para español en general y CPM de España de 4-5,6 USD [EST]; el conservador asume más Latinoamérica y el 1.er trimestre |
| Afiliación (€ por 1.000 vistas largas) | 1,2 | 3,0 | 5,0 | Ej. base: 1.000 vistas → 2 % de clic (20) → 3 % de alta de pago (0,6) → ~5 € de comisión mensual media → ~3 € al mes [HIP] |
| Patrocinio: inicio / CPM | mes 9 / 12 € | mes 6 / 18 € | mes 4 / 25 € | Tecnología y SaaS: 20-60 USD de CPM en inglés [EST]; descuento por español y tamaño |
| Producto: inicio / tasa de compra | mes 7 / 0,01 % | mes 5 / 0,02 % | mes 4 / 0,04 % | 1-4 compras de 39 € por cada 10.000 vistas [HIP, a validar en la preventa] |
| Servicios (margen) | 0 | 600-800 € cada ~2 meses desde el mes 5 | 800-1.200 €/mes desde el mes 3 | Proyectos de implantación captados en el canal |
| Edición externa | 0 € (lo hace el propietario) | 80 €/vídeo desde el mes 4 | 100 €/vídeo desde el mes 3 + guion de 60 € desde el mes 6 | Tarifas habituales de freelancers hispanohablantes [EST] |
| Herramientas | 45 → 90 €/mes | 55 → 120 €/mes | 70 → 150 €/mes | Sección 14 |

**Sobre la monetización:** el modelo **no** asume ingresos de anuncios desde el principio. Con la barrera de 8.000 h, el YPP llega en el **mes 11 (base)**, el **mes 8 (optimista)** y **nunca en el año 1 (conservador)**.
