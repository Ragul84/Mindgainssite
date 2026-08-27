const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function walk(value) {
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === 'object') {
    const next = {};
    for (const [key, child] of Object.entries(value)) next[key] = walk(child);
    return next;
  }
  if (typeof value === 'string') {
    return value.replace(/\?"\s*:\s*/g, '?" = ');
  }
  return value;
}

(async () => {
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('content_json')
    .eq('track_id', 'upsc_ecosystem')
    .eq('day_number', 1)
    .maybeSingle();
  if (error) throw error;
  const payload = typeof data.content_json === 'string' ? JSON.parse(data.content_json) : data.content_json;
  const fixed = walk(payload);
  const { error: updateError } = await supabase
    .from('master_content_vault')
    .update({ content_json: fixed, updated_at: new Date().toISOString() })
    .eq('track_id', 'upsc_ecosystem')
    .eq('day_number', 1);
  if (updateError) throw updateError;
  console.log('FIXED_DAY_1_TRAP_PUNCTUATION');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
