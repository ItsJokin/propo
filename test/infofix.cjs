const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const base = 'http://127.0.0.1:8765/dist/index.html';
  const shot = async (n) => { await p.waitForTimeout(500); await p.screenshot({ path: `test/shots/f-${n}.png` }); };
  await p.goto(base + '#/signup'); await p.click('text=Explorar la demo >> nth=0'); await p.waitForTimeout(400);
  await p.goto(base + '#/app/projects/p_sample/proposal'); await p.waitForTimeout(600);
  const n0 = await p.locator('.info-req-btn').count(); console.log('clickable info tags', n0, '| chips', await p.locator('.missing-list button').count());
  await p.locator('.info-req-btn').first().scrollIntoViewIfNeeded(); await shot('01-section');
  const label = await p.locator('.info-req-btn').first().innerText(); console.log('first tag:', label.replace('Añadir', '').trim());
  await p.locator('.info-req-btn').first().click(); await shot('02-modal');
  console.log('modal title:', await p.textContent('.modal h2, .modal-title, .modal [class*=title]'));
  await p.fill('#fix-v', 'Dato de prueba añadido por el cliente'); await p.click('button:has-text("Añadir a la propuesta")'); await p.waitForTimeout(400);
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('propo:state:v1')));
  const pr = st.projects.find(x => x.id === 'p_sample');
  console.log('filled in content:', pr.sections.some(s => s.content.includes('Dato de prueba añadido por el cliente')), '| tags left', await p.locator('.info-req-btn').count());
  // go-there flow
  await p.locator('.info-req-btn').first().click(); await p.waitForTimeout(300);
  console.log('where:', (await p.textContent('.fix-where')).trim());
  await p.click('.fix-where button'); await p.waitForTimeout(500); await shot('03-there');
  console.log('url after go:', p.url().split('#')[1], '| hint:', await p.locator('.return-hint').count());
  await p.click('.return-hint .btn-primary'); await p.waitForTimeout(400);
  console.log('back to:', p.url().split('#')[1]);
  console.log(errs.join('\n') || 'no errors'); await b.close();
})();
