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

## 16.1 Resultados mensuales por escenario

### Escenario Conservador

| Mes | Vídeos | Shorts | Vistas estreno | Vistas catálogo | Vistas largos | Vistas Shorts | Horas 12m | Subs | Estado YPP | Anuncios € | Afiliación € | Patrocinio € | Producto € | Servicios € | Ingresos € | Herram. € | Edición € | Otros € | BAI € | Caja acum. € |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Nov-26 | 4 | 8 | 480 | 0 | 480 | 1.600 | 32 | 6 | No elegible | 0 | 0 | 0 | 0 | 0 | 0 | 45 | 0 | 100 | -145 | -145 |
| Dic-26 | 4 | 10 | 596 | 86 | 682 | 3.000 | 77 | 14 | No elegible | 0 | 0 | 0 | 0 | 0 | 0 | 45 | 0 | 10 | -55 | -200 |
| Ene-27 | 4 | 12 | 740 | 191 | 931 | 4.800 | 140 | 27 | No elegible | 0 | 1 | 0 | 0 | 0 | 1 | 45 | 0 | 10 | -54 | -254 |
| Feb-27 | 4 | 12 | 919 | 319 | 1.238 | 6.000 | 222 | 43 | No elegible | 0 | 1 | 0 | 0 | 0 | 1 | 45 | 0 | 10 | -54 | -307 |
| Mar-27 | 5 | 12 | 1.427 | 475 | 1.902 | 7.200 | 349 | 66 | No elegible | 0 | 2 | 0 | 0 | 0 | 2 | 90 | 0 | 10 | -98 | -405 |
| Abr-27 | 5 | 12 | 1.772 | 717 | 2.489 | 8.400 | 515 | 96 | No elegible | 0 | 3 | 0 | 0 | 0 | 3 | 90 | 0 | 10 | -97 | -502 |
| May-27 | 5 | 12 | 2.201 | 1.015 | 3.215 | 9.600 | 729 | 134 | No elegible | 0 | 4 | 0 | 11 | 0 | 15 | 90 | 0 | 10 | -85 | -587 |
| Jun-27 | 6 | 12 | 3.280 | 1.380 | 4.660 | 10.800 | 1.040 | 187 | No elegible | 0 | 6 | 0 | 16 | 0 | 22 | 90 | 0 | 10 | -78 | -665 |
| Jul-27 | 6 | 12 | 4.073 | 1.929 | 6.002 | 12.000 | 1.440 | 254 | No elegible | 0 | 7 | 8 | 21 | 0 | 36 | 90 | 0 | 10 | -64 | -729 |
| Ago-27 | 6 | 12 | 5.058 | 2.604 | 7.662 | 13.200 | 1.951 | 339 | No elegible | 0 | 9 | 10 | 27 | 0 | 46 | 90 | 0 | 10 | -54 | -782 |
| Sep-27 | 6 | 12 | 6.281 | 3.437 | 9.718 | 14.400 | 2.599 | 444 | No elegible | 0 | 12 | 13 | 34 | 0 | 58 | 90 | 0 | 10 | -42 | -824 |
| Oct-27 | 6 | 12 | 7.800 | 4.464 | 12.264 | 15.600 | 3.416 | 576 | No elegible | 0 | 15 | 16 | 43 | 0 | 73 | 90 | 0 | 10 | -27 | -851 |

Resumen: ingresos 12m 259 €, costes 1.110 €, BAI -851 €, caja mínima -851 €, caja final -851 €, monetización YPP desde no en 12 meses, primer mes con beneficio sin contar servicios: no en 12 meses, ingresos mes 12 73 €, BAI mes 12 -27 €, vistas largas mes 12 12.264, suscriptores mes 12 576.


### Escenario Base

| Mes | Vídeos | Shorts | Vistas estreno | Vistas catálogo | Vistas largos | Vistas Shorts | Horas 12m | Subs | Estado YPP | Anuncios € | Afiliación € | Patrocinio € | Producto € | Servicios € | Ingresos € | Herram. € | Edición € | Otros € | BAI € | Caja acum. € |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Nov-26 | 4 | 8 | 1.000 | 0 | 1.000 | 3.200 | 83 | 16 | No elegible | 0 | 0 | 0 | 0 | 0 | 0 | 55 | 0 | 100 | -155 | -155 |
| Dic-26 | 5 | 10 | 1.589 | 220 | 1.809 | 6.000 | 234 | 45 | No elegible | 0 | 5 | 0 | 0 | 0 | 5 | 55 | 0 | 10 | -60 | -215 |
| Ene-27 | 6 | 12 | 2.424 | 563 | 2.987 | 10.800 | 483 | 93 | No elegible | 0 | 9 | 0 | 0 | 0 | 9 | 55 | 0 | 10 | -56 | -271 |
| Feb-27 | 6 | 12 | 3.081 | 1.079 | 4.160 | 14.400 | 830 | 160 | No elegible | 0 | 12 | 0 | 0 | 0 | 12 | 110 | 480 | 10 | -588 | -858 |
| Mar-27 | 7 | 12 | 4.569 | 1.725 | 6.294 | 18.000 | 1.354 | 259 | No elegible | 0 | 19 | 0 | 44 | 600 | 663 | 110 | 560 | 150 | -157 | -1.015 |
| Abr-27 | 8 | 12 | 6.637 | 2.678 | 9.316 | 21.600 | 2.130 | 402 | No elegible | 0 | 28 | 15 | 65 | 0 | 108 | 110 | 640 | 150 | -792 | -1.807 |
| May-27 | 8 | 12 | 8.437 | 4.058 | 12.495 | 25.200 | 3.172 | 592 | No elegible | 0 | 37 | 19 | 88 | 800 | 944 | 120 | 640 | 150 | 34 | -1.773 |
| Jun-27 | 8 | 12 | 10.725 | 5.792 | 16.517 | 28.800 | 4.548 | 841 | No elegible | 0 | 50 | 48 | 116 | 0 | 214 | 120 | 640 | 150 | -696 | -2.469 |
| Jul-27 | 8 | 12 | 13.633 | 7.978 | 21.611 | 31.200 | 6.349 | 1.162 | No elegible | 0 | 65 | 61 | 152 | 800 | 1.078 | 120 | 640 | 150 | 168 | -2.301 |
| Ago-27 | 8 | 12 | 17.329 | 10.738 | 28.067 | 33.600 | 8.688 | 1.575 | Elegible-revisión | 0 | 84 | 78 | 197 | 800 | 1.159 | 120 | 640 | 150 | 249 | -2.052 |
| Sep-27 | 8 | 12 | 22.027 | 14.228 | 36.256 | 36.000 | 11.709 | 2.104 | Monetizado | 127 | 109 | 99 | 255 | 0 | 589 | 120 | 640 | 150 | -321 | -2.372 |
| Oct-27 | 8 | 12 | 28.000 | 18.647 | 46.647 | 38.400 | 15.596 | 2.781 | Monetizado | 163 | 140 | 126 | 327 | 800 | 1.557 | 120 | 640 | 150 | 647 | -1.726 |

Resumen: ingresos 12m 6.339 €, costes 8.065 €, BAI -1.726 €, caja mínima -2.469 €, caja final -1.726 €, monetización YPP desde Sep-27, primer mes con beneficio sin contar servicios: no en 12 meses, ingresos mes 12 1.557 €, BAI mes 12 647 €, vistas largas mes 12 46.647, suscriptores mes 12 2.781.


### Escenario Optimista

| Mes | Vídeos | Shorts | Vistas estreno | Vistas catálogo | Vistas largos | Vistas Shorts | Horas 12m | Subs | Estado YPP | Anuncios € | Afiliación € | Patrocinio € | Producto € | Servicios € | Ingresos € | Herram. € | Edición € | Otros € | BAI € | Caja acum. € |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Nov-26 | 6 | 8 | 3.000 | 0 | 3.000 | 6.400 | 300 | 58 | No elegible | 0 | 0 | 0 | 0 | 0 | 0 | 70 | 0 | 100 | -170 | -170 |
| Dic-26 | 6 | 10 | 3.902 | 780 | 4.682 | 12.000 | 768 | 149 | No elegible | 0 | 23 | 0 | 0 | 0 | 23 | 70 | 0 | 10 | -57 | -227 |
| Ene-27 | 8 | 12 | 6.765 | 1.771 | 8.536 | 21.600 | 1.622 | 316 | No elegible | 0 | 43 | 0 | 0 | 800 | 843 | 130 | 800 | 150 | -237 | -464 |
| Feb-27 | 8 | 12 | 8.798 | 3.477 | 12.275 | 30.000 | 2.849 | 555 | No elegible | 0 | 61 | 55 | 172 | 800 | 1.089 | 130 | 800 | 150 | 9 | -455 |
| Mar-27 | 8 | 12 | 11.443 | 5.660 | 17.103 | 36.000 | 4.560 | 884 | No elegible | 0 | 86 | 72 | 240 | 1.200 | 1.597 | 150 | 800 | 150 | 497 | 42 |
| Abr-27 | 10 | 12 | 18.602 | 8.465 | 27.067 | 42.000 | 7.266 | 1.397 | No elegible | 0 | 135 | 93 | 380 | 1.200 | 1.808 | 150 | 1.600 | 150 | -92 | -50 |
| May-27 | 10 | 12 | 24.192 | 13.048 | 37.239 | 48.000 | 10.990 | 2.096 | Elegible-revisión | 0 | 186 | 181 | 523 | 1.200 | 2.090 | 150 | 1.600 | 150 | 190 | 141 |
| Jun-27 | 10 | 12 | 31.462 | 18.946 | 50.408 | 54.000 | 16.031 | 3.036 | Monetizado | 277 | 252 | 236 | 708 | 1.200 | 2.673 | 150 | 1.600 | 150 | 773 | 914 |
| Jul-27 | 10 | 12 | 40.916 | 26.558 | 67.474 | 60.000 | 22.778 | 4.286 | Monetizado | 371 | 337 | 307 | 947 | 1.200 | 3.163 | 150 | 1.600 | 150 | 1.263 | 2.176 |
| Ago-27 | 10 | 12 | 53.212 | 36.399 | 89.612 | 66.000 | 31.740 | 5.939 | Monetizado | 493 | 448 | 399 | 1.258 | 1.200 | 3.798 | 150 | 1.600 | 150 | 1.898 | 4.075 |
| Sep-27 | 10 | 12 | 69.203 | 49.143 | 118.346 | 72.000 | 43.574 | 8.112 | Monetizado | 651 | 592 | 692 | 1.662 | 1.200 | 4.796 | 150 | 1.600 | 150 | 2.896 | 6.971 |
| Oct-27 | 10 | 12 | 90.000 | 65.661 | 155.661 | 78.000 | 59.140 | 10.961 | Monetizado | 856 | 778 | 900 | 2.185 | 1.200 | 5.920 | 150 | 1.600 | 150 | 4.020 | 10.991 |

Resumen: ingresos 12m 27.801 €, costes 16.810 €, BAI 10.991 €, caja mínima -464 €, caja final 10.991 €, monetización YPP desde Jun-27, primer mes con beneficio sin contar servicios: Jul-27, ingresos mes 12 5.920 €, BAI mes 12 4.020 €, vistas largas mes 12 155.661, suscriptores mes 12 10.961.



### Lectura de los escenarios
- **Conservador:** el canal no despega (~12.000 vistas/mes en el mes 12) y no llega al YPP en el año 1. Si se respetan las puertas (no contratar ni darse de alta sin ingresos), la pérdida se limita a unos 850 €. **Las puertas de los días 90 y 180 habrían recomendado pivotar antes.**
- **Base:** YPP en el mes 11. Ingresos de ~1.550 € en el mes 12, de los que ~800 € son servicios. Año 1 con un BAI de unos −1.700 € y una caja mínima de unos −2.500 € → **capital necesario ≈ 2.500 €** si se sigue este plan de externalización. El **punto de equilibrio sin servicios** aparece justo después del mes 12; con servicios, hay meses positivos desde el mes 7.
- **Optimista:** YPP en el mes 8. Caja positiva desde el mes 5 (con servicios). Ingresos de ~5.900 €/mes y BAI de ~4.000 €/mes en el mes 12. Año 1 con un BAI de ~+11.000 €. **No es el resultado normal.**

**Capital necesario por escenario:** conservador ~850 € (con las puertas aplicadas); base ~2.500 € (o ~1.000 € si el propietario sigue editando hasta el mes 6); optimista ~500 €.

**Principales riesgos financieros:** visualizaciones (el factor dominante), coste de producción, retraso del YPP y concentración de ingresos en servicios (el negocio de medios depende del tiempo del propietario).

## 16.2 Sensibilidad (escenario base)


| Caso | Ingresos 12m € | Costes 12m € | BAI 12m € | Caja mínima € | Mes de monetización YPP | Ingresos mes 12 € | BAI mes 12 € |
|---|---|---|---|---|---|---|---|
| Base | 6.339 | 8.065 | -1.726 | -2.469 | Sep-27 | 1.557 | 647 |
| Visualizaciones −50 % | 4.925 | 8.065 | -3.140 | -3.327 | no en 12 meses | 1.097 | 187 |
| RPM a la mitad | 6.194 | 8.065 | -1.871 | -2.469 | Sep-27 | 1.475 | 565 |
| Producción al doble de coste | 6.339 | 13.585 | -7.246 | -7.252 | Sep-27 | 1.557 | 7 |
| Monetización YPP 6 meses más tarde (fuera del año 1) | 6.049 | 8.065 | -2.016 | -2.499 | no en 12 meses | 1.393 | 483 |
| Referencia: umbral antiguo de 4.000 h (no aplicable a solicitudes desde 1-feb-2027) | 6.437 | 8.065 | -1.628 | -2.469 | Ago-27 | 1.557 | 647 |
| Un vídeo viral (+250.000 vistas en el mes 6) | 13.260 | 8.065 | 5.195 | -1.015 | May-27 | 2.195 | 1.285 |
| Pérdida de recomendaciones desde el mes 8 | 5.222 | 8.065 | -2.843 | -3.070 | no en 12 meses | 1.136 | 226 |
| Base sin servicios | 2.539 | 8.065 | -5.526 | -5.526 | Sep-27 | 757 | -153 |


**Lectura:**
- **Visualizaciones −50 %:** el YPP se va más allá del mes 12 y el año 1 empeora en ~1.400 €. **Lo que más importa es el packaging y la retención.**
- **RPM a la mitad:** impacto pequeño en el año 1 (solo hay 2 meses monetizados). Pesa mucho en el año 2.
- **Coste de producción al doble:** es el peor caso del año 1 (~−7.200 €). **Por eso no se externaliza antes de validar.**
- **YPP 6 meses más tarde:** ~−300 € en el año 1. Como se ingresa por otras vías, el retraso del YPP **no** hunde el plan. Esa es la ventaja del nicho elegido.
- **Umbral antiguo de 4.000 h (referencia):** en el base apenas adelanta el YPP un mes, porque los **1.000 suscriptores** se alcanzan casi a la vez. La nueva regla castiga más a los formatos de vistas cortas o a los canales que crecen por Shorts.
- **Un vídeo viral (+250.000 vistas):** cambia el año (BAI de ~+5.200 €) y adelanta el YPP al mes 7. No se puede planificar, pero se puede **preparar**: tener la plantilla, la newsletter y la oferta de servicios listas desde el principio, para capturar el pico.
- **Pérdida de recomendaciones desde el mes 8:** ~−1.100 € en el año 1 y YPP fuera del año. Mitigación: tráfico de búsqueda y newsletter (canales propios).

## 16.3 Análisis inverso


| Mezcla de ingresos | 1.000 €/mes | 3.000 €/mes | 5.000 €/mes | 10.000 €/mes |
|---|---|---|---|---|
| Solo AdSense, RPM 3,5 € | 285.714 vistas | 857.143 vistas | 1.428.571 vistas | 2.857.143 vistas |
| Solo AdSense, RPM 2 € (audiencia más latinoamericana) | 500.000 vistas | 1.500.000 vistas | 2.500.000 vistas | 5.000.000 vistas |
| Mezcla madura: anuncios 3,5 + afiliación 3 + patrocinio 2 + producto 7 = 15,5 € por mil | 64.516 vistas | 193.548 vistas | 322.581 vistas | 645.161 vistas |
| Mezcla madura + 1 proyecto de servicios de 1.500 € de margen al mes | 0 vistas | 96.774 vistas | 225.806 vistas | 548.387 vistas |

Beneficio operativo objetivo (estructura de costes por tramo):

| Beneficio objetivo | Vídeos/mes | Coste por vídeo | Herramientas | Costes totales | Ingresos necesarios | Vistas largas/mes necesarias a 15,5 €/mil |
|---|---|---|---|---|---|---|
| 1.000 € | 8 | 80 € | 120 € | 910 € | 1.910 € | 123.226 |
| 3.000 € | 10 | 150 € | 200 € | 1.850 € | 4.850 € | 312.903 |
| 5.000 € | 12 | 220 € | 300 € | 3.090 € | 8.090 € | 521.935 |
| 10.000 € | 16 | 300 € | 450 € | 5.400 € | 15.400 € | 993.548 |

**Interpretación:**
- Con la mezcla madura de ~15,5 € por cada 1.000 vistas, **1.000 € de beneficio operativo al mes** exigen ~120.000 vistas largas al mes (escenario optimista del mes 10-11 o base del mes 18-20). **10.000 € de beneficio** exigen ~1 M de vistas al mes con un equipo de 16 vídeos/mes, o menos vistas si el producto propio (curso o comunidad) tiene más peso.
- **Solo con AdSense**, 10.000 € de ingresos exigen 2,9 M de vistas al mes con un RPM de 3,5 € (o 5 M con RPM de 2 €): escala de medio grande. **Por eso la estrategia no depende del RPM.**
- El atajo honesto hacia 3.000-5.000 €/mes en 12-24 meses es **producto + servicios** sobre una audiencia de 100.000-300.000 vistas mensuales, no la publicidad.
