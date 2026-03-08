# Guia de Deploy no Firebase

## Pré-requisitos

1. **Firebase CLI instalado** (já está instalado)
2. **Autenticado no Firebase**:
   ```bash
   firebase login
   ```

## Passos para Deploy

### 1. Instalar dependências das Cloud Functions

```bash
cd functions
npm install
cd ..
```

### 2. Fazer build das Functions

```bash
cd functions
npm run build
cd ..
```

### 3. Deploy das Cloud Functions

**Deploy apenas das Functions:**
```bash
firebase deploy --only functions
```

**Deploy de tudo (Functions + Firestore Rules + Storage Rules):**
```bash
firebase deploy
```

**Deploy apenas das regras do Firestore:**
```bash
firebase deploy --only firestore:rules
```

### 4. Verificar logs das Functions

```bash
firebase functions:log
```

## Comandos Úteis

- **Listar Functions deployadas:**
  ```bash
  firebase functions:list
  ```

- **Ver detalhes de uma Function específica:**
  ```bash
  firebase functions:config:get
  ```

- **Testar localmente (emulador):**
  ```bash
  cd functions
  npm run serve
  ```

## Estrutura de Deploy

- **Functions**: `functions/src/index.ts` → compilado para `functions/lib/index.js`
- **Firestore Rules**: `firestore.rules`
- **Storage Rules**: `storage.rules`

## Notas Importantes

1. O projeto Firebase configurado é: `minha-vaga-e8ab2`
2. As Functions serão deployadas na região padrão (us-central1)
3. Após o deploy, as Functions estarão disponíveis em:
   - `generateReferralCodeOnCreate` (trigger automático)
   - `processReferralSignup` (chamável)
   - `generateReferralCodeForUser` (chamável)
   - `creditReferralReward` (trigger automático)

