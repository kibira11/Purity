-- The Journey to Purity: database schema, row-level security, and pairing functions.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query > paste > Run).
--
-- Privacy model:
--   * Your own rows are always yours.
--   * Your paired friend can see: your milestone progress, your check-in statuses, your study-plan progress,
--     journal entries and testimonies you explicitly marked "shared", and check-in notes you marked shared.
--   * Everything else (private journal entries, private check-in notes) is unreadable to anyone but you,
--     enforced by the database itself, not just the app.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.partnerships (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users (id) on delete cascade,
  user_b uuid references auth.users (id) on delete cascade,
  code text not null unique,
  status text not null default 'pending' check (status in ('pending', 'active')),
  created_at timestamptz not null default now(),
  check (user_b is null or user_a <> user_b)
);
create unique index if not exists partnerships_user_a_idx on public.partnerships (user_a);
create unique index if not exists partnerships_user_b_idx on public.partnerships (user_b) where user_b is not null;

create table if not exists public.milestone_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  milestone_id text not null,
  game_won boolean not null default false,
  sealed boolean not null default false,
  challenge_done boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, milestone_id)
);

create table if not exists public.checkins (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  mind text not null default 'na' check (mind in ('walked', 'wavered', 'fell', 'na')),
  purity text not null default 'na' check (purity in ('walked', 'wavered', 'fell', 'na')),
  substances text not null default 'na' check (substances in ('walked', 'wavered', 'fell', 'na')),
  note text,
  note_shared boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.journal_entries (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  milestone_id text,
  prompt text,
  body text not null default '',
  shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists journal_entries_user_idx on public.journal_entries (user_id, updated_at desc);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users (id) on delete cascade,
  to_user uuid not null references auth.users (id) on delete cascade,
  kind text not null default 'encouragement' check (kind in ('encouragement', 'prayer', 'sos')),
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists notes_to_idx on public.notes (to_user, created_at desc);

create table if not exists public.plan_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null,
  days integer[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, plan_id)
);

create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null,
  shared boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper: who is my partner? (SECURITY DEFINER so policies can use it safely)
-- ---------------------------------------------------------------------------

create or replace function public.partner_of(uid uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select case when user_a = uid then user_b else user_a end
  from public.partnerships
  where status = 'active' and (user_a = uid or user_b = uid)
  limit 1;
$$;

-- ---------------------------------------------------------------------------
-- New user: create a profile automatically
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Pairing functions
-- ---------------------------------------------------------------------------

-- Create (or return) my invite code.
create or replace function public.create_partnership()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  existing public.partnerships;
  new_code text;
begin
  if me is null then raise exception 'not signed in'; end if;

  select * into existing from public.partnerships where user_a = me or user_b = me limit 1;
  if found then return existing.code; end if;

  loop
    new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.partnerships where code = new_code);
  end loop;

  insert into public.partnerships (user_a, code) values (me, new_code);
  return new_code;
end;
$$;

-- Join a friend using their code.
create or replace function public.join_partnership(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  target public.partnerships;
begin
  if me is null then raise exception 'not signed in'; end if;
  if exists (select 1 from public.partnerships where (user_a = me or user_b = me) and status = 'active') then
    raise exception 'You are already paired.';
  end if;

  select * into target from public.partnerships where code = upper(trim(p_code)) for update;
  if not found then raise exception 'That code was not found. Check it and try again.'; end if;
  if target.status = 'active' then raise exception 'That code has already been used.'; end if;
  if target.user_a = me then raise exception 'That is your own code. Share it with your friend.'; end if;

  -- drop my own unused pending invite, if any
  delete from public.partnerships where user_a = me and status = 'pending';

  update public.partnerships set user_b = me, status = 'active' where id = target.id;
  return 'active';
end;
$$;

-- Leave a partnership (either person can).
create or replace function public.leave_partnership()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.partnerships where user_a = auth.uid() or user_b = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Shared view of a partner's check-ins (note is hidden unless they shared it)
-- ---------------------------------------------------------------------------

create or replace view public.partner_checkins as
select
  c.user_id,
  c.day,
  c.mind,
  c.purity,
  c.substances,
  case when c.note_shared then c.note else null end as note,
  c.updated_at
from public.checkins c
where c.user_id = public.partner_of(auth.uid());

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.partnerships enable row level security;
alter table public.milestone_progress enable row level security;
alter table public.checkins enable row level security;
alter table public.journal_entries enable row level security;
alter table public.notes enable row level security;
alter table public.plan_progress enable row level security;
alter table public.testimonies enable row level security;

-- profiles
drop policy if exists "profiles read self or partner" on public.profiles;
create policy "profiles read self or partner" on public.profiles
  for select using (id = auth.uid() or id = public.partner_of(auth.uid()));
drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self" on public.profiles
  for insert with check (id = auth.uid());
drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- partnerships: members can read; changes happen only through the functions above
drop policy if exists "partnerships read members" on public.partnerships;
create policy "partnerships read members" on public.partnerships
  for select using (user_a = auth.uid() or user_b = auth.uid());

-- milestone_progress: partner can see, only I can write
drop policy if exists "progress read self or partner" on public.milestone_progress;
create policy "progress read self or partner" on public.milestone_progress
  for select using (user_id = auth.uid() or user_id = public.partner_of(auth.uid()));
drop policy if exists "progress write self" on public.milestone_progress;
create policy "progress write self" on public.milestone_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- checkins: ONLY me on the base table (partner reads through the partner_checkins view)
drop policy if exists "checkins self only" on public.checkins;
create policy "checkins self only" on public.checkins
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- journal: mine, plus entries I explicitly shared with my partner
drop policy if exists "journal read self or shared" on public.journal_entries;
create policy "journal read self or shared" on public.journal_entries
  for select using (
    user_id = auth.uid() or (shared = true and user_id = public.partner_of(auth.uid()))
  );
drop policy if exists "journal write self" on public.journal_entries;
create policy "journal write self" on public.journal_entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- notes between partners
drop policy if exists "notes read parties" on public.notes;
create policy "notes read parties" on public.notes
  for select using (from_user = auth.uid() or to_user = auth.uid());
drop policy if exists "notes send to partner" on public.notes;
create policy "notes send to partner" on public.notes
  for insert with check (from_user = auth.uid() and to_user = public.partner_of(auth.uid()));
drop policy if exists "notes mark read" on public.notes;
create policy "notes mark read" on public.notes
  for update using (to_user = auth.uid()) with check (to_user = auth.uid());
drop policy if exists "notes delete own" on public.notes;
create policy "notes delete own" on public.notes
  for delete using (from_user = auth.uid());

-- plan progress: partner can see
drop policy if exists "plans read self or partner" on public.plan_progress;
create policy "plans read self or partner" on public.plan_progress
  for select using (user_id = auth.uid() or user_id = public.partner_of(auth.uid()));
drop policy if exists "plans write self" on public.plan_progress;
create policy "plans write self" on public.plan_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- testimonies: mine, plus ones I marked shared
drop policy if exists "testimonies read self or shared" on public.testimonies;
create policy "testimonies read self or shared" on public.testimonies
  for select using (
    user_id = auth.uid() or (shared = true and user_id = public.partner_of(auth.uid()))
  );
drop policy if exists "testimonies write self" on public.testimonies;
create policy "testimonies write self" on public.testimonies
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on public.partner_checkins to authenticated;
grant execute on function public.create_partnership() to authenticated;
grant execute on function public.join_partnership(text) to authenticated;
grant execute on function public.leave_partnership() to authenticated;
grant execute on function public.partner_of(uuid) to authenticated;
revoke all on public.partnerships from authenticated;
grant select on public.partnerships to authenticated;
