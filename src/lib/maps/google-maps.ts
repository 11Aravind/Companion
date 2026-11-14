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

// Premium, modern mobility silver style (Uber/Airbnb inspired)
export const MAP_STYLES_CLEAN: google.maps.MapTypeStyle[] = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#f7f8fa' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#737b89' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }, { weight: 3 }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#20242c' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e8ebf0' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#737b89' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#d5dae3' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#e2eaf4' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#737b89' }],
  },
];
