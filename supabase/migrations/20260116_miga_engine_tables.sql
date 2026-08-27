-- Migration: Create tables for MiGA Voice + WhatsApp Engine

-- 1. Pending Actions Table (For Voice Confirmation Logic)
-- Stores the proposed action (Quiz/PDF) while waiting for user to say "Yes"
create table if not exists public.miga_pending_actions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    action_type text not null check (action_type in ('SEND_QUIZ_BURST', 'SEND_PDF', 'SEND_STUDY_PLAN')),
    params jsonb not null default '{}'::jsonb,
    status text default 'pending' check (status in ('pending', 'confirmed', 'expired', 'executed')),
    expires_at timestamptz not null,
    created_at timestamptz default now()
);

-- Index for fast lookup during voice interactions
create index if not exists idx_miga_pending_actions_user_expiry 
on public.miga_pending_actions(user_id, expires_at);

-- 2. WhatsApp Queue Table (Fallback for Delivery)
-- Used if Direct Graph API keys are not configured in Edge Functions
create table if not exists public.whatsapp_queue (
    id uuid default gen_random_uuid() primary key,
    to_phone text not null,
    message_type text default 'text', -- text, template, interactive
    text text,
    template_name text,
    template_params jsonb,
    media_url text,
    status text default 'queued' check (status in ('queued', 'processing', 'sent', 'failed')),
    retry_count int default 0,
    created_at timestamptz default now(),
    processed_at timestamptz
);

-- 3. Check for User-WhatsApp linking table (ensure it exists)
create table if not exists public.user_whatsapp (
    user_id uuid references auth.users(id) on delete cascade primary key,
    phone_number text not null,
    is_active boolean default true,
    verified_at timestamptz,
    created_at timestamptz default now()
);

-- RLS Policies (Simple for now)
alter table public.miga_pending_actions enable row level security;
create policy "Users can see own pending actions" on public.miga_pending_actions
    for select using (auth.uid() = user_id);

alter table public.whatsapp_queue enable row level security;
-- Only service role should typically write here, but allow authenticated for now
create policy "Service role manages queue" on public.whatsapp_queue
    for all using (true); 
