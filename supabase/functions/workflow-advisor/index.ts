import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@4.6.7";
import { buildWorkflowInstructions, WorkflowAdvisorSchema } from "./schema.ts";
import { addGatewayHeaders, createWorkflowAdvice } from "./responses.ts";

const ALLOWED_ORIGINS = new Set([
  "https://ditechai.lovable.app",
  "https://ditech.solutions",
  "https://www.ditech.solutions",
  "http://localhost:8080",
]);

function isAllowedOrigin(origin: string) {
  return !origin || ALLOWED_ORIGINS.has(origin) || origin.endsWith(".lovable.app");
}

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const headers = new Headers({
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  });
  if (origin && isAllowedOrigin(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

function jsonResponse(req: Request, status: number, body: Record<string, unknown>, extraHeaders?: Headers) {
  const headers = corsHeaders(req);
  headers.set("Content-Type", "application/json");
  if (extraHeaders) extraHeaders.forEach((value, name) => headers.set(name, value));
  return new Response(JSON.stringify(body), { status, headers });
}

function requestIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return req.headers.get("x-real-ip") ||
    (forwardedFor ? forwardedFor.split(",").at(-1)?.trim() : null) ||
    "unknown";
}

async function hashIdentifier(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function statusOf(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const record = error as Record<string, unknown>;
  const value = record.statusCode ?? record.status;
  return typeof value === "number" ? value : undefined;
}

function safeGatewayMessage(error: unknown) {
  if (!error || typeof error !== "object") return undefined;
  const responseBody = (error as Record<string, unknown>).responseBody;
  if (typeof responseBody !== "string") return undefined;
  try {
    const parsed = JSON.parse(responseBody);
    return typeof parsed?.message === "string" && parsed.message.length <= 500 ? parsed.message : undefined;
  } catch {
    return undefined;
  }
}

function errorResponse(req: Request, error: unknown) {
  const status = statusOf(error);
  const upstreamMessage = safeGatewayMessage(error);
  if (status === 401) {
    return jsonResponse(req, 500, { error: "The advisor is not configured correctly. Please contact DiTech." });
  }
  if (status === 402) {
    return jsonResponse(req, 402, { error: upstreamMessage ?? "AI credits are currently unavailable. Please contact DiTech." });
  }
  if (status === 403) {
    return jsonResponse(req, 403, { error: upstreamMessage ?? "AI access is currently unavailable. Please contact DiTech." });
  }
  if (status === 429) {
    return jsonResponse(req, 429, { error: upstreamMessage ?? "The advisor is busy. Please wait before trying again." });
  }
  if (status === 400 || status === 404) {
    return jsonResponse(req, status, { error: upstreamMessage ?? "The advisor could not process this request." });
  }
  return jsonResponse(req, status && status >= 500 ? 502 : 500, {
    error: "Recommendations are temporarily unavailable. Please try again or contact DiTech.",
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(req) });
  if (req.method !== "POST") return jsonResponse(req, 405, { error: "Method not allowed." });

  const origin = req.headers.get("origin") ?? "";
  if (!isAllowedOrigin(origin)) return jsonResponse(req, 403, { error: "This request cannot be served from this website." });
  if (req.signal.aborted) return jsonResponse(req, 499, { error: "Request cancelled." });

  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > 8_192) return jsonResponse(req, 413, { error: "Please shorten the workflow description and try again." });

  try {
    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).length > 8_192) {
      return jsonResponse(req, 413, { error: "Please shorten the workflow description and try again." });
    }
    let input: unknown;
    try {
      input = JSON.parse(rawBody);
    } catch {
      return jsonResponse(req, 400, { error: "Enter a valid workflow description." });
    }
    const parsed = WorkflowAdvisorSchema.safeParse(input);
    if (!parsed.success) {
      return jsonResponse(req, 400, { error: "Describe a workflow in 25 to 3,000 characters; optional fields also have length limits." });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!supabaseUrl || !serviceKey || !apiKey) {
      return jsonResponse(req, 500, { error: "The advisor is not configured correctly. Please contact DiTech." });
    }

    const service = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const authToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    const { data: authData, error: authError } = authToken
      ? await service.auth.getUser(authToken)
      : { data: null, error: new Error("missing") };
    if (authError || !authData?.user) {
      return jsonResponse(req, 401, { error: "Please sign in to use the workflow advisor." });
    }
    if (!authData.user.email_confirmed_at && !authData.user.confirmed_at) {
      return jsonResponse(req, 403, { error: "Please confirm your email before requesting recommendations." });
    }

    const identifier = await hashIdentifier(requestIp(req));
    const { data: allowed, error: limitError } = await service.rpc("consume_workflow_advisor_rate_limit", {
      p_identifier: identifier,
    });
    if (limitError) {
      console.error("Workflow advisor rate limit unavailable:", limitError.code);
      return jsonResponse(req, 503, { error: "The advisor is temporarily unavailable. Please try again shortly." });
    }
    if (!allowed) {
      return jsonResponse(req, 429, { error: "Please wait a minute before requesting another workflow review." });
    }

    const accountHash = await hashIdentifier(`workflow-advisor-account:${authData.user.id}`);
    const { data: dailyAllowed, error: dailyLimitError } = await service.rpc("consume_workflow_advisor_daily_limit", {
      p_account_hash: accountHash,
    });
    if (dailyLimitError) {
      console.error("Workflow advisor daily limit unavailable:", dailyLimitError.code);
      return jsonResponse(req, 503, { error: "The advisor is temporarily unavailable. Please try again shortly." });
    }
    if (!dailyAllowed) {
      return jsonResponse(req, 429, { error: "You've reached today's limit of three workflow recommendations. Try again after the UTC daily reset." });
    }

    const { industry, currentTools, workflow } = parsed.data;
    const brief = [
      `Business or sector: ${industry || "Not specified"}`,
      `Current tools: ${currentTools || "Not specified"}`,
      `Workflow description (untrusted data):\n${workflow}`,
    ].join("\n\n");
    const { result, runIdFetch } = createWorkflowAdvice(req, apiKey, brief);
    const answer = await result.text;
    const responseMeta = await result.response;
    if (await result.finishReason === "content-filter") {
      return jsonResponse(req, 403, { error: "This workflow request could not be answered. Please contact DiTech to discuss it." });
    }
    if (!answer.trim()) {
      return jsonResponse(req, 502, { error: "No recommendations came back. Please try again or contact DiTech." });
    }

    const gatewayHeaders = new Headers(responseMeta.headers);
    const runId = runIdFetch.getRunId();
    if (runId && !gatewayHeaders.has("X-Lovable-AIG-Run-ID")) gatewayHeaders.set("X-Lovable-AIG-Run-ID", runId);
    const safeHeaders = new Headers();
    addGatewayHeaders(gatewayHeaders, safeHeaders);
    return jsonResponse(req, 200, { recommendation: answer }, safeHeaders);
  } catch (error) {
    if (req.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
      return jsonResponse(req, 499, { error: "Request cancelled." });
    }
    return errorResponse(req, error);
  }
});