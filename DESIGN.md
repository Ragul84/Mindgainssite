---
name: MindGains QuizHub
description: A calm, focused mobile-first practice experience for high-stakes Indian exam preparation.
colors:
  primary: "#0A0F0D"
  surface: "#101713"
  accent: "#7BE3B0"
  text: "#FFFFFF"
  muted: "rgba(255,255,255,.62)"
typography:
  display:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: 10px
  md: 16px
  lg: 24px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 14px
---

## Overview

QuizHub is a focused practice surface, not a marketing page. The question, answer choices, and next action take priority over decoration.

## Colors

Use the mint accent only for the primary action, progress, and concise labels. Surfaces use subtle borders instead of glow effects.

## Typography

Question prompts are clear and high contrast. Premise cards use compact but readable text; never reduce instructional copy below 13px on mobile.

## Layout

Mobile layouts use one column, a maximum of two compact footer link columns, and no horizontal overflow. Long labels truncate rather than wrap in navigation chips.

## Elevation & Depth

Use one restrained shadow for a contained panel. Do not use animated or multicolour glow shadows on controls.

## Shapes

Controls have consistent rounded corners. Pills are reserved for short status labels and compact navigation.

## Components

Statement questions show every premise as a numbered card followed by a distinct prompt. The footer provides concise navigation and legal information without becoming a second page.

## Do's and Don'ts

Do make the primary next step obvious. Do preserve source question content exactly. Don't replace answer options, rely on animated borders, or allow long tags to wrap into awkward two-line pills.

## UPSC Polity SEO Cluster

This is the first programmatic cluster to expand. Keep it narrow, high-intent, and internally linked.

### Route map

| Route | Role | Primary search intent |
| --- | --- | --- |
| `/upsc/polity/` | Cluster hub | UPSC polity practice, topic discovery, syllabus entry |
| `/upsc/polity/fundamental-rights/` | Topic hub | Fundamental Rights MCQ, Article 14-32 quiz |
| `/upsc/polity/dpsp/` | Topic hub | DPSP quiz, Article 36-51 practice |
| `/upsc/polity/parliament/` | Topic hub | Parliament MCQ, legislative process questions |
| `/upsc/polity/judiciary/` | Topic hub | Supreme Court, judicial review, tribunal practice |
| `/upsc/polity/federalism/` | Topic hub | Federalism in India quiz, Centre-State relations |
| `/upsc/polity/executive/` | Topic hub | President, PM, Council of Ministers practice |
| `/upsc/polity/constitutional-bodies/` | Topic hub | Election Commission, CAG, UPSC, constitutional bodies |
| `/upsc/polity/local-govt/` | Topic hub | Panchayati Raj, municipalities, local bodies |

### Cluster ordering

1. Fundamental Rights
2. DPSP
3. Parliament
4. Judiciary
5. Federalism
6. Executive
7. Constitutional Bodies
8. Local Government

### Page template

Every topic page should follow the same structure:

1. Hero
   - short title
   - 1-sentence promise
   - breadcrumb trail
   - one primary CTA to start practice
2. Topic summary
   - 100-150 words
   - clear definition
   - why it matters for UPSC
3. High-signal facts
   - 5-8 bullet points
   - article references where relevant
   - no filler
4. Practice entry
   - 5-10 representative questions
   - one question per card
   - answer options stay visible and readable
5. Explanation block
   - correct answer
   - short reason
   - article / source link
6. Related links
   - adjacent polity topics
   - one level up to `/upsc/polity/`

### Metadata template

- `title`: `Topic Name | UPSC Polity | MindGains`
- `description`: `Practice {topic} MCQs for UPSC with short explanations, article references, and related polity topics.`
- `og:title`: same as title
- `og:description`: same as description
- `canonical`: the clean trailing-slash route

### Schema template

Add JSON-LD on every topic page:

- `BreadcrumbList`
- `Quiz`
- `LearningResource`

### Internal linking rules

- Hub links to every child topic.
- Each topic links back to the hub and to two adjacent topics.
- Explanations can link to the relevant Constitution article or concept page.
- Keep anchors short and descriptive.

### Content rules

- Preserve exact question wording where a question is sourced from the existing corpus.
- If a page is a generated practice page, label it as practice rather than PYQ.
- Keep intro copy concise; do not bury the quiz beneath long essays.
- Explain why an answer is right, not just which option is correct.
