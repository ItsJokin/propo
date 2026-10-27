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

## Voz
- Por defecto, la voz de ElevenLabs del propietario. Él genera la locución completa a partir del guion en un solo texto y envía el MP3, que `voces.py` trocea por frases.
