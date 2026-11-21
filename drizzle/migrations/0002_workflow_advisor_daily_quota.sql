CREATE TABLE public.workflow_advisor_daily_usage (
  account_hash text PRIMARY KEY,
  usage_day date NOT NULL,
  request_count smallint NOT NULL DEFAULT 0
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workflow_advisor_daily_usage TO service_role;

ALTER TABLE public.workflow_advisor_daily_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage workflow advisor daily usage"
  ON public.workflow_advisor_daily_usage
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.consume_workflow_advisor_daily_limit(p_account_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today_utc date := (now() AT TIME ZONE 'UTC')::date;
  updated_count smallint;
BEGIN
  IF p_account_hash IS NULL OR p_account_hash !~ '^[0-9a-f]{64}$' THEN
    RETURN false;
  END IF;

  INSERT INTO public.workflow_advisor_daily_usage (account_hash, usage_day, request_count)
  VALUES (p_account_hash, today_utc, 1)
  ON CONFLICT (account_hash) DO UPDATE
  SET usage_day = EXCLUDED.usage_day,
      request_count = CASE
        WHEN public.workflow_advisor_daily_usage.usage_day = EXCLUDED.usage_day
          THEN public.workflow_advisor_daily_usage.request_count + 1
        ELSE 1
      END
  WHERE public.workflow_advisor_daily_usage.usage_day < EXCLUDED.usage_day
     OR (
       public.workflow_advisor_daily_usage.usage_day = EXCLUDED.usage_day
       AND public.workflow_advisor_daily_usage.request_count < 3
     )
  RETURNING request_count INTO updated_count;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_workflow_advisor_daily_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_workflow_advisor_daily_limit(text) TO service_role;