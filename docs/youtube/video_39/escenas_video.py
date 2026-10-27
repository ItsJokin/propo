"""Escenas del vídeo 39 (Levi's, formato largo). Motor común; sin logotipos: vaqueros genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f1e9-1f1ea", 2: "1f4b0", 3: "1f9f5", 4: "1f529", 5: "2709-fe0f", 6: "1f1eb-1f1f7", 7: "1f40e", 8: "1f3da-fe0f",
              9: "26cf-fe0f", 10: "1f525", 11: "1f3ac", 12: "1f9f1", 13: "1f9e0"}

def vaqueros(px=260, color="#2f4f8a", remaches=True):
    r = "".join(f'<circle cx="{x}" cy="{y}" r="5" fill="#c98a3a" stroke="#7a4b1a" stroke-width="2"/>' for x, y in [(52, 40), (148, 40), (100, 82)]) if remaches else ""
    return (f'<svg width="{px}" height="{px*1.5:.0f}" viewBox="0 0 200 300"><path d="M30,14 L170,14 L182,290 L118,290 L100,96 L82,290 L18,290Z" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="30" y="14" width="140" height="18" fill="{color}" stroke="{TINTA}" stroke-width="3"/><path d="M36,34 Q60,60 52,40 M164,34 Q140,60 148,40" fill="none" stroke="#e8b04a" stroke-width="3"/>'
            f'<path d="M100,32 L100,96" stroke="#e8b04a" stroke-width="3" stroke-dasharray="6 4"/><path d="M40,150 L66,150 M134,150 L160,150" stroke="#e8b04a" stroke-width="2"/>{r}</svg>')

def parche(px=300):
    return (f'<svg width="{px}" height="{px*0.7:.0f}" viewBox="0 0 200 140"><rect x="6" y="6" width="188" height="128" rx="10" fill="#b5835a" stroke="#6b4423" stroke-width="5"/>'
            f'<rect x="80" y="44" width="40" height="56" fill="#6b4423"/><path d="M80,72 L30,72 M120,72 L170,72" stroke="#6b4423" stroke-width="4"/>'
            f'<text x="38" y="62" font-size="34">🐎</text><text x="140" y="62" font-size="34" transform="scale(-1,1) translate(-322,0)">🐎</text></svg>')

def escenas():
    E = {}
    E["lv_armario"] = f'''{F("", True)}{obj(vaqueros(260), 30, 50, "drop", "float", .2)}{txt(kt("PROBABLEMENTE *LLEVES UNOS AHORA*", "xl", .8), 70, 46, 52)}'''
    E["lv_planeta"] = lista([("1f477", "obreros"), ("1f393", "estudiantes"), ("1f3b8", "rockeros"), ("1f3db-fe0f", "presidentes")], "LA PRENDA MÁS EXTENDIDA DEL PLANETA")
    E["lv_trabajo"] = comparar("26cf-fe0f", "mineros", "1fa93", "leñadores", "+", "ROPA DE TRABAJO DEL OESTE")
    E["lv_remaches"] = icono_texto("1f529", "LOS REMACHES: *UN SASTRE SIN DINERO*", "para pagar la patente", "", "izq", "", True, "pop", "bob")
    E["lv_subasta"] = cifra("~50.000 $", "POR UNO DE SUS PANTALONES MÁS ANTIGUOS", "1f528", "más de un siglo después")
    E["lv_historia"] = titular("LA HISTORIA DE *LEVI'S*", "", "", ("1f456", "1f529", "1f40e", "1f4b0"), "", True, "xl")
    E["lv_buttenheim"] = f'''{F("sepia", True)}{obj(spr("1f1e9-1f1ea", 220), 22, 46, "drop", "bob", .2)}{txt(kt("BUTTENHEIM", "mega", .4, .12, "slam"), 64, 40, 64)}{txt(kt("Baviera, 1829: nace Löb Strauss", "l", 1.2), 64, 58, 64)}<div class="viñeta"></div>'''
    E["lv_restricciones"] = lista([("1f3e0", "dónde vivir"), ("1f6e0-fe0f", "en qué trabajar"), ("1f48d", "con quién casarse")], "RESTRICCIONES A LOS JUDÍOS DE BAVIERA")
    E["lv_emigran"] = flecha("1f1e9-1f1ea", "1f5fd", "LA FAMILIA *EMIGRA A NUEVA YORK*", "los hermanos: telas y mercería")
    E["lv_levi"] = comparar("1f466", "Löb", "1f468", "Levi", "→", "UN NOMBRE MÁS AMERICANO")
    E["lv_oro"] = cifra("1848", "ORO EN CALIFORNIA", "1fa99")
    E["lv_sanfrancisco"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("SAN FRANCISCO", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("de pueblo a ciudad de mineros y aventureros", "l", 1.1), 50, 48, 80)}'''
    E["lv_1853"] = icono_texto("1f3ea", "1853: *LEVI ABRE TIENDA*", "una sucursal del negocio familiar", "", "izq", "", False, "pop", "bob")
    E["lv_vende"] = lista([("1f9f5", "telas"), ("1f455", "ropa"), ("1f6cf-fe0f", "mantas")], "NO BUSCABA ORO: VENDÍA A QUIENES LO BUSCABAN")
    E["lv_palas"] = titular("LOS QUE SE HACEN RICOS: *LOS QUE VENDEN PALAS*", "", "en una fiebre del oro…", ("26cf-fe0f", "1f4b0", "1fa99", "1f914"), "", True, "xl")
    E["lv_davis"] = icono_texto("1f9d4", "JACOB *DAVIS*", "nacido en Letonia, sastre en Reno (Nevada)", "un cliente", "izq", "sepia", False, "up", "bob")
    E["lv_lonas"] = lista([("26fa", "tiendas de campaña"), ("1f6fb", "lonas para carros"), ("1f456", "ropa de trabajo")], "HACÍA…")
    E["lv_encargo"] = icono_texto("1f469", "UN ENCARGO", "la mujer de un trabajador, según la historia más repetida", "1871", "der", "", False, "pop", "bob")
    E["lv_rompe"] = icono_texto("1f6e0-fe0f", "BOLSILLOS *DESCOSIDOS*", "por el peso de las herramientas", "", "izq", "", False, "pop", "swing")
    E["lv_aguantar"] = impacto("necesitaba", "UNOS PANTALONES *QUE AGUANTARAN*", "", "1f4aa")
    E["lv_cobre"] = icono_texto("1f529", "REMACHES *DE COBRE*", "de las mantas de los caballos", "en su taller", "der", "", False, "pop", "bob", 380, (("1f40e", 14, 80),))
    E["lv_puntos"] = f'''{F()}{obj(vaqueros(280), 32, 50, "pop", "", .2)}{obj(spr("1f447", 110), 22, 18, "drop", "bob", .8)}{txt(kt("EN LOS PUNTOS *MÁS DÉBILES*", "xl", 1.0), 70, 42, 50)}{txt(kt("bolsillos y bragueta", "l", 1.5), 70, 58, 50)}'''
    E["lv_funciona"] = lista([("2705", "ya no se rompían"), ("1f477", "otros piden unos"), ("1f4c8", "más pedidos")], "FUNCIONÓ")
    E["lv_patentar"] = icono_texto("1f4dc", "PATENTARLO", "para que nadie lo copiara", "", "der", "", False, "pop", "bob")
    E["lv_68"] = cifra("68 $", "COSTABA LA PATENTE… Y NO LOS TENÍA", "1f4b8")
    E["lv_carta"] = flecha("1f9d4", "1f468", "UNA CARTA *A LEVI STRAUSS*", "")
    E["lv_trato"] = comparar("1f4b5", "Levi paga la patente", "1f91d", "a nombre de los dos", "+", "EL TRATO")
    E["lv_acepta"] = impacto("", "LEVI *ACEPTA*", "", "2705")
    E["lv_patente"] = fecha("20", "MAYO", "1873", "patente n.º 139.121", "1f4dc")
    E["lv_nacimiento"] = titular("NACEN *LOS VAQUEROS*", "", "ese día se considera…", ("1f456", "1f382", "1f529", "2728"))
    E["lv_fabrica"] = flecha("1f3ed", "1f30e", "DAVIS DIRIGE LA FÁBRICA", "y se venden en todo el Oeste")
    E["lv_monos"] = icono_texto("1f456", "«MONOS DE CINTURA»", "ni vaqueros ni jeans: pantalones de trabajo", "al principio", "izq", "sepia", False, "pop", "bob")
    E["lv_denim"] = icono_texto("1f9f5", "DENIM", "algodón resistente, azul índigo", "", "der", "", False, "pop", "bob")
    E["lv_nimes"] = comparar("1f9f5", "denim", "1f1eb-1f1f7", "«de Nimes», en francés", "←")
    E["lv_genova"] = comparar("1f456", "jeans", "1f1ee-1f1f9", "Génova, el puerto italiano", "←")
    E["lv_nombres"] = lista([("1f1fa-1f1f8", "el Oeste"), ("1f1eb-1f1f7", "una ciudad francesa"), ("1f1ee-1f1f9", "otra italiana")], "UN PANTALÓN, TRES LUGARES")
    E["lv_cuero"] = cifra("1886", "UNA ETIQUETA DE CUERO", "1f456")
    E["lv_caballos"] = f'''{F("calido", True)}{obj(spr("1f40e", 220), 18, 50, "left", "swing", .2)}{obj(vaqueros(160), 50, 50, "pop", "", .5)}{obj(f'<div style="transform:scaleX(-1)">{spr("1f40e", 220)}</div>', 82, 50, "right", "swing", .4)}{txt(kt("DOS CABALLOS… *Y NO LO ROMPEN*", "xl", 1.2), 50, 88, 90)}'''
    E["lv_leer"] = icono_texto("1f441-fe0f", "BASTABA *CON VER LA IMAGEN*", "publicidad para quien no sabía leer", "", "izq", "", False, "pop", "bob")
    E["lv_caduca"] = icono_texto("1f4c5", "1890: *CADUCA LA PATENTE*", "y llegan los competidores", "", "der", "", False, "pop", "")
    E["lv_501"] = comparar("1f456", "XX", "1f456", "501", "→", "EL GRAN CLÁSICO")
    E["lv_roja"] = icono_texto("1f3f7-fe0f", "1936: *UNA ETIQUETA ROJA*", "en el bolsillo trasero, contra las copias", "", "izq", "", True, "pop", "bob")
    E["lv_muere"] = icono_texto("1f474", "1902: *MUERE LEVI STRAUSS*", "sin hijos; la empresa, para sus sobrinos", "", "der", "", False, "pop", "")
    E["lv_terremoto"] = cifra("1906", "TERREMOTO E INCENDIOS EN SAN FRANCISCO", "1f3da-fe0f")
    E["lv_arden"] = f'''{F("dark")}{obj(spr("1f525", 280), 30, 50, "pop", "glow", .2)}{txt(kt("ARDEN LA SEDE *Y LOS ARCHIVOS*", "xl hueso", .8), 68, 42, 54)}{txt(kt("casi todos los documentos de los primeros años", "l naranja", 1.4), 68, 58, 54)}'''
    E["lv_busca"] = icono_texto("1f50e", "BUSCA *PANTALONES ANTIGUOS*", "para reconstruir su propia historia", "", "izq", "", True, "pop", "bob")
    E["lv_inesperado"] = impacto("y aparecen en", "LOS LUGARES *MÁS INESPERADOS*", "", "1f5fa-fe0f")
    E["lv_mina"] = icono_texto("26cf-fe0f", "EN UNA *MINA DE NEVADA*", "unos vaqueros de finales del siglo XIX", "", "der", "sepia", False, "drop", "")
    E["lv_gastados"] = f'''{F("sepia")}{obj(vaqueros(260, "#6b6f78"), 32, 50, "drop", "", .2)}{txt(kt("SUCIOS, ROTOS… *Y AUTÉNTICOS*", "xl", .9), 70, 46, 50)}<div class="viñeta"></div>'''
    E["lv_2001"] = cifra("46.532 $", "2001: LOS COMPRA LA PROPIA EMPRESA", "1f4bb", "en una subasta por internet")
    E["lv_archivo"] = icono_texto("1f5c4-fe0f", "EL ARCHIVO *DE LA MARCA*", "en una cámara a prueba de incendios", "San Francisco", "izq", "", False, "pop", "bob")
    E["lv_molestan"] = impacto("los remaches…", "NO TODOS *GUSTABAN*", "", "1f529")
    E["lv_rayan"] = lista([("1fa91", "sillas"), ("1f3eb", "pupitres"), ("1f3c7", "sillas de montar")], "LOS DE ATRÁS RAYABAN…")
    E["lv_tapados"] = cifra("1937", "LOS REMACHES TRASEROS, TAPADOS POR DENTRO", "1f9f5")
    E["lv_entrepierna"] = icono_texto("1f62c", "UN REMACHE *EN LA ENTREPIERNA*", "aún más problemático", "", "der", "", False, "pop", "swing")
    E["lv_hoguera"] = f'''{F("dark", True)}{obj(spr("1f525", 220), 30, 56, "pop", "glow", .2)}{obj(spr("1f975", 180), 30, 28, "pop", "bob", .8)}{txt(kt("UNA HOGUERA… *Y UN REMACHE CALIENTE*", "xl hueso", 1.0), 68, 44, 54)}{txt(kt("según cuenta la propia marca", "l naranja", 1.6), 68, 60, 54)}'''
    E["lv_desaparece"] = icono_texto("1f44b", "ADIÓS AL REMACHE *DE LA ENTREPIERNA*", "", "", "izq", "", True, "pop", "bob")
    E["lv_ropa"] = lista([("26cf-fe0f", "mineros"), ("1f9d1-200d-1f33e", "granjeros"), ("1f920", "vaqueros del Oeste")], "DURANTE DÉCADAS, ROPA DE TRABAJO")
    E["lv_ranchos"] = flecha("1f3d9-fe0f", "1f920", "AÑOS 30: VACACIONES *EN RANCHOS DEL OESTE*", "y vuelven con vaqueros")
    E["lv_cine"] = impacto("años cincuenta:", "EL *CINE*", "", "1f3ac")
    E["lv_rebeldes"] = icono_texto("1f60e", "SÍMBOLO *DE REBELDÍA*", "en películas sobre jóvenes rebeldes", "Marlon Brando, James Dean", "der", "dark", True, "pop", "bob")
    E["lv_prohibir"] = icono_texto("1f6ab", "PROHIBIDOS *EN ALGUNOS COLEGIOS*", "de Estados Unidos", "", "izq", "", False, "pop", "swing")
    E["lv_universidades"] = lista([("1f393", "universidades"), ("1f3b8", "conciertos"), ("270a", "manifestaciones")], "AÑOS 60 Y 70")
    E["lv_telon"] = icono_texto("1f9f1", "AL OTRO LADO *DEL TELÓN DE ACERO*", "unos auténticos eran casi un tesoro", "", "der", "dark", False, "pop", "")
    E["lv_mercadonegro"] = cifra("MERCADO NEGRO", "A PRECIOS ALTÍSIMOS, SEGÚN MUCHOS TESTIMONIOS", "1f4b8")
    E["lv_bandera"] = titular("DE PANTALÓN DE MINERO *A BANDERA*", "", "", ("1f456", "1f3f3-fe0f", "26cf-fe0f", "2728"), "", True, "xl")
    E["leccion1"] = leccion(1, "las mejores alianzas juntan", "*LO QUE A CADA UNO LE FALTA*", "1f91d")
    E["leccion2"] = leccion(2, "una imagen", "*VALE MÁS QUE MIL PALABRAS*", "1f40e")
    E["leccion3"] = leccion(3, "cuida", "*TU HISTORIA*", "1f5c4-fe0f")
    E["lv_final"] = lista([("1f1e9-1f1ea", "un emigrante"), ("1fa99", "oro"), ("1f9d4", "un sastre"), ("1f529", "remaches"), ("1f40e", "dos caballos")], "")
    E["lv_mira"] = f'''{F("calido", True)}{obj(vaqueros(260), 30, 50, "drop", "float", .2)}{txt(kt("MIRA *LOS REMACHES*", "xl", .9), 70, 42, 50)}{txt(kt("ya sabes de dónde vienen", "l", 1.4), 70, 58, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:130px;top:90px;transform:rotate(-6deg)">{vaqueros(330)}</div>
      <div style="position:absolute;left:380px;top:440px">{vicon("nut-and-bolt", 170)}</div>
      <div class="big" style="top:100px"><div class="s">NO TENÍA 68 $ PARA</div><div class="q" style="font-size:180px;margin-top:22px">LA PATENTE</div><div class="y">LA HISTORIA DE LEVI'S</div></div>'''
