-- PROPO · Tope de propuestas por plan (lo comprueba el servidor de IA antes de cada petición).
-- Una propuesta = una licitación analizada. Todo lo que se hace dentro de ella está incluido, con un límite interno de
-- uso razonable. Prueba: 1 propuesta en total · Pro: 6 al mes · Business: 17 al mes.

-- Plan de cada cliente (lo actualizará Stripe al pagar; de momento todos empiezan en la prueba gratuita).
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'trial',
  trial_ends_at timestamptz not null default now() + interval '14 days',
  period_start timestamptz not null default now(),
  extra_proposals int not null default 0,
  is_admin boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
drop policy if exists "Cada usuario ve su plan" on public.subscriptions;
create policy "Cada usuario ve su plan" on public.subscriptions for select using ((select auth.uid()) = user_id);

-- Propuestas usadas: una fila por licitación analizada (y una por día para las consultas fuera de una propuesta).
create table if not exists public.proposal_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  created_at timestamptz not null default now(),
  actions int not null default 0,
  primary key (user_id, project_id)
);
alter table public.proposal_usage enable row level security;
drop policy if exists "Cada usuario ve su uso" on public.proposal_usage;
create policy "Cada usuario ve su uso" on public.proposal_usage for select using ((select auth.uid()) = user_id);

-- Freno por minuto (contra usos automáticos).
create table if not exists public.ai_rate (
  user_id uuid not null references auth.users(id) on delete cascade,
  minute timestamptz not null,
  n int not null default 0,
  primary key (user_id, minute)
);
alter table public.ai_rate enable row level security;

-- Cada cuenta nueva empieza con su prueba gratuita.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.subscriptions (user_id) values (new.id) on conflict do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
insert into public.subscriptions (user_id) select id from auth.users on conflict do nothing;

-- ¿Puede este usuario hacer una petición de IA para este proyecto? Comprueba y apunta en un solo paso.
create or replace function public.use_ai(p_user uuid, p_project text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  s public.subscriptions%rowtype;
  general boolean := coalesce(p_project, '') = '';
  pid text := case when coalesce(p_project, '') = '' then 'general:' || to_char(now(), 'YYYY-MM-DD') else left(p_project, 120) end;
  quota int; cap int; used int; acts int; per_min int; win timestamptz;
begin
  insert into public.subscriptions (user_id) values (p_user) on conflict do nothing;
  select * into s from public.subscriptions where user_id = p_user;

  delete from public.ai_rate where user_id = p_user and minute < now() - interval '1 hour';
  insert into public.ai_rate (user_id, minute, n) values (p_user, date_trunc('minute', now()), 1)
    on conflict (user_id, minute) do update set n = public.ai_rate.n + 1 returning n into per_min;

  if s.is_admin then
    insert into public.proposal_usage (user_id, project_id, actions) values (p_user, pid, 1)
      on conflict (user_id, project_id) do update set actions = public.proposal_usage.actions + 1;
    return jsonb_build_object('ok', true, 'admin', true);
  end if;
  if per_min > 40 then return jsonb_build_object('ok', false, 'reason', 'rate_limited'); end if;
  if s.plan = 'trial' and s.trial_ends_at < now() then return jsonb_build_object('ok', false, 'reason', 'trial_expired'); end if;

  quota := case s.plan when 'trial' then 1 when 'pro' then 6 when 'business' then 17 when 'enterprise' then 999 else 0 end;
  cap := case when general then 60 else case s.plan when 'trial' then 60 when 'pro' then 100 when 'business' then 150 when 'enterprise' then 1000 else 0 end end;

  select actions into acts from public.proposal_usage where user_id = p_user and project_id = pid;
  if found then
    if acts >= cap then return jsonb_build_object('ok', false, 'reason', case when general then 'daily_limit' else 'actions_limit' end, 'cap', cap); end if;
    update public.proposal_usage set actions = actions + 1 where user_id = p_user and project_id = pid;
    return jsonb_build_object('ok', true, 'actions', acts + 1, 'cap', cap);
  end if;

  if not general then
    -- Prueba: en total. Planes de pago: desde el inicio del mes de facturación en curso.
    win := case when s.plan = 'trial' then '-infinity'::timestamptz
      else s.period_start + make_interval(months => (extract(year from age(now(), s.period_start)) * 12 + extract(month from age(now(), s.period_start)))::int) end;
    select count(*) into used from public.proposal_usage where user_id = p_user and created_at >= win and project_id not like 'general:%';
    if used >= quota + s.extra_proposals then
      return jsonb_build_object('ok', false, 'reason', 'proposal_limit', 'used', used, 'quota', quota + s.extra_proposals);
    end if;
  end if;

  insert into public.proposal_usage (user_id, project_id, actions) values (p_user, pid, 1)
    on conflict (user_id, project_id) do update set actions = public.proposal_usage.actions + 1;
  return jsonb_build_object('ok', true, 'new', not general, 'actions', 1, 'cap', cap);
end; $$;

-- Solo el servidor de IA (con la clave secreta) puede usar esta función.
revoke all on function public.use_ai(uuid, text) from public, anon, authenticated;
grant execute on function public.use_ai(uuid, text) to service_role;

-- Las cuentas del dueño de PROPO no tienen tope.
update public.subscriptions set is_admin = true
  where user_id in (select id from auth.users where lower(email) in ('joaquimfachado@gmail.com', 'hola@propo.es'));

select u.email, s.plan, s.is_admin, s.trial_ends_at::date from public.subscriptions s join auth.users u on u.id = s.user_id order by u.created_at;
