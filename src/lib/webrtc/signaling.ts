import { RealtimeChannel } from '@supabase/supabase-js';

export const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

export type SignalingEvent =
  | { type: 'call_offer'; sdp: RTCSessionDescriptionInit; callerName: string; callerId: string }
  | { type: 'call_answer'; sdp: RTCSessionDescriptionInit }
  | { type: 'ice_candidate'; candidate: RTCIceCandidateInit }
  | { type: 'call_reject' }
  | { type: 'call_end' };

export function sendSignalingMessage(
  channel: RealtimeChannel,
  event: SignalingEvent
) {
  channel.send({
    type: 'broadcast',
    event: 'webrtc_signal',
    payload: event,
  });
}

