"""Guion del vídeo 9 de Código de Barras: Fanta, el refresco que nació de la escasez."""
TITULO = "Fanta: el refresco que nació en la Alemania nazi"
TITULOS_ALT = ["El origen oculto de Fanta", "Fanta nació porque no podían hacer Coca-Cola"]
MARCA = "Fanta"
SEGMENTOS = [
    ("Introducción", [
        "Naranja, burbujas y un color imposible de confundir.",
        "Fanta se bebe hoy en casi todo el mundo.",
        "Pero su origen es uno de los más incómodos de la historia de las marcas.",
        "Fanta nació en Alemania, en plena Segunda Guerra Mundial.",
        "Y nació por una razón muy concreta: allí ya no se podía fabricar Coca-Cola.",
    ], [("f_naranja", 0, 0), ("f_mundo", 1, 0), ("f_incomodo", 2, 0), ("f_guerra", 3, 0), ("f_sincoca", 4, 0)]),
    ("1. Coca-Cola en Alemania", [
        "En los años treinta, Coca-Cola tenía un negocio importante en Alemania.",
        "Allí se embotellaba y se vendía con mucho éxito.",
        "Al frente de la filial alemana estaba un hombre llamado Max Keith.",
        "Pero llegó la guerra, y con ella el embargo comercial.",
        "Sin el jarabe y los ingredientes que llegaban de Estados Unidos, las fábricas alemanas no podían hacer Coca-Cola.",
    ], [("cap1", 0, -0.6), ("f_treinta", 0, 1.0), ("f_embotella", 1, 0), ("f_keith", 2, 0), ("f_embargo", 3, 0), ("f_jarabe", 4, 0)]),
    ("2. Los restos de los restos", [
        "Keith tenía fábricas, trabajadores y camiones. Lo que no tenía era un producto.",
        "Así que decidió inventar uno con lo que había en Alemania en aquel momento.",
        "La receta usaba subproductos de otras industrias: suero de la leche, que sobraba al hacer queso, y restos de manzana de la fabricación de sidra.",
        "Se ha descrito como un refresco hecho con los restos de los restos.",
        "Faltaba el nombre. Keith pidió a su equipo que usara la imaginación, que en alemán se dice «Fantasie».",
        "Y uno de sus vendedores, Joe Knipp, respondió: «¡Fanta!».",
    ], [("cap2", 0, -0.6), ("f_sinproducto", 0, 1.0), ("f_inventar", 1, 0), ("f_receta", 2, 0), ("f_restos", 3, 0), ("f_fantasie", 4, 0), ("f_knipp", 5, 0)]),
    ("3. Un tema incómodo", [
        "Fanta salió a la venta a principios de los años cuarenta y se vendió muy bien en una Alemania con escasez de casi todo.",
        "Y aquí viene la pregunta incómoda: ¿fue Fanta un refresco nazi?",
        "Según el historiador Mark Pendergrast, Max Keith se negó a afiliarse al partido nazi, a pesar de las presiones.",
        "Pero su empresa operaba con normalidad dentro del régimen, y en actos de la compañía llegaron a exhibirse símbolos nazis.",
        "Los historiadores siguen debatiendo cómo juzgar aquel papel.",
    ], [("cap3", 0, -0.6), ("f_vende", 0, 1.0), ("f_pregunta", 1, 0), ("f_pendergrast", 2, 0), ("f_regimen", 3, 0), ("f_debate", 4, 0)]),
    ("4. El regreso", [
        "Cuando terminó la guerra, Keith volvió a ponerse en contacto con Coca-Cola en Estados Unidos.",
        "Las fábricas alemanas seguían en pie, y la compañía recuperó su negocio en el país.",
        "Aquella primera Fanta dejó de fabricarse.",
        "Pero la marca no murió.",
        "En mil novecientos cincuenta y cinco, Coca-Cola desarrolló en Italia una nueva Fanta, esta vez de naranja.",
        "Esa es la que conocemos hoy. Y se convirtió en una de las marcas más vendidas de la compañía.",
    ], [("cap4", 0, -0.6), ("f_contacto", 0, 1.0), ("f_fabricas", 1, 0), ("f_deja", 2, 0), ("f_nomuere", 3, 0), ("f_italia", 4, 0), ("f_hoy", 5, 0)]),
    ("5. El anuncio retirado", [
        "La historia de Fanta volvió a los titulares en dos mil quince.",
        "Para su setenta y cinco aniversario, la marca lanzó en Alemania un anuncio que hablaba de recuperar el sentimiento de «los buenos viejos tiempos».",
        "Muchos espectadores recordaron enseguida cuáles eran esos tiempos.",
        "Hubo una oleada de críticas y el anuncio se retiró rápidamente.",
        "La compañía pidió disculpas y dijo que solo pretendía evocar recuerdos de infancia.",
    ], [("cap5", 0, -0.6), ("f_titulares", 0, 1.0), ("f_aniversario", 1, 0), ("f_recordaron", 2, 0), ("f_retirado", 3, 0), ("f_disculpas", 4, 0)]),
    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: la escasez obliga a inventar. Fanta nació porque no había otra opción.",
        "Dos: una marca puede sobrevivir a su propio origen, y reinventarse por completo.",
        "Y tres: la historia de una marca no se puede esconder. Antes o después, alguien la recuerda.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "La próxima vez que veas una lata naranja, ya sabes que su historia empieza con suero de leche, restos de manzana y una guerra.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Sabías el origen de Fanta? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("f_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("Wikipedia, «Fanta»", "https://en.wikipedia.org/wiki/Fanta"),
    ("The Local (Alemania), «How Fanta was invented in Nazi Germany»", "https://www.thelocal.de/20170523/fanta-how-the-nazi-era-drink-became-the-world-famous-brand"),
    ("History (Reino Unido), «Fanta origins in Nazi Germany»", "https://www.history.co.uk/articles/fanta-origins-nazi-germany"),
    ("Today I Found Out, «How WWII Created One of the World's Most Popular Soft Drinks»", "https://www.todayifoundout.com/index.php/2022/12/how-wwii-created-one-of-the-worlds-most-popular-soft-drinks/"),
    ("Snopes, «Fanta»", "https://www.snopes.com/cokelore/fanta.asp"),
    ("Mark Pendergrast, «For God, Country and Coca-Cola» (libro)", ""),
]
DESCRIPCION = ("Fanta nació en Alemania durante la Segunda Guerra Mundial, cuando la filial de Coca-Cola ya no podía conseguir los ingredientes de su "
               "refresco. Max Keith la inventó con suero de leche y restos de manzana. Esta es su historia: el origen, el debate sobre el régimen nazi, "
               "la Fanta de naranja de 1955 y el anuncio que tuvo que retirarse en 2015.")
ETIQUETAS = "fanta, historia de fanta, origen de fanta, fanta alemania nazi, max keith, coca-cola alemania, refrescos, historia de marcas, código de barras"
HASHTAGS = "#Fanta #HistoriaDeMarcas #CocaCola"
LISTA = "Inventos por accidente"
NOTA = "Nota: las fuentes dan 1940 o 1941 como año de lanzamiento, por eso decimos «a principios de los años cuarenta»."
PREGUNTA = "¿SABÍAS EL *ORIGEN DE FANTA*?"
