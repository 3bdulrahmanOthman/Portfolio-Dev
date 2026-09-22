# Skills Architecture

Project skills are **on-demand knowledge modules** for stack-specific work. They are not generic
"clean code" advice — engineering principles live in `policies/`; skills carry **this project's**
conventions, versions, and pitfalls.

## Current status

**Architecture only — no skills are populated yet, and no third-party skills are installed.**
This file defines how they will work when adopted.

## Planned skills (to be authored/adopted in later phases)

| Skill | Scope | Source material |
|---|---|---|
| `nextjs-app-router` | Route groups, server/client components, caching, `revalidatePath`, metadata | Official Next.js guidance, adapted to v15 + this repo |
| `prisma-data-layer` | Edge client + Accelerate specifics, schema conventions, query patterns, the no-migrations caveat | Prisma docs + Phase 0 findings |
| `server-actions` | This repo's action pattern: `"use server"`, Zod `safeParse` boundaries, `{error}/{success}` returns, auth checks | `src/actions/*`, `src/schemas/*` |
| `shadcn-ui-tailwind4` | Component conventions, CSS-first Tailwind v4 theme, cva variants, this repo's `ui/` layout | shadcn docs + `src/components/ui/*` |
| `authjs-credentials` | Auth.js v5 beta specifics in this repo: JWT strategy, role augmentation, middleware matcher | `src/auth*.ts`, `src/middleware.ts` |
| `security-baseline` | Validation boundaries, upload rules, rate limiting, secret handling | `policies/SECURITY.md` + code |
| `testing-strategy` | To be defined when a test framework is adopted (none exists today) | — |

## Required properties

1. **Version-aware** — states which project/dependency versions it applies to (checked against
   `versioning/CURRENT-BASELINE.md`); stale skills are flagged, not silently trusted.
2. **Scoped** — covers one coherent area; no omnibus skills.
3. **Discoverable** — indexed in the table above; a skill not listed here does not exist.
4. **Loaded on demand** — the orchestrator names the skills a task needs; agents do not preload them.
5. **Vendor-neutral** — plain Markdown, no runtime-specific syntax; adapters may link, not embed.

## File format

```
.agents/skills/<skill-name>/SKILL.md
├── name, version-scope, trigger conditions (front matter or header block)
├── conventions (with file:line references to this repository)
├── pitfalls (known failure modes in this codebase)
└── verification hooks (which checks prove correct usage)
```

## Adoption rule

Third-party guidance (Next.js, Prisma, React/Vercel, security, testing) is **adapted**, never
dumped wholesale: each adopted skill must be reconciled with this repository's actual patterns and
versions, and cite the source it derives from.
