require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:11,topic:'TN Geography: Districts, Rivers & Physical Features',
notes:[
{title:'Tamil Nadu — Basic Geography',detail:'Area: 130,058 sq km (11th largest state). Coastline: 1,076 km (3rd longest in India after Andhra Pradesh and Gujarat). Borders: Karnataka (NW), Andhra Pradesh (N), Kerala (W), UT Puducherry (E coast). Capital: Chennai. 38 districts (as of 2022 reorganization).'},
{title:'Major Rivers of Tamil Nadu',detail:'Cauvery (Kaveri): Originates in Coorg (Karnataka), enters TN at Hogenekal. Most important river. Vaigai: Flows through Madurai, Sivaganga. Tamirabarani: Originates in Agasthiyar hills, flows in Tirunelveli-Thoothukudi. Palar: North TN. Pennaiyar: North TN. Ponnaiyar: North TN.'},
{title:'Geographic Regions',detail:'Eastern Ghats (north TN), Western Ghats (west border, Nilgiris). Nilgiri Hills: Ooty (Udhagamandalam). Highest peak in TN: Doddabetta (2637m, Nilgiris). Palani Hills: Kodaikanal hill station. Shervaroy Hills: Salem. Javadhu Hills: Vellore-Tiruvannamalai.'},
{title:'Important Facts',detail:'Palk Strait: Separates TN from Sri Lanka. Gulf of Mannar: Southeast coast. Adam\'s Bridge (Ram Sethu): Chain of limestone shoals between Pamban Island (TN) and Mannar Island (Sri Lanka). Pamban Island (Rameswaram): Connected by Pamban Bridge (first sea bridge in India, 1914).'}
],
hook:'TNPSC Geography Precision: Tamil Nadu coastline = 1,076 km (3rd longest, NOT 2nd). Longest = Gujarat? No — Andhra Pradesh has the longest mainland coastline. Doddabetta (2637m) = highest peak in TN AND Nilgiris. Tamirabarani = only perennial river in south TN. Palk Strait separates TN from Sri Lanka.',
cards:[
{front:'Tamil Nadu coastline length and rank?',back:'1,076 km. 3rd longest in India. States with longer: Andhra Pradesh and Gujarat (or Andhra Pradesh first). TN faces Bay of Bengal on east.'},
{front:'Doddabetta — எங்கு உள்ளது? உயரம் என்ன?',back:'Nilgiris district. 2637 metres. Highest peak in Tamil Nadu AND the Nilgiri Hills. Near Ooty (Udhagamandalam).'},
{front:'Tamirabarani நதி ஏன் முக்கியமானது?',back:'Only perennial (year-round flow) river in southern Tamil Nadu. Originates in Agasthiyar Malai, flows through Tirunelveli and Thoothukudi. Associated with pearl fishing (Gulf of Mannar).'}
],
q:[{q:'The Pamban Bridge (Rail Bridge) connects Rameswaram to the mainland. It was India\'s first sea bridge, built in which year?',options:['1900','1914','1924','1948'],answer_index:1,explanation:'Pamban Bridge (rail bridge) was built in 1914 — India\'s first sea bridge. Connects Pamban Island (Rameswaram) to Mandapam on the mainland. Crosses Palk Strait. A new vertical lift Pamban rail bridge is being constructed (announced 2019).'},
{q:'Adam\'s Bridge (Ram Sethu) connects which two locations?',options:['Chennai to Sri Lanka','Pamban Island (TN) to Mannar Island (Sri Lanka)','Rameswaram to Colombo','Tuticorin to Jaffna'],answer_index:1,explanation:'Adam\'s Bridge = chain of natural limestone shoals between Pamban Island (TN) and Mannar Island (Sri Lanka). Partially visible above water. Referenced in Hindu mythology as the bridge built by Lord Rama.'}
],
pyq:'High — TNPSC Unit 9 Geography. River-district matching and geographic features tested.',
summary:'TN: 130,058 sq km(11th largest). Coastline 1,076km(3rd). 38 districts. Rivers: Cauvery(main)+Vaigai(Madurai)+Tamirabarani(perennial,south TN)+Palar+Pennaiyar. Highest peak: Doddabetta(2637m,Nilgiris). Pamban Bridge(1914,first sea bridge). Adam\'s Bridge=Pamban Island to Mannar Island. Palk Strait=TN-Sri Lanka separation.'},

{day:12,topic:'TN Economy & Social Welfare Schemes',
notes:[
{title:'Tamil Nadu Economy',detail:'GSDP: 2nd or 3rd largest state economy in India. Called "Detroit of Asia" — Chennai has India\'s largest automobile manufacturing hub (Hyundai, Ford, BMW, Renault-Nissan, Royal Enfield, TVS, Ashok Leyland). IT hub: Chennai (2nd after Bangalore). Textile: Tirupur (knitwear export capital), Coimbatore (textile machinery). Leather: Chennai and Vellore.'},
{title:'Agriculture',detail:'Rice: Major crop (Cauvery delta = Rice bowl of TN). Sugarcane: Major crop. Banana: Theni, Trichy. Cotton: Coimbatore, Vellore. Coconut: Coimbatore. Tapioca: Yercaud area. Fisheries: Nagapattinam, Thoothukudi, Chennai coast. Marine products = major export.'},
{title:'Social Welfare Schemes',detail:'Mid-Day Meal Scheme: Introduced by K. Kamaraj (CM) in 1960s for school attendance. Expanded by MGR (1982) to include egg/protein. Pudhumai Penn: Scholarship scheme for girl students in government schools continuing higher education (announced 2023). Amma Canteen: Subsidized food. Moovalur Ramamirtham Ammaiyar Ninaivu Marriage Assistance Scheme: for SC/BC women.'},
{title:'TN Health & Education Ranks',detail:'TN is one of the best-performing states in health (low IMR, MMR). HDI: Among top 5 states. Literacy rate: 80%+ (above national average ~77%). Sex ratio: Better than national average. NITI Aayog SDG rankings: TN consistently in top 3-5 states.'}
],
hook:'TNPSC Scheme Trap: Mid-Day Meal Scheme was started by K. Kamaraj as CM — NOT by MGR. MGR EXPANDED it (1982, added protein/egg). Students confuse the originator. Also: "Detroit of Asia" = Chennai (automobiles), NOT Coimbatore (though Coimbatore = Manchester of South India for textiles).',
cards:[
{front:'"Detroit of Asia" என்று அழைக்கப்படுவது எது? ஏன்?',back:'Chennai — India\'s largest automobile manufacturing hub. Hyundai, BMW, Renault-Nissan, TVS, Ashok Leyland, Royal Enfield factories. Called Detroit (US auto city) equivalent.'},
{front:'Mid-Day Meal Scheme யார் தொடங்கினார்? யார் விரிவாக்கினார்?',back:'Started by K. Kamaraj (as TN CM, 1960s). Expanded by MGR (1982 — added egg/nutrition). National model from Tamil Nadu. Common exam confusion.'},
{front:'Pudhumai Penn scheme என்றால் என்ன?',back:'Scholarship scheme for girl students in government schools who continue to higher education (college). Announced 2023. Aims to increase female higher education enrollment from SC/BC communities.'}
],
q:[{q:'Chennai is called "Detroit of Asia" because of its prominence in which industry?',options:['IT/Software','Textile manufacturing','Automobile manufacturing','Leather goods'],answer_index:2,explanation:'Chennai = "Detroit of Asia" for automobile manufacturing. Major plants: Hyundai (Sriperumbudur), BMW, Renault-Nissan, Ford (formerly), TVS, Ashok Leyland, Royal Enfield. India\'s largest auto hub.'},
{q:'Which Chief Minister of Tamil Nadu is credited with starting the Mid-Day Meal Scheme?',options:['MGR','C.N. Annadurai','K. Kamaraj','J. Jayalalithaa'],answer_index:2,explanation:'K. Kamaraj started the Midday Meal Scheme (also attributed to free uniform + school initiatives) to increase school attendance, especially among lower-income children. MGR significantly expanded it in 1982 by adding nutritious food.'}
],
pyq:'High — TNPSC Unit 9 Economy and Welfare Schemes. Scheme-founder matching is frequently tested.',
summary:'TN Economy: Detroit of Asia(Chennai,auto hub)+Manchester of South India(Coimbatore,textiles)+Tirupur(knitwear exports). Agriculture: Cauvery delta=rice bowl. Mid-Day Meal: Kamaraj(started)+MGR(expanded 1982). Pudhumai Penn(2023,girl scholarship). Amma Canteen. GSDP: 2nd/3rd largest. Top HDI state.'},

{day:13,topic:'Human Body Systems: Digestive & Circulatory (Samacheer Bio)',
notes:[
{title:'Digestive System',detail:'Mouth (saliva: amylase breaks starch) → Oesophagus (peristalsis) → Stomach (HCl + pepsin breaks protein) → Small intestine (duodenum receives bile from liver, pancreatic juice, intestinal juice — digests fats/proteins/carbs) → Large intestine (water absorption) → Rectum → Anus. Samacheer 10th Std Biology.'},
{title:'Key Enzymes',detail:'Salivary Amylase (ptyalin): mouth, breaks starch→maltose. Pepsin: stomach, breaks proteins. Trypsin: pancreas, breaks proteins. Lipase: pancreas, breaks fats. Sucrase/Maltase/Lactase: small intestine, breaks sugars. Bile: NOT an enzyme — emulsifies fats (produced by liver, stored in gall bladder).'},
{title:'Circulatory System',detail:'Heart: 4 chambers (2 auricles + 2 ventricles). Left side = oxygenated blood. Right side = deoxygenated blood. SA node (Sino-Atrial) = pacemaker of heart. Normal heart rate: 72 beats/min. Blood pressure: 120/80 mmHg (systolic/diastolic). Double circulation in humans.'},
{title:'Blood Components',detail:'RBC (Red Blood Cells): carry oxygen (haemoglobin), no nucleus in mature RBCs, 120-day lifespan. WBC (White Blood Cells): immunity, 10-14 day lifespan. Platelets (thrombocytes): blood clotting, 7-10 day lifespan. Plasma: 55% of blood, carries nutrients/hormones/wastes.'}
],
hook:'TNPSC Science Trap: Bile is NOT an enzyme — it is an emulsifier (produced by liver, stored in gall bladder, released into duodenum). SA node (NOT AV node) is the natural pacemaker. RBC lifespan=120 days (NOT 60). Longest-lived WBC=lymphocytes (years). These 4 facts generate 90% of TNPSC biology wrong-answer traps.',
cards:[
{front:'Bile — எங்கு உற்பத்தியாகிறது? என்ன வேலை செய்கிறது?',back:'Produced by LIVER. Stored in GALL BLADDER. Released into DUODENUM. Function: emulsifies fats (breaks fat globules into small droplets for enzyme action). NOT an enzyme itself.'},
{front:'SA Node ஏன் முக்கியமானது?',back:'Sino-Atrial Node = natural pacemaker of the heart. Located in right auricle. Generates electrical impulses that control heartbeat rhythm. Normal rate: 72 beats/min.'},
{front:'RBC, WBC, Platelets — ஆயுட்காலம் என்ன?',back:'RBC=120 days. WBC=10-14 days (lymphocytes live longer — months/years). Platelets=7-10 days. RBC has NO nucleus in mature state.'}
],
q:[{q:'Which of the following is NOT an enzyme in the human digestive system?',options:['Pepsin','Lipase','Bile','Amylase'],answer_index:2,explanation:'Bile is NOT an enzyme. It is a digestive JUICE/emulsifier produced by the liver and stored in the gall bladder. It emulsifies fats but does not chemically break them down. Pepsin, Lipase, and Amylase are all true enzymes.'},
{q:'The natural pacemaker of the human heart is?',options:['AV Node','SA Node','Bundle of His','Purkinje fibres'],answer_index:1,explanation:'SA Node (Sino-Atrial Node) in the right auricle is the natural pacemaker — initiates each heartbeat. AV Node receives signal from SA Node. Bundle of His and Purkinje fibres conduct the impulse to ventricles.'}
],
pyq:'Very High — TNPSC Science section. Biology (human systems) is the highest-yield science topic.',
summary:'Digestive: Mouth(amylase)→Stomach(HCl+pepsin)→Small intestine(bile emulsifies+trypsin+lipase)→Large intestine(water). Bile=liver produces, gallbladder stores, NOT enzyme. Heart: 4 chambers. SA Node=pacemaker. Normal HR=72bpm. BP=120/80. RBC lifespan=120days(no nucleus). WBC=immunity. Platelets=7-10days(clotting). Samacheer 10th Std Biology.'},

{day:14,topic:'Plant Kingdom & Nutrition in Plants (Samacheer Biology)',
notes:[
{title:'Photosynthesis',detail:'6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂. Location: Chloroplasts. Pigment: Chlorophyll (absorbs red and blue light, reflects green — hence plants look green). Light reaction: in thylakoids (produces ATP, NADPH, releases O₂). Dark reaction (Calvin cycle): in stroma (uses CO₂, produces glucose).'},
{title:'Modes of Nutrition in Plants',detail:'Autotrophic: Make own food via photosynthesis (most plants). Heterotrophic/Parasitic: Cuscuta (dodder) — no chlorophyll, wraps around host plants. Insectivorous: Pitcher plant (Nepenthes), Venus flytrap, Sundew — supplement nutrition with insects in nitrogen-poor soil. Symbiotic: Lichens (algae+fungi), Rhizobium in legume root nodules.'},
{title:'Transpiration & Osmosis',detail:'Transpiration: Loss of water vapour from leaves through stomata. Advantage: Creates suction pull for water transport. Osmosis: Movement of water from low solute concentration to high, through semi-permeable membrane. Turgid cell: high water pressure (stomata open). Plasmolysis: cell loses water, membrane shrinks away from wall.'},
{title:'Classification of Plants',detail:'Thallophyta (algae, fungi): No true roots/stem/leaves. Bryophyta (moss, liverwort): Plant kingdom\'s amphibians, no vascular tissue. Pteridophyta (ferns): First vascular plants, no seeds. Gymnosperms (pine, cycas): Seeds not enclosed, cones. Angiosperms: Seeds in fruits (flowering plants). Samacheer 9th Std Biology.'}
],
hook:'TNPSC Science Trap: Photosynthesis releases O₂ (not CO₂). Respiration releases CO₂. Common confusion. Cuscuta = parasite (no chlorophyll). Pitcher plant = insectivorous (HAS chlorophyll but supplements). Lichens = algae + fungi symbiosis (NOT algae + bacteria). Rhizobium = bacteria in LEGUME root nodules = nitrogen fixation.',
cards:[
{front:'Photosynthesis equation என்ன?',back:'6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂. Reactants: CO₂+H₂O+Light. Products: Glucose+Oxygen. Location: Chloroplasts.'},
{front:'Cuscuta (கஸ்கூட்டா) எந்த வகை ஊட்டச்சத்து முறை?',back:'Parasitic nutrition. No chlorophyll — wraps around host plant and absorbs nutrients directly. Examples: Cuscuta reflexa on hedges. Cannot make its own food.'},
{front:'Rhizobium பற்றி என்ன தெரியும்?',back:'Nitrogen-fixing bacteria. Lives in ROOT NODULES of LEGUMINOUS plants (beans, peas, groundnut). Converts atmospheric N₂ into ammonia — enriches soil. Symbiotic relationship (mutual benefit).'}
],
q:[{q:'Which of the following plants is INSECTIVOROUS?',options:['Cuscuta','Lichen','Pitcher plant (Nepenthes)','Rhizobium plant'],answer_index:2,explanation:'Pitcher plant (Nepenthes) is insectivorous — traps insects for supplemental nitrogen in nutrient-poor soil. It HAS chlorophyll and does photosynthesize. Cuscuta is parasitic (no chlorophyll). Lichen is algae+fungi symbiosis.'},
{q:'During photosynthesis, which gas is RELEASED?',options:['Carbon Dioxide','Nitrogen','Oxygen','Hydrogen'],answer_index:2,explanation:'Photosynthesis: CO₂ + H₂O + Light → Glucose + O₂. Oxygen is released as a byproduct when water molecules are split (photolysis) during light reactions. This is the exact opposite of respiration which releases CO₂.'}
],
pyq:'Very High — TNPSC Science. Photosynthesis equation and plant nutrition types are standard questions.',
summary:'Photosynthesis: 6CO₂+6H₂O+light→C₆H₁₂O₆+6O₂(in chloroplasts). Plant nutrition: Autotrophic(photosynthesis)+Parasitic(Cuscuta,no chlorophyll)+Insectivorous(pitcher plant,has chlorophyll)+Symbiotic(Rhizobium in legume roots=N-fixation, Lichens=algae+fungi). Classification: Thallophyta→Bryophyta→Pteridophyta→Gymnosperm→Angiosperm. Samacheer 9th Std.'},

{day:15,topic:'Physics: Force, Motion & Light (Samacheer 9-10)',
notes:[
{title:'Newton\'s Laws of Motion',detail:'1st Law (Inertia): Object at rest stays at rest, object in motion stays in motion unless acted by external force. 2nd Law: F=ma (Force=mass×acceleration). 3rd Law: Every action has equal and opposite reaction. Momentum=mass×velocity. Impulse=Force×time=change in momentum.'},
{title:'Gravitation',detail:'Universal Gravitation: F=Gm₁m₂/r². G=6.67×10⁻¹¹ Nm²/kg². g (acceleration due to gravity on Earth surface)=9.8 m/s². g on Moon=g/6 (1.63 m/s²). Weight=mass×g. Weight varies (depends on g), mass is constant. Escape velocity from Earth=11.2 km/s.'},
{title:'Light',detail:'Speed of light=3×10⁸ m/s. Refraction: Light bends when passing from one medium to another. Snell\'s Law: n₁sinθ₁=n₂sinθ₂. Total Internal Reflection: Light travels from denser to rarer medium beyond critical angle. Optical fibre: uses TIR. Rainbow: dispersion of white light by raindrops.'},
{title:'Electricity',detail:'Ohm\'s Law: V=IR (Voltage=Current×Resistance). Power=VI=I²R=V²/R (watts). In series: Resistance adds (R=R₁+R₂). In parallel: 1/R=1/R₁+1/R₂ (equivalent resistance decreases). Household current: AC, 220V, 50Hz in India. Fuse: safety device (thin wire that melts at high current).'}
],
hook:'TNPSC Science Shortcut: Weight on Moon = Weight on Earth ÷ 6 (gravity is 1/6). Mass stays same. Speed of light = 3×10⁸ m/s. g = 9.8 m/s². Escape velocity = 11.2 km/s. In parallel circuits resistance DECREASES (more paths = less total resistance). These 5 values cover all TNPSC physics numerical traps.',
cards:[
{front:'Newton\'s 2nd Law of Motion என்ன?',back:'F=ma. Force=mass×acceleration. SI unit of force=Newton(N). If force doubles: acceleration doubles(if mass constant). If mass doubles: acceleration halves(if force constant).'},
{front:'Moon-ல் ஒருவரின் எடை(Weight) எவ்வளவு இருக்கும்?',back:'Earth weight÷6. Moon\'s gravity=1/6 of Earth. MASS stays constant everywhere. Weight=m×g; since g on Moon=1/6 of Earth, weight=1/6. Example: 60kg person weighs 600N on Earth, 100N on Moon.'},
{front:'Total Internal Reflection என்றால் என்ன? எங்கு பயன்படுகிறது?',back:'When light goes from DENSER to RARER medium beyond critical angle — completely reflected back (no refraction). Application: Optical fibre cables (internet/telecom). Also: Diamond sparkle, mirage.'}
],
q:[{q:'A person weighs 600N on Earth. What is their weight on the Moon?',options:['600N','100N','300N','60N'],answer_index:1,explanation:'Moon\'s gravity=1/6 of Earth. Weight on Moon=600/6=100N. Mass remains 600/10=60kg (using g=10 for simplicity). Weight varies with gravity; mass is constant.'},
{q:'In which of the following is the concept of Total Internal Reflection applied?',options:['Rainbow formation','Optical fibre cables','Convex lens','Plane mirror'],answer_index:1,explanation:'Optical fibre cables use Total Internal Reflection — light signals travel through glass fibre by repeatedly reflecting off the inner surface without escaping. This allows high-speed data transmission over long distances.'}
],
pyq:'High — TNPSC Science section. Newton\'s laws, gravitation, and light are standard topics from Samacheer 9-10.',
summary:'Newton: 1st(Inertia)+2nd(F=ma)+3rd(action-reaction). g=9.8m/s²(Earth),1.63m/s²(Moon=1/6). Weight=mg(varies), Mass=constant. Escape velocity=11.2km/s. Speed of light=3×10⁸m/s. TIR: denser→rarer beyond critical angle→optical fibres. Ohm\'s Law: V=IR. Series: R adds. Parallel: R decreases. India: AC 220V 50Hz. Samacheer 9th-10th Std.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏛️ TNPSC Samacheer Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC Science: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC '+d.topic+' samacheer science'),why:'Samacheer science coaching.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 11-15 COMPLETE');
}
push();
