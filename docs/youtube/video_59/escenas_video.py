"""Escenas del vídeo 59 (especial Navidad: Toys "R" Us). Motor común; sin logotipos ni la mascota real: jirafa y tiendas genéricas."""
from base import *

CAP_ICONOS = {1: "1f6cf-fe0f", 2: "1f6d2", 3: "1f992", 4: "1f451", 5: "1f1ea-1f1f8", 6: "1f4bb", 7: "1f4b8", 8: "1f504", 9: "1f9e0"}

def catalogo(w=360, d=.2):
    """Catálogo de juguetes genérico con círculos de rotulador."""
    an = "" if d is None else f"animation:ePop .5s ease {d}s both;"
    iconos = "".join(f'<rect x="{18 + (i % 3) * 92}" y="{70 + (i // 3) * 92}" width="76" height="76" rx="10" fill="#{c}"/>' for i, c in enumerate(["ffd166", "8ecae6", "f4a3a3", "b8e0a8", "e2c2ff", "ffd6a5"]))
    circ = '<ellipse cx="148" cy="108" rx="52" ry="48" fill="none" stroke="#D7263D" stroke-width="6" transform="rotate(-8 148 108)"/><ellipse cx="240" cy="198" rx="50" ry="46" fill="none" stroke="#D7263D" stroke-width="6" transform="rotate(6 240 198)"/>'
    return (f'<svg width="{w}" height="{w*1.2:.0f}" viewBox="0 0 300 360" style="{an}"><rect x="4" y="4" width="292" height="352" rx="12" fill="#fff" stroke="{TINTA}" stroke-width="5"/>'
            f'<rect x="4" y="4" width="292" height="52" rx="12" fill="#2BB673"/><text x="150" y="40" text-anchor="middle" font-family="Bebas" font-size="32" fill="#fff">CATÁLOGO DE NAVIDAD</text>'
            f'{iconos}{circ}</svg>')

def escenas():
    E = {}
    E["tr_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f992", "2744-fe0f", "1f381"), "navidad", True, "mega")
    E["tr_taller"] = lista([("1f6e3-fe0f", "pasillos enormes"), ("1f5c4-fe0f", "estanterías hasta el techo"), ("1f9f8", "juguetes hasta donde alcanza la vista")], "COMO EL TALLER DE PAPÁ NOEL")
    E["tr_catalogo"] = f'''{F("calido", True)}<div class="pos" style="left:28%;top:52%">{catalogo(400)}</div>{obj(spr("1f58a-fe0f", 140), 44, 34, "drop", "swing", 1.0)}{txt(kt("EL CATÁLOGO, *MARCADO CON ROTULADOR*", "xl", .6), 70, 44, 50)}'''
    E["tr_grande"] = titular("LA JUGUETERÍA *MÁS GRANDE DEL MUNDO*", "durante décadas", "", ("1f9f8", "1f30d", "1f992", "1f451"), "navidad", True, "xl")
    E["tr_2018"] = comparar("1f4bb", "no solo por internet", "1f4b8", "sobre todo, por una deuda", "→", "2018: CIERRA EN EE. UU.")
    E["tr_historia"] = titular("LA HISTORIA DE *TOYS R US*", "", "", ("1f992", "1f9f8", "1f6d2", "1f4b8"), "navidad", True, "xl")
    E["tr_1948"] = cifra("1948", "WASHINGTON", "1f3db-fe0f")
    E["tr_lazarus"] = icono_texto("1f468", "CHARLES *LAZARUS*", "hijo de un vendedor de bicicletas, vuelve de la guerra", "", "izq", "sepia", False, "pop", "bob", 380, (("1f6b2", 84, 78),))
    E["tr_babyboom"] = flecha("1f492", "1f476", "BODAS → *BABY BOOM*", "muchísimos hijos")
    E["tr_muebles"] = lista([("1f6cf-fe0f", "cunas"), ("1f6bc", "cochecitos"), ("1fa91", "tronas")], "UNA TIENDA DE MUEBLES PARA BEBÉS")
    E["tr_cuna"] = comparar("1f6cf-fe0f", "una cuna: se compra una vez", "1f9f8", "juguetes: una y otra vez", "VS", "SEGÚN SE CUENTA, LE PEDÍAN JUGUETES")
    E["tr_juguetes"] = impacto("así que empezó a vender", "MÁS *JUGUETES*", "", "1f9f8")
    E["tr_idea"] = comparar("1f6d2", "un supermercado de alimentos", "1f9f8", "un supermercado de juguetes", "=", "UNA IDEA REVOLUCIONARIA")
    E["tr_autoservicio"] = lista([("1f3ec", "tiendas enormes"), ("1f6d2", "autoservicio con carrito"), ("1f3f7-fe0f", "precios bajos")], "LA FÓRMULA")
    E["tr_1957"] = cifra("1957", "LA PRIMERA TIENDA SOLO DE JUGUETES, EN MARYLAND", "1f3ec")
    E["tr_juego"] = bocadillos("1f9d2", ["Toys R Us…", "…«los juguetes somos nosotros»"], "un juego de palabras en inglés")
    E["tr_r"] = f'''{F("navidad", True)}<div class="pos" style="left:30%;top:50%;font-family:Bebas;font-size:420px;color:#ffd166;transform:translate(-50%,-50%) scaleX(-1);text-shadow:8px 8px 0 #111;animation:ePop .5s ease .2s both">R</div>{txt(kt("UNA R *AL REVÉS*", "xl hueso", .6), 70, 42, 50)}{txt(kt("como si la hubiera escrito un niño", "l naranja", 1.3), 70, 58, 50)}'''
    E["tr_perfecto"] = lista([("2702-fe0f", "corto"), ("1f602", "divertido"), ("1f9e0", "fácil de recordar"), ("1f476", "y repetido para bebés")], "EL NOMBRE PERFECTO")
    E["tr_mascota"] = impacto("toda marca para niños necesita", "UNA *MASCOTA*", "", "1f992")
    E["tr_graffe"] = flecha("1f4f0", "1f992", "«DR. G. RAFFE» → *GEOFFREY*", "de los anuncios de cunas a la jirafa de la tienda")
    E["tr_geoffrey"] = f'''{F("calido", True)}{obj(spr("1f992", 340), 28, 52, "pop", "bob", .2)}{txt(kt("PARA MUCHOS NIÑOS, *LA JIRAFA ERA LA TIENDA*", "xl", .6), 68, 42, 56)}{txt(kt("anuncios, bolsas, catálogos…", "l naranja", 1.3), 68, 58, 56)}'''
    E["tr_cancion"] = bocadillos("1f9d2", ["No quiero crecer…", "…soy un niño de Toys R Us"], "la canción de los años ochenta")
    E["tr_infancia"] = titular("NO VENDÍA JUGUETES: *VENDÍA LA INFANCIA*", "", "", ("1f9f8", "1f992", "1f476", "2728"), "navidad", True, "xl")
    E["tr_gigante"] = impacto("años setenta y ochenta:", "EL GIGANTE *DEL JUGUETE*", "", "1f451")
    E["tr_1978"] = cifra("1978", "SALE A BOLSA… Y A CONQUISTAR EL MUNDO, HASTA JAPÓN", "1f30d")
    E["tr_ventas"] = cifra("NOV. + DIC.", "UNA PARTE ENORME DE LAS VENTAS DEL AÑO", "1f384")
    E["tr_catalogo2"] = f'''{F("navidad", True)}<div class="pos" style="left:28%;top:52%">{catalogo(400, .2)}</div>{txt(kt("CASI UNA *LISTA DE LA COMPRA*", "xl hueso", .6), 70, 42, 50)}{txt(kt("semanas eligiendo", "l naranja", 1.3), 70, 58, 50)}'''
    E["tr_colas"] = icono_texto("1f4f0", "COLAS *EN LAS NOTICIAS*", "cada vez que salía un juguete de moda", "", "der", "", False, "pop", "shake")
    E["tr_poder"] = icono_texto("1f3ed", "LOS FABRICANTES *PENSABAN EN ÉL*", "al diseñar sus campañas", "tanto poder tenía", "izq", "", True, "pop", "bob")
    E["tr_espana"] = impacto("y en España", "TAMBIÉN SE HIZO *UN HUECO*", "", "1f1ea-1f1f8")
    E["tr_tiendas"] = cifra("+50 TIENDAS", "EN ESPAÑA, SOBRE TODO EN CENTROS COMERCIALES", "1f3ec")
    E["tr_reyes"] = flecha("1f992", "1f48c", "LA TIENDA DE LA JIRAFA *→ LA CARTA A LOS REYES*", "")
    E["tr_6enero"] = cifra("6 DE ENERO", "AQUÍ LA TEMPORADA ERA AÚN MÁS LARGA", "1f451")
    E["tr_problemas"] = impacto("pero al otro lado del Atlántico,", "EMPEZABAN *LOS PROBLEMAS*", "", "26a0-fe0f")
    E["tr_super"] = icono_texto("1f6d2", "JUGUETES *A PRECIO DE COSTE*", "las grandes cadenas los usaban para atraer clientes", "problema uno", "izq", "", False, "pop", "shake")
    E["tr_nopuede"] = icono_texto("1f6ab", "TOYS R US *NO PODÍA*", "solo vendía juguetes", "", "der", "dark", False, "pop", "")
    E["tr_internet"] = impacto("problema dos:", "*INTERNET*", "uno de los errores más citados del comercio", "1f4bb")
    E["tr_2000"] = cifra("2000", "UN ACUERDO PARA VENDER SUS JUGUETES… EN AMAZON", "1f91d")
    E["tr_tribunales"] = flecha("1f91d", "2696-fe0f", "DEL ACUERDO *A LOS TRIBUNALES*", "y la juguetería se quedó atrás en internet")
    E["tr_amazon"] = titular("SU SOCIO *APRENDIÓ A VENDER JUGUETES*", "y se convirtió en su gran competidor", "", ("1f4bb", "1f4e6", "1f9f8", "1f62c"))
    E["tr_pantallas"] = lista([("1f3ae", "videojuegos"), ("1f4f1", "tabletas"), ("1f4f2", "móviles")], "PROBLEMA TRES: LOS NIÑOS DEJABAN ANTES LOS JUGUETES")
    E["tr_dentro"] = impacto("el golpe definitivo", "VINO *DE DENTRO*", "", "1f4a3")
    E["tr_2005"] = cifra("2005", "TRES FONDOS DE INVERSIÓN COMPRAN TOYS R US", "1f3e6", "entre 6.500 y 7.500 millones de dólares, según la fuente")
    E["tr_formula"] = flecha("1f3e6", "1f3ec", "LA DEUDA DE LA COMPRA *PASA A LA EMPRESA*", "una fórmula muy habitual")
    E["tr_intereses"] = lista([("1f3ec", "renovar tiendas"), ("1f4bb", "mejorar la web"), ("1f3f7-fe0f", "bajar precios")], "CIENTOS DE MILLONES EN INTERESES, EN VEZ DE…")
    E["tr_quiebra"] = cifra("+5.000 MILLONES $", "DE DEUDA: QUIEBRA EN 2017 Y CIERRE EN EE. UU. EN 2018", "1f4c9")
    E["tr_lazarus_muere"] = icono_texto("1f56f-fe0f", "MUERE CHARLES *LAZARUS*", "una semana después de anunciarse la liquidación, a los 94 años", "", "izq", "dark", False, "pop", "glow")
    E["tr_espana2"] = impacto("¿y en España?", "LA HISTORIA FUE *DISTINTA*", "", "1f1ea-1f1f8")
    E["tr_fondo"] = icono_texto("1f3e6", "UN FONDO *Y SUS DIRECTIVOS*", "compran la filial de España y Portugal: las tiendas siguen", "2018", "der", "", False, "pop", "bob")
    E["tr_pandemia"] = lista([("1f637", "pandemia"), ("1f6aa", "cierres de tiendas"), ("2696-fe0f", "concurso de acreedores")], "PERO NO FUE FÁCIL")
    E["tr_prenatal"] = icono_texto("1f476", "EL DUEÑO DE *PRÉNATAL*", "se queda con buena parte de las tiendas", "", "izq", "calido", True, "pop", "bob")
    E["tr_vuelve"] = lista([("1f992", "se vendió la marca"), ("1f3ea", "tiendas más pequeñas"), ("1f3ec", "espacios en otros almacenes")], "EN EE. UU., LA MARCA VUELVE")
    E["tr_sobrevive"] = f'''{F("navidad", True)}{obj(spr("1f992", 320), 30, 52, "pop", "bob", .2)}{txt(kt("LA EMPRESA QUEBRÓ. *LA JIRAFA SOBREVIVIÓ*", "xl hueso", .6), 70, 46, 52)}'''
    E["leccion1"] = leccion(1, "no dejes que otro", "*CONSTRUYA TU FUTURO*", "1f4bb")
    E["leccion2"] = leccion(2, "la deuda puede matar", "*A UNA EMPRESA QUE VENDE MUCHO*", "1f4b8")
    E["leccion3"] = leccion(3, "una marca querida", "*VALE MÁS QUE SUS TIENDAS*", "1f992")
    E["tr_final"] = lista([("1f6cf-fe0f", "una tienda de cunas"), ("1f6d2", "un supermercado"), ("1f992", "una jirafa"), ("1f58a-fe0f", "un catálogo"), ("1f4b8", "una deuda")], "")
    E["tr_rotulador"] = f'''{F("navidad", True)}<div class="pos" style="left:28%;top:52%">{catalogo(380, .2)}</div>{txt(kt("YA SABES *CÓMO TERMINÓ*", "xl hueso", .6), 70, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:40px;top:200px;transform:rotate(-6deg)">{catalogo(300, None)}</div>
      <div style="position:absolute;left:300px;top:200px">{vicon("giraffe", 230)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">LA JUGUETERÍA GIGANTE</div><div class="q" style="font-size:140px;margin-top:22px">QUE QUEBRÓ</div><div class="y">TOYS R US</div></div>'''
