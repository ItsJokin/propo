"""Escenas del vídeo 51 (especial Navidad: Cortylandia). Motor común; sin logotipos: edificios, fachadas y muñecos genéricos."""
from base import *

CAP_ICONOS = {1: "1f1e8-1f1fa", 2: "2702-fe0f", 3: "2694-fe0f", 4: "1f5bc-fe0f", 5: "1f3ad", 6: "1f504", 7: "1f4c9", 8: "1f46a", 9: "1f9e0"}

def fachada(w=520, d=.2):
    """Fachada de grandes almacenes con muñecos animados (sin rótulos ni logotipos)."""
    ventanas = "".join(f'<rect x="{30 + (i % 6) * 72}" y="{40 + (i // 6) * 60}" width="44" height="34" rx="4" fill="#ffe7a3" opacity=".85"/>' for i in range(18))
    an = "" if d is None else f' style="animation:eUp .6s ease {d}s both"'
    return (f'<svg width="{w}" height="{w*0.9:.0f}" viewBox="0 0 470 420"{an}><rect x="10" y="10" width="450" height="400" rx="8" fill="#c9c3b8" stroke="{TINTA}" stroke-width="6"/>'
            f'{ventanas}<rect x="10" y="230" width="450" height="110" fill="#123d2a" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="170" y="350" width="130" height="60" fill="#5b4636" stroke="{TINTA}" stroke-width="4"/></svg>')

def escena_fachada(titulo, sub="", fondo="navidad", d=.2):
    munecos = "".join(obj(spr(c, 110), 37 + i * 6.5, 68, "pop", "jump" if i % 2 else "bob", .8 + i * .2) for i, c in enumerate(["1f43b", "1f430", "1f981", "1f438", "1f427"]))
    return (f'{F(fondo, True)}<div class="pos" style="left:50%;top:58%">{fachada(720, d)}</div>{munecos}'
            f'{txt(kt(titulo, "xl hueso", .5), 50, 12, 92)}' + (txt(kt(sub, "l naranja", 1.2), 50, 22, 90) if sub else ""))

def escenas():
    E = {}
    E["co_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f3ad", "2744-fe0f", "1f381"), "navidad", True, "mega")
    E["co_madrid"] = icono_texto("1f46a", "CIENTOS DE PERSONAS *MIRANDO UNA FACHADA*", "niños a hombros de sus padres", "Madrid, una tarde de diciembre", "izq", "navidad", True, "pop", "bob")
    E["co_vida"] = escena_fachada("LA FACHADA *COBRA VIDA*", "muñecos gigantes que cantan y bailan")
    E["co_cortylandia"] = comparar("1f3ad", "ir a ver Cortylandia", "1f36b", "comer turrón", "=", "IGUAL DE NAVIDEÑO")
    E["co_rivalidad"] = comparar("1f468", "un primo", "1f468", "el otro primo", "VS", "CINCUENTA AÑOS, CALLE CON CALLE")
    E["co_historia"] = titular("LA HISTORIA DE *CORTYLANDIA*", "y de una rivalidad familiar", "", ("1f3ad", "1f3ec", "2694-fe0f", "1f384"), "navidad", True, "xl")
    E["co_cuba"] = icono_texto("1f1e8-1f1fa", "TODO EMPIEZA *EN CUBA*", "principios del siglo XX", "", "izq", "calido", True, "pop", "bob")
    E["co_primos"] = comparar("1f468", "Ramón Areces", "1f468-200d-1f4bc", "José «Pepín» Fernández", "+", "DOS PRIMOS ASTURIANOS")
    E["co_encanto"] = icono_texto("1f3ec", "EL *ENCANTO*", "unos grandes almacenes de La Habana; su tío César Rodríguez era directivo", "", "der", "calido", True, "pop", "bob")
    E["co_oficio"] = lista([("1f45a", "colocar la mercancía"), ("1f91d", "tratar al cliente"), ("1f3ec", "muchos departamentos, un techo")], "EL OFICIO, DESDE ABAJO")
    E["co_vuelven"] = flecha("1f1e8-1f1fa", "1f1ea-1f1f8", "VUELVEN *A ESPAÑA*", "y los dos fundan sus propios almacenes")
    E["co_1935"] = cifra("1935", "SE TRASPASA UNA SASTRERÍA JUNTO A LA PUERTA DEL SOL", "2702-fe0f", "calle Rompelanzas, Madrid")
    E["co_traspaso"] = comparar("1f468-200d-1f4bc", "Pepín ayuda con el traspaso", "1f468", "Ramón se queda el negocio", "→", "SEGÚN VARIAS BIOGRAFÍAS")
    E["co_1940"] = cifra("1940", "NACE LA SOCIEDAD EL CORTE INGLÉS", "1f4dd")
    E["co_galerias"] = cifra("1943", "PEPÍN ABRE LOS SUYOS, A POCOS METROS: GALERÍAS PRECIADOS", "1f3ec")
    E["co_mismas"] = titular("MISMO MAESTRO, *MISMAS CALLES*", "dos primos compitiendo en el centro de Madrid", "", ("1f468", "2694-fe0f", "1f468-200d-1f4bc", "1f3d9-fe0f"))
    E["co_dos"] = impacto("durante décadas,", "LOS DOS GRANDES ALMACENES *DE ESPAÑA*", "", "1f3ec")
    E["co_todo"] = lista([("1f3f7-fe0f", "precios"), ("1f5bc-fe0f", "escaparates"), ("1f4e2", "publicidad"), ("1f4cd", "nuevas tiendas")], "COMPETÍAN EN TODO")
    E["co_rebajas"] = icono_texto("1f3f7-fe0f", "GALERÍAS, *POR DELANTE*", "se le atribuye haber popularizado las rebajas", "según se cuenta", "izq", "", False, "pop", "swing")
    E["co_herencia"] = icono_texto("1f4b0", "UNA HERENCIA *Y UNA EXPANSIÓN*", "Ramón Areces pilla por sorpresa a su primo", "el giro", "der", "calido", True, "pop", "bob")
    E["co_adelanta"] = comparar("1f3ec", "El Corte Inglés: tiendas más grandes", "1f4c8", "en más ciudades: el líder", "→", "ADELANTA A GALERÍAS")
    E["co_navidad"] = titular("SE JUGABA MUCHÍSIMO *EN NAVIDAD*", "", "", ("1f384", "1f381", "1f3ec", "2694-fe0f"), "navidad", True, "xl")
    E["co_temporada"] = icono_texto("1f384", "SU TEMPORADA *MÁS IMPORTANTE*", "los grandes almacenes lo descubrieron pronto", "", "izq", "navidad", True, "pop", "bob")
    E["co_escaparates"] = lista([("1f682", "trenes que se mueven"), ("1f9f8", "muñecos animados"), ("1f4d6", "escenas de cuentos")], "ESCAPARATES DE NAVIDAD, DESDE EL SIGLO XIX")
    E["co_exposicion"] = icono_texto("1f5bc-fe0f", "COMO IR *A UNA EXPOSICIÓN*", "y cada almacén quería el más espectacular", "Nueva York, París, Londres", "der", "", False, "pop", "bob")
    E["co_pajes"] = icono_texto("1f48c", "LOS PAJES *DE LOS REYES*", "recogiendo las cartas de los niños dentro de las tiendas", "en España", "izq", "calido", True, "pop", "bob", 380, (("1f451", 84, 20),))
    E["co_bolsa"] = lista([("1f9d2", "el niño deja la carta"), ("1f440", "los padres miran juguetes"), ("1f6cd-fe0f", "salen con una bolsa")], "UNA TARDE EN LOS ALMACENES")
    E["co_tarde"] = titular("QUE ELIJAN *TU TIENDA*", "para pasar la tarde", "", ("1f46a", "1f3ec", "1f384", "2728"), "navidad", True, "xl")
    E["co_diciembre"] = comparar("1f3ec", "tu tienda", "1f3ec", "la de al lado", "VS", "LA BATALLA DE DICIEMBRE")
    E["co_1979"] = cifra("1979", "MUÑECOS ANIMADOS EN LA FACHADA DE LA CALLE PRECIADOS", "1f3ad")
    E["co_calle"] = impacto("la misma calle que daba nombre", "A SU *GRAN RIVAL*", "", "1f62e")
    E["co_munecos"] = escena_fachada("UNA CANCIÓN *VARIAS VECES AL DÍA*", "las familias se paran… y entran en la tienda")
    E["co_nombre"] = f'''{F("navidad", True)}{txt(kt("*CORTYLANDIA*", "mega hueso", .3), 50, 42, 90)}{txt(kt("funcionó desde el primer año", "l naranja", 1.2), 50, 62, 80)}'''
    E["co_brillante"] = comparar("1f4cb", "un cartel: nadie se para", "1f57a", "muñecos que bailan: diez minutos", "VS", "UN ANUNCIO GIGANTE Y GRATIS")
    E["co_organiza"] = impacto("lo más curioso es", "CÓMO SE *ORGANIZA*", "", "1f914")
    E["co_artistico"] = icono_texto("1f3a8", "UN MONTAJE *NUEVO CADA AÑO*", "tema, personajes y canción: el departamento artístico", "en Madrid", "izq", "", False, "pop", "bob")
    E["co_temas"] = lista([("1f418", "animales"), ("1f404", "la granja"), ("1f680", "el espacio"), ("1f4d6", "cuentos")], "HA HABIDO CORTYLANDIAS DE…")
    E["co_rota"] = icono_texto("1f504", "NO SE TIRA: *ROTA*", "los montajes de otros años viajan a otras ciudades", "según El Independiente", "der", "", True, "pop", "spin-slow")
    E["co_ciudades"] = lista([("1f3d9-fe0f", "Madrid"), ("26ea", "Barcelona"), ("1f3db-fe0f", "Tarragona")], "DESDE LOS NOVENTA, EN MÁS CIUDADES")
    E["co_eficiente"] = flecha("1f3ed", "1f30d", "SE FABRICA UNA VEZ, *VIAJA AÑOS*", "desde el punto de vista del negocio, muy eficiente")
    E["co_quepaso"] = impacto("¿y qué pasó con", "*GALERÍAS PRECIADOS*?", "", "1f914")
    E["co_rumasa"] = icono_texto("1f3e2", "DENTRO *DE RUMASA*", "el gran grupo de José María Ruiz-Mateos", "años ochenta", "izq", "dark", False, "pop", "")
    E["co_1983"] = cifra("1983", "EL GOBIERNO EXPROPIA RUMASA", "2696-fe0f")
    E["co_manos"] = lista([("1f504", "cambios de dueño"), ("1f4c9", "problemas económicos"), ("1f614", "sin recuperar su esplendor")], "UN LARGO CAMINO")
    E["co_1995"] = cifra("1995", "EL CORTE INGLÉS COMPRA A SU GRAN RIVAL", "1f91d")
    E["co_termina"] = titular("LA GUERRA *HABÍA TERMINADO*", "después de más de cincuenta años", "", ("1f3ec", "1f3f3-fe0f", "1f3ec", "1f570-fe0f"))
    E["co_ninguno"] = icono_texto("1f56f-fe0f", "NINGUNO DE LOS DOS *LLEGÓ A VERLO*", "Pepín y Ramón habían muerto en los años ochenta", "", "der", "dark", False, "pop", "glow")
    E["co_sigue"] = escena_fachada("Y CORTYLANDIA *SIGUIÓ FUNCIONANDO*", "cada Navidad", "espacio")
    E["co_generaciones"] = lista([("1f474", "los abuelos"), ("1f468", "los hijos"), ("1f9d2", "los nietos")], "TRES GENERACIONES")
    E["co_cancion"] = lista([("1f3b5", "se canta en broma"), ("1f602", "se parodia"), ("1f4f1", "aparece en redes cada diciembre")], "UNA CANCIÓN CON VIDA PROPIA")
    E["co_gente"] = icono_texto("23f0", "LOS HORARIOS *DE LOS PASES*", "para no quedarse sin sitio", "días de más afluencia", "izq", "", False, "pop", "shake")
    E["co_dificil"] = titular("QUE VAYAN A VER TU PUBLICIDAD *POR GUSTO*", "y la recuerden con cariño", "", ("1f3ad", "2764-fe0f", "1f46a", "2728"), "navidad", True, "xl")
    E["leccion1"] = leccion(1, "la mejor publicidad es", "*LA QUE LA GENTE QUIERE VER*", "1f3ad")
    E["leccion2"] = leccion(2, "lo que se puede reutilizar,", "*SE REUTILIZA*", "1f504")
    E["leccion3"] = leccion(3, "no gana el que empieza por delante,", "*SINO EL QUE APROVECHA SUS OPORTUNIDADES*", "1f3c1")
    E["co_final"] = lista([("1f1e8-1f1fa", "dos primos"), ("2702-fe0f", "una sastrería"), ("2694-fe0f", "una guerra"), ("1f3ad", "unos muñecos")], "")
    E["co_acuerdate"] = escena_fachada("EL ÚLTIMO CAPÍTULO *DE UNA RIVALIDAD*", "")
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:60px;top:170px">{fachada(470, None)}</div>
      <div style="position:absolute;left:90px;top:405px">{vicon("bear", 130)}</div>
      <div style="position:absolute;left:230px;top:395px">{vicon("rabbit-face", 130)}</div>
      <div style="position:absolute;left:380px;top:405px">{vicon("penguin", 120)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">DOS PRIMOS Y</div><div class="q" style="font-size:150px;margin-top:22px">CORTYLANDIA</div><div class="y">UNA GUERRA DE 50 AÑOS</div></div>'''
