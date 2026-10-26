"""Guion final del vídeo 1 de Código de Barras: Chupa Chups.

Cada segmento: (capítulo para los marcadores de YouTube, lista de frases, lista de escenas).
Cada escena es (nombre, índice de la frase con la que empieza, desfase en segundos), así la imagen va sincronizada con la voz.
Solo incluye hechos con fuente (ver FUENTES) o presentados explícitamente como versión popular.
"""

SEGMENTOS = [
    ("Introducción", [
        "Este caramelo lo has visto miles de veces.",
        "Seguramente lo has comido.",
        "Y es muy probable que no sepas que su logotipo lo diseñó uno de los pintores más famosos del siglo veinte: Salvador Dalí.",
        "Sí, el de los relojes derretidos.",
        "Pero el logotipo es solo una parte de la historia.",
        "Lo interesante es cómo un caramelo con un palo, nacido en Barcelona, acabó en medio mundo.",
        "Y todo empezó con una pregunta muy sencilla: ¿por qué los niños acaban siempre con las manos pegajosas?",
    ], [("intro_piruleta", 0, 0), ("intro_dali", 2, 0), ("relojes", 3, 0), ("teaser_mundo", 5, 0), ("pregunta_manos", 6, 0)]),

    ("1. El problema", [
        "Barcelona, años cincuenta.",
        "Enric Bernat lleva tiempo en el negocio de los dulces: a principios de esa década había creado su propia empresa de confitería.",
        "Y se fija en algo que cualquier padre conoce.",
        "Los niños se meten el caramelo en la boca, lo sacan, lo vuelven a meter… y terminan con los dedos pringados.",
        "Bernat no quiere inventar un sabor nuevo.",
        "Quiere inventar una forma nueva de comerlo.",
        "La solución es tan simple que parece obvia: poner el caramelo en la punta de un palo.",
    ], [("cap1", 0, -0.6), ("bernat", 1, 0), ("piensa", 2, 0), ("manos_pegajosas", 3, 0), ("sabor_no", 4, 0), ("idea_palo", 6, 0)]),

    ("2. El nombre", [
        "En mil novecientos cincuenta y ocho, el producto sale a la venta.",
        "Pero no se llamaba como lo conoces.",
        "Según algunas fuentes, su primer nombre fue Gol, porque el caramelo con su palo recordaba a un balón entrando en la portería.",
        "Después llegó otro nombre: Chups, del verbo chupar.",
        "Y aquí ocurre algo curioso.",
        "En las tiendas, la gente no pedía un Chups. Pedía un Chupa Chups.",
        "La empresa hizo lo más inteligente que puede hacer una marca: escuchar a sus clientes.",
        "Y ese fue el nombre que se quedó.",
        "Las versiones sobre el orden exacto de estos nombres no coinciden del todo, pero todas apuntan a lo mismo: el nombre lo eligió, en parte, la calle.",
    ], [("cap2", 0, -0.6), ("ano1958", 0, 1.2), ("nombre_gol", 2, 0), ("nombre_chups", 3, 0), ("curioso", 4, 0), ("tienda_pedian", 5, 0), ("escuchar", 6, 0), ("la_calle", 8, 0)]),

    ("3. El lugar", [
        "El nombre ayudó. Pero la jugada maestra fue otra: dónde se vendía.",
        "Hasta entonces, los caramelos solían estar detrás del mostrador, lejos de las manos de los niños.",
        "Según las crónicas de la empresa, Bernat pidió a los comerciantes que los colocaran junto a la caja registradora, a la altura de los ojos de un niño.",
        "Piénsalo.",
        "Es el último momento antes de pagar, y la decisión la toma alguien de un metro de altura.",
        "Hoy esa zona de las tiendas tiene nombre propio en marketing: la zona de compra por impulso.",
        "Bernat la aprovechó mucho antes de que se pusiera de moda.",
    ], [("cap3", 0, -0.6), ("mostrador_antes", 1, 0), ("mostrador_caja", 2, 0), ("altura_nino", 3, 0), ("compra_impulso", 5, 0), ("adelantado", 6, 0)]),

    ("4. Dalí", [
        "Año mil novecientos sesenta y nueve.",
        "La marca ya funciona en España y quiere crecer fuera.",
        "Necesita una imagen que se reconozca en cualquier país, sin depender del idioma.",
        "Y Bernat recurre a Salvador Dalí.",
        "La versión que más se repite dice que Dalí resolvió el encargo en menos de una hora.",
        "El resultado es la margarita amarilla con el nombre de la marca que todavía hoy envuelve cada caramelo.",
        "Pero lo más valioso no fue el dibujo. Fue un consejo.",
        "Según se cuenta, Dalí propuso colocar el logotipo en la parte de arriba del envoltorio, y no en un lateral, para que se viera entero desde cualquier ángulo.",
        "Fíjate en la diferencia.",
        "En el lateral, el envoltorio gira y el nombre se pierde. Arriba, lo ves siempre.",
        "No es solo arte. Es diseño funcional. Y lo propuso un pintor surrealista.",
    ], [("cap4", 0, -0.6), ("ano1969", 1, 0), ("idiomas", 2, 0), ("dali_artista", 3, 0), ("reloj_rapido", 4, 0), ("margarita", 5, 0), ("consejo", 6, 0), ("envoltorio_lateral", 7, 0), ("envoltorio_comparar", 9, 0), ("diseno_funcional", 10, 0)]),

    ("5. El mundo", [
        "Con su nueva imagen, la marca sale a conquistar el mundo.",
        "Fábricas y distribución en otros países, patrocinios, y una presencia constante en la cultura popular.",
        "Hay incluso una historia que la marca ha contado muchas veces: que en mil novecientos noventa y cinco, uno de sus caramelos viajó a la estación espacial rusa Mir.",
        "Si fue de verdad el primer caramelo en el espacio es más difícil de comprobar.",
        "Pero dice mucho de una marca que supo convertir un dulce de barrio en un icono global.",
    ], [("cap5", 0, -0.6), ("mundo", 1, 0), ("espacio1995", 2, 0), ("comprobar", 3, 0), ("icono_global", 4, 0)]),

    ("6. La venta", [
        "Pero ninguna marca vive para siempre de un solo producto.",
        "Los gustos cambian, crece la preocupación por el azúcar, y el negocio de los caramelos se concentra en grandes grupos internacionales.",
        "En dos mil seis, la empresa pasa a manos del grupo italo-neerlandés Perfetti Van Melle, el mismo que fabrica marcas como Mentos.",
        "El caramelo más famoso de España deja de ser de propiedad española.",
        "Aunque, para medio mundo, sigue siendo un pedacito de Barcelona.",
    ], [("cap6", 0, -0.6), ("gustos", 1, 0), ("venta2006", 2, 0), ("propiedad", 3, 0), ("pedacito_bcn", 4, 0)]),

    ("7. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: las grandes ideas a veces no son un producto nuevo, sino una forma nueva de usar algo de siempre.",
        "El caramelo ya existía. El palo lo cambió todo.",
        "Dos: a veces el nombre de tu producto no lo eliges tú. Lo eligen tus clientes. Y escucharlos es una ventaja.",
        "Y tres: el diseño no es decoración. Un logotipo bien colocado puede valer más que mil anuncios.",
    ], [("cap7", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 3, 0), ("leccion3", 4, 0)]),

    ("Final", [
        "La próxima vez que veas esa margarita amarilla junto a la caja del supermercado, ya lo sabes.",
        "Detrás hay un empresario de Barcelona, un pintor surrealista y una pregunta sobre dedos pegajosos.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "Si quieres que investiguemos otra marca, déjala en los comentarios: cada mes elegimos una de las más votadas.",
        "Y si te ha gustado, suscríbete. El próximo jueves: el día que Coca-Cola cambió su fórmula… y tuvo que pedir perdón.",
    ], [("resumen_final", 0, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]

FUENTES = [
    ("Wikipedia, «Chupa Chups»", "https://en.wikipedia.org/wiki/Chupa_Chups"),
    ("Wikipedia, «Enric Bernat»", "https://en.wikipedia.org/wiki/Enric_Bernat"),
    ("Gran Enciclopèdia Catalana, «Enric Bernat i Fontlladosa»", "https://www.enciclopedia.cat/gran-enciclopedia-catalana/enric-bernat-i-fontlladosa"),
    ("Print Magazine (Steven Heller), «Dali Pops»", "https://www.printmag.com/Article/Dali-Pops"),
    ("Encyclopedia.com, «Chupa Chups S.A.»", "https://encyclopedia.com/books/politics-and-business-magazines/chupa-chups-sa"),
    ("Artribune, sobre el logotipo de Dalí", "https://www.artribune.com/?p=1237121"),
    ("Excélsior, «Salvador Dalí inventó el logo de Chupa Chups»", "https://www.excelsior.com.mx/estilo-de-vida/salvador-dali-invento-logo-chupa-chups-surrealismo-dulces"),
    ("Scottish Grocer, «Celebrating 60 sweet years» (2018)", "https://scottishgrocer.co.uk/2018/10/01/celebrating-60-sweet-years/"),
    ("Emprendedor.com, sobre el origen del nombre", "https://emprendedor.com/el-hombre-que-creo-las-chupa-chups-y-contrato-al-mismisimo-dali-para-disenar-un-logo/"),
]
