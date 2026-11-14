'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  Lock,
  UserCheck,
  Star,
  Users,
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
    <div className="flex flex-col min-h-screen bg-white text-black font-uber">
      <SiteHeader />

      <main className="flex-1">
        {/* Uber Hero Section (Black & White, Reduced Text, Uber Move Typography) */}
        <section className="relative bg-black text-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Uber Request Hub */}
              <div className="lg:col-span-7 text-left">
                {/* Uber-style Category Tabs */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-medium">
                    <Users className="h-4 w-4" />
                    <span>Request Companion</span>
                  </div>
                  <Link
                    href="/signup?role=companion"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white text-xs font-medium transition-colors"
                  >
                    <span>Earn as Companion</span>
                  </Link>
                </div>

                {/* Uber Headline (Bold, Tight Tracking) */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                  Go anywhere. <br />
                  With someone you trust.
                </h1>

                {/* Reduced Subtitle */}
                <p className="mt-4 text-base sm:text-lg text-neutral-300 font-normal max-w-lg">
                  Request a verified personal companion for hospital appointments, shopping, dining, or travel.
                </p>

                {/* Uber Booking Card */}
                <div className="mt-8 bg-white text-black p-5 sm:p-6 rounded-2xl shadow-xl max-w-lg">
                  <div className="space-y-2.5 mb-3.5">
                    {/* Location field with Uber dot */}
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-black shrink-0" />
                      <input
                        type="text"
                        placeholder="Meeting location"
                        defaultValue="Chennai Central"
                        className="w-full bg-[#F6F6F6] text-black font-medium text-sm pl-9 pr-4 py-3.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-black placeholder:text-neutral-400"
                      />
                    </div>

                    {/* Activity field with Uber square */}
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-black shrink-0" />
                      <select
                        aria-label="Select Activity"
                        className="w-full bg-[#F6F6F6] text-black font-medium text-sm pl-9 pr-4 py-3.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-black cursor-pointer truncate"
                        defaultValue="all"
                      >
                        <option value="all">Select activity (Hospital, Shopping, Dining...)</option>
                        <option value="hospital-visit">Hospital & Clinic Visit</option>
                        <option value="shopping">Shopping & Errands</option>
                        <option value="restaurant-dining">Dining & Coffee Chat</option>
                        <option value="travel-city-tour">City Tour & Travel Transit</option>
                        <option value="events-social">Social Events & Weddings</option>
                        <option value="general-companion">General Companionship</option>
                      </select>
                    </div>
                  </div>

                  {/* Uber Full-width CTA */}
                  <Link href="/companions" className="block w-full">
                    <Button
                      size="lg"
                      className="w-full bg-black hover:bg-neutral-800 text-white font-medium h-12 rounded-lg text-sm sm:text-base transition-colors"
                    >
                      See available companions
                    </Button>
                  </Link>

                  {/* Micro Trust */}
                  <p className="mt-3 text-xs text-neutral-500 text-center font-normal">
                    Verified companions • Live GPS tracking • In-person PIN
                  </p>
                </div>
              </div>

              {/* Right Column: Hero Visual */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[460px] rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-950">
                  <img
                    src="/images/hero-companion.jpg"
                    alt="Verified companion supporting senior citizen"
                    className="w-full h-auto object-cover object-center max-h-[440px] rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs flex items-center justify-between">
                    <span className="font-medium">1,200+ Verified Companions</span>
                    <span className="text-neutral-400">12 Cities</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 1: Ways to Move (Uber Activity Grid - Reduced Text) */}
        <section id="categories" className="py-16 sm:py-20 bg-white px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="max-w-xl mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
                Ways to move with Companion
              </h2>
              <p className="text-sm text-neutral-600 mt-2 font-normal">
                Choose an accompaniment tailored to your destination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {ACTIVITY_CATEGORIES.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: How It Works (Reduced text!) */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-[#F6F6F6] px-4 sm:px-6 border-y border-[#EEEEEE]">
          <div className="container mx-auto max-w-5xl">
            <div className="max-w-xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
                How it works
              </h2>
              <p className="text-sm text-neutral-600 mt-2 font-normal">
                Book in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: '01',
                  title: 'Choose an activity',
                  desc: 'Select hospital visits, shopping, dining, or travel transit.',
                },
                {
                  step: '02',
                  title: 'Select a companion',
                  desc: 'Compare verified profiles, languages, reviews, and hourly rates.',
                },
                {
                  step: '03',
                  title: 'Meet with verified PIN',
                  desc: 'Track arrival in real time. Verify your unique 4-digit PIN before starting.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-[#EEEEEE]">
                  <span className="text-sm font-bold text-neutral-400 font-mono block mb-2">{item.step}</span>
                  <h3 className="text-lg font-bold text-black mb-1.5">{item.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Featured Companions */}
        <section className="py-16 sm:py-20 bg-white px-4 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
                  Top-rated companions
                </h2>
                <p className="text-sm text-neutral-600 mt-2 font-normal">
                  Background checked and available today.
                </p>
              </div>
              <Link href="/companions" className="mt-4 sm:mt-0">
                <Button variant="outline" size="sm" className="font-medium text-xs gap-1.5 rounded-full border-neutral-300">
                  View all companions <ArrowRight className="h-3.5 w-3.5" />
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

        {/* Section 4: Uber Safety (Pure Black section, reduced text) */}
        <section id="safety" className="py-16 sm:py-20 bg-black text-white px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="max-w-xl mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Our commitment to your safety
              </h2>
              <p className="text-sm text-neutral-400 mt-2 font-normal">
                Built-in safety features designed for every session.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <ShieldCheck className="h-6 w-6 text-white mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">Government ID Verification</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Every companion undergoes background verification and credential checks before accepting sessions.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <Lock className="h-6 w-6 text-white mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">Live GPS Tracking</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Follow companion arrival in real time. Private location broadcast begins only when en route.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <CheckCircle2 className="h-6 w-6 text-white mb-3" />
                <h3 className="text-base font-bold text-white mb-1.5">In-Person PIN Security</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  A unique 4-digit code must be confirmed in person before the booking can begin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Uber Driver / Companion Partner CTA Banner */}
        <section className="py-16 bg-white border-t border-[#EEEEEE] text-black px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
                Make money on your schedule
              </h2>
              <p className="text-sm text-neutral-600 mt-1 font-normal">
                Set your own hourly rates, choose activities you enjoy, and earn with purpose.
              </p>
            </div>
            <Link href="/signup?role=companion">
              <Button size="lg" className="bg-black hover:bg-neutral-800 text-white font-medium px-7 h-12 rounded-full text-sm shrink-0">
                Sign up to accompany
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
