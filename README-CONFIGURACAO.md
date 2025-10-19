# RC Construções - Website Completo

## 📋 Resumo do Projeto

Website profissional para empresa de construção civil com sistema completo de gestão administrativa, conformidade RGPD e animações modernas.

## ✅ Funcionalidades Implementadas

### 🎨 Frontend
- ✅ Design responsivo e moderno
- ✅ Animações suaves com lazy loading
- ✅ Grid de projetos 3x2 (6 projetos em destaque)
- ✅ Galeria de projetos com detalhes
- ✅ Formulário de contacto com validação
- ✅ Botões flutuantes (WhatsApp + Voltar ao topo)
- ✅ SEO otimizado

### 🔒 RGPD & Legal
- ✅ Banner de cookies conforme RGPD
- ✅ Política de Privacidade completa (modal)
- ✅ Termos e Condições (modal)
- ✅ Política de Cookies (modal)
- ✅ Consentimento obrigatório no formulário
- ✅ Validação e sanitização de inputs
- ✅ Rate limiting (3 pedidos/10min)

### 🔐 Painel Admin
- ✅ Autenticação segura
- ✅ Role-based access control
- ✅ Gestão de orçamentos
- ✅ Gestão de projetos
- ✅ Upload de mídia
- ✅ Analytics
- ✅ Notificações

### 💾 Base de Dados
- ✅ Supabase configurado
- ✅ RLS policies implementadas
- ✅ Tabelas: projects, project_images, quote_requests, user_roles, media_files
- ✅ Auto-confirmação de emails

## 🚀 Configuração Inicial

### 1. Criar Primeiro Administrador

Acesse: **`/admin-setup`**

Crie a primeira conta de administrador:
- Email: admin@rcconstrucoes.pt
- Senha: (mínimo 8 caracteres)

### 2. Configurar WhatsApp

Edite o arquivo: `src/components/FloatingButtons.tsx`

Linha 26, altere o número:
```typescript
const phoneNumber = '351965123456'; // ALTERE AQUI
```

Formato: 351 + número sem espaços (ex: 351912345678)

### 3. Dados da Empresa

Atualize os seguintes arquivos com os dados reais:

**Footer** (`src/components/Footer.tsx`):
- Telefone
- Email
- Morada

**Política de Privacidade** (`src/components/legal/PrivacyPolicyModal.tsx`):
- NIF da empresa
- Morada completa
- Email de privacidade
- Telefone de contacto

## 📱 Estrutura de Páginas

### Públicas
- `/` - Página inicial
- `/projects/:id` - Detalhes do projeto

### Admin (Protegidas)
- `/admin-setup` - Configuração inicial (apenas primeira vez)
- `/auth` - Login
- `/admin` - Painel de controlo
- `/admin/security` - Auditoria de segurança
- `/admin/database-health` - Saúde da base de dados

## 🎯 Funcionalidades por Seção

### Página Inicial

1. **Hero**
   - Logo animado
   - Título com gradiente
   - 2 CTAs (Solicitar Orçamento + Ver Galeria)

2. **Sobre Nós**
   - Missão da empresa
   - 3 cards de valores (Qualidade, Experiência, Compromisso)

3. **Serviços**
   - 4 serviços principais
   - Características de cada serviço

4. **Galeria/Experiência**
   - Cards de estatísticas
   - CTA para orçamento

5. **Projetos**
   - Grid 3x2 (6 projetos)
   - Click para ver detalhes

6. **Contacto**
   - Formulário completo
   - Validação RGPD obrigatória
   - Campos: nome, email, telefone, tipo, localização, orçamento, prazo, descrição

### Painel Admin

**Tabs disponíveis:**
1. Visão Geral - Estatísticas
2. Orçamentos - Lista de pedidos
3. Projetos - Gestão de projetos (CRUD)
4. Mídia - Upload de imagens
5. Analytics - Análise de projetos

## 🔐 Segurança

### Implementado
- ✅ Validação de inputs (email, telefone)
- ✅ Sanitização de dados
- ✅ Rate limiting
- ✅ RLS policies no Supabase
- ✅ Role-based access
- ✅ HTTPS only
- ✅ Sem logs de dados sensíveis

### Boas Práticas
- Senhas mínimo 8 caracteres
- Tokens armazenados de forma segura
- Cookies apenas essenciais
- Consentimento explícito RGPD

## 📊 Base de Dados

### Tabelas Principais

**projects**
- id, title, description, category, city
- start_date, end_date, status
- created_at, updated_at

**project_images**
- id, project_id, url, caption, date

**quote_requests**
- id, name, email, phone, service
- message, status, notes
- created_at, updated_at

**user_roles**
- id, user_id, role

**media_files**
- id, url, filename, category, tags

## 🎨 Design System

### Cores Principais
- Primary: `hsl(177 48% 60%)` - Turquesa
- Secondary: `hsl(180 33% 25%)` - Verde escuro
- Accent: `hsl(177 40% 45%)` - Turquesa escuro

### Animações
- Lazy loading com Intersection Observer
- Fade, scale e slide animations
- Delays escalonados para stagger effect

## 📝 Checklist Pré-Lançamento

### Dados da Empresa
- [ ] Número de WhatsApp configurado
- [ ] Telefone no footer atualizado
- [ ] Email atualizado
- [ ] Morada atualizada
- [ ] NIF na política de privacidade

### Admin
- [ ] Conta de administrador criada
- [ ] Senha forte configurada
- [ ] Acesso ao painel testado

### Conteúdo
- [ ] Projetos de exemplo removidos/substituídos
- [ ] Imagens reais dos projetos adicionadas
- [ ] Textos revisados
- [ ] Links testados

### Legal
- [ ] Política de Privacidade revista
- [ ] Termos e Condições revistos
- [ ] Email de privacidade configurado
- [ ] Dados CNPD verificados

### Testes
- [ ] Formulário de contacto testado
- [ ] WhatsApp funcionando
- [ ] Botão voltar ao topo funcional
- [ ] Animações suaves
- [ ] Responsividade verificada
- [ ] SEO tags configuradas

## 🛠️ Manutenção

### Adicionar Novo Projeto
1. Login no admin: `/auth`
2. Ir para tab "Projetos"
3. Clicar "Adicionar Projeto"
4. Preencher dados + upload de imagens
5. Salvar

### Gerir Orçamentos
1. Login no admin
2. Tab "Orçamentos"
3. Ver lista de pedidos
4. Filtrar por status
5. Adicionar notas internas

### Backup
- Base de dados Supabase tem backup automático
- Exportar dados: usar painel Supabase

## 📞 Suporte

Para dúvidas técnicas sobre este projeto:
- Casa Criativa Mi: https://casacriativami.com

## 🔗 Links Úteis

- Documentação Lovable: https://docs.lovable.dev
- Supabase Docs: https://supabase.com/docs
- CNPD Portugal: https://www.cnpd.pt
- RGPD: https://gdpr.eu

---

**Desenvolvido com ❤️ por Casa Criativa Mi**
