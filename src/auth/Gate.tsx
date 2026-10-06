import React, { useEffect, useRef, useState } from 'react';
import { LogoMark } from '../components/ui';
import { GATE } from '../lib/gateKey';

// Puerta de acceso: mientras la web no esté abierta al público, pide una contraseña antes de mostrar nada.
// Es una barrera para visitas casuales (se comprueba en el navegador); no sustituye a las cuentas de usuario.

const KEY = 'propo.gate';
const VIDEO = 'media/anuncio-propo.mp4';

const hex = (b: ArrayBuffer) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');
const unhex = (s: string) => new Uint8Array((s.match(/../g) || []).map((x) => parseInt(x, 16)));

async function fingerprint(password: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(GATE.salt), iterations: GATE.iterations }, key, 256));
}

function remembered(): boolean {
  try { return localStorage.getItem(KEY) === GATE.hash; } catch { return false; }
}

export function Gate({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(remembered);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [shake, setShake] = useState(false);
  const [video, setVideo] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!open && !video) input.current?.focus(); }, [open, video]);
  useEffect(() => {
    if (!video) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setVideo(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [video]);

  if (open) return <>{children}</>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value || busy) return;
    setBusy(true); setWrong(false);
    let ok = false;
    try { ok = (await fingerprint(value)) === GATE.hash; } catch { ok = false; }
    setBusy(false);
    if (ok) { try { localStorage.setItem(KEY, GATE.hash); } catch { /* sin almacenamiento: se pedirá de nuevo */ } setOpen(true); }
    else { setWrong(true); setShake(true); setValue(''); input.current?.focus(); }
  }

  return (
    <div className="gate">
      <div className="gate-bg" aria-hidden="true">
        <i className="gate-blob g1" /><i className="gate-blob g2" /><i className="gate-blob g3" /><i className="gate-blob g4" />
        <i className="gate-grid" />
        <svg className="gate-tri t1" viewBox="0 0 10 10"><path d="M0 0h10L0 10z" /></svg>
        <svg className="gate-tri t2" viewBox="0 0 10 10"><path d="M0 0h10L0 10z" /></svg>
        <svg className="gate-tri t3" viewBox="0 0 10 10"><path d="M0 0h10L0 10z" /></svg>
      </div>

      <main className="gate-main">
        <div className="gate-brand"><LogoMark size={44} /><span>PROPO</span></div>
        <h1 className="gate-title">Las licitaciones,<br />como deberían ser.</h1>

        <form className={'gate-card' + (shake ? ' is-wrong' : '')} onSubmit={submit} onAnimationEnd={(e) => { if (e.target === e.currentTarget) setShake(false); }}>
          <label className="gate-label" htmlFor="gate-pw">Acceso privado</label>
          <p className="gate-hint">PROPO todavía no está abierto al público. Escribe la contraseña para entrar.</p>
          <div className="gate-row">
            <input id="gate-pw" ref={input} className="gate-input" type="password" autoComplete="current-password" placeholder="Contraseña" value={value}
              onChange={(e) => { setValue(e.target.value); if (e.target.value) setWrong(false); }} aria-invalid={wrong} aria-describedby="gate-msg" />
            <button className="gate-btn" type="submit" disabled={!value || busy}>{busy ? 'Comprobando…' : 'Entrar'}</button>
          </div>
          <p className="gate-msg" id="gate-msg" role="alert">{wrong ? 'Esa contraseña no es correcta. Inténtalo de nuevo.' : ''}</p>
        </form>

        <button className="gate-video" type="button" onClick={() => setVideo(true)}>
          <span className="gate-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 5.5v13l11-6.5z" /></svg></span>
          <span><b>Ver qué es PROPO</b><small>Vídeo de 1 minuto, con sonido</small></span>
        </button>
      </main>

      {video && (
        <div className="gate-modal" role="dialog" aria-modal="true" aria-label="Vídeo de PROPO" onClick={() => setVideo(false)}>
          <div className="gate-player" onClick={(e) => e.stopPropagation()}>
            <button className="gate-close" type="button" onClick={() => setVideo(false)} aria-label="Cerrar el vídeo">×</button>
            <video src={VIDEO} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </div>
  );
}
