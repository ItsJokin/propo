"""Escenas del vídeo 28 (Kellogg's, formato largo). Motor común; sin logotipos ni personajes de marca: cajas y cuencos genéricos."""
from base import *

CAP_ICONOS = {1: "1f3e5", 2: "26a0-fe0f", 3: "1f468", 4: "1f33e", 5: "1f575-fe0f", 6: "1f36c", 7: "2696-fe0f", 8: "1f477",
              9: "1f42f", 10: "2702-fe0f", 11: "1f9e0"}

def caja_cereal(px=220, color=ROJO, texto="COPOS"):
    return (f'<svg width="{px}" height="{px*1.45:.0f}" viewBox="0 0 110 160"><rect x="8" y="8" width="94" height="146" rx="4" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="8" y="8" width="94" height="30" fill="#fff" opacity=".85"/><text x="55" y="31" font-family="Bebas" font-size="22" fill="{TINTA}" text-anchor="middle">{texto}</text>'
            f'<ellipse cx="55" cy="110" rx="34" ry="20" fill="#fff"/><ellipse cx="55" cy="104" rx="30" ry="12" fill="#f2c94c"/></svg>')

def cuenco(px=260):
    copos = "".join(f'<ellipse cx="{40 + (i*17) % 120}" cy="{40 + (i*7) % 14}" rx="10" ry="6" fill="#e9b44c" stroke="#a36a1a" stroke-width="1.5" transform="rotate({i*37} {40 + (i*17) % 120} {40 + (i*7) % 14})"/>' for i in range(12))
    return (f'<svg width="{px}" height="{px*0.6:.0f}" viewBox="0 0 200 120"><ellipse cx="100" cy="46" rx="88" ry="20" fill="#fdfaf2"/>{copos}'
            f'<path d="M12,46 C12,110 188,110 188,46" fill="#5aa0e8" stroke="{TINTA}" stroke-width="4"/><ellipse cx="100" cy="46" rx="88" ry="20" fill="none" stroke="{TINTA}" stroke-width="4"/></svg>')

def escenas():
    E = {}
    E["ke_cuenco"] = f'''{F("calido", True)}{obj(cuenco(380), 30, 52, "drop", "", .2)}{obj(spr("1f95b", 160), 44, 24, "drop", "swing", .7)}{txt(kt("EL DESAYUNO DE *MILLONES*", "xl", 1.0), 72, 46, 50)}'''
    E["ke_sanatorio"] = comparar("1f373", "no nació en una cocina", "1f3e5", "sino en un sanatorio", "≠")
    E["ke_hermanos"] = comparar("1f468-200d-2695-fe0f", "un hermano", "1f468-200d-1f4bc", "el otro", "VS", "DÉCADAS SIN HABLARSE")
    E["ke_medico"] = comparar("1f468-200d-2695-fe0f", "un médico famoso, de ideas extrañas", "1f468", "el hermano pequeño ignorado", "/")
    E["ke_paciente"] = icono_texto("1f575-fe0f", "UN PACIENTE *COPIÓ LA IDEA*", "y se hizo millonario antes que ellos", "", "izq", "", True, "pop", "bob")
    E["ke_historia"] = titular("CAMBIÓ LA FORMA *DE DESAYUNAR*", "del mundo", "", ("1f963", "1f95b", "1f33d", "2728"), "", True, "xl")
    E["ke_battle"] = f'''{F("sepia")}{obj(skyline(1800, "#6d5440"), 50, 86, "none")}{txt(kt("BATTLE CREEK", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("Michigan, finales del siglo XIX", "l", 1.1), 50, 48, 80)}<div class="viñeta"></div>'''
    E["ke_john"] = icono_texto("1f468-200d-2695-fe0f", "JOHN HARVEY *KELLOGG*", "uno de los médicos más famosos de Estados Unidos", "", "izq", "sepia", False, "up", "bob")
    E["ke_balneario"] = icono_texto("1f3e5", "UN ENORME *SANATORIO*", "una especie de balneario médico para gente adinerada", "", "der", "", True, "rise", "")
    E["ke_religion"] = lista([("1f6ab", "sin alcohol"), ("1f6ad", "sin tabaco"), ("1f966", "vegetariana")], "UNA VIDA MUY SANA, SEGÚN SU COMUNIDAD RELIGIOSA")
    E["ke_tratamientos"] = lista([("1f3cb-fe0f", "ejercicios"), ("1f6c1", "baños"), ("1f4a1", "luz"), ("26a1", "electricidad")], "TRATAMIENTOS")
    E["ke_sosa"] = icono_texto("1f610", "COMIDA SENCILLA… *Y SOSA*", "fácil de digerir", "", "izq", "", False, "pop", "")
    E["ke_desayuno"] = comparar("1f969", "desayuno típico: carne, huevos, grasas", "1f963", "el doctor quería cambiarlo", "→")
    E["ke_preocupantes"] = impacto("también tenía ideas que hoy nos parecen", "MUY *PREOCUPANTES*", "", "26a0-fe0f")
    E["ke_impulsos"] = icono_texto("1f9e0", "COMIDA SOSA PARA *CONTROLAR LOS IMPULSOS*", "y tratamientos muy discutibles", "creía:", "izq", "dark", False, "pop", "")
    E["ke_eugenesia"] = icono_texto("274c", "APOYÓ LA *EUGENESIA*", "un movimiento hoy considerado racista y profundamente equivocado", "", "der", "dark", False, "pop", "")
    E["ke_historiadores"] = icono_texto("1f4da", "LO HAN ESTUDIADO *LOS HISTORIADORES*", "aunque la marca no suele contarlo", "", "izq", "", True, "flip", "bob")
    E["ke_sosos"] = titular("POR ESO ERAN *TAN SOSOS*", "aquellos primeros cereales", "", ("1f963", "1f610", "1f33e", "2753"), "", True, "xl")
    E["ke_will"] = icono_texto("1f468", "WILL KEITH *KELLOGG*", "el hermano pequeño", "", "izq", "sepia", False, "up", "bob")
    E["ke_contabilidad"] = lista([("1f9ee", "contabilidad"), ("1f4cb", "gestión"), ("1f9f9", "lo que hiciera falta")], "SE ENCARGABA DE…")
    E["ke_ayudante"] = bocadillos("1f468-200d-2695-fe0f", ["¡Apunta esto!", "¡Y esto otro!", "¡Mientras me afeito!"], "casi como a un ayudante, según sus biógrafos")
    E["ke_aguanta"] = icono_texto("1f614", "MAL PAGADO *Y A LA SOMBRA*", "aguantó durante años", "", "der", "", False, "pop", "")
    E["ke_talento"] = impacto("pero tenía algo que John no tenía:", "TALENTO *PARA LOS NEGOCIOS*", "", "1f4bc")
    E["ke_digerir"] = icono_texto("1f33e", "UN ALIMENTO *FÁCIL DE DIGERIR*", "a base de cereales", "buscaban", "izq", "", True, "pop", "bob")
    E["ke_descuido"] = impacto("según la historia más conocida,", "UN *DESCUIDO*", "", "1f605")
    E["ke_reposar"] = icono_texto("23f3", "TRIGO COCIDO, *REPOSANDO DE MÁS*", "más tiempo del previsto", "", "der", "", True, "pop", "swing")
    E["ke_rodillos"] = f'''{F()}<div class="pos" style="left:30%;top:40%;width:400px;height:90px;border-radius:45px;background:#9aa0a8;border:5px solid {TINTA}"></div>
      <div class="pos" style="left:30%;top:56%;width:400px;height:90px;border-radius:45px;background:#9aa0a8;border:5px solid {TINTA}"></div>
      {"".join(obj(spr("1f7e1", 50), 20 + i * 5, 74 + (i % 2) * 4, "drop", "", .8 + i * .1) for i in range(6))}{txt(kt("POR LOS RODILLOS… *Y SALEN COPOS*", "xl", .9), 74, 46, 44)}'''
    E["ke_tostados"] = icono_texto("1f525", "TOSTADOS: *GUSTAN A LOS PACIENTES*", "", "", "izq", "calido", True, "pop", "pulse")
    E["ke_versiones"] = comparar("1f468-200d-2695-fe0f", "¿mérito de John?", "1f468", "¿mérito de Will?", "?", "VARIAS VERSIONES")
    E["ke_patente"] = cifra("1896", "PATENTE DEL PROCESO DE LOS COPOS", "1f4dc")
    E["ke_maiz"] = f'''{F("calido", True)}{obj(spr("1f33d", 260), 26, 46, "pop", "bob", .2)}{txt(kt("COPOS *DE MAÍZ*", "xl", .6, .12, "slam"), 66, 40, 56)}{txt(kt("los famosos corn flakes", "l", 1.3), 66, 58, 56)}'''
    E["ke_post"] = icono_texto("1f9d1-200d-1f4bc", "CHARLES WILLIAM *POST*", "un paciente del sanatorio", "", "izq", "", True, "up", "bob")
    E["ke_negocio"] = icono_texto("1f4a1", "LO ENTENDIÓ *ANTES QUE NADIE*", "aquello podía ser un gran negocio", "", "der", "calido", True, "pop", "glow")
    E["ke_monta"] = flecha("1f3e5", "1f3ed", "SU PROPIA EMPRESA, *EN LA MISMA CIUDAD*", "")
    E["ke_cafe"] = comparar("2615", "un sustituto del café, de cereales", "1f963", "y luego, sus propios cereales", "→")
    E["ke_uvas"] = comparar("1f347", "ni uvas…", "1f330", "…ni nueces", "+", "UN NOMBRE CON TRAMPA")
    E["ke_millonario"] = cifra("MILLONARIO", "EN MUY POCOS AÑOS, CON MUCHA PUBLICIDAD", "1f4b0", "Post:")
    E["ke_capital"] = f'''{F()}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{"".join(obj(caja_cereal(90, c), 12 + i * 11, 40, "drop", "", .1 + i * .1) for i, c in enumerate([ROJO, AZUL, VERDE, NARANJA, "#8e44ad", ROJO, AZUL, VERDE]))}
      {txt(kt("LA CAPITAL MUNDIAL *DE LOS CEREALES*", "xl", 1.2), 50, 14, 90)}'''
    E["ke_medico2"] = comparar("1f48a", "para el doctor: un alimento médico", "1f4b0", "para otros: un negocio", "≠")
    E["ke_azucar"] = icono_texto("1f36c", "WILL QUIERE *AÑADIR AZÚCAR*", "para que gustaran a mucha más gente", "", "izq", "", True, "pop", "bob")
    E["ke_inaceptable"] = icono_texto("1f620", "PARA JOHN: *INACEPTABLE*", "el azúcar iba contra todo lo que defendía", "", "der", "", False, "pop", "shake")
    E["ke_discusiones"] = impacto("discusiones", "CADA VEZ *MÁS FUERTES*", "", "1f4a2")
    E["ke_1906"] = anio(1900, 1906, "Will funda su propia empresa de copos de maíz tostados", "1f3ed")
    E["ke_muestras"] = lista([("1f36c", "azúcar y malta"), ("1f4e2", "publicidad agresiva"), ("1f6aa", "muestras puerta a puerta")], "")
    E["ke_firma"] = f'''{F("calido", True)}{obj(caja_cereal(240), 28, 50, "drop", "", .2)}<svg class="pos" style="left:28%;top:40%" width="200" height="60" viewBox="0 0 200 60"><path class="draw" style="--d:.8s;--len:500" d="M10,40 C30,0 50,60 70,30 C90,0 100,50 120,30 C140,10 150,45 190,20" fill="none" stroke="{TINTA}" stroke-width="5"/></svg>
      {txt(kt("SU FIRMA *EN CADA CAJA*", "xl", .9), 68, 40, 54)}{txt(kt("la firma se convirtió en la marca", "l", 1.5), 68, 56, 54)}'''
    E["ke_apellido"] = impacto("un problema:", "LOS DOS QUERÍAN *EL APELLIDO*", "", "1f3f7-fe0f")
    E["ke_empresa_john"] = icono_texto("1f3e2", "JOHN TAMBIÉN TENÍA *SU EMPRESA*", "de alimentos, con el mismo apellido", "", "izq", "", False, "pop", "")
    E["ke_tribunales"] = comparar("1f468-200d-2695-fe0f", "John", "1f468", "Will", "VS", "A LOS TRIBUNALES")
    E["ke_1920"] = cifra("1920", "LA JUSTICIA DA LA RAZÓN AL HERMANO PEQUEÑO", "2696-fe0f")
    E["ke_nohablan"] = icono_texto("1f494", "APENAS VOLVIERON *A HABLARSE*", "", "", "der", "dark", True, "pop", "")
    E["ke_carta"] = icono_texto("2709-fe0f", "UNA CARTA *QUE NO LLEGÓ A TIEMPO*", "ya muy mayor, John quiso reconciliarse, según se cuenta", "", "izq", "dark", False, "drop", "float")
    E["ke_mueren"] = comparar("1f56f-fe0f", "John: 1943", "1f56f-fe0f", "Will: 1951", "·")
    E["ke_ideas"] = impacto("Will resultó ser un empresario", "CON IDEAS *MUY PROPIAS*", "", "1f4a1")
    E["ke_seis"] = f'''{F("", True)}{obj(reloj(300), 28, 48, "pop", "", .2)}{txt(kt("JORNADAS DE *SEIS HORAS*", "xl", .7), 70, 38, 54)}{txt(kt("en la Gran Depresión, para contratar a más gente en más turnos", "l", 1.3), 70, 56, 54)}'''
    E["ke_publicidad"] = comparar("1f4c9", "otras recortaban publicidad", "1f4e2", "él la aumentó", "VS")
    E["ke_fundacion"] = icono_texto("1f9d2", "UNA FUNDACIÓN *PARA LA INFANCIA*", "a la que dejó gran parte de su fortuna", "", "izq", "calido", True, "pop", "bob")
    E["ke_grande"] = titular("DE LAS FUNDACIONES *MÁS GRANDES*", "de Estados Unidos", "", ("1f9d2", "1f49b", "1f3eb", "2728"), "", True, "xl")
    E["ke_supermercado"] = f'''{F()}{"".join(obj(caja_cereal(120, c, t), 8 + i * 12, 46, "drop", "", .1 + i * .12) for i, (c, t) in enumerate([(ROJO, "COPOS"), (AZUL, "ARROZ"), ("#5b3a1e", "CACAO"), (NARANJA, "MIEL"), (VERDE, "AVENA"), ("#8e44ad", "FRUTAS"), (ROJO, "COPOS"), (AZUL, "FIBRA")]))}
      {txt(kt("SUPERMERCADOS *LLENOS DE CEREALES*", "xl", 1.3), 50, 84, 90)}'''
    E["ke_variedad"] = lista([("1f36c", "con azúcar"), ("1f35a", "arroz inflado"), ("1f36b", "chocolate")], "")
    E["ke_personajes"] = lista([("1f42f", "un tigre"), ("1f9dd", "unos duendes"), ("1f413", "un gallo")], "PERSONAJES PARA CONQUISTAR A LOS NIÑOS")
    E["ke_tigre"] = icono_texto("1f42f", "1952: *EL TIGRE*", "uno de los personajes publicitarios más famosos", "", "izq", "calido", True, "pop", "jump")
    E["ke_infantil"] = flecha("1f3e5", "1f9d2", "DEL SANATORIO… *AL DESAYUNO INFANTIL*", "")
    E["ke_criticas"] = icono_texto("1f36c", "DEMASIADO *AZÚCAR*", "los nutricionistas recomiendan moderación", "las críticas:", "der", "", False, "pop", "shake")
    E["ke_ironia"] = comparar("1f468-200d-2695-fe0f", "un médico obsesionado con lo sano", "1f36c", "y cereales llenos de azúcar", "…", "UNA IRONÍA")
    E["ke_divide"] = cifra("2023", "LA EMPRESA KELLOGG SE DIVIDE EN DOS", "2702-fe0f")
    E["ke_partes"] = comparar("1f963", "cereales en Norteamérica", "1f37f", "aperitivos y resto del mundo", "|")
    E["ke_mars"] = icono_texto("1f36b", "MARS *ANUNCIA LA COMPRA*", "de esa segunda empresa, por decenas de miles de millones", "", "izq", "", True, "zoom", "bob")
    E["ke_siglo"] = flecha("1f33e", "1f4d6", "MÁS DE UN SIGLO DESPUÉS… *LA HISTORIA SIGUE*", "")
    E["leccion1"] = leccion(1, "inventar algo", "NO TE CONVIERTE *EN SU DUEÑO*", "1f575-fe0f")
    E["leccion2"] = leccion(2, "un mismo producto", "MEDICINA *O NEGOCIO*", "1f48a")
    E["leccion3"] = leccion(3, "las peleas familiares", "PUEDEN DURAR *MÁS QUE LAS EMPRESAS*", "1f494")
    E["ke_final"] = lista([("1f3e5", "un sanatorio"), ("1f468-200d-2695-fe0f", "un médico"), ("1f468", "un hermano"), ("1f33e", "un trigo olvidado")], "")
    E["ke_leche"] = f'''{F("calido", True)}{obj(cuenco(360), 30, 54, "drop", "", .2)}{obj(spr("1f95b", 160), 40, 26, "drop", "swing", .6)}{txt(kt("YA SABES *CÓMO EMPEZÓ TODO*", "xl", 1.0), 72, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:130px">{vicon("hospital", 240)}</div>
      <div style="position:absolute;left:220px;top:380px">{cuenco(320)}</div>
      <div class="big" style="top:100px"><div class="s">LOS CEREALES NACIERON</div><div class="q" style="font-size:170px;margin-top:22px">EN UN</div><div class="q" style="font-size:170px">SANATORIO</div><div class="y">LA HISTORIA DE KELLOGG'S</div></div>'''
