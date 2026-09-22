# ADR-0001: Agent OS is Vendor Neutral

**Status:** ACCEPTED
**Date:** 2026-09-20

## Context

This repository is worked on by multiple AI coding agents — today Claude Code and ZCode, tomorrow
potentially OpenAI Codex, Cursor, Windsurf, or GitHub Copilot agents. If each runtime accumulated
its own project instructions, the project contract would fork: policies would drift, one runtime
would learn a rule another never sees, and the "source of truth" would be whatever file the
current agent happened to read.

## Decision

The project-level agent contract is **`AGENTS.md` (repository root)** and the **`.agents/` tree**,
both intentionally independent of any agent runtime. Runtime-specific files are **thin adapters**
that point to `AGENTS.md` and add nothing authoritative (e.g. `CLAUDE.md` for Claude Code).
Codex consumes `AGENTS.md` natively and needs no adapter. Future runtimes get adapters only after
the need is documented in an ADR.

## Consequences

- **Positive:** one place to change policy; consistent behavior across runtimes; adapters stay
  trivial to review; no vendor lock-in of project knowledge.
- **Negative:** adapters can drift if someone duplicates content into them — mitigated by keeping
  adapters to pointers and by review policy.
- Runtime-specific quirks (e.g. how a runtime loads instructions) are handled in the adapter, never
  by bending `.agents/` toward one vendor.

## Alternatives considered

- **Per-runtime full instruction files** (`CLAUDE.md`, `.cursorrules`, … each self-contained):
  rejected — guarantees divergence.
- **Vendor-specific tooling formats as the source of truth** (e.g. only Cursor rules): rejected —
  excludes the other runtimes this project actually uses.

## Evidence

Phase 0 discovery (2026-09-20, `.agents/evidence/DISCOVERY-BASELINE.md`) found **no** pre-existing
agent configuration in the repository, so no migration of legacy rules was needed; this ADR
establishes the model from a clean slate.
