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

// Server-side validation schema
const ContactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.string()
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .trim(),
  company: z.string()
    .max(200, "Company name must be less than 200 characters")
    .optional()
    .nullable(),
  projectType: z.string()
    .min(1, "Project type is required")
    .max(100, "Project type must be less than 100 characters"),
  budget: z.string()
    .max(50, "Budget must be less than 50 characters")
    .optional()
    .nullable(),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters")
    .trim(),
});

type ContactSubmission = z.infer<typeof ContactSchema>;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 submissions per minute per IP

// deno-lint-ignore no-explicit-any
async function checkRateLimit(supabase: any, ip: string): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  // Count recent requests from this IP
  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("identifier", ip)
    .eq("endpoint", "contact-form")
    .gte("created_at", windowStart.toISOString());

  if (error) {
    console.error("Rate limit check error:", error.code);
    // Allow request on error to avoid blocking legitimate users
    return true;
  }

  return (count ?? 0) < RATE_LIMIT_MAX_REQUESTS;
}

// deno-lint-ignore no-explicit-any
async function recordRequest(supabase: any, ip: string): Promise<void> {
  await supabase.from("rate_limits").insert({
    identifier: ip,
    endpoint: "contact-form",
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    // Create Supabase client with service role for rate limiting
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
        JSON.stringify({ error: "Too many submissions. Please wait a moment before trying again." }),
        { status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    const rawData = await req.json();
    
    let submission: ContactSubmission;
    try {
      submission = ContactSchema.parse(rawData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid form data", 
            details: validationError.errors.map(e => ({ field: e.path.join("."), message: e.message }))
          }),
          { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
        );
      }
      throw validationError;
    }

    // Record this request for rate limiting
    await recordRequest(supabase, ip);

    // Store submission in database
    const { data, error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name: submission.name,
        email: submission.email,
        company: submission.company || null,
        project_type: submission.projectType,
        budget: submission.budget || null,
        message: submission.message,
        status: "new",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError.code);
      throw new Error("Failed to save submission");
    }

    // Check if Resend API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey) {
      // Send notification email
      try {
        // Escape HTML entities for email content
        const escapeHtml = (str: string) => 
          str.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "DiTech Contact <onboarding@resend.dev>",
            to: ["contact@ditech.solutions"],
            subject: `New Contact Form Submission: ${escapeHtml(submission.projectType)}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
              <p><strong>Company:</strong> ${submission.company ? escapeHtml(submission.company) : "Not provided"}</p>
              <p><strong>Project Type:</strong> ${escapeHtml(submission.projectType)}</p>
              <p><strong>Budget:</strong> ${submission.budget ? escapeHtml(submission.budget) : "Not specified"}</p>
              <h3>Message:</h3>
              <p>${escapeHtml(submission.message)}</p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error("Email sending failed");
        }
      } catch (emailError) {
        console.error("Email error occurred");
        // Don't throw - we still saved to database
      }
    } else {
      console.log("RESEND_API_KEY not configured - skipping email notification");
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact form error occurred");
    return new Response(
      JSON.stringify({ error: "Failed to submit form. Please try again." }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  }
});
