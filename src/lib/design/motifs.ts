// Composiciones vectoriales por sector para portadas y aperturas: trazos sobrios en el color de la marca, nunca fotos
// de terceros ni imágenes que se puedan confundir con una obra o instalación real del licitador.
import { rgb, type PDFPage } from 'pdf-lib';
import type { Motif, RGB } from './theme';

export interface Box { x: number; y: number; w: number; h: number }   // y = borde inferior (coordenadas PDF)
const C = (c: RGB) => rgb(c[0], c[1], c[2]);
/** Pseudoaleatorio con semilla: la misma memoria siempre sale igual. */
export function seeded(seed: string) { let h = 2166136261; for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }

let clip: Box | null = null;
/** Segmento recortado a la caja del motivo (Liang–Barsky): ningún trazo invade el resto de la composición. */
function line(pg: PDFPage, x1: number, y1: number, x2: number, y2: number, c: RGB, t: number, o: number) {
  if (clip) {
    const dx = x2 - x1, dy = y2 - y1; let a = 0, b = 1;
    for (const [p, q] of [[-dx, x1 - clip.x], [dx, clip.x + clip.w - x1], [-dy, y1 - clip.y], [dy, clip.y + clip.h - y1]]) {
      if (p === 0) { if (q < 0) return; continue; }
      const r = q / p; if (p < 0) { if (r > b) return; if (r > a) a = r; } else { if (r < a) return; if (r < b) b = r; }
    }
    [x1, y1, x2, y2] = [x1 + a * dx, y1 + a * dy, x1 + b * dx, y1 + b * dy];
  }
  pg.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: t, color: C(c), opacity: o });
}

export function drawMotif(pg: PDFPage, m: Motif, b: Box, c: RGB, o = 0.18, seed = 'propo') {
  const r = seeded(seed + m); clip = b;
  const X = (u: number) => b.x + u * b.w; const Y = (v: number) => b.y + v * b.h;
  switch (m) {
    case 'girders': {   // celosía de vigas en perspectiva y una pluma de grúa
      const rows = 2;
      for (let k = 0; k < rows; k++) {
        const y0 = 0.14 + k * 0.36, y1 = y0 + 0.1 - k * 0.03;
        line(pg, X(0), Y(y0), X(1), Y(y0), c, 1.6, o); line(pg, X(0), Y(y1), X(1), Y(y1), c, 1.6, o);
        const n = 14 + k * 4;
        for (let i = 0; i < n; i++) { const a = i / n, z = (i + 1) / n; line(pg, X(a), Y(y0), X(z), Y(y1), c, 0.8, o); line(pg, X(z), Y(y0), X(z), Y(y1), c, 0.6, o * 0.8); }
      }
      line(pg, X(0.78), Y(0.05), X(0.78), Y(0.98), c, 2, o * 1.2); line(pg, X(0.4), Y(0.92), X(1), Y(0.92), c, 1.6, o * 1.2);
      line(pg, X(0.78), Y(0.98), X(0.45), Y(0.92), c, 0.8, o); line(pg, X(0.78), Y(0.98), X(0.98), Y(0.92), c, 0.8, o); line(pg, X(0.52), Y(0.92), X(0.52), Y(0.7), c, 0.6, o);
      break;
    }
    case 'skyline': {
      let x = 0;
      while (x < 1) {
        const w = 0.05 + r() * 0.09, h = 0.25 + r() * 0.65;
        pg.drawRectangle({ x: X(x), y: Y(0), width: w * b.w - 3, height: h * b.h, borderColor: C(c), borderWidth: 0.9, borderOpacity: o, opacity: 0 });
        for (let wy = 0.06; wy < h - 0.05; wy += 0.06) for (let wx = 0.012; wx < w - 0.02; wx += 0.022) if (r() > 0.45) pg.drawRectangle({ x: X(x + wx), y: Y(wy), width: 3, height: 4, color: C(c), opacity: o * 0.7 });
        x += w;
      }
      break;
    }
    case 'gears': {
      const gear = (cx: number, cy: number, R: number, teeth: number) => {
        let d = '';
        for (let i = 0; i < teeth * 2; i++) {
          const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2; const rr = i % 2 ? R : R * 1.12;
          d += `${i ? 'L' : 'M'}${(Math.cos(a0) * rr).toFixed(1)},${(Math.sin(a0) * rr).toFixed(1)} L${(Math.cos(a1) * rr).toFixed(1)},${(Math.sin(a1) * rr).toFixed(1)} `;
        }
        pg.drawSvgPath(d + 'Z', { x: cx, y: cy, borderColor: C(c), borderWidth: 1.4, borderOpacity: o, opacity: 0 });
        pg.drawCircle({ x: cx, y: cy, size: R * 0.35, borderColor: C(c), borderWidth: 1.2, borderOpacity: o, opacity: 0 });
      };
      const R = Math.min(b.w, b.h);
      gear(X(0.68), Y(0.55), R * 0.3, 18); gear(X(0.3), Y(0.3), R * 0.19, 12); gear(X(0.9), Y(0.15), R * 0.12, 9);
      break;
    }
    case 'network': {
      const pts = Array.from({ length: 26 }, () => [X(r()), Y(r())] as [number, number]);
      pts.forEach((p, i) => pts.slice(i + 1).forEach((q) => { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < Math.min(b.w, b.h) * 0.32) line(pg, p[0], p[1], q[0], q[1], c, 0.6, o * (1 - d / (Math.min(b.w, b.h) * 0.32))); }));
      pts.forEach((p, i) => pg.drawCircle({ x: p[0], y: p[1], size: i % 5 === 0 ? 4 : 2, color: C(c), opacity: Math.min(1, o * 2) }));
      break;
    }
    case 'waves': {
      for (let k = 0; k < 9; k++) {
        const base = 0.1 + k * 0.1, amp = 0.025 + r() * 0.03, ph = r() * 6; let d = '';
        for (let i = 0; i <= 60; i++) { const u = i / 60; d += `${i ? 'L' : 'M'}${(u * b.w).toFixed(1)},${(-(base + Math.sin(u * 9 + ph) * amp) * b.h).toFixed(1)} `; }
        pg.drawSvgPath(d, { x: b.x, y: b.y, borderColor: C(c), borderWidth: 1.1, borderOpacity: o * (0.5 + k / 18), opacity: 0 });
      }
      break;
    }
    case 'pylons': {
      const tower = (u: number, s: number) => {
        const bx = X(u), h = b.h * s, w = b.w * 0.07 * s;
        line(pg, bx - w, Y(0), bx - w * 0.2, Y(0) + h, c, 1, o); line(pg, bx + w, Y(0), bx + w * 0.2, Y(0) + h, c, 1, o);
        for (let i = 1; i < 7; i++) { const yy = Y(0) + (h * i) / 7, ww = w * (1 - (0.8 * i) / 7); line(pg, bx - ww, yy, bx + ww, yy, c, 0.6, o); }
        line(pg, bx - w * 1.6, Y(0) + h * 0.82, bx + w * 1.6, Y(0) + h * 0.82, c, 1, o); line(pg, bx - w * 1.2, Y(0) + h * 0.66, bx + w * 1.2, Y(0) + h * 0.66, c, 1, o);
        return [bx, Y(0) + h * 0.82, w * 1.6] as const;
      };
      const t = [tower(0.18, 0.75), tower(0.55, 0.9), tower(0.9, 0.6)];
      for (let i = 0; i < t.length - 1; i++) for (const side of [-1, 1]) {
        const [x1, y1, w1] = t[i], [x2, y2, w2] = t[i + 1];
        const sx = x1 + side * w1, ex = x2 + side * w2, mid = (y1 + y2) / 2 - b.h * 0.06;
        pg.drawSvgPath(`M0,0 Q${((ex - sx) / 2).toFixed(1)},${(-(mid - y1)).toFixed(1)} ${(ex - sx).toFixed(1)},${(-(y2 - y1)).toFixed(1)}`, { x: sx, y: y1, borderColor: C(c), borderWidth: 0.7, borderOpacity: o, opacity: 0 });
      }
      break;
    }
    case 'cross': {
      const s = 26;
      for (let y = b.y + s / 2; y < b.y + b.h; y += s) for (let x = b.x + s / 2; x < b.x + b.w; x += s) {
        const k = r(); if (k < 0.55) continue;
        const z = k > 0.92 ? 6 : 3.5;
        pg.drawRectangle({ x: x - z, y: y - z / 3.2, width: z * 2, height: z / 1.6, color: C(c), opacity: o * (k > 0.92 ? 1.6 : 1) });
        pg.drawRectangle({ x: x - z / 3.2, y: y - z, width: z / 1.6, height: z * 2, color: C(c), opacity: o * (k > 0.92 ? 1.6 : 1) });
      }
      break;
    }
    case 'roads': {
      const vx = X(0.62), vy = Y(0.72);
      for (let i = 0; i <= 10; i++) line(pg, X(-0.2 + i * 0.14), Y(0), vx, vy, c, i === 5 ? 1.6 : 0.8, o * (i === 5 ? 1.2 : 0.8));
      for (let k = 0; k < 9; k++) { const t0 = k / 9, t1 = t0 + 0.05; const cx = (X(0.5) * (1 - t0) + vx * t0), cy = Y(0) * (1 - t0) + vy * t0; const ex = X(0.5) * (1 - t1) + vx * t1, ey = Y(0) * (1 - t1) + vy * t1; line(pg, cx, cy, ex, ey, c, 2.5 * (1 - t0), o * 1.4); }
      line(pg, X(0), vy, X(1), vy, c, 0.8, o);
      break;
    }
    case 'windows': {
      const cols = 9, rows = 12, gw = b.w / cols, gh = b.h / rows;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) pg.drawRectangle({ x: b.x + i * gw + 3, y: b.y + j * gh + 3, width: gw - 6, height: gh - 6, borderColor: C(c), borderWidth: 0.7, borderOpacity: o, color: C(c), opacity: r() > 0.82 ? o * 0.9 : 0 });
      break;
    }
    case 'plates': {
      const pts = [[0.3, 0.6, 0.26], [0.72, 0.35, 0.2], [0.8, 0.8, 0.12]];
      for (const [u, v, s] of pts) for (let k = 1; k <= 4; k++) pg.drawCircle({ x: X(u), y: Y(v), size: Math.min(b.w, b.h) * s * (k / 4), borderColor: C(c), borderWidth: k === 4 ? 1.4 : 0.6, borderOpacity: o, opacity: 0 });
      break;
    }
    case 'lines': {
      for (let i = -20; i < 40; i++) { const u = i / 20; const t = r(); line(pg, X(u), Y(0), X(u + 0.6), Y(1), c, t > 0.9 ? 2.4 : 0.6, o * (t > 0.9 ? 1.3 : 0.7)); }
      break;
    }
    case 'leaves': {
      for (let k = 0; k < 16; k++) {
        const cx = X(r()), cy = Y(r()), s = 14 + r() * 26, a = r() * Math.PI;
        const dx = Math.cos(a) * s, dy = Math.sin(a) * s;
        pg.drawSvgPath(`M0,0 Q${(-dy * 0.5 + dx / 2).toFixed(1)},${(-(dx * 0.5 + dy / 2)).toFixed(1)} ${dx.toFixed(1)},${(-dy).toFixed(1)} Q${(dy * 0.5 + dx / 2).toFixed(1)},${(-(-dx * 0.5 + dy / 2)).toFixed(1)} 0,0`, { x: cx, y: cy, borderColor: C(c), borderWidth: 0.9, borderOpacity: o, color: C(c), opacity: o * 0.35 });
      }
      break;
    }
    case 'shield': {
      for (let k = 1; k <= 6; k++) { const s = Math.min(b.w, b.h) * 0.08 * k; pg.drawSvgPath(`M0,${(-s).toFixed(1)} L${s.toFixed(1)},${(-s * 0.7).toFixed(1)} L${(s * 0.85).toFixed(1)},${(s * 0.4).toFixed(1)} L0,${(s * 1.1).toFixed(1)} L${(-s * 0.85).toFixed(1)},${(s * 0.4).toFixed(1)} L${(-s).toFixed(1)},${(-s * 0.7).toFixed(1)} Z`, { x: X(0.6), y: Y(0.55), borderColor: C(c), borderWidth: 1, borderOpacity: o * (1.2 - k / 8), opacity: 0 }); }
      break;
    }
    case 'books': {
      let x = 0.05;
      while (x < 0.95) { const w = 0.03 + r() * 0.05, h = 0.35 + r() * 0.5; pg.drawRectangle({ x: X(x), y: Y(0.05), width: w * b.w, height: h * b.h, borderColor: C(c), borderWidth: 0.9, borderOpacity: o, color: C(c), opacity: r() > 0.7 ? o * 0.6 : 0 }); x += w + 0.008; }
      line(pg, X(0), Y(0.05), X(1), Y(0.05), c, 1.4, o);
      break;
    }
  }
}
