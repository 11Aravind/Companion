export interface CompanionProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  headline: string;
  bio: string;
  city: string;
  serviceRadiusKm: number;
  hourlyRate: number;
  languages: string[];
  categories: string[]; // Category slugs
  isOnline: boolean;
  isVerified: boolean;
  identityStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  ratingAverage: number;
  ratingCount: number;
  completedBookings: number;
  currentLocation?: {
    lat: number;
    lng: number;
    address?: string;
    updatedAt: string;
  };
  availability?: CompanionAvailabilitySlot[];
}

export interface CompanionAvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  isActive: boolean;
}

