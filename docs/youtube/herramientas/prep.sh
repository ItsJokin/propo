set -e
CB=${CB:-$HOME/cb_trabajo}; YT=${YT:-$(cd "$(dirname "$0")/.." && pwd)}
export ICONIFY_JSON=$CB/iconify/package/icons.json
for n in $@; do
  V=$YT/video_$n; W=$CB/w$n
  (cd $V && PYTHONPATH="$V:$YT/motor" $CB/tts/venv/bin/python $YT/motor/audio.py $CB/piper/vits-piper-es_ES-davefx-medium/es_ES-davefx-medium.onnx $W)
  python3 $YT/motor/base.py $W $CB/fonts $V
  bash $CB/hojas.sh $n
done
