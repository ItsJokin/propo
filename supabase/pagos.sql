-- PROPO · Pagos con Stripe. Se ejecuta una vez en Supabase (SQL Editor), después de cuotas.sql.
-- El servidor de pagos (worker-pagos/) es el único que escribe estas columnas, con la clave secreta de Supabase:
-- cuando Stripe confirma un pago, una renovación, un cambio de plan o una cancelación, actualiza la fila del cliente.
-- El navegador solo puede leer su propia fila (política «Cada usuario ve su plan» de cuotas.sql).

alter table public.subscriptions add column if not exists status text not null default 'trialing';   -- trialing · active · past_due · canceled
alter table public.subscriptions add column if not exists billing_cycle text;                         -- monthly · annual
alter table public.subscriptions add column if not exists current_period_end timestamptz;
alter table public.subscriptions add column if not exists cancel_at_period_end boolean not null default false;
alter table public.subscriptions add column if not exists stripe_customer_id text;
alter table public.subscriptions add column if not exists stripe_subscription_id text;
create unique index if not exists subscriptions_stripe_customer on public.subscriptions (stripe_customer_id) where stripe_customer_id is not null;

-- Sin plan de pago activo (cancelado o impagado al final): sin propuestas nuevas, pero se conserva todo lo guardado.
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
  if s.plan not in ('trial', 'pro', 'business', 'enterprise') or s.status = 'canceled' then
    return jsonb_build_object('ok', false, 'reason', 'no_plan');
  end if;

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
revoke all on function public.use_ai(uuid, text) from public, anon, authenticated;
grant execute on function public.use_ai(uuid, text) to service_role;

-- Propuestas usadas en el periodo en curso, para el contador de «Facturación» (cada usuario solo ve las suyas).
create or replace function public.my_usage()
returns jsonb language plpgsql security definer stable set search_path = '' as $$
declare s public.subscriptions%rowtype; win timestamptz; used int;
begin
  select * into s from public.subscriptions where user_id = (select auth.uid());
  if not found then return jsonb_build_object('used', 0, 'since', null); end if;
  win := case when s.plan = 'trial' then '-infinity'::timestamptz
    else s.period_start + make_interval(months => (extract(year from age(now(), s.period_start)) * 12 + extract(month from age(now(), s.period_start)))::int) end;
  select count(*) into used from public.proposal_usage where user_id = s.user_id and created_at >= win and project_id not like 'general:%';
  return jsonb_build_object('used', used, 'since', case when s.plan = 'trial' then null else win end, 'extra', s.extra_proposals);
end; $$;
revoke all on function public.my_usage() from public, anon;
grant execute on function public.my_usage() to authenticated;

select count(*) as cuentas, count(*) filter (where status = 'active') as de_pago from public.subscriptions;
