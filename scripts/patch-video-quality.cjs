const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const YT = 'https://www.youtube.com/results?search_query=';

function video(title, query, summary) {
  return { title, url: `${YT}${encodeURIComponent(query)}`, summary };
}

const updates = {
  'upsc_prelims:45': [
    video('Budget Classification: Revenue vs Capital for UPSC', 'upsc budget revenue capital receipts expenditure prelims', 'Use this when the student needs classification clarity between revenue/capital receipts, expenditure heads, and deficit framing.'),
    video('Fiscal Deficit, Revenue Deficit, Primary Deficit PYQ Drill', 'upsc fiscal deficit revenue deficit primary deficit pyq', 'Best for statement-style prelims revision on deficit types and borrowing requirement logic.'),
  ],
  'upsc_prelims:46': [
    video('Repo, Reverse Repo, CRR, SLR Explained for UPSC', 'upsc repo reverse repo crr slr prelims', 'Focused on liquidity tools and the exact distinction between CRR and SLR that prelims often tests.'),
    video('NABARD, SIDBI, EXIM Bank: Institution Matching for UPSC', 'upsc nabard sidbi exim bank prelims', 'Useful for institution-role matching and banking institution elimination questions.'),
  ],
  'upsc_prelims:47': [
    video('MSP, Procurement and CACP for UPSC', 'upsc msp procurement cacp prelims', 'Good for understanding where MSP ends and procurement begins, a common area of confusion.'),
    video('Agriculture and Rural Credit Institutions for UPSC', 'upsc agriculture rural credit nabard self help groups prelims', 'Best for linking NABARD, SHGs, and rural development institutions to prelims questions.'),
  ],
  'upsc_prelims:48': [
    video('GDP, GNP and Inflation Quick Revision for UPSC', 'upsc gdp gnp inflation cpi prelims quick revision', 'A tight recap for GDP/GNP distinction and CPI-led inflation understanding.'),
    video('Economy Week Revision: Deficits, CRR, SLR, NPA', 'upsc economy revision deficits crr slr npa prelims', 'Useful when the student wants one recap across the week’s economy fundamentals.'),
  ],
  'upsc_prelims:52': [
    video('Ecosystem, Food Chain, Food Web for UPSC', 'upsc ecosystem food chain food web prelims', 'Targeted at concept separation between ecosystem structure and feeding relationships.'),
    video('Habitat, Niche and Biodiversity Basics for UPSC', 'upsc habitat niche biodiversity prelims', 'Good for the high-confusion ecology terms that often appear in statement form.'),
  ],
  'upsc_prelims:54': [
    video('Greenhouse Effect, Mitigation and Adaptation for UPSC', 'upsc greenhouse effect mitigation adaptation prelims', 'Focused on conceptual climate vocabulary rather than current-affairs overload.'),
    video('Climate Change Basics with Paris and UNFCCC Context', 'upsc climate change paris unfccc basics prelims', 'Useful for linking climate basics to the agreements without losing conceptual clarity.'),
  ],
  'upsc_prelims:58': [
    video('Environment Revision: Ecology and Biodiversity for UPSC', 'upsc environment revision ecology biodiversity prelims', 'This works as a compact recap of the week’s environment block before mixed questions.'),
    video('Protected Areas and Climate Framework Revision', 'upsc protected areas unfccc biodiversity revision prelims', 'Use this for protected-area distinctions and treaty recall in one sitting.'),
  ],
  'upsc_prelims:59': [
    video('Force, Work, Power and Units for UPSC Science', 'upsc force work power units general science prelims', 'Best for direct physics concept recall without unnecessary numerical complexity.'),
    video('General Science Physics Rapid Revision for Prelims', 'upsc general science physics rapid revision prelims', 'Useful before mock tests to avoid missing easy school-level physics questions.'),
  ],
  'upsc_prelims:60': [
    video('Atom, Molecule, Element, Compound for UPSC Science', 'upsc atom molecule element compound general science prelims', 'Focused on high-confusion chemistry basics and concept separation.'),
    video('Acid, Base and pH Quick Revision for UPSC', 'upsc acid base ph quick revision prelims', 'Good for school-level chemistry recall that often appears as direct prelims questions.'),
  ],
  'upsc_prelims:61': [
    video('Cell, Respiration and Photosynthesis for UPSC', 'upsc cell respiration photosynthesis general science prelims', 'Use this to reinforce the core biology block in one pass.'),
    video('Biology Basics: Mitochondria, Nucleus, Chlorophyll', 'upsc biology basics mitochondria nucleus chlorophyll prelims', 'Useful for direct factual biology questions from NCERT-level content.'),
  ],
  'upsc_prelims:62': [
    video('Disease Vectors and Pathogens for UPSC Science', 'upsc disease vectors pathogens general science prelims', 'Focused on communicable disease basics, vector confusion, and pathogen categories.'),
    video('Public Health Basics: Vaccination, Hygiene, Prevention', 'upsc vaccination hygiene disease prevention prelims', 'Good for prevention-oriented science questions and public-health basics.'),
  ],
  'upsc_prelims:65': [
    video('Science Week Recap: Physics, Chemistry, Biology for UPSC', 'upsc science week recap physics chemistry biology prelims', 'A mixed science recap meant to stabilize all three basic science blocks before mocks.'),
    video('General Science Easy Questions Revision for UPSC', 'upsc general science easy questions revision prelims', 'Useful for avoiding silly misses on high-frequency school-level science questions.'),
  ],
  'upsc_prelims:66': [
    video('CSAT RC: Tone, Inference and Main Idea', 'upsc csat reading comprehension tone inference main idea', 'Use this when the student needs cleaner comprehension judgement rather than just reading speed.'),
    video('CSAT Reading Comprehension Practice with Elimination', 'upsc csat rc elimination practice', 'Focused on passage-bound answering and safer option elimination.'),
  ],
  'upsc_prelims:67': [
    video('CSAT Logical Reasoning: Syllogism and Conditions', 'upsc csat logical reasoning syllogism conditions', 'Good for structured logic, statement discipline, and conditional reasoning.'),
    video('CSAT Arrangement, Blood Relation and Logic Practice', 'upsc csat arrangement blood relation logical reasoning', 'Useful for relation mapping and reasoning under time pressure.'),
  ],
  'upsc_prelims:78': [
    video('Environment Mock Revision: Ecology to Treaties', 'upsc environment mock revision ecology treaties prelims', 'A mock-phase recap connecting ecology basics with the major environment agreements.'),
    video('Environment Statement Practice for UPSC', 'upsc environment statement questions prelims revision', 'Best when the student needs statement-based environment elimination practice.'),
  ],
  'upsc_prelims:79': [
    video('Science Mock Revision: Core Physics, Chemistry, Biology', 'upsc science mock revision physics chemistry biology prelims', 'Useful before mixed mocks to refresh the direct school-level science block.'),
    video('General Science Statement and Fact Revision for UPSC', 'upsc general science statement fact revision prelims', 'Good for quick factual sharpening across the science basics row.'),
  ],
  'upsc_prelims:88': [
    video('CSAT Attempt Order and Time Management', 'upsc csat attempt order time management strategy', 'Focused on sequencing, decision discipline, and avoiding time loss on weak questions.'),
    video('CSAT Mock Review: Accuracy over Panic', 'upsc csat mock review accuracy strategy', 'Useful for stabilizing exam judgement across RC, reasoning, and numeracy.'),
  ],
  'upsc_prelims:94': [
    video('Climate Agreements Final Revision for UPSC', 'upsc climate agreements final revision paris kyoto unfccc', 'A last-stage treaty recap centered on sequence and purpose, not random treaty overload.'),
    video('CBD, CITES and Environment Convention Recall', 'upsc cbd cites environment conventions revision prelims', 'Useful for biodiversity-agreement recall before the final mock phase.'),
  ],
  'ssc_cgl_tier1:10': [
    video('SSC Analogy Types with Direct Examples', 'ssc analogy types direct examples', 'Focused on function, part-whole, cause-effect, and category analogies rather than mixed reasoning clutter.'),
    video('SSC Classification and Odd One Out Practice', 'ssc classification odd one out practice', 'Useful for sharpening common-property logic and quick elimination.'),
  ],
  'ssc_cgl_tier1:11': [
    video('SSC Number and Alphabet Series Practice', 'ssc number alphabet series practice', 'Best for pattern recognition across difference, ratio, and alternating series.' ),
    video('SSC Coding Decoding by Letter Position', 'ssc coding decoding letter position practice', 'Focused on shift, substitution, reversal, and simple code-pattern logic.' ),
  ],
  'ssc_cgl_tier1:12': [
    video('SSC Blood Relations Step by Step', 'ssc blood relations step by step', 'Useful for fixing reference-person logic and avoiding relation confusion.'),
    video('SSC Direction Sense Shortest Distance Practice', 'ssc direction sense shortest distance practice', 'Best for left-right orientation and final-direction questions.'),
  ],
  'ssc_cgl_tier1:13': [
    video('SSC Syllogism with Certain and Possible Conclusions', 'ssc syllogism certain possible conclusions', 'Focused on the exact conclusion rules that Tier-1 reasoning tests repeatedly.'),
    video('SSC Non Verbal Reasoning: Mirror, Rotation, Pattern', 'ssc non verbal reasoning mirror rotation pattern', 'Useful for visual feature comparison instead of random guessing.'),
  ],
  'ssc_cgl_tier1:14': [
    video('SSC Reasoning Mixed Revision by Topic', 'ssc reasoning mixed revision by topic', 'Designed for analogy, series, relation, and syllogism switching in one session.'),
    video('SSC Reasoning Weekly Practice Set', 'ssc reasoning weekly practice set tier 1', 'A mixed reasoning drill that still stays inside the reasoning block.'),
  ],
  'ssc_cgl_tier1:21': [
    video('SSC GA Weekly Revision: History, Polity, Science', 'ssc ga weekly revision history polity science', 'Good for factual GA switching without drifting into quant or reasoning.'),
    video('SSC GA Rapid Quiz Practice', 'ssc ga rapid quiz practice', 'Useful for short, direct factual recall across the week’s GA block.'),
  ],
  'ssc_cgl_tier1:27': [
    video('SSC GA Mixed Revision Set with Direct Facts', 'ssc ga mixed revision direct facts', 'Focused on capitals, dates, constitutional basics, and science facts.'),
    video('SSC General Awareness Short Questions Practice', 'ssc general awareness short questions practice', 'Best for quick factual reinforcement before mixed mock work.'),
  ],
  'ssc_cgl_tier1:28': [
    video('SSC Number System and Divisibility Basics', 'ssc number system divisibility basics', 'Useful for rational/irrational, prime/composite, and divisibility clarity.'),
    video('SSC Simplification with BODMAS Practice', 'ssc simplification bodmas practice', 'Focused on operation order and quick arithmetic cleanup.'),
  ],
  'ssc_cgl_tier1:29': [
    video('SSC Percentages in Fraction Form', 'ssc percentages fraction shortcuts', 'Best for fast percent-to-fraction conversion and direct arithmetic.'),
    video('SSC Ratio and Proportion Practice Set', 'ssc ratio proportion practice set', 'Focused on part-total logic and ratio equality questions.'),
  ],
  'ssc_cgl_tier1:30': [
    video('SSC Averages with Total Method', 'ssc averages total method practice', 'Useful for average change, add/remove value, and total reconstruction questions.'),
    video('SSC Mixture and Alligation Problem Set', 'ssc mixture alligation problem set', 'Focused on ratio setup, mean price, and mixture logic without topic drift.'),
  ],
  'ssc_cgl_tier1:31': [
    video('SSC Simple Interest Core Problems', 'ssc simple interest core problems', 'Good for direct SI questions involving principal, rate, time, and amount.'),
    video('SSC Compound Interest Difference Tricks', 'ssc compound interest difference tricks', 'Focused on CI vs SI difference, annual growth, and half-yearly compounding.'),
  ],
  'ssc_cgl_tier1:32': [
    video('SSC Profit, Loss and Marked Price Questions', 'ssc profit loss marked price questions', 'Use this for CP-SP-MP clarity and direct percentage conversion in profit/loss questions.'),
    video('SSC Successive Discount Practice', 'ssc successive discount practice', 'Focused on net discount and discount-plus-profit combinations.'),
  ],
  'ssc_cgl_tier1:33': [
    video('SSC Time and Work by One-Day Work Method', 'ssc time and work one day work method', 'Best for one-day work and combined-work questions.'),
    video('SSC Pipes and Cisterns Net Rate Practice', 'ssc pipes cisterns net rate practice', 'Focused on inlet-outlet logic and rate subtraction.'),
  ],
  'ssc_cgl_tier1:34': [
    video('SSC Quant Weekly Revision by Topic', 'ssc quant weekly revision arithmetic', 'A mixed arithmetic recap that still stays inside the covered quant block.'),
    video('SSC Arithmetic Mixed Quiz Drill', 'ssc arithmetic mixed quiz drill', 'Useful for topic switching across percent, ratio, profit-loss, and work questions.'),
  ],
  'ssc_cgl_tier1:36': [
    video('SSC Algebra Linear Equations Practice', 'ssc algebra linear equations practice', 'Focused on solving simple equations quickly and cleanly.'),
    video('SSC Algebra Basics: Brackets and Substitution', 'ssc algebra brackets substitution basics', 'Useful for expansion, like terms, and variable substitution.'),
  ],
  'ssc_cgl_tier1:49': [
    video('SSC Synonym and Antonym Revision', 'ssc synonym antonym revision', 'Best for medium-frequency vocabulary and direct objective recall.'),
    video('SSC Vocabulary in Usage Questions', 'ssc vocabulary usage questions', 'Focused on meaning in context rather than random word memorization.'),
  ],
  'tnpsc_group4:25': [
    video('TNPSC அறிவியல் அடிப்படை மீள்பார்வு', 'tnpsc science basics revision tamil group 4', 'Physics, chemistry, and biology direct facts in Tamil for quick Group 4 recall.'),
    video('TNPSC அறிவியல் முக்கிய வினாக்கள்', 'tnpsc science important questions tamil group 4', 'Useful for direct unit, cell, acid-base, and photosynthesis objective questions.'),
  ],
  'tnpsc_group4:27': [
    video('TNPSC கலவை ரிவிஷன்: தமிழ் + GS + Aptitude', 'tnpsc mixed revision tamil gs aptitude tamil', 'A mixed revision sitting that still keeps the block coherent for Group 4.'),
    video('TNPSC கலவை வினா பயிற்சி', 'tnpsc mixed questions practice tamil group 4', 'Useful for switching across Tamil, GS, and aptitude without losing factual discipline.'),
  ],
  'tnpsc_group4:44': [
    video('TNPSC சதவீதம், விகிதம், லாபம்-நஷ்டம்', 'tnpsc percentage ratio profit loss tamil', 'Focused on the exact aptitude block for this day, not generic arithmetic filler.'),
    video('TNPSC Mixed Aptitude Drill Tamil', 'tnpsc mixed aptitude drill tamil group 4', 'Useful for fast switching across percentage, ratio, and profit-loss.'),
  ],
  'tnpsc_group4:47': [
    video('TNPSC அறிவியல் + புவியியல் முழு மீள்பார்வு', 'tnpsc science geography full revision tamil', 'A direct GS revision pairing science facts with geography recall.'),
    video('TNPSC India + Tamil Nadu Geography Questions', 'tnpsc india tamil nadu geography questions tamil', 'Useful for rivers, monsoon, latitude-longitude, and TN geography facts.'),
  ],
  'tnpsc_group4:48': [
    video('TNPSC History + Polity Quick Revision Tamil', 'tnpsc history polity quick revision tamil', 'Focused on INC, major acts, Constitution, FR, and polity basics.'),
    video('TNPSC History Polity Direct Questions Tamil', 'tnpsc history polity direct questions tamil', 'Useful for date recall and one-line constitutional facts.'),
  ],
  'tnpsc_group4:50': [
    video('TNPSC Aptitude Full Revision Tamil', 'tnpsc aptitude full revision tamil group 4', 'A complete recap of percentage, ratio, average, speed, work, and profit-loss.'),
    video('TNPSC Aptitude Mixed Objective Questions', 'tnpsc aptitude mixed objective questions tamil', 'Useful for fast Group 4 arithmetic practice across multiple topics.'),
  ],
  'tnpsc_group4:51': [
    video('TNPSC GS Mixed Weak Areas Revision', 'tnpsc gs mixed weak areas revision tamil', 'Focused on repairing repeated misses across science, geography, polity, and economy.'),
    video('TNPSC Mock Revision Questions Tamil', 'tnpsc mock revision questions tamil group 4', 'Useful right before final mock practice when the student wants rapid factual reinforcement.'),
  ],
  'tnpsc_group4:54': [
    video('TNPSC Final Revision Tamil', 'tnpsc final revision tamil group 4 exam', 'A last-stage recap for Tamil, GS, and aptitude before the exam.'),
    video('TNPSC Final Mixed Mock Discussion Tamil', 'tnpsc final mixed mock discussion tamil group 4', 'Useful for end-stage confidence through direct mixed-question review.'),
  ],
};

async function main() {
  for (const [key, videos] of Object.entries(updates)) {
    const [track_id, dayStr] = key.split(':');
    const day_number = Number(dayStr);
    const { data, error } = await supabase
      .from('master_content_vault')
      .select('content_json')
      .eq('track_id', track_id)
      .eq('day_number', day_number)
      .single();

    if (error) throw error;

    const payload = typeof data.content_json === 'string' ? JSON.parse(data.content_json) : data.content_json;
    payload.videos = videos;

    const { error: updateError } = await supabase
      .from('master_content_vault')
      .update({ content_json: payload, updated_at: new Date().toISOString() })
      .eq('track_id', track_id)
      .eq('day_number', day_number);

    if (updateError) throw updateError;
    console.log(`Updated videos for ${track_id} day ${day_number}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
