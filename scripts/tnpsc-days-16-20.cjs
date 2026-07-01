require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:16,topic:'Chemistry: Elements, Acids & Periodic Table (Samacheer)',
notes:[
{title:'Periodic Table Key Facts',detail:'118 elements. Periods=7 horizontal rows. Groups=18 vertical columns. Group 1=Alkali metals (Li,Na,K,Rb,Cs,Fr). Group 17=Halogens (F,Cl,Br,I,At). Group 18=Noble gases (He,Ne,Ar,Kr,Xe,Rn). Period 1 has only 2 elements (H,He). Atomic number=protons. Mass number=protons+neutrons.'},
{title:'Acids, Bases & Salts',detail:'Acid: pH<7, sour taste, turns blue litmus RED, donates H⁺. Base/Alkali: pH>7, bitter/soapy, turns red litmus BLUE, donates OH⁻. Neutral: pH=7 (pure water). Strong acids: HCl, H₂SO₄, HNO₃. Strong bases: NaOH, KOH. pH scale: 0-14.'},
{title:'Important Chemical Reactions',detail:'Rusting: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃ (iron+oxygen+water). Photosynthesis: 6CO₂+6H₂O→C₆H₁₂O₆+6O₂. Neutralization: Acid+Base→Salt+Water. HCl+NaOH→NaCl+H₂O. Baking soda (NaHCO₃) + Acid → CO₂ + Water (bubbles).'},
{title:'Common Chemical Names',detail:'Common salt=NaCl. Washing soda=Na₂CO₃·10H₂O. Baking soda=NaHCO₃. Bleaching powder=CaOCl₂. Plaster of Paris=CaSO₄·½H₂O. Vinegar=CH₃COOH (acetic acid). Lime water=Ca(OH)₂. Marble=CaCO₃.'}
],
hook:'TNPSC Chemistry Trap: Litmus test — ACID turns BLUE litmus RED (remember: A-B-R = Acid-Blue-Red). BASE turns RED litmus BLUE (B-R-B = Base-Red-Blue). Baking soda=NaHCO₃(NOT baking powder). Washing soda=Na₂CO₃(NOT NaCl). Plaster of Paris sets when it absorbs water back.',
cards:[
{front:'pH scale — acid, neutral, base ranges?',back:'Acid: pH 0-6 (less than 7). Neutral: pH 7 (pure water). Base/Alkali: pH 8-14 (greater than 7). Strong acid: pH near 0. Strong base: pH near 14.'},
{front:'NaHCO₃ பொதுவான பெயர் என்ன? பயன்பாடு என்ன?',back:'Baking soda (சமையல் சோடா). Used in cooking (CO₂ makes bread/cake rise), fire extinguishers (with acid), antacid (neutralizes stomach acid).'},
{front:'Bleaching powder இரசாயன சூத்திரம் என்ன?',back:'CaOCl₂ (Calcium hypochlorite/Calcium oxychloride). Used for disinfecting water, bleaching cloth. Also called chlorinated lime.'}
],
q:[{q:'A solution turns red litmus paper blue. This solution is?',options:['Acidic','Neutral','Basic/Alkaline','Neither acidic nor basic'],answer_index:2,explanation:'Red litmus turning BLUE = Basic/Alkaline (pH>7). Acid turns BLUE litmus RED. Base turns RED litmus BLUE. Memory trick: A-B-R (Acid-Blue-Red), B-R-B (Base-Red-Blue).'},
{q:'What is the chemical name for common salt?',options:['NaOH','Na₂CO₃','NaCl','NaHCO₃'],answer_index:2,explanation:'NaCl = Sodium Chloride = common salt. NaOH = Caustic soda. Na₂CO₃ = Washing soda. NaHCO₃ = Baking soda. Classic chemical formula matching question.'}
],
pyq:'High — TNPSC Science. Chemical names and acid-base tests appear every year.',
summary:'Periodic table: 118 elements, 7 periods, 18 groups. Group1=Alkali metals. Group17=Halogens. Group18=Noble gases. Acid: pH<7, blue→red litmus. Base: pH>7, red→blue litmus. Common chemicals: NaCl(salt)+NaHCO₃(baking soda)+Na₂CO₃(washing soda)+CaOCl₂(bleaching powder)+CaSO₄·½H₂O(Plaster of Paris). Samacheer 8th-10th Std.'},

{day:17,topic:'TN Polity: State Government & Panchayati Raj',
notes:[
{title:'TN State Government Structure',detail:'Governor: Constitutional head, appointed by President. Chief Minister: Real executive head, leads Council of Ministers. TN Legislative Assembly (Vidhan Sabha): 234 seats. TN has NO Legislative Council (Vidhan Parishad) — unicameral legislature. Chief Secretary: Senior-most IAS officer in state.'},
{title:'Panchayati Raj in Tamil Nadu',detail:'3-tier system under 73rd Constitutional Amendment (1992): Village Panchayat (Gram Panchayat) → Panchayat Union (Block/Taluk level) → District Panchayat. In Tamil Nadu specifically called: Gram Panchayat → Panchayat Union Council → District Panchayat. Elections conducted by STATE Election Commission.'},
{title:'Urban Local Bodies in TN',detail:'Chennai Corporation: Greater Chennai Corporation (GCC) — largest ULB in TN. Also: Coimbatore, Madurai, Tiruchy, Salem, Tirunelveli, Tiruppur, Vellore Municipal Corporations. Municipalities (smaller cities). Town Panchayats (semi-urban). 74th Amendment (1992) = Urban local bodies.'},
{title:'Key Constitutional Articles for TN',detail:'Art 153: Governor for each state. Art 163-164: Council of Ministers + CM. Art 170: Composition of State Legislatures. Art 243: Panchayati Raj (73rd Amendment). Art 243P: Municipal bodies (74th Amendment). Art 356: Presidents Rule in states.'}
],
hook:'TNPSC Admin Trap: Tamil Nadu has ONLY ONE house — Legislative Assembly (234 seats). NO Legislative Council. Panchayat elections = State Election Commission (NOT Election Commission of India). 73rd Amendment = Panchayati Raj(1992). 74th Amendment = Urban Local Bodies(1992). Same year, both amendments.',
cards:[
{front:'Tamil Nadu Legislature எத்தனை சட்டமன்ற உறுப்பினர்கள்?',back:'234 seats. TN has UNICAMERAL Legislature (only Vidhan Sabha, no Vidhan Parishad/Council). Bicameral states: UP, Bihar, Maharashtra, Karnataka, Andhra Pradesh, Telangana.'},
{front:'பஞ்சாயத்து ராஜ் — 3 நிலைகள் TN-ல் என்னென்ன?',back:'1. Gram Panchayat (Village level). 2. Panchayat Union Council (Block/Taluk level). 3. District Panchayat. Under 73rd Constitutional Amendment (1992).'},
{front:'Chennai Corporation முழு பெயர் என்ன?',back:'Greater Chennai Corporation (GCC). Largest Urban Local Body in Tamil Nadu. Formerly Madras Corporation (established 1688 by British — one of India\'s oldest).'}
],
q:[{q:'Tamil Nadu has how many seats in its State Legislative Assembly?',options:['196','225','234','250'],answer_index:2,explanation:'Tamil Nadu Vidhan Sabha has 234 seats (MLAs). TN has a unicameral legislature — no Legislative Council. The 234 seats elect Members of Legislative Assembly who form the state government.'},
{q:'Panchayat Raj elections in Tamil Nadu are conducted by which body?',options:['Election Commission of India','State Election Commission of TN','District Collector','Revenue Department'],answer_index:1,explanation:'Panchayat and Municipal elections are conducted by STATE Election Commission (Art 243K, 73rd Amendment). NOT by the Election Commission of India (ECI). ECI only handles Parliament, State Legislatures, President, and VP elections.'}
],
pyq:'High — TNPSC Unit 9 Administration. Legislature seats and Panchayati Raj structure tested frequently.',
summary:'TN: Governor(constitutional head)+CM(real executive). Legislature: 234 MLAs, UNICAMERAL(no Council). Panchayati Raj(73rd Amdt,1992): Gram Panchayat→Panchayat Union→District Panchayat. Elections=State EC(NOT ECI). Urban(74th Amdt): Chennai(GCC)+Municipal Corporations+Municipalities+Town Panchayats. Samacheer 9th Std Civics.'},

{day:18,topic:'Freedom Movement in Tamil Nadu',
notes:[
{title:'Tamil Leaders in Freedom Struggle',detail:'Bal Gangadhar Tilak\'s connection: V.O. Chidambaram Pillai (VOC) — launched Swadeshi Steam Navigation Company (1906) to challenge British shipping monopoly. Was arrested and sentenced to rigorous imprisonment. Bipin Chandra Pal visited TN. Subramania Bharati: poet, journalist, nationalist.'},
{title:'Subramania Bharati (Bharathiyar)',detail:'Tamil poet and journalist (1882-1921). Wrote patriotic songs (Vande Mataram in Tamil), women\'s empowerment poetry, anti-caste songs. Edited India and Vijaya newspapers. Was in Pondicherry (French territory) to escape British arrest. Called Mahakavi (Great Poet). Works: Kuyil Pattu, Panchali Sabatham.'},
{title:'V.O. Chidambaram Pillai',detail:'Called Kappalottiya Tamilan (Tamil captain who steered a ship). Swadeshi Steam Navigation Company (1906): First Indian shipping company challenging British P&O company on Tuticorin-Colombo route. Arrested 1908. Sentenced to 6 years rigorous imprisonment (then reduced). Symbol of economic nationalism.'},
{title:'Salt Satyagraha in TN',detail:'Vedaranyam March (1930): C. Rajagopalachari (Rajaji) led salt march from Trichinopoly to Vedaranyam on the TN coast, parallel to Gandhi\'s Dandi March. Rajaji became independent India\'s Governor-General (only Indian to hold that post, 1948-1950).'}
],
hook:'TNPSC History Trap: Rajaji (C. Rajagopalachari) led Vedaranyam March (1930) — the TAMIL Nadu equivalent of Gandhi\'s Dandi March. Rajaji=only Indian Governor-General(1948-50). VOC=Kappalottiya Tamilan=Swadeshi Steam Navigation Company(1906). Subramania Bharati=Mahakavi, nationalist poet, based in Pondicherry.',
cards:[
{front:'V.O. Chidambaram Pillai ஏன் "கப்பலோட்டிய தமிழன்" என்று அழைக்கப்படுகிறார்?',back:'Launched Swadeshi Steam Navigation Company (1906) at Tuticorin — first Indian-owned shipping company challenging British P&O monopoly on Tuticorin-Colombo route. Proved Indians could run shipping companies.'},
{front:'Subramania Bharati பொண்டிச்சேரிக்கு ஏன் சென்றார்?',back:'To escape British arrest (Pondicherry was French territory, beyond British jurisdiction). Lived 1908-1918. Continued writing nationalist poetry and journalism from there.'},
{front:'வேதாரண்யம் சத்தியாகிரகம் — யார் நடத்தினார்? எந்த ஆண்டு?',back:'C. Rajagopalachari (Rajaji) in 1930. TN parallel to Gandhi\'s Dandi March. Led from Trichinopoly to Vedaranyam coast to make salt in defiance of British salt laws.'}
],
q:[{q:'The Swadeshi Steam Navigation Company was launched in 1906 by which Tamil freedom fighter?',options:['Subramania Bharati','C. Rajagopalachari','V.O. Chidambaram Pillai','Periyar'],answer_index:2,explanation:'V.O. Chidambaram Pillai (VOC) launched the Swadeshi Steam Navigation Company at Tuticorin in 1906 — challenging British P&O company. Called "Kappalottiya Tamilan" (Tamil who steered a ship). Arrested 1908.'},
{q:'C. Rajagopalachari (Rajaji) is notable in Indian history for which unique distinction?',options:['First Prime Minister of India','Only Indian to serve as Governor-General of India','First Chief Justice of India','First Indian President'],answer_index:1,explanation:'Rajaji (C. Rajagopalachari) was the ONLY INDIAN to serve as Governor-General of independent India (1948-1950). All other Governors-General were British. He succeeded Lord Mountbatten.'}
],
pyq:'High — TNPSC Unit 8 Modern History. Tamil freedom fighters are high-priority TNPSC topics.',
summary:'Tamil Freedom Fighters: VOC(Kappalottiya Tamilan,Swadeshi Steam Navigation Co.,1906,Tuticorin)+Subramania Bharati(Mahakavi,nationalist poet,Pondicherry 1908-18,Kuyil Pattu)+Rajaji(Vedaranyam March 1930+Only Indian Governor-General 1948-50). Samacheer 10th Std History.'},

{day:19,topic:'Indian Constitution & Fundamental Rights (TNPSC Angle)',
notes:[
{title:'TNPSC Focus Areas in Polity',detail:'TNPSC polity section tests: Fundamental Rights (Part III), DPSP (Part IV), Parliament structure, President and Governor powers, Panchayati Raj (73rd/74th Amendments), and Emergency provisions. Questions are at the awareness level (not UPSC depth).'},
{title:'Fundamental Rights — Quick Summary',detail:'Article 14: Equality before law. Article 19: 6 freedoms. Article 21: Life and personal liberty (includes education, privacy). Article 25: Freedom of religion. Article 32: Right to constitutional remedies (Heart and Soul — Dr. Ambedkar). Articles 12-35 = Part III.'},
{title:'Constitutional Bodies for TNPSC',detail:'TNPSC (Tamil Nadu Public Service Commission): Art 315-323 state equivalent. Conducts Group 1,2,3,4 exams, TET. State Election Commission: Conducts Panchayat/Municipality elections. State Finance Commission: Devolution of funds to local bodies (constituted every 5 years).'},
{title:'Key Amendments for TNPSC',detail:'42nd (1976): Added Secular, Socialist to Preamble. 44th (1978): Restored property right safeguards. 73rd (1992): Panchayati Raj. 74th (1992): Urban Local Bodies. 86th (2002): Right to Education (Art 21A). 103rd (2019): EWS reservation (10%).'}
],
hook:'TNPSC Polity Pattern: Questions test WHICH Article/Amendment covers WHAT. Key: Art 21=Life+Liberty(also Education per 86th Amdt). Art 32=Heart and Soul(Ambedkar). 73rd+74th Amendment=same year(1992)=Panchayati Raj+Urban bodies. TNPSC conducts Group exams=State PSC(Art 315-323 state equivalent).',
cards:[
{front:'Dr. Ambedkar ஏன் Article 32-ஐ "Constitution-இன் இதயமும் ஆன்மாவும்" என்று கூறினார்?',back:'Article 32 gives citizens the right to approach the Supreme Court DIRECTLY for enforcement of Fundamental Rights. Without Art 32, FRs would be meaningless. It guarantees constitutional remedies — the mechanism to make all other FRs effective.'},
{front:'73rd vs 74th Constitutional Amendment வேறுபாடு?',back:'73rd (1992)=Panchayati Raj (rural local bodies). 74th (1992)=Nagarpalika Act (urban local bodies — municipalities, corporations). Both passed in same year 1992.'},
{front:'EWS reservation எந்த Amendment மூலம் வந்தது? எத்தனை சதவீதம்?',back:'103rd Constitutional Amendment (2019). 10% reservation for Economically Weaker Sections (EWS) in the General Category. Added Art 15(6) and 16(6).'}
],
q:[{q:'Which Article of the Indian Constitution guarantees the Right to Constitutional Remedies?',options:['Article 19','Article 21','Article 32','Article 37'],answer_index:2,explanation:'Article 32 = Right to Constitutional Remedies = right to approach Supreme Court directly for enforcement of Fundamental Rights. Dr. Ambedkar called it the "Heart and Soul of the Constitution."'},
{q:'The 73rd Constitutional Amendment (1992) relates to which of the following?',options:['Urban Local Bodies','Panchayati Raj institutions','Fundamental Duties','OBC reservations'],answer_index:1,explanation:'73rd Amendment = Panchayati Raj (rural). 74th Amendment = Urban Local Bodies (same year 1992). Both aimed to decentralize governance and empower local self-government institutions.'}
],
pyq:'Very High — TNPSC Unit 9 Polity. Constitutional articles and amendments tested in every exam.',
summary:'TNPSC Polity focus: FRs(Part III,Art12-35)+DPSP(Part IV)+Parliament+Emergency. Key Arts: 14(equality)+19(6 freedoms)+21(life+liberty)+25(religion)+32(remedies=Heart&Soul). Key Amendments: 42nd(Preamble)+73rd(Panchayati Raj)+74th(Urban LB)+86th(RTE)+103rd(EWS,10%). TNPSC=State PSC(Art315-323 state equiv).'},

{day:20,topic:'Environment & Ecology (Samacheer Based)',
notes:[
{title:'Ecosystem Components',detail:'Biotic (living): Producers (plants/autotrophs), Consumers (herbivores, carnivores, omnivores), Decomposers (fungi, bacteria). Abiotic (non-living): sunlight, temperature, water, soil, air. Food chain: Producers→Primary consumers(herbivores)→Secondary consumers→Tertiary consumers. Food web: interconnected food chains.'},
{title:'Energy Flow in Ecosystem',detail:'10% Rule (Lindemann\'s Law): Only 10% of energy transfers from one trophic level to the next. 90% lost as heat. So: 1000J in plants→100J in herbivores→10J in carnivores. This is why food chains rarely exceed 4-5 levels. Pyramid of energy is always upright.'},
{title:'Biodiversity Hotspots in India',detail:'India has 4 biodiversity hotspots: Western Ghats+Sri Lanka, Indo-Burma, Himalaya, Sundaland. Western Ghats (TN angle): Nilgiris, Anamalai hills. Tiger reserves in TN: Mudumalai (oldest), Kalakad-Mundanthurai, Anamalai, Sathyamangalam, Cauvery. Protected areas important for TNPSC.'},
{title:'Pollution & Environmental Acts',detail:'Water Pollution Prevention Act: 1974. Air Pollution Prevention Act: 1981. Environment Protection Act: 1986 (passed after Bhopal gas tragedy 1984). National Green Tribunal (NGT): 2010. Bhopal Gas Tragedy: December 2-3, 1984. Methyl Isocyanate (MIC) gas leak. Union Carbide plant.'}
],
hook:'TNPSC Ecology Trap: 10% Energy Rule = Lindemann. Not 20%, not 50% — exactly 10% transfers up each level. Pyramid of energy is ALWAYS upright. Pyramid of numbers can be inverted (one tree supporting many insects). Western Ghats is a biodiversity hotspot. TN has 5 tiger reserves — Mudumalai is oldest.',
cards:[
{front:'Lindemann\'s 10% Law என்றால் என்ன?',back:'Only 10% of energy transfers from one trophic level to the next. 90% is lost as heat. Example: 1000 cal in plants → 100 cal in herbivores → 10 cal in carnivores → 1 cal in top predator.'},
{front:'Tamil Nadu-ல் உள்ள Tiger Reserves எவை?',back:'5 Tiger Reserves: Mudumalai (oldest, Nilgiris), Kalakad-Mundanthurai (Tirunelveli), Anamalai (Coimbatore), Sathyamangalam (Erode), Cauvery (Erode-Krishnagiri). Mudumalai = one of India\'s first tiger reserves.'},
{front:'Environment Protection Act எந்த ஆண்டு? ஏன் நிறைவேற்றப்பட்டது?',back:'1986. Passed in response to Bhopal Gas Tragedy (December 2-3, 1984). MIC gas leak from Union Carbide plant. Worst industrial disaster in history. Environment Act = umbrella legislation for environmental protection.'}
],
q:[{q:'According to Lindemann\'s 10% Law, if producers have 10,000 cal of energy, how much energy reaches the secondary consumer level?',options:['1000 cal','100 cal','500 cal','10 cal'],answer_index:1,explanation:'10% transfers at each level. Producers=10,000→Primary consumers=1,000(10%)→Secondary consumers=100(10% of 1,000). Only 100 cal reaches secondary consumers from 10,000 cal at producer level.'},
{q:'Which of the following Tiger Reserves in Tamil Nadu is the oldest?',options:['Kalakad-Mundanthurai','Anamalai','Mudumalai','Sathyamangalam'],answer_index:2,explanation:'Mudumalai Tiger Reserve in the Nilgiris is one of India\'s oldest tiger reserves. Part of the Nilgiri Biosphere Reserve. Established as Wildlife Sanctuary in 1942, declared Tiger Reserve in 2007.'}
],
pyq:'High — TNPSC Science & Environment. Ecosystem laws, biodiversity hotspots, tiger reserves tested.',
summary:'Ecosystem: Biotic(producers+consumers+decomposers)+Abiotic(sunlight+water+soil). 10% Rule(Lindemann): only 10% energy transfers each trophic level. India: 4 biodiversity hotspots(Western Ghats+Indo-Burma+Himalaya+Sundaland). TN Tiger Reserves(5): Mudumalai(oldest)+Kalakad-Mundanthurai+Anamalai+Sathyamangalam+Cauvery. Environment Act 1986(post-Bhopal 1984). Samacheer 8th-10th Std Science.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏛️ TNPSC Samacheer Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC '+d.topic+' samacheer'),why:'Samacheer-based coaching.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 16-20 COMPLETE');
}
push();
