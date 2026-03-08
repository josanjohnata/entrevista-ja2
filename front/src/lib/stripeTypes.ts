// ============================================
// Stripe - Tipos TypeScript
// Baseado na documentação oficial do Stripe
// ============================================

// === Cliente ===
export interface StripeCustomer {
  name: string;
  phone?: string;
  email: string;
  taxId?: string; // CPF ou CNPJ
}

// === Produto ===
export interface StripeProduct {
  externalId: string;
  name: string;
  description?: string;
  quantity: number;
  price: number; // em centavos
}

// === Checkout Session ===
export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'canceled';

export interface CreateCheckoutSessionRequest {
  planId: string;
  userId: string;
  email: string;
  amount: number; // preço em centavos
  currency: 'brl' | 'eur' | 'usd'; // moeda
  customerName?: string;
  customerPhone?: string;
  customerTaxId?: string;
  productName?: string; // Nome do produto traduzido
  productDescription?: string; // Descrição do produto traduzida
  metadata?: Record<string, string>;
  couponCode?: string; // Código do cupom promocional
}

export interface CheckoutSessionData {
  id: string;
  url: string;
  clientSecret?: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  expiresAt: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResponse {
  data: CheckoutSessionData;
  error: string | null;
}

// === Payment Intent (para PIX) ===
export type PixStatus = 'pending' | 'paid' | 'expired';

export interface CreatePixPaymentRequest {
  amount: number; // em centavos
  description?: string;
  customer?: StripeCustomer;
  metadata?: Record<string, string>;
}

export interface PixPaymentData {
  id: string;
  amount: number;
  status: PixStatus;
  qrCode: string; // Código copia e cola
  qrCodeImage?: string; // Imagem do QR Code em base64 (se disponível)
  createdAt: string;
  expiresAt: string;
  metadata?: Record<string, string>;
}

export interface PixPaymentResponse {
  data: PixPaymentData;
  error: string | null;
}

export interface PixStatusData {
  status: PixStatus;
  expiresAt: string;
}

export interface PixStatusResponse {
  data: PixStatusData;
  error: string | null;
}

// === Webhooks ===
export type WebhookEvent = 
  | 'checkout.session.completed' 
  | 'payment_intent.succeeded' 
  | 'payment_intent.payment_failed';

export interface WebhookPayload {
  event: WebhookEvent;
  data: {
    id: string;
    metadata?: Record<string, string>;
    [key: string]: unknown;
  };
}

