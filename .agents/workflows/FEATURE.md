# Workflow: Feature

Purpose: deliver a new capability end-to-end without harming existing behavior or user work.

**Spine:** DISCOVER → PLAN → APPROVAL GATE → EXECUTE → VERIFY → REVIEW → EVIDENCE → COMPLETE

| Stage | What happens |
|---|---|
| DISCOVER | Explorer maps the affected areas (routes, actions, schemas, components); confirm current health from the baseline; identify the patterns this repo already uses (server actions + Zod + revalidatePath) |
| PLAN | Architect drafts the task contract: scope, non-goals, risk class, verification plan. Reuse existing patterns before inventing new ones |
| APPROVAL GATE | Orchestrator approves the contract (SAFE WRITE). **Additional human gates** before execution if the feature touches auth, middleware, uploads, schema, or dependencies — per `policies/APPROVALS.md` |
| EXECUTE | Implementer builds in small verifiable steps, staying strictly inside scope; stops at any surprise (unexpected failure, missing model, stale client) |
| VERIFY | Per verification plan: `prisma validate`, `tsc --noEmit --incremental false`, `pnpm lint`; NO-NEW-ERRORS comparison against baseline; feature-specific manual/read-only checks; classify all failures |
| REVIEW | Independent reviewer reads the diff against the contract; verdict recorded |
| EVIDENCE | Run records + diff evidence filed; task record updated |
| COMPLETE | Closure per `contracts/COMPLETION.md` |

Extra gates mid-flow: if execution reveals the feature needs a gated area (e.g. a new env var, a
schema change), the feature **pauses** at that gate — it is not absorbed silently.
