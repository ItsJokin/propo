"""Motores de voz intercambiables para audio.py. Todos devuelven (audio float32 mono, sample rate) por frase.

1) ElevenLabs por API (recomendado): necesita ELEVENLABS_VOICE_ID y la clave, bien como secreto de red del entorno
   (cabecera xi-api-key para api.elevenlabs.io, la añade el proxy) o bien en la variable ELEVENLABS_API_KEY. Usa previous_text/next_text para que la entonación
   fluya de una frase a otra. Coste: ~1 crédito por carácter (un vídeo de 5 min ≈ 5.000 caracteres).
2) Locución manual: un único MP3/WAV con todo el guion leído (por ejemplo, generado en la web de ElevenLabs o
   grabado por ti). Se trocea por frases detectando los silencios y alineándolos con la longitud de cada frase.
3) Piper (local, gratis): voz de respaldo.
"""
import hashlib, json, os, re, subprocess, urllib.request
import numpy as np

def decodificar(ruta_o_bytes, sr=48000):
    """Decodifica cualquier audio (mp3, wav…) a float32 mono con ffmpeg."""
    entrada = ruta_o_bytes if isinstance(ruta_o_bytes, str) else "pipe:0"
    datos = None if isinstance(ruta_o_bytes, str) else ruta_o_bytes
    r = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", entrada, "-f", "f32le", "-ac", "1", "-ar", str(sr), "pipe:1"],
                       input=datos, capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32).copy(), sr

def recortar_silencio(a, sr, umbral=0.02):
    idx = np.where(np.abs(a) > umbral)[0]
    if len(idx) == 0:
        return a
    return a[max(0, idx[0] - int(0.03 * sr)): min(len(a), idx[-1] + int(0.08 * sr))]

class ElevenLabs:
    URL = "https://api.elevenlabs.io/v1/text-to-speech/{voz}?output_format=mp3_44100_192"
    def __init__(self, modelo="eleven_multilingual_v2", estabilidad=0.45, similitud=0.8, estilo=0.25):
        self.clave = os.environ.get("ELEVENLABS_API_KEY", "")   # vacío: la añade el proxy del entorno (secreto de red)
        self.voz = os.environ["ELEVENLABS_VOICE_ID"]
        self.modelo, self.ajustes = modelo, {"stability": estabilidad, "similarity_boost": similitud,
                                             "style": estilo, "use_speaker_boost": True}
        self.cache = os.environ.get("ELEVENLABS_CACHE", "cache_elevenlabs")
        os.makedirs(self.cache, exist_ok=True)
    def speak(self, texto, anterior="", siguiente=""):
        cuerpo = {"text": texto, "model_id": self.modelo, "voice_settings": self.ajustes,
                  "previous_text": anterior, "next_text": siguiente}
        clave_cache = os.path.join(self.cache, hashlib.sha1(json.dumps([self.voz, cuerpo], sort_keys=True).encode()).hexdigest() + ".mp3")
        if not os.path.exists(clave_cache):        # no se paga dos veces por la misma frase
            req = urllib.request.Request(self.URL.format(voz=self.voz), data=json.dumps(cuerpo).encode(),
                                         headers={**({"xi-api-key": self.clave} if self.clave else {}), "Content-Type": "application/json", "Accept": "audio/mpeg"})
            with urllib.request.urlopen(req, timeout=120) as r:
                open(clave_cache, "wb").write(r.read())
        a, sr = decodificar(clave_cache)
        return recortar_silencio(a, sr), sr

class LocucionManual:
    """Trocea una locución completa en frases. Busca los silencios y elige, con programación dinámica,
    los cortes que mejor encajan con la proporción de caracteres acumulada de cada frase."""
    def __init__(self, ruta, frases, sr=48000):
        self.audio, self.sr = decodificar(ruta, sr)
        self.trozos = self._alinear(frases)
        self.i = 0
    def _silencios(self):
        r = subprocess.run(["ffmpeg", "-f", "f32le", "-ac", "1", "-ar", str(self.sr), "-i", "pipe:0", "-af",
                            "silencedetect=noise=-35dB:d=0.18", "-f", "null", "-"],
                           input=self.audio.astype("<f4").tobytes(), capture_output=True)
        ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr.decode())]
        fin = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr.decode())]
        return [((a + b) / 2, b - a) for a, b in zip(ini, fin)]
    def _alinear(self, frases):
        """Elige un corte por frontera de frase entre las pausas detectadas, minimizando la desviación entre la
        duración de cada frase y la esperada por su número de caracteres (y premiando las pausas largas)."""
        dur = len(self.audio) / self.sr
        cand = [c for c in self._silencios() if 0.3 < c[0] < dur - 0.3]
        n = len(frases)
        if len(cand) < n - 1:
            raise SystemExit(f"Solo hay {len(cand)} pausas para {n} frases: deja una pausa clara entre frases al generar la locución.")
        pos = np.array([0.0] + [c[0] for c in cand] + [dur]); larg = np.array([0.0] + [c[1] for c in cand] + [0.0])
        chars = np.array([len(f) for f in frases], dtype=float)
        ritmo = dur / chars.sum()
        C = len(pos); INF = 1e18
        def coste_tramo(k, i, j):   # frase k ocupa de pos[i] a pos[j]
            esperado = ritmo * chars[k]
            return ((pos[j] - pos[i] - esperado) / max(esperado, 0.6)) ** 2
        # D[k][j]: coste mínimo de colocar las frases 0..k terminando en el candidato j
        D = np.full((n, C), INF); P = np.zeros((n, C), dtype=int)
        for j in range(1, C):
            D[0, j] = coste_tramo(0, 0, j) - 0.8 * larg[j]
        for k in range(1, n):
            for j in range(k + 1, C):
                if k == n - 1 and j != C - 1: continue
                i = np.arange(k, j)
                v = D[k - 1, i] + np.array([coste_tramo(k, ii, j) for ii in i]) - 0.8 * larg[j]
                m = int(np.argmin(v)); D[k, j] = v[m]; P[k, j] = i[m]
        j = C - 1; cortes = [dur]
        for k in range(n - 1, 0, -1):
            j = P[k, j]; cortes.append(pos[j])
        cortes = [0.0] + cortes[::-1]
        return [recortar_silencio(self.audio[int(a * self.sr):int(b * self.sr)], self.sr) for a, b in zip(cortes[:-1], cortes[1:])]
    def speak(self, texto, anterior="", siguiente=""):
        t = self.trozos[self.i]; self.i += 1
        return t, self.sr

class LocucionPorCapitulos:
    """Una carpeta con un audio por capítulo (01_….mp3, 02_….mp3…, en el orden del guion).
    Cada archivo se trocea solo con las frases de su capítulo, así los cortes son mucho más fiables."""
    def __init__(self, carpeta, segmentos):
        exts = (".mp3", ".wav", ".m4a", ".flac", ".ogg")
        archivos = sorted(f for f in os.listdir(carpeta) if f.lower().endswith(exts))
        if len(archivos) != len(segmentos):
            raise SystemExit(f"Hay {len(archivos)} audios en {carpeta} y el guion tiene {len(segmentos)} capítulos.")
        self.trozos = []
        for f, frases in zip(archivos, segmentos):
            self.trozos += LocucionManual(os.path.join(carpeta, f), frases).trozos if len(frases) > 1 else \
                [recortar_silencio(*decodificar(os.path.join(carpeta, f)))]
        self.i, self.sr = 0, 48000
    def speak(self, texto, anterior="", siguiente=""):
        t = self.trozos[self.i]; self.i += 1
        return t, self.sr

def motor(voz, frases):
    """voz = 'elevenlabs' | carpeta con un audio por capítulo | locución completa (.mp3/.wav/.m4a) | modelo Piper (.onnx)."""
    if voz == "elevenlabs":
        return ElevenLabs()
    if os.path.isdir(voz):
        from guion import SEGMENTOS
        return LocucionPorCapitulos(voz, [f for _, f, _ in SEGMENTOS])
    if voz.lower().endswith((".mp3", ".wav", ".m4a", ".flac", ".ogg")):
        return LocucionManual(voz, frases)
    from piper_tts import Piper
    p = Piper(voz)
    class _P:
        def speak(self, texto, anterior="", siguiente=""):
            a, _ = p.speak(texto, length=1.04, noise=0.6, noise_w=0.85)
            return a, p.sr
    return _P()
