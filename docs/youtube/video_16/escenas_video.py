"""Escenas del vídeo 16 (Mercadona, formato largo). Motor común; sin logotipos: tiendas, carros y envases genéricos."""
from base import *

CAP_ICONOS = {1: "1f969", 2: "1f91d", 3: "1f4e0", 4: "1f3f7-fe0f", 5: "1f451", 6: "1f6d2", 7: "1f3ed", 8: "1f4fa",
              9: "1f4c8", 10: "1f3c0", 11: "1f9e0"}

def super_(px=560, rotulo="SUPERMERCADO", color=VERDE):
    return (f'<svg width="{px}" height="{px*0.62:.0f}" viewBox="0 0 400 250"><rect x="20" y="60" width="360" height="180" fill="#f2efe6" stroke="{TINTA}" stroke-width="5"/>'
            f'<rect x="10" y="20" width="380" height="50" rx="6" fill="{color}" stroke="{TINTA}" stroke-width="5"/><text x="200" y="56" font-family="Bebas" font-size="34" fill="#fff" text-anchor="middle">{rotulo}</text>'
            f'<rect x="150" y="120" width="100" height="120" fill="#9fc3e6" stroke="{TINTA}" stroke-width="4"/><line x1="200" y1="120" x2="200" y2="240" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="40" y="100" width="90" height="70" fill="#9fc3e6" stroke="{TINTA}" stroke-width="4"/><rect x="270" y="100" width="90" height="70" fill="#9fc3e6" stroke="{TINTA}" stroke-width="4"/></svg>')

def envase(px=150, color=VERDE, texto="MARCA"):
    return (f'<svg width="{px}" height="{px*1.4:.0f}" viewBox="0 0 100 140"><rect x="10" y="10" width="80" height="124" rx="8" fill="{HUESO}" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="10" y="42" width="80" height="40" fill="{color}"/><text x="50" y="69" font-family="Bebas" font-size="20" fill="#fff" text-anchor="middle">{texto}</text></svg>')

def etiqueta_precio(txt_, px=260, color=ROJO):
    return (f'<div style="background:#FFD23F;border:5px solid {TINTA};border-radius:10px 40px 40px 10px;padding:10px 40px 10px 26px;font-family:Bebas;font-size:{px//3}px;'
            f'color:{color};box-shadow:8px 8px 0 rgba(0,0,0,.18)">{txt_}</div>')

def escenas():
    E = {}
    E["me_hacendado"] = f'''{F("", True)}{"".join(obj(envase(140, c, "MARCA"), x, 46, "drop", "bob", .1 + i * .2) for i, (c, x) in enumerate([(VERDE, 16), (ROJO, 32), (AZUL, 48), (NARANJA, 64)]))}
      {txt(kt("¿ALGO DE *HACENDADO* ESTA SEMANA?", "xl", 1.0), 50, 84, 90)}{obj(spr("1f6d2", 200), 84, 44, "left", "bob", .9)}'''
    E["me_grande"] = f'''{F("", True)}{txt(kt("+40.000 M€", "xl rojo", .3, .1, "slam"), 27, 40, 44)}{txt(kt("al año", "l", .9), 27, 56, 40)}{txt(kt("+100.000", "xl", 1.2, .1, "slam"), 73, 40, 44)}{txt(kt("trabajadores", "l", 1.8), 73, 56, 40)}
      {txt(kt("EL SUPERMERCADO MÁS GRANDE DE ESPAÑA", "l gris", 2.2), 50, 84, 90)}'''
    E["me_carnicerias"] = icono_texto("1f969", "EMPEZÓ CON *CARNICERÍAS*", "familiares, en Valencia", "", "izq", "sepia", False, "drop", "bob")
    E["me_locura"] = impacto("decisiones que, en su momento,", "PARECÍAN *UNA LOCURA*", "", "1f92f")
    E["me_decisiones"] = lista([("1f3f7-fe0f", "sin ofertas"), ("1f4fa", "sin anuncios en la tele"), ("1f451", "el cliente es «el Jefe»")], "")
    E["me_historia"] = f'''{F("calido", True)}{obj(super_(560), 34, 52, "zoom", "", .2)}{txt(kt("UNA TIENDA DE BARRIO QUE CAMBIÓ *LA COMPRA*", "xl", .8), 76, 46, 44)}'''
    E["me_valencia"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("VALENCIA", "mega", .3, .1, "slam"), 50, 34, 95)}{txt(kt("años setenta", "l", 1.1), 50, 52, 80)}{obj(spr("1f34a", 150), 84, 20, "pop", "bob", .8)}'''
    E["me_padres"] = comparar("1f468", "Francisco Roig", "1f469", "Trinidad Alfonso", "+", "CÁRNICAS ROIG")
    E["me_cambio"] = lista([("1f3d9-fe0f", "la gente se muda a las ciudades"), ("1f6d2", "llega el autoservicio")], "ESPAÑA CAMBIA DEPRISA")
    E["me_ultramarinos"] = flecha("1f969", "1f6d2", "DE CARNICERÍAS A *ULTRAMARINOS*", "tiendas donde se vende de todo")
    E["me_1977"] = fecha("15", "MARZO", "1977", "se registra el nombre: Mercadona", "1f4dd")
    E["me_pequena"] = icono_texto("1f3ea", "UNA *PEQUEÑA CADENA*", "en la zona de Valencia", "", "der", "", True, "pop", "bob")
    E["me_1981"] = anio(1900, 1981, "el momento clave", "1f511")
    E["me_juan"] = icono_texto("1f468-200d-1f4bc", "JUAN ROIG Y *HORTENSIA HERRERO*", "con varios hermanos, compran la empresa a sus padres", "", "izq", "", True, "up", "bob", 340, (("1f469-200d-1f4bc", 86, 80),))
    E["me_ocho"] = f'''{F()}{"".join(obj(spr("1f3ea", 130), 10 + i * 11.4, 44, "drop", "", .1 + i * .15) for i in range(8))}{txt(kt("UNAS *8 TIENDAS*", "xl", 1.4), 50, 74, 80)}{txt(kt("de unos 300 m² cada una", "l", 1.9), 50, 86, 80)}'''
    E["me_economia"] = icono_texto("1f393", "ESTUDIÓ *ECONOMÍA*", "y tenía una idea clara: podía ser mucho más grande", "", "der", "", True, "pop", "bob", 340, (("1f4c8", 14, 80),))
    E["me_mayoria"] = icono_texto("1f4ca", "LA MAYORÍA *DEL CAPITAL*", "con los años, para Juan Roig y Hortensia Herrero", "", "izq", "", False, "zoom", "")
    E["me_ideas"] = titular("LA HISTORIA DE *SUS IDEAS*", "", "", ("1f4a1", "1f9e0", "1f4dd", "2728"))
    E["me_canal"] = f'''{F("dark")}<div class="laser"></div>{obj(barras(180, HUESO, NARANJA, True, .1), 50, 34, "none")}{txt(kt("UN DATO QUE *NO PODÍAMOS SALTARNOS*", "xl hueso", .8), 50, 66, 90)}'''
    E["me_escaner"] = f'''{F("", True)}{obj(barras(160, TINTA, ROJO, True, .2), 30, 44, "none")}<div class="pos" style="left:30%;top:44%;width:420px;height:6px;background:{ROJO};box-shadow:0 0 18px {ROJO}" ></div>
      {txt(kt("1982: EL *ESCÁNER*", "xl", .6), 70, 34, 52)}{txt(kt("primera de su sector en España en usarlo en caja, según la empresa", "l", 1.2), 70, 54, 52)}'''
    E["me_mano"] = icono_texto("1f522", "EL PRECIO, *A MANO*", "producto a producto, en muchas tiendas", "entonces…", "izq", "sepia", False, "pop", "shake")
    E["me_ventajas"] = lista([("23e9", "colas más rápidas"), ("2705", "menos errores"), ("1f4ca", "información")], "LO QUE DABA EL ESCÁNER")
    E["me_oro"] = icono_texto("1f4b0", "SABER QUÉ COMPRABAN: *ORO*", "para una empresa que quería crecer", "", "der", "calido", True, "zoom", "glow")
    E["me_eficiencia"] = titular("OBSESIÓN POR *MEDIR*", "una de las claves de todo lo que vino después", "", ("1f4cf", "1f4ca", "2699-fe0f", "1f50d"))
    E["me_ofertas"] = f'''{F("", True)}{obj(etiqueta_precio("OFERTA", 240), 26, 34, "drop", "swing", .2)}{obj(etiqueta_precio("-20 %", 240), 74, 34, "drop", "swing", .5)}{obj(spr("1f4e2", 200), 50, 62, "pop", "shake", .9)}
      {txt(kt("PRINCIPIOS DE LOS 90: OFERTAS *Y PUBLICIDAD*", "xl", 1.3), 50, 88, 90)}'''
    E["me_dosxuno"] = comparar("1f3f7-fe0f", "hoy, 2×1 en un producto", "1f3f7-fe0f", "mañana, descuento en otro", "→")
    E["me_desorden"] = impacto("el problema:", "LAS OFERTAS *DESORDENABAN TODO*", "", "1f300")
    E["me_golpes"] = comparar("1f4e6", "con descuento: compras de más", "1f6ab", "sin descuento: nada", "/", "ALMACENES QUE SE LLENAN Y SE VACÍAN A GOLPES")
    E["me_proveedores"] = icono_texto("1f3ed", "PROVEEDORES *SUBIENDO OTROS PRECIOS*", "para pagar las promociones", "", "izq", "", False, "pop", "")
    E["me_1993"] = f'''{F("dark", True)}{txt(kt("1993", "mega naranja", .2, .1, "slam"), 50, 26, 60)}{txt(kt("ELIMINAR LAS OFERTAS Y GRAN PARTE DE LA PUBLICIDAD", "xl hueso", .7), 50, 52, 90)}{txt(kt("muchos lo vieron como un suicidio comercial", "l naranja", 1.6), 50, 72, 80)}'''
    E["me_spb"] = f'''{F("calido", True)}{obj(etiqueta_precio("SPB", 300, VERDE), 26, 44, "flip", "float", .2)}{txt(kt("«SIEMPRE *PRECIOS BAJOS*»", "xl", .6), 68, 38, 56)}{txt(kt("sin trucos, sin cupones, sin promociones", "l", 1.3), 68, 56, 56)}'''
    E["me_funciono"] = comparar("1f4c9", "al principio, las ventas se resienten", "1f4c8", "con el tiempo, funciona", "→")
    E["me_calidad"] = titular("MODELO DE *CALIDAD TOTAL*", "1993", "", ("2b50", "1f4cb", "2705", "1f3c6"))
    E["me_cinco"] = f'''{F()}{"".join(obj(spr(c, 150), 10 + i * 20, 44, "pop", "bob", .2 + i * .25) + txt(kt(t, "l", .5 + i * .25), 10 + i * 20, 66, 18) for i, (c, t) in enumerate([("1f6d2", "cliente"), ("1f477", "trabajador"), ("1f3ed", "proveedor"), ("1f3d8-fe0f", "sociedad"), ("1f4b0", "capital")]))}
      {txt(kt("CINCO COMPONENTES", "xl", .1), 50, 16, 90)}'''
    E["me_centro"] = icono_texto("1f3af", "EN EL CENTRO, *EL CLIENTE*", "pero allí no se le llama así…", "", "izq", "", True, "zoom", "pulse")
    E["me_jefe"] = f'''{F("calido", True)}{obj(spr("1f451", 260), 30, 44, "drop", "glow", .2)}{txt(kt("«EL *JEFE*»", "mega", .7, .15, "slam"), 66, 44, 56)}{txt(kt("así llaman internamente al cliente", "l", 1.5), 66, 64, 56)}'''
    E["me_decide"] = lista([("1f4e6", "el tamaño de un envase"), ("1f552", "el horario de una tienda"), ("1f451", "lo que quiere el Jefe")], "CADA DECISIÓN SE JUSTIFICA PENSANDO EN…")
    E["me_plantilla"] = icono_texto("1f4dd", "CONTRATOS *FIJOS*", "para la gran mayoría de la plantilla, algo poco habitual en el sector", "", "der", "", False, "pop", "bob")
    E["me_despensa"] = impacto("la marca que probablemente tienes", "EN LA *DESPENSA*", "", "1f6d2")
    E["me_1996"] = f'''{F("", True)}{txt(kt("1996", "xl gris", .1), 50, 14, 40)}{"".join(obj(envase(140, c, t), 14 + i * 24, 46, "drop", "bob", .3 + i * .3) + txt(kt(s, "m", .6 + i * .3), 14 + i * 24, 76, 22) for i, (c, t, s) in enumerate([(VERDE, "HACENDADO", "alimentación"), (AZUL, "BOSQUE V.", "limpieza"), ("#c2185b", "DELIPLUS", "higiene"), (NARANJA, "COMPY", "mascotas")]))}'''
    E["me_fama"] = icono_texto("1f612", "MARCA BLANCA = *BARATA Y PEOR*", "esa era su fama en aquella época", "", "izq", "sepia", False, "pop", "")
    E["me_romper"] = comparar("1f4b6", "buen precio", "2b50", "calidad comparable a las grandes marcas", "+", "ROMPER ESA IDEA")
    E["me_viral"] = f'''{F("", True)}{obj(spr("1f4f1", 240), 26, 46, "pop", "bob", .2)}{"".join(obj(spr("2764-fe0f", 90), x, y, "pop", "float", .6 + i * .2) for i, (x, y) in enumerate([(38, 26), (16, 24), (40, 64)]))}
      {txt(kt("PRODUCTOS QUE SE HACEN *VIRALES*", "xl", .8), 70, 46, 52)}'''
    E["me_expresamente"] = icono_texto("1f4f0", "SI UNO DESAPARECE, *ES NOTICIA*", "hay quien va a por un producto concreto de Hacendado", "", "der", "", True, "drop", "swing")
    E["me_mitad"] = cifra("≈50 %", "DE LO QUE VENDE, DE SUS MARCAS PROPIAS", "1f6d2", "hoy, cerca del")
    E["me_nofabrica"] = impacto("pero Mercadona", "NO FABRICA *HACENDADO*", "", "1f3ed")
    E["me_inter"] = titular("*INTERPROVEEDORES*", "otras empresas que fabrican para la cadena", "así los llama:", ("1f3ed", "1f91d", "1f4e6", "1f69a"), "", True, "xl")
    E["me_acuerdos"] = comparar("1f4dc", "acuerdos largos, a menudo en exclusiva", "1f6d2", "a cambio, un cliente enorme", "⇄")
    E["me_debate"] = impacto("el modelo tiene", "DEFENSORES *Y CRÍTICOS*", "", "2696-fe0f")
    E["me_defensores"] = lista([("1f9f1", "estabilidad"), ("1f3d7-fe0f", "poder invertir"), ("1f4b6", "precios bajos")], "LOS DEFENSORES")
    E["me_criticos"] = icono_texto("26a0-fe0f", "DEPENDER DE *UN SOLO CLIENTE*", "y poco margen para negociar", "los críticos:", "izq", "dark", False, "pop", "")
    E["me_2019"] = icono_texto("1f513", "2019: RED *MÁS ABIERTA*", "muchos más proveedores", "", "der", "", True, "zoom", "bob")
    E["me_piensa"] = f'''{F("", True)}{obj(spr("1f4fa", 280), 30, 46, "pop", "", .2)}{obj(spr("1f914", 170), 46, 28, "pop", "swing", .8)}{txt(kt("¿EL ÚLTIMO ANUNCIO *QUE VISTE*?", "xl", .9), 72, 46, 50)}'''
    E["me_recordar"] = icono_texto("1f937", "CUESTA *RECORDARLO*", "", "", "izq", "", False, "pop", "swing")
    E["me_sinpubli"] = f'''{F("dark", True)}{obj(spr("1f4fa", 260), 50, 40, "pop", "", .2)}{txt('<div class="equis" style="font-size:300px">✕</div>', 50, 40, 30, "center", .8, "pop")}{txt(kt("DESDE LOS 90, *APENAS PUBLICIDAD*", "xl hueso", 1.2), 50, 84, 90)}'''
    E["me_boca"] = comparar("1f3ea", "el mejor anuncio, la propia tienda", "1f4ac", "que los clientes hablen de ella", "+")
    E["me_hablan"] = bocadillos("1f6d2", ["¿Has probado lo nuevo?", "¡Lo han quitado!", "¿A qué hora cierran?", "¡Hacendado es lo mejor!"], "en España se habla muchísimo de Mercadona")
    E["me_portugal"] = flecha("1f1ea-1f1f8", "1f1f5-1f1f9", "2019: *PORTUGAL*", "su primera tienda fuera de España, cerca de Oporto")
    E["me_cifras"] = impacto("y las cifras de hoy son", "*ENORMES*", "", "1f4ca")
    E["me_factura"] = f'''{F("", True)}{txt(kt("2025", "l gris", .1), 50, 16, 80)}{txt(kt("≈41.900 M€", "xl rojo", .4, .1, "slam"), 27, 42, 44)}{txt(kt("facturación", "l", 1.0), 27, 58, 40)}
      {txt(kt("+1.700 M€", "xl", 1.3, .1, "slam"), 73, 42, 44)}{txt(kt("beneficio", "l", 1.9), 73, 58, 40)}'''
    E["me_tiendas"] = cifra("≈1.670", "TIENDAS ENTRE ESPAÑA Y PORTUGAL", "1f3ea")
    E["me_trabajadores"] = cifra("≈115.000", "TRABAJADORES", "1f477")
    E["me_ocho2"] = f'''{F("calido", True)}{"".join(obj(spr("1f3ea", 120), 10 + i * 11.4, 44, "pop", "", .1 + i * .1) for i in range(8))}{txt(kt("TODO EMPEZÓ CON *8 TIENDAS*", "xl", 1.0), 50, 78, 90)}'''
    E["me_rico"] = icono_texto("1f4b0", "UNO DE LOS MÁS *RICOS DE ESPAÑA*", "", "Juan Roig:", "izq", "calido", True, "zoom", "glow")
    E["me_invierte"] = titular("INVERTIDO *EN VALENCIA*", "buena parte de esa fortuna", "", ("1f34a", "1f3d7-fe0f", "1f3c0", "1f3a8"))
    E["me_arena"] = f'''{F("dark", True)}{obj(spr("1f3df-fe0f", 300), 30, 46, "rise", "", .2)}{txt(kt("ROIG *ARENA*", "mega naranja", .6, .12, "slam"), 70, 36, 52)}{txt(kt("baloncesto y conciertos; varios cientos de millones de euros, de su bolsillo", "l hueso", 1.3), 70, 58, 52)}'''
    E["me_basket"] = icono_texto("1f3c0", "LA CASA DEL *VALENCIA BASKET*", "el club del que también es propietario", "", "der", "", True, "drop", "jump")
    E["me_lanzadera"] = comparar("1f680", "Lanzadera: ayuda a nuevas empresas", "1f3c3", "Fundación Trinidad Alfonso: deporte", "+")
    E["me_arte"] = icono_texto("1f3a8", "HORTENSIA HERRERO: *PATRIMONIO ARTÍSTICO*", "su fundación recupera el patrimonio de la ciudad", "", "izq", "", True, "pop", "bob")
    E["me_ciudad"] = flecha("1f969", "1f3d9-fe0f", "DE UNAS CARNICERÍAS… *A UNA CIUDAD*", "")
    E["leccion1"] = leccion(1, "la mejor decisión puede ser", "LA QUE TODOS VEN COMO *UNA LOCURA*", "1f92f")
    E["leccion2"] = leccion(2, "la coherencia genera confianza", "UN PRECIO ESTABLE VALE MÁS QUE *MIL DESCUENTOS*", "1f3f7-fe0f")
    E["leccion3"] = leccion(3, "organízalo todo pensando en el cliente", "HASTA *EL NOMBRE* QUE LE DAS", "1f451")
    E["me_final"] = lista([("1f969", "carnicerías"), ("1f4e0", "un escáner"), ("1f3f7-fe0f", "precios bajos"), ("1f6d2", "Hacendado")], "ASÍ SE HIZO MERCADONA")
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:150px">{super_(460)}</div>
      <div style="position:absolute;left:150px;top:470px">{vicon("shopping-cart", 160)}</div>
      <div class="big" style="top:100px"><div class="s">DE UNAS CARNICERÍAS</div><div class="q" style="font-size:160px;margin-top:22px">AL GIGANTE</div><div class="q" style="font-size:160px">DE ESPAÑA</div><div class="y">LA HISTORIA DE MERCADONA</div></div>'''
