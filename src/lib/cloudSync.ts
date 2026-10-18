// Une las cuentas del servidor (services/cloud) con el estado de la app: entrar, salir, arrancar y traer cambios.
import type { AppState } from './types';
import { getState, setState, setStateFromCloud, newWorkspace, navigate, toast, resetAll, update } from './store';
import * as cloud from './services/cloud';
import { syncFiles, setCloudFiles } from './storage';

/** Todos los documentos del espacio (pliegos de cada proyecto y documentos de empresa). */
const fileKeys = (s: AppState) => [...s.projects.flatMap((p) => p.docs.map((d) => d.textKey)), ...s.vault.map((v) => v.textKey)].filter((k): k is string => !!k);
/** Sube al servidor los archivos que falten (de antes de tener cuenta o que fallaron). En segundo plano. */
function backfill() {
  const s = getState();
  if (!s.user?.cloud || s.demo) return;
  setCloudFiles(true);
  syncFiles(fileKeys(s)).catch(() => { /* se reintenta la próxima vez */ });
}

/** Tras iniciar sesión o confirmar el email: se trae el espacio del servidor o, si es la primera vez, se crea. */
export async function enterCloud(): Promise<'new' | 'existing'> {
  const s = cloud.currentSession();
  if (!s) throw new cloud.CloudError('no_session');
  const remote = await cloud.loadWorkspace();
  if (remote?.data?.user) {
    cloud.markSynced(remote.version);
    setStateFromCloud({ ...(remote.data as AppState), signedOut: false });
    await refreshPlan();
    return 'existing';
  }
  // Primera vez en el servidor. Si este navegador ya tenía un espacio de esa misma persona (de antes de las cuentas), se sube ese.
  const local = getState();
  let ws: AppState;
  if (local.user && !local.demo && local.user.email.toLowerCase() === s.user.email.toLowerCase()) ws = structuredClone(local);
  else {
    const m = s.user.meta || {};
    ws = newWorkspace({ name: m.name || s.user.email.split('@')[0], email: s.user.email, role: m.role || 'Licitaciones', company: m.company || '', industry: m.industry || '' });
  }
  ws.user = { ...ws.user!, id: s.user.id, email: s.user.email, cloud: true };
  delete ws.user.pass;
  if (ws.members[0]) ws.members[0] = { ...ws.members[0], id: s.user.id, email: s.user.email };
  ws.signedOut = false;
  cloud.markSynced(0);
  setState(ws);
  await cloud.flush();
  backfill();
  await refreshPlan();
  return 'new';
}

/** El plan lo decide el servidor (Stripe → Supabase), nunca el navegador: se copia al estado de la app. */
export async function refreshPlan(): Promise<string | null> {
  if (!cloud.currentSession() || getState().demo) return null;
  try {
    const [p, u] = await Promise.all([cloud.loadPlan(), cloud.loadUsage().catch(() => null)]);
    if (!p) return null;
    update((s) => {
      const sub = s.subscription;
      if (p.is_admin) { sub.plan = 'enterprise'; sub.status = 'active'; }
      else {
        sub.plan = (['trial', 'free', 'pro', 'business', 'enterprise'].includes(p.plan) ? p.plan : 'free') as AppState['subscription']['plan'];
        sub.status = p.plan === 'trial' ? 'trialing' : p.status === 'past_due' ? 'past_due' : p.status === 'canceled' || p.plan === 'free' ? 'canceled' : 'active';
      }
      sub.billingCycle = p.billing_cycle === 'annual' ? 'annual' : 'monthly';
      sub.trialEndsAt = p.trial_ends_at;
      sub.currentPeriodEnd = p.plan === 'trial' ? p.trial_ends_at : p.current_period_end;
      sub.cancelAtPeriodEnd = !!p.cancel_at_period_end;
      sub.simulated = false;
      if (u) { s.usage.proposalsCreated = Number(u.used) || 0; if (u.since) s.usage.periodStart = u.since; }
    });
    return p.plan;
  } catch { return null; }   // sin la tabla nueva o sin conexión: se queda lo que había
}

/** Al volver de la página de pago de Stripe (?pago=ok): se espera a que llegue el aviso de Stripe y se activa el plan. */
async function afterCheckout() {
  let q: URLSearchParams;
  try { q = new URLSearchParams(location.search); } catch { return; }
  const r = q.get('pago');
  if (!r) return;
  try { history.replaceState(null, '', location.pathname + location.hash); } catch { /* nada */ }
  if (r !== 'ok') { await refreshPlan(); return; }
  toast('Pago recibido. Activando tu plan…', 'neutral');
  for (let i = 0; i < 10; i++) {
    const plan = await refreshPlan();
    if (plan === 'pro' || plan === 'business' || plan === 'enterprise') { toast('¡Listo! Tu plan ya está activo.', 'ok'); return; }
    await new Promise((res) => setTimeout(res, 2000));
  }
  toast('El pago se ha hecho, pero el plan tarda en activarse. Recarga la página en un minuto; si no aparece, escríbenos a hola@propo.es.', 'warn');
}

/** Cerrar sesión: se guarda lo pendiente y se borra todo de este navegador (puede ser un ordenador compartido). */
export async function leaveCloud() {
  await cloud.flush();
  await cloud.signOut();
  resetAll();
  navigate('/');
}

/** Al abrir la web: enlaces de los correos, sesión abierta y cambios hechos desde otro dispositivo. */
export async function bootCloud() {
  if (!cloud.cloudEnabled) return;
  const link = await cloud.consumeLink();
  if (link?.error) { navigate('/login'); toast(link.error === 'otp_expired' ? 'El enlace ha caducado o ya se usó. Inicia sesión o pide uno nuevo.' : 'No se ha podido abrir el enlace. Inicia sesión o pide uno nuevo.', 'warn'); return; }
  if (link?.type === 'recovery') { navigate('/reset-password'); return; }
  if (link) {
    try { const r = await enterCloud(); toast('Cuenta confirmada. ¡Bienvenido a PROPO!', 'ok'); navigate(r === 'new' ? '/welcome' : '/app'); }
    catch (e) { toast(cloud.cloudMessage(e), 'bad'); navigate('/login'); }
    return;
  }
  if (!cloud.currentSession()) {
    if (getState().user?.cloud) setState({ ...getState(), signedOut: true });   // la sesión caducó: hay que volver a entrar
    return;
  }
  await pull(true);
  backfill();
  await refreshPlan();
  afterCheckout();
  try { document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { pull(false).then(() => refreshPlan()); } }); } catch { /* nada */ }
}

/** Trae el espacio del servidor si es más nuevo que el de este navegador (cambios hechos en otro dispositivo). */
async function pull(boot: boolean) {
  if (!cloud.currentSession()) return;
  if (cloud.hasUnsaved()) {                                          // lo de aquí es lo último (p. ej. se cerró antes de guardar): se sube
    if (getState().user?.cloud && !getState().demo) { cloud.scheduleSave(getState()); await cloud.flush(); }
    return;
  }
  try {
    const remote = await cloud.loadWorkspace();
    if (!remote?.data?.user) return;
    const local = getState();
    if (local.demo && !boot) return;                                   // está mirando la demo a propósito
    if (remote.version > cloud.syncedVersion() || !local.user?.cloud || local.demo) {
      const first = !local.user?.cloud;
      cloud.markSynced(remote.version);
      setStateFromCloud({ ...(remote.data as AppState), signedOut: false });
      if (!first && !local.demo) toast('Actualizado con los cambios hechos en otro dispositivo', 'neutral');
    }
  } catch { /* sin conexión: se sigue con lo de este navegador */ }
}
