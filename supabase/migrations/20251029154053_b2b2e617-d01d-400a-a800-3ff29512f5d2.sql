-- Fix recursive RLS vulnerability by creating a SECURITY DEFINER function
-- This function checks admin status without triggering recursive RLS checks

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND role = 'admin'
  )
$$;

-- Drop all existing admin-checking policies
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;

DROP POLICY IF EXISTS "Admins can delete project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can update project images" ON public.project_images;

DROP POLICY IF EXISTS "Admins can delete media" ON public.media_files;
DROP POLICY IF EXISTS "Admins can insert media" ON public.media_files;
DROP POLICY IF EXISTS "Admins can update media" ON public.media_files;
DROP POLICY IF EXISTS "Admins can view all media" ON public.media_files;

DROP POLICY IF EXISTS "Admins can delete quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can update quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can view all quote requests" ON public.quote_requests;

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Recreate all policies using the SECURITY DEFINER function

-- Projects policies
CREATE POLICY "Admins can delete projects" 
ON public.projects 
FOR DELETE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update projects" 
ON public.projects 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Project images policies
CREATE POLICY "Admins can delete project images" 
ON public.project_images 
FOR DELETE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert project images" 
ON public.project_images 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update project images" 
ON public.project_images 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Media files policies
CREATE POLICY "Admins can delete media" 
ON public.media_files 
FOR DELETE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert media" 
ON public.media_files 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update media" 
ON public.media_files 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all media" 
ON public.media_files 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Quote requests policies
CREATE POLICY "Admins can delete quote requests" 
ON public.quote_requests 
FOR DELETE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update quote requests" 
ON public.quote_requests 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all quote requests" 
ON public.quote_requests 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- User roles policies
CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Create secure bootstrap function for first admin
-- This automatically makes the first user an admin
CREATE OR REPLACE FUNCTION public.handle_first_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create admin role if no roles exist yet (bootstrap scenario)
  IF NOT EXISTS (SELECT 1 FROM public.user_roles LIMIT 1) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-assign first user as admin
DROP TRIGGER IF EXISTS on_first_user_created ON auth.users;
CREATE TRIGGER on_first_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_first_user();