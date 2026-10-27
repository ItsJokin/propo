"""Escenas del vídeo 44 (Toyota, formato largo). Motor común; sin logotipos: telares y coches genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1fab5", 2: "1f9f6", 3: "1f1ec-1f1e7", 4: "1f527", 5: "1f522", 6: "1f4c9", 7: "1f6d2", 8: "1f6d1",
              9: "1f1fa-1f1f8", 10: "1f50b", 11: "26a0-fe0f", 12: "1f9e0"}

def telar(px=340, madera="#a0703e"):
    hilos = "".join(f'<line x1="{50 + i*10}" y1="40" x2="{50 + i*10}" y2="140" stroke="#e8e0c8" stroke-width="2"/>' for i in range(11))
    return (f'<svg width="{px}" height="{px*0.8:.0f}" viewBox="0 0 200 160"><rect x="30" y="20" width="12" height="130" fill="{madera}" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="158" y="20" width="12" height="130" fill="{madera}" stroke="{TINTA}" stroke-width="3"/><rect x="30" y="20" width="140" height="14" fill="{madera}" stroke="{TINTA}" stroke-width="3"/>'
            f'<rect x="20" y="138" width="160" height="14" fill="{madera}" stroke="{TINTA}" stroke-width="3"/>{hilos}<rect x="48" y="100" width="104" height="30" fill="#c94f4f" opacity=".85"/>'
            f'<rect x="44" y="78" width="112" height="8" fill="{madera}" stroke="{TINTA}" stroke-width="2"/></svg>')

def coche(px=380, color="#c8ccd2"):
    return (f'<svg width="{px}" height="{px*0.45:.0f}" viewBox="0 0 220 100"><path d="M10,70 L18,50 Q40,46 62,30 Q90,16 140,20 Q170,24 190,46 L210,52 L212,70Z" fill="{color}" stroke="{TINTA}" stroke-width="4"/>'
            f'<path d="M72,32 Q92,22 120,24 L120,46 L60,46Z M126,24 Q160,26 176,46 L126,46Z" fill="#bfe3f2" stroke="{TINTA}" stroke-width="3"/>'
            f'<circle cx="56" cy="72" r="16" fill="#222"/><circle cx="56" cy="72" r="6" fill="#bbb"/><circle cx="170" cy="72" r="16" fill="#222"/><circle cx="170" cy="72" r="6" fill="#bbb"/></svg>')

def escenas():
    E = {}
    E["to_mayor"] = f'''{F("", True)}{obj(coche(460), 30, 54, "left", "bob", .2)}{txt(kt("EL MAYOR FABRICANTE *DEL MUNDO*", "xl", .8), 72, 42, 48)}{txt(kt("por vehículos vendidos, desde hace años", "l", 1.4), 72, 58, 48)}'''
    E["to_metodo"] = comparar("1f393", "un método que se estudia en todo el mundo", "1f697", "uno de los coches más vendidos", "+")
    E["to_telares"] = f'''{F("sepia", True)}{obj(telar(360), 30, 50, "drop", "", .2)}{txt(kt("NO EMPEZÓ CON COCHES: *TELARES*", "xl", .8), 70, 46, 52)}<div class="viñeta"></div>'''
    E["to_nombre"] = icono_texto("1f522", "UN NOMBRE CAMBIADO *POR UN NÚMERO*", "de la suerte, según la propia empresa", "", "izq", "", True, "pop", "bob")
    E["to_super"] = icono_texto("1f6d2", "INSPIRADO *EN UN SUPERMERCADO*", "su famoso sistema de producción", "", "der", "", False, "pop", "bob")
    E["to_historia"] = titular("LA HISTORIA DE *TOYOTA*", "", "", ("1f697", "1f9f6", "1f522", "1f6d2"), "", True, "xl")
    E["to_sakichi"] = icono_texto("1f466", "SAKICHI *TOYODA*", "1867, centro de Japón · hijo de un carpintero", "", "izq", "sepia", False, "up", "bob", 380, (("1fa9a", 86, 80),))
    E["to_madre"] = f'''{F("sepia")}{obj(telar(320), 30, 52, "pop", "", .2)}{obj(spr("1f469", 160), 18, 62, "pop", "bob", .5)}{txt(kt("SU MADRE TEJÍA *A MANO*", "xl", .8), 70, 42, 52)}{txt(kt("un trabajo lento y agotador", "l", 1.4), 70, 58, 52)}<div class="viñeta"></div>'''
    E["to_decidio"] = impacto("Sakichi decidió", "INVENTAR *UNA MÁQUINA*", "para hacerlo más fácil", "1f4a1")
    E["to_1891"] = cifra("1891", "SU PRIMER TELAR DE MADERA PATENTADO", "1f4dc")
    E["to_inventor"] = titular("UNO DE LOS GRANDES *INVENTORES DE JAPÓN*", "", "", ("1f1ef-1f1f5", "1f4a1", "1fab5", "2728"), "", True, "xl")
    E["to_tipog"] = cifra("1924", "TELAR AUTOMÁTICO: EL MODELO G", "2699-fe0f")
    E["to_hilo"] = f'''{F("", True)}{obj(telar(320), 30, 52, "pop", "", .2)}{obj(spr("1f6d1", 150), 30, 24, "zoom", "glow", .9)}{txt(kt("SI EL HILO SE ROMPE, *SE PARA SOLA*", "xl", 1.1), 70, 46, 52)}'''
    E["to_vigilar"] = comparar("2705", "nada de tela defectuosa", "1f9d1", "una persona, muchas máquinas", "+")
    E["to_jidoka"] = titular("*JIDOKA*", "la máquina se para al detectar un problema", "", ("1f6d1", "2699-fe0f", "1f440", "2728"))
    E["to_pilar"] = icono_texto("1f3db-fe0f", "UN PILAR *DEL MÉTODO TOYOTA*", "décadas después", "", "der", "", True, "pop", "bob")
    E["to_inglaterra"] = flecha("1f1ef-1f1f5", "1f1ec-1f1e7", "LLAMA LA ATENCIÓN *EN INGLATERRA*", "la cuna de la industria textil")
    E["to_platt"] = cifra("100.000 £", "1929: PLATT BROTHERS COMPRA LA PATENTE", "1f4dc", "según la propia Toyota")
    E["to_dinero"] = impacto("", "MUCHÍSIMO *DINERO*", "", "1f4b0")
    E["to_coches"] = bocadillos("1f474", ["Usa este dinero…", "…para los automóviles"], "a su hijo Kiichiro, según se cuenta")
    E["to_muere"] = icono_texto("1f56f-fe0f", "1930: *MUERE SAKICHI*", "sin ver un solo coche de su familia", "", "izq", "dark", False, "pop", "glow")
    E["to_kiichiro"] = icono_texto("1f468-200d-1f527", "KIICHIRO *TOYODA*", "ingeniero; viajó por EE. UU. y Europa", "", "der", "", False, "up", "bob")
    E["to_division"] = cifra("1933", "UNA DIVISIÓN DE AUTOMÓVILES DENTRO DE LA DE TELARES", "1f3ed")
    E["to_desmontar"] = icono_texto("1f527", "DESMONTAR COCHES *PIEZA A PIEZA*", "para entender cómo funcionaban", "", "izq", "", False, "spin", "bob")
    E["to_aa"] = lista([("2699-fe0f", "un motor"), ("1f6e0-fe0f", "un prototipo"), ("1f697", "1936: el modelo AA")], "")
    E["to_americano"] = comparar("1f1fa-1f1f8", "inspirado en los americanos", "1f1ef-1f1f5", "pero construido por ellos", "+")
    E["to_falta"] = impacto("faltaba", "EL *NOMBRE*", "", "1f3f7-fe0f")
    E["to_concurso"] = icono_texto("1f4e8", "UN CONCURSO *PÚBLICO*", "miles de propuestas de logotipo", "según la propia empresa", "der", "", False, "pop", "bob")
    E["to_dt"] = f'''{F("", True)}{txt('<div class="mega" style="text-decoration:line-through;color:#8A8F98">TOYODA</div>', 30, 42, 40, "center", .2, "pop")}{txt('<div class="vs" style="--d:.8s">→</div>', 52, 42, 10)}{txt(kt("TOYOTA", "mega rojo", 1.1, .12, "slam"), 74, 42, 40)}{txt(kt("de «de» a «te»", "l", 1.7), 50, 66, 80)}'''
    E["to_ocho"] = f'''{F("calido", True)}{txt(kt("8", "mega rojo", .3, .1, "slam"), 30, 44, 30)}{txt(kt("TRAZOS EN KATAKANA", "xl", .8), 66, 40, 56)}{txt(kt("y además «sonaba más claro», según la explicación oficial", "l", 1.4), 66, 56, 56)}'''
    E["to_suerte"] = icono_texto("1f340", "EL 8: *NÚMERO DE LA SUERTE*", "se ensancha hacia abajo: algo que crece y prospera", "en Japón", "izq", "", True, "pop", "spin-slow")
    E["to_separar"] = comparar("1f3ed", "el negocio", "1f3e0", "la vida de la familia", "≠")
    E["to_1937"] = cifra("1937", "NACE TOYOTA MOTOR COMPANY", "1f382")
    E["to_guerra"] = lista([("1f69a", "camiones para el ejército"), ("1f4a5", "bombardeos")], "LA SEGUNDA GUERRA MUNDIAL")
    E["to_quiebra"] = cifra("1950", "TOYOTA, AL BORDE DE LA QUIEBRA", "1f4c9")
    E["to_huelgas"] = comparar("1f4dd", "despidos", "270a", "huelgas muy duras", "→")
    E["to_dimite"] = icono_texto("1f647", "KIICHIRO *DIMITE*", "había prometido no despedir a nadie", "", "izq", "dark", False, "pop", "")
    E["to_muere2"] = icono_texto("1f56f-fe0f", "1952: *MUERE KIICHIRO*", "tampoco vio el gran éxito", "", "der", "dark", False, "pop", "glow")
    E["to_corea"] = icono_texto("1f69a", "LOS CAMIONES *DE LA GUERRA DE COREA*", "salvan a Toyota de la ruina", "pedidos del ejército de EE. UU.", "izq", "", False, "left", "bob")
    E["to_almacenes"] = comparar("1f3ed", "EE. UU.: almacenes llenos de piezas", "1f4b8", "Toyota: sin dinero para eso", "VS")
    E["to_ohno"] = icono_texto("1f468-200d-1f4bc", "TAIICHI *OHNO*", "buscó otra forma de trabajar", "ingeniero", "der", "", False, "up", "bob")
    E["to_supermercado"] = icono_texto("1f6d2", "UN SUPERMERCADO *AMERICANO*", "su inspiración, según contó él mismo", "", "izq", "calido", True, "pop", "bob")
    E["to_reponer"] = flecha("1f6d2", "1f4e6", "SE COGE LO QUE SE NECESITA… *Y SE REPONE*", "no se acumula nada")
    E["to_kanban"] = f'''{F()}{"".join(f'<div class="pos" style="left:{22 + i*18}%;top:46%;width:200px;height:260px;background:#fff;border:5px solid {TINTA};transform:translate(-50%,-50%) rotate({(-6, 3, -2, 5)[i]}deg);box-shadow:8px 8px 0 rgba(0,0,0,.12);animation:wPop .4s ease {.2 + i*.3}s both"></div>' for i in range(4))}{txt(kt("KANBAN", "mega", 1.4, .12, "slam"), 50, 46, 90)}{txt(kt("solo lo que hace falta, cuando hace falta", "l", 1.8), 50, 82, 90)}'''
    E["to_justo"] = comparar("23f1-fe0f", "justo a tiempo", "1f6d1", "la máquina que se para", "+", "EL SISTEMA DE PRODUCCIÓN TOYOTA")
    E["to_detalle"] = impacto("un detalle que sorprendía", "A LOS *VISITANTES*", "", "1f440")
    E["to_cuerda"] = icono_texto("1faa2", "UNA CUERDA *EN LA LÍNEA*", "cualquiera podía tirar de ella", "", "izq", "", False, "drop", "swing")
    E["to_para"] = impacto("", "Y LA LÍNEA *SE PARABA*", "", "1f6d1")
    E["to_obligacion"] = comparar("1f6ab", "en otras fábricas: impensable", "2705", "en Toyota: obligatorio", "VS")
    E["to_misma"] = comparar("1f9f6", "el telar de Sakichi", "1f697", "la línea de montaje", "=", "LA MISMA IDEA")
    E["to_kaizen"] = titular("*KAIZEN*", "mejora continua: pequeñas mejoras, siempre", "", ("1f4c8", "1f4a1", "1f477", "2728"))
    E["to_1957"] = cifra("1957", "TOYOTA INTENTA VENDER EN EE. UU.", "1f1fa-1f1f8")
    E["to_potencia"] = lista([("1f40c", "poca potencia"), ("1f321-fe0f", "se recalentaba"), ("1f4e2", "mucho ruido")], "UN FRACASO EN LAS AUTOPISTAS")
    E["to_corolla"] = f'''{F("", True)}{obj(coche(440, "#e8e2d0"), 32, 54, "left", "bob", .2)}{txt(kt("1966: EL *COROLLA*", "xl", .8), 72, 42, 48)}{txt(kt("pequeño, fiable y económico", "l", 1.4), 72, 58, 48)}'''
    E["to_petroleo"] = icono_texto("26fd", "LA CRISIS *DEL PETRÓLEO*", "y todos buscan coches que gasten poco", "años setenta", "izq", "", False, "pop", "bob")
    E["to_millones"] = cifra("DECENAS DE MILLONES", "DE COROLLAS: DE LOS COCHES MÁS VENDIDOS DE LA HISTORIA", "1f3c6")
    E["to_lujo"] = comparar("1f697", "Toyota: barato y práctico", "1f48e", "¿lujo?", "≠", "1989")
    E["to_lexus"] = titular("*LEXUS*", "una marca nueva para el lujo", "", ("1f48e", "1f697", "2728", "1f3c6"))
    E["to_prius"] = comparar("26fd", "gasolina", "1f50b", "electricidad", "+", "1997: PRIUS, EL PRIMER HÍBRIDO EN SERIE")
    E["to_escepticismo"] = icono_texto("1f928", "AL PRINCIPIO, *ESCEPTICISMO*", "después, una de sus grandes bazas", "", "der", "", False, "pop", "swing")
    E["to_taxis"] = f'''{F("calido")}{obj(skyline(1800, "#8a5a3b"), 50, 88, "none")}<div class="carrera" style="--d:.2s">{spr("1f695", 220)}</div><div class="carrera" style="--d:1.1s">{spr("1f695", 180)}</div>{txt(kt("TAXIS HÍBRIDOS *EN MEDIO MUNDO*", "xl", .8), 50, 22, 90)}'''
    E["to_mirai"] = icono_texto("1f4a7", "HIDRÓGENO: *SOLO EXPULSA AGUA*", "eléctricos y hasta un coche de hidrógeno", "", "izq", "", True, "pop", "bob")
    E["to_crisis"] = impacto("2009-2010:", "SU PEOR *CRISIS DE IMAGEN*", "", "26a0-fe0f")
    E["to_revision"] = cifra("MILLONES", "DE COCHES LLAMADOS A REVISIÓN", "1f527", "aceleraciones repentinas")
    E["to_akio"] = icono_texto("1f468-200d-1f4bc", "AKIO TOYODA *PIDE DISCULPAS*", "ante el Congreso de Estados Unidos", "nieto de Kiichiro", "der", "", False, "pop", "")
    E["to_golpe"] = icono_texto("1f494", "UN GOLPE *DURÍSIMO*", "para una marca construida sobre la fiabilidad", "", "izq", "dark", False, "pop", "")
    E["to_vuelve"] = icono_texto("1f3c6", "DE VUELTA *A LO MÁS ALTO*", "con controles de calidad reforzados", "", "der", "", True, "pop", "bob")
    E["leccion1"] = leccion(1, "lo que sabes en un sector", "*SIRVE EN OTRO*", "1f9f6")
    E["leccion2"] = leccion(2, "pararse a tiempo", "*AHORRA MUCHO MÁS*", "1f6d1")
    E["leccion3"] = leccion(3, "las ideas vienen de", "*SITIOS INESPERADOS*", "1f6d2")
    E["to_final"] = lista([("1f469", "una madre"), ("1f9f6", "un telar"), ("1f1ec-1f1e7", "una patente"), ("1f522", "un 8"), ("1f6d2", "un supermercado")], "")
    E["to_telar2"] = f'''{F("calido", True)}{obj(telar(340), 30, 50, "drop", "float", .2)}{txt(kt("TODO EMPEZÓ CON *UN TELAR DE MADERA*", "xl", .9), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:40px;top:90px">{telar(340)}</div>
      <div style="position:absolute;left:120px;top:420px">{coche(420)}</div>
      <div class="big" style="top:100px"><div class="s">DE UN TELAR DE MADERA</div><div class="q" style="font-size:150px;margin-top:22px">AL Nº1</div><div class="q" style="font-size:150px">DEL MUNDO</div><div class="y">LA HISTORIA DE TOYOTA</div></div>'''
