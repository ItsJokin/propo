"""Guion del vídeo 38 de Código de Barras (formato largo): Pokémon."""
TITULO = "Pokémon: el niño que coleccionaba insectos y creó la saga más rentable del mundo"
TITULOS_ALT = ["La historia de Pokémon (y del episodio que mandó a cientos de niños al hospital)", "Cómo Pokémon casi arruina a sus creadores"]
MARCA = "Pokemon"
SEGMENTOS = [
    ("Introducción", [
        "Un ratón amarillo con las mejillas rojas. Una bola mitad roja, mitad blanca. Y una frase: hazte con todos.",
        "Pokémon es, según muchas estimaciones, la franquicia de entretenimiento que más dinero ha generado de la historia. Más que Star Wars, más que Mickey Mouse.",
        "Pero nació de los recuerdos de un niño japonés que cazaba insectos en los charcos de su barrio.",
        "Su primer juego tardó seis años en hacerse y estuvo a punto de arruinar a la pequeña empresa que lo creó.",
        "Y uno de sus episodios de dibujos animados mandó a cientos de niños al hospital.",
        "Esta es la historia de Pokémon.",
    ], [("po_raton", 0, 0), ("po_rentable", 1, 0), ("po_insectos", 2, 0), ("po_seis", 3, 0), ("po_hospital", 4, 0), ("po_historia", 5, 0)]),
    ("1. El cazador de insectos", [
        "Satoshi Tajiri nació en mil novecientos sesenta y cinco en Machida, una ciudad de las afueras de Tokio.",
        "Entonces Machida todavía tenía campos, estanques y bosques. Y el pequeño Satoshi pasaba horas cazando insectos.",
        "Escarabajos, renacuajos, grillos. Los buscaba, los estudiaba, los coleccionaba y los intercambiaba con sus amigos.",
        "Sus compañeros lo llamaban, según se cuenta, el doctor bicho.",
        "Pero Tokio creció. Los campos se llenaron de edificios y de asfalto. Y los insectos desaparecieron.",
        "Tajiri nunca olvidó aquella sensación de descubrir criaturas y coleccionarlas.",
    ], [("cap1", 0, -0.6), ("po_machida", 0, 1.0), ("po_campos", 1, 0), ("po_coleccion", 2, 0), ("po_doctor", 3, 0), ("po_asfalto", 4, 0), ("po_sensacion", 5, 0)]),
    ("2. Una revista de videojuegos", [
        "De adolescente, Tajiri cambió los insectos por las máquinas recreativas. Le obsesionaban.",
        "Era tan mal estudiante que, según se cuenta, estuvo a punto de no terminar el instituto.",
        "En mil novecientos ochenta y dos fundó una revista hecha a mano sobre videojuegos, con trucos y análisis. La llamó Game Freak: algo así como el friki de los juegos.",
        "Un joven ilustrador, Ken Sugimori, empezó a dibujar para ella.",
        "Unos años después, Tajiri y Sugimori decidieron dejar de escribir sobre videojuegos… y empezar a hacerlos. La revista se convirtió en una empresa: Game Freak.",
    ], [("cap2", 0, -0.6), ("po_recreativas", 0, 1.0), ("po_estudiante", 1, 0), ("po_revista", 2, 0), ("po_sugimori", 3, 0), ("po_empresa", 4, 0)]),
    ("3. Un cable entre dos consolas", [
        "En mil novecientos ochenta y nueve, Nintendo lanzó la Game Boy, una consola portátil.",
        "Venía con un accesorio: un cable para conectar dos consolas y jugar entre dos personas.",
        "Casi todos los juegos lo usaban para competir. Pero Tajiri vio otra cosa.",
        "Imaginó pequeñas criaturas viajando por el cable de una consola a otra. Imaginó a los niños intercambiándolas, como él intercambiaba insectos con sus amigos.",
        "Un juego en el que hubiera que buscar, capturar, coleccionar e intercambiar monstruos. Monstruos de bolsillo.",
        "En japonés: Poketto Monsutā. Pocket Monsters.",
    ], [("cap3", 0, -0.6), ("po_gameboy", 0, 1.0), ("po_cable", 1, 0), ("po_competir", 2, 0), ("po_viajan", 3, 0), ("po_capturar", 4, 0), ("po_pocket", 5, 0)]),
    ("4. Al borde de la ruina", [
        "Tajiri presentó la idea a Nintendo. Y, aunque no la entendieron del todo, le dieron una oportunidad.",
        "Pero el proyecto se hizo eterno. Game Freak era una empresa pequeña, y tenía que hacer otros juegos para sobrevivir.",
        "Según se cuenta, el dinero se acabó varias veces. Varios empleados se marcharon. Y Tajiri dejó de cobrar su sueldo.",
        "Algunos días trabajaba veinticuatro horas seguidas y luego dormía doce.",
        "Shigeru Miyamoto, el creador de Mario, lo apoyó dentro de Nintendo. Y, según varias fuentes, le sugirió una idea clave: sacar el juego en dos versiones distintas, con criaturas diferentes en cada una.",
        "Así los jugadores tendrían que intercambiar entre ellos para conseguirlas todas.",
    ], [("cap4", 0, -0.6), ("po_nintendo", 0, 1.0), ("po_eterno", 1, 0), ("po_dinero", 2, 0), ("po_horas", 3, 0), ("po_miyamoto", 4, 0), ("po_intercambiar", 5, 0)]),
    ("5. Rojo y verde", [
        "El veintisiete de febrero de mil novecientos noventa y seis, después de seis años, salieron en Japón Pocket Monsters Rojo y Pocket Monsters Verde.",
        "No fue un lanzamiento espectacular. La Game Boy ya tenía siete años, y muchos la daban por acabada.",
        "Pero el juego se fue extendiendo de boca en boca entre los niños. En los patios de los colegios, todos hablaban de qué criaturas tenían y cuáles les faltaban.",
        "Había ciento cincuenta oficiales. Y una más, escondida.",
    ], [("cap5", 0, -0.6), ("po_1996", 0, 1.0), ("po_tranquilo", 1, 0), ("po_patios", 2, 0), ("po_151", 3, 0)]),
    ("6. El secreto de Mew", [
        "Según contó uno de sus programadores, en el último momento metió en el juego una criatura secreta: Mew.",
        "No aparecía en ningún sitio. No se podía capturar de forma normal. Era casi un rumor.",
        "Pero algunos jugadores la encontraron gracias a fallos del juego. Y el rumor se disparó.",
        "Una revista japonesa de cómics infantiles organizó un concurso: veinte ganadores recibirían a Mew en su cartucho.",
        "Según se cuenta, se presentaron setenta y ocho mil niños.",
        "El misterio funcionó como el mejor anuncio posible. Y las ventas se dispararon.",
    ], [("cap6", 0, -0.6), ("po_mew", 0, 1.0), ("po_rumor", 1, 0), ("po_fallos", 2, 0), ("po_concurso", 3, 0), ("po_78000", 4, 0), ("po_ventas", 5, 0)]),
    ("7. Pika y chu", [
        "Entre aquellas criaturas había un pequeño ratón eléctrico, dibujado por la diseñadora Atsuko Nishida.",
        "Su nombre era una mezcla de dos sonidos japoneses: pika, el chisporroteo de la electricidad, y chu, el chillido de un ratón.",
        "Pikachu no era, al principio, la criatura principal del juego.",
        "Pero en mil novecientos noventa y siete llegó la serie de dibujos animados. Y, según se cuenta, los responsables eligieron a Pikachu como compañero del protagonista porque gustaba a niños y a niñas por igual.",
        "Y hay un guiño escondido: en la versión japonesa, el protagonista se llama Satoshi, como Tajiri. Y su gran rival se llama Shigeru, como Miyamoto, su mentor.",
        "Fue la decisión que convirtió a un ratón amarillo en una estrella mundial.",
    ], [("cap7", 0, -0.6), ("po_nishida", 0, 1.0), ("po_pikachu", 1, 0), ("po_principal", 2, 0), ("po_serie", 3, 0), ("po_nombres", 4, 0), ("po_estrella", 5, 0)]),
    ("8. El episodio prohibido", [
        "El dieciséis de diciembre de mil novecientos noventa y siete, la televisión japonesa emitió un episodio de la serie dedicado a una criatura virtual, Porygon.",
        "En una escena había una explosión con destellos rojos y azules, que parpadeaban muy rápido.",
        "Esa noche, cientos de niños de todo Japón empezaron a sentirse mal: mareos, náuseas, convulsiones.",
        "Según las autoridades japonesas, seiscientas ochenta y cinco personas fueron llevadas al hospital en ambulancia. La prensa lo llamó el shock Pokémon.",
        "La serie se suspendió durante cuatro meses. Aquel episodio no se ha vuelto a emitir nunca.",
        "Y desde entonces, las cadenas japonesas siguen normas estrictas sobre los destellos en los dibujos animados.",
    ], [("cap8", 0, -0.6), ("po_porygon", 0, 1.0), ("po_destellos", 1, 0), ("po_mal", 2, 0), ("po_685", 3, 0), ("po_suspendida", 4, 0), ("po_normas", 5, 0)]),
    ("9. Pokémanía", [
        "Ni siquiera aquello frenó a Pokémon.",
        "En mil novecientos noventa y ocho los juegos llegaron a Estados Unidos, con un nombre más corto: Pokémon. Y en mil novecientos noventa y nueve, a Europa.",
        "Llegó todo a la vez: los videojuegos, la serie, las cartas coleccionables, los peluches, la película.",
        "En los colegios de medio mundo hubo que prohibir las cartas, porque los niños no hacían otra cosa que intercambiarlas.",
        "Pokémon hizo realidad el sueño de Tajiri: millones de niños buscando, coleccionando e intercambiando criaturas.",
    ], [("cap9", 0, -0.6), ("po_frena", 0, 1.0), ("po_occidente", 1, 0), ("po_todo", 2, 0), ("po_cartas", 3, 0), ("po_sueno", 4, 0)]),
    ("10. Un negocio de tres", [
        "Para gestionar aquel fenómeno, en mil novecientos noventa y ocho se creó una empresa específica, que hoy se llama The Pokémon Company.",
        "Sus dueños son tres: Nintendo, Game Freak y Creatures, la empresa que se encargaba de las cartas y de parte del desarrollo.",
        "Y aquí viene un dato que sorprende a mucha gente: la mayor parte del dinero de Pokémon no viene de los videojuegos.",
        "Viene de todo lo demás: peluches, camisetas, mochilas, cartas, juguetes. Lo que se llama el merchandising.",
        "Algunas cartas antiguas se han vendido en subastas por cifras de varios millones de dólares.",
        "Un juego que nació casi sin dinero acabó convirtiéndose en una máquina de imprimirlo.",
    ], [("cap10", 0, -0.6), ("po_company", 0, 1.0), ("po_duenos", 1, 0), ("po_dato", 2, 0), ("po_merch", 3, 0), ("po_subasta", 4, 0), ("po_maquina", 5, 0)]),
    ("11. Todos a la calle", [
        "Veinte años después, en julio de dos mil dieciséis, llegó Pokémon Go, un juego para el móvil.",
        "Usaba el mapa del mundo real: para capturar criaturas había que salir a la calle, caminar e ir a parques, plazas y monumentos.",
        "Fue un fenómeno inmediato. En pocas semanas lo habían descargado cientos de millones de personas.",
        "Las calles se llenaron de gente mirando el móvil, y hubo de todo: amistades nuevas, ejercicio… y algún que otro accidente por no mirar por dónde se iba.",
        "Era, en cierto modo, volver al principio: a un niño que salía a buscar bichos por el campo.",
    ], [("cap11", 0, -0.6), ("po_go", 0, 1.0), ("po_mapa", 1, 0), ("po_descargas", 2, 0), ("po_calles", 3, 0), ("po_principio", 4, 0)]),
    ("12. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: los recuerdos de la infancia pueden ser una mina. Pokémon nació de un niño que cazaba insectos.",
        "Dos: mira las herramientas de otra forma. Todos usaban el cable de la Game Boy para competir. Tajiri lo usó para compartir.",
        "Y tres: un secreto bien guardado vende más que mil anuncios. Mew demostró que el misterio engancha.",
    ], [("cap12", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un niño cazando insectos, una revista hecha a mano, un cable entre dos consolas, seis años al borde de la ruina y un ratón eléctrico.",
        "La próxima vez que veas a Pikachu, acuérdate del doctor bicho.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Cuál era tu Pokémon favorito? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("po_final", 0, 0), ("po_doctor2", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Wikipedia, «Pokémon»", "https://en.wikipedia.org/wiki/Pok%C3%A9mon"),
    ("South China Morning Post, «A brief history of Pokémon Red and Green»", "https://scmp.com/yp/discover/entertainment/tech-gaming/article/3059725/brief-history-pokemon-red-and-green-nintendo"),
    ("Giant Bomb, «Satoshi Tajiri»", "https://giantbomb.com/wiki/People/Satoshi_Tajiri"),
    ("Bulbapedia, «History of Pokémon»", "https://bulbapedia.bulbagarden.net/wiki/History_of_Pok%C3%A9mon"),
    ("Mental Floss, «When Pokémon sent hundreds of viewers to the hospital»", "https://www.mentalfloss.com/article/610230/when-pokemon-sent-hundreds-viewers-hospital"),
    ("Wikipedia, «Dennō Senshi Porygon»", "https://en.wikipedia.org/wiki/Denn%C5%8D_Senshi_Porygon"),
    ("Wikipedia, «List of highest-grossing media franchises»", "https://en.wikipedia.org/wiki/List_of_highest-grossing_media_franchises"),
]
DESCRIPCION = ("Pokémon nació de los recuerdos de Satoshi Tajiri, un niño que cazaba insectos en Machida, a las afueras de Tokio. Su primer juego tardó seis años y "
               "casi arruina a Game Freak; una criatura secreta, Mew, disparó las ventas; y un episodio de la serie mandó a 685 personas al hospital. "
               "Esta es la historia de Pokémon.")
ETIQUETAS = "pokémon, pokemon, historia de pokémon, satoshi tajiri, game freak, pikachu, mew, pokémon rojo y verde, game boy, porygon, pokémon go, historia de marcas, código de barras"
HASHTAGS = "#Pokémon #Videojuegos #HistoriaDeMarcas"
LISTA = "Gigantes tecnológicos"
NOTA = "Nota: algunas anécdotas (el apodo «doctor bicho», la elección de Pikachu para la serie) proceden de entrevistas y relatos posteriores."
PREGUNTA = "¿TU POKÉMON *FAVORITO*?"
