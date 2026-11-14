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
  Play,
  Building2,
  ChevronDown,
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
        {/* Hero Section matching the user's reference design */}
        <section className="relative overflow-hidden bg-[#0C1E34] text-white pt-12 sm:pt-16 lg:pt-20 pb-28 sm:pb-36 lg:pb-36 px-4 sm:px-6">
          <div className="container mx-auto relative z-10 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
              
              {/* Left Column: Heading, Subheading, CTAs, Trust indicators */}
              <div className="lg:col-span-7 text-left z-20">
                {/* Verified badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold mb-6 border border-white/15 backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 text-amber-400 fill-amber-400/20" />
                  <span className="tracking-wider uppercase text-[11px] font-bold text-white/90">
                    VERIFIED PERSONAL COMPANIONS
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                  Good company <br />
                  makes every <br />
                  journey{' '}
                  <span className="relative inline-block text-[#4ADE80]">
                    better.
                    {/* Hand-drawn yellow double wavy underline */}
                    <svg
                      className="absolute -bottom-2.5 left-0 w-full h-3.5 text-amber-400"
                      viewBox="0 0 100 20"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 8 Q25 0 50 8 T100 8"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 15 Q30 7 55 15 T95 15"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-6 text-sm sm:text-base lg:text-lg text-white/85 max-w-lg leading-relaxed font-normal">
                  Find trusted companions for hospital visits, shopping, dining, city exploration and everyday activities.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/companions">
                    <Button
                      size="lg"
                      className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-black h-12 px-7 rounded-full text-sm sm:text-base shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Find a Companion</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/#how-it-works">
                    <button
                      type="button"
                      className="inline-flex items-center gap-3 text-white hover:text-amber-400 font-bold text-sm sm:text-base py-2 px-3 transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-full border-2 border-white/80 group-hover:border-amber-400 flex items-center justify-center shrink-0 transition-colors">
                        <Play className="h-3.5 w-3.5 fill-white text-white group-hover:fill-amber-400 group-hover:text-amber-400 ml-0.5 transition-colors" />
                      </div>
                      <span>How it Works</span>
                    </button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-white/85">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#4ADE80]" />
                    <span>ID Verified</span>
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-[#4ADE80]" />
                    <span>Secure Booking</span>
                  </span>
                  <span className="text-white/30">|</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#4ADE80]" />
                    <span>GPS Tracking</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Companion Image with Organic Wave & Hand-drawn Accent Marks */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[480px]">
                  {/* Playful Yellow Sparkle / Accent Marks near senior's head */}
                  <div className="absolute top-2 left-6 z-20 text-amber-400 pointer-events-none select-none">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M6 24 C10 16 14 12 16 8" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                      <path d="M18 20 C22 12 26 8 28 4" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                      <path d="M26 24 C30 18 34 14 36 10" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Organic curved photo frame */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-tr from-[#0C1E34] via-[#0F2847] to-[#12335C]">
                    <img
                      src="/images/hero-companion.jpg"
                      alt="Caring verified companion supporting smiling elderly woman outdoors"
                      className="w-full h-auto object-cover object-center max-h-[440px] rounded-3xl"
                    />

                    {/* Subtle green leaves / organic accent decor in bottom corner */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Organic White Wave Curve at bottom */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
            <svg
              className="relative block w-full h-12 sm:h-16 lg:h-20 text-[#F7F8FA]"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" />
            </svg>
          </div>
        </section>

        {/* Floating Search Bar (Positioned overlapping the bottom curve) */}
        <div className="relative z-30 -mt-12 sm:-mt-16 lg:-mt-14 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-floating border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
              
              {/* Activity Segment */}
              <div className="flex-1 flex items-center gap-3 px-3 sm:px-4 py-2 hover:bg-slate-50/80 rounded-xl transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    ACTIVITY
                  </span>
                  <select
                    aria-label="Select Activity"
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer truncate"
                    defaultValue="all"
                  >
                    <option value="all">Hospital, Shopping, Dining...</option>
                    <option value="hospital-visit">Hospital & Clinic Visit</option>
                    <option value="shopping">Shopping & Errands</option>
                    <option value="restaurant-dining">Dining & Coffee Chat</option>
                    <option value="travel-city-tour">City Tour & Travel Transit</option>
                    <option value="events-social">Social Events & Weddings</option>
                    <option value="general-companion">General Companionship</option>
                  </select>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-10 bg-slate-200" />

              {/* Location Segment */}
              <div className="flex-1 flex items-center gap-3 px-3 sm:px-4 py-2 hover:bg-slate-50/80 rounded-xl transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    LOCATION
                  </span>
                  <input
                    type="text"
                    placeholder="Search nearby companions..."
                    defaultValue="Chennai Central"
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400 truncate"
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
              </div>

              {/* Find Companions CTA Button */}
              <Link href="/companions" className="shrink-0">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-[#064E3B] hover:bg-[#043B2C] text-white font-bold h-12 px-7 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg"
                >
                  <Search className="h-4 w-4 text-amber-400 font-bold" />
                  <span>Find Companions</span>
                </Button>
              </Link>

            </div>
          </div>
        </div>

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
