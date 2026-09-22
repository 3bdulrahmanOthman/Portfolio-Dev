# Batch 0 Readiness Audit

## 1. Audit Metadata

- **Date:** 2026-09-20 · **Mode:** READ-ONLY (Command 3)
- **Question answered:** *Is the repository actually ready for Batch 0, and what exact read/write surface will Batch 0 have?*
- **Output artifact:** this file (only file created by this command).
- **Batch 0 was NOT executed.** No installs, no generation, no deletions, no commits.
- **Baseline at audit time:** HEAD `519a002` on `main`; `origin/main` = `8afe042` (branch 10 commits ahead); 7 tracked files with pre-existing user changes (+151/−11,567); Agent OS files untracked by design.

## 2. Governing Documents

Read and applied as binding: `AGENTS.md`; `policies/{APPROVALS,VERIFICATION,DATABASE,GIT,SECURITY,CONTEXT,DOCUMENTATION}.md`;
`versioning/{VERSION-POLICY,UPGRADE-WORKFLOW,CURRENT-BASELINE,TARGET-POLICY}.md`;
`evidence/{DISCOVERY-BASELINE,DEPENDENCY-UPGRADE-AUDIT}.md`;
`workflows/{READ-ONLY-AUDIT,DEPENDENCY-UPGRADE}.md`.
No workflow was invented; this audit follows `workflows/READ-ONLY-AUDIT.md`.

## 3. Read-Only Boundary

Commands executed were restricted to: Git inspection (`status`, `diff`, `ls-files`, `rev-parse`, `cat-file`, `show`),
version queries (`node --version`, `pnpm --version`, `npm --version`), registry config reads (`npm config get registry`,
`pnpm config get registry`), text/JSON parsing of manifests and lockfiles, grep over tracked files,
`prisma validate`, `tsc --noEmit --incremental false`, `next lint` (proven non-mutating — see §13),
and `pnpm audit` with an **ephemeral** registry override (no persistent configuration change — see §16).
All mutating commands listed in the command brief were **not** run. Post-run `git status` proved the tree unchanged (§27).

## 4. Repository State

- `git status --short`: 7 modified/deleted tracked files (`package-lock.json`, `package.json`, `pnpm-lock.yaml`,
  `src/app/globals.css`, `src/components/icons.tsx`, `src/types/index.ts`, deleted `src/app/page.tsx`) — **pre-existing user work**;
  untracked: `.agents/` (39 files incl. this directory), `AGENTS.md`, `CLAUDE.md`, landing-page WIP,
  `public/*.webp`, `.stfolder/`, `.sync/`, `portfolio-dev.zip`.
- `git diff --stat`: 7 files changed, 151 insertions(+), 11,567 deletions(-).
- `git diff -- package.json pnpm-lock.yaml package-lock.json`: package.json = user added 2 Radix deps;
  pnpm-lock.yaml = user added ~104 lines (lockfile re-resolution for those deps);
  package-lock.json = **full npm lockfile (416,756 bytes at HEAD, 11,566 lines) replaced by a 6-line stub** in the working tree.
- `git ls-files --others` also reveals `.sync/Archive/node_modules/**` — Syncthing archived a previous
  `node_modules` (including an old `.prisma/client`). Not live; evidences a machine-sync history for
  `node_modules`, relevant to the mixed-installer findings.

## 5. Package Manager Readiness

1. Declared PM: **pnpm 10.9.0** via `packageManager` field with sha512 integrity hash (`package.json:116`).
2. pnpm 10.9.0 installed and active; npm 11.9.0 also present; **corepack NOT available** on this machine.
3. Lockfile version: **9.0** (`pnpm-lock.yaml`).
4. **Lockfile ↔ package.json: fully coherent** — all 97 direct dependencies' specifiers match the
   lockfile `importers.` block exactly (0 mismatches, 0 missing, 0 extra) — script-checked 2026-09-20.
5. `package-lock.json`: tracked; HEAD copy is a real npm lockfile; working-tree copy is a genuine empty
   stub (`lockfileVersion: 3`, `packages: {}`).
6. No repository file invokes npm: grep over README/.agents found only *evidence* mentions of
   `package-lock.json`, no instructions. README uses `pnpm install` / `pnpm dev` only (README.md:68,92).
7. No CI/deploy/Docker configs exist (no `.github/`, no Dockerfile) — nothing references npm.
8. **No repo-level `.npmrc`** — both `npm config get registry` and `pnpm config get registry` resolve to
   `https://registry.npmmirror.com` via **user-level** configuration.
9. No `pnpm-workspace.yaml` — single-package repo.
10. Yes: `packageManager` pin + coherent `pnpm-lock.yaml` + README instructions are sufficient to
    establish pnpm as canonical.
11. Removing `package-lock.json` is a **tracked-file deletion** → visible in `git status`, needs a commit
    to become permanent; no tooling depends on it (see §15/§17).
12. No documentation instructs npm usage (README is pnpm-only).

## 6. Lockfile Integrity

`package.json → pnpm-lock.yaml` chain is **coherent** (§5.4). `pnpm-lock.yaml → node_modules` is **NOT**:

| Package | Lockfile resolves | Installed today | Δ |
|---|---|---|---|
| prisma / @prisma/client | 6.11.1 | 6.15.0 | node_modules NEWER |
| typescript | 5.8.3 | 5.9.2 | NEWER |
| react / react-dom | 19.1.0 | 19.1.1 | NEWER |
| @tiptap/* | 2.24.2 | 2.26.1 | NEWER |
| @hookform/resolvers | 5.1.1 | 5.2.1 | NEWER |
| react-hook-form | 7.60.0 | 7.62.0 | NEWER |
| axios | 1.10.0 | 1.11.0 | NEWER |
| zod | 3.25.74 | 3.25.76 | NEWER |
| eslint | 9.30.1 | 9.34.0 | NEWER |
| tailwindcss / @tailwindcss/postcss | 4.1.11 | 4.1.12 | NEWER |
| recharts | 3.0.2 | 3.1.2 | NEWER |
| motion | 12.23.0 | 12.23.12 | NEWER |
| nuqs / sonner / uploadthing / Radix (25) / @types/* | older minors | newer minors | NEWER |

**Consequence:** the last install did not come from the current `pnpm-lock.yaml` (consistent with the
mixed npm/pnpm artifacts and the Syncthing archive). A clean install from the lockfile will
**downgrade `node_modules` to lockfile resolutions**. That is the intended meaning of "install strictly
from `pnpm-lock.yaml`", but it **changes the runtime tree that the recorded verification baseline was
measured on** — the baseline must be re-recorded *after* Batch 0's install (§13, §25).

Four-state distinction (example: Prisma): declared `^6.11.1` → lockfile-resolved `6.11.1` →
installed `6.15.0` → generated artifact produced against the installed tree (see §8).

## 7. Node / Runtime Readiness

1. Current runtime: **Node v25.9.0** (EOL since 2026-06-01 — Phase 2 finding, unchanged).
2. Declared runtime: **none** (no `engines`, no `.nvmrc`, `.node-version`, `.tool-versions`, Volta, Dockerfile, CI).
3. Recommended (Phase 2): Node 24 LTS.
4. Node 24 configured anywhere: **no**.
5. Node 25 hardcoded anywhere: **no** (nothing declares any Node version).
6. Is a Node change required *before* Batch 0: **technically no** — pnpm 10.9.0 runs on the current
   Node; no `engines` gate exists. It is a strongly recommended parallel human action, not a blocker.
7. pnpm 10.9.0 + Node 24: compatible per pnpm 10.x support policy
   (UNKNOWN — REQUIRES VERIFICATION DURING APPROVED EXECUTION if Node 24 is adopted first).
8. Corepack: not available; the `packageManager` pin is enforced only by human discipline today.
9. **Reproducible toolchain: NOT established** — no Node pin exists anywhere. Recommendation stands to
   add `engines` (+ optionally a version file) in a later gated batch; out of Batch 0 scope.

## 8. Prisma Generate Readiness

Evidence: `prisma/schema.prisma` (generator `prisma-client-js`, `output` line **commented out** → default
location), `src/lib/db/prisma.ts` (`@prisma/client/edge` + `withAccelerate()`), `package.json:10`
(`"postinstall": "prisma generate"`), `.gitignore:44` (`generated/prisma/` — an unused ignore entry).

1. Prisma version: declared `^6.11.1`; lockfile-resolved **6.11.1**; installed **6.15.0** (§6).
2. Generator: `prisma-client-js` (legacy; Prisma 7 will replace it — out of Batch 0 scope).
3. Generated client location: `node_modules/.prisma/client` + re-exports in `node_modules/@prisma/client`
   (default, because `output` is commented out).
4. Tracked? **No** — `node_modules/` is gitignored entirely.
5. Ignored? **Yes.**
6. Stale? **REVISED FINDING:** the generated client at `node_modules/.prisma/client` contains a
   `schema.prisma` copy with **all five current models** (User, About, Project, Category, Contact) —
   the Phase 0 "stale client" hypothesis is **doubtful**. The TS2694 error cluster (`UserCreateInput`,
   `ProjectWhereInput` missing from the generated namespace) currently has an **UNKNOWN cause** —
   candidate explanations: type-resolution mismatch between the npm-generated top-level
   `node_modules/@prisma/client` (real directory, 6.15.0) and the pnpm store's `@prisma+client@6.11.1`,
   or partial generation. UNKNOWN — REQUIRES VERIFICATION DURING APPROVED EXECUTION (re-run tsc after
   Gate 1's clean install + regeneration).
7. `prisma generate` will: re-create `node_modules/.prisma/client` (+ possibly download a query engine
   if missing → network) and rewrite `node_modules/@prisma/client` re-exports. **No tracked file changes.**
8. Database connectivity: **not required** — generation parses the schema; it does not evaluate
   `env("DATABASE_URL")` or open connections.
9. Secrets: the Prisma CLI loads `.env` when invoked (standard dotenv behavior); generation itself needs
   no secret values.
10. Seed execution: **no** — `prisma generate` never runs `prisma/seed.ts`.
11. Yes — `postinstall` invokes it (§9), so a clean install auto-generates.
12. Safe as an isolated operation: yes, but it is **coupled** to the install via postinstall unless
    `--ignore-scripts` is used (not recommended — it would leave the client stale).
13. Reproducible: yes for a given (CLI version, schema, engines) triple; the CLI version will be
    **6.11.1 after the lockfile reinstall** (currently generated under 6.15.0).
14. Without changing app source/config: **yes**.
15. Separate gate from lockfile normalization: **not meaningfully separable** — see §9/§22 recommendation.

## 9. Lifecycle Script Analysis

Observed chain (`package.json` scripts — the only lifecycle script is `postinstall`):

```
pnpm install
   → dependency resolution from pnpm-lock.yaml (frozen if --frozen-lockfile)
   → node_modules rebuild (pnpm virtual store + symlinks)
   → project lifecycle scripts (pnpm runs the project's own scripts by default;
     dependency scripts are blocked unless allow-listed — none are configured)
   → "postinstall": "prisma generate"
   → node_modules/.prisma/client regenerated
```

- `pnpm install` **does** invoke `postinstall` → generation occurs automatically during a clean install.
- Therefore **Unit A (reinstall) and Unit B (generate) are inseparable by default.** Separating them
  would require `--ignore-scripts` (leaves the client stale → worse state) — not recommended.
- Network access during install: registry fetches via configured mirror; `prisma generate` may fetch an
  engine binary if absent from the store.
- Scripts do not modify tracked files and execute no application code beyond Prisma CLI generation.

## 10. Environment and Secret Safety

- `.env` exists (gitignored) with variables: `DATABASE_URL`, `NEXTAUTH_URL`, `AUTH_SECRET`,
  `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `UPLOADTHING_TOKEN`, `UPSTASH_REDIS_REST_URL`,
  `UPSTASH_REDIS_REST_TOKEN`. **Values not read or recorded.**
- No `.env.example` / `.env.local.example` exists (documentation gap — noted, not fixed).
- Requirements classification:
  | Operation | Needs secrets? | Needs DB? |
  |---|---|---|
  | `pnpm install` (Unit A) | No | No |
  | `prisma generate` (Unit B) | No (CLI loads `.env`; generation does not evaluate `DATABASE_URL`) | No |
  | `pnpm audit` (Unit C) | No | No |
  | Baseline checks (`prisma validate`, `tsc`, `next lint`) | No execution against DB | No |
  | dev/build/runtime (out of Batch 0 scope) | Yes | Yes (via Accelerate) |
- **Batch 0 can operate without production credentials.** No secret exposure is required to proceed.

## 11. Database Safety

Batch 0 operations, explicitly distinguished:

| Concern | Install (A) | Generate (B) | Audit (C) | Baseline checks (D) |
|---|---|---|---|---|
| Schema/client generation | triggers via postinstall | **yes** | no | no |
| Database connection | **no** | **no** | no | no (`prisma validate` parses the schema file only) |
| Database mutation | **no** | **no** | no | no |
| Migration logic | **no** | **no** | no | no |
| Seed execution | **no** | **no** (postinstall is `prisma generate`, not `prisma seed`) | no | no |
| App code that contacts DB | **no** (no app code runs) | **no** | no | no |

Batch 0 has **zero database surface**, under the current generator (`prisma-client-js` with commented-out
`output`) and current scripts. This satisfies `policies/DATABASE.md` without any DB gate being required.

## 12. Current Baseline

Re-produced today (2026-09-20) with proven non-mutating commands:

| Check | Command | Result today | Phase 0 record |
|---|---|---|---|
| Prisma schema | `pnpm exec prisma validate` | **PASS** (schema valid; CLI prints an update banner) | PASS |
| Typecheck | `pnpm exec tsc --noEmit --incremental false` | **FAIL — 25 error lines** (same clusters: TS2694 Prisma namespace, implicit-any, zod↔resolvers, Recharts, `"glow"` variant, `lib/export.ts`) | FAIL — ~27 |
| ESLint | `pnpm lint` (`next lint`) | **FAIL — 2 errors** (`chat-widget.tsx:30`, `lib/socket.ts:45`) | FAIL — 2 |
| Tests | — | NOT AVAILABLE | NOT AVAILABLE |
| Build | `next build` | **NOT EXECUTED — MUTATING / UNSAFE FOR READ-ONLY AUDIT**; also not a trusted gate (`next.config.ts` ignores TS/ESLint errors) | NOT RUN |
| Generated client freshness | file inspection (no write) | Contains all 5 current models; TS2694 cause UNKNOWN (§8.6) | "stale" hypothesis |

Git: unchanged throughout (§27). Dependencies: declared = lockfile specifiers (97/97); installed ≠
lockfile resolutions (§6) — this is the coherence gap Batch 0's install will close.

## 13. Verification Command Safety

| Command | Read-only? | Writes files? | Safe for audit? | Notes |
|---|---:|---:|---:|---|
| `git status/diff/ls-files/rev-parse/cat-file/show` | Yes | No | Yes | — |
| `node/pnpm/npm --version` | Yes | No | Yes | — |
| `npm/pnpm config get registry` | Yes | No | Yes | — |
| `pnpm exec prisma validate` | Yes | No | Yes | Parses `prisma/schema.prisma` only |
| `pnpm exec tsc --noEmit --incremental false` | Yes | No (`--incremental false` suppresses `.tsbuildinfo`) | Yes | Required because tsconfig has `incremental: true` |
| `pnpm lint` (`next lint`) | Yes* | No (verified: no `.eslintcache`, no `.next` writes observed) | Yes | Deprecated command; do not add `--cache` |
| `pnpm audit --registry=https://registry.npmjs.org` | Yes | No | Yes | Ephemeral override; sends lockfile metadata to npmjs audit endpoint |
| `next build` | No | **Yes** (`.next/`) | **No** | NOT EXECUTED — MUTATING / UNSAFE FOR READ-ONLY AUDIT |
| `pnpm install` | No | Yes (`node_modules`, possibly lockfile) | **No** | Batch 0 Gate 1 territory |
| `prisma generate` | No | Yes (generated client) | **No** | Batch 0 Gate 1 territory (auto-runs via postinstall) |
| `tsc --noEmit` (without `--incremental false`) | No | Yes (`.tsbuildinfo`) | No | Never run bare |
| `eslint --fix`, formatters, codemods | No | Yes | **No** | Prohibited |

None of the "Yes" rows were executed merely because they appear here — they **were** executed and are
part of this audit's evidence; the "No" rows were not executed.

## 14. Git / Rollback Readiness

1. Clean rollback point: **partial**. HEAD (`519a002`) is a valid anchor, but the files Batch 0 touches
   (`package.json`, `pnpm-lock.yaml`, `package-lock.json`) **carry uncommitted user changes** —
   `git restore` on them would **destroy user work**.
2. Branch is 10 commits ahead of `origin/main` — unpushed history exists.
3. Uncommitted user changes: yes (7 tracked files + untracked WIP).
4. Agent OS files: untracked by design (39 files so far).
5. Batch 0 isolation from user work: **impossible at the file level** for the three package files —
   Batch 0's whole purpose is to finish the PM transition *those user changes started*. Isolation is
   achievable at the *content* level: record pre-state (SHA-256 hashes + copies of the three files
   stored outside the repo or in evidence) so Batch 0 can be reverted content-wise without `git restore`.
6. Should a commit be required before Batch 0: **recommended for the human to decide** — committing the
   user's PM-transition WIP first would give Batch 0 a clean rollback anchor. The Agent OS cannot and
   does not authorize or create that commit (`policies/GIT.md`; approval gates #17).
7. Creating such a commit is **not currently authorized** — it requires an explicit human decision.

## 15. package-lock.json Analysis

- **Tracked:** yes (`git ls-files`); working-tree state **modified** (stub vs 416,756-byte HEAD lockfile).
- **Referenced anywhere:** no — grep over README, `.agents/`, configs, scripts found no *instructional*
  use; only Agent OS *evidence* documents mention it. No CI (none exists), no deployment configs.
- **Required by hosting platforms:** Vercel and similar detect the PM via `packageManager`/lockfile
  presence; with `pnpm-lock.yaml` + `packageManager` present, `package-lock.json` is not required.
  (UNKNOWN — platform behavior should be confirmed at deploy-config time; no deploy config exists.)
- **Genuinely empty/stub:** yes in the working tree (`lockfileVersion: 3`, `"packages": {}`).
- **Safe to remove at repository level:** yes — with the caveat that it is a **tracked deletion**, so the
  removal is a normal Git change requiring a (human-approved) commit to persist, and the pre-Batch-0
  working-tree state of that file is itself user-modified (the stub is uncommitted user work — deleting
  the file supersedes the user's stub edit; this must be an acknowledged human decision).

## 16. Registry / Audit Readiness

- Configured registry (user-level, not repo): `https://registry.npmmirror.com` for both npm and pnpm.
  No repo `.npmrc`; no environment overrides found in the repo.
- npmmirror **does not implement the audit endpoint** (`ERR_PNPM_AUDIT_ENDPOINT_NOT_EXISTS`, observed
  Phase 2).
- **Working ephemeral override (verified today, no persistent config change):**
  `pnpm audit --registry=https://registry.npmjs.org` — and equivalently
  `npm_config_registry=https://registry.npmjs.org pnpm audit`.
- `pnpm audit` behavior: contacts the audit endpoint with lockfile metadata; **writes no files; does not
  alter lockfiles**; results are reliable (npmjs advisory DB).
- **Audit executed today as evidence (READ-ONLY): 140 advisories — 8 critical, 71 high, 56 moderate,
  5 low** against the lockfile-resolved tree. Direct-dependency highlights (full list recorded in the
  command transcript; key items):
  - `next` 15.3.0: **critical RCE in React flight protocol** (patched ≥ 15.3.6), server-actions source
    exposure (≥ 15.3.7), DoS (≥ 15.3.9), middleware/proxy bypasses (≥ 15.5.16/18), and **two criticals
    patched only ≥ 15.5.24** — one of them *"Unauthenticated Remote Code Execution on windows-hosted
    servers"* (GHSA-p293-qw3h-jr36) — **this development machine is Windows**; deployment platform is
    unconfirmed. Security floor for `next`: **≥ 15.5.24** to clear all criticals.
  - `next-auth` 5.0.0-beta.29: critical ×2 (fail-open existence checks; email normalizer) + high
    (`getToken()`) + moderate — all patched in **≥ 5.0.0-beta.32** (via `@auth/core` ≥ 0.41.3).
  - `axios` (lockfile 1.10.0 / installed 1.11.0): 20+ advisories incl. highs; patched ≥ 1.18.0 (target 1.20.0).
  - `@tiptap/core` 2.x: moderate proto-pollution via `mergeAttributes` — **no 2.x fix; patched only in
    ≥ 3.30.4** (strengthens the Tiptap 3 migration case).
  - Transitive: `form-data` (critical, via axios, ≥ 4.0.4), `tar`, `js-yaml`, `minimatch`, `brace-expansion`,
    `picomatch`, `postcss`, `sharp`, `ws`, `engine.io`/`socket.io-parser` (dead code), `nanoid`, `flatted`,
    `linkify-it`, `lodash-es` (high — package is unused → removal resolves it), `uuid` (moderate — unused
    → removal resolves it), `@eslint/plugin-kit`, `effect`, `follow-redirects`, `mdast-util-to-hast`,
    `markdown-it`, `ajv`, `@humanfs/node`.
- No repair command was run (`npm audit fix` prohibited).

## 17. Security Readiness

Reconciled with the actual tree; classified per the command brief:

| Finding | Class | Basis |
|---|---|---|
| Next 15.3.0 < 15.3.6 — RCE (React flight protocol), critical | **Confirmed vulnerability** (version in range; advisory GHSA-9qr9-h5gf-34mp) | pnpm audit vs lockfile |
| Next < 15.5.24 — two criticals incl. Windows-hosted unauthenticated RCE | **Confirmed vulnerability** for any Windows-hosted deployment; **potential exposure** if deployment is Vercel-only (platform unconfirmed) | GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4 |
| next-auth beta.29 < beta.32 — fail-open auth checks (critical), getToken() (high) | **Confirmed vulnerability** (JWT credentials flow uses these paths) | GHSA-8fpg-xm3f-6cx3, GHSA-xmf8-cvqr-rfgj |
| axios < 1.18 — multiple high/moderate (SSRF, prototype pollution, DoS) | **Low-exploitability finding** — repo's only axios usage is error typing in `lib/handle-error.ts`; no request execution found | GHSA set §16 |
| Tiptap 2.x mergeAttributes proto-pollution (moderate, no 2.x fix) | **Potential exposure** — editor is admin-facing; fix only in 3.30.4 | GHSA-cp6q-959q-f8rh |
| Node 25.9.0 EOL; Node 20 types | **Support/EOL finding** | nodejs.org (Phase 2) |
| next-auth on beta channel (indefinitely) | **Migration risk** | Phase 2 |
| socket.io/engine.io/ws advisories | **Low-exploitability** — dead code, unreachable | import scan (§20) |
| Transitive set (tar, js-yaml, minimatch, …) | Confirmed in tree; exposure varies; resolved by framework/lockfile refresh in later batches | pnpm audit |

No overstatement: "confirmed" means the installed/lockfile version is inside an advisory's vulnerable
range — not that exploitation was demonstrated.

## 18. Dead Dependency Recheck

Phase 2 candidates re-examined **beyond `src/`** (configs, CSS, dynamic imports, `prisma/`, scripts):

| Package | Verdict | Evidence |
|---|---|---|
| `install` | **Confirmed unused** (junk meta-package, engines `>=0.10`) | No imports anywhere; accidental install |
| `jotai` | **Confirmed unused** | No imports in ts/tsx/css/json/configs |
| `shiki` | **STILL ACTIVE — Phase 2 correction** | **Dynamic import**: `src/components/animate-ui/code-editor.tsx:75` `await import('shiki')` |
| `uuid` | **Confirmed unused** | No static or dynamic imports |
| `lodash-es` (+@types) | **Confirmed unused** | No imports; carries a high advisory → removal resolves it |
| `react-colorful` | **Confirmed unused** | No imports |
| `react-markdown` / `remark-gfm` | **Confirmed unused** | No imports (possibly reserved for a future chat feature — note for the chat ADR) |
| `tailwind-scrollbar-hide` | **STILL ACTIVE — Phase 2 correction** | **Tailwind v4 plugin**: `src/app/globals.css:3` `@plugin "tailwind-scrollbar-hide"` |
| `framer-motion` | **Probably unused** (dead-code dependent) | Only `src/components/chat/chat-widget.tsx` — chat widget is unreachable (§20) |
| `socket.io` | **Probably unused** (dead-code dependent) | Only `src/lib/socket.ts`, which nothing imports (§20) |

Method note: static grep alone was insufficient (two false "dead" verdicts corrected via dynamic-import
and CSS-plugin scans). Remaining removal candidates need no runtime verification beyond the chat ADR.

## 19. Next.js / Auth Interaction

1. Architecture: `src/middleware.ts` wraps Auth.js — `const { auth } = NextAuth(authConfig); export default auth((req) => …)`
   with matcher `["/admin/:path*", "/auth/:path*"]`; `src/auth.ts` instantiates the full Auth.js config
   (adapter, JWT callbacks); `src/auth.config.ts` holds the credentials provider (edge-safe subset).
2. Next 16's `middleware.ts` → `proxy.ts` rename **directly affects authentication**: the file being
   renamed is the auth gate itself.
3. The wrapper uses only the Next middleware API surface (`NextAuth(authConfig)` + `auth((req)=>…)` +
   `Response.redirect`) — no other middleware-specific APIs detected; the rename + codemod is expected to
   be mechanical, but **any regression here is an auth bypass**, so it is treated as security-sensitive.
4. Browser verification required after the framework upgrade: login (valid + invalid credentials),
   logged-in redirect away from `/auth/login`, `/admin/*` access with and without session,
   callbackUrl handling, logout, admin upload flow, public pages.
5. **Yes — its own approval gate** (policies/APPROVALS.md #9/#11) inside framework Batch 6c.

## 20. Chat Subsystem Isolation

- `ChatWidget` is exported (`chat-widget.tsx:24`) but **imported nowhere** outside `src/components/chat/`.
- `src/lib/socket.ts` is **imported nowhere**.
- `socket.io` and `framer-motion` are therefore reachable only from dead code; `react-markdown`/
  `remark-gfm` appear reserved for the same feature.
- The subsystem is **genuinely dead** but its removal is an **architectural decision** (ADR pending —
  `adr/README.md` open-decisions list).
- **Batch 0 must remain completely independent of that decision** — confirmed: Batch 0's surface
  (lockfiles, `node_modules`, generated client) does not intersect chat code. No action needed.

## 21. Batch-0 Impact Model

Predicted impact per operation (`—` = no change):

| Operation | Files changed | Files generated | Tracked impact | Network | DB | Rollback | Verification |
|---|---|---|---|---|---|---|---|
| **A1: `pnpm install --frozen-lockfile`** (clean reinstall from lockfile) | none tracked; `node_modules/**` rebuilt (**downgrades** per §6); `node_modules/.prisma/client` regenerated via postinstall | generated client | none | registry + possible engine download | none | restore `node_modules` content from pre-state copy (or accept re-install); lockfile untouched by `--frozen-lockfile` | fresh baseline (§13 commands) + tracked-file diff must be empty |
| **A2: delete `package-lock.json`** | 1 tracked deletion | — | deletion visible in git status | none | none | `git checkout -- package-lock.json` (restores HEAD version — but working-tree pre-state is the user's stub! content-backup needed) | `git status` shows `D` only for this file |
| **C: `pnpm audit --registry=…`** | — | — | none | npmjs audit endpoint | none | n/a (read-only) | advisory report recorded |
| **D: baseline re-record** | — | — | none | none | none | n/a (read-only) | evidence file under `.agents/evidence/runs/` |

Scenarios:

- **Scenario A (lockfile normalization only):** A1 (+A2?) — node_modules churn; baseline will likely
  shift (downgraded packages) — must be re-measured, and the delta explained.
- **Scenario B (A + explicit `prisma generate`):** identical to A — generate already runs via
  postinstall; a second explicit run is a no-op safety step.
- **Scenario C (audit only):** read-only; already executed as evidence today.
- **Scenario D (all together):** A + C + D; the audit's advisory set reflects the lockfile tree and will
  not change until later upgrade batches.

## 22. Batch-0 Splitting Recommendation

**Split into two executing gates + one no-gate step:**

- **Gate 1 — Install normalization** (Units A1+B, inseparable): `pnpm install --frozen-lockfile`
  (rebuilds node_modules at lockfile resolutions, auto-regenerates the Prisma client) + fresh baseline
  re-record. HIGH-RISK WRITE (rebuilds the runtime tree; shifts the verification baseline).
- **Gate 2 — package-lock.json deletion** (Unit A2): tracked-file deletion superseding the user's
  uncommitted stub edit; needs its own approval and belongs to a human decision about committing.
- **Unit C (audit): no gate** — READ-ONLY; already executed today and recorded as evidence (§16).

Rationale: A and B cannot be separated technically (postinstall), while A2 is trivially separable,
touches a tracked file, and interacts with the user's uncommitted stub edit — mixing it into Gate 1
would make Gate 1's verification (tracked diff must be empty) impossible.

## 23. Readiness Classification

| Area | Classification | Note |
|---|---|---|
| Git safety | **READY WITH CONDITION** | content-level pre-state backup required (files carry user WIP) |
| pnpm canonicalization | **READY** | pin + coherent lockfile + pnpm-only docs |
| Lockfile integrity | **READY WITH CONDITION** | package.json↔lockfile coherent; install will *downgrade* node_modules to lockfile state (expected, must be stated in the gate) |
| Node runtime | **REQUIRES HUMAN DECISION** | EOL Node 25 locally; Batch 0 technically runs anyway |
| Prisma generation readiness | **READY WITH CONDITION** | safe/ignored/no-DB; TS2694 cause UNKNOWN → verify after Gate 1 |
| Environment safety | **READY** | no secrets or DB needed |
| Lifecycle-script safety | **READY** | single postinstall → generate; chain documented |
| Database safety | **READY** | zero DB surface |
| Audit registry | **READY** | ephemeral npmjs override verified; 140 advisories recorded |
| Baseline verification | **READY** | safe command set proven |
| package-lock removal | **READY WITH CONDITION** | tracked deletion superseding user's stub edit |
| Rollback capability | **NOT READY (as-is)** → **READY WITH CONDITION** | git-restore would hit user WIP; content backup required first |
| User-work isolation | **REQUIRES HUMAN DECISION** | commit-before-Batch-0 question |

## 24. Required Human Decisions

1. **Node runtime:** switch the local machine to Node 24 LTS before Batch 0 (recommended; machine action,
   not agent action), or proceed on EOL Node 25.
2. **package-lock.json deletion:** approved as Gate 2? (It supersedes the user's own uncommitted stub edit.)
3. **Clean pnpm reinstall:** approved as Gate 1, including the documented **downgrade of `node_modules`
   to lockfile resolutions** and the resulting baseline shift?
4. **Prisma generation:** accepted as inseparable from Gate 1 via `postinstall` (recommended), or force
   `--ignore-scripts` (not recommended — leaves the client stale)?
5. **Security audit registry:** approve the ephemeral `--registry=https://registry.npmjs.org` override for
   audit runs (no persistent config change). Already demonstrated read-only today.
6. **Pre-Batch-0 commit:** the human may commit their PM-transition WIP first to create a clean rollback
   anchor (recommended). Agents cannot create it without authorization.
7. **Batch 0 split:** approve the two-gate split (§22) or the original single-batch composition.
8. **Additional prerequisite:** none identified — no secrets, DB, or new tooling required.

## 25. Proposed Batch-0 Execution Contract

> **PROPOSED — NOT AUTHORIZED FOR EXECUTION**
> A later human approval must authorize this contract explicitly, per-gate.

**Objective:** establish a trustworthy, pnpm-canonical install state and a fresh verification baseline,
without touching any tracked file's content (Gate 1) and removing the dead npm lockfile (Gate 2).

### 25.1 Preconditions
- Working tree matches the recorded pre-state (7 modified tracked files, unchanged).
- Pre-state backup taken: SHA-256 hashes + byte copies of `package.json`, `pnpm-lock.yaml`,
  `package-lock.json` stored under `.agents/evidence/runs/` (allowed artifact of the approved task).
- Human decisions 1–7 (§24) answered; Gate 1 and Gate 2 approvals granted separately.
- This audit file exists as evidence.

### 25.2 Allowed Changes
- Gate 1: `node_modules/**` (rebuild to lockfile resolutions incl. downgrades); `node_modules/.prisma/client`
  (regeneration via postinstall). Nothing else.
- Gate 2: deletion of `package-lock.json` only.
- New evidence files under `.agents/evidence/` (run records, baseline record).

### 25.3 Forbidden Changes
- Any tracked file's content (package.json, pnpm-lock.yaml must remain byte-identical — `--frozen-lockfile`).
- Any file under `src/`, `prisma/`, `public/`, `.agents/` (except evidence), configs, `.env*`.
- Any install/add/remove/update beyond the frozen reinstall; any lockfile regeneration.
- Any Prisma command beyond `generate` (no migrate/push/pull/seed/format/db operations).
- Any commit, push, stash, reset, restore, clean.
- Any chat/socket/dead-code modification.

### 25.4 Proposed Commands
- Gate 1: `pnpm install --frozen-lockfile` → then verification set below.
- Gate 1 (safety): explicit `pnpm exec prisma generate` only if postinstall generation is skipped/failed.
- Gate 2: `git rm package-lock.json` (staged deletion; commit only if separately authorized).
- Unit C (already executed read-only; re-runnable at will): `pnpm audit --registry=https://registry.npmjs.org`.
- Forbidden: `pnpm install` without `--frozen-lockfile` (would rewrite the lockfile), `pnpm update/add/remove`,
  `npm *` install/update/audit-fix, `prisma migrate|db push|db pull|db pull|seed|format`, `next build`,
  codemods, formatters.

### 25.5 Verification
- After Gate 1: (a) `git status --porcelain` — tracked-file set identical to pre-state (zero new/changed
  tracked entries); (b) fresh baseline: `prisma validate` (PASS expected), `tsc --noEmit --incremental false`,
  `pnpm lint`; (c) **NO-NEW-ERRORS comparison against today's baseline (25 TS error lines / 2 lint
  errors)** — *baseline shift is expected and acceptable if fully enumerated and classified*
  (downgraded packages may change counts in either direction; every delta gets a failure-classification
  record per `policies/VERIFICATION.md`); (d) `node -p "require('./node_modules/@prisma/client/package.json').version"`
  → 6.11.1 (lockfile state) as install-integrity evidence.
- After Gate 2: `git status` shows exactly `D package-lock.json`.
- Audit (Unit C): advisory report stored under `.agents/evidence/runs/`.

### 25.6 Rollback
- Gate 1: no tracked changes to revert; `node_modules` is reproducible by re-running the same command;
  if the tree must return to *today's* (newer) state, that is impossible from the lockfile — the
  pre-state backup records the fact, and the previous tree is only restorable via a fresh non-frozen
  install (which rewrites the lockfile → prohibited without a new gate). **This irreversibility is
  explicitly part of the gate decision.**
- Gate 2: restore `package-lock.json` from the pre-state byte copy (content-level; NOT `git restore`,
  which would resurrect HEAD's full npm lockfile and clobber the user's stub edit).

### 25.7 Failure Conditions (stop and report; no auto-repair)
- `pnpm install --frozen-lockfile` errors (resolution/store/network).
- postinstall/`prisma generate` failure (engine download, schema parse).
- Any tracked file appearing modified after Gate 1.
- Baseline shift that cannot be classified (UNKNOWN after honest analysis).
- Audit unreachable via override (record limitation; not fatal).

### 25.8 Approval Gate
- Gate 1 → human approval (HIGH-RISK WRITE; lockfile-adjacent operation, policy gate #1-family).
- Gate 2 → human approval (dependency-file deletion, policy gate #3/#4-family; supersedes user WIP).
- Unit C → no gate (READ-ONLY), evidence recorded.

## 26. Evidence Sources

- Git state: `git status --short`, `git diff --stat/--name-status`, `git diff -- package*.json pnpm-lock.yaml`,
  `git ls-files --others --exclude-standard`, `git rev-parse`, `git cat-file -s HEAD:package-lock.json` (416,756 bytes).
- Manifests/configs: `package.json` (scripts, packageManager, no engines), `pnpm-lock.yaml` (lockfileVersion 9.0,
  importers parsed: 97/97 specifiers OK), `package-lock.json` stub, absence of `.npmrc`/`pnpm-workspace.yaml`/
  `.nvmrc`/Docker/CI files, README pnpm-only references (README.md:68,92).
- Lockfile↔node_modules comparison: scripted specifier/resolution extraction (2026-09-20) — full table §6.
- Prisma: `prisma/schema.prisma`, `src/lib/db/prisma.ts`, `package.json:10` postinstall,
  `node_modules/.prisma/client/schema.prisma` (5 models), `.pnpm` store listing (`@prisma+client@6.11.1`).
- Runtime: `node v25.9.0`, `pnpm 10.9.0`, `npm 11.9.0`, corepack absent; registries via `npm/pnpm config get registry`.
- Baseline re-run (2026-09-20): `prisma validate` PASS; `tsc --noEmit --incremental false` FAIL 25 error
  lines; `next lint` FAIL 2; no cache/artifact files created; `git status` unchanged post-run.
- Security: `pnpm audit --registry=https://registry.npmjs.org` — 140 advisories (8 critical/71 high/56
  moderate/5 low); direct-dep items cited in §16 with GHSA URLs.
- Dead deps: import grep (ts/tsx), dynamic-import grep (`import('shiki')` hit), CSS scan
  (`@plugin "tailwind-scrollbar-hide"`), chat/socket reachability greps.
- Prior evidence: `.agents/evidence/DISCOVERY-BASELINE.md`, `.agents/evidence/DEPENDENCY-UPGRADE-AUDIT.md`.

## 27. Validation

- `git status --porcelain` after all audit activity: identical to the phase start (7 tracked user
  modifications + untracked set incl. `.agents/`; **no new entries besides this file**).
- `git diff --stat`: 7 files changed, 151 insertions(+), 11,567 deletions(-) — byte-identical to phase start →
  `package.json`, `pnpm-lock.yaml`, `package-lock.json` untouched by this command.
- No files under `src/`, `prisma/`, `public/` (nor `app/`, `components/`, `lib/` — none exist at root;
  they live under `src/`) were modified.
- No dependency installation/update/removal; no Prisma generate/migrate/DB operation; no commit; no push.
- Exactly one new file produced: `.agents/evidence/BATCH-0-READINESS-AUDIT.md`.

## 28. STOP

Batch 0 has **not** been executed. Nothing is authorized. Awaiting explicit human decisions on §24 and
per-gate approval of the contract in §25.
