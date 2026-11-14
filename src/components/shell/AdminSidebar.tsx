'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldAlert,
  Calendar,
  Layers,
  CircleDollarSign,
  Star,
  HeartHandshake,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Companions', href: '/admin/companions', icon: UserCheck },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'ID Verifications', href: '/admin/verifications', icon: ShieldAlert },
  { label: 'Bookings & Sessions', href: '/admin/bookings', icon: Calendar },
  { label: 'Activity Categories', href: '/admin/categories', icon: Layers },
  { label: 'Pricing & Commissions', href: '/admin/pricing', icon: CircleDollarSign },
  { label: 'Reviews & Safety', href: '/admin/reviews', icon: Star },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="w-64 bg-[#14213D] text-white min-h-screen flex flex-col justify-between shrink-0 shadow-floating lg:shadow-none border-r border-[#1B2C4F]">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1B2C4F]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white shadow-subtle border border-white/10">
              <HeartHandshake className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">Companion</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 block -mt-1">
                Admin Console
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-white/12 text-white shadow-subtle border border-white/15'
                    : 'text-[#A9B4C7] hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-yellow-400' : 'text-[#A9B4C7]')} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-yellow-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#1B2C4F] text-xs text-[#A9B4C7]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          <p className="font-semibold text-white">System Status: Optimal</p>
        </div>
        <p className="text-[11px] mt-0.5 text-[#737B89]">Realtime & GPS Telemetry Active</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex min-h-screen shrink-0">{content}</aside>

      {/* Mobile / Tablet Slide-over Drawer with Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
