import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const ALLOWED_ORIGINS = [
  "https://ditechai.lovable.app",
  "https://ditech.solutions",
  "https://www.ditech.solutions",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// Message validation schema
const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(10000, "Message content too long"),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema)
    .min(1, "At least one message is required")
    .max(50, "Too many messages in conversation"),
});

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15; // Max 15 AI requests per minute per IP

// deno-lint-ignore no-explicit-any
async function checkRateLimit(supabase: any, ip: string): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", ip)
    .eq("endpoint", "ai-chat")
    .gte("created_at", windowStart.toISOString());

  if (error) {
    console.error("Rate limit check error:", error.code);
    return true; // Allow on error
  }

  return (count ?? 0) < RATE_LIMIT_MAX_REQUESTS;
}

// deno-lint-ignore no-explicit-any
async function recordRequest(supabase: any, ip: string): Promise<void> {
  await supabase.from("rate_limits").insert({
    identifier: ip,
    endpoint: "ai-chat",
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    // Create Supabase client for rate limiting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client IP — use rightmost x-forwarded-for value (infrastructure-set, not client-controlled)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = req.headers.get("x-real-ip") || 
               (forwardedFor ? forwardedFor.split(",").at(-1)?.trim() : null) || 
               "unknown";

    // Check rate limit
    const isAllowed = await checkRateLimit(supabase, ip);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait before trying again." }),
        { status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request
    const rawData = await req.json();
    
    let validatedData;
    try {
      validatedData = RequestSchema.parse(rawData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return new Response(
          JSON.stringify({ error: "Invalid request format" }),
          { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }
      throw validationError;
    }

    const { messages } = validatedData;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Record this request for rate limiting
    await recordRequest(supabase, ip);

    const systemPrompt = `You are DiTech AI, a helpful sales assistant for DiTech Solutions & Services - a government-registered tech consultancy since 2020 with 12+ years of cumulative industry experience.

ABOUT DITECH:
DiTech specializes in AI-powered automation, full-stack development, workflow orchestration, legal tech, and hardware solutions. Our tagline is "Practical AI. Reliable Automation. Tangible Results."

TARGET CLIENTS: Law firms, judges, senior advocates, international retailers, SMEs

KEY SERVICES:
1. AI-Powered Automation - GPT-5, RAG pipelines, intelligent document processing
2. Workflow Orchestration - n8n deployments, webhook integrations, deterministic automation
3. Full-Stack Development - React, TypeScript, Node.js, cloud infrastructure
4. Legal Tech Solutions - Case management, AI transcription (Whisper), automated drafting, legal research
5. E-commerce & Retail Integrations - Multi-channel inventory, automated fulfillment
6. Hardware & Kiosk Deployments - Physical installations, IoT integrations
7. Consulting & Training - Workshops, strategy sessions

KEY DIFFERENTIATORS:
- Hybrid GPT-5 + n8n approach: AI decisioning with deterministic workflows
- Legal tech specialization with 65% drafting time reduction
- 99.9% system uptime guarantee
- 40% faster case processing

CONVERSATION GUIDELINES:
- Be friendly, professional, and helpful
- Answer questions about services clearly
- Pre-qualify leads by understanding their needs
- Suggest relevant services based on their requirements
- For detailed pricing or project discussions, encourage them to fill out the contact form
- Keep responses concise but informative (2-4 sentences typically)
- If asked about things unrelated to DiTech, politely redirect the conversation`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...getCorsHeaders(req), "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error occurred");
    return new Response(JSON.stringify({ error: "An error occurred. Please try again." }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
