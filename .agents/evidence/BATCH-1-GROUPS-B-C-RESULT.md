# Batch 1 — Groups B + C Unified Result

## Executive Result

**PASS WITH FINDINGS**

All six authorized direct dependency targets were reached exactly and only: `axios` 1.10.0 → **1.20.0**, `next-auth` 5.0.0-beta.29 → **5.0.0-beta.32**, `react-hook-form` 7.60.0 → **7.88.0**, `@hookform/resolvers` 5.1.1 → **5.9.1**, `@upstash/redis` 1.35.1 → **1.38.4**, `@upstash/ratelimit` 2.0.5 → **2.1.0**. The lockfile key-level diff against the pre-batch byte snapshots is fully accounted for inside the authorized closures — zero unrelated movement, zero Group A regression (`@radix-ui/react-label` still 2.1.15). Verification: **typecheck 20 error lines** (19 unchanged baseline lines + **1 fixed baseline line** — `forms/project-form.tsx:53` TS2769 disappeared under the Group C form-stack upgrade, exactly as `BATCH-1-READINESS-AUDIT.md` §15 predicted; **0 new errors**), **lint 2/2 baseline errors unchanged**. Auth smoke passes (the one environment-limited import is control-proven pre-existing behavior of `next/server`, not a batch regression). Informational `pnpm audit` reports **zero findings for any Group B/C package**. User WIP byte-intact; HEAD unchanged; no commit/push. Both executed commands ran **foreground** and completed normally (the Group A pnpm-hang defect did not recur). Findings W1–W5 are informational (§18).

**Batch 1 (Groups A + B + C, 40/40 items) is now complete and ready to close.**

## 1. Authorization / scope

- Human Command brief (2026-09-21): Command 12 — Batch 1 **Groups B + C only**, unified execution, exact targets, explicit verification/evidence contract, hard stop after.
- Explicitly NOT authorized (and not done): Batch 2+, Next/React/TS-major/ESLint-major/Prisma/Zod/Tiptap/TanStack/react-day-picker upgrades, dependency removals, source-code fixes, architecture/database changes, unrelated dependency updates.
- Mandatory context loaded before mutation: `AGENTS.md`, `policies/{APPROVALS,VERIFICATION,GIT,SECURITY,CONTEXT}.md`, `workflows/DEPENDENCY-UPGRADE.md`, `BATCH-1-READINESS-AUDIT.md`, `BATCH-1-GROUP-A-RESULT.md`, `BATCH-1-REACT-LABEL-RESULT.md`, `DEPENDENCY-UPGRADE-AUDIT.md` (all present; none missing).

## 2. Pre-flight state (recorded, nothing modified)

- HEAD: `519a0026a75927a89cf2cadeedb313cfa26e4e21` ✔ (matches expectation).
- Working tree: the standing post-react-label set — 7 tracked entries (`D package-lock.json`, `M package.json`, `M pnpm-lock.yaml`, `M src/app/globals.css`, `D src/app/page.tsx`, `M src/components/icons.tsx`, `M src/types/index.ts`) + the standing untracked set. Nothing unexpected.
- `package-lock.json`: **ABSENT** ✔ (post-Gate-2 state).
- SHA-256 sentinels: `package.json` = `f37daf37a697fe1551979e83edc5fd5eca9e55bae3e0c166b8daed7126af6098`, `pnpm-lock.yaml` = `05f81e2356d70d9ddc3cb772d049040d9532650ecbd12928b163a30ea12a2669` — byte-identical to the post-micro-gate record.
- Target versions verified (lockfile AND `node_modules`, both agree): axios **1.10.0**, next-auth **5.0.0-beta.29**, react-hook-form **7.60.0**, @hookform/resolvers **5.1.1**, @upstash/redis **1.35.1**, @upstash/ratelimit **2.0.5**; @auth/core present as **0.40.0** (next-auth-owned) + **0.41.3** (adapter-owned); Group A state confirmed: @radix-ui/react-label = **2.1.15**.
- Rollback snapshots captured before first mutation: `.agents/evidence/snapshots/batch-1-groups-b-c/{package.json.pre,pnpm-lock.yaml.pre,lockfile-keys-before.txt,snapshot-keys-before.txt}` — snapshot hashes equal the pre-flight sentinels.

## 3. Runtime versions

```text
Node: v25.9.0   (EOL line — provisional Node 25 conditions of BATCH-0-GATE-1-RESULT.md remain in force; this record is runtime-tagged)
pnpm: 10.9.0    (packageManager pin)
npm:  present, not the project PM
```

## 4. Group B execution

- Command (verbatim, **foreground**, no `--latest`, no registry change, no separate `pnpm install`, no `approve-builds`):

```bash
pnpm update axios@1.20.0 next-auth@5.0.0-beta.32
```

- **Exit 0**, "Done in 1m 0.2s". Output: `- axios 1.10.0 / + axios 1.20.0`; `- next-auth 5.0.0-beta.29 / + next-auth 5.0.0-beta.32`; `Packages: +9 -1`. Store: 9 downloaded, 1 added to graph top-level.
- Warnings: the standing react-day-picker unmet-peer warnings (baseline, pre-existing) + the standing pnpm "Ignored build scripts: esbuild" notice (baseline). No peer-resolution conflicts, no hangs (foreground execution per the Group A F3 rule).
- `@auth/core` moved **transitively** as required by the authorized next-auth upgrade (beta.32 depends on @auth/core 0.41.3; see §5). No unrelated `@auth/*` package was independently upgraded.

## 5. Group B scope audit

**package.json (diff vs pre-batch snapshot — exactly 2 lines):**

```diff
-    "axios": "^1.8.4",
+    "axios": "^1.20.0",
-    "next-auth": "^5.0.0-beta.25",
+    "next-auth": "5.0.0-beta.32",
```

Both are the authorized packages (specifier-rewrite behavior of `pnpm update pkg@<exact>` — known and accepted since Group A §7). Note W4: for the prerelease target pnpm wrote an **exact pin** (`5.0.0-beta.32`, no caret) rather than `^5.0.0-beta.32`. No `@auth/core` manifest entry exists (it is not a direct dependency — correct; its change is transitive-only).

**pnpm-lock.yaml (key-level, vs pre-batch; identical result at Group B checkpoint and final):**

| Change | Classification |
|---|---|
| `axios@1.10.0` → `axios@1.20.0` | authorized direct |
| `next-auth@5.0.0-beta.29` → `5.0.0-beta.32` | authorized direct |
| `follow-redirects` 1.15.9 → **1.16.0** | axios closure (security-relevant positive) |
| `form-data` 4.0.3 → **4.0.6** | axios closure (security-relevant positive) |
| `proxy-from-env` 1.1.0 → **2.1.0** | axios closure |
| `https-proxy-agent@5.0.1` **added** + `agent-base@6.0.2` **added** | axios 1.20.0's new direct dep `https-proxy-agent` + its dep (verified: `axios@1.20.0` dependency list in lockfile) |
| `es-object-atoms` 1.1.1 → **1.1.2** | axios closure (re-resolved with form-data 4.0.6's `es-set-tostringtag@2.1.0` requirement, in-range) |
| `hasown` 2.0.2 → **2.0.4** | axios closure (form-data 4.0.6 dependency, in-range) |
| `@auth/core@0.40.0` **removed** | next-auth closure — beta.32 depends on @auth/core 0.41.3, which already existed for `@auth/prisma-adapter@2.11.3`; the 0.40.0 copy is orphaned and dropped |
| `jose@6.0.11` **removed**, `oauth4webapi@3.5.5` **removed** | orphaned transitive deps of the dropped @auth/core 0.40.0 (0.41.3 uses the already-present jose 6.2.12 / oauth4webapi 3.8.8) |

Nothing outside these closures changed. **Positive structural result:** the graph now contains a **single `@auth/core` copy (0.41.3)**, consumed by both next-auth 5.0.0-beta.32 and @auth/prisma-adapter 2.11.3 — this resolves finding F2 of `BATCH-1-GROUP-A-RESULT.md` (dual-copy topology).

## 6. Auth-specific verification (read-only)

- **Resolution:** `node_modules/next-auth/package.json` version = `5.0.0-beta.32` ✔. `@auth/core` inside next-auth's own store closure = **0.41.3** ✔ (symlink `next-auth@5.0.0-beta.32_…/node_modules/@auth/core → node_modules/.pnpm/@auth+core@0.41.3/…` verified; lockfile importer entries at both consumption sites point to 0.41.3). No older axios/next-auth/@auth/core version is selected anywhere in the graph (key-diff proven).
- **Import smoke** (`snapshots/batch-1-groups-b-c/auth-smoke.mjs`, exit 0 on non-environmental checks):
  - `next-auth/jwt` — imports; exports `getToken` function. **OK.**
  - `@auth/prisma-adapter` — imports; exports `PrismaAdapter` function. **OK.**
  - `next-auth` main entry — `ERR_MODULE_NOT_FOUND` on `next/server`. **Classified environment limitation, not a batch regression:** the control test (`import('next/server')` directly, no next-auth involved) fails identically in plain Node, because `next/server` requires Next.js bundler/runtime export conditions. The app itself consumes next-auth only through Next.js (typecheck + build pipeline), not bare Node.
  - `axios` — imports; `VERSION === '1.20.0'`. **OK.**
- **Auth surface intact:** `src/auth.ts` (`NextAuth({ adapter: PrismaAdapter(prisma), session: { strategy: "jwt", … }, callbacks, ...authConfig })`), `src/auth.config.ts`, and `src/middleware.ts` are unchanged (git status — no source file modified) and compile clean (typecheck below shows zero errors in any auth file). No auth configuration, secrets, credentials, or database state touched. No login attempted against any service.

## 7. Group C execution

- Command (verbatim, **foreground**, after Group B scope audit passed):

```bash
pnpm update react-hook-form@7.88.0 @hookform/resolvers@5.9.1 @upstash/redis@1.38.4 @upstash/ratelimit@2.1.0
```

- **Exit 0**, "Done in 42.8s". Output deltas: `- @hookform/resolvers 5.1.1 / + 5.9.1`; `- @upstash/ratelimit 2.0.5 / + 2.1.0`; `- @upstash/redis 1.35.1 / + 1.38.4 (1.39.0 is available)`; `- react-hook-form 7.60.0 / + 7.88.0`; `Packages: +4`.
- The `1.39.0 is available` note was **not acted on** — the authorized target is 1.38.4. Same standing baseline warnings only (react-day-picker peers; esbuild ignored builds). No hang, no conflict.

## 8. Group C scope audit

- **Versions verified** (lockfile + `node_modules`): react-hook-form **7.88.0**, @hookform/resolvers **5.9.1**, @upstash/redis **1.38.4**, @upstash/ratelimit **2.1.0**. ✔
- **package.json (final vs pre-batch snapshot — exactly 6 changed lines, i.e. only the authorized packages):** the 2 Group B lines (§5) + `@hookform/resolvers ^5.0.1→^5.9.1`, `@upstash/ratelimit ^2.0.5→^2.1.0`, `@upstash/redis ^1.34.8→^1.38.4`, `react-hook-form ^7.55.0→^7.88.0`. All remain caret-form except the next-auth exact pin (W4).
- **Lockfile keys:** Group C changed exactly the 4 direct keys (+ peer-suffix updates in the snapshot section: resolvers 5.9.1 carries peer suffixes `@standard-schema/spec@1.1.0`, `effect@3.16.8`, `zod@3.25.74` — **all three peer versions already existed in the graph**; no new key was added for them; the forced `@upstash/ratelimit@2.1.0 ↔ @upstash/redis@^1.38.2` peer is resolved by the pair). Zero unrelated movement.

## 9. Final complete-batch scope audit (vs pre-batch snapshots)

- **Authorized direct mutations: exactly the 6 packages.** Full packages-section + snapshots-section key diffs (pre → final) contain no other name@version changes beyond the §5 closure table.
- **Group A regression check: none.** `@radix-ui/react-label` = 2.1.15 (installed + lockfile); Group A spot-checks installed: @auth/prisma-adapter 2.11.3, tailwindcss 4.3.3, and the full key-diff contains zero Group A keys. Excluded framework packages unmoved: `next` 15.3.0, react 19.1.0, typescript 5.8.3, eslint 9.30.1, prisma/@prisma/client 6.11.1, zod 3.25.74, @tanstack/react-table 8.21.3, @tiptap/* 2.24.2, socket.io 4.8.1, framer-motion 11.18.2 (key-diff proven — none appear in the diff).

## 10. Package version before/after table

| Package | Before | After | Status |
|---|---|---|---|
| axios | 1.10.0 | **1.20.0** | updated (Group B) |
| next-auth | 5.0.0-beta.29 | **5.0.0-beta.32** | updated (Group B) |
| @auth/core (transitive) | 0.40.0 + 0.41.3 (two copies) | **0.41.3 (single copy)** | transitive, required by next-auth |
| react-hook-form | 7.60.0 | **7.88.0** | updated (Group C) |
| @hookform/resolvers | 5.1.1 | **5.9.1** | updated (Group C) |
| @upstash/redis | 1.35.1 | **1.38.4** | updated (Group C) |
| @upstash/ratelimit | 2.0.5 | **2.1.0** | updated (Group C) |
| @radix-ui/react-label (Group A) | 2.1.15 | 2.1.15 | unchanged ✔ |

## 11. Lockfile / transitive-change accounting

See §5 (Group B closure table — the only transitive changes in the whole batch) and §8 (Group C: none beyond direct keys + pre-existing peer suffixes). Net graph change: **827 → 826** packages-section keys (removed: `@auth/core@0.40.0`, `jose@6.0.11`, `oauth4webapi@3.5.5`; added: `agent-base@6.0.2`, `https-proxy-agent@5.0.1`; every other diff line is an in-place version change of an existing key). Raw key lists preserved at `snapshots/batch-1-groups-b-c/{lockfile-keys-before.txt,snapshot-keys-before.txt}`.

## 12. Typecheck comparison

Command: `pnpm exec tsc --noEmit --incremental false` → exit 2. Log: `snapshots/batch-1-groups-b-c/typecheck-after.log`.

**20 error lines vs the 21-line baseline:**

| Group | Baseline lines | Now | Classification |
|---|---|---|---|
| `src/actions/chat.ts` ×8 (TS2339 conversation/message) | 8 | 8, identical locations | unchanged baseline |
| `src/components/data-table-date-filter.tsx` ×2 (145, 168) | 2 | 2, identical | unchanged baseline |
| `src/components/sections/hero/default.tsx` ×1 (64, `"glow"`) | 1 | 1, identical | unchanged baseline |
| `src/components/ui/chart.tsx` ×8 (109, 114, 182×2, 260, 266, 278×2) | 8 | 8, identical | unchanged baseline |
| `src/lib/export.ts` ×1 (20) | 1 | 1, identical | unchanged baseline |
| `src/components/forms/project-form.tsx` ×1 (53, TS2769) | 1 | **0** | **FIXED BASELINE FAILURE** — eliminated by the Group C form-stack upgrade (react-hook-form 7.60.0→7.88.0 + @hookform/resolvers 5.1.1→5.9.1). Predicted by `BATCH-1-READINESS-AUDIT.md` §15: "if a group incidentally fixes baseline errors (e.g., resolvers 5.9.1 vs the project-form.tsx TS2769), record as fixed-baseline-failure". Not silently reinterpreted — recorded here. |

**NO-NEW-ERRORS: satisfied — 0 new, 19 unchanged, 1 fixed.** No source file was modified (git-proven); the fix is dependency-typing-driven, not a source-code fix.

## 13. Lint comparison

Command: `pnpm lint` (`next lint`) → exit 1. Log: `snapshots/batch-1-groups-b-c/lint-after.log`.

**Exactly the 2 baseline errors, identical locations and rules:** `src/components/chat/chat-widget.tsx:30:10` (`no-unused-vars`), `src/lib/socket.ts:45:67` (`no-explicit-any`). Classification: **unchanged baseline** (0 new, 0 fixed).

## 14. Targeted smoke results

All read-only; no network calls to Upstash/Redis; no credentials used; no permanent test files (scripts live in the snapshots dir as run records).

| Package | Resolution | Version | Load/entry smoke | Result |
|---|---|---|---|---|
| axios | ✔ | 1.20.0 | ESM import; `VERSION === '1.20.0'` | OK |
| next-auth | ✔ | 5.0.0-beta.32 | `next-auth/jwt` entry loads (`getToken` fn). Main entry blocked by `next/server` in plain Node — **environment limitation, control-proven** (§6) | OK (with W3 note) |
| @auth/core | ✔ (via next-auth closure) | 0.41.3 | version read through next-auth's store closure | OK |
| @auth/prisma-adapter | ✔ | 2.11.3 | imports; `PrismaAdapter` fn | OK |
| react-hook-form | ✔ | 7.88.0 | ESM import; `useForm` fn | OK |
| @hookform/resolvers | ✔ | 5.9.1 | `@hookform/resolvers/zod` entry loads (`zodResolver` fn — the project's consumption path) | OK |
| @upstash/redis | ✔ | 1.38.4 | import + `new Redis({url, token: placeholder})` constructed locally | OK |
| @upstash/ratelimit | ✔ | 2.1.0 | import + `new Ratelimit({ redis, limiter: slidingWindow(…) })` constructed locally | OK |

Prisma generate: **NOT run** — no Prisma package changed in this batch (verified), generated client intact. Database operations: **none**. Playwright: **not needed** (no browser-level regression observed).

## 15. Security verification

- **axios target reached:** 1.20.0 installed and locked (clears all recorded advisories: GHSA-fjxv-7rqg-78g4 critical via form-data; the ≥1.12/1.16/1.18 highs). Its security-relevant transitive positives landed: form-data 4.0.6, follow-redirects 1.16.0, proxy-from-env 2.1.0.
- **next-auth target reached:** 5.0.0-beta.32 installed and locked (clears GHSA-8fpg-xm3f-6cx3 critical fail-open, GHSA-xmf8-cvqr-rfgj high getToken, GHSA-7rqj-j65f-68wh critical email normalizer). Prerelease channel retained (beta.32 ≠ stable replacement). Prerelease-exception basis: this Command brief's explicit authorization.
- **@auth/core compatibility:** single copy 0.41.3, exactly what next-auth beta.32 pins and the adapter already required — the dual-copy topology (Group A F2) is resolved.
- **No stale versions selected:** lockfile contains no `axios@<1.20.0`, no `next-auth@beta.29`, no `@auth/core@0.40.0` (key-diff proven; store-level residue is inert — W1/W2).
- **`pnpm audit --registry=https://registry.npmjs.org`** (informational, read-only; log: `snapshots/batch-1-groups-b-c/audit-informational.log`): **zero findings for axios, next-auth, @auth/core, form-data, follow-redirects, react-hook-form, @hookform/resolvers, @upstash/redis, @upstash/ratelimit**. Remaining findings are the known deferred set (33× next → Batch 6; socket.io/ws/engine.io → dead chat subsystem per ADR; @tiptap/core → Tiptap 3 project; lodash-es/uuid/markdown-it-adjacent → cleanup batch; postcss/picomatch/minimatch/etc. → resolve via later batches). No upgrade was made on the audit's suggestion beyond the authorized scope.

## 16. SHA-256 hashes (before / after)

| File | Pre-batch | Post-batch |
|---|---|---|
| `package.json` | `f37daf37a697fe1551979e83edc5fd5eca9e55bae3e0c166b8daed7126af6098` | `13411e125dee53c71373c5821dd05d57a9d364264909c2f037f51f74ff40a44c` |
| `pnpm-lock.yaml` | `05f81e2356d70d9ddc3cb772d049040d9532650ecbd12928b163a30ea12a2669` | `23a620b1f1f177100071c5fbd71238e3baacae854aeceabf4fe7cf8afea966fa` |

`package-lock.json`: **ABSENT** before and after (verified). Byte snapshots retained for content-level rollback.

## 17. WIP preservation

- Post-batch `git status --short` = pre-flight standing set exactly (7 tracked entries + same untracked set; zero new tracked paths).
- `git diff --stat`: 7 files, +1390/−12,634 — same 7 files as the standing set. Non-package WIP unchanged from the recorded per-file numstat: `globals.css` 29/1, `icons.tsx` 2/0, `types/index.ts` 13/0, `page.tsx` 0/5, `package-lock.json` 0/11,566 (still deleted). `package.json`/`pnpm-lock.yaml` deltas = user WIP + the accounted batch changes only (diffed against snapshots above).
- **No** `git restore / reset / checkout / stash / clean / commit / push / branch / amend` used at any point. HEAD = `519a0026a75927a89cf2cadeedb313cfa26e4e21` before and after.
- Only repository additions: this evidence file + `snapshots/batch-1-groups-b-c/*` (inside the untracked `.agents/`).

## 18. Findings / warnings

- **W1 — orphaned virtual-store directories.** `node_modules/.pnpm/@auth+core@0.40.0_…`, the `next-auth@5.0.0-beta.29_…` store dir, and superseded versions of the Group C packages remain on disk with zero lockfile references (pnpm's known superseded-peer-dir behavior, same as micro-gate W1). Inert and ignored; not cleaned (out of scope). A future `pnpm install`/prune may remove them.
- **W2 — stale npm-era root `node_modules/@auth/core` real directory (0.40.0).** Not a pnpm symlink (pnpm does not manage root entries for non-direct deps); dated 2025-08-13, same artifact class as the pre-Gate-1 `node_modules/@prisma/client` leftover. **Inert for this codebase:** no `src/` file imports `@auth/core` directly (grep-proven), and the app's resolution paths go through next-auth's own closure (0.41.3). Reported for a future cleanup decision; not touched.
- **W3 — `next-auth` main entry does not import in bare Node.** `next/server` requires Next.js bundler/runtime export conditions; control-proven pre-existing behavior, not a batch regression. Auth verification therefore rests on the `next-auth/jwt` entry, the adapter, closure resolution, and the clean typecheck of all auth files.
- **W4 — manifest rewrite behavior (accepted):** `pnpm update pkg@<exact>` rewrote the six authorized specifiers (Group A §7 precedent). Nuance: the prerelease target was pinned **exactly** (`"next-auth": "5.0.0-beta.32"`) instead of caret-form — semantically stricter than the old `^5.0.0-beta.25` range (the old caret on a prerelease tuple could float within 5.0.0-beta.*; the pin holds beta.32 until deliberately moved). Recorded for future dependency governance.
- **W5 — `@upstash/redis` 1.39.0 exists.** pnpm noted it post-update. The authorized target is 1.38.4; no further update was made. Flagging for a possible future micro-gate if the human wants it.
- No regressions of any kind. Rollback: **not exercised** (no rollback condition met); pre-batch byte snapshots remain valid at `snapshots/batch-1-groups-b-c/`.

## 19. Exact commands executed (complete list)

```bash
# pre-flight (read-only)
git rev-parse HEAD; git status --short; node --version; pnpm --version
sha256sum package.json pnpm-lock.yaml
grep/lockfile + node version reads of the 8 targets and @auth/core
mkdir -p .agents/evidence/snapshots/batch-1-groups-b-c
cp package.json → package.json.pre; cp pnpm-lock.yaml → pnpm-lock.yaml.pre
awk key-extraction → lockfile-keys-before.txt, snapshot-keys-before.txt

# Group B (foreground)
pnpm update axios@1.20.0 next-auth@5.0.0-beta.32          # exit 0, 1m 0.2s

# Group B scope audit (read-only): manifest + lockfile key diffs vs snapshots; store closure inspection
node .agents/evidence/snapshots/batch-1-groups-b-c/auth-smoke.mjs   # auth/axios import smoke (read-only)

# Group C (foreground)
pnpm update react-hook-form@7.88.0 @hookform/resolvers@5.9.1 @upstash/redis@1.38.4 @upstash/ratelimit@2.1.0   # exit 0, 42.8s

# Group C + full-batch scope audit (read-only): diffs vs pre-batch snapshots
node .agents/evidence/snapshots/batch-1-groups-b-c/smoke-group-c.mjs   # Group C import/construct smoke (read-only)

# verification (read-only)
pnpm exec tsc --noEmit --incremental false   # exit 2 — 20 lines (log captured)
pnpm lint                                    # exit 1 — 2 errors (log captured)
pnpm audit --registry=https://registry.npmjs.org   # informational, read-only (log captured)

# final integrity (read-only)
git rev-parse HEAD; git status --short; git diff --stat; sha256sum package.json pnpm-lock.yaml
ls package-lock.json   # absent
```

**Not executed (explicit):** no generic `pnpm update`, no `--latest`, no `pnpm install` (separate), no `approve-builds`, no registry change, no background pnpm mutation, no Prisma operation of any kind, no database write, no source-code edit, no dependency removal, no Batch 2+ work.

## 20. Explicit statement of excluded work

- **Batch 2 and all later batches were NOT started:** no Next.js upgrade (15.5.25/16.3.5), no React/TypeScript-major/ESLint-major/Prisma/Zod/Tiptap/TanStack/react-day-picker movement, no `@upstash/redis` 1.39.0, no dependency removals/cleanup, no chat-ADR work.
- **No source-code fixes** (including the fixed `project-form.tsx` error — it resolved via dependency typing; the file is untouched).
- **No commit, no push, no branch creation, no amend, no reset/restore/stash/clean. No database or schema operation.**
- `BATCH-1-GROUP-A-RESULT.md` and `BATCH-1-REACT-LABEL-RESULT.md` were **not modified**.

## 21. Batch 1 closure assessment

Groups A (34/34) + B (2/2 + justified transitive @auth/core) + C (4/4) are complete: **40 authorized items done, 0 skipped, 0 outstanding**. Baselines hold (typecheck improved 21→20 by a fixed-baseline failure; lint unchanged). **Batch 1 is ready to close.**
