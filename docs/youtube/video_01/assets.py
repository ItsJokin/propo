"""Prepara las ilustraciones: Fluent Emoji 3D de Microsoft (licencia MIT, paquetes npm @lobehub/fluent-emoji-*).

Los emojis animados (WebP) se convierten en hojas de sprites (rejilla de 10 columnas) para poder controlar
cada fotograma desde el render, que no va en tiempo real.
Uso: python3 assets.py <dir_assets_npm> <dir_trabajo>
  <dir_assets_npm>/anim/*.webp   (animados)   y   <dir_assets_npm>/lobehub-fluent-emoji-3d-*/package/assets/*.webp (estáticos)
Salida: <dir_trabajo>/sprites/<código>.png + sprites.json
"""
import glob, json, os, sys
from PIL import Image

CODIGOS = ["1f36d", "1f36c", "1f9d2", "270b", "26bd", "1f3ea", "1f3ec", "1f9fe", "1f30d", "1f680", "1f4c9", "1f3ed",
           "1f468-200d-1f4bc", "1f468-200d-1f3a8", "1f3a8", "1f570-fe0f", "23f0", "1f4a1", "1f6f0-fe0f",
           "1f1ea-1f1f8", "1f1ee-1f1f9", "1f1f3-1f1f1", "2728", "1f440", "1f914", "1f6d2", "1f4b0", "1f4ac",
           "2b50", "1f60b", "1f3d9-fe0f", "1f3f7-fe0f", "1f381", "1f9e0", "1f4af", "1f50d", "2764-fe0f", "1f44f",
           "1f525", "1f3c6", "1f4e6", "1f6cd-fe0f", "1f4f0", "1f4bc"]
LADO, COLS = 200, 10

def main():
    npm, trabajo = sys.argv[1], sys.argv[2]
    dest = os.path.join(trabajo, "sprites"); os.makedirs(dest, exist_ok=True)
    estaticos = glob.glob(os.path.join(npm, "lobehub-fluent-emoji-3d-*/package/assets"))[0]
    meta = {}
    for c in CODIGOS:
        anim = os.path.join(npm, "anim", c + ".webp")
        src = anim if os.path.exists(anim) else os.path.join(estaticos, c + ".webp")
        if not os.path.exists(src):
            print("falta", c); continue
        im = Image.open(src)
        n = getattr(im, "n_frames", 1)
        frames, durs = [], []
        for i in range(n):
            im.seek(i)
            frames.append(im.convert("RGBA").resize((LADO, LADO), Image.LANCZOS))
            durs.append(im.info.get("duration", 40) or 40)
        cols = min(COLS, n); filas = (n + cols - 1) // cols
        hoja = Image.new("RGBA", (cols * LADO, filas * LADO))
        for i, f in enumerate(frames):
            hoja.paste(f, ((i % cols) * LADO, (i // cols) * LADO))
        hoja.save(os.path.join(dest, c + ".png"), optimize=True)
        fps = 1000.0 / (sum(durs) / len(durs)) if n > 1 else 1
        meta[c] = {"n": n, "cols": cols, "filas": filas, "fps": round(fps, 2)}
    json.dump(meta, open(os.path.join(trabajo, "sprites.json"), "w"), indent=1)
    print(len(meta), "sprites")

if __name__ == "__main__":
    main()
