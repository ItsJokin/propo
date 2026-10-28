#!/usr/bin/env bash
# Monta un vídeo completo de Código de Barras y genera sus entregables (vídeo, miniatura, título, descripción, subtítulos y metadatos).
# Uso: bash motor/montar.sh <dir_video> <python_con_onnxruntime> <locucion.mp3|elevenlabs|voz.onnx> <dir_assets_npm> <dir_fuentes> <iconify_icons.json> <dir_trabajo>
set -euo pipefail
VID="$(cd "$1" && pwd)"; PY="$2"; VOZ="$3"; NPM="$4"; FUE="$5"; export ICONIFY_JSON="$6"; W="$7"
M="$(cd "$(dirname "$0")" && pwd)"; OUT="$VID/salida"; mkdir -p "$W" "$OUT"
NOMBRE=$(cd "$VID" && python3 -c "import guion,os;print(f'Codigo_de_Barras_{os.path.basename(os.getcwd()).split(\"_\")[1]}_{guion.MARCA}')")
[ -f "$W/sprites.json" ] || python3 "$M/assets.py" "$NPM" "$W"
(cd "$VID" && PYTHONPATH="$VID:$M" "$PY" "$M/audio.py" "$VOZ" "$W")
python3 "$M/base.py" "$W" "$FUE" "$VID"
DUR=$(python3 -c "import json;print(json.load(open('$W/tiempos.json'))['duracion'])")
python3 -c "
d=$DUR; n=8; p=d/n
for i in range(n): print(f'{i*p:.2f} {(i+1)*p if i<n-1 else d:.2f}')" > "$W/tramos.txt"
# Tramos reanudables: si el contenedor se reinicia, los tramos ya terminados (marcados .ok) no se vuelven a renderizar.
FIRMA=$(cat "$W/timeline.html" "$W/tramos.txt" | md5sum | cut -c1-32)
[ "$(cat "$W/firma" 2>/dev/null)" = "$FIRMA" ] || { rm -f "$W"/tramo_*; echo "$FIRMA" > "$W/firma"; }
i=0; : > "$W/lista.txt"; : > "$W/pendientes.txt"
while read A B; do
  [ -f "$W/tramo_$i.ok" ] || echo "$i $A $B" >> "$W/pendientes.txt"
  echo "file 'tramo_$i.mp4'" >> "$W/lista.txt"; i=$((i+1))
done < "$W/tramos.txt"
export M W DUR
xargs -P 4 -L 1 bash -c 'node "$M/render.mjs" "$W/timeline.html" "$W/tramo_$0.mp4" "$DUR" 25 "$1" "$2" && touch "$W/tramo_$0.ok"' < "$W/pendientes.txt"
for t in $(seq 0 $((i-1))); do [ -f "$W/tramo_$t.ok" ] || { echo "falta el tramo $t"; exit 1; }; done
ffmpeg -y -loglevel error -f concat -safe 0 -i "$W/lista.txt" -c copy "$W/imagen.mp4"
ffmpeg -y -loglevel error -i "$W/imagen.mp4" -i "$W/narracion.wav" -i "$W/musica.wav" -i "$W/sfx.wav" -filter_complex \
 "[1:a]highpass=f=75,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1.2:g=3,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3,asplit=2[voz][sc];\
  [2:a]volume=-21dB[mus];[mus][sc]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[musd];\
  [3:a]volume=-6dB[fx];[voz][musd][fx]amix=inputs=3:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/$NOMBRE.mp4"
rm -f "$W"/tramo_* "$W/imagen.mp4" "$W/firma"
cp "$W/subtitulos.srt" "$OUT/subtitulos_es.srt"
python3 "$M/miniatura.py" "$VID" "$FUE" "$OUT/miniatura.png"
python3 "$M/metadatos.py" "$VID" "$W" "$OUT" "$OUT/$NOMBRE.mp4"
find "$M" "$VID" -name __pycache__ -type d -exec rm -rf {} + 2>/dev/null || true
echo "OK: $OUT/$NOMBRE.mp4 + miniatura.png + titulo.txt + descripcion.txt + subtitulos_es.srt + metadatos.md"
