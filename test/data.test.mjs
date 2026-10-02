// Prueba del robot de datos con respuestas reales guardadas (test/fixtures): sin red.
//   node test/data.test.mjs
import fs from 'fs';
import os from 'os';
import path from 'path';
import assert from 'assert';
import { Store } from '../scripts/lib/store.mjs';
import { FEEDS, syncFeed, syncTedTenders, syncTedAwards, dedupeTenders } from '../scripts/lib/pipeline.mjs';
import { T, A } from '../shared/schema.mjs';

const fx = (f) => fs.readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8');
const atom = fx('placsp-sample.atom'); const ted = JSON.parse(fx('ted-sample.json'));
const res = (body, status = 200) => ({ ok: status === 200, status, text: async () => body, json: async () => JSON.parse(body) });
let calls = [];
const fetchImpl = async (url, opts = {}) => {
  calls.push(url);
  if (url === FEEDS.placsp.url) return res(atom);
  if (url.includes('api.ted.europa.eu')) { const q = JSON.parse(opts.body); const all = q.query.includes('cn-standard') ? ted.tenders : ted.awards; return res(JSON.stringify({ notices: q.page === 1 ? all : [] })); }
  return res('', 404);
};
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'propo-data-'));
const quiet = () => {};

let store = new Store(dir);
const r1 = await syncFeed(store, 'placsp', { fetchImpl, firstRunFiles: 1, log: quiet });
assert.equal(r1.entries, 5);
assert.ok(store.tenders.size >= 1, 'hay licitaciones abiertas del feed');
const t = [...store.tenders.values()][0];
assert.match(t[T.id], /^p:\d+$/); assert.ok(t[T.docs].some((d) => d[2] === 'pcap'), 'trae el enlace al PCAP'); assert.ok(t[T.crit].length, 'trae criterios');
const stubTenders = ted.tenders.length;
await syncTedTenders(store, { fetchImpl, log: quiet }).catch((e) => assert.match(e.message, /solo/)); // la muestra tiene menos de 50 con plazo → no sustituye
const n = await syncTedAwards(store, '20260901', '20260930', { fetchImpl, log: quiet });
assert.ok(n > 150, 'adjudicaciones de TED leídas');
dedupeTenders(store);
assert.equal(store.save({ sources: {} }), true);

const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
const total = Object.values(index.awards).reduce((a, b) => a + b, 0);
assert.ok(total > 150 && Object.keys(index.awards).every((k) => /^\d\d-20\d\d$/.test(k)), 'particiones por división CPV y año');
for (const key of Object.keys(index.awards)) {
  const p = JSON.parse(fs.readFileSync(path.join(dir, 'awards', `${key}.json`), 'utf8'));
  for (const row of p.rows) {
    assert.ok(p.buyers[row[A.buyer]], 'órgano en el diccionario');
    for (const w of row[A.winners]) { const win = p.winners[w]; assert.ok(win && win[0]); if (win[0].startsWith('Persona física')) assert.equal(win[1], ''); else assert.ok(!/^\d{8}[A-Z]$/.test(win[1]), 'nunca se guarda un DNI'); }
  }
}
// segunda pasada: nada nuevo → sin cambios y sin releer ficheros antiguos
store = new Store(dir); calls = [];
const r2 = await syncFeed(store, 'placsp', { fetchImpl, log: quiet });
assert.equal(r2.entries, 0); assert.equal(calls.length, 1);
assert.equal(store.save({ sources: {} }), false, 'sin cambios no se publica');
// lote adjudicado con presupuesto → baja calculable
const p44 = Object.keys(index.awards).filter((k) => k.startsWith('44-'));
assert.ok(p44.length, 'adjudicaciones del feed de la Plataforma');
const lot = JSON.parse(fs.readFileSync(path.join(dir, 'awards', `${p44[0]}.json`), 'utf8')).rows.find((r) => r[A.id].startsWith('p:'));
assert.ok(lot[A.budget] > 0 && lot[A.amount] > 0 && lot[A.amount] <= lot[A.budget] && lot[A.offers] > 0);
fs.rmSync(dir, { recursive: true });
console.log(`ok — ${total} adjudicaciones en ${Object.keys(index.awards).length} particiones; ${stubTenders} anuncios TED de muestra`);
