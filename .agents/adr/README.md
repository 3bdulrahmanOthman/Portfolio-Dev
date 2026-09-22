# Architecture Decision Records (ADR)

ADRs record decisions with lasting architectural consequences, so future agents inherit *why*,
not just *what*.

## Process

1. ADRs are numbered `ADR-NNNN-<slug>.md` and indexed in the table below.
2. Statuses: **PROPOSED → ACCEPTED → SUPERSEDED** (or **REJECTED**). Superseding an ADR creates a
   new one and links both ways; accepted ADRs are not edited in place.
3. An ADR is proposed by the **architect** role from evidence; **acceptance of decisions in gated
   areas belongs to a human** (see `../policies/APPROVALS.md`).
4. No unsupported architectural claims: every ADR cites repository evidence or researcher sources.

## Template

```markdown
# ADR-NNNN: <title>
**Status:** PROPOSED | ACCEPTED | SUPERSEDED by ADR-MMMM | REJECTED
**Date:** YYYY-MM-DD

## Context
Problem, forces, and evidence (with citations).

## Decision
What is decided, stated plainly.

## Consequences
Positive, negative, and what becomes easier/harder.

## Alternatives considered
Options rejected and why.

## Evidence
Links to audit records, research briefs, baseline files.
```

## Index

| ADR | Title | Status |
|---|---|---|
| [ADR-0001](ADR-0001-agent-os-is-vendor-neutral.md) | Agent OS is Vendor Neutral | ACCEPTED |

## Deliberately open decisions (require investigation + human approval — no ADR yet)

- Fate of the **chat subsystem** (dead code vs. repair — depends on whether a `Conversation` model
  and real-time behavior are wanted).
- Fate of the **socket subsystem** (`src/lib/socket.ts` is unreachable in this App Router project).
- **Deployment platform** (Vercel assumed, unconfirmed).
- **Prisma Accelerate** keep-or-drop (affects local dev, DB tooling, and cost).
- **Lockfile migration** (finish the npm→pnpm transition; remove the stubbed `package-lock.json`).
- **Dependency target versions** (deferred to the read-only Dependency Upgrade Audit — see
  `../versioning/TARGET-POLICY.md`).
