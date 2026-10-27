"""Escenas del vídeo 15 (Coca-Cola, formato largo). Motor común; sin logotipos: botellas, vasos y carteles genéricos."""
from base import *

CAP_ICONOS = {1: "1f3e5", 2: "1f377", 3: "1f964", 4: "270d-fe0f", 5: "1f4dc", 6: "1f4e2", 7: "1f37e", 8: "1f4b0",
              9: "1f385", 10: "1f1ea-1f1f8", 11: "1f510", 12: "1f9e0"}

def botella(px=170, color="#3a1d10", estrias=True, d=0.0):
    e = "".join(f'<path d="M{24 + i*7},70 C{22 + i*7},95 {22 + i*7},120 {24 + i*7},150" stroke="#fff" stroke-opacity=".18" stroke-width="2" fill="none"/>' for i in range(4)) if estrias else ""
    return (f'<svg width="{px}" height="{px*2.6:.0f}" viewBox="0 0 70 182"><path d="M27,4 h16 v26 c0,8 10,14 10,26 c0,14 -8,18 -8,34 c0,14 12,22 12,46 v26 c0,8 -6,12 -12,12 h-20 '
            f'c-6,0 -12,-4 -12,-12 v-26 c0,-24 12,-32 12,-46 c0,-16 -8,-20 -8,-34 c0,-12 10,-18 10,-26z" fill="{color}" stroke="{TINTA}" stroke-width="3"/>{e}'
            f'<rect x="25" y="0" width="20" height="8" rx="2" fill="#c9ced6"/><circle cx="28" cy="150" r="3" fill="#fff" opacity=".5"/></svg>')

def vaso(px=180):
    return (f'<svg width="{px}" height="{px*1.2:.0f}" viewBox="0 0 100 120"><path d="M15,10 L85,10 L76,112 L24,112Z" fill="#fff" fill-opacity=".55" stroke="{TINTA}" stroke-width="3"/>'
            f'<path d="M18,30 L82,30 L76,108 L24,108Z" fill="#3a1d10"/><circle cx="40" cy="60" r="3" fill="#fff" opacity=".6"/><circle cx="58" cy="80" r="2" fill="#fff" opacity=".6"/>'
            f'<circle cx="50" cy="45" r="2" fill="#fff" opacity=".6"/></svg>')

def cartel(texto, px=360, color=ROJO):
    return (f'<div style="width:{px}px;padding:22px 10px;background:{color};border:6px solid {TINTA};border-radius:14px;box-shadow:10px 10px 0 rgba(0,0,0,.18);'
            f'font-family:Bebas;font-size:{px//6}px;color:{HUESO};text-align:center;line-height:1">{texto}</div>')

def vaina(px=300):
    est = "".join(f'<path d="M{60 + i*16},20 C{50 + i*16},80 {50 + i*16},140 {60 + i*16},200" stroke="#5b3a1e" stroke-width="4" fill="none" opacity=".5"/>' for i in range(5))
    return (f'<svg width="{px}" height="{px*1.4:.0f}" viewBox="0 0 160 224"><path d="M80,6 C140,30 150,120 120,190 C108,214 52,214 40,190 C10,120 20,30 80,6Z" fill="#c98a3a" stroke="{TINTA}" stroke-width="4"/>{est}</svg>')

def escenas():
    E = {}
    B = botella
    # introducción
    E["cc_marca"] = f'''{F("", True)}{obj(B(180), 30, 52, "drop", "float", .2)}{txt(kt("LA MARCA MÁS *CONOCIDA*", "xl", .6), 68, 40, 56)}{txt(kt("del planeta, probablemente", "l", 1.3), 68, 56, 56)}'''
    E["cc_200"] = cifra("+200 PAÍSES", "Y SU NOMBRE SE ENTIENDE EN CASI CUALQUIER IDIOMA", "1f30d")
    E["cc_nueve"] = f'''{F()}{"".join(obj(vaso(130), 10 + i * 10, 44, "drop", "", .1 + i * .2) for i in range(9))}{txt(kt("EL PRIMER AÑO: *9 VASOS AL DÍA*", "xl", 2.0), 50, 82, 90)}'''
    E["cc_farmacia"] = icono_texto("1f3e5", "NACIÓ EN *UNA FARMACIA*", "la inventó un farmacéutico que buscaba un remedio", "", "izq", "sepia", False, "zoom", "bob", 360, (("1f48a", 86, 80),))
    E["cc_vendio"] = impacto("su creador vendió la fórmula por muy poco", "Y MURIÓ *SIN SABERLO*", "", "1f4dc")
    E["cc_teaser"] = lista([("1f37e", "una botella por error"), ("1f4b5", "un acuerdo de 1 $"), ("1f385", "un Papá Noel de rojo")], "Y POR EL CAMINO…")
    E["cc_mundo"] = f'''{F("calido", True)}{obj(spr("1f30d", 300), 30, 48, "zoom", "spin-slow", .2)}{obj(B(120), 52, 40, "drop", "bob", .8)}{txt(kt("DE UN JARABE DE ATLANTA… *AL MUNDO*", "xl", 1.0), 72, 48, 50)}'''
    # 1
    E["cc_pemberton"] = icono_texto("1f468-200d-2695-fe0f", "JOHN *PEMBERTON*", "farmacéutico del sur de Estados Unidos", "", "izq", "sepia", False, "up", "bob")
    E["cc_guerra"] = f'''{F("sepia", True)}{obj(spr("2694-fe0f", 240), 24, 46, "spin", "", .2)}{txt(kt("1865", "mega", .5, .12, "slam"), 64, 24, 60)}{txt(kt("gravemente herido al final de la *Guerra Civil* estadounidense", "xl", 1.0), 64, 58, 60)}<div class="viñeta"></div>'''
    E["cc_morfina"] = icono_texto("1f489", "EL DOLOR, *CON MORFINA*", "como a tantos heridos de aquella época", "", "der", "sepia", False, "pop", "")
    E["cc_dependencia"] = icono_texto("26d3-fe0f", "UNA *DEPENDENCIA*", "de la que le costó años intentar salir", "según sus biógrafos:", "izq", "dark", False, "drop", "")
    E["cc_tonicos"] = f'''{F()}{"".join(obj(spr("1f9ea", 170), x, 42, "pop", "bob", .2 + i * .3) for i, x in enumerate([18, 36, 54]))}{txt(kt("OBSESIONADO CON *TÓNICOS Y REMEDIOS*", "xl", 1.0), 50, 78, 90)}{obj(spr("1f9d0", 200), 80, 40, "pop", "bob", .9)}'''
    E["cc_sincontrol"] = bocadillos("1f9f4", ["¡Cura los nervios!", "¡Adiós al cansancio!", "¡Para el dolor de cabeza!", "¡Remedio para todo!"], "sin los controles que hay hoy sobre los medicamentos")
    # 2
    E["cc_atlanta"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("ATLANTA", "mega", .3, .1, "slam"), 50, 34, 95)}{txt(kt("principios de la década de 1880", "l", 1.1), 50, 52, 80)}{obj(spr("1f1fa-1f1f8", 150), 86, 20, "pop", "bob", .8)}'''
    E["cc_vino"] = comparar("1f377", "vino", "1f33f", "extracto de hoja de coca", "+", "UN TÓNICO INSPIRADO EN UNO FRANCÉS")
    E["cc_remedio"] = lista([("1f62c", "nervios"), ("1f971", "cansancio"), ("1f915", "dolor de cabeza")], "LO ANUNCIABA COMO REMEDIO PARA…")
    E["cc_ley"] = icono_texto("2696-fe0f", "RESTRICCIONES *AL ALCOHOL*", "Atlanta, 1886", "", "der", "", True, "drop", "swing")
    E["cc_dias"] = f'''{F("dark", True)}{obj(spr("1f377", 260), 50, 40, "none", "fuera", .4)}{txt(kt("SU TÓNICO CON VINO TENÍA *LOS DÍAS CONTADOS*", "xl hueso", .8), 50, 80, 90)}'''
    E["cc_experimenta"] = f'''{F("", True)}{obj(spr("2697-fe0f", 230), 20, 46, "pop", "swing", .2)}{txt('<div class="vs" style="--d:.7s;font-size:110px">→</div>', 36, 46, 8)}{obj(B(110), 50, 48, "zoom", "bob", 1.0)}
      {txt(kt("UN JARABE *SIN ALCOHOL*", "xl", 1.2), 76, 40, 44)}{txt(kt("hoja de coca + nuez de cola", "l", 1.8), 76, 56, 44)}'''
    # 3
    E["cc_jacobs"] = fecha("8", "MAYO", "1886", "farmacia Jacobs, Atlanta", "1f3e5")
    E["cc_surtidor"] = f'''{F("calido")}{obj(vaso(240), 30, 48, "drop", "", .3)}{obj(spr("1fae7", 150), 30, 22, "pop", "float", .9)}{txt(kt("AGUA CON GAS + JARABE", "xl", .6), 70, 36, 50)}{txt(kt("5 CENTAVOS", "mega rojo", 1.2, .12, "slam"), 70, 58, 50)}'''
    E["cc_encuentro"] = icono_texto("1f465", "LA FARMACIA, *PUNTO DE ENCUENTRO*", "con surtidores donde se servían bebidas", "", "izq", "sepia", False, "pop", "bob")
    E["cc_anuncio"] = icono_texto("1f4f0", "EL PRIMER *ANUNCIO*", "en un periódico de Atlanta: «pruebe la nueva bebida»", "pocos días después:", "der", "sepia", False, "drop", "swing")
    E["cc_noexito"] = impacto("pero el éxito", "NO FUE *INMEDIATO*", "", "1f610")
    E["cc_nueve2"] = cifra("9 VASOS", "AL DÍA, DE MEDIA, EL PRIMER AÑO", "1f964", "según la propia compañía:")
    E["cc_hoy"] = f'''{F("", True)}{txt(kt("9", "mega rojo", .2, .1, "slam"), 24, 46, 20)}{txt('<div class="vs" style="--d:.7s">→</div>', 44, 46, 10)}{txt(kt("MILES DE MILLONES", "xl", 1.0), 70, 40, 50)}{txt(kt("de bebidas de la compañía, cada día", "l", 1.6), 70, 56, 50)}'''
    # 4
    E["cc_robinson"] = icono_texto("1f468-200d-1f4bc", "FRANK *ROBINSON*", "socio y contable de Pemberton", "el nombre se le ocurrió a", "izq", "", True, "up", "bob", 360, (("1f4a1", 86, 80),))
    E["cc_coca_cola"] = comparar("1f33f", "COCA: la hoja de coca", "1f330", "COLA: la nuez de cola (cafeína)", "+")
    E["cc_dosc"] = f'''{F("", True)}{txt('<div class="mega rojo" style="font-size:340px">C</div>', 30, 46, 20, "center", .2, "flip")}{txt('<div class="mega rojo" style="font-size:340px">C</div>', 70, 46, 20, "center", .6, "flip")}{txt(kt("DOS C QUEDAN BIEN *EN LOS ANUNCIOS*", "xl", 1.2), 50, 84, 90)}'''
    E["cc_cursiva"] = f'''{F("sepia")}{obj(spr("270d-fe0f", 230), 22, 46, "pop", "swing", .2)}<svg class="pos" style="left:62%;top:42%" width="760" height="220" viewBox="0 0 760 220"><path class="draw" style="--d:.5s;--len:2600" d="M30,150 C60,40 140,30 150,90 C160,150 90,170 110,120 C140,60 200,80 210,130 C220,170 260,90 300,100 C330,110 320,160 360,150 C400,140 410,60 450,80 C490,100 470,170 520,150 C560,130 570,80 610,90 C650,100 640,160 700,140" fill="none" stroke="{ROJO}" stroke-width="12" stroke-linecap="round"/></svg>
      {txt(kt("LA LETRA *CURSIVA* DE UN CONTABLE", "xl", 1.6), 62, 78, 64)}<div class="viñeta"></div>'''
    E["cc_siglo"] = titular("+100 AÑOS *DESPUÉS*", "esa letra sigue siendo, en esencia, la misma", "", ("270d-fe0f", "23f3", "2728", "1f58b-fe0f"))
    E["cc_hoja"] = icono_texto("1f33f", "SÍ: LLEVABA *HOJA DE COCA*", "ese ingrediente se fue eliminando a principios del siglo XX", "en sus primeros años…", "der", "", False, "pop", "swing")
    # 5
    E["cc_enfermo"] = icono_texto("1f912", "ENFERMO Y *SIN DINERO*", "", "Pemberton:", "izq", "sepia", False, "drop", "")
    E["cc_participaciones"] = f'''{F()}{obj(spr("1f4dc", 220), 50, 40, "pop", "", .2)}{"".join(obj(spr("1f9d1-200d-1f4bc", 150), x, y, "pop", "bob", .6 + i * .25) for i, (x, y) in enumerate([(18, 30), (82, 30), (20, 64), (80, 64)]))}
      {txt(kt("VENDE PARTES A *DISTINTOS SOCIOS*", "xl", 1.6), 50, 86, 90)}'''
    E["cc_lio"] = bocadillos("1f4dc", ["¡La fórmula es mía!", "¡No, mía!", "¡Tengo derechos!", "¡Yo también!"], "varias personas decían tener derechos")
    E["cc_candler"] = icono_texto("1f468-200d-1f4bc", "ASA *CANDLER*", "empresario farmacéutico de Atlanta", "el hombre que lo cambiaría todo:", "der", "", True, "zoom", "bob", 360, (("2b50", 14, 22),))
    E["cc_2300"] = cifra("≈2.300 $", "EN TOTAL, POR LA FÓRMULA Y LA MARCA", "1f4b5", "según la cifra más citada:")
    E["cc_muere"] = f'''{F("dark", True)}{obj(spr("1f56f-fe0f", 230), 26, 46, "pop", "glow", .2)}{txt(kt("AGOSTO DE 1888", "l naranja", .4), 64, 32, 56)}{txt(kt("PEMBERTON MUERE *SIN VER EL ÉXITO*", "xl hueso", .9), 64, 50, 58)}'''
    # 6
    E["cc_vendedor"] = titular("NO ERA INVENTOR: *ERA VENDEDOR*", "y uno muy bueno", "Candler", ("1f4e2", "1f4b0", "1f3f7-fe0f", "2b50"), "", True, "xl")
    E["cc_cupones"] = f'''{F("", True)}{"".join(obj(cartel("GRATIS", 190, VERDE), x, y, "drop", "bob", .2 + i * .25) for i, (x, y) in enumerate([(20, 34), (40, 58), (60, 34), (80, 58)]))}{txt(kt("CUPONES PARA *PROBARLA GRATIS*", "xl", 1.4), 50, 88, 90)}'''
    E["cc_merch"] = lista([("1f570-fe0f", "relojes"), ("1f4c5", "calendarios"), ("1fa ad" if False else "1faad", "abanicos"), ("1f5bc-fe0f", "carteles")], "LA MARCA EN TODAS PARTES")
    E["cc_imposible"] = impacto("objetivo:", "QUE FUERA *IMPOSIBLE* NO VERLA", "", "1f440")
    E["cc_estados"] = cifra("1895", "SE VENDE EN TODOS LOS ESTADOS DEL PAÍS", "1f1fa-1f1f8", "Candler presumía:")
    E["cc_despiste"] = impacto("su decisión más famosa fue…", "UN *DESPISTE*", "", "1f605")
    E["cc_abogados"] = icono_texto("2696-fe0f", "DOS ABOGADOS *DE TENNESSEE*", "querían embotellar la bebida en gran parte de EE. UU.", "1899", "izq", "", True, "pop", "bob", 340, (("1f37e", 86, 80),))
    E["cc_dolar"] = f'''{F("calido", True)}{obj(spr("1f4b5", 260), 26, 44, "flip", "float", .2)}{txt(kt("LOS DERECHOS, POR", "l", .5), 66, 28, 56)}{txt(kt("1 $", "mega rojo", .9, .12, "slam"), 66, 46, 56)}{txt(kt("y, según se cuenta, *ni lo cobró*", "l", 1.6), 66, 64, 56)}'''
    E["cc_embotelladores"] = f'''{F("", True)}{"".join(obj(B(80), 8 + i * 7, 46 + (i % 2) * 6, "drop", "", .05 + i * .07) for i in range(13))}{txt(kt("EL SISTEMA DE *EMBOTELLADORES*", "xl", 1.2), 50, 84, 90)}'''
    # 7
    E["cc_imitaciones"] = f'''{F()}{obj(B(130, "#3a1d10", False), 20, 46, "pop", "", .2)}{obj(B(130, "#4a2414", False), 40, 46, "pop", "", .4)}{obj(B(130, "#2e170c", False), 60, 46, "pop", "", .6)}{obj(B(130, "#5a2c18", False), 80, 46, "pop", "", .8)}
      {txt(kt("LAS *IMITACIONES*", "xl", 1.2), 50, 88, 90)}'''
    E["cc_concurso"] = f'''{F("dark", True)}{obj(spr("1f3c6", 220), 22, 40, "drop", "bob", .2)}{txt(kt("1915: UN *CONCURSO*", "xl hueso", .5), 62, 30, 62)}{txt(kt("una botella que se reconozca al tacto, a oscuras… o *rota en el suelo*", "l hueso", 1.1), 62, 52, 62)}'''
    E["cc_indiana"] = icono_texto("1f3ed", "UNA FÁBRICA DE VIDRIO *DE INDIANA*", "Terre Haute", "lo ganó", "der", "", True, "rise", "", 340)
    E["cc_ingredientes"] = comparar("1f33f", "hoja de coca", "1f330", "nuez de cola", "?", "BUSCAN INSPIRACIÓN EN LOS INGREDIENTES")
    E["cc_cacao"] = f'''{F("", True)}{obj(spr("1f4d6", 240), 22, 46, "pop", "bob", .2)}{txt('<div class="vs" style="--d:.8s">→</div>', 42, 46, 10)}{obj(vaina(240), 62, 48, "zoom", "swing", 1.1)}
      {txt(kt("…era una *VAINA DE CACAO*", "xl", 1.6), 82, 46, 30)}'''
    E["cc_vaina"] = f'''{F("calido", True)}{obj(vaina(300), 32, 50, "left", "", .2)}{txt('<div class="vs" style="--d:.8s">=</div>', 50, 48, 8)}{obj(B(170), 68, 50, "right", "float", 1.0)}{txt(kt("Y EN ELLA *SE BASARON*", "xl", 1.4), 50, 90, 90)}'''
    E["cc_forma"] = titular("UNA FORMA *INCONFUNDIBLE*", "nacida de un error", "", ("1f37e", "2728", "1f3c6", "1f60d"))
    E["cc_registro"] = icono_texto("1f4dc", "LA FORMA, *REGISTRADA COMO MARCA*", "1960, en Estados Unidos: muy poco habitual para un envase", "", "der", "", True, "flip", "bob", 340, (("1f37e", 14, 80),))
    # 8
    E["cc_1919"] = anio(1900, 1919, "los Candler venden la compañía a Ernest Woodruff", "1f3e6")
    E["cc_25m"] = cifra("25 M$", "EL PRECIO DE LA COMPAÑÍA", "1f4b0")
    E["cc_recuerda"] = f'''{F("", True)}{txt(kt("≈2.300 $", "mega gris", .2, .1, "slam"), 26, 44, 40)}{txt('<div class="vs" style="--d:.8s">→</div>', 50, 44, 10)}{txt(kt("25 M$", "mega rojo", 1.2, .1, "slam"), 74, 44, 40)}{txt(kt("en unos *30 años*", "xl", 1.8), 50, 74, 80)}'''
    E["cc_robert"] = icono_texto("1f468-200d-1f4bc", "ROBERT *WOODRUFF*", "la dirigió durante décadas", "el hijo del banquero:", "izq", "", True, "up", "bob")
    E["cc_simbolo"] = titular("MÁS QUE UN REFRESCO: *UN SÍMBOLO*", "", "", ("2b50", "1f37e", "1f30d", "2764-fe0f"), "", True, "xl")
    E["cc_pausa"] = f'''{F("calido", True)}{obj(B(170), 24, 50, "drop", "float", .2)}{txt(kt("1929", "l gris", .4), 64, 30, 60)}{txt(kt("«LA PAUSA *QUE REFRESCA*»", "xl", .8), 64, 48, 62)}{obj(spr("1f60c", 160), 86, 78, "pop", "bob", 1.5)}'''
    E["cc_soldados"] = f'''{F("", True)}{"".join(obj(spr("1fa96", 150), 12 + i * 13, 40, "up", "bob", .1 + i * .15) for i in range(6))}{txt(kt("CADA SOLDADO, UNA COCA-COLA POR *5 CENTAVOS*", "xl", 1.2), 50, 66, 90)}{txt(kt("estuviera donde estuviera", "l", 1.9), 50, 88, 90)}'''
    E["cc_plantas"] = f'''{F()}{obj(spr("1f5fa-fe0f", 300), 30, 48, "zoom", "", .2)}{"".join(obj(spr("1f3ed", 90), x, y, "pop", "", .6 + i * .15) for i, (x, y) in enumerate([(20, 36), (34, 44), (26, 58), (40, 34), (38, 62)]))}
      {txt(kt("AL TERMINAR LA GUERRA: *PLANTAS POR MEDIO MUNDO*", "xl", 1.4), 72, 48, 50)}'''
    # 9
    E["cc_mito"] = impacto("un mito muy extendido:", "¿INVENTÓ A *PAPÁ NOEL*?", "", "1f385")
    E["cc_noescierto"] = icono_texto("274c", "*NO ES CIERTO*", "Papá Noel ya aparecía con ropa roja antes", "", "der", "", False, "pop", "shake")
    E["cc_sundblom"] = icono_texto("1f468-200d-1f3a8", "HADDON *SUNDBLOM*", "anuncios navideños desde 1931", "el ilustrador:", "izq", "calido", True, "pop", "bob", 360, (("1f384", 86, 80),))
    E["cc_bonachon"] = f'''{F("calido", True)}{obj(spr("1f385", 300), 30, 48, "zoom", "bob", .2)}{txt(kt("BONACHÓN, CÁLIDO, *SONRIENTE*", "xl", .7), 70, 40, 52)}{txt(kt("durante más de 30 años", "l", 1.4), 70, 56, 52)}'''
    E["cc_revistas"] = icono_texto("1f4f0", "CADA NAVIDAD, *EN LAS REVISTAS*", "las más leídas del país", "", "der", "", True, "drop", "swing")
    E["cc_fijar"] = comparar("1f385", "no inventó a Papá Noel", "1f9e0", "pero ayudó a fijar su imagen", "…")
    # 10
    E["cc_espana"] = impacto("", "¿Y EN *ESPAÑA*?", "", "1f1ea-1f1f8")
    E["cc_1953"] = fecha("31", "MARZO", "1953", "Barcelona: la primera botella de la península (Cobega)", "1f3ed")
    E["cc_canarias"] = icono_texto("1f3dd-fe0f", "EN CANARIAS, *ANTES*", "la compañía sitúa allí sus inicios en España a finales de los años veinte", "", "izq", "", True, "pop", "float")
    E["cc_ciudades"] = lista([("1f3d9-fe0f", "Madrid"), ("2600-fe0f", "Sevilla"), ("1f34a", "Valencia"), ("1f3ed", "y más")], "LLEGAN MÁS EMBOTELLADORAS")
    E["cc_bar"] = f'''{F("calido", True)}{obj(spr("1f37b", 240), 26, 46, "pop", "bob", .2)}{obj(B(130), 44, 50, "drop", "", .6)}{txt(kt("PARTE DEL PAISAJE DE *CUALQUIER BAR*", "xl", .9), 72, 46, 50)}'''
    # 11
    E["cc_misterio"] = impacto("el gran misterio:", "LA *FÓRMULA*", "", "1f510")
    E["cc_patente"] = comparar("1f4dc", "una patente la haría pública… y caducaría", "1f92b", "por eso nunca se patentó", "≠")
    E["cc_banco"] = icono_texto("1f3e6", "LA CÁMARA DE *UN BANCO*", "durante décadas, en Atlanta", "", "izq", "dark", True, "pop", "")
    E["cc_camara"] = f'''{F("dark", True)}<div class="pos" style="left:30%;top:48%;width:380px;height:380px;border-radius:50%;background:radial-gradient(#9aa0a8,#4a4f57);border:14px solid #2a2d33;box-shadow:0 0 0 10px #1a1c20"></div>
      {obj(spr("1f510", 180), 30, 48, "zoom", "pulse", .4)}{txt(kt("HOY: EN EL MUSEO DE LA MARCA", "l naranja", .5), 70, 34, 52)}{txt(kt("ves la puerta… *no lo de dentro*", "xl hueso", 1.0), 70, 52, 52)}'''
    E["cc_marketing"] = titular("EL MISTERIO *TAMBIÉN VENDE*", "una receta que, según la marca, nadie puede copiar", "", ("1f92b", "1f510", "2728", "1f37e"))
    E["leccion1"] = leccion(1, "inventar algo no basta", "HAY QUE *SABER VENDERLO*", "1f4e2")
    E["leccion2"] = leccion(2, "lo que regalas por un dólar", "PUEDE SER *LO QUE MÁS VALE*", "1f4b5")
    E["leccion3"] = leccion(3, "nombre, forma, historia…", "Y MUCHÍSIMA *CONSTANCIA*", "1f9f1")
    E["cc_final"] = lista([("1f468-200d-2695-fe0f", "un farmacéutico"), ("270d-fe0f", "un contable"), ("1f4e2", "un vendedor"), ("1f37e", "una botella")], "ASÍ EMPEZÓ TODO")
    E["cc_abras"] = f'''{F("", True)}{obj(B(200), 30, 50, "drop", "float", .2)}{txt(kt("LA PRÓXIMA VEZ QUE ABRAS UNA…", "xl", .6), 68, 40, 56)}{txt(kt("ya sabes *todo lo que hay detrás*", "l", 1.4), 68, 56, 56)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:60px;transform:rotate(-8deg)">{botella(210)}</div>
      <div style="position:absolute;left:290px;top:300px">{vicon("hospital", 210)}</div>
      <div class="big" style="top:100px"><div class="s">COCA-COLA NACIÓ</div><div class="q" style="font-size:170px;margin-top:22px">EN UNA</div><div class="q" style="font-size:170px">FARMACIA</div><div class="y">LA HISTORIA COMPLETA</div></div>'''
