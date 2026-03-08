# Sistema de Autenticação Firebase com Roles

Este projeto implementa um sistema de autenticação completo usando Firebase Authentication e Firestore, com 4 níveis de permissão.

## 🚀 Configuração do Firebase

### 1. Instalar Dependências

```bash
npm install firebase
```

### 2. Configurar Firebase Project

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative **Authentication** → **Sign-in method** → **Email/Password**
4. Ative **Authentication** → **Sign-in method** → **Google**
   - Configure o nome do projeto e email de suporte
   - Adicione os domínios autorizados (localhost para desenvolvimento)
5. Ative **Firestore Database** → **Create database**

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `front/` com as seguintes variáveis:

```env
VITE_FIREBASE_API_KEY=sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_STORAGE_BUCKET=seu-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

> **Onde encontrar essas informações:**
> 1. No Firebase Console, vá em **Project Settings** (ícone de engrenagem)
> 2. Na aba **General**, role até **Your apps**
> 3. Clique em **Config** para ver as configurações

## 🎯 Sistema de Roles

### Níveis de Permissão (Hierárquico)

1. **`recruiter`** - Recrutadores/Parceiros (Nível 4)
   - Acesso completo a todas as funcionalidades
   - Pode gerenciar vagas e candidatos

2. **`annual_plan`** - Plano Anual (Nível 3)
   - Acesso premium por 1 ano
   - Funcionalidades avançadas de busca

3. **`monthly_plan`** - Plano Mensal (Nível 2)
   - Acesso premium por 1 mês
   - Funcionalidades limitadas

4. **`basic_plan`** - Plano Básico (Nível 1)
   - Acesso básico às vagas
   - Funcionalidades essenciais

### Estrutura dos Dados no Firestore

```javascript
// Coleção: users/{userId}
{
  uid: "user-id",
  email: "usuario@email.com",
  displayName: "Nome do Usuário",
  role: "basic_plan", // recruiter | annual_plan | monthly_plan | basic_plan
  planExpirationDate: Timestamp, // Apenas para planos com tempo
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 📱 Como Usar

### 1. Autenticação

```typescript
import { useAuth } from './contexts/AuthContext';

function LoginComponent() {
  const { login, loginWithGoogle, logout, isAuthenticated, userData } = useAuth();
  
  // Login com email/senha
  await login(email, password);
  
  // Login com Google
  await loginWithGoogle();
  
  // Logout
  await logout();
  
  // Verificar se está logado
  if (isAuthenticated) {
    console.log('Usuário logado:', userData);
  }
}
```

### 2. Proteção de Rotas

```typescript
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { UserRole } from './contexts/AuthContext';

// Rota que requer autenticação
<ProtectedRoute>
  <ComponenteProtegido />
</ProtectedRoute>

// Rota que requer role específico
<ProtectedRoute requiredRole={UserRole.MONTHLY_PLAN}>
  <ComponentePremium />
</ProtectedRoute>
```

### 3. Verificação de Permissões

```typescript
import { useAuth, UserRole } from './contexts/AuthContext';

function Component() {
  const { hasPermission } = useAuth();
  
  // Verificar se tem permissão para plano mensal
  if (hasPermission(UserRole.MONTHLY_PLAN)) {
    // Mostrar funcionalidade premium
  }
}
```

### 4. Gerenciar Roles (Admin)

```typescript
import { useAuth, UserRole } from './contexts/AuthContext';

function AdminPanel() {
  const { updateUserRole } = useAuth();
  
  // Atualizar para plano anual
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  
  await updateUserRole(UserRole.ANNUAL_PLAN, expirationDate);
}
```

## 🛠️ Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email/senha
- [x] Login com Google (OAuth)
- [x] Registro de usuários
- [x] Logout
- [x] Estado de autenticação persistente
- [x] Tratamento de erros

### ✅ Sistema de Roles
- [x] 4 níveis de permissão
- [x] Hierarquia de acesso
- [x] Verificação de expiração de planos
- [x] Atualização de roles

### ✅ Proteção de Rotas
- [x] Rotas protegidas por autenticação
- [x] Rotas protegidas por role
- [x] Redirecionamento automático
- [x] Mensagens de erro personalizadas

### ✅ Interface de Usuário
- [x] Formulário de login responsivo
- [x] Header com informações do usuário
- [x] Painel administrativo
- [x] Estados de loading
- [x] Mensagens de erro

## 🔗 Rotas Disponíveis

- `/` - Landing page (público)
- `/login` - Página de login (público)
- `/planos` - Planos disponíveis (público)
- `/contato` - Página de contato (público)
- `/home` - Vagas (requer: basic_plan ou superior)
- `/admin` - Painel administrativo (requer: autenticação)

## 🔧 Configuração do Google OAuth

### Passo a Passo no Firebase Console

1. **Ativar Google Sign-In:**
   - No Firebase Console, vá em **Authentication** → **Sign-in method**
   - Clique em **Google** e ative o provedor
   - Configure o **nome do projeto** e **email de suporte**

2. **Configurar Domínios Autorizados:**
   - Adicione `localhost` para desenvolvimento
   - Adicione seu domínio de produção quando for fazer deploy

3. **Obter Client ID (Opcional):**
   - Se precisar de configurações avançadas, obtenha o Client ID do Google Cloud Console

## 🧪 Testando o Sistema

### 1. Criar Usuário de Teste

1. Acesse `/login`
2. **Opção 1:** Use login com Google (mais fácil)
3. **Opção 2:** Use o formulário de email/senha
4. **Opção 3:** Crie via Firebase Console
5. Vá para `/admin` para alterar o role do usuário

### 2. Testar Permissões

1. Faça login com diferentes roles
2. Tente acessar `/home` com diferentes permissões
3. Observe as mensagens de acesso negado

### 3. Testar Expiração

1. Configure um plano com data de expiração próxima
2. Aguarde a expiração
3. Verifique se o acesso é negado

## 🚨 Segurança

### Firebase Security Rules (Firestore)

```javascript
// Adicione estas regras no Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Perfis - usuários podem ler/escrever apenas seus próprios perfis
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Apenas admins podem ler todos os usuários
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'recruiter';
    }
  }
}
```

## 🎯 Próximos Passos

- [ ] Implementar recuperação de senha
- [x] ~~Adicionar autenticação social (Google)~~ ✅ **Implementado**
- [ ] Adicionar mais provedores sociais (Facebook, GitHub)
- [ ] Implementar sistema de pagamentos
- [ ] Criar dashboard para recrutadores
- [ ] Adicionar notificações em tempo real
- [ ] Implementar sistema de auditoria

---

**Desenvolvido para Entrevistaja.com.br** 🚀 