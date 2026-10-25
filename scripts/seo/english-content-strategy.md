# English (Grammar + Vocabulary + RC) — Content Strategy

**Problem:** 10–20 questions per micro-topic = a user finishes it in one sitting and leaves.
**Fix:** a layered bank per micro-topic, served adaptively, so the pool *feels* endless.

---

## 1. Layered content model (per micro-topic)

| Layer | What | Target size |
|---|---|---|
| **L1 — Verified PYQ bank** | Every real occurrence of this micro-topic mined from 12–15 years of released papers (SSC CGL Tier 1 + Tier 2, all shifts; SSC CHSL/MTS/CPO; TNPSC General English; RRB English). Tagged: `year`, `shift`, `paper`, `rule`, `answer`. | whatever exists — typically **300–2,000** for a high-frequency micro-topic like error spotting |
| **L2 — MindGains originals** | For every *rule / pattern* the PYQs reveal, 15–30 fresh items in the same format and register (like `sample-batch-ssc-error-spotting.json`). | **5–10× L1**, capped at ~1,500/micro-topic |
| **L3 — Adaptive serving** | Shuffled draw from L1+L2; weights toward rules the user misses; "endless practice" + "daily fresh 15" modes; wrong answers resurface after a spacing interval. | — |

**Result:** even a 500-item pool feels infinite when the user sees 15–25 per session, in a new order, with their weak rules over-sampled.

---

## 2. Volume targets

| Tier | Target questions (L1 + L2 combined) |
|---|---|
| High-frequency micro-topic (error spotting, sentence improvement, fill blanks, RC, one-word, idioms, synonyms, antonyms) | **500–800** |
| Medium micro-topic (voice, narration, spelling, cloze, para jumbles) | **300–500** |
| Coverage (all micro-topics have ≥ target, ≥ 30% are verified PYQs where PYQs exist) | goal state |

---

## 3. Umbrella structure — what the exam calls it

**Section name (official):** SSC = "English Comprehension" (Tier 1) / "English Language & Comprehension" (Tier 2). TNPSC = "General English".

Group the micro-topics under **three sub-sections** (standard coaching taxonomy):

### Grammar  →  `/ssc/english/grammar/` (parent) + these micro-topic pages
- Spot the Error / Error Detection — `/ssc/english/error-spotting/`  *(building now)*
- Sentence Improvement — `/ssc/english/sentence-correction/`
- Fill in the Blanks — `/ssc/english/fill-blanks/`
- Active & Passive Voice — `/ssc/english/voice/`  *(new)*
- Direct & Indirect Speech — `/ssc/english/narration/`  *(new)*
- Sentence / Para Rearrangement (jumbles) — `/ssc/english/para-jumbles/`  *(new)*
- Cloze Test — `/ssc/english/cloze-test/`

### Vocabulary  →  `/ssc/english/vocabulary/` (parent) + micro-topics
- Synonyms — `/ssc/english/synonyms-antonyms/` (split into synonyms / antonyms if depth allows)
- Antonyms — (as above)
- One Word Substitution — `/ssc/english/one-word/`
- Idioms & Phrases — `/ssc/english/idioms-phrases/`  *(new)*
- Spelling Correction — `/ssc/english/spelling/`  *(new)*
- Homonyms / commonly confused words — `/ssc/english/homonyms/`  *(new, optional)*

### Reading Comprehension  →  `/ssc/english/comprehension/`
- Passage-based sets (tone, inference, vocab-in-context, main idea)

**Keep the individual micro-topic pages** — they are what rank for `"ssc cgl error spotting questions"`, `"ssc cgl idioms and phrases"` etc. The three parent pages are grouping/landing pages that link down.

---

## 4. Reuse across exams

| Exam | Grammar bank | Vocabulary bank | RC bank |
|---|---|---|---|
| **SSC CGL** | native | native | native |
| **SSC CHSL / MTS / CPO / GD** | **~95% reuse** (same syllabus, slightly easier) | ~95% | ~95% |
| **RRB NTPC / Group D (English section, where applicable)** | ~90% | ~90% | ~85% |
| **TNPSC General English** | **~80% reuse** (tenses, voice, articles, prepositions, question tags, error detection) — re-tag `syllabus_node` to `tnpsc:general-english:*` | ~80% (synonyms, antonyms, one-word, idioms, prefix/suffix) | ~70% |
| **TNPSC — Literature part** | NOT reusable (Shakespeare, poets, figures of speech, poet–poem matching — TNPSC-specific, build separately) | — | — |
| **UPSC** | **NOT reusable** — CSAT English is *reading comprehension only*; UPSC dropped standalone grammar/vocab MCQs. Only the RC bank is partially relevant, and CSAT RC is harder/analytical. | no | RC: different difficulty; build UPSC-CSAT RC separately |

**Build order that maximises reuse:** build the SSC Grammar + Vocabulary banks to full depth first → clone to SSC-family + RRB with a tag swap → adapt ~80% to TNPSC General English → add TNPSC Literature separately. Skip UPSC for grammar/vocab entirely.

---

## 5. PYQ-mining plan (Layer 1)

1. **Acquire** released papers: SSC CGL Tier 1 & 2 (2013–2025, all shifts), SSC CHSL/MTS/CPO (2018–2025), TNPSC General English (Group 1/2/4, 2013–2025), RRB NTPC English (2016–2025).
2. **Extract** every English question → normalise to the schema (`question, options, answer_index, explanation, difficulty, question_type, syllabus_node, source={exam, year, shift, paper}, lang, is_pyq=true`).
3. **Classify** each by micro-topic + rule (error spotting → SVA / tense / preposition / …). This gives the real **rule-frequency table** per exam.
4. **Dedup** across shifts (SSC repeats items).
5. **Fill** with Layer-2 originals so every micro-topic hits its target, matching the rule-frequency table from step 3.

Output: `assets/quiz-data/{...}` pools where each item carries `is_pyq` + `rule` tags, plus a coverage report (`% micro-topics at target`, `% verified PYQ`, `rule-mix vs real papers`).

---

## 6. QA additions (on top of `content-generation-brief.md`)

- **Answer-position balance:** across a micro-topic pool, no single option index may hold > 35% of answers. *(The current 30-item sample is 63% on index 1 — acceptable for a sample, must be balanced in the full pool.)*
- **"No error" ratio:** 10–15% of error-spotting / sentence-improvement items use the "No error" option, and of those, ~40% actually have no error (so "No error" is a real answer, not a decoy that's never right).
- **PYQ share:** ≥ 30% of a published micro-topic pool must be verified PYQs where PYQs exist for it.
- **Rule coverage:** every rule that appears in the PYQ frequency table for that micro-topic has ≥ 10 items in the pool.
