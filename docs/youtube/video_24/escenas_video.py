"""Escenas del vídeo 24 (Barbie, formato largo). Motor común; sin logotipos ni la muñeca real: siluetas y objetos genéricos."""
from base import *

CAP_ICONOS = {1: "1f3ed", 2: "1f4c4", 3: "1f1e9-1f1ea", 4: "1f389", 5: "2696-fe0f", 6: "1f469-200d-1f680", 7: "1f4e2", 8: "1f4c9",
              9: "1f4a1", 10: "1f3ac", 11: "1f9e0"}
ROSA = "#e84a8a"

def caja(px=260, color=ROSA, texto="MUÑECA"):
    return (f'<svg width="{px}" height="{px*1.5:.0f}" viewBox="0 0 120 180"><rect x="6" y="6" width="108" height="168" rx="10" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="20" y="36" width="80" height="120" rx="8" fill="#fde8f0" stroke="{TINTA}" stroke-width="3"/><circle cx="60" cy="62" r="12" fill="#f6c9a8"/>'
            f'<path d="M48,76 L72,76 L76,120 L44,120Z" fill="#151515"/><path d="M48,84 L72,84 M46,96 L74,96 M45,108 L75,108" stroke="#fff" stroke-width="5"/>'
            f'<text x="60" y="28" font-family="Bebas" font-size="18" fill="#fff" text-anchor="middle">{texto}</text></svg>')

def recortable(px=200, color="#5aa0e8"):
    return (f'<svg width="{px}" height="{px*1.6:.0f}" viewBox="0 0 100 160"><rect x="2" y="2" width="96" height="156" fill="#fff" stroke="{GRIS}" stroke-width="2" stroke-dasharray="6 4"/>'
            f'<circle cx="50" cy="30" r="14" fill="#f6c9a8" stroke="{TINTA}" stroke-width="2"/><path d="M30,48 L70,48 L80,120 L20,120Z" fill="{color}" stroke="{TINTA}" stroke-width="2"/>'
            f'<rect x="36" y="120" width="10" height="30" fill="#f6c9a8"/><rect x="54" y="120" width="10" height="30" fill="#f6c9a8"/></svg>')

def escenas():
    E = {}
    E["ba_famosa"] = f'''{F("", True)}{obj(caja(260), 28, 50, "drop", "float", .2)}{txt(kt("LA MUÑECA *MÁS FAMOSA*", "xl", .7), 68, 40, 56)}{txt(kt("de la historia, probablemente", "l", 1.3), 68, 56, 56)}'''
    E["ba_profesiones"] = lista([("1f469-200d-1f680", "astronauta"), ("1f469-200d-2695-fe0f", "médica"), ("1f469-200d-2708-fe0f", "piloto"), ("1f3ac", "película (2023)")], "")
    E["ba_alemana"] = impacto("no nació en una fábrica de juguetes infantiles, sino de", "UNA MUÑECA *ALEMANA*", "que no estaba pensada para niñas", "1f1e9-1f1ea")
    E["ba_creadora"] = comparar("1f467", "el nombre de su hija", "2696-fe0f", "acusaciones de fraude", "…", "SU CREADORA")
    E["ba_reinventa"] = icono_texto("1f4a1", "VOLVIÓ A *INVENTAR ALGO*", "que cambió la vida de miles de personas", "y sin embargo…", "izq", "calido", True, "pop", "glow")
    E["ba_historia"] = titular("LA HISTORIA *COMPLETA*", "", "", ("1f380", "1f45b", "1f3e0", "2728"))
    E["ba_handler"] = comparar("1f469-200d-1f4bc", "Ruth Handler", "1f468-200d-1f527", "Elliot Handler", "+", "UNA PAREJA DE LOS ÁNGELES")
    E["ba_talentos"] = comparar("1f9ea", "él: diseño y plásticos", "1f4bc", "ella: talento para los negocios", "+")
    E["ba_1945"] = anio(1900, 1945, "con un socio, Harold Matson, fundan una pequeña empresa", "1f3ed")
    E["ba_mattel"] = f'''{F("", True)}{txt(kt("MATT", "mega rojo", .2, .1, "slam"), 28, 40, 30)}{txt(kt("de Matson", "l", .7), 28, 58, 30)}{txt('<div class="vs" style="--d:1s">+</div>', 50, 42, 10)}{txt(kt("EL", "mega", 1.2, .1, "slam"), 72, 40, 30)}{txt(kt("de Elliot", "l", 1.6), 72, 58, 30)}
      {txt(kt("= *MATTEL*", "xl", 2.0), 50, 82, 60)}'''
    E["ba_marcos"] = comparar("1f5bc-fe0f", "marcos de fotos", "1f3e0", "muebles para casas de muñecas", "→")
    E["ba_matson"] = icono_texto("1f6aa", "MATSON *SE MARCHA*", "los Handler se quedan al frente", "", "der", "", False, "pop", "")
    E["ba_tele"] = icono_texto("1f4fa", "ANUNCIOS *EN TELEVISIÓN*", "en un programa infantil, todo un año: algo poco habitual", "", "izq", "", True, "zoom", "pulse")
    E["ba_barbara"] = icono_texto("1f467", "SU HIJA, *BARBARA*", "", "", "izq", "sepia", False, "up", "bob")
    E["ba_juega"] = comparar("1f476", "muñecas bebé: no tanto", "1f469", "mujeres adultas: sí", "/")
    E["ba_recortables"] = f'''{F()}{obj(recortable(180, "#5aa0e8"), 18, 48, "drop", "", .2)}{obj(recortable(180, ROSA), 34, 48, "drop", "", .5)}{obj(recortable(180, "#f2b705"), 50, 48, "drop", "", .8)}
      {txt(kt("RECORTABLES DE *MUJERES ADULTAS*", "xl", 1.0), 76, 38, 40)}{txt(kt("trabajando, saliendo, viviendo su vida", "l", 1.6), 76, 58, 38)}'''
    E["ba_idea"] = icono_texto("1f4a1", "¿UNA MUÑECA *CON FORMA DE ADULTA*?", "", "la idea de Ruth:", "der", "calido", True, "pop", "glow")
    E["ba_mayores"] = icono_texto("1f4ad", "IMAGINAR *LO QUE QUERÍAN SER*", "de mayores", "", "izq", "", True, "pop", "float")
    E["ba_propone"] = flecha("1f469-200d-1f4bc", "1f465", "SE LO PROPONE *A SU EQUIPO*", "")
    E["ba_no"] = bocadillos("1f645", ["A los padres no les gustará", "Será demasiado caro de fabricar"], "la respuesta fue un no")
    E["ba_europa"] = anio(1900, 1956, "la familia viaja por Europa", "2708-fe0f")
    E["ba_escaparate"] = icono_texto("1fa9f", "UN ESCAPARATE *EN SUIZA*", "exactamente lo que tenía en la cabeza", "", "izq", "", True, "zoom", "", 340, (("1f1e8-1f1ed", 86, 22),))
    E["ba_lilli"] = f'''{F("calido", True)}{obj(caja(240, "#3b3b3b", "LILLI"), 28, 50, "zoom", "", .2)}{txt(kt("UNA MUÑECA ALEMANA:", "l", .5), 68, 36, 56)}{txt(kt("*LILLI*", "mega", .9, .12, "slam"), 68, 54, 56)}'''
    E["ba_detalle"] = impacto("pero había un detalle:", "NO ERA PARA *NIÑAS*", "", "26a0-fe0f")
    E["ba_comic"] = icono_texto("1f4f0", "PERSONAJE DE *UNA TIRA CÓMICA*", "una joven descarada; la muñeca era un regalo de broma para adultos", "", "der", "", False, "drop", "swing")
    E["ba_compra"] = f'''{F()}{"".join(obj(caja(150, "#3b3b3b", "LILLI"), 16 + i * 14, 48, "drop", "", .2 + i * .25) for i in range(3))}{txt(kt("COMPRA VARIAS *Y SE LAS LLEVA*", "xl", 1.2), 76, 44, 44)}'''
    E["ba_adaptan"] = flecha("1f1e9-1f1ea", "1f1fa-1f1f8", "LA ADAPTAN *PARA NIÑAS*", "con un diseñador de la empresa")
    E["ba_feria"] = fecha("9", "MARZO", "1959", "feria del juguete de Nueva York", "1f5fd")
    E["ba_banador"] = f'''{F("", True)}{obj(caja(280), 30, 50, "drop", "float", .2)}{txt(kt("BAÑADOR DE *RAYAS*", "xl", .7), 70, 38, 52)}{txt(kt("3 $", "mega rojo", 1.2, .1, "slam"), 70, 58, 52)}'''
    E["ba_nombre"] = f'''{F("calido", True)}{obj(spr("1f467", 240), 26, 46, "pop", "bob", .2)}{txt(kt("BARBARA →", "xl", .6), 66, 36, 56)}{txt(kt("*BARBIE*", "mega", 1.0, .12, "slam"), 66, 56, 56)}'''
    E["ba_biografia"] = icono_texto("1f4c7", "BARBARA *MILLICENT ROBERTS*", "de Willows, un pueblo ficticio de Wisconsin", "su biografía inventada:", "izq", "", True, "flip", "")
    E["ba_dudas"] = icono_texto("1f928", "LAS JUGUETERÍAS *DUDABAN*", "¿una muñeca con forma de mujer? no se venderá", "", "der", "", False, "pop", "swing")
    E["ba_ventas"] = cifra("CIENTOS DE MILES", "VENDIDAS EL PRIMER AÑO", "1f4c8", "se equivocaron:")
    E["ba_ropa"] = comparar("1f380", "la muñeca: relativamente barata", "1f457", "la ropa y los accesorios, aparte", "+", "EL NEGOCIO")
    E["ba_ken"] = icono_texto("1f466", "1961: *KEN*", "por el hijo de los Handler, Kenneth", "", "izq", "", True, "up", "bob")
    E["ba_parecido"] = comparar("1f380", "Barbie", "1f380", "Lilli", "≈", "SE PARECÍAN MUCHÍSIMO")
    E["ba_demanda"] = icono_texto("2696-fe0f", "DEMANDA *POR COPIA*", "de la empresa alemana que fabricaba Lilli", "", "der", "", False, "drop", "swing")
    E["ba_derechos"] = cifra("1964", "MATTEL COMPRA LOS DERECHOS DE LILLI", "1f4dd")
    E["ba_deja"] = f'''{F("dark", True)}{obj(caja(240, "#3b3b3b", "LILLI"), 50, 44, "none", "fuera", .4)}{txt(kt("LILLI *DEJA DE FABRICARSE*", "xl hueso", .8), 50, 86, 90)}'''
    E["ba_oficial"] = icono_texto("1f4d6", "UN ORIGEN *POCO CONTADO*", "durante años apenas se mencionaba; hoy es conocido", "", "izq", "", False, "pop", "")
    E["ba_espejo"] = titular("UN *ESPEJO* DE CADA ÉPOCA", "", "", ("1fa9e", "1f457", "1f3e0", "2728"))
    E["ba_trabajos"] = f'''{F()}{"".join(obj(spr(c, 140), 10 + i * 13.3, 44, "pop", "bob", .1 + i * .15) for i, c in enumerate(["1f469-200d-1f680", "1f469-200d-2695-fe0f", "1f469-200d-2708-fe0f", "1f469-200d-1f52c", "1f469-200d-1f4bc", "1f469-200d-1f3eb", "1f5f3-fe0f"]))}
      {txt(kt("TRABAJOS *POCO HABITUALES* PARA LAS MUJERES DE SU ÉPOCA", "xl", 1.2), 50, 78, 90)}'''
    E["ba_astronauta"] = f'''{F("espacio", True)}{obj(spr("1f469-200d-1f680", 260), 30, 46, "rise", "float", .2)}{obj(spr("1f315", 160), 74, 22, "pop", "spin-slow", .8)}{txt(kt("1965: BARBIE *ASTRONAUTA*", "xl hueso", .7), 68, 50, 56)}{txt(kt("años antes de que nadie pisara la Luna", "l naranja", 1.4), 68, 66, 56)}'''
    E["ba_casa"] = icono_texto("1f3e0", "SU *CASA DE ENSUEÑO*", "desde los sesenta, renovada durante décadas", "", "der", "", True, "rise", "bob")
    E["ba_modas"] = lista([("1f3e0", "casas"), ("1f697", "coches"), ("1f457", "ropa")], "CAMBIABAN CON LAS MODAS")
    E["ba_cientos"] = cifra("CIENTOS", "DE PROFESIONES DISTINTAS, SEGÚN MATTEL", "1f4bc")
    E["ba_imaginar"] = icono_texto("1f4ad", "IMAGINAR *TODO LO QUE PODÍAN SER*", "", "", "izq", "calido", True, "pop", "float")
    E["ba_criticada"] = impacto("también ha sido una de las muñecas", "MÁS *CRITICADAS*", "", "1f4e2")
    E["ba_proporciones"] = icono_texto("1f4cf", "PROPORCIONES *IMPOSIBLES*", "una imagen irreal del cuerpo, según sus críticos", "", "izq", "", False, "pop", "")
    E["ba_mates"] = bocadillos("1f5e3-fe0f", ["«La clase de matemáticas es difícil»"], "una frase de una versión que hablaba, en los noventa; Mattel la cambió")
    E["ba_rubias"] = icono_texto("1f471-200d-2640-fe0f", "CASI TODAS *RUBIAS, BLANCAS Y DELGADAS*", "durante décadas", "", "der", "", False, "pop", "")
    E["ba_diversidad"] = f'''{F("", True)}{"".join(obj(spr(c, 150), 12 + i * 15, 44, "pop", "bob", .1 + i * .2) for i, c in enumerate(["1f469-1f3fb", "1f469-1f3fd", "1f469-1f3ff", "1f469-1f3fc", "1f469-1f3fe", "1f469"]))}
      {txt(kt("ORÍGENES, TONOS DE PIEL Y *TIPOS DE CUERPO* (2016)", "xl", 1.3), 50, 78, 90)}'''
    E["ba_tardia"] = comparar("1f44f", "muchos lo celebraron", "23f0", "otros: una reacción tardía", "·")
    E["ba_que_fue"] = impacto("", "¿Y QUÉ FUE DE *RUTH HANDLER*?", "", "1f469-200d-1f4bc")
    E["ba_cancer"] = icono_texto("1f397-fe0f", "CÁNCER *DE MAMA*", "1970: una mastectomía", "", "izq", "", False, "pop", "")
    E["ba_internos"] = icono_texto("1f3ed", "PROBLEMAS *EN MATTEL*", "", "mientras tanto,", "der", "", False, "drop", "shake")
    E["ba_salen"] = icono_texto("1f6aa", "LOS HANDLER *SALEN DE SU EMPRESA*", "mediados de los setenta", "", "izq", "dark", False, "pop", "")
    E["ba_acusada"] = icono_texto("2696-fe0f", "ACUSADA POR *LAS CUENTAS DE MATTEL*", "1978: no impugnó la acusación; multa y trabajos para la comunidad", "", "der", "dark", True, "drop", "swing")
    E["ba_peor"] = impacto("la creadora de la muñeca más famosa", "SALIÓ *DE LA PEOR MANERA*", "", "1f494")
    E["ba_notermina"] = impacto("pero su historia", "NO TERMINA *AHÍ*", "", "2728")
    E["ba_protesis"] = icono_texto("1f61f", "PRÓTESIS *INCÓMODAS*", "y poco realistas: lo comprobó ella misma", "", "izq", "", False, "pop", "")
    E["ba_empresa"] = icono_texto("1f3ed", "UNA EMPRESA *DE PRÓTESIS MEJORES*", "con la misma determinación que con Barbie", "", "der", "calido", True, "zoom", "bob")
    E["ba_clientas"] = icono_texto("1f469-200d-1f4bc", "ELLA MISMA *ATENDÍA A LAS CLIENTAS*", "en las tiendas", "", "izq", "", True, "up", "bob")
    E["ba_miles"] = titular("AYUDÓ A *MILES DE MUJERES*", "su segundo invento", "", ("1f497", "1f469", "2728", "1f91d"), "", True, "xl")
    E["ba_muere"] = icono_texto("1f56f-fe0f", "RUTH HANDLER *MUERE EN 2002*", "", "", "der", "dark", False, "pop", "glow")
    E["ba_dificiles"] = comparar("1f3ae", "juguetes electrónicos", "1f4c9", "menos ventas", "→", "LOS AÑOS DOS MIL")
    E["ba_bratz"] = icono_texto("1f46f-200d-2640-fe0f", "2001: LAS *BRATZ*", "una rival seria, más moderna y atrevida", "", "izq", "", True, "pop", "bob")
    E["ba_juicio"] = icono_texto("2696-fe0f", "AÑOS *EN LOS TRIBUNALES*", "su diseñador había trabajado antes para Mattel", "", "der", "", False, "drop", "swing")
    E["ba_giro"] = impacto("2023:", "UN GIRO *INESPERADO*", "", "1f3ac")
    E["ba_pelicula"] = icono_texto("1f3ac", "LA MÁS TAQUILLERA *DE 2023*", "la película dirigida por Greta Gerwig", "", "izq", "dark", True, "flip", "bob", 340, (("1f37f", 86, 80),))
    E["ba_rosa"] = f'''{F("", True)}<div class="pos" style="left:50%;top:50%;width:1920px;height:1080px;background:{ROSA};opacity:.25"></div>{"".join(obj(spr("1f9d1", 130), 10 + i * 11, 58, "up", "bob", .1 + i * .1) for i in range(8))}
      {txt(kt("CINES LLENOS *DE ROSA*", "xl", .9), 50, 24, 90)}'''
    E["ba_reirse"] = titular("REÍRSE DE SÍ MISMA… *Y GANAR*", "", "", ("1f602", "1f4b0", "1f380", "2728"), "", True, "xl")
    E["leccion1"] = leccion(1, "observar a su hija jugar", "LAS MEJORES IDEAS *SALEN DE OBSERVAR*", "1f440")
    E["leccion2"] = leccion(2, "la muñeca era barata", "LO RENTABLE *ERA LA ROPA*", "1f457")
    E["leccion3"] = leccion(3, "una marca que dura décadas", "TIENE QUE *CAMBIAR CON SU TIEMPO*", "1f504")
    E["ba_final"] = lista([("1f4c4", "recortables"), ("1f1e9-1f1ea", "una muñeca alemana"), ("1f459", "un bañador"), ("1f469-200d-1f4bc", "una mujer que se reinventó")], "")
    E["ba_esa"] = titular("ESA ES *LA HISTORIA DE BARBIE*", "", "", ("1f380", "1f457", "1f3e0", "2728"), "", True, "xl")
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0;background:#fde8f0"></div>
      <div style="position:absolute;left:40px;top:120px;transform:rotate(-6deg)">{caja(260, "#3b3b3b", "LILLI")}</div>
      <div style="position:absolute;left:250px;top:180px;transform:rotate(6deg)">{caja(240)}</div>
      <div class="big" style="top:100px"><div class="s">BARBIE NACIÓ COPIANDO</div><div class="q" style="font-size:170px;margin-top:22px">UNA MUÑECA</div><div class="q" style="font-size:170px">ALEMANA</div><div class="y">LA HISTORIA REAL</div></div>'''
