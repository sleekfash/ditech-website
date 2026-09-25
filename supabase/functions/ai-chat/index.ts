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
  const isAllowedOrigin =
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".lovable.app") ||
    origin.startsWith("http://localhost");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(10000, "Message content too long"),
});

const ProductSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().max(200),
  category: z.string().max(80),
  price: z.number(),
  inStock: z.boolean(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  badge: z.string().max(60).nullable().optional(),
  originalPrice: z.number().nullable().optional(),
});

const MAX_PRODUCTS = 50;
const MAX_CONTEXT_BYTES = 25_000;

const PreviewConfigSchema = z.object({
  bot_name: z.string().max(80).optional(),
  tone: z.enum(["professional", "warm", "concise", "consultative"]).optional(),
  response_length: z.enum(["short", "medium", "long"]).optional(),
  system_instructions: z.string().max(20000).optional(),
  guardrails: z.string().max(5000).optional(),
  always_cta: z.boolean().optional(),
  model: z.string().max(80).optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(8000).optional(),
  use_product_context: z.boolean().optional(),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema)
    .min(1, "At least one message is required")
    .max(50, "Too many messages in conversation"),
  sessionId: z.string().min(6).max(80).optional(),
  previewConfig: PreviewConfigSchema.optional(),
  context: z
    .object({
      products: z.array(ProductSchema).max(200).optional(),
    })
    .optional(),
});

const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX_REQUESTS = 15;

// deno-lint-ignore no-explicit-any
async function checkRateLimit(supabase: any, ip: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", ip)
    .eq("endpoint", "ai-chat")
    .gte("created_at", windowStart.toISOString());

  if (error) {
    console.error("Rate limit check error:", error.code);
    return true;
  }
  return (count ?? 0) < RATE_LIMIT_MAX_REQUESTS;
}

// deno-lint-ignore no-explicit-any
async function recordRequest(supabase: any, ip: string): Promise<void> {
  await supabase.from("rate_limits").insert({ identifier: ip, endpoint: "ai-chat" });
}

const DEFAULT_BASE_PROMPT = `You are Orcka, the AI assistant for DiTech Solutions & Services — a boutique studio building bespoke AI, automation and legal-tech systems.

ABOUT DITECH:
Tagline: "Practical AI. Reliable Automation. Tangible Results."
Target clients: law firms, judges, senior advocates, international retailers, SMEs.

KEY SERVICES:
1. AI-Powered Automation — LLMs, RAG pipelines, intelligent document processing
2. Workflow Orchestration — n8n deployments, webhook integrations, deterministic automation
3. Full-Stack Development — React, TypeScript, Node.js, cloud infrastructure
4. Legal Tech Solutions — case management, AI transcription, automated drafting, legal research
5. E-commerce & Retail Integrations — multi-channel inventory, automated fulfillment
6. Hardware & Kiosk Deployments — physical installations, IoT integrations
7. Consulting & Training — workshops, strategy sessions

CONVERSATION GUIDELINES:
- Be friendly, professional and helpful
- Answer questions about services clearly and pre-qualify leads by understanding their needs
- For detailed pricing or project scoping, point people to the contact form
- If asked about things unrelated to DiTech, politely redirect

PRODUCT RECOMMENDATION RULES:
- When a user asks about hardware/gadgets/products, ONLY reference items from the CURRENT PRODUCT CATALOG. Never invent SKUs or prices.
- Describe products in plain language (what it is, standout specs, who it suits).
- Ask 1-2 clarifying questions when needed (budget, use case, OS preference, portability, screen size).
- Recommend 1-3 items, name them exactly as listed, mention the price, and note if out of stock.
- If the requested category is empty in the catalog, say so and suggest an adjacent category or the contact form.`;

const TONE_HINTS: Record<string, string> = {
  professional: "Tone: polished, precise and businesslike.",
  warm: "Tone: warm, human and encouraging while staying professional.",
  concise: "Tone: direct and efficient. No filler, no preamble.",
  consultative: "Tone: consultative — diagnose the need with questions before recommending.",
};

const LENGTH_HINTS: Record<string, string> = {
  short: "Keep replies to 1-2 short sentences unless the user asks for detail.",
  medium: "Keep replies to 2-4 sentences unless the user asks for detail.",
  long: "You may answer in up to 2 short paragraphs when the question warrants it.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = req.headers.get("x-real-ip") ||
               (forwardedFor ? forwardedFor.split(",").at(-1)?.trim() : null) ||
               "unknown";

    const isAllowed = await checkRateLimit(supabase, ip);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait before trying again." }),
        { status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

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

    const { messages, context, sessionId, previewConfig } = validatedData;

    // ---- Load the published bot configuration (admin-tunable) -------------
    // Admin preview: a draft config supplied with the request is honored only
    // when the caller's JWT belongs to an admin — it is never logged.
    let isPreview = false;
    if (previewConfig) {
      const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
      const { data: userData } = await supabase.auth.getUser(token);
      const userId = userData?.user?.id;
      if (!userId) {
        return new Response(JSON.stringify({ error: "Preview requires admin sign-in" }), {
          status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", userId)
        .maybeSingle();
      if (!profile?.is_admin) {
        return new Response(JSON.stringify({ error: "Preview requires admin sign-in" }), {
          status: 403, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      isPreview = true;
    }

    let config: Record<string, unknown> | null = null;
    if (!isPreview) {
      const { data } = await supabase
        .from("bot_config")
        .select("*")
        .eq("status", "published")
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();
      config = data;
    } else {
      config = previewConfig as Record<string, unknown>;
    }

    const botName = (config?.bot_name as string) || "Orcka";
    const model = (config?.model as string) || "google/gemini-3.7-flash";
    const temperature = typeof config?.temperature === "number" ? config.temperature : 0.6;
    const maxTokens = (config?.max_tokens as number) ?? 900;
    const useProducts = config?.use_product_context ?? true;
    const logTranscripts = !isPreview && (config?.log_transcripts ?? true);

    const { data: knowledge } = await supabase
      .from("bot_knowledge")
      .select("label, question, answer, priority")
      .eq("enabled", true)
      .order("priority", { ascending: true })
      .limit(100);

    // ---- Product catalog block -------------------------------------------
    let productBlock = "";
    if (useProducts && context?.products && context.products.length > 0) {
      const rawSize = JSON.stringify(context.products).length;
      if (rawSize > MAX_CONTEXT_BYTES) {
        return new Response(
          JSON.stringify({ error: "Product context too large" }),
          { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }
      const seen = new Set<string>();
      const deduped = context.products.filter((p) => {
        const key = String(p.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const truncated = deduped.length > MAX_PRODUCTS;
      const lines = deduped.slice(0, MAX_PRODUCTS).map((p) => {
        const parts: string[] = [
          `- [${p.id}] ${p.name} (${p.category})`,
          `$${p.price.toLocaleString()}`,
        ];
        if (p.originalPrice) parts.push(`was $${p.originalPrice.toLocaleString()}`);
        if (typeof p.rating === "number") parts.push(`${p.rating}★`);
        if (typeof p.reviews === "number") parts.push(`${p.reviews} reviews`);
        parts.push(p.inStock ? "in stock" : "out of stock");
        if (p.badge) parts.push(p.badge);
        return parts.join(" · ");
      });
      productBlock =
        "\n\nCURRENT PRODUCT CATALOG (recommend ONLY from this list; refer to items by name):\n" +
        lines.join("\n") +
        (truncated ? "\n... (truncated)" : "");
    } else if (useProducts && context?.products && context.products.length === 0) {
      productBlock =
        "\n\nCURRENT PRODUCT CATALOG: no products currently available. If asked to recommend hardware, say inventory is unavailable and redirect to services or the contact form.";
    }

    // ---- Compose the system prompt ---------------------------------------
    const sections: string[] = [];
    const instructions = (config?.system_instructions as string) ?? "";
    const tone = (config?.tone as string) ?? "";
    const responseLength = (config?.response_length as string) ?? "";
    const guardrails = (config?.guardrails as string) ?? "";
    sections.push(instructions.trim() ? instructions.trim() : DEFAULT_BASE_PROMPT);
    sections.push(`Your name is ${botName}.`);
    if (tone && TONE_HINTS[tone]) sections.push(TONE_HINTS[tone]);
    if (responseLength && LENGTH_HINTS[responseLength]) {
      sections.push(LENGTH_HINTS[responseLength]);
    }
    if (guardrails.trim()) sections.push(`GUARDRAILS:\n${guardrails.trim()}`);
    if (config?.always_cta) {
      sections.push("Always close with a clear next step (book a call, or use the contact form).");
    }
    if (knowledge && knowledge.length > 0) {
      const kb = knowledge
        .map((k: { label: string; question: string; answer: string }) =>
          `- ${k.label}${k.question ? ` — Q: ${k.question}` : ""}\n  A: ${k.answer}`)
        .join("\n");
      sections.push(`VERIFIED KNOWLEDGE (prefer these facts over your own assumptions):\n${kb}`);
    }
    sections.push(
      "If a visitor looks like a qualified lead (budget, timeline or a concrete project), offer the contact form and say a human will follow up."
    );
    const systemPrompt = sections.join("\n\n") + productBlock;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    await recordRequest(supabase, ip);

    // ---- Transcript logging (server-side, admin-visible) -----------------
    let logId: string | null = null;
    if (logTranscripts && sessionId) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const { data: existing } = await supabase
        .from("chat_logs")
        .select("id, message_count")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existing) {
        logId = existing.id;
        await supabase
          .from("chat_logs")
          .update({ message_count: messages.length, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("chat_logs")
          .insert({
            session_id: sessionId,
            first_question: lastUser?.content?.slice(0, 500) ?? null,
            message_count: messages.length,
          })
          .select("id")
          .maybeSingle();
        if (insertError) console.error("chat_logs insert error:", insertError.message);
        logId = inserted?.id ?? null;
      }

      if (logId && lastUser) {
        const { error: msgError } = await supabase.from("chat_log_messages").insert({
          log_id: logId,
          role: "user",
          content: lastUser.content.slice(0, 10000),
        });
        if (msgError) console.error("chat_log_messages insert error:", msgError.message);
      }
    }

    const body: Record<string, unknown> = {
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    };
    if (model.startsWith("openai/")) {
      body.max_completion_tokens = maxTokens;
    } else {
      body.max_tokens = maxTokens;
      body.temperature = temperature;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok || !response.body) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later or use the contact form." }), {
          status: 402,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      if (response.status === 403) {
        return new Response(JSON.stringify({ error: "AI access is currently disabled for this workspace." }), {
          status: 403,
          headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Tee the stream so we can persist the assistant reply without delaying it.
    if (!logId) {
      return new Response(response.body, {
        headers: { ...getCorsHeaders(req), "Content-Type": "text/event-stream" },
      });
    }

    const decoder = new TextDecoder();
    let assistantText = "";
    const capture = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
        const text = decoder.decode(chunk, { stream: true });
        for (const line of text.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) assistantText += delta;
          } catch {
            // partial chunk — ignore
          }
        }
      },
      async flush() {
        if (!assistantText) return;
        const { error } = await supabase.from("chat_log_messages").insert({
          log_id: logId,
          role: "assistant",
          content: assistantText.slice(0, 10000),
        });
        if (error) console.error("assistant log insert error:", error.message);
      },
    });

    return new Response(response.body.pipeThrough(capture), {
      headers: { ...getCorsHeaders(req), "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error occurred", error instanceof Error ? error.message : error);
    return new Response(JSON.stringify({ error: "An error occurred. Please try again." }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
