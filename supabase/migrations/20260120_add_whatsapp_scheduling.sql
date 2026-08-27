-- Migration: Add scheduling support to WhatsApp queue
alter table public.whatsapp_queue 
add column if not exists scheduled_at timestamptz;

-- Index for the worker to find pending messages
create index if not exists idx_whatsapp_queue_status_scheduled 
on public.whatsapp_queue(status, scheduled_at);
