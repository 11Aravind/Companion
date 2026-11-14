'use client';

import * as React from 'react';
import { CustomerHeader } from '@/components/shell/CustomerHeader';
import { CompanionCard } from '@/components/companions/CompanionCard';
import { ACTIVITY_CATEGORIES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Star, ShieldCheck, MapPin } from 'lucide-react';
import { CompanionProfile } from '@/types/companion';

const ALL_COMPANIONS: CompanionProfile[] = [
  {
    id: 'comp-1',
    userId: 'u-1',
    fullName: 'Ananya Sharma',
    headline: 'Healthcare Assistant & Patient Support Specialist',
    bio: 'Compassionate, trained nursing graduate available for hospital checkup queues, clinic visits, medicine collection, and patient reassurance.',
    city: 'Chennai',
    serviceRadiusKm: 25,
    hourlyRate: 450,
    languages: ['English', 'Tamil', 'Hindi'],
    categories: ['hospital-visit', 'general-companion'],
    isOnline: true,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 4.9,
    ratingCount: 38,
    completedBookings: 52,
  },
  {
    id: 'comp-2',
    userId: 'u-2',
    fullName: 'Karthik Raja',
    headline: 'Personal Shopper & Gadget Sourcing Companion',
    bio: 'Specialist for electronic shopping, mall visits, gadget testing, and carrying assistance across T Nagar and Phoenix Marketcity.',
    city: 'Chennai',
    serviceRadiusKm: 20,
    hourlyRate: 350,
    languages: ['English', 'Tamil'],
    categories: ['shopping', 'events-social'],
    isOnline: true,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 4.9,
    ratingCount: 27,
    completedBookings: 39,
  },
  {
    id: 'comp-3',
    userId: 'u-3',
    fullName: 'Deepa Krishnan',
    headline: 'Culinary Enthusiast & Fine Dining Companion',
    bio: 'Food writer & warm conversationalist ready to join you for gourmet restaurant tastings, coffee chats, and social networking lunches.',
    city: 'Chennai',
    serviceRadiusKm: 15,
    hourlyRate: 300,
    languages: ['English', 'Tamil', 'Malayalam'],
    categories: ['restaurant-dining', 'general-companion'],
    isOnline: false,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 4.8,
    ratingCount: 31,
    completedBookings: 44,
  },
  {
    id: 'comp-4',
    userId: 'u-4',
    fullName: 'Venkatesh Prasad',
    headline: 'Senior Citizen Support & Friendly Stroll Companion',
    bio: 'Patient, attentive companion specializing in morning walks, library trips, bank errands, and engaging nostalgic discussions.',
    city: 'Chennai',
    serviceRadiusKm: 18,
    hourlyRate: 250,
    languages: ['Tamil', 'Telugu', 'English'],
    categories: ['general-companion', 'hospital-visit'],
    isOnline: true,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 5.0,
    ratingCount: 19,
    completedBookings: 28,
  },
];

export default function CompanionsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedCity, setSelectedCity] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [onlyOnline, setOnlyOnline] = React.useState(false);

  const filtered = ALL_COMPANIONS.filter((c) => {
    if (selectedCategory !== 'all' && !c.categories.includes(selectedCategory)) return false;
    if (onlyOnline && !c.isOnline) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = c.fullName.toLowerCase().includes(q);
      const matchBio = c.bio.toLowerCase().includes(q);
      const matchLang = c.languages.some((l) => l.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchLang) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CustomerHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-navy-950 tracking-tight">Browse Verified Companions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Filter by activity specialization, availability, and client ratings
          </p>
        </div>

        {/* Filters Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search companions by name, skill, or language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="h-10"
              />
            </div>
            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                onlyOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${onlyOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>Available Now</span>
            </button>
          </div>

          {/* Activity Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {ACTIVITY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.slug
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Grid */}
        <div className="mb-4 text-xs font-semibold text-slate-500">
          Showing {filtered.length} verified companion{filtered.length === 1 ? '' : 's'}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((comp) => (
            <CompanionCard key={comp.id} companion={comp} />
          ))}
        </div>
      </main>
    </div>
  );
}

