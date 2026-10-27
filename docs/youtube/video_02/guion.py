"""Guion del vídeo 2 de Código de Barras: New Coke (1985).
Formato igual que video_01/guion.py: (capítulo, frases, escenas[(nombre, índice de frase, desfase)]).
Solo hechos con fuente; lo no confirmado (cifras de cartas, frases célebres atribuidas) se omite o se presenta como versión."""

TITULO = "New Coke: el mayor error de marketing de la historia"
TITULOS_ALT = ["Coca-Cola cambió su fórmula… y tuvo que pedir perdón en 79 días", "79 días que casi hunden a Coca-Cola"]
MARCA = "New_Coke"

SEGMENTOS = [
    ("Introducción", [
        "El veintitrés de abril de mil novecientos ochenta y cinco, Coca-Cola hizo algo que parecía imposible.",
        "Cambió su fórmula.",
        "La primera vez en noventa y nueve años.",
        "Setenta y nueve días después, tuvo que dar marcha atrás y devolver la de siempre.",
        "Esta es la historia de cómo la marca más poderosa del mundo se equivocó a lo grande…",
        "y de por qué, quizá, ese error acabó saliéndole bien.",
    ], [("n_fecha", 0, 0), ("n_formula", 1, 0), ("n_99", 2, 0), ("n_79dias", 3, 0), ("n_error", 4, 0)]),

    ("1. El miedo", [
        "Para entender un error así, primero hay que entender un miedo.",
        "A mediados de los años setenta, Pepsi lanzó una campaña que se volvió legendaria: el Desafío Pepsi.",
        "La idea era sencilla. En la calle, te daban dos vasos sin marca. Uno era Pepsi y el otro, Coca-Cola.",
        "Probabas los dos y elegías.",
        "Y en los anuncios de Pepsi, la gente elegía Pepsi una y otra vez.",
        "Coca-Cola seguía siendo la marca más famosa del planeta, pero empezaba a sentir el aliento de su rival en la nuca.",
    ], [("cap1", 0, -0.6), ("n_pepsi_desafio", 1, 0), ("n_dos_vasos", 2, 0), ("n_elige", 3, 0), ("n_rival", 5, 0)]),

    ("2. La fórmula nueva", [
        "En Atlanta, la dirección de Coca-Cola, con Roberto Goizueta al frente, tomó una decisión radical.",
        "Si el problema era el sabor, había que cambiar el sabor.",
        "Desarrollaron una fórmula nueva, más suave y más dulce.",
        "Y la pusieron a prueba a lo grande: según la propia compañía, casi doscientas mil personas la probaron antes del lanzamiento.",
        "El resultado parecía clarísimo. La nueva fórmula ganaba a la antigua. Y ganaba a Pepsi.",
        "Así que Coca-Cola no la lanzó como un producto más. Hizo algo mucho más arriesgado: sustituyó a la de siempre.",
    ], [("cap2", 0, -0.6), ("n_atlanta", 0, 1.5), ("n_dulce", 2, 0), ("n_200mil", 3, 0), ("n_gana", 4, 0), ("n_sustituye", 5, 0)]),

    ("3. La rebelión", [
        "Y entonces pasó algo que ninguna cata había medido.",
        "La gente no estaba enfadada por el sabor. Estaba enfadada porque le habían quitado algo suyo.",
        "La compañía recibió una avalancha de llamadas y cartas de protesta.",
        "Surgieron grupos de consumidores que exigían que volviera la fórmula original.",
        "Hubo quien hizo acopio de cajas de la Coca-Cola antigua, por si no volvía a verla nunca más.",
        "Y en Pepsi lo celebraron: su presidente, Roger Enrico, publicó un anuncio presumiendo de que el rival había parpadeado primero.",
    ], [("cap3", 0, -0.6), ("n_suyo", 1, 0), ("n_cartas", 2, 0), ("n_protesta", 3, 0), ("n_acopio", 4, 0), ("n_parpadeo", 5, 0)]),

    ("4. La vuelta", [
        "Aquí está el corazón de esta historia.",
        "Las catas preguntaban: ¿qué sabe mejor?",
        "Pero nadie preguntó: ¿cómo te sentirías si la Coca-Cola de siempre desapareciera?",
        "Medían un producto. No medían una relación.",
        "El once de julio de mil novecientos ochenta y cinco, setenta y nueve días después del lanzamiento, Coca-Cola anunció la vuelta de la fórmula original.",
        "Con un nombre nuevo: Coca-Cola Classic.",
        "La noticia fue tan grande que, en Estados Unidos, una cadena de televisión interrumpió su programación para darla.",
    ], [("cap4", 0, -0.6), ("n_pregunta1", 1, 0), ("n_pregunta2", 2, 0), ("n_relacion", 3, 0), ("n_11julio", 4, 0), ("n_classic", 5, 0), ("n_tele", 6, 0)]),

    ("5. ¿Error o genialidad?", [
        "Y ahora viene el giro.",
        "Tras la vuelta de la fórmula original, la marca salió reforzada.",
        "Tanto, que muchos sospecharon que todo había sido un plan para recordarle a la gente cuánto quería su Coca-Cola.",
        "No hay ninguna prueba de eso. La propia compañía siempre lo ha negado.",
        "Lo que sí parece claro es que el error dejó una lección involuntaria: una marca no es solo lo que vende. Es lo que significa para quien la compra.",
        "¿Y la fórmula nueva? Siguió a la venta unos años, cambió de nombre a Coke dos, y en dos mil dos desapareció de las tiendas de Estados Unidos.",
    ], [("cap5", 0, -0.6), ("n_reforzada", 1, 0), ("n_plan", 2, 0), ("n_niega", 3, 0), ("n_significa", 4, 0), ("n_coke2", 5, 0)]),

    ("6. Lo que nos enseña", [
        "¿Qué nos enseña esta historia? Tres cosas.",
        "Una: los datos responden a la pregunta que haces, no a la que deberías haber hecho.",
        "Dos: cuando la gente siente que un producto es suyo, cambiarlo no es una decisión de producto. Es una decisión emocional.",
        "Y tres: rectificar rápido puede salvarte. Setenta y nueve días.",
    ], [("cap6", 0, -0.6), ("leccion1", 1, 0), ("leccion2", 2, 0), ("leccion3", 3, 0)]),

    ("Final", [
        "Hasta la marca más poderosa del mundo puede equivocarse. Lo importante es lo que hace después.",
        "Esto es Código de Barras: la historia que no conoces de lo que tienes en casa.",
        "¿Qué cambio de una marca no le has perdonado nunca? Cuéntanoslo en los comentarios.",
        "Y si te ha gustado, suscríbete.",
    ], [("n_final", 0, 0), ("marca_canal", 1, 0), ("cta_comentarios", 2, 0), ("cta_suscribe", 3, 0)]),
]

FUENTES = [
    ("Britannica, «New Coke»", "https://www.britannica.com/topic/New-Coke"),
    ("The Henry Ford, «New Coke» (Past Forward)", "https://thehenryford.org/explore/blog/new-coke"),
    ("TIME, Top 10 Bad Beverage Ideas: New Coke", "https://content.time.com/time/specials/packages/article/0,28804,1913612_1913610_1913608,00.html"),
    ("Mediavillage, «HISTORY's Moment in Media: The Return of Coca-Cola Classic»", "https://www.mediavillage.com/article/historys-moment-in-media-the-return-of-coca-cola-classic/amp/"),
    ("Mental Floss, «What was Coke II?»", "https://www.mentalfloss.com/food/beverages/what-was-coke-ii"),
    ("Stuart Elliott, «Roger Enrico and the Cola Wars»", "https://www.mediavillage.com/article/stuart-elliott-enricos-passing-prompts-a-look-back-at-the-cola-wars/amp/"),
    ("Fortune, «Roger Enrico, PepsiCo»", "https://fortune.com/2016/06/03/roger-enrico-pepsico"),
    ("EBSCO Research Starters, «Coca-Cola Introduces a New Formula»", "https://ebsco.com/research-starters/history/coca-cola-introduces-new-formula"),
]
