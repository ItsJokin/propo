"""Escenas del vídeo 37 (Atari, formato largo). Motor común; sin logotipos: pantallas, palas y cartuchos genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f3a1", 2: "1f680", 3: "26ab", 4: "1f3d3", 5: "1fa99", 6: "2696-fe0f", 7: "1f34e", 8: "1f4fa",
              9: "1f3c3", 10: "1f47d", 11: "1f3dc-fe0f", 12: "1f9e0"}

def pong(px=620, marcador=("4", "2")):
    return (f'<svg width="{px}" height="{px*0.75:.0f}" viewBox="0 0 320 240"><rect x="4" y="4" width="312" height="232" rx="18" fill="#111" stroke="{TINTA}" stroke-width="8"/>'
            f'<line x1="160" y1="16" x2="160" y2="224" stroke="#fff" stroke-width="4" stroke-dasharray="10 10"/>'
            f'<rect x="30" y="80" width="8" height="44" fill="#fff"><animate attributeName="y" values="70;120;70" dur="1.6s" repeatCount="indefinite"/></rect>'
            f'<rect x="282" y="110" width="8" height="44" fill="#fff"><animate attributeName="y" values="120;60;120" dur="1.6s" repeatCount="indefinite"/></rect>'
            f'<rect x="150" y="110" width="10" height="10" fill="#fff"><animate attributeName="x" values="40;272;40" dur="1.6s" repeatCount="indefinite"/><animate attributeName="y" values="96;130;96" dur="1.6s" repeatCount="indefinite"/></rect>'
            f'<text x="120" y="48" font-family="Bebas" font-size="34" fill="#fff" text-anchor="middle">{marcador[0]}</text><text x="200" y="48" font-family="Bebas" font-size="34" fill="#fff" text-anchor="middle">{marcador[1]}</text></svg>')

def cartucho(px=200, color="#2a2a2a", texto="JUEGO"):
    return (f'<svg width="{px}" height="{px*1.1:.0f}" viewBox="0 0 100 110"><path d="M10,6 L90,6 L90,96 L72,96 L72,106 L28,106 L28,96 L10,96Z" fill="{color}" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="18" y="16" width="64" height="56" fill="#e8e1cf"/><rect x="18" y="16" width="64" height="12" fill="{ROJO}"/>'
            f'<text x="50" y="56" font-family="Bebas" font-size="16" fill="{TINTA}" text-anchor="middle">{texto}</text>'
            + "".join(f'<rect x="{20 + i*8}" y="80" width="4" height="10" fill="#555"/>' for i in range(8)) + '</svg>')

def escenas():
    E = {}
    E["at_bar"] = f'''{F("dark")}{obj(pong(640), 34, 50, "zoom", "", .2)}{txt(kt("«EVITA FALLAR LA BOLA»", "xl hueso", .9), 78, 40, 38)}{txt(kt("una sola instrucción", "l naranja", 1.5), 78, 56, 38)}'''
    E["at_industria"] = titular("EMPIEZA LA INDUSTRIA *DEL VIDEOJUEGO*", "", "", ("1f579-fe0f", "1f3ae", "1f47e", "1f3c6"), "", True, "xl")
    E["at_go"] = icono_texto("26ab", "UN NOMBRE *DE JUEGO DE MESA*", "japonés y milenario", "", "izq", "", True, "pop", "bob", 380, (("26aa", 14, 80),))
    E["at_jobs"] = icono_texto("1f34e", "UN JOVEN *STEVE JOBS*", "pasó por sus oficinas", "antes de fundar Apple", "der", "", False, "pop", "bob")
    E["at_desierto"] = icono_texto("1f3dc-fe0f", "CARTUCHOS *ENTERRADOS*", "en un vertedero del desierto", "", "izq", "calido", True, "drop", "")
    E["at_historia"] = titular("LA HISTORIA DE *ATARI*", "", "", ("1f579-fe0f", "1f3d3", "1f47d", "1f3dc-fe0f"), "", True, "xl")
    E["at_bushnell"] = icono_texto("1f468-200d-1f4bc", "NOLAN *BUSHNELL*", "de estudiante, en los juegos de feria de un parque", "Utah", "izq", "", False, "up", "bob", 380, (("1f3a1", 86, 80),))
    E["at_pagar"] = impacto("una lección:", "LA GENTE PAGA *POR DIVERTIRSE*", "", "1fa99")
    E["at_ordenadores"] = icono_texto("1f5a5-fe0f", "ORDENADORES *ENORMES*", "y un juego de naves espaciales", "en la universidad", "der", "", False, "pop", "bob", 380, (("1f680", 14, 80),))
    E["at_monedas"] = flecha("1f680", "1fa99", "EL JUEGO, *EN UNA MÁQUINA DE MONEDAS*", "su idea para hacerse rico")
    E["at_dabney"] = comparar("1f468-200d-1f4bc", "Nolan Bushnell", "1f468-200d-1f527", "Ted Dabney", "+", "COMPUTER SPACE")
    E["at_mueble"] = icono_texto("1f6f8", "UN MUEBLE *FUTURISTA*", "con curvas, espectacular", "", "izq", "espacio", True, "pop", "float")
    E["at_complicada"] = lista([("1f4dc", "instrucciones largas"), ("1f579-fe0f", "controles confusos"), ("1f615", "nadie entendía")], "DEMASIADO COMPLICADA")
    E["at_algunas"] = icono_texto("1f4c9", "NO FUE *EL ÉXITO ESPERADO*", "se vendieron algunas unidades", "", "der", "", False, "pop", "")
    E["at_leccion"] = titular("FÁCIL DE APRENDER, *DIFÍCIL DE DOMINAR*", "la lección de Bushnell", "", ("1f4a1", "1f579-fe0f", "1f3af", "1f9e0"), "", True, "xl")
    E["at_fundar"] = impacto("1972:", "SU PROPIA *EMPRESA*", "", "1f3e2")
    E["at_syzygy"] = f'''{F()}{txt('<div class="mega" style="text-decoration:line-through;color:#8A8F98">SYZYGY</div>', 50, 40, 90, "center", .2, "pop")}{txt(kt("ya la usaba otra empresa", "l", .9), 50, 62, 80)}'''
    E["at_go2"] = icono_texto("26ab", "EL *GO*", "estratégico, de origen chino, muy popular en Japón", "Bushnell era aficionado", "izq", "sepia", False, "pop", "bob", 380, (("26aa", 86, 80),))
    E["at_palabras"] = f'''{F()}{"".join(txt(kt(w, "xl gris", .2 + i * .3), 20 + i * 20, 40, 18) for i, w in enumerate(["SENTE", "HANE", "GOTE"]))}{txt(kt("ATARI", "mega rojo", 1.3, .12, "slam"), 80, 40, 22)}{txt(kt("eligió una palabra del juego", "l", 1.8), 50, 66, 80)}'''
    E["at_jaque"] = comparar("26ab", "«atari»: a punto de ser capturada", "265f-fe0f", "algo así como un jaque", "≈")
    E["at_1972"] = fecha("27", "JUNIO", "1972", "Atari queda registrada en California", "1f4dc")
    E["at_alcorn"] = icono_texto("1f468-200d-1f527", "AL *ALCORN*", "un joven ingeniero", "", "der", "", False, "up", "bob")
    E["at_practica"] = icono_texto("1f3d3", "UN EJERCICIO *DE PRÁCTICAS*", "un tenis de mesa en una pantalla", "según contó Bushnell", "izq", "", False, "pop", "bob")
    E["at_palas"] = f'''{F("dark")}{obj(pong(700), 50, 46, "zoom", "", .2)}{txt(kt("DOS PALAS, UNA PELOTA, *UN MARCADOR*", "xl hueso", 1.0), 50, 88, 90)}'''
    E["at_angulo"] = icono_texto("1f4d0", "EL ÁNGULO *CAMBIA*", "según dónde golpee la pala", "detalles que lo hacían divertido", "der", "", False, "spin", "bob")
    E["at_pong"] = titular("*PONG*", "por el sonido de la pelota al rebotar", "", ("1f3d3", "1f50a", "1f579-fe0f", "2728"))
    E["at_andycapp"] = icono_texto("1f37a", "UN BAR: *ANDY CAPP'S*", "Sunnyvale, California", "la prueba", "izq", "sepia", False, "pop", "bob")
    E["at_llamada"] = icono_texto("260e-fe0f", "«LA MÁQUINA *SE HA ESTROPEADO*»", "llamó el dueño del bar", "", "der", "", False, "pop", "swing")
    E["at_repara"] = icono_texto("1f527", "ALCORN *LA ABRE*", "y descubre el problema", "", "izq", "", False, "pop", "bob")
    E["at_monedas2"] = f'''{F("calido", True)}{"".join(obj(spr("1fa99", 110), 20 + (i % 6) * 12, 30 + (i // 6) * 18, "drop", "", .1 + i * .06) for i in range(18))}{txt(kt("¡ATASCADA *DE MONEDAS*!", "mega", 1.4, .12, "slam"), 50, 86, 95)}'''
    E["at_miles"] = cifra("MILES", "DE MÁQUINAS DE PONG EN BARES DE TODO EL PAÍS", "1f3ed", "en poco tiempo")
    E["at_imitadores"] = f'''{F()}{"".join(obj(pong(220), 14 + i * 18, 46, "pop", "", .2 + i * .15) for i in range(5))}{txt(kt("DECENAS DE *IMITADORES*", "xl", 1.2), 50, 82, 90)}'''
    E["at_parecido"] = impacto("pero Pong se parecía mucho a", "OTRO JUEGO *DE TENIS*", "", "1f914")
    E["at_odyssey"] = icono_texto("1f4fa", "MAGNAVOX *ODYSSEY*", "considerada la primera consola doméstica", "1972", "izq", "", False, "pop", "bob")
    E["at_demo"] = icono_texto("1f440", "BUSHNELL *LA HABÍA PROBADO*", "en una demostración, según los documentos del caso", "", "der", "", False, "pop", "bob")
    E["at_licencia"] = cifra("700.000 $", "LICENCIA PARA CERRAR LA DEMANDA", "2696-fe0f")
    E["at_1974"] = icono_texto("1f9d1", "19 AÑOS, *PELO LARGO*", "sin estudios terminados, pidiendo trabajo", "1974", "izq", "", False, "pop", "bob")
    E["at_steve"] = bocadillos("1f9d1", ["No me voy…", "…hasta que me contratéis"], "Steve Jobs, según se cuenta")
    E["at_noche"] = icono_texto("1f319", "BRILLANTE PERO DIFÍCIL: *DE NOCHE*", "para que no chocara con sus compañeros", "según varias biografías", "der", "espacio", False, "pop", "float")
    E["at_breakout"] = f'''{F("dark")}{"".join(f'<div class="pos" style="left:{22 + (i % 8) * 8}%;top:{20 + (i // 8) * 6}%;width:140px;height:40px;background:{["#D7263D", "#FF8C1A", "#2BB673", "#2E6BD6"][i // 8]}"></div>' for i in range(32))}{obj(spr("1f9f1", 160), 50, 62, "pop", "bob", .6)}{txt(kt("BREAKOUT: *ROMPER LADRILLOS*", "xl hueso", .9), 50, 82, 90)}{txt(kt("con el menor número de chips posible", "l naranja", 1.5), 50, 92, 90)}'''
    E["at_woz"] = icono_texto("1f468-200d-1f4bb", "STEVE *WOZNIAK*", "lo diseña en cuatro noches sin dormir", "su amigo", "izq", "", False, "up", "bob")
    E["at_prima"] = comparar("1f4b5", "a Woz: la mitad de 700 $", "1f4b0", "a Jobs: una prima de miles", "VS", "SEGÚN CONTÓ WOZNIAK")
    E["at_salon"] = flecha("1f37a", "1f6cb-fe0f", "DEL BAR *AL SALÓN*", "")
    E["at_cartuchos"] = f'''{F()}{obj(spr("1f4fa", 230), 26, 50, "pop", "", .2)}{"".join(obj(cartucho(130, texto=t), 54 + i * 14, 50, "pop", "bob", .6 + i * .25) for i, t in enumerate(["TENIS", "NAVES", "COCHES"]))}{txt(kt("UNA CONSOLA *DE CARTUCHOS*", "xl", 1.2), 50, 84, 90)}'''
    E["at_warner"] = cifra("28 M$", "1976: VENDE ATARI A WARNER", "1f3ac", "aproximadamente")
    E["at_2600"] = cifra("1977", "LA CONSOLA QUE SERÍA LA «ATARI 2600»", "1f579-fe0f")
    E["at_invaders"] = icono_texto("1f47e", "1980: *SPACE INVADERS*, EN CASA", "y las ventas se disparan", "", "izq", "espacio", True, "pop", "float")
    E["at_crece"] = titular("UNA DE LAS QUE *MÁS RÁPIDO CRECÍAN*", "de Estados Unidos", "", ("1f4c8", "1f579-fe0f", "1f4b0", "1f680"), "", True, "xl")
    E["at_mal"] = impacto("pero dentro", "LAS COSAS *IBAN MAL*", "", "26a0-fe0f")
    E["at_sale"] = icono_texto("1f6aa", "1978: *BUSHNELL SE VA*", "después, pizzerías con juegos para niños", "", "der", "", False, "pop", "bob", 380, (("1f355", 14, 80),))
    E["at_programadores"] = lista([("1f6ab", "sin su nombre en los juegos"), ("1f4b8", "sin cobrar por sus éxitos"), ("1f6aa", "se marchan")], "LOS PROGRAMADORES")
    E["at_saturado"] = f'''{F()}{"".join(obj(cartucho(110, ["#2a2a2a", "#7a4b2a", "#2E6BD6"][i % 3], "JUEGO"), 10 + (i % 9) * 10, 34 + (i // 9) * 26, "drop", "", .1 + i * .05) for i in range(18))}{txt(kt("DEMASIADOS JUEGOS, *MUCHOS MALOS*", "xl", 1.3), 50, 88, 90)}'''
    E["at_sobra"] = icono_texto("1f4e6", "MÁS CARTUCHOS *DE LOS QUE PODÍA VENDER*", "", "", "izq", "", False, "drop", "")
    E["at_et"] = icono_texto("1f47d", "1982: *E.T.*", "un éxito mundial en el cine", "", "der", "espacio", True, "pop", "float")
    E["at_derechos"] = comparar("1f4b0", "una fortuna por los derechos", "1f384", "listo para Navidad", "+")
    E["at_semanas"] = comparar("1f4c5", "un juego normal: meses", "23f1-fe0f", "E.T.: unas 5 semanas", "VS", "SEGÚN SE CUENTA")
    E["at_agujeros"] = icono_texto("1f573-fe0f", "CAER *UNA Y OTRA VEZ*", "en agujeros", "un juego confuso", "izq", "", False, "drop", "swing")
    E["at_devueltos"] = lista([("1f3ed", "millones fabricados"), ("1f4e6", "sin vender"), ("1f504", "devueltos")], "")
    E["at_peor"] = titular("¿EL *PEOR VIDEOJUEGO* DE LA HISTORIA?", "aparece una y otra vez en esas listas", "", ("1f47d", "1f44e", "1f480", "1f5d1-fe0f"), "", True, "xl")
    E["at_crash"] = cifra("1983", "LA INDUSTRIA DEL VIDEOJUEGO SE HUNDE EN EE. UU.", "1f4c9")
    E["at_camiones"] = f'''{F("calido")}{obj(skyline(1800, "#c98a4a"), 50, 90, "none")}<div class="carrera" style="--d:.2s">{spr("1f69b", 260)}</div>{txt(kt("ALAMOGORDO, *NUEVO MÉXICO*", "xl", .6), 50, 20, 90)}{txt(kt("septiembre de 1983: más de una decena de camiones", "l", 1.2), 50, 34, 90)}'''
    E["at_cemento"] = lista([("1f528", "aplastados"), ("1faa8", "cubiertos de cemento")], "")
    E["at_leyenda"] = icono_texto("1f47b", "UNA *LEYENDA URBANA*", "¿millones de E.T. enterrados?", "durante 30 años", "der", "dark", False, "pop", "float")
    E["at_2014"] = f'''{F("calido", True)}{obj(spr("1f69c", 220), 22, 54, "left", "", .2)}{obj(cartucho(170, texto="E.T."), 48, 56, "drop", "bob", .8)}{txt(kt("2014: *LOS ENCUENTRAN*", "xl", 1.0), 76, 42, 44)}{txt(kt("unos 700.000 cartuchos, de muchos juegos", "l", 1.6), 76, 58, 44)}'''
    E["at_subasta"] = comparar("1f528", "subastados", "1f3db-fe0f", "y uno, en un museo", "+")
    E["at_hoy"] = icono_texto("1f579-fe0f", "ATARI *SIGUE EXISTIENDO*", "consolas modernas y clásicos para nostálgicos", "tras muchos dueños", "izq", "", True, "pop", "bob")
    E["leccion1"] = leccion(1, "lo sencillo", "*ENGANCHA*", "1f3d3")
    E["leccion2"] = leccion(2, "cuida a quien", "*CREA TUS PRODUCTOS*", "1f468-200d-1f4bb")
    E["leccion3"] = leccion(3, "las prisas", "*SE PAGAN*", "23f1-fe0f")
    E["at_final"] = lista([("26ab", "un juego de mesa"), ("1fa99", "una máquina atascada"), ("1f34e", "un joven Jobs"), ("1f4fa", "una consola"), ("1f3dc-fe0f", "un vertedero")], "")
    E["at_mando"] = f'''{F("", True)}{obj(spr("1f579-fe0f", 300), 30, 50, "drop", "float", .2)}{txt(kt("DONDE *EMPEZÓ TODO*", "xl", .9), 70, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:150px">{pong(460)}</div>
      <div style="position:absolute;left:340px;top:400px">{vicon("desert", 220)}</div>
      <div class="big" style="top:100px"><div class="s">ENTERRÓ SUS JUEGOS EN EL</div><div class="q" style="font-size:190px;margin-top:22px">DESIERTO</div><div class="y">LA HISTORIA DE ATARI</div></div>'''
