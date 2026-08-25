CREATE OR REPLACE FUNCTION public.security_lint()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  findings jsonb := '[]'::jsonb;
  r record;
BEGIN
  -- 1. Public tables without RLS enabled (error)
  FOR r IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND NOT c.relrowsecurity
  LOOP
    findings := findings || jsonb_build_object(
      'check', 'rls_disabled',
      'level', 'error',
      'entity', 'public.' || r.relname,
      'title', 'Table without Row Level Security',
      'detail', format('Table public.%I does not have row level security enabled.', r.relname)
    );
  END LOOP;

  -- 2. RLS enabled but no policies at all (error)
  FOR r IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity
      AND NOT EXISTS (SELECT 1 FROM pg_policy p WHERE p.polrelid = c.oid)
  LOOP
    findings := findings || jsonb_build_object(
      'check', 'rls_enabled_no_policy',
      'level', 'error',
      'entity', 'public.' || r.relname,
      'title', 'RLS enabled with no policies',
      'detail', format('Table public.%I has RLS enabled but no policies; all client access is denied.', r.relname)
    );
  END LOOP;

  -- 3. SECURITY DEFINER functions executable by anon/authenticated (warn)
  FOR r IN
    SELECT p.proname, p.oid
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef
      AND (has_function_privilege('anon', p.oid, 'EXECUTE')
        OR has_function_privilege('authenticated', p.oid, 'EXECUTE'))
  LOOP
    findings := findings || jsonb_build_object(
      'check', 'security_definer_executable',
      'level', 'warn',
      'entity', 'public.' || r.proname,
      'title', 'SECURITY DEFINER function callable via API',
      'detail', format('Function public.%I is SECURITY DEFINER and executable by anon or authenticated roles.', r.proname)
    );
  END LOOP;

  -- 4. RLS tables without a permissive INSERT policy (warn)
  FOR r IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity
      AND NOT EXISTS (
        SELECT 1 FROM pg_policy p
        WHERE p.polrelid = c.oid AND p.polpermissive AND p.polcmd IN ('a', '*')
      )
  LOOP
    findings := findings || jsonb_build_object(
      'check', 'no_insert_policy',
      'level', 'warn',
      'entity', 'public.' || r.relname,
      'title', 'No permissive insert policy',
      'detail', format('Table public.%I has no permissive INSERT policy; direct client inserts will fail (writes via the service role still work).', r.relname)
    );
  END LOOP;

  -- 5. anon role holds write grants on a public table (warn)
  FOR r IN
    SELECT DISTINCT g.table_name
    FROM information_schema.role_table_grants g
    WHERE g.table_schema = 'public' AND g.grantee = 'anon'
      AND g.privilege_type IN ('INSERT', 'UPDATE', 'DELETE')
  LOOP
    findings := findings || jsonb_build_object(
      'check', 'anon_write_grant',
      'level', 'warn',
      'entity', 'public.' || r.table_name,
      'title', 'Anonymous write grant',
      'detail', format('Role anon has write privileges on public.%I.', r.table_name)
    );
  END LOOP;

  RETURN jsonb_build_object('findings', findings);
END;
$$;

REVOKE ALL ON FUNCTION public.security_lint() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.security_lint() TO service_role;