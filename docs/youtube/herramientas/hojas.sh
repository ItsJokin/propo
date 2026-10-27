set -e
CB=${CB:-$HOME/cb_trabajo}; YT=${YT:-$(cd "$(dirname "$0")/.." && pwd)}
for n in $@; do
  W=$CB/w$n
  T=$(python3 -c "import json;e=json.load(open('$W/tiempos.json'))['escenas'];print(','.join(str(round(min(x['inicio']+2.2,x['fin']-0.1),2)) for x in e))")
  rm -rf $CB/pv$n; mkdir -p $CB/pv$n
  node $YT/motor/render.mjs $W/timeline.html preview 0 25 $T $CB/pv$n
  python3 - <<PY
import glob
from PIL import Image
fs=sorted(glob.glob("$CB/pv$n/prev_*.png"),key=lambda f:float(f.split("prev_")[1][:-4]))
w,h=400,225; c=8; r=(len(fs)+c-1)//c
hoja=Image.new("RGB",(c*w,r*h),"white")
for i,f in enumerate(fs): hoja.paste(Image.open(f).resize((w,h)),((i%c)*w,(i//c)*h))
hoja.save("$CB/hoja_$n.jpg",quality=80)
PY
  echo "ok $n"
done
