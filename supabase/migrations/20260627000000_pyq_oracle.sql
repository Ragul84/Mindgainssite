create table if not exists public.pyq_sources (
  id text primary key,
  exam text not null,
  board text,
  year integer,
  language text,
  title text not null,
  file_name text,
  file_path text not null,
  source_type text not null default 'pyq_pdf',
  created_at timestamptz not null default now()
);

create table if not exists public.pyq_questions (
  id text primary key,
  source_id text not null references public.pyq_sources(id) on delete cascade,
  exam text not null,
  year integer,
  subject text,
  topic text,
  subtopic text,
  question_number text,
  question_text text not null,
  options jsonb,
  answer_text text,
  explanation text,
  page_start integer,
  page_end integer,
  confidence numeric not null default 0.55,
  created_at timestamptz not null default now()
);

create index if not exists pyq_questions_exam_idx on public.pyq_questions (exam);
create index if not exists pyq_questions_exam_subject_idx on public.pyq_questions (exam, subject);
create index if not exists pyq_questions_topic_idx on public.pyq_questions (topic);
create index if not exists pyq_questions_year_idx on public.pyq_questions (year);
create index if not exists pyq_questions_source_idx on public.pyq_questions (source_id);

create or replace view public.pyq_topic_frequencies as
select
  exam,
  coalesce(subject, 'untagged') as subject,
  coalesce(topic, 'untagged') as topic,
  count(*)::integer as question_count,
  array_remove(array_agg(distinct year order by year), null) as years,
  count(distinct source_id)::integer as source_count
from public.pyq_questions
group by exam, coalesce(subject, 'untagged'), coalesce(topic, 'untagged');

alter table public.pyq_sources enable row level security;
alter table public.pyq_questions enable row level security;

drop policy if exists "Read PYQ sources" on public.pyq_sources;
create policy "Read PYQ sources"
on public.pyq_sources for select
to anon, authenticated
using (true);

drop policy if exists "Read PYQ questions" on public.pyq_questions;
create policy "Read PYQ questions"
on public.pyq_questions for select
to anon, authenticated
using (true);
