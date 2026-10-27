"""Escenas del vídeo 41 (Telepizza, formato largo). Motor común; sin logotipos: cajas de pizza y motos genéricas."""
from base import *

CAP_ICONOS = {1: "1f1e8-1f1fa", 2: "1f50d", 3: "1f451", 4: "260e-fe0f", 5: "1f6f5", 6: "1f94a", 7: "2694-fe0f", 8: "1f4c8",
              9: "1f310", 10: "1f504", 11: "1f91d", 12: "1f6b2", 13: "1f9e0"}

def caja_pizza(px=300, abierta=False):
    if abierta:
        return (f'<svg width="{px}" height="{px*0.9:.0f}" viewBox="0 0 200 180"><path d="M20,10 L180,10 L180,80 L20,80Z" fill="#e9d2a6" stroke="{TINTA}" stroke-width="4"/>'
                f'<path d="M10,90 L190,90 L180,170 L20,170Z" fill="#e9d2a6" stroke="{TINTA}" stroke-width="4"/><ellipse cx="100" cy="128" rx="74" ry="34" fill="#f2b553" stroke="#b5741f" stroke-width="5"/>'
                f'<ellipse cx="100" cy="128" rx="62" ry="27" fill="#d9442b"/>' + "".join(f'<circle cx="{x}" cy="{y}" r="7" fill="#f7e7b0"/>' for x, y in [(80, 120), (112, 132), (128, 118), (92, 140), (66, 132)]) + '</svg>')
    return (f'<svg width="{px}" height="{px*0.35:.0f}" viewBox="0 0 200 70"><path d="M8,20 L192,20 L192,62 L8,62Z" fill="#e9d2a6" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M8,20 L30,8 L170,8 L192,20" fill="#f3e0bb" stroke="{TINTA}" stroke-width="4"/><text x="100" y="50" font-family="Bebas" font-size="22" fill="{ROJO}" text-anchor="middle">PIZZA</text></svg>')

def escenas():
    E = {}
    E["tp_moto"] = f'''{F("", True)}<div class="carrera" style="--d:.2s">{spr("1f6f5", 260)}</div>{obj(caja_pizza(460), 50, 36, "drop", "bob", .8)}{txt(kt("UNA MOTO, UNA CAJA *Y EL TIMBRE*", "xl", 1.2), 50, 84, 90)}'''
    E["tp_nadie"] = comparar("1f4f1", "hoy: lo más normal", "1f1ea-1f1f8", "España, finales de los 80: casi nadie", "VS", "PEDIR COMIDA A CASA")
    E["tp_pujals"] = lista([("1f1e8-1f1fa", "nacido en Cuba"), ("1f396-fe0f", "veterano de Vietnam"), ("1f3e2", "multinacionales")], "EL HOMBRE QUE LO CAMBIÓ")
    E["tp_barrio"] = comparar("1f3d8-fe0f", "un barrio de Madrid", "1f3c6", "derrota a los gigantes americanos", "→")
    E["tp_alianza"] = icono_texto("1f91d", "Y ACABÓ *ALIÁNDOSE CON UNO*", "décadas después", "", "izq", "", True, "pop", "bob")
    E["tp_historia"] = titular("LA HISTORIA DE *TELEPIZZA*", "", "", ("1f355", "1f6f5", "260e-fe0f", "1f3e0"), "", True, "xl")
    E["tp_habana"] = f'''{F("sepia", True)}{obj(spr("1f1e8-1f1fa", 220), 22, 46, "drop", "bob", .2)}{txt(kt("LA HABANA", "mega", .4, .12, "slam"), 64, 40, 64)}{txt(kt("1947: nace Leopoldo Fernández Pujals", "l", 1.2), 64, 58, 64)}<div class="viñeta"></div>'''
    E["tp_exilio"] = flecha("1f1e8-1f1fa", "1f1fa-1f1f8", "LA FAMILIA *SE EXILIA*", "tras la revolución cubana")
    E["tp_vietnam"] = icono_texto("1f396-fe0f", "VIETNAM: *MEDALLA Y CAPITÁN*", "según su biografía", "en el ejército estadounidense", "izq", "dark", False, "pop", "glow")
    E["tp_multinacionales"] = lista([("1f393", "empresariales"), ("1f4ca", "marketing"), ("1f6d2", "ventas")], "GRANDES MULTINACIONALES")
    E["tp_espana"] = flecha("1f1fa-1f1f8", "1f1ea-1f1f8", "DESTINO: *ESPAÑA*", "")
    E["tp_ochenta"] = comparar("1f355", "comer pizza: poco habitual", "260e-fe0f", "pedirla por teléfono: impensable", "+", "ESPAÑA, AÑOS 80")
    E["tp_eeuu"] = icono_texto("1f1fa-1f1f8", "EN EE. UU., *UN NEGOCIO ENORME*", "la pizza a domicilio", "", "der", "", True, "pop", "bob")
    E["tp_hueco"] = impacto("Fernández Pujals vio", "EL *HUECO*", "y dejó su trabajo", "1f50d")
    E["tp_recetas"] = icono_texto("1f9d1-200d-1f373", "NO SABÍA *HACER PIZZAS*", "probando recetas y preguntando a la gente", "según él mismo", "izq", "", False, "pop", "bob")
    E["tp_masa"] = f'''{F("calido", True)}{obj(caja_pizza(320, True), 30, 50, "drop", "float", .2)}{txt(kt("MASA *ESPONJOSA* Y MUCHO SABOR", "xl", .8), 70, 46, 52)}'''
    E["tp_quien"] = impacto("una pregunta:", "¿QUIÉN INVENTÓ LA PIZZA *A DOMICILIO*?", "", "1f914")
    E["tp_napoles"] = icono_texto("1f451", "NÁPOLES, 1889: *PARA LA REINA*", "el pizzero Raffaele Esposito", "según una leyenda", "izq", "sepia", False, "pop", "bob")
    E["tp_margarita"] = lista([("1f345", "tomate"), ("1f9c0", "mozzarella"), ("1f33f", "albahaca")], "LA PIZZA MARGARITA")
    E["tp_dudan"] = icono_texto("1f9d0", "LOS HISTORIADORES *DUDAN*", "pero muchos la citan como la primera a domicilio", "", "der", "", False, "pop", "swing")
    E["tp_treinta"] = comparar("23f1-fe0f", "«en 30 minutos»", "2696-fe0f", "y a los tribunales", "→", "EL GRAN NEGOCIO: EE. UU.")
    E["tp_pilar"] = cifra("1987", "PRIMER LOCAL, EN EL BARRIO DEL PILAR", "1f3d8-fe0f", "Madrid")
    E["tp_pizzaphone"] = titular("*PIZZAPHONE*", "pizza y teléfono, en inglés", "no se llamaba Telepizza:", ("1f355", "260e-fe0f", "1f1ec-1f1e7", "1f914"))
    E["tp_pronunciar"] = bocadillos("1f615", ["¿Pis-sa-fo-ne?", "¿Pizza… qué?"], "mucha gente no sabía pronunciarlo")
    E["tp_1988"] = titular("*TELEPIZZA*", "1988: un nombre mucho más fácil", "", ("260e-fe0f", "1f355", "1f44d", "2728"))
    E["tp_entiende"] = comparar("260e-fe0f", "teléfono", "1f355", "pizza", "+", "SE ENTIENDE A LA PRIMERA")
    E["tp_sencillo"] = impacto("el sistema:", "SENCILLO *Y EFICAZ*", "", "2699-fe0f")
    E["tp_locales"] = lista([("1f3ea", "locales pequeños"), ("1f373", "una cocina"), ("260e-fe0f", "un teléfono"), ("1f6f5", "motos")], "")
    E["tp_zona"] = icono_texto("1f4cd", "UNA ZONA *CERCANA*", "para que llegue caliente y rápido", "cada local reparte en…", "izq", "", False, "pop", "bob")
    E["tp_folletos"] = icono_texto("1f4ec", "FOLLETOS *EN LOS BUZONES*", "dos por una, ingredientes gratis…", "", "der", "", False, "pop", "bob")
    E["tp_primer"] = icono_texto("1f9d1", "REPARTIR PIZZAS: *SU PRIMER TRABAJO*", "para muchos jóvenes", "", "izq", "", False, "pop", "bob", 380, (("1f6f5", 86, 80),))
    E["tp_paisaje"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 88, "none")}<div class="carrera" style="--d:.2s">{spr("1f6f5", 200)}</div><div class="carrera" style="--d:1.2s">{spr("1f6f5", 160)}</div>{txt(kt("PARTE DEL PAISAJE *DE LAS CIUDADES*", "xl", .8), 50, 22, 90)}'''
    E["tp_gigantes"] = comparar("1f1fa-1f1f8", "las cadenas americanas", "1f1ea-1f1f8", "Telepizza", "VS", "LLEGAN LOS GIGANTES")
    E["tp_dinero"] = lista([("1f4b0", "más dinero"), ("1f9e0", "más experiencia"), ("1f30d", "marcas mundiales")], "ELLOS TENÍAN…")
    E["tp_casa"] = lista([("1f60b", "los gustos"), ("1f3d8-fe0f", "los barrios"), ("1f3f7-fe0f", "los precios")], "TELEPIZZA JUGABA EN CASA")
    E["tp_franquicias"] = icono_texto("1f3ea", "FRANQUICIAS", "otros empresarios abren locales con su marca", "crecer deprisa", "izq", "", True, "pop", "bob")
    E["tp_lider"] = titular("LÍDER *EN ESPAÑA*", "por delante de los gigantes americanos", "mediados de los 90", ("1f3c6", "1f355", "1f1ea-1f1f8", "2728"), "", True, "xl")
    E["tp_conflicto"] = impacto("pero dentro", "ESTALLA *UN CONFLICTO*", "", "26a1")
    E["tp_apartan"] = icono_texto("1f6aa", "1995: *APARTADO DE LA PRESIDENCIA*", "por un grupo de accionistas", "según estudios sobre la empresa", "izq", "dark", False, "pop", "")
    E["tp_hermano"] = icono_texto("1f468", "¿SU PROPIO *HERMANO*?", "también gran accionista, según algunas fuentes", "", "der", "", False, "pop", "swing")
    E["tp_batalla"] = impacto("", "UNA BATALLA *MUY DURA*", "pero no duró mucho", "2694-fe0f")
    E["tp_vuelve"] = cifra("1996", "FERNÁNDEZ PUJALS RECUPERA EL CONTROL", "1f451", "con el apoyo de un gran banco")
    E["tp_bolsa"] = icono_texto("1f4c8", "SALE *A BOLSA*", "en Madrid", "1996", "izq", "", True, "pop", "bob")
    E["tp_exito"] = lista([("1f465", "miles de ahorradores"), ("1f4c8", "acciones disparadas")], "UNO DE LOS GRANDES ÉXITOS DE LA DÉCADA")
    E["tp_paises"] = lista([("1f1f5-1f1f9", "Portugal"), ("1f1f5-1f1f1", "Polonia"), ("1f1e8-1f1f1", "Chile"), ("1f1f2-1f1fd", "México")], "FUERA DE ESPAÑA")
    E["tp_vende"] = cifra("1999", "FERNÁNDEZ PUJALS VENDE Y SE MARCHA", "1f44b")
    E["tp_caida"] = icono_texto("1f4c9", "CAEN *LAS ACCIONES*", "coincidiendo con su salida", "", "der", "", False, "drop", "")
    E["tp_noretira"] = impacto("Fernández Pujals", "NO SE *RETIRÓ*", "", "1f680")
    E["tp_jazztel"] = icono_texto("1f310", "JAZZTEL", "una operadora con muchos problemas", "invierte en…", "izq", "", False, "pop", "bob")
    E["tp_relanza"] = icono_texto("26a1", "INTERNET RÁPIDO *A BUEN PRECIO*", "principal accionista; la relanza", "", "der", "", True, "pop", "bob")
    E["tp_orange"] = cifra("2015", "ORANGE COMPRA JAZZTEL POR MILES DE MILLONES", "1f4b6")
    E["tp_telefono"] = comparar("1f355", "pizza por teléfono", "1f310", "y conexión a internet", "+")
    E["tp_libro"] = icono_texto("1f4d6", "«APUNTA A LAS ESTRELLAS…»", "«…y llegarás a la luna»: su libro", "", "izq", "espacio", True, "pop", "float")
    E["tp_duenos"] = impacto("Telepizza", "CAMBIA *DE DUEÑOS*", "varias veces", "1f504")
    E["tp_2007"] = comparar("1f4c9", "2007: sale de bolsa", "1f4bc", "entra un fondo", "→")
    E["tp_2019"] = comparar("1f4c8", "2016: vuelve a bolsa", "1f1fa-1f1f8", "2019: la compra un consorcio con un fondo de EE. UU.", "→")
    E["tp_deuda"] = icono_texto("1f9fe", "CADA VEZ *MÁS DEUDA*", "", "", "izq", "dark", False, "pop", "")
    E["tp_cambio"] = impacto("el reparto a domicilio", "ESTABA A PUNTO *DE CAMBIAR*", "", "1f4f1")
    E["tp_2018"] = cifra("2018", "UN ACUERDO SORPRENDENTE", "1f62e")
    E["tp_pizzahut"] = comparar("1f1ea-1f1f8", "Telepizza", "1f1fa-1f1f8", "Pizza Hut", "+", "EL ANTIGUO RIVAL")
    E["tp_franquiciado"] = lista([("1f1ea-1f1f8", "España"), ("1f30e", "buena parte de Latinoamérica")], "SU FRANQUICIADO PRINCIPAL EN…")
    E["tp_socios"] = titular("DE RIVALES *A SOCIOS*", "", "", ("1f94a", "1f91d", "1f355", "2728"))
    E["tp_fdb"] = cifra("2021", "EL GRUPO PASA A LLAMARSE FOOD DELIVERY BRANDS", "1f3f7-fe0f")
    E["tp_apps"] = impacto("y entonces llegaron", "LAS *APLICACIONES*", "", "1f4f2")
    E["tp_toque"] = lista([("1f354", "hamburguesas"), ("1f363", "sushi"), ("1f35b", "comida india"), ("1f957", "de todo")], "UN TOQUE EN EL MÓVIL")
    E["tp_pandemia"] = icono_texto("1f637", "LA PANDEMIA *LO ACELERA*", "cenar fuera = pedir a casa", "", "der", "", False, "pop", "bob")
    E["tp_competencia"] = comparar("1f355", "antes: otras pizzerías", "1f3d9-fe0f", "ahora: toda la ciudad", "→", "LA COMPETENCIA")
    E["tp_bicis"] = f'''{F()}<div class="carrera" style="--d:.2s">{spr("1f6b2", 220)}</div><div class="carrera" style="--d:.9s">{spr("1f6f5", 200)}</div><div class="carrera" style="--d:1.6s">{spr("1f6b2", 180)}</div>{txt(kt("MILES DE BICIS *CON CAJAS*", "xl", .6), 50, 22, 90)}'''
    E["tp_reinventar"] = titular("REINVENTARSE EN EL NEGOCIO *QUE CREÓ*", "", "", ("1f504", "1f355", "1f4f1", "1f4a1"), "", True, "xl")
    E["leccion1"] = leccion(1, "copia lo que funciona fuera", "*Y ADÁPTALO*", "1f355")
    E["leccion2"] = leccion(2, "el nombre", "*IMPORTA*", "1f3f7-fe0f")
    E["leccion3"] = leccion(3, "en los negocios no hay", "*ENEMIGOS ETERNOS*", "1f91d")
    E["tp_final"] = lista([("1f1e8-1f1fa", "un exiliado"), ("1f396-fe0f", "un capitán"), ("1f3d8-fe0f", "un barrio"), ("260e-fe0f", "un nombre"), ("1f6f5", "motos")], "")
    E["tp_llamar"] = f'''{F("calido", True)}{obj(caja_pizza(320, True), 30, 50, "drop", "float", .2)}{txt(kt("YA SABES *DE DÓNDE VIENE LA COSTUMBRE*", "xl", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:150px">{caja_pizza(440, True)}</div>
      <div style="position:absolute;left:330px;top:450px">{vicon("telephone-receiver", 170)}</div>
      <div class="big" style="top:100px"><div class="s">ENSEÑÓ A ESPAÑA A</div><div class="q" style="font-size:150px;margin-top:22px">PEDIR PIZZA</div><div class="q" style="font-size:130px">POR TELÉFONO</div><div class="y">LA HISTORIA DE TELEPIZZA</div></div>'''
