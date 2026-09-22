// Read-only smoke checks for Batch 1 Group A. No source, config, or dependency mutation.
import fs from 'node:fs';
import { createRequire } from 'node:module';

const DIRECT = [
  'nuqs', 'date-fns', 'sonner', 'nextjs-toploader', 'tailwind-merge', 'tw-animate-css',
  '@auth/prisma-adapter', '@eslint/eslintrc', 'tailwindcss', '@tailwindcss/postcss',
  '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox', '@radix-ui/react-collapsible', '@radix-ui/react-context-menu',
  '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-hover-card',
  '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', '@radix-ui/react-scroll-area',
  '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slider',
  '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs',
  '@radix-ui/react-toggle', '@radix-ui/react-toggle-group', '@radix-ui/react-toolbar',
  '@radix-ui/react-tooltip',
];

let fail = 0;
for (const name of DIRECT) {
  try {
    import.meta.resolve(name);
    console.log(`RESOLVE OK   ${name}`);
  } catch (e) {
    fail++;
    console.log(`RESOLVE FAIL ${name} :: ${e.code || e.message}`);
  }
}

// Safe deep-eval checks (no React/JSX, no Next runtime coupling)
for (const name of ['tailwind-merge', 'date-fns', '@auth/prisma-adapter']) {
  try {
    const m = await import(name);
    console.log(`EVAL OK      ${name} (exports: ${Object.keys(m).slice(0, 4).join(', ')})`);
  } catch (e) {
    fail++;
    console.log(`EVAL FAIL    ${name} :: ${e.code || e.message}`);
  }
}

// Tailwind v4 real compile of the actual globals.css via the project plugin
try {
  const twEntry = import.meta.resolve('@tailwindcss/postcss');
  const req = createRequire(twEntry);
  const postcss = req('postcss');
  const twPluginMod = await import('@tailwindcss/postcss');
  const twPlugin = twPluginMod.default ?? twPluginMod;
  const cssIn = fs.readFileSync('src/app/globals.css', 'utf8');
  const result = await postcss([twPlugin]).process(cssIn, { from: 'src/app/globals.css' });
  const len = result.css.length;
  const hasTheme = /:root|--color/.test(result.css);
  console.log(`TAILWIND COMPILE OK  output=${len} bytes, theme vars present=${hasTheme}`);
} catch (e) {
  fail++;
  console.log(`TAILWIND COMPILE FAIL :: ${e.message?.split('\n').slice(0, 6).join(' | ')}`);
}

console.log(fail === 0 ? 'SMOKE RESULT: ALL PASS' : `SMOKE RESULT: ${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
