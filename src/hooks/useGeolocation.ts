'use client';

import * as React from 'react';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
}

export function useGeolocation(enableTracking = false, intervalMs = 3500) {
  const [coordinates, setCoordinates] = React.useState<LocationCoordinates | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const lastUpdateRef = React.useRef(0);

  const getCurrentFix = React.useCallback((): Promise<LocationCoordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('Geolocation is not supported by your browser');
        setError(err.message);
        return reject(err);
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: LocationCoordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            accuracy: pos.coords.accuracy,
          };
          setCoordinates(loc);
          setIsLoading(false);
          resolve(loc);
        },
        (err) => {
          let msg = 'Failed to detect location';
          if (err.code === 1) msg = 'Location access permission was denied';
          else if (err.code === 2) msg = 'Position unavailable';
          else if (err.code === 3) msg = 'Location request timed out';
          setError(msg);
          setIsLoading(false);
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      );
    });
  }, []);

  // Initial single fix
  React.useEffect(() => {
    getCurrentFix().catch(() => {});
  }, [getCurrentFix]);

  // Continuous watch when tracking is active
  React.useEffect(() => {
    if (!enableTracking || !navigator.geolocation) return undefined;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        if (now - lastUpdateRef.current >= intervalMs) {
          lastUpdateRef.current = now;
          setCoordinates({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            accuracy: pos.coords.accuracy,
          });
        }
      },
      (err) => {
        console.warn('[useGeolocation] Watch error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enableTracking, intervalMs]);

  return { coordinates, error, isLoading, getCurrentFix };
}

