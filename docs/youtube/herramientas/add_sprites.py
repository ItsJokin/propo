"""Añade sprites nuevos a spr_comun (sin regenerar los existentes) y los registra en motor/assets.py."""
import sys, os, json, glob, re
S = os.environ.get("CB", os.path.expanduser("~/cb_trabajo")); Y = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, Y + "/motor"); import assets as A
from PIL import Image
meta = json.load(open(S + "/spr_comun/sprites.json"))
estaticos = glob.glob(S + "/assets/lobehub-fluent-emoji-3d-*/package/assets")[0]
for c in sys.argv[1:]:
    anim = os.path.join(S, "assets/anim", c + ".webp")
    src = anim if os.path.exists(anim) else os.path.join(estaticos, c + ".webp")
    im = Image.open(src); n = getattr(im, "n_frames", 1); frames, durs = [], []
    for i in range(n):
        im.seek(i); frames.append(im.convert("RGBA").resize((A.LADO, A.LADO), Image.LANCZOS)); durs.append(im.info.get("duration", 40) or 40)
    cols = min(A.COLS, n); filas = (n + cols - 1) // cols
    hoja = Image.new("RGBA", (cols * A.LADO, filas * A.LADO))
    for i, f in enumerate(frames): hoja.paste(f, ((i % cols) * A.LADO, (i // cols) * A.LADO))
    hoja.save(os.path.join(S, "spr_comun/sprites", c + ".png"), optimize=True)
    meta[c] = {"n": n, "cols": cols, "filas": filas, "fps": round(1000.0 / (sum(durs) / len(durs)), 2) if n > 1 else 1}
json.dump(meta, open(S + "/spr_comun/sprites.json", "w"), indent=1)
p = Y + "/motor/assets.py"; s = open(p).read()
nuevos = [c for c in sys.argv[1:] if f'"{c}"' not in s.split("CODIGOS = list")[0]]
if nuevos:
    i = s.index("]\nCODIGOS = list"); s = s[:i] + ",\n           " + ", ".join(f'"{c}"' for c in nuevos) + s[i:]
    open(p, "w").write(s)
print("añadidos:", sys.argv[1:])
