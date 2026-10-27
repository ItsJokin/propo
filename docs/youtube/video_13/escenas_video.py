"""Escenas del vídeo 13 (McDonald's). Motor común; sin logotipos ni la «M» de la marca: restaurantes genéricos."""
from base import *

CAP_ICONOS = {1: "1f46c", 2: "1f964", 3: "1f3e0", 4: "270d-fe0f", 5: "1f30d", 6: "1f9e0"}

def puesto(px=560, rotulo="HAMBURGUESAS", color=ROJO):
    return (f'<svg width="{px}" height="{px*0.7:.0f}" viewBox="0 0 400 280"><rect x="40" y="110" width="320" height="160" fill="{HUESO}" stroke="{TINTA}" stroke-width="5"/>'
            f'<path d="M20,110 L380,110 L350,60 L50,60Z" fill="{color}" stroke="{TINTA}" stroke-width="5"/>'
            + "".join(f'<path d="M{50 + i*60},110 l30,0 l-6,22 l-18,0z" fill="#fff" opacity=".8"/>' for i in range(5))
            + f'<rect x="80" y="160" width="240" height="70" fill="#9fc3e6" stroke="{TINTA}" stroke-width="4"/><rect x="120" y="14" width="160" height="40" rx="6" fill="#FFD23F" stroke="{TINTA}" stroke-width="4"/>'
            f'<text x="200" y="44" font-family="Bebas" font-size="26" fill="{TINTA}" text-anchor="middle">{rotulo}</text></svg>')

def escenas():
    E = {}
    E["m_famosa"] = f'''{F("", True)}{obj(spr("1f354", 280), 30, 46, "drop", "bob", .2)}{obj(spr("1f35f", 200), 50, 62, "pop", "bob", .6)}
      {txt(kt("LA CADENA *MÁS FAMOSA*", "xl", .8), 74, 40, 46)}{txt(kt("del planeta, probablemente", "l", 1.4), 74, 56, 46)}'''
    E["m_kroc_cree"] = icono_texto("1f914", "¿LO FUNDÓ *RAY KROC*?", "mucha gente lo cree", "", "izq", "", True, "pop", "swing")
    E["m_hermanos"] = comparar("1f468", "Richard McDonald", "1f468", "Maurice McDonald", "+", "SE LLAMA ASÍ POR DOS HERMANOS")
    E["m_perder"] = impacto("inventaron el sistema… y perdieron", "HASTA *SU APELLIDO*", "en su propio restaurante", "1f494")
    E["m_california"] = anio(1900, 1940, "California", "1f1fa-1f1f8")
    E["m_drive"] = f'''{F("calido", True)}{obj(puesto(560), 32, 50, "zoom", "", .1)}{obj(spr("1f697", 200), 70, 70, "left", "", .7)}
      {txt(kt("UN RESTAURANTE *PARA COCHES*", "xl", .9), 72, 34, 44)}{txt(kt("San Bernardino", "l", 1.5), 72, 52, 44)}'''
    E["m_problemas"] = lista([("1f4dc", "menú largo"), ("1f935", "camareros"), ("1f37d-fe0f", "platos rotos"), ("23f3", "esperas")], "FUNCIONABA, PERO…")
    E["m_cierran"] = cifra("1948", "CIERRAN Y LO TRANSFORMAN", "1f6a7")
    E["m_menu"] = f'''{F()}{"".join(obj(spr(c, 200), x, 42, "drop", "bob", .2 + i * .3) for i, (c, x) in enumerate([("1f354", 18), ("1f35f", 39), ("1f366", 61), ("1f964", 82)]))}
      {txt(kt("UN MENÚ *CORTÍSIMO*", "xl", 1.4), 50, 76, 90)}'''
    E["m_cadena"] = f'''{F("", True)}{"".join(obj(spr("1f9d1-200d-1f373", 160), 14 + i * 18, 44, "pop", "bob", .1 + i * .2) for i in range(5))}
      <svg class="pos" style="left:50%;top:62%" width="1500" height="40" viewBox="0 0 1500 40"><path class="draw" style="--d:.6s;--len:1500" d="M60,20 L1440,20" stroke="{ROJO}" stroke-width="8" stroke-dasharray="20 14"/></svg>
      {txt(kt("COCINA EN *CADENA DE MONTAJE*", "xl", 1.2), 50, 18, 90)}{txt(kt("el Speedee Service System", "l", 1.8), 50, 82, 90)}'''
    E["m_batidoras"] = icono_texto("1f964", "RAY KROC VENDÍA *BATIDORAS*", "máquinas para hacer batidos", "", "izq", "", True, "pop", "bob", 340, (("1f4bc", 86, 80),))
    E["m_ocho"] = f'''{F()}{"".join(obj(spr("1f964", 130), 12 + i * 10.8, 40, "drop", "", .1 + i * .15) for i in range(8))}
      {txt(kt("UN SOLO RESTAURANTE: *8 MÁQUINAS*", "xl", 1.4), 50, 72, 90)}{txt(kt("1954", "l gris", 1.9), 50, 86, 90)}'''
    E["m_viaja"] = flecha("1f468-200d-1f4bc", "1f3ea", "VIAJA A *SAN BERNARDINO*", "a verlo con sus propios ojos")
    E["m_impresion"] = lista([("1f465", "colas de clientes"), ("23f1-fe0f", "comida en segundos"), ("2699-fe0f", "como un reloj")], "SE QUEDA IMPRESIONADO")
    E["m_52"] = f'''{F("", True)}{obj(spr("1f474", 240), 22, 46, "pop", "bob", .2)}{txt(kt("52 AÑOS", "mega rojo", .5, .12, "slam"), 64, 30, 60)}
      {txt(kt("vio lo que ellos no querían:", "l", 1.1), 64, 50, 60)}{txt(kt("*MULTIPLICARLO*", "xl", 1.6), 64, 64, 60)}'''
    E["m_desplaines"] = f'''{F("calido", True)}{obj(puesto(520), 30, 50, "zoom", "", .1)}{txt(kt("1955: SU PRIMER RESTAURANTE", "l", .6), 72, 34, 50)}{txt(kt("*DES PLAINES*", "xl", 1.1), 72, 50, 50)}{txt(kt("cerca de Chicago", "l gris", 1.6), 72, 64, 50)}'''
    E["m_poco"] = icono_texto("1fa99", "LAS FRANQUICIAS *DEJABAN POCO*", "", "", "der", "", False, "drop", "shake")
    E["m_sonneborn"] = icono_texto("1f468-200d-1f4bc", "HARRY *SONNEBORN*", "un experto financiero", "la solución:", "izq", "", True, "up", "bob")
    E["m_terrenos"] = f'''{F()}{obj(spr("1f3d7-fe0f", 230), 20, 44, "pop", "bob", .2)}{txt('<div class="vs" style="--d:.6s;font-size:120px">→</div>', 40, 44, 8)}{obj(spr("1f3e0", 230), 58, 44, "pop", "bob", .8)}
      {txt('<div class="vs" style="--d:1.2s;font-size:120px">→</div>', 74, 44, 8)}{obj(spr("1f4b5", 200), 88, 44, "pop", "bob", 1.4)}
      {txt(kt("compra el terreno · se lo alquila al franquiciado · *con margen*", "l", 1.6), 50, 78, 95)}'''
    E["m_inmobiliario"] = titular("UN NEGOCIO *INMOBILIARIO*", "no solo hamburguesas", "", ("1f3d7-fe0f", "1f354", "1f4b0", "1f3d8-fe0f"))
    E["m_tension"] = comparar("1f3ce-fe0f", "Kroc quería ir más rápido", "1f6d1", "ellos, mantener el control", "VS", "TENSIONES")
    E["m_compra"] = cifra("2,7 M$", "KROC COMPRA LA EMPRESA (1961)", "270d-fe0f")
    E["m_millon"] = f'''{F("", True)}{obj(spr("1f468", 200), 24, 40, "pop", "bob", .2)}{obj(spr("1f468", 200), 76, 40, "pop", "bob", .4)}
      {txt(kt("1 M$", "mega", .8, .12, "slam"), 24, 66, 30)}{txt(kt("1 M$", "mega", 1.0, .12, "slam"), 76, 66, 30)}{txt(kt("para cada uno, después de impuestos", "l", 1.6), 50, 88, 90)}'''
    E["m_verbal"] = f'''{F("dark", True)}{obj(spr("1f91d", 260), 26, 46, "pop", "", .2)}{txt(kt("UN ACUERDO *DE PALABRA*", "xl hueso", .6), 66, 32, 56)}
      {txt(kt("según la familia McDonald", "l naranja", 1.2), 66, 48, 56)}{txt(kt("nunca por escrito · nunca se pagó", "l hueso", 1.9), 66, 62, 56)}'''
    E["m_bigm"] = f'''{F("calido", True)}{obj(puesto(520, "THE BIG M", NARANJA), 32, 50, "zoom", "", .1)}{txt(kt("SIN PODER USAR *SU APELLIDO*", "xl", .8), 74, 44, 46)}'''
    E["m_cierra"] = f'''{F("dark", True)}{obj(puesto(440, "THE BIG M", NARANJA), 30, 46, "none", "fuera", 1.0)}{obj(puesto(380), 74, 46, "pop", "", .4)}
      {txt(kt("ACABÓ *CERRANDO*", "xl hueso", 1.6), 50, 86, 90)}'''
    E["m_mundo"] = icono_texto("1f30d", "POR *TODO EL MUNDO*", "bajo el control de Kroc", "", "izq", "", True, "zoom", "spin-slow", 360, (("1f354", 86, 80),))
    E["m_granvia"] = f'''{F("", True)}{obj(spr("1f1ea-1f1f8", 200), 20, 34, "pop", "bob", .2)}{txt(kt("1981", "mega rojo", .5, .12, "slam"), 62, 34, 60)}{txt(kt("GRAN VÍA DE *MADRID*", "xl", 1.0), 62, 54, 66)}{txt(kt("el primero de España", "l", 1.6), 62, 70, 60)}'''
    E["m_paises"] = cifra("+100 PAÍSES", "DECENAS DE MILES DE RESTAURANTES", "1f30e")
    E["m_pelicula"] = icono_texto("1f3ac", "«EL *FUNDADOR*»", "la película, en 2016", "", "der", "dark", True, "flip", "bob", 340, (("1f37f", 14, 80),))
    E["m_ironia"] = impacto("un título con ironía:", "EL SISTEMA *LO INVENTARON OTROS*", "", "1f60f")
    E["leccion1"] = leccion(1, "inventar un buen sistema no basta", "ALGUIEN TIENE QUE *MULTIPLICARLO*", "1f501")
    E["leccion2"] = leccion(2, "el negocio real no siempre es el que ves", "HAMBURGUESAS… *Y TERRENOS*", "1f3d7-fe0f")
    E["leccion3"] = leccion(3, "en los negocios", "LO QUE NO ESTÁ POR ESCRITO *NO EXISTE*", "270d-fe0f")
    E["m_final"] = f'''{F("calido", True)}{obj(spr("1f468", 200), 18, 44, "pop", "bob", .2)}{obj(spr("1f468", 200), 34, 44, "pop", "bob", .4)}
      {txt(kt("CREARON EL SISTEMA…", "xl", .7), 70, 36, 54)}{txt(kt("*Y SE QUEDARON SIN SU NOMBRE*", "xl", 1.4), 70, 54, 54)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:150px">{puesto(470, "THE BIG M", NARANJA)}</div>
      <div style="position:absolute;left:160px;top:490px">{vicon("hamburger", 150)}</div>
      <div class="big" style="top:100px"><div class="s">LES QUITARON</div><div class="q" style="font-size:150px;margin-top:22px">SU PROPIO</div><div class="q" style="font-size:150px">APELLIDO</div><div class="y">LOS HERMANOS McDONALD</div></div>'''
