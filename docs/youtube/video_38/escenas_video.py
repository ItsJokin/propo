"""Escenas del vídeo 38 (Pokémon, formato largo). Motor común; sin personajes ni logotipos: consolas, insectos y criaturas genéricas de Fluent Emoji."""
from base import *

CAP_ICONOS = {1: "1f41e", 2: "1f4f0", 3: "1f50c", 4: "1f4b8", 5: "1f534", 6: "2753", 7: "26a1", 8: "1f4fa",
              9: "1f0cf", 10: "1f91d", 11: "1f5fa-fe0f", 12: "1f9e0"}

def portatil(px=220, pantalla="#9bbc0f"):
    return (f'<svg width="{px}" height="{px*1.6:.0f}" viewBox="0 0 100 160"><rect x="6" y="4" width="88" height="152" rx="10" fill="#c9c6bd" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="16" y="14" width="68" height="58" rx="4" fill="#555"/><rect x="24" y="20" width="52" height="46" fill="{pantalla}"/>'
            f'<path d="M22,104 h20 M32,94 v20" stroke="{TINTA}" stroke-width="7"/><circle cx="68" cy="100" r="7" fill="#9b1b4a"/><circle cx="80" cy="90" r="7" fill="#9b1b4a"/>'
            f'<rect x="34" y="130" width="12" height="4" rx="2" fill="#666"/><rect x="52" y="130" width="12" height="4" rx="2" fill="#666"/></svg>')

def escenas():
    E = {}
    E["po_raton"] = f'''{F("", True)}{obj(spr("1f42d", 260), 26, 46, "pop", "bob", .2)}{obj(spr("26a1", 140), 38, 26, "pop", "glow", .7)}{txt(kt("«HAZTE *CON TODOS*»", "mega", .9, .12, "slam"), 68, 46, 56)}'''
    E["po_rentable"] = titular("LA FRANQUICIA *QUE MÁS HA GENERADO*", "según muchas estimaciones", "", ("1f4b0", "1f3ae", "1f4fa", "1f0cf"), "", True, "xl")
    E["po_insectos"] = icono_texto("1fab2", "UN NIÑO *QUE CAZABA INSECTOS*", "en los charcos de su barrio", "", "izq", "calido", True, "pop", "bob", 380, (("1f41e", 86, 80),))
    E["po_seis"] = comparar("23f3", "seis años de desarrollo", "1f4b8", "casi la ruina", "+")
    E["po_hospital"] = icono_texto("1f691", "CIENTOS DE NIÑOS *AL HOSPITAL*", "por un episodio de dibujos animados", "", "der", "dark", False, "left", "")
    E["po_historia"] = titular("LA HISTORIA DE *POKÉMON*", "", "", ("1f41e", "1f3ae", "26a1", "1f0cf"), "", True, "xl")
    E["po_machida"] = f'''{F("sepia", True)}{obj(spr("1f1ef-1f1f5", 220), 22, 46, "drop", "bob", .2)}{txt(kt("MACHIDA, 1965", "mega", .4, .12, "slam"), 64, 40, 64)}{txt(kt("afueras de Tokio: nace Satoshi Tajiri", "l", 1.2), 64, 58, 64)}<div class="viñeta"></div>'''
    E["po_campos"] = lista([("1f33e", "campos"), ("1f4a7", "estanques"), ("1f333", "bosques")], "TODAVÍA HABÍA…")
    E["po_coleccion"] = lista([("1fab2", "escarabajos"), ("1f438", "renacuajos"), ("1f997", "grillos")], "BUSCAR, ESTUDIAR, COLECCIONAR, INTERCAMBIAR")
    E["po_doctor"] = icono_texto("1f9d1-200d-1f52c", "«EL DOCTOR *BICHO*»", "así lo llamaban, según se cuenta", "", "izq", "", False, "pop", "bob", 380, (("1fab2", 86, 80),))
    E["po_asfalto"] = comparar("1f33e", "campos", "1f3d7-fe0f", "edificios y asfalto", "→", "TOKIO CRECE")
    E["po_sensacion"] = impacto("nunca olvidó la sensación de", "DESCUBRIR *Y COLECCIONAR*", "", "2728")
    E["po_recreativas"] = icono_texto("1f579-fe0f", "DE LOS INSECTOS *A LAS RECREATIVAS*", "le obsesionaban", "de adolescente", "izq", "", False, "pop", "bob")
    E["po_estudiante"] = icono_texto("1f4dd", "CASI NO TERMINA *EL INSTITUTO*", "según se cuenta", "", "der", "", False, "pop", "swing")
    E["po_revista"] = icono_texto("1f4f0", "GAME FREAK: *UNA REVISTA A MANO*", "trucos y análisis de videojuegos", "1982", "izq", "sepia", False, "pop", "bob")
    E["po_sugimori"] = icono_texto("1f3a8", "KEN *SUGIMORI*", "un joven ilustrador", "", "der", "", False, "up", "bob")
    E["po_empresa"] = flecha("1f4f0", "1f3e2", "DE ESCRIBIR SOBRE JUEGOS *A HACERLOS*", "la revista se convierte en empresa")
    E["po_gameboy"] = f'''{F("", True)}{obj(portatil(230), 30, 50, "drop", "float", .2)}{txt(kt("1989: UNA *CONSOLA PORTÁTIL*", "xl", .8), 68, 46, 54)}'''
    E["po_cable"] = f'''{F()}{obj(portatil(170), 24, 50, "left", "", .2)}{obj(portatil(170), 76, 50, "right", "", .4)}<svg class="pos" style="left:50%;top:60%" width="700" height="120" viewBox="0 0 700 120"><path class="draw" style="--d:.8s;--len:800" d="M10,10 Q350,180 690,10" fill="none" stroke="#555" stroke-width="10"/></svg>{txt(kt("UN CABLE *ENTRE DOS CONSOLAS*", "xl", 1.3), 50, 88, 90)}'''
    E["po_competir"] = comparar("1f94a", "todos: para competir", "1f441-fe0f", "Tajiri vio otra cosa", "≠")
    E["po_viajan"] = f'''{F()}{obj(portatil(170), 20, 50, "pop", "", .2)}{obj(portatil(170), 80, 50, "pop", "", .2)}<div class="carrera" style="--d:.6s">{spr("1f41b", 150)}</div>{txt(kt("CRIATURAS *QUE VIAJAN POR EL CABLE*", "xl", 1.0), 50, 86, 90)}'''
    E["po_capturar"] = lista([("1f50d", "buscar"), ("1f945", "capturar"), ("1f4da", "coleccionar"), ("1f91d", "intercambiar")], "")
    E["po_pocket"] = titular("*POCKET MONSTERS*", "monstruos de bolsillo", "", ("1f47e", "1f45c", "1f41e", "2728"))
    E["po_nintendo"] = icono_texto("1f3ae", "UNA OPORTUNIDAD *EN NINTENDO*", "aunque no la entendieron del todo", "", "izq", "", False, "pop", "bob")
    E["po_eterno"] = icono_texto("23f3", "UN PROYECTO *ETERNO*", "y otros juegos para sobrevivir", "", "der", "", False, "spin", "")
    E["po_dinero"] = lista([("1f4b8", "sin dinero"), ("1f6aa", "empleados que se van"), ("1f645", "Tajiri, sin sueldo")], "SEGÚN SE CUENTA")
    E["po_horas"] = comparar("1f4bb", "24 horas trabajando", "1f634", "12 horas durmiendo", "+")
    E["po_miyamoto"] = icono_texto("1f468-200d-1f3a8", "SHIGERU *MIYAMOTO*", "el creador de Mario: ¿por qué no dos versiones?", "su mentor", "izq", "", False, "up", "bob")
    E["po_intercambiar"] = comparar("1f534", "versión 1", "1f7e2", "versión 2", "↔", "PARA CONSEGUIRLAS TODAS, INTERCAMBIAR")
    E["po_1996"] = fecha("27", "FEBRERO", "1996", "salen Rojo y Verde en Japón", "1f3ae")
    E["po_tranquilo"] = icono_texto("1f4a4", "UN LANZAMIENTO *DISCRETO*", "la Game Boy ya tenía siete años", "", "der", "", False, "pop", "")
    E["po_patios"] = bocadillos("1f9d2", ["¿Cuál tienes?", "¡Me falta uno!", "¿Me lo cambias?"], "de boca en boca, en los patios")
    E["po_151"] = f'''{F("dark", True)}{txt(kt("150", "mega hueso", .3, .12, "slam"), 36, 44, 40)}{txt(kt("+1", "mega naranja", 1.1, .12, "slam"), 66, 44, 30)}{txt(kt("oficiales… y una escondida", "l hueso", 1.6), 50, 68, 80)}'''
    E["po_mew"] = icono_texto("2753", "UNA CRIATURA *SECRETA*", "metida en el último momento", "según uno de sus programadores", "izq", "espacio", True, "pop", "float")
    E["po_rumor"] = lista([("1f6ab", "no aparecía"), ("1f512", "no se podía capturar"), ("1f5e3-fe0f", "casi un rumor")], "")
    E["po_fallos"] = icono_texto("1f41b", "LA ENCUENTRAN *POR FALLOS DEL JUEGO*", "y el rumor se dispara", "", "der", "", False, "pop", "bob")
    E["po_concurso"] = icono_texto("1f4d6", "UN CONCURSO: *20 GANADORES*", "en una revista de cómics infantiles", "", "izq", "", False, "pop", "bob")
    E["po_78000"] = cifra("78.000", "NIÑOS SE PRESENTARON, SEGÚN SE CUENTA", "1f9d2")
    E["po_ventas"] = titular("EL MISTERIO: *EL MEJOR ANUNCIO*", "y las ventas se disparan", "", ("2753", "1f4c8", "1f3ae", "2728"), "", True, "xl")
    E["po_nishida"] = icono_texto("1f469-200d-1f3a8", "ATSUKO *NISHIDA*", "dibujó un pequeño ratón eléctrico", "diseñadora", "izq", "", False, "up", "bob", 380, (("1f42d", 86, 80),))
    E["po_pikachu"] = f'''{F("calido", True)}{obj(spr("26a1", 200), 26, 44, "pop", "glow", .2)}{txt(kt("PIKA", "mega", .5, .12, "slam"), 26, 74, 30)}{txt('<div class="vs" style="--d:.9s">+</div>', 50, 50, 10)}{obj(spr("1f42d", 200), 74, 44, "pop", "bob", 1.0)}{txt(kt("CHU", "mega", 1.2, .12, "slam"), 74, 74, 30)}'''
    E["po_principal"] = icono_texto("1f914", "AL PRINCIPIO, *NO ERA LA PRINCIPAL*", "", "", "der", "", False, "pop", "swing")
    E["po_serie"] = icono_texto("1f4fa", "1997: *LA SERIE*", "y el ratón eléctrico, compañero del protagonista", "según se cuenta, gustaba a niños y niñas", "izq", "", True, "pop", "bob")
    E["po_nombres"] = comparar("1f466", "el protagonista: Satoshi", "1f9d1", "su rival: Shigeru", "+", "UN GUIÑO ESCONDIDO")
    E["po_estrella"] = titular("UNA *ESTRELLA MUNDIAL*", "un ratón amarillo", "", ("26a1", "1f42d", "2b50", "1f30d"))
    E["po_porygon"] = fecha("16", "DICIEMBRE", "1997", "un episodio sobre una criatura virtual", "1f4fa")
    E["po_destellos"] = f'''{F("dark")}<div class="pos" style="left:50%;top:44%;width:900px;height:500px;border:8px solid #333;border-radius:20px;background:linear-gradient(90deg,#D7263D 50%,#2E6BD6 50%);opacity:.85"></div>{obj(spr("26a0-fe0f", 200), 50, 44, "pop", "", .4)}{txt(kt("DESTELLOS *ROJOS Y AZULES*, MUY RÁPIDOS", "xl hueso", .6), 50, 86, 90)}'''
    E["po_mal"] = lista([("1f635-200d-1f4ab", "mareos"), ("1f922", "náuseas"), ("1f691", "convulsiones")], "ESA NOCHE")
    E["po_685"] = cifra("685", "PERSONAS AL HOSPITAL EN AMBULANCIA", "1f691", "según las autoridades japonesas")
    E["po_suspendida"] = comparar("23f8-fe0f", "la serie, cuatro meses parada", "1f6ab", "el episodio, nunca más", "+")
    E["po_normas"] = icono_texto("1f4cf", "NORMAS *SOBRE LOS DESTELLOS*", "en las cadenas japonesas, desde entonces", "", "der", "", False, "pop", "bob")
    E["po_frena"] = impacto("ni siquiera aquello", "LO *FRENÓ*", "", "1f680")
    E["po_occidente"] = flecha("1f1ef-1f1f5", "1f30d", "1998: EE. UU. · 1999: EUROPA", "con un nombre más corto: Pokémon")
    E["po_todo"] = lista([("1f3ae", "videojuegos"), ("1f4fa", "serie"), ("1f0cf", "cartas"), ("1f9f8", "peluches"), ("1f3ac", "película")], "TODO A LA VEZ")
    E["po_cartas"] = icono_texto("1f3eb", "CARTAS *PROHIBIDAS EN EL COLEGIO*", "los niños no hacían otra cosa", "", "izq", "", False, "pop", "swing", 380, (("1f0cf", 86, 80),))
    E["po_sueno"] = titular("EL SUEÑO DE TAJIRI, *HECHO REALIDAD*", "millones de niños coleccionando", "", ("1f41e", "1f9d2", "1f91d", "2728"), "", True, "xl")
    E["po_company"] = cifra("1998", "NACE THE POKÉMON COMPANY", "1f3e2")
    E["po_duenos"] = lista([("1f3ae", "Nintendo"), ("1f4f0", "Game Freak"), ("1f0cf", "Creatures")], "TRES DUEÑOS")
    E["po_dato"] = impacto("un dato que sorprende:", "EL DINERO *NO VIENE DE LOS JUEGOS*", "la mayor parte", "1f914")
    E["po_merch"] = lista([("1f9f8", "peluches"), ("1f455", "camisetas"), ("1f392", "mochilas"), ("1f0cf", "cartas")], "VIENE DEL MERCHANDISING")
    E["po_subasta"] = cifra("MILLONES $", "POR ALGUNAS CARTAS ANTIGUAS, EN SUBASTA", "1f528")
    E["po_maquina"] = comparar("1f4b8", "nació casi sin dinero", "1f5a8-fe0f", "una máquina de imprimirlo", "→")
    E["po_go"] = cifra("2016", "LLEGA EL JUEGO PARA EL MÓVIL", "1f4f1", "julio de")
    E["po_mapa"] = icono_texto("1f5fa-fe0f", "EL MAPA *DEL MUNDO REAL*", "parques, plazas y monumentos", "para capturar, hay que salir", "izq", "", True, "pop", "bob")
    E["po_descargas"] = cifra("CIENTOS DE MILLONES", "DE DESCARGAS EN POCAS SEMANAS", "1f4f2")
    E["po_calles"] = lista([("1f91d", "amistades"), ("1f6b6", "ejercicio"), ("1f915", "algún accidente")], "LAS CALLES, LLENAS")
    E["po_principio"] = comparar("1f4f1", "salir con el móvil", "1fab2", "salir a buscar bichos", "=", "VOLVER AL PRINCIPIO")
    E["leccion1"] = leccion(1, "los recuerdos de la infancia", "*PUEDEN SER UNA MINA*", "1fab2")
    E["leccion2"] = leccion(2, "mira las herramientas", "*DE OTRA FORMA*", "1f50c")
    E["leccion3"] = leccion(3, "un secreto bien guardado", "*VENDE MÁS QUE MIL ANUNCIOS*", "2753")
    E["po_final"] = lista([("1fab2", "insectos"), ("1f4f0", "una revista"), ("1f50c", "un cable"), ("1f4b8", "casi la ruina"), ("26a1", "un ratón eléctrico")], "")
    E["po_doctor2"] = f'''{F("calido", True)}{obj(spr("1f9d1-200d-1f52c", 280), 30, 50, "drop", "bob", .2)}{txt(kt("ACUÉRDATE *DEL DOCTOR BICHO*", "xl", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:110px;top:120px;transform:rotate(-8deg)">{portatil(250)}</div>
      <div style="position:absolute;left:330px;top:420px">{vicon("beetle", 200)}</div>
      <div class="big" style="top:100px"><div class="s">EL NIÑO DE LOS INSECTOS</div><div class="q" style="font-size:150px;margin-top:22px">QUE CREÓ</div><div class="q" style="font-size:150px">POKÉMON</div><div class="y">LA SAGA MÁS RENTABLE</div></div>'''
