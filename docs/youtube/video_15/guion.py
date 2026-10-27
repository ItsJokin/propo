"""Guion del vídeo 15 de Código de Barras: el origen de Coca-Cola."""
TITULO = "Coca-Cola nació en una farmacia: la historia que no te contaron"
TITULOS_ALT = ["Así se inventó la Coca-Cola", "Coca-Cola vendía 9 vasos al día"]
MARCA = "Coca_Cola"
SEGMENTOS = [
    ("Introducción", [
        "Es probablemente la marca más conocida del planeta.",
        "Pero el primer año, Coca-Cola vendía, de media, unos nueve vasos al día.",
        "Nació en una farmacia, la inventó un farmacéutico que buscaba un remedio, y su creador murió sin imaginar lo que había creado.",
        "Esta es la historia de cómo un jarabe de Atlanta acabó en casi todos los países del mundo.",
    ], [("cc_marca", 0, 0), ("cc_nueve", 1, 0), ("cc_farmacia", 2, 0), ("cc_mundo", 3, 0)]),
    ("1. El farmacéutico", [
        "Atlanta, Estados Unidos, mil ochocientos ochenta y seis.",
        "John Pemberton es un farmacéutico que lleva años preparando tónicos y remedios.",
        "Antes había vendido una bebida con vino y extracto de hoja de coca, muy parecida a otras que estaban de moda en Europa.",
        "Pero ese año, Atlanta aprobó restricciones al alcohol.",
        "Así que Pemberton preparó una versión sin vino: un jarabe dulce para mezclar con agua.",
        "El ocho de mayo de mil ochocientos ochenta y seis lo llevó a la farmacia Jacobs, donde se vendió por cinco centavos el vaso.",
    ], [("cap1", 0, -0.6), ("cc_atlanta", 0, 1.0), ("cc_pemberton", 1, 0), ("cc_vino", 2, 0), ("cc_alcohol", 3, 0), ("cc_jarabe", 4, 0), ("cc_jacobs", 5, 0)]),
    ("2. El nombre", [
        "El nombre no se le ocurrió a Pemberton, sino a su contable, Frank Robinson.",
        "Coca, por la hoja de coca. Cola, por la nuez de cola, que aportaba cafeína.",
        "Robinson pensó que las dos C quedarían bien en los anuncios.",
        "Y fue él quien escribió el nombre con esa letra cursiva que todavía hoy reconoces.",
        "Sí: en sus primeros años, la bebida llevaba extracto de hoja de coca. Ese ingrediente se eliminó a principios del siglo veinte.",
    ], [("cap2", 0, -0.6), ("cc_robinson", 0, 1.0), ("cc_coca_cola", 1, 0), ("cc_dosc", 2, 0), ("cc_cursiva", 3, 0), ("cc_hoja", 4, 0)]),
    ("3. El hombre que la compró", [
        "Pemberton estaba enfermo y necesitaba dinero.",
        "Fue vendiendo partes del negocio a distintos socios.",
        "Y un empresario de Atlanta, Asa Candler, se hizo con el control de la fórmula y de la marca. Según la cifra más citada, pagó en total unos dos mil trescientos dólares.",
        "Pemberton murió en mil ochocientos ochenta y ocho, sin ver el éxito de su invento.",
        "Candler era un vendedor nato: regalaba cupones para probar la bebida gratis y llenó el país de relojes, calendarios y carteles con la marca.",
    ], [("cap3", 0, -0.6), ("cc_enfermo", 0, 1.0), ("cc_socios", 1, 0), ("cc_candler", 2, 0), ("cc_muere", 3, 0), ("cc_cupones", 4, 0)]),
    ("4. La botella", [
        "Con el éxito llegaron las imitaciones, con nombres y botellas muy parecidos.",
        "En mil novecientos quince, los embotelladores de Coca-Cola convocaron un concurso: querían una botella que se reconociera incluso a oscuras, o rota en el suelo.",
        "Lo ganó una fábrica de vidrio de Indiana.",
        "Su diseñador buscó inspiración en la enciclopedia. Según la versión más extendida, quería ver una hoja de coca o una nuez de cola… y acabó dibujando una vaina de cacao.",
        "De ese error nació una de las formas más reconocibles del mundo.",
    ], [("cap4", 0, -0.6), ("cc_imitaciones", 0, 1.0), ("cc_concurso", 1, 0), ("cc_indiana", 2, 0), ("cc_cacao", 3, 0), ("cc_forma", 4, 0)]),
    ("5. El secreto", [
        "La fórmula de Coca-Cola es uno de los secretos comerciales más famosos de la historia.",
        "La compañía la guarda en una cámara acorazada en Atlanta, que hoy se puede ver en su museo.",
        "Ese misterio también es marketing: una receta que nadie puede copiar.",
        "Aquella bebida de farmacia que vendía unos pocos vasos al día se vende hoy en más de doscientos países.",
    ], [("cap5", 0, -0.6), ("cc_formula", 0, 1.0), ("cc_camara", 1, 0), ("cc_misterio", 2, 0), ("cc_200", 3, 0)]),
    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: inventar algo no basta. Pemberton creó la bebida, pero fue Candler quien supo venderla.",
        "Dos: un buen nombre y una buena imagen pueden valer tanto como el producto.",
        "Y tres: a veces un error, como el de la botella, acaba siendo tu seña de identidad.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un farmacéutico, un contable con buena letra y un vendedor incansable. Así empezó todo.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Sabías que nació en una farmacia? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("cc_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("The Coca-Cola Company, «The birth of a refreshing idea»", "https://www.coca-colacompany.com/about-us/history/the-birth-of-a-refreshing-idea"),
    ("The Coca-Cola Company, «The history of the Coca-Cola contour bottle»", "https://www.coca-colacompany.com/about-us/history/the-history-of-the-coca-cola-contour-bottle"),
    ("FoodNavigator, «How Coke got its curves» (2015)", "https://www.foodnavigator.com/Article/2015/02/26/How-Coke-got-its-curves-Coca-Cola-s-contour-bottle-celebrates-100-years/"),
    ("Wikipedia, «Coca-Cola»", "https://en.wikipedia.org/wiki/Coca-Cola"),
    ("Wikipedia, «Asa Griggs Candler»", "https://en.wikipedia.org/wiki/Asa_Griggs_Candler"),
]
DESCRIPCION = ("Coca-Cola nació el 8 de mayo de 1886 en una farmacia de Atlanta. Su inventor, John Pemberton, murió dos años después sin ver su éxito; "
               "el nombre lo puso su contable, y la famosa botella nació de un error en una enciclopedia. Esta es la historia de cómo un jarabe de "
               "farmacia conquistó el mundo.")
ETIQUETAS = "coca-cola, historia de coca-cola, origen de coca-cola, john pemberton, asa candler, botella de coca-cola, fórmula secreta, historia de marcas, código de barras"
HASHTAGS = "#CocaCola #HistoriaDeMarcas #Curiosidades"
LISTA = "Empieza aquí"
NOTA = "Nota: la cifra de unos 2.300 dólares que pagó Candler es la más citada; las fuentes sobre el diseño de la botella hablan de una ilustración de una vaina de cacao."
PREGUNTA = "¿SABÍAS QUE NACIÓ *EN UNA FARMACIA*?"
