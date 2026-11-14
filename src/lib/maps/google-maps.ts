import { Loader } from '@googlemaps/js-api-loader';

let loaderInstance: Loader | null = null;
let googleMapsPromise: Promise<typeof google> | null = null;

export function getGoogleMapsLoader(): Loader {
  if (!loaderInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    loaderInstance = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });
  }
  return loaderInstance;
}

export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps can only be loaded in browser'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (!googleMapsPromise) {
    const loader = getGoogleMapsLoader();
    googleMapsPromise = loader.load();
  }

  return googleMapsPromise;
}

export const DEFAULT_MAP_CENTER = {
  lat: 13.0569, // Chennai (Default)
  lng: 80.2522,
};

export const MAP_STYLES_CLEAN = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];

