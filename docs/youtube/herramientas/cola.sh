# Procesa en orden los vídeos de $CB/cola.txt, uno por línea: "API 15" (voz de ElevenLabs por API), "EL 15" (MP3 en $CB/el3/video_15.mp3) o "PV 15" (voz provisional Piper). "FIN" termina.
CB=${CB:-$HOME/cb_trabajo}; YT=${YT:-$(cd "$(dirname "$0")/.." && pwd)}
PY=${PY:-$CB/tts/venv/bin/python}; [ -x "$PY" ] || PY=python3
hechos=$CB/cola_hechos.txt; touch $hechos
while true; do
  linea=$(grep -vxFf $hechos $CB/cola.txt | head -n 1)
  if [ -z "$linea" ]; then sleep 30; continue; fi
  [ "$linea" = "FIN" ] && break
  set -- $linea; n=$2
  if [ "$1" = "API" ]; then voz=elevenlabs; elif [ "$1" = "EL" ]; then voz=$CB/el3/video_$n.mp3; else voz=$CB/piper/vits-piper-es_ES-davefx-medium/es_ES-davefx-medium.onnx; fi
  mkdir -p $CB/w$n; ln -sfn $CB/spr_comun/sprites $CB/w$n/sprites; cp $CB/spr_comun/sprites.json $CB/w$n/
  echo "== $linea $(date +%T)"
  bash $YT/motor/montar.sh $YT/video_$n $PY $voz $CB/assets $CB/fonts $CB/iconify/package/icons.json $CB/w$n && echo "OK $linea" || echo "FALLO $linea"
  echo "$linea" >> $hechos
done
echo "== fin cola $(date +%T)"
