# Batch 1 — Group A Result (standalone minors)

## Executive Result

**PASS WITH FINDINGS**

33 of the 34 authorized Group A packages were updated to their exact authorized target versions; verification matches both baselines exactly (typecheck 21 error lines, lint 2 errors — same locations, same codes); the lockfile diff is fully accounted for within the authorized dependency closures; user WIP is byte-identical; `package-lock.json` remains absent; no commit/push. **One authorized target was NOT executed:** `@radix-ui/react-label@1.1.15` — the version **does not exist** on the npm registry (E404 on both npmjs and npmmirror); the readiness-audit row it came from is internally corrupted (see §Findings F1). Two findings plus one acknowledged deviation are recorded (F1–F3).

## 1. Authorization & Scope

- Human Command brief: execute **Batch 1 — Group A only** (exact package list + exact target versions below), then verify and STOP.
- Reference evidence: `BATCH-1-READINESS-AUDIT.md`, `BATCH-0-GATE-1-RESULT.md`, `BATCH-0-GATE-2-RESULT.md`, `AGENT-TOOLING-SETUP-RESULT.md`, `DEPENDENCY-UPGRADE-AUDIT.md`; policies APPROVALS/VERIFICATION/GIT/DATABASE; workflows DEPENDENCY-UPGRADE.
- Runtime: **Node v25.9.0** (provisional Node 25 conditions §16 in force — this record is runtime-tagged) · **pnpm 10.9.0** (pinned via `packageManager`).
- Executed 2026-09-20, ~19:23–21:21 EDT.

## 2. HEAD before/after

| | SHA |
|---|---|
| HEAD before | `519a0026a75927a89cf2cadeedb313cfa26e4e21` |
| HEAD after | `519a0026a75927a89cf2cadeedb313cfa26e4e21` (no commits — verified) |

## 3. Authorized package list (34) and executed status

Targets are verbatim from the Command brief. "Before" = post-Gate-1 lockfile resolution (authoritative baseline).

| Package | Before | After | Status |
|---|---|---|---|
| nuqs | 2.4.3 | **2.10.1** | updated |
| date-fns | 4.1.0 | **4.4.0** | updated |
| sonner | 2.0.6 | **2.0.8** | updated |
| nextjs-toploader | 3.8.16 | **3.9.17** | updated |
| tailwind-merge | 3.3.1 | **3.7.0** | updated |
| tw-animate-css | 1.3.5 | **1.4.0** | updated |
| @auth/prisma-adapter | 2.10.0 | **2.11.3** | updated |
| tsx (dev) | 4.20.3 | **4.23.15** | updated |
| @eslint/eslintrc (dev) | 3.3.1 | **3.3.7** | updated |
| tailwindcss (dev) | 4.1.11 | **4.3.3** | updated |
| @tailwindcss/postcss (dev) | 4.1.11 | **4.3.3** | updated |
| @radix-ui/react-accordion | 1.2.11 | **1.2.20** | updated |
| @radix-ui/react-alert-dialog | 1.1.14 | **1.1.23** | updated |
| @radix-ui/react-avatar | 1.1.10 | **1.2.6** | updated |
| @radix-ui/react-checkbox | 1.3.2 | **1.3.11** | updated |
| @radix-ui/react-collapsible | 1.1.11 | **1.1.20** | updated |
| @radix-ui/react-context-menu | 2.2.15 | **2.3.7** | updated |
| @radix-ui/react-dialog | 1.1.14 | **1.1.23** | updated |
| @radix-ui/react-dropdown-menu | 2.1.15 | **2.1.24** | updated |
| @radix-ui/react-hover-card | 1.1.14 | **1.1.23** | updated |
| **@radix-ui/react-label** | **2.1.7** | 2.1.7 | **NOT updated — target does not exist (F1)** |
| @radix-ui/react-navigation-menu | 1.2.13 | **1.2.22** | updated |
| @radix-ui/react-popover | 1.1.14 | **1.1.23** | updated |
| @radix-ui/react-scroll-area | 1.2.9 | **1.2.18** | updated |
| @radix-ui/react-select | 2.2.5 | **2.3.7** | updated |
| @radix-ui/react-separator | 1.1.7 | **1.1.15** | updated |
| @radix-ui/react-slider | 1.3.5 | **1.4.7** | updated |
| @radix-ui/react-slot | 1.2.3 | **1.3.3** | updated |
| @radix-ui/react-switch | 1.2.5 | **1.3.7** | updated |
| @radix-ui/react-tabs | 1.1.12 | **1.1.21** | updated |
| @radix-ui/react-toggle | 1.1.9 | **1.1.18** | updated |
| @radix-ui/react-toggle-group | 1.1.10 | **1.1.19** | updated |
| @radix-ui/react-toolbar | 1.1.10 | **1.1.19** | updated |
| @radix-ui/react-tooltip | 1.2.7 | **1.2.16** | updated |

No package outside this list changed version (verified both for scoped and unscoped lockfile keys, §6).

## 4. Hashes (SHA-256)

| File | Pre-batch | Post-batch |
|---|---|---|
| `package.json` | `b05494078ed737f2c8634dc1834f0b16e1c1750ee2ea42ac5d933d9c2a3e68d8` | `754eb2aeef3d98f8f4e2b39090afd23b7d3a4cf4270ded69d5961c0ea433aec0` |
| `pnpm-lock.yaml` | `0a52de3393ab9dbf684b7fd03913a7da2f66cf66e61cd2f0d62c79a375e727d9` | `7042b419b45f7f5829470fbdd6db733256704cf6f7b6cac67813fbdaa76cca8b` |

Intermediate sentinels (per command): package.json `d4d5a28a…` (post-core) → `d6b46bd7…` (post-tailwind) → `f99fba19…` (post-radix-probe) → final. pnpm-lock.yaml `12a6e35a…` → `d069d96e…` → `def5a283…` → final. Pre-batch byte snapshots: `.agents/evidence/snapshots/batch-1-group-a/{package.json.pre,pnpm-lock.yaml.pre}` (snapshot hashes verified equal to pre-batch sentinels).

**`package-lock.json`: ABSENT** before and after (post-Gate-2 state preserved; verified by `ls` and `git status`).

## 5. Commands executed

Authorized as written (Group A-core and A-css completed):

```bash
pnpm update nuqs@2.10.1 date-fns@4.4.0 sonner@2.0.8 nextjs-toploader@3.9.17 tailwind-merge@3.7.0 tw-animate-css@1.4.0 @auth/prisma-adapter@2.11.3 tsx@4.23.15 @eslint/eslintrc@3.3.7   # exit 0, 3m20s
pnpm update tailwindcss@4.3.3 @tailwindcss/postcss@4.3.3                                                                                                                              # exit 0, 27.7s
```

Group A-radix (see §Execution sequence): the full literal command was attempted 4 times; see F3. Executed successfully as split commands (same 23 authorized selectors minus react-label):

```bash
pnpm update @radix-ui/react-accordion@1.2.20                                                                                                # exit 0, 47.1s (probe)
pnpm update @radix-ui/react-alert-dialog@1.1.23 @radix-ui/react-avatar@1.2.6 @radix-ui/react-checkbox@1.3.11 @radix-ui/react-collapsible@1.1.20 @radix-ui/react-context-menu@2.3.7          # exit 0, 10.8s
pnpm update @radix-ui/react-dialog@1.1.23 @radix-ui/react-dropdown-menu@2.1.24 @radix-ui/react-hover-card@1.1.23 @radix-ui/react-navigation-menu@1.2.22 @radix-ui/react-popover@1.1.23       # exit 0, 5s
pnpm update @radix-ui/react-scroll-area@1.2.18 @radix-ui/react-select@2.3.7 @radix-ui/react-separator@1.1.15 @radix-ui/react-slider@1.4.7 @radix-ui/react-slot@1.3.3                         # exit 0, 4.6s
pnpm update @radix-ui/react-switch@1.3.7 @radix-ui/react-tabs@1.1.21 @radix-ui/react-toggle@1.1.18 @radix-ui/react-toggle-group@1.1.19                                                       # exit 0, 4.6s
pnpm update @radix-ui/react-toolbar@1.1.19 @radix-ui/react-tooltip@1.2.16                                                                                                                    # exit 0, 4.6s
```

No `pnpm install` was run separately. No Group B / C / Next / React / TS / ESLint-major / Prisma / next-auth / axios / Zod / Tiptap / TanStack / react-day-picker commands. No `prisma migrate/db push/db pull/reset` (no database operation of any kind).

## 6. Execution sequence & deviation record (Group A-radix)

1. The literal 24-selector command was launched; the harness backgrounded it; it **hung deterministically** (frozen at ~0.9s CPU, zero output including stderr, zero file writes) for 25+ minutes. Killed (`taskkill`). Hash-verified zero mutation.
2. Retry in background: identical hang signature (~0.9s CPU, empty log). Killed. Hash-verified zero mutation.
3. Retry against `--registry=https://registry.npmjs.org` (environmental workaround attempt): identical hang. Killed. Hash-verified zero mutation.
4. Retry with stdin closed + stderr captured: identical hang. Killed. Hash-verified zero mutation.
5. Diagnostic: default registry (npmmirror) answered `pnpm view` instantly throughout; a foreground **single-selector** probe (`@radix-ui/react-accordion@1.2.20`) completed normally in 47.1s. Conclusion: the hang is a pnpm 10.9.0-on-Windows defect triggered by this backgrounded multi-selector invocation shape, **not** a registry or package-resolution problem.
6. The remaining 22 authorized radix selectors were executed as five foreground bounded commands (§5), all exit 0, with hash checks between commands.

All successful updates used the default configured registry (npmmirror). No registry override persisted anywhere.

## 7. Manifest (package.json) result — acknowledged deviation

- `pnpm update <pkg>@<exact-version>` under pnpm 10.9.0 **rewrites each touched package's manifest specifier to `^<target>` even when the pre-existing range already accepted the target**. This contradicts the readiness audit's §12 prediction ("package.json remains byte-identical throughout") and tripped the Command brief §4.5 stop condition after the first command.
- **Gate resolution:** execution was halted, the exact diff was presented (changes confined precisely to the 9 updated packages' specifiers; user WIP lines preserved), and the human acknowledged continuation mid-batch. The same confined behavior was then verified after every subsequent command.
- Final manifest delta (vs pre-batch snapshot): **only the 33 updated packages' specifiers**, each `^<old-floor>` → `^<authorized-target>`. `react-label` untouched (`^2.1.4`); user WIP additions (`@radix-ui/react-accordion`, `@radix-ui/react-navigation-menu`) preserved; `packageManager`, scripts, and all other fields byte-identical.
- Semantic reading: ranges still caret-form; installed versions are within both old and new ranges. No dependency was added to or removed from the manifest.

## 8. Lockfile result & scope accounting

`pnpm-lock.yaml` changed vs pre-batch snapshot: **1062 insertions / 953 deletions**. Full key-level accounting (scoped + unscoped keys; 1067→1071 package keys; 100 removed / 105 added at name@version granularity):

- **33 authorized direct packages**: old→new entries exactly per §3 table.
- **Transitive moves — all within-range, all inside an updated package's closure**:
  - tailwindcss closure: `@tailwindcss/oxide` 4.1.11→4.3.3 (+ all platform binaries), `@tailwindcss/node` 4.1.11→4.3.3, `lightningcss` 1.30.1→1.32.0 (+ binaries), `postcss` 8.5.6→8.5.28, `nanoid` 3.3.11→3.3.19, `detect-libc` 2.0.4→2.1.2, `@tailwindcss/node`'s `jiti` 2.4.2→2.7.0 (also re-peers `@typescript-eslint/*` snapshot keys — eslint itself stays 9.30.1), `enhanced-resolve` 5.18.2→5.25.1 + `tapable` 2.2.2→2.3.3 (via `@tailwindcss/node`).
  - **Removal of the `tar@7.4.3` subtree** (`@isaacs/fs-minipass`, `minipass`, `minizlib`, `chownr`, `mkdirp`, `yallist`): `@tailwindcss/oxide@4.3.3` no longer depends on tar. Verified: parent at OLD line 5427 = `@tailwindcss/oxide@4.1.11`.
  - tsx closure: `esbuild` 0.25.5→0.28.2 (+ all `@esbuild/*` platform binaries; `openharmony-arm64` newly published — 29→30 binaries), `magic-string` 0.30.17→0.30.21, `@jridgewell/*` bumps, `@ampproject/remapping@2.3.0` replaced by `@jridgewell/remapping@2.3.5`.
  - @eslint/eslintrc closure: `acorn` 8.15.0→8.18.0, `ajv` 6.15.0 (new copy), `ignore` 7.0.5→7.0.9, `js-yaml` 4.1.0→4.3.2, `brace-expansion` 1.1.12/2.0.2→1.1.21/2.1.7, `minimatch` 9.0.5→9.0.9 (+3.1.5 copy).
  - nuqs closure: `@standard-schema/spec` 1.0.0→1.1.0 (new consumers; 1.0.0 entry retained), **`mitt@3.0.1` removed** (nuqs 2.10.1 dropped the dep).
  - radix closure: 17 internal `@radix-ui/*` packages bumped in-range (arrow, collection, context, direction, dismissable-layer, focus-guards, focus-scope, id, menu, popper, portal, presence, primitive, roving-focus, use-*, visually-hidden, number, primitive, rect); `@floating-ui/core|dom|react-dom|utils` 1.7.2/2.1.4/0.2.10→1.8.0/2.1.9/0.2.12; `react-remove-scroll` 2.7.1→2.7.2. Older internal versions are retained where non-updated consumers still require them (pnpm multi-version resolution).
- **Excluded packages: zero version drift** — verified for 30 unscoped packages (next 15.3.0, react/react-dom 19.1.0, eslint 9.30.1, typescript 5.8.3, prisma/@prisma/client 6.11.1, next-auth 5.0.0-beta.29, zod, RHF, recharts, socket.io, framer-motion, lucide-react, motion, uploadthing, …) and scoped ones (@tanstack/react-table 8.21.3, @tiptap/core 2.24.2, @types/react 19.1.8). Nothing added/removed outside the closures above.

## 9. Verification vs baseline

- **Typecheck** — `pnpm exec tsc --noEmit --incremental false` → exit 2, **exactly 21 error lines, identical locations and codes to the post-Gate-1 baseline**: 8 × `src/actions/chat.ts` (TS2339 `prisma.conversation`/`prisma.message`), 2 × `data-table-date-filter.tsx` (145,168), 1 × `project-form.tsx:53` (TS2769), 1 × `sections/hero/default.tsx:64` (`"glow"`), 8 × `ui/chart.tsx`, 1 × `lib/export.ts:20`. Classification: **unchanged baseline** (0 new, 0 fixed). Full log: `snapshots/batch-1-group-a/typecheck-after.log`.
- **Lint** — `pnpm lint` (`next lint`) → exit 1 with **exactly the 2 baseline errors**: `chat-widget.tsx:30:10` (`no-unused-vars`), `socket.ts:45:67` (`no-explicit-any`). Classification: **unchanged baseline** (0 new, 0 fixed). Full log: `snapshots/batch-1-group-a/lint-after.log`.
- **Prisma** — no `prisma generate` was manually invoked and none was required: `@prisma/client`/`prisma` were not touched, and the generated client is verified present post-batch at the store path `node_modules/.pnpm/@prisma+client@6.11.1_prism_0533ca5add9f1bf9a332f3f7e28e4e73/node_modules/.prisma/client/index.js`. No database operation of any kind.
- **Tests** — none exist (unchanged limitation; not invented).

## 10. Smoke checks (read-only)

Script: `snapshots/batch-1-group-a/smoke.mjs`. Results:

- **Resolution OK** for 32/33 direct packages (nuqs, date-fns, sonner, nextjs-toploader, tailwind-merge, @auth/prisma-adapter, @eslint/eslintrc, tailwindcss, @tailwindcss/postcss, and all 22 updated radix packages).
- `tw-animate-css`: `import.meta.resolve` returns `ERR_PACKAGE_PATH_NOT_EXPORTED` — expected for a **CSS-only package whose exports map exposes no JS entry**; Node module resolution is not its consumption path. Verified through the real path below.
- **Tailwind v4 real compile: OK** — the project's actual `src/app/globals.css` (including `@import "tailwindcss"`, `@import "tw-animate-css"` at line 4, `@plugin "tailwind-scrollbar-hide"` at line 3) compiled through `@tailwindcss/postcss@4.3.3` producing **140,953 bytes** with theme variables present. This exercises tw-animate-css 1.4.0 and the PostCSS pipeline end-to-end.
- **Deep-eval OK**: `tailwind-merge` 3.7.0, `date-fns` 4.4.0, `@auth/prisma-adapter` 2.11.3 (exports `PrismaAdapter`).
- **tsx executable OK**: `pnpm exec tsx --version` → `tsx v4.23.15` (its esbuild 0.28.2 functions despite the ignored-builds warning — the binary ships in the platform package).
- Application imports resolving at the type level is additionally proven by the unchanged typecheck (all updated libraries are imported by `src/`).
- No Playwright/browser smoke was required for this group; no application state was touched.

## 11. User-WIP preservation

- `git status --short` after the batch equals the pre-batch standing set (same 7 tracked entries + same untracked set; no new tracked paths).
- Non-package WIP files byte-identical to pre-flight (numstat unchanged): `globals.css` 29/1, `icons.tsx` 2/0, `types/index.ts` 13/0, `page.tsx` 0/5, `package-lock.json` 0/11566 (still deleted).
- `package.json` user WIP (+2 radix additions) present in the final file; `pnpm-lock.yaml` user WIP (+104 lines) carried through (final vs HEAD diff includes it).
- No `git restore/checkout/reset/stash/clean`, no commits, no branch, no push. Only repository additions: this evidence file + the snapshot/evidence artifacts under `.agents/evidence/snapshots/batch-1-group-a/` (both inside the untracked `.agents/`).

## 12. Findings

- **F1 — `@radix-ui/react-label@1.1.15` does not exist (blocked selector).** Registry verification (npmjs + npmmirror, 2026-09-20): E404, "No match found for version 1.1.15". Actual dist-tags: `latest: 2.1.15`, `next: 2.1.16-rc.1785512840124`. The readiness audit's §6 row for this package is corrupted (records "locked 1.1.7, latest 1.1.15"; ground truth: **locked 2.1.7**, latest **2.1.15** — digit transposition; the row even self-flags a "typo"). The authorized target appears derived from that corrupted row. Current state: react-label remains at 2.1.7 (in-range, healthy). **Human decision required:** either authorize a micro-gate `pnpm update @radix-ui/react-label@2.1.15` (in-range for the declared `^2.1.4`, lockfile-only, same shape as the rest of Group A) or explicitly close the item. No alternative version was adopted unilaterally.
- **F2 — `@auth/core` now exists in two copies.** `@auth/prisma-adapter@2.11.3` declares `@auth/core@0.41.3` as a **direct dependency** (previously satisfied as a peer by next-auth's copy), so the graph now contains `@auth/core@0.40.0` (required by next-auth 5.0.0-beta.29) **and** `@auth/core@0.41.3` (adapter-owned). Type-level compatibility is proven by the unchanged typecheck (`src/auth.ts` compiles clean). Runtime auth behavior is untouched by this batch and the dedicated auth smoke belongs to the Group B2 gate.
- **F3 — pnpm 10.9.0 hang (tooling defect, worked around).** Backgrounded multi-selector `pnpm update` invocations hang deterministically at ~0.9s CPU with zero output and zero writes (4 occurrences, each killed with hash-verified zero mutation; details §6). Foreground executions succeed. Recorded as an environmental/tooling finding for future batches: run pnpm mutations in foreground.
- **W1 — pnpm "Ignored build scripts: esbuild"** on every install (pnpm 10 default blocklist behavior). Not a regression (tsx verified working; Gate 1 precedent). No `pnpm approve-builds` was run (would be a separate decision).
- **W2 — pre-existing peer warnings** from react-day-picker 8.10.1 (unmet peers `date-fns ^2||^3`, `react ^16.8||^17||^18`): same warnings existed pre-batch (react-day-picker was excluded from Batch 1); only the "found" versions moved (4.1.0→4.4.0). Classification: baseline warning, unchanged.

## 13. Regressions

**None.** Zero new type errors, zero new lint errors, zero baseline fixes, zero lockfile changes outside the authorized closures, zero excluded-package version drift.

## 14. Rollback status

Not exercised — no rollback condition was met (no unresolved conflict; the only unresolvable selector was skipped rather than force-run; no out-of-scope changes). Pre-batch byte snapshots remain at `.agents/evidence/snapshots/batch-1-group-a/` and remain valid for content-level rollback (restore bytes → `pnpm install --frozen-lockfile`) until the human decides otherwise.

## 15. Explicit statements

- **Group B (axios 1.20.0, next-auth beta.32) was NOT executed.**
- **Group C (react-hook-form/resolvers, @upstash pair) was NOT executed.**
- **Batch 2 and all later batches (Next 15.5.25/16.3.5, React 19.3, Prisma 7, TypeScript major, ESLint 10, Zod 4, Tiptap 3, TanStack 9, react-day-picker, cleanup/removals) were NOT started.**
- **No commit, no push, no branch creation, no history amendment, no destructive Git command occurred.**
- Hard stop observed: this record closes Batch 1 — Group A. Continuation requires separate human authorization.
