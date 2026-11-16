-- Bible study groups (in addition to 1:1 partnerships).
-- Run after 001_init.sql in the Supabase SQL editor.

create table if not exists public.study_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  study_id text not null,
  sessions integer[] not null default '{}',
  answers jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, study_id)
);

create table if not exists public.study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  study_id text not null,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.study_groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('leader', 'member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create unique index if not exists group_members_user_idx on public.group_members (user_id);

create table if not exists public.group_posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups (id) on delete cascade,
  session int not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null default 'answer' check (kind in ('answer', 'prayer')),
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists group_posts_group_session_idx on public.group_posts (group_id, session, created_at desc);

create or replace function public.is_group_member(gid uuid, uid uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.group_members where group_id = gid and user_id = uid
  );
$$;

create or replace function public.create_study_group(p_name text, p_study_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  gid uuid;
  new_code text;
  member_count int;
begin
  if me is null then raise exception 'not signed in'; end if;

  select count(*) into member_count from public.group_members where user_id = me;
  if member_count >= 12 then raise exception 'You are in too many groups.'; end if;

  loop
    new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.study_groups where code = new_code);
  end loop;

  insert into public.study_groups (name, code, study_id, created_by)
  values (trim(p_name), new_code, p_study_id, me)
  returning id into gid;

  insert into public.group_members (group_id, user_id, role) values (gid, me, 'leader');
  return new_code;
end;
$$;

create or replace function public.join_study_group(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  target public.study_groups;
  members int;
begin
  if me is null then raise exception 'not signed in'; end if;

  select * into target from public.study_groups where code = upper(trim(p_code)) for update;
  if not found then raise exception 'That code was not found.'; end if;

  if exists (select 1 from public.group_members where group_id = target.id and user_id = me) then
    return target.id;
  end if;

  select count(*) into members from public.group_members where group_id = target.id;
  if members >= 12 then raise exception 'This group is full.'; end if;

  if exists (select 1 from public.group_members where user_id = me) then
    raise exception 'You are already in a group. Leave it first.';
  end if;

  insert into public.group_members (group_id, user_id, role) values (target.id, me, 'member');
  return target.id;
end;
$$;

create or replace function public.leave_study_group(p_group_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  my_role text;
begin
  if me is null then raise exception 'not signed in'; end if;
  select role into my_role from public.group_members where group_id = p_group_id and user_id = me;
  if my_role is null then raise exception 'Not a member.'; end if;

  delete from public.group_members where group_id = p_group_id and user_id = me;

  if my_role = 'leader' then
    update public.group_members set role = 'leader'
    where group_id = p_group_id and user_id = (
      select user_id from public.group_members where group_id = p_group_id order by joined_at limit 1
    );
  end if;

  if not exists (select 1 from public.group_members where group_id = p_group_id) then
    delete from public.study_groups where id = p_group_id;
  end if;
end;
$$;

alter table public.study_progress enable row level security;
alter table public.study_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_posts enable row level security;

create policy "study_progress self" on public.study_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "study_progress group peers" on public.study_progress
  for select using (
    exists (
      select 1 from public.group_members gm
      join public.group_members gm2 on gm.group_id = gm2.group_id
      join public.study_groups g on g.id = gm.group_id
      where gm.user_id = auth.uid() and gm2.user_id = study_progress.user_id and g.study_id = study_progress.study_id
    )
  );

create policy "groups members read" on public.study_groups
  for select using (public.is_group_member(id));

create policy "members see membership" on public.group_members
  for select using (public.is_group_member(group_id));

create policy "posts members read" on public.group_posts
  for select using (public.is_group_member(group_id));

create policy "posts members write" on public.group_posts
  for insert with check (public.is_group_member(group_id) and auth.uid() = user_id);

create policy "posts delete own" on public.group_posts
  for delete using (auth.uid() = user_id);

create policy "posts leader delete" on public.group_posts
  for delete using (
    exists (
      select 1 from public.group_members
      where group_id = group_posts.group_id and user_id = auth.uid() and role = 'leader'
    )
  );