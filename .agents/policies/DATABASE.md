# Policy: Database Safety

## Established facts (Phase 0, 2026-09-20)

- **ORM:** Prisma 6 (edge client `@prisma/client/edge` + `@prisma/extension-accelerate`).
- **Database:** PostgreSQL (`datasource db { provider = "postgresql" }`), reached through
  **Prisma Accelerate** — connections go via the Accelerate proxy, not direct TCP.
- **No migrations directory exists** (`prisma/migrations/` absent). The migration history of the
  live database is **unknown** and cannot be assumed from `schema.prisma`.
- **Known inconsistency:** `src/actions/chat.ts` queries `prisma.conversation`, but no
  `Conversation` model exists in the schema. This is recorded evidence
  (see `.agents/evidence/DISCOVERY-BASELINE.md`), not something to fix in passing.

## Command risk table

| Command | Risk class | Human approval | Notes |
|---|---|---|---|
| `prisma validate` | READ-ONLY | No | Parses the schema file only |
| `prisma generate` | SAFE WRITE | No | Writes only generated artifacts (gitignored `node_modules/`, `generated/prisma/`). Record generated client version as evidence |
| `prisma format` | HIGH-RISK WRITE | Yes | Rewrites `prisma/schema.prisma` (protected path) |
| `prisma migrate dev` | HIGH-RISK WRITE | **Yes** | Creates migration files **and** applies them to a database. The first-ever migration must reconcile schema vs. unknown live state |
| `prisma migrate deploy` | HIGH-RISK WRITE | **Yes** | Applies migrations to a database |
| `prisma db push` | HIGH-RISK WRITE | **Yes** | Forces the database to match the schema; **may drop columns/tables/data** |
| `prisma migrate reset` | DESTRUCTIVE | **Yes — explicit** | Drops all data |
| `prisma db pull` | HIGH-RISK WRITE | **Yes** | Overwrites `prisma/schema.prisma` (protected path) |
| `prisma seed` | HIGH-RISK WRITE | **Yes** | Writes rows to the database (`prisma/seed.ts` creates the admin user) |
| Direct SQL against the database | DESTRUCTIVE unless proven read-only | **Yes** | Also: Accelerate connectivity may make direct connections impossible — do not assume either way |

## Rules

1. **Database state must not be assumed from the schema alone.** Absent migration history, agents
   know nothing reliable about the live database's shape.
2. Never execute any command from the HIGH-RISK/DESTRUCTIVE rows without a granted gate
   (`policies/APPROVALS.md`).
3. **Database-impact assessment is mandatory before any schema change**, and must state:
   - models/fields/indexes touched; nullability and data-loss risk;
   - migration strategy (given that no migration history exists, how will schema and live DB be reconciled?);
   - rollback plan;
   - Accelerate/driver implications (the CLI may not connect directly through the Accelerate proxy —
     connectivity must be verified before promising a migration path).
4. Prefer additive, backward-compatible schema evolution; destructive schema changes always require
   a human gate **and** an explicit data-loss acknowledgment.
5. Never point `DATABASE_URL` anywhere else, never inline credentials, never print connection strings.
6. No database operation is performed "to test" something. Use `prisma validate` and reading the
   schema instead.
