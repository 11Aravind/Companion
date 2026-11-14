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
    <div className="flex flex-col min-h-screen bg-[#F7F8FA] text-charcoal">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section (Uber + Airbnb Minimalist Clean Hero) */}
        <section className="relative overflow-hidden bg-[#14213D] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6">
          <div className="container mx-auto relative z-10 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-6 border border-white/15">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>100% Identity-Verified Personal Companions</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
              Never go alone. <br className="hidden sm:inline" />
              <span>Book a trusted personal companion.</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Safe, vetted accompaniment for hospital visits, personal shopping, fine dining, city exploration, or reliable presence.
            </p>

            {/* Quick Action Search Card */}
            <div className="mt-8 sm:mt-10 bg-white text-charcoal p-3.5 sm:p-5 rounded-3xl shadow-floating max-w-3xl mx-auto border border-charcoal-border">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="text-left px-3.5 py-2.5 rounded-2xl bg-navy-50 border border-charcoal-border">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Activity</span>
                  <span className="text-xs sm:text-sm font-bold text-navy-900">Hospital, Shopping, Dining…</span>
                </div>

                <div className="text-left px-3.5 py-2.5 rounded-2xl bg-navy-50 border border-charcoal-border">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">Location</span>
                  <span className="text-xs sm:text-sm font-bold text-navy-900">Search nearby companions…</span>
                </div>

                <Link href="/companions" className="w-full">
                  <Button size="lg" className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold h-full min-h-[46px] sm:min-h-[50px] rounded-2xl gap-2 shadow-subtle">
                    <Search className="h-4 w-4 text-accent" />
                    <span>Find Companions</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Trust Badges */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-white/70 font-semibold">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> Government ID Verified</span>
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-[#2583E8]" /> Live GPS Meeting Tracking</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Zero Awkwardness Guarantee</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3.5 py-1 rounded-full border border-accent/20">
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
              <ShieldCheck className="h-10 w-10 text-accent mx-auto mb-3" />
              <h2 className="text-3xl font-black text-white tracking-tight">
                Your Safety Is Our Priority
              </h2>
              <p className="text-xs sm:text-sm text-white/70 mt-2">
                We engineered our platform from the ground up to ensure safety, privacy, and full accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-subtle">
                <UserCheck className="h-6 w-6 text-accent mb-3" />
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
                <PhoneCall className="h-6 w-6 text-accent mb-3" />
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
              <Button size="lg" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 rounded-2xl shadow-subtle shrink-0">
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
