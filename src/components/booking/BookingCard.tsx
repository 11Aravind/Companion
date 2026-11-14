import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Booking } from '@/types/booking';
import { STATUS_LABELS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';

export function BookingCard({
  booking,
  userRole = 'customer',
  onCancel,
  onAccept,
  onReject,
  onStart,
  onComplete,
}: {
  booking: Booking;
  userRole?: 'customer' | 'companion' | 'admin';
  onCancel?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
}) {
  const statusMeta = STATUS_LABELS[booking.status] || {
    label: booking.status,
    color: 'text-charcoal',
    bg: 'bg-navy-50 border border-charcoal-border',
  };

  const isCustomer = userRole === 'customer';
  const counterpartName = isCustomer ? booking.companionName : booking.customerName;
  const counterpartAvatar = isCustomer ? booking.companionAvatar : booking.customerAvatar;

  return (
    <Card className="rounded-2xl border border-charcoal-border shadow-subtle hover:shadow-card transition-all duration-200 bg-white overflow-hidden">
      <CardContent className="p-5">
        {/* Status & Category Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-charcoal-border">
          <span className="text-xs font-bold text-navy-900 bg-navy-50 px-2.5 py-1 rounded-lg border border-charcoal-border">
            {booking.categoryName}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${statusMeta.bg} ${statusMeta.color}`}
          >
            {statusMeta.label}
          </span>
        </div>

        {/* Counterpart Profile Strip */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="h-11 w-11 rounded-xl bg-navy-50 border border-charcoal-border overflow-hidden flex items-center justify-center font-bold text-navy-900 text-sm shrink-0">
            {counterpartAvatar ? (
              <img src={counterpartAvatar} alt={counterpartName} className="h-full w-full object-cover" />
            ) : (
              counterpartName.charAt(0)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider block">
              {isCustomer ? 'Companion Partner' : 'Customer'}
            </span>
            <h4 className="font-bold text-navy-900 text-sm truncate">{counterpartName}</h4>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider block">Total Fare</span>
            <span className="text-sm font-bold text-navy-900">
              {formatCurrency(booking.pricing.totalAmount, booking.pricing.currency)}
            </span>
          </div>
        </div>

        {/* Schedule & Location Grid */}
        <div className="space-y-2 text-xs text-charcoal bg-navy-50 p-3.5 rounded-xl mb-4 border border-charcoal-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-navy-900 shrink-0" />
            <span className="font-semibold text-charcoal">{formatDate(booking.scheduledDate)}</span>
            <span className="text-charcoal-muted">at</span>
            <span className="font-semibold text-charcoal">{booking.scheduledStartTime}</span>
            <span className="text-charcoal-muted">({booking.durationHours} hrs duration)</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#2583E8] shrink-0 mt-0.5" />
            <span className="truncate leading-tight text-charcoal">{booking.meetingLocation.address}</span>
          </div>
        </div>

        {/* Start OTP Banner (for active/confirmed bookings) */}
        {booking.status === 'companion_arriving' && booking.verificationOtp && (
          <div className="mb-4 p-3.5 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-navy-900 block">Session Verification PIN</span>
              <span className="text-charcoal-muted text-[11px]">Share with companion to start</span>
            </div>
            <span className="text-lg font-black tracking-widest text-navy-900 bg-white px-3 py-1 rounded-lg border border-charcoal-border shadow-subtle">
              {booking.verificationOtp}
            </span>
          </div>
        )}

        {/* Action Buttons based on status & role */}
        <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
          <Link href={`/bookings/${booking.id}`}>
            <Button variant="outline" size="sm" className="text-xs h-9 font-semibold">
              View Details
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {/* Live GPS Track link when arriving or active */}
            {(booking.status === 'companion_arriving' || booking.status === 'active') && (
              <Link href={`/bookings/${booking.id}#live-map`}>
                <Button size="sm" className="bg-[#2583E8] hover:bg-[#1C6EC5] text-white text-xs h-9 gap-1.5 font-bold shadow-subtle">
                  <Navigation className="h-3.5 w-3.5 animate-pulse" />
                  Live GPS Track
                </Button>
              </Link>
            )}

            {/* Companion acceptance/rejection controls for pending */}
            {!isCustomer && booking.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject?.(booking.id)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs h-9 font-semibold"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAccept?.(booking.id)}
                  className="bg-accent hover:bg-accent-hover text-white text-xs h-9 font-bold shadow-subtle"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept Request
                </Button>
              </>
            )}

            {/* Customer cancellation */}
            {isCustomer && (booking.status === 'pending' || booking.status === 'confirmed') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel?.(booking.id)}
                className="text-charcoal-muted hover:text-rose-600 text-xs h-9 font-semibold"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
