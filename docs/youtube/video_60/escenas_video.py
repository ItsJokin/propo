"""Escenas del vídeo 60 (especial Navidad: las uvas de la suerte). Motor común; sin logotipos: reloj, uvas y bolsas genéricas."""
from base import *

CAP_ICONOS = {1: "1f602", 2: "1f33e", 3: "1f6cd-fe0f", 4: "1f347", 5: "1f570-fe0f", 6: "1f52a", 7: "1f30e", 8: "1f9e0"}

def reloj(w=360, d=.2):
    """Torre con reloj genérica y bola dorada."""
    an = "" if d is None else f"animation:eUp .6s ease {d}s both;"
    marcas = "".join(f'<line x1="{100 + 52*__import__("math").cos(i*0.5236):.1f}" y1="{120 + 52*__import__("math").sin(i*0.5236):.1f}" x2="{100 + 60*__import__("math").cos(i*0.5236):.1f}" y2="{120 + 60*__import__("math").sin(i*0.5236):.1f}" stroke="{TINTA}" stroke-width="4"/>' for i in range(12))
    return (f'<svg width="{w}" height="{w*1.3:.0f}" viewBox="0 0 200 260" style="{an}"><rect x="40" y="40" width="120" height="220" fill="#e8dcc6" stroke="{TINTA}" stroke-width="5"/>'
            f'<path d="M30,44 L100,8 L170,44Z" fill="#7a4b2a" stroke="{TINTA}" stroke-width="5"/><line x1="100" y1="8" x2="100" y2="-20" stroke="{TINTA}" stroke-width="4"/>'
            f'<circle cx="100" cy="-6" r="12" fill="#f2c94c" stroke="{TINTA}" stroke-width="3"/>'
            f'<circle cx="100" cy="120" r="64" fill="#fff" stroke="{TINTA}" stroke-width="6"/>{marcas}'
            f'<line x1="100" y1="120" x2="100" y2="70" stroke="{TINTA}" stroke-width="6" stroke-linecap="round"/><line x1="100" y1="120" x2="100" y2="80" stroke="#D7263D" stroke-width="4" stroke-linecap="round"/>'
            f'<circle cx="100" cy="120" r="6" fill="{TINTA}"/></svg>').replace('viewBox="0 0 200 260"', 'viewBox="0 -30 200 290"')

def doce(px=90, y=74, d=.3):
    return "".join(obj(spr("1f347", px), 8 + i * 7.6, y + (i % 2) * 3, "pop", "bob", d + i * .12) for i in range(12))

def bolsas(n=7, d=.2):
    return "".join(f'<div class="pos" style="left:{10 + i * 13}%;top:{58 + (i % 2) * 6}%;width:170px;height:210px;background:#f3ead7;border:4px solid {TINTA};border-radius:10px 10px 40px 40px;'
                   f'box-shadow:0 10px 20px rgba(0,0,0,.2);animation:ePop .4s ease {d + i*.12:.2f}s both"></div>' for i in range(n))

def escenas():
    E = {}
    E["uv_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras · último capítulo", "bienvenido al", ("1f384", "1f347", "2744-fe0f", "1f386"), "navidad", True, "mega")
    E["uv_reloj"] = f'''{F("espacio", True)}<div class="pos" style="left:24%;top:56%">{reloj(500)}</div>{txt(kt("31 DE DICIEMBRE, *A PUNTO DE DAR LAS DOCE*", "xl hueso", .6), 68, 42, 56)}{txt(kt("doce uvas en la mano", "l naranja", 1.3), 68, 58, 56)}'''
    E["uv_campanadas"] = lista([("1f570-fe0f", "primero, los cuartos"), ("1f514", "luego, las campanadas"), ("1f347", "una uva por cada una")], "EL RITUAL")
    E["uv_pregunta"] = comparar("1f914", "¿quién la inventó?", "2744-fe0f", "¿uvas en diciembre?", "Y", "UNA DE LAS TRADICIONES MÁS ESPAÑOLAS")
    E["uv_respuesta"] = lista([("1f602", "una burla"), ("1f9d1-200d-1f33e", "unos agricultores de Alicante"), ("1f6cd-fe0f", "unas bolsas de papel")], "LA RESPUESTA TIENE QUE VER CON…")
    E["uv_historia"] = titular("LA HISTORIA DE *LAS UVAS DE LA SUERTE*", "", "", ("1f347", "1f570-fe0f", "1f6cd-fe0f", "1f386"), "navidad", True, "xl")
    E["uv_madrid"] = icono_texto("1f3db-fe0f", "LA *PUERTA DEL SOL*", "el centro de Madrid, con su reloj desde 1866", "finales del siglo XIX", "izq", "sepia", False, "pop", "bob")
    E["uv_francia"] = comparar("1f347", "uvas", "1f37e", "champán", "+", "LA MODA DE LA BURGUESÍA")
    E["uv_burla"] = icono_texto("1f602", "UNA BURLA *EN PLENA CALLE*", "comiendo uvas al ritmo de las campanadas", "según se cuenta", "der", "calido", True, "pop", "shake")
    E["uv_1882"] = cifra("1882", "LOS PERIÓDICOS YA HABLAN DE COMER UVAS EN NOCHEVIEJA", "1f4f0")
    E["uv_broma"] = impacto("pero era algo pequeño,", "CASI *UNA BROMA*", "", "1f609")
    E["uv_1909"] = cifra("1909", "SEGÚN LA VERSIÓN MÁS EXTENDIDA", "1f347")
    E["uv_cosecha"] = icono_texto("1f347", "UNA COSECHA *ENORME*", "más uvas de las que podían vender", "Alicante", "izq", "calido", True, "pop", "bob")
    E["uv_suerte"] = f'''{F("navidad", True)}{doce(100, 70)}{txt(kt("«UVAS *DE LA SUERTE*»", "xl hueso", .4), 50, 24, 90)}{txt(kt("una por cada mes del año", "l naranja", 1.2), 50, 38, 80)}'''
    E["uv_extiende"] = flecha("1f4f0", "1f1ea-1f1f8", "DE LA PRENSA *A TODA ESPAÑA*", "en pocos años, casi obligatorio")
    E["uv_discuten"] = icono_texto("1f9d0", "LOS HISTORIADORES *LO DISCUTEN*", "pero el excedente ayudó a extenderla", "", "der", "", False, "pop", "")
    E["uv_marketing"] = titular("UNA TRADICIÓN *PARA VENDER FRUTA QUE SOBRABA*", "al menos en parte", "", ("1f347", "1f4b0", "1f340", "2728"))
    E["uv_diciembre"] = impacto("¿uvas frescas", "*A FINALES DE DICIEMBRE*?", "si la vendimia termina en otoño…", "1f914")
    E["uv_vinalopo"] = icono_texto("1f3de-fe0f", "EL VALLE *DEL VINALOPÓ*", "la uva de mesa embolsada", "Alicante", "izq", "calido", True, "pop", "bob")
    E["uv_bolsas"] = f'''{F("calido", True)}{bolsas(7)}{txt(kt("CADA RACIMO, *EN UNA BOLSA DE PAPEL*", "xl", .6), 50, 22, 90)}{txt(kt("uno a uno, en la cepa, en verano", "l naranja", 1.3), 50, 34, 80)}'''
    E["uv_protege"] = lista([("1f426", "pájaros"), ("1f41b", "insectos"), ("26c8-fe0f", "mal tiempo"), ("23f3", "y retrasa la maduración")], "LA BOLSA PROTEGE DE…")
    E["uv_novelda"] = cifra("NOVELDA", "PRINCIPIOS DEL SIGLO XX, SEGÚN SE CUENTA", "1f6cd-fe0f")
    E["uv_aledo"] = icono_texto("1f347", "DENOMINACIÓN DE ORIGEN · *ALEDO*", "la variedad más comida en Nochevieja", "", "der", "navidad", True, "pop", "bob")
    E["uv_imagina"] = impacto("imagina el trabajo:", "MILLONES DE RACIMOS, *A MANO*", "en verano, bajo el sol", "270b")
    E["uv_farolillos"] = f'''{F("calido", True)}{bolsas(7, .1)}{txt(kt("CAMPOS LLENOS DE *FAROLILLOS DE PAPEL*", "xl", .6), 50, 22, 90)}{txt(kt("Novelda, Monforte del Cid, Aspe, Agost…", "l naranja", 1.3), 50, 34, 80)}'''
    E["uv_cosecha2"] = lista([("2744-fe0f", "se cosechan en invierno"), ("1f50e", "se seleccionan"), ("1f69a", "a toda España")], "")
    E["uv_millones"] = cifra("DECENAS DE MILLONES", "DE KILOS EN UNA BUENA CAMPAÑA, SEGÚN LA PRENSA", "2696-fe0f")
    E["uv_comarca"] = titular("12 SEGUNDOS *SOSTIENEN UNA COMARCA*", "", "", ("1f347", "1f570-fe0f", "1f3d8-fe0f", "2728"), "navidad", True, "xl")
    E["uv_otro"] = impacto("el otro protagonista:", "EL *RELOJ*", "", "1f570-fe0f")
    E["uv_1866"] = f'''{F("sepia", True)}<div class="pos" style="left:24%;top:56%">{reloj(500)}</div>{txt(kt("1866: *UN REGALO A LA CIUDAD*", "xl", .6), 68, 42, 56)}{txt(kt("del relojero José Rodríguez de Losada", "l naranja", 1.3), 68, 58, 56)}'''
    E["uv_correos"] = icono_texto("1f3db-fe0f", "LA REAL *CASA DE CORREOS*", "hoy, sede de la presidencia de la Comunidad de Madrid", "", "izq", "", False, "pop", "bob")
    E["uv_cuartos"] = comparar("1f7e1", "baja la bola y suenan los cuartos", "1f605", "¡alguien empieza antes de tiempo!", "→", "")
    E["uv_tele"] = cifra("AÑOS 60", "LA TELEVISIÓN EMPIEZA A RETRANSMITIR LAS CAMPANADAS", "1f4fa")
    E["uv_canarias"] = comparar("1f3db-fe0f", "con Madrid", "1f3dd-fe0f", "y una hora después", "+", "EN CANARIAS, ¿DOS VECES?")
    E["uv_presentar"] = icono_texto("1f3a4", "CASI UN *ACONTECIMIENTO NACIONAL*", "y los vestidos son noticia al día siguiente", "presentar las campanadas", "der", "navidad", True, "pop", "glow")
    E["uv_negocio"] = impacto("y como en toda tradición,", "TAMBIÉN HAY *NEGOCIO*", "", "1f4b0")
    E["uv_dificil"] = lista([("1f62c", "piel gruesa"), ("1f6ab", "pepitas"), ("23f1-fe0f", "doce segundos")], "NO ES FÁCIL")
    E["uv_peladas"] = lista([("1f347", "sin pepitas"), ("1f52a", "peladas"), ("1f96b", "latas y envases de doce")], "LAS SOLUCIONES")
    E["uv_otras"] = comparar("1f30d", "uvas de otras zonas y países", "1f6cd-fe0f", "la embolsada del Vinalopó, con sello", "VS", "EN EL SUPERMERCADO")
    E["uv_amuleto"] = f'''{F("navidad", True)}{obj(spr("1f347", 300), 30, 52, "pop", "bob", .2)}{txt(kt("NO ES UNA FRUTA: *ES UN AMULETO*", "xl hueso", .6), 70, 44, 52)}{txt(kt("y en diciembre, el precio sube", "l naranja", 1.3), 70, 58, 52)}'''
    E["uv_viajera"] = impacto("las doce uvas", "NO SE QUEDARON *EN ESPAÑA*", "", "1f30e")
    E["uv_america"] = lista([("1f1f2-1f1fd", "México"), ("1f1e6-1f1f7", "Argentina"), ("1f1f5-1f1ea", "Perú"), ("1f1e8-1f1f4", "Colombia")], "UN DESEO POR UVA… Y UNA MALETA")
    E["uv_eeuu"] = icono_texto("1f1fa-1f1f8", "COMUNIDADES *HISPANAS*", "y cada vez más gente que la imita", "también en Estados Unidos", "der", "", False, "pop", "bob")
    E["uv_nadie"] = flecha("1f347", "1f30e", "DE UNAS UVAS QUE SOBRABAN *AL MUNDO*", "y casi nadie lo sabe")
    E["uv_ritual"] = titular("DE BURLA Y CAMPAÑA *A RITUAL*", "uno de los más reconocibles del mundo hispano", "", ("1f602", "1f4b0", "1f347", "1f386"), "navidad", True, "xl")
    E["leccion1"] = leccion(1, "un excedente", "*PUEDE SER UNA OPORTUNIDAD*", "1f347")
    E["leccion2"] = leccion(2, "una buena historia", "*VENDE MÁS QUE UN BUEN PRECIO*", "1f340")
    E["leccion3"] = leccion(3, "cuando algo es ritual,", "*YA NO HACE FALTA ANUNCIARLO*", "1f570-fe0f")
    E["uv_final"] = lista([("1f602", "una burla"), ("1f33e", "una cosecha"), ("1f6cd-fe0f", "bolsas de papel"), ("1f570-fe0f", "un reloj de 1866"), ("23f1-fe0f", "doce segundos")], "")
    E["uv_ojo"] = f'''{F("espacio", True)}{doce(100, 74)}{txt(kt("¡FELIZ AÑO NUEVO! *Y OJO CON LOS CUARTOS*", "xl hueso", .4), 50, 26, 90)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:60px;top:160px">{reloj(300, None)}</div>
      <div style="position:absolute;left:300px;top:330px">{vicon("grapes", 230)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">¿QUIÉN INVENTÓ</div><div class="q" style="font-size:150px;margin-top:22px">LAS 12 UVAS?</div><div class="y">EL ORIGEN DE NOCHEVIEJA</div></div>'''
