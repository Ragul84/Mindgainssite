# Android App + Upstash Redis + Supabase — TNPSC Data Granularity Audit

**Date:** 2026-08-30
**Type:** READ-ONLY. Redis: `SCAN`/`TYPE`/`GET` only. Supabase: `GET` (PostgREST `select` + `count`) only. No writes, no schema changes, no Git.
**Repos inspected:** `C:\mindwhite` (Expo/React-Native app + backend workspace), `C:\mindgains-waitlist` (public site). Upstash Redis `emerging-beetle-64379.upstash.io`. Supabase `yuntwerxahgmaoduxvqc`.
**Question:** Does TNPSC Group 1 / 2 / 2A / 4 / VAO granularity — and real PYQ provenance — exist anywhere, even though the public quiz build flattens TNPSC into one generic pool?

---

## 0. Executive answer

**Verdict E — multiple corpora exist.** Three separate TNPSC question systems live behind these apps:

| # | Corpus | Where | TNPSC count | Group identity | Provenance |
|---|---|---|---:|---|---|
| 1 | **Generic practice pool** | Redis `quiz:subject:tnpsc:*` → public-site JSON, app Quiz Hub, app Mock | ~38,095 | **none** | none |
| 2 | **AI-generated "PYQ-style" bank** | Redis `miga:pyq:published:tnpsc:*` | 3,261 | **none** (free-text `paper` sometimes `"Group 4"`) | **fabricated** — `source_url: edu4bharat.ai/generated`, self-asserted `verification_status:"verified"` |
| 3 | **Genuinely verified PYQ archive** | Supabase `pyq_verified_clean` (raw: `pyq_questions`) → app "Verified PYQs" screen | **3,463** verified (5,754 raw) | **YES — embedded in `source_id`** | **YES** — official-key / cross-verified, `confidence ≥ 0.7`, `answer_source: ticked-verified`, `nullified`, `accepted_answers` |

The public website build (`build-public-quiz.cjs`) reads **only corpus 1**. Corpus 3 — 3,463 group-tagged, year-tagged, verified TNPSC PYQs — is entirely invisible to the public site.

---

## 1. Android app — Quiz Hub / Mock / PYQ flow

### 1a. Solo Quiz practice — `utils/redisService.ts`

- Data layer for the in-app quiz browser. Fetches from Redis list keys `quiz:subject:{redisKey}` (`getQuestions()`, ~line 934: `key = quiz:subject:${redisKey}`).
- `DEFAULT_SUBJECTS.tnpsc` (line 134) is a **flat subject list**. `DEFAULT_TOPICS['tnpsc:aptitude']`, `['tnpsc:tamil']`, `['tnpsc:history']`, … are flat topic maps.
- Line 133 carries the comment `// ── TNPSC (Group 1 / 2 / 2A / 4 / VAO — 2024 Syllabus) ──` — **this is the only "group" reference, and it is a code comment describing which syllabus the subject list was drawn from.** No group parameter exists in any function signature, subject id, topic id, or Redis key.
- **Result:** the app's solo Quiz Hub serves the **same flat generic `quiz:subject:tnpsc:*` pool as the public website.**

### 1b. Mock tests — `utils/mockConfig.ts` + `utils/mockService.ts`

- `MOCK_CONFIGS.tnpsc` = one config, `name: "TNPSC Group 4"`, comment `// TNPSC Group 4 — 200Q (GS 75, Aptitude 25, Tamil 100), 1.5 marks, NO negative, 180 min`, `source: "Standard TNPSC Group 4 pattern"`.
- Its sections map to `pools: ['history','polity','geography','economics','science','current_affairs']` / `['maths']` / `['tamil']` — i.e. the **generic `quiz:subject:*` pools** (`mockConfig.ts` header: *"maps every section to the live `quiz:subject:{key}` pools"*).
- `assembleMock('tnpsc')` draws N random questions from those generic pools and scores them on the Group-4 marking scheme.
- **Result:** the Mock feature is a **Group-4-shaped shell filled with generic questions.** The *pattern* (section counts, timing, marks) is Group-4-authentic; the *questions* are not Group-4 anything. There is no Group 1 / 2 / 2A config at all.

### 1c. "Verified PYQs" — `app/pyq/index.tsx`, `app/pyq/paper.tsx`, `utils/pyqService.ts`

- Header text: **"Verified PYQs" / "Verified previous-year questions"**. Card meta: `{total} verified Qs · {from}–{to} · {years} years`.
- Flow: **exam → year → paper**. `step: 'exam' | 'year'` — **there is no group step.**
- `pyqService.ts` reads **Supabase**, not Redis:
  - `pyq_exam_summary` — one row per exam.
  - `pyq_year_distribution` — exam × **year** × subject counts.
  - `pyq_verified_clean` — *"official-key / cross-verified sources only, confidence >= 0.7, real 4-option MCQs"*.
- `PyqQuestion` exposed fields: `id, question_number, question_text, options, answer_text, subject, topic, nullified, accepted_answers`.
- The service **does not read or expose the group**, even though it is present in the `id` (see §3).

### Does Android expose TNPSC Group 1/2/2A/4 separately?

**No.** Quiz Hub = flat generic pool. Mock = one Group-4-pattern shell over generic questions. Verified PYQs = exam → year (no group step). Group appears in the app as (a) a descriptive code comment, and (b) a hardcoded mock *pattern* label — never as a user-selectable data filter.

---

## 2. Upstash Redis — direct read-only inspection

`DBSIZE` = **18,031 keys**. Two relevant namespaces:

### 2a. `quiz:subject:*` — the public-site + app-quiz source

- Grammar: `quiz:subject:{subject}:{exam}:{topic}` — e.g. `quiz:subject:economics:tnpsc:agriculture`, `quiz:subject:polity:tnpsc:fundamental-rights`.
- Type: LIST of JSON question strings.
- **Flat. No group segment. No year. No source.** Matches the public-site JSON exactly.

### 2b. `miga:pyq:*` — a separate PYQ system

| Key prefix | ~count | Meaning |
|---|---:|---|
| `miga:pyq:publish_ready:quiz:subject:{subject}:{hash}` | ~3,994 | staged records |
| `miga:pyq:published:tnpsc:{subject}:{hash}` | **3,261** | "published" TNPSC set |
| `miga:pyq:published:upsc:{subject}:{hash}` | ~2,148 | published UPSC set |
| `miga:pyq:fingerprint:{exam}:{subject}:{sha1}` | ~4,000 | dedup fingerprints |
| `miga:pyq:trust:{sha1}` | many | per-item trust markers |
| `miga:index:topics:tnpsc:{aptitude\|economics\|english\|geography\|gs\|history}` | 6 | STRING (JSON array) topic index |

**`miga:pyq:published:tnpsc:*` — 3,261 keys**, by subject bucket: tamil 770, aptitude 589, polity 371, history 363, geography 318, science 287, economics 244, gs 183, english 91, maths 45.

**Raw record schema** (`GET` of one key, type `string` → JSON):

```
question_text, options, correct_answer, explanation,
subject: "aptitude",
exam: "tnpsc",
year: 2024,                              ← present, but ~uniform 2024
paper: "General Studies",                ← free text; a few say "Group 4" / "Tamil"
topic: "Reasoning",
question_hash,
source_type: "trusted_archive",          ← asserted
source_url: "https://edu4bharat.ai/generated",   ← ⚠️ literally "generated"
verification_status: "verified",         ← asserted, not credible (see below)
created_at: "2026-03-17T..."
```

**This corpus is AI-generated, not transcribed papers:**
- `source_url` ends in `/generated`.
- The sampled "aptitude 2024 TNPSC PYQ" is the classic *three-switches / three-bulbs* internet riddle — not a real TNPSC aptitude question.
- `miga:index:topics:tnpsc:gs` is uncleaned LLM output: entries like `"This seems like a jumbled mess of words"`, `"Here is the categorized topic: Vocabulary of Sociology"`, `"You need to classify it under a different category as"`, `"GrowthSciences"`, truncated Tamil fragments.
- `verification_status: "verified"` + `source_type: "trusted_archive"` are **labels asserted on generated content**; they do not denote official-exam provenance.
- **No `group` / `exam_group` / `track` field on any record.** Probes `miga:*group4*`, `*2022*tnpsc*`, `miga:*year*` → empty.

No `pyq_verified` records use structured IDs (`tnpsc-group1-prelims-...`); they are hash-keyed. This Redis PYQ set is **not** wired to any current app screen (the app's PYQ screen reads Supabase).

---

## 3. Supabase — the real verified PYQ archive

### `pyq_exam_summary`

| exam | total_questions | year range | years | subjects | untagged |
|---|---:|---|---:|---:|---:|
| JEE | 10,800 | 2017–2026 | 10 | 3 | 0 |
| **TNPSC** | **3,463** | **2013–2025** | **12** | 31 | 105 |
| UPSC | 953 | 2016–2025 | 10 | 11 | 0 |
| SSC | 647 | 2023 only | 1 | 4 | 0 |
| NEET | 163 | 2024 only | 1 | 4 | 0 |

### `pyq_verified_clean` — columns

`id, source_id, exam, year, subject, topic, subtopic, question_number, question_text, options, answer_text, question_type, answer_source, confidence, needs_figure, images, nullified, accepted_answers`

- **`id` / `source_id` encode exam + group + stage + year + paper:**
  `tnpsc-group4-prelims-2025-q180`, `tnpsc-group1-prelims-2019`, `tnpsc-group2-prelims-2022-tamil`, `tnpsc-group2a-2017-gs`, `tnpsc-acf-prelims-2023-gs`, `tnpsc-group4-prelims-2019-gs`.
- `answer_source`: `ticked-verified`. `confidence`: 0.85+. `nullified`: real TNPSC nullification. `accepted_answers`: official multi-correct handling.
- Sampled questions are **authentic transcribed PYQs** (1918 Madurai Harvey Mill strike; "Bharatiyar Congress conference"; a Group-2 English vocabulary item).

### Raw table `pyq_questions` (pre-filter)

Adds `explanation, page_start, page_end, created_at, answer_model, answer_confidence`. TNPSC raw total **5,754** across years 2014, 2016, 2017, 2018, 2019, 2022, 2024, 2025 — **including ~344 TN TET rows** (`exams-tn-specific-tet-pyq-2017-…`), i.e. `exam="TNPSC"` is over-applied to TN-state exams generally. `pyq_verified_clean` (3,463) is the confidence-filtered serveable view.

### Exact TNPSC verified-clean counts by group (from `source_id`)

| Group | Verified-clean questions | Raw (`pyq_questions`, `like %groupN%`) |
|---|---:|---:|
| **Group 1** | **1,597** | ~1,821 |
| **Group 4** | **989** | ~1,098 |
| **Group 2** | **637** | ~1,011 |
| **ACF** | **200** | — |
| **Group 2A** | **40** | — |
| VAO | **0** | 0 |
| **TOTAL** | **3,463** | 5,754 (incl. non-group TN exams) |

Distinct verified TNPSC PYQ papers (`source_id`) observed: `tnpsc-group1-prelims-2019/2021/2022/2024`, `tnpsc-group2-prelims-2014/2018/2022/2024` (+ `-tamil`, `-gs-v2`), `tnpsc-group2a-2017-gs`, `tnpsc-group4-prelims-2019/2022/2025` (+ `-tamil`, `-gs`), `tnpsc-acf-prelims-2023-gs`.

### Local ingestion staging — `C:\mindwhite\tmp-pyq\tnpsc\`

89 JSON files + official PDFs: `2019-group1-paper.pdf`, `2022-group1-official-key.pdf`, `2019-group4-gs-paper.pdf`, `2022-group2-key.pdf`, `2023-acf-official-key.pdf`, `2023-ccse3a-official-key.pdf`, `tag-tnpsc-all.json` (369 records, ids `tnpsc-group1-prelims-2021-gs-q1`), `nullified/`, `keys/`, `tamilkeys/`. This is the human transcription + tagging workspace that feeds Supabase.

---

## 4. Three-layer comparison

| Property | Android Quiz Hub (solo) | Android Mock | Android "Verified PYQs" | Raw Redis `quiz:subject:*` | Raw Redis `miga:pyq:published:tnpsc` | Supabase `pyq_verified_clean` | Public website JSON |
|---|---|---|---|---|---|---|---|
| exam granularity | flat `tnpsc` | 1 config `tnpsc` | `TNPSC` | flat `tnpsc` | `tnpsc` | `TNPSC` | flat `tnpsc` |
| group granularity | **none** (code comment only) | **pattern only** ("Group 4" label; generic Qs) | **in `source_id`, not surfaced** (UI = exam→year) | **none** | **none** (free-text `paper` sometimes "Group 4") | **YES — G1/G2/G2A/G4/ACF derivable from `source_id`** | **none** |
| subject | flat list | section pools | mixed / inconsistent per year | in key | in key | column (messy, per-batch taxonomy) | file meta |
| topic | flat list | — | column | in key | field | column | file meta |
| year | none | none | **2013–2025** | none | present (~uniform 2024) | **2013–2025, 12 yrs** | none |
| source / provenance | none | none | official-key ingestion | none | **fabricated** (`edu4bharat.ai/generated`) | **`answer_source: ticked-verified`, `confidence`, `nullified`, `accepted_answers`** | none |
| PYQ flag | none | none | implicit (verified-clean view) | none | asserted, not real | implicit (view = verified only) | none |
| question ID | list index | — | `id` (`tnpsc-group4-prelims-2025-q180`) | list index | content hash | `id` + `source_id` | none |
| TNPSC question count | ~38,095 | assembled from generic | **3,463** | ~38,095 | 3,261 | **3,463** (raw 5,754) | 38,095 |

---

## 5. UI labels vs data quality — explicit call-outs

- **App Mock says "TNPSC Group 4" but fetches the generic `quiz:subject:*` pool.** The Group-4 identity there is a *pattern label* (section split / timing / marks), not group-authentic questions. `mockConfig.ts` maps every section to generic pools.
- **`redisService.ts` line 133 comment "TNPSC (Group 1 / 2 / 2A / 4 / VAO — 2024 Syllabus)"** describes syllabus provenance of the *subject list*, not of the questions. No question is group-tagged in that layer.
- **Redis `miga:pyq:published:tnpsc` is labelled `verification_status: "verified"` / `source_type: "trusted_archive"`** while its own `source_url` is `edu4bharat.ai/generated` and its content includes generic internet riddles. Those labels must not be trusted as PYQ provenance.
- **`target_exam` ≠ `source_exam`.** The generic pool's `exam: "tnpsc"` (Redis key / website path) is a *relevance/target* tag ("curated for TNPSC prep"). Only Supabase `pyq_verified_clean.source_id` carries a genuine *source* (`tnpsc-group4-prelims-2025` = asked in the TNPSC Group 4 2025 prelims). The two must never be conflated.

---

# A. Android Quiz Hub structure

- **Solo practice** (`utils/redisService.ts`): flat `DEFAULT_SUBJECTS.tnpsc` → `DEFAULT_TOPICS['tnpsc:{subject}']` → `getQuestions()` reads Redis `quiz:subject:{key}` LISTs. No group anywhere except a descriptive comment. Same generic pool as the website.
- **Mock** (`utils/mockConfig.ts` + `mockService.assembleMock`): a single `tnpsc` config named "TNPSC Group 4" with the authentic Group-4 *pattern*, assembled from the generic `quiz:subject:*` pools. No G1/G2/G2A.
- **Verified PYQs** (`app/pyq/*`, `utils/pyqService.ts`): reads Supabase views; flow is **exam → year → paper**; no group step; group present in `id` but not parsed or shown.

# B. Group 1 count

- **Verified (Supabase `pyq_verified_clean`): 1,597** questions (`source_id like tnpsc-group1*`). Raw `pyq_questions`: ~1,821. Papers seen: prelims 2019, 2021, 2022, 2024.
- Generic pool / Redis `miga:pyq` / website: **0 identifiable** (no group dimension).

# C. Group 2 count

- **Verified: 637** (`tnpsc-group2-*`, excludes 2A). Raw: ~1,011. Papers: prelims 2014, 2018, 2022 (GS + Tamil), 2024 (GS v2 + Tamil).
- Generic / Redis miga:pyq / website: **0 identifiable**.

# D. Group 2A count

- **Verified: 40** (`tnpsc-group2a*`). One paper observed: `tnpsc-group2a-2017-gs`.
- Generic / Redis miga:pyq / website: **0 identifiable**.

# E. Group 4 count

- **Verified: 989** (`tnpsc-group4-*`). Raw: ~1,098. Papers: prelims 2019 (GS + Tamil), 2022 (GS + Tamil), 2025 (+ Tamil).
- **App Mock** exposes a "TNPSC Group 4" *pattern* only — questions are generic, not these 989.
- Generic pool / website: **0 identifiable**.
- (ACF: 200 verified. VAO: 0.)

# F. Generic / unclassified count

- **Redis `quiz:subject:tnpsc:*` / public-site JSON: 38,095** questions — 100% unclassified by group, no year, no source. Also the substrate for the app's Quiz Hub and Mock.
- **Redis `miga:pyq:published:tnpsc:*`: 3,261** — AI-generated; `year` field present but content and `source_url` show it is not genuine PYQ provenance; **no group**.

# G. Whether PYQ / year / source metadata exists upstream

**Yes — in Supabase, and it is genuine.** `pyq_verified_clean` / `pyq_questions` carry `year` (2013–2025), `source_id` (encoding group + stage + paper), `answer_source: ticked-verified`, `confidence`, `nullified`, `accepted_answers`, backed by official-key PDFs in `mindwhite/tmp-pyq/tnpsc/`. **3,463 verified TNPSC PYQs**, group-resolvable: **G1 1,597 · G4 989 · G2 637 · ACF 200 · G2A 40 · VAO 0**.
Separately, Redis `miga:pyq:*` also has `year`/`paper`/`verification_status` fields, but that corpus is **AI-generated** (`source_url: edu4bharat.ai/generated`) and its "verified" labels are not trustworthy — it is **not** a source of real PYQ provenance.

# H. What the public website currently loses

`build-public-quiz.cjs` reads **only** Redis `quiz:subject:*` and `normalizeQuestion()` keeps 5 fields. The public site therefore loses:

1. **The entire Supabase verified PYQ archive** — 3,463 TNPSC questions with real `year` (2013–2025), `source_id` (group + paper), verification status, nullification and accepted-answers data. None of it reaches the website; the website has **no Supabase connection at all**.
2. **All group resolution** — G1/G2/G2A/G4/ACF identity that exists in `source_id`.
3. **Year / paper structure** for building real "TNPSC {year} question paper" pages.
4. (From the generic Redis pool specifically: nothing of value is lost — that pool never had provenance.)

# I. Whether group-specific SEO pages can be backed honestly

- **From the generic pool (38k) — NO.** No group dimension; group pages would be duplicates of `/tnpsc/`.
- **From Redis `miga:pyq` — NO.** AI-generated; presenting it as PYQ or "Group N" would be false.
- **From Supabase `pyq_verified_clean` — YES, for genuine PYQ pages, at real scale:**
  - `/tnpsc/group-4/pyq/` (989 verified Qs), `/tnpsc/group-1/pyq/` (1,597), `/tnpsc/group-2/pyq/` (637), `/tnpsc/group-2a/pyq/` (40), `/tnpsc/acf/pyq/` (200).
  - `/tnpsc/group-4/pyq/2025/`, `/…/2022/`, `/…/2019/` — real papers exist for those years.
  - These would be **honest** because each question carries `source_id = tnpsc-group{N}-prelims-{year}` and official-key verification.
  - **Constraints:** (a) the website has no Supabase pipeline today — a build change is required to pull `pyq_verified_clean`; (b) per-year sets are partial ("counts shown honestly" per pyqService) — pages must state actual counts, not imply a full 100/200-Q paper; (c) `subject` taxonomy in the archive is inconsistent across years and would need mapping; (d) Group 2A (40) and single-item years are too thin for standalone pages.
- **A broad `/tnpsc/group-4/` topic-*practice* hub still cannot be group-backed** — only 989 Group-4 PYQs exist; broad practice would fall back to the generic pool, which is not Group-4-specific.

# G. Recommended next investigation

1. **Confirm the Supabase → website gap is the only integration missing:** check whether any backend job already mirrors `pyq_verified_clean` into Redis or a static export (searched `mindwhite/scripts`, `services`, `supabase/` — none found; confirm with a backend owner).
2. **Pull the full `pyq_verified_clean` TNPSC set** (3,463 rows, paginated past the 1,000 cap) and produce an exact **group × year × subject** matrix, plus per-`source_id` completeness (how many of the ~100–200 questions in each real paper are actually captured) — this determines which group/year pages clear a "real page" bar.
3. **Audit `subject`/`topic` consistency** in the archive (values range from `"Tamil Nadu Specific"` to `"Unit 10: Aptitude & Mental Ability"` to `"Unclassified"`) and define a mapping to the site's TNPSC subject slugs.
4. **Verify the `nullified` / `accepted_answers` rendering contract** so PYQ pages show TNPSC's official nullifications correctly.
5. **Decide the corpus-2 question:** whether Redis `miga:pyq:*` (AI-generated) is still written to / consumed anywhere, and whether its "verified/trusted" labelling should be corrected (out of scope here; flag to the app team).

*Nothing was modified. All Redis and Supabase access was read-only (SCAN/TYPE/GET; PostgREST GET + count). No code, DB, route, metadata, sitemap or Git changes.*
