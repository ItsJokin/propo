"""Escenas del vídeo 23 (El Corte Inglés, formato largo). Motor común; sin logotipos (no se dibuja el triángulo): edificios y objetos genéricos."""
from base import *

CAP_ICONOS = {1: "1f1e8-1f1fa", 2: "2702-fe0f", 3: "1f46c", 4: "1f3ec", 5: "1f3e2", 6: "1f3c1", 7: "1f525", 8: "1f92b", 9: "1f4c9", 10: "1f9e0"}

def almacen(px=560, rotulo="GRANDES ALMACENES", color="#2d8a4e"):
    vent = "".join(f'<rect x="{40 + (i % 6) * 55}" y="{80 + (i // 6) * 45}" width="40" height="30" fill="#9fc3e6" stroke="{TINTA}" stroke-width="2"/>' for i in range(18))
    return (f'<svg width="{px}" height="{px*0.75:.0f}" viewBox="0 0 400 300"><rect x="20" y="40" width="360" height="250" fill="#e8e2d6" stroke="{TINTA}" stroke-width="5"/>'
            f'<rect x="20" y="40" width="360" height="26" fill="{color}"/><text x="200" y="60" font-family="Bebas" font-size="22" fill="#fff" text-anchor="middle">{rotulo}</text>{vent}'
            f'<rect x="160" y="225" width="80" height="65" fill="#8a5a3b" stroke="{TINTA}" stroke-width="3"/></svg>')

def sastreria(px=460):
    return (f'<svg width="{px}" height="{px*0.7:.0f}" viewBox="0 0 300 210"><rect x="20" y="50" width="260" height="150" fill="#d8c8a8" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="10" y="20" width="280" height="38" fill="#3b2a24" stroke="{TINTA}" stroke-width="4"/><text x="150" y="47" font-family="Bebas" font-size="24" fill="#f3d9a0" text-anchor="middle">SASTRERÍA</text>'
            f'<rect x="40" y="80" width="110" height="90" fill="#9fc3e6" stroke="{TINTA}" stroke-width="3"/><path d="M80,95 L110,95 L118,160 L72,160Z" fill="#2c3e50"/><rect x="190" y="80" width="60" height="120" fill="#8a5a3b" stroke="{TINTA}" stroke-width="3"/></svg>')

def escenas():
    E = {}
    E["ci_edificio"] = f'''{F("", True)}{obj(almacen(560), 32, 50, "rise", "", .2)}{txt(kt("UN EDIFICIO ENORME *EN CASI CADA CIUDAD*", "xl", .8), 74, 46, 46)}'''
    E["ci_generaciones"] = lista([("1f3f7-fe0f", "rebajas"), ("1f381", "Navidad"), ("1f392", "vuelta al cole"), ("1f338", "primavera")], "PARTE DE LA VIDA DE VARIAS GENERACIONES")
    E["ci_nombre"] = impacto("¿por qué unos grandes almacenes españoles se llaman", "«EL CORTE *INGLÉS*»?", "", "1f914")
    E["ci_habana"] = flecha("2702-fe0f", "1f1e8-1f1fa", "UNA SASTRERÍA DE MADRID… *Y LA HABANA*", "")
    E["ci_primos"] = comparar("1f468", "un primo", "1f468", "el otro primo", "VS", "UNA RIVALIDAD DE FAMILIA")
    E["ci_areces"] = icono_texto("1f466", "RAMÓN *ARECES*", "nace a principios del siglo XX en un pueblo de Asturias", "", "izq", "sepia", False, "up", "bob")
    E["ci_emigra"] = flecha("1f1ea-1f1f8", "1f1e8-1f1fa", "EMIGRA A CUBA *SIENDO ADOLESCENTE*", "como tantos jóvenes asturianos")
    E["ci_tio"] = icono_texto("1f468-200d-1f4bc", "SU TÍO, *CÉSAR RODRÍGUEZ*", "directivo de unos grandes almacenes de La Habana", "", "der", "sepia", False, "up", "bob")
    E["ci_encanto"] = f'''{F("calido", True)}{obj(almacen(520, "EL ENCANTO", "#8a5a3b"), 32, 52, "zoom", "", .2)}{txt(kt("*EL ENCANTO*", "mega", .7, .12, "slam"), 74, 40, 44)}{txt(kt("de los más importantes de la isla", "l", 1.4), 74, 58, 44)}'''
    E["ci_aprende"] = lista([("1f4e6", "organizar"), ("1f91d", "tratar al cliente"), ("1f4b0", "comprar y vender")], "APRENDE DESDE ABAJO")
    E["ci_pepin"] = icono_texto("1f468", "JOSÉ FERNÁNDEZ, *«PEPÍN»*", "otro joven asturiano emparentado con su familia", "allí trabajaba también", "izq", "", True, "up", "bob")
    E["ci_misma_idea"] = comparar("1f468", "Areces", "1f468", "Pepín", "=", "EL MISMO OFICIO, LA MISMA IDEA")
    E["ci_vuelve"] = flecha("1f1e8-1f1fa", "1f1ea-1f1f8", "MEDIADOS DE LOS TREINTA: *VUELVE A ESPAÑA*", "")
    E["ci_sol"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("MADRID", "mega", .3, .1, "slam"), 50, 32, 95)}{txt(kt("muy cerca de la Puerta del Sol", "l", 1.1), 50, 50, 80)}'''
    E["ci_preciados"] = icono_texto("1f6e3-fe0f", "SALIDA A *VARIAS CALLES*", "entre ellas, la calle Preciados: una ubicación perfecta", "", "izq", "", True, "pop", "bob")
    E["ci_corte"] = f'''{F("", True)}{obj(sastreria(460), 30, 50, "zoom", "", .2)}{txt(kt("ROPA DE CABALLERO *AL ESTILO INGLÉS*", "xl", .8), 74, 42, 46)}{txt(kt("sinónimo de elegancia entonces", "l", 1.4), 74, 58, 46)}{obj(spr("1f1ec-1f1e7", 130), 74, 76, "pop", "", 1.8)}'''
    E["ci_1935"] = anio(1900, 1935, "la sastrería pasa a la familia, con el apoyo del tío César", "2702-fe0f")
    E["ci_menos"] = impacto("Areces lo cambió casi todo", "MENOS *EL NOMBRE*", "", "1f3f7-fe0f")
    E["ci_siglo"] = flecha("2702-fe0f", "1f3ec", "UNA SASTRERÍA *→ LOS GRANDES ALMACENES MÁS FAMOSOS*", "casi un siglo después")
    E["ci_enredada"] = impacto("una historia de familia", "BASTANTE *ENREDADA*", "", "1f9f6")
    E["ci_pepin_vuelve"] = icono_texto("1f468", "PEPÍN *TAMBIÉN VUELVE*", "con la misma idea: grandes almacenes como los de La Habana", "", "der", "", True, "left", "bob")
    E["ci_colaboran"] = comparar("1f91d", "al principio, colaboran", "1f500", "después, caminos separados", "→")
    E["ci_galerias"] = f'''{F("", True)}{obj(almacen(520, "GALERÍAS", "#b3122a"), 32, 52, "zoom", "", .2)}{txt(kt("*GALERÍAS PRECIADOS*", "xl", .7), 74, 44, 44)}{txt(kt("la cadena de Pepín", "l", 1.3), 74, 60, 44)}'''
    E["ci_puerta"] = f'''{F()}{obj(almacen(360), 28, 52, "left", "", .2)}{txt('<div class="vs" style="--d:.8s">↔</div>', 50, 52, 10)}{obj(almacen(360, "GALERÍAS", "#b3122a"), 72, 52, "right", "", .5)}{txt(kt("PRÁCTICAMENTE *PUERTA CON PUERTA*", "xl", 1.3), 50, 14, 90)}'''
    E["ci_parientes"] = icono_texto("1f94a", "PARIENTES, *CALLE CON CALLE*", "formados en el mismo almacén de La Habana", "", "izq", "", True, "pop", "shake")
    E["ci_equipo"] = comparar("26bd", "se era de uno…", "26bd", "…o del otro", "VS", "COMO UN EQUIPO DE FÚTBOL")
    E["ci_1940"] = fecha("", "JULIO", "1940", "sus primeros grandes almacenes en Madrid", "1f3ec")
    E["ci_posguerra"] = icono_texto("1f3da-fe0f", "UNA IDEA *ARRIESGADA*", "en plena posguerra, con un país empobrecido", "", "izq", "sepia", False, "drop", "")
    E["ci_cuba"] = lista([("1f3f7-fe0f", "precios fijos, a la vista"), ("1f91d", "buena atención"), ("1f4e6", "mucho surtido")], "LO APRENDIDO EN CUBA")
    E["ci_devolucion"] = f'''{F("calido", True)}{obj(spr("1f4b6", 240), 26, 46, "pop", "float", .2)}{txt(kt("¿NO QUEDA SATISFECHO?", "xl", .6), 66, 38, 56)}{txt(kt("*LE DEVOLVEMOS SU DINERO*", "xl", 1.2), 66, 56, 56)}'''
    E["ci_normal"] = comparar("1f937", "hoy parece normal", "1f62e", "entonces era poco habitual", "≠")
    E["ci_confianza"] = flecha("1f91d", "1f465", "CONFIANZA → *CLIENTES*", "")
    E["ci_plan"] = lista([("1fa9f", "mirar escaparates"), ("1f6d7", "escaleras mecánicas"), ("2615", "merendar")], "UN PLAN EN SÍ MISMO")
    E["ci_ciudades"] = f'''{F()}{obj(spr("1f5fa-fe0f", 300), 30, 48, "zoom", "", .2)}{"".join(obj(spr("1f3ec", 90), x, y, "pop", "", .6 + i * .15) for i, (x, y) in enumerate([(30, 36), (40, 50), (22, 58), (34, 64), (20, 40)]))}
      {txt(kt("BARCELONA, SEVILLA, BILBAO, *VALENCIA…*", "xl", 1.3), 72, 48, 50)}'''
    E["ci_todo"] = titular("TODO *BAJO EL MISMO TECHO*", "sin salir del edificio", "", ("1f3ec", "1f6cd-fe0f", "1f381", "2728"), "", True, "xl")
    E["ci_lista"] = f'''{F()}{"".join(obj(spr(c, 150), 10 + i * 13.3, 46, "drop", "bob", .1 + i * .15) for i, c in enumerate(["1f454", "1f484", "1f9f8", "1f4fa", "1f4da", "1f96b", "1f45f"]))}{txt(kt("ROPA, PERFUMES, JUGUETES, ELECTRODOMÉSTICOS…", "xl", 1.2), 50, 78, 90)}'''
    E["ci_nosequeda"] = impacto("y la empresa", "NO SE QUEDÓ *AHÍ*", "", "1f680")
    E["ci_hipercor"] = lista([("2708-fe0f", "viajes"), ("1f6e1-fe0f", "seguros"), ("1f4bb", "informática"), ("1f6d2", "Hipercor (1979)")], "NUEVOS NEGOCIOS")
    E["ci_fabrica"] = icono_texto("1f3ed", "FABRICABA *PARTE DE LO QUE VENDÍA*", "a través de empresas propias", "", "izq", "", False, "pop", "")
    E["ci_universo"] = lista([("1f454", "vestirte"), ("1f37d-fe0f", "comer"), ("2708-fe0f", "viajar"), ("1f6cb-fe0f", "amueblar")], "UN PEQUEÑO UNIVERSO")
    E["ci_calendario"] = f'''{F("calido", True)}{"".join(txt(f'<div class="calendario" style="--d:{.1 + i*.25:.2f}s"><div class="cal-mes">{m}</div><div class="cal-dia" style="font-size:80px">{d}</div></div>', 14 + i * 24, 42, 20) for i, (m, d) in enumerate([("ENE", "%"), ("MAR", "🌸"), ("SEP", "✏"), ("DIC", "🎁")]))}
      {txt(kt("EL CALENDARIO *DE LOS ESPAÑOLES*", "xl", 1.3), 50, 80, 90)}'''
    E["ci_peor"] = impacto("mientras tanto, a Galerías", "LE IBA *PEOR*", "", "1f4c9")
    E["ci_ochenta"] = icono_texto("1f504", "VARIOS DUEÑOS *Y PÉRDIDAS*", "en los años ochenta", "", "izq", "", False, "spin", "")
    E["ci_apaga"] = lista([("1f504", "cambios de dueños"), ("1f9fe", "deudas"), ("1f9ed", "falta de rumbo")], "EL GRAN RIVAL SE APAGA")
    E["ci_1995"] = anio(1900, 1995, "lo que pocos habrían imaginado", "1f62e")
    E["ci_compra"] = flecha("1f3ec", "1f3ec", "EL CORTE INGLÉS *COMPRA GALERÍAS PRECIADOS*", "")
    E["ci_triangulo"] = f'''{F()}{obj(almacen(420, "GALERÍAS", "#b3122a"), 30, 52, "none", "fuera", .4)}{obj(almacen(420), 70, 52, "pop", "", 1.0)}{txt(kt("LOS CENTROS DEL RIVAL *CAMBIAN DE NOMBRE*", "xl", 1.4), 50, 14, 90)}'''
    E["ci_gana"] = titular("GANÓ *LA SASTRERÍA*", "la guerra de los primos había terminado", "", ("2702-fe0f", "1f3c6", "1f3ec", "2728"))
    E["ci_encanto_final"] = impacto("¿y qué fue de", "*EL ENCANTO*?", "", "1f1e8-1f1fa")
    E["ci_revolucion"] = icono_texto("1f1e8-1f1fa", "*NACIONALIZADO*", "tras la revolución cubana de 1959", "", "izq", "sepia", False, "pop", "")
    E["ci_incendio"] = f'''{F("dark", True)}{obj(almacen(420, "EL ENCANTO", "#8a5a3b"), 34, 52, "pop", "", .2)}{"".join(obj(spr("1f525", 150), 24 + i * 10, 34, "pop", "pulse", .6 + i * .2) for i in range(3))}
      {txt(kt("ABRIL DE 1961: *UN INCENDIO PROVOCADO*", "xl hueso", 1.2), 74, 46, 46)}'''
    E["ci_feval"] = icono_texto("1f56f-fe0f", "FE *DEL VALLE*", "una trabajadora que murió en el fuego; se la recuerda en Cuba", "", "der", "dark", False, "pop", "glow")
    E["ci_parque"] = icono_texto("1f333", "HOY, *UN PEQUEÑO PARQUE*", "nunca se reconstruyó", "", "izq", "", True, "rise", "bob")
    E["ci_noche"] = impacto("el lugar donde aprendieron el oficio", "DESAPARECIÓ *EN UNA NOCHE*", "", "1f319")
    E["ci_atlantico"] = flecha("1f1e8-1f1fa", "1f1ea-1f1f8", "SU FORMA DE COMERCIAR *SIGUIÓ VIVA*", "al otro lado del Atlántico")
    E["ci_muere"] = icono_texto("1f56f-fe0f", "ARECES MUERE *EN 1989*", "no tenía hijos", "", "izq", "dark", False, "pop", "glow")
    E["ci_isidoro"] = icono_texto("1f468-200d-1f4bc", "ISIDORO *ÁLVAREZ*", "su sobrino: 25 años al frente", "le sucede", "der", "", True, "up", "bob")
    E["ci_discreta"] = lista([("1f6ab", "no cotiza en bolsa"), ("1f92b", "pocas entrevistas"), ("1f3e0", "cultura propia")], "MUY DISCRETA")
    E["ci_carrera"] = flecha("1f9d1", "1f468-200d-1f4bc", "TODA LA CARRERA *DENTRO DE LA CASA*", "empezando desde abajo, como Areces")
    E["ci_fundacion"] = icono_texto("1f393", "UNA FUNDACIÓN *CON SU NOMBRE*", "parte de la propiedad; financia investigación y becas", "", "izq", "", True, "pop", "bob")
    E["ci_dificiles"] = impacto("los grandes almacenes de todo el mundo", "DÉCADAS *COMPLICADAS*", "", "1f4c9")
    E["ci_centros"] = comparar("1f3ec", "grandes almacenes", "1f6cd-fe0f", "centros comerciales y cadenas especializadas", "VS")
    E["ci_internet"] = comparar("1f4c9", "la crisis de 2008", "1f4bb", "las compras por internet", "+")
    E["ci_sucesion"] = icono_texto("1f4f0", "TENSIONES *EN LA SUCESIÓN*", "tras la muerte de Isidoro Álvarez en 2014", "", "der", "", False, "drop", "swing")
    E["ci_jeque"] = cifra("≈10 %", "PARA UN JEQUE CATARÍ (2015)", "1f1f6-1f1e6")
    E["ci_pandemia"] = icono_texto("1f637", "LA *PANDEMIA*", "tiendas cerradas durante semanas: un golpe durísimo", "2020", "izq", "dark", True, "pop", "")
    E["ci_online"] = lista([("1f3e2", "vender inmuebles"), ("1f9fe", "reducir deudas"), ("1f4bb", "venta online")], "DESDE ENTONCES")
    E["ci_marta"] = icono_texto("1f469-200d-1f4bc", "MARTA *ÁLVAREZ*", "hija de Isidoro, presidenta desde 2018", "", "der", "", True, "up", "bob")
    E["ci_reto"] = comparar("1f4f1", "una generación que compra con el móvil", "1f3ec", "¿merece la pena ir a unos grandes almacenes?", "?", "EL RETO")
    E["leccion1"] = leccion(1, "lo que aprendes en un sitio", "PUEDE SER LA BASE *DE TODA UNA VIDA*", "1f4da")
    E["leccion2"] = leccion(2, "devolver el dinero puede ser", "TU *MEJOR ANUNCIO*", "1f91d")
    E["leccion3"] = leccion(3, "no basta con ganar a tu rival", "EL RETO DE HOY *ES OTRO*", "1f4bb")
    E["ci_final"] = lista([("1f1e8-1f1fa", "La Habana"), ("2702-fe0f", "una sastrería"), ("1f468", "un primo rival"), ("1f3ec", "grandes almacenes")], "")
    E["ci_pasas"] = f'''{F("calido", True)}{obj(almacen(460), 30, 52, "rise", "", .2)}{txt(kt("YA SABES *POR QUÉ SE LLAMA ASÍ*", "xl", .9), 74, 46, 46)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:150px">{sastreria(420)}</div>
      <div style="position:absolute;left:150px;top:460px">{vicon("scissors", 150)}</div>
      <div class="big" style="top:100px"><div class="s">EL CORTE INGLÉS</div><div class="q" style="font-size:150px;margin-top:22px">ERA UNA</div><div class="q" style="font-size:150px">SASTRERÍA</div><div class="y">Y SE TRAGÓ A SU RIVAL</div></div>'''
