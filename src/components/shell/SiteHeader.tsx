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
    <header className="sticky top-0 z-40 w-full border-b border-charcoal-border bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white shadow-subtle shrink-0">
            <HeartHandshake className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-navy-900">Companion</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block -mt-1">
              Mobility & Care
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-charcoal-muted">
          <Link href="/companions" className="hover:text-navy-900 transition-colors">
            Find Companions
          </Link>
          <Link href="/#categories" className="hover:text-navy-900 transition-colors">
            Activities
          </Link>
          <Link href="/#how-it-works" className="hover:text-navy-900 transition-colors">
            How it Works
          </Link>
          <Link
            href="/#safety"
            className="flex items-center gap-1.5 hover:text-navy-900 transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-amber-500 fill-amber-400/20" />
            Safety & Verification
          </Link>
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-charcoal hover:text-navy-900 text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow-sm">
                Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-charcoal hover:bg-navy-50 transition-colors border border-charcoal-border"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-charcoal-border bg-white px-4 pt-3 pb-6 shadow-floating animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/companions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal hover:bg-navy-50 transition-colors"
            >
              <Search className="h-4 w-4 text-navy-900" />
              <span>Find Companions</span>
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal hover:bg-navy-50 transition-colors"
            >
              <Compass className="h-4 w-4 text-charcoal-muted" />
              <span>Activities & Specializations</span>
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal hover:bg-navy-50 transition-colors"
            >
              <HeartHandshake className="h-4 w-4 text-accent" />
              <span>How it Works</span>
            </Link>
            <Link
              href="/#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-charcoal hover:bg-navy-50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Safety & Biometric Verification</span>
            </Link>
          </nav>

          <div className="mt-5 pt-4 border-t border-charcoal-border flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="outline" className="w-full h-11 font-semibold rounded-xl text-charcoal">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button className="w-full h-11 bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-bold rounded-xl shadow-subtle">
                Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
