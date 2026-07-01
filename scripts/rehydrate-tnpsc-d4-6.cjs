require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:4,topic:'TNPSC General Tamil: தொடர் இலக்கணம் (Syntax)',
intro:`Today we move from words to 'Sentences' (Thodar). In Tamil, a series of words arranged logically to convey a thought is a Thodar. We look at the basic building blocks of a sentence: Ezhuvai (Subject), Payanilai (Predicate), and Seyappaduporul (Object). We also explore different sentence types—Statement, Question, Command, and Emotion. TNPSC often asks you to identify the sentence type or change one type to another. Mastering this ensures you don't make mistakes in the 'Identification' and 'Transformation' questions.`,
notes:[
{title:'Sentence Parts (வாக்கிய உறுப்புகள்)',detail:'1. Ezhuvai (Subject): The doer or the main noun (e.g., "தென்றல்" படித்தாள்). 2. Payanilai (Predicate): The action or state (தென்றல் "படித்தாள்"). 3. Seyappaduporul (Object): The receiver of action (தென்றல் "பாடம்" படித்தாள்).'},
{title:'Types of Sentences (வாக்கிய வகைகள்)',detail:'1. Seithi (Statement): Simple information. 2. Vinai (Question): Ends with ?. 3. Kattalai (Command): Giving orders. 4. Unarchi (Exclamatory): Expresses emotion. 5. Thanvinai (Self-action) vs Piravinai (Caused action). 6. Seivinai (Active) vs Seyappaduvinai (Passive).'},
{title:'Active & Passive (செய்வினை, செயப்பாட்டுவினை)',detail:'Seivinai: Subject is active (e.g., கரிகாலன் கல்லணையைக் கட்டினான்). Seyappaduvinai: Focus on object, uses "பட்டது" suffix (e.g., கல்லணை கரிகாலனால் கட்டப்பட்டது).'},
{title:'Thanvinai & Piravinai (தன்வினை, பிறவினை)',detail:'Thanvinai: Subject does the action (e.g., அவன் படித்தான்). Piravinai: Subject causes someone else to do (e.g., அவன் படிப்பித்தான்). TNPSC loves testing this distinction.'},
{title:'Sentence Connectors',detail:'How words like எனில், ஆதலால், எனினும் are used to combine simple sentences into complex ones.'}
],
cards:[
{front:'What is "எழுவாய்" (Ezhuvai)?',back:'The Subject of the sentence (the doer).'},
{front:'What is "செயப்படுபொருள்" (Seyappaduporul)?',back:'The Object of the sentence (receiver of action).'},
{front:'How to identify Passive Voice (செயப்பாட்டுவினை)?',back:'Look for the suffix "பட்டது" or "பெற்றது" attached to the verb (e.g., செய்யப்பட்டது).'},
{front:'Difference between தன்வினை and பிறவினை?',back:'Thanvinai is doing the action yourself (படித்தான்); Piravinai is causing/making someone else do it (படிப்பித்தான்).'},
{front:'Definition of உணர்ச்சி வாக்கியம் (Exclamatory)?',back:'A sentence expressing strong emotions like wonder, joy, or sorrow (e.g., ஆ! என்ன அழகு!).'}
],
q:[
{q:'"கல்லணை கரிகாலனால் கட்டப்பட்டது" - இது எவ்வகை வாக்கியம்?',options:['செய்வினை','செயப்பாட்டுவினை','தன்வினை','பிறவினை'],ai:1,exp:'It has the "பட்டது" suffix and focuses on the object (Kallanai). This is Passive Voice (Seyappaduvinai).'},
{q:'"அவன் திருந்தினான்" - இது எவ்வகை வாக்கியம்?',options:['தன்வினை','பிறவினை','செய்வினை','உணர்ச்சி'],ai:0,exp:'He corrected himself. This is Thanvinai (Self-action). "அவன் திருத்தினான்" would be Piravinai.'},
{q:'வாக்கியத்தின் இறுதியில் "?" குறி வந்தால் அது எவ்வகை வாக்கியம்?',options:['செய்தி','வினா','கட்டளை','உணர்ச்சி'],ai:1,exp:'A question mark (?) indicates a Vinai (Question) sentence.'},
{q:'"பாடம் படித்தான்" - இதில் எழுவாய் எது?',options:['பாடம்','படித்தான்','அவன் (மறைந்து வந்துள்ளது)','யாரும் இல்லை'],ai:2,exp:'The subject is hidden (அவன்). In many Tamil sentences, Ezhuvai is implied.'}
],
hook:'Seivinai=Active. Seyappaduvinai=Passive (பட்டது). Thanvinai=Self. Piravinai=Caused (வித்தான்/பித்தான்). Subject=Ezhuvai. Predicate=Payanilai.',
summary:'Structure of Tamil sentences. Identification of Subject, Predicate, and Object. Sentence types: Statement, Question, Command, Emotion. Active/Passive and Self/Caused action transformations.'},

{day:5,topic:'TNPSC General Tamil: அணி இலக்கணம் (Figures of Speech)',
intro:`Today we enter the beautiful world of 'Ani Ilakkanam' (Poetics). Ani means 'Jewel' or 'Ornament'. Just as ornaments beautify a person, figures of speech beautify a poem. From the simple 'Uvamai' (Simile) to the complex 'Ega-thesa-uruvakam' (Partial Metaphor), we learn how poets used language to create impact. TNPSC always asks questions on identifying the 'Ani' in a given Kural or poem snippet. Let's master the most common 5 types today.`,
notes:[
{title:'Uvamai Ani (Simile)',detail:'Comparing one thing to another using connecting words (Uvamai-urubu) like போல, புரைய, ஒப்ப, மான. E.g., "மலர் போன்ற பாதம்" (Lotus-like feet).'},
{title:'Uruvaka Ani (Metaphor)',detail:'Treating the object and the comparison as one and the same. No connecting word is used. E.g., "பாத மலர்" (Foot-lotus).'},
{title:'Ega-thesa Uruvaka Ani',detail:'Metaphorizing one part of a comparison but leaving the other part un-metaphorized. A favorite in Thirukkural questions.'},
{title:'Tharkurippetra Ani',detail:'Imputing the poet\'s own feelings or thoughts onto a natural occurrence. E.g., "The flags waved, warning the hero not to enter" (Natural wind vs Poet\'s warning).'},
{title:'Sorkul Pinvarunilai Ani',detail:'When the same word repeats in a poem with the same meaning throughout. Example: Kurals where "அன்பு" or "அறம்" repeats.'}
],
cards:[
{front:'What is "உவமையணி" (Uvamai Ani)?',back:'Simile. Comparing two things using words like "போல" (like).'},
{front:'What is "உருவக அணி" (Uruvaka Ani)?',back:'Metaphor. Stating that one thing IS the other (e.g., "தமிழ் தேன்" - Tamil is honey).'},
{front:'What is the meaning of "அணி" (Ani)?',back:'Ornament or Jewel (அழகு).'},
{front:'Identify the Ani: "மலர் போன்ற பாதம்"?',back:'Uvamai Ani (because of "போன்ற").'},
{front:'Identify the Ani: "பாத மலர்"?',back:'Uruvaka Ani.'}
],
q:[
{q:'"போல, புரைய, ஒப்ப, மான" இவை எவ்வகை உருபுகள்?',options:['வேற்றுமை உருபு','உவம உருபு','சாரியை','இடைச்சொல்'],ai:1,exp:'These are Uvama-urubugal used in Similes (Uvamai Ani).'},
{q:'ஒரு பொருளை மற்றொன்றோடு ஒப்பிட்டுக் கூறுவது எது?',options:['உவமையணி','உருவக அணி','தற்குறிப்பேற்ற அணி','வஞ்சப்புகழ்ச்சி'],ai:0,exp:'Comparing one thing with another is Uvamai Ani.'},
{q:'"அணி" என்ற சொல்லின் பொருள் யாது?',options:['அலங்காரம்','ஆடை','அழகு','அன்பு'],ai:2,exp:'Ani means Beauty/Ornament (அழகு).'},
{q:'கவிஞர் தன் குறிப்பை இயற்கையின் மீது ஏற்றிக் கூறுவது?',options:['உவமையணி','உருவக அணி','தற்குறிப்பேற்ற அணி','பின்வருநிலை'],ai:2,exp:'Tharkurippetra Ani = Imputing one\'s own intention on nature.'}
],
hook:'Ani=Beauty/Ornament. Uvamai=Simile (Uvama-urubu: pola). Uruvakam=Metaphor (A IS B). Tharkurippetra=Poet\'s emotion on nature.',
summary:'Introduction to poetics. Detailed study of Simile, Metaphor, and Partial Metaphor. Identification of Ani in poetry. Poetic repetition types.'},

{day:6,topic:'TNPSC History: Sangam Age & Culture',
intro:`Today we travel back 2000 years to the 'Golden Age' of Tamil culture—The Sangam Period. This was the time of the three great academies (Sangams) in Madurai, where thousands of poets composed masterpieces that still define Tamil identity today. We explore the 'Thinai' system—the classification of land into 5 types—and the literature of 'Ettuthokai' and 'Pattuppattu'. For a TNPSC aspirant, this is the most high-yield history block. Understanding how the Cheras, Cholas, and Pandyas lived is the key to mastering Unit 8.`,
notes:[
{title:'The 3 Sangams (தமிழ் சங்கங்கள்)',detail:'1. Mudhal Sangam (Old Madurai). 2. Idai Sangam (Kapatapuram). 3. Kadai Sangam (Modern Madurai). Kadai Sangam literature is what survives today.'},
{title:'The 5 Thinais (ஐந்திணை)',detail:'Classification of landscape: 1. Kurinji (Mountains). 2. Mullai (Forest). 3. Marutham (Agricultural). 4. Neithal (Coastal). 5. Paalai (Desert). Each has its own deity, people, and occupation.'},
{title:'Pathinen Melkanakku (Major 18)',detail:'Comprises Ettuthokai (8 Anthologies) and Pattuppattu (10 Idyls). Examples: Purananuru (History/Bravery), Akananuru (Love), Maduraikanchi.'},
{title:'The 3 Great Kingdoms (மூவேந்தர்)',detail:'Cheras (Vanji, Palm flower, Bow & Arrow symbol). Cholas (Uraiyur, Fig flower, Tiger symbol, Karikala Chola). Pandyas (Madurai, Neem flower, Fish symbol, Pearl trade).'},
{title:'Sangam Society',detail:'Women were respected (Avvaiyar). Trade with Rome (Arikamedu). Hero stones (Nadukal) for fallen soldiers. Religious diversity (Murugan, Indra, Vishnu).'}
],
cards:[
{front:'How many thinais in Sangam landscape?',back:'5. (Kurinji, Mullai, Marutham, Neithal, Paalai).'},
{front:'Symbol of the Cholas?',back:'Tiger.'},
{front:'What is "எட்டுத்தொகை" (Ettuthokai)?',back:'8 Anthologies. Part of the Major 18 texts (Melkanakku).'},
{front:'Landscape of Marutham (மருதம்)?',back:'Agricultural lands (வயலும் வயல் சார்ந்த இடமும்).'},
{front:'Who was the most famous Chola king of Sangam age?',back:'Karikala Chola (builder of Kallanai).'}
],
q:[
{q:'சங்க காலத்தில் பயன்படுத்தப்பட்ட எழுத்து முறை எது?',options:['வட்டெழுத்து','தமிழ் பிராமி','கிரந்தம்','தேவநாகரி'],ai:1,exp:'Tamil-Brahmi was the script used in Sangam era inscriptions (e.g., Keezhadi).'},
{q:'முல்லை நிலத்திற்குரிய தெய்வம் யார்?',options:['முருகன்','திருமால்','இந்திரன்','வருணன்'],ai:1,exp:'Kurinji-Murugan, Mullai-Thirumal, Marutham-Indran, Neithal-Varunan, Paalai-Kotravai.'},
{q:'"புறநானூறு" எவ்வகை நூல்?',options:['எட்டுத்தொகை','பத்துப்பாட்டு','பதினெண்கீழ்க்கணக்கு','காப்பியம்'],ai:0,exp:'Purananuru is one of the 8 books in Ettuthokai.'},
{q:'பாண்டியர்களின் துறைமுகம் எது?',options:['புகார்','தொண்டி','கொற்கை','முசிறி'],ai:2,exp:'Pandya port was Korkai (famous for pearls). Chola was Puhar. Chera was Musiri/Thondi.'}
],
hook:'5 Thinais. Chola=Tiger. Chera=Bow. Pandya=Fish. Ettuthokai=8 books. Pattuppattu=10 books. Keezhadi=Sangam urban civilization.',
summary:'Overview of the Sangam Era. Geography and the 5 landscapes. Introduction to Sangam Literature (Melkanakku). Political history of Chera, Chola, and Pandya.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Tamil/History Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Exam Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC General Tamil '+d.topic),why:'Samacheer book based content for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | High Yield',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 4-6 v2 COMPLETE');
}
push();
