'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { RTC_CONFIG, SignalingEvent, sendSignalingMessage } from '@/lib/webrtc/signaling';
import { RealtimeChannel } from '@supabase/supabase-js';

export type CallStatus =
  | 'idle'
  | 'initiating'
  | 'ringing'
  | 'connected'
  | 'ended'
  | 'rejected'
  | 'error';

export function useVoiceCall({
  bookingId,
  currentUserId,
  currentUserName,
  recipientId,
}: {
  bookingId?: string;
  currentUserId?: string;
  currentUserName?: string;
  recipientId?: string;
}) {
  const [supabase] = React.useState(() => createClient());
  const [callStatus, setCallStatus] = React.useState<CallStatus>('idle');
  const [isIncoming, setIsIncoming] = React.useState(false);
  const [callerName, setCallerName] = React.useState<string>('');
  const [isMuted, setIsMuted] = React.useState(false);
  const [durationSeconds, setDurationSeconds] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const peerConnectionRef = React.useRef<RTCPeerConnection | null>(null);
  const localStreamRef = React.useRef<MediaStream | null>(null);
  const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const channelRef = React.useRef<RealtimeChannel | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Setup Remote Audio Element in Browser
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !remoteAudioRef.current) {
      const audio = document.createElement('audio');
      audio.autoplay = true;
      remoteAudioRef.current = audio;
    }
    return () => {
      remoteAudioRef.current?.remove();
    };
  }, []);

  // Duration Timer
  React.useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setDurationSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (callStatus === 'idle') setDurationSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  // Clean up streams and peer connection
  const cleanupMediaAndPeer = React.useCallback(() => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    setIsIncoming(false);
    setIsMuted(false);
  }, []);

  // Initialize Peer Connection
  const initPeerConnection = React.useCallback(
    (channel: RealtimeChannel) => {
      const pc = new RTCPeerConnection(RTC_CONFIG);

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignalingMessage(channel, {
            type: 'ice_candidate',
            candidate: event.candidate.toJSON(),
          });
        }
      };

      // Handle Remote Audio Stream
      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
          remoteAudioRef.current.play().catch((e) => console.warn('Audio play error:', e));
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setCallStatus('connected');
        } else if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          setCallStatus('ended');
          cleanupMediaAndPeer();
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    },
    [cleanupMediaAndPeer]
  );

  // Setup Supabase Realtime Signaling Channel
  React.useEffect(() => {
    if (!bookingId) return undefined;

    const channel = supabase.channel(`call:${bookingId}`, {
      config: { broadcast: { self: false } },
    });

    channel.on('broadcast', { event: 'webrtc_signal' }, async ({ payload }) => {
      const signal = payload as SignalingEvent;

      try {
        if (signal.type === 'call_offer') {
          // Incoming Call
          setCallerName(signal.callerName || 'Companion');
          setIsIncoming(true);
          setCallStatus('ringing');

          const pc = initPeerConnection(channel);
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        } else if (signal.type === 'call_answer') {
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(signal.sdp)
            );
            setCallStatus('connected');
          }
        } else if (signal.type === 'ice_candidate') {
          if (peerConnectionRef.current && signal.candidate) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
          }
        } else if (signal.type === 'call_reject') {
          setCallStatus('rejected');
          cleanupMediaAndPeer();
          setTimeout(() => setCallStatus('idle'), 2500);
        } else if (signal.type === 'call_end') {
          setCallStatus('ended');
          cleanupMediaAndPeer();
          setTimeout(() => setCallStatus('idle'), 2000);
        }
      } catch (err: any) {
        console.error('[WebRTC Signaling] Handling error:', err);
        setErrorMessage(err.message || 'Call connection failed');
      }
    });

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      cleanupMediaAndPeer();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [bookingId, supabase, initPeerConnection, cleanupMediaAndPeer]);

  // ACTION: Initiate Outgoing Call
  const startCall = async () => {
    if (!channelRef.current || !bookingId) return;

    try {
      setErrorMessage(null);
      setCallStatus('initiating');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      const pc = initPeerConnection(channelRef.current);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendSignalingMessage(channelRef.current, {
        type: 'call_offer',
        sdp: offer,
        callerName: currentUserName || 'Client',
        callerId: currentUserId || '',
      });

      setCallStatus('ringing');

      // Record call session in Supabase
      if (currentUserId && recipientId) {
        await supabase.from('call_sessions').insert({
          booking_id: bookingId,
          caller_id: currentUserId,
          receiver_id: recipientId,
          status: 'ringing',
        });
      }
    } catch (err: any) {
      console.error('[WebRTC] Start call error:', err);
      setErrorMessage(err.name === 'NotAllowedError' ? 'Microphone permission denied' : 'Call failed');
      setCallStatus('error');
      cleanupMediaAndPeer();
      setTimeout(() => setCallStatus('idle'), 3000);
    }
  };

  // ACTION: Answer Incoming Call
  const answerCall = async () => {
    if (!channelRef.current || !peerConnectionRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
      });

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      sendSignalingMessage(channelRef.current, {
        type: 'call_answer',
        sdp: answer,
      });

      setIsIncoming(false);
      setCallStatus('connected');
    } catch (err: any) {
      console.error('[WebRTC] Answer call error:', err);
      rejectCall();
    }
  };

  // ACTION: Reject Call
  const rejectCall = () => {
    if (channelRef.current) {
      sendSignalingMessage(channelRef.current, { type: 'call_reject' });
    }
    setCallStatus('rejected');
    cleanupMediaAndPeer();
    setTimeout(() => setCallStatus('idle'), 1500);
  };

  // ACTION: End Call (Hang Up)
  const endCall = () => {
    if (channelRef.current) {
      sendSignalingMessage(channelRef.current, { type: 'call_end' });
    }
    setCallStatus('ended');
    cleanupMediaAndPeer();
    setTimeout(() => setCallStatus('idle'), 1500);
  };

  // ACTION: Mute/Unmute Mic
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  return {
    callStatus,
    isIncoming,
    callerName,
    isMuted,
    durationSeconds,
    errorMessage,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
  };
}

