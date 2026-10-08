// Puerta de acceso de PROPO. La web publicada va cifrada (dist/app.enc); esta página es lo único legible sin contraseña.
//   contraseña → PBKDF2 → abre la clave privada (gate.json) → abre la clave de esta compilación → descifra la web.
// Sin la contraseña no hay nada que saltarse: el contenido no está en el navegador hasta que se descifra.
// El marcador de configuración lo sustituye build.mjs por { salt, iterations, iv, privateKey, contentKey, app, video }.
(async function () {
  const CFG = __GATE__;
  const STORE = 'propo.gate';
  const $ = (id) => document.getElementById(id);
  const bytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const text = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
  const subtle = crypto.subtle;

  async function derive(password) {
    const base = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    return new Uint8Array(await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: bytes(CFG.salt), iterations: CFG.iterations }, base, 256));
  }

  /** Descifra la web con la clave derivada de la contraseña. Lanza 'wrong' si la clave no abre el candado. */
  async function unlock(keyBytes) {
    let priv;
    try {
      const k = await subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
      const pkcs8 = await subtle.decrypt({ name: 'AES-GCM', iv: bytes(CFG.iv) }, k, bytes(CFG.privateKey));
      priv = await subtle.importKey('pkcs8', pkcs8, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
    } catch { throw new Error('wrong'); }
    const content = await subtle.importKey('raw', await subtle.decrypt({ name: 'RSA-OAEP' }, priv, bytes(CFG.contentKey)), 'AES-GCM', false, ['decrypt']);
    const res = await fetch(CFG.app);
    if (!res.ok) throw new Error('net');
    const blob = new Uint8Array(await res.arrayBuffer());
    const plain = await subtle.decrypt({ name: 'AES-GCM', iv: blob.subarray(0, 12) }, content, blob.subarray(12));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  function start(app) {
    $('gate').remove();
    const style = document.createElement('style'); style.textContent = app.css; document.head.appendChild(style);
    const root = document.createElement('div'); root.id = 'root'; document.body.appendChild(root);
    const script = document.createElement('script'); script.type = 'module'; script.textContent = app.js; document.body.appendChild(script);
  }

  const main = $('gate-main'), wait = $('gate-wait'), form = $('gate-form'), input = $('gate-pw'), btn = $('gate-btn'), msg = $('gate-msg');
  const corner = $('gate-corner'), lock = $('gate-lock');
  const show = (asking) => { main.hidden = !asking; corner.hidden = !asking; wait.hidden = asking; };
  // La contraseña vive tras el candado de la esquina.
  const pop = (open) => { form.hidden = !open; lock.setAttribute('aria-expanded', String(open)); if (open) input.focus(); };
  lock.addEventListener('click', () => pop(form.hidden));
  document.addEventListener('click', (e) => { if (!form.hidden && !corner.contains(e.target)) pop(false); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !form.hidden) { pop(false); lock.focus(); } });

  // Este navegador ya entró antes: se abre solo.
  let saved = null;
  try { saved = localStorage.getItem(STORE); } catch { /* sin almacenamiento */ }
  if (saved) {
    show(false);
    try { return start(await unlock(bytes(saved))); }
    catch (e) { if (e.message === 'wrong') { try { localStorage.removeItem(STORE); } catch { /* nada */ } } }
  }
  show(true);

  input.addEventListener('input', () => { btn.disabled = !input.value; if (input.value) { msg.textContent = ''; input.removeAttribute('aria-invalid'); } });
  form.addEventListener('animationend', (e) => { if (e.target === form) form.classList.remove('is-wrong'); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!input.value || btn.disabled) return;
    btn.disabled = true; btn.textContent = 'Comprobando…'; msg.textContent = '';
    try {
      const key = await derive(input.value);
      const app = await unlock(key);
      try { localStorage.setItem(STORE, text(key)); } catch { /* se pedirá de nuevo */ }
      start(app);
    } catch (err) {
      btn.textContent = 'Entrar';
      if (err.message === 'wrong') {
        msg.textContent = 'Esa contraseña no es correcta. Inténtalo de nuevo.';
        input.value = ''; input.setAttribute('aria-invalid', 'true'); form.classList.add('is-wrong'); input.focus();
      } else {
        msg.textContent = 'No se ha podido cargar PROPO. Comprueba la conexión e inténtalo de nuevo.';
        btn.disabled = false;
      }
    }
  });

  // Lista de espera: «Avísame cuando abra». El destino lo pone build.mjs (waitlist.json); sin él, el formulario no se enseña.
  const wl = $('wl-form'), wlDone = $('wl-done'), wlMsg = $('wl-msg'), wlBtn = $('wl-btn'), wlEmail = $('wl-email');
  const WL_STORE = 'propo.waitlist';
  if (CFG.waitlist) {
    let joined = false;
    try { joined = localStorage.getItem(WL_STORE) === '1'; } catch { /* sin almacenamiento */ }
    wl.hidden = joined; wlDone.hidden = !joined;
    const wlSector = $('wl-sector'), wlOther = $('wl-other');
    wlSector.addEventListener('change', () => { wlOther.hidden = wlSector.value !== 'Otro'; if (!wlOther.hidden) wlOther.focus(); });
    const sector = () => (wlSector.value === 'Otro' ? (wlOther.value.trim() ? 'Otro: ' + wlOther.value.trim() : 'Otro') : wlSector.value || 'Sin indicar');
    wl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = wlEmail.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        wlMsg.textContent = 'Escribe un correo válido, por ejemplo tu@empresa.com.'; wlEmail.setAttribute('aria-invalid', 'true'); wlEmail.focus(); return;
      }
      wlEmail.removeAttribute('aria-invalid'); wlMsg.textContent = ''; wlBtn.disabled = true; wlBtn.textContent = 'Enviando…';
      const done = () => { wl.hidden = true; wlDone.hidden = false; };
      const soon = setTimeout(done, 2500);       // el servicio puede tardar; no se hace esperar a nadie mirando un botón
      try {
        const res = await fetch(CFG.waitlist, {
          method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ Correo: email, Sector: sector(), _honey: $('wl-honey').value, _subject: 'PROPO · nueva alta en la lista de espera', _template: 'table', _captcha: 'false' }),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || String(out.success) !== 'true') throw new Error('send');
        clearTimeout(soon); done();
        try { localStorage.setItem(WL_STORE, '1'); } catch { /* nada */ }
      } catch {
        clearTimeout(soon); wlDone.hidden = true; wl.hidden = false;
        wlMsg.textContent = 'No se ha podido enviar. Tu correo sigue en la casilla: inténtalo de nuevo en un momento.';
        wlBtn.disabled = false; wlBtn.textContent = 'Avísame';
      }
    });
  }

  // Vídeo de presentación.
  const modal = $('gate-modal'), player = $('gate-player');
  const close = () => { player.pause(); modal.hidden = true; };
  $('gate-video').addEventListener('click', () => { if (!player.src) player.src = CFG.video; modal.hidden = false; player.play().catch(() => { /* el navegador pide un clic */ }); });
  $('gate-close').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
})();
