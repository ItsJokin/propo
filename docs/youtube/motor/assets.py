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
           "1f525", "1f3c6", "1f4e6", "1f6cd-fe0f", "1f4f0", "1f4bc",
           # vídeo 2 (New Coke)
           "1f964", "1f4fa", "260e-fe0f", "2709-fe0f", "1f4e8", "1f621", "1f620", "1f62d", "2696-fe0f", "1f4c5", "1f4c8",
           "1f1fa-1f1f8", "1f9ea", "1f4cb", "1f44d", "1f44e", "1f60d", "1f4e2", "1f6a8", "1f937", "1f575-fe0f", "1f9d0",
           "1f645", "1f4ad", "1f622", "1f914",
           # vídeo 3 (Danone)
           "1f95b", "1f944", "1f353", "1f48a", "2695-fe0f", "1f3e5", "1f476", "1f466", "1f468", "1f474", "1f1ec-1f1f7",
           "1f1eb-1f1f7", "1f6a2", "1f5fd", "1f9c0", "1f4a7", "1f382", "1f37c", "1f4d6", "1f30e", "1f9ec",
           # vídeo 4 (Adidas vs Puma)
           "1f45f", "1f3c3", "1f947", "1f3c5", "1f1e9-1f1ea", "1f1ed-1f1fa", "1f327-fe0f", "1f309", "1f3e0", "1f528",
           "1f406", "1faa6", "1f91d", "1f494", "1f1e7-1f1f7", "1f37a", "1f3df-fe0f", "1f4aa", "1f624", "2694-fe0f",
           "1f3d8-fe0f", "1f4dc", "1f9e6", "1f4f8", "1f6b6", "1f463"]
CODIGOS = list(dict.fromkeys(CODIGOS))
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
