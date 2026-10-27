"""Guion del vídeo 41 de Código de Barras (formato largo): Telepizza."""
TITULO = "Telepizza: el exsoldado de Vietnam que enseñó a España a pedir pizza por teléfono"
TITULOS_ALT = ["La historia de Telepizza (que empezó llamándose Pizzaphone)", "Cómo Telepizza ganó a Pizza Hut en España… y acabó siendo su socia"]
MARCA = "Telepizza"
SEGMENTOS = [
    ("Introducción", [
        "Una moto, una caja de cartón y un repartidor llamando al timbre.",
        "Hoy pedir comida a domicilio es lo más normal del mundo. Pero en España, a finales de los ochenta, casi nadie lo hacía.",
        "Lo cambió un hombre nacido en Cuba, que había luchado en la guerra de Vietnam y había trabajado para grandes multinacionales.",
        "Su empresa empezó con otro nombre, en un barrio de Madrid. Y en pocos años derrotó en España a los gigantes americanos de la pizza.",
        "Hasta que, décadas después, acabó aliándose con uno de ellos.",
        "Esta es la historia de Telepizza.",
    ], [("tp_moto", 0, 0), ("tp_nadie", 1, 0), ("tp_pujals", 2, 0), ("tp_barrio", 3, 0), ("tp_alianza", 4, 0), ("tp_historia", 5, 0)]),
    ("1. De La Habana a Vietnam", [
        "Leopoldo Fernández Pujals nació en La Habana en mil novecientos cuarenta y siete.",
        "Tras la revolución cubana, su familia se exilió en Estados Unidos, como tantas otras.",
        "De joven se alistó en el ejército estadounidense y combatió en la guerra de Vietnam. Según su biografía, volvió con una medalla y el grado de capitán.",
        "Después estudió empresariales y trabajó en marketing y ventas para grandes multinacionales de productos de consumo.",
        "Una de ellas lo destinó a España.",
    ], [("cap1", 0, -0.6), ("tp_habana", 0, 1.0), ("tp_exilio", 1, 0), ("tp_vietnam", 2, 0), ("tp_multinacionales", 3, 0), ("tp_espana", 4, 0)]),
    ("2. Un hueco en el mercado", [
        "En la España de los ochenta, comer pizza era todavía algo poco habitual. Y pedirla por teléfono, casi impensable.",
        "En Estados Unidos, en cambio, la pizza a domicilio era un negocio enorme.",
        "Fernández Pujals vio el hueco. Dejó su trabajo y decidió montar su propio negocio de pizzas a domicilio en Madrid.",
        "No sabía hacer pizzas. Según ha contado él mismo, empezó probando recetas y preguntando a la gente qué le gustaba.",
        "Su conclusión fue clara: a los españoles les gustaba una masa más esponjosa, y con mucho sabor.",
    ], [("cap2", 0, -0.6), ("tp_ochenta", 0, 1.0), ("tp_eeuu", 1, 0), ("tp_hueco", 2, 0), ("tp_recetas", 3, 0), ("tp_masa", 4, 0)]),
    ("3. La pizza a domicilio", [
        "Antes de seguir, una pregunta: ¿quién inventó la pizza a domicilio?",
        "Según una leyenda muy repetida en Nápoles, en mil ochocientos ochenta y nueve un pizzero llamado Raffaele Esposito preparó varias pizzas para la reina Margarita de Saboya, que estaba de visita en la ciudad.",
        "Una de ellas llevaba tomate, mozzarella y albahaca: los colores de la bandera italiana. Y, según la leyenda, recibió el nombre de la reina: pizza margarita.",
        "Los historiadores dudan de que todo ocurriera exactamente así. Pero muchos la citan como la primera pizza llevada a domicilio de la que se tiene noticia.",
        "El gran negocio, en cualquier caso, nació en Estados Unidos en la segunda mitad del siglo veinte. Algunas cadenas llegaron a prometer la pizza en treinta minutos… hasta que esas promesas acabaron en los tribunales por accidentes de los repartidores.",
    ], [("cap3", 0, -0.6), ("tp_quien", 0, 1.0), ("tp_napoles", 1, 0), ("tp_margarita", 2, 0), ("tp_dudan", 3, 0), ("tp_treinta", 4, 0)]),
    ("4. Pizzaphone", [
        "En mil novecientos ochenta y siete abrió su primer local en el barrio del Pilar, en Madrid.",
        "No se llamaba Telepizza. Se llamaba Pizzaphone: pizza y teléfono, en inglés.",
        "Pronto se dio cuenta de que el nombre no funcionaba bien en España. Mucha gente no sabía pronunciarlo.",
        "Así que en mil novecientos ochenta y ocho lo cambió por uno mucho más fácil, que mezclaba la misma idea: Telepizza.",
        "Teléfono y pizza. Lo entendía todo el mundo a la primera.",
    ], [("cap4", 0, -0.6), ("tp_pilar", 0, 1.0), ("tp_pizzaphone", 1, 0), ("tp_pronunciar", 2, 0), ("tp_1988", 3, 0), ("tp_entiende", 4, 0)]),
    ("5. Motos rojas", [
        "El sistema era sencillo y muy eficaz.",
        "Locales pequeños, sin apenas mesas, situados en barrios con mucha gente. Una cocina, un teléfono y una flota de motos.",
        "Cada local repartía solo en una zona cercana, para que la pizza llegara caliente y rápido.",
        "Y la marca empezó a repartir publicidad en los buzones de los vecinos. Folletos con ofertas: dos pizzas por el precio de una, pizzas medianas con un ingrediente gratis.",
        "Para muchos jóvenes españoles, repartir pizzas en moto fue su primer trabajo.",
        "Pronto las motos de Telepizza se convirtieron en parte del paisaje de las ciudades españolas.",
    ], [("cap5", 0, -0.6), ("tp_sencillo", 0, 1.0), ("tp_locales", 1, 0), ("tp_zona", 2, 0), ("tp_folletos", 3, 0), ("tp_primer", 4, 0), ("tp_paisaje", 5, 0)]),
    ("6. Contra los gigantes", [
        "Mientras tanto, las grandes cadenas estadounidenses también llegaron a España: Pizza Hut, Domino's.",
        "Tenían más dinero, más experiencia y marcas conocidas en todo el mundo.",
        "Pero Telepizza jugaba en casa. Conocía mejor los gustos, los barrios y los precios.",
        "Y crecía muy deprisa, en parte gracias a las franquicias: otros empresarios abrían locales con su marca a cambio de una parte de los ingresos.",
        "A mediados de los noventa, Telepizza se había convertido en la cadena de pizza a domicilio líder en España, por delante de los gigantes americanos.",
    ], [("cap6", 0, -0.6), ("tp_gigantes", 0, 1.0), ("tp_dinero", 1, 0), ("tp_casa", 2, 0), ("tp_franquicias", 3, 0), ("tp_lider", 4, 0)]),
    ("7. Guerra en el consejo", [
        "Pero dentro de la empresa estalló un conflicto.",
        "Según recogen los estudios sobre la compañía, en mil novecientos noventa y cinco un grupo de accionistas consiguió apartar a Fernández Pujals de la presidencia.",
        "Algunas fuentes señalan que entre ellos estaba su propio hermano, que también era uno de los grandes accionistas.",
        "Fue una batalla muy dura. Pero no duró mucho.",
        "En mil novecientos noventa y seis, con el apoyo de un gran banco, Fernández Pujals volvió a tomar el control de la empresa.",
    ], [("cap7", 0, -0.6), ("tp_conflicto", 0, 1.0), ("tp_apartan", 1, 0), ("tp_hermano", 2, 0), ("tp_batalla", 3, 0), ("tp_vuelve", 4, 0)]),
    ("8. La fiebre de la bolsa", [
        "Ese mismo año, Telepizza salió a bolsa en Madrid.",
        "Fue uno de los grandes éxitos bursátiles de la década. Miles de pequeños ahorradores compraron acciones, y su valor se disparó en pocos meses.",
        "La empresa siguió creciendo fuera de España: Portugal, Polonia, Chile, México y otros países.",
        "Y en mil novecientos noventa y nueve, Fernández Pujals vendió su participación y se marchó.",
        "Según recogen esos mismos estudios, su salida coincidió con una fuerte caída de las acciones.",
    ], [("cap8", 0, -0.6), ("tp_bolsa", 0, 1.0), ("tp_exito", 1, 0), ("tp_paises", 2, 0), ("tp_vende", 3, 0), ("tp_caida", 4, 0)]),
    ("9. Una segunda vida", [
        "Fernández Pujals no se retiró.",
        "Años después invirtió en Jazztel, una operadora de telecomunicaciones que pasaba por muchos problemas.",
        "Se convirtió en su principal accionista y la relanzó, ofreciendo internet de alta velocidad a buen precio.",
        "En dos mil quince, la operadora francesa Orange compró Jazztel por varios miles de millones de euros.",
        "El hombre que enseñó a los españoles a pedir pizza por teléfono acabó vendiéndoles también la conexión a internet.",
        "Años más tarde contó su vida en un libro, con un título que resume su forma de ver los negocios: Apunta a las estrellas y llegarás a la luna.",
    ], [("cap9", 0, -0.6), ("tp_noretira", 0, 1.0), ("tp_jazztel", 1, 0), ("tp_relanza", 2, 0), ("tp_orange", 3, 0), ("tp_telefono", 4, 0), ("tp_libro", 5, 0)]),
    ("10. De mano en mano", [
        "Telepizza, mientras tanto, cambió varias veces de dueño.",
        "En dos mil siete salió de la bolsa, comprada por un grupo de inversores. Después entró un fondo de capital riesgo.",
        "En dos mil dieciséis volvió a cotizar en bolsa. Y en dos mil diecinueve, un consorcio liderado por un gran fondo estadounidense la compró y la sacó de nuevo.",
        "Con cada cambio, la empresa cargaba con más deuda.",
        "Y el negocio de la comida a domicilio estaba a punto de cambiar por completo.",
    ], [("cap10", 0, -0.6), ("tp_duenos", 0, 1.0), ("tp_2007", 1, 0), ("tp_2019", 2, 0), ("tp_deuda", 3, 0), ("tp_cambio", 4, 0)]),
    ("11. El enemigo se hace socio", [
        "En dos mil dieciocho, Telepizza anunció un acuerdo sorprendente.",
        "Se alió con Pizza Hut, uno de los gigantes a los que había derrotado en España.",
        "Telepizza se convirtió en su franquiciado principal en España y en buena parte de Latinoamérica: abriría y gestionaría los restaurantes de Pizza Hut en esos países.",
        "Los antiguos rivales pasaban a ser socios.",
        "En dos mil veintiuno, el grupo que formaban, junto a otras marcas de pizza, pasó a llamarse Food Delivery Brands.",
    ], [("cap11", 0, -0.6), ("tp_2018", 0, 1.0), ("tp_pizzahut", 1, 0), ("tp_franquiciado", 2, 0), ("tp_socios", 3, 0), ("tp_fdb", 4, 0)]),
    ("12. Las bicis con cajas", [
        "Y entonces llegaron las aplicaciones.",
        "Plataformas de reparto que, con un solo toque en el móvil, traían a casa comida de cualquier restaurante: hamburguesas, sushi, comida india, de todo.",
        "La pandemia aceleró todavía más el cambio: durante meses, pedir comida a casa se convirtió en la forma habitual de salir a cenar.",
        "Telepizza ya no competía solo con otras pizzerías. Competía con toda la oferta de la ciudad.",
        "Y sus repartidores ya no eran los únicos en las calles: ahora había miles de bicis y motos con grandes cajas a la espalda.",
        "La empresa que había inventado en España la comida a domicilio tenía que reinventarse en el negocio que ella misma había creado.",
    ], [("cap12", 0, -0.6), ("tp_apps", 0, 1.0), ("tp_toque", 1, 0), ("tp_pandemia", 2, 0), ("tp_competencia", 3, 0), ("tp_bicis", 4, 0), ("tp_reinventar", 5, 0)]),
    ("13. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: copia lo que funciona fuera, pero adáptalo a tu mercado. La pizza a domicilio era americana; la masa y el nombre, españoles.",
        "Dos: el nombre importa. Pizzaphone no lo pronunciaba nadie. Telepizza lo entendía todo el mundo.",
        "Y tres: en los negocios no hay enemigos eternos. Telepizza ganó a Pizza Hut en España… y acabó siendo su socia.",
    ], [("cap13", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un exiliado cubano, un capitán de Vietnam, un local en el barrio del Pilar, un nombre que nadie pronunciaba y una flota de motos.",
        "La próxima vez que llames para pedir una pizza, ya sabes de dónde viene la costumbre.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Piña en la pizza: sí o no? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("tp_final", 0, 0), ("tp_llamar", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Wikipedia, «Telepizza»", "https://en.wikipedia.org/wiki/Telepizza"),
    ("Wikipedia, «Leopoldo Fernández Pujals»", "https://en.wikipedia.org/wiki/Leopoldo_Fern%C3%A1ndez_Pujals"),
    ("Universitat Pompeu Fabra, caso de estudio sobre Telepizza", "https://www.upf.edu/documents/8356258/8363321/telepizza.pdf/ae55523b-0a50-bc2b-ee12-4dd62d7617eb"),
    ("Universidad de Valladolid, TFG sobre Telepizza", "https://uvadoc.uva.es/bitstream/handle/10324/43838/TFG-J-230.pdf?sequence=1"),
    ("FundingUniverse, «TelePizza S.A. History»", "https://www.fundinguniverse.com/company-histories/telepizza-s-a-history/"),
    ("Merca2, «Telepizza se alía con Pizza Hut y rompe el mercado» (2018)", "https://www.merca2.es/2018/05/16/telepizza-alia-pizza-hut-63193/"),
    ("Leopoldo Fernández Pujals, «Apunta a las estrellas y llegarás a la luna» (Planeta)", "https://www.planetadelibros.com/libro-apunta-a-las-estrellas-y-llegaras-a-la-luna/170052"),
    ("Marketing4eCommerce, «Brief history of Telepizza»", "https://marketing4ecommerce.net/en/brief-and-appetizing-history-of-telepizza-dough-secrets-and-a-succession-of-financial-ups-and-downs/"),
]
DESCRIPCION = ("Telepizza nació en 1987 en el barrio del Pilar de Madrid con otro nombre, Pizzaphone. La fundó Leopoldo Fernández Pujals, nacido en Cuba y "
               "veterano de Vietnam, que enseñó a los españoles a pedir pizza por teléfono y ganó en España a las cadenas americanas. Años después, Telepizza "
               "acabó aliándose con Pizza Hut. Esta es la historia de Telepizza.")
ETIQUETAS = "telepizza, historia de telepizza, leopoldo fernández pujals, pizzaphone, pizza a domicilio, pizza hut, jazztel, food delivery brands, barrio del pilar, historia de marcas, código de barras"
HASHTAGS = "#Telepizza #HistoriaDeMarcas #MarcasEspañolas"
LISTA = "Marcas españolas"
NOTA = "Nota: las fechas de fundación varían ligeramente según la fuente (1987-1988); el papel de cada accionista en la crisis de 1995 se recoge según estudios académicos sobre la empresa."
PREGUNTA = "¿PIÑA EN LA PIZZA: *SÍ O NO*?"
