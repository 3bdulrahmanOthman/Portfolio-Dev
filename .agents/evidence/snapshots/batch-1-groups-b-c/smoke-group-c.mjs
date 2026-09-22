const results = [];
const rec = (name, ok, detail) => results.push({ name, ok, detail });

// react-hook-form
try {
  const rhf = await import('react-hook-form');
  rec('react-hook-form import', typeof rhf.useForm === 'function', `useForm=${typeof rhf.useForm}, version=${rhf.version ?? 'n/a'}`);
} catch (e) { rec('react-hook-form import', false, e.message.slice(0,200)); }

// @hookform/resolvers (zod entry — the one the project uses)
try {
  const zr = await import('@hookform/resolvers/zod');
  rec('@hookform/resolvers/zod import', typeof zr.zodResolver === 'function', `zodResolver=${typeof zr.zodResolver}`);
} catch (e) { rec('@hookform/resolvers/zod import', false, e.message.slice(0,200)); }

// @upstash/redis — construct Redis instance locally (no network I/O)
try {
  const { Redis } = await import('@upstash/redis');
  const r = new Redis({ url: 'https://example.upstash.io', token: 'TEST_TOKEN_ONLY' });
  rec('@upstash/redis import + construct', r instanceof Redis, `Redis class OK (no network call made)`);
} catch (e) { rec('@upstash/redis import + construct', false, e.message.slice(0,200)); }

// @upstash/ratelimit — construct against local Redis object (no network)
try {
  const { Ratelimit } = await import('@upstash/ratelimit');
  const { Redis } = await import('@upstash/redis');
  const rl = new Ratelimit({ redis: new Redis({ url: 'https://example.upstash.io', token: 'TEST_TOKEN_ONLY' }), limiter: Ratelimit.slidingWindow(10, '10 s') });
  rec('@upstash/ratelimit import + construct', rl instanceof Ratelimit, `slidingWindow limiter OK (no network call made)`);
} catch (e) { rec('@upstash/ratelimit import + construct', false, e.message.slice(0,200)); }

// installed versions via package.json (exports-map safe)
const fs = await import('node:fs');
for (const p of ['react-hook-form', '@hookform/resolvers', '@upstash/redis', '@upstash/ratelimit']) {
  try {
    const v = JSON.parse(fs.readFileSync(`node_modules/${p}/package.json`, 'utf8')).version;
    rec(`version ${p}`, true, v);
  } catch (e) { rec(`version ${p}`, false, e.message.slice(0,120)); }
}

for (const r of results) console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${r.name}: ${r.detail}`);
process.exit(results.some(r => !r.ok) ? 1 : 0);
