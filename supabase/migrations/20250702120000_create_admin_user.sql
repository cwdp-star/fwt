
-- This migration should be run after the admin user signs up with the email admin@motivovisionario.com

-- Insert admin role for the user (this will need to be run after signup)
-- You'll need to replace 'USER_ID_HERE' with the actual user ID after signup
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('USER_ID_HERE', 'admin');

-- For now, we'll create a function to easily set admin role
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from auth.users table
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NOT NULL THEN
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;
