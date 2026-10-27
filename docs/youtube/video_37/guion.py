"""Guion del vídeo 37 de Código de Barras (formato largo): Atari."""
TITULO = "Atari: de inventar los videojuegos a enterrarlos en el desierto"
TITULOS_ALT = ["La historia de Atari (y de los cartuchos enterrados)", "Cómo Atari creó la industria del videojuego… y casi la destruye"]
MARCA = "Atari"
SEGMENTOS = [
    ("Introducción", [
        "Una máquina en un bar. Dos rayas blancas, una pelota cuadrada, y una sola instrucción: evita fallar la bola para conseguir una puntuación alta.",
        "Así empezó una de las industrias más grandes del mundo: la de los videojuegos.",
        "La empresa que la puso en marcha tomó su nombre de un juego de mesa japonés milenario.",
        "Por sus oficinas pasó un joven Steve Jobs, antes de fundar Apple.",
        "Y pocos años después, esa misma empresa acabó enterrando cientos de miles de cartuchos en un vertedero del desierto.",
        "Esta es la historia de Atari.",
    ], [("at_bar", 0, 0), ("at_industria", 1, 0), ("at_go", 2, 0), ("at_jobs", 3, 0), ("at_desierto", 4, 0), ("at_historia", 5, 0)]),
    ("1. Un ingeniero de feria", [
        "Nolan Bushnell creció en Utah, en Estados Unidos, y de estudiante trabajó en un parque de atracciones, en los puestos de juegos de feria.",
        "Allí aprendió algo que nunca olvidó: la gente paga con gusto por divertirse un rato.",
        "En la universidad descubrió otra cosa: los ordenadores. Unas máquinas enormes en las que algunos estudiantes jugaban a un juego de naves espaciales.",
        "Bushnell pensó que, si conseguía meter ese juego en una máquina que funcionara con monedas, podía hacerse rico.",
    ], [("cap1", 0, -0.6), ("at_bushnell", 0, 1.0), ("at_pagar", 1, 0), ("at_ordenadores", 2, 0), ("at_monedas", 3, 0)]),
    ("2. Un primer fracaso", [
        "Junto a su compañero Ted Dabney, construyó una máquina recreativa de naves espaciales: Computer Space.",
        "Tenía un mueble futurista, con curvas, y un aspecto espectacular.",
        "Pero tenía un problema: era demasiado complicada. Las instrucciones eran largas, los controles confusos, y en los bares la gente no entendía cómo jugar.",
        "Se vendieron algunas unidades, pero no fue el éxito que esperaban.",
        "Bushnell sacó una lección que marcaría su carrera: un buen juego tiene que ser fácil de aprender y difícil de dominar.",
    ], [("cap2", 0, -0.6), ("at_dabney", 0, 1.0), ("at_mueble", 1, 0), ("at_complicada", 2, 0), ("at_algunas", 3, 0), ("at_leccion", 4, 0)]),
    ("3. Un nombre de juego de mesa", [
        "En mil novecientos setenta y dos, Bushnell y Dabney decidieron fundar su propia empresa.",
        "Su primera idea de nombre era Syzygy, una palabra de astronomía. Pero ya la usaba otra empresa.",
        "Bushnell era aficionado al go, un juego de mesa estratégico de origen chino, muy popular en Japón.",
        "Apuntó varias palabras del juego. Y eligió una: atari.",
        "En el go, se dice atari cuando una piedra o un grupo de piedras está a punto de ser capturado por el rival. Algo así como un jaque.",
        "El veintisiete de junio de mil novecientos setenta y dos, Atari quedó registrada en California.",
    ], [("cap3", 0, -0.6), ("at_fundar", 0, 1.0), ("at_syzygy", 1, 0), ("at_go2", 2, 0), ("at_palabras", 3, 0), ("at_jaque", 4, 0), ("at_1972", 5, 0)]),
    ("4. Un ejercicio de prácticas", [
        "Atari contrató a un joven ingeniero, Al Alcorn.",
        "Según contó después Bushnell, para que practicara le encargó un juego muy sencillo: una especie de tenis de mesa en una pantalla.",
        "Dos palas, una pelota, un marcador. Nada más.",
        "Alcorn lo hizo tan bien, y añadió tantos detalles, como que la pelota cambiara de ángulo según dónde golpeara la pala, que el resultado era muy divertido.",
        "Lo llamaron Pong, por el sonido de la pelota al rebotar.",
    ], [("cap4", 0, -0.6), ("at_alcorn", 0, 1.0), ("at_practica", 1, 0), ("at_palas", 2, 0), ("at_angulo", 3, 0), ("at_pong", 4, 0)]),
    ("5. Atascada de monedas", [
        "Para probarlo, colocaron un prototipo en un bar de Sunnyvale, en California, llamado Andy Capp's.",
        "Pocos días después, el dueño del bar llamó a Alcorn: la máquina se había estropeado.",
        "Alcorn fue a repararla. Y al abrirla descubrió el problema.",
        "El cajón de las monedas estaba tan lleno que se había desbordado. La gente seguía intentando meter monedas, y el mecanismo se había atascado.",
        "Era la mejor avería posible. Atari empezó a fabricar máquinas de Pong a toda velocidad, y en poco tiempo había miles en bares de todo el país.",
    ], [("cap5", 0, -0.6), ("at_andycapp", 0, 1.0), ("at_llamada", 1, 0), ("at_repara", 2, 0), ("at_monedas2", 3, 0), ("at_miles", 4, 0)]),
    ("6. Copiado y demandado", [
        "El éxito de Pong atrajo a decenas de imitadores. Muchas empresas sacaron sus propias versiones.",
        "Pero Atari también tenía un problema: Pong se parecía mucho a un juego de tenis que ya existía.",
        "Lo incluía la Magnavox Odyssey, considerada la primera consola de videojuegos doméstica, que había salido a la venta ese mismo año.",
        "Según los documentos del caso, Bushnell había probado esa consola en una demostración antes de crear Pong.",
        "Magnavox demandó. Y Atari acabó pagando una licencia de setecientos mil dólares para cerrar el caso.",
    ], [("cap6", 0, -0.6), ("at_imitadores", 0, 1.0), ("at_parecido", 1, 0), ("at_odyssey", 2, 0), ("at_demo", 3, 0), ("at_licencia", 4, 0)]),
    ("7. El empleado número cuarenta", [
        "En mil novecientos setenta y cuatro, un joven de diecinueve años, con el pelo largo y sin estudios terminados, se presentó en Atari pidiendo trabajo.",
        "Se llamaba Steve Jobs. Y, según se cuenta, dijo que no se iría hasta que lo contrataran.",
        "Lo contrataron. Era brillante, pero difícil. Según varias biografías, lo pusieron a trabajar de noche, para que no chocara con sus compañeros.",
        "En mil novecientos setenta y seis, Atari le encargó diseñar un juego nuevo con el menor número de chips posible: Breakout, el de romper ladrillos con una pelota.",
        "Jobs se lo pasó a su amigo Steve Wozniak, que lo diseñó en cuatro noches sin dormir.",
        "Según contó después Wozniak, Jobs le dijo que les pagaban setecientos dólares y le dio la mitad. Años más tarde descubrió que Atari había pagado a Jobs una prima de varios miles.",
    ], [("cap7", 0, -0.6), ("at_1974", 0, 1.0), ("at_steve", 1, 0), ("at_noche", 2, 0), ("at_breakout", 3, 0), ("at_woz", 4, 0), ("at_prima", 5, 0)]),
    ("8. La consola en casa", [
        "Bushnell quería llevar los videojuegos del bar al salón.",
        "Primero lanzó una versión de Pong para conectar a la televisión de casa. Y después, algo mucho más ambicioso: una consola en la que se pudieran cambiar los juegos con cartuchos.",
        "Para financiarla, en mil novecientos setenta y seis vendió Atari al grupo de comunicación Warner, por unos veintiocho millones de dólares.",
        "En mil novecientos setenta y siete salió la consola que acabaría conociéndose como Atari dos mil seiscientos.",
        "Al principio se vendió con dificultad. Pero en mil novecientos ochenta llegó una versión doméstica de Space Invaders, el gran éxito de los salones recreativos. Y las ventas se dispararon.",
        "Atari se convirtió en una de las empresas que más rápido crecían de Estados Unidos.",
    ], [("cap8", 0, -0.6), ("at_salon", 0, 1.0), ("at_cartuchos", 1, 0), ("at_warner", 2, 0), ("at_2600", 3, 0), ("at_invaders", 4, 0), ("at_crece", 5, 0)]),
    ("9. Demasiado, demasiado rápido", [
        "Pero dentro de la empresa las cosas iban mal.",
        "Bushnell chocó con los nuevos dueños y en mil novecientos setenta y ocho salió de Atari. Después fundaría, entre otras cosas, una cadena de pizzerías con juegos para niños.",
        "Muchos de los mejores programadores también se marcharon, molestos porque no aparecían sus nombres en los juegos y no cobraban por sus éxitos. Algunos fundaron empresas rivales.",
        "El mercado se llenó de consolas y de juegos, muchos de ellos malos, hechos deprisa.",
        "Y Atari empezó a fabricar más cartuchos de los que podía vender.",
    ], [("cap9", 0, -0.6), ("at_mal", 0, 1.0), ("at_sale", 1, 0), ("at_programadores", 2, 0), ("at_saturado", 3, 0), ("at_sobra", 4, 0)]),
    ("10. El peor juego", [
        "En mil novecientos ochenta y dos, la película E.T., el extraterrestre, fue un éxito mundial.",
        "Atari pagó una fortuna por los derechos para hacer el videojuego. Y quería tenerlo en las tiendas para Navidad.",
        "El programador tuvo, según se cuenta, unas cinco semanas para hacerlo. Un juego normal llevaba varios meses.",
        "El resultado fue un juego confuso, en el que el protagonista se caía una y otra vez en agujeros.",
        "Atari fabricó millones de cartuchos. Muchísimos se quedaron sin vender, y muchos de los que se vendieron fueron devueltos.",
        "Con los años, E.T. ha aparecido una y otra vez en las listas de los peores videojuegos de la historia.",
    ], [("cap10", 0, -0.6), ("at_et", 0, 1.0), ("at_derechos", 1, 0), ("at_semanas", 2, 0), ("at_agujeros", 3, 0), ("at_devueltos", 4, 0), ("at_peor", 5, 0)]),
    ("11. Enterrados en el desierto", [
        "En mil novecientos ochenta y tres, la industria del videojuego en Estados Unidos se hundió. Las ventas se desplomaron y muchas empresas quebraron.",
        "Y en septiembre de ese año, Atari envió más de una decena de camiones cargados de cartuchos y consolas sin vender a un vertedero de Alamogordo, en el desierto de Nuevo México.",
        "Los aplastaron y los cubrieron con cemento.",
        "Durante treinta años se convirtió en una leyenda urbana: se decía que allí había millones de cartuchos de E.T. enterrados.",
        "En dos mil catorce, un equipo excavó el vertedero. Y los encontró. Antiguos directivos de Atari confirmaron que se habían enterrado unos setecientos mil cartuchos, de muchos juegos distintos.",
        "Algunos de aquellos cartuchos desenterrados se subastaron después. Y hoy uno está expuesto en un museo.",
        "La marca Atari, mientras tanto, pasó por las manos de muchos dueños distintos. Hoy sigue existiendo, y vende versiones modernas de sus consolas y juegos clásicos para los nostálgicos.",
    ], [("cap11", 0, -0.6), ("at_crash", 0, 1.0), ("at_camiones", 1, 0), ("at_cemento", 2, 0), ("at_leyenda", 3, 0), ("at_2014", 4, 0), ("at_subasta", 5, 0), ("at_hoy", 6, 0)]),
    ("12. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: lo sencillo engancha. Computer Space era demasiado complicado. Pong solo tenía dos palas y una pelota.",
        "Dos: cuida a quien crea tus productos. Atari perdió a muchos de sus mejores programadores, y con ellos, sus mejores juegos.",
        "Y tres: las prisas se pagan. Un juego hecho en cinco semanas acabó enterrado en el desierto.",
    ], [("cap12", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un juego de mesa japonés, una máquina atascada de monedas, un joven Steve Jobs, una consola en el salón y un vertedero en el desierto.",
        "La próxima vez que cojas un mando, acuérdate de dónde empezó todo.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Cuál fue tu primera consola? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("at_final", 0, 0), ("at_mando", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Computer History Museum, «Atari's roller-coaster ride»", "https://www.computerhistory.org/revolution/computer-games/16/185"),
    ("Wikipedia, «Atari, Inc.»", "https://en.wikipedia.org/wiki/Atari,_Inc."),
    ("Wikipedia, «Atari video game burial»", "https://en.wikipedia.org/wiki/Atari_video_game_burial"),
    ("Time Extension, «40 years ago today Atari dumped millions of unsold games in the New Mexico desert» (2023)", "https://timeextension.com/news/2023/09/40-years-ago-today-atari-dumped-millions-of-unsold-games-in-the-new-mexico-desert"),
    ("Museo Nacional Suizo, «The worst video game of all time» (2020)", "https://blog.nationalmuseum.ch/en/2020/04/the-worst-video-game-of-all-time/"),
    ("Steve Wozniak, «iWoz» (2006)", ""),
    ("Walter Isaacson, «Steve Jobs» (2011)", ""),
]
DESCRIPCION = ("Atari nació en 1972 de la mano de Nolan Bushnell y Ted Dabney, con un nombre sacado del juego de mesa go. Su Pong atascó de monedas la máquina "
               "de prueba de un bar, por allí pasó un joven Steve Jobs y su consola llevó los videojuegos a casa. Hasta que llegaron E.T. y la crisis de 1983, "
               "y Atari enterró sus cartuchos en el desierto. Esta es la historia de Atari.")
ETIQUETAS = "atari, historia de atari, pong, nolan bushnell, atari 2600, steve jobs atari, breakout, et videojuego, cartuchos enterrados, alamogordo, crisis del videojuego 1983, historia de marcas, código de barras"
HASHTAGS = "#Atari #Videojuegos #HistoriaDeMarcas"
LISTA = "Gigantes tecnológicos"
NOTA = "Nota: el reparto del dinero de Breakout lo contó Steve Wozniak; la cifra de cartuchos enterrados es la que confirmaron antiguos directivos de Atari en 2014."
PREGUNTA = "¿TU PRIMERA *CONSOLA*?"
