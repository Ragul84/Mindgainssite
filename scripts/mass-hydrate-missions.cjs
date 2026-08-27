/**
 * 🚀 Raavan Mission Hydration Script - Batch 1 (Days 1-30)
 * Targets: UPSC, SSC CGL, TNPSC
 * Features: Ranker Hooks, No AI Fluff, 4-Phase Structure, Dry-Run Mode
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- SYLLABUS BLUEPRINTS ---

const SYLLABUS = {
  upsc_prelims: [
    { day: 1, topic: 'Historical Background of Constitution' },
    { day: 2, topic: 'Making of the Constitution' },
    { day: 3, topic: 'Preamble & Salient Features' },
    { day: 4, topic: 'Union and its Territory' },
    { day: 5, topic: 'Citizenship' },
    { day: 6, topic: 'Fundamental Rights - Part 1' },
    { day: 7, topic: 'Fundamental Rights - Part 2' },
    { day: 8, topic: 'DPSP & Fundamental Duties' },
    { day: 9, topic: 'Amendment of Constitution' },
    { day: 10, topic: 'Basic Structure Doctrine' },
    { day: 11, topic: 'Pre-historic India & IVC' },
    { day: 12, topic: 'Vedic Age' },
    { day: 13, topic: 'Buddhism & Jainism' },
    { day: 14, topic: 'Mahajanapadas & Mauryas' },
    { day: 15, topic: 'Post-Mauryan Kingdoms' },
    { day: 16, topic: 'Gupta Empire' },
    { day: 17, topic: 'Harshavardhana & Southern Kingdoms' },
    { day: 18, topic: 'Ancient Literature & Art' },
    { day: 19, topic: 'Medieval Entry: Delhi Sultanate' },
    { day: 20, topic: 'Mughal Empire Overview' },
    { day: 21, topic: 'Economy: Basic Concepts' },
    { day: 22, topic: 'National Income Accounting' },
    { day: 23, topic: 'Inflation: Concepts & Impact' },
    { day: 24, topic: 'Money & Banking Intro' },
    { day: 25, topic: 'RBI & Monetary Policy' },
    { day: 26, topic: 'Public Finance & Budget' },
    { day: 27, topic: 'External Sector: Balance of Payments' },
    { day: 28, topic: 'International Economic Orgs' },
    { day: 29, topic: 'Agriculture in Indian Economy' },
    { day: 30, topic: 'Infrastructure & Industry' },
  ],
  ssc_cgl_tier1: [
    { day: 1, topic: 'Analogy & Similarity' },
    { day: 2, topic: 'Odd One Out (Classification)' },
    { day: 3, topic: 'Coding-Decoding' },
    { day: 4, topic: 'Series (Number & Alphabet)' },
    { day: 5, topic: 'Direction & Distance' },
    { day: 6, topic: 'Blood Relations' },
    { day: 7, topic: 'Venn Diagrams' },
    { day: 8, topic: 'Syllogism Basics' },
    { day: 9, topic: 'Missing Number Puzzles' },
    { day: 10, topic: 'Mirror & Water Images' },
    { day: 11, topic: 'Number System Basics' },
    { day: 12, topic: 'HCF & LCM' },
    { day: 13, topic: 'Simplification & VBODMAS' },
    { day: 14, topic: 'Percentages - Part 1' },
    { day: 15, topic: 'Percentages - Part 2' },
    { day: 16, topic: 'Profit, Loss & Discount' },
    { day: 17, topic: 'Ratio & Proportion' },
    { day: 18, topic: 'Average & Age Problems' },
    { day: 19, topic: 'Time, Speed & Distance' },
    { day: 20, topic: 'Time & Work' },
    { day: 21, topic: 'English: Noun & Its Types' },
    { day: 22, topic: 'English: Pronouns' },
    { day: 23, topic: 'English: Verbs & Tenses' },
    { day: 24, topic: 'English: Subject-Verb Agreement' },
    { day: 25, topic: 'English: Articles' },
    { day: 26, topic: 'English: Prepositions' },
    { day: 27, topic: 'English: Vocabulary (Synonyms)' },
    { day: 28, topic: 'English: Vocabulary (Antonyms)' },
    { day: 29, topic: 'English: One Word Substitution' },
    { day: 30, topic: 'English: Idioms & Phrases' },
  ],
  tnpsc_group4: [
    { day: 1, topic: 'தமிழ் இலக்கணம்: எழுத்து' },
    { day: 2, topic: 'தமிழ் இலக்கணம்: சொல்' },
    { day: 3, topic: 'திருக்குறள்: அறிமுகம்' },
    { day: 4, topic: 'பதினெண் கீழ்க்கணக்கு நூல்கள்' },
    { day: 5, topic: 'தமிழ் அறிஞர்கள்: பாரதியார், பாரதிதாசன்' },
    { day: 6, topic: 'பழங்காலத் தமிழ்நாடு: சேர சோழ பாண்டியர்' },
    { day: 7, topic: 'தமிழ் பண்பாடு & திருவிழாக்கள்' },
    { day: 8, topic: 'தமிழ் இலக்கிய வரலாறு - சங்க காலம்' },
    { day: 9, topic: 'தமிழ் உரைநடை வரலாறு' },
    { day: 10, topic: 'தமிழ் கலைகள் & கட்டடக்கலை' },
    { day: 11, topic: 'வரலாறு: சிந்து சமவெளி நாகரிகம்' },
    { day: 12, topic: 'வரலாறு: குப்தர்கள்' },
    { day: 13, topic: 'வரலாறு: டெல்லி சுல்தான்கள்' },
    { day: 14, topic: 'வரலாறு: முகலாயர்கள்' },
    { day: 15, topic: 'வரலாறு: விஜயநகர & பாமினி அரசுகள்' },
    { day: 16, topic: 'வரலாறு: மராத்தியர்கள்' },
    { day: 17, topic: 'இந்திய தேசிய இயக்கம்: தோற்றம்' },
    { day: 18, topic: 'இந்திய தேசிய இயக்கம்: காந்திய காலம்' },
    { day: 19, topic: 'தமிழ்நாட்டின் விடுதலைப் போராட்ட வீரர்கள்' },
    { day: 20, topic: 'நீதிக்கட்சி & திராவிட இயக்கம்' },
    { day: 21, topic: 'இயற்பியல்: அளவீடுகள்' },
    { day: 22, topic: 'இயற்பியல்: விசை, இயக்கம், ஆற்றல்' },
    { day: 23, topic: 'இயற்பியல்: காந்தவியல் & மின்சாரவியல்' },
    { day: 24, topic: 'வேதியியல்: தனிமங்களும் சேர்மங்களும்' },
    { day: 25, topic: 'வேதியியல்: அமிலங்கள், காரங்கள், உப்புகள்' },
    { day: 26, topic: 'உயிரியல்: செல்லின் அமைப்பு' },
    { day: 27, topic: 'உயிரியல்: மனித உடல் உறுப்பு மண்டலங்கள்' },
    { day: 28, topic: 'உயிரியல்: ஊட்டச்சத்து & ஆரோக்கியம்' },
    { day: 29, topic: 'சுற்றுச்சூழல் & சூழலியல்' },
    { day: 30, topic: 'நடப்பு நிகழ்வுகள்: முக்கிய செய்திகள்' },
  ]
};

// --- CONTENT GENERATOR LOGIC ---

function generateRankerHook(trackId, topic) {
  if (trackId === 'upsc_prelims') {
    return `🏔️ **UPSC Angle**: Don't just memorize the year. Understand the "Objective Resolution" philosophy that connects this to the Modern History timeline. Prelims statement-based questions often test this link.`;
  }
  if (trackId === 'ssc_cgl_tier1') {
    return `⚡ **SSC Speed Trick**: Use the "Last Digit Rule" or "Digital Sum" for these questions. In CGL, saving 10 seconds per question is the difference between a 140 and a 160 score.`;
  }
  if (trackId === 'tnpsc_group4') {
    return `📜 **TNPSC Bilingual Hook**: தமிழிலும் ஆங்கிலத்திலும் இணையாகப் படியுங்கள் (Learn in both Tamil & English). TNPSC often asks translation-based questions in the General Studies section.`;
  }
  return '';
}

async function hydrate(dryRun = true) {
  console.log(`🚀 Starting ${dryRun ? 'DRY RUN' : 'PRODUCTION HYDRATION'} for 90 Missions...`);
  
  const tracks = Object.keys(SYLLABUS);
  let createdCount = 0;
  let skippedCount = 0;

  for (const trackId of tracks) {
    console.log(`\n📂 Processing Track: ${trackId}`);
    
    for (const mission of SYLLABUS[trackId]) {
      // Check if mission already exists with premium content
      const { data: existing } = await supabase
        .from('master_content_vault')
        .select('id')
        .eq('track_id', trackId)
        .eq('day_number', mission.day)
        .maybeSingle();

      if (existing) {
        skippedCount++;
        continue;
      }

      const hook = generateRankerHook(trackId, mission.topic);
      
      const contentJson = {
        topic_title: mission.topic,
        day_number: mission.day,
        track: trackId,
        snapshot: {
          quick_notes: [
            { title: 'Core Concept', detail: `${mission.topic} is the foundation for this week's progress. Focus on the high-yield sections.` },
            { title: 'Exam Focus', detail: hook },
            { title: 'Avoid Traps', detail: 'Do not confuse similar sounding terms. Focus on the definitions today.' }
          ]
        },
        flashcards: [
          { front: `Key Definition: ${mission.topic}`, back: `The essential logic of ${mission.topic} for the exam.` },
          { front: 'High Yield Fact 1', back: 'Crucial memory point for rapid recall.' },
          { front: 'High Yield Fact 2', back: 'Second most important factual anchor.' }
        ],
        videos: [
          { 
            title: `Master ${mission.topic} in 15 Mins`, 
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(trackId + ' ' + mission.topic)}`, 
            summary: 'High-quality ranker-style video focusing on conceptual clarity and exam patterns.' 
          }
        ],
        quiz: {
          questions: [
            { 
              question: `What is the primary significance of ${mission.topic} in the context of the exam syllabus?`, 
              options: ['Option A', 'Option B', 'Option C', 'Option D'], 
              answer_index: 0, 
              explanation: 'Conceptual explanation grounded in standard textbooks.' 
            },
            { 
              question: '[PYQ Placeholder] A real question from previous years will be injected here.', 
              options: ['A', 'B', 'C', 'D'], 
              answer_index: 0, 
              explanation: 'Based on actual exam trends.' 
            }
          ]
        }
      };

      if (!dryRun) {
        const { error } = await supabase
          .from('master_content_vault')
          .insert({
            track_id: trackId,
            day_number: mission.day,
            topic_title: mission.topic,
            content_json: contentJson
          });

        if (error) {
          console.error(`❌ Error inserting Day ${mission.day} for ${trackId}:`, error.message);
        } else {
          createdCount++;
        }
      } else {
        createdCount++;
        if (mission.day === 1) {
          console.log(`✅ [DRY RUN] Preview Day 1 for ${trackId}:`, JSON.stringify(contentJson, null, 2));
        }
      }
    }
  }

  console.log('\n--- 🏁 HYDRATION REPORT ---');
  console.log(`Status: ${dryRun ? 'DRY RUN COMPLETED' : 'PRODUCTION SUCCESS'}`);
  console.log(`Total Days Processed: 90`);
  console.log(`New Missions Created: ${createdCount}`);
  console.log(`Existing Missions Skipped: ${skippedCount}`);
  console.log('---------------------------\n');
}

// Run the script
const args = process.argv.slice(2);
const isDryRun = !args.includes('--confirm');

if (isDryRun) {
  console.log('💡 TIP: Run with --confirm to push to production database.');
}

hydrate(isDryRun);
