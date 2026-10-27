"""Escenas del vídeo 9 (Fanta). Motor común; sin logotipos ni simbología: botellas genéricas dibujadas."""
from base import *

CAP_ICONOS = {1: "1f3ed", 2: "1f34e", 3: "2696-fe0f", 4: "1f34a", 5: "1f4fa", 6: "1f9e0"}

def botella(color=NARANJA, px=170, etiqueta=""):
    return (f'<svg width="{px}" height="{px*2.4:.0f}" viewBox="0 0 70 168"><path d="M26,4 h18 v24 c0,10 16,16 16,34 v92 c0,6 -4,10 -10,10 h-30 c-6,0 -10,-4 -10,-10 v-92 c0,-18 16,-24 16,-34z" '
            f'fill="{color}" stroke="{TINTA}" stroke-width="3"/><rect x="24" y="0" width="22" height="10" rx="3" fill="#c9ced6"/>'
            f'<rect x="12" y="88" width="46" height="34" fill="{HUESO}"/><text x="35" y="111" font-family="Bebas" font-size="15" text-anchor="middle" fill="{TINTA}">{etiqueta}</text>'
            f'<circle cx="24" cy="140" r="3" fill="#fff" opacity=".6"/><circle cx="40" cy="70" r="2" fill="#fff" opacity=".6"/></svg>')

def escenas():
    E = {}
    E["f_naranja"] = f'''{F("", True)}{obj(botella(NARANJA, 190), 30, 50, "drop", "bob", .2)}{obj(spr("1f34a", 200), 52, 30, "pop", "spin-slow", .7)}{obj(spr("1fae7", 160), 50, 66, "pop", "float", 1.0)}
      {txt(kt("NARANJA, *BURBUJAS*", "xl", .6), 76, 44, 44)}{txt(kt("y un color inconfundible", "l", 1.3), 76, 60, 44)}'''
    E["f_mundo"] = icono_texto("1f30d", "EN CASI *TODO EL MUNDO*", "", "Fanta se bebe hoy", "izq", "", True, "zoom", "spin-slow", 360, (("1f34a", 86, 80),))
    E["f_incomodo"] = impacto("su origen es uno de los", "MÁS *INCÓMODOS*", "de la historia de las marcas", "1f62c")
    E["f_guerra"] = f'''{F("sepia")}{obj(spr("1f1e9-1f1ea", 200), 20, 34, "pop", "bob", .2)}{txt(kt("ALEMANIA", "mega", .5, .12, "slam"), 60, 36, 66)}{txt(kt("en plena Segunda Guerra Mundial", "xl", 1.2), 60, 56, 70)}<div class="viñeta"></div>'''
    E["f_sincoca"] = f'''{F("dark", True)}{obj(botella("#3a1d10", 190, "COLA"), 50, 44, "pop", "", .2)}{txt('<div class="equis" style="font-size:300px">✕</div>', 50, 44, 30, "center", .8, "pop")}
      {txt(kt("ALLÍ YA *NO SE PODÍA FABRICAR*", "xl hueso", 1.2), 50, 86, 90)}'''
    E["f_treinta"] = anio(1900, 1930, "Coca-Cola, negocio importante en Alemania", "1f1e9-1f1ea")
    E["f_embotella"] = f'''{F("sepia")}{"".join(obj(botella("#3a1d10", 100, "COLA"), 14 + i * 12, 50, "drop", "", .1 + i * .12) for i in range(7))}{txt(kt("SE EMBOTELLABA *CON ÉXITO*", "xl", 1.2), 50, 88, 90)}<div class="viñeta"></div>'''
    E["f_keith"] = icono_texto("1f468-200d-1f4bc", "MAX *KEITH*", "al frente de la filial alemana", "", "izq", "sepia", False, "up", "bob")
    E["f_embargo"] = icono_texto("26d4", "EL *EMBARGO*", "llegó la guerra, y con ella el corte del comercio", "", "der", "dark", True, "zoom", "pulse")
    E["f_jarabe"] = f'''{F()}{obj(spr("1f6a2", 230), 22, 44, "left", "bob", .2)}{obj(spr("1f1fa-1f1f8", 140), 22, 22, "pop", "", .5)}
      {txt('<div class="equis" style="font-size:240px">✕</div>', 48, 44, 20, "center", .9, "pop")}{obj(spr("1f3ed", 230), 74, 44, "right", "", .4)}
      {txt(kt("SIN JARABE, *SIN COCA-COLA*", "xl", 1.3), 50, 80, 90)}'''
    E["f_sinproducto"] = lista([("1f3ed", "fábricas"), ("1f477", "trabajadores"), ("1f69a", "camiones"), ("2753", "¿producto?")], "LO QUE TENÍA KEITH")
    E["f_inventar"] = icono_texto("1f9ea", "INVENTAR *UNO NUEVO*", "con lo que hubiera en Alemania", "", "izq", "", True, "spin", "swing")
    E["f_receta"] = f'''{F("calido")}{obj(spr("1f95b", 210), 20, 40, "drop", "bob", .2)}{txt(kt("suero de leche", "l", .6), 20, 64, 30)}{txt('<div class="vs" style="--d:.9s">+</div>', 40, 40, 10)}
      {obj(spr("1f34e", 210), 58, 40, "drop", "bob", 1.0)}{txt(kt("restos de manzana", "l", 1.3), 58, 64, 30)}{txt('<div class="vs" style="--d:1.6s">=</div>', 74, 40, 10)}{obj(botella("#e8b04a", 120), 88, 42, "zoom", "", 1.8)}'''
    E["f_restos"] = impacto("un refresco hecho con", "LOS RESTOS *DE LOS RESTOS*", "", "1f5d1-fe0f")
    E["f_fantasie"] = f'''{F("", True)}{obj(spr("1f4ad", 220), 22, 34, "pop", "float", .2)}{txt(kt("«USAD LA *IMAGINACIÓN*»", "xl", .5), 64, 34, 62)}
      {txt(kt("en alemán:", "l gris", 1.2), 64, 52, 62)}{txt(kt("*FANTASIE*", "mega", 1.6, .12, "slam"), 64, 68, 62)}'''
    E["f_knipp"] = f'''{F("calido", True)}{obj(spr("1f64b", 260), 24, 50, "up", "jump", .2)}{txt(kt("Joe Knipp, vendedor:", "l", .5), 64, 32, 60)}{txt(kt("«¡*FANTA*!»", "mega", 1.0, .12, "slam"), 64, 54, 60)}'''
    E["f_vende"] = icono_texto("1f4c8", "SE VENDIÓ *MUY BIEN*", "en una Alemania con escasez de casi todo", "principios de los años cuarenta", "izq", "sepia", False, "up", "bob")
    E["f_pregunta"] = impacto("la pregunta incómoda:", "¿UN REFRESCO *NAZI*?", "", "1f914")
    E["f_pendergrast"] = icono_texto("1f4d6", "SE NEGÓ A *AFILIARSE*", "a pesar de las presiones, según el historiador Mark Pendergrast", "Max Keith:", "der", "", False, "flip", "bob")
    E["f_regimen"] = icono_texto("1f3ed", "OPERABA *DENTRO DEL RÉGIMEN*", "y en actos de la empresa se exhibieron símbolos nazis", "pero su empresa…", "izq", "dark", False, "pop", "")
    E["f_debate"] = comparar("1f9d0", "¿empresario que sobrevivió?", "2696-fe0f", "¿colaborador del régimen?", "?", "LOS HISTORIADORES DEBATEN")
    E["f_contacto"] = flecha("1f1e9-1f1ea", "1f1fa-1f1f8", "FIN DE LA GUERRA: *VUELVE EL CONTACTO*", "con Coca-Cola en Estados Unidos")
    E["f_fabricas"] = icono_texto("1f3ed", "LAS FÁBRICAS *SEGUÍAN EN PIE*", "la compañía recupera su negocio en Alemania", "", "der", "", True, "rise", "")
    E["f_deja"] = f'''{F("dark", True)}{obj(botella("#e8b04a", 190, "FANTA"), 50, 44, "none", "fuera", .3)}{txt(kt("AQUELLA PRIMERA FANTA *DEJÓ DE FABRICARSE*", "xl hueso", .8), 50, 86, 90)}'''
    E["f_nomuere"] = titular("PERO LA MARCA *NO MURIÓ*", "", "", ("1f331", "2728", "1f34a", "1f504"))
    E["f_italia"] = f'''{F("calido", True)}{obj(spr("1f1ee-1f1f9", 180), 16, 24, "pop", "bob", .2)}{obj(spr("1f34a", 260), 28, 54, "zoom", "spin-slow", .5)}
      {txt(kt("1955: FANTA *DE NARANJA*", "xl", .8), 68, 42, 56)}{txt(kt("desarrollada en Italia", "l", 1.5), 68, 58, 56)}'''
    E["f_hoy"] = f'''{F("", True)}{"".join(obj(botella(NARANJA, 110, "FANTA"), 14 + i * 12, 46, "drop", "bob", .1 + i * .12) for i in range(7))}
      {txt(kt("UNA DE LAS *MÁS VENDIDAS* DE LA COMPAÑÍA", "xl", 1.2), 50, 86, 90)}'''
    E["f_titulares"] = icono_texto("1f4f0", "DE VUELTA A LOS *TITULARES*", "", "2015", "izq", "", True, "drop", "shake")
    E["f_aniversario"] = f'''{F("", True)}{obj(spr("1f382", 220), 22, 46, "pop", "bob", .2)}{txt(kt("75 ANIVERSARIO", "l gris", .4), 64, 28, 60)}
      {txt(kt("«LOS BUENOS *VIEJOS TIEMPOS*»", "xl", .8), 64, 46, 62)}{txt(kt("anuncio en Alemania", "l", 1.5), 64, 64, 60)}'''
    E["f_recordaron"] = impacto("muchos recordaron enseguida", "CUÁLES ERAN *ESOS TIEMPOS*", "", "1f633")
    E["f_retirado"] = f'''{F("dark", True)}{obj(spr("1f4fa", 280), 50, 40, "none", "fuera", .6)}{obj(spr("1f4e2", 200), 20, 30, "pop", "shake", .2)}{obj(spr("1f4ac", 180), 80, 30, "pop", "shake", .4)}
      {txt(kt("CRÍTICAS Y *ANUNCIO RETIRADO*", "xl hueso", 1.0), 50, 80, 90)}'''
    E["f_disculpas"] = icono_texto("1f64f", "LA COMPAÑÍA *PIDIÓ DISCULPAS*", "«solo queríamos evocar recuerdos de infancia»", "", "der", "", False, "pop", "bob")
    E["leccion1"] = leccion(1, "Fanta nació porque no había otra opción", "LA ESCASEZ *OBLIGA A INVENTAR*", "1f4a1")
    E["leccion2"] = leccion(2, "una marca puede sobrevivir a su origen", "Y *REINVENTARSE POR COMPLETO*", "1f504")
    E["leccion3"] = leccion(3, "la historia de una marca", "*NO SE PUEDE ESCONDER*", "1f50d")
    E["f_final"] = lista([("1f95b", "suero de leche"), ("1f34e", "restos de manzana"), ("1f1e9-1f1ea", "una guerra")], "EL ORIGEN DE LA LATA NARANJA")
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:70px;top:80px;transform:rotate(-8deg)">{botella("#e8b04a", 230, "?")}</div>
      <div style="position:absolute;left:300px;top:400px">{vicon("red-apple", 140)}</div><div style="position:absolute;left:300px;top:230px">{vicon("glass-of-milk", 140)}</div>
      <div class="big" style="top:100px"><div class="s">FANTA NACIÓ EN</div><div class="q" style="font-size:160px;margin-top:22px">LA ALEMANIA</div><div class="q" style="font-size:160px">DE LA GUERRA</div><div class="y">EL ORIGEN INCÓMODO</div></div>'''
