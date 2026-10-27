"""Escenas del vídeo 32 (Tupperware, formato largo). Motor común; sin logotipos: recipientes genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f4a1", 2: "1f6e2-fe0f", 3: "1faa3", 4: "1f6d2", 5: "1f469-200d-1f4bc", 6: "1f3e0", 7: "1f451", 8: "1f6aa",
              9: "1f30d", 10: "1f4c9", 11: "1f9e0"}

def taper(px=300, tapa="#2BB673", cuerpo="#e6f4ff", comida=True):
    c = '<ellipse cx="100" cy="112" rx="58" ry="14" fill="#f2a65a"/><circle cx="80" cy="108" r="9" fill="#7bc96f"/><circle cx="118" cy="110" r="8" fill="#d94f4f"/>' if comida else ""
    return (f'<svg width="{px}" height="{px*0.8:.0f}" viewBox="0 0 200 160"><path d="M28,60 L172,60 L162,148 Q160,154 152,154 L48,154 Q40,154 38,148Z" fill="{cuerpo}" fill-opacity=".85" stroke="{TINTA}" stroke-width="4"/>{c}'
            f'<rect x="18" y="40" width="164" height="24" rx="10" fill="{tapa}" stroke="{TINTA}" stroke-width="4"/><rect x="30" y="34" width="20" height="10" rx="4" fill="{tapa}" stroke="{TINTA}" stroke-width="3"/></svg>')

def escenas():
    E = {}
    E["tu_taper"] = f'''{F("", True)}{obj(taper(360), 30, 50, "drop", "float", .2)}{txt(kt("EN ESPAÑA, TODO ES *UN TÁPER*", "xl", .8), 70, 42, 50)}{txt(kt("sea de la marca que sea", "l", 1.4), 70, 58, 50)}'''
    E["tu_rae"] = icono_texto("1f4d6", "«TÁPER», *EN EL DICCIONARIO*", "lo recoge la Real Academia Española", "", "izq", "sepia", True, "pop", "bob")
    E["tu_tiendas"] = comparar("1f1fa-1f1f8", "una marca estadounidense", "1f6ab", "nadie la compraba en las tiendas", "+")
    E["tu_fiestas"] = icono_texto("1f389", "LA SALVÓ: *LAS FIESTAS EN CASA*", "la idea de una mujer", "", "der", "calido", True, "pop", "bob")
    E["tu_borrada"] = comparar("1f4f0", "portada de una revista de negocios", "1f6aa", "despedida y casi borrada", "→")
    E["tu_historia"] = titular("LA HISTORIA DE *TUPPERWARE*", "", "", ("1f963", "1f3e0", "1f389", "1f4a1"), "", True, "xl")
    E["tu_earl"] = icono_texto("1f468-200d-1f33e", "EARL *TUPPER*", "New Hampshire, 1907 · familia de granjeros", "", "izq", "sepia", False, "up", "bob")
    E["tu_cuadernos"] = lista([("1f4d3", "cuadernos de inventos"), ("1faae", "peines"), ("1f944", "utensilios")], "DESDE JOVEN")
    E["tu_depresion"] = icono_texto("1f4c9", "LA GRAN DEPRESIÓN *LO ARRUINA*", "su negocio de jardinería", "", "der", "", False, "pop", "")
    E["tu_dupont"] = icono_texto("2697-fe0f", "DUPONT: *EL PLÁSTICO*", "un material que casi nadie sabía usar", "una gran empresa química", "izq", "", False, "pop", "bob")
    E["tu_propia"] = flecha("1f3ed", "1f3e0", "SE MARCHA *A MONTAR LA SUYA*", "")
    E["tu_escoria"] = icono_texto("1faa8", "ESCORIA *DE POLIETILENO*", "un residuo del refinado del petróleo", "según sus biografías", "izq", "dark", False, "drop", "")
    E["tu_negra"] = lista([("26ab", "negra"), ("1f922", "maloliente"), ("1f528", "difícil de trabajar")], "")
    E["tu_meses"] = icono_texto("1f9ea", "MESES *DE EXPERIMENTOS*", "hasta conseguir purificarla", "", "der", "", False, "pop", "bob")
    E["tu_plastico"] = lista([("1f938", "flexible"), ("1f4aa", "resistente"), ("1f443", "sin olor"), ("1f60b", "sin sabor")], "UN PLÁSTICO NUEVO")
    E["tu_polit"] = titular("*POLI-T*", "un nombre muy de laboratorio", "", ("1f9ea", "2697-fe0f", "1f52c", "2728"))
    E["tu_guerra"] = comparar("1fa96", "piezas para el ejército", "1f373", "después de la guerra: la cocina", "→")
    E["tu_nevera"] = icono_texto("1f9ca", "EL PRIMER *FRIGORÍFICO*", "y las sobras, tapadas con un trapo o papel", "", "izq", "", False, "pop", "bob")
    E["tu_cerrar"] = impacto("Tupper buscaba", "UNA TAPA QUE *CIERRE DE VERDAD*", "", "1f50d")
    E["tu_pintura"] = flecha("1faa3", "1f963", "LA TAPA DE *LAS LATAS DE PINTURA*", "según se cuenta, su inspiración")
    E["tu_reves"] = f'''{F()}{obj(taper(320, comida=False), 32, 52, "pop", "", .2)}{obj(spr("1f447", 140), 32, 22, "drop", "bob", .8)}{txt(kt("PRESIONAS, *SALE EL AIRE*", "xl", .9), 70, 42, 50)}{txt(kt("cierre hermético", "l", 1.5), 70, 58, 50)}'''
    E["tu_eructo"] = bocadillos("1f963", ["¡Pfff!", "el «eructo»"], "un pequeño ruido al cerrar")
    E["tu_1946"] = cifra("1946", "TUPPER + «WARE» (MENAJE) = TUPPERWARE", "1f963", "los primeros recipientes a la venta")
    E["tu_llevar"] = icono_texto("1f929", "ALGO *REVOLUCIONARIO*", "y lo llevó a las tiendas", "", "izq", "", True, "pop", "bob")
    E["tu_nosevende"] = impacto("", "Y NO *SE VENDÍA*", "", "1f6ab")
    E["tu_estanteria"] = f'''{F()}{"".join(obj(taper(170, ["#2BB673", "#FF8C1A", "#2E6BD6"][i % 3], comida=False), 18 + i * 16, 50, "pop", "", .2 + i * .15) for i in range(5))}<div class="pos" style="left:50%;top:62%;width:1500px;height:16px;background:#8a5a3b"></div>{txt(kt("EN LA ESTANTERÍA, *UN OBJETO CUALQUIERA*", "xl", 1.2), 50, 84, 90)}'''
    E["tu_cierre"] = icono_texto("1f615", "NO SABÍAN *CERRARLO*", "y pensaban que estaba defectuoso", "", "der", "", False, "pop", "swing")
    E["tu_moma"] = icono_texto("1f3db-fe0f", "EN EL *MUSEO DE ARTE MODERNO*", "de Nueva York, hoy", "un diseño excelente", "izq", "", True, "pop", "bob")
    E["tu_facturas"] = comparar("1f5bc-fe0f", "un objeto de museo", "1f9fe", "no paga las facturas", "≠")
    E["tu_explicar"] = titular("ALGUIEN QUE *LO ENSEÑE EN DIRECTO*", "", "el invento necesitaba", ("1f5e3-fe0f", "1f963", "1f440", "1f44f"), "", True, "xl")
    E["tu_detroit"] = impacto("esa persona apareció en", "DETROIT", "", "1f3d9-fe0f")
    E["tu_wise"] = icono_texto("1f469-200d-1f4bc", "BROWNIE *WISE*", "madre divorciada; vendía productos del hogar puerta a puerta", "", "izq", "calido", False, "up", "bob")
    E["tu_noinvento"] = icono_texto("1f3d8-fe0f", "LAS VENTAS EN CASA *YA EXISTÍAN*", "otras empresas ya hacían demostraciones", "", "der", "", False, "pop", "")
    E["tu_don"] = lista([("1f3b2", "juegos"), ("1f602", "risas"), ("1f381", "premios")], "SU DON: UN ACONTECIMIENTO SOCIAL")
    E["tu_salon"] = f'''{F("calido", True)}{obj(spr("1f6cb-fe0f", 260), 26, 56, "pop", "", .2)}{obj(spr("1f46d", 180), 26, 34, "pop", "bob", .6)}{txt(kt("ENTRE AMIGAS, *EN EL SALÓN*", "xl", .9), 68, 44, 54)}{txt(kt("perfecto para enseñarlos", "l", 1.5), 68, 60, 54)}'''
    E["tu_lanzar"] = f'''{F("", True)}<div class="carrera" style="--d:.2s">{taper(220)}</div>{obj(spr("1f4a7", 120), 80, 70, "pop", "", 1.2)}{obj(spr("1f6ab", 90), 86, 64, "pop", "", 1.4)}{txt(kt("NI UNA GOTA", "mega", .6, .12, "slam"), 50, 24, 90)}{txt(kt("según se cuenta, lanzaba un recipiente lleno", "l", 1.4), 50, 40, 90)}'''
    E["tu_atencion"] = flecha("1f4c8", "1f468-200d-1f33e", "VENDEN TANTO QUE *TUPPER SE FIJA*", "")
    E["tu_1951"] = cifra("1951", "UNA DECISIÓN RADICAL", "26a1")
    E["tu_retira"] = comparar("1f3ec", "fuera de las tiendas", "1f3e0", "solo en reuniones en casa", "→")
    E["tu_vicepresidenta"] = icono_texto("1f469-200d-1f4bc", "WISE, *VICEPRESIDENTA*", "al frente de la red de ventas", "", "der", "", True, "up", "bob")
    E["tu_ejercito"] = f'''{F()}{"".join(obj(spr("1f469", 130), 12 + i * 11, 44 + (i % 2) * 8, "pop", "bob", .2 + i * .12) for i in range(8))}{txt(kt("UN EJÉRCITO *DE VENDEDORAS*", "xl", 1.2), 50, 78, 90)}{txt(kt("ganando su propio dinero", "l", 1.6), 50, 90, 90)}'''
    E["tu_sueldo"] = icono_texto("1f4b5", "SU *PRIMER SUELDO*", "y para algunas, el principio de una carrera", "", "izq", "", True, "pop", "bob")
    E["tu_reunion"] = lista([("1f389", "una fiesta"), ("1f9d1-200d-1f3eb", "una demostración"), ("1f6cd-fe0f", "una tienda")], "CADA REUNIÓN ERA…")
    E["tu_estrella"] = impacto("", "BROWNIE WISE, *UNA ESTRELLA*", "", "2b50")
    E["tu_premios"] = lista([("1f4fa", "electrodomésticos"), ("1f697", "coches"), ("1f48d", "joyas")], "PREMIOS EN FLORIDA")
    E["tu_cavar"] = icono_texto("26cf-fe0f", "REGALOS *ENTERRADOS*", "y las vendedoras cavando para encontrarlos", "según se cuenta", "der", "calido", False, "pop", "swing")
    E["tu_portada"] = cifra("1954", "LA PRIMERA MUJER EN LA PORTADA DE BUSINESS WEEK", "1f4f0")
    E["tu_lema"] = bocadillos("1f469-200d-1f4bc", ["Construye a las personas…", "…y ellas construirán el negocio"], "su lema")
    E["tu_duena"] = icono_texto("1f914", "¿LA DUEÑA *DE TUPPERWARE*?", "eso pensaban muchos", "", "izq", "", False, "pop", "swing")
    E["tu_nogusta"] = icono_texto("1f620", "A TUPPER *NO LE GUSTABA NADA*", "", "", "der", "dark", False, "pop", "")
    E["tu_opuestos"] = comparar("1f636", "Tupper: reservado", "1f929", "Wise: todo lo contrario", "VS")
    E["tu_despide"] = cifra("1958", "TUPPER LA DESPIDE", "1f6aa", "enero de")
    E["tu_demanda"] = flecha("2696-fe0f", "1f4b5", "DEMANDA… *Y ACUERDO*", "aproximadamente el salario de un año")
    E["tu_venta"] = cifra("16 M$", "TUPPER VENDE LA EMPRESA · A WISE, NADA", "1f4b0", "unos meses después")
    E["tu_borrado"] = icono_texto("1f9fd", "BORRADA *DE LA HISTORIA OFICIAL*", "durante décadas", "", "izq", "dark", False, "pop", "")
    E["tu_libros"] = icono_texto("1f4da", "SUS LIBROS, *ENTERRADOS*", "según cuenta su biógrafo", "", "der", "sepia", False, "drop", "")
    E["tu_costarica"] = flecha("1f1fa-1f1f8", "1f1e8-1f1f7", "TUPPER SE MARCHA *A COSTA RICA*", "murió en 1983")
    E["tu_exporta"] = impacto("sin sus dos protagonistas…", "EL SISTEMA *SIGUE*", "", "2699-fe0f")
    E["tu_mundo"] = lista([("1f30d", "Europa"), ("1f30e", "Latinoamérica"), ("1f30f", "Asia")], "LAS REUNIONES LLEGAN A…")
    E["tu_comun"] = titular("DE MARCA A *NOMBRE COMÚN*", "el táper", "en España", ("1f963", "1f1ea-1f1f8", "1f4d6", "2728"), "", True, "xl")
    E["tu_usos"] = lista([("1f4bc", "la comida del trabajo"), ("1f35d", "las sobras"), ("1f475", "lo que manda tu madre")], "")
    E["tu_segundos"] = icono_texto("23f1-fe0f", "UNA REUNIÓN *CADA POCOS SEGUNDOS*", "presumía la marca durante décadas", "", "der", "", True, "spin", "bob")
    E["tu_cambia"] = impacto("", "PERO EL MUNDO *CAMBIÓ*", "", "1f504")
    E["tu_trabajan"] = icono_texto("1f469-200d-1f4bc", "MENOS TIEMPO *PARA REUNIONES*", "cada vez más mujeres trabajaban fuera de casa", "", "izq", "", False, "pop", "bob")
    E["tu_vidrio"] = comparar("1f6d2", "recipientes baratos de muchas marcas", "1fad9", "y la moda del vidrio", "+")
    E["tu_pandemia"] = icono_texto("1f637", "PANDEMIA: *UN ESPEJISMO*", "las ventas repuntaron un tiempo", "", "der", "", False, "pop", "")
    E["tu_intenta"] = comparar("1f3ec", "vuelta a las tiendas", "1f310", "e internet", "+", "NO FRENA LA CAÍDA")
    E["tu_quiebra"] = cifra("2024", "BANCARROTA, CON MÁS DE 1.200 M$ EN DEUDAS", "1f4c9", "septiembre:")
    E["tu_acreedores"] = icono_texto("1f3e6", "LA MARCA, *PARA LOS ACREEDORES*", "el táper sigue; la empresa ya no es lo que era", "", "izq", "", False, "pop", "")
    E["leccion1"] = leccion(1, "un buen producto", "*NO SE VENDE SOLO*", "1f963")
    E["leccion2"] = leccion(2, "a veces el mejor canal de venta es", "*LA CONFIANZA*", "1f91d")
    E["leccion3"] = leccion(3, "si tu marca se vuelve palabra común", "*GANAS… Y PUEDES PERDERLA*", "1f4d6")
    E["tu_final"] = lista([("1f468-200d-1f33e", "un inventor"), ("1faa8", "un desecho negro"), ("1faa3", "una lata de pintura"), ("1f469-200d-1f4bc", "una vendedora"), ("1f6aa", "un despido")], "")
    E["tu_cierra"] = f'''{F("calido", True)}{obj(taper(340), 30, 50, "drop", "float", .2)}{txt(kt("ESE PEQUEÑO *ERUCTO*", "xl", .8), 70, 42, 50)}{txt(kt("ya sabes de dónde viene", "l", 1.4), 70, 58, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:200px">{taper(460)}</div>
      <div class="big" style="top:100px"><div class="s">FRACASÓ EN LAS TIENDAS</div><div class="q" style="font-size:150px;margin-top:22px">TRIUNFÓ EN</div><div class="q" style="font-size:150px">TU SALÓN</div><div class="y">LA HISTORIA DE TUPPERWARE</div></div>'''
