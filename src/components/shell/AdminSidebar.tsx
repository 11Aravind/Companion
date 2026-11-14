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
    <div className="w-64 bg-navy-950 text-white min-h-screen flex flex-col justify-between shrink-0 shadow-2xl lg:shadow-none border-r border-navy-800">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
              <HeartHandshake className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">Companion</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block -mt-1">
                Admin Console
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-900 transition-colors"
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-navy-900 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">System Status: Healthy</p>
        <p className="text-[11px] mt-0.5">Realtime & Spatial Ready</p>
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
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
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
