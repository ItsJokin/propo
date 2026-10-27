# Vídeo 1: Chupa Chups (Código de Barras)

Vídeo listo para subir, generado de forma automática y sin coste:
- **Narración:** Piper (VITS ONNX), voz española peninsular `es_ES-davefx-medium` (dataset CC0), en local; ecualización y compresión de voz en la mezcla.
- **Imagen:** 53 escenas animadas sincronizadas frase a frase: tipografía cinética, transiciones, cámara en movimiento, grano, barra de progreso, SVG propios e ilustraciones 3D animadas Fluent Emoji de Microsoft (MIT, paquetes npm `@lobehub/fluent-emoji-*`). Sin logotipos de terceros.
- **Audio:** música lo-fi y efectos (whoosh, pitido de escáner, ding) sintetizados por código, sin derechos de terceros; la música se atenúa sola bajo la voz.
- **Salida (`salida/`):** `Codigo_de_Barras_01_Chupa_Chups.mp4` (no se versiona en git), `miniatura.png`, `subtitulos_es.srt`, `metadatos.md`.

## Regenerar
```bash
python3 -m venv venv && venv/bin/pip install kokoro-onnx soundfile numpy   # trae onnxruntime, phonemizer y espeak-ng
curl -L https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-es_ES-davefx-medium.tar.bz2 | tar xj
npm pack @fontsource/bebas-neue @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono   # descomprimir en <fuentes>/fontsource-*/
npm pack @lobehub/fluent-emoji-3d @lobehub/fluent-emoji-anim-{1,2,3,4}              # estáticos en lobehub-fluent-emoji-3d-*/, animados juntos en <npm>/anim/
bash montar.sh venv/bin/python vits-piper-es_ES-davefx-medium/es_ES-davefx-medium.onnx <dir_npm> <dir_fuentes> <dir_trabajo> salida
python3 miniatura.py <dir_fuentes> salida/miniatura.png
python3 metadatos.py <dir_trabajo> salida
```
El texto está en `guion.py` y las escenas en `escenas.py`. Para el siguiente vídeo, copia la carpeta y cambia esos dos archivos.

## Voz de ElevenLabs (por defecto desde el vídeo 1)
El vídeo 1 está montado con la locución del propietario generada en ElevenLabs (`salida/locucion_elevenlabs.mp3`):
```bash
bash montar.sh venv/bin/python salida/locucion_elevenlabs.mp3 <dir_npm> <dir_fuentes> <dir_trabajo> salida
```

La voz se elige en `montar.sh` con el segundo argumento:
- `elevenlabs`: genera cada frase por la API con tu voz (entonación encadenada con la frase anterior y la siguiente; las frases ya generadas se guardan en caché y no se vuelven a pagar). Necesita en el entorno las variables **`ELEVENLABS_API_KEY`** y **`ELEVENLABS_VOICE_ID`**, y que la red permita **`api.elevenlabs.io`**.
- `ruta/carpeta/`: **un audio por capítulo** (01_….mp3, 02_….mp3…) generado en ElevenLabs a partir de `salida/elevenlabs_capitulos/*.txt`. Es la opción más fiable sin API: cada archivo se trocea solo con sus frases (prueba interna: desfase medio de 0,12 s).
- `ruta/locucion.mp3`: una locución completa generada en la web de ElevenLabs (o grabada por ti) (por ejemplo, exportada desde ElevenLabs Studio). Se trocea por frases automáticamente (prueba interna: 57 de 60 cortes exactos).
- `modelo.onnx`: Piper local (respaldo gratuito).

Un vídeo de 5 minutos son unos 5.000 caracteres (≈5.000 créditos de ElevenLabs).
