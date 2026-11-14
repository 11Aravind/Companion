'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  messageText: string;
  createdAt: string;
  isRead: boolean;
}

export function useChat({
  bookingId,
  conversationId,
  currentUserId,
}: {
  bookingId?: string;
  conversationId?: string;
  currentUserId?: string;
}) {
  const [supabase] = React.useState(() => createClient());
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeConvId, setActiveConvId] = React.useState<string | null>(conversationId || null);

  // 1. Resolve conversationId if only bookingId is passed
  React.useEffect(() => {
    if (activeConvId || !bookingId) return;

    supabase
      .from('conversations')
      .select('id')
      .eq('booking_id', bookingId)
      .single()
      .then(({ data }) => {
        if (data) setActiveConvId(data.id);
      });
  }, [bookingId, activeConvId, supabase]);

  // 2. Fetch initial messages
  React.useEffect(() => {
    if (!activeConvId) return;

    let isMounted = true;

    supabase
      .from('messages')
      .select('id, conversation_id, sender_id, message_text, is_read, created_at')
      .eq('conversation_id', activeConvId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (data && !error) {
          setMessages(
            data.map((m) => ({
              id: m.id,
              conversationId: m.conversation_id,
              senderId: m.sender_id,
              messageText: m.message_text,
              createdAt: m.created_at,
              isRead: m.is_read,
            }))
          );
        }
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeConvId, supabase]);

  // 3. Subscribe to Real-Time INSERT events
  React.useEffect(() => {
    if (!activeConvId) return undefined;

    const channel = supabase
      .channel(`chat:${activeConvId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConvId}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              conversationId: newMsg.conversation_id,
              senderId: newMsg.sender_id,
              messageText: newMsg.message_text,
              createdAt: newMsg.created_at,
              isRead: newMsg.is_read,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConvId, supabase]);

  // 4. Send Message Action
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !activeConvId || !currentUserId) return;

    const tempId = Date.now().toString();
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversationId: activeConvId,
      senderId: currentUserId,
      messageText: trimmed,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // Optimistic update
    setMessages((prev) => [...prev, optimisticMsg]);

    const { error } = await supabase.from('messages').insert({
      conversation_id: activeConvId,
      sender_id: currentUserId,
      message_text: trimmed,
      message_type: 'text',
      is_read: false,
    });

    if (error) {
      console.error('Failed to send message:', error);
      // Rollback on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    conversationId: activeConvId,
  };
}

