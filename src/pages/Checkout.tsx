import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/currency";
import { site } from "@/config/site";
import { shopHref } from "@/config/nav";
import { productImage } from "@/lib/productImage";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { CheckoutStep } from "@/types/checkout";

const Checkout = () => {
  const { cart, count, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [placedTotal, setPlacedTotal] = useState(0);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", notes: "" });

  const set = (key: keyof typeof details, value: string) =>
    setDetails((d) => ({ ...d, [key]: value }));

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke("place-order", {
      body: {
        name: details.name,
        email: details.email,
        phone: details.phone,
        notes: details.notes || null,
        items: cart.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      },
    });
    setSubmitting(false);

    const payload = data as { success?: boolean; reference?: string; total?: number; error?: string } | null;

    if (error || !payload?.success || !payload.reference) {
      toast({
        title: "Order not placed",
        description: payload?.error ?? "Please check your details and try again.",
        variant: "destructive",
      });
      return;
    }

    setReference(payload.reference);
    setPlacedTotal(payload.total ?? cart.total);
    clearCart();
    setStep("confirmation");
  };

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "cart", label: "Cart" },
    { id: "details", label: "Your details" },
    { id: "confirmation", label: "Confirmation" },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Checkout | {site.brand.name} Shop</title>
        <meta name="description" content="Review your selected hardware and place your order with DiTech." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <span className="kicker">Checkout</span>
          <h1 className="serif text-3xl md:text-4xl lg:text-5xl mt-3 mb-8 brass-rule">
            {step === "confirmation" ? "Order received." : "Your selection."}
          </h1>

          <ol className="flex flex-wrap items-center gap-3 mb-10 text-sm">
            {steps.map((s, i) => {
              const currentIndex = steps.findIndex((x) => x.id === step);
              const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "todo";
              return (
                <li key={s.id} className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                      state === "todo"
                        ? "bg-muted text-muted-foreground"
                        : "bg-[hsl(var(--ink))] text-[hsl(var(--background))]"
                    }`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className={state === "current" ? "font-medium" : "text-muted-foreground"}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && <span className="w-6 h-[1px] bg-border" aria-hidden="true" />}
                </li>
              );
            })}
          </ol>

          {/* Step 1 — cart */}
          {step === "cart" && (
            <>
              {count === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
                    <p className="text-muted-foreground mb-6">Your cart is empty.</p>
                    <Button asChild className="rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))]">
                      <Link to={shopHref}>Browse the shop</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
                  <ul className="space-y-4">
                    {cart.items.map((item) => (
                      <li
                        key={item.product_id}
                        className="flex gap-4 p-4 rounded-2xl border border-border bg-card"
                      >
                        <img
                          src={productImage(item.image, 160)}
                          alt=""
                          width={80}
                          height={80}
                          loading="lazy"
                          decoding="async"
                          className="h-20 w-20 rounded-xl object-cover bg-muted shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="serif text-lg leading-snug">{item.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(item.price)} each
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                            <span className="w-8 text-center text-sm" aria-live="polite">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 ml-2"
                              aria-label={`Remove ${item.name}`}
                              onClick={() => removeItem(item.product_id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                        <div className="serif text-lg text-[hsl(var(--sea))] whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Card className="lg:sticky lg:top-28">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="serif text-2xl">{formatPrice(cart.total)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{site.commerce.fulfilmentNote}</p>
                      <Button
                        className="w-full rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))]"
                        onClick={() => setStep("details")}
                      >
                        Continue
                      </Button>
                      <Button asChild variant="outline" className="w-full rounded-full">
                        <Link to={shopHref}>Keep shopping</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}

          {/* Step 2 — details */}
          {step === "details" && (
            <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={placeOrder} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="co-name">Full name</Label>
                      <Input
                        id="co-name"
                        value={details.name}
                        onChange={(e) => set("name", e.target.value)}
                        autoComplete="name"
                        required
                        minLength={2}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="co-email">Email</Label>
                        <Input
                          id="co-email"
                          type="email"
                          value={details.email}
                          onChange={(e) => set("email", e.target.value)}
                          autoComplete="email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="co-phone">Phone</Label>
                        <Input
                          id="co-phone"
                          type="tel"
                          value={details.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          autoComplete="tel"
                          required
                          minLength={7}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="co-notes">Anything we should know? (optional)</Label>
                      <Textarea
                        id="co-notes"
                        rows={3}
                        value={details.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        placeholder="Preferred delivery area, timing, colour…"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={submitting || count === 0}
                        className="rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))]"
                      >
                        {submitting ? "Placing order…" : `Place order · ${formatPrice(cart.total)}`}
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full" onClick={() => setStep("cart")}>
                        Back to cart
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-3">
                  <p className="kicker">Order summary</p>
                  <ul className="space-y-2 text-sm">
                    {cart.items.map((i) => (
                      <li key={i.product_id} className="flex justify-between gap-3">
                        <span className="text-muted-foreground truncate">
                          {i.quantity} × {i.name}
                        </span>
                        <span className="whitespace-nowrap">{formatPrice(i.price * i.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline justify-between border-t border-border pt-3">
                    <span className="text-muted-foreground">Total</span>
                    <span className="serif text-xl">{formatPrice(cart.total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{site.commerce.fulfilmentNote}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3 — confirmation */}
          {step === "confirmation" && reference && (
            <Card className="max-w-xl">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-4 text-[hsl(var(--sea))]" aria-hidden="true" />
                <h2 className="serif text-2xl mb-2">Thank you, {details.name.split(" ")[0]}.</h2>
                <p className="text-muted-foreground mb-6">
                  Your order reference is{" "}
                  <span className="font-medium text-foreground">{reference}</span> for{" "}
                  {formatPrice(placedTotal)}. {site.commerce.fulfilmentNote}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(var(--sea))]">
                    <Link to={shopHref}>Continue shopping</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/contact">Contact us about this order</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
