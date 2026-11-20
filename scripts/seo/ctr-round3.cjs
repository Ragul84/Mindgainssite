// Round 3 CTR fixes (Search Console Aug–Nov 2026): page-1 pages with many impressions and few clicks.
// Titles lead with the exact query people type; descriptions promise what the page has (count, answers, tricks).
// Re-run after any rebuild: node scripts/seo/ctr-round3.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const T = {
  '/tnpsc/tamil/thirukkural/': ['Thirukkural Quiz in Tamil with Answers: Online Test', 'திருக்குறள் quiz in Tamil with answers: a free online test for TNPSC Group 4 & 2. 80 questions, plus all 1330 kurals with meaning.'],
  '/tnpsc/polity/preamble/': ['Preamble Quiz for TNPSC with Answers', 'Preamble of the Indian Constitution quiz for TNPSC and UPSC, with answers and explanations. Free.'],
  '/ssc/reasoning/syllogism/': ['Syllogism Questions for SSC CGL: {n} MCQs with Answers', 'Syllogism questions with answers for SSC CGL, CHSL & MTS. Statement and conclusion MCQs ("All roses are flowers…") with explanations. {n} free questions.'],
  '/ssc/reasoning/venn-diagram/': ['Venn Diagram Questions for SSC CGL with Answers ({n} MCQs)', 'Venn diagram reasoning questions for SSC CGL & CHSL, with answers and explanations. {n} free MCQs, instant result after every question.'],
  '/ssc/reasoning/coding-decoding/': ['Coding Decoding Quiz: {n} Questions with Answers for SSC', 'Coding decoding quiz for SSC CGL, CHSL & bank exams. Letter, number and word coding ("MANGO is coded as…") with answers explained. {n} free questions.'],
  '/ssc/reasoning/direction-sense/': ['Direction Sense Questions for SSC with Answers', 'Direction sense test questions for SSC CGL & CHSL with explanations. {n} free MCQs with answers.'],
  '/ssc/reasoning/blood-relations/': ['Blood Relation Questions for SSC with Answers', 'Blood relation reasoning questions for SSC CGL & CHSL with explanations. {n} free MCQs.'],
  '/ssc/quant/profit-loss/': ['Profit and Loss Questions for SSC with Answers', 'Profit and loss questions for SSC CGL & CHSL with answers and explanations. {n} free MCQs with solutions.'],
  '/ssc/english/grammar/': ['SSC CGL Grammar Questions: Error Spotting & Fill in the Blanks', 'SSC CGL & CHSL English grammar questions: error spotting, fill in the blanks and sentence improvement with answers and explanations. {n} free MCQs.'],
  '/ssc/english/vocabulary/': ['SSC Vocabulary Questions: Synonyms, Antonyms & Idioms MCQs', 'SSC CGL & CHSL vocabulary practice: synonyms, antonyms, one-word substitution and idioms with answers. {n} free MCQs.'],
  '/ssc/': ['SSC CGL, CHSL & MTS Free Practice: Topic-wise MCQs with Answers', 'Free topic-wise SSC practice: reasoning, quant, English and GK MCQs with answers and explanations for SSC CGL, CHSL, MTS and GD.'],
  '/tnpsc/maths/percentage/': ['Percentage Sums for TNPSC ({n} Questions with Answers)', 'Percentage sums for TNPSC Group 4, Group 2 and Group 1 with answers and explanations, in Tamil & English. {n} free practice questions.'],
  '/tnpsc/maths/hcf-lcm/': ['HCF and LCM Questions for TNPSC with Answers', 'HCF and LCM (மீ.பொ.வ, மீ.சி.ம) questions for TNPSC Group 4 & 2 with answers and explanations. {n} free MCQs.'],
  '/tnpsc/maths/time-work/': ['Time and Work Questions for TNPSC with Answers', 'Time and work sums for TNPSC Group 4 & 2 with answers and explanations. {n} free MCQs.'],
  '/tnpsc/maths/simple-interest/': ['Simple Interest Questions for TNPSC with Answers', 'Simple interest (தனிவட்டி) sums for TNPSC Group 4 & 2 with answers and explanations. {n} free MCQs.'],
  '/tnpsc/history/jainism-buddhism/': ['Jainism and Buddhism MCQs for TNPSC with Answers', 'Jainism and Buddhism questions for TNPSC Group 1, 2 & 4: Mahavira, Buddha, councils and teachings, with answers. {n} free MCQs.'],
  '/tnpsc/history/vijayanagara/': ['Vijayanagara Empire MCQs for TNPSC with Answers', 'Vijayanagara empire questions for TNPSC: rulers, battles, administration and Tamil Nadu links, with answers. {n} free MCQs.'],
  '/tnpsc/geography/india-soils/': ['Soils of India MCQs for TNPSC with Answers', 'Types of soils in India (alluvial, black, red, laterite) questions for TNPSC Group 4 & 2 with answers. {n} free MCQs.'],
  '/tnpsc/polity/dpsp/': ['DPSP Quiz for TNPSC: Directive Principles MCQs with Answers', 'Directive Principles of State Policy (Articles 36–51) quiz for TNPSC and UPSC, with answers and explanations. {n} free MCQs.'],
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
let n = 0;
for (const [route, [t, d]] of Object.entries(T)) {
  const f = path.join(ROOT, route, 'index.html'); if (!fs.existsSync(f)) { console.log('missing', route); continue; }
  let s = fs.readFileSync(f, 'utf8');
  const old = (s.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const cnt = (old.match(/([\d,]+)\s+(?:free\s+)?(?:practice\s+)?(?:MCQs|questions|practice)/i) || [])[1] || '';
  const fill = (x) => cnt ? x.replace(/\{n\}/g, cnt) : x.replace(/ ?\(?\{n\}\)?( Questions| MCQs| free (MCQs|questions|practice questions))?\.?/g, '').replace(/[:,] ?$/, '');
  const title = fill(t) + ' | MindGains', desc = fill(d);
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
       .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(desc)}`)
       .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
       .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(desc)}`)
       .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
       .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(desc)}`);
  fs.writeFileSync(f, s); n++;
  console.log(route.padEnd(36), title.length, '|', title);
}
console.log('updated', n);
