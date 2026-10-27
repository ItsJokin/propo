"""Guion del vídeo 4 de Código de Barras: Adidas contra Puma.
Formato igual que video_01/guion.py. Las causas de la ruptura y las anécdotas discutidas se presentan como versiones."""

TITULO = "Adidas vs Puma: los dos hermanos que dividieron un pueblo"
TITULOS_ALT = ["La guerra de hermanos detrás de tus zapatillas", "Adidas y Puma nacieron en la misma casa"]
MARCA = "Adidas_vs_Puma"

SEGMENTOS = [
    ("Introducción", [
        "Hay un pequeño pueblo en Alemania donde, durante décadas, la gente miraba primero tus zapatillas… y después tu cara.",
        "Porque según la marca que llevaras, eras de un bando o del otro.",
        "En ese pueblo nacieron dos de las marcas deportivas más grandes del mundo: Adidas y Puma.",
        "Y las fundaron dos hermanos que acabaron sin hablarse.",
    ], [("a_pueblo", 0, 0), ("a_bandos", 1, 0), ("a_marcas", 2, 0), ("a_hermanos", 3, 0)]),

    ("1. La fábrica de los hermanos", [
        "El pueblo se llama Herzogenaurach, en Baviera.",
        "En los años veinte, dos hermanos, Adolf y Rudolf Dassler, montaron juntos una fábrica de calzado.",
        "Adolf, al que todos llamaban Adi, era el inventor: el que diseñaba y probaba las zapatillas.",
        "Rudolf era el vendedor: el que salía a buscar clientes.",
        "Juntos funcionaban de maravilla.",
    ], [("cap1", 0, -0.6), ("a_herzo", 0, 1.2), ("a_fabrica", 1, 0), ("a_adi", 2, 0), ("a_rudolf", 3, 0), ("a_juntos", 4, 0)]),

    ("2. Jesse Owens", [
        "Su gran momento llegó en los Juegos Olímpicos de Berlín, en mil novecientos treinta y seis.",
        "El atleta estadounidense Jesse Owens corrió con zapatillas de los hermanos Dassler.",
        "Y ganó cuatro medallas de oro.",
        "Aquello fue publicidad mundial para una pequeña fábrica de un pueblo de Baviera.",
    ], [("cap2", 0, -0.6), ("a_berlin", 0, 1.2), ("a_owens", 1, 0), ("a_oros", 2, 0), ("a_publicidad", 3, 0)]),

    ("3. La ruptura", [
        "Pero tras la Segunda Guerra Mundial, todo saltó por los aires.",
        "¿Por qué se pelearon los hermanos? Nadie lo sabe con certeza.",
        "Hay varias versiones: celos entre las familias, sospechas mutuas durante la guerra y discusiones sobre quién mandaba en la empresa.",
        "Lo que sí sabemos es el resultado.",
        "A finales de los años cuarenta, los hermanos se separaron y dividieron la empresa.",
        "Rudolf cruzó el río del pueblo y fundó su propia marca. Primero la llamó Ruda. Después, Puma.",
        "Adi se quedó y registró la suya en mil novecientos cuarenta y nueve: Adidas, que sale de su apodo, Adi, y de las primeras letras de su apellido, Dassler.",
    ], [("cap3", 0, -0.6), ("a_guerra", 0, 1.2), ("a_porque", 1, 0), ("a_versiones", 2, 0), ("a_resultado", 3, 0), ("a_separan", 4, 0), ("a_puma", 5, 0), ("a_adidas", 6, 0)]),

    ("4. El pueblo dividido", [
        "Y el pueblo se dividió con ellos.",
        "Había comercios, bares y hasta equipos de fútbol de Adidas y de Puma.",
        "La gente se fijaba tanto en el calzado de los demás que a Herzogenaurach se la llegó a llamar «el pueblo de los cuellos doblados».",
        "Porque todo el mundo iba mirando hacia abajo… a los pies.",
    ], [("cap4", 0, -0.6), ("a_divide", 0, 1.0), ("a_bares", 1, 0), ("a_cuellos", 2, 0), ("a_pies", 3, 0)]),

    ("5. La guerra en el campo", [
        "La rivalidad saltó a los estadios.",
        "En el Mundial de mil novecientos cincuenta y cuatro, la selección de Alemania Occidental jugó con botas de Adidas con tacos que se podían cambiar.",
        "Y ganó la final, bajo la lluvia, contra la gran favorita, Hungría.",
        "Años después llegó otra anécdota famosa: según se cuenta, antes del Mundial de mil novecientos setenta, las dos marcas pactaron no fichar a Pelé, para no arruinarse pujando por él.",
        "Y, siempre según esa historia, Puma rompió el pacto.",
    ], [("cap5", 0, -0.6), ("a_estadios", 0, 1.0), ("a_1954", 1, 0), ("a_final_lluvia", 2, 0), ("a_pele", 3, 0), ("a_pacto_roto", 4, 0)]),

    ("6. Hasta el final", [
        "Los hermanos nunca se reconciliaron.",
        "Y la pelea llegó hasta el último lugar posible.",
        "Los dos están enterrados en el cementerio del pueblo… en extremos opuestos.",
        "Mientras tanto, la rivalidad dejó a ambas marcas mirándose la una a la otra. Y otras marcas aprovecharon para crecer.",
    ], [("cap6", 0, -0.6), ("a_nunca", 0, 1.0), ("a_ultimo", 1, 0), ("a_cementerio", 2, 0), ("a_otros", 3, 0)]),

    ("7. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: un inventor y un vendedor juntos pueden ser imparables. Separados, cada uno tiene que aprender lo que hacía el otro.",
        "Dos: la rivalidad puede impulsarte… o distraerte de lo que pasa fuera.",
        "Y tres: una pelea familiar puede durar más que las personas que la empezaron.",
    ], [("cap7", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),

    ("Final", [
        "La próxima vez que te pongas unas zapatillas, ya lo sabes: puede que tengan detrás una pelea entre hermanos.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Tú eres más de Adidas o de Puma? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("a_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]

FUENTES = [
    ("Wikipedia, «Dassler brothers feud»", "https://en.wikipedia.org/wiki/Dassler_brothers_feud"),
    ("Wikipedia, «Puma (brand)»", "https://en.wikipedia.org/wiki/Puma_(brand)"),
    ("Amusing Planet, «The Sibling Rivalry That Gave Birth to Adidas and Puma»", "https://www.amusingplanet.com/2023/09/the-sibling-rivalry-that-gave-birth-to.html"),
    ("TBS News, «Adidas and Puma: How a sibling rivalry gave rise to two giants»", "https://www.tbsnews.net/features/adidas-and-puma-how-sibling-rivalry-gave-rise-two-giants-sports-world-710938"),
    ("Worldcrunch, «From one German town, the richest local rivalry in global sports»", "https://worldcrunch.com/business-finance/from-one-german-town-the-richest-local-rivalry-in-global-sports-adidas-v-puma/"),
    ("Footwear Magazine, «10 moments that defined the adidas vs. Puma rivalry»", "https://footwearmagazine.com/adidas-vs-puma-rivalry/"),
    ("Today I Found Out, «The Fascinating Family Feud that Led to Adidas and Puma»", "https://www.todayifoundout.com/?p=53103"),
]

DESCRIPCION = ("Adidas y Puma nacieron en el mismo pueblo alemán, de la misma familia: los hermanos Adi y Rudolf Dassler. Juntos calzaron a "
               "Jesse Owens en Berlín 1936; separados, dividieron Herzogenaurach en dos bandos durante décadas. Esta es la historia de la "
               "rivalidad entre hermanos más famosa del deporte.")
ETIQUETAS = "adidas, puma, adidas vs puma, hermanos dassler, adi dassler, rudolf dassler, herzogenaurach, historia de adidas, historia de puma, guerras de marcas, código de barras"
HASHTAGS = "#Adidas #Puma #HistoriaDeMarcas"
LISTA = "Guerras de marcas"
NOTA = "Nadie sabe con certeza por qué se pelearon los hermanos; contamos las versiones más citadas. El pacto sobre Pelé de 1970 se presenta como la historia que se cuenta, no como un hecho documentado."
PREGUNTA = "¿ERES MÁS DE *ADIDAS O DE PUMA*?"
