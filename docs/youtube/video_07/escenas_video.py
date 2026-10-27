"""Escenas del vídeo 7 (Zara). Motor común; sin logotipos: prendas y escaparates genéricos."""
from base import *

CAP_ICONOS = {1: "1f9f5", 2: "23f1-fe0f", 3: "1f30d", 4: "2696-fe0f", 5: "1f9e0"}

def escaparate(px=520, prendas=("1f457", "1f455", "1f9e5"), d=0.0):
    return (f'<div style="position:relative;width:{px}px;height:{px*0.7:.0f}px;background:#fff;border:10px solid {TINTA};border-radius:12px;'
            f'box-shadow:12px 12px 0 rgba(0,0,0,.15);display:flex;align-items:center;justify-content:space-around">'
            + "".join(f'<div class="mv e-drop" style="--d:{d + i*.25:.2f}s">{spr(c, px // 4)}</div>' for i, c in enumerate(prendas)) + '</div>')

def escenas():
    E = {}
    E["z_ropa"] = f'''{F("", True)}{obj(spr("1f455", 220), 20, 40, "drop", "bob", .1)}{obj(spr("1f457", 240), 40, 34, "drop", "bob", .3)}{obj(spr("1f456", 220), 60, 40, "drop", "bob", .5)}{obj(spr("1f9e5", 220), 80, 34, "drop", "bob", .7)}
      {txt(kt("ES MUY PROBABLE QUE LLEVES *ALGO DE ZARA*", "xl", 1.0), 50, 78, 90)}'''
    E["z_mundo"] = icono_texto("1f30d", "UNA DE LAS MÁS *GRANDES DEL MUNDO*", "tiendas en los cinco continentes", "", "izq", "", True, "zoom", "spin-slow", 360, (("1f6cd-fe0f", 86, 80),))
    E["z_coruna"] = anio(1900, 1975, "mayo · una calle de A Coruña", "1f1ea-1f1f8")
    E["z_velocidad"] = impacto("la clave no es lo que vende:", "ES LA *VELOCIDAD*", "", "23f1-fe0f")
    E["z_ortega"] = icono_texto("1f468-200d-1f4bc", "AMANCIO *ORTEGA*", "el fundador", "", "izq", "", True, "up", "bob")
    E["z_textil"] = f'''{F("sepia")}{obj(spr("1f9f5", 200), 20, 40, "pop", "spin-slow", .2)}{obj(spr("1faa1", 200), 38, 52, "pop", "swing", .5)}{obj(spr("2702-fe0f", 200), 22, 70, "pop", "bob", .8)}
      {txt(kt("AÑOS EN EL *NEGOCIO TEXTIL*", "xl", .6), 68, 42, 56)}{txt(kt("fabricando prendas", "l", 1.2), 68, 58, 56)}<div class="viñeta"></div>'''
    E["z_1975"] = f'''{F("calido", True)}{obj(escaparate(560), 34, 50, "zoom", "", .1)}{txt(kt("LA PRIMERA *TIENDA*", "xl", .8), 76, 36, 44)}
      {txt(kt("calle Juan Flórez, A Coruña", "l", 1.4), 76, 54, 44)}{txt(kt("1975", "mega rojo", 1.8, .1, "slam"), 76, 74, 40)}'''
    E["z_idea"] = comparar("1f457", "ropa que sigue las tendencias", "1f4b6", "a precios asequibles", "+", "LA IDEA")
    E["z_inditex"] = cifra("1985", "NACE INDITEX", "1f3e2", "diez años después:")
    E["z_diferente"] = impacto("¿qué hace diferente", "A *ZARA*?", "", "1f914")
    E["z_meses"] = f'''{F()}{"".join(txt(f'<div class="calendario" style="--d:{.1 + i*.15:.2f}s"><div class="cal-mes">{m}</div><div class="cal-dia">·</div></div>', 12 + i * 15.2, 40, 14) for i, m in enumerate(["ENE", "MAR", "MAY", "JUL", "SEP", "NOV"]))}
      {txt(kt("las demás: colecciones con *muchos meses* de antelación", "xl", 1.2), 50, 78, 90)}'''
    E["z_control"] = f'''{F("", True)}{obj(spr("270f-fe0f", 170), 14, 44, "pop", "bob", .2)}{obj(spr("1f3ed", 170), 38, 44, "pop", "bob", .6)}{obj(spr("1f69a", 170), 62, 44, "pop", "bob", 1.0)}{obj(spr("1f6cd-fe0f", 170), 86, 44, "pop", "bob", 1.4)}
      <svg class="pos" style="left:50%;top:44%" width="1500" height="40" viewBox="0 0 1500 40"><path class="draw" style="--d:.4s;--len:1500" d="M150,20 L1350,20" stroke="{ROJO}" stroke-width="8" stroke-dasharray="20 14"/></svg>
      {txt(kt("del diseño a la tienda: *REACCIONAR RÁPIDO*", "xl", 1.6), 50, 76, 90)}'''
    E["z_vende"] = comparar("1f4c8", "¿se vende? se fabrica más", "1f504", "¿no? se retira y se prueba otra", "/")
    E["z_frecuencia"] = f'''{F()}{obj(escaparate(480, ("1f457", "1f45a", "1f9e3")), 30, 48, "pop", "", .1)}{obj(spr("23f3", 180), 66, 30, "pop", "swing", .8)}
      {txt(kt("HOY ESTÁ… *EN UNAS SEMANAS*, NO", "xl", 1.0), 72, 62, 50)}'''
    E["z_fastfashion"] = f'''{F("", True)}{obj(spr("1f4f0", 220), 20, 48, "pop", "bob", .2)}{txt(kt("«FAST *FASHION*»", "mega", .5, .15, "slam"), 62, 40, 70)}
      {txt(kt("New York Times, 1989, sobre Zara", "l", 1.3), 62, 60, 70)}{txt(kt("moda rápida", "l gris", 1.8), 62, 72, 70)}'''
    E["z_oporto"] = flecha("1f1ea-1f1f8", "1f1f5-1f1f9", "1988: *OPORTO*", "su primera tienda fuera de España")
    E["z_ciudades"] = lista([("1f5fd", "Nueva York"), ("1f1eb-1f1f7", "París"), ("1f30d", "el mundo")], "DESPUÉS LLEGARÍAN…")
    E["z_bolsa"] = cifra("≈2.400 M€", "SALIDA A BOLSA (2001)", "1f4c8", "Inditex consigue unos")
    E["z_rico"] = icono_texto("1f4b0", "UNO DE LOS MÁS *RICOS DEL PLANETA*", "", "Amancio Ortega:", "der", "calido", True, "zoom", "glow")
    E["z_discreto"] = icono_texto("1f92b", "MUY *DISCRETO*", "apenas concedía entrevistas", "", "izq", "", False, "pop", "bob")
    E["z_criticas"] = impacto("la moda rápida también tiene", "*CRÍTICAS*", "", "2696-fe0f")
    E["z_impacto"] = comparar("1f30d", "impacto en el medio ambiente", "1f9d1-200d-1f3ed", "condiciones de trabajo", "?", "TANTA ROPA, TAN DEPRISA…")
    E["z_debate"] = icono_texto("267b-fe0f", "COMPROMISOS DE *SOSTENIBILIDAD*", "un debate de todo el sector", "", "der", "", True, "spin", "spin-slow")
    E["z_otracara"] = titular("LA *OTRA CARA*", "de un modelo que cambió cómo vestimos", "", ("2696-fe0f", "1f457", "1f30d", "1f914"))
    E["leccion1"] = leccion(1, "más poderosa que el precio:", "LA *VELOCIDAD*", "23f1-fe0f")
    E["leccion2"] = leccion(2, "escuchar lo que se vende de verdad", "VALE MÁS QUE *ADIVINAR*", "1f442")
    E["leccion3"] = leccion(3, "una gran empresa puede nacer", "EN *CUALQUIER ESQUINA*", "1f3ea")
    E["z_final"] = f'''{F("calido", True)}{obj(escaparate(500), 30, 48, "zoom", "", .1)}{obj(spr("23f1-fe0f", 180), 74, 28, "pop", "swing", .8)}
      {txt(kt("UNA CARRERA CONTRA *EL RELOJ*", "xl", 1.0), 72, 58, 50)}{txt(kt("desde 1975", "l", 1.6), 72, 74, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:120px">{vicon("dress", 260)}</div>
      <div style="position:absolute;left:250px;top:300px">{vicon("stopwatch", 200)}</div>
      <div class="big" style="top:110px"><div class="s">DE A CORUÑA</div><div class="q" style="font-size:190px;margin-top:22px">AL MUNDO</div><div class="y">EL SECRETO DE ZARA</div></div>'''
