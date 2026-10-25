/**
 * Production bank builder for SSC CGL "Spot the Error".
 *   30 reviewed questions (sample-batch, external "CONTINUE" verdict)
 * + 50 new questions authored to content-generation-brief.md §2/§3.
 *
 * Emits scripts/seo/content/ssc-english-error-spotting.json (the bank that
 * build-vetted-topic-pages.cjs publishes) and prints a QA report:
 *   - structural-signature dedup (RULE + STRUCTURE), within the batch and vs the 30
 *   - answer-position distribution (pool must be <=35% per index)
 *   - difficulty split
 *   - format split (4-segment ~85% / 3-part + "No error" ~15%)
 *
 * `sig` on each new item = my RULE+STRUCTURE signature; not published.
 */
const fs = require('fs');
const path = require('path');
const SEED = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample-batch-ssc-error-spotting.json'), 'utf8'));

const Q4 = 'Select the segment of the sentence that contains a grammatical error.\n';
const Q3 = "Select the part of the sentence that has an error. If there is no error, select 'No error'.\n";
const NODE = 'ssc:english:error-spotting';
const src = (rule) => `SSC CGL Tier-1 English — Spot the Error (rule: ${rule})`;

// helper: 4-segment item
function seg4(sentence, parts, answer_index, explanation, difficulty, rule, sig) {
  return { question: Q4 + sentence, options: parts, answer_index, explanation,
    difficulty, question_type: 'verbal', syllabus_node: NODE, source: src(rule), lang: 'en', sig };
}
// helper: 3-part + "No error"
function seg3(sentence, parts, answer_index, explanation, difficulty, rule, sig) {
  return { question: Q3 + sentence, options: [...parts, 'No error'], answer_index, explanation,
    difficulty, question_type: 'verbal', syllabus_node: NODE, source: src(rule), lang: 'en', sig };
}

const NEW = [
  // ===================== SUBJECT–VERB AGREEMENT (9) =====================
  seg4(
    'The list of successful candidates / have been put up / on the college notice board / by the office staff.',
    ['The list of successful candidates', 'have been put up', 'on the college notice board', 'by the office staff.'],
    1, "The subject is the singular 'list', not the plural 'candidates' in the modifying phrase, so the verb must be singular: 'has been put up'.",
    'medium', 'SVA — singular head noun separated by an of-phrase', 'SVA_HEADNOUN_OF_PHRASE'),
  seg4(
    'Either the manager / or his assistants / has to sign / the approval form before noon.',
    ['Either the manager', 'or his assistants', 'has to sign', 'the approval form before noon.'],
    2, "With 'either ... or ...', the verb agrees with the nearer subject. Here that is the plural 'assistants', so it should be 'have to sign'.",
    'medium', "either ... or ... proximity agreement", 'SVA_EITHER_OR_PROXIMITY'),
  seg4(
    'Every boy and every girl / in the senior school / were asked / to bring a water bottle.',
    ['Every boy and every girl', 'in the senior school', 'were asked', 'to bring a water bottle.'],
    2, "When 'every ... and every ...' joins two subjects, the verb stays singular: 'was asked'.",
    'medium', "'every ... and every ...' takes a singular verb", 'SVA_EVERY_AND_EVERY'),
  seg4(
    'Mathematics / have always been / my favourite subject / right from primary school.',
    ['Mathematics', 'have always been', 'my favourite subject', 'right from primary school.'],
    1, "'Mathematics' as the name of a subject is singular despite the -s ending, so the verb is 'has always been'.",
    'easy', 'subjects ending in -s that are singular', 'SVA_MATHEMATICS_SINGULAR'),
  seg4(
    'The quality of the questions / asked in the interview / were / surprisingly poor.',
    ['The quality of the questions', 'asked in the interview', 'were', 'surprisingly poor.'],
    2, "The subject is the singular 'quality'; 'of the questions' is only a modifier. The verb should be 'was'.",
    'hard', "'the quality of + plural' takes a singular verb", 'SVA_QUALITY_OF_X'),
  seg4(
    'There is / a pen, two files and a stapler / lying / inside the top drawer.',
    ['There is', 'a pen, two files and a stapler', 'lying', 'inside the top drawer.'],
    0, "In a 'there is/are' sentence the verb agrees with the first item of the list that follows. Here the list is plural in effect, and standard usage takes 'There are'.",
    'medium', "'there is/are' + compound subject", 'SVA_THERE_IS_PLURAL'),
  seg4(
    'Neither of the candidates / were / found suitable / for the senior analyst post.',
    ['Neither of the candidates', 'were', 'found suitable', 'for the senior analyst post.'],
    1, "'Neither of + plural noun' takes a singular verb: 'was found'.",
    'hard', "'neither of' + singular verb", 'SVA_NEITHER_OF_SINGULAR'),
  seg4(
    'Physics and chemistry / is / taught by the same teacher / to the senior batch this year.',
    ['Physics and chemistry', 'is', 'taught by the same teacher', 'to the senior batch this year.'],
    1, "Two distinct subjects joined by 'and' take a plural verb: 'are taught'. (Contrast a single combined idea like 'bread and butter is'.)",
    'medium', 'two distinct subjects joined by "and"', 'SVA_TWO_DISTINCT_AND'),
  seg4(
    'The number of road accidents / have increased / sharply / since the bypass was opened.',
    ['The number of road accidents', 'have increased', 'sharply', 'since the bypass was opened.'],
    1, "'The number of ...' is singular and takes 'has increased'. (Only 'A number of ...' is plural.)",
    'hard', "'the number of' vs 'a number of'", 'SVA_THE_NUMBER_OF'),

  // ===================== TENSE / VERB FORM (8) =====================
  seg4(
    'I have seen / that documentary / last Sunday / along with my roommates.',
    ['I have seen', 'that documentary', 'last Sunday', 'along with my roommates.'],
    0, "A finished past time such as 'last Sunday' cannot go with the present perfect. It should be the simple past: 'I saw'.",
    'medium', 'present perfect not used with a finished past time', 'TENSE_PRESPERF_FINISHED_TIME'),
  seg4(
    'As soon as the guests will arrive, / the caterers / will serve / dinner in the main hall.',
    ['As soon as the guests will arrive,', 'the caterers', 'will serve', 'dinner in the main hall.'],
    0, "A future time clause introduced by 'as soon as' takes the present tense, not 'will': 'As soon as the guests arrive'.",
    'hard', 'no "will" in a future adverbial time clause', 'TENSE_NO_WILL_IN_TIME_CLAUSE'),
  seg4(
    'Ever since he has joined the team, / the quarterly results / have improved / quite noticeably.',
    ['Ever since he has joined the team,', 'the quarterly results', 'have improved', 'quite noticeably.'],
    0, "The 'ever since' clause marks a starting point and takes the simple past: 'Ever since he joined the team'. The main clause correctly stays in the present perfect.",
    'hard', "'ever since' clause takes the simple past", 'TENSE_EVER_SINCE_SIMPLE_PAST'),
  seg4(
    'He has been / repairing watches / at that little stall / for he left school.',
    ['He has been', 'repairing watches', 'at that little stall', 'for he left school.'],
    3, "A starting event, not a duration, follows 'since', not 'for': 'since he left school'.",
    'hard', "'since' + starting-point clause (not 'for')", 'TENSE_SINCE_CLAUSE_NOT_FOR'),
  seg4(
    'If he would have informed me earlier, / I would have / arranged / a cab to the station.',
    ['If he would have informed me earlier,', 'I would have', 'arranged', 'a cab to the station.'],
    0, "In a past unreal condition the if-clause takes the past perfect, not 'would have': 'If he had informed me earlier'.",
    'hard', "third conditional — if-clause takes past perfect", 'TENSE_THIRD_CONDITIONAL_IF'),
  seg4(
    'It is high time / the municipal board / takes / strict action against illegal parking.',
    ['It is high time', 'the municipal board', 'takes', 'strict action against illegal parking.'],
    2, "'It is high time' is followed by the past subjunctive: 'took strict action'.",
    'hard', "'it is high time' + past subjunctive", 'TENSE_HIGH_TIME_SUBJUNCTIVE'),
  seg4(
    'My colleagues often say / that they wish they / can speak / as fluently as the trainer does.',
    ['My colleagues often say', 'that they wish they', 'can speak', 'as fluently as the trainer does.'],
    2, "After 'wish', a present-time unreal situation is expressed with the past form: 'could speak', not 'can speak'.",
    'medium', "'wish' + past form for an unreal present", 'TENSE_WISH_PAST_FORM'),
  seg4(
    'She was working / in this firm / since 2015 / before she moved to Bengaluru.',
    ['She was working', 'in this firm', 'since 2015', 'before she moved to Bengaluru.'],
    0, "A past action running from a point in the past up to a later past event takes the past perfect continuous: 'She had been working'.",
    'hard', 'past perfect continuous with "since" + past reference', 'TENSE_PAST_PERF_CONT_SINCE'),

  // ===================== PREPOSITIONS (7) =====================
  seg4(
    'Discussing about the syllabus / took up / most of the meeting / that was fixed for Friday.',
    ['Discussing about the syllabus', 'took up', 'most of the meeting', 'that was fixed for Friday.'],
    0, "'Discuss' is transitive and takes no 'about': 'Discussing the syllabus'.",
    'easy', "'discuss' takes no 'about'", 'PREP_DISCUSS_ABOUT'),
  seg4(
    'Her new laptop / is far superior / than the model / she was using last year.',
    ['Her new laptop', 'is far superior', 'than the model', 'she was using last year.'],
    2, "'Superior' is followed by 'to', not 'than': 'superior to the model'.",
    'medium', "'superior to' (not 'than')", 'PREP_SUPERIOR_TO'),
  seg4(
    'Most young viewers / prefer short videos / than long documentaries / on their phones.',
    ['Most young viewers', 'prefer short videos', 'than long documentaries', 'on their phones.'],
    2, "'Prefer' takes 'to', not 'than', when comparing two things: 'prefer short videos to long documentaries'.",
    'medium', "'prefer X to Y' (not 'than')", 'PREP_PREFER_TO'),
  seg4(
    'The new intern / is quite capable / to handle / the billing software on her own.',
    ['The new intern', 'is quite capable', 'to handle', 'the billing software on her own.'],
    2, "'Capable' is followed by 'of + -ing': 'capable of handling'.",
    'medium', "'capable of + -ing'", 'PREP_CAPABLE_OF'),
  seg4(
    'My younger cousin / is very good / in solving / crossword puzzles and riddles.',
    ['My younger cousin', 'is very good', 'in solving', 'crossword puzzles and riddles.'],
    2, "One is 'good at' an activity, not 'good in': 'good at solving'.",
    'easy', "'good at' an activity", 'PREP_GOOD_AT'),
  seg4(
    'The minister / was accompanied / with two senior officers / on the site inspection.',
    ['The minister', 'was accompanied', 'with two senior officers', 'on the site inspection.'],
    2, "A person is 'accompanied by' someone; 'accompanied with' is used only for things: 'accompanied by two senior officers'.",
    'medium', "'accompanied by' a person", 'PREP_ACCOMPANIED_BY'),
  seg4(
    'After the overnight journey / the tired trekkers / finally reached / to the base camp.',
    ['After the overnight journey', 'the tired trekkers', 'finally reached', 'to the base camp.'],
    3, "'Reach' is transitive and takes no 'to': 'reached the base camp'.",
    'easy', "'reach' takes no 'to'", 'PREP_REACH_NO_TO'),

  // ===================== ARTICLES / DETERMINERS (5) =====================
  seg4(
    'He completed / his post-graduation / from an university / in central India.',
    ['He completed', 'his post-graduation', 'from an university', 'in central India.'],
    2, "'University' begins with a 'yoo' consonant sound, so it takes 'a', not 'an': 'a university'.",
    'easy', "a/an by sound — 'a university'", 'ART_A_BEFORE_YOO'),
  seg4(
    'The coach reminded us / that we should / play the football / only after the warm-up.',
    ['The coach reminded us', 'that we should', 'play the football', 'only after the warm-up.'],
    2, "Names of games take no article: 'play football'.",
    'easy', 'no article before the name of a game', 'ART_NO_THE_BEFORE_GAME'),
  seg4(
    'There were / a little less than / hundred people / at the book launch.',
    ['There were', 'a little less than', 'hundred people', 'at the book launch.'],
    2, "'Hundred' needs 'a' (or a number) before it: 'a hundred people'.",
    'medium', "'a hundred' — article before 'hundred'", 'ART_A_BEFORE_HUNDRED'),
  seg4(
    'There were / far less mistakes / in her second draft / than in the first one.',
    ['There were', 'far less mistakes', 'in her second draft', 'than in the first one.'],
    1, "'Mistakes' is countable, so it takes 'fewer', not 'less': 'far fewer mistakes'.",
    'medium', "'fewer' with countable nouns", 'DET_FEWER_COUNTABLE'),
  seg4(
    'The Everest / is / the highest peak / in the entire Himalayan range.',
    ['The Everest', 'is', 'the highest peak', 'in the entire Himalayan range.'],
    0, "Individual mountain peaks take no 'the' (only ranges do): it should be 'Everest', not 'The Everest'.",
    'medium', "no 'the' before a single mountain peak", 'ART_NO_THE_BEFORE_PEAK'),

  // ===================== PRONOUNS (4) =====================
  seg4(
    'Let you and I / go through the draft / once more / before it is circulated.',
    ['Let you and I', 'go through the draft', 'once more', 'before it is circulated.'],
    0, "'Let' takes the object form, so it is 'Let you and me'.",
    'medium', 'object pronoun after "let"', 'PRON_LET_OBJECT'),
  seg4(
    'While running across the yard, / the excited puppy / hurt it’s paw / on a sharp stone.',
    ['While running across the yard,', 'the excited puppy', 'hurt it’s paw', 'on a sharp stone.'],
    2, "'It's' means 'it is'. The possessive is 'its': 'hurt its paw'.",
    'easy', "its (possessive) vs it's (it is)", 'PRON_ITS_APOSTROPHE'),
  seg4(
    'This umbrella is not mine; / I think / it is her’s / or perhaps Radha’s.',
    ['This umbrella is not mine;', 'I think', 'it is her’s', 'or perhaps Radha’s.'],
    2, "Possessive pronouns take no apostrophe: 'hers', not 'her's'.",
    'easy', "possessive pronouns take no apostrophe", 'PRON_POSSESSIVE_NO_APOS'),
  seg4(
    'The manager wants / to know / who you handed / the spare keys to yesterday.',
    ['The manager wants', 'to know', 'who you handed', 'the spare keys to yesterday.'],
    2, "The pronoun is the object of 'to', so it should be 'whom you handed the spare keys to'.",
    'hard', 'whom as the object of a preposition', 'PRON_WHOM_OBJECT'),

  // ===================== ADJECTIVE / ADVERB / DEGREE (4) =====================
  seg4(
    'Of the two routes to the airport, / this one / is shortest / and far less crowded.',
    ['Of the two routes to the airport,', 'this one', 'is shortest', 'and far less crowded.'],
    2, "With only two items the comparative is used, with 'the': 'is the shorter'.",
    'hard', 'comparative (not superlative) for two', 'DEG_COMPARATIVE_FOR_TWO'),
  seg4(
    'Among all the participants, / Sarita performed / the most best / in the rapid-fire round.',
    ['Among all the participants,', 'Sarita performed', 'the most best', 'in the rapid-fire round.'],
    2, "'Best' is already superlative; 'most best' is a double superlative. It should be just 'the best'.",
    'easy', 'double superlative', 'DEG_DOUBLE_SUPERLATIVE'),
  seg4(
    'The teacher asked us / to revise / the two first chapters / before the surprise test.',
    ['The teacher asked us', 'to revise', 'the two first chapters', 'before the surprise test.'],
    2, "The ordinal comes before the number: 'the first two chapters'.",
    'medium', "word order — 'the first two'", 'ORDER_FIRST_TWO'),
  seg4(
    'He now speaks English / more fluently / than any student / in his coaching batch.',
    ['He now speaks English', 'more fluently', 'than any student', 'in his coaching batch.'],
    2, "He is himself a student in that batch, so the comparison needs 'any other student'.",
    'hard', "'than any other' when comparing within one's own group", 'DEG_THAN_ANY_OTHER'),

  // ===================== REDUNDANCY / DICTION (2) =====================
  seg4(
    'In my personal opinion, / the revised scheme / will mainly benefit / the salaried middle class.',
    ['In my personal opinion,', 'the revised scheme', 'will mainly benefit', 'the salaried middle class.'],
    0, "An opinion is by definition personal, so 'personal' is redundant: 'In my opinion'.",
    'easy', 'redundancy — "personal opinion"', 'RED_PERSONAL_OPINION'),
  seg4(
    'The report highlighted / several achievements / and one long-awaited / new innovation.',
    ['The report highlighted', 'several achievements', 'and one long-awaited', 'new innovation.'],
    3, "An innovation is by definition new, so 'new innovation' is redundant: just 'innovation'.",
    'medium', 'redundancy — "new innovation"', 'RED_NEW_INNOVATION'),

  // ===================== CONJUNCTIONS / PARALLELISM (3) =====================
  seg4(
    'He is not only / good at cricket / but also / in badminton.',
    ['He is not only', 'good at cricket', 'but also', 'in badminton.'],
    3, "The parts joined by 'not only ... but also ...' must be parallel. 'good at cricket' needs 'good at badminton' (or 'at badminton'), not 'in badminton'.",
    'hard', "parallel structure with 'not only ... but also'", 'PARALLEL_NOT_ONLY_BUT_ALSO'),
  seg4(
    'Hurry with the application / lest you should not / get a place / in the very first batch.',
    ['Hurry with the application', 'lest you should not', 'get a place', 'in the very first batch.'],
    1, "'Lest' already carries a negative meaning, so 'not' is wrong: 'lest you should get a place ...' becomes 'lest you should fail to get a place', i.e. drop 'not' — 'lest you should not get' is a double negative.",
    'hard', "'lest ... should' (no 'not')", 'CONJ_LEST_NO_NOT'),
  seg4(
    'Both the head coach / as well as the players / were confident / of winning the final.',
    ['Both the head coach', 'as well as the players', 'were confident', 'of winning the final.'],
    1, "'Both' pairs with 'and', not 'as well as': 'Both the head coach and the players'.",
    'medium', "'both ... and' (not 'both ... as well as')", 'CONJ_BOTH_AND'),

  // ===================== 3-PART + "No error" (8; 3 genuinely no error) =====================
  seg3(
    'The number of applicants this year / is much higher / than it was last year.',
    ['The number of applicants this year', 'is much higher', 'than it was last year.'],
    3, "The sentence is correct: 'the number of ...' correctly takes the singular 'is', and 'higher than' is the right comparison. 'No error'.",
    'medium', "'the number of' + singular verb (correct)", 'NOERR_THE_NUMBER_OF'),
  seg3(
    'Neither of the two answers / was marked correct / by the external examiner.',
    ['Neither of the two answers', 'was marked correct', 'by the external examiner.'],
    3, "The sentence is correct: 'neither of ...' takes the singular 'was'. 'No error'.",
    'medium', "'neither of' + singular verb (correct)", 'NOERR_NEITHER_OF'),
  seg3(
    'She is one of the most experienced nurses / that the hospital / has ever employed.',
    ['She is one of the most experienced nurses', 'that the hospital', 'has ever employed.'],
    3, "The sentence is correct: 'one of the most experienced nurses' is plural, and 'that the hospital has ever employed' correctly uses the singular 'has' for 'the hospital'. 'No error'.",
    'hard', "'one of the + superlative + plural noun' (correct)", 'NOERR_ONE_OF_SUPERLATIVE'),
  seg3(
    'Scarcely had the meeting started / than the power / went off across the building.',
    ['Scarcely had the meeting started', 'than the power', 'went off across the building.'],
    0, "'Scarcely' pairs with 'when', not 'than': 'Scarcely had the meeting started when the power went off'. ('No sooner' takes 'than'.)",
    'medium', "'scarcely ... when' correlative", 'CORREL_SCARCELY_WHEN'),
  seg3(
    'Fifty thousand rupees / are a huge sum / for a fresher to earn every month.',
    ['Fifty thousand rupees', 'are a huge sum', 'for a fresher to earn every month.'],
    1, "A sum of money treated as a single amount takes a singular verb: 'is a huge sum'.",
    'medium', 'a sum of money as a single unit', 'SVA_SUM_AS_UNIT'),
  seg3(
    'My father goes to work / by a bus / on most working days.',
    ['My father goes to work', 'by a bus', 'on most working days.'],
    1, "'By' + means of transport takes no article: 'by bus'.",
    'easy', "'by bus' — no article with means of transport", 'ART_BY_TRANSPORT_NO_A'),
  seg3(
    'This route is more preferable / than the coastal highway / during the monsoon months.',
    ['This route is more preferable', 'than the coastal highway', 'during the monsoon months.'],
    0, "'Preferable' is already comparative, so 'more preferable' is wrong; it also takes 'to', not 'than'. It should be 'preferable to the coastal highway'.",
    'medium', "'preferable' is already comparative and takes 'to'", 'DEG_MORE_PREFERABLE'),
  seg3(
    'No sooner did the umpire raise his finger / when the crowd / burst into loud applause.',
    ['No sooner did the umpire raise his finger', 'when the crowd', 'burst into loud applause.'],
    0, "'No sooner' pairs with 'than', not 'when': 'No sooner did the umpire raise his finger than the crowd burst into applause'.",
    'medium', "'no sooner ... than' correlative", 'CORREL_NO_SOONER_THAN'),
];

// ---------------- assemble + QA ----------------
const seed = SEED.questions.map((q, i) => ({ ...q, sig: 'SEED_' + (i + 1) }));
const bank = [...seed, ...NEW];

function structSig(q) {
  // published items have no sig; derive a coarse one for seed dedup sanity only
  return q.sig || 'SEED';
}
const report = [];
// 1. signature dedup within NEW and vs the concept of SEED rules
const sigs = NEW.map((q) => q.sig);
const dupSig = sigs.filter((s, i) => sigs.indexOf(s) !== i);
report.push(`new items: ${NEW.length}`);
report.push(`duplicate structural signatures within new batch: ${dupSig.length ? dupSig.join(', ') : 'none'}`);

// 2. exact-text dedup across the whole bank
const texts = bank.map((q) => q.question.split('\n')[1].toLowerCase().replace(/[^a-z ]/g, '').trim());
const dupText = texts.filter((t, i) => texts.indexOf(t) !== i);
report.push(`duplicate sentences across pool: ${dupText.length ? dupText.length : 'none'}`);

// 3. structural checks
let bad = 0;
bank.forEach((q, i) => {
  if (q.options.length !== 4) { report.push(`  !! Q${i + 1} not 4 options`); bad++; }
  if (q.answer_index < 0 || q.answer_index > 3) { report.push(`  !! Q${i + 1} bad answer_index`); bad++; }
  if (!q.explanation || !q.explanation.trim()) { report.push(`  !! Q${i + 1} no explanation`); bad++; }
});
report.push(`structural defects: ${bad}`);

// 4. answer-position distribution
const idx = { 0: 0, 1: 0, 2: 0, 3: 0 };
bank.forEach((q) => idx[q.answer_index]++);
const n = bank.length;
report.push(`answer_index pool (${n}): ` + Object.entries(idx).map(([k, v]) => `${k}:${v} (${Math.round(v / n * 100)}%)`).join('  '));
const over = Object.values(idx).some((v) => v / n > 0.35);
report.push(`  any index > 35%? ${over ? 'YES — REBALANCE' : 'no'}`);

// 5. difficulty split
const diff = { easy: 0, medium: 0, hard: 0 };
bank.forEach((q) => diff[q.difficulty]++);
report.push(`difficulty pool: easy ${diff.easy} (${Math.round(diff.easy / n * 100)}%) / medium ${diff.medium} (${Math.round(diff.medium / n * 100)}%) / hard ${diff.hard} (${Math.round(diff.hard / n * 100)}%)`);

// 6. format split
const three = bank.filter((q) => q.options.includes('No error')).length;
const noErr = bank.filter((q) => q.options.includes('No error') && q.options[q.answer_index] === 'No error').length;
report.push(`format: 4-segment ${n - three} (${Math.round((n - three) / n * 100)}%) / 3-part+"No error" ${three} (${Math.round(three / n * 100)}%)`);
report.push(`  of the 3-part items, answer = "No error": ${noErr} (${Math.round(noErr / three * 100)}%)`);

// ---- emit (strip `sig`) ----
const out = {
  meta: {
    exam: 'SSC CGL', subject: 'English Comprehension', umbrella: 'Grammar',
    topic: 'Spot the Error (Error Detection)', route: '/ssc/english/error-spotting/',
    redis_key: 'quiz:subject:english:ssc:error-spotting',
    bank: 'production-001 (30 reviewed seed + 50 new, brief §2/§3)',
    count: n, standards_ref: 'scripts/seo/content-generation-brief.md',
    difficulty_split: `easy ${diff.easy} / medium ${diff.medium} / hard ${diff.hard}`,
    answer_index_split: `0:${idx[0]} 1:${idx[1]} 2:${idx[2]} 3:${idx[3]}`,
    format_split: `4-segment ${n - three} / 3-part+No-error ${three} (No-error is the answer in ${noErr})`,
  },
  questions: bank.map(({ sig, ...q }) => q),
};
fs.writeFileSync(path.join(__dirname, 'ssc-english-error-spotting.json'), JSON.stringify(out, null, 2) + '\n');
console.log(report.join('\n'));
console.log('\nwrote scripts/seo/content/ssc-english-error-spotting.json (' + n + ' questions)');
