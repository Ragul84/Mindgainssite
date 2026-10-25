-- Minimal page analytics for mindgains.ai.
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Deliberately holds nothing that identifies a person: path, referring host, a coarse screen
-- bucket, a timestamp. No cookies, no IP, no user id, no fingerprint. Inserts are open (the
-- page is anonymous); reads are closed, so nobody can scrape your traffic with the anon key.

create table if not exists public.page_views (
  id         bigserial primary key,
  path       text        not null,
  ref        text        not null default '',
  screen     text        not null default '',
  created_at timestamptz not null default now()
);

create index if not exists page_views_day_path on public.page_views (created_at desc, path);

alter table public.page_views enable row level security;

-- anyone may record a view...
drop policy if exists "page_views insert anon" on public.page_views;
create policy "page_views insert anon" on public.page_views
  for insert to anon, authenticated with check (true);

-- ...but nobody may read them back through the API. Query from the SQL editor instead.
drop policy if exists "page_views no read" on public.page_views;

-- ---------------------------------------------------------------------------------------------
-- Useful queries
-- ---------------------------------------------------------------------------------------------
-- Traffic per day:
--   select created_at::date d, count(*) views from page_views group by 1 order by 1 desc limit 30;
--
-- Which pages actually earn attention (the whole point — the site has ~708 indexed URLs and
-- nobody knew which ones work):
--   select path, count(*) views from page_views
--   where created_at > now() - interval '30 days' group by 1 order by 2 desc limit 40;
--
-- Where people come from:
--   select coalesce(nullif(ref,''),'(direct)') src, count(*) from page_views
--   where created_at > now() - interval '30 days' group by 1 order by 2 desc limit 20;
--
-- Phone vs desktop (you assume ~90% phone — this tells you):
--   select screen, count(*) from page_views group by 1 order by 2 desc;
--
-- Does NationLap actually get reached from the content pages?
--   select count(*) filter (where path like '/nationlap%') as game,
--          count(*) filter (where path like '/get%')       as waitlist,
--          count(*)                                        as total
--   from page_views where created_at > now() - interval '30 days';

-- ---------------------------------------------------------------------------------------------
-- Attribution: which surface sent them (ig, app, a content page, a campaign).
-- Captured from ?src= or ?utm_source= and remembered for the visit, so a signup several pages
-- later is still credited to whatever brought them in.
-- ---------------------------------------------------------------------------------------------
alter table public.page_views add column if not exists src text not null default '';
create index if not exists page_views_src on public.page_views (src, created_at desc);

-- Which surface actually brings people:
--   select coalesce(nullif(src,''),'(none)') src, count(*) from page_views
--   where created_at > now() - interval '30 days' group by 1 order by 2 desc;
--
-- Does Instagram traffic reach the game, and then the waitlist?
--   select src,
--          count(*)                                            as views,
--          count(*) filter (where path like '/nationlap%')      as played,
--          count(*) filter (where path like '/get%')            as waitlist
--   from page_views where created_at > now() - interval '30 days'
--   group by 1 order by 2 desc;
