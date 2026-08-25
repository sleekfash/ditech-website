#!/usr/bin/env node
/**
 * Security scan CI step.
 *
 * 1. Runs static frontend checks (mirrors the agent_security scanner):
 *    secret-looking values must never ship in the client bundle.
 * 2. Calls the deployed `security-lint` edge function, which re-runs the
 *    backend (RLS / grants / SECURITY DEFINER) lint checks server-side.
 * 3. Compares every finding against security-baseline.json and exits 1 if
 *    any NEW warn- or error-level finding is present.
 *
 * Usage:
 *   SECURITY_SCAN_URL=https://<project>.supabase.co/functions/v1/security-lint \
 *   SECURITY_SCAN_TOKEN=<shared-secret> \
 *     node scripts/security-scan.mjs
 *
 * If SECURITY_SCAN_URL is unset it is derived from VITE_SUPABASE_URL in .env.
 *
 * Flags:
 *   --skip-remote       run only the static checks (offline mode)
 *   --update-baseline   rewrite security-baseline.json from current findings
 *                       (preserves existing "reason" texts)
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASELINE_PATH = join(ROOT, "security-baseline.json");

const args = process.argv.slice(2);
const SKIP_REMOTE = args.includes("--skip-remote");
const UPDATE_BASELINE = args.includes("--update-baseline");

// ---------------------------------------------------------------------------
// Static frontend secret checks
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "coverage", "supabase"]);
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".html", ".css", ".json", ".env", ""]);
const ALLOWLIST = new Set([".env.example", "security-baseline.json", "scripts/security-scan.mjs", "SECURITY_CI.md", "DEPLOYMENT.md", "README.md"]);

const SECRET_NAME_RE = /VITE_[A-Z0-9_]*(SECRET|PRIVATE|PASSWORD|SERVICE_ROLE|TOKEN)[A-Z0-9_]*/;
const SECRET_VALUE_RES = [
  { re: /sk_live_[A-Za-z0-9]{8,}/, label: "Stripe live secret key" },
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, label: "PEM private key" },
  { re: /SUPABASE_SERVICE_ROLE_KEY/, label: "service role key reference" },
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      yield* walk(full);
    } else if (stat.isFile() && stat.size < 1024 * 1024) {
      const rel = relative(ROOT, full);
      if (ALLOWLIST.has(rel)) continue;
      const ext = entry.includes(".") ? entry.slice(entry.lastIndexOf(".")) : "";
      if (SCAN_EXTENSIONS.has(ext) || entry.startsWith(".env")) yield rel;
    }
  }
}

function staticFindings() {
  const findings = [];
  for (const rel of walk(ROOT)) {
    let content;
    try {
      content = readFileSync(rel, "utf8");
    } catch {
      continue;
    }
    const lines = content.split("\n");
    lines.forEach((line, i) => {
      const nameMatch = line.match(SECRET_NAME_RE);
      if (nameMatch && !/^\s*#/.test(line) && !/your[-_]/i.test(line)) {
        findings.push({
          check: "frontend_secret",
          level: "error",
          entity: `${rel}:${i + 1}`,
          title: "Secret exposed to client bundle",
          detail: `"${nameMatch[0]}" looks like a secret in a VITE_ variable; VITE_ values ship in the public bundle.`,
        });
      }
      for (const { re, label } of SECRET_VALUE_RES) {
        if (re.test(line) && !/^\s*(\/\/|#|\*)/.test(line.trim()) && !line.includes("Deno.env") && !line.includes("process.env")) {
          findings.push({
            check: "frontend_secret",
            level: "error",
            entity: `${rel}:${i + 1}`,
            title: "Secret value in client code",
            detail: `Possible ${label} found in a file shipped to the client.`,
          });
        }
      }
    });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Remote backend scan
// ---------------------------------------------------------------------------

function deriveScanUrl() {
  if (process.env.SECURITY_SCAN_URL) return process.env.SECURITY_SCAN_URL;
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return null;
  const m = readFileSync(envPath, "utf8").match(/^VITE_SUPABASE_URL=(\S+)$/m);
  return m ? `${m[1].replace(/\/$/, "")}/functions/v1/security-lint` : null;
}

async function remoteFindings() {
  const url = deriveScanUrl();
  const token = process.env.SECURITY_SCAN_TOKEN ?? "";
  if (!url || !token) {
    console.error(
      "ERROR: remote scan is not configured.\n" +
        "Set SECURITY_SCAN_URL and SECURITY_SCAN_TOKEN, or pass --skip-remote for static checks only."
    );
    process.exit(2);
  }
  const res = await fetch(url, { method: "POST", headers: { "x-scan-token": token } });
  if (res.status === 401) {
    console.error("ERROR: scan endpoint rejected the token (401). Check SECURITY_SCAN_TOKEN.");
    process.exit(2);
  }
  if (!res.ok) {
    console.error(`ERROR: scan endpoint returned HTTP ${res.status}.`);
    process.exit(2);
  }
  const data = await res.json();
  console.log(`Remote scan: ${data.scanner} v${data.version} at ${data.timestamp}`);
  return data.findings ?? [];
}

// ---------------------------------------------------------------------------
// Baseline comparison
// ---------------------------------------------------------------------------

const idOf = (f) => `${f.check}:${f.entity}`;

function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return { accepted: [] };
  return JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const findings = [...staticFindings(), ...(SKIP_REMOTE ? [] : await remoteFindings())];

if (UPDATE_BASELINE) {
  const previous = loadBaseline();
  const reasons = new Map(previous.accepted.map((a) => [a.id, a.reason]));
  const baseline = {
    $comment:
      "Findings listed here are reviewed and accepted. The CI security scan fails only on NEW warn/error findings. Regenerate with: node scripts/security-scan.mjs --update-baseline (then fill in reasons).",
    accepted: findings.map((f) => ({
      id: idOf(f),
      level: f.level,
      title: f.title,
      reason: reasons.get(idOf(f)) ?? "TODO: document why this is accepted",
    })),
  };
  writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + "\n");
  console.log(`Baseline updated: ${baseline.accepted.length} finding(s) written to security-baseline.json`);
  process.exit(0);
}

const accepted = new Set(loadBaseline().accepted.map((a) => a.id));
const newFindings = findings.filter((f) => !accepted.has(idOf(f)));
const failing = newFindings.filter((f) => f.level === "warn" || f.level === "error");

console.log(`\nSecurity scan results`);
console.log(`  total findings:    ${findings.length}`);
console.log(`  accepted baseline: ${findings.length - newFindings.length}`);
console.log(`  new findings:      ${newFindings.length}`);

for (const f of newFindings) {
  console.log(`\n  [${f.level.toUpperCase()}] ${f.title} (${idOf(f)})`);
  console.log(`    ${f.detail}`);
}

if (failing.length > 0) {
  console.error(
    `\nFAILED: ${failing.length} new warn/error finding(s). ` +
      `Fix them, or review and accept them via: node scripts/security-scan.mjs --update-baseline`
  );
  process.exit(1);
}

console.log("\nPASSED: no new warn/error findings.");
