// Servidor de pliegos de PROPO (Cloudflare Worker, sin dependencias: se puede pegar tal cual en el editor de Cloudflare).
// Las plataformas oficiales no dejan que una página web ajena descargue sus documentos; este Worker los pide por ella
// y se los devuelve a la web de PROPO.
//
//   GET /pliego?u=<dirección https del documento>   → el documento, con permiso de lectura para la web de PROPO
//   GET /web?u=<web de una empresa>                  → {"pages": [{url, title, text}]}: el texto de la portada y de
//                                                      hasta 4 páginas suyas (quiénes somos, servicios, calidad…)
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
  return { url: final.toString(), host: final.hostname, title, text: htmlText(html).slice(0, WEB_TEXT), links };
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
  return json({ pages }, 200, { ...cors, 'Cache-Control': 'private, max-age=3600' });
}
