"""Guion del vídeo 43 de Código de Barras (formato largo): inventos por accidente."""
TITULO = "6 inventos que nacieron por accidente (y hoy tienes en casa)"
TITULOS_ALT = ["Post-it, Play-Doh, microondas…: las marcas que nacieron de un error", "Los accidentes más rentables de la historia"]
MARCA = "Inventos_por_accidente"
SEGMENTOS = [
    ("Introducción", [
        "Un pegamento que no pegaba. Un limpiador de paredes que nadie compraba. Una chocolatina que se derritió en un bolsillo.",
        "Muchos de los productos que tienes en casa no nacieron de un plan brillante, sino de un error.",
        "Un experimento que salió mal, un muelle que se cayó de una mesa, una bombona de gas que parecía vacía.",
        "Pero en cada caso hubo alguien que, en lugar de tirar el error a la basura, se preguntó: ¿y esto para qué podría servir?",
        "Hoy te contamos la historia de seis inventos que nacieron por accidente. Y de las marcas que salieron de ellos.",
    ], [("ac_errores", 0, 0), ("ac_casa", 1, 0), ("ac_experimento", 2, 0), ("ac_pregunta", 3, 0), ("ac_seis", 4, 0)]),
    ("1. Un pegamento que no pega", [
        "Empezamos en mil novecientos sesenta y ocho, en los laboratorios de 3M, en Minnesota, en Estados Unidos.",
        "Un químico llamado Spencer Silver intentaba crear un adhesivo muy fuerte, para la industria aeronáutica.",
        "Pero le salió justo lo contrario: un pegamento débil. Pegaba, sí, pero se despegaba fácilmente. Y se podía volver a pegar sin dejar restos.",
        "Para un pegamento, aquello parecía un fracaso.",
        "Silver estaba convencido de que tenía algo interesante. Durante años, según se cuenta, fue presentándolo a sus compañeros en charlas internas.",
        "Pero nadie sabía para qué podía servir un pegamento que no pegaba del todo.",
    ], [("cap1", 0, -0.6), ("ac_3m", 0, 1.0), ("ac_silver", 1, 0), ("ac_debil", 2, 0), ("ac_fracaso", 3, 0), ("ac_charlas", 4, 0), ("ac_nadie", 5, 0)]),
    ("2. El marcapáginas del coro", [
        "La respuesta la encontró otro empleado de 3M, Art Fry.",
        "Fry cantaba en el coro de su iglesia. Y tenía un problema: los papelitos que usaba para marcar las canciones en el libro de himnos se le caían constantemente.",
        "Un domingo, según contó él mismo, se acordó del pegamento de Silver.",
        "¿Y si ponía un poco de ese adhesivo en los marcapáginas? Se quedarían pegados… y se podrían quitar sin romper las hojas.",
        "Funcionó. Y Fry se dio cuenta de que aquello no servía solo para marcar páginas: servía para dejar notas en cualquier sitio.",
    ], [("cap2", 0, -0.6), ("ac_fry", 0, 1.0), ("ac_coro", 1, 0), ("ac_domingo", 2, 0), ("ac_marcapaginas", 3, 0), ("ac_notas", 4, 0)]),
    ("3. Nadie lo entendía", [
        "En mil novecientos setenta y siete, 3M probó el producto en varias ciudades con un nombre poco afortunado: Press 'n Peel, algo así como presiona y despega.",
        "Fue un fracaso. La gente no entendía qué era ni para qué servía.",
        "Pero los dos inventores no se rindieron. Y la empresa probó otra cosa: regalar muestras.",
        "Al año siguiente repartió miles de blocs gratis en las oficinas de una ciudad, Boise, en Idaho.",
        "Y pasó algo: una vez que la gente los usaba, ya no podía dejarlos. Casi todos los que los probaron dijeron que los comprarían.",
        "En mil novecientos ochenta salieron a la venta en todo Estados Unidos, con un nombre nuevo: Post-it.",
        "Y el famoso color amarillo, según la propia marca, fue casi casual: era el papel que tenían a mano en el laboratorio de al lado.",
    ], [("cap3", 0, -0.6), ("ac_pressnpeel", 0, 1.0), ("ac_fracaso2", 1, 0), ("ac_muestras", 2, 0), ("ac_boise", 3, 0), ("ac_enganchan", 4, 0), ("ac_postit", 5, 0), ("ac_amarillo", 6, 0)]),
    ("4. Limpiador de paredes", [
        "Segundo invento. Años treinta, Cincinnati, Estados Unidos.",
        "Una pequeña empresa de productos de limpieza fabricaba una masa blanda para limpiar el papel pintado de las paredes.",
        "En aquella época, muchas casas se calentaban con carbón. Y el hollín ennegrecía el papel de las paredes. Aquella masa se pasaba por encima y absorbía la suciedad.",
        "Pero después de la Segunda Guerra Mundial, las calefacciones cambiaron, y llegó el papel pintado lavable.",
        "El limpiador ya no hacía falta. Las ventas se hundieron, y la empresa estaba en apuros.",
    ], [("cap4", 0, -0.6), ("ac_cincinnati", 0, 1.0), ("ac_masa", 1, 0), ("ac_hollin", 2, 0), ("ac_lavable", 3, 0), ("ac_apuros", 4, 0)]),
    ("5. La idea de una maestra", [
        "La solución llegó de una maestra de educación infantil, Kay Zufall, cuñada de Joe McVicker, uno de los responsables de la empresa.",
        "Según la historia que recogen los museos del juguete, Zufall leyó que aquella masa se podía usar para modelar. La probó con los niños de su clase. Y les encantó.",
        "Era blanda, no manchaba y no era tóxica. Perfecta para niños.",
        "La empresa le añadió colores y un olor característico. Y Zufall propuso también el nombre: Play-Doh. Algo así como masa para jugar.",
        "En mil novecientos cincuenta y seis, el limpiador de papel pintado se convirtió en juguete. Desde entonces se han vendido miles de millones de botes.",
    ], [("cap5", 0, -0.6), ("ac_zufall", 0, 1.0), ("ac_clase", 1, 0), ("ac_blanda", 2, 0), ("ac_playdoh", 3, 0), ("ac_1956", 4, 0)]),
    ("6. Una chocolatina derretida", [
        "Tercer invento. Mil novecientos cuarenta y cinco.",
        "Percy Spencer era un ingeniero de Raytheon, una empresa que fabricaba equipos de radar para el ejército estadounidense.",
        "Según la historia más repetida, un día estaba trabajando cerca de un magnetrón, el aparato que genera las microondas del radar.",
        "Y notó que la chocolatina que llevaba en el bolsillo se había derretido.",
        "Curioso, probó a poner granos de maíz cerca del aparato. Y empezaron a saltar: palomitas.",
        "Así nació la idea del horno microondas. El primero que vendió su empresa, el Radarange, medía casi dos metros de alto y pesaba más de trescientos kilos.",
        "Tuvieron que pasar más de veinte años para que llegara un modelo pequeño, para las cocinas de casa.",
    ], [("cap6", 0, -0.6), ("ac_1945", 0, 1.0), ("ac_spencer", 1, 0), ("ac_magnetron", 2, 0), ("ac_chocolatina", 3, 0), ("ac_palomitas", 4, 0), ("ac_radarange", 5, 0), ("ac_casa2", 6, 0)]),
    ("7. El muelle que se cayó", [
        "Cuarto invento. Mil novecientos cuarenta y tres, en un astillero de Filadelfia.",
        "Richard James, un ingeniero naval, intentaba diseñar muelles para estabilizar instrumentos delicados en los barcos.",
        "Uno de aquellos muelles se le cayó de la mesa. Y en lugar de quedarse quieto en el suelo, bajó dando pasitos, enrollándose y desenrollándose.",
        "James pensó que aquello podía ser un juguete. Su mujer, Betty, buscó un nombre en el diccionario y encontró uno que significaba algo así como sinuoso y elegante: Slinky.",
        "En noviembre de mil novecientos cuarenta y cinco hicieron una demostración en unos grandes almacenes de Filadelfia. Según la historia de la marca, vendieron cuatrocientos en noventa minutos.",
        "Desde entonces, el muelle que baja las escaleras solo se ha vendido por cientos de millones.",
    ], [("cap7", 0, -0.6), ("ac_astillero", 0, 1.0), ("ac_james", 1, 0), ("ac_cae", 2, 0), ("ac_slinky", 3, 0), ("ac_gimbels", 4, 0), ("ac_escaleras", 5, 0)]),
    ("8. La bombona vacía", [
        "Quinto invento. Seis de abril de mil novecientos treinta y ocho, en los laboratorios de DuPont, en Nueva Jersey.",
        "El químico Roy Plunkett trabajaba con gases para refrigeración.",
        "Una mañana abrió la válvula de una bombona y no salió nada. Parecía vacía. Pero pesaba lo mismo que cuando estaba llena.",
        "Intrigado, la abrió. Y dentro encontró un polvo blanco y ceroso.",
        "El gas se había transformado en un material nuevo, muy resbaladizo, al que casi nada se le pegaba y que resistía temperaturas muy altas.",
        "DuPont lo bautizó como teflón.",
    ], [("cap8", 0, -0.6), ("ac_1938", 0, 1.0), ("ac_plunkett", 1, 0), ("ac_vacia", 2, 0), ("ac_polvo", 3, 0), ("ac_resbaladizo", 4, 0), ("ac_teflon", 5, 0)]),
    ("9. La sartén de Colette", [
        "Al principio el teflón se usó en la industria y en el ejército. Nadie pensaba en las cocinas.",
        "Hasta que, en Francia, un ingeniero llamado Marc Grégoire empezó a recubrir con teflón sus cañas de pescar, para que el sedal se deslizara mejor.",
        "Según la historia de la marca, su mujer, Colette, le propuso usarlo en sus sartenes, para que no se pegara la comida.",
        "Grégoire encontró la forma de fijar el teflón al aluminio. Y en mil novecientos cincuenta y seis fundaron una empresa para fabricarlas.",
        "Su nombre juntaba las dos palabras clave: teflón y aluminio. Tefal.",
    ], [("cap9", 0, -0.6), ("ac_industria", 0, 1.0), ("ac_gregoire", 1, 0), ("ac_colette", 2, 0), ("ac_aluminio", 3, 0), ("ac_tefal", 4, 0)]),
    ("10. Se pegaba a todo", [
        "Sexto y último invento. Mil novecientos cuarenta y dos.",
        "Harry Coover, un químico de la empresa Eastman Kodak, buscaba un plástico transparente para fabricar miras de armas durante la Segunda Guerra Mundial.",
        "Probó una sustancia, el cianoacrilato. Pero tenía un problema enorme: se pegaba a todo lo que tocaba. Así que la descartó.",
        "Años después, trabajando en otro proyecto, un compañero suyo usó esa sustancia entre dos piezas de vidrio carísimas… y ya no hubo forma de separarlas.",
        "Esta vez Coover vio la oportunidad: el problema era, en realidad, la solución.",
        "Tenía tantos usos que, según varias fuentes, durante la guerra de Vietnam los médicos militares usaron un spray de este tipo para cerrar heridas en el campo de batalla.",
        "En mil novecientos cincuenta y ocho salió a la venta el primer pegamento de este tipo. Hoy lo conocemos como superglue, o simplemente, pegamento instantáneo.",
    ], [("cap10", 0, -0.6), ("ac_1942", 0, 1.0), ("ac_coover", 1, 0), ("ac_todo", 2, 0), ("ac_vidrio", 3, 0), ("ac_solucion", 4, 0), ("ac_heridas", 5, 0), ("ac_superglue", 6, 0)]),
    ("11. Lo que nos enseña", [
        "¿Qué nos enseñan estas historias? Tres cosas.",
        "Una: un fracaso puede ser un éxito en el lugar equivocado. Un pegamento débil era un mal pegamento… pero una nota perfecta.",
        "Dos: la curiosidad vale más que la suerte. Muchos habían visto chocolatinas derretidas o muelles cayéndose. Pocos se preguntaron por qué.",
        "Y tres: a veces la mejor idea la tiene alguien de fuera. Una maestra, una esposa, un compañero del coro. Escucha.",
    ], [("cap11", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un pegamento débil, un limpiador de paredes, una chocolatina derretida, un muelle que se cae, una bombona vacía y un pegamento que no se podía despegar.",
        "La próxima vez que algo te salga mal, piénsalo dos veces antes de tirarlo.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Conoces algún otro invento que naciera por accidente? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("ac_final", 0, 0), ("ac_tirar", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Lemelson-MIT, «Art Fry & Spencer Silver»", "https://lemelson.mit.edu/resources/art-fry-spencer-silver"),
    ("MNopedia (Minnesota Historical Society), «Post-it Notes»", "https://www.mnhs.org/mnopedia/search/index/thing/post-it-notes"),
    ("The Henry Ford, «Accidental toy inventions»", "https://www.thehenryford.org/collections/explore/articles/accidental-toy-inventions"),
    ("History.com, «Classic toys origin stories»", "https://www.history.com/news/classic-toys-origin-stories"),
    ("Wikipedia, «Slinky»", "https://en.wikipedia.org/wiki/Slinky"),
    ("Wikipedia, «Percy Spencer»", "https://en.wikipedia.org/wiki/Percy_Spencer"),
    ("Wikipedia, «Roy J. Plunkett»", "https://en.wikipedia.org/wiki/Roy_J._Plunkett"),
    ("Wikipedia, «Tefal»", "https://en.wikipedia.org/wiki/Tefal"),
    ("Wikipedia, «Harry Coover»", "https://en.wikipedia.org/wiki/Harry_Coover"),
]
DESCRIPCION = ("Post-it nació de un pegamento que no pegaba. Play-Doh era un limpiador de papel pintado. El microondas, de una chocolatina derretida. "
               "Slinky, de un muelle que se cayó de una mesa. El teflón, de una bombona que parecía vacía (y de él salió Tefal). Y el pegamento instantáneo, "
               "de una sustancia que se pegaba a todo. Seis inventos que nacieron por accidente.")
ETIQUETAS = "inventos por accidente, post-it, play-doh, microondas, slinky, teflón, tefal, superglue, inventos curiosos, historia de marcas, código de barras"
HASHTAGS = "#Inventos #HistoriaDeMarcas #Curiosidades"
LISTA = "Objetos de casa"
NOTA = "Nota: varias de estas historias (la chocolatina de Spencer, la idea de Colette Grégoire, el color amarillo del Post-it) son las versiones que cuentan las propias marcas o los inventores."
PREGUNTA = "¿OTRO INVENTO *POR ACCIDENTE*?"
