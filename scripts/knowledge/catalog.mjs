#!/usr/bin/env node
// Fase 3 · Catálogo maestro. Lee los ficheros mensuales de datos abiertos de la Plataforma de Contratación del Sector
// Público (perfiles propios y plataformas autonómicas agregadas) y guarda, por mes, cada expediente adjudicado con sus
// lotes, criterios, adjudicatarios y enlaces a los documentos de evaluación. Reanudable: los meses hechos no se repiten.
//   FROM=2025-01 TO=2026-09 KDIR=./conocimiento node scripts/knowledge/catalog.mjs
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { splitFeed } from '../lib/codice.mjs';
import { catalogRecord, writeJsonl, readJson, writeJson, UA } from './lib.mjs';

const KDIR = process.env.KDIR || './conocimiento';
const SETS = [
  ['p', 'https://contrataciondelestado.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3'],
  ['a', 'https://contrataciondelestado.es/sindicacion/sindicacion_1044/PlataformasAgregadasSinMenores'],
];
const now = new Date();
const last = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString().slice(0, 7);
const FROM = process.env.FROM || last; const TO = process.env.TO || last;
const MAX_MONTHS = Number(process.env.MAX_MONTHS || 6);   // por ejecución, para no pasar del tiempo de Actions
const REDO = process.env.REDO === '1';

const months = [];
for (let d = new Date(FROM + '-01T00:00:00Z'); d.toISOString().slice(0, 7) <= TO; d.setUTCMonth(d.getUTCMonth() + 1)) months.push(d.toISOString().slice(0, 7));
const statePath = path.join(KDIR, 'estado-catalogo.json');
const state = readJson(statePath, { months: {} });
let done = 0;
for (const ym of months.reverse()) {                       // primero lo más reciente: es lo que más sirve
  if (done >= MAX_MONTHS) break;
  if (state.months[ym]?.ok && !REDO && ym !== last) continue;
  const recs = new Map(); const stats = { entries: 0, records: 0, evalDocs: 0, geoRejected: 0, byScope: {}, files: 0, errors: [] };
  for (const [prefix, base] of SETS) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'propo-k-'));
    const zip = path.join(tmp, 'm.zip');
    try {
      execFileSync('curl', ['-fsSL', '--retry', '3', '--retry-delay', '20', '--max-time', '2400', '-A', UA, '-o', zip, `${base}_${ym.replace('-', '')}.zip`], { stdio: 'inherit' });
      const names = execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter((n) => n.endsWith('.atom'));
      for (const name of names) {
        const xml = execFileSync('unzip', ['-p', zip, name], { encoding: 'utf8', maxBuffer: 1 << 29 });
        stats.files++;
        for (const e of splitFeed(xml).entries) {
          stats.entries++;
          let r; try { r = catalogRecord(e, prefix); } catch { continue; }
          if (!r) continue;
          if (!r.geo.ok) { stats.geoRejected++; continue; }
          const prev = recs.get(r.id);
          if (!prev || r.updated >= prev.updated) {
            if (prev) for (const d of prev.docs) if (!r.docs.some((x) => x.uri === d.uri)) r.docs.push(d);   // una versión posterior puede no repetir todos los documentos
            recs.set(r.id, r);
          }
        }
      }
    } catch (e) { stats.errors.push(`${prefix}: ${String(e.message || e).slice(0, 200)}`); }
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const rows = [...recs.values()];
  for (const r of rows) { stats.evalDocs += r.docs.length; stats.byScope[r.geo.scope] = (stats.byScope[r.geo.scope] || 0) + 1; }
  stats.records = rows.length;
  writeJsonl(path.join(KDIR, 'catalogo', `${ym}.jsonl.gz`), rows);
  state.months[ym] = { ok: stats.errors.length === 0, at: new Date().toISOString(), ...stats };
  writeJson(statePath, state);
  console.log(`${ym}: ${stats.records} expedientes adjudicados, ${stats.evalDocs} documentos de evaluación, ${stats.geoRejected} descartados por el filtro geográfico${stats.errors.length ? ` · errores: ${stats.errors.join(' | ')}` : ''}`);
  done++;
}
