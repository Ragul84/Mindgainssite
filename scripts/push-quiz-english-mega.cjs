require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const REDIS_URL = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const KEY = 'quiz:subject:english';

async function rpush(items) {
  const res = await fetch(`${REDIS_URL}/rpush/${encodeURIComponent(KEY)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(items.map(q => JSON.stringify(q))),
  });
  return res.json();
}

const questions = [
  // EASY – Vocabulary, basic grammar
  { question_text: "The antonym of 'ancient' is:", options: ["Old", "Modern", "Historical", "Classic"], correct_answer: 1, explanation: "'Ancient' means very old or from a long time ago. Its antonym is 'Modern' (new/recent).", difficulty: "easy", exam_types: ["tnpsc","ssc","banking","rrb"] },
  { question_text: "The synonym of 'begin' is:", options: ["End", "Pause", "Commence", "Stop"], correct_answer: 2, explanation: "'Commence' means to begin or start. It is a synonym of 'begin'.", difficulty: "easy", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "Which of these is a noun?", options: ["Run", "Beautiful", "Quickly", "Happiness"], correct_answer: 3, explanation: "'Happiness' is a noun (a state of being). 'Run' is a verb, 'Beautiful' is an adjective, 'Quickly' is an adverb.", difficulty: "easy", exam_types: ["tnpsc","ssc"] },
  { question_text: "Choose the correct spelling:", options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"], correct_answer: 1, explanation: "The correct spelling is 'Accommodate' (double 'c' and double 'm').", difficulty: "easy", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "The plural of 'child' is:", options: ["Childs", "Childes", "Children", "Childern"], correct_answer: 2, explanation: "'Child' has an irregular plural — 'Children'.", difficulty: "easy", exam_types: ["tnpsc","ssc"] },
  { question_text: "The antonym of 'victory' is:", options: ["Win", "Champion", "Defeat", "Success"], correct_answer: 2, explanation: "'Victory' means winning. Its antonym is 'Defeat' (losing).", difficulty: "easy", exam_types: ["tnpsc","ssc","banking","rrb"] },
  { question_text: "Fill in the blank: She ___ going to school every day.", options: ["are", "is", "am", "were"], correct_answer: 1, explanation: "'She' is third person singular, so we use 'is'. 'She is going to school every day.'", difficulty: "easy", exam_types: ["tnpsc","ssc"] },
  { question_text: "The synonym of 'happy' is:", options: ["Sad", "Angry", "Joyful", "Worried"], correct_answer: 2, explanation: "'Joyful' means feeling or expressing great joy — a synonym of happy.", difficulty: "easy", exam_types: ["tnpsc","ssc","rrb"] },
  { question_text: "Which word is an adjective?", options: ["Swim", "Slowly", "Beautiful", "Kindness"], correct_answer: 2, explanation: "'Beautiful' is an adjective (describes a noun). 'Swim' is a verb, 'Slowly' is an adverb, 'Kindness' is a noun.", difficulty: "easy", exam_types: ["tnpsc","ssc"] },
  { question_text: "The antonym of 'brave' is:", options: ["Bold", "Courageous", "Daring", "Cowardly"], correct_answer: 3, explanation: "'Brave' means having courage. Its antonym is 'Cowardly' (lacking courage).", difficulty: "easy", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "One who repairs shoes is called:", options: ["Mason", "Cobbler", "Carpenter", "Smith"], correct_answer: 1, explanation: "A cobbler is a person who mends and repairs shoes.", difficulty: "easy", exam_types: ["tnpsc","ssc","rrb"] },
  { question_text: "The past tense of 'go' is:", options: ["Goed", "Goes", "Gone", "Went"], correct_answer: 3, explanation: "'Go' is an irregular verb. Its past tense is 'went'. 'Gone' is the past participle.", difficulty: "easy", exam_types: ["tnpsc","ssc"] },
  { question_text: "Choose the correctly punctuated sentence:", options: ["Its raining outside.", "It's raining outside.", "Its' raining outside.", "Its raining, outside."], correct_answer: 1, explanation: "'It's' = 'It is' (contraction). 'Its' is possessive (e.g., 'The dog wagged its tail'). So 'It's raining outside' is correct.", difficulty: "easy", exam_types: ["tnpsc","ssc"] },
  { question_text: "The antonym of 'expand' is:", options: ["Grow", "Widen", "Contract", "Increase"], correct_answer: 2, explanation: "'Expand' means to grow larger. Its antonym is 'Contract' (to shrink or reduce).", difficulty: "easy", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "'A place where books are kept' is called:", options: ["Museum", "Zoo", "Library", "Gallery"], correct_answer: 2, explanation: "A library is a place where books are kept and can be borrowed or read.", difficulty: "easy", exam_types: ["tnpsc","ssc"] },

  // MEDIUM
  { question_text: "The idiom 'Break the ice' means:", options: ["To physically break ice", "To say something to reduce tension and make people comfortable", "To cause problems", "To make a new friend"], correct_answer: 1, explanation: "'Break the ice' means to say or do something to reduce tension or shyness in an awkward social situation.", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "The one-word substitute for 'one who walks in sleep' is:", options: ["Insomniac", "Somnambulist", "Narcoleptic", "Parasomniac"], correct_answer: 1, explanation: "A somnambulist is a sleepwalker — one who walks while asleep.", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "Choose the correct sentence:", options: ["I have went to the market.", "I have gone to the market.", "I had went to the market.", "I have go to the market."], correct_answer: 1, explanation: "'Have gone' uses the present perfect tense correctly. Past participle of 'go' is 'gone', not 'went'.", difficulty: "medium", exam_types: ["tnpsc","ssc"] },
  { question_text: "The word 'Loquacious' means:", options: ["Silent", "Talkative", "Intelligent", "Aggressive"], correct_answer: 1, explanation: "'Loquacious' means tending to talk a great deal; very talkative.", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "Identify the figure of speech: 'The wind whispered through the trees':", options: ["Simile", "Metaphor", "Personification", "Hyperbole"], correct_answer: 2, explanation: "Personification is giving human qualities to non-human things. 'Whispered' is a human action attributed to the wind.", difficulty: "medium", exam_types: ["tnpsc","ssc"] },
  { question_text: "The passive voice of 'She wrote a letter' is:", options: ["A letter was written by her.", "A letter is written by she.", "A letter has been written by her.", "A letter was write by her."], correct_answer: 0, explanation: "Active: She (subject) + wrote (verb) + a letter (object). Passive: A letter (object) + was written (passive verb) + by her (agent).", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "The antonym of 'transparent' is:", options: ["Clear", "Opaque", "Visible", "Bright"], correct_answer: 1, explanation: "'Transparent' means allowing light to pass through so objects on the other side can be seen. Its antonym is 'Opaque' (not transparent).", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "The idiom 'Hit the nail on the head' means:", options: ["To make a mistake", "To describe exactly what is causing a situation", "To be confused", "To hurt someone"], correct_answer: 1, explanation: "'Hit the nail on the head' means to describe exactly what is causing a problem, or to do or say exactly the right thing.", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "'Omnipotent' means:", options: ["All-knowing", "All-seeing", "All-powerful", "All-present"], correct_answer: 2, explanation: "'Omnipotent' (Latin: omni = all + potens = powerful) means having unlimited power; all-powerful.", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "In reported speech, 'She said, \"I am happy\"' becomes:", options: ["She said that she was happy.", "She said that she is happy.", "She told that she was happy.", "She said that I was happy."], correct_answer: 0, explanation: "In reported/indirect speech: 'I' → 'she'; 'am' → 'was' (past tense shift); 'said' is followed by 'that'.", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "The word 'Ephemeral' means:", options: ["Eternal", "Lasting for a very short time", "Very large", "Deeply meaningful"], correct_answer: 1, explanation: "'Ephemeral' means lasting for only a very short time; transitory. From Greek 'ephemeros' (lasting only a day).", difficulty: "medium", exam_types: ["tnpsc","ssc","banking","upsc"] },
  { question_text: "Choose the sentence with correct subject-verb agreement:", options: ["The team are playing well.", "The team is playing well.", "The teams is playing well.", "The team are plays well."], correct_answer: 1, explanation: "'Team' is a collective noun. When acting as a unit, it takes a singular verb: 'The team is playing well.' (British English may use plural verb here, but in Indian exams, singular is preferred.)", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "The one-word substitute for 'one who is opposed to war' is:", options: ["Patriot", "Pacifist", "Anarchist", "Humanist"], correct_answer: 1, explanation: "A pacifist is someone who believes that war and violence are wrong and who refuses to take part in or support them.", difficulty: "medium", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "Which word is a conjunction?", options: ["Quickly", "Beautiful", "Although", "Run"], correct_answer: 2, explanation: "'Although' is a subordinating conjunction used to introduce a clause that contrasts with the main clause.", difficulty: "medium", exam_types: ["tnpsc","ssc"] },
  { question_text: "The antonym of 'verbose' is:", options: ["Talkative", "Loquacious", "Concise", "Elaborate"], correct_answer: 2, explanation: "'Verbose' means using more words than needed. Its antonym is 'Concise' (brief and clear).", difficulty: "medium", exam_types: ["tnpsc","ssc","banking","upsc"] },

  // HARD
  { question_text: "The word 'Sesquipedalian' refers to:", options: ["A person with a limp", "Long words or the habit of using them", "A type of poetry", "An ancient Roman soldier"], correct_answer: 1, explanation: "'Sesquipedalian' (literally 'foot-and-a-half long') refers to long words or to someone who uses long, rare words.", difficulty: "hard", exam_types: ["upsc","ssc"] },
  { question_text: "Identify the error: 'One of the boys have broken the window.'", options: ["'One' should be 'Each'", "'have' should be 'has' (subject is 'one', singular)", "'boys' should be 'boy'", "No error"], correct_answer: 1, explanation: "The subject is 'one' (singular), not 'boys'. So the verb should be 'has': 'One of the boys has broken the window.'", difficulty: "hard", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "'Sycophant' means:", options: ["A wise person", "A flatterer who seeks favour through insincere praise", "A person who opposes authority", "A philosopher"], correct_answer: 1, explanation: "A sycophant is a person who acts obsequiously towards someone important in order to gain advantage; a flatterer or 'yes-man'.", difficulty: "hard", exam_types: ["upsc","tnpsc","ssc","banking"] },
  { question_text: "The term 'oxymoron' refers to:", options: ["A type of simile using 'like' or 'as'", "Contradictory terms used together (e.g., 'deafening silence')", "A figure of speech comparing unlike things", "Exaggeration for effect"], correct_answer: 1, explanation: "An oxymoron combines contradictory or opposite words to create a special effect (e.g., 'bitter sweet', 'living death', 'open secret').", difficulty: "hard", exam_types: ["tnpsc","ssc"] },
  { question_text: "In the sentence 'The ship which I booked sank', which type of clause is 'which I booked'?", options: ["Adjective (relative) clause", "Adverbial clause", "Noun clause", "Independent clause"], correct_answer: 0, explanation: "'Which I booked' is a relative (adjective) clause introduced by 'which'. It modifies the noun 'ship'. Relative clauses are also called adjective clauses.", difficulty: "hard", exam_types: ["tnpsc","ssc","upsc"] },
  { question_text: "The word 'Ameliorate' means:", options: ["To make worse", "To make better or improve", "To stay the same", "To destroy"], correct_answer: 1, explanation: "'Ameliorate' means to make something bad or unsatisfactory better; to improve a situation. Antonym: 'Exacerbate' (to make worse).", difficulty: "hard", exam_types: ["upsc","tnpsc","ssc","banking"] },
  { question_text: "Identify the correct sentence:", options: ["Neither he nor she are responsible.", "Neither he nor she is responsible.", "Neither he nor she were responsible.", "Neither him nor her is responsible."], correct_answer: 1, explanation: "With 'neither...nor', the verb agrees with the subject closest to it. 'She' is closest and is singular, so 'is' is correct. Also, nominative case 'he'/'she' (not 'him'/'her') is used as subjects.", difficulty: "hard", exam_types: ["tnpsc","ssc","banking"] },
  { question_text: "'Pleonasm' in language refers to:", options: ["Use of metaphors", "Redundant use of words (saying the same thing twice)", "Scientific vocabulary", "Technical jargon"], correct_answer: 1, explanation: "Pleonasm is the use of more words than necessary to express an idea (redundancy). Examples: 'free gift', 'end result', 'past history', 'new innovation'.", difficulty: "hard", exam_types: ["upsc","ssc"] },
];

async function main() {
  const BATCH = 50;
  let total = 0;
  for (let i = 0; i < questions.length; i += BATCH) {
    const batch = questions.slice(i, i + BATCH);
    await rpush(batch);
    total += batch.length;
    console.log(`Batch ${Math.floor(i/BATCH)+1}: pushed ${batch.length} → total ${total}`);
  }
  console.log(`Done! ${total} english questions pushed to ${KEY}`);
}
main().catch(console.error);
