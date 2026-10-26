"""Genera la narración (Kokoro TTS), el pitido de capítulo, la música de fondo propia y los tiempos.

Uso: <python con kokoro-onnx> audio.py <dir_modelos> <dir_trabajo>
Salida en <dir_trabajo>: narracion.wav, musica.wav, tiempos.json, subtitulos.srt
"""
import json, os, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from guion import SEGMENTOS

VOZ, VELOCIDAD, SR = "em_alex", 1.0, 24000
PAUSA_FRASE, PAUSA_SEGMENTO = 0.35, 0.6

def pitido(sr=SR):
    # "pitido de escáner": dos tonos cortos, firma sonora de cada capítulo
    t = np.linspace(0, 0.09, int(sr * 0.09), False)
    tono = lambda f: 0.25 * np.sin(2 * np.pi * f * t) * np.hanning(len(t))
    return np.concatenate([tono(1850), np.zeros(int(sr * 0.04)), tono(2350), np.zeros(int(sr * 0.25))])

def musica(segundos, sr=SR):
    # Fondo ambiental generado aquí (sin derechos de terceros): acordes La m - Fa - Do - Sol, 8 s cada uno
    acordes = [(220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (130.81, 196.0, 261.63), (196.0, 246.94, 293.66)]
    n = int(segundos * sr); out = np.zeros(n)
    dur = 8.0; m = int(dur * sr); env = np.sin(np.linspace(0, np.pi, m)) ** 0.6
    t = np.arange(m) / sr
    for i in range(0, n, m // 2):           # solapamiento del 50 % para que el pad sea continuo
        a = acordes[(i // (m // 2)) % 4]
        voz = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) for f in a) / 6
        voz += 0.15 * np.sin(2 * np.pi * (a[0] / 2) * t)   # bajo suave
        seg = voz * env
        fin = min(n, i + m); out[i:fin] += seg[:fin - i]
    # pulso muy suave cada 0,5 s para dar movimiento
    pulso = np.zeros(n); k = int(0.5 * sr); click = np.exp(-np.linspace(0, 40, int(0.08 * sr)))
    for i in range(0, n - len(click), k): pulso[i:i + len(click)] += 0.05 * click * np.sin(2 * np.pi * 880 * np.arange(len(click)) / sr)
    out = out + pulso
    return 0.9 * out / np.max(np.abs(out))

def srt_t(s):
    h, r = divmod(s, 3600); m, r = divmod(r, 60); ms = int(round((r - int(r)) * 1000))
    return f"{int(h):02d}:{int(m):02d}:{int(r):02d},{ms:03d}"

def main():
    modelos, trabajo = sys.argv[1], sys.argv[2]
    os.makedirs(trabajo, exist_ok=True)
    k = Kokoro(os.path.join(modelos, "kokoro-v1.0.onnx"), os.path.join(modelos, "voices-v1.0.bin"))
    pista, t, tiempos, subs = [], 0.0, [], []
    pista.append(np.zeros(int(SR * 0.4))); t += 0.4
    for capitulo, frases, escenas in SEGMENTOS:
        seg = {"capitulo": capitulo, "inicio": t, "escenas": escenas, "frases": []}
        if capitulo not in ("Introducción",):
            b = pitido(); pista.append(b); t += len(b) / SR
        for fr in frases:
            audio, sr = k.create(fr, voice=VOZ, speed=VELOCIDAD, lang="es")
            assert sr == SR
            seg["frases"].append({"texto": fr, "inicio": t, "fin": t + len(audio) / SR})
            subs.append((t, t + len(audio) / SR, fr))
            pista.append(audio); t += len(audio) / SR
            pista.append(np.zeros(int(SR * PAUSA_FRASE))); t += PAUSA_FRASE
        pista.append(np.zeros(int(SR * PAUSA_SEGMENTO))); t += PAUSA_SEGMENTO
        seg["fin"] = t
        tiempos.append(seg)
    pista.append(np.zeros(int(SR * 2.0))); t += 2.0
    voz = np.concatenate(pista).astype(np.float32)
    sf.write(os.path.join(trabajo, "narracion.wav"), voz, SR)
    sf.write(os.path.join(trabajo, "musica.wav"), musica(t).astype(np.float32), SR)
    json.dump({"duracion": t, "segmentos": tiempos}, open(os.path.join(trabajo, "tiempos.json"), "w"), ensure_ascii=False, indent=1)
    with open(os.path.join(trabajo, "subtitulos.srt"), "w") as f:
        n = 0
        for a, b, txt in subs:
            # trocear frases largas en líneas de ~42 caracteres y repartir el tiempo
            palabras, lineas, actual = txt.split(), [], ""
            for p in palabras:
                if len(actual) + len(p) + 1 > 84 and actual:
                    lineas.append(actual); actual = p
                else:
                    actual = (actual + " " + p).strip()
            lineas.append(actual)
            total = sum(len(x) for x in lineas); ini = a
            for x in lineas:
                fin = ini + (b - a) * len(x) / total
                n += 1; f.write(f"{n}\n{srt_t(ini)} --> {srt_t(fin)}\n{x}\n\n"); ini = fin
    print(f"Duración: {t:.1f} s")

if __name__ == "__main__":
    main()
