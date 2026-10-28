"""Escenas del vídeo 55 (especial Navidad: el cava, Codorníu y Freixenet). Motor común; sin logotipos ni etiquetas reales: botellas genéricas."""
from base import *

CAP_ICONOS = {1: "1f4dc", 2: "1f41b", 3: "26ea", 4: "1f3e1", 5: "1f37e", 6: "1f4fa", 7: "1f1eb-1f1f7", 8: "1f30d", 9: "1f9e0"}

def botella(color="#1f5a3a", w=150, d=.2, esmerilada=False):
    """Botella de espumoso genérica, sin etiqueta de marca."""
    an = "" if d is None else f"animation:ePop .5s ease {d}s both;"
    vidrio = "url(#esm)" if esmerilada else color
    return (f'<svg width="{w}" height="{w*2.6:.0f}" viewBox="0 0 100 260" style="{an}"><defs><linearGradient id="esm" x1="0" x2="1"><stop offset="0" stop-color="#e9eef2"/>'
            f'<stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e1e7"/></linearGradient></defs>'
            f'<path d="M40,8 L60,8 L60,70 Q86,92 86,130 L86,248 Q86,256 78,256 L22,256 Q14,256 14,248 L14,130 Q14,92 40,70Z" fill="{vidrio}" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M38,4 L62,4 L62,48 L38,48Z" fill="#d6b24a" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="22" y="150" width="56" height="54" rx="4" fill="#f5efe0" stroke="{TINTA}" stroke-width="3"/>'
            f'<path d="M30,166 L70,166 M30,178 L70,178 M30,190 L58,190" stroke="#b9a77a" stroke-width="3"/></svg>')

def burbujas(n=26, semilla=3):
    import random
    r = random.Random(semilla)
    return "".join(f'<div style="position:absolute;left:{r.uniform(2, 98):.1f}%;top:{r.uniform(5, 95):.1f}%;width:{(s := r.randint(10, 34))}px;height:{s}px;border-radius:50%;'
                   f'border:3px solid rgba(255,214,120,.8);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.8),rgba(255,214,120,.25));animation:lFloat {r.uniform(3, 6):.1f}s ease-in-out infinite"></div>' for _ in range(n))

def escenas():
    E = {}
    E["ca_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f37e", "2744-fe0f", "1f942"), "navidad", True, "mega")
    E["ca_nochevieja"] = lista([("1f514", "las campanadas"), ("1f347", "las uvas"), ("1f37e", "el descorche")], "NOCHEVIEJA")
    E["ca_brindis"] = f'''{F("navidad", True)}{burbujas()}{obj(spr("1f942", 320), 30, 52, "pop", "swing", .2)}{txt(kt("UN BRINDIS *CON CAVA*", "xl hueso", .6), 70, 46, 52)}'''
    E["ca_familias"] = comparar("1f46a", "los Raventós (Codorníu)", "1f46a", "los Ferrer (Freixenet)", "VS", "MÁS DE UN SIGLO COMPITIENDO")
    E["ca_resumen"] = lista([("1f41b", "plagas"), ("1f37e", "botellas de colores"), ("1f3ac", "estrellas de cine"), ("1f4b0", "fondos extranjeros")], "UNA HISTORIA DE…")
    E["ca_historia"] = titular("LA HISTORIA *DEL CAVA*", "", "", ("1f37e", "1f347", "1f942", "2728"), "navidad", True, "xl")
    E["ca_santsadurni"] = icono_texto("1f347", "SANT SADURNÍ *D'ANOIA*", "un pueblo del Penedès rodeado de viñedos", "Barcelona", "izq", "calido", True, "pop", "bob")
    E["ca_1551"] = cifra("1551", "JAUME CODORNÍU, SEGÚN LA PROPIA EMPRESA", "1f4dc")
    E["ca_raventos"] = comparar("1f469", "una heredera Codorníu", "1f468", "un Raventós", "+", "SIGLO XVII: UNA BODA")
    E["ca_tranquilo"] = lista([("1f347", "macabeo"), ("1f347", "xarel·lo"), ("1f347", "parellada")], "VINO SIN BURBUJAS, CON UVAS DE LA ZONA")
    E["ca_plaga"] = impacto("lo que estaba por llegar", "LLEGÓ CON *UNA PLAGA*", "", "1f41b")
    E["ca_filoxera"] = icono_texto("1f41b", "LA *FILOXERA*", "un insecto diminuto arrasa los viñedos de Europa", "finales del siglo XIX", "izq", "dark", False, "pop", "shake")
    E["ca_raices"] = flecha("1f1eb-1f1f7", "1f347", "DE FRANCIA *A CATALUÑA*", "atacaba las raíces y mataba las vides")
    E["ca_rumbo"] = icono_texto("1f504", "ARRANCAR *Y CAMBIAR DE RUMBO*", "muchos viticultores tuvieron que empezar de cero", "", "der", "", False, "pop", "spin-slow")
    E["ca_1872"] = cifra("1872", "JOSEP RAVENTÓS: LOS PRIMEROS ESPUMOSOS CON EL MÉTODO TRADICIONAL", "1f37e")
    E["ca_metodo"] = f'''{F()}<div style="position:absolute;left:12%;top:16%">{botella("#1f5a3a", 230, .2)}</div>{burbujas(14, 9)}{txt(kt("SEGUNDA FERMENTACIÓN *EN LA BOTELLA*", "xl", .6), 66, 36, 56)}{txt(kt("el gas se queda dentro… y luego se giran boca abajo", "l naranja", 1.3), 66, 52, 56)}'''
    E["ca_lento"] = comparar("23f3", "lento y caro, meses en bodega", "2b50", "un espumoso de calidad, hecho en España", "→", "")
    E["ca_bodegas"] = icono_texto("1f311", "BODEGAS *ENORMES*", "frescas y oscuras, para criar durante meses", "", "izq", "dark", False, "pop", "")
    E["ca_puig"] = icono_texto("1f3db-fe0f", "JOSEP *PUIG I CADAFALCH*", "uno de los grandes arquitectos del modernismo", "las nuevas bodegas de Codorníu", "der", "sepia", False, "pop", "bob")
    E["ca_catedral"] = lista([("26ea", "parece una catedral"), ("1f9f1", "arcos y ladrillo"), ("1f37e", "millones de botellas bajo tierra")], "UNA CATEDRAL DEL CAVA")
    E["ca_monumento"] = icono_texto("1f3db-fe0f", "MONUMENTO *HISTÓRICO-ARTÍSTICO*", "y visitas de todo el mundo", "", "izq", "calido", True, "pop", "bob")
    E["ca_rodea"] = comparar("1f445", "su sabor", "2728", "todo lo que lo rodea", "+", "EL ESPUMOSO SE VENDE POR…")
    E["ca_sala"] = cifra("1861", "LOS SALA, EN EL MISMO PUEBLO", "1f3e1", "mientras tanto…")
    E["ca_boda"] = comparar("1f470", "Dolors Sala", "1f935", "Pere Ferrer", "+", "PRINCIPIOS DEL SIGLO XX")
    E["ca_nombre"] = flecha("1f3e1", "1f37e", "LA FREIXENEDA → *FREIXENET*", "la finca de los Ferrer dio nombre a la marca")
    E["ca_1914"] = cifra("HACIA 1914", "LOS PRIMEROS ESPUMOSOS DE LA CASA", "1f37e", "según la historia de la empresa")
    E["ca_guerra"] = icono_texto("1f494", "LA GUERRA CIVIL *LOS GOLPEA*", "perdieron la empresa y la recuperaron después, con Dolors Sala al frente", "", "der", "dark", False, "pop", "")
    E["ca_rivalidad"] = f'''{F("navidad", True)}<div style="position:absolute;left:14%;top:14%">{botella("#1f5a3a", 210, .2)}</div><div style="position:absolute;left:72%;top:14%">{botella("#2b2b2b", 210, .5)}</div>{txt(kt("DOS CASAS, *EL MISMO BRINDIS*", "xl hueso", .8), 50, 46, 44)}{txt(kt("a pocos kilómetros", "l naranja", 1.4), 50, 60, 40)}'''
    E["ca_idea"] = impacto("una idea muy inteligente:", "UNA BOTELLA *QUE SE VE DESDE LEJOS*", "", "1f440")
    E["ca_1941"] = f'''{F("dark", True)}<div style="position:absolute;left:16%;top:12%">{botella("#fff", 250, .2, True)}</div>{txt(kt("1941: *VIDRIO ESMERILADO*", "xl hueso", .6), 66, 40, 56)}{txt(kt("blanca, como cubierta de escarcha", "l naranja", 1.3), 66, 56, 56)}'''
    E["ca_1974"] = f'''{F()}<div style="position:absolute;left:16%;top:12%">{botella("#1d1d1d", 250, .2)}</div>{txt(kt("1974: *UNA BOTELLA NEGRA*", "xl", .6), 66, 40, 56)}{txt(kt("mate y elegante: su producto estrella", "l naranja", 1.3), 66, 56, 56)}'''
    E["ca_eeuu"] = icono_texto("1f1fa-1f1f8", "A CONQUISTAR *ESTADOS UNIDOS*", "una alternativa más barata al champán francés", "", "der", "", False, "pop", "bob")
    E["ca_100m"] = cifra("100 MILLONES", "DE BOTELLAS VENDIDAS EN 2021, SEGÚN FREIXENET", "1f37e")
    E["ca_anuncios"] = impacto("la batalla de España se libraba en", "LOS ANUNCIOS *DE NAVIDAD*", "", "1f4fa")
    E["ca_estrellas"] = lista([("1f3ac", "cine"), ("1f3a4", "música"), ("26bd", "deporte")], "ESTRELLAS INTERNACIONALES CADA AÑO")
    E["ca_burbujas"] = f'''{F("navidad", True)}{burbujas(40, 5)}{obj(spr("1f483", 260), 30, 52, "pop", "swing", .2)}{txt(kt("LAS BURBUJAS *DORADAS*", "xl hueso", .6), 68, 46, 54)}'''
    E["ca_codorniu"] = icono_texto("1f3ac", "CODORNÍU *TAMPOCO SE QUEDABA ATRÁS*", "sus propias campañas y sus propios famosos", "", "izq", "", False, "pop", "bob")
    E["ca_mesa"] = lista([("1f319", "Nochebuena"), ("1f384", "Navidad"), ("1f386", "Nochevieja")], "ESTAR EN LA MESA EN…")
    E["ca_diciembre"] = cifra("DICIEMBRE", "UNA PARTE ENORME DE LAS VENTAS DEL AÑO", "1f4c5")
    E["ca_champan"] = bocadillos("1f9d4", ["¿Abrimos el champán?", "…en España, así se decía"], "durante mucho tiempo")
    E["ca_francia"] = icono_texto("1f1eb-1f1f7", "CHAMPÁN = *UNA REGIÓN FRANCESA*", "solo el vino de Champaña puede llamarse así", "", "der", "", False, "pop", "")
    E["ca_nombre_cava"] = f'''{F("navidad", True)}{txt(kt("*CAVA*", "mega hueso", .3), 50, 40, 90)}{txt(kt("en catalán, «bodega»", "l naranja", 1.2), 50, 60, 80)}'''
    E["ca_reglas"] = icono_texto("1f4cb", "UNA DENOMINACIÓN *CON REGLAS*", "por ejemplo, un tiempo mínimo de crianza en botella", "", "izq", "", True, "pop", "bob")
    E["ca_guerra_cava"] = comparar("1f3ed", "bodegas grandes", "1f3e1", "bodegas pequeñas", "VS", "LA «GUERRA DEL CAVA»: ¿SE RESPETA LA CRIANZA?")
    E["ca_enfrentados"] = comparar("1f37e", "Codorníu", "1f37e", "Freixenet", "VS", "PRECIOS Y LIDERAZGO, AÑO TRAS AÑO")
    E["ca_final_parecido"] = impacto("el final es muy parecido", "PARA LAS *DOS FAMILIAS*", "", "1f914")
    E["ca_carlyle"] = icono_texto("1f1fa-1f1f8", "CARLYLE COMPRA *LA MAYORÍA DE CODORNÍU*", "tras años de desacuerdos en la familia Raventós", "2018", "izq", "dark", False, "pop", "")
    E["ca_henkell"] = icono_texto("1f1e9-1f1ea", "FREIXENET, *BAJO CONTROL DE HENKELL*", "empresa alemana del grupo Dr. Oetker", "2018", "der", "dark", False, "pop", "")
    E["ca_meses"] = titular("DE FAMILIARES *A CAPITAL EXTRANJERO*", "el final de una época", "", ("1f46a", "27a1-fe0f", "1f30d", "1f37e"))
    E["ca_lejos"] = comparar("1f37e", "las botellas: Sant Sadurní", "1f30d", "las decisiones: lejos", "PERO", "")
    E["leccion1"] = leccion(1, "una crisis puede ser el empujón", "*PARA CAMBIAR DE PRODUCTO*", "1f41b")
    E["leccion2"] = leccion(2, "el envase", "*TAMBIÉN ES MARCA*", "1f37e")
    E["leccion3"] = leccion(3, "en la empresa familiar, el mayor riesgo", "*PUEDE ESTAR DENTRO*", "1f46a")
    E["ca_final"] = lista([("1f41b", "una plaga"), ("1f37e", "una segunda fermentación"), ("26ea", "una catedral"), ("2728", "burbujas doradas")], "")
    E["ca_copa"] = f'''{F("navidad", True)}{burbujas(30, 11)}{obj(spr("1f942", 300), 30, 52, "pop", "swing", .2)}{txt(kt("CUÁNTA HISTORIA *CABE EN UNA COPA*", "xl hueso", .6), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(30)}{burbujas(18, 4)}
      <div style="position:absolute;left:70px;top:160px;transform:rotate(-12deg)">{botella("#fff", 190, None, True)}</div>
      <div style="position:absolute;left:300px;top:160px;transform:rotate(12deg)">{botella("#1d1d1d", 190, None)}</div>
      <div style="position:absolute;left:235px;top:330px;font-family:Bebas;font-size:110px;color:#D7263D;text-shadow:4px 4px 0 #111">VS</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">DOS FAMILIAS</div><div class="q" style="font-size:150px;margin-top:22px">Y UN BRINDIS</div><div class="y">LA GUERRA DEL CAVA</div></div>'''
