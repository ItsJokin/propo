"""Escenas del vídeo 22 (Ferrari contra Lamborghini, formato largo). Motor común; sin logotipos ni escudos: coches, caballos y toros genéricos."""
from base import *

CAP_ICONOS = {1: "1f9d1-200d-1f527", 2: "1f69c", 3: "1f40e", 4: "2699-fe0f", 5: "1f3ed", 6: "1f402", 7: "1f3ce-fe0f", 8: "1f1ea-1f1f8",
              9: "1f4c9", 10: "1f500", 11: "1f9e0"}

def deportivo(px=520, color=ROJO, bajo=False):
    alto = 30 if bajo else 44
    return (f'<svg width="{px}" height="{px*0.36:.0f}" viewBox="0 0 300 108"><path d="M10,80 L22,{80-alto//2} C60,{80-alto} 120,{78-alto} 165,{80-alto} C200,{82-alto} 240,{86-alto//1.6:.0f} 285,62 L292,80Z" '
            f'fill="{color}" stroke="{TINTA}" stroke-width="4"/><path d="M120,{83-alto} L168,{82-alto} L192,{86-alto//1.6:.0f} L110,{86-alto//1.6:.0f}Z" fill="#9fc3e6" stroke="{TINTA}" stroke-width="3"/>'
            f'<circle cx="72" cy="82" r="20" fill="{TINTA}"/><circle cx="72" cy="82" r="9" fill="#c9ced6"/><circle cx="232" cy="82" r="20" fill="{TINTA}"/><circle cx="232" cy="82" r="9" fill="#c9ced6"/></svg>')

def escenas():
    E = {}
    AM = "#f2b705"
    E["fl_norte"] = f'''{F("", True)}{obj(deportivo(420, ROJO), 28, 44, "left", "", .2)}{obj(deportivo(420, AM, True), 72, 62, "right", "", .6)}{txt(kt("A POCOS KILÓMETROS, *EN EL NORTE DE ITALIA*", "xl", 1.2), 50, 18, 90)}'''
    E["fl_caballo_toro"] = comparar("1f40e", "uno lleva un caballo", "1f402", "el otro, un toro", "VS")
    E["fl_leyenda"] = impacto("según la leyenda, la segunda existe por", "UNA *DISCUSIÓN*", "", "1f4a2")
    E["fl_embrague"] = flecha("1f69c", "1f3ce-fe0f", "UN FABRICANTE DE TRACTORES *SE QUEJA*", "y decide fabricar sus propios deportivos")
    E["fl_sevilla"] = lista([("1f402", "una ganadería de Sevilla"), ("1f1ea-1f1f8", "nombres españoles"), ("2753", "un final inesperado")], "POR EL CAMINO…")
    E["fl_historia"] = comparar("1f40e", "Ferrari", "1f402", "Lamborghini", "VS", "LA HISTORIA")
    E["fl_1916"] = icono_texto("1f9d1-200d-1f33e", "FERRUCCIO *LAMBORGHINI*", "nace en 1916 en una familia de agricultores de Emilia-Romaña", "", "izq", "sepia", False, "up", "bob")
    E["fl_maquinas"] = comparar("1f33e", "el campo, no", "2699-fe0f", "las máquinas, sí", "/")
    E["fl_desmonta"] = icono_texto("1f527", "DESMONTANDO *MOTORES*", "desde niño; estudió para ser mecánico", "", "der", "", True, "spin", "swing")
    E["fl_rodas"] = icono_texto("2708-fe0f", "MECÁNICO EN *RODAS*", "aviación italiana, Segunda Guerra Mundial", "", "izq", "sepia", False, "left", "float", 340, (("1f3dd-fe0f", 86, 80),))
    E["fl_recursos"] = icono_texto("1f9f0", "REPARAR *CON CUALQUIER PIEZA*", "con muy pocos recursos", "", "der", "", False, "pop", "bob")
    E["fl_prisionero"] = icono_texto("26d3-fe0f", "*PRISIONERO*", "tardó un tiempo en volver a casa", "al terminar la guerra:", "izq", "dark", False, "drop", "")
    E["fl_chatarra"] = f'''{F("sepia", True)}{"".join(obj(spr(c, 150), x, y, "drop", "", .1 + i * .2) for i, (c, x, y) in enumerate([("1f69b", 20, 60), ("1f69a", 40, 64), ("2699-fe0f", 28, 36), ("1f529", 46, 40)]))}
      {txt(kt("UNA ITALIA *LLENA DE CHATARRA MILITAR*", "xl", 1.0), 74, 46, 46)}<div class="viñeta"></div>'''
    E["fl_faltaban"] = icono_texto("1f33e", "FALTABAN *TRACTORES*", "para reconstruir la agricultura", "", "izq", "", True, "pop", "bob")
    E["fl_idea"] = flecha("1f69b", "1f69c", "MOTORES MILITARES → *TRACTORES*", "")
    E["fl_1948"] = anio(1900, 1948, "funda su empresa de tractores", "1f69c")
    E["fl_robustos"] = lista([("1f4aa", "robustos"), ("1f527", "sencillos"), ("1f4b6", "baratos")], "")
    E["fl_grande"] = f'''{F("calido", True)}{"".join(obj(spr("1f69c", 140), 10 + i * 13, 50, "left", "", .1 + i * .15) for i in range(7))}{txt(kt("DE LOS GRANDES *FABRICANTES DE TRACTORES*", "xl", 1.3), 50, 82, 90)}'''
    E["fl_calefaccion"] = icono_texto("2668-fe0f", "CALEFACCIONES *Y AIRE ACONDICIONADO*", "otra empresa", "", "der", "", False, "pop", "")
    E["fl_rico"] = f'''{F("", True)}{obj(spr("1f4b0", 200), 18, 40, "pop", "glow", .2)}{obj(deportivo(360), 50, 62, "left", "", .7)}{txt(kt("MUY RICO… Y *COLECCIONISTA DE DEPORTIVOS*", "xl", 1.1), 70, 30, 56)}'''
    E["fl_enzo"] = impacto("el otro protagonista:", "ENZO *FERRARI*", "", "1f40e")
    E["fl_piloto"] = comparar("1f3ce-fe0f", "piloto en los años veinte", "1f3c1", "jefe de competición de Alfa Romeo", "→")
    E["fl_1947"] = f'''{F("", True)}{obj(deportivo(460), 32, 52, "left", "", .2)}{txt(kt("1947", "mega rojo", .6, .1, "slam"), 74, 36, 44)}{txt(kt("MARANELLO", "xl", 1.0), 74, 54, 44)}{txt(kt("los primeros coches con su nombre", "l", 1.5), 74, 68, 44)}'''
    E["fl_carreras"] = comparar("1f697", "coches de calle", "1f3c1", "para pagar las carreras", "→")
    E["fl_caracter"] = icono_texto("1f624", "CARÁCTER *DIFÍCIL*", "orgulloso y poco dispuesto a escuchar críticas", "", "izq", "", False, "pop", "shake")
    E["fl_club"] = icono_texto("1f48e", "UN CLUB *EXCLUSIVO*", "no era solo comprar un coche", "", "der", "calido", True, "zoom", "glow")
    E["fl_ford"] = icono_texto("1f91d", "FORD QUISO *COMPRAR FERRARI*", "1963: Enzo se echó atrás en el último momento", "", "izq", "", False, "pop", "")
    E["fl_lemans"] = f'''{F("dark", True)}{obj(spr("1f3c1", 220), 24, 40, "pop", "swing", .2)}{txt(kt("LE MANS, 1966", "xl naranja", .6, .1, "slam"), 66, 34, 56)}{txt(kt("Ford le vence donde más le dolía", "xl hueso", 1.2), 66, 56, 56)}'''
    E["fl_enemigo"] = impacto("aquel mismo año, Enzo se ganaría", "OTRO *ENEMIGO*", "mucho más cerca de casa", "1f440")
    E["fl_tenia"] = f'''{F("", True)}{obj(deportivo(300), 22, 42, "left", "", .1)}{obj(deportivo(300), 50, 60, "left", "", .4)}{obj(deportivo(300), 78, 42, "left", "", .7)}{txt(kt("FERRUCCIO TENÍA *VARIOS FERRARI*", "xl", 1.2), 50, 86, 90)}'''
    E["fl_problema"] = icono_texto("2699-fe0f", "EL EMBRAGUE *SE ESTROPEABA*", "con frecuencia, según contó él mismo", "", "izq", "", True, "spin", "shake")
    E["fl_taller"] = icono_texto("1f527", "AL TALLER, *UNA Y OTRA VEZ*", "", "", "der", "", False, "pop", "bob")
    E["fl_desmonta2"] = icono_texto("1f9d1-200d-1f527", "LO DESMONTA *ÉL MISMO*", "como buen mecánico", "", "izq", "", True, "up", "bob")
    E["fl_pieza"] = comparar("1f69c", "la pieza de sus tractores", "1f3ce-fe0f", "casi igual, mucho más cara", "≈", "SEGÚN SU VERSIÓN")
    E["fl_queja"] = flecha("1f9d1-200d-1f33e", "1f40e", "VA A VER A ENZO *A QUEJARSE*", "y a darle algunas ideas")
    E["fl_respuesta"] = bocadillos("1f624", ["El problema no es el coche…", "…es el conductor", "Dedícate a los tractores"], "la respuesta que se ha contado durante décadas")
    E["fl_versiones"] = icono_texto("1f9d0", "VERSIONES *QUE VARÍAN*", "algunos historiadores creen que se ha ido adornando", "", "der", "", False, "pop", "swing")
    E["fl_seguro"] = impacto("lo que es seguro", "ES LO QUE *PASÓ DESPUÉS*", "", "1f525")
    E["fl_1963"] = anio(1900, 1963, "funda su propia marca de deportivos", "1f402")
    E["fl_santagata"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("SANT'AGATA BOLOGNESE", "mega", .3, .1, "slam"), 50, 32, 95)}{txt(kt("muy cerca de Maranello", "l", 1.1), 50, 50, 80)}'''
    E["fl_objetivo"] = lista([("1f6cb-fe0f", "más cómodo"), ("2728", "más refinado"), ("1f527", "más fiable")], "MEJOR QUE UN FERRARI")
    E["fl_ingenieros"] = icono_texto("1f477", "INGENIEROS *CON EXPERIENCIA*", "alguno había trabajado para Ferrari", "", "izq", "", True, "up", "bob")
    E["fl_350"] = f'''{F("", True)}{obj(deportivo(460, AM), 32, 52, "left", "", .2)}{txt(kt("1964", "mega rojo", .6, .1, "slam"), 74, 36, 44)}{txt(kt("EL *350 GT*", "xl", 1.0), 74, 54, 44)}{txt(kt("motor de doce cilindros", "l", 1.5), 74, 68, 44)}'''
    E["fl_nocarreras"] = icono_texto("1f6ab", "NADA *DE CARRERAS*", "le parecían un gasto enorme", "", "der", "", False, "pop", "")
    E["fl_carretera"] = titular("LOS MEJORES COCHES *DE CARRETERA*", "punto", "", ("1f6e3-fe0f", "1f3ce-fe0f", "2b50", "1f402"), "", True, "xl")
    E["fl_toro"] = comparar("1f40e", "Ferrari: un caballo", "1f402", "Lamborghini: un toro", "VS")
    E["fl_tauro"] = icono_texto("2649", "SIGNO: *TAURO*", "Ferruccio había nacido bajo el signo del toro", "", "izq", "espacio", True, "pop", "float")
    E["fl_miura_visita"] = f'''{F("calido", True)}{obj(spr("1f402", 280), 26, 50, "left", "bob", .2)}{obj(spr("1f1ea-1f1f8", 140), 14, 22, "pop", "", .6)}{txt(kt("1962: GANADERÍA *DE EDUARDO MIURA*", "xl", .8), 68, 42, 56)}{txt(kt("Sevilla, una de las más famosas del mundo taurino", "l", 1.4), 68, 58, 56)}'''
    E["fl_simbolo"] = icono_texto("1f402", "UN TORO DE LIDIA *COMO SÍMBOLO*", "", "", "der", "", True, "zoom", "pulse")
    E["fl_bravura"] = lista([("1f4aa", "fuerza"), ("1f525", "bravura"), ("1f6e1-fe0f", "no retrocede")], "FRENTE AL CABALLO DE MARANELLO")
    E["fl_consecuencia"] = impacto("aquel viaje tendría", "UNA CONSECUENCIA *MAYOR*", "", "2728")
    E["fl_jovenes"] = icono_texto("1f9d1-200d-1f527", "JÓVENES INGENIEROS, *EN SU TIEMPO LIBRE*", "un proyecto secreto en la fábrica", "", "izq", "", True, "up", "bob")
    E["fl_motor"] = f'''{F()}{obj(deportivo(480, "#e9a23b", True), 34, 50, "pop", "", .2)}<div class="pos" style="left:42%;top:44%;width:110px;height:50px;border:5px dashed {ROJO};border-radius:10px"></div>
      {txt(kt("EL MOTOR *DETRÁS DE LOS ASIENTOS*", "xl", .9), 76, 42, 44)}{txt(kt("como en los coches de carreras", "l", 1.5), 76, 58, 44)}'''
    E["fl_noconvencido"] = icono_texto("1f928", "NO DEL TODO *CONVENCIDO*", "pero les dejó seguir adelante", "Ferruccio:", "der", "", False, "pop", "swing")
    E["fl_gandini"] = icono_texto("1f468-200d-1f3a8", "MARCELLO *GANDINI*", "un joven diseñador del estudio Bertone", "la carrocería:", "izq", "", True, "up", "bob")
    E["fl_ginebra"] = f'''{F("dark", True)}{obj(deportivo(560, "#e9a23b", True), 50, 46, "zoom", "", .2)}{"".join(obj(spr("1f4f8", 110), x, 22, "pop", "", .8 + i * .2) for i, x in enumerate([20, 40, 60, 80]))}{txt(kt("GINEBRA, 1966: *SENSACIÓN*", "xl hueso", 1.2), 50, 82, 90)}'''
    E["fl_superdeportivo"] = titular("EL PRIMER *SUPERDEPORTIVO*", "para muchos", "bajo, ancho, espectacular", ("1f3ce-fe0f", "2b50", "1f525", "1f60d"), "", True, "xl")
    E["fl_miura"] = f'''{F("calido", True)}{obj(spr("1f402", 240), 24, 46, "pop", "", .2)}{txt(kt("SU NOMBRE:", "l", .5), 64, 30, 56)}{txt(kt("*MIURA*", "mega", .9, .12, "slam"), 64, 48, 56)}{txt(kt("por aquella ganadería de Sevilla", "l", 1.6), 64, 66, 56)}'''
    E["fl_nombres"] = titular("NOMBRES *DEL MUNDO DEL TORO*", "en España", "", ("1f402", "1f1ea-1f1f8", "1f3ce-fe0f", "2b50"))
    E["fl_islero"] = icono_texto("1f402", "*ISLERO*", "el toro que hirió de muerte a Manolete en 1947", "", "izq", "sepia", False, "pop", "")
    E["fl_espada"] = icono_texto("1f5e1-fe0f", "*ESPADA*", "la espada del torero", "", "der", "", False, "pop", "swing")
    E["fl_jarama"] = icono_texto("1f33e", "*JARAMA*", "una histórica zona ganadera", "", "izq", "", False, "pop", "bob")
    E["fl_murcielago"] = icono_texto("1f987", "*MURCIÉLAGO*", "un toro indultado por su bravura en Córdoba, en 1879, según la historia", "", "der", "dark", True, "pop", "float")
    E["fl_gallardo"] = icono_texto("1f402", "*GALLARDO*", "homenaje a una antigua casta de toros de lidia", "", "izq", "", False, "pop", "bob")
    E["fl_countach"] = icono_texto("1f62e", "LA EXCEPCIÓN: *COUNTACH*", "una exclamación de asombro en dialecto piamontés", "", "der", "", True, "pop", "shake")
    E["fl_espanoles"] = comparar("1f1ee-1f1f9", "superdeportivos italianos", "1f1ea-1f1f8", "con nombres españoles", "+")
    E["fl_torcerse"] = impacto("principios de los setenta:", "TODO EMPIEZA *A TORCERSE*", "", "1f4c9")
    E["fl_bolivia"] = icono_texto("1f69c", "UN PEDIDO PARA BOLIVIA, *CANCELADO*", "tras un cambio de gobierno, según la historia de la marca", "", "izq", "", False, "drop", "shake")
    E["fl_petroleo"] = comparar("26a0-fe0f", "conflictos laborales", "26fd", "la crisis del petróleo", "+")
    E["fl_vende"] = icono_texto("1f4b8", "VENDE *SUS EMPRESAS*", "la de coches, a unos inversores suizos", "", "der", "", False, "pop", "")
    E["fl_vino"] = f'''{F("calido", True)}{obj(spr("1f347", 220), 24, 46, "pop", "bob", .2)}{obj(spr("1f377", 180), 40, 56, "pop", "", .6)}{txt(kt("UNA FINCA EN UMBRIA: *VINO*", "xl", .9), 72, 46, 50)}'''
    E["fl_muere"] = icono_texto("1f56f-fe0f", "MUERE *EN 1993*", "nunca volvió a fabricar coches", "", "izq", "dark", False, "pop", "glow")
    E["fl_quiebra"] = icono_texto("1f4c9", "QUIEBRA *Y VARIOS DUEÑOS*", "años muy complicados sin su fundador", "", "der", "", False, "drop", "")
    E["fl_audi"] = cifra("1998", "AUDI (GRUPO VOLKSWAGEN) LA COMPRA", "1f4c8")
    E["fl_fiat"] = comparar("1f91d", "1969: Fiat compra la mitad de Ferrari", "1f56f-fe0f", "1988: muere Enzo Ferrari", "·")
    E["fl_bolsa"] = cifra("2015", "FERRARI SALE A BOLSA", "1f48e", "una de las marcas de lujo más valiosas")
    E["fl_vecinas"] = f'''{F("", True)}{obj(spr("1f40e", 220), 24, 46, "left", "bob", .2)}{txt('<div class="vs" style="--d:.7s">↔</div>', 50, 46, 10)}{obj(spr("1f402", 220), 76, 46, "right", "bob", .5)}{txt(kt("HOY, *A POCOS KILÓMETROS*", "xl", 1.2), 50, 82, 90)}'''
    E["fl_tractores_hoy"] = icono_texto("1f69c", "Y LOS TRACTORES *SIGUEN*", "con la marca Lamborghini, fabricados hoy por otra empresa", "curiosamente,", "izq", "", True, "left", "bob")
    E["leccion1"] = leccion(1, "no subestimes nunca a un cliente", "PUEDE ACABAR *SIENDO TU COMPETENCIA*", "1f9d1-200d-1f33e")
    E["leccion2"] = leccion(2, "un toro y unos nombres españoles", "UN BUEN SÍMBOLO *HACE LEYENDA*", "1f402")
    E["leccion3"] = leccion(3, "la mejor idea puede venir de", "UN GRUPO DE JÓVENES *EN SU TIEMPO LIBRE*", "1f4a1")
    E["fl_final"] = lista([("1f9d1-200d-1f527", "un mecánico"), ("1f69c", "tractores"), ("2699-fe0f", "un embrague"), ("1f402", "un toro de Sevilla")], "")
    E["fl_rival"] = titular("ASÍ NACIÓ *LA GRAN RIVAL*", "de Ferrari", "", ("1f402", "1f40e", "1f3ce-fe0f", "2728"))
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:20px;top:150px">{vicon("tractor", 250)}</div>
      <div style="position:absolute;left:230px;top:330px">{vicon("ox", 230)}</div>
      <div class="big" style="top:100px"><div class="s">EL FABRICANTE DE TRACTORES</div><div class="q" style="font-size:160px;margin-top:22px">QUE RETÓ A</div><div class="q" style="font-size:180px">FERRARI</div><div class="y">LA HISTORIA DE LAMBORGHINI</div></div>'''
