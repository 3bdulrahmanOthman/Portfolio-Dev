# Discovery Baseline — Phase 0 (2026-09-20)

> **Point-in-time snapshot.** This documents the repository as found during the read-only
> discovery phase. It is historical evidence, **not** a description of current state, and it is
> **not** a claim of health. Re-verify before relying on any item.

## Repository identity

- Next.js portfolio + admin dashboard; `main` branch, 10 commits ahead of `origin/main`.
- **Dirty working tree (pre-existing user work, protected):** modified `package.json`,
  `package-lock.json`, `pnpm-lock.yaml`, `src/app/globals.css`, `src/components/icons.tsx`,
  `src/types/index.ts`; deleted `src/app/page.tsx`; untracked `src/app/(home)/`, landing-page
  components, several `ui/` additions, `src/config/site.ts`, `public/*.webp`, `.stfolder/`,
  `.sync/`, `portfolio-dev.zip` (141 MB).

## Validation baseline

| Check | Result | Notes |
|---|---|---|
| `prisma validate` | PASS | Schema valid; deprecation warning: `package.json#prisma` → `prisma.config.ts` before Prisma 7 |
| Typecheck (`tsc --noEmit --incremental false`) | **FAIL — 27 errors** | Clusters: stale/missing generated Prisma client (`TS2694` on `UserCreateInput`, `ProjectWhereInput`, `CategoryWhereInput`…), 6 × implicit `any`, zod↔`@hookform/resolvers` overload mismatch (`project-form.tsx`), Recharts v3 typing (`ui/chart.tsx`), missing button variant `"glow"` (`sections/hero/default.tsx`), `lib/export.ts` |
| Lint (`next lint`) | **FAIL — 2 errors** | `chat-widget.tsx:30` unused var; `lib/socket.ts:45` explicit `any` |
| Tests | NOT AVAILABLE | No framework, no test files, no config |
| Build | NOT RUN | Generates artifacts; also **not a trusted gate** (see below) |

## Known baseline findings (documentation of discovered state — do not fix from here)

1. **Build checks ignored:** `next.config.ts` sets `typescript.ignoreBuildErrors: true` and
   `eslint.ignoreDuringBuilds: true`.
2. **No migrations directory** (`prisma/migrations/` absent); database state unknown.
3. **Stale/missing generated Prisma client** — typecheck shows generated client types lacking
   current schema members; `postinstall: prisma generate` may not have run after the pnpm switch.
4. **Mixed lockfile state:** `package-lock.json` emptied to a stub (uncommitted npm→pnpm
   transition), `pnpm-lock.yaml` authoritative; `node_modules` contains artifacts of both npm and pnpm.
5. **Dead/unreachable socket implementation:** `src/lib/socket.ts` is a Pages-Router handler in
   `lib/` (no `pages/` directory exists); references `NEXTAUTH_SECRET`, which is absent from `.env`.
6. **Chat/schema mismatch:** `src/actions/chat.ts` queries `prisma.conversation`; no `Conversation`
   model exists in `schema.prisma`.
7. **No tests, no CI** (no `.github/`), no Prettier (README's claims about Prettier and CI are stale).
8. **tsconfig** includes two nonexistent files: `src/app/admin/projects/page.tss`,
   `src/app/admin/inbox/page.tss`.
9. `install` meta-package present in dependencies (accidental); both `framer-motion` and `motion` declared.
10. Security-relevant observations (details in `policies/SECURITY.md`): plaintext `ADMIN_PASSWORD`
    in `.env`; role as free-text string; unreachable `AuthError` branch in `handle-error.ts`;
    middleware matcher covers only `/admin/*` and `/auth/*`.
11. README drift: claims Prettier, CI lint/typecheck, "PlanetScale or other provider".

## Stack versions (see `../versioning/CURRENT-BASELINE.md` for the governance record)

Next 15.3.0 · React 19.1.1 · TypeScript 5.9.2 · Prisma 6.15.0 · PostgreSQL (Accelerate) ·
Tailwind 4.1.12 · next-auth 5.0.0-beta.29 · ESLint 9.34.0 · Zod 3.25.76 · Node v25.9.0 (machine) ·
pnpm 10.9.0.
