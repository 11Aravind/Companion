'use client';

import * as React from 'react';
import { Bell, CheckCheck, Calendar, ShieldCheck, DollarSign, Info } from 'lucide-react';
import { useNotifications, NotificationItem } from '@/hooks/useNotifications';
import { useUser } from '@/hooks/useUser';
import { formatTime, formatDate } from '@/lib/utils';

export function NotificationBell() {
  const { user } = useUser();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4 text-navy-900" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-accent" />;
      case 'safety':
        return <ShieldCheck className="h-4 w-4 text-accent" />;
      default:
        return <Info className="h-4 w-4 text-[#2583E8]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-charcoal hover:text-navy-900 hover:bg-navy-50 transition-colors"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-white shadow-subtle animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white shadow-floating border border-charcoal-border overflow-hidden z-50 animate-in fade-in zoom-in-95">
          <div className="p-3.5 border-b border-charcoal-border flex items-center justify-between bg-[#F7F8FA]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded-full border border-accent/20">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-[11px] font-bold text-navy-900 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-charcoal-border text-xs">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-charcoal-muted">
                <Bell className="h-6 w-6 mx-auto text-charcoal-muted mb-1 opacity-60" />
                <p className="font-bold text-navy-900">No notifications yet</p>
                <p className="text-[11px] text-charcoal-muted">Updates about your bookings will appear here.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && markAsRead(item.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                    item.isRead ? 'bg-white hover:bg-navy-50' : 'bg-navy-50/70 hover:bg-navy-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-charcoal-border shrink-0 shadow-subtle">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-bold text-navy-900 text-xs truncate">{item.title}</h5>
                      <span className="text-[10px] text-charcoal-muted shrink-0">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-charcoal-muted text-[11px] mt-0.5 line-clamp-2 leading-tight">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
