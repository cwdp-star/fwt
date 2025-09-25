-- Create a real admin user that can be used for testing
-- Note: This creates a user entry, but you'll still need to sign up through the UI with this email
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if admin user already exists
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@rcconstrucoes.pt';
    
    IF admin_user_id IS NULL THEN
        -- Create a placeholder entry that will be updated when user signs up
        INSERT INTO public.user_roles (user_id, role) 
        SELECT auth.uid(), 'admin'
        WHERE auth.uid() IS NOT NULL
        ON CONFLICT (user_id, role) DO NOTHING;
    ELSE
        -- User exists, ensure they have admin role
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;