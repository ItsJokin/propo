"""Motor visual del vídeo: escenas animadas sincronizadas con la narración.

Uso: python3 escenas.py <dir_trabajo> <dir_fuentes>
Lee tiempos.json y sprites.json de <dir_trabajo> y escribe timeline.html, que expone setTime(t).
Todas las animaciones son CSS y se controlan fotograma a fotograma (render determinista).
Ilustraciones: SVG propios + Fluent Emoji 3D de Microsoft (MIT). Ningún logotipo de terceros.
"""
import json, os, sys

KRAFT, TINTA, ROJO, NARANJA, HUESO, GRIS, VERDE, AZUL = "#E9DCC3", "#151515", "#D7263D", "#FF8C1A", "#FAF7F0", "#8A8F98", "#2BB673", "#2E6BD6"
SPR = {}

# ---------------------------------------------------------------- primitivas
def obj(contenido, x, y, entrada="pop", bucle="", d=0.0, extra=""):
    """Objeto posicionado (centro en x%, y%) con animación de entrada y de bucle."""
    return (f'<div class="pos" style="left:{x}%;top:{y}%;{extra}"><div class="mv e-{entrada}" style="--d:{d}s">'
            f'<div class="mv {("l-" + bucle) if bucle else ""}">{contenido}</div></div></div>')

def spr(c, px=260, extra=""):
    m = SPR[c]; n = m["n"]
    return (f'<div class="spr" data-n="{n}" data-cols="{m["cols"]}" data-fps="{m["fps"]}" data-px="{px}" '
            f'style="width:{px}px;height:{px}px;background-image:url(sprites/{c}.png);'
            f'background-size:{m["cols"]*px}px {m["filas"]*px}px;{extra}"></div>')

def kt(texto, cls="xl", d=0.0, paso=0.07, modo="up"):
    """Tipografía cinética: palabra a palabra. *una o varias palabras* = resaltadas."""
    out, dentro = [], False
    for i, w in enumerate(texto.split(" ")):
        abre = w.startswith("*") or w.startswith("¿*")
        w = w.replace("¿*", "¿").lstrip("*") if abre else w
        if abre: dentro = True
        hl = dentro
        if "*" in w:
            w = w.replace("*", ""); dentro = False
        out.append(f'<span class="w w-{modo}{" hl" if hl else ""}" style="--d:{d + i*paso:.2f}s">{w}</span>')
    return f'<div class="{cls}">{" ".join(out)}</div>'

def txt(contenido, x, y, ancho=60, alinear="center", d=0.0, entrada="none"):
    return (f'<div class="pos txt" style="left:{x}%;top:{y}%;width:{ancho}%;text-align:{alinear}">'
            f'<div class="mv e-{entrada}" style="--d:{d}s">{contenido}</div></div>')

def bigote(w=420, color=TINTA, d=0.0):
    return (f'<svg width="{w}" height="{w*0.45:.0f}" viewBox="0 0 200 90"><path class="draw" style="--d:{d}s;--len:700" '
            f'd="M100,50 C80,30 50,40 30,30 C20,25 12,10 18,2 C8,12 10,35 30,48 C55,62 85,58 100,56 C115,58 145,62 170,48 C190,35 192,12 182,2 C188,10 180,25 170,30 C150,40 120,30 100,50Z" '
            f'fill="{color}" stroke="{color}" stroke-width="2"/></svg>')

def barras(alto=60, color=TINTA, ultima=NARANJA, anim=False, d=0.0):
    anchos = [6, 3, 9, 3, 4, 10, 3]; x, r = 0, []
    for i, w in enumerate(anchos):
        cls = f'class="bar" style="--d:{d + i*0.06:.2f}s"' if anim else ""
        r.append(f'<rect {cls} x="{x}" y="0" width="{w*2.2:.1f}" height="{alto}" fill="{ultima if i == len(anchos)-1 else color}"/>')
        x += w * 2.2 + 9
    return f'<svg width="{x*alto/60:.0f}" height="{alto}" viewBox="0 0 {x:.0f} {alto}" style="overflow:visible">{"".join(r)}</svg>'

def skyline(w=1500, color="#5b4636", d=0.0):
    edif = [(0, 260), (90, 330), (170, 210), (240, 380), (300, 290), (380, 420), (430, 300), (520, 250), (600, 460), (660, 340),
            (740, 280), (820, 400), (880, 230), (960, 350), (1040, 300), (1120, 440), (1180, 270), (1260, 320), (1340, 240), (1420, 300)]
    rects = "".join(f'<rect x="{x}" y="{500-h}" width="{70 + (i % 3)*12}" height="{h}" fill="{color}"/>' for i, (x, h) in enumerate(edif))
    agujas = "".join(f'<path d="M{x},{500-h} l18,-140 l18,140z" fill="{color}"/>' for x, h in [(612, 460), (650, 460), (1130, 440), (1168, 440)])
    ventanas = "".join(f'<rect x="{x+15+(j%2)*28}" y="{520-h+30+(j//2)*45}" width="12" height="18" fill="#f3d9a0" opacity=".55"/>'
                       for i, (x, h) in enumerate(edif) for j in range(min(6, h // 60)) if (i + j) % 3)
    return f'<svg class="e-rise" style="--d:{d}s" width="{w}" height="{w/3:.0f}" viewBox="0 0 1500 500">{rects}{agujas}{ventanas}</svg>'

def odometro(desde, hasta, d=0.0, dur=1.6, cls="mega"):
    cols = []
    for i, (a, b) in enumerate(zip(str(desde), str(hasta))):
        a, b = int(a), int(b); pasos = (b - a) % 10 + (10 if a != b and i >= 2 else 0)
        digs = "".join(f"<div>{(a + k) % 10}</div>" for k in range(pasos + 1))
        cols.append(f'<div class="odo-col"><div class="odo-roll" style="--d:{d}s;--dur:{dur}s;--n:{pasos}">{digs}</div></div>')
    return f'<div class="{cls} odo">{"".join(cols)}</div>'

def gotas(n=5, x0=0, d=0.0):
    return "".join(f'<div class="gota" style="left:{x0 + i*38}px;--d:{d + i*0.37:.2f}s"></div>' for i in range(n))

def bocadillo(texto, color=HUESO):
    return f'<div class="bocadillo" style="background:{color}">{texto}</div>'

def reloj(px=360):
    marcas = "".join(f'<line x1="100" y1="12" x2="100" y2="26" stroke="{TINTA}" stroke-width="5" transform="rotate({i*30} 100 100)"/>' for i in range(12))
    return (f'<svg width="{px}" height="{px}" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="{HUESO}" stroke="{TINTA}" stroke-width="8"/>{marcas}'
            f'<line class="l-spin-fast" x1="100" y1="100" x2="100" y2="30" stroke="{ROJO}" stroke-width="7" stroke-linecap="round" style="transform-origin:100px 100px"/>'
            f'<line class="l-spin-slow" x1="100" y1="100" x2="100" y2="50" stroke="{TINTA}" stroke-width="10" stroke-linecap="round" style="transform-origin:100px 100px"/>'
            f'<circle cx="100" cy="100" r="8" fill="{TINTA}"/></svg>')

def margarita(px=420, d=0.0):
    petalos = "".join(f'<g transform="rotate({i*24} 100 100)"><ellipse class="petalo" style="--d:{d + i*0.06:.2f}s;transform-origin:100px 100px" cx="100" cy="48" rx="17" ry="42" fill="#FFD23F" stroke="#e0a800" stroke-width="2"/></g>' for i in range(15))
    return f'<svg width="{px}" height="{px}" viewBox="0 0 200 200">{petalos}<circle class="e-pop" style="--d:{d+0.9}s;transform-origin:100px 100px" cx="100" cy="100" r="26" fill="{NARANJA}"/></svg>'

def mostrador(px=900, caja=False):
    cajon = (f'<g class="e-pop" style="--d:.2s;transform-origin:560px 250px"><rect x="470" y="170" width="180" height="110" rx="12" fill="{GRIS}"/>'
             f'<rect x="490" y="185" width="140" height="40" rx="6" fill="#1d2b22"/><text x="560" y="214" font-family="PlexMono" font-size="24" fill="#5dff9b" text-anchor="middle">0,25</text>'
             f'<rect x="490" y="235" width="140" height="30" rx="4" fill="#cfd3da"/></g>') if caja else ""
    return (f'<svg width="{px}" height="{px*0.55:.0f}" viewBox="0 0 900 500"><rect x="60" y="280" width="780" height="200" rx="14" fill="#8a5a3b"/>'
            f'<rect x="40" y="262" width="820" height="30" rx="10" fill="#6b4329"/>'
            f'<rect x="120" y="320" width="200" height="120" rx="8" fill="#9b6a49"/><rect x="560" y="320" width="200" height="120" rx="8" fill="#9b6a49"/>{cajon}</svg>')

def cursor(px=90):
    return f'<svg width="{px}" height="{px}" viewBox="0 0 40 40"><path d="M5,3 L5,33 L13,25 L19,38 L24,36 L18,23 L29,23Z" fill="white" stroke="{TINTA}" stroke-width="2.5"/></svg>'

def capitulo(n, titulo, icono):
    return f'''<div class="fondo dark"></div>
      <div class="laser"></div>
      {obj(barras(150, HUESO, NARANJA, True), 50, 30, "none")}
      {txt(kt(f"CAPÍTULO {n}", "mono naranja", .5, .05, "fade"), 50, 47)}
      {txt(kt(titulo, "mega hueso", .8, .12, "slam"), 50, 62, 90)}
      {obj(spr(icono, 170), 88, 84, "spin", "float", 1.2)}'''

def anio(desde, hasta, sub, icono):
    return f'''<div class="fondo"></div><div class="rayos"></div>
      {txt(odometro(desde, hasta, .1), 50, 42, 60)}
      {txt(kt(sub, "l", 1.6), 50, 66, 70)}
      {obj(spr(icono, 190), 20, 72, "left", "bob", 1.0)}{obj(spr("2728", 140), 80, 25, "pop", "spin-slow", 1.4)}'''

# ---------------------------------------------------------------- escenas
def escenas():
    E = {}
    E["intro_piruleta"] = f'''<div class="fondo"></div><div class="rayos"></div>
      {obj(spr("1f36d", 520), 28, 50, "spin", "float")}
      {obj(spr("2728", 150), 13, 22, "pop", "pulse", .6)}{obj(spr("2728", 110), 42, 78, "pop", "pulse", .9)}
      {txt(kt("ESTE CARAMELO", "xl", .3), 70, 38, 52, "left")}
      {txt(kt("lo has visto *miles* de veces", "l", .8), 70, 54, 52, "left")}
      {txt(kt("y seguramente lo has comido", "m gris", 1.6), 70, 66, 52, "left")}'''
    E["intro_dali"] = f'''<div class="fondo"></div>
      {obj(bigote(560), 50, 30, "none")}
      {txt(kt("¿SALVADOR *DALÍ*?", "mega", .9, .15, "slam"), 50, 58, 90)}
      {txt(kt("uno de los pintores más famosos del siglo XX", "m", 1.6), 50, 75, 80)}
      {obj(spr("1f468-200d-1f3a8", 230), 12, 72, "left", "bob", 1.2)}{obj(spr("1f3a8", 180), 88, 70, "right", "swing", 1.4)}'''
    E["relojes"] = f'''<div class="fondo calido"></div>
      {obj(spr("1f570-fe0f", 330), 30, 46, "drop", "melt")}{obj(spr("23f0", 210), 58, 32, "drop", "melt2", .3)}{obj(spr("1f570-fe0f", 190), 74, 58, "drop", "melt", .5)}
      {txt(kt("el de los *relojes* derretidos", "xl", .6), 50, 84, 90)}'''
    E["teaser_mundo"] = f'''<div class="fondo"></div>
      <svg class="pos" style="left:50%;top:48%" width="1300" height="520" viewBox="0 0 1300 520"><path class="draw dash" style="--d:.3s;--len:1500" d="M150,420 C450,20 850,20 1150,300" fill="none" stroke="{ROJO}" stroke-width="8" stroke-dasharray="20 18"/></svg>
      {obj(spr("1f36d", 200), 14, 76, "pop", "", 0, "")}
      <div class="viaje" style="--d:.5s">{spr("1f36d", 140)}</div>
      {obj(spr("1f30d", 300), 86, 58, "zoom", "spin-slow", .8)}
      {txt(kt("DE *BARCELONA*", "xl", .2), 30, 20, 50)}{txt(kt("A MEDIO MUNDO", "xl rojo", 1.5), 70, 88, 50)}'''
    E["pregunta_manos"] = f'''<div class="fondo dark"></div>
      {obj(spr("270b", 330) + gotas(5, 70, .8), 50, 36, "pop", "shake")}
      {txt(kt("¿Por qué los niños acaban siempre con las", "l hueso", .2, .05), 50, 66, 90)}
      {txt(kt("MANOS *PEGAJOSAS*?", "mega naranja", 1.0, .2, "slam"), 50, 81, 95)}'''
    E["cap1"] = capitulo(1, "EL PROBLEMA", "1f914")
    E["bernat"] = f'''<div class="fondo sepia"></div>
      {obj(skyline(1700, "#6d5440"), 50, 72, "none")}
      {obj(spr("1f468-200d-1f4bc", 300), 22, 42, "up", "bob", .5)}
      {txt(kt("BARCELONA · *AÑOS 50*", "xl", .2), 62, 24, 70)}
      {txt(kt("Enric Bernat · negocio de la confitería", "l", 1.0), 62, 38, 70)}
      <div class="viñeta"></div>'''
    E["piensa"] = f'''<div class="fondo"></div>
      {obj(spr("1f914", 380), 30, 50, "pop", "bob")}
      {obj(spr("1f4a1", 160), 44, 22, "drop", "pulse", .8)}
      {txt(kt("algo que *cualquier padre* conoce", "xl", .3), 70, 50, 52, "left")}'''
    E["manos_pegajosas"] = f'''<div class="fondo"></div>
      {obj(spr("1f9d2", 330), 22, 50, "left", "bob")}
      <div class="ciclo">{spr("1f36c", 120)}</div>
      {txt(kt("BOCA → MANO → BOCA", "l", .3, .15), 66, 32, 56)}
      {txt(kt("DEDOS *PRINGADOS*", "xl", 1.4, .2, "slam"), 66, 52, 56)}
      {obj(spr("270b", 170) + gotas(4, 40, 2.0), 66, 76, "pop", "shake", 1.8)}'''
    E["sabor_no"] = f'''<div class="fondo"></div>
      {obj(spr("1f36c", 260), 25, 40, "pop", "float")}
      {txt('<div class="xl tachado" style="--d:1.0s">SABOR NUEVO</div>', 60, 32, 60)}
      {txt(kt("FORMA *NUEVA* DE COMERLO", "xl", 2.2), 60, 58, 70)}
      {obj('<div class="check">✔</div>', 86, 58, "pop", "pulse", 2.8)}'''
    E["idea_palo"] = f'''<div class="fondo"></div><div class="rayos"></div>
      <div class="pos" style="left:50%;top:62%"><div class="palo e-grow" style="--d:.2s"></div></div>
      <div class="vuela" style="--d:.6s">{spr("1f36c", 200)}</div>
      {obj(spr("1f36d", 380), 50, 44, "flash", "float", 1.6)}
      {obj(spr("1f4a1", 180), 72, 24, "drop", "pulse", 1.9)}
      {txt(kt("un caramelo en la *punta de un palo*", "xl", 2.0), 50, 88, 90)}'''
    E["cap2"] = capitulo(2, "EL NOMBRE", "1f3f7-fe0f")
    E["ano1958"] = anio(1940, 1958, "sale a la venta", "1f3ea")
    E["nombre_gol"] = f'''<div class="fondo cesped"></div>
      <svg class="pos porteria" style="left:78%;top:50%" width="480" height="340" viewBox="0 0 480 340"><rect x="10" y="10" width="460" height="320" fill="none" stroke="white" stroke-width="14"/>
      <path d="M10,10 L80,60 L400,60 L470,10 M80,60 L80,330 M400,60 L400,330" stroke="white" stroke-width="4" fill="none"/>
      {"".join(f'<line x1="{80+i*32}" y1="60" x2="{80+i*32}" y2="330" stroke="white" stroke-width="2" opacity=".6"/>' for i in range(11))}
      {"".join(f'<line x1="80" y1="{60+i*30}" x2="400" y2="{60+i*30}" stroke="white" stroke-width="2" opacity=".6"/>' for i in range(10))}</svg>
      <div class="balon" style="--d:.3s">{spr("26bd", 150)}</div>
      {txt(kt("«GOL»", "mega hueso", 1.7, .1, "slam"), 32, 40, 50)}
      {txt(kt("primer nombre, según algunas fuentes", "m hueso", 2.2), 32, 58, 50)}'''
    E["nombre_chups"] = f'''<div class="fondo"></div><div class="rayos"></div>
      {txt('<div class="sello" style="--d:.2s">«CHUPS»</div>', 50, 42, 80)}
      {txt(kt("del verbo *chupar*", "l", 1.0), 50, 66, 60)}
      {obj(spr("1f36c", 150), 15, 30, "pop", "float", .6)}{obj(spr("1f36c", 120), 86, 72, "pop", "float", .8)}{obj(spr("1f60b", 170), 84, 28, "pop", "bob", 1.2)}'''
    E["curioso"] = f'''<div class="fondo"></div>
      {obj(spr("1f440", 420), 50, 42, "zoom", "")}
      {txt(kt("Y aquí ocurre algo *curioso*…", "xl", .5), 50, 80, 90)}'''
    E["tienda_pedian"] = f'''<div class="fondo"></div>
      {obj(spr("1f3ea", 330), 50, 58, "up", "")}
      {obj(bocadillo("¡Un Chupa Chups!"), 22, 26, "pop", "bob", .5)}{obj(bocadillo("¿Me da un Chupa Chups?", "#ffe1b8"), 76, 22, "pop", "bob", 1.1)}
      {obj(bocadillo("¡Dos Chupa Chups!", "#ffd0d6"), 80, 50, "pop", "bob", 1.7)}{obj(bocadillo("Un Chupa Chups, porfa", "#e2f3e7"), 18, 56, "pop", "bob", 2.3)}
      {txt(kt("nadie pedía «un Chups»", "l", .2), 50, 90, 80)}'''
    E["escuchar"] = f'''<div class="fondo"></div>
      {obj(spr("1f4ac", 260), 22, 46, "pop", "bob")}
      {txt(kt("ESCUCHAR A", "xl", .3), 62, 38, 60)}{txt(kt("*TUS CLIENTES*", "mega", .8, .15, "slam"), 62, 56, 70)}
      {obj(spr("1f44f", 200), 84, 80, "pop", "", 1.6)}'''
    E["la_calle"] = f'''<div class="fondo"></div>
      {obj('<div class="placa"><small>CARRER DE</small>LA GENT</div>', 32, 44, "drop", "swing")}
      {txt(kt("el nombre lo eligió, en parte,", "l", .4), 68, 40, 55)}{txt(kt("*LA CALLE*", "mega", 1.2, .15, "slam"), 68, 58, 55)}'''
    E["cap3"] = capitulo(3, "EL LUGAR", "1f3ea")
    E["mostrador_antes"] = f'''<div class="fondo"></div>
      <div class="pos estante" style="left:50%;top:30%"></div>
      {obj(spr("1f36c", 110) + spr("1f36d", 110) + spr("1f36c", 110), 50, 22, "drop", "", .3, "display:flex;gap:10px")}
      {obj(mostrador(1000), 50, 66, "up")}
      {obj(spr("1f9d2", 170), 50, 93, "up", "jump", .8)}
      {txt('<div class="etiqueta">ANTES</div>' + kt("detrás del mostrador, lejos de los niños", "l", .5), 24, 16, 36, "left")}'''
    E["mostrador_caja"] = f'''<div class="fondo"></div>
      {obj(mostrador(1000, True), 50, 66, "none")}
      <div class="desliza" style="--d:.5s">{spr("1f36d", 120)}{spr("1f36d", 120)}{spr("1f36d", 120)}</div>
      {obj(spr("1f9d2", 200), 26, 80, "left", "reach", 1.2)}
      {txt('<div class="etiqueta verde">DESPUÉS</div>' + kt("junto a la caja registradora", "l", .5), 24, 16, 36, "left")}'''
    E["altura_nino"] = f'''<div class="fondo"></div>
      {obj(spr("1f9d2", 300), 18, 60, "up", "bob")}
      <svg class="pos" style="left:52%;top:42%" width="900" height="80"><line class="draw" style="--d:.5s;--len:900" x1="0" y1="40" x2="880" y2="40" stroke="{ROJO}" stroke-width="7" stroke-dasharray="22 14"/></svg>
      {obj(spr("1f440", 120), 30, 42, "pop", "", .3)}{obj(spr("1f36d", 190), 88, 42, "pop", "float", 1.3)}
      {obj('<div class="regla"><span>1 m</span></div>', 18, 90, "left", "", .8)}
      {txt(kt("el último momento antes de pagar", "l", 1.5), 62, 66, 60)}
      {txt(kt("lo decide alguien de *un metro*", "xl", 2.4), 62, 80, 70)}'''
    E["compra_impulso"] = f'''<div class="fondo dark"></div><div class="rayos oscuro"></div>
      <div class="carro" style="--d:.2s">{spr("1f6d2", 260)}<div class="lineas"></div></div>
      {obj(spr("2728", 140), 22, 24, "pop", "pulse", 1.0)}{obj(spr("1f6cd-fe0f", 160), 80, 26, "pop", "bob", 1.3)}
      {txt(kt("ZONA DE", "xl hueso", .3), 50, 50, 80)}{txt(kt("COMPRA POR *IMPULSO*", "mega naranja", .8, .15, "slam"), 50, 68, 95)}'''
    E["adelantado"] = f'''<div class="fondo"></div>
      <svg class="pos" style="left:50%;top:52%" width="1500" height="200" viewBox="0 0 1500 200"><line class="draw" style="--d:.2s;--len:1450" x1="20" y1="100" x2="1470" y2="100" stroke="{TINTA}" stroke-width="8"/>
      <path class="e-pop" style="--d:1.2s;transform-origin:1460px 100px" d="M1440,70 L1480,100 L1440,130" fill="none" stroke="{TINTA}" stroke-width="8"/></svg>
      {obj('<div class="hito">1958 · Bernat</div>', 22, 40, "drop", "", .6)}{obj('<div class="hito gris">el marketing lo llama así</div>', 76, 66, "up", "", 1.2)}
      {obj(spr("1f3c6", 150), 22, 66, "pop", "bob", 1.0)}
      {txt(kt("mucho antes de que se pusiera *de moda*", "xl", 1.6), 50, 84, 95)}'''
    E["cap4"] = capitulo(4, "DALÍ", "1f3a8")
    E["ano1969"] = f'''<div class="fondo"></div>
      {txt(odometro(1958, 1969, .1), 50, 34, 60)}
      {obj(spr("1f1ea-1f1f8", 180), 22, 68, "pop", "bob", 1.0)}
      <svg class="pos" style="left:50%;top:68%" width="700" height="120" viewBox="0 0 700 120"><path class="draw" style="--d:1.4s;--len:700" d="M20,60 L660,60 M620,25 L670,60 L620,95" fill="none" stroke="{ROJO}" stroke-width="10"/></svg>
      {obj(spr("1f30d", 200), 80, 68, "zoom", "spin-slow", 1.9)}
      {txt(kt("la marca quiere *crecer fuera*", "l", 1.2), 50, 88, 80)}'''
    E["idiomas"] = f'''<div class="fondo"></div>
      {"".join(obj(bocadillo(w, c), x, y, "pop", "bob", d) for w, c, x, y, d in [("Hola", HUESO, 18, 24, .2), ("Hello", "#ffe1b8", 78, 20, .5), ("Bonjour", "#e2f3e7", 84, 56, .8), ("Ciao", "#ffd0d6", 16, 60, 1.1), ("Olá", "#dde8ff", 30, 84, 1.4), ("Hallo", HUESO, 70, 84, 1.7)])}
      {txt(kt("una imagen que se entienda", "xl", .6), 50, 38, 80)}{txt(kt("*SIN IDIOMA*", "mega", 1.4, .2, "slam"), 50, 58, 60)}'''
    E["dali_artista"] = f'''<div class="fondo calido"></div>
      <svg class="pos" style="left:50%;top:50%" width="1920" height="1080" viewBox="0 0 1920 1080">
       <path class="draw" style="--d:.2s;--len:2400" d="M80,900 C400,700 700,980 1000,760 S1600,620 1860,820" fill="none" stroke="{NARANJA}" stroke-width="60" stroke-linecap="round" opacity=".55"/>
       <path class="draw" style="--d:.6s;--len:2400" d="M60,260 C380,120 760,330 1100,170 S1600,120 1880,240" fill="none" stroke="#FFD23F" stroke-width="44" stroke-linecap="round" opacity=".6"/></svg>
      {obj(spr("1f468-200d-1f3a8", 420), 30, 52, "up", "bob", .3)}
      {obj(bigote(320, TINTA, .9), 70, 32, "none")}
      {txt(kt("SALVADOR DALÍ", "mega", 1.1, .15, "slam"), 70, 56, 55)}{obj(spr("1f3a8", 160), 88, 80, "spin", "swing", 1.6)}'''
    E["reloj_rapido"] = f'''<div class="fondo"></div>
      {obj(reloj(420), 28, 50, "spin", "")}
      {txt(kt("según la versión más repetida", "m gris", .3), 68, 30, 55)}
      {txt(kt("MENOS DE", "xl", .7), 68, 44, 55)}{txt(kt("*1 HORA*", "mega", 1.1, .2, "slam"), 68, 62, 55)}'''
    E["margarita"] = f'''<div class="fondo"></div><div class="rayos"></div>
      {obj(margarita(520, .2), 32, 50, "none", "spin-slow")}
      {txt(kt("la *margarita amarilla*", "xl", 1.0), 70, 44, 52)}{txt(kt("que todavía hoy envuelve cada caramelo", "l", 1.8), 70, 60, 52)}'''
    E["consejo"] = f'''<div class="fondo dark"></div><div class="rayos oscuro"></div>
      {obj(spr("1f4a1", 380), 50, 40, "drop", "glow")}
      {txt(kt("no fue el dibujo:", "l hueso", .4), 50, 72, 80)}{txt(kt("fue *UN CONSEJO*", "mega naranja", 1.0, .15, "slam"), 50, 86, 90)}'''
    E["envoltorio_lateral"] = f'''<div class="fondo"></div>
      <div class="pos" style="left:30%;top:50%">{envoltorio("lat")}</div>
      {txt(kt("logotipo en el *lateral*", "xl", .4), 70, 38, 52)}{txt(kt("el envoltorio gira… y el nombre se pierde", "l", 1.2), 70, 56, 52)}
      {obj('<div class="equis">✖</div>', 30, 84, "pop", "shake", 2.4)}'''
    E["envoltorio_comparar"] = f'''<div class="fondo"></div>
      <div class="pos" style="left:27%;top:46%">{envoltorio("lat", 300)}</div><div class="pos" style="left:73%;top:46%">{envoltorio("top", 300)}</div>
      {txt(kt("LATERAL", "xl rojo", .2), 27, 80, 40)}{txt(kt("ARRIBA", "xl verde", .6), 73, 80, 40)}
      {obj('<div class="equis">✖</div>', 27, 92, "pop", "", 1.0)}{obj('<div class="check">✔</div>', 73, 92, "pop", "pulse", 1.4)}'''
    E["diseno_funcional"] = f'''<div class="fondo dark"></div>
      {txt(kt("NO ES SOLO ARTE.", "xl hueso", .2), 50, 30, 90)}
      {txt(kt("ES *DISEÑO FUNCIONAL*", "mega naranja", .9, .2, "slam"), 50, 50, 95)}
      {txt(kt("y lo propuso un pintor surrealista", "l hueso", 1.8), 50, 68, 90)}{obj(bigote(220, HUESO, 2.2), 50, 84, "none")}'''
    E["cap5"] = capitulo(5, "EL MUNDO", "1f30d")
    puntos = [(1080, 300), (1260, 420), (1420, 260), (1180, 640), (1560, 560), (980, 720)]
    arcos = "".join(f'<path class="draw" style="--d:{.4 + i*.2:.1f}s;--len:1400" d="M560,500 Q{(560+x)//2},{min(500, y) - 260} {x},{y}" fill="none" stroke="{ROJO}" stroke-width="6" stroke-dasharray="14 10"/>'
                    f'<circle class="e-pop" style="--d:{1.0 + i*.2:.1f}s;transform-origin:{x}px {y}px" cx="{x}" cy="{y}" r="18" fill="{NARANJA}"/>' for i, (x, y) in enumerate(puntos))
    E["mundo"] = f'''<div class="fondo"></div>
      <svg class="pos" style="left:50%;top:50%" width="1920" height="1080" viewBox="0 0 1920 1080">{arcos}<circle cx="560" cy="500" r="26" fill="{ROJO}"/></svg>
      {obj(spr("1f30d", 300), 22, 46, "zoom", "spin-slow")}
      {txt(kt("fábricas · distribución · patrocinios", "l", 1.4), 62, 88, 70)}
      {txt(kt("*AL MUNDO*", "mega", .4, .15, "slam"), 70, 14, 50)}'''
    E["espacio1995"] = f'''<div class="fondo espacio"></div><div class="estrellas"></div><div class="estrellas e2"></div>
      <div class="cohete" style="--d:.2s">{spr("1f680", 260)}</div>
      {obj(spr("1f6f0-fe0f", 220), 78, 24, "pop", "float", .8)}{obj(spr("1f36d", 200), 70, 62, "zoom", "space", 1.2)}
      {txt(kt("1995", "mega hueso", .4, .15, "slam"), 24, 66, 40)}{txt(kt("un caramelo en la estación *Mir*", "l hueso", 1.0), 30, 82, 55)}
      {txt(kt("según la propia marca", "m gris", 1.8), 30, 90, 55)}'''
    E["comprobar"] = f'''<div class="fondo"></div>
      {txt('<div class="interroga">?</div>', 40, 50, 30)}
      <div class="lupa" style="--d:.2s">{spr("1f50d", 260)}</div>
      {txt(kt("¿el *primero* en el espacio?", "xl", .6), 72, 42, 50)}{txt(kt("difícil de comprobar", "l gris", 1.4), 72, 58, 50)}'''
    orbita = "".join(f'<div class="orbita" style="--r:{r}s;--a:{a}deg">{spr(c, 120)}</div>' for c, r, a in [("2b50", 6, 0), ("2764-fe0f", 6, 120), ("2728", 6, 240)])
    E["icono_global"] = f'''<div class="fondo"></div><div class="rayos"></div>
      <div class="pos" style="left:50%;top:44%">{spr("1f36d", 330)}{orbita}</div>
      {txt(kt("de dulce de barrio a", "l", .4), 50, 76, 80)}{txt(kt("*ICONO GLOBAL*", "mega", 1.0, .2, "slam"), 50, 89, 90)}'''
    E["cap6"] = capitulo(6, "LA VENTA", "1f4bc")
    E["gustos"] = f'''<div class="fondo"></div>
      {obj(spr("1f60b", 200), 18, 40, "pop", "bob", .2)}{obj(spr("1f4c9", 220), 50, 38, "pop", "shake", .7)}{obj(spr("1f3ed", 230), 82, 40, "pop", "bob", 1.2)}
      {txt(kt("cambian los gustos", "l", .3), 18, 64, 30)}{txt(kt("preocupa el azúcar", "l", .8), 50, 64, 30)}{txt(kt("el sector se concentra", "l", 1.3), 82, 64, 30)}'''
    E["venta2006"] = f'''<div class="fondo"></div>
      {txt(odometro(1969, 2006, .1, 1.4, "xl"), 50, 16, 40)}
      {obj(spr("1f1ea-1f1f8", 200), 20, 46, "pop", "", .6)}
      <svg class="pos" style="left:42%;top:46%" width="360" height="100" viewBox="0 0 360 100"><path class="draw" style="--d:1.0s;--len:400" d="M10,50 L330,50 M290,15 L345,50 L290,85" fill="none" stroke="{ROJO}" stroke-width="10"/></svg>
      {obj(spr("1f1ee-1f1f9", 180), 66, 46, "pop", "bob", 1.4)}{obj(spr("1f1f3-1f1f1", 180), 82, 46, "pop", "bob", 1.6)}
      {txt('<div class="xl maquina" style="--d:1.8s">PERFETTI VAN MELLE</div>', 50, 72, 90)}
      {txt(kt("grupo italo-neerlandés · también fabrica Mentos", "m gris", 2.6), 50, 85, 90)}'''
    E["propiedad"] = f'''<div class="fondo"></div>
      {obj(spr("1f1ea-1f1f8", 300), 30, 46, "pop", "fuera")}
      {txt(kt("deja de ser de", "xl", .3), 66, 32, 60)}{txt(kt("*PROPIEDAD ESPAÑOLA*", "xl", .8, .2, "slam"), 66, 50, 64)}'''
    E["pedacito_bcn"] = f'''<div class="fondo calido"></div>
      {obj(skyline(1800, "#b35a2b"), 50, 88, "none")}
      {obj(spr("1f36d", 230), 50, 30, "drop", "float", .4)}{obj(spr("2764-fe0f", 150), 62, 18, "pop", "pulse", 1.0)}
      {txt(kt("para medio mundo, sigue siendo", "l", .6), 50, 44, 80)}{txt(kt("UN PEDACITO DE *BARCELONA*", "xl", 1.3), 50, 56, 90)}'''
    E["cap7"] = capitulo(7, "LO QUE NOS ENSEÑA", "1f9e0")
    for i, (a, b, ic) in enumerate([("no hace falta un producto nuevo", "UNA FORMA NUEVA DE USAR *ALGO DE SIEMPRE*", "1f4a1"),
                                    ("el nombre no siempre lo eliges tú", "*ESCUCHA* A TUS CLIENTES", "1f4ac"),
                                    ("el diseño no es decoración", "UN LOGOTIPO BIEN COLOCADO VALE MÁS QUE *MIL ANUNCIOS*", "1f4af")], 1):
        E[f"leccion{i}"] = f'''<div class="fondo"></div>
          {obj(f'<div class="num">{i}</div>', 16, 50, "flip", "")}
          {txt(kt(a, "l gris", .4), 58, 30, 70, "left")}{txt(kt(b, "xl", .9, .1), 58, 52, 70, "left")}
          {obj(spr(ic, 190), 86, 82, "pop", "bob", 1.8)}'''
    E["resumen_final"] = f'''<div class="fondo"></div>
      {obj(spr("1f468-200d-1f4bc", 260), 20, 42, "pop", "bob", .2)}{obj(bigote(300, TINTA, .9), 50, 42, "none")}{obj(spr("270b", 240), 80, 42, "pop", "shake", 1.6)}
      {txt(kt("un empresario", "l", .5), 20, 70, 30)}{txt(kt("un pintor surrealista", "l", 1.2), 50, 70, 30)}{txt(kt("dedos pegajosos", "l", 1.9), 80, 70, 30)}'''
    E["marca_canal"] = f'''<div class="fondo dark"></div><div class="laser"></div>
      {obj(barras(200, HUESO, NARANJA, True, .1), 50, 34, "none")}
      {txt(kt("CÓDIGO DE BARRAS", "mega hueso", .8, .12, "slam"), 50, 62, 95)}
      {txt(kt("la historia que no conoces de lo que tienes en casa", "l naranja", 1.6, .05), 50, 78, 95)}'''
    E["cta_comentarios"] = f'''<div class="fondo"></div>
      {obj(spr("1f4ac", 300), 24, 48, "pop", "bob")}<div class="pos" style="left:24%;top:46%"><div class="puntos"><i></i><i></i><i></i></div></div>
      {txt(kt("¿QUÉ MARCA *INVESTIGAMOS*?", "xl", .3), 64, 40, 62)}{txt(kt("déjala en los comentarios", "l", 1.1), 64, 56, 62)}
      {txt(kt("cada mes elegimos una de las más votadas", "m gris", 1.8), 64, 66, 62)}'''
    E["cta_suscribe"] = f'''<div class="fondo"></div><div class="rayos"></div>
      <div class="pos" style="left:50%;top:40%"><div class="boton"><span class="b1">SUSCRIBIRSE</span><span class="b2">SUSCRITO ✔</span></div></div>
      <div class="raton">{cursor(90)}</div>
      {txt(kt("Próximo jueves:", "l", 2.4), 50, 66, 80)}{txt(kt("el día que Coca-Cola *cambió su fórmula*", "xl", 2.9), 50, 80, 95)}'''
    return E

def envoltorio(tipo, px=420):
    etiqueta = '<div class="etq-lat">MARCA</div>' if tipo == "lat" else '<div class="etq-top">MARCA</div>'
    return f'<div class="envol {tipo}" style="width:{px}px;height:{px}px"><div class="giro">{etiqueta}</div><div class="brillo"></div></div>'

CSS = r"""
@font-face{font-family:Bebas;src:url('FUENTES/fontsource-bebas-neue-5.3.0/files/bebas-neue-latin-400-normal.woff2')}
@font-face{font-family:Plex;font-weight:400;src:url('FUENTES/fontsource-ibm-plex-sans-5.3.0/files/ibm-plex-sans-latin-400-normal.woff2')}
@font-face{font-family:Plex;font-weight:700;src:url('FUENTES/fontsource-ibm-plex-sans-5.3.0/files/ibm-plex-sans-latin-700-normal.woff2')}
@font-face{font-family:PlexMono;src:url('FUENTES/fontsource-ibm-plex-mono-5.3.0/files/ibm-plex-mono-latin-400-normal.woff2')}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:KRAFT}
.escena{position:absolute;inset:0;display:none;overflow:hidden}
.cam{position:absolute;inset:0}
.fondo{position:absolute;inset:-40px;background:KRAFT;background-image:radial-gradient(circle at 25% 25%,rgba(255,255,255,.35),transparent 50%),radial-gradient(circle at 80% 85%,rgba(120,80,40,.18),transparent 55%)}
.fondo.dark{background:TINTA;background-image:radial-gradient(circle at 50% 45%,#2c2c2c,TINTA 70%)}
.fondo.sepia{background:#d9c19a;background-image:radial-gradient(circle at 50% 40%,#f0dcb6,#b79566 90%)}
.fondo.calido{background:#f2c98a;background-image:radial-gradient(circle at 30% 30%,#ffe3b0,#e9a65a 85%)}
.fondo.cesped{background:#2f8f4e;background-image:repeating-linear-gradient(90deg,#2f8f4e 0 120px,#35a058 120px 240px)}
.fondo.espacio{background:#0b1026;background-image:radial-gradient(circle at 70% 30%,#27306b,#0b1026 70%)}
.viñeta{position:absolute;inset:0;box-shadow:inset 0 0 260px rgba(60,30,0,.55);pointer-events:none}
.rayos{position:absolute;left:50%;top:50%;width:3000px;height:3000px;margin:-1500px;background:repeating-conic-gradient(rgba(255,255,255,.22) 0 8deg,transparent 8deg 16deg);animation:girar 60s linear infinite}
.rayos.oscuro{background:repeating-conic-gradient(rgba(255,140,26,.08) 0 8deg,transparent 8deg 16deg)}
.pos{position:absolute;transform:translate(-50%,-50%)}
.txt{z-index:5}
.mv{display:inline-block}
.spr{background-repeat:no-repeat;display:inline-block;filter:drop-shadow(0 18px 18px rgba(0,0,0,.25))}
.mega{font-family:Bebas;font-size:230px;line-height:.9;color:TINTA;letter-spacing:3px}
.xl{font-family:Bebas;font-size:124px;line-height:.95;color:TINTA;letter-spacing:2px}
.l{font-family:Plex;font-weight:700;font-size:52px;color:TINTA;line-height:1.2}
.m{font-family:Plex;font-size:40px;color:TINTA}
.mono{font-family:PlexMono;font-size:42px;letter-spacing:10px}
.rojo{color:ROJO}.naranja{color:NARANJA}.hueso{color:HUESO}.gris{color:#5d6168}.verde{color:#1f9d5c}
.dark .gris,.gris.dark{color:GRIS}
.hl{color:ROJO;position:relative}
.naranja .hl,.hueso .hl{color:NARANJA}
.w{display:inline-block;animation:wUp .55s cubic-bezier(.2,1.3,.4,1) var(--d) both}
.w-slam{animation:wSlam .5s cubic-bezier(.2,1.6,.4,1) var(--d) both}
.w-fade{animation:wFade .4s ease var(--d) both}
@keyframes wUp{from{opacity:0;transform:translateY(60px) rotate(4deg)}to{opacity:1;transform:none}}
@keyframes wSlam{from{opacity:0;transform:scale(2.6)}60%{opacity:1}to{opacity:1;transform:scale(1)}}
@keyframes wFade{from{opacity:0}to{opacity:1}}
/* entradas */
.e-pop{animation:ePop .7s cubic-bezier(.2,1.5,.4,1) var(--d) both}
.e-up{animation:eUp .8s cubic-bezier(.2,1.1,.3,1) var(--d) both}
.e-left{animation:eLeft .8s cubic-bezier(.2,1.1,.3,1) var(--d) both}
.e-right{animation:eRight .8s cubic-bezier(.2,1.1,.3,1) var(--d) both}
.e-drop{animation:eDrop .9s cubic-bezier(.3,1.5,.5,1) var(--d) both}
.e-zoom{animation:eZoom 1s cubic-bezier(.2,1,.3,1) var(--d) both}
.e-spin{animation:eSpin 1s cubic-bezier(.2,1.2,.4,1) var(--d) both}
.e-flip{animation:eFlip .9s cubic-bezier(.2,1.3,.4,1) var(--d) both}
.e-flash{animation:eFlash .8s ease var(--d) both}
.e-grow{animation:eGrow .6s ease-out var(--d) both;transform-origin:50% 100%}
.e-rise{animation:eRise 1.4s cubic-bezier(.2,1,.3,1) var(--d) both}
.e-none{}
@keyframes ePop{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}
@keyframes eUp{from{opacity:0;transform:translateY(160px)}to{opacity:1;transform:none}}
@keyframes eLeft{from{opacity:0;transform:translateX(-260px)}to{opacity:1;transform:none}}
@keyframes eRight{from{opacity:0;transform:translateX(260px)}to{opacity:1;transform:none}}
@keyframes eDrop{from{opacity:0;transform:translateY(-500px)}to{opacity:1;transform:none}}
@keyframes eZoom{from{opacity:0;transform:scale(3) rotate(-20deg)}to{opacity:1;transform:none}}
@keyframes eSpin{from{opacity:0;transform:scale(.1) rotate(-540deg)}to{opacity:1;transform:none}}
@keyframes eFlip{from{opacity:0;transform:perspective(800px) rotateX(-90deg)}to{opacity:1;transform:none}}
@keyframes eFlash{0%{opacity:0;transform:scale(.5);filter:brightness(4)}60%{opacity:1;filter:brightness(2)}100%{opacity:1;transform:none;filter:none}}
@keyframes eGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes eRise{from{opacity:0;transform:translateY(220px)}to{opacity:1;transform:none}}
/* bucles */
.l-float{animation:lFloat 3.2s ease-in-out infinite}
.l-bob{animation:lBob 1.6s ease-in-out infinite}
.l-pulse{animation:lPulse 1.2s ease-in-out infinite}
.l-shake{animation:lShake .5s ease-in-out infinite}
.l-swing{animation:lSwing 2.2s ease-in-out infinite;transform-origin:50% 0}
.l-spin-slow{animation:girar 14s linear infinite}
.l-spin-fast{animation:girar 1.2s linear infinite}
.l-melt{animation:lMelt 3s ease-in-out infinite;transform-origin:50% 0}
.l-melt2{animation:lMelt 2.4s ease-in-out infinite reverse;transform-origin:50% 0}
.l-jump{animation:lJump .9s ease-in-out infinite}
.l-reach{animation:lReach 1.4s ease-in-out infinite}
.l-glow{animation:lGlow 1.4s ease-in-out infinite}
.l-space{animation:lSpace 6s linear infinite}
.l-fuera{animation:lFuera 4s ease-in 1.4s both}
@keyframes lFloat{50%{transform:translateY(-26px) rotate(3deg)}}
@keyframes lBob{50%{transform:translateY(-14px)}}
@keyframes lPulse{50%{transform:scale(1.12)}}
@keyframes lShake{25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}}
@keyframes lSwing{50%{transform:rotate(-8deg)}0%,100%{transform:rotate(8deg)}}
@keyframes girar{to{transform:rotate(360deg)}}
@keyframes lMelt{50%{transform:skewX(-10deg) scaleY(1.25) scaleX(.9)}}
@keyframes lJump{50%{transform:translateY(-40px)}}
@keyframes lReach{50%{transform:translateX(30px) rotate(6deg)}}
@keyframes lGlow{50%{filter:drop-shadow(0 0 60px #ffd23f) brightness(1.2);transform:scale(1.06)}}
@keyframes lSpace{from{transform:rotate(0) translateY(0)}50%{transform:rotate(180deg) translateY(-30px)}to{transform:rotate(360deg) translateY(0)}}
@keyframes lFuera{to{transform:translateX(-900px) rotate(-30deg);opacity:0}}
/* trazos */
.draw{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:draw 1.2s ease-out var(--d) both}
.draw.dash{stroke-dasharray:20 18;animation:dash 1.6s ease-out var(--d) both;clip-path:inset(0 100% 0 0)}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes dash{to{clip-path:inset(0 0 0 0)}}
.bar{transform-box:fill-box;transform-origin:50% 100%;animation:eGrow .5s cubic-bezier(.2,1.4,.4,1) var(--d) both}
.petalo{animation:ePop .5s cubic-bezier(.2,1.5,.4,1) var(--d) both}
/* piezas */
.odo{display:flex;justify-content:center;height:.9em;overflow:hidden}
.odo-col{height:.9em;overflow:hidden}
.odo-roll{animation:odo var(--dur) cubic-bezier(.3,0,.2,1) var(--d) both}
.odo-roll div{height:.9em}
@keyframes odo{to{transform:translateY(calc(var(--n) * -0.9em))}}
.gota{position:absolute;top:80%;width:22px;height:30px;background:ROJO;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;opacity:0;animation:gota 1.3s ease-in var(--d) infinite}
@keyframes gota{0%{opacity:0;transform:translateY(0) scale(.4)}20%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:translateY(240px)}}
.ciclo{position:absolute;left:30%;top:40%;animation:ciclo 2s ease-in-out infinite}
@keyframes ciclo{0%,100%{transform:translate(0,0)}50%{transform:translate(120px,180px) rotate(200deg)}}
.tachado{position:relative;display:inline-block}
.tachado::after{content:"";position:absolute;left:-10px;right:-10px;top:48%;height:16px;background:ROJO;transform-origin:0 50%;animation:eGrowX .5s ease-out var(--d) both}
@keyframes eGrowX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.check{font-size:150px;color:#1f9d5c;font-family:Plex;font-weight:700}
.equis{font-size:130px;color:ROJO;font-family:Plex;font-weight:700}
.palo{width:34px;height:420px;background:HUESO;border:5px solid TINTA;border-radius:18px;margin-top:180px}
.vuela{position:absolute;left:0;top:0;animation:vuela 1.0s cubic-bezier(.4,0,.2,1) var(--d) both}
@keyframes vuela{from{transform:translate(-200px,600px) rotate(-360deg)}to{transform:translate(860px,350px) rotate(0);opacity:0}}
.porteria{filter:drop-shadow(0 10px 10px rgba(0,0,0,.3))}
.balon{position:absolute;left:0;top:0;animation:balon 1.4s cubic-bezier(.3,.1,.3,1) var(--d) both}
@keyframes balon{from{transform:translate(-150px,820px) rotate(0)}to{transform:translate(1450px,520px) rotate(1080deg)}}
.sello{font-family:Bebas;font-size:300px;color:ROJO;border:16px solid ROJO;border-radius:30px;padding:0 50px;display:inline-block;animation:sello .6s cubic-bezier(.2,1.6,.4,1) var(--d) both;transform:rotate(-6deg)}
@keyframes sello{from{opacity:0;transform:scale(3) rotate(-6deg)}to{opacity:1;transform:scale(1) rotate(-6deg)}}
.bocadillo{font-family:Plex;font-weight:700;font-size:46px;padding:22px 36px;border-radius:40px;border:4px solid TINTA;color:TINTA;white-space:nowrap;box-shadow:8px 8px 0 TINTA;position:relative}
.placa{background:#1d4e9e;color:white;font-family:Plex;font-weight:700;font-size:70px;padding:24px 50px;border:10px solid white;outline:6px solid #1d4e9e;border-radius:14px;text-align:center;line-height:1}
.placa small{display:block;font-size:30px;font-weight:400;letter-spacing:4px}
.estante{width:700px;height:24px;background:#6b4329;border-radius:8px}
.etiqueta{display:inline-block;background:ROJO;color:white;font-family:Bebas;font-size:70px;padding:4px 26px;margin-bottom:12px}
.etiqueta.verde{background:#1f9d5c}
.desliza{position:absolute;left:0;top:0;display:flex;gap:6px;animation:desliza 1.1s cubic-bezier(.2,1.2,.3,1) var(--d) both}
@keyframes desliza{from{transform:translate(960px,120px);opacity:0}to{transform:translate(1170px,470px);opacity:1}}
.regla{width:300px;height:16px;background:ROJO;border-radius:8px;position:relative}
.regla span{position:absolute;right:-10px;top:-64px;font-family:Bebas;font-size:60px;color:ROJO}
.carro{position:absolute;left:0;top:0;animation:carro 1.2s cubic-bezier(.2,1,.3,1) var(--d) both}
.carro .lineas{position:absolute;left:250px;top:90px;width:180px;height:80px;background:repeating-linear-gradient(0deg,transparent 0 16px,rgba(255,255,255,.5) 16px 22px)}
@keyframes carro{from{transform:translate(2100px,160px)}to{transform:translate(830px,160px)}}
.hito{font-family:Bebas;font-size:72px;background:TINTA;color:HUESO;padding:6px 26px;border-radius:10px}
.hito.gris{background:GRIS}
.num{font-family:Bebas;font-size:420px;color:NARANJA;line-height:1;text-shadow:10px 10px 0 TINTA}
.envol{border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#f3e9d6 55%,#cdb48b);border:7px solid TINTA;position:relative;overflow:hidden;perspective:900px}
.envol .giro{position:absolute;inset:0;animation:girar 3s linear infinite}
.envol.lat .giro{animation:none}
.etq-lat{position:absolute;top:38%;left:50%;width:200px;margin-left:-100px;height:90px;background:ROJO;color:white;font-family:Bebas;font-size:66px;display:flex;align-items:center;justify-content:center;border-radius:12px;animation:lateral 2.6s linear infinite}
@keyframes lateral{0%{transform:translateX(-260px) scaleX(.2);opacity:.2}50%{transform:translateX(0) scaleX(1);opacity:1}100%{transform:translateX(260px) scaleX(.2);opacity:.2}}
.etq-top{position:absolute;top:50%;left:50%;width:46%;height:46%;margin:-23% 0 0 -23%;background:NARANJA;border-radius:50%;font-family:Bebas;font-size:58px;display:flex;align-items:center;justify-content:center;color:TINTA}
.envol .brillo{position:absolute;left:18%;top:12%;width:30%;height:16%;border-radius:50%;background:rgba(255,255,255,.7);filter:blur(4px)}
.estrellas{position:absolute;inset:-200px;background-image:radial-gradient(2px 2px at 20px 30px,#fff,transparent),radial-gradient(2px 2px at 140px 90px,#fff,transparent),radial-gradient(3px 3px at 260px 200px,#ffd,transparent),radial-gradient(1px 1px at 330px 40px,#fff,transparent);background-size:400px 260px;animation:estrellas 8s linear infinite;opacity:.9}
.estrellas.e2{background-size:250px 170px;animation-duration:4s;opacity:.5}
@keyframes estrellas{to{transform:translateX(-400px)}}
.cohete{position:absolute;left:0;top:0;animation:cohete 3.6s ease-in-out var(--d) both}
@keyframes cohete{from{transform:translate(-300px,900px) rotate(0)}to{transform:translate(1500px,-100px) rotate(0)}}
.interroga{font-family:Bebas;font-size:520px;color:TINTA;opacity:.85}
.lupa{position:absolute;left:0;top:0;animation:lupa 3s ease-in-out var(--d) infinite}
@keyframes lupa{0%,100%{transform:translate(560px,300px)}50%{transform:translate(800px,520px)}}
.orbita{position:absolute;left:50%;top:50%;margin:-60px;animation:orbita var(--r) linear infinite;--rad:260px}
@keyframes orbita{from{transform:rotate(var(--a)) translateX(var(--rad)) rotate(calc(-1 * var(--a)))}to{transform:rotate(calc(var(--a) + 360deg)) translateX(var(--rad)) rotate(calc(-1 * var(--a) - 360deg))}}
.maquina{display:inline-block;overflow:hidden;white-space:nowrap;border-right:8px solid ROJO;animation:maquina 1.4s steps(18) var(--d) both}
@keyframes maquina{from{width:0}to{width:9.6em}}
.puntos{display:flex;gap:16px;margin-top:-20px}
.puntos i{width:26px;height:26px;border-radius:50%;background:TINTA;animation:lBob .9s ease-in-out infinite}
.puntos i:nth-child(2){animation-delay:.15s}.puntos i:nth-child(3){animation-delay:.3s}
.boton{position:relative;font-family:Plex;font-weight:700;font-size:80px;color:white;background:ROJO;padding:34px 90px;border-radius:24px;box-shadow:0 14px 0 #8f1726;animation:boton 3.4s ease both}
.boton .b2{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#606770;border-radius:24px;opacity:0;animation:suscrito 3.4s ease both}
@keyframes boton{0%,45%{transform:scale(1)}50%{transform:scale(.92)}58%,100%{transform:scale(1)}}
@keyframes suscrito{0%,50%{opacity:0}55%,100%{opacity:1}}
.raton{position:absolute;left:0;top:0;animation:raton 3.4s ease both}
@keyframes raton{0%{transform:translate(1700px,1000px)}45%{transform:translate(1010px,450px)}50%{transform:translate(1010px,450px) scale(.85)}58%,100%{transform:translate(1010px,450px)}}
.laser{position:absolute;top:0;bottom:0;width:10px;background:ROJO;box-shadow:0 0 40px 12px rgba(215,38,61,.7);animation:laser 1.4s ease-in-out .1s both;opacity:.9;z-index:4}
@keyframes laser{from{left:-20px}to{left:1940px}}
.viaje{position:absolute;left:0;top:0;offset-path:path('M440,860 C750,460 1150,460 1450,740');animation:viaje 2.4s ease-in-out var(--d) both}
@keyframes viaje{from{offset-distance:0%}to{offset-distance:100%}}
/* transiciones de entrada de escena */
.tr-slide{animation:trSlide .6s cubic-bezier(.7,0,.2,1) both}
.tr-zoom{animation:trZoom .6s cubic-bezier(.7,0,.2,1) both}
.tr-iris{animation:trIris .7s cubic-bezier(.7,0,.2,1) both}
.tr-wipe{animation:trWipe .6s cubic-bezier(.7,0,.2,1) both}
.tr-up{animation:trUp .6s cubic-bezier(.7,0,.2,1) both}
@keyframes trSlide{from{transform:translateX(100%)}to{transform:none}}
@keyframes trZoom{from{transform:scale(1.6);opacity:0;filter:blur(20px)}to{transform:none;opacity:1;filter:none}}
@keyframes trIris{from{clip-path:circle(0% at 50% 50%)}to{clip-path:circle(150% at 50% 50%)}}
@keyframes trWipe{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0 0 0 0)}}
@keyframes trUp{from{transform:translateY(100%)}to{transform:none}}
/* cámara */
.cam.c0{animation:c0 var(--dur) ease-in-out both}.cam.c1{animation:c1 var(--dur) ease-in-out both}.cam.c2{animation:c2 var(--dur) ease-in-out both}.cam.c3{animation:c3 var(--dur) ease-in-out both}
@keyframes c0{from{transform:scale(1)}to{transform:scale(1.08)}}
@keyframes c1{from{transform:scale(1.08)}to{transform:scale(1)}}
@keyframes c2{from{transform:scale(1.06) translateX(30px)}to{transform:scale(1.06) translateX(-30px)}}
@keyframes c3{from{transform:scale(1.04) translate(-20px,10px) rotate(-.6deg)}to{transform:scale(1.1) translate(20px,-10px) rotate(.6deg)}}
#grano{position:absolute;inset:0;z-index:900;pointer-events:none;opacity:.05;mix-blend-mode:multiply}
#marca{position:absolute;right:46px;top:36px;z-index:901;opacity:.8}
#barra{position:absolute;left:0;bottom:0;height:8px;background:NARANJA;z-index:902}
"""
for k, v in dict(KRAFT=KRAFT, TINTA=TINTA, ROJO=ROJO, NARANJA=NARANJA, HUESO=HUESO, GRIS=GRIS).items():
    CSS = CSS.replace(k, v)

JS = r"""
const DUR=__DUR__, TRANS=0.7;
let grano=null;
function hacerGrano(){const c=document.createElement('canvas');c.width=1920*1.0;c.height=1080;const x=c.getContext('2d');
  const im=x.createImageData(c.width,c.height);let s=12345;for(let i=0;i<im.data.length;i+=4){s=(s*1103515245+12345)&0x7fffffff;const v=s%255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}
  x.putImageData(im,0,0);return c.toDataURL();}
function setTime(t){
  for(let i=0;i<ESC.length;i++){
    const s=ESC[i], el=document.getElementById('e'+i);
    const vis = t>=s.a && t < s.b+TRANS;
    if(!vis){ if(el.style.display!=='none') el.style.display='none'; continue; }
    el.style.display='block'; el.style.zIndex=i+1;
    const local=(t-s.a)*1000;
    for(const a of el.getAnimations({subtree:true})){ a.pause(); a.currentTime=local; }
    for(const sp of el.querySelectorAll('.spr')){
      const n=+sp.dataset.n; if(n<2) continue;
      const f=Math.floor((t-s.a)*sp.dataset.fps)%n, c=+sp.dataset.cols, px=+sp.dataset.px;
      sp.style.backgroundPosition=`${-(f%c)*px}px ${-Math.floor(f/c)*px}px`;
    }
  }
  const g=document.getElementById('grano'); const k=Math.floor(t*6);
  g.style.backgroundPosition=`${(k*137)%400}px ${(k*251)%300}px`;
  document.getElementById('barra').style.width=(100*t/DUR)+'%';
}
document.getElementById('grano').style.backgroundImage=`url(${hacerGrano()})`;
"""

def main():
    trabajo, fuentes = sys.argv[1], sys.argv[2]
    global SPR
    SPR = json.load(open(os.path.join(trabajo, "sprites.json")))
    t = json.load(open(os.path.join(trabajo, "tiempos.json")))
    cat = escenas()
    trans = ["tr-slide", "tr-zoom", "tr-wipe", "tr-up", "tr-iris"]
    html, esc = [], []
    for i, e in enumerate(t["escenas"]):
        a, b = e["inicio"], e["fin"]
        tr = "tr-iris" if e["capitulo"] else ("" if i == 0 else trans[i % len(trans)])
        dur = b - a + 0.7
        html.append(f'<div class="escena {tr}" id="e{i}"><div class="cam c{i % 4}" style="--dur:{dur:.2f}s">{cat[e["nombre"]]}</div></div>')
        esc.append({"a": a, "b": b})
    pagina = (f"<!doctype html><html lang=es><head><meta charset=utf-8><style>{CSS.replace('FUENTES', 'file://' + os.path.abspath(fuentes))}</style></head>"
              f"<body>{''.join(html)}<div id='grano'></div><div id='marca'>{barras(34)}</div><div id='barra'></div>"
              f"<script>const ESC={json.dumps(esc)};{JS.replace('__DUR__', str(t['duracion']))}setTime(0);</script></body></html>")
    open(os.path.join(trabajo, "timeline.html"), "w").write(pagina)
    print(len(esc), "escenas")

if __name__ == "__main__":
    main()
