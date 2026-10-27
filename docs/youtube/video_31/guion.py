"""Guion del vídeo 31 de Código de Barras (formato largo): BlackBerry."""
TITULO = "BlackBerry: el móvil que lo tenía todo… y lo perdió todo"
TITULOS_ALT = ["La historia de BlackBerry (y por qué se llama así)", "Cómo el iPhone hundió a BlackBerry"]
MARCA = "BlackBerry"
SEGMENTOS = [
    ("Introducción", [
        "Hubo un tiempo en que llevar un móvil con un pequeño teclado lleno de botones era señal de importancia.",
        "Lo llevaban ejecutivos, periodistas, políticos… y hasta el presidente de los Estados Unidos.",
        "Era tan adictivo que le pusieron un mote que un diccionario eligió como palabra del año.",
        "Su nombre nació, según la agencia que lo creó, de una fresa que parecía demasiado lenta.",
        "Y en pocos años pasó de dominar el mercado a casi desaparecer.",
        "Esta es la historia de BlackBerry.",
    ], [("bb_teclado", 0, 0), ("bb_quien", 1, 0), ("bb_mote", 2, 0), ("bb_fresa", 3, 0), ("bb_caida", 4, 0), ("bb_historia", 5, 0)]),
    ("1. Dos amigos de Waterloo", [
        "Waterloo, en la provincia canadiense de Ontario, mil novecientos ochenta y cuatro.",
        "Mike Lazaridis era un estudiante de ingeniería eléctrica. Había nacido en Estambul, en una familia de origen griego que emigró a Canadá cuando él era niño.",
        "Desde pequeño desmontaba aparatos. De adolescente ya construía sus propios circuitos.",
        "Junto a un amigo de la infancia, Douglas Fregin, fundó una pequeña empresa con un nombre muy serio: Research In Motion. Investigación en movimiento.",
        "Al principio hacían un poco de todo: pantallas para fábricas, sistemas para leer códigos en películas de cine, consultoría.",
        "Pero a Lazaridis le obsesionaba una idea: enviar datos sin cables.",
    ], [("cap1", 0, -0.6), ("bb_waterloo", 0, 1.0), ("bb_lazaridis", 1, 0), ("bb_circuitos", 2, 0), ("bb_rim", 3, 0), ("bb_todo", 4, 0), ("bb_sincables", 5, 0)]),
    ("2. El vendedor", [
        "Research In Motion tenía buenos ingenieros. Lo que no tenía era alguien que supiera vender.",
        "Ese alguien fue Jim Balsillie, un canadiense con formación en negocios y mucha ambición.",
        "En mil novecientos noventa y dos entró en la empresa, puso dinero de su bolsillo, y, según se cuenta, llegó a hipotecar su casa para hacerlo.",
        "Desde entonces la dirigieron entre los dos, como consejeros delegados a la vez.",
        "Lazaridis se ocupaba de la tecnología. Balsillie, del dinero, los contratos y las operadoras.",
        "Era una pareja extraña. Pero durante años funcionó como un reloj.",
    ], [("cap2", 0, -0.6), ("bb_vender", 0, 1.0), ("bb_balsillie", 1, 0), ("bb_hipoteca", 2, 0), ("bb_dos", 3, 0), ("bb_reparto", 4, 0), ("bb_reloj", 5, 0)]),
    ("3. El correo en el bolsillo", [
        "En los noventa, el correo electrónico se leía en el ordenador de la oficina. Si salías, te quedabas desconectado.",
        "Research In Motion empezó fabricando buscapersonas que podían enviar y recibir mensajes de dos vías.",
        "Y en mil novecientos noventa y nueve lanzó un aparato que cambió todo: un buscapersonas que recibía tu correo de empresa, al instante, estuvieras donde estuvieras.",
        "No tenías que ir a buscar los mensajes. Te llegaban solos, empujados desde el servidor.",
        "Tenía un teclado diminuto para escribir con los pulgares, una batería que duraba días y un sistema muy seguro.",
        "Para un ejecutivo, era como llevar la oficina en el bolsillo.",
    ], [("cap3", 0, -0.6), ("bb_oficina", 0, 1.0), ("bb_busca", 1, 0), ("bb_1999", 2, 0), ("bb_push", 3, 0), ("bb_pulgares", 4, 0), ("bb_bolsillo", 5, 0)]),
    ("4. La fresa lenta", [
        "Pero aquel aparato necesitaba un nombre.",
        "La empresa contrató a Lexicon, una agencia de California especializada en crear nombres de marcas, la misma que había bautizado al procesador Pentium.",
        "Según contó la propia agencia, alguien se fijó en que las teclas pequeñitas del aparato parecían las semillas de una fresa.",
        "Escribieron fresa en la pizarra. Pero a alguien le pareció una palabra lenta, pesada. Y en un producto que prometía rapidez, eso no encajaba.",
        "Entonces alguien propuso otra fruta: la mora. En inglés, blackberry.",
        "Según el fundador de la agencia, a los directivos al principio les pareció una locura. Pero el nombre se quedó.",
        "Una fruta. Simpática, fácil de recordar, y muy distinta de los nombres fríos y técnicos de la competencia.",
    ], [("cap4", 0, -0.6), ("bb_nombre", 0, 1.0), ("bb_lexicon", 1, 0), ("bb_semillas", 2, 0), ("bb_lenta", 3, 0), ("bb_mora", 4, 0), ("bb_locura", 5, 0), ("bb_fruta", 6, 0)]),
    ("5. CrackBerry", [
        "En dos mil dos llegaron los primeros BlackBerry que también eran teléfono.",
        "Y la marca empezó a extenderse por bancos, despachos de abogados, redacciones y gobiernos.",
        "La gente lo miraba en las reuniones, en la cena, en la cama. Era casi imposible soltarlo.",
        "Por eso le pusieron un mote: CrackBerry, mezclando el nombre de la marca con el de una droga muy adictiva.",
        "La palabra tuvo tanto éxito que un diccionario estadounidense la eligió como palabra del año en dos mil seis.",
        "Tener un BlackBerry era señal de que eras alguien importante. Alguien a quien había que poder localizar a todas horas.",
    ], [("cap5", 0, -0.6), ("bb_telefono", 0, 1.0), ("bb_bancos", 1, 0), ("bb_soltar", 2, 0), ("bb_crackberry", 3, 0), ("bb_palabra", 4, 0), ("bb_importante", 5, 0)]),
    ("6. A punto de apagarse", [
        "Pero en plena euforia, BlackBerry estuvo a punto de apagarse en Estados Unidos. Y no por culpa de la competencia, sino de un juez.",
        "Una pequeña empresa llamada NTP, que casi no fabricaba nada, aseguraba tener patentes sobre el envío de correo sin cables.",
        "Llevó a Research In Motion a los tribunales. Y ganó.",
        "Durante meses, existió la posibilidad real de que un juez ordenara cortar el servicio de BlackBerry en todo el país.",
        "Los usuarios, entre ellos muchos empleados del gobierno, empezaron a ponerse nerviosos.",
        "En marzo de dos mil seis, la empresa decidió zanjar el asunto: pagó a NTP más de seiscientos millones de dólares.",
        "Fue carísimo. Pero BlackBerry siguió funcionando.",
    ], [("cap6", 0, -0.6), ("bb_apagarse", 0, 1.0), ("bb_ntp", 1, 0), ("bb_juicio", 2, 0), ("bb_corte", 3, 0), ("bb_nervios", 4, 0), ("bb_pago", 5, 0), ("bb_sigue", 6, 0)]),
    ("7. El presidente no lo suelta", [
        "El ejemplo más famoso llegó en dos mil nueve.",
        "Barack Obama, recién elegido presidente de Estados Unidos, era un usuario muy aficionado a su BlackBerry.",
        "Y los servicios de seguridad no querían que el presidente usara un aparato así. Temían que pudieran interceptarlo.",
        "Según contó la prensa estadounidense, Obama insistió tanto que acabó consiguiendo quedarse con uno, adaptado con medidas de seguridad especiales.",
        "No había mejor anuncio posible: el hombre más poderoso del mundo no quería separarse de su BlackBerry.",
    ], [("cap7", 0, -0.6), ("bb_2009", 0, 1.0), ("bb_obama", 1, 0), ("bb_seguridad", 2, 0), ("bb_insiste", 3, 0), ("bb_anuncio", 4, 0)]),
    ("8. Los jóvenes también", [
        "Y entonces pasó algo que la empresa no había planeado: los adolescentes también lo querían.",
        "La razón tenía nombre: BlackBerry Messenger, una aplicación para enviar mensajes gratis entre aparatos de la marca.",
        "Años antes de que WhatsApp se hiciera popular, podías chatear sin pagar por cada mensaje, ver cuándo lo habían leído y compartir tu código personal con los amigos.",
        "En muchos países, pedir el PIN del BlackBerry se volvió una forma de ligar.",
        "Hacia dos mil nueve, BlackBerry tenía alrededor de una quinta parte de todo el mercado mundial de teléfonos inteligentes.",
        "Parecía imparable.",
    ], [("cap8", 0, -0.6), ("bb_jovenes", 0, 1.0), ("bb_bbm", 1, 0), ("bb_whatsapp", 2, 0), ("bb_pin", 3, 0), ("bb_cuota", 4, 0), ("bb_imparable", 5, 0)]),
    ("9. Un teléfono sin teclas", [
        "Pero en enero de dos mil siete, en San Francisco, Steve Jobs presentó el iPhone.",
        "No tenía teclado físico. Toda la parte delantera era una pantalla táctil.",
        "Según se cuenta, en Research In Motion muchos no se lo tomaron en serio: la batería duraba poco, escribir en un cristal parecía incómodo y la seguridad no convencía a las empresas.",
        "Además, ellos tenían a los clientes que importaban: los profesionales y los gobiernos.",
        "Lo que no vieron venir es que el iPhone no iba dirigido a las empresas. Iba dirigido a las personas.",
        "Y cuando las personas tuvieron un iPhone, empezaron a pedir que les dejaran usarlo también en el trabajo.",
        "Al año siguiente, además, apareció el primer móvil con Android. La competencia ya no era una. Eran dos.",
    ], [("cap9", 0, -0.6), ("bb_iphone", 0, 1.0), ("bb_pantalla", 1, 0), ("bb_serio", 2, 0), ("bb_clientes", 3, 0), ("bb_personas", 4, 0), ("bb_trabajo", 5, 0), ("bb_android", 6, 0)]),
    ("10. Tarde y mal", [
        "BlackBerry intentó reaccionar.",
        "Lanzó su propio móvil con pantalla táctil, pero recibió muchas críticas: era lento y tenía una pantalla que había que presionar como un botón.",
        "En dos mil once sacó una tableta, la PlayBook, para competir con el iPad. Al principio ni siquiera traía su propia aplicación de correo.",
        "Y ese mismo año, en octubre, su red sufrió una caída que dejó a millones de usuarios de todo el mundo sin correo ni mensajes durante varios días.",
        "Para una marca cuya gran promesa era estar siempre conectado, fue un golpe durísimo.",
    ], [("cap10", 0, -0.6), ("bb_reacciona", 0, 1.0), ("bb_storm", 1, 0), ("bb_playbook", 2, 0), ("bb_apagon", 3, 0), ("bb_golpe", 4, 0)]),
    ("11. Cuesta abajo", [
        "En dos mil doce, Lazaridis y Balsillie dejaron la dirección de la empresa.",
        "Al año siguiente, Research In Motion cambió su nombre por el de su producto estrella: BlackBerry.",
        "Lanzó un sistema operativo nuevo y teléfonos modernos. Pero llegaban años tarde. Los usuarios ya se habían ido, y las aplicaciones también.",
        "La cuota de mercado cayó sin parar, hasta quedarse prácticamente en cero.",
        "En dos mil dieciséis, la empresa anunció que dejaría de diseñar sus propios teléfonos.",
        "Y en enero de dos mil veintidós apagó los servicios de sus antiguos sistemas. Los BlackBerry clásicos dejaron de funcionar como antes.",
        "Hoy la empresa sigue existiendo, pero se dedica al software y a la ciberseguridad.",
    ], [("cap11", 0, -0.6), ("bb_dejan", 0, 1.0), ("bb_renombre", 1, 0), ("bb_bb10", 2, 0), ("bb_cero", 3, 0), ("bb_2016", 4, 0), ("bb_2022", 5, 0), ("bb_hoy", 6, 0)]),
    ("12. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: un buen nombre puede venir de un detalle tonto. Unas teclas que parecían semillas.",
        "Dos: lo que te hace fuerte puede atarte. El teclado y los clientes de empresa fueron su éxito… y su trampa.",
        "Y tres: el peligro no siempre viene de tu competencia directa. A BlackBerry no la hundió otro móvil para ejecutivos, sino un teléfono pensado para todo el mundo.",
    ], [("cap12", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Dos amigos de Waterloo, un vendedor que hipotecó su casa, una fresa demasiado lenta, un presidente que no lo soltaba y un teléfono sin teclas.",
        "La próxima vez que escribas en la pantalla de tu móvil, acuérdate de cuando los pulgares pulsaban botones.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Tuviste un BlackBerry? ¿Te acuerdas de tu PIN? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("bb_final", 0, 0), ("bb_pulgar", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("The Canadian Encyclopedia, «BlackBerry Limited»", "https://www.thecanadianencyclopedia.ca/en/article/blackberry-limited"),
    ("Global News, «RIM's rise and fall: a short history of Research In Motion»", "https://globalnews.ca/news/384832/rims-rise-and-fall-a-short-history-of-research-in-motion/"),
    ("Lexicon Branding, «Famous Names» (The New Yorker)", "https://www.lexiconbranding.com/famous-names-the-new-yorker/"),
    ("Gulf News, «Timeline: The rise and fall of BlackBerry»", "https://gulfnews.com/technology/timeline-the-rise-and-fall-of-blackberry-1.1219653"),
    ("Statista, «RIM's smartphone market share since 2007»", "https://www.statista.com/statistics/12863/rims-smartphone-market-share-since-2007"),
    ("Mobile Marketing Magazine, «Zero per cent and falling: the decline of BlackBerry»", "https://mobilemarketingmagazine.com/viewpoint-zero-per-cent-and-falling-the-decline-of-blackberry/"),
    ("Wikipedia, «NTP, Inc.» (demanda contra RIM)", "https://en.wikipedia.org/wiki/NTP,_Inc."),
    ("J. McNish y S. Silcoff, «Losing the Signal» (2015)", ""),
]
DESCRIPCION = ("BlackBerry nació de Research In Motion, una pequeña empresa fundada en 1984 en Waterloo (Canadá) por Mike Lazaridis y Douglas Fregin. "
               "Su nombre salió, según la agencia Lexicon, de unas teclas que parecían semillas de fresa. Llegó a ser tan adictivo que lo llamaron «CrackBerry»… "
               "hasta que llegó un teléfono sin teclas. Esta es la historia de BlackBerry.")
ETIQUETAS = "blackberry, historia de blackberry, research in motion, mike lazaridis, jim balsillie, crackberry, bbm, iphone, obama blackberry, historia de marcas, código de barras"
HASHTAGS = "#BlackBerry #HistoriaDeMarcas #Tecnología"
LISTA = "Gigantes tecnológicos"
NOTA = "Nota: la historia del nombre procede de la propia agencia Lexicon; las cifras de cuota de mercado varían ligeramente según la fuente."
PREGUNTA = "¿TUVISTE *UN BLACKBERRY*?"
