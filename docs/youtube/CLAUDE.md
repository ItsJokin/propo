# Canal Código de Barras: normas de trabajo

## Entregables obligatorios de cada vídeo
Siempre que se genere o se vuelva a montar un vídeo, se entregan juntos al propietario (en `video_XX/salida/`):
1. `Codigo_de_Barras_XX_<marca>.mp4`: el vídeo final.
2. `miniatura.png` (1280×720): ilustración propia, 2-4 palabras, sin logotipos de terceros.
3. `titulo.txt`: el título recomendado; en `metadatos.md` van también 2 alternativas.
4. `descripcion.txt`: la descripción lista para pegar, con capítulos con los tiempos reales, fuentes y avisos (sin patrocinio, uso de IA, créditos de las ilustraciones).
5. `subtitulos_es.srt` y `metadatos.md` (etiquetas, ajustes de Studio y lista de revisión).
`montar.sh` genera todo esto de una vez. Se envían todos los archivos con SendUserFile en la misma respuesta.

## Normas de guion
- Nunca mencionar ni anunciar el siguiente vídeo dentro de un vídeo. El cierre es: marca del canal → pregunta a los comentarios → "Y si te ha gustado, suscríbete."
- Cada dato con fuente; lo no confirmado se presenta como "según se cuenta" o "según la propia marca".
- Sin día fijo de publicación en ningún texto. Ritmo objetivo: 3 vídeos largos por semana + Shorts.
- Formato largo desde el vídeo 15: 9-12 minutos (unas 1.400-1.800 palabras, 8.500-11.000 caracteres), 8-11 capítulos, giros de tensión para retener. Sin relleno: solo temas que den para 10 minutos. Los vídeos 1-14 son el formato corto anterior.

## Especiales (Navidad, etc.)
- Del vídeo 46 al 60: especial de Navidad (publicación prevista del 15 al 31 de diciembre). En `guion.py`, `ESPECIAL = "NAVIDAD"` añade la etiqueta fija «★ ESPECIAL NAVIDAD» y nieve en pantalla; el título empieza por «Especial Navidad:», la intro dice que es el especial de Navidad, la miniatura lleva `cinta_especial()` y la lista es «Especial Navidad». Fondo `F("navidad")` para escenas destacadas.

## Voz
- Por defecto, la voz de ElevenLabs del propietario. Él genera la locución completa a partir del guion en un solo texto y envía el MP3, que `voces.py` trocea por frases.
