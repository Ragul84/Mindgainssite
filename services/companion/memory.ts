import { supabase } from '@/utils/supabase';
import type { MemoryAdapter, MemorySnapshot } from './types';

const LOCAL_STORAGE_COLUMN = 'bio';

async function parseProfileMemory(userId: string): Promise<MemorySnapshot | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`${LOCAL_STORAGE_COLUMN}`)
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[CompanionMemory] profile fetch failed', error);
    return null;
  }

  const raw = data?.[LOCAL_STORAGE_COLUMN];
  if (!raw) return null;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function hydrateWeakTopicsFromUserMemory(userId: string) {
  const { data, error } = await supabase
    .from('user_memory')
    .select('topic, proficiency_score, weak_areas, updated_at, last_interacted')
    .eq('user_id', userId)
    .order('proficiency_score', { ascending: true })
    .limit(5);

  if (error) {
    console.warn('[CompanionMemory] user_memory fetch failed', error);
    return [];
  }

  return (data || [])
    .filter((entry: any) => Number(entry.proficiency_score ?? 100) < 75)
    .map((entry: any) => ({
      topic: entry.topic,
      reason: Array.isArray(entry.weak_areas) && entry.weak_areas.length > 0
        ? entry.weak_areas.join(', ')
        : `Recent quiz accuracy: ${Math.round(entry.proficiency_score || 0)}%`,
      lastSeen: entry.updated_at || entry.last_interacted || new Date().toISOString(),
    }));
}

async function writeProfileMemory(userId: string, snapshot: MemorySnapshot) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email;
    console.log(`[CompanionMemory] Native Guru persisting for user ${userId}.`);
    
    const upsertData: any = { id: userId, [LOCAL_STORAGE_COLUMN]: snapshot };
    if (email) upsertData.email = email;

    const { error } = await supabase
      .from('user_profiles')
      .upsert(upsertData, { onConflict: 'id' });
    if (error) {
       console.error(`[CompanionMemory] profile write failed: ${error.code} - ${error.message}`);
       throw error;
    }
  } catch (error) {
    console.error('[CompanionMemory] profile write fatal error:', error);
  }
}

class ProfileMemoryAdapter implements MemoryAdapter {
  async hydrate(userId: string): Promise<MemorySnapshot | null> {
    const [profileMemory, weakTopics] = await Promise.all([
      parseProfileMemory(userId),
      hydrateWeakTopicsFromUserMemory(userId),
    ]);

    const snapshot = profileMemory || {};
    const mergedWeakTopics = [
      ...(snapshot.weakTopics || []),
      ...weakTopics,
    ].filter((entry, index, array) => {
      return array.findIndex((candidate) => candidate.topic === entry.topic) === index;
    });

    return {
      ...snapshot,
      weakTopics: mergedWeakTopics.slice(0, 10),
    };
  }

  async persist(userId: string, snapshot: MemorySnapshot): Promise<void> {
    await writeProfileMemory(userId, snapshot);
  }
}

export const memoryAdapter: MemoryAdapter = new ProfileMemoryAdapter();
