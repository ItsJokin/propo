#!/usr/bin/env node
// Fase 4 · Recuperación documental. Descarga los documentos de evaluación del catálogo (primero los informes de
// valoración de los criterios de juicio de valor), extrae su texto y controla la calidad. Una petición cada pocos
// segundos, nunca en paralelo, con reintentos espaciados; los ya procesados no se repiten (huella SHA-256).
// No se guardan los PDF (se pueden volver a descargar de su URL oficial): solo el texto y su huella.
//   KDIR=./conocimiento RUN_MINUTES=40 node scripts/knowledge/harvest.mjs
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { readJsonl, writeJsonl, readJson, writeJson, hash, sleep, UA, PRIORITY } from './lib.mjs';

const KDIR = process.env.KDIR || './conocimiento';
const RUN_MS = Number(process.env.RUN_MINUTES || 40) * 60000;
const DELAY = Number(process.env.DELAY_MS || 2500);
const MAX_BYTES = 40 * 1024 * 1024;
const TYPES = (process.env.TYPES || 'informe_valoracion,informe_valoracion_libre').split(',');
const t0 = Date.now();

const statePath = path.join(KDIR, 'estado-textos.json');
const state = readJson(statePath, {});
const catDir = path.join(KDIR, 'catalogo');
const months = fs.existsSync(catDir) ? fs.readdirSync(catDir).filter((f) => f.endsWith('.jsonl.gz')).sort().reverse() : [];

// Cola: documentos pendientes, por prioridad de tipo y del mes más reciente al más antiguo.
const queue = [];
for (const f of months) for (const r of readJsonl(path.join(catDir, f))) for (const d of r.docs) {
  if (!TYPES.includes(d.type) || state[d.id]) continue;
  queue.push({ d, exp: r.id, pri: (PRIORITY[d.type] ?? (d.type === 'informe_valoracion_libre' ? 2 : 9)), month: f.slice(0, 7) });
}
queue.sort((a, b) => a.pri - b.pri || b.month.localeCompare(a.month));
const seen = new Set(); const todo = queue.filter((q) => (seen.has(q.d.id) ? false : (seen.add(q.d.id), true)));
console.log(`Pendientes: ${todo.length} documentos (${TYPES.join(', ')})`);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'propo-h-'));
const out = []; const stats = { ok: 0, scan: 0, error: 0, format: 0, big: 0, dup: 0 };
const shas = new Set(Object.values(state).map((s) => s.h).filter(Boolean));

function textOf(file) {
  const head = fs.readFileSync(file).subarray(0, 8);
  if (head.subarray(0, 4).toString('latin1') === '%PDF') {
    let pages = 0;
    try { pages = Number((execFileSync('pdfinfo', [file], { encoding: 'utf8', timeout: 30000 }).match(/Pages:\s+(\d+)/) || [])[1]) || 0; } catch { /* sin datos */ }
    const text = execFileSync('pdftotext', ['-enc', 'UTF-8', '-q', file, '-'], { encoding: 'utf8', timeout: 120000, maxBuffer: 1 << 27 });
    return { kind: 'pdf', pages, text };
  }
  if (head[0] === 0x50 && head[1] === 0x4b) {           // DOCX (zip): texto de word/document.xml
    const xml = execFileSync('unzip', ['-p', file, 'word/document.xml'], { encoding: 'utf8', timeout: 60000, maxBuffer: 1 << 27 });
    return { kind: 'docx', pages: 0, text: xml.replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') };
  }
  return null;
}

for (const q of todo) {
  if (Date.now() - t0 > RUN_MS) break;
  const file = path.join(tmp, 'doc.bin');
  let s;
  try {
    execFileSync('curl', ['-fsSL', '--retry', '2', '--retry-delay', '15', '--max-time', '180', '--max-filesize', String(MAX_BYTES), '-A', UA, '-o', file, q.d.uri], { stdio: 'pipe' });
    const buf = fs.readFileSync(file); const h = hash(buf);
    if (shas.has(h)) { s = { s: 'dup', h }; stats.dup++; }
    else {
      const t = textOf(file);
      if (!t) { s = { s: 'formato', h }; stats.format++; }
      else {
        const text = t.text.replace(/\u0000/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
        const per = t.pages ? text.length / t.pages : text.length;
        // Control de calidad: casi sin texto por página = escaneado (cola de OCR, no entra como ejemplo).
        if (text.length < 400 || per < 150) { s = { s: 'scan', h, p: t.pages, c: text.length }; stats.scan++; }
        else {
          s = { s: 'ok', h, p: t.pages, c: text.length };
          out.push({ doc: q.d.id, exp: q.exp, type: q.d.type, name: q.d.name, uri: q.d.uri, sha256: h, kind: t.kind, pages: t.pages, chars: text.length, at: new Date().toISOString(), text: text.slice(0, 150000) });
          stats.ok++;
        }
        shas.add(h);
      }
    }
  } catch (e) {
    s = { s: /exceed|maximum file size/i.test(String(e.stderr || e.message)) ? 'grande' : 'error', e: String(e.message || e).slice(0, 120) };
    if (s.s === 'grande') stats.big++; else stats.error++;
  }
  state[q.d.id] = { ...s, at: new Date().toISOString().slice(0, 10) };
  await sleep(DELAY);
}

if (out.length) writeJsonl(path.join(KDIR, 'textos', `${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.jsonl.gz`), out);
writeJson(statePath, state);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Hecho: ${JSON.stringify(stats)} · quedan ${Math.max(0, todo.length - Object.values(stats).reduce((a, b) => a + b, 0))}`);
