'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Navigation,
  KeyRound,
} from 'lucide-react';
import { CompanionHeader } from '@/components/shell/CompanionHeader';
import { BookingCard } from '@/components/booking/BookingCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Booking } from '@/types/booking';
import { formatCurrency } from '@/lib/utils';

const PENDING_OFFER_MOCK: Booking = {
  id: 'bk-offer-99',
  customerId: 'cust-404',
  customerName: 'Meera Nambiar',
  companionId: 'comp-101',
  companionName: 'Ananya Sharma',
  categorySlug: 'shopping',
  categoryName: 'Shopping Companion',
  status: 'pending',
  scheduledDate: '2026-11-15',
  scheduledStartTime: '15:00',
  durationHours: 3,
  meetingLocation: {
    address: 'Phoenix Marketcity, Main Entrance, Velachery, Chennai',
    lat: 12.9916,
    lng: 80.2173,
    notes: 'Need assistance carrying designer apparel & wardrobe styling input',
  },
  pricing: {
    hourlyRate: 450,
    subtotal: 1350,
    platformFee: 135,
    totalAmount: 1485,
    currency: 'INR',
  },
  paymentStatus: 'captured',
  createdAt: new Date().toISOString(),
};

export default function CompanionDashboardPage() {
  const [isOnline, setIsOnline] = React.useState(true);
  const [offer, setOffer] = React.useState<Booking | null>(PENDING_OFFER_MOCK);
  const [otpInput, setOtpInput] = React.useState('');
  const [otpError, setOtpError] = React.useState(false);

  const handleAccept = () => {
    if (offer) {
      setOffer({ ...offer, status: 'companion_arriving' });
    }
  };

  const handleDecline = () => {
    setOffer(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CompanionHeader isOnline={isOnline} onToggleOnline={setIsOnline} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-6xl">
        {/* Companion Partner KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Earnings</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-navy-950">{formatCurrency(1350)}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +18% vs avg
              </span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Sessions</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-navy-950">52</span>
              <span className="text-xs font-semibold text-primary-600">100% attendance</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Partner Rating</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-amber-600">4.9 ★</span>
              <span className="text-xs text-slate-500">38 reviews</span>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">ID Verification</span>
            <div className="flex items-center gap-1.5 mt-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">Aadhaar Verified</span>
            </div>
          </Card>
        </div>

        {/* Incoming / Active Request Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-navy-950">Active Requests & Bookings</h2>
              <p className="text-xs text-slate-500">Respond promptly to customer appointment requests</p>
            </div>
            {isOnline ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Listening for requests
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                Offline — Turn online above to receive requests
              </span>
            )}
          </div>

          {offer ? (
            <div className="space-y-4">
              <BookingCard
                booking={offer}
                userRole="companion"
                onAccept={handleAccept}
                onReject={handleDecline}
              />

              {/* Start Session OTP Box when Arrived */}
              {offer.status === 'companion_arriving' && (
                <Card className="rounded-2xl border-2 border-primary-500 bg-primary-50/50 p-6">
                  <div className="max-w-md mx-auto text-center space-y-3">
                    <KeyRound className="h-8 w-8 text-primary-600 mx-auto" />
                    <h3 className="font-bold text-navy-950 text-base">Enter Customer Verification PIN</h3>
                    <p className="text-xs text-slate-600">
                      Ask the customer for their 4-digit PIN when you meet them in person to start the session.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Input
                        type="text"
                        maxLength={4}
                        placeholder="••••"
                        value={otpInput}
                        onChange={(e) => {
                          setOtpInput(e.target.value);
                          setOtpError(false);
                        }}
                        className="w-32 text-center text-xl font-black tracking-widest bg-white h-12"
                      />
                      <Button
                        onClick={() => {
                          if (otpInput.length === 4) {
                            setOffer({ ...offer, status: 'active' });
                          } else {
                            setOtpError(true);
                          }
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold h-12 px-6 rounded-xl"
                      >
                        Start Session
                      </Button>
                    </div>
                    {otpError && <p className="text-xs text-rose-600 font-semibold">Please enter a valid 4-digit PIN</p>}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm">
              <HeartHandshake className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-navy-950">No active pending requests</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Keep your status set to "Online & Available" to receive notifications when customers book in your city.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

