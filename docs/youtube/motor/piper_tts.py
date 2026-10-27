"""Inferencia mínima de voces Piper (VITS ONNX) con fonemas de espeak-ng vía phonemizer."""
import json, numpy as np, onnxruntime as ort
import espeakng_loader
from phonemizer.backend.espeak.wrapper import EspeakWrapper
from phonemizer import phonemize
EspeakWrapper.set_library(espeakng_loader.get_library_path())
EspeakWrapper.set_data_path(espeakng_loader.get_data_path())

class Piper:
    def __init__(self, onnx_path):
        self.cfg = json.load(open(onnx_path + ".json"))
        self.map = self.cfg["phoneme_id_map"]
        self.sr = self.cfg["audio"]["sample_rate"]
        self.sess = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
    def ids(self, text):
        ph = phonemize(text, language=self.cfg["espeak"]["voice"], backend="espeak", preserve_punctuation=True, with_stress=True, strip=True, njobs=1)
        out = list(self.map["^"])
        for c in ph:
            if c in self.map:
                out += self.map[c] + self.map["_"]
        out += self.map["$"]
        return out, ph
    def speak(self, text, length=1.0, noise=0.667, noise_w=0.8, sid=None):
        ids, ph = self.ids(text)
        inp = {"input": np.array([ids], dtype=np.int64), "input_lengths": np.array([len(ids)], dtype=np.int64),
               "scales": np.array([noise, length, noise_w], dtype=np.float32)}
        if sid is not None and self.cfg.get("num_speakers", 1) > 1:
            inp["sid"] = np.array([sid], dtype=np.int64)
        audio = self.sess.run(None, inp)[0].squeeze()
        return audio.astype(np.float32), ph
