import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const OrderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  notes: z.string().trim().max(1000).optional().nullable(),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1)
    .max(30),
});

const reference = () =>
  `DT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip =
      req.headers.get("x-real-ip") ||
      (forwardedFor ? forwardedFor.split(",").at(-1)?.trim() : null) ||
      "unknown";

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("identifier", ip)
      .eq("endpoint", "place-order")
      .gte("created_at", windowStart);

    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return json({ error: "Too many orders in a short time. Please try again shortly." }, 429);
    }
    await supabase.from("rate_limits").insert({ identifier: ip, endpoint: "place-order" });

    const parsed = OrderSchema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: "Invalid order details", details: parsed.error.flatten().fieldErrors }, 400);
    }
    const order = parsed.data;

    // Prices and availability always come from the database, never the browser.
    const ids = [...new Set(order.items.map((i) => i.product_id))];
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id,name,price,in_stock,published")
      .in("id", ids)
      .eq("published", true);

    if (productError) {
      console.error("Product lookup failed:", productError.code);
      return json({ error: "Could not verify the products in your cart." }, 500);
    }

    const byId = new Map((products ?? []).map((p) => [p.id, p]));
    const unavailable: string[] = [];
    const lines = order.items.map((item) => {
      const product = byId.get(item.product_id);
      if (!product || !product.in_stock) {
        unavailable.push(product?.name ?? "An item in your cart");
        return null;
      }
      return {
        product_id: product.id,
        product_name: product.name,
        unit_price: Number(product.price),
        quantity: item.quantity,
      };
    });

    if (unavailable.length > 0) {
      return json({ error: `No longer available: ${unavailable.join(", ")}` }, 409);
    }

    const items = lines.filter((l): l is NonNullable<typeof l> => l !== null);
    const total = items.reduce((sum, l) => sum + l.unit_price * l.quantity, 0);

    const { data: created, error: orderError } = await supabase
      .from("orders")
      .insert({
        reference: reference(),
        customer_name: order.name,
        customer_email: order.email,
        customer_phone: order.phone,
        notes: order.notes || null,
        currency: "NGN",
        total,
        status: "pending",
      })
      .select("id,reference,total,currency")
      .single();

    if (orderError || !created) {
      console.error("Order insert failed:", orderError?.code);
      return json({ error: "Could not save your order. Please try again." }, 500);
    }

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(items.map((l) => ({ ...l, order_id: created.id })));

    if (itemsError) {
      console.error("Order items insert failed:", itemsError.code);
      await supabase.from("orders").delete().eq("id", created.id);
      return json({ error: "Could not save your order. Please try again." }, 500);
    }

    return json({
      success: true,
      reference: created.reference,
      total: Number(created.total),
      currency: created.currency,
    });
  } catch (error) {
    console.error("place-order error", error instanceof Error ? error.message : "unknown");
    return json({ error: "Something went wrong placing your order." }, 500);
  }
});
