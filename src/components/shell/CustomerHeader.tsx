'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartHandshake,
  MapPin,
  Calendar,
  User,
  Search,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { CompanionLogo } from '@/components/ui/logo';

interface CustomerHeaderProps {
  userAddress?: string;
}

export function CustomerHeader({
  userAddress = 'Greams Road, Thousand Lights, Chennai',
}: CustomerHeaderProps) {
  const pathname = usePathname();
  const { profile, signOut } = useUser();

  const isNavActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-charcoal-border bg-white/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Brand & Location Detector */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link href="/" className="flex items-center shrink-0" title="Go to Home">
              <CompanionLogo variant="light" size="sm" />
            </Link>

            {/* Current Location Pill (Uber style) */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 text-[11px] sm:text-xs font-semibold text-charcoal max-w-[160px] sm:max-w-xs truncate border border-charcoal-border">
              <MapPin className="h-3.5 w-3.5 text-[#2583E8] shrink-0" />
              <span className="truncate">{userAddress}</span>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/companions" className="hidden md:inline-flex">
              <Button
                variant={pathname.startsWith('/companions') ? 'default' : 'ghost'}
                size="sm"
                className="gap-1.5 text-xs sm:text-sm font-semibold"
              >
                <Search className="h-4 w-4" />
                <span>Browse Companions</span>
              </Button>
            </Link>

            <Link href="/bookings" className="hidden md:inline-flex">
              <Button
                variant={pathname.startsWith('/bookings') ? 'default' : 'ghost'}
                size="sm"
                className="gap-1.5 text-xs sm:text-sm font-semibold"
              >
                <Calendar className="h-4 w-4" />
                <span>Bookings</span>
              </Button>
            </Link>

            {/* Notification Bell */}
            <NotificationBell />

            <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-charcoal-border ml-1">
              <Link href="/profile" className="hidden sm:inline-flex">
                <Button
                  variant={pathname.startsWith('/profile') ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1.5 text-xs sm:text-sm font-semibold"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {profile?.fullName?.split(' ')[0] || 'Profile'}
                  </span>
                </Button>
              </Link>

              <button
                onClick={() => signOut()}
                title="Sign Out"
                className="p-2 text-charcoal-muted hover:text-rose-600 rounded-xl hover:bg-navy-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (Uber/Airbnb native mobile feel) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-charcoal-border px-2 py-1.5 flex items-center justify-around shadow-floating safe-area-inset-bottom">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isNavActive('/dashboard')
              ? 'text-navy-900 font-bold'
              : 'text-charcoal-muted hover:text-navy-900 font-semibold'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </Link>

        <Link
          href="/companions"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isNavActive('/companions')
              ? 'text-navy-900 font-bold'
              : 'text-charcoal-muted hover:text-navy-900 font-semibold'
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Companions</span>
        </Link>

        <Link
          href="/bookings"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isNavActive('/bookings')
              ? 'text-navy-900 font-bold'
              : 'text-charcoal-muted hover:text-navy-900 font-semibold'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Bookings</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isNavActive('/profile')
              ? 'text-navy-900 font-bold'
              : 'text-charcoal-muted hover:text-navy-900 font-semibold'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </Link>
      </nav>
    </>
  );
}
