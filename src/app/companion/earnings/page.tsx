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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-charcoal">
      <CompanionHeader isOnline={true} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Earnings & Payouts</h1>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Track companion revenue, platform service share, and withdraw directly to your bank account
            </p>
          </div>
          <Button
            onClick={() => setIsCashoutOpen(true)}
            className="bg-accent hover:bg-accent-hover text-white font-bold px-6 h-11 rounded-xl shadow-subtle gap-2"
          >
            <ArrowUpRight className="h-4 w-4" /> Request Payout
          </Button>
        </div>

        {/* Financial KPI Cards (Stripe Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Available Balance</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-navy-900">{formatCurrency(availableBalance)}</span>
              <span className="text-xs font-bold text-accent bg-accent-light px-2.5 py-0.5 rounded-full border border-accent/20">
                Ready for cashout
              </span>
            </div>
          </Card>

          <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Lifetime Earnings</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-navy-900">{formatCurrency(54200)}</span>
              <span className="text-xs font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded-full border border-charcoal-border">52 sessions</span>
            </div>
          </Card>

          <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
            <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Platform Take Rate</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-navy-900">10%</span>
              <span className="text-xs text-charcoal-muted">90% retained</span>
            </div>
          </Card>
        </div>

        {/* Payout Destination Account */}
        <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
          <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-navy-900" />
              <div>
                <h3 className="text-sm font-bold text-navy-900">Linked Bank / UPI Payout Account</h3>
                <p className="text-xs text-charcoal-muted">Automated route clearing via Razorpay & instant UPI</p>
              </div>
            </div>
            <span className="text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full border border-accent/20">
              Verified & Active
            </span>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs">
            <div>
              <span className="text-charcoal-muted block text-[10px] uppercase font-bold tracking-wider">Primary UPI ID</span>
              <span className="font-bold text-navy-900">{upiId}</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs font-bold h-8 border-charcoal-border">
              Update Details
            </Button>
          </div>
        </Card>

        {/* Earnings Transaction Ledger */}
        <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
          <h3 className="text-base font-bold text-navy-900 mb-4">Completed Session Earnings Breakdown</h3>

          <div className="space-y-3">
            {EARNINGS_LEDGER.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#F7F8FA] border border-charcoal-border text-xs gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900 text-sm">{tx.activity}</span>
                    <span className="text-charcoal-muted">•</span>
                    <span className="text-charcoal-muted">{tx.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-muted mt-1 text-[11px]">
                    <span>{formatDate(tx.date)}</span>
                    <span>•</span>
                    <span>{tx.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-charcoal-muted block text-[10px]">Gross: {formatCurrency(tx.gross)}</span>
                    <span className="font-bold text-accent text-sm">+{formatCurrency(tx.net)}</span>
                  </div>
                  <span className="text-[11px] font-bold text-navy-900 bg-white border border-charcoal-border px-3 py-1 rounded-full shadow-subtle">
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
        description="Withdraw companion income directly to your verified UPI ID or Bank Account"
      >
        {cashoutSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-accent mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-navy-900">Payout Initiated!</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              Your payout request for {formatCurrency(Number(cashoutAmount))} has been queued and sent to your bank.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-charcoal block mb-1.5">Payout Amount (₹)</label>
              <Input
                type="number"
                min={500}
                max={availableBalance}
                value={cashoutAmount}
                onChange={(e) => setCashoutAmount(e.target.value)}
                icon={<DollarSign className="h-4 w-4 text-accent" />}
              />
              <span className="text-[11px] text-charcoal-muted mt-1 block">
                Available balance: {formatCurrency(availableBalance)}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal block mb-1.5">Destination UPI ID</label>
              <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} />
            </div>

            <div className="p-3.5 rounded-xl bg-navy-50 border border-charcoal-border text-xs text-charcoal flex items-center justify-between">
              <span className="text-charcoal-muted">Processing Time:</span>
              <span className="font-bold text-navy-900">Instant / Within 15 minutes</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setIsCashoutOpen(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isProcessing}
                onClick={handleCashout}
                className="bg-accent hover:bg-accent-hover text-white font-bold px-6 h-11 rounded-xl shadow-subtle"
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
