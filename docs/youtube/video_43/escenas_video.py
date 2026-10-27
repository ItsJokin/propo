"""Escenas del vídeo 43 (inventos por accidente, formato largo). Motor común; sin logotipos: notas, botes, muelles y sartenes genéricos."""
from base import *

CAP_ICONOS = {1: "1f9ea", 2: "1f3b6", 3: "1f4dd", 4: "1f9fd", 5: "1f469-200d-1f3eb", 6: "1f36b", 7: "27b0", 8: "1f4a8",
              9: "1f373", 10: "1f4a7", 11: "1f9e0"}

def nota(px=220, color="#ffe866", texto="", rot=-4):
    t = f'<text x="100" y="110" font-family="Bebas" font-size="30" fill="{TINTA}" text-anchor="middle">{texto}</text>' if texto else ""
    return (f'<svg width="{px}" height="{px}" viewBox="0 0 200 200" style="transform:rotate({rot}deg)"><rect x="10" y="10" width="180" height="180" fill="{color}" stroke="#d6b83a" stroke-width="2"/>'
            f'<rect x="10" y="10" width="180" height="30" fill="#000" opacity=".06"/><path d="M150,190 L190,150 L190,190Z" fill="#e8cf44"/>{t}</svg>')

def bote(px=180, color=ROJO, masa="#5aa9e6"):
    return (f'<svg width="{px}" height="{px*1.2:.0f}" viewBox="0 0 100 120"><ellipse cx="50" cy="18" rx="40" ry="10" fill="{masa}" stroke="{TINTA}" stroke-width="3"/>'
            f'<path d="M10,18 L14,110 Q50,122 86,110 L90,18" fill="#f4f4f4" stroke="{TINTA}" stroke-width="3"/><rect x="12" y="48" width="76" height="34" fill="{color}"/>'
            f'<text x="50" y="72" font-family="Bebas" font-size="16" fill="#fff" text-anchor="middle">MASA</text></svg>')

def muelle(px=260):
    espiras = "".join(f'<ellipse cx="100" cy="{30 + i*12}" rx="70" ry="16" fill="none" stroke="#9aa3ad" stroke-width="7"/>' for i in range(12))
    return f'<svg width="{px}" height="{px:.0f}" viewBox="0 0 200 200">{espiras}</svg>'

def sarten(px=340):
    return (f'<svg width="{px}" height="{px*0.5:.0f}" viewBox="0 0 240 120"><rect x="150" y="50" width="90" height="16" rx="8" fill="#3a2a1e"/>'
            f'<ellipse cx="80" cy="60" rx="76" ry="40" fill="#2b2b2b" stroke="{TINTA}" stroke-width="4"/><ellipse cx="80" cy="56" rx="62" ry="30" fill="#444"/>'
            f'<ellipse cx="74" cy="54" rx="20" ry="13" fill="#fff"/><circle cx="76" cy="54" r="7" fill="#f6b500"/></svg>')

def escenas():
    E = {}
    E["ac_errores"] = lista([("1f9f4", "un pegamento que no pega"), ("1f9fd", "un limpiador sin clientes"), ("1f36b", "una chocolatina derretida")], "")
    E["ac_casa"] = titular("NACIERON *DE UN ERROR*", "no de un plan brillante", "muchos productos de tu casa…", ("1f4a5", "1f3e0", "1f4a1", "2753"), "", True, "xl")
    E["ac_experimento"] = lista([("1f9ea", "un experimento fallido"), ("27b0", "un muelle que se cae"), ("1f4a8", "una bombona «vacía»")], "")
    E["ac_pregunta"] = impacto("en vez de tirarlo, alguien se preguntó:", "¿Y ESTO *PARA QUÉ SIRVE*?", "", "1f914")
    E["ac_seis"] = titular("*6 INVENTOS* POR ACCIDENTE", "y las marcas que salieron de ellos", "", ("1f4dd", "1f36b", "27b0", "1f373"))
    E["ac_3m"] = cifra("1968", "LABORATORIOS DE 3M, MINNESOTA", "1f9ea")
    E["ac_silver"] = icono_texto("1f468-200d-1f52c", "SPENCER *SILVER*", "buscaba un adhesivo muy fuerte para aviones", "químico", "izq", "", False, "up", "bob", 380, (("2708-fe0f", 86, 80),))
    E["ac_debil"] = lista([("1f4a7", "pegaba"), ("1f44b", "se despegaba"), ("1f504", "se volvía a pegar")], "LE SALIÓ LO CONTRARIO")
    E["ac_fracaso"] = impacto("para un pegamento…", "UN *FRACASO*", "", "1f4c9")
    E["ac_charlas"] = icono_texto("1f5e3-fe0f", "AÑOS *PRESENTÁNDOLO*", "en charlas internas, según se cuenta", "", "der", "", False, "pop", "bob")
    E["ac_nadie"] = icono_texto("1f937", "¿PARA QUÉ *SERVÍA*?", "nadie lo sabía", "", "izq", "", False, "pop", "swing")
    E["ac_fry"] = icono_texto("1f468-200d-1f4bc", "ART *FRY*", "otro empleado de 3M", "la respuesta", "der", "", False, "up", "bob")
    E["ac_coro"] = icono_texto("1f3b6", "LOS PAPELITOS *SE CAÍAN*", "en el libro de himnos del coro", "", "izq", "calido", False, "pop", "swing", 380, (("1f4d6", 86, 80),))
    E["ac_domingo"] = icono_texto("1f4a1", "SE ACORDÓ *DEL PEGAMENTO*", "un domingo, según contó él mismo", "", "der", "", True, "pop", "glow")
    E["ac_marcapaginas"] = f'''{F()}{obj(spr("1f4d6", 280), 34, 52, "pop", "", .2)}{obj(nota(110, rot=8), 44, 30, "drop", "", .8)}{txt(kt("SE QUEDA… *Y SE QUITA*", "xl", 1.1), 72, 46, 46)}{txt(kt("sin romper las hojas", "l", 1.6), 72, 62, 46)}'''
    E["ac_notas"] = f'''{F("", True)}{"".join(obj(nota(170, c, t, r), x, y, "drop", "", .2 + i * .3) for i, (c, t, r, x, y) in enumerate([("#ffe866", "LLAMAR", -6, 22, 40), ("#ff9ec4", "COMPRAR PAN", 5, 50, 52), ("#9fe0ff", "¡OJO!", -3, 78, 40)]))}{txt(kt("NOTAS *EN CUALQUIER SITIO*", "xl", 1.3), 50, 86, 90)}'''
    E["ac_pressnpeel"] = icono_texto("1f615", "«PRESS 'N PEEL»", "presiona y despega: un nombre poco afortunado", "1977", "izq", "", False, "pop", "swing")
    E["ac_fracaso2"] = impacto("", "OTRO *FRACASO*", "nadie entendía qué era", "1f4c9")
    E["ac_muestras"] = icono_texto("1f381", "REGALAR *MUESTRAS*", "los inventores no se rinden", "", "der", "", True, "pop", "bob")
    E["ac_boise"] = icono_texto("1f3e2", "BOISE, IDAHO: *BLOCS GRATIS*", "en las oficinas de toda la ciudad", "", "izq", "", False, "pop", "bob")
    E["ac_enganchan"] = icono_texto("1f60d", "UNA VEZ PROBADOS, *NO LOS DEJABAN*", "casi todos dijeron que los comprarían", "", "der", "calido", True, "pop", "bob")
    E["ac_postit"] = f'''{F("", True)}{obj(nota(300, texto="POST-IT", rot=-5), 30, 50, "zoom", "float", .2)}{txt(kt("1980: *A LA VENTA*", "xl", .8), 70, 44, 52)}{txt(kt("en todo Estados Unidos", "l", 1.4), 70, 62, 52)}'''
    E["ac_amarillo"] = icono_texto("1f7e8", "EL AMARILLO: *CASI CASUAL*", "el papel que había en el laboratorio de al lado", "según la propia marca", "izq", "", False, "pop", "bob")
    E["ac_cincinnati"] = cifra("AÑOS 30", "CINCINNATI, ESTADOS UNIDOS", "1f3ed", "segundo invento")
    E["ac_masa"] = icono_texto("1f9fd", "UNA MASA *PARA LIMPIAR PAREDES*", "el papel pintado", "", "der", "sepia", False, "pop", "bob")
    E["ac_hollin"] = comparar("1faa8", "calefacción de carbón: hollín", "1f9fd", "la masa absorbía la suciedad", "→")
    E["ac_lavable"] = lista([("1f525", "otras calefacciones"), ("1f9fc", "papel pintado lavable")], "DESPUÉS DE LA GUERRA")
    E["ac_apuros"] = icono_texto("1f4c9", "LAS VENTAS *SE HUNDEN*", "la empresa, en apuros", "", "izq", "dark", False, "drop", "")
    E["ac_zufall"] = icono_texto("1f469-200d-1f3eb", "KAY *ZUFALL*", "maestra de infantil, cuñada de Joe McVicker", "la solución", "der", "", False, "up", "bob")
    E["ac_clase"] = f'''{F("calido", True)}{"".join(obj(spr(c, 130), 14 + i * 13, 56, "pop", "bob", .2 + i * .15) for i, c in enumerate(["1f467", "1f466", "1f9d2", "1f467", "1f466"]))}{txt(kt("LA PRUEBA EN CLASE: *LES ENCANTA*", "xl", 1.0), 50, 24, 90)}{txt(kt("según los museos del juguete", "l", 1.6), 50, 84, 90)}'''
    E["ac_blanda"] = lista([("2601-fe0f", "blanda"), ("1f9fc", "no mancha"), ("2705", "no tóxica")], "PERFECTA PARA NIÑOS")
    E["ac_playdoh"] = f'''{F("", True)}{obj(bote(160, ROJO, "#f2c94c"), 18, 52, "drop", "", .2)}{obj(bote(160, AZUL, "#5aa9e6"), 34, 52, "drop", "", .4)}{obj(bote(160, VERDE, "#e05a8a"), 50, 52, "drop", "", .6)}{txt(kt("*PLAY-DOH*", "mega", .9, .12, "slam"), 78, 42, 40)}{txt(kt("masa para jugar", "l", 1.4), 78, 60, 40)}'''
    E["ac_1956"] = cifra("1956", "DE LIMPIADOR A JUGUETE · MILES DE MILLONES DE BOTES", "1f9f8")
    E["ac_1945"] = cifra("1945", "TERCER INVENTO", "1f4e1")
    E["ac_spencer"] = icono_texto("1f468-200d-1f527", "PERCY *SPENCER*", "ingeniero de Raytheon: radares para el ejército", "", "izq", "", False, "up", "bob", 380, (("1f4e1", 86, 80),))
    E["ac_magnetron"] = icono_texto("26a1", "CERCA DE UN *MAGNETRÓN*", "el aparato que genera las microondas", "según la historia más repetida", "der", "dark", True, "pop", "glow")
    E["ac_chocolatina"] = f'''{F("calido", True)}{obj(f'<div style="transform:scaleY(.6) skewX(-12deg);filter:saturate(1.3)">{spr("1f36b", 280)}</div>', 30, 56, "pop", "", .2)}{txt(kt("LA CHOCOLATINA, *DERRETIDA*", "xl", .8), 70, 44, 52)}{txt(kt("en el bolsillo", "l", 1.4), 70, 60, 52)}'''
    E["ac_palomitas"] = f'''{F("", True)}{"".join(obj(spr("1f37f", 120), 20 + (i % 6) * 12, 30 + (i // 6) * 30, "drop", "bob", .1 + i * .12) for i in range(12))}{txt(kt("¡PALOMITAS!", "mega", 1.4, .12, "slam"), 50, 86, 90)}'''
    E["ac_radarange"] = f'''{F()}<div class="pos" style="left:30%;top:50%;width:300px;height:600px;background:#b8bec6;border:8px solid {TINTA};border-radius:12px"></div><div class="pos" style="left:30%;top:40%;width:200px;height:150px;background:#333;border:6px solid {TINTA}"></div>{obj(spr("1f9cd", 200), 48, 64, "pop", "", .6)}{txt(kt("RADARANGE", "mega", .8, .12, "slam"), 74, 36, 46)}{txt(kt("casi 2 metros y más de 300 kilos", "l", 1.4), 74, 54, 46)}'''
    E["ac_casa2"] = comparar("1f3ed", "1947: un gigante", "1f3e0", "20 años después: en casa", "→")
    E["ac_astillero"] = cifra("1943", "CUARTO INVENTO · UN ASTILLERO DE FILADELFIA", "1f6a2")
    E["ac_james"] = icono_texto("1f468-200d-1f527", "RICHARD *JAMES*", "muelles para instrumentos de barcos", "ingeniero naval", "izq", "", False, "up", "bob")
    E["ac_cae"] = f'''{F("", True)}<div class="pos" style="left:28%;top:36%;width:420px;height:24px;background:#8a5a3b"></div>{obj(muelle(200), 52, 66, "drop", "swing", .4)}{txt(kt("SE CAE… *Y BAJA DANDO PASITOS*", "xl", 1.0), 70, 24, 54)}'''
    E["ac_slinky"] = icono_texto("1f4d6", "*SLINKY*", "sinuoso y elegante: lo encontró Betty en el diccionario", "el nombre", "der", "calido", True, "pop", "bob")
    E["ac_gimbels"] = cifra("400", "EN 90 MINUTOS, SEGÚN LA HISTORIA DE LA MARCA", "1f6cd-fe0f", "noviembre de 1945, Filadelfia")
    E["ac_escaleras"] = f'''{F()}{"".join(f'<div class="pos" style="left:{30 + i*12}%;top:{40 + i*12}%;width:240px;height:20px;background:#8a5a3b"></div>' for i in range(4))}{obj(muelle(140), 34, 30, "drop", "swing", .3)}{txt(kt("CIENTOS *DE MILLONES*", "xl", 1.0), 74, 22, 46)}'''
    E["ac_1938"] = fecha("6", "ABRIL", "1938", "quinto invento: laboratorios de DuPont", "1f9ea")
    E["ac_plunkett"] = icono_texto("1f468-200d-1f52c", "ROY *PLUNKETT*", "gases para refrigeración", "químico", "izq", "", False, "up", "bob", 380, (("2744-fe0f", 86, 80),))
    E["ac_vacia"] = comparar("1f4a8", "no sale nada", "2696-fe0f", "pero pesa lo mismo", "+", "UNA BOMBONA «VACÍA»")
    E["ac_polvo"] = icono_texto("2601-fe0f", "UN POLVO *BLANCO Y CEROSO*", "dentro de la bombona", "", "der", "", False, "pop", "float")
    E["ac_resbaladizo"] = lista([("1f6dd", "muy resbaladizo"), ("1f6ab", "casi nada se pega"), ("1f525", "aguanta el calor")], "UN MATERIAL NUEVO")
    E["ac_teflon"] = titular("*TEFLÓN*", "así lo bautizó DuPont", "", ("1f9ea", "1f525", "2728", "1f6dd"))
    E["ac_industria"] = comparar("1f3ed", "industria", "1fa96", "ejército", "+", "AL PRINCIPIO, NADA DE COCINAS")
    E["ac_gregoire"] = icono_texto("1f3a3", "TEFLÓN *EN LAS CAÑAS DE PESCAR*", "para que el sedal se deslizara", "Marc Grégoire, Francia", "izq", "", False, "pop", "bob")
    E["ac_colette"] = bocadillos("1f469", ["¿Y si lo pones…", "…en mis sartenes?"], "Colette, según la historia de la marca")
    E["ac_aluminio"] = f'''{F("calido", True)}{obj(sarten(400), 32, 52, "pop", "", .2)}{txt(kt("1956: *NADA SE PEGA*", "xl", .8), 72, 42, 48)}{txt(kt("teflón fijado al aluminio", "l", 1.4), 72, 58, 48)}'''
    E["ac_tefal"] = comparar("1f9ea", "TEFlón", "1f373", "ALuminio", "+", "EL NOMBRE: TEFAL")
    E["ac_1942"] = cifra("1942", "SEXTO Y ÚLTIMO INVENTO", "1f4a7")
    E["ac_coover"] = icono_texto("1f468-200d-1f52c", "HARRY *COOVER*", "plástico transparente para miras de armas", "Eastman Kodak", "izq", "", False, "up", "bob")
    E["ac_todo"] = icono_texto("1f6ab", "SE PEGABA *A TODO*", "así que lo descartó", "el cianoacrilato", "der", "", False, "pop", "swing")
    E["ac_vidrio"] = icono_texto("1f52c", "DOS PIEZAS DE VIDRIO *CARÍSIMAS*", "y ya no hubo forma de separarlas", "años después", "izq", "", False, "pop", "bob")
    E["ac_solucion"] = comparar("1f6ab", "el problema", "2705", "la solución", "=")
    E["ac_heridas"] = icono_texto("1fa79", "PARA CERRAR *HERIDAS*", "en Vietnam, según varias fuentes", "", "der", "dark", False, "pop", "")
    E["ac_superglue"] = cifra("1958", "EL PRIMER PEGAMENTO INSTANTÁNEO A LA VENTA", "1f4a7")
    E["leccion1"] = leccion(1, "un fracaso puede ser un éxito", "*EN EL LUGAR EQUIVOCADO*", "1f4dd")
    E["leccion2"] = leccion(2, "la curiosidad", "*VALE MÁS QUE LA SUERTE*", "1f9d0")
    E["leccion3"] = leccion(3, "la mejor idea la puede tener", "*ALGUIEN DE FUERA*", "1f442")
    E["ac_final"] = lista([("1f4dd", "Post-it"), ("1f9fd", "Play-Doh"), ("1f36b", "microondas"), ("27b0", "Slinky"), ("1f373", "teflón"), ("1f4a7", "pegamento")], "")
    E["ac_tirar"] = f'''{F("calido", True)}{obj(spr("1f5d1-fe0f", 260), 28, 52, "pop", "", .2)}{obj(spr("1f6ab", 140), 36, 32, "pop", "bob", .8)}{txt(kt("PIÉNSALO DOS VECES *ANTES DE TIRARLO*", "xl", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:110px">{nota(260, texto="¡UPS!", rot=-8)}</div>
      <div style="position:absolute;left:290px;top:330px">{vicon("chocolate-bar", 200)}</div>
      <div style="position:absolute;left:80px;top:430px">{vicon("popcorn", 170)}</div>
      <div class="big" style="top:100px"><div class="s">INVENTOS QUE NACIERON</div><div class="q" style="font-size:180px;margin-top:22px">POR ERROR</div><div class="y">Y HOY TIENES EN CASA</div></div>'''
