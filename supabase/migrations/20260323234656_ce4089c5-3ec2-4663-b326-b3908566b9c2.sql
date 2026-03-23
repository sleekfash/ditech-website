
DROP POLICY IF EXISTS "Deny all chat access until session tracking implemented" ON chat_conversations;
CREATE POLICY "Deny all chat access until session tracking implemented"
ON chat_conversations
AS RESTRICTIVE
FOR ALL
USING (false)
WITH CHECK (false);
