"""Guion del vídeo 6 de Código de Barras: Nokia."""
TITULO = "Nokia: de dominar el mundo a desaparecer de tu bolsillo"
TITULOS_ALT = ["Qué le pasó a Nokia", "Nokia: la empresa de papel que conquistó los móviles… y los perdió"]
MARCA = "Nokia"
SEGMENTOS = [
    ("Introducción", [
        "Si tuviste un móvil a principios de los dos mil, es muy probable que fuera un Nokia.",
        "Indestructible, con una batería que duraba días… y con el juego de la serpiente.",
        "Durante años, Nokia fue la marca de móviles más vendida del planeta.",
        "Y en muy poco tiempo, desapareció de nuestros bolsillos.",
        "Pero lo más sorprendente de esta historia es cómo empezó: fabricando papel.",
    ], [("k_movil", 0, 0), ("k_serpiente", 1, 0), ("k_lider", 2, 0), ("k_desaparece", 3, 0), ("k_papel", 4, 0)]),
    ("1. Papel, caucho y cables", [
        "Finlandia, mil ochocientos sesenta y cinco.",
        "Un ingeniero llamado Fredrik Idestam monta una fábrica de pasta de papel junto a unos rápidos, en la ciudad de Tampere.",
        "Unos años después abre una segunda fábrica cerca de un pueblo llamado Nokia. Y la empresa acaba tomando su nombre.",
        "Un siglo más tarde, en mil novecientos sesenta y siete, Nokia se fusiona con una empresa de caucho y otra de cables.",
        "Durante décadas, Nokia fabricó de todo: papel, botas de goma, neumáticos, cables…",
    ], [("cap1", 0, -0.6), ("k_1865", 0, 1.0), ("k_idestam", 1, 0), ("k_pueblo", 2, 0), ("k_fusion", 3, 0), ("k_detodo", 4, 0)]),
    ("2. La apuesta por los móviles", [
        "Pero en los años noventa, Nokia toma una decisión que lo cambia todo: centrarse en las telecomunicaciones.",
        "Y justo entonces explota el mercado de los teléfonos móviles.",
        "Nokia fabrica móviles resistentes, fáciles de usar y para todos los bolsillos.",
        "Hacia el año dos mil ya vendía alrededor de un tercio de los móviles del mundo.",
        "Y, según algunas estimaciones, hacia dos mil siete llegó a rondar el cuarenta por ciento.",
        "Cuatro de cada diez móviles vendidos en el planeta eran Nokia.",
    ], [("cap2", 0, -0.6), ("k_decision", 0, 1.0), ("k_explota", 1, 0), ("k_resistente", 2, 0), ("k_tercio", 3, 0), ("k_40", 4, 0), ("k_4de10", 5, 0)]),
    ("3. El iPhone", [
        "Y entonces, en dos mil siete, Apple presenta el iPhone.",
        "Una pantalla táctil enorme, sin teclado, con internet de verdad.",
        "Nokia tardó en reaccionar: su primer móvil táctil llegó en octubre de dos mil ocho, año y medio después.",
        "Mientras tanto, Google lanzaba Android, y fabricantes como Samsung empezaban a vender móviles inteligentes a lo grande.",
        "Nokia seguía apostando por su propio sistema operativo, que se quedaba atrás.",
    ], [("cap3", 0, -0.6), ("k_iphone", 0, 1.0), ("k_tactil", 1, 0), ("k_tarde", 2, 0), ("k_android", 3, 0), ("k_sistema", 4, 0)]),
    ("4. La plataforma en llamas", [
        "En dos mil diez, Nokia ficha como director a Stephen Elop, un ejecutivo que venía de Microsoft.",
        "En febrero de dos mil once se filtra un correo interno suyo que se hizo famoso.",
        "En él comparaba la situación de Nokia con estar de pie sobre una plataforma petrolífera en llamas.",
        "Poco después, Nokia anunció que sus móviles usarían el sistema de Microsoft: Windows Phone.",
        "No funcionó. En dos mil doce, Samsung superó a Nokia como el mayor vendedor de móviles del mundo.",
    ], [("cap4", 0, -0.6), ("k_elop", 0, 1.0), ("k_correo", 1, 0), ("k_llamas", 2, 0), ("k_windows", 3, 0), ("k_samsung", 4, 0)]),
    ("5. El final de una era", [
        "En septiembre de dos mil trece, Nokia anunció la venta de su negocio de móviles a Microsoft.",
        "El acuerdo, en total, fue de unos cinco mil cuatrocientos millones de euros.",
        "La marca que había dominado el mundo dejaba de fabricar sus propios móviles.",
        "¿Y Nokia hoy? Sigue existiendo, pero se dedica sobre todo a las redes de telecomunicaciones: la tecnología que hay detrás de las antenas.",
        "Es decir: probablemente sigue en tu vida… aunque ya no la lleves en el bolsillo.",
    ], [("cap5", 0, -0.6), ("k_venta", 0, 1.0), ("k_5400", 1, 0), ("k_deja", 2, 0), ("k_hoy", 3, 0), ("k_bolsillo", 4, 0)]),
    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: ser el número uno no te protege. Puede incluso hacer que te confíes.",
        "Dos: cuando el mercado cambia de reglas, no basta con hacer mejor lo de siempre.",
        "Y tres: Nokia ya se había reinventado antes, del papel a los móviles. Y lo volvió a hacer con las redes.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Papel, botas de goma, móviles indestructibles y antenas. Pocas empresas se han reinventado tantas veces.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Cuál fue tu primer móvil? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("k_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("Wikipedia, «History of Nokia»", "https://en.wikipedia.org/wiki/History_of_Nokia"),
    ("BetaNews, «How Nokia went from paper merchant supplier to mobile phone giant»", "https://betanews.com/2014/11/07/flashback-friday-how-nokia-went-from-paper-merchant-supplier-to-mobile-phone-giant"),
    ("TBS News, «From paper mills to 5G: The many lives of Nokia»", "https://www.tbsnews.net/international/global-economy/paper-mills-5g-many-lives-nokia-50698"),
    ("FourWeekMBA, «History of Nokia»", "https://fourweekmba.com/history-of-nokia/"),
]
DESCRIPCION = ("Nokia empezó en 1865 como una fábrica de pasta de papel en Finlandia. Un siglo después fabricaba botas de goma y cables, y hacia 2007 "
               "vendía cerca de 4 de cada 10 móviles del mundo. Luego llegaron el iPhone, Android, la «plataforma en llamas» y la venta a Microsoft. "
               "Esta es la historia de cómo Nokia lo tuvo todo… y se reinventó otra vez.")
ETIQUETAS = "nokia, historia de nokia, qué le pasó a nokia, nokia 3310, stephen elop, plataforma en llamas, nokia microsoft, iphone, historia de marcas, código de barras"
HASHTAGS = "#Nokia #HistoriaDeMarcas #Móviles"
LISTA = "Auge y caída"
NOTA = "La cuota de mercado máxima de Nokia varía según la fuente (en torno al 40 % hacia 2007, según algunas estimaciones)."
PREGUNTA = "¿CUÁL FUE TU *PRIMER MÓVIL*?"
