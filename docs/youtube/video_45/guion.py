"""Guion del vídeo 45 de Código de Barras (formato largo): Disney."""
TITULO = "Disney: el hombre que perdió a su conejo y creó un ratón"
TITULOS_ALT = ["La historia de Disney (y del conejo que le robaron)", "Cómo Walt Disney se arruinó antes de crear un imperio"]
MARCA = "Disney"
SEGMENTOS = [
    ("Introducción", [
        "Unas orejas redondas. Un castillo. Una frase: érase una vez.",
        "Disney es hoy uno de los mayores imperios del entretenimiento del mundo: películas, parques, juguetes, series.",
        "Pero su fundador se arruinó antes de cumplir los veintidós años.",
        "Su primer personaje de éxito no fue un ratón, sino un conejo. Y se lo quitaron.",
        "Su primera película larga la llamaron la locura de Disney. Todos pensaban que lo iba a hundir.",
        "Esta es la historia de Disney.",
    ], [("di_orejas", 0, 0), ("di_imperio", 1, 0), ("di_ruina", 2, 0), ("di_conejo", 3, 0), ("di_locura", 4, 0), ("di_historia", 5, 0)]),
    ("1. Un chico de Misuri", [
        "Walter Elias Disney nació en Chicago en mil novecientos uno. Pero creció sobre todo en Misuri, en el centro de Estados Unidos.",
        "Su padre era estricto, y la familia pasaba apuros. De niño, Walt repartía periódicos de madrugada, con nieve o con calor.",
        "Le encantaba dibujar. Según sus biografías, de pequeño hacía dibujos de los animales de la granja y los vendía a los vecinos.",
        "Con dieciséis años, mintió sobre su edad para ir a la Primera Guerra Mundial como conductor de ambulancias de la Cruz Roja. Llegó a Francia cuando la guerra ya había terminado.",
        "Volvió a Estados Unidos decidido a dedicarse al dibujo.",
    ], [("cap1", 0, -0.6), ("di_chicago", 0, 1.0), ("di_periodicos", 1, 0), ("di_dibujar", 2, 0), ("di_ambulancia", 3, 0), ("di_dibujo", 4, 0)]),
    ("2. La primera ruina", [
        "En Kansas City conoció a otro joven dibujante, Ub Iwerks, que sería durante años su gran compañero.",
        "Walt fundó su primer estudio de animación: Laugh-O-Gram. Hacían cortos basados en cuentos clásicos.",
        "Pero el dinero no llegaba. Walt, según se cuenta, llegó a dormir en el estudio y a comer judías de lata.",
        "En mil novecientos veintitrés, el estudio quebró.",
        "Walt tenía veintiún años. Hizo la maleta y se marchó a Hollywood, según la historia más repetida, con muy poco dinero en el bolsillo.",
    ], [("cap2", 0, -0.6), ("di_iwerks", 0, 1.0), ("di_laughogram", 1, 0), ("di_judias", 2, 0), ("di_quiebra", 3, 0), ("di_hollywood", 4, 0)]),
    ("3. El conejo afortunado", [
        "En California, Walt fundó un estudio con su hermano Roy, que se ocupaba del dinero.",
        "En mil novecientos veintisiete crearon un personaje que fue un éxito: Oswald, el conejo afortunado.",
        "Los cortos de Oswald los distribuía Universal Pictures, a través de un productor llamado Charles Mintz.",
        "En mil novecientos veintiocho, Walt viajó a Nueva York para pedir más dinero por cada corto.",
        "Y allí recibió la peor noticia de su carrera.",
    ], [("cap3", 0, -0.6), ("di_roy", 0, 1.0), ("di_oswald", 1, 0), ("di_mintz", 2, 0), ("di_nuevayork", 3, 0), ("di_noticia", 4, 0)]),
    ("4. Le quitan el conejo", [
        "Mintz no solo no le subió el precio. Le propuso pagarle menos.",
        "Y le reveló dos cosas. La primera: había contratado en secreto a casi todos los dibujantes de Walt.",
        "La segunda: los derechos de Oswald no eran de Walt. Según el contrato, pertenecían a Universal.",
        "O aceptaba menos dinero, o se quedaba sin personaje y sin equipo.",
        "Walt se negó. Perdió a Oswald y a la mayoría de sus dibujantes. Solo Ub Iwerks se quedó con él.",
        "Fue una lección que nunca olvidó: a partir de entonces, Disney sería dueño de todo lo que creara.",
    ], [("cap4", 0, -0.6), ("di_menos", 0, 1.0), ("di_secreto", 1, 0), ("di_derechos", 2, 0), ("di_dilema", 3, 0), ("di_pierde", 4, 0), ("di_dueno", 5, 0)]),
    ("5. Un ratón en el tren", [
        "Según la historia que contaba el propio Walt, en el largo viaje en tren de vuelta a California se le ocurrió un nuevo personaje.",
        "Un ratón.",
        "Al principio quería llamarlo Mortimer. Pero, según la versión más extendida, su mujer, Lillian, le dijo que sonaba demasiado pomposo. Y le propuso otro nombre: Mickey.",
        "De vuelta en el estudio, Ub Iwerks lo dibujó. Hecho con círculos, fácil y rápido de animar.",
        "Faltaba algo que lo hiciera especial.",
    ], [("cap5", 0, -0.6), ("di_tren", 0, 1.0), ("di_raton", 1, 0), ("di_mortimer", 2, 0), ("di_circulos", 3, 0), ("di_especial", 4, 0)]),
    ("6. El ratón que hablaba", [
        "En mil novecientos veintisiete se había estrenado la primera gran película con sonido sincronizado. El cine mudo se acababa.",
        "Walt tuvo una idea: hacer un dibujo animado con el sonido perfectamente sincronizado con la imagen.",
        "El dieciocho de noviembre de mil novecientos veintiocho, en un cine de Nueva York, se estrenó Steamboat Willie: Mickey al timón de un barco de vapor, silbando.",
        "El público nunca había visto nada así. Los dibujos se movían al ritmo de la música y de los sonidos.",
        "La voz de Mickey la ponía el propio Walt. Y la siguió poniendo durante casi veinte años.",
        "Hoy Disney celebra esa fecha como el cumpleaños de Mickey Mouse.",
    ], [("cap6", 0, -0.6), ("di_sonoro", 0, 1.0), ("di_sincronizado", 1, 0), ("di_steamboat", 2, 0), ("di_publico", 3, 0), ("di_voz", 4, 0), ("di_cumple", 5, 0)]),
    ("7. La locura de Disney", [
        "Mickey fue un fenómeno. Pero Walt quería algo mucho más ambicioso: una película de dibujos animados de larga duración.",
        "Nadie lo había hecho antes así. En Hollywood se burlaban del proyecto y lo llamaban la locura de Disney.",
        "Se decía que nadie aguantaría hora y media viendo dibujos animados.",
        "El presupuesto se disparó hasta casi un millón y medio de dólares, una fortuna para la época. Según se cuenta, Walt llegó a hipotecar su casa.",
        "Para conseguir el último préstamo, tuvo que enseñar a los banqueros la película sin terminar.",
        "El veintiuno de diciembre de mil novecientos treinta y siete se estrenó Blancanieves y los siete enanitos.",
    ], [("cap7", 0, -0.6), ("di_largo", 0, 1.0), ("di_burla", 1, 0), ("di_hora", 2, 0), ("di_hipoteca", 3, 0), ("di_banqueros", 4, 0), ("di_1937", 5, 0)]),
    ("8. Un Óscar y siete pequeños", [
        "Fue un triunfo absoluto.",
        "En el estreno, según se cuenta, muchos de los espectadores, estrellas de Hollywood incluidas, lloraron con la escena de Blancanieves dormida.",
        "Se convirtió en una de las películas más taquilleras de su época.",
        "Y Hollywood le dio a Walt un premio muy especial: un Óscar honorífico de tamaño normal… acompañado de siete Óscar pequeñitos. Uno por cada enanito.",
        "Con el dinero de Blancanieves, Disney construyó unos grandes estudios nuevos en Burbank, en California.",
    ], [("cap8", 0, -0.6), ("di_triunfo", 0, 1.0), ("di_lloran", 1, 0), ("di_taquilla", 2, 0), ("di_oscar", 3, 0), ("di_burbank", 4, 0)]),
    ("9. Años difíciles", [
        "Pero el éxito no duró mucho.",
        "En mil novecientos cuarenta, Disney estrenó Pinocho y Fantasía. Hoy son clásicos. Entonces perdieron dinero.",
        "La Segunda Guerra Mundial había cerrado buena parte del mercado europeo, y las películas eran carísimas.",
        "En mil novecientos cuarenta y uno, muchos de sus animadores se pusieron en huelga para reclamar mejores sueldos y condiciones. Fue un golpe muy duro para Walt, que se sintió traicionado.",
        "Durante la guerra, el estudio sobrevivió haciendo películas de entrenamiento y propaganda para el gobierno de Estados Unidos.",
        "No volvió a vivir un gran éxito hasta mil novecientos cincuenta, con La Cenicienta.",
    ], [("cap9", 0, -0.6), ("di_duro", 0, 1.0), ("di_pinocho", 1, 0), ("di_guerra", 2, 0), ("di_huelga", 3, 0), ("di_propaganda", 4, 0), ("di_cenicienta", 5, 0)]),
    ("10. El domingo negro", [
        "Walt tenía otro sueño: un parque donde los padres y los hijos pudieran divertirse juntos.",
        "Lo construyó en Anaheim, en California, en apenas un año. Disneyland abrió el diecisiete de julio de mil novecientos cincuenta y cinco.",
        "Y la inauguración fue un desastre.",
        "Según las crónicas, entraron muchas más personas de las previstas, algunas con entradas falsas. Hacía muchísimo calor y el asfalto, recién puesto, estaba tan blando que los tacones se quedaban clavados.",
        "Faltaba agua, se acabó la comida y varias atracciones se estropearon. Los empleados lo llamaron el domingo negro.",
        "Pero Walt fue corrigiendo los problemas. Y en pocos meses, Disneyland era un éxito enorme.",
    ], [("cap10", 0, -0.6), ("di_parque", 0, 1.0), ("di_1955", 1, 0), ("di_desastre", 2, 0), ("di_tacones", 3, 0), ("di_negro", 4, 0), ("di_exito", 5, 0)]),
    ("11. El imperio", [
        "Walt Disney murió en diciembre de mil novecientos sesenta y seis. No llegó a ver terminado su siguiente gran proyecto, un parque en Florida, que abrió en mil novecientos setenta y uno.",
        "Después llegaron más parques: Tokio, París, Hong Kong, Shanghái.",
        "Y en las últimas décadas, Disney se ha dedicado a comprar algunas de las historias más famosas del mundo.",
        "Compró Pixar, el estudio de Toy Story. Después Marvel, la de los superhéroes. Luego Lucasfilm, la de Star Wars. Y finalmente buena parte de la Fox, con Los Simpson incluidos.",
        "En dos mil diecinueve lanzó su propia plataforma de streaming, Disney más.",
    ], [("cap11", 0, -0.6), ("di_muere", 0, 1.0), ("di_parques", 1, 0), ("di_comprar", 2, 0), ("di_compras", 3, 0), ("di_streaming", 4, 0)]),
    ("12. El conejo vuelve a casa", [
        "Y hay un final que parece de película.",
        "En dos mil seis, casi ochenta años después de perderlo, Disney recuperó a Oswald, el conejo afortunado.",
        "Lo consiguió en un intercambio muy curioso con la cadena de televisión propietaria de Universal: a cambio, Disney dejó marchar a un conocido comentarista deportivo que trabajaba para su cadena y que quería irse a la competencia.",
        "Un periodista deportivo a cambio de un conejo de dibujos animados.",
        "Y en dos mil veinticuatro pasó algo al revés: la primera versión de Mickey, la de Steamboat Willie, pasó a ser de dominio público en Estados Unidos. Aunque las versiones posteriores y la marca siguen protegidas.",
    ], [("cap12", 0, -0.6), ("di_final_peli", 0, 1.0), ("di_2006", 1, 0), ("di_intercambio", 2, 0), ("di_periodista", 3, 0), ("di_dominio", 4, 0)]),
    ("13. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: lee la letra pequeña. Walt perdió a Oswald porque no era el dueño de su propio personaje.",
        "Dos: una ruina no es el final. Disney quebró con veintiún años y perdió a su primer personaje… y luego construyó un imperio.",
        "Y tres: si todo el mundo dice que es una locura, puede que sea una locura… o puede que sea Blancanieves.",
    ], [("cap13", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "Un chico repartiendo periódicos, un estudio en quiebra, un conejo perdido, un ratón nacido en un tren y una princesa que todos llamaban locura.",
        "La próxima vez que veas unas orejas redondas, acuérdate del conejo.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Cuál es tu película de Disney favorita? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("di_final", 0, 0), ("di_conejo2", 1, 0), ("marca_canal", 2, 0), ("cta_comentarios", 3, 0), ("cta_suscribe", 4, 0)]),
]
FUENTES = [
    ("The Walt Disney Company, «Walt Disney's 1927 animated star Oswald the Lucky Rabbit returns to Disney» (2006)", "https://thewaltdisneycompany.com/walt-disneys-1927-animated-star-oswald-the-lucky-rabbit-returns-to-disney/"),
    ("San Francisco Silent Film Festival, «Oswald the Lucky Rabbit (1927-1928)»", "https://silentfilm.org/oswald-the-lucky-rabbit-1927-1928"),
    ("Laughing Place, «A lucky rabbit after all: David Gerstein on the history of Oswald»", "https://www.laughingplace.com/w/featured/2016/02/02/lucky-rabbit-afterall-david-gerstein-history-oswald/"),
    ("Wikipedia, «Walt Disney»", "https://en.wikipedia.org/wiki/Walt_Disney"),
    ("Wikipedia, «Steamboat Willie»", "https://en.wikipedia.org/wiki/Steamboat_Willie"),
    ("Wikipedia, «Snow White and the Seven Dwarfs (1937 film)»", "https://en.wikipedia.org/wiki/Snow_White_and_the_Seven_Dwarfs_(1937_film)"),
    ("Wikipedia, «Disneyland»", "https://en.wikipedia.org/wiki/Disneyland"),
    ("Neal Gabler, «Walt Disney: el triunfo de la imaginación americana» (2006)", ""),
]
DESCRIPCION = ("Walt Disney se arruinó con 21 años. En 1928 perdió a su primer gran personaje, Oswald el conejo afortunado, porque los derechos no eran suyos. "
               "En el tren de vuelta, según contaba, se le ocurrió un ratón: Mickey. Después llegaron Steamboat Willie, la «locura» de Blancanieves y un "
               "Disneyland que abrió con un desastre. Y en 2006, Disney recuperó por fin a su conejo. Esta es la historia de Disney.")
ETIQUETAS = "disney, historia de disney, walt disney, mickey mouse, oswald el conejo afortunado, steamboat willie, blancanieves, disneyland, ub iwerks, pixar, marvel, historia de marcas, código de barras"
HASHTAGS = "#Disney #MickeyMouse #HistoriaDeMarcas"
LISTA = "Ocio y entretenimiento"
NOTA = "Nota: algunas anécdotas (la idea de Mickey en el tren, el nombre propuesto por Lillian, la hipoteca de la casa) proceden de relatos del propio Walt y de sus biografías."
PREGUNTA = "¿TU PELÍCULA *DE DISNEY FAVORITA*?"
