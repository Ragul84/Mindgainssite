require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:22,topic:'UPSC History: Indus Valley Civilization & Vedic Age',
intro:`Today we travel back to the 'Dawn of Indian Civilization'. We start with the Indus Valley Civilization (IVC)—one of the world's first urban civilizations, known for its grid-pattern cities and drainage systems. We then transition to the Vedic Age, which laid the spiritual and social foundations of India. For a UPSC aspirant, the shift from the 'Urban' IVC to the 'Rural/Pastoral' Vedic culture is a critical conceptual bridge. Focus on the sites, the archaeological finds, and the evolution of social structures from Early to Late Vedic periods.`,
notes:[
{title:'Indus Valley Civilization (2500–1750 BCE)',detail:'Urban features: Grid system, burnt bricks, drainage, Citadel. Major Sites: Harappa (Cemetery R37), Mohenjo-daro (Great Bath), Lothal (Dockyard), Dholavira (Water reservoir, 3-tier city), Rakhigarhi (Largest site). Trade: Seals (Steatite), Beads, Lapis Lazuli (from Afghanistan). Script: Boustrophedon (undeciphered). Religion: Mother Goddess, Pashupati Seal, Peepal tree.'},
{title:'Early Vedic Period (1500–1000 BCE)',detail:'Society: Tribal (Jana), Pastoral. Main wealth: Cow (Gau). Political: Sabha & Samiti (assemblies). Religion: Natural forces (Indra-Rain, Agni-Fire, Varuna-Water). No idols or temples. Rig Veda: Oldest, contains Gayatri Mantra.'},
{title:'Later Vedic Period (1000–600 BCE)',detail:'Society: Sedentary agriculture. Rise of Kingdoms (Janapadas). Varna system becomes hereditary. Status of women declines. Rise of rituals/sacrifices. New Gods: Prajapati (Creator), Vishnu, Rudra. Sama, Yajur, Atharva Vedas composed.'},
{title:'Archaeological Cultures',detail:'IVC: Ochre Coloured Pottery (OCP) in some parts. Early Vedic: Painted Grey Ware (PGW). Later Vedic: Northern Black Polished Ware (NBPW) begins towards the end.'},
{title:'Key Terms (Terminology)',detail:'Gavisthi: Search for cows (War). Duhitri: Daughter (Milker of cow). Bali: Voluntary offering (later compulsory tax). Kula: Family. Gramani: Village head.'}
],
cards:[
{front:'Which IVC site had a Dockyard?',back:'Lothal (Gujarat).'},
{front:'What is the "Sabha" and "Samiti"?',back:'Tribal assemblies of the Early Vedic period. Sabha was for elders, Samiti for the general folk.'},
{front:'Oldest Veda?',back:'Rig Veda.'},
{front:'IVC site with 3-part city division?',back:'Dholavira.'},
{front:'Main wealth in Rig Vedic society?',back:'Cattle/Cow (Gau).'}
],
q:[
{q:'Which of the following Indus Valley sites is known for its advanced water management system?',options:['Harappa','Mohenjo-daro','Lothal','Dholavira'],ai:3,exp:'Dholavira is famous for its elaborate series of reservoirs and water harvesting systems.'},
{q:'The "Battle of Ten Kings" (Dasrajan) was fought on the banks of which river?',options:['Saraswati','Indus','Parushni (Ravi)','Vitasta (Jhelum)'],ai:2,exp:'This battle mentioned in the Rig Veda was fought on the banks of the Ravi (Parushni).'},
{q:'In the Later Vedic period, the term "Bali" referred to:',options:['A ritual sacrifice','A mandatory tax paid to the King','A type of cattle','A tribal assembly'],ai:1,exp:'In the Early Vedic period it was voluntary; in the Later Vedic period it became a mandatory tax.'},
{q:'Which of the following animals was NOT known to the Indus Valley people?',options:['Bull','Elephant','Horse','Tiger'],ai:2,exp:'While remains have been found at Surkotada, the Horse was not a commonly used or well-integrated animal in IVC culture compared to the Vedic period.'}
],
hook:'Lothal=Dockyard. Dholavira=Water. Rig Veda=Oldest. Early Vedic=Pastoral. Late Vedic=Kingdoms/Iron. Terminology is UPSC gold.',
summary:'Features of IVC urbanism. Major archaeological sites and finds. Transition from Early to Later Vedic society. Vedic literature and key terminology.'},

{day:23,topic:'UPSC History: Mahajanapadas, Buddhism & Jainism',
intro:`Today we study the 'Intellectual Revolution' of the 6th Century BCE. This was the time of the 'Second Urbanization' and the rise of 16 great kingdoms (Mahajanapadas). More importantly, it was a period of deep questioning that led to the birth of Buddhism and Jainism—two heterodox sects that challenged the Vedic orthodoxy. For UPSC, mastering the doctrines of Buddha and Mahavira, their symbols, the councils, and the royal patrons is non-negotiable. This is one of the most high-frequency topics in the entire Prelims syllabus.`,
notes:[
{title:'The 16 Mahajanapadas',detail:'Magadha emerged as the most powerful. Key dynasties: Haryanka (Bimbisara, Ajatashatru), Shishunaga, Nanda (Mahapadma Nanda). Causes of Magadha\'s rise: Iron deposits, fertile land, elephants in army, strategic capitals (Rajgir, Pataliputra).'},
{title:'Buddhism: The Middle Path',detail:'Gautama Buddha (Lumbini, 563 BCE). Four Noble Truths. Eightfold Path (Ashtangika Marga). Concept of Nirvana. No God/Soul (Anatta). Councils: 1st (Rajgir-Ajatashatru), 2nd (Vaishali-Kalashoka), 3rd (Pataliputra-Ashoka), 4th (Kashmir-Kanishka).'},
{title:'Jainism: Triratna',detail:'Vardhamana Mahavira (24th Tirthankara). Five Vows (Ahimsa, Satya, Asteya, Aparigraha, Brahmacharya). Syadvada (theory of relativity). Extreme penance. Sects: Digambara (sky-clad), Shvetambara (white-clad). Councils: 1st (Pataliputra), 2nd (Vallabhi).'},
{title:'Key Symbols & Events',detail:'Buddha: Birth (Lotus/Bull), Renunciation (Horse), Enlightenment (Bodhi tree), First Sermon (Wheel), Death (Stupa).'},
{title:'Art & Culture Link',detail:'Stupa architecture (Sanchi), Chaityas (Prayer halls), Viharas (Monasteries). Gandhara, Mathura, and Amravati schools of art.'}
],
cards:[
{front:'Where did Buddha deliver his first sermon?',back:'Sarnath (Deer Park). This event is called "Dharmachakrapravartana".'},
{front:'What are the "Triratnas" of Jainism?',back:'Right Faith, Right Knowledge, Right Conduct.'},
{front:'Who presided over the 1st Buddhist Council?',back:'Mahakassapa (under Ajatashatru).'},
{front:'Language of Buddhist scriptures?',back:'Pali. (Jainism used Prakrit).'},
{front:'Capital of Magadha during Mauryan times?',back:'Pataliputra.'}
],
q:[
{q:'Which of the following is NOT one of the Four Noble Truths of Buddhism?',options:['Life is full of suffering','Suffering is caused by desire','Suffering can be ended','Existence of an eternal soul'],ai:3,exp:'Buddhism follows the concept of Anatta (non-soul).'},
{q:'The concept of "Anekantavada" (many-sidedness of reality) is a core doctrine of:',options:['Buddhism','Jainism','Sikhism','Vaishnavism'],ai:1,exp:'Anekantavada and Syadvada are key Jain philosophical concepts.'},
{q:'The 3rd Buddhist Council was held during the reign of:',options:['Ajatashatru','Kalashoka','Ashoka','Kanishka'],ai:2,exp:'The 3rd Council was held at Pataliputra under the patronage of Ashoka.'},
{q:'The site of Lumbini, the birthplace of Buddha, is located in present-day:',options:['India','Nepal','Bhutan','Sri Lanka'],ai:1,exp:'Lumbini is in the Terai region of Nepal.'}
],
hook:'Buddha=Middle Path (Pali). Mahavira=Extreme Penance (Prakrit). 4 Councils (R-V-P-K). Magadha=Iron+Elephants. Art=Stupas/Chaityas.',
summary:'Rise of Mahajanapadas and Magadha. Doctrines and history of Buddhism and Jainism. Buddhist councils and patrons. Comparison between the two faiths.'},

{day:24,topic:'UPSC History: Mauryan Empire & Ashokan Dhamma',
intro:`Today we study the 'First Pan-Indian Empire'—the Mauryas. From the military genius of Chandragupta Maurya and the statecraft of Chanakya (Arthashastra) to the spiritual transformation of Ashoka, the Mauryas unified India like never before. We focus specifically on 'Ashokan Dhamma'—not a religion, but a code of conduct—and his Edicts, which provide a window into Mauryan administration and society. For UPSC, the Mauryan Art (Pillars, Stupas) and the administrative machinery are high-priority areas.`,
notes:[
{title:'Mauryan Expansion',detail:'Chandragupta Maurya (321 BCE) with Chanakya\'s help defeated the Nandas and Seleucus Nicator. Bindusara expanded to the south. Ashoka (273–232 BCE) completed the empire by conquering Kalinga (261 BCE).'},
{title:'Mauryan Administration',detail:'Highly centralized. Saptanga Theory (King, Amatya, Janapada, Durga, Kosha, Danda, Mitra). Important officers: Samaharta (Tax), Sannidhata (Treasury). Spy system (Gudha Purushas).'},
{title:'Ashokan Dhamma',detail:'Following the Kalinga war, Ashoka replaced Bherighosha (War drum) with Dhammaghosha (Sound of Dhamma). Dhamma principles: Respect to elders, tolerance towards all sects, non-violence, social responsibility. Spread via Dhamma Mahamatras.'},
{title:'Edicts & Inscriptions',detail:'Major Rock Edicts (14): XIII mentions Kalinga war. Pillar Edicts (7). Languages: Prakrit (mostly), Greek, Aramaic. Scripts: Brahmi (mostly), Kharosthi (NW India). James Prinsep deciphered Brahmi in 1837.'},
{title:'Mauryan Art & Architecture',detail:'Pillars: Monolithic, polished, animals on top (Sarnath Lion Capital). Stupas: Sanchi Stupa. Caves: Barabar Caves (donated to Ajivikas). First stone architecture on a large scale.'}
],
cards:[
{front:'Who wrote the "Arthashastra"?',back:'Chanakya (Kautilya). It is a treatise on statecraft and economics.'},
{front:'Which script is written from right to left?',back:'Kharosthi (used in Ashokan edicts in NW India).'},
{front:'Major Rock Edict XIII—why is it famous?',back:'It describes the Kalinga War and Ashoka\'s change of heart.'},
{front:'Who deciphered the Ashokan inscriptions?',back:'James Prinsep (in 1837).'},
{front:'Megasthenes—who was he and what did he write?',back:'Greek ambassador to Chandragupta Maurya\'s court. He wrote "Indika".'}
],
q:[
{q:'In Mauryan administration, the officer responsible for "Revenue Collection" was called:',options:['Samaharta','Sannidhata','Amatya','Gramani'],ai:0,exp:'Samaharta was the collector-general of revenue.'},
{q:'Ashoka\'s policy of "Dhamma" is primarily mentioned in which of the following?',options:['Minor Rock Edict I','Major Rock Edict XIII','Pillar Edict VII','Saranath Inscription'],ai:1,exp:'While mentioned in many, Major Rock Edict XIII is crucial for the transition to Dhamma after Kalinga.'},
{q:'The "Barabar Caves" were donated by Ashoka to which sect?',options:['Buddhists','Jains','Ajivikas','Brahmins'],ai:2,exp:'Ashoka and his grandson Dasharatha donated these caves in Bihar to the Ajivika sect.'},
{q:'According to Megasthenes, Mauryan society was divided into how many castes/classes?',options:['Four','Five','Seven','Ten'],ai:2,exp:'Megasthenes mentioned 7 classes (Philosophers, Farmers, Soldiers, etc.), which differed from the traditional 4-varna system.'}
],
hook:'Mauryas=1st Empire. Arthashastra=Statecraft. Indika=Megasthenes. Ashoka=Dhamma (non-religion). Brahmi=Prinsep (1837). Pillars=Monolithic.',
summary:'Mauryan expansion and administration. Ashoka\'s Dhamma and Edicts. Mauryan art (Pillars/Stupas). Foreign accounts (Megasthenes). Decline of the empire.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'upsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Very High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🏔️ UPSC History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'History Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'UPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('UPSC Ancient History '+d.topic),why:'Crucial for Art & Culture and conceptual history.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'upsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ UPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('UPSC Days 22-24 v2 COMPLETE');
}
push();
