'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartHandshake,
  LogOut,
  User,
  LayoutDashboard,
  Calendar,
  CircleDollarSign,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/hooks/useUser';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { CompanionLogo } from '@/components/ui/logo';

interface CompanionHeaderProps {
  isOnline?: boolean;
  onToggleOnline?: (online: boolean) => void;
}

export function CompanionHeader({
  isOnline = false,
  onToggleOnline,
}: CompanionHeaderProps) {
  const pathname = usePathname();
  const { profile, signOut } = useUser();
  const [onlineState, setOnlineState] = React.useState(isOnline);

  const toggle = () => {
    const next = !onlineState;
    setOnlineState(next);
    onToggleOnline?.(next);
  };

  const isNavActive = (href: string) => {
    if (href === '/companion/dashboard') return pathname === '/companion/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-charcoal-border bg-white/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Brand & Companion Portal Tag */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/companion/dashboard" className="flex items-center shrink-0">
              <CompanionLogo variant="light" size="sm" />
            </Link>
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex bg-navy-50 text-navy-900 font-bold text-xs border border-charcoal-border"
            >
              Partner Portal
            </Badge>
          </div>

          {/* Online / Offline Switch & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggle}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-subtle border ${
                onlineState
                  ? 'bg-accent-light text-accent border-accent/30 ring-2 ring-accent/20'
                  : 'bg-navy-50 text-charcoal-muted border-charcoal-border'
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  onlineState ? 'bg-accent animate-pulse' : 'bg-charcoal-muted'
                }`}
              />
              <span>{onlineState ? 'Available Now' : 'Offline'}</span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/companion/dashboard">
                <Button
                  variant={pathname === '/companion/dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Requests
                </Button>
              </Link>
              <Link href="/companion/availability">
                <Button
                  variant={pathname.startsWith('/companion/availability') ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Availability
                </Button>
              </Link>
              <Link href="/companion/earnings">
                <Button
                  variant={pathname.startsWith('/companion/earnings') ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Earnings
                </Button>
              </Link>
              <Link href="/companion/verification">
                <Button
                  variant={pathname.startsWith('/companion/verification') ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Verification
                </Button>
              </Link>
              <Link href="/companion/profile">
                <Button
                  variant={pathname.startsWith('/companion/profile') ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs sm:text-sm font-semibold"
                >
                  <User className="h-4 w-4 mr-1" />
                  <span>Profile</span>
                </Button>
              </Link>
            </nav>

            {/* Notification Bell */}
            <NotificationBell />

            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-2 text-charcoal-muted hover:text-rose-600 rounded-xl hover:bg-navy-50 transition-colors ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-charcoal-border px-2 py-1.5 flex items-center justify-around shadow-floating safe-area-inset-bottom">
        <Link
          href="/companion/dashboard"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isNavActive('/companion/dashboard')
              ? 'text-navy-900 font-bold'
              : 'text-charcoal-muted hover:text-navy-900 font-semibold'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Requests</span>
        </Link>

        <Link
          href="/companion/availability"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isNavActive('/companion/availability')
              ? 'text-navy-900 font-bold'
              : 'text-charcoal-muted hover:text-navy-900 font-semibold'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Schedule</span>
        </Link>

        <Link
          href="/companion/earnings"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isNavActive('/companion/earnings')
              ? 'text-navy-900 font-bold'
              : 'text-charcoal-muted hover:text-navy-900 font-semibold'
          }`}
        >
          <CircleDollarSign className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Earnings</span>
        </Link>

        <Link
          href="/companion/verification"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isNavActive('/companion/verification')
              ? 'text-navy-900 font-bold'
              : 'text-charcoal-muted hover:text-navy-900 font-semibold'
          }`}
        >
          <ShieldCheck className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">ID Check</span>
        </Link>

        <Link
          href="/companion/profile"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isNavActive('/companion/profile')
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
