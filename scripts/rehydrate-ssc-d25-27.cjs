require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:25,topic:'SSC English: Articles & Prepositions — The Connectors',
intro:`Today we study the 'Small Words' that cause 'Big Errors'. Articles (A, An, The) and Prepositions (In, On, At, To, With) are the most frequently tested areas in SSC. Do you know why it's 'An honest man' but 'A university'? Or the difference between 'Beside' and 'Besides'? Toppers don't just rely on 'sounding right'; they memorize the 'Fixed Prepositions' (e.g., Interested IN, Fond OF, Congratulate ON). Let's master these connectors today.`,
notes:[
{title:'Articles: A vs An',detail:'Based on VOWEL SOUND, not the letter. 1. AN: Honest (H silent), Hour, MLA (starts with M-sound), Umbrella. 2. A: University (Y-sound), Union, One-eyed man (W-sound).'},
{title:'The Definite Article (The)',detail:'Used for: Rivers, Oceans, Mountains (ranges), Holy books, Unique things (Sun, Moon), Superlatives (The best), and with "The more... the more" constructions.'},
{title:'Beside vs Besides',detail:'BESIDE: By the side of (He sat beside me). BESIDES: In addition to (Besides English, he knows Tamil).'},
{title:'Between vs Among',detail:'BETWEEN: For 2 things/people. AMONG: For more than 2. Trap: Use "Between" for more than 2 if there is a definite relationship or union (e.g., A treaty between three countries).'},
{title:'Fixed Prepositions (High Frequency)',detail:'Abstain FROM, Accused OF, Agree WITH (person) / TO (proposal), Angry WITH (person) / AT (thing), Congratulate ON (not FOR), Die OF (disease) / FROM (hunger), Fond OF.'}
],
cards:[
{front:'"Honest" - A or An?',back:'An. (Vowel sound).'},
{front:'"University" - A or An?',back:'A. (Consonant sound "Y").'},
{front:'Beside vs Besides?',back:'Beside = next to. Besides = in addition to.'},
{front:'Preposition after "Congratulate"?',back:'ON.'},
{front:'Preposition after "Abstain"?',back:'FROM.'}
],
q:[
{q:'He is ____ MLA from our constituency.',options:['a','an','the','no article'],ai:1,exp:'"MLA" starts with a vowel sound (em-el-ay). Correct: an MLA.'},
{q:'I am fond ____ listening to music.',options:['of','to','with','for'],ai:0,exp:'"Fond" is always followed by the fixed preposition "of".'},
{q:'Divide these mangoes ____ the four children.',options:['between','among','in','to'],ai:1,exp:'For more than two people, use "among".'},
{q:'____ you, everyone else was present.',options:['Beside','Besides','By','With'],ai:1,exp:'Meaning "in addition to" or "except". Correct: Besides you...'}
],
hook:'An honest, A university. Congratulate ON. Fond OF. Abstain FROM. Beside=Next to, Besides=Extra. The more... the better.',
summary:'Article rules based on sound. Usage of "The". Distinctions between common prepositions (Beside/Besides, Between/Among). List of essential fixed prepositions for SSC.'},

{day:26,topic:'SSC English: Sentence Correction & Spotting Errors',
intro:`Today we enter the 'Audit Phase'. Sentence Correction and Spotting Errors are where all your grammar rules come together. In SSC, these questions are designed to trick you with 'Parallelism', 'Redundancy', and 'Wrong Word usage'. Do you say 'Return back'? (No, 'Return' is enough!). Do you know that 'Scarcely' is followed by 'When' and not 'Than'? Toppers use the 'Checklist Method' to scan for errors. Let's practice the art of error detection today.`,
notes:[
{title:'Conjunction Pairs (Correlatives)',detail:'1. Neither... nor. 2. Either... or. 3. Not only... but also. 4. Hardley/Scarcely... WHEN (not than). 5. No sooner... THAN (not when/then). 6. Although... YET (or a comma).'},
{title:'Redundancy (Superfluous) Errors',detail:'Words with same meaning used together. 1. Return back (Incorrect). 2. Revert back (Incorrect). 3. Cousin brother/sister (Incorrect - just use "Cousin"). 4. Repeat again (Incorrect).'},
{title:'Rule of Parallelism',detail:'Items in a list must have the same grammatical form. (Correct: I like swimming, dancing, and singing. Incorrect: I like swimming, to dance, and singing).'},
{title:'Placement of "Only"',detail:'"Only" should be placed immediately before the word it modifies. (Correct: I solved only two questions. Incorrect: I only solved two questions).'},
{title:'Unless vs Until',detail:'UNLESS: Refers to condition (if not). UNTIL: Refers to time (up to). Trap: Never use "not" in the clause starting with Unless/Until.'}
],
cards:[
{front:'"No sooner" is followed by?',back:'THAN.'},
{front:'"Hardly" is followed by?',back:'WHEN.'},
{front:'Is "Cousin brother" correct?',back:'No. Just use "Cousin".'},
{front:'What is wrong with "Return back"?',back:'Redundant. "Return" means to come back.'},
{front:'"Unless" vs "Until"?',back:'Unless = condition. Until = time.'}
],
q:[
{q:'No sooner did I reach the station ____ the train left.',options:['when','then','than','that'],ai:2,exp:'"No sooner" is always followed by "than".'},
{q:'He is my cousin brother who lives in Delhi.',options:['He is','my cousin brother','who lives','in Delhi'],ai:1,exp:'"Cousin brother" is incorrect. Just use "Cousin".'},
{q:'I hardly know nothing about him.',options:['I hardly','know nothing','about','him'],ai:1,exp:'"Hardly" is already negative. Using "nothing" makes it a double negative. Correct: I hardly know anything.'},
{q:'Unless you do not work hard, you will not pass.',options:['Unless','you do not','work hard','you will not pass'],ai:1,exp:'"Unless" already means "if not". "Do not" is redundant and incorrect. Correct: Unless you work hard...'}
],
hook:'No sooner...THAN. Hardly...WHEN. No "return back". No "not" with Unless/Until. Parallel structure. Only placement.',
summary:'Correlative conjunction pairs. Identifying redundant expressions. Rule of parallelism in lists. Unless and Until logic. High-frequency error patterns in SSC.'},

{day:27,topic:'SSC English: Vocabulary — Synonyms & Antonyms',
intro:`Today we build your 'Word Power'. Vocabulary accounts for nearly 40% of the SSC English section (Synonyms, Antonyms, Idioms, One-word substitution). You don't need to memorize the dictionary; you need to master 'Context' and 'Root Words'. Knowing roots like 'Bene' (Good), 'Mal' (Bad), or 'Phil' (Love) can help you guess the meaning of 100 new words. Today we focus on the most repeated words in the last 10 years of SSC exams.`,
notes:[
{title:'Root Word Strategy',detail:'1. BENE (Good): Benefit, Benevolent, Benign. 2. MAL (Bad): Malice, Malignant, Malfunction. 3. PHIL (Love): Philanthropy, Bibliophile. 4. MIS (Hate): Misanthrope, Misogyny. 5. THEO (God): Atheist, Theism.'},
{title:'Context Clues',detail:'Read the sentence. If a person is praised, the word must be positive. If they are punished, it\'s negative. This helps in "Fill in the Blanks" and "Cloze Test".'},
{title:'High-Frequency SSC Words (Part 1)',detail:'1. ABANDON (Leave) / RETAIN. 2. ABSTAIN (Refrain) / INDULGE. 3. ADVERSITY (Misfortune) / PROSPERITY. 4. BENEVOLENT (Kind) / MALEVOLENT. 5. CANDID (Frank) / DEVIOUS.'},
{title:'High-Frequency SSC Words (Part 2)',detail:'1. FRUGAL (Economical) / EXTRAVAGANT. 2. GREGARIOUS (Sociable) / INTROVERT. 3. LETHARGIC (Lazy) / ENERGETIC. 4. PLACID (Calm) / TURBULENT. 5. ZENITH (Peak) / NADIR.'},
{title:'One-Word Substitution Anchors',detail:'Egotist (thinks only of self), Altruist (helps others), Infallible (never makes mistake), Polyglot (knows many languages), Contemporary (living at same time).'}
],
cards:[
{front:'Synonym of "Frugal"?',back:'Economical / Thrifty.'},
{front:'Antonym of "Zenith"?',back:'Nadir (the lowest point).'},
{front:'Meaning of "Misanthrope"?',back:'One who hates mankind.'},
{front:'Meaning of "Polyglot"?',back:'One who speaks many languages.'},
{front:'Synonym of "Candid"?',back:'Frank / Honest.'}
],
q:[
{q:'Select the synonym of "ABANDON":',options:['Retain','Leave','Support','Produce'],ai:1,exp:'Abandon means to give up or leave something.'},
{q:'Select the antonym of "BENEVOLENT":',options:['Kind','Miserly','Malevolent','Generous'],ai:2,exp:'Benevolent means kind; Malevolent means wishing evil to others.'},
{q:'A person who helps others generously is called an:',options:['Egoist','Altruist','Introvert','Misanthrope'],ai:1,exp:'Altruist is the one-word substitution for a selflessly helpful person.'},
{q:'Select the synonym of "LETHARGIC":',options:['Active','Energetic','Lazy','Serious'],ai:2,exp:'Lethargic means lacking energy or being lazy.'}
],
hook:'Bene=Good. Mal=Bad. Frugal=Economical. Zenith=Peak, Nadir=Bottom. Phil=Love, Mis=Hate. Altruist=Helper.',
summary:'Root word analysis (Bene, Mal, Phil). Context-based word guessing. Master list of most repeated SSC synonyms and antonyms. Introduction to One-word substitution.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'English Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' vocabulary grammar'),why:'Building word power for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | English',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 25-27 v2 COMPLETE');
}
push();
