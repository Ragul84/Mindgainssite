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
`scripts/data/pyq-extra.json` holds papers re-read from the scan with the official key
because Supabase's copy was broken (currently TNPSC Group 4 2025). `import-pyq.cjs`
applies it on top of the export, so keep it; drop an entry once Supabase is fixed.

### Pages
- `/pyq/` hub · `/pyq/tnpsc/<year>/` lists papers · `/pyq/tnpsc/<year>/<paper>/` questions
- `/pyq/upsc/` · `/pyq/upsc/<year>/` (GS Paper I) · `/pyq/upsc/<year>/csat/`
- Each paper page states its answer source; nullified questions show every accepted option.

### When a new exam's paper/key comes out
Get it into mindwhite's `pyq_verified_clean` first (that is where verification
happens), then run the pipeline above. The website is a snapshot; it never reads
Supabase live.

### Counts at last import (21 Nov 2026)
UPSC 1,892 (GS-I 1,492 for 2011–2025 · CSAT 400 for 2021–2025) ·
TNPSC 3,878 (Group 1 1,597 · Group 2 873 · Group 2A 100 · Group 4 1,108 · ACF 200) ·
total 5,770.
