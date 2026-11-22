const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const game = read('play/cutoff-run/index.html');
const social = read('play/cutoff-run/social.js');
const worker = read('worker/game.js');
const headers = read('_headers');
const sitemap = read('sitemap.xml');
const manifest = JSON.parse(read('play/cutoff-run/manifest.webmanifest'));

const start = game.indexOf('<script>', game.indexOf('</head>')) + 8;
const end = game.indexOf('</script>', start);
assert(start > 7 && end > start, 'main game script must exist');
new Function(game.slice(start, end));

assert(/#wrap\{[^}]*width:100%;[^}]*max-width:\d+px/.test(game), 'mobile wrapper must not force a narrow viewport to overflow');
assert(game.includes('box-sizing:border-box'), 'global box sizing must be set');
assert(game.includes('https://mindgains.ai/play/cutoff-run/'), 'canonical URL must be present');
assert(game.includes('/assets/og-cutoff-run.jpg'), 'launch OG image must be present');
assert(game.includes('Choose an exam') && game.includes('Choose your state / UT'), 'first-run exam and state setup must be present');
assert(game.includes("if(readyToPlay()){startRemote();openMenu()}else openConsent(true)"), 'online calls must wait for onboarding');
assert(game.includes("const readyForOnline=()=>!!(readyToPlay()&&PL.consent.adult)"), 'under-18 web sessions must stay in local practice mode');
assert(game.includes("const hasAds=()=>!!(PL.consent&&PL.consent.adult)"), 'under-18 sessions must not expose rewarded ads');
assert(!game.includes('play first: the privacy and age sheet comes after the first run'), 'legacy post-play consent must be removed');
assert(game.includes("gameUrl('/report')") && game.includes('Report this question'), 'question reporting UI must be wired');
assert(social.includes("if(readyToPlay()){if(readyForOnline())deepLink()}else"), 'social boot must respect onboarding');
assert(social.includes('beforeinstallprompt'), 'PWA install prompt must be captured');

assert(worker.includes("const PYQ_VIEW = 'pyq_verified_clean'"), 'verified PYQ view must be the source');
assert(!worker.includes("from('pyq_questions')"), 'legacy PYQ table must not be used');
assert(worker.includes("pathname === '/api/game/events'"), 'analytics endpoint must be mounted');
assert(worker.includes("pathname === '/api/game/report'"), 'question report endpoint must be mounted');
assert(read('worker/game-schema-012-launch.sql').includes('game_question_report'), 'launch migration must include question reports');

assert.strictEqual(manifest.start_url, '/play/cutoff-run/');
assert(manifest.icons.some((x) => x.sizes === '512x512'), 'manifest must have a 512 icon');
assert(fs.statSync(path.join(root, 'assets/og-cutoff-run.jpg')).size > 10000, 'OG image must be a real asset');
assert(headers.includes('/play/cutoff-run/*') && headers.includes("object-src 'none'"), 'game security headers must be scoped');
assert(sitemap.includes('<loc>https://mindgains.ai/play/cutoff-run/</loc>'), 'game must be in the sitemap');
assert(sitemap.includes('<loc>https://mindgains.ai/children-privacy/</loc>'), 'children privacy notice must be in the sitemap');
assert(game.includes('/children-privacy/'), 'game onboarding/settings must link to the children privacy notice');
assert(read('children-privacy/index.html').includes('Local practice mode'), 'children privacy notice must describe the under-18 safeguards');
assert(read('pyq/upsc/2025/index.html').includes('Turn this paper into a 3-minute race'), 'PYQ launch CTA must be generated');

console.log('Cut-Off Run launch checks passed');
