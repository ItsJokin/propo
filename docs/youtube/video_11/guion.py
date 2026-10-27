"""Guion del vídeo 11 de Código de Barras: IKEA."""
TITULO = "IKEA: por qué sus muebles tienen esos nombres tan raros"
TITULOS_ALT = ["La historia de IKEA: de vender cerillas a amueblar el mundo", "El secreto del paquete plano de IKEA"]
MARCA = "IKEA"
SEGMENTOS = [
    ("Introducción", [
        "Billy, Kallax, Malm, Poäng.",
        "Seguramente tienes en casa algún mueble con un nombre así.",
        "IKEA es la marca de muebles más famosa del mundo.",
        "Pero, ¿sabes de dónde salen esos nombres? ¿Y por qué todo viene desmontado en una caja plana?",
        "Las dos respuestas tienen una historia detrás.",
    ], [("i_nombres", 0, 0), ("i_casa", 1, 0), ("i_famosa", 2, 0), ("i_preguntas", 3, 0), ("i_historia", 4, 0)]),
    ("1. Un chico de diecisiete años", [
        "Suecia, mil novecientos cuarenta y tres.",
        "Un chico de diecisiete años, Ingvar Kamprad, funda su propia empresa.",
        "Según su propia historia, desde niño compraba cerillas al por mayor y las revendía a sus vecinos con un pequeño margen.",
        "El nombre de la empresa sale de sus iniciales y de su origen.",
        "I, de Ingvar. K, de Kamprad. E, de Elmtaryd, la granja donde creció. Y A, de Agunnaryd, su pueblo.",
        "Al principio IKEA vendía de todo: bolígrafos, carteras, marcos… Los muebles llegaron unos años después.",
    ], [("cap1", 0, -0.6), ("i_suecia", 0, 1.0), ("i_ingvar", 1, 0), ("i_cerillas", 2, 0), ("i_siglas", 3, 0), ("i_letras", 4, 0), ("i_detodo", 5, 0)]),
    ("2. La mesa que no cabía", [
        "La idea más famosa de IKEA nació de un problema de espacio.",
        "Según cuenta la empresa, en mil novecientos cincuenta y seis, un diseñador llamado Gillis Lundgren tenía que llevar una mesa a una sesión de fotos para el catálogo.",
        "La mesa no cabía en el coche.",
        "Así que le quitó las patas.",
        "Y ahí surgió una idea: si los muebles se venden desmontados, ocupan mucho menos.",
        "Menos espacio en el almacén, en el camión y en el coche del cliente. Y menos espacio significa precios más bajos.",
        "IKEA no inventó el mueble desmontable, pero fue quien lo convirtió en un sistema.",
    ], [("cap2", 0, -0.6), ("i_problema", 0, 1.0), ("i_lundgren", 1, 0), ("i_coche", 2, 0), ("i_patas", 3, 0), ("i_plano", 4, 0), ("i_ahorro", 5, 0), ("i_sistema", 6, 0)]),
    ("3. El cliente trabaja", [
        "Con el paquete plano llegó otra idea revolucionaria: que el cliente hiciera parte del trabajo.",
        "Tú recoges la caja en el almacén. Tú la llevas a casa. Tú lo montas.",
        "Cada cosa que haces tú es un coste que IKEA se ahorra, y que no tiene que cobrarte.",
        "Y hay un efecto curioso: los investigadores lo llaman el «efecto IKEA».",
        "Valoramos más lo que hemos montado con nuestras propias manos.",
    ], [("cap3", 0, -0.6), ("i_cliente", 0, 1.0), ("i_tu", 1, 0), ("i_coste", 2, 0), ("i_efecto", 3, 0), ("i_manos", 4, 0)]),
    ("4. Los nombres", [
        "¿Y los nombres?",
        "Kamprad era disléxico, y le costaba recordar los códigos numéricos de los productos.",
        "Así que se le ocurrió ponerles nombres. Palabras que pudiera recordar y visualizar.",
        "Con el tiempo, aquello se convirtió en un sistema.",
        "Los sofás suelen llevar nombres de lugares de Suecia. Las camas y los armarios, de lugares de Noruega. Las alfombras, de lugares de Dinamarca.",
        "Por eso cada mueble de IKEA parece una palabra en clave. En realidad, muchas veces es un mapa.",
    ], [("cap4", 0, -0.6), ("i_ynombres", 0, 1.0), ("i_dislexia", 1, 0), ("i_palabras", 2, 0), ("i_sistema_nombres", 3, 0), ("i_mapa", 4, 0), ("i_clave", 5, 0)]),
    ("5. El laberinto", [
        "La primera tienda de IKEA abrió en mil novecientos cincuenta y ocho en Älmhult, un pequeño pueblo de Suecia.",
        "Desde entonces, sus tiendas tienen algo que todos reconocemos: un recorrido que te lleva por todas las secciones antes de llegar a la salida.",
        "Por el camino ves salones, cocinas y dormitorios ya montados, que te ayudan a imaginar cómo quedaría en tu casa.",
        "Y, a mitad del recorrido, un restaurante. Para que no te vayas por hambre.",
        "Kamprad murió en dos mil dieciocho, a los noventa y un años, dejando una de las empresas más conocidas del planeta.",
    ], [("cap5", 0, -0.6), ("i_almhult", 0, 1.0), ("i_recorrido", 1, 0), ("i_montados", 2, 0), ("i_restaurante", 3, 0), ("i_kamprad", 4, 0)]),
    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: un problema pequeño, como una mesa que no cabe en un coche, puede esconder una gran idea.",
        "Dos: si el cliente hace parte del trabajo, puedes ofrecerle un precio que nadie más puede.",
        "Y tres: a veces una dificultad personal, como la dislexia, acaba convirtiéndose en una seña de identidad.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "La próxima vez que montes un mueble de IKEA y te sobre un tornillo, acuérdate: todo empezó con una mesa que no cabía en un coche.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Cuál es el mueble de IKEA más difícil que has montado? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("i_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("Dezeen, «Five key furniture designs launched by IKEA founder Ingvar Kamprad» (2018)", "https://www.dezeen.com/2018/01/29/five-key-furniture-designs-ikea-founder-ingvar-kamprad-launched/"),
    ("Mental Floss, «How IKEA Comes Up With Its Product Names»", "https://www.mentalfloss.com/article/616419/how-ikea-names-its-products"),
    ("Reader's Digest, «IKEA product naming system»", "https://www.rd.com/article/ikea-product-naming-system/"),
    ("Business Insider, «There's A Logical System Behind IKEA's Crazy Product Names»", "https://www.businessinsider.in/Theres-A-Logical-System-Behind-IKEAs-Crazy-Product-Names/articleshow/25720770.cms"),
    ("Norton, Mochon y Ariely, «The IKEA effect: When labor leads to love» (Journal of Consumer Psychology, 2012)", "https://doi.org/10.1016/j.jcps.2011.08.002"),
    ("Wikipedia, «Ingvar Kamprad»", "https://en.wikipedia.org/wiki/Ingvar_Kamprad"),
]
DESCRIPCION = ("IKEA nació en 1943, cuando Ingvar Kamprad tenía 17 años. Su nombre son sus iniciales, su granja y su pueblo. El paquete plano surgió de "
               "una mesa que no cabía en un coche, y los nombres de sus muebles, de la dislexia de su fundador. Esta es la historia de IKEA.")
ETIQUETAS = "ikea, historia de ikea, nombres de ikea, ingvar kamprad, paquete plano, efecto ikea, gillis lundgren, muebles, historia de marcas, código de barras"
HASHTAGS = "#IKEA #HistoriaDeMarcas #Curiosidades"
LISTA = "Secretos del supermercado"
NOTA = "La historia de la mesa de Lundgren es la versión que cuenta la propia IKEA; se presenta como tal. El sistema de nombres tiene excepciones (por ejemplo, BILLY lleva nombre de persona)."
PREGUNTA = "¿EL MUEBLE MÁS *DIFÍCIL DE MONTAR*?"
