# Contract: Completion

An agent may declare a task **COMPLETE** only when **all** of the following hold:

1. **Stated scope was completed** — every item in the contract's scope was delivered, and the
   final diff contains nothing outside it.
2. **Non-goals were respected** — no drive-by fixes, no reformatting, no unrequested changes
   (verified against the actual diff, not intentions).
3. **Verification was performed** — the checks named in the verification plan actually ran
   (see `policies/VERIFICATION.md` command rules).
4. **Actual evidence exists** — verbatim command output, working-tree comparison, and failure
   classification are recorded under `.agents/evidence/runs/`.
5. **Reviewer requirements were satisfied** — an independent reviewer (never the implementer)
   returned an approve verdict, or the contract explicitly waived review for READ-ONLY work.
6. **No unexplained changes remain** — every file in the diff maps to a plan step or is explicitly
   justified in the evidence.
7. **Documentation is updated where required** — per `policies/DOCUMENTATION.md`, or the gap is
   recorded as a known issue.
8. **Human approval gates were respected** — every gate in the contract's "required approvals" has
   status GRANTED with the approver named; no gate was skipped, self-granted, or assumed.

## Prohibited completion claims

- "No errors" or "passing" without a verification record from this task.
- Treating a green `next build` as quality evidence (build checks are currently ignored by config).
- Treating "same errors as baseline" as success by itself (NO-NEW-ERRORS is necessary, not sufficient).
- Declaring NOT RUN or UNKNOWN checks as PASS.
- Completing past a pending gate ("I'll get approval later" is never acceptable).

## Closure

The orchestrator closes the task only after the verifier's record and (where applicable) the
reviewer's verdict exist. The task record's final status is set to COMPLETE with links to all
evidence. If any condition fails, the task is BLOCKED with the failing condition named.
