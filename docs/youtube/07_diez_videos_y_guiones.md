# Fase VIII: Desarrollo de los diez primeros vídeos

Normas comunes de producción para los diez vídeos:
- **Narración:** voz real del propietario (recomendada: aporta autenticidad y evita tener que declarar voz sintética realista), o voz clonada **del propio propietario** con ElevenLabs y su consentimiento, sin imitar a terceros.
- **Música:** biblioteca de audio de YouTube (gratis) o Epidemic Sound (con licencia), lecho suave.
- **Efectos:** "clic" de interfaz y "ding" de resultado (firma).
- **Ritmo:** cambio visual cada 4-8 s, recortando las esperas.
- **Recursos con licencia:** música y B-roll de stock. Los logotipos de terceros se usan solo para identificar la herramienta (uso nominativo), nunca como elemento dominante.
- **Generable con IA:** primer borrador del guion, variantes de títulos, iconos o ilustraciones no realistas, subtítulos, capítulos y descripción.
- **No se genera con IA:** capturas, demos (deben ser reales) y datos legales o fiscales.

---

## 13.1 Vídeo 1: Responde los correos repetidos de tu negocio con IA

**Packaging**
- Títulos: (a) *Responde los correos repetidos de tu negocio con IA (sin programar)*; (b) *Tu bandeja de entrada se contesta sola: IA para negocios pequeños*; (c) *Deja de escribir el mismo correo 20 veces al día*.
- Miniatura: bandeja de entrada con 38 correos marcados con un ✓ verde y un cursor naranja. A la derecha, el texto "SE CONTESTAN SOLOS*". El asterisco se resuelve en el vídeo: quedan en borrador y tú revisas.
- Tensión título-miniatura: "¿de verdad solos?" → el vídeo responde con honestidad ("solos no: en borrador, y tú decides").
- Hipótesis de clic: dolor diario y promesa concreta y creíble, sin código.

**Guion (estructura):** resultado (0:00) → la regla de oro: borrador, nunca envío automático (0:40) → nivel 1, gratis en 10 minutos: documento de respuestas + prompt (1:30) → nivel 2, automático con n8n (5:00) → protección de datos (9:00) → costes reales (10:15) → plantilla y siguiente vídeo (11:00).
**Producción:** pantalla de Gmail y n8n, diagrama trigger → IA → borrador. Fuentes: ayuda de Gmail, documentación de n8n, página de precios del proveedor de IA, guía de la AEPD sobre IA. **Guion completo en 13.11.**

## 13.2 Vídeo 2: Presupuestos en 2 minutos

**Packaging**
- Títulos: (a) *Presupuestos en 2 minutos: plantilla + IA para autónomos*; (b) *Dicto 30 segundos y sale un presupuesto en PDF*; (c) *El sistema de presupuestos más rápido para un negocio pequeño*.
- Miniatura: móvil con una onda de voz → flecha naranja → PDF de presupuesto con el total resaltado. Texto: "30 s → PDF".
- Tensión: transformación imposible de ignorar (voz → documento).
- Hipótesis de clic: el autónomo pierde clientes por tardar en presupuestar.

**Guion (estructura):** demo del resultado → por qué la velocidad gana clientes (sin cifras inventadas: es una hipótesis razonada) → la plantilla (tarifas, IVA) → la IA convierte la nota en partidas → generación del PDF → revisión humana → descarga de la plantilla. **Guion completo en 13.12.**

## 13.3 Vídeo 3: Verifactu explicado para autónomos (V)

- Títulos: (a) *Verifactu: qué cambia para autónomos y qué tienes que hacer antes de julio de 2027*; (b) *¿Facturas con Excel? Verifactu te afecta*; (c) *Verifactu en 10 minutos (sin tecnicismos)*.
- Miniatura: calendario con "1 JUL 2027" en un círculo naranja, una factura con un QR y el texto "¿TE AFECTA?". **Verificar la fecha el día de publicación.**
- Clic: obligación legal + miedo a la sanción + promesa de brevedad.
- Guion: apertura con la pregunta ("si facturas con Word o Excel, quédate 10 minutos") → qué es (sistema de facturación que registra y remite o conserva registros; explicado con un diagrama) → a quién afecta y cuándo (RDL 15/2025: sociedades el 1-1-2027 y resto el 1-7-2027) → opciones: programa homologado o el servicio de la AEAT → errores típicos → lista de comprobación descargable → aviso legal.
- Producción: diagrama animado del flujo de la factura, BOE en pantalla y línea temporal. Fuentes: **BOE (RD 1007/2023, RDL 15/2025), sede de la AEAT** y revisión de un asesor fiscal antes de publicar. Riesgo: alto si hay errores; revisión obligatoria.

## 13.4 Vídeo 4: Reseñas de Google automáticas

- Títulos: (a) *Pide reseñas de Google automáticamente después de cada venta*; (b) *De 12 a 60 reseñas sin pedirlas una a una*; (c) *El mensaje que hace que tus clientes te dejen 5 estrellas*.
- **Advertencia: la cifra "de 12 a 60" solo se usa si procede de un caso real documentado.** Si no, se usa (a).
- Miniatura: ficha de Google con estrellas que suben y un contador naranja.
- Guion: resultado → enlace directo de reseña → momento óptimo de envío → flujo (venta/cita → espera → mensaje) → plantilla de mensaje → **qué está prohibido** (incentivar reseñas o filtrar solo las positivas: normas de Google) → responder reseñas con IA.
- Fuentes: políticas de contenido de Google Maps.

## 13.5 Vídeo 5: Persigue facturas impagadas sin perseguirlas tú

- Títulos: (a) *Persigue facturas impagadas sin perseguirlas tú (recordatorios automáticos)*; (b) *El correo que cobra tus facturas atrasadas*; (c) *Cobra antes: sistema automático de recordatorios*.
- Miniatura: factura con un sello "PAGADA" verde sobre un fondo de calendario tachado. Texto: "COBRADA SOLA".
- Guion: dolor (impagos) → secuencia de 3 recordatorios con tono escalonado → hoja de facturas con fechas → automatización (Sheets + n8n o Make) → plantillas de texto → cuándo pasar a la vía formal (mencionar la Ley 3/2004 de morosidad de forma general; **verificar plazos**).
- Riesgo: el tono debe ser legal y profesional, sin amenazas.

## 13.6 Vídeo 6: Tu primera automatización con n8n

- Títulos: (a) *Tu primera automatización con n8n (paso a paso, en español)*; (b) *n8n desde cero: formulario → hoja → correo en 15 minutos*; (c) *Automatiza tu negocio con n8n sin saber programar*.
- Miniatura: tres nodos conectados (formulario, hoja, correo) en la paleta de la marca y el texto "15 MIN".
- Guion: qué es n8n y en qué se diferencia de Make o Zapier (sin desprestigiar) → cuenta en la nube frente a instalación propia (coste; **verificar planes**) → crear el flujo → probar → errores frecuentes → siguiente nivel.
- Afiliación: enlace de n8n marcado (30 % durante 12 meses, **solo cuentas en la nube**) [DATO, condiciones vía PartnerStack; verificar].

## 13.7 Vídeo 7: WhatsApp Business con respuestas automáticas

- Títulos: (a) *WhatsApp Business: respuestas automáticas que no parecen un robot*; (b) *Configura WhatsApp Business como un profesional en 12 minutos*; (c) *Atiende WhatsApp sin estar pegado al móvil*.
- Miniatura: conversación de WhatsApp con una respuesta cálida y el texto "NO ES UN ROBOT*".
- Guion: funciones nativas gratuitas (mensaje de bienvenida, ausencia, respuestas rápidas, catálogo) → la IA redacta las respuestas tipo → límites (la automatización avanzada requiere la API de WhatsApp Business y proveedores; **verificar políticas de Meta y costes**) → buenas prácticas.

## 13.8 Vídeo 8: Tickets → hoja de cálculo automática

- Títulos: (a) *Haz una foto al ticket y aparece en tu hoja de gastos (con el IVA separado)*; (b) *Contabilidad de gastos automática para autónomos*; (c) *Adiós a la caja de zapatos de tickets*.
- Miniatura: ticket arrugado → flecha → fila de hoja de cálculo con la columna IVA en verde.
- Guion: resultado → herramienta de lectura (IA multimodal) → plantilla de hoja → automatización → **verificación de la lectura** (cómo detectar errores) → envío ordenado a la gestoría → aviso: no sustituye la contabilidad oficial ni la conservación de facturas.

## 13.9 Vídeo 9: Caso real, una gestoría ahorra 6 horas a la semana

- **Condición: solo se produce con un caso real**, con permiso escrito y horas medidas. Si las horas medidas son otras, se cambia el título.
- Títulos: (a) *Una gestoría recupera 6 horas a la semana con IA: así lo hizo*; (b) *Lo que automatizamos en una gestoría real (y lo que no)*; (c) *IA en una gestoría: antes y después*.
- Miniatura: reloj "−6 h" en verde sobre una mesa de oficina con papeles (B-roll con licencia o foto real autorizada).
- Guion (mini documental): el problema contado por la gestora (voz, sin imagen) → diagnóstico de procesos → 3 automatizaciones → números → lo que no se automatizó y por qué → cómo copiarlo.
- Captación: CTA "¿quieres que miremos tu caso?".

## 13.10 Vídeo 10: La pila de IA por menos de 30 € al mes (V)

- Títulos: (a) *Todas las herramientas de IA que necesita un negocio pequeño por menos de 30 € al mes*; (b) *Mi factura real de herramientas de IA (y las alternativas gratis)*; (c) *La pila mínima de IA para autónomos*.
- Miniatura: recibo con el total "29,50 €" (**cifra real del día**) y logotipos pequeños.
- Guion: necesidades → herramienta por necesidad → coste → alternativa gratuita → qué no comprar todavía → transparencia sobre la afiliación.

---

## 13.11 Guion completo del vídeo 1

**Título:** Responde los correos repetidos de tu negocio con IA (sin programar)
**Duración estimada:** ~11-12 minutos de vídeo (unas 1.500 palabras a ~140 palabras por minuto, más demos sin locución).
**Antes de grabar, verificar:** nombres de los menús de Gmail y n8n, planes y precios de n8n y del proveedor de IA, condiciones de uso de datos del proveedor elegido.

> **[0:00 – APERTURA. Pantalla: bandeja con 40 correos sin leer. Corte rápido: la misma bandeja con 38 borradores listos.]**
>
> Esta es la bandeja de entrada de un negocio un lunes por la mañana: cuarenta correos. Y esta es la misma bandeja diez minutos después: treinta y ocho respuestas escritas, esperando a que alguien las lea y pulse "enviar". No las he escrito yo. Tampoco se han enviado solas, y en un momento te explico por qué eso es importante.
>
> En este vídeo te enseño a montarlo de dos formas: una gratis, que puedes usar hoy en diez minutos, y otra automática, para cuando quieras que pase sin tocar nada. Sin programar.
>
> **[0:40 – LA REGLA DE ORO. Gráfico: "IA → BORRADOR → TÚ → ENVIAR".]**
>
> Antes de nada, la regla que vamos a seguir todo el vídeo: la IA escribe borradores, tú envías. Siempre. Una IA puede equivocarse con un precio, inventarse un dato o contestar con un tono que no es el tuyo. Si el correo sale solo, ese error lo ve tu cliente. Si sale en borrador, lo ves tú en dos segundos. Ahorras casi todo el tiempo y no te juegas nada.
>
> **[1:30 – NIVEL 1. Pantalla: documento en blanco titulado "Respuestas de [negocio]".]**
>
> Nivel uno. Lo primero no es la IA: es un documento. Abre un documento y escribe las diez preguntas que más te hacen por correo y cómo las respondes. Horarios, precios, plazos, cómo pedir cita, qué pasa si alguien quiere cancelar. No hace falta que esté bonito. Que esté bien.
>
> **[Pantalla: el documento rellenado con 10 preguntas.]**
>
> Este documento es el cerebro de todo el sistema. La IA no sabe cuánto cobras ni cuál es tu política de devoluciones. Si no se lo das, se lo inventará. Este paso te lleva veinte minutos una vez y te sirve para siempre.
>
> **[2:40 – Pantalla: asistente de IA (ChatGPT, Claude o Gemini), nueva conversación o "proyecto".]**
>
> Ahora abre tu asistente de IA. Me da igual cuál: ChatGPT, Claude o Gemini sirven. Si tu herramienta permite crear un "proyecto" o un asistente con instrucciones fijas, úsalo. Así no tienes que pegar el documento cada vez. Pega tu documento y estas instrucciones. Las tienes en la descripción.
>
> **[Pantalla: el prompt, resaltado por partes.]**
>
> "Eres la persona que responde los correos de [nombre del negocio]. Responde solo con la información del documento. Si la respuesta no está en el documento, no la inventes: escribe 'PENDIENTE: [lo que falta]'. Tono: cercano y profesional, de tú. Máximo ocho líneas. Firma como [nombre]."
>
> Fíjate en la frase de "no la inventes". Es la más importante del prompt. Cuando la IA no sabe algo, prefiero que me lo diga a que quede bien.
>
> **[3:50 – Demo: copiar un correo real (anonimizado), pegarlo, obtener la respuesta, pegarla en Gmail.]**
>
> Ahora copio un correo de un cliente, lo pego y… aquí está la respuesta. La leo, cambio una palabra y la pego en Gmail. Treinta segundos. Hazlo con diez correos y verás que en la mayoría solo tienes que retocar algo.
>
> **[4:30 – Pantalla: Gmail, plantillas o "respuestas predefinidas".]**
>
> Un truco extra: las respuestas que más se repiten guárdalas como plantillas en tu programa de correo. Gmail y Outlook lo permiten. Para lo muy repetido, la plantilla es todavía más rápida que la IA.
>
> **[5:00 – NIVEL 2. Diagrama: correo nuevo → n8n → IA → borrador en Gmail.]**
>
> Nivel dos: que esto pase solo. Vamos a usar n8n, una herramienta para conectar aplicaciones sin programar. Se puede usar en la nube, de pago y con prueba gratuita, o instalarla tú gratis si tienes algo de práctica. El enlace está abajo. Es de afiliado, te lo digo claramente.
>
> El flujo tiene tres piezas. Uno: cuando llega un correo nuevo a una etiqueta concreta. Dos: se lo pasamos a la IA con nuestro documento y nuestras instrucciones. Tres: se crea un borrador de respuesta en ese mismo hilo. Nada se envía.
>
> **[5:40 – Demo n8n: nodo de Gmail como disparador.]**
>
> Primera pieza: el disparador. Elijo Gmail, conecto mi cuenta y le digo que vigile la etiqueta "Clientes". ¿Por qué una etiqueta y no toda la bandeja? Porque no quieres que la IA conteste a tu banco, a tu gestoría o a tu madre. Con un filtro de Gmail mandamos a esa etiqueta solo lo que viene del formulario de la web o de clientes.
>
> **[6:50 – Demo: nodo de IA.]**
>
> Segunda pieza: la IA. Añado el nodo del proveedor de IA, pego las instrucciones de antes y, debajo, el documento de respuestas. Y le paso el texto del correo que ha llegado. Aquí hace falta una clave de API del proveedor: es como una contraseña para que n8n pueda usar la IA. Se paga por uso. Con correos cortos, el coste suele ser muy bajo, pero cambia: míralo en la página de precios del proveedor el día que lo montes.
>
> **[8:00 – Demo: nodo "crear borrador".]**
>
> Tercera pieza: crear el borrador. Nodo de Gmail, acción "crear borrador", en respuesta al mismo hilo. Activo el flujo, me envío un correo de prueba preguntando por los horarios y… aquí está, en borradores, con la respuesta correcta. Ahora uno preguntando algo que no está en el documento: "PENDIENTE: precio de envío a Canarias". Funciona como queríamos: no se lo ha inventado.
>
> **[9:00 – PROTECCIÓN DE DATOS. Gráfico de tres puntos.]**
>
> Un minuto serio. Estás pasando correos de clientes a un servicio de IA, y eso son datos personales. Tres cosas mínimas. Una: usa la versión de empresa o la API, cuyas condiciones de uso de datos suelen ser más estrictas que las de una cuenta gratuita personal. Léelas. Dos: no automatices correos con datos sensibles, como salud o datos bancarios. Tres: menciónalo en tu política de privacidad. Si tienes dudas, consúltalo con quien lleve la protección de datos en tu empresa. Esto no es asesoramiento legal, es sentido común.
>
> **[10:15 – COSTES. Tabla en pantalla.]**
>
> Costes. Nivel uno: cero euros si usas la versión gratuita de tu asistente, aunque para datos de clientes te recomiendo una de pago o de empresa. Nivel dos: lo que cueste n8n en la nube, o nada si lo instalas tú, más el uso de la API. En la descripción tienes los precios que he comprobado hoy.
>
> **[11:00 – CIERRE. Pantalla: contador "−3 h/semana" con el "ding" de marca.]**
>
> Si recibes veinte correos repetidos al día y cada uno te lleva tres minutos, son una hora diaria. Con este sistema, revisar un borrador te lleva veinte segundos. Haz tú la cuenta con tus números.
>
> La plantilla con el documento de respuestas, el prompt y el flujo de n8n está en la descripción. Si este vídeo te ha quitado una tarea, suscríbete: cada martes y viernes te traemos otra. El siguiente va de presupuestos: dictas treinta segundos al móvil y sale el PDF. Nos vemos allí.

---

## 13.12 Guion completo del vídeo 2

**Título:** Presupuestos en 2 minutos: plantilla + IA para autónomos
**Duración estimada:** ~10-11 minutos (unas 1.400 palabras más demos).
**Verificar antes de grabar:** tipos de IVA aplicables al ejemplo (general del 21 % en España; existen tipos reducidos según la actividad) y si el ejemplo incluye retención de IRPF (15 % general para profesionales que facturan a empresas o autónomos; 7 % el año de inicio y los dos siguientes). **La retención va en la factura, no es obligatoria en un presupuesto. Si se muestra, que sea como información.**

> **[0:00 – APERTURA. Pantalla: móvil grabando una nota de voz; corte a PDF de presupuesto.]**
>
> "Presupuesto para Marta García: cambiar grifo de cocina, dos horas de mano de obra, material ochenta euros, desplazamiento." Treinta segundos hablando al móvil. Y esto es lo que sale: un presupuesto en PDF, con tu logotipo, las partidas, el IVA calculado y listo para enviar.
>
> Hoy te enseño a montarlo con una hoja de cálculo gratis y una IA. Y te regalo la plantilla.
>
> **[0:35 – POR QUÉ. Gráfico simple: "cliente pide → espera → compara".]**
>
> Cuando alguien te pide un presupuesto, casi seguro que se lo está pidiendo también a otros. Si el tuyo llega el primero, bien presentado y claro, tienes ventaja. Si llega tres días tarde, a veces ya han decidido. No tengo una estadística universal que darte, pero seguramente lo has vivido.
>
> **[1:10 – LA PLANTILLA. Pantalla: Google Sheets con dos pestañas.]**
>
> Empezamos por la base: una hoja de cálculo con dos pestañas. La primera es tu tarifa: precio de la hora de trabajo, desplazamiento, materiales habituales. La segunda es el presupuesto: cliente, fecha, partidas, base imponible, IVA y total.
>
> **[Pantalla: fórmulas resaltadas.]**
>
> Las fórmulas ya están hechas. Base imponible: la suma de las partidas. IVA: la base por el tipo que te toque. En el ejemplo uso el veintiuno por ciento, que es el general, pero hay actividades con tipos reducidos: compruébalo con tu gestoría. Total: base más IVA.
>
> Un detalle que confunde mucho: si eres profesional y facturas a empresas, en la **factura** suele ir una retención de IRPF. En un presupuesto no es obligatoria, pero algunos la indican para que el cliente sepa lo que va a ver. En la plantilla está como opcional.
>
> **[3:00 – LA IA. Pantalla: asistente de IA con instrucciones.]**
>
> Ahora la parte mágica, que de mágica no tiene nada. La IA no va a calcular nada, eso lo hace la hoja, que no se equivoca. La IA solo va a convertir lo que dices en una lista ordenada de partidas.
>
> Estas son las instrucciones. Están en la descripción: "Convierte esta nota en una tabla con columnas Concepto, Cantidad, Unidad y Precio unitario. Usa los precios de esta tarifa: [pegar tarifa]. Si un precio no está en la tarifa, escribe PENDIENTE. No calcules impuestos."
>
> ¿Por qué "no calcules impuestos"? Porque los modelos de lenguaje pueden fallar en cálculos y la hoja no. Cada herramienta, a lo que sabe hacer.
>
> **[4:30 – Demo: nota de voz transcrita → tabla de la IA.]**
>
> Grabo la nota, la transcribo con el propio móvil o con la IA, la pego… y aquí está la tabla: mano de obra, dos horas a mi precio; material, ochenta euros; desplazamiento, de la tarifa. Copio, pego en la pestaña del presupuesto y la hoja calcula todo.
>
> **[5:40 – Generar PDF. Pantalla: plantilla de documento con logotipo.]**
>
> Para que quede profesional, uso un documento con mi logotipo y le doy a descargar como PDF. Si quieres que se genere solo, en el vídeo de n8n de este canal te enseño a rellenar un documento automáticamente. Para empezar, así ya es muy rápido.
>
> **[6:30 – NIVEL AUTOMÁTICO (opcional). Diagrama: formulario/nota → n8n → IA → hoja → PDF → borrador de correo.]**
>
> Si haces muchos presupuestos, puedes encadenarlo todo: un formulario en el móvil donde dictas, n8n que se lo pasa a la IA, la IA que rellena la hoja, la hoja que genera el PDF y un borrador de correo al cliente con el PDF adjunto. Otra vez: borrador. Tú lo revisas y lo envías.
>
> **[7:30 – REVISIÓN. Pantalla: lista de comprobación.]**
>
> Antes de enviar, treinta segundos de revisión con esta lista. Uno: ¿hay algún PENDIENTE? Dos: ¿cantidades y unidades tienen sentido? Tres: ¿es el tipo de IVA correcto? Cuatro: ¿el nombre del cliente está bien escrito? Cinco: ¿la validez del presupuesto está indicada? En la plantilla he puesto treinta días por defecto. Cámbialo si quieres.
>
> **[8:30 – ERRORES TÍPICOS.]**
>
> Tres errores que he visto: dejar que la IA ponga precios inventados (por eso la tarifa y el PENDIENTE), copiar mal las columnas (la plantilla tiene validación) y olvidar actualizar la tarifa cuando suben los costes. Ponte un recordatorio trimestral.
>
> **[9:20 – CIERRE. Contador "−2 h/semana" con el "ding".]**
>
> Si haces diez presupuestos a la semana y cada uno te costaba quince minutos, esto te devuelve un par de horas. Y llegas antes que la competencia.
>
> La plantilla está en la descripción. Si esto te ha servido, suscríbete. Y si tu problema no son los presupuestos sino cobrarlos, el vídeo de recordatorios automáticos de facturas es para ti. Te lo dejo aquí.
