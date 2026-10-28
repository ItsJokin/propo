"""Escenas del vídeo 47 (especial Navidad: Rodolfo, el reno de la nariz roja). Motor común; sin logotipos ni personajes con derechos: renos genéricos."""
from base import *

CAP_ICONOS = {1: "1f3ec", 2: "270d-fe0f", 3: "1f98c", 4: "1f4d6", 5: "1f91d", 6: "1f3b5", 7: "1f4fa", 8: "1f522", 9: "1f4b0", 10: "1f9e0"}

def nariz(px=60, d=.6):
    return f'<div class="pos" style="width:{px}px;height:{px}px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff8a8a,#D7263D 60%,#8e0f1f);box-shadow:0 0 {px}px {px//2}px rgba(255,60,60,.55);animation:ePop .4s ease {d}s both"></div>'

def escenas():
    E = {}
    E["ro_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f98c", "2744-fe0f", "1f381"), "navidad", True, "mega")
    E["ro_renos"] = f'''{F("navidad", True)}{"".join(obj(spr("1f98c", 110), 10 + i * 10, 62 + (i % 2) * 4, "left", "bob", .1 + i * .12) for i in range(8))}{txt(kt("Y EL MÁS FAMOSO: *LA NARIZ ROJA*", "xl hueso", 1.2), 50, 24, 90)}'''
    E["ro_leyenda"] = icono_texto("1f4dc", "¿UNA LEYENDA *ANTIQUÍSIMA*?", "de abuelos a nietos, desde hace siglos…", "parece", "izq", "sepia", False, "pop", "bob")
    E["ro_1939"] = cifra("1939", "NACIÓ EN UNOS GRANDES ALMACENES DE CHICAGO", "1f3ec")
    E["ro_regalo"] = impacto("fue, literalmente,", "UN REGALO *PROMOCIONAL*", "una tienda, un hombre y un cuñado", "1f381")
    E["ro_historia"] = titular("EL RENO *MÁS FAMOSO* DEL MUNDO", "lo inventó un redactor de publicidad", "", ("1f98c", "270d-fe0f", "1f3ec", "1f3b5"), "navidad", True, "xl")
    E["ro_ward"] = icono_texto("1f3ec", "MONTGOMERY *WARD*", "una de las grandes cadenas de EE. UU.", "con sede en Chicago", "izq", "", False, "pop", "bob")
    E["ro_catalogo"] = flecha("1f4d6", "1f4ec", "VENTA *POR CATÁLOGO*", "eliges en un libro y te llega por correo")
    E["ro_tiendas"] = cifra("CIENTOS", "DE GRANDES ALMACENES POR TODO EL PAÍS", "1f3ec")
    E["ro_colorear"] = icono_texto("1f58d-fe0f", "UN LIBRITO *PARA COLOREAR*", "el regalo de cada Navidad para los niños", "", "der", "calido", True, "pop", "bob")
    E["ro_caro"] = comparar("1f468-200d-1f469-200d-1f467", "atraía familias a la tienda", "1f4b8", "pero se compraba fuera y salía caro", "PERO")
    E["ro_idea"] = bocadillos("1f4a1", ["¿Y si hacemos…", "…nuestro propio cuento?"], "finales de los años treinta")
    E["ro_may"] = icono_texto("270d-fe0f", "ROBERT L. *MAY*", "redactor de publicidad de la tienda", "el encargo", "izq", "", False, "up", "bob")
    E["ro_catalogos"] = icono_texto("1f614", "NO SE SENTÍA *UN TRIUNFADOR*", "escribía los textos de los catálogos", "según contó él mismo", "der", "", False, "pop", "")
    E["ro_bajito"] = lista([("1f9d2", "bajito"), ("1f648", "tímido"), ("1f4cf", "el más pequeño de la clase")], "DE NIÑO ERA…")
    E["ro_casa"] = icono_texto("1f3e5", "EN CASA, *UN AÑO MUY DURO*", "su mujer, gravemente enferma, murió ese mismo año", "", "izq", "dark", False, "pop", "")
    E["ro_barbara"] = icono_texto("1f467", "SU HIJA *BARBARA*", "le leía la historia por las noches, según se cuenta", "", "der", "calido", True, "pop", "bob", 380, (("1f319", 84, 20),))
    E["ro_diferente"] = titular("UN PERSONAJE *DIFERENTE*", "del que todos se ríen", "", ("1f98c", "1f614", "2764-fe0f", "2728"))
    E["ro_papanoel"] = impacto("un cuento de Navidad…", "LOS RENOS *DE PAPÁ NOEL*", "", "1f385")
    E["ro_nariz"] = f'''{F("navidad", True)}{obj(spr("1f98c", 340), 28, 54, "pop", "bob", .2)}<div style="position:absolute;left:19%;top:38%">{nariz(56, .9)}</div>{txt(kt("UNA NARIZ *ROJA Y BRILLANTE*", "xl hueso", .8), 70, 42, 52)}{txt(kt("los demás se burlaban de él", "l naranja", 1.4), 70, 58, 52)}'''
    E["ro_niebla"] = f'''{F("dark", True)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(220,225,235,.55),rgba(200,205,215,.85));animation:wFade 1s ease .2s both"></div>{obj(spr("1f6f7", 220), 30, 56, "left", "bob", .4)}{txt(kt("UNA NIEBLA *MUY ESPESA*", "xl", .8), 66, 42, 56)}{txt(kt("Nochebuena: Papá Noel no ve el camino", "l", 1.4), 66, 58, 56)}'''
    E["ro_especial2"] = comparar("1f614", "lo que le hacía distinto", "2b50", "lo que le hace especial", "→", "RODOLFO SALVA LA NAVIDAD")
    E["ro_jefe"] = bocadillos("1f914", ["¿Una nariz roja?", "…eso es de borrachos"], "según se cuenta, el jefe dudaba")
    E["ro_zoo"] = icono_texto("1f3a8", "DIBUJOS *DESDE EL ZOO*", "Denver Gillen dibujó ciervos para convencer al jefe", "", "izq", "", True, "pop", "bob", 380, (("1f98c", 84, 78),))
    E["ro_nombres"] = lista([("274c", "¿Rollo?"), ("274c", "¿Reginald?"), ("2705", "Rudolph · Rodolfo")], "EL NOMBRE, SEGÚN SE CUENTA")
    E["ro_cuento"] = icono_texto("1f4d6", "UN CUENTO *EN VERSO*", "Rudolph the Red-Nosed Reindeer", "", "der", "sepia", False, "pop", "bob")
    E["ro_24"] = cifra("2,4 MILLONES", "DE EJEMPLARES GRATIS EN LA NAVIDAD DE 1939", "1f4da")
    E["ro_exito"] = lista([("1f9d2", "los niños lo pedían"), ("1f46a", "los padres volvían"), ("1f3ec", "la tienda, llena")], "UN ÉXITO ENORME")
    E["ro_guerra"] = icono_texto("1f4c4", "FALTA *DE PAPEL*", "la guerra frenó las reimpresiones", "Segunda Guerra Mundial", "izq", "dark", False, "pop", "")
    E["ro_1946"] = cifra("1946", "SE REIMPRIME: MILLONES DE EJEMPLARES MÁS", "1f5a8-fe0f")
    E["ro_dueno"] = impacto("pero había un detalle:", "NO ERA *DE SU AUTOR*", "era de la empresa", "1f4dd")
    E["ro_derechos"] = flecha("270d-fe0f", "1f3ec", "LOS DERECHOS, *PARA LA EMPRESA*", "lo había escrito como parte de su trabajo")
    E["ro_deudas"] = icono_texto("1f9fe", "VIUDO *Y CON DEUDAS*", "y sin ganar nada extra con el reno", "", "der", "dark", False, "pop", "")
    E["ro_pide"] = cifra("1947", "PIDE QUE LE CEDAN LOS DERECHOS", "1f64f")
    E["ro_cumplido"] = icono_texto("2705", "MISIÓN *CUMPLIDA*", "millones de familias habían ido a sus tiendas", "para la empresa", "izq", "", True, "pop", "bob")
    E["ro_avery"] = icono_texto("1f91d", "SEWELL AVERY *ACEPTA*", "el presidente de Montgomery Ward", "", "der", "calido", True, "pop", "bob")
    E["ro_cambio"] = titular("LE CAMBIÓ *LA VIDA*", "lo que ganara Rodolfo, sería para él", "", ("1f98c", "1f4b0", "2728", "1f60a"), "navidad", True, "xl")
    E["ro_musica"] = impacto("lo mejor estaba por llegar…", "Y LLEGÓ *CON MÚSICA*", "", "1f3b6")
    E["ro_marks"] = icono_texto("1f3b9", "JOHNNY *MARKS*", "compositor… y cuñado de Robert May", "", "izq", "", False, "pop", "bob")
    E["ro_melodia"] = flecha("1f4d6", "1f3b5", "DEL CUENTO *A LA CANCIÓN*", "una melodía que hoy conoce todo el mundo")
    E["ro_rechazo"] = lista([("1f399-fe0f", "un cantante: no"), ("1f399-fe0f", "otro: tampoco"), ("1f914", "¿y ahora qué?")], "SE LA OFRECIÓ A VARIOS")
    E["ro_autry"] = icono_texto("1f920", "GENE *AUTRY*", "el vaquero cantante, estrella del country", "", "der", "calido", False, "pop", "bob")
    E["ro_patito"] = bocadillos("1f986", ["Grábala…", "…es como el patito feo"], "según se cuenta, su mujer le convenció")
    E["ro_numero1"] = cifra("Nº 1", "EN LAS NAVIDADES DE 1949, EN EE. UU.", "1f3c6")
    E["ro_versiones"] = titular("CIENTOS *DE VERSIONES*", "en muchos idiomas, también en español", "", ("1f3b5", "1f30d", "1f3a4", "1f4bf"), "navidad", True, "xl")
    E["ro_tele"] = impacto("el último paso:", "LA *TELEVISIÓN*", "", "1f4fa")
    E["ro_1964"] = cifra("1964", "RANKIN/BASS ESTRENA UN ESPECIAL DE TELEVISIÓN", "1f4fa")
    E["ro_stopmotion"] = lista([("1f9f8", "mover un poco los muñecos"), ("1f4f7", "hacer una foto"), ("1f501", "y vuelta a empezar")], "FOTOGRAMA A FOTOGRAMA")
    E["ro_elfo"] = comparar("1f9dd", "un elfo que quería ser dentista", "1f3dd-fe0f", "una isla de juguetes rechazados", "+", "PERSONAJES NUEVOS")
    E["ro_antena"] = cifra("DÉCADAS", "EMITIÉNDOSE CADA NAVIDAD EN EE. UU.", "1f4fa")
    E["ro_empieza"] = f'''{F("navidad", True)}{obj(spr("1f4fa", 300), 30, 50, "pop", "bob", .2)}{txt(kt("LA NAVIDAD EMPIEZA *CUANDO LO PONEN*", "xl hueso", .8), 70, 46, 52)}'''
    E["ro_detalle"] = impacto("un detalle que lo demuestra todo", "¿CUÁNTOS RENOS *TIENE PAPÁ NOEL*?", "", "1f914")
    E["ro_ocho"] = cifra("8", "EN EL POEMA DE 1823. NI UNO MÁS", "1f4dc")
    E["ro_noveno"] = f'''{F("navidad", True)}{"".join(obj(spr("1f98c", 90), 8 + i * 9, 66, "left", "bob", .1 + i * .1) for i in range(8))}{obj(spr("1f98c", 150), 88, 60, "pop", "bob", 1.2)}<div style="position:absolute;left:84%;top:52%">{nariz(36, 1.5)}</div>{txt(kt("RODOLFO, *EL NOVENO RENO*", "xl hueso", .8), 50, 24, 90)}'''
    E["ro_olvidados"] = comparar("1f937", "¿los otros ocho? casi nadie", "1f98c", "Rodolfo: todo el mundo", "VS")
    E["ro_colo"] = titular("COMO SI SIEMPRE *HUBIERA ESTADO AHÍ*", "de unos grandes almacenes a la tradición", "", ("1f3ec", "1f98c", "1f384", "2728"), "navidad", True, "xl")
    E["ro_quefue"] = impacto("¿y la tienda que lo creó?", "¿QUÉ FUE *DE ELLA*?", "", "1f3ec")
    E["ro_cierre"] = icono_texto("1f6aa", "CIERRA *SUS ALMACENES*", "a principios de los años dos mil", "perdió terreno frente a otras cadenas", "izq", "dark", False, "pop", "")
    E["ro_curioso"] = comparar("1f3da-fe0f", "la tienda desapareció", "1f98c", "su regalo sigue vivo", "PERO")
    E["ro_productos"] = lista([("1f3ac", "películas"), ("1f9f8", "juguetes"), ("1f9e5", "jerseys"), ("1f384", "adornos")], "RODOLFO, EN TODAS PARTES")
    E["ro_gestiona"] = icono_texto("1f4bc", "GESTIONAR *A SU RENO*", "dejó su trabajo de redactor años después", "Robert May", "der", "", False, "pop", "bob")
    E["ro_rentable"] = flecha("1f58d-fe0f", "1f4b0", "DE LIBRITO PARA AHORRAR *A NEGOCIO*", "uno de los personajes más rentables de la Navidad")
    E["leccion1"] = leccion(1, "las mejores historias de marca", "*NO HABLAN DEL PRODUCTO*", "1f4d6")
    E["leccion2"] = leccion(2, "lo que te hace diferente", "*PUEDE SER TU FUERZA*", "1f98c")
    E["leccion3"] = leccion(3, "si creas algo de valor,", "*PIENSA EN QUIÉN ES EL DUEÑO*", "1f4dd")
    E["ro_final"] = lista([("1f3ec", "unos almacenes"), ("270d-fe0f", "un redactor"), ("1f467", "una niña"), ("1f3b9", "un cuñado"), ("1f920", "un vaquero")], "")
    E["ro_chicago"] = comparar("2744-fe0f", "no en el Polo Norte", "1f3d9-fe0f", "en una oficina de Chicago", "SINO")
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:70px;top:170px">{vicon("deer", 420)}</div>
      <div style="position:absolute;left:82px;top:279px;width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff8a8a,#D7263D 60%,#8e0f1f);box-shadow:0 0 60px 30px rgba(255,60,60,.6)"></div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">EL RENO QUE NACIÓ</div><div class="q" style="font-size:170px;margin-top:22px">EN UNA TIENDA</div><div class="y">LA HISTORIA DE RODOLFO</div></div>'''
