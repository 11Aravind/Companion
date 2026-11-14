'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Navigation,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CustomerHeader } from '@/components/shell/CustomerHeader';
import { CategoryCard } from '@/components/companions/CategoryCard';
import { CompanionCard } from '@/components/companions/CompanionCard';
import { BookingCard } from '@/components/booking/BookingCard';
import { GoogleMapView } from '@/components/maps/GoogleMapView';
import { ACTIVITY_CATEGORIES, BOOKING_STATUSES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CompanionProfile } from '@/types/companion';
import { Booking } from '@/types/booking';

const ACTIVE_BOOKING_MOCK: Booking = {
  id: 'bk-active-1',
  customerId: 'cust-101',
  customerName: 'Sanjay Varma',
  companionId: 'comp-1',
  companionName: 'Ananya Sharma',
  companionPhone: '+91 98765 00112',
  categorySlug: 'hospital-visit',
  categoryName: 'Hospital Visit Companion',
  status: 'companion_arriving',
  scheduledDate: '2026-11-14',
  scheduledStartTime: '14:30',
  durationHours: 3,
  meetingLocation: {
    address: 'Apollo Hospitals, Main Lobby, Greams Road, Chennai',
    lat: 13.0569,
    lng: 80.2522,
  },
  companionLiveLocation: {
    lat: 13.0585,
    lng: 80.2498,
    heading: 120,
    updatedAt: new Date().toISOString(),
  },
  pricing: {
    hourlyRate: 450,
    subtotal: 1350,
    platformFee: 150,
    totalAmount: 1500,
    currency: 'INR',
  },
  paymentStatus: 'captured',
  verificationOtp: '8492',
  createdAt: '2026-11-14T07:15:00Z',
};

const NEARBY_COMPANIONS_MOCK: CompanionProfile[] = [
  {
    id: 'comp-1',
    userId: 'u-1',
    fullName: 'Ananya Sharma',
    headline: 'Healthcare Assistant & Patient Support Specialist',
    bio: 'Compassionate, trained nursing graduate available for hospital checkup queues, clinic visits, medicine collection, and patient reassurance.',
    city: 'Chennai',
    serviceRadiusKm: 25,
    hourlyRate: 450,
    languages: ['English', 'Tamil', 'Hindi'],
    categories: ['hospital-visit', 'general-companion'],
    isOnline: true,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 4.9,
    ratingCount: 38,
    completedBookings: 52,
    currentLocation: {
      lat: 13.0585,
      lng: 80.2498,
      address: 'Near Thousand Lights',
      updatedAt: '2026-11-14T10:00:00Z',
    },
  },
  {
    id: 'comp-2',
    userId: 'u-2',
    fullName: 'Karthik Raja',
    headline: 'Personal Shopper & Gadget Sourcing Companion',
    bio: 'Specialist for electronic shopping, mall visits, gadget testing, and carrying assistance across T Nagar and Phoenix Marketcity.',
    city: 'Chennai',
    serviceRadiusKm: 20,
    hourlyRate: 350,
    languages: ['English', 'Tamil'],
    categories: ['shopping', 'events-social'],
    isOnline: true,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 4.9,
    ratingCount: 27,
    completedBookings: 39,
    currentLocation: {
      lat: 13.0418,
      lng: 80.2341,
      address: 'T Nagar',
      updatedAt: '2026-11-14T10:00:00Z',
    },
  },
  {
    id: 'comp-4',
    userId: 'u-4',
    fullName: 'Venkatesh Prasad',
    headline: 'Senior Citizen Support & Friendly Stroll Companion',
    bio: 'Patient, attentive companion specializing in morning walks, library trips, bank errands, and engaging nostalgic discussions.',
    city: 'Chennai',
    serviceRadiusKm: 18,
    hourlyRate: 250,
    languages: ['Tamil', 'Telugu', 'English'],
    categories: ['general-companion', 'hospital-visit'],
    isOnline: true,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 5.0,
    ratingCount: 19,
    completedBookings: 28,
    currentLocation: {
      lat: 13.0620,
      lng: 80.2610,
      address: 'Nungambakkam',
      updatedAt: '2026-11-14T10:00:00Z',
    },
  },
];

export default function CustomerDashboardPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCompanion, setSelectedCompanion] = React.useState<CompanionProfile | null>(null);

  const userCenter = { lat: 13.0569, lng: 80.2522 };

  const filteredCompanions = NEARBY_COMPANIONS_MOCK.filter((comp) => {
    if (selectedCategory !== 'all' && !comp.categories.includes(selectedCategory)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = comp.fullName.toLowerCase().includes(q);
      const matchBio = comp.bio.toLowerCase().includes(q);
      const matchLang = comp.languages.some((l) => l.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchLang) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-charcoal">
      <CustomerHeader userAddress="Greams Road, Thousand Lights, Chennai" />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 max-w-7xl space-y-8">
        {/* Active Session Live Alert Banner (if any session is active/en route) */}
        {ACTIVE_BOOKING_MOCK && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  Active Booking in Progress
                </h2>
              </div>
              <Link href="/bookings" className="text-xs font-bold text-navy-900 hover:underline">
                View all bookings
              </Link>
            </div>

            <BookingCard booking={ACTIVE_BOOKING_MOCK} userRole="customer" />
          </section>
        )}

        {/* Hero Interactive Google Map View (Uber + Airbnb Inspired Mobility Centerpiece) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-900 tracking-tight">Real-Time Companion Discovery</h2>
              <p className="text-xs text-charcoal-muted">
                Locate verified companions currently online in your immediate radius
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-charcoal-muted">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-charcoal-border">
                <span className="h-2 w-2 rounded-full bg-[#2583E8]" /> Your Location
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-charcoal-border">
                <span className="h-2 w-2 rounded-full bg-accent" /> Available Companion
              </span>
            </div>
          </div>

          <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-charcoal-border shadow-card bg-white">
            <GoogleMapView
              center={userCenter}
              zoom={14}
              userLocation={userCenter}
              companions={filteredCompanions}
              activeCompanionLocation={ACTIVE_BOOKING_MOCK?.companionLiveLocation}
              meetingLocation={ACTIVE_BOOKING_MOCK?.meetingLocation}
              showRoute={true}
              onCompanionClick={(c) => setSelectedCompanion(c)}
              className="h-full w-full"
            />

            {/* Floating Quick Search Bar Over Map (Uber style) */}
            <div className="absolute top-4 left-4 right-4 sm:left-6 sm:w-96 z-10">
              <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-charcoal-border shadow-floating">
                <Input
                  placeholder="Where do you need a companion?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4 text-navy-900" />}
                  className="h-10 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs"
                />
              </div>
            </div>

            {/* Floating Companion Quick Card when tapped on map */}
            {selectedCompanion && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-10 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white p-4 rounded-2xl border border-charcoal-border shadow-floating">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-navy-900 text-sm">{selectedCompanion.fullName}</h4>
                      <p className="text-xs text-charcoal-muted truncate max-w-[180px]">{selectedCompanion.headline}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCompanion(null)}
                      className="text-xs text-charcoal-muted hover:text-navy-900 font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-charcoal-border flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900">₹{selectedCompanion.hourlyRate}/hr</span>
                    <Link href={`/companions/${selectedCompanion.id}`}>
                      <Button size="sm" className="h-8 text-xs font-bold bg-navy-900 text-white">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Activity Category Filters (Pills) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-navy-900">Explore by Category</h3>
            <Link href="/companions" className="text-xs font-bold text-navy-900 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 text-white border-navy-900 shadow-subtle'
                  : 'bg-white text-charcoal border-charcoal-border hover:bg-navy-50'
              }`}
            >
              All Activities
            </button>
            {ACTIVITY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  selectedCategory === cat.slug
                    ? 'bg-navy-900 text-white border-navy-900 shadow-subtle'
                    : 'bg-white text-charcoal border-charcoal-border hover:bg-navy-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Available Nearby Companions List (Airbnb Card Presentation) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-navy-900">Available Companions Nearby</h3>
              <p className="text-xs text-charcoal-muted">Biometrically verified and active for bookings</p>
            </div>
            <span className="text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full border border-accent/20">
              Live within 25 km
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanions.map((comp) => (
              <CompanionCard key={comp.id} companion={comp} />
            ))}
          </div>
        </section>

        {/* Service Activity Tiles */}
        <section className="space-y-4 pt-4 border-t border-charcoal-border">
          <div>
            <h3 className="text-base font-bold text-navy-900">Curated Companion Services</h3>
            <p className="text-xs text-charcoal-muted">Book specialized assistance for your exact requirements</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTIVITY_CATEGORIES.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
