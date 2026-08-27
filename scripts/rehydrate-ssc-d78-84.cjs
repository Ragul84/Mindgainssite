require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:78,topic:'SSC English: Active & Passive Voice',
intro:`Today we study the 'Voice of Action'. Active and Passive voice questions are the most scoring part of SSC (especially Tier 2). The key is to never change the 'Tense' of the sentence. From 'Simple Present' to 'Modals'—the rules are fixed. Do you know how to change an 'Imperative' sentence into passive? Let's master the voices today.`,
notes:[
{title:'General Rule',detail:'Active: Subject + Verb + Object. Passive: Object + Be-form + V3 + by + Subject. (Note: Tense NEVER changes).'},
{title:'Tense Conversion',detail:'1. Present Simple: is/am/are + V3. 2. Past Simple: was/were + V3. 3. Continuous: being + V3. 4. Perfect: been + V3.'},
{title:'Interrogative Sentences',detail:'Who changes to By whom. Does/Do changes to Is/Are. (e.g., "Who did this?" -> "By whom was this done?").'},
{title:'Imperative Sentences',detail:'Command/Request. Use "Let + Object + be + V3" or "You are requested/ordered to...". (e.g., "Open the door" -> "Let the door be opened").'},
{title:'Modals',detail:'Can/May/Should + be + V3. (e.g., "I can do it" -> "It can be done by me").'}
],
cards:[
{front:'Does Tense change in Voice?',back:'NO.'},
{front:'"Who" changes to?',back:'"By whom".'},
{front:'Passive of "He is playing football"?',back:'"Football is being played by him".'},
{front:'Passive of "Shut the door"?',back:'"Let the door be shut".'},
{front:'V3 is mandatory in Passive?',back:'YES.'}
],
q:[
{q:'Change to Passive: "The boy laughed at the beggar."',options:['The beggar was laughed at by the boy','The beggar was laughed by the boy','The beggar is laughed at by the boy','The beggar laughed at the boy'],ai:0,exp:'Simple past "laughed" becomes "was laughed at". Preposition "at" must stay with the verb.'},
{q:'Change to Passive: "Who wrote this book?"',options:['By whom this book was written?','By whom was this book written?','By whom is this book written?','This book was written by whom?'],ai:1,exp:'Interrogative structure requires verb before subject: By whom + was + book + written.'},
{q:'Change to Passive: "They are painting the house."',options:['The house is painted by them','The house is being painted by them','The house was being painted by them','The house has been painted by them'],ai:1,exp:'Continuous tense adds "being".'},
{q:'Change to Passive: "Open the window."',options:['The window must be opened','Let the window be opened','The window is opened','Open the window by you'],ai:1,exp:'Standard imperative passive.'}
],
hook:'Voice=No Tense change. V3 is king. Who=By whom. Being=Continuous. Been=Perfect. Let=Imperative.',
summary:'Fundamental rules of voice conversion. Detailed tense-wise passive structures. Handling interrogative and imperative sentences. Common traps in SSC voice questions.'},

{day:79,topic:'SSC English: Direct & Indirect Speech',
intro:`Today we study the 'Art of Narration'. Unlike Voice, in Narration (Indirect Speech), the 'Tense' almost always changes (backshifts). From 'Said' to 'Told' and 'Today' to 'That day'—the conversions are systematic. Do you know why 'Universal Truths' don't change tense? Let's master the reported speech today.`,
notes:[
{title:'Reporting Verb',detail:'If reporting verb is in Past (Said), the tense inside changes. Said -> Said. Said to -> Told. (Exception: Universal Truths/Facts).'},
{title:'Tense Backshift',detail:'Present Simple -> Past Simple. Present Cont -> Past Cont. Present Perfect -> Past Perfect. Past Simple -> Past Perfect.'},
{title:'Pronoun Change (SON)',detail:'1st Person (I/We) -> Subject. 2nd Person (You) -> Object. 3rd Person (He/She) -> No Change.'},
{title:'Time & Place words',detail:'Today -> That day. Tomorrow -> The next day. Yesterday -> The previous day. Now -> Then. Here -> There.'},
{title:'Interrogative',detail:'Use "if/whether" for Yes/No questions. No "that" used with Wh-questions. (e.g., He said, "Where are you going?" -> He asked where I was going).'}
],
cards:[
{front:'Does Tense change in Narration?',back:'YES (Backshift).'},
{front:'"Said to" changes to?',back:'Told.'},
{front:'"Today" changes to?',back:'"That day".'},
{front:'"Yesterday" changes to?',back:'"The previous day".'},
{front:'Does "Universal Truth" change tense?',back:'NO.'}
],
q:[
{q:'Change to Indirect: He said, "I am playing."',options:['He said that he is playing','He said that he was playing','He told he was playing','He said that I was playing'],ai:1,exp:'Said remains said; "am playing" becomes "was playing".'},
{q:'Change to Indirect: She said to me, "Where do you live?"',options:['She asked me where I lived','She told me where I lived','She asked me where did I live','She asked me if I lived there'],ai:0,exp:'No "that" or "if" with Wh-words. Question form becomes assertive (I lived).'},
{q:'Change to Indirect: The teacher said, "The Earth revolves around the Sun."',options:['The teacher said that the Earth revolved around the Sun','The teacher said that the Earth revolves around the Sun','The teacher told that the Earth revolves around the Sun','None'],ai:1,exp:'Universal truth - No tense change.'},
{q:'Change to Indirect: He said, "I will go tomorrow."',options:['He said that he will go tomorrow','He said that he would go the next day','He told he would go the next day','He said he should go tomorrow'],ai:1,exp:'Will -> Would. Tomorrow -> The next day.'}
],
hook:'Narration=Tense backshift. SON rule. Today=That day. Said to=Told. Wh=No that. Universal truth=No change.',
summary:'Core principles of direct to indirect conversion. Rules for tense backshifting and pronoun changes. Handling special cases like universal truths and interrogative sentences.'},

{day:80,topic:'SSC English: Sentence Improvement & Cloze Test',
intro:`Today we study the 'Logic of Context'. Sentence Improvement tests your grammar in action, while Cloze Test (fill in the blanks) tests your vocabulary and reading flow. In SSC, 'Phrasal Verbs' and 'Subject-Verb Agreement' are the primary targets. Do you know the difference between 'Beside' and 'Besides'? Let's master the flow today.`,
notes:[
{title:'Subject-Verb Agreement',detail:'Singular sub = Singular verb. (e.g., "Each of the boys IS"). "Neither...nor" takes verb according to second subject.'},
{title:'Confusing Words',detail:'Beside (By the side of) vs Besides (In addition to). Affect (Verb) vs Effect (Noun). Lose vs Loose.'},
{title:'Cloze Test Strategy',detail:'1. Read the whole passage first. 2. Understand the tone (Positive/Negative). 3. Look for clues in the next sentence. 4. Check for fixed collocations.'},
{title:'Conditional Sentences',detail:'1. If + Present, Will + V1. 2. If + Past, Would + V1. 3. If + Past Perfect, Would have + V3. (SSC Favorite).'},
{title:'Parallelism',detail:'Structure of items in a list should be same. (e.g., "Swimming, dancing and to sing" is WRONG. Use "singing").'}
],
cards:[
{front:'"Beside" vs "Besides"?',back:'Beside=Near. Besides=In addition to.'},
{front:'"Each of" takes ? verb?',back:'Singular.'},
{front:'If I had seen him, I ? (greet)?',back:'would have greeted him.'},
{front:'"Affect" is a ?',back:'Verb.'},
{front:'"Neither A nor B" verb follows?',back:'B (the closer subject).'}
],
q:[
{q:'Improve: "Each of the students have done their work."',options:['students has done their work','students has done his work','student has done his work','No improvement'],ai:1,exp:'"Each of" + Plural Noun + Singular Verb + Singular Pronoun.'},
{q:'"He sat _____ me in the theater."',options:['besides','beside','along','among'],ai:1,exp:'Beside means next to.'},
{q:'If he _____ harder, he would have passed.',options:['worked','had worked','works','will work'],ai:1,exp:'Third conditional: If + Past Perfect ... Would have.'},
{q:'Find the correct spelling:',options:['Accommodate','Acomodate','Accomodate','Acommodate'],ai:0,exp:'Double C, Double M.'}
],
hook:'Each=Singular. Besides=Extra. Beside=Next. If had=Would have. SON rule. Cloze=Flow first.',
summary:'Techniques for error spotting and sentence improvement. Common grammatical traps in SSC papers. Strategy for solving Cloze tests. Correcting parallel structures.'},

{day:81,topic:'SSC English: Comprehension & Parajumbles',
intro:`Today we study 'Reading and Sorting'. Reading Comprehension (RC) and Sentence Rearrangement (P, Q, R, S) test your logical link. In SSC, the 'Main Idea' and 'Transition words' are the keys. Do you know how to find the 'Introductory Sentence' in a jumbled set? Let's master the structure today.`,
notes:[
{title:'RC Strategy',detail:'1. Read questions first (to know what to look for). 2. Scan for keywords. 3. Don\'t assume outside info. 4. Focus on First and Last lines for the Tone/Theme.'},
{title:'Parajumble Rules',detail:'1. Look for Noun-Pronoun pairs (e.g., Ram -> He). 2. Look for mandatory pairs (A follows B). 3. Find opening (Independent) and closing sentences.'},
{title:'Transition Words',detail:'However, But, Although (Contrast). Therefore, Thus (Conclusion). Firstly, Secondly (Sequence).'},
{title:'Vocabulary in Context',detail:'Finding synonyms/antonyms from the passage. Look at the surrounding words to guess the meaning.'},
{title:'Tone of Passage',detail:'Critical, Appreciative, Sarcastic, Informative, Biased.'}
],
cards:[
{front:'Intro sentence is usually?',back:'Independent (defines the subject).'},
{front:'Noun comes before Pronoun?',back:'YES (Mandatory pair).'},
{front:'"However" indicates?',back:'Contrast.'},
{front:'"Thus/Therefore" indicates?',back:'Conclusion.'},
{front:'Read questions before RC?',back:'YES (to save time).'}
],
q:[
{q:'In a jumbled set, Sentence A starts with "He" and B with "Rohan". Which comes first?',options:['A','B','Depends','None'],ai:1,exp:'Naming noun (Rohan) must come before the pronoun (He).'},
{q:'Which of the following is a concluding word?',options:['Firstly','Meanwhile','Therefore','But'],ai:2,exp:'Indicates a result or summary.'},
{q:'To find the "Theme" of a passage, look at:',options:['Only the middle','First and Last paragraphs','The title only','The length'],ai:1,exp:'They usually contain the thesis and summary.'},
{q:'A parajumble sequence usually starts with:',options:['But','However','In recent years','Therefore'],ai:2,exp:'Starts with a general statement or time reference.'}
],
hook:'Noun before Pronoun. Wh-questions in RC first. Transition clues. Intro is independent. Thus=End.',
summary:'Effective reading strategies for SSC passages. Logic for solving sentence rearrangement (PQRS). Identifying mandatory pairs and transition markers. Analyzing passage tone and theme.'},

{day:82,topic:'SSC English: Idioms, Phrases & Phrasal Verbs',
intro:`Today we study the 'Colors of Language'. Idioms and Phrasal Verbs add flavor but can be tricky if translated literally. In SSC, 'Frequent Idioms' (e.g., At a stone's throw) and 'Phrasal Verbs' (e.g., Give up, Look after) are essential. Do you know what it means to 'Burn the midnight oil'? Let's master the expressions today.`,
notes:[
{title:'High-Frequency Idioms',detail:'1. At a stone\'s throw: Very near. 2. A piece of cake: Very easy. 3. Under the weather: Sick. 4. Spill the beans: Reveal secret. 5. Burn the midnight oil: Study hard.'},
{title:'Animal Idioms',detail:'Black sheep (Disgrace). Dark horse (Unexpected winner). Crocodile tears (Fake grief). Lion\'s share (Major part).'},
{title:'Color Idioms',detail:'Red handed (While committing crime). Out of the blue (Unexpected). White elephant (Costly but useless).'},
{title:'Phrasal Verbs (Set 1)',detail:'Bring up (Rear a child). Call off (Cancel). Look after (Take care). Put out (Extinguish). Give in (Surrender).'},
{title:'Phrasal Verbs (Set 2)',detail:'Break down (Stop working). Get over (Recover). Set out (Start journey). Take off (Start flight).'}
],
cards:[
{front:'"At a stone\'s throw" means?',back:'Very near.'},
{front:'"Dark horse" means?',back:'Unexpected winner.'},
{front:'"To call off" means?',back:'To cancel.'},
{front:'"White elephant" means?',back:'Useless but expensive possession.'},
{front:'"To look after" means?',back:'To take care of.'}
],
q:[
{q:'What is the meaning of "To spill the beans"?',options:['To drop food','To work hard','To reveal a secret','To complain'],ai:2,exp:'Standard idiom for exposing information.'},
{q:'"He is a black sheep of the family" implies he is:',options:['A favorite','A source of pride','A source of disgrace','Very successful'],ai:2,exp:'Someone who brings shame to a group.'},
{q:'The meeting was _____ due to heavy rain.',options:['called for','called off','called in','called up'],ai:1,exp:'Called off means canceled.'},
{q:'Meaning of "Under the weather":',options:['In the rain','Feeling sick','Feeling happy','Traveling'],ai:1,exp:'Standard idiom for illness.'}
],
hook:'Spill beans=Secret. Stone throw=Near. Dark horse=Surprise. Call off=Cancel. White elephant=Useless. Put out=Extinguish.',
summary:'Compilation of top 50 idioms for SSC exams. Meanings and usage of common phrasal verbs. Classification of idioms by themes (Colors, Animals, Parts).'},

{day:83,topic:'SSC English: One Word & Spellings',
intro:`Today we study 'Precision and Perfection'. One Word Substitution (OWS) and Spelling errors are direct marks. From 'Phobias' to 'Government types' and 'Commonly misspelled words' (e.g., Occurrence)—these are the memorization zones. Do you know what a 'Philanthropist' does? Or how to spell 'Lieutenant'? Let's master the words today.`,
notes:[
{title:'Phobias & Manias',detail:'Claustrophobia (Enclosed space), Acrophobia (Height), Hydrophobia (Water). Bibliomania (Books), Pyromania (Fire).'},
{title:'Types of Government',detail:'Democracy (People), Autocracy (One), Plutocracy (Rich), Aristocracy (Nobles), Bureaucracy (Officials).'},
{title:'Personality Types',detail:'Philanthropist (Loves mankind), Misogynist (Hates women), Altruist (Selfless), Egoist (Self-centered).'},
{title:'Group Names',detail:'A flock of sheep, A pride of lions, A herd of cattle, A school of fish, A choir of singers.'},
{title:'Tricky Spellings',detail:'Occurrence, Committee, Millennium, Lieutenant, Questionnaire, Receipt, Privilege, Maintenance.'}
],
cards:[
{front:'Fear of heights?',back:'Acrophobia.'},
{front:'Govt by the rich?',back:'Plutocracy.'},
{front:'One who loves mankind?',back:'Philanthropist.'},
{front:'Spelling of 1,000 years?',back:'Millennium (Double L, Double N).'},
{front:'A group of lions?',back:'Pride.'}
],
q:[
{q:'A person who hates women is called:',options:['Philanthropist','Misogynist','Misanthrope','Altruist'],ai:1,exp:'"Gyn" relates to women; "Miso" to hate.'},
{q:'Govt by officials is known as:',options:['Democracy','Plutocracy','Bureaucracy','Oligarchy'],ai:2,exp:'Derived from French "bureau" (office).'},
{q:'Find the correctly spelled word:',options:['Comittee','Commitee','Committee','Committe'],ai:2,exp:'Double M, Double T, Double E.'},
{q:'"Claustrophobia" is the fear of:',options:['Water','Heights','Enclosed spaces','Spiders'],ai:2,exp:'Standard phobia question.'}
],
hook:'Gyn=Women. Phil=Love. Miso=Hate. Cracy=Rule. Phobia=Fear. Committee=2m/2t/2e. Pride=Lions.',
summary:'Categories of one-word substitutions for SSC. Roots of words (Gyn, Miso, Phil). List of commonly misspelled words in competitive exams. Collective nouns for animals and people.'},

{day:84,topic:'SSC REVISION: English Proficiency (Days 78–83)',
intro:`Today we wrap up 'SSC English'. You have mastered the rules of Voice and Narration, the logic of Cloze tests, and the vast world of Vocabulary. English is the 'Rank Decider' in SSC. Today, we consolidate the rules. If you see 'Voice', you think 'V3/No Tense Change'. If you see 'Narration', you think 'Tense Backshift'. Let's lock in the English marks today.`,
notes:[
{title:'Voice & Narration Recap',detail:'Voice: No tense change, V3, Let/Being. Narration: Backshift (Is -> Was), Today -> That day, wh=No that.'},
{title:'Grammar Recap',detail:'Each/Neither=Singular. Beside=Next, Besides=Extra. If had=Would have. SON rule.'},
{title:'Vocabulary Recap',detail:'Dark horse (Surprise). White elephant (Useless). Phobia (Fear). Philanthropist (Loves mankind).'},
{title:'Spelling Drill',detail:'Committee, Millennium, Occurrence, Lieutenant, Maintenance.'},
{title:'Reading Strategy',detail:'Scan RC for keywords. Find Noun-Pronoun mandatory pairs in Parajumbles.'}
],
cards:[
{front:'Passive of "I know him"?',back:'"He is known TO me" (known takes "to").'},
{front:'"Said to" in Narration?',back:'Told.'},
{front:'Scientific name of Vitamin A? (Science recap)',back:'Retinol.'},
{front:'"Wait for" vs "Await"?',back:'Wait for = Await (no for with await).'},
{front:'Is your English ready?',back:'YES.'}
],
q:[
{q:'Change to Passive: "He broke the glass."',options:['The glass is broken by him','The glass was broken by him','The glass was broke by him','The glass was being broken'],ai:1,exp:'Simple past -> was + V3.'},
{q:'Change to Indirect: Ram said, "I am happy."',options:['Ram said he is happy','Ram told he was happy','Ram said that he was happy','Ram says he was happy'],ai:2,exp:'Tense backshift.'},
{q:'Which of the following is correctly spelled?',options:['Occurence','Occurrence','Ocurrence','Occurrance'],ai:1,exp:'Double C, Double R.'},
{q:'"At the eleventh hour" means:',options:['At 11 AM','Too early','At the last moment','On time'],ai:2,exp:'Standard idiom.'}
],
hook:'English complete. Accuracy is everything. Tense rules. Vocabulary hooks. Spellings check. Victory.',
summary:'Full revision of SSC English syllabus. High-speed drill of voice, narration, and grammar rules. Vocabulary and idiom recap. Final English mock quiz.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'Critical'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC English Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'English Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL English '+d.topic),why:'Complete mastery of English for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | ENGLISH FINALE',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
}
push();
