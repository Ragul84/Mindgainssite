# MindGains — Quiz Content Generation Brief (reusable)

**Goal:** quiz sets that are, per exam × subject × topic, the best available in India — syllabus-complete, weighted like the real paper, in the real question formats, every item grounded and explained, zero recycled padding.

Use this brief for every generation batch. It is the contract the pipeline + reviewers hold each batch to.

---

## 1. Per-topic targets

| | Value |
|---|---|
| Questions per micro-topic | **300 minimum** (COVERED band). Flagship topics (5,000/mo keyword): 500. |
| Difficulty split | **easy 25% · medium 50% · hard 25%** (label every item; calibrate hard = would trip ~60% of serious aspirants). |
| Duplicate rule | **0 exact duplicates** within the topic; **≤2% near-duplicates** (same fact, reworded) within the exam; **0** verbatim reuse of an item already in another exam's set — reframe or replace. |
| Options | exactly **4**, one unambiguously correct, 3 plausible (distractors must be *why-would-someone-pick-this* wrong, not filler). |
| Explanation | mandatory, 1–3 sentences, states *why the answer is right AND why the trap distractor is wrong*, and names the source (chapter / standard book / Article / section). |
| Source grounding | generate **from the actual textbook / standard source**, not open web. NCERT / Laxmikanth / standard subject sources per exam. Every batch cites its source list. |
| Language | English. **TNPSC additionally: a Tamil-medium mirror of every GS + Aptitude item** (same fact, natural Tamil, not machine-literal). |

---

## 2. Question-FORMAT mix by exam

Do not ship a topic as 100% single-fact MCQ. Match the real paper.

### UPSC CSE Prelims
| Format | Share | Example stem |
|---|---:|---|
| Multi-statement "how many are correct" | **30%** | "Consider the following statements about … 1. … 2. … 3. … How many of the above are correct?" |
| Single best answer, close distractors | 30% | "Which one of the following best describes …?" |
| Pairs / match the list | 15% | "Which of the pairs given below is/are correctly matched?" |
| Assertion–Reason | 10% | "Assertion (A): … Reason (R): …" |
| Chronological / sequence | 8% | "Arrange the following in chronological order …" |
| Direct single-fact | 7% | plain recall |

### SSC CGL
| Format | Share |
|---|---:|
| **Quant:** multi-step computation problem (not one-liner) | 100% of quant |
| **Reasoning:** analogy / series / classification / coding / puzzle set | 100% of reasoning |
| **English:** error-spot, cloze, sentence-improvement, RC, one-word, idioms | 100% of English |
| **GA:** single-fact recall (history/polity/geo/eco/science/static/current) | 90% |
| **GA:** "which is correctly matched" / "which statement is correct" | 10% |
Almost **no** multi-statement multi-correct in SSC. Quant stems must be real problems (~120–160 chars), not "What is 20% of 50?".

### TNPSC (Group 1/2/2A/4)
| Format | Share |
|---|---:|
| Single-fact recall | 45% |
| "Which is correctly matched" / "which pair is wrong" | 20% |
| Assertion–Reason | 12% |
| Match List I / List II | 10% |
| Chronological order | 8% |
| Multi-statement "which is/are correct" | 5% |
Every GS + Aptitude item also produced in **Tamil medium**.

---

## 3. QA gates (a batch ships only if it passes all)

The LLM writes questions. **The pipeline — not the model — decides category quota, difficulty quota, format, and whether a rule is safe to test.** Enforce these deterministically before any publish.

1. **No disputed / prescriptive-only errors.** Reject any item whose "error" depends on: a rule contradicted by accepted modern usage (e.g. "most unique", singular *they* after *every/each*), dialect preference ("different than" vs "from" — allowed only where PYQ evidence shows the exam marks it), a stylistic-not-grammatical fault (repeated emphatic pronoun, "mutually agreed"), or an over-broad generalisation ("no article ever after *kind of*"). If in doubt → regenerate. The bar is *"exactly one defensible answer"*, not *"an old exam book would dislike this"*.
2. **Exactly-one-error check.** Substitute the intended correction into the sentence: the result must be fully correct. Then scan every *other* segment independently — each must be grammatical on its own. Fail → drop.
3. **Distractor quality** — each wrong option is a real misconception, not nonsense. Reject "banana" distractors. Also reject items where the error is so conspicuous the question is trivial *unless* it is deliberately tagged `easy` and within the easy quota.
4. **Factual** — each answer verified against the cited source. Disputable → drop.
5. **Narrow-rule explanations** — the explanation states the *specific* rule and the trap, and does **not** overgeneralise. "'honorary' takes *an* because of the silent h" — good. "no article is ever used after 'kind of'" — reject.
6. **Difficulty calibration** — label matches reality. `hard` must mean **structurally harder**: the error is buried in otherwise natural English, or requires checking agreement / antecedent / tense *across separated clauses* — **not** merely "a rarer rule". Spot-check 10% against real PYQ difficulty. A batch must hit its difficulty quota (≈25/50/25) — if the model can't produce enough genuine `hard`, that is a pipeline finding, not something to fake with relabels.
7. **Pipeline-controlled quotas.** Category counts (SVA = N, tense = N, preposition = N, …) and difficulty counts are set by the pipeline **from the PYQ frequency table**, then passed to generation. The model does not choose the mix. Every rule that appears in the PYQ table gets ≥10 items in the pool.
8. **Structural dedup, not just text dedup.** Compute a signature = `rule + sentence-structure template` (e.g. `EACH_OF_SINGULAR_VERB | "Each of the [PLURAL] + [WRONG PLURAL VERB]"`). Cap repetitions of any one signature. "Each of the employees were…", "Each of the players were…", "Each of the applicants were…" = **one** question pattern, not three. Also run hash + fuzzy text dedup against the full 6-exam corpus.
9. **Format lock** — the batch matches the exam's canonical format (SSC error-spotting: 4-segment, ~85%; 3-part + "No error", ~15%, of which ~40% actually have no error). Not a random mix.
10. **Syllabus tag** — every item tagged with its `syllabus_node`.
11. **Expert spot-check** — a subject expert reviews a random 5% (min 15 items). >2 material errors → whole batch reworked.

**Scaling rule:** after *any* prompt or pipeline revision, generate a **50–100 item validation batch spanning several topics** (not another 30 of the same topic) and clear it to **≥98% unambiguous answer correctness** before generating at volume. At 6,500 questions, 5% arguable = 325 bad questions — the corpus quality has to be enforced here, not hoped for from the prompt.

---

## 3a. Subject-specific validators (run in addition to §3)

The generic gates in §3 catch format, dedup and ambiguity. Each subject also fails in its **own** way, so every batch runs the validator for its subject before publish:

| Subject | Extra validator |
|---|---|
| **Quant / Aptitude** | **Recompute every answer independently** (a second solver, not the generator). Reject if the recomputed value isn't among the 4 options, if two options are both defensible, or if the problem is under-determined. Every explanation shows the full worked solution, not just the final number. |
| **Reasoning** | **Independently re-solve** every deterministic item (series, coding, classification, blood relations, direction, syllogism). Reject if more than one option fits the rule, or if the "odd one out" has two valid groupings. No item may depend on a figure the text can't fully describe. |
| **English — vocab (synonyms / antonyms / one-word / idioms)** | **Context check.** A synonym/antonym must hold in the sentence given (or with no sentence, in the word's primary sense) and no *other* option may also fit. Idiom meanings verified against a standard dictionary. Reject register mismatches (archaic ↔ slang). |
| **English — grammar** | §3 gate 1 (no disputed / prescriptive-only errors) is the hard filter. |
| **Static GK (history / polity / geography / economy / science)** | **Authoritative factual verification** against the cited source (NCERT / Laxmikanth / bare Constitution / standard atlas). Any date, name, number, or "first/largest/longest" claim must be checkable in the named source. Reject anything resting only on model recall. |
| **Current affairs** | **Source + date verification** — every item cites a datable event with a real reference; nothing older than the exam's currency window; no "recently" without a date. |

A batch that can't pass its subject validator is a **pipeline finding** (the generator or the source grounding is wrong), not something to patch item-by-item.

---

## 3b. Approved baselines

| Spec | Status | Notes |
|---|---|---|
| **SSC CGL — Spot the Error** (`sample-batch-ssc-error-spotting.json` v3 + this brief §2 SSC row + §3 gates) | **FROZEN — approved baseline** (independent review, 2026-08-30: "CONTINUE"). | 4-segment ~85% / 3-part+"No error" ~15%. Do not keep tweaking the sample to chase a cosmetic 10/10. `hard` per gate 6. Answer-index ≤35% (aim 25%) enforced at pool scale, not in a 30-item sample. |

Next required step before volume generation: a **cross-topic SSC validation batch** (§3 scaling rule) exercising each §3a validator once — one Quant topic (recompute), one Reasoning topic (re-solve), one vocab topic (context), one static-GK topic (source verification).

---

## 4. Per-question schema (what the pipeline must store)

```json
{
  "question": "…",
  "options": ["…","…","…","…"],
  "answer_index": 0,
  "explanation": "… (source: …)",
  "difficulty": "easy|medium|hard",
  "question_type": "multi-statement|single-fact|match-list|assertion-reason|chronology|pairs|computation|verbal",
  "syllabus_node": "ssc:reasoning:classification | tnpsc:unit-5:judiciary | upsc:gs-polity:federalism",
  "source": "NCERT XI Indian Constitution at Work, Ch. 3",
  "lang": "en"            // TNPSC GS/Aptitude also emit a matching "ta" item
}
```

Current stored schema is only `{question, options, answer_index, explanation, difficulty}` — the pipeline needs `question_type`, `syllabus_node`, `source`, `lang` added so coverage and format-mix are measurable.

---

## 5. Output → publish path

1. Questions land in Redis under `quiz:subject:{subject}:{exam}:{topic}` (existing convention — a new `{topic}` key auto-creates the page on the next `build-public-quiz.cjs` run).
2. Add the route's SEO title/H1/meta to `scripts/seo/round2-title-overrides.json` (see the per-topic table in each exam's build plan).
3. Add the topic card to its subject page (`build-public-quiz.cjs` renders it from the pool automatically; the exam-hub chip list is manual).
4. Add the new URL to `sitemap.xml`.
5. Rebuild + deploy.
