#!/usr/bin/env node
// Red de seguridad: si la caché de datos se ha perdido, recupera los datos desde la web ya publicada
// para no empezar de cero. Si tampoco hay web publicada (primera vez), no hace nada.
import fs from 'fs';
import path from 'path';
import { bormeFromPublished } from './lib/companies.mjs';

const DATA_DIR = process.env.DATA_DIR || './data';
const base = (process.env.PAGES_URL || '').replace(/\/$/, '');
if (fs.existsSync(path.join(DATA_DIR, 'tenders.json')) || !base) process.exit(0);
const get = async (p) => { const r = await fetch(`${base}/data/${p}`, { signal: AbortSignal.timeout(120000) }); if (!r.ok) throw new Error(`${p}: HTTP ${r.status}`); return Buffer.from(await r.arrayBuffer()); };
try {
  const index = JSON.parse((await get('index.json')).toString('utf8'));
  fs.mkdirSync(path.join(DATA_DIR, 'awards'), { recursive: true });
  for (const f of ['index.json', 'meta.json', 'tenders.json']) fs.writeFileSync(path.join(DATA_DIR, f), await get(f));
  for (const key of Object.keys(index.awards || {})) fs.writeFileSync(path.join(DATA_DIR, 'awards', `${key}.json`), await get(`awards/${key}.json`));
  // Fichas de empresa y lo leído del BORME (los nombres a buscar se rehacen solos con las adjudicaciones).
  const shards = [];
  for (let i = 0; i < 100; i++) { const k = String(i).padStart(2, '0'); try { const b = await get(`empresas/${k}.json`); fs.mkdirSync(path.join(DATA_DIR, 'empresas'), { recursive: true }); fs.writeFileSync(path.join(DATA_DIR, 'empresas', `${k}.json`), b); shards.push(JSON.parse(b.toString('utf8'))); } catch { /* sin esa parte */ } }
  const bo = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'meta.json'), 'utf8'))?.sources?.borme;
  if (shards.length) fs.writeFileSync(path.join(DATA_DIR, '_borme.json'), JSON.stringify({ v: 1, names: {}, recs: bormeFromPublished(DATA_DIR, shards), cursor: bo?.from && bo?.to ? { back: bo.from, fwd: bo.to } : null }));
  console.log(`Datos recuperados de ${base}: ${Object.keys(index.awards || {}).length} particiones, ${shards.length} partes de fichas de empresa`);
} catch (e) {
  console.log(`No hay datos publicados que recuperar (${e.message}). Se empieza de cero.`);
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
}
