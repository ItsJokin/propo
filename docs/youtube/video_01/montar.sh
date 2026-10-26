#!/usr/bin/env bash
# Monta el vídeo completo: ilustraciones + narración + escenas animadas + efectos + música + mezcla final.
# Uso: bash montar.sh <python_con_onnxruntime_y_phonemizer> <voz_piper.onnx> <dir_assets_npm> <dir_fuentes> <dir_trabajo> <dir_salida>
set -euo pipefail
PY="$1"; VOZ="$2"; NPM="$3"; FUE="$4"; W="$5"; OUT="$6"
cd "$(dirname "$0")"
mkdir -p "$W" "$OUT"
[ -f "$W/sprites.json" ] || python3 assets.py "$NPM" "$W"
"$PY" audio.py "$VOZ" "$W"
python3 escenas.py "$W" "$FUE"
DUR=$(python3 -c "import json;print(json.load(open('$W/tiempos.json'))['duracion'])")
N=4
python3 -c "
d=$DUR; n=$N; p=d/n
for i in range(n): print(f'{i*p:.2f} {(i+1)*p if i<n-1 else d:.2f}')" > "$W/tramos.txt"
i=0; : > "$W/lista.txt"
while read A B; do
  node render.mjs "$W/timeline.html" "$W/tramo_$i.mp4" "$DUR" 25 "$A" "$B" &
  echo "file 'tramo_$i.mp4'" >> "$W/lista.txt"; i=$((i+1))
done < "$W/tramos.txt"
wait
ffmpeg -y -loglevel error -f concat -safe 0 -i "$W/lista.txt" -c copy "$W/imagen.mp4"
# voz: filtro paso alto, presencia y compresión suave · música atenuada con sidechain · efectos · normalización a −14 LUFS
ffmpeg -y -loglevel error -i "$W/imagen.mp4" -i "$W/narracion.wav" -i "$W/musica.wav" -i "$W/sfx.wav" -filter_complex \
 "[1:a]highpass=f=75,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1.2:g=3,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3,asplit=2[voz][sc];\
  [2:a]volume=-21dB[mus];[mus][sc]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[musd];\
  [3:a]volume=-6dB[fx];[voz][musd][fx]amix=inputs=3:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/Codigo_de_Barras_01_Chupa_Chups.mp4"
cp "$W/subtitulos.srt" "$OUT/subtitulos_es.srt"
echo "OK: $OUT/Codigo_de_Barras_01_Chupa_Chups.mp4"
