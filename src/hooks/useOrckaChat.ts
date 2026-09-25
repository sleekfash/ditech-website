import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { products } from "@/config/products";
import { bot, type PublicBotConfig } from "@/config/bot";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

const productContext = products.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  inStock: p.inStock,
  rating: p.rating,
  reviews: p.reviews,
  badge: p.badge ?? undefined,
  originalPrice: p.originalPrice ?? undefined,
}));

interface StoredConversation {
  sessionId: string;
  messages: ChatMessage[];
}

const newSessionId = () =>
  `orcka-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function loadStored(): StoredConversation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(bot.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConversation;
    if (!parsed.sessionId || !Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useOrckaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [sessionId, setSessionId] = useState<string>("");
  const [publicConfig, setPublicConfig] = useState<PublicBotConfig | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Idempotent bootstrap — safe under StrictMode double-mount.
  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setSessionId(stored.sessionId);
      setMessages(stored.messages);
    } else {
      const fresh = newSessionId();
      setSessionId(fresh);
      window.localStorage.setItem(
        bot.storageKey,
        JSON.stringify({ sessionId: fresh, messages: [] })
      );
    }
  }, []);

  // Load admin-published public config (greeting, starter prompts, name).
  useEffect(() => {
    let cancelled = false;
    fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-bot-config`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      }
    )
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.config) setPublicConfig(data.config);
      })
      .catch(() => {
        /* defaults stay in place */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((sid: string, msgs: ChatMessage[]) => {
    window.localStorage.setItem(
      bot.storageKey,
      JSON.stringify({ sessionId: sid, messages: msgs })
    );
  }, []);

  const send = useCallback(
    async (text: string, historyOverride?: ChatMessage[]) => {
      const trimmed = text.trim();
      if (!trimmed || status === "submitted" || status === "streaming") return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      const base = historyOverride ?? messages;
      const nextMessages = [...base, userMessage];
      setMessages(nextMessages);
      persist(sessionId, nextMessages);
      setStatus("submitted");

      abortRef.current = new AbortController();

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        if (!accessToken) throw new Error("Please sign in to chat.");
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              // Only user turns are sent — the server rejects caller-supplied
              // assistant roles to prevent forged conversation context.
              messages: nextMessages
                .filter((m) => m.role === "user")
                .map((m) => ({ role: "user" as const, content: m.content })),
              sessionId,
              context: { products: productContext },
            }),
            signal: abortRef.current.signal,
          }
        );

        if (!response.ok) {
          let message = bot.errorMessage;
          try {
            const errData = await response.json();
            if (typeof errData?.error === "string") message = errData.error;
          } catch {
            /* keep default */
          }
          if (response.status === 429) toast.error("Too many requests — please wait a moment.");
          throw new Error(message);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantId = `assistant-${Date.now()}`;
        setMessages((prev) => {
          const updated = [...prev, { id: assistantId, role: "assistant" as const, content: "" }];
          persist(sessionId, updated);
          return updated;
        });
        setStatus("streaming");

        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  )
                );
              }
            } catch {
              /* partial chunk */
            }
          }
        }

        setMessages((prev) => {
          persist(sessionId, prev);
          return prev;
        });
        setStatus("ready");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setStatus("ready");
          return;
        }
        const friendly =
          error instanceof Error && error.message ? error.message : bot.errorMessage;
        setMessages((prev) => {
          const updated = [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant" as const,
              content: `${friendly}\n\nYou can also reach us via the [contact form](/contact).`,
            },
          ];
          persist(sessionId, updated);
          return updated;
        });
        setStatus("error");
        setTimeout(() => setStatus("ready"), 1500);
      }
    },
    [messages, sessionId, status, persist]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    const fresh = newSessionId();
    setSessionId(fresh);
    setMessages([]);
    setStatus("ready");
    persist(fresh, []);
  }, [persist]);

  // Resend the last user turn (regenerate).
  const regenerate = useCallback(() => {
    const trimmed = [...messages];
    while (trimmed.length && trimmed[trimmed.length - 1].role !== "user") trimmed.pop();
    const lastUser = trimmed[trimmed.length - 1];
    if (!lastUser || status !== "ready") return;
    const history = trimmed.slice(0, -1);
    setMessages(history);
    persist(sessionId, history);
    void send(lastUser.content, history);
  }, [messages, sessionId, status, persist, send]);

  return { messages, status, sessionId, publicConfig, send, stop, reset, regenerate };
}
