require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:21, topic:'Mirror Image, Water Image & Paper Folding',
  notes:[
    {title:'Mirror Image Rules', detail:'Left-Right is REVERSED. Top-Bottom is preserved. If clock in mirror shows 3:00→actual is 9:00. Letters with vertical symmetry (A,H,I,M,O,T,U,V,W,X,Y) look same in mirror. Letters with no symmetry (B,C,D,E,F,G,J,K,L,N,P,Q,R,S,Z) are reversed.'},
    {title:'Water Image Rules', detail:'Top-Bottom is REVERSED. Left-Right is preserved. Letters with horizontal symmetry (B,C,D,E,H,I,K,O,X) look same in water. Invert the figure vertically. Water image of text: flip upside down.'},
    {title:'Paper Folding Logic', detail:'When paper is folded and punched: unfold mentally step by step. Each fold creates a mirror image of holes. One fold=2 holes when unfolded. Two folds=4 holes. Three folds=8 holes. Hole position mirrors across each fold line.'},
    {title:'Embedded Figures', detail:'Look for the outline of the given shape within the complex figure. Mentally trace the shape. Eliminate options where lines don\'t match the original. Note: lines in embedded figure must exist in complex figure (cannot add new lines).'}
  ],
  hook:'⚡ Hall Trick: For mirror image of a CLOCK — do NOT read the hands individually. Instead: 12:00-shown time = mirror time. OR use 11:60 formula for other positions. For LETTERS: symmetric ones (A,H,I,M,O,T,U,V,W,X,Y) appear the same in mirror. Non-symmetric ones flip. Memorize symmetric letters: AHIMOTUVWXY.',
  cards:[
    {front:'Which letters appear the same in their mirror image?', back:'A,H,I,M,O,T,U,V,W,X,Y — these have vertical line of symmetry. Memorize: AH I MOT UV WXY.'},
    {front:'Which letters appear the same in their water image?', back:'B,C,D,E,H,I,K,O,X — these have horizontal line of symmetry. Memorize: BCDEHIKOX.'},
    {front:'A paper is folded in half vertically and one hole is punched in the center. How many holes when unfolded?', back:'2 holes — one on each half, symmetric about the fold line.'}
  ],
  q:[
    {q:'The mirror image of the word "CLOCK" is — which letter appears reversed?', options:['C and K only','All letters','C,L,K are reversed, O and C same','CLOCK stays same'], answer_index:0, explanation:'C,L,K have no vertical symmetry — they reverse in mirror. O has perfect circular symmetry — same in mirror. So C and K (and L) reverse. The full word CLOCK in mirror shows reversed individual letters right-to-left.'},
    {q:'A paper is folded twice (once horizontally, once vertically) and a hole is punched in one corner. How many holes when fully unfolded?', options:['1','2','3','4'], answer_index:3, explanation:'Each fold doubles the hole count. One fold = 2 holes. Two folds = 4 holes. The hole in the corner of double-folded paper creates 4 symmetrically placed holes when unfolded.'}
  ],
  pyq:'Every SSC paper — 2-3 non-verbal reasoning questions. Mirror/water image are "free marks" if patterns memorized.',
  summary:'Mirror: Left-Right reversed, Top-Bottom preserved. Symmetric letters (mirror): AHIMOTUVWXY. Water: Top-Bottom reversed, Left-Right preserved. Symmetric letters (water): BCDEHIKOX. Paper fold: folds×holes=2^n holes. Embedded figures: trace outline in complex figure, no new lines allowed.'
},
{
  day:22, topic:'Tenses: 12-Tense Framework',
  notes:[
    {title:'Simple Tenses', detail:'Simple Present: V1/Vs (I go, She goes). Simple Past: V2 (went). Simple Future: will/shall+V1 (will go). Use Present for habits/facts, Past for completed actions, Future for plans/predictions.'},
    {title:'Continuous Tenses', detail:'Present Continuous: is/am/are+Ving (I am going). Past Continuous: was/were+Ving (was going). Future Continuous: will be+Ving (will be going). Signal words: now, at the moment (present); when, while, as (past); tomorrow at 5pm (future).'},
    {title:'Perfect Tenses', detail:'Present Perfect: has/have+V3 (has gone). Past Perfect: had+V3 (had gone). Future Perfect: will have+V3 (will have gone). Key: Perfect tenses show COMPLETION. Past Perfect: completed BEFORE another past action (the "earlier" past).'},
    {title:'SSC Tense Traps', detail:'Stative verbs (know, want, love, believe, have, see, smell, taste) NEVER use continuous form. Wrong: "I am knowing." Right: "I know." Common trap: "Since" → Perfect tense. "For" → Perfect tense (duration). "Ago" → Simple past. "Yesterday" → Simple past.'}
  ],
  hook:'⚡ SSC Grammar Hall Trick: "Since" always triggers Present/Past Perfect. "For" with duration also triggers Perfect. "Yesterday/last week/ago" → Simple Past only. "Stative verbs with -ing" = ERROR. Spotting these signal words eliminates wrong tense in 3 seconds. No grammar rule memorization needed — just learn the 5 signal words.',
  cards:[
    {front:'Which signal words indicate Present Perfect tense?', back:'"Since" (specific time point), "For" (duration up to now), "Just", "Already", "Yet", "Ever", "Never", "Recently". "She has worked here since 2020."'},
    {front:'Correct the error: "I am knowing the answer."', back:'"I know the answer." — "know" is a stative verb. Stative verbs (know, want, love, believe, own, hear, see) NEVER take continuous form. This is the #1 SSC English error spotting trap.'},
    {front:'When to use Past Perfect vs Simple Past?', back:'Past Perfect for the EARLIER of two past actions: "She had left BEFORE he arrived." The "leaving" happened first → Past Perfect. The "arriving" is simple past. Rule: had+V3 for earlier action.'}
  ],
  q:[
    {q:'Choose the correct tense: "By the time he arrived, she _____ the work." ', options:['has finished','had finished','finished','was finishing'], answer_index:1, explanation:'"By the time" with a past action = Past Perfect for the completed action. She finished BEFORE he arrived. Earlier past action = had+V3 = "had finished."'},
    {q:'Identify the error: "She is having a headache since morning."', options:['She is having','a headache','since morning','No error'], answer_index:0, explanation:'"Have" (possess/experience) is a stative verb — cannot take continuous form. Also, "since morning" requires Present Perfect. Correct: "She has had a headache since morning." Two errors: stative verb in continuous + wrong tense.'}
  ],
  pyq:'Every SSC paper — 5-8 grammar questions involve tense. Error spotting and fill-in-the-blank.',
  summary:'12 tenses: Simple(V1/V2/will+V1)+Continuous(is/was/will be+Ving)+Perfect(has/had/will have+V3)+Perfect Continuous. Stative verbs(know,want,love,have,see)=NEVER continuous. Signal words: Since/for/just/already/yet=Present Perfect. Ago/yesterday/last=Simple Past. By the time+past=Past Perfect.'
},
{
  day:23, topic:'Subject-Verb Agreement: The 15 Rules',
  notes:[
    {title:'Core Rules (1-5)', detail:'Rule 1: Singular subject=singular verb (He works). Rule 2: Plural subject=plural verb (They work). Rule 3: Neither-Nor/Either-Or=verb agrees with NEARER subject. Rule 4: "Along with/As well as/together with" phrases don\'t change singular subject — verb stays singular. Rule 5: Collective nouns (team, jury, committee) = singular verb (Team is...).'},
    {title:'Tricky Rules (6-10)', detail:'Rule 6: Indefinite pronouns (each, every, either, neither, one, nobody, someone)=singular verb. Rule 7: "A number of"=plural, "The number of"=singular. Rule 8: Fractions/percentages agree with the noun after "of" (50% of the students ARE, 50% of the water IS). Rule 9: Titles/names of books/countries=singular (The United States IS). Rule 10: Mathematical operations=singular (Five plus five IS).'},
    {title:'Advanced Rules (11-15)', detail:'Rule 11: "More than one"=singular (More than one student WAS). Rule 12: "One of the"=plural noun, singular verb (One of the students HAS). Rule 13: Relative pronouns (who, which, that) agree with antecedent. Rule 14: Inverted sentences — identify true subject. Rule 15: Expletive "there" — verb agrees with noun following.'}
  ],
  hook:'⚡ SSC SVA Hall Trick: The 4 killers that make SINGULAR verbs look plural: 1) "Along with/together with" (ignore the added phrase). 2) "The number of" (not "a number of"). 3) "More than one" (sounds plural, is singular). 4) "One of the [plural nouns]" (verb is still singular). These four create 80% of SSC SVA errors.',
  cards:[
    {front:'Correct form: "The quality of the mangoes (is/are) not good."', back:'"is" — Subject is "quality" (singular). "of the mangoes" is just a prepositional phrase — it cannot change the subject. The most common SVA trap.'},
    {front:'"A number of students (has/have) failed." Correct?', back:'"have" — "A number of" = plural verb. Contrast: "The number of students has increased" — "the number of" = singular verb.'},
    {front:'"Neither the manager nor the employees (was/were) informed." Correct?', back:'"were" — Neither-Nor rule: verb agrees with NEARER subject. "employees" is nearer and plural → "were."'}
  ],
  q:[
    {q:'Choose correct: "Either the principal or the teachers _____ responsible for this."', options:['is','are','was','has been'], answer_index:1, explanation:'Either-Or: verb agrees with NEARER subject. "teachers" is plural and nearer to the verb → "are." If "principal" were nearer (either the teachers or the principal ___), it would be "is."'},
    {q:'Identify error: "One of my friends have gone abroad."', options:['One of my','friends have','gone abroad','No error'], answer_index:1, explanation:'"One of" → singular verb. "friends" is the noun after "of" (explains which one), not the subject. Subject is "one" (singular). Correct: "One of my friends has gone abroad." The "friends have" construction is the error.'}
  ],
  pyq:'Every CGL/CHSL — 3-5 SVA questions in Error Spotting and Sentence Improvement.',
  summary:'Core: sing=sing verb. Neither-Nor/Either-Or=verb agrees with NEARER subject. "Along with/as well as"=singular if main subject singular. "A number of"=plural. "The number of"=singular. "More than one"=singular. "One of the"=singular verb. Collective nouns=singular. Fractions: agree with noun after "of".'
},
{
  day:24, topic:'Active & Passive Voice: Switch Formula',
  notes:[
    {title:'The Switch Formula', detail:'Active: Subject + V + Object. Passive: Object + be(in tense) + V3 + by + Subject. Tense of "be" verb: Present→is/am/are, Past→was/were, Future→will be, Present Perfect→has/have been, Past Perfect→had been, Present Continuous→is/am/are being, Past Continuous→was/were being.'},
    {title:'Pronoun Changes in Passive', detail:'I→me/by me. He→him/by him. She→her/by her. They→them/by them. We→us/by us. You→you. The object becomes subject (I→I as subject, but me as object). In passive, if original subject becomes "by phrase": I→by me, He→by him.'},
    {title:'Special Cases', detail:'Modal verbs: can/could/may/might/should/must + be + V3. Example: "You should do this"→"This should be done by you." Imperative active: "Shut the door"→"Let the door be shut." Questions active→questions passive: "Who wrote this book?"→"By whom was this book written?"'},
    {title:'Intransitive Verb Warning', detail:'Verbs with NO object (sleep, arrive, go, come, die, rise, fall, swim) CANNOT be made passive. Example: "He slept" has no object → NO passive form. This is tested as "which cannot be converted to passive" type question.'}
  ],
  hook:'⚡ SSC Voice Hall Trick: The BE VERB TENSE TABLE is all you need. Match tense: if active is "was writing" (Past Continuous)→passive uses "was being written." If active is "has written" (Present Perfect)→passive is "has been written." The V3 and "be" verb combination never changes — only the tense of "be" changes.',
  cards:[
    {front:'Active: "She has written the letter." Passive?', back:'"The letter has been written by her." Present Perfect: has/have + been + V3. Subject "she"→"by her" (pronoun change).'},
    {front:'Active: "They were building the bridge." Passive?', back:'"The bridge was being built by them." Past Continuous: was/were + being + V3. "they"→"by them."'},
    {front:'Can "He sleeps eight hours" be made passive?', back:'NO. "Sleep" is intransitive — no object. Only transitive verbs (with objects) can be made passive. Intransitive verbs NEVER have passive form.'}
  ],
  q:[
    {q:'Choose the correct passive form: "Someone has stolen my wallet."', options:['My wallet was stolen by someone.','My wallet has been stolen.','My wallet is stolen by someone.','My wallet had been stolen.'], answer_index:1, explanation:'"Has stolen" (Present Perfect Active) → "has been stolen" (Present Perfect Passive). The "by someone" is omitted because "someone" is indefinite — passive omits vague agents. Correct: "My wallet has been stolen."'},
    {q:'Which of the following sentences CANNOT be changed to passive voice?', options:['She likes coffee.','He wrote a letter.','They are building a house.','The sun rises in the east.'], answer_index:3, explanation:'"Rises" is intransitive — the sun doesn\'t rise SOMETHING. It just rises. No object → no passive. "Likes coffee" (transitive), "wrote a letter" (transitive), "building a house" (transitive) — all can be passivized.'}
  ],
  pyq:'Every SSC paper — 2-3 voice conversion questions and error spotting.',
  summary:'Passive: Object+be(tense)+V3+by+Subject. Tense of be: Present=is/are, Past=was/were, Future=will be, PerfPresent=has/have been, PerfPast=had been, ContPresent=is/are being, ContPast=was/were being. Pronoun: Subject of active→by[object pronoun] in passive. Intransitive verbs=NO passive. Modal passive: modal+be+V3.'
},
{
  day:25, topic:'Direct & Indirect Speech Reporting Rules',
  notes:[
    {title:'Tense Backshift Rules', detail:'When reporting verb is PAST: Present Simple→Past Simple (is→was). Present Continuous→Past Continuous (is going→was going). Present Perfect→Past Perfect (has gone→had gone). Past Simple→Past Perfect (went→had gone). will→would, can→could, may→might, shall→should.'},
    {title:'Pronoun & Time/Place Changes', detail:'I→he/she. We→they. Me→him/her. My→his/her. Now→then. Today→that day. Yesterday→the previous day. Tomorrow→the next day/the following day. Here→there. This→that. These→those. Come→go.'},
    {title:'Reporting Different Sentence Types', detail:'Statement: said/told → "that" (that-clause). Question (Yes/No): asked → "if/whether" (indirect question word order). WH-Questions: asked → WH-word (indirect word order). Command/Request: ordered/requested/told → "to" (infinitive). Exclamation: exclaimed with joy/sorrow+that.'},
    {title:'Mixed Exceptions', detail:'If reporting verb is PRESENT/FUTURE: NO tense backshift. Universal truths: no backshift (The teacher said the earth IS round). Historical facts: "He said Caesar CONQUERED Gaul" (may or may not backshift). Direct quote with past tense stays as past perfect in indirect.'}
  ],
  hook:'⚡ SSC Narration Hall Trick: The ONLY rules you need for 90% of questions: 1) Reporting verb past → backshift all tenses by one step. 2) I/we→he/she/they. 3) Statements→"that". 4) Yes/No questions→"if/whether". 5) WH questions→keep WH word. 6) Commands→"to+infinitive". Six rules = all SSC narration questions solved.',
  cards:[
    {front:'Change: He said "I am going to the market." → Indirect?', back:'He said that he was going to the market. Changes: "I"→"he", "am going"→"was going", no "that" needed but standard to add.'},
    {front:'Change: She said "Have you finished the work?" → Indirect?', back:'She asked him if he had finished the work. Yes/No question → "if/whether". Tense: "have finished"→"had finished". Pronoun: "you"→"he".'},
    {front:'Change: The teacher said "The earth revolves around the sun." → Indirect?', back:'The teacher said that the earth revolves around the sun. Universal truth — NO tense backshift. "Revolves" stays as "revolves."'}
  ],
  q:[
    {q:'He said to me, "Will you help me?" Change to indirect speech.', options:['He asked me if I would help him.','He asked me whether will I help him.','He told me if I will help him.','He asked me that I would help him.'], answer_index:0, explanation:'Yes/No question → "asked...if/whether". "Will"→"would" (backshift). "you"→"I" (pronoun shift relative to reporter). "me"→"him". Correct: "He asked me if I would help him." Option B keeps direct word order (wrong for indirect).'},
    {q:'The teacher said, "The sun rises in the east." Indirect speech:', options:['The teacher said that the sun had risen in the east.','The teacher said that the sun rose in the east.','The teacher said that the sun rises in the east.','The teacher told that the sun was rising in the east.'], answer_index:2, explanation:'Universal/scientific truth → NO tense backshift. "rises" stays "rises" regardless of reporting verb being past. The teacher said that the sun rises in the east.'}
  ],
  pyq:'Every CGL/CHSL — 2-4 narration questions in Sentence Improvement and Error Spotting.',
  summary:'Backshift(past reporting): is→was,has→had,will→would,can→could,may→might. Pronouns: I→he/she,we→they. Time: today→that day,tomorrow→next day,now→then. Statements: that-clause. Yes/No Q: if/whether. WH-Q: keep WH word, indirect order. Commands: to+V1. Universal truths: NO backshift.'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'ssc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ **SSC Hall Trick**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC English Master: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL English '+d.topic+' rules tricks'),why:'Grammar rule tutorial for exam hall.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 21-25 COMPLETE');
}
push();
