# CLAUDE.md — Claude Code adapter (thin)

This file is an adapter, not a contract. It contains nothing authoritative.

1. **Read `AGENTS.md` first.** It is the canonical, vendor-neutral project contract and takes
   precedence over anything in this file.
2. **Load `.agents/` material on demand.** Read the policies, workflows, contracts, and skills
   relevant to the current task — not all of them. Start with:
   - `.agents/policies/APPROVALS.md` (risk classes and human gates)
   - `.agents/policies/VERIFICATION.md` (baseline and NO-NEW-ERRORS policy)
   - `.agents/contracts/TASK.md` (how work is scoped and recorded)
3. **Respect approval gates.** When a gate is reached, stop, present the approval request, and wait
   for explicit human approval. Silence is not approval.
4. **Preserve user changes.** The working tree may contain pre-existing uncommitted user work.
   Never overwrite, stash, reset, restore, clean, or reformat it.
5. **Provide evidence.** Record actual command output for every verification claim in
   `.agents/evidence/`. Never claim "done" or "no errors" without it.
6. **Stay in scope.** Report out-of-scope discoveries; do not fix them without a task contract.
