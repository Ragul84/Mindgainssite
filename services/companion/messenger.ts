import { supabase } from '@/utils/supabase';
import type { MessengerJob, StudyChannel } from './types';

const QUIET_HOURS = { start: 22, end: 6 }; // local hours

function clampToWindow(preferred?: { start: string; end: string }[]) {
  if (!preferred || preferred.length === 0) return { start: '07:30', end: '21:00' };
  return preferred[0];
}

function withinQuietHours(date: Date) {
  const hour = date.getHours();
  if (QUIET_HOURS.start < QUIET_HOURS.end) {
    return hour >= QUIET_HOURS.start && hour < QUIET_HOURS.end;
  }
  return hour >= QUIET_HOURS.start || hour < QUIET_HOURS.end;
}

async function queueWhatsApp(job: MessengerJob) {
  const { payload } = job;
  const scheduled = new Date(job.scheduledFor);
  if (withinQuietHours(scheduled)) {
    scheduled.setHours(QUIET_HOURS.end, 15, 0, 0);
  }

  await supabase.from('whatsapp_jobs').insert({
    user_id: payload.userId,
    action_type: payload.template,
    topic: payload.topic ?? 'Daily Drop',
    scheduled_minute: Math.round((scheduled.getTime() - Date.now()) / 60000),
    status: 'queued',
    payload,
  });
}

export const messenger = {
  async schedule(job: MessengerJob) {
    if (job.channel === 'whatsapp') {
      await queueWhatsApp(job);
      return;
    }
    if (job.channel === 'telegram') {
      // Telegram queue will be added later; for now we just log.
      console.log('[Messenger] Telegram job', job);
    }
  },

  async sendDrop(userId: string, channel: StudyChannel, template: MessengerJob['template']) {
    const now = new Date();
    const window = clampToWindow();
    const scheduled = new Date(
      `${now.toISOString().split('T')[0]}T${window.start}:00.000Z`,
    );
    await this.schedule({
      id: `drop-${Date.now()}`,
      channel,
      template,
      payload: { userId, template },
      scheduledFor: scheduled.toISOString(),
    });
  },
};
