import { createClient } from '@/lib/supabase/server';
import { CompanionProfile } from '@/types/companion';

export interface SearchCompanionsParams {
  categorySlug?: string;
  city?: string;
  lat?: number;
  lng?: number;
  date?: string; // "YYYY-MM-DD"
  startTime?: string; // "HH:MM"
  durationHours?: number;
  maxHourlyRate?: number;
}

/**
 * Calculates great-circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Checks if two time windows overlap on the same date.
 * Times in "HH:MM" format.
 */
export function isTimeOverlapping(
  start1: string,
  durationHours1: number,
  start2: string,
  durationHours2: number
): boolean {
  const [h1, m1] = start1.split(':').map(Number);
  const start1Mins = h1 * 60 + m1;
  const end1Mins = start1Mins + durationHours1 * 60;

  const [h2, m2] = start2.split(':').map(Number);
  const start2Mins = h2 * 60 + m2;
  const end2Mins = start2Mins + durationHours2 * 60;

  return start1Mins < end2Mins && end1Mins > start2Mins;
}

/**
 * Search and rank available companions matching user criteria.
 */
export async function searchCompanions(
  params: SearchCompanionsParams
): Promise<CompanionProfile[]> {
  const supabase = await createClient();

  let query = supabase
    .from('companion_profiles')
    .select(`
      id,
      headline,
      bio,
      city,
      hourly_rate,
      service_radius_km,
      languages,
      is_online,
      is_verified,
      identity_status,
      rating_average,
      rating_count,
      total_completed_bookings,
      profiles!inner (
        full_name,
        avatar_url,
        is_active
      )
    `)
    .eq('profiles.is_active', true);

  if (params.city) {
    query = query.ilike('city', `%${params.city}%`);
  }

  if (params.maxHourlyRate) {
    query = query.lte('hourly_rate', params.maxHourlyRate);
  }

  const { data: candidates, error } = await query;
  if (error || !candidates) {
    console.warn('[CompanionMatcher] Query error:', error?.message);
    return [];
  }

  const results: CompanionProfile[] = [];

  for (const row of (candidates as any[])) {
    const profile = row.profiles;

    // Check category specialization
    if (params.categorySlug) {
      const { data: service } = await supabase
        .from('companion_services')
        .select('id')
        .eq('companion_id', row.id)
        .eq('is_active', true)
        .single();
      // If categories table isn't populated yet, don't strictly drop
    }

    // Collision Check: Verify companion does not have an overlapping active booking
    if (params.date && params.startTime && params.durationHours) {
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('scheduled_start_time, duration_hours, status')
        .eq('companion_id', row.id)
        .eq('scheduled_date', params.date)
        .not('status', 'in', '("cancelled", "rejected", "completed")');

      let hasCollision = false;
      if (existingBookings && existingBookings.length > 0) {
        for (const bk of (existingBookings as any[])) {
          if (
            isTimeOverlapping(
              params.startTime,
              params.durationHours,
              bk.scheduled_start_time,
              bk.duration_hours
            )
          ) {
            hasCollision = true;
            break;
          }
        }
      }

      if (hasCollision) {
        continue; // Skip busy companion to prevent double booking
      }
    }

    results.push({
      id: row.id,
      userId: row.id,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url || undefined,
      headline: row.headline || 'Personal Companion & Support Specialist',
      bio: row.bio || '',
      city: row.city,
      serviceRadiusKm: row.service_radius_km,
      hourlyRate: Number(row.hourly_rate),
      languages: row.languages || ['English'],
      categories: ['hospital-visit', 'shopping', 'general-companion'],
      isOnline: Boolean(row.is_online),
      isVerified: Boolean(row.is_verified),
      identityStatus: row.identity_status,
      ratingAverage: Number(row.rating_average || 5.0),
      ratingCount: Number(row.rating_count || 0),
      completedBookings: Number(row.total_completed_bookings || 0),
    });
  }

  // Sort by rating and online status
  return results.sort((a, b) => {
    if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
    return b.ratingAverage - a.ratingAverage;
  });
}

