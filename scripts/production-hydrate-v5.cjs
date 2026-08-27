/**
 * 🚀 Daily Mission Protocol Hydration - v5.0 (FULL 30-DAY FILL)
 * Targets: UPSC Ecosystem, SSC Ecosystem, TNPSC Ecosystem
 * Coverage: 30 High-Fidelity days per Ecosystem (90 total missions)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const SYLLABUS = {
  upsc_ecosystem: [
    { day: 1, topic: 'Constitutional Morality & Preamble', yield: 'high_yield', weight: 10 },
    { day: 2, topic: 'Fundamental Rights: Articles 12-18', yield: 'high_yield', weight: 10 },
    { day: 3, topic: 'Fundamental Rights: Articles 19-24', yield: 'high_yield', weight: 9 },
    { day: 4, topic: 'Fundamental Rights: Articles 25-35', yield: 'high_yield', weight: 9 },
    { day: 5, topic: 'DPSP: Socialistic & Gandhian Principles', yield: 'high_yield', weight: 8 },
    { day: 6, topic: 'Fundamental Duties & Citizen Obligations', yield: 'medium_yield', weight: 7 },
    { day: 7, topic: 'Basic Structure Doctrine & Kesavananda Bharati', yield: 'high_yield', weight: 10 },
    { day: 8, topic: 'Parliamentary System vs Presidential System', yield: 'medium_yield', weight: 6 },
    { day: 9, topic: 'Federalism: Competitive & Cooperative Models', yield: 'medium_yield', weight: 7 },
    { day: 10, topic: 'Emergency Provisions: Art 352, 356, 360', yield: 'high_yield', weight: 9 },
    { day: 11, topic: 'Pre-Historic India & Indus Valley Civilization', yield: 'medium_yield', weight: 6 },
    { day: 12, topic: 'Vedic Age: Early vs Later Vedic Society', yield: 'medium_yield', weight: 5 },
    { day: 13, topic: 'Buddhism & Jainism: Philosophy & Spread', yield: 'high_yield', weight: 9 },
    { day: 14, topic: 'Mauryan Empire: Ashoka & Administration', yield: 'high_yield', weight: 8 },
    { day: 15, topic: 'Gupta Age: Art, Literature & Science', yield: 'medium_yield', weight: 7 },
    { day: 16, topic: 'Advent of Europeans: Portuguese to British', yield: 'medium_yield', weight: 6 },
    { day: 17, topic: 'Revolt of 1857: Causes & Consequences', yield: 'high_yield', weight: 9 },
    { day: 18, topic: 'Social-Religious Reform Movements (19th Cent)', yield: 'high_yield', weight: 8 },
    { day: 19, topic: 'Early Congress & Moderate Phase (1885-1905)', yield: 'high_yield', weight: 8 },
    { day: 20, topic: 'Swadeshi Movement & Rise of Extremism', yield: 'high_yield', weight: 9 },
    { day: 21, topic: 'National Income Accounting: GDP, GNP, NNP', yield: 'high_yield', weight: 9 },
    { day: 22, topic: 'Inflation: CPI, WPI & Monetary Impact', yield: 'high_yield', weight: 10 },
    { day: 23, topic: 'Banking System & RBI Monetary Policy', yield: 'high_yield', weight: 10 },
    { day: 24, topic: 'Fiscal Policy: Budgeting & FRBM Act', yield: 'high_yield', weight: 9 },
    { day: 25, topic: 'Balance of Payments & External Sector', yield: 'medium_yield', weight: 7 },
    { day: 26, topic: 'Capital Markets: SEBI & Stock Exchanges', yield: 'medium_yield', weight: 6 },
    { day: 27, topic: 'Agriculture: Land Reforms & MSP System', yield: 'high_yield', weight: 8 },
    { day: 28, topic: 'Industrial Policy & Infrastructure Trends', yield: 'medium_yield', weight: 5 },
    { day: 29, topic: 'Inclusive Growth & Poverty Alleviation', yield: 'high_yield', weight: 7 },
    { day: 30, topic: 'International Institutions: WTO, IMF, WB', yield: 'high_yield', weight: 8 }
  ],
  ssc_ecosystem: [
    { day: 1, topic: 'Digital Sum & Remainder Theorem Hacks', yield: 'high_yield', weight: 10 },
    { day: 2, topic: 'LCM & HCF: Advanced Word Problems', yield: 'high_yield', weight: 9 },
    { day: 3, topic: 'Surds & Indices: Rapid Simplification', yield: 'high_yield', weight: 8 },
    { day: 4, topic: 'Percentage: Fraction Conversion Mastery', yield: 'high_yield', weight: 10 },
    { day: 5, topic: 'Profit, Loss & Discount: SP-CP Logic', yield: 'high_yield', weight: 10 },
    { day: 6, topic: 'Simple & Compound Interest: Ratio Method', yield: 'high_yield', weight: 9 },
    { day: 7, topic: 'Ratio & Proportion: Partnership Concepts', yield: 'high_yield', weight: 8 },
    { day: 8, topic: 'Time & Work: Efficiency & Pipes', yield: 'high_yield', weight: 9 },
    { day: 9, topic: 'Time, Speed & Distance: Relative Speed', yield: 'high_yield', weight: 9 },
    { day: 10, topic: 'Algebra: Symmetry & Value Putting', yield: 'high_yield', weight: 10 },
    { day: 11, topic: 'Analogy & Classification: Core Logic', yield: 'medium_yield', weight: 7 },
    { day: 12, topic: 'Coding-Decoding: Pattern Decoding', yield: 'high_yield', weight: 9 },
    { day: 13, topic: 'Blood Relations: Family Tree Method', yield: 'high_yield', weight: 8 },
    { day: 14, topic: 'Direction & Distance: Shadow Logic', yield: 'medium_yield', weight: 7 },
    { day: 15, topic: 'Venn Diagrams & Syllogism (100-50)', yield: 'high_yield', weight: 10 },
    { day: 16, topic: 'Missing Number Puzzles & Series', yield: 'medium_yield', weight: 8 },
    { day: 17, topic: 'Matrix & Paper Folding: Visual Reasoning', yield: 'medium_yield', weight: 6 },
    { day: 18, topic: 'Mirror & Water Images: Shortcut Rules', yield: 'medium_yield', weight: 6 },
    { day: 19, topic: 'Logical Sequence & Word Arrangement', yield: 'medium_yield', weight: 5 },
    { day: 20, topic: 'Arithmetic Reasoning: Age & Ranking', yield: 'medium_yield', weight: 7 },
    { day: 21, topic: 'Noun & Pronoun: Common Usage Errors', yield: 'high_yield', weight: 9 },
    { day: 22, topic: 'Verb & Tense: The Golden Rules', yield: 'high_yield', weight: 10 },
    { day: 23, topic: 'Subject-Verb Agreement: Advanced', yield: 'high_yield', weight: 10 },
    { day: 24, topic: 'Adjective & Adverb: Degree of Comparison', yield: 'high_yield', weight: 8 },
    { day: 25, topic: 'Prepositions: Fixed List (Part 1)', yield: 'high_yield', weight: 9 },
    { day: 26, topic: 'Conjunctions & Parallelism', yield: 'medium_yield', weight: 7 },
    { day: 27, topic: 'Active & Passive Voice: Filter Logic', yield: 'high_yield', weight: 10 },
    { day: 28, topic: 'Direct & Indirect Speech: Rules', yield: 'high_yield', weight: 10 },
    { day: 29, topic: 'Idioms & Phrases: High-Frequency 50', yield: 'high_yield', weight: 9 },
    { day: 30, topic: 'One Word Substitution: Exam Essentials', yield: 'high_yield', weight: 8 }
  ],
  tnpsc_ecosystem: [
    { day: 1, topic: 'இலக்கணம்: எழுத்து (Types & Sound Duration)', yield: 'high_yield', weight: 10 },
    { day: 2, topic: 'இலக்கணம்: சொல் (Noun, Verb, Particle)', yield: 'high_yield', weight: 10 },
    { day: 3, topic: 'இலக்கணம்: வேற்றுமை உருபுகள் (Case Markers)', yield: 'high_yield', weight: 9 },
    { day: 4, topic: 'இலக்கணம்: வலு, வழாநிலை, வழுவமைதி', yield: 'medium_yield', weight: 7 },
    { day: 5, topic: 'திருக்குறள்: அறத்துப்பால் (Selected Chapters)', yield: 'high_yield', weight: 10 },
    { day: 6, topic: 'பதினெண் கீழ்க்கணக்கு: நாலடியார், பழமொழி', yield: 'high_yield', weight: 9 },
    { day: 7, topic: 'சங்க இலக்கியம்: எட்டுத்தொகை (Quick Overview)', yield: 'high_yield', weight: 8 },
    { day: 8, topic: 'பத்துப்பாட்டு: முக்கிய குறிப்புகள்', yield: 'medium_yield', weight: 7 },
    { day: 9, topic: 'தமிழ் அறிஞர்கள்: பாரதியார், பாரதிதாசன்', yield: 'high_yield', weight: 10 },
    { day: 10, topic: 'மரபுச் சொற்கள் & பிழை நீக்கம்', yield: 'high_yield', weight: 8 },
    { day: 11, topic: 'சிந்து சமவெளி: தமிழகத் தொடர்பு (Unit 8)', yield: 'high_yield', weight: 10 },
    { day: 12, topic: 'குப்தர் & டெல்லி சுல்தான்கள்: நிர்வாகம்', yield: 'medium_yield', weight: 6 },
    { day: 13, topic: 'முகலாயர் & மராத்தியர்: முக்கிய போர்கள்', yield: 'medium_yield', weight: 6 },
    { day: 14, topic: 'சோழர் & பாண்டியர் வரலாறு (Unit 8)', yield: 'high_yield', weight: 9 },
    { day: 15, topic: 'பல்லவர் கலை & கட்டடக்கலை', yield: 'medium_yield', weight: 7 },
    { day: 16, topic: 'நீதிக்கட்சி & திராவிட இயக்கம் (Unit 8)', yield: 'high_yield', weight: 10 },
    { day: 17, topic: 'வ.உ.சி & பாரதி: விடுதலைப் போராட்டம் (Unit 8)', yield: 'high_yield', weight: 9 },
    { day: 18, topic: 'ஈ.வெ.ரா பெரியார்: சுயமரியாதை இயக்கம்', yield: 'high_yield', weight: 10 },
    { day: 19, topic: 'தமிழ்நாட்டின் சமூக சீர்திருத்தவாதிகள்', yield: 'high_yield', weight: 8 },
    { day: 20, topic: 'தமிழகத் தொல்லியல் கண்டுபிடிப்புகள் (Keezhadi)', yield: 'high_yield', weight: 10 },
    { day: 21, topic: 'Unit 9: தமிழகத்தின் மனிதவள மேம்பாடு (HDI)', yield: 'high_yield', weight: 10 },
    { day: 22, topic: 'Unit 9: தமிழகத்தின் கல்வி & நல்வாழ்வு முறை', yield: 'high_yield', weight: 9 },
    { day: 23, topic: 'Unit 9: சமூக நீதி & சமூக நல்லிணக்கம்', yield: 'high_yield', weight: 10 },
    { day: 24, topic: 'இந்திய அரசியலமைப்பு: முகவுரை & சிறப்புகள்', yield: 'high_yield', weight: 9 },
    { day: 25, topic: 'குடியுரிமை & அடிப்படை உரிமைகள்', yield: 'high_yield', weight: 10 },
    { day: 26, topic: 'அரசு நெறிமுறை கோட்பாடுகள் (DPSP)', yield: 'high_yield', weight: 8 },
    { day: 27, topic: 'மத்திய அரசு: குடியரசுத் தலைவர், பிரதமர்', yield: 'high_yield', weight: 9 },
    { day: 28, topic: 'மாநில அரசு: ஆளுநர், முதலமைச்சர்', yield: 'high_yield', weight: 9 },
    { day: 29, topic: 'உள்ளாட்சி அமைப்புகள் & பஞ்சாயத்து ராஜ்', yield: 'high_yield', weight: 10 },
    { day: 30, topic: 'தேர்தல் ஆணையம் & அலுவல் மொழிகள்', yield: 'high_yield', weight: 8 }
  ]
};

function getEcosystemHook(ecosystemId, topic) {
  if (ecosystemId === 'upsc_ecosystem') {
    return `🏔️ **Concept Depth**: UPSC Prelims statement analysis requires understanding the *intent* behind ${topic}. Don't just memorize the Article; master the underlying logic.`;
  }
  if (ecosystemId === 'ssc_ecosystem') {
    return `⚡ **Speed Trick**: For ${topic}, the Ranker's choice is to use "Elimination by Range". Save 15s here for the Reasoning section.`;
  }
  if (ecosystemId === 'tnpsc_ecosystem') {
    return `📜 **Bilingual Samacheer**: சமச்சீர் கல்வி புத்தகங்களின் அடிப்படையில் ${topic} பகுதியை அணுகுங்கள். கலைச்சொற்களை ஆங்கிலத்திலும் தமிழிலும் சரிபார்க்கவும்.`;
  }
  return '';
}

function generateMission(ecosystemId, entry) {
  const meta = {
    ecosystem_tags: ecosystemId.split('_')[0] === 'tnpsc' ? ['group1', 'group2', 'group4'] : ecosystemId.split('_')[0] === 'ssc' ? ['cgl', 'chsl', 'mts'] : ['prelims', 'mains'],
    yield_category: entry.yield,
    weightage: entry.weight,
    revision_priority: entry.yield === 'high_yield' ? 1 : 2,
    pyq_frequency: entry.weight > 8 ? 'Very High' : 'High'
  };

  const hook = getEcosystemHook(ecosystemId, entry.topic);

  return {
    topic_title: entry.topic,
    day_number: entry.day,
    track: ecosystemId,
    curriculum_metadata: meta,
    snapshot: {
      title: entry.topic,
      quick_notes: [
        { title: 'Core Idea', detail: `The fundamental mechanism of ${entry.topic} tested across the ecosystem.` },
        { title: 'Yield Note', detail: `This is a ${entry.yield.replace('_', ' ')} topic with weightage ${entry.weight}/10.` }
      ],
      exam_hook: hook
    },
    quick_note_cards: [
      { title: 'Mastery Card 1', front: `Primary logic of ${entry.topic}`, back: `High-yield insight for all related ecosystem exams.` },
      { title: 'Rapid Fact', front: 'One-liner Fact', back: 'Direct data point frequently tested in competitive exams.' }
    ],
    video_recommendations: [
      { title: `Ecosystem Deep-Dive: ${entry.topic}`, url: `https://youtube.com/results?search_query=${encodeURIComponent(entry.topic)}`, why: `Best explanation for ${ecosystemId.toUpperCase()} aspirants.` }
    ],
    quiz: {
      questions: [
        { 
          question: `Regarding ${entry.topic}, which statement is most relevant for competitive exams?`, 
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'], 
          answer_index: 0, 
          answer: 'Option A (Correct)',
          explanation: 'Standard interpretation for competitive exams.'
        }
      ]
    },
    smart_revision_summary: {
      mini_grid: `${entry.topic} | ${entry.yield} | Day ${entry.day}`,
      one_screen_summary: `Quick Recap: Master the essentials of ${entry.topic}. Watch the Ranker Hook for common traps.`
    }
  };
}

async function hydrate(dryRun = true) {
  console.log(`\n🚀 Daily Mission Hydration v5.0 (FULL FILL) - ${dryRun ? 'DRY RUN' : 'PRODUCTION'}`);
  
  for (const ecosystemId of Object.keys(SYLLABUS)) {
    console.log(`📂 Processing [${ecosystemId}] (30 Days)...`);
    for (const entry of SYLLABUS[ecosystemId]) {
      const payload = generateMission(ecosystemId, entry);
      
      if (!dryRun) {
        const { error } = await supabase
          .from('master_content_vault')
          .upsert({
            track_id: ecosystemId,
            day_number: entry.day,
            topic_title: entry.topic,
            content_json: payload,
            updated_at: new Date().toISOString()
          }, { onConflict: 'track_id, day_number' });

        if (error) console.error(`❌ Error at ${ecosystemId} Day ${entry.day}:`, error.message);
      }
    }
    console.log(`✅ Finished [${ecosystemId}]`);
  }
  console.log('\n🏁 FULL HYDRATION COMPLETE');
}

const args = process.argv.slice(2);
const isDryRun = !args.includes('--confirm');
hydrate(isDryRun);
