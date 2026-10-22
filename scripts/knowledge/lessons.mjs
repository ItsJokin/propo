#!/usr/bin/env node
// Fase 7 · Sistema de conocimiento. Junta catálogo, textos y extracciones y publica:
//  - lecciones/<cpv2>.json: por sector (división CPV), qué valoraron bien y mal los tribunales en cada criterio, con
//    la puntuación de la mejor y de la peor oferta y el enlace oficial. Es lo que PROPO consulta al redactar.
//  - cobertura.json y ESTADO.md: qué hay detectado, descargado, procesado y validado (fase 22 del plan).
//   KDIR=./conocimiento OUT=./conocimiento/publico node scripts/knowledge/lessons.mjs
import fs from 'fs';
import path from 'path';
import { readJsonl, readJson, writeJson, learningClass } from './lib.mjs';

const KDIR = process.env.KDIR || './conocimiento';
const OUT = process.env.OUT || path.join(KDIR, 'publico');
const MAX_ITEMS = 400;
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\b(s\.?l\.?u?|s\.?a\.?u?|sociedad|limitada|anonima|ute)\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const ls = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.jsonl.gz')).sort() : []);

const cat = new Map();
for (const f of ls(path.join(KDIR, 'catalogo'))) for (const r of readJsonl(path.join(KDIR, 'catalogo', f))) { const p = cat.get(r.id); if (!p || r.updated >= p.updated) cat.set(r.id, r); }
const texts = readJson(path.join(KDIR, 'estado-textos.json'), {});
const exState = readJson(path.join(KDIR, 'estado-extraccion.json'), {});
const extracted = {};
const byCpv = new Map();
let items = 0;
for (const f of ls(path.join(KDIR, 'extraccion'))) for (const x of readJsonl(path.join(KDIR, 'extraccion', f))) {
  const r = cat.get(x.exp); const d = x.data;
  if (!r || !d?.es_valoracion) continue;
  extracted[x.doc] = { scores: true };
  const cpv2 = String(r.cpv?.[0] || '').slice(0, 2) || 'xx';
  const winners = new Set(r.results.map((w) => norm(w.winner)));
  const date = r.results.map((w) => w.date).filter(Boolean).sort().pop() || r.updated.slice(0, 10);
  for (const lot of d.lotes || []) {
    const maxOf = new Map((lot.criterios || []).map((c) => [norm(c.nombre), Number(c.max) || null]));
    const offers = (lot.ofertas || []).filter((o) => !o.excluida);
    for (const c of lot.criterios || []) {
      if (c.tipo === 'formula') continue;
      const key = norm(c.nombre); const max = maxOf.get(key);
      const rows = offers.map((o) => ({ o, pts: (o.puntos || []).find((p) => norm(p.criterio) === key)?.puntos, com: (o.comentarios || []).find((k) => norm(k.criterio) === key) }))
        .filter((z) => typeof z.pts === 'number' || z.com);
      if (!rows.length) continue;
      rows.sort((a, b) => (b.pts ?? -1) - (a.pts ?? -1));
      const top = rows[0]; const low = rows.length > 1 ? rows[rows.length - 1] : null;
      const best = [...new Set([...(top.com?.positivo || []), ...rows.slice(1, 2).flatMap((z) => z.com?.positivo || [])])].slice(0, 5);
      const weak = [...new Set([...(low?.com?.negativo || []), ...(top.com?.negativo || [])])].slice(0, 5);
      if (!best.length && !weak.length) continue;
      const pat = (d.patrones || []).find((p) => norm(p.criterio) === key);
      const it = {
        crit: c.nombre, max, exp: r.id, ref: r.ref, title: r.title.slice(0, 140), buyer: r.buyer, nuts: r.nuts, date, offers: rows.length,
        top: { pts: top.pts ?? null, winner: winners.has(norm(top.o.empresa)) }, low: low ? { pts: low.pts ?? null } : null,
        best, weak, hypothesis: pat ? { premia: pat.premia || '', penaliza: pat.penaliza || '' } : null,
        url: r.url, doc: x.doc,
      };
      if (!byCpv.has(cpv2)) byCpv.set(cpv2, []);
      byCpv.get(cpv2).push(it); items++;
    }
  }
}
fs.mkdirSync(path.join(OUT, 'lecciones'), { recursive: true });
const index = {};
for (const [cpv2, list] of byCpv) {
  list.sort((a, b) => b.date.localeCompare(a.date));
  const kept = list.slice(0, MAX_ITEMS);
  writeJson(path.join(OUT, 'lecciones', `${cpv2}.json`), { cpv2, generated: new Date().toISOString(), note: 'best/weak resumen comentarios reales del tribunal (hecho documentado); hypothesis es una deducción a partir de ellos.', items: kept });
  index[cpv2] = { items: kept.length, total: list.length, exps: new Set(list.map((i) => i.exp)).size };
}
writeJson(path.join(OUT, 'lecciones', 'index.json'), index);

// Cobertura (detectado → descargado → procesado → validado → incorporado).
const cov = { generated: new Date().toISOString(), expedientes: cat.size, lotesAdjudicados: 0, porClase: {}, porCpv2: {}, porNuts2: {}, porAmbito: {}, meses: {}, documentos: { detectados: 0, porTipo: {} }, textos: {}, extraccion: {}, lecciones: items };
for (const r of cat.values()) {
  cov.lotesAdjudicados += r.results.length;
  const k = learningClass(r, { extracted }); cov.porClase[k] = (cov.porClase[k] || 0) + 1;
  const c2 = String(r.cpv?.[0] || '').slice(0, 2) || 'xx'; cov.porCpv2[c2] = (cov.porCpv2[c2] || 0) + 1;
  const n2 = String(r.nuts || '').slice(0, 4) || 'sin'; cov.porNuts2[n2] = (cov.porNuts2[n2] || 0) + 1;
  cov.porAmbito[r.geo.scope] = (cov.porAmbito[r.geo.scope] || 0) + 1;
  for (const d of r.docs) { cov.documentos.detectados++; cov.documentos.porTipo[d.type] = (cov.documentos.porTipo[d.type] || 0) + 1; }
}
for (const s of Object.values(texts)) cov.textos[s.s] = (cov.textos[s.s] || 0) + 1;
for (const s of Object.values(exState)) cov.extraccion[s.s] = (cov.extraccion[s.s] || 0) + 1;
const cs = readJson(path.join(KDIR, 'estado-catalogo.json'), { months: {} });
for (const [m, v] of Object.entries(cs.months)) cov.meses[m] = { expedientes: v.records, documentos: v.evalDocs, descartadosGeo: v.geoRejected, ok: v.ok };
writeJson(path.join(OUT, 'cobertura.json'), cov);

const row = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join(' · ');
fs.writeFileSync(path.join(KDIR, 'ESTADO.md'), `# Base de conocimiento de PROPO — estado

Generado: ${cov.generated}

| Fase | Cifra |
|---|---|
| Meses del catálogo | ${Object.keys(cov.meses).sort().join(', ') || '—'} |
| Expedientes adjudicados únicos | ${cov.expedientes} |
| Lotes adjudicados | ${cov.lotesAdjudicados} |
| Documentos de evaluación detectados | ${cov.documentos.detectados} (${row(cov.documentos.porTipo)}) |
| Textos | ${row(cov.textos) || '—'} |
| Extracción con IA | ${row(cov.extraccion) || '—'} |
| Lecciones publicadas | ${items} en ${Object.keys(index).length} sectores CPV |

Clases (A oferta ganadora accesible · B puntuaciones extraídas · C informe o acta sin extraer · D información parcial · F sin resultado): ${row(cov.porClase)}

Ámbito (filtro geográfico): ${row(cov.porAmbito)}

Por división CPV: ${row(cov.porCpv2)}

Por región NUTS2: ${row(cov.porNuts2)}

Notas: no se guardan los PDF, solo su texto y huella SHA-256 (se pueden volver a descargar de la URL oficial). Las ofertas técnicas de los licitadores no se publican en la Plataforma: la clase A queda vacía salvo que se obtengan por solicitud de acceso, que exige autorización expresa.
`);
console.log(`Lecciones: ${items} en ${Object.keys(index).length} sectores · expedientes ${cat.size}`);
