"""Banco de 100 ideas de vídeo para Mano Extra.

Cada idea: (título, concepto, por qué interesa, gancho, estructura, recursos, dificultad, diferenciación, riesgo,
           descubrimiento, evergreen, facilidad, coste €, intención, competencia, comercial, encaje)
Escalas A/M/B = alto/medio/bajo. Coste = estimación externalizada (edición + recursos), sin el tiempo del propietario.
Las ideas marcadas con (V) dependen de información cambiante: verificar antes de producir.
"""
EST_TUT = "Resultado en 15 s → qué necesitas y coste → paso a paso → errores típicos → plantilla y siguiente paso"
EST_CASO = "El problema del negocio → la solución montada → cómo funciona por dentro → números antes/después → cómo copiarlo"
EST_COMP = "Criterios → prueba igual para todas → resultados en tabla → recomendación por tipo de negocio"
EST_EXPL = "Pregunta clave → contexto mínimo → explicación con diagrama → qué hacer mañana"
REC_PANT = "Grabación de pantalla, diagramas de flujo, callouts"
REC_CASO = "Pantalla + B-roll de stock del sector + diagrama + gráfico antes/después"

P = [  # 20 prioritarios de lanzamiento
("Responde los correos repetidos de tu negocio con IA (sin programar)", "Borradores automáticos de respuesta en Gmail/Outlook a partir de un documento de preguntas frecuentes", "Correo = tarea diaria más odiada", "Te enseño la bandeja: 40 correos, 38 contestados solos en borrador", EST_TUT, REC_PANT, "M", "A", "Privacidad de datos de clientes: explicar RGPD básico", "A","A","M",80,"Problema","M","A","A"),
("Presupuestos en 2 minutos: plantilla + IA para autónomos", "Generar presupuestos desde una nota de voz o formulario con hoja de cálculo e IA", "Los presupuestos lentos pierden clientes", "Dicto 30 segundos al móvil y sale este PDF", EST_TUT, REC_PANT, "M", "A", "Verificar cálculo de IVA/IRPF", "A","A","M",80,"Problema","B","A","A"),
("WhatsApp Business: respuestas automáticas que no parecen un robot", "Configurar mensajes, catálogo y respuestas rápidas + IA para redactar", "WhatsApp es el canal de clientes en España", "Este mensaje lo escribió la IA y el cliente reservó", EST_TUT, REC_PANT, "B", "M", "Normas de Meta (V)", "A","M","A",60,"Problema","M","M","A"),
("Verifactu explicado para autónomos: qué cambia y qué tienes que hacer (V)", "Qué es, plazos 1-ene-2027 / 1-jul-2027, opciones de software", "Obligación legal con fecha", "Si facturas con Word o Excel, esto te afecta", EST_EXPL, "Diagramas, BOE en pantalla, línea temporal", "M", "M", "Exactitud legal: revisar con asesor; fechas (V)", "A","M","M",90,"Búsqueda","M","A","A"),
("Pide reseñas de Google automáticamente después de cada venta", "Flujo: venta/cita → mensaje con enlace de reseña → recordatorio", "Reseñas = clientes nuevos", "De 12 a 60 reseñas sin pedirlas una a una", EST_TUT, REC_PANT, "M", "A", "Normas de Google sobre reseñas incentivadas", "A","A","M",80,"Problema","B","A","A"),
("Tu primera automatización con n8n (gratis) paso a paso", "Instalar/usar n8n cloud y crear un flujo útil: formulario → hoja → correo", "Puerta de entrada técnica", "Esto se ejecuta solo cada vez que alguien rellena tu formulario", EST_TUT, REC_PANT, "M", "M", "Cambios de interfaz (V)", "A","M","M",80,"Búsqueda","M","A","A"),
("ChatGPT vs Claude vs Gemini para tareas de oficina: prueba real (V)", "Misma batería de 6 tareas de negocio a los tres", "Duda universal", "Les di la misma factura desordenada a los tres", EST_COMP, REC_PANT, "M", "M", "Versiones cambian rápido (V)", "A","B","M",90,"Búsqueda","A","M","A"),
("Convierte notas de voz en tareas, citas y correos", "Grabar nota → transcripción → IA clasifica → calendario/tareas", "Dueños que van conduciendo/en la obra", "Hablo 1 minuto en el coche y al llegar está todo apuntado", EST_TUT, REC_PANT, "M", "A", "Privacidad", "M","A","M",80,"Problema","B","M","A"),
("Asistente de IA con los documentos de tu empresa", "Proyecto/GPT con tarifas, procedimientos y FAQs para el equipo", "Empleados preguntan lo mismo", "Mi empleada nueva ya no me pregunta nada", EST_TUT, REC_PANT, "M", "A", "No subir datos sensibles; condiciones de uso", "A","A","M",80,"Problema","M","A","A"),
("Controla gastos: fotos de tickets → hoja de cálculo automática", "OCR + IA para extraer importe, IVA, proveedor", "Contabilidad mensual tediosa", "Hago foto al ticket y aparece aquí, con el IVA separado", EST_TUT, REC_PANT, "M", "A", "Revisar exactitud de OCR; no sustituye gestoría", "A","A","M",80,"Problema","M","A","A"),
("Persigue facturas impagadas sin perseguirlas tú", "Recordatorios escalonados automáticos con tono profesional", "Cobros = supervivencia", "Este correo cobró 3.200 € que llevaban 60 días", EST_TUT, REC_PANT, "M", "A", "Ley de morosidad: tono y plazos (V)", "A","A","M",80,"Problema","B","A","A"),
("Caso real: una gestoría ahorra 6 horas a la semana", "Mini documental del caso con sus flujos", "Prueba social sectorial", "Seis horas. Así las recuperaron", EST_CASO, REC_CASO, "A", "A", "Permiso escrito del negocio; datos anonimizados", "M","A","B",150,"Curiosidad","B","A","A"),
("Agenda de citas que se llena sola (y recuerda a los clientes)", "Reservas online + recordatorios por WhatsApp/SMS", "No-shows cuestan dinero", "Bajamos las ausencias a la mitad con un mensaje", EST_TUT, REC_PANT, "M", "M", "Coste de SMS/API (V)", "A","A","M",80,"Problema","M","A","A"),
("10 prompts que todo autónomo debería tener guardados", "Biblioteca de prompts probados para tareas comunes", "Rápido de consumir, guardable", "El nº 7 me ahorra una hora cada lunes", "Lista con demo breve de cada prompt → descarga", REC_PANT, "B", "B", "Bajo", "A","A","A",50,"Búsqueda","A","M","A"),
("Publica en redes una semana entera en 30 minutos con IA", "Calendario de contenidos + IA + programador gratuito", "Redes = obligación sin tiempo", "Siete publicaciones, treinta minutos, reloj en pantalla", EST_TUT, REC_PANT, "B", "M", "Derechos de imágenes generadas; disclosure", "A","M","A",60,"Problema","A","M","A"),
("Lo que NO deberías automatizar en tu negocio", "Límites: errores, trato humano, datos sensibles", "Contraintuitivo, genera confianza", "Automaticé esto y perdí un cliente", EST_EXPL, "Diagramas + ejemplos", "B", "A", "Bajo", "M","A","A",60,"Curiosidad","B","B","A"),
("Protección de datos y la IA: lo mínimo que debe saber una pyme (V)", "RGPD, qué datos subir, cuentas empresa, encargado de tratamiento", "Miedo legal frena la adopción", "¿Puedes pegar el correo de un cliente en ChatGPT?", EST_EXPL, "Diagramas, texto legal en pantalla", "M", "A", "Revisar con experto; no es asesoramiento", "M","A","M",90,"Búsqueda","B","M","A"),
("La pila de IA de un negocio por menos de 30 € al mes (V)", "Selección mínima con coste real y alternativas gratis", "Sensibilidad al precio", "Esta es mi factura real de herramientas", "Necesidades → herramienta por necesidad → coste total → alternativas gratis", REC_PANT, "B", "A", "Precios cambian (V)", "A","M","A",60,"Búsqueda","M","A","A"),
("Formularios que se convierten en clientes: captación automática", "Formulario web → CRM simple → respuesta inmediata", "Responder rápido gana clientes", "Este lead recibió respuesta en 40 segundos un domingo", EST_TUT, REC_PANT, "M", "A", "Bajo", "M","A","M",80,"Problema","M","A","A"),
("Excel + IA: fórmulas que antes no sabías escribir", "Pedir fórmulas a la IA y verificarlas", "Excel es universal", "No sé hacer un BUSCARX. Ya no hace falta", EST_TUT, REC_PANT, "B", "M", "Errores de fórmulas: enseñar a comprobar", "A","A","A",60,"Búsqueda","A","M","A"),
]

E = [  # 30 evergreen
("Cómo escribir un buen prompt para tu negocio (método en 4 partes)","Método rol-contexto-tarea-formato","Base de todo","El mismo prompt, mal y bien",EST_EXPL,REC_PANT,"B","M","Bajo","A","A","A",50,"Búsqueda","A","B","A"),
("Plantilla de presupuesto profesional en Google Sheets","Plantilla con cálculos de IVA/IRPF","Búsqueda constante","Descárgala y úsala hoy",EST_TUT,REC_PANT,"B","M","Verificar cálculos","A","A","A",50,"Búsqueda","M","A","A"),
("Cómo organizar el correo de tu negocio para no perder clientes","Etiquetas, filtros, respuestas","Problema crónico","Bandeja cero en un negocio real",EST_TUT,REC_PANT,"B","M","Bajo","M","A","A",50,"Problema","M","M","A"),
("Google Business Profile: la guía completa para negocios locales","Optimizar ficha, fotos, publicaciones, respuestas IA","Visibilidad local","Tu ficha de Google vende más que tu web",EST_TUT,REC_PANT,"M","M","Cambios de interfaz (V)","A","A","M",80,"Búsqueda","M","M","A"),
("Cómo hacer un manual de procedimientos con IA","Documentar procesos con grabación + IA","Delegar requiere procesos","Grabé mi pantalla y la IA escribió el manual",EST_TUT,REC_PANT,"M","A","Bajo","M","A","M",70,"Problema","B","A","A"),
("Atención al cliente: plantillas de respuesta para quejas","Respuestas empáticas con IA para quejas y reseñas malas","Situación estresante","Esta reseña de 1 estrella acabó en 5",EST_TUT,REC_PANT,"B","M","Bajo","M","A","A",50,"Problema","M","M","A"),
("Calendario de contenidos para un año en una tarde","Fechas clave del sector + IA","Planificación","365 días de ideas en 3 horas",EST_TUT,REC_PANT,"B","M","Bajo","M","A","A",50,"Problema","M","M","A"),
("Contrata mejor: ofertas de empleo y criba de CV con IA","Redactar oferta, preseleccionar con criterios","Pymes contratan sin RR. HH.","De 200 CV a 10 en una hora (sin discriminar)",EST_TUT,REC_PANT,"M","A","Sesgo y RGPD en selección: advertir","M","A","M",70,"Problema","B","M","A"),
("Cómo calcular el precio por hora real de tu trabajo","Hoja de cálculo de costes y precio","Autónomos cobran poco","Creías cobrar 40 €/h; cobras 17",EST_EXPL,"Hoja + gráficos","B","A","Bajo","A","A","A",50,"Búsqueda","M","M","A"),
("Copias de seguridad automáticas para tu negocio","Backups de archivos/correos","Pérdida de datos","Si mañana te roban el portátil…",EST_TUT,REC_PANT,"B","M","Bajo","M","A","A",50,"Problema","M","M","M"),
("Contraseñas y seguridad básica para pymes","Gestor de contraseñas, 2FA, phishing","Ciberataques a pymes","Este correo de 'Hacienda' es falso",EST_EXPL,REC_PANT,"B","M","Bajo","M","A","A",50,"Problema","M","M","M"),
("Cómo hacer facturas correctas en España (requisitos)","Requisitos legales de una factura","Errores comunes (V)","Tu factura puede no ser válida",EST_EXPL,"Factura anotada","B","M","Normativa (V)","A","A","A",60,"Búsqueda","M","A","A"),
("Firma electrónica de documentos gratis","Firmar y pedir firmas online","Ahorra desplazamientos","Contrato firmado desde el móvil en 2 minutos",EST_TUT,REC_PANT,"B","M","Validez legal según tipo de firma","A","A","A",50,"Búsqueda","M","M","A"),
("Plantillas de correo para vender más (con IA)","Secuencias de seguimiento comercial","Seguimiento = ventas","El 3er correo es el que vende",EST_TUT,REC_PANT,"B","M","Bajo","M","A","A",50,"Problema","M","A","A"),
("Cómo transcribir reuniones y sacar tareas automáticamente","Transcripción + resumen + tareas","Reuniones improductivas","Reunión de 1 hora → 5 tareas asignadas",EST_TUT,REC_PANT,"B","M","Consentimiento de grabación","M","A","A",50,"Problema","M","M","A"),
("Organiza tus archivos de empresa de una vez","Estructura de carpetas + nombres + búsqueda","Caos documental","Encuentra cualquier factura en 5 segundos",EST_TUT,REC_PANT,"B","B","Bajo","M","A","A",40,"Problema","M","B","M"),
("Cómo crear una web sencilla con IA en una tarde","Constructores web con IA","Muchos negocios sin web","De cero a web publicada en 3 horas",EST_TUT,REC_PANT,"M","M","Cambios de herramientas (V)","A","M","M",80,"Búsqueda","A","A","M"),
("Textos para tu web que convierten (con IA y sin sonar a IA)","Método de copy","Webs con textos flojos","Antes/después de una web real",EST_TUT,REC_PANT,"B","M","Bajo","M","A","A",50,"Problema","M","M","A"),
("Inventario simple con hoja de cálculo y alertas","Stock mínimo con avisos","Comercio/taller","Te avisa antes de quedarte sin producto",EST_TUT,REC_PANT,"M","A","Bajo","M","A","M",70,"Problema","B","M","A"),
("Cómo traducir tu negocio a otros idiomas con IA","Web, cartas, correos en inglés/francés","Turismo en España","Mi carta en 5 idiomas sin traductor",EST_TUT,REC_PANT,"B","A","Revisar traducciones sensibles","M","A","A",50,"Problema","M","M","A"),
("Atajos de teclado y trucos que ahorran 1 hora a la semana","Productividad básica","Universal","Este atajo usarás 50 veces al día",EST_TUT,REC_PANT,"B","B","Bajo","A","A","A",40,"Búsqueda","A","B","M"),
("Cómo hacer un informe mensual del negocio automáticamente","Datos → hoja → resumen IA por correo","Dueños sin visión de números","Cada día 1 recibo esto en mi correo",EST_TUT,REC_PANT,"M","A","Bajo","M","A","M",80,"Problema","B","A","A"),
("Crea un catálogo de productos en PDF con IA","Fichas + diseño automático","Comercios y distribuidores","De Excel a catálogo bonito",EST_TUT,REC_PANT,"M","M","Imágenes con licencia","M","A","M",70,"Problema","B","M","A"),
("Cómo usar la IA para preparar una reunión con el banco","Plan financiero simple y argumentos","Financiación","La IA no te da el préstamo, pero sí esto",EST_EXPL,REC_PANT,"B","A","No es asesoramiento financiero","M","A","A",50,"Problema","B","M","A"),
("Plantilla de control de horas y proyectos","Tiempo por cliente/proyecto","Rentabilidad por cliente","Este cliente te cuesta dinero",EST_TUT,REC_PANT,"B","M","Registro horario legal (V)","M","A","A",50,"Problema","M","A","A"),
("Respuestas a reseñas negativas: guía con ejemplos","Protocolo de respuesta","Reputación","Nunca respondas así",EST_EXPL,REC_PANT,"B","M","Bajo","M","A","A",40,"Problema","M","B","A"),
("Cómo pedir y analizar opiniones de clientes con formularios + IA","Encuesta + análisis automático","Mejora continua","100 respuestas resumidas en 1 minuto",EST_TUT,REC_PANT,"M","A","RGPD","M","A","M",70,"Problema","B","M","A"),
("Cómo escribir un buen correo de ventas en frío (sin ser spam)","Prospección B2B ética","B2B","Este correo consiguió 4 reuniones de 20",EST_TUT,REC_PANT,"B","M","Normativa LSSI sobre comunicaciones comerciales","M","A","A",50,"Problema","M","M","A"),
("Mapa de herramientas gratuitas para autónomos (actualizable) (V)","Directorio comentado","Recurso guardable","Todo esto es gratis",EST_COMP,REC_PANT,"B","M","Planes gratis cambian (V)","A","M","A",50,"Búsqueda","A","A","A"),
("Glosario de IA para dueños de negocio en 12 minutos","Términos explicados sin tecnicismos","Entender para decidir","Lo que te venden con palabras raras",EST_EXPL,"Diagramas animados simples","B","M","Bajo","M","A","A",60,"Búsqueda","M","B","A"),
]

X = [  # 20 experimentales
("Le doy mi negocio a la IA durante una semana: ¿qué pasa?","Reto narrativo","Formato entretenido","Día 1: la IA contesta a mi mejor cliente",EST_CASO,REC_CASO,"A","A","Supervisar todo; ficción vs realidad","A","B","B",150,"Curiosidad","B","M","M"),
("Automatización de 5 € vs consultora de 5.000 €","Comparativa provocadora","Curiosidad","Mismo resultado. ¿O no?",EST_COMP,REC_CASO,"M","A","Justicia con terceros","A","M","M",90,"Curiosidad","B","A","A"),
("Agentes de IA para pymes: ¿humo o útil? (V)","Prueba de agentes actuales","Tema candente","Le pedí a un agente que hiciera mi contabilidad",EST_COMP,REC_PANT,"A","M","Rápida caducidad (V)","A","B","M",100,"Curiosidad","A","M","A"),
("Construyo un recepcionista telefónico con IA (V)","Voz IA que atiende llamadas","Novedad potente","Llama a este número: no es una persona",EST_TUT,REC_PANT,"A","A","Avisar de que es IA; grabaciones","A","M","B",120,"Curiosidad","M","A","A"),
("La IA lee 100 facturas: ¿cuántos errores comete?","Experimento medido","Escepticismo","Errores: 7. Así se reducen a 0",EST_COMP,REC_PANT,"M","A","Datos ficticios o anonimizados","M","M","M",90,"Curiosidad","B","M","A"),
("¿Cuánto tiempo ahorra realmente la IA? Lo medí 30 días","Diario medido","Prueba social","Spoiler: no es lo que esperaba",EST_CASO,REC_CASO,"M","A","Honestidad metodológica","A","M","B",120,"Curiosidad","B","M","A"),
("3 errores de automatización que me costaron dinero","Fallo como contenido","Confianza","Este flujo envió 300 correos duplicados",EST_CASO,REC_PANT,"B","A","Bajo","M","A","A",60,"Curiosidad","B","B","A"),
("Short-serie: 'Una automatización en 60 segundos'","Formato Shorts","Descubrimiento","60 segundos, una tarea menos",
 "Resultado → 3 pasos → plantilla en el canal",REC_PANT,"B","M","Bajo","A","M","A",15,"Curiosidad","A","B","A"),
("Directo: monto la automatización que me pidáis","Directo semanal","Comunidad","Tú eliges, yo lo monto",
 "Votación → construcción en vivo → preguntas",REC_PANT,"M","A","Errores en directo","M","B","M",20,"Comunidad","B","M","A"),
("Hago el trabajo de un día de una gestoría solo con IA","Reto sectorial","Sector concreto","9:00. Llegan 47 correos",EST_CASO,REC_CASO,"A","A","No sustituye a profesional; permiso","A","M","B",150,"Curiosidad","B","M","A"),
("Lo que la IA no sabe de Hacienda (y te puede costar caro)","Errores típicos de chatbots en fiscalidad","Miedo + utilidad","Le pregunté esto a 3 IAs. Las 3 fallaron",EST_EXPL,REC_PANT,"M","A","Verificación con asesor","A","M","M",90,"Curiosidad","B","M","A"),
("Clono mi voz para mis vídeos: ¿se nota?","Meta-contenido sobre producción","Curiosidad creadores","Esta frase no la he dicho yo",EST_COMP,REC_PANT,"B","M","Disclosure de contenido sintético","M","M","A",60,"Curiosidad","M","A","M"),
("Automatiza tu vida personal de autónomo (recibos, citas médicas, colegio)","Ampliar a lo personal","Audiencia más amplia","Mi semana personal en piloto automático",EST_TUT,REC_PANT,"M","M","Privacidad","M","M","M",80,"Curiosidad","M","B","M"),
("Probé 5 apps de IA que salen en anuncios: ¿valen la pena? (V)","Reseñas honestas","Ruido publicitario","Pagué para que tú no tengas que hacerlo",EST_COMP,REC_PANT,"M","M","Derecho de crítica; hechos verificables","A","B","M",90,"Búsqueda","A","M","M"),
("IA en el campo: automatización para negocios agrícolas","Sector infra-atendido","España rural","Una cooperativa con un asistente de IA",EST_CASO,REC_CASO,"A","A","Conseguir caso real","M","A","B",150,"Curiosidad","B","M","A"),
("Restaurante: carta, pedidos y reservas con IA","Hostelería","Sector enorme en España","El camarero que nunca se equivoca de mesa",EST_CASO,REC_CASO,"A","A","Permiso del local","A","A","B",150,"Problema","M","A","A"),
("Mi automatización favorita de cada mes (formato recurrente)","Serie mensual","Hábito","La de este mes me ha cambiado los lunes",EST_TUT,REC_PANT,"B","B","Bajo","B","B","A",50,"Comunidad","B","M","A"),
("¿Puede la IA hacer la declaración trimestral de un autónomo? (V)","Prueba con supervisión de asesor","Pregunta frecuente","Spoiler: casi. Y ese 'casi' importa",EST_COMP,REC_PANT,"A","A","No es asesoramiento; revisar con asesor","A","M","M",100,"Curiosidad","B","M","A"),
("Hablo con 3 dueños de negocio sobre la IA (voces, sin caras)","Entrevistas en audio","Realidad del mercado","'Me da miedo meter los datos de mis clientes'",
 "3 historias → patrones → respuestas",REC_CASO,"M","A","Consentimiento","M","M","M",100,"Curiosidad","B","B","A"),
("Reto: 0 € de presupuesto, automatizo un negocio entero","Solo herramientas gratis","Accesibilidad","Coste total: cero euros",EST_CASO,REC_PANT,"M","A","Límites de planes gratis (V)","A","M","M",90,"Curiosidad","M","M","A"),
]

F = [  # 20 de profundización
("Curso gratuito: n8n desde cero para negocios (vídeo pilar)","Guía larga 25-35 min","Búsqueda de alto valor","Al acabar tendrás 3 automatizaciones funcionando",EST_TUT,REC_PANT,"A","M","Cambios de versión (V)","A","M","B",150,"Búsqueda","M","A","A"),
("Make en español: guía completa para principiantes (V)","Guía pilar","Alternativa a n8n","Sin escribir una línea de código",EST_TUT,REC_PANT,"A","M","Precios/planes (V)","A","M","B",150,"Búsqueda","M","A","A"),
("IA para gestorías: 7 automatizaciones (serie sectorial)","Sector","Profesionales con dinero","La campaña de la renta sin horas extra",EST_CASO,REC_CASO,"A","A","Normativa del sector","M","A","B",150,"Problema","B","A","A"),
("IA para clínicas (dentales, fisio, estética)","Sector","Citas, recordatorios, reseñas","Ausencias −50 %",EST_CASO,REC_CASO,"A","A","Datos de salud: máxima cautela","M","A","B",150,"Problema","B","A","A"),
("IA para talleres mecánicos","Sector","Presupuestos y avisos","El cliente sabe cuándo recoge el coche sin llamar",EST_CASO,REC_CASO,"A","A","Permiso","M","A","B",150,"Problema","B","A","A"),
("IA para inmobiliarias","Sector","Fichas, leads, visitas","Ficha de piso en 2 minutos",EST_CASO,REC_CASO,"A","A","Ley de vivienda (V)","M","A","B",150,"Problema","M","A","A"),
("IA para academias y formadores","Sector","Matrículas, materiales","Material de clase en 10 minutos",EST_CASO,REC_CASO,"A","A","Derechos de materiales","M","A","B",150,"Problema","B","A","A"),
("IA para comercio de barrio","Sector","Stock, redes, WhatsApp","La tienda que compite con Amazon",EST_CASO,REC_CASO,"A","A","Bajo","M","A","B",150,"Problema","B","A","A"),
("Montamos un CRM gratis para tu negocio (vídeo pilar)","Guía larga","Gestión comercial","Todos tus clientes y seguimientos en un sitio",EST_TUT,REC_PANT,"A","M","Bajo","A","A","B",150,"Búsqueda","M","A","A"),
("La factura electrónica obligatoria B2B en España: estado y preparación (V)","Ley Crea y Crece; calendario","Obligación futura","Lo que viene después de Verifactu",EST_EXPL,"Diagramas, BOE","M","M","Calendario incierto (V)","A","M","M",90,"Búsqueda","M","A","A"),
("Cómo elegir programa de facturación en 2027: guía neutral (V)","Comparativa de criterios","Decisión de compra","No te dejes llevar por el anuncio",EST_COMP,REC_PANT,"M","A","Neutralidad con afiliados","A","M","M",100,"Búsqueda","A","A","A"),
("Construye tu asistente de IA de empresa (vídeo pilar)","Asistente con documentos y herramientas","Proyecto completo","Tu empleado digital, paso a paso",EST_TUT,REC_PANT,"A","A","Privacidad","A","M","B",150,"Búsqueda","M","A","A"),
("Automatiza la contabilidad previa para tu gestoría","Del ticket al envío ordenado a la gestoría","Relación con gestor","Tu gestor te lo agradecerá",EST_TUT,REC_PANT,"M","A","No sustituye gestoría","M","A","M",90,"Problema","B","A","A"),
("Seguridad de los flujos automáticos: lo que nadie te cuenta","Permisos, claves API, errores","Riesgo real","Esta clave expuesta puede costarte miles",EST_EXPL,REC_PANT,"M","A","Bajo","M","A","M",80,"Problema","B","M","A"),
("De Excel a base de datos: cuándo dar el salto","Airtable/Sheets/BD","Crecimiento","Tu Excel de 20.000 filas te está frenando",EST_EXPL,REC_PANT,"M","M","Bajo","M","A","M",80,"Problema","M","A","A"),
("IA y derechos de autor: qué puedes usar en tu negocio (V)","Imágenes, textos, marcas","Duda legal","¿Puedes usar en tu web esta imagen de IA?",EST_EXPL,"Diagramas, casos","M","A","No es asesoramiento legal","M","M","M",90,"Búsqueda","B","B","A"),
("Lleva la cuenta de tus clientes rentables con un panel automático","Dashboard","Decisiones","Este panel me dijo qué cliente despedir",EST_TUT,REC_PANT,"M","A","Bajo","M","A","M",90,"Problema","B","A","A"),
("Cómo delegar en un asistente virtual + IA","Combinar persona + IA","Escalado de negocio","2 horas de una persona + IA = 1 empleado",EST_EXPL,REC_PANT,"M","A","Laboral: contratos","M","A","M",80,"Problema","B","A","A"),
("Plan de 90 días para meter la IA en tu negocio","Hoja de ruta","Paso a paso","Semana 1: solo esto",EST_EXPL,"Diagramas, plantilla","B","A","Bajo","A","A","A",60,"Búsqueda","M","A","A"),
("Auditoría de procesos: encuentra qué automatizar primero","Método de priorización","Por dónde empezar","Esta matriz te dice qué automatizar primero",EST_EXPL,"Plantilla en pantalla","B","A","Bajo","M","A","A",60,"Problema","B","A","A"),
]

C = [  # 10 con potencial comercial / patrocinio
("Probé los 5 programas de facturación con Verifactu: comparativa (V)","Comparativa patrocinable con independencia editorial","Decisión de compra","Mismo autónomo, 5 programas, 1 ganador por perfil",EST_COMP,REC_PANT,"M","M","Neutralidad; transparencia de patrocinio","A","M","M",120,"Búsqueda","A","A","A"),
("La mejor herramienta de voz IA para tu negocio (V)","Comparativa voz IA (afiliación ElevenLabs y otras)","Atención telefónica/vídeo","Escucha a ciegas: ¿cuál es humana?",EST_COMP,REC_PANT,"M","M","Disclosure; precios (V)","A","B","M",90,"Búsqueda","M","A","A"),
("n8n vs Make vs Zapier para pymes (V)","Comparativa con afiliación","Decisión técnica","El mismo flujo en los tres: tiempo y coste",EST_COMP,REC_PANT,"M","M","Precios (V)","A","M","M",100,"Búsqueda","A","A","A"),
("Banco para autónomos: cuál automatiza mejor (V)","Neobancos/banca con integraciones","Decisión financiera","Conciliación automática con cada banco",EST_COMP,REC_PANT,"M","M","Publicidad financiera: cumplimiento","A","M","M",100,"Búsqueda","A","A","M"),
("Kit de plantillas Mano Extra: lo que hay dentro","Lanzamiento de producto propio","Conversión","Las 12 plantillas que uso cada semana",
 "Problema → demostración de 3 plantillas → oferta → garantía",REC_PANT,"B","B","Protección del consumidor: condiciones claras","B","M","A",40,"Compra","B","A","A"),
("CRM para pequeñas empresas: prueba real de 4 opciones (V)","Comparativa patrocinable","Compra B2B","Monté el mismo embudo en 4 CRM",EST_COMP,REC_PANT,"M","M","Neutralidad","A","M","M",120,"Búsqueda","A","A","A"),
("Las herramientas que pago cada mes y por qué (V)","Transparencia + afiliación","Confianza","Mi factura de software, al céntimo",EST_COMP,REC_PANT,"B","A","Precios (V)","M","M","A",50,"Curiosidad","M","A","A"),
("Taller en directo: automatiza tu negocio en 2 horas (de pago)","Webinar de pago o lead magnet","Producto","Sales con 3 automatizaciones funcionando",
 "Agenda → construcción guiada → preguntas",REC_PANT,"M","A","Facturación de eventos","B","M","M",30,"Compra","B","A","A"),
("Gestoría online vs gestor de toda la vida: análisis (V)","Comparativa patrocinable","Decisión recurrente","Lo que te cuesta cada opción al año",EST_COMP,REC_PANT,"B","M","Neutralidad","A","M","A",80,"Búsqueda","M","A","M"),
("Monta tu chatbot web con IA (patrocinable por plataforma) (V)","Tutorial con herramienta patrocinadora","Atención 24/7","Tu web contesta mientras duermes",EST_TUT,REC_PANT,"M","M","Disclosure; RGPD","A","M","M",100,"Problema","A","A","A"),
]

CATEGORIAS = [("Prioritarios de lanzamiento", P), ("Evergreen", E), ("Experimentales", X), ("Profundización", F), ("Potencial comercial o patrocinio", C)]

def tabla_md():
    out = []
    n = 0
    for nombre, lista in CATEGORIAS:
        out.append(f"\n### {nombre} ({len(lista)})\n")
        out.append("| # | Título provisional | Concepto central | Por qué interesa | Gancho | Estructura | Recursos visuales | Dific. | Diferenc. | Riesgos de veracidad / derechos | Desc. | Everg. | Facilidad | Coste € | Intención | Comp. | Comercial | Encaje |")
        out.append("|"+"---|"*18)
        for i in lista:
            n += 1
            t,c,w,h,s,r,d,dif,rk,desc,ev,fa,co,inte,comp,com,enc = i
            out.append(f"| {n} | {t} | {c} | {w} | {h or '—'} | {s} | {r} | {d} | {dif} | {rk} | {desc} | {ev} | {fa} | {co} | {inte} | {comp} | {com} | {enc} |")
    assert n == 100, n
    return "\n".join(out)

if __name__ == "__main__":
    print(tabla_md())
