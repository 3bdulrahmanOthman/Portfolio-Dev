# Policy: Documentation

Documentation is part of the deliverable, not an afterthought — but it is kept lean and
de-duplicated.

## Rules

1. **Update docs when behavior changes.** If a task changes user-visible behavior, setup steps,
   commands, or project structure, the relevant documentation (README or `.agents/` docs) is updated
   in the same task — or the gap is explicitly recorded as a known issue.
2. **`AGENTS.md` stays concise.** It identifies the project, the rules, and pointers. Detail belongs
   in the matching `.agents/` file. Never grow `AGENTS.md` into a policy dump.
3. **Decisions go to ADRs.** Any choice with lasting consequences (dependency targets, subsystem
   removal, platform choices, schema strategy) is recorded in `adr/` — not buried in a task record.
4. **Evidence is append-mostly.** Records under `evidence/` are never rewritten to look better;
   corrections are appended with a note.
5. **No stale docs.** If an agent notices documentation contradicting the repository (Phase 0 found
   several such claims in `README.md` — Prettier, CI, database provider phrasing), it reports the
   drift; fixing it requires normal task scope, not a drive-by edit.
6. **Style:** Markdown, relative links between `.agents/` files, tables for enumerable facts,
   no vendor-specific instructions in shared documents.
7. **Secrets never appear in documentation** — variable names only.
