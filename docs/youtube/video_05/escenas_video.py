"""Escenas del vídeo 5 (LEGO). Motor común; sin logotipos: ladrillos genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1fab5", 2: "1f9f1", 3: "1f3a2", 4: "1f4c9", 5: "1f9f1", 6: "1f3ac", 7: "1f9e0"}

def ladrillo(color=ROJO, px=260, tetones=4):
    w = 40 + tetones * 40
    st = "".join(f'<rect x="{28 + i*40}" y="2" width="24" height="16" rx="4" fill="{color}"/><rect x="{28 + i*40}" y="2" width="24" height="6" rx="3" fill="#fff" opacity=".25"/>' for i in range(tetones))
    return (f'<svg width="{px}" height="{px * 90 / w:.0f}" viewBox="0 0 {w} 90">{st}<rect x="10" y="16" width="{w-20}" height="70" rx="6" fill="{color}"/>'
            f'<rect x="10" y="16" width="{w-20}" height="12" rx="6" fill="#fff" opacity=".18"/><rect x="10" y="70" width="{w-20}" height="16" rx="6" fill="#000" opacity=".18"/></svg>')

def torre(colores, px=200, x=50, y=60, d=0.0):
    return "".join(obj(ladrillo(c, px), x, y - i * 9.5, "drop", "", d + i * .25) for i, c in enumerate(colores))

def escenas():
    E = {}
    C = [ROJO, AZUL, "#FFD23F", VERDE, NARANJA]
    E["l_pisar"] = f'''{F("", True)}{obj(ladrillo(ROJO, 300), 34, 70, "drop", "", .2)}{obj(spr("1f9b6", 300), 34, 34, "drop", "", .7)}
      {obj(spr("1f62b", 220), 74, 34, "pop", "shake", 1.3)}{txt(kt("¡*AY*!", "mega", 1.2, .1, "slam"), 74, 68, 40)}'''
    E["l_mundo"] = f'''{F()}{obj(spr("1f30d", 300), 50, 46, "zoom", "spin-slow")}{"".join(obj(ladrillo(C[i % 5], 140), x, y, "pop", "bob", .4 + i * .2) for i, (x, y) in enumerate([(18, 24), (82, 26), (16, 74), (84, 72), (50, 12)]))}
      {txt(kt("EN CASAS DE *TODO EL MUNDO*", "xl", .8), 50, 88, 90)}'''
    E["l_quiebra"] = impacto("a principios de los años 2000…", "AL BORDE DE LA *QUIEBRA*", "", "1f4c9")
    E["l_resumen"] = f'''{F("", True)}{obj(spr("1fab5", 200), 16, 46, "pop", "bob", .2)}{obj(spr("1f3c6", 200), 38, 46, "pop", "bob", .7)}{obj(spr("1f4c9", 200), 60, 46, "pop", "shake", 1.2)}
      {obj(ladrillo(ROJO, 220), 84, 46, "zoom", "pulse", 1.7)}{txt(kt("carpintería → gigante → casi se hunde → *un ladrillo*", "l", .4), 50, 76, 95)}'''
    E["l_billund"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{obj(spr("1f1e9-1f1f0", 170), 84, 20, "pop", "bob", .8)}
      {txt(kt("BILLUND", "mega", .3, .1, "slam"), 50, 34, 95)}{txt(kt("un pueblo pequeño de Dinamarca", "l", 1.1), 50, 52, 80)}'''
    E["l_carpintero"] = icono_texto("1fab5", "OLE KIRK *CHRISTIANSEN*", "carpintero: juguetes de madera", "1932", "izq", "sepia", False, "pop", "bob", 360, (("1f528", 86, 80),))
    E["l_dificil"] = icono_texto("1f4b8", "AÑOS *DIFÍCILES*", "los juguetes eran una forma de sobrevivir", "", "der", "sepia", False, "drop", "float")
    E["l_nombre"] = titular("*LEGO*", "dos años después, la empresa tiene nombre", "1934", ("1f9f8", "1fab5", "2728", "1f9f1"))
    E["l_leggodt"] = f'''{F("", True)}{txt(kt("«LEG GODT»", "mega", .3, .15, "slam"), 50, 36, 90)}{txt('<div class="xl rojo">=</div>', 50, 52, 20, "center", 1.0, "pop")}
      {txt(kt("«*JUEGA BIEN*»", "mega", 1.3, .15, "slam"), 50, 70, 90)}{obj(spr("1f1e9-1f1f0", 150), 86, 22, "pop", "bob", .6)}'''
    E["l_plastico"] = icono_texto("1f9ea", "UN MATERIAL NUEVO: *EL PLÁSTICO*", "después de la Segunda Guerra Mundial", "", "izq", "", True, "zoom", "swing")
    E["l_encajar"] = f'''{F()}{torre([ROJO, AZUL], 260, 34, 66, .2)}{txt(kt("LADRILLOS QUE *ENCAJAN*", "xl", .8), 70, 40, 52)}{txt(kt("finales de los años cuarenta", "l", 1.4), 70, 58, 52)}'''
    E["l_desmonta"] = f'''{F()}{obj(ladrillo(ROJO, 230), 30, 40, "none", "fuera", .6)}{obj(ladrillo(AZUL, 230), 30, 64, "none", "shake")}
      {txt(kt("NO SE *SUJETABAN*", "xl", .3), 70, 40, 52)}{txt(kt("las construcciones se desmontaban", "l", 1.0), 70, 58, 52)}'''
    E["l_1958"] = anio(1900, 1958, "tetones arriba, tubos por dentro", "1f9f1")
    E["l_patente"] = icono_texto("1f4dc", "EL DISEÑO *PATENTADO*", "básicamente el mismo que hoy", "1958", "der", "", True, "flip", "bob", 360, (("1f9f1", 14, 80),))
    E["l_compatible"] = f'''{F("", True)}{obj(ladrillo("#b8860b", 260), 26, 40, "left", "bob", .2)}{txt(kt("1960", "xl gris", .3), 26, 62, 30)}
      {obj(ladrillo(ROJO, 260), 74, 40, "right", "bob", .5)}{txt(kt("HOY", "xl gris", .6), 74, 62, 30)}
      {txt('<div class="vs" style="--d:1s">+</div>', 50, 42, 20)}{txt(kt("SIGUEN *ENCAJANDO*", "xl", 1.3), 50, 84, 90)}'''
    E["l_crece"] = f'''{F()}{torre(C + C[:2], 170, 50, 78, .1)}{obj(spr("1f4c8", 200), 82, 30, "pop", "bob", 1.6)}{txt(kt("DÉCADAS *CRECIENDO*", "xl", .5), 22, 30, 40)}'''
    E["l_detodo"] = impacto("en los años noventa…", "HACER *DE TODO*", "", "1f92f")
    E["l_lista"] = f'''{F()}{"".join(obj(spr(c, 170), x, y, "pop", "bob", .2 + i * .3) for i, (c, x, y) in enumerate([("1f455", 16, 34), ("1f3a2", 38, 30), ("1f3ae", 60, 34), ("231a", 82, 30), ("1f37c", 50, 62)]))}
      {txt(kt("ropa · parques · videojuegos · relojes · bebés", "l", .8), 50, 86, 95)}'''
    E["l_piezas"] = f'''{F()}{"".join(obj(ladrillo(C[i % 5], 90 + (i % 3) * 30, 1 + i % 4), 12 + (i % 6) * 15, 26 + (i // 6) * 22, "pop", "", .1 + i * .08) for i in range(18))}
      {txt(kt("MÁS Y MÁS *PIEZAS DISTINTAS*", "xl", 1.2), 50, 90, 90)}'''
    E["l_moldes"] = icono_texto("1f3ed", "CADA PIEZA, *UN MOLDE*", "y los moldes son carísimos", "", "izq", "", True, "zoom", "shake", 360, (("1f4b8", 86, 78),))
    E["l_menos"] = lista([("1f9e9", "más complejidad"), ("1f4b8", "más costes"), ("1f4c9", "menos dinero")], "EL RESULTADO")
    E["l_2003"] = cifra("2003", "PERDÍA DINERO A TODA VELOCIDAD", "1f4c9")
    E["l_deudas"] = icono_texto("1f9fe", "RIESGO DE *NO PODER PAGAR*", "según su nuevo director", "las deudas:", "der", "dark", True, "drop", "shake")
    E["l_trocear"] = f'''{F("dark", True)}{obj(ladrillo(ROJO, 200), 30, 46, "none", "fuera", .3)}{obj(ladrillo(AZUL, 200), 50, 46, "none", "fuera", .6)}{obj(ladrillo("#FFD23F", 200), 70, 46, "none", "fuera", .9)}
      {txt(kt("TROCEADA Y *VENDIDA POR PARTES*", "xl hueso", .4), 50, 76, 90)}'''
    E["l_knudstorp"] = icono_texto("1f468-200d-1f4bc", "JØRGEN VIG *KNUDSTORP*", "el primer director de fuera de la familia", "2004", "izq", "", True, "up", "bob")
    E["l_duras"] = titular("DECISIONES *MUY DURAS*", "", "", ("2702-fe0f", "1f4c9", "2696-fe0f", "1f9f1"))
    E["l_mitad"] = f'''{F("", True)}{"".join(obj(ladrillo(C[i % 5], 120, 2), 14 + (i % 4) * 10, 30 + (i // 4) * 18, "pop", "fuera" if i % 2 else "", .1 + i * .06) for i in range(12))}
      {txt(kt("*LA MITAD*", "mega", .9, .15, "slam"), 72, 44, 50)}{txt(kt("de piezas distintas", "l", 1.5), 72, 62, 50)}'''
    E["l_legoland"] = icono_texto("1f3a2", "VENDE LOS *PARQUES*", "Legoland, fuera", "", "der", "", True, "pop", "swing")
    E["l_despidos"] = icono_texto("1f4e6", "DESPIDOS *IMPORTANTES*", "", "", "izq", "dark", False, "drop", "")
    E["l_foco"] = f'''{F("calido", True)}{obj(ladrillo(ROJO, 360), 50, 40, "zoom", "pulse", .3)}{txt(kt("VOLVER *AL LADRILLO*", "mega", .9, .12, "slam"), 50, 72, 95)}{txt(kt("y al sistema para construir", "l", 1.6), 50, 86, 80)}'''
    E["l_rentable"] = icono_texto("1f9ee", "CADA SET, *RENTABLE*", "diseñar pensando también en el coste", "", "der", "", True, "pop", "bob", 360, (("1f4b0", 14, 80),))
    E["l_funciona"] = titular("*FUNCIONÓ*", "las ventas volvieron a crecer", "", ("1f4c8", "1f389", "1f9f1", "1f4b0"))
    E["l_remate"] = impacto("y entonces llegó", "EL *REMATE*", "", "1f3ac")
    E["l_pelicula"] = cifra("+400 M$", "LA LEGO PELÍCULA (2014)", "1f37f", "recaudación mundial:")
    E["l_cines"] = icono_texto("1f3a6", "DE CASI DESAPARECER… *AL CINE*", "una década después", "", "izq", "dark", True, "zoom", "pulse")
    E["l_mismo"] = f'''{F("", True)}{obj(ladrillo(ROJO, 340), 50, 42, "flip", "float", .2)}{txt(kt("EL MISMO LADRILLO DE *1958*", "xl", .8), 50, 74, 90)}'''
    E["leccion1"] = leccion(1, "crecer haciendo de todo", "PUEDE HACERTE *PERDER EL RUMBO*", "1f9ed")
    E["leccion2"] = leccion(2, "la complejidad cuesta dinero", "AUNQUE *NO SE VEA*", "1f9e9")
    E["leccion3"] = leccion(3, "para salvarte", "VUELVE A LO QUE *TE HIZO ÚNICO*", "1f9f1")
    E["l_final"] = f'''{F("", True)}{torre(C, 190, 22, 76, .1)}{obj(spr("1f9b6", 200), 22, 20, "drop", "", 1.4)}
      {txt(kt("ESA PIEZA ESTUVO A PUNTO DE *DESAPARECER*", "xl", .6), 64, 44, 60)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:120px;transform:rotate(-12deg)">{ladrillo(ROJO, 420)}</div>
      <div style="position:absolute;left:90px;top:330px;transform:rotate(6deg);opacity:.9">{ladrillo(AZUL, 300, 3)}</div>
      <div style="position:absolute;left:70px;top:470px">{vicon("chart-decreasing", 150)}</div>
      <div class="big" style="top:110px"><div class="s">LEGO ESTUVO A PUNTO</div><div class="q" style="font-size:190px;margin-top:22px">DE QUEBRAR</div><div class="y">Y SE SALVÓ ASÍ</div></div>'''
