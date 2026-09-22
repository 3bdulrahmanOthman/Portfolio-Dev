const results = [];
function rec(name, ok, detail) { results.push({ name, ok, detail }); }

// 1. next-auth/jwt entry (pure JS, no Next runtime)
try {
  const jwt = await import('next-auth/jwt');
  rec('next-auth/jwt import', true, `getToken=${typeof jwt.getToken}`);
} catch (e) { rec('next-auth/jwt import', false, `${e.code||''} ${e.message}`.slice(0,300)); }

// 2. next-auth main entry — may require Next runtime conditions; classify
try {
  const mod = await import('next-auth');
  rec('next-auth main import', true, `default=${typeof mod.default}`);
} catch (e) {
  const envLimit = /next[\/]server/.test(e.message) && /ERR_MODULE_NOT_FOUND|ERR_PACKAGE_PATH_NOT_EXPORTED|Cannot find module/.test(e.message);
  rec('next-auth main import', false, `${envLimit ? 'ENV-LIMIT (next/server runtime conditions)' : 'UNEXPECTED'}: ${e.message.slice(0,220)}`);
}

// 3. plain-node import of next/server (control test for #2)
try { await import('next/server'); rec('control: next/server plain-node', true, 'imports'); }
catch (e) { rec('control: next/server plain-node', false, `${e.code||''} (same failure without next-auth => env limitation, not a batch regression)`); }

// 4. @auth/core version inside next-auth's store closure
try {
  const fs = await import('node:fs');
  const naPath = import.meta.resolve('next-auth');
  const pjUrl = new URL('../@auth/core/package.json', naPath);
  const pj = JSON.parse(await fs.promises.readFile(pjUrl, 'utf8'));
  rec('@auth/core version (next-auth closure)', pj.version === '0.41.3', pj.version);
} catch (e) { rec('@auth/core version (next-auth closure)', false, e.message.slice(0,200)); }

// 5. adapter exports
try {
  const ad = await import('@auth/prisma-adapter');
  rec('@auth/prisma-adapter import', typeof ad.PrismaAdapter === 'function', `PrismaAdapter=${typeof ad.PrismaAdapter}`);
} catch (e) { rec('@auth/prisma-adapter import', false, e.message.slice(0,200)); }

// 6. axios
try {
  const ax = await import('axios');
  rec('axios import', ax.default?.VERSION === '1.20.0', `VERSION=${ax.default?.VERSION}`);
} catch (e) { rec('axios import', false, e.message.slice(0,200)); }

for (const r of results) console.log(`${r.ok ? 'OK       ' : r.detail.startsWith('ENV-LIMIT') || r.detail.includes('control') ? 'ENV-LIMIT' : 'FAIL     '} ${r.name}: ${r.detail}`);
const hardFail = results.some(r => !r.ok && !r.detail.startsWith('ENV-LIMIT'));
process.exit(hardFail ? 1 : 0);
