import React, { useEffect } from 'react';
import { useRoute, useStore, navigate } from './lib/store';
import { Toasts } from './components/ui';
import { Landing } from './marketing/Landing';
import { Pricing } from './marketing/Pricing';
import { Features, Security, Resources, Contact, Privacy, Terms, Cookies } from './marketing/Pages';
import { Signup, Login, Welcome, Onboarding } from './auth/Auth';
import { AppShell } from './app/Shell';
import { Dashboard } from './app/Dashboard';
import { Projects } from './app/Projects';
import { AnalysisScreen } from './app/Analysis';
import { ProjectView } from './app/project/ProjectView';
import { Company } from './app/Company';
import { Vault } from './app/Vault';
import { Templates } from './app/Templates';
import { Notifications } from './app/Notifications';
import { Settings } from './app/Settings';
import { Admin } from './app/Admin';
import { Tenders } from './app/Tenders';
import { getSample } from './lib/ai/provider';

// SEO metadata per public route. In Next.js these become `export const metadata` per page,
// plus sitemap.xml, robots.txt and Open Graph images.
const SEO: Record<string, [string, string]> = {
  '/': ['PROPO — Software de licitaciones con IA', 'Encuentra licitaciones públicas para tu empresa y prepara con IA propuestas listas para revisar.'],
  '/pricing': ['Precios — PROPO', 'Planes por propuestas al mes. Empieza con 14 días de prueba y una propuesta completa.'],
  '/features': ['Producto — PROPO', 'Buscador de licitaciones, análisis de pliegos, requisitos, memoria de empresa, redacción con fuentes y control de cumplimiento.'],
  '/security': ['Seguridad — PROPO', 'Aislamiento por empresa, cifrado, datos en la UE, registro de actividad y controles RGPD para tus pliegos.'],
  '/resources': ['Recursos — PROPO', 'Guías y glosario para equipos que preparan licitaciones y RFP.'],
  '/contact': ['Contacto — PROPO', 'Habla con el equipo de PROPO.'],
};

export function App() {
  const full = useRoute();
  const [path, query] = full.split('?');
  const user = useStore((s) => s.user);
  const signedOut = useStore((s) => s.signedOut);
  const ob = useStore((s) => s.onboarding);
  const authed = !!user && !signedOut;

  useEffect(() => { getSample(); }, []);
  useEffect(() => {
    const seo = SEO[path];
    try {
      document.title = seo ? seo[0] : path.startsWith('/app') ? 'PROPO' : 'PROPO — Software de licitaciones con IA';
      const m = document.querySelector('meta[name="description"]');
      if (m && seo) m.setAttribute('content', seo[1]);
    } catch { /* ignore */ }
  }, [path]);

  const needsAuth = path.startsWith('/app') || path === '/welcome' || path === '/onboarding';
  useEffect(() => {
    if (needsAuth && !authed) navigate('/signup');
  }, [needsAuth, authed]);
  if (needsAuth && !authed) return null;

  let page: React.ReactNode;
  const seg = path.split('/').filter(Boolean);
  if (seg[0] !== 'app') {
    switch (path) {
      case '/': page = <Landing />; break;
      case '/pricing': page = <Pricing />; break;
      case '/features': page = <Features />; break;
      case '/security': page = <Security />; break;
      case '/resources': page = <Resources />; break;
      case '/contact': page = <Contact />; break;
      case '/privacy': page = <Privacy />; break;
      case '/terms': page = <Terms />; break;
      case '/cookies': page = <Cookies />; break;
      case '/signup': page = authed ? <Redirect to="/app" /> : <Signup />; break;
      case '/login': page = authed ? <Redirect to="/app" /> : <Login />; break;
      case '/welcome': page = <Welcome />; break;
      case '/onboarding': page = <Onboarding />; break;
      default: page = <Landing />;
    }
    return <>{page}<Toasts /></>;
  }

  const params = new URLSearchParams(query || '');
  switch (seg[1]) {
    case undefined: page = <Dashboard />; break;
    case 'tenders': page = <Tenders />; break;
    case 'projects': page = seg[2] ? <ProjectView id={seg[2]} tab={seg[3] || 'overview'} /> : <Projects openNew={params.get('new') === '1'} />; break;
    case 'analyze': page = <AnalysisScreen id={seg[2]} />; break;
    case 'company': page = <Company tab={seg[2] || 'info'} />; break;
    case 'documents': page = <Vault />; break;
    case 'templates': page = <Templates />; break;
    case 'notifications': page = <Notifications />; break;
    case 'settings': page = <Settings tab={seg[2] || 'account'} />; break;
    case 'admin': page = <Admin />; break;
    default: page = <Dashboard />;
  }
  const fullBleed = seg[1] === 'projects' && !!seg[2];
  return (
    <>
      <AppShell fullBleed={fullBleed} showSetup={!ob.dismissed}>{page}</AppShell>
      <Toasts />
    </>
  );
}

function Redirect({ to }: { to: string }) {
  useEffect(() => { navigate(to); }, [to]);
  return null;
}
