const ALLOWED_ORIGINS = [
  "https://ditechai.lovable.app",
  "https://ditech.solutions",
  "https://www.ditech.solutions",
  "http://localhost:8080",
];

// Exact HTTPS origins only; never grant access to every vercel.app deployment.
export function isAllowedOrigin(origin: string) {
  if (!origin) return true; // Non-browser calls still require endpoint authorization.
  const configured = (Deno.env.get("ADDITIONAL_ALLOWED_ORIGINS") ?? "")
    .split(",").map((value) => value.trim()).filter((value) => {
      try { const url = new URL(value); return url.protocol === "https:" && url.origin === value; }
      catch { return false; }
    });
  return ALLOWED_ORIGINS.includes(origin) || configured.includes(origin) || origin.endsWith(".lovable.app");
}

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isAllowed = isAllowedOrigin(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}
