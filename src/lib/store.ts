import { useSyncExternalStore } from 'react';
import type { AppState, CompanyInfo, Project, Notification } from './types';
import { loadState, saveState, clearState } from './storage';
import { buildSampleProjects, sampleNotifications, sampleTemplates, SAMPLE_COMPANY, SAMPLE_PAST_PROJECTS, SAMPLE_CERTS, SAMPLE_TEAM, SAMPLE_VAULT } from './demoData';
import { addDays, nowIso, uid } from './util';
import { TRIAL_DAYS } from './plans';
import { INDUSTRY_TO_SECTORS, cpvsForSectors } from './discovery/match';

export const STATE_VERSION = 4;

export const emptyCompany = (): CompanyInfo => ({
  legalName: '', tradeName: '', taxId: '', address: '', country: 'España', industry: '', employees: '', revenue: '', website: '', description: '', capabilities: [], sectors: [], cpvs: [], regions: [],
});

export function initialState(): AppState {
  return {
    version: STATE_VERSION,
    user: null,
    company: emptyCompany(),
    pastProjects: [], certifications: [], team: [], vault: [], members: [],
    projects: [], notifications: [], templates: [],
    subscription: { plan: 'trial', status: 'trialing', billingCycle: 'monthly', trialEndsAt: null, currentPeriodEnd: null, cancelAtPeriodEnd: false, stripeCustomerId: null, stripeSubscriptionId: null, simulated: false },
    usage: { periodStart: nowIso(), proposalsCreated: 0, pagesAnalyzed: 0, aiActions: 0 },
    savedTenders: [], alerts: [],
    settings: { language: 'Español', emailNotifications: true, deadlineReminders: true, retentionMonths: 24, aiTraining: false },
    onboarding: { whatWeDo: '', frequency: '', teamSize: '', completedSteps: [], dismissed: false },
    events: [],
  };
}

/** New account: own (empty) company memory + sample projects to explore. */
export function newWorkspace(p: { name: string; email: string; role: string; company: string; industry: string }): AppState {
  const s = initialState();
  const userId = uid('u');
  s.user = { id: userId, name: p.name, email: p.email, role: p.role, createdAt: nowIso() };
  s.company = { ...emptyCompany(), legalName: p.company, tradeName: p.company, industry: p.industry, cpvs: cpvsForSectors(INDUSTRY_TO_SECTORS[p.industry] ?? []) };
  s.members = [{ id: userId, name: p.name, email: p.email, role: 'owner', status: 'active' }];
  s.projects = buildSampleProjects();
  s.notifications = [
    { id: uid('n'), at: nowIso(), kind: 'system', title: 'Te damos la bienvenida a PROPO', body: 'Busca licitaciones para tu empresa, explora el proyecto de ejemplo y crea tu primera propuesta. Tu prueba incluye una propuesta completa.', read: false },
    ...sampleNotifications().slice(0, 2),
  ];
  s.templates = [];
  s.subscription.trialEndsAt = addDays(TRIAL_DAYS);
  s.subscription.currentPeriodEnd = addDays(TRIAL_DAYS);
  return s;
}

/** "Explore the demo": a fully populated sample company. */
export function demoWorkspace(): AppState {
  const s = newWorkspace({ name: 'Anna Roig', email: 'demo@propo.example', role: 'Licitaciones y administración', company: SAMPLE_COMPANY.legalName, industry: SAMPLE_COMPANY.industry });
  s.company = { ...SAMPLE_COMPANY };
  s.pastProjects = SAMPLE_PAST_PROJECTS.map((x) => ({ ...x }));
  s.certifications = SAMPLE_CERTS.map((x) => ({ ...x }));
  s.team = SAMPLE_TEAM.map((x) => ({ ...x }));
  s.vault = SAMPLE_VAULT.map((x) => ({ ...x }));
  s.notifications = sampleNotifications();
  s.templates = sampleTemplates();
  s.members.push({ id: 'm2', name: 'Marc Puig', email: 'marc@mesaviva.example', role: 'reviewer', status: 'active' });
  s.savedTenders = ['637770-2026', '612870-2026'];
  s.alerts = [{ id: 'al1', name: 'Catering en Cataluña', query: '', sector: 'catering', region: 'ES51', createdAt: nowIso() }];
  s.demo = 'basic';
  s.onboarding = { whatWeDo: 'Restauración colectiva', frequency: '1–3 al mes', teamSize: '2–3', completedSteps: ['details', 'documents', 'projects', 'certifications'], dismissed: true };
  return s;
}

// ---------------------------------------------------------------------------

let state: AppState = (() => {
  const saved = loadState<AppState>();
  if (saved && saved.version === STATE_VERSION) return saved;
  return initialState();
})();

const subs = new Set<() => void>();
function emit() { subs.forEach((f) => f()); saveState(state); }

export function getState() { return state; }

export function setState(next: AppState) { state = next; emit(); }

export function update(fn: (draft: AppState) => void) {
  const draft = structuredClone(state);
  fn(draft);
  state = draft;
  emit();
}

export function updateProject(id: string, fn: (p: Project) => void) {
  update((s) => { const p = s.projects.find((x) => x.id === id); if (p) fn(p); });
}

export function useStore<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => sel(state));
}

export function resetAll() { clearState(); state = initialState(); emit(); }

export function track(name: string, props?: Record<string, unknown>) {
  // Production: PostHog (EU cloud) via server-side capture for billing events.
  update((s) => { s.events.unshift({ at: nowIso(), name, props }); s.events = s.events.slice(0, 400); });
}

export function notify(n: Omit<Notification, 'id' | 'at' | 'read'>) {
  update((s) => { s.notifications.unshift({ ...n, id: uid('n'), at: nowIso(), read: false }); });
}

// ---------------------------------------------------------------------------
// Router (hash-based, works inside the artifact frame; falls back to memory)

let route = (() => { try { return location.hash.replace(/^#/, '') || '/'; } catch { return '/'; } })();
if (!route.startsWith('/')) route = '/';
const rsubs = new Set<() => void>();
try { window.addEventListener('hashchange', () => { const h = location.hash.replace(/^#/, '') || '/'; if (h !== route && h.startsWith('/')) { route = h; rsubs.forEach((f) => f()); } }); } catch { /* ignore */ }

export function navigate(to: string) {
  if (to === route) return;
  route = to;
  try { history.pushState(null, '', '#' + to); } catch { /* sandboxed: memory routing */ }
  rsubs.forEach((f) => f());
  try { window.scrollTo(0, 0); document.getElementById('app-main')?.scrollTo(0, 0); } catch { /* ignore */ }
}

export function useRoute() {
  return useSyncExternalStore((cb) => { rsubs.add(cb); return () => rsubs.delete(cb); }, () => route);
}

// ---------------------------------------------------------------------------
// Toasts

export interface Toast { id: string; text: string; tone?: 'ok' | 'warn' | 'bad' | 'neutral'; }
let toasts: Toast[] = [];
const tsubs = new Set<() => void>();
export function toast(text: string, tone: Toast['tone'] = 'neutral') {
  const t = { id: uid('t'), text, tone };
  toasts = [...toasts, t];
  tsubs.forEach((f) => f());
  setTimeout(() => { toasts = toasts.filter((x) => x.id !== t.id); tsubs.forEach((f) => f()); }, 3800);
}
export function useToasts() {
  return useSyncExternalStore((cb) => { tsubs.add(cb); return () => tsubs.delete(cb); }, () => toasts);
}
