# Workflow: Dependency Upgrade

Executes the owner's goal — latest stable compatible dependencies — one controlled batch at a time.
Governed by `VERSION-POLICY.md`; gated per `../policies/APPROVALS.md`.

## Stage pipeline

**DISCOVER → AUDIT → GROUP → RESEARCH → PLAN → HUMAN APPROVAL → UPGRADE → MIGRATE → VERIFY
→ REVIEW → RECORD**

| Stage | Read-only? | What happens |
|---|---|---|
| DISCOVER | Yes | Explorer establishes the current dependency state (from `CURRENT-BASELINE.md` + fresh read-only checks), the lockfile situation, and install-state health. **No packages are installed or updated here** |
| AUDIT | **Yes — strictly** | List candidate updates per dependency (registry queries, `pnpm outdated`-style read-only listing). **PROHIBITION: upgrading, installing, or lockfile changes during AUDIT are forbidden.** The audit produces a report, nothing else |
| GROUP | Yes | Cluster dependencies into **compatibility groups** (framework group, Prisma group, UI group, standalone libs). Decide batch order: low-risk standalone first, framework/Prisma as their own coordinated batches |
| RESEARCH | Yes | Researcher gathers, per candidate target: release notes, breaking changes, migration guides, peer requirements, deprecations — with citations and dates |
| PLAN | Yes | Architect drafts the batch plan: exact from→to versions, expected code changes, risk class, verification plan, rollback (lockfile restore strategy), evidence plan. Major upgrades get full migration-project treatment |
| HUMAN APPROVAL | — | **Gate per batch.** Present WHAT/WHY/RISK/SCOPE/ROLLBACK/VERIFICATION. No blanket approvals; no batch starts without an explicit grant |
| UPGRADE | No | Implementer applies the batch exactly as approved (target versions pinned, no extras). Lockfile diff is inspected and reviewed immediately |
| MIGRATE | No | Apply the identified code changes from the release notes — nothing more. Out-of-scope breakage is reported, not patched opportunistically |
| VERIFY | Read-only checks | Full verification set (`prisma validate`, `tsc --noEmit --incremental false`, `pnpm lint`); compare to baseline; classify every failure. **Unexpected failures → STOP.** Do not "fix" by upgrading something else |
| REVIEW | — | Independent reviewer checks the batch against its plan and the version policy |
| RECORD | — | Evidence: package.json diff, lockfile diff, research brief, verification record, regressions. Version-policy-relevant outcomes become ADR input |

## Standing rules

1. One batch at a time; a batch is not "closed" until VERIFY + REVIEW + RECORD are done.
2. Prerelease targets are excluded unless a documented human decision says otherwise.
3. The next batch's AUDIT may not begin while the previous batch has unexplained failures.
4. If the environment's install state is unhealthy (baseline: mixed npm/pnpm artifacts), resolving
   that is its own gated task — not a side effect of an upgrade batch.
