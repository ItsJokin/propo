"""Genera la identidad visual del canal Código de Barras.

Uso: python3 identidad.py <dir_fuentes_fontsource> <dir_fluent_3d_assets> <dir_salida>
Salida: logo_800.png (foto de perfil), logo.svg, marca_agua_150.png (marca de agua de vídeo, fondo transparente),
        banner_2560x1440.png, banner_guias.png (con las zonas seguras dibujadas, solo para revisar).
Ilustraciones 3D: Fluent Emoji de Microsoft (licencia MIT). Sin logotipos de terceros.
"""
import os, subprocess, sys, tempfile

TINTA, KRAFT, ROJO, NARANJA, HUESO = "#151515", "#E9DCC3", "#D7263D", "#FF8C1A", "#FAF7F0"
ANCHOS = [6, 3, 9, 3, 4, 10, 3]

def simbolo_svg(lado=800, fondo=TINTA, barras=HUESO, laser=True, circulo=True):
    """Siete barras de código (la última naranja) con un láser rojo de escáner."""
    total = sum(w * 2.2 for w in ANCHOS) + 9 * (len(ANCHOS) - 1)
    escala = lado * 0.5 / total; alto = lado * 0.42
    x = (lado - total * escala) / 2; y = (lado - alto) / 2; r = []
    for i, w in enumerate(ANCHOS):
        ancho = w * 2.2 * escala
        r.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{ancho:.1f}" height="{alto:.1f}" rx="{lado*0.006:.1f}" fill="{NARANJA if i == len(ANCHOS)-1 else barras}"/>')
        x += ancho + 9 * escala
    fondo_svg = (f'<circle cx="{lado/2}" cy="{lado/2}" r="{lado/2}" fill="{fondo}"/>' if circulo else "") if fondo else ""
    laser_svg = (f'<defs><filter id="g" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="{lado*0.012:.1f}"/></filter></defs>'
                 f'<rect x="{lado*0.17:.0f}" y="{lado*0.585:.0f}" width="{lado*0.66:.0f}" height="{lado*0.022:.0f}" fill="{ROJO}" filter="url(#g)" opacity=".9"/>'
                 f'<rect x="{lado*0.17:.0f}" y="{lado*0.59:.0f}" width="{lado*0.66:.0f}" height="{lado*0.012:.0f}" rx="{lado*0.006:.1f}" fill="#ff4d5e"/>') if laser else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{lado}" height="{lado}" viewBox="0 0 {lado} {lado}">{fondo_svg}{"".join(r)}{laser_svg}</svg>'

def css_fuentes(f):
    f = "file://" + os.path.abspath(f)
    return (f"@font-face{{font-family:Bebas;src:url('{f}/fontsource-bebas-neue-5.3.0/files/bebas-neue-latin-400-normal.woff2')}}"
            f"@font-face{{font-family:Plex;font-weight:400;src:url('{f}/fontsource-ibm-plex-sans-5.3.0/files/ibm-plex-sans-latin-400-normal.woff2')}}"
            f"@font-face{{font-family:Plex;font-weight:700;src:url('{f}/fontsource-ibm-plex-sans-5.3.0/files/ibm-plex-sans-latin-700-normal.woff2')}}"
            f"@font-face{{font-family:PlexMono;src:url('{f}/fontsource-ibm-plex-mono-5.3.0/files/ibm-plex-mono-latin-400-normal.woff2')}}")

def banner_html(fuentes, emojis, guias=False):
    # (código, x px, y px, tamaño, giro) — fuera de la zona segura central para que en TV/escritorio se vean, y en móvil no estorben
    prods = [("1f36d", 150, 300, 330, -14), ("1f964", 470, 760, 300, 8), ("1f36b", 180, 1020, 300, 10), ("1f45f", 560, 1180, 280, -8),
             ("1f95b", 2080, 280, 300, 10), ("1f4f1", 2330, 700, 270, -10), ("2615", 1980, 1060, 300, -6), ("1f36c", 2360, 1180, 250, 14),
             ("1f6d2", 300, 560, 0, 0)]
    imgs = "".join(f'<img src="file://{emojis}/{c}.webp" style="position:absolute;left:{x}px;top:{y}px;width:{s}px;height:{s}px;transform:translate(-50%,-50%) rotate({g}deg);filter:drop-shadow(0 24px 24px rgba(0,0,0,.28))">'
                   for c, x, y, s, g in prods if s)
    rayas = "".join(f'<div style="position:absolute;top:0;bottom:0;left:{x}px;width:{w}px;background:rgba(21,21,21,.045)"></div>'
                    for x, w in [(40, 18), (80, 8), (110, 30), (2400, 26), (2440, 8), (2470, 16), (2510, 34)])
    guia = ('<div style="position:absolute;left:507px;top:508px;width:1546px;height:423px;outline:6px dashed #00b3ff"></div>'
            '<div style="position:absolute;left:0;top:508px;width:2560px;height:423px;outline:4px dashed #ff00c8"></div>') if guias else ""
    return f"""<!doctype html><html><head><meta charset=utf-8><style>{css_fuentes(fuentes)}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:2560px;height:1440px;overflow:hidden;position:relative;background:{KRAFT};
background-image:radial-gradient(circle at 50% 50%,rgba(255,255,255,.45),transparent 60%),radial-gradient(circle at 10% 90%,rgba(120,80,40,.18),transparent 45%),radial-gradient(circle at 92% 8%,rgba(120,80,40,.15),transparent 45%)}}
.franja{{position:absolute;left:0;right:0;top:508px;height:423px;background:{TINTA}}}
.franja::before,.franja::after{{content:"";position:absolute;left:0;right:0;height:10px;background:{NARANJA}}}
.franja::before{{top:-10px}}.franja::after{{bottom:-10px}}
.zona{{position:absolute;left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;gap:56px;padding:0 70px}}
.wm{{font-family:Bebas;font-size:150px;line-height:.9;white-space:nowrap;color:{HUESO};letter-spacing:3px}}
.wm span{{color:{NARANJA}}}
.lema{{font-family:Plex;font-weight:700;font-size:38px;color:{HUESO};margin-top:10px}}
.dia{{display:inline-block;margin-top:18px;font-family:PlexMono;font-size:26px;letter-spacing:6px;color:{TINTA};background:{NARANJA};padding:8px 20px;border-radius:8px}}
.laser{{position:absolute;left:0;right:0;top:719px;height:4px;background:{ROJO};box-shadow:0 0 22px 6px rgba(215,38,61,.55);opacity:.85}}
</style></head><body>{rayas}{imgs}<div class="franja"></div><div class="laser"></div>
<div class="zona"><div style="flex:0 0 250px">{simbolo_svg(250, None, HUESO, True, False)}</div>
<div><div class="wm">CÓDIGO DE <span>BARRAS</span></div><div class="lema">La historia que no conoces de lo que tienes en casa</div>
<div class="dia">MARCAS · EMPRESAS · PRODUCTOS</div></div></div>{guia}</body></html>"""

def capturar(html, salida, ancho, alto, transparente=False):
    tmp = tempfile.NamedTemporaryFile("w", suffix=".html", delete=False); tmp.write(html); tmp.close()
    js = f"""const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();
const p=await b.newPage({{viewport:{{width:{ancho},height:{alto}}}}});await p.goto('file://{tmp.name}');
await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({{path:'{os.path.abspath(salida)}',omitBackground:{str(transparente).lower()}}});await b.close();}})();"""
    subprocess.run(["node", "-e", js], check=True); os.unlink(tmp.name)

def main():
    fuentes, emojis, out = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, "logo.svg"), "w").write(simbolo_svg(800))
    base = "<!doctype html><html><head><style>*{margin:0}body{background:transparent}</style></head><body>{svg}</body></html>"
    capturar(base.replace("{svg}", simbolo_svg(800)), os.path.join(out, "logo_800.png"), 800, 800, True)
    # marca de agua: círculo oscuro semitransparente para que se lea sobre cualquier fondo
    capturar(base.replace("{svg}", simbolo_svg(150, "rgba(21,21,21,.75)")), os.path.join(out, "marca_agua_150.png"), 150, 150, True)
    capturar(banner_html(fuentes, emojis), os.path.join(out, "banner_2560x1440.png"), 2560, 1440)
    capturar(banner_html(fuentes, emojis, True), os.path.join(out, "banner_guias.png"), 2560, 1440)
    print("ok")

if __name__ == "__main__":
    main()
