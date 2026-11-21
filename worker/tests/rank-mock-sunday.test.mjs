// Sunday State Rank Mock: hall quiz pause + question pack coverage.
// Run: node worker/tests/rank-mock-sunday.test.mjs   (needs esbuild: npx esbuild, or ESBUILD=/path/to/esbuild/lib/main.js)
// Bundles worker/theatre.js and worker/rank-mock.js with a stub for "cloudflare:workers", then drives the
// TheatreHall alarm (fake storage, fake sockets, fake clock) and simulates N weekly mocks with rmPick.
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url'; import { createRequire } from 'module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), WORKER = path.resolve(HERE, '..');
const require = createRequire(import.meta.url);
const esbuild = require(process.env.ESBUILD || 'esbuild');
const WEEKS = +(process.env.RM_WEEKS || 13);
const tmp = fs.mkdtempSync('/tmp/rm-sunday-');
fs.writeFileSync(tmp + '/cfw.mjs', 'export class DurableObject { constructor(ctx, env) { this.ctx = ctx; this.env = env; } }\n');
fs.writeFileSync(tmp + '/entry.mjs', `export { TheatreHall } from ${JSON.stringify(WORKER + '/theatre.js')};\nexport * from ${JSON.stringify(WORKER + '/rank-mock.js')};\n`);
await esbuild.build({ entryPoints: [tmp + '/entry.mjs'], bundle: true, format: 'esm', platform: 'neutral', outfile: tmp + '/b.mjs', alias: { 'cloudflare:workers': tmp + '/cfw.mjs' }, loader: { '.json': 'json' }, logLevel: 'error' });
let NOW = 0; const realNow = Date.now; Date.now = () => NOW;
globalThis.WebSocketPair = function () { return { 0: {}, 1: {} }; };
const M = await import(pathToFileURL(tmp + '/b.mjs').href);
const { TheatreHall, rmHallPauseUntil, rmPick, rmDelegate, RM_EXAMS, RankMock } = M;
const PACK = JSON.parse(fs.readFileSync(WORKER + '/rank-mock-pack.json', 'utf8'));
const res = []; const ok = (n, c, x) => { res.push({ n, pass: !!c }); console.log((c ? 'PASS ' : 'FAIL ') + n + (c || x === undefined ? '' : '  · ' + JSON.stringify(x).slice(0, 300))); };
const IST = (y, mo, d, h, mi, s = 0) => Date.UTC(y, mo - 1, d, h, mi, s) - 5.5 * 36e5;
const SUN = IST(2026, 11, 22, 19, 0), DUR = 25 * 35e3, PAD = 5 * 6e4, END = SUN + DUR + PAD;   // 19:19:35 IST

// ---- 1) pause window (pure)
ok('tnpsc: 18:54:59 IST Sunday not paused', rmHallPauseUntil('tnpsc', SUN - PAD - 1000) === 0);
ok('tnpsc: 18:55:00 IST paused until 19:19:35 IST', rmHallPauseUntil('tnpsc', SUN - PAD) === END);
ok('tnpsc: 19:10 IST paused until 19:19:35', rmHallPauseUntil('tnpsc', IST(2026, 11, 22, 19, 10)) === END);
ok('tnpsc: 19:19:34 IST still paused', rmHallPauseUntil('tnpsc', END - 1000) === END);
ok('tnpsc: 19:19:35 IST resumed', rmHallPauseUntil('tnpsc', END) === 0);
ok('tnpsc: Saturday 19:05 IST not paused', rmHallPauseUntil('tnpsc', IST(2026, 11, 21, 19, 5)) === 0);
ok('tnpsc: Monday 19:05 IST not paused', rmHallPauseUntil('tnpsc', IST(2026, 11, 23, 19, 5)) === 0);
ok('tnpsc: Sunday 18:00 and 20:00 IST not paused', rmHallPauseUntil('tnpsc', IST(2026, 11, 22, 18, 0)) === 0 && rmHallPauseUntil('tnpsc', IST(2026, 11, 22, 20, 0)) === 0);
ok('tnpsc: next Sunday 29 Nov 19:05 IST paused', rmHallPauseUntil('tnpsc', IST(2026, 11, 29, 19, 5)) === END + 7 * 864e5);
ok('main hall: Sunday 19:05 IST never paused', rmHallPauseUntil('main', IST(2026, 11, 22, 19, 5)) === 0);
ok('admin test window respected (any day)', rmHallPauseUntil('tnpsc', IST(2026, 11, 24, 11, 0), IST(2026, 11, 24, 11, 9)) === IST(2026, 11, 24, 11, 9));
ok('expired admin test window ignored', rmHallPauseUntil('tnpsc', IST(2026, 11, 24, 11, 10), IST(2026, 11, 24, 11, 9)) === 0);

// ---- 2) TheatreHall scheduler (fake DO)
function storage() {
  const m = new Map(); let alarm = null; const cl = (v) => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
  return { m, async get(k) { if (Array.isArray(k)) { const r = new Map(); for (const x of k) if (m.has(x)) r.set(x, cl(m.get(x))); return r; } return cl(m.get(k)); },
    async put(k, v) { if (typeof k === 'object') { for (const [a, b] of Object.entries(k)) m.set(a, cl(b)); } else m.set(k, cl(v)); },
    async delete(k) { (Array.isArray(k) ? k : [k]).forEach((x) => m.delete(x)); }, async list() { return new Map(); },
    async getAlarm() { return alarm; }, async setAlarm(t) { alarm = t; }, async deleteAlarm() { alarm = null; }, get alarm() { return alarm; } };
}
const QBANK = { questions: [{ question: 'Which Article of the Constitution abolishes untouchability?', options: ['Article 14', 'Article 15', 'Article 17', 'Article 21'], answer_index: 2 }] };
async function hall(name) {
  const out = []; const ws = { send: (s) => out.push(JSON.parse(s)), deserializeAttachment: () => ({ id: 'x1', name: 'Asha' }), serializeAttachment() {} };
  const st = storage(); await st.put('hall', name);
  const ctx = { storage: st, blockConcurrencyWhile: async (f) => f(), getWebSockets: () => [ws], waitUntil() {}, acceptWebSocket() {} };
  const env = { ASSETS: { fetch: async () => new Response(JSON.stringify(QBANK), { headers: { 'content-type': 'application/json' } }) }, GAME_DB: { prepare: () => ({ bind() { return this; }, first: async () => null, all: async () => ({ results: [] }), run: async () => ({}) }), batch: async () => [] } };
  const h = new TheatreHall(ctx, env); await new Promise((r) => setTimeout(r, 1)); return { h, st, out, ws };
}
{ // window start: no quiz, alarm moved to the end of the window, clients told
  const { h, st, out } = await hall('tnpsc'); NOW = SUN - 4 * 6e4; await h.alarm();
  ok('tnpsc 18:56 IST: no hall quiz started', !h.quiz && !out.some((m) => m.t === 'quiz'));
  ok('tnpsc 18:56 IST: alarm parked at 19:19:35 IST', st.alarm === END, st.alarm);
  ok("clients get {t:'next', paused:'rankmock'} (existing countdown/toast)", out.some((m) => m.t === 'next' && m.at === END && m.paused === 'rankmock' && m.until === END));
  NOW = END; out.length = 0; await h.alarm();
  ok('19:19:35 IST: hall quiz resumes', h.quiz && out.some((m) => m.t === 'quiz'));
  ok('resumed quiz keeps the 15 s answer window', h.quiz.ends - h.quiz.start === 15000);
  ok('reveal alarm 15.5 s after start', st.alarm === NOW + 15500);
  NOW = st.alarm; out.length = 0; await h.alarm();
  ok('after reveal the next quiz is 4 min later (cadence unchanged)', st.alarm === NOW + 4 * 6e4 && out.some((m) => m.t === 'next' && !m.paused));
}
{ // a reveal whose next round would land in the window
  const { h, st, out } = await hall('tnpsc'); NOW = SUN - 8 * 6e4; await h.alarm();   // 18:52 quiz starts (outside window)
  ok('tnpsc 18:52 IST: quiz still runs before the window', !!h.quiz && !h.quiz.revealed);
  NOW = st.alarm; await h.alarm();
  ok('reveal at 18:52:15: next round pushed to 19:19:35 IST, not 18:56', st.alarm === END && out.some((m) => m.t === 'next' && m.paused === 'rankmock'));
}
{ // other hall and other days unaffected
  const a = await hall('main'); NOW = IST(2026, 11, 22, 19, 5); await a.h.alarm();
  ok('main hall Sunday 19:05 IST: quiz runs normally', !!a.h.quiz && a.st.alarm === NOW + 15500);
  const b = await hall('tnpsc'); NOW = IST(2026, 11, 21, 19, 5); await b.h.alarm();
  ok('tnpsc Saturday 19:05 IST: quiz runs normally', !!b.h.quiz && b.h.quiz.ends - b.h.quiz.start === 15000);
  NOW = b.st.alarm; await b.h.alarm(); ok('tnpsc Saturday: next quiz 4 min after reveal', b.st.alarm === NOW + 24e4);
}
{ // hello inside the window carries the paused flag
  const { h, out, ws } = await hall('tnpsc'); NOW = IST(2026, 11, 22, 19, 3);
  await h.webSocketMessage(ws, JSON.stringify({ t: 'hello', name: 'Asha' })).catch(() => {});
  const s = out.find((m) => m.t === 'state'); ok('state on hello says paused during the mock', s && s.paused === 'rankmock' && s.until === END, s && { paused: s.paused, until: s.until });
  const o2 = await hall('tnpsc'); NOW = IST(2026, 11, 22, 17, 0);
  await o2.h.webSocketMessage(o2.ws, JSON.stringify({ t: 'hello', name: 'Asha' })).catch(() => {});
  const s2 = o2.out.find((m) => m.t === 'state'); ok('state on hello has no paused flag outside the window', s2 && !s2.paused);
}
{ // admin test mock: RankMock tells the hall, the hall parks its quiz, stop resumes the 4-min cadence
  NOW = IST(2026, 11, 24, 11, 0);
  const H = await hall('tnpsc'); H.st.alarm; await H.st.setAlarm(NOW + 2 * 6e4);
  rmDelegate(TheatreHall);   // as in worker/index.js: plain halls must still reach the TheatreHall handlers
  const calls = []; const env = { MOCK_ADMIN: 'k', THEATRE: { idFromName: (n) => n, get: (n) => ({ fetch: async (req) => { calls.push([n, new URL(req.url).pathname]); return H.h.fetch(req); } }) } };
  const rst = storage(); const rctx = { storage: rst, blockConcurrencyWhile: async (f) => f(), getWebSockets: () => [], acceptWebSocket() {} };
  const R = new RankMock(rctx, env); await new Promise((r) => setTimeout(r, 1));
  const call = (body) => R.fetch(new Request('https://x/api?exam=tnpsc-g4&op=admin', { method: 'POST', headers: { 'x-mock-admin': 'k' }, body: JSON.stringify(body) })).then((r) => r.json());
  const s = await call({ action: 'start', n: 5, qSecs: 8, revealSecs: 3, lobbySecs: 20 });
  const tEnd = NOW + 20e3 + 5 * 11e3 + PAD;
  ok('test start notifies the tnpsc hall (/__rmpause)', calls.some(([n, p]) => n === 'tnpsc' && p === '/__rmpause'), calls);
  ok('hall stores the test window and parks its alarm to the end', (await H.st.get('rmPause')) === tEnd && H.st.alarm === tEnd, { st: await H.st.get('rmPause'), alarm: H.st.alarm, tEnd });
  NOW += 3 * 6e4; await H.h.alarm(); ok('during the test no hall quiz starts', !H.h.quiz);
  await call({ action: 'stop' });
  ok('test stop clears the pause', (await H.st.get('rmPause')) === 0);
  ok('after stop the next hall quiz is at most 4 min away', H.st.alarm > NOW && H.st.alarm <= NOW + 24e4, { alarm: H.st.alarm - NOW });
  { // stopped during the lobby: the parked alarm (end of test + 5 min) comes back to now + 4 min
    await call({ action: 'start', n: 5, qSecs: 8, revealSecs: 3, lobbySecs: 60 });
    ok('second test parks the hall alarm beyond 4 min', H.st.alarm > NOW + 24e4);
    await call({ action: 'stop' });
    ok('stop in the lobby: hall back on the 4-min cadence', H.st.alarm === NOW + 24e4 && (await H.st.get('rmPause')) === 0, { alarm: H.st.alarm - NOW });
  }
  const st2 = await R.fetch(new Request('https://x/api?exam=tnpsc-g4&op=status')).then((r) => r.json());
  ok('after the tests the weekly mock is back (Sun 29 Nov 19:00 IST, as of 24 Nov)', st2.mock && !st2.mock.test && st2.mock.startsAt === SUN + 7 * 864e5, st2.mock);
}

// ---- 3) question pack
const MIX = RM_EXAMS['tnpsc-g4'].mix, N = RM_EXAMS['tnpsc-g4'].n;
const all = Object.entries(PACK).flatMap(([s, l]) => l.map((q) => ({ ...q, s })));
const norm = (x) => String(x).toLowerCase().replace(/[^a-z0-9\u0b80-\u0bff]/g, '');
ok('pack: no duplicate ids', new Set(all.map((q) => q.h)).size === all.length);
ok('pack: no duplicate question texts', new Set(all.map((q) => norm(q.q))).size === all.length);
ok('pack: every item well formed (4 distinct options, answer 0-3, explanation)', all.every((q) => Array.isArray(q.o) && q.o.length === 4 && new Set(q.o.map((o) => String(o).toLowerCase().replace(/\s+/g, ''))).size === 4 && Number.isInteger(q.a) && q.a >= 0 && q.a < 4 && q.q && q.e && q.t && /^[0-9a-f]{12}$/.test(q.h)));
const cover = Object.fromEntries(Object.entries(MIX).map(([s, w]) => [s, Math.floor((PACK[s] || []).length / w)]));
ok(`pack: every subject covers ${WEEKS}+ weeks at the mix`, Object.values(cover).every((w) => w >= WEEKS), cover);
// simulate the real weekly flow: seed = mock id, "used" grows exactly like RankMock.rollover (last 400 ids)
let used = [], seen = new Set(), firstRepeat = 0, mixOk = true;
for (let w = 0; w < 30; w++) {
  const id = 'tnpsc-g4-' + new Date(SUN + w * 7 * 864e5 + 5.5 * 36e5).toISOString().slice(0, 10);
  const qs = rmPick(PACK, MIX, N, id, used);
  const c = {}; for (const q of qs) c[q.s] = (c[q.s] || 0) + 1;
  if (w < WEEKS && (qs.length !== N || Object.entries(MIX).some(([s, k]) => c[s] !== k))) mixOk = false;
  if (!firstRepeat && qs.some((q) => seen.has(q.h))) firstRepeat = w + 1;
  qs.forEach((q) => seen.add(q.h)); used = used.concat(qs.map((q) => q.h)).slice(-400);
}
const clean = firstRepeat ? firstRepeat - 1 : 30;
ok(`weekly simulation: ${WEEKS} Sundays, 25 Q each, exact mix`, mixOk);
ok(`weekly simulation: no question repeats for ${WEEKS} Sundays (first repeat in week ${firstRepeat || '>30'})`, clean >= WEEKS, { clean });
console.log(JSON.stringify({ coverWeeks: cover, weeksWithoutRepeat: clean, pack: Object.fromEntries(Object.entries(PACK).map(([s, l]) => [s, l.length])) }));
Date.now = realNow;
const fails = res.filter((r) => !r.pass).length; console.log(`${res.length - fails}/${res.length} passed`); process.exit(fails ? 1 : 0);
