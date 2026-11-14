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

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-charcoal">
      <CompanionHeader isOnline={true} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Identity Verification</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            To protect community safety and build trust, all companions must submit official government verification
          </p>
        </div>

        {/* Status Banner */}
        {status === 'verified' && (
          <Card className="rounded-3xl border border-accent/30 bg-accent-light p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-accent text-white flex items-center justify-center shrink-0 shadow-subtle">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-navy-900 text-base">Your Identity Is Officially Verified</h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Aadhaar Document and Facial Biometric matched. You are approved to accept client accompaniment requests.
                </p>
              </div>
            </div>
            <Badge variant="accent" className="px-3.5 py-1 text-xs shrink-0 font-bold shadow-subtle">
              Verified Partner
            </Badge>
          </Card>
        )}

        {/* Verification Form */}
        <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b border-charcoal-border pb-4">
            <h3 className="text-base font-bold text-navy-900">Submitted Government Credentials</h3>
            <p className="text-xs text-charcoal-muted">Government ID details stored with bank-grade encryption</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal block mb-1.5">Document Type</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full h-11 rounded-xl border border-charcoal-border bg-white px-3 text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-navy-900"
              >
                <option value="aadhaar">Aadhaar Card (UIDAI)</option>
                <option value="passport">Indian Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="voter_id">Voter Identity Card</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal block mb-1.5">Masked Identification Number</label>
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
            <div className="p-4 rounded-2xl border-2 border-dashed border-charcoal-border bg-[#F7F8FA] text-center space-y-2">
              <FileText className="h-8 w-8 text-navy-900 mx-auto" />
              <span className="text-xs font-bold text-navy-900 block">ID Card Front</span>
              <span className="text-[11px] text-accent font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded & Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-dashed border-charcoal-border bg-[#F7F8FA] text-center space-y-2">
              <FileText className="h-8 w-8 text-navy-900 mx-auto" />
              <span className="text-xs font-bold text-navy-900 block">ID Card Back</span>
              <span className="text-[11px] text-accent font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded & Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-dashed border-charcoal-border bg-[#F7F8FA] text-center space-y-2">
              <Camera className="h-8 w-8 text-navy-900 mx-auto" />
              <span className="text-xs font-bold text-navy-900 block">Live Selfie Match</span>
              <span className="text-[11px] text-accent font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Biometrics Matched
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-navy-50 border border-charcoal-border text-xs text-charcoal flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Your full document scans are never displayed publicly. Clients only see the green "ID Verified" badge on your public companion profile.
            </span>
          </div>
        </Card>
      </main>
    </div>
  );
}
