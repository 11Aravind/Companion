'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartHandshake, ShieldCheck, ArrowRight, Menu, X, Compass, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompanionLogo } from '@/components/ui/logo';

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-black text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center">
          <CompanionLogo variant="dark" size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
          <Link href="/companions" className="hover:text-white transition-colors">
            Find Companions
          </Link>
          <Link href="/#categories" className="hover:text-white transition-colors">
            Activities
          </Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How it Works
          </Link>
          <Link
            href="/#safety"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-white" />
            Safety
          </Link>
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium text-white hover:bg-neutral-900 hover:text-white text-sm rounded-full">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-white hover:bg-neutral-200 text-black font-medium px-4 py-2 rounded-full text-sm">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-neutral-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-black text-white px-4 pt-3 pb-6 shadow-floating animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/companions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-neutral-900 transition-colors"
            >
              <Search className="h-4 w-4 text-white" />
              <span>Find Companions</span>
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-neutral-900 transition-colors"
            >
              <Compass className="h-4 w-4 text-neutral-400" />
              <span>Activities</span>
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-neutral-900 transition-colors"
            >
              <HeartHandshake className="h-4 w-4 text-neutral-400" />
              <span>How it Works</span>
            </Link>
            <Link
              href="/#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-neutral-900 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-white" />
              <span>Safety</span>
            </Link>
          </nav>

          <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="outline" className="w-full h-11 font-medium rounded-full text-white border-neutral-700 bg-transparent hover:bg-neutral-900">
                Log in
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button className="w-full h-11 bg-white hover:bg-neutral-200 text-black font-medium rounded-full">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
