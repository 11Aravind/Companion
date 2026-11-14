'use client';

import * as React from 'react';
import {
  Users,
  UserCheck,
  ShieldAlert,
  Calendar,
  CircleDollarSign,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GoogleMapView } from '@/components/maps/GoogleMapView';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  const adminFleetCompanions = [
    {
      id: 'comp-1',
      fullName: 'Ananya Sharma',
      headline: 'Hospital Support',
      bio: '',
      city: 'Chennai',
      serviceRadiusKm: 25,
      hourlyRate: 450,
      languages: ['English'],
      categories: ['hospital-visit'],
      isOnline: true,
      isVerified: true,
      ratingAverage: 4.9,
      ratingCount: 38,
      completedBookings: 52,
      currentLocation: { lat: 13.0585, lng: 80.2498 },
    },
    {
      id: 'comp-2',
      fullName: 'Karthik Raja',
      headline: 'Shopping Assistant',
      bio: '',
      city: 'Chennai',
      serviceRadiusKm: 20,
      hourlyRate: 350,
      languages: ['Tamil'],
      categories: ['shopping'],
      isOnline: true,
      isVerified: true,
      ratingAverage: 4.9,
      ratingCount: 27,
      completedBookings: 39,
      currentLocation: { lat: 13.0418, lng: 80.2341 },
    },
    {
      id: 'comp-4',
      fullName: 'Venkatesh Prasad',
      headline: 'Senior Citizen Support',
      bio: '',
      city: 'Chennai',
      serviceRadiusKm: 18,
      hourlyRate: 250,
      languages: ['English'],
      categories: ['general-companion'],
      isOnline: true,
      isVerified: true,
      ratingAverage: 5.0,
      ratingCount: 19,
      completedBookings: 28,
      currentLocation: { lat: 13.0620, lng: 80.2610 },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-navy-900 tracking-tight">Executive Operations Overview</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">Platform KPIs, companion fleet activity, and safety metrics</p>
      </div>

      {/* KPI Cards Grid (Stripe Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border border-charcoal-border shadow-subtle p-5 bg-white">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross GMV (30d)</span>
            <CircleDollarSign className="h-4 w-4 text-accent" />
          </div>
          <span className="text-2xl font-black text-navy-900">{formatCurrency(482500)}</span>
          <span className="text-xs text-accent font-bold block mt-1">+24.5% vs last month</span>
        </Card>

        <Card className="rounded-3xl border border-charcoal-border shadow-subtle p-5 bg-white">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Companions Online</span>
            <UserCheck className="h-4 w-4 text-navy-900" />
          </div>
          <span className="text-2xl font-black text-navy-900">142</span>
          <span className="text-xs text-charcoal-muted font-medium block mt-1">Across 6 metro cities</span>
        </Card>

        <Card className="rounded-3xl border border-charcoal-border shadow-subtle p-5 bg-white">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active In-Session</span>
            <Calendar className="h-4 w-4 text-[#2583E8]" />
          </div>
          <span className="text-2xl font-black text-navy-900">37</span>
          <span className="text-xs text-[#2583E8] font-bold block mt-1">Live telemetry streaming</span>
        </Card>

        <Card className="rounded-3xl border border-charcoal-border shadow-subtle p-5 bg-white">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Approvals</span>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-navy-900">14</span>
          <span className="text-xs text-amber-600 font-bold block mt-1">Requires admin review</span>
        </Card>
      </div>

      {/* Middle Row: Live Fleet Map View & Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Fleet Map container */}
        <Card className="lg:col-span-2 rounded-3xl border border-charcoal-border shadow-card bg-white overflow-hidden flex flex-col">
          <CardHeader className="p-5 border-b border-charcoal-border flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-navy-900">Live Fleet Dispatch Radar</CardTitle>
              <p className="text-xs text-charcoal-muted">Real-time Google Maps telemetry of active companion fleet</p>
            </div>
            <Badge variant="outline" className="text-xs text-accent bg-accent-light border-accent/20 gap-1.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Connected
            </Badge>
          </CardHeader>
          <div className="flex-1 min-h-[350px] w-full relative">
            <GoogleMapView
              center={{ lat: 13.0569, lng: 80.2522 }}
              zoom={13}
              companions={adminFleetCompanions as any}
              className="h-full w-full rounded-none border-none"
            />
          </div>
        </Card>

        {/* Pending ID Verification Queue */}
        <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white flex flex-col">
          <CardHeader className="p-5 border-b border-charcoal-border flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-navy-900">ID Verifications</CardTitle>
              <p className="text-xs text-charcoal-muted">Companions awaiting review</p>
            </div>
            <Badge variant="warning" className="text-xs font-bold">
              14 Pending
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto">
            {[
              { name: 'Sameer Joshi', city: 'Pune', doc: 'Aadhaar + Police Clearance', rate: 400 },
              { name: 'Kavita Menon', city: 'Kochi', doc: 'Passport + Nursing Cert', rate: 450 },
              { name: 'Amitabh Sen', city: 'Kolkata', doc: 'Voter ID + College ID', rate: 300 },
            ].map((v, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-charcoal-border text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-900 text-sm">{v.name}</span>
                  <span className="font-semibold text-charcoal-muted">{v.city}</span>
                </div>
                <p className="text-charcoal-muted text-[11px] font-medium">{v.doc}</p>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-[11px] font-semibold text-rose-600 border-rose-200">
                    Reject
                  </Button>
                  <Button size="sm" className="h-8 text-[11px] font-bold bg-accent hover:bg-accent-hover text-white shadow-subtle">
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
