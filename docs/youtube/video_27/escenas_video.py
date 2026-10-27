"""Escenas del vídeo 27 (Monopoly, formato largo). Motor común; sin logotipos ni el tablero real: tableros y billetes genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f469", 2: "1f3e0", 3: "1f91d", 4: "1f468-200d-1f4bc", 5: "274c", 6: "1f4b5", 7: "1f50d", 8: "1f5fa-fe0f",
              9: "1f5f3-fe0f", 10: "1f1ea-1f1f8", 11: "1f9e0"}
COLS = ["#8B4513", "#5aa0e8", "#e84a8a", "#f28c28", ROJO, "#f2d33b", VERDE, "#1f3c88"]

def tablero(px=460, d=0.0):
    casillas = ""
    for i in range(9):
        c = COLS[(i // 2) % 8]
        casillas += f'<rect x="{20 + i*40}" y="20" width="40" height="40" fill="#e8f0e0" stroke="{TINTA}" stroke-width="2"/><rect x="{20 + i*40}" y="20" width="40" height="12" fill="{c}"/>'
        casillas += f'<rect x="{20 + i*40}" y="340" width="40" height="40" fill="#e8f0e0" stroke="{TINTA}" stroke-width="2"/><rect x="{20 + i*40}" y="368" width="40" height="12" fill="{COLS[(i // 2 + 4) % 8]}"/>'
        casillas += f'<rect x="20" y="{20 + i*40}" width="40" height="40" fill="#e8f0e0" stroke="{TINTA}" stroke-width="2"/>'
        casillas += f'<rect x="340" y="{20 + i*40}" width="40" height="40" fill="#e8f0e0" stroke="{TINTA}" stroke-width="2"/>'
    return (f'<svg width="{px}" height="{px}" viewBox="0 0 400 400"><rect x="10" y="10" width="380" height="380" fill="#cfe5cf" stroke="{TINTA}" stroke-width="6"/>{casillas}'
            f'<rect x="120" y="150" width="160" height="100" rx="10" fill="{ROJO}" transform="rotate(-30 200 200)"/><text x="200" y="210" font-family="Bebas" font-size="34" fill="#fff" text-anchor="middle" transform="rotate(-30 200 200)">JUEGO</text></svg>')

def billete(px=220, valor="500", color="#f2c94c"):
    return (f'<svg width="{px}" height="{px*0.5:.0f}" viewBox="0 0 200 100"><rect x="4" y="4" width="192" height="92" rx="6" fill="{color}" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="14" y="14" width="172" height="72" rx="4" fill="none" stroke="{TINTA}" stroke-width="2" stroke-dasharray="4 3"/><text x="100" y="66" font-family="Bebas" font-size="40" fill="{TINTA}" text-anchor="middle">{valor}</text></svg>')

def casa(px=90, color=VERDE):
    return f'<svg width="{px}" height="{px}" viewBox="0 0 100 100"><path d="M10,50 L50,12 L90,50 L80,50 L80,90 L20,90 L20,50Z" fill="{color}" stroke="{TINTA}" stroke-width="5"/></svg>'

def escenas():
    E = {}
    E["mo_comprar"] = f'''{F("", True)}{obj(tablero(440), 30, 52, "zoom", "", .2)}{obj(casa(110), 56, 30, "drop", "bob", .6)}{obj(casa(110, ROJO), 62, 46, "drop", "bob", .9)}{txt(kt("COMPRAR, CONSTRUIR, COBRAR… *ARRUINAR*", "xl", 1.0), 80, 46, 36)}'''
    E["mo_vendido"] = titular("DE LOS JUEGOS DE MESA *MÁS VENDIDOS*", "de la historia", "", ("1f3b2", "1f3e0", "1f4b5", "1f3c6"), "", True, "xl")
    E["mo_caja"] = icono_texto("1f468-200d-1f4bc", "LA VERSIÓN *DE LA CAJA*", "un hombre en paro en la Gran Depresión se hizo millonario con su idea", "durante décadas:", "izq", "sepia", False, "pop", "bob")
    E["mo_real"] = impacto("pero la historia real", "ES *MUY DISTINTA*", "", "1f50d")
    E["mo_mujer"] = comparar("1f469", "lo inventó una mujer, 30 años antes", "1f4e2", "para criticar el capitalismo, no celebrarlo", "+")
    E["mo_historia"] = titular("EL JUEGO SOBRE LOS MONOPOLIOS… *ACABÓ SIENDO UNO*", "", "", ("1f3b2", "1f3e0", "1f4b0", "1f3e6"), "", True, "xl")
    E["mo_siglo"] = f'''{F("sepia")}{obj(skyline(1800, "#6d5440"), 50, 86, "none")}{txt(kt("ESTADOS UNIDOS", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("finales del siglo XIX", "l", 1.1), 50, 48, 80)}<div class="viñeta"></div>'''
    E["mo_lizzie"] = icono_texto("1f469", "ELIZABETH *«LIZZIE» MAGIE*", "una mujer muy poco convencional para su época", "", "izq", "sepia", False, "up", "bob")
    E["mo_trabajos"] = lista([("2328-fe0f", "taquígrafa"), ("270d-fe0f", "escritora"), ("1f3ad", "actriz")], "SE GANABA LA VIDA COMO PODÍA")
    E["mo_anuncio"] = icono_texto("1f4f0", "SE OFRECIÓ «EN VENTA» *COMO ESPOSA*", "en un anuncio de periódico, para denunciar lo poco que se valoraba a las mujeres", "", "der", "", True, "drop", "swing")
    E["mo_ideas"] = impacto("y tenía unas ideas políticas", "MUY *CLARAS*", "", "1f4a1")
    E["mo_george"] = icono_texto("1f474", "HENRY *GEORGE*", "la tierra debía beneficiar a toda la sociedad, no a unos pocos", "seguía a un economista:", "izq", "", True, "up", "bob")
    E["mo_explicar"] = icono_texto("1f9d1-200d-1f3eb", "EXPLICARLO *A CUALQUIERA*", "", "", "der", "", True, "pop", "bob")
    E["mo_juego"] = impacto("y pensó que lo perfecto sería", "UN *JUEGO*", "", "1f3b2")
    E["mo_tablero"] = f'''{F()}{obj(tablero(480), 32, 50, "zoom", "spin-slow", .2)}{txt(kt("PROPIEDADES · ALQUILERES · TRENES · *CÁRCEL*", "xl", 1.0), 76, 46, 42)}'''
    E["mo_cobrar"] = comparar("1f3e0", "compras terrenos", "1f4b5", "cobras a los demás por pasar", "→")
    E["mo_objetivo"] = f'''{F("dark", True)}{obj(spr("1f4b0", 260), 26, 46, "pop", "glow", .2)}{"".join(obj(spr("1f62d", 110), 54 + i * 12, 60, "pop", "", .8 + i * .2) for i in range(3))}{txt(kt("SI UNOS POCOS LO ACUMULAN, *LOS DEMÁS SE ARRUINAN*", "xl hueso", 1.0), 64, 32, 64)}'''
    E["mo_patente"] = icono_texto("1f4dc", "«EL JUEGO *DEL TERRATENIENTE*»", "solicitó la patente en 1903; se la concedieron al año siguiente", "", "izq", "", True, "flip", "")
    E["mo_dos"] = comparar("1f911", "gana quien acapara más", "1f91d", "todos se benefician si se crea riqueza", "/", "DOS FORMAS DE JUGAR")
    E["mo_justo"] = icono_texto("2696-fe0f", "¿CUÁL ES *MÁS JUSTO*?", "que los jugadores lo comprobaran por sí mismos", "", "der", "", True, "pop", "swing")
    E["mo_noexito"] = icono_texto("1f4c9", "NUNCA FUE *UN GRAN ÉXITO* COMERCIAL", "", "", "izq", "", False, "pop", "")
    E["mo_copia"] = icono_texto("270f-fe0f", "LA GENTE *LO COPIABA A MANO*", "", "pero se extendió de otra forma:", "der", "", True, "pop", "swing")
    E["mo_tela"] = f'''{F("calido", True)}{obj(tablero(300), 22, 50, "pop", "", .2)}{obj(tablero(300), 50, 50, "pop", "", .5)}{obj(tablero(300), 78, 50, "pop", "", .8)}{txt(kt("TABLEROS CASEROS, *PINTADOS SOBRE TELA O CARTÓN*", "xl", 1.2), 50, 84, 90)}'''
    E["mo_adapta"] = lista([("1f6e3-fe0f", "las calles de su ciudad"), ("1f4dd", "reglas a su gusto")], "CADA UNO LO ADAPTABA")
    E["mo_atlantic"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("ATLANTIC CITY", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("un grupo de cuáqueros, con los nombres de sus calles", "l", 1.1), 50, 48, 80)}{obj(spr("1f30a", 150), 86, 18, "pop", "bob", .8)}'''
    E["mo_nombres"] = icono_texto("1f3f7-fe0f", "LOS NOMBRES *DEL MONOPOLY ORIGINAL*", "en Estados Unidos, años después", "", "izq", "", True, "pop", "bob")
    E["mo_sindueno"] = impacto("durante tres décadas", "UN JUEGO *SIN DUEÑO*", "que pasaba de mano en mano", "1f91d")
    E["mo_darrow"] = icono_texto("1f468-200d-1f4bc", "CHARLES *DARROW*", "el hombre al que se atribuyó el invento", "", "der", "", True, "up", "bob")
    E["mo_paro"] = icono_texto("1f4c9", "SIN TRABAJO *EN LA GRAN DEPRESIÓN*", "un vendedor de Filadelfia", "", "izq", "sepia", False, "drop", "")
    E["mo_amigos"] = icono_texto("1f465", "UNOS AMIGOS *LE ENSEÑAN EL JUEGO*", "una de aquellas versiones caseras", "principios de los treinta", "der", "", True, "pop", "bob")
    E["mo_fabrica"] = lista([("1f4dd", "copia las reglas"), ("1f3a8", "cambia el diseño"), ("1f4e6", "lo fabrica y lo vende")], "")
    E["mo_monopoly"] = f'''{F("", True)}{obj(tablero(380), 28, 50, "zoom", "", .2)}{txt(kt("LO LLAMÓ:", "l", .6), 66, 34, 56)}{txt(kt("*MONOPOLY*", "mega", 1.0, .12, "slam"), 66, 52, 56)}'''
    E["mo_parker"] = icono_texto("1f3ed", "LLAMA LA ATENCIÓN DE *PARKER BROTHERS*", "una gran empresa de juegos de mesa", "", "izq", "", True, "zoom", "")
    E["mo_rechaza"] = impacto("al principio,", "LO *RECHAZÓ*", "", "274c")
    E["mo_fallos"] = lista([("23f3", "demasiado largo"), ("1f300", "demasiado complicado"), ("2753", "sin final claro")], "DECENAS DE FALLOS, SEGÚN LA HISTORIA")
    E["mo_tiendas"] = icono_texto("1f4c8", "LAS VENTAS *NO DEJABAN DE CRECER*", "", "", "der", "", True, "pop", "bob")
    E["mo_1935"] = anio(1900, 1935, "Parker Brothers le compra el juego", "1f91d")
    E["mo_millonario"] = icono_texto("1f4b0", "DARROW, *MILLONARIO*", "se presentó como su inventor", "", "izq", "calido", True, "zoom", "glow")
    E["mo_leyenda"] = icono_texto("1f4e6", "LA HISTORIA *DE LA CAJA*", "el hombre en paro que lo inventó en la mesa de su cocina", "durante décadas:", "der", "", False, "pop", "")
    E["mo_ylizzie"] = impacto("", "¿Y *LIZZIE MAGIE*?", "", "1f469")
    E["mo_sabia"] = icono_texto("1f4dc", "PATENTES *ANTERIORES*", "Parker Brothers sabía que existían", "", "izq", "", False, "flip", "")
    E["mo_500"] = f'''{F("", True)}{obj(billete(300, "500 $"), 30, 46, "drop", "float", .2)}{txt(kt("LOS DERECHOS DE LIZZIE", "xl", .6), 70, 36, 50)}{txt(kt("por unos *500 $*", "xl", 1.0), 70, 52, 50)}{txt(kt("y sin porcentaje de las ventas", "l", 1.6), 70, 66, 50)}'''
    E["mo_condicion"] = icono_texto("1f4dd", "UNA *CONDICIÓN*", "que publicaran también su juego original", "", "der", "", True, "pop", "bob")
    E["mo_tirada"] = icono_texto("1f4e6", "UNA TIRADA *PEQUEÑA*", "que apenas se vendió", "", "izq", "", False, "pop", "")
    E["mo_muere"] = icono_texto("1f56f-fe0f", "LIZZIE MUERE *EN 1948*", "sin que casi nadie supiera que el juego nació de su idea", "", "der", "dark", False, "pop", "glow")
    E["mo_contrario"] = comparar("1f91d", "lo que ella quería transmitir", "1f911", "el mensaje del Monopoly", "≠")
    E["mo_verdad"] = impacto("la verdad salió a la luz", "DÉCADAS DESPUÉS, *POR CASUALIDAD*", "", "1f50d")
    E["mo_anspach"] = icono_texto("1f9d1-200d-1f3eb", "RALPH *ANSPACH*", "profesor de economía; creó un juego llamado «Anti-Monopoly»", "años setenta", "izq", "", True, "up", "bob")
    E["mo_demanda"] = icono_texto("2696-fe0f", "LO DEMANDAN *POR EL NOMBRE*", "la empresa propietaria del Monopoly", "", "der", "", False, "drop", "swing")
    E["mo_investiga"] = icono_texto("1f50d", "SE PONE *A INVESTIGAR*", "el origen del juego, para defenderse", "", "izq", "", True, "pop", "bob")
    E["mo_descubre"] = lista([("1f4dc", "las patentes de Lizzie"), ("1f3a8", "los tableros caseros"), ("1f3d9-fe0f", "Atlantic City")], "LO QUE DESCUBRIÓ")
    E["mo_tribunales"] = comparar("1f468-200d-1f4bc", "Darrow no lo inventó", "1f527", "lo adaptó", "/", "AÑOS EN LOS TRIBUNALES")
    E["mo_reconoce"] = icono_texto("2705", "HOY LA MARCA *LO RECONOCE*", "el papel de Lizzie Magie en el origen del juego", "", "der", "calido", True, "pop", "bob")
    E["mo_guerra"] = impacto("otro capítulo increíble:", "LA *SEGUNDA GUERRA MUNDIAL*", "", "2694-fe0f")
    E["mo_espias"] = icono_texto("1f575-fe0f", "LOS SERVICIOS SECRETOS *BRITÁNICOS*", "querían ayudar a escapar a los prisioneros", "", "izq", "dark", True, "pop", "")
    E["mo_paquetes"] = icono_texto("1f4e6", "PAQUETES *CON JUEGOS DE MESA*", "enviados por organizaciones de ayuda", "", "der", "", False, "drop", "bob")
    E["mo_especiales"] = flecha("1f1ec-1f1e7", "1f3b2", "CON EL FABRICANTE BRITÁNICO: *JUEGOS ESPECIALES*", "")
    E["mo_mapas"] = f'''{F("dark", True)}{obj(tablero(360), 24, 50, "pop", "", .2)}{obj(spr("1f5fa-fe0f", 170), 54, 30, "pop", "float", .8)}{obj(spr("1f9ed", 140), 54, 58, "pop", "spin-slow", 1.1)}{obj(billete(180, "$$$", "#9fd39f"), 54, 82, "pop", "", 1.4)}
      {txt(kt("MAPAS DE SEDA, BRÚJULAS *Y DINERO DE VERDAD*", "xl hueso", 1.0), 78, 46, 38)}'''
    E["mo_marcas"] = icono_texto("1f50d", "UNAS *MARCAS EN EL TABLERO*", "indicaban qué juegos llevaban el contenido secreto", "", "izq", "", True, "pop", "")
    E["mo_secreto"] = icono_texto("1f92b", "DÉCADAS *EN SECRETO*", "", "", "der", "dark", True, "pop", "bob")
    E["mo_hasbro"] = icono_texto("1f3e2", "HOY, DE *HASBRO*", "tras varios cambios de dueño", "", "izq", "", True, "pop", "bob")
    E["mo_paises"] = cifra("+100 PAÍSES", "Y DECENAS DE IDIOMAS, SEGÚN LA MARCA", "1f30d")
    E["mo_votar"] = icono_texto("1f5f3-fe0f", "LOS JUGADORES *VOTAN*", "algunos cambios del juego", "", "der", "", True, "drop", "bob")
    E["mo_gato"] = comparar("1f4cf", "fuera la plancha", "1f408", "entra un gato", "→", "2013: VOTACIÓN POR INTERNET")
    E["mo_dedal"] = lista([("1f996", "dinosaurio"), ("1f986", "patito de goma"), ("1f6ab", "adiós al dedal")], "OTRA VOTACIÓN, AÑOS DESPUÉS")
    E["mo_drama"] = icono_texto("1f62d", "CADA CAMBIO, *CASI UN DRAMA*", "señal de que el juego era algo muy personal", "", "izq", "", False, "pop", "shake")
    E["mo_rentable"] = flecha("1f3e0", "1f4b0", "CONTRA LOS TERRATENIENTES… *Y SUPERRENTABLE*", "")
    E["mo_madrid"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("LAS CALLES DE MADRID", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("la versión con la que jugaron varias generaciones", "l", 1.1), 50, 48, 80)}'''
    E["mo_prado"] = f'''{F("", True)}<div class="pos" style="left:30%;top:48%;width:300px;height:400px;background:#fff;border:6px solid {TINTA};border-radius:10px"></div>
      <div class="pos" style="left:30%;top:24%;width:300px;height:90px;background:#1f3c88;border:6px solid {TINTA}"></div>{txt(kt("PASEO DEL PRADO", "xl", .5), 30, 46, 22)}
      {txt(kt("LA MÁS *CARA*", "xl", 1.0), 70, 40, 50)}{txt(kt("en la edición clásica española", "l", 1.5), 70, 56, 50)}'''
    E["mo_versiones"] = lista([("1f3d9-fe0f", "ciudades"), ("26bd", "equipos"), ("1f3ac", "series y películas")], "VERSIONES DE CASI TODO")
    E["mo_parking"] = bocadillos("1f17f-fe0f", ["¡El dinero del parking es mío!", "¡Eso no vale!", "¡Siempre lo hemos jugado así!"], "la eterna discusión familiar")
    E["mo_inventada"] = icono_texto("1f4d6", "NO ESTÁ *EN LAS INSTRUCCIONES*", "esa regla la inventaron los jugadores", "", "der", "", True, "flip", "bob")
    E["leccion1"] = leccion(1, "quien inventa algo", "NO SIEMPRE SE LLEVA *EL MÉRITO*", "1f469")
    E["leccion2"] = leccion(2, "una idea puede acabar significando", "*LO CONTRARIO* DE LO QUE QUERÍA", "1f504")
    E["leccion3"] = leccion(3, "la historia oficial de una marca", "NO SIEMPRE *ES LA VERDADERA*", "1f50d")
    E["mo_final"] = lista([("1f469", "una mujer adelantada"), ("1f3a8", "tableros a mano"), ("1f468-200d-1f4bc", "un vendedor"), ("1f5fa-fe0f", "mapas escondidos")], "")
    E["mo_acuerdate"] = f'''{F("calido", True)}{obj(tablero(380), 28, 50, "zoom", "", .2)}{txt(kt("ACUÉRDATE DE *LIZZIE MAGIE*", "xl", .9), 70, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:150px;transform:rotate(-8deg)">{tablero(400)}</div>
      <div style="position:absolute;left:300px;top:450px">{vicon("woman", 170)}</div>
      <div class="big" style="top:100px"><div class="s">EL MONOPOLY</div><div class="q" style="font-size:150px;margin-top:22px">LO INVENTÓ</div><div class="q" style="font-size:150px">UNA MUJER</div><div class="y">PARA CRITICAR A LOS RICOS</div></div>'''
