# MCP & Skills Registry

Canonical tooling registry for this project's AI engineering layer. Authority order is unchanged:
`AGENTS.md` → `.agents/policies/*` → `.agents/contracts/*` → `.agents/workflows/*`. This file
**registers** tooling; it grants no permissions beyond what the policies already allow, and no tool
bypasses the approval gates in `policies/APPROVALS.md`.

Project-scoped MCP configuration lives in [`../../.mcp.json`](../../.mcp.json) (vendor-neutral
convention read by Claude Code and mappable by other runtimes). Versions are **pinned** — consistent
with `../versioning/VERSION-POLICY.md`; bumps are gated dependency-style decisions.

## MCP Servers

| Server | Status | Version | Scope | Permissions | Auth | Notes |
|---|---|---|---|---|---|---|
| Context7 | CONFIGURED (activation: next agent session) | @upstash/context7-mcp@4.1.1 | documentation lookup | read-only by nature | none | engines `>=20.18.1` ✓ Node 25. Purpose: version-aware docs during framework/dependency work — reduces stale-knowledge risk |
| Playwright | CONFIGURED (activation: next agent session) | @playwright/mcp@0.0.82 | browser verification / UI smoke | browser-verification class; no destructive actions | none | Chromium headless shell already present (`ms-playwright/chromium_headless_shell-1234`) |
| Prisma | CONFIGURED — **DB connection intentionally deferred** | prisma@6.11.1 CLI (local, `prisma mcp`) | schema introspection readiness | read-only intent; no DB connection configured | none (DB not connected) | No safe non-production DB available; production credentials prohibited (`policies/DATABASE.md`). Connection is a separate gated decision |
| GitHub | CONFIGURED — **DEFERRED-effective** | ghcr.io/github/github-mcp-server (latest) | repository read access | `--read-only` flag enforced in args | `GITHUB_PERSONAL_ACCESS_TOKEN` (user-supplied, not present) | Activation requires: (1) Docker Desktop daemon running (currently stopped — verified 2026-09-20), (2) PAT with read scope. No write/PR/push scopes granted |
| Serena | **DEFERRED** | oraios/serena @ `c4dc91a7` (built from git) | code navigation / symbol analysis | read-only preference | none | uvx 0.12.5 present; build failed: `pyyaml==6.0.2` wheel build error under current uv/Python. Remedy to try later: pin Python ≤3.12 via uv (`uvx --python 3.12 …`) or install MS C++ build tools, then re-test |
| Sentry | **DEFERRED** | — | production-oriented | — | requires production credentials | Not useful at current stage (no Sentry integration in repo); production access prohibited without explicit human decision |

## Skills

Existing skills are **referenced, not vendored**: they live at user level (`C:\Users\74\.agents\skills\`),
are discoverable by the agent, and remain outside the repository (no policy moved into them;
`AGENTS.md` stays authoritative). Project-adapted copies are authored later per
[`../skills/README.md`](../skills/README.md) (adapt-don't-dump rule).

| Skill | Status | Version | Source | Project compatibility | Notes |
|---|---|---|---|---|---|
| Vercel React Best Practices | AVAILABLE (user-level) | 1.0.0 | `vercel-react-best-practices` (author: vercel, MIT) | React 19.1 / Next 15.3 ✓ | Performance patterns for React/Next code |
| Vercel Web Design Guidelines | AVAILABLE (user-level) | 1.0.0 | `web-design-guidelines` (author: vercel) | UI review, version-agnostic ✓ | UI/a11y review pass |
| Next.js version-matched guidance | AVAILABLE (user-level) | — | `next-dev-loop` (+ `next-cache-components-*` set) | Next 15.3 ✓ (dev-server runtime verification) | Use during Batch 6 framework work; version assumptions must be re-checked against the target then |
| Security Guidance | AVAILABLE (user-level) | — | `security-and-hardening` | version-agnostic ✓ | Complements `policies/SECURITY.md` (policy stays authoritative) |
| Testing / TDD | AVAILABLE (user-level) | — | `test-driven-development` | version-agnostic ✓ | **No test framework exists yet** — applicable only after adoption (roadmap decision) |
| Code Review | AVAILABLE (user-level) | — | `code-review-and-quality` | version-agnostic ✓ | Feeds the `workflows/REVIEW.md` reviewer role |
| Verification Before Completion | COVERED BY POLICY | — | — | — | Already encoded in `contracts/COMPLETION.md` + `workflows/VERIFICATION.md`; a duplicate skill would violate the no-duplication rule |
| Project-specific engineering principles | COVERED BY POLICY | — | — | — | `AGENTS.md` + `.agents/policies/*` + project skills to be authored per `../skills/README.md` |
| JSMastery workflow | **DEFERRED** | — | no official skill source found | — | Author project-specific later if the workflow is wanted |
| Prisma guidance | **DEFERRED** | — | no official project-suitable skill found | — | Author project-specific (edge client + Accelerate + no-migrations caveats) per `../skills/README.md` |

## Permission Model

- **Read-only:** Context7, GitHub (`--read-only`), Prisma (no DB connection configured).
- **Browser verification:** Playwright (no destructive actions).
- **Write-capable tooling:** none granted.
- **Prohibited regardless of tool:** production DB writes, Git push, destructive repository
  operations, deployment. `policies/APPROVALS.md` remains the sole authority for every gate
  (dependency upgrade, major upgrade, removal, DB mutation, auth/security, production, commit, push,
  deploy). Installing these servers does not weaken any rule — they add *read/verify* capability only.
