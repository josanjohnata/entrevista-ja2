# Checklist de Produção - Stripe Payment

## ✅ Configurações do Código (Já Implementadas)

- [x] API Version: `2025-12-15.clover`
- [x] Mode: `subscription` (correto para assinaturas mensais)
- [x] Webhook middleware: `express.raw()` configurado
- [x] Error codes padronizados
- [x] i18n completo (productName e productDescription)
- [x] URLs de sucesso/cancelamento configurados

## ⚠️ Verificações Necessárias ANTES de Produção

### 1. Variáveis de Ambiente no Backend (Produção)

Certifique-se de que as seguintes variáveis estão configuradas no ambiente de produção:

```bash
STRIPE_SECRET_KEY=sk_live_...  # Chave SECRETA de PRODUÇÃO (não test key!)
STRIPE_WEBHOOK_SECRET=whsec_...  # Secret do webhook de PRODUÇÃO
NODE_ENV=production
PORT=3000  # ou a porta configurada no seu servidor
```

⚠️ **IMPORTANTE**: 
- Use `sk_live_...` (não `sk_test_...`)
- Use o webhook secret de PRODUÇÃO do dashboard do Stripe
- NÃO use o secret do Stripe CLI (`stripe listen`)

### 2. Configuração do Webhook no Dashboard do Stripe

No [Stripe Dashboard](https://dashboard.stripe.com/webhooks):

1. Criar um novo webhook endpoint de PRODUÇÃO
2. URL do endpoint: `https://seu-dominio.com/webhook/stripe`
3. Versão da API: `2025-12-15.clover`
4. Eventos a marcar:
   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
   - ✅ `customer.subscription.deleted`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. Copiar o **Signing secret** (começa com `whsec_...`)
6. Adicionar ao `.env` de produção como `STRIPE_WEBHOOK_SECRET`

### 3. Variáveis de Ambiente no Frontend (Produção)

Certifique-se de que está configurado:

```bash
VITE_BACKEND_URL=https://seu-backend.com  # URL do backend em produção
VITE_STRIPE_PUBLIC_KEY=pk_live_...  # Chave PÚBLICA de PRODUÇÃO
```

⚠️ **IMPORTANTE**: 
- Use `pk_live_...` (não `pk_test_...`)
- Configure a URL correta do backend

### 4. URLs de Redirecionamento

Verificar se os URLs estão corretos no código:

```typescript
// backend/src/index.ts linha 138-139
success_url: `${req.headers.origin || 'https://www.entrevistaja.com.br'}/home?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${req.headers.origin || 'https://www.entrevistaja.com.br'}/checkout?canceled=true`,
```

✅ Está usando `req.headers.origin` com fallback, o que é correto!

### 5. Teste em Modo Teste Primeiro

Antes de ir para produção:

1. Testar com `sk_test_...` e `pk_test_...`
2. Verificar se o webhook está recebendo eventos
3. Testar um pagamento completo
4. Verificar se a assinatura é ativada no Firestore

### 6. Monitoramento

Após deploy em produção:

1. Monitorar logs do webhook
2. Verificar se eventos estão sendo recebidos
3. Testar um pagamento real (pequeno valor)
4. Verificar se a assinatura é ativada corretamente

## 🔍 Como Verificar se Está Funcionando

### Endpoint de Health Check

```bash
GET https://seu-backend.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "stripe": "configured"
}
```

### Testar Webhook Localmente (Antes de Produção)

```bash
stripe listen --forward-to https://seu-backend.com/webhook/stripe
```

⚠️ **Lembre-se**: O secret retornado pelo CLI é diferente do secret de produção!

## 📝 Resumo

O código está **pronto para produção**, mas você precisa:

1. ✅ Configurar variáveis de ambiente de PRODUÇÃO
2. ✅ Criar webhook de PRODUÇÃO no Stripe Dashboard
3. ✅ Configurar `VITE_BACKEND_URL` no frontend
4. ✅ Testar em modo teste primeiro
5. ✅ Fazer um teste real em produção com valor pequeno

