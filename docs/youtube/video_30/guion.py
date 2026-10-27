"""Guion del vídeo 30 de Código de Barras (formato largo): Google."""
TITULO = "Google: la empresa que nadie quiso comprar por 750.000 dólares"
TITULOS_ALT = ["La historia de Google (y por qué se llama así)", "Cómo dos estudiantes crearon Google en un garaje"]
MARCA = "Google"
SEGMENTOS = [
    ("Introducción", [
        "Cada día, miles de millones de veces, alguien escribe algo en una caja blanca y pulsa intro.",
        "Hoy buscar en Google es tan normal que se ha convertido en un verbo: googlear.",
        "Pero hubo un momento en que sus creadores quisieron venderla. Pidieron menos de un millón de dólares. Y les dijeron que no.",
        "Su nombre salió de un número gigantesco… y, según se cuenta, de una errata.",
        "Y su primer inversor firmó un cheque a nombre de una empresa que todavía no existía.",
        "Esta es la historia de Google.",
    ], [("go_caja", 0, 0), ("go_verbo", 1, 0), ("go_venta", 2, 0), ("go_numero", 3, 0), ("go_cheque", 4, 0), ("go_historia", 5, 0)]),
    ("1. Dos que no se entendían", [
        "Universidad de Stanford, California, mil novecientos noventa y cinco.",
        "Sergey Brin, un estudiante de doctorado nacido en Moscú, hacía de guía para los alumnos nuevos que visitaban el campus.",
        "Uno de esos alumnos era Larry Page, hijo de dos profesores de informática de Míchigan.",
        "Según se cuenta, aquel primer día discutieron sobre casi todo. No se cayeron especialmente bien.",
        "Pero acabaron trabajando juntos. Y de aquella pareja tan poco prometedora salió una de las empresas más grandes de la historia.",
    ], [("cap1", 0, -0.6), ("go_stanford", 0, 1.0), ("go_brin", 1, 0), ("go_page", 2, 0), ("go_discuten", 3, 0), ("go_juntos", 4, 0)]),
    ("2. Enlaces que votan", [
        "A mediados de los noventa, internet crecía sin control, y encontrar algo útil era un pequeño infierno.",
        "Los buscadores de entonces se fijaban sobre todo en cuántas veces aparecía una palabra en una página.",
        "Así que bastaba con repetir una palabra cien veces para colarse arriba en los resultados.",
        "Larry Page tuvo otra idea, inspirada en el mundo académico: un artículo científico es importante si muchos otros artículos lo citan.",
        "¿Y si con las páginas web pasara lo mismo? Cada enlace que recibe una página sería como un voto.",
        "Y no todos los votos valdrían igual: un enlace desde una página importante contaría más que uno desde una página que nadie visita.",
        "A ese sistema de puntuación lo llamaron PageRank. Un juego de palabras: es la clasificación de páginas… y también el apellido de Larry.",
    ], [("cap2", 0, -0.6), ("go_caos", 0, 1.0), ("go_contar", 1, 0), ("go_trampa", 2, 0), ("go_citas", 3, 0), ("go_votos", 4, 0), ("go_peso", 5, 0), ("go_pagerank", 6, 0)]),
    ("3. BackRub", [
        "Su primer buscador no se llamaba Google. Se llamaba BackRub, que en inglés significa masaje en la espalda.",
        "El nombre venía de los enlaces de vuelta, los que apuntan hacia una página.",
        "Funcionaba en los ordenadores de la universidad, y llegó a consumir tanta conexión que, según se cuenta, a veces dejaba sin internet a parte del campus.",
        "No tenían dinero para equipos, así que reunían piezas como podían.",
        "Una de sus primeras cajas de discos duros estaba construida con piezas de Lego. Hoy se conserva como una pequeña reliquia.",
    ], [("cap3", 0, -0.6), ("go_backrub", 0, 1.0), ("go_enlaces", 1, 0), ("go_campus", 2, 0), ("go_piezas", 3, 0), ("go_lego", 4, 0)]),
    ("4. Un número con cien ceros", [
        "BackRub necesitaba un nombre mejor.",
        "Según el relato de un compañero de Stanford, en una sesión de ideas alguien propuso googolplex, y Larry lo acortó: googol.",
        "Un googol es un número: un uno seguido de cien ceros. Una forma de decir que querían organizar una cantidad inmensa de información.",
        "Al comprobar si el dominio estaba libre, según ese mismo relato, lo escribieron mal: no googol, sino google, con dos oes y una e al final.",
        "Ese estaba libre. A Larry le gustó, y el quince de septiembre de mil novecientos noventa y siete se registró google punto com.",
        "Así que, si la historia es cierta, la marca más famosa de internet nació de una errata.",
    ], [("cap4", 0, -0.6), ("go_nombre", 0, 1.0), ("go_googolplex", 1, 0), ("go_googol", 2, 0), ("go_errata", 3, 0), ("go_dominio", 4, 0), ("go_errata2", 5, 0)]),
    ("5. Nadie la quiso", [
        "Aquí llega el giro que pocos conocen.",
        "Brin y Page no querían montar una empresa. Querían terminar sus doctorados.",
        "Así que intentaron vender su buscador. Y se lo ofrecieron, entre otros, a Excite, uno de los grandes portales de la época.",
        "Según se cuenta, pidieron un millón de dólares. El consejero delegado de Excite, George Bell, dijo que no.",
        "Uno de los inversores de Excite consiguió rebajar el precio a setecientos cincuenta mil dólares. Y Bell volvió a decir que no.",
        "Hoy la empresa que nació de aquel buscador vale cientos de miles de millones de dólares. Excite casi ha desaparecido.",
    ], [("cap5", 0, -0.6), ("go_giro", 0, 1.0), ("go_doctorado", 1, 0), ("go_excite", 2, 0), ("go_millon", 3, 0), ("go_750", 4, 0), ("go_hoy", 5, 0)]),
    ("6. Un cheque para nadie", [
        "Como nadie la compraba, decidieron seguir adelante solos.",
        "En agosto de mil novecientos noventa y ocho, le enseñaron su buscador a Andy Bechtolsheim, cofundador de Sun Microsystems.",
        "Según se cuenta, le bastó una demostración rápida. Sacó el talonario y firmó un cheque de cien mil dólares a nombre de Google Inc.",
        "El problema era que Google Inc. no existía. No había empresa, ni cuenta bancaria donde ingresarlo.",
        "Así que el cheque se quedó guardado unas semanas, hasta que el cuatro de septiembre de mil novecientos noventa y ocho registraron oficialmente la empresa.",
        "Con ese dinero y el de otros inversores, dejaron la universidad y se buscaron una oficina.",
    ], [("cap6", 0, -0.6), ("go_solos", 0, 1.0), ("go_bechtolsheim", 1, 0), ("go_talonario", 2, 0), ("go_noexiste", 3, 0), ("go_1998", 4, 0), ("go_oficina", 5, 0)]),
    ("7. El garaje", [
        "La oficina fue un garaje en Menlo Park, en California.",
        "Era de una amiga, Susan Wojcicki, que se lo alquiló, según se cuenta, por unos mil setecientos dólares al mes.",
        "Allí pusieron los ordenadores, unas mesas y poco más. Y contrataron a su primer empleado.",
        "Susan Wojcicki acabaría trabajando en Google. Años después llegaría a dirigir YouTube.",
        "A principios de mil novecientos noventa y nueve ya no cabían, y se mudaron a una oficina en Palo Alto.",
    ], [("cap7", 0, -0.6), ("go_garaje", 0, 1.0), ("go_wojcicki", 1, 0), ("go_empleado", 2, 0), ("go_susan_yt", 3, 0), ("go_paloalto", 4, 0)]),
    ("8. Una página casi vacía", [
        "Mientras los demás portales llenaban su portada de noticias, horóscopos, el tiempo y anuncios, Google hizo lo contrario.",
        "Su página era casi blanca: el logotipo, una caja para escribir y dos botones.",
        "Según se cuenta, parte de esa sencillez venía de que ninguno de los dos sabía mucho de diseño web.",
        "Pero funcionó. La página cargaba rápido y los resultados eran mejores. Y la gente empezó a recomendarla de boca en boca.",
        "En el verano de mil novecientos noventa y ocho apareció además el primer doodle: un dibujo en el logotipo para avisar de que se habían ido al festival Burning Man, en el desierto de Nevada.",
        "Si algo fallaba, ese era el aviso de que no había nadie en la oficina.",
    ], [("cap8", 0, -0.6), ("go_portales", 0, 1.0), ("go_blanca", 1, 0), ("go_diseno", 2, 0), ("go_boca", 3, 0), ("go_doodle", 4, 0), ("go_nadie", 5, 0)]),
    ("9. ¿Y cómo se gana dinero?", [
        "Google tenía millones de usuarios. Pero no ganaba dinero.",
        "Brin y Page desconfiaban de la publicidad. Pensaban que podía estropear la calidad de los resultados.",
        "La solución llegó en el año dos mil: anuncios de texto, pequeños, separados de los resultados y relacionados con lo que estabas buscando.",
        "Si buscabas zapatillas de correr, veías anuncios de zapatillas de correr. No pancartas parpadeando.",
        "Más tarde, los anunciantes empezaron a pujar por cada palabra, y a pagar solo cuando alguien hacía clic.",
        "Aquel sistema se convirtió en una de las máquinas de hacer dinero más eficaces de la historia. Todavía hoy, la publicidad es la mayor fuente de ingresos de la empresa.",
    ], [("cap9", 0, -0.6), ("go_sindinero", 0, 1.0), ("go_desconfian", 1, 0), ("go_texto", 2, 0), ("go_zapatillas", 3, 0), ("go_puja", 4, 0), ("go_maquina", 5, 0)]),
    ("10. ¿Una broma?", [
        "El uno de abril de dos mil cuatro, el día de las bromas en Estados Unidos, Google anunció un servicio de correo gratuito: Gmail.",
        "Ofrecía un gigabyte de espacio. Los correos de la competencia daban unos pocos megas, cientos de veces menos.",
        "Mucha gente pensó que era una broma del uno de abril. No lo era.",
        "Al principio solo se podía entrar con invitación, y las invitaciones se llegaron a vender por internet.",
        "Ese mismo año, en agosto, Google salió a bolsa a ochenta y cinco dólares por acción, con un sistema de subasta muy poco habitual.",
        "Aquel día, la empresa que nadie quiso por setecientos cincuenta mil dólares pasó a valer más de veinte mil millones.",
    ], [("cap10", 0, -0.6), ("go_gmail", 0, 1.0), ("go_giga", 1, 0), ("go_broma", 2, 0), ("go_invitacion", 3, 0), ("go_bolsa", 4, 0), ("go_valor", 5, 0)]),
    ("11. Comprar el futuro", [
        "Con el dinero de la bolsa, Google empezó a comprar.",
        "En dos mil cinco compró una pequeña empresa que preparaba un sistema operativo para móviles. Se llamaba Android.",
        "Pasó casi desapercibido. Hoy Android está en la gran mayoría de los teléfonos del mundo.",
        "En dos mil seis compró YouTube, que tenía poco más de un año, por mil seiscientos cincuenta millones de dólares en acciones. Muchos pensaron que era una locura.",
        "Y en dos mil ocho lanzó su propio navegador, Chrome, que acabaría siendo el más usado.",
        "Mapas, traductor, fotos, documentos… Google ya no era solo un buscador.",
    ], [("cap11", 0, -0.6), ("go_compra", 0, 1.0), ("go_android", 1, 0), ("go_movil", 2, 0), ("go_youtube", 3, 0), ("go_chrome", 4, 0), ("go_servicios", 5, 0)]),
    ("12. Alphabet", [
        "En dos mil quince, la empresa se reorganizó por completo. Nació Alphabet, una matriz que agrupa a Google y a otros proyectos.",
        "Sundar Pichai, un ingeniero nacido en la India, pasó a dirigir Google, y años después también Alphabet.",
        "Brin y Page se apartaron de la gestión del día a día, aunque siguen siendo grandes accionistas.",
        "Y la palabra google entró en los diccionarios de inglés como verbo: buscar algo en internet.",
        "Es el sueño de cualquier marca: que su nombre se convierta en la acción misma.",
    ], [("cap12", 0, -0.6), ("go_alphabet", 0, 1.0), ("go_pichai", 1, 0), ("go_apartan", 2, 0), ("go_diccionario", 3, 0), ("go_sueno", 4, 0)]),
    ("13. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: las grandes ideas a veces vienen de otro mundo. Google nació de copiar cómo se citan los artículos científicos.",
        "Dos: la sencillez vende. En una época de portadas abarrotadas, ganó una página casi vacía.",
        "Y tres: que alguien rechace tu idea no significa que no valga. Excite pudo comprar Google por setecientos cincuenta mil dólares… y dijo que no.",
    ], [("cap13", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Dos estudiantes que discutían, un buscador llamado masaje en la espalda, un número con cien ceros, un cheque sin destinatario y un garaje.",
        "La próxima vez que busques algo, ya sabes de dónde viene esa caja blanca.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Qué es lo más raro que has buscado en Google? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("go_final", 0, 0), ("go_caja2", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Google, «Nuestra historia» (web oficial)", "https://about.google/our-story/"),
    ("Stanford, David Koller, «Origin of the name Google»", "https://graphics.stanford.edu/~dk/google_name_origin.html"),
    ("Search Engine Land, «Commemorating 20 years of Google»", "https://searchengineland.com/?p=299801"),
    ("Brin y Page, «The Anatomy of a Large-Scale Hypertextual Web Search Engine» (1998)", "http://infolab.stanford.edu/~backrub/google.html"),
    ("IFR, «2004: Google's US$1.67bn auction IPO»", "https://www.ifre.com/ifr-reports/37204/2004-googles-us1.67bn-auction-ipo-listing-of-a-tech-colossus"),
    ("Wikipedia, «List of mergers and acquisitions by Alphabet»", "https://en.wikipedia.org/wiki/List_of_mergers_and_acquisitions_by_Alphabet"),
    ("Wikipedia, «History of Google»", "https://en.wikipedia.org/wiki/History_of_Google"),
]
DESCRIPCION = ("Google empezó como BackRub, un proyecto de dos estudiantes de Stanford, Larry Page y Sergey Brin. Intentaron venderlo a Excite y, según se cuenta, "
               "les dijeron que no incluso por 750.000 dólares. Su nombre viene de «googol», un uno seguido de cien ceros, y su primer inversor firmó un cheque "
               "a una empresa que aún no existía. Esta es la historia de Google.")
ETIQUETAS = "google, historia de google, larry page, sergey brin, backrub, pagerank, googol, excite, gmail, youtube, android, alphabet, historia de marcas, código de barras"
HASHTAGS = "#Google #HistoriaDeMarcas #Tecnología"
LISTA = "Gigantes tecnológicos"
NOTA = "Nota: la errata del dominio y la oferta a Excite proceden de relatos de quienes estuvieron allí; las cifras exactas varían según la fuente."
PREGUNTA = "¿LO MÁS RARO *QUE HAS BUSCADO*?"
