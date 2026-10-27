"""Escenas del vídeo 40 (SEAT, formato largo). Motor común; sin logotipos: coches genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f1ea-1f1f8", 2: "1f4dc", 3: "1f697", 4: "1f698", 5: "1f3d6-fe0f", 6: "1f695", 7: "1f494", 8: "1f7e1",
              9: "1f3a8", 10: "1f1e9-1f1ea", 11: "1f3ed", 12: "1f3ce-fe0f", 13: "1f9e0"}

def cochecito(px=360, color="#e8dcc0", baca=False):
    b = (f'<rect x="58" y="10" width="84" height="8" fill="#555"/><rect x="62" y="0" width="30" height="12" rx="2" fill="#b5835a" stroke="{TINTA}" stroke-width="2"/>'
         f'<rect x="96" y="2" width="40" height="10" rx="2" fill="#2E6BD6" stroke="{TINTA}" stroke-width="2"/>') if baca else ""
    return (f'<svg width="{px}" height="{px*0.55:.0f}" viewBox="0 0 200 110">{b}<path d="M14,78 Q12,52 40,48 Q56,20 100,20 Q144,20 160,48 Q188,52 186,78 Z" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M58,48 Q68,28 98,28 L98,48Z M104,28 Q134,28 144,48 L104,48Z" fill="#bfe3f2" stroke="{TINTA}" stroke-width="3"/>'
            f'<circle cx="52" cy="82" r="16" fill="#222"/><circle cx="52" cy="82" r="6" fill="#bbb"/><circle cx="148" cy="82" r="16" fill="#222"/><circle cx="148" cy="82" r="6" fill="#bbb"/>'
            f'<rect x="10" y="66" width="14" height="6" fill="#f5d36b"/><rect x="176" y="66" width="12" height="6" fill="#D7263D"/></svg>')

def escenas():
    E = {}
    E["se_600"] = f'''{F("", True)}{obj(cochecito(420), 30, 52, "left", "bob", .2)}{txt(kt("EL PRIMER COCHE: *UN SEISCIENTOS*", "xl", .9), 72, 46, 48)}'''
    E["se_playa"] = f'''{F("calido", True)}{obj(cochecito(420, "#c9dff0", True), 34, 54, "left", "bob", .2)}{txt(kt("PLAYA, PUEBLO, BODAS…", "xl", .8), 74, 40, 46)}{txt(kt("con la baca cargada hasta arriba", "l", 1.4), 74, 56, 46)}'''
    E["se_estado"] = icono_texto("1f3db-fe0f", "UNA EMPRESA *DEL ESTADO*", "en una España que apenas tenía coches", "", "izq", "", False, "pop", "bob")
    E["se_italiana"] = comparar("1f1ee-1f1f9", "30 años de diseños italianos", "1f6aa", "hasta que se fue", "→")
    E["se_amarillo"] = icono_texto("1f7e1", "PIEZAS PINTADAS *DE AMARILLO*", "para demostrar que no era una copia", "según se cuenta", "der", "calido", True, "pop", "bob")
    E["se_historia"] = titular("LA HISTORIA DE *SEAT*", "", "", ("1f697", "1f1ea-1f1f8", "1f7e1", "1f3ed"), "", True, "xl")
    E["se_cuarenta"] = icono_texto("1f1ea-1f1f8", "FINALES DE LOS 40", "tras una guerra civil, un país aislado", "", "izq", "sepia", False, "pop", "")
    E["se_pocos"] = lista([("1f697", "muy pocos coches"), ("1f474", "viejos"), ("1f6a2", "importados")], "")
    E["se_fabricar"] = comparar("1f4b0", "dinero", "2699-fe0f", "tecnología", "+", "LO QUE FALTABA PARA FABRICAR COCHES")
    E["se_ini"] = icono_texto("1f3db-fe0f", "EL *INSTITUTO NACIONAL DE INDUSTRIA*", "y varios bancos: el dinero", "", "der", "", False, "pop", "bob")
    E["se_fuera"] = impacto("la tecnología tendría que venir", "DE *FUERA*", "", "1f30d")
    E["se_1950"] = fecha("9", "MAYO", "1950", "se firma ante notario la nueva empresa", "1f4dc")
    E["se_siglas"] = f'''{F("", True)}{txt(kt("SOCIEDAD ESPAÑOLA DE AUTOMÓVILES DE TURISMO", "xl", .3), 50, 32, 90)}{txt(kt("*S·E·A·T*", "mega", 1.2, .12, "slam"), 50, 58, 90)}'''
    E["se_reparto"] = f'''{F()}{txt(kt("51 %", "mega rojo", .2, .1, "slam"), 20, 40, 30)}{txt(kt("INI", "l", .6), 20, 58, 30)}{txt(kt("42 %", "mega", .7, .1, "slam"), 50, 40, 30)}{txt(kt("bancos", "l", 1.1), 50, 58, 30)}{txt(kt("7 %", "mega", 1.2, .1, "slam"), 80, 40, 30)}{txt(kt("Fiat", "l", 1.6), 80, 58, 30)}'''
    E["se_fiat"] = lista([("1f4d0", "diseños"), ("1f4dc", "licencias"), ("1f527", "conocimientos")], "LO QUE PONÍA FIAT")
    E["se_zonafranca"] = f'''{F("sepia")}{obj(skyline(1800, "#6b4b36"), 50, 86, "none")}{txt(kt("ZONA FRANCA", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("Barcelona, junto al puerto", "l", 1.1), 50, 48, 80)}'''
    E["se_1400"] = fecha("13", "NOVIEMBRE", "1953", "sale el primer coche: el SEAT 1400", "1f697")
    E["se_berlina"] = lista([("1f468-200d-2695-fe0f", "médicos"), ("1f468-200d-1f4bc", "empresarios"), ("1f695", "taxistas"), ("1f3db-fe0f", "organismos")], "UNA BERLINA GRANDE PARA…")
    E["se_imposible"] = icono_texto("1f4ad", "PARA UNA FAMILIA, *UN SUEÑO IMPOSIBLE*", "años de sueldo de un trabajador", "", "izq", "", False, "pop", "float")
    E["se_falta"] = comparar("1f3ed", "fábrica: sí", "1f697", "coche para la gente: no", "+")
    E["se_1957"] = cifra("1957", "LLEGA EL SEAT 600", "1f697")
    E["se_pequeno"] = f'''{F()}{obj(cochecito(400), 32, 52, "pop", "", .2)}{txt(kt("DIMINUTO, *MOTOR ATRÁS*", "xl", .8), 72, 42, 48)}{txt(kt("cuatro plazas apretadas, consumo muy bajo", "l", 1.4), 72, 58, 48)}'''
    E["se_plazos"] = icono_texto("1f4b3", "AL ALCANCE *DE LA CLASE MEDIA*", "pagando a plazos y ahorrando mucho", "por fin", "der", "", True, "pop", "bob")
    E["se_pedidos"] = cifra("+100.000", "PEDIDOS EN POCOS MESES · LISTAS DE ESPERA", "23f3", "según las crónicas de la época")
    E["se_pelotilla"] = titular("«EL *PELOTILLA*»", "o simplemente, el Seiscientos", "", ("1f697", "26bd", "1f60a", "2764-fe0f"))
    E["se_simbolo"] = icono_texto("1f4c8", "EL SÍMBOLO *DEL DESARROLLISMO*", "los años sesenta", "", "izq", "sepia", True, "pop", "bob")
    E["se_vacaciones"] = lista([("1f3d6-fe0f", "vacaciones en coche"), ("1f9fa", "excursiones de domingo"), ("1f6e3-fe0f", "carreteras llenas")], "")
    E["se_familias"] = f'''{F("calido", True)}{obj(cochecito(440, "#e8dcc0", True), 36, 54, "left", "bob", .2)}{"".join(obj(spr(c, 80), 22 + i * 7, 46, "pop", "", .6 + i * .15) for i, c in enumerate(["1f468", "1f469", "1f467", "1f466", "1f475"]))}{txt(kt("5 O 6 PERSONAS *DENTRO*", "xl", 1.2), 76, 44, 44)}'''
    E["se_800000"] = cifra("~800.000", "SEISCIENTOS FABRICADOS HASTA 1973", "1f3ed")
    E["se_clubes"] = icono_texto("1f48e", "CUIDADOS *COMO JOYAS*", "clubes, concentraciones y coleccionistas", "", "der", "", True, "pop", "bob")
    E["se_muchos"] = impacto("detrás del Seiscientos", "LLEGARON *MUCHOS MÁS*", "", "1f697")
    E["se_modelos"] = f'''{F()}{"".join(txt(kt(m, "mega", .2 + i * .3, .1, "slam"), 14 + i * 24, 42, 22) for i, m in enumerate(["850", "1430", "124", "127"]))}{txt(kt("modelos que marcaron época", "l", 1.6), 50, 66, 80)}'''
    E["se_124"] = icono_texto("1f695", "EL *124*", "la familia que prosperaba; también taxi", "finales de los 60", "izq", "", False, "pop", "bob")
    E["se_127"] = icono_texto("1f697", "EL *127*", "el heredero: pequeño, práctico, motor delante", "principios de los 70", "der", "", False, "pop", "bob")
    E["se_vendidos"] = cifra("127", "DE LOS MÁS VENDIDOS DE ESPAÑA DURANTE AÑOS", "1f3c6")
    E["se_licencia"] = comparar("1f1ee-1f1f9", "modelos de Fiat", "1f3ed", "fabricados en Barcelona", "→", "TODOS CON LICENCIA ITALIANA")
    E["se_crece"] = icono_texto("1f3ed", "LA MAYOR EMPRESA *INDUSTRIAL DE ESPAÑA*", "años sesenta y setenta", "", "izq", "", True, "pop", "bob")
    E["se_pierde"] = comparar("1f4c8", "Fiat sube su participación", "1f4c9", "SEAT pierde mucho dinero", "+", "FINALES DE LOS 70")
    E["se_mayoria"] = bocadillos("1f3db-fe0f", ["¿Os quedáis la mayoría?", "¿La sacáis adelante?"], "el Estado a Fiat")
    E["se_marcha"] = impacto("1980:", "FIAT DICE *QUE NO*", "y se marcha", "1f6aa")
    E["se_sola"] = lista([("1f3ed", "fábricas"), ("1f477", "miles de trabajadores"), ("1f6ab", "sin socio"), ("1f1ee-1f1f9", "coches de Fiat")], "SEAT, SOLA")
    E["se_vender"] = icono_texto("1f50e", "BUSCAR SOCIO… *Y SEGUIR VENDIENDO*", "", "", "izq", "", False, "pop", "bob")
    E["se_ronda"] = icono_texto("1f697", "EL SEAT *RONDA*", "un modelo modificado, con nombre propio", "", "der", "", False, "left", "bob")
    E["se_arbitraje"] = comparar("1f1ee-1f1f9", "Fiat: «es una copia»", "2696-fe0f", "arbitraje internacional", "→")
    E["se_paris"] = f'''{F("", True)}{obj(cochecito(460, "#e8e2d4"), 34, 54, "pop", "", .2)}{obj(spr("1f7e1", 90), 24, 46, "pop", "", .8)}{obj(spr("1f7e1", 90), 44, 40, "pop", "", 1.0)}{obj(spr("1f7e1", 90), 36, 62, "pop", "", 1.2)}{txt(kt("EN PARÍS: *PIEZAS NUEVAS EN AMARILLO*", "xl", 1.0), 76, 42, 44)}{txt(kt("según la historia más repetida", "l", 1.6), 76, 58, 44)}'''
    E["se_vistazo"] = icono_texto("1f440", "DE UN VISTAZO, *CUÁNTO HABÍA CAMBIADO*", "", "", "izq", "", False, "pop", "bob")
    E["se_razon"] = impacto("y el arbitraje…", "LE DA LA RAZÓN *A SEAT*", "según esa misma historia", "2696-fe0f")
    E["se_cero"] = impacto("por primera vez:", "SU PROPIO COCHE, *DESDE CERO*", "", "270f-fe0f")
    E["se_especialistas"] = lista([("1f1ee-1f1f9", "Italia"), ("1f1e9-1f1ea", "Alemania"), ("1f1ea-1f1f8", "España")], "ESPECIALISTAS DE VARIOS PAÍSES")
    E["se_giugiaro"] = icono_texto("1f3a8", "GIORGETTO *GIUGIARO*", "uno de los grandes diseñadores de coches", "el diseño", "izq", "", False, "pop", "bob")
    E["se_porsche"] = comparar("1f527", "carrocería: Karmann", "2699-fe0f", "motor: con Porsche", "+")
    E["se_ibiza"] = titular("*IBIZA*", "1984: como una isla española", "", ("1f697", "1f3dd-fe0f", "2600-fe0f", "2728"))
    E["se_exito"] = icono_texto("1f3c6", "EL MODELO *MÁS IMPORTANTE*", "de la historia de la marca", "", "der", "", True, "pop", "bob")
    E["se_vw"] = impacto("el socio que buscaba:", "*VOLKSWAGEN*", "", "1f1e9-1f1ea")
    E["se_1986"] = comparar("1f91d", "1982: colaboración", "1f4dd", "1986: compra la mayoría", "→")
    E["se_alemana"] = cifra("100 %", "ALEMANA, POCOS AÑOS DESPUÉS", "1f1e9-1f1ea")
    E["se_orgullo"] = icono_texto("1f614", "UN GOLPE *AL ORGULLO*", "el coche español, en manos extranjeras", "", "izq", "", False, "pop", "")
    E["se_salvacion"] = lista([("1f4b6", "inversiones"), ("2699-fe0f", "tecnología"), ("1f1ea-1f1fa", "toda Europa")], "PERO TAMBIÉN SU SALVACIÓN")
    E["se_emocion"] = bocadillos("1f3ce-fe0f", ["Joven", "Mediterránea", "Deportiva"], "su hueco en el grupo: «auto emoción»")
    E["se_martorell"] = cifra("1993", "NUEVA FÁBRICA EN MARTORELL", "1f3ed")
    E["se_moderna"] = icono_texto("1f916", "DE LAS MÁS *MODERNAS DE EUROPA*", "de allí salen el nuevo Ibiza y el Córdoba", "", "der", "", True, "pop", "bob")
    E["se_crisis"] = lista([("1f4c9", "ventas a la baja"), ("1f4b8", "pérdidas enormes"), ("1f6d1", "la Zona Franca deja de hacer coches")], "UNA CRISIS MUY DURA")
    E["se_empleos"] = icono_texto("1f477", "MILES DE EMPLEOS *PERDIDOS*", "años muy difíciles", "", "izq", "dark", False, "pop", "")
    E["se_aguanta"] = impacto("pero", "SEAT *AGUANTÓ*", "", "1f4aa")
    E["se_cupra"] = icono_texto("1f3ce-fe0f", "CUPRA", "el nombre de sus versiones deportivas", "durante años", "izq", "", False, "pop", "bob")
    E["se_2018"] = cifra("2018", "CUPRA, MARCA INDEPENDIENTE", "1f3f7-fe0f")
    E["se_protagonista"] = icono_texto("1f4c8", "UN PAPEL *PROTAGONISTA*", "dentro de la empresa", "", "der", "", True, "pop", "bob")
    E["se_sigue"] = icono_texto("1f3ed", "MARTORELL, *TODAVÍA HOY*", "algunos de los coches más vendidos de España", "", "izq", "", False, "pop", "bob")
    E["se_propias"] = comparar("1f1ee-1f1f9", "nació para fabricar coches de otros", "1f3f7-fe0f", "acabó creando sus marcas", "→")
    E["leccion1"] = leccion(1, "el producto adecuado puede", "*CAMBIAR UN PAÍS*", "1f697")
    E["leccion2"] = leccion(2, "depender de un solo socio", "*ES ARRIESGADO*", "1f6aa")
    E["leccion3"] = leccion(3, "quedarse solo", "*TE OBLIGA A CRECER*", "1f4aa")
    E["se_final"] = lista([("1f1ea-1f1f8", "un país sin coches"), ("1f4dc", "unas siglas"), ("1f697", "un Seiscientos"), ("1f494", "un divorcio"), ("1f7e1", "piezas amarillas")], "")
    E["se_concentracion"] = f'''{F("calido", True)}{"".join(obj(cochecito(240, c), 18 + i * 32, 56, "left", "bob", .2 + i * .3) for i, c in enumerate(["#e8dcc0", "#c9dff0", "#f2b8a2"]))}{txt(kt("YA SABES *DE DÓNDE VIENE*", "xl", 1.2), 50, 22, 90)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:260px">{cochecito(560, "#e8dcc0", True)}</div>
      <div class="big" style="top:100px"><div class="s">EL COCHE QUE</div><div class="q" style="font-size:170px;margin-top:22px">MOTORIZÓ</div><div class="q" style="font-size:170px">ESPAÑA</div><div class="y">LA HISTORIA DE SEAT</div></div>'''
