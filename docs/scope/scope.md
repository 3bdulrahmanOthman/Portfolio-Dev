# Scope: Developer Portfolio & CMS

A single-author developer portfolio with a public site (projects, case studies, about, contact) and an admin dashboard/CMS (projects, content editor, media, GitHub sync). Serves Abdulrahman Othman as a portfolio and the engineering behind it.

**Build approach:** Tracer Bullet (one real content path end to end — admin content through the public read layer to a rendered public page — before breadth).
**Workflow:** Beta (after `/develop`: `/check verify`, then `/test`). Security-critical rows carry `· GA`.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Auth & admin security | Foundation | existing |
| 2 | Admin CMS (projects, categories, about, contact, settings) | Foundation | existing |
| 3 | Dashboard overview | Foundation | existing |
| 4 | Public hero & navigation | Foundation | existing |
| 5 | Baseline commit & repo hygiene | Foundation | planned |
| 6 | Prisma migrations baseline | Foundation | planned · needs a decision |
| 7 | Chat decision & cleanup | Foundation | planned · needs a decision |
| 8 | Testing strategy & framework | Foundation | planned · needs a decision |
| 9 | CI expansion (test job) | Foundation | planned |
| 10 | Public read layer | Public | planned · needs a decision · GA |
| 11 | Design system reference | Public | planned · needs a decision |
| 12 | Public redesign & responsive UX | Public | planned |
| 13 | Project & case-study pages | Public | planned |
| 14 | Media architecture & management | Content | planned · needs a decision |
| 15 | Content serialization & Editor 2.0 | Content | planned · needs a decision |
| 16 | Draft / publish / revisions | Content | planned · needs a decision |
| 17 | Project relationships & types | Content | planned · needs a decision |
| 18 | GitHub integration & README sync | Integrations | planned · needs a decision |
| 19 | SEO & metadata | Integrations | planned |
| 20 | Public search & filtering | Integrations | planned |
| 21 | Analytics | Integrations | planned · needs a decision |
| 22 | Security & debt cleanup track | Hardening | planned |

## Foundations (existing, enrolled for context)

### 1. Auth & admin security · existing
Auth.js v5 credentials + JWT, admin role gate, read guards, login rate limiting, UploadThing admin gate. code in `src/auth.ts`, `src/middleware.ts`, `src/app/admin/layout.tsx`

### 2. Admin CMS · existing
Projects/categories CRUD with tables, bulk ops, CSV export; About/Contact singleton editors; user settings. code in `src/app/admin/`, `src/actions/`

### 3. Dashboard overview · existing
Stat cards, Recharts top-categories chart, featured-projects table, recent activity. code in `src/app/admin/page.tsx`, `src/components/admin/overview/`

### 4. Public hero & navigation · existing
Static home hero, side header nav, theme toggle; no public data fetching yet. code in `src/app/(home)/`, `src/components/main-hero.tsx`

## Phase 3A: Foundation

### 5. Baseline commit & repo hygiene
Protect the verified Phase 2B baseline and clear repo hygiene debt before any new work.
**Done when:** working tree is committed and pushed; `portfolio-dev.zip` gitignored; `.env` holds only live credential names.
- [x] Commit + push the baseline (engineer action)
- [x] Hygiene pass: zip ignore, stale `.env` credential removal, README drift, directory typo: `/audit baseline hygiene`

### 6. Prisma migrations baseline · needs a decision
Establish `prisma/migrations` so every later schema change (media, workflow, relations) has a governed history.
**Done when:** an initial migration reproduces the current schema and the DB gate covers future migrations.
- [ ] Decide the baseline approach + design it (spec): `/architect prisma migrations baseline`

### 7. Chat decision & cleanup · needs a decision
Delete or rebuild the frozen chat vertical; either way retire its waiver, pinned dependencies, and shared rate-limit error type.
**Done when:** chat files either deleted (waiver + `socket.io` + error-type debt gone) or a rebuild spec exists; zero waived tsc errors.
- [ ] Decide + design it (spec): `/architect chat decision & cleanup`

### 8. Testing strategy & framework · needs a decision
Pick the framework and what gets tested (units for lib/parsers/schemas, e2e for admin flows, visual for public), so the risky Content-track refactors are safe.
**Done when:** framework chosen in a spec, test runner runs locally and one smoke test passes.
- [ ] Decide + design it (spec): `/architect testing strategy & framework`

### 9. CI expansion
Extend CI beyond typecheck + lint once a framework exists (test job, then visual/e2e jobs as suites land).
**Done when:** CI runs the test suite on every PR.
- [ ] Design it (spec): `/architect CI expansion`
- [ ] Build it: `/develop CI expansion`

## Phase 3B: Public (depends on 5–7; 10 blocks everything here)

### 10. Public read layer · needs a decision · GA
An unguarded, cache-conscious fetch layer for public pages, with its own security review (today every read action is admin-gated).
**Done when:** public pages can fetch projects/about/contact without admin credentials and cannot mutate; security review passes.
- [ ] Decide the security shape + design it (spec): `/architect public read layer`

### 11. Design system reference · needs a decision
A visual reference (type, color, spacing, components) so the redesign and every later public page are cohesive.
**Done when:** `design.md` exists and covers the public surface.
- [ ] Decide the direction + design it (spec): `/architect design system reference`

### 12. Public redesign & responsive UX
Content-driven public shell: real nav/footer, responsive layouts, home page beyond the static hero. Requires 10 + 11 + 7.
**Done when:** the home page renders real content from the public read layer, responsive, on the design system.
- [ ] Design it (spec): `/architect public redesign & responsive UX`

### 13. Project & case-study pages
Slug pages rendering project content, links, and categories; case-study-grade presentation. Requires 10; renders existing HTML content first, Editor 2.0 output later.
**Done when:** `/projects` and a project detail page render from the DB, responsive.
- [ ] Design it (spec): `/architect project & case-study pages`

## Phase 3C: Content platform (parallel to 3B; schema work needs 6, refactors need 8)

### 14. Media architecture & management · needs a decision
Asset records for uploads (browse, reuse, alt text, replacement) beyond bare URL strings.
**Done when:** uploads create trackable assets and a picker exists in the admin.
- [ ] Decide storage shape + design it (spec): `/architect media architecture & management`

### 15. Content serialization & Editor 2.0 · needs a decision
Move beyond HTML strings (structured document, portable format), rebuild the image pipeline on 14, and modernize the editor's heavy extensions.
**Done when:** content stores in the chosen format with a migration path for existing records, and the editor reads/writes it.
- [ ] Decide the format + design it (spec): `/architect content serialization & editor 2.0`

### 16. Draft / publish / revisions · needs a decision
Status model and revision history; decides what the public read layer exposes.
**Done when:** content has publish states and revisions, and only published content is public.
- [ ] Decide the model + design it (spec): `/architect draft publish revisions`

### 17. Project relationships & types · needs a decision
Richer relations than the current M:N categories (project kinds, related projects, ordering).
**Done when:** projects can be typed, related, and ordered without breaking migrations.
- [ ] Decide the model + design it (spec): `/architect project relationships & types`

## Phase 3D: Integrations (need the public surface from 3B)

### 18. GitHub integration & README sync · needs a decision
Sync repo metadata and READMEs into projects; access strategy and sync direction are open decisions.
**Done when:** a project can be linked to a repo and its README/metadata synced on demand.
- [ ] Decide access + sync shape + design it (spec): `/architect github integration & readme sync`

### 19. SEO & metadata
Per-page metadata, sitemap, robots, OG images, structured data. Requires 12–13.
**Done when:** every public page emits correct metadata and a sitemap exists.
- [ ] Design it (spec): `/architect seo & metadata`

### 20. Public search & filtering
Public search/filter across projects. Requires 13.
**Done when:** visitors can filter/search projects on the public site.
- [ ] Design it (spec): `/architect public search & filtering`

### 21. Analytics · needs a decision
Public analytics approach (external vs self-hosted vs none) and dashboard surfacing.
**Done when:** traffic measurement works and its privacy trade-off is recorded.
- [ ] Decide the approach + design it (spec): `/architect analytics`

## Phase 3E: Hardening (continuous; can run in parallel with everything)

### 22. Security & debt cleanup track
Role enum + safer default, login `redirectTo` same-origin confirmation, `.env` credential hygiene, rate-limiter construction/error-type cleanup, React Compiler warning adoption, README/docs sync.
**Done when:** the Phase 0 security observations list is empty and no waivers remain.
- [ ] Capture the full debt list + sequencing: `/audit security & debt cleanup`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Blog & posts**: long-form writing beyond case studies · needs a decision
- **i18n**: multilingual public site · needs a decision
- **Multi-user roles**: teams beyond the single admin · needs a decision
- **Comments**: visitor interaction on projects · needs a decision

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. `/architect` captures it and fills the built-ready shape; other skills tick execution boxes.
**Feature lifecycle**: `planned` → `in-progress` → `done`, plus `existing` (pre-workflow, no task list) and `dropped`.
**Next step** = the first unticked box. **needs a decision** = run `/architect` first. **Workflow** default is Beta (`/check verify` then `/test`); per-feature tags override.
**Pointer line** (`spec <n> · code in <path>`): filled by `/architect` and `/develop` as they land.
