const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function cleanText(value) {
  return String(value || '')
    .replace(/\bCurrent means:/g, 'Current structure:')
    .replace(/\bUPSC traps means:/g, 'Common UPSC trap:')
    .replace(/\bTRAP means:/g, 'Exam trap:')
    .replace(/\bThe Numbers:/g, 'Constitution Structure:')
    .replace(/\bThe Numbers\b/g, 'Constitution Structure')
    .replace(/\bFirst meeting means:/g, 'First meeting:')
    .replace(/\bAdopted means:/g, 'Adopted:')
    .replace(/\bEnforced means:/g, 'Enforced:')
    .replace(/\bMembers who signed means:/g, 'Members who signed:')
    .replace(/\bTime means:/g, 'Time taken:')
    .replace(/\bCA President means:/g, 'Constituent Assembly President:')
    .replace(/\bConstitutional Advisor means:/g, 'Constitutional Advisor:')
    .replace(/\bmeans:/g, ':')
    .replace(/Original\(1949\):/g, 'Original Constitution (1949):')
    .replace(/Parts=22/g, '22 Parts')
    .replace(/Articles=395/g, '395 Articles')
    .replace(/Schedules=8/g, '8 Schedules')
    .replace(/Parts=25/g, '25 Parts')
    .replace(/Articles=448\+/g, '448+ Articles')
    .replace(/Schedules=12/g, '12 Schedules')
    .replace(/Appendices=5/g, '5 Appendices')
    .replace(/"\s*:\s*/g, '" = ')
    .replace(/=\s*/g, ': ')
    .replace(/\?"\s*:\s*/g, '?" = ')
    .replace(/\s+/g, ' ')
    .trim();
}

function polishTitle(title) {
  const value = cleanText(title);
  const replacements = {
    'The Numbers': 'Constitution Structure',
    '12 Schedules — First Exposure': 'Twelve Schedules',
  };
  return replacements[value] || value;
}

function walk(value) {
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === 'object') {
    const next = {};
    for (const [key, child] of Object.entries(value)) {
      if (key === 'title' || key === 'heading' || key === 'front') next[key] = polishTitle(child);
      else if (typeof child === 'string') next[key] = cleanText(child);
      else next[key] = walk(child);
    }
    return next;
  }
  if (typeof value === 'string') return cleanText(value);
  return value;
}

async function main() {
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .in('track_id', ['upsc_ecosystem', 'tnpsc_ecosystem', 'ssc_ecosystem']);
  if (error) throw error;

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.resolve(__dirname, `../scratch/daily-mission-before-language-polish-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  let changed = 0;
  for (const row of data) {
    const payload = typeof row.content_json === 'string' ? JSON.parse(row.content_json) : row.content_json;
    const polished = walk(payload);
    changed += 1;
    const { error: updateError } = await supabase
      .from('master_content_vault')
      .update({ content_json: polished, updated_at: new Date().toISOString() })
      .eq('track_id', row.track_id)
      .eq('day_number', row.day_number);
    if (updateError) throw updateError;
  }

  const reportPath = path.resolve(__dirname, `../scratch/daily-mission-language-polish-report-${stamp}.json`);
  const report = { rows: data.length, changed, backupPath, reportPath };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
