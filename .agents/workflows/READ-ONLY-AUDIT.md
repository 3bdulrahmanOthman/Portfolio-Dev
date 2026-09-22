# Workflow: Read-Only Audit

Purpose: inspect and report. Nothing changes — by design, not by luck.

**Spine:** DISCOVER → PLAN → (gate: none unless audit leaves READ-ONLY) → EXECUTE (read-only)
→ VERIFY → REVIEW → EVIDENCE → COMPLETE

| Stage | What happens |
|---|---|
| DISCOVER | Define the audit questions and the exact read-only commands to answer them (see `roles/EXPLORER.md` safe list) |
| PLAN | List checks; for each, confirm it writes nothing (no caches, no artifacts, no lockfiles). If any check would write: exclude it and report why |
| APPROVAL GATE | Normally none — an audit that needs a gate is no longer read-only. If it does, stop and reclassify |
| EXECUTE | Run checks; capture verbatim output; re-run `git status --porcelain` afterwards to prove the tree is unchanged |
| VERIFY | Cross-check findings against a second source (config file, installed package, second command) — no single-source claims |
| REVIEW | Self-review against the questions: every claim evidenced? every UNKNOWN labeled? |
| EVIDENCE | Record under `.agents/evidence/runs/` per `contracts/EVIDENCE.md`; classify results PASS/FAIL/NOT RUN/UNKNOWN |
| COMPLETE | Deliver the report; separate **Observed facts / Risks / Questions / Assumptions** — never mixed |

Hard rules: no fixes, no "helpful" cleanups, no commits. Discoveries that warrant change become
task proposals for the orchestrator — that is all.
