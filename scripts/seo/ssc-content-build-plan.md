# SSC CGL — Content Build Plan (Step 1 of the syllabus-completion program)

**Source of gaps:** `scripts/seo/syllabus-gap-ssc.csv` · **Standards:** `scripts/seo/content-generation-brief.md`
**Scope:** 18 syllabus topics with NO quiz + 3 under-built topics. Nothing built yet — this is the spec to feed generation.

**Targets:** 300 Q per new topic (flagship 500) · difficulty 25/50/25 · format-mix per the SSC table in the brief · 0 dup · every item grounded + explained + syllabus-tagged.

---

## A. NEW ROUTES TO CREATE (18)

Route auto-generates once its Redis key `quiz:subject:{subject}:ssc:{slug}` has questions. Title/H1/meta go into `round2-title-overrides.json` at creation.

### Reasoning (5)

| New route | Topic | Target Q | Redis key | Draft title | Draft H1 |
|---|---|---:|---|---|---|
| `/ssc/reasoning/classification/` | Classification / odd-one-out (semantic, number, figural) | 500 | `quiz:subject:reasoning:ssc:classification` | SSC CGL Classification Questions (Odd One Out) with Answers \| MindGains | SSC CGL Classification Questions |
| `/ssc/reasoning/ranking-arrangement/` | Ranking & seating / order & position | 300 | `…:ssc:ranking-arrangement` | SSC CGL Ranking & Seating Arrangement Questions with Answers \| MindGains | SSC CGL Ranking & Arrangement Questions |
| `/ssc/reasoning/cube-dice/` | Cube & dice | 300 | `…:ssc:cube-dice` | SSC CGL Cube & Dice Questions with Answers \| MindGains | SSC CGL Cube & Dice Questions |
| `/ssc/reasoning/missing-number/` | Missing number / arithmetic reasoning | 300 | `…:ssc:missing-number` | SSC CGL Missing Number & Arithmetic Reasoning Questions with Answers \| MindGains | SSC CGL Missing Number Questions |
| `/ssc/reasoning/math-operations/` | Mathematical operations (BODMAS, symbol substitution) | 300 | `…:ssc:math-operations` | SSC CGL Mathematical Operations Questions with Answers \| MindGains | SSC CGL Mathematical Operations Questions |

### Quantitative Aptitude (4)

| New route | Topic | Target Q | Redis key | Draft title | Draft H1 |
|---|---|---:|---|---|---|
| `/ssc/quant/average/` | Average | 300 | `quiz:subject:quant:ssc:average` | SSC CGL Average Questions with Answers — Free Practice \| MindGains | SSC CGL Average Questions |
| `/ssc/quant/mixture-alligation/` | Mixture & alligation | 300 | `…:ssc:mixture-alligation` | SSC CGL Mixture & Alligation Questions with Answers \| MindGains | SSC CGL Mixture & Alligation Questions |
| `/ssc/quant/partnership/` | Partnership | 300 | `…:ssc:partnership` | SSC CGL Partnership Questions with Answers \| MindGains | SSC CGL Partnership Questions |
| `/ssc/quant/mensuration/` | Mensuration — 2D & 3D (areas, volumes, surface areas) | 500 | `…:ssc:mensuration` | SSC CGL Mensuration Questions (2D & 3D) with Answers \| MindGains | SSC CGL Mensuration Questions |

### English (5)

| New route | Topic | Target Q | Redis key | Draft title | Draft H1 |
|---|---|---:|---|---|---|
| `/ssc/english/error-spotting/` | Spot the error / sentence error detection | 500 | `quiz:subject:english:ssc:error-spotting` | SSC CGL Error Spotting Questions with Answers — Free Practice \| MindGains | SSC CGL Error Spotting Questions |
| `/ssc/english/idioms-phrases/` | Idioms & phrases | 500 | `…:ssc:idioms-phrases` | SSC CGL Idioms & Phrases with Meanings — Questions with Answers \| MindGains | SSC CGL Idioms & Phrases Questions |
| `/ssc/english/spelling/` | Spelling correction / misspelt words | 300 | `…:ssc:spelling` | SSC CGL Spelling Correction Questions with Answers \| MindGains | SSC CGL Spelling Correction Questions |
| `/ssc/english/voice/` | Active & passive voice | 300 | `…:ssc:voice` | SSC CGL Active & Passive Voice Questions with Answers \| MindGains | SSC CGL Active & Passive Voice Questions |
| `/ssc/english/narration/` | Direct & indirect speech | 300 | `…:ssc:narration` | SSC CGL Direct & Indirect Speech Questions with Answers \| MindGains | SSC CGL Direct & Indirect Speech Questions |

### General Awareness (4)

| New route | Topic | Target Q | Redis key | Draft title | Draft H1 |
|---|---|---:|---|---|---|
| `/ssc/polity/fundamental-rights/` | Fundamental Rights, DPSP & Fundamental Duties | 300 | `quiz:subject:polity:ssc:fundamental-rights` | SSC CGL Fundamental Rights & DPSP Questions with Answers \| MindGains | SSC CGL Fundamental Rights & DPSP Questions |
| `/ssc/polity/statutory-bodies/` | Constitutional & statutory bodies (EC, CAG, UPSC, FC, NHRC, CVC…) | 300 | `…:polity:ssc:statutory-bodies` | SSC CGL Constitutional & Statutory Bodies Questions with Answers \| MindGains | SSC CGL Constitutional & Statutory Bodies Questions |
| `/ssc/economy/budget-taxation/` | Budget, fiscal policy & taxation (GST, direct/indirect tax) | 300 | `…:economy:ssc:budget-taxation` | SSC CGL Budget, Taxation & Fiscal Policy Questions with Answers \| MindGains | SSC CGL Budget & Taxation Questions |
| `/ssc/history/art-culture/` | Indian art & culture (architecture, dance, music, painting, festivals) | 300 | `…:history:ssc:art-culture` | SSC CGL Art & Culture Questions with Answers \| MindGains | SSC CGL Art & Culture Questions |

---

## B. TOP-UP EXISTING (3) — expand to ≥300 Q

| Route | Now | Add | Note |
|---|---:|---:|---|
| `/ssc/english/synonyms-antonyms/` | 109 | +200 | already re-titled in Round 2; just needs depth |
| `/ssc/geography/world-geo/` | 149 | +160 | world physical + political + map-based |
| `/ssc/science/biology/` | 284 | +120 | human physiology, plant biology, nutrition, diseases |

---

## C. SOURCE GROUNDING (per subject)

| Subject | Primary sources |
|---|---|
| Quant / Reasoning | standard SSC quant/reasoning method sources; every problem fully worked in the explanation |
| English | standard grammar reference for rules; curated idiom/phrase list with attested meanings |
| GA-History / Art & Culture | NCERT VI–XII History + Fine Arts (XI); CCRT material for culture |
| GA-Polity | Laxmikanth *Indian Polity*; the bare Constitution for Articles |
| GA-Economy | NCERT XI–XII Economics; Union Budget & Economic Survey for current figures |
| GA-Geography | NCERT VI–XII Geography; Oxford School Atlas for map items |

---

## D. BUILD ORDER (by keyword upside × gap size)

1. **`/ssc/english/error-spotting/`, `/ssc/english/idioms-phrases/`** — 500 each; both are heavy in every SSC paper and both are total gaps.
2. **`/ssc/reasoning/classification/`, `/ssc/quant/mensuration/`** — 500 each; top-tested, currently absent.
3. Remaining reasoning gaps (ranking, cube-dice, missing-number, math-operations) — 300 each.
4. Remaining quant gaps (average, mixture-alligation, partnership) — 300 each.
5. Remaining English gaps (spelling, voice, narration) — 300 each.
6. GA gaps (fundamental-rights, statutory-bodies, budget-taxation, art-culture) — 300 each.
7. The 3 top-ups.

**Total new content:** ~6,000 questions (18 topics) + ~480 top-up = **~6,500 SSC questions** to reach syllabus-complete SSC CGL.

---

## E. When a batch is ready (publish steps — per topic)

1. Questions in Redis under the key above, passing all §3 QA gates in the brief.
2. Append the route → `{title, h1, description}` to `scripts/seo/round2-title-overrides.json`.
3. Add the topic card to the subject page + the "Popular topics" chip list on `/ssc/` where relevant (`build-exam-hubs.cjs`).
4. Add the URL to `sitemap.xml`.
5. `node scripts/build-public-quiz.cjs` (needs `MINDGAINS_ENV` pointing at the Redis creds) → `npx wrangler deploy`.

---

*UPSC and TNPSC build plans follow the same format — see `syllabus-gap-upsc.csv` (4 gap topics + the `/upsc/geography/environment-eco/` → `/upsc/environment/` merge) and `syllabus-gap-tnpsc.csv` (General Tamil expansion + Tamil-medium mirrors + 3 geography fills).*
