# Workflow: Bugfix

Purpose: eliminate a defect at its cause, without regressions and without scope creep.

**Spine:** DISCOVER → PLAN → APPROVAL GATE → EXECUTE → VERIFY → REVIEW → EVIDENCE → COMPLETE

| Stage | What happens |
|---|---|
| DISCOVER | Reproduce or otherwise evidence the defect first (code path, error output). If it cannot be reproduced or evidenced, it is a hypothesis, not a bug — say so. Identify root cause, not the first plausible culprit |
| PLAN | Contract with: root cause, fix strategy, blast radius, risk class, verification plan. Note explicitly what regression risk exists **given there are no automated tests** |
| APPROVAL GATE | SAFE WRITE fixes: orchestrator. HIGH-RISK areas (auth, middleware, data, deps): human gate first |
| EXECUTE | Minimal, cause-directed change. The implementer fixes the cause — not symptoms, not nearby style, not unrelated flakiness |
| VERIFY | Standard checks + NO-NEW-ERRORS baseline comparison + evidence the original defect is gone (reproduction output before/after where possible). **No tests exist**: verification rests on typecheck/lint/manual evidence — state this limitation explicitly |
| REVIEW | Independent reviewer confirms the fix addresses the root cause and nothing else moved |
| EVIDENCE | Before/after reproduction evidence, diff, run records |
| COMPLETE | Per completion contract; if the bug reveals a class of similar defects, file them as separate task proposals — do not fix in passing |

Regression rule: with no test suite, any fix that changes behavior in more than the reported
defect requires an explicit note in the task record and reviewer attention.
