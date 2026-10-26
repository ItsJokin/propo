"""Banco de 100 ideas para el canal de público general: historias de marcas y productos cotidianos.

Mismo formato que ideas.py: (título, concepto, por qué interesa, gancho, estructura, recursos, dificultad,
diferenciación, riesgo, descubrimiento, evergreen, facilidad, coste €, intención, competencia, comercial, encaje).
TODOS los hechos históricos se verifican con fuentes primarias o hemeroteca antes de producir.
(V) = depende de datos actuales (cuotas, cifras de ventas, propiedad de la empresa).
"""
HIST = "Gancho con el objeto cotidiano → origen → el momento de crisis → la decisión que lo cambió todo → la marca hoy → lección"
DUELO = "La rivalidad en una frase → orígenes paralelos → golpes y contragolpes → quién ganó y por qué → qué queda hoy"
CAIDA = "La cima → las grietas → la decisión fatal → el derrumbe → qué podría haber salvado la empresa"
LISTA = "Pregunta → 5-7 casos ordenados de menos a más sorprendente → patrón común"
EXPL = "Pregunta que todos se han hecho → respuesta corta → explicación con datos → lo que nadie cuenta"
REC = "Motion graphics propios, fotos de archivo con licencia o dominio público, mapas, líneas de tiempo, productos fotografiados por nosotros"
REC_ARCH = "Motion graphics + hemeroteca (citas breves) + fotos de archivo con licencia + gráficos de cifras"

def h(t, c, w, g, est=HIST, rec=REC, d="M", dif="A", r="Verificar fechas y cifras; logotipo solo identificativo",
      desc="A", ev="A", fa="M", co=180, inte="Curiosidad", comp="M", com="M", enc="A"):
    return (t, c, w, g, est, rec, d, dif, r, desc, ev, fa, co, inte, comp, com, enc)

P = [  # 20 prioritarios de lanzamiento
h("Chupa Chups: el caramelo con palo que Dalí convirtió en icono", "De la fábrica familiar a marca global; el logotipo de Dalí", "Todo el mundo lo ha comido; orgullo español", "El logotipo de este caramelo lo dibujó Salvador Dalí en una servilleta… o eso dice la leyenda", comp="B"),
h("La historia de Coca-Cola: de jarabe de farmacia a la marca más famosa del mundo", "Pemberton, Candler, la botella, la publicidad", "Marca universal", "En 1886 se vendía como remedio en una farmacia de Atlanta", comp="A"),
h("New Coke: el mayor error de marketing de la historia", "1985, cambio de fórmula y vuelta en 79 días", "Fracaso épico y lección", "Coca-Cola cambió su fórmula. 79 días después tuvo que pedir perdón", est=CAIDA, comp="M"),
h("Zara: cómo una tienda de A Coruña cambió la forma de vestir del mundo (V)", "Amancio Ortega, modelo de producción rápida", "Marca que todos conocen; curiosidad por Ortega", "Zara no hace publicidad. Y aun así…", rec=REC_ARCH, comp="M", com="A"),
h("Mercadona: la estrategia detrás del supermercado que más vende en España (V)", "Modelo de interproveedores, marca Hacendado", "Lo visitas cada semana", "¿Quién fabrica realmente los productos Hacendado?", est=EXPL, rec=REC_ARCH, r="Datos actualizados de cuota (Kantar); no afirmar fabricantes sin fuente", comp="M", com="A"),
h("Adidas vs Puma: los hermanos que dividieron un pueblo", "Hermanos Dassler, Herzogenaurach", "Rivalidad con historia humana", "Dos hermanos, una fábrica, y un pueblo que dejó de hablarse", est=DUELO, comp="M"),
h("Danone nació en Barcelona: la historia que pocos conocen", "Isaac Carasso, 1919, el nombre del hijo", "Dato sorprendente, orgullo local", "El yogur más famoso del mundo tiene apellido catalán… casi", comp="B"),
h("Nokia: de dominar el mundo a desaparecer de tu bolsillo", "Cima en móviles y caída frente al smartphone", "Nostalgia (todos tuvimos uno)", "En 2007 uno de cada dos móviles era Nokia… y entonces", est=CAIDA, r="Verificar cuotas de mercado históricas", comp="A"),
h("Blockbuster vs Netflix: la reunión que pudo cambiar la historia", "La oferta de compra rechazada", "Mito popular; lección", "Netflix se ofreció a Blockbuster. Se rieron", est=DUELO, r="Separar mito y hechos documentados", comp="A"),
h("Cola Cao vs Nesquik: la guerra del desayuno en España", "Dos marcas, dos estilos, la canción del negrito (contexto histórico)", "Infancia de todos", "La canción que todos conocemos y que hoy no se podría emitir", est=DUELO, r="Tratar con rigor el contenido racial histórico", comp="B"),
h("Por qué la leche está al fondo del supermercado (y otros trucos)", "Diseño de tiendas y psicología del consumidor", "Utilidad + curiosidad", "No es casualidad que tengas que cruzar toda la tienda", est=EXPL, r="Usar estudios citados; evitar mitos", comp="M", inte="Curiosidad"),
h("LEGO: la empresa que casi quiebra por fabricar demasiados juguetes", "Crisis de 2003-2004 y recuperación", "Marca querida", "En 2003 LEGO perdía dinero con cada pieza que vendía", est=CAIDA, comp="M"),
h("IKEA: por qué sus muebles tienen nombres suecos raros", "Sistema de nombres, Kamprad, el modelo de autoservicio", "Pregunta que todos se han hecho", "BILLY, KALLAX, POÄNG… hay un sistema", est=EXPL, comp="M"),
h("Telepizza: auge y caída de la pizza española", "Del éxito a la competencia global (V)", "Nostalgia española", "Hubo un momento en que Telepizza vendía más que nadie en España", est=CAIDA, rec=REC_ARCH, comp="B"),
h("Fanta se inventó en la Alemania nazi: la historia completa", "Escasez de jarabe en la II Guerra Mundial", "Dato chocante, muy compartible", "La Fanta nació porque a Alemania no llegaba Coca-Cola", r="Rigor histórico; evitar sensacionalismo", comp="M"),
h("Nintendo tenía 100 años antes de Mario", "Cartas hanafuda, hoteles, taxis…", "Gamers + público general", "Nintendo empezó vendiendo cartas en 1889", comp="M"),
h("Inventos que nacieron por accidente (y hoy usas cada día)", "Post-it, microondas, Coca-Cola, etc.", "Formato lista muy clicable", "El Post-it fue un pegamento que salió mal", est=LISTA, r="Verificar cada caso; descartar los apócrifos", comp="A"),
h("Pescanova: el fraude que hundió a un gigante del mar", "Contabilidad falsa, concurso de acreedores, juicio", "Escándalo español", "La empresa que todos tenían en el congelador escondía una deuda enorme", est=CAIDA, rec=REC_ARCH, r="Ceñirse a sentencias firmes (derecho al honor)", comp="B"),
h("Red Bull no vende bebidas: vende otra cosa", "Modelo de marketing y deportes extremos", "Marca juvenil", "Red Bull tiene más vídeos que latas en tu nevera… casi", est=EXPL, comp="M"),
h("Las marcas blancas: ¿son lo mismo que las de marca? (V)", "Cómo funcionan, quién fabrica, qué dice la ley de etiquetado", "Ahorro + curiosidad", "Mismo producto, distinta caja. ¿Seguro?", est=EXPL, r="No afirmar fabricantes sin prueba; código de envasador", comp="M", com="A"),
]

E = [  # 30 evergreen
h("McDonald's: la verdadera historia (no la de la película)", "Hermanos McDonald y Ray Kroc", "Marca universal", "Los McDonald no fundaron McDonald's como la conoces", comp="A"),
h("Apple: por qué el logotipo es una manzana mordida", "Del Newton al diseño de Rob Janoff", "Pregunta común", "No es por Newton. O sí, al principio", est=EXPL, comp="A"),
h("El Corte Inglés: el gran almacén que España no deja de visitar (V)", "Ramón Areces, Galerías Preciados, rivalidad", "Institución española", "Hubo una guerra de grandes almacenes en Madrid", est=DUELO, rec=REC_ARCH, comp="B"),
h("Nutella vs Nocilla: la crema que inventó la escasez", "Ferrero en la posguerra, Nocilla española", "Infancia", "Nutella nació porque el chocolate era demasiado caro", est=DUELO, comp="B"),
h("Kinder Sorpresa: por qué está prohibido en Estados Unidos", "Normativa sobre juguetes en alimentos", "Dato sorprendente", "En EE. UU. llevar un Kinder Sorpresa podía causar problemas en la aduana", est=EXPL, r="Verificar normativa vigente", comp="M"),
h("Pepsi casi compra Coca-Cola… y Coca-Cola casi compra Pepsi", "Episodios de quiebra de Pepsi", "Rivalidad eterna", "Pepsi quebró más de una vez antes de ser Pepsi", est=DUELO, r="Verificar episodios con fuentes", comp="M"),
h("Kodak inventó la cámara digital y la escondió", "El dilema del innovador", "Lección famosa", "El ingeniero de Kodak que inventó el futuro… y lo guardaron en un cajón", est=CAIDA, comp="A"),
h("Seat: la historia del coche de todos los españoles", "Seat 600, Fiat, Volkswagen", "Nostalgia", "El 600 no era un coche, era un miembro de la familia", rec=REC_ARCH, r="Imágenes de archivo con licencia", comp="M"),
h("Barbie: la muñeca más polémica de la historia", "Ruth Handler, Bild Lilli, polémicas", "Público amplio", "Barbie se inspiró en una muñeca alemana para adultos", comp="M"),
h("Monopoly se inventó para criticar a los monopolios", "Lizzie Magie y The Landlord's Game", "Ironía histórica", "El juego que celebra hacerse rico se creó para criticarlo", comp="M"),
h("Mango: la otra gran marca de moda española (V)", "Isak Andic, expansión", "Moda", "Empezó con una tienda en el Paseo de Gracia", rec=REC_ARCH, comp="B"),
h("Bimbo: cómo una panadería mexicana conquistó el mundo (V)", "Grupo Bimbo, compra de marcas", "Público latinoamericano y español", "El pan de molde de tu desayuno puede ser mexicano", rec=REC_ARCH, comp="B"),
h("Inca Kola: el refresco que derrotó a Coca-Cola en Perú", "La bebida amarilla y el acuerdo con Coca-Cola", "Orgullo latinoamericano", "Coca-Cola no pudo con ella… así que se asoció", est=DUELO, r="Verificar el acuerdo y los porcentajes", comp="B"),
h("Corona: la cerveza mexicana que se volvió global", "Grupo Modelo, expansión, AB InBev", "Marca reconocible", "Del Pacífico mexicano a todos los bares del mundo", comp="M"),
h("Gillette y el truco de vender barato para ganar caro", "Modelo de cuchilla y recambio", "Explicación de negocio sencilla", "Te regalan la impresora, te cobran la tinta. Empezó con una cuchilla", est=EXPL, comp="M"),
h("Starbucks: por qué el café cuesta tanto", "Modelo de tercer lugar, precios", "Debate popular", "No pagas el café. Pagas otra cosa", est=EXPL, comp="A"),
h("Ferrari vs Lamborghini: un insulto que creó una marca", "Ferruccio y Enzo", "Coches + rivalidad", "Un fabricante de tractores se quejó a Enzo Ferrari…", est=DUELO, r="Separar leyenda y hechos", comp="A"),
h("Freixenet: las burbujas que vendieron Navidad", "Cava, anuncios navideños", "Estacional (diciembre)", "Durante años, la Navidad en España empezaba con un anuncio", rec=REC_ARCH, comp="B"),
h("Tupperware: auge y caída de las fiestas en casa", "Venta directa y quiebra (V)", "Nostalgia familiar", "El táper más famoso del mundo acabó en los tribunales", est=CAIDA, comp="M"),
h("Pokémon: el negocio de entretenimiento más rentable de la historia (V)", "Franquicia multimedia", "Público joven y adulto", "Pokémon ha ingresado más que Star Wars y Marvel… según varias estimaciones", r="Cifras: citar fuente y que son estimaciones", comp="A"),
h("Tetra Pak: el envase que está en tu nevera", "Ruben Rausing, innovación", "Objeto cotidiano invisible", "Lo tocas cada día y no sabes su historia", comp="B"),
h("Rolex: por qué un reloj puede costar como un coche", "Marca, escasez, reventa", "Lujo accesible a la curiosidad", "Hay lista de espera para gastar 10.000 €", est=EXPL, comp="M"),
h("Hello Kitty no es una gata (y otros secretos de Sanrio)", "Personaje y licencias", "Viral", "Sanrio dijo que no es una gata. Internet enloqueció", comp="M"),
h("Nike: de vender zapatillas en un coche a dominar el deporte", "Phil Knight, Onitsuka, Jordan", "Marca universal", "Phil Knight vendía zapatillas desde el maletero", comp="A"),
h("BlackBerry: el móvil que tenían todos los ejecutivos", "Caída frente al iPhone", "Nostalgia", "El presidente de EE. UU. no quería soltarla", est=CAIDA, comp="M"),
h("Burger King vs McDonald's: la guerra de las hamburguesas", "Publicidad comparativa", "Rivalidad", "El anuncio que te mandaba a McDonald's para comprar en Burger King", est=DUELO, comp="M"),
h("Mahou, Estrella, Damm: el mapa de la cerveza en España (V)", "Cerveceras regionales", "Identidad regional", "Dime qué cerveza pides y te diré de dónde eres", est=EXPL, rec=REC_ARCH, comp="B"),
h("Por qué los productos cuestan 9,99 € (psicología de precios)", "Precios psicológicos", "Utilidad", "Ese céntimo cambia lo que compras", est=EXPL, r="Citar estudios", comp="M"),
h("Los logotipos más famosos y su significado oculto", "FedEx, Toblerone, Amazon…", "Formato lista viral", "¿Ves la flecha?", est=LISTA, comp="A"),
h("Kellogg's: los cereales que nacieron en un sanatorio", "John Harvey Kellogg y su hermano", "Historia extraña", "Los Corn Flakes se inventaron con una intención muy distinta", r="Rigor histórico", comp="M"),
]

X = [  # 20 experimentales
h("Probamos 10 productos de marca blanca vs marca a ciegas", "Cata a ciegas con voces de participantes", "Entretenimiento + utilidad", "El resultado del yogur nos sorprendió", est=LISTA, rec="Producto propio grabado (manos), gráficos", fa="B", co=120, r="Resultados como opinión; no difamar", comp="M", com="A"),
h("La marca que más odias en España (encuesta a suscriptores)", "Contenido de comunidad", "Participación", "Vosotros votasteis", est=LISTA, co=100, comp="B"),
h("Short-serie: 'Esta marca en 60 segundos'", "Shorts", "Descubrimiento", "En 60 segundos, la historia de…", est="Dato chocante → 3 hitos → cierre", co=20, inte="Curiosidad", comp="A", com="B"),
h("Qué pasó con estas marcas que desaparecieron de España", "Nostalgia: Pryca, Continente, Galerías Preciados… (V)", "Nostalgia muy fuerte", "¿Te acuerdas de…?", est=LISTA, rec=REC_ARCH, comp="B"),
h("Así sería tu casa sin productos inventados en España", "Fregona, chupa chups, futbolín… (verificar cada uno)", "Orgullo", "Mira tu cocina: hay más España de la que crees", est=LISTA, r="Muchos 'inventos españoles' son discutidos: aclarar", comp="M"),
h("El precio de una Coca-Cola desde 1950 hasta hoy", "Inflación explicada con un producto", "Divulgación económica accesible", "Lo que costaba un refresco cuando tus abuelos eran jóvenes", est=EXPL, r="Fuentes de precios históricos", comp="B"),
h("Tierlist de los mejores anuncios de la televisión española", "Ranking", "Nostalgia; comentarios", "Ponemos nota a los anuncios que marcaron tu infancia", est=LISTA, r="Uso de fragmentos de anuncios: riesgo de copyright; usar descripciones y fotogramas mínimos citados", d="M", comp="B"),
h("Cómo nace un producto en un supermercado (de la idea a la estantería)", "Proceso explicado", "Curiosidad", "Este yogur tardó 2 años en llegar a la estantería", est=EXPL, comp="B"),
h("Las 5 marcas más antiguas del mundo que siguen abiertas", "Empresas centenarias", "Lista", "Esta empresa tiene más de 1.000 años", est=LISTA, r="Verificar fechas", comp="M"),
h("La guerra de los supermercados: Mercadona, Lidl, Carrefour, Dia (V)", "Estrategias comparadas", "Lo vives cada semana", "Cada uno quiere que compres de forma distinta", est=DUELO, rec=REC_ARCH, comp="M", com="A"),
h("Marcas que cambiaron de nombre (y por qué)", "Rebrandings", "Lista viral", "Tu marca favorita antes se llamaba…", est=LISTA, comp="M"),
h("Qué empresa es dueña de todo lo que hay en tu nevera (V)", "Grandes grupos de alimentación", "Revelación", "Abre tu nevera: 10 marcas, 3 dueños", est=EXPL, r="Propiedad actualizada", comp="M"),
h("La historia de los Phoskitos, Bollycao y la merienda española de los 90", "Nostalgia de la bollería industrial", "Nostalgia", "La merienda que llevaba cromos", rec=REC_ARCH, comp="B"),
h("La marca más valiosa del mundo en 2026 (V)", "Rankings de marcas (Kantar, Interbrand)", "Actualidad evergreen anual", "El número 1 te sorprenderá… o no", est=LISTA, r="Citar ranking y metodología", comp="M"),
h("¿Por qué Amazon perdió dinero durante años y aun así ganó?", "Estrategia", "Curiosidad económica", "Perder dinero a propósito durante años", est=EXPL, comp="A"),
h("El día que una marca pidió perdón: las disculpas más famosas", "Crisis de reputación", "Drama", "Este tuit les costó millones", est=LISTA, comp="M"),
h("Historias de marcas latinoamericanas: Oxxo, Rappi, Mercado Libre (V)", "Serie LatAm", "Ampliar audiencia", "La tienda que está en cada esquina de México", rec=REC_ARCH, comp="B"),
h("Reacciono a vuestras teorías sobre marcas (con voz, sin cara)", "Comunidad", "Fidelidad", "Habéis escrito cosas increíbles", est=LISTA, co=80, comp="B", com="B"),
h("La fórmula secreta de Coca-Cola: ¿mito o realidad?", "Secreto comercial como marketing", "Misterio", "Está en una cámara acorazada… para que la veas", est=EXPL, comp="M"),
h("Marcas que nacieron en un garaje", "Apple, Google, Harley… (verificar)", "Inspiración", "El garaje más caro de la historia", est=LISTA, comp="A"),
]

F = [  # 20 de profundización
h("Inditex: documental completo (40 min)", "Vídeo pilar", "Maratón", "La historia completa de la mayor empresa de moda del mundo", rec=REC_ARCH, d="A", co=350, comp="M", com="A"),
h("La crisis de Rumasa: la expropiación más famosa de España", "Ruiz-Mateos, 1983", "Historia económica española", "Un gobierno se quedó con 700 empresas en una noche", est=CAIDA, rec=REC_ARCH, d="A", r="Rigor; personas fallecidas y vivas; honor", co=250, comp="B"),
h("Fórum Filatélico y Afinsa: el fraude de los sellos", "Estafa piramidal", "Muchos afectados; memoria colectiva", "Miles de familias invirtieron en sellos", est=CAIDA, rec=REC_ARCH, d="A", r="Sentencias firmes", co=250, comp="B"),
h("Cómo funciona la publicidad que ves (y por qué funciona)", "Psicología publicitaria", "Divulgación", "Tu cerebro decide antes que tú", est=EXPL, d="M", co=200, comp="M"),
h("La historia del supermercado: de la tienda de barrio al autoservicio", "Historia del comercio", "Contexto general", "Antes, alguien te traía cada producto", d="M", co=200, comp="B"),
h("Coca-Cola en España: 70 años de historia (V)", "Llegada, fábricas, anuncios", "Local", "Llegó a España en los años 50…", rec=REC_ARCH, r="Contrastar con fuentes independientes, no solo corporativas", comp="B"),
h("Disney: cómo un ratón construyó un imperio", "Documental largo", "Universal", "Todo empezó con un conejo que le robaron", d="A", co=300, r="Imágenes de Disney: NO usar fotogramas; ilustración propia", comp="A"),
h("La historia de la marca más copiada del mundo", "Falsificaciones (Louis Vuitton/Nike…)", "Curiosidad", "La marca que más dinero pierde por copias", d="M", co=200, comp="M"),
h("Samsung: de vender pescado a fabricar tu móvil", "Origen como comercializadora", "Sorpresa", "Samsung empezó vendiendo pescado seco y fideos", d="M", co=200, r="Verificar origen", comp="M"),
h("Toyota y el sistema que copió medio mundo", "Producción ajustada", "Divulgación de negocio", "La cuerda que cualquier trabajador podía tirar", est=EXPL, d="M", co=200, comp="M"),
h("Las marcas españolas más valiosas (V)", "Ranking comentado", "Orgullo", "Hay una que no esperas en el top", est=LISTA, rec=REC_ARCH, co=180, comp="B"),
h("La guerra del streaming explicada", "Netflix, Disney+, Max, etc. (V)", "Lo usas", "Por qué pagas cada vez más", est=DUELO, co=200, comp="A"),
h("El Gordo: cómo funciona el negocio de la Lotería de Navidad", "Estacional", "Pico de diciembre", "¿Quién gana realmente con la Lotería?", est=EXPL, r="Datos de SELAE", co=180, comp="M"),
h("La historia de las rebajas en España", "Estacional enero/julio", "Comercio", "Las rebajas tenían fechas fijadas por ley", est=EXPL, r="Normativa histórica", co=150, comp="B"),
h("Del 600 al coche eléctrico: la industria del automóvil en España", "Documental", "Industria", "España fabrica más coches de los que imaginas", d="A", co=300, comp="B"),
h("Por qué todas las marcas están cambiando sus logotipos a lo simple", "Tendencia de diseño", "Diseño", "Mira estos logotipos de antes y de ahora", est=EXPL, co=150, comp="M"),
h("El imperio de Ferrero", "Nutella, Kinder, Ferrero Rocher", "Marcas queridas", "La familia más discreta del chocolate", d="M", co=200, comp="M"),
h("Cómo se hace un anuncio de Navidad que te hace llorar", "Publicidad emocional (Lotería, Campofrío…)", "Estacional", "Hay una fórmula para hacerte llorar", est=EXPL, r="No usar fragmentos largos de anuncios", co=150, comp="B"),
h("La caída de Dia: del supermercado de barrio al rescate (V)", "Crisis financiera", "Actualidad económica", "Un supermercado que casi desaparece", est=CAIDA, rec=REC_ARCH, r="Datos actuales", co=200, comp="B"),
h("Las marcas que sobrevivieron a una guerra", "Historia y empresas", "Narrativa potente", "Fabricaban caramelos mientras caían bombas", est=LISTA, d="A", co=250, comp="B"),
]

C = [  # 10 con potencial comercial o de patrocinio
h("Las mejores apps para ahorrar en el supermercado (V)", "Utilidad patrocinable", "Ahorro", "Ahorré X € en un mes (cifra real del test)", est=LISTA, r="Transparencia de patrocinio", inte="Problema", com="A", comp="M"),
h("Los 10 libros sobre marcas que deberías leer", "Afiliación Amazon", "Recomendación", "El libro que explica por qué compras lo que compras", est=LISTA, co=80, com="A", comp="B"),
h("Merchandising del canal: la historia de nuestro logotipo", "Producto propio (año 2)", "Comunidad", "Hicimos lo que criticamos en todos los vídeos", co=60, com="A", comp="B", desc="B"),
h("Cómo invertir en las marcas que usas (explicación, no recomendación) (V)", "Patrocinio de bróker con cumplimiento normativo", "Interés por la bolsa", "Puedes ser dueño de un trozo de tu marca favorita", est=EXPL, r="CNMV: sin recomendaciones; avisos de riesgo", com="A", comp="M"),
h("Tarjetas de fidelización: ¿te ahorran dinero o te espían? (V)", "Datos personales y ofertas", "Ahorro y privacidad", "Esa tarjeta sabe más de ti que tu familia", est=EXPL, r="RGPD", com="A", comp="M"),
h("Juegos de mesa sobre negocios: los probamos", "Afiliación", "Ocio", "El Monopoly no es el mejor", est=LISTA, co=120, com="A", comp="B"),
h("El curso de marketing que te enseña lo que hacen estas marcas (patrocinio)", "Patrocinio de plataforma educativa", "Aprendizaje", "Lo que hacen las grandes marcas, aplicado a tu idea", est=EXPL, com="A", comp="M"),
h("Las mejores marcas de café de supermercado: cata a ciegas", "Afiliación/patrocinio", "Consumo", "El más barato quedó segundo", est=LISTA, fa="B", co=120, r="Opinión, no difamación", com="A", comp="M"),
h("Cómo crear una marca desde cero (lo que aprendimos de 50 historias)", "Recopilatorio + producto (guía en PDF)", "Emprendedores", "50 historias, 7 patrones", est=LISTA, co=150, com="A", comp="M"),
h("Edición especial patrocinada: la historia de una marca española que quiera contarse", "Contenido de marca (branded) etiquetado", "Contenido patrocinado transparente", "Esta marca nos abrió sus archivos", r="Etiquetar como contenido patrocinado; independencia editorial", com="A", comp="B", desc="M"),
]

CATEGORIAS = [("Prioritarios de lanzamiento", P), ("Evergreen", E), ("Experimentales", X), ("Profundización", F), ("Potencial comercial o patrocinio", C)]

def tabla_md():
    out, n = [], 0
    for nombre, lista in CATEGORIAS:
        out.append(f"\n### {nombre} ({len(lista)})\n")
        out.append("| # | Título provisional | Concepto | Por qué interesa | Gancho | Estructura | Recursos | Dific. | Diferenc. | Riesgos | Desc. | Everg. | Facil. | Coste € | Intención | Comp. | Comercial | Encaje |")
        out.append("|" + "---|" * 18)
        for i in lista:
            n += 1
            out.append(f"| {n} | " + " | ".join(str(x) for x in i) + " |")
    assert n == 100, n
    return "\n".join(out)
