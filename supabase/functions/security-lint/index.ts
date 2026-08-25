/**
 * security-lint edge function
 *
 * Re-runs the backend security lint checks (via the service-role-only
 * `public.security_lint()` SQL function) and returns the findings as JSON.
 * Used by the CI step in scripts/security-scan.mjs.
 *
 * Access is gated by a shared secret sent in the `x-scan-token` header.
 * The token is compared in constant time and failures return a generic 401.
 * No CORS headers are emitted: this endpoint is for server-to-server CI use only.
 */

const SCAN_TOKEN = Deno.env.get("SECURITY_SCAN_TOKEN") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function tokenValid(provided: string): boolean {
  if (!SCAN_TOKEN || !provided || provided.length !== SCAN_TOKEN.length) return false;
  const a = new TextEncoder().encode(provided);
  const b = new TextEncoder().encode(SCAN_TOKEN);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!tokenValid(req.headers.get("x-scan-token") ?? "")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/security_lint`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  if (!res.ok) {
    return json({ error: "Lint query failed" }, 502);
  }

  const data = await res.json();

  return json({
    ok: true,
    scanner: "supabase_lov_ci",
    version: "1.0",
    timestamp: new Date().toISOString(),
    findings: data?.findings ?? [],
  });
});
