'use client';

import * as React from 'react';
import { CustomerHeader } from '@/components/shell/CustomerHeader';
import { BookingCard } from '@/components/booking/BookingCard';
import { Booking } from '@/types/booking';

const CUSTOMER_BOOKINGS_MOCK: Booking[] = [
  {
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
  },
  {
    id: 'bk-completed-1',
    customerId: 'cust-101',
    customerName: 'Sanjay Varma',
    companionId: 'comp-2',
    companionName: 'Karthik Raja',
    companionPhone: '+91 98765 99887',
    categorySlug: 'shopping',
    categoryName: 'Shopping Companion',
    status: 'completed',
    scheduledDate: '2026-11-10',
    scheduledStartTime: '11:00',
    durationHours: 2,
    meetingLocation: {
      address: 'Express Avenue Mall, Central Atrium, Royapettah, Chennai',
      lat: 13.0588,
      lng: 80.2642,
    },
    pricing: {
      hourlyRate: 350,
      subtotal: 700,
      platformFee: 70,
      totalAmount: 770,
      currency: 'INR',
    },
    paymentStatus: 'captured',
    createdAt: '2026-11-09T18:00:00Z',
  },
];

export default function CustomerBookingsPage() {
  const [filter, setFilter] = React.useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const filtered = CUSTOMER_BOOKINGS_MOCK.filter((b) => {
    if (filter === 'active') return b.status === 'companion_arriving' || b.status === 'active' || b.status === 'pending' || b.status === 'confirmed';
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CustomerHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-navy-950 tracking-tight">My Companion Bookings</h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your upcoming sessions, active location tracking, and receipts
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {(['all', 'active', 'completed', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filter === tab
                    ? 'bg-white text-navy-950 shadow-sm'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-slate-500 text-sm">No bookings found for the selected filter.</p>
            </div>
          ) : (
            filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking} userRole="customer" />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

