"""Escenas del vídeo 8 (Nintendo). Motor común; sin logotipos ni personajes con derechos: cartas y objetos genéricos."""
from base import *

CAP_ICONOS = {1: "1f3b4", 2: "1f9d1-200d-1f393", 3: "1f3b2", 4: "1f9be", 5: "1f3ae", 6: "1f9e0"}

def carta(px=200, flor="#D7263D", d=0.0, rot=0):
    return (f'<svg width="{px}" height="{px*1.6:.0f}" viewBox="0 0 100 160" style="transform:rotate({rot}deg)"><rect x="4" y="4" width="92" height="152" rx="8" fill="{HUESO}" stroke="{TINTA}" stroke-width="4"/>'
            + "".join(f'<ellipse cx="50" cy="62" rx="9" ry="22" fill="{flor}" transform="rotate({i*72} 50 80)"/>' for i in range(5))
            + f'<circle cx="50" cy="80" r="9" fill="#FFD23F"/><rect x="14" y="120" width="72" height="22" rx="4" fill="{TINTA}"/></svg>')

def escenas():
    E = {}
    E["n_consolas"] = f'''{F("", True)}{"".join(obj(spr(c, 200), x, 42, "pop", "bob", .2 + i * .3) for i, (c, x) in enumerate([("1f3ae", 18), ("1f579-fe0f", 39), ("1f5e1-fe0f", 61), ("1f3b4", 82)]))}
      {txt(kt("CONSOLAS, AVENTURAS, *PERSONAJES*", "xl", 1.2), 50, 78, 90)}'''
    E["n_famosa"] = titular("LA MÁS *FAMOSA*", "de los videojuegos, probablemente", "", ("1f3ae", "1f451", "2b50", "1f30d"))
    E["n_sin_luz"] = f'''{F("sepia", True)}{"".join(obj(spr(c, 190), x, 40, "pop", "", .2 + i * .5) for i, (c, x) in enumerate([("1f3ae", 22), ("1f4fa", 50), ("1f4a1", 78)]))}
      {"".join(txt('<div class="equis">✕</div>', x, 40, 10, "center", .5 + i * .5, "pop") for i, x in enumerate([22, 50, 78]))}
      {txt(kt("cuando nació, *NADA DE ESTO* existía", "xl", 1.8), 50, 78, 90)}<div class="viñeta"></div>'''
    E["n_100"] = cifra("+100 AÑOS", "DE HISTORIA ANTES DE MARIO", "23f3")
    E["n_rarezas"] = lista([("1f3b4", "cartas"), ("1f695", "taxis"), ("1f35a", "arroz instantáneo")], "Y EN ESE SIGLO…")
    E["n_kioto"] = fecha("23", "SEPTIEMBRE", "1889", "Kioto, Japón", "1f1ef-1f1f5")
    E["n_hanafuda"] = f'''{F("sepia")}{obj(carta(170, ROJO, 0, -12), 18, 50, "drop", "bob", .2)}{obj(carta(170, "#c2185b", 0, 0), 32, 46, "drop", "bob", .5)}{obj(carta(170, NARANJA, 0, 12), 46, 50, "drop", "bob", .8)}
      {txt(kt("*HANAFUDA*", "mega", .6, .12, "slam"), 76, 40, 44)}{txt(kt("cartas japonesas decoradas con flores", "l", 1.3), 76, 58, 44)}{txt(kt("Fusajiro Yamauchi", "m gris", 1.9), 76, 72, 44)}<div class="viñeta"></div>'''
    E["n_nombre"] = f'''{F("", True)}{obj(spr("1f340", 220), 22, 40, "pop", "spin-slow", .2)}{obj(spr("2601-fe0f", 200), 22, 66, "pop", "float", .6)}
      {txt(kt("«DEJA LA SUERTE", "xl", .5), 64, 38, 60)}{txt(kt("*EN MANOS DEL CIELO*»", "xl", 1.0), 64, 54, 60)}{txt(kt("la traducción más habitual", "l gris", 1.7), 64, 70, 60)}'''
    E["n_misterio"] = icono_texto("1f914", "NUNCA SE HA *ACLARADO DEL TODO*", "el significado exacto", "", "der", "", False, "pop", "swing")
    E["n_populares"] = f'''{F()}{"".join(obj(carta(120, [ROJO, "#c2185b", NARANJA, VERDE][i % 4], 0, (i % 3 - 1) * 10), 12 + i * 11, 42 + (i % 2) * 8, "drop", "", .1 + i * .12) for i in range(8))}
      {txt(kt("DURANTE DÉCADAS, *SU NEGOCIO*", "xl", 1.2), 50, 82, 90)}'''
    E["n_derrame"] = anio(1900, 1949, "el presidente sufre un derrame cerebral", "1f3e5")
    E["n_hiroshi"] = icono_texto("1f9d1-200d-1f393", "HIROSHI *YAMAUCHI*", "deja Derecho para ponerse al frente", "llama a su nieto:", "izq", "", True, "up", "bob", 360, (("1f4da", 86, 80),))
    E["n_22"] = cifra("22 AÑOS", "Y AL FRENTE DE LA EMPRESA", "1f62e", "tenía")
    E["n_viaje"] = flecha("1f1ef-1f1f5", "1f1fa-1f1f8", "VISITA AL *LÍDER MUNDIAL*", "el mayor fabricante de naipes del mundo")
    E["n_modesta"] = icono_texto("1f3e2", "UNA OFICINA *MODESTA*", "", "y se lleva una sorpresa:", "der", "", True, "zoom", "", 300)
    E["n_techo"] = impacto("vendiendo solo cartas", "NUNCA LLEGARÍA *LEJOS*", "", "1f3b4")
    E["n_suerte"] = titular("PROBAR *SUERTE*", "en otros negocios", "", ("1f3b2", "1f340", "1f3b0", "2728"))
    E["n_taxi"] = f'''{F("", True)}<div class="carrera" style="--d:.1s">{spr("1f695", 300)}</div>{txt(kt("UNA EMPRESA *DE TAXIS*", "mega", .5, .12, "slam"), 50, 34, 90)}'''
    E["n_arroz"] = icono_texto("1f35a", "ARROZ *INSTANTÁNEO*", "", "", "izq", "calido", True, "drop", "bob", 380, (("23f1-fe0f", 86, 78),))
    E["n_fracaso"] = f'''{F("dark", True)}{obj(spr("1f695", 200), 28, 40, "none", "fuera", .3)}{obj(spr("1f35a", 200), 50, 40, "none", "fuera", .5)}{obj(spr("1f4c9", 200), 72, 40, "pop", "shake", .9)}
      {txt(kt("LA MAYORÍA *FRACASARON*", "xl hueso", 1.0), 50, 76, 90)}'''
    E["n_delicada"] = impacto("la empresa llegó a estar", "MUY *DELICADA*", "", "26a0-fe0f")
    E["n_juguetes"] = icono_texto("1f9f8", "PERO ALGO FUNCIONABA: *JUGUETES*", "", "", "der", "calido", True, "pop", "bob", 360, (("2728", 14, 22),))
    E["n_brazo"] = f'''{F("", True)}{obj(spr("1f9be", 300), 30, 46, "left", "reach", .2)}{txt(kt("UN BRAZO *EXTENSIBLE*", "xl", .7), 70, 40, 52)}{txt(kt("hecho por un empleado de mantenimiento", "l", 1.4), 70, 58, 52)}'''
    E["n_yokoi"] = icono_texto("1f9d1-200d-1f527", "GUNPEI *YOKOI*", "", "se llamaba:", "izq", "", True, "pop", "bob", 360, (("1f527", 86, 78),))
    E["n_ultrahand"] = f'''{F("calido", True)}{obj(spr("1f9be", 260), 26, 44, "zoom", "reach", .2)}{txt(kt("ULTRA *HAND*", "mega", .6, .12, "slam"), 66, 40, 60)}
      {txt(kt("y se vendió muy bien", "l", 1.4), 66, 58, 60)}{obj(spr("1f4c8", 160), 86, 80, "pop", "bob", 1.8)}'''
    E["n_gameboy"] = flecha("1f527", "1f3ae", "DE MANTENIMIENTO A *INVENTOR*", "Game & Watch · Game Boy")
    E["n_camino"] = titular("EL *ENTRETENIMIENTO*", "Nintendo había encontrado su camino", "", ("1f3ae", "1f9f8", "1f3b4", "2b50"))
    E["n_donkey"] = anio(1900, 1981, "la máquina recreativa Donkey Kong", "1f98d")
    E["n_jumpman"] = f'''{F("", True)}{obj(spr("1f468", 240), 26, 44, "pop", "jump", .2)}{obj(spr("1f6e2-fe0f", 150), 44, 70, "left", "", .6)}
      {txt(kt("NO SE LLAMABA MARIO:", "l", .6), 68, 34, 54)}{txt(kt("*JUMPMAN*", "mega", 1.1, .12, "slam"), 68, 52, 54)}'''
    E["n_segale"] = icono_texto("1f3ed", "MARIO *SEGALE*", "el dueño del almacén que alquilaba Nintendo en EE. UU.", "el nombre viene de", "izq", "", True, "zoom", "", 340, (("1f1fa-1f1f8", 86, 22),))
    E["n_miyamoto"] = icono_texto("1f468-200d-1f3a8", "CONFIRMADO POR *SU CREADOR*", "Shigeru Miyamoto", "", "der", "", True, "pop", "bob", 340, (("2705", 14, 80),))
    E["n_famicom"] = f'''{F("", True)}{obj(spr("1f3ae", 300), 28, 46, "zoom", "pulse", .2)}{txt(kt("1983", "xl gris", .4), 68, 26, 56)}{txt(kt("*FAMICOM*", "mega", .6, .12, "slam"), 68, 42, 56)}{txt(kt("en Occidente, la NES", "l", 1.4), 68, 58, 56)}'''
    E["n_historia"] = f'''{F("calido", True)}{obj(carta(200, ROJO), 24, 46, "flip", "bob", .2)}{txt('<div class="vs" style="--d:.8s">→</div>', 46, 46, 10)}{obj(spr("1f3ae", 260), 66, 46, "zoom", "bob", 1.1)}
      {txt(kt("CAMBIÓ LA HISTORIA DE *LOS VIDEOJUEGOS*", "xl", 1.5), 50, 82, 90)}'''
    E["leccion1"] = leccion(1, "ver de cerca al líder", "TU MERCADO *SE TE QUEDA PEQUEÑO*", "1f50d")
    E["leccion2"] = leccion(2, "fracasar en muchas cosas", "NO IMPORTA *SI SIGUES BUSCANDO*", "1f3b2")
    E["leccion3"] = leccion(3, "las buenas ideas vienen", "DE *CUALQUIER PARTE*", "1f4a1")
    E["n_final"] = lista([("1f3b4", "cartas"), ("1f695", "taxis"), ("1f35a", "arroz"), ("1f3ae", "videojuegos")], "TODO ESO ES NINTENDO")
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:130px;transform:rotate(-12deg)">{carta(230, ROJO)}</div>
      <div style="position:absolute;left:220px;top:160px;transform:rotate(8deg)">{carta(230, "#c2185b")}</div>
      <div style="position:absolute;left:140px;top:470px">{vicon("video-game", 170)}</div>
      <div class="big" style="top:100px"><div class="s">NINTENDO ANTES DE MARIO</div><div class="q" style="font-size:135px;margin-top:22px">VENDÍA CARTAS</div><div class="y">100 AÑOS DE HISTORIA</div></div>'''
