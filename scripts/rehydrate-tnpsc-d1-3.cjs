require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:1,topic:'TNPSC General Tamil: எழுத்திலக்கணம் (Orthography)',
intro:`Welcome to General Tamil—the most important section for TNPSC (100 marks!). Today we start with the absolute foundation: Eluthu Ilakkanam (Grammar of Letters). Tamil has 247 letters, and TNPSC loves asking about their classification, pronunciation times (Maathirai), and the difference between Mudal Eluthu (Prime letters) and Sarbu Eluthu (Dependent letters). If you master the numbers today—12, 18, 216, 1—you secure the base for all your Tamil grammar questions. Let's decode the Samacheer textbook standards.`,
notes:[
{title:'Tamil Letters: The 247 Map',detail:'Uyir Eluthu (Vowels): 12. Mey Eluthu (Consonants): 18. Uyirmey (Vowel-Consonant): 12 × 18 = 216. Ayutha Eluthu: 1. Total = 247 letters.'},
{title:'Uyir Eluthu (12 Vowels)',detail:'Kuril (Short): 5 (அ, இ, உ, எ, ஒ) - 1 Maathirai. Nedil (Long): 7 (ஆ, ஈ, ஊ, ஏ, ஐ, ஓ, ஔ) - 2 Maathirai. Note: ஐ (Ai) and ஔ (Au) are long vowels.'},
{title:'Mey Eluthu (18 Consonants)',detail:'Vallinam (Hard): 6 (க், ச், ட், த், ப், ற்). Mellinam (Soft): 6 (ங், ஞ், ண், ந், ம், ன்). Idaiyinam (Medium): 6 (ய், ர், ல், வ், ழ், ள்). Pronunciation time = 0.5 Maathirai.'},
{title:'Mudal vs Sarbu Eluthu',detail:'Mudal Eluthu: 12 Uyir + 18 Mey = 30 prime letters. Sarbu Eluthu (Dependent): 10 types including Uyirmey, Ayutham, Uyiralabedai, Otralabedai, Kutriyalugaram, etc. TNPSC frequently asks "How many Sarbu Eluthu types?" — Answer is 10.'},
{title:'Maathirai (Time Measure)',detail:'Short vowel = 1. Long vowel = 2. Consonant/Ayutham = 0.5. Alabedai (Elongation) = varies. Skill: Be able to calculate total Maathirai for a given word like "தமிழ்" (0.5+1+1 = 2.5).'}
],
cards:[
{front:'Total number of Tamil letters?',back:'247. (12 + 18 + 216 + 1).'},
{front:'How many Mudal Eluthukkal (Prime letters)?',back:'30. (12 Uyir + 18 Mey).'},
{front:'Time measure (Maathirai) for a consonant (Mey)?',back:'0.5 Maathirai.'},
{front:'Classification of வல்லினம் (Vallinam)?',back:'க், ச், ட், த், ப், ற். (Hard sounds).'},
{front:'How many types of சார்பெழுத்து (Sarbu Eluthu)?',back:'10 types.'}
],
q:[
{q:'தமிழ் எழுத்துக்கள் மொத்தம் எத்தனை?',options:['216','30','247','18'],ai:2,exp:'Uyir 12 + Mey 18 + Uyirmey 216 + Ayutham 1 = 247.'},
{q:'"ஐ" (Ai) என்ற எழுத்தின் மாத்திரை அளவு என்ன?',options:['1','2','0.5','3'],ai:1,exp:'"ஐ" is a long vowel (Nedil), so it takes 2 Maathirai.'},
{q:'மெய்யெழுத்துக்கள் எத்தனை வகைப்படும்?',options:['2','3','4','5'],ai:1,exp:'3 types: Vallinam, Mellinam, Idaiyinam.'},
{q:'முதலெழுத்துக்களின் எண்ணிக்கை யாது?',options:['12','18','30','10'],ai:2,exp:'Mudal Eluthu = 12 Vowels + 18 Consonants = 30.'}
],
hook:'Total=247. Prime=30. Vowels=12. Consonants=18. Consonant Maathirai=0.5. Long Vowel Maathirai=2. Sarbu Eluthu types=10.',
summary:'Classification of Tamil letters (247). Vowels (Kuril/Nedil), Consonants (Vallinam/Mellinam/Idaiyinam). Concept of Mudal and Sarbu Eluthu. Pronunciation time (Maathirai).'},

{day:2,topic:'TNPSC General Tamil: சொல் இலக்கணம் (Morphology)',
intro:`Yesterday was about letters; today is about 'Words' (Sol). In Tamil, a sound or group of sounds that gives a meaning is a 'Sol'. Words are classified into four main types: Peyarchol (Noun), Vinaichol (Verb), Idaichol (Particle), and Urichol (Qualifier). TNPSC often tests your ability to identify these types in a sentence or match them to their categories. We also look at 'Pagupadam' and 'Pagaipadam'—how words are split into grammatical parts. Let's master the 'Word Map' of Tamil.`,
notes:[
{title:'Types of Sol (4 Main Types)',detail:'1. Peyarchol (Noun): Names of person, place, thing, time, part, quality. 2. Vinaichol (Verb): Expresses action. 3. Idaichol (Particle): Words that connect nouns/verbs (e.g., உம், மற்று, ஏ). 4. Urichol (Qualifier): Words that describe quality of noun/verb (e.g., சால, உரு, தவ).'},
{title:'Ilakkanam vs Ilakkiyam Classification',detail:'Grammar view: Peyar, Vinai, Idai, Uri. Literature view: Iyarcol (common), Thiricol (poetic), Thiseicol (regional), Vadacol (Sanskrit origin).'},
{title:'Pagupadam (Splittable Word)',detail:'A word that can be split into parts (Pakuthi, Vikuthi, Idainilai, Santhi, Saariyai, Vikaram). There are two types: Peyar Pagupadam and Vinai Pagupadam.'},
{title:'Pagaipadam (Unsplittable)',detail:'Root words that cannot be split further without losing meaning (e.g., மரம், கல்).'},
{title:'Thinai & Paal',detail:'Thinai: Uyar-thinai (Humans/Gods) and Ah-rinai (Animals/Objects). Paal: 5 types (Aan-paal, Pen-paal, Palar-paal for Humans; Ondran-paal, Palavin-paal for Ah-rinai).'}
],
cards:[
{front:'What is "பெயர்ச்சொல்" (Peyarchol)?',back:'Noun. It names a person, place, thing, time, etc.'},
{front:'What is "உரிச்சொல்" (Urichol)?',back:'Qualifier/Adjective/Adverb. It adds more meaning to nouns or verbs (e.g., மாநகரம் - "மா" is urichol).'},
{front:'How many parts in "பகுபதம்" (Pagupadam)?',back:'6 parts: பகுதி (root), விகுதி (suffix), இடைநிலை (infix), சந்தி, சாரியை, விகாரம்.'},
{front:'Definition of "அஃறிணை" (Ah-rinai)?',back:'Objects and creatures other than humans and gods (Animals, plants, stones, etc.).'},
{front:'Example of "இடைச்சொல்" (Idaichol)?',back:'உம், ஏ, மற்று, ஐ. (Connectors).'}
],
q:[
{q:'"சால, உரு, தவ, நனி" இவை எவ்வகைச் சொற்கள்?',options:['பெயர்ச்சொல்','வினைச்சொல்','இடைச்சொல்','உரிச்சொல்'],ai:3,exp:'These are Urichol (Qualifiers) used to intensify meanings.'},
{q:'சொல் இலக்கண அடிப்படையில் சொற்கள் எத்தனை வகைப்படும்?',options:['2','3','4','5'],ai:2,exp:'4 types: Peyar, Vinai, Idai, Uri.'},
{q:'பகுபத உறுப்புகள் எத்தனை வகைப்படும்?',options:['4','5','6','8'],ai:2,exp:'6 parts: Pakuthi, Vikuthi, Idainilai, Santhi, Saariyai, Vikaram.'},
{q:'மரம், கல், உண் - இவை எவ்வகைச் சொற்கள்?',options:['பகுபதம்','பகாப்பதம்','இடைச்சொல்','உரிச்சொல்'],ai:1,exp:'These are Pagaipadam (cannot be split).'}
],
hook:'4 word types: Peyar, Vinai, Idai, Uri. Pagupadam has 6 parts. Pagaipadam cannot be split. Urichol=intensifiers. Ah-rinai=Non-humans.',
summary:'Classification of words (Sol). The four types: Noun, Verb, Particle, Qualifier. Literary classification of words. Structure of Pagupadam and Pagaipadam.'},

{day:3,topic:'TNPSC General Tamil: வேற்றுமை (Case Markers)',
intro:`Today we master 'Vetrumai' (Case Markers). In Tamil, suffixes are added to nouns to change their meaning or relationship with other words in a sentence—this is called Vetrumai. There are exactly 8 cases in Tamil. The 1st and 8th cases have no markers, while cases 2 to 7 have specific suffixes (உருபுகள்) like ஐ, ஆல், கு, இன், அது, கண். TNPSC frequently asks you to identify the case of a word or match the suffix to its case number. Let's lock this table today.`,
notes:[
{title:'The 8 Cases (வேற்றுமை)',detail:'1. Mudhal Vetrumai (Ezhuvai): No marker. The noun acts as subject. 2. Irandaam: "ஐ" (e.g., அவனை). 3. Moondraam: "ஆல், ஆன், ஒடு, ஓடு". 4. Naankaam: "கு" (e.g., அவனுக்கு). 5. Iyindhaam: "இன், இல்". 6. Aaraam: "அது, ஆது, அ". 7. Ezhaam: "கண்" (Place/Time). 8. Ettaam (Vili): No marker. Used for calling/addressing.'},
{title:'Case Meanings (பொருள்)',detail:'2nd (ஐ): Action done to the object. 3rd (ஆல்): Tool or reason. 4th (கு): Destination, purpose, or recipient. 5th (இன்): Comparison or separation. 6th (அது): Possession. 7th (கண்): Location or time.'},
{title:'Vetrumai Urupugal Table',detail:'2-ஐ, 3-ஆல், 4-கு, 5-இன், 6-அது, 7-கண். Memory trick: "ஐ, ஆல், கு, இன், அது, கண்". Recite this sequence daily.'},
{title:'Transitive/Intransitive Suffixes',detail:'The suffix changes how the noun interacts. "ராமன் பார்த்தான்" (Case 1) vs "ராமனைப் பார்த்தான்" (Case 2 - Raman is the object).'},
{title:'Vili Vetrumai (Case 8)',detail:'Used to call someone (e.g., "மகன்" becomes "மகனே"). It involves changing the ending of the noun to address it.'}
],
cards:[
{front:'Case marker for 2nd case (இரண்டாம் வேற்றுமை)?',back:'ஐ.'},
{front:'Case marker for 4th case (நான்காம் வேற்றுமை)?',back:'கு.'},
{front:'Which cases have no marker (உருபு)?',back:'1st case (எழுவாய்) and 8th case (விளி).'},
{front:'Marker for 6th case (ஆறாம் வேற்றுமை)?',back:'அது, ஆது, அ.'},
{front:'What is the marker sequence for cases 2 to 7?',back:'ஐ, ஆல், கு, இன், அது, கண்.'}
],
q:[
{q:'நான்காம் வேற்றுமை உருபு எது?',options:['ஐ','ஆல்','கு','இன்'],ai:2,exp:'The sequence is ஐ(2), ஆல்(3), கு(4), இன்(5).'},
{q:'வேற்றுமை எத்தனை வகைப்படும்?',options:['6','7','8','10'],ai:2,exp:'8 types total.'},
{q:'"ஐ, ஆல், கு, இன், அது, கண்" - இதில் ஐந்தாம் வேற்றுமை உருபு எது?',options:['ஆல்','கு','இன்','அது'],ai:2,exp:'2nd=ஐ, 3rd=ஆல், 4th=கு, 5th=இன்.'},
{q:'எந்த வேற்றுமைக்கு உருபு இல்லை?',options:['இரண்டாம்','நான்காம்','எழுவாய்','ஆறாம்'],ai:2,exp:'1st case (Ezhuvai) and 8th case (Vili) have no markers.'}
],
hook:'2-ஐ, 3-ஆல், 4-கு, 5-இன், 6-அது, 7-கண். 1st & 8th=No marker. Case 8=Calling. Case 2=Object marker.',
summary:'Definition of Vetrumai. The eight cases and their markers (உருபுகள்). Meanings and applications of each case in sentence formation.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'tnpsc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'🎯 TNPSC Tamil Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Tamil Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'TNPSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('TNPSC General Tamil '+d.topic),why:'Standard school book grammar for TNPSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | Critical Tamil',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'tnpsc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ TNPSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('TNPSC Days 1-3 v2 COMPLETE');
}
push();
