const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DRY_RUN = process.argv.includes('--dry-run');

function clean(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/â€”/g, '-')
    .replace(/â€“/g, '-')
    .replace(/â€¦/g, '...')
    .trim();
}

function compact(value, max = 150) {
  const text = clean(value);
  if (text.length <= max) return text;
  const clipped = text.slice(0, max);
  const stops = [clipped.lastIndexOf('.'), clipped.lastIndexOf(';'), clipped.lastIndexOf(','), clipped.lastIndexOf(' ')]
    .filter((idx) => idx > 40);
  const stop = stops.length ? Math.max(...stops) : max;
  return `${clipped.slice(0, stop).trim().replace(/[.,;:]+$/u, '')}...`;
}

function parsePayload(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
}

function expandKnownFact(text) {
  let value = clean(text);
  const replacements = [
    [/Tansley\s*\(Ecosystem\)/gi, 'A.G. Tansley is associated with the concept of ecosystem, meaning organisms and their physical environment functioning together as one system'],
    [/Haeckel\s*\(Ecology\)/gi, 'Ernst Haeckel is associated with ecology, the study of interactions between organisms and their environment'],
    [/10%\s*Law/gi, 'Lindeman\'s 10 percent law says only about one-tenth of energy passes from one trophic level to the next'],
    [/Ecotone\s*\(Edge effect\)/gi, 'An ecotone is a transition zone between two ecosystems; edge effect means species diversity is often high at that boundary'],
    [/Niche\s*\(Role\)/gi, 'A niche is the functional role of a species, including where it lives, what it uses, and how it interacts in the ecosystem'],
    [/Mutualism\s*\(Lichen\)/gi, 'Mutualism is a +/+ interaction where both species benefit; lichen is the standard example of algae and fungus association'],
    [/Hotspots:\s*4 in India/gi, 'India has four biodiversity hotspots: Himalaya, Western Ghats, Indo-Burma, and Sundaland/Nicobar region'],
    [/In-situ\s*\(NP\/BR\)/gi, 'In-situ conservation protects species inside their natural habitat, such as National Parks and Biosphere Reserves'],
    [/Ex-situ\s*\(Zoos\/Seed banks\)/gi, 'Ex-situ conservation protects species outside natural habitat, such as zoos, botanical gardens, gene banks, and seed banks'],
    [/IUCN:\s*CR\s*\(GIB\),\s*EN\s*\(Tiger\)/gi, 'IUCN Red List categories include Critically Endangered and Endangered; Great Indian Bustard is commonly cited as Critically Endangered and tiger as Endangered'],
    [/UNFCCC\s*\(Rio\)/gi, 'UNFCCC came from the 1992 Rio Earth Summit and is the framework convention for climate change negotiations'],
    [/Kyoto\s*\(GHG\)/gi, 'Kyoto Protocol set binding greenhouse gas emission reduction targets mainly for developed countries'],
    [/Paris\s*\(NDCs\)/gi, 'Paris Agreement uses Nationally Determined Contributions, where countries submit their own climate action targets'],
    [/Montreal\s*\(Ozone\/Kigali\)/gi, 'Montreal Protocol protects the ozone layer; Kigali Amendment targets phasedown of HFCs'],
    [/CBD\s*\(Nagoya\/Cartagena\)/gi, 'Convention on Biological Diversity is linked with Nagoya Protocol on benefit sharing and Cartagena Protocol on biosafety'],
    [/WPA\s*1972\s*\(Schedules\)/gi, 'Wildlife Protection Act, 1972 protects wild animals, birds, and plants through schedules of protection'],
    [/EPA\s*1986\s*\(Umbrella\)/gi, 'Environment Protection Act, 1986 is an umbrella law giving the Union government broad powers to protect the environment'],
    [/NGT\s*2010/gi, 'National Green Tribunal Act, 2010 created a specialized tribunal for environmental cases'],
    [/FRA\s*2006\s*\(Gram Sabha\)/gi, 'Forest Rights Act, 2006 recognizes forest rights and gives Gram Sabha an important role in claims and community forest resource protection'],
    [/BOD high\s*=\s*Polluted/gi, 'High Biological Oxygen Demand indicates organic pollution because microbes consume more dissolved oxygen'],
    [/Eutrophication\s*=\s*Algae/gi, 'Eutrophication is nutrient enrichment of water bodies leading to algal bloom and oxygen depletion'],
    [/Biomagnification\s*=\s*Toxin increase/gi, 'Biomagnification is the increase in concentration of persistent toxins at higher trophic levels'],
    [/Fly Ash\s*=\s*Thermal power/gi, 'Fly ash is a major particulate waste from coal-based thermal power plants'],
    [/\bNP\/BR\b/g, 'National Parks/Biosphere Reserves'],
    [/\bGIB\b/g, 'Great Indian Bustard'],
    [/\bGHG\b/g, 'greenhouse gases'],
    [/\bNDCs\b/g, 'Nationally Determined Contributions'],
    [/\bCR\b/g, 'Critically Endangered'],
    [/\bEN\b/g, 'Endangered'],
  ];

  for (const [pattern, replacement] of replacements) {
    value = value.replace(pattern, replacement);
  }

  value = value
    .replace(/\s+vs\s+/gi, ', whereas ')
    .replace(/\.\s*([A-Z][A-Za-z ]+):/g, '. $1 means:')
    .replace(/means means:/gi, 'means:')
    .replace(/species means:/gi, 'species, including')
    .replace(/\)\.\s*/g, '). ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  return value;
}

function studyDepth(topic, notes) {
  const title = clean(topic);
  const parts = notes.slice(0, 6).map((note) => `${clean(note.title)}: ${expandKnownFact(note.detail)}`);
  return [
    `${title} is a daily exam-learning block, not just a list of facts. Read each point for definition, example, and common trap.`,
    ...parts,
    'Before attempting the quiz, be able to explain each term in one sentence and match it with its law, convention, example, or exam keyword.',
  ].join('\n\n');
}

function normalizeNotes(payload) {
  const snapshot = payload.snapshot || {};
  const notes = Array.isArray(snapshot.quick_notes) ? snapshot.quick_notes : [];
  return notes
    .map((note) => ({
      title: clean(note.title || 'Concept'),
      detail: expandKnownFact(note.detail || note.title),
    }))
    .filter((note) => note.title && note.detail);
}

function makeFlashcards(topic, notes) {
  return notes.map((note) => ({
    front: `Explain ${note.title} in the exam context.`,
    back: `${note.detail} Exam recall: connect it back to ${clean(topic)} and avoid treating it as a loose keyword.`,
  }));
}

function makeQuiz(topic, notes, target, existingQuestions) {
  const usable = notes.length ? notes : [{ title: clean(topic), detail: `Core concepts from ${clean(topic)}` }];
  const questions = [];

  for (let i = 0; questions.length < target; i += 1) {
    const note = usable[i % usable.length];
    const distractors = usable
      .filter((other) => other.title !== note.title)
      .slice(0, 3)
      .map((other) => compact(other.title, 80));
    while (distractors.length < 3) {
      distractors.push(`Another area of ${clean(topic)}`);
    }
    const options = [compact(note.title, 80), ...distractors].slice(0, 4);
    const rotateBy = (i + clean(topic).length) % 4;
    const rotated = [...options.slice(rotateBy), ...options.slice(0, rotateBy)];
    const answerIndex = rotated.indexOf(options[0]);
    questions.push({
      question: `In ${clean(topic)}, this exam clue belongs to which area: "${compact(note.detail, 170)}"?`,
      options: rotated,
      answer_index: answerIndex,
      explanation: `${note.title}: ${note.detail}`,
      source: 'expanded_same_day_study_content',
    });
  }

  const seen = new Set();
  return questions.concat(existingQuestions || [])
    .filter((q) => q?.question && Array.isArray(q.options) && q.options.length >= 2)
    .filter((q) => {
      const key = clean(q.question).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, target);
}

function targetFor(trackId) {
  return trackId === 'ssc_ecosystem' ? 25 : 12;
}

async function main() {
  const { data, error } = await supabase
    .from('master_content_vault')
    .select('track_id, day_number, topic_title, content_json')
    .in('track_id', ['upsc_ecosystem', 'tnpsc_ecosystem', 'ssc_ecosystem'])
    .order('track_id')
    .order('day_number');

  if (error) throw error;

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.resolve(__dirname, `../scratch/daily-mission-before-study-expand-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  let changed = 0;
  for (const row of data) {
    const payload = parsePayload(row.content_json);
    const topic = clean(row.topic_title || payload.topic_title || payload.snapshot?.title || `Day ${row.day_number}`);
    const notes = normalizeNotes(payload);
    if (!notes.length) continue;

    const target = targetFor(row.track_id);
    const expandedPayload = {
      ...payload,
      track: payload.track || row.track_id,
      day_number: payload.day_number || row.day_number,
      topic_title: payload.topic_title || topic,
      snapshot: {
        ...(payload.snapshot || {}),
        title: payload.snapshot?.title || topic,
        mastery_depth: studyDepth(topic, notes),
        quick_notes: notes,
      },
      flashcards: makeFlashcards(topic, notes),
      quiz: {
        questions: makeQuiz(topic, notes, target, payload.quiz?.questions || []),
      },
    };

    changed += 1;
    if (!DRY_RUN) {
      const { error: updateError } = await supabase
        .from('master_content_vault')
        .update({
          content_json: expandedPayload,
          updated_at: new Date().toISOString(),
        })
        .eq('track_id', row.track_id)
        .eq('day_number', row.day_number);
      if (updateError) throw updateError;
    }
  }

  const report = { dryRun: DRY_RUN, rows: data.length, changed, backupPath };
  const reportPath = path.resolve(__dirname, `../scratch/daily-mission-study-expand-report-${stamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, reportPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
