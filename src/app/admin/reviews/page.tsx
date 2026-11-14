'use client';

import { useState } from 'react';
import {
  ShieldAlert,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Filter,
  Eye,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { resolveReportAction } from '@/app/actions/admin';

interface ReportItem {
  id: string;
  reporter_name: string;
  reporter_role: 'customer' | 'companion';
  reported_user_name: string;
  reported_user_role: 'customer' | 'companion';
  booking_id?: string;
  reason: string;
  details: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
  resolution_notes?: string;
}

interface ReviewItem {
  id: string;
  reviewer_name: string;
  reviewee_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const mockReports: ReportItem[] = [
  {
    id: 'rep-1111-1111',
    reporter_name: 'Meera Krishnan',
    reporter_role: 'customer',
    reported_user_name: 'Deepak Nathan',
    reported_user_role: 'companion',
    booking_id: 'b8888888-8888',
    reason: 'Arrived 45 minutes late without prior notification',
    details: 'Companion was delayed significantly for the morning walk session, disrupting my schedule and causing safety distress.',
    status: 'open',
    created_at: '2026-11-13 08:30 AM',
  },
  {
    id: 'rep-2222-2222',
    reporter_name: 'Ananya Sharma',
    reporter_role: 'companion',
    reported_user_name: 'Suresh Menon',
    reported_user_role: 'customer',
    booking_id: 'b9999999-9999',
    reason: 'Inappropriate venue change request',
    details: 'Customer requested entering a non-public residential premises contrary to companion booking policy.',
    status: 'investigating',
    created_at: '2026-11-12 04:15 PM',
  },
];

const mockReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    reviewer_name: 'Vikram Seth',
    reviewee_name: 'Ananya Sharma',
    rating: 5,
    comment: 'Exceptional companion! Very knowledgeable about the modern art exhibits and kept the pace comfortable.',
    created_at: '2026-11-14',
  },
  {
    id: 'rev-2',
    reviewer_name: 'Meera Krishnan',
    reviewee_name: 'Karthik Raja',
    rating: 5,
    comment: 'Punctual, encouraging, and kept our morning run disciplined and energetic. Highly recommend!',
    created_at: '2026-11-13',
  },
  {
    id: 'rev-3',
    reviewer_name: 'Anita Roy',
    reviewee_name: 'Pooja Iyer',
    rating: 5,
    comment: 'Great networking presence at the startup mixer. Made introducing myself much less awkward!',
    created_at: '2026-11-11',
  },
];

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'reviews'>('reports');
  const [reports, setReports] = useState<ReportItem[]>(mockReports);
  const [reviews, setReviews] = useState<ReviewItem[]>(mockReviews);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredReports = reports.filter((r) =>
    statusFilter === 'all' ? true : r.status === statusFilter
  );

  const handleResolveReport = async (status: 'resolved' | 'dismissed' | 'investigating') => {
    if (!selectedReport) return;
    setIsProcessing(true);
    const res = await resolveReportAction(selectedReport.id, status, resolutionInput);
    if (res.success) {
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id
            ? { ...r, status, resolution_notes: resolutionInput || r.resolution_notes }
            : r
        )
      );
      setSelectedReport(null);
      setResolutionInput('');
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">Safety Reports & Review Moderation</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Maintain strict platform trust, investigate incident logs, and monitor participant feedback.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-white text-navy-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Safety Incidents ({reports.filter((r) => r.status === 'open').length} Open)
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-white text-navy-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Member Reviews ({reviews.length})
          </button>
        </div>
      </div>

      {activeTab === 'reports' ? (
        <div className="space-y-4">
          {/* Status filters */}
          <div className="flex items-center gap-2">
            {(['all', 'open', 'investigating', 'resolved'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === tab
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Reports Table */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Incident</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Reported Party</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-navy-950 block text-xs">{report.reason}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                          {report.details}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-semibold text-slate-800 block">{report.reporter_name}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {report.reporter_role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-semibold text-slate-800 block">{report.reported_user_name}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {report.reported_user_role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500">{report.created_at}</td>

                      <td className="py-3.5 px-4">
                        {report.status === 'open' && (
                          <Badge variant="danger" className="text-[11px]">
                            Open Alert
                          </Badge>
                        )}
                        {report.status === 'investigating' && (
                          <Badge variant="warning" className="text-[11px]">
                            Under Investigation
                          </Badge>
                        )}
                        {report.status === 'resolved' && (
                          <Badge variant="success" className="text-[11px]">
                            Resolved
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedReport(report);
                            setResolutionInput(report.resolution_notes || '');
                          }}
                          className="text-xs h-8 px-2.5"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Triage
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No reports found for &quot;{statusFilter}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Member Reviews Table */
        <Card className="overflow-hidden border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4">Companion</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Feedback</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-xs font-semibold text-navy-950">
                      {rev.reviewer_name}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {rev.reviewee_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-xs text-slate-800">{rev.rating}.0</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-md">
                      &quot;{rev.comment}&quot;
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">{rev.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Triage & Resolution Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Safety Incident Triage: ${selectedReport.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-1.5 text-red-900 font-bold mb-1">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                {selectedReport.reason}
              </div>
              <p className="text-red-800 leading-relaxed">{selectedReport.details}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Reporter</span>
                <span className="font-bold text-navy-950">{selectedReport.reporter_name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {selectedReport.reporter_role}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Reported User</span>
                <span className="font-bold text-navy-950">{selectedReport.reported_user_name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {selectedReport.reported_user_role}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy-950 block">Investigation & Resolution Notes</label>
              <textarea
                rows={3}
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="Log internal investigation findings, phone outreach notes, or disciplinary action taken..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelectedReport(null)}
                disabled={isProcessing}
              >
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isProcessing}
                  onClick={() => handleResolveReport('investigating')}
                >
                  Mark In Review
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  disabled={isProcessing}
                  onClick={() => handleResolveReport('resolved')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Resolve Incident
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

