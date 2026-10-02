-- PROPO — production schema (PostgreSQL 15+ on Supabase, EU region)
-- Multi-tenant: every row belongs to a workspace (company). Row-Level Security enforces
-- that a user only reads/writes rows of workspaces they are a member of.
-- The four content layers are separate tables on purpose (anti-hallucination):
--   source_documents/document_chunks  -> what the tender says
--   company_* / vault_documents       -> what the company has proven
--   generated_content                 -> what the AI drafted (never trusted by default)
--   approved_content                  -> what a human signed off

create extension if not exists "uuid-ossp";
create extension if not exists vector;       -- pgvector
create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- Tenancy
create table workspaces (
  id uuid primary key default uuid_generate_v4(),
  legal_name text not null,
  trade_name text,
  tax_id text,
  address text,
  country text default 'ES',
  industry text,
  employees text,
  revenue text,
  website text,
  description text,
  capabilities text[] default '{}',
  cpvs text[] not null default '{}',          -- prefijos CPV de interés (buscador de licitaciones)
  regions text[] not null default '{}',       -- códigos NUTS2 donde trabaja la empresa
  data_retention_months int not null default 24,
  created_at timestamptz not null default now()
);

create type member_role as enum ('owner', 'admin', 'editor', 'reviewer');
create table memberships (
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role member_role not null default 'editor',
  status text not null default 'active',           -- active | invited
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text, role_title text, locale text default 'en',
  onboarding jsonb default '{}'::jsonb,              -- frequency, team size, completed steps
  created_at timestamptz not null default now()
);

-- helper used by every policy
create or replace function is_member(ws uuid, min_role member_role default 'reviewer')
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from memberships m
    where m.workspace_id = ws and m.user_id = auth.uid() and m.status = 'active'
      and array_position(enum_range(null::member_role), m.role) <= array_position(enum_range(null::member_role), min_role)
  );
$$;

-- ---------------------------------------------------------------------------
-- Billing (source of truth for limits; written only by the Stripe webhook with the service role)
create type plan_id as enum ('trial', 'free', 'pro', 'business', 'enterprise');
create type sub_status as enum ('trialing', 'active', 'past_due', 'canceled', 'expired');
create table subscriptions (
  workspace_id uuid primary key references workspaces(id) on delete cascade,
  plan plan_id not null default 'trial',
  status sub_status not null default 'trialing',
  billing_cycle text not null default 'monthly',
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  updated_at timestamptz not null default now()
);
create table invoices (
  id text primary key,                               -- Stripe invoice id
  workspace_id uuid references workspaces(id) on delete cascade,
  amount_cents int not null, currency text not null default 'eur',
  status text not null, hosted_url text, created_at timestamptz not null
);
create table usage_periods (
  workspace_id uuid references workspaces(id) on delete cascade,
  period_start timestamptz not null,
  proposals_created int not null default 0,
  extra_proposals_purchased int not null default 0,
  pages_analyzed int not null default 0,
  ai_actions int not null default 0,
  primary key (workspace_id, period_start)
);

-- ---------------------------------------------------------------------------
-- Company knowledge (permanent memory)
create table past_projects (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  title text not null, client text, sector text, years text, annual_value text,
  description text, has_certificate boolean default false,
  certificate_document_id uuid,
  created_at timestamptz not null default now()
);
create table certifications (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null, issuer text, valid_until date, category text,
  document_id uuid,
  created_at timestamptz not null default now()
);
create table team_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null, role text, years int, qualifications text, cv_document_id uuid
);
create table vault_documents (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  category text not null,                            -- corporate | financial | insurance | certificate | experience | team | proposal | other
  storage_path text not null,                        -- private bucket: {workspace_id}/vault/{id}
  sha256 text, pages int, size_bytes bigint,
  expires_at date,
  parse_status text not null default 'pending',      -- pending | parsed | partial | unreadable | unsupported
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create table approved_answers (                      -- templates & answer library
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null, kind text not null, body text not null,
  source_section_id uuid, used_count int default 0,
  embedding vector(1536),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projects (one tender / RFP / proposal)
create table projects (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null, organization text,
  type text not null default 'public_tender',
  stage text not null default 'analyzing',           -- analyzing | failed | active | submitted
  analysis jsonb,                                    -- summary, authority, cpv, budget, deadlines, exclusion risks, warnings, mode
  deadline timestamptz,
  manual_checks jsonb not null default '{}'::jsonb,  -- signature, financial_approved (human only)
  marked_ready_at timestamptz, marked_ready_by uuid references auth.users(id),
  ai_actions_used int not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create table source_documents (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  name text not null, kind text not null,
  storage_path text not null,                        -- {workspace_id}/projects/{project_id}/{id}
  pages int, size_bytes bigint,
  parse_status text not null default 'pending',
  ocr_used boolean default false,
  note text,
  created_at timestamptz not null default now()
);

create table document_chunks (
  id bigserial primary key,
  workspace_id uuid not null,                        -- denormalised for RLS + filtered ANN search
  project_id uuid,                                   -- null for vault chunks
  source_document_id uuid references source_documents(id) on delete cascade,
  vault_document_id uuid references vault_documents(id) on delete cascade,
  page int not null,
  clause text,
  content text not null,
  tsv tsvector generated always as (to_tsvector('simple', content)) stored,
  embedding vector(1536),
  check (source_document_id is not null or vault_document_id is not null)
);
create index on document_chunks using hnsw (embedding vector_cosine_ops);
create index on document_chunks using gin (tsv);
create index on document_chunks (workspace_id, project_id);

create table requirements (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  quote text not null,                               -- verbatim from source
  category text not null,
  mandatory boolean not null default true,
  critical boolean not null default false,           -- price, experience, certifications, legal, financial
  status text not null default 'needs_info',         -- fulfilled | needs_info | missing | skipped
  source_document_id uuid references source_documents(id) on delete set null,
  source_page int, source_clause text,
  quote_verified boolean not null default false,     -- validation step: quote found on cited page
  confidence real,
  ask text,
  human_validated_by uuid references auth.users(id),
  human_validated_at timestamptz,
  created_at timestamptz not null default now()
);
create table requirement_evidence (
  requirement_id uuid references requirements(id) on delete cascade,
  workspace_id uuid not null,
  kind text not null,                                -- company | vault | user
  ref_id uuid, label text not null,
  added_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table evaluation_criteria (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null, project_id uuid not null references projects(id) on delete cascade,
  grp text, name text not null, points numeric not null, kind text not null,
  description text, source_document_id uuid, source_page int
);

create table proposal_sections (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null, project_id uuid not null references projects(id) on delete cascade,
  position int not null, title text not null, guidance text,
  criteria_ids uuid[] default '{}',
  status text not null default 'not_started',        -- not_started | draft | ai_generated | reviewed | approved | rejected
  page_budget int
);

-- AI output, versioned. Never shown as final without a human status change.
create table generated_content (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null,
  section_id uuid references proposal_sections(id) on delete cascade,
  body text not null,
  citations jsonb not null default '[]'::jsonb,       -- [{marker, kind, source_document_id|company_ref, page}]
  missing text[] default '{}',
  confidence real,
  model text, prompt_version text, input_tokens int, output_tokens int,
  validation jsonb,                                   -- dropped citations, price leak, uncited statements
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
-- What a person approved. The submission package is built only from here.
create table approved_content (
  section_id uuid primary key references proposal_sections(id) on delete cascade,
  workspace_id uuid not null,
  generated_content_id uuid references generated_content(id),
  body text not null,
  approved_by uuid not null references auth.users(id),
  approved_at timestamptz not null default now()
);

create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null, project_id uuid not null references projects(id) on delete cascade,
  role text not null, body text not null, citations jsonb default '[]'::jsonb,
  created_by uuid, created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Operations
create table jobs (                                   -- mirrored from the queue (Trigger.dev / Inngest)
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null, project_id uuid,
  kind text not null,                                 -- ingest | ocr | chunk | embed | extract | match | generate
  status text not null default 'queued',
  progress jsonb, error_code text, attempts int default 0,
  created_at timestamptz not null default now(), finished_at timestamptz
);
create table ai_usage (
  id bigserial primary key,
  workspace_id uuid not null, project_id uuid,
  action text not null, model text, input_tokens int, output_tokens int, cost_eur numeric(10,5),
  created_at timestamptz not null default now()
);
create table audit_log (
  id bigserial primary key,
  workspace_id uuid not null,
  actor uuid, action text not null,                   -- document.uploaded, section.approved, package.downloaded, member.invited, data.exported ...
  target_type text, target_id text, meta jsonb,
  ip inet, created_at timestamptz not null default now()
);
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null, user_id uuid,
  kind text not null, title text not null, body text, project_id uuid,
  read_at timestamptz, created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Búsqueda de licitaciones (TED + PLACSP). `opportunities` es información pública compartida;
-- la compatibilidad, las guardadas y las alertas son privadas de cada espacio de trabajo.
create table opportunities (
  id uuid primary key default uuid_generate_v4(),
  source text not null check (source in ('ted', 'placsp')),
  external_id text not null,
  title text not null, buyer text, city text,
  cpv text[] not null default '{}', nuts text[] not null default '{}',
  published_at date, deadline timestamptz, value_eur numeric,       -- null si el anuncio no lo publica
  kind text, url text not null, raw jsonb,
  created_at timestamptz not null default now(),
  unique (source, external_id)
);
create index opportunities_cpv on opportunities using gin (cpv);
create index opportunities_deadline on opportunities (deadline);
create index opportunities_fts on opportunities using gin (to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(buyer,'')));

create table opportunity_matches (
  workspace_id uuid not null references workspaces on delete cascade,
  opportunity_id uuid not null references opportunities on delete cascade,
  score int not null check (score between 0 and 100),
  reasons jsonb not null,                                -- [{ok, text}] explicación mostrada al usuario
  computed_at timestamptz not null default now(),
  primary key (workspace_id, opportunity_id)
);
create table saved_opportunities (
  workspace_id uuid not null references workspaces on delete cascade,
  opportunity_id uuid not null references opportunities on delete cascade,
  saved_by uuid, created_at timestamptz not null default now(),
  project_id uuid references projects on delete set null, -- al pulsar «Analizar licitación»
  primary key (workspace_id, opportunity_id)
);
create table tender_alerts (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces on delete cascade,
  name text not null, query text, sector text, region text, min_score int default 0,
  created_by uuid, last_sent_at timestamptz, created_at timestamptz not null default now()
);
create table opportunity_documents (                 -- pliegos descargados de la plataforma oficial
  id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid not null references opportunities on delete cascade,
  name text not null, kind text not null check (kind in ('pcap','ppt','anexo','otro')),
  source_url text not null, storage_path text, pages int,
  fetched_at timestamptz not null default now(),
  unique (opportunity_id, source_url)
);
create table opportunity_briefs (                    -- resumen con IA; cada dato con documento y página verificados
  opportunity_id uuid primary key references opportunities on delete cascade,
  plain text not null, facts jsonb not null, asks jsonb not null, watch jsonb not null, criteria jsonb,
  read_from text[] not null, model text, created_at timestamptz not null default now()
);
create table sync_runs (
  id bigserial primary key, finished_at timestamptz not null, ok boolean not null, count int
);

alter table opportunities enable row level security;
create policy opp_read on opportunities for select to authenticated using (true); -- datos públicos
alter table opportunity_documents enable row level security;
create policy oppdoc_read on opportunity_documents for select to authenticated using (true);
alter table opportunity_briefs enable row level security;
create policy oppbrief_read on opportunity_briefs for select to authenticated using (true);
-- solo el rol de servicio (job de sincronización) escribe en opportunities, opportunity_matches y sync_runs

-- ---------------------------------------------------------------------------
-- Row-Level Security: one pattern for every workspace-scoped table
do $$
declare t text;
begin
  foreach t in array array['opportunity_matches','saved_opportunities','tender_alerts','past_projects','certifications','team_members','vault_documents','approved_answers','projects',
    'source_documents','document_chunks','requirements','requirement_evidence','evaluation_criteria','proposal_sections',
    'generated_content','approved_content','chat_messages','notifications','usage_periods','invoices','ai_usage','jobs']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "%s_read" on %I for select using (is_member(workspace_id, ''reviewer''))', t, t);
    execute format('create policy "%s_write" on %I for all using (is_member(workspace_id, ''editor'')) with check (is_member(workspace_id, ''editor''))', t, t);
  end loop;
end $$;

alter table workspaces enable row level security;
create policy ws_read on workspaces for select using (is_member(id, 'reviewer'));
create policy ws_update on workspaces for update using (is_member(id, 'admin'));

alter table memberships enable row level security;
create policy mem_read on memberships for select using (is_member(workspace_id, 'reviewer'));
create policy mem_admin on memberships for all using (is_member(workspace_id, 'admin'));

alter table subscriptions enable row level security;
create policy sub_read on subscriptions for select using (is_member(workspace_id, 'reviewer'));
-- no write policy: only the service role (Stripe webhook) writes subscriptions

alter table audit_log enable row level security;
create policy audit_read on audit_log for select using (is_member(workspace_id, 'admin'));
-- inserts via security-definer function log_event(); rows are append-only
revoke update, delete on audit_log from authenticated;

-- Approval is a human act: only reviewers+ and never by the service role on behalf of AI.
create or replace function approve_section(p_section uuid, p_generated uuid, p_body text)
returns void language plpgsql security invoker as $$
begin
  insert into approved_content(section_id, workspace_id, generated_content_id, body, approved_by)
  select s.id, s.workspace_id, p_generated, p_body, auth.uid() from proposal_sections s where s.id = p_section
  on conflict (section_id) do update set body = excluded.body, generated_content_id = excluded.generated_content_id, approved_by = auth.uid(), approved_at = now();
  update proposal_sections set status = 'approved' where id = p_section;
end $$;

-- Storage (Supabase): private buckets, path prefix = workspace_id
-- create policy "vault files" on storage.objects for select using (bucket_id = 'documents' and is_member((storage.foldername(name))[1]::uuid));
-- Downloads always through createSignedUrl(path, 60) from a server route that re-checks membership.
