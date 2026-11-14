'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartHandshake, ShieldCheck, ArrowRight, Menu, X, Compass, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white shadow-sm shrink-0">
            <HeartHandshake className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-navy-950">Companion</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 block -mt-1">
              Care & Presence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/companions" className="hover:text-navy-950 transition-colors">
            Find Companions
          </Link>
          <Link href="/#categories" className="hover:text-navy-950 transition-colors">
            Activities
          </Link>
          <Link href="/#how-it-works" className="hover:text-navy-950 transition-colors">
            How it Works
          </Link>
          <Link
            href="/#safety"
            className="flex items-center gap-1 hover:text-navy-950 transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Safety & Verification
          </Link>
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-slate-700">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-navy-900 hover:bg-navy-800 text-white font-medium">
                Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/companions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Search className="h-4 w-4 text-primary-600" />
              <span>Find Companions</span>
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Compass className="h-4 w-4 text-amber-600" />
              <span>Activities & Specializations</span>
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <HeartHandshake className="h-4 w-4 text-emerald-600" />
              <span>How it Works</span>
            </Link>
            <Link
              href="/#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-primary-600" />
              <span>Safety & Biometric Verification</span>
            </Link>
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="outline" className="w-full h-11 font-semibold rounded-xl text-slate-800">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button className="w-full h-11 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl shadow-md">
                Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
