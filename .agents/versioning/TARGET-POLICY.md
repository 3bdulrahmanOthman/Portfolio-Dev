# Policy: Target Versions

> **This file intentionally contains no version numbers.**
> Guessing targets would defeat the governance system. Targets are produced by a dedicated,
> future **READ-ONLY Dependency Upgrade Audit** and only then proposed for human approval.

## How targets will be determined

The audit (executing `UPGRADE-WORKFLOW.md` stages DISCOVER → AUDIT → GROUP → RESEARCH) must
determine, per dependency:

1. **Latest stable** — the newest non-prerelease release.
2. **Compatible stable** — the newest stable that works with the rest of this stack as-is or with
   identified, planned code changes.
3. **Supported version** — whether the candidate line is still supported (security fixes, docs).
4. **Breaking changes** — enumerated, with official citations.
5. **Migration requirements** — the code/config changes each step requires.
6. **Dependency relationships** — peer constraints, compatibility groups (framework group,
   Prisma group), and what must move together.
7. **Target order** — a sequenced batch plan (independent, low-risk packages first; coordinated
   framework and Prisma batches as units).

## Coordination constraints (from `VERSION-POLICY.md`)

- **Next.js is never upgraded in isolation.** Its supported React, TypeScript, ESLint, and plugin
  versions define the framework group's boundaries.
- **Prisma is never upgraded blindly.** CLI, client, Accelerate extension, adapter, generated
  client, datasource config, and the absent migration history move as one consideration.

## Output of the audit

A **target proposal** (proposed batch plan with from→to versions, risks, and verification plans),
written to this directory as a new versioned document, then submitted to the human approval gate.
Only approved batches execute — via `UPGRADE-WORKFLOW.md`, one at a time.

## Hard rules

- No prerelease targets by default (RC/beta/alpha/canary/nightly/experimental).
- Latest-stable-that-breaks loses to compatible-stable-that-works.
- The existence of this policy does not authorize any upgrade now or later without its gate.
