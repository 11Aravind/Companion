'use client';

import { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  User,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { reviewVerificationAction } from '@/app/actions/admin';

interface VerificationRecord {
  id: string;
  companion_id: string;
  companion_name: string;
  companion_email: string;
  id_type: 'aadhaar' | 'passport' | 'driving_license' | 'voter_id';
  id_number_masked: string;
  front_image_url: string;
  back_image_url?: string;
  selfie_image_url: string;
  status: 'pending' | 'verified' | 'rejected';
  submitted_at: string;
  rejection_reason?: string;
}

const mockVerifications: VerificationRecord[] = [
  {
    id: 'v1111111-1111-1111-1111-111111111111',
    companion_id: 'c3333333-3333-3333-3333-333333333333',
    companion_name: 'Pooja Iyer',
    companion_email: 'pooja@companion.test',
    id_type: 'aadhaar',
    id_number_masked: 'XXXX-XXXX-4912',
    front_image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    back_image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    selfie_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    submitted_at: '2026-11-14 09:30 AM',
  },
  {
    id: 'v2222222-2222-2222-2222-222222222222',
    companion_id: 'c1111111-1111-1111-1111-111111111111',
    companion_name: 'Ananya Sharma',
    companion_email: 'ananya@companion.test',
    id_type: 'passport',
    id_number_masked: 'ZXXXX891',
    front_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    selfie_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    status: 'verified',
    submitted_at: '2026-11-10 03:15 PM',
  },
  {
    id: 'v3333333-3333-3333-3333-333333333333',
    companion_id: 'c4444444-4444-4444-4444-444444444444',
    companion_name: 'Deepak Nathan',
    companion_email: 'deepak@companion.test',
    id_type: 'driving_license',
    id_number_masked: 'TN-01-XXXX-2022',
    front_image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    selfie_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    status: 'rejected',
    submitted_at: '2026-11-12 11:20 AM',
    rejection_reason: 'Selfie does not match photo on submitted Driving License. Please retake in good lighting.',
  },
];

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<VerificationRecord[]>(mockVerifications);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [inspectRecord, setInspectRecord] = useState<VerificationRecord | null>(null);
  const [rejectionInput, setRejectionInput] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [processing, setProcessing] = useState(false);

  const filtered = verifications.filter((v) => (filter === 'all' ? true : v.status === filter));

  const handleReview = async (record: VerificationRecord, status: 'verified' | 'rejected') => {
    setProcessing(true);
    const reason = status === 'rejected' ? rejectionInput || 'Documentation failed verification checks' : undefined;

    const res = await reviewVerificationAction(record.id, record.companion_id, status, reason);
    if (res.success) {
      setVerifications((prev) =>
        prev.map((v) =>
          v.id === record.id
            ? { ...v, status, rejection_reason: reason }
            : v
        )
      );
      setInspectRecord(null);
      setShowRejectBox(false);
      setRejectionInput('');
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6 text-charcoal">
      {/* Title & Queue Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">ID Verification Queue</h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Strict biometric and government credential verification required before companions can take live bookings
          </p>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-charcoal-border shadow-subtle self-start md:self-auto">
          {(['pending', 'verified', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-navy-900 text-white shadow-subtle'
                  : 'text-charcoal-muted hover:text-navy-900'
              }`}
            >
              {tab} (
              {tab === 'all'
                ? verifications.length
                : verifications.filter((v) => v.status === tab).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Verifications Table (Stripe Style) */}
      <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] border-b border-charcoal-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Credential Type</th>
                <th className="py-3 px-4">ID Number</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border/70 bg-white">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-navy-900 block">{item.companion_name}</span>
                      <span className="text-[11px] text-charcoal-muted">{item.companion_email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 font-bold text-navy-900 capitalize text-xs bg-navy-50 px-2.5 py-1 rounded-md border border-charcoal-border">
                      <FileText className="h-3.5 w-3.5 text-charcoal-muted" />
                      {item.id_type.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-navy-900">
                    {item.id_number_masked}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-charcoal-muted">
                    {item.submitted_at}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.status === 'pending' && (
                      <Badge variant="warning" className="gap-1 text-[10px] py-0.5">
                        <Clock className="h-3 w-3" /> Awaiting Review
                      </Badge>
                    )}
                    {item.status === 'verified' && (
                      <Badge variant="success" className="gap-1 text-[10px] py-0.5">
                        <CheckCircle className="h-3 w-3" /> Approved
                      </Badge>
                    )}
                    {item.status === 'rejected' && (
                      <Badge variant="danger" className="gap-1 text-[10px] py-0.5">
                        <XCircle className="h-3 w-3" /> Rejected
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setInspectRecord(item);
                        setShowRejectBox(false);
                      }}
                      className="text-xs h-7 px-3 font-bold border-charcoal-border"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> Inspect
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal-muted">
                    No verification records in &quot;{filter}&quot; state.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Document Inspection & Decision Modal */}
      {inspectRecord && (
        <Modal
          isOpen={!!inspectRecord}
          onClose={() => setInspectRecord(null)}
          title={`Credential Audit: ${inspectRecord.companion_name}`}
        >
          <div className="space-y-5">
            <div className="bg-navy-50 p-3.5 rounded-2xl border border-charcoal-border text-xs flex justify-between items-center">
              <div>
                <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Document Type</span>
                <span className="font-bold text-navy-900 uppercase">{inspectRecord.id_type}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Masked ID Number</span>
                <span className="font-mono font-bold text-navy-900">{inspectRecord.id_number_masked}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Status</span>
                <span className="capitalize font-bold text-accent">{inspectRecord.status}</span>
              </div>
            </div>

            {/* Document & Selfie Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-charcoal-border rounded-2xl p-3 bg-white">
                <span className="text-xs font-bold text-navy-900 block mb-2">Government Document Scan</span>
                <div className="h-48 rounded-xl overflow-hidden bg-navy-50 flex items-center justify-center border border-charcoal-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inspectRecord.front_image_url}
                    alt="ID Document"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="border border-charcoal-border rounded-2xl p-3 bg-white">
                <span className="text-xs font-bold text-navy-900 block mb-2">Biometric Selfie Match</span>
                <div className="h-48 rounded-xl overflow-hidden bg-navy-50 flex items-center justify-center border border-charcoal-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inspectRecord.selfie_image_url}
                    alt="Selfie Check"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {inspectRecord.rejection_reason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
                <span className="font-bold block mb-0.5">Previous Rejection Reason:</span>
                {inspectRecord.rejection_reason}
              </div>
            )}

            {showRejectBox && (
              <div className="space-y-2 p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                <label className="text-xs font-bold text-amber-900 block">
                  Rejection Reason (Delivered to Companion)
                </label>
                <textarea
                  rows={2}
                  value={rejectionInput}
                  onChange={(e) => setRejectionInput(e.target.value)}
                  placeholder="e.g. Document image is blurry or expired. Please upload high-res color photo."
                  className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none"
                />
              </div>
            )}

            {/* Decision Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-charcoal-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectRecord(null)}
                disabled={processing}
                className="font-bold border-charcoal-border"
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {!showRejectBox ? (
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={processing}
                    onClick={() => setShowRejectBox(true)}
                    className="font-bold shadow-subtle"
                  >
                    Reject Credential
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={processing}
                    onClick={() => handleReview(inspectRecord, 'rejected')}
                    className="font-bold shadow-subtle"
                  >
                    Confirm Rejection
                  </Button>
                )}

                <Button
                  variant="default"
                  size="sm"
                  disabled={processing}
                  onClick={() => handleReview(inspectRecord, 'verified')}
                  className="bg-accent hover:bg-accent-hover text-white font-bold shadow-subtle"
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" /> Approve & Verify
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
