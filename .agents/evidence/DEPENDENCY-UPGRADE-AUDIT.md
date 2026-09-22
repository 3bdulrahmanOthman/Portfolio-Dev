# Dependency Upgrade Audit — Phase 2 (READ-ONLY)

> **Date:** 2026-09-20 · **Mode:** READ-ONLY (no packages installed, no files modified except this report)
> **Governing docs:** `AGENTS.md`, `policies/APPROVALS.md`, `policies/VERIFICATION.md`,
> `versioning/VERSION-POLICY.md`, `versioning/UPGRADE-WORKFLOW.md`, `versioning/CURRENT-BASELINE.md`,
> `versioning/TARGET-POLICY.md`
> **Purpose:** propose targets and batches for bringing the repository to *latest stable, supported,
> compatible* releases. **Nothing in this file authorizes an upgrade** — every batch requires its
> human gate (`policies/APPROVALS.md`, gates #1/#2).
>
> Version facts were cross-checked against the npm registry on 2026-09-20 (this machine resolves the
> `registry.npmmirror.com` mirror; dist-tag data matched npmjs semantics). Migration/support facts
> come from official sources listed under *Evidence Sources*.

---

## 1. Executive Summary

- The stack is broadly outdated but **healthy enough to upgrade in controlled batches**: no deprecation
  walls, one security-driven prerelease bump (next-auth), two big migration projects (TanStack Table v9,
  Prisma 7), and one dead-subsystem decision (chat/socket) that changes the package set.
- **Recommended targets:** Next 16.3.5 (two-step via 15.3.9 → 15.5.25), React 19.3.0, TypeScript
  latest 5.9.x/6.0.x line (**not** 7.0.x — no compiler API until 7.1, which typescript-eslint needs),
  ESLint 10.11.0, Prisma 7.10.x (client GA line; 8.x is RC — excluded), Tailwind 4.3.3,
  next-auth 5.0.0-beta.32+ (security exception to the no-prerelease rule), Zod stays on v3 for now.
- **Security findings:** next-auth beta.29 is below the July 2026 CVE-fix level (beta.32);
  axios 1.11.0 is affected by CVE-2025-58754 (fixed 1.12.0; exploitability here is minimal — used only
  for error typing); the local Node 25.9.0 runtime is **EOL since 2026-06-01**.
- **Dead dependencies found (zero imports in `src/`):** `install` (accidental meta-package), `jotai`,
  `shiki`, `uuid`, `lodash-es` (+types), `react-colorful`, `react-markdown`/`remark-gfm`,
  `tailwind-scrollbar-hide`. Removal is a separate gated cleanup, not part of upgrade batches.
- **Baseline interaction:** the ~27 typecheck errors are mostly *not* dependency-caused; the stale
  generated Prisma client (fixed by `prisma generate` in Batch 0, not an upgrade) accounts for the
  TS2694 cluster. No upgrade can be claimed to "fix" baseline errors without per-batch evidence.

## 2. Current Dependency Inventory

Package manager: **pnpm 10.9.0** (via `packageManager` pin). Scripts: `dev` (next dev --turbopack),
`build`, `start`, `lint` (`next lint` — deprecated, removed in Next 16), `postinstall` (`prisma generate`).
Lockfile state: `pnpm-lock.yaml` authoritative; `package-lock.json` is an uncommitted empty stub;
`node_modules` contains mixed npm+pnpm artifacts.

Full inventory (declared → installed, verified from `node_modules`):

| Group | Packages (declared → installed) |
|---|---|
| Framework | next 15.3.0 → 15.3.0 · react/react-dom ^19.0.0 → 19.1.1 · @types/react ^19 → 19.1.12 · @types/react-dom ^19 → 19.1.9 · @types/node ^20 → 20.19.11 · typescript ^5 → 5.9.2 |
| ESLint | eslint ^9 → 9.34.0 · eslint-config-next 15.3.0 → 15.3.0 · @eslint/eslintrc ^3 → 3.3.1 |
| Prisma | prisma ^6.11.1 → 6.15.0 · @prisma/client ^6.11.1 → 6.15.0 · @prisma/extension-accelerate ^1.3.0 → 1.3.0 · @auth/prisma-adapter ^2.8.0 → 2.10.0 |
| Auth | next-auth ^5.0.0-beta.25 → 5.0.0-beta.29 |
| CSS | tailwindcss ^4 → 4.1.12 · @tailwindcss/postcss ^4 → 4.1.12 · tailwind-merge ^3.2.0 → 3.3.1 · tailwind-scrollbar-hide ^2.0.0 → 2.0.0 · tw-animate-css ^1.2.5 → 1.3.7 |
| Radix (25) | 1.1.x–2.2.x declared → slightly newer minors installed |
| Editor | @tiptap/* (15 pkgs) ^2.11.7 → 2.26.1 · lowlight ^3.3.0 → 3.3.0 |
| Tables/charts | @tanstack/react-table ^8.21.3 → 8.21.3 · recharts ^3.0.2 → 3.1.2 |
| Forms/data | zod ^3.24.3 → 3.25.76 · react-hook-form ^7.55.0 → 7.62.0 · @hookform/resolvers ^5.0.1 → 5.2.1 · nuqs ^2.4.3 → 2.5.2 · jotai ^2.12.3 → 2.13.1 · date-fns ^4.1.0 → 4.1.0 |
| Infra | uploadthing ^7.6.0 → 7.7.4 · @uploadthing/react ^7.3.0 → 7.3.3 · @upstash/redis ^1.34.8 → 1.35.3 · @upstash/ratelimit ^2.0.5 → 2.0.6 · axios ^1.8.4 → 1.11.0 · socket.io ^4.8.1 → 4.8.1 · bcrypt-ts ^6.0.0 → 6.0.0 |
| UI misc | lucide-react ^0.488.0 → 0.488.0 · framer-motion ^11.18.2 → 11.18.2 · motion ^12.8.0 → 12.23.12 · react-day-picker ^8.10.1 → 8.10.1 · sonner ^2.0.3 → 2.0.7 · cmdk ^1.1.1 → 1.1.1 · vaul ^1.1.1 → 1.1.2 · next-themes ^0.4.6 → 0.4.6 · nextjs-toploader ^3.8.16 → 3.8.16 · react-resizable-panels ^2.1.8 → 2.1.9 · react-textarea-autosize → 8.5.9 · react-colorful → 5.6.1 · class-variance-authority → 0.7.1 · clsx → 2.1.1 |
| Un/dead | install ^0.13.0 → 0.13.0 · shiki ^1.29.2 → 1.29.2 · uuid ^11.1.0 → 11.1.0 · lodash-es → 4.17.21 (+@types) · react-markdown ^10.1.0 → 10.1.0 · remark-gfm ^4.0.1 → 4.0.1 · tsx ^4.19.3 → 4.20.5 |

Import-usage scan (grep over `src/`, 2026-09-20): **no imports found** for `jotai`, `shiki`, `uuid`,
`lodash-es`, `tailwind-scrollbar-hide`, `react-colorful`, `react-markdown` (+`remark-gfm` assumed paired).
`axios` → only `src/lib/handle-error.ts`; `socket.io` → only dead `src/lib/socket.ts`;
`framer-motion` → only `src/components/chat/chat-widget.tsx` (dead chat UI); `motion` → 4 active files
(`data-table-action-bar`, `animate-ui/*`).

## 3. Latest Stable Research (registry, 2026-09-20)

| Package | Installed | Latest stable (dist-tag) | Prerelease lines | Notable |
|---|---|---|---|---|
| next | 15.3.0 | **16.3.5** | canary 16.4.0-canary.37; 15.5.25 backport tag; next-15-3 → 15.3.9 | engines node >=20.9.0 |
| react / react-dom | 19.1.1 | **19.3.0** | canary 19.3.0-canary | |
| typescript | 5.9.2 | **7.0.2** (GA 2026-07-08, native Go compiler, **no API until 7.1**) | 6.0.0-beta; 7.1 dev | 6.0 shipped as JS bridge |
| eslint | 9.34.0 | **10.11.0** | — | engines ^20.19.0 \|\| ^22.13.0 \|\| >=24 |
| eslint-config-next | 15.3.0 | **16.3.5** | — | moves with next |
| prisma (CLI) | 6.15.0 | dist-tag anomaly: `latest` → 8.0.0-**rc**.15 | Prisma 8 in RC | 7.x is GA line (client 7.10.0) |
| @prisma/client | 6.15.0 | **7.10.0** | — | engines ^20.19 \|\| ^22.12 \|\| >=24 |
| @prisma/extension-accelerate | 1.3.0 | **3.0.1** | — | engines node >=22; pairs with Prisma 7 |
| @auth/prisma-adapter | 2.10.0 | **2.11.3** | — | minor |
| next-auth | 5.0.0-beta.29 | stable tag still **v4 (4.24.15)**; beta channel **5.0.0-beta.32** (2026-07-20) | v5 remains beta | **beta.32 includes July-2026 CVE fixes** (getToken uncaught exception; @auth/core >= 0.41.3) |
| tailwindcss / @tailwindcss/postcss | 4.1.12 | **4.3.3** | v3-lts 3.4.19 tag | minor |
| zod | 3.25.76 | **4.6.5** (v4 GA) | 3.25.x line ended at ~3.25.76 | v3/v4 coexist via subpaths |
| @tanstack/react-table | 8.21.3 | **9.2.4** (v9 GA) | — | v9 restructures API |
| recharts | 3.1.2 | **3.10.1** | canary 3.11.0 | minor within v3 |
| @tiptap/* | 2.26.1 | **3.31.3** (v3 GA) | v2-latest dist-tag = **2.27.3** | major line v3 |
| react-day-picker | 8.10.1 | **10.0.1** | — | v9 rewrite + v10 cleanup |
| lucide-react | 0.488.0 | **1.47.0** | — | v1 GA (0.x caret pins minor) |
| framer-motion | 11.18.2 | **13.4.0** | — | renamed → `motion` |
| motion | 12.23.12 | **13.4.0** | — | successor package |
| jotai | 2.13.1 | **3.0.0** | — | engines node >=22.12 |
| axios | 1.11.0 | **1.20.0** | — | CVE-2025-58754 fixed in 1.12.0 |
| bcrypt-ts | 6.0.0 | **9.0.2** | — | engines node >=22 |
| shiki | 1.29.2 | **4.4.3** | — | majors v2→v4 |
| socket.io | 4.8.1 | **4.8.3** | — | minor |
| uploadthing / @uploadthing/react | 7.7.4 / 7.3.3 | **already latest** | — | — |
| @upstash/redis / ratelimit | 1.35.3 / 2.0.6 | **1.38.4 / 2.1.0** | canary | minor |
| nuqs / react-hook-form / date-fns / sonner / nextjs-toploader / tailwind-merge / tw-animate-css / tsx / @eslint/eslintrc / @types/react(-dom) / @types/lodash-es | — | 2.10.1 / 7.88.0 / 4.4.0 / 2.0.8 / 3.9.17 / 3.7.0 / 1.4.0 / 4.23.15 / 3.3.7 / 19.3.0 / 4.17.12 | nuqs 2.10.2-beta | all minors |
| uuid / lodash-es / react-resizable-panels / react-colorful / tailwind-scrollbar-hide | 11.1.0 / 4.17.21 / 2.1.9 / 5.6.1 / 2.0.0 | 14.0.2 / 4.18.1 / **4.12.4** / 5.8.1 / **4.0.0** | — | majors skipped: uuid ×3, resizable ×2, scrollbar-hide ×2 |
| install | 0.13.0 | 0.13.0 | — | ancient junk meta-package (engines >=0.10) — accidental install |

## 4. Support Status (as of 2026-09-20)

| Technology | Current | Support status | Basis |
|---|---|---|---|
| Node.js runtime (machine) | 25.9.0 | **EOL 2026-06-01** (odd/non-LTS) | nodejs.org release schedule |
| Node 20 | — (types only) | **EOL 2026-04-30** | nodejs.org |
| Node 24 | target | **Active LTS** (EOL 2028-04-30) | nodejs.org |
| Node 26 | — | Current; **LTS 2026-10** | nodejs.org |
| Next.js 15.3.0 | in-use | 15.x maintenance (15.3.9 in-line; 15.5.25 backport line) | registry dist-tags |
| Next.js 16 | — | **Current stable major** (16.3.5) | registry |
| React 19.1.1 | in-use | Active (19.3.0 latest) | registry |
| TypeScript 5.9.2 | in-use | 5.x superseded by 6.0 bridge + 7.0 GA (no API) | TS blog |
| Prisma 6.15.0 | in-use | 6.x superseded by 7 GA; 8 in RC | registry + prisma.io |
| next-auth 5.0.0-beta.29 | in-use | beta channel; v4 still `latest`; **security fixes only in >= beta.32** | npm + Auth.js advisories |
| Tailwind 4.1.12 | in-use | Active 4.x | registry |
| ESLint 9.34.0 | in-use | 10 GA (10.11.0) | registry |
| Zod 3.25.76 | in-use | v3 line frozen (~3.25.76); v4 GA | registry + zod.dev |
| `pnpm audit` | unavailable on this machine | configured registry (npmmirror) lacks the audit endpoint | local run error |

## 5. Framework Compatibility (GROUP A — Next.js)

**Target: next 16.3.5 via staged path 15.3.0 → 15.3.9 → 15.5.25 → 16.3.5**, moving
react/react-dom 19.3.0, @types/react(-dom) 19.3.0, eslint-config-next 16.3.5, ESLint 10.11.0
(peer-compat to verify at execution), @types/node 24.x together as one compatibility group.

Breaking changes 15.3 → 16 (official upgrade guide):
1. **`next lint` removed** — the `lint` script and the `eslint` option in `next.config.ts` die.
   Migration: ESLint CLI (`eslint` script), flat config; codemod available. This repo already has
   `eslint.config.mjs` (FlatCompat) — needs conversion to native flat + plugin wiring.
2. **`middleware.ts` → `proxy.ts`** convention rename (codemod). ⚠ This file wraps **Auth.js** —
   the rename is a **gated auth change** (policies/APPROVALS.md #11) and needs auth regression
   evidence (login redirect, /admin protection).
3. Parallel routes require explicit `default.js` (repo has none — verify), AMP/runtime-config/sync-dynamic
   APIs removed (repo doesn't use them — verify), **Turbopack becomes the default bundler** (dev already
   uses it; build behavior changes).
4. Node >= 20.9.0 required (16.3.x). React 19.x required.

Baseline interactions: `typescript.ignoreBuildErrors`/`eslint.ignoreDuringBuilds` in next.config.ts
should be re-evaluated **during** this batch (config file is in scope); removal is recommended but is
a policy decision — with 27 baseline errors, removing them means the build gate turns red until
remediation happens. Recommend: remove `eslint.ignoreDuringBuilds` after lint baseline is fixed (2 errors),
remove `typescript.ignoreBuildErrors` only after the remediation phase.

## 6. Prisma Analysis (GROUP B)

- **CURRENT:** 6.15.0 (CLI + client), edge client + Accelerate extension 1.3.0, no migrations dir,
  `package.json#prisma` seed config (deprecated).
- **LATEST STABLE:** Prisma 7 GA — @prisma/client 7.10.0 (CLI 7.x; note the CLI `latest` dist-tag
  currently points at 8.0.0-rc.15 — an upstream dist-tag anomaly during the 8 RC; do not interpret it
  as "8 is stable").
- **LATEST PRERELEASE:** 8.0.0-rc.15 — **not** a default target (VERSION-POLICY §2).
- **RECOMMENDED TARGET:** **7.10.x as a dedicated migration project** (not bundled with other batches).
- **REASON:** 7 is the current GA major with official upgrade guide; 6.x is a dead line for new work;
  8 is RC. Prisma 7 requires Node ^20.19 || ^22.12 || >=24 (satisfied by the Node 24 decision).
- **Migration scope (from official v7 guide):**
  1. `prisma.config.ts` required (replaces `package.json#prisma`; seed moves there; `.env` loading changes — dotenv handling).
  2. Generator: `prisma-client-js` → `prisma-client` (ESM, explicit output path) → **changes imports**
     (`@prisma/client/edge` import in `src/lib/db/prisma.ts` must be reworked).
  3. Rust-free client; **driver adapters mandatory** — Accelerate path: `@prisma/extension-accelerate` v3
     (3.0.1) with `accelerateUrl` + adapter pattern; early v3 bug (dropped relations) fixed in 3.0.1.
  4. `postinstall: prisma generate` interaction with pnpm; generated-output location changes.
  5. Database verification required (Accelerate connectivity; no migration history — DATABASE policy applies).
  6. Interim step available: 6.15.0 → latest 6.x minor (low risk) before the 7 project.
- **@auth/prisma-adapter** 2.10.0 → 2.11.3 (minor; verify against next-auth beta.32 + Prisma 7 client).

## 7. Auth Analysis (GROUP C)

- **v5 is STILL BETA** (beta.32, 2026-07-20); `latest` dist-tag remains v4 (4.24.15). No GA.
- **SECURITY:** July 2026 advisory batch fixed four CVEs across v4/v5/@auth/core — including an
  uncaught exception in `getToken()` fixed in **next-auth >= 5.0.0-beta.32 / @auth/core >= 0.41.3**.
  This repo (beta.29) is **below the fix line** and uses JWT tokens throughout.
- **Recommendation:** bump to latest 5.0.0-beta.x (≥ beta.32) as a **security-driven prerelease
  exception** — requires the explicit human decision documented in VERSION-POLICY §2 (prerelease
  adoption). A v4 rewrite is rejected (large downgrade effort, no benefit). Review the beta.29→beta.32
  changelog for behavioral changes to jwt/session callbacks before execution.
- **Next 16 interaction:** middleware→proxy.ts rename directly touches the auth middleware wrapper —
  sequence auth verification inside the framework batch.

## 8. UI/CSS Analysis (GROUP D)

- **Tailwind 4.1.12 → 4.3.3** (+ `@tailwindcss/postcss`), `tailwind-merge` 3.7.0, `tw-animate-css` 1.4.0 —
  minor, low risk. `tailwind-scrollbar-hide` 4.0.0 exists but the package has **no imports** → removal candidate.
- **Radix primitives (25 pkgs):** all minor bumps (e.g. dialog 1.1.15→1.1.23, slot 1.2.3→1.3.3). shadcn
  continues to consume individual `@radix-ui/react-*` packages; the unified `radix-ui` package is not required.
- **lucide-react 0.488.0 → 1.47.0** — first stable major; icon-usage audit needed (mechanical risk).
- **framer-motion 11.18.2 vs motion 12.23.12:** confirmed duplication — `framer-motion` is the legacy
  name of `motion`; both are now published in lockstep (13.4.0). Here `framer-motion` is imported **only
  by the dead chat widget**; `motion` serves all active code. Consolidation = remove `framer-motion`
  (dependent on the chat-subsystem ADR) + minor `motion` bump to 13.4.0 with import verification.
- **react-day-picker 8.10.1 → 10.0.1** — v9 was the big rewrite, v10 a cleanup that removes deprecated
  v9 APIs; **shadcn's Calendar component must be regenerated/updated** (locale type import; classNames
  mapping). Affected repo files: `src/components/ui/calendar.tsx`, `src/components/data-table-date-filter.tsx`
  (which already has 2 baseline type errors — do not claim the upgrade fixes them without evidence).
- Already-latest (no action): cmdk, vaul, next-themes, class-variance-authority, clsx, lowlight.

## 9. Data/Form/Chart Analysis (GROUP E)

- **Zod:** v4 is GA (4.6.5); v3 line is frozen at ~3.25.76 (this repo's exact version). Repo code is
  uniformly v3 API. **Recommendation: stay on v3 now; schedule Zod 4 as a separate migration project**
  (breaking changes: error shapes `issues` vs `errors`, method changes). `zod/v4` subpaths allow
  incremental migration later. Related known typecheck failure: `zodResolver(ProjectSchema)` (TS2769) —
  the schema is annotated `: z.ZodType` at `src/schemas/index.ts:100`, which widens the type; this looks
  **code-caused**; resolvers 5.2.1 → 5.9.1 may alter the diagnostics but **no fix is claimed** — verify per batch.
- **@hookform/resolvers 5.2.1 → 5.9.1** and **react-hook-form 7.62.0 → 7.88.0** — minors; resolvers v5's
  `zodResolver` entry point officially supports zod v3 and v4.
- **@tanstack/react-table 8.21.3 → 9.2.4 — migration project.** v9 GA restructures table factory/
  feature/row-model APIs. This repo has ~11 `data-table*` components + admin tables — the largest
  code-affected surface of any batch.
- **recharts 3.1.2 → 3.10.1** — minors within v3; the shadcn `ui/chart.tsx` type errors (payload/label
  props) stem from recharts-3 typings vs the copied component; upgrading recharts **and/or** updating the
  chart component may fix it — not claimed without per-batch evidence.
- **nuqs 2.5.2 → 2.10.1** — minor. **date-fns 4.1.0 → 4.4.0** — minor (v5 is alpha; ignored).
- **jotai 2.13.1 → 3.0.0** — v3 exists but the package has **no imports** → removal candidate instead of upgrade.

## 10. Infrastructure Analysis (GROUP F)

- **uploadthing 7.7.4 / @uploadthing/react 7.3.3: already latest 7.x** — nothing to do.
- **@upstash/redis 1.35.3 → 1.38.4, @upstash/ratelimit 2.0.6 → 2.1.0** — minors, independent.
- **axios 1.11.0 → 1.20.0** — minor line; **security floor ≥ 1.12.0** (CVE-2025-58754, GHSA-4hjh-wcwx-xvwj,
  DoS via `data:` URL — disclosed 2025-09). Exploitability here is negligible (single import, error typing
  only, no request execution found), but the floor is cheap. Longer term: candidate for removal if
  `handle-error.ts` drops the AxiosError branch (cleanup decision).
- **socket.io 4.8.1 → 4.8.3** — minor exists, but the only consumer is unreachable dead code; **hold
  pending the chat-subsystem ADR** (do not upgrade dead code).
- **bcrypt-ts 6.0.0 → 9.0.2** — major (skipped 7/8), engines node >=22. Used in **auth** (`auth.config.ts`,
  `actions/settings.ts`) and seed. `bcrypt` hashes are format-stable, but the batch must include a
  login + password-change verification (gated: authentication-adjacent).
- **shiki 1.29.2 → 4.4.3** — majors v2/v3/v4 exist, but **no imports found** → removal candidate.
- **uuid 11 → 14, lodash-es → 4.18.1, react-colorful → 5.8.1, react-markdown/remark-gfm → already
  latest** — all **no imports** → removal candidates (verify dynamic usage at cleanup time).
- **tsx 4.20.5 → 4.23.15** — devDep minor.

## 11. Node.js Analysis

- Requirements surface: Next 16 → >=20.9; Prisma 7 → ^20.19 || ^22.12 || >=24; ESLint 10 →
  ^20.19 || ^22.13 || >=24; bcrypt-ts 9 / jotai 3 / @prisma/extension-accelerate 3 → >=22.
- **Recommendation: target Node 24 LTS (Active LTS, EOL 2028-04-30)**; it satisfies every requirement
  above. Node 26 becomes LTS in 2026-10 — re-evaluate then.
- The **local machine runs Node 25.9.0, EOL since 2026-06-01** — the human should switch the runtime to
  24 LTS (machine action; out of agent scope).
- **Add an `engines` field** (e.g. `"node": ">=20.9.0"` with a documented preference for 24 LTS) in a
  later batch — package.json change, gated as part of that batch.

## 12. Package Manager / Lockfile Analysis

1. **pnpm should be canonical** — evidence: `packageManager` pin (10.9.0, sha512), authoritative
   `pnpm-lock.yaml` (lockfileVersion 9.0), npm side is a gutted stub.
2. **`package-lock.json` should eventually be deleted** — it is an empty stub (lockfileVersion 3,
   no packages) that misleads tooling (e.g. `npm audit` reads it as "no dependencies").
3. **Lockfile transition = separate migration task (Batch 0)** — clean reinstall from `pnpm-lock.yaml`,
   delete the stub, `prisma generate`, re-record the verification baseline. It must be reviewable on its own.
4. **Do it BEFORE dependency upgrades** — the mixed npm/pnpm `node_modules` artifacts and stale generated
   client make any upgrade result ambiguous; a trustworthy install state is a prerequisite for the
   NO-NEW-ERRORS comparison.
5. **Do not combine with upgrades** — combining would make lockfile diffs unreviewable and violate the
   batch discipline (VERSION-POLICY §11).

## 13. Security Analysis

| Item | Finding | Severity / action |
|---|---|---|
| next-auth beta.29 | Below July-2026 CVE-fix line (getToken uncaught exception; fixed ≥ beta.32, @auth/core ≥ 0.41.3) | **Security-driven bump** to latest beta (prerelease exception decision required) |
| axios 1.11.0 | CVE-2025-58754 (GHSA-4hjh-wcwx-xvwj, DoS via `data:` URL) affects < 1.12.0 | Minimal exploitability in repo (error-typing only); bump to ≥ 1.12.0, target 1.20.0 |
| next 15.3.0 | 15.3.9 in-line patch release exists; 15.5.25 security-backport line maintained by upstream | Take patches in the framework batch; treat **all Next upgrades as security-sensitive** (history: middleware auth-bypass CVE-2025-29927 fixed 15.2.3 — already covered at 15.3.0) |
| Auth.js beta maintenance | v5 in beta >2 years; security fixes do flow to the beta channel | Documented risk; mitigation = stay current on the beta line |
| Prisma 6.15.0 | No known relevant advisories found; 6.x superseded by 7 GA | Support-driven, not security-driven, upgrade |
| `pnpm audit` | Unusable on this machine (npmmirror has no audit endpoint) | Re-run against `registry.npmjs.org` during Batch 0 verification |

No `npm audit fix` was run (prohibited); advisory research was read-only.

## 14. Migration Analysis (per major candidate)

| Upgrade | Breaking changes (headline) | Affected repo files | Config changes | Codemod | Tests/browser/DB verification | Rollback |
|---|---|---|---|---|---|---|
| Next 15.3→16.3.5 | `next lint` removed; `middleware.ts`→`proxy.ts`; parallel-route `default.js`; Turbopack default build; config option removals | package.json scripts; `src/middleware.ts`→`proxy.ts`; `next.config.ts` | eslint option removed | `npx @next/codemod upgrade latest` | **Auth flows** (login, admin guard, upload), admin pages, public pages (browser evidence); typecheck/lint; DB untouched | git revert of batch commit-range; lockfile restore |
| Prisma 6→7 | prisma.config.ts required; generator swap (ESM, output); driver adapters mandatory; Accelerate v3 API | `prisma/schema.prisma` (generator block), `src/lib/db/prisma.ts`, `prisma/seed.ts`, package.json scripts, new `prisma.config.ts` | `package.json#prisma` removed | none official | `prisma validate`; app DB read/write smoke via admin pages; **DB impact assessment per DATABASE policy** | pin back to 6.x; restore client import |
| TanStack Table 8→9 | factory/feature/row-model API restructure | ~11 `data-table*` components, admin tables, `hooks/use-data-table.ts`, `lib/data-table.ts`, `types/data-table.ts`, `lib/parsers.ts` | — | none official | table render + sorting/filtering/pagination in admin (browser evidence) | revert |
| Tiptap 2→3 | extensions consolidated (`@tiptap/extensions`), StarterKit bundles link/underline, `History`→`UndoRedo`, attribute API changes | 15 `@tiptap/*` deps; `src/components/tiptap/**` (~25 files) | — | none official | editor: typing, toolbar, image upload, fullscreen (browser) | revert |
| react-day-picker 8→10 | v9 rewrite + v10 removals; locale/classNames API | `ui/calendar.tsx`, `data-table-date-filter.tsx` | — | none | date filter + calendar (browser) | revert |
| Zod 3→4 (deferred) | error shapes, method changes | `src/schemas/index.ts`, `lib/validations/chat.ts`, all actions | — | partial | forms + actions end-to-end | revert |
| lucide-react 0.x→1 | icon API/exports audit | all icon imports | — | — | visual spot-check | revert |
| bcrypt-ts 6→9 | API/engines (node >=22) | `auth.config.ts`, `actions/settings.ts`, `prisma/seed.ts` | — | — | **login + password change (auth gate)**; hash compat check | revert |
| motion 12→13 | minor API surface | 4 animate-ui/action-bar files | — | — | visual | revert |
| shiki 1→4 / uuid 14 / lodash-es 4.18 / scrollbar-hide 4 | majors exist but **unused** | — | — | — | — | removal candidates instead |

## 15. Proposed Dependency Groups (compatibility clusters)

- **A Framework:** next, eslint-config-next, react, react-dom, @types/react, @types/react-dom,
  @types/node, typescript, eslint, @eslint/eslintrc — one coordinated batch (with staged minors first).
- **B Prisma:** prisma, @prisma/client, @prisma/extension-accelerate, @auth/prisma-adapter — one project.
- **C Auth:** next-auth (+ @auth/core transitively) — security-driven, coordinated with A's proxy.ts step.
- **D CSS:** tailwindcss, @tailwindcss/postcss, tailwind-merge, tw-animate-css.
- **E Tables:** @tanstack/react-table (+ its repo glue code).
- **F Charts:** recharts (+ `ui/chart.tsx` component update).
- **G Editor:** all 15 @tiptap/* + lowlight pairing.
- **H Calendar:** react-day-picker (+ `ui/calendar.tsx`, `data-table-date-filter.tsx`).
- **I Infra:** axios, @upstash/*, bcrypt-ts (auth-gated), uploadthing (already latest), socket.io (hold).
- **J Animation:** motion (+ framer-motion removal decision).
- **K Icons:** lucide-react.
- **L Standalone minors:** everything else in §3 with `Latest` > installed and no major skip.

## 16. Proposed Upgrade Batches (execution order)

| Batch | Contents (current → target) | Depends on | Risk | Gate |
|---|---|---|---|---|
| **0 — Foundation** | pnpm-only lockfile normalization: clean install from `pnpm-lock.yaml`; delete stub `package-lock.json`; `prisma generate`; re-run + re-record baseline; `pnpm audit` vs npmjs registry | — | MED (install-state) | Lockfile gate (#4) |
| **1 — Standalone minors** | ~30 pkgs from §3 "minor" rows (Radix set, nuqs, RHF, resolvers, date-fns, sonner, toploader, tailwind-merge, tw-animate-css, upstash ×2, @auth/prisma-adapter, tsx, @eslint/eslintrc, @types/react-dom) | 0 | LOW | Upgrade gate (#1) |
| **2 — Security** | axios → 1.20.0; next-auth → 5.0.0-beta.32+ (changelog review) | 0 | MED | Upgrade gate + **prerelease exception decision** |
| **3 — Prisma 6.x interim** | prisma + @prisma/client → latest 6.x minor | 0 | LOW | Upgrade gate |
| **4 — CSS group** | tailwindcss/@tailwindcss/postcss → 4.3.3 (+D group stragglers) | 0 | LOW | Upgrade gate |
| **5 — Editor interim** | @tiptap/* → 2.27.3 (v2-latest) | 0 | LOW | Upgrade gate |
| **6 — Framework (staged)** | 6a: next 15.3.9 + eslint-config-next 15.3.9; 6b: next 15.5.25 line; 6c: next 16.3.5 + react/react-dom 19.3.0 + @types/* + eslint-config-next 16.3.5 + eslint 10.11.0 + @types/node 24.x + TS 5.9.x/6.0.x line; codemods; `lint` script → ESLint CLI; `middleware.ts`→`proxy.ts` | 0–5 verified | **HIGH** | Upgrade gate + **auth/middleware gate** (#9/#11) at 6c |
| **7 — Prisma 7 project** | prisma + client → 7.10.x; extension-accelerate → 3.0.1; prisma.config.ts; generator + client import rework; seed relocation | 6 | HIGH (project) | Upgrade gate + **DB policy gates** (#5/#6) |
| **8 — Table project** | @tanstack/react-table → 9.2.4 + glue-code migration | 6 | HIGH (project) | Upgrade gate |
| **9 — Isolated majors** | recharts 3.10.1 (+ chart component update); react-day-picker 10.0.1 (+ calendar update); motion 13.4.0; lucide-react 1.47.0; react-resizable-panels → 4.x (confirm usage first) | 6 | MED each — one task each | Upgrade gate each |
| **10 — Auth-adjacent major** | bcrypt-ts → 9.0.2 | 6 (Node 24 runtime confirmed) | MED | Upgrade gate + **auth gate** (#9) |
| **11 — Decision-driven cleanup** | removals: `install`, jotai, shiki, uuid, lodash-es(+types), react-colorful, react-markdown/remark-gfm, tailwind-scrollbar-hide; framer-motion + socket.io per chat ADR; Tiptap 3 project; Zod 4 project | 0–10, + ADRs | MED | **Dependency-removal gates** (#3/#14) |
| **12 — Deferred** | TS 7.1+ (when API + typescript-eslint support land); Node 26 LTS (2026-10); Prisma 8 GA re-evaluation | — | — | future audit |

## 17. Target Version Matrix

| Package | Current | Latest Stable | Recommended Target | Major Change | Compatibility | Migration | Risk |
|---|---|---|---|---|---|---|---|
| next | 15.3.0 | 16.3.5 | **15.3.9 → 15.5.25 → 16.3.5 (staged)** | Yes | Node ≥20.9; React 19.x | lint/ESLint CLI; proxy.ts; codemods | High |
| react / react-dom | 19.1.1 | 19.3.0 | **19.3.0** | No | with next@16 | none expected | Low |
| typescript | 5.9.2 | 7.0.2 | **latest 5.9.x/6.0.x (not 7.0)** | — | TS 7.0 lacks API → typescript-eslint breaks | pin exact at execution | Medium |
| eslint | 9.34.0 | 10.11.0 | **10.11.0** (verify eslint-config-next@16 peer) | Yes | Node ^20.19\|\|^22.13\|\|>=24 | flat config conversion | Medium |
| eslint-config-next | 15.3.0 | 16.3.5 | **16.3.5** | Yes | with next | with next | Medium |
| @types/node | 20.19.11 | 26.6.2 | **24.x** | Yes | match Node 24 LTS | — | Low |
| prisma / @prisma/client | 6.15.0 | 7.10.0 (CLI `latest` tag anomaly → 8.0.0-rc.15) | **7.10.x** (project) | Yes | Node ^20.19\|\|^22.12\|\|>=24 | config/generator/adapters | High |
| @prisma/extension-accelerate | 1.3.0 | 3.0.1 | **3.0.1** | Yes | with Prisma 7 | Accelerate API change | Medium |
| @auth/prisma-adapter | 2.10.0 | 2.11.3 | **2.11.3** | No | — | — | Low |
| next-auth | 5.0.0-beta.29 | beta.32 (stable tag = v4) | **5.0.0-beta.32+** (security exception) | Prerelease | CVE fix floor | changelog review | Medium |
| tailwindcss / @tailwindcss/postcss | 4.1.12 | 4.3.3 | **4.3.3** | No | — | — | Low |
| zod | 3.25.76 | 4.6.5 | **stay v3 (3.25.76)**; 4 = deferred project | (Yes) | v3 frozen but functional | deferred | — |
| @hookform/resolvers | 5.2.1 | 5.9.1 | **5.9.1** | No | v3+v4 support | verify TS2769 | Low |
| react-hook-form | 7.62.0 | 7.88.0 | **7.88.0** | No | — | — | Low |
| @tanstack/react-table | 8.21.3 | 9.2.4 | **9.2.4** (project) | Yes | — | API restructure | High |
| recharts | 3.1.2 | 3.10.1 | **3.10.1** (+chart update) | No | — | component refresh | Medium |
| @tiptap/* | 2.26.1 | 3.31.3 (v2: 2.27.3) | **2.27.3 now; 3.x project deferred** | Yes (v3) | — | interim now | Low→High |
| react-day-picker | 8.10.1 | 10.0.1 | **10.0.1** | Yes ×2 | React 19 ok | calendar regen | Medium-High |
| lucide-react | 0.488.0 | 1.47.0 | **1.47.0** | Yes | — | icon audit | Low-Medium |
| motion | 12.23.12 | 13.4.0 | **13.4.0** | Yes | — | import check | Medium |
| framer-motion | 11.18.2 | 13.4.0 | **remove** (dead-code dependent) | — | — | chat ADR | — |
| axios | 1.11.0 | 1.20.0 | **1.20.0** | No | CVE floor 1.12.0 | — | Low |
| bcrypt-ts | 6.0.0 | 9.0.2 | **9.0.2** | Yes ×3 | node ≥22 | hash-compat verify | Medium |
| @upstash/redis / ratelimit | 1.35.3 / 2.0.6 | 1.38.4 / 2.1.0 | **bump** | No | — | — | Low |
| uploadthing / @uploadthing/react | 7.7.4 / 7.3.3 | same | **already latest** | — | — | — | — |
| socket.io | 4.8.1 | 4.8.3 | **hold** (dead code) | — | — | chat ADR | — |
| nuqs / date-fns / sonner / nextjs-toploader / tsx / @eslint/eslintrc / @types/react(-dom) | — | minors | **bump** | No | — | — | Low |
| Radix (25 pkgs) | 1.1–2.2.x | minors | **bump all** | No | — | — | Low |
| cmdk / vaul / next-themes / cva / clsx / lowlight / react-textarea-autosize | — | same | **already latest** | — | — | — | — |
| install / jotai / shiki / uuid / lodash-es / react-colorful / react-markdown / remark-gfm / tailwind-scrollbar-hide | — | — | **removal candidates** | — | zero imports | cleanup batch | — |
| react-resizable-panels | 2.1.9 | 4.12.4 | **confirm usage → bump or remove** | Yes ×2 | — | resizable audit | Low-Med |

Differences from "latest stable" and why: TypeScript (7.0.x excluded — no compiler API until 7.1,
typescript-eslint dependency); next-auth (stable tag is v4 — a downgrade, rejected; target is the beta
channel's security floor); Prisma (8 is RC — excluded); Zod (v4 GA but repo-standard API is v3 — deferred
project); Tiptap (v3 GA but isolated project — interim 2.27.3 first); framer-motion (latest exists but the
package should be removed, not upgraded — dead code); socket.io (held — dead code); `install`/jotai/shiki/
uuid/lodash-es/react-colorful/react-markdown/remark-gfm/tailwind-scrollbar-hide (removal candidates, not upgrades).

## 18. Support Matrix

| Technology | Current | Support status (2026-09) | Target | Reason |
|---|---|---|---|---|
| Node.js (runtime) | 25.9.0 (machine) | **EOL 2026-06-01** | 24 LTS (EOL 2028-04) | only supported path satisfying all constraints; add `engines` |
| Next.js | 15.3.0 | 15.x maintenance (15.3.9 / 15.5.25 backports) | 16.3.5 | current stable major, security backports flow to 15.5 interim |
| React | 19.1.1 | Active | 19.3.0 | aligned with Next 16 |
| TypeScript | 5.9.2 | 5.x superseded; 7.0 GA without API | 5.9.x/6.0.x | tooling (typescript-eslint) needs the API |
| Prisma | 6.15.0 | 6.x superseded by 7 GA | 7.10.x | current GA major; 8 is RC |
| Auth.js | 5.0.0-beta.29 | beta channel; v4 = stable tag | beta.32+ | security fixes only ≥ beta.32 |
| Tailwind | 4.1.12 | Active 4.x | 4.3.3 | minor line |
| ESLint | 9.34.0 | 10 GA | 10.11.0 | current major; flat config |
| Zod | 3.25.76 | v3 frozen; v4 GA | v3 now | repo-wide v3 API; migration project later |
| next-auth (stable alternative) | — | v4.24.15 | rejected | rewrite vs beta bump |

## 19. Risks

1. **Framework batch (6c) is the risk concentration point**: lint-infra swap + middleware rename +
   Turbopack build + React/TS/ESLint moves land together. Mitigation: staged minors first, codemods,
   auth browser evidence, one gate per sub-step.
2. **Prisma 7 changes the client's import architecture** while the generated client is already stale and
   no migration history exists — DB verification depends on Accelerate connectivity (unproven for CLI ops).
3. **TanStack v9 migration touches ~15 files** with no test suite — verification rests on typecheck +
   manual/browser evidence (NO-NEW-ERRORS + explicit "no tests" limitation).
4. **next-auth stays prerelease** — accepted risk, now with a security floor; must be re-audited each cycle.
5. **The machine's npm/audit registry is npmmirror** — version data matched, but audit + provenance checks
   must run against registry.npmjs.org (Batch 0).
6. **Dead-code removals get riskier the longer they wait** — `install` especially can confuse tooling.
7. **Baseline masking**: build ignores TS/ESLint errors — until that config changes, no batch may cite a
   green build as evidence.

## 20. Human Decisions Required

1. **Prisma target:** 7.10.x GA as a dedicated project (recommended) vs waiting for 8 GA. (8.0.0-rc.15 is
   not a default target per policy.)
2. **Node target:** 24 LTS (recommended) + add `engines` + local runtime switch off EOL Node 25.
3. **Next.js target:** staged 16.3.5 (recommended) vs staying on the 15.5.25 backport line short-term.
4. **Auth.js:** authorize the prerelease-exception bump to beta.32+ (security-driven) — yes/no.
5. **pnpm-only lockfile policy:** approve Batch 0 (delete stub `package-lock.json`, normalize install).
6. **Dead dependencies:** remove during this campaign (recommended: separate Batch 11, after the chat ADR)
   or keep?
7. **Cleanup vs upgrades separation:** confirm removals stay out of version batches (recommended: separated).
8. **Zod 4 / Tiptap 3 / TanStack 9:** confirm these run as dedicated migration projects after the framework
   batch (recommended) rather than being bundled.

## 21. Recommended Execution Order

**PHASE A** = Batch 0 (foundation: lockfile normalization + `prisma generate` + fresh baseline).
**PHASE B** = Batches 1–3 (standalone minors, security bumps, Prisma 6.x interim).
**PHASE C** = Batches 4–5 (CSS group, Tiptap v2-latest interim).
**PHASE D** = Batch 6 staged framework upgrade (15.3.9 → 15.5.25 → 16.3.5 with the full framework group).
**PHASE E** = Batch 7 Prisma 7 migration project.
**PHASE F** = Batches 8–10 (TanStack 9 project; isolated majors recharts/day-picker/motion/lucide/resizable; bcrypt-ts).
**PHASE G** = Batch 11 decision-driven cleanup + ADR-dependent removals (chat/socket, framer-motion) + deferred projects (Zod 4, Tiptap 3).
**PHASE H** = Batch 12 deferred items (TS 7.1+, Node 26 LTS, Prisma 8 GA).

Each batch: task contract → gate → execute → verify (NO-NEW-ERRORS vs the Batch-0 baseline) → independent
review → evidence → complete. Rollback point per batch = pre-batch lockfile/manifest state in Git.

## 22. Evidence Sources

- npm registry metadata + dist-tags for all direct dependencies (queried 2026-09-20 via configured
  registry mirror; npmjs-equivalent data).
- Next.js 16 upgrade guide (nextjs.org/docs — "Upgrading: Version 16": next lint removal → ESLint CLI,
  middleware → proxy.ts, parallel-route defaults, stabilized APIs): https://nextjs.org
- Prisma: official v7 upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
  (+ Accelerate extension v3 compatibility notes).
- TypeScript 7.0 announcement (GA 2026-07-08; native compiler; no API until 7.1): https://devblogs.microsoft.com/typescript/announcing-typescript-7-0
- next-auth dist-tags + July 2026 security fixes (beta.32; getToken fix; @auth/core ≥ 0.41.3): https://www.npmjs.com/package/next-auth
- Node.js release schedule (24 Active LTS; 25 EOL 2026-06-01; 26 LTS 2026-10; 20 EOL 2026-04-30): https://nodejs.org
- Zod release notes/migration (v4 GA, subpath coexistence): https://zod.dev ;
  @hookform/resolvers (v5 handles zod v3 + v4 via `@hookform/resolvers/zod`): https://www.npmjs.com/package/@hookform/resolvers
- Tiptap v2→v3 upgrade guide (package consolidation, StarterKit changes, History→UndoRedo): https://tiptap.dev/docs/editor/upgrade-guides/upgrade-from-v2
- TanStack Table v9 migration: https://tanstack.com/table/latest/docs/guides/migrating-to-v9
- react-day-picker v10 upgrade guide + shadcn calendar guidance: https://daypicker.dev ; https://ui.shadcn.com/docs/components/calendar
- axios advisory GHSA-4hjh-wcwx-xvwj (CVE-2025-58754, fixed 1.12.0): https://github.com/axios/axios/security/advisories/GHSA-4hjh-wcwx-xvwj
- Local evidence: `node_modules` versions scan, `src/` import grep, `pnpm audit` endpoint failure log (2026-09-20).

> **Audit-only record.** No package.json, lockfile, source, config, or Prisma file was modified in the
> production of this document. Targets are proposals; every batch requires its human gate.
