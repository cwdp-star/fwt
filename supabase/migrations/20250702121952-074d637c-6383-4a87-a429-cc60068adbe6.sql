
-- Inserir o papel de admin para o usuário criado
-- Substitua o user_id pelo ID real do usuário admin criado
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'admin@motivovisionario.com'
ON CONFLICT (user_id, role) DO NOTHING;
