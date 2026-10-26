# Vídeo 1: Chupa Chups (Código de Barras)

Vídeo listo para subir, generado de forma automática y sin coste:
- **Narración:** Kokoro TTS (modelo abierto, voz `em_alex`, español), en local.
- **Imagen:** escenas animadas propias (HTML/SVG + emojis Noto, licencia OFL), renderizadas con Chromium y ffmpeg. Sin logotipos de terceros.
- **Música:** fondo ambiental generado por código (sin derechos de terceros), atenuado bajo la voz.
- **Salida (`salida/`):** `Codigo_de_Barras_01_Chupa_Chups.mp4` (no se versiona en git), `miniatura.png`, `subtitulos_es.srt`, `metadatos.md`.

## Regenerar
```bash
python3 -m venv venv && venv/bin/pip install kokoro-onnx soundfile numpy
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
npm pack @fontsource/bebas-neue @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono   # descomprimir en <fuentes>/fontsource-*/
bash montar.sh venv/bin/python <dir_modelos> <dir_fuentes> <dir_trabajo> salida
python3 miniatura.py <dir_fuentes> salida/miniatura.png
python3 metadatos.py <dir_trabajo> salida
```
El texto está en `guion.py` y las escenas en `escenas.py`. Para el siguiente vídeo, copia la carpeta y cambia esos dos archivos.
