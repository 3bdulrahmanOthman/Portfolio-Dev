# Policy: Context Management

Agent context is a scarce resource. The OS is designed so that agents load little and point often.

## Rules

1. **Keep always-on instructions small.** The only always-on document is `AGENTS.md` (root) plus the
   thin runtime adapter. Everything else is loaded on demand.
2. **Load on demand.** Read only the policies, workflows, contracts, and skills relevant to the
   current task. Never load the whole `.agents/` tree into context.
3. **Persist instead of remembering.** Durable facts go to files, not chat memory:
   - decisions → `adr/`
   - task state → task records (`evidence/tasks/`)
   - execution output → `evidence/runs/`
   - session transitions → handoffs (`evidence/handoffs/`)
4. **Task-specific context.** A bugfix task does not need dependency-governance documents; an
   upgrade task does not need UI skills. The orchestrator names the documents each role should read.
5. **Large findings get summarized + linked.** Evidence files may be long; handoffs and task records
   link to them rather than quoting them wholesale.
6. **The discovery baseline is a snapshot.** `evidence/DISCOVERY-BASELINE.md` reflects Phase 0
   (2026-09-20). For current state, re-verify (fresh `git status`, fresh checks) rather than
   trusting the snapshot.

## Anti-patterns (prohibited)

- Pasting entire policies/workflows into a task record when a link suffices.
- Re-deriving facts that are already recorded in evidence or ADRs (cite them instead).
- Carrying unrecorded decisions across sessions — if it mattered, it is in a file.
- Growing `AGENTS.md` with detail that belongs under `.agents/`.
