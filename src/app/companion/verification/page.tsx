'use client';

import * as React from 'react';
import { CompanionHeader } from '@/components/shell/CompanionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  ShieldAlert,
  Upload,
  CheckCircle2,
  FileText,
  Camera,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export default function CompanionVerificationPage() {
  const [idType, setIdType] = React.useState('aadhaar');
  const [idNumberMasked, setIdNumberMasked] = React.useState('XXXX-XXXX-8492');
  const [status, setStatus] = React.useState<'unverified' | 'pending' | 'verified' | 'rejected'>('verified');
  const [frontUploaded, setFrontUploaded] = React.useState(true);
  const [selfieUploaded, setSelfieUploaded] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CompanionHeader isOnline={true} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">Identity Verification Workflow</h1>
          <p className="text-xs text-slate-500 mt-1">
            To protect community safety and build trust, all companions must submit official government verification
          </p>
        </div>

        {/* Status Banner */}
        {status === 'verified' && (
          <Card className="rounded-2xl border-emerald-300 bg-emerald-50/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-base">Your Identity Is Officially Verified</h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Aadhaar Document and Facial Biometric matched. You are approved to accept client accompaniment requests.
                </p>
              </div>
            </div>
            <Badge variant="success" className="bg-emerald-600 text-white px-3 py-1 text-xs shrink-0 font-bold">
              Active Verified Partner
            </Badge>
          </Card>
        )}

        {/* Verification Form */}
        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-navy-950">Submitted Government Credentials</h3>
            <p className="text-xs text-slate-500">Government ID details stored with bank-grade encryption</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Document Type</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="aadhaar">Aadhaar Card (UIDAI)</option>
                <option value="passport">Indian Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="voter_id">Voter Identity Card</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Masked Identification Number</label>
              <Input
                value={idNumberMasked}
                onChange={(e) => setIdNumberMasked(e.target.value)}
                placeholder="XXXX-XXXX-1234"
                className="h-11"
              />
            </div>
          </div>

          {/* Document Upload Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
              <FileText className="h-8 w-8 text-primary-600 mx-auto" />
              <span className="text-xs font-bold text-navy-950 block">ID Card Front</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded & Verified
              </span>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
              <FileText className="h-8 w-8 text-primary-600 mx-auto" />
              <span className="text-xs font-bold text-navy-950 block">ID Card Back</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded & Verified
              </span>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center space-y-2">
              <Camera className="h-8 w-8 text-purple-600 mx-auto" />
              <span className="text-xs font-bold text-navy-950 block">Live Selfie Match</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Biometrics Matched
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Your full document scans are never shown to clients. Clients only see the green "ID Verified" badge on your public profile.
            </span>
          </div>
        </Card>
      </main>
    </div>
  );
}

