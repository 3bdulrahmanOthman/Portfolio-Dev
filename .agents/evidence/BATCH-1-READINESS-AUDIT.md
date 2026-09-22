# Batch 1 Readiness Audit

## 1. Executive Summary

Batch 1 — *standalone minor/patch upgrades independent of all major migration projects* — is **READY WITH CONDITIONS**.

- **42 packages across 3 coherent groups** qualify: ~33 standalone minors (incl. the 23-package Radix set and the Tailwind 4.1.11 → 4.3.3 same-major move), 2 security-driven upgrades (**axios**, **next-auth** — deliberately separated per the command brief), and 4 paired upgrades (react-hook-form ↔ resolvers; @upstash/redis ↔ ratelimit, the latter **forced** by a new peer constraint).
- **Zero package.json changes required**: every target version satisfies the existing declared caret ranges; all commands are exact-scope `pnpm update <pkg>@<target>` calls.
- **Zero peer/engine blockers** against the post-Gate-1 lockfile baseline (react 19.1.0, next 15.3.0, TS 5.8.3, ESLint 9.30.1, Node 25.9.0).
- **Exclusions honored**: framework (next/react/react-dom/eslint-config-next), all dedicated migrations (Prisma 7, Zod 4, TanStack 9, Tiptap, react-day-picker), chat-dependent packages (socket.io, framer-motion), and all removal candidates stay out of Batch 1.
- Conditions (§19): human selection of which groups execute; explicit prerelease-exception decision for next-auth beta.32; acceptance of Tailwind-in-Batch-1; content-level lockfile backup before execution (user WIP on `pnpm-lock.yaml` forbids git-based rollback).

## 2. Current Repository State

- Branch `main`, HEAD `519a0026a75927a89cf2cadeedb313cfa26e4e21` (verified — matches the post-Gate-2 expectation).
- Working tree: `D package-lock.json` (Gate 2 result) + the 6 remaining tracked user changes (`M package.json`, `M pnpm-lock.yaml`, `M src/app/globals.css`, `D src/app/page.tsx`, `M src/components/icons.tsx`, `M src/types/index.ts`) + standing untracked set. **7 files changed, +150/−11,572.**
- Integrity sentinels (this audit): `package.json` = `b05494078ed737f2c8634dc1834f0b16e1c1750ee2ea42ac5d933d9c2a3e68d8`; `pnpm-lock.yaml` = `0a52de3393ab9dbf684b7fd03913a7da2f66cf66e61cd2f0d62c79a375e727d9`. Unchanged from the pre-Gate-1 sentinels.
- `package-lock.json`: **absent** (verified).

## 3. Current Toolchain

- Node **v25.9.0** (`C:\Program Files\nodejs\node.exe`) — EOL line, provisionally accepted (§16).
- pnpm **10.9.0** (standalone; `packageManager` pin with sha512 at `package.json:116`; no corepack).
- npm 11.9.0 (present, unused as project PM).
- `package.json` policy fields: **no** `engines`, **no** overrides/resolutions; scripts: `dev` (next dev --turbopack), `build`, `start`, `lint` (`next lint`), `postinstall` (`prisma generate`).

## 4. Batch 0 Completion Verification

- **Gate 1 (PASS WITH FINDINGS):** `pnpm install --frozen-lockfile` exit 0; node_modules reconciled to lockfile; `postinstall` → Prisma Client v6.11.1 generated into the store; `node_modules/@prisma/client` now a coherent store symlink. Baseline re-recorded: typecheck FAIL 21 lines, lint FAIL 2 (`.agents/evidence/BATCH-0-GATE-1-RESULT.md`).
- **Gate 2 (PASS WITH FINDINGS):** `package-lock.json` deleted; protected files byte-identical (`.agents/evidence/BATCH-0-GATE-2-RESULT.md`).
- Consequence for Batch 1: the **lockfile-authoritative versions are the canonical baseline** (§6 "Locked" column); the pre-Gate-1 installed versions are historical.

## 5. Direct Dependency Inventory

97 declared dependencies (82 deps + 15 devDeps). Candidate selection: **42 packages in Batch 1** (§11); everything else excluded with reasons (§17). Selection criteria applied: minor/patch only within current majors; independent of framework batch; not chat-ADR-dependent; no removals; security items classified separately.

## 6. Declared/Locked/Installed/Latest Matrix

"Locked" = post-Gate-1 pnpm-lock.yaml resolution (= installed today). All targets verified against the registry 2026-09-20 (same-day as Phase 2 queries; no drift).

### Group A — standalone minors

| Package | package.json | Locked | Latest stable | Delta | In range? | Peers OK | Node 25 |
|---|---|---|---|---|---|---|---|
| nuqs | ^2.4.3 | 2.4.3 | 2.10.1 | minor | ✔ | next ≥14.2 ✓, react ✓ | n/a |
| date-fns | ^4.1.0 | 4.1.0 | 4.4.0 | minor | ✔ | — | n/a |
| sonner | ^2.0.3 | 2.0.6 | 2.0.8 | patch+ | ✔ | react ^19 ✓ | n/a |
| nextjs-toploader | ^3.8.16 | 3.8.16 | 3.9.17 | minor | ✔ | next ≥6 ✓ | n/a |
| tailwind-merge | ^3.2.0 | 3.3.1 | 3.7.0 | minor | ✔ | — | n/a |
| tw-animate-css | ^1.2.5 | 1.3.5 | 1.4.0 | minor | ✔ | — | n/a |
| tailwindcss | ^4 | 4.1.11 | 4.3.3 | minor (same major) | ✔ | — | n/a |
| @tailwindcss/postcss | ^4 | 4.1.11 | 4.3.3 | minor | ✔ | — | n/a |
| @auth/prisma-adapter | ^2.8.0 | 2.10.0 | 2.11.3 | minor | ✔ | @prisma/client ≥6 ✓ | n/a |
| tsx (dev) | ^4.19.3 | 4.20.3 | 4.23.15 | minor | ✔ | — | `>=18` ✓ |
| @eslint/eslintrc (dev) | ^3 | 3.3.1 | 3.3.7 | patch | ✔ | — | `>=21.1.0` clause ✓ |
| @radix-ui/react-accordion | ^1.2.11 | 1.2.11 | 1.2.20 | minor | ✔ | react ^19 ✓ | n/a |
| @radix-ui/react-alert-dialog | ^1.1.10 | 1.1.14 | 1.1.23 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-avatar | ^1.1.7 | 1.1.10 | 1.2.6 | minor | ✔ | ✓ | n/a |
| @radix-ui/react-checkbox | ^1.2.2 | 1.3.2 | 1.3.11 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-collapsible | ^1.1.8 | 1.1.11 | 1.1.20 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-context-menu | ^2.2.10 | 2.2.15 | 2.3.7 | minor | ✔ | ✓ | n/a |
| @radix-ui/react-dialog | ^1.1.10 | 1.1.14 | 1.1.23 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-dropdown-menu | ^1.1.10 | 2.1.15 | 2.1.24 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-hover-card | ^1.1.14 | 1.1.14 | 1.1.23 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-label | ^1.2.4→^1.1.4* | 2.1.7*→1.1.7 | 1.1.15 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-navigation-menu | ^1.2.13 | 1.2.13 | 1.2.22 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-popover | ^1.1.10 | 1.1.14 | 1.1.23 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-scroll-area | ^1.2.5 | 1.2.9 | 1.2.18 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-select | ^2.2.2 | 2.2.5 | 2.3.7 | minor | ✔ | ✓ | n/a |
| @radix-ui/react-separator | ^1.1.4 | 1.1.7 | 1.1.15 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-slider | ^1.2.4 | 1.3.5 | 1.4.7 | minor | ✔ | ✓ | n/a |
| @radix-ui/react-slot | ^1.2.0 | 1.2.3 | 1.3.3 | minor | ✔ | react ✓ | n/a |
| @radix-ui/react-switch | ^1.2.2 | 1.2.5 | 1.3.7 | minor | ✔ | ✓ | n/a |
| @radix-ui/react-tabs | ^1.1.9 | 1.1.12 | 1.1.21 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-toggle | ^1.1.6 | 1.1.9 | 1.1.18 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-toggle-group | ^1.1.7 | 1.1.10 | 1.1.19 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-toolbar | ^1.1.6 | 1.1.10 | 1.1.19 | patch | ✔ | ✓ | n/a |
| @radix-ui/react-tooltip | ^1.2.3 | 1.2.7 | 1.2.16 | minor | ✔ | ✓ | n/a |

*Label typo in manifest row (`@radix-ui/react-label ^1.1.4`); locked 1.1.7, latest 1.1.15 — in range, unaffected.

### Group B — security-driven (separate batch, not merged into A)

| Package | package.json | Locked | Target | Security floor | Class |
|---|---|---|---|---|---|
| axios | ^1.8.4 | 1.10.0 | **1.20.0** (latest stable) | ≥ 1.12.0 (GHSA-4hjh-wcwx-xvwj); highs to ≥ 1.16/1.18; target clears all recorded advisories | stable-only, security-driven |
| next-auth | ^5.0.0-beta.25 | 5.0.0-beta.29 | **5.0.0-beta.32** | ≥ beta.32 (GHSA-8fpg-xm3f-6cx3 critical fail-open; GHSA-xmf8-cvqr-rfgj high getToken; GHSA-7rqj-j65f-68wh critical email normalizer) | **prerelease — requires the documented human exception decision**; `@auth/core 0.41.3` (fixed) rides along as its dependency |

### Group C — paired updates

| Pair | Locked → Target | Why paired |
|---|---|---|
| react-hook-form 7.60.0 → **7.88.0** + @hookform/resolvers 5.1.1 → **5.9.1** | resolvers peer-locks `react-hook-form: ^7.55.0` (satisfied either way) and `zod: ^3.25.0 || ^4.0.0` (3.25.74 ✓) — form stack moves as one unit | coupled form behavior |
| @upstash/redis 1.35.1 → **1.38.4** + @upstash/ratelimit 2.0.5 → **2.1.0** | **forced**: ratelimit@2.1.0 declares peer `@upstash/redis: ^1.38.2` | peer-boundary |

### Excluded from Batch 1 (with destination)

| Package(s) | Locked | Exclusion reason | Roadmap destination |
|---|---|---|---|
| next | 15.3.0 | framework migration; security floor ≥ 15.5.24 | Batch 6: 15.5.25 → 16.3.5 (15.3.9 dropped per corrected plan) |
| react / react-dom | 19.1.0 | with framework group | Batch 6 (19.3.0) |
| eslint-config-next | 15.3.0 | with framework group | Batch 6 (16.3.5) |
| prisma / @prisma/client / @prisma/extension-accelerate | 6.11.1 | dedicated migration project (7.x GA; 8 RC excluded) | Batch 7 |
| zod | 3.25.74 | v3 line frozen; v4 = migration project | deferred (Zod 4 project) |
| @tanstack/react-table | 8.21.3 | major migration project (v9 API restructure) | Batch 8 |
| @tiptap/* (15) | 2.24.2 | major migration project (v3; also the mergeAttributes moderate has no 2.x fix — patched only ≥ 3.30.4) | Tiptap 3 project (interim 2.27.3 optional, separately gated) |
| react-day-picker | 8.10.1 | major migration (v9 rewrite + v10) | Batch 9 |
| socket.io | 4.8.1 | chat-ADR-dependent (dead code) | Batch 11 per ADR |
| framer-motion | 11.18.2 | chat-ADR-dependent (only dead chat imports it) | Batch 11 per ADR |
| @types/react / @types/react-dom / @types/node (dev) | 19.1.8 / 19.1.6 / 20.19.4 | belong with React 19.3 / the runtime decision respectively | Batch 6 / runtime batch |
| lucide-react, react-resizable-panels, motion, bcrypt-ts, uuid, shiki, tailwind-scrollbar-hide-adjacent majors | — | majors skipped by their lines (1.x / 4.x / 13.x / 9.x / 14.x / 4.x) | Batches 9–11 (shiki & scrollbar-hide stay ACTIVE — dynamic import + `@plugin`) |
| jotai, uuid, lodash-es(+types), react-colorful, react-markdown, remark-gfm, install | — | removal candidates (zero imports; re-confirmed) — **never upgraded** | cleanup batch (Batch 11), separately gated |

## 7. Security Findings

Advisory basis: same-day `pnpm audit --registry=https://registry.npmjs.org` record (Command 3 evidence; lockfile unchanged since → advisory set unchanged). Focused triage:

| Package | Affected | Fixed | Locked | Severity | Exploitability/context | Required target | Batch classification | Source |
|---|---|---|---|---|---|---|---|---|
| next-auth | ≥5.0.0-beta.0 ≤beta.31 | **beta.32** | beta.29 | 2× critical, 1 high, 1 moderate | Credentials+JWT auth is the app's front door; fail-open existence checks + getToken() exception are directly on the code path | **beta.32** (pins @auth/core 0.41.3) | **Group B — separate security batch; prerelease exception decision required** | GHSA-8fpg-xm3f-6cx3, GHSA-xmf8-cvqr-rfgj, GHSA-7rqj-j65f-68wh |
| axios | <1.12.0 … <1.18.0 (20+ advisories) | 1.12.0 … 1.18.0 | 1.10.0 | 1 critical (form-data via axios, GHSA-fjxv-7rqg-78g4), ~10 high | **Low exploitability** — single import, error-typing only (`src/lib/handle-error.ts`), no request execution found | **1.20.0** (latest stable; clears all) | **Group B — separate security batch** | GHSA set (Command 3 record) |
| next | ≥15.3.0 <15.3.6 … <15.5.24 | 15.3.6 … **15.5.24** | 15.3.0 | 2× critical (incl. Windows-hosted unauth RCE), ~15 high/moderate | Dev machine is Windows; deployment platform unconfirmed | **≥ 15.5.24** — but **NOT Batch 1** (framework migration, separately gated) | Deferred → Batch 6 | GHSA-9qr9-h5gf-34mp, GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4 |
| @tiptap/core 2.x | ≥2.0.0 <3.30.4 | **3.30.4 only** | 2.24.2 | moderate (mergeAttributes proto-pollution) | Admin-facing editor | No 2.x fix exists | Deferred → Tiptap 3 project | GHSA-cp6q-959q-f8rh |
| Transitive (form-data, tar, js-yaml, minimatch, brace-expansion, picomatch, postcss, sharp, ws, engine.io, …) | various | various | various | 8 critical / 71 high total (same-day audit) | Mixed; engine.io/socket.io/ws findings sit in dead code; most resolve via Batch 6/7/11 | per-parent batches | Deferred | Command 3 advisory record |

No `pnpm audit --fix` or repair command was run. No new advisories were fetched beyond the same-day record (lockfile unchanged since that audit).

## 8. Usage/Risk Analysis

| Candidate | Actual usage (evidence) | Runtime surface | Update risk |
|---|---|---|---|
| Radix set (23) | ~40 `src/components/ui/*` primitives + admin/nav components; client components | browser | Low — same-major patches/minors; API-stable |
| nuqs | `src/schemas/index.ts` search-param caches + data-table hooks; server+client | both | Low |
| react-hook-form + @hookform/resolvers | 6 form components (`src/components/forms/*`); client | browser | Low — minors; zod pairing unchanged (v3 stays) |
| date-fns | data-table date filter + admin tables; client | browser | Low |
| sonner | toast provider (`providers.tsx`); client | browser | Low |
| nextjs-toploader | providers; client | browser | Low |
| tailwindcss + @tailwindcss/postcss | build-time (`globals.css` `@import "tailwindcss"`; PostCSS) | build only | Low — same-major; visual smoke recommended |
| tailwind-merge | `lib/utils.ts` `cn()`; ubiquitous | browser | Low |
| tw-animate-css | CSS import (`globals.css:4`) | build | Low |
| @upstash/redis + ratelimit | `lib/rate-limit.ts`; server (uploads, chat) | server | Low — but **paired** |
| @auth/prisma-adapter | `src/auth.ts`; server | server | Low |
| axios | **one import**, `lib/handle-error.ts` (error typing; no requests) | server/client typing | Minimal |
| next-auth | `auth.ts`, `auth.config.ts`, `middleware.ts`, login actions; server+edge | auth-critical | Medium — beta-channel bump; changelog review + auth smoke mandatory |
| tsx / @eslint/eslintrc | dev tooling (seed runner / flat-config compat) | dev only | Minimal |

Active-by-evidence (not "dead", per prior corrections): **shiki** (dynamic import `code-editor.tsx:75`) and **tailwind-scrollbar-hide** (`@plugin`, `globals.css:3`) — neither is in Batch 1 (their available updates are majors → later batches). Continued-investigation dead candidates (jotai, uuid, lodash-es, react-colorful, react-markdown, remark-gfm, install) are **not touched** in Batch 1 — classified for the later cleanup batch.

## 9. Peer Dependency Analysis

Checked against the post-Gate-1 baseline: **react 19.1.0 · next 15.3.0 · TypeScript 5.8.3 · ESLint 9.30.1 · Node 25.9.0 · pnpm 10.9.0** (registry manifests fetched 2026-09-20):

| Candidate (target) | Peer requirements | Verdict |
|---|---|---|
| Radix ×23 | react ^16.8\|^17\|^18\|^19; react-dom same; @types/react * | ✓ no conflict |
| nuqs 2.10.1 | next ≥14.2.0 ✓; react ≥18.2.0\|\|^19 ✓ | ✓ |
| react-hook-form 7.88.0 | react ^16.8\|^17\|^18\|^19 ✓; engines `>=18` ✓ | ✓ |
| @hookform/resolvers 5.9.1 | react-hook-form ^7.55.0 ✓; zod ^3.25.0\|\|^4 ✓; others optional-uninstalled | ✓ |
| sonner 2.0.8 | react/react-dom ^18\|^19 ✓ | ✓ |
| nextjs-toploader 3.9.17 | next ≥6 ✓ | ✓ |
| @auth/prisma-adapter 2.11.3 | @prisma/client ≥6 ✓ | ✓ |
| @upstash/ratelimit 2.1.0 | **@upstash/redis ^1.38.2 → forces the pair** | ✓ (paired in Group C) |
| next-auth 5.0.0-beta.32 | next ^14\|\|^15\|\|^16 ✓; react ^18.2\|\|^19 ✓; **no engines declared**; deps pin @auth/core 0.41.3 ✓ | ✓ |
| axios 1.20.0 | none | ✓ |
| tailwindcss/@tailwindcss/postcss 4.3.3 | none | ✓ |
| tsx 4.23.15 / @eslint/eslintrc 3.3.7 | engines `>=18` ✓ / `^18.18\|\|^20.9\|\|>=21.1` ✓ (Node 25 via ≥21.1 clause) | ✓ |

**Flags:** only the forced redis↔ratelimit pairing (handled by Group C). No optional-peer changes, no transitive major changes, no package that would force unrelated upgrades. **No peer conflicts found.**

## 10. Lockfile Impact Analysis (analytical — no `pnpm update`/`--lockfile-only` used)

| Group | Direct entry changes | Expected transitive changes | Peer-resolution changes | Package count |
|---|---|---|---|---|
| A (33 pkgs) | 33 importer entries bump | Minimal: radix set is self-contained (react peers only); tailwindcss 4.3.3 may move its internal deps within-range; date-fns/nuqs/sonner leaf-like | none | ±0–3 (new transitive minors) |
| B-axios | 1 entry (1.10.0 → 1.20.0) | **security-relevant positives**: `form-data` ≥ 4.0.6, `follow-redirects` ≥ 1.16.0 update — closes recorded advisories | none | ±1–2 |
| B-next-auth | 1 entry (beta.29 → beta.32) | `@auth/core` → **0.41.3** (fixed) + its small dep set | none (optional peers like @simplewebauthn not installed) | ±1–2 |
| C-forms | 2 entries | none (leaf packages) | none | ±0 |
| C-upstash | 2 entries | none | resolves the new ratelimit peer | ±0 |

All targets satisfy existing declared ranges → **package.json untouched; lockfile updated in-place by scoped `pnpm update`**. Groups are independently executable and should NOT be merged into one diff.

## 11. Proposed Batch 1 Groups

- **A — standalone minors (33 pkgs)** — why together: all leaf-ish, API-stable same-major bumps with no interdependency beyond Radix's shared peer; why separate: zero relation to security work or the form/upstash pairs. Verification: typecheck/lint baseline + dev-server smoke (Radix/tailwind are the visible surface).
  - A-css sub-scope (tailwindcss + @tailwindcss/postcss + tailwind-merge + tw-animate-css): build-tooling cluster, visually verifiable, isolatable if the human prefers maximal granularity.
- **B — security-driven (2 pkgs, potentially 2 gates)** — why separate: the command brief explicitly forbids silently merging security work into a generic batch; each has its own risk profile: **B1 axios** (stable-only, minimal exploitability) and **B2 next-auth** (prerelease, auth-critical, needs the exception decision + changelog review + auth smoke).
- **C — paired (4 pkgs in 2 pairs)** — why together: peer-boundary-coupled; why separate from A: a failure is diagnosable against a known pair.

## 12. Exact Future Commands (PROPOSED — NOT AUTHORIZED)

All targets are within declared ranges → **no package.json edits**; `pnpm update <pkg>@<exact-version>` per group (explicit pins; no wildcards, no `--latest`):

```text
Group A (core):
pnpm update nuqs@2.10.1 date-fns@4.4.0 sonner@2.0.8 nextjs-toploader@3.9.17 tailwind-merge@3.7.0 tw-animate-css@1.4.0 @auth/prisma-adapter@2.11.3 tsx@4.23.15 @eslint/eslintrc@3.3.7

Group A-css (optional split):
pnpm update tailwindcss@4.3.3 @tailwindcss/postcss@4.3.3

Group A-radix:
pnpm update @radix-ui/react-accordion@1.2.20 @radix-ui/react-alert-dialog@1.1.23 @radix-ui/react-avatar@1.2.6 @radix-ui/react-checkbox@1.3.11 @radix-ui/react-collapsible@1.1.20 @radix-ui/react-context-menu@2.3.7 @radix-ui/react-dialog@1.1.23 @radix-ui/react-dropdown-menu@2.1.24 @radix-ui/react-hover-card@1.1.23 @radix-ui/react-label@1.1.15 @radix-ui/react-navigation-menu@1.2.22 @radix-ui/react-popover@1.1.23 @radix-ui/react-scroll-area@1.2.18 @radix-ui/react-select@2.3.7 @radix-ui/react-separator@1.1.15 @radix-ui/react-slider@1.4.7 @radix-ui/react-slot@1.3.3 @radix-ui/react-switch@1.3.7 @radix-ui/react-tabs@1.1.21 @radix-ui/react-toggle@1.1.18 @radix-ui/react-toggle-group@1.1.19 @radix-ui/react-toolbar@1.1.19 @radix-ui/react-tooltip@1.2.16

Group B1 (security, stable):
pnpm update axios@1.20.0

Group B2 (security, prerelease — REQUIRES the prerelease-exception decision):
pnpm update next-auth@5.0.0-beta.32

Group C-forms:
pnpm update react-hook-form@7.88.0 @hookform/resolvers@5.9.1

Group C-upstash:
pnpm update @upstash/redis@1.38.4 @upstash/ratelimit@2.1.0
```

Each command updates `pnpm-lock.yaml` in place (frozen install is not required afterward — `pnpm update` reconciles node_modules itself). `package.json` remains byte-identical throughout.

## 13. Verification Contract

Per group (A / A-css / A-radix / B1 / B2 / C-forms / C-upstash):

**Pre-change:** `git status --short` (must equal the post-Gate-2 state) · SHA-256 of `package.json` + `pnpm-lock.yaml` (sentinels) · **byte copy of `pnpm-lock.yaml` stored in the run record** (rollback basis — see §14) · version snapshot of the group's packages.

**Change:** the exact group command (§12). Expected files: `pnpm-lock.yaml` (group's entries) + `node_modules/**` (ignored). Nothing else.

**Post-change:**
1. `git status --short` — no new tracked changes beyond the lockfile (package.json byte-identical by sentinel re-hash).
2. Typecheck: `pnpm exec tsc --noEmit --incremental false` — compare to the **21-error-line baseline** (§15).
3. Lint: `pnpm exec next lint` — compare to the **2-error baseline**.
4. Integrity: sentinel hashes; `pnpm list <group> --depth 0` version check.
5. Targeted manual evidence where the group touches visible behavior: A/A-radix → dev-server smoke of representative admin pages + public page; A-css → visual check (theme/animations unchanged); B1 → nothing observable (typing-only); B2 → **auth smoke: login (valid+invalid), /admin guard, logout**; C-forms → one form end-to-end (project form); C-upstash → an upload attempt (rate-limit path).
6. **Tests: NONE exist** — this is an explicit limitation; verification rests on static checks + manual/browser evidence. Do not invent tests.

## 14. Rollback Contract

**Critical constraint:** `pnpm-lock.yaml` carries **uncommitted user WIP** (+104 lines) — `git show HEAD:pnpm-lock.yaml` or any `git restore` would **destroy user work**. Therefore:

- **Rollback is content-level:** restore `pnpm-lock.yaml` from the pre-change byte copy captured in the run record (§13), then `pnpm install --frozen-lockfile` to rebuild node_modules to the restored lockfile. `package.json` never changes, so no manifest rollback exists.
- **Expected-change boundary:** only the group's lockfile entries + `node_modules`. Any tracked file other than `pnpm-lock.yaml` changing = immediate stop condition (unexpected mutation — report, do not repair).
- **Immediate-stop conditions:** install failure; typecheck/lint error-count increase that cannot be classified; peer-resolution conflicts; auth smoke failure (B2); baseline shift without explanation.
- Group-level independence: each group rolls back alone without touching the others' entries.

## 15. Baseline Regression Matrix

Existing baseline (post-Gate-1, recorded evidence):

- **TypeScript: 21 error lines** — 8 × `src/actions/chat.ts` (chat/schema mismatch: `prisma.conversation`/`prisma.message` missing) + 13 stable pre-existing errors (data-table-date-filter ×2, project-form ×1, hero `"glow"` ×1, ui/chart ×8, lib/export ×1).
- **ESLint: 2 errors** (`chat-widget.tsx:30`, `lib/socket.ts:45`) — unchanged since Phase 0.

Per-group rule:

```text
Allowed:
- baseline errors remain unchanged (21 TS lines, 2 lint errors, same locations);
- NO-NEW-ERRORS: every deviation classified per policies/VERIFICATION.md
  (baseline / newly-introduced / fixed-baseline / unrelated / unknown).

Failure (stop and classify before continuing):
- new errors appear anywhere;
- existing error count increases without explanation;
- unrelated source files begin failing;
- dependency-generated types introduce unexplained regressions
  (watch: resolvers/RHF typing in project-form.tsx; radix prop types in ui/*).
```

Batch 1 is **not required to fix** the chat/schema mismatch or any baseline defect; if a group incidentally fixes baseline errors (e.g., resolvers 5.9.1 vs the `project-form.tsx` TS2769), record as *fixed-baseline-failure* with the diff evidence — no silent reinterpretation.

## 16. Node 25 Compatibility Conditions

- Runtime for Batch 1: **Node v25.9.0 (EOL, provisionally accepted)**; pnpm 10.9.0. Gate 1's four Node 25 conditions remain in force.
- Per-candidate check (§6/§9): every engine declaration in the candidate set passes on Node 25 (`tsx >=18`, `react-hook-form >=18`, `@eslint/eslintrc >=21.1.0` clause; all others unconstrained). **No Node-25-specific concern for any Batch 1 candidate.**
- Standing caveats: Node 25 is EOL (no security maintenance); Prisma tooling stays outside its official LTS matrix (unchanged by Batch 1 — no Prisma operation occurs); **Node 24 LTS remains the preferred long-term baseline**; Node-25 compatibility ≠ long-term support. Baselines recorded under Node 25 must stay tagged with the runtime (runtime-delta rule).
- The Node runtime decision is **not** a dependency upgrade and stays out of Batch 1.

## 17. Explicitly Deferred Work (what is NOT Batch 1)

| Work item | Destination batch (per the approved roadmap) |
|---|---|
| Next 15.5.25 (security floor ≥ 15.5.24) | Batch 6 — staged framework (first step; replaces the dropped 15.3.9 idea) |
| Next 16.3.5 + React 19.3 + @types/* + eslint-config-next 16 + ESLint 10 | Batch 6 (staged, auth gates) |
| Prisma 7.10.x + Accelerate ext 3.0.1 | Batch 7 (migration project; Node-24 re-verify per Gate 1 Condition 3) |
| Prisma 8 | NOT a target (RC; re-evaluate at GA) |
| Zod 4 | Dedicated migration project (post-framework) |
| Tiptap 3 (also the only fix for the mergeAttributes moderate) | Tiptap 3 project; interim 2.27.3 optional/separately gated |
| TanStack Table 9 | Batch 8 |
| react-day-picker 9/10 migration | Batch 9 |
| TypeScript 7 | Deferred until 7.1 API + typescript-eslint support |
| Node 26 / Node 24 switch | Runtime decision (human; not a dependency batch) |
| Chat subsystem repair/delete (socket.io, framer-motion, chat UI) | Chat ADR → Batch 11 |
| Dependency cleanup/removals (install, jotai, uuid, lodash-es, react-colorful, react-markdown, remark-gfm) | Batch 11 (separately gated; not Batch 1) |

## 18. Open Questions

1. **Group granularity:** execute Groups A / A-css / A-radix / B1 / B2 / C-forms / C-upstash as seven separate gates (recommended), or consolidate (e.g. A+A-radix)?
2. **B2 prerelease exception:** confirm the next-auth beta.32 bump under VERSION-POLICY's exception rule (security-driven; prerelease remains the channel).
3. **Tailwind placement:** accept tailwindcss 4.3.3 inside Batch 1 (same-major, per Command 8 §5 allowance) or defer the CSS group to its own gate?
4. **@types deferral confirmation:** @types/react(-dom) deferred to Batch 6 and @types/node to the runtime batch (recommended) — confirm.
5. **Interim Tiptap 2.27.3:** skip (recommended — one lockfile churn now, the 3.x project follows anyway) or include as a pre-Batch-2 micro-gate?

## 19. Readiness Decision

**READY WITH CONDITIONS.**

Candidates are isolated, peer/engine-clean, exactly commanded, and fully contracted for verification and WIP-safe rollback. Conditions before execution:

1. Human selects the group(s) to run and their order (§18 Q1).
2. **B2 requires the explicit prerelease-exception decision** (VERSION-POLICY §2) — it does not execute as part of a generic approval.
3. Tailwind-in-Batch-1 acceptance (§18 Q3).
4. **Pre-change content backup of `pnpm-lock.yaml` is mandatory** (user WIP makes git-based rollback destructive) — written into every group's run record before its command runs.
5. Execution proceeds under the provisional Node 25 conditions (§16), with baseline evidence tagged by runtime.
6. Each group closes with its own verification + evidence record before the next group starts (stop-on-unexpected-failure rule).

## 20. Evidence Sources

- Local: git state + SHA-256 sentinels (this audit); post-Gate-1 lockfile/installed versions (`.agents/evidence/BATCH-0-GATE-1-RESULT.md`); baseline counts (21 TS lines / 2 lint errors, Command 6 record).
- Registry (queried 2026-09-20): `latest` + `peerDependencies` + `engines` + deprecation flags for all 42 candidates (§6/§9 tables); dist-tags for next-auth (beta = 5.0.0-beta.32; latest = 4.24.15), axios (1.20.0), tailwindcss (4.3.3); `next-auth@5.0.0-beta.32` manifest (peers next ^14||^15||^16, react ^18.2||^19, deps @auth/core 0.41.3, no engines).
- Security: same-day advisory record from the Command 3 audit (`pnpm audit` vs registry.npmjs.org; GHSA IDs cited in §7).
- Usage: import maps from Commands 3/5 (shiki dynamic import; `@plugin` CSS usage; axios single-import; chat/socket dead reachability).
- Prior evidence: `DISCOVERY-BASELINE.md`, `DEPENDENCY-UPGRADE-AUDIT.md`, `BATCH-0-READINESS-AUDIT.md`, `NODE-25-COMPATIBILITY-AUDIT.md`, Gate 1/2 results.
