// ============================================================================
// ORCKA BOT — client-side defaults. The published bot_config row in the
// database (edited from Admin → Orcka AI) overrides these at runtime.
// ============================================================================

import orckaLogo from "@/assets/orcka-logo.png";

export const bot = {
  name: "Orcka",
  tagline: "DiTech's AI assistant",
  greeting:
    "Hi, I'm Orcka. Ask me about our AI, automation and legal-tech work — or tell me what you're trying to build.",
  logo: orckaLogo,
  starterPrompts: [
    "Tell me about your services",
    "What is your legal tech solution?",
    "How does AI automation work?",
    "I want to discuss a project",
  ],
  placeholder: "Ask Orcka anything…",
  errorMessage:
    "I'm having trouble connecting right now. Please try again in a moment, or reach us through the contact form.",
  storageKey: "orcka-chat-v1",
} as const;

export interface PublicBotConfig {
  bot_name?: string;
  tagline?: string;
  greeting?: string;
  starter_prompts?: string[];
}
