"""Escenas del vídeo 34 (Heinz, formato largo). Motor común; sin logotipos: botellas y frascos genéricos dibujados."""
from base import *

CAP_ICONOS = {1: "1f955", 2: "1fad9", 3: "1f4c9", 4: "1f41f", 5: "1f345", 6: "2696-fe0f", 7: "1f522", 8: "1f952",
              9: "1f3ed", 10: "1f44a", 11: "1f30d", 12: "1f9e0"}

def botella(px=200, num="57"):
    return (f'<svg width="{px}" height="{px*2.4:.0f}" viewBox="0 0 100 240"><path d="M38,8 L62,8 L62,30 Q64,60 82,90 L86,220 Q86,232 74,232 L26,232 Q14,232 14,220 L18,90 Q36,60 38,30Z" fill="#c8241f" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="36" y="2" width="28" height="14" rx="3" fill="#f3f3f3" stroke="{TINTA}" stroke-width="3"/><path d="M40,40 L60,40 L58,58 L42,58Z" fill="#fff"/><text x="50" y="55" font-family="Bebas" font-size="15" fill="{TINTA}" text-anchor="middle">{num}</text>'
            f'<path d="M24,120 L76,120 L72,170 L50,180 L28,170Z" fill="#fff" stroke="{TINTA}" stroke-width="3"/><text x="50" y="152" font-family="Bebas" font-size="14" fill="{TINTA}" text-anchor="middle">KÉTCHUP</text>'
            f'<path d="M22,96 Q24,160 22,214" stroke="#fff" stroke-width="5" opacity=".35" fill="none"/></svg>')

def frasco(px=200, relleno="#f4efe0", texto="RÁBANO"):
    return (f'<svg width="{px}" height="{px*1.3:.0f}" viewBox="0 0 100 130"><rect x="24" y="4" width="52" height="16" rx="4" fill="#9a9a9a" stroke="{TINTA}" stroke-width="3"/>'
            f'<path d="M20,20 L80,20 Q88,20 88,30 L88,118 Q88,126 80,126 L20,126 Q12,126 12,118 L12,30 Q12,20 20,20Z" fill="#dff1f7" fill-opacity=".7" stroke="{TINTA}" stroke-width="4"/>'
            f'<rect x="16" y="50" width="68" height="72" rx="6" fill="{relleno}"/><rect x="22" y="66" width="56" height="22" fill="#fff" stroke="{TINTA}" stroke-width="2"/>'
            f'<text x="50" y="83" font-family="Bebas" font-size="15" fill="{TINTA}" text-anchor="middle">{texto}</text><path d="M22,30 L22,110" stroke="#fff" stroke-width="5" opacity=".6"/></svg>')

def escenas():
    E = {}
    E["he_botella"] = f'''{F("", True)}{obj(botella(170), 26, 50, "drop", "float", .2)}{txt(kt("57", "mega rojo", .7, .12, "slam"), 66, 34, 50)}{txt(kt("UN NÚMERO QUE *CASI NADIE ENTIENDE*", "xl", 1.2), 66, 54, 54)}'''
    E["he_sinonimo"] = comparar("1f345", "Heinz", "1f35f", "kétchup", "=", "PARA MUCHOS")
    E["he_rabano"] = comparar("1fad9", "empezó con rábano picante", "1f4c9", "y acabó en la ruina", "→")
    E["he_pescado"] = icono_texto("1f41f", "EL KÉTCHUP: *¿SALSA DE PESCADO?*", "no nació con tomates", "", "izq", "", True, "pop", "bob")
    E["he_57"] = icono_texto("1f340", "EL 57: *NÚMEROS DE LA SUERTE*", "no porque fuera cierto", "según él mismo", "der", "calido", False, "pop", "spin-slow")
    E["he_historia"] = titular("LA HISTORIA DE *HEINZ*", "", "", ("1f345", "1fad9", "1f952", "1f522"), "", True, "xl")
    E["he_pittsburgh"] = f'''{F("sepia", True)}{obj(skyline(1800, "#6b4b36"), 50, 86, "none")}{txt(kt("PITTSBURGH, 1844", "mega", .3, .1, "slam"), 50, 30, 95)}{txt(kt("hijo de inmigrantes alemanes: Henry John Heinz", "l", 1.1), 50, 48, 80)}<div class="viñeta"></div>'''
    E["he_huerto"] = icono_texto("1f466", "CON 8 AÑOS, *VENDE VERDURAS*", "lo que sobraba del huerto de su madre", "según sus biografías", "izq", "", False, "up", "bob", 380, (("1f955", 86, 80),))
    E["he_carro"] = lista([("1f9fa", "una cesta"), ("1f6d2", "una carretilla"), ("1f40e", "un carro con caballo")], "")
    E["he_ladrillos"] = comparar("1f9f1", "la fábrica de ladrillos de su padre", "1f4d2", "contabilidad", "+")
    E["he_limpia"] = impacto("una idea fija:", "LA COMIDA, *LIMPIA*", "", "2728")
    E["he_loteria"] = impacto("siglo XIX:", "COMIDA ENVASADA: *UNA LOTERÍA*", "", "1f3b2")
    E["he_adulterar"] = lista([("1f33e", "harinas"), ("1fab5", "serrín"), ("1f3a8", "colorantes"), ("1f343", "hojas")], "LO QUE NO DEBERÍA ESTAR AHÍ")
    E["he_rabano2"] = icono_texto("1fad9", "RÁBANO PICANTE *RALLADO*", "de los productos más adulterados", "", "izq", "", False, "pop", "bob")
    E["he_noble"] = cifra("1869", "HEINZ Y SU SOCIO, CLARENCE NOBLE", "1f91d")
    E["he_cristal"] = f'''{F("calido", True)}{obj(frasco(240), 30, 50, "drop", "float", .2)}{txt(kt("EN CRISTAL *TRANSPARENTE*", "xl", .8), 68, 42, 54)}{txt(kt("una idea sencilla y brillante", "l", 1.4), 68, 58, 54)}'''
    E["he_ver"] = icono_texto("1f440", "«NO TENGO *NADA QUE ESCONDER*»", "el cliente veía lo que compraba", "", "der", "", False, "pop", "bob")
    E["he_pepinillos"] = f'''{F()}{obj(frasco(180, "#e8e2c4", "CHUCRUT"), 24, 50, "pop", "", .2)}{obj(frasco(180, "#f3e7c6", "VINAGRE"), 50, 50, "pop", "", .5)}{obj(frasco(180, "#a8c46a", "PEPINILLOS"), 76, 50, "pop", "", .8)}{txt(kt("DESPUÉS LLEGARON…", "xl", .1), 50, 14, 90)}'''
    E["he_crece"] = impacto("el negocio creció", "*DEMASIADO* DEPRISA", "", "1f4c8")
    E["he_1873"] = icono_texto("1f3e6", "1873: *GRAN CRISIS FINANCIERA*", "los bancos dejan de prestar", "", "izq", "dark", False, "pop", "")
    E["he_quiebra"] = cifra("1875", "BANCARROTA", "1f4c9")
    E["he_todo"] = icono_texto("1f614", "31 AÑOS, *Y LO PIERDE TODO*", "casado y con hijos", "", "der", "", False, "pop", "")
    E["he_libreta"] = icono_texto("1f4d2", "UNA LIBRETA *CON SUS DEUDAS*", "para devolverlas algún día", "según sus biografías", "izq", "sepia", False, "pop", "bob")
    E["he_devuelve"] = icono_texto("2705", "Y LAS *DEVOLVIÓ*", "años después", "", "der", "", True, "pop", "bob")
    E["he_palabra"] = impacto("una pregunta:", "¿DE DÓNDE VIENE *«KÉTCHUP»*?", "", "2753")
    E["he_china"] = icono_texto("1f41f", "UNA SALMUERA *DE PESCADO FERMENTADO*", "palabra china del sur del país, según el diccionario de Oxford", "", "izq", "", False, "pop", "bob")
    E["he_marineros"] = flecha("1f30f", "1f1ec-1f1e7", "MARINEROS Y COMERCIANTES *LA LLEVAN A EUROPA*", "")
    E["he_setas"] = lista([("1f41f", "anchoas"), ("1f344", "setas"), ("1f330", "nueces")], "INGLATERRA, SIGLO XVIII: KÉTCHUP DE…")
    E["he_tomate"] = flecha("1f345", "1f1fa-1f1f8", "EL TOMATE LLEGÓ *DESPUÉS*", "y triunfó en Estados Unidos")
    E["he_cambio"] = comparar("1f41f", "salsa de pescado", "1f345", "salsa de tomate", "→")
    E["he_1876"] = cifra("1876", "UN AÑO DESPUÉS DE LA QUIEBRA, VUELVE A EMPEZAR", "1f504")
    E["he_familia"] = lista([("1f468", "su hermano"), ("1f468-200d-1f4bc", "su primo"), ("1f468-200d-1f33e", "Henry")], "CON LA FAMILIA")
    E["he_ketchup"] = f'''{F("calido", True)}{obj(botella(170), 30, 50, "drop", "float", .2)}{txt(kt("KÉTCHUP *DE TOMATE*", "xl", .7), 68, 42, 54)}{txt(kt("un producto nuevo, ese mismo año", "l", 1.3), 68, 58, 54)}'''
    E["he_restos"] = lista([("1f5d1-fe0f", "restos de tomate"), ("1f9ea", "conservantes"), ("1f3a8", "colorantes")], "MUCHOS KÉTCHUPS DE LA ÉPOCA")
    E["he_maduros"] = lista([("1f345", "tomates maduros"), ("1f9c2", "más vinagre"), ("1f36c", "más azúcar")], "HEINZ: SIN CONSERVANTES QUÍMICOS")
    E["he_botella2"] = icono_texto("1fad9", "Y EN CRISTAL *TRANSPARENTE*", "como con el rábano", "", "der", "", True, "pop", "bob")
    E["he_escandalo"] = impacto("principios del siglo XX:", "EL ESCÁNDALO DE LA *COMIDA ADULTERADA*", "", "1f4f0")
    E["he_denuncia"] = lista([("1f4da", "libros"), ("1f4f0", "periodistas"), ("1f620", "indignación")], "")
    E["he_apoya"] = comparar("1f645", "muchos fabricantes: contra el control", "1f44d", "Heinz: a favor de la ley", "VS")
    E["he_1906"] = cifra("1906", "LEY DE ALIMENTOS Y MEDICAMENTOS", "2696-fe0f")
    E["he_jugada"] = titular("UNA *JUGADA MAESTRA*", "la ley le daba la razón", "", ("2696-fe0f", "1f3c6", "1fad9", "2728"), "", True, "xl")
    E["he_misterio"] = impacto("el gran misterio:", "¿POR QUÉ *57*?", "", "1f50d")
    E["he_tren"] = icono_texto("1f686", "UN ANUNCIO EN EL TREN: *21 ESTILOS*", "de zapatos, en Nueva York", "según contó el propio Heinz", "izq", "", False, "left", "bob", 380, (("1f45e", 86, 80),))
    E["he_numero"] = icono_texto("1f4a1", "PONER *UN NÚMERO*", "¿cuántos productos tenía?", "", "der", "", True, "pop", "bob")
    E["he_sesenta"] = comparar("1f4e6", "tenía más de 60", "1f522", "eligió el 57", "→")
    E["he_suerte"] = f'''{F("", True)}{txt(kt("5", "mega rojo", .3, .1, "slam"), 30, 40, 30)}{txt(kt("su número de la suerte", "l", .8), 30, 60, 36)}{txt(kt("7", "mega rojo", 1.2, .1, "slam"), 70, 40, 30)}{txt(kt("el de su mujer", "l", 1.6), 70, 60, 36)}'''
    E["he_lema"] = titular("«57 *VARIEDADES*»", "todavía hoy, en sus botellas", "", ("1f522", "1f345", "1fad9", "1f952"))
    E["he_inventado"] = icono_texto("1f3c6", "UN NÚMERO INVENTADO, *CIFRA FAMOSA*", "de la publicidad", "", "izq", "", True, "pop", "bob")
    E["he_genio"] = impacto("Heinz era también", "UN GENIO DE *LA PROMOCIÓN*", "", "1f4e3")
    E["he_chicago"] = cifra("1893", "EXPOSICIÓN UNIVERSAL DE CHICAGO", "1f3a1")
    E["he_piso"] = icono_texto("1f6b6", "UN PUESTO *LEJOS DEL PASO*", "en un piso superior", "según la propia marca", "der", "", False, "pop", "swing")
    E["he_tarjetas"] = icono_texto("1f3ab", "«SUBE Y LLÉVATE *UN REGALO GRATIS*»", "tarjetas repartidas por la feria", "", "izq", "", False, "pop", "bob")
    E["he_broche"] = f'''{F("calido", True)}{obj(spr("1f952", 280), 30, 50, "zoom", "float", .2)}{txt(kt("UN BROCHE *CON FORMA DE PEPINILLO*", "xl", .8), 68, 46, 54)}'''
    E["he_suelo"] = lista([("1f465", "subió tanta gente…"), ("1f3d7-fe0f", "…que hubo que reforzar el suelo"), ("1f3c5", "un regalo legendario")], "SEGÚN SE CUENTA")
    E["he_trato"] = impacto("otra obsesión:", "CÓMO TRATABA *A SUS TRABAJADORES*", "", "1f477")
    E["he_ventajas"] = lista([("1fa7a", "médico gratis"), ("1f37d-fe0f", "comedores"), ("1f3cb-fe0f", "gimnasio"), ("1f3ca", "piscina")], "LA FÁBRICA DE PITTSBURGH")
    E["he_manicura"] = icono_texto("1f485", "UNIFORMES LIMPIOS… *Y MANICURA*", "porque sus manos tocaban la comida", "según se cuenta", "izq", "", False, "pop", "bob")
    E["he_visitas"] = f'''{F()}{obj(spr("1f3ed", 260), 26, 50, "pop", "", .2)}{"".join(obj(spr("1f9d1", 100), 50 + i * 10, 60, "left", "bob", .5 + i * .2) for i in range(4))}{txt(kt("PUERTAS ABIERTAS *A LOS VISITANTES*", "xl", 1.0), 62, 30, 66)}'''
    E["he_ensenar"] = comparar("1fad9", "el frasco transparente", "1f3ed", "la fábrica abierta", "=", "ENSEÑARLO TODO")
    E["he_nosale"] = f'''{F()}{obj(f'<div style="transform:rotate(160deg)">{botella(150)}</div>', 36, 46, "drop", "swing", .2)}{txt(kt("EL KÉTCHUP *NO QUIERE SALIR*", "xl", .9), 70, 46, 50)}'''
    E["he_virtud"] = comparar("1f40c", "tarda en caer", "1f44d", "porque es espeso", "=", "DEL DEFECTO, UNA VIRTUD")
    E["he_truco"] = f'''{F("", True)}{obj(botella(170), 28, 50, "pop", "", .2)}{obj(spr("1f446", 130), 40, 22, "pop", "bob", .8)}{txt(kt("UN TOQUE *EN EL CUELLO*", "xl", 1.0), 68, 42, 54)}{txt(kt("justo donde está el 57, según la marca", "l", 1.6), 68, 58, 54)}'''
    E["he_bocabajo"] = lista([("1f9f4", "botellas que se aprietan"), ("1f643", "y boca abajo")], "LLEGA EL PLÁSTICO")
    E["he_cristal2"] = icono_texto("1f48e", "MUCHOS PREFIEREN *EL CRISTAL*", "", "", "der", "", False, "pop", "bob")
    E["he_muere"] = cifra("1919", "MUERE HENRY JOHN HEINZ", "1f56f-fe0f", "una de las mayores de EE. UU.")
    E["he_hijo"] = lista([("1f474", "Henry"), ("1f468", "su hijo Howard"), ("1f466", "su nieto")], "LA FAMILIA AL MANDO")
    E["he_alubias"] = icono_texto("1f1ec-1f1e7", "ALUBIAS CON TOMATE: *UN CLÁSICO*", "del desayuno británico", "", "izq", "", False, "pop", "bob", 380, (("1fad8", 86, 80),))
    E["he_buffett"] = cifra("2013", "LA COMPRAN WARREN BUFFETT Y UN FONDO BRASILEÑO", "1f4b0")
    E["he_kraft"] = comparar("1f9c0", "Kraft", "1f345", "Heinz", "+", "2015: KRAFT HEINZ")
    E["he_division"] = icono_texto("2702-fe0f", "2025: *PLAN PARA DIVIDIRSE*", "Heinz, en una de las mitades", "", "der", "", False, "pop", "")
    E["leccion1"] = leccion(1, "la transparencia", "*VENDE*", "1fad9")
    E["leccion2"] = leccion(2, "una bancarrota", "*NO ES EL FINAL*", "1f504")
    E["leccion3"] = leccion(3, "mejor memorable", "*QUE EXACTO*", "1f522")
    E["he_final"] = lista([("1f955", "verduras"), ("1fad9", "un frasco"), ("1f4c9", "una quiebra"), ("1f41f", "pescado"), ("1f952", "un pepinillo")], "")
    E["he_golpe"] = f'''{F("calido", True)}{obj(botella(170), 30, 50, "drop", "swing", .2)}{txt(kt("YA SABES *DÓNDE DAR EL GOLPE*", "xl", .9), 68, 46, 54)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:150px;top:110px;transform:rotate(-8deg)">{botella(210)}</div>
      <div style="position:absolute;left:350px;top:430px">{vicon("thinking-face", 200)}</div>
      <div class="big" style="top:100px"><div class="s">EL MISTERIO DEL</div><div class="q" style="font-size:300px;margin-top:10px">57</div><div class="y">LA HISTORIA DE HEINZ</div></div>'''
