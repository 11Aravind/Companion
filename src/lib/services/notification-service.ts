import { createAdminClient } from '@/lib/supabase/admin';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  body: string;
  type?: 'general' | 'booking' | 'payment' | 'safety';
  data?: Record<string, any>;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase.from('notifications').insert({
      user_id: params.userId,
      title: params.title,
      body: params.body,
      type: params.type || 'general',
      data: params.data || {},
      is_read: false,
    });

    if (error) {
      console.warn('[NotificationService] Failed to create notification:', error.message);
    }

    return data;
  } catch (err: any) {
    console.warn('[NotificationService] Error:', err.message);
    return null;
  }
}

