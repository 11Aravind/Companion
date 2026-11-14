'use client';

import * as React from 'react';
import { loadGoogleMaps } from '@/lib/maps/google-maps';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface PlaceResult {
  address: string;
  lat: number;
  lng: number;
  name?: string;
}

export interface PlaceAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectPlace: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export function PlaceAutocomplete({
  value,
  onChangeText,
  onSelectPlace,
  placeholder = 'Search meeting location or landmark...',
  className = '',
}: PlaceAutocompleteProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    loadGoogleMaps()
      .then((googleMaps) => {
        if (!isMounted || !inputRef.current || !googleMaps.maps.places) return;

        const autocomplete = new googleMaps.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'name'],
          types: ['establishment', 'geocode'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry?.location) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || '';

          onSelectPlace({
            address,
            lat,
            lng,
            name: place.name,
          });
        });

        autocompleteRef.current = autocomplete;
      })
      .catch(() => {
        // Fallback: normal text entry allowed if API key is pending
      });

    return () => {
      isMounted = false;
    };
  }, [onSelectPlace]);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
      icon={<MapPin className="h-4 w-4 text-emerald-600" />}
      className={className}
    />
  );
}

