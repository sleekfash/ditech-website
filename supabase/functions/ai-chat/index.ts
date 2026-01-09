import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});