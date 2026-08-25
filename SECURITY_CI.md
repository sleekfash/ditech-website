# Security Scan CI

The build fails if a **new** warn- or error-level security finding appears.

## How it works

1. **`public.security_lint()` (SQL function)** — runs the backend lint checks
   inside the database: tables without row-level security, RLS tables with no
   policies, privileged (`SECURITY DEFINER`) functions callable by regular
   users, tables with no insert path, and anonymous write grants. It can only
   be executed by the internal service role — never by visitors or signed-in
   users.
2. **`security-lint` edge function** — wraps the checks in an HTTP endpoint,
   gated by a shared secret (`x-scan-token` header, constant-time compare,
   generic 401 on failure, no CORS).
3. **`scripts/security-scan.mjs`** — the CI step. Runs static frontend checks
   (no secret keys in the client bundle), calls the edge function, and
   compares every finding against `security-baseline.json`. Any finding **not
   in the baseline** at warn level or above fails the build.
4. **`.github/workflows/security-scan.yml`** — runs on every push to `main`,
   every pull request, and weekly (Mondays 03:17 UTC).

## One-time setup

| Where | Name | Value |
| --- | --- | --- |
| GitHub repo → Settings → Secrets → Actions | `SECURITY_SCAN_TOKEN` | Same value as the `SECURITY_SCAN_TOKEN` backend secret |
| GitHub repo → Settings → Variables → Actions | `SECURITY_SCAN_URL` | `<your backend URL>/functions/v1/security-lint` (backend URL = the `VITE_SUPABASE_URL` value in `.env`) |

The backend secret was generated automatically and its value is never shown.
To sync CI, set your own random value (48+ chars) in **both** places:
update the `SECURITY_SCAN_TOKEN` backend secret here, then create the GitHub
secret with the same value.

## Local usage

```bash
# full scan (uses VITE_SUPABASE_URL from .env to derive the endpoint)
SECURITY_SCAN_TOKEN=<token> npm run security:scan

# static checks only (offline)
node scripts/security-scan.mjs --skip-remote

# after reviewing new findings, accept them into the baseline
node scripts/security-scan.mjs --update-baseline
# then edit security-baseline.json and replace each "TODO" reason
```

## Baseline policy

`security-baseline.json` is the list of **reviewed and accepted** findings
(e.g. tables that are intentionally writable only through edge functions via
the service role). Every entry must carry a human-written `reason`. The CI
step fails only on findings that are *not* in this file, so the baseline
cannot silently grow — it only changes through an explicit, reviewable commit.
