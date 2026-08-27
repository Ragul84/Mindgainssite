require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

async function patchFacts(){
  console.log('📝 Applying Factual Final Patches...');
  const {data: allData, error} = await s.from('master_content_vault').select('*');
  if(error) { console.error(error); return; }

  for(const row of allData){
    let str = JSON.stringify(row.content_json);
    let changed = false;

    // 1. Lok Sabha seats
    if(str.includes('545')){
        str = str.replace(/545/g, '543');
        changed = true;
    }
    // 2. Jim Corbett
    if(str.includes('Jim Corbett') && !str.includes('Hailey')){
        str = str.replace(/Jim Corbett/g, 'Jim Corbett (originally Hailey National Park, 1936)');
        changed = true;
    }
    // 3. Uttiramerur
    if(str.includes('Uttiramerur') && !str.includes('Parantaka')){
        str = str.replace(/Uttiramerur/g, 'Uttiramerur (Parantaka I)');
        changed = true;
    }
    if(str.includes('Uttaramerur') && !str.includes('Parantaka')){
        str = str.replace(/Uttaramerur/g, 'Uttiramerur (Parantaka I)');
        changed = true;
    }
    // 4. Watson & Crick
    if(str.includes('Watson') && !str.includes('Double Helix')){
        str = str.replace(/Watson/g, 'Watson & Crick (Double Helix structure, 1953)');
        changed = true;
    }
    // 5. Bentinck & Sati
    if(str.includes('Sati') && str.includes('1829') && !str.includes('Bentinck')){
        str = str.replace(/1829/g, '1829 by Lord William Bentinck');
        changed = true;
    }

    if(changed){
        const {error: upError} = await s.from('master_content_vault').update({content_json: JSON.parse(str)}).eq('id', row.id);
        if(upError) console.error(`Failed to patch row ${row.id}:`, upError.message);
        else console.log(`✅ Row ${row.id} Fact-Patched!`);
    }
  }
}

patchFacts();
