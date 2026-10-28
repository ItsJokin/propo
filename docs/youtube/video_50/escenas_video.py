"""Escenas del vídeo 50 (especial Navidad: Scalextric). Motor común; sin logotipos: pistas y coches genéricos."""
from base import *

CAP_ICONOS = {1: "1f511", 2: "1f6e3-fe0f", 3: "1f4b7", 4: "1f1ea-1f1f8", 5: "1f3f0", 6: "1f381", 7: "1f4c9", 8: "1f500", 9: "1f9e0"}

def pista(w=900, d=.2):
    """Circuito ovalado de dos carriles con ranuras (d=None: sin animación)."""
    an = "" if d is None else f' style="animation:ePop .5s ease {d}s both"'
    return (f'<svg width="{w}" height="{w*0.48:.0f}" viewBox="0 0 500 240"{an}>'
            f'<rect x="10" y="10" width="480" height="220" rx="110" fill="#4a4f57" stroke="{TINTA}" stroke-width="6"/>'
            f'<rect x="80" y="70" width="340" height="100" rx="50" fill="#2BB673" stroke="{TINTA}" stroke-width="6"/>'
            f'<rect x="28" y="28" width="444" height="184" rx="92" fill="none" stroke="#cfd4da" stroke-width="3" stroke-dasharray="2 0"/>'
            f'<rect x="62" y="52" width="376" height="136" rx="68" fill="none" stroke="#cfd4da" stroke-width="3"/>'
            f'<rect x="45" y="40" width="410" height="160" rx="80" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="10 8" opacity=".5"/>'
            f'<rect x="232" y="10" width="10" height="60" fill="#fff"/><rect x="242" y="10" width="10" height="60" fill="{TINTA}"/></svg>')

def escenas():
    E = {}
    E["sc_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f3ce-fe0f", "2744-fe0f", "1f381"), "navidad", True, "mega")
    E["sc_reyes"] = lista([("1f4e6", "una caja enorme"), ("1f6e3-fe0f", "pista gris"), ("1f3ae", "dos mandos"), ("1f3ce-fe0f", "dos coches")], "MAÑANA DE REYES")
    E["sc_salon"] = f'''{F("navidad", True)}<div class="pos" style="left:50%;top:60%">{pista(860)}</div>{obj(spr("1f3ce-fe0f", 120), 30, 74, "left", "shake", .8)}{txt(kt("LA PISTA OCUPA *MEDIO SALÓN*", "xl hueso", .4), 50, 16, 90)}'''
    E["sc_espanol"] = icono_texto("1f1ea-1f1f8", "¿UN JUGUETE *ESPAÑOL*?", "casi todos lo dan por hecho", "", "izq", "", False, "pop", "bob")
    E["sc_ingles"] = flecha("1f1ec-1f1e7", "1f1ea-1f1f8", "NACIÓ *EN INGLATERRA*", "un inventor, una fábrica de Barcelona y dos nombres")
    E["sc_historia"] = titular("LA HISTORIA DE *SCALEXTRIC*", "de una feria inglesa al suelo de tu salón", "", ("1f3ce-fe0f", "1f6e3-fe0f", "1f3ae", "1f3c1"), "navidad", True, "xl")
    E["sc_francis"] = icono_texto("1f468-200d-1f527", "FRED *FRANCIS*", "fabricante de juguetes", "Inglaterra, principios de los años cincuenta", "izq", "sepia", False, "up", "bob")
    E["sc_cuerda"] = lista([("1f511", "das cuerda con una llave"), ("1f447", "lo sueltas en el suelo"), ("1f697", "corre unos metros")], "COCHES DE HOJALATA DE CUERDA")
    E["sc_scalex"] = cifra("SCALEX", "LOS COCHES DE CUERDA DE MINIMODELS · SE VENDÍAN MUY BIEN", "1f697")
    E["sc_copias"] = comparar("1f697", "el original", "1f46f", "copias más baratas", "VS", "LAS VENTAS EMPIEZAN A CAER")
    E["sc_motor"] = flecha("1f511", "26a1", "DE LA CUERDA *A LA ELECTRICIDAD*", "un pequeño motor eléctrico")
    E["sc_nombre"] = f'''{F("navidad", True)}{txt(kt("SCALEX + TRIC", "mega hueso", .3), 50, 38, 90)}{txt(kt("= *SCALEXTRIC*", "xl hueso", 1.4), 50, 60, 90)}'''
    E["sc_clave"] = impacto("la clave no estaba solo en el motor:", "ESTABA *EN LA PISTA*", "", "1f6e3-fe0f")
    E["sc_ranura"] = f'''{F()}<div class="pos" style="left:30%;top:52%">{pista(620)}</div>{txt(kt("UNA *RANURA* Y DOS TIRAS DE METAL", "xl", .6), 76, 42, 42)}{txt(kt("guían el coche y le dan electricidad", "l naranja", 1.4), 76, 58, 42)}'''
    E["sc_mando"] = icono_texto("1f3ae", "UN MANDO *POR JUGADOR*", "cuanto más aprietas, más corre… y en la curva, sale volando", "", "der", "", True, "pop", "shake")
    E["sc_carrera"] = comparar("1f697", "un coche que corre solo", "1f3c1", "una carrera de verdad", "→", "TÚ DECIDES CUÁNDO FRENAR")
    E["sc_1957"] = cifra("1957", "SE PRESENTA EN LA FERIA DEL JUGUETE DE HARROGATE", "1f3aa")
    E["sc_abasto"] = icono_texto("1f3ed", "NO DABA *ABASTO*", "un éxito inmediato para una empresa pequeña", "", "izq", "calido", True, "pop", "shake")
    E["sc_giro"] = impacto("y aquí llega", "EL *PRIMER GIRO*", "", "1f504")
    E["sc_1958"] = cifra("1958", "SOLO UN AÑO DESPUÉS, FRANCIS VENDE EL NEGOCIO", "1f4b7")
    E["sc_lines"] = icono_texto("1f3ed", "LINES *BROS*", "de los mayores fabricantes de juguetes del Reino Unido", "la empresa detrás de Tri-ang", "der", "", False, "pop", "bob", 380, (("1f1ec-1f1e7", 84, 20),))
    E["sc_pasiones"] = lista([("1f3ce-fe0f", "el motor"), ("2708-fe0f", "la aviación")], "FRANCIS, A SUS OTRAS PASIONES")
    E["sc_plastico"] = comparar("1f96b", "coches de hojalata", "1f3ce-fe0f", "coches de plástico, más detallados", "→", "SCALEXTRIC, A LO GRANDE")
    E["sc_exporta"] = flecha("1f1ec-1f1e7", "1f30d", "A *OTROS PAÍSES*", "uno de ellos fue España")
    E["sc_1962"] = cifra("1962", "SCALEXTRIC LLEGA A CATALUÑA", "1f1ea-1f1f8", "de la mano de Josep Maria Arnau")
    E["sc_exin"] = f'''{F()}{txt(kt("*EX*CLUSIVOS *IN*DUSTRIALES", "xl", .3), 50, 38, 90)}{txt(kt("= *EXIN*", "mega", 1.4), 50, 60, 90)}{obj(spr("1f3ed", 150), 86, 80, "pop", "bob", 1.8)}'''
    E["sc_acuerdo"] = lista([("1f91d", "un acuerdo con Lines Bros"), ("1f69a", "primero, distribuirlo"), ("1f3ed", "después, fabricarlo aquí")], "EXIN Y SCALEXTRIC")
    E["sc_importar"] = comparar("1f6a2", "importar: caro y complicado", "1f3ed", "fabricar en el país", "→", "LA ESPAÑA DE LOS AÑOS SESENTA")
    E["sc_propios"] = lista([("1f3ce-fe0f", "sus propios coches"), ("1f6e3-fe0f", "sus propios circuitos"), ("1f527", "sus propios accesorios")], "NO SE LIMITÓ A COPIAR")
    E["sc_1970"] = cifra("1970", "EXIN COMPRA LA MARCA PARA ESPAÑA Y OTROS PAÍSES, COMO MÉXICO", "1f4dd", "según la revista del RACE")
    E["sc_espanol2"] = titular("EL JUGUETE INGLÉS, *YA ERA ESPAÑOL*", "a todos los efectos", "", ("1f1ec-1f1e7", "27a1-fe0f", "1f1ea-1f1f8", "2728"), "navidad", True, "xl")
    E["sc_noera"] = impacto("Exin", "NO ERA *SOLO SCALEXTRIC*", "", "1f3ed")
    E["sc_castillos"] = icono_texto("1f3f0", "EXIN *CASTILLOS*", "fortalezas medievales con piezas de plástico", "", "izq", "sepia", False, "pop", "bob")
    E["sc_cinexin"] = icono_texto("1f4fd-fe0f", "*CINEXIN*", "películas cortas en la pared de la habitación", "", "der", "dark", True, "pop", "glow")
    E["sc_tente"] = lista([("1f9f1", "Tente: construcción"), ("1f9d7", "Madelman: aventureros"), ("1f682", "Ibertren: trenes")], "Y MÁS…")
    E["sc_catalogo"] = icono_texto("1f4d6", "EL CATÁLOGO *DE LOS SUEÑOS*", "repasado una y otra vez antes de la carta a los Reyes", "años setenta y ochenta", "izq", "calido", True, "pop", "bob")
    E["sc_carta"] = comparar("1f48c", "de los regalos más deseados", "1f4b8", "y de los más caros", "Y", "SCALEXTRIC EN LA CARTA")
    E["sc_encaja"] = impacto("¿por qué encajaba tan bien", "EN *NAVIDAD*?", "", "1f384")
    E["sc_grande"] = icono_texto("1f381", "UN REGALO *GRANDE*", "ilusión solo por el tamaño de la caja", "uno", "izq", "navidad", True, "drop", "bob")
    E["sc_ampliar"] = lista([("1f6e3-fe0f", "más pistas"), ("2197-fe0f", "curvas peraltadas"), ("1f309", "puentes"), ("1f3ce-fe0f", "coches nuevos")], "DOS: NO SE TERMINABA NUNCA")
    E["sc_familia"] = icono_texto("1f468-200d-1f466", "UN JUGUETE *EN FAMILIA*", "hacían falta dos… y los padres se apuntaban", "tres", "der", "calido", True, "pop", "bob", 380, (("1f3ec", 84, 76),))
    E["sc_pisar"] = lista([("1f6e0-fe0f", "montarlo en el suelo"), ("1f9b6", "que alguien lo pise"), ("1f4a5", "salirse en la curva")], "PARTE DE LA EXPERIENCIA")
    E["sc_ruido"] = f'''{F("navidad", True)}<div class="pos" style="left:50%;top:62%">{pista(760)}</div>{txt(kt("SUENA A *VACACIONES DE NAVIDAD*", "xl hueso", .4), 50, 16, 90)}'''
    E["sc_cambios"] = lista([("1f579-fe0f", "videojuegos"), ("1f6a2", "juguetes importados"), ("1f4c9", "competencia más dura")], "LOS OCHENTA Y NOVENTA")
    E["sc_1993"] = cifra("1993", "EXIN TIENE QUE CERRAR", "1f6aa")
    E["sc_manos"] = flecha("1f1fa-1f1f8", "1f1ea-1f1f8", "DE MANO *EN MANO*", "una juguetera estadounidense, después Tecnitoys (1998)")
    E["sc_2012"] = cifra("2012", "OTRA COMPAÑÍA TOMA EL RELEVO", "1f504")
    E["sc_2018"] = cifra("2018", "SCALE COMPETITION XTREME SE HACE CON LA MARCA", "1f3c1", "según la revista del RACE")
    E["sc_recupera"] = titular("LA FAMILIA ARNAU *LO RECUPERA*", "más de cincuenta años después", "", ("1f46a", "1f3ce-fe0f", "1f1ea-1f1f8", "2728"), "navidad", True, "xl")
    E["sc_curioso"] = impacto("y aquí viene", "LO MÁS *CURIOSO*", "", "1f914")
    E["sc_duenos"] = comparar("1f1ec-1f1e7", "un dueño en el Reino Unido", "1f1ea-1f1f8", "otro en España", "≠", "UN NOMBRE, DOS JUGUETES")
    E["sc_scx"] = flecha("1f1ea-1f1f8", "1f30d", "FUERA DE ESPAÑA: *SCX*", "las siglas de la empresa española")
    E["sc_superslot"] = flecha("1f1ec-1f1e7", "1f1ea-1f1f8", "EN ESPAÑA: *SUPERSLOT*", "los coches de la marca británica original")
    E["sc_londres"] = comparar("1f482", "un Scalextric en Londres", "1f3db-fe0f", "otro en Madrid", "≠", "NO ES LO MISMO")
    E["sc_partida"] = titular("UNA MARCA *PARTIDA EN DOS*", "nació inglesa, se hizo española", "", ("1f1ec-1f1e7", "1f500", "1f1ea-1f1f8", "1f3ce-fe0f"))
    E["leccion1"] = leccion(1, "si te copian, no compitas en precio:", "*CAMBIA LAS REGLAS*", "26a1")
    E["leccion2"] = leccion(2, "un buen producto", "*SE PUEDE HACER LOCAL*", "1f1ea-1f1f8")
    E["leccion3"] = leccion(3, "los derechos de una marca", "*IMPORTAN TANTO COMO EL PRODUCTO*", "1f4dd")
    E["sc_final"] = lista([("1f511", "un coche de cuerda"), ("1f6e3-fe0f", "una ranura"), ("1f3aa", "una feria"), ("1f3ed", "una fábrica"), ("1f6cb-fe0f", "miles de salones")], "")
    E["sc_monta"] = f'''{F("navidad", True)}{obj(spr("1f3ce-fe0f", 300), 30, 50, "left", "shake", .2)}{txt(kt("YA SABES *DE DÓNDE VIENE*", "xl hueso", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:20px;top:300px">{pista(640, None)}</div>
      <div style="position:absolute;left:170px;top:190px">{vicon("racing-car", 300)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">¿SCALEXTRIC ES</div><div class="q" style="font-size:170px;margin-top:22px">ESPAÑOL?</div><div class="y">NACIÓ EN INGLATERRA</div></div>'''
