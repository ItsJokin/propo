// Imagen de marca a partir de un logo o de la web de la empresa: logo en PNG reducido y colores corporativos.

/** Color dominante de un logo: el más saturado y frecuente, ignorando blancos, negros y transparencias. */
export function dominantColor(cv: HTMLCanvasElement): string | null {
  try {
    const { data } = cv.getContext('2d')!.getImageData(0, 0, cv.width, cv.height);
    const bins = new Map<string, { n: number; r: number; g: number; b: number }>();
    for (let i = 0; i < data.length; i += 16) {
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      if (a < 128 || mx < 30 || (mx - mn) < 40 || mn > 225) continue;
      const k = `${r >> 5}-${g >> 5}-${b >> 5}`; const e = bins.get(k) ?? { n: 0, r: 0, g: 0, b: 0 };
      e.n++; e.r += r; e.g += g; e.b += b; bins.set(k, e);
    }
    const best = [...bins.values()].sort((a, b) => b.n - a.n)[0];
    if (!best || best.n < 20) return null;
    const hx = (v: number) => Math.round(v / best.n).toString(16).padStart(2, '0');
    return `#${hx(best.r)}${hx(best.g)}${hx(best.b)}`;
  } catch { return null; }
}

/** Logo (cualquier formato que lea el navegador, también SVG) → PNG de como mucho 640×320 y su color dominante. */
export function logoToPng(src: string): Promise<{ png: string; color: string | null } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth || 640, h = img.naturalHeight || 320;
        if (w < 24 || h < 12) { resolve(null); return; }
        const vector = /^data:image\/svg/i.test(src);   // un SVG se puede ampliar sin perder nitidez
        const k = Math.min(vector ? Infinity : 1, 640 / w, 320 / h) || 1;
        const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
        cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height);
        resolve({ png: cv.toDataURL('image/png'), color: dominantColor(cv) });
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const vivid = (h: string) => { const c = rgb(h); const mx = Math.max(...c), mn = Math.min(...c); return mx - mn >= 40 && mx >= 40 && mn <= 225; };
function hsl(h: string) {
  const [r, g, b] = rgb(h).map((v) => v / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  const hue = d === 0 ? 0 : mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: hue * 60, l };
}
// Secundario: otro tono de verdad (no una variante del principal) y que no sea casi blanco.
const far = (a: string, b: string) => { const x = hsl(a), y = hsl(b); const dh = Math.min(Math.abs(x.h - y.h), 360 - Math.abs(x.h - y.h)); return x.l < 0.85 && (dh >= 40 || Math.abs(x.l - y.l) >= 0.35); };

/** Color principal y secundario: primero lo que la web declara como marca, luego el color del logo y los más usados. */
export function brandColors(c: { theme?: string | null; vars?: string[]; css?: string[]; logo?: string | null }): { primary: string | null; secondary: string | null; all: string[] } {
  const all = [...new Set([c.theme, ...(c.vars ?? []), c.logo, ...(c.css ?? [])].filter((x): x is string => !!x && /^#[0-9a-f]{6}$/i.test(x)).map((x) => x.toLowerCase()))];
  const v = all.filter(vivid);
  const primary = v[0] ?? null;
  const secondary = primary ? v.find((x) => far(x, primary)) ?? null : null;
  return { primary, secondary, all: v.slice(0, 6) };
}
