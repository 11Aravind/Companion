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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-charcoal">
      <CompanionHeader isOnline={isOnline} onToggleOnline={setIsOnline} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 max-w-6xl">
        {/* Companion Partner KPI Row (Stripe simplicity) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="rounded-3xl border border-charcoal-border bg-white p-5 shadow-subtle">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Today's Earnings</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-navy-900">{formatCurrency(1350)}</span>
              <span className="text-xs font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-full border border-accent/20">
                +18% vs avg
              </span>
            </div>
          </Card>

          <Card className="rounded-3xl border border-charcoal-border bg-white p-5 shadow-subtle">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Completed Sessions</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-navy-900">52</span>
              <span className="text-xs font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded-full border border-charcoal-border">100% attendance</span>
            </div>
          </Card>

          <Card className="rounded-3xl border border-charcoal-border bg-white p-5 shadow-subtle">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Client Rating</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-navy-900">4.9 ★</span>
              <span className="text-xs text-charcoal-muted">38 reviews</span>
            </div>
          </Card>

          <Card className="rounded-3xl border border-charcoal-border bg-white p-5 shadow-subtle">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">ID Verification</span>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span className="text-sm font-bold text-navy-900">Aadhaar Verified</span>
            </div>
          </Card>
        </div>

        {/* Incoming / Active Request Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Active Requests & Bookings</h2>
              <p className="text-xs text-charcoal-muted">Respond promptly to customer appointment requests</p>
            </div>
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full border border-accent/30">
                <span className="h-2 w-2 rounded-full bg-accent animate-ping" /> Listening for bookings
              </span>
            ) : (
              <span className="text-xs font-semibold text-charcoal-muted bg-white border border-charcoal-border px-3 py-1 rounded-full">
                Offline — Switch to Available above to receive requests
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
                <Card className="rounded-3xl border border-charcoal-border bg-white p-6 shadow-card">
                  <div className="max-w-md mx-auto text-center space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center mx-auto shadow-subtle">
                      <KeyRound className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-bold text-navy-900 text-base">Enter Customer Verification PIN</h3>
                    <p className="text-xs text-charcoal-muted">
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
                        className="w-32 text-center text-xl font-black tracking-widest bg-navy-50 h-12 border-charcoal-border"
                      />
                      <Button
                        onClick={() => {
                          if (otpInput.length === 4) {
                            setOffer({ ...offer, status: 'active' });
                          } else {
                            setOtpError(true);
                          }
                        }}
                        className="bg-navy-900 hover:bg-navy-800 text-white font-bold h-12 px-6 rounded-xl shadow-subtle"
                      >
                        Start Session
                      </Button>
                    </div>
                    {otpError && <p className="text-xs text-rose-600 font-bold">Please enter a valid 4-digit PIN</p>}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-charcoal-border p-8 shadow-subtle">
              <HeartHandshake className="h-10 w-10 text-charcoal-muted mx-auto mb-2 opacity-60" />
              <p className="text-sm font-bold text-navy-900">No active pending requests</p>
              <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
                Keep your status set to "Available Now" to receive notifications when customers book in your city.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
