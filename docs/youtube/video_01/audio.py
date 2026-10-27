"""Narración (Piper, voz es_ES «davefx», datos CC0), efectos de sonido, música propia y tiempos de escena.

Uso: <python> audio.py <voz> <dir_trabajo>
  <voz> = elevenlabs  (API; variables ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID)
        | locucion.mp3 (locución completa del guion, se trocea por frases)
        | modelo.onnx  (Piper local, respaldo)
Salida en <dir_trabajo>: narracion.wav, sfx.wav, musica.wav, tiempos.json, subtitulos.srt
Todo el audio que no es voz se sintetiza aquí: no hay material de terceros.
"""
import json, os, sys
import numpy as np
import soundfile as sf
from guion import SEGMENTOS
from voces import motor

SR = 48000
LONGITUD = 1.04          # >1 = algo más pausado (ritmo documental)
PAUSAS = {".": 0.34, "?": 0.42, "!": 0.38, ":": 0.28, "…": 0.45}
rng = np.random.default_rng(7)

def remuestrear(x, sr_in):
    n = int(len(x) * SR / sr_in)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)

def env(n, a=0.005, r=0.1):
    e = np.ones(n); ka, kr = int(a * SR), int(r * SR)
    e[:ka] = np.linspace(0, 1, ka); e[-kr:] *= np.linspace(1, 0, kr); return e

def lp(x, k):   # paso bajo simple por media móvil
    return np.convolve(x, np.ones(k) / k, mode="same")

# ---------- efectos ----------
def whoosh(d=0.55):
    n = int(d * SR); ruido = rng.standard_normal(n)
    t = np.linspace(0, 1, n); forma = np.sin(np.pi * t) ** 2
    suave = lp(ruido, 6) * (0.4 + 0.6 * t) + lp(ruido, 40) * (1 - t)
    return 0.35 * suave * forma
def pitido():
    out = []
    for f in (1850, 2350):
        n = int(0.08 * SR); t = np.arange(n) / SR
        out += [0.22 * np.sin(2 * np.pi * f * t) * np.hanning(n), np.zeros(int(0.035 * SR))]
    return np.concatenate(out)
def ding():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return 0.25 * (np.sin(2 * np.pi * 1320 * t) + 0.5 * np.sin(2 * np.pi * 1980 * t)) * np.exp(-4 * t)
def pop():
    n = int(0.09 * SR); t = np.arange(n) / SR
    return 0.25 * np.sin(2 * np.pi * (600 + 900 * np.exp(-30 * t)) * t) * np.exp(-35 * t)

# ---------- música: lo-fi a 88 ppm (La m7 - Fa maj7 - Do maj7 - Sol) ----------
def musica(seg):
    n = int(seg * SR); out = np.zeros(n + SR * 4); bpm = 88; beat = 60 / bpm; b = int(beat * SR)
    def kick():
        m = int(0.35 * SR); t = np.arange(m) / SR
        return 0.9 * np.sin(2 * np.pi * (45 + 80 * np.exp(-25 * t)) * t) * np.exp(-9 * t)
    def snare():
        m = int(0.2 * SR); return 0.35 * lp(rng.standard_normal(m), 3) * np.exp(-np.arange(m) / SR * 22)
    def hat():
        m = int(0.05 * SR); r = rng.standard_normal(m); return 0.12 * (r - lp(r, 4)) * np.exp(-np.arange(m) / SR * 70)
    acordes = [(220, 261.63, 329.63, 392), (174.61, 220, 261.63, 329.63), (130.81, 164.81, 196, 246.94), (196, 246.94, 293.66, 392)]
    compas = 4 * b
    for i, ini in enumerate(range(0, n, compas)):
        a = acordes[i % 4]; m = compas; t = np.arange(m) / SR
        pad = sum(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * 0.3 * t)) for f in a) / 8
        pad = lp(pad, 8) * env(m, 0.3, 0.4)
        bajo = 0.35 * np.sin(2 * np.pi * a[0] / 2 * t) * env(m, 0.02, 0.2)
        out[ini:ini + m] += 0.5 * pad + bajo
        if ini > 8 * b:        # la percusión entra a los dos compases
            for k in range(4):
                p = ini + k * b
                if k in (0, 2): out[p:p + int(0.35 * SR)] += kick()
                if k in (1, 3): out[p:p + int(0.2 * SR)] += snare()
                for h in (0, b // 2):
                    q = p + h + int(0.012 * SR * (k % 2)); out[q:q + int(0.05 * SR)] += hat()
    out = out[:n]
    return (0.8 * out / np.max(np.abs(out))).astype(np.float32)

def srt_t(s):
    h, r = divmod(s, 3600); m, r = divmod(r, 60); ms = int(round((r - int(r)) * 1000))
    if ms == 1000: r, ms = r + 1, 0
    return f"{int(h):02d}:{int(m):02d}:{int(r):02d},{ms:03d}"

def main():
    voz_path, trabajo = sys.argv[1], sys.argv[2]
    os.makedirs(trabajo, exist_ok=True)
    todas = [fr for _, frases, _ in SEGMENTOS for fr in frases]
    tts = motor(voz_path, todas)
    n_frase = 0
    voz, efectos, t = [np.zeros(int(0.5 * SR))], [], 0.5
    segs, subs, escenas = [], [], []
    for si, (capitulo, frases, esc) in enumerate(SEGMENTOS):
        inicio_seg = t
        if si > 0:
            efectos.append((t, pitido())); hueco = np.zeros(int(0.5 * SR)); voz.append(hueco); t += 0.5
        ini_frases = []
        for fr in frases:
            ant = todas[n_frase - 1] if n_frase > 0 else ""
            sig = todas[n_frase + 1] if n_frase + 1 < len(todas) else ""
            a, sr_voz = tts.speak(fr, ant, sig); n_frase += 1
            a = remuestrear(a, sr_voz)
            ini_frases.append(t); subs.append((t, t + len(a) / SR, fr))
            voz.append(a); t += len(a) / SR
            p = PAUSAS.get(fr.strip()[-1], 0.3)
            voz.append(np.zeros(int(p * SR))); t += p
        voz.append(np.zeros(int(0.45 * SR))); t += 0.45
        for k, (nombre, idx, off) in enumerate(esc):
            ini = inicio_seg if k == 0 else ini_frases[idx] + off
            escenas.append({"nombre": nombre, "inicio": round(ini, 3), "capitulo": k == 0 and si > 0})
        segs.append({"capitulo": capitulo, "inicio": inicio_seg, "fin": t})
    voz.append(np.zeros(int(1.5 * SR))); t += 1.5
    for i, e in enumerate(escenas):
        e["fin"] = escenas[i + 1]["inicio"] if i + 1 < len(escenas) else t
        if i > 0:
            efectos.append((max(0, e["inicio"] - 0.25), whoosh()))
        if e["nombre"] == "cta_suscribe":
            efectos.append((e["inicio"] + 1.6, pop())); efectos.append((e["inicio"] + 1.7, ding()))
    pista = np.concatenate(voz).astype(np.float32)
    pista = pista / (np.max(np.abs(pista)) + 1e-9) * 0.9      # normalización global: respeta la dinámica natural de la voz
    fx = np.zeros(len(pista) + SR)
    for a, s in efectos:
        i = int(a * SR); fx[i:i + len(s)] += s
    sf.write(os.path.join(trabajo, "narracion.wav"), pista, SR)
    sf.write(os.path.join(trabajo, "sfx.wav"), fx[:len(pista)].astype(np.float32), SR)
    sf.write(os.path.join(trabajo, "musica.wav"), musica(t), SR)
    json.dump({"duracion": t, "segmentos": segs, "escenas": escenas,
               "frases": [{"inicio": a, "fin": b, "texto": x} for a, b, x in subs]},
              open(os.path.join(trabajo, "tiempos.json"), "w"), ensure_ascii=False, indent=1)
    with open(os.path.join(trabajo, "subtitulos.srt"), "w") as f:
        n = 0
        for a, b, txt in subs:
            palabras, lineas, actual = txt.split(), [], ""
            for p in palabras:
                if len(actual) + len(p) + 1 > 84 and actual: lineas.append(actual); actual = p
                else: actual = (actual + " " + p).strip()
            lineas.append(actual)
            total = sum(len(x) for x in lineas); ini = a
            for x in lineas:
                fin = ini + (b - a) * len(x) / total
                n += 1; f.write(f"{n}\n{srt_t(ini)} --> {srt_t(fin)}\n{x}\n\n"); ini = fin
    print(f"Duración: {t:.1f} s · {len(escenas)} escenas")

if __name__ == "__main__":
    main()
