-- Create sample projects with proper image URLs
INSERT INTO public.projects (
  id,
  title,
  description,
  category,
  city,
  duration,
  start_date,
  delivery_date,
  completion_deadline,
  cover_image,
  status
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Edifício Residencial dos Olivais',
  'Construção de edifício residencial de 4 pisos com estrutura em betão armado. Projeto inclui fundações profundas, pilares, vigas e lajes em betão armado.',
  'Construção Residencial',
  'Lisboa',
  '18 meses',
  '2023-03-01',
  '2024-09-01',
  '2024-09-15',
  '/placeholder-construction-1.jpg',
  'active'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Centro Comercial da Baixa',
  'Reabilitação e ampliação de centro comercial histórico com reforço estrutural em betão armado e novas estruturas metálicas.',
  'Construção Comercial',
  'Porto',
  '24 meses',
  '2022-06-01',
  '2024-06-01',
  '2024-06-30',
  '/placeholder-renovation-1.jpg',
  'active'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Moradia de Luxo em Cascais',
  'Construção de moradia unifamiliar de alto padrão com piscina, garagem subterrânea e estruturas especiais em betão aparente.',
  'Construção Residencial',
  'Cascais',
  '12 meses',
  '2023-09-01',
  '2024-09-01',
  '2024-09-15',
  '/placeholder-exterior-1.jpg',
  'active'
)
ON CONFLICT (id) DO NOTHING;

-- Add sample images for the projects
INSERT INTO public.project_images (project_id, url, caption, date) VALUES
('11111111-1111-1111-1111-111111111111', '/placeholder-construction-1.jpg', 'Vista geral da obra', '2023-06-01'),
('11111111-1111-1111-1111-111111111111', '/placeholder-renovation-1.jpg', 'Progresso da construção', '2023-08-01'),
('22222222-2222-2222-2222-222222222222', '/placeholder-renovation-1.jpg', 'Progresso da renovação', '2023-08-01'),
('22222222-2222-2222-2222-222222222222', '/placeholder-construction-1.jpg', 'Estrutura renovada', '2023-10-01'),
('33333333-3333-3333-3333-333333333333', '/placeholder-exterior-1.jpg', 'Fachada exterior', '2024-01-01'),
('33333333-3333-3333-3333-333333333333', '/placeholder-construction-1.jpg', 'Interior da moradia', '2024-02-01')
ON CONFLICT (id) DO NOTHING;