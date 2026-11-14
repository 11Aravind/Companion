'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  User,
  Shield,
  Eye,
  XCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { adminCancelBookingAction } from '@/app/actions/admin';
import { BookingStatus } from '@/types/database';

interface AdminBookingRecord {
  id: string;
  customer_name: string;
  companion_name: string;
  category_name: string;
  status: BookingStatus;
  scheduled_date: string;
  scheduled_start_time: string;
  duration_hours: number;
  total_amount: number;
  platform_fee: number;
  meeting_address: string;
  verification_otp?: string;
  created_at: string;
}

const mockBookings: AdminBookingRecord[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    customer_name: 'Vikram Seth',
    companion_name: 'Ananya Sharma',
    category_name: 'Art & Museum Exploring',
    status: 'active',
    scheduled_date: '2026-11-14',
    scheduled_start_time: '14:00',
    duration_hours: 3,
    total_amount: 1485,
    platform_fee: 135,
    meeting_address: 'National Art Gallery, Pantheon Rd, Egmore, Chennai',
    verification_otp: '7412',
    created_at: '2026-11-14 08:30 AM',
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    customer_name: 'Meera Krishnan',
    companion_name: 'Karthik Raja',
    category_name: 'Fitness & Morning Walk',
    status: 'completed',
    scheduled_date: '2026-11-13',
    scheduled_start_time: '06:30',
    duration_hours: 2,
    total_amount: 770,
    platform_fee: 70,
    meeting_address: 'Marina Beach Promenade, Chennai',
    verification_otp: '3819',
    created_at: '2026-11-12 07:00 PM',
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    customer_name: 'Vikram Seth',
    companion_name: 'Pooja Iyer',
    category_name: 'Tech & Networking Events',
    status: 'companion_arriving',
    scheduled_date: '2026-11-14',
    scheduled_start_time: '16:00',
    duration_hours: 4,
    total_amount: 2420,
    platform_fee: 220,
    meeting_address: 'ITC Grand Chola, Guindy, Chennai',
    verification_otp: '8204',
    created_at: '2026-11-14 10:15 AM',
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingRecord[]>(mockBookings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingRecord | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<AdminBookingRecord | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.companion_name.toLowerCase().includes(search.toLowerCase()) ||
      b.category_name.toLowerCase().includes(search.toLowerCase()) ||
      b.id.includes(search);

    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setIsProcessing(true);
    const res = await adminCancelBookingAction(
      cancelModalBooking.id,
      cancelReason || 'Cancelled by System Administrator'
    );
    if (res.success) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === cancelModalBooking.id ? { ...b, status: 'cancelled' as BookingStatus } : b
        )
      );
      setCancelModalBooking(null);
      setCancelReason('');
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 text-charcoal">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">Bookings & Sessions Supervision</h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Monitor real-time session progress, financial settlement fees, and emergency intervention overrides
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="px-3 py-1 font-bold">
            {bookings.filter((b) => b.status === 'active' || b.status === 'companion_arriving').length} In-Flight
          </Badge>
          <Badge variant="success" className="px-3 py-1 font-bold">
            {bookings.filter((b) => b.status === 'completed').length} Completed
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 font-bold">
            {bookings.length} Total
          </Badge>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by customer, companion, category, or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="h-10 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-charcoal-border shadow-subtle flex-wrap">
          {['all', 'active', 'companion_arriving', 'pending', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-navy-900 text-white shadow-subtle'
                  : 'text-charcoal-muted hover:text-navy-900'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table (Stripe Style) */}
      <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] border-b border-charcoal-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Participants</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Total (Take Rate)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border/70 bg-white">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                    #{b.id.slice(0, 8)}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs">
                      <div className="font-bold text-navy-900 flex items-center gap-1">
                        <span className="text-charcoal-muted font-normal">Customer:</span> {b.customer_name}
                      </div>
                      <div className="text-charcoal flex items-center gap-1 mt-0.5 font-medium">
                        <span className="text-charcoal-muted font-normal">Companion:</span> {b.companion_name}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs font-bold text-navy-900 block">{b.category_name}</span>
                    <span className="text-[11px] text-charcoal-muted truncate max-w-xs block">
                      {b.meeting_address}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs text-charcoal font-semibold">
                      {b.scheduled_date} at {b.scheduled_start_time}
                    </div>
                    <span className="text-[11px] text-charcoal-muted">{b.duration_hours} Hours Session</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-navy-900 text-xs block">₹{b.total_amount}</span>
                    <span className="text-[11px] text-accent font-bold block">
                      Fee: ₹{b.platform_fee}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {b.status === 'active' && (
                      <Badge variant="primary" className="text-[10px] font-bold animate-pulse">
                        In Progress
                      </Badge>
                    )}
                    {b.status === 'companion_arriving' && (
                      <Badge variant="warning" className="text-[10px] font-bold">
                        En Route
                      </Badge>
                    )}
                    {b.status === 'completed' && (
                      <Badge variant="success" className="text-[10px] font-bold">
                        Completed
                      </Badge>
                    )}
                    {b.status === 'cancelled' && (
                      <Badge variant="danger" className="text-[10px] font-bold">
                        Cancelled
                      </Badge>
                    )}
                    {b.status === 'pending' && (
                      <Badge variant="outline" className="text-[10px] font-bold">
                        Pending
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedBooking(b)}
                        className="text-xs h-7 px-2.5 font-bold border-charcoal-border"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>

                      {b.status !== 'completed' && b.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setCancelModalBooking(b)}
                          className="text-xs h-7 px-2 font-bold"
                          title="Admin Emergency Cancellation"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-muted">
                    No bookings found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Session Details: #${selectedBooking.id.slice(0, 8)}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-navy-50 rounded-2xl border border-charcoal-border">
              <div>
                <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Customer</span>
                <span className="font-bold text-navy-900 text-sm">{selectedBooking.customer_name}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Companion</span>
                <span className="font-bold text-navy-900 text-sm">{selectedBooking.companion_name}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-charcoal">{selectedBooking.category_name}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Status</span>
                <span className="font-bold uppercase text-accent">{selectedBooking.status}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-charcoal-border">
              <span className="text-charcoal-muted block text-[10px] uppercase font-bold mb-1">Designated Meeting Location</span>
              <p className="font-medium text-charcoal">{selectedBooking.meeting_address}</p>
            </div>

            {selectedBooking.verification_otp && (
              <div className="p-3.5 bg-navy-50 rounded-2xl border border-charcoal-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy-900 block">In-Person Verification PIN</span>
                  <span className="text-charcoal-muted text-[11px]">Given to customer to activate session</span>
                </div>
                <span className="font-mono text-lg font-bold text-navy-900 tracking-widest bg-white px-3 py-1 rounded-xl border border-charcoal-border shadow-subtle">
                  {selectedBooking.verification_otp}
                </span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedBooking(null)} className="font-bold border-charcoal-border">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Emergency Cancellation Modal */}
      {cancelModalBooking && (
        <Modal
          isOpen={!!cancelModalBooking}
          onClose={() => setCancelModalBooking(null)}
          title="Administrative Session Cancellation"
        >
          <div className="space-y-4">
            <p className="text-xs text-charcoal-muted">
              You are executing an administrative override to cancel booking{' '}
              <strong className="font-mono text-navy-900">#{cancelModalBooking.id.slice(0, 8)}</strong> between{' '}
              <strong className="text-navy-900">{cancelModalBooking.customer_name}</strong> and{' '}
              <strong className="text-navy-900">{cancelModalBooking.companion_name}</strong>. Both parties will be immediately notified.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-900 block">Reason for Cancellation</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Safety concern reported / severe weather disruption / mutually agreed reschedule"
                className="w-full text-xs p-2.5 rounded-xl border border-charcoal-border bg-white focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-charcoal-border">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCancelModalBooking(null)}
                disabled={isProcessing}
                className="font-bold border-charcoal-border"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleCancelBooking}
                disabled={isProcessing}
                className="font-bold shadow-subtle"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
