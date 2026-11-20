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
1. Walk into the theatre, pick a seat, other racers turn heads → (see scripts below)
2. Live quiz pops on screen, answer in 4 seconds, rank jumps → "Answer before all of Tamil Nadu."
3. NationLap race: answer mid-race, boost fires → (see scripts below)
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


## Revised with the `social` skill

**Fixes to the first draft:** removed the made-up "300 aspirants" line, removed the "it's Mario Kart" caption (someone else's trademark), removed contrast hooks ("Not anymore") and engagement bait. Every hook below uses a real thing on screen.

**Content pillars**
| Pillar | Share | What |
|---|---|---|
| Inside the hall | 35% | Real screen recordings: seat, live quiz, chat, rank |
| Exam help | 30% | One PYQ, one kural, one current-affairs fact per post (useful even if they never sign up) |
| Race & play | 20% | NationLap and Cut-Off Run clips |
| Behind the build | 10% | Founder posts: why a theatre, what students asked for |
| Offers | 5% | ₹49 first month, refer 5 friends |

**Platforms:** Instagram Reels + YouTube Shorts (same file, 9:16, 15–30 s). WhatsApp Channel + Telegram get the same clip plus the link. Captions in Tamil for TNPSC posts, English for UPSC/SSC. Burned-in subtitles always (most people watch muted): 2 lines max, 3–5 words a line.

**Six Reel scripts** (visual hook + spoken hook + on-screen text, all in the first second)

1. **The seat** (inside the hall)
   - 0–3 s: phone screen, racer sits down, the row turns to look. Text: "Tonight's 10 PM class". Voice: "This is my seat for tonight's TNPSC class."
   - 3–15 s: pan the hall, chat messages coming in, MIGA question pops up.
   - 15–25 s: answer, rank moves on the board.
   - End: "Free, 30 min a day. Link in bio."
2. **4 seconds** (inside the hall)
   - 0–3 s: live quiz card with the timer at 4. Text: "Answer before the hall does". Voice: "4 seconds. Which article covers…?"
   - Pause 2 s so viewers guess, reveal, show % of hall who got it right (real number from the reveal).
   - End: "Tonight 6 PM, MIGA premiere."
3. **Read, then race** (race & play)
   - 0–3 s: kart hits an item box, question appears mid-race. Text: "This question = speed boost".
   - Show the 60-second read, the race, the boost.
   - End: "Race any chapter free. mindgains.ai/nationlap"
4. **Kural of the day** (exam help, Tamil)
   - 0–3 s: kural centred on screen in quotes. Voice reads it in Tamil.
   - Show the பொருள் line, then the 4-option question from the page. "Answer in the comments."
   - End: "1330 குறள்கள், பொருளுடன். mindgains.ai/thirukkural"
5. **Your tuition batch** (inside the hall, for teachers)
   - 0–3 s: teacher presses pause, quiz locks every student's chat. Text: "When the teacher pauses, everyone answers".
   - End: "Teacher plan ₹299/month, up to 60 students."
6. **Bring 5** (offers)
   - 0–3 s: invite button, progress 4/5, then 5/5 and "3 days Pro". Text: "5 friends = 3 days Pro free".
   - End: "Your friend also gets 30 extra minutes."

**14-day calendar (rewritten)**
| Day | Reel | Pillar | WhatsApp/Telegram |
|---|---|---|---|
| 1 | Script 1 | Hall | Tonight's timetable |
| 2 | Script 4 (kural 391) | Exam help | Kural link |
| 3 | Script 3 | Race | Race link |
| 4 | One TNPSC PYQ with answer | Exam help | PYQ + theatre link |
| 5 | Script 2 | Hall | "6 PM premiere" |
| 6 | Founder: why I built a theatre for aspirants (talking head, 30 s) | Build | Same |
| 7 | Script 6 | Offer | Invite link |
| 8 | Script 4 (another kural) | Exam help | Kural link |
| 9 | Script 5 | Hall/teachers | Teacher plan |
| 10 | Today's top current-affairs fact, then race it | Exam help + Race | Affairs race link |
| 11 | Cut-Off Run level 1 | Race | Cut-Off Run link |
| 12 | Weak-chapter report screen | Hall | Pro page |
| 13 | Two friends racing NationLap | Race | Race link |
| 14 | Real week-2 numbers: seats filled, top 3 (only if real) | Hall | Invite link |

**Daily 30 minutes:** reply to every comment in the first hour; comment usefully on 5 posts from TNPSC/UPSC teacher accounts (the creators from the borrowed-channel list); post the day's clip to the WhatsApp Channel.

**Weekly review:** top 3 and bottom 3 Reels by saves and shares (not likes), and which brought sign-ins (use `?src=ig` / `?src=yt` on bio links).

## Measure (daily)
Sign-ins, theatre seats filled at 6 PM and 10 PM, invites sent, referral rewards granted, ₹49 purchases. Log wins/losses in `.agents/product-marketing.md` Learnings.
