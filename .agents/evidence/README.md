# Evidence — Storage Conventions

This directory holds the project's durable evidence. Rules live in
[`../contracts/EVIDENCE.md`](../contracts/EVIDENCE.md); this file defines *where things go*.

## Layout (created on demand — do not pre-create empty folders)

```
evidence/
├── README.md                  # this file
├── DISCOVERY-BASELINE.md      # Phase 0 snapshot (point-in-time; never treated as live state)
├── tasks/                     # TASK-YYYYMMDD-NN.md task records
├── runs/                      # verification & audit records: YYYY-MM-DD-<task-id>-<check>.md
└── handoffs/                  # HANDOFF-YYYYMMDD-NN-<task-id>.md session handoffs
```

## Rules

1. **Append, don't rewrite.** Records are historical. Corrections are appended with a note.
2. **Raw output is evidence.** Include verbatim command output in fenced blocks; mark truncation
   explicitly; never truncate error lines.
3. **Redact secrets.** Variable names only — no values, tokens, or connection strings, ever.
4. **Label status honestly.** Every check is PASS / FAIL / NOT RUN / UNKNOWN. "Not run" is stated,
   never implied.
5. **Baseline comparison is mandatory** for verification runs (same / new / fixed / unrelated / unknown).
6. **Snapshots age.** `DISCOVERY-BASELINE.md` reflects 2026-09-20 only. For current state, re-verify;
   do not cite the snapshot as "current".
