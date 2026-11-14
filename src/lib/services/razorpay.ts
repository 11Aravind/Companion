import crypto from 'crypto';

export interface CreateOrderParams {
  amount: number; // in INR (will be converted to paise)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  isDemo?: boolean;
}

/**
 * Creates an order using the Razorpay Orders REST API.
 * Uses HTTP Basic Auth (key_id:key_secret).
 */
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<RazorpayOrderResult> {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Demo Fallback: If credentials not yet placed in .env.local
  if (!keyId || !keySecret || keyId.includes('your_key_id')) {
    console.warn('[Razorpay] Using demo order generator (Razorpay keys not configured)');
    return {
      id: `order_demo_${Date.now()}`,
      amount: Math.round(params.amount * 100), // in paise
      currency: params.currency || 'INR',
      receipt: params.receipt,
      status: 'created',
      isDemo: true,
    };
  }

  const amountInPaise = Math.round(params.amount * 100);

  const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes || {},
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.description || 'Failed to create Razorpay order');
  }

  return {
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    receipt: data.receipt,
    status: data.status,
    isDemo: false,
  };
}

/**
 * Verifies Razorpay Payment Signature:
 * generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret)
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Demo order bypass
  if (orderId.startsWith('order_demo_')) {
    return true;
  }

  if (!keySecret) {
    console.warn('[Razorpay] Cannot verify signature: missing RAZORPAY_KEY_SECRET');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Verifies Razorpay Webhook Signature:
 * signature = hmac_sha256(rawBody, webhookSecret)
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  if (!webhookSecret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}

