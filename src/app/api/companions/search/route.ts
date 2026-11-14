import { NextRequest, NextResponse } from 'next/server';
import { searchCompanions } from '@/lib/services/companion-matcher';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const categorySlug = searchParams.get('category') || undefined;
  const city = searchParams.get('city') || undefined;
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
  const date = searchParams.get('date') || undefined;
  const startTime = searchParams.get('startTime') || undefined;
  const durationHours = searchParams.get('durationHours')
    ? parseInt(searchParams.get('durationHours')!, 10)
    : undefined;
  const maxHourlyRate = searchParams.get('maxHourlyRate')
    ? parseFloat(searchParams.get('maxHourlyRate')!)
    : undefined;

  try {
    const companions = await searchCompanions({
      categorySlug,
      city,
      lat,
      lng,
      date,
      startTime,
      durationHours,
      maxHourlyRate,
    });

    return NextResponse.json({ success: true, count: companions.length, companions });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Search failed' },
      { status: 500 }
    );
  }
}

