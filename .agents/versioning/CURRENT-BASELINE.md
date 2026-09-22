# CURRENT BASELINE — NOT TARGET VERSIONS

> Recorded 2026-09-20 from the Phase 0 discovery audit (evidence:
> `../evidence/DISCOVERY-BASELINE.md`). These are the versions the repository runs **today**.
> Nothing here is a recommendation, and **no target versions are defined in this file**.
> Targets will be determined by the future read-only Dependency Upgrade Audit
> (see `TARGET-POLICY.md`).

| Technology | Current version | Evidence | Notes |
|---|---|---|---|
| Node.js (local machine) | v25.9.0 | `node --version` | No `engines` field in package.json; machine-specific |
| Package manager | pnpm 10.9.0 | `pnpm --version`; `packageManager` field | Matches declared pin incl. sha512. npm 11.9.0 also present on machine |
| Lockfile state | Mixed | `package-lock.json` stubbed (empty, uncommitted change); `pnpm-lock.yaml` authoritative | npm→pnpm transition in progress |
| Next.js | 15.3.0 | installed `node_modules/next/package.json` | App Router; Turbopack dev; `next lint` deprecated |
| React / React DOM | 19.1.1 | installed package.json | |
| TypeScript | 5.9.2 | installed package.json | strict mode |
| Prisma (CLI) | 6.15.0 | installed package.json | declared `^6.11.1` |
| @prisma/client | 6.15.0 | installed package.json | edge client (`@prisma/client/edge`) |
| Prisma Accelerate extension | declared `^1.3.0` | package.json | installed version not separately verified in Phase 0 |
| Database provider | PostgreSQL | `prisma/schema.prisma` datasource | Reached via Prisma Accelerate proxy |
| Auth.js / next-auth | 5.0.0-beta.29 | installed package.json | **prerelease line** — baseline fact, not a target |
| Tailwind CSS | 4.1.12 | installed package.json | v4 CSS-first; `@tailwindcss/postcss` |
| ESLint | 9.34.0 | installed package.json | flat config via `@eslint/eslintrc` 3.3.1 |
| Zod | 3.25.76 | installed package.json | v3 API in use |
| Testing | **none** | no framework/files/config | |
| Formatting | **none** | no Prettier config/dependency | README claim is stale |

Environment/health facts that bound upgrade work: generated Prisma client stale/missing
(typecheck evidence); no migrations directory; build ignores TS/ESLint errors; `install`
meta-package and duplicate animation libs (`framer-motion` + `motion`) present in dependencies.
