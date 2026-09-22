/**
 * Module-customization hook for standalone Prisma scripts.
 *
 * The Prisma 7.10 "prisma-client" generator (runtime edge-light) loads its
 * query-compiler WASM through a bundler-only import:
 *
 *   const { default: module } = await import("./....wasm?module")
 *
 * Bundlers (Turbopack/webpack) rewrite that into a module whose default
 * export is a compiled WebAssembly.Module. Bare Node cannot: on Node 25 it
 * natively instantiates the file as an ES module of wasm *exports* instead,
 * leaving `default` undefined, and Prisma fails at first query with
 * "The loaded wasm module was unexpectedly `undefined` or `null` once loaded".
 *
 * This hook reproduces the bundler contract for `*.wasm?module` imports: it
 * returns a synthetic ESM module whose default export is the compiled
 * WebAssembly.Module of the real file's bytes. It applies ONLY to standalone
 * scripts run with this hook; the Next.js application (Turbopack) never loads
 * it. Usage:
 *
 *   node --import tsx --import ./scripts/lib/wasm-module-hook.mjs <script.ts>
 */

import { registerHooks } from "node:module";

const WASM_MODULE_SUFFIX = ".wasm?module";

registerHooks({
  load(url, context, nextLoad) {
    if (!url.endsWith(WASM_MODULE_SUFFIX)) {
      return nextLoad(url, context);
    }

    // Strip only the "?module" query — the remaining URL is the real .wasm file.
    const wasmFileUrl = url.slice(0, -"?module".length);
    const source = [
      `import { readFileSync } from "node:fs";`,
      `const bytes = readFileSync(new URL(${JSON.stringify(wasmFileUrl)}));`,
      `export default new WebAssembly.Module(bytes);`,
    ].join("\n");

    return { format: "module", source, shortCircuit: true };
  },
});
