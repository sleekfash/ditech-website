-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on contact_submissions table (if not already enabled)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on rate_limits table (if not already enabled)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Drop the overly permissive contact form INSERT policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

-- Contact submissions can now only be inserted via edge function (service role bypasses RLS)