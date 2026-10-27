"""Valida un vídeo: sprites existentes (añade los nuevos a spr_comun y a motor/assets.py), iconos vectoriales y escenas del guion."""
import re, os, sys, glob, json, importlib, subprocess
S = os.environ.get("CB", os.path.expanduser("~/cb_trabajo")); Y = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, Y + "/motor")
anim = {os.path.splitext(f)[0] for f in os.listdir(S + "/assets/anim")}
est = {os.path.splitext(f)[0] for f in os.listdir(glob.glob(S + "/assets/lobehub-fluent-emoji-3d-*/package/assets")[0])}
icons = json.load(open(S + "/iconify/package/icons.json"))["icons"]
meta = json.load(open(S + "/spr_comun/sprites.json"))
for n in sys.argv[1:]:
    d = f"{Y}/video_{int(n):02d}"; src = open(d + "/escenas_video.py").read()
    codes = set(re.findall(r'"([0-9a-f]{4,5}(?:-[0-9a-f]{2,5})*)"', src))
    falt = sorted(c for c in codes if c not in anim and c not in est and not re.fullmatch(r"\d{4}", c))
    nuevos = sorted(c for c in codes if (c in anim or c in est) and c not in meta)
    vi = [v for v in re.findall(r'vicon\("([^"]+)"', src) if v not in icons]
    sys.path.insert(0, d); g = importlib.import_module("guion")
    names = [e for _, _, es in g.SEGMENTOS for e, _, _ in es]
    sys.path.insert(0, Y + "/motor"); import base as B
    B.SPR.update({c: {"n": 1, "cols": 1, "filas": 1, "fps": 1} for c in codes | set(meta)})
    os.environ.setdefault("ICONIFY_JSON", S + "/iconify/package/icons.json")
    V = importlib.import_module("escenas_video"); E = V.escenas(); E.update(B.comunes())
    caps = {f"cap{i}" for i in range(1, 20)}
    sin = [x for x in names if x not in E and x not in caps]
    dup = sorted({x for x in names if names.count(x) > 1})
    nc = sum(1 for c, _, _ in g.SEGMENTOS if c[:1].isdigit())
    faltan_iconos = [i for i in range(1, nc + 1) if i not in V.CAP_ICONOS]
    cortos = [es[1][0] for c, _, es in g.SEGMENTOS if c[:1].isdigit() and len(es) > 1 and es[1][1] == 0 and es[1][2] < 0.8]
    largos = [c for c, _, _ in g.SEGMENTOS if c[:1].isdigit() and len(c.split(". ", 1)[1]) > 30]
    if largos: print("   títulos de capítulo demasiado largos (máx. 30):", largos)
    if cortos: print("   capítulos con tarjeta demasiado corta (usar desfase 1.0):", cortos)
    fr = [f for _, F, _ in g.SEGMENTOS for f in F]; c = sum(len(f) for f in fr)
    print(f"video {n}: {len(fr)} frases, {c} caracteres (~{c/16.5/60 + len(fr)*0.35/60 + 0.5:.1f} min), {len(names)} escenas")
    for k, v in [("sprites inexistentes", falt), ("iconos vectoriales inexistentes", vi), ("escenas sin definir", sin), ("escenas duplicadas", dup), ("capítulos sin icono", faltan_iconos), ("sprites nuevos", nuevos)]:
        if v: print("  ", k, v)
    for m in ("guion", "escenas_video"): sys.modules.pop(m, None)
    sys.path.remove(d)
    if nuevos and not falt:
        subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), "add_sprites.py")] + nuevos, check=True)
        meta = json.load(open(S + "/spr_comun/sprites.json"))
