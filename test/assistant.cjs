const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts\.g/.test(m.text())) errs.push(m.text()); });
  const base = 'http://127.0.0.1:8765/dist/index.html';
  const shot = async (n) => { await p.waitForTimeout(500); await p.screenshot({ path: `test/shots/a-${n}.png` }); };
  // fresh company (no revenue / projects) to exercise company questions
  await p.goto(base + '#/signup');
  await p.fill('#su-name', 'Usuario Prueba'); await p.fill('#su-company', 'Costa Catering SL'); await p.fill('#su-email', 'j@test.com'); await p.fill('#su-pass', 'password123');
  await p.selectOption('#su-ind', 'Catering y restauración'); await p.click('button:has-text("Crear cuenta")');
  await p.click('button:has-text("Continuar")'); await p.click('text=Saltar configuración'); await p.waitForTimeout(300);
  await p.goto(base + '#/app/tenders'); await p.waitForTimeout(300);
  await p.fill('.t-search input', 'Aran'); await p.press('.t-search input', 'Enter'); await p.waitForTimeout(300);
  const n = await p.locator('.t-row').count(); for (let i = 0; i < n; i++) { if (/MANUTENCI|Manutención/i.test(await p.locator('.t-row').nth(i).innerText())) { await p.locator('.t-row').nth(i).click(); break; } }
  await p.waitForTimeout(300); await shot('01-drawer-docs');
  await p.click('.drawer-foot .btn-primary');
  await p.waitForSelector('text=Análisis completado', { timeout: 120000 }); await shot('02-done');
  await p.click('button:has-text("PROPO")'); await p.waitForTimeout(800); await shot('03-chat-start');
  const turn = async (fn, label) => { await fn(); await p.waitForTimeout(700); console.log('answered:', label); };
  await turn(() => p.click('.asst-input button:has-text("Sí, lo cumplimos")'), 'si');
  await turn(async () => { await p.fill('.asst-form .input', 'Tenemos un hotel en Vielha a 400 metros del Ayuntamiento'); await p.press('.asst-form .input', 'Enter'); }, 'texto');
  await turn(() => p.click('.asst-input button:has-text("No") >> nth=0'), 'no');
  await turn(() => p.setInputFiles('.asst-input input[type=file]', '/tmp/claude-0/poliza.txt'), 'adjunto');
  await shot('04-chat-mid');
  for (let i = 0; i < 20; i++) {
    if (!(await p.locator('.asst-input').count())) break;
    const multi = await p.locator('.asst-input .chip').count();
    if (multi) { await p.click('.asst-input .chip >> nth=0'); await p.click('.asst-input button:has-text("Confirmar")'); }
    else if (await p.locator('.asst-input button:has-text("10–49")').count()) await p.click('.asst-input button:has-text("10–49")');
    else if (/facturación/.test(await p.locator('.asst-msg.propo').last().innerText())) { await p.fill('.asst-form .input', '1,8 M€ en 2025'); await p.press('.asst-form .input', 'Enter'); }
    else if (/contrato parecido/.test(await p.locator('.asst-msg.propo').last().innerText())) { await p.fill('.asst-form .input', 'Comedor escolar del Ayuntamiento de Sitges, 2023-2025, 210.000 €/año'); await p.press('.asst-form .input', 'Enter'); }
    else await p.click('.asst-input button:has-text("No lo sé")');
    await p.waitForTimeout(600);
  }
  await shot('05-chat-done');
  await p.click('button:has-text("Redactar la propuesta")'); await p.waitForSelector('.asst-msg.propo >> text=/He (redactado|preparado)/', { timeout: 60000 }); await shot('06-drafted');
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('propo:state:v1'))); const pr = st.projects[0];
  console.log('msgs', pr.interview.msgs.length, 'answered', pr.interview.answered.length);
  console.log('company revenue', st.company.revenue, '| employees', st.company.employees, '| past', st.pastProjects.length, '| certs', st.certifications.map(c => c.name).join(','));
  console.log('reqs', pr.requirements.filter(r => r.humanValidated).map(r => r.status + ': ' + r.title + ' :: ' + (r.note || '')).join('\n'));
  console.log('sections', pr.sections.map(s => s.status).join(','));
  await p.click('button:has-text("Revisar la propuesta")'); await shot('07-proposal');
  console.log(errs.join('\n') || 'no errors'); await b.close();
})();
