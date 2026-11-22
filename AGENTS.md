# Notes for coding agents (Claude, Grok, etc.)

## Previous year questions (PYQ) — /pyq/

**Source of truth:** the mindwhite app's Supabase view `pyq_verified_clean`
(project credentials in `C:\mindwhite\.env`; the anon key is denied, so read it with
`SUPABASE_SERVICE_ROLE_KEY`, **GET requests only — never write to Supabase from here**).
It holds full papers with official answer keys, and marks questions the final key
changed (`nullified` + `accepted_answers`).

**Do not** OCR question papers, write answers from memory, or use the Upstash Redis
questions (those are AI-generated). Only fall back to manual work if a paper is
missing from `pyq_verified_clean`, and label such answers clearly.

### Pipeline
1. Export rows for `exam=UPSC` and `exam=TNPSC` from `pyq_verified_clean`
   (all columns, per exam + year, `limit=2000`) into one JSON array.
2. `node scripts/import-pyq.cjs <export.json>` → writes `scripts/data/pyq.json`.
   New paper types need a line in `paperOf()` there (source_id → page slug + title).
3. `node scripts/build-pyq.cjs` → regenerates `pyq/**` pages and the sitemap block.
4. `git pull` first (several agents work in this repo), then `npx wrangler deploy`,
   commit `scripts/ pyq/ sitemap.xml`, push.

### Hand-fixed papers
`scripts/data/pyq-extra.json` holds papers re-read from the official scan and marked with the
official final key, because Supabase's copy was broken or missing: TNPSC Group 4 2025
(General English + GS) and Group 1 2025. `import-pyq.cjs` layers it over the export
(`replace` lists the papers it overrides), so keep it; drop an entry once Supabase has it.

### Figure questions
Rows may carry `img` (a file in `pyq/img/`), rendered inside the question card.
Crop the figure from the official scan (PyMuPDF clip at 200 dpi, whiten the candidate's
blue ticks), never redraw it. Options stay as text buttons.

### Missing questions
`build-pyq.cjs` shows a small ⚠ n/N on incomplete papers; tapping it lists the missing
numbers and the reason (`WHY` map, default = deleted in the final key).

### Pages
- `/pyq/` hub · `/pyq/tnpsc/<year>/` lists papers · `/pyq/tnpsc/<year>/<paper>/` questions
- `/pyq/upsc/` · `/pyq/upsc/<year>/` (GS Paper I) · `/pyq/upsc/<year>/csat/`
- Each paper page states its answer source; nullified questions show every accepted option.

### When a new exam's paper/key comes out
Get it into mindwhite's `pyq_verified_clean` first (that is where verification
happens), then run the pipeline above. The website is a snapshot; it never reads
Supabase live.

### Unofficial papers (answers by MindGains)
Rows in pyq-extra.json with src:'mg' were answered by MindGains (no official key for that
booklet). Pages show an "⚠ Unofficial" tag. Never delete or overwrite them on a refresh;
replace only if an official key for that exact booklet is found. Working scans/notes live in
C:/Users/ragul/pyqwork. Before trusting an mg paper, look for TNPSC's own answer-ticked booklet
(tnpsc.gov.in/Tentative/Document/<date>_<paper>.pdf) or a coaching key, and fix mismatches.
Checked: G2 2013/2015 Tamil, G2A 2016/2017 Tamil, G4 2016/2018 Tamil, G4 2024 GS+Tamil.

### Counts (22 Nov 2026)
UPSC 1,892 · TNPSC 5,171 · total 7,063.
