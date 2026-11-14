export interface ActivityCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  recommendedDuration: string;
  baseRatePerHour: number;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: 'cat-shopping',
    slug: 'shopping',
    name: 'Shopping Companion',
    description: 'Personal shopping assistant, styling guidance, mall visits, and carrying assistance.',
    icon: 'ShoppingBag',
    recommendedDuration: '2 - 4 hours',
    baseRatePerHour: 350,
  },
  {
    id: 'cat-hospital',
    slug: 'hospital-visit',
    name: 'Hospital Visit Companion',
    description: 'Supportive, patient assistance for medical appointments, checkups, pharmacy, and clinic queues.',
    icon: 'HeartHandshake',
    recommendedDuration: '3 - 6 hours',
    baseRatePerHour: 400,
  },
  {
    id: 'cat-restaurant',
    slug: 'restaurant-dining',
    name: 'Restaurant & Dining',
    description: 'Polite company for lunch, dinner dates, coffee chats, food tasting, or networking meals.',
    icon: 'UtensilsCrossed',
    recommendedDuration: '2 - 3 hours',
    baseRatePerHour: 300,
  },
  {
    id: 'cat-salon',
    slug: 'salon-spa',
    name: 'Salon & Wellness',
    description: 'Relaxing company for spa sessions, salon visits, makeover days, and wellness routines.',
    icon: 'Sparkles',
    recommendedDuration: '2 - 4 hours',
    baseRatePerHour: 350,
  },
  {
    id: 'cat-travel',
    slug: 'travel-city-tour',
    name: 'Travel & City Guide',
    description: 'Local companion to explore landmarks, new cities, transit navigation, and hidden gems.',
    icon: 'Compass',
    recommendedDuration: '4 - 8 hours',
    baseRatePerHour: 450,
  },
  {
    id: 'cat-event',
    slug: 'events-social',
    name: 'Events & Social Gatherings',
    description: 'Accompany you to weddings, conferences, exhibitions, galas, concerts, or movies.',
    icon: 'Ticket',
    recommendedDuration: '3 - 5 hours',
    baseRatePerHour: 500,
  },
  {
    id: 'cat-general',
    slug: 'general-companion',
    name: 'General Personal Companion',
    description: 'Everyday friendly presence for casual walks, library sessions, errands, or friendly chats.',
    icon: 'Users',
    recommendedDuration: '1 - 3 hours',
    baseRatePerHour: 250,
  },
];

export const COMPANION_CATEGORIES = ACTIVITY_CATEGORIES;

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CONFIRMED: 'confirmed',
  COMPANION_ARRIVING: 'companion_arriving',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];

export const STATUS_LABELS: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending Review', color: 'text-amber-800', bg: 'bg-amber-100' },
  accepted: { label: 'Accepted by Companion', color: 'text-blue-800', bg: 'bg-blue-100' },
  rejected: { label: 'Declined', color: 'text-rose-800', bg: 'bg-rose-100' },
  confirmed: { label: 'Confirmed & Scheduled', color: 'text-indigo-800', bg: 'bg-indigo-100' },
  companion_arriving: { label: 'Companion En Route', color: 'text-purple-800', bg: 'bg-purple-100' },
  active: { label: 'Companion In Session', color: 'text-emerald-800', bg: 'bg-emerald-100' },
  completed: { label: 'Completed', color: 'text-slate-800', bg: 'bg-slate-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-800', bg: 'bg-red-100' },
};

