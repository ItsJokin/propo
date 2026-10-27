"""Guion del vídeo 8 de Código de Barras: Nintendo, cien años antes de Mario."""
TITULO = "Nintendo: los 100 años antes de Mario"
TITULOS_ALT = ["Nintendo vendía cartas antes que videojuegos", "La historia de Nintendo que casi nadie conoce"]
MARCA = "Nintendo"
SEGMENTOS = [
    ("Introducción", [
        "Mario, Zelda, Pokémon, la Switch.",
        "Nintendo es probablemente la empresa de videojuegos más famosa del mundo.",
        "Pero cuando nació, no existían los videojuegos. Ni la televisión. Ni siquiera la electricidad en la mayoría de las casas.",
        "Nintendo tiene más de cien años de historia antes de Mario.",
        "Y en ese siglo vendió cartas, montó una empresa de taxis y llegó a comercializar arroz instantáneo.",
    ], [("n_consolas", 0, 0), ("n_famosa", 1, 0), ("n_sin_luz", 2, 0), ("n_100", 3, 0), ("n_rarezas", 4, 0)]),
    ("1. Las cartas", [
        "Kioto, Japón. Veintitrés de septiembre de mil ochocientos ochenta y nueve.",
        "Un artesano llamado Fusajiro Yamauchi abre un pequeño negocio para fabricar hanafuda: unas cartas japonesas tradicionales, decoradas con flores.",
        "El nombre de la empresa se suele traducir como algo parecido a «deja la suerte en manos del cielo».",
        "Aunque el significado exacto nunca se ha aclarado del todo.",
        "Las cartas de Nintendo se hicieron populares, y durante décadas ese fue su negocio.",
    ], [("cap1", 0, -0.6), ("n_kioto", 0, 1.0), ("n_hanafuda", 1, 0), ("n_nombre", 2, 0), ("n_misterio", 3, 0), ("n_populares", 4, 0)]),
    ("2. El nieto de veintidós años", [
        "En mil novecientos cuarenta y nueve, el presidente de la empresa sufre un derrame cerebral.",
        "Y llama a su nieto, Hiroshi Yamauchi, para que deje sus estudios de Derecho y se ponga al frente.",
        "Tenía veintidós años.",
        "Unos años después, Yamauchi visita en Estados Unidos la sede del mayor fabricante de naipes del mundo.",
        "Y se lleva una sorpresa: era una oficina modesta.",
        "Si el líder mundial de las cartas era así de pequeño, Nintendo nunca llegaría lejos vendiendo solo cartas.",
    ], [("cap2", 0, -0.6), ("n_derrame", 0, 1.0), ("n_hiroshi", 1, 0), ("n_22", 2, 0), ("n_viaje", 3, 0), ("n_modesta", 4, 0), ("n_techo", 5, 0)]),
    ("3. Probarlo todo", [
        "Así que Nintendo empezó a probar suerte en otros negocios.",
        "Tuvo una empresa de taxis.",
        "Vendió arroz instantáneo.",
        "La mayoría de estos experimentos fracasaron.",
        "Y la empresa llegó a estar en una situación muy delicada.",
        "Pero entre tanto intento fallido había una idea que sí funcionaba: los juguetes.",
    ], [("cap3", 0, -0.6), ("n_suerte", 0, 1.0), ("n_taxi", 1, 0), ("n_arroz", 2, 0), ("n_fracaso", 3, 0), ("n_delicada", 4, 0), ("n_juguetes", 5, 0)]),
    ("4. El brazo extensible", [
        "La historia cuenta que Yamauchi vio a un joven empleado de mantenimiento jugando con un brazo extensible que se había fabricado él mismo.",
        "Se llamaba Gunpei Yokoi.",
        "Yamauchi le pidió que lo convirtiera en un producto. Se llamó Ultra Hand, y se vendió muy bien.",
        "Yokoi pasó de mantenimiento a crear juguetes. Y más adelante inventaría las Game and Watch y la Game Boy.",
        "Nintendo había encontrado su camino: el entretenimiento.",
    ], [("cap4", 0, -0.6), ("n_brazo", 0, 1.0), ("n_yokoi", 1, 0), ("n_ultrahand", 2, 0), ("n_gameboy", 3, 0), ("n_camino", 4, 0)]),
    ("5. Llega Mario", [
        "En mil novecientos ochenta y uno, Nintendo lanza una máquina recreativa llamada Donkey Kong.",
        "Su protagonista era un hombrecillo con bigote que saltaba barriles. En la versión original no se llamaba Mario: le llamaban Jumpman.",
        "El nombre de Mario se lo pusieron en la filial estadounidense, y viene de Mario Segale, el dueño del almacén que Nintendo alquilaba en Estados Unidos.",
        "El propio creador del personaje, Shigeru Miyamoto, lo ha confirmado.",
        "Dos años después, en mil novecientos ochenta y tres, Nintendo lanza en Japón su consola Famicom, que en Occidente conocimos como la NES.",
        "La empresa de las cartas de flores acababa de cambiar la historia de los videojuegos.",
    ], [("cap5", 0, -0.6), ("n_donkey", 0, 1.0), ("n_jumpman", 1, 0), ("n_segale", 2, 0), ("n_miyamoto", 3, 0), ("n_famicom", 4, 0), ("n_historia", 5, 0)]),
    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: a veces hay que ver a tu mayor competidor de cerca para entender que tu mercado se te ha quedado pequeño.",
        "Dos: fracasar en muchas cosas no es un problema, si sigues buscando la que funciona.",
        "Y tres: las buenas ideas pueden venir de cualquier parte. Incluso de un empleado de mantenimiento.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Cartas de flores, taxis, arroz instantáneo y un fontanero con bigote. Todo eso es Nintendo.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Cuál fue tu primera consola? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("n_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("Wikipedia, «History of Nintendo»", "https://en.wikipedia.org/wiki/History_of_Nintendo"),
    ("Wikipedia, «Hiroshi Yamauchi»", "https://en.wikipedia.org/wiki/Hiroshi_Yamauchi"),
    ("i-programmer, «Nintendo – The Early History»", "https://www.i-programmer.info/history/9-machines/269-nintendo-the-early-history.html"),
    ("Wikipedia, «Mario Segale»", "https://en.wikipedia.org/wiki/Mario_Segale"),
    ("Mental Floss, sobre Mario Segale", "https://www.mentalfloss.com/article/562523/super-mario-inspiration-mario-segale-dies-nintendo"),
]
DESCRIPCION = ("Nintendo nació en Kioto en 1889 fabricando hanafuda, cartas japonesas decoradas con flores. Antes de Mario tuvo taxis, vendió arroz "
               "instantáneo y casi se hunde. Un brazo extensible, un empleado de mantenimiento y un casero llamado Mario Segale lo cambiaron todo.")
ETIQUETAS = "nintendo, historia de nintendo, hanafuda, hiroshi yamauchi, gunpei yokoi, ultra hand, donkey kong, mario segale, famicom, historia de marcas, código de barras"
HASHTAGS = "#Nintendo #HistoriaDeMarcas #Videojuegos"
LISTA = "Empieza aquí"
NOTA = "Las fuentes discrepan sobre el parentesco exacto entre Hiroshi Yamauchi y el fundador; usamos la versión de Wikipedia (nieto del segundo presidente). La historia de cómo se eligió el nombre de Mario tiene varias versiones; Miyamoto confirmó en 2015 que viene de Mario Segale."
PREGUNTA = "¿CUÁL FUE TU *PRIMERA CONSOLA*?"
