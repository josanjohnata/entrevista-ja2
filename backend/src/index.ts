import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
const envDevelopmentPath = path.resolve(process.cwd(), '.env.development');
const envPath = path.resolve(process.cwd(), '.env');

if (isDevelopment && fs.existsSync(envDevelopmentPath)) {
  dotenv.config({ path: envDevelopmentPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import express, { Request, Response } from "express";
import Stripe from "stripe";
import cors from 'cors';
import * as admin from 'firebase-admin';
import { db, auth } from "./lib/firebase";
import { FieldValue } from 'firebase-admin/firestore';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const app = express();

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (isDevelopment) {
      return callback(null, true);
    }
    const allowedOrigins = [
      'https://www.foxapply.com',
      'https://foxapply.com',
      'https://www.entrevistaja.com.br',
      'https://entrevistaja.com.br',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use('/webhook/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function getCountryFromStripe(subscriptionOrCustomerId: string, isSubscription: boolean = true): Promise<string | undefined> {
  if (!stripe) return undefined;

  try {
    if (isSubscription) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionOrCustomerId);
      
      const paymentMethodId = subscription.default_payment_method;
      if (paymentMethodId && typeof paymentMethodId === 'string') {
        try {
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
          if (paymentMethod.type === 'card' && paymentMethod.card?.country) {
            return paymentMethod.card.country;
          }
        } catch (pmError) {
          console.warn('Erro ao buscar payment method:', pmError);
        }
      }
      
      if (subscription.customer && typeof subscription.customer === 'string') {
        try {
          const customer = await stripe.customers.retrieve(subscription.customer);
          if (customer && !customer.deleted) {
            if ('invoice_settings' in customer && customer.invoice_settings?.default_payment_method) {
              const customerPmId = customer.invoice_settings.default_payment_method;
              if (typeof customerPmId === 'string') {
                const paymentMethod = await stripe.paymentMethods.retrieve(customerPmId);
                if (paymentMethod.type === 'card' && paymentMethod.card?.country) {
                  return paymentMethod.card.country;
                }
              }
            }
            if ('default_source' in customer && customer.default_source) {
              const sourceId = customer.default_source;
              if (typeof sourceId === 'string') {
                const source = await stripe.sources.retrieve(sourceId);
                if (source.type === 'card' && source.card?.country) {
                  return source.card.country;
                }
              }
            }
          }
        } catch (customerError) {
          console.warn('Erro ao buscar customer:', customerError);
        }
      }
    } else {
      const customer = await stripe.customers.retrieve(subscriptionOrCustomerId);
      if (customer && !customer.deleted) {
        if ('invoice_settings' in customer && customer.invoice_settings?.default_payment_method) {
          const customerPmId = customer.invoice_settings.default_payment_method;
          if (typeof customerPmId === 'string') {
            try {
              const paymentMethod = await stripe.paymentMethods.retrieve(customerPmId);
              if (paymentMethod.type === 'card' && paymentMethod.card?.country) {
                return paymentMethod.card.country;
              }
            } catch (pmError) {
              console.warn('Erro ao buscar payment method do customer:', pmError);
            }
          }
        }
        if ('default_source' in customer && customer.default_source) {
          const sourceId = customer.default_source;
          if (typeof sourceId === 'string') {
            try {
              const source = await stripe.sources.retrieve(sourceId);
              if (source.type === 'card' && source.card?.country) {
                return source.card.country;
              }
            } catch (sourceError) {
              console.warn('Erro ao buscar source:', sourceError);
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Erro ao buscar país do Stripe:', error);
  }

  return undefined;
}

async function updateUserSubscription(userId: string, status: string, planId?: string, currency?: string, subscriptionId?: string, retryCount = 0) {
  if (!db) {
    console.error('Firebase Firestore não está disponível para atualizar usuário');
    return;
  }

  console.log(`🔄 Atualizando usuário ${userId} para status: ${status}`, {
    userId,
    status,
    planId,
    retryCount,
    timestamp: new Date().toISOString()
  });

  const maxRetries = 2;
  const retryDelay = 1000;

  try {
    const userRef = db.collection("users").doc(userId);
    
    let existingCountry: string | undefined;
    try {
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        existingCountry = userData?.country;
      }
    } catch (error) {
      console.warn('Erro ao buscar país existente do usuário:', error);
    }
    
    const now = new Date();
    let monthsToAdd = 1;
    if (planId?.includes('quarterly') || planId === 'plan_quarterly') {
      monthsToAdd = 3;
    }
    const planExpirationDate = new Date(now.setMonth(now.getMonth() + monthsToAdd));

    let role: string | undefined;
    if (planId) {
      if (planId.includes('quarterly') || planId === 'plan_quarterly') {
        role = 'quarterly_plan';
      } else if (planId.includes('monthly') || planId === 'plan_monthly') {
        role = 'monthly_plan';
      } else if (planId.includes('basic') || planId === 'plan_basic') {
        role = 'basic_plan';
      }
    }

    let region: 'BR' | 'EU' | 'OTHER' | undefined;
    if (currency) {
      const upperCurrency = currency.toUpperCase();
      if (upperCurrency === 'BRL') {
        region = 'BR';
      } else if (upperCurrency === 'EUR') {
        region = 'EU';
      } else {
        region = 'OTHER';
      }
    }

    const updateData: Record<string, unknown> = {
      subscriptionStatus: status,
      lastPaymentAt: new Date(),
      updatedAt: new Date(),
      planExpirationDate,
    };

    // Salvar subscriptionId quando disponível (importante para cancelamento)
    if (subscriptionId) {
      updateData.subscriptionId = subscriptionId;
      updateData.stripeSubscriptionId = subscriptionId; // Manter compatibilidade
    }

    if (status === 'active' && role) {
      updateData.role = role;
      updateData.planId = planId;
    }

    if (currency) {
      updateData.currency = currency.toUpperCase();
    }
    if (region) {
      updateData.region = region;
    }
    
    if (!existingCountry && subscriptionId && stripe) {
      try {
        const stripeCountry = await getCountryFromStripe(subscriptionId, true);
        if (stripeCountry) {
          updateData.country = stripeCountry.toUpperCase();
          console.log(`🌍 País detectado do Stripe como fallback: ${stripeCountry}`);
        }
      } catch (error) {
        console.warn('Erro ao buscar país do Stripe (fallback):', error);
      }
    } else if (existingCountry) {
      updateData.country = existingCountry;
    }

    await userRef.set(updateData, { merge: true });
    console.log(`✅ Usuário ${userId} atualizado com sucesso para status: ${status}${role ? `, role: ${role}` : ''}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isDecoderError = errorMessage.includes('DECODER routines') || errorMessage.includes('Getting metadata from plugin');
    
    console.error('❌ Erro ao atualizar usuário:', {
      userId,
      status,
      error: errorMessage,
      isDecoderError,
      retryCount,
      stack: error instanceof Error ? error.stack : undefined
    });

    if (isDecoderError && retryCount < maxRetries) {
      console.log(`🔄 Tentando novamente (${retryCount + 1}/${maxRetries}) após ${retryDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return updateUserSubscription(userId, status, planId, currency, undefined, retryCount + 1);
    }

    if (isDecoderError) {
      console.error('❌ ERRO CRÍTICO: Problema com as credenciais do Firebase. Verifique FIREBASE_PRIVATE_KEY.');
      console.error('❌ A chave privada pode estar mal formatada ou corrompida.');
    }

    throw error;
  }
}

app.get("/users/count", async (req: Request, res: Response) => {
  try {
    if (!db) {
      console.error('Firebase Firestore não está disponível (db é null)');
      return res.status(500).json({ 
        error: 'USER_COUNT_ERROR', 
        errorCode: 'USER_COUNT_ERROR',
        message: 'Firebase Firestore não está inicializado'
      });
    }

    if (admin.apps.length === 0) {
      console.error('Firebase Admin não está inicializado (admin.apps.length === 0)');
      return res.status(500).json({ 
        error: 'USER_COUNT_ERROR', 
        errorCode: 'USER_COUNT_ERROR',
        message: 'Firebase Admin não está inicializado'
      });
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const count = snapshot.size;
    
    const statsRef = db.collection("stats").doc("users");
    await statsRef.set({ count, updatedAt: new Date() }, { merge: true });
    
    res.json({ count, synced: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Erro ao contar usuários:', {
      message: errorMessage,
      stack: errorStack,
      hasDb: !!db,
      firebaseInitialized: admin.apps.length > 0,
      error
    });
    
    res.status(500).json({ 
      error: 'USER_COUNT_ERROR', 
      errorCode: 'USER_COUNT_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Erro ao contar usuários' : errorMessage
    });
  }
});

app.post("/admin/sync-user-count", async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        error: 'SYNC_ERROR', 
        errorCode: 'SYNC_ERROR',
        message: 'Firebase Firestore não está inicializado'
      });
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const count = snapshot.size;
    
    const statsRef = db.collection("stats").doc("users");
    await statsRef.set({ count, updatedAt: new Date() }, { merge: true });
    
    res.json({ success: true, count });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'SYNC_ERROR', errorCode: 'SYNC_ERROR' });
  }
});

// Função helper para gerar código de referência único
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function referralCodeExists(code: string): Promise<boolean> {
  if (!db) return false;
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("referralCode", "==", code).limit(1).get();
  return !snapshot.empty;
}

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

// Endpoint para admin criar novos usuários
app.post("/admin/create-user", async (req: Request, res: Response) => {
  try {
    const ADMIN_EMAILS = ['josanjohnata@gmail.com', 'edhurabelo@gmail.com'];
    const { adminEmail, email, password, displayName, role, planExpirationDate } = req.body;

    // Verificar se é admin
    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail)) {
      return res.status(403).json({
        error: 'UNAUTHORIZED',
        errorCode: 'UNAUTHORIZED',
        message: 'Apenas administradores podem criar usuários'
      });
    }

    // Validar campos obrigatórios
    if (!email || !password || !displayName || !role) {
      return res.status(400).json({
        error: 'MISSING_REQUIRED_FIELDS',
        errorCode: 'MISSING_REQUIRED_FIELDS',
        message: 'Email, senha, nome e role são obrigatórios'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'INVALID_EMAIL',
        errorCode: 'INVALID_EMAIL',
        message: 'Email inválido'
      });
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return res.status(400).json({
        error: 'WEAK_PASSWORD',
        errorCode: 'WEAK_PASSWORD',
        message: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    // Validar role
    const validRoles = ['basic_plan', 'monthly_plan', 'quarterly_plan', 'recruiter'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'INVALID_ROLE',
        errorCode: 'INVALID_ROLE',
        message: 'Role inválido. Use: basic_plan, monthly_plan, quarterly_plan ou recruiter'
      });
    }

    if (!auth || !db) {
      return res.status(500).json({
        error: 'FIREBASE_NOT_INITIALIZED',
        errorCode: 'FIREBASE_NOT_INITIALIZED',
        message: 'Firebase não está inicializado'
      });
    }

    // Verificar se o usuário já existe
    try {
      const existingUser = await auth.getUserByEmail(email);
      return res.status(400).json({
        error: 'USER_ALREADY_EXISTS',
        errorCode: 'USER_ALREADY_EXISTS',
        message: 'Um usuário com este email já existe'
      });
    } catch (error: any) {
      // Se o erro for "user not found", continuar com a criação
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Criar usuário no Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true, // Marcar email como verificado
    });

    // Gerar código de referência único
    const referralCode = await generateUniqueReferralCode();

    // Preparar dados do usuário para Firestore
    const userData: any = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || displayName,
      role,
      subscriptionStatus: 'active', // Status ativo por padrão quando criado pelo admin
      referralCode,
      balance: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Adicionar data de expiração se fornecida
    if (planExpirationDate) {
      userData.planExpirationDate = admin.firestore.Timestamp.fromDate(new Date(planExpirationDate));
    }

    // Criar documento no Firestore
    await db.collection('users').doc(userRecord.uid).set(userData);

    console.log(`✅ Usuário criado com sucesso: ${email} (${userRecord.uid})`);

    return res.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role,
        referralCode,
      }
    });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = error.code || 'USER_CREATE_ERROR';

    return res.status(500).json({
      error: 'USER_CREATE_ERROR',
      errorCode,
      message: process.env.NODE_ENV === 'production' 
        ? 'Erro ao criar usuário' 
        : errorMessage
    });
  }
});


if (stripe) {
  app.post("/stripe/checkout/create", async (req: Request, res: Response) => {
    try {
      const { planId, userId, email, amount, currency, customerName, customerPhone, customerTaxId, productName, productDescription, metadata, successUrl, cancelUrl, trialPeriodDays, isPCD } = req.body;

      if (!stripe) {
        return res.status(500).json({
          data: null,
          error: 'STRIPE_NOT_CONFIGURED',
          errorCode: 'STRIPE_NOT_CONFIGURED',
        });
      }

      if (!planId || !userId || !email || !amount || !currency) {
        return res.status(400).json({
          data: null,
          error: 'MISSING_REQUIRED_FIELDS',
          errorCode: 'MISSING_REQUIRED_FIELDS',
        });
      }

      const validCurrencies = ['brl', 'eur', 'usd'];
      if (!validCurrencies.includes(currency.toLowerCase())) {
        return res.status(400).json({ 
          data: null, 
          error: 'INVALID_CURRENCY',
          errorCode: 'INVALID_CURRENCY',
        });
      }

      if (amount < 100) {
        return res.status(400).json({ 
          data: null, 
          error: 'MINIMUM_AMOUNT_REQUIRED',
          errorCode: 'MINIMUM_AMOUNT_REQUIRED',
        });
      }

      const sessionMetadata = {
        userId,
        planId: planId || 'plan_monthly',
        ...metadata,
      };

      const subscriptionData: any = {
        metadata: sessionMetadata,
      };

      if (trialPeriodDays && typeof trialPeriodDays === 'number' && trialPeriodDays > 0) {
        subscriptionData.trial_period_days = trialPeriodDays;
      }

      const STRIPE_PRODUCT_IDS: Record<string, string> = {
        'plan_monthly': 'prod_U0No5NIsqECEwU',
        'plan_quarterly': 'prod_U0Nms2EFktulqN',
      };

      const stripeProductId = STRIPE_PRODUCT_IDS[planId];

      const interval: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring.Interval = 'month';
      const lineItem = stripeProductId ? {
        price_data: {
          currency: currency.toLowerCase(),
          product: stripeProductId,
          unit_amount: amount,
          recurring: {
            interval: interval,
            interval_count: 1,
          },
        },
        quantity: 1,
      } : {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: productName || 'Plano Mensal - FoxApply',
            description: productDescription || 'Acesso mensal completo à plataforma FoxApply',
          },
          unit_amount: amount,
          recurring: {
            interval: interval,
            interval_count: 1,
          },
        },
        quantity: 1,
      };

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: email,
        line_items: [lineItem],
        success_url: successUrl || (req.headers.origin && !req.headers.origin.startsWith('chrome-extension://') 
          ? `${req.headers.origin}/cv-automation?session_id={CHECKOUT_SESSION_ID}`
          : 'https://www.entrevistaja.com.br/cv-automation?session_id={CHECKOUT_SESSION_ID}'),
        cancel_url: cancelUrl || (req.headers.origin && !req.headers.origin.startsWith('chrome-extension://')
          ? `${req.headers.origin}/checkout${(isPCD || metadata?.isPCD === 'true') ? '-pcd' : ''}?canceled=true`
          : `https://www.entrevistaja.com.br/checkout${(isPCD || metadata?.isPCD === 'true') ? '-pcd' : ''}?canceled=true`),
        metadata: sessionMetadata,
        subscription_data: subscriptionData,
        allow_promotion_codes: true, // Habilita o campo de código promocional no checkout
      };

      const session = await stripe.checkout.sessions.create(sessionParams);

      return res.json({ data: { url: session.url, sessionId: session.id }, error: null });
    } catch (error) {
      console.error('Erro ao criar checkout session:', error);
      return res.status(500).json({
        data: null,
        error: 'CHECKOUT_SESSION_CREATE_ERROR',
        errorCode: 'CHECKOUT_SESSION_CREATE_ERROR',
      });
    }
  });

  app.get("/stripe/checkout/get", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ data: null, error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
    }

    try {
      const { sessionId } = req.query;

      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ data: null, error: 'MISSING_SESSION_ID', errorCode: 'MISSING_SESSION_ID' });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      let status: 'paid' | 'pending' | 'expired' = 'pending';
      
      if (session.payment_status === 'paid') {
        status = 'paid';
      } else if (session.mode === 'subscription' && session.subscription) {
        try {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            status = 'paid';
          } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
            status = 'pending';
          } else if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
            status = 'expired';
          }
        } catch (subError) {
          console.error('Erro ao buscar subscription:', subError);
        }
      } else if (session.payment_status === 'unpaid') {
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at < now) {
          status = 'expired';
        } else {
          status = 'pending';
        }
      } else {
        status = 'expired';
      }

      return res.json({
        data: {
          id: session.id,
          url: session.url || '',
          clientSecret: null,
          amount: session.amount_total || 0,
          status,
          createdAt: new Date(session.created * 1000).toISOString(),
          expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date().toISOString(),
          metadata: session.metadata || {},
        },
        error: null,
      });
    } catch (error) {
      console.error('Erro ao buscar checkout session:', error);
      return res.status(500).json({
        data: null,
        error: 'CHECKOUT_SESSION_GET_ERROR',
        errorCode: 'CHECKOUT_SESSION_GET_ERROR',
      });
    }
  });

  app.post("/stripe/pix/create", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ data: null, error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
    }

    try {
    const { amount, description, customer, metadata } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ data: null, error: 'MINIMUM_AMOUNT_REQUIRED', errorCode: 'MINIMUM_AMOUNT_REQUIRED' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      description: description || 'Pagamento PIX',
      payment_method_types: ['pix'],
      metadata: metadata || {},
    });

    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method_data: {
        type: 'pix',
      },
    });

    let qrCode = '';
    let qrCodeImage = '';

    if (confirmedPaymentIntent.next_action?.type === 'display_bank_transfer_details') {
      const nextAction = confirmedPaymentIntent.next_action as any;
      const bankTransferDetails = nextAction.display_bank_transfer_details;
      if (bankTransferDetails && 'hosted_voucher_url' in bankTransferDetails) {
        qrCode = bankTransferDetails.hosted_voucher_url || '';
      }
    }

    if (!qrCode && confirmedPaymentIntent.payment_method) {
      const paymentMethodId = typeof confirmedPaymentIntent.payment_method === 'string'
        ? confirmedPaymentIntent.payment_method
        : confirmedPaymentIntent.payment_method.id;
      
      try {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        if (paymentMethod.pix) {
          const pixData = paymentMethod.pix as any;
          qrCode = pixData.qr_code || pixData.hosted_voucher_url || '';
        }
      } catch (err) {
        console.log('Não foi possível obter payment method:', err);
      }
    }

    if (!qrCode) {
      qrCode = confirmedPaymentIntent.client_secret || paymentIntent.id;
    }

    return res.json({
      data: {
        id: confirmedPaymentIntent.id,
        amount: confirmedPaymentIntent.amount,
        status: confirmedPaymentIntent.status === 'succeeded' ? 'paid' : 'pending',
        qrCode,
        qrCodeImage,
        createdAt: new Date(confirmedPaymentIntent.created * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        metadata: confirmedPaymentIntent.metadata || {},
      },
      error: null,
    });
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    return res.status(500).json({
      data: null,
      error: 'PIX_PAYMENT_CREATE_ERROR',
      errorCode: 'PIX_PAYMENT_CREATE_ERROR',
    });
    }
  });

  app.get("/stripe/pix/check", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ data: null, error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
    }

    try {
      const { paymentIntentId } = req.query;

      if (!paymentIntentId || typeof paymentIntentId !== 'string') {
        return res.status(400).json({ data: null, error: 'MISSING_PAYMENT_INTENT_ID', errorCode: 'MISSING_PAYMENT_INTENT_ID' });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      const status = paymentIntent.status === 'succeeded' ? 'paid' : paymentIntent.status === 'requires_payment_method' ? 'expired' : 'pending';

      return res.json({
        data: {
          status,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
        error: null,
      });
    } catch (error) {
      console.error('Erro ao verificar status do PIX:', error);
      return res.status(500).json({
        data: null,
        error: 'PIX_STATUS_CHECK_ERROR',
        errorCode: 'PIX_STATUS_CHECK_ERROR',
      });
    }
  });

  app.post("/stripe/confirm-payment", async (req: Request, res: Response) => {
    const { paymentIntentId, userId, planId } = req.body;

    if (!paymentIntentId || !userId) {
      return res.status(400).json({ error: 'MISSING_REQUIRED_FIELDS', errorCode: 'MISSING_REQUIRED_FIELDS' });
    }

    if (!stripe) {
      return res.status(500).json({ error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        const currency = paymentIntent.currency;
        let country: string | undefined;
        if (paymentIntent.customer && typeof paymentIntent.customer === 'string') {
          country = await getCountryFromStripe(paymentIntent.customer, false);
        }
        await updateUserSubscription(userId, 'active', planId, currency || undefined);
        return res.json({ success: true, status: 'active' });
      }

      const status = paymentIntent.status === 'requires_payment_method' ? 'expired' : 'pending';
      return res.json({ success: false, status });
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      return res.status(500).json({
        error: 'PAYMENT_CONFIRM_ERROR',
        errorCode: 'PAYMENT_CONFIRM_ERROR',
      });
    }
  });

  app.post("/stripe/sync-subscription", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
    }

    try {
      const { sessionId, userId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ 
          error: 'MISSING_SESSION_ID', 
          errorCode: 'MISSING_SESSION_ID' 
        });
      }

      console.log('🔄 Sincronizando subscription manualmente:', { sessionId, userId });

      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const subscriptionId = session.subscription as string | null;

      if (!subscriptionId) {
        return res.status(400).json({ 
          error: 'NO_SUBSCRIPTION_FOUND', 
          errorCode: 'NO_SUBSCRIPTION_FOUND',
          message: 'Esta sessão não possui uma subscription associada'
        });
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      let foundUserId = userId || session.metadata?.userId;
      const planId = session.metadata?.planId;

      if (!foundUserId) {
        foundUserId = subscription.metadata?.userId;
      }

      if (!foundUserId) {
        return res.status(400).json({ 
          error: 'USER_ID_NOT_FOUND', 
          errorCode: 'USER_ID_NOT_FOUND',
          message: 'Não foi possível encontrar o userId na sessão ou subscription'
        });
      }

      console.log('📋 Dados da subscription:', {
        subscriptionId,
        status: subscription.status,
        userId: foundUserId,
        planId
      });

      if (subscription.status === 'active' || subscription.status === 'trialing') {
        const currency = subscription.currency;
        await updateUserSubscription(foundUserId, 'active', planId, currency, subscription.id);
        return res.json({ 
          success: true, 
          status: 'active',
          message: 'Usuário atualizado para active'
        });
      } else {
        return res.json({ 
          success: false, 
          status: subscription.status,
          message: `Subscription está com status: ${subscription.status}`
        });
      }
    } catch (error) {
      console.error('Erro ao sincronizar subscription:', error);
      return res.status(500).json({
        error: 'SYNC_ERROR',
        errorCode: 'SYNC_ERROR',
        message: error instanceof Error ? error.message : 'Erro ao sincronizar subscription'
      });
    }
  });

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  app.post("/webhook/stripe", async (req: Request, res: Response) => {
    console.log('🔔 Webhook recebido:', {
      timestamp: new Date().toISOString(),
      hasBody: !!req.body,
      bodyType: typeof req.body,
      bodyLength: req.body?.length,
      headers: {
        'stripe-signature': !!req.headers['stripe-signature'],
        'content-type': req.headers['content-type']
      }
    });

    const sig = req.headers['stripe-signature'];

    if (!sig || !endpointSecret) {
      console.error('❌ Webhook: Assinatura ou secret não encontrado', { 
        hasSig: !!sig, 
        hasSecret: !!endpointSecret,
        endpointSecretLength: endpointSecret?.length,
        sigLength: sig?.length
      });
      return res.status(400).json({ error: 'WEBHOOK_SIGNATURE_MISSING', errorCode: 'WEBHOOK_SIGNATURE_MISSING' });
    }

    if (!stripe) {
      console.error('❌ Stripe não configurado');
      return res.status(500).json({ error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
    }

    let event: Stripe.Event;

    try {
      const body = req.body as Buffer | string;
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log('✅ Webhook validado com sucesso:', {
        eventId: event.id,
        eventType: event.type,
        livemode: event.livemode
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('❌ Falha ao verificar assinatura do webhook:', {
        message: error.message,
        hasSig: !!sig,
        sigLength: sig?.length,
        hasSecret: !!endpointSecret,
        secretLength: endpointSecret?.length,
        error
      });
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    res.json({ received: true });

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId;

          console.log('Webhook checkout.session.completed:', {
            sessionId: session.id,
            userId,
            planId,
            paymentStatus: session.payment_status,
            mode: session.mode,
            subscription: session.subscription
          });

          if (userId) {
            if (session.mode === 'subscription' && session.subscription) {
              try {
                await stripe.subscriptions.update(session.subscription as string, {
                  metadata: {
                    ...session.metadata,
                    checkoutSessionId: session.id,
                  },
                });
              } catch (updateError) {
                console.warn('Não foi possível atualizar metadata da subscription:', updateError);
              }

              try {
                const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
                const currency = subscription.currency || session.currency;
                const country = await getCountryFromStripe(subscription.id, true);
                console.log('Subscription status:', {
                  subscriptionId: subscription.id,
                  status: subscription.status,
                  userId,
                  currency,
                  country
                });
                
                if (subscription.status === 'active' || subscription.status === 'trialing') {
                  await updateUserSubscription(userId, 'active', planId, currency || undefined);
                  
                  const paymentAmount = session.amount_total || 0;
                  if (paymentAmount > 0 && db) {
                    await db.collection('payments').add({
                      userId,
                      amount: paymentAmount,
                      currency: currency || 'usd',
                      status: 'completed',
                      planId,
                      sessionId: session.id,
                      subscriptionId: subscription.id,
                      createdAt: new Date(),
                    });
                    console.log(`✅ Documento de pagamento criado para ${userId}`);
                  }
                  
                  console.log(`✅ Usuário ${userId} atualizado para active via subscription`);
                } else if (session.payment_status === 'paid') {
                  await updateUserSubscription(userId, 'active', planId, currency || undefined);
                  
                  const paymentAmount = session.amount_total || 0;
                  if (paymentAmount > 0 && db) {
                    await db.collection('payments').add({
                      userId,
                      amount: paymentAmount,
                      currency: currency || 'usd',
                      status: 'completed',
                      planId,
                      sessionId: session.id,
                      subscriptionId: subscription.id,
                      createdAt: new Date(),
                    });
                    console.log(`✅ Documento de pagamento criado para ${userId}`);
                  }
                  
                  console.log(`✅ Usuário ${userId} atualizado para active via payment_status`);
                } else {
                  console.log(`⚠️ Subscription não está active ainda. Status: ${subscription.status}`);
                }
              } catch (subError) {
                console.error('Erro ao buscar subscription:', subError);
                if (session.payment_status === 'paid') {
                  const currency = session.currency;
                  let country: string | undefined;
                  if (session.customer && typeof session.customer === 'string') {
                    country = await getCountryFromStripe(session.customer, false);
                  }
                  await updateUserSubscription(userId, 'active', planId, currency || undefined);
                  console.log(`✅ Usuário ${userId} atualizado para active (fallback)`);
                }
              }
            } else if (session.payment_status === 'paid') {
              const currency = session.currency;
              let country: string | undefined;
              if (session.customer && typeof session.customer === 'string') {
                country = await getCountryFromStripe(session.customer, false);
              }
              await updateUserSubscription(userId, 'active', planId, currency || undefined);
              
              const paymentAmount = session.amount_total || 0;
              if (paymentAmount > 0 && db) {
                await db.collection('payments').add({
                  userId,
                  amount: paymentAmount,
                  currency: currency || 'usd',
                  status: 'completed',
                  planId,
                  sessionId: session.id,
                  createdAt: new Date(),
                });
                console.log(`✅ Documento de pagamento criado para ${userId}`);
              }
              
              console.log(`✅ Usuário ${userId} atualizado para active`);
            }
          } else {
            console.warn('⚠️ checkout.session.completed sem userId no metadata');
          }
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          const subscriptionId = invoice.subscription;

          console.log('Webhook invoice.payment_succeeded:', {
            invoiceId: invoice.id,
            subscriptionId,
            customer: invoice.customer,
            amount: invoice.amount_paid
          });

          if (subscriptionId && stripe) {
            try {
              const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);
              let userId = subscriptionData.metadata?.userId;
              let planId = subscriptionData.metadata?.planId;

              console.log('Subscription metadata inicial:', {
                subscriptionId,
                userId,
                planId,
                hasCheckoutSessionId: !!subscriptionData.metadata?.checkoutSessionId,
                allMetadata: subscriptionData.metadata
              });

              if (!userId) {
                const checkoutSessionId = subscriptionData.metadata?.checkoutSessionId;
                if (checkoutSessionId) {
                  try {
                    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
                    userId = session.metadata?.userId || userId;
                    planId = session.metadata?.planId || planId;
                    console.log('Metadata recuperado da checkout session:', { userId, planId });
                  } catch (sessionError) {
                    console.warn('Não foi possível buscar checkout session:', sessionError);
                  }
                } else {
                  console.log('⚠️ Subscription não tem checkoutSessionId no metadata');
                }
              }

              if (!userId && invoice.customer) {
                try {
                  const customer = await stripe.customers.retrieve(invoice.customer as string);
                  if (customer && !customer.deleted && 'metadata' in customer) {
                    userId = customer.metadata?.userId || userId;
                    planId = customer.metadata?.planId || planId;
                    console.log('Metadata recuperado do customer:', { userId, planId });
                  }
                } catch (customerError) {
                  console.warn('Não foi possível buscar customer:', customerError);
                }
              }

              if (!userId && invoice.lines?.data?.[0]) {
                try {
                  const lineItem = invoice.lines.data[0];
                  if (lineItem.subscription) {
                    const lineSubscription = await stripe.subscriptions.retrieve(lineItem.subscription as string);
                    userId = lineSubscription.metadata?.userId || userId;
                    planId = lineSubscription.metadata?.planId || planId;
                    console.log('Metadata recuperado da subscription do line item:', { userId, planId });
                  }
                } catch (lineError) {
                  console.warn('Não foi possível buscar subscription do line item:', lineError);
                }
              }

              if (userId) {
                const currency = subscriptionData.currency || invoice.currency;
                const country = await getCountryFromStripe(subscriptionId, true);
                await updateUserSubscription(userId, 'active', planId, currency || undefined);
                console.log(`✅ Usuário ${userId} atualizado para active via invoice.payment_succeeded`);
              } else {
                console.warn('⚠️ invoice.payment_succeeded sem userId encontrado após todas as tentativas', {
                  subscriptionId,
                  hasSubscriptionMetadata: !!subscriptionData.metadata?.userId,
                  hasCheckoutSessionId: !!subscriptionData.metadata?.checkoutSessionId,
                  customerId: invoice.customer,
                  subscriptionMetadata: subscriptionData.metadata
                });
              }
            } catch (subError) {
              console.error('Erro ao processar invoice.payment_succeeded:', subError);
            }
          } else {
            console.warn('⚠️ invoice.payment_succeeded sem subscriptionId');
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as any;
          const subscriptionId = invoice.subscription;

          if (subscriptionId && stripe) {
            const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);
            const userId = subscriptionData.metadata?.userId;

            if (userId) {
              await updateUserSubscription(userId, 'past_due');
            }
          }
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata?.userId;
          const planId = subscription.metadata?.planId;

          console.log('Webhook customer.subscription.updated:', {
            subscriptionId: subscription.id,
            status: subscription.status,
            userId
          });

          if (userId) {
            const currency = subscription.currency;
            const country = await getCountryFromStripe(subscription.id, true);
            if (subscription.status === 'active' || subscription.status === 'trialing') {
              await updateUserSubscription(userId, 'active', planId, currency || undefined);
              console.log(`✅ Usuário ${userId} atualizado para active via subscription.updated`);
            } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
              await updateUserSubscription(userId, 'past_due', planId, currency || undefined);
              console.log(`⚠️ Usuário ${userId} atualizado para past_due via subscription.updated`);
            } else if (subscription.status === 'canceled') {
              await updateUserSubscription(userId, 'canceled', planId, currency || undefined);
              console.log(`❌ Usuário ${userId} cancelado via subscription.updated`);
            }
          } else {
            console.warn('⚠️ customer.subscription.updated sem userId no metadata');
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata?.userId;

          console.log('Webhook customer.subscription.deleted:', {
            subscriptionId: subscription.id,
            userId
          });

          if (userId) {
            const currency = subscription.currency;
            await updateUserSubscription(userId, 'canceled', undefined, currency, subscription.id);
            console.log(`❌ Usuário ${userId} cancelado`);
          } else {
            console.warn('⚠️ customer.subscription.deleted sem userId no metadata');
          }
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const userId = paymentIntent.metadata?.userId;
          const planId = paymentIntent.metadata?.planId;

          if (userId) {
            const currency = paymentIntent.currency;
            let country: string | undefined;
            if (paymentIntent.customer && typeof paymentIntent.customer === 'string') {
              country = await getCountryFromStripe(paymentIntent.customer, false);
            }
            await updateUserSubscription(userId, 'active', planId, currency || undefined);
          }
          break;
        }

        case 'payment_intent.payment_failed':
          break;

        case 'invoice.paid': {
          const invoice = event.data.object as any;
          const subscriptionId = invoice.subscription;

          console.log('Webhook invoice.paid:', {
            invoiceId: invoice.id,
            subscriptionId,
            customer: invoice.customer
          });

          if (subscriptionId && stripe) {
            try {
              const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);
              let userId = subscriptionData.metadata?.userId;
              let planId = subscriptionData.metadata?.planId;

              if (!userId) {
                const checkoutSessionId = subscriptionData.metadata?.checkoutSessionId;
                if (checkoutSessionId) {
                  try {
                    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
                    userId = session.metadata?.userId || userId;
                    planId = session.metadata?.planId || planId;
                  } catch (sessionError) {
                    console.warn('Não foi possível buscar checkout session:', sessionError);
                  }
                }
              }

              if (userId) {
                const currency = subscriptionData.currency || invoice.currency;
                const country = await getCountryFromStripe(subscriptionId, true);
                await updateUserSubscription(userId, 'active', planId, currency || undefined);
                
                const paymentAmount = invoice.amount_paid || 0;
                if (paymentAmount > 0 && db) {
                  await db.collection('payments').add({
                    userId,
                    amount: paymentAmount,
                    currency: currency || 'usd',
                    status: 'completed',
                    planId,
                    invoiceId: invoice.id,
                    subscriptionId,
                    createdAt: new Date(),
                  });
                  console.log(`✅ Documento de pagamento criado para ${userId} via invoice.paid`);
                }
                
                console.log(`✅ Usuário ${userId} atualizado para active via invoice.paid`);
              }
            } catch (error) {
              console.error('Erro ao processar invoice.paid:', error);
            }
          }
          break;
        }

        default:
          console.log(`Evento não tratado: ${event.type} [${event.id}]`);
          break;
      }
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', {
        eventType: event.type,
        eventId: event.id,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }
  });
}

app.post("/stripe/subscription/cancel", async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).json({
        error: 'FIREBASE_NOT_CONFIGURED',
        errorCode: 'FIREBASE_NOT_CONFIGURED',
        message: 'Firebase não está configurado'
      });
    }

    if (!stripe) {
      return res.status(500).json({
        error: 'STRIPE_NOT_CONFIGURED',
        errorCode: 'STRIPE_NOT_CONFIGURED',
        message: 'Stripe não está configurado'
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'USER_ID_REQUIRED',
        errorCode: 'USER_ID_REQUIRED',
        message: 'userId é obrigatório'
      });
    }

    // Buscar dados do usuário no Firebase para obter o subscriptionId
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        errorCode: 'USER_NOT_FOUND',
        message: 'Usuário não encontrado'
      });
    }

    const userData = userDoc.data();
    const subscriptionId = userData?.subscriptionId || userData?.stripeSubscriptionId;

    // Se o usuário tem uma assinatura ativa no Stripe, cancelar lá primeiro
    if (subscriptionId && typeof subscriptionId === 'string') {
      try {
        // Buscar a assinatura no Stripe para verificar se ainda está ativa
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Só cancelar se a assinatura ainda estiver ativa ou em período de trial
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          // Cancelar a assinatura no Stripe
          // Isso fará com que o Stripe pare de cobrar e envie o webhook customer.subscription.deleted
          await stripe.subscriptions.cancel(subscriptionId);
          console.log(`✅ Assinatura ${subscriptionId} cancelada no Stripe para usuário ${userId}`);
        } else {
          console.log(`ℹ️ Assinatura ${subscriptionId} já está cancelada ou inativa no Stripe`);
        }
      } catch (stripeError: any) {
        // Se a assinatura não existir no Stripe ou já foi cancelada, continuar
        if (stripeError.code === 'resource_missing') {
          console.log(`⚠️ Assinatura ${subscriptionId} não encontrada no Stripe, continuando com cancelamento no Firebase`);
        } else {
          console.error('Erro ao cancelar assinatura no Stripe:', stripeError);
          // Continuar mesmo assim para atualizar o Firebase
        }
      }
    } else {
      console.log(`ℹ️ Usuário ${userId} não possui subscriptionId no Firebase, apenas atualizando status`);
    }

    // Atualizar o status no Firebase
    // O webhook customer.subscription.deleted também atualizará quando o Stripe processar
    await updateUserSubscription(userId, 'canceled', undefined, undefined);

    console.log(`✅ Assinatura cancelada para usuário ${userId}`);

    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso',
      subscriptionCanceled: true
    });
  } catch (error) {
    console.error('Erro ao cancelar subscription:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    res.status(500).json({
      error: 'SUBSCRIPTION_CANCEL_ERROR',
      errorCode: 'SUBSCRIPTION_CANCEL_ERROR',
      message: errorMessage
    });
  }
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    stripe: STRIPE_SECRET_KEY ? 'configured' : 'not configured',
    webhook: {
      secretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
      secretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0,
      endpoint: '/webhook/stripe'
    },
    firebase: {
      initialized: admin.apps.length > 0,
      hasDb: !!db,
      hasCredentials: !!(
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.FIREBASE_SERVICE_ACCOUNT ||
        (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
      )
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/webhook/stripe/test", (req: Request, res: Response) => {
  res.json({ 
    message: 'Webhook endpoint está acessível',
    endpoint: '/webhook/stripe',
    method: 'POST',
    timestamp: new Date().toISOString()
  });
});

app.get("/webhook/stripe/debug", (req: Request, res: Response) => {
  res.json({
    webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
    webhookSecretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0,
    stripeConfigured: !!stripe,
    firebaseConfigured: !!db,
    endpoint: '/webhook/stripe',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
