"""Escenas del vídeo 45 (Disney, formato largo). Motor común; sin personajes ni logotipos: ratones, conejos y castillos genéricos de Fluent Emoji."""
from base import *

CAP_ICONOS = {1: "1f4f0", 2: "1f4c9", 3: "1f430", 4: "1f494", 5: "1f682", 6: "1f6a2", 7: "1f34e", 8: "1f3c6",
              9: "270a", 10: "1f3a2", 11: "1f3f0", 12: "1f430", 13: "1f9e0"}

def pelicula(px=360):
    agujeros = "".join(f'<rect x="{12 + i*28}" y="8" width="14" height="10" rx="2" fill="#fff"/><rect x="{12 + i*28}" y="122" width="14" height="10" rx="2" fill="#fff"/>' for i in range(8))
    return (f'<svg width="{px}" height="{px*0.6:.0f}" viewBox="0 0 230 140"><rect x="0" y="0" width="230" height="140" fill="#222"/>{agujeros}'
            f'<rect x="12" y="28" width="62" height="84" fill="#e8e1cf"/><rect x="84" y="28" width="62" height="84" fill="#e8e1cf"/><rect x="156" y="28" width="62" height="84" fill="#e8e1cf"/></svg>')

def escenas():
    E = {}
    E["di_orejas"] = lista([("1f3f0", "un castillo"), ("1f4d6", "«érase una vez»"), ("2728", "magia")], "")
    E["di_imperio"] = lista([("1f3ac", "películas"), ("1f3a2", "parques"), ("1f9f8", "juguetes"), ("1f4fa", "series")], "UN IMPERIO DEL ENTRETENIMIENTO")
    E["di_ruina"] = icono_texto("1f4c9", "ARRUINADO *ANTES DE LOS 22*", "su fundador", "", "izq", "dark", False, "drop", "")
    E["di_conejo"] = comparar("1f430", "su primer éxito: un conejo", "1f6ab", "y se lo quitaron", "→")
    E["di_locura"] = icono_texto("1f92a", "«LA LOCURA *DE DISNEY*»", "su primera película larga", "", "der", "", True, "pop", "swing")
    E["di_historia"] = titular("LA HISTORIA DE *DISNEY*", "", "", ("1f42d", "1f430", "1f3f0", "1f3ac"), "", True, "xl")
    E["di_chicago"] = icono_texto("1f466", "WALTER ELIAS *DISNEY*", "nace en Chicago en 1901; crece en Misuri", "", "izq", "sepia", False, "up", "bob")
    E["di_periodicos"] = icono_texto("1f4f0", "REPARTIR PERIÓDICOS *DE MADRUGADA*", "con nieve o con calor", "", "der", "", False, "pop", "bob")
    E["di_dibujar"] = icono_texto("270f-fe0f", "DIBUJOS *DE LA GRANJA*", "que vendía a los vecinos, según sus biografías", "", "izq", "calido", False, "pop", "bob", 380, (("1f404", 86, 80),))
    E["di_ambulancia"] = icono_texto("1f691", "16 AÑOS: *AMBULANCIAS*", "mintió sobre su edad; llegó a Francia con la guerra ya terminada", "Cruz Roja", "der", "", False, "left", "")
    E["di_dibujo"] = impacto("de vuelta, decidido a", "DEDICARSE *AL DIBUJO*", "", "270f-fe0f")
    E["di_iwerks"] = comparar("1f466", "Walt", "1f468-200d-1f3a8", "Ub Iwerks", "+", "KANSAS CITY")
    E["di_laughogram"] = icono_texto("1f3ac", "LAUGH-O-GRAM", "cortos basados en cuentos clásicos", "su primer estudio", "izq", "sepia", False, "pop", "bob")
    E["di_judias"] = icono_texto("1f96b", "DORMIR EN EL ESTUDIO, *JUDÍAS DE LATA*", "según se cuenta", "", "der", "", False, "pop", "swing")
    E["di_quiebra"] = cifra("1923", "EL ESTUDIO QUIEBRA", "1f4c9")
    E["di_hollywood"] = flecha("1f9f3", "1f3ac", "21 AÑOS: *A HOLLYWOOD*", "con muy poco dinero, según la historia más repetida")
    E["di_roy"] = comparar("1f466", "Walt: las ideas", "1f468-200d-1f4bc", "Roy, su hermano: el dinero", "+", "CALIFORNIA")
    E["di_oswald"] = f'''{F("calido", True)}{obj(spr("1f430", 280), 28, 50, "pop", "bob", .2)}{obj(spr("1f340", 120), 40, 28, "pop", "float", .8)}{txt(kt("1927: OSWALD, *EL CONEJO AFORTUNADO*", "xl", .8), 70, 46, 52)}'''
    E["di_mintz"] = comparar("1f3ac", "Universal Pictures", "1f468-200d-1f4bc", "el productor Charles Mintz", "+", "LA DISTRIBUCIÓN")
    E["di_nuevayork"] = flecha("1f3ac", "1f5fd", "1928: A NUEVA YORK", "a pedir más dinero por cada corto")
    E["di_noticia"] = impacto("y allí recibió", "LA PEOR NOTICIA *DE SU CARRERA*", "", "1f4e8")
    E["di_menos"] = bocadillos("1f468-200d-1f4bc", ["¿Más dinero?", "No: menos"], "Charles Mintz")
    E["di_secreto"] = f'''{F("dark")}{"".join(obj(spr("1f468-200d-1f3a8", 120), 14 + i * 13, 50, "right", "", .2 + i * .15) for i in range(6))}{txt(kt("SUS DIBUJANTES, *CONTRATADOS EN SECRETO*", "xl hueso", 1.2), 50, 82, 90)}'''
    E["di_derechos"] = icono_texto("1f4dc", "OSWALD *NO ERA SUYO*", "según el contrato, era de Universal", "", "izq", "", False, "pop", "")
    E["di_dilema"] = comparar("1f4b8", "aceptar menos dinero", "1f6ab", "o quedarse sin nada", "VS")
    E["di_pierde"] = icono_texto("1f494", "LO PIERDE *CASI TODO*", "solo Ub Iwerks se queda con él", "", "der", "dark", False, "pop", "")
    E["di_dueno"] = titular("SER DUEÑO *DE TODO LO QUE CREES*", "una lección que nunca olvidó", "", ("1f4dc", "1f512", "270f-fe0f", "1f9e0"), "", True, "xl")
    E["di_tren"] = f'''{F("", True)}<div class="carrera" style="--d:.2s">{spr("1f682", 300)}</div>{txt(kt("EL LARGO VIAJE *EN TREN*", "xl", .8), 50, 22, 90)}{txt(kt("según contaba el propio Walt", "l", 1.4), 50, 36, 90)}'''
    E["di_raton"] = impacto("", "UN *RATÓN*", "", "1f42d")
    E["di_mortimer"] = f'''{F()}{txt('<div class="mega" style="text-decoration:line-through;color:#8A8F98">MORTIMER</div>', 30, 42, 40, "center", .2, "pop")}{txt('<div class="vs" style="--d:.8s">→</div>', 52, 42, 10)}{txt(kt("MICKEY", "mega rojo", 1.1, .12, "slam"), 74, 42, 40)}{txt(kt("«demasiado pomposo», según la versión más extendida, dijo Lillian", "l", 1.7), 50, 66, 90)}'''
    E["di_circulos"] = icono_texto("270f-fe0f", "UB IWERKS *LO DIBUJA*", "con formas sencillas, fácil y rápido de animar", "de vuelta en el estudio", "izq", "", False, "pop", "bob", 380, (("1f42d", 86, 80),))
    E["di_especial"] = impacto("faltaba algo", "QUE LO HICIERA *ESPECIAL*", "", "2728")
    E["di_sonoro"] = cifra("1927", "LA PRIMERA GRAN PELÍCULA SONORA: SE ACABA EL CINE MUDO", "1f50a")
    E["di_sincronizado"] = comparar("1f3ac", "la imagen", "1f3b5", "el sonido", "=", "PERFECTAMENTE SINCRONIZADOS")
    E["di_steamboat"] = fecha("18", "NOVIEMBRE", "1928", "Steamboat Willie: al timón de un barco de vapor", "1f6a2")
    E["di_publico"] = icono_texto("1f632", "NADA *ASÍ*", "los dibujos al ritmo de la música", "el público nunca había visto", "der", "", True, "pop", "bob")
    E["di_voz"] = icono_texto("1f399-fe0f", "LA VOZ: *EL PROPIO WALT*", "durante casi veinte años", "", "izq", "", False, "pop", "bob")
    E["di_cumple"] = icono_texto("1f382", "SU *CUMPLEAÑOS*", "así celebra Disney esa fecha", "", "der", "calido", True, "pop", "bob")
    E["di_largo"] = comparar("1f42d", "un fenómeno", "1f39e-fe0f", "¿una película larga?", "→")
    E["di_burla"] = titular("«LA *LOCURA* DE DISNEY»", "así lo llamaban en Hollywood", "", ("1f92a", "1f3ac", "1f602", "1f4b8"))
    E["di_hora"] = bocadillos("1f9d0", ["¿Hora y media…", "…de dibujos animados?"], "nadie aguantaría, decían")
    E["di_hipoteca"] = cifra("~1,5 M$", "UNA FORTUNA · SEGÚN SE CUENTA, HIPOTECA SU CASA", "1f3e0")
    E["di_banqueros"] = icono_texto("1f3e6", "LA PELÍCULA SIN TERMINAR, *A LOS BANQUEROS*", "para conseguir el último préstamo", "", "izq", "", False, "pop", "bob")
    E["di_1937"] = fecha("21", "DICIEMBRE", "1937", "se estrena Blancanieves y los siete enanitos", "1f34e")
    E["di_triunfo"] = impacto("", "UN TRIUNFO *ABSOLUTO*", "", "1f3c6")
    E["di_lloran"] = icono_texto("1f622", "LÁGRIMAS *EN EL ESTRENO*", "estrellas de Hollywood incluidas, según se cuenta", "", "der", "", False, "pop", "bob")
    E["di_taquilla"] = cifra("TAQUILLA", "DE LAS MÁS TAQUILLERAS DE SU ÉPOCA", "1f39f-fe0f")
    E["di_oscar"] = f'''{F("calido", True)}{obj(spr("1f3c6", 260), 22, 48, "pop", "glow", .2)}{"".join(obj(spr("1f3c6", 90), 42 + i * 7, 62, "pop", "bob", .8 + i * .15) for i in range(7))}{txt(kt("UN ÓSCAR *Y SIETE PEQUEÑITOS*", "xl", 1.0), 66, 30, 60)}'''
    E["di_burbank"] = icono_texto("1f3ed", "NUEVOS ESTUDIOS *EN BURBANK*", "con el dinero de Blancanieves", "", "izq", "", True, "pop", "bob")
    E["di_duro"] = impacto("pero el éxito", "NO DURÓ *MUCHO*", "", "1f4c9")
    E["di_pinocho"] = comparar("1f3ac", "hoy, clásicos", "1f4b8", "entonces, perdieron dinero", "VS", "1940")
    E["di_guerra"] = comparar("1f30d", "el mercado europeo, cerrado", "1f4b0", "películas carísimas", "+", "LA SEGUNDA GUERRA MUNDIAL")
    E["di_huelga"] = icono_texto("270a", "1941: *HUELGA DE ANIMADORES*", "mejores sueldos y condiciones; Walt se sintió traicionado", "", "der", "dark", False, "pop", "")
    E["di_propaganda"] = icono_texto("1f1fa-1f1f8", "PELÍCULAS *PARA EL GOBIERNO*", "entrenamiento y propaganda", "durante la guerra", "izq", "", False, "pop", "bob")
    E["di_cenicienta"] = cifra("1950", "EL SIGUIENTE GRAN ÉXITO: LA CENICIENTA", "1f460")
    E["di_parque"] = icono_texto("1f3a2", "UN PARQUE *PARA PADRES E HIJOS*", "el otro sueño de Walt", "", "der", "calido", True, "pop", "bob")
    E["di_1955"] = fecha("17", "JULIO", "1955", "abre Disneyland en Anaheim, California", "1f3f0")
    E["di_desastre"] = impacto("la inauguración fue", "UN *DESASTRE*", "", "1f4a5")
    E["di_tacones"] = lista([("1f465", "demasiada gente"), ("1f39f-fe0f", "entradas falsas"), ("1f975", "un calor terrible"), ("1f460", "tacones en el asfalto")], "SEGÚN LAS CRÓNICAS")
    E["di_negro"] = titular("«EL *DOMINGO NEGRO*»", "sin agua, sin comida, atracciones rotas", "así lo llamaron los empleados", ("1f6b1", "1f354", "1f527", "1f4a5"), "dark", True, "xl")
    E["di_exito"] = icono_texto("1f3c6", "EN POCOS MESES, *UN ÉXITO ENORME*", "Walt fue corrigiendo los problemas", "", "izq", "", True, "pop", "bob")
    E["di_muere"] = cifra("1966", "MUERE WALT DISNEY · FLORIDA ABRIRÍA EN 1971", "1f56f-fe0f")
    E["di_parques"] = lista([("1f1ef-1f1f5", "Tokio"), ("1f1eb-1f1f7", "París"), ("1f1ed-1f1f0", "Hong Kong"), ("1f1e8-1f1f3", "Shanghái")], "MÁS PARQUES")
    E["di_comprar"] = impacto("en las últimas décadas", "COMPRAR *LAS GRANDES HISTORIAS*", "", "1f6d2")
    E["di_compras"] = lista([("1f9f8", "Pixar"), ("1f9b8", "Marvel"), ("1f30c", "Lucasfilm"), ("1f4fa", "buena parte de Fox")], "")
    E["di_streaming"] = cifra("2019", "SU PROPIA PLATAFORMA DE STREAMING", "1f4fa")
    E["di_final_peli"] = impacto("y un final", "DE *PELÍCULA*", "", "1f3ac")
    E["di_2006"] = f'''{F("calido", True)}{obj(spr("1f430", 280), 28, 50, "pop", "bob", .2)}{obj(spr("1f3e0", 140), 40, 28, "pop", "float", .8)}{txt(kt("2006: *EL CONEJO VUELVE*", "xl", .8), 70, 42, 52)}{txt(kt("casi 80 años después", "l", 1.4), 70, 58, 52)}'''
    E["di_intercambio"] = comparar("1f399-fe0f", "un comentarista deportivo", "1f430", "los derechos del conejo", "↔", "UN INTERCAMBIO MUY CURIOSO")
    E["di_periodista"] = titular("UN PERIODISTA *POR UN CONEJO*", "", "", ("1f399-fe0f", "1f430", "1f91d", "1f602"))
    E["di_dominio"] = icono_texto("1f513", "2024: *DOMINIO PÚBLICO*", "la versión de Steamboat Willie, en EE. UU.; la marca sigue protegida", "", "izq", "", False, "pop", "bob")
    E["leccion1"] = leccion(1, "lee", "*LA LETRA PEQUEÑA*", "1f4dc")
    E["leccion2"] = leccion(2, "una ruina", "*NO ES EL FINAL*", "1f4c9")
    E["leccion3"] = leccion(3, "una «locura»…", "*PUEDE SER BLANCANIEVES*", "1f34e")
    E["di_final"] = lista([("1f4f0", "periódicos"), ("1f4c9", "una quiebra"), ("1f430", "un conejo"), ("1f682", "un tren"), ("1f34e", "una princesa")], "")
    E["di_conejo2"] = f'''{F("calido", True)}{obj(spr("1f430", 300), 30, 50, "drop", "float", .2)}{txt(kt("ACUÉRDATE *DEL CONEJO*", "xl", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:70px;top:130px">{vicon("rabbit-face", 300)}</div>
      <div style="position:absolute;left:300px;top:380px">{vicon("mouse-face", 220)}</div>
      <div class="big" style="top:100px"><div class="s">PERDIÓ A SU CONEJO</div><div class="q" style="font-size:150px;margin-top:22px">Y CREÓ</div><div class="q" style="font-size:150px">UN RATÓN</div><div class="y">LA HISTORIA DE DISNEY</div></div>'''
