"""Construye timeline.html: todas las escenas del vídeo con animaciones controladas por setTime(t).

Uso: python3 escenas.py <dir_trabajo> <dir_fuentes>
Lee <dir_trabajo>/tiempos.json y escribe <dir_trabajo>/timeline.html
Las ilustraciones son propias (SVG) o emojis de Noto Color Emoji (licencia OFL). No se usa ningún logotipo de terceros.
"""
import json, os, sys

KRAFT, TINTA, ROJO, NARANJA, HUESO, GRIS = "#E9DCC3", "#151515", "#D7263D", "#FF8C1A", "#FAF7F0", "#8A8F98"

def barras(alto=60, ancho=220, color=TINTA, ultima=NARANJA):
    anchos = [6, 3, 9, 3, 4, 10, 3]
    x, r = 0, []
    for i, w in enumerate(anchos):
        r.append(f'<rect x="{x}" y="0" width="{w*2.2:.1f}" height="{alto}" fill="{ultima if i == len(anchos)-1 else color}"/>')
        x += w * 2.2 + 9
    return f'<svg width="{ancho}" height="{alto}" viewBox="0 0 {x} {alto}">{"".join(r)}</svg>'

def piruleta(size=420, giro=True):
    # piruleta genérica en espiral (ilustración propia, sin marca)
    s = size
    franjas = "".join(
        f'<path d="M{s/2},{s*0.38} m0,-{r} a{r},{r} 0 1,1 -0.1,0" fill="none" stroke="{c}" stroke-width="{s*0.045:.0f}"/>'
        for r, c in [(s*0.30, ROJO), (s*0.23, NARANJA), (s*0.16, ROJO), (s*0.09, NARANJA)])
    return (f'<svg width="{s}" height="{s*1.6:.0f}" viewBox="0 0 {s} {s*1.6:.0f}">'
            f'<rect x="{s*0.47:.0f}" y="{s*0.6:.0f}" width="{s*0.06:.0f}" height="{s*0.95:.0f}" rx="{s*0.03:.0f}" fill="{HUESO}" stroke="{TINTA}" stroke-width="4"/>'
            f'<circle cx="{s/2}" cy="{s*0.38}" r="{s*0.36}" fill="{HUESO}" stroke="{TINTA}" stroke-width="6"/>'
            f'<g class="{"gira" if giro else ""}" style="transform-origin:{s/2}px {s*0.38}px">{franjas}</g>'
            f'<ellipse cx="{s*0.38}" cy="{s*0.24}" rx="{s*0.07}" ry="{s*0.035}" fill="white" opacity="0.7"/></svg>')

def bigote(w=360, color=TINTA):
    return (f'<svg width="{w}" height="{w*0.45:.0f}" viewBox="0 0 200 90"><path d="M100,50 C80,30 50,40 30,30 C20,25 12,10 18,2 C8,12 10,35 30,48 '
            f'C55,62 85,58 100,56 C115,58 145,62 170,48 C190,35 192,12 182,2 C188,10 180,25 170,30 C150,40 120,30 100,50Z" fill="{color}"/></svg>')

def e(emoji, px=220):
    return f'<span class="emo" style="font-size:{px}px">{emoji}</span>'

def T(txt, cls="t", d=0.0, a="up", extra=""):
    return f'<div class="a {cls}" data-d="{d}" data-a="{a}" {extra}>{txt}</div>'

def capitulo(n, titulo):
    return f'''<div class="full dark">
      <div class="centro col">
        {T(barras(90, 330, HUESO, NARANJA), "", 0.0, "fade")}
        {T(f"CAPÍTULO {n}", "mono naranja", 0.2, "up")}
        {T(titulo, "xl hueso", 0.45, "up")}
      </div></div>'''

def anio(a, sub):
    return f'''<div class="full"><div class="centro col">
      {T(a, "mega", 0.0, "pop")}
      {T(sub, "l", 0.5, "up")}
      {T(barras(50, 200), "", 0.8, "fade")}</div></div>'''

def fila(izq, der, di=0.0, dd=0.4):
    return f'<div class="full"><div class="fila">{T(izq, "", di, "left")}{T(der, "", dd, "right")}</div></div>'

ESCENAS = {
 "portada": f'<div class="full"><div class="fila">{T(piruleta(460), "", 0, "pop")}<div class="col izq">{T("LA HISTORIA QUE", "l", .3)}{T("NO CONOCES", "xl rojo", .5)}{T("de un caramelo que has visto miles de veces", "m", .8)}</div></div></div>',
 "dali_pregunta": f'<div class="full"><div class="centro col">{T(bigote(420), "", 0, "pop")}{T("¿SALVADOR DALÍ?", "xl", .4)}{T("el pintor de los relojes derretidos", "m gris", .8)}</div></div>',
 "pregunta_manos": f'<div class="full dark"><div class="centro col">{T("¿Por qué los niños acaban siempre con", "l hueso", 0)}{T("LAS MANOS PEGAJOSAS?", "xl naranja", .4)}{T(e("✋", 200), "", .8, "pop")}</div></div>',
 "cap1": capitulo(1, "EL PROBLEMA"),
 "barcelona50": f'<div class="full"><div class="centro col">{T("BARCELONA", "xl", 0)}{T("AÑOS 50", "mega rojo", .3, "pop")}{T("Enric Bernat · empresario de la confitería", "m", .8)}</div></div>',
 "manos_pegajosas": fila(e("🧒", 260), '<div class="col izq"><div class="l">Boca → mano → boca</div><div class="xl rojo">DEDOS PRINGADOS</div></div>'),
 "idea_palo": f'<div class="full"><div class="fila">{T(e("🍬", 200), "", 0, "left")}{T("<span class=xl>+</span>", "", .3, "pop")}{T("<div class=palo></div>", "", .5, "up")}{T("<span class=xl>=</span>", "", .8, "pop")}{T(piruleta(300, False), "", 1.0, "pop")}</div><div class="pie">{T("Un caramelo en la punta de un palo", "l", 1.3)}</div></div>',
 "cap2": capitulo(2, "EL NOMBRE"),
 "ano1958": anio("1958", "sale a la venta"),
 "nombre_gol": fila(e("⚽", 240), '<div class="col izq"><div class="m gris">Primer nombre, según algunas fuentes</div><div class="mega">«GOL»</div></div>'),
 "nombre_chups": f'<div class="full"><div class="centro col">{T("«CHUPS»", "mega", 0, "pop")}{T("del verbo <b>chupar</b>", "l", .5)}</div></div>',
 "nombre_chupachups": f'<div class="full"><div class="centro col">{T(e("🏪", 150), "", 0, "pop")}{T("En las tiendas pedían…", "l", .3)}{T("«UN CHUPA CHUPS»", "xl rojo", .7, "pop")}{T("El nombre lo eligió, en parte, la calle", "m gris", 1.2)}</div></div>',
 "cap3": capitulo(3, "EL LUGAR"),
 "mostrador_antes": fila(e("🏬", 240), '<div class="col izq"><div class="m gris">Antes</div><div class="xl">DETRÁS DEL MOSTRADOR</div><div class="m">lejos de las manos de los niños</div></div>'),
 "mostrador_caja": fila(e("🧾", 220), '<div class="col izq"><div class="m gris">Después</div><div class="xl rojo">JUNTO A LA CAJA</div><div class="m">a la altura de los ojos de un niño</div></div>'),
 "altura_nino": f'<div class="full"><div class="fila">{T(e("🧒", 300), "", 0, "up")}<div class="col izq">{T("<div class=regla><span>1 m</span></div>", "", .3, "left")}{T("El último momento antes de pagar", "l", .6)}{T("lo decide alguien de un metro", "l rojo", .9)}</div></div></div>',
 "compra_impulso": f'<div class="full dark"><div class="centro col">{T("ZONA DE", "l hueso", 0)}{T("COMPRA POR IMPULSO", "xl naranja", .3, "pop")}{T("Bernat la aprovechó mucho antes de que se pusiera de moda", "m hueso", .8)}</div></div>',
 "cap4": capitulo(4, "DALÍ"),
 "ano1969": anio("1969", "la marca quiere salir de España"),
 "dali_hora": fila(bigote(380), f'<div class="col izq"><div class="m gris">Según la versión más repetida</div><div class="xl">MENOS DE</div><div class="mega rojo">1 HORA</div></div>'),
 "envoltorio_lateral": f'<div class="full"><div class="centro col">{T("<div class=envol><div class=lat>MARCA</div></div>", "", 0, "pop")}{T("En el lateral: el envoltorio gira y el nombre se pierde", "l", .5)}</div></div>',
 "envoltorio_arriba": f'<div class="full"><div class="centro col">{T("<div class=envol><div class=top>MARCA</div></div>", "", 0, "pop")}{T("Arriba: se ve siempre, desde cualquier ángulo", "l rojo", .5)}</div></div>',
 "diseno_funcional": f'<div class="full dark"><div class="centro col">{T("NO ES SOLO ARTE", "l hueso", 0)}{T("ES DISEÑO FUNCIONAL", "xl naranja", .4, "pop")}{T(bigote(260, HUESO), "", .9, "fade")}</div></div>',
 "cap5": capitulo(5, "EL MUNDO"),
 "mundo": fila(e("🌍", 280), '<div class="col izq"><div class="xl">DE BARCELONA</div><div class="xl rojo">AL MUNDO</div><div class="m">fábricas · distribución · patrocinios · cultura popular</div></div>'),
 "espacio1995": fila(e("🚀", 260), '<div class="col izq"><div class="mega">1995</div><div class="l">un caramelo en la estación espacial Mir</div><div class="m gris">según la propia marca</div></div>'),
 "icono_global": f'<div class="full"><div class="centro col">{T(piruleta(300), "", 0, "pop")}{T("de dulce de barrio a icono global", "l", .5)}</div></div>',
 "cap6": capitulo(6, "LA VENTA"),
 "gustos": f'<div class="full"><div class="fila">{T(e("🍬", 160), "", 0, "pop")}{T(e("📉", 160), "", .3, "pop")}{T(e("🏭", 160), "", .6, "pop")}</div><div class="pie">{T("Cambian los gustos · preocupa el azúcar · el sector se concentra", "l", .9)}</div></div>',
 "venta2006": f'<div class="full"><div class="centro col">{T("2006", "mega", 0, "pop")}{T(e("🇪🇸", 120) + "<span class=xl> → </span>" + e("🇮🇹", 120) + e("🇳🇱", 120), "", .4)}{T("Perfetti Van Melle", "xl rojo", .8)}{T("grupo italo-neerlandés (también fabrica Mentos)", "m gris", 1.1)}</div></div>',
 "pedacito_bcn": f'<div class="full dark"><div class="centro col">{T("Para medio mundo, sigue siendo", "l hueso", 0)}{T("UN PEDACITO DE BARCELONA", "xl naranja", .4, "pop")}</div></div>',
 "cap7": capitulo(7, "LO QUE NOS ENSEÑA"),
 "leccion1": f'<div class="full"><div class="fila">{T("<div class=num>1</div>", "", 0, "pop")}<div class="col izq">{T("No hace falta un producto nuevo", "l", .3)}{T("UNA FORMA NUEVA DE USAR ALGO DE SIEMPRE", "xl rojo", .6)}</div></div></div>',
 "leccion2": f'<div class="full"><div class="fila">{T("<div class=num>2</div>", "", 0, "pop")}<div class="col izq">{T("El nombre no siempre lo eliges tú", "l", .3)}{T("ESCUCHA A TUS CLIENTES", "xl rojo", .6)}</div></div></div>',
 "leccion3": f'<div class="full"><div class="fila">{T("<div class=num>3</div>", "", 0, "pop")}<div class="col izq">{T("El diseño no es decoración", "l", .3)}{T("UN LOGOTIPO BIEN COLOCADO VALE MÁS QUE MIL ANUNCIOS", "xl rojo", .6)}</div></div></div>',
 "resumen_final": f'<div class="full"><div class="fila">{T(e("👔", 170), "", 0, "pop")}{T(bigote(260), "", .4, "pop")}{T(e("✋", 170), "", .8, "pop")}</div><div class="pie">{T("un empresario · un pintor surrealista · dedos pegajosos", "l", 1.1)}</div></div>',
 "marca_canal": f'<div class="full dark"><div class="centro col">{T(barras(110, 400, HUESO, NARANJA), "", 0, "pop")}{T("CÓDIGO DE BARRAS", "mega hueso", .4)}{T("la historia que no conoces de lo que tienes en casa", "l naranja", .8)}</div></div>',
 "cta": f'<div class="full"><div class="centro col">{T("¿QUÉ MARCA INVESTIGAMOS?", "xl", 0)}{T("💬 Déjala en los comentarios", "l", .4)}{T("<span class=boton>SUSCRIBIRSE</span>", "", .8, "pop")}{T("Próximo jueves: el día que Coca-Cola cambió su fórmula", "m gris", 1.2)}</div></div>',
}

CSS = """
@font-face{font-family:Bebas;src:url('FUENTES/fontsource-bebas-neue-5.3.0/files/bebas-neue-latin-400-normal.woff2')}
@font-face{font-family:Bebas;src:url('FUENTES/fontsource-bebas-neue-5.3.0/files/bebas-neue-latin-ext-400-normal.woff2');unicode-range:U+0100-024F}
@font-face{font-family:Plex;font-weight:400;src:url('FUENTES/fontsource-ibm-plex-sans-5.3.0/files/ibm-plex-sans-latin-400-normal.woff2')}
@font-face{font-family:Plex;font-weight:700;src:url('FUENTES/fontsource-ibm-plex-sans-5.3.0/files/ibm-plex-sans-latin-700-normal.woff2')}
@font-face{font-family:PlexMono;src:url('FUENTES/fontsource-ibm-plex-mono-5.3.0/files/ibm-plex-mono-latin-400-normal.woff2')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:KRAFT}
.escena{position:absolute;inset:0;opacity:0}
.full{position:absolute;inset:0;background:KRAFT;
  background-image:radial-gradient(circle at 20% 30%,rgba(255,255,255,.25),transparent 55%),radial-gradient(circle at 80% 80%,rgba(0,0,0,.08),transparent 50%),
  repeating-linear-gradient(0deg,rgba(0,0,0,.018) 0 2px,transparent 2px 5px);}
.full.dark{background:TINTA;background-image:radial-gradient(circle at 50% 40%,#2a2a2a,TINTA 70%)}
.zoom{position:absolute;inset:0}
.centro{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.col{display:flex;flex-direction:column;align-items:center;gap:22px;text-align:center}
.col.izq{align-items:flex-start;text-align:left;max-width:1050px}
.fila{position:absolute;inset:0 120px 120px;display:flex;align-items:center;justify-content:center;gap:90px}
.pie{position:absolute;left:0;right:0;bottom:150px;display:flex;justify-content:center}
.mega{font-family:Bebas;font-size:260px;line-height:.9;color:TINTA;letter-spacing:4px}
.xl{font-family:Bebas;font-size:130px;line-height:.95;color:TINTA;letter-spacing:2px}
.l{font-family:Plex;font-weight:700;font-size:54px;color:TINTA}
.m{font-family:Plex;font-size:40px;color:TINTA}
.mono{font-family:PlexMono;font-size:40px;letter-spacing:8px}
.rojo{color:ROJO}.naranja{color:NARANJA}.hueso{color:HUESO}.gris{color:#5d6168}
.dark .gris{color:GRIS}
.emo{font-family:'Noto Color Emoji';line-height:1;display:inline-block}
.palo{width:28px;height:300px;background:HUESO;border:4px solid TINTA;border-radius:14px}
.regla{width:560px;height:16px;background:ROJO;position:relative;border-radius:8px}
.regla span{position:absolute;right:-10px;top:-60px;font-family:Bebas;font-size:56px;color:ROJO}
.num{font-family:Bebas;font-size:340px;color:NARANJA;line-height:1}
.boton{display:inline-block;background:ROJO;color:white;font-family:Plex;font-weight:700;font-size:56px;padding:22px 60px;border-radius:14px}
.envol{width:420px;height:420px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#f3e9d6 60%,#d9c9a8);border:6px solid TINTA;position:relative}
.envol .lat{position:absolute;right:-30px;top:170px;background:ROJO;color:white;font-family:Bebas;font-size:60px;padding:6px 18px;transform:rotate(80deg);opacity:.85}
.envol .top{position:absolute;left:110px;top:150px;width:200px;height:120px;background:NARANJA;color:TINTA;font-family:Bebas;font-size:60px;border-radius:60px;display:flex;align-items:center;justify-content:center}
.subt{position:absolute;left:0;right:0;bottom:46px;text-align:center}
.marca{position:absolute;right:48px;top:40px;opacity:.85}
"""
for k, v in dict(KRAFT=KRAFT, TINTA=TINTA, ROJO=ROJO, NARANJA=NARANJA, HUESO=HUESO, GRIS=GRIS).items():
    CSS = CSS.replace(k, v)

JS = """
const D=0.55, FUNDIDO=0.45;
const ease=x=>1-Math.pow(1-Math.min(Math.max(x,0),1),3);
function setTime(t){
  for(const s of ESC){
    const el=document.getElementById(s.id);
    let o=0;
    if(t>=s.a-FUNDIDO && t<=s.b+FUNDIDO){ o=Math.min(1,(t-(s.a-FUNDIDO))/FUNDIDO, (s.b+FUNDIDO-t)/FUNDIDO); }
    el.style.opacity=Math.max(0,o);
    el.style.display=o>0?'block':'none';
    if(o<=0) continue;
    const local=t-s.a, dur=s.b-s.a;
    el.querySelector('.zoom').style.transform=`scale(${1+0.045*Math.min(Math.max(local/dur,0),1)})`;
    for(const a of el.querySelectorAll('.a')){
      const p=ease((local-parseFloat(a.dataset.d))/D);
      const k=a.dataset.a; let tr='';
      if(k==='up') tr=`translateY(${(1-p)*50}px)`;
      else if(k==='left') tr=`translateX(${-(1-p)*90}px)`;
      else if(k==='right') tr=`translateX(${(1-p)*90}px)`;
      else if(k==='pop') tr=`scale(${0.6+0.4*p})`;
      a.style.opacity=p; a.style.transform=tr;
    }
    for(const g of el.querySelectorAll('.gira')) g.style.transform=`rotate(${local*40}deg)`;
  }
}
"""

def main():
    trabajo, fuentes = sys.argv[1], sys.argv[2]
    tiempos = json.load(open(os.path.join(trabajo, "tiempos.json")))
    esc, html = [], []
    for seg in tiempos["segmentos"]:
        a, b = seg["inicio"], seg["fin"]
        if seg is tiempos["segmentos"][-1]:
            b = tiempos["duracion"]
        n = len(seg["escenas"]); paso = (b - a) / n
        for i, nombre in enumerate(seg["escenas"]):
            ini, fin = a + i * paso, a + (i + 1) * paso
            if i == 0 and seg is tiempos["segmentos"][0]:
                ini = 0.0
            eid = f"e{len(esc)}"
            esc.append({"id": eid, "a": ini, "b": fin})
            html.append(f'<div class="escena" id="{eid}"><div class="zoom">{ESCENAS[nombre]}</div>'
                        f'<div class="marca">{barras(36, 130)}</div></div>')
    pagina = (f"<!doctype html><html lang=es><head><meta charset=utf-8><style>{CSS.replace('FUENTES', 'file://' + os.path.abspath(fuentes))}</style></head>"
              f"<body>{''.join(html)}<script>const ESC={json.dumps(esc)};{JS}setTime(0);</script></body></html>")
    open(os.path.join(trabajo, "timeline.html"), "w").write(pagina)
    print(len(esc), "escenas")

if __name__ == "__main__":
    main()
