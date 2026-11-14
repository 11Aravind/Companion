import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { BookingStatus, BOOKING_STATUSES } from '@/lib/constants';

export class BookingError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
  }
}

export interface CreateBookingInput {
  customerId: string;
  companionId: string;
  categorySlug: string;
  scheduledDate: string; // "YYYY-MM-DD"
  scheduledStartTime: string; // "HH:MM"
  durationHours: number;
  meetingAddress: string;
  meetingLat: number;
  meetingLng: number;
  notes?: string;
}

export async function createBooking(input: CreateBookingInput) {
  const supabase = await createClient();

  // 1. Prevent overlapping bookings for customer
  const { data: existingCustomerBookings } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('customer_id', input.customerId)
    .in('status', ['companion_arriving', 'active']);

  if (existingCustomerBookings && existingCustomerBookings.length > 0) {
    throw new BookingError('You already have an active companion booking in progress.', 409);
  }

  // 2. Fetch companion profile & rates
  const { data: companion, error: compError } = await supabase
    .from('companion_profiles')
    .select('hourly_rate, is_verified')
    .eq('id', input.companionId)
    .single();

  if (compError || !companion) {
    throw new BookingError('Companion profile not found.', 404);
  }

  // 3. Fetch category
  const { data: category } = await supabase
    .from('companion_categories')
    .select('id, base_rate_per_hour')
    .eq('slug', input.categorySlug)
    .single();

  const hourlyRate = Number(companion.hourly_rate);
  const subtotal = hourlyRate * input.durationHours;
  const platformFee = Math.round(subtotal * 0.1); // 10% platform commission
  const totalAmount = subtotal + platformFee;

  // 4. Generate 4-digit verification OTP
  const verificationOtp = crypto.randomInt(1000, 9999).toString();

  // 5. Insert booking record
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      customer_id: input.customerId,
      companion_id: input.companionId,
      category_id: category?.id || '00000000-0000-0000-0000-000000000000',
      status: BOOKING_STATUSES.PENDING,
      scheduled_date: input.scheduledDate,
      scheduled_start_time: input.scheduledStartTime,
      duration_hours: input.durationHours,
      hourly_rate: hourlyRate,
      subtotal,
      platform_fee: platformFee,
      total_amount: totalAmount,
      currency: 'INR',
      payment_status: 'pending',
      verification_otp: verificationOtp,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (bookingError || !booking) {
    throw new BookingError(bookingError?.message || 'Failed to create booking', 500);
  }

  // 6. Insert booking location
  await supabase.from('booking_locations').insert({
    booking_id: booking.id,
    meeting_address: input.meetingAddress,
    meeting_location: `POINT(${input.meetingLng} ${input.meetingLat})`,
    meeting_notes: input.notes || null,
  });

  // 7. Initialize conversation thread for active communication
  const { data: conversation } = await supabase
    .from('conversations')
    .insert({ booking_id: booking.id, is_active: true })
    .select()
    .single();

  if (conversation) {
    await supabase.from('conversation_participants').insert([
      { conversation_id: conversation.id, user_id: input.customerId },
      { conversation_id: conversation.id, user_id: input.companionId },
    ]);
  }

  return booking;
}

export async function transitionBookingStatus(
  bookingId: string,
  userId: string,
  action: 'accept' | 'reject' | 'arrive' | 'start' | 'complete' | 'cancel',
  payload?: { pin?: string; cancellationReason?: string }
) {
  const supabase = await createClient();

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    throw new BookingError('Booking not found', 404);
  }

  const bookingData = booking as any;
  const isCustomer = bookingData.customer_id === userId;
  const isCompanion = bookingData.companion_id === userId;

  if (!isCustomer && !isCompanion) {
    throw new BookingError('Unauthorized to update this booking', 403);
  }

  let nextStatus: BookingStatus = bookingData.status as BookingStatus;
  const updates: Record<string, any> = {};

  switch (action) {
    case 'accept':
      if (!isCompanion) throw new BookingError('Only companion can accept', 403);
      if (bookingData.status !== 'pending') throw new BookingError('Booking is not pending', 400);
      nextStatus = BOOKING_STATUSES.ACCEPTED;
      break;

    case 'reject':
      if (!isCompanion) throw new BookingError('Only companion can decline', 403);
      if (bookingData.status !== 'pending') throw new BookingError('Booking is not pending', 400);
      nextStatus = BOOKING_STATUSES.REJECTED;
      break;

    case 'arrive':
      if (!isCompanion) throw new BookingError('Only companion can mark arrival', 403);
      if (bookingData.status !== 'accepted' && bookingData.status !== 'confirmed') {
        throw new BookingError('Booking must be accepted before marking en route', 400);
      }
      nextStatus = BOOKING_STATUSES.COMPANION_ARRIVING;
      break;

    case 'start':
      if (!isCompanion) throw new BookingError('Only companion can start session', 403);
      if (bookingData.status !== 'companion_arriving') {
        throw new BookingError('Companion must be arriving to start session', 400);
      }
      // Strict 4-digit PIN verification check
      if (!payload?.pin || payload.pin !== bookingData.verification_otp) {
        throw new BookingError('Invalid verification PIN. Please verify with customer.', 400);
      }
      nextStatus = BOOKING_STATUSES.ACTIVE;
      updates.started_at = new Date().toISOString();
      break;

    case 'complete':
      if (!isCompanion) throw new BookingError('Only companion can complete session', 403);
      if (bookingData.status !== 'active') {
        throw new BookingError('Only active sessions can be completed', 400);
      }
      nextStatus = BOOKING_STATUSES.COMPLETED;
      updates.completed_at = new Date().toISOString();
      updates.payment_status = 'captured';

      // Record companion completion stats increment
      await (supabase.rpc as any)('increment_companion_completed_bookings', {
        companion_id_param: bookingData.companion_id,
      });
      break;

    case 'cancel':
      if (bookingData.status === 'completed' || bookingData.status === 'cancelled') {
        throw new BookingError('Cannot cancel completed or already cancelled booking', 400);
      }
      nextStatus = BOOKING_STATUSES.CANCELLED;
      updates.cancelled_at = new Date().toISOString();
      updates.cancelled_by = userId;
      updates.cancellation_reason = payload?.cancellationReason || 'No reason provided';
      break;

    default:
      throw new BookingError('Invalid booking state transition', 400);
  }

  updates.status = nextStatus;

  const { data: updatedBooking, error: updateError } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (updateError) {
    throw new BookingError(updateError.message, 500);
  }

  return updatedBooking;
}

