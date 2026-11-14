'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CustomerHeader } from '@/components/shell/CustomerHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { GoogleMapView } from '@/components/maps/GoogleMapView';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Star,
  ArrowLeft,
  KeyRound,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { STATUS_LABELS, BookingStatus } from '@/lib/constants';

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const [ratingStars, setRatingStars] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);

  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState('');
  const [reportSubmitted, setReportSubmitted] = React.useState(false);

  // Booking Data Mock
  const booking = {
    id: params.id as string,
    status: 'companion_arriving' as BookingStatus,
    categoryName: 'Hospital Visit Companion',
    scheduledDate: '2026-11-14',
    scheduledStartTime: '14:30',
    durationHours: 3,
    meetingLocation: {
      address: 'Apollo Hospitals, Main Lobby, Greams Road, Thousand Lights, Chennai',
      lat: 13.0569,
      lng: 80.2522,
    },
    companionLiveLocation: {
      lat: 13.0585,
      lng: 80.2498,
      heading: 120,
      updatedAt: new Date().toISOString(),
    },
    companion: {
      id: 'comp-1',
      fullName: 'Ananya Sharma',
      avatarUrl: '',
      phone: '+91 98765 00112',
      headline: 'Healthcare Assistant & Senior Support Specialist',
      ratingAverage: 4.9,
    },
    verificationOtp: '8492',
    pricing: {
      hourlyRate: 450,
      subtotal: 1350,
      platformFee: 135,
      totalAmount: 1485,
      currency: 'INR',
    },
    payment: {
      status: 'captured',
      razorpayPaymentId: 'pay_Nz9Kq1238910',
      paidAt: '2026-11-14T07:15:00Z',
    },
    timeline: [
      { status: 'Booking Created', time: '07:15 AM', completed: true },
      { status: 'Accepted by Companion', time: '07:30 AM', completed: true },
      { status: 'Companion En Route (Live GPS)', time: '02:00 PM', completed: true, active: true },
      { status: 'In Session Verification', time: 'Pending Meeting', completed: false },
      { status: 'Session Complete', time: 'Pending', completed: false },
    ],
  };

  const statusMeta = STATUS_LABELS[booking.status];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-charcoal">
      <CustomerHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-navy-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Bookings
          </Link>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusMeta.bg} ${statusMeta.color}`}>
            {statusMeta.label}
          </span>
        </div>

        {/* Start Verification PIN Highlight Card */}
        {booking.status === 'companion_arriving' && (
          <Card className="rounded-3xl border border-charcoal-border bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center shrink-0 shadow-subtle">
                <KeyRound className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-navy-900 text-base">In-Person Meeting PIN</h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Share this 4-digit code with {booking.companion.fullName} when you meet to officially start the session.
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <span className="text-3xl font-black tracking-widest text-navy-900 bg-navy-50 px-5 py-2.5 rounded-2xl border border-charcoal-border block shadow-subtle">
                {booking.verificationOtp}
              </span>
            </div>
          </Card>
        )}

        {/* Companion Strip & Direct Actions */}
        <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-navy-50 border border-charcoal-border flex items-center justify-center text-lg font-bold text-navy-900 shrink-0">
                {booking.companion.fullName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider block">Assigned Companion</span>
                <h3 className="text-base font-bold text-navy-900">{booking.companion.fullName}</h3>
                <p className="text-xs text-charcoal-muted">{booking.companion.headline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none text-xs font-bold gap-1.5 h-10 border-charcoal-border"
              >
                <MessageCircle className="h-4 w-4 text-navy-900" /> Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none text-xs font-bold gap-1.5 h-10 border-charcoal-border"
              >
                <Phone className="h-4 w-4 text-accent" /> Voice Call
              </Button>
            </div>
          </div>
        </Card>

        {/* Live GPS Map & Meeting Point (Uber Inspired Live Tracking) */}
        <Card id="live-map" className="rounded-3xl border border-charcoal-border shadow-card bg-white overflow-hidden">
          <div className="p-5 border-b border-charcoal-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-5 w-5 text-[#2583E8]" />
              <div>
                <h3 className="text-sm font-bold text-navy-900">Meeting Location & Live Route</h3>
                <p className="text-xs text-charcoal-muted">{booking.meetingLocation.address}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-accent bg-accent-light border-accent/20 gap-1.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Live Telemetry
            </Badge>
          </div>

          <div className="h-72 w-full relative">
            <GoogleMapView
              center={booking.meetingLocation}
              zoom={14}
              meetingLocation={booking.meetingLocation}
              activeCompanionLocation={booking.companionLiveLocation}
              showRoute={true}
              className="h-full w-full rounded-none border-none"
            />
          </div>

          <div className="p-4 bg-navy-50/50 border-t border-charcoal-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-accent animate-pulse" />
              <span className="font-bold text-navy-900">Companion is 1.2 km away</span>
            </div>
            <span className="text-charcoal-muted font-medium">Estimated arrival: ~8 minutes</span>
          </div>
        </Card>

        {/* Lifecycle Progress Timeline (Stripe Simplicity) */}
        <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
          <h3 className="text-base font-bold text-navy-900 mb-4">Session Progression</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            {booking.timeline.map((step, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  step.active
                    ? 'bg-navy-900 border-navy-900 text-white font-bold shadow-subtle'
                    : step.completed
                    ? 'bg-navy-50 border-charcoal-border text-navy-900 font-semibold'
                    : 'bg-[#F7F8FA] border-charcoal-border/60 text-charcoal-muted'
                }`}
              >
                <span className="block text-[11px] mb-1">{step.status}</span>
                <span className={`text-[10px] block ${step.active ? 'text-accent' : 'text-charcoal-muted'}`}>
                  {step.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Itemized Payment Receipt (Stripe Clean Ledger) */}
        <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-charcoal-border">
            <h3 className="text-base font-bold text-navy-900">Payment & Fare Receipt</h3>
            <span className="text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full border border-accent/20">
              Paid via Razorpay
            </span>
          </div>

          <div className="space-y-2.5 pt-4 text-xs text-charcoal">
            <div className="flex justify-between">
              <span className="text-charcoal-muted">
                Companion Rate ({formatCurrency(booking.pricing.hourlyRate)} × {booking.durationHours} hours)
              </span>
              <span className="font-semibold text-charcoal">{formatCurrency(booking.pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Platform Service & Safety Fee</span>
              <span className="font-semibold text-charcoal">{formatCurrency(booking.pricing.platformFee)}</span>
            </div>
            <div className="pt-2.5 border-t border-charcoal-border flex justify-between text-sm font-bold text-navy-900">
              <span>Total Paid</span>
              <span>{formatCurrency(booking.pricing.totalAmount)}</span>
            </div>
          </div>
        </Card>

        {/* Safety & Reporting Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReportOpen(true)}
            className="text-xs text-charcoal-muted hover:text-rose-600 gap-1.5 font-semibold"
          >
            <AlertTriangle className="h-4 w-4" /> Report Safety Concern
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReviewOpen(true)}
            className="text-xs font-bold gap-1.5 border-charcoal-border"
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-400" /> Leave Review
          </Button>
        </div>
      </main>

      {/* Leave Review Modal */}
      <Modal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title={`Review Session with ${booking.companion.fullName}`}
        description="Share your feedback to support community trust"
      >
        {reviewSubmitted ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="h-10 w-10 text-accent mx-auto" />
            <h3 className="font-bold text-navy-900 text-base">Thank you for your review!</h3>
            <p className="text-xs text-charcoal-muted">Your rating helps maintain high service standards.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-charcoal block mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= ratingStars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-charcoal-border'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal block mb-1.5">Feedback / Comments</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                placeholder="How was your companion's attentiveness, punctuality, and professionalism?"
                className="w-full rounded-xl border border-charcoal-border p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsReviewOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setReviewSubmitted(true);
                  setTimeout(() => setIsReviewOpen(false), 1500);
                }}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 h-10 rounded-xl shadow-subtle"
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Safety Report Modal */}
      <Modal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="Report Safety Issue or Policy Violation"
        description="Our 24/7 trust & safety team reviews every report immediately"
      >
        {reportSubmitted ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="h-10 w-10 text-accent mx-auto" />
            <h3 className="font-bold text-navy-900 text-base">Report Lodged Under Priority Review</h3>
            <p className="text-xs text-charcoal-muted">
              Ticket reference #{params.id}-SAFE has been opened. We will follow up with you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-charcoal block mb-1.5">Reason for Report</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full h-10 rounded-xl border border-charcoal-border bg-white px-3 text-xs text-charcoal"
              >
                <option value="">Select reason...</option>
                <option value="unprofessional">Unprofessional behavior or tardiness</option>
                <option value="location_deviation">Unscheduled location deviation</option>
                <option value="identity_mismatch">Person did not match profile picture</option>
                <option value="safety_concern">Felt unsafe during appointment</option>
                <option value="other">Other issue</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsReportOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setReportSubmitted(true);
                  setTimeout(() => setIsReportOpen(false), 1800);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 h-10 rounded-xl"
              >
                Submit Safety Report
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
