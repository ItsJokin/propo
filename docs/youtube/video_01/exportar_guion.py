"""Exporta el guion como texto listo para pegar en ElevenLabs (web), con una pausa marcada entre frases.
La pausa <break time="0.8s" /> ayuda a trocear después la locución por frases sin errores.
Uso: python3 exportar_guion.py > salida/guion_para_elevenlabs.txt"""
from guion import SEGMENTOS
bloques = []
for capitulo, frases, _ in SEGMENTOS:
    bloques.append(' <break time="0.8s" /> '.join(frases))
print(' <break time="1.2s" />\n\n'.join(bloques))
