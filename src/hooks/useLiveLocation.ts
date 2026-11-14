'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { LocationCoordinates } from './useGeolocation';

export interface LiveLocationPayload {
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  timestamp: number;
}

export function useLiveLocation({
  bookingId,
  isBroadcasting = false,
  coordinates,
}: {
  bookingId?: string;
  isBroadcasting?: boolean;
  coordinates?: LocationCoordinates | null;
}) {
  const [supabase] = React.useState(() => createClient());
  const [liveLocation, setLiveLocation] = React.useState<LiveLocationPayload | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  // 1. Subscribe to Supabase Realtime Broadcast Channel
  React.useEffect(() => {
    if (!bookingId) return undefined;

    const channel = supabase.channel(`tracking:${bookingId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on('broadcast', { event: 'location_update' }, ({ payload }) => {
        setLiveLocation(payload as LiveLocationPayload);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [bookingId, supabase]);

  // 2. Broadcaster: Companion sends location updates over the channel
  React.useEffect(() => {
    if (!isBroadcasting || !bookingId || !coordinates || !isConnected) return;

    const payload: LiveLocationPayload = {
      lat: coordinates.lat,
      lng: coordinates.lng,
      heading: coordinates.heading,
      speed: coordinates.speed,
      accuracy: coordinates.accuracy,
      timestamp: Date.now(),
    };

    const channel = supabase.channel(`tracking:${bookingId}`);
    channel.send({
      type: 'broadcast',
      event: 'location_update',
      payload,
    });

    // Also persist breadcrumb to live_locations in Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('live_locations').insert({
          booking_id: bookingId,
          user_id: user.id,
          location: `POINT(${coordinates.lng} ${coordinates.lat})`,
          heading: coordinates.heading || null,
          speed: coordinates.speed || null,
          accuracy: coordinates.accuracy || null,
        });
      }
    });
  }, [coordinates, isBroadcasting, bookingId, isConnected, supabase]);

  return { liveLocation, isConnected };
}

