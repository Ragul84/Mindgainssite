# MindGains SEO — Round-2 Route↔Keyword Mapping Report

**Date:** 2026-08-30
**Type:** READ / ANALYSIS ONLY. No production pages, metadata, routes, sitemap, question data or Git touched. No SEO implemented.
**Inputs:** 15 Google Keyword Planner *Discover New Keywords* exports (India) from this session, staged at `scripts/seo/kwp-round2/batch01…batch15.csv`, **plus** the Round-1 export `scripts/seo/kwp-export-2026-08-29.csv`.
**Outputs:** `scripts/seo/round2-route-keyword-map.csv` (one row per existing route) · `scripts/seo/round2-keyword-gaps.csv` · this report.

---

## EXECUTIVE VERDICT

| Question | Answer |
|---|---|
| **Canonical routes that exist** | **383** — 1 Quiz Hub · 6 exam hubs · 52 subject · 118 NCERT/Samacheer class · 206 topic. (Confirmed from `assets/quiz-index.json`; matches the earlier audit.) |
| **Routes with a strong measured primary** (≥50/mo, on-intent) | **119 (31 %)** — but only **~30** of those have a primary at 500/mo or above, and **only 17 rate HIGH opportunity**. |
| **Routes with only a weak/low-volume opportunity** (<50/mo) | **13** |
| **Routes with NO worthwhile measured query** | **251 (66 %)** — `NO_STRONG_MEASURED_QUERY` |
| **20 strongest existing-route opportunities** | see §7 — dominated by **SSC quant/reasoning topic pages** (5,000-bucket "…questions"), SSC/RRB subject pages, `/upsc/polity/fundamental-rights/`, a handful of TNPSC topic pages, 3 NCERT class pages. |
| **20 strongest genuine gaps** | see §8 — **RRB previous-year question paper (50,000/mo)**, railway/RRB question-paper-PDF cluster (5,000/mo ×40+), UPSC CSAT PYQ/paper cluster (5,000/mo ×15), **SSC "General Awareness" umbrella** (5,000/mo, no route), verified-PYQ surface (PARKED), NCERT chapter level, mock-test surface. |
| **Where cannibalisation is most dangerous** | (1) exam hub ↔ subject page both able to own `"{exam} {subject} questions"` (SSC, TNPSC, RRB); (2) `/rrb/polity/polity/` is a degenerate duplicate of `/rrb/polity/`; (3) 4 confirmed same-primary conflicts in UPSC CSAT and UPSC Environment (§6). |
| **Which pages to optimise first** | the **17 HIGH-opportunity routes** in §9 — almost all SSC quant/reasoning/science topic pages plus `/upsc/polity/fundamental-rights/` and 3 TNPSC topic pages. Fast, low-competition, exact content fit. |

**The single most important finding:** Round-2 *Discover* was asked to expand 15 broad seed sets. **Five of the fifteen barely expanded** — UPSC batches 1–4, TNPSC batches 6–7, NCERT batches 12–14, and especially **Samacheer (batch 15 returned only 8 keyword rows)**. The high `NO_STRONG_MEASURED_QUERY` count for those tiers is largely an artefact of Google not returning ideas, **not** proof that demand is absent. Those tiers need a re-pull (broader seeds, or a direct volume tool). See §10.

**Second most important:** of ~8,000 keyword ideas Google returned, **roughly half carry PYQ, question-paper-PDF or mock-test intent** — intents that must **not** be assigned to generic practice pages. That is why two-thirds of routes have no assignable primary, and why the gaps list is large.

---

## 1. Method

1. **Parsed all 15 exports** (UTF-16LE, tab-separated, 2 preamble lines before the header). Kept Keyword, Avg. monthly searches, Three-month change, YoY change, Competition, Competition (indexed value), Top-of-page bids.
2. **Folded in Round-1** (`kwp-export-2026-08-29.csv`, 900 rows) so the exam-hub tier — which Round-2 did not target — still has coverage.
3. **Normalised & de-duplicated:** trimmed, lower-cased, collapsed whitespace; kept the highest-volume record per keyword and merged its batch tags; preserved original text.
4. **Classified every keyword by intent** (§4) before any mapping.
5. **Reconstructed the route tree** from `assets/quiz-index.json` (authoritative).
6. **Scored keyword↔route fit** = f(intent alignment with route type, token match on exam + subject + topic/class, log volume, keyword specificity) with hard gates: wrong exam → reject; wrong class number → reject; topic slug words absent → reject; PYQ / question-paper-PDF / mock-test / syllabus / current-affairs / textbook-solutions / chapter-specific intent → **never eligible as a primary** (routed to gaps instead).
7. **Picked one primary + up to 4 secondaries** per route; allowed `NO_STRONG_MEASURED_QUERY`.
8. **Cannibalisation pass** across the hierarchy; owner = most specific route type.
9. **Opportunity rating** HIGH/MEDIUM/LOW from defensible signals only (volume, specificity/long-tail, parent-vs-child competition, content depth). **No fabricated KD.** Google Ads "Competition" is recorded but labelled *advertiser* competition, never SEO difficulty.

---

## 2. Merged keyword pool — statistics

| Metric | Value |
|---|---:|
| Raw rows, 15 Round-2 exports | 7,556 |
| Raw rows, Round-1 export (folded in) | 900 |
| **Total raw rows** | **8,456** |
| **Unique keywords** | **8,072** |
| Exact-duplicate rows removed | 384 |
| Keywords with measurable Avg. monthly searches (>0) | 7,617 |
| Keywords with blank / zero volume | 455 |

**Volume buckets (unique keywords):**

| Bucket (Avg. monthly searches) | Count | Share |
|---|---:|---:|
| 50 | 6,716 | 83 % |
| 500 | 749 | 9 % |
| 5,000 | 149 | 1.8 % |
| 50,000 | 3 | — |
| 0 / blank | 455 | 5.6 % |

> Volumes are KWP **buckets**, not traffic forecasts. A "50" may be 10–90/mo. The three 50,000 rows are all RRB PYQ / answer-key.

**Rows per research batch (before de-dup):**

| Batch | Rows | Batch | Rows |
|---|---:|---|---:|
| 01 UPSC Polity | 99 | 09 SSC Quant/Reasoning | 566 |
| 02 UPSC History/Culture | 112 | 10 SSC English/GA | 407 |
| 03 UPSC Geography/Environment | 230 | 11 RRB | **3,793** |
| 04 UPSC Economy/Sci-Tech | **31** | 12 NCERT 6–10 | 76 |
| 05 UPSC CSAT | 631 | 13 NCERT 11–12 / NEET | 85 |
| 06 TNPSC Polity/History | **59** | 14 NCERT Hist/Geo/Pol/Eng | 117 |
| 07 TNPSC Geo/Sci/Economy | **78** | 15 Samacheer | **8** |
| 08 TNPSC Tamil/Aptitude | 1,264 | round1 (folded) | 900 |

**Bold = under-expanded.** RRB and TNPSC-Tamil over-expanded; UPSC subject/topic, TNPSC GS subjects, NCERT and Samacheer barely expanded.

---

## 3. Route tree (authoritative)

| Route type | Count |
|---|---:|
| Quiz Hub (`/quiz/`) | 1 |
| Exam hub (`/{exam}/`) | 6 |
| Subject (`/{exam}/{subject}/`) | 52 |
| NCERT/Samacheer class (`/{ncert\|samacheer}/{subject}/class{N}/`) | 118 |
| Topic (`/{exam}/{subject}/{topic}/`) | 206 |
| **Total** | **383** |

---

## 4. Intent classification of the merged pool

| Intent | Unique keywords | Assignable to a generic practice route? |
|---|---:|---|
| question-paper-pdf | 2,351 | **No** — web quiz is not a downloadable paper |
| other / ambiguous | 1,814 | case-by-case (mostly no) |
| pyq (previous-year) | 1,266 | **No** — generic pages hold practice MCQs, not verified PYQs |
| questions ("{x} questions") | 801 | **Yes** — native Indian phrasing for subject/topic pages |
| mock-test / test-series | 620 | **No** — a quiz is not a full timed mock |
| online-test | 382 | Yes (hub / subject) |
| exam-practice ("practice questions/set", "important questions") | 346 | Yes |
| mcq | 287 | Yes |
| textbook-class-mcq ("class N … mcq") | 96 | Yes (class pages) |
| chapter-specific ("… chapter 1 mcq", "unit 7") | 51 | **No route exists** — NCERT/Samacheer stop at class |
| current-affairs | 19 | **No** — `/daily-dose/` not positioned |
| syllabus-info | 16 | **No** — informational, not a quiz |
| quiz | 19 | Yes |
| textbook-solutions ("book back answers", "guide") | 4 | Only where the page truly reproduces book-back exercises |

**≈ 4,900 of 8,072 unique keywords (61 %)** are PYQ / question-paper-PDF / mock-test / other — i.e. cannot become a primary for the existing quiz tree. This is the structural reason coverage looks thin.

---

## 5. Route coverage — results

| | Strong primary (≥50/mo, on-intent) | Weak (<50/mo) | NO_STRONG_MEASURED_QUERY | Total |
|---|---:|---:|---:|---:|
| **UPSC** | 20 | 6 | 45 | 71 |
| **TNPSC** | 19 | 3 | 70 | 92 |
| **SSC** | 25 | 0 | 29 | 54 |
| **RRB** | 14 | 0 | 7 | 21 |
| **NCERT** | 41 | 1 | 21 | 63 |
| **Samacheer** | 0 | 3 | 78 | 81 |
| **Quiz Hub** | 0 | 0 | 1 | 1 |
| **TOTAL** | **119** | **13** | **251** | **383** |

**Opportunity bands (all 383):** HIGH 17 · MEDIUM 83 · LOW 283.

`NO_STRONG_MEASURED_QUERY` by exam × tier: samacheer/class 65 · upsc/topic 45 · samacheer/subject 12 · tnpsc/topic 70 · ssc/topic 25 · ncert/class 19 · rrb/topic 7 · samacheer/exam-hub 1 · ncert/exam-hub 1 · ncert/subject 1 · ssc/subject 4 · quiz-hub 1.

Read that against §2: the tiers with the most `NO_STRONG` are exactly the tiers whose Discover batches under-expanded. **Samacheer (0 strong / 81) is not a real "no demand" result — batch 15 returned 8 rows.**

---

## 6. Cannibalisation

Only **4 confirmed same-primary conflicts** after strict token gating:

| Shared primary | Competing routes | Recommended owner |
|---|---|---|
| `upsc csat reasoning questions` | `/upsc/csat-quant/` , `/upsc/csat-english/` | `/upsc/csat-quant/` owns it; `/upsc/csat-english/` should target a *comprehension* phrase (none measured — mark `NO_STRONG`) |
| `environment and ecology mcq for upsc` | `/upsc/environment/` , `/upsc/geography/environment-eco/` | `/upsc/environment/` (subject). The geography topic `environment-eco` is a near-duplicate — candidate to de-index or internal-link only. |
| `biodiversity and protected areas upsc mcq` | `/upsc/environment/biodiversity/` , `/upsc/environment/protected-areas/` | split — biodiversity page targets "biodiversity mcq upsc", protected-areas targets "protected areas / national parks mcq upsc" (both currently unmeasured) |
| `polity mcq for rrb ntpc` | `/rrb/polity/` , `/rrb/polity/polity/` | `/rrb/polity/` (subject). **`/rrb/polity/polity/` is a degenerate `slug/slug` route** — structural redundancy, flag for merge. |

**Structural risk (not yet a conflict, but likely once volumes fill in):** for SSC, TNPSC and RRB the exam hub and its subject pages can both plausibly own `"{exam} {subject} questions"`. Keep the hub on the broad practice/online-test term (§7) and let subject pages own the subject phrase.

---

## 7. Top 20 existing-route opportunities

*(strong measured primary, non-hub, ranked by volume then specificity — full data in `round2-route-keyword-map.csv`)*

| # | Route | Primary keyword | Vol/mo | Intent | Opp. |
|---|---|---|---:|---|---|
| 1 | `/ssc/quant/trigonometry/` | ssc cgl trigonometry questions | 5,000 | questions | HIGH |
| 2 | `/ssc/quant/percentage/` | ssc cgl percentage questions | 5,000 | questions | HIGH |
| 3 | `/ssc/quant/number-system/` | ssc cgl number system questions | 5,000 | questions | HIGH |
| 4 | `/ssc/quant/algebra/` | algebra cgl questions | 5,000 | questions | HIGH |
| 5 | `/ssc/reasoning/` | ssc cgl reasoning questions | 5,000 | questions | MEDIUM |
| 6 | `/ssc/quant/` | ssc cgl maths questions | 5,000 | questions | MEDIUM |
| 7 | `/ssc/english/` | ssc cgl english questions | 5,000 | questions | MEDIUM |
| 8 | `/tnpsc/maths/` | tnpsc maths questions | 5,000 | questions | MEDIUM |
| 9 | `/rrb/maths/` | rrb ntpc maths questions | 5,000 | questions | MEDIUM |
| 10 | `/rrb/reasoning/` | ntpc reasoning questions | 5,000 | questions | MEDIUM |
| 11 | `/upsc/polity/fundamental-rights/` | fundamental rights mcq upsc | 500 | mcq | HIGH |
| 12 | `/tnpsc/polity/tn-polity/` | polity questions for tnpsc | 500 | questions | HIGH |
| 13 | `/tnpsc/geography/tn-geography/` | tnpsc group 1 geography questions | 500 | questions | HIGH |
| 14 | `/tnpsc/maths/simplification/` | simplification questions for tnpsc | 500 | questions | HIGH |
| 15 | `/ssc/science/biology/` | biology questions for ssc cgl | 500 | questions | HIGH |
| 16 | `/ssc/reasoning/coding-decoding/` | ssc cgl coding decoding questions | 500 | questions | HIGH |
| 17 | `/ssc/reasoning/analogy/` | ssc cgl analogy questions | 500 | questions | HIGH |
| 18 | `/ssc/quant/time-work/` | time and work questions for ssc cgl | 500 | questions | HIGH |
| 19 | `/ssc/quant/geometry/` | geometry questions for ssc cgl | 500 | questions | HIGH |
| 20 | `/ncert/science/class8/` | mcq questions for class 8 science ncert | 500 | textbook-class-mcq | HIGH |

Runner-ups worth noting: `/ncert/science/class6/`, `/ncert/maths/class9/` (500, HIGH); `/upsc/geography/`, `/upsc/history/` (500, "modern history mcq upsc" / "geography mcq for upsc", MEDIUM); `/tnpsc/polity/`, `/tnpsc/geography/`, `/tnpsc/tamil/` (500, MEDIUM); `/rrb/general-aware/`, `/rrb/science/` (500, MEDIUM).

**Pattern:** the reliable wins are **SSC (and RRB) subject + skill-topic pages**, where the native query is literally `"{exam} {topic} questions"` at the 500–5,000 bucket with low ads competition and exact content fit.

---

## 8. Top 20 genuine gaps (no existing route should own these)

*(full list — 400 rows — in `round2-keyword-gaps.csv`)*

| # | Keyword | Vol/mo | Intent | Closest route | Why not satisfied | Future page type | Priority |
|---|---|---:|---|---|---|---|---|
| 1 | rrb ntpc previous year question paper | **50,000** | pyq | `/rrb/` | practice MCQs ≠ verified PYQs | PARKED verified-PYQ / paper archive | HIGH |
| 2 | rrb gr d previous year question paper | **50,000** | pyq | `/rrb/` | same | same | HIGH |
| 3 | ntpc answer key | **50,000** | other/results | `/rrb/` | not a results/answer-key service | out of scope | — |
| 4 | rrb group d question paper (pdf, +2018, +hindi, +kannada …) | 5,000 ×~30 | question-paper-pdf | `/rrb/` | web quiz is not a downloadable paper | paper-PDF index **only if papers are hosted** | MEDIUM |
| 5 | csat previous year question paper / csat pyq / upsc csat pyq | 5,000 ×~8 | pyq | `/upsc/csat-quant/` | practice ≠ PYQ | PARKED verified-PYQ (UPSC) | HIGH |
| 6 | csat question paper / upsc prelims csat question paper | 5,000 ×~5 | question-paper-pdf | `/upsc/csat-quant/` | PDF intent | paper-PDF landing (if hosted) | MEDIUM |
| 7 | ssc cgl general awareness questions / ssc cgl gk questions / gk questions for ssc cgl | 5,000 ×~10 | questions | *(none)* | **no `/ssc/general-awareness/` umbrella route** — GK is split across 5 subject pages | **new SSC General Awareness umbrella page** (content already exists) | HIGH |
| 8 | dice questions for ssc cgl | 5,000 | questions | `/ssc/reasoning/` | no `/ssc/reasoning/dice/` topic route | new reasoning topic page (content: SSC reasoning pool) | MEDIUM |
| 9 | geography pyq upsc prelims | 5,000 | pyq | `/upsc/geography/` | practice ≠ PYQ | PARKED verified-PYQ (UPSC) | MEDIUM |
| 10 | tnpsc past question papers / tnpsc previous year question paper | 5,000 cluster | pyq / pdf | `/tnpsc/` | practice ≠ PYQ; not a paper archive | PARKED verified-PYQ (TNPSC — 3,463 Qs exist) | HIGH |
| 11 | ssc exam sample paper / ssc cgl math paper | 5,000 | question-paper-pdf | `/ssc/` | PDF/full-paper intent | SSC practice-paper / full-mock surface | MEDIUM |
| 12 | rrb ntpc cbt 1 question paper pdf download | 5,000 | question-paper-pdf | `/rrb/` | PDF intent | paper-PDF index (if hosted) | LOW |
| 13 | indian constitution quiz | 5,000 | quiz | `/upsc/polity/` or `/tnpsc/polity/` | generic (no exam qualifier); borderline — could be a light secondary on a polity page | review as secondary | LOW |
| 14 | mock test for tnpsc group 4 / tnpsc group 2 practice test | 500 cluster | mock-test | `/tnpsc/` | a quiz is not a full timed mock | dedicated mock surface (`assembleMock` exists) | MEDIUM |
| 15 | *(chapter-level)* "ncert mcq class 8 history chapter 1", "life processes class 10 mcq" etc. | 50–5,000 | chapter-specific | `/ncert/{subject}/class{N}/` | routes stop at class; **questions carry no chapter tag** | chapter MCQ pages — **needs question re-tagging first** | MEDIUM |
| 16 | samacheer kalvi …book back answers | *(under-measured — batch 15 = 8 rows)* | textbook-solutions | `/samacheer/{subject}/class{N}/` | pages are MCQ-framed; app genuinely has book-back Q&A | book-back answers layer / wording | MEDIUM |
| 17 | current affairs for upsc / daily current affairs quiz | *(few rows; informational)* | current-affairs | `/daily-dose/` | thin, not positioned | current-affairs quiz surface | LOW |
| 18 | upsc prelims syllabus / ssc cgl syllabus / tnpsc group 4 syllabus | *(few rows)* | syllabus-info | `/{exam}/` | informational, not a quiz | editorial syllabus guides | LOW |
| 19 | staff selection commission maths question paper | 5,000 | question-paper-pdf | `/ssc/quant/` | PDF intent | — | LOW |
| 20 | railway examination question paper (hindi/regional) | 5,000 cluster | question-paper-pdf | `/rrb/` | PDF + regional-language intent | — | LOW |

**Gap clusters (keywords with ≥500/mo):** other 127 · pyq 96 · question-paper-pdf 92 · questions 51 · mock-test 11 · exam-practice 10.

**PARKED — VERIFIED PYQ SURFACE:** every `pyq` gap above resolves to the separate Supabase `pyq_verified_clean` corpus (3,463 verified TNPSC PYQs already inventoried; UPSC 953; SSC 647; RRB has the largest *demand* but was not in that inventory). Recorded as demand only. **Do not reopen. Do not assign PYQ keywords to any generic route.**

---

## 9. Which pages to optimise first (the 17 HIGH-opportunity routes)

All have: exact content fit, a measured primary at 500–5,000/mo, low Google-Ads competition, long-tail specificity, and no cannibalisation.

```
/ssc/quant/algebra/            algebra cgl questions                 5000
/ssc/quant/number-system/      ssc cgl number system questions       5000
/ssc/quant/percentage/         ssc cgl percentage questions          5000
/ssc/quant/trigonometry/       ssc cgl trigonometry questions        5000
/ssc/quant/geometry/           geometry questions for ssc cgl         500
/ssc/quant/ratio-proportion/   ssc cgl ratio and proportion questions 500
/ssc/quant/time-work/          time and work questions for ssc cgl    500
/ssc/reasoning/analogy/        ssc cgl analogy questions              500
/ssc/reasoning/coding-decoding/ ssc cgl coding decoding questions     500
/ssc/science/biology/          biology questions for ssc cgl          500
/upsc/polity/fundamental-rights/ fundamental rights mcq upsc          500
/tnpsc/polity/tn-polity/       polity questions for tnpsc             500
/tnpsc/geography/tn-geography/  tnpsc group 1 geography questions      500
/tnpsc/maths/simplification/   simplification questions for tnpsc     500
/ncert/science/class6/         mcq questions for class 6 science ncert 500
/ncert/science/class8/         mcq questions for class 8 science ncert 500
/ncert/maths/class9/           mcqs of class 9 maths                   500
```

These are the routes where a title/H1 + on-page tweak has the best measured-upside-per-effort. **Do not change them yet — this is the recommendation, awaiting approval.**

---

## 10. Round-2 re-pull needed (before those tiers can be mapped)

The following tiers are `NO_STRONG_MEASURED_QUERY` mainly because Discover under-expanded, not because demand is absent:

| Tier | Round-2 batch rows | Action |
|---|---:|---|
| **Samacheer (all 81 routes)** | 8 | **Re-pull with different seeds** — "samacheer kalvi guide", "{class}th {subject} book back answers", "{class}th {subject} solutions", per class; or use a direct volume tool. |
| **UPSC subject/topic (polity, history, geo, economy, sci-tech)** | 99 / 112 / 230 / 31 | Re-seed each subject individually with `{topic} mcq upsc` for its *actual* topic slugs (Discover expanded broad seeds poorly here). |
| **TNPSC GS subjects (polity, history, geo, science, economy)** | 59 / 78 | Re-seed per subject + `in tamil` + `group 2 / group 4`. |
| **NCERT class×subject (6–12)** | 76 / 85 / 117 | Re-seed per class-band (`class 6 mcq`, `class 9 mcq`, `class 11 mcq`) rather than mixed. |

RRB, SSC, TNPSC-Tamil and UPSC-CSAT expanded fine and do not need a re-pull.

---

## 11. Output files

| File | Rows | Contents |
|---|---:|---|
| `scripts/seo/round2-route-keyword-map.csv` | 383 | one row per canonical route: `route, route_type, exam, subject, topic_or_class, primary_keyword, primary_volume, primary_intent, secondary_keywords, secondary_volumes, content_fit, organic_opportunity, confidence, cannibalization_flag, competing_route, recommended_title_draft, recommended_h1_draft, reason, notes`. **Title/H1 columns are DRAFTS — not for implementation.** |
| `scripts/seo/round2-keyword-gaps.csv` | 400 | `keyword, volume, intent, ads_competition, ads_comp_indexed, closest_existing_route, why_not_satisfied, recommended_future_page_type, priority, batch` |
| `scripts/seo/kwp-round2/batch01…15.csv` | — | the 15 raw Discover exports, converted to UTF-8, batch-named |

---

## FINAL

Nothing has been optimised. `NO_STRONG_MEASURED_QUERY` is recorded honestly wherever Discover gave nothing usable; no volume was invented; PYQ / paper / mock intent was kept out of the generic route map and logged as demand only. **Awaiting your review of the mapping before any production SEO change.**
