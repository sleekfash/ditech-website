import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const submission: ContactSubmission = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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
      console.error("Database error:", dbError);
      throw new Error("Failed to save submission");
    }

    // Check if Resend API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey) {
      // Send notification email
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "DiTech Contact <onboarding@resend.dev>",
            to: ["contact@ditech.solutions"], // Replace with actual email
            subject: `New Contact Form Submission: ${submission.projectType}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> ${submission.email}</p>
              <p><strong>Company:</strong> ${submission.company || "Not provided"}</p>
              <p><strong>Project Type:</strong> ${submission.projectType}</p>
              <p><strong>Budget:</strong> ${submission.budget || "Not specified"}</p>
              <h3>Message:</h3>
              <p>${submission.message}</p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error("Email sending failed:", await emailResponse.text());
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
        // Don't throw - we still saved to database
      }
    } else {
      console.log("RESEND_API_KEY not configured - skipping email notification");
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});