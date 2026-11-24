-- Restrict internal maintenance and auditing to trusted backend roles.
-- Trigger invocation does not require EXECUTE grants for API roles.
REVOKE EXECUTE ON FUNCTION public.security_lint() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_rate_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.security_lint() TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_rate_limits() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
