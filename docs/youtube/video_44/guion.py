"""Guion del vídeo 44 de Código de Barras (formato largo): Toyota."""
TITULO = "Toyota: de un telar de madera al mayor fabricante de coches del mundo"
TITULOS_ALT = ["La historia de Toyota (y por qué no se llama Toyoda)", "Cómo un telar y un supermercado crearon el método Toyota"]
MARCA = "Toyota"
SEGMENTOS = [
    ("Introducción", [
        "Es, desde hace años, el mayor fabricante de coches del mundo por número de vehículos vendidos.",
        "Su método de trabajo se estudia en escuelas de negocios de todo el planeta. Y su modelo más famoso es uno de los coches más vendidos de la historia.",
        "Pero Toyota no empezó fabricando coches. Empezó fabricando telares.",
        "Su nombre no es el apellido de su fundador, sino una versión cambiada, según la propia empresa, por un número de la suerte.",
        "Y su famoso sistema de producción se inspiró, en parte, en los supermercados estadounidenses.",
        "Esta es la historia de Toyota.",
    ], [("to_mayor", 0, 0), ("to_metodo", 1, 0), ("to_telares", 2, 0), ("to_nombre", 3, 0), ("to_super", 4, 0), ("to_historia", 5, 0)]),
    ("1. El hijo del carpintero", [
        "Sakichi Toyoda nació en mil ochocientos sesenta y siete, en un pueblo del centro de Japón. Su padre era carpintero.",
        "Como muchas mujeres de la época, su madre tejía en casa, en un telar de madera manual. Era un trabajo lento y agotador.",
        "Sakichi decidió que inventaría una máquina para hacerlo más fácil.",
        "En mil ochocientos noventa y uno patentó su primer telar de madera. Y después siguió mejorándolo durante décadas.",
        "Se convirtió en uno de los grandes inventores de Japón.",
    ], [("cap1", 0, -0.6), ("to_sakichi", 0, 1.0), ("to_madre", 1, 0), ("to_decidio", 2, 0), ("to_1891", 3, 0), ("to_inventor", 4, 0)]),
    ("2. La máquina que se para sola", [
        "En mil novecientos veinticuatro, Sakichi presentó su obra maestra: un telar automático, el modelo G.",
        "Tenía una función muy especial: si un hilo se rompía, la máquina se detenía sola.",
        "Así no se fabricaba tela defectuosa, y una sola persona podía vigilar muchas máquinas a la vez.",
        "Esta idea, que una máquina se pare en cuanto detecta un problema, tiene un nombre en japonés: jidoka.",
        "Y décadas después se convertiría en uno de los pilares del método Toyota.",
    ], [("cap2", 0, -0.6), ("to_tipog", 0, 1.0), ("to_hilo", 1, 0), ("to_vigilar", 2, 0), ("to_jidoka", 3, 0), ("to_pilar", 4, 0)]),
    ("3. Una patente para Inglaterra", [
        "El telar de Sakichi era tan bueno que llamó la atención en Inglaterra, la cuna de la industria textil.",
        "Según la historia que cuenta la propia Toyota, en mil novecientos veintinueve una empresa británica, Platt Brothers, le compró los derechos de la patente por cien mil libras.",
        "Era muchísimo dinero.",
        "Y Sakichi tenía claro en qué quería gastarlo. Según se cuenta, le dijo a su hijo Kiichiro que usara ese dinero para algo nuevo: los automóviles.",
        "Sakichi murió en mil novecientos treinta. No llegó a ver ni un solo coche de su familia.",
    ], [("cap3", 0, -0.6), ("to_inglaterra", 0, 1.0), ("to_platt", 1, 0), ("to_dinero", 2, 0), ("to_coches", 3, 0), ("to_muere", 4, 0)]),
    ("4. Kiichiro y los coches", [
        "Kiichiro Toyoda era ingeniero y había viajado por Estados Unidos y Europa. Había visto cómo los coches empezaban a cambiar el mundo.",
        "En mil novecientos treinta y tres creó una división de automóviles dentro de la empresa de telares de la familia.",
        "Empezó desmontando coches estadounidenses, pieza a pieza, para entender cómo funcionaban.",
        "Fabricó primero un motor. Después, un prototipo. Y en mil novecientos treinta y seis, su primer coche de serie, el modelo AA.",
        "Era evidente que estaba inspirado en los coches americanos de la época. Pero lo habían construido ellos.",
    ], [("cap4", 0, -0.6), ("to_kiichiro", 0, 1.0), ("to_division", 1, 0), ("to_desmontar", 2, 0), ("to_aa", 3, 0), ("to_americano", 4, 0)]),
    ("5. De Toyoda a Toyota", [
        "Faltaba decidir el nombre de la marca de coches.",
        "Según la propia empresa, se organizó un concurso público para elegir un logotipo, y se recibieron miles de propuestas.",
        "Y se tomó una decisión curiosa: cambiar ligeramente el apellido familiar. De Toyoda, con de, a Toyota, con te.",
        "Según la explicación oficial, Toyota sonaba más claro y limpio. Pero hay otra razón: escrita en katakana, uno de los alfabetos japoneses, la palabra Toyota se escribe con ocho trazos.",
        "Y el ocho se considera en Japón un número de la suerte, porque su forma se ensancha hacia abajo, como algo que crece y prospera.",
        "Además, el nombre separaba el negocio de los coches de la vida privada de la familia.",
        "En mil novecientos treinta y siete nació oficialmente Toyota Motor Company.",
    ], [("cap5", 0, -0.6), ("to_falta", 0, 1.0), ("to_concurso", 1, 0), ("to_dt", 2, 0), ("to_ocho", 3, 0), ("to_suerte", 4, 0), ("to_separar", 5, 0), ("to_1937", 6, 0)]),
    ("6. Al borde de la quiebra", [
        "Durante la Segunda Guerra Mundial, la empresa tuvo que fabricar camiones para el ejército japonés. Y al final de la guerra, sus fábricas sufrieron bombardeos.",
        "En la posguerra, Japón estaba arruinado. Y en mil novecientos cincuenta, Toyota estuvo al borde de la quiebra.",
        "Hubo que despedir a muchos trabajadores, lo que provocó huelgas muy duras.",
        "Kiichiro, que había prometido no despedir a nadie, dimitió para asumir la responsabilidad.",
        "Murió dos años después, en mil novecientos cincuenta y dos. Tampoco él llegó a ver el gran éxito de su empresa.",
        "Ese mismo año, los pedidos de camiones del ejército estadounidense para la guerra de Corea salvaron a Toyota de la ruina.",
    ], [("cap6", 0, -0.6), ("to_guerra", 0, 1.0), ("to_quiebra", 1, 0), ("to_huelgas", 2, 0), ("to_dimite", 3, 0), ("to_muere2", 4, 0), ("to_corea", 5, 0)]),
    ("7. La lección del supermercado", [
        "En la posguerra, Toyota no tenía dinero para grandes almacenes llenos de piezas, como las fábricas estadounidenses.",
        "Un ingeniero de la empresa, Taiichi Ohno, buscó otra forma de trabajar.",
        "Según contó él mismo, se inspiró en los supermercados de Estados Unidos.",
        "En un supermercado, el cliente coge lo que necesita, y solo entonces se repone la estantería. No se acumula nada.",
        "Ohno aplicó esa idea a la fábrica: cada sección pedía a la anterior solo las piezas que necesitaba, cuando las necesitaba, con unas tarjetas llamadas kanban.",
        "Lo llamaron producción justo a tiempo. Junto a la idea del telar que se para solo, formó la base del sistema de producción Toyota.",
    ], [("cap7", 0, -0.6), ("to_almacenes", 0, 1.0), ("to_ohno", 1, 0), ("to_supermercado", 2, 0), ("to_reponer", 3, 0), ("to_kanban", 4, 0), ("to_justo", 5, 0)]),
    ("8. Una cuerda para parar", [
        "Hay un detalle de ese sistema que sorprendía mucho a los visitantes.",
        "A lo largo de la línea de montaje había una cuerda. Cualquier trabajador que viera un problema podía tirar de ella.",
        "Y la línea se paraba.",
        "En muchas fábricas de otros países, parar la línea era casi impensable. En Toyota era una obligación: los problemas se arreglan en el momento, no al final.",
        "Era la misma idea del telar de Sakichi: detenerse en cuanto algo falla.",
        "Además, los trabajadores proponían constantemente pequeñas mejoras. En japonés, a eso se le llama kaizen: mejora continua.",
    ], [("cap8", 0, -0.6), ("to_detalle", 0, 1.0), ("to_cuerda", 1, 0), ("to_para", 2, 0), ("to_obligacion", 3, 0), ("to_misma", 4, 0), ("to_kaizen", 5, 0)]),
    ("9. A la conquista de América", [
        "En mil novecientos cincuenta y siete, Toyota intentó vender sus coches en Estados Unidos.",
        "Fue un fracaso. Su modelo no tenía potencia suficiente para las largas autopistas americanas. Se recalentaba y hacía mucho ruido.",
        "Toyota tomó nota. Y en mil novecientos sesenta y seis lanzó un coche pequeño, fiable y económico: el Corolla.",
        "Llegó en el momento perfecto. En los años setenta, la crisis del petróleo disparó el precio de la gasolina, y los estadounidenses empezaron a buscar coches que gastaran poco.",
        "El Corolla se convirtió en uno de los coches más vendidos de la historia, con decenas de millones de unidades.",
    ], [("cap9", 0, -0.6), ("to_1957", 0, 1.0), ("to_potencia", 1, 0), ("to_corolla", 2, 0), ("to_petroleo", 3, 0), ("to_millones", 4, 0)]),
    ("10. Lujo e híbridos", [
        "En mil novecientos ochenta y nueve, Toyota quiso entrar en el lujo. Pero sabía que su nombre se asociaba a coches baratos y prácticos.",
        "Así que creó una marca nueva, con otro nombre: Lexus.",
        "Y en mil novecientos noventa y siete lanzó en Japón el Prius, el primer coche híbrido fabricado en serie: combinaba un motor de gasolina con uno eléctrico.",
        "Muchos lo miraron con escepticismo. Pero con los años, el híbrido se convirtió en una de las grandes bazas de la marca.",
        "Hoy, en las ciudades de medio mundo, es habitual ver taxis híbridos de Toyota.",
        "Y la marca ha seguido explorando otros caminos: coches eléctricos e incluso un coche de hidrógeno, el Mirai, que solo expulsa agua por el tubo de escape.",
    ], [("cap10", 0, -0.6), ("to_lujo", 0, 1.0), ("to_lexus", 1, 0), ("to_prius", 2, 0), ("to_escepticismo", 3, 0), ("to_taxis", 4, 0), ("to_mirai", 5, 0)]),
    ("11. La gran crisis", [
        "Pero en dos mil nueve y dos mil diez llegó su peor crisis de imagen.",
        "Varios casos de aceleraciones repentinas obligaron a Toyota a llamar a revisión a millones de coches en todo el mundo.",
        "Akio Toyoda, nieto de Kiichiro y presidente de la empresa, tuvo que comparecer ante el Congreso de Estados Unidos y pedir disculpas.",
        "Para una marca construida sobre la fiabilidad, fue un golpe durísimo.",
        "Toyota reforzó sus controles de calidad. Y pocos años después había vuelto a lo más alto de las ventas mundiales.",
    ], [("cap11", 0, -0.6), ("to_crisis", 0, 1.0), ("to_revision", 1, 0), ("to_akio", 2, 0), ("to_golpe", 3, 0), ("to_vuelve", 4, 0)]),
    ("12. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: lo que sabes hacer en un sector puede servirte en otro. Toyota llevó a los coches lo que había aprendido con los telares.",
        "Dos: pararse a tiempo ahorra mucho más que seguir adelante con un error. Esa es la lección del telar y de la cuerda.",
        "Y tres: las buenas ideas pueden venir de sitios inesperados. Una fábrica de coches aprendió a organizarse mirando un supermercado.",
    ], [("cap12", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Una madre tejiendo, un telar que se para solo, una patente vendida a Inglaterra, un número de la suerte y un supermercado americano.",
        "La próxima vez que veas un Toyota, acuérdate de que todo empezó con un telar de madera.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Cuál ha sido el coche más fiable que has tenido? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("to_final", 0, 0), ("to_telar2", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("Toyota Motor Corporation, «75 Years of Toyota» (historia oficial)", "https://www.toyota-global.com/company/history_of_toyota/75years/"),
    ("Wikipedia, «Toyota»", "https://en.wikipedia.org/wiki/Toyota"),
    ("Wikipedia, «Sakichi Toyoda»", "https://en.wikipedia.org/wiki/Sakichi_Toyoda"),
    ("Wikipedia, «Toyota Production System»", "https://en.wikipedia.org/wiki/Toyota_Production_System"),
    ("EBSCO Research Starters, «Eiji Toyoda»", "https://www.ebsco.com/research-starters/biography/eiji-toyoda"),
    ("Coches.com, «Kiichiro Toyoda: trabajo duro, perseverancia y disciplina»", "https://noticias.coches.com/noticias-motor/kiichiro-toyoda-trabajo-duro-perserverancia-disciplina/175686"),
    ("Taiichi Ohno, «El sistema de producción Toyota» (1978)", ""),
]
DESCRIPCION = ("Toyota empezó fabricando telares: Sakichi Toyoda inventó en 1924 un telar automático que se paraba solo si se rompía un hilo, y vendió la patente "
               "a Inglaterra. Con ese dinero, su hijo Kiichiro empezó a fabricar coches. El apellido Toyoda se convirtió en Toyota, con ocho trazos de la "
               "suerte, y su método se inspiró en los supermercados. Esta es la historia de Toyota.")
ETIQUETAS = "toyota, historia de toyota, sakichi toyoda, kiichiro toyoda, telar, jidoka, kanban, justo a tiempo, kaizen, taiichi ohno, corolla, prius, lexus, historia de marcas, código de barras"
HASHTAGS = "#Toyota #HistoriaDeMarcas #Coches"
LISTA = "Motor"
NOTA = "Nota: la cifra de la venta de la patente y la explicación del cambio de nombre son las que da la propia Toyota en su historia oficial."
PREGUNTA = "¿TU COCHE *MÁS FIABLE*?"
