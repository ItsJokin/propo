"""Escenas del vídeo 20 (Nike, formato largo). Motor común; sin logotipos (no se dibuja el símbolo real): zapatillas y objetos genéricos."""
from base import *

CAP_ICONOS = {1: "1f4dd", 2: "1f3c3", 3: "1f697", 4: "1f494", 5: "270f-fe0f", 6: "1f9c7", 7: "1f3c0", 8: "1f4e2", 9: "2696-fe0f",
              10: "1f30d", 11: "1f9e0"}

def caja_zapas(px=200, color=NARANJA):
    return (f'<svg width="{px}" height="{px*0.6:.0f}" viewBox="0 0 200 120"><rect x="10" y="30" width="180" height="80" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="4" y="18" width="192" height="22" fill="{color}" stroke="{TINTA}" stroke-width="4"/><rect x="70" y="60" width="60" height="22" rx="4" fill="{HUESO}"/></svg>')

def suela(px=360):
    celdas = "".join(f'<rect x="{30 + (i % 8) * 22}" y="{24 + (i // 8) * 22}" width="16" height="16" rx="3" fill="#3a3f47"/>' for i in range(32))
    return f'<svg width="{px}" height="{px*0.55:.0f}" viewBox="0 0 230 125"><path d="M10,60 C10,10 220,10 220,60 C220,115 10,115 10,60Z" fill="#6b7078" stroke="{TINTA}" stroke-width="4"/>{celdas}</svg>'

def garabato(px=420, d=0.2):
    return (f'<svg width="{px}" height="{px*0.45:.0f}" viewBox="0 0 200 90"><path class="draw" style="--d:{d}s;--len:400" d="M15,60 C40,75 80,70 110,55 C140,40 165,25 190,12" '
            f'fill="none" stroke="{TINTA}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 0"/></svg>')

def escenas():
    E = {}
    E["ni_zapatillas"] = f'''{F("", True)}{obj(spr("1f45f", 280), 30, 46, "drop", "bob", .2)}{txt(kt("UN SÍMBOLO MUY CONCRETO *EN EL LATERAL*", "xl", .8), 70, 44, 52)}'''
    E["ni_grande"] = titular("LA MARCA DEPORTIVA *MÁS GRANDE*", "del mundo", "", ("1f45f", "1f3c6", "1f30d", "26bd"), "", True, "xl")
    E["ni_inicio"] = lista([("1f4dd", "un trabajo de clase"), ("1f1ef-1f1f5", "un viaje a Japón"), ("1f697", "un maletero")], "EMPEZÓ CON…")
    E["ni_35"] = comparar("270f-fe0f", "un logotipo de 35 $", "1f9c7", "una suela hecha en una gofrera", "+")
    E["ni_nombre"] = impacto("y estuvo a punto de", "LLAMARSE *DE OTRA FORMA*", "", "1f914")
    E["ni_historia"] = titular("LA HISTORIA *COMPLETA*", "", "", ("1f45f", "1f3c3", "2728", "1f4d6"))
    E["ni_knight"] = icono_texto("1f3c3", "PHIL *KNIGHT*", "corredor de la Universidad de Oregón", "", "izq", "", True, "left", "bob")
    E["ni_alemanas"] = icono_texto("1f1e9-1f1ea", "LAS MEJORES ERAN *ALEMANAS*", "y caras", "el problema:", "der", "", False, "pop", "bob", 300)
    E["ni_stanford"] = icono_texto("1f4dd", "UN *TRABAJO DE CLASE*", "en la Universidad de Stanford", "", "izq", "", True, "drop", "swing")
    E["ni_camaras"] = comparar("1f4f7", "cámaras japonesas vs alemanas", "1f45f", "¿y con las zapatillas?", "=", "CALIDAD, MÁS BARATO")
    E["ni_comprobar"] = impacto("y decidió", "COMPROBARLO *EN PERSONA*", "", "1f9d0")
    E["ni_japon"] = flecha("1f1fa-1f1f8", "1f1ef-1f1f5", "1962: VIAJE *A JAPÓN*", "visita la fábrica de Onitsuka Tiger")
    E["ni_blueribbon"] = f'''{F("", True)}{obj(spr("1f3c5", 260), 26, 46, "pop", "swing", .2)}{txt(kt("«¿QUÉ EMPRESA REPRESENTA?»", "l", .5), 66, 30, 56)}{txt(kt("*BLUE RIBBON*", "mega", 1.0, .12, "slam"), 66, 48, 56)}{txt(kt("un nombre inventado sobre la marcha, según sus memorias", "l", 1.7), 66, 66, 56)}'''
    E["ni_derechos"] = icono_texto("1f4dc", "VENDERLAS *EN EL OESTE DE EE. UU.*", "y su empresa todavía no existía", "", "izq", "", False, "flip", "")
    E["ni_muestras"] = flecha("1f4e6", "1f468-200d-1f3eb", "UNAS MUESTRAS *A SU ENTRENADOR*", "")
    E["ni_bowerman"] = icono_texto("1f468-200d-1f3eb", "BILL *BOWERMAN*", "entrenador legendario, obsesionado con el calzado", "", "der", "", True, "up", "bob", 340, (("23f1-fe0f", 14, 80),))
    E["ni_gramo"] = f'''{F()}{obj(spr("2696-fe0f", 230), 24, 46, "pop", "swing", .2)}{txt(kt("CADA GRAMO, *ENERGÍA PERDIDA*", "xl", .7), 66, 38, 58)}{txt(kt("fabricaba zapatillas a mano para sus corredores", "l", 1.4), 66, 56, 58)}'''
    E["ni_socio"] = icono_texto("1f91d", "LE PROPONE *SER SU SOCIO*", "", "", "izq", "calido", True, "pop", "")
    E["ni_1964"] = f'''{F("", True)}{txt(kt("ENERO DE 1964", "l gris", .1), 50, 18, 80)}{txt(kt("500 $", "mega rojo", .3, .1, "slam"), 26, 42, 30)}{txt('<div class="vs" style="--d:.8s">+</div>', 50, 42, 10)}{txt(kt("500 $", "mega rojo", 1.1, .1, "slam"), 74, 42, 30)}
      {txt(kt("NACE *BLUE RIBBON SPORTS*", "xl", 1.6), 50, 72, 90)}'''
    E["ni_pareja"] = comparar("1f4bc", "olfato para los negocios", "1f527", "obsesión por mejorar", "+")
    E["ni_sintiendas"] = icono_texto("1f6ab", "NI TIENDAS *NI OFICINAS*", "al principio", "", "izq", "", False, "pop", "")
    E["ni_coche"] = f'''{F("", True)}{obj(spr("1f697", 300), 36, 56, "left", "", .2)}{"".join(obj(caja_zapas(110), 28 + i * 7, 32, "drop", "", .6 + i * .2) for i in range(3))}{txt(kt("A LAS *COMPETICIONES*", "xl", 1.2), 76, 44, 40)}'''
    E["ni_maletero"] = icono_texto("1f3c3", "VENTA DIRECTA, *DESDE EL MALETERO*", "a los propios corredores", "", "der", "", True, "pop", "bob")
    E["ni_contable"] = icono_texto("1f9ee", "Y SEGUÍA *DE CONTABLE*", "para poder pagar las facturas", "", "izq", "", False, "pop", "bob")
    E["ni_johnson"] = icono_texto("2709-fe0f", "JEFF *JOHNSON*", "el primer empleado: cartas larguísimas a los clientes", "", "der", "", True, "up", "bob")
    E["ni_tienda"] = comparar("1f3ea", "la primera tienda", "1f5c3-fe0f", "datos de cada cliente", "+")
    E["ni_depende"] = icono_texto("26a0-fe0f", "UN SOLO *PROVEEDOR*", "dependía por completo de la marca japonesa", "", "izq", "", False, "pop", "shake")
    E["ni_rompe"] = impacto("principios de los setenta:", "LA RELACIÓN *SE ROMPE*", "", "1f494")
    E["ni_otros"] = icono_texto("1f575-fe0f", "BUSCABAN *OTROS DISTRIBUIDORES*", "y planeaban dejarlos fuera, según Knight", "", "der", "", False, "pop", "")
    E["ni_sinzapas"] = comparar("1f465", "clientes y vendedores", "1f4e6", "pero sin zapatillas", "…")
    E["ni_propia"] = titular("SU *PROPIA MARCA*", "la decisión más arriesgada", "", ("1f45f", "1f525", "1f4aa", "2728"))
    E["ni_legal"] = icono_texto("2696-fe0f", "BATALLA LEGAL… *Y LA GANAN*", "", "", "izq", "", True, "drop", "swing")
    E["ni_necesita"] = comparar("1f3f7-fe0f", "un nombre", "270f-fe0f", "un símbolo", "+", "UNA MARCA NUEVA NECESITA…")
    E["ni_dimension"] = f'''{F("", True)}{txt(kt("«DIMENSION SIX»", "mega", .3, .12, "slam"), 50, 38, 90)}{txt(kt("la idea de Knight. A casi nadie le gustaba", "xl", 1.0), 50, 60, 90)}{obj(spr("1f62c", 170), 86, 80, "pop", "bob", 1.6)}'''
    E["ni_sueno"] = icono_texto("1f4ad", "LA IDEA LLEGÓ *EN UN SUEÑO*", "a Jeff Johnson, según contó Knight", "", "izq", "dark", True, "pop", "float")
    E["ni_diosa"] = f'''{F("calido", True)}{obj(spr("1f3db-fe0f", 260), 26, 46, "rise", "", .2)}{txt(kt("*NIKE*", "mega", .6, .15, "slam"), 66, 36, 56)}{txt(kt("diosa griega de la victoria", "xl", 1.2), 66, 54, 56)}{txt(kt("corto · fácil · con una K con fuerza", "l", 1.8), 66, 70, 56)}'''
    E["ni_davidson"] = icono_texto("1f469-200d-1f3a8", "CAROLYN *DAVIDSON*", "estudiante de diseño en Portland", "el símbolo:", "der", "", True, "up", "bob")
    E["ni_swoosh"] = f'''{F()}{obj(garabato(520), 34, 48, "none", "", .2)}{txt(kt("UNA CURVA QUE *SUGIERE MOVIMIENTO*", "xl", 1.0), 74, 42, 46)}'''
    E["ni_35b"] = cifra("35 $", "LO QUE COBRÓ", "1f4b5")
    E["ni_gustando"] = bocadillos("1f914", ["No me encanta…", "…pero quizá me acabe gustando"], "frase atribuida a Knight")
    E["ni_anillo"] = comparar("1f48d", "un anillo de oro con el símbolo", "1f4c8", "y un paquete de acciones", "+", "1983: EL REGALO")
    E["ni_experimenta"] = icono_texto("1f52c", "BOWERMAN *SEGUÍA EXPERIMENTANDO*", "", "", "izq", "", True, "pop", "swing")
    E["ni_suela"] = comparar("1f9f2", "que agarre en cualquier superficie", "1fab6", "sin pesar demasiado", "+", "UNA SUELA QUE…")
    E["ni_gofrera"] = f'''{F("calido", True)}{obj(spr("1f9c7", 260), 26, 46, "drop", "bob", .2)}{txt(kt("UN DESAYUNO… Y *LA GOFRERA*", "xl", .7), 66, 38, 56)}{txt(kt("de su mujer, según la historia de la marca", "l", 1.4), 66, 56, 56)}'''
    E["ni_cuadricula"] = f'''{F()}<div class="pos" style="left:30%;top:48%;width:380px;height:380px;border-radius:30px;background:#c98a3a;border:8px solid {TINTA};
      background-image:repeating-linear-gradient(90deg,transparent 0 50px,#8a5a2a 50px 62px),repeating-linear-gradient(0deg,transparent 0 50px,#8a5a2a 50px 62px)"></div>
      {obj(spr("1f4a1", 200), 50, 26, "pop", "glow", .8)}{txt(kt("UNA CUADRÍCULA *DE PEQUEÑOS BLOQUES*", "xl", 1.2), 74, 54, 44)}'''
    E["ni_goma"] = f'''{F("dark", True)}{obj(spr("1f9c7", 230), 30, 46, "pop", "shake", .2)}{obj(spr("1f4a5", 200), 46, 34, "pop", "", 1.0)}{txt(kt("GOMA LÍQUIDA → *GOFRERA DESTROZADA*", "xl hueso", .8), 70, 48, 52)}'''
    E["ni_waffle"] = f'''{F("", True)}{obj(suela(420), 32, 48, "flip", "float", .2)}{txt(kt("LA SUELA *TIPO GOFRE*", "xl", .8), 74, 40, 46)}{txt(kt("de las primeras zapatillas de éxito", "l", 1.4), 74, 56, 46)}'''
    E["ni_reliquia"] = icono_texto("1f3c6", "HOY, CASI *UNA RELIQUIA*", "aquella gofrera estropeada", "", "der", "calido", True, "zoom", "glow")
    E["ni_baloncesto"] = comparar("1f4c8", "en los ochenta, ya era grande", "1f3c0", "pero en baloncesto no mandaba", "…")
    E["ni_1984"] = f'''{F("", True)}{obj(spr("1f3c0", 260), 26, 46, "drop", "jump", .2)}{txt(kt("1984", "mega rojo", .6, .1, "slam"), 66, 30, 56)}{txt(kt("*MICHAEL JORDAN*", "xl", 1.0), 66, 50, 56)}{txt(kt("aún no había jugado en la NBA", "l", 1.6), 66, 64, 56)}'''
    E["ni_otra"] = icono_texto("1f914", "PREFERÍA *OTRA MARCA*", "y su entorno le convenció para escuchar a Nike, según se ha contado", "", "izq", "", False, "pop", "swing")
    E["ni_linea"] = titular("SU PROPIA LÍNEA, *CON SU NOMBRE*", "algo poco habitual", "", ("1f45f", "2b50", "1f3c0", "1f3f7-fe0f"), "", True, "xl")
    E["ni_airjordan"] = f'''{F("calido", True)}{obj(spr("1f45f", 300), 30, 48, "zoom", "bob", .2)}{txt(kt("1985", "l gris", .4), 70, 30, 52)}{txt(kt("*AIR JORDAN*", "mega", .8, .12, "slam"), 70, 48, 56)}'''
    E["ni_prohibidas"] = icono_texto("1f6ab", "«LA LIGA LAS *PROHIBIÓ*»", "una polémica que la marca usó en su publicidad", "", "der", "dark", True, "pop", "shake")
    E["ni_ventas"] = icono_texto("1f4c8", "VENTAS *POR ENCIMA DE TODO*", "la línea Jordan, un negocio enorme por sí sola", "", "izq", "", True, "zoom", "bob")
    E["ni_justdoit"] = f'''{F("dark", True)}{txt(kt("1988", "l naranja", .2), 50, 22, 80)}{txt(kt("«JUST *DO IT*»", "mega hueso", .5, .15, "slam"), 50, 44, 90)}{txt(kt("simplemente, hazlo", "xl naranja", 1.3), 50, 64, 80)}'''
    E["ni_wieden"] = icono_texto("1f468-200d-1f4bc", "DAN *WIEDEN*", "de la agencia de publicidad de la marca", "lo creó", "izq", "", True, "up", "bob")
    E["ni_origen"] = icono_texto("1f4ac", "UN ORIGEN *SORPRENDENTE*", "las últimas palabras de un condenado: «hagámoslo», según contó Wieden", "", "der", "dark", False, "pop", "")
    E["ni_palabra"] = flecha("1f4ac", "1f4aa", "CAMBIÓ UNA PALABRA → *MOTIVACIÓN*", "para millones de personas")
    E["ni_superarse"] = comparar("1f45f", "no hablaba de zapatillas", "1f3d4-fe0f", "hablaba de superarse", "≠")
    E["ni_crisis"] = impacto("años noventa:", "SU PEOR *CRISIS DE IMAGEN*", "", "1f4c9")
    E["ni_fabricas"] = icono_texto("1f3ed", "FÁBRICAS *DE OTRAS EMPRESAS*", "en países con salarios muy bajos", "", "izq", "", False, "pop", "")
    E["ni_denuncias"] = icono_texto("1f4f0", "MALAS CONDICIONES *DE TRABAJO*", "denunciadas por investigaciones periodísticas", "", "der", "", False, "drop", "swing")
    E["ni_boicots"] = bocadillos("1f4e2", ["¡Boicot!", "¡Salarios justos!", "¡Condiciones dignas!"], "protestas y campañas en universidades")
    E["ni_reconoce"] = icono_texto("1f399-fe0f", "KNIGHT *LO RECONOCE*", "1998: anuncia cambios en sus fábricas proveedoras", "", "izq", "", True, "pop", "bob")
    E["ni_debate"] = comparar("1f4cb", "publica información sobre sus fábricas", "2696-fe0f", "el debate del sector sigue abierto", "…")
    E["ni_mayor"] = cifra("Nº 1", "EN ROPA Y CALZADO DEPORTIVO", "1f3c6", "hoy:")
    E["ni_patrocina"] = lista([("1f3c3", "atletas"), ("26bd", "equipos"), ("1f3c0", "selecciones")], "PATROCINA A…")
    E["ni_memorias"] = icono_texto("1f4d6", "MEMORIAS, *CON TODAS SUS DUDAS*", "Knight deja la presidencia en 2016", "", "der", "", True, "flip", "bob")
    E["ni_simbolo"] = f'''{F("calido", True)}{obj(garabato(460, .1), 34, 48, "none")}{txt(kt("UN GARABATO DE 35 $…", "xl", .6), 72, 36, 50)}{txt(kt("*DE LOS SÍMBOLOS MÁS RECONOCIDOS*", "xl", 1.2), 72, 56, 50)}'''
    E["leccion1"] = leccion(1, "depender de un solo proveedor", "ES PELIGROSO (Y PERDERLO, *UNA OPORTUNIDAD*)", "26a0-fe0f")
    E["leccion2"] = leccion(2, "un símbolo no vale por lo que cuesta", "SINO POR *LO QUE SIGNIFICA*", "270f-fe0f")
    E["leccion3"] = leccion(3, "las grandes ideas salen de…", "UN TRABAJO, UN SUEÑO… *O UNA GOFRERA*", "1f9c7")
    E["ni_final"] = lista([("1f4dd", "un trabajo de clase"), ("1f1ef-1f1f5", "Japón"), ("1f697", "un maletero"), ("270f-fe0f", "35 $"), ("1f9c7", "una gofrera")], "")
    E["ni_nacio"] = titular("ASÍ *NACIÓ*", "", "", ("1f45f", "1f3c3", "2728", "1f3c6"))
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:130px">{vicon("running-shoe", 330)}</div>
      <div style="position:absolute;left:250px;top:430px">{vicon("automobile", 170)}</div>
      <div class="big" style="top:100px"><div class="s">EMPEZÓ VENDIENDO</div><div class="q" style="font-size:150px;margin-top:22px">DESDE UN</div><div class="q" style="font-size:180px">COCHE</div><div class="y">LA HISTORIA DE NIKE</div></div>'''
