const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const YT = 'https://www.youtube.com/results?search_query=';

const patches = [
  {
    track_id: 'upsc_prelims',
    day_number: 62,
    topic_title: 'Health & Disease Basics',
    content_json: {
      topic_title: 'Health & Disease Basics',
      day_number: 62,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Disease basics', detail: 'UPSC general science disease questions stay around pathogen type, vector, transmission mode, and preventive logic.' },
        { title: 'Communicable vs non-communicable', detail: 'Communicable diseases spread through agents or transmission routes; non-communicable diseases do not spread person to person in that way.' },
        { title: 'Vector clarity', detail: 'Mosquito-borne diseases are often confused with one another. Vector-based distinction matters.' },
        { title: 'Pathogen type', detail: 'Basic virus, bacteria, protozoa, and parasite distinctions often appear in school-level biology questions.' },
        { title: 'Public health lens', detail: 'Vaccination, sanitation, nutrition, and hygiene are frequently linked to prevention questions.' },
        { title: 'Question pattern', detail: 'These are conceptual recall questions, not medical-depth questions.' },
      ]},
      flashcards: [
        { front: 'Malaria vector', back: 'Anopheles mosquito' },
        { front: 'Tuberculosis category', back: 'Communicable disease' },
        { front: 'Vaccination purpose', back: 'Prevention against specific infectious disease' },
        { front: 'Virus and bacteria', back: 'Different pathogen categories' },
        { front: 'Sanitation link', back: 'Public health prevention measure' },
        { front: 'Non-communicable disease', back: 'Does not spread by ordinary infection route' },
      ],
      videos: [
        { title: 'UPSC Health and Disease Basics', url: `${YT}upsc+health+disease+basics`, summary: 'Pathogens, vectors, communicable diseases, and public health basics for prelims.' },
        { title: 'General Science Disease Revision UPSC', url: `${YT}upsc+general+science+disease+revision`, summary: 'Useful for school-level biology disease revision before mixed mocks.' },
      ],
      quiz: { questions: [
        { question: 'Malaria is caused by:', options: ['Virus', 'Bacterium', 'Protozoan parasite', 'Fungus'], answer_index: 2, explanation: 'Malaria is caused by Plasmodium, a protozoan parasite.' },
        { question: 'Vector of malaria is:', options: ['Housefly', 'Anopheles mosquito', 'Tick', 'Cockroach'], answer_index: 1, explanation: 'Malaria spreads through female Anopheles mosquito.' },
        { question: 'Tuberculosis is generally classified as:', options: ['Non-communicable', 'Communicable', 'Only genetic', 'Only nutritional'], answer_index: 1, explanation: 'TB is a communicable infectious disease.' },
        { question: 'Vaccination is mainly associated with:', options: ['Breaking bones', 'Infection prevention', 'Only digestion', 'Only blood pressure'], answer_index: 1, explanation: 'Vaccination helps prevent specific infectious diseases.' },
        { question: 'Which one is a public-health prevention measure?', options: ['Poor sanitation', 'Unsafe water', 'Hygiene and sanitation', 'Ignoring symptoms'], answer_index: 2, explanation: 'Hygiene and sanitation reduce disease spread.' },
        { question: 'Communicable diseases are those that:', options: ['Never affect health', 'Can spread through infectious routes', 'Only affect plants', 'Cannot be prevented'], answer_index: 1, explanation: 'They spread through pathogens and transmission routes.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 65,
    topic_title: 'Revision & Quick Quiz (Science Week)',
    content_json: {
      topic_title: 'Revision & Quick Quiz (Science Week)',
      day_number: 65,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Physics recap', detail: 'Unit, force, work, power, light, and basic motion questions should be quick recall by now.' },
        { title: 'Chemistry recap', detail: 'Element, compound, mixture, acid-base, and pH distinctions should stay clean.' },
        { title: 'Biology recap', detail: 'Cell, photosynthesis, respiration, disease basics, and public-health logic remain the main high-yield areas.' },
        { title: 'Revision purpose', detail: 'Science revision day should reconnect the three science blocks instead of turning into unrelated fact fragments.' },
        { title: 'Prelims style', detail: 'UPSC science revision is strongest when concept pairs are clear: force/power, mixture/compound, respiration/photosynthesis.' },
        { title: 'Quick-quiz role', detail: 'The quiz should test concept recall across physics, chemistry, and biology without drifting into specialist detail.' },
      ]},
      flashcards: [
        { front: 'Unit of force', back: 'Newton' },
        { front: 'pH 7', back: 'Neutral' },
        { front: 'Powerhouse of the cell', back: 'Mitochondria' },
        { front: 'Compound', back: 'Chemical combination in fixed ratio' },
        { front: 'Work requires', back: 'Force with displacement' },
        { front: 'Photosynthesis', back: 'Preparation of food in green plants' },
      ],
      videos: [
        { title: 'UPSC Science Week Revision', url: `${YT}upsc+science+week+revision+physics+chemistry+biology`, summary: 'Compact revision of the science block with concept-first recall.' },
        { title: 'UPSC General Science Quick Quiz Revision', url: `${YT}upsc+general+science+revision+quiz`, summary: 'Useful for mixed science reactivation before mocks.' },
      ],
      quiz: { questions: [
        { question: 'Unit of force is:', options: ['Joule', 'Newton', 'Watt', 'Volt'], answer_index: 1, explanation: 'Force is measured in newton.' },
        { question: 'pH 7 indicates:', options: ['Acidic', 'Basic', 'Neutral', 'Metallic'], answer_index: 2, explanation: 'pH 7 is neutral.' },
        { question: 'Powerhouse of the cell is:', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cell wall'], answer_index: 1, explanation: 'Mitochondria are known as the powerhouse of the cell.' },
        { question: 'A compound differs from a mixture because it has:', options: ['Only physical combination', 'Fixed chemical combination', 'No atoms', 'Only liquid form'], answer_index: 1, explanation: 'Compounds are chemically combined in fixed ratio.' },
        { question: 'Work is done when there is:', options: ['Only force', 'Only displacement', 'Force causing displacement', 'Only speed'], answer_index: 2, explanation: 'Work requires force with displacement.' },
        { question: 'Photosynthesis is associated with:', options: ['Preparation of food in plants', 'Only human digestion', 'Cloud formation', 'Blood clotting'], answer_index: 0, explanation: 'Photosynthesis prepares food in green plants.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 78,
    topic_title: 'Full Revision & Mock Phase (Environment Revision)',
    content_json: {
      topic_title: 'Full Revision & Mock Phase (Environment Revision)',
      day_number: 78,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Environment revision goal', detail: 'This day should consolidate ecology, biodiversity, conservation, and treaty-level concepts before mocks.' },
        { title: 'Concept blocks', detail: 'Food chain, food web, habitat, niche, biodiversity level, protected area types, and climate-agreement basics should all remain distinct.' },
        { title: 'Treaty discipline', detail: 'UNFCCC, CBD, Kyoto, Paris, and CITES should not be mixed casually; each belongs to a specific context.' },
        { title: 'Protected-area clarity', detail: 'National park, sanctuary, biosphere reserve, and ex-situ conservation should be revision anchors.' },
        { title: 'Mock-phase purpose', detail: 'A revision row in mock phase should support elimination and statement comparison, not loose memorization only.' },
        { title: 'UPSC pattern', detail: 'Environment revision becomes effective when ideas are compared in pairs and tested in statement format.' },
      ]},
      flashcards: [
        { front: 'Energy pyramid', back: 'Always upright' },
        { front: 'UNFCCC', back: '1992 climate framework convention' },
        { front: 'CBD', back: 'Convention on Biological Diversity' },
        { front: 'CITES', back: 'Trade in endangered species convention' },
        { front: 'Habitat', back: 'Natural home of an organism' },
        { front: 'Niche', back: 'Functional role in ecosystem' },
      ],
      videos: [
        { title: 'UPSC Environment Full Revision', url: `${YT}upsc+environment+full+revision`, summary: 'Ecology, biodiversity, conservation, and treaty revision before mocks.' },
        { title: 'UPSC Environment Mock Revision Concepts', url: `${YT}upsc+environment+mock+revision`, summary: 'Useful for statement-based elimination and concept comparison.' },
      ],
      quiz: { questions: [
        { question: 'Energy pyramid is always:', options: ['Inverted', 'Upright', 'Circular', 'Undefined'], answer_index: 1, explanation: 'Energy pyramid is always upright.' },
        { question: 'CBD stands for:', options: ['Climate Balance Doctrine', 'Convention on Biological Diversity', 'Carbon Budget Division', 'Coastal Biodiversity Directive'], answer_index: 1, explanation: 'CBD = Convention on Biological Diversity.' },
        { question: 'CITES is mainly related to:', options: ['Global tax reform', 'Trade in endangered species', 'Ocean salinity', 'Judicial review'], answer_index: 1, explanation: 'CITES regulates trade in endangered species.' },
        { question: 'Habitat refers to:', options: ['Role performed by species', 'Natural living place', 'Only feeding level', 'Only species number'], answer_index: 1, explanation: 'Habitat is the natural home.' },
        { question: 'UNFCCC is associated mainly with:', options: ['Ozone treaty only', 'Climate framework', 'Desert archaeology', 'Nuclear trade'], answer_index: 1, explanation: 'UNFCCC is the climate framework convention.' },
        { question: 'Niche differs from habitat because niche refers to:', options: ['Only shelter', 'Functional role', 'Only temperature', 'Only water'], answer_index: 1, explanation: 'Niche is the functional role of the organism.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 79,
    topic_title: 'Full Revision & Mock Phase (Science Revision)',
    content_json: {
      topic_title: 'Full Revision & Mock Phase (Science Revision)',
      day_number: 79,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Science revision goal', detail: 'This day should consolidate the core physics, chemistry, and biology concepts likely to appear as direct prelims questions.' },
        { title: 'Physics anchor', detail: 'Units, force, work, power, and common school-level conceptual distinctions remain central.' },
        { title: 'Chemistry anchor', detail: 'Element, compound, mixture, acid-base, and pH are the main quick-recall areas.' },
        { title: 'Biology anchor', detail: 'Cell, respiration, photosynthesis, health, and disease basics remain the most useful block.' },
        { title: 'Mock-phase purpose', detail: 'Science revision in mock phase should reduce silly misses on easy conceptual questions.' },
        { title: 'UPSC style', detail: 'The best science revision row keeps concepts sharp and separate, not overloaded.' },
      ]},
      flashcards: [
        { front: 'Newton', back: 'Unit of force' },
        { front: 'Joule', back: 'Unit of work' },
        { front: 'Neutral pH', back: '7' },
        { front: 'Mitochondria', back: 'Powerhouse of the cell' },
        { front: 'Compound', back: 'Chemical combination in fixed ratio' },
        { front: 'Photosynthesis', back: 'Food preparation in plants' },
      ],
      videos: [
        { title: 'UPSC Science Full Revision', url: `${YT}upsc+science+full+revision`, summary: 'Physics, chemistry, and biology basics in one revision run.' },
        { title: 'UPSC Science Mock Revision', url: `${YT}upsc+science+mock+revision`, summary: 'Useful before mocks to avoid missing direct school-level science questions.' },
      ],
      quiz: { questions: [
        { question: 'Unit of work is:', options: ['Joule', 'Newton', 'Volt', 'Pascal'], answer_index: 0, explanation: 'Work is measured in joule.' },
        { question: 'pH 7 indicates:', options: ['Acidic', 'Basic', 'Neutral', 'Radioactive'], answer_index: 2, explanation: 'pH 7 is neutral.' },
        { question: 'Powerhouse of the cell is:', options: ['Nucleus', 'Mitochondria', 'Cell wall', 'Ribosome'], answer_index: 1, explanation: 'Mitochondria are known as the powerhouse of the cell.' },
        { question: 'A compound has:', options: ['Only physical mixing', 'Fixed chemical combination', 'No atoms', 'Only gaseous state'], answer_index: 1, explanation: 'Compounds are chemically combined in fixed ratio.' },
        { question: 'Photosynthesis occurs in:', options: ['Green plant parts', 'Only muscles', 'Only bones', 'Only blood'], answer_index: 0, explanation: 'Photosynthesis occurs in green plant parts containing chlorophyll.' },
        { question: 'Newton is a unit of:', options: ['Work', 'Force', 'Power', 'Pressure'], answer_index: 1, explanation: 'Newton is the unit of force.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 94,
    topic_title: 'Final Phase (Environment + Climate Agreements Quick Rev)',
    content_json: {
      topic_title: 'Final Phase (Environment + Climate Agreements Quick Rev)',
      day_number: 94,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Final-phase objective', detail: 'This row should preserve high-frequency treaty recall without becoming an uncontrolled list of years.' },
        { title: 'Core climate set', detail: 'UNFCCC, Kyoto Protocol, and Paris Agreement should be revised with clean sequence and purpose.' },
        { title: 'Core biodiversity set', detail: 'CBD and CITES should remain distinct in theme: biodiversity framework versus endangered-species trade.' },
        { title: 'Concept link', detail: 'Treaties matter because prelims often combines concept and chronology in statement form.' },
        { title: 'Quick-revision discipline', detail: 'Only the major agreements and their purpose should dominate here, not marginal convention clutter.' },
        { title: 'UPSC final prep use', detail: 'This is a fast memory-stability row, not a source of brand-new information.' },
      ]},
      flashcards: [
        { front: 'UNFCCC', back: '1992 climate framework convention' },
        { front: 'Kyoto Protocol', back: '1997' },
        { front: 'Paris Agreement', back: '2015' },
        { front: 'CBD', back: 'Convention on Biological Diversity' },
        { front: 'CITES', back: 'Trade in endangered species convention' },
        { front: 'Final revision use', back: 'Preserve sequence and purpose' },
      ],
      videos: [
        { title: 'UPSC Climate Agreements Quick Revision', url: `${YT}upsc+climate+agreements+quick+revision`, summary: 'Fast revision of major environment and climate agreements for prelims.' },
        { title: 'UPSC Environment Treaty Revision', url: `${YT}upsc+environment+treaty+revision`, summary: 'Useful for chronology and concept matching before the exam.' },
      ],
      quiz: { questions: [
        { question: 'CBD year is:', options: ['1972', '1992', '1997', '2015'], answer_index: 1, explanation: 'CBD was adopted in 1992.' },
        { question: 'Kyoto Protocol is associated with:', options: ['1997', '1987', '2015', '1973'], answer_index: 0, explanation: 'Kyoto Protocol was adopted in 1997.' },
        { question: 'Paris Agreement year is:', options: ['1992', '1997', '2002', '2015'], answer_index: 3, explanation: 'Paris Agreement was adopted in 2015.' },
        { question: 'CITES mainly deals with:', options: ['Trade in endangered species', 'Ocean temperature', 'Judicial appointments', 'Agricultural subsidies'], answer_index: 0, explanation: 'CITES regulates trade in endangered species.' },
        { question: 'UNFCCC is best understood as:', options: ['A biodiversity-only treaty', 'A climate framework convention', 'A trade agreement', 'A disease protocol'], answer_index: 1, explanation: 'UNFCCC is the climate framework convention.' },
        { question: 'Final quick revision should mainly preserve:', options: ['Random extra facts', 'Sequence and purpose of major agreements', 'Only video names', 'Only article numbers'], answer_index: 1, explanation: 'That is the real use of this row.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 10,
    topic_title: 'Analogies & Classification Revision',
    content_json: {
      topic_title: 'Analogies & Classification Revision',
      day_number: 10,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Revision purpose', detail: 'This day should reinforce relation-type thinking and odd-rule identification, not drift into unrelated reasoning blocks.' },
        { title: 'Analogy habit', detail: 'Always identify the relation first: function, category, part-whole, degree, sequence, or cause-effect.' },
        { title: 'Classification habit', detail: 'Find the common property among three items and isolate the one that breaks it.' },
        { title: 'Language clarity', detail: 'In word-based analogy/classification, meaning must be clear before pattern matching.' },
        { title: 'Number analogy caution', detail: 'For number analogy, check operation pattern before treating it as a plain sequence.' },
        { title: 'SSC speed', detail: 'Fast accuracy comes from naming the rule mentally before choosing the option.' },
      ]},
      flashcards: [
        { front: 'Dog : Bark :: Cat : ?', back: 'Meow' },
        { front: 'Book : Read :: Pen : ?', back: 'Write' },
        { front: 'Odd one: Apple, Mango, Banana, Carrot', back: 'Carrot' },
        { front: 'Odd one: Copper, Iron, Gold, Plastic', back: 'Plastic' },
        { front: 'Analogy first step', back: 'Identify relation type' },
        { front: 'Classification first step', back: 'Find common property among the group' },
      ],
      videos: [
        { title: 'SSC Analogies and Classification Revision', url: `${YT}ssc+analogies+classification+revision`, summary: 'Topic-pure reasoning revision for relation and odd-one-out logic.' },
        { title: 'SSC Analogy Practice Set', url: `${YT}ssc+analogy+practice+set`, summary: 'Useful for sharpening relation-type recognition.' },
      ],
      quiz: { questions: [
        { question: 'Book : Read :: Pen : ?', options: ['Paper', 'Ink', 'Write', 'School'], answer_index: 2, explanation: 'Pen is used to write.' },
        { question: 'Dog : Bark :: Cat : ?', options: ['Run', 'Meow', 'Jump', 'Tail'], answer_index: 1, explanation: 'Cat meows just as dog barks.' },
        { question: 'Odd one out: Apple, Mango, Banana, Carrot', options: ['Apple', 'Mango', 'Banana', 'Carrot'], answer_index: 3, explanation: 'Carrot is not a fruit.' },
        { question: 'Odd one out: Copper, Iron, Gold, Plastic', options: ['Copper', 'Iron', 'Gold', 'Plastic'], answer_index: 3, explanation: 'Plastic is not a metal.' },
        { question: 'In analogy questions, the safest first step is:', options: ['Guess quickly', 'Identify relation type', 'Count letters only', 'Choose longest option'], answer_index: 1, explanation: 'Relation type gives the logic.' },
        { question: 'In classification questions, you should first:', options: ['Find common property', 'Memorize all options', 'Ignore meaning', 'Use multiplication'], answer_index: 0, explanation: 'The odd item is found by checking the common property in the rest.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 21,
    topic_title: 'Previous Week GA Topics + Mixed Quiz',
    content_json: {
      topic_title: 'Previous Week GA Topics + Mixed Quiz',
      day_number: 21,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'GA revision day', detail: 'This day should revise the week’s general awareness block only, not drift into quant or reasoning filler.' },
        { title: 'Revision mode', detail: 'GA mixed revision works best when facts are grouped mentally by history, polity, geography, science, and current basic awareness.' },
        { title: 'Direct-question nature', detail: 'SSC GA is often direct and fact-based. One-line recall matters more than long explanation.' },
        { title: 'Year and institution caution', detail: 'Founding year, institution role, constitutional office, and scientific fact are common confusion points.' },
        { title: 'Mixed-quiz purpose', detail: 'The quiz should test quick switching across GA areas while staying inside GA.' },
        { title: 'SSC discipline', detail: 'A mixed GA day should still feel coherent and factual, not random.' },
      ]},
      flashcards: [
        { front: 'INC founded', back: '1885' },
        { front: 'Indian Constitution commenced', back: '26 January 1950' },
        { front: 'Capital of India', back: 'New Delhi' },
        { front: 'pH 7', back: 'Neutral' },
        { front: 'Prime Minister heads', back: 'Union government executive' },
        { front: 'National animal of India', back: 'Tiger' },
      ],
      videos: [
        { title: 'SSC GA Weekly Revision', url: `${YT}ssc+ga+weekly+revision`, summary: 'Mixed GA revision across history, polity, geography, and science.' },
        { title: 'SSC GA Mixed Quiz Practice', url: `${YT}ssc+ga+mixed+quiz+practice`, summary: 'Useful for quick factual switching across GA sections.' },
      ],
      quiz: { questions: [
        { question: 'INC was founded in:', options: ['1885', '1905', '1919', '1942'], answer_index: 0, explanation: 'INC was founded in 1885.' },
        { question: 'The Constitution of India came into force on:', options: ['15 August 1947', '26 January 1950', '26 November 1949', '2 October 1950'], answer_index: 1, explanation: 'It came into force on 26 January 1950.' },
        { question: 'Capital of India is:', options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], answer_index: 2, explanation: 'New Delhi is the capital of India.' },
        { question: 'pH 7 indicates:', options: ['Acidic', 'Basic', 'Neutral', 'Salty'], answer_index: 2, explanation: 'pH 7 is neutral.' },
        { question: 'The Prime Minister heads the:', options: ['Judiciary', 'Union government executive', 'Election Commission', 'Planning Board only'], answer_index: 1, explanation: 'The PM heads the Union government executive.' },
        { question: 'National animal of India is:', options: ['Lion', 'Elephant', 'Tiger', 'Peacock'], answer_index: 2, explanation: 'Tiger is the national animal.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 27,
    topic_title: 'Previous Week GA Topics + Mixed Quiz',
    content_json: {
      topic_title: 'Previous Week GA Topics + Mixed Quiz',
      day_number: 27,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Week GA revision', detail: 'This row should revise the current GA block in a clean, factual way without importing quant filler.' },
        { title: 'Factual anchors', detail: 'Founding year, capital, constitutional office, basic science facts, and national symbols remain common SSC GA anchors.' },
        { title: 'Switching skill', detail: 'The student should move from history to polity to science without losing factual accuracy.' },
        { title: 'Question type', detail: 'Most GA questions are short and direct. Confusion usually comes from similar-looking options.' },
        { title: 'Revision intent', detail: 'A mixed GA day should support recall and retention, not content drift.' },
        { title: 'SSC use', detail: 'Keep this day sharp, factual, and easy to review quickly.' },
      ]},
      flashcards: [
        { front: 'INC founded', back: '1885' },
        { front: 'New Delhi', back: 'Capital of India' },
        { front: '26 January 1950', back: 'Constitution commenced' },
        { front: 'Tiger', back: 'National animal of India' },
        { front: 'Neutral pH', back: '7' },
        { front: 'PM', back: 'Heads Union executive' },
      ],
      videos: [
        { title: 'SSC GA Mixed Revision Set', url: `${YT}ssc+ga+mixed+revision+set`, summary: 'Direct factual GA revision across major SSC areas.' },
        { title: 'SSC GA Quick Quiz Revision', url: `${YT}ssc+ga+quick+quiz+revision`, summary: 'Useful for fast GA recall before mocks.' },
      ],
      quiz: { questions: [
        { question: 'Capital of India is:', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Bengaluru'], answer_index: 1, explanation: 'New Delhi is the capital.' },
        { question: 'Constitution of India came into force on:', options: ['15 August 1947', '26 November 1949', '26 January 1950', '1 January 1950'], answer_index: 2, explanation: 'It came into force on 26 January 1950.' },
        { question: 'National animal of India is:', options: ['Lion', 'Tiger', 'Elephant', 'Horse'], answer_index: 1, explanation: 'Tiger is the national animal.' },
        { question: 'INC was founded in:', options: ['1885', '1895', '1905', '1915'], answer_index: 0, explanation: 'INC was founded in 1885.' },
        { question: 'pH 7 means:', options: ['Acidic', 'Basic', 'Neutral', 'Poisonous'], answer_index: 2, explanation: 'pH 7 is neutral.' },
        { question: 'The Prime Minister is associated with:', options: ['Judiciary', 'Union executive', 'Election Commission', 'Comptroller only'], answer_index: 1, explanation: 'The PM heads the Union executive.' },
      ]},
    },
  },
];

async function main() {
  for (const patch of patches) {
    const { error } = await supabase
      .from('master_content_vault')
      .update({
        topic_title: patch.topic_title,
        content_json: patch.content_json,
        updated_at: new Date().toISOString(),
      })
      .eq('track_id', patch.track_id)
      .eq('day_number', patch.day_number);
    if (error) throw error;
    console.log(`Patched ${patch.track_id} day ${patch.day_number}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
