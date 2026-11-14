'use client';

import * as React from 'react';
import { CompanionHeader } from '@/components/shell/CompanionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ACTIVITY_CATEGORIES } from '@/lib/constants';
import { useUser } from '@/hooks/useUser';
import { User, MapPin, DollarSign, Languages, Layers, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CompanionProfilePage() {
  const { profile } = useUser();

  const [fullName, setFullName] = React.useState(profile?.fullName || 'Ananya Sharma');
  const [headline, setHeadline] = React.useState('Healthcare Assistant & Patient Support Specialist');
  const [bio, setBio] = React.useState(
    'Compassionate, trained nursing graduate available for hospital checkup queues, clinic visits, medicine collection, and patient reassurance.'
  );
  const [city, setCity] = React.useState('Chennai');
  const [hourlyRate, setHourlyRate] = React.useState(450);
  const [serviceRadiusKm, setServiceRadiusKm] = React.useState(25);
  const [languages, setLanguages] = React.useState('English, Tamil, Hindi');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([
    'hospital-visit',
    'general-companion',
    'shopping',
  ]);
  const [isSaved, setIsSaved] = React.useState(false);

  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter((s) => s !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CompanionHeader isOnline={true} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy-950 tracking-tight">Companion Profile Settings</h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure your public bio, specializations, hourly rates, and coverage radius
            </p>
          </div>
          <Badge variant="success" className="gap-1 py-1 px-3 self-start sm:self-auto">
            <ShieldCheck className="h-4 w-4" /> ID Verified Partner
          </Badge>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Companion profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Presentation */}
          <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-navy-950 pb-2 border-b border-slate-100">
              Public Profile Presentation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Legal Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} icon={<User className="h-4 w-4" />} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Base Operating City</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} icon={<MapPin className="h-4 w-4" />} />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Professional Headline</label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Healthcare Assistant & Patient Support Specialist"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">About You / Introduction</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Introduce yourself, your background, empathy, and how you assist clients..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Languages Spoken (comma separated)</label>
                <Input
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  icon={<Languages className="h-4 w-4" />}
                />
              </div>
            </div>
          </Card>

          {/* Pricing & Service Radius */}
          <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-navy-950 pb-2 border-b border-slate-100">
              Pricing & Service Coverage
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Hourly Rate (₹ / hour)</label>
                <Input
                  type="number"
                  min={100}
                  max={5000}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  You earn 90% of this fare. 10% platform safety commission applies.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Max Service Radius (km)</label>
                <Input
                  type="number"
                  min={5}
                  max={100}
                  value={serviceRadiusKm}
                  onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                  icon={<MapPin className="h-4 w-4 text-primary-600" />}
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Only customers booking meeting spots within {serviceRadiusKm} km will see you.
                </span>
              </div>
            </div>
          </Card>

          {/* Activity Category Specializations */}
          <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6 space-y-3">
            <h3 className="text-base font-bold text-navy-950 pb-2 border-b border-slate-100">
              Activity Categories You Offer
            </h3>
            <p className="text-xs text-slate-500">
              Select which accompaniment activities you feel confident and experienced in providing:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {ACTIVITY_CATEGORIES.map((cat) => {
                const active = selectedCategories.includes(cat.slug);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.slug)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-primary-50/70 border-primary-500 ring-2 ring-primary-500/20 text-navy-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center text-xs shrink-0 ${
                        active ? 'bg-primary-600 text-white font-bold' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {active && '✓'}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{cat.name}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{cat.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 h-11 rounded-xl shadow-md gap-2"
            >
              <Save className="h-4 w-4" /> Save Companion Profile
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

