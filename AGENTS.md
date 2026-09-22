# AGENTS.md — Project Agent Contract

> Canonical, vendor-neutral contract for **every** AI coding agent working in this repository:
> Claude Code, OpenAI Codex, ZCode, and future runtimes (Cursor, Windsurf, Copilot, …).
> Runtime-specific files (e.g. `CLAUDE.md`) are **thin adapters**. They must not restate, override,
> or contradict this document. If a runtime file conflicts with `AGENTS.md`, `AGENTS.md` wins.

---

## 1. Repository identity

- **Project:** Full-stack developer portfolio with an admin dashboard (public site + protected admin area).
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui ·
  Prisma 7 + PostgreSQL (via Prisma Accelerate, edge client) · Auth.js v5 (credentials, JWT) ·
  UploadThing (file uploads) · Upstash Redis (rate limiting).
- **Package manager:** pnpm (declared in `packageManager`). Authoritative lockfile: `pnpm-lock.yaml`.
- **Current health:** healthy gates as of Phase 2B (2026-09-22): typecheck PASS (0 errors; chat
  vertically waived via tsconfig exclude pending the chat decision), lint PASS (0 errors, 18
  documented React Compiler warnings), build PASS with TypeScript enforced, CI runs typecheck +
  lint (`.github/workflows/ci.yml`, unexercised until first push). Still absent: tests, Prisma
  migrations directory. Records: `.agents/evidence/PHASE-2B-RESULT.md`,
  `docs/specs/0002-phase-2b-stabilization.md`. **Never assume health — verify.**

## 2. Prime directives

1. **Protect existing user work.** The working tree may contain pre-existing, uncommitted user changes.
   They are inviolable. Never overwrite, stash, reset, restore, clean, or "tidy" them.
2. **Default to read-only.** Do not modify anything until a task contract authorizes it, within scope.
3. **Respect approval gates.** Some operations require explicit human approval. Silence is not approval.
   When a gate is reached: stop, request approval, wait.
4. **No evidence, no claims.** Never claim "done", "passing", or "no errors" without recorded,
   reproducible command output. Never fabricate evidence.
5. **Stay in scope.** Execute exactly the task contract. Discoveries outside scope are reported, not fixed.
6. **Keep adapters thin.** All project logic, policy, and process lives in `.agents/`, vendor-neutral.
7. **When in doubt, stop and ask.** Do not guess on destructive, security-relevant, or irreversible actions.

## 3. Where things live (`.agents/`)

| Area | Purpose | Entry point |
|---|---|---|
| `.agents/README.md` | How the Agent OS fits together; precedence rules | start here |
| `.agents/roles/` | Vendor-neutral role definitions (explorer, researcher, architect, implementer, reviewer, verifier, orchestrator) | before acting in a role |
| `.agents/workflows/` | Repeatable workflows (audit, feature, bugfix, dependency upgrade, database, security, review, verification) | before executing work |
| `.agents/policies/` | Approvals, verification, database, Git, security, context, documentation | always binding |
| `.agents/contracts/` | Task, completion, evidence, and handoff contracts | for every task |
| `.agents/skills/` | Stack-specific skill architecture (not yet populated) | load on demand |
| `.agents/evidence/` | Evidence model, discovery baseline, task records, run logs | record here |
| `.agents/adr/` | Architecture decision records | for decisions |
| `.agents/versioning/` | Dependency governance (version policy, upgrade workflow, baseline, target policy) | before touching dependencies |

**Precedence:** policies override workflows; workflows override habits; `AGENTS.md` overrides everything vendor-specific.

## 4. Non-negotiable quick rules

- **Database:** never run `prisma migrate`, `migrate reset`, `db push`, `db pull`, or `seed` without
  explicit human approval. No migrations directory exists yet — database state must not be assumed.
  See `.agents/policies/DATABASE.md`.
- **Dependencies:** never install, upgrade, downgrade, remove, or refresh lockfiles without approval.
  No blind bulk updates (`pnpm update --latest` is prohibited). See `.agents/versioning/VERSION-POLICY.md`.
- **Git:** never commit or push unless the task contract authorizes it or a human asks. Never run
  `git reset`, `git stash`, `git checkout --`, `git restore`, or `git clean` against user work.
  See `.agents/policies/GIT.md`.
- **Build:** `next build` enforces TypeScript since Phase 2B (`ignoreBuildErrors` removed);
  the 3 chat files in `tsconfig.json` `exclude` are the only waived surface. Do not present a
  passing build as evidence of correctness for behavior — gates cover types and lint only.
  See `.agents/policies/VERIFICATION.md`.
- **Security:** authentication, authorization, middleware, and secrets are gated areas. Report findings;
  do not remediate in passing. See `.agents/policies/SECURITY.md`.

## 5. Working model (summary)

Every task runs through a task contract (`.agents/contracts/TASK.md`), a workflow
(`.agents/workflows/`), independent review (reviewer ≠ implementer), independent verification
(verifier checks actual repository state against the recorded baseline), and evidence recording
(`.agents/contracts/EVIDENCE.md`). Completion may only be claimed under the completion contract
(`.agents/contracts/COMPLETION.md`).

## 6. Runtime adapters

- `CLAUDE.md` exists for Claude Code and only points here.
- Codex reads `AGENTS.md` natively; no adapter needed.
- Future runtimes: add a thin adapter that points here. Document the need in `.agents/adr/` first.
