"""Guion del vídeo 57 de Código de Barras (especial Navidad, formato largo): el panettone."""
ESPECIAL = "NAVIDAD"
TITULO = "Especial Navidad: el panettone, el bizcocho que conquistó Perú"
TITULOS_ALT = ["Especial Navidad: la historia del panettone", "Especial Navidad: Motta, Alemagna y la guerra del panettone"]
MARCA = "Panettone"
SEGMENTOS = [
    ("Introducción", [
        "Bienvenido al especial de Navidad de Código de Barras.",
        "Una caja alta, un bizcocho enorme con forma de cúpula, pasas, fruta confitada y una miga que se deshace en hebras. En los últimos años se ha colado en muchas mesas españolas.",
        "Es el panettone, el dulce de Navidad de Milán.",
        "Pero lo más curioso no es de dónde viene, sino adónde ha llegado: hoy, según varias estimaciones, uno de los países que más panettone come por habitante del mundo no es Italia. Es Perú.",
        "Por el camino hay una leyenda de un pinche de cocina, dos pasteleros que se odiaban y miles de emigrantes que se llevaron la receta en la maleta.",
        "Hoy te contamos la historia del panettone.",
    ], [("pa_especial", 0, 0), ("pa_caja", 1, 0), ("pa_milan", 2, 0), ("pa_peru", 3, 0), ("pa_camino", 4, 0), ("pa_historia", 5, 0)]),
    ("1. El pan de Toni", [
        "Como casi todos los dulces antiguos, el panettone tiene una leyenda de origen.",
        "La más famosa nos lleva al Milán del siglo quince, a la corte de Ludovico Sforza, conocido como el Moro. El mismo duque que fue mecenas de Leonardo da Vinci, y para quien Leonardo pintó La última cena.",
        "Según la leyenda, en un banquete de Navidad el postre se quemó en el horno. Y un joven pinche de cocina llamado Toni salvó la situación: con la masa que le quedaba, azúcar, huevos, pasas y fruta confitada, improvisó un pan dulce.",
        "Al duque le encantó. Y aquel pan de Toni, en el dialecto de Milán, acabó dando nombre al panettone.",
        "Hay otra versión, con un joven noble enamorado de la hija de un panadero, que inventa el dulce para ayudar al negocio del padre de la chica.",
        "Ninguna de las dos está demostrada. Lo más probable es que el nombre venga simplemente de panetto, un pan pequeño, con un aumentativo: un pan grande.",
    ], [("cap1", 0, -0.6), ("pa_leyenda", 0, 1.0), ("pa_sforza", 1, 0), ("pa_toni", 2, 0), ("pa_duque", 3, 0), ("pa_otra", 4, 0), ("pa_panetto", 5, 0)]),
    ("2. Un pan bajo y plano", [
        "Lo que sí sabemos es que en Milán, desde hace siglos, se hacía en Navidad un pan enriquecido con mantequilla, huevos y frutas.",
        "Pero aquel panettone antiguo no se parecía al de hoy. Era más bajo, más plano, más parecido a un pan de pueblo dulce. Y era caro: mantequilla, huevos y azúcar en abundancia no estaban al alcance de todos los días, así que era un dulce de fiesta.",
        "Se hacía en las pastelerías y en las casas, y se comía sobre todo en Milán y alrededores. Fuera de Lombardía, mucha gente ni lo conocía.",
        "Para que se convirtiera en el gigante de cúpula alta que conocemos, y para que llegara a todo el mundo, hizo falta un pastelero muy ambicioso.",
    ], [("cap2", 0, -0.6), ("pa_milan2", 0, 1.0), ("pa_plano", 1, 0), ("pa_local", 2, 0), ("pa_ambicioso", 3, 0)]),
    ("3. La cúpula de Motta", [
        "Se llamaba Angelo Motta. En mil novecientos diecinueve abrió un pequeño obrador en Milán.",
        "Y cambió el panettone para siempre. Su gran idea fue hacerlo mucho más alto, con una cúpula redondeada.",
        "Para conseguirlo, rodeaba la masa con un collar de papel que la sujetaba mientras subía en el horno. Así podía crecer hacia arriba sin desparramarse.",
        "Y la masa tenía que fermentar muchas horas, con varias fases de levado, para quedar esponjosa y ligera, con esas hebras tan características.",
        "El resultado era un panettone alto, ligero y espectacular. Y ese se convirtió en el modelo para todos los demás.",
    ], [("cap3", 0, -0.6), ("pa_motta", 0, 1.0), ("pa_cupula", 1, 0), ("pa_papel", 2, 0), ("pa_fermenta", 3, 0), ("pa_modelo", 4, 0)]),
    ("4. La guerra de Milán", [
        "Y como en toda buena historia de marcas, apareció un rival.",
        "Gioacchino Alemagna, otro pastelero milanés, empezó a hacer su propio panettone pocos años después, con una forma muy parecida.",
        "Los dos montaron fábricas cada vez más grandes. Y su competencia convirtió el panettone en un producto industrial, fabricado por millones. Cada uno intentaba tener la masa más esponjosa, la caja más bonita y la distribución más grande.",
        "Gracias a ellos, el panettone dejó de ser un dulce de Milán y pasó a comerse en toda Italia cada Navidad.",
        "Los dos apellidos se convirtieron en marcas muy famosas. Y la rivalidad terminó como terminan muchas: en mil novecientos setenta y seis, Motta se quedó con Alemagna.",
        "Hoy, las dos marcas pertenecen a otra empresa italiana de dulces, Bauli, de Verona.",
    ], [("cap4", 0, -0.6), ("pa_rival", 0, 1.0), ("pa_alemagna", 1, 0), ("pa_fabricas", 2, 0), ("pa_italia", 3, 0), ("pa_1976", 4, 0), ("pa_bauli", 5, 0)]),
    ("5. El primo de Verona", [
        "En Italia, la Navidad tiene un debate clásico: ¿panettone o pandoro?",
        "El pandoro es el gran rival del panettone. Viene de Verona, donde el pastelero Domenico Melegatti lo patentó en mil ochocientos noventa y cuatro. Tiene forma de estrella de ocho puntas, no lleva fruta ni pasas y se sirve espolvoreado con azúcar glas, como una montaña nevada.",
        "Cada Navidad, las familias italianas se dividen entre los dos. Muchas, directamente, compran uno de cada.",
        "Y las grandes marcas lo saben: casi todas fabrican los dos.",
        "Una curiosidad: Bauli, la empresa que hoy es dueña de Motta y de Alemagna, es precisamente de Verona, la ciudad del pandoro.",
    ], [("cap5", 0, -0.6), ("pa_debate", 0, 1.0), ("pa_pandoro", 1, 0), ("pa_divide", 2, 0), ("pa_ambos", 3, 0), ("pa_verona", 4, 0)]),
    ("6. En la maleta", [
        "Y ahora, el gran salto: América.",
        "Durante el siglo diecinueve y el veinte, millones de italianos emigraron a Argentina, Brasil, Perú, Venezuela y muchos otros países.",
        "Y se llevaron sus costumbres. Entre ellas, el pan dulce de Navidad.",
        "En Argentina y Uruguay se le llama pan dulce. En Perú, panetón. En Brasil, panetone. Y en cada país se adaptó con sus propios gustos: más fruta, menos fruta, con chocolate… En Argentina, el pan dulce no falta en la mesa de Nochebuena, aunque allí la Navidad llegue en pleno verano.",
        "En Brasil, una familia de emigrantes italianos fundó una empresa que acabaría convirtiéndose en uno de los mayores fabricantes de panettone del mundo. Según la prensa peruana, Brasil lidera hoy la producción mundial.",
        "Un dulce de Milán acabó siendo, casi, un dulce latinoamericano.",
    ], [("cap6", 0, -0.6), ("pa_america", 0, 1.0), ("pa_emigran", 1, 0), ("pa_costumbres", 2, 0), ("pa_nombres", 3, 0), ("pa_brasil", 4, 0), ("pa_latino", 5, 0)]),
    ("7. Perú, el campeón", [
        "Y ningún país se lo ha tomado tan en serio como Perú. Desde noviembre, los supermercados de Lima se llenan de montañas de cajas de panetón.",
        "Allí, el panetón es casi obligatorio en Navidad. Se come en Nochebuena con una taza de chocolate caliente, aunque en Lima diciembre sea pleno verano.",
        "Las empresas lo regalan a sus trabajadores en las cestas navideñas, y en muchas familias se compran varios.",
        "Según varios estudios del sector, Perú lleva años entre los países que más panetón comen por habitante del mundo, con más de un kilo por persona al año. Algunas estimaciones lo sitúan incluso por delante de la propia Italia.",
        "Y la marca más vendida allí, según un estudio citado por la prensa peruana, es D'Onofrio, que también nació de un emigrante italiano.",
        "Hay hasta panetón para las fiestas patrias, en julio. Porque en Perú, cualquier celebración es buena excusa.",
    ], [("cap7", 0, -0.6), ("pa_serio", 0, 1.0), ("pa_chocolate", 1, 0), ("pa_regalo", 2, 0), ("pa_kilo", 3, 0), ("pa_donofrio", 4, 0), ("pa_julio", 5, 0)]),
    ("8. La moda en España", [
        "¿Y en España? Durante mucho tiempo, el panettone era casi desconocido. Aquí reinaban el turrón, los mantecados y el roscón. Y el roscón de Reyes, que llega justo después, sigue siendo su gran competidor.",
        "Pero en los últimos años ha llegado con fuerza. Primero a los supermercados, con versiones industriales a buen precio.",
        "Y después a las pastelerías artesanas, donde muchos maestros pasteleros españoles han convertido el panettone en un reto: hay concursos para elegir el mejor de España, y los más premiados se venden a precios de producto de lujo.",
        "Hacer un buen panettone es muy difícil. La masa madre, los tiempos de fermentación y el horneado tienen que ser perfectos. Por eso los pasteleros lo consideran un examen de su oficio.",
        "Y para colgarlo boca abajo después de hornearlo, para que la cúpula no se hunda, se usan unas varillas que lo atraviesan. Es una imagen muy curiosa: filas de panettones colgados del revés.",
    ], [("cap8", 0, -0.6), ("pa_espana", 0, 1.0), ("pa_super", 1, 0), ("pa_artesano", 2, 0), ("pa_dificil", 3, 0), ("pa_reves", 4, 0)]),
    ("9. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: a veces, mejorar la forma es tan importante como mejorar la receta. La cúpula de Motta cambió el producto.",
        "Dos: la competencia hace crecer a todo el sector. Motta y Alemagna, peleando, llevaron el panettone a toda Italia.",
        "Y tres: las personas son el mejor canal de distribución. Los emigrantes llevaron el panettone más lejos que cualquier campaña.",
    ], [("cap9", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un pinche de cocina llamado Toni, un pan bajo y plano, un collar de papel, dos rivales de Milán y millones de emigrantes con una receta en la maleta.",
        "Así es como un dulce de Milán acabó en las mesas de Lima, de São Paulo… y de tu casa.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa. Y este ha sido nuestro especial de Navidad.",
        "¿Panettone o roscón de Reyes? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("pa_final", 0, 0), ("pa_mesas", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Wikipedia, «Panettone»", "https://en.wikipedia.org/wiki/Panettone"),
    ("Wikipedia, «Angelo Motta»", "https://en.wikipedia.org/wiki/Angelo_Motta"),
    ("MilanoFree, «Il panettone meneghino di Angelo Motta»", "https://www.milanofree.it/milano/tradizioni/il-panettone-meneghino-di-angelo-motta.html"),
    ("The New European, «Bread of heaven»", "https://www.thenewworld.co.uk/bread-of-heaven/"),
    ("Panamericana, «Perú lleva 6 años consecutivos como el país que más panetón consume»", "https://panamericana.pe/cultura/460372-peru-lleva-6-anos-consecutivos-pais-paneton-consume-mundo-repetira-2025/amp"),
    ("La República, «Aunque Perú es la nación que consume más panetón, otro país de Sudamérica lidera la producción» (2024)", "https://larepublica.pe/mundo/2024/12/24/aunque-peru-es-la-nacion-que-consume-mas-paneton-en-el-mundo-otro-pais-de-sudamerica-lidera-la-produccion-global-evat-838608"),
    ("Trome, marcas de panetón más elegidas por los peruanos", "https://trome.com/actualidad/navidad-y-consumo-de-paneton-cuales-son-las-marcas-de-panetones-mas-elegidas-por-los-peruanos-y-cuantos-se-consumiran-este-ano-compras-navidenas-favoritas-donofrio-nestle-gloria-tottus-imp-noticia/"),
]
DESCRIPCION = ("Especial Navidad de Código de Barras. El panettone nació en Milán, pero según varias estimaciones uno de los países que más lo comen por "
               "habitante es Perú. La leyenda del pan de Toni, la cúpula alta que inventó Angelo Motta en 1919, la guerra con Alemagna, el pandoro de Verona, "
               "los emigrantes italianos que lo llevaron a América y su llegada a las pastelerías españolas.")
ETIQUETAS = "especial navidad, panettone, panetón, historia del panettone, motta, alemagna, pandoro, perú panetón, pan dulce navidad, dulces navideños, historia de marcas, código de barras"
HASHTAGS = "#EspecialNavidad #Panettone #HistoriaDeMarcas"
LISTA = "Especial Navidad"
NOTA = "Nota: las leyendas del origen del panettone no están demostradas; las cifras de consumo en Perú varían según la fuente y el año."
PREGUNTA = "¿PANETTONE *O ROSCÓN*?"
