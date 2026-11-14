'use client';

import * as React from 'react';
import { loadGoogleMaps, DEFAULT_MAP_CENTER, MAP_STYLES_CLEAN } from '@/lib/maps/google-maps';
import { animateMarkerTo } from '@/lib/maps/marker-animation';
import { CompanionProfile } from '@/types/companion';
import { Loader2, AlertCircle } from 'lucide-react';

export interface GoogleMapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
  meetingLocation?: { lat: number; lng: number; address?: string } | null;
  companions?: CompanionProfile[];
  activeCompanionLocation?: { lat: number; lng: number; heading?: number } | null;
  onCompanionClick?: (companion: CompanionProfile) => void;
  showRoute?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function GoogleMapView({
  center = DEFAULT_MAP_CENTER,
  zoom = 13,
  userLocation,
  meetingLocation,
  companions = [],
  activeCompanionLocation,
  onCompanionClick,
  showRoute = false,
  className = '',
  style,
}: GoogleMapViewProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
  const userMarkerRef = React.useRef<google.maps.Marker | null>(null);
  const meetingMarkerRef = React.useRef<google.maps.Marker | null>(null);
  const activeCompanionMarkerRef = React.useRef<google.maps.Marker | null>(null);
  const companionMarkersMapRef = React.useRef<Map<string, google.maps.Marker>>(new Map());
  const directionsRendererRef = React.useRef<google.maps.DirectionsRenderer | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // 1. Initialize Map with Clean Mobility Silver Style
  React.useEffect(() => {
    let isMounted = true;

    loadGoogleMaps()
      .then((googleMaps) => {
        if (!isMounted || !mapContainerRef.current) return;

        const map = new googleMaps.maps.Map(mapContainerRef.current, {
          center,
          zoom,
          styles: MAP_STYLES_CLEAN,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = map;
        setIsLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError(err.message || 'Failed to load Google Maps SDK');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      mapInstanceRef.current = null;
    };
  }, []); // Run once

  // 2. Sync User Location Marker (Map Accent Blue #2583E8)
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    if (!userLocation) {
      userMarkerRef.current?.setMap(null);
      userMarkerRef.current = null;
      return;
    }

    const pos = new google.maps.LatLng(userLocation.lat, userLocation.lng);

    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        position: pos,
        map,
        title: 'Your Current Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2583E8', // Map Accent
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
      });
    } else {
      userMarkerRef.current.setPosition(pos);
    }
  }, [userLocation]);

  // 3. Sync Meeting Location Marker (Deep Navy #14213D)
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    if (!meetingLocation) {
      meetingMarkerRef.current?.setMap(null);
      meetingMarkerRef.current = null;
      return;
    }

    const pos = new google.maps.LatLng(meetingLocation.lat, meetingLocation.lng);

    if (!meetingMarkerRef.current) {
      meetingMarkerRef.current = new google.maps.Marker({
        position: pos,
        map,
        title: meetingLocation.address || 'Meeting Location',
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#14213D', // Deep Navy Primary
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });
    } else {
      meetingMarkerRef.current.setPosition(pos);
    }
  }, [meetingLocation]);

  // 4. Sync Active Companion Moving Marker (Fresh Green #16A36A)
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    if (!activeCompanionLocation) {
      activeCompanionMarkerRef.current?.setMap(null);
      activeCompanionMarkerRef.current = null;
      return;
    }

    if (!activeCompanionMarkerRef.current) {
      activeCompanionMarkerRef.current = new google.maps.Marker({
        position: new google.maps.LatLng(activeCompanionLocation.lat, activeCompanionLocation.lng),
        map,
        title: 'Companion Live Location',
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#16A36A', // Fresh Green Accent
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2.5,
          rotation: activeCompanionLocation.heading || 0,
        },
      });
    } else {
      animateMarkerTo(
        activeCompanionMarkerRef.current,
        activeCompanionLocation.lat,
        activeCompanionLocation.lng,
        900
      );
    }
  }, [activeCompanionLocation]);

  // 5. Sync Nearby Companions
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    const currentMarkers = companionMarkersMapRef.current;
    const activeIds = new Set(companions.map((c) => c.id));

    currentMarkers.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.setMap(null);
        currentMarkers.delete(id);
      }
    });

    companions.forEach((comp) => {
      const lat = comp.currentLocation?.lat || center.lat + (Math.random() - 0.5) * 0.04;
      const lng = comp.currentLocation?.lng || center.lng + (Math.random() - 0.5) * 0.04;

      if (!currentMarkers.has(comp.id)) {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map,
          title: comp.fullName,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#14213D', // Deep Navy
            fillOpacity: 1,
            strokeColor: '#16A36A', // Fresh Green rim
            strokeWeight: 2.5,
          },
        });

        marker.addListener('click', () => {
          onCompanionClick?.(comp);
        });

        currentMarkers.set(comp.id, marker);
      }
    });
  }, [companions, center, onCompanionClick]);

  // 6. Draw Directions Route (Map Accent Blue #2583E8)
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google || !showRoute) {
      directionsRendererRef.current?.setMap(null);
      return;
    }

    const origin = activeCompanionLocation || userLocation;
    const dest = meetingLocation;

    if (!origin || !dest) return;

    const directionsService = new google.maps.DirectionsService();

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#2583E8', // Map Accent
          strokeWeight: 5,
          strokeOpacity: 0.9,
        },
      });
    }

    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(dest.lat, dest.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current?.setDirections(result);
        }
      }
    );
  }, [showRoute, activeCompanionLocation, userLocation, meetingLocation]);

  // 7. Auto-fit bounds
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google) return;

    const bounds = new google.maps.LatLngBounds();
    let pointCount = 0;

    if (userLocation) {
      bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
      pointCount++;
    }
    if (meetingLocation) {
      bounds.extend(new google.maps.LatLng(meetingLocation.lat, meetingLocation.lng));
      pointCount++;
    }
    if (activeCompanionLocation) {
      bounds.extend(new google.maps.LatLng(activeCompanionLocation.lat, activeCompanionLocation.lng));
      pointCount++;
    }

    if (pointCount >= 2) {
      map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
    }
  }, [userLocation, meetingLocation, activeCompanionLocation]);

  if (loadError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-charcoal-border text-center text-charcoal shadow-subtle ${className}`}
        style={{ minHeight: 350, ...style }}
      >
        <AlertCircle className="h-8 w-8 text-[#2583E8] mb-2" />
        <h4 className="font-bold text-sm text-navy-900">Google Maps Platform Configuration</h4>
        <p className="text-xs text-charcoal-muted max-w-sm mt-1">
          Add <code className="font-mono text-navy-900 bg-navy-50 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to activate live tiles, Places search, and GPS tracking.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden border border-charcoal-border ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center z-10 text-charcoal-muted">
          <Loader2 className="h-6 w-6 animate-spin text-navy-900 mb-2" />
          <span className="text-xs font-semibold text-navy-900">Loading interactive map...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />
    </div>
  );
}
