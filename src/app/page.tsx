'use client';

import Link from 'next/link';
import {
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Lock,
  PhoneCall,
  UserCheck,
  Star,
} from 'lucide-react';
import { SiteHeader } from '@/components/shell/SiteHeader';
import { SiteFooter } from '@/components/shell/SiteFooter';
import { CategoryCard } from '@/components/companions/CategoryCard';
import { CompanionCard } from '@/components/companions/CompanionCard';
import { ACTIVITY_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { CompanionProfile } from '@/types/companion';

const DEMO_COMPANIONS: CompanionProfile[] = [
  {
    id: 'comp-1',
    userId: 'u-1',
    fullName: 'Ananya Sharma',
    headline: 'Healthcare Assistant & Patient Support Specialist',
    bio: 'Compassionate, trained nursing graduate available for hospital checkup queues, clinic visits, medicine collection, and patient reassurance.',
    city: 'Mumbai',
    serviceRadiusKm: 25,
    hourlyRate: 450,
    languages: ['English', 'Hindi', 'Marathi'],
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
    fullName: 'Rohan Mehra',
    headline: 'Fashion Stylist & Shopping Assistant',
    bio: 'Passionate wardrobe consultant helping with wedding shopping, mall visits, designer boutiques, and luggage handling with energetic enthusiasm.',
    city: 'Delhi NCR',
    serviceRadiusKm: 30,
    hourlyRate: 400,
    languages: ['English', 'Hindi', 'Punjabi'],
    categories: ['shopping', 'events-social'],
    isOnline: true,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 5.0,
    ratingCount: 42,
    completedBookings: 61,
  },
  {
    id: 'comp-3',
    userId: 'u-3',
    fullName: 'Priya Nambiar',
    headline: 'Cultural Heritage Guide & City Companion',
    bio: 'Born-and-raised local guide eager to accompany solo travelers to galleries, local food hotspots, architectural walks, and museum exhibits.',
    city: 'Bengaluru',
    serviceRadiusKm: 20,
    hourlyRate: 350,
    languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    categories: ['travel-city-tour', 'restaurant-dining'],
    isOnline: true,
    isVerified: true,
    identityStatus: 'verified',
    ratingAverage: 4.8,
    ratingCount: 29,
    completedBookings: 34,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA] text-charcoal">
      <SiteHeader />

      <main className="flex-1">
        {/* Split Hero Section (Uber Mobility + High-Contrast Yellow) */}
        <section className="relative overflow-hidden bg-[#14213D] text-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6">
          {/* Subtle geometric background overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8EBF0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="container mx-auto relative z-10 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Value Proposition & Instant Booking Search Widget */}
              <div className="lg:col-span-7 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/15 text-yellow-400 text-xs font-bold mb-5 border border-yellow-400/30">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                  <span>ON-DEMAND PERSONAL COMPANION PLATFORM</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  Never go alone. <br />
                  <span className="text-yellow-400">Book trusted companions on demand.</span>
                </h1>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                  Safe, background-checked accompaniment for hospital appointments, personal shopping, fine dining, solo travel, or reassuring everyday presence.
                </p>

                {/* Quick Match Booking Hub Widget */}
                <div className="mt-8 bg-white text-charcoal p-4 sm:p-5 rounded-2xl shadow-floating border border-charcoal-border max-w-xl">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-charcoal-border">
                    <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5 text-yellow-500" />
                      <span>Find Companions Near You</span>
                    </span>
                    <span className="text-[11px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
                      Instant Confirmation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
                    <div className="p-2.5 rounded-xl bg-navy-50 border border-charcoal-border">
                      <label className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">
                        Activity
                      </label>
                      <select
                        aria-label="Select Activity"
                        className="mt-1 w-full bg-transparent text-xs sm:text-sm font-bold text-navy-900 focus:outline-none cursor-pointer"
                      >
                        <option value="hospital-visit">🏥 Hospital & Clinic Visit</option>
                        <option value="shopping">🛍️ Shopping & Errands</option>
                        <option value="restaurant-dining">🍽️ Dining & Coffee</option>
                        <option value="travel-city-tour">🚗 City Tour & Travel</option>
                        <option value="events-social">🎟️ Social Events</option>
                        <option value="general-companion">🤝 General Companionship</option>
                      </select>
                    </div>

                    <div className="p-2.5 rounded-xl bg-navy-50 border border-charcoal-border">
                      <label className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">
                        Location / City
                      </label>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-[#2583E8] shrink-0" />
                        <input
                          type="text"
                          placeholder="Enter your location..."
                          defaultValue="Chennai Central"
                          className="w-full bg-transparent text-xs sm:text-sm font-bold text-navy-900 focus:outline-none placeholder:text-charcoal-muted/60"
                        />
                      </div>
                    </div>
                  </div>

                  <Link href="/companions" className="block w-full">
                    <Button
                      size="lg"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-black h-12 rounded-xl text-sm sm:text-base gap-2 shadow-subtle transition-all duration-200"
                    >
                      <Search className="h-4 w-4" />
                      <span>Search Available Companions</span>
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </Link>
                </div>

                {/* Hero Trust Badges */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/75 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-yellow-400" /> Government ID Verified
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-[#2583E8]" /> Live GPS Tracking
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400" /> 4-Digit In-Person PIN
                  </span>
                </div>
              </div>

              {/* Right Column: Live Companion & Mobility Dispatch Visual Cards */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                {/* Decorative background glow */}
                <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/20 via-yellow-500/10 to-[#2583E8]/20 rounded-3xl blur-2xl opacity-60" />

                <div className="relative space-y-3.5">
                  {/* Card 1: Companion Live Preview Card */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-floating border border-charcoal-border text-charcoal">
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-xl bg-navy-900 text-white font-bold flex items-center justify-center text-lg shadow-subtle">
                            AS
                          </div>
                          <span
                            className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-yellow-400 border-2 border-white shadow-subtle"
                            title="Online Now"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-navy-900 text-sm sm:text-base">Ananya Sharma</h4>
                            <ShieldCheck className="h-4 w-4 text-yellow-500" />
                          </div>
                          <p className="text-xs text-charcoal-muted font-medium">Healthcare & Patient Support Specialist</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Rate</span>
                        <span className="text-sm sm:text-base font-black text-navy-900">
                          ₹450<span className="text-xs font-normal text-charcoal-muted">/hr</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-navy-50 border border-charcoal-border mb-3.5">
                      <div className="flex items-center gap-1.5 text-navy-900 font-bold">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span>4.9</span>
                        <span className="text-charcoal-muted font-normal">(38 reviews)</span>
                      </div>
                      <span className="text-xs font-bold text-navy-900 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#2583E8]" /> 1.2 km away
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href="/companions/comp-1" className="flex-1">
                        <Button size="sm" variant="outline" className="w-full text-xs font-semibold h-9 border-charcoal-border">
                          View Profile
                        </Button>
                      </Link>
                      <Link href="/companions/comp-1" className="flex-1">
                        <Button size="sm" className="w-full bg-yellow-400 hover:bg-yellow-500 text-navy-900 text-xs font-bold h-9 shadow-subtle">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Card 2: Live Meeting Radar & GPS En Route */}
                  <div className="bg-[#1A2949] rounded-2xl p-4 shadow-floating border border-white/15 text-white">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
                        </span>
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                          Live Dispatch • Session En Route
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-white/10 text-white px-2 py-0.5 rounded border border-white/15">
                        PIN: 8492
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/80">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-[#2583E8] flex items-center justify-center text-white shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-semibold block text-white text-xs">Meeting at Apollo Hospital</span>
                          <span className="text-[11px] text-white/60">Companion arriving in ~8 mins</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Trust Counter Pill */}
                  <div className="p-3 rounded-xl bg-white text-charcoal border border-charcoal-border shadow-subtle flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-yellow-400 text-navy-900 flex items-center justify-center font-black">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold text-navy-900 block">1,200+ Verified Companions</span>
                        <span className="text-[11px] text-charcoal-muted">Active across 12 Indian Metropolitan Areas</span>
                      </div>
                    </div>
                    <Link href="/companions" className="text-xs font-bold text-navy-900 hover:text-yellow-600 flex items-center gap-1">
                      Browse <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Activity Categories Grid */}
        <section id="categories" className="py-20 bg-[#F7F8FA] px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-900 bg-navy-50 px-3.5 py-1 rounded-full border border-charcoal-border">
                Tailored Services
              </span>
              <h2 className="text-3xl font-black text-navy-900 mt-3 tracking-tight">
                Accompaniment for Every Moment
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
                Every companion is individually vetted, biometric verified, and ready to accompany you with utmost professionalism.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {ACTIVITY_CATEGORIES.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (Minimalist Steps) */}
        <section id="how-it-works" className="py-20 bg-white px-4 sm:px-6 border-y border-charcoal-border">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-700 bg-yellow-50 px-3.5 py-1 rounded-full border border-yellow-200">
                Simple Booking Flow
              </span>
              <h2 className="text-3xl font-black text-navy-900 mt-3 tracking-tight">
                How Companion Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Select Activity',
                  desc: 'Pick your activity: hospital assistance, shopping, dining, travel, or general companionship.',
                },
                {
                  step: '02',
                  title: 'Choose Companion',
                  desc: 'Browse verified profiles, hourly rates, client reviews, and language proficiencies.',
                },
                {
                  step: '03',
                  title: 'Set Date & Place',
                  desc: 'Specify your meeting location on Google Maps, set appointment date, time, and session duration.',
                },
                {
                  step: '04',
                  title: 'Meet & Live Track',
                  desc: 'Track companion en route via real-time GPS, verify with a 4-digit start PIN, and enjoy peace of mind.',
                },
              ].map((item, idx) => (
                <div key={idx} className="relative p-6 rounded-3xl bg-[#F7F8FA] border border-charcoal-border shadow-subtle">
                  <span className="text-2xl font-black text-navy-900/30 block mb-3 font-mono">{item.step}</span>
                  <h3 className="text-base font-bold text-navy-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Companions Showcase (Airbnb Presentation) */}
        <section className="py-20 bg-[#F7F8FA] px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-navy-900 bg-navy-50 px-3.5 py-1 rounded-full border border-charcoal-border">
                  Top Rated
                </span>
                <h2 className="text-3xl font-black text-navy-900 mt-3 tracking-tight">
                  Featured Verified Companions
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1">Available today for on-demand or scheduled bookings.</p>
              </div>
              <Link href="/companions" className="mt-4 sm:mt-0">
                <Button variant="outline" size="sm" className="font-bold text-xs gap-1.5 border-charcoal-border">
                  View All Companions <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEMO_COMPANIONS.map((companion) => (
                <CompanionCard key={companion.id} companion={companion} />
              ))}
            </div>
          </div>
        </section>

        {/* Safety & Security Guarantees */}
        <section id="safety" className="py-20 bg-[#14213D] text-white px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <ShieldCheck className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-3xl font-black text-white tracking-tight">
                Your Safety Is Our Priority
              </h2>
              <p className="text-xs sm:text-sm text-white/70 mt-2">
                We engineered our platform from the ground up to ensure safety, privacy, and full accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-subtle">
                <UserCheck className="h-6 w-6 text-yellow-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">Government ID Verification</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Every companion must submit verified government credentials and undergo background verification prior to receiving any booking requests.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-subtle">
                <Lock className="h-6 w-6 text-[#2583E8] mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">Private Location Sharing</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Companion live GPS is strictly accessible by the customer only after the booking is accepted and en route. Locations are never broadcast publicly.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-subtle">
                <PhoneCall className="h-6 w-6 text-yellow-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">In-App Chat & Voice Calling</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Coordinate meeting details without exposing private phone numbers. Secure WebRTC calling and real-time chat right inside the app.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Companion Partner Recruitment CTA */}
        <section className="py-16 bg-white border-t border-charcoal-border text-charcoal px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                Become a Verified Companion Partner
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1.5 max-w-xl">
                Set your own hourly rates, choose the activities you enjoy, manage your calendar availability, and earn with purpose.
              </p>
            </div>
            <Link href="/signup?role=companion">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-bold px-8 rounded-2xl shadow-subtle shrink-0">
                Register as Companion
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
