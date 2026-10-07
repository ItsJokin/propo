// PROPO build: bundles the React app into a single self-contained HTML file.
// Production target is Next.js (see docs/ARCHITECTURE.md); this build produces the
// navigable MVP that runs fully in the browser (published as a claude.ai Artifact).
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
// esbuild del proyecto (npm ci); en el entorno de desarrollo sin node_modules propios se usa el global.
let esbuild;
try { esbuild = require(process.env.ESBUILD_PATH || 'esbuild'); }
catch { esbuild = require('/home/claude/.npm-global/lib/node_modules/tsx/node_modules/esbuild'); }

const dev = process.argv.includes('--dev');
const result = await esbuild.build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  format: 'esm',
  target: ['chrome115', 'safari17', 'firefox120'],
  minify: !dev,
  write: false,
  jsx: 'automatic',
  loader: { '.css': 'text' },
  define: { 'process.env.NODE_ENV': dev ? '"development"' : '"production"', 'process.env.PROPO_AI_URL': JSON.stringify(process.env.PROPO_AI_URL || '') },
  legalComments: 'none',
  logLevel: 'warning',
  supported: { 'top-level-await': true },
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = fs.readFileSync('src/styles.css', 'utf8');
const fonts = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';

// Artifact pages are wrapped in a doctype/head/body skeleton at publish time,
// so the published file carries only title, meta, styles, root and script.
const body = `<title>PROPO</title>
<meta name="description" content="PROPO encuentra licitaciones para tu empresa y prepara con IA propuestas listas para revisar.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/propo.html', body);

// Web publicada: va cifrada. Con la clave pública de gate.json se protege una clave nueva en cada compilación; la privada
// solo se abre con la contraseña, así que aquí no hace falta ningún secreto y sin contraseña no hay nada legible.
let page = body;
if (!dev && fs.existsSync('gate.json')) {
  const gate = JSON.parse(fs.readFileSync('gate.json', 'utf8'));
  const b64 = (b) => Buffer.from(b).toString('base64');
  const { subtle } = globalThis.crypto;
  const pub = await subtle.importKey('spki', Buffer.from(gate.publicKey, 'base64'), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  const key = await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const sealed = await subtle.encrypt({ name: 'AES-GCM', iv }, key, Buffer.from(JSON.stringify({ css, js: result.outputFiles[0].text })));
  const blob = Buffer.concat([Buffer.from(iv), Buffer.from(sealed)]);
  fs.writeFileSync('dist/app.enc', blob);
  const cfg = {
    salt: gate.salt, iterations: gate.iterations, iv: gate.iv, privateKey: gate.privateKey,
    contentKey: b64(await subtle.encrypt({ name: 'RSA-OAEP' }, pub, await subtle.exportKey('raw', key))),
    app: 'app.enc?v=' + b64(await subtle.digest('SHA-256', blob)).replace(/[^a-z0-9]/gi, '').slice(0, 12),
    video: 'media/anuncio-propo.mp4',
    waitlist: fs.existsSync('waitlist.json') ? JSON.parse(fs.readFileSync('waitlist.json', 'utf8')).endpoint : '',   // «Avísame cuando abra»
  };
  page = `<title>PROPO</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>${fs.readFileSync('src/gate/gate.css', 'utf8')}</style>
${fs.readFileSync('src/gate/gate.html', 'utf8')}
<script>${fs.readFileSync('src/gate/gate.js', 'utf8').replace('__GATE__', () => JSON.stringify(cfg))}</script>
`;
  console.log('cifrada', (blob.length / 1024 / 1024).toFixed(2), 'MB');
}
// Full standalone document for local testing (file:// or static server).
fs.writeFileSync('dist/index.html', `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>${page}</body></html>`);
console.log('built', (Buffer.byteLength(body) / 1024 / 1024).toFixed(2), 'MB');
// Official tender documents served next to the page (pliegos/<id>/...).
if (fs.existsSync('pliegos')) { fs.rmSync('dist/pliegos', { recursive: true, force: true }); fs.cpSync('pliegos', 'dist/pliegos', { recursive: true }); }
