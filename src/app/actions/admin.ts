'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Helper to assert admin privilege
 */
async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if ((profile as any)?.role !== 'admin') {
    throw new Error('Access denied: Administrator privileges required');
  }

  return { user, profile };
}

/**
 * Approve or reject a companion's ID verification
 */
export async function reviewVerificationAction(
  verificationId: string,
  companionId: string,
  status: 'verified' | 'rejected',
  rejectionReason?: string
) {
  try {
    const { user } = await assertAdmin();
    const admin = createAdminClient();

    // 1. Update verification record
    const { error: verError } = await admin
      .from('identity_verifications')
      .update({
        status,
        reviewer_id: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: status === 'rejected' ? rejectionReason || 'Documentation does not meet verification requirements' : null,
      })
      .eq('id', verificationId);

    if (verError) throw verError;

    // 2. Update companion profile
    const isVerified = status === 'verified';
    const { error: compError } = await admin
      .from('companion_profiles')
      .update({
        is_verified: isVerified,
        identity_status: status,
      })
      .eq('id', companionId);

    if (compError) throw compError;

    // 3. Notify companion
    await admin.from('notifications').insert({
      user_id: companionId,
      title: isVerified ? 'ID Verification Approved! 🎉' : 'Verification Update Required',
      body: isVerified
        ? 'Your identity documents have been approved. You are now officially verified to accept companion bookings!'
        : `Your verification submission was rejected: ${rejectionReason || 'Please review and resubmit valid credentials.'}`,
      type: 'verification',
      data: { status, verificationId },
    });

    revalidatePath('/admin/verifications');
    revalidatePath('/admin/companions');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to review verification' };
  }
}

/**
 * Suspend or reactivate any user account
 */
export async function toggleUserStatusAction(userId: string, isActive: boolean) {
  try {
    await assertAdmin();
    const admin = createAdminClient();

    const { error } = await admin
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (error) throw error;

    revalidatePath('/admin/customers');
    revalidatePath('/admin/companions');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update user status' };
  }
}

/**
 * Update companion profile parameters from admin console
 */
export async function updateCompanionSettingsAction(
  companionId: string,
  updates: {
    is_verified?: boolean;
    hourly_rate?: number;
    service_radius_km?: number;
  }
) {
  try {
    await assertAdmin();
    const admin = createAdminClient();

    const { error } = await admin
      .from('companion_profiles')
      .update(updates)
      .eq('id', companionId);

    if (error) throw error;

    revalidatePath('/admin/companions');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update companion' };
  }
}

/**
 * Update activity category details & base rates
 */
export async function updateCategoryAction(
  categoryId: string,
  updates: {
    name?: string;
    description?: string;
    base_rate_per_hour?: number;
    recommended_duration?: string;
    is_active?: boolean;
  }
) {
  try {
    await assertAdmin();
    const admin = createAdminClient();

    const { error } = await admin
      .from('companion_categories')
      .update(updates)
      .eq('id', categoryId);

    if (error) throw error;

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update category' };
  }
}

/**
 * Resolve or triage safety / incident reports
 */
export async function resolveReportAction(
  reportId: string,
  status: 'resolved' | 'dismissed' | 'investigating',
  resolutionNotes?: string
) {
  try {
    const { user } = await assertAdmin();
    const admin = createAdminClient();

    const { error } = await admin
      .from('reports')
      .update({
        status,
        resolved_by: user.id,
        resolution_notes: resolutionNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (error) throw error;

    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update report' };
  }
}

/**
 * Supervise / cancel booking by Admin override
 */
export async function adminCancelBookingAction(bookingId: string, reason: string) {
  try {
    const { user } = await assertAdmin();
    const admin = createAdminClient();

    const { data: booking, error: fetchErr } = await admin
      .from('bookings')
      .select('customer_id, companion_id, status')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) throw new Error('Booking not found');
    const bookingData = booking as any;

    const { error } = await admin
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id,
        cancellation_reason: `Admin cancellation: ${reason}`,
      })
      .eq('id', bookingId);

    if (error) throw error;

    // Notify both customer and companion
    await admin.from('notifications').insert([
      {
        user_id: bookingData.customer_id,
        title: 'Booking Cancelled by Admin',
        body: `Booking ${bookingId.slice(0, 8)} was cancelled by administration: ${reason}`,
        type: 'booking_status',
        data: { bookingId, status: 'cancelled' },
      },
      {
        user_id: bookingData.companion_id,
        title: 'Booking Cancelled by Admin',
        body: `Booking ${bookingId.slice(0, 8)} was cancelled by administration: ${reason}`,
        type: 'booking_status',
        data: { bookingId, status: 'cancelled' },
      },
    ]);

    revalidatePath('/admin/bookings');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to cancel booking' };
  }
}
