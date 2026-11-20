# MindGains launch plan: Live Theatre + NationLap

Context: `.agents/product-marketing.md`. Hook = Live Theatre. Second = NationLap. Audience = TN + national govt-exam aspirants, 90% on phones, live on WhatsApp/Telegram/Instagram/YouTube.
Rule: no fake numbers. Use real "X in the hall" counts from the theatre, or none.

## Launch day (L-day) = the day Razorpay live keys work

| When | What |
|---|---|
| L-7 | Record 6 screen videos on a phone (list below). Make 3 test Pro buys on live keys, refund them. |
| L-3 | Post the first 3 Reels (teasers). Write the launch post. Create Product Hunt draft. |
| L-1 | DM 20 aspirant Telegram/WhatsApp group admins (script below). |
| L-day 6 AM | Product Hunt live (12:01 AM PT = 1:31 PM IST is PH's day start; post at 1:31 PM IST). Reels 4. Reddit posts. Founder LinkedIn post. |
| L-day 6 PM | Go live in the theatre with the MIGA premiere, share the room link everywhere. |
| L+1..L+14 | Daily calendar below. Reply to every comment within 2 hours on L-day. |

## Videos to record (phone, vertical, 15–30 s each)
1. Walk into the theatre, pick a seat, other racers turn heads → "Studying alone at 11 PM? Come sit with 300 aspirants."
2. Live quiz pops on screen, answer in 4 seconds, rank jumps → "Answer before all of Tamil Nadu."
3. NationLap race: answer mid-race, boost fires → "Your syllabus is now a racing game."
4. Batch room: friend joins, teacher pauses video, quiz locks chat → "Your tuition batch, but online and free to join."
5. Cut-Off Run level 1 with MIGA → "Can you beat the UPSC cut-off?"
6. Thirukkural kural of the day card → page on mindgains.ai/thirukkural.

## 14-day calendar (Instagram Reels + YouTube Shorts same video; WhatsApp status + Telegram same day)

| Day | Reel / Short | Caption hook | Story / Telegram |
|---|---|---|---|
| 1 | Video 1 (theatre seat) | Studying alone tonight? Not anymore. | Theatre link + "6 PM premiere" |
| 2 | Video 3 (NationLap) | The syllabus, but it's Mario Kart. | Race link |
| 3 | Kural of the day | Kural 391: கற்க கசடற… what does it really mean? | /thirukkural/kural/391/ |
| 4 | Video 2 (live quiz) | 4 seconds. 1 answer. All of India watching. | "Tonight 10 PM marathon" |
| 5 | Referral explainer (screen + text) | Bring 5 friends, get 3 days Pro free. | Your invite link |
| 6 | Video 4 (batch room) | Your tuition class just moved online. | Teacher plan ₹299 |
| 7 | Week-1 board result (real numbers) | Tonight's top 3 from the theatre. | Hall of Fame link |
| 8 | Video 5 (Cut-Off Run) | Can you beat last year's cut-off? | Cut-Off Run link |
| 9 | Kural of the day | A 2000-year-old line about anger that still hits. | Kural page |
| 10 | "Day in the hall" timelapse 6 AM → 10 PM | 4 live sessions a day, free. | Timetable |
| 11 | Mistake → weak chapter report | MindGains showed me my weakest chapter. | Pro page |
| 12 | Duet/stitch a topper tip video with theatre b-roll | (credit original) | Theatre link |
| 13 | Friends racing NationLap together | Loser buys tea. | Race link |
| 14 | Week-2 board + thank-you | Real count of people who joined. | Invite link |

Hashtags (pick 5 max): #TNPSC #TNPSCGroup4 #UPSC #SSCCGL #StudyWithMe #Thirukkural #GovtJobs

## Group-admin DM (Telegram/WhatsApp)
> Hi, I'm building MindGains, a free live study hall for TNPSC/UPSC aspirants: everyone watches the same class in a 3D theatre and answers live quizzes together. Your members can use it free (30 min/day). Can I share the link once in your group? Happy to give you Pro free so you can try it first.

## Product Hunt
- Name: MindGains Live Theatre
- Tagline (60 chars): A live 3D study hall where all of India studies together
- First comment: why (aspirants study alone for years), what (theatre, live quiz, NationLap, batch rooms), price (free 30 min/day, Pro ₹99), ask for feedback.
- Gallery: video 1, video 2, video 4, pricing.

## Reddit (r/UPSC, r/TNPSC, r/SSC, r/IndianAcademia)
Read each sub's rules first; many ban self-promo. Post as "I built a free live study hall, would love brutal feedback", with a 30 s video, no hard sell. Reply to everything.


## Revised with the `launch` skill (ORB framework)

**Readiness (SLC check):** Theatre is Simple (one hall, one class), Lovable (seats, racers, live quiz), Complete (sign in, watch, quiz, Pro). Pass. Do not add features before launch; ship.

**Owned channels first (everything else points here):**
1. **WhatsApp Channel "MindGains Live"**: daily 6 PM / 10 PM class alert + kural of the day. Link it on the theatre wall, footer and every Reel.
2. **Telegram channel** (same posts, TN aspirants live there).
3. **Email**: every theatre user signed in with Google, so we have their email. Send a launch email and a weekly "your rank + this week's classes" email (needs a sending service; Resend free tier works with Cloudflare Workers).

**Rented (pick 2, not 5):** Instagram Reels + YouTube Shorts. Reddit only for feedback posts. Product Hunt is a global tech crowd, not aspirants: keep it for credibility and backlinks, don't expect students from it.

**Borrowed (biggest lever for us):** Tamil and Indian exam YouTubers/Instagram teachers.
- List 20 TNPSC/UPSC creators with 10k–200k followers.
- Offer: free Teacher plan to run their own Batch room with their students + their own invite link (each 5 joins = Pro days for them; later a paid affiliate cut).
- Ask for one live "study with me in the MindGains theatre" session. One creator session can fill the hall.

**Phases (we are in Beta, pre-revenue):**
- Now → Razorpay live: Beta. "Early access" badge, first 500 Pro at ₹49, recruit 20 students one-on-one from TN WhatsApp groups and watch them use it.
- Razorpay live = Full launch day (plan above).

**Launch again and again (one launch moment every 2 weeks):**
1. Live Theatre (full launch)
2. Batch rooms + Teacher plan (for tuition teachers)
3. Refer-a-friend (5 friends = 3 days Pro)
4. Thirukkural 1330 with meanings + quiz (TN audience, Pongal/Thiruvalluvar Day 16 Jan is the perfect moment)
5. Cut-Off Run
6. Each new theatre season (new subject) = a small launch

## Measure (daily)
Sign-ins, theatre seats filled at 6 PM and 10 PM, invites sent, referral rewards granted, ₹49 purchases. Log wins/losses in `.agents/product-marketing.md` Learnings.
