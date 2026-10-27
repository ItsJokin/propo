"""Escenas del vídeo 3 (Danone nació en Barcelona). Motor común; sin logotipos: tarrinas genéricas dibujadas."""
from base import *

CAP_ICONOS = {1: "1f476", 2: "1f48a", 3: "1f466", 4: "1f5fd", 5: "1f3ed", 6: "1f9e0"}

def tarrina(px=260, color="#FAF7F0", tapa=AZUL, texto="YOGUR"):
    return (f'<svg width="{px}" height="{px:.0f}" viewBox="0 0 100 100"><path d="M18,28 L82,28 L74,92 L26,92Z" fill="{color}" stroke="#151515" stroke-width="3"/>'
            f'<rect x="12" y="18" width="76" height="12" rx="4" fill="{tapa}" stroke="#151515" stroke-width="3"/>'
            f'<text x="50" y="66" font-family="Bebas" font-size="16" fill="#151515" text-anchor="middle">{texto}</text></svg>')

def escenas():
    E = {}
    E["d_yogur"] = f'''{F("", True)}{obj(tarrina(380), 30, 50, "spin", "float")}{obj(spr("1f944", 170), 46, 28, "drop", "swing", .6)}
      {txt(kt("ESTA SEMANA", "l gris", .3), 70, 36, 50, "left")}{txt(kt("PROBABLEMENTE *COMISTE UNO*", "xl", .7), 70, 52, 50, "left")}'''
    E["d_gigante"] = icono_texto("1f30d", "UNO DE LOS *GIGANTES*", "de la alimentación mundial", "la marca de este yogur es…", "der", "", True, "zoom", "spin-slow")
    E["d_francesa"] = icono_texto("1f1eb-1f1f7", "¿UNA MARCA *FRANCESA*?", "eso cree mucha gente", "", "izq", "", False, "pop", "bob")
    E["d_paris_no"] = f'''{F("dark")}{txt('<div class="xl hueso tachado" style="--d:.8s">PARÍS</div>', 50, 40, 60)}{txt(kt("su historia no empieza aquí", "l naranja", 1.4), 50, 62, 80)}'''
    E["d_barcelona"] = f'''{F("calido")}{obj(skyline(1800, "#b35a2b"), 50, 86, "none")}{obj(spr("1f1ea-1f1f8", 150), 86, 18, "pop", "bob", 1.2)}
      {txt(kt("EMPIEZA EN *BARCELONA*", "mega", .4, .15, "slam"), 50, 34, 95)}{txt(kt("un padre, un hijo y un nombre cariñoso", "l", 1.3), 50, 52, 80)}'''
    E["d_isaac"] = f'''{F("sepia")}{obj(spr("1f468-200d-1f4bc", 300), 22, 50, "up", "bob")}
      {txt(kt("ISAAC CARASSO", "xl", .3), 64, 30, 60)}{txt(kt("empresario de origen sefardí", "l", .9), 64, 46, 60)}
      {obj(spr("1f1ec-1f1f7", 130), 50, 68, "pop", "", 1.3)}<svg class="pos" style="left:64%;top:68%" width="300" height="80"><path class="draw" style="--d:1.5s;--len:300" d="M10,40 L270,40 M235,12 L280,40 L235,68" fill="none" stroke="#D7263D" stroke-width="9"/></svg>
      {obj(spr("1f1ea-1f1f8", 130), 80, 68, "pop", "bob", 1.9)}{txt(kt("de Salónica a Barcelona", "m", 2.0), 64, 84, 60)}<div class="viñeta"></div>'''
    E["d_ninos"] = icono_texto("1f476", "UN PROBLEMA *MUY SERIO*", "muchos niños sufrían trastornos intestinales", "", "izq", "", False, "pop", "shake")
    E["d_tradicion"] = comparar("1f1ec-1f1f7", "allí: alimento de toda la vida", "1f95b", "el yogur", "→")
    E["d_desconocido"] = icono_texto("1f914", "CASI *DESCONOCIDO*", "en la España de entonces", "el yogur era…", "der", "", True, "zoom", "bob")
    E["d_idea"] = f'''{F("", True)}{obj(spr("1f4a1", 300), 30, 46, "drop", "glow")}{txt(kt("LA IDEA:", "l gris", .4), 66, 34, 55)}
      {txt(kt("PRODUCIR YOGUR *EN BARCELONA*", "xl", .8), 66, 52, 55)}'''
    E["d_1919"] = anio(1900, 1919, "empieza a venderlo", "1f95b")
    E["d_tiendas_no"] = f'''{F()}{obj(spr("1f3ea", 280), 30, 48, "pop", "")}{obj('<div class="equis">✖</div>', 30, 48, "pop", "pulse", .7)}
      {txt(kt("NO EN TIENDAS", "xl", .4), 68, 42, 55)}{txt(kt("de comestibles, como hoy", "l", 1.0), 68, 58, 55)}'''
    E["d_farmacia"] = f'''{F("", True)}{obj(spr("2695-fe0f", 220), 22, 32, "spin", "bob")}{obj(tarrina(300), 30, 64, "up", "float", .4)}
      {txt(kt("EN *FARMACIAS*", "mega", .6, .15, "slam"), 68, 48, 60)}{obj(spr("1f48a", 160), 84, 76, "pop", "swing", 1.3)}'''
    E["d_digestion"] = icono_texto("1f48a", "AYUDABA A LA *DIGESTIÓN*", "no se presentaba como un postre", "al principio…", "izq", "", False, "pop", "pulse")
    E["d_salud"] = impacto("el yogur entró en nuestras vidas", "POR LA PUERTA *DE LA SALUD*", "", "2695-fe0f")
    E["d_daniel"] = f'''{F("", True)}{obj(spr("1f468", 280), 28, 46, "left", "bob")}{obj(spr("1f466", 220), 42, 60, "up", "jump", .5)}
      {txt(kt("ISAAC TENÍA UN HIJO:", "l", .3), 70, 38, 50)}{txt(kt("*DANIEL*", "mega", .9, .15, "slam"), 70, 56, 50)}'''
    E["d_danon"] = f'''{F()}{obj(bocadillo("Danon!", "#ffe1b8"), 30, 40, "pop", "bob", .3)}{obj(spr("2764-fe0f", 160), 18, 66, "pop", "pulse", .8)}
      {txt(kt("EN CATALÁN, UNA FORMA CARIÑOSA", "l", .4), 66, 36, 60)}{txt(kt("DANIEL → *DANON*", "xl", 1.0), 66, 54, 60)}'''
    E["d_danone"] = f'''{F("", True)}{txt('<div class="sello" style="--d:.2s">DANONE</div>', 50, 44, 90)}{txt(kt("de ahí sale el nombre", "l", 1.0), 50, 70, 80)}'''
    E["d_apodo"] = titular("EL APODO DE *UN NIÑO*", "la marca de yogures más famosa del mundo lleva…", "", ("1f466", "1f95b", "2728", "1f30d"))
    E["d_crece"] = icono_texto("1f4c8", "DANIEL CRECIÓ…", "y con él, la empresa", "", "der", "", True, "up", "bob")
    E["d_1929"] = f'''{F("", True)}{txt(odometro(1919, 1929, .1), 50, 32, 50)}{obj(spr("1f1eb-1f1f7", 170), 30, 66, "pop", "bob", 1.2)}
      {txt(kt("DANONE EN *PARÍS*", "xl", 1.4), 62, 66, 55)}'''
    E["d_francia"] = icono_texto("1f1eb-1f1f7", "POR ESO PARECE *FRANCESA*", "en Francia empezó a crecer a lo grande", "", "izq", "", False, "pop", "bob")
    E["d_giro"] = impacto("pero la historia tiene", "OTRO *GIRO*", "", "1f440")
    E["d_guerra"] = f'''{F("espacio")}<div class="estrellas e2"></div>{obj(spr("1f6a2", 300), 50, 52, "left", "float")}
      {txt(kt("SEGUNDA GUERRA MUNDIAL", "xl hueso", .4), 50, 20, 90)}{txt(kt("Daniel se marcha a *Estados Unidos*", "l hueso", 1.2), 50, 84, 90)}'''
    E["d_dannon"] = f'''{F("", True)}{obj(spr("1f5fd", 300), 20, 52, "up", "bob")}
      {txt('<div class="xl"><span style="text-decoration:line-through;color:#8A8F98">DANONE</span></div>', 62, 30, 55, "center", .4, "pop")}
      {txt(kt("*DANNON*", "mega", 1.0, .15, "slam"), 62, 52, 55)}{txt(kt("para que sonara más americano", "l", 1.6), 62, 70, 55)}'''
    E["d_fruta"] = f'''{F("calido", True)}{obj(tarrina(320, "#FAF7F0", ROJO, "FRUTA"), 34, 52, "zoom", "float")}{obj(spr("1f353", 170), 34, 74, "drop", "bob", .8)}
      {txt(kt("LA FRUTA", "xl", .5), 70, 40, 50)}{txt(kt("EN EL *FONDO*", "mega", 1.0, .15, "slam"), 70, 58, 50)}'''
    E["d_gervais"] = flecha("1f95b", "1f9c0", "FUSIÓN CON *GERVAIS*", "y después con el grupo BSN")
    E["d_grupo"] = lista([("1f4a7", "aguas"), ("1f95b", "lácteos"), ("1f37c", "nutrición")], "EL GRUPO DANONE DE HOY")
    E["d_daniel_final"] = f'''{F("", True)}{obj(spr("1f474", 320), 28, 50, "up", "bob")}{obj(spr("1f382", 170), 44, 72, "pop", "", .8)}
      {txt(kt("DANIEL CARASSO", "xl", .3), 68, 34, 55)}{txt(kt("murió en *2009*", "xl", .9), 68, 50, 55)}{txt(kt("con más de cien años", "l", 1.5), 68, 64, 55)}'''
    E["leccion1"] = leccion(1, "un producto puede cambiar de significado", "DE LA FARMACIA *AL POSTRE*", "1f48a")
    E["leccion2"] = leccion(2, "el origen no siempre está donde crees", "*RASCA* LA ETIQUETA", "1f50d")
    E["leccion3"] = leccion(3, "un nombre con historia vale oro", "MÁS DE UN SIGLO CON *EL APODO DE UN NIÑO*", "1f466")
    E["d_final"] = f'''{F("calido")}{obj(skyline(1800, "#b35a2b"), 50, 94, "none")}{obj(tarrina(220), 50, 24, "drop", "float", .3)}{obj(spr("1f466", 150), 64, 18, "pop", "bob", 1.0)}
      {txt(kt("una farmacia de Barcelona", "l", .7), 50, 44, 80)}{txt(kt("Y UN NIÑO LLAMADO *DANIEL*", "xl", 1.3), 50, 56, 90)}'''
    return E

def miniatura():
    return f'''<div class="fondo calido" style="inset:0"></div>
      <div style="position:absolute;left:60px;top:90px;transform:rotate(-8deg)">{tarrina(430)}</div>
      <div style="position:absolute;left:330px;top:70px">{vicon("spoon", 150)}</div>
      <div class="big" style="top:120px"><div class="s">ESTE YOGUR NACIÓ EN</div><div class="q">BARCELONA</div><div class="y">1919</div></div>'''
