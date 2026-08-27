const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const YT = 'https://www.youtube.com/results?search_query=';

const patches = [
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 11,
    topic_title: 'Series & Coding-Decoding Practice',
    content_json: {
      topic_title: 'Series & Coding-Decoding Practice',
      day_number: 11,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Number series', detail: 'Check difference, second difference, multiplication, division, square, cube, and alternating patterns.' },
        { title: 'Alphabet series', detail: 'Track letter positions carefully. Small jumps and reverse order both appear in SSC.' },
        { title: 'Coding-decoding base', detail: 'Most coding questions rely on letter shift, position reversal, grouping, or direct substitution.' },
        { title: 'Skip random guessing', detail: 'If one clear pattern fits 3 to 4 terms, use it consistently instead of testing many vague ideas.' },
        { title: 'Mixed pattern caution', detail: 'Some series alternate between two rules on odd and even positions.' },
        { title: 'SSC speed', detail: 'Write the first two checks mentally: difference pattern and positional pattern. That solves many questions quickly.' },
      ]},
      flashcards: [
        { front: '2, 4, 6, 8, ?', back: '10' },
        { front: '3, 6, 12, 24, ?', back: '48' },
        { front: 'A, C, E, G, ?', back: 'I' },
        { front: 'If A=1, B=2, Z=?', back: '26' },
        { front: 'Coding first check', back: 'Letter position or direct shift' },
        { front: 'Alternating series', back: 'Odd and even places may follow separate rules' },
      ],
      videos: [
        { title: 'SSC Series and Coding Decoding Practice', url: `${YT}ssc+series+coding+decoding+practice`, summary: 'Direct Tier-1 reasoning practice for number/alphabet series and coding patterns.' },
        { title: 'SSC Reasoning Series Tricks', url: `${YT}ssc+reasoning+series+tricks`, summary: 'Useful for quick pattern recognition and elimination.' },
      ],
      quiz: { questions: [
        { question: '2, 4, 6, 8, ? ', options: ['9', '10', '11', '12'], answer_index: 1, explanation: 'Common difference is +2.' },
        { question: '3, 6, 12, 24, ? ', options: ['36', '42', '48', '54'], answer_index: 2, explanation: 'Each term doubles.' },
        { question: 'A, C, E, G, ? ', options: ['H', 'I', 'J', 'K'], answer_index: 1, explanation: 'Letters increase by 2 positions.' },
        { question: 'If CAT is coded as DBU, then DOG is coded as:', options: ['EPH', 'EOG', 'FPH', 'DNG'], answer_index: 0, explanation: 'Each letter shifts by +1.' },
        { question: '5, 10, 20, 40, ? ', options: ['45', '60', '70', '80'], answer_index: 3, explanation: 'Each term doubles.' },
        { question: 'Which is the first thing to check in a simple number series?', options: ['Color of numbers', 'Difference or ratio pattern', 'Word meaning', 'Sentence order'], answer_index: 1, explanation: 'Difference or ratio often reveals the rule fastest.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 12,
    topic_title: 'Blood Relations & Direction Sense Revision',
    content_json: {
      topic_title: 'Blood Relations & Direction Sense Revision',
      day_number: 12,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Blood relation base', detail: 'Fix the reference person first, then map each relation step by step.' },
        { title: 'Gender clarity', detail: 'Many errors happen because the student assumes gender too early without support from the statement.' },
        { title: 'Family tree trick', detail: 'A rough mental tree helps in multi-person questions with father, mother, brother, sister, and spouse links.' },
        { title: 'Direction sense base', detail: 'Track final direction and final distance separately. They are not the same question.' },
        { title: 'Left-right caution', detail: 'Left and right depend on the person’s facing direction, not your own.' },
        { title: 'SSC habit', detail: 'Short questions still punish one wrong turn. Sequence discipline matters more than speed here.' },
      ]},
      flashcards: [
        { front: 'Brother of my mother', back: 'Maternal uncle' },
        { front: 'Father of my father', back: 'Grandfather' },
        { front: 'East then north path', back: 'Final direction is north-east zone' },
        { front: 'Facing north, left turn means', back: 'West' },
        { front: 'Direction questions ask', back: 'Distance, direction, or both' },
        { front: 'Blood relation questions need', back: 'Reference person fixed first' },
      ],
      videos: [
        { title: 'SSC Blood Relations and Direction Sense', url: `${YT}ssc+blood+relations+direction+sense`, summary: 'Stepwise family relation mapping and direction tracking for SSC.' },
        { title: 'SSC Direction Sense Short Tricks', url: `${YT}ssc+direction+sense+tricks`, summary: 'Useful for left-right, final direction, and shortest distance questions.' },
      ],
      quiz: { questions: [
        { question: 'A walks 5 km east and 3 km north. Final direction from start is:', options: ['North', 'East', 'North-East', 'South-East'], answer_index: 2, explanation: 'He is in the north-east direction from the start.' },
        { question: 'Brother of my mother is my:', options: ['Cousin', 'Uncle', 'Grandfather', 'Nephew'], answer_index: 1, explanation: 'He is the maternal uncle.' },
        { question: 'Facing north, if you turn left, you face:', options: ['East', 'West', 'South', 'North'], answer_index: 1, explanation: 'Left from north is west.' },
        { question: 'Father of my father is my:', options: ['Uncle', 'Brother', 'Grandfather', 'Cousin'], answer_index: 2, explanation: 'That is grandfather.' },
        { question: 'A person walks 4 km south, then 4 km east. Final direction from start is:', options: ['South-East', 'North-East', 'South-West', 'East'], answer_index: 0, explanation: 'The final position lies south-east of the start.' },
        { question: 'In blood relation questions, the safest first step is:', options: ['Guess quickly', 'Fix the reference person', 'Ignore gender', 'Choose longest option'], answer_index: 1, explanation: 'Everything depends on whose relation is being asked.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 13,
    topic_title: 'Syllogism & Non-Verbal Revision',
    content_json: {
      topic_title: 'Syllogism & Non-Verbal Revision',
      day_number: 13,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Syllogism rule', detail: 'Conclusion must follow strictly from the given statements, not from outside knowledge.' },
        { title: 'All / some distinction', detail: 'All, some, no, and some-not carry different certainty levels. Do not treat them as interchangeable.' },
        { title: 'Certain conclusion trap', detail: 'A possible conclusion is weaker than a definite conclusion. SSC often tests this difference.' },
        { title: 'Non-verbal reasoning', detail: 'Focus on rotation, mirror image, embedded pattern, and sequence change.' },
        { title: 'Visual consistency', detail: 'In figure questions, count line, angle, orientation, and repetition before guessing.' },
        { title: 'SSC speed', detail: 'In syllogism, use statement logic only. In non-verbal, compare one feature at a time.' },
      ]},
      flashcards: [
        { front: 'All A are B; all B are C', back: 'All A are C' },
        { front: 'Some A are B', back: 'At least one overlap exists' },
        { front: 'No A are B', back: 'No overlap' },
        { front: 'Mirror image check', back: 'Left-right reverses, top-bottom usually stays' },
        { front: 'Rotation question', back: 'Track orientation change, not shape identity alone' },
        { front: 'Syllogism source', back: 'Statements only, not real-world truth' },
      ],
      videos: [
        { title: 'SSC Syllogism Practice', url: `${YT}ssc+syllogism+practice`, summary: 'All, some, no, and conclusion-type reasoning for SSC.' },
        { title: 'SSC Non Verbal Reasoning Tricks', url: `${YT}ssc+non+verbal+reasoning+tricks`, summary: 'Mirror image, rotation, and pattern-based visual reasoning.' },
      ],
      quiz: { questions: [
        { question: 'All dogs are animals. All animals are living. Which conclusion follows?', options: ['All living are dogs', 'All dogs are living', 'Some dogs are not living', 'No dogs are animals'], answer_index: 1, explanation: 'If all dogs are animals and all animals are living, then all dogs are living.' },
        { question: 'If no A are B, then:', options: ['Some A are B', 'All A are B', 'A and B do not overlap', 'All B are A'], answer_index: 2, explanation: 'No overlap is allowed.' },
        { question: 'A mirror image usually reverses:', options: ['Top-bottom only', 'Left-right', 'Color only', 'Nothing'], answer_index: 1, explanation: 'Mirror image reverses left-right.' },
        { question: 'Some pens are pencils. Which definitely follows?', options: ['All pens are pencils', 'At least one pen is a pencil', 'No pen is a pencil', 'All pencils are pens'], answer_index: 1, explanation: 'Some means at least one overlap exists.' },
        { question: 'In rotation-based figure questions, the best first check is:', options: ['Word meaning', 'Orientation change', 'Only color', 'Only size'], answer_index: 1, explanation: 'Rotation changes orientation.' },
        { question: 'Syllogism answers must come from:', options: ['Outside knowledge', 'Statement logic only', 'Guessing', 'Common sense only'], answer_index: 1, explanation: 'Use statement logic only.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 14,
    topic_title: 'Previous Week Reasoning Topics + Mixed Quiz',
    content_json: {
      topic_title: 'Previous Week Reasoning Topics + Mixed Quiz',
      day_number: 14,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Reasoning revision day', detail: 'This day should revise the exact reasoning blocks already studied, not drift into quant or GA filler.' },
        { title: 'Week recap', detail: 'Analogies, classification, series, coding, blood relations, direction sense, syllogism, and non-verbal are the main anchors.' },
        { title: 'Pattern recall', detail: 'Each topic has one core habit: relation type, odd-rule, sequence rule, family mapping, direction tracking, conclusion logic.' },
        { title: 'Mixed-quiz goal', detail: 'A mixed reasoning day should test switching between reasoning types without losing accuracy.' },
        { title: 'SSC risk', detail: 'Students often carry one method into the wrong question type. Identify the topic first.' },
        { title: 'Revision discipline', detail: 'Keep this day reasoning-pure. Mixed does not mean random.' },
      ]},
      flashcards: [
        { front: 'Analogy first step', back: 'Identify relation type' },
        { front: 'Series first check', back: 'Difference or ratio pattern' },
        { front: 'Blood relation first step', back: 'Fix reference person' },
        { front: 'Direction sense', back: 'Track direction and distance separately' },
        { front: 'Syllogism', back: 'Use statement logic only' },
        { front: 'Non-verbal reasoning', back: 'Compare one visual feature at a time' },
      ],
      videos: [
        { title: 'SSC Reasoning Mixed Revision', url: `${YT}ssc+reasoning+mixed+revision`, summary: 'Revision of the week’s reasoning topics without off-topic filler.' },
        { title: 'SSC Reasoning Mixed Quiz Practice', url: `${YT}ssc+reasoning+mixed+quiz+practice`, summary: 'Useful for topic switching under exam pressure.' },
      ],
      quiz: { questions: [
        { question: 'Book : Read :: Pen : ?', options: ['Write', 'Page', 'Ink', 'Study'], answer_index: 0, explanation: 'Pen is used to write.' },
        { question: '2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], answer_index: 1, explanation: 'Common difference is +2.' },
        { question: 'Facing north, turning left means facing:', options: ['East', 'West', 'South', 'North'], answer_index: 1, explanation: 'Left from north is west.' },
        { question: 'All cats are animals. All animals are living. Therefore:', options: ['All cats are living', 'All living are cats', 'No cat is living', 'Some cats are not animals'], answer_index: 0, explanation: 'All cats are living follows.' },
        { question: 'Odd one out: Apple, Mango, Banana, Carrot', options: ['Apple', 'Mango', 'Banana', 'Carrot'], answer_index: 3, explanation: 'Carrot is not a fruit.' },
        { question: 'Reasoning mixed revision should mainly improve:', options: ['Random guessing', 'Topic recognition and switching', 'Essay writing', 'Only memorization'], answer_index: 1, explanation: 'Mixed reasoning days test switching between reasoning types.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 28,
    topic_title: 'Number Systems & Simplification',
    content_json: {
      topic_title: 'Number Systems & Simplification',
      day_number: 28,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Number type recall', detail: 'Natural, whole, integer, rational, irrational, prime, composite, even, and odd should be mentally clean.' },
        { title: 'Divisibility habit', detail: 'Quick divisibility checks save time in simplification questions.' },
        { title: 'BODMAS discipline', detail: 'Follow operation order strictly in simplification.' },
        { title: 'Square-root and fraction checks', detail: 'Many simplification questions are reduced quickly by cancelling factors before multiplying.' },
        { title: 'Irrational caution', detail: 'Square roots of non-perfect squares are often used to test irrational numbers.' },
        { title: 'SSC speed', detail: 'Simplification rewards clean arithmetic more than memorized formulas.' },
      ]},
      flashcards: [
        { front: 'Rational number', back: 'Can be written as p/q where q is not zero' },
        { front: 'Irrational example', back: 'Square root of 2' },
        { front: 'Even number', back: 'Divisible by 2' },
        { front: 'Prime number', back: 'Exactly two factors' },
        { front: 'BODMAS', back: 'Order of operations in simplification' },
        { front: 'Perfect square root', back: 'Whole number if square is perfect' },
      ],
      videos: [
        { title: 'SSC Number System and Simplification', url: `${YT}ssc+number+system+simplification`, summary: 'Direct Tier-1 number types, divisibility, and simplification practice.' },
        { title: 'SSC Simplification Short Tricks', url: `${YT}ssc+simplification+tricks`, summary: 'Useful for operation order and quick arithmetic reduction.' },
      ],
      quiz: { questions: [
        { question: 'Which of the following is irrational?', options: ['1/2', '0.25', '√2', '5'], answer_index: 2, explanation: '√2 is irrational.' },
        { question: 'Which number is prime?', options: ['9', '15', '17', '21'], answer_index: 2, explanation: '17 has exactly two factors.' },
        { question: 'Which is divisible by 2?', options: ['15', '17', '19', '20'], answer_index: 3, explanation: '20 is even.' },
        { question: 'BODMAS is used for:', options: ['Essay order', 'Operation order', 'Direction sense', 'Vocabulary meaning'], answer_index: 1, explanation: 'It governs order of operations.' },
        { question: 'A rational number can be expressed as:', options: ['Only square root', 'p/q', 'Only integer', 'Only decimal ending never'], answer_index: 1, explanation: 'Rational numbers can be written as p/q.' },
        { question: 'Square root of 49 is:', options: ['5', '6', '7', '8'], answer_index: 2, explanation: '7 x 7 = 49.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 29,
    topic_title: 'Percentages & Ratio & Proportion',
    content_json: {
      topic_title: 'Percentages & Ratio & Proportion',
      day_number: 29,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Percentage meaning', detail: 'Percentage means per hundred and often converts faster into fractions.' },
        { title: 'Ratio meaning', detail: 'Ratio compares two like quantities.' },
        { title: 'Proportion meaning', detail: 'If two ratios are equal, they are in proportion.' },
        { title: 'Fraction shortcuts', detail: '10% = 1/10, 20% = 1/5, 25% = 1/4, 50% = 1/2.' },
        { title: 'Part-total questions', detail: 'In ratio problems, first find total parts, then calculate one part.' },
        { title: 'SSC habit', detail: 'These questions are simple when the base value and comparison base are not confused.' },
      ]},
      flashcards: [
        { front: '20%', back: '1/5' },
        { front: '25%', back: '1/4' },
        { front: '50%', back: '1/2' },
        { front: 'Ratio 2:3 total parts', back: '5' },
        { front: 'If A:B = 2:3 and total 50, A =', back: '20' },
        { front: 'Proportion', back: 'Equality of two ratios' },
      ],
      videos: [
        { title: 'SSC Percentages Ratio Proportion', url: `${YT}ssc+percentages+ratio+proportion`, summary: 'Topic-specific practice with fraction conversion and part-total logic.' },
        { title: 'SSC Percentage Shortcuts', url: `${YT}ssc+percentage+shortcuts`, summary: 'Useful for quick fraction-based solving.' },
      ],
      quiz: { questions: [
        { question: '20% of 250 =', options: ['40', '50', '60', '75'], answer_index: 1, explanation: '20% = 1/5, so 250/5 = 50.' },
        { question: 'If A:B = 2:3 and total = 50, A =', options: ['20', '25', '30', '35'], answer_index: 0, explanation: 'Total parts = 5, one part = 10, A = 20.' },
        { question: '25% is equal to:', options: ['1/2', '1/3', '1/4', '1/5'], answer_index: 2, explanation: '25/100 = 1/4.' },
        { question: 'Ratio compares:', options: ['Two unlike things only', 'Two like quantities', 'Only percentages', 'Only money values'], answer_index: 1, explanation: 'Ratio compares like quantities.' },
        { question: 'If 2:3 = 4:x, x =', options: ['5', '6', '7', '8'], answer_index: 1, explanation: '2/3 = 4/x, so x = 6.' },
        { question: '50% of 80 =', options: ['20', '30', '40', '50'], answer_index: 2, explanation: '50% = 1/2, so answer is 40.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 33,
    topic_title: 'Time & Work & Pipes & Cisterns',
    content_json: {
      topic_title: 'Time & Work & Pipes & Cisterns',
      day_number: 33,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Work base', detail: 'If a person finishes a job in n days, one-day work is 1/n.' },
        { title: 'Combined work', detail: 'Add work rates when workers or pipes act together.' },
        { title: 'Pipes logic', detail: 'Inlet fills, outlet empties. Use net work after assigning signs mentally.' },
        { title: 'LCM method', detail: 'Taking total work as LCM of days often makes arithmetic easier.' },
        { title: 'Time relation', detail: 'Time is inverse of rate. Faster worker means higher rate and lower time.' },
        { title: 'SSC speed', detail: 'Do not multiply time blindly. Convert everything to rate first.' },
      ]},
      flashcards: [
        { front: 'A finishes in 10 days, one-day work', back: '1/10' },
        { front: 'B finishes in 5 days, one-day work', back: '1/5' },
        { front: 'Combined work', back: 'Add rates' },
        { front: 'Outlet pipe', back: 'Subtract its rate from filling rate' },
        { front: 'Time-rate relation', back: 'Inverse' },
        { front: 'LCM method use', back: 'Choose convenient total work' },
      ],
      videos: [
        { title: 'SSC Time and Work Pipes Cisterns', url: `${YT}ssc+time+work+pipes+cisterns`, summary: 'One-day work, combined work, and inlet-outlet questions for SSC.' },
        { title: 'SSC Work Rate Tricks', url: `${YT}ssc+work+rate+tricks`, summary: 'Useful for converting days into rates quickly.' },
      ],
      quiz: { questions: [
        { question: 'A finishes a work in 10 days. One-day work is:', options: ['1/5', '1/10', '10', '5'], answer_index: 1, explanation: 'One-day work = 1/10.' },
        { question: 'A can do a work in 10 days and B in 5 days. Together they do it in:', options: ['2 days', '3 1/3 days', '4 days', '5 days'], answer_index: 1, explanation: 'Rates = 1/10 + 1/5 = 3/10, so time = 10/3 days.' },
        { question: 'If a pipe fills a tank in 6 hours, its one-hour work is:', options: ['1/3', '1/6', '6', '2'], answer_index: 1, explanation: 'One-hour work = 1/6.' },
        { question: 'An outlet pipe should be treated as:', options: ['Positive filling rate', 'Negative rate in net work', 'Same as inlet', 'A percentage'], answer_index: 1, explanation: 'Outlet reduces filled work.' },
        { question: 'Work rate and time are:', options: ['Directly proportional', 'Inversely related', 'Unrelated', 'Always equal'], answer_index: 1, explanation: 'Higher rate means lower time.' },
        { question: 'The safest first step in work questions is:', options: ['Guess answer', 'Convert time into rate', 'Memorize option C', 'Use only percentages'], answer_index: 1, explanation: 'Convert everything into work rate first.' },
      ]},
    },
  },
  {
    track_id: 'ssc_cgl_tier1',
    day_number: 34,
    topic_title: 'Previous Week Quant Topics + Mixed Quiz',
    content_json: {
      topic_title: 'Previous Week Quant Topics + Mixed Quiz',
      day_number: 34,
      track: 'ssc_cgl_tier1',
      snapshot: { quick_notes: [
        { title: 'Quant revision day', detail: 'This day should revise the quant topics already covered, not become random mixed GK.' },
        { title: 'Week recap', detail: 'Number system, percentages, ratio-proportion, profit-loss-discount, time-work, and related arithmetic are the main anchors.' },
        { title: 'Topic recognition', detail: 'Before solving, identify whether the question is ratio-based, percent-based, CP-SP based, or work-rate based.' },
        { title: 'Fraction shortcuts', detail: 'Percentage questions often speed up when converted into fractions.' },
        { title: 'Rate discipline', detail: 'Time-work and pipes must be solved through rate, not plain intuition.' },
        { title: 'Revision discipline', detail: 'Mixed quant should still stay quant-pure.' },
      ]},
      flashcards: [
        { front: '20%', back: '1/5' },
        { front: '25%', back: '1/4' },
        { front: 'Profit%', back: 'Profit / CP x 100' },
        { front: 'One-day work', back: '1/n if work completes in n days' },
        { front: 'Ratio 2:3 total parts', back: '5' },
        { front: 'Simplification first rule', back: 'Use BODMAS' },
      ],
      videos: [
        { title: 'SSC Quant Mixed Revision', url: `${YT}ssc+quant+mixed+revision`, summary: 'Revision of the week’s arithmetic topics without topic drift.' },
        { title: 'SSC Arithmetic Mixed Quiz', url: `${YT}ssc+arithmetic+mixed+quiz`, summary: 'Useful for topic switching under exam conditions.' },
      ],
      quiz: { questions: [
        { question: '20% of 250 =', options: ['40', '50', '60', '75'], answer_index: 1, explanation: '20% = 1/5, so answer is 50.' },
        { question: 'If A:B = 2:3 and total = 50, A =', options: ['20', '25', '30', '35'], answer_index: 0, explanation: 'Total parts = 5, one part = 10.' },
        { question: 'If CP = 100 and SP = 120, profit =', options: ['10', '15', '20', '25'], answer_index: 2, explanation: 'Profit = 20.' },
        { question: 'A finishes a work in 10 days. One-day work is:', options: ['1/5', '1/10', '10', '5'], answer_index: 1, explanation: 'One-day work = 1/10.' },
        { question: 'Which is irrational?', options: ['1/2', '0.25', '√2', '5'], answer_index: 2, explanation: '√2 is irrational.' },
        { question: 'Mixed quant revision should mainly improve:', options: ['Random guessing', 'Topic recognition and switching', 'Essay writing', 'Only memory of formulas'], answer_index: 1, explanation: 'Mixed quant days test switching across arithmetic types.' },
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
