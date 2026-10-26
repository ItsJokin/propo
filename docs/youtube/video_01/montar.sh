#!/usr/bin/env bash
# Monta el vídeo 1 completo: narración + escenas + música + mezcla final.
# Uso: bash montar.sh <python_con_kokoro> <dir_modelos_kokoro> <dir_fuentes> <dir_trabajo> <dir_salida>
set -euo pipefail
PY="$1"; MOD="$2"; FUE="$3"; W="$4"; OUT="$5"
cd "$(dirname "$0")"
mkdir -p "$W" "$OUT"
"$PY" audio.py "$MOD" "$W"
python3 escenas.py "$W" "$FUE"
DUR=$(python3 -c "import json;print(json.load(open('$W/tiempos.json'))['duracion'])")
# render en 4 tramos en paralelo
python3 - "$DUR" > "$W/tramos.txt" <<'PY'
import sys; d=float(sys.argv[1]); n=4; p=d/n
for i in range(n): print(f"{i*p:.2f} {(i+1)*p if i<n-1 else d:.2f}")
PY
i=0; : > "$W/lista.txt"
while read A B; do
  node render.mjs "$W/timeline.html" "$W/tramo_$i.mp4" "$DUR" 25 "$A" "$B" &
  echo "file 'tramo_$i.mp4'" >> "$W/lista.txt"; i=$((i+1))
done < "$W/tramos.txt"
wait
ffmpeg -y -loglevel error -f concat -safe 0 -i "$W/lista.txt" -c copy "$W/imagen.mp4"
# mezcla: música a −26 dB bajo la voz, con atenuación automática (sidechain) cuando habla el narrador; normalización a −14 LUFS
ffmpeg -y -loglevel error -i "$W/imagen.mp4" -i "$W/narracion.wav" -i "$W/musica.wav" -filter_complex \
 "[1:a]aresample=48000,asplit=2[voz][sc];[2:a]aresample=48000,volume=-20dB[mus];[mus][sc]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=400[musd];[voz][musd]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT/Codigo_de_Barras_01_Chupa_Chups.mp4"
cp "$W/subtitulos.srt" "$OUT/subtitulos_es.srt"
echo "OK: $OUT/Codigo_de_Barras_01_Chupa_Chups.mp4"
