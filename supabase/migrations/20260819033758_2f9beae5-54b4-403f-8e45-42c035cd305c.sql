CREATE TABLE public.bot_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  version integer NOT NULL DEFAULT 1,
  bot_name text NOT NULL DEFAULT 'Orcka',
  tagline text NOT NULL DEFAULT 'DiTech''s AI assistant',
  greeting text NOT NULL DEFAULT 'Hi, I''m Orcka. Ask me about our AI, automation and legal-tech work — or tell me what you''re trying to build.',
  tone text NOT NULL DEFAULT 'professional' CHECK (tone IN ('professional','warm','concise','consultative')),
  response_length text NOT NULL DEFAULT 'medium' CHECK (response_length IN ('short','medium','long')),
  system_instructions text NOT NULL DEFAULT '',
  guardrails text NOT NULL DEFAULT '',
  starter_prompts jsonb NOT NULL DEFAULT '[]'::jsonb,
  model text NOT NULL DEFAULT 'google/gemini-3.7-flash',
  temperature numeric NOT NULL DEFAULT 0.6 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens integer NOT NULL DEFAULT 900 CHECK (max_tokens > 0 AND max_tokens <= 8000),
  use_product_context boolean NOT NULL DEFAULT true,
  log_transcripts boolean NOT NULL DEFAULT true,
  always_cta boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bot_config TO authenticated;
GRANT ALL ON public.bot_config TO service_role;
ALTER TABLE public.bot_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view bot config" ON public.bot_config
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert bot config" ON public.bot_config
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update bot config" ON public.bot_config
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete bot config" ON public.bot_config
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_bot_config_updated_at BEFORE UPDATE ON public.bot_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.bot_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  question text NOT NULL DEFAULT '',
  answer text NOT NULL,
  priority integer NOT NULL DEFAULT 100,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bot_knowledge TO authenticated;
GRANT ALL ON public.bot_knowledge TO service_role;
ALTER TABLE public.bot_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view bot knowledge" ON public.bot_knowledge
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert bot knowledge" ON public.bot_knowledge
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update bot knowledge" ON public.bot_knowledge
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete bot knowledge" ON public.bot_knowledge
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_bot_knowledge_updated_at BEFORE UPDATE ON public.bot_knowledge
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  first_question text,
  message_count integer NOT NULL DEFAULT 0,
  flagged boolean NOT NULL DEFAULT false,
  lead boolean NOT NULL DEFAULT false,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX chat_logs_session_id_key ON public.chat_logs (session_id);
CREATE INDEX chat_logs_created_at_idx ON public.chat_logs (created_at DESC);

GRANT SELECT, UPDATE, DELETE ON public.chat_logs TO authenticated;
GRANT ALL ON public.chat_logs TO service_role;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view chat logs" ON public.chat_logs
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update chat logs" ON public.chat_logs
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete chat logs" ON public.chat_logs
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_chat_logs_updated_at BEFORE UPDATE ON public.chat_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.chat_log_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id uuid NOT NULL REFERENCES public.chat_logs(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX chat_log_messages_log_id_idx ON public.chat_log_messages (log_id, created_at);

GRANT SELECT, DELETE ON public.chat_log_messages TO authenticated;
GRANT ALL ON public.chat_log_messages TO service_role;
ALTER TABLE public.chat_log_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view chat log messages" ON public.chat_log_messages
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete chat log messages" ON public.chat_log_messages
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

INSERT INTO public.bot_config (status, version, system_instructions, guardrails, starter_prompts)
VALUES (
  'published', 1,
  '',
  'Politely redirect anything unrelated to DiTech. Never invent prices, SKUs or delivery dates.',
  '["Tell me about your services","What is your legal tech solution?","How does AI automation work?","I want to discuss a project"]'::jsonb
);