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
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-14 sm:py-20 lg:py-28 px-4 sm:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="container mx-auto relative z-10 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-[11px] sm:text-xs font-semibold mb-5 sm:mb-6 border border-white/10 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>100% Identity-Verified Personal Companions</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
              Never go alone. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-primary-300 to-sky-400">
                Book a trusted companion for any moment.
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Safe, vetted accompaniment for hospital appointments, shopping trips, dining dates, travel exploration, or friendly conversation.
            </p>

            {/* Quick Action Card */}
            <div className="mt-8 sm:mt-10 bg-white/95 text-slate-900 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl mx-auto backdrop-blur-md border border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="text-left px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Activity</span>
                  <span className="text-xs sm:text-sm font-semibold text-navy-950">Select an activity…</span>
                </div>

                <div className="text-left px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Meeting City</span>
                  <span className="text-xs sm:text-sm font-semibold text-navy-950">Detecting location…</span>
                </div>

                <Link href="/companions" className="w-full">
                  <Button size="lg" className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold h-full min-h-[46px] sm:min-h-[50px] rounded-xl gap-2 shadow-md">
                    <Search className="h-4 w-4 text-emerald-400" />
                    <span>Find Companions</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Trust Badges */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Aadhaar / ID Verified</span>
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-sky-400" /> Live GPS Meeting Tracking</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Pure Companionship</span>
            </div>
          </div>
        </section>

        {/* Activity Categories Grid */}
        <section id="categories" className="py-20 bg-slate-50 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Tailored Services
              </span>
              <h2 className="text-3xl font-extrabold text-navy-950 mt-3 tracking-tight">
                Choose the companion activity you need
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Every companion is individually vetted, background checked, and ready to accompany you with utmost professionalism.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {ACTIVITY_CATEGORIES.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white px-4 sm:px-6 border-y border-slate-200">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Seamless Experience
              </span>
              <h2 className="text-3xl font-extrabold text-navy-950 mt-3 tracking-tight">
                How Companion works in 4 easy steps
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
                <div key={idx} className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-3xl font-black text-slate-300 block mb-3">{item.step}</span>
                  <h3 className="text-base font-bold text-navy-950 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Companions Showcase */}
        <section className="py-20 bg-slate-50 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  Top Rated
                </span>
                <h2 className="text-3xl font-extrabold text-navy-950 mt-3 tracking-tight">
                  Featured Verified Companions
                </h2>
                <p className="text-sm text-slate-500 mt-1">Available today for on-demand or scheduled bookings.</p>
              </div>
              <Link href="/companions" className="mt-4 sm:mt-0">
                <Button variant="outline" size="sm" className="font-semibold text-xs gap-1.5">
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
        <section id="safety" className="py-20 bg-navy-950 text-white px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Your Safety Is Our Uncompromising Priority
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                We engineered our platform from the ground up to ensure safety, privacy, and full accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <UserCheck className="h-6 w-6 text-emerald-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">Government ID Verification</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every companion must submit verified government credentials and undergo administrative background verification prior to receiving any booking requests.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Lock className="h-6 w-6 text-sky-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">Private Location Sharing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Companion live GPS is strictly accessible by the customer only after the booking is accepted and en route. Locations are never broadcast publicly.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <PhoneCall className="h-6 w-6 text-amber-400 mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">In-App Chat & Voice Calling</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Coordinate meeting details without exposing private personal phone numbers. Secure WebRTC calling and real-time chat right inside the app.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Companion Partner Recruitment CTA */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Become a Verified Companion Partner
              </h2>
              <p className="text-sm text-emerald-100 mt-1.5 max-w-xl">
                Set your own hourly rates, choose the activities you enjoy, manage your calendar availability, and earn with purpose.
              </p>
            </div>
            <Link href="/signup?role=companion">
              <Button size="lg" className="bg-white text-navy-950 hover:bg-slate-100 font-bold px-8 rounded-xl shadow-lg shrink-0">
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

