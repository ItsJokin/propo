"""Guion del vídeo 14 de Código de Barras: Cola Cao. No se reproduce la letra de la canción publicitaria."""
TITULO = "Cola Cao: cómo dos cuñados de Barcelona conquistaron el desayuno"
TITULOS_ALT = ["La historia de Cola Cao", "Cola Cao: la marca de los grumos más famosos de España"]
MARCA = "Cola_Cao"
SEGMENTOS = [
    ("Introducción", [
        "Una taza de leche, dos cucharadas y a remover. Y, si no remueves bien, grumos.",
        "Cola Cao es parte del desayuno de millones de personas en España desde hace generaciones.",
        "Pero detrás de ese bote hay una historia de posguerra, de dos cuñados de Barcelona, de los Juegos Olímpicos…",
        "Y de una canción publicitaria que hoy nadie se atrevería a emitir.",
    ], [("c_taza", 0, 0), ("c_generaciones", 1, 0), ("c_historia", 2, 0), ("c_cancion", 3, 0)]),
    ("1. Dos cuñados", [
        "Barcelona, barrio de Gràcia, años cuarenta.",
        "Dos cuñados, José María Ventura y José Ignacio Ferrero, tienen una empresa de alimentación: Nutrexpa.",
        "En mil novecientos cuarenta y cinco registran una marca nueva: Cola Cao.",
        "Y en mil novecientos cuarenta y seis sale a la venta: un cacao soluble para mezclar con leche.",
        "Era la España de la posguerra, con escasez y cartillas de racionamiento.",
        "Y un producto nutritivo, dulce y para los niños tenía un público enorme.",
    ], [("cap1", 0, -0.6), ("c_gracia", 0, 1.0), ("c_cunados", 1, 0), ("c_1945", 2, 0), ("c_1946", 3, 0), ("c_posguerra", 4, 0), ("c_publico", 5, 0)]),
    ("2. La canción", [
        "El gran salto llegó con la publicidad.",
        "En los años cincuenta, Cola Cao lanza una canción en la radio que se hizo famosísima.",
        "Generaciones enteras de españoles se la sabían de memoria.",
        "Pero su letra presentaba a un personaje africano con estereotipos raciales que hoy se consideran ofensivos.",
        "Con el paso del tiempo, la marca dejó de utilizarla.",
        "Es un buen ejemplo de cómo la publicidad refleja su época… y de cómo cambia la mirada de la sociedad.",
    ], [("cap2", 0, -0.6), ("c_salto", 0, 1.0), ("c_radio", 1, 0), ("c_memoria", 2, 0), ("c_estereotipo", 3, 0), ("c_deja", 4, 0), ("c_mirada", 5, 0)]),
    ("3. El alimento de los olímpicos", [
        "La otra gran jugada de Cola Cao fue el deporte.",
        "En mil novecientos setenta y dos, la marca patrocinó al equipo olímpico español en los Juegos de Múnich.",
        "Y empezó a presentarse como el alimento de los olímpicos.",
        "En mil novecientos ochenta y ocho, con la vista puesta en los Juegos de Barcelona noventa y dos, empezó a apoyar a los deportistas a través del programa ADO.",
        "El mensaje era claro: si los campeones lo toman, tus hijos también deberían.",
    ], [("cap3", 0, -0.6), ("c_deporte", 0, 1.0), ("c_munich", 1, 0), ("c_olimpicos", 2, 0), ("c_ado", 3, 0), ("c_campeones", 4, 0)]),
    ("4. La guerra del desayuno", [
        "Cola Cao no está sola en la despensa.",
        "Durante décadas ha competido con otros cacaos solubles en una de las rivalidades más famosas de los supermercados españoles.",
        "Y en esa guerra hay un debate que no se ha resuelto nunca: ¿grumos sí o grumos no?",
        "Hay quien los odia. Y hay quien remueve poco a propósito, para encontrárselos.",
        "Mientras tanto, Nutrexpa siguió creciendo, comprando otras marcas como Nocilla.",
        "Hoy Cola Cao pertenece a Idilia Foods, la empresa heredera de Nutrexpa.",
    ], [("cap4", 0, -0.6), ("c_despensa", 0, 1.0), ("c_rivalidad", 1, 0), ("c_grumos", 2, 0), ("c_odia", 3, 0), ("c_nocilla", 4, 0), ("c_idilia", 5, 0)]),
    ("5. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: un producto sencillo, en el momento adecuado, puede convertirse en un hábito para generaciones.",
        "Dos: asociar tu marca a algo que la gente admira, como el deporte, vale más que cualquier eslogan.",
        "Y tres: lo que una época considera normal, otra puede verlo como inaceptable. Las marcas que duran saben cambiar.",
    ], [("cap5", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un bote de cacao, dos cuñados de Gràcia y casi ochenta años de desayunos.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Tú eres de grumos o de removerlo bien? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("c_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("Wikipedia, «Cola Cao»", "https://en.wikipedia.org/wiki/Cola_Cao"),
    ("Wikipedia, «Cola Cao song»", "https://en.wikipedia.org/wiki/Cola_Cao_song"),
    ("Wikipedia, «Idilia Foods»", "https://en.wikipedia.org/wiki/Idilia_Foods"),
    ("El Español, «ColaCao, el imperio del cacao que crearon dos cuñados»", "https://elespanol.com/invertia/empresas/20191124/colacao-imperio-cacao-crearon-cunados-pequeno-barcelona/446456347_0.amp.html"),
    ("Ara, «Así consiguieron dos cuñados de Gràcia hacerse de oro vendiendo Cola Cao»", "https://es.ara.cat/economia/empresas/consiguieron-cunados-gracia-hacerse-oro-vendiendo-cola-cao_1_4818994.html"),
    ("Marketing Directo, historia de la marca ColaCao", "https://www.marketingdirecto.com/imprescindibles/historia-marcas/colacao-grumitos-historia-marca"),
]
DESCRIPCION = ("Cola Cao nació en el barrio de Gràcia (Barcelona): dos cuñados, José María Ventura y José Ignacio Ferrero, registraron la marca en 1945 "
               "y la lanzaron en 1946. Una canción de radio que hoy sería impensable, los Juegos Olímpicos y la eterna guerra de los grumos. "
               "Esta es la historia del desayuno de España.")
ETIQUETAS = "cola cao, colacao, historia de cola cao, nutrexpa, idilia foods, cacao soluble, grumos, marcas españolas, historia de marcas, código de barras"
HASHTAGS = "#ColaCao #HechoEnEspaña #HistoriaDeMarcas"
LISTA = "Hecho en España"
NOTA = "Nota: las fuentes sitúan el registro de la marca en 1945 y su salida a la venta en 1946."
PREGUNTA = "¿GRUMOS SÍ O *GRUMOS NO*?"
