'use client';

import * as React from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CallStatus } from '@/hooks/useVoiceCall';

export interface VoiceCallModalProps {
  callStatus: CallStatus;
  isIncoming: boolean;
  callerName: string;
  isMuted: boolean;
  durationSeconds: number;
  errorMessage?: string | null;
  onAnswer: () => void;
  onReject: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
}

export function VoiceCallModal({
  callStatus,
  isIncoming,
  callerName,
  isMuted,
  durationSeconds,
  errorMessage,
  onAnswer,
  onReject,
  onEndCall,
  onToggleMute,
}: VoiceCallModalProps) {
  if (callStatus === 'idle') return null;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" />

      {/* Call Dialog */}
      <div className="relative w-full max-w-sm rounded-3xl bg-navy-950 text-white p-8 shadow-2xl border border-navy-800 text-center animate-in fade-in zoom-in-95 z-10 space-y-6">
        {/* Pulsing Avatar / Wave */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full bg-emerald-500/20 ${
              callStatus === 'ringing' || callStatus === 'initiating' ? 'animate-ping' : ''
            }`}
          />
          <div className="relative h-20 w-20 rounded-full bg-navy-900 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg">
            <Phone className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black tracking-tight text-white">
            {callerName || 'Companion Session'}
          </h3>
          <p className="text-xs text-emerald-400 font-semibold mt-1">
            {callStatus === 'initiating' && 'Initiating WebRTC Audio…'}
            {callStatus === 'ringing' && (isIncoming ? 'Incoming Voice Call…' : 'Ringing…')}
            {callStatus === 'connected' && `Call in progress (${formatTimer(durationSeconds)})`}
            {callStatus === 'ended' && 'Call ended'}
            {callStatus === 'rejected' && 'Call declined'}
            {callStatus === 'error' && (errorMessage || 'Connection failed')}
          </p>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Encrypted 1-to-1 WebRTC Voice Session</span>
        </div>

        {/* Call Action Controls */}
        <div className="pt-2 flex items-center justify-center gap-6">
          {/* Incoming Call: Accept / Reject */}
          {isIncoming && callStatus === 'ringing' ? (
            <>
              <button
                onClick={onReject}
                className="h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title="Decline Call"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
              <button
                onClick={onAnswer}
                className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 animate-pulse"
                title="Accept Call"
              >
                <Phone className="h-6 w-6" />
              </button>
            </>
          ) : (
            <>
              {/* Connected Call: Mute & End */}
              {callStatus === 'connected' && (
                <button
                  onClick={onToggleMute}
                  className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                    isMuted ? 'bg-amber-500 text-white' : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}

              {/* End Call Button */}
              {(callStatus === 'initiating' ||
                callStatus === 'ringing' ||
                callStatus === 'connected') && (
                <button
                  onClick={onEndCall}
                  className="h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  title="End Call"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

