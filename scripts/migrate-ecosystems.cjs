/**
 * 🔄 Mission Protocol Migration Script
 * Maps legacy track IDs to new Master Ecosystem IDs in the user_protocols table.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const MAPPING = {
  'upsc_prelims': 'upsc_ecosystem',
  'ssc_cgl_tier1': 'ssc_ecosystem',
  'tnpsc_combined': 'tnpsc_ecosystem',
  'tnpsc_group4': 'tnpsc_ecosystem'
};

async function migrate() {
  console.log('🚀 Starting User Protocol Migration...');
  
  for (const [oldId, newId] of Object.entries(MAPPING)) {
    console.log(`📦 Mapping ${oldId} -> ${newId}...`);
    
    const { data, error, count } = await supabase
      .from('user_protocols')
      .update({ track_id: newId })
      .eq('track_id', oldId);

    if (error) {
      console.error(`❌ Error migrating ${oldId}:`, error.message);
    } else {
      console.log(`✅ Migrated records for ${oldId}`);
    }
  }

  console.log('\n🏁 Migration Complete');
}

migrate();
