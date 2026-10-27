"""Escenas del vídeo 29 (Bimbo, formato largo). Motor común; sin logotipos ni la mascota real: panes y bolsas genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f1f2-1f1fd", 2: "1f52a", 3: "1f91d", 4: "1f3b1", 5: "1f9f8", 6: "1f69a", 7: "1f1ea-1f1f8", 8: "1f500", 9: "1f369",
              10: "1f91d", 11: "1f30d", 12: "1f9e0"}

def bolsa_pan(px=260, color=AZUL, texto="PAN"):
    reb = "".join(f'<rect x="{30 + i*14}" y="50" width="12" height="80" rx="5" fill="#f3e1b8" stroke="#c49a5e" stroke-width="2"/>' for i in range(8))
    return (f'<svg width="{px}" height="{px*0.75:.0f}" viewBox="0 0 200 150"><path d="M14,40 L186,40 L180,140 L20,140Z" fill="#fff" fill-opacity=".55" stroke="{TINTA}" stroke-width="4"/>{reb}'
            f'<rect x="14" y="62" width="172" height="34" fill="{color}"/><text x="100" y="87" font-family="Bebas" font-size="26" fill="#fff" text-anchor="middle">{texto}</text>'
            f'<path d="M186,40 L198,26 L192,40Z" fill="{color}"/></svg>')

def rebanada(px=200):
    return (f'<svg width="{px}" height="{px:.0f}" viewBox="0 0 100 100"><path d="M10,40 C10,10 90,10 90,40 L86,92 L14,92Z" fill="#c98a3a" stroke="{TINTA}" stroke-width="3"/>'
            f'<path d="M18,42 C18,20 82,20 82,42 L79,86 L21,86Z" fill="#f6e7c1"/></svg>')

def escenas():
    E = {}
    E["bi_pan"] = f'''{F("calido", True)}{obj(bolsa_pan(340), 30, 52, "drop", "float", .2)}{txt(kt("BLANDITO, EN REBANADAS, *DURA DÍAS*", "xl", .8), 72, 46, 50)}'''
    E["bi_molde"] = comparar("1f35e", "pedir pan de molde…", "1f3f7-fe0f", "…era casi pedir Bimbo", "=", "EN ESPAÑA, DURANTE DÉCADAS")
    E["bi_mexico"] = flecha("1f1ea-1f1f8", "1f1f2-1f1fd", "NACIÓ EN MÉXICO, *DE HIJOS DE CATALANES*", "")
    E["bi_nombre"] = comparar("1f3b1", "un juego de azar", "1f98c", "un personaje de dibujos animados", "+", "EL NOMBRE")
    E["bi_separadas"] = comparar("1f1f2-1f1fd", "la marca mexicana", "1f1ea-1f1f8", "la española", "↔", "SEPARADAS… Y REUNIDAS")
    E["bi_historia"] = titular("LA PANIFICADORA *MÁS GRANDE DEL MUNDO*", "según la propia empresa", "", ("1f35e", "1f30d", "1f3ed", "2728"), "", True, "xl")
    E["bi_emigran"] = flecha("1f1ea-1f1f8", "1f30e", "CATALANES QUE EMIGRAN *A AMÉRICA*", "principios del siglo XX")
    E["bi_molino"] = icono_texto("1f382", "JUAN SERVITJE: *EL MOLINO*", "una pastelería en la capital de México", "", "izq", "sepia", False, "pop", "bob")
    E["bi_lorenzo"] = icono_texto("1f466", "LORENZO *SERVITJE*", "creció entre hornos, masas y repartos", "su hijo:", "der", "sepia", False, "up", "bob")
    E["bi_frente"] = icono_texto("1f468-200d-1f4bc", "AL FRENTE, *MUY JOVEN*", "tras la muerte de su padre", "", "izq", "", False, "pop", "")
    E["bi_duro"] = comparar("1f956", "el pan se ponía duro enseguida", "1f6ab", "casi no había pan de molde envasado", "+")
    E["bi_eeuu"] = icono_texto("1f1fa-1f1f8", "EN EE. UU., *YA ERA HABITUAL*", "el pan de molde en rebanadas", "", "der", "", True, "pop", "bob")
    E["bi_quien"] = impacto("una pregunta:", "¿QUIÉN INVENTÓ *EL PAN EN REBANADAS*?", "", "1f914")
    E["bi_rebanadas"] = f'''{F()}{"".join(obj(rebanada(120), 14 + i * 10, 46, "left", "", .1 + i * .1) for i in range(8))}{txt(kt("REBANADAS *IGUALES*: OTRA COSA", "xl", 1.2), 50, 80, 90)}'''
    E["bi_rohwedder"] = f'''{F("sepia", True)}{obj(spr("2699-fe0f", 230), 24, 46, "spin", "spin-slow", .2)}{txt(kt("1928, MISURI", "l", .5), 64, 28, 58)}{txt(kt("LA MÁQUINA DE *OTTO ROHWEDDER*", "xl", .9), 64, 46, 58)}{txt(kt("un joyero", "l", 1.5), 64, 62, 58)}<div class="viñeta"></div>'''
    E["bi_maquina"] = flecha("1f35e", "1f4e6", "CORTA LA BARRA *Y LA ENVUELVE*", "para que no se seque")
    E["bi_desconfian"] = icono_texto("1f928", "AL PRINCIPIO, *DESCONFIANZA*", "«el pan cortado se pondrá duro»", "", "izq", "", False, "pop", "swing")
    E["bi_exito_us"] = cifra("LA MAYORÍA", "DEL PAN EN EE. UU., YA EN REBANADAS", "1f4c8", "en pocos años:")
    E["bi_expresion"] = bocadillos("1f60d", ["¡Lo mejor desde…", "…el pan en rebanadas!"], "una expresión muy popular en inglés")
    E["bi_llevar"] = flecha("1f1fa-1f1f8", "1f1f2-1f1fd", "LA IDEA QUE SERVITJE *QUERÍA LLEVAR A MÉXICO*", "")
    E["bi_socios"] = lista([("1f468", "Roberto Servitje"), ("1f468-200d-1f4bc", "Jaime Jorba"), ("1f468-200d-1f4bc", "Jaime Sendra"), ("1f465", "y más socios")], "LORENZO REÚNE A SUS SOCIOS")
    E["bi_1945"] = fecha("2", "DICIEMBRE", "1945", "Ciudad de México: nace su empresa", "1f1f2-1f1fd")
    E["bi_camion"] = lista([("1f69a", "un camión"), ("1f477", "unas decenas de trabajadores"), ("1f3ed", "una fábrica modesta")], "EMPEZARON CON…")
    E["bi_idea"] = icono_texto("1f35e", "PAN DE CALIDAD, *ENVASADO*", "fresco varios días, en todas las tiendas", "la idea:", "izq", "calido", True, "pop", "bob")
    E["bi_productos"] = lista([("1f35e", "pan blanco"), ("1f96f", "pan negro"), ("1f35e", "pan tostado")], "LOS PRIMEROS PRODUCTOS")
    E["bi_faltaba"] = impacto("", "FALTABA *EL NOMBRE*", "", "1f3f7-fe0f")
    E["bi_opciones"] = f'''{F()}{"".join(txt(f'<div class="xl" style="text-decoration:line-through;color:#8A8F98">{n}</div>', 25 + (i % 2) * 50, 32 + (i // 2) * 22, 40, "center", .2 + i * .3, "pop") for i, n in enumerate(["PAN REX", "PAN LIRIO", "PAN NIEVE", "PAN AZTECA"]))}'''
    E["bi_noconvence"] = icono_texto("1f615", "NINGUNA *CONVENCÍA*", "", "", "der", "", False, "pop", "swing")
    E["bi_bingo_bambi"] = f'''{F("", True)}{obj(spr("1f3b1", 200), 22, 40, "pop", "bob", .2)}{txt(kt("BINGO", "xl", .5), 22, 64, 30)}{txt('<div class="vs" style="--d:.9s">+</div>', 50, 42, 10)}{obj(spr("1f98c", 220), 78, 40, "pop", "bob", 1.0)}{txt(kt("BAMBI", "xl", 1.2), 78, 64, 30)}
      {txt(kt("la versión más repetida", "l gris", 1.6), 50, 84, 80)}'''
    E["bi_bimbo"] = titular("*BIMBO*", "corto, sonoro, fácil de recordar", "", ("1f35e", "2728", "1f60a", "1f3f7-fe0f"))
    E["bi_simpatico"] = icono_texto("1f46a", "SIMPÁTICO *Y FAMILIAR*", "perfecto para un pan para toda la familia", "", "izq", "calido", True, "pop", "bob")
    E["bi_imagen"] = impacto("la marca necesitaba", "UNA *IMAGEN*", "", "1f3a8")
    E["bi_felicitacion"] = f'''{F("calido", True)}<div class="pos" style="left:30%;top:48%;width:380px;height:300px;background:#fff;border:6px solid {TINTA};transform:rotate(-5deg);box-shadow:10px 10px 0 rgba(0,0,0,.15)"></div>
      {obj(spr("1f9f8", 200), 30, 48, "pop", "bob", .5)}{obj(spr("1f384", 110), 40, 32, "pop", "", .8)}{txt(kt("UNA FELICITACIÓN *DE NAVIDAD*", "xl", .8), 72, 40, 50)}{txt(kt("un osito con gorro de cocinero y delantal", "l", 1.4), 72, 56, 50)}'''
    E["bi_autor"] = icono_texto("1f9d0", "¿QUIÉN LO DIBUJÓ?", "las fuentes no coinciden", "", "der", "", False, "pop", "swing")
    E["bi_tierno"] = lista([("1f35e", "blandito"), ("1f970", "tierno"), ("1f9d2", "para los niños")], "LO QUE QUERÍAN TRANSMITIR")
    E["bi_sigue"] = icono_texto("1f504", "HA CAMBIADO *MUCHAS VECES*", "pero sigue en millones de bolsas", "", "izq", "", True, "spin", "bob")
    E["bi_distribucion"] = comparar("1f35e", "no fue solo el pan", "1f69a", "fue la distribución", "≠")
    E["bi_repartidores"] = f'''{F()}<div class="carrera" style="--d:.2s">{spr("1f69a", 260)}</div>{"".join(obj(spr("1f3ea", 110), 14 + i * 18, 30, "pop", "", .3 + i * .2) for i in range(5))}{txt(kt("MILES DE TIENDAS *CADA DÍA*", "xl", 1.2), 50, 14, 90)}'''
    E["bi_retiran"] = comparar("1f504", "retiran el pan que no se vendió", "1f35e", "dejan pan fresco", "→")
    E["bi_ventaja"] = titular("REPARTO DIRECTO: *SU GRAN VENTAJA*", "", "", ("1f69a", "1f3ea", "1f4aa", "1f3c6"), "", True, "xl")
    E["bi_bolleria"] = lista([("1f9c1", "pastelitos"), ("1f370", "magdalenas"), ("1f950", "bollería")], "Y CRECE POR TODO MÉXICO")
    E["bi_atlantico"] = flecha("1f1f2-1f1fd", "1f1ea-1f1f8", "UN SALTO *AL OTRO LADO DEL ATLÁNTICO*", "")
    E["bi_jorba"] = icono_texto("1f468-200d-1f4bc", "JAIME *JORBA*", "socio fundador; años como responsable de ventas en México", "", "izq", "", True, "up", "bob")
    E["bi_vuelve"] = icono_texto("2708-fe0f", "VUELVE A ESPAÑA: *EL MISMO PAN, EL MISMO NOMBRE*", "con dos socios, a principios de los sesenta", "", "der", "", True, "left", "float")
    E["bi_granollers"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("GRANOLLERS", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("cerca de Barcelona: la primera fábrica, a mediados de los sesenta", "l", 1.1), 50, 48, 80)}'''
    E["bi_novedad"] = comparar("1f956", "pan de panadería, cada día", "1f35e", "pan envasado que dura días", "VS", "TODA UNA NOVEDAD")
    E["bi_bocadillos"] = lista([("1f96a", "bocadillos del colegio"), ("1f35e", "tostadas del desayuno")], "")
    E["bi_independiente"] = comparar("1f1f2-1f1fd", "empresa mexicana", "1f1ea-1f1f8", "empresa española", "≠", "MISMO NOMBRE, DISTINTA EMPRESA")
    E["bi_caminos"] = impacto("durante décadas,", "CAMINOS *DISTINTOS*", "", "1f500")
    E["bi_duenos"] = flecha("1f1ea-1f1f8", "1f1fa-1f1f8", "LA ESPAÑOLA: *VARIOS DUEÑOS*", "primero, una gran panificadora estadounidense")
    E["bi_saralee"] = icono_texto("1f3e2", "LUEGO, *SARA LEE*", "un grupo estadounidense", "", "izq", "", False, "pop", "")
    E["bi_latam"] = icono_texto("1f30e", "LA MEXICANA: *UN GIGANTE*", "en toda Latinoamérica", "", "der", "", True, "zoom", "spin-slow")
    E["bi_2008"] = cifra("2008", "COMPRA UN GRAN NEGOCIO DE PAN EN EE. UU.", "1f1fa-1f1f8")
    E["bi_hija"] = flecha("1f1f2-1f1fd", "1f3c6", "MÁS GRANDE QUE QUIENES LA *INSPIRARON*", "")
    E["bi_otro"] = impacto("otro gran nombre de la bollería española:", "LOS *DÓNUTS*", "", "1f369")
    E["bi_costafreda"] = icono_texto("1f468-200d-1f4bc", "ANDREU *COSTAFREDA*", "descubrió los dónuts en un viaje a Estados Unidos", "principios de los sesenta", "izq", "", True, "up", "bob", 340, (("1f369", 86, 80),))
    E["bi_panrico"] = icono_texto("1f3ed", "NACE *PANRICO*", "dónuts envasados en las tiendas de barrio", "", "der", "calido", True, "pop", "bob")
    E["bi_clasicos"] = lista([("1f369", "dónuts"), ("1f36b", "bollos de chocolate"), ("1f9d2", "la merienda")], "CLÁSICOS DE LA MERIENDA")
    E["bi_rivales"] = comparar("1f35e", "el pan de molde", "1f369", "los dónuts", "VS", "GRANDES RIVALES")
    E["bi_dificiles"] = lista([("1f504", "cambios de dueño"), ("1f9fe", "deudas"), ("2696-fe0f", "conflictos laborales")], "PANRICO: AÑOS MUY DIFÍCILES")
    E["bi_circulo"] = impacto("y entonces", "EL CÍRCULO *SE CERRÓ*", "", "1f504")
    E["bi_compra_sl"] = icono_texto("1f91d", "COMPRA LOS NEGOCIOS *DE SARA LEE*", "el Grupo Bimbo mexicano, a principios de los 2010", "", "izq", "", True, "pop", "bob")
    E["bi_iberia"] = comparar("1f1ea-1f1f8", "España", "1f1f5-1f1f9", "Portugal", "+", "ENTRE ELLOS, EL BIMBO DE…")
    E["bi_techo"] = f'''{F("calido", True)}{obj(bolsa_pan(220, ROJO, "MÉXICO"), 30, 50, "left", "", .2)}{txt('<div class="vs" style="--d:.8s">+</div>', 50, 50, 10)}{obj(bolsa_pan(220, AZUL, "ESPAÑA"), 70, 50, "right", "", .5)}
      {txt(kt("DE NUEVO, *BAJO EL MISMO TECHO*", "xl", 1.3), 50, 14, 90)}'''
    E["bi_giro"] = impacto("y un último giro", "*ESPAÑOL*", "", "1f1ea-1f1f8")
    E["bi_donuts"] = cifra("2016", "GRUPO BIMBO COMPRA PANRICO", "1f369")
    E["bi_merienda"] = titular("LA MERIENDA *EN LA MISMA EMPRESA*", "de varias generaciones de españoles", "", ("1f369", "1f35e", "1f9d2", "1f1f2-1f1fd"), "", True, "xl")
    E["bi_paises"] = f'''{F()}{obj(spr("1f30d", 300), 30, 48, "zoom", "spin-slow", .2)}{txt(kt("DECENAS DE PAÍSES", "xl", .7), 70, 40, 50)}{txt(kt("América, Europa, Asia y África", "l", 1.3), 70, 56, 50)}'''
    E["bi_fabricas"] = comparar("1f3ed", "cientos de fábricas", "1f477", "más de cien mil trabajadores", "+")
    E["bi_mayor"] = titular("LA PANIFICADORA *MÁS GRANDE DEL MUNDO*", "según la propia empresa", "", ("1f35e", "1f3c6", "1f30d", "2728"), "", True, "xl")
    E["bi_familia"] = icono_texto("1f46a", "LA FAMILIA *SERVITJE*", "sigue vinculada a su dirección", "", "izq", "", False, "pop", "bob")
    E["bi_muere"] = icono_texto("1f56f-fe0f", "LORENZO SERVITJE *MUERE EN 2017*", "con 98 años; empezó con un solo camión", "", "der", "dark", False, "pop", "glow")
    E["leccion1"] = leccion(1, "la oportunidad puede estar en", "QUE EL PAN *NO SE PONGA DURO*", "1f35e")
    E["leccion2"] = leccion(2, "el producto importa, pero", "LA *DISTRIBUCIÓN* PUEDE IMPORTAR MÁS", "1f69a")
    E["leccion3"] = leccion(3, "las marcas también", "*EMIGRAN Y VUELVEN*", "2708-fe0f")
    E["bi_final"] = lista([("1f1ea-1f1f8", "emigrantes"), ("1f382", "una pastelería"), ("1f3b1", "un bingo"), ("1f98c", "un cervatillo"), ("1f9f8", "un osito")], "")
    E["bi_tostada"] = f'''{F("calido", True)}{obj(rebanada(260), 30, 50, "drop", "float", .2)}{txt(kt("YA SABES *DE DÓNDE VIENE*", "xl", .9), 70, 46, 50)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:30px;top:150px">{bolsa_pan(380)}</div>
      <div style="position:absolute;left:150px;top:440px">{vicon("bread", 180)}</div>
      <div class="big" style="top:100px"><div class="s">EL PAN DE MOLDE QUE</div><div class="q" style="font-size:160px;margin-top:22px">NACIÓ EN</div><div class="q" style="font-size:180px">MÉXICO</div><div class="y">LA HISTORIA DE BIMBO</div></div>'''
