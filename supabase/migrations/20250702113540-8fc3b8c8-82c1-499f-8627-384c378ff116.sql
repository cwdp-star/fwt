
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  duration TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  delivery_date TEXT NOT NULL,
  completion_deadline TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_images table
CREATE TABLE public.project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  caption TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_progress table
CREATE TABLE public.project_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  phase TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'pending')),
  description TEXT NOT NULL,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin management
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
      AND role = 'admin'
  );
$$;

-- RLS Policies for projects (publicly readable, admin writable)
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Only admins can insert projects" ON public.projects FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can update projects" ON public.projects FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can delete projects" ON public.projects FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for project_images (publicly readable, admin writable)
CREATE POLICY "Project images are viewable by everyone" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Only admins can insert project images" ON public.project_images FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can update project images" ON public.project_images FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can delete project images" ON public.project_images FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for project_progress (publicly readable, admin writable)
CREATE POLICY "Project progress is viewable by everyone" ON public.project_progress FOR SELECT USING (true);
CREATE POLICY "Only admins can insert project progress" ON public.project_progress FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can update project progress" ON public.project_progress FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can delete project progress" ON public.project_progress FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for user_roles (only admins can manage)
CREATE POLICY "Only admins can view user roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can insert user roles" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can update user roles" ON public.user_roles FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can delete user roles" ON public.user_roles FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create trigger function for auto-creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample projects data
INSERT INTO public.projects (title, category, city, duration, start_date, end_date, delivery_date, completion_deadline, description, cover_image) VALUES
('Edifício Residencial Torres da Rinchoa', 'Residencial', 'Rinchoa, Sintra', '8 meses', 'Janeiro 2024', 'Agosto 2024', '15 de Agosto de 2024', '31 de Julho de 2024', 'Execução completa de armação de ferro e cofragem para edifício residencial de 4 pisos com 24 apartamentos. Projeto incluiu fundações, pilares, vigas e lajes com especificações técnicas rigorosas.', 'https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Armazém Industrial Cascais', 'Industrial', 'Cascais', '6 meses', 'Setembro 2023', 'Março 2024', '20 de Março de 2024', '15 de Março de 2024', 'Construção de estrutura para armazém industrial de grande porte com 2000m² de área coberta. Estrutura em betão armado com vãos livres de 15 metros para facilitar a movimentação de equipamentos industriais.', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

-- Insert sample project images
INSERT INTO public.project_images (project_id, url, caption, date) 
SELECT p.id, 'https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Fundações concluídas - Vista geral', '15 de Fevereiro de 2024'
FROM public.projects p WHERE p.title = 'Edifício Residencial Torres da Rinchoa';

INSERT INTO public.project_images (project_id, url, caption, date) 
SELECT p.id, 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Armação de pilares - 1º piso', '20 de Março de 2024'
FROM public.projects p WHERE p.title = 'Edifício Residencial Torres da Rinchoa';

-- Insert sample project progress
INSERT INTO public.project_progress (project_id, phase, status, description, date)
SELECT p.id, 'Fundações', 'completed', 'Escavação e execução de fundações em betão armado com sapatas isoladas', 'Concluído em 28 de Fevereiro de 2024'
FROM public.projects p WHERE p.title = 'Edifício Residencial Torres da Rinchoa';

INSERT INTO public.project_progress (project_id, phase, status, description, date)
SELECT p.id, 'Estrutura Principal', 'completed', 'Armação de ferro e cofragem de pilares e vigas de todos os pisos', 'Concluído em 30 de Maio de 2024'
FROM public.projects p WHERE p.title = 'Edifício Residencial Torres da Rinchoa';

-- Create admin user (you'll need to sign up with this email first)
-- This will be handled after user signup
