const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const YT = 'https://www.youtube.com/results?search_query=';

const patches = [
  {
    track_id: 'upsc_prelims',
    day_number: 47,
    topic_title: 'Agriculture & Rural Development',
    content_json: {
      topic_title: 'Agriculture & Rural Development',
      day_number: 47,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Agriculture in prelims', detail: 'UPSC usually asks institutional and conceptual questions rather than deep farm-level technique.' },
        { title: 'MSP mechanism', detail: 'Minimum Support Price is announced by the Union government based on CACP recommendations.' },
        { title: 'Procurement distinction', detail: 'MSP and actual procurement are not the same thing.' },
        { title: 'Soil and irrigation relevance', detail: 'Crop questions may connect climate, irrigation, and soil suitability.' },
        { title: 'Rural institutions', detail: 'NABARD, SHGs, cooperatives, and rural credit systems often appear in pair-matching questions.' },
        { title: 'UPSC caution', detail: 'Many agriculture schemes are advisory or selective, not universal.' },
      ]},
      flashcards: [
        { front: 'MSP recommendation body', back: 'CACP' },
        { front: 'MSP announced by', back: 'Union government' },
        { front: 'NABARD focus', back: 'Rural and agricultural development finance' },
        { front: 'MSP and procurement', back: 'Not identical processes' },
        { front: 'SHG', back: 'Member-based savings and credit group' },
        { front: 'Rural credit question type', back: 'Institution-role matching' },
      ],
      videos: [
        { title: 'UPSC Agriculture Basics and MSP', url: `${YT}upsc+agriculture+msp+nabard`, summary: 'MSP, procurement, rural credit, and agriculture institutions for prelims.' },
        { title: 'Rural Development for UPSC Prelims', url: `${YT}upsc+rural+development+prelims`, summary: 'Useful for institutional clarity and scheme-role distinction.' },
      ],
      quiz: { questions: [
        { question: 'MSP is recommended by which body?', options: ['RBI', 'NITI Aayog', 'CACP', 'SEBI'], answer_index: 2, explanation: 'CACP recommends MSP.' },
        { question: 'Which statement is correct?', options: ['MSP always guarantees procurement of all output', 'MSP and procurement are identical', 'MSP may exist without universal procurement', 'MSP is fixed by RBI'], answer_index: 2, explanation: 'Procurement is not universal just because MSP exists.' },
        { question: 'NABARD is primarily associated with:', options: ['Urban housing finance', 'Rural and agricultural finance', 'Stock market regulation', 'Insurance regulation'], answer_index: 1, explanation: 'NABARD focuses on rural and agricultural development finance.' },
        { question: 'Self Help Groups are mainly associated with:', options: ['Large industrial finance', 'Small savings and local credit mobilisation', 'Foreign trade settlements', 'Nuclear regulation'], answer_index: 1, explanation: 'SHGs work around local savings and small credit linkage.' },
        { question: 'Crop suitability questions often connect with:', options: ['Only poetry', 'Climate and irrigation', 'Only Constitution', 'Only banking'], answer_index: 1, explanation: 'UPSC often combines crop, climate, and irrigation logic.' },
        { question: 'Which one is best understood as a rural credit institution?', options: ['NABARD', 'Election Commission', 'NHAI', 'UPSC'], answer_index: 0, explanation: 'NABARD is a rural credit institution.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 48,
    topic_title: 'Revision & Quick Quiz (Economy Week 1)',
    content_json: {
      topic_title: 'Revision & Quick Quiz (Economy Week 1)',
      day_number: 48,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'GDP and GNP', detail: 'GDP is domestic output; GNP adjusts it using net factor income from abroad.' },
        { title: 'Inflation measurement', detail: 'CPI tracks retail inflation and remains central to policy discussion.' },
        { title: 'Deficit recap', detail: 'Revenue deficit, fiscal deficit, and primary deficit must be separated by what each actually measures.' },
        { title: 'Banking recap', detail: 'Repo, reverse repo, CRR, SLR, and NPA are not interchangeable.' },
        { title: 'Revision intent', detail: 'Economy revision should reconnect concepts, not become random fact dumping.' },
        { title: 'Prelims mindset', detail: 'Economy works best through paired comparison: GDP/GNP, CRR/SLR, revenue/capital, deficit types.' },
      ]},
      flashcards: [
        { front: 'GDP vs GNP difference', back: 'Net factor income from abroad' },
        { front: 'Retail inflation index', back: 'CPI' },
        { front: 'Fiscal deficit reflects', back: 'Borrowing requirement' },
        { front: 'Primary deficit', back: 'Fiscal deficit - interest payments' },
        { front: 'CRR', back: 'Cash kept with RBI' },
        { front: 'SLR', back: 'Liquid assets kept by banks themselves' },
      ],
      videos: [
        { title: 'UPSC Economy Revision Week 1', url: `${YT}upsc+economy+revision+gdp+deficit+crr+slr`, summary: 'Compact revision of GDP/GNP, inflation, deficits, and banking basics.' },
        { title: 'UPSC Economy Quick Quiz Concepts', url: `${YT}upsc+economy+quick+revision+prelims`, summary: 'Useful for reactivating economy concepts before mixed mocks.' },
      ],
      quiz: { questions: [
        { question: 'GNP differs from GDP by adding:', options: ['Tax revenue', 'Net factor income from abroad', 'Depreciation only', 'Fiscal deficit'], answer_index: 1, explanation: 'GNP = GDP + net factor income from abroad.' },
        { question: 'Which index is commonly used for retail inflation in India?', options: ['WPI', 'CPI', 'IIP', 'Sensex'], answer_index: 1, explanation: 'CPI tracks retail inflation.' },
        { question: 'Which deficit best represents government borrowing requirement?', options: ['Revenue deficit', 'Fiscal deficit', 'Trade deficit', 'Primary surplus'], answer_index: 1, explanation: 'Fiscal deficit reflects borrowing requirement.' },
        { question: 'Primary deficit is obtained by subtracting ______ from fiscal deficit.', options: ['Revenue receipts', 'Interest payments', 'Capital expenditure', 'Tax revenue'], answer_index: 1, explanation: 'Primary deficit excludes interest payments.' },
        { question: 'CRR is maintained by banks with:', options: ['SEBI', 'RBI', 'NABARD', 'LIC'], answer_index: 1, explanation: 'CRR is kept with RBI.' },
        { question: 'SLR differs from CRR because SLR is maintained:', options: ['Only as cash with RBI', 'As liquid assets by banks themselves', 'Only as foreign currency', 'Only by cooperative banks'], answer_index: 1, explanation: 'SLR is maintained by banks themselves.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 59,
    topic_title: 'General Science – Physics Basics',
    content_json: {
      topic_title: 'General Science – Physics Basics',
      day_number: 59,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Physics in prelims', detail: 'UPSC general science physics usually stays conceptual: unit, motion, force, work, energy, sound, light.' },
        { title: 'SI units', detail: 'Length = metre, mass = kilogram, time = second. Derived units include newton, joule, watt.' },
        { title: 'Force and motion', detail: 'Force can change rest, motion, direction, or shape.' },
        { title: 'Work and energy', detail: 'Work is done when force causes displacement. Energy is capacity to do work.' },
        { title: 'Power meaning', detail: 'Power is the rate of doing work.' },
        { title: 'Question pattern', detail: 'These are usually direct concept and unit questions, not long calculations.' },
      ]},
      flashcards: [
        { front: 'Unit of force', back: 'Newton' },
        { front: 'Unit of work', back: 'Joule' },
        { front: 'Unit of power', back: 'Watt' },
        { front: 'Work requires', back: 'Force with displacement' },
        { front: 'Energy', back: 'Capacity to do work' },
        { front: 'SI unit of time', back: 'Second' },
      ],
      videos: [
        { title: 'UPSC Physics Basics for General Science', url: `${YT}upsc+physics+basics+general+science`, summary: 'Units, force, work, energy, and common prelims-style conceptual questions.' },
        { title: 'General Science Physics One-Shot UPSC', url: `${YT}upsc+general+science+physics+one+shot`, summary: 'Useful for quick conceptual revision before mixed science blocks.' },
      ],
      quiz: { questions: [
        { question: 'Unit of force is:', options: ['Joule', 'Newton', 'Watt', 'Pascal'], answer_index: 1, explanation: 'Force is measured in newton.' },
        { question: 'Work is done only when there is:', options: ['Force without displacement', 'Displacement without force', 'Force causing displacement', 'Only circular motion'], answer_index: 2, explanation: 'Work requires force along with displacement.' },
        { question: 'Unit of power is:', options: ['Watt', 'Joule', 'Newton', 'Ampere'], answer_index: 0, explanation: 'Power is measured in watt.' },
        { question: 'Energy is best defined as:', options: ['Rate of motion', 'Capacity to do work', 'Only heat', 'Only light'], answer_index: 1, explanation: 'That is the standard definition.' },
        { question: 'Which one is a derived unit?', options: ['Metre', 'Kilogram', 'Second', 'Newton'], answer_index: 3, explanation: 'Newton is derived from base units.' },
        { question: 'SI unit of time is:', options: ['Minute', 'Hour', 'Second', 'Day'], answer_index: 2, explanation: 'Second is the SI unit.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 60,
    topic_title: 'General Science – Chemistry Basics',
    content_json: {
      topic_title: 'General Science – Chemistry Basics',
      day_number: 60,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Chemistry in prelims', detail: 'General chemistry questions often focus on atom, molecule, element, compound, mixture, acid-base, and pH.' },
        { title: 'Atom vs molecule', detail: 'Atom is the smallest unit of an element; molecule is a group of bonded atoms.' },
        { title: 'Element vs compound', detail: 'Element has one kind of atom; compound has different elements chemically combined in fixed ratio.' },
        { title: 'Mixture distinction', detail: 'Mixture is a physical combination and may be separated physically.' },
        { title: 'Acid-base-pH', detail: 'pH below 7 is acidic, 7 is neutral, above 7 is basic in standard school-level chemistry.' },
        { title: 'Question pattern', detail: 'UPSC usually asks direct differentiation here rather than deep numerical chemistry.' },
      ]},
      flashcards: [
        { front: 'pH 7', back: 'Neutral' },
        { front: 'pH below 7', back: 'Acidic' },
        { front: 'Element', back: 'One kind of atom' },
        { front: 'Compound', back: 'Different elements chemically combined in fixed ratio' },
        { front: 'Mixture', back: 'Physical combination of substances' },
        { front: 'Molecule', back: 'Group of bonded atoms' },
      ],
      videos: [
        { title: 'UPSC Chemistry Basics General Science', url: `${YT}upsc+chemistry+basics+general+science`, summary: 'Atom, molecule, element, compound, mixture, and pH basics for prelims.' },
        { title: 'Acid Base and pH for UPSC Basics', url: `${YT}upsc+acid+base+ph+basics`, summary: 'Useful for fast revision of school-level chemistry concepts.' },
      ],
      quiz: { questions: [
        { question: 'pH less than 7 indicates:', options: ['Neutral solution', 'Acidic solution', 'Basic solution', 'Salt only'], answer_index: 1, explanation: 'Below 7 is acidic.' },
        { question: 'An element is made of:', options: ['One kind of atom', 'Two compounds only', 'Only different molecules', 'Only liquids'], answer_index: 0, explanation: 'Element contains one kind of atom.' },
        { question: 'A compound differs from a mixture because a compound has:', options: ['Physical combination only', 'Fixed chemical combination', 'No atoms', 'No separation possible'], answer_index: 1, explanation: 'Compounds are chemically combined in fixed ratio.' },
        { question: 'Which of the following is neutral?', options: ['pH 2', 'pH 5', 'pH 7', 'pH 10'], answer_index: 2, explanation: 'pH 7 is neutral.' },
        { question: 'A molecule is best described as:', options: ['Only a metal', 'A group of bonded atoms', 'Only an acid', 'A physical mixture'], answer_index: 1, explanation: 'Molecule is a group of bonded atoms.' },
        { question: 'A mixture can often be separated by:', options: ['Physical methods', 'Only nuclear methods', 'Only by burning', 'Never'], answer_index: 0, explanation: 'Mixtures are physical combinations.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 61,
    topic_title: 'General Science – Biology Basics',
    content_json: {
      topic_title: 'General Science – Biology Basics',
      day_number: 61,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Biology in prelims', detail: 'UPSC biology basics usually stays around cell, photosynthesis, respiration, and standard school-level concepts.' },
        { title: 'Cell concept', detail: 'Cell is the structural and functional unit of life.' },
        { title: 'Nucleus role', detail: 'The nucleus is associated with control of cell activities and genetic material.' },
        { title: 'Mitochondria role', detail: 'Mitochondria are associated with cellular respiration and ATP generation.' },
        { title: 'Photosynthesis and respiration', detail: 'Photosynthesis prepares food in green plants; respiration releases energy from food.' },
        { title: 'Question pattern', detail: 'These are direct NCERT-level recall questions.' },
      ]},
      flashcards: [
        { front: 'Structural and functional unit of life', back: 'Cell' },
        { front: 'Powerhouse of the cell', back: 'Mitochondria' },
        { front: 'Photosynthesis occurs mainly in', back: 'Green plant parts with chlorophyll' },
        { front: 'Respiration releases', back: 'Energy from food' },
        { front: 'Nucleus is linked with', back: 'Control and genetic material' },
        { front: 'Chlorophyll role', back: 'Captures light for photosynthesis' },
      ],
      videos: [
        { title: 'UPSC Biology Basics General Science', url: `${YT}upsc+biology+basics+general+science`, summary: 'Cell, photosynthesis, respiration, and core biology basics.' },
        { title: 'Cell and Human Biology for UPSC Basics', url: `${YT}upsc+cell+biology+basics`, summary: 'Useful for direct prelims-style biology recall.' },
      ],
      quiz: { questions: [
        { question: 'Powerhouse of the cell is:', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer_index: 1, explanation: 'Mitochondria are known as the powerhouse of the cell.' },
        { question: 'Cell is the ______ of life.', options: ['Largest organ', 'Structural and functional unit', 'Only reproductive unit', 'Only plant tissue'], answer_index: 1, explanation: 'Cell is the structural and functional unit of life.' },
        { question: 'Photosynthesis is associated mainly with:', options: ['Breaking rocks', 'Preparation of food in plants', 'Only animal breathing', 'Blood circulation'], answer_index: 1, explanation: 'Photosynthesis prepares food in green plants.' },
        { question: 'Respiration mainly helps in:', options: ['Releasing energy from food', 'Making soil', 'Producing only water', 'Stopping growth'], answer_index: 0, explanation: 'Respiration releases energy from food.' },
        { question: 'Which part is associated with control of cell activities?', options: ['Nucleus', 'Cell wall only', 'Blood plasma', 'Lens'], answer_index: 0, explanation: 'Nucleus is the control centre in basic biology.' },
        { question: 'Chlorophyll is important because it helps in:', options: ['Digestion', 'Photosynthesis', 'Blood clotting', 'Hearing'], answer_index: 1, explanation: 'Chlorophyll helps capture light.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 66,
    topic_title: 'CSAT – Reading Comprehension',
    content_json: {
      topic_title: 'CSAT – Reading Comprehension',
      day_number: 66,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'RC first principle', detail: 'Comprehension is about meaning, tone, and inference, not detached speed-reading.' },
        { title: 'Question-first vs passage-first', detail: 'Either method can work, but the final answer must come from the passage.' },
        { title: 'Tone questions', detail: 'Tone comes from the author’s overall attitude: analytical, critical, cautious, descriptive, etc.' },
        { title: 'Inference caution', detail: 'Inference means what logically follows from the passage, not what is generally true outside it.' },
        { title: 'Extreme options', detail: 'Words like always, never, only, completely often weaken an option unless the passage is equally absolute.' },
        { title: 'CSAT aim', detail: 'The real skill is disciplined reading and elimination.' },
      ]},
      flashcards: [
        { front: 'Best source for RC answer', back: 'Passage meaning, not outside knowledge' },
        { front: 'Inference', back: 'What logically follows from the passage' },
        { front: 'Tone', back: 'Author’s overall attitude' },
        { front: 'Extreme word caution', back: 'Always, never, only may weaken an option' },
        { front: 'Main idea', back: 'Central point of the passage' },
        { front: 'RC elimination', back: 'Reject options that go beyond the passage' },
      ],
      videos: [
        { title: 'UPSC CSAT Reading Comprehension Strategy', url: `${YT}upsc+csat+reading+comprehension+strategy`, summary: 'Passage-based answering, tone, inference, and elimination for CSAT.' },
        { title: 'UPSC CSAT RC Practice Set', url: `${YT}upsc+csat+rc+practice`, summary: 'Useful for building reliable comprehension habits before timed mocks.' },
      ],
      quiz: { questions: [
        { question: 'In reading comprehension, the safest answer is usually the one that:', options: ['Sounds impressive', 'Matches outside knowledge', 'Stays closest to the passage', 'Uses the longest sentence'], answer_index: 2, explanation: 'RC answers must come from the passage.' },
        { question: 'An inference question asks for:', options: ['A random guess', 'A fact unrelated to the passage', 'What logically follows from the passage', 'The hardest option'], answer_index: 2, explanation: 'Inference must logically follow from the text.' },
        { question: 'Tone of a passage refers to:', options: ['The font', 'The author’s overall attitude', 'Only the topic sentence', 'The number of lines'], answer_index: 1, explanation: 'Tone is the author’s stance.' },
        { question: 'Options using words like “always” or “never” should be:', options: ['Always selected', 'Read carefully because they may be too extreme', 'Ignored without reading', 'Chosen for confidence'], answer_index: 1, explanation: 'Extreme wording is often a warning sign.' },
        { question: 'The main idea of a passage is:', options: ['A minor example', 'The central point', 'Only the first line', 'A dictionary meaning'], answer_index: 1, explanation: 'Main idea is the central message.' },
        { question: 'If outside knowledge conflicts with the passage, follow:', options: ['Outside knowledge', 'The passage', 'The longest option', 'Previous year memory only'], answer_index: 1, explanation: 'CSAT RC answers are passage-bound.' },
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
