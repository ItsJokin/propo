"""Escenas del vídeo 12 (Kodak). Motor común; sin logotipos: carretes y cámaras genéricos."""
from base import *

CAP_ICONOS = {1: "1f4f7", 2: "1f39e-fe0f", 3: "1f52c", 4: "1f92b", 5: "1f4c9", 6: "1f9e0"}

def carrete(px=220):
    return (f'<svg width="{px}" height="{px:.0f}" viewBox="0 0 120 120"><rect x="20" y="24" width="64" height="80" rx="10" fill="#FFD23F" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="20" y="44" width="64" height="40" fill="{ROJO}"/><rect x="40" y="10" width="24" height="16" rx="3" fill="{GRIS}" stroke="{TINTA}" stroke-width="3"/>'
            f'<path d="M84,40 L116,40 L116,86 L84,86" fill="#5b4636" stroke="{TINTA}" stroke-width="3"/>'
            + "".join(f'<rect x="{88 + i*9}" y="44" width="5" height="5" fill="{HUESO}"/><rect x="{88 + i*9}" y="77" width="5" height="5" fill="{HUESO}"/>' for i in range(3)) + '</svg>')

def prototipo(px=420):
    return (f'<svg width="{px}" height="{px*0.6:.0f}" viewBox="0 0 250 150"><rect x="10" y="30" width="200" height="110" rx="8" fill="#8a8f98" stroke="{TINTA}" stroke-width="4"/>'
            f'<circle cx="60" cy="85" r="34" fill="{TINTA}"/><circle cx="60" cy="85" r="20" fill="#2E6BD6"/><circle cx="52" cy="77" r="6" fill="#fff" opacity=".6"/>'
            f'<rect x="120" y="50" width="76" height="46" rx="4" fill="#3a3f47"/><rect x="128" y="58" width="60" height="30" rx="3" fill="#c9ced6"/>'
            f'<circle cx="142" cy="73" r="8" fill="{GRIS}"/><circle cx="174" cy="73" r="8" fill="{GRIS}"/><rect x="40" y="16" width="40" height="18" rx="3" fill="#5b6270"/>'
            f'<rect x="210" y="60" width="30" height="10" fill="#5b6270"/></svg>')

def escenas():
    E = {}
    E["o_movil"] = f'''{F("", True)}{obj(spr("1f4f1", 260), 26, 46, "pop", "bob", .2)}{"".join(obj(spr(c, 120), x, y, "pop", "float", .5 + i * .2) for i, (c, x, y) in enumerate([("1f305", 46, 24), ("1f436", 52, 50), ("1f382", 46, 76)]))}
      {txt(kt("MILES DE FOTOS *SIN PENSARLO*", "xl", .9), 76, 46, 44)}'''
    E["o_kodak"] = f'''{F("sepia", True)}{obj(carrete(260), 26, 46, "flip", "bob", .2)}{txt(kt("HACER UNA FOTO =", "xl", .6), 66, 36, 56)}{txt(kt("*KODAK*", "mega", 1.1, .12, "slam"), 66, 56, 56)}<div class="viñeta"></div>'''
    E["o_1975"] = f'''{F("", True)}{obj(prototipo(440), 30, 48, "zoom", "float", .2)}{txt(kt("LA PRIMERA CÁMARA DIGITAL", "l", .6), 74, 30, 48)}{txt(kt("la inventó *KODAK*", "xl", 1.1), 74, 46, 48)}{txt(kt("1975", "mega rojo", 1.6, .12, "slam"), 74, 66, 44)}'''
    E["o_quiebra"] = impacto("lo tenía todo… y acabó", "EN *QUIEBRA*", "", "1f4c9")
    E["o_eastman"] = icono_texto("1f468-200d-1f4bc", "GEORGE *EASTMAN*", "Estados Unidos, finales del siglo XIX", "", "izq", "sepia", False, "up", "bob")
    E["o_complicada"] = lista([("1f5bc-fe0f", "placas"), ("2697-fe0f", "químicos"), ("1f3cb-fe0f", "equipos pesados")], "LA FOTOGRAFÍA ERA COMPLICADA")
    E["o_1888"] = anio(1800, 1888, "una cámara sencilla, ya cargada con película", "1f4f7")
    E["o_envias"] = f'''{F()}{obj(spr("1f4f8", 200), 14, 44, "pop", "bob", .2)}{txt('<div class="vs" style="--d:.6s;font-size:120px">→</div>', 30, 44, 8)}{obj(spr("1f4ee", 200), 46, 44, "pop", "bob", .8)}
      {txt('<div class="vs" style="--d:1.2s;font-size:120px">→</div>', 62, 44, 8)}{obj(spr("1f5bc-fe0f", 200), 80, 44, "pop", "bob", 1.4)}
      {txt(kt("haces las fotos · envías la cámara · *te llegan reveladas*", "l", 1.6), 50, 76, 95)}'''
    E["o_eslogan"] = titular("«USTED PULSE EL BOTÓN…»", "…nosotros hacemos el resto", "", ("1f446", "1f4f7", "2728", "1f60a"), "", True, "xl")
    E["o_nombre"] = f'''{F("", True)}{txt('<div class="mega rojo" style="font-size:300px">K</div>', 24, 46, 20, "center", .2, "flip")}{txt('<div class="mega rojo" style="font-size:300px">K</div>', 76, 46, 20, "center", .5, "flip")}
      {txt(kt("corta · fácil · *empieza y acaba con K*", "xl", 1.0), 50, 82, 90)}{txt(kt("un nombre inventado por Eastman", "l gris", .2), 50, 14, 80)}'''
    E["o_brownie"] = f'''{F("calido", True)}{obj(spr("1f4f7", 260), 26, 46, "drop", "bob", .2)}{txt(kt("1900: LA BROWNIE", "xl", .6), 68, 34, 56)}{txt(kt("1 $", "mega rojo", 1.2, .12, "slam"), 68, 56, 56)}'''
    E["o_casas"] = icono_texto("1f46a", "LA FOTO ENTRA *EN TODAS LAS CASAS*", "ya no era cosa de profesionales", "", "der", "", True, "pop", "bob")
    E["o_pelicula"] = comparar("1f4f7", "las cámaras", "1f39e-fe0f", "la película y el revelado", "≠", "EL VERDADERO NEGOCIO")
    E["o_dinero"] = f'''{F()}{"".join(obj(spr("1f4b5", 120), 14 + i * 10, 30 + (i % 3) * 20, "drop", "float", .1 + i * .15) for i in range(8))}{txt(kt("CADA FOTO, *DINERO PARA KODAK*", "xl", 1.4), 50, 88, 90)}'''
    E["o_cuota"] = f'''{F("", True)}{txt(kt("1976, EN ESTADOS UNIDOS", "l gris", .1), 50, 18, 85)}{txt(kt("90 %", "mega rojo", .4, .12, "slam"), 28, 44, 40)}{txt(kt("de la película", "l", 1.0), 28, 62, 40)}
      {txt(kt("85 %", "mega rojo", 1.2, .12, "slam"), 72, 44, 40)}{txt(kt("de las cámaras", "l", 1.8), 72, 62, 40)}'''
    E["o_sasson"] = icono_texto("1f468-200d-1f52c", "STEVEN *SASSON*", "probar un nuevo sensor electrónico", "1975, un joven ingeniero:", "izq", "", True, "up", "bob", 340, (("1f52c", 86, 80),))
    E["o_tostadora"] = f'''{F()}{obj(prototipo(460), 32, 48, "zoom", "", .2)}{txt(kt("DEL TAMAÑO DE *UNA TOSTADORA*", "xl", .8), 74, 44, 48)}{obj(spr("1f35e", 150), 74, 70, "pop", "bob", 1.4)}'''
    E["o_kilos"] = cifra("3,6 KG", "PESABA LA CÁMARA", "1f3cb-fe0f", "unos")
    E["o_pixeles"] = f'''{F("", True)}<div class="pos" style="left:28%;top:46%;width:300px;height:300px;background:repeating-conic-gradient(#151515 0 25%,#8a8f98 0 50%) 0 0/30px 30px;border:6px solid #151515"></div>
      {txt(kt("100 × 100 PÍXELES", "xl", .6), 70, 26, 52)}{txt(kt("*0,01*", "mega", 1.1, .12, "slam"), 70, 46, 52)}{txt(kt("MEGAPÍXELES", "xl", 1.5), 70, 62, 52)}{txt(kt("en blanco y negro", "l", 1.9), 70, 76, 52)}'''
    E["o_23seg"] = f'''{F()}{txt(odometro(10, 23, .2, 2.5, "mega naranja"), 30, 44, 30)}{txt(kt("SEGUNDOS", "xl", .4), 30, 64, 30)}{obj(spr("1f4fc", 240), 72, 40, "pop", "bob", .8)}
      {txt(kt("para guardar cada foto en una *cinta de casete*", "l", 1.4), 72, 66, 50)}'''
    E["o_primera"] = titular("LA PRIMERA *DEL MUNDO*", "cámara digital portátil", "", ("1f4f7", "1f947", "2728", "1f4be"))
    E["o_presenta"] = icono_texto("1f465", "PRESENTACIÓN A *LOS DIRECTIVOS*", "", "", "izq", "", True, "pop", "bob")
    E["o_reaccion"] = f'''{F("dark", True)}{obj(spr("1f92b", 260), 24, 46, "pop", "bob", .2)}{txt(kt("«ES CURIOSO…", "xl hueso", .5), 64, 36, 60)}{txt(kt("*PERO NO SE LO CUENTES A NADIE*»", "xl naranja", 1.2), 64, 54, 60)}
      {txt(kt("según ha contado Sasson", "m gris dark", 2.2), 64, 72, 60)}'''
    E["o_patente"] = icono_texto("1f4dc", "PATENTADA EN 1978… *Y GUARDADA*", "nunca se convirtió en producto", "", "der", "", False, "flip", "", 340, (("1f5c4-fe0f", 14, 80),))
    E["o_gallina"] = f'''{F("calido", True)}{obj(spr("1f414", 260), 28, 46, "pop", "bob", .2)}{obj(spr("1f95a", 140), 44, 70, "drop", "", .8)}{obj(spr("1fa99", 140), 52, 62, "drop", "", 1.1)}
      {txt(kt("NADIE QUERÍA MATAR A LA *GALLINA DE LOS HUEVOS DE ORO*", "xl", .7), 74, 44, 46)}'''
    E["o_corazon"] = comparar("1f4f7", "vendió cámaras digitales, años después", "1f39e-fe0f", "pero su corazón seguía siendo la película", "…")
    E["o_carretes"] = f'''{F("dark", True)}{"".join(obj(carrete(150), 16 + i * 17, 44, "none", "fuera", .2 + i * .25) for i in range(5))}{txt(kt("LA VENTA DE CARRETES *SE DESPLOMA*", "xl hueso", 1.2), 50, 80, 90)}'''
    E["o_moviles"] = flecha("1f4f7", "1f4f1", "LLEGAN LOS *MÓVILES CON CÁMARA*", "hasta la cámara digital sobraba para mucha gente")
    E["o_2012"] = fecha("19", "ENERO", "2012", "Kodak se declara en quiebra", "1f4c9")
    E["o_30mil"] = cifra("≈30.000 M$", "LO QUE VALÍA DOS DÉCADAS ANTES", "1f4b0")
    E["o_hoy"] = icono_texto("1f5a8-fe0f", "SIGUE, *MUCHO MÁS PEQUEÑA*", "centrada en otros negocios, como la impresión", "", "izq", "", False, "pop", "bob")
    E["leccion1"] = leccion(1, "inventar el futuro no sirve", "SI NO *TE ATREVES A USARLO*", "1f4a1")
    E["leccion2"] = leccion(2, "proteger el negocio de hoy", "PUEDE HACERTE *PERDER EL DE MAÑANA*", "1f6e1-fe0f")
    E["leccion3"] = leccion(3, "si no te haces la competencia", "*OTRO LO HARÁ* POR TI", "1f94a")
    E["o_final"] = f'''{F("", True)}{obj(spr("1f4f1", 240), 24, 46, "pop", "bob", .2)}{obj(prototipo(300), 24, 80, "pop", "", .8)}
      {txt(kt("EMPEZÓ EN UN LABORATORIO *DE KODAK*", "xl", .6), 66, 38, 56)}{txt(kt("pero Kodak no se llevó el mérito", "l", 1.4), 66, 56, 56)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:150px;transform:rotate(-6deg)">{prototipo(440)}</div>
      <div style="position:absolute;left:150px;top:440px">{vicon("chart-decreasing", 160)}</div>
      <div class="big" style="top:100px"><div class="s">KODAK INVENTÓ</div><div class="q" style="font-size:150px;margin-top:22px">LA CÁMARA</div><div class="q" style="font-size:150px">DIGITAL</div><div class="y">Y ESO LA HUNDIÓ</div></div>'''
