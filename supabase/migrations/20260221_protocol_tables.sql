-- Migration: Protocol master vault + user protocols
-- Adds master_content_vault and user_protocols for Daily Mission system.

create table if not exists public.master_content_vault (
    id uuid primary key default gen_random_uuid(),
    track_id text not null,
    day_number int not null check (day_number > 0),
    topic_title text,
    content_json jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (track_id, day_number)
);

create index if not exists master_content_vault_track_day_idx
    on public.master_content_vault(track_id, day_number);

create table if not exists public.user_protocols (
    user_id uuid primary key references auth.users(id) on delete cascade,
    track_id text not null,
    current_day_number int not null default 1 check (current_day_number > 0),
    progress_phase int not null default 1 check (progress_phase between 1 and 4),
    last_unlock_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.master_content_vault enable row level security;
alter table public.user_protocols enable row level security;

-- Master vault: read-only for authenticated users
create policy "master_content_vault_read" on public.master_content_vault
    for select using (auth.role() = 'authenticated');

-- User protocols: users manage their own row
create policy "user_protocols_owner" on public.user_protocols
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Optional: keep updated_at fresh with a simple triggerbtw we can only
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists master_content_vault_touch on public.master_content_vault;
create trigger master_content_vault_touch
before update on public.master_content_vault
for each row execute function public.touch_updated_at();

drop trigger if exists user_protocols_touch on public.user_protocols;
create trigger user_protocols_touch
before update on public.user_protocols
for each row execute function public.touch_updated_at();
