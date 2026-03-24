-- Revoke public execute on cleanup_rate_limits to prevent RPC abuse
REVOKE EXECUTE ON FUNCTION public.cleanup_rate_limits() FROM PUBLIC, anon, authenticated;

-- Grant only to service_role (used by pg_cron scheduled job)
GRANT EXECUTE ON FUNCTION public.cleanup_rate_limits() TO service_role;