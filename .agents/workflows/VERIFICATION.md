# Workflow: Verification

Purpose: establish what is *actually true* about the repository after work. Executed by the
**verifier** role; governed by `policies/VERIFICATION.md`.

**Spine:** DISCOVER → PLAN → (no gate — READ-ONLY) → EXECUTE → VERIFY → REVIEW → EVIDENCE → COMPLETE

| Stage | What happens |
|---|---|
| DISCOVER | Read the task's verification plan and the current baseline (`.agents/evidence/DISCOVERY-BASELINE.md`, latest `evidence/runs/`) |
| PLAN | Select checks: the standard set plus task-specific read-only checks. Confirm each writes nothing (no caches, no artifacts) |
| EXECUTE | Run in order: ① `git status --porcelain` (before) → ② `pnpm exec prisma validate` → ③ `pnpm exec tsc --noEmit --incremental false` → ④ `pnpm lint` → ⑤ task-specific checks → ⑥ `git status --porcelain` (after, must match ① plus the task's intended diff) |
| VERIFY | Capture verbatim output + exit codes; compare to baseline; **classify every failure**: baseline / newly introduced / fixed baseline / unrelated / unknown |
| REVIEW | Sanity-check the classification: is anything labeled UNKNOWN being quietly absorbed? is anything NOT RUN being implied as PASS? |
| EVIDENCE | Verification record under `evidence/runs/` (`YYYY-MM-DD-<task-id>-verification.md`): per-check PASS/FAIL/NOT RUN/UNKNOWN, full output, baseline comparison, classifications |
| COMPLETE | Record delivered to orchestrator; it is the only accepted input to completion decisions |

Standing rules:

1. Re-run, don't trust: the verifier's own prior runs and everyone else's claims alike.
2. NO-NEW-ERRORS: matching baseline is necessary, never sufficient — see policy.
3. `next build` is excluded until the ignore-flags are removed; a passing build is not evidence.
4. Tests do not exist; where a test run would be expected, record NOT AVAILABLE with the reason.
