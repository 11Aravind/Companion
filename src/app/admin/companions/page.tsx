'use client';

import { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MapPin,
  ShieldCheck,
  ExternalLink,
  Ban,
  RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toggleUserStatusAction, updateCompanionSettingsAction } from '@/app/actions/admin';

interface CompanionItem {
  id: string;
  full_name: string;
  email: string;
  city: string;
  headline: string;
  hourly_rate: number;
  rating_average: number;
  rating_count: number;
  total_completed_bookings: number;
  is_verified: boolean;
  identity_status: 'verified' | 'pending' | 'unverified' | 'rejected';
  is_online: boolean;
  is_active: boolean;
}

const mockCompanions: CompanionItem[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    full_name: 'Ananya Sharma',
    email: 'ananya@companion.test',
    city: 'Chennai',
    headline: 'Healthcare Assistant & Patient Support',
    hourly_rate: 450,
    rating_average: 4.95,
    rating_count: 42,
    total_completed_bookings: 38,
    is_verified: true,
    identity_status: 'verified',
    is_online: true,
    is_active: true,
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    full_name: 'Karthik Raja',
    email: 'karthik@companion.test',
    city: 'Chennai',
    headline: 'Personal Shopper & Mall Guide',
    hourly_rate: 350,
    rating_average: 4.88,
    rating_count: 29,
    total_completed_bookings: 27,
    is_verified: true,
    identity_status: 'verified',
    is_online: false,
    is_active: true,
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    full_name: 'Pooja Iyer',
    email: 'pooja@companion.test',
    city: 'Bengaluru',
    headline: 'Tech Conference Companion',
    hourly_rate: 550,
    rating_average: 5.0,
    rating_count: 12,
    total_completed_bookings: 10,
    is_verified: false,
    identity_status: 'pending',
    is_online: true,
    is_active: true,
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    full_name: 'Deepak Nathan',
    email: 'deepak@companion.test',
    city: 'Coimbatore',
    headline: 'Culinary Food Tours & Café Exploring',
    hourly_rate: 300,
    rating_average: 4.6,
    rating_count: 15,
    total_completed_bookings: 14,
    is_verified: false,
    identity_status: 'unverified',
    is_online: false,
    is_active: false,
  },
];

export default function AdminCompanionsPage() {
  const [companions, setCompanions] = useState<CompanionItem[]>(mockCompanions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'unverified'>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = companions.filter((c) => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : c.identity_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleToggleVerified = async (companion: CompanionItem) => {
    setLoadingId(companion.id);
    const newVerified = !companion.is_verified;
    const res = await updateCompanionSettingsAction(companion.id, {
      is_verified: newVerified,
    });
    if (res.success) {
      setCompanions((prev) =>
        prev.map((c) =>
          c.id === companion.id
            ? { ...c, is_verified: newVerified, identity_status: newVerified ? 'verified' : 'unverified' }
            : c
        )
      );
    }
    setLoadingId(null);
  };

  const handleToggleActive = async (companion: CompanionItem) => {
    setLoadingId(companion.id);
    const newActive = !companion.is_active;
    const res = await toggleUserStatusAction(companion.id, newActive);
    if (res.success) {
      setCompanions((prev) =>
        prev.map((c) => (c.id === companion.id ? { ...c, is_active: newActive } : c))
      );
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6 text-charcoal">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">Companion Fleet Roster</h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Manage registered companions, verify credentials, and regulate fleet status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 font-bold">
            {companions.filter((c) => c.is_verified).length} Verified
          </Badge>
          <Badge variant="warning" className="px-3 py-1 font-bold">
            {companions.filter((c) => c.identity_status === 'pending').length} Pending ID
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 font-bold">
            {companions.length} Total
          </Badge>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by companion name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="h-10 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-charcoal-border shadow-subtle">
          {(['all', 'verified', 'pending', 'unverified'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-navy-900 text-white shadow-subtle'
                  : 'text-charcoal-muted hover:text-navy-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Companions Table (Stripe Style) */}
      <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] border-b border-charcoal-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th className="py-3 px-4">Companion</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Rating & Trips</th>
                <th className="py-3 px-4">ID Status</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border/70 bg-white">
              {filtered.map((companion) => (
                <tr key={companion.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-9 w-9 rounded-xl bg-navy-50 text-navy-900 font-bold flex items-center justify-center text-xs border border-charcoal-border">
                          {companion.full_name.charAt(0)}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white ${
                            companion.is_online ? 'bg-accent' : 'bg-charcoal-muted'
                          }`}
                          title={companion.is_online ? 'Online now' : 'Offline'}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-navy-900">{companion.full_name}</span>
                          {companion.is_verified && (
                            <span title="Verified Badge">
                              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-charcoal-muted">{companion.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-charcoal">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#2583E8]" />
                      {companion.city}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-navy-900">
                    ₹{companion.hourly_rate}/hr
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-navy-900">{companion.rating_average.toFixed(1)}</span>
                      <span className="text-[10px] text-charcoal-muted">({companion.rating_count})</span>
                    </div>
                    <p className="text-[10px] text-charcoal-muted mt-0.5">
                      {companion.total_completed_bookings} sessions
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    {companion.identity_status === 'verified' && (
                      <Badge variant="success" className="gap-1 text-[10px] py-0.5">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                    {companion.identity_status === 'pending' && (
                      <Badge variant="warning" className="gap-1 text-[10px] py-0.5">
                        <Clock className="h-3 w-3" /> Under Review
                      </Badge>
                    )}
                    {companion.identity_status === 'unverified' && (
                      <Badge variant="outline" className="text-[10px] py-0.5">
                        Unverified
                      </Badge>
                    )}
                    {companion.identity_status === 'rejected' && (
                      <Badge variant="danger" className="gap-1 text-[10px] py-0.5">
                        <XCircle className="h-3 w-3" /> Rejected
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        companion.is_active
                          ? 'bg-accent-light text-accent border-accent/20'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {companion.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant={companion.is_verified ? 'outline' : 'default'}
                        disabled={loadingId === companion.id}
                        onClick={() => handleToggleVerified(companion)}
                        className="text-xs h-7 px-2.5 font-bold"
                      >
                        {companion.is_verified ? 'Revoke' : 'Verify'}
                      </Button>

                      <Button
                        size="sm"
                        variant={companion.is_active ? 'danger' : 'outline'}
                        disabled={loadingId === companion.id}
                        onClick={() => handleToggleActive(companion)}
                        className="text-xs h-7 px-2"
                        title={companion.is_active ? 'Suspend account' : 'Reactivate account'}
                      >
                        {companion.is_active ? <Ban className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-muted">
                    No companions matching the selected criteria.
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
