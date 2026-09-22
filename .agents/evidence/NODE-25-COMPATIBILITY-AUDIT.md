# Node 25 Compatibility Audit

## 1. Audit Metadata

- **Date:** 2026-09-20 · **Mode:** READ-ONLY (Command 5)
- **Question:** can Gate 1 (`pnpm install --frozen-lockfile`) safely execute on the currently installed Node v25.9.0 + pnpm 10.9.0, without a known Node-runtime compatibility blocker?
- **Only file created by this command:** this report. No installs, no generation, no lockfile/config/source/env changes, no Git state operations.
- **Pre-audit state:** working tree identical to the recorded baseline (7 tracked user changes, +151/−11,567).

## 2. Authorization

Human decision (Command 5 preamble): *Node 25.9.0 is provisionally accepted for the immediate Batch-0 Gate 1 readiness path.* This audit does **not** establish Node 25 as the long-term project runtime; that decision remains open (§17, §18).

## 3. Current Runtime

| Item | Value | Evidence |
|---|---|---|
| Node | **v25.9.0** (`C:\Program Files\nodejs\node.exe`) | `node --version`, `where.exe node` |
| pnpm | **10.9.0** (`C:\Users\74\AppData\Local\pnpm\pnpm` — standalone install; corepack NOT involved) | `pnpm --version`, `where.exe pnpm` |
| npm | 11.9.0 (present, not the project PM) | `npm --version` |
| Declared PM | `packageManager: pnpm@10.9.0+sha512…` pins pnpm exactly | `package.json:116` |
| Runtime pin in repo | **None** (no `engines`, `.nvmrc`, `.node-version`, `.tool-versions`, Volta) | Phase 0/3 file sweep |

Empirical runtime evidence: `.next/app-build-manifest.json` modified **today 14:33** — the dev server (Next 15.3 + Turbopack + React 19.1) has been running on this machine under Node 25 without Node-related failure.

## 4. Node Lifecycle Status

| Line | Status (2026-09-20) | Notes |
|---|---|---|
| Node 25 | **EOL since 2026-06-01** (odd-numbered, never LTS) | No security maintenance |
| Node 24 | **Active LTS** (EOL 2028-04-30) | Recommended long-term baseline |
| Node 26 | Current; enters LTS 2026-10 | Re-evaluate at LTS promotion |
| Node 20 | EOL 2026-04-30 | — |

Source: nodejs.org release schedule (Phase 2 evidence). Lifecycle status is **not** a functional-compatibility fact — see §18's distinctions.

## 5. Repository Runtime Policy

The repository currently declares **no runtime policy at all**. The Agent OS Phase 2 recommendation (Node 24 LTS + future `engines` field) stands as the long-term direction; nothing in this audit changes it. This audit only answers the immediate Gate 1 question.

## 6. Package Manager Compatibility

- **pnpm@10.9.0 `engines.node`: `>=18.12`** (registry metadata, verified 2026-09-20) → Node 25.9.0 **satisfies**.
- pnpm documentation requires Node 18+; no LTS-only restriction found → **SUPPORTED** for Gate 1 purposes.
- Corepack: not installed/not involved; the `packageManager` pin is honored by discipline (and by pnpm's own behavior when invoked).
- pnpm latest is 12.5.1 (`engines >=18.*`) — irrelevant here; pnpm stays pinned at 10.9.0.

## 7. Node Engine Constraints

**Comprehensive sweep (local, authoritative for the Gate 1 tree):** every `package.json` in top-level `node_modules/` and the `node_modules/.pnpm/` virtual store — **576 unique package@version entries; 285 declare `engines.node`; 285/285 satisfy Node 25.9.0; 0 exclusions; 0 parse errors.** (Evaluated with `semver@7.7.2` from the local store.)

Key direct dependencies:

| Package | Version (installed / lockfile) | Node engine constraint | Node 25 result | Evidence |
|---|---|---|---|---|
| next | 15.3.0 / 15.3.0 | `^18.18.0 \|\| ^19.8.0 \|\| >= 20.0.0` | **PASS** | package.json engines |
| react | 19.1.1 / 19.1.0 | `>=0.10.0` | PASS | package.json engines |
| react-dom | 19.1.1 / 19.1.0 | (none) | n/a | package.json |
| typescript | 5.9.2 / 5.8.3 | `>=14.17` | PASS | package.json engines |
| eslint | 9.34.0 / 9.30.1 | `^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0` | PASS (via `>=21.1.0`) | package.json engines |
| eslint-config-next | 15.3.0 | (none) | n/a | package.json |
| prisma (CLI) | 6.15.0 / 6.11.1 | `>=18.18` | PASS | package.json engines |
| @prisma/client | 6.15.0 / 6.11.1 | `>=18.18` (family) | PASS | package.json engines |
| @prisma/extension-accelerate | 1.3.0 | (none declared at 1.x) | n/a | package.json |
| next-auth | 5.0.0-beta.29 | (none) | n/a | package.json |
| axios | 1.11.0 / 1.10.0 | (none) | n/a | package.json |
| tailwindcss | 4.1.12 / 4.1.11 | (none) | n/a | package.json |
| zod | 3.25.76 / 3.25.74 | (none) | n/a | package.json |
| @tanstack/react-table | 8.21.3 | (none at 8.x) | n/a | package.json |
| @tiptap/* | 2.26.1 / 2.24.2 | (none) | n/a | package.json set |
| bcrypt-ts | 6.0.0 | `>=18` | PASS | package.json engines |
| @upstash/redis · ratelimit | 1.35.3 · 2.0.6 | (none) | n/a | package.json |
| uploadthing / @uploadthing/react | 7.7.4 · 7.3.3 | `>=18.13.0` / (none) | PASS | package.json engines |
| motion / framer-motion | 12.23.12 · 11.18.2 | (none) | n/a | package.json |
| socket.io | 4.8.1 | `>=10.2.0` | PASS | package.json engines |
| tsx | 4.20.5 / 4.20.3 | `>=18.0.0` | PASS | package.json engines |

**No dependency explicitly excludes Node 25, requires Node ≤24, or requires Node ≥26.** Absence of an engine declaration is recorded as *n/a*, not as endorsement (§18).

Planned-target engines (Phase 2 registry data, for the migration-path question — not Gate 1): next@16.3.5 `>=20.9.0` ✓; prisma/@prisma/client@7.10.0 `^20.19 || ^22.12 || >=24` ✓ (via `>=24`); @prisma/extension-accelerate@3.0.1 `>=22` ✓; eslint@10.11.0 `^20.19.0 || ^22.13.0 || >=24` ✓; typescript@7.0.2 `>=16.20.0` ✓; bcrypt-ts@9.0.2 `>=22` ✓. All satisfied by Node 25.

## 8. Next.js Compatibility

1. **Next 15.3.0 (current, Gate 1 tree):** engines `^18.18.0 || ^19.8.0 || >= 20.0.0` — Node 25 satisfies. Official minimum for Next 15 is Node 18.18.0 (Next 15 announcement). No LTS-only restriction documented. → **COMPATIBLE**; plus empirical evidence (§3: dev server runs today on Node 25).
2. **Next 15.5.x (interim target):** same engine policy family (≥18.18 line); registry engines for 15.5.x satisfy Node 25. → COMPATIBLE.
3. **Next 16.3.x (planned):** engines `>=20.9.0` — Node 25 satisfies; official minimum 20.9 (Next 16 announcement / installation docs). → COMPATIBLE.
4. Migration-specific Node-25 issues (`middleware.ts`→`proxy.ts`, Turbopack default build, App Router, React 19.3, Auth.js): **no Node-25-specific issues found in official guidance**; the known breaking changes are version-driven (codemods, config), not runtime-driven. Classified UNKNOWN where no explicit statement exists — but nothing indicates a Node-25 blocker. Turbopack dev already runs on this Node (§3).
5. **Phase 2 plan correction (per Command 5 §9):** the staged path `15.3.9 → 15.5.25 → 16.3.5` is corrected — **drop the 15.3.9 intermediate** (it remains below the ≥ 15.5.24 security floor for the two open criticals, incl. the Windows RCE). Revised first step: **15.5.25 directly** (≥ 15.5.24 floor satisfied), then 16.3.5.

## 9. React Compatibility

react/react-dom 19.1.x: `engines.node >=0.10.0` (effectively unconstrained); React 19.3 target: same policy family. **SUPPORTED/COMPATIBLE** on Node 25. No runtime-mode caveats found.

## 10. Prisma Compatibility

1. **Prisma 6.x (Gate 1 tree: CLI/client 6.11.1 lockfile-resolved):** engines `>=18.18` → Node 25 **satisfies functionally**. **However, Prisma's official policy: "supports and tests all Active LTS and Maintenance LTS Node.js releases"** (system-requirements docs) → Node 25 (odd/EOL) is **COMPATIBLE BUT NOT OFFICIALLY SUPPORTED**.
2. **Prisma 7.10.x (planned):** engines `^20.19 || ^22.12 || >=24` → satisfies Node 25 via `>=24`; same official LTS-only policy → **COMPATIBLE BUT NOT OFFICIALLY SUPPORTED**.
3. Repo specifics (`prisma-client-js` generator, `@prisma/client/edge` import, Accelerate extension): generation output is schema-driven JS — not Node-version-specific in content; the CLI that generates it (6.11.1) runs on Node 25 per engines. No known runtime restriction on **generation** under Node 25; classified with the support caveat above. `prisma generate` was NOT run (prohibited).

## 11. TypeScript Compatibility

1. TS 5.8.3 (lockfile) / 5.9.2 (installed): `engines.node >=14.17` → PASS.
2. TypeScript's supported runtime range is broad (>=14.17 for the 5.x line) — no LTS-only policy; compiles under any Node meeting engines. → **COMPATIBLE**.
3. Planned 5.9.x/6.0.x line: same engine family → safe on Node 25.
4. TS 7.0.2 (deferred target): `>=16.20.0` → satisfied; no additional Node requirement relevant here (its blocker is the missing compiler API for tooling, already recorded in Phase 2 — unrelated to Node 25).

## 12. ESLint Compatibility

- ESLint 9.x: `^18.18.0 || ^20.9.0 || >=21.1.0` → Node 25 passes via the `>=21.1.0` clause. **COMPATIBLE** (engine-accepted).
- ESLint 10.11.0 (planned): `^20.19.0 || ^22.13.0 || >=24` → passes via `>=24`. **COMPATIBLE** (engine-accepted).
- eslint-config-next 15.3.0: no engines; 16.3.5 moves with next. No Node-25 blocker.
- Note: ESLint's *official support window* emphasizes current LTS lines; the engine ranges above are the enforceable contract — classified COMPATIBLE (engine-accepted), with the general §18 caveat.

## 13. Auth.js / next-auth Compatibility

- next-auth 5.0.0-beta.29 (and the beta.32+ security target): **no `engines.node` declaration**; Auth.js runs on Web-standard APIs (Web Crypto, JWT via `jose`) that Node 25 implements fully. → **COMPATIBLE (no declared constraint)** — classified UNKNOWN only in the narrow sense that no official Node-matrix statement was found; no known Node-25-specific issue affects JWT, crypto, `getToken`, credentials provider, callbacks, or the middleware/proxy wrapper. (The beta.32 CVE fixes are version-driven, not runtime-driven.)

## 14. Other Relevant Dependencies

Covered by the §7 sweep: bcrypt-ts 6 (`>=18`) PASS; socket.io (`>=10.2.0`) PASS; tsx (`>=18`) PASS; uploadthing (`>=18.13`) PASS; everything else either passes or declares no engines. **285/285 declared constraints pass; zero conflicts repo-wide.**

## 15. Gate 1 Risk Analysis

| Risk | Assessment |
|---|---|
| Install-time engine failure (`pnpm install --frozen-lockfile`) | **None found** — pnpm itself (`>=18.12`) and every declared engine in the tree pass on 25.9.0 |
| `postinstall` → `prisma generate` failure | Engines pass (`>=18.18`); generation is schema-driven; no Node-25-specific issue known. Residual risk: running an LTS-only-supported CLI on Node 25 — functionally expected to work; officially untested by Prisma |
| Baseline reproducibility | Baselines recorded under Node 25 must be **tagged with the runtime** — a later Node 24 re-run may shift diagnostics; classify any delta as environment-caused until proven otherwise |
| Security maintenance of the runtime | Node 25 is EOL — the *toolchain* runs on an unpatched runtime during Gate 1. Acceptable for an install+generate+static-checks gate (no network-facing service exposed); not acceptable as the long-term state |
| Lockfile/config side effects | None — `--frozen-lockfile` cannot rewrite the lockfile; package files verified by hash in the Gate 1 protocol |

## 16. Compatibility Matrix

| Component | Current Version | Gate-1 Node 25.9.0 | Planned Version | Node 25 Assessment | Evidence |
|---|---|---|---|---|---|
| Node | 25.9.0 | Active (EOL line) | 24 LTS (TBD / re-eval at Node 26 LTS) | Functional; **no security maintenance** | nodejs.org schedule |
| pnpm | 10.9.0 | Active | 10.x (pinned) | **SUPPORTED** (engines `>=18.12`; docs Node 18+) | registry engines; pnpm.io |
| Next.js | 15.3.0 | Active | 15.5.25 → 16.3.x | **COMPATIBLE** (engines pass; official min met; dev server empirically runs) | engines + nextjs.org |
| React | 19.1.x | Active | 19.3.x | **SUPPORTED/COMPATIBLE** (`>=0.10.0`) | engines |
| Prisma | 6.11.1/6.15.0 | Active | 7.10.x | **COMPATIBLE BUT NOT OFFICIALLY SUPPORTED** (engines pass; official policy = LTS only) | engines + prisma.io system-requirements |
| TypeScript | 5.8.3/5.9.2 | Active | 5.9.x/6.0.x | **COMPATIBLE** (`>=14.17`) | engines |
| ESLint | 9.30.1/9.34.0 | Active | 10.11.x | **COMPATIBLE** (engine-accepted via `>=21.1.0`/`>=24`) | engines |
| next-auth | 5.0.0-beta.29 | Active | beta.32+ | **COMPATIBLE (no declared constraint)** — no official matrix found | package.json |

## 17. Long-Term Runtime Considerations

- **Immediate Gate-1 runtime:** Node 25.9.0 — provisionally accepted by the human, functionally clean per this audit.
- **Long-term baseline: Node 24 LTS remains the recommendation** (Active LTS, satisfies every current and planned engine range incl. Prisma 7's official LTS-only matrix). Node 26 becomes LTS in 2026-10 — the decision can be revisited then; nothing installed during Gate 1 forecloses either choice (the lockfile tree is Node-version-independent within the passing ranges).
- Recommend (later, gated): `engines` field + version-manager file so the runtime is reproducible — out of this audit's scope; no `package.json`/`.nvmrc`/`.node-version` changes made.

## 18. Required Human Decisions

1. Confirm proceeding with Gate 1 on Node 25.9.0 **with the recorded conditions** (§16 Gate 1 decision) — i.e., accept "compatible but not officially supported" for Prisma tooling during this gate.
2. Decide **when** to move the machine to Node 24 LTS (recommended before the Prisma 7 project / any production-adjacent verification; not required for Gate 1).
3. Decide whether the corrected Next.js interim path (**drop 15.3.9; first step = 15.5.25**) is accepted as the Phase 2 plan revision.

## 19. Conclusion

> **Can Gate 1 safely execute `pnpm install --frozen-lockfile` on Node 25.9.0 without a known Node-runtime compatibility blocker? — YES.**

**Classification: READY WITH CONDITION.** No functional blocker exists: pnpm 10.9.0 accepts Node ≥18.12; all 285 declared engine constraints across the 576-version tree pass; the current stack empirically runs on this runtime. Conditions:

1. **Prisma tooling runs engine-compatible but outside its official LTS-only support matrix** on Node 25 — accepted risk for generation under Gate 1; re-generate/re-verify under Node 24 LTS before Prisma-dependent milestones.
2. **Tag all Gate 1 baseline evidence with `Node v25.9.0`** so later Node-24 comparisons can separate runtime-caused deltas from code-caused ones.
3. **Node 25 is EOL** — acceptable for this install/static-check gate only; not a long-term state (decision 2).
4. Recorded baselines are runtime-relative: any future claim of "same errors" must name the Node version it was measured under.

## 20. Evidence Sources

- Local: `node/pnpm/npm --version`, `where.exe` paths; comprehensive engines sweep of `node_modules` + `node_modules/.pnpm` (576 entries, `semver@7.7.2`); per-package engines for all key dependencies (§7 table); pnpm global-install layout inspection (standalone, corepack absent); `.next/app-build-manifest.json` mtime 2026-09-20 14:33 (dev server ran today).
- Registry (2026-09-20): `pnpm@10.9.0` engines `>=18.12`; planned-target engines for next@16.3.5, prisma/@prisma/client@7.10.0, extension-accelerate@3.0.1, eslint@10.11.0, typescript@7.0.2, bcrypt-ts@9.0.2 (Phase 2 query data).
- Official docs: [pnpm.io](https://pnpm.io/en/installation) (Node 18+); [Next.js 15 announcement](https://nextjs.org/blog/next-15) (min Node 18.18) and [installation docs](https://nextjs.org/docs/app/getting-started/installation) / [Next 16](https://nextjs.org/blog/next-16) (min 20.9); [Prisma system requirements](https://www.prisma.io/docs/reference/system-requirements) ("supports and tests all Active LTS and Maintenance LTS Node.js releases"); nodejs.org release schedule (Phase 2).
- Prior evidence: `DISCOVERY-BASELINE.md`, `DEPENDENCY-UPGRADE-AUDIT.md`, `BATCH-0-READINESS-AUDIT.md`.

## 21. Validation

- Only file created: `.agents/evidence/NODE-25-COMPATIBILITY-AUDIT.md` (this report).
- `package.json`, `pnpm-lock.yaml`, `package-lock.json`, `prisma/`, `src/`, `public/` — untouched (pre/post git comparison identical; no `.npmrc` or env changes).
- No dependencies installed/changed; no Prisma or database operation; no commit/push; user WIP byte-identical.
