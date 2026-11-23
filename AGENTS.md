## Architecture decisions
- Keep the Workflow Advisor in its own Edge Function and homepage module, separate from Ask Orcka; require verified accounts and enforce its daily account quota and IP throttle server-side.
- Ask Orcka loads published product listings from server-side storage and never accepts caller-supplied catalog data, because browser input is untrusted model context.