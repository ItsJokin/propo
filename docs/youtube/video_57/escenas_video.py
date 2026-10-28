"""Escenas del vídeo 57 (especial Navidad: el panettone). Motor común; sin logotipos ni cajas de marcas: panettones genéricos."""
from base import *

CAP_ICONOS = {1: "1f468-200d-1f373", 2: "1f35e", 3: "26ea", 4: "2694-fe0f", 5: "2b50", 6: "1f9f3", 7: "1f1f5-1f1ea", 8: "1f1ea-1f1f8", 9: "1f9e0"}

def panettone(w=260, d=.2, alto=True, colgado=False):
    """Panettone genérico: cúpula alta con collar de papel (o versión baja y plana)."""
    an = "" if d is None else f"animation:ePop .5s ease {d}s both;"
    h_cup = 70 if alto else 30
    pasas = "".join(f'<circle cx="{40 + (i*41) % 120}" cy="{120 - h_cup + 20 + (i*17) % (h_cup + 10)}" r="5" fill="#6b2f1a"/>' for i in range(9))
    cuerpo = (f'<path d="M30,{200 - (90 if alto else 50)} Q30,{200 - (90 if alto else 50) - h_cup} 100,{200 - (90 if alto else 50) - h_cup - 8} Q170,{200 - (90 if alto else 50) - h_cup} 170,{200 - (90 if alto else 50)}Z" fill="#a0612a" stroke="{TINTA}" stroke-width="4"/>'
              f'<rect x="30" y="{200 - (90 if alto else 50)}" width="140" height="{(90 if alto else 50)}" fill="#e8c27a" stroke="{TINTA}" stroke-width="4"/>'
              f'<rect x="30" y="{200 - (90 if alto else 50)}" width="140" height="{(90 if alto else 50)}" fill="url(#rayas)"/>{pasas if alto else ""}')
    rot = "transform:rotate(180deg);" if colgado else ""
    return (f'<svg width="{w}" height="{w}" viewBox="0 0 200 210" style="{an}{rot}"><defs><pattern id="rayas" width="14" height="14" patternUnits="userSpaceOnUse">'
            f'<rect width="7" height="14" fill="#c99a52" opacity=".35"/></pattern></defs>{cuerpo}</svg>')

def escenas():
    E = {}
    E["pa_especial"] = titular("ESPECIAL *NAVIDAD*", "Código de Barras", "bienvenido al", ("1f384", "1f35e", "2744-fe0f", "1f381"), "navidad", True, "mega")
    E["pa_caja"] = f'''{F("calido", True)}{obj(panettone(380), 30, 52, "none", "bob", 0)}{txt(kt("UNA CÚPULA ENORME, *PASAS Y FRUTA*", "xl", .6), 70, 42, 52)}{txt(kt("en cada vez más mesas españolas", "l naranja", 1.3), 70, 58, 52)}'''
    E["pa_milan"] = icono_texto("1f1ee-1f1f9", "EL DULCE DE NAVIDAD *DE MILÁN*", "", "", "izq", "", False, "pop", "bob")
    E["pa_peru"] = comparar("1f1ee-1f1f9", "Italia", "1f1f5-1f1ea", "Perú", "VS", "¿QUIÉN COME MÁS POR HABITANTE?")
    E["pa_camino"] = lista([("1f468-200d-1f373", "un pinche de cocina"), ("2694-fe0f", "dos pasteleros rivales"), ("1f9f3", "miles de emigrantes")], "POR EL CAMINO…")
    E["pa_historia"] = titular("LA HISTORIA *DEL PANETTONE*", "", "", ("1f35e", "1f1ee-1f1f9", "1f9f3", "1f1f5-1f1ea"), "navidad", True, "xl")
    E["pa_leyenda"] = impacto("como casi todos los dulces antiguos,", "UNA *LEYENDA*", "", "1f4dc")
    E["pa_sforza"] = icono_texto("1f451", "LUDOVICO *EL MORO*", "el mecenas de Leonardo da Vinci", "Milán, siglo XV", "izq", "sepia", False, "pop", "bob")
    E["pa_toni"] = lista([("1f525", "el postre se quema"), ("1f468-200d-1f373", "un pinche llamado Toni"), ("1f35e", "improvisa un pan dulce")], "SEGÚN LA LEYENDA")
    E["pa_duque"] = flecha("1f35e", "1f451", "«EL PAN DE TONI» → *PANETTONE*", "al duque le encantó")
    E["pa_otra"] = comparar("1f934", "un joven noble enamorado", "1f469-200d-1f373", "la hija de un panadero", "+", "OTRA VERSIÓN")
    E["pa_panetto"] = icono_texto("1f4d6", "*PANETTO* + «-ONE»", "un pan pequeño… en grande", "lo más probable", "der", "", True, "pop", "bob")
    E["pa_milan2"] = lista([("1f9c8", "mantequilla"), ("1f95a", "huevos"), ("1f347", "frutas y pasas")], "MILÁN: UN PAN DE NAVIDAD ENRIQUECIDO")
    E["pa_plano"] = f'''{F("sepia", True)}{obj(panettone(380, .2, False), 30, 56, "none", "", 0)}{txt(kt("BAJO, PLANO *Y CARO*", "xl", .6), 70, 42, 52)}{txt(kt("un dulce de fiesta", "l naranja", 1.3), 70, 58, 52)}'''
    E["pa_local"] = icono_texto("1f5fa-fe0f", "UN DULCE *LOCAL*", "fuera de Lombardía, mucha gente ni lo conocía", "", "izq", "", False, "pop", "")
    E["pa_ambicioso"] = impacto("hizo falta", "UN PASTELERO *MUY AMBICIOSO*", "", "1f4aa")
    E["pa_motta"] = cifra("1919", "ANGELO MOTTA ABRE SU OBRADOR EN MILÁN", "1f468-200d-1f373")
    E["pa_cupula"] = comparar("1f35e", "bajo y plano", "26ea", "alto, con cúpula", "→", "LA GRAN IDEA DE MOTTA")
    E["pa_papel"] = f'''{F()}{obj(panettone(400), 30, 52, "none", "", 0)}{txt(kt("UN COLLAR *DE PAPEL*", "xl", .6), 70, 42, 52)}{txt(kt("para que suba sin desparramarse", "l naranja", 1.3), 70, 58, 52)}'''
    E["pa_fermenta"] = cifra("MUCHAS HORAS", "DE FERMENTACIÓN, CON VARIAS FASES DE LEVADO", "23f3")
    E["pa_modelo"] = titular("ALTO, LIGERO *Y ESPECTACULAR*", "el modelo para todos los demás", "", ("26ea", "1f35e", "2b50", "2728"), "navidad", True, "xl")
    E["pa_rival"] = impacto("como en toda buena historia de marcas,", "UN *RIVAL*", "", "2694-fe0f")
    E["pa_alemagna"] = icono_texto("1f468-200d-1f373", "GIOACCHINO *ALEMAGNA*", "otro pastelero milanés, con una forma muy parecida", "pocos años después", "der", "", False, "pop", "bob")
    E["pa_fabricas"] = lista([("1f37d-fe0f", "la masa más esponjosa"), ("1f381", "la caja más bonita"), ("1f69a", "la distribución más grande")], "LA GUERRA DE LAS FÁBRICAS")
    E["pa_italia"] = flecha("1f3d9-fe0f", "1f1ee-1f1f9", "DE MILÁN *A TODA ITALIA*", "")
    E["pa_1976"] = cifra("1976", "MOTTA SE QUEDA CON ALEMAGNA", "1f91d")
    E["pa_bauli"] = icono_texto("1f3ed", "HOY, LAS DOS *SON DE BAULI*", "una empresa de dulces de Verona", "", "izq", "", False, "pop", "bob")
    E["pa_debate"] = comparar("1f35e", "panettone", "2b50", "pandoro", "¿O?", "EL DEBATE DE LA NAVIDAD ITALIANA")
    E["pa_pandoro"] = lista([("1f4dd", "patentado en 1894"), ("2b50", "estrella de 8 puntas"), ("1f6ab", "sin fruta ni pasas"), ("2744-fe0f", "azúcar glas")], "EL PANDORO DE VERONA")
    E["pa_divide"] = icono_texto("1f46a", "UNO *DE CADA*", "muchas familias italianas no eligen", "", "der", "calido", True, "pop", "bob")
    E["pa_ambos"] = icono_texto("1f3ed", "LAS MARCAS *FABRICAN LOS DOS*", "", "", "izq", "", False, "pop", "")
    E["pa_verona"] = flecha("1f3ed", "2b50", "BAULI: *DE VERONA*", "la ciudad del pandoro")
    E["pa_america"] = impacto("y ahora el gran salto:", "*AMÉRICA*", "", "1f30e")
    E["pa_emigran"] = lista([("1f1e6-1f1f7", "Argentina"), ("1f1e7-1f1f7", "Brasil"), ("1f1f5-1f1ea", "Perú"), ("1f1fb-1f1ea", "Venezuela")], "MILLONES DE ITALIANOS EMIGRAN A…")
    E["pa_costumbres"] = f'''{F("sepia", True)}{obj(spr("1f9f3", 260), 26, 52, "left", "bob", .2)}{obj(panettone(200, .8), 42, 46, "none", "", 0)}{txt(kt("UNA RECETA *EN LA MALETA*", "xl", .6), 72, 46, 48)}'''
    E["pa_nombres"] = lista([("1f1e6-1f1f7", "pan dulce"), ("1f1f5-1f1ea", "panetón"), ("1f1e7-1f1f7", "panetone")], "CADA PAÍS, SU NOMBRE")
    E["pa_brasil"] = icono_texto("1f1e7-1f1f7", "BRASIL *LIDERA LA PRODUCCIÓN*", "con una empresa fundada por emigrantes italianos", "según la prensa peruana", "der", "", False, "pop", "bob")
    E["pa_latino"] = titular("DE MILÁN… *A LATINOAMÉRICA*", "", "", ("1f1ee-1f1f9", "27a1-fe0f", "1f30e", "1f35e"), "navidad", True, "xl")
    E["pa_serio"] = icono_texto("1f1f5-1f1ea", "*PERÚ* SE LO TOMA EN SERIO", "montañas de cajas en los supermercados desde noviembre", "", "izq", "calido", True, "pop", "bob")
    E["pa_chocolate"] = comparar("1f35e", "panetón", "2615", "chocolate caliente", "+", "NOCHEBUENA EN LIMA (EN PLENO VERANO)")
    E["pa_regalo"] = lista([("1f4bc", "las empresas lo regalan"), ("1f381", "en las cestas navideñas"), ("1f46a", "varios por familia")], "CASI OBLIGATORIO")
    E["pa_kilo"] = cifra("+1 KILO", "POR PERSONA Y AÑO EN PERÚ, SEGÚN ESTUDIOS DEL SECTOR", "2696-fe0f")
    E["pa_donofrio"] = icono_texto("1f3c6", "LA MÁS VENDIDA: *D'ONOFRIO*", "también nació de un emigrante italiano", "según un estudio citado por la prensa peruana", "der", "", True, "pop", "bob")
    E["pa_julio"] = cifra("JULIO", "HASTA EN LAS FIESTAS PATRIAS", "1f389")
    E["pa_espana"] = lista([("1f36c", "turrón"), ("1f36a", "mantecados"), ("1f451", "roscón")], "EN ESPAÑA REINABAN…")
    E["pa_super"] = icono_texto("1f6d2", "PRIMERO, *EL SUPERMERCADO*", "versiones industriales a buen precio", "", "izq", "", False, "pop", "bob")
    E["pa_artesano"] = icono_texto("1f3c6", "DESPUÉS, *LAS PASTELERÍAS*", "concursos al mejor de España y precios de lujo", "", "der", "calido", True, "pop", "bob")
    E["pa_dificil"] = lista([("1fad9", "masa madre"), ("23f3", "fermentación"), ("1f525", "horneado")], "UN EXAMEN DEL OFICIO")
    E["pa_reves"] = f'''{F()}{"".join(obj(panettone(220, .2 + i*.2, True, True), 20 + i * 20, 54, "none", "", 0) for i in range(4))}<div style="position:absolute;left:10%;top:36%;width:80%;height:8px;background:#777;border-radius:4px"></div>{txt(kt("COLGADOS *BOCA ABAJO*", "xl", .6), 50, 16, 90)}{txt(kt("para que la cúpula no se hunda", "l naranja", 1.3), 50, 80, 80)}'''
    E["leccion1"] = leccion(1, "mejorar la forma", "*PUEDE CAMBIAR EL PRODUCTO*", "26ea")
    E["leccion2"] = leccion(2, "la competencia", "*HACE CRECER AL SECTOR*", "2694-fe0f")
    E["leccion3"] = leccion(3, "las personas son", "*EL MEJOR CANAL DE DISTRIBUCIÓN*", "1f9f3")
    E["pa_final"] = lista([("1f468-200d-1f373", "Toni"), ("1f35e", "un pan plano"), ("1f4c3", "un collar de papel"), ("2694-fe0f", "dos rivales"), ("1f9f3", "una maleta")], "")
    E["pa_mesas"] = f'''{F("navidad", True)}{obj(panettone(340), 30, 52, "none", "bob", 0)}{txt(kt("LIMA, SÃO PAULO… *Y TU CASA*", "xl hueso", .6), 70, 46, 52)}'''
    return E

def miniatura():
    return f'''<div class="fondo navidad" style="inset:0"></div>{copos(50)}
      <div style="position:absolute;left:40px;top:170px">{panettone(400, None)}</div>
      <div style="position:absolute;left:350px;top:430px;width:180px;height:120px;border:5px solid #111;border-radius:8px;transform:rotate(8deg);background:linear-gradient(90deg,#D91023 33.3%,#fff 33.3% 66.6%,#D91023 66.6%);box-shadow:0 8px 20px rgba(0,0,0,.35)"></div>
      {cinta_especial()}
      <div class="big" style="top:110px"><div class="s" style="color:#FAF7F0">EL DULCE DE MILÁN</div><div class="q" style="font-size:130px;margin-top:22px">QUE CONQUISTÓ</div><div class="y">PERÚ</div></div>'''
