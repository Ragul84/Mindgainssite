/**
 * 🚀 Daily Mission Protocol Hydration - v4.0 (Master Ecosystems & Weighted Engine)
 * Targets: UPSC Ecosystem, SSC Ecosystem, TNPSC Ecosystem
 * Features: Priority-based weighting, Samacheer alignment, NCERT depth, Speed shortcuts.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- WEIGHTED SYLLABUS ARCHITECTURE ---

const ECOSYSTEMS = {
  upsc_ecosystem: {
    name: 'UPSC Master Ecosystem',
    tags: ['prelims', 'mains', 'uppsc', 'bpsc'],
    specialization: 'Conceptual Depth & Statement Analysis',
    curriculum: [
      { day: 1, topic: 'Constitutional Morality & Preamble', yield: 'high_yield', weight: 10 },
      { day: 2, topic: 'Fundamental Rights: The Golden Triangle', yield: 'high_yield', weight: 10 },
      { day: 3, topic: 'DPSP vs Fundamental Rights: The Conflict', yield: 'high_yield', weight: 8 },
      { day: 4, topic: 'Parliamentary vs Presidential Systems', yield: 'medium_yield', weight: 6 },
      { day: 5, topic: 'Federalism: Competitive & Cooperative', yield: 'medium_yield', weight: 7 },
      // ... more days would be here
    ]
  },
  ssc_ecosystem: {
    name: 'SSC Master Ecosystem',
    tags: ['cgl', 'chsl', 'mts', 'cpo', 'gd'],
    specialization: 'Speed Solving & Pattern Recognition',
    curriculum: [
      { day: 1, topic: 'Digital Sum & Last Digit Hacks', yield: 'high_yield', weight: 10 },
      { day: 2, topic: 'Percentage to Fraction Master-List', yield: 'high_yield', weight: 10 },
      { day: 3, topic: 'Ratio & Proportions: Scaling Method', yield: 'high_yield', weight: 9 },
      { day: 4, topic: 'VBODMAS & Complex Simplification', yield: 'high_yield', weight: 8 },
      { day: 5, topic: 'Active/Passive Voice: 2-Second Filter', yield: 'high_yield', weight: 9 },
    ]
  },
  tnpsc_ecosystem: {
    name: 'TNPSC Master Ecosystem',
    tags: ['group1', 'group2', 'group4', 'vao'],
    specialization: 'Samacheer Alignment & Unit 8/9 Focus',
    curriculum: [
      { day: 1, topic: 'Ancient Tamil Society (Keezhadi Context)', yield: 'high_yield', weight: 10 },
      { day: 2, topic: 'Sangam Literature: The 8 Anthologies', yield: 'high_yield', weight: 10 },
      { day: 3, topic: 'Self-Respect Movement & Justice Party', yield: 'high_yield', weight: 10 },
      { day: 4, topic: 'TN Human Development Indicators', yield: 'high_yield', weight: 8 },
      { day: 5, topic: 'Rivers of TN & Monsoon Patterns', yield: 'medium_yield', weight: 7 },
    ]
  }
};

// --- GENERATION HELPERS ---

function getEcosystemHook(ecosystemId, topic) {
  if (ecosystemId === 'upsc_ecosystem') {
    return `🏔️ **Concept Depth**: UPSC Prelims statement analysis requires understanding the *intent* behind ${topic}. Don't just memorize the Article; master the 'Doctrine of Essentiality' or relevant legal philosophy.`;
  }
  if (ecosystemId === 'ssc_ecosystem') {
    return `⚡ **Speed Trick**: For ${topic}, the Ranker's choice is to use "Elimination by Range". If options are far apart, don't calculate to the decimal. Save 15s here for the Reasoning section.`;
  }
  if (ecosystemId === 'tnpsc_ecosystem') {
    return `📜 **Bilingual Samacheer**: சமச்சீர் கல்வி புத்தகங்களின் அடிப்படையில் ${topic} பகுதியை அணுகுங்கள். கலைச்சொற்களை (Terminology) ஆங்கிலத்திலும் தமிழிலும் சரிபார்க்கவும்.`;
  }
  return '';
}

function generateMission(ecosystemId, entry) {
  const meta = {
    ecosystem_tags: ECOSYSTEMS[ecosystemId].tags,
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
      { title: 'Mastery Card 1', front: `Primary logic of ${entry.topic}`, back: `High-yield insight for all ${ECOSYSTEMS[ecosystemId].tags.join(', ')} exams.` }
    ],
    video_recommendations: [
      { title: `Ecosystem Deep-Dive: ${entry.topic}`, url: `https://youtube.com/results?search_query=${encodeURIComponent(entry.topic)}`, why: `Best explanation for ${ECOSYSTEMS[ecosystemId].name} aspirants.` }
    ],
    quiz: {
      questions: [
        { 
          question: `Regarding ${entry.topic}, which statement is most relevant for the ${ecosystemId.split('_')[0].toUpperCase()} ecosystem?`, 
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'], 
          answer_index: 0, 
          answer: 'Option A (Correct)',
          explanation: 'Standard interpretation for competitive exams.'
        }
      ]
    }
  };
}

async function hydrate(dryRun = true) {
  console.log(`\n🚀 Ecosystem Hydration v4.0 - ${dryRun ? 'DRY RUN' : 'PRODUCTION'}`);
  
  for (const ecosystemId of Object.keys(ECOSYSTEMS)) {
    console.log(`📂 Processing [${ecosystemId}]...`);
    for (const entry of ECOSYSTEMS[ecosystemId].curriculum) {
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
}

const args = process.argv.slice(2);
const isDryRun = !args.includes('--confirm');
hydrate(isDryRun);
