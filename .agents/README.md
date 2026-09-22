# .agents/ — Vendor-Neutral Agent OS

This directory is the project's operating system for AI coding agents. It is **vendor-neutral**:
no file here may depend on a specific runtime (Claude Code, Codex, ZCode, Cursor, …).
The canonical entry point is the root [`AGENTS.md`](../AGENTS.md); runtime files are thin adapters.

## Directory map

| Directory | Contents | Read when |
|---|---|---|
| `roles/` | Seven vendor-neutral role definitions with allowed/prohibited behavior | about to act in a role |
| `workflows/` | Eight repeatable workflows, each with the mandatory stage spine | about to execute work |
| `policies/` | Approvals, verification, database, Git, security, context, documentation — always binding | always (relevant ones per task) |
| `contracts/` | Task, completion, evidence, and handoff contracts | every task |
| `skills/` | Skill architecture. **Not yet populated** — no external skills installed yet | loading a stack skill |
| `evidence/` | Evidence storage conventions, Phase 0 discovery baseline, task records, run logs | recording or consulting evidence |
| `adr/` | Architecture decision records: process, template, index | making or recording a decision |
| `versioning/` | Dependency governance: version policy, upgrade workflow, current baseline, target policy | anything dependency-related |

## How to start a task

1. Read `AGENTS.md` (root) — the canonical contract.
2. Classify the intended work against `policies/APPROVALS.md` (READ-ONLY / SAFE WRITE /
   HIGH-RISK WRITE / DESTRUCTIVE). If a gate applies, plan around it from the start.
3. Open a task record per `contracts/TASK.md`.
4. Pick the workflow in `workflows/` that matches the task type and follow its spine.
5. Execute in a role from `roles/`. Verification (`workflows/VERIFICATION.md`) and review
   (`workflows/REVIEW.md`) are performed by roles other than the implementer.
6. Record evidence per `contracts/EVIDENCE.md` and `evidence/README.md`.
7. Claim completion only under `contracts/COMPLETION.md`.

## Precedence rules

1. Explicit human instruction in an approved task contract wins.
2. `AGENTS.md` (root) and the policies in `policies/` are binding.
3. Workflows define *how* to proceed; policies define *what may never happen*.
4. Skills and role files provide capability guidance; they never loosen a policy.

## Current state of the OS

- Foundation created 2026-09-20 (Phase 1). No application code was touched.
- `.agents/skills/` is architecture-only; external skills are adopted later, per `skills/README.md`.
- Several decisions are deliberately **open** (chat/socket subsystem, deployment platform,
  Prisma Accelerate, lockfile migration, dependency targets). See `adr/README.md`.
