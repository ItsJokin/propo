"""Escenas del vídeo 17 (Apple, formato largo). Motor común; sin logotipos (ni manzanas): ordenadores y móviles genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f527", 2: "1f6aa", 3: "1f4c9", 4: "1f501", 5: "1f91d", 6: "2702-fe0f", 7: "1f308", 8: "1f3b5", 9: "1f4b0", 10: "1f9e0"}

def ordenador(px=360, pantalla="#3a7bd5", color="#e8e4da"):
    return (f'<svg width="{px}" height="{px*1.05:.0f}" viewBox="0 0 200 210"><rect x="20" y="10" width="160" height="150" rx="16" fill="{color}" stroke="{TINTA}" stroke-width="5"/>'
            f'<rect x="38" y="26" width="124" height="94" rx="6" fill="{pantalla}"/><rect x="70" y="160" width="60" height="24" fill="{color}" stroke="{TINTA}" stroke-width="5"/>'
            f'<rect x="40" y="184" width="120" height="16" rx="6" fill="{color}" stroke="{TINTA}" stroke-width="5"/><rect x="50" y="134" width="40" height="8" rx="3" fill="{GRIS}"/></svg>')

def imac(px=340):
    return (f'<svg width="{px}" height="{px:.0f}" viewBox="0 0 200 200"><defs><linearGradient id="bondi" x1="0" x2="1"><stop offset="0" stop-color="#1fa3a3" stop-opacity=".95"/>'
            f'<stop offset="1" stop-color="#7fe0dc" stop-opacity=".85"/></linearGradient></defs><path d="M30,20 Q100,0 170,20 L180,150 Q100,175 20,150Z" fill="url(#bondi)" stroke="{TINTA}" stroke-width="5"/>'
            f'<rect x="48" y="34" width="104" height="82" rx="6" fill="#1d2b3a"/><path d="M70,170 L130,170 L140,195 L60,195Z" fill="url(#bondi)" stroke="{TINTA}" stroke-width="4"/></svg>')

def movil(px=170):
    return (f'<svg width="{px}" height="{px*2:.0f}" viewBox="0 0 90 180"><rect x="4" y="4" width="82" height="172" rx="14" fill="{TINTA}"/>'
            f'<rect x="10" y="16" width="70" height="146" rx="6" fill="#3a7bd5"/>'
            + "".join(f'<rect x="{16 + (i % 3) * 22}" y="{24 + (i // 3) * 24}" width="14" height="14" rx="4" fill="#fff" opacity=".7"/>' for i in range(12)) + '</svg>')

def cuadro4(d=0.0):
    celdas = [("GRAN PÚBLICO · SOBREMESA", 0, 0), ("PROFESIONAL · SOBREMESA", 1, 0), ("GRAN PÚBLICO · PORTÁTIL", 0, 1), ("PROFESIONAL · PORTÁTIL", 1, 1)]
    return ('<div style="position:relative;width:1320px;height:700px">' + "".join(
        f'<div class="mv e-pop" style="--d:{d + i*.35:.2f}s;position:absolute;left:{x*670}px;top:{y*355}px;width:650px;height:340px;background:{HUESO};border:6px solid {TINTA};border-radius:16px;'
        f'display:flex;align-items:center;justify-content:center;font-family:Bebas;font-size:72px;color:{TINTA};text-align:center;padding:10px">{t}</div>' for i, (t, x, y) in enumerate(celdas)) + '</div>')

def escenas():
    E = {}
    E["ap_valiosa"] = titular("DE LAS MÁS *VALIOSAS* DEL MUNDO", "hoy", "", ("1f4b0", "1f4f1", "1f451", "1f30d"), "", True, "xl")
    E["ap_bolsillos"] = f'''{F("", True)}{"".join(obj(movil(110), 12 + i * 12.5, 46, "drop", "bob", .1 + i * .12) for i in range(7))}{txt(kt("CIENTOS DE MILLONES *DE BOLSILLOS*", "xl", 1.2), 50, 84, 90)}'''
    E["ap_1997"] = impacto("pero en 1997", "ESTUVO A PUNTO *DE DESAPARECER*", "", "1f4c9")
    E["ap_90"] = f'''{F("dark", True)}{txt(odometro(10, 90, .2, 2.0, "mega naranja"), 30, 44, 30)}{txt(kt("DÍAS", "xl hueso", .6), 30, 64, 30)}{txt(kt("de dinero le quedaban, según contaría Steve Jobs", "xl hueso", 1.0), 70, 46, 52)}'''
    E["ap_rival"] = comparar("1f198", "Apple, en apuros", "1f91d", "la ayuda llega… de su gran rival", "?")
    E["ap_historia"] = flecha("1f4c9", "1f4c8", "AL BORDE DE LA QUIEBRA… *Y DE VUELTA*", "")
    E["ap_1976"] = anio(1900, 1976, "abril, California", "1f1fa-1f1f8")
    E["ap_steves"] = comparar("1f468-200d-1f527", "Wozniak: el genio de la electrónica", "1f468-200d-1f4bc", "Jobs: el que veía el negocio", "+", "STEVE Y STEVE")
    E["ap_nombre"] = icono_texto("1f4d6", "¿POR QUÉ *ESE NOMBRE*?", "sencillo, simpático… y antes que Atari en la guía telefónica, según se cuenta", "", "izq", "", True, "pop", "swing")
    E["ap_wayne"] = icono_texto("1f468-200d-1f9b3", "RONALD *WAYNE*", "el tercer socio: el 10 % de la empresa", "", "der", "sepia", False, "up", "bob")
    E["ap_800"] = cifra("≈800 $", "VENDIÓ SU PARTE A LOS POCOS DÍAS", "1f4b5", "asustado por los riesgos,")
    E["ap_arrepiente"] = comparar("1f4b0", "hoy valdría miles de millones", "1f937", "Wayne dice que no se arrepiente", "…")
    E["ap_apple1"] = f'''{F()}<div class="pos" style="left:30%;top:46%;width:440px;height:280px;background:#1f6b3a;border:6px solid {TINTA};border-radius:10px;
      background-image:repeating-linear-gradient(90deg,transparent 0 40px,rgba(255,255,255,.2) 40px 44px),repeating-linear-gradient(0deg,transparent 0 40px,rgba(255,255,255,.2) 40px 44px)"></div>
      {txt(kt("UNA PLACA DE CIRCUITOS", "xl", .6), 72, 36, 50)}{txt(kt("666,66 $", "mega rojo", 1.2, .1, "slam"), 72, 58, 50)}'''
    E["ap_apple2"] = f'''{F("calido", True)}{obj(ordenador(320, "#1d2b22"), 30, 50, "zoom", "", .2)}{txt(kt("EL SEGUNDO: *GRAN ÉXITO*", "xl", .7), 72, 40, 50)}{txt(kt("uno de los primeros ordenadores personales", "l", 1.3), 72, 56, 50)}'''
    E["ap_bolsa"] = icono_texto("1f4c8", "SALE A BOLSA: *MILLONARIOS*", "en pocos años", "", "izq", "", True, "zoom", "glow", 360, (("1f4b0", 86, 80),))
    E["ap_mac"] = f'''{F("", True)}{obj(ordenador(340), 30, 50, "drop", "float", .2)}{txt(kt("1984", "mega rojo", .6, .12, "slam"), 70, 36, 50)}{txt(kt("EL *MACINTOSH*", "xl", 1.1), 70, 56, 50)}'''
    E["ap_anuncio"] = icono_texto("1f3ac", "UN ANUNCIO *DE LEYENDA*", "dirigido por Ridley Scott, en la final del fútbol americano", "", "der", "dark", True, "flip", "bob", 340, (("1f3c8", 14, 80),))
    E["ap_caro"] = comparar("1f5b1-fe0f", "ratón y ventanas: revolucionario", "1f4b8", "pero caro, y vendió menos de lo esperado", "…")
    E["ap_tension"] = impacto("dentro de la empresa,", "CRECEN *LAS TENSIONES*", "", "26a1")
    E["ap_sculley"] = icono_texto("1f468-200d-1f4bc", "JOHN *SCULLEY*", "un ejecutivo que venía de Pepsi", "Jobs ficha como director a", "izq", "", True, "up", "bob", 340, (("1f964", 86, 80),))
    E["ap_agua"] = bocadillos("1f914", ["¿Vender agua con azúcar…", "…o cambiar el mundo?"], "la pregunta con la que Jobs lo convenció, según Sculley")
    E["ap_enfrentados"] = comparar("1f468-200d-1f4bc", "Jobs", "1f468-200d-1f4bc", "Sculley", "VS", "ACABARON ENFRENTADOS")
    E["ap_fuera"] = f'''{F("dark", True)}{obj(spr("1f6aa", 260), 26, 46, "pop", "", .2)}{obj(spr("1f6b6", 200), 42, 54, "left", "", .7)}{txt(kt("1985", "l naranja", .5), 68, 30, 56)}{txt(kt("JOBS SE MARCHA *DE SU PROPIA EMPRESA*", "xl hueso", .9), 68, 50, 58)}'''
    E["ap_next"] = comparar("1f4bb", "funda NeXT", "1f3ac", "compra el estudio que será Pixar", "+", "FUERA DE APPLE")
    E["ap_sinjobs"] = icono_texto("1f4b5", "SIN JOBS, *SIGUE GANANDO*", "durante unos años", "", "izq", "", False, "pop", "bob")
    E["ap_cambio"] = impacto("en los noventa", "EL MUNDO *CAMBIA*", "", "1f30e")
    E["ap_windows"] = f'''{F()}{obj(spr("1fa9f", 230), 18, 44, "pop", "bob", .2)}{"".join(obj(ordenador(140, "#3a7bd5", "#cfd3da"), 40 + i * 14, 46, "drop", "", .4 + i * .15) for i in range(4))}
      {txt(kt("WINDOWS: MUCHOS FABRICANTES, *MÁS BARATOS*", "xl", 1.2), 50, 82, 90)}'''
    E["ap_modelos"] = f'''{F()}{"".join(txt(f'<div class="mono" style="font-size:52px">{m}</div>', 14 + (i % 4) * 24, 26 + (i // 4) * 18, 22, "center", .1 + i * .1, "pop") for i, m in enumerate(["5200", "6400", "4400", "7600", "8500", "9600", "6360", "5500", "7300", "8600", "7220", "4400/200"]))}
      {txt(kt("DEMASIADOS MODELOS, *NOMBRES CONFUSOS*", "xl", 1.4), 50, 88, 90)}'''
    E["ap_clones"] = f'''{F("", True)}{obj(ordenador(220), 20, 46, "pop", "", .2)}{"".join(obj(ordenador(160, "#3a7bd5", "#cfd3da"), 46 + i * 16, 48, "pop", "", .6 + i * .2) for i in range(3))}
      {txt(kt("CLONES DE OTRAS EMPRESAS: *LE QUITABAN VENTAS*", "xl", 1.4), 50, 84, 90)}'''
    E["ap_directores"] = f'''{F()}{"".join(obj(spr("1f468-200d-1f4bc", 170), 20 + i * 20, 44, "drop", "fuera" if i < 3 else "bob", .2 + i * .5) for i in range(4))}{txt(kt("DIRECTORES, UNO DETRÁS DE OTRO", "xl", 1.2), 50, 80, 90)}'''
    E["ap_pierde"] = cifra("−CIENTOS DE M$", "Y UNA CUOTA DE MERCADO QUE SE DESPLOMA", "1f4c9", "a mediados de los noventa")
    E["ap_sistema"] = icono_texto("2699-fe0f", "NECESITA UN *SISTEMA OPERATIVO*", "desesperadamente", "", "izq", "", True, "spin", "spin-slow")
    E["ap_be"] = comparar("1f41d", "¿comprar Be?", "1f4bb", "¿comprar NeXT?", "o")
    E["ap_compra_next"] = cifra("≈400 M$", "APPLE COMPRA NEXT", "1f91d", "la elegida:")
    E["ap_asesor"] = flecha("1f4bb", "1f3e2", "JOBS VUELVE, *COMO ASESOR*", "finales de 1996")
    E["ap_provisional"] = icono_texto("1f468-200d-1f4bc", "JOBS, AL FRENTE *(PROVISIONAL)*", "el consejo destituye al director", "pocos meses después", "der", "", True, "up", "pulse")
    E["ap_critico"] = impacto("lo que se encontró:", "UNA EMPRESA *EN ESTADO CRÍTICO*", "", "1f3e5")
    E["ap_90dias"] = f'''{F("dark", True)}{txt(kt("≈90", "mega naranja", .3, .1, "slam"), 30, 44, 30)}{txt(kt("DÍAS", "xl hueso", .7), 30, 62, 30)}{txt(kt("para quedarse sin dinero", "xl hueso", 1.1), 70, 46, 50)}{obj(spr("23f3", 170), 70, 74, "pop", "swing", 1.6)}'''
    E["ap_boston"] = fecha("6", "AGOSTO", "1997", "una feria de Apple en Boston", "1f3a4")
    E["ap_150"] = cifra("150 M$", "MICROSOFT INVIERTE EN APPLE", "1f91d", "el anuncio que nadie esperaba:")
    E["ap_office"] = icono_texto("1f4c4", "SU PAQUETE DE OFICINA, *PARA MAC*", "al menos durante cinco años", "", "der", "", True, "pop", "bob")
    E["ap_gates"] = f'''{F("dark", True)}<div class="pos" style="left:50%;top:44%;width:1000px;height:560px;background:#1d2b3a;border:12px solid #444;border-radius:12px"></div>
      {obj(spr("1f468-200d-1f4bc", 300), 50, 42, "zoom", "", .4)}{txt(kt("EN LA PANTALLA GIGANTE: *BILL GATES*", "xl hueso", 1.0), 50, 88, 90)}'''
    E["ap_abucheo"] = f'''{F("dark", True)}{"".join(obj(spr(c, 170), x, 60, "up", "shake", .1 + i * .15) for i, (c, x) in enumerate([("1f620", 14), ("1f62e", 30), ("1f44e", 46), ("1f620", 62), ("1f44e", 78)]))}
      {txt(kt("PARTE DEL PÚBLICO *ABUCHEA*", "xl hueso", .8), 50, 26, 90)}'''
    E["ap_enemigo"] = icono_texto("1f494", "PACTAR *CON EL ENEMIGO*", "así lo vivieron muchos fans", "", "izq", "", False, "pop", "shake")
    E["ap_calma"] = icono_texto("1f54a-fe0f", "QUE GANE UNO *NO EXIGE* QUE PIERDA EL OTRO", "lo que vino a decir Jobs desde el escenario", "", "der", "", True, "drop", "float")
    E["ap_confianza"] = titular("MÁS QUE DINERO: *CONFIANZA*", "Apple no iba a desaparecer", "", ("1f91d", "1f4aa", "2705", "1f4c8"), "", True, "xl")
    E["ap_eliminar"] = impacto("otra decisión radical:", "ELIMINAR *CASI TODO*", "", "2702-fe0f")
    E["ap_70"] = cifra("≈70 %", "DEL CATÁLOGO, FUERA", "1f5d1-fe0f")
    E["ap_cuadro"] = f'''{F()}{obj(cuadro4(.2), 50, 50, "none")}'''
    E["ap_cuatro"] = f'''{F("", True)}{txt(kt("4", "mega rojo", .2, .1, "slam"), 50, 40, 30)}{txt(kt("PRODUCTOS. *NADA MÁS*", "xl", .8), 50, 64, 80)}'''
    E["ap_sinclones"] = icono_texto("1f6ab", "SE ACABARON *LOS CLONES*", "si quieres un Mac, cómpraselo a Apple", "", "izq", "", True, "pop", "")
    E["ap_think"] = f'''{F("dark", True)}{"".join(obj(spr(c, 150), x, 30, "pop", "float", .2 + i * .25) for i, (c, x) in enumerate([("1f9d1-200d-1f52c", 18), ("1f9d1-200d-1f3a8", 39), ("1f9d1-200d-1f680", 61), ("1f3bb", 82)]))}
      {txt(kt("«PIENSA *DIFERENTE*»", "mega naranja", .9, .12, "slam"), 50, 62, 90)}{txt(kt("figuras históricas que cambiaron el mundo", "l hueso", 1.6), 50, 80, 90)}'''
    E["ap_idea"] = comparar("1f4e6", "no anunciaba un producto", "1f4a1", "anunciaba una idea", "≠")
    E["ap_imac"] = f'''{F("", True)}{obj(imac(360), 30, 50, "zoom", "float", .2)}{txt(kt("1998", "l gris", .4), 70, 30, 50)}{txt(kt("EL *IMAC*", "mega", .8, .12, "slam"), 70, 48, 50)}{txt(kt("lo que la empresa necesitaba", "l", 1.5), 70, 64, 50)}'''
    E["ap_color"] = f'''{F()}{"".join(obj(ordenador(150, "#3a3f47", "#b9bdc4"), 12 + i * 13, 44, "pop", "", .1 + i * .1) for i in range(4))}{obj(imac(260), 78, 46, "drop", "bob", 1.0)}
      {txt(kt("TODOS GRISES… Y UNO *DE COLORES*", "xl", 1.4), 50, 84, 90)}'''
    E["ap_ive"] = icono_texto("1f468-200d-1f3a8", "JONY *IVE*", "un joven diseñador británico que sería una leyenda", "detrás del diseño:", "izq", "", True, "up", "bob", 340, (("1f1ec-1f1e7", 86, 22),))
    E["ap_i"] = f'''{F("", True)}{txt('<div class="mega rojo" style="font-size:340px">i</div>', 26, 46, 20, "center", .2, "flip")}{txt(kt("DE *INTERNET*", "xl", .8), 66, 40, 56)}{txt(kt("conectarse a la red, fácil", "l", 1.4), 66, 56, 56)}{obj(spr("1f310", 170), 66, 76, "pop", "spin-slow", 1.8)}'''
    E["ap_beneficios"] = icono_texto("1f4c8", "VUELVEN *LOS BENEFICIOS*", "el iMac se vendió muy bien", "", "der", "calido", True, "zoom", "bob")
    E["ap_entusiasmo"] = titular("SE VUELVE A HABLAR *CON ENTUSIASMO*", "", "", ("1f60d", "1f4ac", "2728", "1f44f"), "", True, "xl")
    E["ap_mejor"] = impacto("pero lo mejor", "ESTABA *POR LLEGAR*", "", "1f680")
    E["ap_stores"] = comparar("1f3ec", "2001: sus propias tiendas («un error», decían)", "1f4b0", "de las más rentables del mundo", "→")
    E["ap_ipod"] = f'''{F("", True)}{obj(spr("1f3a7", 260), 26, 46, "pop", "bob", .2)}{txt(kt("2001", "l gris", .4), 66, 28, 56)}{txt(kt("MIL CANCIONES *EN EL BOLSILLO*", "xl", .8), 66, 46, 58)}{obj(spr("1f3b6", 150), 84, 72, "pop", "float", 1.4)}'''
    E["ap_tienda"] = comparar("1f3b5", "canciones sueltas, legales", "1f3f4-200d-2620-fe0f", "en plena época de la piratería", "VS")
    E["ap_iphone"] = f'''{F("dark", True)}{obj(movil(220), 30, 50, "zoom", "float", .2)}{txt(kt("ENERO DE 2007", "l naranja", .5), 68, 32, 56)}{txt(kt("EL *IPHONE*", "mega hueso", 1.0, .12, "slam"), 68, 52, 56)}'''
    E["ap_industria"] = titular("CAMBIÓ *TODA LA INDUSTRIA*", "no solo a Apple", "", ("1f4f1", "1f30d", "1f4f8", "1f3b5"))
    E["ap_jobs_muere"] = f'''{F("dark", True)}{obj(spr("1f56f-fe0f", 230), 28, 46, "pop", "glow", .2)}{txt(kt("OCTUBRE DE 2011", "l naranja", .4), 66, 32, 56)}{txt(kt("STEVE JOBS MUERE. LA EMPRESA QUE SALVÓ *YA ERA OTRA*", "xl hueso", .9), 66, 52, 58)}'''
    E["ap_billon"] = cifra("1 BILLÓN $", "2018: LA PRIMERA EMPRESA DE EE. UU. EN LLEGAR", "1f4b0", "valor en bolsa")
    E["ap_tres"] = cifra("+3 BILLONES $", "UNOS AÑOS DESPUÉS", "1f680")
    E["ap_piensalo"] = f'''{F("", True)}{txt(kt("90 DÍAS", "mega gris", .2, .1, "slam"), 26, 44, 40)}{txt('<div class="vs" style="--d:.8s">→</div>', 50, 44, 10)}{txt(kt("BILLONES", "mega rojo", 1.2, .1, "slam"), 74, 44, 40)}{txt(kt("una de las más valiosas de la historia", "l", 1.8), 50, 72, 80)}'''
    E["ap_productos"] = lista([("1f4f1", "teléfonos"), ("1f4bb", "ordenadores"), ("231a", "relojes"), ("1f3a7", "auriculares")], "HOY VENDE…")
    E["ap_ms_vende"] = icono_texto("1f4b5", "¿Y LOS *150 MILLONES*?", "Microsoft vendió aquellas acciones unos años después", "", "izq", "", False, "pop", "bob")
    E["ap_rivales"] = comparar("1f4bb", "un rival", "1fa9f", "el otro", "⇄", "DÉCADAS DE CONVIVENCIA")
    E["leccion1"] = leccion(1, "para salvarte, a veces hay que hacer", "*MENOS* COSAS, NO MÁS", "2702-fe0f")
    E["leccion2"] = leccion(2, "aceptar la ayuda de un rival", "NO ES RENDIRSE: *ES SEGUIR EN PIE*", "1f91d")
    E["leccion3"] = leccion(3, "una empresa no vende solo productos", "VENDE *UNA IDEA*", "1f4a1")
    E["ap_final"] = lista([("1f527", "un garaje"), ("1f6aa", "un despido"), ("23f3", "90 días"), ("1f91d", "un rival"), ("1f308", "un ordenador de colores")], "")
    E["ap_salvo"] = titular("ASÍ SE *SALVÓ*", "", "", ("1f4c8", "2728", "1f4bb", "1f4f1"))
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:130px">{ordenador(320)}</div>
      <div style="position:absolute;left:260px;top:440px">{vicon("hourglass-not-done", 150)}</div>
      <div class="big" style="top:100px"><div class="s">APPLE ESTUVO A</div><div class="q" style="font-size:200px;margin-top:22px">90 DÍAS</div><div class="q" style="font-size:120px">DE QUEBRAR</div><div class="y">ASÍ SE SALVÓ</div></div>'''
