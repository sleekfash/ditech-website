import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RotateCcw, Copy, RefreshCw, Check } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useOrckaChat } from "@/hooks/useOrckaChat";
import { bot } from "@/config/bot";
import { supabase } from "@/integrations/supabase/client";

const Ask = () => {
  const { messages, status, publicConfig, send, stop, reset, regenerate } =
    useOrckaChat();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(Boolean(session))
    );
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    return () => sub.subscription.unsubscribe();
  }, []);

  const botName = publicConfig?.bot_name || bot.name;
  const greeting = publicConfig?.greeting || bot.greeting;
  const starterPrompts =
    publicConfig?.starter_prompts?.length
      ? publicConfig.starter_prompts
      : bot.starterPrompts;

  useEffect(() => {
    document.title = `Ask ${botName} — AI Assistant | DiTech Solutions`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        `Chat with ${botName}, DiTech's AI assistant. Explore AI automation, legal tech, workflow orchestration and product recommendations.`
      );
    }
  }, [botName]);

  const handleSubmit = (message: PromptInputMessage) => {
    void send(message.text);
  };

  const copyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const isBusy = status === "submitted" || status === "streaming";
  const chatStatus =
    status === "error" ? "error" : isBusy ? status : undefined;
  const lastMessage = messages[messages.length - 1];
  const showThinking =
    status === "submitted" ||
    (status === "streaming" &&
      lastMessage?.role === "assistant" &&
      !lastMessage.content);

  return (
    <Layout>
      <div className="container-custom flex h-[calc(100dvh-8rem)] flex-col md:h-[calc(100dvh-9rem)]">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4 pt-6">
          <div className="flex items-center gap-3">
            <img
              src={bot.logo}
              alt={`${botName} logo`}
              width={512}
              height={512}
              className="h-11 w-11 rounded-xl object-cover ring-1 ring-[hsl(var(--brass))]/30"
            />
            <div>
              <h1 className="serif text-xl font-medium tracking-tight text-foreground">
                Ask {botName}
              </h1>
              <p className="text-xs text-muted-foreground">
                {publicConfig?.tagline || bot.tagline}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={messages.length === 0}
            className="rounded-full"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
            New conversation
          </Button>
        </div>

        {/* Conversation */}
        <Conversation className="flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-2 py-8">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[45vh] flex-col items-center justify-center gap-6 text-center"
              >
                <img
                  src={bot.logo}
                  alt=""
                  width={512}
                  height={512}
                  className="h-24 w-24 rounded-3xl object-cover shadow-[0_18px_50px_-18px_hsl(var(--sea)/0.4)] ring-1 ring-[hsl(var(--brass))]/30"
                />
                <div className="max-w-md space-y-2">
                  <h2 className="serif text-2xl font-medium tracking-tight">
                    {botName}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {greeting}
                  </p>
                </div>
                <div className="flex max-w-2xl flex-wrap items-center justify-center gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => void send(prompt)}
                      className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-[hsl(var(--sea))]/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent
                      className={
                        message.role === "assistant"
                          ? "bg-transparent p-0 text-foreground"
                          : "rounded-3xl bg-primary px-5 py-3 text-primary-foreground"
                      }
                    >
                      {message.role === "assistant" ? (
                        message.content ? (
                          <MessageResponse>{message.content}</MessageResponse>
                        ) : showThinking && index === messages.length - 1 ? (
                          <Shimmer className="text-sm">Thinking…</Shimmer>
                        ) : null
                      ) : (
                        <span className="whitespace-pre-wrap break-words">
                          {message.content}
                        </span>
                      )}
                    </MessageContent>
                    {message.role === "assistant" &&
                      message.content &&
                      index === messages.length - 1 &&
                      status === "ready" && (
                        <MessageActions className="mt-1">
                          <MessageAction
                            label={copiedId === message.id ? "Copied" : "Copy"}
                            onClick={() => copyMessage(message.id, message.content)}
                          >
                            {copiedId === message.id ? (
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </MessageAction>
                          <MessageAction
                            label="Regenerate response"
                            onClick={regenerate}
                          >
                            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                          </MessageAction>
                        </MessageActions>
                      )}
                  </Message>
                ))}
                {showThinking && lastMessage?.role === "user" && (
                  <Message from="assistant">
                    <MessageContent className="bg-transparent p-0 text-foreground">
                      <Shimmer className="text-sm">Thinking…</Shimmer>
                    </MessageContent>
                  </Message>
                )}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Composer */}
        <div className="mx-auto w-full max-w-3xl pb-4 pt-2">
          {signedIn === false && (
            <p className="mb-2 text-center text-sm text-muted-foreground">
              Please{" "}
              <Link to="/auth" className="underline underline-offset-2 hover:text-foreground">
                sign in
              </Link>{" "}
              to chat with {botName}.
            </p>
          )}
          <PromptInput
            onSubmit={handleSubmit}
            className="rounded-3xl border-border/80 bg-card shadow-[0_10px_40px_-18px_hsl(var(--ink)/0.25)]"
          >
            <PromptInputTextarea
              autoFocus
              placeholder={bot.placeholder}
              disabled={isBusy}
              aria-label={`Message ${botName}`}
            />
            <PromptInputFooter className="justify-between">
              <p className="px-3 text-[11px] text-muted-foreground">
                {botName} can make mistakes. For project scoping,{" "}
                <Link
                  to="/contact"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  talk to us
                </Link>
                .
              </p>
              <PromptInputSubmit
                status={chatStatus}
                onStop={stop}
                disabled={status === "error"}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </Layout>
  );
};

export default Ask;
