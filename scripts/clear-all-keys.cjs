require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const BASE  = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;
const keys  = ['polity','geography','science','history','physics','chemistry','biology',
                'maths','economics','english','reasoning','current_affairs','banking','tamil','computer'];
async function del(key) {
  const r = await fetch(`${BASE}/del/${encodeURIComponent('quiz:subject:'+key)}`,
    { method:'POST', headers:{ Authorization:`Bearer ${TOKEN}` } });
  const j = await r.json();
  console.log(`DEL quiz:subject:${key} →`, j.result);
}
async function main() {
  for (const k of keys) await del(k);
  console.log('All keys cleared.');
}
main().catch(console.error);
