"""Miniatura 1280x720 del vídeo 1 (ilustración propia, sin logotipos de terceros).
Uso: python3 miniatura.py <dir_fuentes> <salida.png>"""
import os, sys, subprocess, tempfile
from escenas import piruleta, bigote, barras, CSS
fuentes, salida = sys.argv[1], sys.argv[2]
css = CSS.replace("FUENTES", "file://" + os.path.abspath(fuentes)).replace("width:1920px;height:1080px", "width:1280px;height:720px")
html = f"""<!doctype html><html><head><meta charset=utf-8><style>{css}
.mini{{position:absolute;inset:0}}
.pir{{position:absolute;left:40px;top:-10px;transform:rotate(-12deg)}}
.big{{position:absolute;right:50px;top:120px;text-align:right}}
.big .q{{font-family:Bebas;font-size:250px;color:#D7263D;line-height:.85;margin-top:34px;text-shadow:6px 6px 0 #151515}}
.big .s{{font-family:Bebas;font-size:82px;color:#151515;line-height:1}}
.big .y{{display:inline-block;background:#151515;color:#FF8C1A;font-family:Bebas;font-size:64px;padding:2px 20px;margin-top:14px}}
.bg{{position:absolute;left:300px;top:250px;transform:rotate(-8deg)}}
.cb{{position:absolute;right:40px;bottom:30px}}
</style></head><body><div class="full mini">
<div class="pir">{piruleta(470, False)}</div>
<div class="bg">{bigote(300)}</div>
<div class="big"><div class="s">EL CARAMELO DE</div><div class="q">¿DALÍ?</div><div class="y">1969</div></div>
<div class="cb">{barras(46, 170)}</div>
</div></body></html>"""
tmp = tempfile.NamedTemporaryFile("w", suffix=".html", delete=False); tmp.write(html); tmp.close()
js = f"""const {{createRequire}}=require('module');const {{chromium}}=require('playwright');
(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1280,height:720}}}});
await p.goto('file://{tmp.name}');await p.evaluate(()=>document.fonts.ready);await p.screenshot({{path:'{os.path.abspath(salida)}'}});await b.close();}})();"""
subprocess.run(["node", "-e", js], check=True)
os.unlink(tmp.name)
print("miniatura:", salida)
