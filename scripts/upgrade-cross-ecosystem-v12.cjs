require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const tracks=['ssc_ecosystem','tnpsc_ecosystem'];

async function upgradeAll(){
  for(const track of tracks){
    console.log(`🚀 Upgrading ${track} to v12.0 Metadata...`);
    // 1. Spaced Repetition Config for ALL days
    const {data: allDays, error} = await s.from('master_content_vault').select('day_number, content_json').eq('track_id', track);
    if(error) { console.error(error); continue; }

    for(const item of allDays){
        let content = item.content_json;
        // Inject Spaced Repetition Logic
        content.curriculum_metadata = {
            ...content.curriculum_metadata,
            spaced_repetition_config: {
                intervals: [3, 7, 21, 50],
                focus_type: 'micro-recall'
            }
        };

        // Inject Stamina Logic for Revision Days (Every ~7th day)
        if(item.day_number % 7 === 0){
            let duration = 30 + (Math.floor(item.day_number / 14) * 15); // 30, 45, 60...
            content.curriculum_metadata.time_boxed_sprint = {
                duration: Math.min(duration, 60),
                type: 'Mock'
            };
            if(content.snapshot){
                content.snapshot.exam_hook = (content.snapshot.exam_hook || '') + ` ⚡ v12 Stamina Hook: ${content.curriculum_metadata.time_boxed_sprint.duration}-min Sprint active.`;
            }
        }

        // Heavy Day Patches (Heuristic: more than 4 cards or long intros)
        if(content.quick_note_cards && content.quick_note_cards.length > 5){
            content.curriculum_metadata.estimated_time = '25 min';
            content.curriculum_metadata.is_long_day = true;
        }

        await s.from('master_content_vault').update({content_json: content}).eq('track_id', track).eq('day_number', item.day_number);
    }
    console.log(`✅ ${track} Upgraded!`);
  }
}

upgradeAll();
