const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const kuralPath = path.join(root, 'data', 'thirukkural.json');
const detailPath = path.join(root, 'data', 'detail.json');
const outPath = path.join(root, 'data', 'thirukkural_seed.json');

const source = JSON.parse(fs.readFileSync(kuralPath, 'utf8'));
const detailRoot = JSON.parse(fs.readFileSync(detailPath, 'utf8'))[0];
const kurals = source.kural || [];

function chapterFor(number) {
  for (const section of detailRoot.section.detail || []) {
    for (const group of section.chapterGroup.detail || []) {
      for (const chapter of group.chapters.detail || []) {
        if (number >= chapter.start && number <= chapter.end) {
          return {
            chapter_tamil: chapter.name,
            chapter_english: chapter.translation,
            section_tamil: section.name,
            section_english: section.translation,
          };
        }
      }
    }
  }
  return {
    chapter_tamil: 'திருக்குறள்',
    chapter_english: 'Thirukkural',
    section_tamil: 'திருக்குறள்',
    section_english: 'Thirukkural',
  };
}

const rows = kurals.map((item) => {
  const meta = chapterFor(item.Number);
  const tamil = `${item.Line1}\n${item.Line2}`.trim();
  const transliteration = `${item.transliteration1 || ''}\n${item.transliteration2 || ''}`.trim() || item.couplet || '';
  const meaningTamil = item.mk || item.mv || item.sp || '';
  const explanationModern = item.explanation || item.Translation || '';
  const lifeApplication = explanationModern || meaningTamil || item.Translation || tamil;
  return {
    kural_number: item.Number,
    ...meta,
    kural_tamil: tamil,
    kural_transliteration: transliteration,
    meaning_tamil: meaningTamil,
    meaning_english: item.Translation || '',
    explanation_modern: explanationModern,
    life_application: lifeApplication,
    keywords: [meta.section_english, meta.chapter_english].filter(Boolean),
  };
});

if (rows.length !== 1330) {
  throw new Error(`Expected 1330 kurals, got ${rows.length}`);
}

fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');
console.log(`THIRUKKURAL_SEED_READY ${outPath} rows=${rows.length}`);
