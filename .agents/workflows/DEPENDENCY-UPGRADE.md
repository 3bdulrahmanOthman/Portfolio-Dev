# Workflow: Dependency Upgrade

Purpose: move dependencies toward latest stable — under control, in batches, with evidence.
The full stage detail lives in `.agents/versioning/UPGRADE-WORKFLOW.md`; this is the execution spine.

**Spine:** DISCOVER → AUDIT → GROUP → RESEARCH → PLAN → **HUMAN APPROVAL** → UPGRADE → MIGRATE
→ VERIFY → REVIEW → RECORD

Non-negotiables:

1. **AUDIT is read-only.** Upgrading during AUDIT is prohibited — full stop. The audit gathers
   current versions, available updates, and grouping; it installs nothing.
2. One **batch** at a time (a compatibility group, e.g. Next.js + React + TS + ESLint +
   `eslint-config-next` move together; Prisma CLI + `@prisma/client` + Accelerate move together).
3. **HUMAN APPROVAL precedes every batch** — no blanket approvals, no "while we're here" upgrades.
4. Blind bulk updates are prohibited (`pnpm update --latest`, `npm update`): each package has an
   identified target version, reviewed release notes, and identified breaking changes **before** it moves.
5. After each batch: inspect the lockfile diff, run the verification set, compare against baseline,
   record regressions, **stop on unexpected failures** — never push through with a second upgrade
   to "see if it fixes itself".
6. Prerelease versions (RC/beta/alpha/canary/nightly) are not adopted by default — see
   `versioning/VERSION-POLICY.md` (note: `next-auth` already sits on a beta line; that baseline
   fact is handled in the audit, not normalized silently).
7. Every batch closes with RECORD: evidence +, if it changes policy, an ADR.
