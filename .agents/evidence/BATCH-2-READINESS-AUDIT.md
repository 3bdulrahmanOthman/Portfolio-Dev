# Batch 2 Readiness Audit (framework / compiler group)

> **Date:** 2026-09-21 · **Mode:** READ-ONLY AUDIT — no mutation of any kind occurred.
> **Authorization:** Human Command 13. **Candidates (audit targets only):** next, react, react-dom,
> typescript, eslint (+ their direct companions eslint-config-next, @eslint/eslintrc, @types/react,
> @types/react-dom).
> **Runtime tag:** all observations under Node v25.9.0 (provisional Node 25 conditions in force).

## 1. Executive summary

**READY WITH CONDITIONS — no blockers against the staged path.**

- The **staged security step (Next 15.3.0 → 15.5.25)** is clean: no code pattern in this repository touches any 15.5 deprecation or 16 removal; `eslint-config-next@15.5.25` exists as a matching backport (registry dist-tag `backport`, verified 2026-09-21).
- The **full jump (Next 16.3.5 + React 19.3 + ESLint 10.11.0)** is also viable on paper — the repo's App Router usage is already Next-15-idiomatic (async `params`/`searchParams` props, no AMP/legacyBehavior/runtime-config/experimental usage, no parallel routes) — but it carries exactly **one code migration item** (a deep `next/dist` import in `handle-error.ts`), the **`next lint` removal** (script + config migration), and the **middleware.ts → proxy.ts deprecation**. All are bounded, known-scope changes.
- **TypeScript 7 is blocked** by the toolchain, not by the project: typescript-eslint 8.70.0 declares `typescript <6.1.0` (registry manifest, 2026-09-21), and TS 7 is the native-Go compiler with no API until 7.1. Latest safe 5.x = **5.9.3**. TS 6.0 remains beta (`dist-tag beta: 6.0.0-beta`) — not a candidate.
- **React 19.3 peer-compatibility: universal** across every third-party package in the graph except the pre-existing `react-day-picker@8.10.1` unmet-peer baseline warning (unchanged since Phase 0).
- **Development-entry point: after the staged Step 1** (Next 15.5.25 + eslint-config-next 15.5.25, optionally + React 19.3 + TS 5.9.3) — see §16.

## 2. Current baseline (verified fresh, 2026-09-21)

- HEAD `519a0026a75927a89cf2cadeedb313cfa26e4e21` · working tree = standing Batch 1 set · `package-lock.json` absent.
- Batch 1 final state verified installed: react-label 2.1.15, axios 1.20.0, next-auth beta.32, RHF 7.88.0, resolvers 5.9.1, @upstash/redis 1.38.4, @upstash/ratelimit 2.1.0 (node_modules reads).
- **Fresh verification (read-only):** `tsc --noEmit --incremental false` → **20 error lines, list byte-identical to the Batch 1 baseline** (diff-proven); `pnpm lint` → **2 errors** (`chat-widget.tsx:30:10`, `socket.ts:45:67`); `next --version` → `Next.js v15.3.0`.

## 3. Candidate package matrix

Registry data queried 2026-09-21 via `pnpm view` (machine resolves registry.npmmirror.com; dist-tags cross-checked against npmjs semantics per prior audit precedent).

| Package | Declared | Locked = installed | Latest stable | Candidate | Engines (candidate) | Peer requirements (candidate) |
|---|---|---|---|---|---|---|
| next | 15.3.0 (exact) | 15.3.0 | 16.3.5 (dist-tag `latest`; `backport: 15.5.25`) | 15.5.25 then 16.3.5 | 15.5.25: `^18.18 \|\| ^19.8 \|\| >=20` ✓ Node 25 · 16.3.5: `>=20.9.0` ✓ | react/react-dom `^18.2 \|\| 19rc \|\| ^19` ✓ both stages |
| react / react-dom | `^19.0.0` | 19.1.0 | 19.3.0 | 19.3.0 | `>=0.10` (none) | (none) — consumed via framework |
| typescript (dev) | `^5` | 5.8.3 | 7.0.2 (`beta: 6.0.0-beta`; 5.x line ends at **5.9.3**) | **5.9.3** (7 blocked; 6 beta) | none | typescript-eslint 8.70.0: `>=4.8.4 <6.1.0` → 5.9.3 ✓, 7.0.2 ✗ |
| eslint (dev) | `^9` | 9.30.1 | 10.11.0 | 10.11.0 (staged with Next 16, not before) | `^20.19 \|\| ^22.13 \|\| >=24` ✓ Node 25 | `jiti: *` |
| eslint-config-next (dev) | 15.3.0 (exact) | 15.3.0 | 16.3.5 (`backport: 15.5.25`) | 15.5.25 then 16.3.5 | — | 15.5.25: eslint `^7.23 \|\| ^8 \|\| ^9` ✓ current 9.30.1 · 16.3.5: eslint `>=9` ✓ (10 OK), TS `>=3.3.1` ✓ |
| @types/react / @types/react-dom (dev) | `^19` | 19.1.8 / 19.1.6 | **19.3.0** | 19.3.0 with React 19.3 | — | — |
| @eslint/eslintrc (dev) | `^3` | 3.3.7 | 3.3.7 (already latest) | keep | `^18.18 \|\| ^20.9 \|\| >=21.1` ✓ | no eslint peer cap → FlatCompat survives ESLint 10 |

Direct dependents (all in package.json root; no workspace): next → app framework; react/react-dom → app + every UI lib; typescript → tsc/tsconfig/next typescript plugin; eslint → `eslint.config.mjs` (flat, via FlatCompat extending `next/core-web-vitals` + `next/typescript`).

## 4. Next.js readiness

Codebase scan evidence (greps dated 2026-09-21, all recorded in §17 commands):

| Area | Finding | Classification |
|---|---|---|
| `next.config.ts` | only `images.remotePatterns` (utfs.io) + `images.unoptimized: true` + the two ignore flags. **No** experimental/devIndicators/runtimeConfig/webpack/turbopack keys | **SAFE** (15.5 & 16) |
| `src/pages` | absent — App Router only | **SAFE** |
| `instrumentation` | absent | **SAFE** |
| Route props | all dynamic pages already type `params: Promise<…>` / `searchParams: Promise<…>` (4 pages) — Next 16's sync-access removal is already satisfied | **SAFE** |
| `cookies()/headers()/draftMode()` | zero call sites | **SAFE** |
| AMP / `legacyBehavior` / `next/legacy/image` / `useAmp` | zero usages (grep hit on "timestamp" is a false positive) | **SAFE** |
| `next/image` `quality` prop | zero usages; `unoptimized: true` anyway. `images.qualities`/`localPatterns`/`domains` unconfigured | **SAFE** (16 defaults change is moot here) |
| Parallel routes / `default.js` slots | none | **SAFE** |
| `scroll-behavior: smooth` | absent from `globals.css` | **SAFE** |
| `next/cache` | `revalidatePath` ×5 (unaffected), **`unstable_cache` ×3** — *not* in Next 16's removal table (16 blog §Removals, fetched 2026-09-21); carries deprecation pressure toward `use cache`/Cache Components | **LOW** (15.5) / **MEDIUM** (16 — verify warnings, plan migration later) |
| `next/font/google` ×1 (layout.tsx) | modern API | **SAFE** |
| `next/navigation` ×13 files | current APIs (`useRouter`, `usePathname`, `useSearchParams`, `redirect`, `notFound`) | **SAFE** |
| `next/server` ×1 (`NextResponse` in `/api/admin/route.ts`) | stable API | **SAFE** |
| `next/link` ×7 | standard usage (no `legacyBehavior`) | **SAFE** |
| **`src/lib/handle-error.ts:3`** — `import { isRedirectError } from "next/dist/client/components/redirect-error"` | **deep `next/dist` import of unstable internals.** Works today (15.3). 15.5 begins deprecation-warning era for 16 removals; Next 16's Turbopack-default internals make deep-dist imports the top breakage class. Recommended replacement direction: `unstable_rethrow`/digest-based redirect handling from `next/navigation` (verify exact API at the 16 gate) | **MEDIUM** (15.5 — expect warning at most) / **HIGH** (16 — must be migrated before/at the 16 upgrade) |
| `src/middleware.ts` (NextAuth edge wrapper, matcher `/admin`,`/auth`) | Next 16 **deprecates** `middleware.ts` in favor of `proxy.ts` but **still supports it** in 16 ("will be removed in a future version" — 16 blog). Rename is mechanical (`proxy` export); Auth.js beta.32 wrapper is filename-agnostic (auth() wraps the handler either way) | **LOW** (15.5) / **MEDIUM** (16 — optional rename now, forced later) |
| Server actions ×8 files (`"use server"`) | standard form-action pattern; `revalidatePath` compatible | **SAFE** |
| Metadata | static `metadata` exports only, no `generateMetadata`, no image-route params API | **SAFE** |
| Dev script | `next dev --turbopack` already; Next 16 makes **build** Turbopack-default too (no webpack config to migrate; `--webpack` escape hatch exists) | **LOW** (16 — build output/CSS-ordering verification required at that gate) |
| `next lint` usage | `package.json` script `lint: next lint` — **removed in Next 16**; in 15.5 only warns. `next build` auto-lint already disabled via `ignoreDuringBuilds` | **LOW** (15.5) / **BLOCKER-level at 16 unless migrated** → trivial, codemod exists (`npx @next/codemod … next-lint-to-eslint-cli`) |
| Typed routes / route export validation (new 15.5 features) | opt-in (`typedRoutes` flag); not required | n/a |

**Next.js overall: no BLOCKER for 15.5.25; three bounded items (deep dist import, lint script, proxy rename) gated on the 16 step.**

## 5. React readiness (19.1.0 → 19.3.0)

- App code uses standard hooks/refs/effects/forms; no React-internal or canary-API usage found in `src/` (no `use()`-dependent patterns, no `ViewTransition`/`Activity`/`useEffectEvent` dependencies). React 19.3 is a minor within 19 — no forwardRef removal (forwardRef still supported, deprecated guidance only).
- **Third-party peer matrix — every package accepts react ^19** (installed manifests read 2026-09-21): radix set (^16.8…^19), @tiptap/react 2.24.2 (^17||^18||^19), @tanstack/react-table 8.21.3 (>=16.8), recharts 3.0.2 (…^19), framer-motion 11.18.2 & motion 12.23.0 (^18||^19), sonner 2.0.8, cmdk, vaul, next-themes, lucide-react, RHF 7.88.0, jotai — **all ✓**.
- The **only unmet peer in the whole graph remains `react-day-picker@8.10.1`** (`react ^16.8||^17||^18`) — a **pre-existing baseline warning** since Phase 0; React 19.3 does not change it (no new warning class). Its v9/v10 migration is already roadmap-gated.
- Auth.js: next-auth beta.32 peers `react ^18.2 || ^19` ✓.
- **Classification: LOW risk.** The package to actually exercise at the gate: recharts + the shadcn chart wrapper (already the typing-friction point) and the Radix surface (visual smoke).

## 6. TypeScript readiness

- `tsconfig.json`: strict, `moduleResolution: bundler`, `target ES2017`, `jsx: preserve`, `incremental: true`, next plugin, `@/*` paths; **no** project references, no typeRoots, no custom `types[]`. Modern and TS-7-portable in shape.
- **`.tss` phantom includes confirmed:** `include` lists `src/app/admin/projects/page.tss` and `src/app/admin/inbox/page.tss` — **neither file exists**. Current TS treats non-matching include entries silently (fresh tsc emits only the 20 known errors). Classified: **NON-BLOCKING WARNING / deferred cleanup** (config hygiene; remove at any convenient gate — a config edit, i.e. gated, out of this audit's scope).
- **Baseline error classification (20 lines):**
  - `src/actions/chat.ts` ×8 — **project-code** (schema has no `Conversation`/`Message` models; documented chat-ADR item). Will **remain** under any candidate TS.
  - `chart.tsx` ×8 + `data-table-date-filter.tsx` ×2 — **dependency-induced typing friction with recharts 3.0.2** (shadcn chart wrapper vs recharts v3 types). Not TS-version-caused; could shift marginally under 5.9 (in-place patch typing changes) — watch, classify per NO-NEW-ERRORS at the gate.
  - `hero/default.tsx` ×1 (`"glow"` variant) — **project-code**. Remains.
  - `lib/export.ts` ×1 — **project-code** (argument typing vs TanStack column keys). Remains.
- **Assessment by line:**
  - **TS 5.9.3** (latest 5.x): peers clean (typescript-eslint `<6.1.0` ✓, next min `>=5.1` ✓). Risk **LOW** — same-strictness patch+minor; the 20-error baseline is expected to hold (verify at gate).
  - **TS 6.0** — **still beta** (`dist-tag beta: 6.0.0-beta`, 2026-09-21); the JS-bridge release. Not a candidate until GA; re-evaluate then.
  - **TS 7.0.2** — **NOT supported by the toolchain**: typescript-eslint 8.70.0 peer caps `typescript <6.1.0`; TS 7 is the native Go compiler with no compiler API until 7.1 (typescript-eslint dependency; consistent with `DEPENDENCY-UPGRADE-AUDIT.md` §3, 2026-09-20). **Blocked until typescript-eslint ships 7.x support** — do not adopt "because newest".

## 7. ESLint readiness

- Current: `eslint.config.mjs` flat config built through `FlatCompat` (`@eslint/eslintrc@3.3.7` — already latest) extending the legacy-style `next/core-web-vitals` + `next/typescript` presets. No legacy `.eslintrc*` files. Parsed errors are only the 2 baseline items.
- **ESLint 10.11.0:** engines ✓ Node 25; peer `jiti *`. Flat-only direction; `@next/eslint-plugin-next` 16 already "defaults to ESLint Flat Config format, aligning with ESLint v10 which will drop legacy config support" (Next 16 blog). FlatCompat itself carries no eslint peer cap (3.3.7 manifest) → config translation keeps working, but the **clean path is to drop FlatCompat** when moving to eslint-config-next 16 (its 16.x presets are flat-native) and replace the `next lint` script with direct `eslint .` (codemod available; `next lint` is removed in 16).
- **Coordinated requirements:** ESLint 10 belongs **with the Next 16 step**, not the 15.5 step: eslint-config-next@16.3.5 peers `eslint >=9` (10 ✓) and depends on `typescript-eslint ^8.46` (resolves to 8.70, which declares eslint `^8.57 || ^9 || ^10` ✓) + `eslint-plugin-react-hooks ^7`. For the staged 15.5 step, keep eslint 9.30.1 with eslint-config-next@15.5.25 (peers `^7||^8||^9` ✓). Verify the transitive typescript-eslint resolution at the gate.

## 8. Prisma constraints (audit-only; no upgrade performed or proposed)

- State: `prisma`/`@prisma/client` 6.11.1, `@prisma/extension-accelerate` 1.3.0, **edge client** (`@prisma/client/edge` + `withAccelerate()` in `src/lib/db/prisma.ts`), **no `prisma/migrations` directory** (verified), 5 models (User, About, Project, Category, Contact), generated client 6.11.1 in store.
- Framework/compiler candidates **do not touch Prisma packages** (no dependency coupling). Node/Next changes don't alter the edge-client assumptions.
- One verification point (not a blocker): at the Next 16 step, confirm Turbopack-bundled server output keeps the edge client + Accelerate extension working (server-externals/bundling behavior differs from webpack) — smoke via a Prisma-backed admin page.
- **Prisma 7 stays isolated as a dedicated future migration project** (Batch 7 per roadmap) — the Gate 1 Node-24 re-verify condition still applies there. Nothing in this audit changes that.

## 9. Auth constraints

- Verified installed/locked: `next-auth` 5.0.0-beta.32, `@auth/core` **0.41.3 (single copy)**, `@auth/prisma-adapter` 2.11.3.
- `src/auth.ts` (NextAuth root config: JWT strategy, PrismaAdapter, session/jwt callbacks), `src/auth.config.ts` (Credentials provider + LoginSchema), `src/middleware.ts` (NextAuth wrapper, matcher) — no framework-coupled patterns beyond the middleware filename convention (§4).
- Candidate compatibility: next-auth beta.32 peers `next ^14 || ^15 || ^16`, `react ^18.2 || ^19` (registry manifest) → **both Next stages and React 19.3 are inside its declared support**. No auth config change required for 15.5. The only auth-adjacent 16 item is the optional `middleware.ts → proxy.ts` rename (§4); Auth.js supports either (the wrapper is a plain handler).
- No credentials accessed, no login performed (per command contract).

## 10. Third-party compatibility matrix (constraining candidates)

| Package (locked) | react/next peer | vs React 19.3 | vs Next 15.5.25 | vs Next 16.3.5 | Risk / sequencing |
|---|---|---|---|---|---|
| @radix-ui/* (23, 1.x–2.x post-Batch-1) | react ^16.8…^19 | ✓ | ✓ | ✓ | none |
| tailwindcss/@tailwindcss/postcss 4.3.3 | none (build-time) | ✓ | ✓ | ✓ | none |
| @tiptap/* 2.24.2 (15) | ^17\|\|^18\|\|^19 | ✓ | ✓ | ✓ | none (v3 project separately gated) |
| @tanstack/react-table 8.21.3 | >=16.8 | ✓ | ✓ | ✓ | none (v9 separately gated) |
| recharts 3.0.2 | …^19 | ✓ | ✓ | ✓ | typing friction already in baseline |
| framer-motion 11.18.2 / motion 12.23.0 | ^18\|\|^19 | ✓ | ✓ | ✓ | framer-motion rides chat ADR |
| uploadthing 7.7.3 / @uploadthing/react 7.3.2 | react ✓; **next `*`** | ✓ | ✓ | ✓ | verify at 16 (UploadThing pins its own next adapter version) |
| sonner 2.0.8, nuqs 2.10.1 (next >=14.2 ✓), nextjs-toploader 3.9.17 (next >=6 ✓), next-themes, cmdk, vaul, lucide-react | ✓ | ✓ | ✓ | ✓ | none |
| zod 3.25.74 | none | ✓ | ✓ | ✓ | Zod 4 separately gated |
| react-day-picker 8.10.1 | react ^16.8\|\|^17\|\|^18 | **unmet (pre-existing)** | same | same | baseline warning; v9/v10 migration gated |
| socket.io 4.8.1 | none | ✓ | ✓ | ✓ | dead code, chat ADR |
| next-auth 5.0.0-beta.32 | next ^14\|\|^15\|\|^16 | ✓ | ✓ | ✓ | — |

**No package constrains the candidate upgrades.** The only standing warnings are pre-existing (react-day-picker peers; esbuild ignored-builds notice).

## 11. Security findings (verified current, not historical)

- Source: `snapshots/batch-1-groups-b-c/audit-informational.log` (`pnpm audit --registry=https://registry.npmjs.org`, **2026-09-21**). `next` carries **33 advisory entries including 3 critical**: GHSA-9qr9-h5gf-34mp (React flight RCE, fixed ≥15.3.6), **GHSA-p293-qw3h-jr36 (unauthenticated RCE on Windows-hosted servers, fixed ≥15.5.24)**, GHSA-2xp9-vwfh-vxw4 (Image Optimization AVIF RCE, fixed ≥15.5.24) — all path `.>next`.
- **Urgency is real on this machine**: the dev environment is Windows (`win32 10.0.26200`), directly matching GHSA-p293-qw3h-jr36's affected class for any exposed dev/prod server. `next@15.5.25` (dist-tag `backport`) clears every recorded advisory floor (≥15.5.24). No axios/next-auth/@auth/core findings remain post-Batch-1 (verified same log).
- react/typescript/eslint candidates: no security advisories recorded against them in the current audit log; ESLint 10/TS 5.9 upgrades are capability-driven, not security-driven.
- Path toward 16.3.5: inherits all 15.5.25 fixes (superset release); no new advisory was observed for 16.3.5 in the current log.

## 12. Current verification baseline (fresh, this audit)

- `pnpm exec tsc --noEmit --incremental false` → exit 2, **20 error lines**, list **diff-identical** to the Batch 1 record (chat ×8, date-filter ×2, hero ×1, chart ×8, export ×1).
- `pnpm lint` → exit 1, **2 errors** (chat-widget 30:10 unused-vars; socket 45:67 no-explicit-any).
- `pnpm exec next --version` → `Next.js v15.3.0`.
- Under candidates (projection, §6/§13): TS 20→expected 20 (recharts-typing lines = watch points); lint unchanged in 15.5 stage; **at the 16 stage the lint command itself changes** (baseline must be re-recorded under the new ESLint CLI invocation).

## 13. Identified blockers

**None against the staged path.** Explicitly *not* blockers (per command §16): pnpm store residue (orphaned dirs — inert, recorded since Batch 1); the 20+2 baseline errors (none is caused by, or prevents, any candidate upgrade); the `.tss` phantom includes (silent under current TS; hygiene item); Node 25.9.0 EOL (runtime decision, satisfies every candidate's engines today).

Conditional gate-requirements (become blockers only at the Next 16 step if unaddressed): `next lint` script removal; `handle-error.ts` deep `next/dist` import; UploadThing/`unstable_cache`/Turbopack-build smoke verification.

## 14. Risk classification (aggregate)

| Risk | Class | Evidence |
|---|---|---|
| Next 15.3→15.5.25 framework behavior | **LOW** | no deprecated/removed pattern in repo (§4); deps peers clean (§10) |
| Windows-hosted RCE while on 15.3.0 | **HIGH (security, current)** | §11 — drives staging order, not difficulty |
| React 19.3 | **LOW** | universal peer compatibility (§5/§10) |
| TS 5.9.3 | **LOW** | peers clean; baseline expected stable (§6) |
| TS 7 | **BLOCKED (external)** | typescript-eslint `<6.1.0` peer; API returns at 7.1 |
| TS 6 beta | **NOT A CANDIDATE** | still `beta` dist-tag |
| ESLint 10 + eslint-config-next 16 + lint-script migration | **MEDIUM** (coordinated, mechanical) | §7; codemod exists |
| Next 16 step (Turbopack build default, proxy rename, deep-dist import fix, unstable_cache pressure) | **MEDIUM** aggregate, one **HIGH** item (handle-error.ts) | §4 |
| Prisma | **NONE** from this batch | §8 |

## 15. Recommended sequencing (minimizes rounds, preserves causal diagnosis)

**Stage A — one gate (security + coherence, minimal surface):**
1. `next 15.3.0 → 15.5.25` **+** `eslint-config-next 15.5.25` (backport pair — do not split; they share the framework version line).
2. **Combine** `react/react-dom 19.3.0` **+** `@types/react @types/react-dom 19.3.0` into the same gate — peer matrix is unambiguous (§10), and splitting would double dev-server/build smoke cost for near-zero diagnostic value. *(If the human prefers maximal isolation, react can be a separate micro-gate — it is the only defensible split.)*
3. **Optional in this gate or a follow-up micro-gate:** `typescript 5.9.3`. Peers clean; keeping it in the same gate is acceptable, but it is the easiest item to isolate if strict causal diagnosis is wanted.

- Verification set: fresh typecheck vs 20-line baseline, lint vs 2-error baseline, dev-server smoke (admin + public pages, chart wrapper, forms), build smoke (`next build` remains untrusted for type/lint but validates Turbopack-dev-unchanged behavior — build script stays webpack-default on 15.5 unless beta-flags are deliberately tried).

**Stage B — separate gate (major framework step, later):**
`next 16.3.5` + `eslint-config-next 16.3.5` + `eslint 10.11.0` + lint-script/config migration (drop FlatCompat, direct `eslint .`) + `handle-error.ts` redirect-error migration + optional `proxy.ts` rename + Turbopack-build/Prisma-edge/UploadThing smokes. This is a genuine migration gate (code changes required) — never merged into Stage A.

**Explicitly out of both stages (unchanged roadmap):** Prisma 7 project, Zod 4, Tiptap 3, TanStack 9, react-day-picker 9/10, TS 6 GA re-eval / TS 7 (blocked), @types/node (runtime decision), cleanup batch.

## 16. Development-entry criteria — answer

**The repository is sufficiently stable for normal feature development after Stage A (next 15.5.25 + eslint-config-next 15.5.25 [+ react 19.3 ± ts 5.9.3]).**

Objective criteria met at that point: dependency baseline coherent (Batch 1 40/40 + security-floor framework); **security floor satisfied (≥15.5.24 — closes the Windows RCE class)**; typecheck regression-free (20-line baseline held, NO-NEW-ERRORS verified); lint regression-free (2 baseline errors unchanged); runtime verification adequate (dev-server + build smokes); no unresolved upgrade-induced blocker (§13 — all remaining items are Stage B work). The standing 20+2 historical baseline errors are demonstrably unrelated to the upgrade path (project-code + recharts typing, §6) and do not gate development entry per the command's own criteria. Stage B (Next 16) is an improvement step, not a stability prerequisite.

## 17. Exact commands executed (all read-only)

```text
git rev-parse HEAD; git status --short; node --version; pnpm --version; ls package-lock.json (absent)
node_modules version reads (Batch 1 state + candidates)
pnpm view <next|react|react-dom|typescript|eslint|eslint-config-next> dist-tags/engines/peerDependencies/dependencies (candidates: next@15.5.25, next@16.3.5, eslint@10.11.0, eslint-config-next@15.5.25, eslint-config-next@16.3.5, typescript-eslint@latest, @eslint/eslintrc@3.3.7, react@19.3.0, @types/*)
Reads: next.config.ts, tsconfig.json, eslint.config.mjs, src/auth.ts, src/auth.config.ts, src/middleware.ts, prisma/schema.prisma, src/lib/db/prisma.ts, package.json
Greps: next/* import map; "use server" files; dynamic imports; metadata/generateMetadata; headers()/cookies(); params/searchParams Promise typing; revalidatePath/unstable_cache/revalidateTag; legacyBehavior/AMP/next/legacy/image; Image quality & query-string src; parallel routes/@slots; scroll-behavior; experimental config keys; .tss existence check; third-party peer matrix from installed manifests
WebFetch (official, dated): nextjs.org/blog/next-15-5; nextjs.org/blog/next-16; WebSearch corroboration
pnpm exec next --version                       → Next.js v15.3.0
pnpm exec tsc --noEmit --incremental false     → exit 2, 20 error lines (list diff vs baseline: identical)
pnpm lint                                      → exit 1, 2 baseline errors
```

No `pnpm install/update/add/remove/dedupe/prune/approve-builds`, no prisma generate, no file/config/source modification, no Playwright, no database access.

## 18. Explicit statement — no mutation occurred

HEAD remained `519a0026a75927a89cf2cadeedb313cfa26e4e21`; `git status --short` byte-equal to pre-audit; `package.json`/`pnpm-lock.yaml`/source/config/database untouched; `package-lock.json` still absent. The only new repository artifacts are this report (`.agents/evidence/BATCH-2-READINESS-AUDIT.md`). No commit/push/branch/stash/reset/restore/clean. Existing evidence files unmodified.

**HARD STOP — executing any stage of §15 requires separate human authorization.**
