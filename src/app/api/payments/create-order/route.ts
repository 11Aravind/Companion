import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRazorpayOrder } from '@/lib/services/razorpay';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    // Fetch booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, total_amount, currency, customer_id, companion_id, platform_fee')
      .eq('id', bookingId)
      .single();

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (booking.customer_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Create Razorpay Order
  const totalAmount = Number(booking.total_amount);
  const platformFee = Number(booking.platform_fee);
  const companionEarnings = totalAmount - platformFee;

  const order = await createRazorpayOrder({
    amount: totalAmount,
    currency: booking.currency || 'INR',
    receipt: `rcpt_${booking.id.substring(0, 8)}`,
    notes: {
      bookingId: booking.id,
      customerId: user.id,
    },
  });

  // Record in payments table
  await supabase.from('payments').insert({
    booking_id: booking.id,
    customer_id: user.id,
    companion_id: booking.companion_id,
    razorpay_order_id: order.id,
    amount: totalAmount,
    platform_fee: platformFee,
    companion_earnings: companionEarnings,
    status: 'pending',
    currency: booking.currency || 'INR',
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    isDemo: order.isDemo || false,
  });
} catch (err: any) {
  console.error('[API Create Order] Error:', err);
  return NextResponse.json({ error: err.message || 'Order creation failed' }, { status: 500 });
}
}

