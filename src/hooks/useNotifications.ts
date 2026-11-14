'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications(userId?: string) {
  const [supabase] = React.useState(() => createClient());
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // 1. Fetch initial notification history
  React.useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (data && !error) {
          const items: NotificationItem[] = data.map((n) => ({
            id: n.id,
            userId: n.user_id,
            title: n.title,
            body: n.body,
            type: n.type,
            data: n.data as Record<string, any>,
            isRead: n.is_read,
            createdAt: n.created_at,
          }));
          setNotifications(items);
          setUnreadCount(items.filter((i) => !i.isRead).length);
        }
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, supabase]);

  // 2. Subscribe to Real-Time INSERT / UPDATE
  React.useEffect(() => {
    if (!userId) return undefined;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newItem = payload.new as any;
          const formatted: NotificationItem = {
            id: newItem.id,
            userId: newItem.user_id,
            title: newItem.title,
            body: newItem.body,
            type: newItem.type,
            data: newItem.data,
            isRead: newItem.is_read,
            createdAt: newItem.created_at,
          };
          setNotifications((prev) => [formatted, ...prev]);
          setUnreadCount((c) => c + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // Mark single as read
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!userId) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
}

