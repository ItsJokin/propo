"""Genera metadatos.md, titulo.txt y descripcion.txt a partir del guion del vídeo y de los tiempos reales.
Uso: python3 metadatos.py <dir_video> <dir_trabajo> <dir_salida> <archivo_mp4>"""
import json, os, sys
video, W, OUT, mp4 = sys.argv[1:5]
sys.path.insert(0, os.path.abspath(video))
import guion as G
t = json.load(open(os.path.join(W, "tiempos.json")))
def mmss(s): s = int(s); return f"{s//60:02d}:{s%60:02d}"
caps = "\n".join(f"{'00:00' if i == 0 else mmss(seg['inicio'])} {seg['capitulo']}" for i, seg in enumerate(t["segmentos"]))
fuentes = "\n".join((f"- {n}: {u}" if u else f"- {n}") for n, u in G.FUENTES)
nota = f"\n{G.NOTA}\n" if getattr(G, "NOTA", "") else ""
descripcion = f"""{G.DESCRIPCION}

⏱ Capítulos
{caps}

📚 Fuentes
{fuentes}
{nota}
ℹ️ Este vídeo no está patrocinado por ninguna de las marcas mencionadas. Las ilustraciones son propias; no se usan logotipos originales.
🤖 Guion elaborado con asistencia de IA y revisado por una persona. Narración con voz sintética de ElevenLabs.
🎨 Ilustraciones 3D: Fluent Emoji © Microsoft (licencia MIT). Música y efectos: creación propia.

Código de Barras: la historia que no conoces de lo que tienes en casa. Nuevas historias cada semana.
💬 ¿Qué marca quieres que investiguemos? Déjala en los comentarios.

{G.HASHTAGS}"""
md = f"""# {G.TITULO}: metadatos para subir a YouTube

**Archivo:** `{os.path.basename(mp4)}` · 1920×1080 · 25 fps · voz ElevenLabs · {mmss(t['duracion'])} · audio normalizado a −14 LUFS
**Miniatura:** `miniatura.png` (1280×720) · **Subtítulos:** `subtitulos_es.srt` (español)

## Título (recomendado el primero)
1. {G.TITULO}
""" + "".join(f"{i}. {x}\n" for i, x in enumerate(G.TITULOS_ALT, 2)) + f"""
## Descripción (copiar y pegar)
```
{descripcion}
```

## Etiquetas
{G.ETIQUETAS}

## Ajustes en YouTube Studio
- **Público:** "No, no es contenido creado para niños".
- **Contenido alterado o sintético:** No (narración evidente que no imita a ninguna persona real; ilustraciones no realistas).
- **Promoción pagada:** No · **Categoría:** Educación · **Idioma:** Español (España). Sube `subtitulos_es.srt`.
- **Pantalla final:** "Vídeo más reciente" sobre el rectángulo de la izquierda y el botón de suscripción sobre el círculo de la derecha (últimos 15 s).
- **Lista de reproducción:** {G.LISTA}.
- **Comentario fijado:** "¿Qué marca investigamos el mes que viene? Las 3 más votadas entran en la encuesta 👇"

## Revisión antes de publicar
- [ ] Ver el vídeo entero con sonido: que la imagen cuadre con la voz en los cambios de escena.
- [ ] Comprobar que los subtítulos coinciden.
- [ ] Previsualizar la miniatura en tamaño móvil.
"""
open(os.path.join(OUT, "metadatos.md"), "w").write(md)
open(os.path.join(OUT, "titulo.txt"), "w").write(G.TITULO + "\n")
open(os.path.join(OUT, "descripcion.txt"), "w").write(descripcion + "\n")
print("metadatos ok")
