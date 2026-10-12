// Servidor de pliegos de PROPO (Cloudflare Worker, sin dependencias: se puede pegar tal cual en el editor de Cloudflare).
// Las plataformas oficiales no dejan que una página web ajena descargue sus documentos; este Worker los pide por ella
// y se los devuelve a la web de PROPO.
//
//   GET /pliego?u=<dirección https del documento>   → el documento, con permiso de lectura para la web de PROPO
//   GET /health                                      → {"ok": true}
//
// No es un proxy abierto: solo responde a la web de PROPO y solo descarga de plataformas de contratación conocidas.

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
    if (url.pathname === '/health') return json({ ok: true }, 200, cors);
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
