# Policy: Version & Dependency Governance

> Owner's intent: dependencies should **eventually** reach the latest stable compatible versions.
> This policy exists so that "eventually" happens safely. It controls all future upgrades; it does
> not perform any.

## Definitions

1. **"Latest" means latest STABLE release** by default.
2. **Prereleases are excluded by default.** RC, beta, alpha, canary, nightly, experimental, and any
   non-stable tag **must not** be adopted by default. Exceptions require an explicit, documented
   human decision. (Baseline note: `next-auth` already sits on a beta line
   (`5.0.0-beta.29`) — that is a recorded fact to handle during the audit, not a precedent for
   adopting more prereleases.)

## Conditions for any upgrade

A package may be upgraded only when **all** of the following are true:

- [ ] Target version is **identified** (specific version number, not "latest").
- [ ] **Compatibility** with the rest of the stack is checked (framework ↔ React ↔ TypeScript ↔ tooling).
- [ ] **Peer dependencies** are checked and satisfied.
- [ ] Official **migration/release notes** are reviewed.
- [ ] **Breaking changes** are identified and listed.
- [ ] Required **code changes** are identified before upgrading.
- [ ] A **verification strategy** exists (per `../policies/VERIFICATION.md`).
- [ ] **Human approval** is obtained where required (`../policies/APPROVALS.md` — every upgrade is gated).

## Structural rules

3. **Major upgrades are migration projects.** They get their own task contract, plan, and evidence —
   never a drive-by version bump.
4. **Related packages move as compatibility groups.** Examples in this repo:
   - *Framework group:* `next` + `react` + `react-dom` + `typescript` + `eslint` +
     `eslint-config-next` + `@eslint/eslintrc` + relevant build tooling.
   - *Prisma group:* `prisma` (CLI) + `@prisma/client` + `@prisma/extension-accelerate` +
     `@auth/prisma-adapter` + generated client + datasource/driver config + schema compatibility +
     migration strategy.
5. **Framework upgrades are coordinated.** Next.js is never upgraded independently of the React,
   TypeScript, and ESLint versions it supports.
6. **Prisma is never upgraded blindly** — CLI, client, Accelerate extension, adapter, generated
   client, and the (absent) migration history must be considered together.
7. **Stable compatibility outranks raw version numbers.** "Newest" that breaks the stack loses to
   "slightly older" that works.

## Prohibited practices

8. **No blind bulk upgrades.** `pnpm update --latest`, `npm update`, and equivalent
   "refresh everything" commands are prohibited.
9. **No upgrades inside an audit.** Discovery/audit stages are read-only (see
   `UPGRADE-WORKFLOW.md`).
10. **No uncontrolled batches.** Upgrades happen in planned batches, one at a time.

## After every upgrade batch

11. The implementer must:
    - **inspect the changes** (package.json diff + lockfile diff, reviewed);
    - **run appropriate verification** (standard set at minimum);
    - **compare against baseline** and classify every difference
      (baseline / new / fixed / unrelated / unknown);
    - **document regressions** in the task record;
    - **stop if unexpected failures appear** — never stack another upgrade on top of an
      unexplained failure.
