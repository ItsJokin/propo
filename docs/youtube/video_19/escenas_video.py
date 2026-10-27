"""Escenas del vídeo 19 (Pepsi, formato largo). Motor común; sin logotipos: latas, chapas y barcos genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f3e5", 2: "1f36c", 3: "1f91d", 4: "1fa99", 5: "1f1f7-1f1fa", 6: "1f943", 7: "1f6a2", 8: "1f522", 9: "1f3a4",
              10: "1f35f", 11: "1f9e0"}

def lata(color=AZUL, etiqueta="COLA", px=200):
    return (f'<svg width="{px}" height="{px*1.75:.0f}" viewBox="0 0 100 175"><defs><linearGradient id="b{color[1:]}" x1="0" x2="1">'
            f'<stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".35" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>'
            f'<rect x="8" y="14" width="84" height="150" rx="14" fill="{color}"/><rect x="8" y="14" width="84" height="150" rx="14" fill="url(#b{color[1:]})"/>'
            f'<rect x="12" y="4" width="76" height="16" rx="6" fill="#c9ced6"/><rect x="12" y="158" width="76" height="12" rx="6" fill="#aeb4bd"/>'
            f'<text x="50" y="98" font-family="Bebas" font-size="30" fill="white" text-anchor="middle" transform="rotate(-90 50 90)">{etiqueta}</text></svg>')

def submarino(px=420, color="#5b6270"):
    return (f'<svg width="{px}" height="{px*0.35:.0f}" viewBox="0 0 300 105"><path d="M20,60 C20,35 60,30 150,30 C240,30 280,40 285,60 C280,80 240,90 150,90 C60,90 20,85 20,60Z" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="120" y="8" width="50" height="26" rx="6" fill="{color}" stroke="{TINTA}" stroke-width="4"/><rect x="140" y="0" width="6" height="12" fill="{TINTA}"/>'
            f'<path d="M285,60 L298,45 L298,75Z" fill="{color}" stroke="{TINTA}" stroke-width="3"/>' + "".join(f'<circle cx="{70 + i*40}" cy="58" r="7" fill="#c9ced6" stroke="{TINTA}" stroke-width="2"/>' for i in range(4)) + '</svg>')

def chapa(num="349", px=220, color=AZUL):
    dientes = "".join(f'<path d="M50,50 L{50 + 48*__import__("math").cos(i*0.2618):.1f},{50 + 48*__import__("math").sin(i*0.2618):.1f}" stroke="{TINTA}" stroke-width="1"/>' for i in range(24))
    return (f'<svg width="{px}" height="{px}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#c9ced6" stroke="{TINTA}" stroke-width="3"/>{dientes}'
            f'<circle cx="50" cy="50" r="38" fill="{color}" stroke="{TINTA}" stroke-width="3"/><text x="50" y="62" font-family="Bebas" font-size="34" fill="#fff" text-anchor="middle">{num}</text></svg>')

def escenas():
    E = {}
    E["pe_segundo"] = comparar("1f947", "el líder", "1f948", "el eterno segundo", "VS", "LA GRAN RIVAL")
    E["pe_extrana"] = impacto("su historia es", "MUCHO MÁS *EXTRAÑA*", "de lo que parece", "1f92a")
    E["pe_lista"] = lista([("1f4c9", "dos quiebras"), ("1f91d", "casi vendida al rival"), ("1f1f7-1f1fa", "un vaso en Moscú")], "")
    E["pe_submarinos"] = f'''{F("dark", True)}{obj(submarino(560), 50, 40, "left", "float", .2)}{txt(kt("UNA FLOTA *DE SUBMARINOS*", "xl hueso", .8), 50, 74, 90)}'''
    E["pe_numero"] = f'''{F("", True)}{obj(chapa("349", 280), 30, 48, "spin", "pulse", .2)}{txt(kt("UN NÚMERO QUE PROVOCÓ *DISTURBIOS*", "xl", .8), 70, 46, 52)}'''
    E["pe_creeme"] = titular("NO SE PARECE *A NINGUNA OTRA*", "créeme", "", ("1f92f", "1f6a2", "1f943", "1f522"), "", True, "xl")
    E["pe_farmacia"] = icono_texto("1f3e5", "TAMBIÉN NACIÓ *EN UNA FARMACIA*", "del sur de Estados Unidos", "como Coca-Cola…", "izq", "sepia", False, "zoom", "bob")
    E["pe_bradham"] = icono_texto("1f468-200d-2695-fe0f", "CALEB *BRADHAM*", "farmacéutico en New Bern, Carolina del Norte", "", "der", "sepia", False, "up", "bob")
    E["pe_mezcla"] = lista([("1f36c", "azúcar"), ("1f366", "vainilla"), ("1f9f4", "aceites"), ("1f330", "nuez de cola")], "1893: UNA MEZCLA")
    E["pe_brad"] = f'''{F("sepia", True)}{obj(spr("1f964", 240), 26, 46, "pop", "bob", .2)}{txt(kt("«LA BEBIDA *DE BRAD*»", "xl", .6), 66, 42, 56)}{txt(kt("así la llamaban sus clientes", "l", 1.3), 66, 58, 56)}<div class="viñeta"></div>'''
    E["pe_1898"] = anio(1800, 1898, "un nombre con más gancho: Pepsi-Cola", "1f3f7-fe0f")
    E["pe_pepsina"] = icono_texto("1f9ea", "¿POR QUÉ *«PEPSI»*?", "probablemente por la pepsina: la presentaba como buena para la digestión", "", "izq", "", True, "pop", "swing")
    E["pe_crece"] = f'''{F()}{obj(spr("1f5fa-fe0f", 280), 30, 48, "zoom", "", .2)}{"".join(obj(spr("1f3ed", 80), x, y, "pop", "", .6 + i * .12) for i, (x, y) in enumerate([(20, 38), (34, 44), (26, 58), (40, 36), (38, 60), (22, 50)]))}
      {txt(kt("EMBOTELLADORAS EN *DECENAS DE ESTADOS*", "xl", 1.2), 72, 48, 50)}'''
    E["pe_guerra"] = impacto("y entonces llegó", "LA *PRIMERA GUERRA MUNDIAL*", "", "2694-fe0f")
    E["pe_azucar"] = icono_texto("1f36c", "EL AZÚCAR, *POR LAS NUBES*", "y muy difícil de conseguir", "", "izq", "", True, "drop", "pulse", 340, (("1f4c8", 86, 80),))
    E["pe_compra"] = f'''{F()}{"".join(obj(spr("1f4e6", 140), 12 + (i % 4) * 11, 34 + (i // 4) * 22, "drop", "", .1 + i * .1) for i in range(8))}{txt(kt("COMPRA *MUCHÍSIMO AZÚCAR*", "xl", 1.0), 74, 40, 46)}{txt(kt("a un precio altísimo", "l", 1.6), 74, 56, 46)}'''
    E["pe_desploma"] = f'''{F("", True)}{txt(kt("28 ¢", "mega gris", .2, .1, "slam"), 26, 42, 36)}{txt('<div class="vs" style="--d:.8s">→</div>', 50, 42, 10)}{txt(kt("5 ¢", "mega rojo", 1.2, .1, "slam"), 74, 42, 36)}{txt(kt("el precio de la libra de azúcar, según las crónicas", "l", 1.8), 50, 70, 90)}'''
    E["pe_almacen"] = icono_texto("1f3da-fe0f", "UN ALMACÉN DE *AZÚCAR CARÍSIMO*", "y no podía subir el precio del refresco", "", "der", "sepia", False, "drop", "")
    E["pe_quiebra"] = cifra("1923", "PEPSI, EN QUIEBRA", "1f4c9")
    E["pe_vuelve"] = icono_texto("1f3e5", "BRADHAM VUELVE *A SU FARMACIA*", "la marca se vendió por unos pocos miles de dólares", "", "izq", "dark", False, "pop", "")
    E["pe_otra"] = impacto("principios de los años treinta:", "OTRA *QUIEBRA*", "", "1f4c9")
    E["pe_guth"] = icono_texto("1f468-200d-1f4bc", "CHARLES *GUTH*", "dueño de una cadena de tiendas de dulces, enfadado con Coca-Cola", "", "izq", "", True, "up", "bob", 340, (("1f36d", 86, 80),))
    E["pe_tiendas"] = flecha("1f964", "1f3ea", "SU PROPIO REFRESCO, *PARA SUS TIENDAS*", "")
    E["pe_mal"] = icono_texto("1f615", "AL PRINCIPIO, *NO FUE BIEN*", "", "", "der", "", False, "pop", "swing")
    E["pe_ofrece"] = f'''{F("dark", True)}{obj(lata(AZUL, "RIVAL", 200), 28, 48, "left", "", .2)}{obj(spr("1f91d", 180), 50, 44, "pop", "", .8)}{obj(lata(ROJO, "LÍDER", 200), 72, 48, "right", "", .4)}
      {txt(kt("¿SE LA OFRECIÓ *A COCA-COLA*?", "xl hueso", 1.2), 50, 86, 90)}'''
    E["pe_nointeresa"] = icono_texto("1f645", "COCA-COLA *NO SE INTERESÓ*", "según la versión más repetida", "", "izq", "", False, "pop", "shake")
    E["pe_quiza"] = titular("¿SIN LA RIVALIDAD *MÁS FAMOSA*?", "quizá no existiría", "", ("1f914", "1f964", "1f94a", "2753"), "", True, "xl")
    E["pe_arma"] = impacto("sobrevivir por su cuenta, con un arma:", "EL *PRECIO*", "", "1fa99")
    E["pe_depresion"] = icono_texto("1f4c9", "LA *GRAN DEPRESIÓN*", "cuando la gente miraba cada moneda", "", "izq", "sepia", False, "drop", "")
    E["pe_doble"] = f'''{F("", True)}{obj(spr("1f964", 150), 28, 52, "pop", "", .2)}{obj(spr("1f964", 260), 66, 46, "zoom", "bob", .7)}{txt(kt("5 ¢", "xl", .4), 28, 74, 20)}{txt(kt("5 ¢", "xl", .9), 66, 78, 20)}
      {txt(kt("EL MISMO PRECIO, *CASI EL DOBLE*", "xl", 1.4), 50, 14, 90)}'''
    E["pe_jingle"] = f'''{F("sepia", True)}{obj(spr("1f4fb", 260), 28, 48, "pop", "pulse", .2)}{obj(spr("1f3b6", 160), 44, 26, "pop", "float", .8)}{txt(kt("DE LAS PRIMERAS CANCIONES *DE RADIO*", "xl", .7), 70, 42, 52)}{txt(kt("en todo el país", "l", 1.4), 70, 58, 52)}<div class="viñeta"></div>'''
    E["pe_mensaje"] = titular("EL DOBLE *POR EL MISMO DINERO*", "fácil de recordar", "", ("1f3b6", "1fa99", "1f964", "1f44d"), "", True, "xl")
    E["pe_alternativa"] = flecha("1f4c9", "1f4c8", "DE CASI DESAPARECER… *A LA GRAN ALTERNATIVA*", "")
    E["pe_moscu"] = f'''{F("dark")}{obj(skyline(1800, "#3b2a24"), 50, 86, "none")}{txt(kt("MOSCÚ, 1959", "mega naranja", .3, .1, "slam"), 50, 32, 95)}{txt(kt("plena Guerra Fría", "l hueso", 1.1), 50, 50, 80)}{obj(spr("1f1f7-1f1fa", 150), 86, 20, "pop", "bob", .8)}'''
    E["pe_exposicion"] = icono_texto("1f3ea", "UNA *EXPOSICIÓN* ESTADOUNIDENSE", "para mostrar su forma de vida en la capital soviética", "", "izq", "", True, "zoom", "")
    E["pe_debate"] = comparar("1f1fa-1f1f8", "Richard Nixon", "1f1f7-1f1fa", "Nikita Jrushchov", "VS", "UN DEBATE FAMOSO")
    E["pe_puesto"] = flecha("1f9d1-200d-1f4bc", "1f964", "NIXON LO LLEVA *AL PUESTO DE PEPSI*", "")
    E["pe_kendall"] = icono_texto("1f468-200d-1f4bc", "DONALD *KENDALL*", "el directivo de la marca le ofrece un vaso", "", "der", "", True, "up", "bob", 340, (("1f964", 14, 80),))
    E["pe_vasos"] = f'''{F()}{"".join(obj(spr("1f964", 150), 16 + i * 14, 46, "drop", "", .2 + i * .25) for i in range(6))}{txt(kt("VARIOS VASOS, *SEGÚN KENDALL*", "xl", 1.6), 50, 80, 90)}'''
    E["pe_foto"] = icono_texto("1f4f8", "PUBLICIDAD *GRATUITA* EN TODO EL MUNDO", "y Kendall, futuro jefe de la compañía, no olvidó aquel contacto", "", "izq", "calido", True, "flip", "glow")
    E["pe_urss"] = flecha("1f1fa-1f1f8", "1f1f7-1f1fa", "AÑOS SETENTA: *PEPSI EN LA URSS*", "un acuerdo histórico")
    E["pe_primeros"] = titular("DE LOS *PRIMEROS*", "productos de consumo occidentales en llegar", "", ("1f964", "2728", "1f1f7-1f1fa", "1f947"), "", True, "xl")
    E["pe_rublo"] = comparar("1f4b4", "el rublo", "1f4b5", "no se cambiaba libremente por dólares", "≠", "UN PROBLEMA")
    E["pe_cobrar"] = impacto("", "¿CÓMO *COBRAR*?", "", "1f914")
    E["pe_vodka"] = comparar("1f964", "refrescos", "1f943", "vodka", "⇄", "EL TRUEQUE")
    E["pe_pago"] = icono_texto("1f943", "EL VODKA, *FORMA DE PAGO*", "Pepsi lo vendía en Estados Unidos", "", "izq", "", True, "pop", "swing")
    E["pe_renueva"] = icono_texto("1f4dd", "EL VODKA *YA NO BASTABA*", "finales de los ochenta: el acuerdo se renueva", "", "der", "", False, "pop", "")
    E["pe_surrealista"] = impacto("uno de los episodios", "MÁS *SURREALISTAS*", "de la historia de los negocios", "1f92f")
    E["pe_flota"] = f'''{F("dark", True)}{"".join(obj(submarino(200), 12 + (i % 4) * 25, 22 + (i // 4) * 16, "left", "float", .1 + i * .08) for i in range(8))}
      {txt(kt("17 SUBMARINOS + CRUCERO + FRAGATA + DESTRUCTOR", "xl naranja", 1.0), 50, 82, 95)}{txt(kt("1989", "l hueso", .2), 50, 94, 40)}'''
    E["pe_chatarra"] = flecha("1f6a2", "1f5d1-fe0f", "BARCOS VIEJOS → *CHATARRA*", "Pepsi no quería una armada")
    E["pe_mundo"] = icono_texto("1f30d", "LA ANÉCDOTA *DIO LA VUELTA AL MUNDO*", "", "", "izq", "", True, "zoom", "spin-slow")
    E["pe_desarmando"] = bocadillos("1f468-200d-1f4bc", ["Estamos desarmando a la URSS…", "…más rápido que vosotros"], "la frase que se atribuye a Kendall")
    E["pe_exageracion"] = icono_texto("1f9d0", "¿UNA DE LAS MAYORES FLOTAS? *EXAGERADO*", "aquellos barcos no estaban para ir a la guerra", "", "der", "", False, "pop", "swing")
    E["pe_dificil"] = f'''{F("", True)}{obj(lata(AZUL, "COLA", 180), 26, 48, "drop", "", .2)}{txt('<div class="vs" style="--d:.7s">+</div>', 42, 46, 10)}{obj(submarino(300), 66, 46, "left", "float", 1.0)}{txt(kt("DIFÍCIL DE *SUPERAR*", "xl", 1.5), 50, 84, 90)}'''
    E["pe_filipinas"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("FILIPINAS, 1992", "mega", .3, .1, "slam"), 50, 34, 95)}{obj(spr("1f1f5-1f1ed", 150), 86, 20, "pop", "bob", .8)}'''
    E["pe_chapas"] = f'''{F("", True)}{"".join(obj(chapa(n, 170), 16 + i * 17, 40, "drop", "spin-slow", .2 + i * .2) for i, n in enumerate(["127", "586", "033", "912", "450"]))}{obj(spr("1f4fa", 170), 50, 72, "pop", "", 1.4)}
      {txt(kt("UN NÚMERO EN CADA CHAPA; *EL GANADOR, EN LA TELE*", "l", 1.6), 50, 86, 95)}'''
    E["pe_premio"] = cifra("1 MILLÓN", "DE PESOS: EL PREMIO GORDO", "1f4b0", "una fortuna en el país")
    E["pe_exito"] = icono_texto("1f4c8", "UN ÉXITO *ENORME*", "millones de personas compraban esperando su número", "", "izq", "", True, "zoom", "bob")
    E["pe_349"] = f'''{F("dark", True)}{obj(chapa("349", 340), 50, 42, "zoom", "pulse", .3)}{txt(kt("UNA NOCHE, EL NÚMERO *349*", "xl hueso", 1.0), 50, 86, 90)}'''
    E["pe_error"] = f'''{F()}{"".join(obj(chapa("349", 110), 8 + (i % 9) * 10.5, 22 + (i // 9) * 18, "drop", "", .05 + i * .03) for i in range(27))}{txt(kt("ERROR INFORMÁTICO: *CIENTOS DE MILES* DE CHAPAS", "xl", 1.4), 50, 84, 95)}'''
    E["pe_reclaman"] = comparar("1f465", "decenas de miles reclaman su millón", "1f645", "Pepsi ofrece mucho menos", "VS")
    E["pe_disturbios"] = icono_texto("1f525", "PROTESTAS, DEMANDAS *Y DISTURBIOS*", "con consecuencias trágicas; años para recuperar su imagen", "", "izq", "dark", True, "pop", "pulse")
    E["pe_juventud"] = icono_texto("1f60e", "SU GRAN ESTRATEGIA: *LA JUVENTUD*", "en Estados Unidos", "", "der", "", True, "pop", "bob")
    E["pe_nuevo"] = comparar("1f474", "Coca-Cola: la tradición", "1f9d1", "Pepsi: la nueva generación", "VS")
    E["pe_desafio"] = icono_texto("1f964", "EL *DESAFÍO*", "catas a ciegas en la calle (años setenta)", "", "izq", "", True, "pop", "bob", 340, (("1f440", 86, 22),))
    E["pe_estrellas"] = titular("LAS ESTRELLAS *MÁS GRANDES*", "años ochenta", "", ("2b50", "1f3a4", "1f3b8", "1f31f"))
    E["pe_mj"] = f'''{F("dark", True)}{obj(spr("1f3a4", 240), 26, 46, "pop", "", .2)}{obj(spr("1f525", 200), 42, 34, "pop", "pulse", .9)}{txt(kt("1984: UN ACCIDENTE *EN UN RODAJE*", "xl hueso", .7), 70, 40, 52)}{txt(kt("un efecto pirotécnico quemó el pelo de Michael Jackson", "l naranja", 1.4), 70, 58, 52)}'''
    E["pe_epoca"] = icono_texto("1f4fa", "ASOCIADA A UNA *ÉPOCA*", "la de las grandes estrellas", "", "der", "", True, "zoom", "")
    E["pe_movimiento"] = impacto("su mayor movimiento", "NO FUE *UN REFRESCO*", "", "1f35f")
    E["pe_fritolay"] = comparar("1f964", "Pepsi", "1f35f", "Frito-Lay", "+", "1965: NACE PEPSICO")
    E["pe_picar"] = bocadillos("1f60b", ["¿Un refresco?", "¿Y algo para picar?"], "la idea era sencilla")
    E["pe_gigante"] = icono_texto("1f30d", "UNO DE LOS MAYORES *GRUPOS DE ALIMENTACIÓN*", "y buena parte del negocio son aperitivos", "", "izq", "", True, "zoom", "spin-slow")
    E["pe_espana"] = f'''{F("calido", True)}{obj(spr("1f1ea-1f1f8", 170), 14, 24, "pop", "bob", .2)}{obj(spr("1f35f", 220), 30, 52, "drop", "bob", .5)}{obj(lata(NARANJA, "NARANJA", 170), 50, 52, "drop", "", .8)}
      {txt(kt("EN ESPAÑA: *LAY'S Y KAS*", "xl", 1.0), 76, 34, 44)}{txt(kt("Kas nació en Vitoria; PepsiCo la compró a principios de los noventa", "l", 1.6), 76, 60, 44)}'''
    E["pe_segundo2"] = comparar("1f948", "el eterno segundo en refrescos", "1f3e2", "pero detrás, un gigante", "…")
    E["leccion1"] = leccion(1, "a Bradham lo arruinó el azúcar, no su refresco", "UNA MALA APUESTA *PUEDE HUNDIRTE*", "1f36c")
    E["leccion2"] = leccion(2, "si no puedes ser el primero", "SÉ *EL DIFERENTE*", "1f60e")
    E["leccion3"] = leccion(3, "en una promoción", "UN ERROR PUEDE COSTAR *MÁS QUE LA CAMPAÑA*", "1f522")
    E["pe_final"] = lista([("1f4c9", "dos quiebras"), ("1f645", "una oferta rechazada"), ("1f964", "un vaso en Moscú"), ("1f6a2", "submarinos"), ("1f522", "el 349")], "")
    E["pe_todo"] = titular("TODO ESO *ES PEPSI*", "", "", ("1f964", "1f6a2", "1f943", "1f522"))
    return E

def miniatura():
    return f'''<div class="fondo dark" style="inset:0"></div>
      <div style="position:absolute;left:20px;top:330px">{submarino(520)}</div>
      <div style="position:absolute;left:150px;top:60px;transform:rotate(-10deg)">{lata(AZUL, "COLA", 150)}</div>
      <div class="big" style="top:100px"><div class="s" style="color:#FAF7F0">PEPSI TUVO UNA</div><div class="q" style="font-size:170px;margin-top:22px">FLOTA DE</div><div class="q" style="font-size:150px">SUBMARINOS</div><div class="y">HISTORIA REAL</div></div>'''
