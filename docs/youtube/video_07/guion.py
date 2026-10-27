"""Guion del vídeo 7 de Código de Barras: Zara."""
TITULO = "Zara: cómo una tienda de A Coruña cambió la forma de vestir del mundo"
TITULOS_ALT = ["La historia de Zara y Amancio Ortega", "Por qué Zara cambia de ropa tan rápido"]
MARCA = "Zara"
SEGMENTOS = [
    ("Introducción", [
        "Es muy probable que lleves, o hayas llevado, algo de Zara.",
        "Hoy es una de las marcas de moda más grandes del mundo, con tiendas en los cinco continentes.",
        "Pero su historia empieza en una calle de A Coruña, en mayo de mil novecientos setenta y cinco.",
        "Y la clave de su éxito no es lo que vende, sino la velocidad a la que lo vende.",
    ], [("z_ropa", 0, 0), ("z_mundo", 1, 0), ("z_coruna", 2, 0), ("z_velocidad", 3, 0)]),
    ("1. El origen", [
        "El fundador es Amancio Ortega.",
        "Antes de Zara, ya llevaba años trabajando en el negocio textil, fabricando prendas.",
        "En mayo de mil novecientos setenta y cinco abre la primera tienda Zara, en la calle Juan Flórez de A Coruña.",
        "La idea era ofrecer ropa que siguiera las tendencias, a precios asequibles.",
        "Diez años después, en mil novecientos ochenta y cinco, nace Inditex, el grupo que hoy reúne a Zara y a otras marcas.",
    ], [("cap1", 0, -0.6), ("z_ortega", 0, 1.0), ("z_textil", 1, 0), ("z_1975", 2, 0), ("z_idea", 3, 0), ("z_inditex", 4, 0)]),
    ("2. La velocidad", [
        "¿Qué hace diferente a Zara?",
        "La mayoría de marcas de moda diseñaban sus colecciones con muchos meses de antelación.",
        "Zara hizo algo distinto: controlar gran parte del proceso, desde el diseño hasta la tienda, para poder reaccionar rápido.",
        "Si algo se vende, se fabrica más. Si no se vende, se retira y se prueba otra cosa.",
        "Las tiendas reciben ropa nueva con mucha frecuencia, así que lo que ves hoy puede no estar dentro de unas semanas.",
        "Ese modelo tiene nombre: moda rápida. Y la expresión «fast fashion» se usó en un artículo del New York Times, en mil novecientos ochenta y nueve, precisamente para hablar de Zara.",
    ], [("cap2", 0, -0.6), ("z_diferente", 0, 1.0), ("z_meses", 1, 0), ("z_control", 2, 0), ("z_vende", 3, 0), ("z_frecuencia", 4, 0), ("z_fastfashion", 5, 0)]),
    ("3. La conquista del mundo", [
        "En mil novecientos ochenta y ocho, Zara abre su primera tienda fuera de España: en Oporto, Portugal.",
        "Después llegarían Nueva York, París y, poco a poco, el resto del mundo.",
        "En dos mil uno, Inditex sale a bolsa, y consigue unos dos mil cuatrocientos millones de euros.",
        "Amancio Ortega se convierte en una de las personas más ricas del planeta.",
        "Y, sin embargo, durante años fue un empresario muy discreto, que apenas concedía entrevistas.",
    ], [("cap3", 0, -0.6), ("z_oporto", 0, 1.0), ("z_ciudades", 1, 0), ("z_bolsa", 2, 0), ("z_rico", 3, 0), ("z_discreto", 4, 0)]),
    ("4. El otro lado", [
        "La moda rápida también tiene críticas.",
        "Producir tanta ropa, tan deprisa, plantea preguntas sobre el impacto en el medio ambiente y las condiciones de trabajo en la cadena de producción.",
        "Son debates que afectan a todo el sector, y a los que las grandes marcas, incluida Inditex, intentan responder con compromisos de sostenibilidad.",
        "Es la otra cara de un modelo que cambió la forma de vestir de millones de personas.",
    ], [("cap4", 0, -0.6), ("z_criticas", 0, 1.0), ("z_impacto", 1, 0), ("z_debate", 2, 0), ("z_otracara", 3, 0)]),
    ("5. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: la velocidad puede ser una ventaja más poderosa que el precio.",
        "Dos: escuchar lo que se vende de verdad vale más que adivinar lo que se venderá.",
        "Y tres: una gran empresa global puede nacer en cualquier esquina. Incluso en una calle de A Coruña.",
    ], [("cap5", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),
    ("Final", [
        "La próxima vez que entres en una tienda Zara, fíjate: lo que ves es el resultado de una carrera contra el reloj que empezó en mil novecientos setenta y cinco.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Qué opinas de la moda rápida? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("z_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]
FUENTES = [
    ("Modaes, «Zara Turns 50: The Story Behind Inditex's Fashion Revolution»", "https://www.modaes.com/global/companies/zara-turns-50-the-story-of-the-inditex-revolution"),
    ("Ara, «Fifty years of Zara, the fashion juggernaut»", "https://en.ara.cat/business/fifty-years-of-zara-the-fashion-juggernaut_130_5578215.html"),
    ("EBSCO Research Starters, «Amancio Ortega»", "https://www.ebsco.com/research-starters/biography/amancio-ortega"),
    ("Culture Trip, «Amancio Ortega: the secret life of the world's richest man»", "https://www.theculturetrip.com/europe/spain/articles/amancio-ortega-the-secret-life-of-the-worlds-richest-man"),
    ("Bloomberg Billionaires Index, Amancio Ortega", "https://www.bloomberg.com/billionaires/id/3333475"),
]
DESCRIPCION = ("En mayo de 1975, Amancio Ortega abrió la primera tienda Zara en la calle Juan Flórez de A Coruña. Medio siglo después, Zara es una de "
               "las marcas de moda más grandes del mundo. La clave: la velocidad. Esta es la historia de Zara, de Inditex y de la moda rápida, con sus "
               "luces y sus sombras.")
ETIQUETAS = "zara, historia de zara, amancio ortega, inditex, moda rápida, fast fashion, a coruña, marcas españolas, historia de marcas, código de barras"
HASHTAGS = "#Zara #Inditex #HistoriaDeMarcas"
LISTA = "Hecho en España"
NOTA = ""
PREGUNTA = "¿QUÉ OPINAS DE LA *MODA RÁPIDA*?"
