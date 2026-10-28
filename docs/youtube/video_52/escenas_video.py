"""Escenas del vídeo 52 (especial Navidad: la Lotería de Navidad). Motor común; sin logotipos ni personajes de anuncios: décimos, bolas y figuras genéricas."""
from base import *

CAP_ICONOS = {1: "1f3f0", 2: "1f3c6", 3: "1f3b5", 4: "1f39f-fe0f", 5: "1f6b6", 6: "1f468-200d-1f9b2", 7: "1f91d", 8: "1f37e", 9: "1f9e0"}

def decimo(num=3604, w=520, d=.2):
    """Décimo genérico (sin escudos ni logotipos)."""
    return (f'<div style="width:{w}px;height:{w*0.5:.0f}px;background:linear-gradient(135deg,#f6ead0,#e9d3a6);border:5px solid {TINTA};border-radius:14px;'
            f'box-shadow:0 14px 30px rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;{"" if d is None else f"animation:ePop .5s ease {d}s both"}">'
            f'<div style="font-family:Bebas;font-size:{w*0.07:.0f}px;letter-spacing:4px;color:#7a5a2a">SORTEO DE NAVIDAD · DÉCIMO</div>'
            f'<div style="font-family:Bebas;font-size:{w*0.26:.0f}px;letter-spacing:8px;color:{TINTA}">{num if isinstance(num, str) else f"{num:05d}"}</div></div>')

def bola(num=0, px=170, d=.2):
    return (f'<div style="width:{px}px;height:{px}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#e9dcc0 65%,#b89f6a);border:4px solid {TINTA};'
            f'display:flex;align-items:center;justify-content:center;font-family:Bebas;font-size:{px*0.26:.0f}px;color:{TINTA};animation:ePop .4s ease {d}s both">{num if isinstance(num, str) else f"{num:05d}"}</div>')

def escenas():
    E = {}
    E["lo_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f39f-fe0f", "2744-fe0f", "1f340"), "navidad", True, "mega")
    E["lo_22"] = cifra("22 DE DICIEMBRE", "LA TELE ENCENDIDA DESDE PRIMERA HORA", "1f4fa")
    E["lo_ninos"] = f'''{F("navidad", True)}<div style="position:absolute;left:8%;top:30%">{decimo(47213, 560)}</div><div style="position:absolute;left:62%;top:26%">{bola(47213, 220, .9)}</div>{txt(kt("UNOS NIÑOS *CANTAN NÚMEROS*", "xl hueso", .4), 50, 80, 90)}'''
    E["lo_empieza"] = titular("EL DÍA QUE *EMPIEZA LA NAVIDAD*", "para muchos españoles", "", ("1f384", "1f39f-fe0f", "1f3b5", "2728"), "navidad", True, "xl")
    E["lo_guerra"] = lista([("1f3f0", "una ciudad sitiada"), ("2694-fe0f", "en plena guerra"), ("1f4b0", "dinero sin subir impuestos")], "NO NACIÓ EN UN AMBIENTE FESTIVO")
    E["lo_historia"] = titular("LA HISTORIA DE LA *LOTERÍA DE NAVIDAD*", "", "", ("1f39f-fe0f", "1f3f0", "1f3b5", "1f340"), "navidad", True, "xl")
    E["lo_cadiz"] = icono_texto("1f3f0", "*CÁDIZ*", "principios del siglo XIX", "", "izq", "sepia", False, "pop", "bob", 380, (("1f30a", 84, 78),))
    E["lo_napoleon"] = icono_texto("1f6e1-fe0f", "LA CIUDAD *QUE RESISTE*", "protegida por el mar, llena de refugiados, comerciantes y diputados", "guerra contra Napoleón", "der", "", False, "pop", "shake")
    E["lo_cortes"] = cifra("1812", "LAS CORTES APRUEBAN LA PRIMERA CONSTITUCIÓN: «LA PEPA»", "1f4dc")
    E["lo_dinero"] = comparar("1f4b0", "hace falta dinero para la guerra", "1f62b", "la gente no puede pagar más impuestos", "PERO", "UN PROBLEMA ENORME")
    E["lo_carvajal"] = icono_texto("1f4a1", "CIRIACO GONZÁLEZ *CARVAJAL*", "pagar voluntariamente por la ilusión de ganar", "un ministro con una idea: una lotería", "izq", "calido", True, "pop", "glow")
    E["lo_1811"] = cifra("NOV. 1811", "LAS CORTES APRUEBAN EL PROYECTO", "2705")
    E["lo_1812"] = cifra("1812", "EMPIEZAN LOS SORTEOS EN CÁDIZ Y SAN FERNANDO", "1f39f-fe0f")
    E["lo_18dic"] = cifra("18 DIC. 1812", "EL PRIMER SORTEO DE NAVIDAD", "1f384")
    E["lo_03604"] = f'''{F("sepia", True)}<div style="position:absolute;left:10%;top:28%">{decimo(3604, 600)}</div>{txt(kt("*8.000 REALES*", "xl", .9), 80, 42, 34)}{txt(kt("el primer Gordo, según las crónicas", "l naranja", 1.4), 80, 58, 34)}'''
    E["lo_madrid"] = flecha("1f3f0", "1f3db-fe0f", "DE CÁDIZ *A MADRID*", "y después, a todo el país")
    E["lo_unomas"] = impacto("durante décadas, el sorteo de diciembre era", "UNO *MÁS*", "sin nombre propio", "1f937")
    E["lo_1892"] = cifra("1892", "EMPIEZA A LLAMARSE «SORTEO DE NAVIDAD»", "1f384")
    E["lo_sonido"] = bocadillos("1f9d2", ["Cuatrocientos mil euros…", "…cuarenta y siete mil doscientos trece"], "el sonido del sorteo")
    E["lo_colegio"] = icono_texto("1f3eb", "COLEGIO DE *SAN ILDEFONSO*", "acogió durante siglos a niños huérfanos o sin recursos", "Madrid", "izq", "sepia", False, "pop", "bob")
    E["lo_antes"] = cifra("SIGLO XVIII", "SUS ALUMNOS YA SACABAN BOLAS EN LA LOTERÍA ANTERIOR", "1f9d2", "según algunas fuentes")
    E["lo_confianza"] = icono_texto("1f440", "SIN TRAMPA *NI CARTÓN*", "unos niños sacando las bolas a la vista de todos", "la idea: transmitir confianza", "der", "", True, "pop", "bob")
    E["lo_melodia"] = icono_texto("1f3b5", "UN SONIDO *INCONFUNDIBLE*", "ensayan durante semanas antes del sorteo", "", "izq", "navidad", True, "pop", "bob")
    E["lo_gordo"] = f'''{F("navidad", True)}<div class="pos" style="left:30%;top:52%">{bola("¡GORDO!", 300, .3)}</div>{txt(kt("EN TODOS *LOS INFORMATIVOS*", "xl hueso", .8), 70, 46, 52)}'''
    E["lo_decimo"] = f'''{F()}<div style="position:absolute;left:6%;top:30%">{decimo(58904, 520)}</div>{txt(kt("1 BILLETE = *10 DÉCIMOS*", "xl", .8), 76, 44, 42)}'''
    E["lo_barato"] = flecha("1f4b8", "1f60a", "UN BILLETE CARO… *AL ALCANCE DE CASI TODOS*", "")
    E["lo_comparte"] = lista([("1f46a", "la familia"), ("1f4bc", "el trabajo"), ("2615", "el bar del barrio"), ("26bd", "el club")], "LA CLAVE: SE COMPARTE")
    E["lo_participaciones"] = icono_texto("1f4c3", "LAS *PARTICIPACIONES*", "un trocito de un décimo, que se vende o se regala", "", "der", "calido", True, "pop", "bob")
    E["lo_miedo"] = bocadillos("1f631", ["¿Ha tocado en el bar?", "…¡y yo sin llevar!"], "el miedo más típico de diciembre")
    E["lo_fuera"] = comparar("1f911", "jugar para ganar", "1f46b", "jugar para no quedarse fuera", "VS", "¿POR QUÉ JUEGA MUCHA GENTE?")
    E["lo_leyendas"] = impacto("la leyenda más famosa", "TIENE NOMBRE *DE MUJER*", "", "1f469")
    E["lo_1904"] = cifra("1904", "MANUELA DE PABLO ABRE SU ADMINISTRACIÓN EN MADRID", "1f469", "según la mayoría de las fuentes")
    E["lo_suerte"] = titular("DOÑA MANOLITA = *SUERTE*", "un despacho convertido en sinónimo", "", ("1f340", "1f469", "1f39f-fe0f", "2728"), "navidad", True, "xl")
    E["lo_logico"] = comparar("1f3c6", "muchísimos Gordos", "1f4e6", "porque vende muchísimos décimos", "→", "TAMBIÉN ES LÓGICO")
    E["lo_colas"] = f'''{F("calido", True)}{"".join(obj(spr(c, 100), 10 + i * 9, 62, "left", "bob", .1 + i * .1) for i, c in enumerate(["1f9cd", "1f9cd-200d-2640-fe0f", "1f9d3", "1f9cd", "1f9cd-200d-2640-fe0f", "1f9d1", "1f9cd", "1f9d3", "1f9cd-200d-2640-fe0f"]))}{txt(kt("COLAS QUE DAN *LA VUELTA A LA MANZANA*", "xl", .6), 50, 24, 90)}{txt(kt("horas de espera… incluso en verano", "l naranja", 1.4), 50, 36, 80)}'''
    E["lo_parada"] = flecha("1f3ea", "2b50", "DE PEQUEÑO NEGOCIO *A MARCA*", "parada obligatoria de la Navidad madrileña")
    E["lo_publicidad"] = impacto("y llegamos a", "LA *PUBLICIDAD*", "algunos de los anuncios más famosos de España", "1f4fa")
    E["lo_calvo"] = f'''{F("navidad", True)}{obj(spr("1f468-200d-1f9b2", 300), 28, 52, "pop", "bob", .2)}{obj(spr("1f4a8", 140), 46, 44, "left", "float", 1.0)}{txt(kt("1998: UN CALVO *QUE SOPLA LA SUERTE*", "xl hueso", .6), 70, 42, 52)}{txt(kt("por pueblos nevados", "l naranja", 1.3), 70, 58, 52)}'''
    E["lo_actor"] = icono_texto("1f3ad", "UN ACTOR *BRITÁNICO*", "Clive Arrindell: para muchos, la cara de la Navidad", "", "der", "", False, "pop", "bob", 380, (("1f1ec-1f1e7", 84, 20),))
    E["lo_exclusiva"] = icono_texto("1f4dd", "CONTRATO *DE EXCLUSIVIDAD*", "sin otras producciones mientras fue la imagen de la Lotería", "según se publicó", "izq", "", False, "pop", "")
    E["lo_recuerda"] = cifra("HASTA MEDIADOS DE LOS 2000", "Y TODAVÍA HOY MUCHOS LO RECUERDAN", "1f468-200d-1f9b2")
    E["lo_estrategia"] = comparar("1f340", "hablar de suerte", "1f91d", "hablar de compartir", "→", "CAMBIO DE ESTRATEGIA")
    E["lo_2014"] = icono_texto("2615", "«EL MAYOR PREMIO *ES COMPARTIRLO*»", "el dueño de un bar que guarda un décimo para un cliente", "2014", "der", "calido", True, "pop", "bob")
    E["lo_justino"] = f'''{F("dark", True)}{obj(spr("1f482", 260), 26, 52, "pop", "bob", .2)}{obj(spr("1f319", 120), 40, 24, "pop", "glow", .8)}{txt(kt("2015: *JUSTINO*", "xl hueso", .6), 68, 38, 56)}{txt(kt("vigilante nocturno en una fábrica de maniquíes", "l naranja", 1.2), 68, 54, 56)}'''
    E["lo_premios"] = cifra("DECENAS", "DE PREMIOS EN FESTIVALES DE PUBLICIDAD", "1f3c6", "según se publicó")
    E["lo_ilusion"] = titular("NO VENDÍA NÚMEROS: *VENDÍA ILUSIÓN*", "y su anuncio se espera como una película", "", ("1f39f-fe0f", "2764-fe0f", "1f4fa", "2728"), "navidad", True, "xl")
    E["lo_granda"] = impacto("y llega", "EL *GRAN DÍA*", "22 de diciembre", "1f4c5")
    E["lo_teatro"] = icono_texto("1f3ad", "EL TEATRO *REAL*", "gente disfrazada, con amuletos y carteles", "desde 2012", "izq", "", True, "pop", "bob")
    E["lo_400"] = f'''{F("navidad", True)}<div style="position:absolute;left:6%;top:30%">{decimo("20 €", 480)}</div>{txt(kt("→ *400.000 €*", "xl hueso", .8), 76, 42, 42)}{txt(kt("el Gordo, por décimo (Hacienda se queda una parte)", "l naranja", 1.4), 76, 58, 42)}'''
    E["lo_cava"] = lista([("1f938", "saltos"), ("1f917", "abrazos"), ("1f37e", "cava en la calle")], "LA ADMINISTRACIÓN DEL GORDO")
    E["lo_dia_salud"] = icono_texto("1f489", "«EL DÍA *DE LA SALUD*»", "para la inmensa mayoría, sin premio", "medio en broma", "der", "", False, "pop", "bob")
    E["lo_nino"] = cifra("6 DE ENERO", "EL SORTEO DEL NIÑO: SEGUNDA OPORTUNIDAD", "1f476")
    E["leccion1"] = leccion(1, "las mejores ideas pueden nacer", "*DE UNA URGENCIA*", "1f3f0")
    E["leccion2"] = leccion(2, "un ritual repetido cada año", "*SE CONVIERTE EN TRADICIÓN*", "1f3b5")
    E["leccion3"] = leccion(3, "la gente no compra un producto:", "*COMPRA UNA EMOCIÓN*", "2764-fe0f")
    E["lo_final"] = lista([("1f3f0", "una ciudad sitiada"), ("1f4a1", "un ministro"), ("1f9d2", "unos niños"), ("1f469", "una administración"), ("1f468-200d-1f9b2", "un calvo")], "")
    E["lo_salud"] = f'''{F("navidad", True)}{obj(spr("1f970", 300), 30, 50, "pop", "bob", .2)}{txt(kt("LO IMPORTANTE *ES LA SALUD*", "xl hueso", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:40px;top:220px;transform:rotate(-6deg)">{decimo("1812", 400, None)}</div>
      <div style="position:absolute;left:190px;top:470px">{vicon("crossed-swords", 150)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">LA LOTERÍA NACIÓ</div><div class="q" style="font-size:170px;margin-top:22px">EN UNA GUERRA</div><div class="y">EL ORIGEN DEL GORDO</div></div>'''
