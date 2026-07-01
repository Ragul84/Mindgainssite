require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const subjects = ['polity','geography','science','history','physics','chemistry','biology','maths','economics','english','reasoning','current_affairs','banking','tamil','computer'];
async function go() {
  let total = 0;
  for (const s of subjects) {
    const key = 'quiz:subject:' + s;
    const r = await fetch(`${BASE}/llen/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const j = await r.json();
    const count = j.result;
    total += count;
    console.log(s.padEnd(16) + ' ' + count);
  }
  console.log('----------------------------');
  console.log('TOTAL            ' + total);
}
go().catch(console.error);
