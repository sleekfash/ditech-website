import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageResponse } from "@/components/ai-elements/message";
import { supabase } from "@/integrations/supabase/client";
import { bot } from "@/config/bot";
import { products } from "@/config/products";

const productContext = products.map((p) => ({
  id: p.id, name: p.name, category: p.category, price: p.price, inStock: p.inStock,
}));

// One-off question box — no history kept.
const HomeAsk = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setBusy(true);
    setAnswer("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setAnswer("Please [sign in](/auth) to ask Orcka.");
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: q }],
          context: { products: productContext },
        }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        setAnswer(`${err?.error ?? bot.errorMessage}`);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let out = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let i: number;
        while ((i = buf.indexOf("\n")) !== -1) {
          const line = buf.slice(0, i).trim();
          buf = buf.slice(i + 1);
          if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
          try {
            const delta = JSON.parse(line.slice(6)).choices?.[0]?.delta?.content;
            if (delta) { out += delta; setAnswer(out); }
          } catch { /* partial */ }
        }
      }
    } catch {
      setAnswer(bot.errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section-padding">
      <div className="container-custom max-w-3xl text-center">
        <img src={bot.logo} alt="" width={64} height={64} className="mx-auto mb-4 h-14 w-14 rounded-2xl object-cover" />
        <h2 className="serif text-3xl font-medium tracking-tight">Ask Orcka a quick question</h2>
        <p className="mt-2 text-muted-foreground">
          Services, automations, e-commerce work or products — answers come from what's on this site.
        </p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => { e.preventDefault(); void ask(question); }}
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={bot.placeholder}
            aria-label="Your question for Orcka"
            maxLength={1000}
            className="h-12 rounded-full px-5"
          />
          <Button type="submit" disabled={busy || !question.trim()} className="h-12 rounded-full px-6">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Ask"}
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {bot.starterPrompts.slice(0, 3).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { setQuestion(p); void ask(p); }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
        {(answer || busy) && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left" aria-live="polite">
            {answer ? <MessageResponse>{answer}</MessageResponse> : <p className="text-sm text-muted-foreground">Thinking…</p>}
            <Link to="/ask" className="mt-3 inline-flex items-center text-sm text-primary hover:underline">
              Continue in Ask Orcka <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeAsk;
