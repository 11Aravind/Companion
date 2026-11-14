'use client';

import * as React from 'react';
import { CompanionHeader } from '@/components/shell/CompanionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CompanionEarningsPage() {
  const [isCashoutOpen, setIsCashoutOpen] = React.useState(false);
  const [upiId, setUpiId] = React.useState('ananya.sharma@okaxis');
  const [cashoutAmount, setCashoutAmount] = React.useState('5000');
  const [cashoutSuccess, setCashoutSuccess] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const availableBalance = 14850;

  const handleCashout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCashoutSuccess(true);
      setTimeout(() => {
        setIsCashoutOpen(false);
        setCashoutSuccess(false);
      }, 2000);
    }, 1000);
  };

  const EARNINGS_LEDGER = [
    {
      id: 'tx-1',
      date: '2026-11-14',
      client: 'Sanjay Varma',
      activity: 'Hospital Visit Companion',
      duration: '3 hours',
      gross: 1350,
      fee: 135,
      net: 1215,
      status: 'Settled to Wallet',
    },
    {
      id: 'tx-2',
      date: '2026-11-12',
      client: 'Nalini Chandran',
      activity: 'Shopping Companion',
      duration: '4 hours',
      gross: 1800,
      fee: 180,
      net: 1620,
      status: 'Settled to Wallet',
    },
    {
      id: 'tx-3',
      date: '2026-11-09',
      client: 'Vikas Rao',
      activity: 'Events & Social',
      duration: '5 hours',
      gross: 2500,
      fee: 250,
      net: 2250,
      status: 'Settled to Wallet',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CompanionHeader isOnline={true} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy-950 tracking-tight">Earnings & Bank Payouts</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your companion income, platform fees, and transfer funds to your bank account
            </p>
          </div>
          <Button
            onClick={() => setIsCashoutOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 h-11 rounded-xl shadow-md gap-2"
          >
            <ArrowUpRight className="h-4 w-4" /> Request Payout / Cashout
          </Button>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Available Balance</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-navy-950">{formatCurrency(availableBalance)}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Ready for payout
              </span>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Lifetime Earnings</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-navy-950">{formatCurrency(54200)}</span>
              <span className="text-xs font-semibold text-primary-600">52 sessions</span>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Platform Commission</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-slate-700">10%</span>
              <span className="text-xs text-slate-400">90% directly to you</span>
            </div>
          </Card>
        </div>

        {/* Payout Destination Account */}
        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary-600" />
              <div>
                <h3 className="text-sm font-bold text-navy-950">Linked Payout Account</h3>
                <p className="text-xs text-slate-500">Direct instant transfer via Razorpay Route / UPI</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Verified & Active
            </span>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">Primary UPI ID</span>
              <span className="font-bold text-navy-950">{upiId}</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs font-semibold h-8">
              Update Bank Details
            </Button>
          </div>
        </Card>

        {/* Earnings Transaction Ledger */}
        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
          <h3 className="text-base font-bold text-navy-950 mb-4">Completed Session Earnings Breakdown</h3>

          <div className="space-y-3">
            {EARNINGS_LEDGER.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-950 text-sm">{tx.activity}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{tx.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 mt-1">
                    <span>{formatDate(tx.date)}</span>
                    <span>•</span>
                    <span>{tx.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Gross: {formatCurrency(tx.gross)}</span>
                    <span className="font-bold text-emerald-700 text-sm">+{formatCurrency(tx.net)}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Cashout Modal */}
      <Modal
        isOpen={isCashoutOpen}
        onClose={() => setIsCashoutOpen(false)}
        title="Transfer Funds to Bank Account"
        description="Withdraw your companion earnings directly to your verified UPI ID or Bank Account"
      >
        {cashoutSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-navy-950">Payout Initiated!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your payout request for {formatCurrency(Number(cashoutAmount))} has been queued and sent to your bank.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Payout Amount (₹)</label>
              <Input
                type="number"
                min={500}
                max={availableBalance}
                value={cashoutAmount}
                onChange={(e) => setCashoutAmount(e.target.value)}
                icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Available balance: {formatCurrency(availableBalance)}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Destination UPI ID</label>
              <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Transfer Processing Time:</span>
              <span className="font-bold text-navy-950">Instant / Within 15 minutes</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setIsCashoutOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isProcessing}
                onClick={handleCashout}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 h-11 rounded-xl shadow-md"
              >
                Confirm Payout
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

