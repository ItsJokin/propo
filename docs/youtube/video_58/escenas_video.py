"""Escenas del vídeo 58 (especial Navidad: Playmobil). Motor común; sin logotipos ni figuras reales: muñequitos genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f6e2-fe0f", 2: "1fa9a", 3: "1f3aa", 4: "1f1ea-1f1f8", 5: "1f3f0", 6: "1f3ed", 7: "1f381", 8: "1f4c9", 9: "1f9e0"}

def munequito(w=150, color="#2E86DE", pelo="#5b3a1e", d=.2):
    """Figurita genérica de juguete: cabeza grande y sonrisa simple (no reproduce ninguna figura comercial)."""
    an = "" if d is None else f"animation:ePop .45s ease {d}s both;"
    return (f'<svg width="{w}" height="{w*1.7:.0f}" viewBox="0 0 100 170" style="{an}">'
            f'<rect x="28" y="62" width="44" height="50" rx="8" fill="{color}" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="12" y="66" width="16" height="36" rx="7" fill="{color}" stroke="{TINTA}" stroke-width="3"/><rect x="72" y="66" width="16" height="36" rx="7" fill="{color}" stroke="{TINTA}" stroke-width="3"/>'
            f'<circle cx="20" cy="108" r="8" fill="#f6d3a8" stroke="{TINTA}" stroke-width="3"/><circle cx="80" cy="108" r="8" fill="#f6d3a8" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="30" y="112" width="18" height="50" rx="4" fill="#333" stroke="{TINTA}" stroke-width="3"/><rect x="52" y="112" width="18" height="50" rx="4" fill="#333" stroke="{TINTA}" stroke-width="3"/>'
            f'<circle cx="50" cy="36" r="26" fill="#f6d3a8" stroke="{TINTA}" stroke-width="3"/>'
            f'<path d="M24,32 Q24,8 50,8 Q76,8 76,32 L76,26 Q70,18 50,18 Q30,18 24,26Z" fill="{pelo}" stroke="{TINTA}" stroke-width="3"/>'
            f'<circle cx="41" cy="36" r="3" fill="{TINTA}"/><circle cx="59" cy="36" r="3" fill="{TINTA}"/><path d="M40,46 Q50,54 60,46" stroke="{TINTA}" stroke-width="3" fill="none"/></svg>')

def grupo(n=5, w=140, y=62, d=.2):
    cols = [("#2E86DE", "#5b3a1e"), ("#D7263D", "#e2b13c"), ("#2BB673", "#222"), ("#F5B700", "#8a4b1a"), ("#7a4fd1", "#3a2a1a")]
    return "".join(obj(munequito(w, *cols[i % 5], d + i * .15), 50 + (i - (n - 1) / 2) * 14, y, "none", "bob", 0) for i in range(n))

def escenas():
    E = {}
    E["pl_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f381", "2744-fe0f", "1f3f0"), "navidad", True, "mega")
    E["pl_figura"] = f'''{F("calido", True)}{obj(munequito(400), 26, 52, "none", "bob", 0)}{txt(kt("7,5 CM *Y UNA SONRISA*", "xl", .6), 66, 42, 50)}{txt(kt("manos en forma de C y pelo intercambiable", "l naranja", 1.3), 66, 58, 50)}'''
    E["pl_tuviste"] = lista([("1f6e1-fe0f", "un caballero"), ("1f3f4-200d-2620-fe0f", "un pirata"), ("1f692", "un bombero"), ("1f920", "un vaquero")], "SEGURO QUE TUVISTE ALGUNO")
    E["pl_clicks"] = f'''{F("navidad", True)}{grupo(5, 210, 62)}{txt(kt("LOS *CLICKS* DE FAMOBIL", "xl hueso", .4), 50, 20, 90)}'''
    E["pl_petroleo"] = impacto("y todo empieza con", "UNA CRISIS *DEL PETRÓLEO*", "", "1f6e2-fe0f")
    E["pl_historia"] = titular("LA HISTORIA *DE PLAYMOBIL*", "", "", ("1f3f0", "1f6e2-fe0f", "1fa9a", "1f1ea-1f1f8"), "navidad", True, "xl")
    E["pl_geobra"] = icono_texto("1f3ed", "GEOBRA *BRANDSTÄTTER*", "una empresa familiar de Zirndorf, cerca de Núremberg", "Alemania", "izq", "", False, "pop", "bob", 380, (("1f1e9-1f1ea", 84, 20),))
    E["pl_hula"] = icono_texto("2b55", "LOS *HULA HOOPS*", "productos grandes, de mucho plástico", "años cincuenta y sesenta", "der", "calido", True, "pop", "spin-slow")
    E["pl_crisis"] = cifra("1973", "LA CRISIS DEL PETRÓLEO", "1f6e2-fe0f")
    E["pl_caro"] = flecha("1f6e2-fe0f", "1f4b8", "PETRÓLEO CARO = *PLÁSTICO CARO*", "")
    E["pl_rentable"] = icono_texto("1f4c9", "LOS JUGUETES GRANDES, *YA NO SALEN A CUENTA*", "", "", "izq", "dark", False, "pop", "")
    E["pl_pequeno"] = lista([("1f90f", "pequeño"), ("267b-fe0f", "poco plástico"), ("1f4b0", "que se venda bien")], "HORST BRANDSTÄTTER NECESITA ALGO…")
    E["pl_beck"] = icono_texto("1fa9a", "HANS *BECK*", "jefe de desarrollo", "el encargo", "izq", "sepia", False, "up", "bob")
    E["pl_aviones"] = comparar("1fa9a", "ebanista de formación", "2708-fe0f", "aficionado al modelismo", "+", "")
    E["pl_ninos"] = bocadillos("1f468-200d-1f4bc", ["¿Aviones?", "…mejor figuras para niños"], "según se cuenta")
    E["pl_observa"] = lista([("1f590-fe0f", "que quepan en la mano"), ("270a", "fáciles de agarrar"), ("1f4ad", "para inventar historias")], "OBSERVANDO A LOS NIÑOS")
    E["pl_diseno"] = f'''{F()}{obj(munequito(400, "#D7263D", "#e2b13c"), 26, 52, "none", "bob", 0)}{txt(kt("CABEZA GRANDE, *SIN NARIZ*", "xl", .6), 66, 42, 50)}{txt(kt("manos en pinza para sujetar cualquier cosa", "l naranja", 1.3), 66, 58, 50)}'''
    E["pl_cualquiera"] = titular("UNA FIGURA *QUE PODÍA SER CUALQUIERA*", "brazos y piernas que se mueven, pelo y sombreros que se cambian", "", ("1f477", "1f46e", "1f9d1-200d-1f692", "1f478"))
    E["pl_1974"] = cifra("1974", "SE PRESENTA EN LA FERIA DEL JUGUETE DE NÚREMBERG", "1f3aa")
    E["pl_sets"] = lista([("1f6e1-fe0f", "caballeros"), ("1fab6", "nativos americanos"), ("1f477", "obreros")], "LOS TRES PRIMEROS SETS")
    E["pl_feria"] = comparar("1f644", "comerciantes escépticos", "1f1f3-1f1f1", "un distribuidor neerlandés se arriesga", "PERO", "SEGÚN SE CUENTA")
    E["pl_exito"] = icono_texto("1f9d2", "LOS NIÑOS *HICIERON EL RESTO*", "aunque a los adultos les parecían demasiado simples", "", "der", "calido", True, "pop", "jump")
    E["pl_negocio"] = comparar("267b-fe0f", "poco plástico por figura", "1f501", "siempre querían otro set", "+", "UN NEGOCIO GENIAL")
    E["pl_espana"] = impacto("y en España…", "UN GIRO *MUY CURIOSO*", "", "1f1ea-1f1f8")
    E["pl_1976"] = cifra("1976", "LLEGA A ESPAÑA DE LA MANO DE FAMOSA, DE ONIL", "1f69a")
    E["pl_famobil"] = f'''{F("navidad", True)}{txt(kt("*FAMO*SA + PLAY*MOBIL*", "xl hueso", .3), 50, 38, 90)}{txt(kt("= *FAMOBIL*", "mega hueso", 1.4), 50, 60, 90)}'''
    E["pl_onil"] = icono_texto("1f3d8-fe0f", "FABRICADOS *EN ONIL*", "en el Valle del Juguete… y llamados «clicks»", "Alicante", "izq", "calido", True, "pop", "bob")
    E["pl_generacion"] = f'''{F("calido", True)}{grupo(4, 220, 62)}{txt(kt("TODA UNA GENERACIÓN *DE LOS CLICKS*", "xl", .4), 50, 20, 90)}'''
    E["pl_iberica"] = cifra("1983", "NACE PLAYMOBIL IBÉRICA Y FAMOBIL VA DESAPARECIENDO", "1f504")
    E["pl_mundos"] = impacto("con los años,", "MUNDOS *ENTEROS*", "", "1f30d")
    E["pl_lista"] = lista([("1f3f4-200d-2620-fe0f", "piratas"), ("1f3f0", "castillos"), ("1f693", "comisarías"), ("1f69c", "granjas"), ("1f680", "el espacio")], "UN MUNDO PARA CADA NIÑO")
    E["pl_mezclar"] = comparar("1f6e1-fe0f", "un caballero…", "1f3f4-200d-2620-fe0f", "…en un barco pirata", "+", "LA MISMA FIGURA: SE PUEDE MEZCLAR")
    E["pl_sistema"] = titular("NO VENDÍAN JUGUETES: *VENDÍAN UN SISTEMA*", "cada pieza nueva encaja con todo lo anterior", "", ("1f9e9", "1f3f0", "1f6a2", "2728"))
    E["pl_millones"] = cifra("+2.700 MILLONES", "DE FIGURAS VENDIDAS EN 2009, SEGÚN LA PRENSA", "1f9d2")
    E["pl_reparte"] = impacto("para fabricar tantas figuras,", "VARIOS *PAÍSES*", "", "1f3ed")
    E["pl_malta"] = lista([("1f1e9-1f1ea", "Alemania"), ("1f1f2-1f1f9", "Malta"), ("1f1ea-1f1f8", "Onil (España)"), ("1f1e8-1f1ff", "República Checa")], "FÁBRICAS EN…")
    E["pl_parque"] = icono_texto("1f3a2", "UN PARQUE *A TAMAÑO REAL*", "barcos piratas y castillos para entrar", "junto a su sede de Zirndorf", "der", "calido", True, "pop", "bob")
    E["pl_horst"] = cifra("2015", "MUERE HORST BRANDSTÄTTER", "1f56f-fe0f")
    E["pl_fundacion"] = icono_texto("1f3db-fe0f", "EN MANOS *DE UNA FUNDACIÓN*", "ni fondos ni bolsa", "según la propia empresa", "izq", "", False, "pop", "bob")
    E["pl_navidad"] = titular("SI HAY UNA ÉPOCA EN QUE BRILLA, *ES LA NAVIDAD*", "", "", ("1f384", "1f381", "1f3f0", "2728"), "navidad", True, "xl")
    E["pl_cajas"] = lista([("1f4e6", "cajas grandes y coloridas"), ("1f30d", "un mundo dentro"), ("1f4b6", "de pequeñas a enormes")], "PERFECTO PARA REGALAR")
    E["pl_adviento"] = icono_texto("1f4c5", "CALENDARIOS *DE ADVIENTO*", "una sorpresa cada día de diciembre", "", "izq", "navidad", True, "pop", "bob")
    E["pl_belen"] = f'''{F("navidad", True)}{obj(spr("1f6d6", 220), 50, 40, "pop", "bob", .2)}{grupo(3, 170, 70, .6)}{txt(kt("¡HASTA *SU PROPIO BELÉN*!", "xl hueso", .4), 50, 14, 90)}'''
    E["pl_reyes"] = cifra("6 DE ENERO", "EN ESPAÑA, LA TEMPORADA FUERTE SE ALARGA", "1f451")
    E["pl_moda"] = comparar("1f468", "jugaba con un barco pirata en los 80", "1f9d2", "se lo regala a su hijo 30 años después", "→", "NO PASA DE MODA")
    E["pl_inmortal"] = impacto("pero ningún juguete", "ES *INMORTAL*", "", "23f3")
    E["pl_pantallas"] = lista([("1f3ae", "videojuegos"), ("1f4f1", "móviles"), ("1f9f1", "otros juguetes de construcción")], "LA COMPETENCIA")
    E["pl_pelicula"] = cifra("2019", "SU PROPIA PELÍCULA… Y UN FRACASO EN TAQUILLA", "1f3ac")
    E["pl_recortes"] = icono_texto("1f4c9", "DIFICULTADES *Y RECORTES*", "en los últimos años", "", "der", "dark", False, "pop", "")
    E["pl_onil_cierre"] = cifra("2023", "FIN DE LA PRODUCCIÓN EN ONIL, TRAS CASI MEDIO SIGLO", "1f3ed", "se mantienen logística y ventas, según la prensa")
    E["pl_dejaba"] = comparar("1f3ed", "Onil deja de fabricarlos", "1f50e", "los coleccionistas los buscan", "PERO", "")
    E["leccion1"] = leccion(1, "una crisis de materias primas", "*PUEDE OBLIGARTE A INVENTAR ALGO MEJOR*", "1f6e2-fe0f")
    E["leccion2"] = leccion(2, "un sistema vale más", "*QUE UN PRODUCTO SUELTO*", "1f9e9")
    E["leccion3"] = leccion(3, "observar a tus clientes", "*ES LA MEJOR INVESTIGACIÓN*", "1f440")
    E["pl_final"] = lista([("2b55", "un hula hoop"), ("1f6e2-fe0f", "una crisis"), ("1fa9a", "un ebanista"), ("1f3aa", "una feria"), ("1f3d8-fe0f", "un pueblo de Alicante")], "")
    E["pl_sonrisa"] = f'''{F("navidad", True)}{obj(munequito(400, "#2BB673", "#222"), 26, 52, "none", "bob", 0)}{txt(kt("YA SABES DE DÓNDE VIENE *ESA SONRISA*", "xl hueso", .6), 66, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:60px;top:190px">{munequito(220, "#D7263D", "#e2b13c", None)}</div>
      <div style="position:absolute;left:290px;top:250px">{munequito(180, "#2E86DE", "#5b3a1e", None)}</div>
      <div style="position:absolute;left:400px;top:150px">{vicon("oil-drum", 120)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">LOS CLICKS</div><div class="q" style="font-size:140px;margin-top:22px">Y EL PETRÓLEO</div><div class="y">LA HISTORIA DE PLAYMOBIL</div></div>'''
