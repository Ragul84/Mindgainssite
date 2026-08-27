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
    .replace(/\s+:/g, ':')
    .replace(/\bdiv by\b/gi, 'divisible by')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(?<!\.)[.。]$/u, '');
}

function parsePayload(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

function compact(value, max = 130) {
  const text = clean(value);
  if (text.length <= max) return text;
  const clipped = text.slice(0, max);
  const sentenceCut = Math.max(clipped.lastIndexOf('. '), clipped.lastIndexOf('; '));
  if (sentenceCut > 55) return clean(clipped.slice(0, sentenceCut + 1));
  const cut = Math.max(clipped.lastIndexOf(','), clipped.lastIndexOf(' '));
  return `${clipped.slice(0, cut > 50 ? cut : max).trim().replace(/[.,;:]+$/u, '')}...`;
}

function sentenceBack(label, answer, pageTitle) {
  const l = clean(label);
  const a = clean(answer);
  const page = clean(pageTitle);

  if (/Divisibility/i.test(page)) {
    if (l === '2') return 'The last digit should be even';
    if (l === '3') return 'The sum of digits should be divisible by 3';
    if (l === '4') return 'The last two digits should be divisible by 4';
    if (l === '5') return 'The last digit should be 0 or 5';
    if (l === '8') return 'The last three digits should be divisible by 8';
    if (l === '9') return 'The sum of digits should be divisible by 9';
    if (l === '11') return 'The odd-place digit sum minus even-place digit sum should be 0 or a multiple of 11';
    if (l === '13') return 'Add four times the last digit to the remaining number and check divisibility by 13';
  }

  if (/Unit Digit/i.test(page)) {
    const rem = l.match(/remainder is\s*(\d+)/i)?.[1];
    if (rem === '1') return 'Use the unit digit of X¹';
    if (rem === '2') return 'Use the unit digit of X²';
    if (rem === '3') return 'Use the unit digit of X³';
    if (rem === '0') return 'Use the unit digit of X⁴';
    if (/Cycle/i.test(l)) return 'The unit digit pattern usually repeats every 4 powers';
    if (/Note/i.test(l)) return 'The digits 0, 1, 5 and 6 keep the same unit digit in every power';
  }

  if (/Original Constitution/i.test(l)) return 'It had 22 Parts, 395 Articles and 8 Schedules';
  if (/Current structure/i.test(l)) return 'It has 25 Parts, 448+ Articles and 12 Schedules';
  if (/Formed/i.test(l)) return `It was formed under ${a}`;
  if (/First meeting/i.test(l)) return `It first met on ${a}`;
  if (/Adopted/i.test(l)) return `It was adopted on ${a}`;
  if (/Enforced/i.test(l)) return `It came into force on ${a}`;
  if (/Members who signed/i.test(l)) return `${a} members signed it`;
  if (/Time taken/i.test(l)) return `It took ${a}`;
  if (/President/i.test(l)) return `${a} was the President`;
  if (/Advisor/i.test(l)) return `${a} was the Constitutional Advisor`;
  if (/Monetary Policy Committee|MPC/i.test(`${page} ${l}`)) return `The MPC has ${a}`;
  if (/Committee/i.test(l)) return `${a} chaired it`;

  if (/Total/i.test(l) && /Tamil Letters/i.test(page)) return `There are ${a} in total`;
  if (/Uyir Eluthu/i.test(l)) return `There are ${a} Uyir letters`;
  if (/Mey Eluthu/i.test(l)) return `There are ${a} Mey letters`;
  if (/Uyirmey/i.test(l)) return `There are ${a} Uyirmey letters`;
  if (/Ayutha/i.test(l)) return `There is ${a} Ayutha letter`;
  if (/Kuril/i.test(l)) return `Kuril has ${a}`;
  if (/Nedil/i.test(l)) return `Nedil has ${a}`;
  if (/Vallinam/i.test(l)) return `Vallinam has ${a}`;
  if (/Mellinam/i.test(l)) return `Mellinam has ${a}`;
  if (/Idaiyinam/i.test(l)) return `Idaiyinam has ${a}`;
  if (/Mudal Eluthu/i.test(l)) return `Mudal Eluthu has ${a}`;
  if (/Sarbu Eluthu/i.test(l)) return `Sarbu Eluthu has ${a}`;
  if (/Maathirai|Pronunciation time/i.test(l)) return `The value is ${a}`;

  if (/Number Classification/i.test(page)) {
    if (/Natural/i.test(l)) return `Natural numbers start from ${a.replace(/^.*?(\d).*$/u, '$1') || '1'}`;
    if (/Whole/i.test(l)) return `Whole numbers start from ${a.replace(/^.*?(\d).*$/u, '$1') || '0'}`;
    if (/Integers/i.test(l)) return 'Integers include negative numbers, zero and positive numbers';
    if (/Rational/i.test(l)) return 'Rational numbers can be written in p/q form';
    if (/Irrational/i.test(l)) return 'Irrational numbers cannot be written as terminating or recurring fractions';
    if (/Prime/i.test(l)) return `There are ${a} prime numbers from 1 to 100`;
  }

  if (/Schedule/i.test(page) && /^\d/.test(l)) return `It covers ${a}`;
  if (/Sources of Constitution/i.test(page)) return `It was borrowed from ${a}`;
  if (/season|crop|paddy|cotton|oilseed|tea|coffee|rubber|spices|district|producer/i.test(`${page} ${l}`)) return `It is linked with ${a}`;
  if (/^rate at/i.test(a)) return `${l} is the ${a.charAt(0).toLowerCase()}${a.slice(1)}`;
  if (/^produces\s+/i.test(a)) return `${l} produces ${a.replace(/^produces\s+/i, '')}`;
  if (/^connects\s+/i.test(a)) return `${l} connects ${a.replace(/^connects\s+/i, '')}`;
  if (/^master gland/i.test(a)) return `${l} is the master gland${a.replace(/^master gland/i, '')}`;
  if (/emergency gland/i.test(a)) return `${l} is known as the emergency gland`;
  if (/^thigh bone/i.test(a)) return `${l} is the thigh bone${a.replace(/^thigh bone/i, '')}`;
  if (/^ear bone/i.test(a)) return `${l} is the ear bone${a.replace(/^ear bone/i, '')}`;
  if (/^leg$/i.test(a)) return `${l} are leg bones`;
  if (/^arm$/i.test(a)) return `${l} are arm bones`;
  if (/^% of deposits/i.test(a)) return `${l} is the percentage of deposits banks must keep with RBI`;
  if (/^% banks/i.test(a)) return `${l} is the percentage banks must keep in liquid assets`;
  if (/^adult human has/i.test(a)) return `Adult humans have ${a.replace(/^adult human has\s*/i, '')}`;
  if (/^established\s+\d{4}/i.test(a)) return `${l} was established in ${a.replace(/^established\s+/i, '')}`;
  if (/recap/i.test(`${page} ${l}`)) return `${l} covers ${a}`;
  if (/bone/i.test(a) || /gland|hormone|thyroxine|insulin|glucagon/i.test(`${page} ${l} ${a}`)) return `${l} is ${a}`;
  if (!/\b(is|are|was|were|has|have|had|means|covers|includes|produces|controls|causes|starts|can|cannot|should|must|keeps|comes|began|formed|established|used|overdue|decide|target)\b/i.test(a)) {
    return `The key point about ${l} is ${a}`;
  }

  return a;
}

function examName(trackId) {
  if (trackId === 'upsc_ecosystem') return 'UPSC';
  if (trackId === 'tnpsc_ecosystem') return 'TNPSC';
  if (trackId === 'ssc_ecosystem') return 'SSC';
  return 'Exam';
}

function naturalLabel(label) {
  return clean(label)
    .replace(/\+/g, ' + ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inlinePairs(text) {
  const value = clean(text);
  const pairs = [];
  const regex = /(^|[.;]\s*)([^.;:]{1,60}):\s*([^.;]+)/g;
  let match;
  while ((match = regex.exec(value))) {
    const label = clean(match[2]);
    const answer = clean(match[3]);
    if (label && answer && !/note|drill|skill/i.test(label)) pairs.push({ label, answer });
  }
  return pairs;
}

function card(front, back, source) {
  return {
    front: clean(front),
    back: clean(back),
    source,
  };
}

function makeFront(trackId, pageTitle, label, type) {
  const l = naturalLabel(label);
  const page = clean(pageTitle);
  const context = `${page} ${l}`;

  if (/Original Constitution/i.test(l)) return 'The original structure of the Constitution';
  if (/Current structure/i.test(l)) return 'The current structure of the Constitution';
  if (/Formed/i.test(l) && /Constituent Assembly/i.test(page)) return 'The plan under which the Constituent Assembly was formed';
  if (/First meeting/i.test(l) && /Constituent Assembly/i.test(page)) return 'The first meeting date of the Constituent Assembly';
  if (/Adopted/i.test(l)) return 'The date of Constitution adoption';
  if (/Enforced/i.test(l)) return 'The date of Constitution enforcement';
  if (/Members who signed/i.test(l)) return 'The number of members who signed the Constitution';
  if (/Time taken/i.test(l)) return 'The time taken to frame the Constitution';
  if (/Constituent Assembly President/i.test(l)) return 'The President of the Constituent Assembly';
  if (/Constitutional Advisor/i.test(l)) return 'The Constitutional Advisor';
  if (/Monetary Policy Committee|MPC/i.test(`${page} ${l}`)) return 'The structure of the Monetary Policy Committee';
  if (/Committee/i.test(l)) return `The chairman of the ${l}`;
  if (/Sources of Constitution/i.test(page)) return `The source of ${l}`;
  if (/Schedule/i.test(page) && /^\d/.test(l)) return `The subject of the ${l} Schedule`;
  if (/Divisibility/i.test(page) && /^\d+$/.test(l)) return `The divisibility rule of ${l}`;
  if (/Unit Digit/i.test(page) && /remainder is/i.test(l)) return `The unit digit rule when the ${l.toLowerCase()}`;
  if (/Unit Digit/i.test(page) && /Cycle/i.test(l)) return 'The power cycle used for unit digit questions';
  if (/Unit Digit/i.test(page) && /Note/i.test(l)) return 'The unit digits that stay fixed in powers';
  if (/Number Classification/i.test(page)) return `The meaning of ${l}`;
  if (/Prime/i.test(context)) return `The key fact about ${l}`;
  if (/BODMAS/i.test(page)) return 'The order used in BODMAS simplification';
  if (/Tamil Letters/i.test(page) && /Total/i.test(l)) return 'The total number of Tamil letters';
  if (/Uyir Eluthu/i.test(page) && /Note/i.test(l)) return 'The long-vowel status of ஐ and ஔ';
  if (/Mey Eluthu/i.test(page) && /Pronunciation time/i.test(l)) return 'The Maathirai value of Mey Eluthu';
  if (/season|sornavari|samba|navarai/i.test(context)) return `The season period of ${l}`;
  if (/crop|paddy|cotton|oilseed|tea|coffee|rubber|spices|district|producer/i.test(context)) return `The crop/location link for ${l}`;
  if (/Uyir|Mey|Uyirmey|Ayutha|Kuril|Nedil|Mudal|Sarbu|Maathirai/i.test(context)) return `The recall fact for ${l}`;
  if (type === 'trap') return '';
  if (type === 'rule' && /recap/i.test(page)) return `The important facts in ${page}`;
  if (type === 'rule') return `The key point about ${page}`;
  if (type === 'pair') return `The key fact about ${l}`;
  return `The key recall point for ${page}`;
}

function cardsFromBlock(trackId, page, block) {
  const out = [];
  const pageTitle = clean(page.title);

  if (block.type === 'table' && Array.isArray(block.rows)) {
    for (const row of block.rows) {
      const cells = row.map(clean).filter(Boolean);
      if (cells.length < 2) continue;
      const label = cells[0];
      const answer = sentenceBack(label, cells.slice(1).join(' | '), pageTitle);
      out.push(card(
        makeFront(trackId, pageTitle, label, 'pair'),
        answer,
        'lesson_page_table'
      ));
    }
  }

  if ((block.type === 'timeline' || block.type === 'fact_grid' || block.type === 'checklist') && Array.isArray(block.items)) {
    for (const item of block.items) {
      let label = clean(item.label);
      const answer = clean(item.value || item.detail);
      if (!label || !answer) continue;
      if (/^if\s*rem$/i.test(label)) {
        const rem = answer.match(/^\d+/)?.[0];
        label = rem ? `remainder is ${rem}` : label;
      }
      out.push(card(
        makeFront(trackId, pageTitle, label, 'pair'),
        sentenceBack(label, answer, pageTitle),
        `lesson_page_${block.type}`
      ));
    }
  }

  if (block.type === 'formula' && block.text) {
    const pairs = inlinePairs(block.text);
    if (pairs.length >= 2) {
      for (const pair of pairs.slice(0, 10)) {
        out.push(card(
          makeFront(trackId, pageTitle, pair.label, 'pair'),
          compact(sentenceBack(pair.label, pair.answer, pageTitle), 140),
          'lesson_page_formula_pair'
        ));
      }
    } else {
      out.push(card(
        makeFront(trackId, pageTitle, pageTitle, 'rule'),
        compact(sentenceBack(pageTitle, block.text, pageTitle), 150),
        'lesson_page_formula'
      ));
    }
  }

  if (block.type === 'text' && block.text) {
    const text = clean(block.text);
    const pairs = inlinePairs(text);
    if (pairs.length >= 2) {
      for (const pair of pairs.slice(0, 8)) {
        out.push(card(
          makeFront(trackId, pageTitle, pair.label, 'pair'),
          compact(sentenceBack(pair.label, pair.answer, pageTitle), 140),
          'lesson_page_text_pair'
        ));
      }
    } else {
      out.push(card(
        makeFront(trackId, pageTitle, pageTitle, 'rule'),
        compact(sentenceBack(pageTitle, text, pageTitle), 160),
        'lesson_page_text'
      ));
    }
  }

  return out;
}

function buildFlashcards(row, payload) {
  const pages = Array.isArray(payload.lesson_pages) ? payload.lesson_pages.slice(1) : [];
  const cards = [];
  for (const page of pages) {
    for (const block of page.blocks || []) {
      cards.push(...cardsFromBlock(row.track_id, page, block));
    }
  }

  const seen = new Set();
  return cards
    .filter((c) => c.front && c.back && c.front.length <= 110 && c.back.length <= 180)
    .filter((c) => {
      const key = `${c.front.toLowerCase()}|${c.back.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, row.track_id === 'ssc_ecosystem' ? 18 : 14);
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
  const backupPath = path.resolve(__dirname, `../scratch/daily-mission-before-flashcards-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  let changed = 0;
  let empty = 0;
  for (const row of data) {
    const payload = parsePayload(row.content_json);
    const flashcards = buildFlashcards(row, payload);
    if (!flashcards.length) {
      empty += 1;
      continue;
    }
    const nextPayload = { ...payload, flashcards };
    changed += 1;
    if (!DRY_RUN) {
      const { error: updateError } = await supabase
        .from('master_content_vault')
        .update({ content_json: nextPayload, updated_at: new Date().toISOString() })
        .eq('track_id', row.track_id)
        .eq('day_number', row.day_number);
      if (updateError) throw updateError;
    }
  }

  const report = { dryRun: DRY_RUN, rows: data.length, changed, empty, backupPath };
  const reportPath = path.resolve(__dirname, `../scratch/daily-mission-flashcards-report-${stamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, reportPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
