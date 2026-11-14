import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyRazorpaySignature } from '@/lib/services/razorpay';
import { createNotification } from '@/lib/services/notification-service';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { bookingId, orderId, paymentId, signature } = await request.json();

    if (!orderId || !paymentId) {
      return NextResponse.json({ error: 'Missing payment parameters' }, { status: 400 });
    }

    // Verify HMAC-SHA256 signature
    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: signature || '',
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // Update payment record
    await supabase
      .from('payments')
      .update({
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        status: 'captured',
      })
      .eq('razorpay_order_id', orderId);

    // Update booking payment_status
    const { data: booking } = await supabase
      .from('bookings')
      .update({
        payment_status: 'captured',
      })
      .eq('id', bookingId)
      .select('companion_id, total_amount')
      .single();

    // Trigger Notification to Companion
    if (booking) {
      await createNotification({
        userId: booking.companion_id,
        title: 'Payment Confirmed',
        body: `Client confirmed payment of ₹${booking.total_amount} for your session.`,
        type: 'payment',
        data: { bookingId, paymentId },
      });
    }

    return NextResponse.json({ success: true, message: 'Payment successfully captured' });
  } catch (err: any) {
    console.error('[API Payment Verify] Error:', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}

