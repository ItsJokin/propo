// Almacén en disco del robot de datos: licitaciones abiertas, particiones de adjudicaciones y estado.
// Estructura de la carpeta de datos (la que se publica junto a la web):
//   tenders.json            { v, generatedAt, rows: T[] }
//   awards/<cpv2>-<año>.json { v, buyers: string[], winners: W[], rows: A[] }
//   index.json              { awards: { '<cpv2>-<año>': nFilas } }
//   meta.json               estado de cada fuente y recuentos (lo muestra la web)
//   _state.json             cursores internos del robot
import fs from 'fs';
import path from 'path';
import { T, A, partitionOf } from '../../shared/schema.mjs';

const readJson = (file, fallback) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } };
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value)); };

export class Store {
  constructor(dir) {
    this.dir = dir;
    this.state = readJson(path.join(dir, '_state.json'), { feeds: {}, ted: {} });
    this.meta = readJson(path.join(dir, 'meta.json'), { sources: {} });
    this.tenders = new Map((readJson(path.join(dir, 'tenders.json'), { rows: [] }).rows || []).map((r) => [r[T.id], r]));
    this.parts = new Map();       // particiones cargadas
    this.dirty = new Set();
    this.where = new Map();       // id de adjudicación -> partición (solo de las cargadas)
    this.tendersChanged = false;
  }

  // ---- licitaciones abiertas ----
  upsertTender(row) {
    const prev = this.tenders.get(row[T.id]);
    if (prev && JSON.stringify(prev) === JSON.stringify(row)) return;
    this.tenders.set(row[T.id], row); this.tendersChanged = true;
  }
  removeTender(id) { if (this.tenders.delete(id)) this.tendersChanged = true; }
  replaceTenders(prefix, rows) {
    for (const id of [...this.tenders.keys()]) if (id.startsWith(prefix)) this.tenders.delete(id);
    for (const r of rows) this.tenders.set(r[T.id], r);
    this.tendersChanged = true;
  }
  pruneTenders(today) {
    for (const [id, r] of this.tenders) if (r[T.deadline] && r[T.deadline].slice(0, 10) < today) { this.tenders.delete(id); this.tendersChanged = true; }
  }

  // ---- adjudicaciones ----
  part(key) {
    let p = this.parts.get(key);
    if (!p) {
      const raw = readJson(path.join(this.dir, 'awards', `${key}.json`), { v: 1, buyers: [], winners: [], rows: [] });
      p = { ...raw, byId: new Map(raw.rows.map((r, i) => [r[A.id], i])), buyerIx: new Map(raw.buyers.map((b, i) => [b, i])), winnerIx: new Map(raw.winners.map((w, i) => [w[1] || w[0].toLowerCase(), i])) };
      this.parts.set(key, p);
    }
    return p;
  }
  upsertAward({ row, buyer, winners }) {
    if (!row[A.date] || !/^\d{4}-\d\d-\d\d$/.test(row[A.date])) return;
    const key = partitionOf(row[A.cpv], row[A.date]);
    const p = this.part(key);
    let b = p.buyerIx.get(buyer);
    if (b == null) { b = p.buyers.push(buyer) - 1; p.buyerIx.set(buyer, b); }
    row[A.buyer] = b;
    row[A.winners] = winners.map((w) => {
      const k = w[1] || w[0].toLowerCase();
      let i = p.winnerIx.get(k);
      if (i == null) { i = p.winners.push(w) - 1; p.winnerIx.set(k, i); }
      else if (p.winners[i][2] === -1 && w[2] !== -1) p.winners[i][2] = w[2];
      return i;
    });
    const at = p.byId.get(row[A.id]);
    if (at == null) { p.byId.set(row[A.id], p.rows.push(row) - 1); this.dirty.add(key); }
    else if (JSON.stringify(p.rows[at]) !== JSON.stringify(row)) { p.rows[at] = row; this.dirty.add(key); }
  }

  /** Borra adjudicaciones anteriores a `minDate` y particiones que quedan vacías. */
  prune(minDate) {
    const dir = path.join(this.dir, 'awards');
    if (!fs.existsSync(dir)) return;
    const minYear = Number(minDate.slice(0, 4));
    for (const f of fs.readdirSync(dir)) {
      const key = f.replace(/\.json$/, ''); const year = Number(key.split('-')[1]);
      if (year < minYear) { fs.rmSync(path.join(dir, f)); this.parts.delete(key); this.dirty.delete(key); this.indexChanged = true; }
      else if (year === minYear) {
        const p = this.part(key); const before = p.rows.length;
        const rows = p.rows.filter((r) => r[A.date] >= minDate);
        if (rows.length !== before) { p.rows = rows; p.byId = new Map(rows.map((r, i) => [r[A.id], i])); this.dirty.add(key); }
      }
    }
  }

  /** Escribe lo que ha cambiado. Devuelve true si la web tiene datos nuevos que publicar. */
  save(metaPatch = {}) {
    let changed = false;
    if (this.tendersChanged) {
      const rows = [...this.tenders.values()].sort((a, b) => (a[T.deadline] || '9999').localeCompare(b[T.deadline] || '9999'));
      writeJson(path.join(this.dir, 'tenders.json'), { v: 1, generatedAt: new Date().toISOString(), rows });
      changed = true;
    }
    for (const key of this.dirty) {
      const p = this.parts.get(key);
      const file = path.join(this.dir, 'awards', `${key}.json`);
      if (p.rows.length) writeJson(file, { v: 1, buyers: p.buyers, winners: p.winners, rows: p.rows }); else fs.rmSync(file, { force: true });
      changed = true;
    }
    const index = readJson(path.join(this.dir, 'index.json'), { awards: {} });
    for (const key of this.dirty) { const n = this.parts.get(key).rows.length; if (n) index.awards[key] = n; else delete index.awards[key]; }
    const dir = path.join(this.dir, 'awards');
    for (const key of Object.keys(index.awards)) if (!fs.existsSync(path.join(dir, `${key}.json`))) { delete index.awards[key]; changed = true; }
    if (changed || !fs.existsSync(path.join(this.dir, 'index.json'))) writeJson(path.join(this.dir, 'index.json'), index);
    const totalAwards = Object.values(index.awards).reduce((a, b) => a + b, 0);
    this.meta = { ...this.meta, ...metaPatch, v: 1, checkedAt: new Date().toISOString(), counts: { tenders: this.tenders.size, awards: totalAwards, partitions: Object.keys(index.awards).length } };
    if (changed) this.meta.updatedAt = this.meta.checkedAt;
    writeJson(path.join(this.dir, 'meta.json'), this.meta);
    writeJson(path.join(this.dir, '_state.json'), this.state);
    this.dirty.clear(); this.tendersChanged = false;
    return changed;
  }

  /** Libera las particiones cargadas (se vuelven a leer de disco cuando hagan falta). */
  release() { this.parts.clear(); this.where.clear();
  }
}
