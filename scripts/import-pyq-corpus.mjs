import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const CORPUS_DIR = path.join(ROOT, 'data', 'pyq-corpus');
const SOURCES = path.join(CORPUS_DIR, 'sources.jsonl');
const QUESTIONS = path.join(CORPUS_DIR, 'questions.jsonl');

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL/EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function* readJsonl(file) {
  if (!fs.existsSync(file)) return;
  const rl = readline.createInterface({
    input: fs.createReadStream(file, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    yield JSON.parse(trimmed);
  }
}

async function upsertBatch(table, rows) {
  if (!rows.length) return;
  const deduped = [...new Map(rows.map((row) => [row.id, row])).values()];
  const { error } = await supabase.from(table).upsert(deduped, { onConflict: 'id' });
  if (error) throw error;
}

async function importFile(table, file, mapRow, filterRow = () => true) {
  let batch = [];
  let count = 0;
  for await (const row of readJsonl(file)) {
    if (!filterRow(row)) continue;
    batch.push(mapRow(row));
    if (batch.length >= 500) {
      await upsertBatch(table, batch);
      count += batch.length;
      console.log(`${table}: ${count}`);
      batch = [];
    }
  }
  await upsertBatch(table, batch);
  count += batch.length;
  console.log(`${table}: ${count} done`);
}

function clean(value) {
  return typeof value === 'string' ? value.replace(/\u0000/g, '') : value;
}

function cleanArray(value) {
  return Array.isArray(value) ? value.map(clean).filter((item) => String(item || '').trim()) : value;
}

function isReadableQuestion(text) {
  const value = String(text || '').trim();
  if (value.length < 18) return false;
  if (/[�¤£§©®±¶¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/.test(value)) {
    return false;
  }
  const letters = Array.from(value).filter((ch) => /[A-Za-z0-9\u0B80-\u0BFF\u0900-\u097F]/.test(ch)).length;
  const visible = Array.from(value).filter((ch) => !/\s/.test(ch)).length || 1;
  return letters / visible >= 0.45;
}

await importFile('pyq_sources', SOURCES, (row) => ({
  id: clean(row.id),
  exam: clean(row.exam),
  board: clean(row.board),
  year: row.year,
  language: clean(row.language),
  title: clean(row.title),
  file_name: clean(row.file_name),
  file_path: clean(row.file_path),
  source_type: 'pyq_pdf',
}));

await importFile('pyq_questions', QUESTIONS, (row) => ({
  id: clean(row.id),
  source_id: clean(row.source_id),
  exam: clean(row.exam),
  year: row.year,
  subject: clean(row.subject),
  topic: clean(row.topic),
  subtopic: clean(row.subtopic),
  question_number: clean(row.question_number),
  question_text: clean(row.question_text),
  options: cleanArray(row.options),
  answer_text: clean(row.answer_text),
  explanation: clean(row.explanation),
  page_start: row.page_start,
  page_end: row.page_end,
  confidence: isReadableQuestion(clean(row.question_text)) ? row.confidence : 0.1,
}), (row) => isReadableQuestion(clean(row.question_text)));
