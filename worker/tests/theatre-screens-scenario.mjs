// Run against a preview worker or `wrangler dev` (needs SCREENS_TEST=1 for ?scap / ?quiznow): node worker/tests/theatre-screens-scenario.mjs <base-url>
// Scenario test with a tiny soft cap: node scenario.mjs <base>
import WebSocket from 'ws';
const BASE = process.argv[2] || 'http://127.0.0.1:8799', WS = BASE.replace(/^http/, 'ws'), RUN = Math.random().toString(36).slice(2, 6), SCAP = 3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const J = async (p, o) => (await fetch(BASE + p, o)).json();
let ok = 0, bad = 0; const check = (c, msg) => { c ? ok++ : bad++; console.log(c ? 'PASS' : 'FAIL', msg); };
function client(name, extra = {}) {
  return new Promise((resolve) => {
    const p = `sc${RUN}-${name}`, qs = new URLSearchParams({ p, scap: SCAP, ...(extra.ref ? { ref: extra.ref } : {}), ...(extra.grp ? { grp: extra.grp } : {}) });
    const ws = new WebSocket(`${WS}/api/theatre/tnpsc/ws?${qs}`);
    const c = { name, p, ws, msgs: [] , send: (m) => ws.send(JSON.stringify(m)) };
    ws.on('open', () => c.send({ t: 'hello', name, pid: p, ref: extra.ref || '', grp: extra.grp || '' }));
    ws.on('message', (d) => { const m = JSON.parse(d); c.msgs.push(m); if (m.t === 'state') { c.scr = m.scr; resolve(c); } if (m.t === 'seats' || m.t === 'count') c.count = m.count; if (m.t === 'seatyou') c.seat = m.seat; if (m.t === 'state' || m.t === 'seats') { c.map = m.seats; c.res = m.res; } });
    setTimeout(() => resolve(c), 8000);
  });
}
const A = await client('A'); A.send({ t: 'sit', seat: 'H9' }); A.seat = 'H9';
const B = await client('B'); B.send({ t: 'sit', seat: 'C3' });
const C = await client('C'); C.send({ t: 'sit', seat: 'C4' });
const D = await client('D'); D.send({ t: 'sit', seat: 'J2' }); D.seat = 'J2';
await sleep(1500);
check(A.scr === 1 && B.scr === 1 && C.scr === 1, `A,B,C in screen 1 (got ${A.scr},${B.scr},${C.scr})`);
check(D.scr === 2, `D spills into screen 2 at soft cap ${SCAP} (got ${D.scr})`);
check(A.count === 4 && D.count === 4, `combined count 4 on both screens (A sees ${A.count}, D sees ${D.count})`);
const lblA = A.msgs.filter((m) => m.scrs).pop(); check(lblA && lblA.scrs === 2, `screens open = 2 (got ${lblA && lblA.scrs})`);
// friend of A: screen 1 is at the soft cap but friends may go up to 216
const F = await client('F', { ref: A.p }); await sleep(700);
check(F.scr === 1, `friend joins inviter's screen above soft cap (got ${F.scr})`);
check(F.seat === 'H10' || F.seat === 'H8', `friend seated next to A (H9) -> ${F.seat}`);
// F tries to sit elsewhere immediately (old client behaviour): pinned
F.send({ t: 'sit', seat: 'A1' }); await sleep(400);
check(F.msgs.some((m) => m.t === 'seatyou' && m.why === 'pinned'), 'early client sit is overridden while pinned');
// both neighbours of B (C3) : C2 free, C4 = C -> adjacency should be C2
const F2 = await client('F2', { ref: B.p }); await sleep(600);
check(F2.seat === 'C2', `friend of B (C3, C4 taken) gets C2 -> ${F2.seat}`);
// friend of C (C4): C3 taken(B), C5 free -> C5
const F3 = await client('F3', { ref: C.p }); await sleep(600);
check(F3.seat === 'C5', `friend of C gets C5 -> ${F3.seat}`);
// now C (C4) neighbours C3,C5 taken -> friend4 gets pair offer flow
const F4 = await client('F4', { ref: C.p }); await sleep(800);
const offer = C.msgs.find((m) => m.t === 'pairoffer');
check(F4.seat && offer && offer.friendSeat === F4.seat, `friend 4: neighbours taken -> nearest pair, inviter gets offer (${F4.seat}, offer ${offer && offer.seat})`);
// another user cannot take the held seat
const X = await client('X'); await sleep(300);
if (offer) { X.send({ t: 'sit', seat: offer.seat }); await sleep(400); check(X.msgs.some((m) => m.t === 'taken' && m.seat === offer.seat) || X.scr !== 1, 'held seat refused to a stranger'); }
if (offer) { C.send({ t: 'sit', seat: offer.seat }); await sleep(500); check(C.msgs.some((m) => m.t === 'seatyou' && m.why === 'together'), 'inviter taps Move us together -> seated beside friend'); }
// group link from D (screen 2): block of 3, D moved into it
const g = await J('/api/theatre/tnpsc/group', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ p: D.p, n: 3 }) });
await sleep(400);
check(g.code && g.k === 2 && g.seats.length === 3, `group of 3 in creator's screen 2: ${JSON.stringify(g)}`);
check(g.seats.includes(D.seat) || D.msgs.some((m) => m.t === 'seatyou' && m.why === 'group'), 'creator sits inside the block (moved in if needed) D=' + D.seat + ' msgs=' + JSON.stringify(D.msgs.filter((m) => m.t === 'seatyou')));
const G1 = await client('G1', { grp: g.code }), G2 = await client('G2', { grp: g.code }), G3 = await client('G3', { grp: g.code });
await sleep(600);
check([G1, G2, G3].every((c) => c.scr === 2), `group members land in screen 2 (${G1.scr},${G2.scr},${G3.scr})`);
check(g.seats.includes(G1.seat) && g.seats.includes(G2.seat) && G3.seat && G1.seat !== G2.seat, `members in block ${g.seats}: ${G1.seat},${G2.seat}, 3rd (block full) beside: ${G3.seat}`);
// quiz sync across screens + combined leaderboard
await J('/api/theatre/tnpsc/screens?quiznow=1'); await sleep(2000);
const qa = A.msgs.filter((m) => m.t === 'quiz').pop(), qd = D.msgs.filter((m) => m.t === 'quiz').pop();
check(qa && qd && qa.qid === qd.qid, `same question on both screens (${qa && qa.qid} / ${qd && qd.qid})`);
if (qa) { A.send({ t: 'ans', qid: qa.qid, i: 0 }); D.send({ t: 'ans', qid: qa.qid, i: 1 }); G1.send({ t: 'ans', qid: qa.qid, i: 2 }); }
await sleep(qa ? qa.ends - Date.now() + 2500 : 100);
const ra = A.msgs.filter((m) => m.t === 'reveal').pop(), rd = D.msgs.filter((m) => m.t === 'reveal').pop();
check(ra && rd && ra.n === 3 && rd.n === 3 && JSON.stringify(ra.top) === JSON.stringify(rd.top), `reveal aggregates answers from both screens (n=${ra && ra.n}/${rd && rd.n}), same Top 5`);
const nxa = A.msgs.filter((m) => m.t === 'next').pop(); check(nxa && nxa.at > Date.now() + 200e3, 'next round time pushed to screens');
// reconnect returns to screen
D.ws.close(); await sleep(300); const D2 = await new Promise((res) => { const ws = new WebSocket(`${WS}/api/theatre/tnpsc/ws?p=${D.p}&scap=${SCAP}`); ws.on('open', () => ws.send(JSON.stringify({ t: 'hello', name: 'D', pid: D.p }))); ws.on('message', (d) => { const m = JSON.parse(d); if (m.t === 'state') { res(m.scr); ws.close(); } }); });
check(D2 === 2, `reconnect goes back to screen 2 (got ${D2})`);
console.log(`\n${ok} passed, ${bad} failed`); process.exit(bad ? 1 : 0);
