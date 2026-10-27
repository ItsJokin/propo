"""Escenas del vídeo 10 (Blockbuster vs Netflix). Motor común; sin logotipos: tiendas, cintas y sobres genéricos."""
from base import *

CAP_ICONOS = {1: "1f4fc", 2: "1f4b8", 3: "1f91d", 4: "1f94a", 5: "1f4fa", 6: "1f9e0"}

def tienda(px=560, color=AZUL, rotulo="VIDEOCLUB"):
    return (f'<svg width="{px}" height="{px*0.7:.0f}" viewBox="0 0 400 280"><rect x="20" y="60" width="360" height="210" fill="#e6e9ef" stroke="{TINTA}" stroke-width="5"/>'
            f'<rect x="10" y="20" width="380" height="54" rx="6" fill="{color}" stroke="{TINTA}" stroke-width="5"/><text x="200" y="60" font-family="Bebas" font-size="40" fill="#FFD23F" text-anchor="middle">{rotulo}</text>'
            f'<rect x="50" y="110" width="120" height="160" fill="#9fc3e6" stroke="{TINTA}" stroke-width="4"/><rect x="210" y="110" width="140" height="90" fill="#9fc3e6" stroke="{TINTA}" stroke-width="4"/>'
            + "".join(f'<rect x="{218 + i*16}" y="122" width="11" height="34" fill="{[ROJO, NARANJA, VERDE, "#8e44ad"][i % 4]}"/>' for i in range(8)) + '</svg>')

def sobre(px=220, color=ROJO):
    return (f'<svg width="{px}" height="{px*0.66:.0f}" viewBox="0 0 150 100"><rect x="4" y="4" width="142" height="92" rx="8" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M4,10 L75,58 L146,10" fill="none" stroke="{HUESO}" stroke-width="5"/><circle cx="75" cy="72" r="14" fill="{HUESO}" opacity=".85"/></svg>')

def escenas():
    E = {}
    E["b_viernes"] = f'''{F("dark", True)}{obj(tienda(600), 34, 52, "zoom", "", .1)}{obj(spr("1f64f", 200), 78, 34, "pop", "bob", .9)}
      {txt(kt("VIERNES *POR LA NOCHE*", "xl hueso", .5), 76, 62, 44)}{txt(kt("que no esté alquilada…", "l naranja", 1.4), 76, 76, 44)}'''
    E["b_rey"] = icono_texto("1f451", "EL REY DEL *VIDEOCLUB*", "Blockbuster", "", "izq", "", True, "drop", "bob", 340, (("1f4fc", 86, 78),))
    E["b_oferta"] = f'''{F("", True)}{obj(sobre(260), 26, 46, "drop", "bob", .2)}{txt(kt("AÑO 2000: COMPRAR", "l gris", .4), 66, 26, 60)}
      {txt(kt("DVD POR *CORREO*", "xl", .8), 66, 42, 60)}{txt(kt("50 M$", "mega rojo", 1.4, .12, "slam"), 66, 64, 60)}'''
    E["b_netflix"] = impacto("esa empresa se llamaba", "*NETFLIX*", "", "1f4e8")
    E["b_no"] = f'''{F("dark", True)}{txt(kt("Y BLOCKBUSTER DIJO", "xl hueso", .2), 50, 30, 90)}{txt(kt("*QUE NO*", "mega naranja", .8, .15, "slam"), 50, 52, 90)}{obj(spr("1f645", 220), 50, 80, "pop", "shake", 1.4)}'''
    E["b_1985"] = f'''{F("", True)}{obj(tienda(560), 32, 52, "zoom", "", .1)}{txt(kt("1985", "mega rojo", .6, .12, "slam"), 76, 40, 44)}{txt(kt("Dallas, Estados Unidos", "l", 1.3), 76, 58, 44)}'''
    E["b_tiendas"] = lista([("1f3ec", "tiendas grandes"), ("1f4a1", "luminosas"), ("1f4fc", "miles de películas")], "LA IDEA")
    E["b_9000"] = cifra("≈9.000", "TIENDAS EN TODO EL MUNDO", "1f30d", "llegó a tener unas")
    E["b_recargos"] = icono_texto("1f620", "LOS *RECARGOS* POR DEVOLVER TARDE", "un negocio que los clientes odiaban", "", "izq", "", True, "pop", "shake", 340, (("23f0", 86, 78),))
    E["b_ingresos"] = f'''{F()}{obj(spr("1f4b8", 240), 26, 46, "drop", "float", .2)}{txt(kt("UNA PARTE *MUY IMPORTANTE*", "xl", .6), 68, 40, 56)}{txt(kt("de sus ingresos, según algunas estimaciones", "l", 1.3), 68, 58, 56)}'''
    E["b_fundan"] = comparar("1f468-200d-1f4bc", "Reed Hastings", "1f468-200d-1f4bb", "Marc Randolph", "+", "1997: NACE NETFLIX")
    E["b_multa"] = f'''{F("", True)}{obj(spr("1f9fe", 240), 24, 46, "pop", "swing", .2)}{txt(kt("UNA MULTA DE", "l", .5), 66, 30, 60)}{txt(kt("40 $", "mega rojo", .9, .12, "slam"), 66, 48, 60)}
      {txt(kt("según la versión de Hastings", "l gris", 1.6), 66, 66, 60)}'''
    E["b_randolph"] = icono_texto("1f914", "«MENOS *CINEMATOGRÁFICA*»", "Randolph, el otro fundador, lo cuenta distinto", "", "der", "", False, "pop", "swing")
    E["b_correo"] = f'''{F()}{obj(spr("1f4bb", 200), 16, 46, "pop", "bob", .1)}<div class="carrera" style="--d:.6s;top:-140px">{sobre(200)}</div>
      {obj(spr("1f3e0", 220), 84, 46, "pop", "bob", .3)}{txt(kt("ALQUILAS POR INTERNET, *TE LLEGA POR CORREO*", "xl", 1.4), 50, 82, 90)}'''
    E["b_suscripcion"] = titular("SUSCRIPCIÓN *MENSUAL*", "sin recargos por retraso", "", ("1f4c5", "2705", "1f4e8", "1f60c"))
    E["b_pierde"] = icono_texto("1f4c9", "NETFLIX *PERDÍA DINERO*", "", "año 2000", "izq", "", True, "drop", "shake")
    E["b_dallas"] = flecha("2708-fe0f", "1f3e2", "REUNIÓN EN *DALLAS*", "con John Antioco, director de Blockbuster")
    E["b_propuesta"] = f'''{F("", True)}{obj(spr("1f4bc", 220), 22, 44, "pop", "bob", .2)}{txt(kt("LA PROPUESTA", "l gris", .3), 64, 24, 62)}
      {txt(kt("Blockbuster compra Netflix por *50 M$*", "xl", .6), 64, 42, 62)}{txt(kt("y Netflix lleva su negocio en internet", "l", 1.4), 64, 62, 62)}'''
    E["b_nicho"] = icono_texto("1f90f", "«UN NEGOCIO *DE NICHO*»", "Antioco no se interesó", "", "der", "", False, "pop", "")
    E["b_risas"] = f'''{F("dark", True)}{obj(spr("1f923", 240), 26, 46, "pop", "shake", .2)}{txt(kt("«CASI *SE NOS RIERON*»", "xl hueso", .6), 66, 40, 56)}
      {txt(kt("según el entonces director financiero de Netflix", "l naranja", 1.4), 66, 58, 56)}'''
    E["b_giro"] = impacto("aquí viene el giro", "QUE *CASI NADIE* CUENTA", "", "1f504")
    E["b_reacciona"] = icono_texto("1f94a", "BLOCKBUSTER *REACCIONÓ*", "unos años después", "", "izq", "", True, "zoom", "shake")
    E["b_online"] = lista([("1f4bb", "alquiler por internet"), ("1f6ab", "sin recargos"), ("1f3ea", "devolución en tienda")], "SU CONTRAATAQUE")
    E["b_gana"] = comparar("1f4c8", "Blockbuster gana clientes", "1f630", "Netflix lo pasa mal", "VS")
    E["b_choques"] = icono_texto("1f4a5", "CHOQUES *INTERNOS*", "por el coste de la estrategia; Antioco sale de la empresa", "", "der", "dark", True, "pop", "shake")
    E["b_tiendas_otra"] = f'''{F()}{obj(tienda(520), 30, 50, "zoom", "", .1)}{txt(kt("SU SUCESOR: *OTRA VEZ LAS TIENDAS*", "xl", .7), 72, 46, 50)}'''
    E["b_streaming"] = f'''{F("", True)}{obj(spr("1f4fa", 300), 30, 46, "zoom", "pulse", .2)}{txt(kt("2007: VER PELÍCULAS", "l", .6), 68, 34, 56)}{txt(kt("*POR INTERNET*", "mega", 1.0, .12, "slam"), 68, 52, 56)}'''
    E["b_cartero"] = f'''{F()}{obj(tienda(360), 24, 44, "none", "fuera", .3)}{obj(sobre(220), 72, 44, "none", "fuera", .6)}{txt(kt("NI TIENDA *NI CARTERO*", "xl", 1.0), 50, 82, 90)}'''
    E["b_quiebra"] = cifra("2010", "BLOCKBUSTER, EN QUIEBRA", "1f4c9")
    E["b_suscriptores"] = icono_texto("1f30d", "CIENTOS DE MILLONES *DE SUSCRIPTORES*", "Netflix, hoy", "", "izq", "", True, "zoom", "spin-slow", 360, (("1f4fa", 86, 78),))
    E["b_ultima"] = f'''{F("calido", True)}{obj(tienda(560), 32, 52, "zoom", "", .1)}{txt(kt("QUEDA *UNA*", "mega", .6, .12, "slam"), 76, 36, 44)}
      {txt(kt("Bend, Oregón", "xl", 1.2), 76, 54, 44)}{txt(kt("casi un museo", "l", 1.7), 76, 68, 44)}'''
    E["leccion1"] = leccion(1, "si vives de algo que tus clientes odian", "ALGUIEN LES OFRECERÁ *LO CONTRARIO*", "1f620")
    E["leccion2"] = leccion(2, "el nicho de hoy", "PUEDE SER *EL MERCADO DE MAÑANA*", "1f331")
    E["leccion3"] = leccion(3, "reaccionar no basta", "HAY QUE *LLEGAR HASTA EL FINAL*", "1f3c1")
    E["b_final"] = cifra("50 M$", "LA OPORTUNIDAD PERDIDA MÁS FAMOSA", "1f4b8", "probablemente")
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:140px">{tienda(470)}</div>
      <div style="position:absolute;left:120px;top:470px">{vicon("money-with-wings", 150)}</div>
      <div class="big" style="top:110px"><div class="s">PUDO COMPRAR NETFLIX</div><div class="q" style="font-size:200px;margin-top:22px">50 M$</div><div class="y">Y DIJO QUE NO</div></div>'''
