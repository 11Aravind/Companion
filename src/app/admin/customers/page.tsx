'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Shield,
  Ban,
  RotateCcw,
  Calendar,
  AlertTriangle,
  User,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toggleUserStatusAction } from '@/app/actions/admin';

interface CustomerItem {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  total_bookings: number;
  total_spent: number;
  is_active: boolean;
  created_at: string;
}

const mockCustomers: CustomerItem[] = [
  {
    id: 'u1111111-1111-1111-1111-111111111111',
    full_name: 'Vikram Seth',
    email: 'vikram@customer.test',
    phone: '+91 98401 23456',
    emergency_contact_name: 'Anita Seth (Spouse)',
    emergency_contact_phone: '+91 98401 23457',
    total_bookings: 7,
    total_spent: 6300,
    is_active: true,
    created_at: '2026-10-15',
  },
  {
    id: 'u2222222-2222-2222-2222-222222222222',
    full_name: 'Meera Krishnan',
    email: 'meera@customer.test',
    phone: '+91 98410 87654',
    emergency_contact_name: 'Rajesh Krishnan (Brother)',
    emergency_contact_phone: '+91 98410 87655',
    total_bookings: 14,
    total_spent: 12400,
    is_active: true,
    created_at: '2026-09-01',
  },
  {
    id: 'u3333333-3333-3333-3333-333333333333',
    full_name: 'Suresh Menon',
    email: 'suresh@customer.test',
    phone: '+91 94440 11223',
    emergency_contact_name: 'Geetha Menon (Sister)',
    emergency_contact_phone: '+91 94440 11224',
    total_bookings: 2,
    total_spent: 1800,
    is_active: false,
    created_at: '2026-11-01',
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>(mockCustomers);
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleToggleActive = async (customer: CustomerItem) => {
    setLoadingId(customer.id);
    const newActive = !customer.is_active;
    const res = await toggleUserStatusAction(customer.id, newActive);
    if (res.success) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, is_active: newActive } : c))
      );
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6 text-charcoal">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">Customer Directory</h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Supervise registered platform clients, verify emergency contacts, and regulate access
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 font-bold">
            {customers.filter((c) => c.is_active).length} Active Accounts
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 font-bold">
            {customers.length} Total Registered
          </Badge>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          placeholder="Search by customer name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="h-10 text-xs"
        />
      </div>

      {/* Customer Directory Table (Stripe Style) */}
      <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] border-b border-charcoal-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Emergency Contact</th>
                <th className="py-3 px-4">Bookings</th>
                <th className="py-3 px-4">Total Spend</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border/70 bg-white">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-navy-50 text-navy-900 font-bold flex items-center justify-center text-xs border border-charcoal-border">
                        {customer.full_name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-navy-900 block">{customer.full_name}</span>
                        <div className="flex items-center gap-1 text-[11px] text-charcoal-muted">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-charcoal font-medium">
                      <Phone className="h-3.5 w-3.5 text-charcoal-muted" />
                      {customer.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs">
                      <span className="font-semibold text-charcoal block">
                        {customer.emergency_contact_name || 'Not provided'}
                      </span>
                      <span className="text-[11px] text-charcoal-muted">{customer.emergency_contact_phone || '—'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
                      <Calendar className="h-3.5 w-3.5 text-charcoal-muted" />
                      {customer.total_bookings} sessions
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-navy-900 text-xs">
                    ₹{customer.total_spent.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        customer.is_active
                          ? 'bg-accent-light text-accent border-accent/20'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {customer.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant={customer.is_active ? 'danger' : 'outline'}
                      disabled={loadingId === customer.id}
                      onClick={() => handleToggleActive(customer)}
                      className="text-xs h-7 px-2.5 font-bold"
                    >
                      {customer.is_active ? (
                        <>
                          <Ban className="h-3.5 w-3.5 mr-1" /> Suspend
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-3.5 w-3.5 mr-1" /> Restore
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-muted">
                    No customers found matching &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
