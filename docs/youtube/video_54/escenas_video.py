"""Escenas del vídeo 54 (especial Navidad: los mantecados de Estepa). Motor común; sin logotipos ni envoltorios de marcas: mantecados genéricos."""
from base import *

CAP_ICONOS = {1: "1f33e", 2: "1f469", 3: "1f3ed", 4: "1f914", 5: "1f469-200d-1f373", 6: "1f4c5", 7: "1f6e1-fe0f", 8: "1f9e0"}

def mantecado(w=200, papel=True, d=.2, forma="redondo"):
    """Mantecado genérico: envuelto en papel de seda (papel=True) o al descubierto."""
    an = "" if d is None else f"animation:ePop .5s ease {d}s both;"
    rx, ry = (72, 72) if forma == "redondo" else (82, 56)
    if papel:
        dentro = (f'<path d="M20,100 Q10,40 60,25 L140,25 Q190,40 180,100 Q190,160 140,175 L60,175 Q10,160 20,100Z" fill="#fbf6ee" stroke="{TINTA}" stroke-width="4"/>'
                  f'<path d="M20,100 L4,70 M20,100 L2,128 M180,100 L196,70 M180,100 L198,128" stroke="{TINTA}" stroke-width="4"/>'
                  f'<path d="M60,60 Q100,80 140,60 M60,140 Q100,120 140,140" stroke="#d8cbb3" stroke-width="3" fill="none"/>')
    else:
        dentro = (f'<ellipse cx="100" cy="100" rx="{rx}" ry="{ry}" fill="#d9a86b" stroke="{TINTA}" stroke-width="4"/>'
                  f'<ellipse cx="100" cy="96" rx="{rx-14}" ry="{ry-14}" fill="#f1e2c8" opacity=".55"/>'
                  + "".join(f'<circle cx="{100 + (i*37) % (rx) - rx//2}" cy="{100 + (i*23) % (ry) - ry//2}" r="3" fill="#fff" opacity=".8"/>' for i in range(14)))
    return f'<svg width="{w}" height="{w}" viewBox="0 0 200 200" style="{an}">{dentro}</svg>'

def bandeja(d=.2):
    return "".join(obj(mantecado(230, i % 2 == 0, d + i * .15, "redondo" if i % 3 else "oval"), 18 + i * 13, 60 + (i % 2) * 6, "none", "bob", 0) for i in range(6))

def escenas():
    E = {}
    E["ma_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f36a", "2744-fe0f", "1f381"), "navidad", True, "mega")
    E["ma_septiembre"] = cifra("SEPTIEMBRE", "EN CASI TODA ESPAÑA, NADIE PIENSA EN LA NAVIDAD", "2600-fe0f")
    E["ma_hornos"] = lista([("1f525", "se encienden los hornos"), ("1f469-200d-1f373", "cientos de mujeres trabajando"), ("1f443", "huele a canela")], "PERO EN UN PUEBLO DE SEVILLA…")
    E["ma_estepa"] = f'''{F("navidad", True)}{bandeja()}{txt(kt("*ESTEPA*", "mega hueso", .3), 50, 24, 90)}{txt(kt("de la bandeja de Navidad de media España", "l naranja", 1.2), 50, 38, 80)}'''
    E["ma_colchona"] = icono_texto("1f469", "UNA MUJER: *«LA COLCHONA»*", "siglo XIX", "", "izq", "sepia", False, "pop", "bob")
    E["ma_historia"] = titular("LA HISTORIA DE LOS *MANTECADOS DE ESTEPA*", "", "", ("1f36a", "1f469", "1f3ed", "1f384"), "navidad", True, "xl")
    E["ma_receta"] = lista([("1f33e", "harina"), ("1f9c2", "azúcar"), ("1f437", "manteca de cerdo")], "MANTECA → MANTECADO")
    E["ma_andalucia"] = comparar("1f33e", "cereal", "1f416", "cerdo", "+", "SEGÚN SE CUENTA, EN ANDALUCÍA ABUNDABAN…")
    E["ma_matanza"] = icono_texto("267b-fe0f", "APROVECHARLO *TODO*", "la manteca de la matanza y la harina de la cosecha", "", "der", "calido", True, "pop", "bob")
    E["ma_almendra"] = icono_texto("1f330", "UN TERCER INGREDIENTE: *ALMENDRA*", "en Estepa la tenían a mano", "", "izq", "", False, "pop", "bob")
    E["ma_casero"] = icono_texto("1f3e0", "UN DULCE *CASERO*", "cada familia, a su manera", "", "der", "calido", True, "pop", "bob")
    E["ma_fragil"] = impacto("un problema muy serio:", "SE *DESHACÍAN*", "en carro, por caminos de tierra… llegaban hechos migas", "1f4a5")
    E["ma_micaela"] = icono_texto("1f469", "MICAELA RUIZ *TÉLLEZ*", "nuestra protagonista", "", "izq", "sepia", False, "up", "bob")
    E["ma_1821"] = cifra("1821", "NACE EN ESTEPA «LA COLCHONA»", "1f476")
    E["ma_secar"] = icono_texto("1f525", "SECAR EL MANTECADO *POR FUERA*", "el cambio que lo cambió todo", "según la historia que se cuenta en Estepa", "der", "calido", True, "pop", "glow")
    E["ma_firme"] = comparar("1f6e1-fe0f", "firme por fuera", "2601-fe0f", "tierno por dentro", "+", "Y AGUANTABA MUCHOS MÁS DÍAS")
    E["ma_viajar"] = impacto("y eso permitía algo nuevo:", "*VIAJAR*", "", "1f6e3-fe0f")
    E["ma_cordoba"] = flecha("1f3d8-fe0f", "1f3db-fe0f", "DE ESTEPA *A CÓRDOBA*", "su marido los llevaba a vender")
    E["ma_fabrica"] = cifra("HACIA 1850", "LA PRIMERA FÁBRICA DE MANTECADOS DE ESTEPA", "1f3ed", "según las fuentes")
    E["ma_contagia"] = lista([("1f440", "otras familias lo ven"), ("1f3e0", "abren obradores"), ("1f69a", "venden fuera")], "EL ÉXITO SE CONTAGIA")
    E["ma_capital"] = titular("LA CAPITAL *DEL MANTECADO*", "de obradores a fábricas, en el siglo XX", "", ("1f3ed", "1f36a", "1f451", "2728"))
    E["ma_veintena"] = cifra("~20 EMPRESAS", "CON EL SELLO DE LA INDICACIÓN GEOGRÁFICA", "1f3ed")
    E["ma_16"] = cifra("16 MILLONES DE KILOS", "OBJETIVO DE LA CAMPAÑA DE 2024", "2696-fe0f")
    E["ma_habitantes"] = comparar("1f36a", "16 millones de kilos", "1f3d8-fe0f", "unos 12.000 habitantes", "EN", "")
    E["ma_sigue"] = icono_texto("1f3ed", "LA FÁBRICA DE LA COLCHONA *SIGUE*", "la más antigua del pueblo, según la propia empresa", "", "izq", "sepia", False, "pop", "bob")
    E["ma_otros"] = lista([("1f3d8-fe0f", "Rute (Córdoba)"), ("1f3d8-fe0f", "Antequera (Málaga)")], "OTROS PUEBLOS MANTECADEROS")
    E["ma_duda"] = comparar("1f36a", "mantecado", "1f36a", "polvorón", "¿=?", "UNA DUDA CLÁSICA")
    E["ma_primos"] = impacto("los dos llevan harina, azúcar y manteca…", "SON PRIMOS, *NO GEMELOS*", "", "1f46f")
    E["ma_polvoron"] = f'''{F()}<div class="pos" style="left:26%;top:52%">{mantecado(520, False, .3, "oval")}</div>{txt(kt("EL *POLVORÓN*", "xl", .6), 70, 40, 46)}{txt(kt("con almendra, ovalado… y se deshace en polvo", "l naranja", 1.3), 70, 56, 46)}'''
    E["ma_mantecado"] = lista([("1f342", "canela"), ("1f34b", "limón"), ("1f36b", "cacao"), ("1f965", "coco")], "EL MANTECADO: REDONDO Y DE MIL SABORES")
    E["ma_apretar"] = f'''{F("calido", True)}<div class="pos" style="left:26%;top:52%">{mantecado(500, True, .3)}</div>{obj(spr("270a", 160), 42, 34, "drop", "shake", 1.0)}{txt(kt("EL TRUCO: *APRETARLO ANTES*", "xl", .6), 70, 46, 46)}'''
    E["ma_reto"] = bocadillos("1f633", ["Di una palabra difícil…", "…con un polvorón en la boca"], "un viejo reto navideño")
    E["ma_mujeres"] = impacto("detrás de cada mantecado hay,", "SOBRE TODO, *MUJERES*", "", "1f469")
    E["ma_mantecaeras"] = lista([("1f469-200d-1f373", "elaborar"), ("1f52a", "cortar"), ("1f381", "envolver"), ("1f4e6", "empaquetar")], "LAS «MANTECAERAS»")
    E["ma_familias"] = lista([("1f475", "la abuela"), ("1f469", "la madre"), ("1f467", "la hija")], "GENERACIONES EN LA CAMPAÑA")
    E["ma_estudio"] = icono_texto("1f393", "PARTE DE LA *IDENTIDAD DEL PUEBLO*", "una tradición que pasa de unas a otras", "un estudio publicado por la Complutense", "der", "", True, "pop", "bob")
    E["ma_papel"] = f'''{F("calido", True)}<div class="pos" style="left:26%;top:52%">{mantecado(500, True, .3)}</div>{txt(kt("PAPEL DE SEDA, *A MANO*", "xl", .6), 70, 38, 46)}{txt(kt("y parte del proceso sigue siendo manual", "l naranja", 1.3), 70, 62, 46)}'''
    E["ma_reto2"] = icono_texto("1f4c5", "POCOS MESES, *MUCHO TRABAJO*", "encontrar trabajadoras para esas semanas es un gran reto", "", "izq", "", False, "pop", "shake")
    E["ma_entiendes"] = impacto("ahora entenderás por qué", "LA NAVIDAD EMPIEZA *EN SEPTIEMBRE*", "", "1f4c5")
    E["ma_antes"] = flecha("2600-fe0f", "1f6d2", "FINALES DEL VERANO → *TIENDAS EN NOVIEMBRE*", "")
    E["ma_tresmeses"] = cifra("3 MESES", "A PLENO RENDIMIENTO: HORNO, CANELA Y ALMENDRA", "1f525")
    E["ma_octubre"] = comparar("1f455", "octubre, manga corta", "1f384", "y ya es Navidad", "+", "LLEGAR A ESTEPA EN OTOÑO")
    E["ma_turismo"] = lista([("1f6b6", "rutas por obradores"), ("1f3ea", "tiendas de fábrica"), ("1f4bc", "miles de empleos")], "EL PUEBLO LO APROVECHA")
    E["ma_termina"] = comparar("1f389", "el país empieza a celebrar", "1f3c1", "en Estepa, la campaña acaba", "Y", "DICIEMBRE")
    E["ma_imitaciones"] = icono_texto("1f46f", "«DE ESTEPA»… *DE CUALQUIER SITIO*", "también aparecieron imitaciones", "", "izq", "", False, "pop", "shake")
    E["ma_2011"] = cifra("2011", "IGP PARA LOS MANTECADOS DE ESTEPA (Y DESPUÉS, LOS POLVORONES)", "1f6e1-fe0f")
    E["ma_garantiza"] = icono_texto("1f3f7-fe0f", "UN SELLO *QUE GARANTIZA*", "hecho en Estepa y su comarca, con reglas concretas", "", "der", "calido", True, "pop", "bob")
    E["ma_normas"] = cifra("55 GRAMOS", "PESO MÁXIMO DE CADA MANTECADO, SEGÚN LAS NORMAS", "2696-fe0f")
    E["ma_diferencia"] = comparar("1f3f7-fe0f", "con sello de origen", "1f4b8", "mucho más baratos, de cualquier parte", "VS", "EN EL SUPERMERCADO")
    E["leccion1"] = leccion(1, "un pequeño cambio técnico", "*ABRE UN MERCADO ENTERO*", "1f525")
    E["leccion2"] = leccion(2, "un buen producto puede", "*CONVERTIR UN PUEBLO EN MARCA*", "1f3d8-fe0f")
    E["leccion3"] = leccion(3, "cuando tu nombre vale dinero,", "*PROTÉGELO*", "1f6e1-fe0f")
    E["ma_final"] = lista([("1f33e", "harina y manteca"), ("1f469", "La Colchona"), ("1f3db-fe0f", "Córdoba"), ("1f4c5", "Navidad en septiembre")], "")
    E["ma_aprieta"] = f'''{F("navidad", True)}{bandeja(.2)}{txt(kt("ACUÉRDATE *DE ESTEPA*", "xl hueso", .6), 50, 26, 90)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:30px;top:230px">{mantecado(330, True, None)}</div>
      <div style="position:absolute;left:250px;top:330px">{mantecado(280, False, None, "oval")}</div>
      <div style="position:absolute;left:330px;top:150px">{vicon("calendar", 150)}</div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">EL PUEBLO DONDE</div><div class="q" style="font-size:150px;margin-top:22px">LA NAVIDAD</div><div class="y">EMPIEZA EN SEPTIEMBRE</div></div>'''
