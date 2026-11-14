'use client';

import * as React from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLiveLocation } from '@/hooks/useLiveLocation';
import { Navigation, Wifi, ShieldCheck, AlertCircle } from 'lucide-react';

export function CompanionBroadcaster({
  bookingId,
  bookingStatus,
}: {
  bookingId: string;
  bookingStatus: string;
}) {
  // Only broadcast if the booking is currently en route or active session
  const shouldBroadcast = bookingStatus === 'companion_arriving' || bookingStatus === 'active';

  const { coordinates, error: geoError } = useGeolocation(shouldBroadcast, 3500);

  const { isConnected } = useLiveLocation({
    bookingId,
    isBroadcasting: shouldBroadcast,
    coordinates,
  });

  if (!shouldBroadcast) {
    return null;
  }

  return (
    <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
          <Navigation className="h-4 w-4 animate-spin" />
        </div>
        <div>
          <span className="font-bold text-purple-950 block">Live GPS Location Sharing Active</span>
          <span className="text-purple-700">
            {isConnected ? 'Broadcasting private GPS breadcrumbs to client' : 'Connecting to secure channel...'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {geoError ? (
          <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" /> GPS Error
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Ping
          </span>
        )}
      </div>
    </div>
  );
}

