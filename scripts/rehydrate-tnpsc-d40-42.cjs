require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:40,topic:'TNPSC Unit 9: TN Geography & Industrial Clusters',
intro:`Today we study the 'Economic Geography' of TN. Tamil Nadu is often called the 'Detroit of Asia'. In TNPSC, 'Industrial Clusters' (e.g., Tiruppur for Textiles, Hosur for Electronics) and 'GI Tags' are high-yield. Do you know which city is called the 'Egg Basket of India'? Let's master the industrial map today.`,
notes:[
{title:'Industrial Clusters',detail:'1. Chennai (Automobiles - Detroit of Asia). 2. Tiruppur (Knitwear/Textiles - Manchester of South). 3. Sivakasi (Fireworks/Matchboxes - Little Japan). 4. Namakkal (Egg/Poultry & Truck body building). 5. Karur (Coach building).'},
{title:'Special Economic Zones (SEZ)',detail:'TN has a high number of operational SEZs. Nanguneri (Multi-product), Ennore (Thermal power), Perambalur (Specialty chemicals).'},
{title:'GI Tags of TN',detail:'Highest in India. Famous: Kanchipuram Silk, Srivilliputhur Palkova, Dindigul Locks, Kovilpatti Kadalai Mittai, Madurai Malli.'},
{title:'Mineral Resources',detail:'Lignite (Neyveli), Magnesite (Salem), Garnet/Ilmenite (Coastal sands), Limestone (Ariyalur).'},
{title:'Ports & Logistics',detail:'3 Major Ports: Ennore (Kamarajar), Chennai, Tuticorin (V.O.C). Development of Industrial Corridors (CBIC, VCIC).'}
],
cards:[
{front:'"Detroit of Asia"?',back:'Chennai.'},
{front:'"Little Japan" of India?',back:'Sivakasi.'},
{front:'"Manchester of South India"?',back:'Coimbatore (or Tiruppur for Knitwear).'},
{front:'"Egg Basket" of India?',back:'Namakkal.'},
{front:'Where is Lignite found in TN?',back:'Neyveli (Cuddalore).'}
],
q:[
{q:'Which city in Tamil Nadu is known as the "Manchester of South India"?',options:['Chennai','Madurai','Coimbatore','Salem'],ai:2,exp:'Due to its extensive textile industry.'},
{q:'"Sivakasi" was nicknamed "Little Japan" by:',options:['Gandhi','Nehru','Periyar','Rajaji'],ai:1,exp:'Because of its hardworking people and industrial spirit.'},
{q:'Which district in Tamil Nadu has the highest number of GI tags?',options:['Chennai','Madurai','Thanjavur','Kanyakumari'],ai:2,exp:'Famous for Art Plate, Dolls, Veenai, etc.'},
{q:'The "Detroit of Asia" refers to Chennai because of its:',options:['IT industry','Automobile industry','Textile industry','Leather industry'],ai:1,exp:'Major hub for global car manufacturers.'}
],
hook:'Chennai=Detroit. Sivakasi=Japan. Namakkal=Egg. Neyveli=Lignite. GI Tags=Highest TN. Coimbatore=Manchester.',
summary:'Identification of major industrial clusters in Tamil Nadu. Economic impact of geography on TN\'s development. List of prominent GI tagged products. Overview of ports and mineral resources.'},

{day:41,topic:'TNPSC Unit 9: e-Governance in Tamil Nadu',
intro:`Today we study the 'Digital Frontier'. Tamil Nadu is a pioneer in using IT for citizen services. In TNPSC, 'TNeGA', 'e-Sevai', and 'Tamil Virtual Academy' are high-yield. Do you know what 'e-Sevai' centers do? Let's master the digital governance today.`,
notes:[
{title:'TNeGA',detail:'Tamil Nadu e-Governance Agency. State nodal agency for all IT initiatives. Mission: "Service to People through Technology".'},
{title:'e-Sevai Centers',detail:'Common Service Centers (CSC). Providing 100+ services like Community, Nativity, and Income certificates online.'},
{title:'Important Portals',detail:'1. Uzhavan App (Agriculture). 2. TN-SMART (Disaster management). 3. Naan Mudhalvan (Skill development). 4. e-Paarvai (Eye care).'},
{title:'Tamil Virtual Academy (TVA)',detail:'Providing internet-based resources for Tamil language and culture globally. Digital library of Tamil literature.'},
{title:'State Data Center (SDC)',detail:'Secure infrastructure for hosting state government applications and data.'}
],
cards:[
{front:'State nodal agency for e-Governance?',back:'TNeGA.'},
{front:'"Uzhavan App" is for?',back:'Farmers/Agriculture.'},
{front:'"Naan Mudhalvan" focus?',back:'Skill Development.'},
{front:'TVA stands for?',back:'Tamil Virtual Academy.'},
{front:'"e-Sevai" objective?',back:'Online delivery of citizen services.'}
],
q:[
{q:'"TNeGA" stands for:',options:['TN e-Governance Agency','TN e-Governance Association','TN e-Governance Authority','None'],ai:0,exp:'The nodal agency for IT in the state.'},
{q:'Which mobile app is specifically designed for the welfare of "Farmers" in TN?',options:['TN-SMART','Uzhavan','Kavalan','Naan Mudhalvan'],ai:1,exp:'Provides info on subsidies, weather, and market prices.'},
{q:'The "Tamil Virtual Academy" is headquartered in:',options:['Madurai','Chennai','Coimbatore','Thanjavur'],ai:1,exp:'Promotes Tamil education globally.'},
{q:'"Naan Mudhalvan" scheme was launched to improve:',options:['Health','Skill development of students','Agriculture','Housing'],ai:1,exp:'A massive skilling initiative for youth.'}
],
hook:'TNeGA=Nodal. Uzhavan=Agri. Naan Mudhalvan=Skills. e-Sevai=Certificates. Digital TN=Top. TVA=Culture.',
summary:'Role and functions of TNeGA in Tamil Nadu. Key e-governance portals and mobile applications for citizens. Impact of digitalization on administrative efficiency. Overview of the Tamil Virtual Academy.'},

{day:42,topic:'TNPSC REVISION: Unit 9 Finale (Days 36–41)',
intro:`Today we consolidate the 'Development Story of TN'. You have mastered the ideology of Periyar, the achievements of the Justice Party, the reservation model, and the digital initiatives. In TNPSC, Unit 9 questions are often 'Analytical' and 'Scheme-based'. Today, we drill the facts and years. If you see '1924', you say 'Vaikom' or 'SSB'. If you see '69%', you say '76th Amendment'. Let's lock in the Unit 9 marks today.`,
notes:[
{title:'Ideology Recap',detail:'Periyar (1925 Self-Respect). Kudi Arasu. Vaikom (1924). UNESCO (1970).'},
{title:'Politics Recap',detail:'Justice Party (1916). 1st Premier (Subbarayulu). 1944 (Salem DK).'},
{title:'Policy Recap',detail:'69% Reservation (76th Amend). Sattanathan (1970). 1st Amend (1951).'},
{title:'Development Recap',detail:'GER (51%). Kamaraj (Mid-day). MGR (Nutritious). Namakkal (Egg). Sivakasi (Japan).'},
{title:'e-Gov Recap',detail:'TNeGA. Uzhavan App. Naan Mudhalvan. e-Sevai.'}
],
cards:[
{front:'Year of Sattanathan Commission?',back:'1970.'},
{front:'"Little Japan" of TN?',back:'Sivakasi.'},
{front:'"Vaikom Veerar" title for?',back:'Periyar.'},
{front:'TN GER in higher education?',back:'~51.4%.'},
{front:'"Justice" newspaper language?',back:'English.'}
],
q:[
{q:'Who was the founder of the "Self-Respect Movement"?',options:['Annadurai','Periyar','Bharathidasan','MGR'],ai:1,exp:'Recap.'},
{q:'Which amendment placed TN reservation in the 9th Schedule?',options:['42nd','69th','76th','81st'],ai:2,exp:'Recap.'},
{q:'The "Manchester of South India" is:',options:['Chennai','Madurai','Coimbatore','Trichy'],ai:2,exp:'Fact check.'},
{q:'"Uzhavan App" is related to:',options:['Education','Health','Agriculture','Police'],ai:2,exp:'App check.'}
],
hook:'Unit 9 complete. Development model. Periyar to Digital. Fact drill. Success is in the details.',
summary:'Full revision of TN development administration. High-speed drill of political and social milestones. Comparison of economic and industrial clusters. Final Unit 9 mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,topic_day:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ TNPSC Unit 9 Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'TN Admin Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC Unit 9 '+d.topic),why:'Consolidating TN administration for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | REVISION DAY',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
