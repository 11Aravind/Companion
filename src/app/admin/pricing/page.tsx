'use client';

import { useState } from 'react';
import {
  CircleDollarSign,
  Percent,
  Clock,
  ShieldAlert,
  Save,
  CheckCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminPricingPage() {
  const [commissionPct, setCommissionPct] = useState(10);
  const [minHourlyRate, setMinHourlyRate] = useState(250);
  const [maxHourlyRate, setMaxHourlyRate] = useState(2500);
  const [cancellationCutoffHours, setCancellationCutoffHours] = useState(2);
  const [cancellationFeePct, setCancellationFeePct] = useState(25);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.15);
  const [surgeActive, setSurgeActive] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live Calculator State
  const [calcRate, setCalcRate] = useState(400);
  const [calcHours, setCalcHours] = useState(3);

  const subtotal = calcRate * calcHours * (surgeActive ? surgeMultiplier : 1);
  const platformFee = Math.round(subtotal * (commissionPct / 100));
  const totalCustomerPay = subtotal + platformFee;
  const companionNetEarnings = Math.round(subtotal);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">Pricing & Commissions Config</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure revenue share formulas, minimum wage thresholds, and automated late cancellation penalties.
          </p>
        </div>
        {savedSuccess && (
          <Badge variant="success" className="gap-1.5 py-1 px-3 text-xs">
            <CheckCircle className="h-3.5 w-3.5" /> Platform Pricing Policies Saved!
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Commission Card */}
          <Card className="p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <CircleDollarSign className="h-5 w-5 text-primary-600" />
              <h3 className="font-bold text-navy-950 text-base">Platform Service Commission</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Applied on top of companion booking subtotal during Razorpay order generation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Platform Commission Rate (%)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={commissionPct}
                    onChange={(e) => setCommissionPct(Number(e.target.value))}
                  />
                  <Percent className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Default: 10% standard fee</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Surge / Weekend Multiplier
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step={0.05}
                    min={1.0}
                    max={2.0}
                    value={surgeMultiplier}
                    onChange={(e) => setSurgeMultiplier(Number(e.target.value))}
                  />
                  <TrendingUp className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Active multiplier during high-demand</span>
              </div>
            </div>
          </Card>

          {/* Rate Guardrails */}
          <Card className="p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-navy-950 text-base">Companion Hourly Rate Guardrails</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enforces fair pricing boundaries across companion service configurations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Minimum Hourly Rate (₹)
                </label>
                <Input
                  type="number"
                  min={150}
                  step={50}
                  value={minHourlyRate}
                  onChange={(e) => setMinHourlyRate(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Maximum Hourly Rate (₹)
                </label>
                <Input
                  type="number"
                  min={1000}
                  step={100}
                  value={maxHourlyRate}
                  onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                />
              </div>
            </div>
          </Card>

          {/* Cancellation Policy */}
          <Card className="p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-navy-950 text-base">Late Cancellation Penalties</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Cutoff Window (Hours Before Start)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={24}
                  value={cancellationCutoffHours}
                  onChange={(e) => setCancellationCutoffHours(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Late Penalty Retained (%)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={cancellationFeePct}
                  onChange={(e) => setCancellationFeePct(Number(e.target.value))}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} className="gap-2">
              <Save className="h-4 w-4" /> Save Financial Policies
            </Button>
          </div>
        </div>

        {/* Live Settlement Calculator Preview */}
        <div>
          <Card className="p-6 border border-slate-200 sticky top-6 bg-slate-50/50">
            <h3 className="font-bold text-navy-950 text-base mb-1">Realtime Fee Simulator</h3>
            <p className="text-xs text-slate-500 mb-4">
              Inspect how the configured fee formula splits session revenue.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Companion Hourly Rate (₹)
                </label>
                <Input
                  type="number"
                  value={calcRate}
                  onChange={(e) => setCalcRate(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Session Duration (Hours)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={calcHours}
                  onChange={(e) => setCalcHours(Number(e.target.value))}
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-700 font-medium">Simulate Surge Hours</span>
                <input
                  type="checkbox"
                  checked={surgeActive}
                  onChange={(e) => setSurgeActive(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
              </div>
            </div>

            {/* Simulated Breakdown */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-primary-600 font-semibold">
                <span>Platform Fee ({commissionPct}%)</span>
                <span>+ ₹{platformFee.toFixed(0)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-navy-950 text-sm">
                <span>Customer Pays</span>
                <span>₹{totalCustomerPay.toFixed(0)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-emerald-700">
                <span>Companion Payout (Net)</span>
                <span>₹{companionNetEarnings.toFixed(0)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

