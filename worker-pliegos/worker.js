// Servidor de pliegos de PROPO (Cloudflare Worker, sin dependencias: se puede pegar tal cual en el editor de Cloudflare).
// Las plataformas oficiales no dejan que una página web ajena descargue sus documentos; este Worker los pide por ella
// y se los devuelve a la web de PROPO.
//
//   GET /pliego?u=<dirección https del documento>   → el documento, con permiso de lectura para la web de PROPO
//   GET /web?u=<web de una empresa>                  → {"pages": [{url, title, text}], "brand": {logo, colors}}: el texto
//                                                      de la portada y de hasta 4 páginas suyas (quiénes somos, servicios,
//                                                      calidad…), su logo (como data URL) y sus colores corporativos
//   GET /health                                      → {"ok": true, "web": true}
//
// No es un proxy abierto: solo responde a la web de PROPO y solo descarga de plataformas de contratación conocidas.
// /web lee cualquier web pública, pero solo devuelve texto (sin scripts ni archivos), de páginas HTML pequeñas.

const ORIGINS = ['https://propo.es', 'https://www.propo.es'];
// Dominios de las plataformas de contratación (y sus subdominios).
const HOSTS = [
  'contrataciondelestado.es', 'contractaciopublica.cat', 'gencat.cat', 'euskadi.eus', 'europa.eu', 'comunidad.madrid',
  'juntadeandalucia.es', 'junta-andalucia.es', 'contratosdegalicia.gal', 'navarra.es', 'larioja.org', 'bcn.cat', 'diba.cat',
];
const MAX_BYTES = 40 * 1024 * 1024;   // 40 MB por documento

const allowedHost = (h) => HOSTS.some((d) => h === d || h.endsWith('.' + d));
const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const origin = req.headers.get('Origin') || '';
    const ok = ORIGINS.includes(origin);
    const cors = ok ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Expose-Headers': 'Content-Length, Content-Type', Vary: 'Origin' } : { Vary: 'Origin' };

    if (req.method === 'OPTIONS') return new Response(null, { status: ok ? 204 : 403, headers: cors });
    if (url.pathname === '/health') return json({ ok: true, web: true }, 200, cors);
    if (url.pathname === '/web' && req.method === 'GET') return ok ? companyWeb(url.searchParams.get('u') || '', cors) : json({ error: 'forbidden' }, 403, cors);
    if (url.pathname !== '/pliego' || req.method !== 'GET') return json({ error: 'not_found' }, 404, cors);
    if (!ok) return json({ error: 'forbidden' }, 403, cors);

    let target;
    try { target = new URL(url.searchParams.get('u') || ''); } catch { return json({ error: 'bad_url' }, 400, cors); }
    if (target.protocol !== 'https:' || !allowedHost(target.hostname)) return json({ error: 'host_not_allowed' }, 400, cors);

    let res;
    try {
      res = await fetch(target.toString(), { redirect: 'follow', headers: { 'User-Agent': 'PROPO/1.0 (+https://propo.es)', Accept: 'application/pdf,*/*' }, cf: { cacheTtl: 86400, cacheEverything: true } });
    } catch { return json({ error: 'upstream_unreachable' }, 502, cors); }
    if (!allowedHost(new URL(res.url).hostname)) return json({ error: 'host_not_allowed' }, 400, cors);   // tras redirecciones
    if (!res.ok) return json({ error: 'upstream_' + res.status }, 502, cors);
    const size = Number(res.headers.get('Content-Length') || 0);
    if (size > MAX_BYTES) return json({ error: 'too_large' }, 413, cors);

    const headers = { ...cors, 'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream', 'Cache-Control': 'private, max-age=3600' };
    if (size) headers['Content-Length'] = String(size);
    const disp = res.headers.get('Content-Disposition'); if (disp) headers['X-Upstream-Disposition'] = disp;
    return new Response(res.body, { status: 200, headers });
  },
};

// ── Web de la empresa ─────────────────────────────────────────────────────────────────────────────────────────────
const WEB_MAX = 3 * 1024 * 1024;            // 3 MB por página
const WEB_TEXT = 15000;                     // caracteres de texto por página
const INTEREST = /(empresa|nosotros|quienes|qui-som|about|servicio|serveis|services|actividad|calidad|qualitat|certific|medio|maquinaria|obras|proyectos|referencias|clientes|contact)/i;
const publicHost = (h) => !!h && h.includes('.') && !/^(\d+\.){3}\d+$/.test(h) && !h.includes(':') && !/(^|\.)(localhost|local|internal|lan|home|arpa)$/.test(h);
const entity = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
const htmlText = (h) => entity(h.replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|section|article|header|footer)>/gi, '\n').replace(/<[^>]+>/g, ' ')).replace(/[ \t\r\f\v]+/g, ' ').replace(/\n\s*/g, '\n').replace(/\n{2,}/g, '\n').trim();

async function page(u) {
  let res;
  try { res = await fetch(u, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PROPO/1.0; +https://propo.es)', Accept: 'text/html,application/xhtml+xml' }, signal: AbortSignal.timeout(10000), cf: { cacheTtl: 86400, cacheEverything: true } }); } catch { return null; }
  const final = new URL(res.url);
  if (!res.ok || !/^https?:$/.test(final.protocol) || !publicHost(final.hostname) || !/html/i.test(res.headers.get('Content-Type') || '')) return null;
  if (Number(res.headers.get('Content-Length') || 0) > WEB_MAX) return null;
  const html = (await res.text()).slice(0, WEB_MAX);
  const title = entity((/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || '').trim()).slice(0, 200);
  const links = [...html.matchAll(/<a\s[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((m) => { try { return { url: new URL(m[1], final).toString(), label: htmlText(m[2]).slice(0, 80) }; } catch { return null; } }).filter(Boolean);
  return { url: final.toString(), host: final.hostname, title, text: htmlText(html).slice(0, WEB_TEXT), links, html };
}

async function companyWeb(raw, cors) {
  let u;
  try { u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); } catch { return json({ error: 'bad_url' }, 400, cors); }
  if (!/^https?:$/.test(u.protocol) || (u.port && u.port !== '80' && u.port !== '443') || u.username || !publicHost(u.hostname)) return json({ error: 'bad_url' }, 400, cors);
  const home = (await page(u.toString())) || (u.protocol === 'https:' ? await page(u.toString().replace(/^https:/, 'http:')) : null);
  if (!home) return json({ error: 'unreachable' }, 502, cors);
  const base = home.host.replace(/^www\./, '');
  const seen = new Set([home.url]);
  const next = home.links.filter((l) => { try { const h = new URL(l.url).hostname.replace(/^www\./, ''); return h === base && INTEREST.test(`${l.url} ${l.label}`) && !/\.(pdf|jpe?g|png|zip|docx?|xlsx?)$/i.test(l.url); } catch { return false; } })
    .filter((l) => !seen.has(l.url) && seen.add(l.url)).slice(0, 4);
  const more = (await Promise.all(next.map((l) => page(l.url)))).filter(Boolean);
  const pages = [home, ...more].map(({ url, title, text }) => ({ url, title, text }));
  const brand = await brandOf(home).catch(() => null);
  return json({ pages, brand }, 200, { ...cors, 'Cache-Control': 'private, max-age=3600' });
}

// ── Imagen de marca: logo y colores ───────────────────────────────────────────────────────────────────────────────
const IMG_MAX = 1024 * 1024;   // 1 MB por imagen
const WP_DEFAULT = new Set(['black', 'cyan-bluish-gray', 'white', 'pale-pink', 'vivid-red', 'luminous-vivid-orange', 'luminous-vivid-amber', 'light-green-cyan', 'vivid-green-cyan', 'pale-cyan-blue', 'vivid-cyan-blue', 'vivid-purple']);
const attr = (tag, name) => entity((new RegExp(`\\s${name}\\s*=\\s*["']([^"']*)["']`, 'i').exec(tag) || [])[1] || '');

/** Candidatos a logo de la portada, del más fiable al menos. */
function logoCandidates(html, base) {
  const out = []; const add = (u, why) => { try { if (u && !/^data:/i.test(u)) out.push({ url: new URL(u, base).toString(), why }); } catch { /* ignorar */ } };
  const ld = /"logo"\s*:\s*(?:\{[^}]*?"url"\s*:\s*)?"([^"]+)"/i.exec(html); if (ld) add(ld[1].replace(/\\\//g, '/'), 'schema');
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const t = m[0]; const src = attr(t, 'src') || attr(t, 'data-src') || attr(t, 'data-lazy-src');
    if (/logo/i.test(`${src} ${attr(t, 'alt')} ${attr(t, 'class')} ${attr(t, 'id')}`) && !/(footer|partner|cliente|client|sponsor|patrocin|kit-digital|next-?gen|feder|fondos|ministerio|whatsapp|facebook|instagram|linkedin|twitter|cookie|consent|gdpr|\/plugins\/|recaptcha|chat|award|premio|sello|enac|aenor|iso-?\d)/i.test(`${src} ${attr(t, 'alt')} ${attr(t, 'class')}`)) add(src, 'img');
    if (out.length > 4) break;
  }
  // Cualquier dirección de imagen con «logo» en el nombre (componentes que no usan <img>, p. ej. logo="/…/logo-empresa.svg").
  if (out.length < 2) for (const m of html.slice(0, 300000).matchAll(/["'(]([^"'()\s<>]*logo[^"'()\s<>]*\.(?:svg|png|jpe?g|webp))(?:\?[^"'()\s<>]*)?["')]/gi)) {
    if (/(cookie|consent|footer|partner|client|sponsor|feder|kit-digital|\/plugins\/|whatsapp|facebook|instagram|linkedin|twitter|enac|aenor)/i.test(m[1])) continue;
    add(m[1], 'img'); if (out.length > 4) break;
  }
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) { const t = m[0]; if (/apple-touch-icon/i.test(attr(t, 'rel'))) add(attr(t, 'href'), 'touch'); }
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) { const t = m[0]; if (/og:logo/i.test(attr(t, 'property'))) add(attr(t, 'content'), 'og'); }
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) { const t = m[0]; if (/(^|\s)icon(\s|$)/i.test(attr(t, 'rel')) && /(\d{3})x\1/.test(attr(t, 'sizes'))) add(attr(t, 'href'), 'icon'); }
  const seen = new Set(); return out.filter((c) => !seen.has(c.url) && seen.add(c.url));
}

async function image(u) {
  let res;
  try { res = await fetch(u, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PROPO/1.0; +https://propo.es)', Accept: 'image/*' }, signal: AbortSignal.timeout(8000), cf: { cacheTtl: 86400, cacheEverything: true } }); } catch { return null; }
  const final = new URL(res.url); const type = (res.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  if (!res.ok || !/^https?:$/.test(final.protocol) || !publicHost(final.hostname) || !/^image\/(png|jpe?g|svg\+xml|webp|gif)$/.test(type)) return null;
  const buf = await res.arrayBuffer(); if (!buf.byteLength || buf.byteLength > IMG_MAX) return null;
  let bin = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return `data:${type};base64,${btoa(bin)}`;
}

/** Colores de la web: el «theme-color» y los más repetidos en sus estilos (sin blancos, negros ni grises). */
async function colorsOf(home) {
  const meta = [...home.html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]).find((t) => /theme-color/i.test(attr(t, 'name')));
  const theme = meta ? attr(meta, 'content') : '';
  let css = [...home.html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n') + ' ' + [...home.html.matchAll(/style=["']([^"']+)["']/gi)].map((m) => m[1]).join(' ');
  const sheets = [...home.html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).filter((t) => /stylesheet/i.test(attr(t, 'rel'))).map((t) => { try { return new URL(attr(t, 'href'), home.url); } catch { return null; } })
    .filter((u) => u && u.hostname.replace(/^www\./, '') === home.host.replace(/^www\./, '') && !/(bootstrap|font-?awesome|jquery|elementor\/assets\/lib|wp-includes|dashicons)/i.test(u.pathname)).slice(0, 3);
  for (const u of sheets) { try { const r = await fetch(u.toString(), { signal: AbortSignal.timeout(6000), cf: { cacheTtl: 86400, cacheEverything: true } }); if (r.ok) css += '\n' + (await r.text()).slice(0, 600000); } catch { /* sin esa hoja */ } }
  const count = new Map();
  const norm = (h) => { h = h.toLowerCase(); if (h.length === 4) h = '#' + [...h.slice(1)].map((x) => x + x).join(''); return h.length === 7 ? h : null; };
  const vivid = (h) => { const r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx - mn >= 40 && mx >= 40 && mn <= 225; };
  // Colores declarados como «de marca» por el tema (Elementor, WordPress, Bootstrap o variables con nombre de marca).
  const vars = [];
  for (const m of css.matchAll(/--(e-global-color-(primary|accent|secondary)|wp--preset--color--([a-z0-9-]+)|bs-primary|(?:color-)?primary(?:-color)?|brand(?:-color)?(?:-primary)?|main-color|accent(?:-color)?)\s*:\s*(#[0-9a-f]{6}|#[0-9a-f]{3})\b/gi)) {
    if (m[3] && WP_DEFAULT.has(m[3].toLowerCase())) continue;
    const h = norm(m[4]); if (h && !vars.includes(h)) vars.push(h);
  }
  // Para contar, fuera los valores de serie: paleta de WordPress y colores de reserva de var(--x, #…).
  css = css.replace(/--wp--preset--[a-z0-9-]+\s*:[^;}]+/gi, ' ').replace(/var\(\s*--[a-z0-9-]+\s*,\s*#[0-9a-f]{3,6}\s*\)/gi, ' ');
  for (const m of css.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)) { const h = norm(m[0]); if (h && vivid(h)) count.set(h, (count.get(h) || 0) + 1); }
  for (const m of css.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/gi)) { const h = '#' + [m[1], m[2], m[3]].map((v) => Math.min(255, Number(v)).toString(16).padStart(2, '0')).join(''); if (vivid(h)) count.set(h, (count.get(h) || 0) + 1); }
  const top = [...count].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([h]) => h);
  const t = theme && norm(theme.trim()); return { theme: t && vivid(t) ? t : null, vars: vars.slice(0, 6), css: top };
}

/** Logo dibujado en la propia página: el primer <svg> con «logo» en él o justo antes (cabecera). */
function inlineLogo(html) {
  const head = html.slice(0, 400000);
  for (const m of head.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)) {
    const before = head.slice(Math.max(0, m.index - 400), m.index);
    if (!/logo/i.test(m[0].slice(0, 400) + before.slice(-250)) || /(cookie|consent|footer|whatsapp|facebook|instagram|linkedin|twitter|menu|search|hamburg|close|arrow)/i.test(m[0].slice(0, 300) + before.slice(-150))) continue;
    if (m[0].length < 300 || m[0].length > 150000 || !/<(path|polygon|rect|circle|g)\b/i.test(m[0])) continue;
    let svg = m[0]; if (!/xmlns=/.test(svg)) svg = svg.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }
  return null;
}

async function brandOf(home) {
  let logo = null, logoUrl = null;
  const cands = logoCandidates(home.html, home.url);
  for (const c of cands.filter((x) => x.why === 'schema' || x.why === 'img').slice(0, 4)) { const d = await image(c.url); if (d) { logo = d; logoUrl = c.url; break; } }
  if (!logo) logo = inlineLogo(home.html);
  if (!logo) for (const c of cands.filter((x) => x.why !== 'schema' && x.why !== 'img').slice(0, 3)) { const d = await image(c.url); if (d) { logo = d; logoUrl = c.url; break; } }
  const colors = await colorsOf(home).catch(() => ({ theme: null, vars: [], css: [] }));
  return { logo, logoUrl, ...colors };
}
