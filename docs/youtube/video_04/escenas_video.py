"""Escenas del vídeo 4 (Adidas vs Puma). Motor común; sin logotipos: zapatillas y símbolos genéricos."""
from base import *

CAP_ICONOS = {1: "1f528", 2: "1f3c3", 3: "1f494", 4: "1f3d8-fe0f", 5: "26bd", 6: "1faa6", 7: "1f9e0"}

def rio(w=900):
    return (f'<svg width="{w}" height="{w*0.55:.0f}" viewBox="0 0 900 500"><path class="draw" style="--d:.2s;--len:1400" d="M420,0 C520,120 340,260 470,360 S430,470 450,500" '
            f'fill="none" stroke="#2E6BD6" stroke-width="70" stroke-linecap="round" opacity=".8"/></svg>')

def escenas():
    E = {}
    E["a_pueblo"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{obj(spr("1f45f", 260), 30, 34, "drop", "bob", .4)}{obj(spr("1f440", 170), 52, 26, "pop", "", 1.0)}
      {txt(kt("PRIMERO TUS *ZAPATILLAS*…", "xl", .8), 66, 44, 60)}{txt(kt("y después tu cara", "l", 1.6), 66, 58, 60)}'''
    E["a_bandos"] = comparar("1f45f", "un bando", "1f45f", "el otro bando", "VS", "SEGÚN TU MARCA…")
    E["a_marcas"] = titular("ADIDAS Y *PUMA*", "nacieron en el mismo pueblo", "dos de las marcas deportivas más grandes del mundo", ("1f45f", "26bd", "1f3c3", "1f3c6"))
    E["a_hermanos"] = impacto("y las fundaron dos hermanos", "QUE ACABARON *SIN HABLARSE*", "", "1f494")
    E["a_herzo"] = f'''{F("sepia")}{obj(skyline(1800, "#6d5440"), 50, 82, "none")}{obj(spr("1f1e9-1f1ea", 170), 84, 20, "pop", "bob", .8)}
      {txt(kt("HERZOGENAURACH", "mega", .3, .1, "slam"), 50, 34, 95)}{txt(kt("Baviera, Alemania", "l", 1.1), 50, 52, 80)}<div class="viñeta"></div>'''
    E["a_fabrica"] = f'''{F("sepia")}{obj(spr("1f468", 220), 13, 50, "left", "bob", .2)}{obj(spr("1f468", 220), 28, 50, "left", "bob", .5)}
      {txt(kt("ADOLF Y RUDOLF *DASSLER*", "xl", .6), 68, 36, 56)}{txt(kt("una fábrica de calzado, en los años veinte", "l", 1.3), 68, 56, 56)}{obj(spr("1f3ed", 150), 70, 78, "pop", "", 1.8)}<div class="viñeta"></div>'''
    E["a_adi"] = icono_texto("1f528", "ADI, *EL INVENTOR*", "diseñaba y probaba las zapatillas", "Adolf, al que llamaban Adi:", "izq", "", True, "spin", "swing", 360, (("1f45f", 86, 80),))
    E["a_rudolf"] = icono_texto("1f4bc", "RUDOLF, *EL VENDEDOR*", "salía a buscar clientes", "", "der", "", True, "pop", "bob", 360, (("1f91d", 14, 80),))
    E["a_juntos"] = titular("JUNTOS, *IMPARABLES*", "inventor + vendedor", "", ("1f91d", "1f4aa", "2728", "1f45f"))
    E["a_berlin"] = anio(1900, 1936, "Juegos Olímpicos de Berlín", "1f3df-fe0f")
    E["a_owens"] = f'''{F("", True)}<div class="carrera" style="--d:.2s">{spr("1f3c3", 300)}</div>
      {txt(kt("JESSE OWENS", "mega", .5, .12, "slam"), 50, 30, 90)}{txt(kt("corrió con zapatillas de los *Dassler*", "l", 1.2), 50, 48, 90)}'''
    E["a_oros"] = f'''{F("calido", True)}{"".join(obj(spr("1f947", 200), x, 42, "drop", "bob", d) for x, d in [(23, .2), (41, .5), (59, .8), (77, 1.1)])}
      {txt(kt("*4 MEDALLAS* DE ORO", "mega", 1.3, .15, "slam"), 50, 76, 95)}'''
    E["a_publicidad"] = icono_texto("1f4e2", "PUBLICIDAD *MUNDIAL*", "para una pequeña fábrica de pueblo", "", "izq", "", True, "zoom", "pulse")
    E["a_guerra"] = impacto("tras la Segunda Guerra Mundial", "TODO SALTÓ *POR LOS AIRES*", "", "1f4a5" if False else "1f525")
    E["a_porque"] = icono_texto("1f937", "¿POR QUÉ *SE PELEARON*?", "nadie lo sabe con certeza", "", "der", "", False, "pop", "bob")
    E["a_versiones"] = lista([("1f624", "celos entre familias"), ("1f575-fe0f", "sospechas en la guerra"), ("2694-fe0f", "¿quién manda?")], "HAY VARIAS VERSIONES")
    E["a_resultado"] = titular("LO QUE SÍ *SABEMOS*", "", "", ("1f50d",), "", True, "xl")
    E["a_separan"] = f'''{F()}{obj(spr("1f468", 240), 22, 50, "none", "fuera")}<div class="pos" style="left:50%;top:50%">{rio(700)}</div>{obj(spr("1f468", 240), 78, 50, "pop", "bob", .6)}
      {txt(kt("SE SEPARAN", "xl", .6), 50, 14, 80)}{txt(kt("finales de los años cuarenta", "l gris", 1.2), 50, 90, 80)}'''
    E["a_puma"] = f'''{F("", True)}<div class="pos" style="left:30%;top:50%">{rio(560)}</div>{obj(spr("1f406", 300), 66, 46, "right", "bob", .5)}
      {txt('<div class="xl"><span style="text-decoration:line-through;color:#8A8F98">RUDA</span></div>', 30, 30, 30, "center", .8, "pop")}
      {txt(kt("*PUMA*", "mega", 1.4, .15, "slam"), 66, 78, 50)}{txt(kt("Rudolf cruzó el río", "l", .3), 30, 84, 40)}'''
    E["a_adidas"] = f'''{F("", True)}{obj(spr("1f45f", 300), 26, 46, "spin", "float")}
      {txt(kt("1949", "l gris", .2), 66, 24, 55)}{txt('<div class="mega"><span class="w w-slam" style="--d:.5s">ADI</span><span class="w w-slam" style="--d:.9s;color:#D7263D">DAS</span></div>', 66, 46, 60)}
      {txt(kt("Adi + *Das*sler", "xl", 1.5), 66, 68, 55)}'''
    E["a_divide"] = comparar("1f3e0", "bando Adidas", "1f3e0", "bando Puma", "VS", "EL PUEBLO SE DIVIDIÓ")
    E["a_bares"] = lista([("1f3ea", "comercios"), ("1f37a", "bares"), ("26bd", "equipos de fútbol")], "TODO TENÍA BANDO")
    E["a_cuellos"] = titular("«EL PUEBLO DE LOS *CUELLOS DOBLADOS*»", "", "a Herzogenaurach se la llegó a llamar", ("1f440", "1f45f", "1f6b6", "1f463"), "", True, "xl")
    E["a_pies"] = f'''{F()}{obj(spr("1f6b6", 280), 30, 46, "left", "bob")}{obj(spr("1f440", 160), 30, 20, "pop", "", .5)}
      <svg class="pos" style="left:30%;top:55%" width="160" height="300"><path class="draw" style="--d:.8s;--len:300" d="M80,10 L80,270 M40,230 L80,280 L120,230" fill="none" stroke="#D7263D" stroke-width="10"/></svg>
      {txt(kt("TODOS MIRANDO", "xl", .6), 68, 40, 55)}{txt(kt("*A LOS PIES*", "mega", 1.1, .15, "slam"), 68, 58, 55)}'''
    E["a_estadios"] = titular("LA RIVALIDAD *SALTA AL CAMPO*", "", "", ("26bd", "1f3df-fe0f", "1f45f", "2694-fe0f"))
    E["a_1954"] = f'''{F("cesped")}{obj(spr("1f1e9-1f1ea", 180), 18, 24, "pop", "bob", .3)}{obj(spr("1f45f", 300), 32, 58, "zoom", "float", .6)}
      {txt(kt("MUNDIAL *1954*", "mega hueso", .4, .15, "slam"), 68, 34, 60)}{txt(kt("botas con tacos intercambiables", "l hueso", 1.2), 68, 54, 60)}'''
    E["a_final_lluvia"] = f'''{F("cesped")}<div class="lluvia"></div>{obj(spr("1f327-fe0f", 220), 50, 16, "drop", "float")}
      {obj(spr("1f1e9-1f1ea", 200), 26, 52, "pop", "bob", .5)}{txt('<div class="vs" style="--d:.9s">VS</div>', 50, 52, 20)}{obj(spr("1f1ed-1f1fa", 200), 74, 52, "pop", "bob", .7)}
      {txt(kt("GANÓ LA FINAL *BAJO LA LLUVIA*", "xl hueso", 1.4), 50, 84, 95)}'''
    E["a_pele"] = f'''{F("", True)}{obj(spr("1f1e7-1f1f7", 200), 18, 28, "pop", "bob", .3)}{obj(spr("26bd", 220), 26, 62, "spin", "float", .6)}
      {txt(kt("según se cuenta, en 1970:", "l gris", .2), 64, 26, 60)}{txt(kt("PACTO: NADIE FICHA *A PELÉ*", "xl", .8), 64, 44, 60)}{obj(spr("1f91d", 180), 64, 68, "pop", "", 1.6)}'''
    E["a_pacto_roto"] = impacto("y, siempre según esa historia…", "PUMA *ROMPIÓ EL PACTO*", "", "1f4dc")
    E["a_nunca"] = icono_texto("1f494", "NUNCA SE *RECONCILIARON*", "", "los hermanos…", "izq", "dark", True, "pop", "pulse")
    E["a_ultimo"] = titular("HASTA EL *ÚLTIMO LUGAR*", "la pelea llegó hasta el final", "", ("1f494",), "dark", True, "xl")
    E["a_cementerio"] = f'''{F("sepia")}{obj(spr("1faa6", 220), 12, 60, "up", "", .3)}{obj(spr("1faa6", 220), 88, 60, "up", "", .6)}
      <svg class="pos" style="left:50%;top:60%" width="1300" height="60"><path class="draw" style="--d:1.0s;--len:1300" d="M10,30 L1290,30" stroke="#151515" stroke-width="6" stroke-dasharray="20 14"/></svg>
      {txt(kt("ENTERRADOS EN *EXTREMOS OPUESTOS*", "xl", 1.2), 50, 30, 80)}{txt(kt("del cementerio del pueblo", "l", 1.8), 50, 84, 80)}<div class="viñeta"></div>'''
    E["a_otros"] = f'''{F()}{obj(spr("1f45f", 200), 22, 44, "pop", "", .2)}{obj(spr("1f440", 120), 34, 30, "pop", "", .5)}{obj(spr("1f440", 120), 66, 30, "pop", "", .7)}{obj(spr("1f45f", 200), 78, 44, "pop", "", .4)}
      {obj(spr("1f3c3", 220), 50, 64, "up", "bob", 1.4)}{txt(kt("mirándose el uno al otro… y *otros aprovecharon*", "xl", 1.0), 50, 84, 80)}'''
    E["leccion1"] = leccion(1, "un inventor y un vendedor juntos", "SEPARADOS, CADA UNO *APRENDE LO DEL OTRO*", "1f91d")
    E["leccion2"] = leccion(2, "la rivalidad puede impulsarte…", "O DISTRAERTE *DE LO QUE PASA FUERA*", "1f440")
    E["leccion3"] = leccion(3, "una pelea familiar", "PUEDE DURAR MÁS QUE *QUIENES LA EMPEZARON*", "1f494")
    E["a_final"] = titular("UNA *PELEA ENTRE HERMANOS*", "puede estar detrás de tus zapatillas", "la próxima vez que te las pongas…", ("1f45f", "1f494", "1f45f", "2728"))
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:160px;transform:rotate(-14deg)">{vicon("running-shoe", 300)}</div>
      <div style="position:absolute;left:340px;top:200px;transform:scaleX(-1) rotate(-14deg)">{vicon("running-shoe", 300)}</div>
      <div style="position:absolute;left:265px;top:120px;font-family:Bebas;font-size:140px;color:#D7263D;text-shadow:5px 5px 0 #151515">VS</div>
      <div class="big" style="top:110px"><div class="s">DOS HERMANOS</div><div class="q">ENEMIGOS</div><div class="y">ADIDAS · PUMA</div></div>'''
