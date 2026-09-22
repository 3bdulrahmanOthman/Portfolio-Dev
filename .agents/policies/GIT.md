# Policy: Git Safety

## Protected user work

The working tree may contain **pre-existing, uncommitted user changes**. As of Phase 0
(2026-09-20) this included:

- Modified: `package.json`, `package-lock.json` (emptied to a stub), `pnpm-lock.yaml`,
  `src/app/globals.css`, `src/components/icons.tsx`, `src/types/index.ts`
- Deleted: `src/app/page.tsx` (moved into the new `src/app/(home)/` route group)
- Untracked: `src/app/(home)/`, `src/components/{main-hero,main-nav,mobile-nav,side-header}.tsx`,
  `src/components/sections/`, `src/components/logos/`, several `src/components/ui/*` additions,
  `src/config/site.ts`, `public/*.webp`, plus `.stfolder/`, `.sync/`, `portfolio-dev.zip`

This snapshot may be stale — **re-verify with `git status` at the start of every task.**
These changes belong to the user. They are context, not cleanup targets.

## Rules

1. **Inspect before and after.** Run `git status --porcelain` before any write-bearing step and
   compare afterwards; unexpected diffs stop the task.
2. **Never touch user work:** no `git stash`, `git reset`, `git checkout --`, `git restore`,
   `git clean`, `git commit --amend`, or rebase involving user changes without explicit approval.
3. **No commits unless authorized.** Agents commit only when the task contract authorizes it or a
   human asks. When committing:
   - explicit scope in the message: `type(scope): summary` (repository convention);
   - stage files individually — **never `git add -A` / `git add .`** (it would sweep user WIP and
     artifacts such as `portfolio-dev.zip`);
   - never commit generated artifacts (`.next/`, `generated/prisma/`, `*.tsbuildinfo`, caches,
     editor state) or secrets (`.env*`).
4. **Pushes require approval. Always.** (Gate #18 in `policies/APPROVALS.md`.)
5. **Dependency work requires lockfile review.** `pnpm-lock.yaml` is authoritative. The stubbed
   `package-lock.json` reflects an in-progress npm→pnpm migration — do not "fix" it casually;
   lockfile changes are gated (Gate #4) and the migration decision lives in `.agents/adr/`.
6. **Branches:** create task branches only when the task contract says so; never switch branches in
   a way that discards working-tree state.
7. **History is append-only** for agents: no force-push, no history rewriting, ever.
