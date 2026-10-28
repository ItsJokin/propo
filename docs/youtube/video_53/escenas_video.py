"""Escenas del vídeo 53 (especial Navidad: el turrón de Jijona). Motor común; sin logotipos ni envoltorios de marcas: tabletas genéricas."""
from base import *

CAP_ICONOS = {1: "1f36f", 2: "1f9f1", 3: "1f40e", 4: "1f6e1-fe0f", 5: "1f3ed", 6: "1f3e0", 7: "2600-fe0f", 8: "1f9e0"}

def tableta(tipo="blando", w=420, d=.2):
    """Tableta de turrón genérica: «blando» (pasta lisa) o «duro» (almendras enteras)."""
    an = "" if d is None else f"animation:ePop .5s ease {d}s both;"
    if tipo == "duro":
        alm = "".join(f'<ellipse cx="{30 + (i % 7) * 52}" cy="{30 + (i // 7) * 42}" rx="18" ry="11" fill="#b9814a" stroke="#7a4f25" stroke-width="2" transform="rotate({(i*37) % 60 - 30} {30 + (i % 7) * 52} {30 + (i // 7) * 42})"/>' for i in range(21))
        cuerpo = f'<rect x="4" y="4" width="372" height="132" rx="10" fill="#f3e6c8" stroke="{TINTA}" stroke-width="5"/>{alm}'
    else:
        cuerpo = (f'<rect x="4" y="4" width="372" height="132" rx="10" fill="#c99a62" stroke="{TINTA}" stroke-width="5"/>'
                  + "".join(f'<circle cx="{(i*53) % 360 + 12}" cy="{(i*29) % 120 + 12}" r="3" fill="#a87843"/>' for i in range(40)))
    return f'<svg width="{w}" height="{w*0.37:.0f}" viewBox="0 0 380 140" style="{an}">{cuerpo}</svg>'

def escenas():
    E = {}
    E["tu_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f36f", "2744-fe0f", "1f3e0"), "navidad", True, "mega")
    E["tu_vuelve"] = lista([("1f9f3", "una maleta"), ("1f6aa", "una puerta que se abre"), ("1f917", "un abrazo")], "ALGUIEN QUE VUELVE DE LEJOS")
    E["tu_llorar"] = icono_texto("1f622", "DÉCADAS *EMOCIONANDO*", "para muchos, empieza oficialmente la Navidad", "un anuncio de turrones", "izq", "navidad", True, "pop", "bob")
    E["tu_pueblo"] = f'''{F("calido", True)}<div class="pos" style="left:27%;top:50%">{tableta("blando", 700)}</div>{txt(kt("UN PUEBLO, *SIGLOS DE TURRÓN*", "xl", .6), 73, 42, 44)}{txt(kt("almendra y miel… y una tienda en Madrid", "l naranja", 1.3), 73, 58, 44)}'''
    E["tu_historia"] = titular("LA HISTORIA DEL *TURRÓN DE JIJONA*", "", "", ("1f36f", "1f330", "1f3d4-fe0f", "1f3e0"), "navidad", True, "xl")
    E["tu_receta"] = lista([("1f330", "almendra"), ("1f36f", "miel"), ("1f9c2", "azúcar"), ("1f95a", "clara de huevo")], "UNA RECETA MUY SENCILLA")
    E["tu_arabe"] = icono_texto("1f3fa", "¿UNA HERENCIA *ÁRABE*?", "frutos secos y miel por todo el Mediterráneo", "según se cuenta", "der", "sepia", False, "pop", "bob")
    E["tu_xvi"] = cifra("SIGLO XVI", "YA SE HACÍA TURRÓN EN JIJONA", "1f4dc")
    E["tu_escolano"] = icono_texto("1f451", "UN REGALO *PARA REYES*", "Gaspar Escolano, a principios del siglo XVII; un producto caro", "", "izq", "sepia", False, "pop", "bob")
    E["tu_porque"] = comparar("1f333", "almendros por todas partes", "1f41d", "tradición de apicultura", "+", "¿POR QUÉ ALLÍ?")
    E["tu_aclarar"] = impacto("algo que mucha gente confunde:", "¿BLANDO *O DURO*?", "", "1f914")
    E["tu_blando"] = f'''{F()}<div class="pos" style="left:27%;top:50%">{tableta("blando", 700)}</div>{txt(kt("JIJONA: *EL BLANDO*", "xl", .6), 73, 40, 44)}{txt(kt("almendra molida y miel: se deshace en la boca", "l naranja", 1.3), 73, 56, 44)}'''
    E["tu_duro"] = f'''{F()}<div class="pos" style="left:27%;top:50%">{tableta("duro", 700)}</div>{txt(kt("ALICANTE: *EL DURO*", "xl", .6), 73, 40, 44)}{txt(kt("almendras enteras… y a golpes", "l naranja", 1.3), 73, 56, 44)}'''
    E["tu_mismos"] = icono_texto("1f469-200d-1f373", "LOS MISMOS *ARTESANOS*", "los dos nacieron en la misma zona", "", "izq", "calido", True, "pop", "bob")
    E["tu_castuera"] = comparar("1f3d4-fe0f", "Jijona (Alicante)", "1f3de-fe0f", "Castuera (Extremadura)", "VS", "¿LA CUNA DEL TURRÓN?")
    E["tu_vender"] = icono_texto("1f3d4-fe0f", "EL PROBLEMA: *VENDER*", "un pueblo pequeño, en la montaña, lejos de las ciudades", "", "der", "", False, "pop", "")
    E["tu_salian"] = f'''{F("sepia", True)}{obj(spr("1f40e", 200), 22, 58, "left", "bob", .2)}{obj(spr("1f6d2", 150), 40, 62, "left", "bob", .5)}{txt(kt("TURRONEROS *VIAJEROS*", "xl", .6), 70, 42, 52)}{txt(kt("según se cuenta, meses de invierno lejos de casa", "l naranja", 1.3), 70, 58, 52)}'''
    E["tu_mira"] = cifra("1842", "LUIS MIRA VENDE TURRÓN EN LA PLAZA MAYOR DE MADRID", "1f3db-fe0f")
    E["tu_1855"] = cifra("1855", "ABRE SU TIENDA EN LA CARRERA DE SAN JERÓNIMO", "1f3ea")
    E["tu_sexta"] = icono_texto("1f46a", "LA *SEXTA GENERACIÓN*", "y colas en la puerta cada Navidad", "según el turismo de Madrid", "izq", "calido", True, "pop", "bob")
    E["tu_originales"] = flecha("1f3d9-fe0f", "1f3e0", "LOS PRIMEROS EN *VOLVER A CASA POR NAVIDAD*", "los turroneros, al terminar las fiestas")
    E["tu_imitaciones"] = comparar("1f36f", "un producto de éxito", "1f46f", "muchas imitaciones", "→", "")
    E["tu_1939"] = cifra("AGOSTO 1939", "SE CREA UN CONSEJO REGULADOR PARA PROTEGER LOS NOMBRES", "1f6e1-fe0f")
    E["tu_pionera"] = icono_texto("1f947", "UNA PROTECCIÓN *PIONERA*", "para un alimento que no era vino", "una de las primeras de España", "der", "", True, "pop", "bob")
    E["tu_reglas"] = lista([("1f4cd", "dónde se fabrica"), ("1f9fe", "con qué ingredientes"), ("1f330", "cuánta almendra"), ("2b50", "qué calidad")], "EL CONSEJO DECIDE")
    E["tu_francia"] = icono_texto("2696-fe0f", "HASTA UN TRIBUNAL *FRANCÉS*", "prohibió el uso indebido de los nombres", "según se publicó", "izq", "", False, "pop", "", 380, (("1f1eb-1f1f7", 84, 20),))
    E["tu_sello"] = icono_texto("1f3f7-fe0f", "DOS INDICACIONES *GEOGRÁFICAS PROTEGIDAS*", "con etiqueta numerada en cada tableta", "hoy", "der", "calido", True, "pop", "bob")
    E["tu_fabricas"] = flecha("1f469-200d-1f373", "1f3ed", "DEL OBRADOR *A LA FÁBRICA*", "máquinas, envoltorios de colores y tiendas de todo el país")
    E["tu_1883"] = cifra("1883", "ANTONIO MONERRIS PLANELLES FUNDA SU FÁBRICA EN JIJONA", "1f3ed", "según la historia de la marca")
    E["tu_crece"] = icono_texto("1f30d", "CRECE *FUERA DE ESPAÑA*", "y se convierte en una de las más conocidas", "principios del siglo XX", "izq", "", False, "pop", "spin-slow")
    E["tu_grupo"] = comparar("1f36f", "el turrón de Jijona", "1f3f0", "una confitería de Sonseca (Toledo)", "+", "HOY, EN UN GRAN GRUPO")
    E["tu_motor"] = comparar("1f33e", "la agricultura", "1f36f", "el turrón", "→", "EL MOTOR DE JIJONA EN EL SIGLO XX")
    E["tu_anuncio"] = impacto("y llegamos", "AL *ANUNCIO*", "", "1f4fa")
    E["tu_idea"] = flecha("1f3d9-fe0f", "1f3e0", "VOLVER *A CASA*", "por estudios o por trabajo, vuelve con su familia")
    E["tu_abrazo"] = lista([("1f6aa", "la llegada"), ("1f917", "el abrazo"), ("1f37d-fe0f", "la mesa puesta")], "Y EL TURRÓN EN EL CENTRO")
    E["tu_nohabla"] = comparar("1f330", "no habla de almendras ni de precio", "1f46a", "habla de reencontrarse", "→", "")
    E["tu_renueva"] = icono_texto("1f504", "SE RENUEVA *CADA AÑO*", "otros actores y situaciones, la misma idea y la misma canción", "", "izq", "", True, "pop", "spin-slow")
    E["tu_frase"] = bocadillos("1f9d1", ["¿Qué haces estas fiestas?", "…vuelvo a casa por Navidad"], "una frase que ya es del idioma")
    E["tu_idioma"] = titular("DE ESLOGAN *A EXPRESIÓN POPULAR*", "el mayor éxito de un anuncio", "", ("1f4fa", "1f5e3-fe0f", "1f3e0", "2728"), "navidad", True, "xl")
    E["tu_sorprende"] = impacto("el turrón de diciembre", "NO SE HACE *EN DICIEMBRE*", "", "1f62e")
    E["tu_verano"] = f'''{F("calido", True)}{obj(spr("2600-fe0f", 260), 26, 46, "pop", "spin-slow", .2)}{txt(kt("EN PLENO VERANO, *HUELE A ALMENDRA TOSTADA*", "xl", .6), 68, 42, 56)}{txt(kt("y contratos solo para esos meses", "l naranja", 1.3), 68, 58, 56)}'''
    E["tu_estacional"] = cifra("POCAS SEMANAS", "CASI TODAS LAS VENTAS DEL AÑO", "1f4c5")
    E["tu_todoano"] = lista([("1f366", "helados de turrón"), ("1f370", "nuevas recetas"), ("1f381", "formatos pequeños")], "VENDER TODO EL AÑO")
    E["tu_sabores"] = lista([("1f36b", "chocolate"), ("1f95a", "yema"), ("1f353", "frutas"), ("1f378", "cócteles")], "SABORES NUEVOS")
    E["tu_clasico"] = f'''{F("navidad", True)}<div class="pos" style="left:27%;top:50%">{tableta("blando", 680)}</div>{txt(kt("EL DE *TODA LA VIDA*", "xl hueso", .6), 73, 46, 44)}'''
    E["leccion1"] = leccion(1, "proteger el origen", "*ES PROTEGERSE DE LAS COPIAS*", "1f6e1-fe0f")
    E["leccion2"] = leccion(2, "el mejor anuncio", "*HABLA DE LO QUE SIENTES*", "2764-fe0f")
    E["leccion3"] = leccion(3, "si tu negocio es estacional,", "*PREPÁRATE CON TIEMPO*", "2600-fe0f")
    E["tu_final"] = lista([("1f330", "almendras y miel"), ("1f40e", "turroneros viajeros"), ("1f3ea", "una tienda de 1855"), ("1f3e0", "un anuncio")], "")
    E["tu_tableta"] = f'''{F("navidad", True)}<div class="pos" style="left:27%;top:50%">{tableta("duro", 680)}</div>{txt(kt("YA SABES *LO QUE LLEVA DENTRO*", "xl hueso", .6), 73, 46, 44)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:40px;top:250px;transform:rotate(-8deg)">{tableta("blando", 430, None)}</div>
      <div style="position:absolute;left:90px;top:420px;transform:rotate(5deg)">{tableta("duro", 400, None)}</div>
      <div style="position:absolute;left:330px;top:120px">{vicon("house", 150)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">VUELVE A CASA</div><div class="q" style="font-size:170px;margin-top:22px">POR NAVIDAD</div><div class="y">LA HISTORIA DEL TURRÓN</div></div>'''
