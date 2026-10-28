"""Escenas del vídeo 49 (especial Navidad: Famosa). Motor común; sin logotipos ni muñecas reconocibles: muñecas y figuras genéricas."""
from base import *

CAP_ICONOS = {1: "1f3d8-fe0f", 2: "1f91d", 3: "1f457", 4: "1f476", 5: "1f3b5", 6: "1f48c", 7: "1f6a2", 8: "1f9e0"}

def fila(n=6, px=110, y=64):
    figs = ["1f478", "1f476", "1f467", "1f9d2", "1f478", "1f476", "1f467"]
    return "".join(obj(spr(figs[i % len(figs)], px), 8 + i * 11, y + (i % 2) * 2, "left", "bob", .1 + i * .15) for i in range(n))

def escenas():
    E = {}
    E["fa_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f381", "2744-fe0f", "1f478"), "navidad", True, "mega")
    E["fa_anuncio"] = icono_texto("1f4fa", "EL ANUNCIO *QUE ABRE LA NAVIDAD*", "casi tanto como el sorteo de la lotería", "en España", "izq", "navidad", True, "pop", "bob")
    E["fa_fila"] = f'''{F("espacio", True)}{fila(6)}{obj(spr("2b50", 150), 86, 30, "pop", "glow", 1.2)}{obj(spr("1f6d6", 170), 88, 62, "pop", "bob", 1.0)}{txt(kt("SE DIRIGEN *AL PORTAL*", "xl hueso", .8), 44, 24, 80)}'''
    E["fa_parodia"] = lista([("1f9e0", "se lo saben de memoria"), ("1f602", "se parodia cada año")], "GENERACIONES ENTERAS")
    E["fa_pueblo"] = icono_texto("1f3d8-fe0f", "UN PUEBLO *DE MUÑECAS*", "una de las historias empresariales más curiosas de España", "Alicante", "der", "calido", True, "pop", "bob")
    E["fa_historia"] = titular("LA HISTORIA *DE FAMOSA*", "fusión, armario propio, un olor… y China", "", ("1f478", "1f476", "1f3b5", "1f6a2"), "navidad", True, "xl")
    E["fa_onil"] = icono_texto("26f0-fe0f", "*ONIL*", "un pueblo del interior de Alicante, entre montañas", "", "izq", "", False, "pop", "bob", 380, (("1f1ea-1f1f8", 84, 20),))
    E["fa_artesanal"] = lista([("1f4e6", "cartón"), ("1f4c4", "pasta de papel"), ("1f9f5", "trapo")], "FINALES DEL SIGLO XIX: MUÑECAS DE…")
    E["fa_talleres"] = lista([("1f468", "cabezas"), ("1f469", "cuerpos"), ("1f9f6", "ropa")], "TALLERES FAMILIARES: UNOS HACÍAN…")
    E["fa_valle"] = comparar("1f478", "Onil: muñecas", "1f697", "Ibi: juguetes de hojalata", "+", "EL VALLE DEL JUGUETE")
    E["fa_economia"] = lista([("1f527", "moldes"), ("1f4e6", "cajas"), ("1f3a8", "pinturas"), ("1f441-fe0f", "ojos de cristal")], "TODA UNA ECONOMÍA DEL JUEGO")
    E["fa_decadas"] = titular("DE ESOS PUEBLOS *SALÍAN LAS MUÑECAS*", "de buena parte de las niñas españolas", "", ("1f478", "1f3d8-fe0f", "1f1ea-1f1f8", "2764-fe0f"))
    E["fa_plastico"] = impacto("años cincuenta: llega", "EL *PLÁSTICO*", "y lo pone todo patas arriba", "1f9ea")
    E["fa_serie"] = lista([("1f4b6", "más baratas"), ("1f4aa", "más resistentes"), ("1f4c8", "mucha más cantidad")], "MUÑECAS EN SERIE")
    E["fa_moderniza"] = comparar("1f527", "modernizarse", "1f6aa", "o desaparecer", "O", "SIN MAQUINARIA, SIN FUTURO")
    E["fa_1957"] = cifra("25 TALLERES", "SE UNEN EN UNA SOLA EMPRESA · FEBRERO DE 1957", "1f91d")
    E["fa_nombre"] = f'''{F()}{txt(kt("FÁBRICAS AGRUPADAS DE MUÑECAS DE ONIL, S. A.", "xl", .4), 50, 42, 90)}{txt(kt("un nombre larguísimo…", "l naranja", 1.6), 50, 60, 80)}'''
    E["fa_siglas"] = f'''{F("navidad", True)}{txt('<div class="xl hueso">' + " ".join(f'<span class="w w-up" style="--d:{.3 + i*.12:.2f}s"><span style="color:#ff5a6e">{p}</span>{r}</span>' for i, (p, r) in enumerate([("F", "ÁBRICAS"), ("A", "GRUPADAS"), ("", "DE"), ("MU", "ÑECAS"), ("", "DE"), ("O", "NIL"), ("S", "."), ("A", ".")])) + '</div>', 50, 34, 90)}{txt(kt("= *FAMOSA*", "mega hueso", 1.6), 50, 62, 90)}'''
    E["fa_vecinos"] = icono_texto("1f91d", "UNA FUSIÓN *ENTRE VECINOS*", "que hasta entonces competían entre sí", "", "der", "", True, "pop", "bob")
    E["fa_1968"] = cifra("1968", "NACE UNA MUÑECA QUE CAMBIA LA HISTORIA: NANCY", "1f478")
    E["fa_tino"] = icono_texto("270f-fe0f", "TINO *JUAN*", "el diseñador al que llaman «el padre de Nancy»", "Agustín Juan", "izq", "", False, "up", "bob")
    E["fa_moda"] = lista([("1f457", "vestidos"), ("1f460", "zapatos"), ("1f45c", "complementos"), ("1f487", "peinados")], "NO ERA UN BEBÉ: ERA UNA NIÑA CON…")
    E["fa_ropa"] = comparar("1f478", "la muñeca: se compra una vez", "1f457", "la ropa: muchas veces", "PERO", "EL EFECTO COMERCIAL")
    E["fa_generaciones"] = icono_texto("1f46a", "LA MUÑECA *DE VARIAS GENERACIONES*", "y coleccionistas con cientos de ellas", "", "der", "calido", True, "pop", "bob")
    E["fa_museo"] = cifra("2023", "55 AÑOS: EXPOSICIÓN EN EL MUSEO DEL TRAJE DE MADRID", "1f3db-fe0f")
    E["fa_ediciones"] = icono_texto("1f3a4", "EDICIONES *INSPIRADAS EN PERSONAS REALES*", "una, de lo más vendido de su Navidad", "", "izq", "navidad", True, "pop", "bob")
    E["fa_otros"] = impacto("y después de Nancy…", "NOMBRES QUE *TODOS RECONOCEN*", "", "1f9f8")
    E["fa_nenuco"] = cifra("1977", "NACE NENUCO, EL MUÑECO BEBÉ", "1f476")
    E["fa_olor"] = icono_texto("1f443", "UN OLOR *A INFANCIA*", "la colonia que se convirtió en otra línea de productos", "", "der", "calido", True, "pop", "float")
    E["fa_barriguitas"] = icono_texto("270b", "LAS *BARRIGUITAS*", "pequeñas, con su barriga redonda, cabían en la mano", "años setenta", "izq", "", False, "pop", "bob")
    E["fa_pinypon"] = icono_texto("1f504", "LOS *PINYPON*", "muñequitos con cabeza intercambiable", "años ochenta", "der", "", False, "pop", "swing")
    E["fa_recuerdos"] = titular("UNA FÁBRICA *DE RECUERDOS*", "renovados para los hijos de aquellos niños", "", ("1f478", "1f476", "1f9f8", "2764-fe0f"), "navidad", True, "xl")
    E["fa_llegamos"] = impacto("y llegamos", "AL *ANUNCIO*", "", "1f4fa")
    E["fa_pastores"] = f'''{F("espacio", True)}{fila(5, 120, 62)}{obj(spr("1f6d6", 200), 82, 58, "pop", "bob", 1.0)}{txt(kt("COMO PASTORES, *HACIA EL PORTAL*", "xl hueso", .8), 50, 22, 90)}'''
    E["fa_melodia"] = bocadillos("1f3b5", ["Una melodía de villancico…", "…que repite la marca"], "fácil de recordar")
    E["fa_decadas2"] = cifra("DÉCADAS", "NAVIDAD TRAS NAVIDAD, CON LA MISMA CANCIÓN", "1f501", "según se cuenta, desde los años setenta")
    E["fa_parte"] = flecha("1f4fa", "1f384", "DE ANUNCIO *A TRADICIÓN*", "parte de la Navidad española")
    E["fa_gratis"] = lista([("1f602", "programas de humor"), ("1f3ac", "series"), ("2b50", "famosos")], "MIL PARODIAS = PUBLICIDAD GRATIS")
    E["fa_reciente"] = bocadillos("1f9d2", ["Mientras sigan queriendo jugar…", "…seguiremos dirigiéndonos al portal"], "una campaña reciente")
    E["fa_porque"] = impacto("¿por qué es tan importante", "UN ANUNCIO *DE NAVIDAD*?", "", "1f914")
    E["fa_semanas"] = cifra("NOV. → REYES", "LA CAMPAÑA DE NAVIDAD DECIDE EL AÑO ENTERO", "1f4c5")
    E["fa_reyes"] = comparar("1f385", "Papá Noel, el 25", "1f451", "los Reyes Magos, el 6 de enero", "+", "EN ESPAÑA, LA NAVIDAD DURA MÁS")
    E["fa_carta"] = flecha("1f4fa", "1f48c", "DE LA TELE *A LA CARTA*", "lo que ven los niños acaba en la carta a los Reyes")
    E["fa_normas"] = icono_texto("2696-fe0f", "NORMAS *MÁS DURAS*", "para anunciar juguetes a los niños", "diciembre: el bombardeo de anuncios", "der", "", False, "pop", "")
    E["fa_tesoro"] = titular("UN ANUNCIO QUE LA GENTE ESPERA *ES UN TESORO*", "no hace falta inventar otro", "", ("1f4fa", "1f48e", "1f3b5", "2728"), "navidad", True, "xl")
    E["fa_menos"] = impacto("pero también hay", "UNA PARTE *MENOS DULCE*", "", "1f614")
    E["fa_global"] = comparar("1f1ea-1f1f8", "fabricar en España: caro", "1f30f", "fabricar en Asia: barato", "VS", "LA GLOBALIZACIÓN")
    E["fa_china"] = f'''{F("dark", True)}{obj(spr("1f3ed", 260), 24, 50, "pop", "", .2)}{txt(kt("−70 % *DE PRODUCCIÓN EN ONIL*", "xl hueso", .8), 66, 40, 58)}{txt(kt("mediados de los 2000 · según se publicó, cientos de empleos perdidos", "l naranja", 1.4), 66, 58, 58)}'''
    E["fa_alicante"] = flecha("1f3d8-fe0f", "1f3d9-fe0f", "DEL VALLE DEL JUGUETE *A ALICANTE*", "oficinas y logística")
    E["fa_italia"] = icono_texto("1f1ee-1f1f9", "UN GRUPO *ITALIANO*", "Giochi Preziosi, el propietario actual", "hoy", "izq", "", False, "pop", "bob")
    E["fa_vuelta"] = icono_texto("1f4e6", "PARTE DE LA PRODUCCIÓN, *DE VUELTA*", "cuando los contenedores se dispararon de precio", "", "der", "", True, "pop", "bob")
    E["fa_yano"] = titular("SIGUEN DIRIGIÉNDOSE AL PORTAL…", "pero muchas ya no salen de Onil", "", ("1f478", "1f6a2", "1f3d8-fe0f", "1f614"), "navidad", True, "xl")
    E["leccion1"] = leccion(1, "para sobrevivir a un cambio,", "*LOS COMPETIDORES SE UNEN*", "1f91d")
    E["leccion2"] = leccion(2, "vende también", "*LO QUE ACOMPAÑA AL PRODUCTO*", "1f457")
    E["leccion3"] = leccion(3, "un anuncio repetido durante décadas", "*SE CONVIERTE EN TRADICIÓN*", "1f3b5")
    E["fa_final"] = lista([("1f3d8-fe0f", "un pueblo"), ("1f91d", "25 talleres"), ("1f457", "un armario"), ("1f476", "un bebé"), ("1f3b5", "un villancico")], "")
    E["fa_tararea"] = f'''{F("navidad", True)}{obj(spr("1f3b6", 300), 30, 50, "pop", "bob", .2)}{txt(kt("AHORA LO *ESTÁS TARAREANDO*", "xl hueso", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:40px;top:250px">{vicon("princess", 260)}</div>
      <div style="position:absolute;left:250px;top:300px">{vicon("baby", 220)}</div>
      <div style="position:absolute;left:400px;top:150px">{vicon("star", 130)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">LAS MUÑECAS QUE VAN</div><div class="q" style="font-size:170px;margin-top:22px">AL PORTAL</div><div class="y">LA HISTORIA DE FAMOSA</div></div>'''
