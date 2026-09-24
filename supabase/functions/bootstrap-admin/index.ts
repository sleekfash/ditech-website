// One-time bootstrap: creates the first administrator account.
// Refuses to run once any account exists, so it cannot be abused later.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: existing } = await admin.from("profiles").select("user_id").limit(1);
  if (existing && existing.length > 0) {
    return new Response(JSON.stringify({ error: "already_initialised" }), {
      status: 409,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "");
  const password = String(body.password ?? "");
  if (!email.includes("@") || password.length < 16) {
    return new Response(JSON.stringify({ error: "invalid_input" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "DiTech Administrator" },
  });
  if (error || !created.user) {
    return new Response(JSON.stringify({ error: error?.message ?? "create_failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await admin.from("profiles").update({ is_admin: true }).eq("user_id", created.user.id);

  return new Response(JSON.stringify({ success: true, user_id: created.user.id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
