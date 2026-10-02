# PROPO — Tu equipo de licitaciones con IA

Encuentra las licitaciones. PROPO prepara el resto. Busca licitaciones públicas compatibles con tu empresa, sube el pliego y PROPO analiza los requisitos, prepara la propuesta con fuentes y comprueba el cumplimiento. Tu equipo revisa, aprueba y presenta.

## Qué hay en este repositorio

```
src/
  marketing/        Landing, precios, funcionalidades, seguridad, recursos, contacto, páginas legales
  auth/             Registro, acceso, preguntas de bienvenida (sector y regiones), onboarding de 5 pasos
  app/              Inicio, Licitaciones (buscador + alertas), Mis proyectos, pantalla de análisis,
                    Empresa, Documentos, Plantillas, Avisos, Ajustes (cuenta, equipo, facturación,
                    privacidad y datos), Administración
  app/project/      Proyecto: resumen, requisitos, propuesta, criterios, cumplimiento, paquete final,
                    documentos del pliego, chat «Pregunta a PROPO»
  lib/discovery/    Instantánea real de TED (30/09/2026) y puntuación de compatibilidad explicable
  lib/pipeline/     Lectura de PDF/DOCX/XLSX/ZIP, fragmentación y búsqueda, extracción por reglas,
                    cruce con el conocimiento de la empresa, validación de citas
  lib/ai/           Frontera con el proveedor de IA, prompts, análisis/redacción/chat
  lib/              Estado, planes, métricas derivadas, generador del paquete, datos de ejemplo
server/             Referencia de producción: Stripe + webhooks, proveedor OpenAI, jobs del pipeline,
                    OCR, almacenamiento con URLs firmadas, Supabase y discovery/ (TED, PLACSP, sync diario)
db/schema.sql       Esquema Postgres multiempresa con RLS, pgvector, registro de actividad y oportunidades
docs/               ARCHITECTURE.md, PRICING.md, ANALYTICS.md
test/               Pruebas end-to-end con Playwright (reglas, IA simulada, casos límite, móvil)
```

## Cómo ejecutarlo

```bash
npm install
npm run build          # -> dist/index.html (independiente) y dist/propo.html (cuerpo del artifact)
python3 -m http.server 8765   # abre http://localhost:8765/dist/index.html
npm run test:e2e       # necesita el servidor estático en :8765
```

## Qué es real y qué está simulado

**Real en esta versión:** lectura de PDF, DOCX, XLSX y ZIP; extracción por páginas; detección de archivos escaneados o ilegibles; extracción por reglas de requisitos, criterios, plazos y presupuesto; validación de que cada cita existe en su página; cruce con el conocimiento de la empresa; límites de plan; estados de revisión humana; comprobaciones de cumplimiento (incluida la detección de precios en el sobre B); generación de PDF y ZIP final descargable; exportación y borrado de datos.

**Buscador de licitaciones:** los ~60 anuncios son **reales**, obtenidos de la API pública de TED el 30/09/2026 (anuncios publicados en España). Es una **instantánea**, no un feed en directo: el entorno de la demo no tiene acceso de red a TED ni a PLACSP. La puntuación de compatibilidad es determinista (sin IA) y explica cada motivo. La sincronización diaria con TED y la Plataforma de Contratación del Sector Público está en `server/discovery/`. Las alertas se guardan, pero no envían correos en esta versión.

**Pliegos incluidos:** 33 de las 59 licitaciones traen sus pliegos oficiales (PCAP y PPT en PDF) dentro de PROPO, descargados el 1/10/2026 de la Plataforma de Contratación del Sector Público, la plataforma catalana, el portal de la Comunidad de Madrid y el portal de licitaciones de la UE (carpeta `pliegos/`). «Analizar los pliegos con PROPO» los lee automáticamente: el cliente no descarga ni sube nada. Las 26 restantes publican sus pliegos en portales que PROPO aún no lee (Euskadi, Galicia, Andalucía, Sergas, F4E con registro previo, ADIF); para ellas el análisis parte de una ficha con los datos oficiales del anuncio y se pueden añadir los PDF después.

**PROPO te pregunta:** tras el análisis, un chat guiado pregunta solo lo que falta (requisitos clave y datos de empresa), guarda las respuestas en los requisitos y en la memoria de empresa, y redacta la propuesta al terminar.

**IA:** dentro de claude.ai la página usa Claude (con la cuenta de quien la abre y con su consentimiento) para analizar, redactar y responder. En cualquier otro sitio PROPO lo indica y usa extracción por reglas, plantillas y respuestas basadas en búsqueda.

**Simulado y señalado:** autenticación (cuenta local de demo, la contraseña no se guarda), pagos (sin checkout; el «plan de prueba» se marca como sin pago), invitaciones por correo, métricas de plataforma en Administración (marcadas como ejemplo). El código de producción está en `server/`.

## Datos de ejemplo

**Demo completa** («Ver una propuesta terminada» en la portada, «Demo completa» en el acceso o el botón del menú lateral en la demo): el mismo proyecto de ejemplo con toda la documentación que faltaba ya subida — ISO 22000, póliza de 600.000 €, plan de PRL, compromiso de inserción, flota e informe de compras —, las preguntas de PROPO respondidas, los 43 requisitos cumplidos y las 10 secciones aprobadas. Los 19 documentos de la biblioteca se generan en el navegador como PDF marcados «EJEMPLO FICTICIO — SIN VALIDEZ», así el paquete final se descarga con sus archivos. El último paso (marcar como lista) lo hace la persona.

«Servicio de restauración municipal de Barcelona» y los demás proyectos de ejemplo, la empresa «Mesa Viva Catering S.L.» y las organizaciones que aparecen en ellos son ficticios. El botón «Usar un pliego de ejemplo» genera en el navegador un pliego ficticio de 6 páginas para probar el pipeline real sin tener un pliego a mano. Los anuncios del buscador, en cambio, son reales y enlazan a su ficha en TED.
