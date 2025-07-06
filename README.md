
# Motivo Visionário - Ferro e Cofragem

Site oficial da empresa Motivo Visionário, especializada em ferro e cofragem.

## 🚀 Deploy no Vercel

### Configurações Necessárias

1. **Site URL no Supabase**: Configure no painel do Supabase em Authentication > URL Configuration:
   - Site URL: `https://seu-dominio.vercel.app`
   - Redirect URLs: `https://seu-dominio.vercel.app/**`

2. **Variáveis de Ambiente no Vercel**: Não são necessárias, as URLs do Supabase estão hardcoded no código.

### Funcionalidades

- ✅ Página inicial com informações da empresa
- ✅ Galeria de projetos
- ✅ Formulário de contacto
- ✅ Painel administrativo protegido
- ✅ Autenticação com Supabase
- ✅ Gestão de projetos e imagens

### Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- React Router DOM

### Desenvolvimento Local

```bash
npm install
npm run dev
```

### Build para Produção

```bash
npm run build
```

### Estrutura do Projeto

```
src/
├── components/        # Componentes React
├── pages/            # Páginas da aplicação
├── integrations/     # Configurações do Supabase
└── lib/              # Utilitários
```

### Autenticação

O sistema utiliza Row Level Security (RLS) do Supabase com roles de usuário:
- **admin**: Acesso completo ao painel administrativo
- **user**: Acesso básico

### Suporte

Para suporte técnico, contacte através do formulário no site.
