const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const YT = 'https://www.youtube.com/results?search_query=';

const patches = [
  {
    track_id: 'upsc_prelims',
    day_number: 58,
    topic_title: 'Revision & Quick Quiz (Environment Week 1)',
    content_json: {
      topic_title: 'Revision & Quick Quiz (Environment Week 1)',
      day_number: 58,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Ecology recap', detail: 'Revise ecosystem, food chain, food web, trophic level, habitat, niche, and biodiversity distinctions.' },
        { title: 'Energy flow', detail: 'Energy transfer reduces across trophic levels; pyramids are a common conceptual area.' },
        { title: 'Protected-area recap', detail: 'National park, wildlife sanctuary, biosphere reserve, and ex-situ conservation must stay distinct.' },
        { title: 'Climate and treaty hook', detail: 'UNFCCC and broader climate vocabulary often appear near environment questions in revision sets.' },
        { title: 'Revision purpose', detail: 'This day should reconnect concepts from the environment block, not collapse into random treaty trivia only.' },
        { title: 'Prelims style', detail: 'Environment revision works best through paired distinctions and statement testing.' },
      ]},
      flashcards: [
        { front: 'Food web', back: 'Network of interconnected food chains' },
        { front: 'Habitat', back: 'Natural home of an organism' },
        { front: 'Niche', back: 'Functional role of an organism in an ecosystem' },
        { front: 'Biodiversity levels', back: 'Genetic, species, ecosystem' },
        { front: 'UNFCCC year', back: '1992' },
        { front: 'Energy pyramid', back: 'Always upright' },
      ],
      videos: [
        { title: 'UPSC Environment Revision Week 1', url: `${YT}upsc+environment+revision+ecology+biodiversity`, summary: 'Compact revision of ecology, biodiversity, and environment basics.' },
        { title: 'UPSC Environment Concept Revision', url: `${YT}upsc+environment+concept+revision`, summary: 'Useful for quick concept comparison before mocks.' },
      ],
      quiz: { questions: [
        { question: 'Energy pyramid is always:', options: ['Inverted', 'Upright', 'Circular', 'Undefined'], answer_index: 1, explanation: 'Energy pyramid is always upright.' },
        { question: 'A food web is best understood as:', options: ['A single chain', 'A network of food chains', 'Only producer list', 'Only decomposer map'], answer_index: 1, explanation: 'Food web is an interconnected network.' },
        { question: 'Habitat differs from niche because habitat is:', options: ['Functional role', 'Natural living place', 'Only feeding level', 'Only climate treaty'], answer_index: 1, explanation: 'Habitat is the natural living place.' },
        { question: 'UNFCCC was adopted in:', options: ['1972', '1987', '1992', '1997'], answer_index: 2, explanation: 'UNFCCC was adopted in 1992.' },
        { question: 'Which one is a level of biodiversity?', options: ['Tax level only', 'Species level', 'Voltage level', 'Trade level'], answer_index: 1, explanation: 'Species diversity is one level of biodiversity.' },
        { question: 'Niche refers to:', options: ['Only shelter', 'Functional role in ecosystem', 'Only species count', 'Only water source'], answer_index: 1, explanation: 'Niche refers to role and position in the ecosystem.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 67,
    topic_title: 'CSAT – Logical Reasoning',
    content_json: {
      topic_title: 'CSAT – Logical Reasoning',
      day_number: 67,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'Reasoning base', detail: 'CSAT logical reasoning depends on clean interpretation of statements, relations, conditions, and sequence.' },
        { title: 'Syllogism caution', detail: 'Conclusions must follow from statements, not outside assumptions.' },
        { title: 'Conditional reasoning', detail: 'If-then questions require careful reading of necessary and sufficient conditions.' },
        { title: 'Blood relation and arrangement', detail: 'Map positions or relations step by step instead of holding too much in memory.' },
        { title: 'Elimination habit', detail: 'Remove impossible options early instead of trying to prove every option first.' },
        { title: 'CSAT goal', detail: 'The aim is disciplined logic under time pressure, not decorative puzzle tricks.' },
      ]},
      flashcards: [
        { front: 'Syllogism source', back: 'Statements only' },
        { front: 'If P then Q', back: 'P is sufficient for Q' },
        { front: 'Logical elimination', back: 'Remove impossible options first' },
        { front: 'Arrangement questions', back: 'Track fixed positions carefully' },
        { front: 'Blood relation first step', back: 'Fix reference person' },
        { front: 'Reasoning error', back: 'Importing outside assumptions' },
      ],
      videos: [
        { title: 'UPSC CSAT Logical Reasoning', url: `${YT}upsc+csat+logical+reasoning`, summary: 'Syllogism, arrangement, relations, and conditional logic for CSAT.' },
        { title: 'UPSC CSAT Reasoning Practice', url: `${YT}upsc+csat+reasoning+practice`, summary: 'Useful for timed logical reasoning before mocks.' },
      ],
      quiz: { questions: [
        { question: 'In logical reasoning, the safest basis for conclusion is:', options: ['Outside knowledge', 'Statement given', 'Guessing', 'Longest option'], answer_index: 1, explanation: 'Use the given statements.' },
        { question: 'If all A are B and all B are C, then:', options: ['All C are A', 'All A are C', 'No A are C', 'Some C are not A'], answer_index: 1, explanation: 'All A are C follows.' },
        { question: 'In an if-then statement, “if P then Q” means:', options: ['Q guarantees P', 'P is sufficient for Q', 'P and Q are unrelated', 'Q is false'], answer_index: 1, explanation: 'P implies Q.' },
        { question: 'The first step in blood relation questions is usually to:', options: ['Guess gender', 'Fix reference person', 'Ignore relation words', 'Pick option C'], answer_index: 1, explanation: 'Reference person anchors the relation chain.' },
        { question: 'Best early move in option-based logic questions:', options: ['Accept all options', 'Remove impossible options', 'Use outside facts', 'Write essay'], answer_index: 1, explanation: 'Elimination reduces error quickly.' },
        { question: 'Logical reasoning mainly rewards:', options: ['Decorative language', 'Disciplined interpretation', 'Random speed', 'Lengthy writing'], answer_index: 1, explanation: 'It rewards disciplined logic.' },
      ]},
    },
  },
  {
    track_id: 'upsc_prelims',
    day_number: 88,
    topic_title: 'Full Revision & Mock Phase (CSAT Practice + Time Management)',
    content_json: {
      topic_title: 'Full Revision & Mock Phase (CSAT Practice + Time Management)',
      day_number: 88,
      track: 'upsc_prelims',
      snapshot: { quick_notes: [
        { title: 'CSAT revision aim', detail: 'This day should sharpen decision order, accuracy, and composure across RC, reasoning, and basic numeracy.' },
        { title: 'Attempt order', detail: 'Start with sections you solve reliably. Time management improves when early confidence is stable.' },
        { title: 'Accuracy before aggression', detail: 'Blind attempts in CSAT are dangerous because elimination is often narrow.' },
        { title: 'RC discipline', detail: 'Answers must remain passage-bound, especially when options sound familiar from outside knowledge.' },
        { title: 'Reasoning discipline', detail: 'Use statement logic, relation mapping, and elimination rather than intuition alone.' },
        { title: 'Mock purpose', detail: 'A mock-focused revision day should train judgement under pressure, not just repeat formulas.' },
      ]},
      flashcards: [
        { front: 'Safe CSAT priority', back: 'Reliable accuracy first' },
        { front: 'RC answer source', back: 'Passage only' },
        { front: 'Reasoning answer source', back: 'Given logic only' },
        { front: 'Time management', back: 'Use strong sections early if they are reliable' },
        { front: 'Mock review value', back: 'Find pattern of avoidable errors' },
        { front: 'CSAT risk', back: 'Over-attempting weak questions' },
      ],
      videos: [
        { title: 'UPSC CSAT Time Management Strategy', url: `${YT}upsc+csat+time+management+strategy`, summary: 'Attempt order, accuracy control, and mock-day decision making.' },
        { title: 'UPSC CSAT Full Practice Strategy', url: `${YT}upsc+csat+mock+strategy`, summary: 'Useful for combining RC, reasoning, and time control under exam pressure.' },
      ],
      quiz: { questions: [
        { question: 'A safer CSAT approach is to begin with:', options: ['The hardest section always', 'The section you solve most reliably', 'Only maths', 'Random order'], answer_index: 1, explanation: 'Reliable sections stabilize time and confidence.' },
        { question: 'In RC, outside knowledge should be used:', options: ['Always', 'Only when passage is unclear', 'Very carefully because passage controls the answer', 'Instead of reading'], answer_index: 2, explanation: 'Passage remains the authority.' },
        { question: 'Mock review is useful because it shows:', options: ['Only marks', 'Patterns of avoidable mistakes', 'Only handwriting', 'Nothing important'], answer_index: 1, explanation: 'Review reveals repeat error patterns.' },
        { question: 'Time management mainly fails when a student:', options: ['Moves on from hard questions', 'Gets stuck too early on weak areas', 'Uses elimination', 'Reads carefully'], answer_index: 1, explanation: 'Getting stuck early damages the full paper.' },
        { question: 'Reasoning questions should be solved through:', options: ['Guesswork', 'Statement logic', 'Outside facts', 'Memory of previous options'], answer_index: 1, explanation: 'Reasoning requires given logic.' },
        { question: 'CSAT full revision day should mainly improve:', options: ['Random confidence', 'Judgement under time pressure', 'Only formula memory', 'Only handwriting speed'], answer_index: 1, explanation: 'That is the practical value of this revision day.' },
      ]},
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 44,
    topic_title: 'Aptitude Mixed: Percentage + Ratio + Profit/Loss',
    content_json: {
      topic_title: 'Aptitude Mixed: Percentage + Ratio + Profit/Loss',
      day_number: 44,
      track: 'tnpsc_group4',
      snapshot: { quick_notes: [
        { title: 'Percentage base', detail: 'சதவீதம் என்றால் 100-இல் ஒரு பகுதி. Fraction conversion வேகத்தை அதிகரிக்கும்.' },
        { title: 'Ratio meaning', detail: 'விகிதம் என்பது இரண்டு like quantities-இன் ஒப்பீடு.' },
        { title: 'Profit-loss base', detail: 'Profit% மற்றும் Loss% எப்போதும் CP அடிப்படையில் பார்க்க வேண்டும்.' },
        { title: 'Part-total logic', detail: 'Ratio questions-ல் total parts கண்டுபிடித்த பிறகே actual values எடுக்க வேண்டும்.' },
        { title: 'Discount caution', detail: 'Discount marked price அடிப்படையில் வரும்; profit CP அடிப்படையில் வரும்.' },
        { title: 'TNPSC speed', detail: 'இந்த mixed aptitude block fraction recall + base clarity இருந்தால் எளிதாகும்.' },
      ]},
      flashcards: [
        { front: '20%', back: '1/5' },
        { front: '25%', back: '1/4' },
        { front: 'Ratio 2:3 total parts', back: '5' },
        { front: 'Profit', back: 'SP - CP' },
        { front: 'Loss', back: 'CP - SP' },
        { front: 'Profit%', back: 'Profit / CP x 100' },
      ],
      videos: [
        { title: 'TNPSC Percentage Ratio Profit Loss Tamil', url: `${YT}tnpsc+percentage+ratio+profit+loss+tamil`, summary: 'Mixed aptitude practice on percentage, ratio, and profit-loss.' },
        { title: 'TNPSC Aptitude Mixed Arithmetic Tamil', url: `${YT}tnpsc+aptitude+mixed+arithmetic+tamil`, summary: 'Useful for Group 4 arithmetic switching practice.' },
      ],
      quiz: { questions: [
        { question: 'CP = 100, SP = 120. Profit%?', options: ['10%', '15%', '20%', '25%'], answer_index: 2, explanation: 'Profit = 20, so 20%.' },
        { question: '25% of 200 = ?', options: ['25', '40', '50', '75'], answer_index: 2, explanation: '25% = 1/4, so 50.' },
        { question: 'A:B = 2:3 and total = 50. A = ?', options: ['20', '25', '30', '35'], answer_index: 0, explanation: '5 parts total, one part = 10, A = 20.' },
        { question: 'Loss formula is:', options: ['SP - CP', 'CP - SP', 'Profit / CP', 'SP + CP'], answer_index: 1, explanation: 'Loss = CP - SP.' },
        { question: 'Profit% is based on:', options: ['SP', 'MP', 'CP', 'Discount'], answer_index: 2, explanation: 'Profit percentage is based on CP.' },
        { question: '20% is equal to:', options: ['1/3', '1/4', '1/5', '1/6'], answer_index: 2, explanation: '20/100 = 1/5.' },
      ]},
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 48,
    topic_title: 'Full Revision: History + Polity',
    content_json: {
      topic_title: 'Full Revision: History + Polity',
      day_number: 48,
      track: 'tnpsc_group4',
      snapshot: { quick_notes: [
        { title: 'History recap', detail: 'INC, freedom movement milestones, important acts, and national movement phases are high-frequency revision points.' },
        { title: 'Polity recap', detail: 'Constitution, fundamental rights, DPSP, President, Parliament, and state structure should remain distinct.' },
        { title: 'Date caution', detail: 'TNPSC often tests direct years and event matching. One wrong year can sink an easy question.' },
        { title: 'Article caution', detail: 'Polity revision should keep core article-linked facts clean, but not overload too many minor details.' },
        { title: 'Revision purpose', detail: 'This day should preserve core history + polity recall, not become a loose fact list.' },
        { title: 'TNPSC style', detail: 'Direct factual questions dominate here, so one-line recall matters.' },
      ]},
      flashcards: [
        { front: 'INC founded', back: '1885' },
        { front: 'Rowlatt Act', back: '1919' },
        { front: 'Quit India Movement', back: '1942' },
        { front: 'Fundamental Rights', back: 'Core constitutional rights' },
        { front: 'DPSP', back: 'Directive Principles of State Policy' },
        { front: 'Indian Constitution', back: 'Supreme law of the land' },
      ],
      videos: [
        { title: 'TNPSC History and Polity Revision Tamil', url: `${YT}tnpsc+history+polity+revision+tamil`, summary: 'Compact revision of freedom movement and constitutional basics.' },
        { title: 'TNPSC History Polity Important Questions Tamil', url: `${YT}tnpsc+history+polity+important+questions+tamil`, summary: 'Useful for direct factual recall before mixed mocks.' },
      ],
      quiz: { questions: [
        { question: 'INC தொடங்கிய ஆண்டு?', options: ['1885', '1905', '1919', '1942'], answer_index: 0, explanation: 'INC was founded in 1885.' },
        { question: 'Quit India Movement ஆண்டு?', options: ['1919', '1930', '1942', '1947'], answer_index: 2, explanation: 'Quit India was launched in 1942.' },
        { question: 'Rowlatt Act year?', options: ['1919', '1920', '1935', '1942'], answer_index: 0, explanation: 'Rowlatt Act was passed in 1919.' },
        { question: 'DPSP என்றால்?', options: ['Direct Police Service Post', 'Directive Principles of State Policy', 'District Public Service Panel', 'Data Protection State Plan'], answer_index: 1, explanation: 'DPSP = Directive Principles of State Policy.' },
        { question: 'அடிப்படை உரிமைகள் எந்தப் பகுதியுடன் தொடர்புடையது?', options: ['Polity', 'Chemistry', 'Geometry', 'Grammar'], answer_index: 0, explanation: 'Fundamental Rights belong to polity.' },
        { question: 'இந்திய அரசியலமைப்பு என்பது:', options: ['ஒரு திட்டம் மட்டும்', 'நாட்டின் உயர்ந்த சட்டம்', 'ஒரு வரலாறு புத்தகம்', 'ஒரு மாநில ஆணை'], answer_index: 1, explanation: 'The Constitution is the supreme law.' },
      ]},
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 51,
    topic_title: 'Mock Revision: GS Mixed + Weak Areas',
    content_json: {
      topic_title: 'Mock Revision: GS Mixed + Weak Areas',
      day_number: 51,
      track: 'tnpsc_group4',
      snapshot: { quick_notes: [
        { title: 'Mixed GS revision', detail: 'இந்த நாள் அறிவியல், புவியியல், வரலாறு, அரசியல், பொருளாதாரம் ஆகியவற்றின் weak recall points-ஐ திரும்ப பார்க்கும் நாள்.' },
        { title: 'Weak-area approach', detail: 'முழு syllabus-ஐ மீண்டும் தொடங்க வேண்டாம்; mock-ல் தவறிய basic facts-ஐ மட்டும் சரிசெய்ய வேண்டும்.' },
        { title: 'Science recall', detail: 'அலகுகள், pH, ஒளிச்சேர்க்கை, செல் போன்ற direct science facts அடிக்கடி வருகிறது.' },
        { title: 'Geography recall', detail: 'TN rivers, monsoon, latitude-longitude, India basics போன்றவற்றை உறுதிசெய்ய வேண்டும்.' },
        { title: 'Polity-economy recall', detail: 'அடிப்படை உரிமைகள், GDP, budget, inflation போன்ற core facts clear ஆக இருக்க வேண்டும்.' },
        { title: 'Mock value', detail: 'இந்த நாள் value என்ன தவறுகிறது என்பதை குறிவைத்து சரி செய்வதில் தான் இருக்கிறது.' },
      ]},
      flashcards: [
        { front: 'GDP', back: 'ஒரு நாட்டில் உற்பத்தியான பொருட்கள்/சேவைகளின் மதிப்பு' },
        { front: 'தமிழ்நாட்டின் முக்கிய நதி', back: 'காவிரி' },
        { front: 'அடிப்படை உரிமைகள்', back: 'அரசியலமைப்பின் முக்கிய பகுதி' },
        { front: 'pH 7', back: 'Neutral' },
        { front: 'ஒளிச்சேர்க்கை', back: 'தாவரங்கள் உணவு தயாரிக்கும் செயல்முறை' },
        { front: 'வடகிழக்கு பருவமழை', back: 'தமிழ்நாட்டிற்கு முக்கிய மழை பருவம்' },
      ],
      videos: [
        { title: 'TNPSC GS Mixed Revision Tamil', url: `${YT}tnpsc+gs+mixed+revision+tamil`, summary: 'Mixed GS revision across science, geography, polity, and economy.' },
        { title: 'TNPSC Weak Areas Revision Tamil', url: `${YT}tnpsc+weak+areas+revision+tamil`, summary: 'Useful before final mocks to fix repeated factual misses.' },
      ],
      quiz: { questions: [
        { question: 'GDP என்பது?', options: ['மழை அளவு', 'ஒரு நாட்டின் மொத்த உற்பத்தி மதிப்பு', 'மாணவர் பட்டியல்', 'வரி ரசீது'], answer_index: 1, explanation: 'GDP is total domestic output value.' },
        { question: 'தமிழ்நாட்டின் முக்கிய நதி எது?', options: ['கங்கை', 'காவிரி', 'நர்மதா', 'யமுனா'], answer_index: 1, explanation: 'காவிரி is the key TN river.' },
        { question: 'pH 7 என்றால்?', options: ['Acid', 'Base', 'Neutral', 'Salt'], answer_index: 2, explanation: 'pH 7 is neutral.' },
        { question: 'ஒளிச்சேர்க்கை என்றால்?', options: ['தாவரங்கள் உணவு தயாரித்தல்', 'வெப்பம் அளவிடுதல்', 'மழை உருவாகுதல்', 'உயிரணு பிரிதல்'], answer_index: 0, explanation: 'Photosynthesis is food preparation in plants.' },
        { question: 'அடிப்படை உரிமைகள் எந்தப் பகுதியுடன் தொடர்புடையது?', options: ['Polity', 'Chemistry', 'Grammar', 'Mensuration'], answer_index: 0, explanation: 'Fundamental rights belong to polity.' },
        { question: 'தமிழ்நாட்டிற்கு முக்கிய மழை பருவம் எது?', options: ['தென்மேற்கு', 'வடகிழக்கு', 'கோடை', 'வசந்த'], answer_index: 1, explanation: 'North-east monsoon is especially important for TN.' },
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
