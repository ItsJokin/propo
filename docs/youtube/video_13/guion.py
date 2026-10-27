"""Guion del vídeo 13 de Código de Barras: McDonald's, la verdadera historia."""
TITULO = "McDonald's: los hermanos a los que les quitaron su apellido"
TITULOS_ALT = ["La verdadera historia de McDonald's", "McDonald's no lo fundó Ray Kroc"]
MARCA = "McDonalds"
SEGMENTOS = [
    ("Introducción", [
        "Es probablemente la cadena de restaurantes más famosa del planeta.",
        "Mucha gente cree que McDonald's lo fundó Ray Kroc.",
        "Pero McDonald's se llama así por dos hermanos: Richard y Maurice McDonald.",
        "Ellos inventaron el sistema. Y acabaron perdiendo hasta el derecho a usar su propio apellido en su restaurante.",
    ], [("m_famosa", 0, 0), ("m_kroc_cree", 1, 0), ("m_hermanos", 2, 0), ("m_perder", 3, 0)]),
    ("1. Los hermanos", [
        "California, mil novecientos cuarenta.",
        "Richard y Maurice McDonald abren un restaurante para coches en San Bernardino.",
        "Funcionaba bien, pero tenía problemas: un menú largo, camareros, platos que se rompían y esperas.",
        "En mil novecientos cuarenta y ocho, cierran el restaurante unos meses y lo transforman por completo.",
        "Reducen el menú a unos pocos productos: hamburguesas, patatas, batidos, refrescos.",
        "Y organizan la cocina como una cadena de montaje. Lo llamaron el Speedee Service System.",
    ], [("cap1", 0, -0.6), ("m_california", 0, 1.0), ("m_drive", 1, 0), ("m_problemas", 2, 0), ("m_cierran", 3, 0), ("m_menu", 4, 0), ("m_cadena", 5, 0)]),
    ("2. El vendedor de batidoras", [
        "Ray Kroc vendía batidoras para hacer batidos.",
        "En mil novecientos cincuenta y cuatro le llama la atención un pedido: un solo restaurante de California había comprado ocho de sus máquinas.",
        "Kroc viaja a San Bernardino para verlo con sus propios ojos.",
        "Y se queda impresionado: colas de clientes, comida en segundos y una cocina que funcionaba como un reloj.",
        "Tenía cincuenta y dos años. Y vio lo que los hermanos no querían hacer: multiplicar aquel restaurante por todo el país.",
    ], [("cap2", 0, -0.6), ("m_batidoras", 0, 1.0), ("m_ocho", 1, 0), ("m_viaja", 2, 0), ("m_impresion", 3, 0), ("m_52", 4, 0)]),
    ("3. El verdadero negocio", [
        "Kroc consiguió los derechos para abrir franquicias, y en mil novecientos cincuenta y cinco abrió su primer McDonald's en Des Plaines, cerca de Chicago.",
        "Pero las franquicias dejaban poco dinero.",
        "La solución vino de un experto financiero, Harry Sonneborn.",
        "Su idea fue que la empresa comprara o alquilara los terrenos, y se los alquilara después a los franquiciados con un margen.",
        "McDonald's no solo vendía hamburguesas. También se convirtió en un gigantesco negocio inmobiliario.",
    ], [("cap3", 0, -0.6), ("m_desplaines", 0, 1.0), ("m_poco", 1, 0), ("m_sonneborn", 2, 0), ("m_terrenos", 3, 0), ("m_inmobiliario", 4, 0)]),
    ("4. La compra", [
        "Las tensiones entre Kroc y los hermanos crecían. Él quería ir más rápido. Ellos, mantener el control.",
        "En mil novecientos sesenta y uno, Kroc les compró la empresa por dos millones setecientos mil dólares.",
        "La cifra estaba calculada para que cada hermano se quedara con un millón después de impuestos.",
        "Según la familia McDonald, también hubo un acuerdo verbal para que recibieran una parte de los beneficios futuros. Nunca se puso por escrito, y nunca se pagó.",
        "Los hermanos se quedaron con su restaurante original, pero ya no podían usar el nombre McDonald's. Lo rebautizaron como The Big M.",
        "Y, según se cuenta, Kroc abrió un McDonald's muy cerca. El restaurante de los hermanos acabó cerrando.",
    ], [("cap4", 0, -0.6), ("m_tension", 0, 1.0), ("m_compra", 1, 0), ("m_millon", 2, 0), ("m_verbal", 3, 0), ("m_bigm", 4, 0), ("m_cierra", 5, 0)]),
    ("5. El imperio", [
        "Bajo el control de Kroc, McDonald's se extendió por todo el mundo.",
        "En España, el primer restaurante abrió en mil novecientos ochenta y uno, en la Gran Vía de Madrid.",
        "Hoy hay decenas de miles de restaurantes McDonald's en más de cien países.",
        "En dos mil dieciséis, su historia llegó al cine con la película El fundador.",
        "Un título con algo de ironía, porque el sistema que hizo famoso a McDonald's lo habían inventado otros.",
    ], [("cap5", 0, -0.6), ("m_mundo", 0, 1.0), ("m_granvia", 1, 0), ("m_paises", 2, 0), ("m_pelicula", 3, 0), ("m_ironia", 4, 0)]),
    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: inventar un buen sistema no basta. Alguien tiene que querer multiplicarlo.",
        "Dos: el negocio real no siempre es el que ves. McDonald's vende hamburguesas, pero también terrenos.",
        "Y tres: lo que no está por escrito, en los negocios, no existe.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "La próxima vez que veas una M amarilla, acuérdate de los dos hermanos que crearon el sistema… y se quedaron sin su nombre.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Quién crees que es el verdadero fundador? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("m_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("Wikipedia, «History of McDonald's»", "https://en.wikipedia.org/wiki/History_of_McDonald%27s"),
    ("Wikipedia, «Richard and Maurice McDonald»", "https://en.wikipedia.org/wiki/Richard_and_Maurice_McDonald"),
    ("Wikipedia, «Ray Kroc»", "https://en.wikipedia.org/wiki/Ray_Kroc"),
    ("Marketing Directo, «McDonald's cumple 40 años en España»", "https://www.marketingdirecto.com/marketing-general/mcdonalds-cumple-anos-espana-claves-exito"),
]
DESCRIPCION = ("McDonald's no lo fundó Ray Kroc: lo crearon los hermanos Richard y Maurice McDonald en San Bernardino (California). En 1961 Kroc les "
               "compró la empresa por 2,7 millones de dólares, y los hermanos acabaron sin poder usar su apellido en su propio restaurante. "
               "Esta es la verdadera historia de McDonald's.")
ETIQUETAS = "mcdonalds, historia de mcdonalds, hermanos mcdonald, ray kroc, el fundador, speedee service system, harry sonneborn, franquicias, historia de marcas, código de barras"
HASHTAGS = "#McDonalds #HistoriaDeMarcas #ElFundador"
LISTA = "Empieza aquí"
NOTA = "El acuerdo verbal sobre los beneficios es la versión de la familia McDonald; se presenta como tal. Que Kroc abriera un McDonald's cerca del Big M se presenta como «según se cuenta»."
PREGUNTA = "¿QUIÉN ES EL *VERDADERO FUNDADOR*?"
