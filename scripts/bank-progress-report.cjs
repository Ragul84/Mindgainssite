const fetch = require('node-fetch');
require('dotenv').config();

const REDIS_URL = process.env.EXPO_PUBLIC_UPSTASH_REST_URL || process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.EXPO_PUBLIC_UPSTASH_REST_TOKEN || process.env.EXPO_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

async function report() {
  const keysResp = await (globalThis.fetch || fetch)(REDIS_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['KEYS', 'quiz:subject:*'])
  });
  const keys = (await keysResp.json()).result;

  console.log('\n📊 LIVE PROGRESS REPORT: MINDGAINS CONTENT VAULT');
  console.log('===============================================\n');

  let total = 0;
  for (const key of keys) {
    const lenResp = await (globalThis.fetch || fetch)(REDIS_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['LLEN', key])
    });
    const count = (await lenResp.json()).result;
    console.log(`🔹 ${key.padEnd(30)} : ${count} Questions`);
    total += count;
  }
  console.log('\n-----------------------------------------------');
  console.log(`🔥 TOTAL LIVE QUESTIONS : ${total}`);
  console.log('-----------------------------------------------\n');
}

report();
