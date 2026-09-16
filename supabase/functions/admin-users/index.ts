import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

const BodySchema = z.union([
  z.object({ action: z.literal("list") }),
  z.object({
    action: z.literal("set_admin"),
    user_id: z.string().uuid(),
    is_admin: z.boolean(),
  }),
]);

serve(async (req) => {
  const cors = getCorsHeaders(req);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // 1. Who is calling?
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Not signed in" }, 401);

    const { data: userData, error: userError } = await admin.auth.getUser(token);
    const caller = userData?.user;
    if (userError || !caller) return json({ error: "Not signed in" }, 401);

    // 2. Is the caller an administrator?
    const { data: callerProfile } = await admin
      .from("profiles")
      .select("is_admin")
      .eq("user_id", caller.id)
      .maybeSingle();

    if (!callerProfile?.is_admin) return json({ error: "Administrators only" }, 403);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid request" }, 400);
    const body = parsed.data;

    if (body.action === "list") {
      const { data: profiles, error } = await admin
        .from("profiles")
        .select("user_id,email,full_name,is_admin,created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("profiles list failed:", error.code);
        return json({ error: "Could not load accounts" }, 500);
      }

      return json({
        users: (profiles ?? []).map((p) => ({
          user_id: p.user_id,
          email: p.email,
          full_name: p.full_name,
          is_admin: Boolean(p.is_admin),
          created_at: p.created_at,
          is_self: p.user_id === caller.id,
        })),
      });
    }

    // set_admin
    if (body.user_id === caller.id) {
      return json({ error: "You cannot change your own administrator access." }, 400);
    }

    if (!body.is_admin) {
      const { count } = await admin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_admin", true);
      if ((count ?? 0) <= 1) {
        return json({ error: "There must always be at least one administrator." }, 400);
      }
    }

    const { error: updateError } = await admin
      .from("profiles")
      .update({ is_admin: body.is_admin })
      .eq("user_id", body.user_id);

    if (updateError) {
      console.error("admin flag update failed:", updateError.code);
      return json({ error: "Could not update this account" }, 500);
    }

    return json({ success: true });
  } catch (error) {
    console.error("admin-users error", error instanceof Error ? error.message : "unknown");
    return json({ error: "Something went wrong" }, 500);
  }
});
