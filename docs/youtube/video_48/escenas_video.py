"""Escenas del vídeo 48 (especial Navidad: el árbol de Navidad artificial). Motor común; sin logotipos ni personajes con derechos."""
from base import *

CAP_ICONOS = {1: "1f1e9-1f1ea", 2: "1f1ea-1f1f8", 3: "1fab6", 4: "1faa5", 5: "1fa9e", 6: "1f4fa", 7: "1f4e6", 8: "1f30d", 9: "1f9e0"}

def arbol_plata(px=300, d=.2):
    capas = "".join(f'<path d="M{100 - 18 - i*14},{30 + i*34} L100,{i*34} L{100 + 18 + i*14},{30 + i*34}Z" fill="url(#plata)" stroke="#9aa3ad" stroke-width="2"/>' for i in range(5))
    return (f'<svg width="{px}" height="{px*1.1:.0f}" viewBox="0 0 200 220" style="animation:ePop .5s ease {d}s both"><defs><linearGradient id="plata" x1="0" x2="1">'
            f'<stop offset="0" stop-color="#eef2f6"/><stop offset=".5" stop-color="#b9c2cc"/><stop offset="1" stop-color="#f7f9fb"/></linearGradient></defs>{capas}'
            f'<rect x="94" y="196" width="12" height="22" fill="#8a929b"/></svg>')

def rueda(px=220, d=.4):
    return (f'<div class="pos" style="width:{px}px;height:{px}px;border-radius:50%;border:8px solid {TINTA};animation:ePop .4s ease {d}s both,girar 6s linear infinite;'
            f'background:conic-gradient(#D7263D 0 25%,#2BB673 0 50%,#2E86DE 0 75%,#F5B700 0)"></div>')

def escenas():
    E = {}
    E["ar_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f381", "2744-fe0f", "2b50"), "navidad", True, "mega")
    E["ar_caja"] = icono_texto("1f4e6", "UNA CAJA *DEL ALTILLO*", "millones de familias, cada diciembre", "", "izq", "calido", True, "drop", "bob", 380, (("1f384", 84, 24),))
    E["ar_plastico"] = lista([("1f331", "no crece"), ("1f342", "no se seca"), ("1f9f9", "no suelta hojas")], "UN ÁRBOL QUE…")
    E["ar_viaje"] = lista([("1fab6", "plumas de ganso"), ("1faa5", "una fábrica de cepillos"), ("1fa9e", "aluminio brillante"), ("1f4fa", "un dibujo animado")], "CASI DOS SIGLOS DE HISTORIA")
    E["ar_historia"] = titular("EL ÁRBOL DE NAVIDAD *ARTIFICIAL*", "la historia completa", "", ("1f384", "1fab6", "1faa5", "1f4e6"), "navidad", True, "xl")
    E["ar_alemania"] = icono_texto("1f332", "UN ABETO *DECORADO*", "una costumbre nacida en Alemania, hace siglos", "", "izq", "navidad", True, "pop", "bob", 380, (("1f1e9-1f1ea", 84, 20),))
    E["ar_adornos"] = lista([("1f34e", "manzanas"), ("1f330", "nueces"), ("1f36a", "galletas"), ("1f56f-fe0f", "velas")], "LOS PRIMEROS ADORNOS")
    E["ar_1848"] = cifra("1848", "UN GRABADO DE LA REINA VICTORIA JUNTO AL ÁRBOL", "1f451")
    E["ar_moda"] = flecha("1f1ec-1f1e7", "1f1fa-1f1f8", "EL ÁRBOL *SE PONE DE MODA*", "copiado e imitado por todas partes")
    E["ar_problema"] = impacto("y con la moda, un problema:", "HACÍAN FALTA *MUCHÍSIMOS ÁRBOLES*", "", "1fa93")
    E["ar_espana"] = comparar("1f6d6", "la tradición de siempre: el belén", "1f384", "el árbol llegó mucho más tarde", "Y")
    E["ar_1870"] = cifra("HACIA 1870", "EL PRIMER ÁRBOL DE NAVIDAD DE ESPAÑA, EN MADRID", "1f384", "según la versión más extendida")
    E["ar_princesa"] = icono_texto("1f478", "SOFÍA *TROUBETZKOY*", "en el palacio de Alcañices, que ya no existe", "una princesa de origen ruso", "der", "sepia", False, "pop", "bob", 380, (("1f3db-fe0f", 86, 78),))
    E["ar_aristocracia"] = lista([("1f3f0", "casas aristocráticas"), ("1f30d", "familias extranjeras")], "DURANTE MUCHO TIEMPO, COSA DE…")
    E["ar_belen"] = comparar("1f384", "el árbol", "1f6d6", "el belén", "+", "NO LO SUSTITUYÓ: SE QUEDÓ A SU LADO")
    E["ar_conviven"] = titular("CONVIVEN *LOS DOS*", "y muchas veces, el árbol sale de una caja", "", ("1f384", "1f6d6", "1f4e6", "2728"), "navidad", True, "xl")
    E["ar_bosques"] = icono_texto("1f332", "LOS BOSQUES *SE RESENTÍAN*", "demasiados abetos cortados cada invierno", "Alemania", "izq", "", False, "pop", "", 380, (("1fa93", 84, 76),))
    E["ar_plumas"] = impacto("una solución curiosa:", "ÁRBOLES *DE PLUMAS*", "siglo XIX", "1fab6")
    E["ar_ganso"] = lista([("1fab6", "plumas de ganso, teñidas de verde"), ("1fa9d", "enrolladas en alambres"), ("1fab5", "un palo de madera de tronco")], "CÓMO SE HACÍAN")
    E["ar_velas"] = icono_texto("1f56f-fe0f", "RAMAS *MUY SEPARADAS*", "para que cupieran las velas sin quemar nada", "", "der", "calido", True, "pop", "glow")
    E["ar_catalogo"] = flecha("1f1e9-1f1ea", "1f4d6", "DE ALEMANIA *AL CATÁLOGO*", "los emigrantes los llevaron a EE. UU.")
    E["ar_coleccion"] = icono_texto("1f50e", "PIEZAS *DE COLECCIONISTA*", "y todavía se fabrican réplicas", "los primeros árboles artificiales", "izq", "sepia", False, "pop", "bob")
    E["ar_addis"] = icono_texto("1faa5", "ADDIS: *CEPILLOS*", "una empresa británica sin nada que ver con la Navidad", "", "izq", "", False, "pop", "bob", 380, (("1f1ec-1f1e7", 84, 20),))
    E["ar_dientes"] = cifra("SIGLO XVIII", "WILLIAM ADDIS: UNO DE LOS PRIMEROS CEPILLOS DE DIENTES EN SERIE", "1faa5", "según su propia historia")
    E["ar_cerdas"] = flecha("1faa5", "1f332", "CERDAS VERDES = *UNA RAMA DE ABETO*", "cerdas retorcidas sobre un alambre")
    E["ar_anos30"] = cifra("AÑOS 30", "LA MODA DE LOS ÁRBOLES DE CEPILLO", "1f384")
    E["ar_vater"] = comparar("1f6bd", "¿las mismas máquinas que los del váter?", "1f6ab", "la familia lo desmintió, según se cuenta", "→", "UNA HISTORIA MUY REPETIDA")
    E["ar_hoy"] = titular("LA MISMA TÉCNICA *HOY*", "cerdas retorcidas sobre alambre", "", ("1faa5", "1f384", "1f4e6", "2728"))
    E["ar_extravagante"] = impacto("y entonces llegó la época", "MÁS *EXTRAVAGANTE*", "", "1f929")
    E["ar_1958"] = f'''{F("dark", True)}<div style="position:absolute;left:16%;top:22%">{arbol_plata(380)}</div>{txt(kt("1958: ÁRBOLES *DE ALUMINIO*", "xl hueso", .8), 68, 42, 56)}{txt(kt("brillantes como espejos", "l naranja", 1.4), 68, 58, 56)}'''
    E["ar_evergleam"] = icono_texto("1f3ed", "ALUMINUM SPECIALTY: *EVERGLEAM*", "de una pequeña ciudad de Wisconsin", "la empresa que los hizo famosos", "der", "", False, "pop", "bob")
    E["ar_espacial"] = icono_texto("1f680", "LA NAVIDAD DE *LA ERA ESPACIAL*", "modernos y futuristas", "", "izq", "espacio", True, "pop", "float")
    E["ar_luces"] = comparar("1f4a1", "luces eléctricas", "26a1", "riesgo de descarga y cortocircuito", "NO", "EL ALUMINIO CONDUCE")
    E["ar_rueda"] = f'''{F("dark", True)}<div style="position:absolute;left:10%;top:20%">{arbol_plata(330)}</div><div style="position:absolute;left:36%;top:52%">{rueda(200, .8)}</div>{txt(kt("LA RUEDA *DE COLORES*", "xl hueso", .8), 74, 42, 46)}{txt(kt("rojo, verde, azul y amarillo", "l naranja", 1.4), 74, 58, 46)}'''
    E["ar_revistas"] = lista([("1f3ec", "grandes almacenes"), ("1f4f0", "revistas de decoración"), ("1f48e", "símbolo de estatus")], "ESTABAN EN TODAS PARTES")
    E["ar_millones"] = cifra("MILLONES", "DE HOGARES DE EE. UU. TUVIERON UNO", "1f3e0")
    E["ar_apaga"] = impacto("y de repente…", "LA MODA *SE APAGÓ*", "", "1f4a1")
    E["ar_1965"] = cifra("1965", "UN ESPECIAL DE DIBUJOS ANIMADOS EN LA TELE", "1f4fa")
    E["ar_arbolito"] = comparar("1fa9e", "aluminio brillante", "1f331", "un arbolito de verdad, casi sin hojas", "VS", "EL PROTAGONISTA ELIGE")
    E["ar_simbolo"] = icono_texto("1f6cd-fe0f", "¿UNA NAVIDAD *FALSA Y CONSUMISTA*?", "así empezó a ver mucha gente el aluminio", "según se cuenta", "der", "", False, "pop", "")
    E["ar_complicada"] = lista([("1f971", "la moda ya cansaba"), ("1f4c9", "las ventas cayeron"), ("1f3ed", "la fábrica cerró la línea")], "LA REALIDAD, MÁS COMPLICADA")
    E["ar_vintage"] = icono_texto("1f4b0", "HOY, *DE COLECCIONISTA*", "algunos alcanzan precios muy altos", "", "izq", "calido", True, "pop", "bob", 380, (("1fa9e", 84, 24),))
    E["ar_plastico2"] = impacto("el relevo:", "EL *PLÁSTICO*", "más barato y versátil", "1f4e6")
    E["ar_pvc"] = cifra("AÑOS 60 Y 70", "ÁRBOLES DE PVC: AGUJAS DE PLÁSTICO VERDE", "1f384")
    E["ar_ventajas"] = icono_texto("1f4e6", "DE LA CAJA *AL SALÓN*", "un mismo árbol, muchas Navidades", "", "der", "", False, "pop", "bob")
    E["ar_montar"] = lista([("1f527", "fácil de montar"), ("1f9f9", "sin agujas secas en enero")], "Y ADEMÁS…")
    E["ar_mejoras"] = lista([("1f504", "ramas que se despliegan"), ("1f4a1", "luces incorporadas"), ("2744-fe0f", "puntas nevadas"), ("1f332", "especies concretas")], "CADA VEZ MÁS PERFECTOS")
    E["ar_china"] = icono_texto("1f6a2", "FABRICADOS *EN CHINA*", "la gran mayoría de los árboles artificiales del mundo", "hoy", "izq", "", False, "pop", "bob", 380, (("1f1e8-1f1f3", 84, 20),))
    E["ar_global"] = flecha("1f332", "1f30d", "DE SALVAR BOSQUES *A INDUSTRIA GLOBAL*", "")
    E["ar_pregunta"] = comparar("1f332", "natural", "1f384", "artificial", "¿?", "¿QUÉ ES MEJOR PARA EL PLANETA?")
    E["ar_obvia"] = impacto("la respuesta", "NO ES *TAN OBVIA*", "", "1f914")
    E["ar_huella"] = lista([("1f3ed", "plástico y metal"), ("1f6a2", "miles de kilómetros en barco"), ("1f463", "una huella importante")], "EL ARTIFICIAL")
    E["ar_vertedero"] = icono_texto("1f5d1-fe0f", "CASI NUNCA *SE RECICLA*", "mezcla plásticos y metal", "al final de su vida", "der", "dark", False, "pop", "")
    E["ar_natural"] = lista([("1f331", "se planta otro"), ("1f343", "absorbe carbono"), ("267b-fe0f", "abono o astillas")], "EL NATURAL")
    E["ar_anos"] = icono_texto("1f4c5", "SOLO COMPENSA *SI DURA MUCHOS AÑOS*", "si lo cambias cada poco, sale peor", "según varios estudios", "izq", "", True, "pop", "bob")
    E["ar_cuidarlo"] = titular("SI YA TIENES UNO, *CUÍDALO*", "y úsalo todo lo posible", "", ("1f384", "2764-fe0f", "267b-fe0f", "1f4e6"), "navidad", True, "xl")
    E["leccion1"] = leccion(1, "muchos inventos nacen de", "*REAPROVECHAR LO QUE TIENES*", "1faa5")
    E["leccion2"] = leccion(2, "un producto puede pasar de moda", "*POR ALGO QUE NO CONTROLA*", "1f4fa")
    E["leccion3"] = leccion(3, "lo pasado de moda, mañana", "*PUEDE SER DE COLECCIONISTA*", "1fa9e")
    E["ar_final"] = lista([("1fab6", "plumas de ganso"), ("1faa5", "cerdas de cepillo"), ("1fa9e", "aluminio plateado"), ("1f4e6", "plástico verde")], "")
    E["ar_dossiglos"] = f'''{F("navidad", True)}{obj(spr("1f384", 320), 30, 50, "drop", "bob", .2)}{txt(kt("CASI *DOS SIGLOS* DE HISTORIA", "xl hueso", .9), 70, 42, 52)}{txt(kt("en esa caja del altillo", "l naranja", 1.4), 70, 58, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:60px;top:150px">{vicon("christmas-tree", 420)}</div>
      <div style="position:absolute;left:330px;top:400px;transform:rotate(-20deg)">{vicon("toothbrush", 200)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">UNA FÁBRICA</div><div class="q" style="font-size:170px;margin-top:22px">DE CEPILLOS</div><div class="y">EL ÁRBOL ARTIFICIAL</div></div>'''
