"""Escenas del vídeo 21 (Starbucks, formato largo). Motor común; sin logotipos (no se dibuja la sirena): vasos y cafeterías genéricos."""
from base import *

CAP_ICONOS = {1: '1f3d9-fe0f', 2: '1f40b', 3: '1f4bc', 4: '1f1ee-1f1f9', 5: '1f91d', 6: '1f6cb-fe0f', 7: '1f964', 8: '1f3ce-fe0f', 9: '270a', 10: '1f1e6-1f1fa', 11: '1f1ea-1f1f8', 12: '1f9e0'}
VERDE_C = "#1e6b4f"

def vaso(px=180, nombre="", color=VERDE_C):
    n = f'<text x="50" y="92" font-family="PlexMono" font-size="12" fill="{TINTA}" text-anchor="middle" transform="rotate(-6 50 92)">{nombre}</text>' if nombre else ""
    return (f'<svg width="{px}" height="{px*1.4:.0f}" viewBox="0 0 100 140"><path d="M14,22 L86,22 L78,134 L22,134Z" fill="#fff" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="10" y="12" width="80" height="14" rx="4" fill="#fff" stroke="{TINTA}" stroke-width="3"/><path d="M17,58 L83,58 L80,100 L20,100Z" fill="{color}"/>'
            f'<circle cx="50" cy="79" r="13" fill="#fff" opacity=".85"/>{n}</svg>')

def cafeteria(px=560, rotulo="CAFÉ"):
    return (f'<svg width="{px}" height="{px*0.6:.0f}" viewBox="0 0 400 240"><rect x="20" y="60" width="360" height="170" fill="#f2e6d6" stroke="{TINTA}" stroke-width="5"/>'
            f'<path d="M10,60 L390,60 L370,20 L30,20Z" fill="{VERDE_C}" stroke="{TINTA}" stroke-width="5"/><text x="200" y="50" font-family="Bebas" font-size="30" fill="#fff" text-anchor="middle">{rotulo}</text>'
            f'<rect x="50" y="100" width="130" height="90" fill="#9fc3e6" stroke="{TINTA}" stroke-width="4"/><rect x="230" y="100" width="70" height="130" fill="#8a5a3b" stroke="{TINTA}" stroke-width="4"/></svg>')

def escenas():
    E = {}
    E["st_vaso"] = f'''{F("", True)}{obj(vaso(240, "Jvaier"), 28, 50, "drop", "bob", .2)}{txt(kt("TU NOMBRE *MAL ESCRITO*…", "xl", .7), 68, 38, 56)}{txt(kt("y un café bastante más caro que en el bar", "l", 1.4), 68, 56, 56)}'''
    E["st_miles"] = f'''{F()}{"".join(obj(cafeteria(180), 12 + (i % 5) * 19, 34 + (i // 5) * 26, "pop", "", .1 + i * .1) for i in range(10))}{txt(kt("DECENAS DE MILES *EN TODO EL MUNDO*", "xl", 1.3), 50, 88, 90)}'''
    E["st_grano"] = icono_texto("1fad8", "AL PRINCIPIO: *CAFÉ EN GRANO*", "no vendía cafés para tomar", "", "izq", "", True, "drop", "bob")
    E["st_ballenas"] = f'''{F("", True)}{obj(spr("1f40b", 300), 30, 48, "left", "float", .2)}{txt(kt("UN NOMBRE SACADO DE UNA *NOVELA DE BALLENAS*", "xl", .8), 70, 46, 54)}'''
    E["st_milan"] = comparar("2708-fe0f", "una idea de un viaje a Milán…", "1f645", "…que sus dueños no quisieron aplicar", "→")
    E["st_historia"] = titular("LA HISTORIA *COMPLETA*", "", "", ("2615", "1f40b", "1f1ee-1f1f9", "2728"))
    E["st_seattle"] = f'''{F("calido")}{obj(skyline(1800, "#5b4636"), 50, 86, "none")}{txt(kt("SEATTLE, 1971", "mega", .3, .1, "slam"), 50, 32, 95)}{obj(spr("2614", 150), 86, 20, "pop", "bob", .8)}'''
    E["st_amigos"] = lista([("1f468-200d-1f3eb", "profesor de inglés"), ("1f4dc", "profesor de historia"), ("270d-fe0f", "escritor")], "TRES AMIGOS Y UNA AFICIÓN: EL BUEN CAFÉ")
    E["st_bote"] = icono_texto("1f96b", "CAFÉ *DE BOTE*", "barato, rápido y bastante flojo: lo habitual entonces", "", "der", "sepia", False, "pop", "")
    E["st_calidad"] = icono_texto("1f525", "CAFÉ DE CALIDAD, *RECIÉN TOSTADO*", "", "ellos se habían aficionado al", "izq", "", True, "pop", "pulse", 340, (("1fad8", 86, 80),))
    E["st_pike"] = f'''{F("calido", True)}{obj(cafeteria(540, "CAFÉ EN GRANO"), 32, 52, "zoom", "", .2)}{txt(kt("UNA TIENDA *JUNTO AL MERCADO*", "xl", .8), 76, 42, 44)}{txt(kt("Pike Place, Seattle", "l", 1.4), 76, 58, 44)}'''
    E["st_vendian"] = lista([("1fad8", "café en grano"), ("2615", "cafeteras"), ("2699-fe0f", "molinillos")], "LO QUE VENDÍAN (NO CAFÉS PARA TOMAR)")
    E["st_aficionados"] = icono_texto("1f9d0", "UNA TIENDA *PARA AFICIONADOS*", "y durante años, eso fue todo", "", "der", "", False, "pop", "bob")
    E["st_turistas"] = f'''{F("", True)}{obj(cafeteria(400), 26, 50, "pop", "", .2)}{"".join(obj(spr("1f9d1", 110), 52 + i * 8, 58, "left", "bob", .5 + i * .15) for i in range(5))}{txt(kt("HOY: *COLAS DE TURISTAS*", "xl", 1.3), 70, 30, 54)}{obj(spr("1f4f8", 120), 90, 40, "pop", "", 1.6)}'''
    E["st_nombre"] = impacto("", "¿Y EL *NOMBRE*?", "", "1f914")
    E["st_mar"] = lista([("1f30a", "el mar"), ("2693", "los puertos"), ("26f5", "los viajes del café")], "QUERÍAN RECORDAR…")
    E["st_pequod"] = icono_texto("1f6a2", "«*PEQUOD*»", "el barco ballenero de Moby Dick", "primera propuesta:", "izq", "", True, "left", "float")
    E["st_noconvence"] = icono_texto("1f44e", "NO *CONVENCIÓ*", "a sus socios, según cuentan", "", "der", "", False, "pop", "shake")
    E["st_starbuck"] = f'''{F("", True)}{obj(spr("1f9d4", 260), 26, 46, "pop", "bob", .2)}{txt(kt("*STARBUCK*", "mega", .6, .12, "slam"), 66, 38, 56)}{txt(kt("el primer oficial del barco, en la novela", "l", 1.3), 66, 56, 56)}'''
    E["st_estrellas"] = comparar("2b50", "nada que ver con las estrellas", "1f40b", "un personaje de una novela de ballenas", "≠")
    E["st_sirena"] = icono_texto("1f9dc-200d-2640-fe0f", "UNA *SIRENA*", "inspirada en un antiguo grabado: una imagen marinera", "el símbolo:", "izq", "", True, "pop", "float")
    E["st_vendedor"] = icono_texto("1f4bc", "UN VENDEDOR *DE CAFETERAS*", "Nueva York, principios de los ochenta", "", "der", "", True, "up", "bob")
    E["st_cafeteras"] = comparar("1f3ea", "una pequeña tienda de Seattle", "1f3ec", "unos grandes almacenes", ">", "¿QUIÉN COMPRABA MÁS CAFETERAS?")
    E["st_schultz"] = titular("HOWARD *SCHULTZ*", "el vendedor se llamaba", "", ("1f4bc", "2615", "1f9d0", "2728"))
    E["st_viaja"] = flecha("1f5fd", "1f3d9-fe0f", "VIAJA A SEATTLE: *FASCINADO*", "")
    E["st_contratado"] = icono_texto("1f4dd", "1982: *CONTRATADO*", "como responsable de marketing, tras mucho insistir", "", "izq", "", True, "flip", "bob")
    E["st_milan83"] = flecha("2708-fe0f", "1f1ee-1f1f9", "1983: UNA FERIA *EN MILÁN*", "")
    E["st_espresso"] = impacto("allí descubrió", "LOS BARES *DE ESPRESSO*", "", "2615")
    E["st_esquina"] = f'''{F("calido", True)}{obj(spr("2615", 200), 18, 46, "pop", "bob", .2)}{obj(spr("1f9cd", 200), 36, 50, "up", "bob", .5)}{obj(spr("1f4ac", 160), 50, 30, "pop", "float", .9)}
      {txt(kt("UN CAFÉ DE PIE, *UNA CHARLA*", "xl", 1.1), 76, 42, 44)}{txt(kt("en cada esquina", "l", 1.6), 76, 58, 44)}'''
    E["st_ritual"] = titular("UN *RITUAL*", "un punto de encuentro, no solo una bebida", "", ("2615", "1f465", "1f4ac", "2764-fe0f"))
    E["st_idea"] = icono_texto("1f4a1", "SERVIR CAFÉ *PARA TOMAR*", "como en Italia", "su idea:", "izq", "", True, "pop", "glow")
    E["st_noquieren"] = impacto("pero los dueños", "*NO QUISIERON*", "", "1f645")
    E["st_grano2"] = comparar("1fad8", "querían seguir con el café en grano", "1f6ab", "no se veían como dueños de bares", "·")
    E["st_norinde"] = icono_texto("1f4aa", "SCHULTZ *NO SE RINDIÓ*", "", "", "izq", "", True, "pop", "bob")
    E["st_giornale"] = f'''{F("", True)}{obj(cafeteria(440, "IL GIORNALE"), 30, 50, "zoom", "", .2)}{txt(kt("1985: SU PROPIA CADENA", "xl", .7), 72, 36, 50)}{txt(kt("«*IL GIORNALE*»: el periódico", "l", 1.3), 72, 54, 50)}'''
    E["st_inversor"] = icono_texto("1f504", "SU INVERSOR: *¡STARBUCKS!*", "y el café que servía era de Starbucks", "curiosamente,", "der", "", True, "spin", "")
    E["st_venden"] = icono_texto("1f3f7-fe0f", "LOS DUEÑOS *DECIDEN VENDER*", "dos años después", "", "izq", "", False, "drop", "swing")
    E["st_38"] = cifra("≈3,8 M$", "SCHULTZ COMPRA LA EMPRESA", "1f4b0", "1987")
    E["st_une"] = flecha("1f91d", "2615", "UNE LAS DOS: *SE QUEDA EL NOMBRE STARBUCKS*", "")
    E["st_dueno"] = impacto("el empleado al que no hicieron caso", "AHORA ERA *EL DUEÑO*", "", "1f451")
    E["st_fundador"] = icono_texto("2615", "UN FUNDADOR, *A SU CAFÉ*", "compró una marca de California que había sido una de sus inspiraciones", "", "der", "", False, "pop", "bob")
    E["st_novende"] = impacto("Schultz no quería vender solo", "*CAFÉ*", "", "1f914")
    E["st_tercer"] = f'''{F("calido", True)}{obj(spr("1f3e0", 200), 16, 46, "pop", "bob", .2)}{obj(cafeteria(300), 50, 48, "zoom", "", .5)}{obj(spr("1f3e2", 200), 84, 46, "pop", "bob", .8)}
      {txt(kt("EL *TERCER LUGAR*", "xl", 1.2), 50, 84, 90)}{txt(kt("entre la casa y el trabajo", "l", 1.7), 50, 94, 90)}'''
    E["st_sofas"] = lista([("1f6cb-fe0f", "sofás"), ("1f3b5", "música"), ("1f50c", "enchufes"), ("23f3", "quedarse horas")], "")
    E["st_carta"] = icono_texto("1f4dc", "UNA CARTA *A LA ITALIANA*", "tamaños con nombre propio y bebidas personalizadas", "", "izq", "", True, "flip", "bob")
    E["st_nombrevaso"] = f'''{F()}{obj(vaso(200, "Marai"), 22, 48, "drop", "", .2)}{obj(vaso(200, "Jhose"), 42, 48, "drop", "", .5)}{txt(kt("PARA SABER *DE QUIÉN ES CADA BEBIDA*", "xl", .9), 74, 40, 46)}{txt(kt("aunque a veces el nombre sea… creativo", "l", 1.6), 74, 58, 46)}'''
    E["st_bolsa"] = icono_texto("1f4c8", "1992: *SALE A BOLSA*", "y abre cafeterías a un ritmo vertiginoso", "", "der", "", True, "zoom", "bob")
    E["st_tamanos"] = impacto("un detalle que confunde a casi todos:", "LOS *TAMAÑOS*", "", "1f4cf")
    E["st_tall"] = f'''{F("", True)}{obj(vaso(150), 26, 52, "drop", "", .2)}{txt(kt("«TALL»", "mega", .6, .12, "slam"), 62, 38, 56)}{txt(kt("significa alto… y es el pequeño de la carta", "xl", 1.2), 62, 58, 56)}'''
    E["st_venti"] = f'''{F()}{obj(vaso(150), 26, 52, "drop", "", .2)}{obj(vaso(200), 46, 50, "drop", "", .5)}{txt(kt("GRANDE = MEDIANO", "xl", .8), 74, 34, 44)}{txt(kt("VENTI = *VEINTE* (onzas), en italiano", "xl", 1.4), 74, 54, 44)}'''
    E["st_toque"] = icono_texto("1f1ee-1f1f9", "NO ES UN ERROR: *TOQUE ITALIANO*", "parte de la idea de Schultz", "", "izq", "", True, "pop", "bob")
    E["st_fenomenos"] = titular("SUS PROPIOS *FENÓMENOS*", "en el mundo de las bebidas", "", ("1f964", "1f9cb", "1f383", "2728"))
    E["st_frappuccino"] = icono_texto("1f964", "EL *FRAPPUCCINO*", "una bebida fría de café que llegó con la compra de una cadena de Boston", "mediados de los noventa:", "der", "", True, "drop", "bob")
    E["st_calabaza"] = f'''{F("calido", True)}{obj(spr("1f383", 260), 26, 46, "pop", "bob", .2)}{obj(spr("1f342", 150), 44, 24, "drop", "float", .7)}{txt(kt("2003: CAFÉ CON *ESPECIAS DE CALABAZA*", "xl", .8), 70, 42, 54)}{txt(kt("casi una tradición de otoño en EE. UU.", "l", 1.4), 70, 58, 54)}'''
    E["st_estacion"] = icono_texto("1f4c5", "HAY QUIEN ESPERA *SU VUELTA*", "como quien espera el cambio de estación", "", "izq", "", False, "pop", "bob")
    E["st_precio"] = impacto("crecer tan rápido", "TIENE UN *PRECIO*", "", "1f4b8")
    E["st_enfrente"] = f'''{F()}{obj(cafeteria(320), 28, 50, "pop", "", .2)}{txt('<div class="vs" style="--d:.7s">↔</div>', 50, 50, 10)}{obj(cafeteria(320), 72, 50, "pop", "", .9)}{txt(kt("A VECES, *UNA ENFRENTE DE OTRA*", "xl", 1.4), 50, 88, 90)}'''
    E["st_esencia"] = lista([("1f916", "más máquinas"), ("1f3c3", "más prisa"), ("1f443", "menos olor a café")], "«HA PERDIDO SU ESENCIA»")
    E["st_crisis"] = cifra("2008", "CRISIS: CAEN LAS VENTAS", "1f4c9")
    E["st_vuelve"] = icono_texto("1f501", "SCHULTZ *VUELVE*", "a ponerse al frente", "", "der", "", True, "spin", "")
    E["st_cierra"] = f'''{F("dark", True)}{"".join(obj(cafeteria(120), 8 + (i % 7) * 14, 26 + (i // 7) * 18, "pop", "", .05 + i * .04) for i in range(21))}{txt(kt("+7.000 CAFETERÍAS CERRADAS *UNAS HORAS*", "xl naranja", 1.2), 50, 84, 95)}{txt(kt("para volver a formar a sus empleados", "l hueso", 1.8), 50, 94, 90)}'''
    E["st_cierres"] = icono_texto("1f6aa", "Y *CIENTOS DE CIERRES*", "de tiendas que no funcionaban", "", "izq", "", False, "pop", "")
    E["st_socios"] = comparar("1f91d", "los llama «socios»", "1fa7a", "seguro médico y acciones, incluso a media jornada", "+")
    E["st_noquiere"] = impacto("en 2021 pasó algo", "QUE LA EMPRESA *NO QUERÍA*", "", "1f62c")
    E["st_buffalo"] = f'''{F("", True)}{obj(cafeteria(400), 28, 52, "pop", "", .2)}{obj(spr("270a", 200), 46, 30, "pop", "pulse", .8)}{txt(kt("BUFFALO: *SU PROPIO SINDICATO*", "xl", 1.0), 74, 44, 46)}'''
    E["st_primera_sind"] = icono_texto("1f947", "LA *PRIMERA* TIENDA PROPIA", "con representación sindical en Estados Unidos", "", "izq", "", True, "pop", "bob")
    E["st_movimiento"] = f'''{F()}{"".join(obj(cafeteria(120), 8 + (i % 7) * 14, 26 + (i // 7) * 18, "pop", "", .05 + i * .06) for i in range(21))}{txt(kt("CIENTOS DE CAFETERÍAS *HACEN LO MISMO*", "xl", 1.4), 50, 86, 90)}'''
    E["st_enfrentamiento"] = comparar("1f3e2", "la empresa", "270a", "el sindicato", "VS", "AÑOS DE ENFRENTAMIENTO")
    E["st_golpe"] = icono_texto("1f494", "UN GOLPE *A SU IMAGEN*", "para una marca que presumía de ser un buen lugar para trabajar", "", "der", "dark", True, "pop", "")
    E["st_notodo"] = impacto("ha conquistado gran parte del mundo", "PERO *NO TODO*", "", "1f30d")
    E["st_australia"] = icono_texto("1f1e6-1f1fa", "AUSTRALIA: *NO ENAMORÓ*", "un país con una cultura del café muy fuerte", "", "izq", "", True, "pop", "bob", 340, (("2615", 86, 80),))
    E["st_cierra_au"] = cifra("2008", "CIERRA LA MAYORÍA DE SUS TIENDAS EN AUSTRALIA", "1f6aa")
    E["st_barrio"] = comparar("2615", "sus cafeterías de barrio", "1f645", "no necesitaban que se lo explicaran", "·")
    E["st_italia"] = impacto("¿y en el país que inspiró todo?", "*ITALIA*", "", "1f1ee-1f1f9")
    E["st_2018"] = f'''{F("calido", True)}{txt(kt("1983", "mega gris", .2, .1, "slam"), 24, 40, 30)}{txt('<div class="vs" style="--d:.8s">→</div>', 50, 40, 10)}{txt(kt("2018", "mega rojo", 1.1, .1, "slam"), 76, 40, 30)}{txt(kt("su primer local en Italia, en Milán: *35 años después*", "xl", 1.7), 50, 72, 90)}'''
    E["st_espana"] = f'''{F("", True)}{obj(spr("1f1ea-1f1f8", 220), 24, 46, "pop", "bob", .2)}{txt(kt("2002", "mega rojo", .6, .1, "slam"), 64, 34, 56)}{txt(kt("su primera tienda en *MADRID*", "xl", 1.1), 64, 54, 56)}'''
    E["st_bar"] = icono_texto("2615", "LA CULTURA *DEL BAR*", "café rápido y barato", "aquí también había", "izq", "calido", True, "pop", "bob")
    E["st_experiencia"] = comparar("1f4b6", "no compitió en precio", "1f6cb-fe0f", "compitió en experiencia", "≠")
    E["st_publico"] = lista([("1f9d1", "jóvenes"), ("1f9f3", "zonas turísticas")], "ENCONTRÓ SU PÚBLICO")
    E["st_tarde"] = lista([("1f4da", "estudiar"), ("1f4bb", "trabajar"), ("1f465", "pasar la tarde")], "NO ES TOMAR UN CAFÉ: ES…")
    E["st_imaginado"] = titular("EL *TERCER LUGAR*", "justo lo que Schultz había imaginado", "", ("1f6cb-fe0f", "2615", "1f4bb", "2728"))
    E["leccion1"] = leccion(1, "a veces la gran idea la tiene un empleado", "Y LOS DUEÑOS *NO LA VEN*", "1f4a1")
    E["leccion2"] = leccion(2, "no siempre vendes lo que crees", "STARBUCKS VENDE *UN LUGAR*", "1f6cb-fe0f")
    E["leccion3"] = leccion(3, "crecer demasiado deprisa", "PUEDE HACERTE *PERDER LO ESPECIAL*", "1f3ce-fe0f")
    E["st_final"] = lista([("1f465", "tres amigos"), ("1f40b", "una novela"), ("1f1ee-1f1f9", "un viaje a Milán"), ("1f4aa", "un empleado testarudo")], "")
    E["st_vaso2"] = f'''{F("calido", True)}{obj(vaso(220, "Kristina"), 30, 50, "drop", "float", .2)}{txt(kt("YA SABES *DE DÓNDE VIENE TODO*", "xl", .9), 70, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:110px;transform:rotate(-8deg)">{vaso(250, "¿?")}</div>
      <div style="position:absolute;left:300px;top:420px">{vicon("spouting-whale", 170)}</div>
      <div class="big" style="top:100px"><div class="s">STARBUCKS NO QUERÍA</div><div class="q" style="font-size:170px;margin-top:22px">VENDER</div><div class="q" style="font-size:170px">CAFÉ</div><div class="y">LA HISTORIA COMPLETA</div></div>'''
