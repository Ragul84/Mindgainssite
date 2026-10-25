# SSC CGL “Spot the Error” — Review Packet (v3, post-fix)

> Batch: `sample-003 (post-review fixes: replaced 5 items resting on disputed / prescriptive-only rules — 'most unique', 'majority of ... was', 'every ... their', repeated emphatic 'himself', 'kind of' + article — with indisputable errors; softened 1 explanation ('a lot of useful information'); relabelled Q1 & Q8 to easy)`
> Route: `/ssc/english/error-spotting/` · Redis key: `quiz:subject:english:ssc:error-spotting`
> Count: 30 · Difficulty: easy 11 / medium 14 / hard 5  (post-fix; hard still under target 25% — the next batch must add structurally-buried-error hard items, see brief §7)
> Category split: SVA 7 / tense-verbform 6 / preposition 5 / article-determiner 5 / pronoun 3 / adj-adv 2 / degree 2 / redundancy 1 / parallelism 1 / correlatives 1 / other 2 (incl. 5 'No error' items)

**What changed since v2 (ChatGPT verdict: CONTINUE WITH FIXES):**

- Replaced 5 items that rested on disputed / prescriptive-only rules (“most unique”, “majority of … was”, “every … their”, repeated emphatic “himself”, “kind of” + article) with indisputable errors (comparative + `than`; `one of the machines … have`; reflexive `myself` as subject; `a honorary` → `an honorary`; a genuine “No error” item).
- Softened Q20 explanation to “a lot of useful information”.
- Re-labelled the two trivially-conspicuous items (`has decided`, `very careless`) to **easy**; re-labelled the two cross-clause / reported-speech items to **hard**.
- Locked the canonical format (4-segment ~85% / 3-part + “No error” ~15%, ~40% of those genuinely error-free).

**Known open items (for the reviewer to confirm, not silently pass):**

- `answer_index` spread is `{0:4, 1:18, 2:4, 3:4}` — 60% on index 1. Pool-level fix (≤35% per index) applies at 500, not fixable in 30 without contorting sentences.
- hard = 5/30 (16.7%), under the 25% target. The next batch must add structurally-buried-error hard items.

---

## Original review note (context + the standard)

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

---

## The 30 questions (v3)

### Q1  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> The committee members / has decided / to postpone the annual meeting / until the first week of March.

- (A) The committee members
- (B) has decided ✅
- (C) to postpone the annual meeting
- (D) until the first week of March.

**Answer:** (B)  
**Explanation:** The subject 'members' is plural, so the verb must be plural: 'have decided', not 'has decided'. Trap: 'committee' looks singular, but the head noun controlling the verb here is 'members'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: subject-verb agreement)

### Q2  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> Each of the students / were given / a separate hall ticket / for the online examination.

- (A) Each of the students
- (B) were given ✅
- (C) a separate hall ticket
- (D) for the online examination.

**Answer:** (B)  
**Explanation:** 'Each of + plural noun' takes a singular verb, so 'were' should be 'was'. Trap: the plural 'students' just before the verb tempts you toward 'were'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: 'each of' + singular verb)

### Q3  ·  _hard_

Select the part of the sentence that has an error. If there is no error, select 'No error'.

> The train had already left / when we reached the platform / with our heavy luggage.

- (A) The train had already left
- (B) when we reached the platform
- (C) with our heavy luggage.
- (D) No error ✅

**Answer:** (D)  
**Explanation:** The sentence is correct: past perfect ('had already left') for the earlier action, simple past ('reached') for the later one. 'No error'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error, 'No error' variant (rule: past perfect vs simple past)

### Q4  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> The management / will implemented / the revised leave policy / from the beginning of next month.

- (A) The management
- (B) will implemented ✅
- (C) the revised leave policy
- (D) from the beginning of next month.

**Answer:** (B)  
**Explanation:** After the modal 'will', the verb must be in its base form: 'will implement', not 'will implemented'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: modal + base verb)

### Q5  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> He has been working / in this organisation / since eight years / without taking a single long leave.

- (A) He has been working
- (B) in this organisation
- (C) since eight years ✅
- (D) without taking a single long leave.

**Answer:** (C)  
**Explanation:** 'Since' marks a point in time; a stretch of time takes 'for'. It should be 'for eight years'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: since vs for)

### Q6  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> Ravi is / the most honest colleague / I have ever worked with / in a office of this size.

- (A) Ravi is
- (B) the most honest colleague
- (C) I have ever worked with
- (D) in a office of this size. ✅

**Answer:** (D)  
**Explanation:** 'Office' begins with a vowel sound, so the article must be 'an', not 'a': 'in an office'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: a vs an)

### Q7  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> Between you and I, / the newly appointed head / seems far more capable / than the previous one.

- (A) Between you and I, ✅
- (B) the newly appointed head
- (C) seems far more capable
- (D) than the previous one.

**Answer:** (A)  
**Explanation:** After the preposition 'between', pronouns take the objective case: 'Between you and me'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: pronoun after preposition)

### Q8  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> The visiting team played / very careless / in the second half / and threw away a comfortable lead.

- (A) The visiting team played
- (B) very careless ✅
- (C) in the second half
- (D) and threw away a comfortable lead.

**Answer:** (B)  
**Explanation:** An adverb, not an adjective, modifies the verb 'played': 'very carelessly'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: adjective vs adverb)

### Q9  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> Most first-year students find algebra / more difficult / to geometry, / especially in the opening months.

- (A) Most first-year students find algebra
- (B) more difficult
- (C) to geometry, ✅
- (D) especially in the opening months.

**Answer:** (C)  
**Explanation:** A comparative adjective ('more difficult') is followed by 'than', not 'to': 'more difficult than geometry'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: comparative + 'than')

### Q10  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> Kindly revert back / to us / at the earliest / so that we can confirm your booking.

- (A) Kindly revert back ✅
- (B) to us
- (C) at the earliest
- (D) so that we can confirm your booking.

**Answer:** (A)  
**Explanation:** 'Revert' already means 'to come/reply back', so 'back' is redundant: 'Kindly revert'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: redundancy)

### Q11  ·  _hard_

Select the segment of the sentence that contains a grammatical error.

> Neither the players / nor the coach / were satisfied / with the umpire's decision.

- (A) Neither the players
- (B) nor the coach
- (C) were satisfied ✅
- (D) with the umpire's decision.

**Answer:** (C)  
**Explanation:** With 'neither ... nor ...', the verb agrees with the nearer subject, here the singular 'coach': 'was satisfied'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: neither...nor, proximity agreement)

### Q12  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> A number of applications / was rejected / this year / because they arrived after the closing date.

- (A) A number of applications
- (B) was rejected ✅
- (C) this year
- (D) because they arrived after the closing date.

**Answer:** (B)  
**Explanation:** 'A number of + plural noun' is plural, so it takes 'were rejected'. Contrast: 'The number of ...' is singular.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: a number of vs the number of)

### Q13  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> One of the machines / in the packaging unit / have been malfunctioning / since early on Monday.

- (A) One of the machines
- (B) in the packaging unit
- (C) have been malfunctioning ✅
- (D) since early on Monday.

**Answer:** (C)  
**Explanation:** The subject is 'One' (singular); 'of the machines' is only a modifier. The verb must be singular: 'has been malfunctioning'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: 'one of the + plural noun' takes a singular verb)

### Q14  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> My cousin was married / with a software engineer / who now works / at a firm in Pune.

- (A) My cousin was married
- (B) with a software engineer ✅
- (C) who now works
- (D) at a firm in Pune.

**Answer:** (B)  
**Explanation:** One is 'married to' someone, not 'married with': 'married to a software engineer'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: preposition with 'married')

### Q15  ·  _hard_

Select the segment of the sentence that contains a grammatical error.

> He told the reporters / that he will meet / the striking workers / the following morning.

- (A) He told the reporters
- (B) that he will meet ✅
- (C) the striking workers
- (D) the following morning.

**Answer:** (B)  
**Explanation:** In reported speech after a past reporting verb ('told'), 'will' backshifts to 'would': 'that he would meet'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: sequence of tenses in reported speech)

### Q16  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> Honesty is / best policy / when you are dealing / with long-standing clients.

- (A) Honesty is
- (B) best policy ✅
- (C) when you are dealing
- (D) with long-standing clients.

**Answer:** (B)  
**Explanation:** The superlative needs the definite article: 'the best policy'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: 'the' with superlatives)

### Q17  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> My colleague and myself / were asked to represent / the department / at the regional conference.

- (A) My colleague and myself ✅
- (B) were asked to represent
- (C) the department
- (D) at the regional conference.

**Answer:** (A)  
**Explanation:** A reflexive pronoun ('myself') cannot be the subject of a verb. The subject form is 'I': 'My colleague and I were asked ...'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: reflexive pronoun cannot be a subject)

### Q18  ·  _hard_

Select the segment of the sentence that contains a grammatical error.

> She is one of those managers / who always insists / on double-checking every figure / before the report is released.

- (A) She is one of those managers
- (B) who always insists ✅
- (C) on double-checking every figure
- (D) before the report is released.

**Answer:** (B)  
**Explanation:** In 'one of those + plural noun + who ...', the relative clause verb is plural because 'who' refers to 'managers': 'who always insist'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: 'one of those who' + plural verb)

### Q19  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> The branch manager was angry / on his assistant / for failing to inform him / about the audit in advance.

- (A) The branch manager was angry
- (B) on his assistant ✅
- (C) for failing to inform him
- (D) about the audit in advance.

**Answer:** (B)  
**Explanation:** One is 'angry with' a person (and 'angry at/about' a thing): 'angry with his assistant'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: 'angry with' a person)

### Q20  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> The consultant gave us / many useful informations / about the new tax regime / during the workshop.

- (A) The consultant gave us
- (B) many useful informations ✅
- (C) about the new tax regime
- (D) during the workshop.

**Answer:** (B)  
**Explanation:** 'Information' is uncountable: no plural and no 'many'. It should be 'a lot of useful information' (or simply 'useful information').  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: uncountable nouns)

### Q21  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> It is nearly three years / since I have met / my former classmates / from the training academy.

- (A) It is nearly three years
- (B) since I have met ✅
- (C) my former classmates
- (D) from the training academy.

**Answer:** (B)  
**Explanation:** In the pattern 'It is + period + since ...', the 'since' clause takes the simple past: 'since I met'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: 'It is ... since' + simple past)

### Q22  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> On weekends she enjoys reading, sketching / and to cycle / along the river / with her neighbours.

- (A) On weekends she enjoys reading, sketching
- (B) and to cycle ✅
- (C) along the river
- (D) with her neighbours.

**Answer:** (B)  
**Explanation:** Parallelism: the list uses gerunds ('reading', 'sketching'), so the third item must match: 'and cycling'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: parallel structure)

### Q23  ·  _easy_

Select the segment of the sentence that contains a grammatical error.

> The traffic situation near the market / became more worse / after the flyover / was closed for repairs.

- (A) The traffic situation near the market
- (B) became more worse ✅
- (C) after the flyover
- (D) was closed for repairs.

**Answer:** (B)  
**Explanation:** 'Worse' is already comparative; 'more worse' is a double comparative. It should be just 'worse'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: double comparatives)

### Q24  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> He is one of the finest player / the academy / has produced / in the last two decades.

- (A) He is one of the finest player ✅
- (B) the academy
- (C) has produced
- (D) in the last two decades.

**Answer:** (A)  
**Explanation:** 'One of the + superlative' is followed by a plural noun: 'one of the finest players'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: 'one of the' + plural noun)

### Q25  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> Her assessment of the proposal / was quite different than / the view / put forward by the finance team.

- (A) Her assessment of the proposal
- (B) was quite different than ✅
- (C) the view
- (D) put forward by the finance team.

**Answer:** (B)  
**Explanation:** The standard idiom is 'different from': 'quite different from the view'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: 'different from')

### Q26  ·  _hard_

Select the part of the sentence that has an error. If there is no error, select 'No error'.

> Hardly had the minister finished his speech / when the crowd / rose to its feet and cheered.

- (A) Hardly had the minister finished his speech
- (B) when the crowd
- (C) rose to its feet and cheered.
- (D) No error ✅

**Answer:** (D)  
**Explanation:** The sentence is correct: 'Hardly ... when ...' with inversion ('Hardly had ...') is the right structure. ('No sooner' pairs with 'than'; 'hardly/scarcely' pairs with 'when'.) 'No error'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error, 'No error' variant (rule: 'hardly ... when' correlative)

### Q27  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> When we reached the auditorium, / the programme already started / and we had to / find seats in the dark.

- (A) When we reached the auditorium,
- (B) the programme already started ✅
- (C) and we had to
- (D) find seats in the dark.

**Answer:** (B)  
**Explanation:** The earlier of two past actions takes the past perfect: 'the programme had already started'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: past perfect for the earlier action)

### Q28  ·  _medium_

Select the part of the sentence that has an error. If there is no error, select 'No error'.

> The principal congratulated the students / for their / brilliant results in the board examination.

- (A) The principal congratulated the students
- (B) for their ✅
- (C) brilliant results in the board examination.
- (D) No error

**Answer:** (B)  
**Explanation:** The idiom is 'congratulate someone ON something': 'congratulated the students on their brilliant results'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error, 'No error' variant (rule: 'congratulate on')

### Q29  ·  _medium_

Select the segment of the sentence that contains a grammatical error.

> The university awarded her / a honorary doctorate / for her decades of research / on tropical diseases.

- (A) The university awarded her
- (B) a honorary doctorate ✅
- (C) for her decades of research
- (D) on tropical diseases.

**Answer:** (B)  
**Explanation:** 'Honorary' begins with a silent 'h', so it takes a vowel sound: 'an honorary doctorate', not 'a honorary doctorate'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error (rule: a/an by sound, silent 'h')

### Q30  ·  _medium_

Select the part of the sentence that has an error. If there is no error, select 'No error'.

> The conclusions of the new survey / are consistent with / those of the study conducted in 2019.

- (A) The conclusions of the new survey
- (B) are consistent with
- (C) those of the study conducted in 2019.
- (D) No error ✅

**Answer:** (D)  
**Explanation:** The sentence is correct: 'consistent with' is the right preposition, and 'those of' correctly stands in for 'the conclusions of' in the comparison. 'No error'.  
**Source tag:** SSC CGL Tier-1 English — Spot the Error, 'No error' variant (rule: 'consistent with' + parallel comparison with 'those of')

