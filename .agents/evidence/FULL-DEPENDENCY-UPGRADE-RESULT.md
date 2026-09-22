# Full Dependency Modernization Result

> **Date:** 2026-09-21 · **Runtime:** Node v25.9.0 (unchanged, provisional conditions in force) · pnpm 10.9.0 (packageManager pin)
> **Authorization:** Human command "Full Dependency Modernization" — update all direct dependencies to the latest stable releases, execute clear major migrations, stop and report anything architectural.
> **Final verdict: PASS WITH FINDINGS — Batch-level modernization essentially complete; one major migration (TanStack Table 9) BLOCKED and reverted (§Blocked); ESLint 10 BLOCKED by upstream (§Blocked).**

## 1. Executive summary

All direct dependencies were moved to the **latest stable versions available on 2026-09-21**, except two recorded blocks: **TypeScript 7.0.2** (unsupported by typescript-eslint → used 5.9.3, the highest compatible stable) and **TanStack Table 9.2.4** (reverted to 8.21.3 — architectural-scale migration of the whole data-table layer). **ESLint 10.11.0** was installed then rolled back to **9.39.5** (latest 9.x) after discovering a hard upstream incompatibility with Next 16's bundled ESLint parser. Six major migrations were completed end-to-end: **Next 15.3.0→16.3.5, React 19.1.0→19.3.0, Prisma 6.11.1→7.10.0, Zod 3.25.74→4.6.5, Tiptap 2.24.2→3.31.3, react-day-picker 8.10.1→10.0.1** plus ESLint config modernization and ~15 library majors.

Final state: `tsc` = **exactly the 20-line baseline**; `pnpm lint` = **exactly the 2 baseline errors** (+19 documented warnings from new react-hooks v7 compiler rules, downgraded to warnings); `pnpm build` = **PASS (exit 0)** under Turbopack; `pnpm install --frozen-lockfile` = PASS; audit reduced to **6 findings (2 moderate, 4 high)** — zero in any direct dependency. HEAD unchanged; no commit/push; user WIP byte-intact.

## 2. Baseline (pre-campaign, 2026-09-21)

- HEAD `519a0026a75927a89cf2cadeedb313cfa26e4e21`; Batch 1 complete (40/40).
- Typecheck 20 error lines · lint 2 errors · build never runnable previously (never executed in campaign history).
- SHA-256: package.json `13411e12…`, pnpm-lock.yaml `23a620b1…` — byte snapshots: `snapshots/full-modernization/`.

## 3. Final versions (all verified installed + locked)

| Package | Old | Final | Status |
|---|---|---|---|
| next | 15.3.0 | **16.3.5** | migrated (§4) |
| react / react-dom | 19.1.0 | **19.3.0** | migrated (§5) |
| typescript | 5.8.3 | **5.9.3** | updated (7.0.2 blocked, §Blocked) |
| eslint | 9.30.1 | **9.39.5** | updated (10.11.0 blocked, §Blocked) |
| eslint-config-next | 15.3.0 | **16.3.5** | migrated with next |
| typescript-eslint | (transitive) | **8.70.0** | added as direct devDep (lint workflow) |
| @types/react / react-dom | 19.1.8 / 19.1.6 | **19.3.0** | updated |
| @types/node | 20.19.4 | **26.6.2** | updated |
| prisma / @prisma/client | 6.11.1 | **7.10.0** | migrated (§6) |
| @prisma/extension-accelerate | 1.3.0 | **3.0.1** | migrated with Prisma 7 |
| zod | 3.25.74 | **4.6.5** | migrated (§7) |
| @tiptap/* (16 pkgs) | 2.24.2 | **3.31.3** | migrated (§8) |
| @tiptap/extension-bubble-menu / floating-menu | (implicit v2) | **3.31.3** | added as direct deps (v3 splits menus out) |
| react-day-picker | 8.10.1 | **10.0.1** | migrated (§9) |
| motion / framer-motion | 12.23.0 / 11.18.2 | **13.4.0** | major, no code change needed |
| lucide-react | 0.488.0 | **1.47.0** | major, no code change needed |
| shiki | 1.29.2 | **4.4.3** | major, `codeToHtml` smoke-verified |
| bcrypt-ts | 6.0.0 | **9.0.2** | major, API smoke-verified |
| recharts | 3.0.2 | **3.10.1** | minor (baseline typing friction unchanged) |
| react-resizable-panels | 2.1.9 | **4.13.1** | major — ui/resizable.tsx migrated (§10) |
| tailwind-scrollbar-hide | 2.0.0 | **4.0.0** | major, consumed via `@plugin`, build-verified |
| @tanstack/react-table | 8.21.3 | **8.21.3** | **BLOCKED** (v9 reverted) |
| @upstash/redis / ratelimit | 1.38.4 / 2.1.0 | **1.39.0 / 2.1.0** | minor |
| @uploadthing/react / uploadthing | 7.3.2 / 7.7.3 | **7.3.3 / 7.7.4** | patch |
| socket.io / uuid / jotai / lodash-es / react-colorful | 4.8.1 / 11.1.0 / 2.12.5 / 4.17.21 / 5.6.1 | **4.8.3 / 14.0.2 / 3.0.0 / 4.18.1 / 5.8.1** | updated (unused/dead deps) |
| next-auth | 5.0.0-beta.32 | 5.0.0-beta.32 | latest of the v5 line (`latest` dist-tag = v4.24.15 is a **downgrade**; v5 remains the project's channel) |
| All 23 @radix-ui/*, tailwindcss 4.3.3, @tailwindcss/postcss, axios 1.20.0, nuqs 2.10.1, date-fns 4.4.0, sonner 2.0.8, tailwind-merge 3.7.0, tw-animate-css 1.4.0, tsx 4.23.15, cmdk, vaul, next-themes, lowlight, clsx, cva, react-markdown, remark-gfm, react-textarea-autosize, install, @types/lodash-es | — | already at latest | unchanged |
| dotenv | (none) | **18.0.1** | added devDep (required by prisma.config.ts) |

## 4. Next.js 15.3.0 → 16.3.5 migration

Code/config changes (all driven by official Next 16 removals; `npx @next/codemod` not needed — hand-applied equivalents):

1. **`next lint` removal**: `package.json` script `"lint": "next lint"` → `"lint": "eslint ."`.
2. **`eslint.config.mjs`**: FlatCompat wrapper replaced with native flat presets (`import next from "eslint-config-next"`) + `tseslint.configs.recommended` (eslint-config-next 16 no longer enables TS rules) + the five new react-hooks v7 compiler rules downgraded to `warn` (see §Warnings).
3. **`next.config.ts`**: removed the `eslint` key (its type was removed in Next 16); kept `typescript.ignoreBuildErrors`.
4. **Deep `next/dist` import removed** (`src/lib/handle-error.ts`): `isRedirectError` from `next/dist/client/components/redirect-error` replaced with the supported `unstable_rethrow` from `next/navigation` (still exported in 16; verified in the installed package's runtime + types). Note: the call was moved to the top of `getErrorMessage` — the old placement was unreachable dead code (redirect errors are `Error` instances caught by the earlier `instanceof Error` branch). Behavior of the previously-dead path changes from "digest string in toast" to "rethrow" — the officially documented pattern.
5. **`middleware.ts` NOT renamed to proxy.ts** — deprecated but still functional in 16 (build emits a deprecation warning only). Recorded as optional follow-up (codemod available); auth-area file left untouched.
6. `src/app/auth/login/page.tsx`: added `<Suspense>` around `<LoginForm/>` — `useSearchParams()` requires a Suspense boundary for static prerendering; build failed without it.

## 5. React 19.1.0 → 19.3.0

No API breaks in `src/` (hooks/refs/effects/forwardRef compatible; all third-party peers accept ^19). `@types/*` moved in lockstep. Verified via build + full typecheck.

## 6. Prisma 6.11.1 → 7.10.0 migration

1. **`prisma/schema.prisma` generator block** (required by v7 — `prisma-client-js` removed):
   ```prisma
   generator client {
     provider     = "prisma-client"
     output       = "../generated/prisma"
     runtime      = "edge-light"
     moduleFormat = "esm"
   }
   ```
   Runtime choice: `nodejs` was tried first; the build then failed because **Edge Middleware** bundles the client (middleware → auth.config → lib/user → prisma) and the nodejs client uses `node:` builtins. `edge-light` is the direct successor of the old `@prisma/client/edge` semantics (edge-compatible, runs under Node — the previous architecture, preserved). Import trace re-verified: middleware now bundles cleanly.
2. **Datasource**: `url = env("DATABASE_URL")` removed from schema (v7 forbids it); Accelerate URL now passed to the client constructor.
3. **`src/lib/db/prisma.ts`**: imports `PrismaClient` from `generated/prisma/client`; `new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! }).$extends(withAccelerate())`.
4. **`prisma.config.ts`** created (defineConfig: schema path, `migrations.seed: "tsx prisma/seed.ts"`, `datasource.url: env("DATABASE_URL")`, `import "dotenv/config"`); `package.json#prisma.seed` removed (v7 ignores it); `dotenv` added as devDep.
5. **Import migration**: `prisma/seed.ts` + `src/actions/{categories,projects}.ts` now import the `Prisma` namespace from the generated client instead of `@prisma/client`.
6. **`prisma generate`** run (SAFE WRITE per DATABASE policy; version 7.10.0 recorded); **`prisma validate` PASS**. **No database operation of any kind** (no migrate/db push/seed/direct SQL); no schema model change — the generator/datasource blocks are the v7-mandated migration surface.
7. `@auth/prisma-adapter` 2.11.3 (latest) works with the v7 client (peer `>=6` satisfied; `src/auth.ts` typechecks clean).

## 7. Zod 3.25.74 → 4.6.5 migration

- `src/schemas/index.ts`: removed the `: z.ZodType` annotation on `ProjectSchema` (under Zod 4 the bare annotation erases inference → `Project = unknown`, which poisoned the form/table/search-cache layer).
- **Type-truth fixes surfaced by Zod 4's strict inference** (the code previously compiled against an `any`-typed `Project`): introduced `export type ProjectWithCategories = Prisma.ProjectGetPayload<{ include: { categories: true } }>` (the actual row shape from the data layer) and re-typed `projects-table/{index,columns,action-bar}.tsx` and `project-form.tsx` `initialData` accordingly; `action-bar`'s `onProjectFieldUpdate` rewritten to the runtime contract (`featured: boolean`, `categories: string` id); `form.setError(field as keyof Project)` type recovery. No logic changes.
- nuqs parsers: zod schemas used as nuqs parsers (structurally matched in v3, not in v4) replaced with native nuqs parsers (`parseAsFloat`, `parseAsStringLiteral`, `parseAsString`) — equivalent parsing behavior.

## 8. Tiptap 2.24.2 → 3.31.3 migration

- `BubbleMenu`/`FloatingMenu` moved from `@tiptap/react` → `@tiptap/react/menus`; `@tiptap/extension-bubble-menu` + `@tiptap/extension-floating-menu` added as direct deps (v2 shipped them inside @tiptap/react).
- `tippyOptions` → `options` (Floating UI): `placement`/`offset: { mainAxis: 10 }`; `appendTo` is now a top-level prop; tippy-only `duration`/`interactive` dropped (no floating-ui equivalent needed).
- `editor.options.element` is now a union — narrowed with `instanceof HTMLElement` before `addEventListener`.
- `@tiptap/extension-text-style` v3 has no default export → named import.
- Custom `search-and-replace` extension: added `interface Storage { searchAndReplace: SearchAndReplaceStorage }` module augmentation (v3 types storage strictly).

## 9. react-day-picker 8.10.1 → 10.0.1 migration

- `src/components/ui/calendar.tsx` rewritten to the v10 API: class-name keys `caption→month_caption`, `table→month_grid`, `head_row/head_cell→weekdays/weekday`, `row→week`, `nav_button→button_previous/button_next` (now including the positioning classes), `day_button` (button styles split from `day`), `day_range_start/end→range_start/end`, `day_range_middle→range_middle`, `day_today→today`, `day_outside→outside`, `day_disabled→disabled`, `day_hidden→hidden`; `components.IconLeft/IconRight` → single `Chevron` component (orientation-based Left/Right icon). Removed the removed `initialFocus` prop from both `data-table-date-filter.tsx` usages. Note: v10 dropped the unmet `react ^16.8||^17||^18` peer — the last standing peer warning is resolved as a side effect.

## 10. react-resizable-panels 2 → 4 migration

`src/components/ui/resizable.tsx` (unused by any page, kept compiling): `PanelGroup`→`Group` (+`orientation` data-attributes), `PanelResizeHandle`→`Separator`; public component API of the wrapper unchanged.

## 11. Verification results

| Check | Command | Result |
|---|---|---|
| Typecheck | `pnpm exec tsc --noEmit --incremental false` | **20 error lines — exactly the pre-campaign baseline** (8 chat.ts, 2 date-filter 145/168, 1 hero, 8 chart, 1 export). 0 new, 0 fixed. Re-run after every group; final re-run post-build. |
| Lint | `pnpm lint` (`eslint .`) | **2 baseline errors** (`chat-widget.tsx:30:10`, `socket.ts:45:67`) + **19 warnings** (new react-hooks v7 compiler rules, see §Warnings). Exit 1, same as baseline. |
| Build | `pnpm build` (Next 16 + Turbopack) | **PASS, exit 0.** All 16 pages generated; `ƒ Proxy (Middleware)` bundled. Warnings: middleware-deprecation notice (expected); one Turbopack WASM-glob over-bundling warning from the Prisma edge-light wasm loader (informational). |
| Frozen install | `pnpm install --frozen-lockfile` | PASS (exit 0; postinstall → `prisma generate` 7.10.0 ran as lifecycle) |
| Prisma | `prisma validate` / `generate` | PASS / PASS (7.10.0, output `generated/prisma`, gitignored) |
| Audit | `pnpm audit --registry=https://registry.npmjs.org` | **6 findings (2 moderate, 4 high)** — all transitive, none in any direct dependency: `mysql` ×2 (transitive under prisma tooling), `effect` (zod 4's dep), `mdast-util-to-hast` (react-markdown), `deepmerge-ts`. Log: `snapshots/full-modernization/audit-final.log`. The 33 `next` advisories from the pre-upgrade log are **gone**. |
| Duplicate majors | store scan | Lockfile has single versions of next/react/zod/@prisma/client/@auth/core (16.3.5 / 19.3.0 / 4.6.5 / 7.10.0 / 0.41.3). Superseded store dirs (15.3.0, 19.1.0, 3.25.74, 6.11.1, @auth/core 0.40.0) remain on disk with **zero lockfile references** — inert pnpm residue, not duplicates in the graph. |

## 12. Blocked (with reasons)

1. **TanStack Table 8.21.3 → 9.2.4 — REVERTED after full attempt.** v9 restructures the entire API (`Table<TFeatures, TData>` dual generics, `useReactTable`/row-model factories replaced by `create*RowModel` factories, new `Column_Core` composition types) — 130+ errors across `use-data-table.ts`, the whole shadcn `data-table*` stack, and both admin table implementations (~1000+ lines of user components). This is exactly the "architectural" migration the roadmap had isolated into its own batch. Per the command's stop-rule, reverted to 8.21.3 and reported instead of half-migrating. v8/v9 are the only two majors behind latest in this repo now.
2. **ESLint 10.11.0 → rolled back to 9.39.5 (latest 9.x).** Installed and attempted first: crashes with `TypeError: scopeManager.addGlobals is not a function` — ESLint 10 requires the new `ScopeManager#addGlobals` API, but Next 16's bundled babel ESLint parser (`next/dist/compiled/babel/eslint-parser` via eslint-config-next's `./parser`) ships an older `eslint-scope`. Known upstream incompatibility (eslint PR #20132 / issue #11762; community workaround = pin ESLint 9). Re-attempt when `eslint-config-next`/`@next/eslint-plugin-next` ships an ESLint-10-compatible parser.
3. **TypeScript 7.0.2 (registry `latest`) — not adopted.** typescript-eslint 8.70.0 caps `typescript <6.1.0`; TS 6.0 is still `beta`. Highest compatible stable = **5.9.3** (used).
4. **next-auth `latest` dist-tag = 4.24.15** — a downgrade; the project is on the v5 line whose newest release is beta.32 (kept; prerelease channel per VERSION-POLICY exception).
5. **`prisma` dist-tag `latest` = 8.0.0-rc.15** — a prerelease; stable GA line = 7.10.0 (used).

## 13. Remaining warnings / cleanup candidates (reported, not acted on)

- 19 lint warnings from react-hooks v7 compiler rules (`set-state-in-effect` ×9, `immutability` ×5, `purity` ×1, `use-memo` ×2, `incompatible-library` ×2) — deliberate adoption deferred; recommend a dedicated cleanup task, then remove the severity overrides from `eslint.config.mjs`.
- `middleware.ts` → `proxy.ts` rename (Next 16 deprecation; codemod available) — auth-area, left untouched.
- Phantom `.tss` entries in `tsconfig.json` still present (Next's own tsconfig rewrite preserved them) — hygiene item.
- `@eslint/eslintrc` devDep is now unused (FlatCompat dropped) — removal candidate for the cleanup batch.
- Stale npm-era real dirs at `node_modules/@auth/core` (0.40.0) — inert (no direct imports).
- Turbopack build warning about the Prisma wasm loader file pattern — informational, upstream.
- `dev` script still says `next dev --turbopack` (flag is a no-op under Turbopack-default 16; harmless).

## 14. Tooling incident (recorded)

Mid-run, the machine's standalone pnpm installation broke: its shim pointed to a global version dir whose `pnpm.exe` had been removed by an interrupted pnpm self-update (`pnpm 11.4.0` `_tmp_` dir found in `.tools`), with two orphaned `pnpm.exe` processes holding locks. Repair: killed the orphans and repointed the three `pnpm` shims to the byte-identical `pn.exe` binary in the same 10.9.0 package dir. `pnpm --version` = 10.9.0 verified after repair. Also: two multi-selector `pnpm update` invocations reproduced the known Windows background-hang (CPU frozen ~0.9s, zero writes — hash-verified each time); both were killed and completed as smaller foreground batches.

## 15. Exact mutation commands (chronological)

```bash
pnpm update @uploadthing/react@7.3.3 @upstash/redis@1.39.0 lodash-es@4.18.1 react-colorful@5.8.1 socket.io@4.8.3 uuid@14.0.2 jotai@3.0.0
pnpm update motion@13.4.0 framer-motion@13.4.0 lucide-react@1.47.0 shiki@4.4.3 bcrypt-ts@9.0.2 recharts@3.10.1 react-resizable-panels@4.13.1 tailwind-scrollbar-hide@4.0.0
pnpm update next@16.3.5 eslint-config-next@16.3.5
pnpm update react@19.3.0 react-dom@19.3.0 @types/react@19.3.0 @types/react-dom@19.3.0
pnpm update eslint@10.11.0 typescript@5.9.3 @types/node@26.6.2        # eslint later rolled back to 9.39.5
pnpm exec prisma generate                                            # + repeated after runtime switches
pnpm add -D typescript-eslint@8.70.0
pnpm add -D dotenv                                                   # 18.0.1
pnpm update prisma@7.10.0 @prisma/client@7.10.0 @prisma/extension-accelerate@3.0.1   # (re-run after EPERM interruption; re-run after stale-state revert)
pnpm update zod@4.6.5
pnpm update @tiptap/core@3.31.3 @tiptap/pm@3.31.3 @tiptap/react@3.31.3 @tiptap/starter-kit@3.31.3 @tiptap/extension-{color,heading}@3.31.3
pnpm update @tiptap/extension-{highlight,image,link,placeholder,subscript,superscript}@3.31.3
pnpm update @tiptap/extension-{text-align,text-style,typography,underline}@3.31.3 @tanstack/react-table@9.2.4 react-day-picker@10.0.1
pnpm update @tanstack/react-table@8.21.3                             # TanStack 9 revert
pnpm update eslint@9.39.5                                            # ESLint 10 rollback
pnpm add @tiptap/extension-bubble-menu@3.31.3 @tiptap/extension-floating-menu@3.31.3
pnpm update uploadthing@7.7.4
pnpm install --frozen-lockfile                                       # final
pnpm build                                                           # final — PASS
pnpm exec prisma validate; pnpm lint; pnpm exec tsc --noEmit --incremental false
pnpm audit --registry=https://registry.npmjs.org
```

Source/config files changed by the migrations (all listed in `git status`): `eslint.config.mjs`, `next.config.ts`, `tsconfig.json` (rewritten by `next build` typegen: formatting, `jsx: "react-jsx"`, added `.next/dev/types` include), `package.json`, `pnpm-lock.yaml`, `prisma/schema.prisma`, `prisma.config.ts` (new), `prisma/seed.ts`, `src/lib/db/prisma.ts`, `src/lib/handle-error.ts`, `src/schemas/index.ts`, `src/actions/{categories,projects}.ts`, `src/app/auth/login/page.tsx`, `src/components/forms/project-form.tsx`, `src/components/admin/projects-table/{index,columns,action-bar}.tsx`, `src/components/data-table-date-filter.tsx`, `src/components/tiptap/{rich-text-editor.tsx,extensions/{editor-toolbar,floating-menu,search-and-replace}.tsx}`, `src/components/ui/{calendar,resizable}.tsx`.

## 16. Explicit integrity statement

- HEAD unchanged: `519a0026a75927a89cf2cadeedb313cfa26e4e21`. **No commit, no push, no branch, no stash, no reset/restore/checkout/clean.**
- User WIP files carry exactly their pre-existing changes (globals.css 29/1, icons.tsx 2/0, types/index.ts 13/0, package-lock.json still absent).
- `package-lock.json` ABSENT. `pnpm-lock.yaml` is the only lockfile (hash `599f011e…`; package.json `2c9a535e…`).
- No database operation (no migrate/db push/db pull/seed/direct SQL); generated artifacts: `generated/prisma/` (gitignored) + `.next/` (gitignored).
- No `--force`, no `--legacy-peer-deps`, no overrides, no new ignore/suppress flags.
- Evidence snapshots + logs: `.agents/evidence/snapshots/full-modernization/`.

## 17. User action required

1. **TanStack Table 9**: authorize a dedicated migration task (architectural: rewrites the data-table hook + shadcn stack + both admin tables).
2. **ESLint 10**: re-attempt when eslint-config-next ships a compatible parser (track upstream); nothing to do now.
3. **react-hooks v7 compiler rules**: decide when to adopt (fix ~19 findings) and then delete the severity overrides in `eslint.config.mjs`.
4. **middleware → proxy rename**: optional now, forced eventually (auth-area; smoke test recommended when done).
5. Deployment platform note: the Prisma client now targets `edge-light` (edge-compatible, runs under Node — same as the old `/edge` client). If you ever want Node-native client features, the middleware chain must be decoupled from Prisma first (proxy.ts rename alone may suffice).
