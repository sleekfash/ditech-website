
-- 1. Fix contact_submissions: restrict admin SELECT to authenticated role only
DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;
CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
  ));

-- 2. Fix profiles: add explicit deny-all INSERT policy to prevent privilege escalation
-- (inserts happen via handle_new_user trigger with SECURITY DEFINER)
CREATE POLICY "Deny direct profile inserts"
  ON profiles FOR INSERT TO public
  WITH CHECK (false);

-- 3. Fix chat_conversations: add permissive baseline deny policy alongside restrictive
CREATE POLICY "Deny all chat access baseline"
  ON chat_conversations AS PERMISSIVE FOR ALL TO public
  USING (false) WITH CHECK (false);
