// ============================================
// Stripe - API Client
// ============================================

import {
  CreateCheckoutSessionRequest,
  CheckoutSessionResponse,
  CheckoutSessionData,
  CreatePixPaymentRequest,
  PixPaymentResponse,
  PixPaymentData,
  PixStatusResponse,
  PixStatusData,
} from './stripeTypes';
import { translateBackendError } from '../utils/backendErrorTranslator';

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// ============================================
// Checkout Session - Para pagamentos com cartão
// ============================================

/**
 * Cria uma sessão de checkout do Stripe
 * Retorna uma URL para onde o cliente deve ser redirecionado
 */
export async function createCheckoutSession(data: CreateCheckoutSessionRequest): Promise<CheckoutSessionData> {
    // Aplicar período de teste de 7 dias para todos os produtos de assinatura (exceto lifetime)
    const isLifetime = data.planId?.includes('lifetime');
    const requestBody: CreateCheckoutSessionRequest & { trialPeriodDays?: number } = {
      ...data,
    };
    
    if (!isLifetime) {
      requestBody.trialPeriodDays = 7; // 7 dias grátis para todos os produtos de assinatura
    }
  const response = await fetch(`${getBackendUrl()}/stripe/checkout/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = translateBackendError(errorData.error || errorData.errorCode || 'CHECKOUT_SESSION_CREATE_ERROR');
    throw new Error(errorMessage);
  }

  const result: CheckoutSessionResponse = await response.json();
  if (result.error) {
    throw new Error(translateBackendError(result.error));
  }
  return result.data;
}

/**
 * Cria uma sessão de checkout do Stripe com trial period de 30 dias para PCD
 * Retorna uma URL para onde o cliente deve ser redirecionado
 */
export async function createCheckoutSessionPCD(data: CreateCheckoutSessionRequest): Promise<CheckoutSessionData> {
  const response = await fetch(`${getBackendUrl()}/stripe/checkout/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      trialPeriodDays: 30, // 30 dias grátis para PCD
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = translateBackendError(errorData.error || errorData.errorCode || 'CHECKOUT_SESSION_CREATE_ERROR');
    throw new Error(errorMessage);
  }

  const result: CheckoutSessionResponse = await response.json();
  if (result.error) {
    throw new Error(translateBackendError(result.error));
  }
  return result.data;
}

/**
 * Busca os detalhes de uma sessão de checkout específica
 */
export async function getCheckoutSession(sessionId: string): Promise<CheckoutSessionData> {
  const response = await fetch(`${getBackendUrl()}/stripe/checkout/get?sessionId=${sessionId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = translateBackendError(errorData.error || errorData.errorCode || 'CHECKOUT_SESSION_GET_ERROR');
    throw new Error(errorMessage);
  }

  const result: CheckoutSessionResponse = await response.json();
  if (result.error) {
    throw new Error(translateBackendError(result.error));
  }
  return result.data;
}

// ============================================
// PIX Payment Intent - Para pagamentos PIX
// ============================================

/**
 * Cria um Payment Intent para PIX
 * Retorna QR Code e dados do pagamento
 */
export async function createPixPayment(data: CreatePixPaymentRequest): Promise<PixPaymentData> {
  const response = await fetch(`${getBackendUrl()}/stripe/pix/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = translateBackendError(errorData.error || errorData.errorCode || 'PIX_PAYMENT_CREATE_ERROR');
    throw new Error(errorMessage);
  }

  const result: PixPaymentResponse = await response.json();
  if (result.error) {
    throw new Error(translateBackendError(result.error));
  }
  return result.data;
}

/**
 * Verifica o status de um pagamento PIX
 */
export async function getPixPaymentStatus(paymentIntentId: string): Promise<PixStatusData> {
  const response = await fetch(`${getBackendUrl()}/stripe/pix/check?paymentIntentId=${paymentIntentId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = translateBackendError(errorData.error || errorData.errorCode || 'PIX_STATUS_CHECK_ERROR');
    throw new Error(errorMessage);
  }

  const result: PixStatusResponse = await response.json();
  if (result.error) {
    throw new Error(translateBackendError(result.error));
  }
  return result.data;
}

/**
 * Confirma o pagamento e atualiza o status do usuário no Firestore
 * Usado quando o polling detecta que o PIX foi pago
 */
export async function confirmPayment(paymentIntentId: string, userId: string, planId: string): Promise<{ success: boolean; status: string }> {
  const response = await fetch(`${getBackendUrl()}/stripe/confirm-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId, userId, planId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = translateBackendError(errorData.error || errorData.errorCode || 'PAYMENT_CONFIRM_ERROR');
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Sincroniza o status da subscription manualmente
 * Usado quando o webhook não atualizou o status do usuário
 */
export async function syncSubscription(sessionId: string, userId?: string): Promise<{ success: boolean; status: string; message?: string }> {
  const response = await fetch(`${getBackendUrl()}/stripe/sync-subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, userId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = translateBackendError(errorData.error || errorData.errorCode || 'SYNC_ERROR');
    throw new Error(errorMessage);
  }

  return response.json();
}

// ============================================
// Utilitários
// ============================================

export function formatPriceToCents(price: number): number {
  return Math.round(price * 100);
}

export function formatCentsToDisplay(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// ============================================
// Planos disponíveis
// ============================================

export const PLANS = {
  monthly: {
    externalId: 'plan_monthly',
    name: 'Plano Mensal',
    description: 'Acesso por 1 mês',
    price: 3990, // R$ 39,90 em centavos
    months: 1,
  },
  quarterly: {
    externalId: 'plan_quarterly',
    name: 'Plano Trimestral',
    description: 'Acesso por 3 meses (pague 2, ganhe 3)',
    price: 7980, // R$ 79,80 em centavos (2 meses)
    months: 3,
  }
} as const;

export type PlanKey = keyof typeof PLANS;

// ============================================
// Cancel Subscription
// ============================================

/**
 * Cancela a assinatura do usuário
 */
export async function cancelSubscription(userId: string): Promise<{ success: boolean; message: string; subscriptionCanceled: boolean }> {
  const response = await fetch(`${getBackendUrl()}/stripe/subscription/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = translateBackendError(errorData.error || errorData.errorCode || 'SUBSCRIPTION_CANCEL_ERROR');
    throw new Error(errorMessage);
  }

  return response.json();
}

