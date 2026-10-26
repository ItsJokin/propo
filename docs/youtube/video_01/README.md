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
