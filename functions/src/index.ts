import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializar Firebase Admin se ainda não estiver inicializado
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Gera um código de indicação único de 8 caracteres
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removido I, O, 0, 1 para evitar confusão
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Verifica se um código de indicação já existe
 */
async function referralCodeExists(code: string): Promise<boolean> {
  const snapshot = await db.collection('users')
    .where('referralCode', '==', code)
    .limit(1)
    .get();
  return !snapshot.empty;
}

/**
 * Gera um código de indicação único
 */
async function generateUniqueReferralCode(): Promise<string> {
  let code = generateReferralCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (await referralCodeExists(code) && attempts < maxAttempts) {
    code = generateReferralCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Não foi possível gerar um código de indicação único');
  }

  return code;
}

/**
 * Cloud Function: Gera código de indicação quando um novo usuário é criado
 * Dispara no onCreate do Firebase Auth
 */
export const generateReferralCodeOnCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const referralCode = await generateUniqueReferralCode();

    // Atualizar o documento do usuário com o código de indicação
    await db.collection('users').doc(user.uid).set({
      referralCode,
      balance: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`✅ Código de indicação ${referralCode} gerado para usuário ${user.uid}`);
    return null;
  } catch (error) {
    console.error(`❌ Erro ao gerar código de indicação para ${user.uid}:`, error);
    throw error;
  }
});

/**
 * Cloud Function: Gera código de indicação para usuários existentes
 * Função chamável (onCall)
 */
export const generateReferralCodeForUser = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário deve estar autenticado'
    );
  }

  const userId = context.auth.uid;

  try {
    // Verificar se o usuário já tem um código
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData?.referralCode) {
        // Usuário já tem código, retornar o código existente
        return {
          success: true,
          referralCode: userData.referralCode,
          message: 'Código já existe',
        };
      }
    }

    // Gerar novo código
    const referralCode = await generateUniqueReferralCode();

    // Atualizar o documento do usuário
    await db.collection('users').doc(userId).set({
      referralCode,
      balance: userDoc.exists ? (userDoc.data()?.balance || 0) : 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`✅ Código de indicação ${referralCode} gerado para usuário ${userId}`);
    
    return {
      success: true,
      referralCode,
      message: 'Código gerado com sucesso',
    };
  } catch (error) {
    console.error(`❌ Erro ao gerar código de indicação para ${userId}:`, error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao gerar código de indicação'
    );
  }
});

/**
 * Cloud Function: Processa o cadastro com código de indicação
 * Função chamável (onCall)
 */
export const processReferralSignup = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário deve estar autenticado'
    );
  }

  const { referralCode } = data;
  const referredUserId = context.auth.uid;

  if (!referralCode || typeof referralCode !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Código de indicação é obrigatório'
    );
  }

  try {
    // Buscar o usuário que possui este código de indicação
    const referrerSnapshot = await db.collection('users')
      .where('referralCode', '==', referralCode)
      .limit(1)
      .get();

    if (referrerSnapshot.empty) {
      throw new functions.https.HttpsError(
        'not-found',
        'Código de indicação inválido'
      );
    }

    const referrerDoc = referrerSnapshot.docs[0];
    const referrerUid = referrerDoc.id;

    // Verificar se o usuário não está tentando indicar a si mesmo
    if (referrerUid === referredUserId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Você não pode indicar a si mesmo'
      );
    }

    // Verificar se o usuário já foi indicado por alguém
    const referredUserDoc = await db.collection('users').doc(referredUserId).get();
    if (referredUserDoc.exists) {
      const userData = referredUserDoc.data();
      if (userData?.referredBy) {
        throw new functions.https.HttpsError(
          'already-exists',
          'Usuário já foi indicado por outro código'
        );
      }
    }

    // Criar documento de indicação
    const referralRef = db.collection('referrals').doc();
    await referralRef.set({
      referrerUid,
      referredUid: referredUserId,
      status: 'pending',
      rewardAmount: 0, // Será atualizado quando o pagamento for processado
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Atualizar o documento do usuário indicado
    await db.collection('users').doc(referredUserId).set({
      referredBy: referralCode,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`✅ Indicação processada: ${referrerUid} indicou ${referredUserId}`);
    
    return {
      success: true,
      message: 'Código de indicação processado com sucesso',
    };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    console.error('❌ Erro ao processar indicação:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao processar indicação'
    );
  }
});

/**
 * Cloud Function: Retorna métricas de indicação do usuário
 * Função chamável (onCall)
 */
export const getReferralMetrics = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário deve estar autenticado'
    );
  }

  const userId = context.auth.uid;

  try {
    // Buscar todas as indicações onde o usuário é o referrer
    const referralsSnapshot = await db.collection('referrals')
      .where('referrerUid', '==', userId)
      .get();

    let totalReferrals = 0;
    let completedReferrals = 0;
    let pendingReferrals = 0;
    let totalRewardAmount = 0;

    referralsSnapshot.forEach((doc) => {
      const referral = doc.data();
      totalReferrals++;
      
      if (referral.status === 'completed') {
        completedReferrals++;
        totalRewardAmount += referral.rewardAmount || 0;
      } else if (referral.status === 'pending') {
        pendingReferrals++;
      }
    });

    // Buscar dados do usuário para obter o saldo atual
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    const currentBalance = userData?.balance || 0;

    return {
      success: true,
      metrics: {
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalRewardAmount,
        currentBalance,
      },
    };
  } catch (error) {
    console.error(`❌ Erro ao buscar métricas de indicação para ${userId}:`, error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao buscar métricas de indicação'
    );
  }
});

/**
 * Cloud Function: Retorna métricas gerais do dashboard de indicações (apenas para admin)
 * Função chamável (onCall)
 */
export const getDashboardMetrics = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário deve estar autenticado'
    );
  }

  // Verificar se é admin
  const ADMIN_EMAILS = ['josanjohnata@gmail.com', 'edhurabelo@gmail.com'];
  const userEmail = context.auth.token.email;
  
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Acesso negado. Apenas administradores podem acessar este dashboard.'
    );
  }

  try {
    // Buscar total de usuários
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Buscar todas as indicações
    const referralsSnapshot = await db.collection('referrals').get();
    
    let totalReferrals = 0;
    let completedReferrals = 0;
    let pendingReferrals = 0;
    let totalRewardAmount = 0;
    const referrerStats: { [key: string]: {
      email: string;
      referralCode: string;
      totalReferrals: number;
      completedReferrals: number;
      totalEarned: number;
    } } = {};

    const referrerUidsSet = new Set<string>();
    referralsSnapshot.forEach((doc) => {
      const referral = doc.data();
      totalReferrals++;
      
      if (referral.status === 'completed') {
        completedReferrals++;
        totalRewardAmount += referral.rewardAmount || 0;
      } else if (referral.status === 'pending') {
        pendingReferrals++;
      }

      if (referral.referrerUid) {
        referrerUidsSet.add(referral.referrerUid);
      }
    });

    const referrerUids = Array.from(referrerUidsSet);
    const referrerDocs = await Promise.all(
      referrerUids.map(uid => db.collection('users').doc(uid).get())
    );

    const referralCodeToUid: { [key: string]: string } = {};
    const uidToReferralCode: { [key: string]: string } = {};
    const uidToEmail: { [key: string]: string } = {};

    referrerDocs.forEach((doc, index) => {
      if (doc.exists) {
        const referrerData = doc.data();
        const referralCode = referrerData?.referralCode || 'N/A';
        const email = referrerData?.email || 'N/A';
        const uid = referrerUids[index];
        
        if (referralCode !== 'N/A') {
          referralCodeToUid[referralCode] = uid;
          uidToReferralCode[uid] = referralCode;
          uidToEmail[uid] = email;
        }
      }
    });

    referralsSnapshot.forEach((doc) => {
      const referral = doc.data();
      const referrerUid = referral.referrerUid;
      
      if (referrerUid) {
        const referralCode = uidToReferralCode[referrerUid] || 'N/A';
        
        if (referralCode !== 'N/A') {
          if (!referrerStats[referralCode]) {
            referrerStats[referralCode] = {
              email: uidToEmail[referrerUid] || 'N/A',
              referralCode: referralCode,
              totalReferrals: 0,
              completedReferrals: 0,
              totalEarned: 0,
            };
          }
          
          referrerStats[referralCode].totalReferrals++;
          if (referral.status === 'completed') {
            referrerStats[referralCode].completedReferrals++;
            referrerStats[referralCode].totalEarned += referral.rewardAmount || 0;
          }
        }
      }
    });

    const topReferrers = Object.entries(referrerStats)
      .map(([uid, stats]) => stats)
      .sort((a, b) => b.totalReferrals - a.totalReferrals)
      .slice(0, 10);

    const conversionRate = totalReferrals > 0 
      ? (completedReferrals / totalReferrals) * 100 
      : 0;

    let totalBalanceDistributed = 0;
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      totalBalanceDistributed += userData?.balance || 0;
    });

    return {
      success: true,
      metrics: {
        totalUsers,
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalRewardAmount,
        totalBalanceDistributed,
        conversionRate,
        topReferrers,
      },
    };
  } catch (error) {
    console.error('❌ Erro ao buscar métricas do dashboard:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao buscar métricas do dashboard'
    );
  }
});

/**
 * Cloud Function: Credita recompensa quando um pagamento é completado
 * Dispara quando um documento na coleção payments é criado/atualizado com status 'completed'
 */
export const creditReferralReward = functions.firestore
  .document('payments/{paymentId}')
  .onWrite(async (change, context) => {
    const paymentData = change.after.exists ? change.after.data() : null;
    const previousData = change.before.exists ? change.before.data() : null;

    // Só processar se o status mudou para 'completed'
    if (!paymentData || paymentData.status !== 'completed') {
      return null;
    }

    // Verificar se o status mudou (evitar processar múltiplas vezes)
    if (previousData?.status === 'completed') {
      return null;
    }

    const userId = paymentData.userId;
    if (!userId) {
      console.warn('⚠️ Pagamento sem userId:', context.params.paymentId);
      return null;
    }

    try {
      // Buscar o usuário para verificar se foi indicado
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        console.warn(`⚠️ Usuário ${userId} não encontrado`);
        return null;
      }

      const userData = userDoc.data();
      const referredBy = userData?.referredBy;

      if (!referredBy) {
        console.log(`ℹ️ Usuário ${userId} não foi indicado por ninguém`);
        return null;
      }

      // Buscar o código de indicação do referrer
      const referrerSnapshot = await db.collection('users')
        .where('referralCode', '==', referredBy)
        .limit(1)
        .get();

      if (referrerSnapshot.empty) {
        console.warn(`⚠️ Código de indicação ${referredBy} não encontrado`);
        return null;
      }

      const referrerDoc = referrerSnapshot.docs[0];
      const referrerUid = referrerDoc.id;

      // Buscar a indicação correspondente
      const referralSnapshot = await db.collection('referrals')
        .where('referrerUid', '==', referrerUid)
        .where('referredUid', '==', userId)
        .where('status', '==', 'pending')
        .limit(1)
        .get();

      if (referralSnapshot.empty) {
        console.warn(`⚠️ Indicação não encontrada para ${referrerUid} -> ${userId}`);
        return null;
      }

      const referralDoc = referralSnapshot.docs[0];
      const referralId = referralDoc.id;

      // Calcular valor da recompensa baseado na MOEDA DO PAGAMENTO (não 50% do valor)
      // Reais: R$ 10,00 (1000 centavos)
      // Euros: €2,00 (200 centavos)
      // Dólares: $2,00 (200 centavos)
      const paymentCurrency = (paymentData.currency || 'usd').toLowerCase();
      const rewardAmount = paymentCurrency === 'brl' ? 1000 : 200;

      // Atualizar o saldo do referrer
      const referrerRef = db.collection('users').doc(referrerUid);
      await referrerRef.update({
        balance: admin.firestore.FieldValue.increment(rewardAmount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Atualizar o status da indicação
      await db.collection('referrals').doc(referralId).update({
        status: 'completed',
        rewardAmount,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Recompensa de ${rewardAmount} creditada para ${referrerUid} pela indicação de ${userId}`);
      return null;
    } catch (error) {
      console.error(`❌ Erro ao creditar recompensa para pagamento ${context.params.paymentId}:`, error);
      return null;
    }
  });

/**
 * Cloud Function: Solicita pagamento PIX para usuários do Brasil
 * Apenas processa se o saldo >= R$ 50,00 e se é o primeiro pagamento
 */
export const requestReferralPayout = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário deve estar autenticado'
    );
  }

  const userId = context.auth.uid;
  const minPayoutAmount = 5000; // R$ 50,00 em centavos

  try {
    // Buscar dados do usuário
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Usuário não encontrado'
      );
    }

    const userData = userDoc.data();
    
    // Verificar se é região BR
    if (userData?.region !== 'BR') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Pagamentos PIX disponíveis apenas para usuários do Brasil'
      );
    }

    // Verificar se tem chave PIX cadastrada
    if (!userData?.pixKey || !userData.pixKey.trim()) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Chave PIX não cadastrada. Por favor, cadastre sua chave PIX primeiro.'
      );
    }

    // Validar e sanitizar chave PIX (segurança adicional)
    const pixKey = userData.pixKey.trim();
    if (pixKey.length === 0 || pixKey.length > 77) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Chave PIX inválida. Por favor, verifique sua chave PIX.'
      );
    }

    const currentBalance = userData.balance || 0;

    // Verificar se o saldo é suficiente
    if (currentBalance < minPayoutAmount) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `Saldo insuficiente. Mínimo de R$ 50,00 necessário. Saldo atual: R$ ${(currentBalance / 100).toFixed(2).replace('.', ',')}`
      );
    }

    // Verificar se já houve pagamento anterior
    const payoutHistory = await db.collection('payouts')
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .limit(1)
      .get();

    const hasPreviousPayout = !payoutHistory.empty;

    // Se é o primeiro pagamento, verificar se o saldo é exatamente >= R$ 50,00
    if (!hasPreviousPayout && currentBalance < minPayoutAmount) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `Para o primeiro pagamento, é necessário acumular pelo menos R$ 50,00. Saldo atual: R$ ${(currentBalance / 100).toFixed(2).replace('.', ',')}`
      );
    }

    // Criar registro de solicitação de pagamento
    const payoutRef = db.collection('payouts').doc();
    await payoutRef.set({
      userId,
      pixKey: pixKey, // Usar chave sanitizada
      amount: currentBalance,
      status: 'pending',
      region: 'BR',
      currency: 'BRL',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isFirstPayout: !hasPreviousPayout,
    });

    // Zerar o saldo do usuário
    await db.collection('users').doc(userId).update({
      balance: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Solicitação de pagamento PIX criada para ${userId}: R$ ${(currentBalance / 100).toFixed(2)}`);

    return {
      success: true,
      message: `Solicitação de pagamento de R$ ${(currentBalance / 100).toFixed(2).replace('.', ',')} criada com sucesso. O pagamento será processado em até 5 dias úteis.`,
      payoutId: payoutRef.id,
    };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    console.error(`❌ Erro ao processar solicitação de pagamento para ${userId}:`, error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao processar solicitação de pagamento'
    );
  }
});

