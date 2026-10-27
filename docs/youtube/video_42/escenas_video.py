"""Escenas del vídeo 42 (Instagram, formato largo). Motor común; sin logotipos: móviles, fotos cuadradas y cámaras genéricas."""
from base import *

CAP_ICONOS = {1: "1f4f7", 2: "1f645", 3: "1f943", 4: "2702-fe0f", 5: "1f3d6-fe0f", 6: "1f4e9", 7: "1f680", 8: "1f4b0",
              9: "1f4cb", 10: "1f933", 11: "1f6aa", 12: "1f614", 13: "1f9e0"}

def foto(px=300, cielo="#f2b26b", tierra="#7a5a3a", marco=True):
    return (f'<svg width="{px}" height="{px*(1.18 if marco else 1):.0f}" viewBox="0 0 200 {236 if marco else 200}">'
            + (f'<rect x="2" y="2" width="196" height="232" rx="6" fill="#fff" stroke="{TINTA}" stroke-width="4"/>' if marco else "")
            + f'<defs><radialGradient id="vg{px}"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>'
            f'<rect x="14" y="14" width="172" height="172" fill="{cielo}"/><circle cx="140" cy="60" r="22" fill="#ffe08a"/><path d="M14,140 Q70,110 110,130 T186,120 L186,186 L14,186Z" fill="{tierra}"/>'
            f'<rect x="14" y="14" width="172" height="172" fill="url(#vg{px})"/></svg>')

def movil_foto(px=240):
    return (f'<svg width="{px}" height="{px*1.9:.0f}" viewBox="0 0 120 228"><rect x="4" y="4" width="112" height="220" rx="16" fill="#1c1c1c" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="12" y="24" width="96" height="180" fill="#fafafa"/><rect x="16" y="52" width="88" height="88" fill="#f2b26b"/><path d="M16,118 Q50,100 70,112 T104,106 L104,140 L16,140Z" fill="#7a5a3a"/>'
            f'<circle cx="84" cy="74" r="10" fill="#ffe08a"/><circle cx="22" cy="40" r="6" fill="#ccc"/><rect x="32" y="37" width="40" height="6" rx="3" fill="#ccc"/>'
            f'<path d="M24,156 c-6,-8 6,-14 8,-4 c2,-10 14,-4 8,4 l-8,8z" fill="#D7263D"/><rect x="50" y="152" width="44" height="6" rx="3" fill="#ddd"/></svg>')

def escenas():
    E = {}
    E["ig_foto"] = f'''{F("", True)}{obj(movil_foto(240), 28, 50, "drop", "float", .2)}{txt(kt("FOTO CUADRADA, *FILTRO Y UN CORAZÓN*", "xl", .9), 68, 46, 54)}'''
    E["ig_usuarios"] = cifra("+2.000 M", "DE PERSONAS AL MES, SEGÚN LA EMPRESA", "1f30d")
    E["ig_whisky"] = icono_texto("1f943", "UNA APP *CON NOMBRE DE WHISKY*", "que casi nadie entendía", "empezó siendo…", "izq", "calido", False, "pop", "bob")
    E["ig_filtros"] = comparar("1f4f7", "una cámara de plástico", "1f469", "una pregunta de su novia", "+", "LOS FILTROS")
    E["ig_compra"] = comparar("1f4b0", "1.000 millones de dólares", "1f465", "13 empleados", "+")
    E["ig_historia"] = titular("LA HISTORIA DE *INSTAGRAM*", "", "", ("1f4f7", "2764-fe0f", "1f4f1", "1f943"), "", True, "xl")
    E["ig_stanford"] = icono_texto("1f468-200d-1f393", "KEVIN *SYSTROM*", "tecnología, diseño… y fotografía", "Universidad de Stanford", "izq", "", False, "up", "bob")
    E["ig_florencia"] = flecha("1f1fa-1f1f8", "1f1ee-1f1f9", "UN TRIMESTRE *EN FLORENCIA*", "con su mejor cámara")
    E["ig_holga"] = f'''{F("sepia", True)}{obj(spr("1f4f7", 240), 26, 48, "pop", "bob", .2)}{txt(kt("UNA *HOLGA* DE PLÁSTICO", "xl", .7), 68, 38, 56)}{txt(kt("fotos cuadradas, borrosas, con colores raros", "l", 1.3), 68, 56, 56)}<div class="viñeta"></div>'''
    E["ig_imperfeccion"] = f'''{F()}{obj(f'<div style="filter:blur(2px) saturate(1.6) sepia(.4)">{foto(300)}</div>', 30, 50, "pop", "", .2)}{txt(kt("APRECIAR *LA IMPERFECCIÓN*", "xl", .9), 70, 46, 52)}'''
    E["ig_grabada"] = impacto("aquella lección", "SE LE *QUEDÓ GRABADA*", "", "1f9e0")
    E["ig_zuckerberg"] = icono_texto("1f468-200d-1f4bb", "MARK *ZUCKERBERG*", "creaba una red para universitarios: Facebook", "por aquella época", "der", "", False, "up", "bob")
    E["ig_oferta"] = bocadillos("1f468-200d-1f4bb", ["¿Trabajas conmigo?", "Un servicio de fotos…"], "según contaron varios medios")
    E["ig_no"] = impacto("Systrom dijo", "QUE *NO*", "prefería terminar sus estudios", "1f645")
    E["ig_mil"] = comparar("1f645", "rechazó el trabajo", "1f4b0", "años después: 1.000 millones por su empresa", "→")
    E["ig_noches"] = icono_texto("1f319", "DE NOCHE, *SU PROPIA APP*", "tras pasar por varias tecnológicas, entre ellas Google", "", "izq", "espacio", True, "pop", "float")
    E["ig_burbn"] = titular("*BURBN*", "como el whisky bourbon", "su aplicación:", ("1f943", "1f4f1", "1f4cd", "1f4f7"))
    E["ig_funciones"] = lista([("1f4cd", "dónde estás"), ("1f465", "quedar"), ("1f3c5", "puntos"), ("1f4f7", "fotos")], "TENÍA DE TODO")
    E["ig_confusa"] = icono_texto("1f615", "NADIE SABÍA *PARA QUÉ SERVÍA*", "demasiadas funciones", "", "der", "", False, "pop", "swing")
    E["ig_krieger"] = comparar("1f4b5", "medio millón de inversores", "1f468-200d-1f4bb", "Mike Krieger, ingeniero brasileño", "+")
    E["ig_fotos"] = f'''{F("", True)}{"".join(txt(kt(t, "xl gris", .2 + i * .25), 20 + i * 20, 34, 18) for i, t in enumerate(["LUGARES", "PLANES", "PUNTOS"]))}{txt(kt("FOTOS", "mega rojo", 1.2, .12, "slam"), 80, 34, 22)}{txt(kt("lo único que de verdad se usaba", "l", 1.7), 50, 62, 80)}'''
    E["ig_quitar"] = impacto("una decisión valiente:", "QUITARLO *CASI TODO*", "", "2702-fe0f")
    E["ig_solo"] = f'''{F()}{"".join(txt(f'<div class="xl" style="text-decoration:line-through;color:#8A8F98">{n}</div>', 20 + i * 20, 34, 20, "center", .2 + i * .3, "pop") for i, n in enumerate(["PLANES", "PUNTOS", "LUGARES"]))}{obj(foto(220), 80, 46, "zoom", "bob", 1.2)}{txt(kt("*SOLO FOTOS*", "mega", 1.5, .12, "slam"), 50, 80, 90)}'''
    E["ig_rapido"] = lista([("1f4f7", "hacer"), ("2728", "mejorar"), ("1f4e4", "compartir")], "RÁPIDO. MUY RÁPIDO.")
    E["ig_camaras"] = f'''{F()}{obj(f'<div style="filter:brightness(.55) saturate(.3)">{foto(280, "#9aa4ad", "#555")}</div>', 30, 50, "pop", "", .2)}{txt(kt("OSCURAS, PLANAS, *SIN GRACIA*", "xl", .8), 70, 42, 52)}{txt(kt("las cámaras de los móviles de entonces", "l", 1.4), 70, 58, 52)}'''
    E["ig_algo"] = comparar("2728", "cualquier foto, bonita", "26a1", "compartida en segundos", "+", "SI LO CONSEGUÍAN…")
    E["ig_mexico"] = icono_texto("1f1f2-1f1fd", "UNAS VACACIONES *EN MÉXICO*", "según Systrom en varias entrevistas", "", "izq", "calido", True, "pop", "bob")
    E["ig_novia"] = bocadillos("1f469", ["No voy a usarla…", "…mis fotos no quedan bonitas"], "su novia")
    E["ig_playa"] = icono_texto("1f3d6-fe0f", "EN LA PLAYA, *SU PRIMER FILTRO*", "esa misma tarde", "", "der", "calido", True, "pop", "bob", 380, (("1f4bb", 14, 80),))
    E["ig_calidos"] = f'''{F("", True)}{obj(foto(260, "#9fc7e6", "#5d7b4a"), 26, 50, "left", "", .2)}{txt('<div class="vs" style="--d:.8s">→</div>', 50, 50, 10)}{obj(f'<div style="filter:sepia(.55) saturate(1.5) contrast(1.1)">{foto(260, "#9fc7e6", "#5d7b4a")}</div>', 74, 50, "right", "", 1.0)}{txt(kt("CÁLIDO, *BORDES OSCUROS*, AIRE ANTIGUO", "xl", 1.4), 50, 88, 90)}'''
    E["ig_perro"] = icono_texto("1f415", "UN PERRO *JUNTO A UN PUESTO DE TACOS*", "una de las primeras fotos, según se cuenta", "", "izq", "", False, "pop", "bob", 380, (("1f32e", 86, 80),))
    E["ig_nombre"] = impacto("", "FALTABA *UN NOMBRE*", "", "1f3f7-fe0f")
    E["ig_instant"] = comparar("1f4f8", "instant: cámara instantánea", "1f4e9", "telegram: telegrama", "+")
    E["ig_instagram"] = titular("*INSTAGRAM*", "fotos instantáneas que se envían al momento", "", ("1f4f8", "1f4e9", "26a1", "2728"))
    E["ig_cuadradas"] = f'''{F("calido", True)}{"".join(obj(foto(180, c, t), 20 + i * 30, 48, "pop", "bob", .2 + i * .3) for i, (c, t) in enumerate([("#f2b26b", "#7a5a3a"), ("#9fc7e6", "#5d7b4a"), ("#f4a7b9", "#6b4b6b")]))}{txt(kt("CUADRADAS, *COMO UNA POLAROID*", "xl", 1.3), 50, 88, 90)}'''
    E["ig_2010"] = fecha("6", "OCTUBRE", "2010", "Instagram llega a la tienda del iPhone", "1f4f1")
    E["ig_25000"] = cifra("25.000", "PERSONAS EL PRIMER DÍA", "1f465", "según sus fundadores")
    E["ig_servidores"] = icono_texto("1f5a5-fe0f", "LOS SERVIDORES *NO AGUANTAN*", "una noche arreglándolos", "", "der", "dark", False, "pop", "swing")
    E["ig_millon"] = cifra("1 MILLÓN", "DE USUARIOS EN DOS MESES", "1f680")
    E["ig_android"] = comparar("1f34e", "solo iPhone", "1f916", "Android: año y medio después", "→")
    E["ig_abril"] = icono_texto("1f916", "ABRIL DE 2012: *ANDROID*", "otro millón de personas en pocos días", "", "izq", "", False, "pop", "bob")
    E["ig_miedo"] = lista([("1f6ab", "sin ganar dinero"), ("1f6ab", "sin anuncios"), ("1f4c8", "un crecimiento que daba miedo")], "")
    E["ig_llama"] = icono_texto("260e-fe0f", "ZUCKERBERG *LLAMA A SYSTROM*", "ese mismo mes", "", "der", "", False, "pop", "swing")
    E["ig_compra2"] = cifra("1.000 M$", "FACEBOOK COMPRA INSTAGRAM, EN DINERO Y ACCIONES", "1f4b0")
    E["ig_13"] = f'''{F("", True)}{"".join(obj(spr("1f9d1-200d-1f4bb", 110), 10 + (i % 7) * 13, 34 + (i // 7) * 24, "pop", "", .1 + i * .08) for i in range(13))}{txt(kt("13 EMPLEADOS · *18 MESES*", "xl", 1.3), 50, 86, 90)}'''
    E["ig_millonarios"] = cifra("~400 M$", "PARA SYSTROM, SEGÚN LA PRENSA", "1f911")
    E["ig_ganga"] = comparar("1f62c", "entonces: «¡demasiado!»", "1f3c6", "hoy: una de las mejores compras", "→")
    E["ig_rival"] = impacto("cuando aparecía un rival…", "LO *COPIABA*", "", "1f4cb")
    E["ig_historias"] = comparar("1f47b", "la idea de Snapchat", "23f3", "historias de 24 horas", "→", "2016")
    E["ig_snapchat"] = icono_texto("1f4c8", "MÁS USUARIOS *QUE TODO SNAPCHAT*", "las historias de Instagram", "", "der", "", True, "pop", "bob")
    E["ig_reels"] = comparar("1f3b5", "el éxito de TikTok", "1f3ac", "los reels: vídeos cortos", "→")
    E["ig_nosolo"] = titular("YA NO ERA *SOLO FOTOS*", "", "", ("1f4f7", "1f3ac", "23f3", "1f3b5"), "", True, "xl")
    E["ig_mundo"] = impacto("Instagram cambió", "EL MUNDO *QUE FOTOGRAFIAMOS*", "", "1f30d")
    E["ig_restaurantes"] = lista([("1f37d-fe0f", "platos para el móvil"), ("1f47c", "paredes con alas"), ("2615", "cafeterías de foto")], "")
    E["ig_museos"] = icono_texto("1f3db-fe0f", "MUSEOS *PARA HACERSE FOTOS*", "piscinas de bolas y habitaciones de colores", "", "izq", "calido", True, "pop", "bob")
    E["ig_palabra"] = titular("«*INSTAGRAMEABLE*»", "que queda bien en una foto para redes", "hasta la lengua cambió", ("1f4d6", "1f4f8", "2728", "1f933"))
    E["ig_influencers"] = icono_texto("1f933", "NACEN *LOS INFLUENCERS*", "vivir de lo que publicas", "", "der", "", True, "pop", "bob")
    E["ig_likes"] = icono_texto("1f648", "¿ESCONDER *LOS ME GUSTA*?", "2019: menos presión por la popularidad", "", "izq", "", False, "pop", "swing", 380, (("2764-fe0f", 86, 80),))
    E["ig_milmillones"] = cifra("1.000 M", "DE USUARIOS EN 2018", "1f30d")
    E["ig_marcha"] = comparar("1f468-200d-1f393", "Systrom", "1f468-200d-1f4bb", "Krieger", "+", "SEPTIEMBRE DE 2018: SE VAN")
    E["ig_tensiones"] = icono_texto("26a1", "TENSIONES *CON FACEBOOK*", "por la independencia de Instagram, según varios medios", "", "der", "dark", False, "pop", "")
    E["ig_artifact"] = icono_texto("1f4f0", "UNA APP *DE NOTICIAS*", "juntos otra vez… pero la acabaron cerrando", "", "izq", "", False, "pop", "")
    E["ig_repetir"] = impacto("repetir una idea así", "ES *TODAVÍA MÁS DIFÍCIL*", "", "1f504")
    E["ig_criticas"] = impacto("el éxito también trajo", "*CRÍTICAS*", "", "26a0-fe0f")
    E["ig_perfectas"] = lista([("1f4f8", "fotos perfectas"), ("1f483", "cuerpos retocados"), ("2764-fe0f", "carrera por los me gusta")], "PREOCUPACIÓN")
    E["ig_documentos"] = icono_texto("1f4c4", "2021: *DOCUMENTOS FILTRADOS*", "la empresa había estudiado su efecto en la autoestima de algunas adolescentes", "", "izq", "dark", False, "pop", "")
    E["ig_defensa"] = comparar("1f4ca", "también efectos positivos, dijo la empresa", "1f46a", "herramientas para familias", "+")
    E["ig_complicado"] = titular("MÁS GRANDE… *Y MÁS COMPLICADO*", "", "", ("1f4f7", "1f914", "1f30d", "2696-fe0f"), "", True, "xl")
    E["leccion1"] = leccion(1, "a veces lo mejor es", "*QUITAR*", "2702-fe0f")
    E["leccion2"] = leccion(2, "mira cómo usa la gente", "*TU PRODUCTO*", "1f440")
    E["leccion3"] = leccion(3, "la imperfección", "*TAMBIÉN PUEDE SER BONITA*", "1f4f7")
    E["ig_final"] = lista([("1f4f7", "una cámara"), ("1f645", "un no"), ("1f943", "un whisky"), ("1f3d6-fe0f", "una playa"), ("1f465", "13 empleados")], "")
    E["ig_filtro"] = f'''{F("calido", True)}{obj(f'<div style="filter:sepia(.5) saturate(1.4)">{foto(300)}</div>', 30, 50, "drop", "float", .2)}{txt(kt("YA SABES *DE DÓNDE VIENE*", "xl", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:120px;top:60px;transform:rotate(-6deg)">{movil_foto(300)}</div>
      <div style="position:absolute;left:360px;top:430px">{vicon("money-bag", 190)}</div>
      <div class="big" style="top:100px"><div class="s">13 EMPLEADOS Y</div><div class="q" style="font-size:150px;margin-top:22px">1.000 MILLONES</div><div class="y">LA HISTORIA DE INSTAGRAM</div></div>'''
