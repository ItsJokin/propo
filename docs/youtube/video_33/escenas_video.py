"""Escenas del vídeo 33 (Pringles, formato largo). Motor común; sin logotipos ni la mascota: tubos y patatas genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f6cd-fe0f", 2: "1f40e", 3: "1f922", 4: "1f680", 5: "2753", 6: "2696-fe0f", 7: "1f3a2", 8: "1f1ec-1f1e7",
              9: "1faa6", 10: "267b-fe0f", 11: "1f91d", 12: "1f9e0"}

def tubo(px=200, color=ROJO):
    return (f'<svg width="{px}" height="{px*2.4:.0f}" viewBox="0 0 100 240"><rect x="10" y="20" width="80" height="210" rx="8" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<ellipse cx="50" cy="20" rx="42" ry="10" fill="#e8e8e8" stroke="{TINTA}" stroke-width="4"/><rect x="10" y="90" width="80" height="44" fill="#fff" opacity=".9"/>'
            f'<text x="50" y="121" font-family="Bebas" font-size="22" fill="{TINTA}" text-anchor="middle">PATATAS</text><ellipse cx="50" cy="230" rx="40" ry="6" fill="#999"/></svg>')

def chip(px=220, rot=0):
    return (f'<svg width="{px}" height="{px*0.7:.0f}" viewBox="0 0 200 140" style="transform:rotate({rot}deg)"><path d="M10,60 Q100,-10 190,60 Q100,150 10,60Z" fill="#f2c24f" stroke="#b07a1e" stroke-width="5"/>'
            f'<path d="M30,62 Q100,30 170,62" fill="none" stroke="#d9a032" stroke-width="5" opacity=".7"/><circle cx="70" cy="70" r="4" fill="#c98a2a"/><circle cx="125" cy="58" r="3" fill="#c98a2a"/></svg>')

def pila(n=6, px=200, d=0.0):
    return "".join(obj(chip(px), 50, 62 - i * 5, "drop", "", d + i * .15) for i in range(n))

def escenas():
    E = {}
    E["pr_tubo"] = f'''{F("", True)}{obj(tubo(170), 26, 50, "drop", "float", .2)}{obj(chip(200, -10), 44, 30, "pop", "bob", .8)}{txt(kt("UN TUBO, UN *POP*, PATATAS IGUALES", "xl", 1.0), 70, 46, 52)}'''
    E["pr_mundo"] = titular("UNO DE LOS APERITIVOS *MÁS RECONOCIBLES*", "del mundo", "", ("1f30d", "1f954", "2728", "1f37f"), "", True, "xl")
    E["pr_quimico"] = comparar("1f9ea", "la forma: un químico", "1f680", "la máquina: ¿un escritor de ciencia ficción?", "+")
    E["pr_jueces"] = icono_texto("2696-fe0f", "¿SON PATATAS FRITAS *O NO?*", "hubo jueces que tuvieron que decidirlo", "", "izq", "", False, "pop", "swing")
    E["pr_enterrado"] = icono_texto("1faa6", "ENTERRADO *EN SU TUBO*", "y su familia lo hizo", "el inventor pidió ser…", "der", "dark", False, "pop", "")
    E["pr_historia"] = titular("LA HISTORIA DE *PRINGLES*", "", "", ("1f954", "1f9ea", "2696-fe0f", "1faa6"), "", True, "xl")
    E["pr_bolsas"] = icono_texto("1f6cd-fe0f", "PATATAS *DE BOLSA*", "un aperitivo muy popular", "EE. UU., años 50 y 60", "izq", "sepia", False, "pop", "bob")
    E["pr_quejas"] = icono_texto("1f620", "QUEJAS *DE LOS CLIENTES*", "en Procter & Gamble", "", "der", "", False, "pop", "swing")
    E["pr_problemas"] = lista([("1f4a8", "medio llenas de aire"), ("1f494", "rotas"), ("1f6e2-fe0f", "grasientas"), ("1f922", "rancias")], "")
    E["pr_distintas"] = f'''{F()}{obj(chip(260, -20), 22, 46, "pop", "", .2)}{obj(chip(130, 15), 46, 50, "pop", "", .5)}{obj(chip(190, 40), 70, 44, "pop", "", .8)}{obj(f'<div style="filter:brightness(.45)">{chip(150, -5)}</div>', 86, 56, "pop", "", 1.1)}{txt(kt("CADA UNA, *DISTINTA*", "xl", 1.3), 50, 84, 90)}'''
    E["pr_perfecta"] = titular("LA PATATA *PERFECTA*", "siempre igual, que no se rompa", "la oportunidad:", ("1f954", "2728", "1f4af", "1f3af"))
    E["pr_baur"] = icono_texto("1f468-200d-1f52c", "FREDRIC *BAUR*", "químico orgánico, especialista en alimentos", "el encargo:", "izq", "", False, "up", "bob")
    E["pr_masa"] = lista([("1f954", "patata deshidratada"), ("1f963", "una masa"), ("1f373", "darle forma y freírla")], "NO CORTAR PATATAS, SINO…")
    E["pr_identicas"] = f'''{F("", True)}{"".join(obj(chip(150), 14 + i * 14.4, 46, "pop", "bob", .2 + i * .12) for i in range(6))}{txt(kt("TODAS *IDÉNTICAS*", "mega", .9, .12, "slam"), 50, 78, 90)}'''
    E["pr_dosanos"] = icono_texto("1f4c5", "UNOS *DOS AÑOS* DE PRUEBAS", "según su biografía", "", "der", "", False, "pop", "bob")
    E["pr_silla"] = comparar("1f40e", "una silla de montar", "1f954", "la forma de su patata", "=")
    E["pr_paraboloide"] = f'''{F("dark")}{obj(chip(360), 28, 48, "zoom", "spin-slow", .2)}{txt(kt("PARABOLOIDE *HIPERBÓLICO*", "xl hueso", .8), 68, 40, 54)}{txt(kt("encajan entre sí y son más resistentes", "l naranja", 1.5), 68, 58, 54)}'''
    E["pr_tubo_idea"] = f'''{F()}{obj(tubo(170), 30, 50, "drop", "", .2)}{txt(kt("UN TUBO: *NI AIRE, NI PATATAS ROTAS*", "xl", 1.0), 68, 46, 54)}'''
    E["pr_sabor"] = impacto("un problema:", "NO *SABÍAN BIEN*", "según se cuenta", "1f922")
    E["pr_forma_ok"] = lista([("2705", "la forma"), ("2705", "el tubo"), ("274c", "el sabor")], "")
    E["pr_aparcada"] = icono_texto("1f4e6", "LA IDEA, *APARCADA*", "Baur, a otros proyectos", "", "izq", "", False, "drop", "")
    E["pr_liepa"] = icono_texto("1f468-200d-1f52c", "ALEXANDER *LIEPA*", "retomó el trabajo y mejoró el sabor", "años después", "der", "", True, "up", "bob")
    E["pr_patente"] = icono_texto("1f4dc", "EN LA PATENTE: *LIEPA*", "no Baur", "curiosamente", "izq", "sepia", False, "pop", "bob")
    E["pr_reto"] = impacto("otro reto:", "MILLONES, *IGUALES Y RÁPIDO*", "", "1f3ed")
    E["pr_curioso"] = icono_texto("1f9d0", "UN PERSONAJE *MUY CURIOSO*", "", "", "der", "", False, "pop", "swing")
    E["pr_wolfe"] = icono_texto("1f468-200d-1f527", "GENE *WOLFE*", "trabajó en la maquinaria, según varias fuentes", "ingeniero", "izq", "", False, "up", "bob")
    E["pr_novelas"] = lista([("1f4d6", "novelas"), ("1f680", "ciencia ficción"), ("1f409", "fantasía")], "EN SUS RATOS LIBRES…")
    E["pr_scifi"] = titular("LA MÁQUINA… *DE UN ESCRITOR*", "si las fuentes tienen razón", "", ("1f680", "2699-fe0f", "1f4d6", "1f954"), "espacio", True, "xl")
    E["pr_1968"] = cifra("1968", "LLEGAN A LAS TIENDAS DE ALGUNAS ZONAS DE EE. UU.", "1f6d2")
    E["pr_newfangled"] = f'''{F("sepia", True)}{obj(tubo(150), 22, 50, "drop", "", .2)}{txt(kt("PRINGLE'S *NEWFANGLED* POTATO CHIPS", "xl", .7), 64, 42, 60)}{txt(kt("«las novedosas patatas fritas de Pringle»", "l", 1.5), 64, 60, 60)}<div class="viñeta"></div>'''
    E["pr_quien"] = impacto("pero…", "¿QUIÉN ERA *PRINGLE*?", "nadie lo sabe con seguridad", "2753")
    E["pr_calle"] = icono_texto("1f6e3-fe0f", "TEORÍA 1: *UNA CALLE*", "llamada Pringle, cerca de Cincinnati", "", "izq", "", False, "pop", "bob")
    E["pr_mark"] = icono_texto("1f4dc", "TEORÍA 2: *MARK PRINGLE*", "una patente sobre el procesado de patatas", "", "der", "", False, "pop", "bob")
    E["pr_suena"] = icono_texto("1f3b5", "TEORÍA 3: *SONABA BIEN*", "", "", "izq", "", False, "pop", "bob")
    E["pr_bigote"] = f'''{F("", True)}{obj(bigote(460), 50, 40, "pop", "", .3)}{txt(kt("UNA CARA CON *UN GRAN BIGOTE*", "xl", .9), 50, 64, 90)}{txt(kt("según la marca, se llama Julius Pringles", "l gris", 1.5), 50, 78, 90)}'''
    E["pr_gracia"] = icono_texto("1f612", "NINGUNA *GRACIA*", "a los fabricantes tradicionales", "", "izq", "", False, "pop", "swing")
    E["pr_masa2"] = comparar("1f954", "patatas fritas «de verdad»", "1f963", "masa de patata con forma", "VS")
    E["pr_presion"] = icono_texto("1f4e2", "PRESIONAN", "para que no se llamen solo «patatas fritas»", "", "der", "", False, "pop", "bob")
    E["pr_setenta"] = icono_texto("1f3db-fe0f", "AÑOS 70: *ACLARAR*", "si dicen «chip», hechas con patata deshidratada", "", "izq", "", False, "pop", "")
    E["pr_crisps"] = flecha("1f954", "1f50a", "DE «CHIPS»… *A «CRISPS»*", "otra palabra para algo crujiente")
    E["pr_rapido"] = icono_texto("1f4c8", "POPULARES *ENSEGUIDA*", "pero no todo fue un éxito", "", "der", "", False, "pop", "bob")
    E["pr_artificial"] = icono_texto("1f4c9", "«DEMASIADO *ARTIFICIALES*»", "años 70: las ventas caen", "", "izq", "", False, "pop", "")
    E["pr_receta"] = lista([("1f9d1-200d-1f373", "la receta"), ("1f336-fe0f", "nuevos sabores"), ("1f4fa", "publicidad")], "PROCTER & GAMBLE TRABAJA EN…")
    E["pr_pop"] = bocadillos("1f60b", ["Una vez que haces pop…", "…ya no puedes parar"], "años 90: el eslogan")
    E["pr_paises"] = f'''{F("", True)}{obj(spr("1f30d", 280), 30, 50, "zoom", "spin-slow", .2)}{obj(tubo(110), 44, 66, "pop", "", .8)}{txt(kt("EL TUBO: *SU SEÑA DE IDENTIDAD*", "xl", 1.0), 70, 42, 50)}{txt(kt("en decenas de países", "l", 1.5), 70, 58, 50)}'''
    E["pr_sabores"] = lista([("1f9c0", "queso"), ("1f336-fe0f", "picante"), ("1f33f", "algas"), ("1f990", "marisco")], "DECENAS DE SABORES")
    E["pr_uk"] = icono_texto("1f1ec-1f1e7", "REINO UNIDO: *A LOS TRIBUNALES*", "esta vez, por dinero", "", "izq", "", False, "pop", "bob")
    E["pr_iva"] = comparar("1f34e", "la mayoría de alimentos: sin IVA", "1f954", "las patatas fritas: con IVA", "≠")
    E["pr_42"] = cifra("42 %", "DE PATATA, APROXIMADAMENTE", "1f954", "Procter & Gamble: «no son patatas fritas»")
    E["pr_naturaleza"] = icono_texto("1f333", "«UNA FORMA QUE NO EXISTE *EN LA NATURALEZA*»", "según contó la prensa británica", "", "der", "", False, "pop", "bob")
    E["pr_2008"] = impacto("2008: un tribunal le da la razón", "¡NO SON *PATATAS FRITAS*!", "", "2696-fe0f")
    E["pr_apelacion"] = icono_texto("1f9d1-200d-2696-fe0f", "2009: *REVOCADO*", "una persona normal diría: sí, son patatas fritas", "Tribunal de Apelación", "izq", "", False, "pop", "bob")
    E["pr_pagar"] = cifra("IVA", "UN ASUNTO DE MUCHOS MILLONES DE LIBRAS", "1f4b7", "tuvieron que pagar el")
    E["pr_orgulloso"] = icono_texto("1f474", "BAUR, *MUY ORGULLOSO*", "de su tubo", "ya jubilado", "der", "sepia", False, "up", "bob")
    E["pr_deseo"] = bocadillos("1f474", ["Cuando muera…", "…enterradme en un tubo"], "su deseo")
    E["pr_muere"] = cifra("2008", "MUERE FREDRIC BAUR, CON 89 AÑOS", "1f56f-fe0f")
    E["pr_farmacia"] = icono_texto("1f3ea", "UNA PARADA *DE CAMINO AL FUNERAL*", "a comprar un tubo… ¿de qué sabor?", "según contaron sus hijos", "izq", "", False, "pop", "bob")
    E["pr_original"] = f'''{F("dark")}{obj(tubo(170), 30, 50, "drop", "", .2)}{txt(kt("EL ORIGINAL", "mega hueso", .6, .12, "slam"), 68, 40, 56)}{txt(kt("parte de sus cenizas, en un cementerio de Cincinnati", "l naranja", 1.4), 68, 58, 56)}'''
    E["pr_problema"] = impacto("pero el tubo también trajo", "*PROBLEMAS*", "", "26a0-fe0f")
    E["pr_2018"] = icono_texto("267b-fe0f", "2018: *DE LOS PEORES PARA RECICLAR*", "según los recicladores del Reino Unido", "", "izq", "", False, "spin", "")
    E["pr_materiales"] = lista([("1f4e6", "cartón"), ("1fa99", "lámina metálica"), ("1f529", "base de metal"), ("1f9f4", "tapa de plástico")], "DEMASIADOS MATERIALES")
    E["pr_basura"] = icono_texto("1f5d1-fe0f", "MUCHOS, *A LA BASURA*", "separarlos es muy difícil", "", "der", "", False, "drop", "")
    E["pr_pesadilla"] = impacto("su portavoz lo llamó", "UNA *PESADILLA*", "para los recicladores", "1f631")
    E["pr_pruebas"] = icono_texto("1f9ea", "ENVASES *MÁS FÁCILES DE RECICLAR*", "la marca los ha ido probando", "", "izq", "", True, "pop", "bob")
    E["pr_vende"] = icono_texto("1f9fc", "P&G: *LIMPIEZA E HIGIENE*", "y Pringles, a la venta", "", "der", "", False, "pop", "bob")
    E["pr_frustrada"] = icono_texto("1f494", "UNA PRIMERA VENTA *FRUSTRADA*", "a otra empresa de aperitivos", "", "izq", "", False, "pop", "")
    E["pr_kelloggs"] = cifra("2.700 M$", "2012: LA COMPRA KELLOGG'S, LA DE LOS CEREALES", "1f963")
    E["pr_mars"] = flecha("1f963", "1f36b", "KELLANOVA… *Y MARS*", "2024: la de las chocolatinas acuerda comprarla")
    E["pr_manos"] = lista([("1f9fc", "detergentes"), ("1f963", "cereales"), ("1f36b", "chocolatinas")], "DE MANO EN MANO")
    E["leccion1"] = leccion(1, "a veces el producto nace", "*DEL ENVASE*", "1f4e6")
    E["leccion2"] = leccion(2, "la ciencia", "*TAMBIÉN VENDE*", "1f4d0")
    E["leccion3"] = leccion(3, "la definición importa:", "*MILLONES EN IMPUESTOS*", "2696-fe0f")
    E["pr_final"] = lista([("1f4a8", "una bolsa de aire"), ("1f9ea", "un químico"), ("1f40e", "una silla de montar"), ("1f680", "un escritor"), ("1faa6", "un tubo")], "")
    E["pr_pop2"] = f'''{F("calido", True)}{obj(tubo(170), 28, 50, "drop", "float", .2)}{txt(kt("*¡POP!*", "mega", .6, .12, "slam"), 66, 38, 50)}{txt(kt("ya sabes de dónde viene", "l", 1.3), 66, 56, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo dark" style="inset:0"></div>
      <div style="position:absolute;left:140px;top:110px">{tubo(210)}</div>
      <div style="position:absolute;left:330px;top:440px">{vicon("headstone", 200)}</div>
      <div class="big" style="top:100px"><div class="s" style="color:#FAF7F0">EL INVENTOR, ENTERRADO</div><div class="q" style="font-size:170px;margin-top:22px">EN SU</div><div class="q" style="font-size:170px">TUBO</div><div class="y">LA HISTORIA DE PRINGLES</div></div>'''
