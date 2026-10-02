// Datos en vivo: la web lee data/ junto a la página (lo que publica el robot).
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const base = 'http://127.0.0.1:8765/dist/index.html';
  const shot = async (n) => { await p.waitForTimeout(400); await p.screenshot({ path: `test/shots/l-${n}.png` }); };
  await p.goto(base + '#/signup'); await p.click('text=Explorar la demo >> nth=0'); await p.waitForTimeout(500);
  await p.goto(base + '#/app/tenders'); await p.waitForSelector('.data-status', { timeout: 15000 }); await shot('01-list');
  console.log('status:', (await p.textContent('.data-status')).replace(/\s+/g, ' ').slice(0, 160));
  console.log('rows shown', await p.locator('.t-row').count(), '| tabs', (await p.locator('.tabs .tab').allInnerTexts()).join(' / ').replace(/\n/g, ' '));
  const t0 = Date.now(); await p.fill('.t-search input', 'limpieza hospital'); await p.press('.t-search input', 'Enter'); await p.waitForTimeout(300);
  console.log('search rows', await p.locator('.t-row').count(), 'in', Date.now() - t0, 'ms');
  await p.click('.t-row >> nth=0'); await shot('02-drawer');
  console.log('source:', await p.textContent('.brief-source strong'), '| facts', await p.locator('.brief-facts > div').count());
  await p.click('.drawer-foot .btn-primary'); await p.waitForSelector('.an-results', { timeout: 60000 });
  console.log('analysis ok:', (await p.locator('.an-results .big-stat').allInnerTexts()).join(','));
  console.log(errs.join('\n') || 'no errors'); await b.close();
})();
