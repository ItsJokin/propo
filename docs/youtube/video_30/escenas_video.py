"""Escenas del vídeo 30 (Google, formato largo). Motor común; sin logotipos: caja de búsqueda y pantallas genéricas dibujadas."""
from base import *

CAP_ICONOS = {1: "1f393", 2: "1f517", 3: "1f9f1", 4: "1f522", 5: "1f6ab", 6: "1f4b5", 7: "1f3e0", 8: "1f4c4", 9: "1f4b0",
              10: "1f4e7", 11: "1f6d2", 12: "1f524", 13: "1f9e0"}

def caja(px=900, texto="", d=0.0):
    t = (f'<text x="110" y="78" font-family="Bebas" font-size="62" fill="{TINTA}">{texto}</text>' if texto else
         f'<rect x="110" y="40" width="6" height="52" fill="{TINTA}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>')
    return (f'<svg width="{px}" height="{px*0.15:.0f}" viewBox="0 0 900 135"><rect x="6" y="10" width="888" height="112" rx="56" fill="#fff" stroke="{TINTA}" stroke-width="6"/>'
            f'<circle cx="62" cy="62" r="20" fill="none" stroke="{GRIS}" stroke-width="7"/><path d="M76,76 L92,92" stroke="{GRIS}" stroke-width="8" stroke-linecap="round"/>{t}</svg>')

def ceros(n=100, d=0.0):
    return "".join(f'<span style="display:inline-block;animation:wPop .3s ease {d + i*0.012:.2f}s both">0</span>' for i in range(n))

def escenas():
    E = {}
    E["go_caja"] = f'''{F("", True)}{obj(caja(1000), 50, 46, "zoom", "", .2)}{txt(kt("MILES DE MILLONES DE VECES *AL DÍA*", "xl", 1.0), 50, 72, 90)}'''
    E["go_verbo"] = titular("*GOOGLEAR*", "buscar se convirtió en un verbo", "", ("1f50e", "1f4d6", "1f4ac", "1f4bb"))
    E["go_venta"] = impacto("quisieron venderla por menos de un millón…", "Y LES DIJERON *QUE NO*", "", "1f6ab")
    E["go_numero"] = comparar("1f522", "un número gigantesco", "270f-fe0f", "una errata (según se cuenta)", "+", "EL NOMBRE")
    E["go_cheque"] = icono_texto("1f4b5", "UN CHEQUE A UNA EMPRESA *QUE NO EXISTÍA*", "su primer inversor", "", "izq", "calido", True, "pop", "bob")
    E["go_historia"] = titular("LA HISTORIA DE *GOOGLE*", "", "", ("1f50e", "1f393", "1f3e0", "1f4b5"), "", True, "xl")
    E["go_stanford"] = f'''{F("sepia", True)}{obj(spr("1f3eb", 260), 26, 48, "drop", "bob", .2)}{txt(kt("STANFORD", "mega", .4, .12, "slam"), 66, 40, 60)}{txt(kt("California, 1995", "l", 1.2), 66, 58, 60)}<div class="viñeta"></div>'''
    E["go_brin"] = icono_texto("1f468-200d-1f393", "SERGEY *BRIN*", "nacido en Moscú; guía de los alumnos nuevos", "doctorando", "izq", "", False, "up", "bob", 380, (("1f1f7-1f1fa", 14, 82),))
    E["go_page"] = icono_texto("1f468-200d-1f4bb", "LARRY *PAGE*", "hijo de dos profesores de informática", "alumno nuevo", "der", "", False, "up", "bob")
    E["go_discuten"] = bocadillos("1f5ef-fe0f", ["¡No!", "¡Que sí!", "¿Seguro?", "…"], "según se cuenta, discutieron sobre casi todo")
    E["go_juntos"] = comparar("1f468-200d-1f393", "Brin", "1f468-200d-1f4bb", "Page", "+", "AL FINAL, JUNTOS")
    E["go_caos"] = icono_texto("1f300", "INTERNET *SIN CONTROL*", "encontrar algo útil era un pequeño infierno", "mediados de los 90", "izq", "", False, "spin", "spin-slow")
    E["go_contar"] = icono_texto("1f522", "¿CUÁNTAS VECES *SALE LA PALABRA*?", "así ordenaban los buscadores de entonces", "", "der", "", False, "pop", "bob")
    E["go_trampa"] = f'''{F()}{"".join(txt(kt("ZAPATILLAS", "l gris", .1 + i * .08), 20 + (i % 3) * 30, 18 + (i // 3) * 12, 30) for i in range(12))}{txt(kt("REPETIR Y *COLARSE ARRIBA*", "xl", 1.3), 50, 84, 90)}'''
    E["go_citas"] = icono_texto("1f4d1", "UN ARTÍCULO ES IMPORTANTE *SI LO CITAN MUCHO*", "la idea de Larry Page", "del mundo académico", "izq", "sepia", False, "pop", "bob")
    E["go_votos"] = f'''{F("", True)}{obj(spr("1f4c4", 240), 50, 50, "zoom", "glow", .2)}{"".join(obj(spr("1f5f3-fe0f", 120), x, y, "pop", "float", .5 + i * .2) for i, (x, y) in enumerate([(18, 24), (82, 24), (16, 76), (84, 76), (50, 16)]))}{txt(kt("CADA ENLACE, *UN VOTO*", "xl", 1.4), 50, 88, 90)}'''
    E["go_peso"] = comparar("1f3c6", "enlace de una página importante", "1f4a4", "enlace de una página que nadie visita", ">", "NO TODOS LOS VOTOS VALEN IGUAL")
    E["go_pagerank"] = titular("*PAGERANK*", "clasificación de páginas… y el apellido de Larry", "", ("1f4ca", "1f517", "1f60f", "1f4c4"))
    E["go_backrub"] = icono_texto("1f486", "SE LLAMABA *BACKRUB*", "«masaje en la espalda»", "su primer buscador", "izq", "calido", True, "pop", "bob")
    E["go_enlaces"] = flecha("1f517", "1f4c4", "LOS ENLACES *DE VUELTA*", "los que apuntan hacia una página")
    E["go_campus"] = icono_texto("1f50c", "DEJABA SIN INTERNET *A PARTE DEL CAMPUS*", "según se cuenta", "", "der", "", False, "pop", "swing")
    E["go_piezas"] = lista([("1f4bb", "ordenadores prestados"), ("1f4be", "discos sueltos"), ("1f527", "piezas como podían")], "SIN DINERO PARA EQUIPOS")
    E["go_lego"] = f'''{F("calido", True)}{obj(spr("1f9f1", 280), 30, 50, "drop", "bob", .2)}{txt(kt("UNA CAJA DE DISCOS *HECHA CON LEGO*", "xl", .8), 70, 42, 52)}{txt(kt("hoy, una pequeña reliquia", "l", 1.5), 70, 60, 52)}'''
    E["go_nombre"] = impacto("BackRub necesitaba", "UN NOMBRE *MEJOR*", "", "1f3f7-fe0f")
    E["go_googolplex"] = bocadillos("1f4a1", ["¿Googolplex?", "Mejor… googol"], "según el relato de un compañero de Stanford")
    E["go_googol"] = f'''{F("dark")}{txt(f'<div class="xl hueso" style="font-size:150px">1</div>', 50, 16, 20)}{txt(f'<div class="hueso" style="font-family:Bebas;font-size:58px;line-height:1;word-break:break-all;letter-spacing:6px">{ceros()}</div>', 50, 50, 88)}{txt(kt("UN GOOGOL: *UN UNO Y CIEN CEROS*", "xl hueso", 1.6), 50, 86, 90)}'''
    E["go_errata"] = f'''{F()}{obj(caja(900, "GOOGOL"), 50, 30, "left", "", .2)}{obj(caja(900, "GOOGLE"), 50, 58, "right", "", 1.2)}{txt(kt("SEGÚN ESE RELATO, *LO ESCRIBIERON MAL*", "xl", 1.8), 50, 84, 90)}'''
    E["go_dominio"] = fecha("15", "SEPTIEMBRE", "1997", "se registra el dominio", "1f310")
    E["go_errata2"] = titular("LA MARCA MÁS FAMOSA DE INTERNET… *¿UNA ERRATA?*", "si la historia es cierta", "", ("270f-fe0f", "1f50e", "1f914", "2728"), "", True, "xl")
    E["go_giro"] = impacto("y aquí llega", "EL GIRO *QUE POCOS CONOCEN*", "", "1f504")
    E["go_doctorado"] = icono_texto("1f393", "NO QUERÍAN *UNA EMPRESA*", "querían terminar sus doctorados", "", "izq", "", False, "pop", "bob")
    E["go_excite"] = flecha("1f50e", "1f3e2", "SE LO OFRECEN *A EXCITE*", "uno de los grandes portales de la época")
    E["go_millon"] = f'''{F("", True)}{txt(kt("1.000.000 $", "mega", .3, .12, "slam"), 50, 34, 90)}{obj(spr("1f645-200d-2642-fe0f", 230), 50, 68, "pop", "swing", 1.0)}{txt(kt("George Bell: *NO*", "xl", 1.4), 78, 68, 36)}'''
    E["go_750"] = f'''{F("dark", True)}{txt(kt("750.000 $", "mega naranja", .3, .12, "slam"), 50, 34, 90)}{txt(kt("REBAJADO… Y *OTRA VEZ NO*", "xl hueso", 1.2), 50, 60, 90)}{txt(kt("según se cuenta", "l gris dark", 1.8), 50, 76, 80)}'''
    E["go_hoy"] = comparar("1f4c8", "Google: cientos de miles de millones", "1f4c9", "Excite: casi desaparecida", "VS", "HOY")
    E["go_solos"] = impacto("como nadie la compraba", "SIGUEN *SOLOS*", "", "1f680")
    E["go_bechtolsheim"] = icono_texto("1f468-200d-1f4bc", "ANDY *BECHTOLSHEIM*", "cofundador de Sun Microsystems", "agosto de 1998", "izq", "", False, "up", "bob")
    E["go_talonario"] = f'''{F("calido", True)}<div class="pos" style="left:50%;top:44%;width:900px;height:330px;background:#f7f2e2;border:6px solid {TINTA};transform:translate(-50%,-50%) rotate(-3deg);box-shadow:12px 12px 0 rgba(0,0,0,.18)"></div>
      {txt(kt("PÁGUESE A: *GOOGLE INC.*", "xl", .5), 50, 36, 80)}{txt(kt("100.000 $", "mega rojo", 1.0, .12, "slam"), 50, 54, 80)}{txt(kt("tras una demostración rápida, según se cuenta", "l", 1.8), 50, 86, 90)}'''
    E["go_noexiste"] = lista([("1f6ab", "ni empresa"), ("1f3e6", "ni cuenta bancaria"), ("1f937", "¿dónde se ingresa?")], "GOOGLE INC. NO EXISTÍA")
    E["go_1998"] = fecha("4", "SEPTIEMBRE", "1998", "se registra oficialmente la empresa", "1f4dc")
    E["go_oficina"] = flecha("1f3eb", "1f3e2", "DEJAN LA UNIVERSIDAD", "y buscan una oficina")
    E["go_garaje"] = icono_texto("1f3e0", "UN GARAJE *EN MENLO PARK*", "California", "la oficina:", "izq", "sepia", True, "drop", "bob")
    E["go_wojcicki"] = icono_texto("1f469-200d-1f4bc", "SUSAN *WOJCICKI*", "se lo alquiló por unos 1.700 $ al mes, según se cuenta", "una amiga", "der", "", False, "up", "bob")
    E["go_empleado"] = lista([("1f4bb", "ordenadores"), ("1fa91", "unas mesas"), ("1f9d1-200d-1f4bb", "el primer empleado")], "EN EL GARAJE")
    E["go_susan_yt"] = flecha("1f3e0", "1f4fa", "DEL GARAJE… *A DIRIGIR YOUTUBE*", "Susan Wojcicki acabó trabajando en Google")
    E["go_paloalto"] = flecha("1f3e0", "1f3e2", "1999: *A PALO ALTO*", "ya no cabían en el garaje")
    E["go_portales"] = lista([("1f4f0", "noticias"), ("2648", "horóscopos"), ("26c5", "el tiempo"), ("1f4e2", "anuncios")], "LAS PORTADAS DE LA ÉPOCA")
    E["go_blanca"] = f'''{F()}<div class="pos" style="left:50%;top:48%;width:1300px;height:640px;background:#fff;border:6px solid {TINTA};border-radius:20px;box-shadow:14px 14px 0 rgba(0,0,0,.15)"></div>
      {obj(caja(800), 50, 46, "zoom", "", .5)}<div class="pos" style="left:42%;top:62%;width:180px;height:50px;background:#eee;border:3px solid {GRIS};border-radius:8px"></div><div class="pos" style="left:58%;top:62%;width:180px;height:50px;background:#eee;border:3px solid {GRIS};border-radius:8px"></div>
      {txt(kt("UNA CAJA *Y DOS BOTONES*", "xl", 1.2), 50, 24, 80)}'''
    E["go_diseno"] = icono_texto("1f3a8", "NO SABÍAN MUCHO *DE DISEÑO WEB*", "según se cuenta", "", "izq", "", False, "pop", "swing")
    E["go_boca"] = lista([("26a1", "cargaba rápido"), ("1f3af", "mejores resultados"), ("1f5e3-fe0f", "de boca en boca")], "Y FUNCIONÓ")
    E["go_doodle"] = f'''{F("calido", True)}{obj(spr("1f525", 220), 26, 48, "pop", "glow", .2)}{obj(spr("1f3dc-fe0f", 170), 14, 78, "pop", "float", .6)}{txt(kt("EL PRIMER *DOODLE*", "xl", .6), 66, 36, 56)}{txt(kt("verano de 1998: «nos hemos ido a Burning Man»", "l", 1.2), 66, 54, 56)}'''
    E["go_nadie"] = icono_texto("1f6aa", "NO HAY NADIE *EN LA OFICINA*", "si algo falla, ya sabes por qué", "", "der", "", False, "pop", "swing")
    E["go_sindinero"] = comparar("1f465", "millones de usuarios", "1f4b8", "pero sin ingresos", "≠")
    E["go_desconfian"] = icono_texto("1f928", "DESCONFIABAN *DE LA PUBLICIDAD*", "podía estropear los resultados", "", "izq", "", False, "pop", "swing")
    E["go_texto"] = cifra("2000", "ANUNCIOS DE TEXTO, PEQUEÑOS Y RELACIONADOS", "1f4dd", "la solución:")
    E["go_zapatillas"] = f'''{F()}{obj(caja(900, "ZAPATILLAS DE CORRER"), 50, 26, "zoom", "", .2)}{obj(spr("1f45f", 220), 30, 62, "pop", "bob", .9)}{txt(kt("ANUNCIOS *DE ZAPATILLAS*", "xl", 1.1), 66, 56, 50)}{txt(kt("no pancartas parpadeando", "l", 1.6), 66, 72, 50)}'''
    E["go_puja"] = comparar("1f4b0", "pujar por cada palabra", "1f5b1-fe0f", "pagar solo por clic", "+")
    E["go_maquina"] = titular("LA PUBLICIDAD: *SU MAYOR FUENTE DE INGRESOS*", "todavía hoy", "", ("1f4b0", "1f4c8", "1f4b5", "2699-fe0f"), "", True, "xl")
    E["go_gmail"] = fecha("1", "ABRIL", "2004", "Google anuncia Gmail", "1f4e7")
    E["go_giga"] = comparar("1f4e8", "la competencia: unos pocos megas", "1f4e7", "Gmail: 1 gigabyte", "VS")
    E["go_broma"] = impacto("mucha gente pensó que era una broma…", "*NO LO ERA*", "", "1f921")
    E["go_invitacion"] = icono_texto("1f39f-fe0f", "SOLO *CON INVITACIÓN*", "y las invitaciones se llegaron a vender", "", "izq", "", True, "pop", "bob")
    E["go_bolsa"] = cifra("85 $", "POR ACCIÓN, CON UNA SUBASTA POCO HABITUAL", "1f4c8", "agosto de 2004: sale a bolsa")
    E["go_valor"] = comparar("1f6ab", "750.000 $ (nadie la quiso)", "1f4b0", "más de 20.000 millones", "→")
    E["go_compra"] = impacto("con el dinero de la bolsa", "GOOGLE *EMPIEZA A COMPRAR*", "", "1f6d2")
    E["go_android"] = icono_texto("1f916", "2005: *ANDROID*", "un sistema operativo para móviles", "una pequeña empresa", "izq", "", False, "pop", "bob")
    E["go_movil"] = titular("EN LA *GRAN MAYORÍA* DE LOS MÓVILES", "pasó casi desapercibido", "", ("1f4f1", "1f916", "1f30d", "1f4c8"), "", True, "xl")
    E["go_youtube"] = cifra("1.650 M$", "2006: COMPRA YOUTUBE (EN ACCIONES)", "1f4fa", "muchos pensaron que era una locura")
    E["go_chrome"] = icono_texto("1f310", "2008: *CHROME*", "su navegador, acabaría siendo el más usado", "", "der", "", False, "spin", "spin-slow")
    E["go_servicios"] = lista([("1f5fa-fe0f", "mapas"), ("1f524", "traductor"), ("1f5bc-fe0f", "fotos"), ("1f4c4", "documentos")], "YA NO ERA SOLO UN BUSCADOR")
    E["go_alphabet"] = fecha("10", "AGOSTO", "2015", "nace Alphabet, la matriz", "1f524")
    E["go_pichai"] = icono_texto("1f468-200d-1f4bc", "SUNDAR *PICHAI*", "dirige Google, y después también Alphabet", "ingeniero nacido en la India", "izq", "", False, "up", "bob", 380, (("1f1ee-1f1f3", 14, 82),))
    E["go_apartan"] = comparar("1f468-200d-1f393", "Brin", "1f468-200d-1f4bb", "Page", "+", "SE APARTAN DEL DÍA A DÍA")
    E["go_diccionario"] = icono_texto("1f4d6", "GOOGLE, *EN EL DICCIONARIO*", "verbo: buscar algo en internet", "", "der", "sepia", True, "pop", "bob")
    E["go_sueno"] = titular("EL NOMBRE *ES LA ACCIÓN*", "el sueño de cualquier marca", "", ("1f50e", "2728", "1f3c6", "1f4ac"))
    E["leccion1"] = leccion(1, "las grandes ideas pueden venir", "DE *OTRO MUNDO*", "1f4d1")
    E["leccion2"] = leccion(2, "en una época abarrotada", "*LA SENCILLEZ* VENDE", "1f4c4")
    E["leccion3"] = leccion(3, "que rechacen tu idea", "*NO SIGNIFICA QUE NO VALGA*", "1f6ab")
    E["go_final"] = lista([("1f5ef-fe0f", "discusiones"), ("1f486", "un masaje"), ("1f522", "cien ceros"), ("1f4b5", "un cheque"), ("1f3e0", "un garaje")], "")
    E["go_caja2"] = f'''{F("", True)}{obj(caja(1000), 50, 40, "zoom", "", .2)}{txt(kt("YA SABES *DE DÓNDE VIENE*", "xl", .9), 50, 66, 90)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:520px">{caja(560, "GOOGOL")}</div>
      <div style="position:absolute;left:150px;top:180px">{vicon("magnifying-glass-tilted-left", 300)}</div>
      <div class="big" style="top:100px"><div class="s">NADIE LA QUISO POR</div><div class="q" style="font-size:180px;margin-top:22px">750.000 $</div><div class="y">LA HISTORIA DE GOOGLE</div></div>'''
