"""Escenas del vídeo 46 (especial Navidad: Coca-Cola y Papá Noel). Motor común; sin logotipos: Papá Noel y camiones genéricos."""
from base import *

CAP_ICONOS = {1: "26ea", 2: "1f4dc", 3: "270f-fe0f", 4: "2600-fe0f", 5: "1f3a8", 6: "2753", 7: "260e-fe0f", 8: "1f43b-200d-2744-fe0f",
              9: "1f69a", 10: "1f9e0"}

def camion(px=420, luces=True):
    l = "".join(f'<circle cx="{14 + i*16}" cy="{14 + (i % 2) * 2}" r="4" fill="#ffe08a"/>' for i in range(13)) if luces else ""
    return (f'<svg width="{px}" height="{px*0.5:.0f}" viewBox="0 0 220 110"><rect x="6" y="12" width="150" height="70" rx="6" fill="#D7263D" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M156,36 L196,36 L214,60 L214,82 L156,82Z" fill="#c21f33" stroke="{TINTA}" stroke-width="4"/><path d="M164,42 L192,42 L204,58 L164,58Z" fill="#bfe3f2"/>'
            f'<circle cx="44" cy="88" r="13" fill="#222"/><circle cx="120" cy="88" r="13" fill="#222"/><circle cx="188" cy="88" r="13" fill="#222"/>'
            f'<path d="M30,50 Q80,30 130,50" stroke="#fff" stroke-width="5" fill="none"/>{l}</svg>')

def escenas():
    E = {}
    E["pn_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f381", "2744-fe0f", "1f385"), "navidad", True, "mega")
    E["pn_retrato"] = f'''{F("navidad", True)}{obj(spr("1f385", 340), 30, 50, "drop", "bob", .2)}{txt(kt("BARBA BLANCA, *TRAJE ROJO*", "xl hueso", .8), 70, 46, 52)}'''
    E["pn_mito"] = comparar("1f385", "Papá Noel de rojo…", "1f964", "¿por los colores de Coca-Cola?", "?")
    E["pn_falsa"] = impacto("una de las historias de marketing más repetidas…", "Y ES *FALSA*", "", "1f6ab")
    E["pn_verdad"] = icono_texto("1f914", "PERO TIENE *PARTE DE VERDAD*", "algo que cambió cómo lo imaginamos", "", "der", "", True, "pop", "swing")
    E["pn_historia"] = titular("¿COCA-COLA VISTIÓ A PAPÁ NOEL *DE ROJO*?", "la historia completa", "", ("1f385", "1f964", "1f3a8", "1f69a"), "navidad", True, "xl")
    E["pn_siglo"] = cifra("SIGLO IV", "HAY QUE VIAJAR MUY ATRÁS", "23f3")
    E["pn_mira"] = icono_texto("26ea", "MIRA: *EL OBISPO NICOLÁS*", "en la actual Turquía", "", "izq", "sepia", False, "pop", "bob", 380, (("1f1f9-1f1f7", 86, 80),))
    E["pn_monedas"] = icono_texto("1fa99", "MONEDAS DE ORO *EN SECRETO*", "para que tres hermanas pudieran casarse, según la leyenda", "", "der", "calido", True, "pop", "bob")
    E["pn_santo"] = lista([("1f9d2", "los niños"), ("26f5", "los marineros"), ("1f3d9-fe0f", "muchas ciudades")], "SAN NICOLÁS, PATRÓN DE…")
    E["pn_sinterklaas"] = icono_texto("1f1f3-1f1f1", "SINTERKLAAS", "regalos para los niños, durante siglos", "en los Países Bajos", "izq", "", False, "pop", "bob")
    E["pn_santaclaus"] = flecha("1f1f3-1f1f1", "1f5fd", "SINTERKLAAS → *SANTA CLAUS*", "los emigrantes holandeses en Nueva York")
    E["pn_noparecia"] = impacto("pero aquel Santa Claus", "NO SE PARECÍA *AL DE HOY*", "", "1f914")
    E["pn_formas"] = lista([("1f9cd", "alto y delgado"), ("1f9dd", "un duende pequeño"), ("26ea", "un obispo serio")], "A VECES ERA…")
    E["pn_poema"] = cifra("1823", "«UNA VISITA DE SAN NICOLÁS», UN POEMA EN NUEVA YORK", "1f4dc")
    E["pn_moore"] = icono_texto("1f468-200d-1f3eb", "CLEMENT CLARKE *MOORE*", "un profesor que lo escribió para sus hijos", "según la versión más extendida", "der", "sepia", False, "up", "bob")
    E["pn_renos"] = f'''{F("navidad", True)}{"".join(obj(spr("1f98c", 120), 12 + i * 9, 54 + (i % 2) * 4, "left", "bob", .1 + i * .1) for i in range(8))}{obj(spr("1f6f7", 200), 88, 56, "left", "bob", 1.0)}{txt(kt("TRINEO, *OCHO RENOS* Y CHIMENEA", "xl hueso", 1.3), 50, 22, 90)}'''
    E["pn_versos"] = titular("NACIERON *DE ESOS VERSOS*", "muchas de las ideas de hoy", "", ("1f4dc", "1f6f7", "1f98c", "1f3e0"))
    E["pn_nombres"] = bocadillos("1f98c", ["Dasher", "Dancer", "Prancer", "Vixen"], "y hasta los nombres de los renos")
    E["pn_nast"] = icono_texto("270f-fe0f", "THOMAS *NAST*", "el dibujante que le puso cara", "", "izq", "", False, "pop", "bob")
    E["pn_harpers"] = icono_texto("1f4f0", "HARPER'S *WEEKLY*", "una de las revistas más leídas de EE. UU.", "", "der", "sepia", False, "pop", "bob")
    E["pn_guerra"] = cifra("AÑOS 1860", "SANTA CLAUS CADA NAVIDAD, EN PLENA GUERRA CIVIL", "1f385")
    E["pn_detalles"] = lista([("1f9d4-200d-2642-fe0f", "barba blanca"), ("1f3ed", "taller en el Polo Norte"), ("1f4cb", "lista de niños buenos")], "PERFILANDO AL PERSONAJE")
    E["pn_rojo"] = f'''{F("navidad", True)}{obj(spr("1f385", 300), 28, 50, "pop", "bob", .2)}{txt(kt("YA DE ROJO, *DÉCADAS ANTES*", "xl hueso", .8), 70, 42, 54)}{txt(kt("ribetes blancos y cinturón negro", "l naranja", 1.4), 70, 58, 54)}'''
    E["pn_colores"] = f'''{F()}{"".join(f'<div class="pos" style="left:{20 + i*20}%;top:44%;width:180px;height:180px;border-radius:50%;background:{c};border:6px solid {TINTA};animation:ePop .4s ease {.2 + i*.25}s both"></div>' for i, c in enumerate(["#D7263D", "#2BB673", "#2E6BD6", "#8a5a3b"]))}{txt(kt("ROJO… PERO TAMBIÉN *VERDE, AZUL O MARRÓN*", "xl", 1.3), 50, 78, 90)}'''
    E["pn_entra"] = impacto("y ahora sí, entra en escena", "*COCA-COLA*", "", "1f964")
    E["pn_verano"] = icono_texto("2600-fe0f", "UNA BEBIDA *DE VERANO*", "la gente la asociaba al calor", "principios de los años treinta", "izq", "calido", True, "pop", "spin-slow")
    E["pn_invierno"] = comparar("2600-fe0f", "verano: muchas ventas", "2744-fe0f", "invierno: muchas menos", "VS")
    E["pn_sed"] = bocadillos("1f964", ["La sed…", "…no tiene estación"], "su eslogan de los años veinte")
    E["pn_campanas"] = flecha("1f964", "1f384", "UNIR LA MARCA *A LA NAVIDAD*", "según varios historiadores de la publicidad")
    E["pn_elige"] = titular("EL PERSONAJE *MÁS QUERIDO*", "de la Navidad", "", ("1f385", "2764-fe0f", "1f381", "2728"), "navidad", True, "xl")
    E["pn_sundblom"] = icono_texto("1f468-200d-1f3a8", "HADDON *SUNDBLOM*", "ilustrador de publicidad de Chicago", "el encargo", "izq", "", False, "up", "bob")
    E["pn_1931"] = cifra("1931", "SU PRIMER PAPÁ NOEL PARA COCA-COLA · HASTA LOS AÑOS 60", "1f3a8")
    E["pn_abuelo"] = lista([("1f474", "humano"), ("1f60a", "cálido"), ("1f970", "un abuelo bonachón")], "INSPIRADO EN EL POEMA")
    E["pn_espejo"] = comparar("1f474", "un amigo, vendedor jubilado", "1fa9e", "después, él mismo en el espejo", "→", "EL MODELO, SEGÚN SE CUENTA")
    E["pn_millones"] = lista([("1f4f0", "revistas"), ("1f5bc-fe0f", "carteles"), ("1f3ea", "tiendas")], "MILLONES LO VEÍAN CADA NAVIDAD")
    E["pn_pregunta"] = impacto("entonces…", "¿MITO *O VERDAD*?", "", "2753")
    E["pn_no"] = icono_texto("1f6ab", "NO: *EL ROJO YA EXISTÍA*", "incluso otras marcas de refrescos lo usaron antes", "", "izq", "", False, "pop", "")
    E["pn_reconoce"] = icono_texto("1f4bb", "LA PROPIA COCA-COLA *LO RECONOCE*", "en su web", "", "der", "", False, "pop", "bob")
    E["pn_fijar"] = cifra("+30 AÑOS", "EL MISMO PAPÁ NOEL, NAVIDAD TRAS NAVIDAD", "1f501", "lo que sí hizo:")
    E["pn_modelo"] = titular("SE CONVIRTIÓ *EN EL MODELO*", "así lo dibujamos hoy", "", ("1f385", "270f-fe0f", "1f30d", "2728"), "navidad", True, "xl")
    E["pn_conclusion"] = comparar("1f454", "no inventó el traje", "1f385", "fijó cómo lo imaginamos todos", "+")
    E["pn_otra"] = impacto("otra marca creó, sin querer,", "UNA TRADICIÓN *MUY CURIOSA*", "", "1f381")
    E["pn_sears"] = cifra("1955", "UN ANUNCIO DE LOS ALMACENES SEARS EN COLORADO SPRINGS", "1f4f0")
    E["pn_errata"] = bocadillos("260e-fe0f", ["¡Llama a Papá Noel!", "…con el número mal impreso"], "el anuncio")
    E["pn_defensa"] = icono_texto("1f4e1", "SONABA EN UN CENTRO *DE DEFENSA AÉREA*", "que vigilaba el cielo", "", "izq", "dark", False, "pop", "glow")
    E["pn_shoup"] = icono_texto("1f396-fe0f", "EL CORONEL *NO COLGÓ*", "y contó a los niños por dónde iba el trineo", "Harry Shoup, según el propio ejército", "der", "", True, "pop", "bob")
    E["pn_norad"] = f'''{F("espacio", True)}{obj(spr("1f30d", 300), 30, 50, "zoom", "spin-slow", .2)}{obj(spr("1f6f7", 130), 44, 30, "left", "float", .8)}{txt(kt("CADA NOCHEBUENA, *SIGUEN EL TRINEO*", "xl hueso", .9), 70, 42, 52)}{txt(kt("y millones de niños lo consultan", "l naranja", 1.5), 70, 58, 52)}'''
    E["pn_buscar"] = impacto("Coca-Cola nunca dejó de buscar", "PERSONAJES *NAVIDEÑOS*", "", "1f50e")
    E["pn_osos"] = f'''{F("espacio", True)}{obj(spr("1f43b-200d-2744-fe0f", 260), 30, 58, "pop", "bob", .2)}{txt(kt("1993: OSOS POLARES *Y UNA AURORA BOREAL*", "xl hueso", .8), 68, 40, 56)}{txt(kt("hechos por ordenador", "l naranja", 1.4), 68, 56, 56)}'''
    E["pn_animacion"] = icono_texto("1f4bb", "ANIMACIÓN *ESPECTACULAR*", "otro símbolo de la marca durante años", "para la época", "der", "", True, "pop", "bob")
    E["pn_frio"] = lista([("2744-fe0f", "frío"), ("2603-fe0f", "nieve"), ("1f970", "ternura")], "LA MISMA IDEA: ASOCIARSE A…")
    E["pn_1995"] = cifra("1995", "EL ANUNCIO QUE «MARCA EL COMIENZO» DE LA NAVIDAD", "1f4fa")
    E["pn_camiones"] = f'''{F("espacio")}{obj(skyline(1800, "#1d2550"), 50, 92, "none")}<div class="carrera" style="--d:.2s">{camion(420)}</div><div class="carrera" style="--d:1.4s">{camion(320)}</div>{txt(kt("CAMIONES ROJOS *ILUMINADOS*", "xl hueso", .8), 50, 20, 90)}'''
    E["pn_cancion"] = bocadillos("1f3b5", ["Holidays are coming…", "…la Navidad llega"], "una canción pegadiza")
    E["pn_agencia"] = icono_texto("1f30d", "DÉCADAS *EN DECENAS DE PAÍSES*", "con pequeños cambios; lo creó una agencia de EE. UU.", "", "izq", "", True, "pop", "spin-slow")
    E["pn_gira"] = icono_texto("1f4f8", "GIRAS *CON CAMIONES DE VERDAD*", "miles de personas haciéndose fotos", "", "der", "navidad", True, "pop", "bob")
    E["pn_tradicion"] = titular("UN ANUNCIO *CONVERTIDO EN TRADICIÓN*", "igual que el Papá Noel de Sundblom", "", ("1f69a", "1f385", "1f384", "2728"), "navidad", True, "xl")
    E["leccion1"] = leccion(1, "no hace falta inventar algo", "*PARA QUEDÁRSELO*", "1f385")
    E["leccion2"] = leccion(2, "si tienes temporada baja,", "*ÚNETE A UN MOMENTO DEL AÑO*", "1f384")
    E["leccion3"] = leccion(3, "cuidado con las historias", "*DEMASIADO REDONDAS*", "1f914")
    E["pn_final"] = lista([("26ea", "un obispo"), ("1f4dc", "un poema"), ("270f-fe0f", "un dibujante"), ("1f3a8", "un pintor"), ("1f69a", "unos camiones")], "")
    E["pn_ya"] = f'''{F("navidad", True)}{obj(spr("1f385", 320), 30, 50, "drop", "bob", .2)}{txt(kt("YA SABES *LA HISTORIA COMPLETA*", "xl hueso", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:80px;top:150px">{vicon("santa-claus", 400)}</div>
      <div style="position:absolute;left:340px;top:420px">{vicon("cup-with-straw", 170)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">¿LO VISTIÓ DE ROJO</div><div class="q" style="font-size:190px;margin-top:22px">COCA-COLA?</div><div class="y">EL MITO DE PAPÁ NOEL</div></div>'''
