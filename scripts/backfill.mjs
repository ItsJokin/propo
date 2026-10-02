#!/usr/bin/env node
// Carga inicial del histórico. Usa los ficheros mensuales (.zip) de datos abiertos de la Plataforma de
// Contratación del Sector Público y las adjudicaciones de TED mes a mes. Pensado para GitHub Actions
// (necesita `curl` y `unzip`). Los cursores del robot no se tocan: la siguiente ejecución normal continúa.
//   MONTHS=12 DATA_DIR=./data node scripts/backfill.mjs
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { Store } from './lib/store.mjs';
import { splitFeed, parseEntry } from './lib/codice.mjs';
import { applyEntry, syncTedAwards, syncTedTenders, dedupeTenders, today, monthsBack } from './lib/pipeline.mjs';

const DATA_DIR = process.env.DATA_DIR || './data';
const MONTHS = Math.max(1, Math.min(24, Number(process.env.MONTHS || 12)));
const SETS = [
  ['p', 'https://contrataciondelestado.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3'],
  ['a', 'https://contrataciondelestado.es/sindicacion/sindicacion_1044/PlataformasAgregadasSinMenores'],
];
const store = new Store(DATA_DIR);
const day = today();
const months = [];
for (let i = MONTHS - 1; i >= 0; i--) { const d = new Date(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() - i); months.push(d.toISOString().slice(0, 7)); }
const sources = { ...(store.meta.sources || {}) };

for (const ym of months) {
  for (const [prefix, base] of SETS) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'propo-zip-'));
    const zip = path.join(tmp, 'm.zip');
    const url = `${base}_${ym.replace('-', '')}.zip`;
    try {
      execFileSync('curl', ['-fsSL', '--retry', '3', '--max-time', '1800', '-A', 'PROPO-data-bot/1.0', '-o', zip, url], { stdio: 'inherit' });
      const names = execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter((n) => n.endsWith('.atom')).sort();
      // El fichero sin marca de tiempo es el más reciente del mes: va al final para que gane el último estado.
      names.sort((a, b) => (/_\d{8}_\d{6}/.test(a) ? 0 : 1) - (/_\d{8}_\d{6}/.test(b) ? 0 : 1) || a.localeCompare(b));
      let n = 0;
      for (const name of names) {
        const xml = execFileSync('unzip', ['-p', zip, name], { encoding: 'utf8', maxBuffer: 1 << 28 });
        const entries = splitFeed(xml).entries.map(parseEntry).filter((p) => p.id && p.updated).sort((a, b) => a.updated.localeCompare(b.updated));
        for (const p of entries) { applyEntry(store, p, prefix, day); n++; }
      }
      console.log(`${ym} ${prefix}: ${names.length} ficheros, ${n} entradas`);
    } catch (e) {
      console.log(`${ym} ${prefix}: no disponible (${String(e.message).slice(0, 120)})`);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
    store.save({ sources }); store.release();
  }
  try {
    const from = `${ym.replace('-', '')}01`; const end = new Date(`${ym}-01T00:00:00Z`); end.setUTCMonth(end.getUTCMonth() + 1); end.setUTCDate(0);
    const n = await syncTedAwards(store, from, end.toISOString().slice(0, 10).replace(/-/g, ''), {});
    console.log(`${ym} TED: ${n} adjudicaciones`);
  } catch (e) { console.log(`${ym} TED: ${e.message}`); }
  store.save({ sources });
}
try { sources.ted = { label: 'TED (Diario Oficial de la UE)', ...(await syncTedTenders(store, {})) }; } catch (e) { console.log(`TED licitaciones: ${e.message}`); }
store.pruneTenders(day); dedupeTenders(store); store.prune(monthsBack(24));
store.save({ sources, backfilledAt: new Date().toISOString(), backfillMonths: MONTHS });
console.log(`Hecho: ${store.tenders.size} licitaciones abiertas, ${store.meta.counts.awards} adjudicaciones.`);
