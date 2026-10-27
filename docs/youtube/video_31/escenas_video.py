"""Escenas del vídeo 31 (BlackBerry, formato largo). Motor común; sin logotipos: móviles con teclado genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f1e8-1f1e6", 2: "1f4bc", 3: "1f4e7", 4: "1f353", 5: "1f9f2", 6: "2696-fe0f", 7: "1f3db-fe0f", 8: "1f4ac", 9: "1f4f1",
              10: "1f40c", 11: "1f4c9", 12: "1f9e0"}

def movil(px=260, pantalla="#2E6BD6", teclas=True):
    h = 150 if teclas else 0
    k = "".join(f'<ellipse cx="{38 + c*25}" cy="{176 + r*24}" rx="10" ry="8" fill="#3a3a3a" stroke="#555" stroke-width="1.5"/>' for r in range(4) for c in range(6)) if teclas else ""
    alto = 280 if teclas else 300
    return (f'<svg width="{px}" height="{px*1.6:.0f}" viewBox="0 0 200 320"><rect x="10" y="10" width="180" height="{alto}" rx="26" fill="#1c1c1c" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="24" y="30" width="152" height="{110 if teclas else 250}" rx="6" fill="{pantalla}"/><rect x="36" y="44" width="90" height="10" rx="5" fill="#fff" opacity=".7"/>'
            f'<rect x="36" y="62" width="120" height="8" rx="4" fill="#fff" opacity=".45"/><rect x="36" y="76" width="70" height="8" rx="4" fill="#fff" opacity=".45"/>{k}</svg>')

def escenas():
    E = {}
    E["bb_teclado"] = f'''{F("", True)}{obj(movil(300), 30, 50, "drop", "float", .2)}{txt(kt("UN PEQUEÑO TECLADO: *SEÑAL DE IMPORTANCIA*", "xl", .8), 68, 46, 52)}'''
    E["bb_quien"] = lista([("1f468-200d-1f4bc", "ejecutivos"), ("1f4f0", "periodistas"), ("1f3db-fe0f", "políticos"), ("1f1fa-1f1f8", "el presidente")], "LO LLEVABAN…")
    E["bb_mote"] = icono_texto("1f9f2", "TAN ADICTIVO *QUE LE PUSIERON MOTE*", "palabra del año para un diccionario", "", "izq", "", True, "pop", "bob")
    E["bb_fresa"] = icono_texto("1f353", "UNA FRESA *DEMASIADO LENTA*", "según la agencia que creó el nombre", "el origen del nombre:", "der", "calido", True, "pop", "bob", 380, (("1f40c", 14, 80),))
    E["bb_caida"] = comparar("1f451", "dominar el mercado", "1f4c9", "casi desaparecer", "→", "EN POCOS AÑOS")
    E["bb_historia"] = titular("LA HISTORIA DE *BLACKBERRY*", "", "", ("1f4f1", "1f353", "1f4e7", "1f4c9"), "", True, "xl")
    E["bb_waterloo"] = f'''{F("sepia", True)}{obj(spr("1f1e8-1f1e6", 220), 22, 46, "drop", "bob", .2)}{txt(kt("WATERLOO", "mega", .4, .12, "slam"), 64, 40, 64)}{txt(kt("Ontario, Canadá · 1984", "l", 1.2), 64, 58, 64)}<div class="viñeta"></div>'''
    E["bb_lazaridis"] = icono_texto("1f468-200d-1f393", "MIKE *LAZARIDIS*", "nacido en Estambul, de familia griega; emigró a Canadá de niño", "estudiante de ingeniería", "izq", "", False, "up", "bob")
    E["bb_circuitos"] = lista([("1f527", "desmontaba aparatos"), ("1f50c", "construía circuitos")], "DESDE PEQUEÑO")
    E["bb_rim"] = titular("*RESEARCH IN MOTION*", "«investigación en movimiento», con Douglas Fregin", "fundan:", ("1f468-200d-1f393", "1f91d", "1f527", "1f4bb"), "", True, "xl")
    E["bb_todo"] = lista([("1f3ed", "pantallas para fábricas"), ("1f3ac", "códigos en películas"), ("1f4bc", "consultoría")], "UN POCO DE TODO")
    E["bb_sincables"] = impacto("una obsesión:", "DATOS *SIN CABLES*", "", "1f4e1")
    E["bb_vender"] = comparar("1f468-200d-1f527", "buenos ingenieros", "1f937", "nadie que supiera vender", "+")
    E["bb_balsillie"] = icono_texto("1f468-200d-1f4bc", "JIM *BALSILLIE*", "formación en negocios y mucha ambición", "el vendedor", "der", "", False, "up", "bob")
    E["bb_hipoteca"] = icono_texto("1f3e0", "1992: *HIPOTECA SU CASA*", "para invertir en la empresa, según se cuenta", "", "izq", "calido", True, "pop", "bob", 380, (("1f4b5", 86, 82),))
    E["bb_dos"] = comparar("1f468-200d-1f393", "Lazaridis", "1f468-200d-1f4bc", "Balsillie", "+", "DOS CONSEJEROS DELEGADOS A LA VEZ")
    E["bb_reparto"] = comparar("2699-fe0f", "tecnología", "1f4b0", "dinero, contratos y operadoras", "|")
    E["bb_reloj"] = f'''{F()}{obj(reloj(300), 30, 50, "pop", "", .2)}{txt(kt("UNA PAREJA EXTRAÑA… *QUE FUNCIONABA*", "xl", .8), 68, 46, 52)}'''
    E["bb_oficina"] = icono_texto("1f5a5-fe0f", "EL CORREO, *SOLO EN LA OFICINA*", "si salías, te quedabas desconectado", "en los noventa", "izq", "", False, "pop", "bob")
    E["bb_busca"] = icono_texto("1f4df", "BUSCAPERSONAS *DE DOS VÍAS*", "enviar y recibir mensajes", "", "der", "", False, "pop", "bob")
    E["bb_1999"] = cifra("1999", "TU CORREO DE EMPRESA, AL INSTANTE, ESTÉS DONDE ESTÉS", "1f4e7")
    E["bb_push"] = flecha("1f5a5-fe0f", "1f4df", "LOS MENSAJES *TE LLEGAN SOLOS*", "empujados desde el servidor")
    E["bb_pulgares"] = lista([("1f44d", "teclado para pulgares"), ("1f50b", "batería para días"), ("1f512", "muy seguro")], "")
    E["bb_bolsillo"] = f'''{F("", True)}{obj(spr("1f3e2", 200), 24, 44, "pop", "", .2)}{txt('<div class="vs" style="--d:.8s">→</div>', 46, 44, 16)}{obj(movil(200), 70, 48, "zoom", "float", 1.1)}{txt(kt("LA OFICINA *EN EL BOLSILLO*", "xl", 1.4), 50, 88, 90)}'''
    E["bb_nombre"] = impacto("pero aquel aparato necesitaba", "UN *NOMBRE*", "", "1f3f7-fe0f")
    E["bb_lexicon"] = icono_texto("1f3f7-fe0f", "LEXICON", "la agencia que también bautizó al Pentium", "California, expertos en nombres", "izq", "", False, "pop", "bob")
    E["bb_semillas"] = f'''{F("calido", True)}{obj(spr("1f353", 260), 26, 48, "pop", "bob", .2)}{txt('<div class="vs" style="--d:.8s">=</div>', 46, 48, 14)}{obj(movil(170), 64, 48, "pop", "float", 1.0)}{txt(kt("TECLAS COMO *SEMILLAS DE FRESA*", "xl", 1.3), 50, 88, 90)}'''
    E["bb_lenta"] = icono_texto("1f40c", "«FRESA»: *DEMASIADO LENTA*", "y el producto prometía rapidez", "en la pizarra:", "der", "", False, "left", "bob")
    E["bb_mora"] = titular("*BLACKBERRY*", "mora, en inglés", "y entonces alguien propuso…", ("1fad0", "26a1", "2728", "1f4f1"))
    E["bb_locura"] = icono_texto("1f92f", "«UNA *LOCURA*»", "pensaron los directivos, según el fundador de la agencia", "", "izq", "", False, "pop", "swing")
    E["bb_fruta"] = comparar("1fad0", "una fruta simpática", "1f916", "nombres fríos y técnicos", "VS")
    E["bb_telefono"] = cifra("2002", "LOS PRIMEROS BLACKBERRY QUE TAMBIÉN SON TELÉFONO", "1f4de")
    E["bb_bancos"] = lista([("1f3e6", "bancos"), ("2696-fe0f", "despachos"), ("1f4f0", "redacciones"), ("1f3db-fe0f", "gobiernos")], "SE EXTIENDE POR…")
    E["bb_soltar"] = lista([("1f465", "en las reuniones"), ("1f37d-fe0f", "en la cena"), ("1f6cf-fe0f", "en la cama")], "IMPOSIBLE SOLTARLO")
    E["bb_crackberry"] = titular("*CRACKBERRY*", "la marca + una droga muy adictiva", "el mote:", ("1f4f1", "1f9f2", "1f62e", "1f501"))
    E["bb_palabra"] = cifra("2006", "PALABRA DEL AÑO PARA UN DICCIONARIO DE EE. UU.", "1f4d6")
    E["bb_importante"] = icono_texto("1f60e", "SEÑAL DE QUE *ERAS ALGUIEN*", "localizable a todas horas", "", "der", "", True, "pop", "bob")
    E["bb_apagarse"] = impacto("en plena euforia…", "¿A PUNTO DE *APAGARSE*?", "no por la competencia, sino por un juez", "1f50c")
    E["bb_ntp"] = icono_texto("1f4dc", "NTP: *PATENTES*", "sobre el correo sin cables; casi no fabricaba nada", "una pequeña empresa", "izq", "", False, "pop", "bob")
    E["bb_juicio"] = comparar("2696-fe0f", "a los tribunales", "1f3c6", "y NTP gana", "→")
    E["bb_corte"] = icono_texto("1f6ab", "¿CORTAR EL SERVICIO *EN TODO EL PAÍS*?", "una posibilidad real durante meses", "", "der", "dark", False, "pop", "glow")
    E["bb_nervios"] = icono_texto("1f630", "USUARIOS *NERVIOSOS*", "entre ellos, muchos empleados del gobierno", "", "izq", "", False, "pop", "swing")
    E["bb_pago"] = cifra("+600 M$", "MARZO DE 2006: PAGA A NTP PARA ZANJARLO", "1f4b8")
    E["bb_sigue"] = icono_texto("2705", "CARÍSIMO… *PERO SIGUE FUNCIONANDO*", "", "", "der", "", True, "pop", "bob")
    E["bb_2009"] = impacto("el ejemplo más famoso", "2009", "", "1f5f3-fe0f")
    E["bb_obama"] = icono_texto("1f1fa-1f1f8", "EL NUEVO PRESIDENTE, *MUY AFICIONADO*", "a su BlackBerry", "Barack Obama", "izq", "", False, "pop", "bob", 380, (("1f4f1", 86, 80),))
    E["bb_seguridad"] = icono_texto("1f575-fe0f", "LA SEGURIDAD *NO QUERÍA*", "temían que pudieran interceptarlo", "", "der", "dark", False, "pop", "")
    E["bb_insiste"] = icono_texto("1f512", "SE QUEDA UNO, *BLINDADO*", "con medidas de seguridad especiales, según la prensa", "", "izq", "", True, "pop", "bob")
    E["bb_anuncio"] = titular("EL MEJOR *ANUNCIO POSIBLE*", "el hombre más poderoso del mundo no lo soltaba", "", ("1f4f1", "1f3db-fe0f", "1f4aa", "2b50"), "", True, "xl")
    E["bb_jovenes"] = impacto("algo que no habían planeado:", "LOS *ADOLESCENTES*", "también lo querían", "1f9d1")
    E["bb_bbm"] = icono_texto("1f4ac", "BLACKBERRY *MESSENGER*", "mensajes gratis entre aparatos de la marca", "", "izq", "", True, "pop", "bob")
    E["bb_whatsapp"] = lista([("1f4b8", "sin pagar por mensaje"), ("2714-fe0f", "saber si lo han leído"), ("1f522", "un código personal")], "ANTES DE QUE WHATSAPP SE HICIERA POPULAR")
    E["bb_pin"] = bocadillos("1f60f", ["¿Me das tu PIN?", "…"], "en muchos países, una forma de ligar")
    E["bb_cuota"] = cifra("1/5", "DEL MERCADO MUNDIAL DE SMARTPHONES", "1f30d", "hacia 2009, alrededor de…")
    E["bb_imparable"] = impacto("", "PARECÍA *IMPARABLE*", "", "1f680")
    E["bb_iphone"] = fecha("9", "ENERO", "2007", "Steve Jobs presenta el iPhone", "1f34e")
    E["bb_pantalla"] = comparar("1f4f1", "todo pantalla", "1f6ab", "sin teclado físico", "+")
    E["bb_serio"] = lista([("1faab", "poca batería"), ("1f44e", "escribir en un cristal"), ("1f513", "seguridad dudosa")], "SEGÚN SE CUENTA, NO SE LO TOMARON EN SERIO")
    E["bb_clientes"] = icono_texto("1f454", "ELLOS TENÍAN *LOS CLIENTES QUE IMPORTABAN*", "profesionales y gobiernos", "", "izq", "", False, "pop", "bob")
    E["bb_personas"] = comparar("1f3e2", "no iba dirigido a las empresas", "1f465", "iba dirigido a las personas", "≠")
    E["bb_trabajo"] = flecha("1f3e0", "1f3e2", "Y LO QUISIERON *TAMBIÉN EN EL TRABAJO*", "")
    E["bb_android"] = icono_texto("1f916", "2008: *EL PRIMER ANDROID*", "la competencia ya no era una: eran dos", "", "der", "", False, "pop", "bob")
    E["bb_reacciona"] = impacto("", "BLACKBERRY *INTENTA REACCIONAR*", "", "1f3c3")
    E["bb_storm"] = lista([("1f40c", "lento"), ("1f446", "pantalla que se presiona"), ("1f44e", "muchas críticas")], "SU PRIMER MÓVIL TÁCTIL")
    E["bb_playbook"] = icono_texto("1f4f2", "2011: *PLAYBOOK*", "una tableta… al principio sin su propia aplicación de correo", "contra el iPad", "izq", "", False, "pop", "swing")
    E["bb_apagon"] = f'''{F("dark")}{obj(movil(220, "#111"), 26, 50, "drop", "", .2)}{txt(kt("OCTUBRE DE 2011", "l hueso", .4), 66, 30, 58)}{txt(kt("MILLONES, *SIN CORREO NI MENSAJES*", "xl hueso", .8), 66, 46, 58)}{txt(kt("durante varios días", "l naranja", 1.5), 66, 62, 58)}'''
    E["bb_golpe"] = titular("UN GOLPE *DURÍSIMO*", "para la marca de estar siempre conectado", "", ("1f4a5", "1f50c", "1f4f1", "1f4c9"), "dark", True, "xl")
    E["bb_dejan"] = comparar("1f468-200d-1f393", "Lazaridis", "1f468-200d-1f4bc", "Balsillie", "+", "2012: DEJAN LA DIRECCIÓN")
    E["bb_renombre"] = flecha("1f3e2", "1fad0", "RESEARCH IN MOTION *PASA A LLAMARSE BLACKBERRY*", "2013")
    E["bb_bb10"] = comparar("1f4f1", "sistema y móviles nuevos", "231b", "pero años tarde", "+", "")
    E["bb_cero"] = cifra("0 %", "CUOTA DE MERCADO, PRÁCTICAMENTE", "1f4c9")
    E["bb_2016"] = icono_texto("1f6d1", "2016: *DEJA DE DISEÑAR TELÉFONOS*", "", "", "izq", "", False, "pop", "")
    E["bb_2022"] = fecha("4", "ENERO", "2022", "se apagan los servicios de sus antiguos sistemas", "1f50c")
    E["bb_hoy"] = icono_texto("1f6e1-fe0f", "HOY: *SOFTWARE Y CIBERSEGURIDAD*", "la empresa sigue existiendo", "", "der", "", True, "pop", "bob")
    E["leccion1"] = leccion(1, "un buen nombre puede salir de", "*UN DETALLE TONTO*", "1f353")
    E["leccion2"] = leccion(2, "lo que te hace fuerte", "*PUEDE ATARTE*", "2328-fe0f")
    E["leccion3"] = leccion(3, "el peligro no siempre viene de", "TU *COMPETENCIA DIRECTA*", "1f4f1")
    E["bb_final"] = lista([("1f1e8-1f1e6", "dos amigos"), ("1f3e0", "una hipoteca"), ("1f353", "una fresa lenta"), ("1f1fa-1f1f8", "un presidente"), ("1f4f1", "un móvil sin teclas")], "")
    E["bb_pulgar"] = f'''{F("", True)}{obj(movil(260), 30, 50, "drop", "float", .2)}{obj(spr("1f44d", 160), 44, 72, "pop", "bob", .9)}{txt(kt("CUANDO LOS PULGARES *PULSABAN BOTONES*", "xl", .9), 70, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo dark" style="inset:0"></div>
      <div style="position:absolute;left:110px;top:120px;transform:rotate(-8deg)">{movil(300)}</div>
      <div style="position:absolute;left:330px;top:430px">{vicon("chart-decreasing", 220)}</div>
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">LO TENÍA TODO…</div><div class="q" style="font-size:170px;margin-top:22px">Y LO PERDIÓ</div><div class="y">LA HISTORIA DE BLACKBERRY</div></div>'''
