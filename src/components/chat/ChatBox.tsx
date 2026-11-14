'use client';

import * as React from 'react';
import { Send, X, MessageCircle, Phone, Check, CheckCheck } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ChatBoxProps {
  bookingId: string;
  counterpartName: string;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onStartVoiceCall?: () => void;
}

export function ChatBox({
  bookingId,
  counterpartName,
  currentUserId,
  isOpen,
  onClose,
  onStartVoiceCall,
}: ChatBoxProps) {
  const { messages, isLoading, sendMessage } = useChat({
    bookingId,
    currentUserId,
  });

  const [inputText, setInputText] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div
      className="fixed bottom-2 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 z-50 sm:w-96 max-h-[85vh] rounded-3xl bg-white shadow-floating border border-charcoal-border overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6"
      style={{ height: '480px' }}
      role="dialog"
      aria-label="In-session Chat"
    >
      {/* Header */}
      <div className="p-4 border-b border-charcoal-border bg-[#14213D] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs border border-accent/30">
            {counterpartName.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">{counterpartName}</h4>
            <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> In-Session Coordination
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onStartVoiceCall && (
            <button
              onClick={onStartVoiceCall}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Start Voice Call"
            >
              <Phone className="h-4 w-4 text-accent" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Message History List */}
      <div ref={listRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F7F8FA]">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-12 text-charcoal-muted text-xs space-y-1">
            <MessageCircle className="h-6 w-6 mx-auto text-charcoal-muted" />
            <p className="font-bold text-navy-900">Coordinate meeting safely</p>
            <p className="text-[11px] text-charcoal-muted">Messages are private to this companion session.</p>
          </div>
        )}

        {messages.map((m) => {
          const isMine = m.senderId === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-subtle ${
                  isMine
                    ? 'bg-navy-900 text-white rounded-br-xs'
                    : 'bg-white text-charcoal border border-charcoal-border rounded-bl-xs'
                }`}
              >
                {m.messageText}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-charcoal-muted px-1">
                <span>{formatTime(m.createdAt)}</span>
                {isMine && (
                  <span>
                    {m.isRead ? (
                      <CheckCheck className="h-3 w-3 text-accent" />
                    ) : (
                      <Check className="h-3 w-3 text-charcoal-muted" />
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-charcoal-border flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message to coordinate..."
          maxLength={500}
          className="flex-1 h-10 rounded-xl border border-charcoal-border bg-[#F7F8FA] px-3.5 text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white transition-all shadow-subtle"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="h-10 w-10 rounded-xl bg-navy-900 hover:bg-navy-800 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity shadow-subtle"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
