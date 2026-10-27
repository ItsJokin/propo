"""Escenas del vídeo 36 (Lacoste, formato largo). Motor común; sin logotipos: polos genéricos dibujados y el cocodrilo de Fluent Emoji."""
from base import *

CAP_ICONOS = {1: "1f1eb-1f1f7", 2: "1f93a", 3: "1f9f3", 4: "1f9f5", 5: "1f455", 6: "1f3ed", 7: "1f3be", 8: "26f3",
              9: "1f6b6", 10: "1f3f7-fe0f", 11: "1f46a", 12: "1f405", 13: "1f9e0"}

def polo(px=320, color="#FAF7F0", manga="corta"):
    m = ('<path d="M40,40 L8,70 L24,96 L48,80Z" fill="{c}" stroke="#151515" stroke-width="4"/><path d="M160,40 L192,70 L176,96 L152,80Z" fill="{c}" stroke="#151515" stroke-width="4"/>' if manga == "corta"
         else '<path d="M40,40 L4,150 L26,156 L50,84Z" fill="{c}" stroke="#151515" stroke-width="4"/><path d="M160,40 L196,150 L174,156 L150,84Z" fill="{c}" stroke="#151515" stroke-width="4"/>').format(c=color)
    puntos = "".join(f'<circle cx="{60 + (i % 9) * 10}" cy="{110 + (i // 9) * 12}" r="1.6" fill="#c8c2b2"/>' for i in range(54))
    return (f'<svg width="{px}" height="{px:.0f}" viewBox="0 0 200 200">{m}<path d="M40,40 L80,28 Q100,40 120,28 L160,40 L154,190 L46,190Z" fill="{color}" stroke="{TINTA}" stroke-width="4"/>{puntos}'
            f'<path d="M80,28 L100,58 L120,28" fill="none" stroke="{TINTA}" stroke-width="4"/><path d="M78,26 L64,44 L92,52Z M122,26 L136,44 L108,52Z" fill="{color}" stroke="{TINTA}" stroke-width="3"/>'
            f'<line x1="100" y1="58" x2="100" y2="88" stroke="{TINTA}" stroke-width="3"/><circle cx="100" cy="68" r="3" fill="{TINTA}"/><circle cx="100" cy="80" r="3" fill="{TINTA}"/></svg>')

def polo_croc(px=320, color="#FAF7F0", d=0.6):
    return f'<div style="position:relative">{polo(px, color)}<div style="position:absolute;left:{px*0.6:.0f}px;top:{px*0.42:.0f}px">{spr("1f40a", int(px*0.18))}</div></div>'

def escenas():
    E = {}
    E["la_polo"] = f'''{F("", True)}{obj(polo_croc(380), 30, 50, "drop", "float", .2)}{txt(kt("UN POLO CON UN *PEQUEÑO COCODRILO*", "xl", .9), 70, 46, 52)}'''
    E["la_reconocible"] = titular("DE LAS MÁS *RECONOCIBLES*", "del mundo de la ropa", "", ("1f455", "1f40a", "1f30d", "2728"), "", True, "xl")
    E["la_tenista"] = comparar("1f3a8", "no un diseñador de moda", "1f3be", "un tenista", "≠")
    E["la_maleta"] = icono_texto("1f9f3", "UNA APUESTA *POR UNA MALETA*", "de piel, según se cuenta", "su apodo:", "izq", "calido", True, "pop", "bob")
    E["la_camiseta"] = comparar("1f3be", "en las pistas", "1f6b6", "y fuera de ellas", "+", "UNA CAMISETA QUE LO CAMBIÓ TODO")
    E["la_historia"] = titular("LA HISTORIA DE *LACOSTE*", "", "", ("1f455", "1f40a", "1f3be", "1f9f3"), "", True, "xl")
    E["la_paris"] = f'''{F("sepia", True)}{obj(spr("1f5fc", 260), 24, 50, "drop", "bob", .2)}{txt(kt("PARÍS, 1904", "mega", .4, .12, "slam"), 64, 40, 60)}{txt(kt("René Lacoste, de familia acomodada", "l", 1.2), 64, 58, 60)}<div class="viñeta"></div>'''
    E["la_inglaterra"] = flecha("1f1eb-1f1f7", "1f1ec-1f1e7", "DESCUBRE EL TENIS *EN INGLATERRA*", "de adolescente, según sus biografías")
    E["la_metodico"] = lista([("1f4cf", "metódico"), ("1f9d0", "obsesivo"), ("1f9e0", "muy inteligente")], "NI EL MÁS FUERTE, NI EL MÁS RÁPIDO")
    E["la_libreta"] = icono_texto("1f4d3", "UNA LIBRETA *CON SUS RIVALES*", "y sus puntos débiles", "", "izq", "", False, "pop", "bob")
    E["la_maquina"] = impacto("en la pista apenas fallaba:", "«LA *MÁQUINA*»", "", "2699-fe0f")
    E["la_generacion"] = impacto("años veinte:", "UNA GENERACIÓN *EXTRAORDINARIA*", "", "1f1eb-1f1f7")
    E["la_mosqueteros"] = lista([("1f3be", "Lacoste"), ("1f3be", "Cochet"), ("1f3be", "Borotra"), ("1f3be", "Brugnon")], "LOS CUATRO MOSQUETEROS")
    E["la_davis"] = cifra("1927", "GANAN LA COPA DAVIS A EE. UU., EN SU PAÍS", "1f3c6")
    E["la_seis"] = icono_texto("1f3c6", "SEIS AÑOS *SEGUIDOS*", "la Copa Davis, en Francia", "", "der", "", True, "pop", "bob")
    E["la_rolandgarros"] = icono_texto("1f3df-fe0f", "SE LEVANTA *ROLAND GARROS*", "un estadio digno de aquellas finales", "París", "izq", "calido", False, "pop", "bob")
    E["la_numero1"] = lista([("1f3c6", "7 grandes torneos"), ("1f33f", "2 Wimbledon"), ("1f947", "número 1 del mundo")], "RENÉ LACOSTE")
    E["la_cocodrilo"] = impacto("¿y el", "*COCODRILO*?", "", "1f40a")
    E["la_viaje"] = icono_texto("1f1fa-1f1f8", "UN VIAJE *A ESTADOS UNIDOS*", "con el equipo francés", "según la propia marca", "der", "", False, "pop", "bob")
    E["la_escaparate"] = f'''{F()}<div class="pos" style="left:30%;top:48%;width:440px;height:360px;background:#dff1f7;border:8px solid {TINTA};box-shadow:10px 10px 0 rgba(0,0,0,.15)"></div>{obj(spr("1f9f3", 240), 30, 52, "pop", "glow", .3)}{txt(kt("UNA MALETA *DE COCODRILO*", "xl", .8), 72, 42, 50)}{txt(kt("o de caimán, según la versión", "l", 1.4), 72, 58, 50)}'''
    E["la_promesa"] = bocadillos("1f9d4", ["Si ganas…", "…la maleta es tuya"], "la promesa del capitán")
    E["la_apodo"] = comparar("1f1fa-1f1f8", "«el caimán»", "1f1eb-1f1f7", "«el cocodrilo»", "→", "EL APODO")
    E["la_tenaz"] = icono_texto("1f40a", "TENAZ, *SIN SOLTAR A SU PRESA*", "así jugaba, según él mismo", "", "izq", "", True, "pop", "bob")
    E["la_george"] = icono_texto("270f-fe0f", "ROBERT GEORGE *LE DIBUJA UN COCODRILO*", "un amigo", "", "der", "", False, "pop", "bob")
    E["la_bordado"] = f'''{F("calido", True)}{obj(spr("1f9f5", 200), 24, 48, "pop", "spin-slow", .2)}{obj(spr("1f40a", 200), 46, 52, "zoom", "bob", .7)}{txt(kt("BORDADO *EN LA CHAQUETA*", "xl", 1.0), 74, 46, 46)}'''
    E["la_sena"] = icono_texto("1f440", "«EL DEL *COCODRILO*»", "su seña de identidad", "", "izq", "", False, "pop", "bob")
    E["la_escudo"] = comparar("1f6e1-fe0f", "el escudo de un caballero", "1f40a", "el emblema de René", "=")
    E["la_visible"] = titular("UN LOGOTIPO *VISIBLE POR FUERA*", "de los primeros en la ropa", "sin saberlo…", ("1f455", "1f40a", "1f441-fe0f", "2728"), "", True, "xl")
    E["la_camisas"] = f'''{F("sepia", True)}{obj(polo(300, "#ffffff", "larga"), 28, 50, "drop", "", .2)}{txt(kt("MANGA LARGA *Y ALMIDONADA*", "xl", .8), 70, 42, 54)}{txt(kt("así jugaban los tenistas", "l", 1.4), 70, 58, 54)}<div class="viñeta"></div>'''
    E["la_incomodas"] = lista([("1f975", "calor"), ("1f4a6", "sudor pegado"), ("1f449", "remangar")], "ELEGANTES… PERO INCÓMODAS")
    E["la_disena"] = impacto("René diseña", "SU PROPIA *CAMISETA*", "", "270f-fe0f")
    E["la_pique"] = f'''{F()}{obj(polo(320), 28, 50, "pop", "", .2)}{txt(kt("MANGA CORTA, *PETIT PIQUÉ*", "xl", .8), 70, 42, 54)}{txt(kt("algodón de punto que transpira", "l", 1.4), 70, 58, 54)}'''
    E["la_cuello"] = lista([("2600-fe0f", "cuello contra el sol"), ("1f456", "espalda más larga")], "DETALLES PRÁCTICOS")
    E["la_estreno"] = cifra("1926", "LA ESTRENA EN EL CAMPEONATO DE EE. UU.", "1f3be", "según la propia marca")
    E["la_atencion"] = lista([("1fab6", "cómoda"), ("1f388", "ligera"), ("1f44d", "práctica")], "LLAMA LA ATENCIÓN")
    E["la_salud"] = icono_texto("1f912", "DEJA LA COMPETICIÓN", "por problemas de salud", "finales de los años 20", "izq", "", False, "pop", "")
    E["la_noolvida"] = icono_texto("1f455", "PERO NO OLVIDA *SU CAMISETA*", "", "", "der", "", False, "pop", "bob")
    E["la_gillier"] = comparar("1f3be", "René Lacoste", "1f3ed", "André Gillier, tejidos de punto", "+", "1933")
    E["la_fabricar"] = f'''{F("calido", True)}{"".join(obj(polo_croc(170, c), 20 + i * 20, 50, "pop", "bob", .2 + i * .2) for i, c in enumerate(["#FAF7F0", "#2E6BD6", "#D7263D", "#2BB673", "#151515"]))}{txt(kt("A LA VENTA, *CON EL COCODRILO*", "xl", 1.3), 50, 84, 90)}'''
    E["la_todos"] = lista([("1f3be", "tenistas"), ("26f3", "golfistas"), ("26f5", "navegantes"), ("1f465", "todo el mundo")], "")
    E["la_inventor"] = impacto("René no solo inventó", "UNA *CAMISETA*", "", "1f4a1")
    E["la_lanzapelotas"] = icono_texto("1f3be", "UNA MÁQUINA *LANZAPELOTAS*", "para entrenar sin compañero, según la marca", "", "izq", "", False, "pop", "bob")
    E["la_acero"] = comparar("1fab5", "raquetas de madera", "1f529", "su raqueta de acero", "→")
    E["la_setenta"] = icono_texto("1f3c6", "AÑOS 70: *MUY POPULAR*", "grandes torneos ganados con ella", "", "der", "", True, "pop", "bob")
    E["la_ingeniero"] = comparar("1f3be", "un tenista", "2699-fe0f", "con alma de ingeniero", "+")
    E["la_simone"] = icono_texto("26f3", "SIMONE *THION DE LA CHAUME*", "una de las mejores golfistas de Francia", "su mujer", "izq", "", False, "pop", "bob")
    E["la_catherine"] = icono_texto("1f467", "SU HIJA *CATHERINE*", "heredó el talento de los dos", "", "der", "", False, "up", "bob")
    E["la_1967"] = cifra("1967", "CATHERINE GANA EL ABIERTO DE EE. UU. DE GOLF", "26f3", "con 22 años")
    E["la_aficionada"] = titular("LA ÚNICA *AFICIONADA*", "que lo ha ganado", "", ("26f3", "1f3c6", "1f947", "2728"))
    E["la_familia"] = icono_texto("1f46a", "GANAR, *CASI UNA COSTUMBRE*", "", "", "izq", "calido", True, "pop", "bob")
    E["la_atlantico"] = flecha("1f1eb-1f1f7", "1f1fa-1f1f8", "EL COCODRILO *CRUZA EL ATLÁNTICO*", "años cincuenta")
    E["la_universidades"] = icono_texto("1f393", "UNIFORME DE *UNIVERSIDADES EXCLUSIVAS*", "elegante y deportivo", "", "izq", "", False, "pop", "bob")
    E["la_ochenta"] = icono_texto("1f1ea-1f1f8", "ESPAÑA, AÑOS 80: *CASI UN UNIFORME*", "de cierta juventud acomodada", "", "der", "", False, "pop", "bob")
    E["la_copias"] = f'''{F()}{obj(spr("1f40a", 220), 30, 46, "left", "bob", .2)}{obj(f'<div style="transform:scaleX(-1)">{spr("1f40a", 220)}</div>', 70, 46, "right", "bob", .6)}{txt('<div class="vs" style="--d:1s">≠</div>', 50, 46, 16)}{txt(kt("COCODRILOS FALSOS, *ALGUNOS DEL REVÉS*", "xl", 1.3), 50, 82, 90)}'''
    E["la_muere"] = cifra("1996", "MUERE RENÉ LACOSTE, CON 92 AÑOS", "1f56f-fe0f")
    E["la_peligro"] = impacto("el éxito también tuvo", "UN LADO *PELIGROSO*", "", "26a0-fe0f")
    E["la_licencia"] = icono_texto("1f1fa-1f1f8", "EN EE. UU., *UNA LICENCIA*", "una empresa local fabricaba y vendía", "", "izq", "", False, "pop", "bob")
    E["la_barato"] = icono_texto("1f4c9", "TANTAS PRENDAS, *TAN BARATAS*", "que pierde prestigio", "finales de los 70 y los 80", "der", "", False, "pop", "")
    E["la_descuento"] = comparar("1f48e", "lo exclusivo", "1f6d2", "se vuelve corriente", "→")
    E["la_recupera"] = lista([("1f4c9", "menos prendas"), ("1f4b6", "más caras"), ("2728", "más cuidadas")], "AÑOS 90: RECONSTRUIR LA IMAGEN")
    E["la_asia"] = comparar("1f40a", "Lacoste", "1f40a", "una marca de Singapur", "VS", "DÉCADAS DE DISPUTAS EN ASIA")
    E["la_defender"] = titular("DEFENDER UN COCODRILO: *TRABAJO A TIEMPO COMPLETO*", "", "", ("2696-fe0f", "1f40a", "1f6e1-fe0f", "1f4dc"), "", True, "xl")
    E["la_familiar"] = icono_texto("1f46a", "UNA EMPRESA *FAMILIAR*", "durante décadas", "", "izq", "", False, "pop", "bob")
    E["la_disputa"] = comparar("1f468-200d-1f4bc", "Michel Lacoste, el padre", "1f469-200d-1f4bc", "Sophie, su hija", "VS", "2012: LA FAMILIA SE DIVIDE")
    E["la_maus"] = icono_texto("1f1e8-1f1ed", "MAUS FRÈRES *SE QUEDA CON TODO*", "el grupo suizo que ya era socio", "un final inesperado", "der", "", False, "pop", "bob")
    E["la_millones"] = cifra("~1.000 M€", "EL VALOR DE LA MARCA, SEGÚN LA PRENSA", "1f4b6")
    E["la_deja"] = impacto("", "EL COCODRILO *DEJA A LOS LACOSTE*", "", "1f40a")
    E["la_quita"] = impacto("2018: lo impensable", "¡QUITA EL *COCODRILO*!", "", "1f40a")
    E["la_diez"] = lista([("1f405", "tigre de Sumatra"), ("1f985", "cóndor de California"), ("1f42c", "vaquita"), ("1f98e", "iguana")], "10 ESPECIES EN PELIGRO")
    E["la_ejemplares"] = comparar("1f455", "polos fabricados", "1f43e", "ejemplares en libertad", "=")
    E["la_vaquita"] = f'''{F("", True)}{obj(spr("1f42c", 200), 28, 40, "pop", "bob", .2)}{txt(kt("30", "mega rojo", .5, .12, "slam"), 28, 70, 30)}{obj(spr("1f985", 200), 72, 40, "pop", "bob", .8)}{txt(kt("231", "mega rojo", 1.1, .12, "slam"), 72, 70, 30)}'''
    E["la_agotan"] = icono_texto("1f30d", "AGOTADOS *ENSEGUIDA*", "el dinero, para la conservación", "", "der", "", True, "pop", "bob")
    E["leccion1"] = leccion(1, "los mejores productos nacen de", "*UN PROBLEMA REAL*", "1f455")
    E["leccion2"] = leccion(2, "una historia personal puede ser", "*EL MEJOR LOGOTIPO*", "1f40a")
    E["leccion3"] = leccion(3, "un logotipo se puede quitar", "*PARA CONTAR ALGO MÁS GRANDE*", "1f405")
    E["la_final"] = lista([("1f5fc", "un chico de París"), ("1f93a", "cuatro mosqueteros"), ("1f9f3", "una maleta"), ("1f40a", "un cocodrilo"), ("1f455", "una camiseta")], "")
    E["la_verde"] = f'''{F("calido", True)}{obj(polo_croc(360), 30, 50, "drop", "float", .2)}{txt(kt("YA SABES *DE DÓNDE VIENE*", "xl", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:160px">{polo(440)}</div><div style="position:absolute;left:300px;top:300px">{vicon("crocodile", 80)}</div>
      <div style="position:absolute;left:330px;top:70px">{vicon("luggage", 170)}</div>
      <div class="big" style="top:100px"><div class="s">EL COCODRILO NACIÓ</div><div class="q" style="font-size:160px;margin-top:22px">DE UNA</div><div class="q" style="font-size:160px">APUESTA</div><div class="y">LA HISTORIA DE LACOSTE</div></div>'''
