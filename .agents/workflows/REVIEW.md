# Workflow: Review

Purpose: independent examination of completed work. Executed by the **reviewer** role
(never the implementer of the task under review).

**Spine (review-side):** DISCOVER → PLAN → (no gate — READ-ONLY) → EXECUTE (examination)
→ VERIFY → REVIEW → EVIDENCE → COMPLETE

| Stage | What happens |
|---|---|
| DISCOVER | Read the task contract first: scope, non-goals, risk class, required approvals |
| PLAN | Decide what to examine: full diff, high-risk hunks, contract conformance, policy conformance |
| EXECUTE | Read the diff hunk by hunk; read surrounding code for context; run read-only checks if claims need confirmation; confirm gates were granted where the contract required them |
| VERIFY | Check the evidence trail: do the run records support the claims? any NOT RUN passed off as PASS? |
| REVIEW | Produce findings — each tied to a file/line and classified (blocker / should-fix / note) — and a verdict |
| EVIDENCE | Review record with findings + verdict, filed with the task |
| COMPLETE | Verdict returned to the orchestrator: **approve** / **request changes** / **block** |

Verdict definitions:

- **Approve** — contract fulfilled, scope clean, gates respected, evidence sufficient.
- **Request changes** — real gaps; returns to the implementer with the findings list.
- **Block** — policy violation, gate bypassed, fabricated/insufficient evidence, or scope breach.

A reviewer never fixes code. A reviewer's approval never substitutes for a human gate.
