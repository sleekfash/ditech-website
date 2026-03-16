
-- Deny all client access to rate_limits (only service role via edge functions)
CREATE POLICY "Deny all access to rate_limits"
ON public.rate_limits
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Deny all client INSERT on contact_submissions (only service role via edge functions)
CREATE POLICY "Deny all insert to contact_submissions"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (false);
