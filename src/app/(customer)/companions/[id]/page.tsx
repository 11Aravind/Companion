'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CustomerHeader } from '@/components/shell/CustomerHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  Languages,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  MessageCircle,
  PhoneCall,
  Lock,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ACTIVITY_CATEGORIES } from '@/lib/constants';

export default function CompanionProfileDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('hospital-visit');
  const [bookingDate, setBookingDate] = React.useState('2026-11-16');
  const [bookingTime, setBookingTime] = React.useState('10:00');
  const [durationHours, setDurationHours] = React.useState(3);
  const [meetingAddress, setMeetingAddress] = React.useState(
    'Apollo Hospitals, Greams Road, Thousand Lights, Chennai'
  );
  const [bookingNotes, setBookingNotes] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bookingConfirmed, setBookingConfirmed] = React.useState(false);

  // Companion Mock Data
  const companion = {
    id: params.id as string,
    fullName: 'Ananya Sharma',
    headline: 'Healthcare Assistant & Senior Patient Support Specialist',
    bio: 'Graduated in Nursing with 4 years of hospital environment experience. I specialize in assisting patients and senior citizens through long outpatient queues, diagnostic appointments, pharmacy collections, and providing calm, attentive reassurance. Fluent in English, Tamil, and Hindi.',
    city: 'Chennai',
    serviceRadiusKm: 25,
    hourlyRate: 450,
    languages: ['English', 'Tamil', 'Hindi'],
    categories: ['hospital-visit', 'general-companion', 'shopping'],
    isOnline: true,
    isVerified: true,
    ratingAverage: 4.9,
    ratingCount: 38,
    completedBookings: 52,
    weeklySchedule: [
      { day: 'Monday', hours: '09:00 AM – 06:00 PM', available: true },
      { day: 'Tuesday', hours: '09:00 AM – 06:00 PM', available: true },
      { day: 'Wednesday', hours: '09:00 AM – 06:00 PM', available: true },
      { day: 'Thursday', hours: '09:00 AM – 06:00 PM', available: true },
      { day: 'Friday', hours: '09:00 AM – 06:00 PM', available: true },
      { day: 'Saturday', hours: '10:00 AM – 04:00 PM', available: true },
      { day: 'Sunday', hours: 'Offline', available: false },
    ],
    reviews: [
      {
        id: 'r1',
        customerName: 'Meenakshi Sundaram',
        rating: 5,
        date: '2 weeks ago',
        comment:
          'Ananya was incredibly patient with my elderly mother at Apollo Hospitals. She navigated the queue and wheelchairs seamlessly. Truly priceless support.',
      },
      {
        id: 'r2',
        customerName: 'Kavita Menon',
        rating: 5,
        date: '1 month ago',
        comment:
          'Very professional and punctual. Made a stressful hospital visit completely calm and organized.',
      },
    ],
  };

  const currentCategory = ACTIVITY_CATEGORIES.find((c) => c.slug === selectedCategory);
  const subtotal = companion.hourlyRate * durationHours;
  const platformFee = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + platformFee;

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
      setTimeout(() => {
        setIsBookingOpen(false);
        router.push('/bookings');
      }, 1500);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CustomerHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-5xl space-y-6">
        {/* Profile Card Header */}
        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-2xl font-black text-navy-900 shrink-0">
                  {companion.fullName.charAt(0)}
                </div>
                {companion.isOnline && (
                  <span
                    className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
                    title="Online & Ready for Bookings"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-navy-950 tracking-tight">{companion.fullName}</h1>
                  {companion.isVerified && (
                    <Badge variant="success" className="text-xs gap-1 py-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> ID Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{companion.headline}</p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {companion.ratingAverage.toFixed(1)}
                  </span>
                  <span>({companion.ratingCount} reviews)</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-3.5 w-3.5" /> {companion.city} ({companion.serviceRadiusKm} km coverage)
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Book CTA */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase block text-right">Hourly Rate</span>
                <span className="text-2xl font-black text-navy-950">
                  {formatCurrency(companion.hourlyRate)}
                  <span className="text-xs font-normal text-slate-500">/hr</span>
                </span>
              </div>
              <Button
                onClick={() => setIsBookingOpen(true)}
                size="lg"
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 rounded-xl shadow-md gap-2"
              >
                Book Appointment <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Attributes Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-slate-600">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Languages Spoken</span>
              <span className="font-bold text-navy-950 mt-0.5 block">{companion.languages.join(', ')}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Completed Sessions</span>
              <span className="font-bold text-navy-950 mt-0.5 block">{companion.completedBookings} sessions</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Identity Status</span>
              <span className="font-bold text-emerald-700 mt-0.5 block">Government ID Approved</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Availability Today</span>
              <span className="font-bold text-navy-950 mt-0.5 block">
                {companion.isOnline ? 'Online & Ready' : 'Available by Schedule'}
              </span>
            </div>
          </div>
        </Card>

        {/* Bio & Activities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* About / Bio */}
            <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
              <h3 className="text-base font-bold text-navy-950 mb-3">About Companion</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{companion.bio}</p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-6 mb-3">
                Accompaniment Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {companion.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="px-3 py-1 text-xs capitalize bg-slate-100 text-slate-800">
                    {cat.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Client Reviews */}
            <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-navy-950">Verified Client Reviews</h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {companion.ratingAverage.toFixed(1)} / 5.0
                </span>
              </div>

              <div className="space-y-4">
                {companion.reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-950">{r.customerName}</span>
                      <span className="text-slate-400">{r.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 leading-relaxed pt-1">{r.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Weekly Schedule */}
          <div>
            <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
              <h3 className="text-base font-bold text-navy-950 mb-1">Availability Schedule</h3>
              <p className="text-xs text-slate-500 mb-4">Companion working hours this week</p>

              <div className="space-y-2.5 text-xs">
                {companion.weeklySchedule.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pb-2 border-b border-slate-100 last:border-none"
                  >
                    <span className="font-semibold text-slate-700">{slot.day}</span>
                    <span className={slot.available ? 'text-slate-600 font-medium' : 'text-slate-400 italic'}>
                      {slot.hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold h-11 rounded-xl shadow-md"
                >
                  Book with {companion.fullName.split(' ')[0]}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title={`Book Companion Session with ${companion.fullName}`}
        description="Select activity, date, time, and meeting location"
        maxWidth="lg"
      >
        {bookingConfirmed ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-navy-950">Booking Request Submitted!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {companion.fullName} has received your booking request. Redirecting to your bookings dashboard...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Activity Category Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Activity Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({formatCurrency(cat.baseRatePerHour)}/hr)
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Date</label>
                <Input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Start Time</label>
                <Input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Duration</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={6}>6 hours (Half Day)</option>
                  <option value={8}>8 hours (Full Day)</option>
                </select>
              </div>
            </div>

            {/* Meeting Location */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Meeting Location (Pickup Address)</label>
              <Input
                value={meetingAddress}
                onChange={(e) => setMeetingAddress(e.target.value)}
                placeholder="Full address where companion will meet you"
                icon={<MapPin className="h-4 w-4 text-emerald-600" />}
              />
            </div>

            {/* Notes / Special Instructions */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Specific Instructions / Notes</label>
              <Input
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="e.g. Please bring a wheelchair assistant badge / Meet at Gate 2"
              />
            </div>

            {/* Fare Summary Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>
                  Companion Base Rate ({formatCurrency(companion.hourlyRate)} × {durationHours} hrs)
                </span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Service & Safety Fee (10%)</span>
                <span className="font-semibold text-slate-800">{formatCurrency(platformFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-navy-950">
                <span>Total Payable Amount</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setIsBookingOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isSubmitting}
                onClick={handleConfirmBooking}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 h-11 rounded-xl shadow-md"
              >
                Confirm & Send Request
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

