require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const s=createClient(process.env.EXPO_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

const days=[
{day:22,topic:'SSC English: Nouns & Pronouns — The Foundation',
intro:`Today we master the 'Naming' words. English in SSC is about two things: 'Grammar Rules' and 'Exceptions'. You might know what a Noun is, but do you know which nouns are always singular (like Furniture) and which are always plural (like Scissors)? Or the difference between 'Each other' and 'One another'? Toppers don't just read; they memorize the 'Error Patterns' that SSC loves to repeat. Let's master the rules of Nouns and Pronouns today.`,
notes:[
{title:'Nouns: Singular/Plural Traps',detail:'1. Always Singular (Uncountable): Furniture, Information, Poetry, Scenery, Advice, Knowledge. (Incorrect: Furnitures, Sceneries). 2. Always Plural (Pairs): Scissors, Spectacles, Trousers, Binoculars. 3. Look Plural but are Singular: News, Mathematics, Physics, Measles, Billiards.'},
{title:'Collective Nouns',detail:'Usually singular (The jury IS). But plural if members are divided (The jury ARE divided). Note: People, Cattle, Poultry, Gentry are ALWAYS plural.'},
{title:'Pronouns: Basic Rules',detail:'1. Relative Pronouns: WHO (for people), WHICH (for things), THAT (for both, especially after superlative). 2. Each other (2 people), One another (more than 2). 3. Reflexive: Use Myself, Himself only when the subject and object are the same. (Incorrect: "Myself is Rahul").'},
{title:'Case of Pronouns',detail:'Use Objective case (Me, Him, Her) after "Between" and "Let". (Correct: Between you and me. Let him and her go).'},
{title:'The Rule of 231',detail:'When multiple personal pronouns are used in a sentence (Positive context), the order is: 2nd Person (You) -> 3rd Person (He/She) -> 1st Person (I). (Correct: You, he and I are going). For negative context/confession, use 123.'}
],
cards:[
{front:'Plural of "Furniture"?',back:'None. It is always singular ("Furniture").'},
{front:'When to use "One another"?',back:'When referring to more than two people.'},
{front:'"Mathematics" - Singular or Plural?',back:'Singular. (Look plural, act singular).'},
{front:'"Let you and ___ go" (I/Me)?',back:'Me. (Objective case after "Let").'},
{front:'Rule of 231?',back:'Order of personal pronouns in a positive sentence: 2nd -> 3rd -> 1st.'}
],
q:[
{q:'Spot the error: The sceneries of Kashmir are very beautiful.',options:['The sceneries','of Kashmir','are very','beautiful'],ai:0,exp:'"Scenery" is an uncountable noun and does not have a plural form. Correct: The scenery...'},
{q:'Each of the boys ____ given a prize.',options:['was','were','have','are'],ai:0,exp:'"Each of" is followed by a plural noun but a singular verb. Correct: Each of the boys WAS...'},
{q:'It was ____ who called you last night.',options:['I','me','my','myself'],ai:0,exp:'After "It is/was", use the Subjective case. Correct: It was I...'},
{q:'These two brothers love ____.',options:['one another','each other','themselves','ourselves'],ai:1,exp:'For two people, use "each other". For more than two, use "one another".'}
],
hook:'Furniture, News, Info=Singular. Cattle, Gentry=Plural. Each of=Singular verb. Let+Me (Objective). Between+Me. 231 order.',
summary:'Classification of Nouns and their singular/plural exceptions. Rules of Collective Nouns. Relative and Reflexive Pronoun usage. Cases of Pronouns and the 231 sequence rule.'},

{day:23,topic:'SSC English: Verbs & Tenses — The Time Machine',
intro:`Today we master 'Action'. Verbs and Tenses are the backbone of sentence construction. In SSC, 'Subject-Verb Agreement' is the most important sub-topic. If the subject is 'Neither... nor', which verb do you use? If the sentence is in the 'Past Perfect', what comes with 'Had'? Toppers focus on the 'Conditional Sentences' (If I were a bird...) because they are the most frequent exam traps. Let's master the rules of Time today.`,
notes:[
{title:'Subject-Verb Agreement (SVA)',detail:'1. Neither/Either/Nor/Or: Verb follows the NEAREST subject. (Correct: Neither he nor his friends ARE). 2. Along with/As well as/Together with: Verb follows the FIRST subject. (Correct: He as well as his friends IS).'},
{title:'Present Perfect vs Simple Past',detail:'Simple Past (V2): Used for actions at a specific time in the past (Yesterday, 1990). Present Perfect (Has/Have + V3): Used for actions whose time is not specified or just completed (Already, Yet, So far).'},
{title:'Past Perfect (The Past of the Past)',detail:'When two actions happen in the past, the 1st action uses "Had + V3" and the 2nd action uses "V2". (Correct: The train HAD left before we reached the station).'},
{title:'Conditional Sentences',detail:'1. Type 1: If + Present, Will + V1. 2. Type 2: If + Past, Would + V1. 3. Type 3: If + Had + V3, Would have + V3. (Trap: Never use "Would" in the "If" clause).'},
{title:'Special Case: Unreal Past',detail:'With "I wish", "As if", "If only", use "WERE" for all subjects. (Correct: I wish I WERE a king).'}
],
cards:[
{front:'Verb for "He as well as his friends"?',back:'IS. (Verb follows the first subject).'},
{front:'Verb for "Neither he nor his friends"?',back:'ARE. (Verb follows the nearest subject).'},
{front:'Formula for Type 3 Conditional?',back:'If + Had + V3, Would have + V3.'},
{front:'Which verb after "I wish"?',back:'WERE. (Unreal past).'},
{front:'When to use "Had + V3"?',back:'For the earlier of two past actions.'}
],
q:[
{q:'Spot the error: The teacher as well as the students were working hard.',options:['The teacher','as well as','the students','were working'],ai:3,exp:'With "as well as", the verb follows the first subject (teacher). Correct: was working.'},
{q:'If I ____ you, I would not have made that mistake.',options:['am','was','were','had been'],ai:2,exp:'For imaginary situations, use "were". Correct: If I were you...'},
{q:'I have finished my work two hours ago.',options:['have finished','finished','had finished','finish'],ai:1,exp:'"Ago" indicates specific past time, so use Simple Past (V2). Correct: I finished...'},
{q:'Neither of the two candidates ____ eligible for the post.',options:['is','are','were','have been'],ai:0,exp:'"Neither of" is followed by a singular verb. Correct: Neither... is eligible.'}
],
hook:'As well as=1st Subject. Neither/Nor=Nearest Subject. I wish=WERE. Had+V3...Would have+V3. Simple Past for "Ago".',
summary:'Subject-Verb Agreement rules for complex subjects. Comparison of Past Tenses. Mastering the three types of Conditional sentences. Unreal past and imaginary conditions.'},

{day:24,topic:'SSC English: Adjectives & Adverbs — Quality & Manner',
intro:`Today we master 'Modifiers'. Adjectives describe nouns, and Adverbs describe verbs, adjectives, or other adverbs. In SSC, the traps are in the 'Degrees of Comparison' (Tall, Taller, Tallest) and the placement of 'Only' or 'Enough'. Do you know the difference between 'Further' and 'Farther'? Or 'Little', 'A little', and 'The little'? Toppers know that adverbs usually end in '-ly', but not always. Let's refine your descriptive logic today.`,
notes:[
{title:'Degrees of Comparison',detail:'1. Positive (Tall). 2. Comparative (Taller - used for 2). 3. Superlative (Tallest - used for 3+). Note: Never use double comparatives (Correct: Better, Incorrect: More better).'},
{title:'Little vs Few',detail:'LITTLE: Used for uncountable (water, time, hope). FEW: Used for countable (books, days). Pattern: "A little/few" = Some. "Little/few" = Almost none. "The little/few" = All that is there.'},
{title:'Farther vs Further',detail:'FARTHER: Refers to physical distance. FURTHER: Refers to addition or extra. (Correct: I have nothing further to say).'},
{title:'Placement of "Enough"',detail:'"Enough" is placed AFTER an Adjective but BEFORE a Noun. (Correct: He is rich enough. I have enough money).'},
{title:'Adverbs of Manner',detail:'Usually end in -ly (Slowly, Carefully). Trap: Fast, Hard, High are both Adjectives and Adverbs. NEVER use "Fastly".'}
],
cards:[
{front:'"Further" vs "Farther"?',back:'Farther = Distance. Further = Additional.'},
{front:'Placement of "Enough"?',back:'After Adjective (Kind enough), Before Noun (Enough food).'},
{front:'"Little" vs "A little"?',back:'Little = Negative (almost none). A little = Positive (some).'},
{front:'Is "Fastly" a word?',back:'No. "Fast" is both adjective and adverb.'},
{front:'Double Comparatives?',back:'Never use (e.g., "more better" is wrong).'}
],
q:[
{q:'She is ____ of the two sisters.',options:['wisest','wiser','more wise','most wise'],ai:1,exp:'For comparing two people, use the Comparative degree (Wiser).'},
{q:'I have ____ milk left in the bottle.',options:['little','a little','few','a few'],ai:1,exp:'Milk is uncountable, so use "little". "A little" means some milk is left.'},
{q:'He is enough old to understand this.',options:['enough old','old enough','older enough','enough older'],ai:1,exp:'"Enough" comes after the adjective. Correct: old enough.'},
{q:'Mumbai is ____ from Delhi than Jaipur.',options:['farther','further','farthest','furthest'],ai:0,exp:'Physical distance is meant here, so use "farther".'}
],
hook:'Farther=Dist. Further=Extra. Enough after Adjective. Little=Uncountable, Few=Countable. No "more better". No "fastly".',
summary:'Degrees of comparison and their rules. Countable vs Uncountable modifiers (Few/Little). Usage of Farther and Further. Proper placement of "Enough". Adverb formations and exceptions.'}
];

async function push(){
  for(const d of days){
    const p={
      topic_title:d.topic,day_number:d.day,track:'ssc_ecosystem',
      lesson_intro:d.intro,
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:'High'},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ SSC Speed Hook: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'English Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL '+d.topic+' grammar rules'),why:'Mastering error spotting for SSC.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.ai,answer:q.options[q.ai],explanation:q.exp}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | English',one_screen_summary:d.summary}
    };
    const{error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:p,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error)console.error('Day '+d.day+':',error.message);
    else console.log('✅ SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 22-24 v2 COMPLETE');
}
push();
