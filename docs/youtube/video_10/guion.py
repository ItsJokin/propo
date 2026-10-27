"""Guion del vídeo 10 de Código de Barras: Blockbuster contra Netflix."""
TITULO = "Blockbuster pudo comprar Netflix por 50 millones… y dijo que no"
TITULOS_ALT = ["Blockbuster vs Netflix: la decisión más cara de la historia", "Qué le pasó a Blockbuster"]
MARCA = "Blockbuster"
SEGMENTOS = [
    ("Introducción", [
        "Viernes por la noche. Vas al videoclub, eliges una película y rezas para que no esté alquilada.",
        "Durante años, el rey de los videoclubs fue Blockbuster.",
        "En el año dos mil, le ofrecieron comprar una pequeña empresa que enviaba DVD por correo. Por cincuenta millones de dólares.",
        "Esa empresa se llamaba Netflix.",
        "Y Blockbuster dijo que no.",
    ], [("b_viernes", 0, 0), ("b_rey", 1, 0), ("b_oferta", 2, 0), ("b_netflix", 3, 0), ("b_no", 4, 0)]),
    ("1. El rey del videoclub", [
        "Blockbuster abrió su primera tienda en mil novecientos ochenta y cinco, en Dallas, Estados Unidos.",
        "Su idea era sencilla: tiendas grandes, luminosas y con miles de películas.",
        "Creció a una velocidad enorme, y llegó a tener unas nueve mil tiendas en todo el mundo.",
        "Pero tenía un negocio escondido que los clientes odiaban: los recargos por devolver tarde.",
        "Según algunas estimaciones, llegaron a suponer una parte muy importante de sus ingresos.",
    ], [("cap1", 0, -0.6), ("b_1985", 0, 1.0), ("b_tiendas", 1, 0), ("b_9000", 2, 0), ("b_recargos", 3, 0), ("b_ingresos", 4, 0)]),
    ("2. Una multa de cuarenta dólares", [
        "En mil novecientos noventa y siete, Reed Hastings y Marc Randolph fundan Netflix en California.",
        "Según la versión que Hastings ha contado muchas veces, la idea surgió tras pagar una multa de cuarenta dólares por devolver tarde una película.",
        "Randolph, el otro fundador, ha dicho que la historia real fue bastante menos cinematográfica.",
        "Sea como sea, el modelo era nuevo: alquilar DVD por internet y recibirlos en casa por correo.",
        "Y después, una suscripción mensual. Sin recargos por retraso.",
    ], [("cap2", 0, -0.6), ("b_fundan", 0, 1.0), ("b_multa", 1, 0), ("b_randolph", 2, 0), ("b_correo", 3, 0), ("b_suscripcion", 4, 0)]),
    ("3. La reunión", [
        "En el año dos mil, Netflix perdía dinero.",
        "Sus fundadores viajaron a Dallas para reunirse con el director de Blockbuster, John Antioco.",
        "La propuesta: Blockbuster compraba Netflix por cincuenta millones de dólares, y Netflix se encargaba de su negocio en internet.",
        "Antioco no se interesó. Para él, Netflix era un negocio de nicho.",
        "Según contó años después el entonces director financiero de Netflix, en Blockbuster casi se les rieron en la cara.",
    ], [("cap3", 0, -0.6), ("b_pierde", 0, 1.0), ("b_dallas", 1, 0), ("b_propuesta", 2, 0), ("b_nicho", 3, 0), ("b_risas", 4, 0)]),
    ("4. Blockbuster contraataca", [
        "Pero aquí la historia tiene un giro que casi nadie cuenta.",
        "Unos años después, Blockbuster sí reaccionó.",
        "Lanzó su propio alquiler por internet, eliminó los recargos por retraso y permitía devolver los DVD en sus tiendas.",
        "Y empezó a ganar clientes muy deprisa. Netflix lo pasó realmente mal.",
        "Pero en Blockbuster hubo choques internos por el coste de aquella estrategia, y Antioco acabó saliendo de la empresa.",
        "Su sucesor volvió a centrarse en las tiendas.",
    ], [("cap4", 0, -0.6), ("b_giro", 0, 1.0), ("b_reacciona", 1, 0), ("b_online", 2, 0), ("b_gana", 3, 0), ("b_choques", 4, 0), ("b_tiendas_otra", 5, 0)]),
    ("5. El final", [
        "Mientras tanto, en dos mil siete, Netflix lanzó algo que lo cambió todo: ver películas directamente por internet.",
        "Ya no hacía falta ir a ninguna tienda. Ni esperar al cartero.",
        "En dos mil diez, Blockbuster se declaró en quiebra.",
        "Hoy Netflix tiene cientos de millones de suscriptores en todo el mundo.",
        "¿Y Blockbuster? Queda una sola tienda, en la ciudad de Bend, en Oregón, convertida casi en un museo.",
    ], [("cap5", 0, -0.6), ("b_streaming", 0, 1.0), ("b_cartero", 1, 0), ("b_quiebra", 2, 0), ("b_suscriptores", 3, 0), ("b_ultima", 4, 0)]),
    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: si tu negocio depende de algo que tus clientes odian, alguien acabará ofreciéndoles lo contrario.",
        "Dos: lo que hoy parece un nicho puede ser el mercado entero de mañana.",
        "Y tres: Blockbuster no perdió por no reaccionar. Perdió porque, cuando reaccionó, no se atrevió a llegar hasta el final.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Cincuenta millones de dólares. Probablemente, la oportunidad perdida más famosa de la historia de los negocios.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Llegaste a ir a un videoclub? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("b_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("CNBC, «How Netflix almost lost the movie rental wars to Blockbuster» (2020)", "https://www.cnbc.com/2020/09/22/how-netflix-almost-lost-the-movie-rental-wars-to-blockbuster.html"),
    ("Fortune, «Netflix cofounder Marc Randolph recalls Blockbuster rejecting chance to buy it» (2023)", "https://www.fortune.com/2023/04/14/netflix-cofounder-marc-randolph-recalls-blockbuster-rejecting-chance-to-buy-it"),
    ("Today I Found Out, «The Truth About Blockbuster Turning Down Purchasing Netflix»", "https://todayifoundout.com/?p=60247"),
    ("KTLA, sobre la última tienda Blockbuster en Bend (Oregón)", "https://ktla.com/news/technology/visiting-the-last-blockbuster-store-bend-oregon-location/amp/"),
    ("Wikipedia, «Blockbuster LLC»", "https://en.wikipedia.org/wiki/Blockbuster_LLC"),
]
DESCRIPCION = ("En el año 2000, los fundadores de Netflix ofrecieron su empresa a Blockbuster por 50 millones de dólares. Blockbuster dijo que no. "
               "Pero la historia tiene un giro que casi nadie cuenta: Blockbuster contraatacó y estuvo a punto de ganar. Esta es la guerra del videoclub.")
ETIQUETAS = "blockbuster, netflix, blockbuster netflix 50 millones, qué le pasó a blockbuster, videoclub, reed hastings, marc randolph, john antioco, historia de marcas, código de barras"
HASHTAGS = "#Netflix #Blockbuster #HistoriaDeMarcas"
LISTA = "Guerras de marcas"
NOTA = "La anécdota de la multa de 40 $ la cuenta Hastings; Randolph la ha matizado. Lo de que «se rieron» procede del entonces director financiero de Netflix, Barry McCarthy."
PREGUNTA = "¿LLEGASTE A IR A *UN VIDEOCLUB*?"
