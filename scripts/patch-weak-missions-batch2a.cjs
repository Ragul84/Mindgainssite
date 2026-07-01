const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const YT = 'https://www.youtube.com/results?search_query=';

const patches = [
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 32,
    topic_title: 'Profit & Loss & Discount',
    content_json: {
      topic_title: 'Profit & Loss & Discount',
      day_number: 32,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Profit and loss base', detail: 'Profit and loss percentages are calculated on cost price unless the base changes.' },
        { title: 'Core formulas', detail: 'Profit = SP - CP, Loss = CP - SP, Profit% = Profit/CP x 100, Loss% = Loss/CP x 100.' },
        { title: 'Discount logic', detail: 'Discount is always calculated on marked price.' },
        { title: 'Successive discount', detail: 'Two discounts are not added directly. Use net factor multiplication.' },
        { title: 'Marked price bridge', detail: 'In MP-discount-gain questions, connect MP -> SP -> CP carefully.' },
        { title: 'SSC speed', detail: 'Use fraction forms when obvious: 20% = 1/5, 25% = 1/4, 12.5% = 1/8.' },
      ]},
      flashcards: [
        { front: 'Profit%', back: 'Profit / CP x 100' },
        { front: 'Loss%', back: 'Loss / CP x 100' },
        { front: 'Discount%', back: 'Discount / MP x 100' },
        { front: 'If CP 500 and gain 20%', back: 'SP = 600' },
        { front: 'Successive 10% and 20% discounts', back: 'Net factor = 0.72' },
        { front: 'MP - Discount', back: 'Selling price' },
      ],
      videos: [
        { title: 'SSC Profit Loss Discount Fast Questions', url: `${YT}ssc+profit+loss+discount+questions`, summary: 'Topic-pure practice on CP, SP, MP, discount, and successive discount problems.' },
        { title: 'SSC Marked Price and Discount Tricks', url: `${YT}ssc+marked+price+discount+tricks`, summary: 'Useful for direct exam-style discount and gain-loss combined questions.' },
      ],
      quiz: { questions: [
        { question: 'If CP = Rs 300 and SP = Rs 360, profit% is:', options: ['10%', '15%', '20%', '25%'], answer_index: 2, explanation: 'Profit = 60. Profit% = 20%.' },
        { question: 'An article is sold at Rs 480 after 20% discount. Marked price is:', options: ['Rs 560', 'Rs 575', 'Rs 600', 'Rs 620'], answer_index: 2, explanation: '480 is 80% of MP, so MP = 600.' },
        { question: 'A shopkeeper gains 25% by selling at Rs 500. Cost price is:', options: ['Rs 380', 'Rs 400', 'Rs 420', 'Rs 450'], answer_index: 1, explanation: 'CP = 500/1.25 = 400.' },
        { question: 'Successive discounts of 10% and 20% are equivalent to:', options: ['28%', '30%', '32%', '36%'], answer_index: 0, explanation: '0.9 x 0.8 = 0.72, so discount = 28%.' },
        { question: 'A trader suffers 10% loss by selling at Rs 270. CP is:', options: ['Rs 280', 'Rs 290', 'Rs 300', 'Rs 320'], answer_index: 2, explanation: '270 = 90% of CP. CP = 300.' },
        { question: 'Discount is always calculated on:', options: ['Cost price', 'Selling price', 'Marked price', 'Profit'], answer_index: 2, explanation: 'Discount is based on marked price.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 36,
    topic_title: 'Algebra Basics & Equations',
    content_json: {
      topic_title: 'Algebra Basics & Equations',
      day_number: 36,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Variable meaning', detail: 'A variable stands for an unknown value, solved using balanced operations.' },
        { title: 'Linear equation rule', detail: 'Whatever operation is performed on one side must be done on the other side too.' },
        { title: 'Transposition', detail: 'Moving a term across the equality sign changes the effective sign.' },
        { title: 'Like terms', detail: 'Combine terms with the same variable power before solving.' },
        { title: 'Bracket handling', detail: 'A negative sign outside a bracket changes the sign of each term inside.' },
        { title: 'SSC focus', detail: 'Direct linear equations and substitutions matter more than fancy notation here.' },
      ]},
      flashcards: [
        { front: '2x + 3 = 11', back: 'x = 4' },
        { front: '5x - 7 = 18', back: 'x = 5' },
        { front: '3(x + 2)', back: '3x + 6' },
        { front: '2x + 5x', back: '7x' },
        { front: 'If x = 3, x^2 + 2x', back: '15' },
        { front: 'Equation principle', back: 'Balance both sides' },
      ],
      videos: [
        { title: 'SSC Algebra Basics and Linear Equations', url: `${YT}ssc+algebra+linear+equations+basics`, summary: 'Simple equation solving, transposition, and algebra clean-up for SSC.' },
        { title: 'SSC Algebra Questions for Beginners', url: `${YT}ssc+algebra+questions+beginner`, summary: 'Good for weak students who need reliable equation solving habits.' },
      ],
      quiz: { questions: [
        { question: 'Solve: 2x + 3 = 11', options: ['3', '4', '5', '6'], answer_index: 1, explanation: '2x = 8, so x = 4.' },
        { question: 'Solve: 5x - 7 = 18', options: ['4', '5', '6', '7'], answer_index: 1, explanation: '5x = 25, so x = 5.' },
        { question: 'Simplify: 3(x + 4)', options: ['3x + 4', '3x + 7', '3x + 12', 'x + 12'], answer_index: 2, explanation: 'Multiply 3 into both terms.' },
        { question: 'If x = 2 and y = 3, then 2x + y =', options: ['5', '6', '7', '8'], answer_index: 2, explanation: '2(2) + 3 = 7.' },
        { question: 'Combine like terms: 4x + 3x - 2x =', options: ['3x', '5x', '7x', '9x'], answer_index: 1, explanation: '4 + 3 - 2 = 5.' },
        { question: 'If x/3 = 5, then x =', options: ['10', '12', '15', '18'], answer_index: 2, explanation: 'Multiply both sides by 3.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 49,
    topic_title: 'Vocabulary Revision',
    content_json: {
      topic_title: 'Vocabulary Revision',
      day_number: 49,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'SSC vocabulary reality', detail: 'Vocabulary questions are usually direct synonym, antonym, or usage checks.' },
        { title: 'Context first', detail: 'In sentence-based vocabulary, nearby tone and usage matter more than dictionary memorization.' },
        { title: 'Synonym logic', detail: 'Choose the closest sense, not just a roughly related word.' },
        { title: 'Antonym logic', detail: 'Opposite should match the same context and intensity.' },
        { title: 'Word level', detail: 'SSC usually favors medium-frequency words rather than literary obscurity.' },
        { title: 'Revision goal', detail: 'This day should sharpen usable recall, not become a random word dump.' },
      ]},
      flashcards: [
        { front: 'Rapid', back: 'Swift' },
        { front: 'Scarce', back: 'Insufficient / rare' },
        { front: 'Ancient', back: 'Old' },
        { front: 'Expand', back: 'Increase / extend' },
        { front: 'Hostile', back: 'Unfriendly' },
        { front: 'Transparent', back: 'Clear / open' },
      ],
      videos: [
        { title: 'SSC Vocabulary Revision Set', url: `${YT}ssc+vocabulary+revision+synonym+antonym`, summary: 'Medium-frequency SSC synonyms and antonyms with direct recall.' },
        { title: 'SSC English Vocabulary Practice', url: `${YT}ssc+english+vocabulary+practice`, summary: 'Useful for MCQ-oriented vocabulary sharpening.' },
      ],
      quiz: { questions: [
        { question: 'Choose the synonym of “rapid”.', options: ['Slow', 'Swift', 'Weak', 'Narrow'], answer_index: 1, explanation: 'Rapid means swift or fast.' },
        { question: 'Choose the antonym of “scarce”.', options: ['Rare', 'Abundant', 'Small', 'Fragile'], answer_index: 1, explanation: 'Scarce is opposite of abundant.' },
        { question: 'Choose the synonym of “ancient”.', options: ['Modern', 'Old', 'Tiny', 'Sharp'], answer_index: 1, explanation: 'Ancient means very old.' },
        { question: 'Choose the antonym of “hostile”.', options: ['Aggressive', 'Friendly', 'Careless', 'Dark'], answer_index: 1, explanation: 'Hostile is opposite of friendly.' },
        { question: 'Choose the synonym of “expand”.', options: ['Shrink', 'Increase', 'Refuse', 'Break'], answer_index: 1, explanation: 'Expand means increase or extend.' },
        { question: '“Transparent policy” most nearly means:', options: ['Glass-made policy', 'Secretive policy', 'Clear and open policy', 'Complicated policy'], answer_index: 2, explanation: 'Transparent here means open and clear.' },
      ]},
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 27,
    topic_title: 'மறுபரிசீலனை: வாரம் 2 கலவை',
    content_json: {
      topic_title: 'மறுபரிசீலனை: வாரம் 2 கலவை',
      day_number: 27,
      track: 'tnpsc_group4',
      snapshot: { quick_notes: [
        { title: 'Week 2 mix focus', detail: 'இந்த நாள் தமிழ், GS, aptitude அனைத்தையும் ஒழுங்காக மீள்பார்க்கும் நாள்.' },
        { title: 'Tamil recall', detail: 'இணைச்சொல், எதிர்சொல், இலக்கணம், காலம் போன்றவை வேகமாக நினைவில் வர வேண்டும்.' },
        { title: 'GS recall', detail: 'அரசியல், வரலாறு, அறிவியல், புவியியல் ஆகியவற்றின் direct facts உறுதியாக இருக்க வேண்டும்.' },
        { title: 'Aptitude recall', detail: 'சதவீதம், விகிதம், சராசரி போன்றவை formula அடிப்படையில் தீர்க்கப்பட வேண்டும்.' },
        { title: 'TNPSC style', detail: 'கேள்விகள் குறுகியதாக இருந்தாலும் options-ல் தான் சிக்கல் இருக்கும்.' },
        { title: 'Revision discipline', detail: 'ஒவ்வொரு பகுதியிலும் few core points போதுமானது; random overload வேண்டாம்.' },
      ]},
      flashcards: [
        { front: 'INC தொடங்கிய ஆண்டு', back: '1885' },
        { front: 'தமிழ்நாட்டின் முக்கிய மழை பருவம்', back: 'வடகிழக்கு பருவமழை' },
        { front: '25%', back: '1/4' },
        { front: 'இணைச்சொல்', back: 'ஒத்த அர்த்தம் கொண்ட சொல்' },
        { front: 'அடிப்படை உரிமைகள்', back: 'அரசியலமைப்பின் முக்கிய பகுதி' },
        { front: 'சராசரி', back: 'மொத்தம் / எண்ணிக்கை' },
      ],
      videos: [
        { title: 'TNPSC Mixed Revision Tamil', url: `${YT}tnpsc+mixed+revision+tamil`, summary: 'Tamil, GS, and aptitude core recall in one revision sitting.' },
        { title: 'TNPSC Mixed Questions Tamil', url: `${YT}tnpsc+group+4+mixed+questions+tamil`, summary: 'Useful for direct revision-day MCQ practice.' },
      ],
      quiz: { questions: [
        { question: 'தமிழ்நாட்டின் முக்கிய மழை பருவம் எது?', options: ['தென்மேற்கு பருவமழை', 'வடகிழக்கு பருவமழை', 'கோடை மழை', 'எதுவுமில்லை'], answer_index: 1, explanation: 'TN receives major rainfall from the northeast monsoon.' },
        { question: 'INC தொடங்கிய ஆண்டு எது?', options: ['1885', '1887', '1905', '1919'], answer_index: 0, explanation: 'INC was founded in 1885.' },
        { question: '25% = ?', options: ['1/2', '1/3', '1/4', '1/5'], answer_index: 2, explanation: '25% = 1/4.' },
        { question: 'இணைச்சொல் என்றால்?', options: ['எதிர் அர்த்தம்', 'ஒத்த அர்த்தம்', 'வினைச்சொல்', 'எண்'], answer_index: 1, explanation: 'Synonym means similar meaning.' },
        { question: 'சராசரி = ?', options: ['மொத்தம் / எண்ணிக்கை', 'எண்ணிக்கை / மொத்தம்', 'வேகம் x நேரம்', 'CP - SP'], answer_index: 0, explanation: 'Average = Total / Number.' },
        { question: 'அடிப்படை உரிமைகள் எந்தப் பகுதியில் வரும்?', options: ['Chemistry', 'Grammar', 'Polity', 'Geometry'], answer_index: 2, explanation: 'Fundamental rights belong to polity.' },
      ]},
    },
  },
  {
    track_id: 'tnpsc_group4',
    day_number: 50,
    topic_title: 'Full Revision: Aptitude (All Topics)',
    content_json: {
      topic_title: 'Full Revision: Aptitude (All Topics)',
      day_number: 50,
      track: 'tnpsc_group4',
      snapshot: { quick_notes: [
        { title: 'Percentage and ratio', detail: 'சதவீதம் மற்றும் விகிதம் aptitude-இன் அடிப்படை பகுதிகள்.' },
        { title: 'Average and profit-loss', detail: 'Average = Total / Number. Profit-loss always comes back to CP and SP.' },
        { title: 'Time-work and speed', detail: 'வேலை = திறன் x நேரம், வேகம் = தூரம் / நேரம். இந்த formulas-ஐ mix செய்யாதீர்கள்.' },
        { title: 'Interest and discount', detail: 'Simple interest, discount, marked price போன்றவை direct formula-based.' },
        { title: 'Revision standard', detail: 'ஒவ்வொரு topic-க்கும் முக்கிய formula + ஒரு மாதிரி கேள்வி நினைவில் இருந்தால் இந்த நாள் பயன் தரும்.' },
        { title: 'TNPSC practicality', detail: 'எளிய கணக்குகளை முதலில் முடிப்பது score-ஐ பாதுகாக்கும்.' },
      ]},
      flashcards: [
        { front: '25% of 200', back: '50' },
        { front: 'A:B = 2:3 and total 50, A =', back: '20' },
        { front: 'Average', back: 'Total / Number' },
        { front: 'Profit', back: 'SP - CP' },
        { front: 'Speed', back: 'Distance / Time' },
        { front: 'Work', back: 'Rate x Time' },
      ],
      videos: [
        { title: 'TNPSC Full Aptitude Revision Tamil', url: `${YT}tnpsc+full+aptitude+revision+tamil`, summary: 'All major aptitude areas revised in one TNPSC-focused sitting.' },
        { title: 'TNPSC Aptitude Mixed Questions Tamil', url: `${YT}tnpsc+aptitude+mixed+questions+tamil`, summary: 'Useful for full-revision days before mock tests.' },
      ],
      quiz: { questions: [
        { question: '25% of 200 = ?', options: ['25', '40', '50', '60'], answer_index: 2, explanation: '25% = 1/4, so 50.' },
        { question: 'A:B = 2:3 and total = 50. A = ?', options: ['20', '25', '30', '35'], answer_index: 0, explanation: 'Total parts = 5, one part = 10, A = 20.' },
        { question: 'Average of 10 and 20 is:', options: ['12', '15', '18', '20'], answer_index: 1, explanation: '(10 + 20)/2 = 15.' },
        { question: 'If CP = 100 and SP = 120, profit =', options: ['10', '15', '20', '25'], answer_index: 2, explanation: 'Profit = 20.' },
        { question: 'Speed formula is:', options: ['Distance / Time', 'Time / Distance', 'Rate x Time', 'CP - SP'], answer_index: 0, explanation: 'Speed = Distance / Time.' },
        { question: 'Work formula is:', options: ['Distance / Time', 'Rate x Time', 'SP - CP', 'Total / Number'], answer_index: 1, explanation: 'Work = Rate x Time.' },
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
