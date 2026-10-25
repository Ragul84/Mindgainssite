# Quality-Review Request — SSC CGL "Spot the Error" sample batch

*Paste this whole note into ChatGPT, then paste the 30 questions from `sample-batch-ssc-error-spotting.json` after it.*

---

## Context

We are **MindGains**, building free practice-quiz pages for Indian competitive exams (SSC, TNPSC, UPSC, RRB, NCERT). Our differentiator is meant to be **quality** — quizzes that are genuinely exam-standard, not the generic filler most sites ship.

We are about to generate ~6,500 new questions to make our **SSC CGL** coverage syllabus-complete (18 missing topics + 3 thin ones). Before we commit to that volume, we want an independent check that this **first sample batch of 30 questions** is actually at exam standard.

**Topic under review:** SSC CGL Tier-1 English — **Spot the Error / Error Detection**.

## The standard we are holding every batch to

- Questions must match the **real SSC CGL format**: a sentence split into 4 segments; exactly one segment carries a grammatical error; the 4 options are the 4 segments; the answer marks the wrong segment. 3–5 such questions appear in every SSC CGL Tier-1 paper.
- Error categories and their weighting must reflect **actual SSC PYQs**: subject-verb agreement, tense / verb-form / sequence of tenses, prepositions, articles & determiners, pronouns (case & agreement), adjective-vs-adverb, degree of comparison, redundancy / superfluous words, parallelism, correlative conjunctions (neither…nor, one of those who…).
- Difficulty spread: roughly **easy 25% / medium 50% / hard 25%**, honestly labelled.
- Every question has **exactly one defensible answer**, **plausible distractors** (the other 3 segments must be genuinely correct English, not obviously fine or obviously broken), and an **explanation that states the rule and names the trap**.
- Everyday-scenario sentences, ~10–20 words per segment, moderately formal register — the SSC house style.
- **No** multi-statement / "how many are correct" format here — that is a UPSC pattern, not SSC.

## PYQ grounding we used (verified from released SSC CGL papers)

Representative real SSC CGL Tier-1 error-spotting items and the rules they test:
- "Paul was / bited by a dog / when he / was a child." → *bited → bitten* (past participle).
- "My younger brother were attending a short-term computer course these days." → *were → was* (SVA).
- "We have to return back immediately" → *return back → return* (redundancy).
- "The majority of writers never passes this stage." → *passes → pass* (SVA, plural noun after 'of').
- "My brother performed / extremely good / in the class test / held yesterday." → *good → well* (adverb).
- "Every students in the hostel decided to travel to Delhi…" → *Every students → Every student* (determiner + singular).
- "By this time next year / I will had graduated…" → *will had → will have* (future perfect).
- "The tea at this café is best than at the Costa Café…" → *best than → better than* (degree of comparison).
- "…as his health is not more good." → *not more good → not very good* (adjective misuse).

## What we need from you

Evaluate the 30 questions below against the standard above and answer, specifically:

1. **Format authenticity (0–10):** do these read like real SSC CGL Tier-1 error-spotting questions? Any that feel off-pattern?
2. **Answer correctness:** flag **every** question where the marked answer is wrong, arguable, or has a second valid error. Be strict.
3. **Distractor integrity:** flag any question where one of the "correct" segments actually contains an error too, or where a segment is so obviously wrong that the question is trivial.
4. **Explanation quality:** are the rules stated correctly? Any explanation that is wrong or misleading?
5. **Difficulty labels:** do the easy/medium/hard tags match reality? List mislabels.
6. **Category coverage:** does the mix reflect real SSC PYQ weighting, or is it skewed? What's over/under-represented?
7. **Register & naturalness:** do any sentences sound unnatural, dated, or un-Indian-English in a bad way?
8. **Duplication / sameness:** are any two questions testing the identical point with cosmetic changes?

Then give a single verdict:

> **CONTINUE** — this batch is at exam standard; scale up the same way.
> **CONTINUE WITH FIXES** — list the exact fixes needed before scaling.
> **DO NOT CONTINUE** — the approach has a systemic problem; explain what.

Please be blunt. We would rather kill this now than ship 6,500 mediocre questions.

---

*(now paste the 30 questions)*
