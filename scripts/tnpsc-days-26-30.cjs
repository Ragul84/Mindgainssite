require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:26,topic:'Human Reproductive System & Health (Samacheer Bio)',
notes:[
{title:'Male Reproductive System',detail:'Testes: Produce sperms and testosterone. Located in scrotum (outside body cavity — lower temperature needed for sperm production). Epididymis: Sperm maturation and storage. Vas deferens: Sperm transport. Seminal vesicle, prostate gland, Cowper\'s gland: Produce seminal fluid. Urethra: Common passage for urine and semen. Testosterone: primary male sex hormone.'},
{title:'Female Reproductive System',detail:'Ovaries: Produce eggs (ova) and hormones (estrogen, progesterone). Fallopian tubes (Oviducts): Egg travels from ovary to uterus. Site of fertilization. Uterus: Site of implantation and fetal development. Cervix: Lower narrow part of uterus. Vagina: Birth canal. Menstrual cycle: 28 days average. Ovulation: Day 14 (14th day of cycle).'},
{title:'Fertilization & Development',detail:'Fertilization: Sperm + Egg → Zygote (in Fallopian tube). Zygote divides → Embryo → Implants in uterus wall (endometrium). Gestation period: 9 months (40 weeks) in humans. Placenta: Nourishes fetus, produces hormones (hCG). Amnion: Protective fluid around fetus.'},
{title:'Reproductive Health',detail:'STI (Sexually Transmitted Infections): HIV/AIDS, Gonorrhoea, Syphilis, Herpes. HIV attacks CD4+ T cells (white blood cells). No cure for HIV/AIDS (antiretroviral therapy manages it). Contraception types: Barrier (condom), Hormonal (pill), IUD, Surgical (tubectomy/vasectomy). Samacheer 12th Std Biology.'}
],
hook:'TNPSC Biology Trap: Fertilization occurs in FALLOPIAN TUBE (not uterus). Implantation occurs in UTERUS. Testes are outside body (scrotum) because sperm production needs 2-3°C LOWER temperature than body. HIV attacks T-lymphocytes (CD4+ cells), NOT just any WBC. Ovulation = Day 14 of menstrual cycle (not Day 1 or Day 28).',
cards:[
{front:'கருவுறுதல் (Fertilization) எங்கு நடைபெறுகிறது?',back:'Fallopian Tube (Oviduct). Sperm meets egg in fallopian tube → forms zygote. Zygote travels to uterus for implantation. NOT in the uterus itself.'},
{front:'அண்டவிடுப்பு (Ovulation) மாதவிடாய் சுழற்சியின் எந்த நாளில் நடைபெறுகிறது?',back:'Day 14 of a 28-day menstrual cycle. The egg is released from the ovary. Fertile window: 2-3 days around ovulation. Cycle Day 1 = first day of menstruation.'},
{front:'HIV எந்த செல்களை தாக்குகிறது?',back:'CD4+ T-lymphocytes (Helper T cells) — a type of WBC that coordinates immune response. By destroying these, HIV weakens the entire immune system. AIDS = advanced stage when CD4 count falls below 200/mm³.'}
],
q:[{q:'The site of fertilization in the human female reproductive system is?',options:['Uterus','Ovary','Fallopian tube (Oviduct)','Cervix'],answer_index:2,explanation:'Fertilization (sperm + egg → zygote) occurs in the Fallopian tube (Oviduct). The zygote then travels down the fallopian tube and implants in the uterus (womb). Confusing fertilization site with implantation site is a classic TNPSC trap.'},
{q:'Testes are located outside the body cavity (in scrotum) because?',options:['Easy blood supply','Sperm production requires lower temperature','Testosterone production needs sunlight','Protection from abdominal pressure'],answer_index:1,explanation:'Sperm production (spermatogenesis) requires a temperature 2-3°C LOWER than normal body temperature (37°C). The scrotum maintains ~34-35°C which is optimal for sperm production.'}
],
pyq:'High — TNPSC Science. Human reproduction system is a core 10th/12th Samacheer topic tested in Group 2/4.',
summary:'Male: Testes(sperm+testosterone,scrotum=lower temp)+Epididymis(storage)+Vas deferens(transport). Female: Ovaries(eggs+estrogen/progesterone)+Fallopian tube(fertilization site)+Uterus(implantation). Fertilization=Fallopian tube. Implantation=Uterus. Gestation=40 weeks. Ovulation=Day 14. HIV=attacks CD4+ T-cells. Samacheer 12th Std Biology.'},

{day:27,topic:'Nervous System & Sense Organs (Samacheer 10th Bio)',
notes:[
{title:'Central Nervous System',detail:'Brain + Spinal cord = CNS. Brain divisions: Cerebrum (largest, voluntary actions, memory, intelligence, personality), Cerebellum (balance, coordination, posture), Medulla oblongata (involuntary actions: breathing, heartbeat, swallowing — connects brain to spinal cord). Hypothalamus: thermoregulation, hunger, thirst, sleep.'},
{title:'Peripheral Nervous System & Neurons',detail:'12 pairs of cranial nerves, 31 pairs of spinal nerves. Neuron structure: Cell body (soma), Dendrites (receive signals), Axon (transmit signals), Myelin sheath (insulates axon). Synapse: Gap between neurons. Neurotransmitters: chemicals crossing synapse (acetylcholine, dopamine, serotonin).'},
{title:'Reflex Action',detail:'Reflex arc: Stimulus → Receptor → Afferent nerve → Spinal cord → Efferent nerve → Effector (muscle/gland) → Response. Reflex bypasses brain (faster). Example: Knee-jerk reflex, touching hot object. Spinal cord is reflex centre.'},
{title:'Sense Organs',detail:'Eye: Retina has rods (dim light, black/white) and cones (bright light, colour). Fovea: sharpest vision (all cones). Blind spot: optic disc (no receptors). Ear: Cochlea (hearing), Semicircular canals (balance). Tongue: 4 tastes — sweet (tip), salt/sour (sides), bitter (back). Nose: Olfactory nerve (1st cranial nerve).'}
],
hook:'TNPSC Neuro Trap: Medulla oblongata controls INVOLUNTARY actions (breathing, heartbeat). Cerebellum controls BALANCE and COORDINATION. Cerebrum controls VOLUNTARY actions and thinking. Students often swap cerebellum and cerebrum. Reflex action = spinal cord (NOT brain). Rod cells = dim light/night vision. Cone cells = colour/bright light.',
cards:[
{front:'Medulla oblongata என்ன செயல்களை கட்டுப்படுத்துகிறது?',back:'Involuntary (automatic) actions: breathing, heartbeat, swallowing, coughing, sneezing, vomiting. It is the connection between brain and spinal cord. Damage = death (controls vital functions).'},
{front:'Reflex action-ல் மூளையின் பங்கு என்ன?',back:'NONE in the actual reflex response. Reflex arc goes through spinal cord only (bypasses brain). Brain is informed AFTER the response occurs. This is why reflexes are faster than voluntary actions.'},
{front:'Retina-ல் Rod மற்றும் Cone cells வேறுபாடு?',back:'Rods: Dim light/night vision, black and white, peripheral vision. Cones: Bright light, colour vision, concentrated at fovea (sharpest vision). Colour blindness = defective cone cells.'}
],
q:[{q:'Which part of the brain controls balance and coordination of body movements?',options:['Cerebrum','Medulla oblongata','Hypothalamus','Cerebellum'],answer_index:3,explanation:'Cerebellum controls balance, coordination, and fine motor movements. Cerebrum = voluntary actions and thinking. Medulla oblongata = involuntary vital functions. Hypothalamus = body temperature, hunger, thirst.'},
{q:'In a reflex action, the nerve pathway goes through which structure?',options:['Cerebrum','Cerebellum','Spinal cord','Thalamus'],answer_index:2,explanation:'Reflex arc: Stimulus → Receptor → Afferent nerve → SPINAL CORD → Efferent nerve → Effector → Response. Bypasses the brain for speed. The brain is only informed afterward.'}
],
pyq:'High — TNPSC Science. Nervous system and sense organs are standard Samacheer 10th topics tested in Group 4.',
summary:'CNS: Cerebrum(voluntary+memory)+Cerebellum(balance+coordination)+Medulla oblongata(involuntary: breathing+heartbeat). Hypothalamus(hunger+thirst+temp). Reflex: Spinal cord(NOT brain). Neuron: Dendrites(receive)→Cell body→Axon(transmit). Synapse=gap, neurotransmitters cross. Eye: Rods(dim/night)+Cones(colour,fovea). Ear: Cochlea(hearing)+Semicircular canals(balance). Samacheer 10th Std Biology.'},

{day:28,topic:'Endocrine System & Vitamins (Samacheer Biology)',
notes:[
{title:'Endocrine Glands & Hormones',detail:'Pituitary (Master gland): GH (growth), TSH (thyroid stimulating), ACTH, FSH, LH. Thyroid: T3, T4 (metabolism, growth) — needs iodine. Deficiency: Goitre (iodine deficiency), Hypothyroidism, Cretinism (children). Adrenal: Adrenaline/Epinephrine (fight or flight), Cortisol (stress). Pancreas: Insulin (lowers blood sugar), Glucagon (raises blood sugar).'},
{title:'Pancreas — Diabetes',detail:'Insulin: produced by Beta cells of Islets of Langerhans. Lowers blood glucose by promoting uptake into cells. Glucagon: produced by Alpha cells. Raises blood glucose. Type 1 Diabetes: No insulin production (autoimmune). Type 2 Diabetes: Insulin resistance. Treatment: Insulin injection (Type 1), lifestyle + medication (Type 2).'},
{title:'Vitamins',detail:'Fat-soluble: A, D, E, K (stored in body fat). Water-soluble: B complex, C (excreted in urine, daily intake needed). Vitamin A: Night blindness deficiency. B1 (Thiamine): Beriberi. B3 (Niacin): Pellagra. B12: Pernicious anaemia. C (Ascorbic acid): Scurvy. D: Rickets (children), Osteomalacia (adults). K: Blood clotting.'},
{title:'Mineral Deficiencies',detail:'Iron: Anaemia (low haemoglobin). Iodine: Goitre (thyroid enlargement), Cretinism. Calcium: Weak bones, Osteoporosis. Fluoride: Dental cavities (deficiency) or Fluorosis (excess). Zinc: Impaired wound healing. Sodium: Hyponatremia. Potassium: Muscle cramps, Hypokalemia.'}
],
hook:'TNPSC Vitamin Trap: Vitamin D deficiency = Rickets (children) NOT Scurvy. Scurvy = Vitamin C deficiency. Night blindness = Vitamin A. Beriberi = Vitamin B1. Pellagra = Vitamin B3. Iodine deficiency = Goitre (NOT Anaemia — that is Iron deficiency). Pituitary = Master gland (controls other glands). Insulin = lowers blood sugar (produced by Beta cells).',
cards:[
{front:'இன்சுலின் எந்த செல்களால் உற்பத்தியாகிறது? என்ன செய்கிறது?',back:'Beta cells of Islets of Langerhans (in pancreas). Lowers blood glucose by promoting cellular uptake of glucose. Insulin deficiency/resistance = Diabetes mellitus.'},
{front:'Vitamin D குறைபாட்டால் என்ன நோய் வருகிறது?',back:'Rickets (in children): soft, weak, deformed bones. Osteomalacia (in adults): soft bones. Vitamin D needed for calcium absorption. Sources: Sunlight (skin synthesizes D3), fish liver oil, eggs.'},
{front:'ஐயோடின் குறைபாட்டால் என்ன நோய் வருகிறது?',back:'Goitre (கழுத்துவீக்கம்): Enlarged thyroid gland. Cretinism: Severe iodine deficiency in pregnancy/infancy causing intellectual disability and stunted growth.'}
],
q:[{q:'Which vitamin deficiency causes Night Blindness?',options:['Vitamin B12','Vitamin C','Vitamin A','Vitamin D'],answer_index:2,explanation:'Night blindness (Nyctalopia) is caused by Vitamin A deficiency. Vitamin A is needed to produce rhodopsin (visual purple) in rod cells for dim-light vision. Vitamin C deficiency=Scurvy. Vitamin D deficiency=Rickets.'},
{q:'The hormone INSULIN is produced by which cells in the Pancreas?',options:['Alpha cells','Beta cells','Delta cells','Acinar cells'],answer_index:1,explanation:'Insulin is produced by Beta cells of the Islets of Langerhans in the pancreas. Alpha cells produce Glucagon (raises blood glucose). Beta cells produce Insulin (lowers blood glucose). This distinction is tested directly in TNPSC.'}
],
pyq:'High — TNPSC Science. Vitamins, deficiency diseases, and hormone-gland matching tested every year.',
summary:'Pituitary=Master gland. Thyroid(T3,T4,iodine needed)→Goitre(deficiency). Adrenal=Adrenaline(fight/flight)+Cortisol. Pancreas: Beta cells=Insulin(lowers glucose), Alpha cells=Glucagon(raises glucose). Diabetes: Type1(no insulin)+Type2(insulin resistance). Vitamins: A(night blindness)+B1(beriberi)+B3(pellagra)+B12(anaemia)+C(scurvy)+D(rickets/osteomalacia)+K(clotting). Iron=anaemia. Iodine=goitre. Samacheer 10th-12th Std.'},

{day:29,topic:'World History: Major Revolutions & Events',
notes:[
{title:'French Revolution (1789)',detail:'Causes: Financial crisis, social inequality (3 Estates). Key events: Fall of Bastille (July 14, 1789 — now French National Day). Declaration of Rights of Man. Execution of Louis XVI (1793). Reign of Terror (Robespierre). Rise of Napoleon Bonaparte. Significance: Spread ideas of Liberty, Equality, Fraternity globally.'},
{title:'Industrial Revolution (18th-19th century)',detail:'Started in Britain (~1760-1840). Steam engine: James Watt (1769, improved). Spinning Jenny: James Hargreaves. Power loom: Edmund Cartwright. Railways: George Stephenson (first steam locomotive "Rocket," 1829). Effects: Urbanization, capitalism, labour movements, pollution, child labour.'},
{title:'World Wars',detail:'World War I (1914-18): Assassination of Franz Ferdinand (June 28, 1914, Sarajevo). Allied Powers vs Central Powers. Treaty of Versailles (1919) — harsh terms on Germany. World War II (1939-45): Germany invaded Poland (Sept 1, 1939). Atomic bombs: Hiroshima (Aug 6, 1945) and Nagasaki (Aug 9, 1945). UN formed October 24, 1945.'},
{title:'Cold War & Decolonization',detail:'Cold War (1947-1991): USA vs USSR. Iron Curtain: Churchill\'s term. Berlin Wall (1961-1989). Cuban Missile Crisis (1962). Dissolution of USSR (December 25, 1991). Non-Aligned Movement (NAM): India, Nehru, Tito, Nasser. Decolonization: Most African/Asian nations independent 1940s-1970s.'}
],
hook:'TNPSC World History Trap: French Revolution=1789(Bastille falls July 14). WWI trigger=assassination of Franz Ferdinand(June 28,1914). WWII starts=Sept 1,1939(Germany invades Poland). Atomic bombs=Hiroshima(Aug6)+Nagasaki(Aug9,1945). UN formed=Oct 24,1945. James Watt=Steam engine improvement(not invention). Steam locomotive(Rocket)=George Stephenson(1829).',
cards:[
{front:'Bastille கோட்டை வீழ்ச்சி — எப்போது? என்ன முக்கியத்துவம்?',back:'July 14, 1789. Symbolic start of French Revolution. Bastille was a royal prison representing royal tyranny. Its storming by Paris mob marks the Revolution\'s beginning. July 14 = French National Day (Bastille Day).'},
{front:'James Watt vs George Stephenson — என்ன கண்டுபிடித்தார்கள்?',back:'James Watt=Improved steam engine (1769). George Stephenson=First practical steam locomotive "Rocket" (1829). Watt≠train. Stephenson=train. Common swap trap.'},
{front:'UN எப்போது நிறுவப்பட்டது? ஏன்?',back:'October 24, 1945. After World War II to prevent future wars. Replaced League of Nations (which failed to prevent WWII). 51 founding members. UN Day=October 24.'}
],
q:[{q:'The immediate cause of World War I was?',options:['German invasion of France','Assassination of Archduke Franz Ferdinand','British declaration of war','Treaty of Versailles'],answer_index:1,explanation:'WWI was triggered by the assassination of Austro-Hungarian Archduke Franz Ferdinand in Sarajevo on June 28, 1914, by Gavrilo Princip (Serbian nationalist). This set off a chain of alliances leading to war.'},
{q:'The United Nations was formed on which date?',options:['September 1, 1945','August 15, 1945','October 24, 1945','January 1, 1946'],answer_index:2,explanation:'UN was officially formed on October 24, 1945, when the UN Charter was ratified by the required number of nations. October 24 is celebrated as UN Day. The San Francisco Conference drafted the UN Charter in June 1945.'}
],
pyq:'Medium-High — TNPSC World History tested in Unit 8 section. Key dates and causes.',
summary:'French Revolution(1789): Bastille(July14)+Louis XVI executed+Napoleon rose. Industrial Revolution(UK,1760s-1840s): James Watt(steam engine)+Stephenson(Rocket locomotive,1829)+Hargreaves(Spinning Jenny). WWI(1914-18): Franz Ferdinand assassination(June28,1914,Sarajevo). Treaty of Versailles(1919). WWII(1939-45): Poland(Sep1,1939)+Hiroshima(Aug6)+Nagasaki(Aug9,1945)+UN(Oct24,1945). Cold War(1947-1991). NAM=Nehru+Tito+Nasser.'},

{day:30,topic:'General Knowledge: Awards, Sports & India Firsts',
notes:[
{title:'Major National Awards',detail:'Bharat Ratna: Highest civilian award. Given since 1954. Can be given posthumously. Not more than 3 per year usually. Padma Awards: Padma Vibhushan (2nd highest), Padma Bhushan (3rd), Padma Shri (4th). Gallantry: Param Vir Chakra (highest wartime), Ashok Chakra (highest peacetime). National Film Awards: Best Film, Best Actor, Best Actress.'},
{title:'Sports Awards',detail:'Rajiv Gandhi Khel Ratna (now Major Dhyan Chand Khel Ratna): Highest sports honor. Arjuna Award: Outstanding performance (4 years). Dronacharya Award: Best coaches. Dhyan Chand Award: Lifetime achievement in sports. Tendulkar Award: Para-sports (since 2021). Olympic: Gold, Silver, Bronze medals.'},
{title:'India Firsts',detail:'First PM: Jawaharlal Nehru. First President: Dr. Rajendra Prasad. First Indian Governor-General: C. Rajagopalachari (1948). First CJI: H.J. Kania. First woman PM: Indira Gandhi (1966). First woman President: Pratibha Patil (2007). First IAS Officer: Satyendra Nath Tagore (1863). First Nobel Laureate: Rabindranath Tagore (1913, Literature).'},
{title:'Tamil Nadu Firsts & Records',detail:'First woman CM of any Indian state: J. Jayalalithaa (Tamil Nadu). Highest peak in TN: Doddabetta (2637m, Nilgiris). Longest coastline in south India: Tamil Nadu. Chennai=India\'s automobile capital. Tirupur=Knitwear export capital. Kancheepuram=Silk saree capital. Madurai=Temple city. Coimbatore=Manchester of South India.'}
],
hook:'TNPSC GK Trap: First Indian Governor-General=Rajagopalachari(NOT Nehru or Prasad). First woman President=Pratibha Patil(2007,NOT Indira Gandhi). Indira Gandhi=First woman PM(1966). Param Vir Chakra=highest WARTIME. Ashok Chakra=highest PEACETIME gallantry. Bharat Ratna can be given to foreigners (Nelson Mandela,1990; Mother Teresa,1980).',
cards:[
{front:'भारत रत्न — India\'s highest civilian award — எப்போது தொடங்கியது?',back:'1954. Can be given posthumously (e.g., Lal Bahadur Shastri, BR Ambedkar). Maximum 3 per year usually. Can be given to foreigners (Nelson Mandela 1990, Mother Teresa 1980).'},
{front:'Param Vir Chakra vs Ashok Chakra வேறுபாடு?',back:'Param Vir Chakra=Highest gallantry award WARTIME (in face of enemy). Ashok Chakra=Highest gallantry award PEACETIME. Mahavir Chakra=2nd highest wartime. Kirti Chakra=2nd highest peacetime.'},
{front:'India\'s first woman Prime Minister யார்? எந்த ஆண்டு?',back:'Indira Gandhi. 1966 (first term). Also served 1980-1984. Assassinated October 31, 1984. First woman President=Pratibha Patil (2007-2012).'}
],
q:[{q:'Who was the first Indian to receive the Nobel Prize, and for what?',options:['CV Raman — Physics','Rabindranath Tagore — Literature','Mother Teresa — Peace','Amartya Sen — Economics'],answer_index:1,explanation:'Rabindranath Tagore was the first Indian to win a Nobel Prize — in Literature (1913) for "Gitanjali." CV Raman won Nobel in Physics (1930). Mother Teresa won Nobel Peace Prize (1979) — she was Indian citizen but of Albanian origin.'},
{q:'Which state of India has the longest coastline?',options:['Tamil Nadu','Gujarat','Andhra Pradesh','Maharashtra'],answer_index:1,explanation:'Gujarat has the longest coastline in India (~1600 km) due to its irregular peninsular shape with Gulf of Kutch and Gulf of Khambhat. Andhra Pradesh has the longest mainland coastline. Tamil Nadu has 1,076 km (3rd). This distinction between total vs mainland coastline is a classic trap.'}
],
pyq:'Very High — GK questions appear in every TNPSC paper across all groups.',
summary:'Bharat Ratna(1954,highest civilian)+Padma Vibhushan+Bhushan+Shri. Param Vir Chakra(wartime,highest)+Ashok Chakra(peacetime,highest). Rajiv Gandhi/Major Dhyan Chand Khel Ratna=highest sports. Firsts: Nehru(PM)+Rajendra Prasad(President)+Rajagopalachari(Indian Gov-Gen,1948)+Indira Gandhi(woman PM,1966)+Pratibha Patil(woman President,2007)+Tagore(Nobel,1913). Gujarat=longest coastline. Samacheer General Studies.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏛️ TNPSC Samacheer Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Revision Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC GK: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC GK '+d.topic),why:'General knowledge coaching.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 26-30 COMPLETE');
}
push();
