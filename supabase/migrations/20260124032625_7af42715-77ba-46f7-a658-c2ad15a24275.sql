-- =============================================
-- FIX 1: Fix chat_conversations RLS policies
-- The table is unused, so we'll restrict all access until proper session tracking is implemented
-- =============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can view their chat session" ON chat_conversations;
DROP POLICY IF EXISTS "Anyone can update their chat session" ON chat_conversations;
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON chat_conversations;

-- Since the chat widget doesn't use database storage, deny all access for now
-- This prevents any data exposure while the table exists unused
CREATE POLICY "Deny all chat access until session tracking implemented" 
ON chat_conversations FOR ALL
USING (false)
WITH CHECK (false);

-- =============================================
-- FIX 2: Create rate_limits table for API protection
-- =============================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient lookup
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
ON rate_limits(identifier, endpoint, created_at);

-- Enable RLS and deny public access (only service role can access)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No public policies - only service role (used by edge functions) can access this table
-- This is intentional as rate limiting should only be managed server-side

-- Create cleanup function for old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;