"""Miniatura 1280x720 de un vídeo. El vídeo define miniatura() en escenas_video.py (HTML del lienzo).
Uso: python3 miniatura.py <dir_video> <dir_fuentes> <salida.png>"""
import os, sys, subprocess, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
video, fuentes, salida = sys.argv[1], sys.argv[2], sys.argv[3]
sys.path.insert(0, os.path.abspath(video))
import base, escenas_video as V
css = base.CSS.replace("FUENTES", "file://" + os.path.abspath(fuentes)).replace("width:1920px;height:1080px", "width:1280px;height:720px")
html = (f"<!doctype html><html><head><meta charset=utf-8><style>{css}"
        ".mini{position:absolute;inset:0}.mini .fondo{inset:0}"
        ".big{position:absolute;right:50px;text-align:right}.big .q{font-family:Bebas;font-size:200px;color:#D7263D;line-height:.85;text-shadow:6px 6px 0 #151515}"
        ".big .s{font-family:Bebas;font-size:80px;color:#151515;line-height:1}.big .y{display:inline-block;background:#151515;color:#FF8C1A;font-family:Bebas;font-size:62px;padding:2px 20px;margin-top:14px}"
        f"</style></head><body><div class='mini'>{V.miniatura()}<div style='position:absolute;right:40px;bottom:30px'>{base.barras(46)}</div></div></body></html>")
tmp = tempfile.NamedTemporaryFile("w", suffix=".html", delete=False); tmp.write(html); tmp.close()
js = (f"const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1280,height:720}}}});"
      f"await p.goto('file://{tmp.name}');await p.evaluate(()=>document.fonts.ready);await p.screenshot({{path:'{os.path.abspath(salida)}'}});await b.close();}})();")
subprocess.run(["node", "-e", js], check=True); os.unlink(tmp.name)
print("miniatura:", salida)
