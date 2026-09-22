# Contract: Handoff

When work passes from one agent/session/role to another mid-task, the leaving agent produces a
handoff record, stored under `.agents/evidence/handoffs/` as
`HANDOFF-YYYYMMDD-NN-<task-id>.md`. A handoff replaces memory: **nothing important may live only
in the previous session's context.**

## Required contents

| Field | Content |
|---|---|
| **Current objective** | The task ID and one-paragraph restatement of where the work stands |
| **Completed work** | What is actually done, with evidence links (not "mostly done") |
| **Files changed** | Exact list, from `git status`/`git diff` at handoff time |
| **Files intentionally untouched** | Adjacent files deliberately left alone, so the successor doesn't "helpfully" fix them |
| **Decisions** | Choices made during execution, each with rationale and where recorded (task notes/ADR) |
| **Unresolved issues** | Open questions, unexpected failures, blocked gates — with current status |
| **Evidence** | Links to run records and diffs produced so far |
| **Risks** | What could break, what to be careful with (protected paths, gates pending) |
| **Next recommended action** | The single next step, or a short ordered list |
| **Approval status** | Which gates are granted, pending, or not yet requested |

## Rules

1. The successor **starts from the handoff file**, not from assumptions or a remembered conversation.
2. Honest incompleteness is required: "done" means verified-and-evidenced, nothing less.
3. Approval status must be precise — a pending gate is pending, no matter how likely approval seems.
4. The receiving agent confirms receipt by re-running `git status` and comparing with the handoff's
   file lists; any mismatch is resolved before continuing.
