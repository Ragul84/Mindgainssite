# MindGains — Actual Public Search Surface Audit

**Date:** 2026-08-30
**Scope:** Read-only inspection of the deployed web repo (`C:\mindgains-waitlist`). No code, routes, metadata, sitemap, DB or Git changes.
**Purpose:** Establish what is *actually built and indexable* today, versus what the earlier 383-row `keyword-validation.csv` implied, so SEO decisions are made against reality.

---

## 0. Method

- Traced every generator (`scripts/*.cjs`, `*.js`) to the URLs it writes, not filenames.
- Counted `index.html` on disk, cross-checked against `sitemap.xml`, `robots.txt`, `_redirects`, `.assetsignore`, `wrangler.jsonc`.
- Parsed every `assets/quiz-data/**/*.json` for real question counts.
- Inspected representative pages per route family for `<title>`, `<h1>`, `rel=canonical`, `noindex`, `data-quiz-src`, internal links, schema.
- Reconciled all counts arithmetically (shown below).

---

## 1. Route families that can produce a public page

| # | Route family | URL pattern | Pages | Indexable | In sitemap | Canonical | Source data | Generator |
|---|---|---|---|---|---|---|---|---|
| 1 | Home | `/` | 1 | yes | yes | self | hand | hand-authored `index.html` |
| 2 | Exam hub | `/{exam}/` | 6 | yes | yes (pri 0.9) | self | `HUBS{}` config | `scripts/build-exam-hubs.cjs` |
| 3 | Exam → subject | `/{exam}/{subject}/` | 52 | yes | yes | self | `assets/quiz-data/{exam}/{subject}/*` | `scripts/build-public-quiz.cjs` |
| 4 | Exam → subject → topic (UPSC/TNPSC/SSC/RRB) | `/{exam}/{subject}/{topic}/` | 206 | yes | yes | self | `assets/quiz-data/{exam}/{subject}/{topic}.json` | `build-public-quiz.cjs` |
| 5 | Textbook → subject → class (NCERT/Samacheer) | `/{ncert\|samacheer}/{subject}/class{N}/` | 118 | yes | yes | self | `assets/quiz-data/{ncert\|samacheer}/{subject}/class{N}.json` | `build-public-quiz.cjs` |
| 6 | Quiz Hub | `/quiz/` | 1 | yes | **NO** (generator excludes `/quiz/`) | self | `assets/quiz-index.json` | `build-public-quiz.cjs` |
| 7 | **Legacy `/quiz/` mirror** | `/quiz/{exam}/{subject}[/{topic}]/` | **383** | yes (crawlable) | **NO** | **self — points at the `/quiz/` URL, NOT the canonical bare URL** | same JSON as families 3–5 | stale `build-public-quiz.cjs` output; `redirectPage()`/`legacyQuizPath()` exist in the generator but were **not applied** — these are full duplicate pages, 324 of them with a live quiz player |
| 8 | Editorial hub | `/editorial/` | 1 | yes | yes | self | `content/` + `build-blog.cjs` | `scripts/build-blog.cjs` |
| 9 | Editorial article | `/editorial/{slug}/` | 6 | yes | **NO** | self | `build-blog.cjs` | `build-blog.cjs` |
| 10 | Blog hub | `/blog/` | 1 | yes | **NO** | self | `content/blog/*.md` | `build-blog.cjs` |
| 11 | Blog post | `/blog/{slug}/` | 2 | yes | **NO** | self | `content/blog/*.md` (1 md present) | `build-blog.cjs` |
| 12 | Daily Dose | `/daily-dose/` | 1 | yes | **NO** | self | — | hand-authored |
| 13 | Know Your India | `/know-your-india/` | 1 | yes | yes | self | `assets/data/mla_2026.json`, `mp_2024.json`, `states_gk.json`, `states_meta.json`, `civics_lessons.json` | hand-authored (client renders the JSON) |
| 14 | MISA (Miga Call / Math Mode) | `/misa/` | 1 | yes | **NO** | self | — | hand-authored |
| 15 | Study Lab | `/study-lab/` | 1 | yes | yes | self | — | hand-authored |
| 16 | Chat | `/chat/` | 1 | yes | yes | self | — | hand-authored |
| 17 | Early access | `/get/` | 1 | **NOINDEX** | no | self | — | hand-authored |
| 18 | Legacy redirects | `/waitlist.html`, `/waitlist` → `/get/` 301 | — | n/a | no | n/a | `_redirects` | Cloudflare |

### Route families that DO NOT exist

- No `exam → subject → topic → concept` (4th level). Leaf = the topic quiz.
- No **individual question / per-question URL**. 169k questions live inside 324 JSON blobs, rendered client-side.
- No **NCERT/Samacheer chapter** tier. The tree stops at `class{N}`.
- No `/mock-test/`, `/online-test/`, `/pyq/`, `/{exam}/pyq/`, `/{exam}/group-4/` route family. "PYQ" / "mock" appear only as marketing words in `build-exam-hubs.cjs` copy.
- No per-Daily-Dose lesson route. `/daily-dose/` is a single page.
- No generated pages off the Know-Your-India datasets (816 MLAs / 529 MPs / 36 states are all collapsed into one `/know-your-india/` URL).

---

## 2. What the "383" number actually is

`assets/quiz-index.json` (the search index built by `build-public-quiz.cjs`) contains **383 entries**: 1 Hub (`/quiz/`) + 6 Exam + 52 Subject + 324 Topic/Class. `keyword-validation.csv` was generated from this file, so its 383 rows = **the complete canonical practice tree plus the Quiz Hub**.

**Reconciliation:**

```
sitemap.xml            = 387 URLs
  1   /                        (home)
  6   /{exam}/                 (exam hubs, build-exam-hubs.cjs)
  52  /{exam}/{subject}/       (build-public-quiz.cjs)
  324 /{exam}/{subject}/{leaf}/ (206 topic + 118 class)
  4   /chat/ /editorial/ /know-your-india/ /study-lab/

keyword-validation.csv = 383 rows
  = 382 bare-tree pages (6 hub + 52 subject + 324 leaf)
  + 1  /quiz/ hub
  − 5  it never included /, /chat/, /editorial/, /know-your-india/, /study-lab/

on-disk index.html     = 782 total
  = 398 real/canonical SEO pages
  + 383 orphaned duplicate /quiz/* pages
  + 1  noindex (/get/)
```

**So "383" ≈ the entire canonical quiz/practice SEO tree.** It is **not** a subset of a larger *generated route system* — the bare tree is the whole generated SEO tree. But the 383 view **omitted**:

- 5 non-quiz sitemap URLs (`/`, `/chat/`, `/editorial/`, `/know-your-india/`, `/study-lab/`)
- 6 editorial articles + `/blog/` + 2 posts + `/daily-dose/` + `/misa/` — **11 indexable pages not in the sitemap and never audited**
- The **383-page `/quiz/*` duplicate tree** — self-canonical, crawlable, entirely absent from every SEO artifact so far
- The **169,399 questions** and the **Know-Your-India datasets** behind the routes (content mass, not URL count)

---

## 3. Deep-endpoint verification (the examples asked about)

| Example asked | Exists? | Actual URL on the site | Indexable | In sitemap |
|---|---|---|---|---|
| `/upsc/polity/` | **YES** | `/upsc/polity/` | yes (canonical self) | yes |
| `/upsc/polity/fundamental-rights/` | **YES** | `/upsc/polity/fundamental-rights/` — real quiz, `data-quiz-src=/assets/quiz-data/upsc/polity/fundamental-rights.json`, 420 Qs | yes | yes |
| `/tnpsc/polity/` | **YES** | `/tnpsc/polity/` (+ 12 topic children: dpsp, fundamental-rights, judiciary, parliament, preamble, elections, …) | yes | yes |
| `/tnpsc/group-4/` | **NO** | — (TNPSC is one hub `/tnpsc/`; no group-specific routes) | — | — |
| `/ncert/class-10/science/` | **Different shape** | `/ncert/science/class10/` exists (300 Qs) | yes | yes |
| `/ncert/class-10/science/electricity/` | **NO** | — (no chapter tier; class is the leaf) | — | — |
| `/samacheer/{subject}/class{N}/` | **YES** | e.g. `/samacheer/tamil/class10/` (492 Qs) | yes | yes |

Every exam→subject→topic and textbook→subject→class page the earlier discussion treated as "to be built" **already exists, is statically rendered, is self-canonical, and is in the sitemap.** What genuinely does not exist: the 4th level (concept / chapter), group-specific exam routes, mock/PYQ routes, and per-question pages.

---

## 4. Data depth behind the routes

### Quiz content (`assets/quiz-data/**` — 324 JSON files)

| Exam | Questions | Leaf pages |
|---|---:|---:|
| SSC | 40,975 | 45 |
| TNPSC | 38,095 | 84 |
| Samacheer | 28,458 | 67 |
| UPSC | 28,086 | 62 |
| NCERT | 23,031 | 51 |
| RRB | 10,754 | 15 |
| **Total** | **169,399** | **324** |

Question schema: `question, options, answer_index, explanation, difficulty`.
**No `year`, `source`, `pyq` or `chapter` field.** → **Zero verified PYQs in the dataset.** `pyq_safe = false` across the board remains correct. Chapter-level pages are **not** possible from existing data without re-tagging.

### Taxonomy objects vs public URLs

| Object | Count (data) | Public URLs today |
|---|---:|---:|
| Exams | 6 | 6 hubs |
| Subjects | 52 | 52 |
| Topics / classes (leaf) | 324 | 324 |
| Concepts | 0 | 0 |
| Chapters (NCERT/Samacheer) | 0 as tagged data | 0 |
| Questions | 169,399 | 0 addressable individually |
| Verified PYQs | 0 | 0 |
| Textbook classes | NCERT: Bio 11–12, Chem 11–12, Phys 11–12, Eco 9–12, Eng 6–10, Geo 6–12, Hist 6–12, Maths 6–10, Polity 6–12, Sci 6–10, SocSci 6–10 · Samacheer: 13 subjects × classes 6–12 | 118 class pages |
| Mock tests | 0 | 0 |
| Daily Dose lessons | 1 page (no lesson data exposed) | 1 |

### Know-Your-India structured data (`assets/data/`)

| Dataset | Records | Shape | Public URLs today |
|---|---:|---|---:|
| `mla_2026.json` | **816** | `{ac, winner, party, abbr, state}` — assembly constituencies | 0 (1 page renders all) |
| `mp_2024.json` | **529** | `{pc, state, mp, party, abbr, margin}` — parliamentary constituencies | 0 |
| `states_gk.json` | **36** | `{capital, language, formed, facts[]}` | 0 |
| `states_meta.json` | **36** | `{state, districts, assembly, lokSabha, population, tagline}` | 0 |
| `civics_lessons.json` | 5 | lesson objects with sections | 0 |

`/know-your-india/` is a **5 KB single page** sitting on ~1,400 addressable civic entities.

### Editorial / blog

- 6 editorial articles (`ai-in-education`, `current-affairs`, `daily-learning`, `exams`, `learning-psychology`, `quiz-practice`) + `/editorial/` hub
- `/blog/` hub + 2 posts (`india-learning-crisis`, `why-serious-aspirants-dont-trust-ai`); `content/blog/` has 1 source `.md`

---

## 5. What Google can actually discover today

| Signal | State |
|---|---|
| `robots.txt` | `User-agent: * / Allow: / / Sitemap: …/sitemap.xml`. Nothing disallowed. **`/quiz/` is NOT blocked.** |
| `sitemap.xml` | 387 URLs: home + 6 exam hubs + 52 subjects + 324 leaves + `/chat/` `/editorial/` `/know-your-india/` `/study-lab/`. Priorities 0.7–1.0, `changefreq weekly`. **Excludes** `/quiz/*`, the 6 editorial articles, `/blog/*`, `/daily-dose/`, `/misa/`. |
| Regenerated by | `build-public-quiz.cjs` writes the full sitemap and explicitly filters `u.startsWith('/quiz/')`. `build-exam-hubs.cjs` only rewrites the 6 hub lines' priority. `build-blog.cjs` does **not** touch the sitemap → editorial/blog stay out. |
| `noindex` | Only `/get/`. |
| Canonicals | Bare tree, editorial, blog, daily-dose, kyi, misa → correct self-canonical. **`/quiz/*` (383 pages) → self-canonical to their own `/quiz/` URL**, so they do **not** consolidate into the canonical bare tree. |
| Rendering | 100% static pre-rendered HTML on Cloudflare static assets (`wrangler.jsonc assets.directory:"."`). Titles/H1s/body present without JS. Good. |
| Internal linking | Global footer nav (present on quiz pages) links the **top-level families** (`/upsc/`, `/tnpsc/`, `/ssc/`, `/samacheer/`, `/ncert/`, `/editorial/`, `/know-your-india/`, `/daily-dose/`, `/blog/`, `/study-lab/`, `/misa/`). Quiz Hub `/quiz/` search + cards link to the **bare** tree. Subject pages link to their topic children; topic pages carry "Related Topics" (6). **Exam hubs `/upsc/` link to only ~6 deep URLs each** (1–2 subjects + a handful of topic chips) — not to all subjects/topics. |
| Orphaned dupes | Bare-tree pages contain **0 links** to `/quiz/*`. The current `/quiz/` hub links to the bare tree. So the 383 `/quiz/*` dupes are **effectively orphaned on the live site** — reachable only via direct URL, historical index, or the stale `/quiz/{exam}/{subject}/` pages linking among themselves. |
| Schema | `BreadcrumbList` + `Organization` on quiz pages; `FAQPage` + `BreadcrumbList` on exam hubs. **No `Quiz` / `LearningResource` / `ItemList` / `Course` schema anywhere.** |

**Realistically discoverable & indexable today:** the 387 sitemap URLs (static, linked, canonical). **Weakly discoverable:** 6 editorial articles + 3 blog pages + `/daily-dose/` + `/misa/` (indexable, static, in footer nav, but absent from sitemap). **At risk of wasteful crawling / split signals:** the 383 self-canonical `/quiz/*` duplicates.

---

## 6. Hidden SEO opportunity in what already exists

1. **383 canonical quiz/practice pages with generic auto-titles.** Every leaf is `"<Topic> Quiz | <Exam> <Subject> | MindGains"` / H1 `"<Topic> Quiz"`; every subject is `"<Exam> <Subject> Quizzes | MindGains"` / H1 `"<Subject> Quizzes"`; NCERT/Samacheer leaves are literally `"Class10 Quiz"`. Zero keyword targeting. `keyword-validation.csv` already proposes better wording for all 383 — this is the single biggest lever and needs **no new pages**, only a title/H1 pass once volumes land.
2. **383-page `/quiz/*` duplicate tree.** Should be 301 redirects (or `<link canonical>` to the bare URL), per the generator's own unused `redirectPage()`. Currently: crawl-budget drain + self-canonical duplicates of the money pages. Cleaning this **concentrates** authority on the canonical tree.
3. **Editorial + blog (9 articles) not in the sitemap and barely internally linked.** Informational intent ("current affairs for upsc", "how india is governed") with content already written. Add to sitemap + link from relevant hubs.
4. **`/daily-dose/` and `/misa/` not in the sitemap.**
5. **Exam hubs don't link down to their own deep pages.** `/upsc/` → 6 deep links out of 70. Adding subject/topic link blocks to the 6 hubs would push internal PageRank into 380+ existing pages with no new content.
6. **Know-Your-India: ~1,400 civic entities, 1 URL.** 816 MLAs + 529 MPs + 36 states already sit as structured JSON. Constituency / MP / state pages map to real, mostly-unserved search demand ("{constituency} mla", "{state} capital and facts", "{state} gk for tnpsc"). This is "existing content, no new writing" — only templating.
7. **No `Quiz`/`LearningResource` schema** on 324 pages that are literally quizzes — free rich-result eligibility.
8. **169,399 questions, 0 grouped views.** Difficulty is tagged on every question; "easy/hard" or "practice set of N" groupings are possible from existing data (lower priority — dup risk).

---

## 7. Comparison against the prior SEO artifacts

| Artifact | What it saw | What it missed |
|---|---|---|
| `scripts/seo/keyword-validation.csv` (383 rows) | The canonical bare tree (6 hubs + 52 subjects + 324 leaves) + `/quiz/` hub, with current + proposed title/H1 per URL | The 383 `/quiz/*` duplicate tree · editorial (7) · blog (3) · `/daily-dose/` · `/misa/` · the 169k-question content mass · the KYI datasets · that these pages are **already indexed**, not hypothetical |
| `scripts/seo/kwp-opportunities.csv` + KWP pull #1 | Hub-tier demand (`tnpsc online test`, `ssc cgl reasoning questions`, …); flagged "gaps" like `/tnpsc/group-4/`, `/ssc/practice-papers/` | Those gaps are **genuinely new** — correct. But the framing implied deep exam/subject/topic pages might need building; **they already exist.** The real gap is *optimising 383 live pages*, not creating them. |
| KWP pull #2 seed file (`kwp-pull-2-upload.csv`) | Correctly seeds the subject/topic/class/chapter idioms | Chapter idioms (`photosynthesis class 11 mcq`) seed keywords for pages that **do not exist and cannot be built from current data** (no chapter field). Useful for demand sizing, not immediately actionable. |
| `sitemap.xml` generation | Bare tree + 4 misc | build-blog.cjs output; `/daily-dose/`; `/misa/` |
| `assets/quiz-index.json` | 383 canonical entries | Everything outside the quiz tree |

**Why the previous analysis looked smaller than reality:** it was built entirely from `quiz-index.json`, which only indexes the quiz tree. It therefore modelled MindGains' SEO surface as "383 quiz URLs to optimise or build," when the true picture is "398 live indexable pages (382 of them already the right deep pages, just generically titled), 383 duplicate pages to collapse, and ~1,400 civic entities + 169k questions of structured depth that are currently invisible to search."

---

# A. What MindGains already has

- **6 exam hubs** (`/upsc/ /tnpsc/ /ssc/ /rrb/ /ncert/ /samacheer/`) — hand-configured, keyword-optimised locked titles, FAQ + Breadcrumb schema.
- **52 subject pages** and **324 topic/class leaf quiz pages** — the full `exam → subject → topic` (UPSC/TNPSC/SSC/RRB) and `textbook → subject → class` (NCERT/Samacheer) trees — **already built, static, self-canonical, in the sitemap**, each with a working client-side quiz player.
- **169,399 practice questions** (SSC 40,975 · TNPSC 38,095 · Samacheer 28,458 · UPSC 28,086 · NCERT 23,031 · RRB 10,754) with explanations and difficulty tags.
- **A Quiz Hub** (`/quiz/`) with client-side search over all 383 entries.
- **9 editorial/blog articles** + hubs.
- **Know-Your-India datasets**: 816 MLAs, 529 MPs, 36 states (×2 datasets), 5 civics lessons.
- Supporting pages: `/daily-dose/`, `/misa/`, `/study-lab/`, `/chat/`, `/know-your-india/`.
- Build pipeline: `build-exam-hubs.cjs`, `build-public-quiz.cjs`, `build-blog.cjs`, nav/footer injectors.

# B. What is currently indexable

- **387 URLs in `sitemap.xml`**: `/` + 6 exam hubs + 52 subjects + 324 leaves + `/chat/` + `/editorial/` + `/know-your-india/` + `/study-lab/`. All static, self-canonical, `Allow: /`, no `noindex`.
- **+11 indexable pages NOT in the sitemap** (crawlable, static, self-canonical, footer-linked): 6 editorial articles, `/blog/` + 2 posts, `/daily-dose/`, `/misa/`.
- **Total genuinely indexable, unique-canonical pages: ~398.**
- Not indexable: `/get/` (`noindex`).

# C. What exists but Google is not being shown properly

- **383 `/quiz/{exam}/{subject}[/{topic}]/` duplicate pages** — full copies of the canonical bare tree, **self-canonical to their own `/quiz/` URL** (not to the canonical), not in the sitemap, `robots` allows them, now orphaned from live internal links but historically crawlable. They dilute rather than consolidate.
- **6 editorial articles + `/blog/` + 2 posts + `/daily-dose/` + `/misa/`** — indexable but absent from the sitemap; `build-blog.cjs` never registers them.
- **380+ deep quiz pages** — in the sitemap but reachable from the exam hubs via only ~6 links each; thin internal-link equity.
- **~1,400 Know-Your-India civic entities** (816 MLAs / 529 MPs / 36 states) — real structured data, **zero dedicated URLs**, collapsed into one 5 KB page.
- **324 quiz pages** — no `Quiz` / `LearningResource` schema, so no rich-result eligibility.

# D. What genuinely does not exist

- Any 4th level: `exam → subject → topic → concept`.
- **NCERT / Samacheer chapter pages** — tree stops at `class{N}`; question data has no `chapter` field, so chapter pages cannot be generated from current data without re-tagging.
- **Per-question / individual-question URLs.**
- **Mock-test, online-test, PYQ, test-series route families** — no generator, no data. "PYQ" exists only as marketing copy; there are **0 verified PYQs** in the dataset.
- **Group-specific exam routes** — `/tnpsc/group-4/`, `/tnpsc/group-2/`, `/ssc/cgl/`, etc.
- **Per-lesson Daily Dose routes.**
- **Constituency / MP / state pages** from the KYI data.

# E. Total current SEO surface

- **~398 indexable, unique-canonical pages.**
  - 387 in the sitemap (1 home + 6 hubs + 52 subjects + 324 leaves + 4 misc).
  - + 11 indexable-but-unlisted (6 editorial + 3 blog + `/daily-dose/` + `/misa/`).
- Plus **383 duplicate `/quiz/*` pages** that are technically crawlable but should not count as surface (they should be redirects).
- **782 `index.html` files on disk total** (398 real + 383 duplicate + 1 noindex).

# F. Total potential SEO surface using existing content only

No new questions, no new articles — only templating existing data and fixing plumbing:

| Source | Pages unlockable | Basis |
|---|---:|---|
| Fix titles/H1s on the **383** existing canonical quiz pages | 383 (quality, not count) | `keyword-validation.csv` proposals |
| Add editorial + blog to sitemap + internal links | +9 | already written |
| Add `/daily-dose/`, `/misa/` to sitemap | +2 | already exist |
| **MP constituency pages** from `mp_2024.json` | **+529** | `{pc, state, mp, party, margin}` |
| **MLA / assembly-constituency pages** from `mla_2026.json` | **+816** | `{ac, winner, party, state}` |
| **State pages** from `states_gk.json` + `states_meta.json` | **+36** | capital, language, facts, districts, assembly, population |
| Civics lesson pages from `civics_lessons.json` | +5 | lesson sections |
| **Total net-new pages from existing data** | **~1,395** | |

**Potential SEO surface using existing content only: ~398 current → ~1,800 pages** (≈398 optimised + ~1,395 templated from the KYI datasets + ~11 sitemap additions), with **zero new content authored**. (Chapter-level NCERT/Samacheer pages — potentially another ~1,500–2,500 — are **excluded** here because they require question-data re-tagging, i.e. new content work.)

# G. Biggest SEO opportunities without creating new content

1. **Retitle the 383 existing canonical quiz pages** (`build-public-quiz.cjs` template) from generic `"<Topic> Quiz"` to the search-idiom H1s/titles already drafted in `keyword-validation.csv` — after KWP pull #2 volumes confirm wording. Highest impact, no new pages.
2. **Collapse the 383 `/quiz/*` duplicates** into 301s / canonical-to-bare (the generator already contains `redirectPage()` for exactly this). Removes duplicate-content drag and concentrates authority.
3. **Template the Know-Your-India datasets** into ~1,395 constituency / MP / state / civics pages from JSON that already ships. Large, low-competition, mostly-unserved long-tail.
4. **Put editorial (7) + blog (3) + `/daily-dose/` + `/misa/` in the sitemap** and link them from the relevant exam hubs.
5. **Add deep internal-link blocks to the 6 exam hubs** (all subjects; top topics) so link equity actually reaches the 380+ existing deep pages.
6. **Add `Quiz` / `LearningResource` + `ItemList` schema** to the 324 quiz pages and 52 subject pages.

# H. What the previous 383-URL analysis missed

- It equated "MindGains' SEO surface" with `quiz-index.json` (383 quiz entries). It therefore **never saw**: the 383 `/quiz/*` duplicate tree, the 11 editorial/blog/daily-dose/misa pages, the 169,399-question content mass, or the Know-Your-India datasets (816 MLAs / 529 MPs / 36 states).
- It **modelled deep pages as "to be built."** `/upsc/polity/`, `/upsc/polity/fundamental-rights/`, `/tnpsc/polity/`, `/ncert/science/class10/`, `/samacheer/tamil/class10/` and 377 more **already exist, are static, self-canonical, and in the sitemap.** The problem is generic titles, not absence.
- It did not distinguish **canonical bare tree** (`/upsc/polity/`) from **legacy mirror** (`/quiz/upsc/polity/`) — both are on disk, both self-canonical.
- The KWP pull-2 chapter seeds (`photosynthesis class 11 mcq`) target a tier that **cannot be built from current data** (no chapter tags) — fine for demand sizing, not for a build plan.
- It treated `/tnpsc/group-4/`, `/ssc/practice-papers/` etc. as "gaps to consider." Those are genuinely absent — that part was correct.

# I. Recommended next step

**Before any new programmatic pages:** run one consolidated pass over what already exists —
(1) fix the 383 generic quiz titles/H1s using `keyword-validation.csv` once KWP pull #2 volumes are merged;
(2) convert the 383 `/quiz/*` duplicates to redirects / canonical-to-bare;
(3) add editorial, blog, `/daily-dose/`, `/misa/` to the sitemap and to exam-hub internal links;
(4) scope a Know-Your-India templating spec (529 MP + 816 MLA + 36 state pages from the shipped JSON) as the first genuinely additive surface.

Only after (1)–(3) are shipped and measured should chapter-level NCERT/Samacheer pages (which need question-data re-tagging) or new mock/PYQ/group route families be considered.

*This recommendation is not implemented. No production, route, metadata, sitemap, database or Git changes were made.*
