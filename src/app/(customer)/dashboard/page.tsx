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
} from 'lucide-react';
import { CustomerHeader } from '@/components/shell/CustomerHeader';
import { CategoryCard } from '@/components/companions/CategoryCard';
import { CompanionCard } from '@/components/companions/CompanionCard';
import { BookingCard } from '@/components/booking/BookingCard';
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
  },
];

export default function CustomerDashboardPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CustomerHeader userAddress="Greams Road, Thousand Lights, Chennai" />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-7xl">
        {/* Active Booking Live Banner if active */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy-950">Active Session</h2>
            </div>
            <Link href="/bookings" className="text-xs font-semibold text-primary-600 hover:underline">
              All bookings
            </Link>
          </div>

          <BookingCard booking={ACTIVE_BOOKING_MOCK} userRole="customer" />
        </section>

        {/* Companion Search & Activity Filter Bar */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex-1">
              <Input
                placeholder="Search companions by name, skill, or language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="h-11 border-slate-200"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Activities
              </button>
              {ACTIVITY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === cat.slug
                      ? 'bg-navy-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby Available Companions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-navy-950">Available Companions Nearby</h3>
              <p className="text-xs text-slate-500">Verified and ready for immediate or scheduled booking</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Live GPS Filter: 25 km
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {NEARBY_COMPANIONS_MOCK.map((comp) => (
              <CompanionCard key={comp.id} companion={comp} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

