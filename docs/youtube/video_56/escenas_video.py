"""Escenas del vídeo 56 (especial Navidad: Ferrero Rocher). Motor común; sin logotipos ni envoltorios de marca: bombones dorados genéricos."""
from base import *

CAP_ICONOS = {1: "1f330", 2: "1f52a", 3: "1f95c", 4: "1faa8", 5: "1f31f", 6: "1f935", 7: "2600-fe0f", 8: "1f910", 9: "1f9e0"}

def bombon(w=160, d=.2):
    """Bombón genérico envuelto en papel dorado, sobre cápsula marrón (sin marca)."""
    an = "" if d is None else f"animation:ePop .45s ease {d}s both;"
    pliegues = "".join(f'<path d="M{100 + 70*__import__("math").cos(a):.0f},{92 + 62*__import__("math").sin(a):.0f} L100,92" stroke="#b8860b" stroke-width="2" opacity=".55"/>' for a in [i*0.52 for i in range(12)])
    return (f'<svg width="{w}" height="{w}" viewBox="0 0 200 200" style="{an}"><defs><radialGradient id="oro" cx="35%" cy="30%"><stop offset="0" stop-color="#fff6c8"/>'
            f'<stop offset=".45" stop-color="#f2c94c"/><stop offset="1" stop-color="#a87b12"/></radialGradient></defs>'
            f'<path d="M30,120 L46,186 L154,186 L170,120Z" fill="#6b3f1f" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M46,128 L56,180 M70,128 L76,182 M100,128 L100,184 M130,128 L124,182 M154,128 L144,180" stroke="#4a2a12" stroke-width="3"/>'
            f'<circle cx="100" cy="92" r="72" fill="url(#oro)" stroke="{TINTA}" stroke-width="4"/>{pliegues}</svg>')

def piramide(base=4, w=110, x0=50, y0=78, d=.2):
    out = []
    for fila in range(base):
        n = base - fila
        for i in range(n):
            x = x0 + (i - (n - 1) / 2) * (w / 19.2) * 0.98
            out.append(obj(bombon(w, d + (fila * base + i) * .06), x, y0 - fila * (w / 10.8) * .8, "none", "", 0))
    return "".join(out)

def escenas():
    E = {}
    E["fr_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f31f", "2744-fe0f", "1f381"), "navidad", True, "mega")
    E["fr_bolita"] = f'''{F("navidad", True)}{obj(bombon(360), 30, 52, "none", "bob", 0)}{txt(kt("UNA BOLITA *DE PAPEL DORADO*", "xl hueso", .6), 70, 42, 52)}{txt(kt("el bombón de las ocasiones especiales", "l naranja", 1.3), 70, 58, 52)}'''
    E["fr_verano"] = icono_texto("2600-fe0f", "EN VERANO, *DESAPARECE*", "de muchas tiendas", "una costumbre curiosa", "izq", "calido", True, "pop", "spin-slow")
    E["fr_obrador"] = icono_texto("1f1ee-1f1f9", "LEJOS *DEL LUJO*", "un obrador italiano, después de la guerra, con el chocolate carísimo", "", "der", "sepia", False, "pop", "bob")
    E["fr_camino"] = lista([("1f95c", "una crema"), ("1faa8", "una roca"), ("1f935", "un embajador"), ("1f910", "una familia discreta")], "POR EL CAMINO…")
    E["fr_historia"] = titular("LA HISTORIA DE *FERRERO ROCHER*", "", "", ("1f31f", "1f330", "1f36b", "1f381"), "navidad", True, "xl")
    E["fr_piamonte"] = icono_texto("1f330", "EL *PIAMONTE*", "colinas de avellanas: la «tonda gentile»", "norte de Italia", "izq", "calido", True, "pop", "bob", 380, (("1f1ee-1f1f9", 84, 20),))
    E["fr_turin"] = comparar("1f36b", "poco cacao, carísimo", "1f330", "avellanas molidas", "+", "TURÍN, PRINCIPIOS DEL SIGLO XIX")
    E["fr_gianduia"] = f'''{F("sepia", True)}{txt(kt("*GIANDUIA*", "mega", .3), 50, 40, 90)}{txt(kt("chocolate y avellana: más barata y muy sabrosa", "l naranja", 1.2), 50, 60, 80)}'''
    E["fr_posguerra"] = cifra("1945", "DESPUÉS DE LA GUERRA: POCO DINERO, EL CACAO, UN LUJO", "1f4b8")
    E["fr_pastelero"] = impacto("y un pastelero recordó", "EL VIEJO *TRUCO*", "", "1f9d1-200d-1f373")
    E["fr_pietro"] = icono_texto("1f9d1-200d-1f373", "PIETRO *FERRERO*", "un obrador en Alba", "", "izq", "sepia", False, "up", "bob")
    E["fr_1946"] = cifra("1946", "UNA PASTA EN BLOQUE, COMO UN PAN: «GIANDUJOT»", "1f35e", "según la historia de la empresa")
    E["fr_cuchillo"] = lista([("1f52a", "se corta en lonchas"), ("1f35e", "sobre una rebanada de pan"), ("1f4b6", "merienda barata")], "CÓMO SE COMÍA")
    E["fr_exito"] = flecha("1f9d1-200d-1f373", "1f3ed", "DEL OBRADOR *A LA EMPRESA*", "fue un éxito")
    E["fr_michele"] = comparar("1f56f-fe0f", "Pietro muere en 1949", "1f468", "Michele, al frente con los años", "→", "")
    E["fr_crema"] = flecha("1f52a", "1f944", "DE CORTAR *A UNTAR*", "principios de los años cincuenta")
    E["fr_1964"] = cifra("1964", "NUEVO NOMBRE Y NUEVO BOTE: NUTELLA", "1f95c")
    E["fr_resto"] = titular("EL RESTO *ES HISTORIA*", "uno de los mayores grupos de dulces del mundo", "", ("1f95c", "1f30d", "1f36b", "2728"))
    E["fr_kinder"] = lista([("1f95a", "huevos de chocolate"), ("1f36b", "chocolatinas para niños")], "DESPUÉS LLEGARÍAN…")
    E["fr_bombon"] = icono_texto("1f381", "FALTABA *UN BOMBÓN*", "algo para regalar, que no pareciera infantil", "", "der", "navidad", True, "pop", "bob")
    E["fr_1982"] = cifra("1982", "NACE FERRERO ROCHER EN ALBA, SEGÚN LA PROPIA MARCA", "1f31f")
    E["fr_capas"] = lista([("1f330", "una avellana entera"), ("1f95c", "crema de avellana"), ("1f9c7", "oblea crujiente"), ("1f36b", "chocolate y avellana")], "CAPAS, COMO UNA JOYA")
    E["fr_roca"] = f'''{F()}{obj(spr("1faa8", 280), 28, 50, "pop", "bob", .2)}{txt(kt("ROCHER = *ROCA*", "xl", .6), 68, 42, 52)}{txt(kt("en francés; por su superficie irregular", "l naranja", 1.3), 68, 58, 52)}'''
    E["fr_lourdes"] = icono_texto("1f64f", "LA ROCA *DE MASSABIELLE*", "en Lourdes; Michele Ferrero era muy devoto", "según varias fuentes", "izq", "sepia", False, "pop", "glow", 380, (("1f1eb-1f1f7", 84, 20),))
    E["fr_homenaje"] = titular("UN HOMENAJE *A ESA ROCA*", "según se cuenta", "", ("1faa8", "1f64f", "1f31f", "2728"), "navidad", True, "xl")
    E["fr_acierto"] = impacto("el gran acierto no fue solo la receta:", "FUE *CÓMO SE PRESENTABA*", "", "1f381")
    E["fr_dorado"] = f'''{F("navidad", True)}{piramide(4, 140, 30, 74)}{txt(kt("PAPEL DORADO, *CAJA TRANSPARENTE*", "xl hueso", .8), 72, 44, 50)}'''
    E["fr_lujo"] = comparar("1f48e", "parece de lujo", "1f4b6", "precio al alcance de casi todos", "PERO", "")
    E["fr_asequible"] = titular("*LUJO ASEQUIBLE*", "un regalo elegante que no arruina a nadie", "", ("1f31f", "1f381", "1f4b6", "2728"))
    E["fr_inmigrantes"] = icono_texto("1f30d", "UN SÍMBOLO *EN MUCHAS FAMILIAS*", "el regalo para las visitas importantes", "según el diario italiano Il Post", "der", "calido", True, "pop", "bob")
    E["fr_mensaje"] = f'''{F("navidad", True)}{obj(bombon(320), 30, 52, "none", "bob", 0)}{txt(kt("«ESTA OCASIÓN *ES ESPECIAL*»", "xl hueso", .6), 70, 44, 52)}{txt(kt("y la Navidad, la que más", "l naranja", 1.3), 70, 58, 52)}'''
    E["fr_anuncio"] = impacto("y luego está", "EL *ANUNCIO*", "uno de los más parodiados de los noventa", "1f4fa")
    E["fr_recepcion"] = f'''{F("dark", True)}{piramide(3, 120, 70, 76, .6)}{obj(spr("1f935", 280), 26, 54, "left", "bob", .2)}{txt(kt("LA RECEPCIÓN *DEL EMBAJADOR*", "xl hueso", .6), 62, 22, 70)}'''
    E["fr_mimando"] = bocadillos("1f478", ["Embajador…", "…con estos bombones nos está mimando"], "la frase que todos recuerdan")
    E["fr_broma"] = comparar("1f1ec-1f1e7", "en el Reino Unido: broma nacional", "1f1ea-1f1f8", "en España: versiones y parodias", "+", "")
    E["fr_cursi"] = comparar("1f644", "exagerado, casi cursi", "2705", "pero funcionó", "→", "LO QUE SE SIRVE EN LAS FIESTAS ELEGANTES")
    E["fr_piramide"] = f'''{F("navidad", True)}{piramide(4, 150, 50, 80)}{txt(kt("UNA PIRÁMIDE: *UN GUIÑO AL EMBAJADOR*", "xl hueso", .8), 50, 18, 90)}'''
    E["fr_misterio"] = impacto("y ahora,", "EL MISTERIO *DEL VERANO*", "", "1f575-fe0f")
    E["fr_derrite"] = icono_texto("1f321-fe0f", "EL CHOCOLATE *SE DERRITE*", "y un bombón con capas sufre mucho con el calor", "", "izq", "calido", True, "pop", "shake")
    E["fr_retira"] = icono_texto("1f6d2", "SE RETIRA *EN LOS MESES DE CALOR*", "y donde la Navidad es en verano, más cuidado", "según la propia empresa", "der", "", False, "pop", "bob")
    E["fr_encanto"] = comparar("1f342", "reaparece en otoño", "1f384", "anuncia las fiestas", "→", "PARTE DE SU ENCANTO")
    E["fr_pueblos"] = icono_texto("1f3d8-fe0f", "PUEBLOS *ILUMINADOS DE DORADO*", "«juntos brillamos más»", "campañas navideñas en España", "izq", "navidad", True, "pop", "glow")
    E["fr_brilla"] = titular("SE ESCONDE EN VERANO, *BRILLA EN NAVIDAD*", "", "", ("2600-fe0f", "27a1-fe0f", "1f384", "1f31f"), "navidad", True, "xl")
    E["fr_reservado"] = icono_texto("1f910", "MICHELE *FERRERO*", "casi nunca hablaba con la prensa", "", "izq", "dark", False, "pop", "")
    E["fr_entrevistas"] = lista([("1f399-fe0f", "apenas entrevistas"), ("1f445", "probaba él mismo los sabores"), ("1f36b", "que hablen los productos")], "SEGÚN SE CUENTA")
    E["fr_2015"] = cifra("14 FEB. 2015", "MUERE A LOS 89 AÑOS, EL HOMBRE MÁS RICO DE ITALIA SEGÚN LA PRENSA", "1f56f-fe0f")
    E["fr_giovanni"] = lista([("1f46a", "en manos de la familia"), ("1f468-200d-1f4bc", "la dirige su hijo Giovanni"), ("1f6ab", "no cotiza en bolsa"), ("1f3ed", "fábrica histórica en Alba")], "HOY")
    E["fr_imperio"] = flecha("1f35e", "1f30d", "DE LA MERIENDA DE POSGUERRA *A UN IMPERIO*", "")
    E["leccion1"] = leccion(1, "la escasez puede ser", "*EL ORIGEN DE UNA GRAN RECETA*", "1f330")
    E["leccion2"] = leccion(2, "la presentación", "*TAMBIÉN SE COME*", "1f31f")
    E["leccion3"] = leccion(3, "un límite puede convertirse", "*EN UNA VENTAJA*", "2600-fe0f")
    E["fr_final"] = lista([("1f330", "avellanas"), ("1f52a", "una pasta para cortar"), ("1faa8", "una roca"), ("1f935", "un embajador"), ("1f31f", "papel dorado")], "")
    E["fr_detras"] = f'''{F("navidad", True)}{piramide(3, 150, 28, 72)}{txt(kt("YA SABES *LO QUE HAY DETRÁS*", "xl hueso", .8), 72, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:60px;top:200px">{bombon(330, None)}</div>
      <div style="position:absolute;left:330px;top:150px">{vicon("sun", 170)}</div>
      <div style="position:absolute;left:330px;top:150px;width:170px;height:170px;font-family:Bebas;font-size:200px;line-height:150px;color:#D7263D;text-align:center;text-shadow:3px 3px 0 #111">✕</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">EL BOMBÓN QUE</div><div class="q" style="font-size:150px;margin-top:22px">SE ESCONDE</div><div class="y">EN VERANO</div></div>'''
