# Agent Tooling Setup Result

## 1. Executive Result

**PARTIAL**

The agreed tooling layer is configured to the maximum extent possible without runtime restarts, credentials, or dependency mutations: **Context7, Playwright, and Prisma MCP are configured** (activation on the next agent session, since running sessions cannot hot-attach MCP servers); **GitHub MCP is configured but deferred-effective** (Docker daemon offline + no PAT); **Serena is deferred** (Python build failure — exact cause recorded with remedy); **Sentry deferred** (production-oriented, no credentials). Six of nine agreed skill categories map to verified existing user-level skills; three categories are policy-covered or deferred. **Batch 1 was not executed; package files byte-identical.**

## 2. Pre-Setup Repository State

- Branch `main`, HEAD `519a0026a75927a89cf2cadeedb313cfa26e4e21`; working tree = post-Gate-2 state (`D package-lock.json` + 6 tracked user changes, 7 files +150/−11,572) + standing untracked set.
- Sentinels: `package.json` = `b05494078ed737f2c8634dc1834f0b16e1c1750ee2ea42ac5d933d9c2a3e68d8`; `pnpm-lock.yaml` = `0a52de3393ab9dbf684b7fd03913a7da2f66cf66e61cd2f0d62c79a375e727d9`.

## 3. Existing MCP Inventory

**None.** No `.mcp.json`, `claude.json`, `settings.json`, `.claude/`, `.codex/`, `.cursor/`, `.windsurf/` existed anywhere in the project (verified). No MCP servers were installed or configured. (The running ZCode session has unrelated host-level MCP tools — Fiverr, web-reader, node-repl — none project-scoped.)

## 4. Existing Skills Inventory

- **Project-level (`.agents/skills/`):** architecture only (`README.md`, per Phase 1 — no external skills installed yet).
- **User-level (`C:\Users\74\.agents\skills\`):** ~90 skills discoverable by the agent, including the relevant official/community set (frontmatter-verified below).
- Discoverability: the agent can load user-level skills on demand via its Skill mechanism today.

## 5. MCP Discovery Results

| Server | Official distribution (verified 2026-09-20) | Environment check |
|---|---|---|
| Serena | `uvx --from git+https://github.com/oraios/serena serena start-mcp-server` (official README warns against marketplace installs) | uvx 0.12.5 present; **activation test failed** (§11) |
| Context7 | npm `@upstash/context7-mcp` — latest **4.1.1**, engines `>=20.18.1` ✓ | npx available |
| GitHub | docker `ghcr.io/github/github-mcp-server`, `stdio --read-only` flag confirmed (official repo) | docker CLI 29.5.2 present; **daemon offline** (§11) |
| Playwright | npm `@playwright/mcp` — latest **0.0.82**, engines `>=18` ✓ | npx available; Chromium headless shell already installed |
| Prisma | **built into the Prisma CLI** — local 6.11.1 exposes `mcp  Starts an MCP server to use with AI development tools` (verified via `prisma --help`) | local CLI; no separate package (`@prisma/mcp` does not exist on npm) |

## 6. MCP Installation Results

No repository dependency changes were needed (npx/uvx/docker/direct-CLI invocation models) — the `does not require project dependency mutation` criterion passes for all. Configured in [`.mcp.json`](../../.mcp.json) with **pinned versions** (VERSION-POLICY-consistent):

- `context7` → `npx -y @upstash/context7-mcp@4.1.1` ✔
- `playwright` → `npx -y @playwright/mcp@0.0.82` ✔
- `prisma` → `npx -y prisma@6.11.1 mcp` ✔ (pins the project's own Prisma line; no upgrade performed)
- `github` → `docker run -i --rm ghcr.io/github/github-mcp-server ./github-mcp-server stdio --read-only` with `GITHUB_PERSONAL_ACCESS_TOKEN` env mapping ✔ (inactive until daemon + token exist)
- `serena` → intentionally **omitted from `.mcp.json`** (deferred; config snippet documented in the registry for later activation)

## 7. MCP Permission Model

Read-only: Context7, GitHub (`--read-only`), Prisma (no DB connection configured). Browser-verification: Playwright. Write-capable: none granted. Prohibited: production DB writes, Git push, destructive repo operations, deployment — `policies/APPROVALS.md` remains authoritative (§16 integration check passed).

## 8. Skills Discovery Results

Agreed categories vs. discoverable skills (frontmatter verified):

| Agreed category | Found | Evidence |
|---|---|---|
| Official Next.js guidance | ✔ `next-dev-loop` (+ `next-cache-components-*` set) | user-level; requires running `next dev` |
| Vercel React Best Practices | ✔ `vercel-react-best-practices` | author: vercel, v1.0.0, MIT |
| Vercel Web Design Guidelines | ✔ `web-design-guidelines` | author: vercel, v1.0.0 |
| Security Guidance | ✔ `security-and-hardening` | user-level |
| Testing / TDD | ✔ `test-driven-development` | user-level |
| Code Review | ✔ `code-review-and-quality` | user-level |
| Verification Before Completion | covered by policy | `contracts/COMPLETION.md` + `workflows/VERIFICATION.md` — duplicate skill deliberately not installed |
| Project-specific engineering principles | covered by policy | `AGENTS.md` + `.agents/*` |
| JSMastery workflow | ✗ none | no official skill source found |
| Prisma guidance | ✗ none | no official project-suitable skill found (only drizzle/laravel skills locally) |

## 9. Skills Installation Results

Skills are **referenced, not vendored**: all six available skills remain at user level and are registered in `.agents/docs/tooling/MCP-AND-SKILLS.md` with source/version/compatibility. This honors the vendor-neutrality and adapt-don't-dump rules (`skills/README.md`): no unknown files copied; no policy duplicated into skills; `AGENTS.md` stays authoritative over any skill. Project-adapted skill authoring (Prisma, project patterns) remains future work per the skills architecture.

## 10. Version Compatibility

| Skill/MCP | Supported versions | Project version | Compatible now? | Target-version compatibility |
|---|---|---|---|---|
| context7 4.1.1 | Node ≥20.18.1 | Node 25.9.0 | ✔ | ✔ (no stack coupling) |
| playwright-mcp 0.0.82 | Node ≥18 | Node 25.9.0 | ✔ | ✔ |
| prisma mcp (CLI 6.11.1) | Prisma 6.x | Prisma 6.11.1 | ✔ (exact match, pinned) | Re-pin when Batch 7 moves to 7.10.x |
| github-mcp-server | n/a (service) | — | config-only (deferred-effective) | ✔ |
| vercel-react-best-practices 1.0.0 | React/Next generic | React 19.1.0 / Next 15.3.0 | ✔ | Re-check at Next 16 (Batch 6) |
| web-design-guidelines 1.0.0 | generic | — | ✔ | ✔ |
| next-dev-loop | Next dev server | Next 15.3.0 | ✔ | Re-check at Next 16 |
| security-and-hardening / TDD / code-review | generic | — | ✔ | ✔ |

No skill silently assumes Next 16 / Prisma 7 / React 19.3 / TS 7; `next-dev-loop` is flagged for re-verification at the framework upgrade.

## 11. Deferred Tooling (with reasons)

1. **Serena** — DEFERRED. Read-only activation test executed: uvx built `serena-agent@c4dc91a7` from the official repo but the build failed: `pyyaml==6.0.2` wheel build error under the current uv (0.12.5)/Python toolchain. Remedy recorded: pin a compatible Python (`uvx --python 3.12 …`) or install MS C++ build tools, then re-test. No repository mutation occurred (uv cache only).
2. **GitHub MCP activation** — DEFERRED-effective. Config shipped; two prerequisites missing: Docker Desktop daemon **not running** (connection to `dockerDesktopLinuxEngine` pipe failed — verified), and no `GITHUB_PERSONAL_ACCESS_TOKEN` in the environment. Token must be user-supplied with read-only scopes; never committed.
3. **Prisma MCP DB connection** — DEFERRED by design: no safe non-production database connection is available; production credentials prohibited (`policies/DATABASE.md`). Server is configured without a connection string.
4. **Sentry** — DEFERRED: production-oriented, requires credentials the project does not have configured; no Sentry integration exists in the repo; not useful at the current stage.
5. **JSMastery workflow skill** — DEFERRED: no official skill source found to validate.
6. **Prisma guidance skill** — DEFERRED: none found; to be authored project-specific later (edge client + Accelerate + no-migrations caveats).
7. **Runtime activation of configured MCP servers** — inherent: a running agent session cannot hot-attach servers; Context7/Playwright/Prisma activate on the next session start (config is read from `.mcp.json`).

## 12. Connectivity Tests

- **Serena:** attempted (read-only, uv cache only) → **failed** at build stage (exact error captured §11/above). Registration: documented, not active.
- **Context7:** registration verified (registry manifest + engines + pinned config). Live doc-lookup test not possible pre-activation → recorded as *pending next-session test* (subject: Next.js/Prisma docs).
- **GitHub:** docker daemon connection **failed** (offline) → image pull not attempted further; registration + `--read-only` args documented. No write operations possible or attempted.
- **Playwright:** registration verified; Chromium headless shell already present. Browser-launch test deferred to first real verification task.
- **Prisma:** CLI `mcp` command existence verified locally (`prisma --help`); server config pinned; **no DB connection attempted**.
- **Skills:** discovery verified — the agent can already load the six registered user-level skills (they are in its active skill list). No skill was executed.

## 13. Agent OS Policy Integration

Verified: the tooling layer adds no bypass. Every gate in `policies/APPROVALS.md` (dependency upgrade/major upgrade/removal, DB mutation, auth/security, production, commit, push, deploy) remains human-gated; the configured servers are read-only or browser-class; `.mcp.json` grants no credentials beyond a user-supplied PAT placeholder; no Agent OS contract/policy/workflow file was modified or deleted.

## 14. Package/Lockfile Integrity

Post-setup SHA-256 — **byte-identical to pre-setup**:
- `package.json` = `b05494078ed737f2c8634dc1834f0b16e1c1750ee2ea42ac5d933d9c2a3e68d8`
- `pnpm-lock.yaml` = `0a52de3393ab9dbf684b7fd03913a7da2f66cf66e61cd2f0d62c79a375e727d9`
- `package-lock.json` = absent (unchanged from Gate 2 state). No `pnpm install`/`update` run; Batch 1 untouched.

## 15. Git Safety

Before/after `git status --short` and `git diff --stat`: identical except the new untracked files this command created (`.mcp.json`, `.agents/docs/tooling/MCP-AND-SKILLS.md`, `.agents/evidence/AGENT-TOOLING-SETUP-RESULT.md`). Tracked diff remains 7 files, +150/−11,572 (user WIP intact). No reset/restore/checkout/stash/clean used.

## 16. Security Considerations

- No credentials were created, requested from stores, or committed; `GITHUB_PERSONAL_ACCESS_TOKEN` is referenced as an environment placeholder only.
- All configured servers are read-only or browser-class; GitHub server enforces `--read-only` in its args (defense against config drift, not just policy).
- Serena was not activated after a build failure — no unverified binary ran beyond the uv build process.
- `.mcp.json` pins exact versions, preventing silent tool supply-chain drift; version bumps follow the dependency governance process.

## 17. Final Tooling Matrix

See `.agents/docs/tooling/MCP-AND-SKILLS.md` (canonical registry): 3 MCP servers CONFIGURED (activation pending session restart), 2 CONFIGURED-DEFERRED (GitHub: daemon+token; Prisma DB: connection), 2 DEFERRED (Serena: build failure; Sentry: production-oriented), 6 skills AVAILABLE, 2 categories COVERED BY POLICY, 2 skills DEFERRED.

## 18. Remaining Open Decisions

1. Supply a read-scoped `GITHUB_PERSONAL_ACCESS_TOKEN` (user, environment-level) and start Docker Desktop to activate GitHub MCP.
2. Fix Serena's Python toolchain (pin ≤3.12 via uv or install build tools) and re-run the activation test.
3. Decide whether Prisma MCP gets a safe non-production DB connection (gated per DATABASE policy).
4. Author the deferred project skills (Prisma guidance; JSMastery workflow if wanted) per `skills/README.md`.
5. Sentry: revisit only if/when the project adopts Sentry and a production decision is made.
