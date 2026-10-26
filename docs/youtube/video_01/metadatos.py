"""Genera metadatos.md (título, descripción con capítulos y fuentes, etiquetas y ajustes de subida).
Uso: python3 metadatos.py <dir_trabajo> <dir_salida>"""
import json, os, sys
from guion import FUENTES
W, OUT = sys.argv[1], sys.argv[2]
t = json.load(open(os.path.join(W, "tiempos.json")))
def mmss(s): s = int(s); return f"{s//60:02d}:{s%60:02d}"
caps = "\n".join(f"{'00:00' if i == 0 else mmss(seg['inicio'])} {seg['capitulo']}" for i, seg in enumerate(t["segmentos"]))
fuentes = "\n".join(f"- {n}: {u}" for n, u in FUENTES)
md = f"""# Vídeo 1: metadatos para subir a YouTube

**Archivo:** `Codigo_de_Barras_01_Chupa_Chups.mp4` · 1920×1080 · 25 fps · voz Piper es_ES «davefx» · {mmss(t['duracion'])} · audio AAC normalizado a −14 LUFS
**Miniatura:** `miniatura.png` (1280×720) · **Subtítulos:** `subtitulos_es.srt` (español)

## Título (elige uno; recomendado el primero)
1. Chupa Chups: el caramelo que Dalí convirtió en icono
2. El caramelo español cuyo logotipo diseñó Dalí
3. La historia de Chupa Chups que no te contaron

## Descripción (copiar y pegar)
```
¿Sabías que el logotipo de Chupa Chups lo diseñó Salvador Dalí? Esta es la historia de cómo un caramelo con un palo, nacido en Barcelona en 1958, acabó en medio mundo: el problema que resolvía, los nombres que tuvo antes, el lugar de la tienda donde se vendía y el consejo de Dalí que cambió su envoltorio.

⏱ Capítulos
{caps}

📚 Fuentes
{fuentes}

Algunas partes de la historia (como que Dalí lo resolvió en menos de una hora o el viaje a la estación Mir) se presentan como la versión popular o la que cuenta la propia marca, tal y como indican las fuentes.

ℹ️ Este vídeo no está patrocinado por ninguna de las marcas mencionadas. Las ilustraciones son propias; no se usa el logotipo original.
🤖 Guion elaborado con asistencia de IA y revisado por una persona. Narración con voz sintética (Piper, voz «davefx»).
🎨 Ilustraciones 3D: Fluent Emoji © Microsoft (licencia MIT). Música y efectos: creación propia.

Código de Barras: la historia que no conoces de lo que tienes en casa. Un jueves, una marca.
💬 ¿Qué marca quieres que investiguemos? Déjala en los comentarios.

#ChupaChups #HistoriaDeMarcas #Dalí
```

## Etiquetas
chupa chups, historia de chupa chups, dalí logotipo, salvador dalí chupa chups, historia de marcas, marcas españolas, enric bernat, historia de empresas, documental de marcas, curiosidades de marcas, código de barras

## Ajustes en YouTube Studio
- **Público:** "No, no es contenido creado para niños" (aunque hable de caramelos, va dirigido a un público general adulto).
- **Contenido alterado o sintético:** **No**. La voz es sintética, pero es una narración evidente que no imita a ninguna persona real, y las ilustraciones no son realistas. Revisa la ayuda oficial de YouTube si cambias algo de esto.
- **Promoción pagada:** No.
- **Categoría:** Educación (alternativa: Entretenimiento).
- **Idioma del vídeo y de los subtítulos:** Español (España). Sube `subtitulos_es.srt` en Subtítulos.
- **Pantalla final (últimos 15-20 s):** botón de suscripción + "Vídeo más reciente".
- **Lista de reproducción:** "Hecho en España".
- **Programar:** jueves 5 de noviembre de 2026, 18:00 (hora peninsular).
- **Comentario fijado:** "¿Qué marca investigamos el mes que viene? Las 3 más votadas entran en la encuesta 👇"

## Revisión humana antes de publicar (5 minutos)
- [ ] Ver el vídeo completo con sonido: pronunciación de nombres (Perfetti Van Melle, Mir) y volumen de la música.
- [ ] Comprobar que los subtítulos coinciden.
- [ ] Abrir las fuentes de la descripción.
- [ ] Previsualizar la miniatura en tamaño móvil.
"""
open(os.path.join(OUT, "metadatos.md"), "w").write(md)
print("ok")
