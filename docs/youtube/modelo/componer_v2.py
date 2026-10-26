"""Compone 20_nicho_publico_general.md a partir de la plantilla, el banco de ideas y la salida del modelo."""
import os, sys
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
import ideas_masivo as m
s = open(os.path.join(AQUI, "plantilla_masivo.md")).read()
sal = open(os.path.join(AQUI, "salida_masivo.md")).read()
sal = sal.replace("### Escenario", "#### Escenario").replace("### Sensibilidad", "#### Sensibilidad").replace("### Análisis inverso", "#### Análisis inverso")
open(os.path.join(os.path.dirname(AQUI), "20_nicho_publico_general.md"), "w").write(s.replace("{{IDEAS}}", m.tabla_md()).replace("{{FIN}}", sal))
