-- Migration: Mission orchestration tables
-- Defines mission_runs, blocks, lessons, exams, and events to support the unified Study Toggle flow.

create type public.mission_state as enum ('idle', 'planning', 'active', 'paused', 'completed');

create type public.mission_event_type as enum (
    'plan_generated',
    'lesson_started',
    'lesson_completed',
    'exam_started',
    'exam_completed',
    'pause',
    'resume',
    'distraction',
    'whatsapp_send',
    'mindshield_on',
    'mindshield_off',
    'mission_complete'
);

create table if not exists public.mission_runs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    topic text not null,
    description text,
    duration_minutes int not null check (duration_minutes > 0),
    state public.mission_state not null default 'idle',
    focus_blocked_apps jsonb not null default '[]'::jsonb,
    whatsapp_plan jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    started_at timestamptz,
    completed_at timestamptz,
    last_block_index int not null default 0,
    last_event_at timestamptz,
    metadata jsonb not null default '{}'::jsonb
);

create index if not exists mission_runs_user_state_idx
    on public.mission_runs(user_id, state);

create table if not exists public.mission_blocks (
    id uuid primary key default gen_random_uuid(),
    mission_id uuid not null references public.mission_runs(id) on delete cascade,
    sequence int not null,
    title text not null,
    objective text,
    duration_minutes int not null check (duration_minutes > 0),
    method text,
    status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
    content jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists mission_blocks_mission_seq_idx
    on public.mission_blocks(mission_id, sequence);

create table if not exists public.mission_lessons (
    id uuid primary key default gen_random_uuid(),
    mission_id uuid not null references public.mission_runs(id) on delete cascade,
    block_sequence int not null,
    title text not null,
    content text not null,
    recall_question text,
    resources jsonb not null default '[]'::jsonb,
    status text not null default 'pending' check (status in ('pending', 'delivered', 'completed')),
    created_at timestamptz not null default now(),
    completed_at timestamptz
);

create index if not exists mission_lessons_mission_seq_idx
    on public.mission_lessons(mission_id, block_sequence);

create table if not exists public.mission_exams (
    id uuid primary key default gen_random_uuid(),
    mission_id uuid not null references public.mission_runs(id) on delete cascade,
    block_sequence int not null,
    title text,
    questions jsonb not null default '[]'::jsonb,
    score int,
    total_questions int,
    status text not null default 'pending' check (status in ('pending', 'active', 'completed')),
    created_at timestamptz not null default now(),
    completed_at timestamptz
);

create index if not exists mission_exams_mission_seq_idx
    on public.mission_exams(mission_id, block_sequence);

create table if not exists public.mission_events (
    id uuid primary key default gen_random_uuid(),
    mission_id uuid not null references public.mission_runs(id) on delete cascade,
    event_type public.mission_event_type not null,
    payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists mission_events_mission_idx
    on public.mission_events(mission_id, created_at);

alter table public.mission_runs enable row level security;
alter table public.mission_blocks enable row level security;
alter table public.mission_lessons enable row level security;
alter table public.mission_exams enable row level security;
alter table public.mission_events enable row level security;

create policy "mission_runs_owner" on public.mission_runs
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "mission_blocks_owner" on public.mission_blocks
    for all using (exists (
        select 1 from public.mission_runs mr
        where mr.id = mission_blocks.mission_id and mr.user_id = auth.uid()
    )) with check (true);

create policy "mission_lessons_owner" on public.mission_lessons
    for all using (exists (
        select 1 from public.mission_runs mr
        where mr.id = mission_lessons.mission_id and mr.user_id = auth.uid()
    )) with check (true);

create policy "mission_exams_owner" on public.mission_exams
    for all using (exists (
        select 1 from public.mission_runs mr
        where mr.id = mission_exams.mission_id and mr.user_id = auth.uid()
    )) with check (true);

create policy "mission_events_owner" on public.mission_events
    for select using (exists (
        select 1 from public.mission_runs mr
        where mr.id = mission_events.mission_id and mr.user_id = auth.uid()
    ));
