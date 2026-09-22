# Phase 2B Stabilization — Result Record (2026-09-22)

> Implementation of the approved Phase 2B architecture (P1–P6), sequential,
> main thread only. No parallel subagents. No commits or pushes were made.

## Baseline (post Phase 2A, verified fresh before P1)

- `pnpm exec tsc --noEmit --incremental false` → **20 errors** (8 in
  `src/actions/chat.ts`, 2 in `data-table-date-filter.tsx`, 1 in
  `sections/hero/default.tsx`, 9 in `ui/chart.tsx`, 1 in `lib/export.ts` —
  the two `formatDate` errors surface as the date-filter errors).
- `pnpm lint` → **2 errors, 19 warnings** (`chat-widget.tsx:53` unused var,
  `socket.ts:45` explicit any).
- `next.config.ts` carried `typescript.ignoreBuildErrors: true`; no
  `typecheck` script; no CI; tsconfig included two stale `.tss` files.

## Phase results

| Phase | Result |
|---|---|
| P1 waivers | tsconfig excludes 3 chat files (`src/actions/chat.ts`, `src/components/chat/chat-widget.tsx`, `src/components/chat/conversation-view.tsx`) + removed the two `.tss` entries; eslint global ignores 2 chat files. Gate: tsc 12 errors (exactly the 8 chat errors gone, no new errors), lint 0 errors / 18 warnings (1 warning lived in the ignored chat file, hence 19→18). |
| P2 TS fixes | `format.ts` catch returns `""` with explicit `string` return type (later hardened to optional catch binding after lint flagged the unused `_err`); `export.ts` `excludeColumns: string[]`; deleted orphaned `src/components/`sections`/` (zero references verified pre-delete); `chart.tsx` migrated to Recharts 3 typing (details below); `handle-error.ts` dead `AuthError` branch + import removed. Gate: **tsc 0 errors**. |
| P3 settings/contracts | `settings.ts`: `SettingsSchema.safeParse` now runs at the boundary (activates the password-pairing and confirmation refines); only model fields (`name`, `email`, hashed `password`) reach `prisma.user.update` — `newPasswordConfirmation` can never reach Prisma; P2002 → `"Email is already in use"`; all other Prisma errors → generic message; `unstable_update` and `{ success: "Settings Updated!" }` preserved. `projects.ts` / `categories.ts`: `deleteProject(s)` / `deleteCategory(ies)` throw → `{ error: "Unauthorized" }`; `updateProjects` unauthorized `{ error, data: null }` → `{ error }`. Consumers verified to read only `{ error }`. Gate: tsc 0 errors. |
| P4 dep removal | Validated all candidates (static imports, dynamic imports/require, config references, `pnpm why`). **Deviation: `motion` KEPT** — corrected grep found four live importers of `motion/react` (`data-table-action-bar.tsx`, `animate-ui/copy-button.tsx`, `animate-ui/stars-background.tsx`, `animate-ui/code-editor.tsx`); the architecture-phase pattern `from "motion"` had missed the subpath import. Removed 10 in one `pnpm remove`: `install`, `uuid`, `jotai`, `lodash-es`, `@types/lodash-es`, `react-markdown`, `remark-gfm`, `react-colorful`, `react-textarea-autosize`, `lowlight`. Manifest diff = exactly those 10; lockfile diff = pure removals (zero version-bearing additions, no unrelated churn). `socket.io` + `framer-motion` kept (chat-frozen). Gates after removal: tsc 0, lint 0 errors / 18 warnings. |
| P5 gates | `"typecheck": "tsc --noEmit"` added; `typescript.ignoreBuildErrors` removed from `next.config.ts`; `.github/workflows/ci.yml` added. Local: `pnpm typecheck` exit 0; `pnpm build` **PASS** (first TypeScript-enforced build; all routes + proxy emitted). |
| P6 final | Full gate set green; constraint checklist verified (below). |

## Chat waiver and rationale

Chat is frozen pending the separate delete-or-rebuild decision; its 8 tsc
errors exist because `Conversation`/`Message` models never landed in the
schema. Waiver is **config-only** (no chat file touched):

- tsconfig `exclude`: `src/actions/chat.ts` (8 errors),
  `src/components/chat/chat-widget.tsx` and `conversation-view.tsx` — both
  import `@/actions/chat`, so excluding the action file alone would be
  defeated by import re-inclusion. `conversation-list.tsx` and
  `lib/validations/chat.ts` remain fully type-checked.
- eslint `ignores`: `chat-widget.tsx` (1 error), `lib/socket.ts` (1 error).
  Lint blindness on those two paths is accepted, bounded, and auto-retired
  by the chat decision.
- Build impact: `next build` uses the project tsconfig, so the waiver set is
  exactly what leaves the build's typecheck; chat has no routes, so no
  generated route types reference it. P5 build PASS confirms no accidental
  effect.

## Remaining warnings (approved level)

19 React Compiler-era `react-hooks` warnings existed at baseline; 1 lived in
`chat-widget.tsx` (now inside the lint waiver), so **18 remain visible**:
`set-state-in-effect`, `immutability`, `purity`, `use-memo`,
`incompatible-library` families across `animate-ui/code-editor.tsx`,
`animate-ui/copy-button.tsx`, `data-table-action-bar.tsx`,
`tiptap/_components/upload-image-form.tsx`, `tiptap/extensions/floating-menu.tsx`,
`tiptap/extensions/image.tsx`, `tiptap/rich-text-editor.tsx`,
`ui/file-upload.tsx`, `ui/screenshot.tsx`, `ui/sidebar.tsx`, `hooks/use-data-table.ts`,
`hooks/use-media-query.ts`, `hooks/use-mobile.ts`, `lib/compose-refs.ts`,
`lib/composition.ts`. Kept at `warn` by explicit `eslint.config.mjs` rule
downgrades, per the approved scope; adoption is a future dedicated task.

## Dependency removals

Removed (10): `install`, `uuid`, `jotai`, `lodash-es`, `@types/lodash-es`,
`react-markdown`, `remark-gfm`, `react-colorful`, `react-textarea-autosize`,
`lowlight`. Side benefit: the `mdast-util-to-hast` audit advisory left the tree
with `react-markdown`.

Kept despite the approved list (deviation): `motion` (live `motion/react`
importers). Kept by design: `socket.io`, `framer-motion` (chat-linked, frozen),
`axios` (AxiosError in handle-error), `shiki` (dynamic import in code-editor).

## CI configuration

`.github/workflows/ci.yml`: GitHub Actions; push to `main` + PRs; pnpm via
`pnpm/action-setup@v4` (version pinned by the `packageManager` field); Node 22
with pnpm cache; `pnpm install --frozen-lockfile` (postinstall runs
`prisma generate`, which never connects — the placeholder `DATABASE_URL` env
only satisfies `prisma.config.ts` config loading); then `pnpm typecheck` and
`pnpm lint`. No tests, per scope.

## Constraint checklist (P6)

- Chat source files: `git status` empty on `src/components/chat/`,
  `src/actions/chat.ts`, `src/lib/socket.ts`, `src/lib/validations/` — untouched.
- `prisma/schema.prisma` + `prisma/seed.ts`: the `M` flags predate this session
  (present in the conversation-start git snapshot); not modified here.
  `generated/` is gitignored; `prisma generate` regenerated in place, no
  schema change. Database untouched.
- Phase 2A auth/security files untouched: `auth.ts`, `auth.config.ts`,
  `middleware.ts`, `routes.ts`, `actions/login.ts`, `lib/rate-limit.ts`,
  `app/admin/layout.tsx`, `components/forms/login-form.tsx`,
  `scripts/rotate-admin-password.ts`, action read guards.
- No dependency upgrades: lockfile diff shows zero version-bearing additions.
- Secrets: none read, printed, or modified.
- No commits, no pushes: HEAD still `519a002`.

## Deviations from the approved architecture

1. **`motion` kept** (approved removal list had 11; 10 removed). The
   architecture's own validation layer 1 (source imports) falsified the
   "proven unused" predicate once the grep pattern was corrected to match the
   `motion/react` entrypoint. Removing it would have broken tsc/build.
2. **`chart.tsx` needed three small additional fixes** beyond the two type
   rewrites: `coordinate`/`accessibilityLayer` added to the `Omit` (recharts 3
   marks them required on `TooltipContentProps`, which broke standalone
   rendering in `stats-card.tsx` / `top-category-chart.tsx`), and two React
   `key` props (`item.dataKey`/`item.value`) wrapped in `?.toString()` because
   recharts 3 widened those types beyond React's `Key`. No casts introduced.
3. **`format.ts` catch binding** dropped (`catch (_err)` → `catch`) after lint
   flagged the newly unused variable; same approved error path, cleaner form.

## Known unexercised limitations

- **CI has never run** — the workflow exists but requires a push to exercise;
  pushing was not authorized in this phase.
- **Authenticated admin flows not smoke-tested locally**: the dev machine
  cannot resolve the Upstash Redis host, so fail-closed login rate limiting
  blocks local login entirely (Phase 2A known issue). Settings save, delete
  actions, and P2002 handling are verified by typecheck, consumer-contract
  review, and code reading — not end to end.
- **Admin charts not visually re-verified** after the `chart.tsx` typing
  migration (requires the authenticated admin session blocked above). The
  migration is type-level only; runtime JSX/logic is unchanged.
- `tsc --noEmit` (typecheck script) uses incremental caching when invoked via
  `pnpm typecheck` (no `--incremental false`); both forms verified green.

## Files changed this session

Modified: `tsconfig.json`, `eslint.config.mjs`, `package.json`,
`pnpm-lock.yaml`, `next.config.ts`, `src/lib/format.ts`, `src/lib/export.ts`,
`src/lib/handle-error.ts`, `src/components/ui/chart.tsx`,
`src/actions/settings.ts`, `src/actions/projects.ts`, `src/actions/categories.ts`.
Deleted: `src/components/sections/` (orphaned hero).
Added: `.github/workflows/ci.yml`, this evidence record.
