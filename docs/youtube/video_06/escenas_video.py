"""Escenas del vídeo 6 (Nokia). Motor común; sin logotipos: móviles genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f4c4", 2: "1f4f1", 3: "1f4f2", 4: "1f525", 5: "1f4e1", 6: "1f9e0"}

def movil(px=220, pantalla="#9bbc0f", serpiente=False):
    s = ('<path class="draw" style="--d:.4s;--len:260" d="M22,70 L22,52 L58,52 L58,40 L40,40" fill="none" stroke="#0f380f" stroke-width="6"/>'
         '<rect x="62" y="62" width="6" height="6" fill="#0f380f"/>') if serpiente else ""
    teclas = "".join(f'<rect x="{18 + (i % 3) * 22}" y="{118 + (i // 3) * 16}" width="16" height="10" rx="4" fill="#cfd3da"/>' for i in range(12))
    return (f'<svg width="{px}" height="{px*2:.0f}" viewBox="0 0 90 180"><rect x="4" y="4" width="82" height="172" rx="22" fill="#2b3a55"/>'
            f'<rect x="14" y="26" width="62" height="56" rx="6" fill="{pantalla}"/>{s}<ellipse cx="45" cy="98" rx="18" ry="7" fill="#cfd3da"/>{teclas}</svg>')

def tactil(px=200):
    return (f'<svg width="{px}" height="{px*2:.0f}" viewBox="0 0 90 180"><rect x="4" y="4" width="82" height="172" rx="14" fill="{TINTA}"/>'
            f'<rect x="10" y="16" width="70" height="146" rx="6" fill="#3a7bd5"/>'
            + "".join(f'<rect x="{16 + (i % 3) * 22}" y="{24 + (i // 3) * 24}" width="14" height="14" rx="4" fill="#fff" opacity=".7"/>' for i in range(12)) + '</svg>')

def escenas():
    E = {}
    E["k_movil"] = f'''{F("", True)}{obj(movil(230), 28, 52, "drop", "bob", .2)}{txt(kt("PRINCIPIOS DE LOS *2000*", "xl", .6), 66, 40, 56)}{txt(kt("es muy probable que fuera este", "l", 1.3), 66, 56, 56)}'''
    E["k_serpiente"] = f'''{F()}{obj(movil(230, serpiente=True), 22, 52, "pop", "", .1)}{obj(spr("1f50b", 170), 50, 30, "pop", "bob", .6)}{obj(spr("1f40d", 200), 78, 30, "pop", "swing", 1.1)}
      {txt(kt("INDESTRUCTIBLE · BATERÍA · *SERPIENTE*", "l", .9), 64, 72, 70)}'''
    E["k_lider"] = titular("LA MÁS *VENDIDA*", "del planeta, durante años", "", ("1f3c6", "1f4f1", "1f451", "1f30d"))
    E["k_desaparece"] = f'''{F("dark", True)}{obj(movil(230), 50, 44, "none", "fuera", .3)}{txt(kt("Y DESAPARECIÓ *DE TU BOLSILLO*", "xl hueso", .8), 50, 84, 90)}'''
    E["k_papel"] = impacto("pero empezó así:", "FABRICANDO *PAPEL*", "", "1f4c4")
    E["k_1865"] = anio(1800, 1865, "Finlandia", "1f1eb-1f1ee")
    E["k_idestam"] = icono_texto("1fab5", "FREDRIK *IDESTAM*", "fábrica de pasta de papel en Tampere", "un ingeniero:", "izq", "sepia", False, "pop", "bob", 360, (("1f30a", 86, 80),))
    E["k_pueblo"] = f'''{F("sepia")}{obj(skyline(1800, "#6d5440"), 50, 86, "none")}{txt(kt("UN PUEBLO LLAMADO", "l", .2), 50, 26, 80)}{txt(kt("*NOKIA*", "mega", .6, .15, "slam"), 50, 44, 80)}
      {obj(spr("1f3ed", 170), 84, 30, "pop", "bob", 1.2)}<div class="viñeta"></div>'''
    E["k_fusion"] = f'''{F()}{obj(spr("1f4c4", 200), 20, 42, "left", "bob", .2)}{txt('<div class="vs" style="--d:.6s">+</div>', 35, 42, 10)}{obj(spr("1f97e", 200), 50, 42, "pop", "bob", .7)}
      {txt('<div class="vs" style="--d:1s">+</div>', 65, 42, 10)}{obj(spr("1f50c", 200), 80, 42, "right", "bob", 1.1)}{txt(kt("1967: papel + caucho + cables", "xl", 1.4), 50, 76, 90)}'''
    E["k_detodo"] = lista([("1f4c4", "papel"), ("1f97e", "botas de goma"), ("1f6de", "neumáticos"), ("1f50c", "cables")], "NOKIA FABRICABA DE TODO")
    E["k_decision"] = icono_texto("1f4e1", "TODO A LAS *TELECOMUNICACIONES*", "años noventa: la decisión que lo cambia todo", "", "der", "", True, "zoom", "pulse")
    E["k_explota"] = f'''{F("", True)}{"".join(obj(movil(110), x, y, "pop", "bob", .1 + i * .12) for i, (x, y) in enumerate([(14, 30), (28, 62), (42, 28), (58, 64), (72, 30), (86, 62)]))}
      {txt(kt("*EXPLOTA* EL MERCADO", "mega", .9, .12, "slam"), 50, 90, 95)}'''
    E["k_resistente"] = lista([("1f4aa", "resistentes"), ("1f44d", "fáciles"), ("1f4b6", "para todos")], "LA FÓRMULA NOKIA")
    E["k_tercio"] = f'''{F()}{"".join(obj(movil(130, "#9bbc0f" if i == 0 else "#8a8f98"), 30 + i * 20, 46, "pop", "", .2 + i * .2) for i in range(3))}
      {txt(kt("AÑO 2000: *1 DE CADA 3*", "xl", 1.0), 50, 84, 90)}'''
    E["k_40"] = cifra("≈40 %", "DE LOS MÓVILES DEL MUNDO", "1f30d", "hacia 2007, según algunas estimaciones:")
    E["k_4de10"] = f'''{F("", True)}{"".join(obj(movil(90, "#9bbc0f" if i < 4 else "#8a8f98"), 9 + i * 9.1, 44, "pop", "", .1 + i * .1) for i in range(10))}
      {txt(kt("*4 DE CADA 10* ERAN NOKIA", "xl", 1.3), 50, 82, 90)}'''
    E["k_iphone"] = fecha("9", "ENERO", "2007", "Apple presenta el iPhone", "1f4f2")
    E["k_tactil"] = f'''{F()}{obj(tactil(230), 30, 50, "zoom", "float", .2)}{obj(spr("1f446", 160), 30, 70, "pop", "bob", 1.0)}
      {txt(kt("PANTALLA TÁCTIL · SIN TECLADO · *INTERNET*", "l", .6), 68, 46, 54)}'''
    E["k_tarde"] = f'''{F("", True)}{txt(kt("PRIMER NOKIA TÁCTIL:", "l gris", .2), 50, 24, 85)}{txt(kt("OCTUBRE *2008*", "mega", .5, .12, "slam"), 50, 44, 95)}
      {txt(kt("año y medio después", "xl", 1.3), 50, 64, 80)}{obj(spr("1f40c", 200), 84, 80, "left", "bob", 1.6)}'''
    E["k_android"] = comparar("1f916", "Google lanza Android", "1f1f0-1f1f7", "Samsung, a lo grande", "+", "MIENTRAS TANTO…")
    E["k_sistema"] = icono_texto("1f6a7", "SU SISTEMA SE *QUEDABA ATRÁS*", "Nokia seguía con el suyo", "", "izq", "", False, "drop", "shake")
    E["k_elop"] = icono_texto("1f468-200d-1f4bc", "STEPHEN *ELOP*", "nuevo director, venía de Microsoft", "2010", "der", "", True, "up", "bob")
    E["k_correo"] = icono_texto("1f4e7", "UN CORREO *FILTRADO*", "febrero de 2011", "", "izq", "", True, "drop", "shake")
    E["k_llamas"] = f'''{F("dark", True)}{obj(spr("1f6e2-fe0f", 230), 50, 40, "rise", "", .2)}{obj(spr("1f525", 260), 36, 34, "pop", "pulse", .6)}{obj(spr("1f525", 220), 64, 30, "pop", "pulse", .9)}
      {txt(kt("UNA PLATAFORMA *EN LLAMAS*", "xl hueso", 1.0), 50, 78, 90)}'''
    E["k_windows"] = icono_texto("1fa9f", "APUESTA POR *WINDOWS PHONE*", "el sistema de Microsoft", "", "der", "", True, "flip", "bob")
    E["k_samsung"] = flecha("1f4f1", "1f1f0-1f1f7", "2012: SAMSUNG *LA SUPERA*", "el mayor vendedor de móviles del mundo")
    E["k_venta"] = anio(2000, 2013, "septiembre: vende los móviles a Microsoft", "1f91d")
    E["k_5400"] = cifra("≈5.400 M€", "EL ACUERDO, EN TOTAL", "1f4b6", "unos")
    E["k_deja"] = f'''{F("dark", True)}{obj(movil(230), 50, 44, "none", "fuera", .4)}{txt(kt("DEJA DE FABRICAR *SUS MÓVILES*", "xl hueso", .8), 50, 84, 90)}'''
    E["k_hoy"] = icono_texto("1f4e1", "¿Y HOY? *REDES*", "la tecnología detrás de las antenas", "", "izq", "", True, "zoom", "pulse")
    E["k_bolsillo"] = f'''{F("", True)}{obj(spr("1f4e1", 260), 28, 44, "pop", "pulse", .2)}{obj(spr("1f4f6", 180), 46, 26, "pop", "bob", .8)}
      {txt(kt("SIGUE EN TU VIDA…", "xl", .6), 68, 40, 56)}{txt(kt("aunque ya no *en tu bolsillo*", "l", 1.4), 68, 58, 56)}'''
    E["leccion1"] = leccion(1, "ser el número uno no te protege", "PUEDE HACER QUE *TE CONFÍES*", "1f451")
    E["leccion2"] = leccion(2, "si el mercado cambia de reglas", "HACER MEJOR LO DE SIEMPRE *NO BASTA*", "1f504")
    E["leccion3"] = leccion(3, "papel → móviles → redes", "*REINVENTARSE* OTRA VEZ", "1f98b")
    E["k_final"] = lista([("1f4c4", "papel"), ("1f97e", "botas"), ("1f4f1", "móviles"), ("1f4e1", "antenas")], "POCAS EMPRESAS SE HAN REINVENTADO TANTO")
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:70px;top:90px;transform:rotate(-10deg)">{movil(230)}</div>
      <div style="position:absolute;left:300px;top:380px">{vicon("fire", 170)}</div>
      <div class="big" style="top:100px"><div class="s">EL REY DE LOS MÓVILES</div><div class="q" style="font-size:180px;margin-top:22px">¿QUÉ PASÓ?</div><div class="y">DE 40 % A DESAPARECER</div></div>'''
