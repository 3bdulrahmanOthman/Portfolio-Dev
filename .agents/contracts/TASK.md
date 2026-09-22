# Contract: Task

Every piece of agent work is framed by a task contract **before** execution. Task records are
stored under `.agents/evidence/tasks/` as `TASK-YYYYMMDD-NN.md` (numbering per day, append-only).

## Required fields

| Field | Content |
|---|---|
| **Task ID** | `TASK-YYYYMMDD-NN` |
| **Objective** | One paragraph: what will be true when this task is done |
| **Scope** | Explicit list of files/paths/directories the task may touch — and nothing else |
| **Non-goals** | Explicit list of tempting adjacent work that is out of scope (prevents drive-by fixes) |
| **Affected areas** | Subsystems affected (e.g. admin UI, server actions, schema, CI-less tooling) |
| **Risk classification** | One of READ-ONLY / SAFE WRITE / HIGH-RISK WRITE / DESTRUCTIVE per `policies/APPROVALS.md` |
| **Dependencies** | Prior tasks, evidence, ADRs, or human decisions this task relies on |
| **Required approvals** | Which gates from `policies/APPROVALS.md` apply, and their status (REQUESTED / GRANTED by whom / N-A) |
| **Execution plan** | Ordered steps, each small enough to verify |
| **Verification plan** | Which checks will run, what baseline comparison is expected (per `policies/VERIFICATION.md`) |
| **Evidence** | What will be captured and where (diff, command output, run records) |
| **Review** | Who reviews (never the implementer), against which criteria |
| **Final status** | DRAFT → APPROVED → IN-PROGRESS → IN-REVIEW → VERIFIED → COMPLETE, or BLOCKED / CANCELLED |

## Rules

1. No execution without an APPROVED contract (for SAFE WRITE the orchestrator may approve;
   HIGH-RISK/DESTRUCTIVE steps additionally need the human gate at execution time).
2. Scope is a hard boundary. A scope change means a contract revision — with re-approval when risk
   class changes.
3. The contract is updated during execution only in the append/notes section; rewrites that would
   obscure what was originally approved are prohibited.
4. Small tasks may use a condensed contract, but no field may be silently omitted — write "none" or "n/a".
