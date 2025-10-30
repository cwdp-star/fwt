-- Create site_settings table for dynamic configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  category text NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can insert settings
CREATE POLICY "Admins can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Only admins can update settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admins can delete settings
CREATE POLICY "Admins can delete site settings"
ON public.site_settings
FOR DELETE
USING (is_admin(auth.uid()));

-- Insert default settings
INSERT INTO public.site_settings (key, value, category, label, description) VALUES
('company_name', 'FTW Construções', 'company', 'Nome da Empresa', 'Nome oficial da empresa'),
('company_phone', '+351 965 123 456', 'contact', 'Telefone', 'Número de telefone principal'),
('company_email', 'geral@ftwconstrucoes.pt', 'contact', 'Email', 'Email de contacto principal'),
('company_address_street', 'Rua Senhor Dos Aflitos 809', 'contact', 'Rua', 'Nome da rua e número'),
('company_address_postal', '4415-887', 'contact', 'Código Postal', 'Código postal'),
('company_address_city', 'Sandim', 'contact', 'Cidade', 'Nome da cidade'),
('company_address_region', 'Vila Nova de Gaia', 'contact', 'Região/Distrito', 'Região ou distrito'),
('company_facebook', '', 'social', 'Facebook', 'URL do Facebook (opcional)'),
('company_instagram', '', 'social', 'Instagram', 'URL do Instagram (opcional)'),
('company_linkedin', '', 'social', 'LinkedIn', 'URL do LinkedIn (opcional)')
ON CONFLICT (key) DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_site_settings_updated_at();