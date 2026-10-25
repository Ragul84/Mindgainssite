# SSC Cross-Topic Validation Batch — Review Packet

> Batch: `cross-topic-validation-001` · 68 questions across 4 topics
> Standards: `scripts/seo/content-generation-brief.md (§2 format, §3 QA gates, §3a subject-specific validators)`

## Why this batch exists

Per content-generation-brief.md §3 scaling rule + the independent reviewer's instruction: before generating SSC at volume, prove the whole generation system (not just the Error Spotting generator) across topics that fail in different ways. One topic per failure mode: Quant (arithmetic / impossible options / multiple answers), Reasoning (ambiguous grouping), English vocab (context-dependent meaning), Static GK (hallucinated / outdated facts).

The SSC **Spot the Error** generator already passed independent review (verdict: CONTINUE). This batch tests whether the **rest of the SSC system** holds up — Quant, Reasoning, vocab and static GK each fail in a different way, so each is checked with its own validator:

- **ssc-quant-average** — Recompute every answer with an independent solver. Reject if recomputed value not among the 4 options, if 2 options are both defensible, or if under-determined. Explanation shows the full worked solution.
- **ssc-reasoning-classification** — Independently re-solve. Reject any item where more than one option fits the rule or the 'odd one out' has two valid groupings (e.g. 'the only even number' competing with 'the only composite').
- **ssc-english-idioms-phrases** — Verify each idiom meaning against a standard dictionary. Confirm no second option also fits. Distractors must be literal misreadings or near-miss idioms, not defensible paraphrases.
- **ssc-polity-fundamental-rights** — Verify every Article number, amendment number, committee name and count against the bare Constitution / Laxmikanth. Reject anything resting only on model recall.

## Batch composition (built, not hoped for)

| Section | n | Difficulty E/M/H | Answer-index A/B/C/D |
|---|---:|---|---|
| Average (`/ssc/quant/average/`) | 20 | 6 / 9 / 5 | 5 / 5 / 5 / 5 |
| Classification / Odd one out (`/ssc/reasoning/classification/`) | 18 | 7 / 11 / 0 | 5 / 4 / 4 / 5 |
| Idioms & Phrases (`/ssc/english/idioms-phrases/`) | 14 | 7 / 7 / 0 | 3 / 4 / 4 / 3 |
| Fundamental Rights & DPSP (`/ssc/polity/fundamental-rights/`) | 16 | 4 / 8 / 4 | 4 / 4 / 4 / 4 |
| **Total** | **68** | **24 / 35 / 9** | **17 / 17 / 17 / 17** |

**Known limitation to weigh, not hide:** hard = 9/68 (13%), below the 25% target. SSC Reasoning *classification* and *idioms* have no genuine hard tier — hard reasoning lives in puzzles/syllogism, hard vocab in dense RC — so hard concentrates in Quant (5/20) and GK (4/16). Flagged rather than padded with obscure trivia.

## Self-review already run (no external reviewer available)

All four validators were run in-house before finalising this packet:

- **Quant** — all 20 answers recomputed independently; every computed value is present in the options and unique; no under-determined problems.
- **Reasoning** — all 18 re-solved for a single defensible grouping. **1 defect found and fixed:** the crops item (Wheat/Rice/Mustard/Barley) had two valid groupings — mustard by cereal-vs-oilseed, rice by rabi-vs-kharif season — replaced with an outdoor-sport vs board-game item.
- **Idioms** — all 14 meanings match standard dictionary sense; no distractor is a defensible paraphrase.
- **GK** — every Article number, amendment number, committee name and count verified against the Constitution / Laxmikanth.

Result: 68/68 now pass their subject validator. This packet is still worth an independent pass if one becomes available.

---

# Average  ·  `/ssc/quant/average/`

_20 questions · easy 6 / medium 9 / hard 5 · Redis `quiz:subject:quant:ssc:average`_

### 1.  _medium_

The average of 15 numbers is 42. The average of the first 8 of them is 45 and the average of the last 8 is 40. What is the 8th number?

- (A) 48
- (B) 50  ✅
- (C) 52
- (D) 46

**Answer:** (B)  
**Explanation:** Sum of all 15 = 15 × 42 = 630. Sum of first 8 = 8 × 45 = 360; sum of last 8 = 8 × 40 = 320. The 8th number falls in both groups, so (360 + 320) − 630 = 680 − 630 = 50.  
**Source tag:** SSC CGL Tier-1 Quant — Average (overlapping-group type)

### 2.  _easy_

The average of five consecutive even numbers is 36. What is the largest of these five numbers?

- (A) 36
- (B) 38
- (C) 40  ✅
- (D) 42

**Answer:** (C)  
**Explanation:** For consecutive even numbers the average equals the middle term, so the third number is 36. The five numbers are 32, 34, 36, 38, 40, and the largest is 40.  
**Source tag:** SSC CGL Tier-1 Quant — Average (consecutive numbers)

### 3.  _medium_

The average age of 30 students in a class is 14 years. When the class teacher's age is included, the average rises by 1 year. What is the teacher's age?

- (A) 30
- (B) 40
- (C) 44
- (D) 45  ✅

**Answer:** (D)  
**Explanation:** Sum of students' ages = 30 × 14 = 420. New average = 15 for 31 people, so new total = 31 × 15 = 465. Teacher's age = 465 − 420 = 45 years.  
**Source tag:** SSC CGL Tier-1 Quant — Average (inclusion raises the mean)

### 4.  _medium_

A batsman had an average of 40 runs in 12 innings. In his 13th innings he scored 92 runs. By how many runs does his batting average increase?

- (A) 4  ✅
- (B) 5
- (C) 6
- (D) 3

**Answer:** (A)  
**Explanation:** Runs in 12 innings = 12 × 40 = 480. Total after 13 innings = 480 + 92 = 572, so the new average = 572 ÷ 13 = 44. Increase = 44 − 40 = 4.  
**Source tag:** SSC CGL Tier-1 Quant — Average (innings/score type)

### 5.  _easy_

What is the average of the first 40 natural numbers?

- (A) 20
- (B) 20.5  ✅
- (C) 21
- (D) 19.5

**Answer:** (B)  
**Explanation:** The average of the first n natural numbers is (n + 1) ÷ 2. Here (40 + 1) ÷ 2 = 41 ÷ 2 = 20.5.  
**Source tag:** SSC CGL Tier-1 Quant — Average (first n natural numbers)

### 6.  _hard_

The average weight of 8 members of a club increases by 2.5 kg when a new member replaces one who weighs 65 kg. What is the weight of the new member?

- (A) 80 kg
- (B) 82.5 kg
- (C) 85 kg  ✅
- (D) 87.5 kg

**Answer:** (C)  
**Explanation:** Total weight rises by 8 × 2.5 = 20 kg. That entire rise comes from the swap, so the new member weighs 65 + 20 = 85 kg.  
**Source tag:** SSC CGL Tier-1 Quant — Average (replacement type)

### 7.  _easy_

The average of three numbers a, b and c is 20. The average of a and b is 15. What is the value of c?

- (A) 10
- (B) 20
- (C) 25
- (D) 30  ✅

**Answer:** (D)  
**Explanation:** a + b + c = 3 × 20 = 60. a + b = 2 × 15 = 30. So c = 60 − 30 = 30.  
**Source tag:** SSC CGL Tier-1 Quant — Average (find the missing value)

### 8.  _medium_

A car travels from town P to town Q at 40 km/h and returns along the same road at 60 km/h. What is its average speed for the whole journey?

- (A) 48 km/h  ✅
- (B) 50 km/h
- (C) 45 km/h
- (D) 52 km/h

**Answer:** (A)  
**Explanation:** For equal distances, average speed = 2xy ÷ (x + y) = (2 × 40 × 60) ÷ (40 + 60) = 4800 ÷ 100 = 48 km/h. The plain average 50 km/h is the trap.  
**Source tag:** SSC CGL Tier-1 Quant — Average speed (equal distances)

### 9.  _medium_

The mean of 25 observations was found to be 36. Later it was discovered that one observation was recorded as 23 instead of the correct value 48. What is the corrected mean?

- (A) 36.5
- (B) 37  ✅
- (C) 37.5
- (D) 38

**Answer:** (B)  
**Explanation:** The recorded total is short by 48 − 23 = 25. Corrected total = 25 × 36 + 25 = 900 + 25 = 925, so the corrected mean = 925 ÷ 25 = 37.  
**Source tag:** SSC CGL Tier-1 Quant — Average (wrong reading corrected)

### 10.  _hard_

The average of 11 results is 50. The average of the first 6 results is 49 and that of the last 6 results is 52. What is the 6th result?

- (A) 52
- (B) 54
- (C) 56  ✅
- (D) 58

**Answer:** (C)  
**Explanation:** Sum of first 6 = 6 × 49 = 294; sum of last 6 = 6 × 52 = 312. These overlap at the 6th result, so 294 + 312 = (11 × 50) + 6th result. 606 = 550 + 6th result, giving 56.  
**Source tag:** SSC CGL Tier-1 Quant — Average (overlapping-group, find the shared term)

### 11.  _easy_

The average of 6 numbers is 30. If every number is multiplied by 4, what is the average of the new set of numbers?

- (A) 30
- (B) 34
- (C) 90
- (D) 120  ✅

**Answer:** (D)  
**Explanation:** Multiplying every value by 4 multiplies the average by 4 as well: 30 × 4 = 120.  
**Source tag:** SSC CGL Tier-1 Quant — Average (scaling every term)

### 12.  _medium_

In a group of 40 students, 25 boys scored an average of 44 marks and 15 girls scored an average of 36 marks. What is the average mark of the whole group?

- (A) 41  ✅
- (B) 40
- (C) 42
- (D) 39

**Answer:** (A)  
**Explanation:** Total marks = (25 × 44) + (15 × 36) = 1100 + 540 = 1640. Group average = 1640 ÷ 40 = 41.  
**Source tag:** SSC CGL Tier-1 Quant — Weighted average (two sub-groups)

### 13.  _hard_

The average age of 8 men increases by 2 years when two women replace two men aged 20 years and 24 years. What is the average age of the two women?

- (A) 28 years
- (B) 30 years  ✅
- (C) 32 years
- (D) 34 years

**Answer:** (B)  
**Explanation:** Total age rises by 8 × 2 = 16 years. Combined age of the two women = (20 + 24) + 16 = 60 years, so their average age = 60 ÷ 2 = 30 years.  
**Source tag:** SSC CGL Tier-1 Quant — Average (two-for-two replacement)

### 14.  _medium_

The average of 20 numbers is zero. At most, how many of these numbers can be greater than zero?

- (A) 17
- (B) 18
- (C) 19  ✅
- (D) 20

**Answer:** (C)  
**Explanation:** If the average is zero the sum is zero. Up to 19 numbers can be positive provided the 20th is negative enough to cancel them; all 20 cannot be positive.  
**Source tag:** SSC CGL Tier-1 Quant — Average (reasoning on a zero mean)

### 15.  _easy_

A student's average score in 4 subjects is 75. If she scored 60, 78 and 82 in three of the subjects, what did she score in the fourth?

- (A) 70
- (B) 75
- (C) 78
- (D) 80  ✅

**Answer:** (D)  
**Explanation:** Total required = 4 × 75 = 300. Marks in three subjects = 60 + 78 + 82 = 220. Fourth subject = 300 − 220 = 80.  
**Source tag:** SSC CGL Tier-1 Quant — Average (find the missing score)

### 16.  _easy_

The average of 7 consecutive whole numbers is 20. What is the largest of these numbers?

- (A) 23  ✅
- (B) 22
- (C) 24
- (D) 21

**Answer:** (A)  
**Explanation:** For consecutive numbers the average is the middle (4th) term, so the numbers are 17, 18, 19, 20, 21, 22, 23. The largest is 23.  
**Source tag:** SSC CGL Tier-1 Quant — Average (consecutive numbers)

### 17.  _hard_

A cricketer's average in 10 innings was a certain figure. In the 11th innings he scored 108 runs, which raised his average by 6 runs. What is his new average?

- (A) 45
- (B) 48  ✅
- (C) 50
- (D) 54

**Answer:** (B)  
**Explanation:** Let the old average be x. Then 10x + 108 = 11(x + 6) → 10x + 108 = 11x + 66 → x = 42. New average = 42 + 6 = 48.  
**Source tag:** SSC CGL Tier-1 Quant — Average (algebraic 'raises the average by' type)

### 18.  _medium_

The average of 50 numbers is 38. If two of the numbers, namely 45 and 55, are discarded, what is the average of the remaining numbers?

- (A) 36.5
- (B) 37
- (C) 37.5  ✅
- (D) 38

**Answer:** (C)  
**Explanation:** Total of 50 numbers = 50 × 38 = 1900. After removing 45 + 55 = 100, the total is 1800 over 48 numbers: 1800 ÷ 48 = 37.5.  
**Source tag:** SSC CGL Tier-1 Quant — Average (numbers discarded)

### 19.  _hard_

The average temperature on Monday, Tuesday and Wednesday was 40°C. The average on Tuesday, Wednesday and Thursday was 41°C. If Thursday's temperature was 42°C, what was Monday's temperature?

- (A) 42°C
- (B) 41°C
- (C) 40°C
- (D) 39°C  ✅

**Answer:** (D)  
**Explanation:** Mon + Tue + Wed = 3 × 40 = 120. Tue + Wed + Thu = 3 × 41 = 123, so Tue + Wed = 123 − 42 = 81. Monday = 120 − 81 = 39°C.  
**Source tag:** SSC CGL Tier-1 Quant — Average (rolling three-day window)

### 20.  _medium_

The average of the first three of five numbers is 20 and the average of the last three is 24. If the average of all five numbers is 22, what is the third number?

- (A) 22  ✅
- (B) 20
- (C) 24
- (D) 21

**Answer:** (A)  
**Explanation:** Sum of first three = 60; sum of last three = 72. The third number lies in both groups, so 60 + 72 = (5 × 22) + third number → 132 = 110 + third number → third number = 22.  
**Source tag:** SSC CGL Tier-1 Quant — Average (overlapping first-three / last-three)

---

# Classification / Odd one out  ·  `/ssc/reasoning/classification/`

_18 questions · easy 7 / medium 11 / hard 0 (classification has no genuine hard tier for SSC; hard reasoning lives in puzzles / syllogism, not here) · Redis `quiz:subject:reasoning:ssc:classification`_

> Every item re-solved to confirm exactly one defensible grouping. Items where 'the only even number' or 'the only one-word answer' could compete with the intended rule were rejected during build.

### 1.  _easy_

Three of the following four are alike in a certain way and form a group. Which is the one that does NOT belong to that group?

- (A) Triangle
- (B) Rectangle
- (C) Square
- (D) Cube  ✅

**Answer:** (D)  
**Explanation:** Triangle, rectangle and square are two-dimensional plane figures. A cube is a three-dimensional solid, so it does not belong.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (2D vs 3D)

### 2.  _medium_

Select the number that is different from the rest.

- (A) 37  ✅
- (B) 15
- (C) 21
- (D) 33

**Answer:** (A)  
**Explanation:** 15 = 3 × 5, 21 = 3 × 7 and 33 = 3 × 11 are all composite (and multiples of 3). 37 is a prime number, so it is the odd one out.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (prime vs composite)

### 3.  _easy_

Three of the following four are alike in a certain way. Which one is different?

- (A) Copper
- (B) Brass  ✅
- (C) Silver
- (D) Gold

**Answer:** (B)  
**Explanation:** Copper, silver and gold are pure metals (elements). Brass is an alloy of copper and zinc, so it does not belong.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (element vs alloy)

### 4.  _medium_

Select the number that does NOT belong with the others.

- (A) 24
- (B) 36
- (C) 50  ✅
- (D) 48

**Answer:** (C)  
**Explanation:** 24, 36 and 48 are all multiples of 12. 50 is not divisible by 12, so it is the odd one out.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (common divisor)

### 5.  _medium_

Select the letter cluster that is different from the rest.

- (A) CFI
- (B) GJM
- (C) KNQ
- (D) PRT  ✅

**Answer:** (D)  
**Explanation:** In CFI, GJM and KNQ each letter is 3 places after the previous one (+3, +3). In PRT the step is +2, +2, so it is the odd cluster.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (letter-cluster step pattern)

### 6.  _medium_

Select the number pair that is different from the others.

- (A) (6, 180)  ✅
- (B) (3, 27)
- (C) (4, 64)
- (D) (5, 125)

**Answer:** (A)  
**Explanation:** In each pair the second number is the cube of the first: 3³ = 27, 4³ = 64, 5³ = 125. But 6³ = 216, not 180, so (6, 180) is the odd pair.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (number pair: n, n³)

### 7.  _easy_

Three of the following are alike. Which is the odd one out?

- (A) Guitar
- (B) Violin
- (C) Flute  ✅
- (D) Sitar

**Answer:** (C)  
**Explanation:** Guitar, violin and sitar are stringed instruments. A flute is a wind instrument, so it does not belong.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (instrument family)

### 8.  _medium_

Select the word that does NOT belong with the others.

- (A) Hockey
- (B) Chess  ✅
- (C) Cricket
- (D) Football

**Answer:** (B)  
**Explanation:** Hockey, cricket and football are outdoor field sports played with a ball between two teams. Chess is an indoor board game, so it is the odd one out.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (outdoor field sport vs board game)

### 9.  _easy_

Select the number that is different from the rest.

- (A) 121
- (B) 144
- (C) 169
- (D) 180  ✅

**Answer:** (D)  
**Explanation:** 121 = 11², 144 = 12² and 169 = 13² are perfect squares. 180 is not a perfect square, so it does not belong.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (perfect squares)

### 10.  _medium_

Three of these cities share a common feature. Which city is the exception?

- (A) Bhopal  ✅
- (B) Kolkata
- (C) Mumbai
- (D) Chennai

**Answer:** (A)  
**Explanation:** Kolkata, Mumbai and Chennai are coastal port cities. Bhopal is an inland city with no seaport, so it is the odd one out.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (coastal vs inland cities)

### 11.  _medium_

Select the pair that is different from the others.

- (A) Cobbler : Shoes
- (B) Carpenter : Furniture
- (C) Blacksmith : Iron  ✅
- (D) Tailor : Clothes

**Answer:** (C)  
**Explanation:** In three pairs the worker is matched with the product he makes (shoes, furniture, clothes). 'Blacksmith : Iron' matches the worker with his raw material, not his product.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (worker–product analogy pairs)

### 12.  _easy_

Select the number that does NOT belong with the others.

- (A) 7
- (B) 25  ✅
- (C) 13
- (D) 19

**Answer:** (B)  
**Explanation:** 7, 13 and 19 are prime numbers. 25 = 5 × 5 is composite, so it is the odd one out.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (prime vs composite)

### 13.  _easy_

Three of the following terms are related. Which one is unrelated?

- (A) Radius
- (B) Diameter
- (C) Circumference
- (D) Volume  ✅

**Answer:** (D)  
**Explanation:** Radius, diameter and circumference are all measurements associated with a circle (a plane figure). Volume applies to a solid, so it does not belong.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (circle terms vs volume)

### 14.  _medium_

Select the letter pair that is different from the rest.

- (A) D–V  ✅
- (B) A–Z
- (C) B–Y
- (D) C–X

**Answer:** (A)  
**Explanation:** In each pair the second letter is the mirror of the first from the end of the alphabet: A↔Z, B↔Y, C↔X. D should pair with W, not V, so D–V is the odd pair.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (opposite-letter pairs)

### 15.  _medium_

Three of the following animals belong to one family. Which is the exception?

- (A) Lion
- (B) Tiger
- (C) Wolf  ✅
- (D) Leopard

**Answer:** (C)  
**Explanation:** Lion, tiger and leopard belong to the cat family (Felidae). A wolf belongs to the dog family (Canidae), so it is the odd one out.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (animal family)

### 16.  _medium_

Select the number that does NOT belong with the others.

- (A) 27
- (B) 150  ✅
- (C) 64
- (D) 125

**Answer:** (B)  
**Explanation:** 27 = 3³, 64 = 4³ and 125 = 5³ are perfect cubes. 150 is not a perfect cube, so it is the odd one out.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (perfect cubes)

### 17.  _easy_

Three of the following go together. Which is the odd one out?

- (A) Pen
- (B) Pencil
- (C) Marker
- (D) Eraser  ✅

**Answer:** (D)  
**Explanation:** Pen, pencil and marker are instruments used for writing. An eraser is used to remove writing, so it does not belong.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (function: write vs erase)

### 18.  _medium_

Select the month that is different from the others.

- (A) November  ✅
- (B) January
- (C) March
- (D) May

**Answer:** (A)  
**Explanation:** January, March and May each have 31 days. November has 30 days, so it is the odd one out.  
**Source tag:** SSC CGL Tier-1 Reasoning — Classification (days in the month)

---

# Idioms & Phrases  ·  `/ssc/english/idioms-phrases/`

_14 questions · easy 7 / medium 7 / hard 0 · Redis `quiz:subject:english:ssc:idioms-phrases`_

> Each idiom has one settled dictionary meaning; distractors are literal misreadings or near-miss idioms. None of the distractors is a defensible paraphrase of the target idiom.

### 1.  _easy_

Select the option that best expresses the meaning of the idiom: 'to beat about the bush'.

- (A) To attack someone without warning
- (B) To avoid coming to the main point  ✅
- (C) To search a place thoroughly
- (D) To spend money recklessly

**Answer:** (B)  
**Explanation:** 'Beat about the bush' means to talk around a subject and delay addressing the main issue. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 2.  _medium_

Choose the correct meaning of the idiom: 'to bury the hatchet'.

- (A) To hide a weapon carefully
- (B) To revive an old dispute
- (C) To make peace and end a quarrel  ✅
- (D) To prepare secretly for a fight

**Answer:** (C)  
**Explanation:** 'Bury the hatchet' means to settle a disagreement and become friendly again. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 3.  _medium_

What does the phrase 'a wild goose chase' mean?

- (A) An exciting outdoor adventure
- (B) A well-organised group hunt
- (C) A clever and profitable scheme
- (D) A foolish search that leads nowhere  ✅

**Answer:** (D)  
**Explanation:** 'A wild goose chase' is a hopeless pursuit of something that cannot be found or achieved. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 4.  _easy_

Select the correct meaning of the idiom: 'to let the cat out of the bag'.

- (A) To create sudden confusion
- (B) To reveal a secret carelessly  ✅
- (C) To free someone from blame
- (D) To pick a needless quarrel

**Answer:** (B)  
**Explanation:** 'Let the cat out of the bag' means to disclose a secret, usually by accident. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 5.  _easy_

What does the idiom 'once in a blue moon' mean?

- (A) Very rarely  ✅
- (B) Very frequently
- (C) Only late at night
- (D) All of a sudden

**Answer:** (A)  
**Explanation:** 'Once in a blue moon' means something that happens very seldom. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 6.  _medium_

Select the correct meaning of the idiom: 'to hit the nail on the head'.

- (A) To punish somebody severely
- (B) To act with unnecessary force
- (C) To say exactly the right thing  ✅
- (D) To finish a job in a hurry

**Answer:** (C)  
**Explanation:** 'Hit the nail on the head' means to describe or identify something exactly and correctly. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 7.  _easy_

What does the idiom 'to be in hot water' mean?

- (A) To be in a comfortable position
- (B) To be extremely angry
- (C) To be short of time
- (D) To be in trouble or difficulty  ✅

**Answer:** (D)  
**Explanation:** 'In hot water' means in a situation of trouble or disgrace. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 8.  _medium_

Select the correct meaning of the idiom: 'to turn a deaf ear'.

- (A) To listen with great care
- (B) To refuse to pay any attention  ✅
- (C) To misunderstand on purpose
- (D) To gradually lose one's hearing

**Answer:** (B)  
**Explanation:** 'Turn a deaf ear' means to ignore what someone says or a request for help. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 9.  _medium_

What does the idiom 'to make a mountain out of a molehill' mean?

- (A) To exaggerate a trivial problem  ✅
- (B) To attempt an impossible task
- (C) To take a dangerous risk
- (D) To solve a hard problem cleverly

**Answer:** (A)  
**Explanation:** The idiom means to treat a minor difficulty as if it were a serious one. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 10.  _medium_

Select the correct meaning of the idiom: 'to smell a rat'.

- (A) To notice a foul odour
- (B) To dislike a person intensely
- (C) To suspect that something is wrong  ✅
- (D) To discover a hidden object

**Answer:** (C)  
**Explanation:** 'Smell a rat' means to sense that something is wrong or that one is being deceived. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 11.  _medium_

What does the idiom 'to add fuel to the fire' mean?

- (A) To work with fresh energy
- (B) To make a bad situation worse  ✅
- (C) To encourage someone kindly
- (D) To light a fire with difficulty

**Answer:** (B)  
**Explanation:** 'Add fuel to the fire' means to do or say something that makes an already bad or tense situation worse. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 12.  _easy_

Select the correct meaning of the idiom: 'to cry over spilt milk'.

- (A) To complain about small matters
- (B) To weep for no clear reason
- (C) To blame others for a loss
- (D) To waste time regretting what cannot be undone  ✅

**Answer:** (D)  
**Explanation:** 'Cry over spilt milk' means to waste time being upset about something that has already happened and cannot be changed. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 13.  _easy_

What does the idiom 'to be all ears' mean?

- (A) To be eager and ready to listen  ✅
- (B) To be easily distracted
- (C) To spread a rumour
- (D) To listen in secret

**Answer:** (A)  
**Explanation:** 'All ears' means listening eagerly and with full attention. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

### 14.  _easy_

Select the correct meaning of the idiom: 'to keep one's fingers crossed'.

- (A) To behave dishonestly
- (B) To make a solemn promise
- (C) To hope for a good outcome  ✅
- (D) To feel restless and nervous

**Answer:** (C)  
**Explanation:** 'Keep one's fingers crossed' means to hope that something will happen the way one wants. Source: standard idiom dictionary.  
**Source tag:** SSC CGL Tier-1 English — Idioms & Phrases

---

# Fundamental Rights & DPSP  ·  `/ssc/polity/fundamental-rights/`

_16 questions · easy 4 / medium 8 / hard 4 · Redis `quiz:subject:polity:ssc:fundamental-rights`_

> Source grounding: Constitution of India (Parts III, IVA, IV); M. Laxmikanth, Indian Polity

### 1.  _easy_

Which Article of the Indian Constitution abolishes untouchability and forbids its practice in any form?

- (A) Article 17  ✅
- (B) Article 14
- (C) Article 19
- (D) Article 21

**Answer:** (A)  
**Explanation:** Article 17 abolishes 'untouchability' and makes its practice in any form an offence punishable by law. Source: Constitution of India, Part III.  
**Source tag:** Constitution of India, Article 17

### 2.  _easy_

The Right to Constitutional Remedies, which Dr. B. R. Ambedkar called the 'heart and soul' of the Constitution, is provided under which Article?

- (A) Article 19
- (B) Article 32  ✅
- (C) Article 226
- (D) Article 44

**Answer:** (B)  
**Explanation:** Article 32 gives every citizen the right to move the Supreme Court directly for the enforcement of Fundamental Rights. (Article 226 gives similar power to High Courts but is not a Fundamental Right.) Source: Constitution of India, Part III; Laxmikanth.  
**Source tag:** Constitution of India, Article 32

### 3.  _hard_

Which writ is issued by a court to quash an order already passed by a lower court, tribunal or quasi-judicial authority?

- (A) Mandamus
- (B) Prohibition
- (C) Certiorari  ✅
- (D) Quo Warranto

**Answer:** (C)  
**Explanation:** Certiorari is issued to quash an order already passed by a lower body. Prohibition, by contrast, is issued to stop proceedings that are still going on. Source: Laxmikanth, Indian Polity (Writs).  
**Source tag:** Laxmikanth, Indian Polity — Writs under Article 32

### 4.  _easy_

The Directive Principles of State Policy are contained in which Part of the Constitution?

- (A) Part II
- (B) Part III
- (C) Part IVA
- (D) Part IV  ✅

**Answer:** (D)  
**Explanation:** The Directive Principles of State Policy are in Part IV (Articles 36 to 51). Part III holds the Fundamental Rights and Part IVA the Fundamental Duties. Source: Constitution of India.  
**Source tag:** Constitution of India, Part IV

### 5.  _medium_

Which Article states that the Directive Principles of State Policy shall not be enforceable by any court?

- (A) Article 37  ✅
- (B) Article 32
- (C) Article 40
- (D) Article 51

**Answer:** (A)  
**Explanation:** Article 37 declares that the Directive Principles are not enforceable by any court but are nevertheless fundamental in the governance of the country. Source: Constitution of India, Part IV.  
**Source tag:** Constitution of India, Article 37

### 6.  _medium_

The idea of Directive Principles of State Policy in the Indian Constitution was borrowed from the Constitution of which country?

- (A) United States
- (B) Ireland  ✅
- (C) Canada
- (D) Australia

**Answer:** (B)  
**Explanation:** The Directive Principles were adopted from the Irish Constitution, which had itself taken the idea from Spain. Source: Laxmikanth, Indian Polity (Sources of the Constitution).  
**Source tag:** Laxmikanth, Indian Polity — Borrowed features

### 7.  _medium_

The Right to Education for children aged 6 to 14 years was made a Fundamental Right by which Constitutional Amendment?

- (A) 44th Amendment
- (B) 42nd Amendment
- (C) 86th Amendment  ✅
- (D) 73rd Amendment

**Answer:** (C)  
**Explanation:** The 86th Amendment Act, 2002 inserted Article 21A, making free and compulsory education for children aged 6–14 a Fundamental Right. Source: Constitution of India; Laxmikanth.  
**Source tag:** Constitution of India, Article 21A (86th Amendment, 2002)

### 8.  _medium_

Which of the following was removed from the list of Fundamental Rights and is now only a constitutional (legal) right under Article 300A?

- (A) Right to Equality
- (B) Right to Freedom of Religion
- (C) Right against Exploitation
- (D) Right to Property  ✅

**Answer:** (D)  
**Explanation:** The Right to Property was deleted as a Fundamental Right by the 44th Amendment Act, 1978, and made a legal right under Article 300A. Source: Constitution of India; Laxmikanth.  
**Source tag:** Constitution of India, Article 300A (44th Amendment, 1978)

### 9.  _hard_

How many freedoms are currently guaranteed to citizens under Article 19 of the Constitution?

- (A) Six  ✅
- (B) Seven
- (C) Five
- (D) Eight

**Answer:** (A)  
**Explanation:** Article 19 originally guaranteed seven freedoms, but the freedom 'to acquire, hold and dispose of property' was removed by the 44th Amendment, 1978, leaving six. Source: Constitution of India; Laxmikanth.  
**Source tag:** Constitution of India, Article 19

### 10.  _hard_

The Fundamental Duties were added to the Constitution on the recommendation of which committee?

- (A) Sarkaria Committee
- (B) Swaran Singh Committee  ✅
- (C) Balwant Rai Mehta Committee
- (D) Ashok Mehta Committee

**Answer:** (B)  
**Explanation:** The Swaran Singh Committee (1976) recommended the inclusion of Fundamental Duties, which were added by the 42nd Amendment Act, 1976. Source: Laxmikanth, Indian Polity.  
**Source tag:** Laxmikanth, Indian Polity — Fundamental Duties

### 11.  _medium_

Fundamental Duties of citizens are listed in which Article of the Constitution?

- (A) Article 21A
- (B) Article 44
- (C) Article 51A  ✅
- (D) Article 48A

**Answer:** (C)  
**Explanation:** Article 51A (in Part IVA) lists the Fundamental Duties of citizens. Article 48A, added by the same amendment, is a Directive Principle on protecting the environment. Source: Constitution of India.  
**Source tag:** Constitution of India, Article 51A

### 12.  _hard_

How many Fundamental Duties were originally included in the Constitution by the 42nd Amendment in 1976?

- (A) Eleven
- (B) Nine
- (C) Eight
- (D) Ten  ✅

**Answer:** (D)  
**Explanation:** Ten Fundamental Duties were added in 1976. An eleventh duty (a parent/guardian providing education to their child aged 6–14) was added by the 86th Amendment, 2002. Source: Constitution of India; Laxmikanth.  
**Source tag:** Constitution of India, Article 51A; Laxmikanth

### 13.  _medium_

Which Article permits the State to make special provisions for women and children?

- (A) Article 15(3)  ✅
- (B) Article 16(4)
- (C) Article 19(1)
- (D) Article 29(2)

**Answer:** (A)  
**Explanation:** Article 15(3) allows the State to make special provisions for women and children, as an exception to the general ban on discrimination in Article 15(1). Source: Constitution of India, Part III.  
**Source tag:** Constitution of India, Article 15(3)

### 14.  _medium_

Protection against arbitrary arrest and detention in certain cases is guaranteed under which Article?

- (A) Article 20
- (B) Article 22  ✅
- (C) Article 24
- (D) Article 25

**Answer:** (B)  
**Explanation:** Article 22 provides safeguards to a person who is arrested or detained, including the right to be informed of the grounds of arrest and to consult a lawyer. Article 20 deals with protection in respect of conviction for offences. Source: Constitution of India, Part III.  
**Source tag:** Constitution of India, Article 22

### 15.  _easy_

Which Article guarantees 'equality before the law and equal protection of the laws' within the territory of India?

- (A) Article 12
- (B) Article 13
- (C) Article 14  ✅
- (D) Article 16

**Answer:** (C)  
**Explanation:** Article 14 guarantees to every person equality before the law and the equal protection of the laws. Article 16 deals specifically with equality of opportunity in public employment. Source: Constitution of India, Part III.  
**Source tag:** Constitution of India, Article 14

### 16.  _medium_

The Directive Principle requiring the State to organise village panchayats as units of self-government is contained in which Article?

- (A) Article 44
- (B) Article 48
- (C) Article 39A
- (D) Article 40  ✅

**Answer:** (D)  
**Explanation:** Article 40 directs the State to organise village panchayats and give them the powers needed to function as units of self-government. Article 44 concerns a Uniform Civil Code; Article 39A concerns equal justice and free legal aid. Source: Constitution of India, Part IV.  
**Source tag:** Constitution of India, Article 40

---

