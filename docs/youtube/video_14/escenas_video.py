"""Escenas del vídeo 14 (Cola Cao). Motor común; sin logotipos ni envases reales. No se muestra ni se reproduce la canción antigua."""
from base import *

CAP_ICONOS = {1: "1f46c", 2: "1f4fb", 3: "1f3c5", 4: "1f944", 5: "1f9e0"}

def bote(px=220, color="#FFD23F", texto="CACAO"):
    return (f'<svg width="{px}" height="{px*1.3:.0f}" viewBox="0 0 100 130"><rect x="12" y="20" width="76" height="104" rx="10" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="8" y="8" width="84" height="18" rx="5" fill="{ROJO}" stroke="{TINTA}" stroke-width="4"/><rect x="12" y="58" width="76" height="30" fill="{ROJO}"/>'
            f'<text x="50" y="80" font-family="Bebas" font-size="22" fill="#fff" text-anchor="middle">{texto}</text></svg>')

def taza(px=240, grumos=False):
    g = "".join(f'<circle cx="{x}" cy="{y}" r="5" fill="#5b3a1e"/>' for x, y in [(36, 34), (58, 30), (70, 38), (48, 40)]) if grumos else ""
    return (f'<svg width="{px}" height="{px*0.85:.0f}" viewBox="0 0 120 102"><path d="M18,24 L94,24 L88,92 C86,98 80,100 74,100 L38,100 C32,100 26,98 24,92Z" fill="{HUESO}" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M94,40 C112,40 112,72 90,72" fill="none" stroke="{TINTA}" stroke-width="6"/><ellipse cx="56" cy="32" rx="34" ry="8" fill="#8a5a3b"/>{g}</svg>')

def escenas():
    E = {}
    E["c_taza"] = f'''{F("calido", True)}{obj(taza(300), 28, 52, "drop", "", .2)}{obj(spr("1f944", 170), 36, 24, "drop", "swing", .7)}
      {txt(kt("LECHE · DOS CUCHARADAS · *A REMOVER*", "l", .6), 70, 40, 50)}{txt(kt("y si no… *GRUMOS*", "xl", 1.5), 70, 58, 50)}'''
    E["c_generaciones"] = icono_texto("1f46a", "EL DESAYUNO DE *GENERACIONES*", "millones de personas en España", "", "izq", "", True, "up", "bob", 360, (("2615", 86, 80),))
    E["c_historia"] = lista([("1f3da-fe0f", "posguerra"), ("1f46c", "dos cuñados"), ("1f3c5", "olimpiadas")], "DETRÁS DEL BOTE")
    E["c_cancion"] = impacto("y una canción publicitaria que hoy", "NADIE *EMITIRÍA*", "", "1f4fb")
    E["c_gracia"] = f'''{F("sepia")}{obj(skyline(1800, "#6d5440"), 50, 86, "none")}{txt(kt("BARCELONA", "mega", .3, .1, "slam"), 50, 32, 95)}{txt(kt("barrio de Gràcia · años cuarenta", "l", 1.1), 50, 50, 80)}<div class="viñeta"></div>'''
    E["c_cunados"] = comparar("1f468-200d-1f4bc", "José María Ventura", "1f468-200d-1f4bc", "José Ignacio Ferrero", "+", "DOS CUÑADOS · NUTREXPA")
    E["c_1945"] = f'''{F("", True)}{obj(spr("1f4dd", 230), 24, 46, "pop", "bob", .2)}{txt(kt("1945", "mega rojo", .5, .12, "slam"), 64, 34, 60)}{txt(kt("registran una marca nueva:", "l", 1.1), 64, 52, 60)}{txt(kt("*COLA CAO*", "xl", 1.6), 64, 66, 60)}'''
    E["c_1946"] = f'''{F("calido", True)}{obj(bote(250), 28, 50, "zoom", "bob", .2)}{txt(kt("1946: A LA VENTA", "xl", .7), 70, 38, 52)}{txt(kt("cacao soluble para mezclar con leche", "l", 1.4), 70, 54, 52)}'''
    E["c_posguerra"] = icono_texto("1f3da-fe0f", "LA *POSGUERRA*", "escasez y cartillas de racionamiento", "", "izq", "sepia", False, "drop", "")
    E["c_publico"] = lista([("1f4aa", "nutritivo"), ("1f36b", "dulce"), ("1f9d2", "para los niños")], "UN PÚBLICO ENORME")
    E["c_salto"] = titular("EL GRAN SALTO: *LA PUBLICIDAD*", "", "", ("1f4e2", "1f4fb", "2728", "1f4c8"))
    E["c_radio"] = f'''{F("sepia", True)}{obj(spr("1f4fb", 280), 28, 48, "pop", "pulse", .2)}{obj(spr("1f3b6", 160), 42, 26, "pop", "float", .8)}
      {txt(kt("AÑOS 50: UNA CANCIÓN *EN LA RADIO*", "xl", .6), 70, 42, 52)}{txt(kt("famosísima", "l", 1.4), 70, 58, 52)}<div class="viñeta"></div>'''
    E["c_memoria"] = icono_texto("1f9e0", "GENERACIONES *SE LA SABÍAN*", "de memoria", "", "der", "", True, "pop", "bob")
    E["c_estereotipo"] = icono_texto("26a0-fe0f", "ESTEREOTIPOS *RACIALES*", "hoy se consideran ofensivos", "su letra presentaba un personaje con", "izq", "dark", False, "pop", "")
    E["c_deja"] = f'''{F("dark", True)}{obj(spr("1f4fb", 260), 50, 40, "none", "fuera", .5)}{txt(kt("LA MARCA *DEJÓ DE UTILIZARLA*", "xl hueso", 1.0), 50, 80, 90)}'''
    E["c_mirada"] = comparar("1f4fb", "la publicidad refleja su época", "1f440", "y la mirada de la sociedad cambia", "→")
    E["c_deporte"] = impacto("la otra gran jugada:", "EL *DEPORTE*", "", "1f3c3")
    E["c_munich"] = f'''{F("", True)}{obj(spr("1f3c5", 260), 24, 46, "drop", "bob", .2)}{txt(kt("1972", "mega rojo", .5, .12, "slam"), 64, 30, 60)}{txt(kt("patrocina al *EQUIPO OLÍMPICO*", "xl", 1.0), 64, 50, 62)}{txt(kt("Juegos de Múnich", "l", 1.6), 64, 66, 60)}'''
    E["c_olimpicos"] = titular("«EL ALIMENTO *DE LOS OLÍMPICOS*»", "", "", ("1f3c5", "1f947", "1f3c3", "2b50"), "calido")
    E["c_ado"] = f'''{F()}{obj(spr("1f3df-fe0f", 240), 24, 46, "rise", "", .2)}{txt(kt("1988: PROGRAMA *ADO*", "xl", .6), 66, 38, 56)}{txt(kt("con la vista puesta en Barcelona 92", "l", 1.3), 66, 54, 56)}'''
    E["c_campeones"] = flecha("1f3c6", "1f9d2", "SI LOS CAMPEONES LO TOMAN…", "…tus hijos también deberían")
    E["c_despensa"] = f'''{F()}{obj(bote(200), 26, 50, "pop", "bob", .2)}{obj(bote(200, "#f0e2c0", "CACAO"), 50, 50, "pop", "bob", .5)}{obj(bote(200, "#cfe3ff", "CACAO"), 74, 50, "pop", "bob", .8)}
      {txt(kt("NO ESTÁ *SOLO* EN LA DESPENSA", "xl", 1.2), 50, 86, 90)}'''
    E["c_rivalidad"] = comparar("1f944", "un cacao soluble", "1f944", "otro cacao soluble", "VS", "UNA RIVALIDAD DE SUPERMERCADO")
    E["c_grumos"] = f'''{F("", True)}{obj(taza(300, True), 30, 52, "zoom", "", .2)}{txt(kt("¿GRUMOS SÍ", "xl", .7, .12, "slam"), 72, 38, 50)}{txt(kt("O *GRUMOS NO*?", "xl", 1.3, .12, "slam"), 72, 54, 50)}'''
    E["c_odia"] = comparar("1f922", "hay quien los odia", "1f60b", "y quien los busca a propósito", "/")
    E["c_nocilla"] = icono_texto("1f6d2", "NUTREXPA *SIGUE CRECIENDO*", "compra otras marcas, como Nocilla", "", "izq", "", True, "pop", "bob")
    E["c_idilia"] = icono_texto("1f3e2", "HOY: *IDILIA FOODS*", "la heredera de Nutrexpa", "", "der", "", True, "zoom", "bob")
    E["leccion1"] = leccion(1, "un producto sencillo en el momento adecuado", "UN HÁBITO PARA *GENERACIONES*", "2615")
    E["leccion2"] = leccion(2, "asocia tu marca a lo que la gente admira", "VALE MÁS QUE *UN ESLOGAN*", "1f3c5")
    E["leccion3"] = leccion(3, "lo normal en una época", "OTRA PUEDE VERLO *INACEPTABLE*", "1f504")
    E["c_final"] = f'''{F("calido", True)}{obj(bote(240), 24, 50, "drop", "bob", .2)}{obj(taza(220), 46, 58, "pop", "", .6)}
      {txt(kt("CASI *80 AÑOS* DE DESAYUNOS", "xl", 1.0), 76, 46, 44)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:50px;top:110px;transform:rotate(-8deg)">{bote(260)}</div>
      <div style="position:absolute;left:260px;top:380px">{taza(240, True)}</div>
      <div class="big" style="top:100px"><div class="s">EL DESAYUNO DE ESPAÑA</div><div class="q" style="font-size:170px;margin-top:22px">NACIÓ EN</div><div class="q" style="font-size:170px">GRÀCIA</div><div class="y">LA HISTORIA DE COLA CAO</div></div>'''
