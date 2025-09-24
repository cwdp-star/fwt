-- Create quote_requests table for contact form submissions
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  project_type TEXT,
  budget TEXT,
  timeline TEXT,
  city TEXT,
  description TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

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

-- Public policy for inserting quote requests (contact form)
CREATE POLICY "Anyone can create quote requests" 
ON public.quote_requests 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for quote_requests
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add missing columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS delivery_date DATE,
ADD COLUMN IF NOT EXISTS completion_deadline DATE;

-- Add admin policies for projects table
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

-- Add admin policies for project_images table
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

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true);

-- Storage policies for project images
CREATE POLICY "Public can view project images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update project images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete project images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'project-images' AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert sample projects data
INSERT INTO public.projects (title, description, category, city, cover_image, start_date, end_date, delivery_date, completion_deadline, duration, status) VALUES
('Residência Moderna Santos', 'Casa moderna de 3 quartos com acabamento premium, área gourmet e piscina. Projeto completo de arquitetura e decoração.', 'Residencial', 'Santos', '/placeholder-exterior-1.jpg', '2024-01-15', '2024-06-30', '2024-07-15', '2024-07-30', '5 meses', 'active'),
('Renovação Apartamento Vila Madalena', 'Reforma completa de apartamento de 120m² incluindo cozinha, banheiros e área social. Conceito aberto e moderno.', 'Renovação', 'São Paulo', '/placeholder-renovation-1.jpg', '2024-02-01', '2024-04-15', '2024-05-01', '2024-05-15', '3 meses', 'active'),
('Edifício Comercial Campinas', 'Construção de edifício comercial de 8 andares com lajes corporativas, estacionamento subterrâneo e área comum.', 'Comercial', 'Campinas', '/placeholder-construction-1.jpg', '2023-08-01', '2024-12-31', '2025-01-15', '2025-01-31', '17 meses', 'active');

-- Insert sample project images
INSERT INTO public.project_images (project_id, url, caption, date) 
SELECT 
  p.id,
  '/placeholder-exterior-1.jpg',
  'Fachada principal da residência',
  '2024-03-15'
FROM public.projects p WHERE p.title = 'Residência Moderna Santos'
UNION ALL
SELECT 
  p.id,
  '/placeholder-renovation-1.jpg',
  'Área social renovada',
  '2024-03-01'
FROM public.projects p WHERE p.title = 'Renovação Apartamento Vila Madalena'
UNION ALL
SELECT 
  p.id,
  '/placeholder-construction-1.jpg',
  'Estrutura em construção',
  '2024-06-01'
FROM public.projects p WHERE p.title = 'Edifício Comercial Campinas';

-- Insert sample quote requests
INSERT INTO public.quote_requests (name, email, phone, service, project_type, budget, timeline, city, description, status) VALUES
('Maria Silva', 'maria@email.com', '(11) 98765-4321', 'Construção', 'Casa', 'R$ 300.000 - R$ 500.000', '6-12 meses', 'São Paulo', 'Gostaria de construir uma casa de 150m² com 3 quartos e área gourmet', 'new'),
('João Santos', 'joao@email.com', '(11) 87654-3210', 'Renovação', 'Apartamento', 'R$ 50.000 - R$ 100.000', '2-4 meses', 'Santos', 'Reforma completa de apartamento antigo, incluindo cozinha e banheiros', 'in_progress'),
('Ana Costa', 'ana@email.com', '(11) 76543-2109', 'Projeto', 'Comercial', 'Acima de R$ 1.000.000', 'Mais de 12 meses', 'Campinas', 'Projeto arquitetônico para edifício comercial de 6 andares', 'completed');