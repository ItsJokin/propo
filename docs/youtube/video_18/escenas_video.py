"""Escenas del vídeo 18 (Nutella, formato largo). Motor común; sin logotipos: tarros y huevos genéricos dibujados."""
from base import *

CAP_ICONOS = {1: '1f330', 2: '1f36b', 3: '1f35e', 4: '1f3f7-fe0f', 5: '1f3ed', 6: '1f92b', 7: '1f95a', 8: '1f1f9-1f1f7', 9: '1f6d2', 10: '2696-fe0f', 11: '1f4c5', 12: '1f9e0'}
MARRON = "#5b3a1e"

def tarro(px=200, texto="CREMA", d=0.0):
    return (f'<svg width="{px}" height="{px*1.25:.0f}" viewBox="0 0 100 125"><rect x="14" y="4" width="72" height="20" rx="6" fill="{HUESO}" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M12,24 h76 c4,0 6,4 6,10 v74 c0,8 -6,14 -14,14 h-60 c-8,0 -14,-6 -14,-14 v-74 c0,-6 2,-10 6,-10z" fill="{MARRON}" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="10" y="52" width="80" height="40" fill="{HUESO}"/><text x="50" y="80" font-family="Bebas" font-size="22" fill="{ROJO}" text-anchor="middle">{texto}</text></svg>')

def bloque(px=320):
    return (f'<svg width="{px}" height="{px*0.5:.0f}" viewBox="0 0 200 100"><path d="M10,30 L150,30 L190,10 L50,10Z" fill="#c9ced6" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="10" y="30" width="140" height="60" fill="#d8dce2" stroke="{TINTA}" stroke-width="3"/><path d="M150,30 L190,10 L190,70 L150,90Z" fill="#aeb4bd" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="10" y="30" width="40" height="60" fill="{MARRON}" stroke="{TINTA}" stroke-width="3"/></svg>')

def huevo(px=220, abierto=False):
    if abierto:
        return (f'<svg width="{px}" height="{px*1.2:.0f}" viewBox="0 0 100 120"><path d="M10,60 C10,20 90,20 90,60 L80,54 L70,62 L60,54 L50,62 L40,54 L30,62 L20,54Z" fill="{MARRON}" stroke="{TINTA}" stroke-width="3"/>'
                f'<ellipse cx="50" cy="80" rx="22" ry="26" fill="#FFD23F" stroke="{TINTA}" stroke-width="3"/><path d="M10,70 C10,112 90,112 90,70 L80,76 L70,68 L60,76 L50,68 L40,76 L30,68 L20,76Z" fill="{MARRON}" stroke="{TINTA}" stroke-width="3" opacity=".9"/></svg>')
    return (f'<svg width="{px}" height="{px*1.2:.0f}" viewBox="0 0 100 120"><ellipse cx="50" cy="62" rx="42" ry="54" fill="{HUESO}" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M8,62 C30,50 70,74 92,62" stroke="{ROJO}" stroke-width="8" fill="none"/></svg>')

def escenas():
    E = {}
    E["nu_cuchara"] = f'''{F("calido", True)}{obj(tarro(240), 30, 52, "drop", "", .2)}{obj(spr("1f944", 180), 36, 24, "drop", "swing", .7)}{txt(kt("«SOLO *UN POQUITO*»", "xl", .9), 70, 46, 50)}'''
    E["nu_famosa"] = titular("DE LAS MÁS *FAMOSAS* DEL PLANETA", "cremas para untar", "", ("1f35e", "1f944", "1f30d", "2b50"), "", True, "xl")
    E["nu_escasez"] = impacto("en la Italia de la posguerra,", "EL CHOCOLATE *ERA UN LUJO*", "", "1f36b")
    E["nu_idea"] = comparar("1f36b", "un poco de cacao", "1f330", "algo que allí sobraba", "+", "LA IDEA")
    E["nu_imperio"] = flecha("1f36b", "1f3ed", "DE CHOCOLATE BARATO… *A UN IMPERIO*", "")
    E["nu_alba"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("ALBA", "mega", .3, .1, "slam"), 50, 32, 95)}{txt(kt("Piamonte, norte de Italia", "l", 1.1), 50, 50, 80)}{obj(spr("1f1ee-1f1f9", 150), 86, 20, "pop", "bob", .8)}'''
    E["nu_colinas"] = lista([("26f0-fe0f", "colinas"), ("1f347", "vinos"), ("1f330", "avellanas")], "UNA TIERRA DE…")
    E["nu_pietro"] = icono_texto("1f468-200d-1f373", "PIETRO *FERRERO*", "tenía una pastelería", "", "izq", "sepia", False, "up", "bob", 360, (("1f382", 86, 80),))
    E["nu_arruinada"] = f'''{F("sepia", True)}{obj(spr("1f3da-fe0f", 230), 24, 46, "drop", "", .2)}{txt(kt("ITALIA, *ARRUINADA*", "xl", .6), 66, 36, 56)}{txt(kt("el cacao: escaso y carísimo", "l", 1.3), 66, 54, 56)}{obj(spr("1f36b", 150), 66, 74, "pop", "fuera", 1.8)}<div class="viñeta"></div>'''
    E["nu_tradicion"] = comparar("1f36b", "chocolate", "1f330", "avellanas", "+", "UNA VIEJA TRADICIÓN: QUE RINDA MÁS")
    E["nu_gianduja"] = f'''{F("", True)}{txt(kt("*GIANDUJA*", "mega", .3, .15, "slam"), 50, 32, 90)}{txt(kt("su origen se suele situar en Turín, en el siglo XIX", "xl", 1.0), 50, 56, 90)}{txt(kt("otra época en la que el cacao escaseaba", "l", 1.7), 50, 72, 90)}'''
    E["nu_perfecta"] = comparar("1f330", "avellanas: baratas y por todas partes", "1f36b", "cacao: no", "≠")
    E["nu_1946"] = anio(1900, 1946, "Pietro Ferrero crea su versión", "1f468-200d-1f373")
    E["nu_receta"] = lista([("1f330", "avellanas"), ("1f36c", "azúcar"), ("1f36b", "un poco de cacao")], "LA RECETA")
    E["nu_bloque"] = f'''{F()}{obj(bloque(440), 32, 50, "drop", "float", .2)}{txt(kt("*GIANDUJOT*", "mega", .7, .12, "slam"), 72, 38, 50)}{txt(kt("un bloque sólido, envuelto en aluminio", "l", 1.3), 72, 56, 50)}'''
    E["nu_lonchas"] = f'''{F("calido")}{obj(bloque(300), 24, 46, "pop", "", .2)}{obj(spr("1f52a", 160), 24, 24, "drop", "swing", .6)}{obj(spr("1f35e", 220), 54, 50, "pop", "bob", 1.0)}{txt(kt("EN LONCHAS, *SOBRE EL PAN*", "xl", 1.3), 80, 46, 36)}'''
    E["nu_barato"] = cifra("VARIAS VECES", "MÁS BARATO QUE EL CHOCOLATE", "1f4b6", "según las crónicas de la época:")
    E["nu_familias"] = icono_texto("1f46a", "LO MÁS PARECIDO *AL CHOCOLATE*", "para familias que no podían pagarlo", "", "izq", "", True, "pop", "bob")
    E["nu_fabrica"] = flecha("1f382", "1f3ed", "DE PASTELERÍA *A FÁBRICA*", "en poco tiempo")
    E["nu_furgonetas"] = f'''{F("", True)}<div class="carrera" style="--d:.2s">{spr("1f690", 300)}</div>{txt(kt("FURGONETAS POR LOS PUEBLOS", "xl", .5), 50, 30, 90)}{txt(kt("hasta las tiendas *más pequeñas*", "l", 1.2), 50, 46, 90)}'''
    E["nu_pietro_muere"] = icono_texto("1f56f-fe0f", "PIETRO MUERE *POCOS AÑOS DESPUÉS*", "el negocio pasa a la familia", "", "izq", "dark", False, "pop", "glow")
    E["nu_michele"] = icono_texto("1f468-200d-1f4bc", "MICHELE *FERRERO*", "el gran protagonista de esta historia", "su hijo:", "der", "", True, "up", "bob")
    E["nu_untar"] = flecha("1f9f1", "1f944", "DE BLOQUE… *A CREMA PARA UNTAR*", "principios de los años cincuenta")
    E["nu_supercrema"] = f'''{F("calido", True)}{obj(tarro(250, "SUPERCREMA"), 30, 50, "zoom", "bob", .2)}{txt(kt("*SUPERCREMA*", "mega", .7, .12, "slam"), 70, 46, 54)}'''
    E["nu_rebanada"] = f'''{F()}{obj(spr("1f9d2", 220), 22, 48, "up", "bob", .2)}{obj(spr("1f35e", 180), 38, 60, "pop", "", .6)}{obj(tarro(160), 56, 50, "pop", "", .9)}{txt(kt("UNA REBANADA *PARA UNTAR* EN LA TIENDA", "xl", 1.2), 80, 44, 36)}{txt(kt("según se cuenta", "l gris", 1.8), 80, 62, 36)}'''
    E["nu_exito"] = titular("ÉXITO *EN TODA ITALIA*", "barata y dulce", "", ("1f1ee-1f1f9", "1f60b", "1f35e", "1f4c8"))
    E["nu_alemania"] = flecha("1f1ee-1f1f9", "1f1e9-1f1ea", "SU PRIMERA FÁBRICA *FUERA DE ITALIA*", "mediados de los años cincuenta")
    E["nu_europa"] = icono_texto("1f30d", "MICHELE QUERÍA *TODA EUROPA*", "", "", "izq", "", True, "zoom", "spin-slow")
    E["nu_generico"] = icono_texto("1f6ab", "«SUPERCREMA»: *DEMASIADO GENÉRICO*", "en algunos países no se podía registrar", "", "der", "", False, "pop", "shake")
    E["nu_nuevo"] = impacto("había que buscar", "UN NOMBRE *NUEVO*", "", "1f4ad")
    E["nu_nut_ella"] = f'''{F("", True)}{txt(kt("NUT", "mega rojo", .2, .1, "slam"), 28, 40, 30)}{txt(kt("frutos secos, en inglés", "l", .7), 28, 58, 34)}{txt('<div class="vs" style="--d:1s">+</div>', 50, 42, 10)}
      {txt(kt("ELLA", "mega", 1.3, .1, "slam"), 72, 40, 30)}{txt(kt("terminación italiana y cariñosa", "l", 1.8), 72, 58, 34)}'''
    E["nu_nombre"] = f'''{F("calido", True)}{obj(tarro(280, "NUTELLA"), 50, 50, "zoom", "float", .3)}'''
    E["nu_1964"] = fecha("20", "ABRIL", "1964", "sale el primer tarro de la fábrica de Alba", "1f3ed")
    E["nu_idioma"] = icono_texto("1f5e3-fe0f", "FÁCIL *EN CUALQUIER IDIOMA*", "para un producto que quería salir de Italia", "", "izq", "", True, "pop", "bob", 340, (("1f30d", 86, 80),))
    E["nu_crece"] = titular("LA EMPRESA *NO PARA DE CRECER*", "con Michele Ferrero al frente", "", ("1f4c8", "1f3ed", "1f30d", "2b50"), "", True, "xl")
    E["nu_nosolo"] = impacto("y no solo", "CON *NUTELLA*", "", "1f36b")
    E["nu_kinder"] = comparar("1f36b", "chocolate Kinder", "1f36c", "caramelos Tic Tac", "+", "FINALES DE LOS SESENTA")
    E["nu_sorpresa"] = f'''{F("", True)}{obj(huevo(240), 28, 48, "drop", "bob", .2)}{txt(kt("1974", "mega rojo", .6, .1, "slam"), 70, 34, 50)}{txt(kt("*KINDER SORPRESA*", "xl", 1.1), 70, 54, 56)}'''
    E["nu_rocher"] = f'''{F("calido", True)}{"".join(obj(spr("1f7e1", 130), 18 + i * 12, 48, "drop", "glow", .1 + i * .15) for i in range(4))}{txt(kt("1982", "mega rojo", .8, .1, "slam"), 78, 34, 36)}{txt(kt("*FERRERO ROCHER*", "xl", 1.3), 78, 54, 40)}'''
    E["nu_discreto"] = icono_texto("1f92b", "FAMOSO POR *SU DISCRECIÓN*", "casi sin entrevistas; probaba él mismo los productos", "Michele Ferrero:", "izq", "", False, "pop", "bob")
    E["nu_valeria"] = icono_texto("1f469", "LA SEÑORA *VALERIA*", "su clienta imaginaria: una madre de familia corriente", "según se ha contado,", "der", "calido", True, "pop", "bob")
    E["nu_pregunta"] = f'''{F("", True)}{obj(spr("1f914", 250), 26, 46, "pop", "swing", .2)}{txt(kt("«¿LE GUSTARÍA ESTO *A VALERIA*?»", "xl", .7), 66, 46, 58)}'''
    E["nu_rico"] = icono_texto("1f4b0", "EL HOMBRE MÁS RICO *DE ITALIA*", "así se le consideraba cuando murió, en 2015", "", "izq", "dark", True, "zoom", "glow")
    E["nu_discreta"] = impacto("una de las empresas", "MÁS *DISCRETAS*", "del mundo de la alimentación", "1f92b")
    E["nu_secreto"] = comparar("1f3ed", "fábricas casi sin visitas", "1f510", "recetas guardadas en secreto", "+")
    E["nu_entrevistas"] = icono_texto("1f399-fe0f", "APENAS *ENTREVISTAS*", "durante décadas, ni la familia ni la empresa hacían ruido", "", "izq", "", False, "pop", "")
    E["nu_reputacion"] = cifra("Nº 1", "EN REPUTACIÓN, SEGÚN UN ESTUDIO INTERNACIONAL (2009)", "1f3c6")
    E["nu_fundacion"] = icono_texto("1f474", "UNA FUNDACIÓN *PARA SUS JUBILADOS*", "en Alba: cultura y atención para antiguos trabajadores", "", "der", "calido", True, "pop", "bob")
    E["nu_embajador"] = f'''{F("dark", True)}{"".join(obj(spr("1f7e1", 120), 14 + i * 9, 30, "drop", "glow", .1 + i * .12) for i in range(5))}{obj(spr("1f935", 220), 76, 44, "pop", "bob", .8)}
      {txt(kt("UNA RECEPCIÓN *DE EMBAJADORES*", "xl hueso", 1.0), 40, 60, 70)}{txt(kt("un anuncio británico que todavía se parodia", "l naranja", 1.6), 40, 76, 70)}'''
    E["nu_omnipresente"] = comparar("1f92b", "discreta por dentro", "1f30d", "omnipresente por fuera", "·")
    E["nu_huevo"] = impacto("un producto con una historia curiosa:", "*KINDER SORPRESA*", "", "1f95a")
    E["nu_capsula"] = f'''{F("", True)}{obj(huevo(260, True), 30, 50, "zoom", "", .2)}{obj(spr("1f9f8", 150), 52, 34, "pop", "jump", 1.0)}{txt(kt("CHOCOLATE · CÁPSULA · *JUGUETE*", "xl", .8), 74, 52, 46)}'''
    E["nu_coleccion"] = f'''{F()}{"".join(obj(spr(c, 130), 12 + i * 12.5, 44, "pop", "bob", .1 + i * .15) for i, c in enumerate(["1f9f8", "1f996", "1f697", "1f6f8", "1f99b", "1f9e9", "1f47e"]))}{txt(kt("HAY QUIEN COLECCIONA *SUS JUGUETES*", "xl", 1.3), 50, 80, 90)}'''
    E["nu_prohibido"] = f'''{F("dark", True)}{obj(huevo(240), 50, 40, "pop", "", .2)}{txt('<div class="equis" style="font-size:300px">✕</div>', 50, 40, 30, "center", .8, "pop")}{txt(kt("EN ESTADOS UNIDOS, *PROHIBIDO*", "xl hueso", 1.2), 50, 84, 90)}'''
    E["nu_ley"] = icono_texto("1f4dc", "UNA LEY *DE 1938*", "ningún objeto que no se pueda comer dentro de un dulce (salvo que tenga una función)", "", "izq", "sepia", False, "flip", "")
    E["nu_frontera"] = icono_texto("1f6c3", "CONFISCADOS *EN LA FRONTERA*", "", "", "der", "", True, "pop", "shake", 360, (("1f95a", 14, 80),))
    E["nu_mitades"] = comparar("1f36b", "una mitad, el dulce", "1f9f8", "la otra, el juguete", "|", "LA SOLUCIÓN: DOS MITADES SEPARADAS")
    E["nu_avellanas"] = f'''{F()}{"".join(obj(spr("1f330", 110), 8 + (i % 9) * 10.5, 26 + (i // 9) * 20, "drop", "", .05 + i * .04) for i in range(27))}{txt(kt("MUCHÍSIMAS *AVELLANAS*", "xl", 1.4), 50, 90, 90)}'''
    E["nu_cuarta"] = cifra("≈1/4", "DE LAS AVELLANAS DEL MUNDO", "1f330", "según diversas estimaciones, Ferrero compra")
    E["nu_turquia"] = icono_texto("1f1f9-1f1f7", "LA MAYORÍA, *EN TURQUÍA*", "un solo país produce la mayor parte de las avellanas del planeta", "", "izq", "", True, "pop", "bob")
    E["nu_sensible"] = lista([("1f321-fe0f", "el clima"), ("2744-fe0f", "las heladas"), ("1f33e", "las cosechas")], "DEPENDER DE UNA SOLA REGIÓN")
    E["nu_cosecha"] = flecha("1f33e", "1f4c8", "MALA COSECHA → *PRECIO POR LAS NUBES*", "en todo el mundo")
    E["nu_plantaciones"] = icono_texto("1f331", "NUEVAS PLANTACIONES *EN OTROS PAÍSES*", "y compra de empresas de avellanas, para no depender de un solo lugar", "", "der", "", True, "rise", "bob")
    E["nu_compras"] = impacto("en los últimos años:", "A COMPRAR *MARCAS AJENAS*", "", "1f6d2")
    E["nu_nestle"] = cifra("≈2.800 M$", "LAS GOLOSINAS DE NESTLÉ EN EE. UU. (2018)", "1f36c")
    E["nu_kelloggs"] = icono_texto("1f36a", "GALLETAS *DE KELLOGG'S*", "varias de sus marcas, al año siguiente", "", "izq", "", True, "pop", "bob")
    E["nu_mayores"] = flecha("1f382", "1f30d", "UNO DE LOS MAYORES GRUPOS *DE DULCES DEL MUNDO*", "")
    E["nu_familia"] = icono_texto("1f46a", "SIGUE SIENDO *DE LA FAMILIA*", "controlada por los Ferrero", "", "der", "calido", True, "up", "bob")
    E["nu_problemas"] = impacto("ser tan famoso", "TAMBIÉN TRAE *PROBLEMAS*", "", "26a0-fe0f")
    E["nu_demanda"] = icono_texto("2696-fe0f", "UNA DEMANDA *EN EE. UU.*", "2012: ¿la publicidad la vendía como desayuno saludable?", "", "izq", "", False, "drop", "swing")
    E["nu_acuerdo"] = cifra("≈3 M$", "ACUERDO PARA CERRAR EL CASO, Y ANUNCIOS NUEVOS", "1f4fa")
    E["nu_palma"] = icono_texto("1f334", "EL *ACEITE DE PALMA*", "criticado por su relación con la deforestación", "otra polémica:", "der", "", True, "pop", "swing")
    E["nu_royal"] = icono_texto("1f4fa", "«DEJAD DE COMER *NUTELLA*»", "lo pidió en televisión la ministra francesa Ségolène Royal (2015)", "", "izq", "dark", True, "zoom", "shake", 340, (("1f1eb-1f1f7", 86, 22),))
    E["nu_italia"] = f'''{F("calido", True)}{obj(spr("1f1ee-1f1f9", 200), 20, 34, "pop", "bob", .2)}{obj(spr("1f35e", 200), 20, 66, "pop", "bob", .5)}{txt(kt("«ESTA NOCHE CENO", "xl", .8), 64, 40, 60)}{txt(kt("*PAN CON NUTELLA*»", "xl", 1.3), 64, 56, 60)}{txt(kt("un ministro italiano", "l gris", 1.9), 64, 72, 60)}'''
    E["nu_disculpas"] = comparar("1f64f", "la ministra pidió disculpas", "1f331", "Ferrero: aceite de palma certificado", "·")
    E["nu_dia"] = impacto("la relación es tan intensa que tiene", "*SU PROPIO DÍA*", "", "1f4c5")
    E["nu_rosso"] = fecha("5", "FEBRERO", "2007", "una aficionada, Sara Rosso, propone el Día Mundial de la Nutella", "1f469")
    E["nu_internet"] = icono_texto("1f310", "SE HACE POPULAR *EN INTERNET*", "", "", "izq", "", True, "zoom", "spin-slow")
    E["nu_carta"] = comparar("2709-fe0f", "años después: una carta legal de la empresa", "1f504", "ante los fans, marcha atrás", "→")
    E["nu_hoy"] = titular("HOY LO CELEBRA *LA PROPIA MARCA*", "", "", ("1f389", "1f4c5", "1f35e", "2764-fe0f"), "", True, "xl")
    E["leccion1"] = leccion(1, "Nutella nació porque no había chocolate", "LA ESCASEZ PUEDE SER *UNA GRAN IDEA*", "1f4a1")
    E["leccion2"] = leccion(2, "el nombre importa", "SUPERCREMA PARA ITALIA, *NUTELLA PARA EL MUNDO*", "1f3f7-fe0f")
    E["leccion3"] = leccion(3, "si eres parte de la vida de la gente", "CUALQUIER ATAQUE *SE VIVE COMO PERSONAL*", "2764-fe0f")
    E["nu_final"] = lista([("1f468-200d-1f373", "un pastelero"), ("1f9f1", "un bloque barato"), ("1f944", "un tarro"), ("1f30d", "un nombre para el mundo")], "")
    E["nu_cuchara2"] = f'''{F("calido", True)}{obj(tarro(220, "NUTELLA"), 30, 52, "drop", "", .2)}{obj(spr("1f944", 170), 36, 26, "drop", "swing", .6)}{txt(kt("YA SABES *DE DÓNDE VIENE*", "xl", 1.0), 70, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:150px;transform:rotate(-8deg)">{tarro(300, "?")}</div>
      <div style="position:absolute;left:320px;top:470px">{vicon("chestnut", 150)}</div>
      <div class="big" style="top:100px"><div class="s">NUTELLA NACIÓ PORQUE</div><div class="q" style="font-size:170px;margin-top:22px">NO HABÍA</div><div class="q" style="font-size:150px">CHOCOLATE</div><div class="y">LA HISTORIA COMPLETA</div></div>'''
