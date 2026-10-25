# TNPSC Exam-Granularity & PYQ-Provenance Audit

**Date:** 2026-08-30
**Type:** READ-ONLY inspection. No code / route / metadata / sitemap / DB / Git changes.
**Question:** Does the TNPSC question corpus carry exam-group identity (Group 1 / 2 / 2A / 4 / VAO) and/or verified PYQ provenance (source exam + year), anywhere — including upstream — or is it one flat generic TNPSC pool?

---

## 0. Method

- Parsed **all 84** `assets/quiz-data/tnpsc/**/*.json` files and **all 38,095** question records — full key union, not just the obvious fields.
- Checked file-level metadata (`title`, `exam`, `subject`, `topic`) across every file.
- Traced the generation pipeline in `scripts/build-public-quiz.cjs` backwards to its source (Upstash Redis), including the Redis key grammar and the `normalizeQuestion()` field gate.
- Searched the entire repo for group / VAO / CCSE / PYQ / provenance / corpus / classifier artifacts.
- Ran exact-string overlap analysis within TNPSC and against UPSC / SSC / RRB.

---

## 1. Does a TNPSC question carry exam/group identity?

**No. Not in any inspectable location in this repository.**

| Indicator looked for | Result |
|---|---|
| `exam` / `exam_name` (question level) | **absent** — field exists only at *file* level, value is always the string `"TNPSC"` (84/84 files) |
| `group` / `exam_group` / `paper` | **absent** — 0 of 38,095 records |
| `source` / `source_exam` / `source_year` / `year` | **absent** — 0 of 38,095 records |
| `question_code` / `question_id` / `id` | **absent** — 0 of 38,095 records |
| `tags` / `labels` / `meta` | **absent** — 0 of 38,095 records |
| `target_exam` / `syllabus` | **absent** at question level |
| File names | `assets/quiz-data/tnpsc/{subject}/{topic}.json` — subject/topic only, **no group segment** |
| File `title` field | `"Agriculture Quiz"`, `"Thirukkural Quiz"`, … — **0 titles contain** `group` / `vao` / `ccse` |
| `quiz-index.json` entries | schema `{title, type, url, copy}` — **no group data** |
| Question / explanation **text** citing an exam+year | **3 strings** out of 38,095 loosely match a `TNPSC…20xx` pattern — incidental prose in explanations, not structured provenance. Effectively zero. |

**Every one of the 38,095 TNPSC question records has exactly five keys:** `question`, `options`, `answer_index`, `explanation`, `difficulty`. No exceptions, across all 7 subjects and 84 topics.

---

## 2. Exact counts

Group identity does **not** exist, so a per-group table cannot be produced. What the data actually supports:

| Dimension | Value |
|---|---|
| Distinct **exam buckets** for TNPSC | 1 (`TNPSC`, flat) |
| **Groups** distinguishable (1 / 2 / 2A / 4 / VAO / ACF) | **0** — the axis is absent |
| Subjects | 7 |
| Topics | 84 |
| Total questions | 38,095 |
| Distinct question strings | 35,555 |
| Years available | **none** |
| Provenance (source exam + year) available | **no** |
| Currently exposed publicly | yes — all 84 topics at `/tnpsc/{subject}/{topic}/`, all in sitemap |

### TNPSC corpus by subject (from disk)

| Subject | Topics | Questions |
|---|---:|---:|
| maths (Aptitude & Mental Ability) | 13 | 20,381 |
| history | 16 | 4,860 |
| economics | 10 | 4,585 |
| geography | 11 | 3,299 |
| polity | 12 | 3,297 |
| science | 12 | 916 |
| tamil | 10 | 757 |
| **Total** | **84** | **38,095** |

> Note: `maths` alone is 53% of the TNPSC pool; `science` and `tamil` are extremely thin (916 and 757). This imbalance matters more for content quality than for group splitting.

**How many questions we genuinely have for Group 1 / Group 2 / Group 2A / Group 4:**
There is **no field, filename, key, index entry or tag** that assigns any question to any group. The genuine, data-backed count for each of Group 1, Group 2, Group 2A and Group 4 is therefore **0 identifiable questions** — not because the pool is empty, but because the classification does not exist in the data.

---

## 3. Real PYQs vs generic quiz questions — is provenance stripped, or absent?

### The pipeline

`scripts/build-public-quiz.cjs`:

1. **Source = Upstash Redis** (lines 21–23: throws without `UPSTASH_REDIS_REST_URL`/`TOKEN`). `.env` is **absent from this repo**, so Redis itself cannot be queried here.
2. **Key grammar** (`parseQuizKey`, lines 165–173): `quiz:subject:{subjectKey}:{exam}:{topicId…}`.
   - `{exam}` is one of the 6 flat `EXAMS` keys (`upsc tnpsc ssc rrb samacheer ncert`).
   - **There is no group segment in the key.** If group identity existed upstream, the taxonomy key is where it would live — and it does not.
3. **`normalizeQuestion()`** (lines 119–138) is the field gate. It probes only for content aliases:
   - question: `question_text | question | prompt | passage`
   - answer: `answer_index | correctIndex`
   - explanation: `explanation | reason | solution`
   - plus `options`, `difficulty`
   - It **never reads** `year`, `source`, `source_exam`, `group`, `exam_group`, `paper`, `pyq`, `question_code`, `id`, or `tags`.
   - It returns exactly `{question, options, answer_index, explanation, difficulty}`.
4. `writeQuizData()` (lines 294–303) writes `/assets/quiz-data/{exam}/{subject}/{topic}.json` with `exam` = the display name (`"TNPSC"`), and the 5-field question array.

### Verdict

- **In this repository: (A) — no PYQ provenance exists.** No provenance field is present in any file, index, key pattern, or the pipeline's own read logic.
- **Regarding upstream Redis: indeterminate from here, but strongly negative.** Even if individual Redis records carried extra fields, (i) `normalizeQuestion()` would discard them, and (ii) the Redis key grammar is `subject × exam × topic` with a flat 6-value `exam` enum and **no group axis** — the upstream store is organised as *syllabus-relevant topic practice*, not as *exam papers by group and year*. Nothing in the pipeline suggests a provenance layer exists to be stripped.
- The `exam = "TNPSC"` assignment is a **coarse target/relevance label** ("this topic is curated for TNPSC preparation"), applied at the topic level via the Redis key. It is **not** `source_exam`. It must never be presented as one.

**The earlier audit's "0 verified PYQs" is correct, and it reflects reality (A), not a lossy build (B) — subject to the single un-checkable caveat that Redis could not be inspected. The pipeline structure makes (B) very unlikely.**

---

## 4. How `/tnpsc/` is currently assembled

| Level | URL | How it is built | Question composition |
|---|---|---|---|
| Exam hub | `/tnpsc/` | `scripts/build-exam-hubs.cjs`, hand-authored `HUBS.tnpsc` config. Marketing copy references "Group 1, 2, 2A, 4 & VAO" but **no data binding**. | none — it's a landing page; links to `/tnpsc/{subject}/` |
| Subject | `/tnpsc/{subject}/` | `build-public-quiz.cjs` — groups the Redis `quiz:subject:*` topics whose `{exam}` = `tnpsc` and `{subjectKey}` = this subject; renders a card grid of its topics | union of that subject's topic pools — **all "TNPSC", no group filter** |
| Topic | `/tnpsc/{subject}/{topic}/` | `build-public-quiz.cjs` — one Redis list (`LRANGE quiz:subject:{subj}:tnpsc:{topic} 0 -1`) → `normalizeQuestion` → `/assets/quiz-data/tnpsc/{subject}/{topic}.json` → client quiz player | one flat topic pool, 300–2,000 questions, 5 fields each |

For every level, questions are **"all TNPSC mixed together" with no group dimension available**. They are neither filtered by group, nor duplicated per group, nor tagged — group is simply not a property that exists.

### Concrete examples (from the live data)

- `/tnpsc/polity/fundamental-rights/` Q1: `"What is the supreme law of India?"` → keys: `question, options, answer_index, explanation, difficulty`. No group, no year. The **same string** also appears in `assets/quiz-data/upsc/polity/…` (see §6).
- `/tnpsc/tamil/thirukkural/` Q1 → same 5 keys, `file.exam = "TNPSC"`.
- `/tnpsc/maths/percentage/` Q1 → same 5 keys. (Generic aptitude; indistinguishable from `/ssc/quant/percentage/` content.)
- `/tnpsc/history/mughal/` Q1 → same 5 keys. Mughal history is not even in the core Group 4 syllabus emphasis, yet it sits in the flat TNPSC bucket — underlining that the bucket is "broad TNPSC-relevant GS", not a group paper.

---

## 5. Could group-specific pages be generated accurately from existing data?

| Proposed page | Classification | Why |
|---|---|---|
| `/tnpsc/group-1/` (as a quiz page with a Group-1 question set) | **NOT POSSIBLE FROM CURRENT DATA** | No question, file, key or index carries a Group-1 marker. Any such page would either re-serve the flat `/tnpsc/` pool (duplicate content) or fabricate a distinction. |
| `/tnpsc/group-2/` (quiz page) | **NOT POSSIBLE FROM CURRENT DATA** | same |
| `/tnpsc/group-2a/` (quiz page) | **NOT POSSIBLE FROM CURRENT DATA** | same |
| `/tnpsc/group-4/` (quiz page with a Group-4 question set) | **NOT POSSIBLE FROM CURRENT DATA** | same |
| `/tnpsc/group-4/polity/`, `/tnpsc/group-4/general-tamil/`, `/tnpsc/group-4/aptitude/` (group × subject quiz pages) | **NOT POSSIBLE FROM CURRENT DATA** | Would be byte-for-byte copies of `/tnpsc/polity/`, `/tnpsc/tamil/…`, `/tnpsc/maths/…`. Zero genuine differentiation. |
| `/tnpsc/group-4/` (as a **syllabus landing hub** — no group-specific questions; curated links to the existing `/tnpsc/{subject}/` quizzes that fall in the Group-4 syllabus, with copy that explicitly says "topic practice aligned to the TNPSC Group 4 syllabus") | **READY AFTER PIPELINE CHANGE** | The questions stay generic and shared; the only new input is an **editorial group→subject-list mapping** (syllabus knowledge, ~5 lines of config per group). No question data changes. This is `target_exam` framing, never `source_exam`. |

**Bottom line:** group-specific *question sets* are impossible from current data. A group-specific *syllabus navigation hub* (that does not claim group-authentic questions or PYQs) is possible only after adding an editorial mapping, and only if the copy is scrupulously honest about being syllabus-aligned topic practice.

---

## 6. Overlap analysis

Exact question-string matching (case- and whitespace-normalised):

| Comparison | Identical question strings |
|---|---:|
| **Within TNPSC** (same string in ≥2 TNPSC topics) | **2,540 redundant** (38,095 total → 35,555 distinct) |
| TNPSC ∩ **UPSC** | **2,082** |
| TNPSC ∩ **SSC** | **2,213** |
| TNPSC ∩ **RRB** | **974** |

Interpretation:

- **Exact duplicate questions:** ~6.7% of the TNPSC pool is verbatim-repeated inside TNPSC; a further ~5,000+ TNPSC questions are verbatim-shared with UPSC/SSC/RRB.
- **Same concept, different question:** not separately quantified, but the topic taxonomy is shared across exams (e.g. `polity/fundamental-rights` exists under upsc, tnpsc, ssc), so conceptual overlap is far larger than the exact-match figure.
- **Questions genuinely originating from different exams:** **cannot be determined — no `source_exam` field exists.**

Because there is no group axis, **overlap *between* Group 1 / 2 / 2A / 4 cannot be computed at all.** If four group pages were built by re-slicing the flat pool, they would be near-total duplicates of each other and of `/tnpsc/`.

---

## 7. Syllabus targeting vs PYQ provenance — does the data separate them?

| Concept | Supported by current data? | Where |
|---|---|---|
| `target_exam = TNPSC` (this topic is curated for TNPSC prep) | **Yes, coarse** | Redis key `{exam}` segment + directory path `assets/quiz-data/tnpsc/…`. Topic-level only. |
| `target_exam = Group 4` (this topic is in the Group-4 syllabus) | **No** | no group axis anywhere; would require a new editorial mapping |
| `source_exam = Group 4` (this question was asked in TNPSC Group 4) | **No** | no `source` / `source_exam` field; 0 records |
| `source_year = 2024` (asked in the 2024 paper) | **No** | no `year` field; 0 records |

The data supports **only** the weakest form — a topic being tagged as TNPSC-relevant. It does **not** support group-level syllabus targeting, and it does **not** support any PYQ provenance. The former must never be rendered as the latter: a page may honestly say *"practice questions on topics in the TNPSC syllabus"*; it may **not** say *"TNPSC Group 4 previous-year questions"* or show a year.

---

# A. What TNPSC data we actually have

- **1 flat exam bucket** (`TNPSC`), **7 subjects**, **84 topics**, **38,095 questions** (maths 20,381 · history 4,860 · economics 4,585 · geography 3,299 · polity 3,297 · science 916 · tamil 757).
- Every question record = `{question, options, answer_index, explanation, difficulty}`. Nothing else.
- Source: an Upstash Redis store keyed `quiz:subject:{subject}:{exam}:{topic}` — subject/exam/topic taxonomy, **no group, no year, no source**.
- All 84 topics are already public at `/tnpsc/{subject}/{topic}/` and in the sitemap.

# B. Group 1 count

**0 questions are identifiable as Group 1.** No group field, filename token, Redis key segment, index entry or tag exists. A genuine Group 1 count cannot be produced from this data.

# C. Group 2 count

**0 questions are identifiable as Group 2.** Same reason.

# D. Group 2A count

**0 questions are identifiable as Group 2A.** Same reason.

# E. Group 4 count

**0 questions are identifiable as Group 4.** Same reason.

# F. Generic/unclassified count

**All 38,095 TNPSC questions are generic/unclassified with respect to exam group.** They are classified only by subject (7) and topic (84), and labelled at the topic level as "TNPSC-relevant".

# G. Whether verified PYQ provenance exists upstream

**No provenance exists in anything inspectable in this repository.** No `source`, `source_exam`, `year`, `pyq`, `question_code` field in any of the 38,095 records, the 84 files, `quiz-index.json`, or the Redis key grammar. The build pipeline (`normalizeQuestion`) does not even read such fields.
**Upstream Redis could not be inspected** (`.env` absent), so a residual theoretical possibility cannot be fully closed — but the pipeline's subject-keyed structure, flat 6-value `exam` enum, absence of any group axis, and content-only field gate make it very unlikely that a provenance layer exists to be recovered. Treat as: **provenance genuinely absent (A), pending a direct Redis check.**

# H. What information is lost during public quiz generation

`normalizeQuestion()` keeps 5 fields and **discards everything else on each Redis record**. If Redis records carry anything beyond those 5 fields (e.g. IDs, tags, difficulty rationale, and — hypothetically — provenance), it is dropped at build time. The Redis **key** also encodes only `subject / exam / topic`; any richer taxonomy that is not in the key is not represented. On the current evidence, what is *known* to be lost is limited to non-provenance metadata (IDs/aliases); there is no evidence that group or PYQ data is among the discarded fields, because nothing in the repo or pipeline references them.

# I. Whether group-specific pages can be built accurately

- **Group-specific question sets** (`/tnpsc/group-1/`, `/group-2/`, `/group-2a/`, `/group-4/`, and any `/tnpsc/group-N/{subject}/`): **NOT POSSIBLE FROM CURRENT DATA.** No group dimension exists; such pages would be duplicates of `/tnpsc/` or of the shared subject pages, and would falsely imply group authenticity.
- **Group-specific syllabus navigation hubs** (a `/tnpsc/group-4/` page that carries *no* group-specific questions, only curated links to the existing shared `/tnpsc/{subject}/` quizzes, with copy that says "topic practice aligned to the TNPSC Group 4 syllabus"): **READY AFTER PIPELINE CHANGE** — the only new input is an editorial group→subject mapping. Honest only if it never labels content as a Group-N question or a PYQ and never shows a year.
- **True PYQ pages** (`/tnpsc/pyq/…`, `/tnpsc/group-4/2024/…`): **NOT POSSIBLE FROM CURRENT DATA** and not possible after any pipeline change, because the source questions carry no verified exam/year.

# J. Exact recommended TNPSC route architecture using ONLY existing data

1. **Keep the current tree unchanged and honestly framed:**
   - `/tnpsc/` — exam hub (syllabus-relevant practice, Tamil & English).
   - `/tnpsc/{subject}/` — 7 subject pages.
   - `/tnpsc/{subject}/{topic}/` — 84 topic quiz pages.
   These are accurate as *TNPSC-syllabus topic practice*. Retitle them for search per `keyword-validation.csv` (e.g. "TNPSC Polity Questions & Answers"), but **never** add "previous year", "PYQ", a year, or a group claim to any of them.
2. **Do NOT create** `/tnpsc/group-1/`, `/tnpsc/group-2/`, `/tnpsc/group-2a/`, `/tnpsc/group-4/` as quiz pages, or any `/tnpsc/group-N/{subject}/`. The content to back them does not exist.
3. **Optional, only if group search capture is a priority AND an editorial group→subject syllabus map is added:** up to four **syllabus hub pages** — `/tnpsc/group-1/ … /group-4/` — that contain *zero questions of their own*, list the subjects in that group's syllabus, and link to the existing shared `/tnpsc/{subject}/` quizzes. Copy must read "practice the topics in the TNPSC Group N syllabus", with an explicit line that questions are topic practice, not Group N papers. This is a navigation/landing layer, not a data split.
4. **Never** expose `target_exam` (topic is TNPSC-relevant) as `source_exam`/`source_year`. No year, no "asked in", no "PYQ" anywhere in the TNPSC tree until a verified-provenance question set actually exists.
5. **Prerequisite for anything richer:** a direct read of the Upstash Redis store to confirm §G definitively, and — if provenance is ever added — it must be a new per-question `source_exam` + `source_year` + verification flag, surfaced only on questions that carry all three.

*Nothing in this document has been implemented. No production, route, metadata, sitemap, database or Git changes were made.*
