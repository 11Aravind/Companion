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
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">Customer Directory</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Supervise registered platform customers, verify emergency profiles, and manage access privileges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 font-semibold">
            {customers.filter((c) => c.is_active).length} Active Accounts
          </Badge>
          <Badge variant="default" className="px-3 py-1 font-semibold">
            {customers.length} Total Registered
          </Badge>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by customer name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer Directory Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
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
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm border border-slate-200">
                        {customer.full_name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-navy-950 block">{customer.full_name}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {customer.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800 block">
                        {customer.emergency_contact_name || 'Not provided'}
                      </span>
                      <span className="text-slate-500">{customer.emergency_contact_phone || '—'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {customer.total_bookings} sessions
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-navy-950 text-xs">
                    ₹{customer.total_spent.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        customer.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {customer.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant={customer.is_active ? 'danger' : 'secondary'}
                      disabled={loadingId === customer.id}
                      onClick={() => handleToggleActive(customer)}
                      className="text-xs h-8 px-2.5"
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
                  <td colSpan={7} className="py-8 text-center text-slate-500">
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

