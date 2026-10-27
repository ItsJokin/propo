"""Escenas del vídeo 2 (New Coke). Usa el motor común (motor/base.py). Sin logotipos: latas genéricas dibujadas."""
from base import *

CAP_ICONOS = {1: "1f964", 2: "1f9ea", 3: "1f621", 4: "1f4fa", 5: "1f914", 6: "1f9e0"}

def lata(color=ROJO, etiqueta="COLA", px=260, cls=""):
    return (f'<svg class="{cls}" width="{px}" height="{px*1.75:.0f}" viewBox="0 0 100 175"><defs><linearGradient id="b{color[1:]}" x1="0" x2="1">'
            f'<stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".35" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>'
            f'<rect x="8" y="14" width="84" height="150" rx="14" fill="{color}"/><rect x="8" y="14" width="84" height="150" rx="14" fill="url(#b{color[1:]})"/>'
            f'<rect x="12" y="4" width="76" height="16" rx="6" fill="#c9ced6"/><rect x="12" y="158" width="76" height="12" rx="6" fill="#aeb4bd"/>'
            f'<text x="50" y="98" font-family="Bebas" font-size="30" fill="white" text-anchor="middle" transform="rotate(-90 50 90)">{etiqueta}</text></svg>')

def vaso(color, px=220):
    return (f'<svg width="{px}" height="{px*1.2:.0f}" viewBox="0 0 100 120"><path d="M15,10 L85,10 L76,112 L24,112Z" fill="#ffffff" fill-opacity=".55" stroke="#151515" stroke-width="3"/>'
            f'<path d="M19,40 L81,40 L76,108 L24,108Z" fill="{color}"/><circle cx="40" cy="70" r="3" fill="#fff" opacity=".6"/><circle cx="58" cy="84" r="2" fill="#fff" opacity=".6"/></svg>')

def escenas():
    E = {}
    E["n_fecha"] = fecha("23", "ABRIL", "1985", "Coca-Cola anuncia un cambio histórico", "1f4c5")
    E["n_formula"] = f'''{F("", True)}{obj(lata(ROJO, "CLÁSICA", 230), 30, 50, "pop", "float")}
      <svg class="pos" style="left:50%;top:50%" width="300" height="120" viewBox="0 0 300 120"><path class="draw" style="--d:.5s;--len:340" d="M10,60 L260,60 M220,20 L280,60 L220,100" fill="none" stroke="#D7263D" stroke-width="12"/></svg>
      {obj(lata("#b3122a", "NUEVA", 230), 70, 50, "zoom", "float", .9)}{txt(kt("CAMBIÓ SU *FÓRMULA*", "xl", 1.2), 50, 90, 90)}'''
    E["n_99"] = cifra("99 AÑOS", "sin tocar la receta", "1f4dc", "la primera vez en")
    E["n_79dias"] = f'''{F("dark", True)}{txt(odometro(10, 79, .1, 1.8, "mega naranja"), 50, 38, 40)}
      {txt(kt("DÍAS DESPUÉS…", "xl hueso", 1.2), 50, 60, 80)}{txt(kt("marcha atrás", "l naranja", 1.8), 50, 74, 80)}
      {obj(spr("1f62d", 200), 84, 76, "pop", "bob", 2.2)}'''
    E["n_error"] = titular("*¿ERROR* O GENIALIDAD?", "la marca más poderosa del mundo se equivocó a lo grande", "", ("1f914", "1f964", "1f9d0", "2728"))
    E["n_pepsi_desafio"] = f'''{F("", True)}{obj(lata(AZUL, "RIVAL", 230), 26, 50, "left", "bob")}
      {txt(kt("AÑOS 70", "l gris", .2), 64, 30, 60)}{txt(kt("EL *DESAFÍO*", "mega", .5, .15, "slam"), 64, 50, 70)}{txt(kt("la campaña de la cola rival", "l", 1.3), 64, 68, 60)}'''
    E["n_dos_vasos"] = f'''{F()}{obj(vaso("#3a1d10"), 32, 48, "drop", "bob", .1)}{obj(vaso("#3a1d10"), 68, 48, "drop", "bob", .4)}
      {txt('<div class="xl">A</div>', 32, 80, 10, "center", .8, "pop")}{txt('<div class="xl">B</div>', 68, 80, 10, "center", 1.0, "pop")}
      {txt(kt("dos vasos *sin marca*", "xl", .9), 50, 14, 80)}{obj(spr("1f440", 150), 50, 52, "pop", "", 1.3)}'''
    E["n_elige"] = lista([("1f964", "pruebas"), ("1f914", "comparas"), ("1f44d", "eliges")], "PRUEBA A CIEGAS")
    E["n_rival"] = icono_texto("1f630" if False else "1f6a8", "EL RIVAL *EN LA NUCA*", "la más famosa… pero empezaba a preocuparse", "Coca-Cola seguía en cabeza", "izq", "", True, "zoom", "pulse")
    E["n_atlanta"] = icono_texto("1f468-200d-1f4bc", "ATLANTA", "la dirección, con Roberto Goizueta al frente", "sede de Coca-Cola", "izq", "calido", False, "up", "bob", 360, (("1f1fa-1f1f8", 86, 22),))
    E["n_dulce"] = icono_texto("1f9ea", "MÁS SUAVE, *MÁS DULCE*", "una fórmula nueva", "si el problema es el sabor…", "der", "", True, "spin", "swing")
    E["n_200mil"] = cifra("200.000", "PERSONAS LA PROBARON", "1f4cb", "según la propia compañía, casi")
    E["n_gana"] = f'''{F("", True)}{obj(lata("#b3122a", "NUEVA", 250), 50, 46, "zoom", "pulse")}
      {txt(kt("GANA A LA ANTIGUA", "xl", .6), 27, 82, 40)}{txt(kt("GANA AL *RIVAL*", "xl", 1.2), 73, 82, 40)}{obj(spr("1f3c6", 160), 80, 24, "drop", "bob", 1.6)}'''
    E["n_sustituye"] = f'''{F()}{obj(lata(ROJO, "CLÁSICA", 230), 30, 48, "none", "fuera")}{obj(lata("#b3122a", "NUEVA", 230), 62, 48, "right", "bob", 1.4)}
      {txt(kt("no la añadió: *LA SUSTITUYÓ*", "xl", .4), 50, 88, 95)}'''
    E["n_suyo"] = impacto("la gente no estaba enfadada por el sabor:", "LE QUITARON *ALGO SUYO*", "", "1f494")
    E["n_cartas"] = f'''{F("", True)}{obj(spr("260e-fe0f", 240), 24, 40, "pop", "shake", .2)}{obj(spr("2709-fe0f", 200), 50, 30, "drop", "bob", .5)}{obj(spr("1f4e8", 220), 76, 42, "pop", "bob", .8)}
      {txt(kt("UNA *AVALANCHA*", "mega", .9, .15, "slam"), 50, 70, 90)}{txt(kt("de llamadas y cartas de protesta", "l", 1.6), 50, 86, 90)}'''
    E["n_protesta"] = bocadillos("1f4e2", ["¡Devolvednos la de siempre!", "¡Queremos la original!", "¡No es lo mismo!", "¡Era nuestra!"], "grupos de consumidores organizados")
    E["n_acopio"] = f'''{F()}{"".join(obj(spr("1f4e6", 170), x, y, "drop", "", d) for x, y, d in [(18, 70, .1), (32, 70, .3), (46, 70, .5), (25, 48, .7), (39, 48, .9), (32, 27, 1.1)])}
      {txt(kt("ACOPIO DE LA *ANTIGUA*", "xl", .8), 72, 44, 50)}{txt(kt("por si no volvía nunca más", "l", 1.5), 72, 60, 50)}'''
    E["n_parpadeo"] = icono_texto("1f440", "EL RIVAL *PARPADEÓ*", "el anuncio con el que presumió el presidente de la competencia", "y en la otra marca, lo celebraban:", "izq", "dark", True, "zoom", "")
    E["n_pregunta1"] = f'''{F("", True)}{obj(spr("1f4cb", 260), 22, 50, "pop", "bob")}{txt(kt("LAS CATAS PREGUNTABAN:", "l gris", .2), 62, 24, 60)}{txt(kt("¿QUÉ SABE *MEJOR*?", "mega", .6, .15, "slam"), 62, 54, 70)}'''
    E["n_pregunta2"] = f'''{F("dark", True)}{obj(spr("1f4ad", 220), 16, 30, "pop", "float")}{txt(kt("NADIE PREGUNTÓ:", "l hueso", .2), 54, 26, 80)}
      {txt(kt("¿cómo te sentirías si la de siempre *desapareciera*?", "xl hueso", .7, .08), 54, 52, 80)}'''
    E["n_relacion"] = comparar("1f9ea", "medían un producto", "2764-fe0f", "no medían una relación", "≠")
    E["n_11julio"] = fecha("11", "JULIO", "1985", "vuelve la fórmula original", "1f389" if False else "2728")
    E["n_classic"] = f'''{F("calido", True)}{obj(lata(ROJO, "CLASSIC", 300), 34, 50, "zoom", "float")}{obj(spr("2b50", 160), 50, 22, "pop", "spin-slow", 1.0)}
      {txt(kt("COCA-COLA", "xl", .5), 70, 40, 50)}{txt(kt("*CLASSIC*", "mega", .9, .15, "slam"), 70, 58, 55)}'''
    E["n_tele"] = icono_texto("1f4fa", "INTERRUMPIÓ *LA TELE*", "una cadena estadounidense cortó su programación para darlo", "la noticia fue tan grande que…", "izq", "", True, "pop", "shake", 400, (("1f1fa-1f1f8", 88, 20),))
    E["n_reforzada"] = icono_texto("1f4c8", "LA MARCA *SALIÓ REFORZADA*", "", "y ahora viene el giro:", "der", "", True, "up", "bob")
    E["n_plan"] = icono_texto("1f575-fe0f", "¿TODO ERA *UN PLAN*?", "muchos sospecharon una maniobra para recordar cuánto la querían", "", "izq", "dark", True, "pop", "bob")
    E["n_niega"] = icono_texto("1f645", "NINGUNA PRUEBA", "la compañía siempre lo ha negado", "", "der", "", False, "pop", "shake")
    E["n_significa"] = titular("UNA MARCA ES LO QUE *SIGNIFICA*", "no solo lo que vende", "la lección involuntaria:", ("2764-fe0f", "1f964", "2728", "1f60d"))
    E["n_coke2"] = f'''{F()}{obj(lata("#b3122a", "COKE II", 230), 26, 48, "pop", "fuera")}
      {txt(kt("COKE II", "xl", .3), 66, 32, 55)}{txt(kt("la nueva cambió de nombre…", "l", .9), 66, 48, 55)}{txt(kt("y en *2002* desapareció de EE. UU.", "xl", 1.6), 66, 66, 60)}'''
    E["leccion1"] = leccion(1, "los datos responden a lo que preguntas", "PREGUNTA *LO QUE IMPORTA*", "1f4cb")
    E["leccion2"] = leccion(2, "si el producto es «suyo»", "CAMBIARLO ES UNA DECISIÓN *EMOCIONAL*", "2764-fe0f")
    E["leccion3"] = leccion(3, "rectificar rápido puede salvarte", "*79 DÍAS*", "23f0")
    E["n_final"] = titular("TODOS SE *EQUIVOCAN*", "lo importante es lo que haces después", "hasta la marca más poderosa del mundo", ("1f964", "1f4c8", "2728", "1f44d"))
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:50px;top:90px;transform:rotate(-10deg)">{lata(ROJO, "CLÁSICA", 200)}</div>
      <div style="position:absolute;left:250px;top:120px;transform:rotate(8deg)">{lata("#8f0f22", "NUEVA", 200)}</div>
      <div style="position:absolute;left:190px;top:530px">{vicon("hourglass-not-done", 110)}</div>
      <div class="big" style="top:100px"><div class="s">COCA-COLA CAMBIÓ</div><div class="q" style="font-size:165px;margin-top:22px">SU FÓRMULA</div><div class="y">79 DÍAS DESPUÉS…</div></div>'''
