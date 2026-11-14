'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from '@/components/shell/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F8FA] text-charcoal">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-charcoal-border px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile admin navigation */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Admin Menu"
              className="lg:hidden p-2 rounded-xl text-charcoal hover:bg-navy-50 border border-charcoal-border transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xs sm:text-sm font-bold text-navy-900 uppercase tracking-wider truncate">
              Operations & Platform Governance
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-[11px] sm:text-xs bg-yellow-100 text-yellow-900 border border-yellow-300 font-bold px-3 py-1 rounded-full">
              Production System
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
