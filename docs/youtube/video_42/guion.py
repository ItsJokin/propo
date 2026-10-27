"""Guion del vídeo 42 de Código de Barras (formato largo): Instagram."""
TITULO = "Instagram: la app fracasada que Facebook compró por mil millones con 13 empleados"
TITULOS_ALT = ["La historia de Instagram (que empezó llamándose Burbn)", "Cómo dos amigos crearon Instagram en ocho semanas"]
MARCA = "Instagram"
SEGMENTOS = [
    ("Introducción", [
        "Una foto cuadrada, un filtro que la hace parecer antigua y un corazón para darle me gusta.",
        "Instagram es una de las aplicaciones más usadas del mundo. Más de dos mil millones de personas la usan cada mes, según la propia empresa.",
        "Pero empezó siendo otra cosa: una aplicación con nombre de whisky que casi nadie entendía.",
        "Sus filtros nacieron, según su creador, de una cámara de plástico barata y de una pregunta de su novia.",
        "Y año y medio después de su lanzamiento, Facebook la compró por mil millones de dólares. Tenía trece empleados.",
        "Esta es la historia de Instagram.",
    ], [("ig_foto", 0, 0), ("ig_usuarios", 1, 0), ("ig_whisky", 2, 0), ("ig_filtros", 3, 0), ("ig_compra", 4, 0), ("ig_historia", 5, 0)]),
    ("1. Una cámara de plástico", [
        "Kevin Systrom estudiaba en la Universidad de Stanford, en California. Le gustaban la tecnología, el diseño… y la fotografía.",
        "Pasó un trimestre estudiando en Florencia, en Italia. Y se llevó su mejor cámara.",
        "Según ha contado él mismo, su profesor de fotografía se la quitó. Y le dio a cambio una Holga: una cámara de plástico barata, que hacía fotos cuadradas, borrosas y con colores raros.",
        "La idea del profesor era que aprendiera a apreciar la imperfección.",
        "Aquella lección se le quedó grabada.",
    ], [("cap1", 0, -0.6), ("ig_stanford", 0, 1.0), ("ig_florencia", 1, 0), ("ig_holga", 2, 0), ("ig_imperfeccion", 3, 0), ("ig_grabada", 4, 0)]),
    ("2. Le dijo que no a Zuckerberg", [
        "Por aquella época, un joven llamado Mark Zuckerberg estaba creando una red social para universitarios: Facebook.",
        "Según contaron después varios medios, Zuckerberg le ofreció a Systrom trabajar con él en un servicio de fotos.",
        "Y Systrom dijo que no. Prefería terminar sus estudios.",
        "Años después, Zuckerberg pagaría mil millones de dólares por su empresa.",
        "Tras la universidad, Systrom trabajó en varias empresas tecnológicas, entre ellas Google. Y por las noches empezó a programar su propia aplicación.",
    ], [("cap2", 0, -0.6), ("ig_zuckerberg", 0, 1.0), ("ig_oferta", 1, 0), ("ig_no", 2, 0), ("ig_mil", 3, 0), ("ig_noches", 4, 0)]),
    ("3. Burbn", [
        "Su aplicación se llamaba Burbn, como el whisky bourbon, que le gustaba mucho.",
        "Permitía decir dónde estabas, quedar con amigos, ganar puntos por ir a sitios… y también subir fotos.",
        "Tenía tantas funciones que la gente no sabía para qué servía.",
        "Aun así, Systrom consiguió medio millón de dólares de inversores para seguir adelante. Y fichó a un compañero: Mike Krieger, un ingeniero brasileño que también había estudiado en Stanford.",
        "Juntos analizaron cómo se usaba Burbn. Y descubrieron algo: casi nadie usaba la mayoría de funciones. Pero la de subir fotos, sí.",
    ], [("cap3", 0, -0.6), ("ig_burbn", 0, 1.0), ("ig_funciones", 1, 0), ("ig_confusa", 2, 0), ("ig_krieger", 3, 0), ("ig_fotos", 4, 0)]),
    ("4. Tirarlo todo", [
        "Así que tomaron una decisión muy valiente: quitarlo casi todo.",
        "Ni planes, ni puntos, ni lugares. Solo fotos.",
        "Hacer una foto con el móvil, mejorarla y compartirla con tus amigos. Rápido. Muy rápido.",
        "En aquella época las cámaras de los móviles no eran muy buenas. Las fotos salían oscuras, planas, sin gracia. Y subirlas por internet era lento.",
        "Si conseguían que cualquier foto del móvil pareciera bonita, y que se compartiera en segundos, tendrían algo.",
    ], [("cap4", 0, -0.6), ("ig_quitar", 0, 1.0), ("ig_solo", 1, 0), ("ig_rapido", 2, 0), ("ig_camaras", 3, 0), ("ig_algo", 4, 0)]),
    ("5. La pregunta de la novia", [
        "Según ha contado Systrom en varias entrevistas, la idea de los filtros llegó en unas vacaciones en México.",
        "Su novia le dijo que no iba a usar la aplicación, porque sus fotos nunca quedaban tan bonitas como las de un amigo que las retocaba.",
        "Systrom le respondió que eso era por los filtros. Y esa misma tarde, en la playa, se puso a diseñar uno.",
        "Recordaba aquella cámara de plástico de Florencia: colores cálidos, bordes oscuros, un aire antiguo.",
        "Según se cuenta, una de las primeras fotos que subió con la aplicación fue de un perro junto a un puesto de tacos, con el pie de su novia al lado.",
    ], [("cap5", 0, -0.6), ("ig_mexico", 0, 1.0), ("ig_novia", 1, 0), ("ig_playa", 2, 0), ("ig_calidos", 3, 0), ("ig_perro", 4, 0)]),
    ("6. Instant más telegram", [
        "Faltaba un nombre.",
        "Lo formaron con dos palabras inglesas: instant, de cámara instantánea, como las Polaroid. Y telegram, telegrama: un mensaje que se envía a distancia.",
        "Instagram: fotos instantáneas que se envían al momento.",
        "Por eso las fotos eran cuadradas, como las de las Polaroid. Y por eso el primer icono de la aplicación era una cámara antigua de color marrón.",
    ], [("cap6", 0, -0.6), ("ig_nombre", 0, 1.0), ("ig_instant", 1, 0), ("ig_instagram", 2, 0), ("ig_cuadradas", 3, 0)]),
    ("7. Veinticinco mil en un día", [
        "Instagram salió en la tienda de aplicaciones del iPhone el seis de octubre de dos mil diez.",
        "Según contaron sus fundadores, ese primer día se apuntaron unas veinticinco mil personas.",
        "Tantas que los servidores no aguantaban, y tuvieron que pasar la noche arreglándolos.",
        "En dos meses tenían un millón de usuarios.",
        "Y la aplicación solo estaba en iPhone. La versión para Android no llegó hasta año y medio después.",
    ], [("cap7", 0, -0.6), ("ig_2010", 0, 1.0), ("ig_25000", 1, 0), ("ig_servidores", 2, 0), ("ig_millon", 3, 0), ("ig_android", 4, 0)]),
    ("8. Mil millones", [
        "En abril de dos mil doce, Instagram acababa de llegar a Android, y en pocos días se apuntó otro millón de personas.",
        "Instagram no ganaba dinero. No tenía anuncios. Pero estaba creciendo a una velocidad que daba miedo a sus rivales.",
        "Y ese mismo mes, Mark Zuckerberg llamó a Systrom.",
        "Facebook compró Instagram por mil millones de dólares, en dinero y acciones.",
        "La empresa tenía, según contaron los medios, trece empleados. Y llevaba en el mercado unos dieciocho meses.",
        "Para sus fundadores fue un cambio de vida de la noche a la mañana. Según la prensa, a Systrom le correspondieron unos cuatrocientos millones de dólares.",
        "Muchos pensaron que Facebook había pagado demasiado. Hoy se considera una de las mejores compras de la historia de internet.",
    ], [("cap8", 0, -0.6), ("ig_abril", 0, 1.0), ("ig_miedo", 1, 0), ("ig_llama", 2, 0), ("ig_compra2", 3, 0), ("ig_13", 4, 0), ("ig_millonarios", 5, 0), ("ig_ganga", 6, 0)]),
    ("9. Copiar a los rivales", [
        "Dentro de Facebook, Instagram siguió creciendo. Y, cuando apareció un rival, no dudó en copiarlo.",
        "En dos mil dieciséis lanzó las historias: fotos y vídeos que desaparecen a las veinticuatro horas. La idea era de Snapchat, y Systrom reconoció abiertamente que se habían inspirado en ella.",
        "Las historias de Instagram acabaron teniendo más usuarios que todo Snapchat.",
        "Años después, frente al éxito de TikTok, llegaron los reels: vídeos cortos, verticales, con música.",
        "Instagram dejó de ser solo una aplicación de fotos.",
    ], [("cap9", 0, -0.6), ("ig_rival", 0, 1.0), ("ig_historias", 1, 0), ("ig_snapchat", 2, 0), ("ig_reels", 3, 0), ("ig_nosolo", 4, 0)]),
    ("10. Todo instagrameable", [
        "Instagram no solo cambió cómo hacemos fotos. Cambió el mundo que fotografiamos.",
        "Los restaurantes empezaron a cuidar cómo quedaban sus platos en el móvil. Las cafeterías pintaron paredes con alas de ángel y frases para hacerse fotos delante.",
        "Abrieron museos pensados solo para hacerse fotos, con piscinas de bolas y habitaciones de colores.",
        "Hasta la lengua cambió: la palabra instagrameable se usa ya para decir que algo queda bien en una foto para redes.",
        "Y nació toda una profesión: los influencers, personas que viven de lo que publican y de las marcas que les pagan por enseñar sus productos.",
        "En dos mil diecinueve, Instagram empezó incluso a probar a esconder el número de me gusta, para rebajar la presión por la popularidad.",
    ], [("cap10", 0, -0.6), ("ig_mundo", 0, 1.0), ("ig_restaurantes", 1, 0), ("ig_museos", 2, 0), ("ig_palabra", 3, 0), ("ig_influencers", 4, 0), ("ig_likes", 5, 0)]),
    ("11. Los fundadores se van", [
        "En dos mil dieciocho, Instagram superó los mil millones de usuarios.",
        "Y ese mismo año, en septiembre, Systrom y Krieger anunciaron que se marchaban.",
        "Según contaron varios medios, las tensiones con la dirección de Facebook sobre la independencia de Instagram habían ido creciendo.",
        "Años más tarde, los dos volvieron a trabajar juntos en una nueva aplicación de noticias. Pero no tuvo el mismo éxito y acabaron cerrándola.",
        "Les había costado un mundo encontrar una idea como Instagram. Repetirla era todavía más difícil.",
    ], [("cap11", 0, -0.6), ("ig_milmillones", 0, 1.0), ("ig_marcha", 1, 0), ("ig_tensiones", 2, 0), ("ig_artifact", 3, 0), ("ig_repetir", 4, 0)]),
    ("12. La cara oculta", [
        "Pero el éxito también trajo críticas.",
        "Las fotos perfectas, los cuerpos retocados y la carrera por los me gusta empezaron a preocupar a psicólogos y padres.",
        "En dos mil veintiuno, unos documentos internos filtrados a la prensa revelaron que la propia empresa había estudiado cómo Instagram podía afectar a la autoestima de algunas adolescentes.",
        "La compañía defendió que sus estudios mostraban también efectos positivos, y ha ido añadiendo herramientas de control para familias y menores.",
        "Aquella app de fotos con filtros bonitos se había convertido en algo mucho más grande… y mucho más complicado.",
    ], [("cap12", 0, -0.6), ("ig_criticas", 0, 1.0), ("ig_perfectas", 1, 0), ("ig_documentos", 2, 0), ("ig_defensa", 3, 0), ("ig_complicado", 4, 0)]),
    ("13. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: a veces lo mejor que puedes hacer es quitar. Burbn lo tenía todo y nadie lo entendía. Instagram solo hacía una cosa, y la hacía muy bien.",
        "Dos: mira cómo usa la gente tu producto, no cómo crees que lo usa. Los fundadores vieron que solo usaban las fotos.",
        "Y tres: la imperfección también puede ser bonita. Los filtros de Instagram nacieron de una cámara de plástico barata.",
    ], [("cap13", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Una cámara de plástico, un no a Zuckerberg, una app con nombre de whisky, una pregunta en una playa de México y trece empleados.",
        "La próxima vez que pongas un filtro a una foto, ya sabes de dónde viene.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Cuál fue la primera foto que subiste a Instagram? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("ig_final", 0, 0), ("ig_filtro", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Wikipedia, «Instagram»", "https://en.wikipedia.org/wiki/Instagram"),
    ("Britannica, «Instagram»", "https://www.britannica.com/money/Instagram"),
    ("The Next Web, «Instagram: a brief history» (2013)", "https://thenextweb.com/news/instagram-a-brief-history"),
    ("FourWeekMBA, «History of Instagram»", "https://fourweekmba.com/history-of-instagram"),
    ("Marketing Directo, «Historia de Instagram»", "https://www.marketingdirecto.com/imprescindibles/social-media/historia-de-instagram"),
    ("Sarah Frier, «No Filter: The Inside Story of Instagram» (2020)", ""),
    ("The Wall Street Journal, «The Facebook Files» (2021)", ""),
]
DESCRIPCION = ("Instagram empezó como Burbn, una app con nombre de whisky que casi nadie entendía. Kevin Systrom y Mike Krieger la redujeron a lo único que la "
               "gente usaba: las fotos. Los filtros nacieron, según Systrom, de una cámara Holga y de una pregunta de su novia. Salió el 6 de octubre de 2010 "
               "y en abril de 2012 Facebook la compró por mil millones de dólares, con 13 empleados. Esta es la historia de Instagram.")
ETIQUETAS = "instagram, historia de instagram, kevin systrom, mike krieger, burbn, facebook, mark zuckerberg, filtros, stories, reels, historia de marcas, código de barras"
HASHTAGS = "#Instagram #RedesSociales #HistoriaDeMarcas"
LISTA = "Gigantes tecnológicos"
NOTA = "Nota: las anécdotas de la cámara Holga, la oferta de Zuckerberg y las vacaciones en México proceden de entrevistas a los fundadores y de la prensa."
PREGUNTA = "¿TU PRIMERA FOTO *EN INSTAGRAM*?"
