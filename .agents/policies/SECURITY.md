# Policy: Security

Baseline security requirements for all agent work. Discovered issues are **reported and gated**,
never remediated in passing.

## Requirements by area

- **Secrets:** never commit secrets (`.env*` is gitignored — keep it that way). Never print, log,
  or paste secret values into evidence; use variable names only. Never move secrets into code or
  docs. Adding a new environment variable requires documentation and an approval.
- **Authentication (Auth.js v5, credentials + JWT):** changes to `src/auth.ts`, `src/auth.config.ts`,
  session strategy, token callbacks, or the login flow are gated (Gate #9). Do not weaken password
  handling (`bcrypt-ts` hashing; seed uses 12 rounds) or session expiry.
- **Authorization:** role checks currently live in middleware (`/admin/:path*`, `/auth/:path*`
  matcher), the UploadThing middleware (`role === "admin"`), and `/api/admin`. Any change to role
  logic or route protection is gated (Gate #10). New protected surfaces must re-check authorization
  **inside** the route/action — middleware does not cover all paths.
- **Environment variables:** validate presence before use in new code paths; never assume a variable
  exists (note: `src/lib/socket.ts` reads `NEXTAUTH_SECRET`, which is absent from `.env` — reported,
  not fixed).
- **Database access:** only via the shared client in `src/lib/db/prisma.ts`. No ad-hoc clients, no
  raw connection strings.
- **Server actions:** all user input must pass Zod validation at the action boundary
  (existing pattern: `safeParse` + typed schemas in `src/schemas/`). Mutations must check
  authorization where the resource is admin-owned. Keep the `{ error } / { success }` return pattern.
- **API routes:** re-verify auth inside each handler (see `/api/admin/route.ts` for the pattern).
- **Uploads:** UploadThing routes must keep the admin-only middleware check and file size/count
  limits; changes are gated (Gate #12).
- **Rate limiting:** keep Upstash-based limits on public surfaces (uploads, chat) when modifying them.
- **Input validation:** never trust client data — forms, URL params (`nuqs` parsers), and action
  payloads are all untrusted at the boundary.

## Dependency vulnerabilities

- Read-only audits (`pnpm audit`) may be run and reported.
- Never "fix" a vulnerability by upgrading silently — upgrades follow
  `.agents/versioning/UPGRADE-WORKFLOW.md` with gates.

## Known security-relevant observations (report & gate — do NOT fix in passing)

Recorded from Phase 0; each needs its own investigated, approved task:

1. `next.config.ts` ignores TypeScript and ESLint errors during builds.
2. `ADMIN_PASSWORD` is stored in plaintext in `.env` (README documents a trivial example value).
3. User roles are a free-text string on the `User` model, not an enum.
4. Middleware matcher covers only `/admin/:path*` and `/auth/:path*`; per-route checks must carry
   the rest (and currently do, variably).
5. `src/lib/handle-error.ts` has an unreachable `AuthError` branch (generic `Error` returns first).
6. `src/lib/socket.ts` references `NEXTAUTH_SECRET`, which does not exist in `.env`.
7. `next-auth` is on a beta line (`5.0.0-beta.29`).

## Incident rule

If agent work exposes a secret, breaks auth, or enables unauthorized access: stop, report
immediately with full evidence, and propose containment — do not attempt silent repairs.
