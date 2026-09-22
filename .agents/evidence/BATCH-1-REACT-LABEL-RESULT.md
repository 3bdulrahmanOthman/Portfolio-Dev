# Batch 1 — @radix-ui/react-label Micro-gate Result

## Executive Result

**PASS**

The single authorized mutation completed cleanly: `@radix-ui/react-label` moved **2.1.7 → 2.1.15** (the corrected target resolving the Group A finding F1 — the brief's original `1.1.15` does not exist on the registry). Manifest delta: exactly one specifier line. Lockfile delta: exactly one package key, **zero transitive changes**. Both verification baselines reproduce exactly (typecheck 21 error lines, lint 2 errors — same locations/codes). User WIP byte-intact; HEAD unchanged; no commit/push. This closes the last open item of Batch 1 — Group A. `BATCH-1-GROUP-A-RESULT.md` was NOT modified (separate evidence record per instruction).

## 1. Authorization

- Human Command brief (2026-09-21): independent micro-gate to complete the only remaining Group A item — `@radix-ui/react-label 2.1.7 → 2.1.15`. Explicitly excludes Group B, Group C, and every other update.
- Context: Group A finding F1 (`.agents/evidence/BATCH-1-GROUP-A-RESULT.md`) — target `1.1.15` E404 on npmjs + npmmirror; registry `latest` = 2.1.15; declared manifest range `^2.1.4` accepts 2.1.15.

## 2. Execution facts

- **Timestamp:** 2026-09-21, ~17:45–17:52 EDT.
- **HEAD:** before `519a0026a75927a89cf2cadeedb313cfa26e4e21` · after **identical** (no commits).
- **Runtime:** Node v25.9.0 (provisional Node 25 conditions still in force — runtime-tagged record) · pnpm 10.9.0.
- **Pre-flight verified:** `package-lock.json` ABSENT · `@radix-ui/react-label` locked AND installed = 2.1.7 · working tree = post-Group-A standing set · no lingering pnpm processes · policies/workflows/Group-A evidence read (all loaded in session context).
- **Byte snapshots** (rollback basis, no git-based rollback ever used): `.agents/evidence/snapshots/batch-1-react-label/{package.json.pre,pnpm-lock.yaml.pre}`.

## 3. Command executed (verbatim)

```bash
pnpm update @radix-ui/react-label@2.1.15
```

- Foreground, single selector, no `--latest`, no registry override, no separate `pnpm install`.
- **Exit 0**, "Done in 2m 1.2s". Output delta: `- @radix-ui/react-label 2.1.7 / + @radix-ui/react-label 2.1.15`.
- Warnings: the standing pnpm-10 "Ignored build scripts: esbuild" notice only (baseline, pre-existing).
- The foreground-only rule (per the pnpm-hang finding F3 of Group A) was followed; no hang occurred.

## 4. Hashes (SHA-256)

| File | Before | After |
|---|---|---|
| `package.json` | `754eb2aeef3d98f8f4e2b39090afd23b7d3a4cf4270ded69d5961c0ea433aec0` | `f37daf37a697fe1551979e83edc5fd5eca9e55bae3e0c166b8daed7126af6098` |
| `pnpm-lock.yaml` | `7042b419b45f7f5829470fbdd6db733256704cf6f7b6cac67813fbdaa76cca8b` | `05f81e2356d70d9ddc3cb772d049040d9532650ecbd12928b163a30ea12a2669` |

## 5. Scope check

**package.json diff vs snapshot — exactly 1 line:**

```diff
-    "@radix-ui/react-label": "^2.1.4",
+    "@radix-ui/react-label": "^2.1.15",
```

(The specifier-rewrite is pnpm 10.9's documented-here behavior for `update pkg@<exact>`; recorded and accepted in Group A §7. New range still caret-form; 2.1.15 ∈ ^2.1.4.) No other dependency, script, configuration, metadata, or WIP line changed (diff-proven: 1 insertion / 1 deletion).

**pnpm-lock.yaml diff vs snapshot — 6 insertions / 6 deletions; key-level accounting:**

- Removed: `@radix-ui/react-label@2.1.7`
- Added: `@radix-ui/react-label@2.1.15`
- **Transitive changes: NONE.** Every dependency of the new version (radix internals, react/react-dom/types peers) was already resolved in the graph; no other key added, removed, or re-hashed. Nothing outside the `@radix-ui/react-label@2.1.15` closure changed.

## 6. Verification vs baseline

- **Typecheck** — `pnpm exec tsc --noEmit --incremental false` → exit 2, **exactly 21 error lines** at the exact baseline locations: `src/actions/chat.ts` ×8, `data-table-date-filter.tsx` ×2, `forms/project-form.tsx` ×1, `sections/hero/default.tsx` ×1, `ui/chart.tsx` ×8, `lib/export.ts` ×1. Classification: **unchanged baseline** (0 new, 0 fixed). Log: `snapshots/batch-1-react-label/typecheck-after.log`.
- **Lint** — `pnpm lint` → exit 1, **exactly the 2 baseline errors**: `chat-widget.tsx:30:10` (`no-unused-vars`), `socket.ts:45:67` (`no-explicit-any`). Classification: **unchanged baseline**. Log: `snapshots/batch-1-react-label/lint-after.log`.
- No source-code fix attempted (none needed — zero deviations to classify).

## 7. Targeted smoke (read-only)

- **Resolution OK**: `import.meta.resolve('@radix-ui/react-label')` → store path under `node_modules/.pnpm/@radix-ui+react-label@2.1.1_36544bcc…`.
  - Naming note (W2): pnpm truncates the version component in virtual-store directory names (`2.1.15` → `2.1.1` + full peer-hash suffix). Verified not an anomaly: the directory's own `package.json` reports **2.1.15**, `node_modules/@radix-ui/react-label` symlink resolves into it, lockfile key = `@radix-ui/react-label@2.1.15`, and `pnpm list` reports 2.1.15 — four independent version confirmations.
- **Package loads OK**: ESM import succeeds, exports `{ Label, Root }`; package `exports` map exposes `.`; peer declarations intact (`react`, `react-dom`, `@types/react`, `@types/react-dom`).
- **Dependency-resolution errors: none** (install clean; lockfile diff has zero transitive movement).
- Prisma generate: NOT needed, NOT run (@prisma/client untouched; generated client intact). No database operations. No Playwright needed (resolution + load sufficient).

## 8. User-WIP preservation

- Post-gate `git status --short` = same standing set (7 tracked entries + untracked set); no new tracked paths.
- Non-package WIP untouched: `globals.css`, `icons.tsx`, `types/index.ts`, `page.tsx` (deleted), `package-lock.json` (deleted, still absent).
- No `git restore/reset/checkout/stash/clean/commit/push/branch/amend` at any point.
- Only repository additions: this evidence file + the micro-gate snapshots (inside untracked `.agents/`).

## 9. Findings / warnings

- **W1 — orphaned virtual-store dir:** `node_modules/.pnpm/@radix-ui+react-label@2.1.7_f026c130…` remains on disk with zero lockfile references (pnpm leaves superseded peer-resolved dirs). Inert and ignored; not cleaned (out of scope). A future `pnpm install`/prune may remove it.
- **W2 — store dir-name truncation:** as detailed in §7 — cosmetic pnpm naming behavior, version identity quadruple-verified. Recorded to prevent future false alarms during version audits that grep directory names.
- No regressions. No out-of-scope changes. Rollback: **not exercised** (no condition met); snapshots remain valid.

## 10. Explicit statements

- **Group B was NOT executed. Group C was NOT executed.** No other package updated; no Batch 2+ work started; no source-code fix performed.
- **No commit, no push, no branch creation, no amend, no reset/restore/stash/clean.** HEAD = `519a0026a75927a89cf2cadeedb313cfa26e4e21` before and after.
- HARD STOP observed: Batch 1 — Group A is now fully complete (34/34). Group B / Group C / Batch 2 require separate human authorization.
