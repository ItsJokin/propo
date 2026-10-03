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
// Full standalone document for local testing (file:// or static server).
fs.writeFileSync('dist/index.html', `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>${body}</body></html>`);
console.log('built', (Buffer.byteLength(body) / 1024 / 1024).toFixed(2), 'MB');
// Official tender documents served next to the page (pliegos/<id>/...).
if (fs.existsSync('pliegos')) { fs.rmSync('dist/pliegos', { recursive: true, force: true }); fs.cpSync('pliegos', 'dist/pliegos', { recursive: true }); }
