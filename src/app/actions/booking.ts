'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createBooking, transitionBookingStatus, CreateBookingInput } from '@/lib/services/booking-service';

export async function submitBookingAction(input: Omit<CreateBookingInput, 'customerId'>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be signed in to book a companion' };
  }

  try {
    const booking = await createBooking({
      ...input,
      customerId: user.id,
    });

    revalidatePath('/bookings');
    revalidatePath('/dashboard');
    return { success: true, bookingId: (booking as any).id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit booking' };
  }
}

export async function updateBookingStatusAction(
  bookingId: string,
  action: 'accept' | 'reject' | 'arrive' | 'start' | 'complete' | 'cancel',
  payload?: { pin?: string; cancellationReason?: string }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const updated = await transitionBookingStatus(bookingId, user.id, action, payload);
    revalidatePath('/bookings');
    revalidatePath(`/bookings/${bookingId}`);
    revalidatePath('/companion/dashboard');
    return { success: true, booking: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update booking status' };
  }
}

