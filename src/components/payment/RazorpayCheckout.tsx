'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayCheckoutProps {
  bookingId: string;
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export function RazorpayCheckout({
  bookingId,
  amount,
  currency = 'INR',
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPaid, setIsPaid] = React.useState(false);

  // Load Razorpay Checkout Script
  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // 1. Create Order via server route
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      // Handle Demo Mode
      if (orderData.isDemo) {
        // Automatically verify demo order
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId,
            orderId: orderData.orderId,
            paymentId: `pay_demo_${Date.now()}`,
            signature: 'demo_signature',
          }),
        });

        if (verifyRes.ok) {
          setIsPaid(true);
          onSuccess?.();
          return;
        }
      }

      // 2. Load Razorpay JS SDK
      const scriptLoaded = await loadScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Check your internet connection.');
      }

      // 3. Configure Checkout Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Companion Care',
        description: `Booking #${bookingId.substring(0, 8)}`,
        order_id: orderData.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Verify signature on server
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            setIsPaid(true);
            onSuccess?.();
          } else {
            onError?.(verifyData.error || 'Payment verification failed');
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone || '',
        },
        theme: {
          color: '#0B132B', // Brand Dark Navy
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      onError?.(err.message || 'Payment initiation failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPaid) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>Payment of {formatCurrency(amount, currency)} Captured Successfully</span>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
          Paid via Razorpay
        </span>
      </div>
    );
  }

  return (
    <Button
      onClick={handlePayment}
      isLoading={isLoading}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-md gap-2"
    >
      <CreditCard className="h-4 w-4" />
      <span>Pay {formatCurrency(amount, currency)} via Razorpay</span>
    </Button>
  );
}

