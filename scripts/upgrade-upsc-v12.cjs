require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const upgradeDays=[
// UX Patches for Heavy Days
{day:4,track:'upsc_ecosystem',patch:{curriculum_metadata:{estimated_time:'25 min',is_long_day:true}}},
{day:32,track:'upsc_ecosystem',patch:{curriculum_metadata:{estimated_time:'25 min',is_long_day:true}}},
{day:41,track:'upsc_ecosystem',patch:{curriculum_metadata:{estimated_time:'25 min',is_long_day:true}}},

// Progressive Stamina Patches for Revision Days
{day:7,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:30,type:'PYQ'}},snapshot:{exam_hook:'⚡ UPSC Stamina Hook: 30-min Sprint active. Focus on speed recall.'}}},
{day:14,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:45,type:'PYQ'}},snapshot:{exam_hook:'⚡ UPSC Stamina Hook: 45-min Sprint active. Push your limits.'}}},
{day:21,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}},snapshot:{exam_hook:'⚡ UPSC Stamina Hook: 60-min Sprint active. Exam mode ON.'}}},
{day:28,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},
{day:35,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},
{day:42,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},
{day:49,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},
{day:56,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},
{day:63,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},
{day:76,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},
{day:83,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},
{day:91,track:'upsc_ecosystem',patch:{curriculum_metadata:{time_boxed_sprint:{duration:60,type:'PYQ'}}}},

// Day 70 Pattern Familiarization
{day:70,track:'upsc_ecosystem',patch:{curriculum_metadata:{is_pattern_practice:true},snapshot:{exam_hook:'⚡ UPSC Pattern Hook: Practice sit today. No score pressure. Just get used to the format.'}}}
];

async function applyPatches(){
  console.log('🚀 Applying UPSC v12.0 Patches...');
  for(const item of upgradeDays){
    const {data,error}=await s.from('master_content_vault').select('content_json').eq('track_id',item.track).eq('day_number',item.day).single();
    if(error){
        console.error(`Day ${item.day} not found or error:`,error.message);
        continue;
    }
    
    let content = data.content_json;
    // Deep merge patches
    if(item.patch.curriculum_metadata){
        content.curriculum_metadata = {...content.curriculum_metadata, ...item.patch.curriculum_metadata};
    }
    if(item.patch.snapshot){
        content.snapshot = {...content.snapshot, ...item.patch.snapshot};
    }

    const {error:upError} = await s.from('master_content_vault').update({content_json: content}).eq('track_id',item.track).eq('day_number',item.day);
    if(upError) console.error(`Failed to patch Day ${item.day}:`, upError.message);
    else console.log(`✅ Day ${item.day} Patched!`);
  }
}

// Run patch then re-hydrate the new blocks
applyPatches();
