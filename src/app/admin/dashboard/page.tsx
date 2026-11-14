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
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-navy-950 tracking-tight">Executive Operations Overview</h2>
        <p className="text-xs text-slate-500 mt-1">Platform KPIs, companion fleet activity, and safety metrics</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/90 shadow-sm p-5 bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Bookings (30d)</span>
            <CircleDollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-navy-950">{formatCurrency(482500)}</span>
          <span className="text-xs text-emerald-600 font-semibold block mt-1">+24.5% month over month</span>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm p-5 bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Companions Online</span>
            <UserCheck className="h-4 w-4 text-primary-600" />
          </div>
          <span className="text-2xl font-black text-navy-950">142</span>
          <span className="text-xs text-slate-500 block mt-1">Across 6 metro cities</span>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm p-5 bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active In-Session</span>
            <Calendar className="h-4 w-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-navy-950">37</span>
          <span className="text-xs text-purple-600 font-semibold block mt-1">Live GPS tracking active</span>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 shadow-sm p-5 bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending ID Approvals</span>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-navy-950">14</span>
          <span className="text-xs text-amber-600 font-semibold block mt-1">Requires admin review</span>
        </Card>
      </div>

      {/* Middle Row: Live Fleet Map View Placeholder & Quick Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Fleet Map container */}
        <Card className="lg:col-span-2 rounded-2xl border-slate-200/90 shadow-sm bg-white overflow-hidden flex flex-col">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-navy-950">Live Fleet Dispatch Radar</CardTitle>
              <p className="text-xs text-slate-500">Realtime Google Maps visualization of available companions</p>
            </div>
            <Badge variant="outline" className="text-xs text-emerald-700 bg-emerald-50 border-emerald-200 gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </Badge>
          </CardHeader>
          <div className="flex-1 min-h-[340px] bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
            <MapPin className="h-10 w-10 text-emerald-400 mb-2 animate-bounce" />
            <h4 className="text-base font-bold text-white">Google Maps Interactive Live Fleet Radar</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Displays online companions, ongoing companion sessions, and pickup waypoints in real-time.
            </p>
          </div>
        </Card>

        {/* Pending ID Verification Queue */}
        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white flex flex-col">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-navy-950">ID Verifications</CardTitle>
              <p className="text-xs text-slate-500">Companions awaiting approval</p>
            </div>
            <Badge variant="warning" className="text-xs">
              14 Pending
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto">
            {[
              { name: 'Sameer Joshi', city: 'Pune', doc: 'Aadhaar + Police Clearance', rate: 400 },
              { name: 'Kavita Menon', city: 'Kochi', doc: 'Passport + Nursing Cert', rate: 450 },
              { name: 'Amitabh Sen', city: 'Kolkata', doc: 'Voter ID + College ID', rate: 300 },
            ].map((v, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-950 text-sm">{v.name}</span>
                  <span className="font-semibold text-slate-500">{v.city}</span>
                </div>
                <p className="text-slate-600 text-[11px] font-medium">{v.doc}</p>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-[11px] text-rose-600 border-rose-200">
                    Reject
                  </Button>
                  <Button size="sm" className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white">
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

