# Workflow: Database Change

Purpose: evolve schema or data safely, given that **no migration history exists** and live DB state
is unknown.

**Spine:** DISCOVER → PLAN → APPROVAL GATE → EXECUTE → VERIFY → REVIEW → EVIDENCE → COMPLETE
(with a second gate before anything touches the database)

| Stage | What happens |
|---|---|
| DISCOVER | Explorer establishes: current `schema.prisma`, the known chat/`Conversation` mismatch, Accelerate setup. State plainly what is **unknown** about the live database |
| PLAN | Architect writes the **database-impact assessment** (mandatory, see `policies/DATABASE.md`): models/fields touched, data-loss risk, migration strategy reconciling schema vs. unknown live state, rollback plan, Accelerate connectivity implications |
| APPROVAL GATE 1 | Human approves the assessment and the exact commands (schema change, migration, push, seed — each is its own gate) |
| EXECUTE | Implementer runs the approved commands verbatim — no variations. If the DB state differs from assumptions, stop; do not improvise |
| APPROVAL GATE 2 | If execution revealed anything not in the approved assessment, re-gate before continuing |
| VERIFY | `prisma validate`; application-level read-only checks; record the migration/seed output verbatim |
| REVIEW | Independent review of the migration artifacts (files, SQL direction, data loss) |
| EVIDENCE | Full command output, schema diffs, migration files list — stored under `evidence/runs/` |
| COMPLETE | Per completion contract |

Standing prohibitions: no `migrate reset` short of an explicit, named human approval with
data-loss acknowledgment; no direct SQL experiments; no assuming Accelerate allows (or blocks) a
given CLI operation — verify when it matters.
