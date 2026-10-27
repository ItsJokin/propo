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
           "1f3d8-fe0f", "1f4dc", "1f9e6", "1f4f8", "1f6b6", "1f463",
           # vídeos 5 a 14
           "1f1e9-1f1f0", "1f1eb-1f1ee", "1f1ef-1f1f5", "1f1f0-1f1f7", "1f1f3-1f1f4", "1f1f5-1f1f9", "1f1f8-1f1ea", "1f305", "1f30a", "1f331", "1f340", "1f34a",
           "1f34e", "1f354", "1f35a", "1f35e", "1f35f", "1f366", "1f36b", "1f373", "1f37d-fe0f", "1f37f", "1f389", "1f39e-fe0f",
           "1f3a2", "1f3a6", "1f3ac", "1f3ae", "1f3b0", "1f3b2", "1f3b4", "1f3b6", "1f3c1", "1f3cb-fe0f", "1f3ce-fe0f", "1f3d7-fe0f",
           "1f3da-fe0f", "1f3e2", "1f40c", "1f40d", "1f414", "1f436", "1f442", "1f446", "1f451", "1f455", "1f456", "1f457",
           "1f45a", "1f45b", "1f465", "1f468-200d-1f4bb", "1f468-200d-1f52c", "1f46a", "1f46c", "1f477", "1f4a5", "1f4b5", "1f4b6", "1f4b8",
           "1f4bb", "1f4be", "1f4c4", "1f4cf", "1f4da", "1f4dd", "1f4e1", "1f4e7", "1f4ee", "1f4f1", "1f4f2", "1f4f6",
           "1f4f7", "1f4fb", "1f4fc", "1f501", "1f504", "1f50b", "1f50c", "1f520", "1f527", "1f529", "1f52c", "1f579-fe0f",
           "1f58a-fe0f", "1f5a8-fe0f", "1f5bc-fe0f", "1f5c4-fe0f", "1f5d1-fe0f", "1f5e1-fe0f", "1f5fa-fe0f", "1f60a", "1f60c", "1f60f", "1f62b", "1f62c",
           "1f62e", "1f630", "1f633", "1f64b", "1f64c", "1f64f", "1f695", "1f697", "1f69a", "1f6a7", "1f6aa", "1f6ab",
           "1f6cb-fe0f", "1f6cf-fe0f", "1f6d1", "1f6de", "1f6e1-fe0f", "1f6e2-fe0f", "1f90f", "1f916", "1f922", "1f923", "1f92b", "1f92f",
           "1f935", "1f94a", "1f95a", "1f97e", "1f98b", "1f98d", "1f9b6", "1f9be", "1f9d1-200d-1f373", "1f9d1-200d-1f393", "1f9d1-200d-1f3ed", "1f9d1-200d-1f527",
           "1f9e3", "1f9e5", "1f9e9", "1f9ed", "1f9ee", "1f9f1", "1f9f5", "1f9f6", "1f9f8", "1fa91", "1fa99", "1fa9a",
           "1fa9b", "1fa9f", "1faa1", "1fab5", "1fae7", "231a", "23f1-fe0f", "23f3", "2601-fe0f", "2615", "267b-fe0f", "2697-fe0f",
           "2699-fe0f", "26a0-fe0f", "26d4", "2702-fe0f", "2705", "2708-fe0f", "270d-fe0f", "270f-fe0f", "2753",
           "1f330", "1f33f", "1f377", "1f37b", "1f37e", "1f384", "1f385", "1f3dd-fe0f", "1f3e6", "1f468-200d-2695-fe0f", "1f489", "1f510", "1f56f-fe0f", "1f58b-fe0f", "1f605", "1f610", "1f912", "1f915", "1f971", "1f9d1-200d-1f4bc", "1f9f4", "1fa96", "1faad", "2600-fe0f", "26d3-fe0f", "274c",
           "1f300", "1f393", "1f3af", "1f3c0", "1f469", "1f469-200d-1f4bc", "1f4ca", "1f4e0", "1f511", "1f513", "1f522", "1f552", "1f612", "1f969", "23e9",
           "1f198", "1f1ec-1f1e7", "1f308", "1f310", "1f3a4", "1f3a7", "1f3b5", "1f3bb", "1f3c8", "1f3f4-200d-2620-fe0f", "1f41d", "1f468-200d-1f527", "1f468-200d-1f9b3", "1f54a-fe0f", "1f5b1-fe0f", "1f9d1-200d-1f3a8", "1f9d1-200d-1f52c", "1f9d1-200d-1f680", "26a1",
           "1f1f9-1f1f7", "1f321-fe0f", "1f334", "1f33e", "1f347", "1f36a", "1f468-200d-1f373", "1f47e", "1f52a", "1f5e3-fe0f", "1f690", "1f6c3", "1f6f8", "1f7e1", "1f996", "1f99b", "26f0-fe0f", "2744-fe0f",
           "1f1f5-1f1ed", "1f1f7-1f1fa", "1f31f", "1f3b8", "1f4b4", "1f60e", "1f615", "1f92a", "1f943", "1f948", "1f9d1",
           "1f399-fe0f", "1f3d4-fe0f", "1f3db-fe0f", "1f468-200d-1f3eb", "1f469-200d-1f3a8", "1f48d", "1f5c3-fe0f", "1f9c7", "1f9f2", "1fab6",
           "1f1e6-1f1fa", "1f342", "1f383", "1f40b", "1f443", "1f96b", "1f9cb", "1f9cd", "1f9d4", "1f9dc-200d-2640-fe0f", "1f9f3", "1fad8", "2614", "2693", "26f5",
           "1f3a5", "1f3f0",
           "1f47b",
           "1f4a8", "1f648",
           "1fa7a", "270a",
           "1f402", "1f40e", "1f48e", "1f4a2", "1f500", "1f69b", "1f69c", "1f6e3-fe0f", "1f928", "1f987", "1f9d1-200d-1f33e", "1f9f0", "2649", "2668-fe0f", "26fd",
           "1f1e8-1f1fa", "1f1f6-1f1e6", "1f319", "1f333", "1f338", "1f392", "1f454", "1f484", "1f637", "1f6d7",
           "1f1e8-1f1ed", "1f315", "1f380", "1f397-fe0f", "1f459", "1f467", "1f469-1f3fb", "1f469-1f3fc", "1f469-1f3fd", "1f469-1f3fe", "1f469-1f3ff", "1f469-200d-1f3eb", "1f469-200d-1f52c", "1f469-200d-1f680", "1f469-200d-2695-fe0f", "1f469-200d-2708-fe0f", "1f46f-200d-2640-fe0f", "1f471-200d-2640-fe0f", "1f497", "1f4c7", "1f5f3-fe0f", "1f602", "1f61f", "1fa9e",
           "1f1e6-1f1f9", "1f1f9-1f1ed", "1f30f", "1f388", "1f3aa", "1f3c2", "1f3cd-fe0f", "1f3dc-fe0f", "1f403", "1f4a6", "1f51e", "1f6b5", "1f6e9-fe0f", "1f929", "1fa82", "1faa5", "1faa9", "1fabd", "26f7-fe0f",
           "1f480", "1f4b3", "1f4bf", "1f4d5", "1f4d7", "1f4d8", "1f507", "1f514", "1f524", "1f5a5-fe0f", "1f7e2", "1fa84",
           "1f17f-fe0f", "1f3ad", "1f408", "1f911", "1f986", "1f9d1-200d-1f3eb", "2328-fe0f",
           "1f33d", "1f3eb", "1f413", "1f42f", "1f49b", "1f614", "1f6ad", "1f6c1", "1f963", "1f966", "1f9dd", "1f9f9",
           "1f1f2-1f1fd", "1f369", "1f370", "1f3b1", "1f950", "1f956", "1f96a", "1f96f", "1f970", "1f98c", "1f9c1",
           "1f1ee-1f1f3", "1f39f-fe0f", "1f468-200d-1f393", "1f486", "1f4a4", "1f4d1", "1f50e", "1f517", "1f5ef-fe0f", "1f645-200d-2642-fe0f", "1f921", "1f9d1-200d-1f4bb", "2648", "26c5",
           "1f1e8-1f1e6", "1f4de", "1f4df", "1f512", "1faab", "1fad0", "231b", "2714-fe0f",
           "1f1e8-1f1f7", "1f35d", "1f447", "1f468-200d-1f33e", "1f46d", "1f475", "1f4d3", "1f636", "1f938", "1f9ca", "1f9fa", "1f9fd", "1faa3", "1faa8", "1faae", "1fad9", "26ab", "26cf-fe0f",
           "1f336-fe0f", "1f409", "1f4b7", "1f4d0", "1f50a", "1f631", "1f954", "1f990", "1f9d1-200d-2696-fe0f", "1f9fc",
           "1f343", "1f344", "1f345", "1f3a1", "1f3ab", "1f3ca", "1f41f", "1f44a", "1f45e", "1f485", "1f4d2", "1f4e3", "1f643", "1f686", "1f952", "1f955", "1f9c2",
           "1f1ea-1f1fa", "1f360", "1f375", "1f376", "1f3a9", "1f411", "1f534", "1f535", "1f590-fe0f", "1f5fe", "1f967", "1f9a7", "23f8-fe0f",
           "1f356",
           "1f3be", "1f405", "1f40a", "1f42c", "1f43e", "1f441-fe0f", "1f449", "1f5fc", "1f93a", "1f975", "1f985", "1f98e", "26f3",
           "1f355", "1f3d3", "1f47d", "1f4a9", "1f573-fe0f", "265f-fe0f", "26aa",
           "1f0cf", "1f41b", "1f41e", "1f42d", "1f438", "1f45c", "1f634", "1f635-200d-1f4ab", "1f691", "1f945", "1f997", "1fab2",
           "1f3c7", "1f3f3-fe0f", "1f44b", "1f6e0-fe0f", "1f6fb", "1f920", "1fa93", "26fa",
           "1f3d6-fe0f", "1f698",
           "1f1e8-1f1f1", "1f1f5-1f1f1", "1f35b", "1f363", "1f396-fe0f", "1f4cd", "1f4ec", "1f6b2", "1f6f5", "1f957",
           "1f32e", "1f415", "1f47c", "1f483", "1f4e4", "1f4e9", "1f933",
           "1f3a3", "1f6dd", "1f7e8", "1fa79", "27b0",
           "1f647", "1faa2"]
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
