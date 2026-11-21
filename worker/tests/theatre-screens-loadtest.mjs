// Load test for auto screens: N websocket clients against BASE (local wrangler dev or the preview worker).
// node loadtest.mjs <base> <N> [scap]
import WebSocket from 'ws';
const BASE = process.argv[2] || 'http://127.0.0.1:8799', N = +process.argv[3] || 1000, SCAP = +process.argv[4] || 0;
const WS = BASE.replace(/^http/, 'ws'), RUN = Math.random().toString(36).slice(2, 6);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const J = async (p, o) => (await fetch(BASE + p, o)).json();
const clients = [];
let msgs = 0, bytes = 0;
function client(i, extra = {}) {
  return new Promise((resolve) => {
    const p = extra.p || `lt${RUN}-${i}`, qs = new URLSearchParams({ p, ...(extra.ref ? { ref: extra.ref } : {}), ...(extra.grp ? { grp: extra.grp } : {}), ...(SCAP ? { scap: SCAP } : {}) });
    const ws = new WebSocket(`${WS}/api/theatre/main/ws?${qs}`);
    const c = { i, p, ws, scr: 0, count: 0, seat: null, quiz: [], reveal: [], seatyou: null, pairoffer: null, n: 0, seatsMsgs: 0, last: {} };
    ws.on('open', () => { ws.send(JSON.stringify({ t: 'hello', name: extra.name || 'LT' + i, pid: p, tu: 'lt' + RUN + i, ref: extra.ref || '', grp: extra.grp || '' })); });
    ws.on('message', (d) => {
      msgs++; bytes += d.length; c.n++;
      let m; try { m = JSON.parse(d); } catch { return; }
      c.last[m.t] = m;
      if (m.t === 'state') { c.scr = m.scr; c.count = m.count; c.state = m; resolve(c); }
      if (m.t === 'seats') { c.seatsMsgs++; c.count = m.count; c.seats = m.seats; }
      if (m.t === 'count') c.count = m.count;
      if (m.t === 'seatyou') { c.seatyou = m; c.seat = m.seat; }
      if (m.t === 'pairoffer') c.pairoffer = m;
      if (m.t === 'quiz') c.quiz.push(m);
      if (m.t === 'reveal') c.reveal.push(m);
    });
    ws.on('error', (e) => { c.err = String(e.message || e); resolve(c); });
    setTimeout(() => resolve(c), 20000);
    clients.push(c);
  });
}
// seat everyone: take a free seat from their screen's map (spread over the hall)
const ROWS = 'ABCDEFGHIJKL', PRO = (s) => /^[EFG]$/.test(s[0]) && +s.slice(1) >= 7 && +s.slice(1) <= 12;
const t0 = Date.now();
console.log('run', RUN, 'N', N, 'scap', SCAP || 'default');
// 1) crowd joins in waves of 50
for (let i = 0; i < N; i += 50) await Promise.all(Array.from({ length: Math.min(50, N - i) }, (_, j) => client(i + j)));
const tJoin = Date.now() - t0;
const byScr = {}; for (const c of clients) byScr[c.scr] = (byScr[c.scr] || 0) + 1;
console.log('joined', clients.filter((c) => c.scr).length, 'errors', clients.filter((c) => c.err).length, 'in', tJoin, 'ms; per screen', JSON.stringify(byScr));
// sit: each client picks the k-th free seat in its screen in order of arrival
const perScr = {};
for (const c of clients) { const k = c.scr; perScr[k] = perScr[k] || []; perScr[k].push(c); }
for (const [k, list] of Object.entries(perScr)) {
  const all = []; for (const r of ROWS) for (let n = 1; n <= 18; n++) { const s = r + n; if (!PRO(s)) all.push(s); }
  list.forEach((c, idx) => { if (idx < all.length - 12) { c.want = all[idx]; c.ws.send(JSON.stringify({ t: 'sit', seat: c.want })); } });
}
await sleep(4000);
const counts = {}; for (const c of clients) counts[c.count] = (counts[c.count] || 0) + 1;
console.log('shown count after settle (value: clients)', JSON.stringify(counts));
console.log('status', JSON.stringify(await J('/api/theatre/main/screens')));
// 2) friends together: pick a seated client in the last screen, and one whose neighbours are both taken
const lastK = Math.max(...Object.keys(perScr).map(Number));
const host = perScr[lastK].find((c) => c.want && c.want.endsWith('1') === false);
const friend = await client(90001, { ref: host.p, name: 'Friend1' });
await sleep(800);
console.log('friend: host', host.p, 'screen', host.scr, 'seat', host.want, '-> friend screen', friend.scr, 'seatyou', JSON.stringify(friend.seatyou));
// friend of a host in screen 1 (likely full rows: neighbours taken) -> pair offer
const h1 = perScr[1][40];
const f2 = await client(90002, { ref: h1.p, name: 'Friend2' });
await sleep(800);
console.log('friend2: host screen', h1.scr, 'seat', h1.want, '-> friend screen', f2.scr, 'seatyou', JSON.stringify(f2.seatyou), 'host got pairoffer', JSON.stringify(h1.pairoffer));
if (h1.pairoffer) { h1.ws.send(JSON.stringify({ t: 'sit', seat: h1.pairoffer.seat })); await sleep(800); console.log('host accepted -> seatyou', JSON.stringify(h1.seatyou)); }
// 3) group link
const g = await J('/api/theatre/main/group', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ p: 'creator-' + RUN, n: 4 }) });
console.log('group', JSON.stringify(g));
const mem = [];
for (let j = 0; j < 5; j++) mem.push(await client(91000 + j, { grp: g.code, name: 'G' + j }));
await sleep(600);
console.log('group members', mem.map((c) => `scr${c.scr}:${c.seatyou && c.seatyou.seat}(${c.seatyou && c.seatyou.why})`).join(' '));
// 4) one quiz across all screens
msgs = 0; bytes = 0;
await J('/api/theatre/main/screens?quiznow=1');
await sleep(2500);
const got = clients.filter((c) => c.quiz.length);
const qids = new Set(got.map((c) => c.quiz[c.quiz.length - 1].qid));
console.log('quiz received by', got.length, '/', clients.length, 'distinct qids', qids.size);
const Q = got[0].quiz[got[0].quiz.length - 1];
let answered = 0;
for (const c of got) { if (Math.random() < 0.8) { answered++; setTimeout(() => c.ws.send(JSON.stringify({ t: 'ans', qid: Q.qid, i: Math.floor(Math.random() * 4) })), Math.random() * 9000); } }
await sleep(Q.ends - Date.now() + 4000);
const rv = clients.filter((c) => c.reveal.length && c.reveal[c.reveal.length - 1].qid === Q.qid);
const tops = new Set(rv.map((c) => JSON.stringify(c.reveal[c.reveal.length - 1].top)));
const ns = new Set(rv.map((c) => c.reveal[c.reveal.length - 1].n));
console.log('answers sent', answered, '; reveal received by', rv.length, '; distinct Top5', tops.size, '; reveal n values', [...ns].join(','));
console.log('top5', [...tops][0]);
const miss = clients.filter((c) => !(c.reveal.length && c.reveal[c.reveal.length - 1].qid === Q.qid)); console.log('missed reveal:', miss.map((c) => `#${c.i} scr${c.scr} open=${c.ws.readyState} err=${c.err||''} quiz=${c.quiz.length}`).join(' | '));
console.log('messages during quiz window', msgs, 'bytes', bytes, 'per client', (msgs / clients.length).toFixed(1));
const st = clients.reduce((a, c) => a + c.seatsMsgs, 0);
console.log('seat-map messages per client over whole run (avg)', (st / clients.length).toFixed(1));
console.log('status', JSON.stringify(await J('/api/theatre/main/screens')));
// 5) leave: half disconnect, counts update
for (const c of clients.slice(0, Math.floor(N / 2))) c.ws.close();
await sleep(5000);
const rest = clients.slice(Math.floor(N / 2)).filter((c) => c.ws.readyState === 1);
const cc = {}; for (const c of rest) cc[c.count] = (cc[c.count] || 0) + 1;
const stale = rest.filter((c) => c.count !== Number(Object.keys(cc).sort((a, b) => cc[b] - cc[a])[0])); console.log('stale:', stale.map((c) => `#${c.i} scr${c.scr} count=${c.count} lastSeats=${c.last.seats && c.last.seats.count} lastCount=${c.last.count && c.last.count.count}`).join(' | '));
console.log('after half left: shown counts', JSON.stringify(cc), 'status', JSON.stringify(await J('/api/theatre/main/screens')));
// 6) reconnect: a leaver comes back to the same screen?
const back = clients[5]; const b2 = await client(5, { p: back.p });
console.log('reconnect', back.p, 'was screen', back.scr, 'now', b2.scr);
for (const c of clients) try { c.ws.close(); } catch {}
await sleep(500); process.exit(0);
