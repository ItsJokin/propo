"""Escenas del vídeo 26 (Amazon, formato largo). Motor común; sin logotipos (ni la flecha-sonrisa): cajas y objetos genéricos."""
from base import *

CAP_ICONOS = {1: "1f4bc", 2: "1f4da", 3: "1fa84", 4: "1f6aa", 5: "1f4c8", 6: "1f4c9", 7: "1f69a", 8: "2601-fe0f", 9: "1f4f1",
              10: "1f1ea-1f1f8", 11: "2696-fe0f", 12: "1f680", 13: "1f9e0"}

def caja(px=260, d=0.0):
    return (f'<svg width="{px}" height="{px*0.8:.0f}" viewBox="0 0 200 160"><path d="M10,50 L100,20 L190,50 L100,80Z" fill="#d9b37a" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M10,50 L10,120 L100,150 L100,80Z" fill="#c49a5e" stroke="{TINTA}" stroke-width="4"/><path d="M190,50 L190,120 L100,150 L100,80Z" fill="#b0874d" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="40" y="96" width="40" height="14" fill="#fff" opacity=".7" transform="skewY(18)"/></svg>')

def puerta_mesa(px=420):
    return (f'<svg width="{px}" height="{px*0.55:.0f}" viewBox="0 0 300 165"><rect x="20" y="40" width="260" height="30" fill="#b07a4a" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="40" y="46" width="70" height="18" fill="none" stroke="#8a5a2a" stroke-width="3"/><rect x="190" y="46" width="70" height="18" fill="none" stroke="#8a5a2a" stroke-width="3"/>'
            f'<circle cx="150" cy="55" r="5" fill="#f2c94c"/><rect x="34" y="70" width="12" height="90" fill="#8a5a3b"/><rect x="254" y="70" width="12" height="90" fill="#8a5a3b"/>'
            f'<rect x="120" y="10" width="60" height="30" rx="4" fill="#cfd3da" stroke="{TINTA}" stroke-width="3"/></svg>')

def escenas():
    E = {}
    E["am_caja"] = f'''{F("", True)}{obj(caja(320), 30, 52, "drop", "bob", .2)}{txt(kt("UNA CAJA DE CARTÓN *EN TU PUERTA*", "xl", .8), 70, 46, 54)}'''
    E["am_todo"] = lista([("1f6d2", "vende casi de todo"), ("2601-fe0f", "alquila servidores"), ("1f3ac", "produce series"), ("1f4f1", "fabrica aparatos")], "")
    E["am_libros"] = impacto("y empezó vendiendo solo", "*LIBROS*", "", "1f4da")
    E["am_garaje"] = lista([("1f3e0", "un garaje"), ("1f6aa", "mesas hechas con puertas"), ("1f514", "una campana")], "")
    E["am_cadabra"] = lista([("1fa84", "«Cadabra»"), ("1f4c9", "−90 % en bolsa"), ("1f480", "«no sobrevivirá»")], "ESTUVO A PUNTO DE…")
    E["am_historia"] = titular("LA HISTORIA *COMPLETA*", "", "", ("1f4e6", "1f4da", "1f680", "2601-fe0f"))
    E["am_bezos"] = icono_texto("1f468-200d-1f4bc", "JEFF *BEZOS*", "un trabajo muy bien pagado en una empresa de inversión de Nueva York", "principios de los noventa", "izq", "", True, "up", "bob", 340, (("1f5fd", 86, 80),))
    E["am_dato"] = cifra("1994", "INTERNET CRECE A UN RITMO ENORME CADA AÑO", "1f4c8", "un dato que le llamó la atención")
    E["am_crece"] = icono_texto("1f310", "ESTAR ALLÍ *DESDE EL PRINCIPIO*", "algo que crece tan rápido lo cambiará todo", "", "der", "", True, "zoom", "spin-slow")
    E["am_seguro"] = comparar("1f4bc", "un trabajo seguro y estable", "1f3b2", "una aventura incierta", "VS")
    E["am_ochenta"] = f'''{F("calido", True)}{obj(spr("1f474", 240), 24, 46, "pop", "bob", .2)}{txt(kt("CON 80 AÑOS, ¿DE QUÉ ME ARREPENTIRÍA MÁS?", "xl", .6), 66, 32, 58)}{txt(kt("¿de intentarlo y fracasar… o de *no intentarlo nunca*?", "l", 1.4), 66, 56, 58)}'''
    E["am_deja"] = icono_texto("1f6aa", "DEJÓ *EL TRABAJO*", "la respuesta le pareció clara", "", "izq", "", True, "pop", "")
    E["am_lista"] = icono_texto("1f4dd", "UNA LISTA *DE PRODUCTOS*", "que se podrían vender por internet", "", "der", "", False, "pop", "swing")
    E["am_elige"] = impacto("eligió", "LOS *LIBROS*", "por varias razones", "1f4da")
    E["am_millones"] = f'''{F()}{"".join(obj(spr("1f4d5" if i % 3 == 0 else ("1f4d7" if i % 3 == 1 else "1f4d8"), 90), 6 + (i % 10) * 9.8, 26 + (i // 10) * 18, "drop", "", .03 + i * .03) for i in range(30))}
      {txt(kt("MILLONES DE TÍTULOS: *NINGUNA TIENDA LOS TIENE TODOS*", "xl", 1.2), 50, 86, 95)}'''
    E["am_iguales"] = icono_texto("1f4d6", "TODOS *IGUALES*", "no hay que probárselos ni tocarlos antes de comprar", "", "izq", "", False, "pop", "bob")
    E["am_correo"] = icono_texto("1f4ee", "FÁCILES *DE ENVIAR*", "por correo", "", "der", "", True, "drop", "bob")
    E["am_seattle"] = f'''{F("calido")}{obj(skyline(1800, "#5b4636"), 50, 86, "none")}{txt(kt("SEATTLE, 1994", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("el garaje de una casa de alquiler, con su mujer, MacKenzie", "l", 1.1), 50, 48, 80)}'''
    E["am_padres"] = icono_texto("1f46a", "SUS PADRES *INVIERTEN*", "«hay muchas posibilidades de que lo perdáis todo»", "", "izq", "", True, "pop", "bob")
    E["am_cadabra2"] = f'''{F("", True)}{obj(spr("1fa84", 240), 26, 46, "pop", "swing", .2)}{txt(kt("PRIMER NOMBRE:", "l", .5), 66, 32, 56)}{txt(kt("*CADABRA*", "mega", .9, .12, "slam"), 66, 50, 56)}{txt(kt("como en «abracadabra»", "l", 1.6), 66, 68, 56)}'''
    E["am_cadaver"] = bocadillos("260e-fe0f", ["¿Cadabra?", "¿Ha dicho… «cadáver»?"], "un abogado lo entendió mal por teléfono, según la historia")
    E["am_senal"] = impacto("", "NO ERA *BUENA SEÑAL*", "", "1f480")
    E["am_relentless"] = icono_texto("1f310", "«RELENTLESS»: *IMPLACABLE*", "aquella dirección todavía lleva a Amazon", "otro nombre registrado:", "der", "", True, "pop", "bob")
    E["am_rio"] = f'''{F("calido", True)}<svg class="pos" style="left:50%;top:50%" width="1800" height="400" viewBox="0 0 1800 400"><path class="draw" style="--d:.2s;--len:2400" d="M0,200 C300,80 500,320 800,200 S1300,80 1800,220" fill="none" stroke="#2E6BD6" stroke-width="80" stroke-linecap="round" opacity=".85"/></svg>
      {txt(kt("EL RÍO *MÁS CAUDALOSO* DEL MUNDO", "xl", .8), 50, 20, 90)}{txt(kt("AMAZONAS", "mega", 1.4, .1, "slam"), 50, 84, 90)}'''
    E["am_a"] = comparar("1f3c6", "la tienda más grande del mundo", "1f524", "y empieza por A: de las primeras en las listas", "+")
    E["am_austero"] = impacto("los primeros tiempos", "MUY *AUSTEROS*", "", "1fa99")
    E["am_puertas"] = f'''{F()}{obj(puerta_mesa(520), 34, 52, "drop", "", .2)}{txt(kt("MESAS HECHAS *CON PUERTAS*", "xl", .8), 76, 42, 44)}{txt(kt("más baratas que un escritorio", "l", 1.4), 76, 58, 44)}'''
    E["am_premio"] = icono_texto("1f3c6", "UN PREMIO *CON FORMA DE PUERTA*", "para las ideas que ahorraban dinero", "", "der", "calido", True, "pop", "glow")
    E["am_1995"] = fecha("", "JULIO", "1995", "la web abre al público", "1f310")
    E["am_campana"] = f'''{F("", True)}{obj(spr("1f514", 280), 30, 46, "pop", "swing", .2)}{txt(kt("UNA CAMPANA *CON CADA PEDIDO*", "xl", .7), 70, 46, 54)}'''
    E["am_quitan"] = icono_texto("1f507", "SONABA TANTO… *QUE LA QUITARON*", "en pocas semanas", "", "izq", "", False, "pop", "shake")
    E["am_primer_mes"] = f'''{F()}{obj(spr("1f5fa-fe0f", 300), 30, 48, "zoom", "", .2)}{"".join(obj(spr("1f4e6", 80), x, y, "drop", "", .6 + i * .12) for i, (x, y) in enumerate([(20, 36), (34, 44), (26, 58), (40, 34), (38, 62), (22, 48)]))}
      {txt(kt("EL PRIMER MES: *TODOS LOS ESTADOS Y DECENAS DE PAÍSES*", "xl", 1.3), 72, 48, 50)}'''
    E["am_1997"] = cifra("1997", "SALE A BOLSA", "1f4c8")
    E["am_carta"] = icono_texto("2709-fe0f", "PENSAR *A LARGO PLAZO*", "la idea de su carta a los accionistas", "", "izq", "", True, "flip", "bob")
    E["am_invertir"] = comparar("1f4b0", "lo que gana…", "1f3d7-fe0f", "…lo invierte en crecer", "→", "AUNQUE NO HAYA BENEFICIOS")
    E["am_amplia"] = f'''{F()}{"".join(obj(spr(c, 150), 10 + i * 16, 46, "drop", "bob", .1 + i * .2) for i, c in enumerate(["1f4da", "1f4bf", "1f4fc", "1f9f8", "1f4fa", "1f45f"]))}{txt(kt("DE LIBROS… *A TODO*", "xl", 1.4), 50, 78, 90)}'''
    E["am_burla"] = bocadillos("1f602", ["«Amazon punto bomba»", "Nunca ganará dinero"], "muchos analistas se burlaban")
    E["am_time"] = icono_texto("1f4f0", "PERSONA *DEL AÑO*", "la revista Time eligió a Bezos en 1999", "", "der", "calido", True, "zoom", "glow")
    E["am_burbuja"] = impacto("y entonces estalló", "LA BURBUJA *DE LAS PUNTOCOM*", "", "1fae7")
    E["am_quiebras"] = f'''{F("dark", True)}{"".join(obj(spr("1f4bb", 110), 8 + (i % 8) * 12, 28 + (i // 8) * 22, "none", "fuera", .1 + i * .05) for i in range(16))}{txt(kt("CIENTOS DE EMPRESAS DE INTERNET *QUIEBRAN*", "xl hueso", 1.2), 50, 84, 90)}'''
    E["am_90"] = cifra("−90 %", "EL VALOR DE SUS ACCIONES", "1f4c9", "más del")
    E["am_despidos"] = icono_texto("1f4e6", "DESPIDOS *Y CIERRES*", "", "", "izq", "dark", False, "drop", "")
    E["am_siguiente"] = impacto("muchos daban por hecho que sería", "LA *SIGUIENTE*", "", "1f480")
    E["am_clientes"] = icono_texto("1f465", "CLIENTES *DE VERDAD*", "que compraban y volvían a comprar", "Amazon tenía algo distinto:", "der", "", True, "pop", "bob")
    E["am_sobrevive"] = cifra("2001", "PRIMER TRIMESTRE CON BENEFICIO: HABÍA SOBREVIVIDO", "1f4aa")
    E["am_prime"] = titular("2005: *PRIME*", "una idea que muchos consideraron una locura", "", ("1f69a", "1f4e6", "1f3ac", "1f3b5"))
    E["am_cuota"] = comparar("1f4b3", "una cuota anual", "1f69a", "envíos rápidos gratis", "→")
    E["am_calculos"] = icono_texto("1f9ee", "LOS CÁLCULOS *NO SALÍAN*", "los envíos costaban mucho dinero", "", "izq", "", False, "pop", "swing")
    E["am_aprovechar"] = flecha("1f4b3", "1f6d2", "SI YA HAS PAGADO… *COMPRAS MÁS*", "y antes en Amazon que en otro sitio")
    E["am_suma"] = lista([("1f3ac", "películas"), ("1f4fa", "series"), ("1f3b5", "música")], "PRIME SUMA…")
    E["am_suscriptores"] = cifra("CIENTOS DE MILLONES", "DE SUSCRIPTORES", "1f30d")
    E["am_noves"] = impacto("el gran negocio de Amazon", "NO ES EL QUE *VES*", "", "1f648")
    E["am_datos"] = f'''{F("dark", True)}{"".join(f'<div class="pos" style="left:{14 + i*12}%;top:50%;width:150px;height:460px;background:#2a2d33;border:4px solid #444;border-radius:8px"></div>' for i in range(7))}
      {"".join(obj(spr("1f7e2", 40), 14 + (i % 7) * 12, 34 + (i // 7) * 10, "pop", "pulse", .1 + i * .02) for i in range(28))}{txt(kt("CENTROS DE DATOS *ENORMES*", "xl hueso", 1.0), 50, 88, 90)}'''
    E["am_alquila"] = lista([("1f5a5-fe0f", "servidores"), ("1f4be", "almacenamiento"), ("26a1", "potencia de cálculo")], "2006: ALQUILARLO A OTROS, EN LA NUBE")
    E["am_aws"] = titular("AMAZON *WEB SERVICES*", "", "", ("2601-fe0f", "1f5a5-fe0f", "1f310", "1f4be"), "", True, "xl")
    E["am_apps"] = f'''{F("", True)}{obj(spr("1f4f1", 220), 22, 50, "pop", "bob", .2)}{"".join(obj(spr("2601-fe0f", 120), x, y, "pop", "float", .6 + i * .2) for i, (x, y) in enumerate([(40, 26), (54, 22), (48, 36)]))}
      {txt(kt("MUCHAS APPS Y WEBS FUNCIONAN *EN SUS SERVIDORES*", "xl", 1.2), 74, 50, 46)}{txt(kt("aunque no lo sepas", "l", 1.8), 74, 68, 46)}'''
    E["am_rentable"] = icono_texto("1f4b0", "DE LO *MÁS RENTABLE*", "ese negocio invisible", "", "izq", "calido", True, "zoom", "glow")
    E["am_aparatos"] = impacto("sus propios aparatos:", "NO TODOS *SALIERON BIEN*", "", "1f4f1")
    E["am_kindle"] = f'''{F("", True)}<div class="pos" style="left:28%;top:48%;width:260px;height:360px;background:#3b3f45;border-radius:22px;border:6px solid {TINTA}"></div>
      <div class="pos" style="left:28%;top:44%;width:200px;height:250px;background:#e8e4da;border-radius:6px"></div>{txt(kt("2007: EL *KINDLE*", "xl", .6), 68, 38, 56)}{txt(kt("se agotó en pocas horas", "l", 1.3), 68, 56, 56)}'''
    E["am_digitales"] = flecha("1f4da", "1f4f1", "DEL PAPEL… *AL LIBRO DIGITAL*", "")
    E["am_movil"] = icono_texto("1f4f1", "2014: *SU PROPIO MÓVIL*", "", "", "izq", "", True, "pop", "bob")
    E["am_fracaso"] = icono_texto("1f4c9", "UN *FRACASO*", "vendió muy poco: pérdidas de cientos de millones", "", "der", "dark", False, "drop", "shake")
    E["am_alexa"] = icono_texto("1f5e3-fe0f", "ALEXA: *UN ÉXITO ENORME*", "un altavoz que responde a la voz, ese mismo año", "", "izq", "calido", True, "zoom", "pulse")
    E["am_fracasar"] = bocadillos("1f468-200d-1f4bc", ["Si quieres inventar…", "…tienes que estar dispuesto a fracasar"], "una idea que Bezos repetía")
    E["am_2011"] = fecha("", "SEPTIEMBRE", "2011", "Amazon llega a España", "1f1ea-1f1f8")
    E["am_empieza"] = comparar("1f4da", "primero: libros, música, películas", "1f6d2", "muy pronto: todo lo demás", "→")
    E["am_logistica"] = f'''{F()}{obj(spr("1f5fa-fe0f", 280), 30, 48, "zoom", "", .2)}{"".join(obj(spr("1f3ed", 80), x, y, "pop", "", .6 + i * .15) for i, (x, y) in enumerate([(24, 38), (34, 46), (28, 58), (40, 40), (22, 52)]))}
      {txt(kt("CENTROS LOGÍSTICOS *Y MILES DE VENDEDORES ESPAÑOLES*", "xl", 1.2), 72, 48, 50)}'''
    E["am_escaparate"] = comparar("1fa9f", "un gran escaparate", "1f94a", "un competidor difícil de batir", "/", "PARA LOS COMERCIOS")
    E["am_criticas"] = impacto("un gigante así", "TAMBIÉN ACUMULA *CRÍTICAS*", "", "2696-fe0f")
    E["am_almacenes"] = icono_texto("1f4e6", "CONDICIONES *EN SUS ALMACENES*", "ritmos de trabajo muy exigentes", "", "izq", "", False, "pop", "")
    E["am_poder"] = comparar("1f3ea", "tiendas tradicionales", "1f3e2", "su enorme poder", "VS")
    E["am_impuestos"] = icono_texto("1f9fe", "LOS *IMPUESTOS*", "un debate que ha llegado a gobiernos y tribunales", "", "der", "", False, "drop", "swing")
    E["am_defiende"] = lista([("1f477", "crea empleo"), ("1f4b6", "mejora salarios"), ("1f30d", "pequeños negocios en todo el mundo")], "LA EMPRESA DEFIENDE QUE…")
    E["am_2021"] = icono_texto("1f6aa", "BEZOS DEJA *DE SER DIRECTOR GENERAL*", "2021", "", "izq", "", False, "pop", "")
    E["am_espacio"] = f'''{F("espacio", True)}{obj(spr("1f680", 280), 30, 50, "rise", "float", .2)}{txt(kt("ESE AÑO, *AL ESPACIO*", "xl hueso", .7), 70, 42, 52)}{txt(kt("en un cohete de su otra empresa, Blue Origin", "l naranja", 1.3), 70, 58, 52)}'''
    E["am_rico"] = flecha("1f6aa", "1f4b0", "DE LAS MESAS-PUERTA… *A LOS MÁS RICOS DEL PLANETA*", "")
    E["am_grande"] = titular("DE LAS EMPRESAS *MÁS GRANDES*", "la librería que muchos daban por muerta", "", ("1f30d", "1f4e6", "2601-fe0f", "1f3c6"), "", True, "xl")
    E["leccion1"] = leccion(1, "no pesa tanto el riesgo de fracasar", "COMO EL DE *NO INTENTARLO*", "1f3b2")
    E["leccion2"] = leccion(2, "empezar pequeño", "NO ES *PENSAR EN PEQUEÑO*", "1f4da")
    E["leccion3"] = leccion(3, "el negocio más rentable", "PUEDE SER *EL QUE NADIE VE*", "2601-fe0f")
    E["am_final"] = lista([("1f4bc", "un trabajo dejado"), ("1f3e0", "un garaje"), ("1f6aa", "mesas-puerta"), ("1f514", "una campana")], "")
    E["am_caja2"] = f'''{F("calido", True)}{obj(caja(300), 30, 52, "drop", "bob", .2)}{txt(kt("ACUÉRDATE *DE CÓMO EMPEZÓ*", "xl", .8), 70, 46, 54)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:140px">{puerta_mesa(420)}</div>
      <div style="position:absolute;left:120px;top:380px">{vicon("books", 200)}</div>
      <div class="big" style="top:100px"><div class="s">AMAZON EMPEZÓ</div><div class="q" style="font-size:170px;margin-top:22px">EN UN</div><div class="q" style="font-size:170px">GARAJE</div><div class="y">VENDIENDO LIBROS</div></div>'''
