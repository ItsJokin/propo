# PROPO — Analítica de producto

Los eventos se emiten con `track(name, props)` (`src/lib/store.ts`). En el MVP se guardan localmente y se ven en **Administración → Flujo de eventos**. En producción van a PostHog (UE), y los eventos de facturación se capturan en el servidor desde los webhooks de Stripe.

| Métrica | Definición | Eventos / fuente |
|---|---|---|
| Altas | Cuentas creadas | `signup` |
| Activación | El espacio completa un análisis **y** resuelve ≥ 1 requisito o aprueba ≥ 1 sección en 7 días | `analysis_completed`, `section_approved`, cambios de requisitos |
| Uso del buscador | Búsquedas, licitaciones abiertas y guardadas, alertas creadas | `tender_search`, `tender_saved`, `alert_created` |
| Buscador → proyecto | Licitaciones encontradas en PROPO que se convierten en proyecto | `tender_analyze_clicked`, `project_created { tenderId }` |
| Prueba → pago | Espacios en prueba que pasan a `active` en Stripe | webhook `customer.subscription.updated` |
| Proyectos creados | | `project_created` |
| Documentos subidos | Biblioteca + archivos de pliegos | `document_uploaded` |
| Propuestas completadas | Marcadas como listas por una persona | `proposal_completed` |
| Generaciones de IA | Secciones redactadas/regeneradas, respuestas del chat | `section_generated`, `chat_question` |
| Tiempo ahorrado (estimación) | 3 min por página de pliego analizada + 45 min por sección redactada | derivada; se muestra en Administración |
| MRR | Suma de suscripciones activas, normalizada al mes | Stripe |
| Bajas | Suscripciones canceladas en el periodo / activas al inicio | Stripe |
| Mejoras de plan | Pro → Business, prueba → pago, propuestas extra | `checkout_started`, Stripe |

Embudo: CTA de la landing → alta → sector y regiones → primera licitación abierta → primer análisis → primera aprobación → muro de pago visto → checkout iniciado → pago. Los clics en CTA se etiquetan (`cta_click { cta }`).

Privacidad: los eventos llevan identificadores y recuentos, nunca contenido de documentos. Las cookies de analítica solo se activan tras el consentimiento.
