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
    <div className="space-y-6">
      {/* Title & Queue Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">ID Verification Queue</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Strict biometric and government credential verification required before companions can take live bookings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['pending', 'verified', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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

      {/* Verifications Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Credential Type</th>
                <th className="py-3 px-4">ID Number</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-navy-950 block">{item.companion_name}</span>
                      <span className="text-xs text-slate-500">{item.companion_email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 capitalize text-xs bg-slate-100 px-2.5 py-1 rounded-md">
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      {item.id_type.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800">
                    {item.id_number_masked}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {item.submitted_at}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.status === 'pending' && (
                      <Badge variant="warning" className="gap-1 text-[11px]">
                        <Clock className="h-3 w-3" /> Awaiting Review
                      </Badge>
                    )}
                    {item.status === 'verified' && (
                      <Badge variant="success" className="gap-1 text-[11px]">
                        <CheckCircle className="h-3 w-3" /> Approved
                      </Badge>
                    )}
                    {item.status === 'rejected' && (
                      <Badge variant="danger" className="gap-1 text-[11px]">
                        <XCircle className="h-3 w-3" /> Rejected
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setInspectRecord(item);
                        setShowRejectBox(false);
                      }}
                      className="text-xs h-8 px-3"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> Inspect
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
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
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500 block">Document Type</span>
                <span className="font-bold text-navy-950 uppercase">{inspectRecord.id_type}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Masked ID Number</span>
                <span className="font-mono font-bold text-navy-950">{inspectRecord.id_number_masked}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status</span>
                <span className="capitalize font-bold text-primary-600">{inspectRecord.status}</span>
              </div>
            </div>

            {/* Document & Selfie Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <span className="text-xs font-bold text-slate-700 block mb-2">Government Document Scan</span>
                <div className="h-48 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inspectRecord.front_image_url}
                    alt="ID Document"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-white">
                <span className="text-xs font-bold text-slate-700 block mb-2">Biometric Selfie Match</span>
                <div className="h-48 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border">
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
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                <span className="font-bold block mb-0.5">Previous Rejection Reason:</span>
                {inspectRecord.rejection_reason}
              </div>
            )}

            {showRejectBox && (
              <div className="space-y-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <label className="text-xs font-bold text-amber-900 block">
                  Rejection Reason (Delivered to Companion)
                </label>
                <textarea
                  rows={2}
                  value={rejectionInput}
                  onChange={(e) => setRejectionInput(e.target.value)}
                  placeholder="e.g. Document image is blurry or expired. Please upload high-res color photo."
                  className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
                />
              </div>
            )}

            {/* Decision Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setInspectRecord(null)}
                disabled={processing}
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
                  >
                    Reject Credential
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={processing}
                    onClick={() => handleReview(inspectRecord, 'rejected')}
                  >
                    Confirm Rejection
                  </Button>
                )}

                <Button
                  variant="default"
                  size="sm"
                  disabled={processing}
                  onClick={() => handleReview(inspectRecord, 'verified')}
                  className="bg-emerald-600 hover:bg-emerald-700"
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

