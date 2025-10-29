
-- Migration: 20251019075544
-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  city TEXT,
  category TEXT,
  cover_image TEXT,
  start_date DATE,
  end_date DATE,
  delivery_date DATE,
  completion_deadline DATE,
  duration TEXT,
  client_name TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create project_images table
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create media_files table
CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  tags TEXT[],
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quote_requests table
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table for admin management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Public read access for projects (anyone can view)
CREATE POLICY "Anyone can view active projects"
  ON public.projects
  FOR SELECT
  USING (status = 'active');

-- Public read access for project_images
CREATE POLICY "Anyone can view project images"
  ON public.project_images
  FOR SELECT
  USING (true);

-- Admin policies for projects
CREATE POLICY "Admins can insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update projects"
  ON public.projects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete projects"
  ON public.projects
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin policies for project_images
CREATE POLICY "Admins can insert project images"
  ON public.project_images
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update project images"
  ON public.project_images
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete project images"
  ON public.project_images
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin policies for media_files
CREATE POLICY "Admins can view all media"
  ON public.media_files
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert media"
  ON public.media_files
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update media"
  ON public.media_files
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete media"
  ON public.media_files
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Public can create quote requests
CREATE POLICY "Anyone can create quote requests"
  ON public.quote_requests
  FOR INSERT
  WITH CHECK (true);

-- Admin policies for quote_requests
CREATE POLICY "Admins can view all quote requests"
  ON public.quote_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update quote requests"
  ON public.quote_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete quote requests"
  ON public.quote_requests
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- User roles policies
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample data
INSERT INTO public.projects (id, title, description, category, city, cover_image, start_date, status, duration, delivery_date, completion_deadline) VALUES
('11111111-1111-1111-1111-111111111111', 'Edifício Residencial dos Olivais', 'Construção de edifício residencial de 4 pisos com estrutura em betão armado. Projeto inclui fundações profundas, pilares, vigas e lajes em betão armado.', 'Construção Residencial', 'Lisboa', '/placeholder-construction-1.jpg', '2023-03-01', 'active', '18 meses', '2024-09-01', '2024-09-15'),
('22222222-2222-2222-2222-222222222222', 'Centro Comercial da Baixa', 'Reabilitação e ampliação de centro comercial histórico com reforço estrutural em betão armado e novas estruturas metálicas.', 'Construção Comercial', 'Porto', '/placeholder-renovation-1.jpg', '2022-06-01', 'active', '24 meses', '2024-06-01', '2024-06-30'),
('33333333-3333-3333-3333-333333333333', 'Moradia de Luxo em Cascais', 'Construção de moradia unifamiliar de alto padrão com piscina, garagem subterrânea e estruturas especiais em betão aparente.', 'Construção Residencial', 'Cascais', '/placeholder-exterior-1.jpg', '2023-09-01', 'active', '12 meses', '2024-09-01', '2024-09-15');

INSERT INTO public.project_images (id, project_id, url, caption, date) VALUES
('1aeec43f-dcb6-475e-ac9c-42231c2b1186', '11111111-1111-1111-1111-111111111111', '/placeholder-construction-1.jpg', 'Vista geral da obra', '2023-06-01'),
('a1f4aa66-f14d-49dc-b756-631347c730c2', '11111111-1111-1111-1111-111111111111', '/placeholder-renovation-1.jpg', 'Progresso da construção', '2023-08-01'),
('26242044-ee4c-47cf-ab40-2935de0a19da', '22222222-2222-2222-2222-222222222222', '/placeholder-renovation-1.jpg', 'Progresso da renovação', '2023-08-01'),
('c5e0aa9c-6e1d-4f8e-a136-1a45f3c5f809', '22222222-2222-2222-2222-222222222222', '/placeholder-construction-1.jpg', 'Estrutura renovada', '2023-10-01'),
('7be02418-eba7-4b0a-8910-a88d2ccccb6f', '33333333-3333-3333-3333-333333333333', '/placeholder-exterior-1.jpg', 'Fachada exterior', '2024-01-01'),
('dbc97612-7df3-4b2c-ab9e-fee7ba0fb0ff', '33333333-3333-3333-3333-333333333333', '/placeholder-construction-1.jpg', 'Interior da moradia', '2024-02-01');
