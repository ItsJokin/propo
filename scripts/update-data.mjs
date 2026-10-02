#!/usr/bin/env node
// Robot de datos de PROPO. Se ejecuta cada pocos minutos (GitHub Actions) y deja en DATA_DIR los datos
// que lee la web: licitaciones abiertas y adjudicaciones de la Plataforma de Contratación del Sector Público,
// de las plataformas autonómicas agregadas y de TED. Incremental: solo lee lo publicado desde la última vez.
//
//   node scripts/update-data.mjs            ejecución normal
//   DATA_DIR=./data SOURCES=placsp,ted ...  variables opcionales (ver abajo)
import fs from 'fs';
import { Store } from './lib/store.mjs';
import { FEEDS, syncFeed, syncTedTenders, syncTedAwards, dedupeTenders, today, ymd, monthsBack } from './lib/pipeline.mjs';

const DATA_DIR = process.env.DATA_DIR || './data';
const SOURCES = (process.env.SOURCES || 'placsp,agregadas,ted').split(',').map((s) => s.trim());
const MAX_FILES = Number(process.env.MAX_FILES || 40);            // tope de ficheros del feed por ejecución
const FIRST_RUN_FILES = Number(process.env.FIRST_RUN_FILES || 20); // histórico que trae la primera ejecución
const TED_TENDERS_EVERY_H = Number(process.env.TED_TENDERS_EVERY_H || 3);
const TED_AWARDS_EVERY_H = Number(process.env.TED_AWARDS_EVERY_H || 12);
const KEEP_MONTHS = Number(process.env.KEEP_MONTHS || 24);

const hoursSince = (iso) => iso ? (Date.now() - new Date(iso).getTime()) / 36e5 : Infinity;
const log = (...a) => console.log(...a);
const store = new Store(DATA_DIR);
const sources = { ...(store.meta.sources || {}) };

for (const name of Object.keys(FEEDS)) {
  if (!SOURCES.includes(name)) continue;
  try {
    log(`→ ${FEEDS[name].label}`);
    sources[name] = { label: FEEDS[name].label, ...(await syncFeed(store, name, { maxFiles: MAX_FILES, firstRunFiles: FIRST_RUN_FILES, log })) };
  } catch (e) {
    log(`  ✗ ${name}: ${e.message}`);
    sources[name] = { ...(sources[name] || {}), label: FEEDS[name].label, ok: false, error: String(e.message).slice(0, 200), failedAt: new Date().toISOString() };
  }
}

if (SOURCES.includes('ted')) {
  const label = 'TED (Diario Oficial de la UE)';
  try {
    if (hoursSince(store.state.ted.tendersAt) >= TED_TENDERS_EVERY_H) {
      log('→ TED: licitaciones abiertas');
      sources.ted = { label, ...(await syncTedTenders(store, { log })) };
    }
    if (hoursSince(store.state.ted.awardsAt) >= TED_AWARDS_EVERY_H) {
      log('→ TED: adjudicaciones recientes');
      const from = new Date(); from.setUTCDate(from.getUTCDate() - 45);
      const n = await syncTedAwards(store, ymd(from), ymd(new Date()), { log });
      store.state.ted.awardsAt = new Date().toISOString();
      sources.ted = { ...(sources.ted || { label }), ok: true, awardsAt: store.state.ted.awardsAt, awardsRead: n };
    }
  } catch (e) {
    log(`  ✗ TED: ${e.message}`);
    sources.ted = { ...(sources.ted || {}), label, ok: false, error: String(e.message).slice(0, 200), failedAt: new Date().toISOString() };
  }
}

store.pruneTenders(today());
const dup = dedupeTenders(store);
store.prune(monthsBack(KEEP_MONTHS));
const changed = store.save({ sources, repo: process.env.GITHUB_REPOSITORY || store.meta.repo || '', keepMonths: KEEP_MONTHS });
log(`Licitaciones abiertas: ${store.tenders.size} (${dup} duplicadas con TED retiradas) · adjudicaciones: ${store.meta.counts.awards} · cambios: ${changed}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
