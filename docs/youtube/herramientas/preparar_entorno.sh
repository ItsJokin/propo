#!/usr/bin/env bash
# Prepara en una sesión nueva todo lo que el motor necesita y no está en el repositorio (≈2,5 GB):
# ilustraciones Fluent Emoji (npm @lobehub, MIT), iconos vectoriales (@iconify-json/fluent-emoji), fuentes (@fontsource)
# y, opcionalmente, la voz provisional Piper. Uso: bash herramientas/preparar_entorno.sh   (CB=directorio de trabajo, por defecto ~/cb_trabajo)
set -euo pipefail
CB=${CB:-$HOME/cb_trabajo}; YT=$(cd "$(dirname "$0")/.." && pwd); mkdir -p "$CB"/{assets,fonts,iconify,spr_comun}; cd "$CB"
pack() { (cd "$2" && npm pack "$1" --silent >/dev/null && for t in *.tgz; do mkdir -p "${t%.tgz}" && tar -xzf "$t" -C "${t%.tgz}"; done); }
pack @lobehub/fluent-emoji-3d@1.1.0 assets
for i in 1 2 3 4; do pack @lobehub/fluent-emoji-anim-$i@1.0.0 assets; done
mkdir -p assets/anim && cp -n assets/lobehub-fluent-emoji-anim-*/package/assets/*.webp assets/anim/ 2>/dev/null || true
(cd fonts && for f in bebas-neue ibm-plex-sans ibm-plex-mono; do npm pack @fontsource/$f@5.3.0 --silent >/dev/null; mkdir -p fontsource-$f-5.3.0 && tar -xzf fontsource-$f-5.3.0.tgz -C fontsource-$f-5.3.0 --strip-components=1; done)
(cd iconify && npm pack @iconify-json/fluent-emoji@1.2.7 --silent >/dev/null && tar -xzf iconify-json-fluent-emoji-*.tgz)
pip install -q numpy soundfile pillow 2>/dev/null || true
python3 "$YT/motor/assets.py" "$CB/assets" "$CB/spr_comun"
(cd "$YT/motor" && npm ls playwright >/dev/null 2>&1 || npm i --no-save playwright@1 >/dev/null 2>&1 || true)
echo "Listo en $CB. Para la voz por API: variables ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID, y api.elevenlabs.io permitido en la red."
