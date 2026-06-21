-- Run once in the Supabase SQL editor (project: yuntwerxahgmaoduxvqc) so the website can
-- collect emails. Anonymous users can INSERT only (they cannot read the list) — safe for a
-- public static site using the anon key.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  language text,
  source text,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_uniq on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

drop policy if exists "anon can join waitlist" on public.waitlist;
create policy "anon can join waitlist"
  on public.waitlist for insert
  to anon
  with check (true);
