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
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanCell(value) {
  return clean(value).replace(/[.。]+$/u, '');
}

function parsePayload(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

function sentences(text) {
  const protectedText = clean(text)
    .replace(/B\.N\./g, 'B<N>')
    .replace(/A\.G\./g, 'A<G>')
    .replace(/Dr\./g, 'Dr<dot>')
    .replace(/Mr\./g, 'Mr<dot>')
    .replace(/Mrs\./g, 'Mrs<dot>')
    .replace(/St\./g, 'St<dot>');
  return protectedText
    .split(/(?<=[.!?])\s+/)
    .map((part) => part
      .replace(/B<N>/g, 'B.N.')
      .replace(/A<G>/g, 'A.G.')
      .replace(/Dr<dot>/g, 'Dr.')
      .replace(/Mr<dot>/g, 'Mr.')
      .replace(/Mrs<dot>/g, 'Mrs.')
      .replace(/St<dot>/g, 'St.'))
    .map(clean)
    .filter(Boolean);
}

function factPairs(detail) {
  return sentences(detail).map((sentence) => {
    const m = sentence.match(/^([^:]{2,70}):\s*(.+)$/);
    if (!m) return null;
    return { label: cleanCell(m[1]), value: cleanCell(m[2]) };
  }).filter(Boolean);
}

function isTimeline(title, detail) {
  return /assembly|timeline|movement|revolt|dynasty|date|meeting|adopted|enforced|formed|launched|established|founded|time taken/i.test(`${title} ${detail}`);
}

function isFormula(title, detail) {
  return /formula|ratio|average|mean|median|mode|percent|profit|loss|speed|time|distance|interest|area|volume|angle|indices|surds|equation|=|\d+\s*[:/]\s*\d+/i.test(`${title} ${detail}`);
}

function isTable(title, detail) {
  return /structure|schedule|committee|source|list|classification|types|difference|vs|comparison|parts|articles/i.test(`${title} ${detail}`);
}

function trapSentence(detail) {
  return sentences(detail).find((sentence) => /trap|not\s+\d|not\s+[a-z]|avoid|confuse|remember/i.test(sentence));
}

function textWithoutTrap(detail) {
  const trap = trapSentence(detail);
  if (!trap) return clean(detail);
  return sentences(detail).filter((sentence) => sentence !== trap).join(' ');
}

function compact(value, max = 190) {
  const text = clean(value);
  if (text.length <= max) return text;
  const clipped = text.slice(0, max);
  const cut = Math.max(clipped.lastIndexOf('.'), clipped.lastIndexOf(';'), clipped.lastIndexOf(','), clipped.lastIndexOf(' '));
  return `${clipped.slice(0, cut > 50 ? cut : max).trim().replace(/[.,;:]+$/u, '')}...`;
}

function tableFromFacts(title, pairs) {
  if (/Constitution Structure/i.test(title)) {
    return {
      type: 'table',
      headers: ['Section', 'Parts', 'Articles', 'Schedules'],
      rows: [
        ['Original Constitution', '22 Parts', '395 Articles', '8 Schedules'],
        ['Current structure', '25 Parts', '448+ Articles', '12 Schedules'],
      ],
    };
  }
  return {
    type: 'table',
    headers: ['Item', 'Exam fact'],
    rows: pairs.slice(0, 8).map((pair) => [pair.label, pair.value]),
  };
}

function introForPage(title, detail, blockType, trackId = '', topic = '') {
  const haystack = `${title} ${detail} ${topic}`;
  if (/Constitution Structure/i.test(title)) {
    return 'The Constitution of India began in 1949 with 22 Parts, 395 Articles and 8 Schedules. Amendments have expanded it, so the present structure is larger than the original text.';
  }
  if (/Constituent Assembly/i.test(title)) {
    return 'The Constituent Assembly was created under the Cabinet Mission Plan of 1946 and worked until the Constitution came into force on 26 January 1950.';
  }
  if (/Key Committees|Committee/i.test(title)) {
    return 'Constituent Assembly committee questions usually test the committee-chairman pair. Ambedkar is linked with the Drafting Committee, while Nehru and Patel chaired other major committees.';
  }
  if (/Sources of Constitution|Borrowed|Source/i.test(title)) {
    return 'Borrowed features are tested as feature-country pairs. For example, Parliamentary system links to the UK, Fundamental Rights to the USA, and DPSP to Ireland.';
  }
  if (/Schedules|Schedule/i.test(title)) {
    return 'Schedules are tested by number and subject. The 7th Schedule is especially important because it contains the Union, State and Concurrent Lists.';
  }
  if (/Letter Shifting|Coding|Code|Decoding/i.test(haystack)) {
    return 'Coding-decoding questions test the operation used on letters. First identify whether the rule is shifting, reversing, substitution or opposite-letter coding.';
  }
  if (/Opposite Letter/i.test(title)) {
    return 'Opposite-letter coding pairs A with Z, B with Y and so on. In this method, paired letter positions add up to 27.';
  }
  if (/Cropping|Paddy|Agriculture|Crop/i.test(haystack)) {
    return 'TNPSC agriculture questions usually ask crop, season, district and production-area links. For Tamil Nadu, paddy and Thanjavur are a repeated high-yield pair.';
  }
  if (/Formula|Ratio|Average|Mean|Median|Mode|Interest|Profit|Loss|Speed|Distance|Area|Volume|Angle/i.test(haystack)) {
    return 'In aptitude questions, the formula is only the first step. The exam checks whether you can identify the data type and apply the rule quickly.';
  }
  if (/Treaty|Protocol|Convention|Agreement|Summit/i.test(haystack)) {
    return 'Environment and international-agreement questions usually test the convention, year, objective and protocol pair.';
  }
  if (/Scheme|Mission|Yojana|Abhiyaan/i.test(haystack)) {
    return 'Scheme questions usually test ministry, target group, benefit amount and launch objective. Keep those four links separate.';
  }
  if (/Article|Amendment|Act|Law|Rights|DPSP|Directive/i.test(haystack)) {
    return 'Polity questions often ask the exact Article, amendment, authority or limitation. Read the fact with its constitutional location.';
  }
  if (blockType === 'timeline') {
    return '';
  }
  if (blockType === 'table') {
    return '';
  }
  if (blockType === 'fact_grid') {
    return '';
  }
  if (blockType === 'formula') {
    return compact(textWithoutTrap(detail), 180);
  }
  if (trackId === 'upsc_ecosystem') return 'UPSC prelims usually tests this page through exact pairs, statement traps and conceptual distinctions.';
  if (trackId === 'tnpsc_ecosystem') return 'TNPSC usually tests this page through direct facts, Tamil Nadu links and SSLC-standard application.';
  if (trackId === 'ssc_ecosystem') return 'SSC usually tests this page through fast recall, pattern recognition or one-step application.';
  return '';
}

function pageForNote(note, row) {
  const title = clean(note.title || 'Concept');
  const detail = clean(note.detail || '');
  const pairs = factPairs(detail);
  const trap = trapSentence(detail);
  const blocks = [];

  let primaryType = 'text';
  if (pairs.length >= 3 && isTimeline(title, detail)) {
    primaryType = 'timeline';
    blocks.push({ type: 'timeline', items: pairs.slice(0, 8) });
  } else if (pairs.length >= 3 && isTable(title, detail)) {
    primaryType = 'table';
    blocks.push(tableFromFacts(title, pairs));
  } else if (pairs.length >= 3) {
    primaryType = 'fact_grid';
    blocks.push({ type: 'fact_grid', items: pairs.slice(0, 8) });
  } else if (isFormula(title, detail)) {
    primaryType = 'formula';
    blocks.push({ type: 'formula', title, text: compact(textWithoutTrap(detail), 220) });
  } else {
    blocks.push({ type: 'text', text: textWithoutTrap(detail) });
  }

  if (trap) blocks.push({ type: 'trap', text: trap });

  return {
    title,
    type: isTimeline(title, detail) ? 'timeline' : isFormula(title, detail) ? 'formula' : pairs.length >= 3 ? 'facts' : 'concept',
    intro: introForPage(title, detail, primaryType, row.track_id, row.topic_title),
    blocks,
  };
}

function overviewPage(topic, notes) {
  return {
    title: topic,
    type: 'overview',
    intro: `Today you will study ${topic}. By the end, you should clearly understand the main subtopics below and be ready for recall cards and exam practice.`,
    blocks: [
      {
        type: 'fact_grid',
        items: notes.slice(0, 6).map((note, idx) => ({
          label: note.title || `Concept ${idx + 1}`,
        })),
      },
    ],
  };
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
  const backupPath = path.resolve(__dirname, `../scratch/daily-mission-before-lesson-pages-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  let changed = 0;
  for (const row of data) {
    const payload = parsePayload(row.content_json);
    const topic = clean(row.topic_title || payload.topic_title || payload.snapshot?.title || `Day ${row.day_number}`);
    const notes = (payload.snapshot?.quick_notes || []).map((note) => ({
      title: clean(note.title),
      detail: clean(note.detail),
    })).filter((note) => note.title && note.detail);
    if (!notes.length) continue;

    const lessonPages = [overviewPage(topic, notes), ...notes.map((note) => pageForNote(note, row))];
    const nextPayload = { ...payload, lesson_pages: lessonPages };
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

  const report = { dryRun: DRY_RUN, rows: data.length, changed, backupPath };
  const reportPath = path.resolve(__dirname, `../scratch/daily-mission-lesson-pages-report-${stamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, reportPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
