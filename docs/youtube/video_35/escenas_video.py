"""Escenas del vídeo 35 (KitKat, formato largo). Motor común; sin logotipos: chocolatinas genéricas dibujadas."""
from base import *

CAP_ICONOS = {1: "1f3ed", 2: "1f4ee", 3: "1f36b", 4: "1f356", 5: "1f535", 6: "2615", 7: "1f1e8-1f1ed", 8: "1f1ef-1f1f5",
              9: "1f4f1", 10: "1f9a7", 11: "1f590-fe0f", 12: "1f9e0"}

def barritas(px=360, n=4, envoltorio=ROJO):
    b = "".join(f'<rect x="{20 + i*(160/n)}" y="30" width="{160/n - 8}" height="70" rx="6" fill="#6b3a1f" stroke="#3d1f0e" stroke-width="3"/>'
                f'<rect x="{26 + i*(160/n)}" y="36" width="{160/n - 20}" height="10" rx="3" fill="#8a5130"/>' for i in range(n))
    env = (f'<path d="M10,96 L190,96 L190,130 L10,130Z" fill="{envoltorio}" stroke="{TINTA}" stroke-width="3"/>'
           f'<path d="M10,96 L190,96" stroke="#c9c9c9" stroke-width="4"/>') if envoltorio else ""
    return f'<svg width="{px}" height="{px*0.68:.0f}" viewBox="0 0 200 136">{env}{b}</svg>'

def escenas():
    E = {}
    E["kk_barritas"] = f'''{F("", True)}{obj(barritas(420), 30, 50, "drop", "float", .2)}{txt(kt("PARTES, *CRUJE*, Y TE TOMAS UN DESCANSO", "xl", .9), 72, 46, 48)}'''
    E["kk_vendidas"] = titular("DE LAS MÁS *VENDIDAS DEL MUNDO*", "", "", ("1f36b", "1f30d", "1f4c8", "2728"), "", True, "xl")
    E["kk_buzon"] = icono_texto("1f4ee", "LA IDEA: *UN BUZÓN DE SUGERENCIAS*", "en una fábrica inglesa, según se cuenta", "", "izq", "", True, "drop", "bob")
    E["kk_club"] = comparar("1f3a9", "un club del siglo XVIII", "1f356", "una taberna famosa por sus empanadas", "+", "EL NOMBRE")
    E["kk_japon"] = icono_texto("1f1ef-1f1f5", "EN JAPÓN: *UN AMULETO*", "para los exámenes, con cientos de sabores", "", "der", "calido", True, "pop", "bob")
    E["kk_historia"] = titular("LA HISTORIA DE *KITKAT*", "", "", ("1f36b", "1f4ee", "1f356", "1f1ef-1f1f5"), "", True, "xl")
    E["kk_york"] = f'''{F("sepia", True)}{obj(skyline(1800, "#6b4b36"), 50, 86, "none")}{txt(kt("YORK", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("murallas medievales… y olor a chocolate", "l", 1.1), 50, 48, 80)}<div class="viñeta"></div>'''
    E["kk_rowntree"] = icono_texto("1f3ed", "*ROWNTREE'S*", "fundada por una familia cuáquera, siglo XIX", "", "izq", "sepia", False, "pop", "bob")
    E["kk_cuidar"] = lista([("1f3e0", "viviendas"), ("1f3eb", "escuelas"), ("1f4da", "una biblioteca")], "PARA SUS TRABAJADORES")
    E["kk_fundacion"] = icono_texto("1f474", "JOSEPH *ROWNTREE*", "sus fundaciones aún estudian la pobreza", "", "der", "", False, "up", "bob")
    E["kk_competia"] = lista([("1f36c", "caramelos"), ("2615", "cacao"), ("1f36b", "bombones")], "AÑOS 30: COMPETENCIA FEROZ")
    E["kk_nuevo"] = impacto("necesitaban", "ALGO *NUEVO*", "que vendiera mucho y costara poco", "1f4a1")
    E["kk_buzon2"] = icono_texto("1f4ee", "UN BUZÓN *DE SUGERENCIAS*", "cualquier trabajador podía dejar ideas", "", "izq", "", False, "drop", "bob")
    E["kk_nota"] = icono_texto("1f4dd", "UNA NOTA *MUY CONCRETA*", "según cuenta la propia marca", "", "der", "", False, "pop", "swing")
    E["kk_fiambrera"] = bocadillos("1f477", ["Algo para llevar al trabajo…", "…en la fiambrera"], "la sugerencia")
    E["kk_descanso"] = lista([("23f8-fe0f", "para el descanso"), ("1f9ca", "que no se deshaga"), ("1fa99", "barato")], "")
    E["kk_galleta"] = f'''{F("calido", True)}{obj(barritas(400, 4, None), 30, 50, "zoom", "float", .2)}{txt(kt("GALLETA FINA *CUBIERTA DE CHOCOLATE*", "xl", .9), 72, 46, 48)}'''
    E["kk_1935"] = fecha("29", "AGOSTO", "1935", "a la venta en Londres y el sur de Inglaterra", "1f1ec-1f1e7")
    E["kk_crisp"] = f'''{F("sepia", True)}{obj(barritas(300), 26, 50, "drop", "", .2)}{txt(kt("ROWNTREE'S *CHOCOLATE CRISP*", "xl", .7), 68, 42, 56)}{txt(kt("un nombre mucho más aburrido", "l", 1.4), 68, 58, 56)}<div class="viñeta"></div>'''
    E["kk_peniques"] = comparar("1f36b", "cuatro barritas", "1fa99", "dos peniques", "=")
    E["kk_aero"] = lista([("1f36b", "KitKat"), ("1fae7", "Aero, con burbujas"), ("1f308", "Smarties")], "EN APENAS TRES AÑOS")
    E["kk_dos"] = f'''{F()}{obj(barritas(300), 30, 48, "left", "", .2)}{obj(barritas(170, 2), 70, 48, "right", "", .7)}{txt(kt("1936: LA VERSIÓN *DE DOS*", "xl", 1.2), 50, 82, 90)}'''
    E["kk_1937"] = cifra("1937", "KITKAT CHOCOLATE CRISP", "1f3f7-fe0f", "un nombre registrado hacía años")
    E["kk_donde"] = impacto("y entonces…", "¿DE DÓNDE VIENE *KITKAT*?", "", "2753")
    E["kk_londres"] = cifra("LONDRES", "PRINCIPIOS DEL SIGLO XVIII", "1f3f0")
    E["kk_kitcat"] = lista([("270d-fe0f", "escritores"), ("1f3db-fe0f", "políticos"), ("1f3a9", "aristócratas")], "EL KIT-CAT CLUB")
    E["kk_catling"] = icono_texto("1f9d1-200d-1f373", "CHRISTOPHER *CATLING*", "«Kit», diminutivo de Christopher", "un pastelero con taberna", "izq", "sepia", False, "up", "bob")
    E["kk_empanadas"] = icono_texto("1f356", "SUS EMPANADAS: *«KIT-CATS»*", "de carne de cordero", "", "der", "calido", True, "pop", "bob", 380, (("1f411", 14, 80),))
    E["kk_rescata"] = flecha("1f381", "1f36b", "DE UNA CAJA DE BOMBONES *A LA CHOCOLATINA*", "Rowntree's rescató el nombre")
    E["kk_cordero"] = titular("GRACIAS A *UNAS EMPANADAS*", "de cordero", "", ("1f356", "1f411", "1f36b", "1f602"))
    E["kk_guerra"] = impacto("", "LA SEGUNDA *GUERRA MUNDIAL*", "", "1fa96")
    E["kk_racion"] = icono_texto("1f95b", "RACIONAMIENTO: *FALTA LECHE*", "", "", "izq", "dark", False, "pop", "")
    E["kk_negro"] = comparar("1f95b", "sin chocolate con leche", "1f36b", "chocolate negro", "→")
    E["kk_azul"] = f'''{F("dark", True)}{obj(barritas(400, 4, AZUL), 30, 50, "drop", "float", .2)}{txt(kt("EL KITKAT *AZUL*", "mega hueso", .7, .12, "slam"), 70, 44, 50)}{txt(kt("de rojo a azul, para avisar", "l naranja", 1.4), 70, 62, 50)}'''
    E["kk_rojo"] = comparar("1f535", "durante la guerra", "1f534", "vuelve la leche y el rojo", "→")
    E["kk_simple"] = titular("*KITKAT*", "desde entonces, simplemente", "", ("1f36b", "1f534", "2728", "1f44d"))
    E["kk_tele"] = icono_texto("1f4fa", "LLEGAN *LOS ANUNCIOS*", "televisión comercial en el Reino Unido", "años 50", "izq", "sepia", False, "pop", "bob")
    E["kk_break"] = bocadillos("1f60c", ["Have a break…", "…have a KitKat"], "tómate un descanso, tómate un KitKat")
    E["kk_pausa"] = comparar("1f477", "la idea original", "2615", "la pausa del trabajo", "=")
    E["kk_partir"] = f'''{F("", True)}{obj(barritas(200, 2, None), 34, 50, "left", "swing", .2)}{obj(barritas(200, 2, None), 58, 50, "right", "swing", .4)}{txt(kt("PARTIR = *PAUSA*", "mega", .9, .12, "slam"), 50, 82, 90)}'''
    E["kk_decadas"] = icono_texto("1f1ea-1f1f8", "DÉCADAS *EN MUCHOS PAÍSES*", "en España, muchos recuerdan «tómate un respiro»", "", "der", "", True, "pop", "bob")
    E["kk_codiciada"] = cifra("1988", "ROWNTREE'S, UNA EMPRESA MUY CODICIADA", "1f440")
    E["kk_oferta"] = comparar("1f1e8-1f1ed", "Nestlé", "1f1e8-1f1ed", "Jacobs Suchard", "VS", "DOS GIGANTES SUIZOS")
    E["kk_batalla"] = cifra("2.500 M£", "NESTLÉ GANA LA BATALLA", "1f3c6", "aproximadamente")
    E["kk_preocupa"] = icono_texto("1f61f", "EN YORK, *PREOCUPACIÓN*", "una empresa centenaria en manos extranjeras", "", "izq", "", False, "pop", "")
    E["kk_hershey"] = comparar("1f30d", "Nestlé, en casi todo el mundo", "1f1fa-1f1f8", "en EE. UU., lo fabrica Hershey's", "+")
    E["kk_japon2"] = impacto("el capítulo más sorprendente:", "JAPÓN", "", "1f1ef-1f1f5")
    E["kk_kitto"] = comparar("1f36b", "KitKat", "1f3c6", "«kitto katsu»: seguro que ganas", "≈")
    E["kk_examenes"] = icono_texto("1f4dd", "UN AMULETO *PARA LOS EXÁMENES*", "los estudiantes se lo regalan", "", "izq", "calido", True, "pop", "bob", 380, (("1f340", 86, 80),))
    E["kk_correo"] = icono_texto("1f4ee", "KITKAT *POR CORREO*", "con espacio para un mensaje de ánimo", "", "der", "", False, "pop", "bob")
    E["kk_sabores"] = lista([("1f375", "té verde"), ("1f7e2", "wasabi"), ("1f376", "sake"), ("1f360", "batata"), ("1f353", "fresa")], "MÁS DE 300 SABORES")
    E["kk_region"] = icono_texto("1f5fe", "SABORES *REGIONALES*", "como recuerdo de viaje", "", "izq", "", False, "pop", "bob")
    E["kk_lujo"] = icono_texto("1f9d1-200d-1f373", "KITKAT *DE LUJO*", "con un conocido chef pastelero japonés", "", "der", "calido", True, "pop", "bob")
    E["kk_movil"] = cifra("2013", "KITKAT, EN LOS TELÉFONOS MÓVILES", "1f4f1")
    E["kk_alfabeto"] = f'''{F()}{"".join(txt(kt(l, "mega gris", .2 + i * .2), 14 + i * 12, 40, 12) for i, l in enumerate("FGHIJ"))}{txt(kt("K", "mega rojo", 1.3, .1, "slam"), 74, 40, 12)}{txt(kt("versiones de Android con nombre de dulce, en orden alfabético", "l", 1.6), 50, 70, 90)}'''
    E["kk_android"] = comparar("1f916", "Android", "1f36b", "KitKat", "+", "UN ACUERDO CON NESTLÉ")
    E["kk_gratis"] = icono_texto("1f91d", "SIN DINERO *DE POR MEDIO*", "publicidad gratis para las dos marcas", "según contaron", "izq", "", False, "pop", "bob")
    E["kk_envoltorio"] = f'''{F("", True)}{obj(barritas(380, 4, VERDE), 30, 50, "drop", "float", .2)}{obj(spr("1f916", 150), 30, 22, "pop", "bob", .8)}{txt(kt("EL MUÑECO VERDE *EN EL ENVOLTORIO*", "xl", 1.0), 70, 46, 50)}'''
    E["kk_escandalo"] = impacto("2010:", "UN *ESCÁNDALO*", "y no por culpa del chocolate", "1f4a5")
    E["kk_greenpeace"] = icono_texto("1f9a7", "UN DEDO *DE ORANGUTÁN*", "el vídeo de Greenpeace que parodiaba sus anuncios", "", "izq", "dark", False, "pop", "")
    E["kk_palma"] = flecha("1f334", "1f3ed", "ACEITE DE PALMA *Y DEFORESTACIÓN*", "las selvas de Indonesia")
    E["kk_retirar"] = comparar("1f6ab", "intenta retirar el vídeo", "1f4e2", "y se difunde todavía más", "→")
    E["kk_compromiso"] = icono_texto("1f333", "REVISA *A SUS PROVEEDORES*", "sin aceite de palma ligado a la deforestación", "pocas semanas después", "der", "", True, "pop", "bob")
    E["kk_leccion_red"] = titular("ESCONDERLO = *QUE LO VEA TODO EL MUNDO*", "una lección para muchas marcas", "", ("1f310", "1f440", "1f4f1", "1f4a1"), "", True, "xl")
    E["kk_forma"] = f'''{F("", True)}{obj(barritas(400, 4, None), 30, 50, "zoom", "", .2)}{txt(kt("¿LA FORMA, *MARCA REGISTRADA*?", "xl", .9), 72, 42, 48)}{txt(kt("lo que quería Nestlé", "l", 1.5), 72, 58, 48)}'''
    E["kk_nadie"] = icono_texto("1f6ab", "NADIE MÁS *CON ESA FORMA*", "", "", "der", "", False, "pop", "")
    E["kk_cadbury"] = icono_texto("1f645", "CADBURY *SE OPONE*", "su gran rival en el Reino Unido", "", "izq", "", False, "pop", "swing")
    E["kk_legal"] = impacto("", "AÑOS DE *BATALLA LEGAL*", "", "2696-fe0f")
    E["kk_2017"] = cifra("2017", "EL TRIBUNAL DE APELACIÓN DA LA RAZÓN A CADBURY", "2696-fe0f")
    E["kk_ue"] = icono_texto("1f1ea-1f1fa", "EN LA UNIÓN EUROPEA, *TAMPOCO*", "", "", "der", "", False, "pop", "")
    E["kk_cualquiera"] = comparar("1f36b", "la forma: libre", "1f3f7-fe0f", "el nombre: solo KitKat", "+")
    E["leccion1"] = leccion(1, "las buenas ideas pueden venir", "*DE CUALQUIER PARTE*", "1f4ee")
    E["leccion2"] = leccion(2, "un buen eslogan conecta con", "*ALGO VERDADERO*", "2615")
    E["leccion3"] = leccion(3, "escucha a tu público", "*Y SÍGUELE EL JUEGO*", "1f1ef-1f1f5")
    E["kk_final"] = lista([("1f4ee", "un buzón"), ("1f3a9", "un club"), ("1f356", "empanadas"), ("1f535", "un envoltorio azul"), ("1f1ef-1f1f5", "un amuleto")], "")
    E["kk_partes"] = f'''{F("calido", True)}{obj(barritas(400), 30, 50, "drop", "float", .2)}{txt(kt("YA SABES *DE DÓNDE VIENE*", "xl", .9), 72, 46, 48)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:250px">{barritas(520)}</div>
      <div style="position:absolute;left:180px;top:60px">{vicon("postbox", 200)}</div>
      <div class="big" style="top:100px"><div class="s">NACIÓ EN UN</div><div class="q" style="font-size:170px;margin-top:22px">BUZÓN DE</div><div class="q" style="font-size:150px">SUGERENCIAS</div><div class="y">LA HISTORIA DE KITKAT</div></div>'''
