"""Escenas del vídeo 25 (Red Bull, formato largo). Motor común; sin logotipos (nunca dos toros con un sol): latas y objetos genéricos."""
from base import *

CAP_ICONOS = {1: "1f1f9-1f1ed", 2: "1faa5", 3: "1f91d", 4: "1f4cb", 5: "1fabd", 6: "1f1eb-1f1f7", 7: "1f3c2", 8: "1fa82", 9: "1f3ce-fe0f",
              10: "2696-fe0f", 11: "1f3f0", 12: "1f9e0"}

def lata(px=170, color="#1f3c88", franja="#c9ced6"):
    return (f'<svg width="{px}" height="{px*2.1:.0f}" viewBox="0 0 80 168"><rect x="8" y="10" width="64" height="150" rx="10" fill="{franja}" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="8" y="10" width="32" height="150" rx="10" fill="{color}"/><rect x="40" y="10" width="32" height="150" fill="{franja}"/>'
            + "".join(f'<rect x="{8 + i*16}" y="10" width="16" height="150" fill="{color if i % 2 == 0 else franja}"/>' for i in range(4)) +
            f'<rect x="12" y="2" width="56" height="12" rx="4" fill="#aeb4bd"/><rect x="8" y="10" width="64" height="150" rx="10" fill="none" stroke="{TINTA}" stroke-width="3"/></svg>')

def botellita(px=120):
    return (f'<svg width="{px}" height="{px*2:.0f}" viewBox="0 0 60 120"><path d="M22,4 h16 v20 c0,6 12,10 12,22 v62 c0,6 -4,10 -10,10 h-20 c-6,0 -10,-4 -10,-10 v-62 c0,-12 12,-16 12,-22z" '
            f'fill="#c26a1a" fill-opacity=".85" stroke="{TINTA}" stroke-width="3"/><rect x="10" y="62" width="40" height="30" fill="#f2c94c"/><rect x="20" y="0" width="20" height="8" fill="#d0d0d0"/></svg>')

def escenas():
    E = {}
    E["rb_lata"] = f'''{F("", True)}{obj(lata(190), 28, 50, "drop", "float", .2)}{obj(spr("1fabd", 160), 44, 26, "pop", "float", .8)}{txt(kt("UNA LATA QUE PROMETE *DARTE ALAS*", "xl", .9), 70, 46, 52)}'''
    E["rb_presencia"] = lista([("1f3ce-fe0f", "Fórmula 1"), ("26bd", "fútbol"), ("1f3c2", "deportes extremos"), ("1fa82", "un salto desde el espacio")], "MILES DE MILLONES DE LATAS")
    E["rb_austria"] = comparar("1f1e6-1f1f9", "su sede está en Austria", "1f6ab", "pero no se inventó allí", "…")
    E["rb_tailandia"] = icono_texto("1f1f9-1f1ed", "NACIÓ EN *TAILANDIA*", "para camioneros y trabajadores de turnos larguísimos", "", "izq", "", True, "pop", "bob", 340, (("1f69a", 86, 80),))
    E["rb_ejecutivo"] = flecha("1f9d1-200d-1f4bc", "1f4b0", "UN EJECUTIVO CANSADO… *EL NEGOCIO DE SU VIDA*", "")
    E["rb_historia"] = titular("UNA EMPRESA DE *ENTRETENIMIENTO*", "que también vende bebidas", "", ("1f3a5", "1f3ce-fe0f", "1f3c2", "1fabd"), "", True, "xl")
    E["rb_70"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 86, "none")}{txt(kt("TAILANDIA, AÑOS SETENTA", "mega", .3, .1, "slam"), 50, 32, 95)}{obj(spr("1f1f9-1f1ed", 150), 86, 62, "pop", "bob", .8)}'''
    E["rb_chaleo"] = icono_texto("1f468-200d-1f4bc", "CHALEO *YOOVIDHYA*", "de origen humilde: de vender medicamentos a fundar su farmacéutica", "", "izq", "", True, "up", "bob")
    E["rb_1976"] = f'''{F("", True)}{obj(botellita(160), 26, 50, "drop", "bob", .2)}{txt(kt("1976", "mega rojo", .6, .1, "slam"), 66, 32, 56)}{txt(kt("una bebida tónica en botellitas", "xl", 1.0), 66, 52, 56)}{txt(kt("cafeína · azúcar · taurina", "l", 1.6), 66, 68, 56)}'''
    E["rb_krating"] = f'''{F("calido", True)}{obj(spr("1f403", 260), 28, 46, "left", "bob", .2)}{txt(kt("*KRATING DAENG*", "xl", .7), 68, 38, 56)}{txt(kt("un gran bóvido salvaje rojizo: «toro rojo»", "l", 1.3), 68, 56, 56)}'''
    E["rb_etiqueta"] = icono_texto("1f3f7-fe0f", "LA ETIQUETA", "dos animales embistiéndose frente a un sol", "", "der", "", False, "pop", "swing")
    E["rb_trabajar"] = lista([("1f69a", "camioneros"), ("1f477", "obreros"), ("1f9d1-200d-1f33e", "agricultores")], "UNA BEBIDA PARA TRABAJAR")
    E["rb_exito_th"] = icono_texto("1f4c8", "UN ÉXITO *EN TAILANDIA*", "", "", "izq", "", True, "zoom", "bob")
    E["rb_mateschitz"] = icono_texto("1f468-200d-1f4bc", "DIETRICH *MATESCHITZ*", "ejecutivo de marketing en Austria", "", "der", "", True, "up", "bob", 340, (("1f1e6-1f1f9", 14, 22),))
    E["rb_pasta"] = icono_texto("1faa5", "VENDÍA *PASTA DE DIENTES*", "para una empresa alemana; viajaba mucho por Asia", "", "izq", "", False, "pop", "bob")
    E["rb_jetlag"] = f'''{F("dark", True)}{obj(spr("1f62b", 240), 26, 46, "pop", "", .2)}{obj(spr("2708-fe0f", 160), 44, 26, "left", "", .6)}{txt(kt("AGOTADO *POR EL CAMBIO DE HORARIO*", "xl hueso", .9), 68, 46, 56)}'''
    E["rb_recomienda"] = icono_texto("1f5e3-fe0f", "«PRUEBA *UNA DE ESTAS*»", "bebidas tónicas de cualquier tienda", "", "der", "", True, "pop", "bob", 340, (("1f37e", 14, 80),))
    E["rb_efecto"] = icono_texto("1f929", "SE LE PASÓ *EL CANSANCIO*", "según contaba él mismo", "", "izq", "calido", True, "zoom", "glow")
    E["rb_investiga"] = comparar("1f30f", "en Asia: muy populares", "1f30d", "en Europa: no existían", "≠")
    E["rb_oportunidad"] = impacto("Mateschitz vio", "UNA OPORTUNIDAD *ENORME*", "", "1f4a1")
    E["rb_contacto"] = flecha("1f1f9-1f1ed", "1f1e6-1f1f9", "LE PROPONE *LLEVARLA A OCCIDENTE*", "")
    E["rb_1984"] = anio(1900, 1984, "llegan a un acuerdo", "1f91d")
    E["rb_49"] = f'''{F("", True)}{txt(kt("49 %", "mega rojo", .2, .1, "slam"), 24, 40, 30)}{txt(kt("Mateschitz", "l", .7), 24, 58, 30)}{txt(kt("49 %", "mega rojo", .9, .1, "slam"), 54, 40, 30)}{txt(kt("Chaleo", "l", 1.3), 54, 58, 30)}{txt(kt("2 %", "xl", 1.6), 82, 40, 20)}{txt(kt("su hijo", "l", 2.0), 82, 58, 20)}
      {txt(kt("unos *500.000 $* cada uno", "xl", 2.3), 50, 82, 80)}'''
    E["rb_deja"] = icono_texto("1f6aa", "DEJA *SU TRABAJO*", "y se pone al frente", "", "izq", "", False, "pop", "")
    E["rb_noimporta"] = impacto("no se limitó a", "IMPORTARLA", "", "1f6a2")
    E["rb_adapta"] = f'''{F()}{obj(botellita(150), 22, 50, "pop", "", .2)}{txt('<div class="vs" style="--d:.8s">→</div>', 40, 48, 10)}{obj(lata(150), 56, 50, "pop", "bob", 1.0)}
      {txt(kt("CON GAS · OTRO SABOR · *UNA LATA PEQUEÑA*", "xl", 1.4), 80, 46, 38)}'''
    E["rb_nombre"] = f'''{F("calido", True)}{obj(spr("1f402", 260), 26, 46, "left", "", .2)}{txt(kt("«KRATING DAENG» →", "l", .5), 66, 34, 56)}{txt(kt("*RED BULL*", "mega", .9, .12, "slam"), 66, 52, 56)}{txt(kt("toro rojo", "l", 1.5), 66, 68, 56)}'''
    E["rb_estudios"] = icono_texto("1f4cb", "ESTUDIOS *DE MERCADO*", "antes del lanzamiento", "", "izq", "", False, "pop", "bob")
    E["rb_desastre"] = lista([("1f922", "el sabor"), ("1f3f7-fe0f", "el nombre"), ("1f9e0", "«estimular el cerebro»")], "NO GUSTABA NADA: RESULTADOS DESASTROSOS")
    E["rb_abandonar"] = icono_texto("1f5d1-fe0f", "CUALQUIERA *LO HABRÍA DEJADO*", "", "", "der", "", False, "pop", "")
    E["rb_sigue"] = impacto("", "MATESCHITZ *SIGUIÓ ADELANTE*", "", "1f4aa")
    E["rb_permisos"] = icono_texto("1f4dc", "≈3 AÑOS *DE PERMISOS*", "por los ingredientes que contenía", "", "izq", "", False, "flip", "")
    E["rb_1987"] = fecha("1", "ABRIL", "1987", "sale a la venta en Austria", "1f1e6-1f1f9")
    E["rb_distinta"] = lista([("1f4b8", "más cara"), ("1f90f", "más pequeña"), ("2753", "sin parecido a nada")], "")
    E["rb_publicista"] = icono_texto("1f9d1-200d-1f4bc", "UN AMIGO *PUBLICISTA*", "", "para el eslogan:", "izq", "", True, "up", "bob")
    E["rb_alas"] = f'''{F("calido", True)}{obj(spr("1fabd", 280), 28, 46, "pop", "float", .2)}{txt(kt("«TE DA *ALAS*»", "mega", .8, .12, "slam"), 68, 46, 56)}'''
    E["rb_forma"] = impacto("y la forma de anunciarse fue", "TAN ORIGINAL *COMO EL PRODUCTO*", "", "1f4a1")
    E["rb_jovenes"] = lista([("1f393", "universidades"), ("1faa9", "discotecas"), ("26fd", "gasolineras"), ("26f7-fe0f", "pistas de esquí")], "DONDE ESTABAN LOS JÓVENES")
    E["rb_estudiantes"] = icono_texto("1f9d1-200d-1f393", "ESTUDIANTES *EMBAJADORES*", "fiestas y latas gratis", "", "der", "", True, "pop", "bob")
    E["rb_coches"] = f'''{F("", True)}<div class="carrera" style="--d:.2s">{spr("1f697", 260)}</div>{obj(lata(110), 50, 30, "drop", "bob", .6)}{txt(kt("COCHES CON *UNA LATA GIGANTE*", "xl", 1.0), 50, 14, 90)}'''
    E["rb_papeleras"] = icono_texto("1f5d1-fe0f", "LATAS VACÍAS *EN LAS PAPELERAS*", "de los sitios de moda, para que pareciera que todos la bebían", "", "izq", "", False, "pop", "bob")
    E["rb_fiesta"] = flecha("1f69a", "1faa9", "DE LOS CAMIONEROS… *A LAS NOCHES DE FIESTA*", "")
    E["rb_expansion"] = impacto("la expansión por Europa", "NO FUE *FÁCIL*", "", "1f6a7")
    E["rb_desconfian"] = comparar("2615", "cafeína", "1f9ea", "taurina", "+", "AUTORIDADES SANITARIAS DESCONFIADAS")
    E["rb_francia"] = icono_texto("1f1eb-1f1f7", "FRANCIA: *HASTA 2008*", "no llegó a sus tiendas con la receta original", "", "izq", "", False, "pop", "", 300)
    E["rb_dinamarca"] = icono_texto("1f1e9-1f1f0", "TAMBIÉN *DINAMARCA*", "y otros países", "", "der", "", False, "pop", "", 300)
    E["rb_leyenda"] = bocadillos("1f914", ["Si está prohibida…", "…será muy potente"], "las prohibiciones alimentaron la leyenda")
    E["rb_maleta"] = icono_texto("1f9f3", "LATAS *EN LA MALETA*", "viajeros que cruzaban fronteras", "", "izq", "", True, "drop", "bob")
    E["rb_aventura"] = titular("SINÓNIMO DE *AVENTURA*", "la gran jugada", "", ("1f3c2", "1fa82", "1f3cd-fe0f", "1f6b5"), "", True, "xl")
    E["rb_extremos"] = f'''{F()}{"".join(obj(spr(c, 170), 14 + i * 24, 44, "pop", "bob", .2 + i * .3) for i, c in enumerate(["1f3c2", "1fa82", "1f3cd-fe0f", "1f6b5"]))}{txt(kt("DEPORTES QUE *CASI NADIE APOYABA*", "xl", 1.4), 50, 78, 90)}'''
    E["rb_eventos"] = icono_texto("1f3aa", "SUS *PROPIOS EVENTOS*", "", "después:", "der", "", True, "zoom", "")
    E["rb_flugtag"] = f'''{F("", True)}<div class="pos" style="left:50%;top:84%;width:1920px;height:180px;background:#5aa0e8;opacity:.6"></div>{obj(spr("1f6e9-fe0f", 200), 30, 44, "left", "float", .2)}{obj(spr("1f4a6", 160), 46, 72, "drop", "", 1.2)}
      {txt(kt("MÁQUINAS VOLADORAS CASERAS… *AL AGUA*", "xl", .8), 70, 30, 56)}'''
    E["rb_contenido"] = comparar("1f3f7-fe0f", "no su logo en eventos ajenos", "1f3a5", "eventos propios, grabados como contenido", "→")
    E["rb_espectaculo"] = titular("LA MARCA ES *EL ESPECTÁCULO*", "", "", ("1f3a5", "1f3c2", "1f3c6", "2728"), "", True, "xl")
    E["rb_directo"] = fecha("14", "OCTUBRE", "2012", "millones de personas, en directo por internet", "1f4fa")
    E["rb_baumgartner"] = f'''{F("espacio", True)}{obj(spr("1f388", 200), 28, 30, "rise", "float", .2)}{txt(kt("FELIX *BAUMGARTNER*", "xl hueso", .6), 66, 36, 56)}{txt(kt("≈39 KM", "mega naranja", 1.1, .1, "slam"), 66, 56, 56)}{txt(kt("de altura, en una cápsula bajo un globo", "l hueso", 1.7), 66, 72, 56)}'''
    E["rb_salta"] = f'''{F("espacio", True)}{obj(spr("1f30d", 320), 50, 96, "rise", "spin-slow", .2)}{obj(spr("1fa82", 200), 50, 34, "drop", "float", .6)}{txt(kt("DESDE EL BORDE *DE LA ESTRATOSFERA*", "xl hueso", 1.0), 50, 12, 90)}'''
    E["rb_sonido"] = icono_texto("1f4a8", "MÁS RÁPIDO *QUE EL SONIDO*", "en caída libre, sin ningún vehículo", "", "izq", "espacio", True, "pop", "shake")
    E["rb_aterriza"] = icono_texto("1f3dc-fe0f", "ATERRIZA *SANO Y SALVO*", "en el desierto de Nuevo México", "", "der", "calido", True, "drop", "bob")
    E["rb_financia"] = icono_texto("1f4b0", "LO PAGÓ Y ORGANIZÓ *RED BULL*", "", "", "izq", "", True, "zoom", "glow")
    E["rb_marketing"] = comparar("1f3c6", "una de las acciones de marketing más impresionantes", "1f648", "y apenas se vio una lata", "·")
    E["rb_compra"] = impacto("más allá del patrocinio:", "EQUIPOS *ENTEROS*", "", "1f3c6")
    E["rb_f1"] = cifra("2005", "SU PROPIO EQUIPO DE FÓRMULA 1", "1f3ce-fe0f")
    E["rb_campeones"] = icono_texto("1f3c6", "UNA BEBIDA, *CAMPEONA DEL MUNDO*", "pilotos y constructores, varios años: con Vettel y con Verstappen", "", "der", "", True, "drop", "glow")
    E["rb_futbol"] = lista([("1f1e9-1f1ea", "Leipzig"), ("1f1e6-1f1f9", "Salzburgo"), ("26bd", "y más")], "EQUIPOS DE FÚTBOL")
    E["rb_media"] = lista([("1f4f0", "revistas"), ("1f3ac", "documentales"), ("1f4fa", "retransmisiones")], "UNA PRODUCTORA PROPIA")
    E["rb_medios"] = comparar("1f4fa", "una empresa de medios…", "1f964", "…que también vende bebidas", "+")
    E["rb_polemica"] = impacto("tanto éxito también tiene", "SU *POLÉMICA*", "", "2696-fe0f")
    E["rb_demanda"] = icono_texto("2696-fe0f", "UNA DEMANDA *EN EE. UU.*", "¿exageraba la publicidad los beneficios?", "", "izq", "", False, "drop", "swing")
    E["rb_acuerdo"] = cifra("≈13 M$", "ACUERDO EN 2014, SIN ADMITIR CULPA", "1f91d")
    E["rb_azucar"] = comparar("1f36c", "azúcar", "2615", "cafeína", "+", "CRÍTICAS, SOBRE TODO CON ADOLESCENTES")
    E["rb_menores"] = icono_texto("1f51e", "MODERAR *EL CONSUMO*", "algunos países limitan su venta a menores", "", "der", "", False, "pop", "")
    E["rb_muere"] = icono_texto("1f56f-fe0f", "MATESCHITZ MUERE *EN 2022*", "el hombre más rico de Austria", "", "izq", "dark", False, "pop", "glow")
    E["rb_chaleo_muere"] = icono_texto("1f56f-fe0f", "CHALEO, *DIEZ AÑOS ANTES*", "uno de los hombres más ricos de Tailandia", "", "der", "dark", False, "pop", "glow")
    E["rb_12mil"] = f'''{F("", True)}{"".join(obj(lata(70), 6 + i * 6.4, 40 + (i % 2) * 8, "drop", "", .05 + i * .05) for i in range(15))}{txt(kt("+12.000 MILLONES *DE LATAS AL AÑO*", "xl", 1.2), 50, 80, 90)}'''
    E["rb_original"] = f'''{F("calido", True)}{obj(botellita(170), 28, 50, "pop", "bob", .2)}{txt(kt("¿Y LA ORIGINAL?", "xl", .6), 66, 36, 56)}{txt(kt("sigue en Asia, *en botellitas, sin gas*", "xl", 1.2), 66, 54, 56)}'''
    E["leccion1"] = leccion(1, "la gran idea puede existir ya en otro lugar", "EL MÉRITO: *SABER ADAPTARLA*", "1f30f")
    E["leccion2"] = leccion(2, "un estudio de mercado", "NO SIEMPRE *TIENE RAZÓN*", "1f4cb")
    E["leccion3"] = leccion(3, "la mejor publicidad", "ES ALGO QUE LA GENTE *QUIERE VER*", "1f3a5")
    E["rb_final"] = lista([("1f69a", "camioneros"), ("2708-fe0f", "un jet lag"), ("1f4cb", "un estudio desastroso"), ("1fa82", "un salto")], "")
    E["rb_asi"] = titular("ASÍ SE HIZO *RED BULL*", "", "", ("1f402", "1fabd", "1f3ce-fe0f", "2728"))
    return E

def miniatura():
    return f'''<div class="fondo" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:120px">{botellita(200)}</div>
      <div style="position:absolute;left:240px;top:250px">{vicon("delivery-truck", 200)}</div>
      <div class="big" style="top:100px"><div class="s">RED BULL NO NACIÓ</div><div class="q" style="font-size:170px;margin-top:22px">EN EUROPA</div><div class="y">ERA PARA CAMIONEROS</div></div>'''
