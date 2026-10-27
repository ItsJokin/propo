# Herramientas de producción de Código de Barras

Scripts que usamos para escribir, revisar y renderizar los vídeos. Viven fuera de `motor/` porque son de flujo de trabajo.
Todo lo pesado (ilustraciones, fuentes, iconos, ≈2,5 GB) se descarga en `$CB` (por defecto `~/cb_trabajo`).

## Sesión nueva
1. `bash herramientas/preparar_entorno.sh` — descarga recursos y genera las hojas de sprites en `$CB/spr_comun`.
2. Voz de ElevenLabs por API: variables de entorno `ELEVENLABS_API_KEY` y `ELEVENLABS_VOICE_ID`, y `api.elevenlabs.io` permitido en la red del entorno.

## Flujo por vídeo
- `python3 herramientas/validar.py NN` — comprueba sprites, iconos, escenas y títulos de capítulo (y añade sprites nuevos).
- `bash herramientas/prep.sh NN` — vista previa con voz Piper (opcional) y hoja de contactos `$CB/hoja_NN.jpg`.
- Cola de render: añadir líneas a `$CB/cola.txt` (`API NN`, `EL NN` o `PV NN`) y lanzar
  `setsid nohup bash herramientas/cola.sh > $CB/cola.log 2>&1 < /dev/null &`.
- `bash herramientas/ajustar.sh fichero.mp4` — recomprime por debajo de ~330 MB si hace falta.
- `renum.py` (renumerar capítulos) y `arreglar_saltos.py` (saltos de línea sueltos en guiones): utilidades de edición.
