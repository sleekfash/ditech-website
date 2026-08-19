# Ask Orcka — Full-Page AI Chat + Bot Control Dashboard

## 1. "Ask Orcka" chat page

A dedicated full-page chat experience at `/ask` (linked in the main menu as "Ask Orcka"), replacing the floating chat bubble.

- Layout in the style of Gemini/ChatGPT: centered welcome state with the Orcka mark, suggested starter prompts, streaming answers, and a sticky composer pinned to the bottom.
- One ongoing conversation (no thread sidebar) with a "New conversation" button that clears it.
- History saved in the visitor's browser (localStorage) — no sign-in, restores on reload.
- Streamed markdown rendering, "Thinking…" shimmer while waiting, copy/regenerate on assistant messages, auto-focused composer.
- Built from AI Elements primitives (conversation, message, prompt-input, shimmer) styled to the coastal-luxury theme.
- Product-catalog awareness is kept, so Orcka can still describe and recommend shop items.
- The floating `ChatWidget` is removed from the site layout; a slim "Ask Orcka" entry point stays on the homepage.
- A generated Orcka brand mark is used for the agent identity (no generic sparkle icon).

## 2. Admin control dashboard for the bot

A new "Orcka AI" tab in the existing admin dashboard, admin-only, with four panels:

**Persona & instructions**
- Editable bot name, tagline, tone (professional / warm / concise / consultative), response length, and the full system instruction text.
- Editable greeting message and the starter prompts shown on the empty chat screen.
- Guardrails field: topics to refuse or redirect, plus a "always end with a CTA" toggle.
- Live preview panel to test a prompt against the draft config before publishing.
- Draft vs. published versions, with version history and one-click rollback.

**Knowledge snippets / FAQ**
- CRUD list of Q&A pairs and business facts, each with a label, enabled toggle, and priority.
- Enabled snippets are injected into the system prompt so answers stay on-message.

**Model & creativity**
- Model picker (default `google/gemini-3.7-flash`), temperature, max response length, and toggles for product-catalog awareness and transcript logging.

**Transcripts & analytics**
- List of recent conversations with full message view, flag-as-bad-answer, and notes.
- Simple analytics: conversations per day, message volume, most common opening questions, flagged-answer count.
- Requires server-side logging of chats (see technical notes) — visitor-side history stays in localStorage regardless.

## 3. Suggested additions (included)

- Fallback behaviour when the model errors or credits run out: friendly message plus a link to the contact form.
- Rate-limit and abuse guardrails kept as-is (15 req/min per IP).
- "Escalate to human" — when Orcka detects a qualified lead, it offers the contact form and the admin sees it flagged in transcripts.

## Technical notes

- New tables: `bot_config` (single active row + version history), `bot_knowledge` (snippets), `chat_logs` + `chat_log_messages` (transcripts, flags, notes). Each with explicit GRANTs; reads restricted to admins via `is_admin(auth.uid())`; writes only from the edge function's service role.
- `supabase/functions/ai-chat/index.ts` is extended to: load the published `bot_config` + enabled knowledge snippets, compose the system prompt from them (falling back to the current hardcoded prompt), respect the configured model/temperature/length, and log each turn when logging is enabled. Existing Zod validation, CORS allowlist, and rate limiting stay.
- New route `/ask` in `App.tsx`, plus a nav entry in `src/config/nav.ts`. `ChatWidget` removed from `Layout.tsx`.
- Chat page state and localStorage persistence live in a `useOrckaChat` hook; the streaming call keeps using the existing edge function endpoint.
- Bot defaults (name, greeting, starter prompts, fallback copy) added to `src/config/` so a deployment can rebrand without touching components.
- SEO: title/description and canonical for `/ask`.
