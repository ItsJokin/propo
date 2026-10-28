"""Guion del vídeo 46 de Código de Barras (especial Navidad, formato largo): Coca-Cola y Papá Noel."""
ESPECIAL = "NAVIDAD"
TITULO = "Especial Navidad: ¿Coca-Cola vistió a Papá Noel de rojo?"
TITULOS_ALT = ["Especial Navidad: el mito de Coca-Cola y Papá Noel", "Especial Navidad: cómo Coca-Cola se adueñó de Papá Noel"]
MARCA = "Coca_Cola_Papa_Noel"
SEGMENTOS = [
    ("Introducción", [
        "Bienvenido al especial de Navidad de Código de Barras.",
        "Un señor gordo, con barba blanca, mejillas sonrosadas y un traje rojo con ribetes blancos.",
        "Seguro que alguna vez te han contado que Papá Noel viste de rojo porque lo decidió Coca-Cola, para que llevara los colores de la marca.",
        "Es una de las historias de marketing más repetidas del mundo. Y es falsa.",
        "Pero, como pasa con los buenos mitos, tiene una parte de verdad. Porque Coca-Cola sí hizo algo con Papá Noel que cambió para siempre cómo lo imaginamos.",
        "Hoy te contamos la historia completa.",
    ], [("pn_especial", 0, 0), ("pn_retrato", 1, 0), ("pn_mito", 2, 0), ("pn_falsa", 3, 0), ("pn_verdad", 4, 0), ("pn_historia", 5, 0)]),
    ("1. Un obispo de Turquía", [
        "Para entender a Papá Noel hay que viajar muy atrás. Al siglo cuarto.",
        "En Mira, una ciudad de la actual Turquía, vivía un obispo llamado Nicolás.",
        "Según las leyendas, era muy generoso, sobre todo con los niños y los pobres. Una de ellas cuenta que dejó en secreto monedas de oro en una casa para que tres hermanas pudieran casarse.",
        "Con el tiempo se convirtió en San Nicolás, uno de los santos más populares de Europa. Patrón de los niños, de los marineros y de muchas ciudades.",
        "En los Países Bajos lo llamaban Sinterklaas. Y allí la tradición de que San Nicolás trajera regalos a los niños se mantuvo durante siglos.",
        "Cuando los holandeses emigraron a Nueva York, se llevaron a Sinterklaas con ellos. Y en inglés, poco a poco, Sinterklaas se convirtió en Santa Claus.",
    ], [("cap1", 0, -0.6), ("pn_siglo", 0, 1.0), ("pn_mira", 1, 0), ("pn_monedas", 2, 0), ("pn_santo", 3, 0), ("pn_sinterklaas", 4, 0), ("pn_santaclaus", 5, 0)]),
    ("2. Un poema y unos renos", [
        "Pero aquel Santa Claus no se parecía mucho al de hoy.",
        "A veces era alto y delgado, a veces un duende pequeño, a veces un señor serio con ropas de obispo.",
        "Todo empezó a cambiar en mil ochocientos veintitrés, con un poema publicado en un periódico de Nueva York: Una visita de San Nicolás.",
        "Según la versión más extendida, su autor fue Clement Clarke Moore, un profesor que lo escribió para sus hijos.",
        "Aquel poema describía a un San Nicolás alegre y regordete, que viajaba en un trineo tirado por ocho renos y entraba en las casas por la chimenea.",
        "Muchas de las ideas que hoy asociamos a Papá Noel nacieron de esos versos.",
        "Incluso los nombres de los renos: Dasher, Dancer, Prancer, Vixen… Ocho renos. El más famoso de todos, el de la nariz roja, no estaba en el poema: llegaría más de un siglo después, y también nació de la publicidad.",
    ], [("cap2", 0, -0.6), ("pn_noparecia", 0, 1.0), ("pn_formas", 1, 0), ("pn_poema", 2, 0), ("pn_moore", 3, 0), ("pn_renos", 4, 0), ("pn_versos", 5, 0), ("pn_nombres", 6, 0)]),
    ("3. El dibujante del traje rojo", [
        "Faltaba ponerle cara. Y eso lo hizo un dibujante: Thomas Nast.",
        "Nast trabajaba para Harper's Weekly, una de las revistas más leídas de Estados Unidos.",
        "A partir de los años sesenta del siglo diecinueve, en plena guerra civil estadounidense, empezó a dibujar a Santa Claus cada Navidad.",
        "Durante décadas fue perfilando al personaje: la barba blanca, la barriga, el taller de juguetes en el Polo Norte, la lista de niños buenos y malos.",
        "Y en muchos de sus dibujos en color, Santa ya aparece con un traje rojo, con ribetes blancos y cinturón negro.",
        "Así que, cuando Coca-Cola llegó, Papá Noel llevaba ya décadas vistiendo de rojo en muchas ilustraciones. Aunque también se le pintaba de verde, de azul o de marrón.",
    ], [("cap3", 0, -0.6), ("pn_nast", 0, 1.0), ("pn_harpers", 1, 0), ("pn_guerra", 2, 0), ("pn_detalles", 3, 0), ("pn_rojo", 4, 0), ("pn_colores", 5, 0)]),
    ("4. Un refresco de verano", [
        "Ahora sí, entra en escena Coca-Cola.",
        "A principios de los años treinta, la marca tenía un problema: la gente la asociaba al calor. Era una bebida de verano.",
        "En invierno se vendía bastante menos. Y la empresa quería que se bebiera todo el año.",
        "Ya en los años veinte lo había intentado con un eslogan que lo decía todo: la sed no tiene estación. Pero hacía falta algo más potente que una frase.",
        "Según varios historiadores de la publicidad, esa fue una de las razones para lanzar campañas navideñas: unir Coca-Cola con la fiesta más importante del invierno.",
        "Y para protagonizarlas, eligieron al personaje más querido de la Navidad.",
    ], [("cap4", 0, -0.6), ("pn_entra", 0, 1.0), ("pn_verano", 1, 0), ("pn_invierno", 2, 0), ("pn_sed", 3, 0), ("pn_campanas", 4, 0), ("pn_elige", 5, 0)]),
    ("5. El pintor de Chicago", [
        "El encargo fue para Haddon Sundblom, un ilustrador de Chicago especializado en publicidad.",
        "En mil novecientos treinta y uno pintó su primer Papá Noel para Coca-Cola. Y siguió haciéndolo cada año hasta mediados de los sesenta.",
        "Sundblom se inspiró en el poema de Clement Clarke Moore. Y pintó a un Papá Noel humano, cálido, cercano: un abuelo bonachón, con mejillas sonrosadas y ojos que sonreían.",
        "Según se cuenta, al principio usó como modelo a un amigo suyo, un vendedor jubilado. Y cuando este murió, empezó a pintarse a sí mismo mirándose en un espejo.",
        "Aquellos anuncios aparecían en las revistas más leídas del país, en carteles y en tiendas. Millones de personas los veían cada Navidad.",
    ], [("cap5", 0, -0.6), ("pn_sundblom", 0, 1.0), ("pn_1931", 1, 0), ("pn_abuelo", 2, 0), ("pn_espejo", 3, 0), ("pn_millones", 4, 0)]),
    ("6. Entonces, ¿mito o verdad?", [
        "Entonces, ¿inventó Coca-Cola el Papá Noel vestido de rojo?",
        "No. El rojo ya existía. Incluso otras marcas de refrescos habían usado a un Papá Noel rojo en sus anuncios antes que Coca-Cola.",
        "La propia Coca-Cola lo reconoce en su web: Papá Noel ya vestía de rojo antes de que Sundblom lo pintara.",
        "Pero lo que sí hizo Coca-Cola fue fijar una imagen. Durante más de treinta años repitió, Navidad tras Navidad, el mismo Papá Noel: rojo, alegre, gordito y humano.",
        "Y como sus anuncios llegaban a todo el mundo, aquel Papá Noel se convirtió en el modelo. Hoy, cuando alguien dibuja a Papá Noel, se parece mucho más al de Sundblom que al de cualquier otro.",
        "No inventó el traje. Pero sí ayudó a que todos imagináramos a Papá Noel de la misma manera.",
    ], [("cap6", 0, -0.6), ("pn_pregunta", 0, 1.0), ("pn_no", 1, 0), ("pn_reconoce", 2, 0), ("pn_fijar", 3, 0), ("pn_modelo", 4, 0), ("pn_conclusion", 5, 0)]),
    ("7. Un anuncio con una errata", [
        "Hay otra marca que, sin quererlo, creó una de las tradiciones navideñas más curiosas de Estados Unidos.",
        "En diciembre de mil novecientos cincuenta y cinco, los grandes almacenes Sears publicaron un anuncio en un periódico de Colorado Springs, en Colorado.",
        "Invitaba a los niños a llamar por teléfono a Papá Noel. Pero el número estaba mal impreso.",
        "Y en lugar de sonar en Sears, sonaba en un centro de defensa aérea del ejército, que vigilaba el cielo por si llegaban aviones enemigos.",
        "Según cuenta el propio ejército estadounidense, el coronel de guardia, Harry Shoup, no colgó. Les siguió el juego a los niños, y empezó a contarles por dónde iba el trineo.",
        "De aquella errata nació una tradición que continúa hoy: cada Nochebuena, el mando de defensa aérea de Estados Unidos y Canadá sigue el viaje de Papá Noel por todo el mundo, y millones de niños lo consultan por internet.",
    ], [("cap7", 0, -0.6), ("pn_otra", 0, 1.0), ("pn_sears", 1, 0), ("pn_errata", 2, 0), ("pn_defensa", 3, 0), ("pn_shoup", 4, 0), ("pn_norad", 5, 0)]),
    ("8. Osos polares", [
        "Coca-Cola nunca dejó de buscar personajes navideños.",
        "En mil novecientos noventa y tres lanzó un anuncio con unos osos polares, hechos por ordenador, que se sentaban en la nieve a mirar una aurora boreal como si fuera una película, con una Coca-Cola en la pata.",
        "Para la época, la animación por ordenador era espectacular. Y los osos se convirtieron en otro símbolo de la marca durante años.",
        "Se trataba de lo mismo que con Papá Noel: asociar la marca al frío, a la nieve y a la ternura.",
    ], [("cap8", 0, -0.6), ("pn_buscar", 0, 1.0), ("pn_osos", 1, 0), ("pn_animacion", 2, 0), ("pn_frio", 3, 0)]),
    ("9. La Navidad llega", [
        "Y en mil novecientos noventa y cinco llegó el anuncio que muchos consideran el que marca el comienzo de la Navidad.",
        "Una caravana de camiones rojos, iluminados con miles de luces, recorre de noche paisajes nevados. A su paso, los pueblos se encienden.",
        "Con una canción pegadiza que en inglés dice: holidays are coming. En España, muchos la recuerdan como la Navidad llega.",
        "El anuncio lo creó una agencia de publicidad estadounidense. Y se ha emitido, con pequeños cambios, durante décadas en decenas de países.",
        "En algunos lugares, la marca llegó a organizar giras con camiones de verdad. Miles de personas iban a verlos y a hacerse fotos.",
        "Un anuncio que se convirtió en tradición. Igual que aquel Papá Noel de Sundblom.",
    ], [("cap9", 0, -0.6), ("pn_1995", 0, 1.0), ("pn_camiones", 1, 0), ("pn_cancion", 2, 0), ("pn_agencia", 3, 0), ("pn_gira", 4, 0), ("pn_tradicion", 5, 0)]),
    ("10. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: una marca no necesita inventar algo para quedárselo. Le basta con repetirlo mejor y durante más tiempo que nadie.",
        "Dos: si tu producto tiene temporada baja, busca un momento del año al que unirte. Coca-Cola se unió a la Navidad.",
        "Y tres: cuidado con las historias demasiado redondas. Las mejores leyendas de marketing a menudo son solo medio verdad.",
    ], [("cap10", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un obispo generoso, un poema con renos, un dibujante de revistas, un pintor de Chicago y una caravana de camiones iluminados.",
        "La próxima vez que alguien te diga que Coca-Cola inventó a Papá Noel, ya sabes la historia completa.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa. Y este ha sido nuestro especial de Navidad.",
        "¿En tu casa traía los regalos Papá Noel o los Reyes Magos? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("pn_final", 0, 0), ("pn_ya", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Coca-Cola Canada, «Did Coca-Cola invent Santa Claus?» (FAQ oficial)", "https://www.coca-cola.ca/faqs/coca-cola-faqs-history/did-coca-cola-invent-santa-claus"),
    ("Wikipedia, «Haddon Sundblom»", "https://en.wikipedia.org/wiki/Haddon_Sundblom"),
    ("The Hustle, «Did Coca-Cola create Santa Claus?» (2020)", "https://thehustle.co/12222020-coca-cola"),
    ("Coca-Cola Irlanda, «History of the Coca-Cola Christmas trucks»", "https://coca-cola.com/ie/en/media-center/the-tale-of-the-christmas-trucks"),
    ("Atlanta History Center, «A look inside Coca-Cola at Christmastime»", "https://www.atlantahistorycenter.com/blog/a-look-inside-coca-cola-at-christmastime/"),
    ("Wikipedia, «A Visit from St. Nicholas»", "https://en.wikipedia.org/wiki/A_Visit_from_St._Nicholas"),
    ("Wikipedia, «Thomas Nast»", "https://en.wikipedia.org/wiki/Thomas_Nast"),
]
DESCRIPCION = ("Especial Navidad de Código de Barras. ¿Coca-Cola vistió a Papá Noel de rojo? Es uno de los mitos de marketing más famosos… y es falso: "
               "Santa Claus ya vestía de rojo en los dibujos de Thomas Nast décadas antes. Pero desde 1931 los anuncios de Haddon Sundblom fijaron la imagen "
               "de Papá Noel que hoy tiene todo el mundo. Del obispo Nicolás a los camiones de «la Navidad llega».")
ETIQUETAS = "especial navidad, papá noel, santa claus, coca-cola navidad, mito coca-cola papá noel, haddon sundblom, thomas nast, camiones coca-cola, la navidad llega, historia de marcas, código de barras"
HASHTAGS = "#EspecialNavidad #PapáNoel #HistoriaDeMarcas"
LISTA = "Especial Navidad"
NOTA = "Nota: la autoría del poema de 1823 se atribuye normalmente a Clement Clarke Moore; el modelo de Sundblom y los motivos comerciales de la campaña proceden de relatos e historiadores de la publicidad."
PREGUNTA = "¿PAPÁ NOEL *O REYES MAGOS*?"
