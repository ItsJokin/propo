"""Guion del vídeo 3 de Código de Barras: Danone nació en Barcelona.
Formato igual que video_01/guion.py. Solo hechos con fuente; las fechas con discrepancias se redondean."""

TITULO = "Danone nació en Barcelona: la historia que casi nadie conoce"
TITULOS_ALT = ["El yogur más famoso del mundo empezó en una farmacia de Barcelona", "Por qué Danone se llama Danone"]
MARCA = "Danone"

SEGMENTOS = [
    ("Introducción", [
        "Es probable que esta semana hayas comido uno.",
        "Un yogur de una de las marcas de alimentación más grandes del mundo.",
        "Una marca que muchos creen francesa.",
        "Pero su historia no empieza en París.",
        "Empieza en Barcelona, hace más de cien años, con un padre, un hijo y un nombre cariñoso.",
    ], [("d_yogur", 0, 0), ("d_gigante", 1, 0), ("d_francesa", 2, 0), ("d_paris_no", 3, 0), ("d_barcelona", 4, 0)]),

    ("1. El problema", [
        "Barcelona, finales de la década de mil novecientos diez.",
        "Isaac Carasso es un empresario de origen sefardí que ha llegado a la ciudad desde Salónica, en la actual Grecia.",
        "Y se encuentra con un problema muy serio: muchos niños sufren trastornos intestinales.",
        "En su tierra de origen, el yogur era un alimento de toda la vida.",
        "En la España de entonces, en cambio, era algo casi desconocido.",
        "Carasso tiene una idea: producir yogur en Barcelona.",
    ], [("cap1", 0, -0.6), ("d_isaac", 1, 0), ("d_ninos", 2, 0), ("d_tradicion", 3, 0), ("d_desconocido", 4, 0), ("d_idea", 5, 0)]),

    ("2. La farmacia", [
        "En mil novecientos diecinueve empieza a vender su yogur.",
        "Pero no en tiendas de comestibles, como hoy.",
        "Lo vende en farmacias.",
        "Porque al principio el yogur no se presentaba como un postre, sino como un producto que ayudaba a la digestión.",
        "Es un detalle que lo cambia todo: el yogur entró en nuestras vidas por la puerta de la salud.",
    ], [("cap2", 0, -0.6), ("d_1919", 0, 1.2), ("d_tiendas_no", 1, 0), ("d_farmacia", 2, 0), ("d_digestion", 3, 0), ("d_salud", 4, 0)]),

    ("3. El nombre", [
        "Ahora, el nombre.",
        "Isaac tenía un hijo llamado Daniel.",
        "Y en catalán, una forma cariñosa de llamar a un niño que se llama Daniel es «Danon».",
        "De ahí sale el nombre de la marca: Danone.",
        "La marca de yogures más famosa del mundo lleva, literalmente, el apodo de un niño de Barcelona.",
    ], [("cap3", 0, -0.6), ("d_daniel", 1, 0), ("d_danon", 2, 0), ("d_danone", 3, 0), ("d_apodo", 4, 0)]),

    ("4. París y Nueva York", [
        "Daniel creció, y con él la empresa.",
        "En mil novecientos veintinueve, Daniel Carasso fundó la sociedad de Danone en París.",
        "Por eso tanta gente cree que la marca es francesa: fue en Francia donde empezó a crecer a lo grande.",
        "Pero la historia tiene otro giro.",
        "Con la Segunda Guerra Mundial, Daniel se marchó a Estados Unidos.",
        "Allí, a principios de los años cuarenta, montó la empresa en Nueva York y le cambió el nombre para que sonara más americano: Dannon.",
        "Y en Estados Unidos se popularizó un invento que hoy nos parece normal: el yogur con la fruta en el fondo del vaso.",
    ], [("cap4", 0, -0.6), ("d_crece", 0, 1.0), ("d_1929", 1, 0), ("d_francia", 2, 0), ("d_giro", 3, 0), ("d_guerra", 4, 0), ("d_dannon", 5, 0), ("d_fruta", 6, 0)]),

    ("5. El gigante", [
        "Después llegaron las fusiones.",
        "Primero con la marca de quesos Gervais, y después con un grupo industrial francés llamado BSN.",
        "De ahí salió, con los años, el grupo Danone que conocemos hoy, con aguas, lácteos y nutrición en todo el mundo.",
        "¿Y Daniel? Vivió para verlo casi todo: murió en dos mil nueve, con más de cien años.",
    ], [("cap5", 0, -0.6), ("d_gervais", 1, 0), ("d_grupo", 2, 0), ("d_daniel_final", 3, 0)]),

    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: un producto puede cambiar de significado. El yogur pasó de la farmacia al postre.",
        "Dos: el origen de una marca no siempre está donde crees. A veces hay que rascar un poco la etiqueta.",
        "Y tres: un nombre con historia vale oro. Danone lleva más de un siglo usando el apodo de un niño.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),

    ("Final", [
        "La próxima vez que abras un yogur, ya lo sabes: detrás hay una farmacia de Barcelona y un niño llamado Daniel.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Sabías que Danone había nacido en España? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("d_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]

FUENTES = [
    ("Danone, «Our epic History» (web corporativa)", "https://danone.com/about-danone/ourhistory.html"),
    ("Wikipedia, «Danone»", "https://en.wikipedia.org/wiki/Danone"),
    ("Wikipedia, «Isaac Carasso»", "https://en.wikipedia.org/wiki/Isaac_Carasso"),
    ("Wikipedia, «Daniel Carasso»", "https://en.wikipedia.org/wiki/Daniel_Carasso"),
    ("Gran Enciclopèdia Catalana, «Danone»", "https://www.enciclopedia.cat/gran-enciclopedia-catalana/danone"),
    ("Smithsonian Magazine, «Yogurt pioneer dies at 103»", "https://www.smithsonianmag.com/arts-culture/yogurt-pioneer-dies-at-103-59385521/"),
    ("J. Weekly, «Dannon yogurt magnate dies» (2009)", "https://jweekly.com/2009/05/29/dannon-yogurt-magnate-dies/"),
    ("6sqft, «Dannon Yogurt's fruity history in the Bronx»", "https://www.6sqft.com/dannon-yogurts-fruity-history-in-the-bronx/"),
]
