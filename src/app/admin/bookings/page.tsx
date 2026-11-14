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
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">Bookings & Sessions Supervision</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor real-time session progress, financial settlement fees, and emergency intervention overrides.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="px-3 py-1 font-semibold">
            {bookings.filter((b) => b.status === 'active' || b.status === 'companion_arriving').length} In-Flight
          </Badge>
          <Badge variant="success" className="px-3 py-1 font-semibold">
            {bookings.filter((b) => b.status === 'completed').length} Completed
          </Badge>
          <Badge variant="default" className="px-3 py-1 font-semibold">
            {bookings.length} Total
          </Badge>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by customer, companion, category, or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'active', 'companion_arriving', 'pending', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Participants</th>
                <th className="py-3 px-4">Activity Category</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Total (Platform 10%)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                    #{b.id.slice(0, 8)}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs">
                      <div className="font-semibold text-navy-950 flex items-center gap-1">
                        <span className="text-slate-400">Customer:</span> {b.customer_name}
                      </div>
                      <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                        <span className="text-slate-400">Companion:</span> {b.companion_name}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-slate-800 block">{b.category_name}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                      {b.meeting_address}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs text-slate-800 font-medium">
                      {b.scheduled_date} at {b.scheduled_start_time}
                    </div>
                    <span className="text-[11px] text-slate-500">{b.duration_hours} Hours Session</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-navy-950 text-xs block">₹{b.total_amount}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold block">
                      Fee: ₹{b.platform_fee}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {b.status === 'active' && (
                      <Badge variant="primary" className="text-[11px] font-semibold animate-pulse">
                        In Progress
                      </Badge>
                    )}
                    {b.status === 'companion_arriving' && (
                      <Badge variant="warning" className="text-[11px] font-semibold">
                        Arriving
                      </Badge>
                    )}
                    {b.status === 'completed' && (
                      <Badge variant="success" className="text-[11px] font-semibold">
                        Completed
                      </Badge>
                    )}
                    {b.status === 'cancelled' && (
                      <Badge variant="danger" className="text-[11px] font-semibold">
                        Cancelled
                      </Badge>
                    )}
                    {b.status === 'pending' && (
                      <Badge variant="default" className="text-[11px] font-semibold">
                        Pending
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedBooking(b)}
                        className="text-xs h-8 px-2.5"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>

                      {b.status !== 'completed' && b.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setCancelModalBooking(b)}
                          className="text-xs h-8 px-2"
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
                  <td colSpan={7} className="py-8 text-center text-slate-500">
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
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Customer</span>
                <span className="font-bold text-navy-950 text-sm">{selectedBooking.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Companion</span>
                <span className="font-bold text-navy-950 text-sm">{selectedBooking.companion_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-800">{selectedBooking.category_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status</span>
                <span className="font-bold uppercase text-primary-600">{selectedBooking.status}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Designated Meeting Location</span>
              <p className="font-medium text-slate-800">{selectedBooking.meeting_address}</p>
            </div>

            {selectedBooking.verification_otp && (
              <div className="p-3 bg-primary-50 rounded-xl border border-primary-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-primary-900 block">In-Person Verification PIN</span>
                  <span className="text-primary-700 text-[11px]">Given to customer to activate session</span>
                </div>
                <span className="font-mono text-lg font-bold text-primary-700 tracking-widest bg-white px-3 py-1 rounded-lg border border-primary-200">
                  {selectedBooking.verification_otp}
                </span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setSelectedBooking(null)}>
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
            <p className="text-xs text-slate-600">
              You are executing an administrative override to cancel booking{' '}
              <strong className="font-mono">#{cancelModalBooking.id.slice(0, 8)}</strong> between{' '}
              <strong>{cancelModalBooking.customer_name}</strong> and{' '}
              <strong>{cancelModalBooking.companion_name}</strong>. Both parties will be immediately notified.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950 block">Reason for Cancellation</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Safety concern reported / severe weather disruption / mutually agreed reschedule"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCancelModalBooking(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleCancelBooking}
                disabled={isProcessing}
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

