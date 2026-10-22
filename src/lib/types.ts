// Domain model. Mirrors db/schema.sql (production, Postgres + RLS).
// Four content layers are kept separate on purpose:
//   SourceDoc / Chunk        -> what the tender says          (source_documents, document_chunks)
//   CompanyKnowledge         -> what the company has proven   (company_*, vault_documents)
//   Section.content (ai_*)   -> what the AI drafted           (generated_content)
//   Section.status=approved  -> what a human signed off       (approved_content)

export type PlanId = 'trial' | 'free' | 'pro' | 'business' | 'enterprise';
export type SubStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'expired';

export interface Subscription {
  plan: PlanId;
  status: SubStatus;
  billingCycle: 'monthly' | 'annual';
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;      // null until Stripe is connected
  stripeSubscriptionId: string | null;
  simulated: boolean;                   // true when plan was switched locally (demo only)
}

export interface Usage {
  periodStart: string;
  proposalsCreated: number;
  pagesAnalyzed: number;
  aiActions: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  /** Huella de la contraseña de la cuenta local (ver services/localAuth). Las cuentas antiguas no la tienen. */
  pass?: import('./services/localAuth').PassHash;
  /** Cuenta del servidor (Supabase): el trabajo se guarda allí. */
  cloud?: boolean;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'reviewer';
  status: 'active' | 'invited';
}

export interface CompanyInfo {
  legalName: string;
  tradeName: string;
  taxId: string;
  address: string;
  country: string;
  industry: string;
  employees: string;
  revenue: string;
  website: string;
  description: string;
  capabilities: string[];
  signer?: string;          // representante legal que firma las ofertas
  sectors: string[];
  cpvs: string[];          // CPV prefixes the company bids for (discovery matching)
  regions: string[];       // NUTS prefixes where the company works, e.g. ES51
  logo?: string;           // data URL (PNG) del logo: portada y cabecera de los PDF
  brandColor?: string;     // color corporativo en hexadecimal, p. ej. #0B1730
  // Constructoras
  clasificaciones?: { grupo: string; subgrupo: string; categoria: string }[];   // clasificación de contratistas (RD 773/2015)
  rolece?: boolean;        // inscrita en el ROLECE o en el registro de su comunidad
  rera?: boolean;          // inscrita en el RERA (trabajos con amianto)
  maquinaria?: { id: string; nombre: string; cantidad: number; propia: boolean }[];
}

export interface PastProject {
  id: string;
  title: string;
  client: string;
  sector: string;
  years: string;
  value: string;
  description: string;
  hasCertificate: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  validUntil: string;
  category: 'quality' | 'environmental' | 'safety' | 'industry' | 'other';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  years: number;
  qualifications: string;
}

export type VaultCategory = 'corporate' | 'financial' | 'insurance' | 'certificate' | 'experience' | 'team' | 'proposal' | 'other';

export interface VaultDoc {
  id: string;
  name: string;
  category: VaultCategory;
  uploadedAt: string;
  expiresAt?: string;
  pages: number;
  sizeKb: number;
  usedIn: number;
  hasFile: boolean;          // false for sample records without a stored file
  textKey?: string;          // IndexedDB key for extracted text
}

export interface Chunk {
  id: string;
  docId: string;
  page: number;
  text: string;
}

export interface SourceDoc {
  id: string;
  name: string;
  kind: 'pdf' | 'docx' | 'xlsx' | 'txt' | 'other';
  pages: number;
  sizeKb: number;
  status: 'parsed' | 'unreadable' | 'unsupported' | 'partial' | 'excerpt';
  note?: string;
  textKey?: string;          // IndexedDB key where page texts live
  excerpts?: Record<number, string>; // sample project: cited pages only
}

export type ReqStatus = 'fulfilled' | 'needs_info' | 'missing' | 'skipped';
export type ReqCategory = 'administrative' | 'technical' | 'financial' | 'experience' | 'certification' | 'format' | 'legal' | 'team';

export interface SourceRef {
  docId: string;
  docName: string;
  page: number;
  clause?: string;
  quote?: string;
  verified?: boolean;        // quote found on the cited page during validation
}

export interface Evidence {
  kind: 'company' | 'vault' | 'user';
  label: string;
  ref?: string;
}

export interface Requirement {
  id: string;
  title: string;
  text: string;
  plain?: string;            // what this clause asks for, in everyday language (written by the AI when reading the tender)
  how?: string;              // how it is proven, for this clause
  category: ReqCategory;
  mandatory: boolean;
  critical: boolean;         // price, experience, certifications, legal, financial -> human validation
  status: ReqStatus;
  source: SourceRef;
  evidence: Evidence[];
  ask?: string;              // what PROPO needs from the company
  actions?: string[];        // suggested buttons, e.g. ['Add project', 'Upload document']
  confidence: number;        // 0..1
  uncertain?: boolean;       // extraction could not be verified against the source
  note?: string;
  humanValidated?: boolean;
}

export interface Criterion {
  id: string;
  group: string;
  name: string;
  points: number;
  kind: 'judgement' | 'formula';
  description: string;
  source: SourceRef;
  coverage: 'strong' | 'partial' | 'weak' | 'n/a';
  addressedBy: string[];     // section ids
  howAddressed: string[];    // bullet points
  gaps: string[];
}

export type SectionStatus = 'not_started' | 'generating' | 'draft' | 'ai_generated' | 'reviewed' | 'approved' | 'rejected';

export interface Citation {
  marker: string;            // "S1"
  kind: 'tender' | 'company';
  label: string;
  docId?: string;
  page?: number;
  quote?: string;
}

export interface Section {
  id: string;
  title: string;
  guidance: string;          // why this section exists, from the tender
  status: SectionStatus;
  content: string;
  confidence: number | null;
  citations: Citation[];
  criteria: string[];        // criterion ids
  pageBudget?: number;
  form?: string;             // formulario del pliego que esta sección rellena (p. ej. «Anexo VIII · Ficha Pausa Café»)
  formDoc?: string;          // documento del pliego donde está ese formulario
  missing: string[];
  generatedBy?: 'ai' | 'template' | 'sample' | 'human';
  updatedAt?: string;
}

export interface ProjectAnalysis {
  mode: 'ai' | 'rules' | 'sample';
  summary: string;
  authority: string;
  reference: string;
  cpv?: string;
  budget?: string;
  duration?: string;
  deadline: string | null;   // ISO date
  deadlines: { label: string; date: string; source?: SourceRef }[];
  documentsAnalyzed: number;
  pages: number;
  requiredDocuments: number;
  pageLimit?: string;
  formsOnly?: boolean;       // la parte técnica se entrega en formularios del pliego; lo que vaya fuera no se valora
  formNote?: string;
  exclusionRisks: { text: string; source?: SourceRef }[];
  warnings: string[];
}

export type ProjectType = 'public_tender' | 'private_rfp' | 'commercial' | 'other';

export interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  mode?: 'ai' | 'retrieval' | 'sample';
  at: string;
}

export interface ActivityItem { at: string; text: string; }

export interface Project {
  id: string;
  name: string;
  organization: string;
  type: ProjectType;
  createdAt: string;
  isSample: boolean;
  tenderId?: string;        // TED / PLACSP notice this proposal comes from
  tender?: import('./discovery/tedSnapshot').TedNotice; // copia del anuncio al crear el proyecto (la licitación deja de estar en la lista al cerrar el plazo)
  stage: 'analyzing' | 'failed' | 'active' | 'submitted';
  docs: SourceDoc[];
  analysis: ProjectAnalysis | null;
  requirements: Requirement[];
  criteria: Criterion[];
  sections: Section[];
  manualChecks: Record<string, boolean>;   // e.g. signature, financialApproved
  markedReady: string | null;
  chat: ChatMsg[];
  activity: ActivityItem[];
  aiActionsUsed: number;
  interview?: Interview;   // conversación guiada «PROPO te pregunta»
  answers?: GivenAnswer[]; // datos que el cliente ha aportado al revisar la propuesta: se reutilizan en la comprobación final
  pricing?: import('./pricing').Pricing; // paso «Precio»: cómo puntúa el pliego, el precio elegido y los criterios con fórmula
  obra?: import('./obra').Obra;          // solo obras: lo que exige el pliego a la constructora, plan de obra y presupuesto ofertado
}

export interface GivenAnswer { label: string; kind: string; value: string; section: string; at: string }
export interface InterviewMsg { id: string; role: 'propo' | 'user'; text: string; at: string; qid?: string; source?: { docId: string; page: number; quote?: string; docName?: string }; actions?: { label: string; to: string }[] }
export interface Interview { msgs: InterviewMsg[]; answered: string[]; drafted?: boolean }

export interface Notification {
  id: string;
  at: string;
  kind: 'deadline' | 'info_needed' | 'ai_done' | 'billing' | 'system';
  title: string;
  body: string;
  projectId?: string;
  read: boolean;
}

export interface Template {
  id: string;
  name: string;
  kind: 'section' | 'answer' | 'structure';
  body: string;
  usedCount: number;
  updatedAt: string;
  source: 'sample' | 'approved' | 'user';
}

export interface Settings {
  language: string;
  emailNotifications: boolean;
  deadlineReminders: boolean;
  retentionMonths: number;         // how long closed projects' source documents are kept
  aiTraining: false;               // never used for training; kept explicit
}

export interface Onboarding {
  whatWeDo: string;
  frequency: string;
  teamSize: string;
  completedSteps: string[];
  dismissed: boolean;
}

export interface TenderAlert { id: string; name: string; query: string; sector: string; region: string; province?: string; createdAt: string; }

export interface AppState {
  version: number;
  user: User | null;
  signedOut?: boolean;
  company: CompanyInfo;
  pastProjects: PastProject[];
  certifications: Certification[];
  team: TeamMember[];
  vault: VaultDoc[];
  members: Member[];
  projects: Project[];
  notifications: Notification[];
  templates: Template[];
  subscription: Subscription;
  usage: Usage;
  settings: Settings;
  onboarding: Onboarding;
  savedTenders: string[];
  alerts: TenderAlert[];
  events: { at: string; name: string; props?: Record<string, unknown> }[];
  demo?: 'basic' | 'complete';   // espacio de ejemplo cargado desde «Explorar la demo»
}
