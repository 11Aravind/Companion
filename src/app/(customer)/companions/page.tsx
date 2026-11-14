'use client';

import * as React from 'react';
import { CustomerHeader } from '@/components/shell/CustomerHeader';
import { CompanionCard } from '@/components/companions/CompanionCard';
import { GoogleMapView } from '@/components/maps/GoogleMapView';
import { ACTIVITY_CATEGORIES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Star, ShieldCheck, MapPin, Map as MapIcon, Grid } from 'lucide-react';
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
    currentLocation: { lat: 13.0585, lng: 80.2498, address: 'Near Thousand Lights', updatedAt: '2026-11-14T10:00:00Z' },
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
    currentLocation: { lat: 13.0418, lng: 80.2341, address: 'T Nagar', updatedAt: '2026-11-14T10:00:00Z' },
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
    currentLocation: { lat: 13.0336, lng: 80.2678, address: 'Mylapore', updatedAt: '2026-11-14T10:00:00Z' },
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
    currentLocation: { lat: 13.0620, lng: 80.2610, address: 'Nungambakkam', updatedAt: '2026-11-14T10:00:00Z' },
  },
];

export default function CompanionsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [onlyOnline, setOnlyOnline] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'split'>('grid');
  const [selectedCompanion, setSelectedCompanion] = React.useState<CompanionProfile | null>(null);

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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-charcoal">
      <CustomerHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Browse Verified Companions</h1>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Filter by activity specialization, hourly rates, and live availability
            </p>
          </div>

          {/* Airbnb-style View Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-charcoal-border self-start sm:self-auto shadow-subtle">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-navy-900 text-white shadow-subtle'
                  : 'text-charcoal-muted hover:text-navy-900'
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'split'
                  ? 'bg-navy-900 text-white shadow-subtle'
                  : 'text-charcoal-muted hover:text-navy-900'
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Filters Header Bar */}
        <div className="bg-white p-4 rounded-2xl border border-charcoal-border shadow-subtle mb-6 space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search companions by name, specialization, or language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="h-10"
              />
            </div>
            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                onlyOnline
                  ? 'bg-accent-light text-accent border-accent/30 ring-2 ring-accent/20'
                  : 'bg-white text-charcoal border-charcoal-border hover:bg-navy-50'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${onlyOnline ? 'bg-accent' : 'bg-charcoal-muted'}`} />
              <span>Available Now</span>
            </button>
          </div>

          {/* Activity Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 text-white border-navy-900 shadow-subtle'
                  : 'bg-navy-50 text-charcoal border-charcoal-border hover:bg-white'
              }`}
            >
              All Categories
            </button>
            {ACTIVITY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  selectedCategory === cat.slug
                    ? 'bg-navy-900 text-white border-navy-900 shadow-subtle'
                    : 'bg-navy-50 text-charcoal border-charcoal-border hover:bg-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-xs font-bold text-charcoal-muted">
          Showing {filtered.length} verified companion{filtered.length === 1 ? '' : 's'}
        </div>

        {/* Split Map View or Full Grid View */}
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left list */}
            <div className="lg:col-span-6 space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {filtered.map((comp) => (
                <CompanionCard key={comp.id} companion={comp} />
              ))}
            </div>

            {/* Right sticky map */}
            <div className="lg:col-span-6 sticky top-24 h-[650px] rounded-3xl overflow-hidden border border-charcoal-border shadow-card bg-white">
              <GoogleMapView
                center={{ lat: 13.0569, lng: 80.2522 }}
                zoom={13}
                userLocation={{ lat: 13.0569, lng: 80.2522 }}
                companions={filtered}
                onCompanionClick={(c) => setSelectedCompanion(c)}
                className="h-full w-full"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((comp) => (
              <CompanionCard key={comp.id} companion={comp} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
