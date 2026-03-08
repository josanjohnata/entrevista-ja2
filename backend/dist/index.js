"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
const envDevelopmentPath = path.resolve(process.cwd(), '.env.development');
const envPath = path.resolve(process.cwd(), '.env');
if (isDevelopment && fs.existsSync(envDevelopmentPath)) {
    dotenv.config({ path: envDevelopmentPath });
}
else if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}
else {
    dotenv.config();
}
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const cors_1 = __importDefault(require("cors"));
const admin = __importStar(require("firebase-admin"));
const firebase_1 = require("./lib/firebase");
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY ? new stripe_1.default(STRIPE_SECRET_KEY, { apiVersion: '2025-12-15.clover' }) : null;
const app = (0, express_1.default)();
const corsOptions = {
    origin: function (origin, callback) {
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
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.use('/webhook/stripe', express_1.default.raw({ type: 'application/json' }));
app.use(express_1.default.json());
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
function getCountryFromStripe(subscriptionOrCustomerId_1) {
    return __awaiter(this, arguments, void 0, function* (subscriptionOrCustomerId, isSubscription = true) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!stripe)
            return undefined;
        try {
            if (isSubscription) {
                const subscription = yield stripe.subscriptions.retrieve(subscriptionOrCustomerId);
                const paymentMethodId = subscription.default_payment_method;
                if (paymentMethodId && typeof paymentMethodId === 'string') {
                    try {
                        const paymentMethod = yield stripe.paymentMethods.retrieve(paymentMethodId);
                        if (paymentMethod.type === 'card' && ((_a = paymentMethod.card) === null || _a === void 0 ? void 0 : _a.country)) {
                            return paymentMethod.card.country;
                        }
                    }
                    catch (pmError) {
                        console.warn('Erro ao buscar payment method:', pmError);
                    }
                }
                if (subscription.customer && typeof subscription.customer === 'string') {
                    try {
                        const customer = yield stripe.customers.retrieve(subscription.customer);
                        if (customer && !customer.deleted) {
                            if ('invoice_settings' in customer && ((_b = customer.invoice_settings) === null || _b === void 0 ? void 0 : _b.default_payment_method)) {
                                const customerPmId = customer.invoice_settings.default_payment_method;
                                if (typeof customerPmId === 'string') {
                                    const paymentMethod = yield stripe.paymentMethods.retrieve(customerPmId);
                                    if (paymentMethod.type === 'card' && ((_c = paymentMethod.card) === null || _c === void 0 ? void 0 : _c.country)) {
                                        return paymentMethod.card.country;
                                    }
                                }
                            }
                            if ('default_source' in customer && customer.default_source) {
                                const sourceId = customer.default_source;
                                if (typeof sourceId === 'string') {
                                    const source = yield stripe.sources.retrieve(sourceId);
                                    if (source.type === 'card' && ((_d = source.card) === null || _d === void 0 ? void 0 : _d.country)) {
                                        return source.card.country;
                                    }
                                }
                            }
                        }
                    }
                    catch (customerError) {
                        console.warn('Erro ao buscar customer:', customerError);
                    }
                }
            }
            else {
                const customer = yield stripe.customers.retrieve(subscriptionOrCustomerId);
                if (customer && !customer.deleted) {
                    if ('invoice_settings' in customer && ((_e = customer.invoice_settings) === null || _e === void 0 ? void 0 : _e.default_payment_method)) {
                        const customerPmId = customer.invoice_settings.default_payment_method;
                        if (typeof customerPmId === 'string') {
                            try {
                                const paymentMethod = yield stripe.paymentMethods.retrieve(customerPmId);
                                if (paymentMethod.type === 'card' && ((_f = paymentMethod.card) === null || _f === void 0 ? void 0 : _f.country)) {
                                    return paymentMethod.card.country;
                                }
                            }
                            catch (pmError) {
                                console.warn('Erro ao buscar payment method do customer:', pmError);
                            }
                        }
                    }
                    if ('default_source' in customer && customer.default_source) {
                        const sourceId = customer.default_source;
                        if (typeof sourceId === 'string') {
                            try {
                                const source = yield stripe.sources.retrieve(sourceId);
                                if (source.type === 'card' && ((_g = source.card) === null || _g === void 0 ? void 0 : _g.country)) {
                                    return source.card.country;
                                }
                            }
                            catch (sourceError) {
                                console.warn('Erro ao buscar source:', sourceError);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.warn('Erro ao buscar país do Stripe:', error);
        }
        return undefined;
    });
}
function updateUserSubscription(userId_1, status_1, planId_1, currency_1, subscriptionId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, status, planId, currency, subscriptionId, retryCount = 0) {
        if (!firebase_1.db) {
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
            const userRef = firebase_1.db.collection("users").doc(userId);
            let existingCountry;
            try {
                const userDoc = yield userRef.get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    existingCountry = userData === null || userData === void 0 ? void 0 : userData.country;
                }
            }
            catch (error) {
                console.warn('Erro ao buscar país existente do usuário:', error);
            }
            const now = new Date();
            let monthsToAdd = 1;
            if ((planId === null || planId === void 0 ? void 0 : planId.includes('quarterly')) || planId === 'plan_quarterly') {
                monthsToAdd = 3;
            }
            const planExpirationDate = new Date(now.setMonth(now.getMonth() + monthsToAdd));
            let role;
            if (planId) {
                if (planId.includes('quarterly') || planId === 'plan_quarterly') {
                    role = 'quarterly_plan';
                }
                else if (planId.includes('monthly') || planId === 'plan_monthly') {
                    role = 'monthly_plan';
                }
                else if (planId.includes('basic') || planId === 'plan_basic') {
                    role = 'basic_plan';
                }
            }
            let region;
            if (currency) {
                const upperCurrency = currency.toUpperCase();
                if (upperCurrency === 'BRL') {
                    region = 'BR';
                }
                else if (upperCurrency === 'EUR') {
                    region = 'EU';
                }
                else {
                    region = 'OTHER';
                }
            }
            const updateData = {
                subscriptionStatus: status,
                lastPaymentAt: new Date(),
                updatedAt: new Date(),
                planExpirationDate,
            };
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
                    const stripeCountry = yield getCountryFromStripe(subscriptionId, true);
                    if (stripeCountry) {
                        updateData.country = stripeCountry.toUpperCase();
                        console.log(`🌍 País detectado do Stripe como fallback: ${stripeCountry}`);
                    }
                }
                catch (error) {
                    console.warn('Erro ao buscar país do Stripe (fallback):', error);
                }
            }
            else if (existingCountry) {
                updateData.country = existingCountry;
            }
            yield userRef.set(updateData, { merge: true });
            console.log(`✅ Usuário ${userId} atualizado com sucesso para status: ${status}${role ? `, role: ${role}` : ''}`);
        }
        catch (error) {
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
                yield new Promise(resolve => setTimeout(resolve, retryDelay));
                return updateUserSubscription(userId, status, planId, currency, undefined, retryCount + 1);
            }
            if (isDecoderError) {
                console.error('❌ ERRO CRÍTICO: Problema com as credenciais do Firebase. Verifique FIREBASE_PRIVATE_KEY.');
                console.error('❌ A chave privada pode estar mal formatada ou corrompida.');
            }
            throw error;
        }
    });
}
app.get("/users/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!firebase_1.db) {
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
        const usersRef = firebase_1.db.collection("users");
        const snapshot = yield usersRef.get();
        const count = snapshot.size;
        const statsRef = firebase_1.db.collection("stats").doc("users");
        yield statsRef.set({ count, updatedAt: new Date() }, { merge: true });
        res.json({ count, synced: true });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('Erro ao contar usuários:', {
            message: errorMessage,
            stack: errorStack,
            hasDb: !!firebase_1.db,
            firebaseInitialized: admin.apps.length > 0,
            error
        });
        res.status(500).json({
            error: 'USER_COUNT_ERROR',
            errorCode: 'USER_COUNT_ERROR',
            message: process.env.NODE_ENV === 'production' ? 'Erro ao contar usuários' : errorMessage
        });
    }
}));
app.post("/admin/sync-user-count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!firebase_1.db) {
            return res.status(500).json({
                error: 'SYNC_ERROR',
                errorCode: 'SYNC_ERROR',
                message: 'Firebase Firestore não está inicializado'
            });
        }
        const usersRef = firebase_1.db.collection("users");
        const snapshot = yield usersRef.get();
        const count = snapshot.size;
        const statsRef = firebase_1.db.collection("stats").doc("users");
        yield statsRef.set({ count, updatedAt: new Date() }, { merge: true });
        res.json({ success: true, count });
    }
    catch (error) {
        console.error('Erro na sincronização:', error);
        res.status(500).json({ error: 'SYNC_ERROR', errorCode: 'SYNC_ERROR' });
    }
}));
if (stripe) {
    app.post("/stripe/checkout/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { planId, userId, email, amount, currency, customerName, customerPhone, customerTaxId, productName, productDescription, metadata, successUrl, cancelUrl, trialPeriodDays } = req.body;
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
            const sessionMetadata = Object.assign({ userId, planId: planId || 'plan_monthly' }, metadata);
            const subscriptionData = {
                metadata: sessionMetadata,
            };
            if (trialPeriodDays && typeof trialPeriodDays === 'number' && trialPeriodDays > 0) {
                subscriptionData.trial_period_days = trialPeriodDays;
            }
            const STRIPE_PRODUCT_IDS = {
                'plan_monthly': 'prod_U0No5NIsqECEwU',
                'plan_quarterly': 'prod_U0Nms2EFktulqN',
            };
            const stripeProductId = STRIPE_PRODUCT_IDS[planId];
            const interval = 'month';
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
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'subscription',
                customer_email: email,
                line_items: [lineItem],
                success_url: successUrl || (req.headers.origin && !req.headers.origin.startsWith('chrome-extension://')
                    ? `${req.headers.origin}/cv-automation?session_id={CHECKOUT_SESSION_ID}`
                    : 'https://www.entrevistaja.com.br/cv-automation?session_id={CHECKOUT_SESSION_ID}'),
                cancel_url: cancelUrl || (req.headers.origin && !req.headers.origin.startsWith('chrome-extension://')
                    ? `${req.headers.origin}/checkout${trialPeriodDays ? '-pcd' : ''}?canceled=true`
                    : `https://www.entrevistaja.com.br/checkout${trialPeriodDays ? '-pcd' : ''}?canceled=true`),
                metadata: sessionMetadata,
                subscription_data: subscriptionData,
            });
            return res.json({ data: { url: session.url, sessionId: session.id }, error: null });
        }
        catch (error) {
            console.error('Erro ao criar checkout session:', error);
            return res.status(500).json({
                data: null,
                error: 'CHECKOUT_SESSION_CREATE_ERROR',
                errorCode: 'CHECKOUT_SESSION_CREATE_ERROR',
            });
        }
    }));
    app.get("/stripe/checkout/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!stripe) {
            return res.status(500).json({ data: null, error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
        }
        try {
            const { sessionId } = req.query;
            if (!sessionId || typeof sessionId !== 'string') {
                return res.status(400).json({ data: null, error: 'MISSING_SESSION_ID', errorCode: 'MISSING_SESSION_ID' });
            }
            const session = yield stripe.checkout.sessions.retrieve(sessionId);
            let status = 'pending';
            if (session.payment_status === 'paid') {
                status = 'paid';
            }
            else if (session.mode === 'subscription' && session.subscription) {
                try {
                    const subscription = yield stripe.subscriptions.retrieve(session.subscription);
                    if (subscription.status === 'active' || subscription.status === 'trialing') {
                        status = 'paid';
                    }
                    else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
                        status = 'pending';
                    }
                    else if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
                        status = 'expired';
                    }
                }
                catch (subError) {
                    console.error('Erro ao buscar subscription:', subError);
                }
            }
            else if (session.payment_status === 'unpaid') {
                const now = Math.floor(Date.now() / 1000);
                if (session.expires_at && session.expires_at < now) {
                    status = 'expired';
                }
                else {
                    status = 'pending';
                }
            }
            else {
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
        }
        catch (error) {
            console.error('Erro ao buscar checkout session:', error);
            return res.status(500).json({
                data: null,
                error: 'CHECKOUT_SESSION_GET_ERROR',
                errorCode: 'CHECKOUT_SESSION_GET_ERROR',
            });
        }
    }));
    app.post("/stripe/pix/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!stripe) {
            return res.status(500).json({ data: null, error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
        }
        try {
            const { amount, description, customer, metadata } = req.body;
            if (!amount || amount < 100) {
                return res.status(400).json({ data: null, error: 'MINIMUM_AMOUNT_REQUIRED', errorCode: 'MINIMUM_AMOUNT_REQUIRED' });
            }
            const paymentIntent = yield stripe.paymentIntents.create({
                amount,
                currency: 'brl',
                description: description || 'Pagamento PIX',
                payment_method_types: ['pix'],
                metadata: metadata || {},
            });
            const confirmedPaymentIntent = yield stripe.paymentIntents.confirm(paymentIntent.id, {
                payment_method_data: {
                    type: 'pix',
                },
            });
            let qrCode = '';
            let qrCodeImage = '';
            if (((_a = confirmedPaymentIntent.next_action) === null || _a === void 0 ? void 0 : _a.type) === 'display_bank_transfer_details') {
                const nextAction = confirmedPaymentIntent.next_action;
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
                    const paymentMethod = yield stripe.paymentMethods.retrieve(paymentMethodId);
                    if (paymentMethod.pix) {
                        const pixData = paymentMethod.pix;
                        qrCode = pixData.qr_code || pixData.hosted_voucher_url || '';
                    }
                }
                catch (err) {
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
        }
        catch (error) {
            console.error('Erro ao criar pagamento PIX:', error);
            return res.status(500).json({
                data: null,
                error: 'PIX_PAYMENT_CREATE_ERROR',
                errorCode: 'PIX_PAYMENT_CREATE_ERROR',
            });
        }
    }));
    app.get("/stripe/pix/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!stripe) {
            return res.status(500).json({ data: null, error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
        }
        try {
            const { paymentIntentId } = req.query;
            if (!paymentIntentId || typeof paymentIntentId !== 'string') {
                return res.status(400).json({ data: null, error: 'MISSING_PAYMENT_INTENT_ID', errorCode: 'MISSING_PAYMENT_INTENT_ID' });
            }
            const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
            const status = paymentIntent.status === 'succeeded' ? 'paid' : paymentIntent.status === 'requires_payment_method' ? 'expired' : 'pending';
            return res.json({
                data: {
                    status,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                },
                error: null,
            });
        }
        catch (error) {
            console.error('Erro ao verificar status do PIX:', error);
            return res.status(500).json({
                data: null,
                error: 'PIX_STATUS_CHECK_ERROR',
                errorCode: 'PIX_STATUS_CHECK_ERROR',
            });
        }
    }));
    app.post("/stripe/confirm-payment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { paymentIntentId, userId, planId } = req.body;
        if (!paymentIntentId || !userId) {
            return res.status(400).json({ error: 'MISSING_REQUIRED_FIELDS', errorCode: 'MISSING_REQUIRED_FIELDS' });
        }
        if (!stripe) {
            return res.status(500).json({ error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
        }
        try {
            const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status === 'succeeded') {
                const currency = paymentIntent.currency;
                let country;
                if (paymentIntent.customer && typeof paymentIntent.customer === 'string') {
                    country = yield getCountryFromStripe(paymentIntent.customer, false);
                }
                yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                return res.json({ success: true, status: 'active' });
            }
            const status = paymentIntent.status === 'requires_payment_method' ? 'expired' : 'pending';
            return res.json({ success: false, status });
        }
        catch (error) {
            console.error('Erro ao confirmar pagamento:', error);
            return res.status(500).json({
                error: 'PAYMENT_CONFIRM_ERROR',
                errorCode: 'PAYMENT_CONFIRM_ERROR',
            });
        }
    }));
    app.post("/stripe/sync-subscription", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
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
            const session = yield stripe.checkout.sessions.retrieve(sessionId);
            const subscriptionId = session.subscription;
            if (!subscriptionId) {
                return res.status(400).json({
                    error: 'NO_SUBSCRIPTION_FOUND',
                    errorCode: 'NO_SUBSCRIPTION_FOUND',
                    message: 'Esta sessão não possui uma subscription associada'
                });
            }
            const subscription = yield stripe.subscriptions.retrieve(subscriptionId);
            let foundUserId = userId || ((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId);
            const planId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.planId;
            if (!foundUserId) {
                foundUserId = (_c = subscription.metadata) === null || _c === void 0 ? void 0 : _c.userId;
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
                yield updateUserSubscription(foundUserId, 'active', planId, currency, subscription.id);
                return res.json({
                    success: true,
                    status: 'active',
                    message: 'Usuário atualizado para active'
                });
            }
            else {
                return res.json({
                    success: false,
                    status: subscription.status,
                    message: `Subscription está com status: ${subscription.status}`
                });
            }
        }
        catch (error) {
            console.error('Erro ao sincronizar subscription:', error);
            return res.status(500).json({
                error: 'SYNC_ERROR',
                errorCode: 'SYNC_ERROR',
                message: error instanceof Error ? error.message : 'Erro ao sincronizar subscription'
            });
        }
    }));
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    app.post("/webhook/stripe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        console.log('🔔 Webhook recebido:', {
            timestamp: new Date().toISOString(),
            hasBody: !!req.body,
            bodyType: typeof req.body,
            bodyLength: (_a = req.body) === null || _a === void 0 ? void 0 : _a.length,
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
                endpointSecretLength: endpointSecret === null || endpointSecret === void 0 ? void 0 : endpointSecret.length,
                sigLength: sig === null || sig === void 0 ? void 0 : sig.length
            });
            return res.status(400).json({ error: 'WEBHOOK_SIGNATURE_MISSING', errorCode: 'WEBHOOK_SIGNATURE_MISSING' });
        }
        if (!stripe) {
            console.error('❌ Stripe não configurado');
            return res.status(500).json({ error: 'STRIPE_NOT_CONFIGURED', errorCode: 'STRIPE_NOT_CONFIGURED' });
        }
        let event;
        try {
            const body = req.body;
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
            console.log('✅ Webhook validado com sucesso:', {
                eventId: event.id,
                eventType: event.type,
                livemode: event.livemode
            });
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error('❌ Falha ao verificar assinatura do webhook:', {
                message: error.message,
                hasSig: !!sig,
                sigLength: sig === null || sig === void 0 ? void 0 : sig.length,
                hasSecret: !!endpointSecret,
                secretLength: endpointSecret === null || endpointSecret === void 0 ? void 0 : endpointSecret.length,
                error
            });
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
        res.json({ received: true });
        try {
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object;
                    const userId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b.userId;
                    const planId = (_c = session.metadata) === null || _c === void 0 ? void 0 : _c.planId;
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
                                yield stripe.subscriptions.update(session.subscription, {
                                    metadata: Object.assign(Object.assign({}, session.metadata), { checkoutSessionId: session.id }),
                                });
                            }
                            catch (updateError) {
                                console.warn('Não foi possível atualizar metadata da subscription:', updateError);
                            }
                            try {
                                const subscription = yield stripe.subscriptions.retrieve(session.subscription);
                                const currency = subscription.currency || session.currency;
                                const country = yield getCountryFromStripe(subscription.id, true);
                                console.log('Subscription status:', {
                                    subscriptionId: subscription.id,
                                    status: subscription.status,
                                    userId,
                                    currency,
                                    country
                                });
                                if (subscription.status === 'active' || subscription.status === 'trialing') {
                                    yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                                    const paymentAmount = session.amount_total || 0;
                                    if (paymentAmount > 0 && firebase_1.db) {
                                        yield firebase_1.db.collection('payments').add({
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
                                }
                                else if (session.payment_status === 'paid') {
                                    yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                                    const paymentAmount = session.amount_total || 0;
                                    if (paymentAmount > 0 && firebase_1.db) {
                                        yield firebase_1.db.collection('payments').add({
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
                                }
                                else {
                                    console.log(`⚠️ Subscription não está active ainda. Status: ${subscription.status}`);
                                }
                            }
                            catch (subError) {
                                console.error('Erro ao buscar subscription:', subError);
                                if (session.payment_status === 'paid') {
                                    const currency = session.currency;
                                    let country;
                                    if (session.customer && typeof session.customer === 'string') {
                                        country = yield getCountryFromStripe(session.customer, false);
                                    }
                                    yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                                    console.log(`✅ Usuário ${userId} atualizado para active (fallback)`);
                                }
                            }
                        }
                        else if (session.payment_status === 'paid') {
                            const currency = session.currency;
                            let country;
                            if (session.customer && typeof session.customer === 'string') {
                                country = yield getCountryFromStripe(session.customer, false);
                            }
                            yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                            const paymentAmount = session.amount_total || 0;
                            if (paymentAmount > 0 && firebase_1.db) {
                                yield firebase_1.db.collection('payments').add({
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
                    }
                    else {
                        console.warn('⚠️ checkout.session.completed sem userId no metadata');
                    }
                    break;
                }
                case 'invoice.payment_succeeded': {
                    const invoice = event.data.object;
                    const subscriptionId = invoice.subscription;
                    console.log('Webhook invoice.payment_succeeded:', {
                        invoiceId: invoice.id,
                        subscriptionId,
                        customer: invoice.customer,
                        amount: invoice.amount_paid
                    });
                    if (subscriptionId && stripe) {
                        try {
                            const subscriptionData = yield stripe.subscriptions.retrieve(subscriptionId);
                            let userId = (_d = subscriptionData.metadata) === null || _d === void 0 ? void 0 : _d.userId;
                            let planId = (_e = subscriptionData.metadata) === null || _e === void 0 ? void 0 : _e.planId;
                            console.log('Subscription metadata inicial:', {
                                subscriptionId,
                                userId,
                                planId,
                                hasCheckoutSessionId: !!((_f = subscriptionData.metadata) === null || _f === void 0 ? void 0 : _f.checkoutSessionId),
                                allMetadata: subscriptionData.metadata
                            });
                            if (!userId) {
                                const checkoutSessionId = (_g = subscriptionData.metadata) === null || _g === void 0 ? void 0 : _g.checkoutSessionId;
                                if (checkoutSessionId) {
                                    try {
                                        const session = yield stripe.checkout.sessions.retrieve(checkoutSessionId);
                                        userId = ((_h = session.metadata) === null || _h === void 0 ? void 0 : _h.userId) || userId;
                                        planId = ((_j = session.metadata) === null || _j === void 0 ? void 0 : _j.planId) || planId;
                                        console.log('Metadata recuperado da checkout session:', { userId, planId });
                                    }
                                    catch (sessionError) {
                                        console.warn('Não foi possível buscar checkout session:', sessionError);
                                    }
                                }
                                else {
                                    console.log('⚠️ Subscription não tem checkoutSessionId no metadata');
                                }
                            }
                            if (!userId && invoice.customer) {
                                try {
                                    const customer = yield stripe.customers.retrieve(invoice.customer);
                                    if (customer && !customer.deleted && 'metadata' in customer) {
                                        userId = ((_k = customer.metadata) === null || _k === void 0 ? void 0 : _k.userId) || userId;
                                        planId = ((_l = customer.metadata) === null || _l === void 0 ? void 0 : _l.planId) || planId;
                                        console.log('Metadata recuperado do customer:', { userId, planId });
                                    }
                                }
                                catch (customerError) {
                                    console.warn('Não foi possível buscar customer:', customerError);
                                }
                            }
                            if (!userId && ((_o = (_m = invoice.lines) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o[0])) {
                                try {
                                    const lineItem = invoice.lines.data[0];
                                    if (lineItem.subscription) {
                                        const lineSubscription = yield stripe.subscriptions.retrieve(lineItem.subscription);
                                        userId = ((_p = lineSubscription.metadata) === null || _p === void 0 ? void 0 : _p.userId) || userId;
                                        planId = ((_q = lineSubscription.metadata) === null || _q === void 0 ? void 0 : _q.planId) || planId;
                                        console.log('Metadata recuperado da subscription do line item:', { userId, planId });
                                    }
                                }
                                catch (lineError) {
                                    console.warn('Não foi possível buscar subscription do line item:', lineError);
                                }
                            }
                            if (userId) {
                                const currency = subscriptionData.currency || invoice.currency;
                                const country = yield getCountryFromStripe(subscriptionId, true);
                                yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                                console.log(`✅ Usuário ${userId} atualizado para active via invoice.payment_succeeded`);
                            }
                            else {
                                console.warn('⚠️ invoice.payment_succeeded sem userId encontrado após todas as tentativas', {
                                    subscriptionId,
                                    hasSubscriptionMetadata: !!((_r = subscriptionData.metadata) === null || _r === void 0 ? void 0 : _r.userId),
                                    hasCheckoutSessionId: !!((_s = subscriptionData.metadata) === null || _s === void 0 ? void 0 : _s.checkoutSessionId),
                                    customerId: invoice.customer,
                                    subscriptionMetadata: subscriptionData.metadata
                                });
                            }
                        }
                        catch (subError) {
                            console.error('Erro ao processar invoice.payment_succeeded:', subError);
                        }
                    }
                    else {
                        console.warn('⚠️ invoice.payment_succeeded sem subscriptionId');
                    }
                    break;
                }
                case 'invoice.payment_failed': {
                    const invoice = event.data.object;
                    const subscriptionId = invoice.subscription;
                    if (subscriptionId && stripe) {
                        const subscriptionData = yield stripe.subscriptions.retrieve(subscriptionId);
                        const userId = (_t = subscriptionData.metadata) === null || _t === void 0 ? void 0 : _t.userId;
                        if (userId) {
                            yield updateUserSubscription(userId, 'past_due');
                        }
                    }
                    break;
                }
                case 'customer.subscription.updated': {
                    const subscription = event.data.object;
                    const userId = (_u = subscription.metadata) === null || _u === void 0 ? void 0 : _u.userId;
                    const planId = (_v = subscription.metadata) === null || _v === void 0 ? void 0 : _v.planId;
                    console.log('Webhook customer.subscription.updated:', {
                        subscriptionId: subscription.id,
                        status: subscription.status,
                        userId
                    });
                    if (userId) {
                        const currency = subscription.currency;
                        const country = yield getCountryFromStripe(subscription.id, true);
                        if (subscription.status === 'active' || subscription.status === 'trialing') {
                            yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                            console.log(`✅ Usuário ${userId} atualizado para active via subscription.updated`);
                        }
                        else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
                            yield updateUserSubscription(userId, 'past_due', planId, currency || undefined);
                            console.log(`⚠️ Usuário ${userId} atualizado para past_due via subscription.updated`);
                        }
                        else if (subscription.status === 'canceled') {
                            yield updateUserSubscription(userId, 'canceled', planId, currency || undefined);
                            console.log(`❌ Usuário ${userId} cancelado via subscription.updated`);
                        }
                    }
                    else {
                        console.warn('⚠️ customer.subscription.updated sem userId no metadata');
                    }
                    break;
                }
                case 'customer.subscription.deleted': {
                    const subscription = event.data.object;
                    const userId = (_w = subscription.metadata) === null || _w === void 0 ? void 0 : _w.userId;
                    console.log('Webhook customer.subscription.deleted:', {
                        subscriptionId: subscription.id,
                        userId
                    });
                    if (userId) {
                        const currency = subscription.currency;
                        yield updateUserSubscription(userId, 'canceled', undefined, currency, subscription.id);
                        console.log(`❌ Usuário ${userId} cancelado`);
                    }
                    else {
                        console.warn('⚠️ customer.subscription.deleted sem userId no metadata');
                    }
                    break;
                }
                case 'payment_intent.succeeded': {
                    const paymentIntent = event.data.object;
                    const userId = (_x = paymentIntent.metadata) === null || _x === void 0 ? void 0 : _x.userId;
                    const planId = (_y = paymentIntent.metadata) === null || _y === void 0 ? void 0 : _y.planId;
                    if (userId) {
                        const currency = paymentIntent.currency;
                        let country;
                        if (paymentIntent.customer && typeof paymentIntent.customer === 'string') {
                            country = yield getCountryFromStripe(paymentIntent.customer, false);
                        }
                        yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                    }
                    break;
                }
                case 'payment_intent.payment_failed':
                    break;
                case 'invoice.paid': {
                    const invoice = event.data.object;
                    const subscriptionId = invoice.subscription;
                    console.log('Webhook invoice.paid:', {
                        invoiceId: invoice.id,
                        subscriptionId,
                        customer: invoice.customer
                    });
                    if (subscriptionId && stripe) {
                        try {
                            const subscriptionData = yield stripe.subscriptions.retrieve(subscriptionId);
                            let userId = (_z = subscriptionData.metadata) === null || _z === void 0 ? void 0 : _z.userId;
                            let planId = (_0 = subscriptionData.metadata) === null || _0 === void 0 ? void 0 : _0.planId;
                            if (!userId) {
                                const checkoutSessionId = (_1 = subscriptionData.metadata) === null || _1 === void 0 ? void 0 : _1.checkoutSessionId;
                                if (checkoutSessionId) {
                                    try {
                                        const session = yield stripe.checkout.sessions.retrieve(checkoutSessionId);
                                        userId = ((_2 = session.metadata) === null || _2 === void 0 ? void 0 : _2.userId) || userId;
                                        planId = ((_3 = session.metadata) === null || _3 === void 0 ? void 0 : _3.planId) || planId;
                                    }
                                    catch (sessionError) {
                                        console.warn('Não foi possível buscar checkout session:', sessionError);
                                    }
                                }
                            }
                            if (userId) {
                                const currency = subscriptionData.currency || invoice.currency;
                                const country = yield getCountryFromStripe(subscriptionId, true);
                                yield updateUserSubscription(userId, 'active', planId, currency || undefined);
                                const paymentAmount = invoice.amount_paid || 0;
                                if (paymentAmount > 0 && firebase_1.db) {
                                    yield firebase_1.db.collection('payments').add({
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
                        }
                        catch (error) {
                            console.error('Erro ao processar invoice.paid:', error);
                        }
                    }
                    break;
                }
                default:
                    console.log(`Evento não tratado: ${event.type} [${event.id}]`);
                    break;
            }
        }
        catch (error) {
            console.error('❌ Erro ao processar webhook:', {
                eventType: event.type,
                eventId: event.id,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                timestamp: new Date().toISOString()
            });
        }
    }));
}
app.post("/stripe/subscription/cancel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!firebase_1.db) {
            return res.status(500).json({
                error: 'FIREBASE_NOT_CONFIGURED',
                errorCode: 'FIREBASE_NOT_CONFIGURED',
                message: 'Firebase não está configurado'
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
        yield updateUserSubscription(userId, 'canceled', undefined, undefined);
        console.log(`✅ Assinatura cancelada para usuário ${userId}`);
        res.json({
            success: true,
            message: 'Assinatura cancelada com sucesso'
        });
    }
    catch (error) {
        console.error('Erro ao cancelar subscription:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({
            error: 'SUBSCRIPTION_CANCEL_ERROR',
            errorCode: 'SUBSCRIPTION_CANCEL_ERROR',
            message: errorMessage
        });
    }
}));
app.get("/health", (req, res) => {
    var _a;
    res.json({
        status: 'ok',
        stripe: STRIPE_SECRET_KEY ? 'configured' : 'not configured',
        webhook: {
            secretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
            secretLength: ((_a = process.env.STRIPE_WEBHOOK_SECRET) === null || _a === void 0 ? void 0 : _a.length) || 0,
            endpoint: '/webhook/stripe'
        },
        firebase: {
            initialized: admin.apps.length > 0,
            hasDb: !!firebase_1.db,
            hasCredentials: !!(process.env.GOOGLE_APPLICATION_CREDENTIALS ||
                process.env.FIREBASE_SERVICE_ACCOUNT ||
                (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY))
        },
        environment: process.env.NODE_ENV || 'development'
    });
});
app.get("/webhook/stripe/test", (req, res) => {
    res.json({
        message: 'Webhook endpoint está acessível',
        endpoint: '/webhook/stripe',
        method: 'POST',
        timestamp: new Date().toISOString()
    });
});
app.get("/webhook/stripe/debug", (req, res) => {
    var _a;
    res.json({
        webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
        webhookSecretLength: ((_a = process.env.STRIPE_WEBHOOK_SECRET) === null || _a === void 0 ? void 0 : _a.length) || 0,
        stripeConfigured: !!stripe,
        firebaseConfigured: !!firebase_1.db,
        endpoint: '/webhook/stripe',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
