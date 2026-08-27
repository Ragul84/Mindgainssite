require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const upgradeContent=[
{day:69,topic:'UPSC Environment: NGT & CPCB Roles',
intro:`Today we study the 'Guardians of Environment'. NGT and CPCB are the enforcement arms of Indian environmental law. In UPSC, the 'Advisory vs Mandatory' powers and the 'Composition' of these bodies are high-yield. Do you know who can challenge an NGT order? Let's master the regulatory architecture today.`,
notes:[
{title:'NGT (National Green Tribunal)',detail:'Est. 2010 under NGT Act. 3rd country in world (after Australia/NZ) to have such body. HQ: Delhi. Benches: Bhopal, Pune, Kolkata, Chennai.'},
{title:'NGT Powers',detail:'Not bound by Civil Procedure Code; guided by Principles of Natural Justice. Can award compensation. Appeals lie directly to Supreme Court.'},
{title:'CPCB (Central Pollution Control Board)',detail:'Statutory body est. 1974 under Water Act. Powers under Air Act too. Advisory to Central Govt and coordinates SPCBs.'},
{title:'SPCB (State PCB)',detail:'Implement pollution laws at state level. Can shut down industries for non-compliance.'},
{title:'Bhopal Gas Leak Legacy',detail:'Led to EPA 1986 (Umbrella Act). NGT is the specialized body to handle its technical disputes.'}
],
cards:[
{front:'NGT established in?',back:'2010.'},
{front:'CPCB established under which Act?',back:'Water Act 1974.'},
{front:'NGT appeals go to?',back:'Supreme Court.'},
{front:'Principles followed by NGT?',back:'Natural Justice.'},
{front:'Is NGT bound by CPC?',back:'No.'}
],
q:[
{q:'"National Green Tribunal" (NGT) was established in which year?',options:['1986','2005','2010','2015'],ai:2,exp:'Under the NGT Act 2010.'},
{q:'"CPCB" derives its powers from which primary Act?',options:['Environment Protection Act','Water Act 1974','Air Act 1981','Biodiversity Act'],ai:1,exp:'Established under Water Act, later empowered by Air Act.'},
{q:'Who can be the Chairperson of NGT?',options:['Retired SC Judge','Retired HC Chief Justice','Both A & B','Any eminent scientist'],ai:2,exp:'Judicial members must be from SC/HC.'}
],
hook:'NGT=2010. CPCB=Water Act 1974. Appeal=SC. Natural Justice=Core Principle.',
summary:'Analysis of NGT and CPCB structures. Jurisdiction and judicial powers of the Green Tribunal. Coordination between Central and State Pollution Control Boards.'},

{day:70,topic:'UPSC Environment: Pollution Rules & CRZ',
intro:`Today we study the 'Rules of Waste'. India has a complex set of rules for Plastic, E-waste, and Coastal areas. In UPSC, 'Extended Producer Responsibility (EPR)' and 'CRZ classifications' are high-yield. Do you know the thickness limit for plastic bags? Let's master the waste management today.`,
notes:[
{title:'Plastic Waste Rules (2016/2021)',detail:'Banned Single-Use Plastic (SUP) from July 2022. Thickness: 120 microns (as of Dec 2022). EPR is mandatory for producers.'},
{title:'E-Waste Rules (2022)',detail:'Covers solar panels now. Trading in EPR certificates allowed. Targets for recycling are fixed.'},
{title:'Hazardous Waste Rules',detail:'Focus on "Transboundary movement" (Basel Convention). Import of waste for disposal is prohibited.'},
{title:'CRZ (Coastal Regulation Zone)',detail:'CRZ-I (Ecologically sensitive), CRZ-II (Urban built-up), CRZ-III (Rural), CRZ-IV (Water area). No-Development Zone (NDZ) is 20m for islands.'},
{title:'AQI (Air Quality Index)',detail:'8 pollutants: PM10, PM2.5, NO2, SO2, CO, O3, NH3, Pb. Launched in 2014 ("One Color, One Description").'}
],
cards:[
{front:'Plastic bag thickness (Dec 2022)?',back:'120 microns.'},
{front:'AQI measures ? pollutants?',back:'8.'},
{front:'CRZ for water area?',back:'CRZ-IV.'},
{front:'EPR stands for?',back:'Extended Producer Responsibility.'},
{front:'Does AQI measure CO2?',back:'No.'}
],
q:[
{q:'Which of the following pollutants is NOT included in the "National Air Quality Index" (AQI)?',options:['PM2.5','Ozone','Carbon Dioxide','Lead'],ai:2,exp:'CO2 is not a localized pollutant measured in AQI.'},
{q:'"Extended Producer Responsibility" (EPR) was first introduced in India under:',options:['EPA 1986','Plastic Waste Rules 2011','E-waste Rules 2011','Hazardous Waste Rules'],ai:2,exp:'E-waste rules 2011 pioneered EPR in India.'},
{q:'The "No-Development Zone" (NDZ) for islands/backwaters under CRZ 2019 is:',options:['200m','100m','50m','20m'],ai:3,exp:'Reduced to 20m from HTL.'}
],
hook:'120 microns=Plastic. 8 pollutants=AQI (No CO2). CRZ-I=Sensitive. EPR=Producer responsibility.',
summary:'Detailed breakdown of waste management rules. Classification of Coastal Regulation Zones. Understanding AQI components and EPR logic.'},

{day:75,topic:'UPSC Environment: Protected Areas & Species-in-News',
intro:`Today we study the 'Survivors of the Wild'. Beyond Tiger Reserves, UPSC loves 'Species in News' and 'Ramsar Sites'. In UPSC, 'IUCN status' and 'Habitat' are the most critical data points. Do you know where the 'Ganges River Dolphin' is the state aquatic animal? Let's master the species today.`,
notes:[
{title:'Species in News (Recent)',detail:'Cheetah (Kuno NP, Project Cheetah). Great Indian Bustard (Critically Endangered, GIB project). Sangai Deer (Phumdis, Keibul Lamjao).'},
{title:'Marine Species',detail:'Dugong (Sea Cow - Gulf of Mannar, Palk Bay). Olive Ridley Turtles (Gahirmatha, Arribada). Ganges River Dolphin (National Aquatic Animal).'},
{title:'IUCN Status Recap',detail:'CR (Critically Endangered), EN (Endangered), VU (Vulnerable). Snow Leopard (VU). Asiatic Lion (EN).'},
{title:'Ramsar Sites (75+)',detail:'Chilika (1st site). Wular (Freshwater). Sambhar (Saline). Renuka (Smallest). Sundarbans (Largest).'},
{title:'Forest Types',detail:'Tropical Evergreen (Western Ghats). Tropical Deciduous (Most widespread in India). Mangroves (Sundarbans, Bhitarkanika).'}
],
cards:[
{front:'Project Cheetah started in?',back:'Kuno NP (MP).'},
{front:'"Sea Cow" common name for?',back:'Dugong.'},
{front:'State animal of TN?',back:'Nilgiri Tahr.'},
{front:'Where is Keibul Lamjao?',back:'Manipur (Floating park).'},
{front:'Arribada is related to?',back:'Olive Ridley Turtles.'}
],
q:[
{q:'Which National Park was chosen for the reintroduction of "Cheetahs" from Namibia?',options:['Jim Corbett','Kuno','Kanha','Ranthambore'],ai:1,exp:'Kuno National Park, MP.'},
{q:'"Dugong", an endangered marine mammal, is mainly found in:',options:['Sundarbans','Gulf of Mannar','Chilika Lake','Gulf of Kutch'],ai:1,exp:'Often called the Sea Cow.'},
{q:'"Gahirmatha Marine Sanctuary" is famous for:',options:['Irrawaddy Dolphins','Olive Ridley Turtles','Saltwater Crocodiles','Gharials'],ai:1,exp:'World\'s largest nesting ground for Olive Ridleys.'}
],
hook:'Kuno=Cheetah. Dugong=Sea Cow. Gahirmatha=Turtles. Sangai=Manipur. 75=Ramsar.',
summary:'Analysis of high-priority species in news. Geography of major Ramsar sites. IUCN classification of iconic Indian fauna. Focus on conservation projects (Cheetah, GIB).'},

{day:87,topic:'UPSC Schemes 1: Social Sector & Welfare',
intro:`Today we study the 'Safety Nets of India'. Social schemes are the bread and butter of UPSC Prelims and Mains. In UPSC, 'Ministry', 'Eligibility', and 'Funding' are high-yield. Do you know which scheme is the world's largest insurance program? Let's master the welfare today.`,
notes:[
{title:'MGNREGS',detail:'Min Rural Dev. 100 days work. Legal right. Social audit mandatory. Geo-MGNREGA for tracking.'},
{title:'Ayushman Bharat (PM-JAY)',detail:'Min Health. ₹5 Lakh/family/year. Secondary/Tertiary care. Paperless/Cashless. World\'s largest.'},
{title:'PM-KISAN',detail:'Min Agri. ₹6,000/year in 3 installments. Direct Benefit Transfer (DBT). All landholding farmers eligible.'},
{title:'PMAY (U+G)',detail:'Housing for All. PMAY-G (Min Rural Dev). PMAY-U (Min Housing & Urban Affairs).'},
{title:'Nutrition Schemes',detail:'POSHAN Abhiyaan. PM-POSHAN (Mid-day meal). Mission Shakti (Women safety/empowerment).'}
],
cards:[
{front:'Ayushman Bharat cover amount?',back:'₹5 Lakh.'},
{front:'PM-KISAN annual amount?',back:'₹6,000.'},
{front:'Min for MGNREGS?',back:'Rural Development.'},
{front:'PM-JAY focus?',back:'Health insurance.'},
{front:'Mission Shakti is for?',back:'Women Empowerment.'}
],
q:[
{q:'Which ministry implements the "PM-KISAN" scheme?',options:['Rural Development','Finance','Agriculture','Home Affairs'],ai:2,exp:'Ministry of Agriculture and Farmers Welfare.'},
{q:'"Ayushman Bharat" provides health cover of up to ₹5 Lakh per:',options:['Person','Family','Village','State'],ai:1,exp:'Per family per year.'},
{q:'What is the primary objective of "POSHAN Abhiyaan"?',options:['Education','Malnutrition reduction','Sanitation','Employment'],ai:1,exp:'Launched in 2018 to improve nutritional outcomes.'}
],
hook:'5 Lakh=PMJAY. 6000=KISAN. Rural Dev=MGNREGS. Women=Shakti. Housing=PMAY.',
summary:'Deep dive into core social welfare programs. Identification of implementing ministries and funding patterns. Analysis of impact on health and livelihood security.'},

{day:88,topic:'UPSC Schemes 2: Economic & Infra',
intro:`Today we study the 'Engine of Growth'. Economic and Infrastructure schemes drive India's GDP. In UPSC, 'Digital India', 'PLI', and 'Gati Shakti' are high-yield. Do you know what 'PLI' stands for? Let's master the growth today.`,
notes:[
{title:'Digital India',detail:'9 pillars. India Stack (Aadhaar, UPI, DigiLocker). UMANG app. BharatNet (Broadband to Gram Panchayats).'},
{title:'PLI (Production Linked Incentive)',detail:'Boost manufacturing. Incentives on incremental sales. 14 sectors (Electronics, Pharma, Auto, etc).'},
{title:'PM Gati Shakti',detail:'National Master Plan for Multi-modal connectivity. 7 engines (Roads, Railways, Airports, etc). Integration of 16 ministries.'},
{title:'PMGSY',detail:'Pradhan Mantri Gram Sadak Yojana. All-weather roads to unconnected habitations. Funding: Central (60:40).'},
{title:'e-NAM',detail:'National Agriculture Market. Electronic trading portal for agri-commodities. Transparency in price discovery.'}
],
cards:[
{front:'PLI stands for?',back:'Production Linked Incentive.'},
{front:'UMANG is for?',back:'Unified Mobile App for New-age Governance.'},
{front:'BharatNet objective?',back:'Broadband to Gram Panchayats.'},
{front:'Gati Shakti has ? engines?',back:'7.'},
{front:'e-NAM focus?',back:'Agriculture Market.'}
],
q:[
{q:'"PM Gati Shakti" National Master Plan is primarily for:',options:['Education','Multi-modal Infrastructure','Healthcare','Rural Housing'],ai:1,exp:'Integrating infrastructure projects across ministries.'},
{q:'The "PLI Scheme" aims to boost:',options:['Services','Agriculture','Domestic Manufacturing','Imports'],ai:2,exp:'Production Linked Incentive.'},
{q:'"UMANG" app is a single platform for access to:',options:['Banking only','E-commerce','Pan-India E-Gov services','Social media'],ai:2,exp:'Unified app for all govt services.'}
],
hook:'PLI=Manufacturing. Gati Shakti=7 Engines. e-NAM=Agri. BharatNet=Gram Panchayat. UMANG=E-Gov.',
summary:'Technological and infrastructural development schemes. Analysis of the PLI framework in manufacturing. Evaluation of digital governance initiatives (India Stack).'},

{day:89,topic:'UPSC IR 1: Foreign Policy & Neighbourhood',
intro:`Today we study the 'World through India's Eyes'. Foreign policy is about interests and geography. In UPSC, 'Neighbourhood First' and 'Act East' are high-yield. Do you know which countries form the 'BIMSTEC'? Let's master the diplomacy today.`,
notes:[
{title:'Guiral Doctrine',detail:'Non-reciprocity with smaller neighbors. Foundation of modern neighborhood policy.'},
{title:'Neighbourhood First',detail:'Priority to immediate neighbors. SAARC (stagnant) vs BIMSTEC (rising). Connectivity (BBIN).'},
{title:'Act East Policy',detail:'Evolution of "Look East". Focus on ASEAN + Japan/South Korea. Security, Connectivity, Culture.'},
{title:'Connect Central Asia',detail:'Instinctive interest in energy-rich region. INSTC corridor. Chabahar port (Iran).'},
{title:'Soft Power',detail:'Yoga, Diaspora, IT, Buddhism, Indian Council for Cultural Relations (ICCR).'}
],
cards:[
{front:'"Neighbourhood First" priority?',back:'Immediate neighbors.'},
{front:'BIMSTEC HQ?',back:'Dhaka.'},
{front:'Where is Chabahar Port?',back:'Iran.'},
{front:'Act East evolved from?',back:'Look East.'},
{front:'INSTC connects?',back:'India to Russia/Europe via Iran.'}
],
q:[
{q:'The "BIMSTEC" headquarters is located in:',options:['New Delhi','Dhaka','Bangkok','Colombo'],ai:1,exp:'Bay of Bengal Initiative for Multi-Sectoral Technical and Economic Cooperation.'},
{q:'Which policy succeeded India\'s "Look East Policy" in 2014?',options:['Go West','Neighbourhood First','Act East','Connect Central Asia'],ai:2,exp:'Launched at East Asia Summit.'},
{q:'"Chabahar Port" in Iran provides India access to:',options:['Central Asia','Europe','SE Asia','None'],ai:0,exp:'Strategically bypassing Pakistan.'}
],
hook:'Neighbourhood=Priority. Act East=ASEAN+. Chabahar=Iran. BIMSTEC=Dhaka. Soft Power=Yoga/Diaspora.',
summary:'Evolutionary stages of Indian foreign policy. Comparative study of SAARC and BIMSTEC. Strategic significance of Act East and Central Asia connectivity.'},

{day:90,topic:'UPSC IR 2: Multilateral Orgs & Summits',
intro:`Today we study the 'Global High Table'. India's role in QUAD, G20, and SCO is growing. In UPSC, 'BRICS expansion' and 'UNSC reforms' are high-yield. Do you know which country hosted the G20 in 2023? Let's master the global stage today.`,
notes:[
{title:'QUAD',detail:'India, USA, Japan, Australia. "Free and Open Indo-Pacific". Not a military alliance (officially).'},
{title:'G20 (India 2023)',detail:'Theme: Vasudhaiva Kutumbakam. Inclusion of African Union as permanent member. Global Biofuel Alliance.'},
{title:'BRICS',detail:'Brazil, Russia, India, China, SA. Recent expansion (Egypt, Ethiopia, Iran, UAE joined). NDB (New Dev Bank) HQ: Shanghai.'},
{title:'SCO (Shanghai Coop Org)',detail:'India & Pakistan joined in 2017. Security-focused. RATS (Regional Anti-Terrorist Structure).'},
{title:'UNSC Reforms',detail:'India seeking permanent seat. G4 (India, Brazil, Japan, Germany) supports each other.'}
],
cards:[
{front:'QUAD members?',back:'India, USA, Japan, Australia.'},
{front:'G20 theme 2023?',back:'Vasudhaiva Kutumbakam.'},
{front:'New Dev Bank HQ?',back:'Shanghai.'},
{front:'Is African Union in G20?',back:'Yes (joined 2023).'},
{front:'RATS is associated with?',back:'SCO.'}
],
q:[
{q:'The 2023 "G20" summit in India saw the permanent membership of:',options:['European Union','ASEAN','African Union','Mercosur'],ai:2,exp:'A major diplomatic win for the Global South.'},
{q:'"New Development Bank" (NDB) was established by:',options:['IMF','World Bank','BRICS','AIIB'],ai:2,exp:'HQ in Shanghai.'},
{q:'"QUAD" is a strategic dialogue between how many countries?',options:['3','4','5','10'],ai:1,exp:'Indo-Pacific focus.'}
],
hook:'QUAD=Indo-Pacific. G20=One Earth. BRICS=Shanghai Bank. SCO=Security. AU=G20 New Member.',
summary:'Strategic analysis of QUAD and Indo-Pacific security. Legacy of the 2023 G20 summit. Expansion and role of BRICS. Institutional reforms in the UN Security Council.'}

];

async function applyUpgrade(){
  console.log('🚀 Upgrading UPSC Content (v12.0)...');
  for(const item of upgradeContent){
    const p={
      topic_title:item.topic,day_number:item.day,track:'upsc_ecosystem',
      lesson_intro:item.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:item.topic,quick_notes:item.notes,exam_hook:'⚡ UPSC v12.0 Hook: '+item.hook},
      quick_note_cards:item.cards.map(c=>({title:'UPSC v12 Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+item.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC '+item.topic),why:'Upgraded v12.0 content for UPSC.'}],
      quiz:{questions:item.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:item.topic+' | v12 UPGRADE',one_screen_summary:item.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:item.day,topic_title:item.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+item.day+':',error.message);
    else console.log('✅ Day '+item.day+' UPGRADED: '+item.topic);
  }
}
applyUpgrade();
