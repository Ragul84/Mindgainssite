require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const days = [
{
  day:26, topic:'Articles: a, an, the — The 10 Rules',
  notes:[
    {title:'A vs An Rule', detail:'"A" before consonant SOUNDS. "An" before vowel SOUNDS (not letters). Examples: An hour (h is silent), A university (sounds like "yoo"), An MBA, A European (sounds "yoo-ropean"), An honest man, A one-way street (sounds "wun").'},
    {title:'When to use "The"', detail:'Specific/known noun: "The book on the table." Unique objects: "The sun, the moon, the earth." Superlatives: "The best, the tallest." Names of rivers, seas, oceans: "The Nile, The Pacific." Mountain ranges (not individual peaks): "The Himalayas" but "Mount Everest."'},
    {title:'When NOT to use "The"', detail:'Languages: I speak French (not "the French"). Meals: I had breakfast. Sports: She plays tennis. Abstract nouns: Truth is important (not "the truth" unless specific). Proper nouns: India, Delhi (not "the India" — exception: The USA, The UK, The Hague).'},
    {title:'The — Nationality Groups', detail:'"The" before nationality adjective for a group: "The French love wine." But: "A French man" (individual). "The rich, the poor" (groups). "The blind, the deaf" (groups with disabilities).'}
  ],
  hook:'⚡ SSC Article Hall Trick: Check for SOUND, not spelling (a/an). Check for SPECIFIC/UNIQUE/KNOWN (the). Check for NO article: languages, meals, sports, abstract nouns, most proper names. The three-step filter solves 90% of SSC article questions in 5 seconds.',
  cards:[
    {front:'"She is ___ European woman." a or an?', back:'"a" — "European" starts with the vowel letter E but sounds like "Yoo-ropean" — consonant sound Y. So "a European."'},
    {front:'"He is the best student ___ class." Fill article.', back:'"in the class." Superlative adjective ("best") + specific group ("class") → "the class." "In the class" = in that specific class.'},
    {front:'No article needed before what categories?', back:'Languages (French, Hindi), meals (breakfast, lunch), sports (tennis, cricket), most proper names (India, Delhi), abstract nouns used generally (truth, beauty).'}
  ],
  q:[
    {q:'Fill in the blank: "_____ Himalayas are higher than _____ Alps."', options:['The...The','A...The','The...a','No article needed'], answer_index:0, explanation:'"The Himalayas" and "The Alps" — mountain RANGES always take "the." Individual peaks don\'t: "Mount Everest." "The Himalayas are higher than the Alps." Both are mountain ranges.'},
    {q:'Choose correct: "She wants to become ___ engineer."', options:['a','an','the','no article'], answer_index:1, explanation:'"Engineer" starts with the vowel sound "en" → "an engineer." Check SOUND not spelling. "An" before vowel sounds: an engineer, an hour, an honest person, an umbrella.'}
  ],
  pyq:'Every CGL/CHSL — 2-3 article questions in Fill in the Blanks and Error Spotting.',
  summary:'A=consonant sound. An=vowel sound (check sound not letter). The: specific/unique/known+rivers/oceans/ranges/superlatives/nationality groups. No article: languages/meals/sports/abstract nouns/most proper names. Exception: The USA,The UK,The Hague,The Maldives(island groups). European/university/one=consonant sound→"a".'
},
{
  day:27, topic:'Prepositions: Fixed Phrases & Common Traps',
  notes:[
    {title:'Fixed Preposition Phrases (Must Know)', detail:'"Abide by" (rules). "Abstain from" (voting). "Accuse of" (crime). "Adhere to" (principles). "Angry with" (person), "Angry at" (thing/situation). "Anxious about" (future), "Anxious for" (something desired). "Agree with" (person), "Agree to" (proposal). "Arrive at" (small place), "Arrive in" (city/country).'},
    {title:'More Fixed Phrases', detail:'"Blame for" vs "Blame on": Blame him FOR the mistake / Blame the mistake ON him. "Bored of/with" (both acceptable). "Capable of". "Complain about/of". "Confident of" (result), "Confident in" (person). "Consist of". "Congratulate on". "Depend on/upon". "Die of" (disease), "Die from" (injury/accident).'},
    {title:'Time Prepositions', detail:'"At" for specific time (at 5pm, at midnight, at noon). "On" for days and dates (on Monday, on 15th August). "In" for months, years, seasons, longer periods (in July, in 2020, in summer, in the morning). Special: "in the morning" but "at night" (exception).'},
    {title:'Place Prepositions', detail:'"At" for specific points (at the station, at home). "In" for enclosed spaces (in the room, in India). "On" for surfaces (on the table, on the road). "Above/over" (higher than). "Below/under" (lower than — "under" for contact, "below" for measurement).'}
  ],
  hook:'⚡ SSC Preposition Hall Trick: The MOST tested SSC fixed prepositions — "Die OF disease but FROM injury/accident." "Angry WITH person, AT situation." "Arrive AT small places, IN cities/countries." "Agree WITH person, TO proposal." These 4 distinctions appear in 70% of SSC preposition questions.',
  cards:[
    {front:'"He died ___ malaria." Correct preposition?', back:'"of" — "Die of" + disease name. "Die from" + injury/accident. "He died of malaria/cancer." "She died from her injuries."'},
    {front:'"I agree ___ your proposal." Correct preposition?', back:'"to" — "Agree TO" a proposal/plan/suggestion. "Agree WITH" a person. "I agree with you" but "I agree to your proposal."'},
    {front:'"She is angry ___ her sister." Correct preposition?', back:'"with" — "Angry WITH" a person. "Angry AT" a situation or thing. "Angry with her sister" vs "angry at the delay."'}
  ],
  q:[
    {q:'Fill in the blank: "The students were warned _____ using mobile phones during exams."', options:['for','against','from','about'], answer_index:1, explanation:'"Warned against" is the correct fixed phrase. "Warn against doing something" = advise to avoid. "Warned for" is wrong. "Warned about" can work sometimes but "against" is the standard SSC answer for this construction.'},
    {q:'Which is correct: "The train arrived ___ the station ___ 5 pm."', options:['in...at','at...at','in...in','at...in'], answer_index:1, explanation:'"Arrive AT" small/specific places (station=specific point). "At" for specific time (5 pm). "at the station at 5 pm." Both blanks take "at."'}
  ],
  pyq:'Every CGL/CHSL — 3-5 preposition questions in Fill in the Blanks, Error Spotting, Sentence Improvement.',
  summary:'Fixed phrases: Abide by/Abstain from/Accuse of/Adhere to. Angry WITH(person)/AT(thing). Agree WITH(person)/TO(proposal). Arrive AT(small)/IN(city). Die OF(disease)/FROM(injury). Time: At(specific time)/On(day,date)/In(month,year,season). Place: At(point)/In(enclosed)/On(surface). Warn AGAINST. Congratulate ON.'
},
{
  day:28, topic:'Idioms & Phrases: High-Frequency 50',
  notes:[
    {title:'Body Idioms', detail:'"Keep an eye on"=watch carefully. "Turn a blind eye"=ignore deliberately. "Cost an arm and a leg"=very expensive. "Pull someone\'s leg"=joke/tease. "Get cold feet"=become nervous/back out. "Break a leg"=good luck. "Have a heart of gold"=very kind. "A shoulder to cry on"=emotional support.'},
    {title:'Action Idioms', detail:'"Bite the bullet"=endure pain bravely. "Hit the nail on the head"=say exactly right thing. "Burn bridges"=destroy relationships permanently. "Spill the beans"=reveal secret. "Let the cat out of the bag"=accidentally reveal secret. "Beat around the bush"=avoid direct answer. "Cut corners"=do something cheaply/poorly.'},
    {title:'Situation Idioms', detail:'"Once in a blue moon"=very rarely. "Under the weather"=feeling ill. "Hit the sack"=go to sleep. "Bite off more than you can chew"=take on more than you can handle. "A blessing in disguise"=something bad that turns out good. "Costs a pretty penny"=very expensive. "Miss the boat"=miss an opportunity.'},
    {title:'SSC Favorites', detail:'"Burn the midnight oil"=work late at night. "Hit the books"=study. "Make ends meet"=manage financially. "Face the music"=accept unpleasant consequences. "Sit on the fence"=avoid taking sides. "Stir up a hornet\'s nest"=cause trouble. "Add fuel to fire"=worsen a situation.'}
  ],
  hook:'⚡ SSC Idiom Hall Trick: Eliminate literally-meaningful options first. If idiom "Spill the beans" has option "Pour beans on table" → eliminate immediately. Idioms NEVER mean their literal words. The correct option will seem unrelated to the words. Also: body-part idioms often relate to human emotions (cold feet=fear, heart of gold=kindness).',
  cards:[
    {front:'"Burning the midnight oil" means?', back:'Working/studying late into the night. Before electricity, oil lamps burned while people worked at night. Context: hard work and dedication.'},
    {front:'"A blessing in disguise" means?', back:'Something that seems bad or unfortunate at first but turns out to be beneficial. Example: Losing a job led to starting a successful business.'},
    {front:'"Hit the nail on the head" means?', back:'To say or do exactly the right thing. To identify the precise problem or solution. Example: "You hit the nail on the head — that\'s exactly the issue."'}
  ],
  q:[
    {q:'What does "sit on the fence" mean?', options:['Watch a sporting event','Remain neutral and not take sides','Feel restless','Wait for someone outside'], answer_index:1, explanation:'"Sit on the fence"=remain neutral, avoid committing to either side of an argument or decision. Often used negatively — implying indecisiveness. "Stop sitting on the fence — you must choose one side."'},
    {q:'The idiom "add fuel to fire" means?', options:['Start a new problem','Make a difficult situation worse','Solve a problem quickly','Forget about a problem'], answer_index:1, explanation:'"Add fuel to fire" (or "add fuel to the flames") = make an already bad situation even worse. If two people are arguing and someone makes a provocative comment, they "add fuel to the fire."'}
  ],
  pyq:'Every SSC paper — 4-5 idiom questions. Usually "choose the correct meaning" format.',
  summary:'Key idioms: Burn midnight oil(work late)+Hit nail on head(exactly right)+Spill beans(reveal secret)+Cold feet(nervous)+Bite bullet(endure bravely)+Under weather(ill)+Once in blue moon(rarely)+Blessing in disguise(bad→good)+Sit on fence(neutral)+Add fuel to fire(worsen)+Beat around bush(avoid direct). Eliminate literal meanings first.'
},
{
  day:29, topic:'One Word Substitution: Root Word Method',
  notes:[
    {title:'Greek/Latin Roots for SSC', detail:'"Phil"=love: Bibliophile(books), Philanthropist(humanity), Philatelist(stamps). "Phobia"=fear: Claustrophobia(enclosed spaces), Xenophobia(foreigners), Acrophobia(heights). "Logy"=study: Ornithology(birds), Seismology(earthquakes), Anthropology(humans). "Cide"=killing: Homicide(human), Fratricide(brother), Infanticide(infant).'},
    {title:'More Power Roots', detail:'"Poly"=many: Polyglot(languages), Polygamy(marriages). "Mono"=one: Monologue(one person speech), Monogamy(one spouse). "Auto"=self: Autobiography, Autocracy(self-rule). "Demo"=people: Democracy, Demographics. "Theo"=god: Theology, Theocracy, Atheist. "Chrono"=time: Chronological, Anachronism.'},
    {title:'High-Frequency OWS', detail:'Omnivore=eats both plants and animals. Insolvent=cannot pay debts. Infallible=incapable of error. Invincible=cannot be defeated. Inevitable=cannot be avoided. Legible=can be read easily. Credulous=too easily believes things. Obese=excessively fat. Verbose=uses too many words. Teetotaler=abstains from alcohol.'},
    {title:'Person-Based OWS', detail:'Cosmopolitan=citizen of the world. Centenarian=person who is 100+. Octogenarian=80s. Septuagenarian=70s. Misanthrope=hates people. Misogynist=hates women. Misogamist=hates marriage. Hypochondriac=thinks they are ill. Introvert=inward-looking. Extrovert=outward-looking.'}
  ],
  hook:'⚡ SSC OWS Hall Trick: Root word approach. See unfamiliar word in options → break it down. "Infanticide" = infants(baby) + cide(killing) = killing of a baby. "Bibliophile" = biblio(books) + phile(lover) = book lover. Learning 10 roots covers 60% of all OWS questions. The roots: phil(love), phobia(fear), logy(study), cide(kill), poly(many), mono(one), auto(self).',
  cards:[
    {front:'One word for "a person who knows many languages"?', back:'Polyglot. Poly=many+glot=tongue/language. Also: Linguist (person skilled in languages but can be fewer).'},
    {front:'One word for "one who studies birds"?', back:'Ornithologist. Ornitho=bird+logy=study+ist=person. Study of birds = Ornithology. Person = Ornithologist.'},
    {front:'One word for "one who abstains from alcohol"?', back:'Teetotaler. Also: Abstainer. Note: Vegetarian=abstains from meat, not alcohol. Teetotaler is specifically alcohol.'}
  ],
  q:[
    {q:'One word for "a person who hates mankind in general"?', options:['Misogynist','Misanthrope','Philanthropist','Introvert'], answer_index:1, explanation:'Misanthrope = Misanthropia (Greek) = miso(hate)+anthropos(human). Hates all of humanity. Misogynist=hates women specifically. Philanthropist=loves humanity (opposite). Introvert=inward personality.'},
    {q:'What is the one word for "government by a single absolute ruler"?', options:['Democracy','Oligarchy','Autocracy','Theocracy'], answer_index:2, explanation:'Autocracy = auto(self)+cracy(rule) = rule by oneself = absolute rule by one person. Democracy=rule by people. Oligarchy=rule by few. Theocracy=rule by god/religion.'}
  ],
  pyq:'Every SSC paper — 4-5 OWS questions. Root method is the systematic approach.',
  summary:'Root words: phil(love)+phobia(fear)+logy(study)+cide(kill)+poly(many)+mono(one)+auto(self)+demo(people)+theo(god)+chrono(time). High-yield: Omnivore+Infallible+Teetotaler+Credulous+Verbose+Misanthrope+Polyglot+Ornithologist+Autocracy. Person-by-age: Centenarian(100)+Octogenarian(80)+Septuagenarian(70).'
},
{
  day:30, topic:'Synonyms, Antonyms & Vocabulary Strategy',
  notes:[
    {title:'High-Frequency Synonyms (SSC)', detail:'Abate=decrease/diminish. Acrimonious=bitter/harsh. Admonish=warn/reprimand. Affluent=wealthy/rich. Alleviate=relieve/ease. Ambiguous=unclear/vague. Amiable=friendly/pleasant. Arduous=difficult/strenuous. Austere=severe/strict. Benevolent=kind/charitable. Brevity=shortness/conciseness. Candid=frank/honest.'},
    {title:'High-Frequency Antonyms', detail:'Verbose↔Concise. Loquacious↔Taciturn. Belligerent↔Peaceful. Acrimonious↔Amiable. Obstinate↔Flexible. Gregarious↔Solitary. Penurious↔Generous. Ephemeral↔Eternal. Perspicacious↔Obtuse. Vociferous↔Quiet. Sycophant↔Critic. Phlegmatic↔Excitable.'},
    {title:'Elimination Strategy for Unknown Words', detail:'Step 1: Eliminate options clearly wrong in context. Step 2: Use prefixes (un-, dis-, in-, mis-) to guess meaning. Step 3: Check if word sounds positive/negative from context. Step 4: Between two remaining options, choose based on strength of meaning. Do NOT guess randomly — partial information usually available.'},
    {title:'Root-Based Vocabulary', detail:'Bene=good: Benevolent, Benefactor, Beneficial. Mal=bad: Malevolent, Malicious, Malign. Magn=great: Magnificent, Magnanimous. Equi=equal: Equitable, Equivocate. Luc/Lum=light: Lucid, Luminous. Terr=earth: Territory, Terrestrial. Voc=voice/call: Vociferous, Advocate, Invoke.'}
  ],
  hook:'⚡ SSC Vocab Hall Trick: For any unknown word, identify its TONE first — positive or negative. "Acrimonious" has "acri" (sharp/bitter) → negative. Then match with a negative option. "Magnanimous" has "magn" (great) + "animus" (spirit) → positive, generous. Tone identification eliminates 2 wrong options instantly even without knowing exact meaning.',
  cards:[
    {front:'Synonym of "Laconic"?', back:'"Brief/Concise." Laconic means using few words. Origin: Spartans (from Laconia) were famous for brief speech. Antonym: Verbose/Loquacious/Garrulous.'},
    {front:'Antonym of "Gregarious"?', back:'"Solitary/Reclusive." Gregarious=fond of company, sociable, outgoing. Antonym = prefers to be alone. Misanthropic is close but specifically implies hatred, not just preference for solitude.'},
    {front:'Synonym of "Obfuscate"?', back:'"Confuse/Make unclear." Ob=against+fusc=dark=to darken/obscure. "Obfuscate the truth" = obscure/confuse deliberately. Antonym: Clarify/Elucidate/Illuminate.'}
  ],
  q:[
    {q:'Choose the synonym of "Perfidious":', options:['Loyal','Treacherous','Generous','Timid'], answer_index:1, explanation:'"Perfidious" = per(through)+fid(faith/trust) = breaking trust = treacherous/disloyal/deceitful. The "per" prefix often means "through/away from" and "fid" relates to faith (like fidelity). Treacherous is the correct synonym.'},
    {q:'Choose the antonym of "Taciturn":', options:['Silent','Reserved','Loquacious','Shy'], answer_index:2, explanation:'"Taciturn" = habitually silent, says little. Antonym = talks a lot = Loquacious (or Garrulous, Verbose, Talkative). "Loquacious" is the direct antonym — from "loqui" (Latin, to speak). Taciturn↔Loquacious is a classic SSC vocabulary pair.'}
  ],
  pyq:'Every SSC paper — 4-6 vocabulary questions in Synonyms, Antonyms, and Cloze Test.',
  summary:'Key pairs: Laconic↔Verbose. Taciturn↔Loquacious. Gregarious↔Solitary. Acrimonious↔Amiable. Benevolent↔Malevolent. Perfidious=treacherous. Obfuscate=confuse. Magnanimous=generous. Strategy: identify TONE(positive/negative)→eliminate 2 wrong options→choose from remaining by strength of meaning. Root words: bene(good),mal(bad),loqui(speak),fid(faith).'
}
];

async function push() {
  for(const d of days){
    const payload = {
      topic_title:d.topic, day_number:d.day, track:'ssc_ecosystem',
      curriculum_metadata:{yield_category:'high_yield',weightage:10,is_premium:true,platinum:true,pyq_frequency:d.pyq},
      snapshot:{title:d.topic,quick_notes:d.notes,exam_hook:'⚡ **SSC Hall Trick**: '+d.hook},
      quick_note_cards:d.cards.map(c=>({title:'Speed Card',front:c.front,back:c.back})),
      video_recommendations:[{title:'SSC English Master: '+d.topic,url:'https://youtube.com/results?search_query='+encodeURIComponent('SSC CGL English '+d.topic+' tricks'),why:'Best vocabulary and grammar tutorial.'}],
      quiz:{questions:d.q.map(q=>({question:q.q,options:q.options,answer_index:q.answer_index,answer:q.options[q.answer_index],explanation:q.explanation}))},
      smart_revision_summary:{mini_grid:d.topic+' | W:10 | '+d.pyq,one_screen_summary:d.summary}
    };
    const {error}=await s.from('master_content_vault').upsert({track_id:'ssc_ecosystem',day_number:d.day,topic_title:d.topic,content_json:payload,updated_at:new Date().toISOString()},{onConflict:'track_id,day_number'});
    if(error) console.error('Day '+d.day+':',error.message);
    else console.log('SSC Day '+d.day+' PUSHED: '+d.topic);
  }
  console.log('SSC Days 26-30 COMPLETE');
}
push();
