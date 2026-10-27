"""Exporta el guion para ElevenLabs: un archivo de texto por capítulo (cada uno muy por debajo del límite
de 2.500 caracteres por generación del plan gratuito y de 5.000 de los de pago), una frase por línea.
Uso: python3 exportar_guion.py <carpeta_salida>"""
import os, re, sys, unicodedata
from guion import SEGMENTOS
out = sys.argv[1] if len(sys.argv) > 1 else "salida/elevenlabs_capitulos"
os.makedirs(out, exist_ok=True)
for i, (capitulo, frases, _) in enumerate(SEGMENTOS, 1):
    plano = unicodedata.normalize("NFKD", capitulo.lower()).encode("ascii", "ignore").decode()
    nombre = re.sub(r"[^a-z0-9]+", "_", plano).strip("_")
    texto = "\n".join(frases) + "\n"
    open(os.path.join(out, f"{i:02d}_{nombre}.txt"), "w").write(texto)
    print(f"{i:02d}_{nombre}.txt  {len(texto)} caracteres")
