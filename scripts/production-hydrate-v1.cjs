/**
 * 🚀 Raavan Mission Production Hydration - v2.0 (Schema Aligned)
 * Targets: UPSC, SSC CGL, TNPSC (First 30 Days)
 * Features: Production Schema Alignment, Ranker Hooks, Smart Summaries
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- SYLLABUS DATA (Production-Grade) ---

const SYLLABUS = {
  upsc_prelims: [
    { day: 1, topic: 'Historical Background: Company Rule (1773-1858)' },
    { day: 2, topic: 'Historical Background: Crown Rule (1858-1947)' },
    { day: 3, topic: 'Making of the Constitution & Preamble' },
    { day: 4, topic: 'Salient Features of Indian Constitution' },
    { day: 5, topic: 'Union and its Territory & Citizenship' },
    { day: 6, topic: 'Fundamental Rights: Articles 12-18' },
    { day: 7, topic: 'Fundamental Rights: Articles 19-24' },
    { day: 8, topic: 'Fundamental Rights: Articles 25-35' },
    { day: 9, topic: 'Directive Principles of State Policy (DPSP)' },
    { day: 10, topic: 'Fundamental Duties & Amendment Process' },
    { day: 11, topic: 'Advent of Europeans & British Conquest' },
    { day: 12, topic: 'Socio-Religious Reform Movements' },
    { day: 13, topic: '1857 Revolt: Causes, Centres & Failure' },
    { day: 14, topic: 'Early Congress & Moderate Phase (1885-1905)' },
    { day: 15, topic: 'Extremist Phase & Swadeshi Movement' },
    { day: 16, topic: 'Revolutionary Terrorism & Home Rule League' },
    { day: 17, topic: 'Gandhian Entry: Champaran, Kheda, Ahmedabad' },
    { day: 18, topic: 'Non-Cooperation & Khilafat Movement' },
    { day: 19, topic: 'Civil Disobedience & Round Table Conferences' },
    { day: 20, topic: 'Quit India Movement & Independence' },
    { day: 21, topic: 'National Income Accounting: GDP, GNP, NNP' },
    { day: 22, topic: 'Inflation: CPI, WPI, Types & Impacts' },
    { day: 23, topic: 'Money Supply: M1, M2, M3, M4' },
    { day: 24, topic: 'Monetary Policy: Repo, Reverse Repo, CRR, SLR' },
    { day: 25, topic: 'Banking System: RBI, Public & Private Banks' },
    { day: 26, topic: 'Fiscal Policy: Budget, Deficits, FRBM Act' },
    { day: 27, topic: 'External Sector: BoP, Forex, Exchange Rates' },
    { day: 28, topic: 'Capital Markets: SEBI, NSE, BSE, Derivatives' },
    { day: 29, topic: 'Agriculture: Land Reforms & Green Revolution' },
    { day: 30, topic: 'International Orgs: WTO, IMF, World Bank' },
  ],
  ssc_cgl_tier1: [
    { day: 1, topic: 'Number System: Divisibility Rules & Remainder' },
    { day: 2, topic: 'HCF and LCM: Basic to Advanced' },
    { day: 3, topic: 'Simplification: VBODMAS & Surds/Indices' },
    { day: 4, topic: 'Percentage: Fraction to Percent Conversion' },
    { day: 5, topic: 'Profit and Loss: Basic Concepts & Discount' },
    { day: 6, topic: 'Ratio and Proportion: Scaling & Distribution' },
    { day: 7, topic: 'Average: Weighted Average & Group Concepts' },
    { day: 8, topic: 'Time and Work: Efficiency & Pipeline Problems' },
    { day: 9, topic: 'Time, Speed & Distance: Relative Speed' },
    { day: 10, topic: 'Simple and Compound Interest: Shortcuts' },
    { day: 11, topic: 'Analogy: Number, Letter and Word Based' },
    { day: 12, topic: 'Classification (Odd One Out): Core Logic' },
    { day: 13, topic: 'Coding-Decoding: Pattern Recognition' },
    { day: 14, topic: 'Series: Number and Alphabetical Patterns' },
    { day: 15, topic: 'Blood Relations: Family Tree Method' },
    { day: 16, topic: 'Direction and Distance: Shadow & Degrees' },
    { day: 17, topic: 'Venn Diagrams: Logical Intersection' },
    { day: 18, topic: 'Syllogism: Venn Diagram vs 50-100 Method' },
    { day: 19, topic: 'Missing Number Puzzles: Matrix/Circle' },
    { day: 20, topic: 'Non-Verbal: Mirror/Water Images & Paper Folding' },
    { day: 21, topic: 'Noun: Common Errors & Singular/Plural' },
    { day: 22, topic: 'Pronoun: Relative & Possessive Case Errors' },
    { day: 23, topic: 'Verb: Main Verbs vs Auxiliaries & Forms' },
    { day: 24, topic: 'Tense: Present, Past, Future Usage' },
    { day: 25, topic: 'Subject-Verb Agreement: Gold Rules' },
    { day: 26, topic: 'Adjective and Adverb: Placement Errors' },
    { day: 27, topic: 'Preposition: Fixed Prepositions (List 1)' },
    { day: 28, topic: 'Conjunction: Correlative & Usage' },
    { day: 29, topic: 'Articles: A, An, The and Omission' },
    { day: 30, topic: 'Vocabulary: 50 High-Frequency Synonyms' },
  ],
  tnpsc_group4: [
    { day: 1, topic: 'இலக்கணம்: எழுத்துக்களின் வகைகள் & பிறப்பு' },
    { day: 2, topic: 'இலக்கணம்: சார்பெழுத்துக்கள் & மாத்திரை' },
    { day: 3, topic: 'இலக்கணம்: சொல்லின் வகைகள் (பெயர், வினை)' },
    { day: 4, topic: 'இலக்கணம்: வேற்றுமை உருபுகள்' },
    { day: 5, topic: 'இலக்கணம்: அணி இலக்கணம் & மரபுச் சொற்கள்' },
    { day: 6, topic: 'திருக்குறள்: முதல் 5 அதிகாரங்கள்' },
    { day: 7, topic: 'பதினெண் கீழ்க்கணக்கு நூல்கள்: நாலடியார், நான்மணிக்கடிகை' },
    { day: 8, topic: 'சங்க இலக்கியம்: எட்டுத்தொகை நூல்கள்' },
    { day: 9, topic: 'சங்க இலக்கியம்: பத்துப்பாட்டு நூல்கள்' },
    { day: 10, topic: 'தமிழ் அறிஞர்கள்: பாரதியார், பாரதிதாசன்' },
    { day: 11, topic: 'சிந்து சமவெளி நாகரிகம்: முக்கிய கண்டுபிடிப்புகள்' },
    { day: 12, topic: 'குப்தர்கள்: நிர்வாகம் & பொற்காலம்' },
    { day: 13, topic: 'டெல்லி சுல்தான்கள்: அடிமை வம்சம் முதல் லோடி வரை' },
    { day: 14, topic: 'முகலாய பேரரசு: முக்கிய போர்கள் & நிர்வாகம்' },
    { day: 15, topic: 'மராத்தியர்கள்: சிவாஜி & பேஷ்வாக்கள்' },
    { day: 16, topic: 'தென்னிந்திய வரலாறு: பல்லவர், சோழர், பாண்டியர்' },
    { day: 17, topic: 'இந்திய தேசிய இயக்கம்: தொடக்க கால கிளர்ச்சிகள்' },
    { day: 18, topic: 'இந்திய தேசிய காங்கிரஸ்: முக்கிய மாநாடுகள்' },
    { day: 19, topic: 'தமிழ்நாட்டின் விடுதலைப் போராட்ட வீரர்கள்: வ.உ.சி, பாரதி' },
    { day: 20, topic: 'திராவிட இயக்கம் & நீதிக்கட்சி பங்களிப்பு' },
    { day: 21, topic: 'இயற்பியல்: அளவீடுகள் & கருவிகள்' },
    { day: 22, topic: 'இயற்பியல்: விசை, இயக்கம் & அழுத்தம்' },
    { day: 23, topic: 'இயற்பியல்: ஒளி & ஒலி (Light & Sound)' },
    { day: 24, topic: 'வேதியியல்: தனிமங்கள் & சேர்மங்கள்' },
    { day: 25, topic: 'வேதியியல்: அமிலங்கள், காரங்கள் & உப்புகள்' },
    { day: 26, topic: 'உயிரியல்: செல்லின் அமைப்பு & பணிகள்' },
    { day: 27, topic: 'உயிரியல்: இரத்தச் சுழற்சி மண்டலம்' },
    { day: 28, topic: 'உயிரியல்: ஹார்மோன்கள் & நாளமில்லா சுரப்பிகள்' },
    { day: 29, topic: 'புவியியல்: இந்தியாவின் அமைவிடம் & ஆறுகள்' },
    { day: 30, topic: 'நடப்பு நிகழ்வுகள்: தமிழ்நாடு & இந்தியா (மாதாந்திர தொகுப்பு)' },
  ]
};

// --- CONTENT GENERATION HELPERS ---

function getRankerHook(trackId, topic) {
  if (trackId === 'upsc_prelims') {
    return `🏔️ **UPSC Angle**: Statements in Prelims often test the logical link between historical acts and current features. Focus on the constitutional 'why'.`;
  }
  if (trackId === 'ssc_cgl_tier1') {
    return `⚡ **SSC Speed Shortcut**: Use the "Digital Sum" or "Last Digit" method for ${topic}. Avoid long divisions. In CGL, saving 10s per question is the difference between Selection and Rejection. **Trap Warning**: Watch out for units (cm vs m) and negative signs.`;
  }
  if (trackId === 'tnpsc_group4') {
    return `📜 **TNPSC Bilingual Hook**: தமிழிலும் ஆங்கிலத்திலும் கலைச்சொற்களை (Technical terms) கவனியுங்கள். GS பகுதியில் மொழிபெயர்ப்பு சிக்கல்களைத் தவிர்க்க இது உதவும்.`;
  }
  return '';
}

function getSubjectCategory(trackId, day) {
  if (trackId === 'upsc_prelims') {
    if (day <= 10) return 'Polity';
    if (day <= 20) return 'History';
    return 'Economy';
  }
  if (trackId === 'ssc_cgl_tier1') {
    if (day <= 10) return 'Quant';
    if (day <= 20) return 'Reasoning';
    return 'English';
  }
  if (trackId === 'tnpsc_group4') {
    if (day <= 10) return 'Tamil';
    if (day <= 20) return 'History/Polity';
    return 'Science/Geography';
  }
  return 'General';
}

function generateContent(trackId, day, topic) {
  const hook = getRankerHook(trackId, topic);
  const category = getSubjectCategory(trackId, day);
  
  const categoryNotes = {
    'Polity': [
      { title: 'Article Focus', detail: `Direct Articles related to ${topic} are high-yield. UPSC Prelims tests precise phrasing.` },
      { title: 'Constitutional Logic', detail: 'Understand the "Objective Resolution" philosophy connecting this to Modern History.' }
    ],
    'History': [
      { title: 'Timeline Anchor', detail: `Place ${topic} in the context of British consolidation or National Movement milestones.` },
      { title: 'Key Organizations', detail: 'Identify the specific groups, journals, or individuals who led this phase.' }
    ],
    'Economy': [
      { title: 'Concept Linkage', detail: `How does ${topic} affect the Common Man? Relate to current fiscal/monetary trends.` },
      { title: 'Institutional Roles', detail: 'Distinguish between the roles of RBI, SEBI, and Government in this area.' }
    ],
    'Quant': [
      { title: 'Ranker Speed-Trick', detail: `Instead of traditional solving, use 'Assumption of X=100' or 'Reverse Option check' for ${topic}.` },
      { title: 'Elimination Logic', detail: 'Eliminate two options immediately based on range estimation or odd/even logic.' }
    ],
    'Reasoning': [
      { title: 'Pattern Insight', detail: 'CGL reasoning follows fixed 5-year cycles of patterns. This specific topic is currently high-yield.' },
      { title: 'Common Traps', detail: 'Avoid the "Over-thinking" trap. The simplest logic is usually the correct one in SSC.' }
    ],
    'English': [
      { title: 'Fixed Rule', detail: 'Master the Golden Rules of Grammar associated with this topic. SSC rarely deviates.' },
      { title: 'Contextual Clue', detail: 'In Cloze tests or Fillers, let the surrounding verbs dictate your choice.' }
    ],
    'Tamil': [
      { title: 'இலக்கண விதி', detail: `சரியான இலக்கண விதிகளை (Grammar rules) மனப்பாடம் செய்வதை விட, அதன் பயன்பாட்டைப் பாருங்கள்.` },
      { title: 'நூல் & ஆசிரியர்', detail: 'ஆசிரியர் குறிப்பு மற்றும் நூலின் சிறப்புகளை ஒருமுறை மீள்பார்வை செய்யவும்.' }
    ],
    'History/Polity': [
      { title: 'TN Context', detail: 'Focus on how these events or laws impacted the Madras Presidency specifically.' },
      { title: 'Social Justice Angle', detail: 'TNPSC often highlights the social reform and Dravidian movement context.' }
    ],
    'Science/Geography': [
      { title: 'Applied Science', detail: 'Focus on daily life applications of these scientific principles.' },
      { title: 'TN Geography', detail: 'Relate the general concepts to Tamil Nadu\'s specific terrain and rivers.' }
    ],
    'General': [
      { title: 'Core Concept', detail: `${topic} is a fundamental topic. Ensure conceptual clarity before practice.` },
      { title: 'Avoid Traps', detail: '80% of errors come from missing small keywords. Read the question twice.' }
    ]
  };

  const snapshot = {
    title: topic,
    quick_notes: [
      ...categoryNotes[category] || categoryNotes['General'],
    ],
    key_points: [
      ...categoryNotes[category] || categoryNotes['General'],
    ],
    exam_hook: hook
  };

  const quick_note_cards = [
    { title: 'Key Terminology', front: `Primary definition of ${topic}`, back: `The essential logic or fact required for ${trackId.toUpperCase()}.` },
    { title: 'Exam Focus', front: `Why is ${topic} important?`, back: `High frequency in previous 5 years of ${trackId.toUpperCase()} papers.` },
    { title: 'Memory Anchor', front: 'Crucial Fact/Formula', back: 'Direct data point or shortcut to save time during the exam.' }
  ];

  const flashcards = quick_note_cards.map(card => ({
    front: card.front,
    back: card.back
  }));

  const video_recommendations = [
    { 
      title: `Master ${topic} | Ranker Strategy`, 
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(trackId.replace('_', ' ') + ' ' + topic)}`, 
      why: 'Focuses on core concepts and rapid solving patterns. No time-waste intro.',
      summary: 'Focuses on core concepts and rapid solving patterns. No time-waste intro.' 
    }
  ];

  const videos = video_recommendations.map(vid => ({
    title: vid.title,
    url: vid.url,
    summary: vid.summary
  }));

  const quiz = {
    questions: [
      { 
        question: `Which of the following is most accurate regarding ${topic}?`, 
        options: ['Correct technical definition', 'Misleading phrasing', 'Incorrect time-period', 'Irrelevant concept'], 
        answer_index: 0, 
        answer: 'Correct technical definition', // String-based answer for backward compatibility
        explanation: `Based on standard textbooks and recent ${trackId} trends.` 
      },
      { 
        question: `[PYQ] Real question about ${topic} from previous ${trackId.toUpperCase()} year.`, 
        options: ['Option A', 'Option B', 'Option C', 'Option D'], 
        answer_index: 0, 
        answer: 'Option A', 
        explanation: 'The logic follows standard exam patterns. Real question content will be updated in the next sync.' 
      }
    ]
  };

  const smart_revision_summary = {
    mini_grid: `${topic} | ${category} | High Yield | Day ${day}`,
    one_screen_summary: `Quick Recap: Focus on the ${category} specifics of ${topic}. Avoid common traps mentioned in the Ranker Hook. Master the terminology before attempting mocks.`
  };

  return {
    topic_title: topic,
    day_number: day,
    track: trackId,
    snapshot,
    quick_note_cards,
    video_recommendations,
    quiz,
    smart_revision_summary
  };
}

// --- SCHEMA VALIDATION ---

function validateSchema(content) {
  const required = ['snapshot', 'quick_note_cards', 'video_recommendations', 'quiz', 'smart_revision_summary'];
  for (const key of required) {
    if (!content[key]) throw new Error(`Missing required field: ${key}`);
  }
  if (!Array.isArray(content.quick_note_cards)) throw new Error('quick_note_cards must be an array');
  if (!Array.isArray(content.video_recommendations)) throw new Error('video_recommendations must be an array');
  if (!Array.isArray(content.quiz.questions)) throw new Error('quiz.questions must be an array');
  
  content.quiz.questions.forEach((q, i) => {
    if (q.answer_index === undefined) throw new Error(`Question ${i} missing answer_index`);
    if (q.answer === undefined) throw new Error(`Question ${i} missing string answer`);
  });
  
  return true;
}

// --- MAIN HYDRATION LOGIC ---

async function hydrate(dryRun = true) {
  console.log(`\n🚀 Raavan Mission Hydration v2.0 - ${dryRun ? 'DRY RUN' : 'PRODUCTION'}`);
  
  const tracks = Object.keys(SYLLABUS);
  const stats = { total: 90, created: 0, skipped: 0, errors: 0 };

  for (const trackId of tracks) {
    console.log(`\n📂 Processing [${trackId}]...`);
    
    for (const entry of SYLLABUS[trackId]) {
      // 1. Check existing
      const { data: existing } = await supabase
        .from('master_content_vault')
        .select('content_json')
        .eq('track_id', trackId)
        .eq('day_number', entry.day)
        .maybeSingle();

      // Preservation Logic: Skip if existing content looks "Premium"
      if (existing && existing.content_json) {
        const c = existing.content_json;
        // If it has smart_revision_summary AND flashcards (for UI compatibility), keep it.
        const isPremium = c.smart_revision_summary && c.flashcards && c.topic_title && !c.topic_title.includes('Topic');
        
        if (isPremium) {
          stats.skipped++;
          continue;
        }
      }

      const content = generateContent(trackId, entry.day, entry.topic);

      try {
        validateSchema(content);
      } catch (e) {
        console.error(`❌ Validation failed for ${trackId} Day ${entry.day}:`, e.message);
        stats.errors++;
        continue;
      }

      if (dryRun) {
        if (entry.day === 1) {
          console.log(`✅ [DRY RUN] Schema Sample for Day 1 (${trackId}):`);
          console.log(JSON.stringify(content, null, 2));
        }
        stats.created++;
      } else {
        const { error } = await supabase
          .from('master_content_vault')
          .upsert({
            track_id: trackId,
            day_number: entry.day,
            topic_title: entry.topic,
            content_json: content,
            updated_at: new Date().toISOString()
          }, { onConflict: 'track_id, day_number' });

        if (error) {
          console.error(`❌ Upsert Error at ${trackId} Day ${entry.day}:`, error.message);
          stats.errors++;
        } else {
          stats.created++;
        }
      }
    }
  }

  console.log('\n--- 🏁 HYDRATION COMPLETE ---');
  console.log(`Created/Updated: ${stats.created}`);
  console.log(`Skipped (Premium): ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log('-----------------------------\n');
}

// Execution
const args = process.argv.slice(2);
const isDryRun = !args.includes('--confirm');
hydrate(isDryRun);
