# Workflow: Security Change

Purpose: handle security-relevant work (and discovered vulnerabilities) without widening exposure.

**Spine:** DISCOVER → PLAN → APPROVAL GATE → EXECUTE → VERIFY → REVIEW → EVIDENCE → COMPLETE
(gates are mandatory; disclosure is minimal)

| Stage | What happens |
|---|---|
| DISCOVER | Evidence the issue precisely: file/line, exploit path, blast radius. Read-only confirmation only |
| PLAN | Minimal-change remediation design. Security fixes prefer the smallest diff that closes the issue; hardening beyond it becomes separate gated tasks. Check the known-issues list in `policies/SECURITY.md` before claiming anything is new |
| APPROVAL GATE | Mandatory human gate — auth, authz, middleware, secrets, uploads, rate limiting are all gated areas (Gates #9–#12) |
| EXECUTE | Implementer applies the approved change only. No secret values in code, logs, evidence, or conversation |
| VERIFY | Standard verification set + security-specific checks (auth still required on protected surfaces; rate limits still active; validation still enforced). Note: no automated security tests exist — say so |
| REVIEW | Independent review with explicit attention to bypass paths ("does the fix itself open a hole?") |
| EVIDENCE | Diff + verification records; security findings stored without sensitive specifics where possible |
| COMPLETE | Per completion contract |

Special rules:

1. **Report-first.** A discovered vulnerability is reported with evidence and left unfixed until a
   gated task exists — drive-by security fixes are prohibited (they bypass review).
2. **No silent containment.** If agent work exposes a secret or breaks auth: stop and report immediately.
3. **Dependency "security upgrades"** follow the dependency upgrade workflow — a CVE label does not
   waive the gates.
