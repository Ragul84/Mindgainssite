# MindGains — Waitlist landing page

Single-screen, ultra-modern waitlist site with the Live2D **MIGA** mascot.

**Flow:** pick language → enter email → Join → mascot does a **happy pose + confetti** + a localized "you're in" message.

## What's inside
- `index.html` — the whole site (self-contained).
- `waitlist-table.sql` — run once in Supabase so emails are saved.

## How it works
- **Background:** looping cloudfront video + animated particles.
- **Mascot:** the same Live2D wolf as the app — loaded from your **Supabase public storage** (`/storage/v1/object/public/mascot/wolf_live2d/`) with the Cubism + PIXI runtime from CDN. No local model files needed.
- **Languages:** English, Tamil, Hindi, Telugu, Kannada, Malayalam — greeting + invite + success line localized for each.
- **Email:** POSTed to a Supabase `waitlist` table with the public anon key (insert-only via RLS — safe).

## Setup (2 mins)
1. Open Supabase → SQL Editor → paste & run `waitlist-table.sql`.
2. Open `index.html`.
   - Easiest reliable way (avoids `file://` CORS quirks): from this folder run
     `python -m http.server 5500` and visit `http://localhost:5500`.
   - Or just double-click `index.html` (works in most browsers; if the mascot doesn't load, use the local server).

## Deploy
Drop the folder on any static host — **Netlify / Vercel / Cloudflare Pages / GitHub Pages**. It's a static page; no build step.

## Tweak
- Background video: change `BG_VIDEO` at the top of the `<script>` in `index.html`.
- Dialogue / languages: edit the `LANGS` object.
- Brand colors: `--brand` / `--brand2` CSS variables.
