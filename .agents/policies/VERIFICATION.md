# Policy: Verification & Baseline

## Current verification baseline (historical evidence, recorded 2026-09-20)

This snapshot describes the repository as found in Phase 0. It is **not** a claim of health.
Do not update this table casually — record new runs under `.agents/evidence/runs/` instead.

| Check | Command | Baseline result |
|---|---|---|
| Prisma schema | `pnpm exec prisma validate` | **PASS** |
| Typecheck | `pnpm exec tsc --noEmit --incremental false` | **FAIL** — 27 errors (clusters: stale/missing generated Prisma client types, implicit `any`s, zod↔resolver overload mismatch, Recharts v3 typing, missing button variant `"glow"`, `lib/export.ts` type error) |
| Lint | `pnpm lint` (`next lint`) | **FAIL** — 2 errors (`src/components/chat/chat-widget.tsx:30` unused var; `src/lib/socket.ts:45` explicit `any`) |
| Tests | — | **NOT AVAILABLE** — no test framework or test files exist |
| Build | `pnpm build` | **NOT a trusted gate** — `next.config.ts` sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`, so a green build proves nothing about type/lint health |

## Command rules

- Only run checks that do not write files. `tsc` must carry `--noEmit --incremental false`
  (the tsconfig has `incremental: true`, which would otherwise write `.tsbuildinfo`).
- Do not run `next build` as part of verification until the ignore-flags are removed (that removal
  itself is a gated change).
- A check that was **not run** is recorded as **NOT RUN**, never as PASS. A check whose outcome is
  unclear is **UNKNOWN**, never PASS.

## NO-NEW-ERRORS policy (early remediation)

Until the baseline failures are deliberately repaired (each repair is real work with its own task):

1. Any change must introduce **zero new** type errors, lint errors, or runtime regressions.
2. Matching the baseline error count is **necessary but not sufficient**. An implementation is
   never considered successful merely because the repository still has the same pre-existing errors;
   the change itself must be justified by contract, review, and evidence.
3. Reducing baseline errors is welcome and must be recorded (fixed-baseline-failure), but never
   trades for new errors elsewhere.

## Failure classification (verifier duty)

Every failure observed during verification must be classified:

| Class | Meaning |
|---|---|
| **Baseline failure** | Present in the recorded baseline, unchanged, not caused by this work |
| **Newly introduced failure** | Caused by this work — blocks completion until fixed or re-scoped by a human |
| **Fixed baseline failure** | A baseline error this work removed — record as improvement |
| **Unrelated failure** | Appears in a new area but demonstrably not caused by this work (e.g. environment) — report, do not absorb silently |
| **Unknown** | Cannot be classified with available evidence — must be escalated, never guessed |

## Evidence requirements

Every verification run is recorded under `.agents/evidence/runs/` with: date/time, command(s) verbatim,
full output, PASS/FAIL/NOT RUN/UNKNOWN per check, baseline comparison, and classification of any
failure. See `contracts/EVIDENCE.md`.
