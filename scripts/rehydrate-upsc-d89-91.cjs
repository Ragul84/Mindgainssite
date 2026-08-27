require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:89,topic:'UPSC Environment: Biodiversity Treaties',
intro:`Today we study the 'Guardians of Life'. International treaties like the CBD, CITES, and the Ramsar Convention provide the legal framework for protecting species and habitats. We explore 'Nagoya' (Access and Benefit Sharing) and 'Cartagena' (Biosafety) protocols. For UPSC, focus on the 'Appendices of CITES' and the 'Montreux Record'. Let's master the global law of nature today.`,
notes:[
{title:'CBD (Convention on Biological Diversity)',detail:'Rio Earth Summit 1992. 1. Cartagena Protocol: Biosafety (LMOs). 2. Nagoya Protocol: Access and Benefit Sharing (ABS) of genetic resources.'},
{title:'CITES (Washington Convention)',detail:'Regulates international trade in endangered species. App I (No trade), App II (Regulated), App III (State specific).'},
{title:'Ramsar Convention (1971)',detail:'Wise use of Wetlands. Montreux Record: List of wetlands under threat (India: Keoladeo and Loktak).'},
{title:'CMS (Bonn Convention)',detail:'Conservation of Migratory Species. Focus on species that cross international borders.'},
{title:'TRAFFIC',detail:'Wildlife trade monitoring network. Joint initiative of WWF and IUCN.'}
],
cards:[
{front:'What is the "Montreux Record"?',back:'Register of Ramsar sites where changes in ecological character have occurred.'},
{front:'Cartagena Protocol relates to?',back:'Biosafety (Living Modified Organisms).'},
{front:'Nagoya Protocol relates to?',back:'Access and Benefit Sharing (ABS).'},
{front:'Washington Convention is the common name for?',back:'CITES.'},
{front:'Where is the Ramsar Convention HQ?',back:'Gland, Switzerland.'}
],
q:[
{q:'"Loktak Lake" in Manipur is part of which international register?',options:['UNESCO Heritage','Montreux Record','CITES Appendix I','Global Geopark'],ai:1,exp:'It is a Ramsar site currently on the Montreux Record due to pollution.'},
{q:'The "Cartagena Protocol" is a supplementary agreement to the:',options:['UNFCCC','CBD','CITES','UNCCD'],ai:1,exp:'It deals with the safe handling of living modified organisms.'},
{q:'Which of the following regulates trade in ivory and rhino horns?',options:['CBD','Ramsar','CITES','TRAFFIC'],ai:2,exp:'CITES is the primary legal treaty for regulating international trade.'},
{q:'The "Aichi Targets" are related to:',options:['Climate Change','Biodiversity Conservation','Ozone Depletion','Mercury Pollution'],ai:1,exp:'They were part of the CBD Strategic Plan for 2011-2020.'}
],
hook:'CBD=Life. Cartagena=LMO. Nagoya=Benefit sharing. Ramsar=Wetlands. CITES=Trade. Montreux=Threatened sites.',
summary:'Analysis of CBD protocols (Nagoya/Cartagena). Regulatory mechanism of CITES and CMS. Importance of the Ramsar Convention and wetlands protection. Role of monitoring agencies like TRAFFIC.'},

{day:90,topic:'UPSC Environment: Indian Laws & Bodies',
intro:`Today we study the 'Legal Shield of India'. From the landmark Wildlife Protection Act 1972 to the National Green Tribunal, India has a robust institutional framework for environmental protection. We explore the roles of the 'Pollution Control Boards' and the 'Forest Acts'. For UPSC, focus on the 'Schedules of WPA 1972' and the 'Rights of Tribal Communities'. This is where policy meets implementation.`,
notes:[
{title:'Wildlife Protection Act 1972',detail:'Provides protection to plants and animals. Sch I & II: Absolute protection (Highest penalties). Sch III & IV: Lower protection. Sch V: Vermin (can be hunted). Sch VI: Protected plants.'},
{title:'Environment Protection Act 1986',detail:'Umbrella Act. Passed after Bhopal Gas Tragedy. Gives Central Govt power to protect and improve environment quality.'},
{title:'Forest Rights Act 2006 (FRA)',detail:'Recognizes the rights of forest-dwelling tribal communities and other traditional forest dwellers. Gram Sabha is the authority to initiate the process.'},
{title:'National Green Tribunal (NGT)',detail:'Established 2010. Specialized body for effective and expeditious disposal of cases relating to environmental protection.'},
{title:'Key Bodies',detail:'CPCB (Pollution), NBA (Biodiversity), NTCA (Tiger conservation), Animal Welfare Board.'}
],
cards:[
{front:'Which act is the "Umbrella Act"?',back:'Environment Protection Act 1986.'},
{front:'Highest protection schedule in WPA 1972?',back:'Schedule I.'},
{front:'When was the NGT established?',back:'2010.'},
{front:'Who has the authority to recognize forest rights?',back:'Gram Sabha.'},
{front:'"Project Tiger" is managed by which body?',back:'NTCA (National Tiger Conservation Authority).'}
],
q:[
{q:'The "National Green Tribunal" (NGT) is not bound by the procedure laid down under:',options:['Environmental Laws','Code of Civil Procedure','Criminal Procedure Code','Constitution of India'],ai:1,exp:'It is guided by principles of Natural Justice.'},
{q:'Under WPA 1972, which schedule contains "Vermin"?',options:['Schedule I','Schedule III','Schedule V','Schedule VI'],ai:2,exp:'Animals in this schedule can be hunted in specific areas.'},
{q:'The "Eco-Sensitive Zones" are notified under which act?',options:['WPA 1972','EPA 1986','Forest Act 1927','Biological Diversity Act 2002'],ai:1,exp:'The Environment Protection Act 1986 provides the authority for ESZ notification.'},
{q:'Who is the ex-officio Chairman of the National Board for Wildlife?',options:['Environment Minister','Prime Minister','Chief Justice of India','President'],ai:1,exp:'The PM heads this high-level advisory body.'}
],
hook:'1972=Wildlife. 1986=Umbrella. 2010=NGT. Gram Sabha=FRA. PM=Wildlife Board head. Sch I=Max safety.',
summary:'Evolution of environmental legislation in India. Comparative study of Wildlife, Forest, and Environment acts. Role and powers of NGT and CPCB. Recognition of forest rights and community roles.'},

{day:91,topic:'UPSC REVISION: Environment & Ecology (Days 85–90)',
intro:`Today we wrap up 'Environment & Ecology'. You have mastered the science of ecosystems, the laws of conservation, and the international diplomacy of climate change. For UPSC, Environment is the 'Deciding Factor'—it bridges the gap between geography and current affairs. Today, we consolidate the treaties and the species. Can you remember the 4 Hotspots? The 10% law? The Paris NDCs? Let's master the green marks today.`,
notes:[
{title:'Ecology Recap',detail:'Tansley (Ecosystem), Haeckel (Ecology). 10% Law. Ecotone (Edge effect). Niche (Role). Mutualism (Lichen).'},
{title:'Biodiversity Recap',detail:'Hotspots: 4 in India. In-situ (NP/BR) vs Ex-situ (Zoos/Seed banks). IUCN: CR (GIB), EN (Tiger).'},
{title:'Treaties Recap',detail:'UNFCCC (Rio). Kyoto (GHG). Paris (NDCs). Montreal (Ozone/Kigali). CBD (Nagoya/Cartagena).'},
{title:'Indian Laws Recap',detail:'WPA 1972 (Schedules). EPA 1986 (Umbrella). NGT 2010. FRA 2006 (Gram Sabha).'},
{title:'Species & Pollutants',detail:'BOD high = Polluted. Eutrophication = Algae. Biomagnification = Toxin increase. Fly Ash = Thermal power.'}
],
cards:[
{front:'What is "Red Data Book"?',back:'IUCN list of threatened species.'},
{front:'"Deepor Beel" is a?',back:'Ramsar Site (Assam).'},
{front:'"Zero Liquid Discharge" (ZLD) relates to?',back:'Industrial water pollution control.'},
{front:'What is "Blue Carbon"?',back:'Carbon captured by ocean and coastal ecosystems (Mangroves/Seagrass).'},
{front:'Is the "Great Indian Bustard" Critically Endangered?',back:'Yes.'}
],
q:[
{q:'Consider the following pairs:\n1. Cartagena - Biosafety\n2. Nagoya - ABS\n3. Kyoto - Ozone\nWhich are correct?',options:['1 and 2 only','2 and 3 only','1 and 3 only','All of the above'],ai:0,exp:'Kyoto is for GHGs; Montreal is for Ozone.'},
{q:'The "Green Wall of India" project involves which range?',options:['Himalayas','Western Ghats','Aravalis','Vindhyas'],ai:2,exp:'A belt of greenery from Gujarat to Delhi to prevent desertification.'},
{q:'"Carbon Sequestration" refers to:',options:['Release of CO2','Capturing and storing atmospheric CO2','Trading of carbon credits','Reduction in fuel use'],ai:1,exp:'Long-term storage of carbon in forests, soil, or oceans.'},
{q:'Which of the following bodies is statutory?',options:['NITI Aayog','Central Pollution Control Board','National Board for Wildlife','Both 2 and 3'],ai:3,exp:'CPCB (Water Act) and NBWL (WPA) are both statutory.'}
],
hook:'Environment complete. Rio=Founding. Paris=Target. WPA=Protection. NGT=Justice. Hotspots=4. 2070=Net Zero.',
summary:'Full revision of the Environment syllabus. High-speed drill of international conventions and Indian acts. Map-based drill for biodiversity sites. Final Environment mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC Environment Finale Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC Environment: Full Recap',url:'https://youtube.com/results?search_query=UPSC+Environment+Full+Revision',why:'Complete mastery of environment for Prelims.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | ENVIRONMENT FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
