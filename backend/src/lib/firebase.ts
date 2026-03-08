import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      // Se a chave privada estiver no JSON, trata ela também
      if (serviceAccount.private_key) {
        let privateKey = serviceAccount.private_key;
        privateKey = privateKey.trim();
        privateKey = privateKey.replace(/\\n/g, '\n');
        privateKey = privateKey.replace(/\\\\n/g, '\n');
        serviceAccount.private_key = privateKey;
      }
      
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do FIREBASE_SERVICE_ACCOUNT:', parseError);
      throw new Error('FIREBASE_SERVICE_ACCOUNT contém JSON inválido');
    }
  }

  if (process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      process.env.FIREBASE_PRIVATE_KEY) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Remove espaços extras e trata quebras de linha
    privateKey = privateKey.trim();
    
    // Substitui diferentes formatos de quebra de linha
    privateKey = privateKey.replace(/\\n/g, '\n');
    privateKey = privateKey.replace(/\\\\n/g, '\n');
    
    // Garante que a chave começa e termina corretamente
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      console.error('❌ FIREBASE_PRIVATE_KEY não contém o cabeçalho correto');
      throw new Error('FIREBASE_PRIVATE_KEY inválida: falta cabeçalho BEGIN PRIVATE KEY');
    }
    
    if (!privateKey.includes('-----END PRIVATE KEY-----')) {
      console.error('❌ FIREBASE_PRIVATE_KEY não contém o rodapé correto');
      throw new Error('FIREBASE_PRIVATE_KEY inválida: falta rodapé END PRIVATE KEY');
    }
    
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }

  console.warn('⚠️ Firebase Admin: Nenhuma credencial encontrada!');
  console.warn('Configure uma das seguintes opções:');
  console.warn('  1. GOOGLE_APPLICATION_CREDENTIALS');
  console.warn('  2. FIREBASE_SERVICE_ACCOUNT');
  console.warn('  3. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY');
  
  try {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Firebase Admin SDK não pôde ser inicializado. Configure as credenciais. Erro: ${errorMessage}`);
  }
};

let db: admin.firestore.Firestore | null = null;
let auth: admin.auth.Auth | null = null;

try {
  app = initializeFirebaseAdmin();
  db = admin.firestore();
  auth = admin.auth();
  console.log('Firebase Admin inicializado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar Firebase Admin:', error);
  console.error('O servidor continuará rodando, mas funcionalidades do Firebase não estarão disponíveis');
}

export { db, auth };
export default app;
