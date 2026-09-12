CREATE OR REPLACE FUNCTION public.prevent_admin_escalation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Clients (anon / authenticated) can never change their own admin flag.
  -- Server-side roles (postgres, service_role) may set it deliberately.
  IF current_user IN ('anon', 'authenticated') THEN
    NEW.is_admin := OLD.is_admin;
  END IF;
  RETURN NEW;
END;
$function$;