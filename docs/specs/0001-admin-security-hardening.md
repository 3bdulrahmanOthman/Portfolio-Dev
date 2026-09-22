# 0001 · Admin security hardening

**Status**: Accepted (engineer-approved Phase 2A plan, 2026-09-22)
**Date**: 2026-09-22
**Mode**: ENHANCEMENT / CROSS-CUTTING (auth)
**Code area**: `src/components/forms/login-form.tsx`, `src/actions/login.ts`, `src/lib/rate-limit.ts`, `src/auth.config.ts`, `src/app/admin/layout.tsx`, `src/actions/{projects,categories,activity}.ts`, `scripts/rotate-admin-password.ts`

## Summary

Close the confirmed Critical/High security findings from the 2026-09-22 audit:
credentials shipped in the client bundle, no admin-role gate on `/admin`,
no login rate limiting, and account-enumerable login responses. Chat is
explicitly out of scope and untouched.

## Requirements

- AC-1: No credential material exists in client code or the client bundle.
- AC-2: The exposed admin password is rotated via a one-off script that never
  echoes secret values (engineer supplies the new value privately).
- AC-3: `/admin` pages and the 7 verified admin-only reads
  (`getProjects`, `getProjectStats`, `getFeaturedProjects`, `getCategories`,
  `getCategoryStats`, `getTopCategoriesStats`, `getRecentActivity`) reject
  non-admin sessions server-side; anonymous users never see admin UI.
- AC-4: Login attempts are rate limited: 5 attempts / 15 minutes / IP,
  fail closed (Redis outage blocks login with a generic error).
- AC-5: Unknown email and wrong password produce byte-identical responses,
  and the "user not found" path is timing-equalized against a dummy bcrypt
  hash so timing cannot enumerate accounts.
- AC-6: Existing server-side role checks on all mutations remain untouched.

## Decision

- Credentials removed from `login-form` defaults (empty strings).
- Role gate lives in `admin/layout.tsx` (uses full `auth()` whose `jwt`
  callback refreshes role from the DB), not middleware: middleware runs
  `authConfig`, which has no `jwt`/`session` callbacks, so `req.auth` does
  not carry `role`. `/auth/unauthorized` must never be added to
  `authRoutes` (redirect loop).
- Read guards run OUTSIDE `unstable_cache` closures (`auth()` reads
  cookies; cookies inside a cache scope is a runtime error). Unauthorized
  calls return their empty shape.
- Rate limiting reuses `lib/rate-limit.ts` (Upstash Redis, sliding window,
  already provisioned); new `login` context; keyed `login_<ip>` from
  `x-forwarded-for` / `x-real-ip` / `"unknown"`.
- Login action: pre-`signIn` user lookup deleted; every `AuthError` maps to
  one generic message; rate-limit/limiter failures return a generic
  throttle message (fail closed).
- `authorize` runs `compare(password, DUMMY_HASH)` when no user is found.
- JWT session revocation after rotation is deferred (accepted 30-day token
  lifetime); no schema changes.

## Consequences

- Admin reads are admin-only; future public pages need their own fetch path.
- Redis outage = login lockout window (accepted fail-closed trade-off).
- IP keying trusts `x-forwarded-for` from the platform/proxy.
- Rate limiter still throws `UploadThingError` (shared with chat; cleanup
  deferred while chat is frozen).

## Build plan

- [x] Remove credentials from `login-form.tsx` (AC-1)
- [x] Add `scripts/rotate-admin-password.ts` (AC-2; execution approval-gated)
- [x] Role guard in `admin/layout.tsx` (AC-3)
- [x] Read guards: projects ×3, categories ×3, activity ×1 (AC-3)
- [x] `login` context + rate limit in login action (AC-4)
- [x] Unified login errors + dummy-hash timing equalization (AC-5)
- [x] Verification pass (tsc / eslint / credential search / routing / regression)

## Follow-up

- Engineer runs the rotation script and updates `.env` privately.
- Rate-limit error type cleanup when chat is resolved (delete or rebuild).
- next-auth beta `redirectTo` same-origin restriction confirmation.
- Public pages (projects/about) will need a public read path when built.
