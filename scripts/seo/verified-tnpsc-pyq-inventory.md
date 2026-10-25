# Verified TNPSC PYQ Corpus — Completeness Inventory

**Date:** 2026-08-30
**Type:** READ-ONLY. Supabase: `GET` (PostgREST select, paginated) only. Local file reads in `C:\mindwhite\tmp-pyq\tnpsc\`. No writes, no routes, no metadata, no Git.
**Scope:** ONLY the genuine Supabase verified PYQ archive — `pyq_verified_clean`, `exam = TNPSC`.
**Explicitly excluded:** Redis `miga:pyq:*` (AI-generated, mislabelled "verified"); the ~38,095 generic Quiz Hub questions (`quiz:subject:tnpsc:*`).

---

## 0. Method

- Pulled **all 3,463** `pyq_verified_clean` rows for `exam=eq.TNPSC`, paginated with the PostgREST `Range` header in 1,000-row pages (4 pages), fields `id, source_id, year, subject, topic, question_number, nullified, accepted_answers`.
- Grouped by `source_id` regex (`group[- ]?N[a]?`, `acf`, `ccse-3`, `vao`).
- Per paper: verified count, `question_number` min–max, gaps inside that range, `nullified` count, "multi-answer" = rows where `accepted_answers` has > 1 entry, and the `subject` distribution.
- **Expected paper size is NOT guessed.** It is established from (a) the archive's own question numbering (papers that run q1–200 or pair a q1–100 half with a q101–200 half), and (b) authoritative project transcriptions/PDFs in `C:\mindwhite\tmp-pyq\tnpsc\`:
  - `2021-group1-questions.json`, `2022-group1-questions.json`, `2024-group1-questions.json` — **200 records each** → TNPSC Group 1 Prelims = **200 Q** (single combined paper).
  - `2023-acf-questions.json` — **200 records** → ACF Prelims = **200 Q**.
  - `2019-group4-questions.json`, `2022-group4-questions.json` — **100 records each**; plus `2019-group4-gs-paper.pdf` + `2019-group4-tamil-paper.pdf` → Group 4 Prelims = **GS/English 100 (q101–200) + General Tamil 100 (q1–100) = 200 Q**.
  - `2022-group2-gs-paper.pdf` + `2024-group2-tamil-*.pdf`, `2024-group2-questions.json` (100) → Group 2 / 2A Prelims = **GS 100 + General Tamil 100 = 200 Q**.
- **Completeness bands** (against the established size): COMPLETE ≥ ~98% with only isolated gaps · NEAR-COMPLETE ~90–97% · PARTIAL ~40–89% (typically exactly one 100-Q half present) · VERY THIN < ~40%.

---

## 1. Groups discovered in `pyq_verified_clean` (TNPSC)

| Group | Verified PYQs | Distinct `source_id` | Exam years |
|---|---:|---:|---|
| **Group 1** | 1,597 | 8 | 2013, 2014, 2015, 2017, 2019, 2021, 2022, 2024 |
| **Group 4** | 989 | 10 | 2013, 2014, 2016, 2018, 2019, 2022, 2025 |
| **Group 2** | 637 | 7 | 2014, 2015, 2018, 2022, 2024 |
| **ACF** (Assistant Conservator of Forests) | 200 | 1 | 2023 |
| **Group 2A** | 40 | 1 | 2017 |
| CCSE-III / CCSE-3 | **0** | 0 | — (a `2023-ccse3a-official-key.pdf` exists in `tmp-pyq/` but nothing is in `pyq_verified_clean`) |
| VAO | **0** | 0 | — |
| **TOTAL** | **3,463** | 27 | 2013–2025 |

> `source_id` count (27) exceeds the paper count (22 exam-year papers) because Group 2/4 papers from 2019/2022/2024/2025 store the GS half and the General-Tamil half under **separate** `source_id`s (`…-gs` / `…-gs-v2` and `…-tamil`).

---

## 2. Per-paper inventory

`multi-answer` = rows whose `accepted_answers` array has > 1 entry. **In every TNPSC paper `multi-answer` exactly equals `nullified`** — i.e. the archive only records multiple accepted answers for officially nullified/grace questions; there are no non-nullified multi-correct items.

### GROUP 1 — Prelims (established size: 200 Q, single combined paper)

| Year | `source_id` | Verified | Q-range | Missing in range | Nullified | Multi-ans | Subjects (top) | Status |
|---|---|---:|---|---|---:|---:|---|---|
| 2013 | `tnpsc-group1-prelims-2013` | 199 | 1–200 | q199 | 3 | 3 | Aptitude 41 · Gen Sci 40 · Polity 32 · History 20 | **NEAR-COMPLETE** (199/200) |
| 2014 | `tnpsc-group1-prelims-2014` | 198 | 1–200 | q17, q22 | 14 | 14 | Aptitude 45 · Gen Sci 38 · Polity 30 · History 20 | **NEAR-COMPLETE** (198/200) |
| 2015 | `tnpsc-group1-prelims-2015` | 200 | 1–200 | — | 5 | 5 | Aptitude 45 · Curr Aff 37 · Gen Sci 30 · History 28 | **COMPLETE** |
| 2017 | `tnpsc-group1-prelims-2017` | 200 | 1–200 | — | 5 | 5 | Aptitude 50 · Curr Aff 36 · Gen Sci 33 · History 27 | **COMPLETE** |
| 2019 | `tnpsc-group1-prelims-2019` | 200 | 1–200 | — | 17 | 17 | Aptitude 53 · Gen Sci 34 · Polity 28 · Economy 24 | **COMPLETE** |
| 2021 | `tnpsc-group1-prelims-2021-gs` | 200 | 1–200 | — | 16 | 16 | Gen Tamil 51 · Aptitude 33 · Polity 24 · INM 21 | **COMPLETE** |
| 2022 | `tnpsc-group1-prelims-2022-gs` | 200 | 1–200 | — | 15 | 15 | TN-specific 33 · Hist&Cult 28 · Gen Sci 26 · Economy 25 | **COMPLETE** |
| 2024 | `tnpsc-group1-prelims-2024-gs` | 200 | 1–200 | — | 11 | 11 | TN-specific 46 · Hist&Cult 30 · Aptitude 29 · Polity 24 | **COMPLETE** |

**Group 1: 8 papers, 1,597 Q. 6 COMPLETE + 2 NEAR-COMPLETE (each missing ≤ 2 questions). Effectively a full run of TNPSC Group 1 Prelims 2013–2024.**

### GROUP 2 — Prelims (established size: 200 Q = GS 100 + General Tamil 100)

| Year | `source_id` | Verified | Q-range | Missing in range | Nullified | Multi-ans | Subjects (top) | Status |
|---|---|---:|---|---|---:|---:|---|---|
| 2014 | `tnpsc-group2-prelims-2014` | 78 | 1–99 | 21 (q5–17, 21, 35, 39, 52, 53, 55, 58, 85) · **q100–200 entirely absent** | 0 | 0 | Gen English 40 · Art&Cult 20 · GK 6 | **VERY THIN** (78/200) |
| 2015 | `tnpsc-group2-prelims-2015` | 100 | 101–200 | — · **q1–100 (Tamil half) absent** | 6 | 6 | Aptitude 24 · Gen Sci 17 · Curr Aff 14 · Polity 13 | **PARTIAL** (100/200 — GS half only) |
| 2018 | `tnpsc-group2-2018-gs` | 59 | 113–200 | 29 (q114, 118, 119, 125, 131, 144, 147–150, 155, 156, 159, 167, 179–190, 192, 193, 196, 197) · **q1–112 absent** | 0 | 0 | Economy 11 · History 10 · Sci&Tech 10 · Polity 8 | **VERY THIN** (59/200) |
| 2022 | `tnpsc-group2-prelims-2022-gs-v2` | 100 | 101–200 | — | 3 | 3 | Aptitude 23 · Hist&Cult 14 · TN-specific 14 · Polity 13 | pairs with ↓ |
| 2022 | `tnpsc-group2-prelims-2022-tamil` | 100 | 1–100 | — | 0 | 0 | Tamil Nadu Specific 100 | **→ 2022 COMPLETE (200/200)** |
| 2024 | `tnpsc-group2-prelims-2024-gs-v2` | 100 | 1–100 | — | 6 | 6 | Aptitude 23 · Hist&Cult 16 · TN-specific 16 · Gen Sci 10 | pairs with ↓ |
| 2024 | `tnpsc-group2-prelims-2024-tamil` | 100 | 101–200 | — | 3 | 3 | Tamil Nadu Specific 97 | **→ 2024 COMPLETE (200/200)** |

**Group 2: 5 exam-years, 637 Q. 2 COMPLETE (2022, 2024) · 1 PARTIAL (2015) · 2 VERY THIN (2014, 2018).**

### GROUP 2A — Prelims (established size: 200 Q)

| Year | `source_id` | Verified | Q-range | Missing in range | Nullified | Multi-ans | Subjects (top) | Status |
|---|---|---:|---|---|---:|---:|---|---|
| 2017 | `tnpsc-group2a-2017-gs` | 40 | 101–199 | 59 (q103, 105–117, 127, 131–174 …) · **q1–100 absent** | 0 | 0 | History 12 · Polity 10 · Sci&Tech 6 · GK 3 | **VERY THIN** (40/200) |

**Group 2A: 1 paper, 40 Q. VERY THIN — a fifth of one paper.**

### GROUP 4 — Prelims (established size: 200 Q = GS/English 100 [q101–200] + General Tamil 100 [q1–100])

| Year | `source_id` | Verified | Q-range | Missing in range | Nullified | Multi-ans | Subjects (top) | Status |
|---|---|---:|---|---|---:|---:|---|---|
| 2013 | `tnpsc-group4-prelims-2013` | 100 | 101–200 | — · **Tamil half (q1–100) absent** | 5 | 5 | Aptitude 25 · Gen Sci 19 · History 14 · Economy 13 | **PARTIAL** (100/200 — GS half only) |
| 2014 | `tnpsc-group4-prelims-2014` | 100 | 101–200 | — · **Tamil half absent** | 8 | 8 | Aptitude 25 · Gen Sci 18 · Polity 16 · History 16 | **PARTIAL** (100/200) |
| 2016 | `tnpsc-group4-prelims-2016` | 100 | 101–200 | — · **Tamil half absent** | 5 | 5 | Aptitude 25 · Curr Aff 20 · Gen Sci 16 · History 16 | **PARTIAL** (100/200) |
| 2018 | `tnpsc-group4-prelims-2018` | 100 | 101–200 | — · **Tamil half absent** | 8 | 8 | Curr Aff 25 · Aptitude 25 · Gen Sci 14 · Polity 12 | **PARTIAL** (100/200) |
| 2019 | `tnpsc-group4-prelims-2019-gs` | 100 | 101–200 | — | 8 | 8 | Aptitude 24 · Gen Sci 19 · Polity 15 · Hist&Cult 11 | pairs with ↓ |
| 2019 | `tnpsc-group4-prelims-2019-tamil` | 100 | 1–100 | — | 1 | 1 | Tamil Nadu Specific 99 | **→ 2019 COMPLETE (200/200)** |
| 2022 | `tnpsc-group4-prelims-2022-gs` | 100 | 101–200 | — | 6 | 6 | Aptitude 25 · TN-specific 20 · Polity 12 · Hist&Cult 11 | pairs with ↓ |
| 2022 | `tnpsc-group4-prelims-2022-tamil` | 100 | 1–100 | — | 3 | 3 | Tamil Nadu Specific 97 | **→ 2022 COMPLETE (200/200)** |
| 2025 | `tnpsc-group4-prelims-2025` | 89 | 2–199 | 109 gaps (q5, 10–28, 30, 31, 34, 37–55, 59, 63, 64, 69–73, 77, 80, 82, 85, 89, 91, 93, 96, 97, 99 …+49 more) | 0 | 0 | Gen Studies 33 · Gen English 22 · Aptitude 9 · History 7 | GS/English half **PARTIAL** (89/100) |
| 2025 | `tnpsc-group4-prelims-2025-tamil` | 100 | 1–100 | — | 6 | 6 | Tamil Nadu Specific 94 | **→ 2025 NEAR-COMPLETE (189/200)** |

**Group 4: 7 exam-years, 989 Q. 2 COMPLETE (2019, 2022) · 1 NEAR-COMPLETE (2025, 189/200) · 4 PARTIAL (2013, 2014, 2016, 2018 — GS half only).**

### ACF — Prelims (established size: 200 Q)

| Year | `source_id` | Verified | Q-range | Missing in range | Nullified | Multi-ans | Subjects (top) | Status |
|---|---|---:|---|---|---:|---:|---|---|
| 2023 | `tnpsc-acf-prelims-2023-gs` | 200 | 1–200 | — | 15 | 15 | Gen Tamil 48 · Aptitude (Unit 10) 36 · INM (Unit 7) 33 · Polity (Unit 5) 23 | **COMPLETE** |

---

## 3. Completeness roll-up

| Band | Papers | Which |
|---|---:|---|
| **COMPLETE** (~200/200) | **11** | G1 2015, 2017, 2019, 2021, 2022, 2024 · G2 2022, 2024 · G4 2019, 2022 · ACF 2023 |
| **NEAR-COMPLETE** (~90–99%) | **3** | G1 2013 (199), G1 2014 (198), G4 2025 (189) |
| **PARTIAL** (one 100-Q half) | **5** | G2 2015 · G4 2013, 2014, 2016, 2018 |
| **VERY THIN** (< 40%) | **3** | G2 2014 (78), G2 2018 (59), G2A 2017 (40) |
| **Total exam-year papers** | **22** | across 27 `source_id`s |

- **~2,200 questions** sit in the 11 COMPLETE full papers; **~586 more** in the 3 NEAR-COMPLETE.
- **Strongest asset: Group 1** — 8 papers 2013–2024, 6 complete + 2 near-complete, 1,597 questions, single-paper structure (no missing Tamil half to worry about).
- **Group 4** is half-populated for its older years: 2013/2014/2016/2018 have only the GS/English 100; the General-Tamil 100 for those years is absent. 2019 & 2022 are whole; 2025 is nearly whole.
- **Group 2 / 2A** is the weakest: only 2022 and 2024 are whole; 2014, 2017 (2A), 2018 are fragments.

---

## 4. Data-quality notes (read before building anything)

1. **`subject` has no consistent taxonomy.** Values drift by ingestion batch: 2013–2017 use `Aptitude & Mental Ability` / `General Science` / `Indian Polity`; 2019–2024 use `Aptitude & Reasoning` / `History & Culture` / `Tamil Nadu Specific` / `(none)`; 2021 & ACF 2023 use TNPSC syllabus unit names (`Unit 5: Indian Polity`, `Unit 7: Indian National Movement`, `Unit 10: Aptitude & Mental Ability`). Any subject-level slicing needs a normalisation map first.
2. **`(none)` subject** appears on 8–17 questions per 2019–2024 paper — untagged remainder.
3. **General-Tamil halves are stored under their own `source_id`** (`…-tamil`) and are almost always `Tamil Nadu Specific` only — a single-subject block, not topic-classified.
4. **`nullified` = `multi-answer` everywhere.** ~3–17 per paper (higher in 2019–2024). `accepted_answers` carries the official multi-correct/grace set only for these.
5. **2025 Group 4 GS/English half is 89/100 with scattered gaps** — mid-ingestion, not a finished paper.
6. **Raw table context** (not part of this verified inventory): `pyq_questions` holds ~5,754 TNPSC rows including ~344 **TN TET** items mis-labelled `exam="TNPSC"`. `pyq_verified_clean` (3,463) is the confidence-filtered view and contains no TET.

---

## 5. Final exact totals — verified Supabase TNPSC PYQs

| Group | Verified PYQs |
|---|---:|
| **Group 1** | **1,597** |
| **Group 2** | **637** |
| **Group 2A** | **40** |
| **Group 4** | **989** |
| **ACF** | **200** |
| CCSE-III | 0 |
| VAO | 0 |
| **TOTAL verified TNPSC PYQs** | **3,463** |

*(Excludes Redis `miga:pyq:*` generated questions and the ~38,095 generic Quiz Hub pool, as instructed.)*

*Nothing was modified. Supabase access was read-only PostgREST `GET`; local files were read-only. No code, DB, route, metadata, sitemap or Git changes.*
