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
    headline: 'Art Gallery & Classical Concert Enthusiast',
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
    headline: 'Marathon Runner & Morning Fitness Partner',
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
    headline: 'Tech Conference & Professional Networking Companion',
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
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionItem | null>(null);
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
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">Companion Roster</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage registered companions, verify credentials, and regulate service availability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 font-semibold">
            {companions.filter((c) => c.is_verified).length} Verified
          </Badge>
          <Badge variant="warning" className="px-3 py-1 font-semibold">
            {companions.filter((c) => c.identity_status === 'pending').length} Pending ID
          </Badge>
          <Badge variant="default" className="px-3 py-1 font-semibold">
            {companions.length} Total
          </Badge>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by companion name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500 shrink-0 ml-1" />
          {(['all', 'verified', 'pending', 'unverified'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === filter
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Companions Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Companion</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Rate / Hr</th>
                <th className="py-3 px-4">Rating & Trips</th>
                <th className="py-3 px-4">ID Status</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((companion) => (
                <tr key={companion.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm border border-primary-200">
                          {companion.full_name.charAt(0)}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            companion.is_online ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                          title={companion.is_online ? 'Online now' : 'Offline'}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-navy-950">{companion.full_name}</span>
                          {companion.is_verified && (
                            <span title="Verified Badge">
                              <ShieldCheck className="h-4 w-4 text-primary-600" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{companion.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-slate-700 font-medium text-xs">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {companion.city}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-navy-950">
                    ₹{companion.hourly_rate}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-xs text-slate-800">
                        {companion.rating_average.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-slate-400">({companion.rating_count})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {companion.total_completed_bookings} sessions
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    {companion.identity_status === 'verified' && (
                      <Badge variant="success" className="gap-1 text-[11px]">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                    {companion.identity_status === 'pending' && (
                      <Badge variant="warning" className="gap-1 text-[11px]">
                        <Clock className="h-3 w-3" /> Under Review
                      </Badge>
                    )}
                    {companion.identity_status === 'unverified' && (
                      <Badge variant="default" className="text-[11px]">
                        Unverified
                      </Badge>
                    )}
                    {companion.identity_status === 'rejected' && (
                      <Badge variant="danger" className="gap-1 text-[11px]">
                        <XCircle className="h-3 w-3" /> Rejected
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        companion.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {companion.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant={companion.is_verified ? 'secondary' : 'default'}
                        disabled={loadingId === companion.id}
                        onClick={() => handleToggleVerified(companion)}
                        className="text-xs h-8 px-2.5"
                      >
                        {companion.is_verified ? 'Revoke' : 'Verify'}
                      </Button>

                      <Button
                        size="sm"
                        variant={companion.is_active ? 'danger' : 'secondary'}
                        disabled={loadingId === companion.id}
                        onClick={() => handleToggleActive(companion)}
                        className="text-xs h-8 px-2"
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
                  <td colSpan={7} className="py-8 text-center text-slate-500">
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
