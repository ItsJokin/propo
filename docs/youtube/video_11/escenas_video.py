"""Escenas del vídeo 11 (IKEA). Motor común; sin logotipos: cajas planas y muebles genéricos."""
from base import *

CAP_ICONOS = {1: "1f9d2", 2: "1f697", 3: "1fa9b", 4: "1f3f7-fe0f", 5: "1f6cb-fe0f", 6: "1f9e0"}

def caja(px=320, texto="", d=0.0):
    return (f'<svg width="{px}" height="{px*0.62:.0f}" viewBox="0 0 260 160"><path d="M10,50 L130,10 L250,50 L130,90Z" fill="#e2c391" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M10,50 L10,90 L130,150 L130,90Z" fill="#c9a36b" stroke="{TINTA}" stroke-width="4"/><path d="M250,50 L250,90 L130,150 L130,90Z" fill="#b48c54" stroke="{TINTA}" stroke-width="4"/>'
            f'<text x="190" y="112" font-family="Bebas" font-size="22" fill="{TINTA}" text-anchor="middle" transform="rotate(-18 190 112)">{texto}</text></svg>')

def etiqueta(nombre, sub="", color="#FFD23F"):
    return (f'<div style="background:{color};border:5px solid {TINTA};border-radius:10px;padding:8px 26px;font-family:Bebas;font-size:84px;color:{TINTA};'
            f'box-shadow:8px 8px 0 rgba(0,0,0,.18);text-align:center;line-height:1">{nombre}<div style="font-family:IBM Plex Sans,sans-serif;font-size:26px">{sub}</div></div>')

def escenas():
    E = {}
    E["i_nombres"] = f'''{F("", True)}{"".join(obj(etiqueta(n), x, y, "pop", "bob", .2 + i * .35) for i, (n, x, y) in enumerate([("BILLY", 26, 32), ("KALLAX", 72, 30), ("MALM", 28, 66), ("POÄNG", 72, 68)]))}'''
    E["i_casa"] = f'''{F()}{obj(spr("1f6cb-fe0f", 230), 22, 44, "drop", "bob", .2)}{obj(spr("1f4da", 200), 44, 40, "drop", "bob", .5)}{obj(spr("1f6cf-fe0f", 220), 66, 44, "drop", "bob", .8)}{obj(spr("1fa91", 180), 86, 42, "drop", "bob", 1.1)}
      {txt(kt("SEGURO QUE TIENES *ALGUNO*", "xl", 1.3), 50, 78, 90)}'''
    E["i_famosa"] = titular("LA MÁS *FAMOSA*", "marca de muebles del mundo", "", ("1f6cb-fe0f", "1f30d", "1f4e6", "2b50"))
    E["i_preguntas"] = f'''{F("", True)}{obj(spr("1f3f7-fe0f", 210), 24, 34, "pop", "swing", .2)}{txt(kt("¿DE DÓNDE SALEN *LOS NOMBRES*?", "xl", .4), 64, 34, 60)}
      {obj(caja(260), 24, 70, "pop", "bob", 1.2)}{txt(kt("¿POR QUÉ TODO *EN CAJA PLANA*?", "xl", 1.4), 64, 70, 60)}'''
    E["i_historia"] = impacto("las dos respuestas tienen", "UNA *HISTORIA*", "", "1f4d6")
    E["i_suecia"] = anio(1900, 1943, "Suecia", "1f1f8-1f1ea")
    E["i_ingvar"] = icono_texto("1f466", "INGVAR *KAMPRAD*", "funda su propia empresa", "17 años", "izq", "", True, "up", "bob")
    E["i_cerillas"] = f'''{F("sepia")}{obj(spr("1f525", 200), 20, 40, "pop", "pulse", .2)}{obj(spr("1f4e6", 180), 20, 68, "drop", "", .5)}
      {txt(kt("CERILLAS AL POR MAYOR", "xl", .6), 64, 34, 62)}{txt(kt("revendidas a los vecinos, *con margen*", "l", 1.3), 64, 52, 62)}{txt(kt("según su propia historia", "m gris", 1.9), 64, 66, 62)}<div class="viñeta"></div>'''
    E["i_siglas"] = icono_texto("1f520", "SUS INICIALES *Y SU ORIGEN*", "", "el nombre:", "der", "", True, "pop", "bob", 320)
    E["i_letras"] = f'''{F("", True)}{"".join(txt(f'<div class="mega rojo">{l}</div>', 14 + i * 24, 34, 20, "center", .2 + i * .5, "flip") + txt(kt(s, "l", .5 + i * .5), 14 + i * 24, 58, 22) for i, (l, s) in enumerate([("I", "Ingvar"), ("K", "Kamprad"), ("E", "Elmtaryd (granja)"), ("A", "Agunnaryd (pueblo)")]))}'''
    E["i_detodo"] = lista([("1f58a-fe0f", "bolígrafos"), ("1f45b", "carteras"), ("1f5bc-fe0f", "marcos"), ("1fa91", "y luego muebles")], "AL PRINCIPIO, DE TODO")
    E["i_problema"] = impacto("la idea más famosa nació de", "UN PROBLEMA *DE ESPACIO*", "", "1f4cf")
    E["i_lundgren"] = icono_texto("1f468-200d-1f3a8", "GILLIS *LUNDGREN*", "una mesa para las fotos del catálogo", "1956, según la empresa:", "izq", "", True, "pop", "bob", 340, (("1f4f8", 86, 80),))
    E["i_coche"] = f'''{F()}{obj(spr("1f697", 320), 34, 54, "left", "", .2)}{obj(spr("1fa91", 200), 34, 26, "drop", "shake", .8)}{txt(kt("NO *CABÍA*", "mega", 1.2, .12, "slam"), 74, 46, 44)}'''
    E["i_patas"] = f'''{F("", True)}{obj(spr("1fa9a", 230), 28, 46, "spin", "swing", .2)}{txt(kt("ASÍ QUE…", "l gris", .5), 66, 32, 56)}{txt(kt("LE QUITÓ *LAS PATAS*", "xl", .9), 66, 50, 56)}'''
    E["i_plano"] = f'''{F("calido", True)}{obj(caja(400, "MESA"), 32, 52, "drop", "bob", .2)}{txt(kt("DESMONTADO", "xl", .7), 74, 38, 48)}{txt(kt("ocupa *mucho menos*", "xl", 1.3), 74, 54, 48)}'''
    E["i_ahorro"] = f'''{F()}{obj(spr("1f3ed", 190), 16, 42, "pop", "bob", .2)}{obj(spr("1f69a", 190), 38, 42, "pop", "bob", .5)}{obj(spr("1f697", 190), 60, 42, "pop", "bob", .8)}{obj(spr("1f4b6", 190), 84, 42, "zoom", "pulse", 1.3)}
      {txt(kt("menos espacio = *precios más bajos*", "xl", 1.5), 50, 78, 90)}'''
    E["i_sistema"] = icono_texto("1f504", "NO LO INVENTÓ: *LO CONVIRTIÓ EN SISTEMA*", "", "", "der", "", True, "spin", "spin-slow")
    E["i_cliente"] = impacto("otra idea revolucionaria:", "EL CLIENTE *TRABAJA*", "", "1f9d1-200d-1f527")
    E["i_tu"] = lista([("1f6d2", "tú la recoges"), ("1f697", "tú la llevas"), ("1fa9b", "tú lo montas")], "")
    E["i_coste"] = icono_texto("1f4b0", "UN COSTE *QUE SE AHORRA*", "y que no tiene que cobrarte", "", "izq", "", True, "pop", "bob")
    E["i_efecto"] = titular("EL *«EFECTO IKEA»*", "así lo llaman los investigadores", "", ("1f9e0", "1f52c", "2764-fe0f", "1fa9b"))
    E["i_manos"] = icono_texto("1f64c", "VALORAMOS MÁS *LO QUE MONTAMOS*", "con nuestras propias manos", "", "der", "calido", True, "up", "bob", 360, (("2764-fe0f", 14, 22),))
    E["i_ynombres"] = impacto("", "¿Y LOS *NOMBRES*?", "", "1f3f7-fe0f")
    E["i_dislexia"] = f'''{F()}{obj(spr("1f9e0", 220), 22, 44, "pop", "bob", .2)}{txt(kt("KAMPRAD ERA *DISLÉXICO*", "xl", .5), 64, 32, 60)}
      {txt('<div class="mono" style="font-size:64px;letter-spacing:6px">10049381 · 20256713</div>', 64, 52, 60, "center", 1.2, "pop")}{txt(kt("le costaba recordar los códigos", "l", 1.6), 64, 68, 60)}'''
    E["i_palabras"] = f'''{F("", True)}{obj(spr("1f4a1", 220), 20, 44, "pop", "glow", .2)}{txt(kt("NOMBRES QUE PUDIERA *RECORDAR*", "xl", .6), 62, 36, 62)}{obj(etiqueta("NOMBRE"), 62, 62, "pop", "bob", 1.2)}'''
    E["i_sistema_nombres"] = titular("UN *SISTEMA*", "con el tiempo", "", ("1f5fa-fe0f", "1f3f7-fe0f", "1f4da", "2728"))
    E["i_mapa"] = f'''{F()}{obj(spr("1f6cb-fe0f", 180), 20, 34, "pop", "bob", .2)}{obj(spr("1f1f8-1f1ea", 110), 32, 24, "pop", "", .5)}{txt(kt("sofás: lugares de Suecia", "l", .6), 20, 56, 30)}
      {obj(spr("1f6cf-fe0f", 180), 50, 34, "pop", "bob", 1.0)}{obj(spr("1f1f3-1f1f4", 110), 62, 24, "pop", "", 1.3)}{txt(kt("camas: lugares de Noruega", "l", 1.4), 50, 56, 30)}
      {obj(spr("1f9f6", 180), 80, 34, "pop", "bob", 1.8)}{obj(spr("1f1e9-1f1f0", 110), 92, 24, "pop", "", 2.1)}{txt(kt("alfombras: lugares de Dinamarca", "l", 2.2), 80, 56, 30)}'''
    E["i_clave"] = icono_texto("1f5fa-fe0f", "NO ES UNA CLAVE: *ES UN MAPA*", "muchas veces", "", "izq", "", True, "flip", "float")
    E["i_almhult"] = anio(1900, 1958, "primera tienda: Älmhult, Suecia", "1f3ec")
    E["i_recorrido"] = f'''{F()}<svg class="pos" style="left:50%;top:46%" width="1500" height="600" viewBox="0 0 1500 600"><path class="draw" style="--d:.2s;--len:3400" d="M60,540 L60,80 L420,80 L420,520 L780,520 L780,80 L1140,80 L1140,520 L1440,520" fill="none" stroke="{NARANJA}" stroke-width="18" stroke-dasharray="40 22" stroke-linecap="round"/></svg>
      {obj(spr("1f463", 150), 6, 88, "pop", "", .2)}{obj(spr("1f6aa", 150), 96, 88, "pop", "", 2.4)}{txt(kt("UN RECORRIDO POR *TODAS LAS SECCIONES*", "xl", 1.0), 46, 12, 80)}'''
    E["i_montados"] = lista([("1f6cb-fe0f", "salones"), ("1f373", "cocinas"), ("1f6cf-fe0f", "dormitorios")], "YA MONTADOS, PARA IMAGINARLO EN CASA")
    E["i_restaurante"] = icono_texto("1f37d-fe0f", "A MITAD: *UN RESTAURANTE*", "para que no te vayas por hambre", "", "der", "calido", True, "pop", "bob")
    E["i_kamprad"] = icono_texto("1f474", "KAMPRAD MURIÓ *EN 2018*", "a los 91 años", "", "izq", "sepia", False, "up", "float")
    E["leccion1"] = leccion(1, "una mesa que no cabe en un coche", "PUEDE ESCONDER *UNA GRAN IDEA*", "1f697")
    E["leccion2"] = leccion(2, "si el cliente hace parte del trabajo", "PRECIOS QUE *NADIE MÁS PUEDE*", "1f4b6")
    E["leccion3"] = leccion(3, "una dificultad personal", "PUEDE SER *UNA SEÑA DE IDENTIDAD*", "2b50")
    E["i_final"] = f'''{F("", True)}{obj(caja(360), 28, 50, "drop", "bob", .2)}{obj(spr("1f529", 160), 48, 30, "pop", "jump", 1.0)}
      {txt(kt("¿TE SOBRA *UN TORNILLO*?", "xl", .8), 72, 40, 50)}{txt(kt("todo empezó con una mesa que no cabía", "l", 1.5), 72, 58, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:120px;transform:rotate(-6deg)">{etiqueta("BILLY")}</div>
      <div style="position:absolute;left:150px;top:280px;transform:rotate(5deg)">{etiqueta("MALM")}</div>
      <div style="position:absolute;left:60px;top:440px">{vicon("world-map", 190)}</div>
      <div class="big" style="top:100px"><div class="s">LOS NOMBRES DE IKEA</div><div class="q" style="font-size:180px;margin-top:22px">TIENEN</div><div class="q" style="font-size:180px">TRUCO</div><div class="y">Y LA CAJA PLANA</div></div>'''
