# Keyword Planner — Discover New Keywords, Round 2

**Date:** 2026-08-30
**Type:** READ / ANALYSIS ONLY. No production, route, metadata, sitemap, DB or Git changes.
**Purpose:** Round 1 (`kwp-export-2026-08-29.csv`) barely reached below the exam-hub tier. This round seeds **Google's "Discover New Keywords"** so Google expands a small number of broad seeds into the real search language for the **383 routes that already exist**. Existing-route optimisation first; gaps tracked separately (§ end).

**How to use:** For each batch, open Keyword Planner → **Discover New Keywords** → *Start with keywords* → set location **India**, language **English** (Tamil results still surface for TNPSC/Samacheer) → paste the newline-separated block → **Get results** → download the "Keyword ideas" CSV. Name each export `round2-batchNN.csv` and hand them back.

`Competition` / `Competition (indexed value)` in the exports are **Google Ads advertiser competition — NOT organic SEO difficulty.** Do not treat them as KD.

---

## TASK 1 — Current keyword coverage of the 383 existing routes

**Classification rule**
- **A — India volume already measured:** the route's proposed primary or a close variant (or an unambiguously on-route discovered term) appears in `kwp-export-2026-08-29.csv` with an `Avg. monthly searches` value.
- **B — keyword discovered, volume not measured:** Round-1 SERP research established a search-language phrasing *pattern* for the route (all 6 exam hubs, all 52 subject pages, all 117 NCERT/Samacheer class pages via the validated `class {N} {subject} mcq` / `{N}th {subject} book-back` idiom, and 7 individually SERP-checked topic pages), but there is no India KWP number.
- **C — poorly researched:** the route's proposed primary is derived only from its URL slug and was never checked against real search language, and has no KWP number.

| Class | Count | Which routes |
|---|---:|---|
| **A — India volume measured** | **5** | `/upsc/` ("upsc prelims practice questions" 500) · `/tnpsc/` ("tnpsc online test" 500) · `/ssc/` ("ssc cgl practice questions" 500) · `/ncert/` ("ncert class 10 science chapter 1 objective questions" 50) · `/ncert/science/class10/` ("ncert class 10 science mcq" 50) |
| **B — keyword discovered, not measured** | **178** | 2 exam hubs (`/rrb/`, `/samacheer/`) + all **52 subject** pages + all **117** NCERT/Samacheer class pages + 7 SERP-checked topics (`/upsc/polity/fundamental-rights/`, `/upsc/polity/dpsp/`, `/upsc/history/national-movement/`, `/tnpsc/tamil/thirukkural/`, `/tnpsc/history/freedom-struggle/`, `/ssc/quant/number-system/`, `/ssc/reasoning/syllogism/`) |
| **C — poorly researched** | **200** | the Quiz Hub (`/quiz/`) + **199 topic** pages whose primary is slug-derived only (e.g. `map-based`, `transport-infra`, `gupta-post-gupta`, `ezhuthu-ilakkanam`, `matrix-puzzle`, `non-verbal`, `porul-ilakkanam` …) |

**Coverage by exam** (A / B / C):

| Exam | A | B | C | total routes |
|---|---:|---:|---:|---:|
| UPSC | 1 | 19 | 51 | 71 |
| TNPSC | 1 | 16 | 75 | 92 |
| SSC | 1 | 18 | 35 | 54 |
| RRB | 0 | 6 | 15 | 21 |
| NCERT | 2 | 61 | 0 | 63 |
| Samacheer | 0 | 58 | 23 | 81 |
| (Quiz Hub) | 0 | 0 | 1 | 1 |

> Take-away: **95 % of the tree (378/383) has no India volume attached.** The subject + class tiers (`B`) have a defensible phrasing pattern and just need numbers; the topic tier (`C`) needs Google's expansion to tell us the real phrasing *and* the numbers. Both are what the batches below are for.

---

## TASK 2 / 3 — Paste blocks for Discover New Keywords

**15 batches = 15 manual Discover searches.** Each batch is 6–9 broad seeds; Google will fan each out into 100–1,000+ related ideas that collectively cover every route named under the batch. Seeds use the idiom that actually ranks for that content family (from Round-1 SERP research): UPSC → `mcq` / `previous year questions`; TNPSC → `questions and answers` / `online test` / `in tamil` / `group 4`; SSC → `questions` / `practice set`; RRB → `questions` / `railway`; NCERT → `class N … mcq` / `chapter wise`; Samacheer → `book back answers` / `important questions` / `online test`.

---

### BATCH 1 — UPSC POLITY
*Covers `/upsc/polity/` + constitution-features, constitutional-bodies, dpsp, executive, federalism, fundamental-rights, int-relations, judiciary, local-govt, parliament*

```
indian polity mcq for upsc
fundamental rights questions for upsc
directive principles mcq
indian constitution mcq for upsc prelims
parliament of india questions for upsc
indian polity previous year questions upsc
indian judiciary mcq
centre state relations upsc questions
indian polity quiz online
```

---

### BATCH 2 — UPSC HISTORY & ART/CULTURE
*Covers `/upsc/history/` + 1857-revolt, ancient-kingdoms, art-culture, british-conquest, gandhi-era, indus-valley, medieval-india, national-movement, post-1947, prehistoric, world-history*

```
modern history mcq for upsc
indian national movement questions for upsc
ancient history mcq for upsc prelims
art and culture mcq for upsc
medieval india history mcq
history previous year questions upsc prelims
world history mcq for upsc
freedom struggle mcq
```

---

### BATCH 3 — UPSC GEOGRAPHY & ENVIRONMENT
*Covers `/upsc/geography/` (agriculture-geo, climate, environment-eco, map-based, natural-resources, physical-india, physical-world, population, rivers-drainage, transport-infra) + `/upsc/environment/` (biodiversity, climate-change, ecology-basics, env-laws, pollution, protected-areas)*

```
geography mcq for upsc
indian geography mcq for upsc prelims
physical geography mcq for upsc
environment and ecology mcq for upsc
climate change mcq for upsc
indian rivers mcq
biodiversity and protected areas upsc mcq
geography previous year questions upsc
```

---

### BATCH 4 — UPSC ECONOMY & SCIENCE / TECHNOLOGY
*Covers `/upsc/economics/` (agriculture-eco, budget-fiscal, economic-reforms, industry-msme, inflation, money-banking, national-income, poverty-inclusion, trade-balance) + `/upsc/science/` (biology, biotech, chemistry, defence-tech, disease-health, energy, physics, space-tech)*

```
indian economy mcq for upsc
economy mcq for upsc prelims
inflation and monetary policy upsc questions
national income mcq
science and technology mcq for upsc
space technology mcq for upsc
biotechnology mcq for upsc prelims
indian economy previous year questions upsc
```

---

### BATCH 5 — UPSC CSAT
*Covers `/upsc/csat-quant/` (data-sufficiency, logical-reasoning, number-system, percentage, speed-distance, time-work) + `/upsc/csat-english/` (comprehension, logical-deduction)*

```
csat questions for upsc prelims
csat maths practice questions
csat reasoning questions
csat previous year questions
csat comprehension practice for upsc
data sufficiency questions for csat
number system questions for csat
csat paper 2 practice
```

---

### BATCH 6 — TNPSC POLITY & HISTORY
*Covers `/tnpsc/polity/` (constitution-making, dpsp, elections, fundamental-rights, governance, judiciary, local-bodies, parliament, preamble, president-pm, state-govt, tn-polity) + `/tnpsc/history/` (art-culture, british-rule, chola-pandya, freedom-struggle, gupta-post-gupta, indus-valley, jainism-buddhism, maratha, mauryan, medieval-india, mughal, post-independence, social-reform, tamil-history, vedic-age, vijayanagara)*

```
tnpsc polity questions and answers
indian polity questions for tnpsc group 4
tnpsc history questions in tamil
tamil nadu history questions for tnpsc
indian national movement questions for tnpsc
tnpsc polity online test in tamil
tnpsc history important questions
constitution of india tnpsc questions
```

---

### BATCH 7 — TNPSC GEOGRAPHY, SCIENCE & ECONOMY
*Covers `/tnpsc/geography/` (earth-universe, india-climate, india-physical, india-resources, india-rivers, india-soils, tn-districts, tn-geography, transport-trade, world-geography, world-oceans) + `/tnpsc/science/` (biology-cells, biology-human, biology-plants, chemistry-acids, chemistry-matter, chemistry-reactions, computer-basics, environment, physics-electricity, physics-motion, physics-optics, science-tech) + `/tnpsc/economics/` (agriculture, banking-finance, budget-taxation, current-schemes, industry, international-trade, national-income, planning, poverty-welfare, tn-economy)*

```
tnpsc geography questions and answers
tamil nadu geography questions for tnpsc
tnpsc general science important questions
general science questions for tnpsc group 4
tnpsc economics questions and answers
indian economy questions for tnpsc
tnpsc science online test in tamil
tnpsc geography questions in tamil
```

---

### BATCH 8 — TNPSC TAMIL & APTITUDE
*Covers `/tnpsc/tamil/` (bhakti-literature, epic-literature, ezhuthu-ilakkanam, modern-tamil, porul-ilakkanam, post-sangam, sangam, sol-ilakkanam, thirukkural, tolkappiyam) + `/tnpsc/maths/` (algebra, data-interpretation, geometry, hcf-lcm, number-system, percentage, profit-loss, ratio-proportion, series, simple-interest, simplification, time-distance, time-work)*

```
tnpsc general tamil questions and answers
thirukkural questions for tnpsc
tamil ilakkanam questions for tnpsc
sangam literature questions tnpsc
tnpsc aptitude and mental ability questions
aptitude questions for tnpsc group 4 in tamil
tnpsc maths questions with answers
general tamil online test for tnpsc
```

---

### BATCH 9 — SSC QUANT & REASONING
*Covers `/ssc/quant/` (algebra, geometry, number-system, percentage, profit-loss, ratio-proportion, si-ci, simplification, speed-distance, statistics, time-work, trigonometry) + `/ssc/reasoning/` (analogy, blood-relations, coding-decoding, direction-sense, matrix-puzzle, non-verbal, series, syllogism, venn-diagram)*

```
ssc cgl maths questions
quantitative aptitude questions for ssc cgl
ssc cgl reasoning questions
reasoning questions for ssc cgl with answers
number system questions for ssc cgl
coding decoding questions for ssc
syllogism questions for ssc
ssc cgl maths practice set
```

---

### BATCH 10 — SSC ENGLISH & GENERAL AWARENESS
*Covers `/ssc/english/` (cloze-test, comprehension, fill-blanks, grammar, one-word, sentence-correction, synonyms-antonyms, vocabulary) + `/ssc/history/` (ancient, medieval, modern, world) + `/ssc/polity/` (constitution, current-gk, governance) + `/ssc/geography/` (environment, india-geo, world-geo) + `/ssc/science/` (biology, chemistry, physics, science-tech) + `/ssc/economy/` (banking, economy)*

```
ssc cgl english questions
english grammar questions for ssc cgl
one word substitution for ssc cgl
ssc cgl general awareness questions
ssc gk gs questions
indian polity questions for ssc cgl
general science questions for ssc cgl
history questions for ssc cgl
```

---

### BATCH 11 — RRB / RAILWAY (all subjects)
*Covers `/rrb/maths/` (algebra, arithmetic, geometry, number-system, statistics, time-work) + `/rrb/reasoning/` (coding, direction, series) + `/rrb/science/` (biology, chemistry, physics) + `/rrb/general-aware/` (current-affairs, sports-awards) + `/rrb/polity/`*

```
rrb ntpc maths questions
railway maths questions with answers
rrb ntpc reasoning questions
rrb group d general science questions
rrb ntpc general awareness questions
rrb ntpc gk questions
railway exam questions in hindi
rrb ntpc previous year questions
```

---

### BATCH 12 — NCERT SCIENCE, MATHS & SOCIAL SCIENCE (Class 6–10)
*Covers `/ncert/science/class6..10/`, `/ncert/maths/class6..10/`, `/ncert/social-science/class6..10/` + subject hubs*

```
class 10 science mcq chapter wise
cbse class 9 science mcq
mcq questions for class 8 science with answers
class 10 maths mcq chapter wise
class 7 social science mcq
ncert class 6 science mcq
class 10 science important questions with answers
class 10 social science mcq with answers
```

---

### BATCH 13 — NCERT CLASS 11–12 (Biology, Chemistry, Physics, Economics) + NEET
*Covers `/ncert/biology/class11..12/`, `/ncert/chemistry/class11..12/`, `/ncert/physics/class11..12/`, `/ncert/economics/class9..12/`*

```
class 11 biology mcq chapter wise
class 12 biology mcq for neet
class 11 chemistry mcq chapter wise
class 12 chemistry mcq with answers
class 11 physics mcq
class 12 physics mcq chapter wise
ncert class 11 biology mcq for neet
class 12 economics mcq chapter wise
```

---

### BATCH 14 — NCERT HISTORY, GEOGRAPHY, POLITY, ENGLISH (Class 6–12)
*Covers `/ncert/history/class6..12/`, `/ncert/geography/class6..12/`, `/ncert/polity/class6..12/`, `/ncert/english/class6..10/`*

```
class 9 history mcq chapter wise
class 10 history mcq with answers
class 11 geography mcq chapter wise
class 8 geography mcq
class 11 political science mcq
class 10 civics mcq chapter wise
ncert class 12 political science mcq
class 10 english mcq with answers
```

---

### BATCH 15 — SAMACHEER KALVI (all classes & subjects)
*Covers every `/samacheer/{subject}/class{N}/` — tamil, english, maths, science, social-science, physics, chemistry, biology, computer, economics, geography, history, polity*

```
samacheer kalvi 10th science book back answers
10th social science important questions samacheer
samacheer kalvi 12th chemistry book back questions
9th samacheer science important questions
samacheer kalvi 10th tamil book back answers
samacheer kalvi online test
6th tamil online test tnpsc
samacheer kalvi 11th biology book back answers
samacheer kalvi guide answers
```

---

## TASK 3 — What you paste, in order

| # | Batch | Discover search | Existing routes it covers |
|---|---|---|---:|
| 1 | UPSC Polity | 1 | 11 |
| 2 | UPSC History & Culture | 1 | 12 |
| 3 | UPSC Geography & Environment | 1 | 18 |
| 4 | UPSC Economy & Science/Tech | 1 | 19 |
| 5 | UPSC CSAT | 1 | 10 |
| 6 | TNPSC Polity & History | 1 | 30 |
| 7 | TNPSC Geography, Science & Economy | 1 | 36 |
| 8 | TNPSC Tamil & Aptitude | 1 | 25 |
| 9 | SSC Quant & Reasoning | 1 | 23 |
| 10 | SSC English & General Awareness | 1 | 30 |
| 11 | RRB / Railway (all) | 1 | 21 |
| 12 | NCERT Science/Maths/SocSci 6–10 | 1 | 18 |
| 13 | NCERT Class 11–12 + NEET | 1 | 14 |
| 14 | NCERT History/Geo/Polity/English | 1 | 30 |
| 15 | Samacheer (all) | 1 | 81 |
| | **TOTAL** | **15 Discover searches** | **all 383** (5 already in class A) |

Each export back should be named `round2-batch01.csv` … `round2-batch15.csv`.

---

## TASK 4 — Potential search-surface gaps (DO NOT create anything)

A gap = real/strongly-suggested student intent + no existing route owns it + MindGains already has, or could genuinely provide, the content. **No routes, titles, H1s, sitemap or schema are being touched.**

| # | Gap | Evidence | Content MindGains has | Note |
|---|---|---|---|---|
| G1 | **SSC "General Awareness" umbrella** (no `/ssc/general-awareness/`) | Round-1 KWP: "ssc cgl general awareness questions", "ssc gk gs questions" cluster; 5 SSC GK subject pages exist but no umbrella | the SSC GK question pool already powers `/ssc/history,polity,geography,science,economy/` | umbrella page only; children stay as topics |
| G2 | **TNPSC group *syllabus* hubs** (`/tnpsc/group-4/`, `/tnpsc/group-2/`) | Round-1 KWP: "group 4 model question paper online test" 5,000/mo; "mock test for tnpsc group 4", "tnpsc group 2 practice test" 500-cluster | generic TNPSC topic practice (38k) + editorial group→subject syllabus map (would need writing) | **syllabus-navigation only** — never a group question-split; questions are not group-specific |
| G3 | **SSC practice-paper / full-mock surface** (`/ssc/practice-papers/` or hub wording) | Round-1 KWP: "cgl practice paper", "ssc exam practice paper", "ssc exam sample paper" — 5,000/mo each | generic SSC pool can assemble sectional/full sets; app already has `assembleMock` | SERP is PDF-leaning; partial capture only |
| G4 | **NCERT chapter tier** (routes stop at `class{N}`) | Round-1 + SERP: "photosynthesis class 11 mcq", "life processes class 10 mcq", "the french revolution class 9 mcq" — chapter is the money phrase | ~23k NCERT questions exist **but carry no `chapter` field** | **content gap** — needs question re-tagging before any chapter route is possible |
| G5 | **Samacheer "book back answers" framing** | Round-1 + SERP: "samacheer kalvi 10th science book back answers", "{class}th {subject} book back questions" dominate TN-board SERPs | the **Android app genuinely provides book-back Q&A** for NCERT & Samacheer (confirmed) | current Samacheer routes are MCQ-framed; this is a wording/positioning gap, not a new tree |
| G6 | **"{exam} syllabus" informational** | "upsc prelims syllabus" ~168K/mo (Round-1 anchor); "tnpsc group 4 syllabus", "ssc cgl syllabus" | none yet — editorial to be written | editorial layer, never a hub; links down into existing routes |
| G7 | **Current-affairs quiz surface** | "current affairs for upsc", "daily current affairs quiz" — daily-quiz SERP | `/daily-dose/` exists (1 thin page); `current_affairs` question pool exists in Redis | positioning/expansion of an existing page, not a new tree |
| G8 | **Know-Your-India entity pages** | "{constituency} mla", "{state} capital and facts", "{state} gk for tnpsc" | **816 MLA + 529 MP + 36 state** records already shipped as JSON, collapsed into one `/know-your-india/` page | large existing-data surface; templating decision, out of scope here |
| — | **PARKED — VERIFIED PYQ SURFACE** | Supabase `pyq_verified_clean`: 3,463 verified TNPSC PYQs, group + year tagged (`/tnpsc/{group}/pyq/…`) | verified PYQ archive (separate corpus) | **Parked by instruction. Not part of this round. Do not reopen.** |

---

## Deliverables recap

1. **`scripts/seo/kwp-discover-round-2.md`** — this file (15 paste blocks).
2. **Coverage summary:** A = **5** · B = **178** · C = **200** (of 383 existing routes).
3. **Keyword Planner Discover searches to run:** **15**.
4. **Potential gaps:** G1–G8 above, plus the parked verified-PYQ surface — all clearly separated from existing-route optimisation, nothing created.

*READ / ANALYSIS ONLY. No production changes, no route creation, no metadata/sitemap/DB changes, no Git.*
