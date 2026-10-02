import React, { useState } from 'react';
import { LuMenu, LuX, LuArrowRight } from 'react-icons/lu';
import { Logo } from '../components/ui';
import { completeDemoWorkspace } from '../lib/completeDemo';
import { navigate, useRoute, useStore, setState, demoWorkspace, track } from '../lib/store';

export async function startDemo(to = '/app/projects/p_sample', complete = false) {
  if (complete) setState(await completeDemoWorkspace());
  else setState(demoWorkspace());
  track('demo_started', { complete });
  navigate(to);
}
export const startCompleteDemo = () => startDemo('/app/projects/p_sample', true);

export function MkNav() {
  const route = useRoute();
  const user = useStore((s) => s.user);
  const signedOut = useStore((s) => s.signedOut);
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [['/features', 'Producto'], ['/#how', 'Cómo funciona'], ['/pricing', 'Precios'], ['/security', 'Seguridad'], ['/resources', 'Recursos']];
  const go = (to: string) => {
    setOpen(false);
    if (to === '/#how') {
      if (route !== '/') navigate('/');
      setTimeout(() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      return;
    }
    navigate(to);
  };
  return (
    <header className="mk-nav">
      <div className="mk-wrap">
        <div className="mk-nav-in">
          <Logo onClick={() => go('/')} />
          <nav className="mk-links" aria-label="Principal">
            {links.map(([to, l]) => <a key={to} className={route === to ? 'on' : ''} onClick={() => go(to)}>{l}</a>)}
          </nav>
          <div className="spacer" />
          {user && !signedOut ? (
            <button className="btn btn-primary" onClick={() => navigate('/app')}>Abrir PROPO</button>
          ) : (
            <>
              <button className="btn btn-secondary hide-sm" onClick={() => navigate('/login')}>Iniciar sesión</button>
              <button className="btn btn-primary" onClick={() => { track('cta_click', { cta: 'nav_start_free' }); navigate('/signup'); }}>Probar gratis</button>
            </>
          )}
          <button className="btn btn-ghost btn-icon mk-menu-btn" aria-label="Menú" onClick={() => setOpen(!open)}>{open ? <LuX /> : <LuMenu />}</button>
        </div>
        {open && (
          <div className="mk-mobile">
            {links.map(([to, l]) => <a key={to} onClick={() => go(to)}>{l}</a>)}
            {!user && <a onClick={() => go('/login')}>Iniciar sesión</a>}
          </div>
        )}
      </div>
    </header>
  );
}

export function MkFooter() {
  const col = (title: string, items: [string, string][]) => (
    <div>
      <h4>{title}</h4>
      {items.map(([to, l]) => <a key={l} onClick={() => navigate(to)}>{l}</a>)}
    </div>
  );
  return (
    <footer className="footer">
      <div className="mk-wrap">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="muted mt-12" style={{ maxWidth: 300 }}>La IA que encuentra y prepara tus licitaciones.</p>
            <button className="btn btn-primary mt-20" onClick={() => navigate('/signup')}>Empezar gratis <LuArrowRight /></button>
          </div>
          {col('Producto', [['/features', 'Funcionalidades'], ['/pricing', 'Precios'], ['/security', 'Seguridad'], ['/signup', 'Empezar gratis']])}
          {col('Recursos', [['/resources', 'Guías'], ['/resources', 'Glosario de licitaciones'], ['/contact', 'Contacto']])}
          {col('Empresa', [['/contact', 'Contacto'], ['/security', 'Protección de datos']])}
          {col('Legal', [['/privacy', 'Política de privacidad'], ['/terms', 'Condiciones del servicio'], ['/cookies', 'Política de cookies']])}
        </div>
        <div className="row mt-48 small subtle" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span>© {new Date().getFullYear()} PROPO. Hecho en Barcelona para empresas europeas.</span>
          <span>PROPO prepara las propuestas. Tu equipo las aprueba y las presenta.</span>
        </div>
      </div>
    </footer>
  );
}

export function MkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mk">
      <MkNav />
      <main>{children}</main>
      <MkFooter />
    </div>
  );
}
