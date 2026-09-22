# 0002 · Phase 2B — Stabilization

**Status**: Completed / Closed (engineer-approved architecture; implemented, independently verified, documented — 2026-09-22)
**Date**: 2026-09-22
**Mode**: STABILIZATION / CROSS-CUTTING (quality gates + contracts)
**Code area**: `tsconfig.json`, `eslint.config.mjs`, `package.json`, `next.config.ts`, `src/lib/{format,export,handle-error}.ts`, `src/components/ui/chart.tsx`, `src/actions/{settings,projects,categories}.ts`, `.github/workflows/ci.yml`
**Evidence**: `.agents/evidence/PHASE-2B-RESULT.md` (phase-by-phase outputs, waiver record, warning inventory, deviations)
**Independent verification**: `/check verify` → **PASS WITH UNVERIFIED ITEMS** (13 PASS, 0 FAIL, 4 runtime checks blocked, re-run independently against the gates)

## Summary

Bring the active (non-chat) codebase to a clean, production-safe baseline before
feature/roadmap work: zero non-waived TypeScript errors, zero ESLint errors, a
`typecheck` script, an honest TypeScript-enforced build, normalized mutation
authorization contracts, corrected settings validation, Recharts 3 typing
compatibility, removal of proven-dead dependencies, and a CI typecheck + lint
gate. Chat stayed frozen; its errors were waived by configuration only.

## Final state (all gates re-verified independently on 2026-09-22)

- `pnpm exec tsc --noEmit --incremental false` → **0 errors** (baseline: 20)
- `pnpm typecheck` (new script) → **exit 0**
- `pnpm lint` → **0 errors, 18 warnings** (baseline: 2 errors, 19 warnings)
- `pnpm build` → **PASS** — the first build with TypeScript enforcement active
  (`typescript.ignoreBuildErrors` removed from `next.config.ts`)
- HEAD unchanged at `519a002`; branch `ahead 10` of `origin/main`, identical to
  the Phase 0 baseline; nothing committed or pushed.

## Implemented changes

### Chat waiver (config only; no chat file touched)

Chat is frozen pending the separate delete-or-rebuild decision. Its 8 tsc errors
exist because the `Conversation`/`Message` models never landed in the schema.

- `tsconfig.json` `exclude`: `src/actions/chat.ts` (all 8 errors),
  `src/components/chat/chat-widget.tsx` and `src/components/chat/conversation-view.tsx`
  (both import `@/actions/chat`; excluding the action file alone would be
  defeated by import re-inclusion). `conversation-list.tsx` and
  `src/lib/validations/chat.ts` remain fully type-checked.
- `eslint.config.mjs` global ignores: `src/components/chat/chat-widget.tsx` and
  `src/lib/socket.ts` (the only two chat lint errors). Lint blindness on those
  two paths is accepted, bounded, and auto-retired by the chat decision.
- Build impact: `next build` uses the project tsconfig, so the waiver set is
  exactly what leaves its typecheck; chat has no routes and no generated route
  types reference it. The P5 build PASS confirms no accidental effect.

### Non-chat TypeScript root-cause fixes

- `src/lib/format.ts`: catch returns `""` (was the caught `Error` object) with an
  explicit `string` return type; catch binding made optional after lint flagged
  the unused variable. Clears the two `data-table-date-filter.tsx` ReactNode
  errors and the runtime "object is not a React child" risk.
- `src/lib/export.ts`: `excludeColumns` widened to `string[]` (column ids are
  plain strings); callers unchanged.
- `src/components/sections/` deleted (orphaned `hero/default.tsx`; zero
  references confirmed before deletion; the live hero is `main-hero.tsx`).
  Clears the `"glow"` variant error.
- `src/components/ui/chart.tsx`: Recharts 3 type migration (details below).
- `src/lib/handle-error.ts`: the unreachable `AuthError` branch (`AuthError`
  extends `Error`, so the earlier `instanceof Error` return always won) and its
  import removed. All other behavior preserved.

### Recharts 3 migration (typing only; runtime JSX/logic unchanged)

Recharts 3 (`3.10.1`) moved `active`/`payload`/`label`/`activeIndex`/
`coordinate`/`accessibilityLayer` off the public `Tooltip` props onto
`TooltipContentProps`, and removed `payload` from public `LegendProps`.

- `ChartTooltipContent` props: `Omit<TooltipContentProps, …>` + `ComponentProps<"div">`
  + the component's own extras, with `active`/`payload`/`label` re-declared
  optional (Recharts injects them at runtime; the component also renders
  standalone, e.g. `stats-card.tsx`).
- `ChartLegendContent` props: explicit `payload?: TooltipContentProps["payload"]`
  and `verticalAlign?: "top" | "bottom"` replacing the broken
  `Pick<LegendProps, …>`.
- Two React `key` props wrapped as `?.toString()` because Recharts 3 widened
  `dataKey`/`value` beyond React's `Key` type.
- Public component API (`ChartContainer`, `ChartConfig`, `ChartTooltipContent`,
  `ChartLegendContent`, `ChartStyle`) unchanged; consumers (`stats-card.tsx`,
  `top-category-chart.tsx`) untouched. No `any`, no broad casts.

### Settings validation (`src/actions/settings.ts`)

- `SettingsSchema.safeParse(values)` now runs at the server-action boundary —
  this activates the schema's password-pairing and confirmation-equality
  refines (`schemas/index.ts:81`), which previously never executed server-side.
  Parse failure returns `{ error: "Invalid fields" }` (the form already produces
  field errors client-side; this is a backstop).
- Prisma update data is explicit: `name`, `email`, hashed `password` only.
  `newPasswordConfirmation` can never reach Prisma (previously the raw spread
  leaked it, which also meant a password change could fail at runtime).
- `PrismaClientKnownRequestError` with `code === "P2002"` maps to
  `"Email is already in use"`; every other error logs and returns a generic
  message. No raw Prisma error reaches the client.
- Preserved unchanged: auth/DB-user prechecks, current-password compare,
  bcrypt hashing (12 rounds), `unstable_update`, `{ success: "Settings Updated!" }`.

### Mutation authorization contracts (`projects.ts`, `categories.ts`)

- `deleteProject`, `deleteProjects`, `deleteCategory`, `deleteCategories`: the
  thrown `new Error("Unauthorized")` became `return { error: "Unauthorized" }`
  (verified: all delete consumers read only `{ error }`).
- `updateProjects` unauthorized return normalized `{ error, data: null }` →
  `{ error }`.
- Contract convention (intentional, documented): reads may throw to the error
  boundary (`getAbout`/`getContact`/`getProjectBy*`/`getCategoryBy*` keep it);
  mutations never throw for authorization. Success shapes preserved as-is
  (deletes `{ success: true }`, upserts `{ data: { success: true } }`,
  settings `{ success: string }`).

### Quality gates

- `"typecheck": "tsc --noEmit"` added to `package.json`.
- `typescript.ignoreBuildErrors` removed from `next.config.ts`.
- `.github/workflows/ci.yml`: GitHub Actions on push to `main` + PRs;
  `pnpm/action-setup@v4` (version pinned by the `packageManager` field, pnpm
  10.9.0); Node 22 with pnpm cache; `pnpm install --frozen-lockfile` (the
  postinstall `prisma generate` never connects — the placeholder `DATABASE_URL`
  env only satisfies `prisma.config.ts` config loading); then `pnpm typecheck`
  and `pnpm lint`. No tests, per scope. Concurrency group cancels superseded runs.

### Dependency removals (10 of the approved 11)

Removed in one `pnpm remove`: `install`, `uuid`, `jotai`, `lodash-es`,
`@types/lodash-es`, `react-markdown`, `remark-gfm`, `react-colorful`,
`react-textarea-autosize`, `lowlight`. Each was validated against static
imports, dynamic imports/`require`, config references, and the dependency graph
(`pnpm why`: root-only). Manifest diff = exactly those 10; lockfile diff = pure
removals, zero version-bearing additions. Removing `react-markdown`/`remark-gfm`
also removed the `mdast-util-to-hast` audit advisory from the tree.

**`motion` intentionally retained (deviation):** a corrected grep matching the
`motion/react` entrypoint found four live importers
(`data-table-action-bar.tsx`, `animate-ui/copy-button.tsx`,
`animate-ui/stars-background.tsx`, `animate-ui/code-editor.tsx`); the original
`from "motion"` pattern had missed the subpath import, so `motion` fails the
"proven unused" predicate. Kept by design: `socket.io` and `framer-motion`
(chat-linked, frozen), `axios` (AxiosError in handle-error), `shiki` (dynamic
import in code-editor).

### tsconfig hygiene

The two stale include entries (`src/app/admin/projects/page.tss`,
`src/app/admin/inbox/page.tss`) removed.

## Files affected

Modified: `tsconfig.json`, `eslint.config.mjs`, `package.json`,
`pnpm-lock.yaml`, `next.config.ts`, `src/lib/format.ts`, `src/lib/export.ts`,
`src/lib/handle-error.ts`, `src/components/ui/chart.tsx`,
`src/actions/settings.ts`, `src/actions/projects.ts`, `src/actions/categories.ts`.
Deleted: `src/components/sections/` (orphaned hero).
Added: `.github/workflows/ci.yml`, `.agents/evidence/PHASE-2B-RESULT.md`,
`docs/specs/0002-phase-2b-stabilization.md` (this record).

## Remaining React Compiler warnings (approved level)

18 `react-hooks` v7 warnings remain at `warn` via the deliberate rule
downgrades in `eslint.config.mjs` (`set-state-in-effect`, `immutability`,
`purity`, `use-memo`, `incompatible-library`), across `animate-ui/*`,
`tiptap/*`, `ui/file-upload.tsx`, `ui/screenshot.tsx`, `ui/sidebar.tsx`,
`hooks/*`, `lib/compose-refs.ts`, `lib/composition.ts` (baseline 19; one lived
in the lint-waived chat file). Adoption is a future dedicated task.

## Explicit out of scope (unchanged by this phase)

- Chat deletion/rebuild and the `/dashboard/inbox` surface (frozen; waiver
  auto-retires when decided).
- Prisma schema, migrations, generated client, database (including the role
  enum and the `@default("admin")` default).
- Dependency upgrades (removals only).
- Security follow-ups: stale `ADMIN_PASSWORD`/`NEW_ADMIN_PASSWORD` hygiene in
  `.env`, login `redirectTo` same-origin confirmation, JWT revocation window,
  transitive audit advisories (`effect` via `@hookform/resolvers`,
  `deepmerge-ts`/`mysql2` via prisma tooling) — each needs its own approved task.
- Test-suite implementation (framework setup and authoring).
- Upstash DNS remediation (machine-side environment issue).
- Feature/roadmap work.

## Pre-existing Prisma modifications (not this phase)

`prisma/schema.prisma` and `prisma/seed.ts` carry uncommitted `M` flags that
predate Phase 2B (present in the session-start git snapshot; file mtimes
2026-09-21). Phase 2B made no prisma edits, ran no migration/seed/reset, and
the generated client was not regenerated (mtime unchanged).

## Known unverified runtime checks

All statically checkable criteria pass; the following could not be exercised:

1. **CI execution** — the workflow requires a push; pushing was not authorized.
2. **Authenticated admin runtime flows** (settings save, delete actions, chart
   rendering) — local login is fail-closed because the machine cannot resolve
   the Upstash Redis host (pre-existing environment issue).
3. **P2002 runtime path** — the `PrismaClientKnownRequestError` classification
   through the Accelerate edge client is an assumption; the catch-all generic
   prevents raw leakage either way.
4. **Login end to end** — same Upstash blocker.

## Consequences

- Builds are now honest: any new TypeScript error fails `next build` until fixed.
- `pnpm typecheck` and `pnpm lint` are the repo's quality gates, mirrored by CI.
- The chat waiver is scoped to the chat decision: excluding the three files and
  ignoring the two lint paths must be removed wholesale when chat's fate lands.
- Mutation contract rule for future actions: never throw for authorization;
  return `{ error }`. Reads may throw to the error boundary.
- Settings changes to email must handle the duplicate case at the boundary
  (the pattern now exists in `settings.ts`).

## Verification record

`/check verify` (2026-09-22, independent re-run of every gate) →
**PASS WITH UNVERIFIED ITEMS**: 13 PASS, 0 FAIL, the four runtime checks above
blocked with named unblock paths. Full phase-by-phase outputs, the waiver
record, the warning inventory, and the implementation deviations are in
`.agents/evidence/PHASE-2B-RESULT.md`.

## Closure

Phase 2B is **completed and closed** as of 2026-09-22, within the approved
scope, with nothing committed or pushed. No scope row exists in `docs/scope/`
for this phase; this record is the closure marker. Follow-on work (chat
decision, warning adoption, test framework, security follow-ups) starts as new
phases, not as extensions of this one.
