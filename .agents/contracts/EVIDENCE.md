# Contract: Evidence

Evidence is the difference between an agent's opinion and an agent's finding. **Never fabricate
evidence.** If a check was not run, the record says NOT RUN. If something is unclear, it says UNKNOWN.

## Evidence categories

| Category | Captures |
|---|---|
| **Repository state** | `git status`, `git log`, `git diff`, branch/remote state |
| **Command output** | Any command's verbatim stdout/stderr with exit code |
| **Test output** | Test runner output (currently: none exist — say so rather than omit) |
| **Lint output** | `pnpm lint` results |
| **Typecheck output** | `tsc --noEmit --incremental false` results |
| **Build output** | `next build` results (currently not a trusted gate — label accordingly) |
| **Database evidence** | Schema validation, migration/seed plans and results (gated operations) |
| **Browser evidence** | Screenshots/recordings of UI behavior where relevant |
| **Security evidence** | Audit output, vulnerability reports, auth-flow observations |
| **Diff evidence** | Before/after per file touched |
| **Review evidence** | Reviewer findings and verdicts |

## Every evidence record must identify

1. **What** was checked (the claim being supported),
2. **When** (date/time),
3. **Command/tool** used, verbatim,
4. **Result** — PASS / FAIL / NOT RUN / UNKNOWN, plus exit code,
5. **Relevant output** — verbatim, secrets redacted,
6. **Baseline comparison** — against `evidence/DISCOVERY-BASELINE.md` or the latest recorded run
   (same / new errors / fixed errors / unrelated / unknown).

## Storage & hygiene

- Storage conventions: `evidence/README.md`.
- Raw output is included in fenced code blocks; truncation must be marked (`… truncated …`) and
  never applied to error lines.
- Redact secrets, tokens, connection strings — variable names only.
- Facts and interpretation are kept separate ("Observed: exit code 2" vs "Likely cause: …").
- Evidence is append-mostly; corrections are appended, never silently rewritten.
